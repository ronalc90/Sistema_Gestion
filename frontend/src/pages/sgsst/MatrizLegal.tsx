import { useState } from 'react'
import {
  FaInfoCircle, FaEdit, FaCog, FaDownload,
  FaArrowLeft, FaPlus, FaCheck, FaTimes, FaFilter,
  FaExclamationTriangle, FaEye,
} from 'react-icons/fa'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type TabType = 'estandares' | 'informe' | 'matriz' | 'operaciones'

interface Criterio {
  numeral: string
  grupo: string
  criterio: string
  semaforo: 'verde' | 'amarillo' | 'rojo' | 'azul' | ''
  cumplimiento: string
  calificacion: number
  documentos: number
}

interface AccionMejora {
  id: number
  numeral: string
  criterio: string
  cumplimiento: string
  accionMejora: string
  responsable: string
  fechaLimite: string
  prioridad: 'Alta' | 'Media' | 'Baja'
  estado: 'Pendiente' | 'En proceso' | 'Completada'
}

// ── Criterios completos agrupados ──────────────────────────────────
const criteriosData: Criterio[] = [
  // I PLANEAR - Gestión de Recursos
  { numeral: '1.1.1', grupo: 'I. PLANEAR', criterio: 'Asignar una persona que cumpla con el siguiente perfil para el diseño e implementación del SG-SST.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 2 },
  { numeral: '1.1.2', grupo: 'I. PLANEAR', criterio: 'Asignar y documentar las responsabilidades específicas en el SG-SST a todos los niveles de la organización.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 1 },
  { numeral: '1.1.3', grupo: 'I. PLANEAR', criterio: 'Definir y asignar el talento humano, los recursos financieros, técnicos y tecnológicos requeridos para el SG-SST.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 3 },
  { numeral: '1.1.4', grupo: 'I. PLANEAR', criterio: 'Garantizar que todos los trabajadores están afiliados al Sistema de Seguridad Social en Salud, Pensión y Riesgos Laborales.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 5 },
  { numeral: '1.1.5', grupo: 'I. PLANEAR', criterio: 'Identificar a los trabajadores en actividades de alto riesgo según el Decreto 2090 de 2003 (si aplica).', semaforo: 'azul',     cumplimiento: 'NAJ', calificacion: 0, documentos: 0 },
  { numeral: '1.2.1', grupo: 'I. PLANEAR', criterio: 'Adoptar una política de SST pertinente con la actividad económica y tamaño de la empresa.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 2 },
  { numeral: '1.2.2', grupo: 'I. PLANEAR', criterio: 'Elaborar y ejecutar el programa de capacitación en promoción y prevención incluyendo peligros/riesgos prioritarios.', semaforo: 'amarillo', cumplimiento: 'CP',  calificacion: 2, documentos: 1 },
  // II HACER - Gestión integral del SG-SST
  { numeral: '2.1.1', grupo: 'II. HACER', criterio: 'Realizar la identificación de peligros, evaluación y valoración de riesgos con participación de los trabajadores.', semaforo: 'amarillo', cumplimiento: 'CP',  calificacion: 2, documentos: 1 },
  { numeral: '2.2.1', grupo: 'II. HACER', criterio: 'Establecer un plan de trabajo anual con objetivos, metas, responsables y recursos basados en el diagnóstico inicial.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 3 },
  { numeral: '2.3.1', grupo: 'II. HACER', criterio: 'Implementar y mantener las disposiciones necesarias en materia de prevención y control para el SG-SST.', semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 2 },
  { numeral: '2.4.1', grupo: 'II. HACER', criterio: 'Elaborar el procedimiento para la identificación y evaluación de los requisitos normativos y legales en SST.', semaforo: 'rojo',     cumplimiento: 'NC',  calificacion: 0, documentos: 0 },
  { numeral: '2.5.1', grupo: 'II. HACER', criterio: 'Gestionar el riesgo con Contratistas, subcontratistas, cooperativas de trabajo y otras empresas proveedoras.', semaforo: 'amarillo', cumplimiento: 'CP',  calificacion: 2, documentos: 1 },
  { numeral: '2.6.1', grupo: 'II. HACER', criterio: 'Reportar todos los accidentes de trabajo y enfermedades laborales a la ARL y EPS.',                          semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 4 },
  // III VERIFICAR
  { numeral: '3.1.1', grupo: 'III. VERIFICAR', criterio: 'Realizar auditorías anuales, las cuales deben ser realizadas por personal idóneo conforme al procedimiento definido.', semaforo: 'amarillo', cumplimiento: 'CP',  calificacion: 2, documentos: 1 },
  { numeral: '3.1.2', grupo: 'III. VERIFICAR', criterio: 'Realizar la revisión por la alta dirección que incluya política, organización, planificación, aplicación, evaluación y acciones de mejora.', semaforo: 'rojo', cumplimiento: 'NC', calificacion: 0, documentos: 0 },
  { numeral: '3.2.1', grupo: 'III. VERIFICAR', criterio: 'Investigar todos los incidentes y accidentes de trabajo y las enfermedades laborales cuando sean diagnosticadas.', semaforo: 'verde', cumplimiento: 'CT', calificacion: 4, documentos: 3 },
  // IV ACTUAR - Mejoramiento
  { numeral: '4.1.1', grupo: 'IV. ACTUAR', criterio: 'Implementar las medidas y acciones correctivas de autoridades y de ARL.',                                       semaforo: 'verde',    cumplimiento: 'CT',  calificacion: 4, documentos: 2 },
  { numeral: '4.2.1', grupo: 'IV. ACTUAR', criterio: 'Tomar acciones preventivas y/o correctivas que eliminen las causas fundamentales de no conformidades.',          semaforo: 'amarillo', cumplimiento: 'CP',  calificacion: 2, documentos: 1 },
  { numeral: '4.2.2', grupo: 'IV. ACTUAR', criterio: 'Garantizar que se definan e implementen las acciones preventivas y/o correctivas con base en los resultados de la supervisión.', semaforo: 'amarillo', cumplimiento: 'CP', calificacion: 2, documentos: 0 },
]

// ── Generar acciones de mejora a partir de criterios que lo requieren ──
const initialAcciones: AccionMejora[] = criteriosData
  .filter(c => c.cumplimiento === 'CP' || c.cumplimiento === 'NC')
  .map((c, i) => ({
    id: i + 1,
    numeral: c.numeral,
    criterio: c.criterio,
    cumplimiento: c.cumplimiento,
    accionMejora: c.cumplimiento === 'NC'
      ? 'Diseñar e implementar procedimiento documentado'
      : 'Completar la implementación y generar evidencias documentales',
    responsable: 'Coordinador SST',
    fechaLimite: c.cumplimiento === 'NC' ? '2026-06-30' : '2026-04-30',
    prioridad: c.cumplimiento === 'NC' ? 'Alta' : 'Media',
    estado: 'Pendiente' as const,
  }))

const cumplimientos = [
  { value: 'CT',  label: 'CT - Cumple totalmente' },
  { value: 'CP',  label: 'CP - Cumple parcialmente' },
  { value: 'NC',  label: 'NC - No cumple' },
  { value: 'NAJ', label: 'NAJ - No aplica justificado' },
  { value: 'NAS', label: 'NAS - No aplica no justificado' },
]

const barData = {
  labels: ['I. PLANEAR', 'II. HACER', 'III. VERIFICAR', 'IV. ACTUAR'],
  datasets: [{
    label: 'Cumplimiento (%)',
    data: [78, 62, 50, 60],
    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
    borderRadius: 4,
  }],
}
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { callback: (v: any) => v + '%', color: '#6b7280', font: { size: 11 } },
      grid: { color: '#e5e7eb' },
    },
    x: { ticks: { color: '#6b7280', font: { size: 10 } }, grid: { display: false } },
  },
}

// ── helpers ────────────────────────────────────────────────────────
const semaforoBg: Record<string, string> = {
  verde: 'bg-green-500', amarillo: 'bg-yellow-400', rojo: 'bg-red-500', azul: 'bg-blue-500',
}
const cumplimientoBadge: Record<string, string> = {
  CT: 'bg-green-100 text-green-700', CP: 'bg-yellow-100 text-yellow-700',
  NC: 'bg-red-100 text-red-700', NAJ: 'bg-blue-100 text-blue-700', NAS: 'bg-gray-100 text-gray-600',
}
const prioridadBadge: Record<string, string> = {
  Alta: 'bg-red-100 text-red-700', Media: 'bg-yellow-100 text-yellow-700', Baja: 'bg-green-100 text-green-700',
}
const estadoBadge: Record<string, string> = {
  Pendiente: 'bg-gray-100 text-gray-600', 'En proceso': 'bg-blue-100 text-blue-700', Completada: 'bg-green-100 text-green-700',
}

// ═══════════════════════════════════════════════════════════════════
export default function MatrizLegal() {
  const [activeTab, setActiveTab]           = useState<TabType>('estandares')
  const [periodo, setPeriodo]               = useState('2026-01')
  const [cumplimientoMasivo, setCumplimientoMasivo] = useState('')
  const [acciones, setAcciones]             = useState<AccionMejora[]>(initialAcciones)
  const [editAccion, setEditAccion]         = useState<AccionMejora | null>(null)
  const [searchEst, setSearchEst]           = useState('')
  const [searchInf, setSearchInf]           = useState('')
  const [grupoFiltro, setGrupoFiltro]       = useState('')
  const [matrizSearch, setMatrizSearch]     = useState('')

  // stats
  const total  = criteriosData.filter(c => c.cumplimiento !== 'NAJ' && c.cumplimiento !== 'NAS').length
  const ct     = criteriosData.filter(c => c.cumplimiento === 'CT').length
  const cp     = criteriosData.filter(c => c.cumplimiento === 'CP').length
  const nc     = criteriosData.filter(c => c.cumplimiento === 'NC').length
  const general = Math.round((ct / total) * 100)
  const parcial = Math.round(((ct + cp * 0.5) / total) * 100)

  const grupos = ['I. PLANEAR', 'II. HACER', 'III. VERIFICAR', 'IV. ACTUAR']

  const filteredEst = criteriosData.filter(c =>
    c.criterio.toLowerCase().includes(searchEst.toLowerCase()) ||
    c.numeral.includes(searchEst)
  )
  const filteredInf = acciones.filter(a =>
    a.criterio.toLowerCase().includes(searchInf.toLowerCase()) ||
    a.numeral.includes(searchInf)
  )
  const filteredMat = criteriosData.filter(c =>
    (c.criterio.toLowerCase().includes(matrizSearch.toLowerCase()) || c.numeral.includes(matrizSearch)) &&
    (grupoFiltro === '' || c.grupo === grupoFiltro)
  )

  const handleGuardarAccion = () => {
    if (!editAccion) return
    setAcciones(prev => prev.map(a => a.id === editAccion.id ? editAccion : a))
    setEditAccion(null)
    toast.success('Acción de mejora actualizada')
  }

  const handleEstablecerCumplimiento = () => {
    if (!cumplimientoMasivo) { toast.error('Seleccione un tipo de cumplimiento'); return }
    toast.success(`Cumplimiento "${cumplimientoMasivo}" establecido masivamente para numerales sin evaluar`)
  }

  // ── shared ──────────────────────────────────────────────────────
  const TabBtn = ({ id, label }: { id: TabType; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        activeTab === id
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          CumplimientoPeriodo: Visualizar matriz legal SG-SST de un periodo
        </h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-full shrink-0">
            <FaInfoCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              ¿Para qué es este formulario de visualizar matriz legal SG-SST de un periodo?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              En este formulario podrás visualizar la matriz legal de la empresa según el periodo que has seleccionado anteriormente.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        <nav className="flex space-x-2">
          <TabBtn id="estandares" label="Estándares mínimos" />
          <TabBtn id="informe"    label="Informe acciones de mejora definidas" />
          <TabBtn id="matriz"     label="Matriz general" />
          <TabBtn id="operaciones" label="Operaciones masivas" />
        </nav>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: ESTÁNDARES MÍNIMOS                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'estandares' && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Periodo:</span>
            <select value={periodo} onChange={e => setPeriodo(e.target.value)} className="form-select">
              {['2026-01','2025-02','2025-01','2024-02','2024-01','2023-02','2023-01','2022-01'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Diagnóstico inicial</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">{ct}</div>
                  <div className="text-green-600 dark:text-green-500">CT</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded p-2">
                  <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{cp}</div>
                  <div className="text-yellow-600 dark:text-yellow-500">CP</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
                  <div className="text-lg font-bold text-red-700 dark:text-red-400">{nc}</div>
                  <div className="text-red-600 dark:text-red-500">NC</div>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
                <p className="text-base font-semibold text-green-800 dark:text-green-200">Completado general: {general}%</p>
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Completado parcial: {parcial}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                El porcentaje que es tenido en cuenta es el completado general.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-xs font-medium transition-colors w-full justify-center">
                <FaInfoCircle />Ayuda: Resultados de la evaluación
              </button>
            </div>

            {/* Bar chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">Cumplimiento por grupo</h3>
              <div className="h-56"><Bar data={barData} options={barOptions} /></div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Convenciones semáforo</h3>
              <div className="space-y-2 text-sm">
                {[['verde','bg-green-500','Cumple totalmente (CT)'], ['amarillo','bg-yellow-400','Cumple parcialmente (CP)'], ['rojo','bg-red-500','No cumple (NC)'], ['azul','bg-blue-500','No aplica justificado (NAJ)']].map(([, bg, label]) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${bg} shrink-0`} />
                    <span className="text-gray-600 dark:text-gray-400 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Mostrando</span>
                <select className="form-select py-1 text-sm w-20"><option>10</option><option>25</option><option>50</option></select>
                <span>resultados por página</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Buscar:</span>
                <input type="text" value={searchEst} onChange={e => setSearchEst(e.target.value)} className="form-input py-1 text-sm w-40" placeholder="Numeral o criterio..." />
                <button onClick={() => toast('Exportando...')} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1">
                  <FaDownload className="w-3 h-3" /> Excel
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {['Numeral','Criterio','Semaforo','Cumplimiento','Calificación','Documentos','Acciones'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredEst.map(item => (
                    <tr key={item.numeral} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{item.numeral}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs leading-relaxed max-w-md">{item.criterio}</td>
                      <td className="px-4 py-3 text-center">
                        <div className={`inline-block w-4 h-4 rounded-full ${item.semaforo ? semaforoBg[item.semaforo] : 'bg-gray-300'}`} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.cumplimiento && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${cumplimientoBadge[item.cumplimiento] ?? 'bg-gray-100 text-gray-600'}`}>
                            {item.cumplimiento}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 font-medium">{item.calificacion}</td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{item.documentos}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600" title="Editar"><FaEdit className="w-3 h-3" /></button>
                          <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600" title="Configurar"><FaCog className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total registros: {filteredEst.length}</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded opacity-50" disabled>Previo</button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">Siguiente</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: INFORME ACCIONES DE MEJORA                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'informe' && (
        <>
          {/* summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total acciones', value: acciones.length, color: 'blue' },
              { label: 'En proceso', value: acciones.filter(a => a.estado === 'En proceso').length, color: 'yellow' },
              { label: 'Completadas', value: acciones.filter(a => a.estado === 'Completada').length, color: 'green' },
            ].map(card => (
              <div key={card.label} className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 ${card.color === 'blue' ? 'border-blue-500' : card.color === 'yellow' ? 'border-yellow-400' : 'border-green-500'} border border-gray-200 dark:border-gray-700`}>
                <div className={`text-2xl font-bold ${card.color === 'blue' ? 'text-blue-600' : card.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>{card.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</div>
              </div>
            ))}
          </div>

          {/* table toolbar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Mostrando</span>
                <select className="form-select py-1 text-sm w-20"><option>10</option><option>25</option></select>
                <span>resultados por página</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Buscar:</span>
                <input className="form-input py-1 text-sm w-40" value={searchInf} onChange={e => setSearchInf(e.target.value)} placeholder="Numeral o criterio..." />
                <button onClick={() => toast('Exportando acciones...')} className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1">
                  <FaDownload className="w-3 h-3" /> Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {['Numeral','Criterio','Estado actual','Acción de mejora','Responsable','Fecha límite','Prioridad','Estado','Acciones'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInf.map(acc => (
                    <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">{acc.numeral}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-xs">{acc.criterio}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${cumplimientoBadge[acc.cumplimiento] ?? 'bg-gray-100 text-gray-600'}`}>
                          {acc.cumplimiento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-xs">{acc.accionMejora}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{acc.responsable}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{acc.fechaLimite}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${prioridadBadge[acc.prioridad]}`}>{acc.prioridad}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${estadoBadge[acc.estado]}`}>{acc.estado}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditAccion(acc)}
                          className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600"
                          title="Editar acción"
                        >
                          <FaEdit className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInf.length === 0 && (
                <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                  No hay acciones de mejora que coincidan con la búsqueda
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total acciones de mejora: {filteredInf.length}</p>
            </div>
          </div>

          {/* edit modal */}
          {editAccion && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg shadow-xl">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-800 dark:text-white">Editar acción de mejora — {editAccion.numeral}</h2>
                  <button onClick={() => setEditAccion(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><FaTimes /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Acción de mejora</label>
                    <textarea
                      className="form-input w-full h-20 resize-none"
                      value={editAccion.accionMejora}
                      onChange={e => setEditAccion({ ...editAccion, accionMejora: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Responsable</label>
                      <input className="form-input w-full" value={editAccion.responsable} onChange={e => setEditAccion({ ...editAccion, responsable: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Fecha límite</label>
                      <input type="date" className="form-input w-full" value={editAccion.fechaLimite} onChange={e => setEditAccion({ ...editAccion, fechaLimite: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                      <select className="form-select w-full" value={editAccion.prioridad} onChange={e => setEditAccion({ ...editAccion, prioridad: e.target.value as AccionMejora['prioridad'] })}>
                        <option>Alta</option><option>Media</option><option>Baja</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                      <select className="form-select w-full" value={editAccion.estado} onChange={e => setEditAccion({ ...editAccion, estado: e.target.value as AccionMejora['estado'] })}>
                        <option>Pendiente</option><option>En proceso</option><option>Completada</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                  <button onClick={() => setEditAccion(null)} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                  <button onClick={handleGuardarAccion} className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1">
                    <FaCheck className="w-3 h-3" /> Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: MATRIZ GENERAL                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'matriz' && (
        <>
          {/* totals */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Total ítems', value: criteriosData.length, cls: 'border-gray-400 text-gray-700' },
              { label: 'Cumple (CT)', value: ct,  cls: 'border-green-500 text-green-700' },
              { label: 'Parcial (CP)', value: cp, cls: 'border-yellow-400 text-yellow-700' },
              { label: 'No cumple (NC)', value: nc, cls: 'border-red-500 text-red-700' },
              { label: 'No aplica (NAJ)', value: criteriosData.filter(c => c.cumplimiento === 'NAJ').length, cls: 'border-blue-500 text-blue-700' },
            ].map(card => (
              <div key={card.label} className={`bg-white dark:bg-gray-800 rounded-lg p-3 border-l-4 border border-gray-200 dark:border-gray-700 ${card.cls.split(' ')[0]}`}>
                <div className={`text-xl font-bold ${card.cls.split(' ')[1]}`}>{card.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</div>
              </div>
            ))}
          </div>

          {/* filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4 p-3 flex flex-wrap items-center gap-3">
            <FaFilter className="text-gray-400 text-sm" />
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Grupo:</label>
              <select className="form-select py-1 text-sm" value={grupoFiltro} onChange={e => setGrupoFiltro(e.target.value)}>
                <option value="">Todos</option>
                {grupos.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Buscar:</label>
              <input className="form-input py-1 text-sm w-44" value={matrizSearch} onChange={e => setMatrizSearch(e.target.value)} placeholder="Numeral o criterio..." />
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={() => toast('Exportando PDF...')} className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1"><FaDownload className="w-3 h-3" /> PDF</button>
              <button onClick={() => toast('Exportando Excel...')} className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"><FaDownload className="w-3 h-3" /> Excel</button>
            </div>
          </div>

          {/* grouped table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    {['Numeral','Grupo','Criterio','Semáforo','Cumplimiento','Calificación','Docs','Acciones'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grupos
                    .filter(g => grupoFiltro === '' || g === grupoFiltro)
                    .map(grupo => {
                      const rows = filteredMat.filter(c => c.grupo === grupo)
                      if (rows.length === 0) return null
                      const grupoCalif = rows.reduce((s, c) => s + c.calificacion, 0)
                      const grupoMax   = rows.filter(c => c.cumplimiento !== 'NAJ' && c.cumplimiento !== 'NAS').length * 4
                      const grupoPct   = grupoMax > 0 ? Math.round((grupoCalif / grupoMax) * 100) : 0
                      return [
                        <tr key={`header-${grupo}`} className="bg-blue-600 text-white">
                          <td colSpan={6} className="px-4 py-2 font-semibold text-sm">{grupo}</td>
                          <td colSpan={2} className="px-4 py-2 text-xs text-right">Cumplimiento: {grupoPct}%</td>
                        </tr>,
                        ...rows.map((item, i) => (
                          <tr key={item.numeral} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/30'}>
                            <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{item.numeral}</td>
                            <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.grupo}</td>
                            <td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400 max-w-sm">{item.criterio}</td>
                            <td className="px-4 py-2.5 text-center">
                              <div className={`inline-block w-4 h-4 rounded-full ${item.semaforo ? semaforoBg[item.semaforo] : 'bg-gray-300'}`} />
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              {item.cumplimiento && (
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${cumplimientoBadge[item.cumplimiento] ?? 'bg-gray-100 text-gray-600'}`}>
                                  {item.cumplimiento}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-center font-medium text-gray-700 dark:text-gray-300">{item.calificacion}</td>
                            <td className="px-4 py-2.5 text-center text-gray-600 dark:text-gray-400">{item.documentos}</td>
                            <td className="px-4 py-2.5">
                              <div className="flex gap-1">
                                <button className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600" title="Editar"><FaEdit className="w-3 h-3" /></button>
                                <button className="p-1.5 bg-teal-500 text-white rounded hover:bg-teal-600" title="Ver documentos"><FaEye className="w-3 h-3" /></button>
                              </div>
                            </td>
                          </tr>
                        )),
                      ]
                    })}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {filteredMat.length} de {criteriosData.length} ítems — Calificación total: {criteriosData.reduce((s, c) => s + c.calificacion, 0)} / {criteriosData.filter(c => c.cumplimiento !== 'NAJ' && c.cumplimiento !== 'NAS').length * 4}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cumplimiento general:</span>
                <span className={`text-lg font-bold ${general >= 80 ? 'text-green-600' : general >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{general}%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB: OPERACIONES MASIVAS                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeTab === 'operaciones' && (
        <div className="space-y-6">
          {/* info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex gap-3">
            <FaExclamationTriangle className="text-yellow-500 text-lg shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Utilice esta opción cuando quiera establecer el cumplimiento del periodo o la matriz masivamente para los numerales <strong>sin evaluar</strong>. Esta acción no sobreescribirá ítems ya evaluados.
            </p>
          </div>

          {/* establecer cumplimiento masivo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FaPlus className="text-blue-500" /> Establecer cumplimiento masivo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Aplica el mismo tipo de cumplimiento a todos los numerales que aún no han sido evaluados ({criteriosData.filter(c => !c.cumplimiento).length} ítems sin evaluar actualmente).
            </p>
            <div className="flex items-end gap-4 flex-wrap">
              <div className="flex-1 max-w-sm">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cumplimiento:</label>
                <select value={cumplimientoMasivo} onChange={e => setCumplimientoMasivo(e.target.value)} className="form-select w-full">
                  <option value="">Seleccione uno</option>
                  {cumplimientos.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <button
                onClick={handleEstablecerCumplimiento}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Establecer cumplimiento
              </button>
            </div>
          </div>

          {/* resumen estado actual */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Resumen estado actual del periodo</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {['Grupo','Ítems totales','CT','CP','NC','NAJ','Sin evaluar','Cumplimiento %'].map(col => (
                      <th key={col} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {grupos.map(grupo => {
                    const rows = criteriosData.filter(c => c.grupo === grupo)
                    const ctG  = rows.filter(c => c.cumplimiento === 'CT').length
                    const cpG  = rows.filter(c => c.cumplimiento === 'CP').length
                    const ncG  = rows.filter(c => c.cumplimiento === 'NC').length
                    const najG = rows.filter(c => c.cumplimiento === 'NAJ').length
                    const sinG = rows.filter(c => !c.cumplimiento).length
                    const maxG = rows.filter(c => c.cumplimiento !== 'NAJ' && c.cumplimiento !== 'NAS').length * 4
                    const calG = rows.reduce((s, c) => s + c.calificacion, 0)
                    const pctG = maxG > 0 ? Math.round((calG / maxG) * 100) : 0
                    return (
                      <tr key={grupo} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300">{grupo}</td>
                        <td className="px-4 py-2 text-center">{rows.length}</td>
                        <td className="px-4 py-2 text-center text-green-600 font-medium">{ctG}</td>
                        <td className="px-4 py-2 text-center text-yellow-600 font-medium">{cpG}</td>
                        <td className="px-4 py-2 text-center text-red-600 font-medium">{ncG}</td>
                        <td className="px-4 py-2 text-center text-blue-600 font-medium">{najG}</td>
                        <td className="px-4 py-2 text-center text-gray-500">{sinG}</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`font-semibold ${pctG >= 80 ? 'text-green-600' : pctG >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{pctG}%</span>
                        </td>
                      </tr>
                    )
                  })}
                  {/* total row */}
                  <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                    <td className="px-4 py-2 text-gray-800 dark:text-white">TOTAL</td>
                    <td className="px-4 py-2 text-center">{criteriosData.length}</td>
                    <td className="px-4 py-2 text-center text-green-700">{ct}</td>
                    <td className="px-4 py-2 text-center text-yellow-700">{cp}</td>
                    <td className="px-4 py-2 text-center text-red-700">{nc}</td>
                    <td className="px-4 py-2 text-center text-blue-700">{criteriosData.filter(c => c.cumplimiento === 'NAJ').length}</td>
                    <td className="px-4 py-2 text-center text-gray-600">{criteriosData.filter(c => !c.cumplimiento).length}</td>
                    <td className="px-4 py-2 text-center">
                      <span className={`font-bold ${general >= 80 ? 'text-green-600' : general >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{general}%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('estandares')}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              Regresar a Estándares mínimos
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
