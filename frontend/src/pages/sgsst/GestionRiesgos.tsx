import { useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import {
  FaRobot, FaPlus, FaTable, FaExchangeAlt, FaFileImport,
  FaFileAlt, FaFileCsv, FaLink, FaHome, FaSyncAlt,
  FaExclamationTriangle, FaQuestionCircle, FaCalendarAlt,
  FaEdit, FaEye, FaTrash, FaInfoCircle, FaTimes, FaCheck,
  FaSave, FaChevronRight, FaFilter,
} from 'react-icons/fa'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'ingresar' | 'maestro' | 'periodos' | 'importacion' | 'resumen' | 'maestroCSV' | 'matrices'
type FormStep = 1 | 2 | 3

interface Riesgo {
  id: number
  codigo: string
  titulo: string
  fechaId: string
  proceso: string
  sede: string
  area: string
  lugar: string
  clasificacion: string
  subclasificacion: string
  causaRaiz: string
  rutinaria: boolean
  zonaComun: string
  cargos: string
  perfilGES: string
  actividad: string
  // evaluación
  nivelDeficiencia: string
  nivelExposicion: string
  nivelProbabilidad: string
  nivelConsecuencia: string
  nivelRiesgo: string
  // gestión
  tipoControl: string
  controlesExistentes: string
  controlesPropuestos: string
  responsable: string
  fechaEjecucion: string
  estado: string
}

// ── Mock data ──────────────────────────────────────────────────────
const initialRiesgos: Riesgo[] = [
  { id: 1, codigo: 'R-001', titulo: 'Caída desde alturas en operaciones de montaje', fechaId: '2025-03-15', proceso: 'Operativo', sede: 'Sede Principal', area: 'Producción', lugar: 'Zona de montaje', clasificacion: 'De seguridad', subclasificacion: 'Trabajo en alturas', causaRaiz: 'Ausencia de barandillas y anclajes seguros', rutinaria: false, zonaComun: 'Área de producción', cargos: 'Operario', perfilGES: 'Operario de montaje', actividad: 'Instalación de estructuras metálicas', nivelDeficiencia: 'Muy Alta', nivelExposicion: 'Frecuente', nivelProbabilidad: 'Muy Alto', nivelConsecuencia: 'Mortal o catastrófica', nivelRiesgo: 'I - No aceptable', tipoControl: 'Controles de ingeniería', controlesExistentes: 'Arnés de seguridad', controlesPropuestos: 'Instalación de barandillas permanentes', responsable: 'Coordinador SST', fechaEjecucion: '2026-04-30', estado: 'En gestión' },
  { id: 2, codigo: 'R-002', titulo: 'Exposición a ruido en área de manufactura', fechaId: '2025-04-10', proceso: 'Operativo', sede: 'Sede Principal', area: 'Producción', lugar: 'Taller de manufactura', clasificacion: 'Físico', subclasificacion: 'Ruido', causaRaiz: 'Maquinaria sin aislamiento acústico', rutinaria: true, zonaComun: 'Taller', cargos: 'Operario', perfilGES: 'Técnico de manufactura', actividad: 'Operación de maquinaria industrial', nivelDeficiencia: 'Alta', nivelExposicion: 'Continua', nivelProbabilidad: 'Alto', nivelConsecuencia: 'Muy grave', nivelRiesgo: 'II - No aceptable o aceptable con control', tipoControl: 'EPP', controlesExistentes: 'Protección auditiva tipo copa', controlesPropuestos: 'Encapsulamiento de equipos ruidosos', responsable: 'Jefe de Producción', fechaEjecucion: '2026-06-30', estado: 'Activo' },
  { id: 3, codigo: 'R-003', titulo: 'Postura inadecuada en trabajo de oficina', fechaId: '2025-05-20', proceso: 'Gestión Administrativa', sede: 'Sede Norte', area: 'Administración', lugar: 'Oficina administrativa', clasificacion: 'Biomecánico', subclasificacion: 'Posturas inadecuadas', causaRaiz: 'Sillas ergonómicas inadecuadas y falta de capacitación', rutinaria: true, zonaComun: 'Oficina', cargos: 'Profesional', perfilGES: 'Auxiliar administrativo', actividad: 'Trabajo continuo en computador', nivelDeficiencia: 'Media', nivelExposicion: 'Continua', nivelProbabilidad: 'Medio', nivelConsecuencia: 'Grave', nivelRiesgo: 'III - Aceptable', tipoControl: 'Controles administrativos', controlesExistentes: 'Pausas activas programadas', controlesPropuestos: 'Adquisición de sillas ergonómicas certificadas', responsable: 'Recursos Humanos', fechaEjecucion: '2026-03-31', estado: 'En gestión' },
  { id: 4, codigo: 'R-004', titulo: 'Contacto con sustancias químicas peligrosas', fechaId: '2025-06-01', proceso: 'Operativo', sede: 'Sede Principal', area: 'Laboratorio', lugar: 'Área química', clasificacion: 'Químico', subclasificacion: 'Líquidos corrosivos', causaRaiz: 'Falta de EPP específico y señalización', rutinaria: false, zonaComun: 'Bodega', cargos: 'Técnico', perfilGES: 'Técnico de laboratorio', actividad: 'Manejo de reactivos químicos', nivelDeficiencia: 'Alta', nivelExposicion: 'Frecuente', nivelProbabilidad: 'Alto', nivelConsecuencia: 'Muy grave', nivelRiesgo: 'II - No aceptable o aceptable con control', tipoControl: 'EPP', controlesExistentes: 'Guantes de nitrilo', controlesPropuestos: 'Cabina de extracción y traje de protección completo', responsable: 'Coordinador SST', fechaEjecucion: '2026-05-31', estado: 'Activo' },
  { id: 5, codigo: 'R-005', titulo: 'Riesgo psicosocial por alta carga laboral', fechaId: '2025-07-15', proceso: 'Gestión Administrativa', sede: 'Sede Sur', area: 'Recursos Humanos', lugar: 'Área administrativa', clasificacion: 'Psicosocial', subclasificacion: 'Carga de trabajo', causaRaiz: 'Distribución inadecuada de funciones y horas extra frecuentes', rutinaria: true, zonaComun: 'Oficina', cargos: 'Profesional', perfilGES: 'Coordinador RRHH', actividad: 'Gestión de personal', nivelDeficiencia: 'Media', nivelExposicion: 'Frecuente', nivelProbabilidad: 'Medio', nivelConsecuencia: 'Grave', nivelRiesgo: 'III - Aceptable', tipoControl: 'Controles administrativos', controlesExistentes: 'Programa de bienestar laboral', controlesPropuestos: 'Redistribución de cargas y flexibilización horaria', responsable: 'Recursos Humanos', fechaEjecucion: '2026-04-30', estado: 'En gestión' },
  { id: 6, codigo: 'R-006', titulo: 'Riesgo eléctrico por instalaciones antiguas', fechaId: '2025-08-01', proceso: 'Mantenimiento', sede: 'Sede Principal', area: 'Mantenimiento', lugar: 'Sala eléctrica', clasificacion: 'Eléctrico', subclasificacion: 'Alta tensión', causaRaiz: 'Instalaciones eléctricas obsoletas sin mantenimiento preventivo', rutinaria: false, zonaComun: 'Bodega', cargos: 'Técnico', perfilGES: 'Técnico electricista', actividad: 'Mantenimiento de instalaciones eléctricas', nivelDeficiencia: 'Alta', nivelExposicion: 'Ocasional', nivelProbabilidad: 'Alto', nivelConsecuencia: 'Mortal o catastrófica', nivelRiesgo: 'I - No aceptable', tipoControl: 'Controles de ingeniería', controlesExistentes: 'Bloqueo y etiquetado (LOTO)', controlesPropuestos: 'Reemplazo de tableros eléctricos obsoletos', responsable: 'Jefe de Mantenimiento', fechaEjecucion: '2026-07-31', estado: 'Activo' },
]

// ── Opciones estáticas ─────────────────────────────────────────────
const procesos      = ['Gestión Administrativa', 'Operativo', 'Logística', 'Mantenimiento', 'Recursos Humanos', 'Calidad', 'Producción']
const zonasComunes  = ['Oficina', 'Bodega', 'Taller', 'Área de producción', 'Parqueadero', 'Cafetería', 'Baños', 'Sala eléctrica', 'Laboratorio']
const clasificaciones: Record<string, string[]> = {
  'Físico': ['Ruido', 'Vibración', 'Temperatura extrema', 'Iluminación', 'Radiaciones ionizantes', 'Radiaciones no ionizantes'],
  'Químico': ['Polvos', 'Humos', 'Líquidos corrosivos', 'Gases y vapores', 'Aerosoles', 'Fibras'],
  'Biológico': ['Virus', 'Bacterias', 'Hongos', 'Animales', 'Vegetales'],
  'Biomecánico': ['Posturas inadecuadas', 'Esfuerzo', 'Movimiento repetitivo', 'Manipulación de cargas'],
  'De seguridad': ['Trabajo en alturas', 'Espacios confinados', 'Incendio y explosión', 'Manejo de herramientas', 'Orden y aseo', 'Transporte'],
  'Psicosocial': ['Carga de trabajo', 'Jornada de trabajo', 'Liderazgo', 'Relaciones sociales', 'Control del trabajo'],
  'Eléctrico': ['Alta tensión', 'Baja tensión', 'Estática'],
  'Locativo': ['Pisos', 'Techos', 'Instalaciones', 'Almacenamiento'],
  'Mecánico': ['Máquinas sin protección', 'Herramientas defectuosas', 'Piezas en movimiento'],
  'Fenómenos naturales': ['Sismo', 'Inundación', 'Derrumbe', 'Tormenta eléctrica'],
}
const nivelesDeficiencia  = ['Muy Alta (10)', 'Alta (6)', 'Media (2)', 'Baja (1)']
const nivelesExposicion   = ['Continua (4)', 'Frecuente (3)', 'Ocasional (2)', 'Esporádica (1)']
const nivelesProbabilidad = ['Muy Alto (>40)', 'Alto (20-40)', 'Medio (8-20)', 'Bajo (<8)']
const nivelesConsecuencia = ['Mortal o catastrófica (100)', 'Muy grave (60)', 'Grave (25)', 'Leve (10)']
const nivelesRiesgo       = ['I - No aceptable', 'II - No aceptable o aceptable con control', 'III - Aceptable', 'IV - Aceptable']
const tiposControl        = ['Eliminación', 'Sustitución', 'Controles de ingeniería', 'Controles administrativos', 'EPP']
const estadosRiesgo       = ['Activo', 'En gestión', 'Controlado', 'Eliminado']
const periodos            = ['2026-01', '2025-02', '2025-01', '2024-02', '2024-01', '2023-02', '2023-01']

// ── Charts ─────────────────────────────────────────────────────────
const mkBarChart = (labels: string[], data: number[], colors: string[]) => ({
  labels,
  datasets: [{ data, backgroundColor: colors, borderRadius: 4 }],
})
const mkPieChart = (labels: string[], data: number[], colors: string[]) => ({
  labels,
  datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }],
})
const chartOpts = (horizontal = false) => ({
  responsive: true, maintainAspectRatio: false,
  indexAxis: (horizontal ? 'y' : 'x') as 'x' | 'y',
  plugins: { legend: { display: false } },
  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f0f0f0' } } },
})
const pieOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'bottom' as const } } }

