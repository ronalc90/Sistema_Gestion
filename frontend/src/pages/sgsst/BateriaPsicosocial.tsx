import { useState } from 'react'
import { FaListAlt, FaPlus, FaEdit, FaEye, FaArrowLeft, FaSearch } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type View = 'dashboard' | 'lista' | 'detalle' | 'formulario'
type NivelRiesgo5 = 'Sin riesgo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy alto'
type NivelEstres = 'Sin estrés' | 'Muy bajo' | 'Bajo' | 'Medio' | 'Alto' | 'Muy alto'
type Instrumento = 'Batería MinTrabajo Form A' | 'Batería MinTrabajo Form B' | 'Encuesta clima'
type EstadoEval = 'Aplicada' | 'Pendiente' | 'En intervención'

interface EvaluacionPsicosocial {
  id: string
  codigo: string
  trabajador: string
  cargo: string
  area: string
  sede: string
  fechaAplicacion: string
  periodoCoberto: string
  instrumento: Instrumento
  nivelRiesgoIntralaboral: NivelRiesgo5
  nivelRiesgoExtralaboral: NivelRiesgo5
  nivelEstres: NivelEstres
  intervencion: boolean
  estado: EstadoEval
  observaciones?: string
}

const mockEvaluaciones: EvaluacionPsicosocial[] = [
  {
    id: '1', codigo: 'PSI-001', trabajador: 'Carlos Martínez', cargo: 'Operario de Producción',
    area: 'Producción', sede: 'Sede Principal', fechaAplicacion: '2026-01-15', periodoCoberto: '2025-II',
    instrumento: 'Batería MinTrabajo Form A', nivelRiesgoIntralaboral: 'Alto', nivelRiesgoExtralaboral: 'Medio',
    nivelEstres: 'Alto', intervencion: true, estado: 'En intervención',
    observaciones: 'Se identificaron altas demandas de trabajo y poco control. Derivado a psicólogo.'
  },
  {
    id: '2', codigo: 'PSI-002', trabajador: 'Ana Gómez', cargo: 'Técnico de Laboratorio',
    area: 'Calidad', sede: 'Sede Principal', fechaAplicacion: '2026-01-15', periodoCoberto: '2025-II',
    instrumento: 'Batería MinTrabajo Form A', nivelRiesgoIntralaboral: 'Bajo', nivelRiesgoExtralaboral: 'Bajo',
    nivelEstres: 'Bajo', intervencion: false, estado: 'Aplicada'
  },
  {
    id: '3', codigo: 'PSI-003', trabajador: 'Luis Rodríguez', cargo: 'Conductor',
    area: 'Logística', sede: 'Sede Principal', fechaAplicacion: '2026-01-20', periodoCoberto: '2025-II',
    instrumento: 'Batería MinTrabajo Form B', nivelRiesgoIntralaboral: 'Medio', nivelRiesgoExtralaboral: 'Alto',
    nivelEstres: 'Medio', intervencion: true, estado: 'En intervención',
    observaciones: 'Factores extralaborales (situación económica familiar). Requiere intervención.'
  },
  {
    id: '4', codigo: 'PSI-004', trabajador: 'María Castillo', cargo: 'Auxiliar Administrativo',
    area: 'Administración', sede: 'Sede Norte', fechaAplicacion: '2026-02-01', periodoCoberto: '2025-II',
    instrumento: 'Batería MinTrabajo Form A', nivelRiesgoIntralaboral: 'Sin riesgo', nivelRiesgoExtralaboral: 'Sin riesgo',
    nivelEstres: 'Sin estrés', intervencion: false, estado: 'Aplicada'
  },
  {
    id: '5', codigo: 'PSI-005', trabajador: 'Jorge Herrera', cargo: 'Almacenista',
    area: 'Logística', sede: 'Sede Norte', fechaAplicacion: '2026-02-05', periodoCoberto: '2025-II',
    instrumento: 'Batería MinTrabajo Form B', nivelRiesgoIntralaboral: 'Muy alto', nivelRiesgoExtralaboral: 'Alto',
    nivelEstres: 'Muy alto', intervencion: true, estado: 'En intervención',
    observaciones: 'Caso prioritario. Se reporta conflictos con jefe directo y alta carga laboral.'
  },
  {
    id: '6', codigo: 'PSI-006', trabajador: 'Patricia Silva', cargo: 'Analista de Calidad',
    area: 'Calidad', sede: 'Sede Sur', fechaAplicacion: '2026-02-10', periodoCoberto: '2025-II',
    instrumento: 'Encuesta clima', nivelRiesgoIntralaboral: 'Bajo', nivelRiesgoExtralaboral: 'Bajo',
    nivelEstres: 'Bajo', intervencion: false, estado: 'Aplicada'
  },
  {
    id: '7', codigo: 'PSI-007', trabajador: 'Hernán Torres', cargo: 'Técnico Electricista',
    area: 'Mantenimiento', sede: 'Sede Principal', fechaAplicacion: '2026-03-01', periodoCoberto: '2026-I',
    instrumento: 'Batería MinTrabajo Form A', nivelRiesgoIntralaboral: 'Alto', nivelRiesgoExtralaboral: 'Medio',
    nivelEstres: 'Alto', intervencion: true, estado: 'Pendiente',
    observaciones: 'Pendiente inicio de intervención con psicólogo SST.'
  },
  {
    id: '8', codigo: 'PSI-008', trabajador: 'Sandra López', cargo: 'Jefe de Mantenimiento',
    area: 'Mantenimiento', sede: 'Sede Principal', fechaAplicacion: '2026-03-10', periodoCoberto: '2026-I',
    instrumento: 'Batería MinTrabajo Form A', nivelRiesgoIntralaboral: 'Medio', nivelRiesgoExtralaboral: 'Bajo',
    nivelEstres: 'Medio', intervencion: false, estado: 'Aplicada'
  }
]

