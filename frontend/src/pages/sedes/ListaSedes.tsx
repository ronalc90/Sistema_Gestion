import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import ActionButtons from '../../components/common/ActionButtons'
import ConfirmModal from '../../components/common/ConfirmModal'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { sedesApi } from '../../api/sedes.api'
import toast from 'react-hot-toast'
import { useTranslation } from '../../hooks/useTranslation'

interface PlanificacionCargo {
  id: string
  fechaInicio: string
  fechaFin: string
  contratista: { id: string; nombre: string; nit?: string; estado: string }
}

interface Sede {
  id: string
  nombre: string
  estado: 'ACTIVO' | 'INACTIVO'
  tiempoDescanso?: string
  fechaInicial?: string
  fechaFinal?: string
  nombreColeccion?: string
  createdAt?: string
  centroCosto?: { id: string; nombre: string; codigo: string }
  horarios?: Array<{ dia: string; activo: boolean; horaInicio?: string; horaFin?: string }>
  planificacionesCargos?: PlanificacionCargo[]
  _count?: { empleados: number }
}

const DIAS_ORDER = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']
const DIAS_LABELS: Record<string, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = d.getUTCFullYear()
  return `${dd}-${mm}-${yyyy}`
}

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—'
  return dateStr.replace('T', ' ').slice(0, 19)
}

