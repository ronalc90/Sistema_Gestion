import { useState, useRef } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  FaRobot,
  FaPlus,
  FaDesktop,
  FaTable,
  FaFileAlt,
  FaDownload,
  FaFolderOpen,
  FaHome,
  FaChevronDown,
  FaCalendarAlt,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaSyncAlt,
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from 'react-icons/fa'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'agregar' | 'visor' | 'descarga'
type VisorTab = 'conSede' | 'sinSede' | 'fisico' | 'backup' | 'online'

interface DocItem {
  id: number
  fechaCreacion: string
  titulo: string
  trabajadores: string
  departamento: string
  municipio: string
  periodo: number
  tiempoRetencion: string
  disposicion: string
  conSede: boolean
  tipo: 'digital' | 'fisico'
}

const initialDocs: DocItem[] = [
  { id: 1,  fechaCreacion: '2024-04-12', titulo: 'CURSO DE ALTURAS',                      trabajadores: '1100548352', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 2,  fechaCreacion: '2026-01-23', titulo: 'Certificado de Alturas',                trabajadores: '1101874849', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 3,  fechaCreacion: '2025-06-17', titulo: 'AFILIACION CCF - 1030666115',           trabajadores: '1030666115', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 4,  fechaCreacion: '2025-04-07', titulo: 'Epps 2025',                             trabajadores: '1031165770', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 5,  fechaCreacion: '2024-05-17', titulo: 'FOTOCOPIA DE LA CEDULA-BRAYAN CADAVID', trabajadores: '1011394991', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 6,  fechaCreacion: '2026-03-07', titulo: 'CERTIFICADO SENA MAQUINA EXCAVADORA',  trabajadores: '8203319',    departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 7,  fechaCreacion: '2026-03-07', titulo: 'CERTIFICADO SENA MAQUINA MINICARGADOR',trabajadores: '8203319',    departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 8,  fechaCreacion: '2024-04-24', titulo: 'ARL',                                  trabajadores: '1051885649', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 9,  fechaCreacion: '2024-04-24', titulo: 'Contrato',                              trabajadores: '1004686380', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 10, fechaCreacion: '2025-06-17', titulo: 'AFILIACION PENSION - 1030666115',       trabajadores: '1030666115', departamento: '',             municipio: '',       periodo: 0, tiempoRetencion: '',           disposicion: '',                conSede: false, tipo: 'digital' },
  { id: 11, fechaCreacion: '2025-03-15', titulo: 'POLITICA SST',                          trabajadores: '',           departamento: 'Antioquia',    municipio: 'Medellín', periodo: 0, tiempoRetencion: '5 años',  disposicion: 'Conservación',    conSede: true,  tipo: 'digital' },
  { id: 12, fechaCreacion: '2025-01-10', titulo: 'REGLAMENTO INTERNO DE TRABAJO',         trabajadores: '',           departamento: 'Antioquia',    municipio: 'Medellín', periodo: 0, tiempoRetencion: 'Permanente', disposicion: 'Conservación total', conSede: true, tipo: 'digital' },
  { id: 13, fechaCreacion: '2024-06-20', titulo: 'ACTA COPASST ENE 2024',                 trabajadores: '',           departamento: 'Cundinamarca', municipio: 'Bogotá', periodo: 0, tiempoRetencion: '5 años',     disposicion: 'Eliminación',     conSede: false, tipo: 'fisico' },
  { id: 14, fechaCreacion: '2024-07-15', titulo: 'ACTA COPASST FEB 2024',                 trabajadores: '',           departamento: 'Cundinamarca', municipio: 'Bogotá', periodo: 0, tiempoRetencion: '5 años',     disposicion: 'Eliminación',     conSede: false, tipo: 'fisico' },
]

// ---------- Chart data ----------
const modulosChartData = {
  labels: ['Contratistas'],
  datasets: [{ label: 'Documentos', data: [526084], backgroundColor: '#3b82f6', borderRadius: 4 }],
}
const modulosOptions = {
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw.toLocaleString()}` } },
  },
  scales: {
    x: { beginAtZero: true, ticks: { callback: (v: any) => v >= 1000 ? `${v / 1000}k` : v } },
    y: { ticks: { font: { size: 11 } } },
  },
}

const tipoChartData = {
  labels: ['Digital', 'Físico'],
  datasets: [{ data: [526084, 410], backgroundColor: ['#4ade80', '#3b82f6'], borderWidth: 2, borderColor: '#fff' }],
}
const tipoOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw.toLocaleString()}` } },
  },
}