const nivelColors: Record<NivelRiesgo5, string> = {
  'Sin riesgo': 'bg-green-100 text-green-700',
  'Bajo': 'bg-blue-100 text-blue-700',
  'Medio': 'bg-yellow-100 text-yellow-700',
  'Alto': 'bg-orange-100 text-orange-700',
  'Muy alto': 'bg-red-100 text-red-700'
}

const estresColors: Record<NivelEstres, string> = {
  'Sin estrés': 'bg-green-100 text-green-700',
  'Muy bajo': 'bg-blue-100 text-blue-700',
  'Bajo': 'bg-blue-50 text-blue-600',
  'Medio': 'bg-yellow-100 text-yellow-700',
  'Alto': 'bg-orange-100 text-orange-700',
  'Muy alto': 'bg-red-100 text-red-700'
}

const estadoColors: Record<EstadoEval, string> = {
  'Aplicada': 'bg-green-100 text-green-700',
  'Pendiente': 'bg-yellow-100 text-yellow-700',
  'En intervención': 'bg-purple-100 text-purple-700'
}

const nivelesRiesgo: NivelRiesgo5[] = ['Sin riesgo', 'Bajo', 'Medio', 'Alto', 'Muy alto']
const nivelesEstres: NivelEstres[] = ['Sin estrés', 'Muy bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto']
const instrumentos: Instrumento[] = ['Batería MinTrabajo Form A', 'Batería MinTrabajo Form B', 'Encuesta clima']
const estadosEval: EstadoEval[] = ['Aplicada', 'Pendiente', 'En intervención']

const emptyForm: Omit<EvaluacionPsicosocial, 'id'> = {
  codigo: '', trabajador: '', cargo: '', area: '', sede: '', fechaAplicacion: '', periodoCoberto: '',
  instrumento: 'Batería MinTrabajo Form A', nivelRiesgoIntralaboral: 'Sin riesgo',
  nivelRiesgoExtralaboral: 'Sin riesgo', nivelEstres: 'Sin estrés',
  intervencion: false, estado: 'Aplicada', observaciones: ''
}

