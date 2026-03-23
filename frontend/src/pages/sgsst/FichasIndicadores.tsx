import { useState } from 'react'
import {
  FaRobot,
  FaPlus,
  FaFileImport,
  FaEdit,
  FaEye,
  FaHome,
  FaSyncAlt,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaSave,
  FaTimes,
  FaCopy,
  FaChartBar,
  FaInfoCircle,
  FaFileExcel,
  FaBookmark,
} from 'react-icons/fa'
import toast from 'react-hot-toast'

type View = 'dashboard' | 'agregar' | 'copiar' | 'importar'
type DashboardPanel = 'mis' | 'agrupacion'

interface Indicador {
  id: number
  codigo: string
  nombre: string
  fechaCreacion: string
  responsableMedicion: string
  responsableAnalisis: string
  frecuencia: string
  naturaleza: string
  mediciones: number
  documentos: number
  objetivo: string
  variable1: string
  variable2: string
  descVariable1: string
  descVariable2: string
  unidadCalculo: string
  tipoOperacion: string
  formula: string
  proceso: string
  fuenteInfo: string
  personasDestino: string
}

interface IndicadorAgrupado {
  id: number
  codigo: string
  creado: string
  nombre: string
  naturaleza: string
}

// ── Mock data ──
const initialIndicadores: Indicador[] = [
  { id: 1,  codigo: 'PGA-001', nombre: 'Tasa de severidad por caída desde alturas', fechaCreacion: '2020-08-04', responsableMedicion: 'Residente SISOMA', responsableAnalisis: 'Residente SISOMA',        frecuencia: 'Trimestral', naturaleza: 'Resultado', mediciones: 0, documentos: 0, objetivo: 'Medir la severidad de accidentes por caída desde alturas', variable1: 'Días perdidos', variable2: 'HHT', descVariable1: 'Días perdidos por AT', descVariable2: 'Horas hombre trabajadas', unidadCalculo: '%', tipoOperacion: 'División', formula: '(Días perdidos / HHT) x 200000', proceso: 'Gestión SST', fuenteInfo: 'Registros de accidentalidad', personasDestino: 'Gerencia, Coordinador SST' },
  { id: 2,  codigo: 'GE-001', nombre: 'Frecuencia de la accidentalidad mensual',    fechaCreacion: '0000-00-00', responsableMedicion: 'Residente SISOMA', responsableAnalisis: 'Coordinador experto SST', frecuencia: 'Mensual',    naturaleza: 'Resultado', mediciones: 0, documentos: 0, objetivo: 'Calcular la frecuencia de accidentes en el mes',         variable1: 'Número AT',   variable2: 'HHT', descVariable1: 'Número de accidentes de trabajo',  descVariable2: 'Horas hombre trabajadas', unidadCalculo: 'Tasa', tipoOperacion: 'División', formula: '(Num AT / HHT) x 200000', proceso: 'Gestión SST', fuenteInfo: 'Estadísticas de AT', personasDestino: '' },
  { id: 3,  codigo: 'GE-002', nombre: 'Frecuencia de la accidentalidad anual',      fechaCreacion: '0000-00-00', responsableMedicion: 'Residente SISOMA', responsableAnalisis: 'Coordinador experto SST', frecuencia: 'Anual',      naturaleza: 'Resultado', mediciones: 0, documentos: 0, objetivo: 'Calcular la frecuencia de accidentes en el año',          variable1: 'Número AT',   variable2: 'HHT', descVariable1: 'Número de accidentes de trabajo',  descVariable2: 'Horas hombre trabajadas', unidadCalculo: 'Tasa', tipoOperacion: 'División', formula: '(Num AT / HHT) x 240000', proceso: 'Gestión SST', fuenteInfo: 'Estadísticas de AT', personasDestino: '' },
  { id: 4,  codigo: 'GE-003', nombre: 'Severidad de la accidentalidad anual',       fechaCreacion: '0000-00-00', responsableMedicion: 'Residente SISOMA', responsableAnalisis: 'Coordinador experto SST', frecuencia: 'Mensual',    naturaleza: 'Resultado', mediciones: 0, documentos: 0, objetivo: 'Calcular la severidad de los accidentes laborales',      variable1: 'Días perdidos', variable2: 'HHT', descVariable1: 'Días perdidos por AT', descVariable2: 'Horas hombre trabajadas', unidadCalculo: '%', tipoOperacion: 'División', formula: '(Días perdidos / HHT) x 200000', proceso: 'Gestión SST', fuenteInfo: 'Estadísticas de AT', personasDestino: '' },
]

