import { useState } from 'react'
import {
  FaBullseye, FaPlus, FaSearch, FaTimes, FaEdit,
  FaTrash, FaChartBar, FaList, FaStar, FaRegStar, FaClock,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type EstadoSimulacro = 'Planeado' | 'Ejecutado' | 'Evaluado'

interface Simulacro {
  id: string
  codigo: string
  fecha: string
  tipoEscenario: string
  sede: string
  participantes: number
  tiempoEvacuacion: number
  calificacion: number
  observaciones: string
  accionesMejora: string
  estado: EstadoSimulacro
}

const MOCK_SIMULACROS: Simulacro[] = [
  {
    id: '1', codigo: 'SIM-001', fecha: '2026-02-10', tipoEscenario: 'Incendio en bodega',
    sede: 'Sede Principal', participantes: 85, tiempoEvacuacion: 4.5,
    calificacion: 4, observaciones: 'Evacuación efectiva. Se presentaron demoras en el área administrativa por desconocimiento de ruta alterna.',
    accionesMejora: 'Señalizar ruta alterna de evacuación, reforzar capacitación área administrativa.', estado: 'Evaluado',
  },
  {
    id: '2', codigo: 'SIM-002', fecha: '2026-01-20', tipoEscenario: 'Sismo con derrumbe',
    sede: 'Sede Norte', participantes: 62, tiempoEvacuacion: 6.2,
    calificacion: 3, observaciones: 'El tiempo de evacuación superó el objetivo (5 min). Algunos empleados no conocían el punto de encuentro.',
    accionesMejora: 'Revisar y difundir mapa de evacuación, realizar simulacro de seguimiento en 3 meses.', estado: 'Evaluado',
  },
  {
    id: '3', codigo: 'SIM-003', fecha: '2026-03-05', tipoEscenario: 'Derrame químico',
    sede: 'Sede Principal', participantes: 18, tiempoEvacuacion: 3.2,
    calificacion: 5, observaciones: 'Excelente respuesta de la brigada. Todos los procedimientos de contención fueron ejecutados correctamente.',
    accionesMejora: 'Ninguna acción requerida. Mantener periodicidad del simulacro.', estado: 'Evaluado',
  },
  {
    id: '4', codigo: 'SIM-004', fecha: '2026-02-25', tipoEscenario: 'Emergencia médica masiva',
    sede: 'Sede Sur', participantes: 45, tiempoEvacuacion: 5.8,
    calificacion: 3, observaciones: 'La comunicación entre brigadistas presentó fallas. No se activó correctamente el protocolo de notificación.',
    accionesMejora: 'Adquirir radios de comunicación para brigadistas, crear árbol de contactos de emergencia.', estado: 'Evaluado',
  },
  {
    id: '5', codigo: 'SIM-005', fecha: '2026-03-15', tipoEscenario: 'Evacuación general',
    sede: 'Sede Norte', participantes: 120, tiempoEvacuacion: 4.1,
    calificacion: 4, observaciones: 'Buena coordinación general. El punto de encuentro quedó pequeño para la cantidad de personas.',
    accionesMejora: 'Ampliar zona de punto de encuentro, asignar zonas específicas por área.', estado: 'Evaluado',
  },
  {
    id: '6', codigo: 'SIM-006', fecha: '2026-04-10', tipoEscenario: 'Incendio en planta',
    sede: 'Sede Norte', participantes: 0, tiempoEvacuacion: 0,
    calificacion: 0, observaciones: '', accionesMejora: '', estado: 'Planeado',
  },
  {
    id: '7', codigo: 'SIM-007', fecha: '2026-05-20', tipoEscenario: 'Sismo',
    sede: 'Sede Principal', participantes: 0, tiempoEvacuacion: 0,
    calificacion: 0, observaciones: '', accionesMejora: '', estado: 'Planeado',
  },
  {
    id: '8', codigo: 'SIM-008', fecha: '2026-03-20', tipoEscenario: 'Derrame de combustible',
    sede: 'Sede Sur', participantes: 30, tiempoEvacuacion: 3.8,
    calificacion: 0, observaciones: 'Simulacro ejecutado. Pendiente evaluación formal.', accionesMejora: '', estado: 'Ejecutado',
  },
]

const SEDES = ['Sede Principal', 'Sede Norte', 'Sede Sur']
const ESCENARIOS = ['Incendio en bodega', 'Incendio en planta', 'Sismo con derrumbe', 'Sismo', 'Derrame químico', 'Derrame de combustible', 'Evacuación general', 'Emergencia médica masiva']

const EMPTY_FORM: Omit<Simulacro, 'id'> = {
  codigo: '', fecha: '', tipoEscenario: '', sede: '', participantes: 0,
  tiempoEvacuacion: 0, calificacion: 0, observaciones: '', accionesMejora: '', estado: 'Planeado',
}

type ViewMode = 'dashboard' | 'lista' | 'form'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange?.(n)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          {n <= value ? <FaStar className="text-yellow-400" size={16} /> : <FaRegStar className="text-gray-300" size={16} />}
        </button>
      ))}
    </div>
  )
}

