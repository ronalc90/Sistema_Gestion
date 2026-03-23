import { useState, useEffect, useCallback } from 'react'
import { centrosCostoApi } from '../../api/centrosCosto.api'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface CentroCosto { id: string; codigo: string; nombre: string; descripcion?: string; presupuesto?: number; activo: boolean }
interface CCForm { codigo: string; nombre: string; descripcion: string; presupuesto: string; activo: boolean }
const defaultForm: CCForm = { codigo: '', nombre: '', descripcion: '', presupuesto: '', activo: true }

export default function CentrosCostos() {
  const { t } = useTranslation()
  const [items, setItems] = useState<CentroCosto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CentroCosto | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState<CCForm>(defaultForm)
  const isCreateOrEdit = modal === 'create' || modal === 'edit'

  const fetchItems = useCallback(async () => {
    try {
      const res = await centrosCostoApi.list()
      setItems(res.data.data)
    } catch { toast.error(t('common.error')) }
    finally { setLoading(false) }
  }, [t])
  useEffect(() => { fetchItems() }, [fetchItems])

  useEffect(() => {
    if (modal === 'edit' && selected)
      setForm({ codigo: selected.codigo, nombre: selected.nombre,
        descripcion: selected.descripcion ?? '', presupuesto: String(selected.presupuesto ?? ''), activo: selected.activo })
    else if (modal === 'create') setForm(defaultForm)
  }, [modal, selected])

  const set = (f: keyof CCForm, v: string | boolean) => setForm((p) => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.codigo.trim() || !form.nombre.trim()) { toast.error(t('errors.required')); return }
    const payload = { ...form, presupuesto: form.presupuesto ? Number(form.presupuesto) : undefined }
    try {
      if (modal === 'create') { await centrosCostoApi.create(payload); toast.success(t('success.saved')) }
      else if (selected) { await centrosCostoApi.update(selected.id, payload); toast.success(t('success.updated')) }
      setModal(null); fetchItems()
    } catch { toast.error(t('common.error')) }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await centrosCostoApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false); setSelected(null); fetchItems()
    } catch { toast.error(t('common.error')) }
  }

  const filtered = items.filter((c) =>
    `${c.codigo} ${c.nombre}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6">
      <PageHeader title={t('modules.costCenters.title')}
        breadcrumbs={[{ label: t('modules.costCenters.title') }, { label: t('modules.costCenters.title') }]} />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input type="text" className="form-input w-64" placeholder={t('common.search') + '...'}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-primary" onClick={() => { setSelected(null); setModal('create') }}>{t('modules.costCenters.add')}</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              {[t('common.code'), t('common.name'), t('common.description'), t('modules.costCenters.budget'), t('common.status'), t('common.actions')].map((h) => (
                <th key={h} className="text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.loading')}</td></tr>}
            {!loading && filtered.map((c) => (
              <tr key={c.id}>
                <td className="text-sm text-gray-700 dark:text-gray-300 font-mono">{c.codigo}</td>
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{c.nombre}</td>
                <td className="text-sm text-gray-500 dark:text-gray-400">{c.descripcion || '—'}</td>
                <td className="text-sm text-gray-700 dark:text-gray-300">{c.presupuesto ? `$${c.presupuesto.toLocaleString()}` : '—'}</td>
                <td className="text-sm"><StatusBadge active={c.activo} /></td>
                <td>
                  <ActionButtons onView={() => { setSelected(c); setModal('view') }} onEdit={() => { setSelected(c); setModal('edit') }} onDelete={() => { setSelected(c); setConfirm(true) }} />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.noResults')}</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOrEdit} onClose={() => setModal(null)}
        title={modal === 'create' ? t('modules.costCenters.new') : t('modules.costCenters.edit')}
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button><button className="btn-primary" form="cc-form">{t('common.save')}</button></>}>
        <form id="cc-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('common.code')} <span className="text-red-500">*</span></label>
              <input className="form-input" value={form.codigo} onChange={(e) => set('codigo', e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('common.name')} <span className="text-red-500">*</span></label>
              <input className="form-input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">{t('common.description')}</label>
            <textarea className="form-textarea" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('modules.costCenters.budget')}</label>
            <input type="number" className="form-input" value={form.presupuesto} onChange={(e) => set('presupuesto', e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="cc-activo" className="form-checkbox" checked={form.activo}
              onChange={(e) => set('activo', e.target.checked)} />
            <label htmlFor="cc-activo" className="text-sm text-gray-700">{t('common.active')}</label>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={t('modules.costCenters.detail')}>
        {selected && (
          <div className="space-y-3 text-sm">
            <div><p className="text-xs text-gray-400 uppercase">{t('common.code')}</p><p className="font-mono mt-0.5">{selected.codigo}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">{t('common.name')}</p><p className="mt-0.5">{selected.nombre}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">{t('common.description')}</p><p className="mt-0.5 text-gray-600">{selected.descripcion || '—'}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">{t('modules.costCenters.budget')}</p><p className="mt-0.5">{selected.presupuesto ? `$${selected.presupuesto.toLocaleString()}` : '—'}</p></div>
            <div><p className="text-xs text-gray-400 uppercase">{t('common.status')}</p><div className="mt-0.5"><StatusBadge active={selected.activo} /></div></div>
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirm} onClose={() => { setConfirm(false); setSelected(null) }}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: selected?.nombre ?? '' })} />
    </div>
  )
}