const globalIndicadores = [
  { id: 1, codigo: 'F-GER-05', nombre: 'Pausas Activas',              objetivo: 'Analizar las estadísticas de pausas activas teniendo en cuenta los soportes entregados VS los colaboradores por cada Área.',  fuenteInfo: 'Registro de entrega de pausas activas F-SST 38', variable1: '#trabajadores que realizaron las pausas activas en el periodo', variable2: '# trabajadores en el periodo',           frecuencia: 'Mensual', naturaleza: 'Resultado' },
  { id: 2, codigo: 'RES1',     nombre: 'Tasa Accidentalidad',         objetivo: 'Relación del número de casos de accidentes de trabajo, ocurridos durante el periodo con el número promedio de trabajadores en el mismo período.', fuenteInfo: 'Accidentes de trabajo',              variable1: 'Numero total de accidentes',                                 variable2: 'Número promedio de trabajadores',        frecuencia: 'Mensual', naturaleza: 'Resultado' },
  { id: 3, codigo: 'RES2',     nombre: 'Porcentaje de Tiempo Perdido', objetivo: 'Muestra el porcentaje perdido en un año con relacion al tiempo programado.',                                                    fuenteInfo: 'ESTADÍSTICAS DE AUSENTISMO',          variable1: 'Número de horas perdidas en el año',                         variable2: 'Numero de dias programados en el año',  frecuencia: 'Anual',   naturaleza: 'Resultado' },
  { id: 4, codigo: 'RES3',     nombre: 'Cobertura Inducción',         objetivo: 'Muestra el porcentaje de personas que reciben la induccion.',                                                                    fuenteInfo: 'Asistencia inducciones e ingresos',   variable1: 'Número de desponas que asisten a la inducción',              variable2: 'Numero de personas que ingresan en el periodo', frecuencia: 'Mensual', naturaleza: 'Resultado' },
  { id: 5, codigo: 'RES4',     nombre: '% Cubrimiento EPP',           objetivo: 'Proporción de trabajadores que reciben los EPP.',                                                                               fuenteInfo: 'Entregas EPP y matriz EPP',           variable1: 'Numero de EPP entregados',                                   variable2: 'Numero EPP requeridos',                 frecuencia: 'Mensual', naturaleza: 'Resultado' },
  { id: 6, codigo: 'RES5',     nombre: 'Índice de Ausentismo',        objetivo: 'Mide el nivel de ausencias laborales en relación con las horas totales programadas.',                                           fuenteInfo: 'Registros de ausentismo',             variable1: 'Horas de ausentismo',                                        variable2: 'Total horas programadas',               frecuencia: 'Mensual', naturaleza: 'Resultado' },
  { id: 7, codigo: 'RES6',     nombre: 'Cobertura Exámenes Médicos',  objetivo: 'Porcentaje de trabajadores con exámenes médicos realizados vs requeridos.',                                                    fuenteInfo: 'Registros medicina laboral',          variable1: 'Exámenes realizados',                                        variable2: 'Exámenes requeridos',                   frecuencia: 'Anual',   naturaleza: 'Resultado' },
]

const initialAgrupados: IndicadorAgrupado[] = [
  { id: 1, codigo: 'IAT-RB', creado: '2020-08-21', nombre: 'Indicadores de accidentalidad Reserva de Búcaros', naturaleza: 'Resultado' },
]

const emptyForm = {
  codigo: '', nombre: '', objetivo: '',
  variable1: '', descVariable1: '', variable2: '', descVariable2: '',
  unidadCalculo: '', tipoOperacion: '', formula: '',
  frecuencia: '', trabajadorMedicion: '', responsableMedicion: '',
  trabajadorAnalisis: '', responsableAnalisis: '', personasDestino: '',
  naturaleza: '', proceso: '', fuenteInfo: '',
  plantillaEmpresa: false, plantillaGeneral: false,
  fechaCreacion: '2026-03-23',
}

const frecuencias  = ['Mensual', 'Bimensual', 'Trimestral', 'Semestral', 'Anual', 'Por evento']
const naturalezas  = ['Resultado', 'Proceso', 'Gestión', 'Eficiencia', 'Eficacia']
const operaciones  = ['División', 'Multiplicación', 'Suma', 'Resta', 'Porcentaje']
const responsables = ['Residente SISOMA', 'Coordinador experto SST', 'Jefe de SST', 'Médico laboral', 'Gerencia']