const emptyForm: Omit<Riesgo, 'id'> = {
  codigo: '', titulo: '', fechaId: '2026-03-23', proceso: '', sede: '', area: '', lugar: '',
  clasificacion: '', subclasificacion: '', causaRaiz: '', rutinaria: true, zonaComun: '', cargos: '', perfilGES: '', actividad: '',
  nivelDeficiencia: '', nivelExposicion: '', nivelProbabilidad: '', nivelConsecuencia: '', nivelRiesgo: '',
  tipoControl: '', controlesExistentes: '', controlesPropuestos: '', responsable: '', fechaEjecucion: '', estado: 'Activo',
}

// ── helpers ────────────────────────────────────────────────────────
const nivelRiesgoBadge: Record<string, string> = {
  'I - No aceptable': 'bg-red-100 text-red-700',
  'II - No aceptable o aceptable con control': 'bg-orange-100 text-orange-700',
  'III - Aceptable': 'bg-yellow-100 text-yellow-700',
  'IV - Aceptable': 'bg-green-100 text-green-700',
}
const estadoBadge: Record<string, string> = {
  Activo: 'bg-blue-100 text-blue-700',
  'En gestión': 'bg-yellow-100 text-yellow-700',
  Controlado: 'bg-green-100 text-green-700',
  Eliminado: 'bg-gray-100 text-gray-600',
}

