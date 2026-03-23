import { useState } from 'react'
import {
  FaExclamationTriangle, FaPlus, FaSearch, FaTimes, FaEdit,
  FaTrash, FaChartBar, FaList, FaEye, FaCheck, FaClock,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type TipoReporte = 'Acto Inseguro' | 'Condición Insegura'
type ClasificacionRiesgo = 'Alto' | 'Medio' | 'Bajo'
type EstadoReporte = 'Pendiente' | 'Gestionado'

interface Reporte {
  id: string
  codigo: string
  tipo: TipoReporte
  fecha: string
  area: string
  sede: string
  descripcion: string
  clasificacion: ClasificacionRiesgo
  responsable: string
  estado: EstadoReporte
  accionTomada: string
}

const MOCK_REPORTES: Reporte[] = [
  {
    id: '1', codigo: 'ACI-001', tipo: 'Acto Inseguro', fecha: '2026-03-10',
    area: 'Bodega', sede: 'Sede Principal', descripcion: 'Operario manipulando carga sin EPP (guantes y casco)',
    clasificacion: 'Alto', responsable: 'Juan Pérez', estado: 'Gestionado',
    accionTomada: 'Capacitación inmediata y dotación de EPP',
  },
  {
    id: '2', codigo: 'ACI-002', tipo: 'Condición Insegura', fecha: '2026-03-12',
    area: 'Planta de Producción', sede: 'Sede Norte', descripcion: 'Piso húmedo sin señalización de aviso',
    clasificacion: 'Alto', responsable: 'María López', estado: 'Gestionado',
    accionTomada: 'Señalización colocada y revisión de fugas',
  },
  {
    id: '3', codigo: 'ACI-003', tipo: 'Acto Inseguro', fecha: '2026-03-14',
    area: 'Oficinas Administrativas', sede: 'Sede Principal', descripcion: 'Cables eléctricos expuestos en escritorio sin protección',
    clasificacion: 'Medio', responsable: 'Carlos Gómez', estado: 'Pendiente',
    accionTomada: '',
  },
  {
    id: '4', codigo: 'ACI-004', tipo: 'Condición Insegura', fecha: '2026-03-15',
    area: 'Parqueadero', sede: 'Sede Sur', descripcion: 'Iluminación deficiente en zona de parqueo nocturno',
    clasificacion: 'Medio', responsable: 'Ana Rodríguez', estado: 'Pendiente',
    accionTomada: '',
  },
  {
    id: '5', codigo: 'ACI-005', tipo: 'Acto Inseguro', fecha: '2026-03-16',
    area: 'Almacén', sede: 'Sede Norte', descripcion: 'Apilamiento de estibas sobre la altura permitida',
    clasificacion: 'Alto', responsable: 'Pedro Martínez', estado: 'Gestionado',
    accionTomada: 'Reorganización de estibas y capacitación en almacenamiento seguro',
  },
  {
    id: '6', codigo: 'ACI-006', tipo: 'Condición Insegura', fecha: '2026-03-17',
    area: 'Laboratorio', sede: 'Sede Principal', descripcion: 'Extintores vencidos en área de química',
    clasificacion: 'Alto', responsable: 'Luisa Vargas', estado: 'Pendiente',
    accionTomada: '',
  },
  {
    id: '7', codigo: 'ACI-007', tipo: 'Acto Inseguro', fecha: '2026-03-18',
    area: 'Taller Mecánico', sede: 'Sede Sur', descripcion: 'Uso inadecuado de herramientas eléctricas sin guarda',
    clasificacion: 'Bajo', responsable: 'Andrés Torres', estado: 'Pendiente',
    accionTomada: '',
  },
  {
    id: '8', codigo: 'ACI-008', tipo: 'Condición Insegura', fecha: '2026-03-20',
    area: 'Cafetería', sede: 'Sede Principal', descripcion: 'Grasa acumulada en piso de cocina, riesgo de caída',
    clasificacion: 'Medio', responsable: 'Sandra Herrera', estado: 'Gestionado',
    accionTomada: 'Limpieza profunda y programa de aseo diario',
  },
]

const AREAS = ['Bodega', 'Planta de Producción', 'Oficinas Administrativas', 'Parqueadero', 'Almacén', 'Laboratorio', 'Taller Mecánico', 'Cafetería']
const SEDES = ['Sede Principal', 'Sede Norte', 'Sede Sur']

const EMPTY_FORM: Omit<Reporte, 'id'> = {
  codigo: '', tipo: 'Acto Inseguro', fecha: '', area: '', sede: '',
  descripcion: '', clasificacion: 'Medio', responsable: '', estado: 'Pendiente', accionTomada: '',
}

type ViewMode = 'dashboard' | 'lista' | 'form'

export default function ActosCondicionesInseguras() {
  const [view, setView] = useState<ViewMode>('dashboard')
  const [reportes, setReportes] = useState<Reporte[]>(MOCK_REPORTES)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterSede, setFilterSede] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Reporte, 'id'>>(EMPTY_FORM)
  const [detailId, setDetailId] = useState<string | null>(null)

  const filtered = reportes.filter(r => {
    const matchSearch = r.descripcion.toLowerCase().includes(search.toLowerCase()) ||
      r.codigo.toLowerCase().includes(search.toLowerCase()) ||
      r.responsable.toLowerCase().includes(search.toLowerCase())
    const matchTipo = !filterTipo || r.tipo === filterTipo
    const matchEstado = !filterEstado || r.estado === filterEstado
    const matchSede = !filterSede || r.sede === filterSede
    return matchSearch && matchTipo && matchEstado && matchSede
  })

  const total = reportes.length
  const pendientes = reportes.filter(r => r.estado === 'Pendiente').length
  const actosInseguros = reportes.filter(r => r.tipo === 'Acto Inseguro').length
  const condicionesInseguras = reportes.filter(r => r.tipo === 'Condición Insegura').length
  const altoRiesgo = reportes.filter(r => r.clasificacion === 'Alto').length

  const barData = {
    labels: SEDES,
    datasets: [
      {
        label: 'Actos Inseguros',
        data: SEDES.map(s => reportes.filter(r => r.sede === s && r.tipo === 'Acto Inseguro').length),
        backgroundColor: 'rgba(239,68,68,0.7)',
      },
      {
        label: 'Condiciones Inseguras',
        data: SEDES.map(s => reportes.filter(r => r.sede === s && r.tipo === 'Condición Insegura').length),
        backgroundColor: 'rgba(251,191,36,0.7)',
      },
    ],
  }

  const doughnutData = {
    labels: ['Alto', 'Medio', 'Bajo'],
    datasets: [{
      data: [
        reportes.filter(r => r.clasificacion === 'Alto').length,
        reportes.filter(r => r.clasificacion === 'Medio').length,
        reportes.filter(r => r.clasificacion === 'Bajo').length,
      ],
      backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
    }],
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setView('form')
  }

  const handleEdit = (r: Reporte) => {
    setEditingId(r.id)
    const { id: _id, ...rest } = r
    setForm(rest)
    setView('form')
  }

  const handleDelete = (id: string) => {
    setReportes(prev => prev.filter(r => r.id !== id))
    toast.success('Reporte eliminado')
  }

  const handleSave = () => {
    if (!form.codigo || !form.fecha || !form.area || !form.sede || !form.responsable || !form.descripcion) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editingId) {
      setReportes(prev => prev.map(r => r.id === editingId ? { ...form, id: editingId } : r))
      toast.success('Reporte actualizado')
    } else {
      const newId = String(Date.now())
      setReportes(prev => [...prev, { ...form, id: newId }])
      toast.success('Reporte registrado')
    }
    setView('lista')
  }

  const handleToggleEstado = (id: string) => {
    setReportes(prev => prev.map(r =>
      r.id === id ? { ...r, estado: r.estado === 'Pendiente' ? 'Gestionado' : 'Pendiente' } : r
    ))
    toast.success('Estado actualizado')
  }

  const getClasifColor = (c: ClasificacionRiesgo) => {
    if (c === 'Alto') return 'bg-red-100 text-red-700'
    if (c === 'Medio') return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  const getEstadoColor = (e: EstadoReporte) =>
    e === 'Pendiente' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'

  const detailRecord = reportes.find(r => r.id === detailId)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 text-white p-3 rounded-xl">
            <FaExclamationTriangle size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Actos y Condiciones Inseguras</h1>
            <p className="text-sm text-gray-500">Registro y gestión de reportes de condiciones y actos inseguros</p>
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
            <FaPlus size={14} /> Nuevo Reporte
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Reportes</p>
              <p className="text-3xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-400 mt-1">Registros activos</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-orange-600">{pendientes}</p>
              <p className="text-xs text-gray-400 mt-1">Sin gestionar</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Actos Inseguros</p>
              <p className="text-3xl font-bold text-red-600">{actosInseguros}</p>
              <p className="text-xs text-gray-400 mt-1">Reportados</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Cond. Inseguras</p>
              <p className="text-3xl font-bold text-yellow-600">{condicionesInseguras}</p>
              <p className="text-xs text-gray-400 mt-1">Reportadas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Alto Riesgo</p>
              <p className="text-3xl font-bold text-red-700">{altoRiesgo}</p>
              <p className="text-xs text-gray-400 mt-1">Clasificación alta</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">% Gestionados</p>
              <p className="text-3xl font-bold text-green-600">{total ? Math.round(((total - pendientes) / total) * 100) : 0}%</p>
              <p className="text-xs text-gray-400 mt-1">Efectividad de cierre</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Sedes Afectadas</p>
              <p className="text-3xl font-bold text-blue-600">{new Set(reportes.map(r => r.sede)).size}</p>
              <p className="text-xs text-gray-400 mt-1">Con reportes activos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Reportes por Sede y Tipo</h3>
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Clasificación de Riesgo</h3>
              <div className="flex justify-center">
                <div style={{ maxWidth: 250 }}>
                  <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Reportes Pendientes</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Área</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Clasificación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reportes.filter(r => r.estado === 'Pendiente').map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-red-600 font-medium">{r.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">{r.tipo}</td>
                    <td className="px-4 py-3 text-gray-600">{r.area}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getClasifColor(r.clasificacion)}`}>{r.clasificacion}</span></td>
                    <td className="px-4 py-3 text-gray-600">{r.responsable}</td>
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
              <option>Acto Inseguro</option>
              <option>Condición Insegura</option>
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Todos los estados</option>
              <option>Pendiente</option>
              <option>Gestionado</option>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Área / Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Clasificación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Responsable</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-red-600 font-medium">{r.codigo}</td>
                    <td className="px-4 py-3 text-gray-700">{r.tipo}</td>
                    <td className="px-4 py-3 text-gray-600">{r.fecha}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800 font-medium">{r.area}</div>
                      <div className="text-gray-400 text-xs">{r.sede}</div>
                    </td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getClasifColor(r.clasificacion)}`}>{r.clasificacion}</span></td>
                    <td className="px-4 py-3 text-gray-600">{r.responsable}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleEstado(r.id)} className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(r.estado)}`}>
                        {r.estado}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setDetailId(r.id) }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Ver detalle"><FaEye size={13} /></button>
                        <button onClick={() => handleEdit(r)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Editar"><FaEdit size={13} /></button>
                        <button onClick={() => handleDelete(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Eliminar"><FaTrash size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No se encontraron reportes</td></tr>
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
            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Reporte' : 'Nuevo Reporte'}</h2>
            <button onClick={() => setView('lista')} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Código *</label>
              <input value={form.codigo} onChange={e => setForm(p => ({ ...p, codigo: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="ACI-XXX" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo *</label>
              <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as TipoReporte }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option>Acto Inseguro</option>
                <option>Condición Insegura</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha *</label>
              <input type="date" value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Área *</label>
              <select value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option value="">Seleccionar área</option>
                {AREAS.map(a => <option key={a}>{a}</option>)}
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
              <label className="block text-xs font-semibold text-gray-600 mb-1">Clasificación Riesgo *</label>
              <select value={form.clasificacion} onChange={e => setForm(p => ({ ...p, clasificacion: e.target.value as ClasificacionRiesgo }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option>Alto</option>
                <option>Medio</option>
                <option>Bajo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Responsable *</label>
              <input value={form.responsable} onChange={e => setForm(p => ({ ...p, responsable: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Nombre del responsable" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
              <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoReporte }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                <option>Pendiente</option>
                <option>Gestionado</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción *</label>
              <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Descripción detallada del acto o condición insegura..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Acción Tomada</label>
              <textarea value={form.accionTomada} onChange={e => setForm(p => ({ ...p, accionTomada: e.target.value }))} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" placeholder="Describir las acciones correctivas tomadas..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setView('lista')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              {editingId ? 'Guardar Cambios' : 'Registrar Reporte'}
            </button>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailId && detailRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{detailRecord.codigo}</h3>
              <button onClick={() => setDetailId(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tipo:</span><span className="font-medium">{detailRecord.tipo}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Fecha:</span><span>{detailRecord.fecha}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Área / Sede:</span><span>{detailRecord.area} — {detailRecord.sede}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Clasificación:</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getClasifColor(detailRecord.clasificacion)}`}>{detailRecord.clasificacion}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Responsable:</span><span>{detailRecord.responsable}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Estado:</span><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(detailRecord.estado)}`}>{detailRecord.estado}</span></div>
              <div>
                <p className="text-gray-500 mb-1">Descripción:</p>
                <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{detailRecord.descripcion}</p>
              </div>
              {detailRecord.accionTomada && (
                <div>
                  <p className="text-gray-500 mb-1">Acción Tomada:</p>
                  <p className="text-gray-800 bg-green-50 rounded-lg p-3">{detailRecord.accionTomada}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { handleEdit(detailRecord); setDetailId(null) }} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                <FaEdit size={13} /> Editar
              </button>
              <button onClick={() => { handleToggleEstado(detailRecord.id); setDetailId(null) }} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                <FaCheck size={13} /> {detailRecord.estado === 'Pendiente' ? 'Marcar Gestionado' : 'Marcar Pendiente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estado indicator for lista */}
      {view === 'lista' && (
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><FaClock className="text-orange-400" /> Pendiente = click para cambiar estado</span>
          <span className="flex items-center gap-1"><FaEye className="text-blue-400" /> Ver detalle completo</span>
        </div>
      )}
    </div>
  )
}