const anioChartData = {
  labels: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
  datasets: [{ label: 'Documentos', data: [294, 1398, 45559, 147806, 174544, 138887, 18006], backgroundColor: '#3b82f6', borderRadius: 4 }],
}
const anioOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw.toLocaleString()}` } },
  },
  scales: {
    y: { beginAtZero: true, ticks: { callback: (v: any) => v >= 1000 ? `${Math.round(v / 1000)}k` : v } },
  },
}

// ---------- Static options ----------
const tiposDoc = ['Contrato', 'Cédula de ciudadanía', 'Hoja de vida', 'Certificado', 'Licencia', 'Examen médico', 'Póliza', 'Acta', 'Reglamento', 'Política', 'Procedimiento', 'Instructivo', 'Formato', 'Otro']
const programas = ['SGSST', 'Gestión de Riesgos', 'Capacitación', 'Medicina Laboral', 'Emergencias', 'Contratistas', 'Inspecciones', 'Acciones Correctivas']
const departamentos = ['Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Cauca', 'Cesar', 'Córdoba', 'Cundinamarca', 'Chocó', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca']
const visorTabLabel: Record<VisorTab, string> = {
  conSede: 'Documentos digitales con Sede',
  sinSede: 'Documentos Digitales sin Sede',
  fisico:  'Documentos en archivo físico',
  backup:  'Generar Backup',
  online:  'Recursos en línea',
}

// ---------- Initial form state ----------
const emptyForm = {
  modeloTipo: '', fechaCreacion: '2026-03-23', titulo: '',
  tipoDocumento: '', programa: '', tiempoRetencion: '', disposicion: '',
  itemCumplimiento: '', descripcionMatriz: '',
  relacionarConSede: false, sede: '',
  departamento: '', municipio: '',
  relacionarConTrabajador: false, trabajador: '',
}

export default function GestionDocumental() {
  const [view, setView]             = useState<View>('dashboard')
  const [visorTab, setVisorTab]     = useState<VisorTab>('conSede')
  const [docs, setDocs]             = useState<DocItem[]>(initialDocs)
  const [form, setForm]             = useState(emptyForm)
  const [showMaestro, setShowMaestro] = useState(false)
  const [showFormatos, setShowFormatos] = useState(false)
  const [showFiltro, setShowFiltro] = useState(false)
  const [search, setSearch]         = useState('')
  const [pageSize, setPageSize]     = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [descarga, setDescarga]     = useState({ fechaInicio: '2026-03-23', fechaFin: '2026-03-23', contratista: '' })
  const editorRef = useRef<HTMLDivElement>(null)

  const execCmd = (cmd: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, val)
  }

  const filtered = (() => {
    let list = docs.filter(d =>
      visorTab === 'conSede' ? (d.conSede && d.tipo === 'digital') :
      visorTab === 'sinSede' ? (!d.conSede && d.tipo === 'digital') :
      visorTab === 'fisico'  ? d.tipo === 'fisico' : false
    )
    if (search) list = list.filter(d => d.titulo.toLowerCase().includes(search.toLowerCase()) || d.trabajadores.includes(search))
    return list
  })()

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged      = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleAgregar = () => {
    if (!form.titulo || !form.tipoDocumento) { toast.error('Complete los campos requeridos'); return }
    const newDoc: DocItem = {
      id: docs.length + 1,
      fechaCreacion: form.fechaCreacion,
      titulo: form.titulo,
      trabajadores: form.trabajador,
      departamento: form.departamento,
      municipio: form.municipio,
      periodo: 0,
      tiempoRetencion: form.tiempoRetencion,
      disposicion: form.disposicion,
      conSede: form.relacionarConSede,
      tipo: 'digital',
    }
    setDocs(prev => [newDoc, ...prev])
    setForm(emptyForm)
    toast.success('Documento agregado correctamente')
    setView('visor')
    setVisorTab(form.relacionarConSede ? 'conSede' : 'sinSede')
  }

  // ─────────────────────── DASHBOARD ───────────────────────
  if (view === 'dashboard') return (
    <div className="min-h-screen bg-gray-100">
      {/* header */}
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
        Documentos: Menú control documental
      </div>

      {/* action bar */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex flex-wrap gap-2 items-center">
        <button onClick={() => toast('Asistente en desarrollo')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
          <FaRobot /> Asistente
        </button>
        <button onClick={() => setView('agregar')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded text-xs hover:bg-teal-700">
          <FaPlus /> Agregar documento/registro/soporte
        </button>
        <button onClick={() => { setView('visor'); setVisorTab('conSede') }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
          <FaDesktop /> Visor documentos
        </button>
        <button onClick={() => setShowMaestro(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded text-xs hover:bg-cyan-700">
          <FaTable /> Maestro de documentos
        </button>
        <div className="relative">
          <button onClick={() => setShowFormatos(!showFormatos)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50">
            <FaFileAlt /> Formatos <FaChevronDown className="ml-1 text-xs" />
          </button>
          {showFormatos && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded z-20 w-52">
              {['Formato de documentos', 'Plantilla SGSST', 'Formato de registro', 'Plantilla de procedimientos'].map(f => (
                <button key={f} onClick={() => { toast(`Descargando: ${f}`); setShowFormatos(false) }} className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100">
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setView('descarga')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
          <FaDownload /> Descarga masiva documentos
        </button>
      </div>

      {/* content */}
      <div className="p-4">
        <div className="flex gap-6">
          {/* left panel */}
          <div className="flex flex-col items-center w-44 flex-shrink-0 pt-4">
            <FaFolderOpen className="text-7xl text-yellow-500 mb-3" />
            <button onClick={() => setShowFiltro(!showFiltro)} className="text-blue-600 text-sm hover:underline">
              Filtro específico
            </button>
            {showFiltro && (
              <div className="w-full bg-white border border-gray-200 rounded p-3 mt-3 text-xs space-y-2">
                <div>
                  <label className="block font-semibold mb-0.5">Módulo</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1">
                    <option>Todos</option><option>Contratistas</option><option>Empleados</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-0.5">Tipo</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1">
                    <option>Todos</option><option>Digital</option><option>Físico</option>
                  </select>
                </div>
                <button onClick={() => { setShowFiltro(false); toast('Filtro aplicado') }} className="w-full bg-blue-600 text-white py-1 rounded">Aplicar</button>
              </div>
            )}
          </div>

          {/* right panel */}
          <div className="flex-1 min-w-0">
            {/* storage bar */}
            <div className="flex justify-end mb-4">
              <div className="border border-gray-300 rounded p-3 text-sm text-center w-72">
                <div className="font-semibold text-gray-700 mb-1">Espacio utilizado:</div>
                <div className="text-gray-800 mb-2">
                  <span className="font-bold">176.2 GB</span>
                  <span className="text-gray-500 font-normal"> De su plan de: 250 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70.5%' }} />
                </div>
                <div className="text-xs text-gray-400 mt-1">70.5% utilizado</div>
              </div>
            </div>

            {/* three charts */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded border border-gray-200 p-3">
                <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Documentos por módulo</h3>
                <div className="h-36"><Bar data={modulosChartData} options={modulosOptions} /></div>
              </div>
              <div className="bg-white rounded border border-gray-200 p-3">
                <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Documentos por tipo</h3>
                <div className="relative h-36">
                  <Doughnut data={tipoChartData} options={tipoOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-bold text-gray-800 leading-tight">Digital</span>
                    <span className="text-xs text-gray-500">526,084</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded border border-gray-200 p-3">
                <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Documentos por año</h3>
                <div className="h-36"><Bar data={anioChartData} options={anioOptions} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-center mt-6 pb-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
          <FaSyncAlt /> Regresar al escritorio
        </button>
      </div>

      {/* Maestro modal */}
      {showMaestro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-3/4 max-h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Maestro de documentos</h2>
              <button onClick={() => setShowMaestro(false)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 flex-1 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Mostrando</span>
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs" defaultValue="10">
                    {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                  </select>
                  <span>resultados por página</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Buscar:</span>
                  <input className="border border-gray-300 rounded px-2 py-1 text-xs w-36" />
                  <button className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">Copy</button>
                  <button className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">CSV</button>
                  <button className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Excel</button>
                </div>
              </div>
              <div className="border border-gray-200 rounded">
                <div className="bg-gray-50 text-center py-5 text-sm text-gray-400 border-b border-gray-200">No hay datos en la tabla</div>
                <div className="p-3 text-xs text-gray-500">
                  <div className="font-semibold">Total registros encontrados: 0</div>
                  <div className="mt-1">No hay registros disponibles</div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button className="px-3 py-1 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Previo</button>
                <button className="px-3 py-1 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Siguiente</button>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowMaestro(false)} className="px-5 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ─────────────────────── AGREGAR ───────────────────────
  if (view === 'agregar') {
    const iconBtn = 'px-2 py-1 bg-gray-100 border border-gray-200 rounded text-gray-500 text-xs hover:bg-gray-200'
    const warnBtn = 'px-2 py-1 bg-yellow-400 border border-yellow-400 rounded text-white text-xs'
    const toolBtn = 'w-6 h-6 flex items-center justify-center text-xs rounded hover:bg-gray-200 text-gray-600'

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
          Documentos: Adición de Documentos
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">

            {/* ── Left: Propiedades básicas ── */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-5 text-center">Propiedades básicas del documento</h2>

              {/* modelo + fecha */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Modelo o tipo del documento:</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.modeloTipo} onChange={e => setForm({ ...form, modeloTipo: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {tiposDoc.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Fecha de creación:</label>
                  <div className="flex gap-1">
                    <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.fechaCreacion} onChange={e => setForm({ ...form, fechaCreacion: e.target.value })} />
                    <button className={iconBtn}><FaCalendarAlt /></button>
                    <button className={warnBtn}><FaExclamationTriangle /></button>
                    <button className={iconBtn}><FaQuestionCircle /></button>
                  </div>
                </div>
              </div>

              {/* título */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Título del documento:</label>
                <div className="flex gap-1">
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
                  <button className={warnBtn}><FaExclamationTriangle /></button>
                </div>
              </div>

              {/* descripción rich text */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción breve del documento:</label>
                <div className="border border-gray-300 rounded-t bg-gray-50 px-2 py-1 flex flex-wrap gap-0.5 items-center">
                  {[
                    { icon: <FaUndo />,        cmd: 'undo' },
                    { icon: <FaRedo />,        cmd: 'redo' },
                    null,
                    { icon: <FaBold />,        cmd: 'bold' },
                    { icon: <FaItalic />,      cmd: 'italic' },
                    { icon: <FaUnderline />,   cmd: 'underline' },
                    { icon: <FaStrikethrough />, cmd: 'strikeThrough' },
                    null,
                    { icon: <FaListUl />,      cmd: 'insertUnorderedList' },
                    { icon: <FaListOl />,      cmd: 'insertOrderedList' },
                    null,
                    { icon: <FaAlignLeft />,   cmd: 'justifyLeft' },
                    { icon: <FaAlignCenter />, cmd: 'justifyCenter' },
                    { icon: <FaAlignRight />,  cmd: 'justifyRight' },
                    { icon: <FaAlignJustify />,cmd: 'justifyFull' },
                  ].map((btn, i) =>
                    btn === null
                      ? <span key={i} className="w-px bg-gray-300 mx-1 h-5 inline-block" />
                      : <button key={i} type="button" className={toolBtn} onMouseDown={e => { e.preventDefault(); execCmd(btn.cmd) }}>{btn.icon}</button>
                  )}
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="border border-t-0 border-gray-300 rounded-b min-h-[90px] p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>

              {/* tipo + programa */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tipo de documento:</label>
                  <div className="flex gap-1">
                    <select
                      className={`flex-1 border rounded-l px-2 py-1.5 text-sm text-white font-medium ${form.tipoDocumento ? 'border-blue-500 bg-blue-500' : 'border-blue-500 bg-blue-500'}`}
                      value={form.tipoDocumento}
                      onChange={e => setForm({ ...form, tipoDocumento: e.target.value })}
                    >
                      <option value="">Seleccione uno</option>
                      {tiposDoc.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <button className={warnBtn + ' rounded-r'}><FaExclamationTriangle /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Programa que interviene:</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.programa} onChange={e => setForm({ ...form, programa: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {programas.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* retención + disposición */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tiempo Retención:</label>
                  <div className="flex gap-1">
                    <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.tiempoRetencion} onChange={e => setForm({ ...form, tiempoRetencion: e.target.value })} />
                    <button className={`self-start mt-1 ${iconBtn}`}><FaQuestionCircle /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Disposición final:</label>
                  <div className="flex gap-1">
                    <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.disposicion} onChange={e => setForm({ ...form, disposicion: e.target.value })} />
                    <button className={`self-start mt-1 ${iconBtn}`}><FaQuestionCircle /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Indexación ── */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-5 text-center">Indexación y localización</h2>

              {/* item cumplimiento */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Item Cumplimiento del Periodo:</label>
                <div className="flex gap-1">
                  <select
                    className="flex-1 border border-red-500 bg-red-500 text-white rounded-l px-2 py-1.5 text-sm"
                    value={form.itemCumplimiento}
                    onChange={e => setForm({ ...form, itemCumplimiento: e.target.value })}
                  >
                    <option value="">Seleccione uno</option>
                    <option>Periodo 2026</option>
                    <option>Periodo 2025</option>
                    <option>Periodo 2024</option>
                  </select>
                  <button className={warnBtn}><FaExclamationTriangle /></button>
                  <button className={iconBtn + ' rounded-r'}><FaQuestionCircle /></button>
                </div>
              </div>

              {/* descripción matriz */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Descripción item matriz legal:</label>
                <div className="flex gap-1">
                  <textarea className="flex-1 border border-gray-300 bg-gray-50 rounded px-2 py-1.5 text-sm h-20 resize-none" value={form.descripcionMatriz} onChange={e => setForm({ ...form, descripcionMatriz: e.target.value })} />
                  <button className={`self-start mt-1 ${iconBtn}`}><FaQuestionCircle /></button>
                </div>
              </div>

              {/* sede */}
              <div className="mb-4 border border-gray-200 rounded p-3 bg-white">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Relacionar documento con: Sede</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, relacionarConSede: !form.relacionarConSede })}
                    className={`px-3 py-1 text-sm rounded ${form.relacionarConSede ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {form.relacionarConSede ? 'Sí' : 'No'}
                  </button>
                  <span className="text-xs text-gray-500">{form.relacionarConSede ? 'Seleccione la sede:' : 'Aplica para todas las sedes'}</span>
                  {form.relacionarConSede && (
                    <div className="flex gap-1 flex-1 min-w-0">
                      <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" value={form.sede} onChange={e => setForm({ ...form, sede: e.target.value })}>
                        <option value="">Seleccione uno</option>
                        <option>Sede Principal</option><option>Sede Norte</option><option>Sede Sur</option>
                      </select>
                      <button className={iconBtn}><FaQuestionCircle /></button>
                    </div>
                  )}
                </div>
              </div>

              {/* departamento */}
              <div className="mb-4 border border-gray-200 rounded p-3 bg-white">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Relacionar documento con: Departamento y/o municipio</label>
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-xs text-gray-600">Departamento:</label>
                  <select className="border border-gray-300 rounded px-2 py-1 text-sm" value={form.departamento} onChange={e => setForm({ ...form, departamento: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {departamentos.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <button className={iconBtn}><FaQuestionCircle /></button>
                </div>
              </div>

              {/* trabajador */}
              <div className="mb-4 border border-gray-200 rounded p-3 bg-white">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Relacionar documento con trabajador:</label>
                <div className="flex items-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, relacionarConTrabajador: !form.relacionarConTrabajador })}
                    className={`px-3 py-1 text-sm rounded ${form.relacionarConTrabajador ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    {form.relacionarConTrabajador ? 'Sí' : 'No'}
                  </button>
                  <span className="text-xs text-gray-500">{form.relacionarConTrabajador ? 'Seleccione el trabajador:' : 'Aplica para todos los trabajadores'}</span>
                </div>
                {form.relacionarConTrabajador && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Trabajador(es) relacionados:</label>
                    <div className="flex gap-1">
                      <select className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" value={form.trabajador} onChange={e => setForm({ ...form, trabajador: e.target.value })}>
                        <option value="">Seleccione uno</option>
                        <option value="1100548352">1100548352 – Juan Pérez</option>
                        <option value="1101874849">1101874849 – María García</option>
                        <option value="1030666115">1030666115 – Carlos López</option>
                        <option value="1031165770">1031165770 – Ana Martínez</option>
                        <option value="1011394991">1011394991 – Pedro Sánchez</option>
                        <option value="8203319">8203319 – Luis Rodríguez</option>
                        <option value="1051885649">1051885649 – Sara Torres</option>
                        <option value="1004686380">1004686380 – Diego Ramírez</option>
                      </select>
                      <button className={iconBtn}><FaQuestionCircle /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={handleAgregar} className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold">
              <FaPlus /> Agregar
            </button>
            <button onClick={() => setView('dashboard')} className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold">
              <FaHome /> Inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────── VISOR ───────────────────────
  if (view === 'visor') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
        Documentos: Visor general de documentos
      </div>
      <div className="p-4">
        {/* tabs */}
        <div className="flex border-b border-gray-300 bg-white mb-4 overflow-x-auto">
          {(Object.keys(visorTabLabel) as VisorTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setVisorTab(tab); setCurrentPage(1); setSearch('') }}
              className={`px-5 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors ${
                visorTab === tab ? 'border-blue-600 text-blue-700 bg-white font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {visorTabLabel[tab]}
            </button>
          ))}
        </div>

        {/* table tabs */}
        {(visorTab === 'conSede' || visorTab === 'sinSede' || visorTab === 'fisico') && (
          <>
            <div className="flex items-center justify-between mb-3 bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Mostrando</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}>
                  {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                </select>
                <span>resultados por página</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Buscar:</span>
                <input className="border border-gray-300 rounded px-2 py-1 text-xs w-36" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} />
                <button onClick={() => toast('Exportando CSV...')} className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">CSV</button>
                <button onClick={() => toast('Exportando Excel...')} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Excel</button>
              </div>
            </div>

            <div className="bg-white rounded border border-gray-200 overflow-x-auto">
              {paged.length === 0 ? (
                <div>
                  <div className="text-center py-5 text-sm text-gray-400 bg-gray-50">No hay datos en la tabla</div>
                  <div className="text-xs text-gray-400 p-3">No hay registros disponibles</div>
                </div>
              ) : (
                <table className="w-full text-xs min-w-max">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Fecha_Creacion','Titulo','Trabajadores','Departamento','Municipio','Periodo','Tiempo retención','Disposición','Eliminar','Descargar'].map(col => (
                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none">
                          {col} <span className="text-gray-400">↕</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((doc, i) => (
                      <tr key={doc.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-1.5 whitespace-nowrap">{doc.fechaCreacion}</td>
                        <td className="px-3 py-1.5 max-w-xs truncate">{doc.titulo}</td>
                        <td className="px-3 py-1.5">{doc.trabajadores}</td>
                        <td className="px-3 py-1.5">{doc.departamento}</td>
                        <td className="px-3 py-1.5">{doc.municipio}</td>
                        <td className="px-3 py-1.5">{doc.periodo}</td>
                        <td className="px-3 py-1.5">{doc.tiempoRetencion}</td>
                        <td className="px-3 py-1.5">{doc.disposicion}</td>
                        <td className="px-3 py-1.5">
                          <button onClick={() => setDocs(prev => prev.filter(d => d.id !== doc.id))} className="px-2 py-0.5 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                            Eliminar
                          </button>
                        </td>
                        <td className="px-3 py-1.5">
                          <button onClick={() => toast('Descargando documento...')} className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                            Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* pagination */}
            <div className="flex items-center justify-between mt-3">
              <div className="text-xs text-gray-500">
                {filtered.length > 0 ? `Viendo página ${currentPage} de ${totalPages}` : 'No hay registros disponibles'}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-300 text-xs rounded disabled:opacity-40 hover:bg-gray-50">Previo</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 border text-xs rounded ${currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
                {totalPages > 5 && <><span className="text-xs text-gray-400">...</span><button onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1 border text-xs rounded ${currentPage === totalPages ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>{totalPages}</button></>}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-300 text-xs rounded disabled:opacity-40 hover:bg-gray-50">Siguiente</button>
              </div>
            </div>
          </>
        )}

        {/* backup tab */}
        {visorTab === 'backup' && (
          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex gap-3">
              <FaInfoCircle className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                <strong>¡Importante!</strong> Señor usuario si continua con este proceso los documentos asociados se empaquetarán en una sola carpeta y esto no podrá devolverse. La carpeta comprimida se enviará al visor de documentos y desde ahí podrá descargarlo y eliminarlo definitivamente del gestor documental.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Inicio:</label><input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue="2026-03-23" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Final:</label><input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" defaultValue="2026-03-23" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-1">Contratista:</label><select className="w-full border border-gray-300 rounded px-3 py-2 text-sm"><option>Seleccione uno</option></select></div>
            </div>
            <div className="flex justify-center mt-6">
              <button onClick={() => toast.success('Generando backup...')} className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold">Generar</button>
            </div>
          </div>
        )}

        {/* online tab */}
        {visorTab === 'online' && (
          <div className="bg-white rounded border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-700 mb-3">Recursos en línea</h3>
            <p className="text-sm text-gray-400">No hay recursos en línea disponibles por el momento.</p>
          </div>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
            <FaHome /> Inicio
          </button>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
            <FaSyncAlt /> Regresar al escritorio
          </button>
        </div>
      </div>
    </div>
  )

  // ─────────────────────── DESCARGA MASIVA ───────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
        Descarga archivos del sistema
      </div>
      <div className="p-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 relative">
          <button onClick={() => setView('dashboard')} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><FaTimes /></button>
          <div className="flex gap-3">
            <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              <strong>¡Importante!</strong> Señor usuario si continua con este proceso los documentos asociados se empaquetarán en una sola carpeta y esto no podrá devolverse. La carpeta comprimida se enviará al visor de documentos en la pestaña Generar Backup y desde ahí podrá descargarlo y eliminarlo definitivamente del gestor documental. Tenga en cuenta que para poder eliminar la carpeta definitivamente debe haberla descargado al menos una vez.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Inicio:</label>
            <div className="flex gap-1">
              <input type="date" className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm" value={descarga.fechaInicio} onChange={e => setDescarga({ ...descarga, fechaInicio: e.target.value })} />
              <button className="px-2 py-2 bg-gray-100 border border-gray-300 text-gray-500 text-xs"><FaCalendarAlt /></button>
              <button className="px-2 py-2 bg-gray-100 border border-gray-300 rounded-r text-gray-500 text-xs"><FaQuestionCircle /></button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Final:</label>
            <div className="flex gap-1">
              <input type="date" className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm" value={descarga.fechaFin} onChange={e => setDescarga({ ...descarga, fechaFin: e.target.value })} />
              <button className="px-2 py-2 bg-gray-100 border border-gray-300 text-gray-500 text-xs"><FaCalendarAlt /></button>
              <button className="px-2 py-2 bg-gray-100 border border-gray-300 rounded-r text-gray-500 text-xs"><FaQuestionCircle /></button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contratista:</label>
            <div className="flex gap-1">
              <select className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" value={descarga.contratista} onChange={e => setDescarga({ ...descarga, contratista: e.target.value })}>
                <option value="">Seleccione uno</option>
              </select>
              <button className="px-2 py-2 bg-gray-100 border border-gray-300 rounded text-gray-500 text-xs"><FaQuestionCircle /></button>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button onClick={() => toast.success('Generando descarga masiva...')} className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold">
            Generar
          </button>
        </div>
      </div>
    </div>
  )
}
