import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { destinosApi } from '../../api/destinos.api'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface Destino { id: string; nombre: string; descripcion?: string; estado: string; sedeId: string; sede?: { id: string; nombre: string } }
interface Sede { id: string; nombre: string }

interface DesForm { nombre: string; descripcion: string; estado: 'ACTIVO' | 'INACTIVO'; sedeId: string }
const defaultForm: DesForm = { nombre: '', descripcion: '', estado: 'ACTIVO', sedeId: '' }

export default function Destinos() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Destino[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Destino | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState<DesForm>(defaultForm)
  const isCreateOrEdit = modal === 'create' || modal === 'edit'

  const fetchItems = useCallback(async () => {
    try {
      const res = await destinosApi.list()
      setItems(res.data.data)
    } catch { toast.error(t('common.error')) }
    finally { setLoading(false) }
  }, [t])

  useEffect(() => {
    fetchItems()
    api.get('/sedes/all').then((r) => setSedes(r.data.data)).catch(() => {})
  }, [fetchItems])

  useEffect(() => {
    if (modal === 'edit' && selected)
      setForm({ nombre: selected.nombre, descripcion: selected.descripcion ?? '',
        estado: selected.estado as 'ACTIVO' | 'INACTIVO', sedeId: selected.sedeId })
    else if (modal === 'create') setForm(defaultForm)
  }, [modal, selected])

  const set = (f: keyof DesForm, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.sedeId) { toast.error(t('errors.required')); return }
    try {
      if (modal === 'create') { await destinosApi.create(form); toast.success(t('success.saved')) }
      else if (selected) { await destinosApi.update(selected.id, form); toast.success(t('success.updated')) }
      setModal(null); fetchItems()
    } catch { toast.error(t('common.error')) }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await destinosApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false); setSelected(null); fetchItems()
    } catch { toast.error(t('common.error')) }
  }

  const filtered = items.filter((d) =>
    `${d.nombre} ${d.sede?.nombre ?? ''}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6">
      <PageHeader title={t('modules.destinations.title')}
        breadcrumbs={[{ label: t('modules.destinations.title') }, { label: t('modules.destinations.title') }]} />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input type="text" className="form-input w-64" placeholder={t('common.search') + '...'}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-primary" onClick={() => { setSelected(null); setModal('create') }}>{t('modules.destinations.add')}</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              {[t('common.name'), t('common.description'), t('common.headquarter'), t('common.status'), t('common.actions')].map((h) => (
                <th key={h} className="text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.loading')}</td></tr>
            )}
            {!loading && filtered.map((d) => (
              <tr key={d.id}>
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{d.nombre}</td>
                <td className="text-sm text-gray-500 dark:text-gray-400">{d.descripcion || '—'}</td>
                <td className="text-sm text-gray-700 dark:text-gray-300">{d.sede?.nombre ?? '—'}</td>
                <td className="text-sm"><StatusBadge active={d.estado === 'ACTIVO'} /></td>
                <td>
                  <ActionButtons onView={() => { setSelected(d); setModal('view') }} onEdit={() => { setSelected(d); setModal('edit') }} onDelete={() => { setSelected(d); setConfirm(true) }} />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.noResults')}</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOrEdit} onClose={() => setModal(null)}
        title={modal === 'create' ? t('modules.destinations.new') : t('modules.destinations.edit')}
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button><button className="btn-primary" form="des-form">{t('common.save')}</button></>}>
        <form id="des-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">{t('common.name')} <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.headquarter')} <span className="text-red-500">*</span></label>
            <select className="form-select" value={form.sedeId} onChange={(e) => set('sedeId', e.target.value)}>
              <option value="">{t('common.selectOption')}</option>
              {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t('common.description')}</label>
            <textarea className="form-textarea" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.status')}</label>
            <select className="form-select" value={form.estado} onChange={(e) => set('estado', e.target.value as 'ACTIVO' | 'INACTIVO')}>
              <option value="ACTIVO">{t('common.active')}</option>
              <option value="INACTIVO">{t('common.inactive')}</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={t('modules.destinations.detail')}>
        {selected && (
          <div className="space-y-3 text-sm">
            {([[t('common.name'), selected.nombre], [t('common.headquarter'), selected.sede?.nombre ?? '—'],
               [t('common.description'), selected.descripcion || '—']] as [string, string][]).map(([l, v]) => (
              <div key={l}><p className="text-xs text-gray-400 uppercase">{l}</p><p className="mt-0.5">{v}</p></div>
            ))}
            <div><p className="text-xs text-gray-400 uppercase">{t('common.status')}</p><div className="mt-0.5"><StatusBadge active={selected.estado === 'ACTIVO'} /></div></div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirm} onClose={() => setConfirm(false)}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: selected?.nombre ?? '' })} />
    </div>
  )
}
