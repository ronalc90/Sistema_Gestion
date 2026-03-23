import { useState, useEffect, useCallback } from 'react'
import { contratistasApi } from '../../api/contratistas.api'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface Contratista { id: string; nombre: string; nit?: string; representante?: string; telefono?: string; email?: string; direccion?: string; estado: string }
interface ConForm { nombre: string; nit: string; representante: string; telefono: string; email: string; direccion: string; estado: 'ACTIVO' | 'INACTIVO' }
const defaultForm: ConForm = { nombre: '', nit: '', representante: '', telefono: '', email: '', direccion: '', estado: 'ACTIVO' }

export default function Contratistas() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Contratista[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Contratista | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState<ConForm>(defaultForm)
  const isCreateOrEdit = modal === 'create' || modal === 'edit'

  const fetchItems = useCallback(async () => {
    try {
      const res = await contratistasApi.list()
      setItems(res.data.data)
    } catch { toast.error(t('common.error')) }
    finally { setLoading(false) }
  }, [t])
  useEffect(() => { fetchItems() }, [fetchItems])

  useEffect(() => {
    if (modal === 'edit' && selected)
      setForm({ nombre: selected.nombre, nit: selected.nit ?? '', representante: selected.representante ?? '',
        telefono: selected.telefono ?? '', email: selected.email ?? '', direccion: selected.direccion ?? '', estado: selected.estado as 'ACTIVO' | 'INACTIVO' })
    else if (modal === 'create') setForm(defaultForm)
  }, [modal, selected])

  const set = (f: keyof ConForm, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.nit.trim()) { toast.error(t('errors.required')); return }
    try {
      if (modal === 'create') { await contratistasApi.create(form); toast.success(t('success.saved')) }
      else if (selected) { await contratistasApi.update(selected.id, form); toast.success(t('success.updated')) }
      setModal(null); fetchItems()
    } catch { toast.error(t('common.error')) }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await contratistasApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false); setSelected(null); fetchItems()
    } catch { toast.error(t('common.error')) }
  }

  const filtered = items.filter((c) =>
    `${c.nombre} ${c.nit ?? ''} ${c.representante ?? ''}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6">
      <PageHeader title={t('modules.contractors.title')}
        breadcrumbs={[{ label: t('modules.contractors.title') }, { label: t('modules.contractors.title') }]} />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input type="text" className="form-input w-64" placeholder={t('common.search') + '...'}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-primary" onClick={() => { setSelected(null); setModal('create') }}>{t('modules.contractors.add')}</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              {[t('common.name'), t('modules.contractors.nit'), t('modules.contractors.representative'), t('common.phone'), t('common.email'), t('common.status'), t('common.actions')].map((h) => (
                <th key={h} className="text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.loading')}</td></tr>}
            {!loading && filtered.map((c) => (
              <tr key={c.id}>
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{c.nombre}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400 font-mono">{c.nit ?? '—'}</td>
                <td className="text-sm text-gray-700 dark:text-gray-300">{c.representante ?? '—'}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{c.telefono ?? '—'}</td>
                <td className="text-sm text-gray-500 dark:text-gray-400">{c.email ?? '—'}</td>
                <td className="text-sm"><StatusBadge active={c.estado === 'ACTIVO'} /></td>
                <td>
                  <ActionButtons onView={() => { setSelected(c); setModal('view') }} onEdit={() => { setSelected(c); setModal('edit') }} onDelete={() => { setSelected(c); setConfirm(true) }} />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.noResults')}</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOrEdit} onClose={() => setModal(null)}
        title={modal === 'create' ? t('modules.contractors.new') : t('modules.contractors.edit')} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button><button className="btn-primary" form="con-form">{t('common.save')}</button></>}>
        <form id="con-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="form-label">{t('common.name')} <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('modules.contractors.nit')} <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.nit} onChange={(e) => set('nit', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('modules.contractors.representative')}</label>
            <input className="form-input" value={form.representante} onChange={(e) => set('representante', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.phone')}</label>
            <input className="form-input" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.email')}</label>
            <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="form-label">{t('common.address')}</label>
            <input className="form-input" value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.status')}</label>
            <select className="form-select" value={form.estado} onChange={(e) => set('estado', e.target.value)}>
              <option value="ACTIVO">{t('common.active')}</option>
              <option value="INACTIVO">{t('common.inactive')}</option>
            </select>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={t('modules.contractors.detail')}>
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {([[t('common.name'), selected.nombre], [t('modules.contractors.nit'), selected.nit ?? '—'],
               [t('modules.contractors.representative'), selected.representante ?? '—'], [t('common.phone'), selected.telefono ?? '—'],
               [t('common.email'), selected.email ?? '—'], [t('common.address'), selected.direccion ?? '—']] as [string, string][]).map(([l, v]) => (
              <div key={l}><p className="text-xs text-gray-400 uppercase">{l}</p><p className="mt-0.5">{v || '—'}</p></div>
            ))}
            <div><p className="text-xs text-gray-400 uppercase">{t('common.status')}</p><div className="mt-0.5"><StatusBadge active={selected.estado === 'ACTIVO'} /></div></div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirm} onClose={() => { setConfirm(false); setSelected(null) }}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: selected?.nombre ?? '' })} />
    </div>
  )
}
