import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import { visitantesApi } from '../../api/visitantes.api'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from '../../hooks/useTranslation'

interface Visitante {
  id: string; nombre: string; identificacion?: string; tipo: string; empresa?: string
  telefono?: string; email?: string; motivo: string; sedeId: string
  fechaEntrada: string; fechaSalida?: string; estado: string
  sede?: { id: string; nombre: string }
}
interface Sede { id: string; nombre: string }

interface VisForm {
  nombre: string; identificacion: string; tipo: string; empresa: string
  telefono: string; email: string; motivo: string; sedeId: string
  fechaEntrada: string; fechaSalida: string; estado: 'EN_SITIO' | 'FINALIZADA'
}
const defaultForm: VisForm = {
  nombre: '', identificacion: '', tipo: 'PERSONAL', empresa: '', telefono: '',
  email: '', motivo: '', sedeId: '', fechaEntrada: '', fechaSalida: '', estado: 'EN_SITIO',
}

function fmtDate(d?: string) {
  if (!d) return '—'
  try { return format(new Date(d), "d 'de' MMM yyyy HH:mm", { locale: es }) } catch { return d }
}

const TIPO_VALUES = ['PERSONAL', 'EMPRESARIAL', 'PROVEEDOR', 'CLIENTE', 'OTRO']

