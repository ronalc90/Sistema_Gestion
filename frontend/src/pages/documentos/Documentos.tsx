import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import { documentosApi } from '../../api/documentos.api'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

const TIPO_OPTS = ['CONTRATO', 'CEDULA', 'HV', 'CERTIFICADO', 'LICENCIA', 'EXAMEN_MEDICO', 'POLIZA', 'OTRO']

interface Documento {
  id: string; nombre: string; tipo: string; descripcion?: string
  url: string; tamanio: number; mimeType: string; createdAt: string
  empleado?: { id: string; nombres: string; apellidos: string }
  subidoPor?: { id: string; nombre: string }
}
interface Empleado { id: string; nombres: string; apellidos: string }

interface DocForm { nombre: string; tipo: string; descripcion: string; empleadoId: string; file: File | null }
const defaultForm: DocForm = { nombre: '', tipo: 'CONTRATO', descripcion: '', empleadoId: '', file: null }

export default function Documentos() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Documento[]>([])
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Documento | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState<DocForm>(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const isCreateOrEdit = modal === 'create' || modal === 'edit'

  const fetchItems = useCallback(async () => {
    try {
      const res = await documentosApi.list()
      setItems(res.data.data)
    } catch { toast.error(t('errors.generic')) }
    finally { setLoading(false) }
  }, [t])

  useEffect(() => {
    fetchItems()
    api.get('/empleados/all').then((r) => setEmpleados(r.data.data)).catch(() => {})
  }, [fetchItems])

  useEffect(() => {
    if (modal === 'edit' && selected)
      setForm({ nombre: selected.nombre, tipo: selected.tipo,
        descripcion: selected.descripcion ?? '', empleadoId: selected.empleado?.id ?? '', file: null })
    else if (modal === 'create') setForm(defaultForm)
  }, [modal, selected])

  const set = (f: keyof DocForm, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const openCreate = () => { setSelected(null); setModal('create') }
  const openEdit = (d: Documento) => { setSelected(d); setModal('edit') }
  const openView = (d: Documento) => { setSelected(d); setModal('view') }
  const openDelete = (d: Documento) => { setSelected(d); setConfirm(true) }
  const closeModal = () => setModal(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim()) { toast.error(t('errors.required')); return }
    if (modal === 'create' && !form.file) { toast.error(t('errors.required')); return }
    setSubmitting(true)
    try {
      if (modal === 'create') {
        const fd = new FormData()
        fd.append('nombre', form.nombre)
        fd.append('tipo', form.tipo)
        if (form.descripcion) fd.append('descripcion', form.descripcion)
        if (form.empleadoId) fd.append('empleadoId', form.empleadoId)
        fd.append('file', form.file!)
        await documentosApi.upload(fd)
        toast.success(t('success.uploaded'))
      } else if (selected) {
        await documentosApi.update(selected.id, { nombre: form.nombre, tipo: form.tipo, descripcion: form.descripcion || undefined })
        toast.success(t('success.updated'))
      }
      setModal(null); fetchItems()
    } catch { toast.error(t('errors.generic')) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await documentosApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false); setSelected(null); fetchItems()
    } catch { toast.error(t('errors.generic')) }
  }

  const filtered = items.filter((d) =>
    `${d.nombre} ${d.tipo} ${d.empleado ? `${d.empleado.nombres} ${d.empleado.apellidos}` : ''}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6">
      <PageHeader title={t('modules.documents.title')}
        breadcrumbs={[{ label: t('modules.documents.title') }, { label: t('modules.documents.title') }]} />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input type="text" className="form-input w-64" placeholder={t('common.search') + '...'}
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-primary" onClick={openCreate}>{t('modules.documents.new')}</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              {[t('common.name'), t('common.type'), t('common.employee'), t('common.description'), t('common.date'), t('common.actions')].map((h) => (
                <th key={h} className="text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.loading')}</td></tr>
            )}
            {!loading && filtered.map((d) => (
              <tr key={d.id}>
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {d.nombre}
                  </div>
                </td>
                <td className="text-sm">
                  <span className="badge badge-info">{t('modules.documents.types.' + d.tipo)}</span>
                </td>
                <td className="text-sm text-gray-700 dark:text-gray-300">
                  {d.empleado ? `${d.empleado.nombres} ${d.empleado.apellidos}` : '—'}
                </td>
                <td className="text-sm text-gray-500 dark:text-gray-400">{d.descripcion}</td>
                <td className="text-sm text-gray-500 dark:text-gray-400">{d.createdAt.slice(0, 10)}</td>
                <td>
                  <ActionButtons onView={() => openView(d)} onEdit={() => openEdit(d)} onDelete={() => openDelete(d)} />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">{t('common.noResults')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOrEdit} onClose={closeModal}
        title={modal === 'create' ? t('modules.documents.new') : t('common.edit') + ' ' + t('modules.documents.title')}
        footer={
          <>
            <button className="btn-secondary" onClick={closeModal}>{t('common.cancel')}</button>
            <button className="btn-primary" form="doc-form" disabled={submitting}>
              {submitting ? t('common.saving') : t('common.save')}
            </button>
          </>
        }>
        <form id="doc-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">{t('common.name')} <span className="text-red-500">*</span></label>
            <input className="form-input" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('common.type')}</label>
              <select className="form-select" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                {TIPO_OPTS.map((tipo) => <option key={tipo} value={tipo}>{t('modules.documents.types.' + tipo)}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">{t('common.employee')}</label>
              <select className="form-select" value={form.empleadoId} onChange={(e) => set('empleadoId', e.target.value)}>
                <option value="">{t('common.noEmployee')}</option>
                {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos}</option>)}
              </select>
            </div>
          </div>
          {modal === 'create' && (
            <div>
              <label className="form-label">{t('common.file')} <span className="text-red-500">*</span></label>
              <input type="file" className="form-input"
                onChange={(e) => setForm((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} />
            </div>
          )}
          <div>
            <label className="form-label">{t('common.description')}</label>
            <textarea className="form-textarea" value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
          </div>
        </form>
      </Modal>

      <Modal isOpen={modal === 'view'} onClose={closeModal} title={t('modules.documents.detail')}>
        {selected && (
          <div className="space-y-3 text-sm">
            {([
              [t('common.name'), selected.nombre],
              [t('common.type'), t('modules.documents.types.' + selected.tipo)],
              [t('common.employee'), selected.empleado ? `${selected.empleado.nombres} ${selected.empleado.apellidos}` : '—'],
              [t('common.description'), selected.descripcion ?? '—'],
              ['URL', selected.url],
              [t('common.file'), `${Math.round(selected.tamanio / 1024)} KB`],
              [t('common.date'), selected.createdAt.slice(0, 10)],
            ] as [string, string][]).map(([l, v]) => (
              <div key={l}><p className="text-xs text-gray-400 uppercase">{l}</p><p className="mt-0.5 break-all">{v}</p></div>
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