export default function EvaluacionSimulacros() {
  const [view, setView] = useState<ViewMode>('dashboard')
  const [simulacros, setSimulacros] = useState<Simulacro[]>(MOCK_SIMULACROS)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterSede, setFilterSede] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Simulacro, 'id'>>(EMPTY_FORM)

  const filtered = simulacros.filter(s => {
    const matchSearch = s.codigo.toLowerCase().includes(search.toLowerCase()) ||
      s.tipoEscenario.toLowerCase().includes(search.toLowerCase())
    const matchEstado = !filterEstado || s.estado === filterEstado
    const matchSede = !filterSede || s.sede === filterSede
    return matchSearch && matchEstado && matchSede
  })

  const evaluados = simulacros.filter(s => s.estado === 'Evaluado')
  const promedioCalif = evaluados.length ? +(evaluados.reduce((a, b) => a + b.calificacion, 0) / evaluados.length).toFixed(1) : 0
  const conTiempo = simulacros.filter(s => s.tiempoEvacuacion > 0)
  const promedioTiempo = conTiempo.length ? +(conTiempo.reduce((a, b) => a + b.tiempoEvacuacion, 0) / conTiempo.length).toFixed(1) : 0
  const planeados = simulacros.filter(s => s.estado === 'Planeado').length
  const ejecutados = simulacros.filter(s => s.estado === 'Ejecutado').length

  const barCalif = {
    labels: evaluados.map(s => s.codigo),
    datasets: [{
      label: 'Calificación',
      data: evaluados.map(s => s.calificacion),
      backgroundColor: evaluados.map(s =>
        s.calificacion >= 4 ? 'rgba(34,197,94,0.7)' : s.calificacion >= 3 ? 'rgba(234,179,8,0.7)' : 'rgba(239,68,68,0.7)'
      ),
    }],
  }

  const doughnutEstado = {
    labels: ['Planeado', 'Ejecutado', 'Evaluado'],
    datasets: [{
      data: [planeados, ejecutados, evaluados.length],
      backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e'],
    }],
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setView('form')
  }

  const handleEdit = (s: Simulacro) => {
    setEditingId(s.id)
    const { id: _id, ...rest } = s
    setForm(rest)
    setView('form')
  }

  const handleDelete = (id: string) => {
    setSimulacros(prev => prev.filter(s => s.id !== id))
    toast.success('Simulacro eliminado')
  }

  const handleSave = () => {
    if (!form.codigo || !form.fecha || !form.tipoEscenario || !form.sede) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editingId) {
      setSimulacros(prev => prev.map(s => s.id === editingId ? { ...form, id: editingId } : s))
      toast.success('Simulacro actualizado')
    } else {
      setSimulacros(prev => [...prev, { ...form, id: String(Date.now()) }])
      toast.success('Simulacro registrado')
    }
    setView('lista')
  }

  const getEstadoColor = (e: EstadoSimulacro) => {
    if (e === 'Planeado') return 'bg-blue-100 text-blue-700'
    if (e === 'Ejecutado') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getCalifColor = (c: number) => {
    if (c >= 4) return 'text-green-600'
    if (c >= 3) return 'text-yellow-600'
    if (c > 0) return 'text-red-600'
    return 'text-gray-400'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500 text-white p-3 rounded-xl">
            <FaBullseye size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Evaluación de Simulacros</h1>
            <p className="text-sm text-gray-500">Planeación, ejecución y evaluación de simulacros de emergencia</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${view === 'dashboard' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            <FaChartBar size={14} /> Dashboard
          </button>
          <button onClick={() => setView('lista')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${view === 'lista' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            <FaList size={14} /> Lista
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition">
            <FaPlus size={14} /> Nuevo Simulacro
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Simulacros del Año</p>
              <p className="text-3xl font-bold text-gray-900">{simulacros.length}</p>
              <p className="text-xs text-gray-400 mt-1">Registrados 2026</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Calificación Promedio</p>
              <p className={`text-3xl font-bold ${getCalifColor(promedioCalif)}`}>{promedioCalif > 0 ? `${promedioCalif}/5` : 'N/A'}</p>
              <div className="mt-1">
                {promedioCalif > 0 && <StarRating value={Math.round(promedioCalif)} />}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tiempo Evacuación Prom.</p>
              <p className="text-3xl font-bold text-blue-600">{promedioTiempo > 0 ? `${promedioTiempo}` : 'N/A'}</p>
              <p className="text-xs text-gray-400 mt-1">minutos promedio</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Evaluados</p>
              <p className="text-3xl font-bold text-green-600">{evaluados.length}</p>
              <p className="text-xs text-gray-400 mt-1">Con evaluación completa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Planeados</p>
              <p className="text-3xl font-bold text-blue-600">{planeados}</p>
              <p className="text-xs text-gray-400 mt-1">Por ejecutar</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ejecutados</p>
              <p className="text-3xl font-bold text-yellow-600">{ejecutados}</p>
              <p className="text-xs text-gray-400 mt-1">Pendientes evaluación</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Participantes</p>
              <p className="text-3xl font-bold text-purple-600">{simulacros.reduce((a, b) => a + b.participantes, 0)}</p>
              <p className="text-xs text-gray-400 mt-1">Personas involucradas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Calificaciones por Simulacro</h3>
              <Bar data={barCalif} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } } },
              }} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Estado de Simulacros</h3>
              <div className="flex justify-center">
                <div style={{ maxWidth: 250 }}>
                  <Doughnut data={doughnutEstado} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Últimos Simulacros Evaluados</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Escenario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Participantes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tiempo Evac.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Calificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {evaluados.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-yellow-600 font-medium">{s.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">{s.tipoEscenario}</td>
                    <td className="px-4 py-3 text-gray-600">{s.sede}</td>
                    <td className="px-4 py-3 text-gray-600">{s.participantes}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-gray-600"><FaClock size={11} /> {s.tiempoEvacuacion} min</span>
                    </td>
                    <td className="px-4 py-3"><StarRating value={s.calificacion} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LISTA */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-300" />
            </div>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
              <option value="">Todos los estados</option>
              <option>Planeado</option>
              <option>Ejecutado</option>
              <option>Evaluado</option>
            </select>
            <select value={filterSede} onChange={e => setFilterSede(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
              <option value="">Todas las sedes</option>
              {SEDES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Escenario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Participantes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tiempo (min)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Calificación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-yellow-600 font-medium">{s.codigo}</td>
                    <td className="px-4 py-3 text-gray-800">{s.tipoEscenario}</td>
                    <td className="px-4 py-3 text-gray-600">{s.fecha}</td>
                    <td className="px-4 py-3 text-gray-600">{s.sede}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{s.participantes > 0 ? s.participantes : '—'}</td>
                    <td className="px-4 py-3 text-center">
                      {s.tiempoEvacuacion > 0 ? (
                        <span className={`font-medium ${s.tiempoEvacuacion <= 5 ? 'text-green-600' : 'text-red-600'}`}>{s.tiempoEvacuacion}</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {s.calificacion > 0 ? <StarRating value={s.calificacion} /> : <span className="text-gray-400 text-xs">Sin calificar</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(s.estado)}`}>{s.estado}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(s)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Editar"><FaEdit size={13} /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Eliminar"><FaTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No se encontraron simulacros</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FORM */}
      {view === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Simulacro' : 'Nuevo Simulacro'}</h2>
            <button onClick={() => setView('lista')} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Código *</label>
              <input value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" placeholder="SIM-XXX" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha *</label>
              <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Escenario *</label>
              <select value={form.tipoEscenario} onChange={e => setForm(p => ({ ...p, tipoEscenario: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
                <option value="">Seleccionar escenario</option>
                {ESCENARIOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sede *</label>
              <select value={form.sede} onChange={e => setForm(p => ({ ...p, sede: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
                <option value="">Seleccionar sede</option>
                {SEDES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Participantes</label>
              <input type="number" min={0} value={form.participantes} onChange={e => setForm(p => ({ ...p, participantes: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tiempo Evacuación (min)</label>
              <input type="number" min={0} step={0.1} value={form.tiempoEvacuacion} onChange={e => setForm(p => ({ ...p, tiempoEvacuacion: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
              <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoSimulacro }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300">
                <option>Planeado</option>
                <option>Ejecutado</option>
                <option>Evaluado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Calificación (1–5)</label>
              <StarRating value={form.calificacion} onChange={v => setForm(p => ({ ...p, calificacion: v }))} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Observaciones</label>
              <textarea value={form.observaciones} onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" placeholder="Observaciones del simulacro..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Acciones de Mejora</label>
              <textarea value={form.accionesMejora} onChange={e => setForm(p => ({ ...p, accionesMejora: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300" placeholder="Acciones correctivas y de mejora..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setView('lista')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600">
              {editingId ? 'Guardar Cambios' : 'Registrar Simulacro'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