export default function Visitantes() {
  const { t, te } = useTranslation()
  const [items, setItems] = useState<Visitante[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Visitante | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState<VisForm>(defaultForm)
  const isCreateOrEdit = modal === 'create' || modal === 'edit'

  const fetchItems = useCallback(async () => {
    try {
      const res = await visitantesApi.list()
      setItems(res.data.data)
    } catch { toast.error(t('errors.generic')) }
    finally { setLoading(false) }
  }, [t])

  useEffect(() => {
    fetchItems()
    api.get('/sedes/all').then((r) => setSedes(r.data.data)).catch(() => {})
  }, [fetchItems])

  useEffect(() => {
    if (modal === 'edit' && selected)
      setForm({ nombre: selected.nombre, identificacion: selected.identificacion ?? '',
        tipo: selected.tipo, empresa: selected.empresa ?? '',
        telefono: selected.telefono ?? '', email: selected.email ?? '',
        motivo: selected.motivo, sedeId: selected.sedeId,
        fechaEntrada: selected.fechaEntrada.slice(0, 16),
        fechaSalida: selected.fechaSalida?.slice(0, 16) ?? '',
        estado: selected.estado as 'EN_SITIO' | 'FINALIZADA' })
    else if (modal === 'create') setForm(defaultForm)
  }, [modal, selected])

  const set = (f: keyof VisForm, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.motivo.trim() || !form.sedeId) {
      toast.error(t('errors.required')); return
    }
    try {
      const payload = {
        nombre: form.nombre, identificacion: form.identificacion || undefined,
        tipo: form.tipo, empresa: form.empresa || undefined,
        telefono: form.telefono || undefined, email: form.email || undefined,
        motivo: form.motivo, sedeId: form.sedeId,
      }
      if (modal === 'create') { await visitantesApi.create(payload); toast.success(t('success.saved')) }
      else if (selected) {
        await visitantesApi.update(selected.id, { ...payload, estado: form.estado,
          fechaSalida: form.fechaSalida || undefined })
        toast.success(t('success.updated'))
      }
      setModal(null); fetchItems()
    } catch { toast.error(t('errors.generic')) }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await visitantesApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false); setSelected(null); fetchItems()
    } catch { toast.error(t('errors.generic')) }
  }

  const filtered = items.filter((v) =>
    `${v.nombre} ${v.empresa} ${v.sede?.nombre ?? ''}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6">
      <PageHeader title={t('modules.visitors.title')}
        breadcrumbs={[{ label: t('modules.visitors.title') }, { label: t('modules.visitors.title') }]} />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input type="text" className="form-input w-64" placeholder={t('common.search') + '...'}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-primary" onClick={() => { setSelected(null); setModal('create') }}>{t('modules.visitors.new')}</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              {[t('common.name'), t('common.type'), t('modules.visitors.company'), t('modules.visitors.reason'), t('navigation.headquarters'), t('modules.visitors.entryDate'), t('common.status'), t('common.actions')].map((h) => (
                <th key={h} className="text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.loading')}</td></tr>
            )}
            {!loading && filtered.map((v) => (
              <tr key={v.id}>
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{v.nombre}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{te('visitorType', v.tipo)}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{v.empresa || '—'}</td>
                <td className="text-sm text-gray-700 dark:text-gray-300">{v.motivo}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{v.sede?.nombre ?? '—'}</td>
                <td className="text-sm text-gray-500 dark:text-gray-400">{fmtDate(v.fechaEntrada)}</td>
                <td className="text-sm">
                  <span className={v.estado === 'EN_SITIO' ? 'text-green-700 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'}>
                    {te('visitorStatus', v.estado)}
                  </span>
                </td>
                <td>
                  <ActionButtons onView={() => { setSelected(v); setModal('view') }} onEdit={() => { setSelected(v); setModal('edit') }} onDelete={() => { setSelected(v); setConfirm(true) }} />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.noResults')}</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOrEdit} onClose={() => setModal(null)}
        title={modal === 'create' ? t('modules.visitors.new') : t('modules.visitors.editVisitor')} size="lg"
        footer={<><button className="btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button><button className="btn-primary" form="vis-form">{t('common.save')}</button></>}>
        <form id="vis-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">{t('common.name')} <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('modules.visitors.identification')}</label>
            <input className="form-input" value={form.identificacion} onChange={(e) => set('identificacion', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.type')}</label>
            <select className="form-select" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
              {TIPO_VALUES.map((v) => <option key={v} value={v}>{te('visitorType', v)}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t('modules.visitors.company')}</label>
            <input className="form-input" value={form.empresa} onChange={(e) => set('empresa', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.phone')}</label>
            <input className="form-input" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="form-label">{t('modules.visitors.reason')} <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.motivo} onChange={(e) => set('motivo', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('common.headquarter')} <span className="text-red-500">*</span></label>
            <select className="form-select" value={form.sedeId} onChange={(e) => set('sedeId', e.target.value)}>
              <option value="">{t('common.selectOption')}</option>
              {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t('common.status')}</label>
            <select className="form-select" value={form.estado} onChange={(e) => set('estado', e.target.value as 'EN_SITIO' | 'FINALIZADA')}>
              <option value="EN_SITIO">{te('visitorStatus', 'EN_SITIO')}</option>
              <option value="FINALIZADA">{te('visitorStatus', 'FINALIZADA')}</option>
            </select>
          </div>
          <div>
            <label className="form-label">{t('modules.visitors.entryDate')}</label>
            <input type="datetime-local" className="form-input" value={form.fechaEntrada} onChange={(e) => set('fechaEntrada', e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('modules.visitors.exitDate')}</label>
            <input type="datetime-local" className="form-input" value={form.fechaSalida} onChange={(e) => set('fechaSalida', e.target.value)} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={() => setModal(null)} title={t('modules.visitors.detail')} size="md">
        {selected && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {([
              [t('common.name'), selected.nombre],
              [t('modules.visitors.identification'), selected.identificacion || '—'],
              [t('common.type'), te('visitorType', selected.tipo)],
              [t('modules.visitors.company'), selected.empresa || '—'],
              [t('common.phone'), selected.telefono || '—'],
              ['Email', selected.email || '—'],
              [t('modules.visitors.reason'), selected.motivo],
              [t('common.headquarter'), selected.sede?.nombre ?? '—'],
              [t('modules.visitors.entryDate'), fmtDate(selected.fechaEntrada)],
              [t('modules.visitors.exitDate'), fmtDate(selected.fechaSalida)],
            ] as [string, string][]).map(([l, v]) => (
              <div key={l}><p className="text-xs text-gray-400 uppercase">{l}</p><p className="mt-0.5">{v}</p></div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={confirm} onClose={() => setConfirm(false)}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: selected?.nombre ?? '' })} />
    </div>
  )
}