export default function ListaSedes() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [sedes, setSedes] = useState<Sede[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Sede | null>(null)
  const [modal, setModal] = useState<'view' | 'delete' | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const TABS = [
    t('modules.headquarters.tabs.detail'),
    t('modules.headquarters.tabs.contractors'),
    t('modules.headquarters.tabs.departments'),
    t('modules.headquarters.tabs.areas'),
  ]

  const fetchSedes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await sedesApi.list()
      if (res.data?.success) {
        setSedes(res.data.data || [])
      } else {
        toast.error(t('errors.generic'))
      }
    } catch (error: any) {
      console.error('Error fetching sedes:', error)
      toast.error(error?.response?.data?.message || t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchSedes()
  }, [fetchSedes])

  const filtered = sedes.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const handleView = async (sede: Sede) => {
    setSelected(sede)
    setActiveTab(0)
    setModal('view')
    setDetailLoading(true)
    try {
      const res = await sedesApi.getById(sede.id)
      if (res.data?.success) {
        setSelected(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching sede detail:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleEdit = (sede: Sede) => {
    navigate(`/sedes/editar/${sede.id}`)
  }

  const handleDeleteClick = (sede: Sede) => {
    setSelected(sede)
    setModal('delete')
  }

  const handleDelete = async () => {
    if (!selected) return
    setDeleting(true)
    try {
      const res = await sedesApi.remove(selected.id)
      if (res.data?.success) {
        toast.success(t('success.deleted'))
        setModal(null)
        setSelected(null)
        fetchSedes()
      } else {
        toast.error(res.data?.message || t('errors.generic'))
      }
    } catch (error: any) {
      console.error('Error deleting sede:', error)
      toast.error(error?.response?.data?.message || t('errors.generic'))
    } finally {
      setDeleting(false)
    }
  }

  const handleCloseModal = () => {
    setModal(null)
    setSelected(null)
    setActiveTab(0)
  }

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.headquarters.list')}
        breadcrumbs={[
          { label: t('navigation.headquarters'), path: '/sedes' },
          { label: t('modules.headquarters.list') },
        ]}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-end gap-3 mb-4">
        <input
          type="text"
          className="form-input w-52"
          placeholder={t('common.search') + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="btn-primary whitespace-nowrap"
          onClick={() => navigate('/sedes/agregar')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('modules.headquarters.add')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="table-dark w-full">
          <thead>
            <tr>
              <th className="text-left">{t('common.name')}</th>
              <th className="text-left w-44">{t('common.costCenter')}</th>
              <th className="text-left w-28">{t('common.status')}</th>
              <th className="text-left w-24">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t('common.loading')}
                  </div>
                </td>
              </tr>
            )}
            {!loading && filtered.map((sede) => (
              <tr key={sede.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="text-sm text-gray-800 dark:text-gray-100 font-medium">{sede.nombre}</td>
                <td className="text-sm text-gray-600 dark:text-gray-400">{sede.centroCosto?.nombre ?? '—'}</td>
                <td className="text-sm">
                  <StatusBadge active={sede.estado === 'ACTIVO'} />
                </td>
                <td>
                  <ActionButtons
                    onView={() => handleView(sede)}
                    onEdit={() => handleEdit(sede)}
                    onDelete={() => handleDeleteClick(sede)}
                  />
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  {t('common.noResults')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={modal === 'view'}
        onClose={handleCloseModal}
        title={selected?.nombre ?? t('modules.headquarters.detail')}
        size="xl"
      >
        {selected && (
          <div>
            {/* Created at */}
            <p className="text-xs text-gray-400 mb-4">
              {t('common.createdAt')}: {formatDateTime(selected.createdAt)}
            </p>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-5">
              <nav className="flex gap-0 -mb-px overflow-x-auto">
                {TABS.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === i
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab content */}
            {detailLoading ? (
              <div className="flex items-center justify-center py-10">
                <svg className="animate-spin h-5 w-5 text-primary-600 mr-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-sm text-gray-500">{t('common.loading')}</span>
              </div>
            ) : (
              <>
                {activeTab === 0 && <DetalleTab sede={selected} />}
                {activeTab === 1 && <ContratistasTab sede={selected} />}
                {activeTab === 2 && <DepartamentosTab />}
                {activeTab === 3 && <AreasTab />}
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={modal === 'delete'}
        onClose={handleCloseModal}
        onConfirm={handleDelete}
        message={t('common.confirmDeleteItem', { name: selected?.nombre ?? '' })}
      />

      {deleting && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <svg className="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">{t('common.saving')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ─────────────────────────────────── */

function DetalleTab({ sede }: { sede: Sede }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      {/* Fields grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <DetailField label={t('common.name')} value={sede.nombre} />
        <DetailField label={t('modules.headquarters.initialDate')} value={formatDate(sede.fechaInicial)} />
        <DetailField label={t('modules.headquarters.finalDate')} value={formatDate(sede.fechaFinal)} />
        <DetailField label={t('common.costCenter')} value={sede.centroCosto?.nombre ?? '—'} />
        <DetailField
          label={t('common.status')}
          value={sede.estado === 'ACTIVO' ? t('common.active') : t('common.inactive')}
        />
      </div>

      {/* Horarios */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-100 pb-2">
          {t('modules.headquarters.schedules')}
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <HorarioRow
            label={t('modules.headquarters.restTime')}
            value={sede.tiempoDescanso ? `${sede.tiempoDescanso} min` : '0 min'}
          />
          {DIAS_ORDER.map((dia) => {
            const h = sede.horarios?.find((x) => x.dia === dia)
            const value =
              h?.activo && h.horaInicio && h.horaFin
                ? `${h.horaInicio} - ${h.horaFin}`
                : '-'
            return <HorarioRow key={dia} label={DIAS_LABELS[dia]} value={value} />
          })}
        </div>
      </div>
    </div>
  )
}

function ContratistasTab({ sede }: { sede: Sede }) {
  const { t } = useTranslation()
  const cargos = sede.planificacionesCargos ?? []
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.code')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.contractor')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('modules.headquarters.initialDate')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('modules.headquarters.finalDate')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.status')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {cargos.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                {t('modules.headquarters.noContractors')}
              </td>
            </tr>
          ) : (
            cargos.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-3 text-gray-800 font-medium">
                  {c.contratista.nit ?? '—'}
                </td>
                <td className="py-2 px-3 text-gray-800">{c.contratista.nombre}</td>
                <td className="py-2 px-3 text-gray-600">{formatDate(c.fechaInicio)}</td>
                <td className="py-2 px-3 text-gray-600">{formatDate(c.fechaFin)}</td>
                <td className="py-2 px-3">
                  <StatusBadge active={c.contratista.estado === 'ACTIVO'} />
                </td>
                <td className="py-2 px-3">
                  {/* future actions */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function DepartamentosTab() {
  const { t } = useTranslation()
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.name')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.status')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3} className="py-8 text-center text-sm text-gray-400">
              {t('modules.headquarters.noDepartments')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function AreasTab() {
  const { t } = useTranslation()
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.name')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Departamento
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.status')}
            </th>
            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
              {t('modules.headquarters.noAreas')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  )
}

function HorarioRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs text-gray-800 font-medium">{value}</span>
    </div>
  )
}
