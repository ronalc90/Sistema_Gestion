import { useState, useEffect, useCallback } from 'react'
import PageHeader from '../../components/common/PageHeader'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import ActionButtons from '../../components/common/ActionButtons'
import { planificacionesCargosApi } from '../../api/planificacionesCargos.api'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from '../../hooks/useTranslation'

interface PlanCargo {
  id: string
  cargo: string
  cantidad: number
  fechaInicio: string
  fechaFin: string
  contratista?: { id: string; nombre: string }
  sede?: { id: string; nombre: string }
  contratistaId: string
  sedeId: string
}
interface Contratista { id: string; nombre: string }
interface Sede { id: string; nombre: string }

interface CargoForm {
  contratistaId: string
  sedeId: string
  cargo: string
  cantidad: string
  fechaInicio: string
  fechaFin: string
}
const defaultForm: CargoForm = {
  contratistaId: '', sedeId: '', cargo: '', cantidad: '', fechaInicio: '', fechaFin: '',
}

function formatRango(inicio: string, fin: string) {
  try {
    return `${format(new Date(inicio), 'd/M/yyyy', { locale: es })} - ${format(new Date(fin), 'd/M/yyyy', { locale: es })}`
  } catch {
    return `${inicio} - ${fin}`
  }
}


export default function PlanificacionCargos() {
  const { t } = useTranslation()
  const [items, setItems] = useState<PlanCargo[]>([])
  const [contratistas, setContratistas] = useState<Contratista[]>([])
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PlanCargo | null>(null)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [confirm, setConfirm] = useState(false)
  const [form, setForm] = useState<CargoForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<CargoForm>>({})

  const fetchItems = useCallback(async () => {
    try {
      const res = await planificacionesCargosApi.list({ limit: 200 })
      setItems(res.data.data)
    } catch {
      toast.error(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchItems()
    Promise.all([
      api.get('/contratistas/all'),
      api.get('/sedes/all'),
    ]).then(([c, s]) => {
      setContratistas(c.data.data)
      setSedes(s.data.data)
    }).catch(() => {})
  }, [fetchItems])

  useEffect(() => {
    if (modal === 'edit' && selected) {
      setForm({
        contratistaId: selected.contratistaId,
        sedeId: selected.sedeId,
        cargo: selected.cargo,
        cantidad: String(selected.cantidad),
        fechaInicio: selected.fechaInicio.slice(0, 10),
        fechaFin: selected.fechaFin.slice(0, 10),
      })
    } else if (modal === 'create') {
      setForm(defaultForm)
    }
    setErrors({})
  }, [modal, selected])

  const set = (field: keyof CargoForm, value: string) =>
    setForm((p) => ({ ...p, [field]: value }))

  const validate = (): boolean => {
    const e: Partial<CargoForm> = {}
    if (!form.contratistaId) e.contratistaId = t('errors.required')
    if (!form.sedeId) e.sedeId = t('errors.required')
    if (!form.cargo.trim()) e.cargo = t('errors.required')
    if (!form.cantidad || isNaN(Number(form.cantidad))) e.cantidad = t('errors.required')
    if (!form.fechaInicio) e.fechaInicio = t('errors.required')
    if (!form.fechaFin) e.fechaFin = t('errors.required')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      const payload = {
        contratistaId: form.contratistaId,
        sedeId: form.sedeId,
        cargo: form.cargo,
        cantidad: Number(form.cantidad),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
      }
      if (modal === 'create') {
        await planificacionesCargosApi.create(payload)
        toast.success(t('success.saved'))
      } else if (selected) {
        await planificacionesCargosApi.update(selected.id, payload)
        toast.success(t('success.updated'))
      }
      setModal(null)
      fetchItems()
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await planificacionesCargosApi.remove(selected.id)
      toast.success(t('success.deleted'))
      setConfirm(false)
      setSelected(null)
      fetchItems()
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  const filtered = items.filter((p) =>
    `${p.contratista?.nombre ?? ''} ${p.sede?.nombre ?? ''} ${p.cargo}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.planning.positionPlanning')}
        breadcrumbs={[
          { label: t('navigation.planning') },
          { label: t('modules.planning.positions'), path: '/planificacion/cargos' },
          { label: t('modules.planning.positionPlanning') },
        ]}
      />

      <div className="flex items-center justify-between gap-3 mb-4">
        <input
          type="text"
          className="form-input w-64"
          placeholder={t('common.search') + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn-primary whitespace-nowrap"
          onClick={() => { setSelected(null); setModal('create') }}
        >
          {t('modules.planning.addPlanning')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('common.contractor')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('common.headquarter')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('common.position')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide w-24">
                {t('modules.planning.quantity')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {t('modules.planning.timeRange')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide w-24">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t('common.loading')}
                  </div>
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
            {!loading && filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{p.contratista?.nombre ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{p.sede?.nombre ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{p.cargo}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{p.cantidad}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatRango(p.fechaInicio, p.fechaFin)}</td>
                <td className="px-4 py-3">
                  <ActionButtons
                    onEdit={() => { setSelected(p); setModal('edit') }}
                    onDelete={() => { setSelected(p); setConfirm(true) }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        title={modal === 'create' ? t('modules.planning.addPlanning') : t('modules.planning.editPlanning')}
        size="md"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(null)}>{t('common.cancel')}</button>
            <button className="btn-primary" form="plan-form">{t('common.save')}</button>
          </>
        }
      >
        <form id="plan-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">{t('common.contractor')} <span className="text-red-500">*</span></label>
            <select
              className={`form-select ${errors.contratistaId ? 'border-red-400' : ''}`}
              value={form.contratistaId}
              onChange={(e) => set('contratistaId', e.target.value)}
            >
              <option value="">{t('modules.planning.selectContractor')}</option>
              {contratistas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {errors.contratistaId && <p className="text-xs text-red-500 mt-1">{errors.contratistaId}</p>}
          </div>

          <div>
            <label className="form-label">{t('common.headquarter')} <span className="text-red-500">*</span></label>
            <select
              className={`form-select ${errors.sedeId ? 'border-red-400' : ''}`}
              value={form.sedeId}
              onChange={(e) => set('sedeId', e.target.value)}
            >
              <option value="">{t('modules.planning.selectHeadquarter')}</option>
              {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            {errors.sedeId && <p className="text-xs text-red-500 mt-1">{errors.sedeId}</p>}
          </div>

          <div>
            <label className="form-label">{t('common.position')} <span className="text-red-500">*</span></label>
            <input
              className={`form-input ${errors.cargo ? 'border-red-400' : ''}`}
              placeholder={t('modules.planning.enterPosition')}
              value={form.cargo}
              onChange={(e) => set('cargo', e.target.value)}
            />
            {errors.cargo && <p className="text-xs text-red-500 mt-1">{errors.cargo}</p>}
          </div>

          <div>
            <label className="form-label">{t('modules.planning.quantity')} <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="1"
              className={`form-input ${errors.cantidad ? 'border-red-400' : ''}`}
              placeholder={t('modules.planning.peopleQuantity')}
              value={form.cantidad}
              onChange={(e) => set('cantidad', e.target.value)}
            />
            {errors.cantidad && <p className="text-xs text-red-500 mt-1">{errors.cantidad}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('modules.planning.startDate')} <span className="text-red-500">*</span></label>
              <input
                type="date"
                className={`form-input ${errors.fechaInicio ? 'border-red-400' : ''}`}
                value={form.fechaInicio}
                onChange={(e) => set('fechaInicio', e.target.value)}
              />
              {errors.fechaInicio && <p className="text-xs text-red-500 mt-1">{errors.fechaInicio}</p>}
            </div>
            <div>
              <label className="form-label">{t('modules.planning.endDate')} <span className="text-red-500">*</span></label>
              <input
                type="date"
                className={`form-input ${errors.fechaFin ? 'border-red-400' : ''}`}
                value={form.fechaFin}
                onChange={(e) => set('fechaFin', e.target.value)}
              />
              {errors.fechaFin && <p className="text-xs text-red-500 mt-1">{errors.fechaFin}</p>}
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: selected?.cargo ?? '' })}
      />
    </div>
  )
}