// ═══════════════════════════════════════════════════════════════════
export default function GestionRiesgos() {
  const [view, setView]         = useState<View>('dashboard')
  const [step, setStep]         = useState<FormStep>(1)
  const [riesgos, setRiesgos]   = useState<Riesgo[]>(initialRiesgos)
  const [form, setForm]         = useState<Omit<Riesgo, 'id'>>(emptyForm)
  const [editId, setEditId]     = useState<number | null>(null)
  const [search, setSearch]     = useState('')
  const [showFiltro, setShowFiltro] = useState(false)
  const [filtroClasif, setFiltroClasif] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [periodoOrigen, setPeriodoOrigen] = useState('')
  const [metodo1, setMetodo1]   = useState('')
  const [metodo2, setMetodo2]   = useState('')
  const [archivoBulk, setArchivoBulk] = useState<File | null>(null)
  const [viewRiesgo, setViewRiesgo] = useState<Riesgo | null>(null)

  // stats for charts
  const byClasif = Object.keys(clasificaciones).map(k => riesgos.filter(r => r.clasificacion === k).length)
  const byEstado = ['Activo', 'En gestión', 'Controlado', 'Eliminado'].map(e => riesgos.filter(r => r.estado === e).length)
  const byImpacto = ['Mortal o catastrófica', 'Muy grave', 'Grave', 'Leve'].map(n => riesgos.filter(r => r.nivelConsecuencia.startsWith(n)).length)
  const byProb  = ['Muy Alto', 'Alto', 'Medio', 'Bajo'].map(n => riesgos.filter(r => r.nivelProbabilidad.startsWith(n)).length)
  const byExpos = ['Continua', 'Frecuente', 'Ocasional', 'Esporádica'].map(n => riesgos.filter(r => r.nivelExposicion.startsWith(n)).length)

  const clasifChart   = mkBarChart(Object.keys(clasificaciones), byClasif, ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#6366f1','#14b8a6','#ec4899'])
  const estadoChart   = mkPieChart(['Activo','En gestión','Controlado','Eliminado'], byEstado, ['#3b82f6','#f59e0b','#10b981','#9ca3af'])
  const impactoChart  = mkBarChart(['Mortal','Muy grave','Grave','Leve'], byImpacto, ['#ef4444','#f97316','#f59e0b','#10b981'])
  const probChart     = mkPieChart(['Muy Alto','Alto','Medio','Bajo'], byProb, ['#ef4444','#f97316','#f59e0b','#10b981'])
  const exposChart    = mkBarChart(['Continua','Frecuente','Ocasional','Esporádica'], byExpos, ['#ef4444','#f97316','#f59e0b','#10b981'])

  const filtered = riesgos.filter(r => {
    const matchSearch = r.titulo.toLowerCase().includes(search.toLowerCase()) || r.codigo.toLowerCase().includes(search.toLowerCase())
    const matchClasif = filtroClasif === '' || r.clasificacion === filtroClasif
    const matchEstado = filtroEstado === '' || r.estado === filtroEstado
    return matchSearch && matchClasif && matchEstado
  })

  const handleEdit = (r: Riesgo) => {
    const { id: _, ...rest } = r
    setForm(rest); setEditId(r.id); setStep(1); setView('ingresar')
  }
  const handleDelete = (id: number) => {
    setRiesgos(prev => prev.filter(r => r.id !== id))
    toast.success('Riesgo eliminado')
  }
  const handleGuardar = () => {
    if (!form.titulo || !form.clasificacion) { toast.error('Título y Clasificación son requeridos'); return }
    if (editId) {
      setRiesgos(prev => prev.map(r => r.id === editId ? { id: editId, ...form } : r))
      toast.success('Riesgo actualizado')
    } else {
      setRiesgos(prev => [...prev, { id: prev.length + 1, ...form }])
      toast.success('Riesgo registrado')
    }
    setForm(emptyForm); setEditId(null); setStep(1); setView('dashboard')
  }

  // ── shared ──────────────────────────────────────────────────────
  const warnBtn = 'px-2 py-1.5 bg-yellow-400 border border-yellow-400 rounded text-white text-xs'
  const helpBtn = 'px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-200'
  const fieldLabel = 'block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'

  // ═══════════════════════════════════════════════════════════════
  // ACTION BAR (shared across views)
  // ═══════════════════════════════════════════════════════════════
  const ActionBar = () => (
    <div className="bg-white border-b border-gray-200 px-3 py-2 flex flex-wrap gap-2 items-center">
      <button onClick={() => toast('Asistente en desarrollo')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
        <FaRobot /> Asistente
      </button>
      <button onClick={() => { setForm(emptyForm); setEditId(null); setStep(1); setView('ingresar') }} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
        <FaPlus /> Ingresar riesgo
      </button>
      <button onClick={() => setView('maestro')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
        <FaTable /> Maestro Navegable
      </button>
      <button onClick={() => setView('periodos')} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600">
        <FaExchangeAlt /> Gestión de riesgos entre periodos
      </button>
      <button onClick={() => setView('importacion')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded text-xs hover:bg-teal-700">
        <FaFileImport /> Importación de riesgos
      </button>
      <button onClick={() => setView('resumen')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">
        <FaFileAlt /> Resumen matriz de peligro
      </button>
      <button onClick={() => setView('maestroCSV')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
        <FaFileCsv /> Maestro en CSV
      </button>
      <button onClick={() => setView('matrices')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300">
        <FaLink /> MATRICES DE PELIGRO
      </button>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════
  if (view === 'dashboard') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">Riesgos: Menú gestión de riesgos</div>
      <ActionBar />

      <div className="p-4">
        <div className="flex gap-4">
          {/* left panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded border border-gray-200 p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Estadística rápida</h2>
                <div className="flex gap-3 text-sm">
                  {[{label:'Total riesgos', val: riesgos.length, cls:'text-blue-600'}, {label:'Activos', val: riesgos.filter(r=>r.estado==='Activo').length, cls:'text-orange-600'}, {label:'En gestión', val: riesgos.filter(r=>r.estado==='En gestión').length, cls:'text-yellow-600'}, {label:'Controlados', val: riesgos.filter(r=>r.estado==='Controlado').length, cls:'text-green-600'}].map(s => (
                    <div key={s.label} className="text-center">
                      <div className={`text-xl font-bold ${s.cls}`}>{s.val}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center">Riesgos por clasificación</p>
                  <div className="h-40"><Bar data={clasifChart} options={{ ...chartOpts(true), plugins: { legend: { display: false } } }} /></div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2 text-center">Distribución por estado</p>
                  <div className="h-40"><Doughnut data={estadoChart} options={pieOpts} /></div>
                </div>
              </div>
            </div>

            {/* 4 mini charts */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { title: 'Riesgos por estado del periodo', chart: <Doughnut data={estadoChart} options={{ ...pieOpts, plugins: { legend: { display: false } } }} /> },
                { title: 'Riesgos por impacto del periodo', chart: <Bar data={impactoChart} options={chartOpts()} /> },
                { title: 'Riesgos por probabilidad del periodo', chart: <Doughnut data={probChart} options={{ ...pieOpts, plugins: { legend: { display: false } } }} /> },
                { title: 'Riesgos por nivel exposición del periodo', chart: <Bar data={exposChart} options={chartOpts()} /> },
              ].map(({ title, chart }) => (
                <div key={title} className="bg-white rounded border border-gray-200 p-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2 leading-tight">{title}</p>
                  <div className="h-28">{chart}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right panel */}
          <div className="w-64 flex-shrink-0 space-y-4">
            <div>
              <button onClick={() => setShowFiltro(!showFiltro)} className="text-blue-600 text-sm hover:underline">Filtro específico</button>
              {showFiltro && (
                <div className="bg-white border border-gray-200 rounded p-3 mt-2 text-xs space-y-2">
                  <div>
                    <label className="block font-semibold mb-0.5">Clasificación</label>
                    <select className="w-full border border-gray-300 rounded px-2 py-1" value={filtroClasif} onChange={e => setFiltroClasif(e.target.value)}>
                      <option value="">Todas</option>
                      {Object.keys(clasificaciones).map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-0.5">Estado</label>
                    <select className="w-full border border-gray-300 rounded px-2 py-1" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                      <option value="">Todos</option>
                      {estadosRiesgo.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <button onClick={() => setShowFiltro(false)} className="w-full bg-blue-600 text-white py-1 rounded">Aplicar</button>
                </div>
              )}
            </div>

            <div className="bg-white rounded border border-gray-200">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 text-xs font-semibold text-gray-700">Riesgos por clasificación</div>
              <div className="p-3 space-y-1.5">
                {Object.keys(clasificaciones).map(k => {
                  const cnt = riesgos.filter(r => r.clasificacion === k).length
                  return (
                    <div key={k} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 truncate max-w-[75%]">{k}</span>
                      <span className="font-semibold text-gray-800 ml-2">{cnt}</span>
                    </div>
                  )
                })}
                <div className="border-t border-gray-200 pt-1 flex justify-between text-xs font-semibold">
                  <span>Total registros encontrados:</span>
                  <span>{riesgos.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4 pb-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
          <FaSyncAlt /> Regresar al escritorio
        </button>
      </div>

      {/* View modal */}
      {viewRiesgo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-2/3 max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">{viewRiesgo.codigo} — {viewRiesgo.titulo}</h2>
              <button onClick={() => setViewRiesgo(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 text-sm">
              {[['Código', viewRiesgo.codigo], ['Fecha', viewRiesgo.fechaId], ['Clasificación', viewRiesgo.clasificacion], ['Subclasificación', viewRiesgo.subclasificacion], ['Proceso', viewRiesgo.proceso], ['Sede', viewRiesgo.sede], ['Área', viewRiesgo.area], ['Tipo', viewRiesgo.rutinaria ? 'Rutinaria' : 'No Rutinaria'], ['Nivel deficiencia', viewRiesgo.nivelDeficiencia], ['Nivel exposición', viewRiesgo.nivelExposicion], ['Nivel probabilidad', viewRiesgo.nivelProbabilidad], ['Consecuencia', viewRiesgo.nivelConsecuencia], ['Estado', viewRiesgo.estado], ['Responsable', viewRiesgo.responsable]].map(([k, v]) => (
                <div key={k}><span className="font-semibold text-gray-600">{k}:</span> <span className="text-gray-800">{v}</span></div>
              ))}
              <div className="col-span-2"><span className="font-semibold text-gray-600">Nivel de riesgo:</span> <span className={`px-2 py-0.5 rounded text-xs font-semibold ml-1 ${nivelRiesgoBadge[viewRiesgo.nivelRiesgo] ?? 'bg-gray-100 text-gray-600'}`}>{viewRiesgo.nivelRiesgo}</span></div>
              <div className="col-span-2"><span className="font-semibold text-gray-600">Causa raíz:</span> <span className="text-gray-700">{viewRiesgo.causaRaiz}</span></div>
              <div className="col-span-2"><span className="font-semibold text-gray-600">Controles propuestos:</span> <span className="text-gray-700">{viewRiesgo.controlesPropuestos}</span></div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
              <button onClick={() => setViewRiesgo(null)} className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // MAESTRO NAVEGABLE / RESUMEN / MAESTRO CSV  (table views)
  // ═══════════════════════════════════════════════════════════════
  if (view === 'maestro' || view === 'resumen' || view === 'maestroCSV') {
    const titles: Record<string, string> = {
      maestro:    'Riesgos: Maestro de Matriz de riesgos y peligros - Filtrado por Empresa y Año',
      resumen:    'Riesgos: Resumen matriz de peligro',
      maestroCSV: 'Riesgos: Maestro en CSV',
    }
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center pt-4 pb-2">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-1.5 px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
            <FaHome /> Ir a mi escritorio
          </button>
        </div>
        <div className="mx-4 mb-4 bg-white rounded border border-blue-200">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-semibold">{titles[view]}</div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Mostrando</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-xs" defaultValue="10">
                  {[10,25,50,100].map(n => <option key={n}>{n}</option>)}
                </select>
                <span>resultados por página</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Buscar:</span>
                <input className="border border-gray-300 rounded px-2 py-1 text-xs w-36" value={search} onChange={e => setSearch(e.target.value)} />
                {view === 'maestroCSV' && <button className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">Copy</button>}
                <button onClick={() => toast('Exportando CSV...')} className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">CSV</button>
                <button onClick={() => toast('Exportando Excel...')} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Excel</button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div>
                <div className="text-center py-5 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded">No hay datos en la tabla</div>
                <div className="text-xs text-gray-500 mt-2">
                  <div className="font-semibold">Total registros encontrados: 0</div>
                  <div>No hay registros disponibles</div>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-max">
                    <thead className="bg-gray-50 border-y border-gray-200">
                      <tr>
                        {['Código','Título','Fecha','Clasificación','Subclasif.','Sede','Proceso','Nivel riesgo','Estado','Acciones'].map(col => (
                          <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, i) => (
                        <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 font-mono">{r.codigo}</td>
                          <td className="px-3 py-1.5 max-w-xs truncate">{r.titulo}</td>
                          <td className="px-3 py-1.5 whitespace-nowrap">{r.fechaId}</td>
                          <td className="px-3 py-1.5">{r.clasificacion}</td>
                          <td className="px-3 py-1.5">{r.subclasificacion}</td>
                          <td className="px-3 py-1.5">{r.sede}</td>
                          <td className="px-3 py-1.5">{r.proceso}</td>
                          <td className="px-3 py-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-xs ${nivelRiesgoBadge[r.nivelRiesgo] ?? 'bg-gray-100 text-gray-600'}`}>{r.nivelRiesgo.split(' ')[0]}</span>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${estadoBadge[r.estado] ?? 'bg-gray-100 text-gray-600'}`}>{r.estado}</span>
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="flex gap-1">
                              <button onClick={() => setViewRiesgo(r)} className="p-1.5 bg-teal-500 text-white rounded hover:bg-teal-600"><FaEye className="w-3 h-3" /></button>
                              <button onClick={() => handleEdit(r)} className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600"><FaEdit className="w-3 h-3" /></button>
                              <button onClick={() => handleDelete(r.id)} className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><FaTrash className="w-3 h-3" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-gray-500">Total registros encontrados: {filtered.length}</p>
                  <div className="flex gap-1">
                    <button className="px-3 py-1 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Previo</button>
                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded">1</button>
                    <button className="px-3 py-1 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Siguiente</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // GESTIÓN ENTRE PERIODOS
  // ═══════════════════════════════════════════════════════════════
  if (view === 'periodos') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">Riesgos: Gestionar riesgos periodo actual</div>
      <div className="p-6">
        <div className="bg-white rounded border border-gray-200 p-5 mb-4">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Pasos para copiar riesgos:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 mb-5">
            <li>Selecciona el periodo desde donde quieres copiar riesgos.</li>
            <li>Selecciona el (solo uno) método de copiado de riesgos (por estados de riesgos, selección múltiple o uno a uno).</li>
            <li>Por último clic en el botón que esta al frente</li>
          </ol>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Periodo origen:</label>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm w-56" value={periodoOrigen} onChange={e => setPeriodoOrigen(e.target.value)}>
              <option value="">Seleccione uno</option>
              {periodos.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Método 1 */}
          <div className="border-t border-gray-200 pt-5 mb-5">
            <h4 className="font-semibold text-gray-800 mb-3">Método 1:</h4>
            <div className="flex items-end gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Método por tipos de riesgos:</label>
                <div className="flex gap-1">
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm w-48" value={metodo1} onChange={e => setMetodo1(e.target.value)}>
                    <option value="">Seleccione uno</option>
                    {estadosRiesgo.map(e => <option key={e}>{e}</option>)}
                  </select>
                  <button className={helpBtn}><FaQuestionCircle /></button>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!periodoOrigen || !metodo1) { toast.error('Seleccione periodo y tipo de riesgo'); return }
                  toast.success(`Riesgos de tipo "${metodo1}" copiados desde ${periodoOrigen}`)
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600"
              >
                Copiar por tipo de riesgos
              </button>
            </div>
          </div>

          {/* Método 2 */}
          <div className="border-t border-gray-200 pt-5 mb-5">
            <h4 className="font-semibold text-gray-800 mb-3">Método 2:</h4>
            <div className="flex items-end gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Método por selección multiple:</label>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm w-56" value={metodo2} onChange={e => setMetodo2(e.target.value)}>
                  <option value="">Seleccione uno</option>
                  {filtered.map(r => <option key={r.id} value={r.id}>{r.codigo} — {r.titulo}</option>)}
                </select>
              </div>
              <button
                onClick={() => {
                  if (!periodoOrigen) { toast.error('Seleccione periodo origen'); return }
                  toast.success('Riesgos copiados al periodo actual')
                }}
                className="px-4 py-2 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600"
              >
                Copiar uno o múltiples riesgos
              </button>
            </div>
          </div>
        </div>

        {/* Comparativo */}
        <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">Comparativo entre riesgos de periodo seleccionado vs. periodo actual</h3>
        <div className="grid grid-cols-2 gap-4">
          {['Riesgos de periodo seleccionado:', 'Riesgos periodo actual:'].map((label, idx) => (
            <div key={label} className="bg-white rounded border border-gray-200">
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-200">{label}</div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Mostrando</span>
                    <select className="border border-gray-300 rounded px-1 py-0.5 text-xs" defaultValue="10">
                      <option>10</option><option>25</option>
                    </select>
                    <span>resultados por página</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>Buscar:</span>
                    <input className="border border-gray-300 rounded px-2 py-0.5 text-xs w-24" />
                  </div>
                </div>
                {idx === 1 && periodoOrigen === '' ? (
                  <div>
                    <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded">No hay datos en la tabla</div>
                    <div className="text-xs text-gray-500 mt-1"><div className="font-semibold">Total registros encontrados: 0</div><div>No hay registros disponibles</div></div>
                  </div>
                ) : idx === 1 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50"><tr>{['Código','Título','Estado'].map(c => <th key={c} className="px-2 py-1.5 text-left font-semibold text-gray-600">{c}</th>)}</tr></thead>
                      <tbody>{riesgos.slice(0,3).map((r,i) => <tr key={r.id} className={i%2===0?'bg-white':'bg-gray-50'}><td className="px-2 py-1">{r.codigo}</td><td className="px-2 py-1 max-w-[150px] truncate">{r.titulo}</td><td className="px-2 py-1"><span className={`px-1 py-0.5 rounded text-xs ${estadoBadge[r.estado]}`}>{r.estado}</span></td></tr>)}</tbody>
                    </table>
                    <div className="text-xs text-gray-500 mt-1">Total registros encontrados: {riesgos.length}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-center py-4 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded">No hay datos en la tabla</div>
                    <div className="text-xs text-gray-500 mt-1"><div className="font-semibold">Total registros encontrados: 0</div><div>No hay registros disponibles</div></div>
                  </div>
                )}
                <div className="flex justify-end gap-1 mt-2">
                  <button className="px-2 py-0.5 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Previo</button>
                  <button className="px-2 py-0.5 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Siguiente</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            <FaHome /> Inicio
          </button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // IMPORTACIÓN
  // ═══════════════════════════════════════════════════════════════
  if (view === 'importacion') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">Riesgos: Importación de riesgos</div>
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <div className="flex gap-3">
            <FaInfoCircle className="text-blue-600 text-xl shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">Importación de riesgos</p>
              <p className="text-sm text-blue-700">La primera fila de la hoja de cálculo debe contener el nombre exacto del campo. Se ignorarán los riesgos con código repetido.</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className={fieldLabel}>Adjuntar archivo:</label>
              <div className="flex items-center gap-2">
                <label className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer hover:bg-gray-200">
                  Seleccionar archivo
                  <input type="file" className="hidden" accept=".xls,.xlsx,.csv" onChange={e => setArchivoBulk(e.target.files?.[0] ?? null)} />
                </label>
                <span className="text-xs text-gray-500">{archivoBulk ? archivoBulk.name : 'Sin archivos seleccionados'}</span>
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Formato:</label>
              <select className="border border-gray-300 rounded px-3 py-2 text-sm w-48">
                <option>Excel 5 (.XLS)</option><option>Excel (.XLSX)</option><option>CSV</option>
              </select>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-2">Atención:</h3>
              <p className="text-sm text-gray-700 mb-2"><strong>Descargue la plantilla antes de importar.</strong></p>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                <li>Se <strong>ignorarán</strong> los riesgos con <strong>código</strong> repetido.</li>
                <li>Los campos obligatorios son: Código, Título, Clasificación.</li>
              </ul>
              <button
                onClick={() => { if (!archivoBulk) { toast.error('Seleccione un archivo'); return }; toast.success('Importación procesada'); setArchivoBulk(null); setView('dashboard') }}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
              >
                <FaCheck /> Entiendo el proceso, Cargar archivo y continuar importación
              </button>
            </div>
          </div>
          <div>
            <button onClick={() => toast('Descargando plantilla...')} className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-semibold w-full justify-center">
              <FaFileAlt /> Plantilla para importación de riesgos
            </button>
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"><FaHome /> Inicio</button>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"><FaSyncAlt /> Regresar al escritorio</button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // MATRICES DE PELIGRO
  // ═══════════════════════════════════════════════════════════════
  if (view === 'matrices') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">Riesgos: Matrices de Peligro</div>
      <div className="p-6">
        <div className="bg-white rounded border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Matriz de Evaluación de Riesgos — GTC 45</h2>
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-3 py-2 bg-gray-100">Nivel Probabilidad ↓ / Consecuencia →</th>
                  {['Leve (10)','Grave (25)','Muy grave (60)','Mortal (100)'].map(c => (
                    <th key={c} className="border border-gray-300 px-3 py-2 bg-gray-100">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { prob: 'Muy Alto (>40)', vals: ['III 400','I 1000','I 2400','I 4000'], colors: ['bg-yellow-100','bg-red-200','bg-red-300','bg-red-400'] },
                  { prob: 'Alto (20-40)',   vals: ['III 200','I 500','I 1200','I 2000'],  colors: ['bg-yellow-50','bg-orange-200','bg-red-200','bg-red-300'] },
                  { prob: 'Medio (8-20)',   vals: ['IV 80','III 200','III 480','I 800'],   colors: ['bg-green-100','bg-yellow-100','bg-yellow-200','bg-orange-200'] },
                  { prob: 'Bajo (<8)',      vals: ['IV 20','IV 50','III 120','III 200'],   colors: ['bg-green-50','bg-green-100','bg-yellow-50','bg-yellow-100'] },
                ].map(row => (
                  <tr key={row.prob}>
                    <td className="border border-gray-300 px-3 py-2 font-semibold bg-gray-50">{row.prob}</td>
                    {row.vals.map((v, i) => (
                      <td key={i} className={`border border-gray-300 px-3 py-2 text-center font-medium ${row.colors[i]}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            {[['Nivel I (>4000)', 'No aceptable. Situación crítica. Suspender actividades.', 'bg-red-100 border-red-400'],['Nivel II (2000-4000)', 'No aceptable o aceptable con control. Corrección urgente.', 'bg-orange-100 border-orange-400'],['Nivel III (500-2000)', 'Aceptable. Mantener controles. Mejorar si es posible.', 'bg-yellow-100 border-yellow-400'],['Nivel IV (<500)', 'Aceptable. Sin intervención necesaria.', 'bg-green-100 border-green-400']].map(([lvl, desc, cls]) => (
              <div key={lvl} className={`border-l-4 p-3 rounded ${cls}`}><div className="font-semibold">{lvl}</div><div className="text-gray-600 mt-0.5">{desc}</div></div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"><FaHome /> Inicio</button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // INGRESAR / EDITAR RIESGO
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
        Riesgos: {editId ? 'Editar' : 'Registro de'} riesgos
      </div>
      <div className="p-5">
        {/* step headers */}
        <div className="grid grid-cols-3 gap-4 mb-1">
          {([1,2,3] as FormStep[]).map(s => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`border rounded-t py-2 text-xs font-semibold text-center transition-colors ${
                step === s ? 'bg-white border-gray-300 text-gray-800' : 'bg-gray-50 border-gray-200 text-teal-600 hover:bg-white'
              }`}
            >
              {s === 1 ? '1. Identificación del peligro' : s === 2 ? '2. Evaluación del riesgo' : '3. Gestión del riesgo'}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-300 rounded-b p-5">
          {/* help button */}
          <button className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-300 text-blue-700 text-xs rounded hover:bg-blue-100 mb-5">
            <FaInfoCircle /> Ayuda sobre la clasificación de riesgos
          </button>

          {/* ── STEP 1: Identificación ── */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {/* Left */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={fieldLabel}>Fecha de identificación:</label>
                    <div className="flex gap-1">
                      <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.fechaId} onChange={e => setForm({ ...form, fechaId: e.target.value })} />
                      <button className={helpBtn}><FaCalendarAlt /></button>
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Código:</label>
                    <div className="flex gap-1">
                      <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
                      <button className={warnBtn}><FaExclamationTriangle /></button>
                      <button className={helpBtn}><FaQuestionCircle /></button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Título/Riesgo:</label>
                  <div className="flex gap-1">
                    <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
                    <button className={warnBtn}><FaExclamationTriangle /></button>
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Actividad realizada / Descripción del riesgo:</label>
                  <div className="flex gap-1">
                    <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-20 resize-none" value={form.actividad} onChange={e => setForm({ ...form, actividad: e.target.value })} />
                    <button className={`self-start mt-1 ${warnBtn}`}><FaExclamationTriangle /></button>
                  </div>
                </div>
                <div>
                  <button type="button" onClick={() => setForm({ ...form, rutinaria: !form.rutinaria })}
                    className={`px-3 py-1 text-sm rounded border font-medium ${form.rutinaria ? 'bg-gray-200 text-gray-700 border-gray-300' : 'bg-blue-600 text-white border-blue-600'}`}>
                    {form.rutinaria ? 'Rutinaria' : 'NoRutinaria'}
                  </button>
                </div>
                <div>
                  <label className={fieldLabel}>Proceso:</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.proceso} onChange={e => setForm({ ...form, proceso: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {procesos.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Zona común:</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.zonaComun} onChange={e => setForm({ ...form, zonaComun: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {zonasComunes.map(z => <option key={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Lugar / Puesto de trabajo:</label>
                  <div className="flex gap-1">
                    <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.lugar} onChange={e => setForm({ ...form, lugar: e.target.value })} />
                    <button className={helpBtn}><FaQuestionCircle /></button>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                <div>
                  <label className={fieldLabel}>Sede:</label>
                  <div className="flex gap-1">
                    <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.sede} onChange={e => setForm({ ...form, sede: e.target.value })}>
                      <option value="">Seleccione uno</option>
                      <option>Sede Principal</option><option>Sede Norte</option><option>Sede Sur</option>
                    </select>
                    <button className={warnBtn}><FaExclamationTriangle /></button>
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Área(s) involucrada(s):</label>
                  <div className="flex gap-1">
                    <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
                      <option value="">Seleccione uno</option>
                      {['Producción','Administración','Laboratorio','Mantenimiento','Logística','Recursos Humanos'].map(a => <option key={a}>{a}</option>)}
                    </select>
                    <button className={helpBtn}><FaQuestionCircle /></button>
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Cargos:</label>
                  <div className="flex gap-1">
                    <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.cargos} onChange={e => setForm({ ...form, cargos: e.target.value })}>
                      <option value="">Seleccione uno</option>
                      {['Operario','Técnico','Profesional','Coordinador','Supervisor','Gerente'].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button className={helpBtn}><FaQuestionCircle /></button>
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Clasificación / Tipo de peligro:</label>
                  <select
                    className="w-full border border-blue-800 bg-blue-800 text-white rounded px-2 py-1.5 text-sm"
                    value={form.clasificacion}
                    onChange={e => setForm({ ...form, clasificacion: e.target.value, subclasificacion: '' })}
                  >
                    <option value="">Seleccione uno</option>
                    {Object.keys(clasificaciones).map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Subclasificación / Subdivisión:</label>
                  <select
                    className="w-full border border-cyan-400 bg-cyan-400 text-white rounded px-2 py-1.5 text-sm"
                    value={form.subclasificacion}
                    onChange={e => setForm({ ...form, subclasificacion: e.target.value })}
                    disabled={!form.clasificacion}
                  >
                    <option value="">Seleccione uno</option>
                    {(clasificaciones[form.clasificacion] ?? []).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Causa raíz o Fuente generadora:</label>
                  <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm h-20 resize-none" value={form.causaRaiz} onChange={e => setForm({ ...form, causaRaiz: e.target.value })} />
                </div>
                <div>
                  <label className={fieldLabel}>Perfil del cargo (GES):</label>
                  <select
                    className="w-full border border-red-600 bg-red-600 text-white rounded px-2 py-1.5 text-sm"
                    value={form.perfilGES}
                    onChange={e => setForm({ ...form, perfilGES: e.target.value })}
                  >
                    <option value="">Seleccione uno</option>
                    {['Operario de montaje','Técnico de manufactura','Auxiliar administrativo','Técnico de laboratorio','Coordinador RRHH','Técnico electricista'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Evaluación ── */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                {[
                  { label: 'Nivel de deficiencia (ND):', key: 'nivelDeficiencia', opts: nivelesDeficiencia },
                  { label: 'Nivel de exposición (NE):', key: 'nivelExposicion', opts: nivelesExposicion },
                  { label: 'Nivel de probabilidad (NP = ND × NE):', key: 'nivelProbabilidad', opts: nivelesProbabilidad },
                  { label: 'Nivel de consecuencias (NC):', key: 'nivelConsecuencia', opts: nivelesConsecuencia },
                  { label: 'Nivel de riesgo (NR = NP × NC):', key: 'nivelRiesgo', opts: nivelesRiesgo },
                ].map(({ label, key, opts }) => (
                  <div key={key}>
                    <label className={fieldLabel}>{label}</label>
                    <select
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                      value={(form as any)[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                    >
                      <option value="">Seleccione uno</option>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-xs text-blue-800 space-y-2 self-start">
                <p className="font-semibold text-sm">Escala GTC 45 — Niveles de riesgo</p>
                {[['I (>4000)','No aceptable — suspender actividades','bg-red-200'],['II (2000-4000)','No aceptable o aceptable con control','bg-orange-200'],['III (500-2000)','Aceptable — mantener controles','bg-yellow-200'],['IV (<500)','Aceptable — sin intervención necesaria','bg-green-200']].map(([lvl,desc,cls]) => (
                  <div key={lvl} className={`p-2 rounded ${cls}`}><span className="font-semibold">{lvl}:</span> {desc}</div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Gestión ── */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-4">
                <div>
                  <label className={fieldLabel}>Tipo de control:</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.tipoControl} onChange={e => setForm({ ...form, tipoControl: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {tiposControl.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={fieldLabel}>Controles existentes:</label>
                  <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm h-20 resize-none" value={form.controlesExistentes} onChange={e => setForm({ ...form, controlesExistentes: e.target.value })} />
                </div>
                <div>
                  <label className={fieldLabel}>Controles propuestos:</label>
                  <textarea className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm h-20 resize-none" value={form.controlesPropuestos} onChange={e => setForm({ ...form, controlesPropuestos: e.target.value })} />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={fieldLabel}>Responsable de implementación:</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} />
                </div>
                <div>
                  <label className={fieldLabel}>Fecha de ejecución:</label>
                  <input type="date" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.fechaEjecucion} onChange={e => setForm({ ...form, fechaEjecucion: e.target.value })} />
                </div>
                <div>
                  <label className={fieldLabel}>Estado del riesgo:</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}>
                    {estadosRiesgo.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* step navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              {step > 1 && (
                <button onClick={() => setStep((step - 1) as FormStep)} className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                  ← Anterior
                </button>
              )}
              {step < 3 && (
                <button onClick={() => setStep((step + 1) as FormStep)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  Siguiente <FaChevronRight />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={handleGuardar} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold">
                <FaSave /> Guardar
              </button>
              <button onClick={() => { setView('dashboard'); setForm(emptyForm); setEditId(null) }} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                <FaHome /> Inicio
              </button>
              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
                <FaSyncAlt /> Regresar al escritorio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
