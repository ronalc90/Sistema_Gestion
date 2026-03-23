import { useState } from 'react'
import {
  FaSearch, FaPlus, FaTimes, FaEdit, FaTrash,
  FaChartBar, FaList, FaEye, FaClipboardCheck,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type TipoInspeccion = 'Planeada' | 'No Planeada' | 'Gerencial'
type EstadoInspeccion = 'Programada' | 'En Proceso' | 'Cerrada'

interface Hallazgo {
  id: string
  descripcion: string
  tipo: 'Crítico' | 'Mayor' | 'Menor'
  estado: 'Abierto' | 'Cerrado'
}

interface Inspeccion {
  id: string
  codigo: string
  tipo: TipoInspeccion
  fecha: string
  area: string
  sede: string
  inspector: string
  hallazgosTotal: number
  hallazgosCriticos: number
  hallazgosMayores: number
  hallazgosMenores: number
  estado: EstadoInspeccion
  puntaje: number
  hallazgos: Hallazgo[]
}

const MOCK_INSPECCIONES: Inspeccion[] = [
  {
    id: '1', codigo: 'INS-001', tipo: 'Planeada', fecha: '2026-03-05',
    area: 'Bodega', sede: 'Sede Principal', inspector: 'Carlos Mendoza',
    hallazgosTotal: 5, hallazgosCriticos: 1, hallazgosMayores: 2, hallazgosMenores: 2,
    estado: 'Cerrada', puntaje: 78,
    hallazgos: [
      { id: 'h1', descripcion: 'Rutas de evacuación bloqueadas por estibas', tipo: 'Crítico', estado: 'Cerrado' },
      { id: 'h2', descripcion: 'Extintores sin revisión vigente', tipo: 'Mayor', estado: 'Abierto' },
      { id: 'h3', descripcion: 'Señalización de EPP incompleta', tipo: 'Mayor', estado: 'Cerrado' },
      { id: 'h4', descripcion: 'Botiquín sin medicamentos básicos', tipo: 'Menor', estado: 'Cerrado' },
      { id: 'h5', descripcion: 'Orden y aseo deficiente en zona de cargue', tipo: 'Menor', estado: 'Cerrado' },
    ],
  },
  {
    id: '2', codigo: 'INS-002', tipo: 'Gerencial', fecha: '2026-03-08',
    area: 'Planta de Producción', sede: 'Sede Norte', inspector: 'Gerente SST',
    hallazgosTotal: 3, hallazgosCriticos: 0, hallazgosMayores: 1, hallazgosMenores: 2,
    estado: 'Cerrada', puntaje: 92,
    hallazgos: [
      { id: 'h6', descripcion: 'Protectores auditivos no utilizados por todos', tipo: 'Mayor', estado: 'Abierto' },
      { id: 'h7', descripcion: 'Registro de mantenimiento incompleto', tipo: 'Menor', estado: 'Cerrado' },
      { id: 'h8', descripcion: 'Iluminación insuficiente en puesto de trabajo 3', tipo: 'Menor', estado: 'Abierto' },
    ],
  },
  {
    id: '3', codigo: 'INS-003', tipo: 'No Planeada', fecha: '2026-03-10',
    area: 'Laboratorio Químico', sede: 'Sede Principal', inspector: 'Ana Reyes',
    hallazgosTotal: 7, hallazgosCriticos: 2, hallazgosMayores: 3, hallazgosMenores: 2,
    estado: 'En Proceso', puntaje: 65,
    hallazgos: [
      { id: 'h9', descripcion: 'Almacenamiento incorrecto de sustancias incompatibles', tipo: 'Crítico', estado: 'Abierto' },
      { id: 'h10', descripcion: 'Ducha de emergencia sin mantenimiento', tipo: 'Crítico', estado: 'Abierto' },
      { id: 'h11', descripcion: 'EPP inadecuado para manipulación de ácidos', tipo: 'Mayor', estado: 'Abierto' },
      { id: 'h12', descripcion: 'Hoja de datos de seguridad desactualizada', tipo: 'Mayor', estado: 'Cerrado' },
      { id: 'h13', descripcion: 'Ventilación insuficiente', tipo: 'Mayor', estado: 'Abierto' },
      { id: 'h14', descripcion: 'Etiquetado incompleto de recipientes', tipo: 'Menor', estado: 'Cerrado' },
      { id: 'h15', descripcion: 'Registro de uso de sustancias no actualizado', tipo: 'Menor', estado: 'Abierto' },
    ],
  },
  {
    id: '4', codigo: 'INS-004', tipo: 'Planeada', fecha: '2026-03-15',
    area: 'Oficinas Administrativas', sede: 'Sede Sur', inspector: 'Luis Pardo',
    hallazgosTotal: 2, hallazgosCriticos: 0, hallazgosMayores: 0, hallazgosMenores: 2,
    estado: 'Cerrada', puntaje: 96,
    hallazgos: [
      { id: 'h16', descripcion: 'Cables sin organizar bajo escritorios', tipo: 'Menor', estado: 'Cerrado' },
      { id: 'h17', descripcion: 'Pasillos parcialmente obstruidos', tipo: 'Menor', estado: 'Cerrado' },
    ],
  },
  {
    id: '5', codigo: 'INS-005', tipo: 'Planeada', fecha: '2026-03-20',
    area: 'Taller Mecánico', sede: 'Sede Norte', inspector: 'Pedro Castro',
    hallazgosTotal: 4, hallazgosCriticos: 1, hallazgosMayores: 2, hallazgosMenores: 1,
    estado: 'En Proceso', puntaje: 72,
    hallazgos: [
      { id: 'h18', descripcion: 'Esmeril sin guarda de protección', tipo: 'Crítico', estado: 'Abierto' },
      { id: 'h19', descripcion: 'Aceite derramado en piso sin delimitar', tipo: 'Mayor', estado: 'Abierto' },
      { id: 'h20', descripcion: 'Herramientas manuales defectuosas', tipo: 'Mayor', estado: 'Abierto' },
      { id: 'h21', descripcion: 'Contenedor de residuos peligrosos lleno', tipo: 'Menor', estado: 'Cerrado' },
    ],
  },
  {
    id: '6', codigo: 'INS-006', tipo: 'Gerencial', fecha: '2026-03-22',
    area: 'Almacén', sede: 'Sede Principal', inspector: 'Gerente General',
    hallazgosTotal: 1, hallazgosCriticos: 0, hallazgosMayores: 1, hallazgosMenores: 0,
    estado: 'Programada', puntaje: 0,
    hallazgos: [],
  },
  {
    id: '7', codigo: 'INS-007', tipo: 'No Planeada', fecha: '2026-03-23',
    area: 'Parqueadero', sede: 'Sede Sur', inspector: 'Sandra Moreno',
    hallazgosTotal: 3, hallazgosCriticos: 0, hallazgosMayores: 1, hallazgosMenores: 2,
    estado: 'Programada', puntaje: 0,
    hallazgos: [],
  },
]

const AREAS = ['Bodega', 'Planta de Producción', 'Laboratorio Químico', 'Oficinas Administrativas', 'Taller Mecánico', 'Almacén', 'Parqueadero']
const SEDES = ['Sede Principal', 'Sede Norte', 'Sede Sur']

const EMPTY_FORM = {
  codigo: '', tipo: 'Planeada' as TipoInspeccion, fecha: '', area: '', sede: '',
  inspector: '', hallazgosTotal: 0, hallazgosCriticos: 0, hallazgosMayores: 0,
  hallazgosMenores: 0, estado: 'Programada' as EstadoInspeccion, puntaje: 0, hallazgos: [] as Hallazgo[],
}

type ViewMode = 'dashboard' | 'lista' | 'form' | 'detalle'

export default function InspeccionesSeguridad() {
  const [view, setView] = useState<ViewMode>('dashboard')
  const [inspecciones, setInspecciones] = useState<Inspeccion[]>(MOCK_INSPECCIONES)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterSede, setFilterSede] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Inspeccion, 'id'>>(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = inspecciones.filter(i => {
    const matchSearch = i.codigo.toLowerCase().includes(search.toLowerCase()) ||
      i.inspector.toLowerCase().includes(search.toLowerCase()) ||
      i.area.toLowerCase().includes(search.toLowerCase())
    const matchTipo = !filterTipo || i.tipo === filterTipo
    const matchEstado = !filterEstado || i.estado === filterEstado
    const matchSede = !filterSede || i.sede === filterSede
    return matchSearch && matchTipo && matchEstado && matchSede
  })

  const total = inspecciones.length
  const cerradas = inspecciones.filter(i => i.estado === 'Cerrada').length
  const enProceso = inspecciones.filter(i => i.estado === 'En Proceso').length
  const programadas = inspecciones.filter(i => i.estado === 'Programada').length
  const conPuntaje = inspecciones.filter(i => i.puntaje > 0)
  const promedioPuntaje = conPuntaje.length ? Math.round(conPuntaje.reduce((a, b) => a + b.puntaje, 0) / conPuntaje.length) : 0
  const totalCriticos = inspecciones.reduce((a, b) => a + b.hallazgosCriticos, 0)
  const totalMayores = inspecciones.reduce((a, b) => a + b.hallazgosMayores, 0)
  const totalMenores = inspecciones.reduce((a, b) => a + b.hallazgosMenores, 0)

  const barData = {
    labels: SEDES,
    datasets: [
      {
        label: 'Planeada',
        data: SEDES.map(s => inspecciones.filter(i => i.sede === s && i.tipo === 'Planeada').length),
        backgroundColor: 'rgba(59,130,246,0.7)',
      },
      {
        label: 'No Planeada',
        data: SEDES.map(s => inspecciones.filter(i => i.sede === s && i.tipo === 'No Planeada').length),
        backgroundColor: 'rgba(251,191,36,0.7)',
      },
      {
        label: 'Gerencial',
        data: SEDES.map(s => inspecciones.filter(i => i.sede === s && i.tipo === 'Gerencial').length),
        backgroundColor: 'rgba(139,92,246,0.7)',
      },
    ],
  }

  const doughnutHallazgos = {
    labels: ['Críticos', 'Mayores', 'Menores'],
    datasets: [{
      data: [totalCriticos, totalMayores, totalMenores],
      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
    }],
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setView('form')
  }

  const handleEdit = (i: Inspeccion) => {
    setEditingId(i.id)
    const { id: _id, ...rest } = i
    setForm(rest)
    setView('form')
  }

  const handleDelete = (id: string) => {
    setInspecciones(prev => prev.filter(i => i.id !== id))
    toast.success('Inspección eliminada')
  }

  const handleSave = () => {
    if (!form.codigo || !form.fecha || !form.area || !form.sede || !form.inspector) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editingId) {
      setInspecciones(prev => prev.map(i => i.id === editingId ? { ...form, id: editingId } : i))
      toast.success('Inspección actualizada')
    } else {
      setInspecciones(prev => [...prev, { ...form, id: String(Date.now()) }])
      toast.success('Inspección registrada')
    }
    setView('lista')
  }

  const getEstadoColor = (e: EstadoInspeccion) => {
    if (e === 'Programada') return 'bg-blue-100 text-blue-700'
    if (e === 'En Proceso') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getPuntajeColor = (p: number) => {
    if (p >= 90) return 'text-green-600'
    if (p >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTipoHallazgoColor = (t: string) => {
    if (t === 'Crítico') return 'bg-red-100 text-red-700'
    if (t === 'Mayor') return 'bg-yellow-100 text-yellow-700'
    return 'bg-blue-100 text-blue-700'
  }

  const selectedInspeccion = inspecciones.find(i => i.id === selectedId)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <FaSearch size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Inspecciones de Seguridad</h1>
            <p className="text-sm text-gray-500">Planeación, ejecución y seguimiento de inspecciones SST</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${view === 'dashboard' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            <FaChartBar size={14} /> Dashboard
          </button>
          <button onClick={() => setView('lista')} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition ${view === 'lista' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
            <FaList size={14} /> Lista
          </button>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            <FaPlus size={14} /> Nueva Inspección
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Inspecciones</p>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-400 mt-1">En el periodo</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Puntaje Promedio</p>
              <p className={`text-3xl font-bold ${getPuntajeColor(promedioPuntaje)}`}>{promedioPuntaje}%</p>
              <p className="text-xs text-gray-400 mt-1">Calificación media</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Cerradas</p>
              <p className="text-3xl font-bold text-green-600">{cerradas}</p>
              <p className="text-xs text-gray-400 mt-1">Completadas</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Programadas</p>
              <p className="text-3xl font-bold text-blue-600">{programadas}</p>
              <p className="text-xs text-gray-400 mt-1">Pendientes ejecución</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Hallazgos Críticos</p>
              <p className="text-3xl font-bold text-red-600">{totalCriticos}</p>
              <p className="text-xs text-gray-400 mt-1">Requieren atención inmediata</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Hallazgos Mayores</p>
              <p className="text-3xl font-bold text-yellow-600">{totalMayores}</p>
              <p className="text-xs text-gray-400 mt-1">Requieren corrección</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">En Proceso</p>
              <p className="text-3xl font-bold text-yellow-600">{enProceso}</p>
              <p className="text-xs text-gray-400 mt-1">En ejecución</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Inspecciones por Sede y Tipo</h3>
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Hallazgos por Clasificación</h3>
              <div className="flex justify-center">
                <div style={{ maxWidth: 250 }}>
                  <Doughnut data={doughnutHallazgos} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Resumen de Inspecciones</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Puntaje</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inspecciones.slice(0, 5).map(i => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-blue-600 font-medium">{i.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">{i.tipo}</td>
                    <td className="px-4 py-3 text-gray-600">{i.area}</td>
                    <td className="px-4 py-3">
                      {i.puntaje > 0 ? (
                        <span className={`font-semibold ${getPuntajeColor(i.puntaje)}`}>{i.puntaje}%</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(i.estado)}`}>{i.estado}</span></td>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">Todos los tipos</option>
              <option>Planeada</option>
              <option>No Planeada</option>
              <option>Gerencial</option>
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">Todos los estados</option>
              <option>Programada</option>
              <option>En Proceso</option>
              <option>Cerrada</option>
            </select>
            <select value={filterSede} onChange={e => setFilterSede(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">Todas las sedes</option>
              {SEDES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Área / Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Inspector</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hallazgos</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Puntaje</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(i => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-blue-600 font-medium">{i.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">{i.tipo}</td>
                    <td className="px-4 py-3 text-gray-600">{i.fecha}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800 font-medium">{i.area}</div>
                      <div className="text-gray-400 text-xs">{i.sede}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{i.inspector}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 text-xs">
                        <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{i.hallazgosCriticos}C</span>
                        <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">{i.hallazgosMayores}M</span>
                        <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{i.hallazgosMenores}m</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {i.puntaje > 0 ? (
                        <span className={`font-semibold ${getPuntajeColor(i.puntaje)}`}>{i.puntaje}%</span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(i.estado)}`}>{i.estado}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedId(i.id); setView('detalle') }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Ver detalle"><FaEye size={13} /></button>
                        <button onClick={() => handleEdit(i)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Editar"><FaEdit size={13} /></button>
                        <button onClick={() => handleDelete(i.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Eliminar"><FaTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No se encontraron inspecciones</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETALLE */}
      {view === 'detalle' && selectedInspeccion && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('lista')} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              ← Volver
            </button>
            <h2 className="text-lg font-bold text-gray-900">{selectedInspeccion.codigo} — Detalle de Inspección</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Información General</h3>
              <div className="flex justify-between"><span className="text-gray-500">Tipo:</span><span className="font-medium">{selectedInspeccion.tipo}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span>{selectedInspeccion.fecha}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Área:</span><span>{selectedInspeccion.area}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sede:</span><span>{selectedInspeccion.sede}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Inspector:</span><span>{selectedInspeccion.inspector}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Estado:</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(selectedInspeccion.estado)}`}>{selectedInspeccion.estado}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Puntaje:</span><span className={`text-xl font-bold ${getPuntajeColor(selectedInspeccion.puntaje)}`}>{selectedInspeccion.puntaje > 0 ? `${selectedInspeccion.puntaje}%` : 'N/A'}</span></div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Resumen de Hallazgos</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-600">{selectedInspeccion.hallazgosCriticos}</p>
                  <p className="text-xs text-red-500 font-medium">Críticos</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-600">{selectedInspeccion.hallazgosMayores}</p>
                  <p className="text-xs text-yellow-500 font-medium">Mayores</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{selectedInspeccion.hallazgosMenores}</p>
                  <p className="text-xs text-blue-500 font-medium">Menores</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <FaClipboardCheck className="text-blue-600" />
              <h3 className="font-semibold text-gray-700">Hallazgos Registrados</h3>
            </div>
            {selectedInspeccion.hallazgos.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedInspeccion.hallazgos.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800">{h.descripcion}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoHallazgoColor(h.tipo)}`}>{h.tipo}</span></td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${h.estado === 'Cerrado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{h.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-4 py-8 text-center text-gray-400">No hay hallazgos registrados aún</p>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleEdit(selectedInspeccion)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <FaEdit size={13} /> Editar Inspección
            </button>
            <button onClick={() => handleDelete(selectedInspeccion.id)} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
              <FaTrash size={13} /> Eliminar
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      {view === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Inspección' : 'Nueva Inspección'}</h2>
            <button onClick={() => setView('lista')} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Código *</label>
              <input value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="INS-XXX" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo *</label>
              <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as TipoInspeccion }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Planeada</option>
                <option>No Planeada</option>
                <option>Gerencial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha *</label>
              <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Área *</label>
              <select value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="">Seleccionar área</option>
                {AREAS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sede *</label>
              <select value={form.sede} onChange={e => setForm(p => ({ ...p, sede: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="">Seleccionar sede</option>
                {SEDES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Inspector *</label>
              <input value={form.inspector} onChange={e => setForm(p => ({ ...p, inspector: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Nombre del inspector" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
              <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoInspeccion }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Programada</option>
                <option>En Proceso</option>
                <option>Cerrada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Puntaje (%)</label>
              <input type="number" min={0} max={100} value={form.puntaje} onChange={e => setForm(p => ({ ...p, puntaje: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hallazgos Críticos</label>
              <input type="number" min={0} value={form.hallazgosCriticos} onChange={e => setForm(p => ({ ...p, hallazgosCriticos: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hallazgos Mayores</label>
              <input type="number" min={0} value={form.hallazgosMayores} onChange={e => setForm(p => ({ ...p, hallazgosMayores: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hallazgos Menores</label>
              <input type="number" min={0} value={form.hallazgosMenores} onChange={e => setForm(p => ({ ...p, hallazgosMenores: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setView('lista')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              {editingId ? 'Guardar Cambios' : 'Registrar Inspección'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