export default function FichasIndicadores() {
  const [view, setView]               = useState<View>('dashboard')
  const [panel, setPanel]             = useState<DashboardPanel>('mis')
  const [indicadores, setIndicadores] = useState<Indicador[]>(initialIndicadores)
  const [agrupados, setAgrupados]     = useState<IndicadorAgrupado[]>(initialAgrupados)
  const [form, setForm]               = useState(emptyForm)
  const [editId, setEditId]           = useState<number | null>(null)
  const [search, setSearch]           = useState('')
  const [searchGlobal, setSearchGlobal] = useState('')
  const [pageSize, setPageSize]       = useState(10)
  const [archivoBulk, setArchivoBulk] = useState<File | null>(null)
  const [showNuevoAgrupado, setShowNuevoAgrupado] = useState(false)
  const [nuevoAgrupado, setNuevoAgrupado] = useState({ codigo: '', nombre: '', naturaleza: 'Resultado' })

  const filtered = indicadores.filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase()) ||
    i.codigo.toLowerCase().includes(search.toLowerCase())
  )

  const filteredGlobal = globalIndicadores.filter(i =>
    i.nombre.toLowerCase().includes(searchGlobal.toLowerCase()) ||
    i.codigo.toLowerCase().includes(searchGlobal.toLowerCase())
  )

  const handleEdit = (ind: Indicador) => {
    setForm({
      codigo: ind.codigo, nombre: ind.nombre, objetivo: ind.objetivo,
      variable1: ind.variable1, descVariable1: ind.descVariable1,
      variable2: ind.variable2, descVariable2: ind.descVariable2,
      unidadCalculo: ind.unidadCalculo, tipoOperacion: ind.tipoOperacion, formula: ind.formula,
      frecuencia: ind.frecuencia, trabajadorMedicion: '', responsableMedicion: ind.responsableMedicion,
      trabajadorAnalisis: '', responsableAnalisis: ind.responsableAnalisis, personasDestino: ind.personasDestino,
      naturaleza: ind.naturaleza, proceso: ind.proceso, fuenteInfo: ind.fuenteInfo,
      plantillaEmpresa: false, plantillaGeneral: false, fechaCreacion: ind.fechaCreacion,
    })
    setEditId(ind.id)
    setView('agregar')
  }

  const handleGuardar = () => {
    if (!form.codigo || !form.nombre) { toast.error('Código y nombre son requeridos'); return }
    if (editId) {
      setIndicadores(prev => prev.map(i => i.id === editId ? {
        ...i, codigo: form.codigo, nombre: form.nombre, objetivo: form.objetivo,
        variable1: form.variable1, descVariable1: form.descVariable1,
        variable2: form.variable2, descVariable2: form.descVariable2,
        unidadCalculo: form.unidadCalculo, tipoOperacion: form.tipoOperacion, formula: form.formula,
        frecuencia: form.frecuencia, responsableMedicion: form.responsableMedicion,
        responsableAnalisis: form.responsableAnalisis, personasDestino: form.personasDestino,
        naturaleza: form.naturaleza, proceso: form.proceso, fuenteInfo: form.fuenteInfo,
        fechaCreacion: form.fechaCreacion,
      } : i))
      toast.success('Indicador actualizado')
    } else {
      const newInd: Indicador = {
        id: indicadores.length + 1,
        codigo: form.codigo, nombre: form.nombre, fechaCreacion: form.fechaCreacion,
        responsableMedicion: form.responsableMedicion, responsableAnalisis: form.responsableAnalisis,
        frecuencia: form.frecuencia, naturaleza: form.naturaleza, mediciones: 0, documentos: 0,
        objetivo: form.objetivo, variable1: form.variable1, variable2: form.variable2,
        descVariable1: form.descVariable1, descVariable2: form.descVariable2,
        unidadCalculo: form.unidadCalculo, tipoOperacion: form.tipoOperacion, formula: form.formula,
        proceso: form.proceso, fuenteInfo: form.fuenteInfo, personasDestino: form.personasDestino,
      }
      setIndicadores(prev => [...prev, newInd])
      toast.success('Indicador creado')
    }
    setForm(emptyForm); setEditId(null); setView('dashboard')
  }

  const handleCopiar = (ind: (typeof globalIndicadores)[0]) => {
    const newInd: Indicador = {
      id: indicadores.length + 1,
      codigo: ind.codigo, nombre: ind.nombre, fechaCreacion: '2026-03-23',
      responsableMedicion: 'Residente SISOMA', responsableAnalisis: 'Residente SISOMA',
      frecuencia: ind.frecuencia, naturaleza: ind.naturaleza, mediciones: 0, documentos: 0,
      objetivo: ind.objetivo, variable1: ind.variable1, variable2: ind.variable2,
      descVariable1: '', descVariable2: '', unidadCalculo: '%', tipoOperacion: 'División',
      formula: '', proceso: '', fuenteInfo: ind.fuenteInfo, personasDestino: '',
    }
    setIndicadores(prev => [...prev, newInd])
    toast.success(`Indicador "${ind.nombre}" copiado a Mis indicadores`)
  }

  const handleCrearAgrupado = () => {
    if (!nuevoAgrupado.codigo || !nuevoAgrupado.nombre) { toast.error('Código y nombre requeridos'); return }
    setAgrupados(prev => [...prev, { id: prev.length + 1, codigo: nuevoAgrupado.codigo, creado: '2026-03-23', nombre: nuevoAgrupado.nombre, naturaleza: nuevoAgrupado.naturaleza }])
    setNuevoAgrupado({ codigo: '', nombre: '', naturaleza: 'Resultado' })
    setShowNuevoAgrupado(false)
    toast.success('Indicador agrupado creado')
  }

  // ─── shared styles ───────────────────────────────────────────
  const warnBtn = 'px-2 py-1.5 bg-yellow-400 border border-yellow-400 rounded text-white text-xs'
  const helpBtn = 'px-2 py-1.5 bg-gray-100 border border-gray-200 rounded text-gray-500 text-xs'
  const fieldLabel = 'block text-xs font-semibold text-gray-700 mb-1'

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════
  if (view === 'dashboard') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">Indicadores: Menú</div>

      {/* action bar */}
      <div className="bg-white border-b border-gray-200 px-3 py-2 flex flex-wrap gap-2 items-center">
        <button onClick={() => toast('Asistente en desarrollo')} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
          <FaRobot /> Asistente
        </button>
        <button onClick={() => { setForm(emptyForm); setEditId(null); setView('agregar') }} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded text-xs hover:bg-green-700">
          <FaPlus /> Agregar indicador
        </button>
        <button onClick={() => setView('copiar')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded text-xs hover:bg-teal-700">
          <FaBookmark /> Consultar/Copiar indicadores globales
        </button>
        <button onClick={() => setView('importar')} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded text-xs hover:bg-cyan-700">
          <FaFileImport /> Importar ficha de indicadores
        </button>
      </div>

      {/* two-panel top area */}
      <div className="flex gap-0 border-b border-gray-200">
        {/* left: chart image */}
        <button
          onClick={() => setPanel('mis')}
          className={`flex-1 flex justify-center items-center py-8 cursor-pointer transition-colors ${panel === 'mis' ? 'bg-white' : 'bg-gray-50 hover:bg-white'}`}
        >
          <FaChartBar className="text-7xl text-blue-400" style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.15))' }} />
        </button>
        {/* right: agrupación link */}
        <div className="w-px bg-gray-200" />
        <button
          onClick={() => setPanel('agrupacion')}
          className={`flex-1 flex justify-center items-center py-8 text-sm transition-colors ${panel === 'agrupacion' ? 'bg-white text-blue-700 font-semibold' : 'bg-gray-50 text-blue-600 hover:bg-white hover:text-blue-700'}`}
        >
          Agrupación de indicadores
        </button>
      </div>

      {/* ── MIS INDICADORES ── */}
      {panel === 'mis' && (
        <div className="p-4">
          <div className="bg-white rounded border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 text-center">Mis indicadores</h2>
            </div>
            {/* controls */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Mostrando</span>
                <select className="border border-gray-300 rounded px-2 py-1 text-xs" value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                  {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                </select>
                <span>resultados por página</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Buscar:</span>
                <input className="border border-gray-300 rounded px-2 py-1 text-xs w-36" value={search} onChange={e => setSearch(e.target.value)} />
                <button onClick={() => toast('Copiando...')} className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">Copy</button>
                <button onClick={() => toast('Exportando CSV...')} className="px-2 py-1 bg-gray-200 text-xs rounded hover:bg-gray-300">CSV</button>
                <button onClick={() => toast('Exportando Excel...')} className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">Excel</button>
              </div>
            </div>
            {/* table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-max">
                <thead className="bg-gray-50 border-y border-gray-200">
                  <tr>
                    {['Código','Nombre','Fecha creación','Responsable medición','Responsable análisis','Frecuencia','Naturaleza','Mediciones','Acciones'].map(col => (
                      <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none">
                        {col} <span className="text-gray-400">↕</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, pageSize).map((ind, i) => (
                    <tr key={ind.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-mono text-gray-700">{ind.codigo}</td>
                      <td className="px-3 py-2 max-w-xs">{ind.nombre}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{ind.fechaCreacion}</td>
                      <td className="px-3 py-2">{ind.responsableMedicion}</td>
                      <td className="px-3 py-2">{ind.responsableAnalisis}</td>
                      <td className="px-3 py-2">{ind.frecuencia}</td>
                      <td className="px-3 py-2">{ind.naturaleza}</td>
                      <td className="px-3 py-2 text-center">{ind.mediciones}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1">
                            <button onClick={() => handleEdit(ind)} className="p-1.5 bg-orange-400 text-white rounded hover:bg-orange-500" title="Editar"><FaEdit className="text-xs" /></button>
                            <button onClick={() => toast(`Agregar medición a ${ind.codigo}`)} className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700" title="Agregar medición"><FaPlus className="text-xs" /></button>
                          </div>
                          <button onClick={() => toast(`Ver ficha: ${ind.nombre}`)} className="p-1.5 bg-teal-600 text-white rounded hover:bg-teal-700 w-fit" title="Visualizar"><FaEye className="text-xs" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && <p className="text-xs text-gray-400 p-4">No hay registros disponibles</p>}
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">Mostrando {Math.min(filtered.length, pageSize)} de {filtered.length} registros</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Previo</button>
                <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 text-xs rounded">1</button>
                <button className="px-3 py-1 bg-white border border-gray-300 text-xs rounded hover:bg-gray-50">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AGRUPACIÓN ── */}
      {panel === 'agrupacion' && (
        <div className="p-4">
          <div className="bg-white rounded border border-gray-200 p-4">
            <button
              onClick={() => setShowNuevoAgrupado(!showNuevoAgrupado)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 text-white rounded text-sm hover:bg-teal-600 mb-4"
            >
              <FaPlus /> Crear nuevo indicador agrupado
            </button>

            {showNuevoAgrupado && (
              <div className="border border-gray-200 rounded p-4 mb-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Nuevo indicador agrupado</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={fieldLabel}>Código:</label>
                    <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={nuevoAgrupado.codigo} onChange={e => setNuevoAgrupado({ ...nuevoAgrupado, codigo: e.target.value })} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Nombre:</label>
                    <input className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={nuevoAgrupado.nombre} onChange={e => setNuevoAgrupado({ ...nuevoAgrupado, nombre: e.target.value })} />
                  </div>
                  <div>
                    <label className={fieldLabel}>Naturaleza:</label>
                    <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" value={nuevoAgrupado.naturaleza} onChange={e => setNuevoAgrupado({ ...nuevoAgrupado, naturaleza: e.target.value })}>
                      {naturalezas.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleCrearAgrupado} className="px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">Guardar</button>
                  <button onClick={() => setShowNuevoAgrupado(false)} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">Cancelar</button>
                </div>
              </div>
            )}

            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  {['Código','Creado','Nombre','Naturaleza','Acciones'].map(col => (
                    <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agrupados.map((ag, i) => (
                  <tr key={ag.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-mono">{ag.codigo}</td>
                    <td className="px-3 py-2">{ag.creado}</td>
                    <td className="px-3 py-2">{ag.nombre}</td>
                    <td className="px-3 py-2">{ag.naturaleza}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <button onClick={() => toast(`Visualizar: ${ag.nombre}`)} className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-white rounded text-xs hover:bg-teal-700"><FaEye /> Visualizar</button>
                        <button onClick={() => toast(`Editar: ${ag.nombre}`)} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"><FaEdit /> Editar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-xs text-gray-500 mt-2 px-1">Total registros encontrados: {agrupados.length}</div>
          </div>
          <div className="flex justify-center mt-6">
            <button onClick={() => window.history.back()} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <FaSyncAlt /> Regresar al escritorio
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // AGREGAR / EDITAR
  // ═══════════════════════════════════════════════════════════
  if (view === 'agregar') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
        Indicadores: {editId ? 'Editar' : 'Registro encabezado'} ficha de indicador
      </div>
      <div className="p-5">
        {/* section headers */}
        <div className="grid grid-cols-3 gap-6 mb-1">
          <div className="border border-gray-300 rounded-t text-center py-2 bg-gray-50 text-xs font-semibold text-gray-700">Descripción básica</div>
          <button onClick={() => toast('Estado indicador')} className="border border-gray-300 rounded-t text-center py-2 bg-white text-xs font-semibold text-teal-600 hover:bg-gray-50">Estado indicador</button>
          <button onClick={() => toast('Gestionar naturaleza')} className="border border-gray-300 rounded-t text-center py-2 bg-white text-xs font-semibold text-teal-600 hover:bg-gray-50">Gestionar naturaleza indicador</button>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-white border border-gray-300 rounded-b p-5">
          {/* ── Col 1: Descripción básica ── */}
          <div className="space-y-4">
            {/* fecha */}
            <div>
              <label className={fieldLabel}>Fecha creación:</label>
              <div className="flex gap-1">
                <input type="date" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.fechaCreacion} onChange={e => setForm({ ...form, fechaCreacion: e.target.value })} />
                <button className={helpBtn}><FaCalendarAlt /></button>
                <button className={warnBtn}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* norma pill */}
            <div>
              <button className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700">
                <FaBookmark className="text-xs" /> Norma: Indicadores del sistema
              </button>
            </div>
            {/* código */}
            <div>
              <label className={fieldLabel}>Código indicador:</label>
              <div className="flex gap-1">
                <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} />
                <button className={warnBtn}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* nombre */}
            <div>
              <label className={fieldLabel}>Nombre indicador:</label>
              <div className="flex gap-1">
                <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                <button className={warnBtn}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* objetivo */}
            <div>
              <label className={fieldLabel}>Objetivo del indicador:</label>
              <div className="flex gap-1">
                <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.objetivo} onChange={e => setForm({ ...form, objetivo: e.target.value })} />
                <button className={`self-start mt-1 ${warnBtn}`}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* variable1 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>Nombre variable1:</label>
                <div className="flex gap-1">
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.variable1} onChange={e => setForm({ ...form, variable1: e.target.value })} />
                  <button className={helpBtn}><FaQuestionCircle /></button>
                </div>
              </div>
              <div>
                <label className={fieldLabel}>Descripción variable1:</label>
                <div className="flex gap-1">
                  <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-14 resize-none" value={form.descVariable1} onChange={e => setForm({ ...form, descVariable1: e.target.value })} />
                  <button className={`self-start mt-1 ${helpBtn}`}><FaQuestionCircle /></button>
                </div>
              </div>
            </div>
            {/* variable2 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>Nombre variable2:</label>
                <div className="flex gap-1">
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.variable2} onChange={e => setForm({ ...form, variable2: e.target.value })} />
                  <button className={helpBtn}><FaQuestionCircle /></button>
                </div>
              </div>
              <div>
                <label className={fieldLabel}>Descripción variable2:</label>
                <div className="flex gap-1">
                  <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-14 resize-none" value={form.descVariable2} onChange={e => setForm({ ...form, descVariable2: e.target.value })} />
                  <button className={`self-start mt-1 ${helpBtn}`}><FaQuestionCircle /></button>
                </div>
              </div>
            </div>
            {/* unidad + tipo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={fieldLabel}>Unidad de calculo:</label>
                <div className="flex gap-1">
                  <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.unidadCalculo} onChange={e => setForm({ ...form, unidadCalculo: e.target.value })} />
                  <button className={warnBtn}><FaExclamationTriangle /></button>
                  <button className={helpBtn}><FaQuestionCircle /></button>
                </div>
              </div>
              <div>
                <label className={fieldLabel}>Tipo de operación:</label>
                <div className="flex gap-1">
                  <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.tipoOperacion} onChange={e => setForm({ ...form, tipoOperacion: e.target.value })}>
                    <option value="">Seleccione uno</option>
                    {operaciones.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <button className={warnBtn}><FaExclamationTriangle /></button>
                  <button className={helpBtn}><FaQuestionCircle /></button>
                </div>
              </div>
            </div>
            {/* fórmula */}
            <div>
              <label className={fieldLabel}>Formula o método de calculo:</label>
              <div className="flex gap-1">
                <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.formula} onChange={e => setForm({ ...form, formula: e.target.value })} />
                <button className={`self-start mt-1 ${warnBtn}`}><FaExclamationTriangle /></button>
              </div>
            </div>
          </div>

          {/* ── Col 2: Estado indicador ── */}
          <div className="space-y-4">
            {/* frecuencia */}
            <div>
              <label className={fieldLabel}>Frecuencia medición del indicador:</label>
              <div className="flex gap-1">
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.frecuencia} onChange={e => setForm({ ...form, frecuencia: e.target.value })}>
                  <option value="">Seleccione uno</option>
                  {frecuencias.map(f => <option key={f}>{f}</option>)}
                </select>
                <button className={warnBtn}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* responsable medición */}
            <div>
              <label className={fieldLabel}>Trabajadores registrados para responsable de medición:</label>
              <div className="flex gap-1">
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.trabajadorMedicion} onChange={e => setForm({ ...form, trabajadorMedicion: e.target.value })}>
                  <option value="">Seleccione uno</option>
                  {responsables.map(r => <option key={r}>{r}</option>)}
                </select>
                <button className={helpBtn}><FaQuestionCircle /></button>
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Responsable(s) medición:</label>
              <div className="flex gap-1">
                <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.responsableMedicion} onChange={e => setForm({ ...form, responsableMedicion: e.target.value })} />
                <button className={`self-start mt-1 ${warnBtn}`}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* responsable análisis */}
            <div>
              <label className={fieldLabel}>Trabajadores registrados para responsable de análisis:</label>
              <div className="flex gap-1">
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.trabajadorAnalisis} onChange={e => setForm({ ...form, trabajadorAnalisis: e.target.value })}>
                  <option value="">Seleccione uno</option>
                  {responsables.map(r => <option key={r}>{r}</option>)}
                </select>
                <button className={helpBtn}><FaQuestionCircle /></button>
              </div>
            </div>
            <div>
              <label className={fieldLabel}>Responsable(s) análisis:</label>
              <div className="flex gap-1">
                <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.responsableAnalisis} onChange={e => setForm({ ...form, responsableAnalisis: e.target.value })} />
                <button className={`self-start mt-1 ${warnBtn}`}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* personas destino */}
            <div>
              <label className={fieldLabel}>Personas destino:</label>
              <div className="flex gap-1">
                <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-16 resize-none" value={form.personasDestino} onChange={e => setForm({ ...form, personasDestino: e.target.value })} />
                <button className={`self-start mt-1 ${helpBtn}`}><FaQuestionCircle /></button>
              </div>
            </div>
          </div>

          {/* ── Col 3: Naturaleza ── */}
          <div className="space-y-4">
            {/* naturaleza */}
            <div>
              <label className={fieldLabel}>Naturaleza:</label>
              <div className="flex gap-1">
                <select className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.naturaleza} onChange={e => setForm({ ...form, naturaleza: e.target.value })}>
                  <option value="">Seleccione uno</option>
                  {naturalezas.map(n => <option key={n}>{n}</option>)}
                </select>
                <button className={warnBtn}><FaExclamationTriangle /></button>
              </div>
            </div>
            {/* proceso */}
            <div>
              <label className={fieldLabel}>Proceso:</label>
              <div className="flex gap-1">
                <input type="text" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm" value={form.proceso} onChange={e => setForm({ ...form, proceso: e.target.value })} />
                <button className={helpBtn}><FaQuestionCircle /></button>
              </div>
            </div>
            {/* fuente */}
            <div>
              <label className={fieldLabel}>Fuente de información para el calculo:</label>
              <div className="flex gap-1">
                <textarea className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm h-20 resize-none" value={form.fuenteInfo} onChange={e => setForm({ ...form, fuenteInfo: e.target.value })} />
                <div className="flex flex-col gap-1 self-start mt-1">
                  <button className={warnBtn}><FaExclamationTriangle /></button>
                  <button className={helpBtn}><FaQuestionCircle /></button>
                </div>
              </div>
            </div>
            {/* compartir */}
            <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600 space-y-3">
              <p>Seleccione esta casilla de abajo si desea compartir solo con otras empresas creadas por su usuario este indicador</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.plantillaEmpresa} onChange={e => setForm({ ...form, plantillaEmpresa: e.target.checked })} className="w-3.5 h-3.5" />
                Plantilla empresa
              </label>
              <p>Seleccione esta casilla de abajo si desea compartir este indicador con otros usuarios de SIGSTO</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.plantillaGeneral} onChange={e => setForm({ ...form, plantillaGeneral: e.target.checked })} className="w-3.5 h-3.5" />
                Plantilla general
              </label>
            </div>
          </div>
        </div>

        {/* bottom buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button onClick={handleGuardar} className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold">
            <FaSave /> Guardar
          </button>
          <button onClick={() => { setView('dashboard'); setForm(emptyForm); setEditId(null) }} className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold">
            <FaHome /> Inicio
          </button>
          <button onClick={() => window.history.back()} className="flex items-center gap-2 px-8 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm">
            <FaSyncAlt /> Regresar al escritorio
          </button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════
  // COPIAR INDICADORES GLOBALES
  // ═══════════════════════════════════════════════════════════
  if (view === 'copiar') return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">Indicadores: Copiar indicadores</div>
      <div className="p-4">
        <div className="bg-white rounded border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Lista de indicadores que puede copiar para su SG-SST</h2>

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
              <input className="border border-gray-300 rounded px-2 py-1 text-xs w-36" value={searchGlobal} onChange={e => setSearchGlobal(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-max">
              <thead className="bg-gray-50 border-y border-gray-200">
                <tr>
                  {['Codigo','Nombre','Objetivo','Fuente información','Variable1','Variable2','Frecuencia','Naturaleza',''].map((col, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{col} {col && <span className="text-gray-400">↕</span>}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGlobal.map((ind, i) => (
                  <tr key={ind.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-mono text-gray-700 whitespace-nowrap">{ind.codigo}</td>
                    <td className="px-3 py-2 max-w-[10rem] truncate font-medium">{ind.nombre}</td>
                    <td className="px-3 py-2 max-w-[14rem] text-gray-600">{ind.objetivo}</td>
                    <td className="px-3 py-2 max-w-[10rem] truncate">{ind.fuenteInfo}</td>
                    <td className="px-3 py-2 max-w-[10rem] truncate">{ind.variable1}</td>
                    <td className="px-3 py-2 max-w-[10rem] truncate">{ind.variable2}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{ind.frecuencia}</td>
                    <td className="px-3 py-2">{ind.naturaleza}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <button onClick={() => handleCopiar(ind)} className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600" title="Copiar a mis indicadores"><FaCopy className="text-xs" /></button>
                        <button onClick={() => toast(`Ver: ${ind.nombre}`)} className="p-1.5 bg-teal-600 text-white rounded hover:bg-teal-700" title="Visualizar"><FaEye className="text-xs" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

  // ═══════════════════════════════════════════════════════════
  // IMPORTAR
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-700 text-white px-4 py-2 text-sm font-semibold">
        Indicadores: Procesos de importación de fichas de indicadores encabezado
      </div>
      <div className="p-6">
        {/* info box */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 relative">
          <button onClick={() => setView('dashboard')} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><FaTimes /></button>
          <div className="flex gap-3 items-start">
            <FaInfoCircle className="text-blue-600 text-2xl flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">Ayuda</span>
                <button className="flex items-center gap-1 px-2 py-0.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"><FaRobot className="text-xs" /> Asistente</button>
              </div>
              <div className="text-blue-700 font-semibold">Importación de indicadores</div>
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
              <label className={fieldLabel}>Formato del archivo:</label>
              <select className="border border-gray-300 rounded px-3 py-2 text-sm w-56">
                <option>Excel 5 (.XLS)</option>
                <option>Excel (.XLSX)</option>
                <option>CSV</option>
              </select>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Atención:</h3>
              <p className="text-sm text-gray-700 mb-3">
                <strong>Se recomienda que descargue su información previo a este proceso antes de continuar.</strong>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <span className="text-red-600 font-semibold">Importante:</span> La primera fila de la hoja de calculo deberá contener como encabezados el nombre exacto del campo en la tabla sobre la cual se desea importar los valores.
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-2 mb-4">
                <li>Se <strong>ignorarán</strong> los indicadores que tengan <strong>nombre</strong> repetidos !!!</li>
              </ul>
              <button
                onClick={() => {
                  if (!archivoBulk) { toast.error('Seleccione un archivo primero'); return }
                  toast.success('Archivo cargado, procesando importación...')
                  setArchivoBulk(null)
                  setView('dashboard')
                }}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
              >
                <FaFileExcel /> Entiendo el proceso, Cargar archivo y continuar importación
              </button>
            </div>
          </div>

          <div className="flex justify-end items-start">
            <button onClick={() => toast('Descargando plantilla...')} className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-semibold w-full justify-center">
              <FaFileExcel /> Plantilla para importación de indicadores
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-8">
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
}
