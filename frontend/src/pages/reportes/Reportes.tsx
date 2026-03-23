import { useState, useMemo, useEffect } from 'react'
import PageHeader from '../../components/common/PageHeader'
import api from '../../api/client'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useTranslation } from '../../hooks/useTranslation'

interface Contratista { id: string; nombre: string }

// ==========================================
// TIPOS DE REPORTES
// ==========================================
interface TipoReporte {
  id: string
  nombre: string
  filtros: {
    contratista: boolean
    genero: boolean
    rangoFechas: boolean
    fechaRequerida: boolean
    identificacion: boolean
    sede?: boolean
    destino?: boolean
  }
}

const TIPOS_REPORTES: TipoReporte[] = [
  { id: 'conteo-dias', nombre: 'Conteo de días', filtros: { contratista: true, genero: true, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'entradas-salidas-destinos', nombre: 'Entradas y salidas con destinos', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'entradas-salidas-novedades', nombre: 'Entradas y salidas con novedades', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'entradas-salidas', nombre: 'Entradas y salidas', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: true } },
  { id: 'entradas-salidas-encuesta', nombre: 'Entradas y salidas con encuesta', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'entradas-salidas-visitantes', nombre: 'Entradas y salidas de visitantes', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'listado-vencimientos', nombre: 'Listado de vencimientos', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'planificacion', nombre: 'Planificación', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'reconocimiento-ss', nombre: 'Reconocimiento de Seguridad Social', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'horas-semanal', nombre: 'Reporte de Horas Semanal', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'horas-quincenal', nombre: 'Reporte de Horas Quincenal', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'accesos-fallidos', nombre: 'Reporte de Accesos Fallidos', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: true } },
  { id: 'horas', nombre: 'Reporte de Horas', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: true } },
  { id: 'tiempo-activo-sede', nombre: 'Reporte de Tiempo Activo en Sede', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'dias-trabajados-mujeres', nombre: 'Reporte de Días Trabajados Mujeres', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'general-empleado', nombre: 'Reporte General De Empleado', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: true } },
  { id: 'conteo-ingresos', nombre: 'Conteo de ingresos', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'activos-inactivos', nombre: 'Empleados activos e inactivos', filtros: { contratista: true, genero: false, rangoFechas: false, fechaRequerida: false, identificacion: false } },
  { id: 'empleados-ausentes', nombre: 'Empleados ausentes', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'horas-semanal-diarias', nombre: 'Reporte de Horas Semanal - H. Diarias', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'horas-quincenal-diarias', nombre: 'Reporte de Horas Quincenal - H. Diarias', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'conteo-ingresos-2', nombre: 'Conteo de ingresos', filtros: { contratista: false, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: false } },
  { id: 'general-empleado-2', nombre: 'Reporte General De Empleado', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: true } },
  { id: 'horas-con-turnos', nombre: 'Reporte de Horas con Turnos', filtros: { contratista: true, genero: false, rangoFechas: true, fechaRequerida: true, identificacion: true } },
]

interface FiltrosForm {
  contratistaId: string
  genero: string
  fechaInicio: string
  fechaFin: string
  identificacion: string
}

const defaultForm: FiltrosForm = {
  contratistaId: '',
  genero: '',
  fechaInicio: '',
  fechaFin: '',
  identificacion: '',
}