export default function BateriaPsicosocial() {
  const [view, setView] = useState<View>('dashboard')
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionPsicosocial[]>(mockEvaluaciones)
  const [selected, setSelected] = useState<EvaluacionPsicosocial | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterNivel, setFilterNivel] = useState('')
  const [form, setForm] = useState<Omit<EvaluacionPsicosocial, 'id'>>(emptyForm)

  const filtered = evaluaciones.filter(e => {
    const matchSearch = e.trabajador.toLowerCase().includes(search.toLowerCase()) || e.area.toLowerCase().includes(search.toLowerCase()) || e.codigo.includes(search)
    const matchEstado = filterEstado === '' || e.estado === filterEstado
    const matchNivel = filterNivel === '' || e.nivelRiesgoIntralaboral === filterNivel || e.nivelRiesgoExtralaboral === filterNivel
    return matchSearch && matchEstado && matchNivel
  })

  const altosYMasAlto = evaluaciones.filter(e => ['Alto','Muy alto'].includes(e.nivelRiesgoIntralaboral)).length
  const pendientesIntervencion = evaluaciones.filter(e => e.intervencion && e.estado !== 'Aplicada').length

  const intraConteos = nivelesRiesgo.map(n => evaluaciones.filter(e => e.nivelRiesgoIntralaboral === n).length)
  const extraConteos = nivelesRiesgo.map(n => evaluaciones.filter(e => e.nivelRiesgoExtralaboral === n).length)

  const doughnutData = {
    labels: nivelesRiesgo,
    datasets: [{ data: intraConteos, backgroundColor: ['#22c55e','#3b82f6','#eab308','#f97316','#ef4444'], borderWidth: 2 }]
  }
  const barData = {
    labels: nivelesRiesgo,
    datasets: [
      { label: 'Intralaboral', data: intraConteos, backgroundColor: '#a855f7', borderRadius: 4 },
      { label: 'Extralaboral', data: extraConteos, backgroundColor: '#c084fc', borderRadius: 4 }
    ]
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setView('formulario') }
  const openEdit = (e: EvaluacionPsicosocial) => {
    setForm({ codigo: e.codigo, trabajador: e.trabajador, cargo: e.cargo, area: e.area, sede: e.sede,
      fechaAplicacion: e.fechaAplicacion, periodoCoberto: e.periodoCoberto, instrumento: e.instrumento,
      nivelRiesgoIntralaboral: e.nivelRiesgoIntralaboral, nivelRiesgoExtralaboral: e.nivelRiesgoExtralaboral,
      nivelEstres: e.nivelEstres, intervencion: e.intervencion, estado: e.estado, observaciones: e.observaciones })
    setEditingId(e.id); setView('formulario')
  }
  const openDetail = (e: EvaluacionPsicosocial) => { setSelected(e); setView('detalle') }

  const handleSave = () => {
    if (!form.codigo || !form.trabajador || !form.fechaAplicacion) {
      toast.error('Complete los campos obligatorios'); return
    }
    if (editingId) {
      setEvaluaciones(prev => prev.map(e => e.id === editingId ? { ...e, ...form } : e))
      toast.success('Evaluación actualizada correctamente')
    } else {
      setEvaluaciones(prev => [...prev, { ...form, id: Date.now().toString() }])
      toast.success('Evaluación registrada correctamente')
    }
    setView('lista')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600 text-xl"><FaListAlt /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Batería Psicosocial</h1>
            <p className="text-sm text-gray-500">Evaluación y seguimiento de riesgo psicosocial laboral</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'lista'].map(v => (
            <button key={v} onClick={() => setView(v as View)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border hover:bg-purple-50'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            <FaPlus /> Nueva Evaluación
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Evaluados', value: evaluaciones.length, color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { label: '% Riesgo Alto+', value: `${Math.round((altosYMasAlto / evaluaciones.length) * 100)}%`, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Pendientes Intervención', value: pendientesIntervencion, color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { label: 'En Intervención', value: evaluaciones.filter(e => e.estado === 'En intervención').length, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' }
            ].map((kpi, i) => (
              <div key={i} className={`border rounded-xl p-4 ${kpi.color}`}>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-sm mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Distribución Riesgo Intralaboral</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'right' } }, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Intra vs Extralaboral por Nivel</h3>
              <div className="h-56">
                <Bar data={barData} options={{ plugins: { legend: { position: 'top' } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Evaluaciones Recientes</h3></div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Trabajador','Instrumento','Intralaboral','Extralaboral','Estrés','Estado'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {evaluaciones.slice(0, 5).map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{e.trabajador}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{e.instrumento}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${nivelColors[e.nivelRiesgoIntralaboral]}`}>{e.nivelRiesgoIntralaboral}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${nivelColors[e.nivelRiesgoExtralaboral]}`}>{e.nivelRiesgoExtralaboral}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estresColors[e.nivelEstres]}`}>{e.nivelEstres}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[e.estado]}`}>{e.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lista */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar trabajador, área, código..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
              <option value="">Todos los estados</option>
              {estadosEval.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterNivel} onChange={e => setFilterNivel(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
              <option value="">Todos los niveles</option>
              {nivelesRiesgo.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Trabajador','Área','Fecha','Intralaboral','Extralaboral','Estrés','Estado','Acciones'].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-purple-600 text-xs">{e.codigo}</td>
                    <td className="px-3 py-3 font-medium">{e.trabajador}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{e.area}</td>
                    <td className="px-3 py-3 text-gray-500">{e.fechaAplicacion}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${nivelColors[e.nivelRiesgoIntralaboral]}`}>{e.nivelRiesgoIntralaboral}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${nivelColors[e.nivelRiesgoExtralaboral]}`}>{e.nivelRiesgoExtralaboral}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estresColors[e.nivelEstres]}`}>{e.nivelEstres}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[e.estado]}`}>{e.estado}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(e)} className="p-1.5 text-purple-600 hover:bg-purple-100 rounded"><FaEye /></button>
                        <button onClick={() => openEdit(e)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FaEdit /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-10 text-gray-400">No se encontraron evaluaciones</div>}
          </div>
        </div>
      )}

      {/* Detalle */}
      {view === 'detalle' && selected && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-purple-600 hover:underline text-sm"><FaArrowLeft /> Volver a lista</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.trabajador}</h2>
                <p className="text-sm text-gray-500">{selected.cargo} — {selected.area} — {selected.sede}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${estadoColors[selected.estado]}`}>{selected.estado}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
              {[
                { label: 'Código', value: selected.codigo },
                { label: 'Fecha Aplicación', value: selected.fechaAplicacion },
                { label: 'Período Cubierto', value: selected.periodoCoberto },
                { label: 'Instrumento', value: selected.instrumento },
                { label: 'Requiere Intervención', value: selected.intervencion ? 'Sí' : 'No' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="font-medium text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Riesgo Intralaboral</p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${nivelColors[selected.nivelRiesgoIntralaboral]}`}>{selected.nivelRiesgoIntralaboral}</span>
              </div>
              <div className="text-center bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Riesgo Extralaboral</p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${nivelColors[selected.nivelRiesgoExtralaboral]}`}>{selected.nivelRiesgoExtralaboral}</span>
              </div>
              <div className="text-center bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Nivel de Estrés</p>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${estresColors[selected.nivelEstres]}`}>{selected.nivelEstres}</span>
              </div>
            </div>
            {selected.observaciones && (
              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">Observaciones</p>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-3 text-sm">{selected.observaciones}</p>
              </div>
            )}
            <div className="mt-4">
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><FaEdit className="inline mr-1" />Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {view === 'formulario' && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-purple-600 hover:underline text-sm"><FaArrowLeft /> Volver</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">{editingId ? 'Editar Evaluación' : 'Nueva Evaluación Psicosocial'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Código *', field: 'codigo' },
                { label: 'Trabajador *', field: 'trabajador' },
                { label: 'Cargo', field: 'cargo' },
                { label: 'Área', field: 'area' },
                { label: 'Sede', field: 'sede' },
                { label: 'Fecha Aplicación *', field: 'fechaAplicacion', type: 'date' },
                { label: 'Período Cubierto', field: 'periodoCoberto' },
              ].map(({ label, field, type = 'text' }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as any)[field] ?? ''} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instrumento</label>
                <select value={form.instrumento} onChange={e => setForm(prev => ({ ...prev, instrumento: e.target.value as Instrumento }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {instrumentos.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Intralaboral</label>
                <select value={form.nivelRiesgoIntralaboral} onChange={e => setForm(prev => ({ ...prev, nivelRiesgoIntralaboral: e.target.value as NivelRiesgo5 }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {nivelesRiesgo.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Riesgo Extralaboral</label>
                <select value={form.nivelRiesgoExtralaboral} onChange={e => setForm(prev => ({ ...prev, nivelRiesgoExtralaboral: e.target.value as NivelRiesgo5 }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {nivelesRiesgo.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Estrés</label>
                <select value={form.nivelEstres} onChange={e => setForm(prev => ({ ...prev, nivelEstres: e.target.value as NivelEstres }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {nivelesEstres.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.estado} onChange={e => setForm(prev => ({ ...prev, estado: e.target.value as EstadoEval }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {estadosEval.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea value={form.observaciones || ''} onChange={e => setForm(prev => ({ ...prev, observaciones: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="intervencion" checked={form.intervencion} onChange={e => setForm(prev => ({ ...prev, intervencion: e.target.checked }))} className="h-4 w-4 accent-purple-600" />
              <label htmlFor="intervencion" className="text-sm text-gray-700">Requiere intervención psicosocial</label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Guardar</button>
              <button onClick={() => setView('lista')} className="px-5 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
