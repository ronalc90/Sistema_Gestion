import { useState } from 'react'
import {
  FaBullhorn, FaPlus, FaSearch, FaTimes, FaEdit,
  FaTrash, FaChartBar, FaList, FaEye, FaFileAlt,
  FaUsers, FaExclamationTriangle,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type TipoEmergencia = 'Incendio' | 'Sismo' | 'Derrame' | 'Evacuación' | 'Médica'
type EstadoPlan = 'Vigente' | 'En Revisión' | 'Vencido'

interface Plan {
  id: string
  nombre: string
  tipoEmergencia: TipoEmergencia
  sede: string
  version: string
  fechaAprobacion: string
  fechaVencimiento: string
  responsable: string
  brigadistas: number
  estado: EstadoPlan
  documentos: string[]
  descripcion: string
}

const MOCK_PLANES: Plan[] = [
  {
    id: '1', nombre: 'Plan de Emergencia para Incendio - Sede Principal',
    tipoEmergencia: 'Incendio', sede: 'Sede Principal', version: 'v3.2',
    fechaAprobacion: '2025-06-15', fechaVencimiento: '2026-06-15',
    responsable: 'Carlos Mendoza', brigadistas: 12,
    estado: 'Vigente',
    documentos: ['Plan_Incendio_v3.2.pdf', 'Mapa_Evacuacion.pdf', 'Lista_Brigadistas.xlsx'],
    descripcion: 'Plan integral para atención de emergencias por incendio en instalaciones de la sede principal, incluye procedimientos de evacuación, uso de extintores y coordinación con bomberos.',
  },
  {
    id: '2', nombre: 'Plan de Respuesta Sísmica - Sede Norte',
    tipoEmergencia: 'Sismo', sede: 'Sede Norte', version: 'v2.1',
    fechaAprobacion: '2025-08-20', fechaVencimiento: '2026-08-20',
    responsable: 'Ana Reyes', brigadistas: 8,
    estado: 'Vigente',
    documentos: ['Plan_Sismo_v2.1.pdf', 'Puntos_Encuentro.pdf'],
    descripcion: 'Protocolo de actuación ante eventos sísmicos, incluye procedimientos de evacuación, puntos de encuentro y comunicación de emergencias.',
  },
  {
    id: '3', nombre: 'Plan de Atención Médica de Emergencias',
    tipoEmergencia: 'Médica', sede: 'Sede Principal', version: 'v1.5',
    fechaAprobacion: '2025-03-10', fechaVencimiento: '2026-03-10',
    responsable: 'Luisa Vargas', brigadistas: 6,
    estado: 'En Revisión',
    documentos: ['Plan_Medico_v1.5.pdf', 'Protocolo_Primeros_Auxilios.pdf'],
    descripcion: 'Protocolo para atención de emergencias médicas incluyendo primeros auxilios, coordinación con ambulancias y hospitales cercanos.',
  },
  {
    id: '4', nombre: 'Plan de Control de Derrame Químico - Laboratorio',
    tipoEmergencia: 'Derrame', sede: 'Sede Principal', version: 'v2.0',
    fechaAprobacion: '2024-11-05', fechaVencimiento: '2025-11-05',
    responsable: 'Pedro Castro', brigadistas: 4,
    estado: 'Vencido',
    documentos: ['Plan_Derrame_v2.0.pdf', 'HDS_Quimicos.pdf'],
    descripcion: 'Procedimientos para contención y control de derrames de sustancias químicas en área de laboratorio.',
  },
  {
    id: '5', nombre: 'Plan General de Evacuación - Sede Sur',
    tipoEmergencia: 'Evacuación', sede: 'Sede Sur', version: 'v1.8',
    fechaAprobacion: '2025-09-12', fechaVencimiento: '2026-09-12',
    responsable: 'Sandra Moreno', brigadistas: 10,
    estado: 'Vigente',
    documentos: ['Plan_Evacuacion_v1.8.pdf', 'Planos_Rutas.pdf', 'Roles_Brigadistas.pdf'],
    descripcion: 'Plan maestro de evacuación para toda la sede sur, cubre todos los escenarios de emergencia con rutas primarias y alternas.',
  },
  {
    id: '6', nombre: 'Plan de Emergencia Sísmica - Sede Sur',
    tipoEmergencia: 'Sismo', sede: 'Sede Sur', version: 'v1.0',
    fechaAprobacion: '2024-07-18', fechaVencimiento: '2025-07-18',
    responsable: 'Luis Pardo', brigadistas: 5,
    estado: 'Vencido',
    documentos: ['Plan_Sismo_SedeSur_v1.0.pdf'],
    descripcion: 'Procedimientos de respuesta ante sismos para sede sur.',
  },
  {
    id: '7', nombre: 'Plan de Incendio - Planta de Producción',
    tipoEmergencia: 'Incendio', sede: 'Sede Norte', version: 'v4.0',
    fechaAprobacion: '2025-12-01', fechaVencimiento: '2026-12-01',
    responsable: 'Jorge Ríos', brigadistas: 15,
    estado: 'Vigente',
    documentos: ['Plan_Incendio_Planta_v4.0.pdf', 'Ubicacion_Extintores.pdf'],
    descripcion: 'Plan especializado para incendios en planta de producción con equipos de alta temperatura.',
  },
]

const SEDES = ['Sede Principal', 'Sede Norte', 'Sede Sur']
const TIPOS: TipoEmergencia[] = ['Incendio', 'Sismo', 'Derrame', 'Evacuación', 'Médica']

const EMPTY_FORM: Omit<Plan, 'id'> = {
  nombre: '', tipoEmergencia: 'Incendio', sede: '', version: '',
  fechaAprobacion: '', fechaVencimiento: '', responsable: '', brigadistas: 0,
  estado: 'Vigente', documentos: [], descripcion: '',
}

type ViewMode = 'dashboard' | 'lista' | 'form' | 'detalle'

const TIPO_COLORS: Record<TipoEmergencia, string> = {
  Incendio: 'bg-red-100 text-red-700',
  Sismo: 'bg-orange-100 text-orange-700',
  Derrame: 'bg-yellow-100 text-yellow-700',
  Evacuación: 'bg-blue-100 text-blue-700',
  Médica: 'bg-purple-100 text-purple-700',
}

export default function PlanesEmergencia() {
  const [view, setView] = useState<ViewMode>('dashboard')
  const [planes, setPlanes] = useState<Plan[]>(MOCK_PLANES)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterSede, setFilterSede] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Plan, 'id'>>(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [docInput, setDocInput] = useState('')

  const filtered = planes.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.responsable.toLowerCase().includes(search.toLowerCase())
    const matchTipo = !filterTipo || p.tipoEmergencia === filterTipo
    const matchEstado = !filterEstado || p.estado === filterEstado
    const matchSede = !filterSede || p.sede === filterSede
    return matchSearch && matchTipo && matchEstado && matchSede
  })

  const vigentes = planes.filter(p => p.estado === 'Vigente').length
  const enRevision = planes.filter(p => p.estado === 'En Revisión').length
  const vencidos = planes.filter(p => p.estado === 'Vencido').length
  const totalBrigadistas = planes.reduce((a, b) => a + b.brigadistas, 0)

  const barBySede = {
    labels: SEDES,
    datasets: TIPOS.map((tipo, idx) => ({
      label: tipo,
      data: SEDES.map(s => planes.filter(p => p.sede === s && p.tipoEmergencia === tipo).length),
      backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(249,115,22,0.7)', 'rgba(234,179,8,0.7)', 'rgba(59,130,246,0.7)', 'rgba(139,92,246,0.7)'][idx],
    })),
  }

  const doughnutEstado = {
    labels: ['Vigente', 'En Revisión', 'Vencido'],
    datasets: [{
      data: [vigentes, enRevision, vencidos],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
    }],
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setDocInput('')
    setView('form')
  }

  const handleEdit = (p: Plan) => {
    setEditingId(p.id)
    const { id: _id, ...rest } = p
    setForm(rest)
    setDocInput('')
    setView('form')
  }

  const handleDelete = (id: string) => {
    setPlanes(prev => prev.filter(p => p.id !== id))
    toast.success('Plan eliminado')
  }

  const handleSave = () => {
    if (!form.nombre || !form.sede || !form.version || !form.fechaAprobacion || !form.responsable) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editingId) {
      setPlanes(prev => prev.map(p => p.id === editingId ? { ...form, id: editingId } : p))
      toast.success('Plan actualizado')
    } else {
      setPlanes(prev => [...prev, { ...form, id: String(Date.now()) }])
      toast.success('Plan registrado')
    }
    setView('lista')
  }

  const addDoc = () => {
    if (docInput.trim()) {
      setForm(p => ({ ...p, documentos: [...p.documentos, docInput.trim()] }))
      setDocInput('')
    }
  }

  const removeDoc = (idx: number) => {
    setForm(p => ({ ...p, documentos: p.documentos.filter((_, i) => i !== idx) }))
  }

  const getEstadoColor = (e: EstadoPlan) => {
    if (e === 'Vigente') return 'bg-green-100 text-green-700'
    if (e === 'En Revisión') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const selectedPlan = planes.find(p => p.id === selectedId)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white p-3 rounded-xl">
            <FaBullhorn size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Planes de Emergencia</h1>
            <p className="text-sm text-gray-500">Gestión de planes de respuesta ante emergencias</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${view === 'dashboard' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            <FaChartBar size={14} /> Dashboard
          </button>
          <button onClick={() => setView('lista')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${view === 'lista' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            <FaList size={14} /> Lista
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
            <FaPlus size={14} /> Nuevo Plan
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Planes</p>
              <p className="text-3xl font-bold text-gray-900">{planes.length}</p>
              <p className="text-xs text-gray-400 mt-1">Registrados</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Vigentes</p>
              <p className="text-3xl font-bold text-green-600">{vigentes}</p>
              <p className="text-xs text-gray-400 mt-1">Activos y válidos</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Vencidos</p>
              <p className="text-3xl font-bold text-red-600">{vencidos}</p>
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><FaExclamationTriangle size={10} /> Requieren actualización</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Brigadistas</p>
              <p className="text-3xl font-bold text-blue-600">{totalBrigadistas}</p>
              <p className="text-xs text-gray-400 mt-1">En todas las sedes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Planes por Sede y Tipo</h3>
              <Bar data={barBySede} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Estado de los Planes</h3>
              <div className="flex justify-center">
                <div style={{ maxWidth: 250 }}>
                  <Doughnut data={doughnutEstado} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </div>
          </div>

          {vencidos > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-semibold text-red-700 flex items-center gap-2 mb-3">
                <FaExclamationTriangle /> Planes Vencidos — Requieren Actualización
              </h3>
              <div className="space-y-2">
                {planes.filter(p => p.estado === 'Vencido').map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 border border-red-100 text-sm">
                    <span className="font-medium text-gray-800">{p.nombre}</span>
                    <span className="text-red-500 text-xs">Vencido: {p.fechaVencimiento}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Resumen por Sede</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Planes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vigentes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brigadistas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {SEDES.map(s => (
                  <tr key={s} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{s}</td>
                    <td className="px-4 py-3 text-gray-600">{planes.filter(p => p.sede === s).length}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{planes.filter(p => p.sede === s && p.estado === 'Vigente').length}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">{planes.filter(p => p.sede === s).reduce((a, b) => a + b.brigadistas, 0)}</td>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Todos los tipos</option>
              {TIPOS.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Todos los estados</option>
              <option>Vigente</option>
              <option>En Revisión</option>
              <option>Vencido</option>
            </select>
            <select value={filterSede} onChange={e => setFilterSede(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Todas las sedes</option>
              {SEDES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Versión</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">F. Aprobación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Responsable</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brigadistas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium max-w-xs">
                      <div className="truncate" title={p.nombre}>{p.nombre}</div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${TIPO_COLORS[p.tipoEmergencia]}`}>{p.tipoEmergencia}</span></td>
                    <td className="px-4 py-3 text-gray-600">{p.sede}</td>
                    <td className="px-4 py-3 font-mono text-red-600">{p.version}</td>
                    <td className="px-4 py-3 text-gray-600">{p.fechaAprobacion}</td>
                    <td className="px-4 py-3 text-gray-600">{p.responsable}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex items-center gap-1 text-blue-600"><FaUsers size={11} /> {p.brigadistas}</span>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(p.estado)}`}>{p.estado}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedId(p.id); setView('detalle') }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Ver detalle"><FaEye size={13} /></button>
                        <button onClick={() => handleEdit(p)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Editar"><FaEdit size={13} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Eliminar"><FaTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No se encontraron planes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETALLE */}
      {view === 'detalle' && selectedPlan && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('lista')} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              ← Volver
            </button>
            <h2 className="text-lg font-bold text-gray-900">{selectedPlan.nombre}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Información del Plan</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-gray-500">Tipo Emergencia:</span><div className="mt-1"><span className={`px-2 py-1 rounded-full text-xs font-medium ${TIPO_COLORS[selectedPlan.tipoEmergencia]}`}>{selectedPlan.tipoEmergencia}</span></div></div>
                <div><span className="text-gray-500">Sede:</span><p className="font-medium mt-1">{selectedPlan.sede}</p></div>
                <div><span className="text-gray-500">Versión:</span><p className="font-mono text-red-600 font-medium mt-1">{selectedPlan.version}</p></div>
                <div><span className="text-gray-500">Estado:</span><div className="mt-1"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedPlan.estado)}`}>{selectedPlan.estado}</span></div></div>
                <div><span className="text-gray-500">F. Aprobación:</span><p className="mt-1">{selectedPlan.fechaAprobacion}</p></div>
                <div><span className="text-gray-500">F. Vencimiento:</span><p className="mt-1">{selectedPlan.fechaVencimiento}</p></div>
                <div><span className="text-gray-500">Responsable:</span><p className="font-medium mt-1">{selectedPlan.responsable}</p></div>
                <div><span className="text-gray-500">Brigadistas:</span><p className="text-blue-600 font-bold text-lg mt-1">{selectedPlan.brigadistas}</p></div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Descripción:</p>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selectedPlan.descripcion}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2"><FaFileAlt className="text-red-600" /> Documentos</h3>
              {selectedPlan.documentos.length > 0 ? (
                <div className="space-y-2">
                  {selectedPlan.documentos.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                      <FaFileAlt className="text-red-400 flex-shrink-0" size={12} />
                      <span className="truncate">{d}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Sin documentos registrados</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleEdit(selectedPlan)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              <FaEdit size={13} /> Editar Plan
            </button>
            <button onClick={() => handleDelete(selectedPlan.id)} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
              <FaTrash size={13} /> Eliminar
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      {view === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Plan' : 'Nuevo Plan de Emergencia'}</h2>
            <button onClick={() => setView('lista')} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre del Plan *</label>
              <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Nombre descriptivo del plan..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Emergencia *</label>
              <select value={form.tipoEmergencia} onChange={e => setForm(p => ({ ...p, tipoEmergencia: e.target.value as TipoEmergencia }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sede *</label>
              <select value={form.sede} onChange={e => setForm(p => ({ ...p, sede: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option value="">Seleccionar sede</option>
                {SEDES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Versión *</label>
              <input value={form.version} onChange={e => setForm(p => ({ ...p, version: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="v1.0" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Responsable *</label>
              <input value={form.responsable} onChange={e => setForm(p => ({ ...p, responsable: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Nombre del responsable" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Aprobación *</label>
              <input type="date" value={form.fechaAprobacion} onChange={e => setForm(p => ({ ...p, fechaAprobacion: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de Vencimiento</label>
              <input type="date" value={form.fechaVencimiento} onChange={e => setForm(p => ({ ...p, fechaVencimiento: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">N° Brigadistas</label>
              <input type="number" min={0} value={form.brigadistas} onChange={e => setForm(p => ({ ...p, brigadistas: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
              <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoPlan }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option>Vigente</option>
                <option>En Revisión</option>
                <option>Vencido</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Descripción del plan..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Documentos</label>
              <div className="flex gap-2 mb-2">
                <input value={docInput} onChange={e => setDocInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDoc()} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Nombre del documento..." />
                <button type="button" onClick={addDoc} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200">Agregar</button>
              </div>
              {form.documentos.length > 0 && (
                <div className="space-y-1">
                  {form.documentos.map((d, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5 text-sm">
                      <span className="text-gray-700">{d}</span>
                      <button type="button" onClick={() => removeDoc(i)} className="text-red-400 hover:text-red-600"><FaTimes size={11} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setView('lista')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              {editingId ? 'Guardar Cambios' : 'Registrar Plan'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