export default function Reportes() {
  const { t, te } = useTranslation()
  const [reporteSeleccionado, setReporteSeleccionado] = useState<TipoReporte | null>(null)
  const [form, setForm] = useState<FiltrosForm>(defaultForm)
  const [errors, setErrors] = useState<Partial<FiltrosForm>>({})
  const [resultados, setResultados] = useState<unknown[]>([])
  const [consultando, setConsultando] = useState(false)
  const [contratistas, setContratistas] = useState<Contratista[]>([])

  const GENEROS = [
    { value: '', label: t('modules.reports.selectGender') },
    { value: 'MASCULINO', label: te('gender', 'MASCULINO') },
    { value: 'FEMENINO', label: te('gender', 'FEMENINO') },
    { value: 'OTRO', label: te('gender', 'OTRO') },
  ]

  useEffect(() => {
    api.get('/contratistas/all').then((r) => setContratistas(r.data.data)).catch(() => {})
  }, [])

  const set = (field: keyof FiltrosForm, value: string) => {
    setForm((p) => ({ ...p, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors((p) => ({ ...p, [field]: undefined }))
    }
  }

  const handleReporteChange = (reporteId: string) => {
    const reporte = TIPOS_REPORTES.find((r) => r.id === reporteId) || null
    setReporteSeleccionado(reporte)
    setForm(defaultForm)
    setErrors({})
    setResultados([])
  }

  const validate = (): boolean => {
    if (!reporteSeleccionado) {
      toast.error(t('errors.required'))
      return false
    }

    const e: Partial<FiltrosForm> = {}

    if (reporteSeleccionado.filtros.contratista && !form.contratistaId) {
      e.contratistaId = t('errors.required')
    }

    if (reporteSeleccionado.filtros.fechaRequerida) {
      if (!form.fechaInicio) e.fechaInicio = t('errors.required')
      if (!form.fechaFin) e.fechaFin = t('errors.required')
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setConsultando(true)

    // Simulate backend query
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockResultados = generarResultadosMock()
    setResultados(mockResultados)

    toast.success(t('success.saved'))
    setConsultando(false)
  }

  const handleDescargar = () => {
    if (resultados.length === 0) {
      toast.error(t('errors.generic'))
      return
    }

    const nombreArchivo = `${reporteSeleccionado?.id}_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
    toast.success(`${t('modules.reports.download')}: ${nombreArchivo}`)
  }

  const generarResultadosMock = (): unknown[] => {
    const cantidad = Math.floor(Math.random() * 10) + 5
    const resultados: unknown[] = []
    const contratistaNombre = contratistas.find((c) => c.id === form.contratistaId)?.nombre ?? '—'

    for (let i = 0; i < cantidad; i++) {
      resultados.push({
        id: i + 1,
        empleado: `Empleado ${i + 1}`,
        identificacion: `10000000${i}`,
        contratista: contratistaNombre,
        sede: '—',
        fecha: format(new Date(), 'dd/MM/yyyy', { locale: es }),
        ...(reporteSeleccionado?.id.includes('horas') && {
          horasTrabajadas: Math.floor(Math.random() * 8) + 1,
          horasExtras: Math.floor(Math.random() * 4),
        }),
        ...(reporteSeleccionado?.id.includes('entradas') && {
          horaEntrada: '07:00',
          horaSalida: '17:00',
          destino: 'Oficina Principal',
        }),
        ...(reporteSeleccionado?.id === 'conteo-dias' && {
          diasTrabajados: Math.floor(Math.random() * 20) + 10,
          diasDescanso: Math.floor(Math.random() * 8) + 2,
        }),
      })
    }

    return resultados
  }

  // Determine columns to show based on report type
  const columnas = useMemo(() => {
    if (!reporteSeleccionado || resultados.length === 0) return []

    const cols: { key: string; label: string }[] = [
      { key: 'empleado', label: t('navigation.employees') },
      { key: 'identificacion', label: t('common.idNumber') },
      { key: 'contratista', label: t('navigation.contractors') },
      { key: 'sede', label: t('navigation.headquarters') },
      { key: 'fecha', label: t('common.date') },
    ]

    if (reporteSeleccionado.id.includes('horas')) {
      cols.push({ key: 'horasTrabajadas', label: 'Horas Trabajadas' })
      cols.push({ key: 'horasExtras', label: 'Horas Extras' })
    }

    if (reporteSeleccionado.id.includes('entradas')) {
      cols.push({ key: 'horaEntrada', label: 'Entrada' })
      cols.push({ key: 'horaSalida', label: 'Salida' })
      cols.push({ key: 'destino', label: t('navigation.destinations') })
    }

    if (reporteSeleccionado.id === 'conteo-dias') {
      cols.push({ key: 'diasTrabajados', label: 'Días Trabajados' })
      cols.push({ key: 'diasDescanso', label: 'Días Descanso' })
    }

    return cols
  }, [reporteSeleccionado, resultados, t])

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.reports.title')}
        breadcrumbs={[
          { label: t('modules.reports.title') },
        ]}
      />

      {/* Report Filters */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-800">{t('modules.reports.filters')}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleConsultar} className="space-y-6">
            {/* Report type selector */}
            <div>
              <label className="form-label">
                {t('modules.reports.selectType')} <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select"
                value={reporteSeleccionado?.id || ''}
                onChange={(e) => handleReporteChange(e.target.value)}
              >
                <option value="">{t('common.selectOption')}</option>
                {TIPOS_REPORTES.map((reporte) => (
                  <option key={reporte.id} value={reporte.id}>
                    {reporte.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic filters */}
            {reporteSeleccionado && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Filter: Contractor */}
                {reporteSeleccionado.filtros.contratista && (
                  <div>
                    <label className="form-label">
                      {t('navigation.contractors')}
                      {reporteSeleccionado.filtros.fechaRequerida && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <select
                      className={`form-select ${errors.contratistaId ? 'border-red-400' : ''}`}
                      value={form.contratistaId}
                      onChange={(e) => set('contratistaId', e.target.value)}
                    >
                      <option value="">{t('modules.reports.selectContractor')}</option>
                      {contratistas.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.contratistaId && (
                      <p className="text-xs text-red-500 mt-1">{errors.contratistaId}</p>
                    )}
                  </div>
                )}

                {/* Filter: Gender */}
                {reporteSeleccionado.filtros.genero && (
                  <div>
                    <label className="form-label">{t('modules.employees.gender')}</label>
                    <select
                      className="form-select"
                      value={form.genero}
                      onChange={(e) => set('genero', e.target.value)}
                    >
                      {GENEROS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Filter: Date range */}
                {reporteSeleccionado.filtros.rangoFechas && (
                  <>
                    <div>
                      <label className="form-label">
                        {t('modules.reports.startDate')}
                        {reporteSeleccionado.filtros.fechaRequerida && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <input
                        type="date"
                        className={`form-input ${errors.fechaInicio ? 'border-red-400' : ''}`}
                        value={form.fechaInicio}
                        onChange={(e) => set('fechaInicio', e.target.value)}
                      />
                      {errors.fechaInicio && (
                        <p className="text-xs text-red-500 mt-1">{errors.fechaInicio}</p>
                      )}
                    </div>
                    <div>
                      <label className="form-label">
                        {t('modules.reports.endDate')}
                        {reporteSeleccionado.filtros.fechaRequerida && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <input
                        type="date"
                        className={`form-input ${errors.fechaFin ? 'border-red-400' : ''}`}
                        value={form.fechaFin}
                        onChange={(e) => set('fechaFin', e.target.value)}
                      />
                      {errors.fechaFin && (
                        <p className="text-xs text-red-500 mt-1">{errors.fechaFin}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Filter: ID number */}
                {reporteSeleccionado.filtros.identificacion && (
                  <div>
                    <label className="form-label">{t('modules.reports.idNumber')}</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={t('modules.reports.enterIdNumber')}
                      value={form.identificacion}
                      onChange={(e) => set('identificacion', e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="btn-primary"
                disabled={consultando}
              >
                {consultando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('modules.reports.querying')}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t('modules.reports.query')}
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-success"
                onClick={handleDescargar}
                disabled={resultados.length === 0}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('modules.reports.download')}
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setReporteSeleccionado(null)
                  setForm(defaultForm)
                  setErrors({})
                  setResultados([])
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('modules.reports.clear')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Report results */}
      {resultados.length > 0 && (
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('modules.reports.results') + ': '}{reporteSeleccionado?.nombre}
            </h3>
            <span className="badge badge-info">
              {resultados.length} {t('modules.reports.records')}
            </span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {columnas.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resultados.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {columnas.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                        {String((row as Record<string, unknown>)[col.key] ?? '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Initial message */}
      {!reporteSeleccionado && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg">{t('modules.reports.selectToStart')}</p>
          <p className="text-sm mt-1">{t('modules.reports.filtersAdjust')}</p>
        </div>
      )}
    </div>
  )
}
