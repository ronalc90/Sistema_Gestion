import { useState } from 'react'
import {
  FaCar, FaPlus, FaSearch, FaTimes, FaEdit,
  FaTrash, FaChartBar, FaList, FaEye, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type CategoriaLicencia = 'A1' | 'A2' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3'
type EstadoConductor = 'Activo' | 'Inactivo' | 'Suspendido'

interface Conductor {
  id: string
  nombre: string
  cedula: string
  licencia: string
  categoria: CategoriaLicencia
  vencimientoLicencia: string
  psicofisicoVigente: boolean
  vencimientoPsicofisico: string
  vehiculo: string
  placa: string
  vencimientoSOAT: string
  vencimientoTecnomecanica: string
  infracciones: number
  capacitacionesViales: string[]
  sede: string
  estado: EstadoConductor
}

const TODAY = '2026-03-23'
const SOON_DAYS = 30

function daysDiff(dateStr: string): number {
  const d1 = new Date(TODAY)
  const d2 = new Date(dateStr)
  return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
}

function getVencimientoStatus(dateStr: string): 'ok' | 'soon' | 'expired' {
  const diff = daysDiff(dateStr)
  if (diff < 0) return 'expired'
  if (diff <= SOON_DAYS) return 'soon'
  return 'ok'
}

const MOCK_CONDUCTORES: Conductor[] = [
  {
    id: '1', nombre: 'Carlos Andrés Gómez', cedula: '1020304050', licencia: 'CG-20230405',
    categoria: 'C1', vencimientoLicencia: '2027-04-05', psicofisicoVigente: true,
    vencimientoPsicofisico: '2026-09-15', vehiculo: 'Camión Freightliner', placa: 'TXK-234',
    vencimientoSOAT: '2026-11-20', vencimientoTecnomecanica: '2026-08-10',
    infracciones: 0, capacitacionesViales: ['Manejo defensivo', 'Normas de tránsito'],
    sede: 'Sede Principal', estado: 'Activo',
  },
  {
    id: '2', nombre: 'Pedro Luis Martínez', cedula: '71234567', licencia: 'PM-20210810',
    categoria: 'B1', vencimientoLicencia: '2026-04-10', psicofisicoVigente: true,
    vencimientoPsicofisico: '2026-04-15', vehiculo: 'Camioneta Toyota', placa: 'ABC-123',
    vencimientoSOAT: '2026-05-30', vencimientoTecnomecanica: '2026-03-30',
    infracciones: 1, capacitacionesViales: ['Manejo defensivo'],
    sede: 'Sede Norte', estado: 'Activo',
  },
  {
    id: '3', nombre: 'Luisa Fernanda Torres', cedula: '52345678', licencia: 'LT-20200120',
    categoria: 'B1', vencimientoLicencia: '2025-12-20', psicofisicoVigente: false,
    vencimientoPsicofisico: '2025-12-20', vehiculo: 'Automóvil Chevrolet Sail', placa: 'XYZ-789',
    vencimientoSOAT: '2026-02-28', vencimientoTecnomecanica: '2026-07-15',
    infracciones: 3, capacitacionesViales: [],
    sede: 'Sede Sur', estado: 'Suspendido',
  },
  {
    id: '4', nombre: 'Jorge Enrique Ríos', cedula: '80123456', licencia: 'JR-20220615',
    categoria: 'C2', vencimientoLicencia: '2027-06-15', psicofisicoVigente: true,
    vencimientoPsicofisico: '2026-12-01', vehiculo: 'Tractomula Kenworth', placa: 'TRC-456',
    vencimientoSOAT: '2026-12-15', vencimientoTecnomecanica: '2026-10-20',
    infracciones: 0, capacitacionesViales: ['Manejo defensivo', 'Carga pesada', 'Fatiga y somnolencia'],
    sede: 'Sede Norte', estado: 'Activo',
  },
  {
    id: '5', nombre: 'Sandra Milena Castro', cedula: '43210987', licencia: 'SC-20190305',
    categoria: 'B2', vencimientoLicencia: '2026-03-05', psicofisicoVigente: true,
    vencimientoPsicofisico: '2026-06-30', vehiculo: 'Furgoneta Mercedes Sprinter', placa: 'FRG-321',
    vencimientoSOAT: '2026-07-10', vencimientoTecnomecanica: '2025-11-30',
    infracciones: 2, capacitacionesViales: ['Manejo defensivo', 'Seguridad vial'],
    sede: 'Sede Principal', estado: 'Activo',
  },
  {
    id: '6', nombre: 'Andrés Felipe Vargas', cedula: '91765432', licencia: 'AV-20240110',
    categoria: 'C1', vencimientoLicencia: '2028-01-10', psicofisicoVigente: true,
    vencimientoPsicofisico: '2027-01-10', vehiculo: 'Camión NHR Isuzu', placa: 'NHR-654',
    vencimientoSOAT: '2027-01-20', vencimientoTecnomecanica: '2027-01-20',
    infracciones: 0, capacitacionesViales: ['Manejo defensivo', 'Normas de tránsito', 'Primeros auxilios viales'],
    sede: 'Sede Sur', estado: 'Activo',
  },
  {
    id: '7', nombre: 'Mario Humberto Peña', cedula: '11223344', licencia: 'MP-20180520',
    categoria: 'B1', vencimientoLicencia: '2026-05-20', psicofisicoVigente: false,
    vencimientoPsicofisico: '2025-05-20', vehiculo: 'Automóvil Renault Logan', placa: 'LOG-987',
    vencimientoSOAT: '2026-09-05', vencimientoTecnomecanica: '2026-06-15',
    infracciones: 4, capacitacionesViales: ['Manejo defensivo'],
    sede: 'Sede Principal', estado: 'Inactivo',
  },
]

const SEDES = ['Sede Principal', 'Sede Norte', 'Sede Sur']
const CATEGORIAS: CategoriaLicencia[] = ['A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']

const EMPTY_FORM: Omit<Conductor, 'id'> = {
  nombre: '', cedula: '', licencia: '', categoria: 'B1',
  vencimientoLicencia: '', psicofisicoVigente: false,
  vencimientoPsicofisico: '', vehiculo: '', placa: '',
  vencimientoSOAT: '', vencimientoTecnomecanica: '',
  infracciones: 0, capacitacionesViales: [], sede: '', estado: 'Activo',
}

type ViewMode = 'dashboard' | 'lista' | 'form' | 'detalle'

function StatusDot({ status }: { status: 'ok' | 'soon' | 'expired' }) {
  if (status === 'ok') return <FaCheckCircle className="text-green-500 inline mr-1" size={12} />
  if (status === 'soon') return <FaExclamationTriangle className="text-yellow-500 inline mr-1" size={12} />
  return <FaTimesCircle className="text-red-500 inline mr-1" size={12} />
}

export default function SeguridadVial() {
  const [view, setView] = useState<ViewMode>('dashboard')
  const [conductores, setConductores] = useState<Conductor[]>(MOCK_CONDUCTORES)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterSede, setFilterSede] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Conductor, 'id'>>(EMPTY_FORM)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [capInput, setCapInput] = useState('')

  const filtered = conductores.filter(c => {
    const matchSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.placa.toLowerCase().includes(search.toLowerCase()) ||
      c.cedula.includes(search)
    const matchEstado = !filterEstado || c.estado === filterEstado
    const matchSede = !filterSede || c.sede === filterSede
    return matchSearch && matchEstado && matchSede
  })

  const activos = conductores.filter(c => c.estado === 'Activo').length
  const licPorVencer = conductores.filter(c => getVencimientoStatus(c.vencimientoLicencia) === 'soon').length
  const licVencidas = conductores.filter(c => getVencimientoStatus(c.vencimientoLicencia) === 'expired').length
  const soatPorVencer = conductores.filter(c => getVencimientoStatus(c.vencimientoSOAT) === 'soon' || getVencimientoStatus(c.vencimientoSOAT) === 'expired').length
  const psicoPendiente = conductores.filter(c => !c.psicofisicoVigente).length

  const barInfracciones = {
    labels: conductores.filter(c => c.infracciones > 0).map(c => c.nombre.split(' ')[0] + ' ' + c.nombre.split(' ')[1]),
    datasets: [{
      label: 'Infracciones',
      data: conductores.filter(c => c.infracciones > 0).map(c => c.infracciones),
      backgroundColor: 'rgba(239,68,68,0.7)',
    }],
  }

  const doughnutCategoria = {
    labels: CATEGORIAS.filter(cat => conductores.some(c => c.categoria === cat)),
    datasets: [{
      data: CATEGORIAS.filter(cat => conductores.some(c => c.categoria === cat)).map(cat => conductores.filter(c => c.categoria === cat).length),
      backgroundColor: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'],
    }],
  }

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setCapInput('')
    setView('form')
  }

  const handleEdit = (c: Conductor) => {
    setEditingId(c.id)
    const { id: _id, ...rest } = c
    setForm(rest)
    setCapInput('')
    setView('form')
  }

  const handleDelete = (id: string) => {
    setConductores(prev => prev.filter(c => c.id !== id))
    toast.success('Conductor eliminado')
  }

  const handleSave = () => {
    if (!form.nombre || !form.cedula || !form.placa || !form.sede) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editingId) {
      setConductores(prev => prev.map(c => c.id === editingId ? { ...form, id: editingId } : c))
      toast.success('Conductor actualizado')
    } else {
      setConductores(prev => [...prev, { ...form, id: String(Date.now()) }])
      toast.success('Conductor registrado')
    }
    setView('lista')
  }

  const addCap = () => {
    if (capInput.trim()) {
      setForm(p => ({ ...p, capacitacionesViales: [...p.capacitacionesViales, capInput.trim()] }))
      setCapInput('')
    }
  }

  const removeCap = (idx: number) => {
    setForm(p => ({ ...p, capacitacionesViales: p.capacitacionesViales.filter((_, i) => i !== idx) }))
  }

  const getEstadoColor = (e: EstadoConductor) => {
    if (e === 'Activo') return 'bg-green-100 text-green-700'
    if (e === 'Inactivo') return 'bg-gray-100 text-gray-600'
    return 'bg-red-100 text-red-700'
  }

  const selectedConductor = conductores.find(c => c.id === selectedId)

  const alerts = conductores.filter(c => {
    const licSt = getVencimientoStatus(c.vencimientoLicencia)
    const soatSt = getVencimientoStatus(c.vencimientoSOAT)
    const tecnoSt = getVencimientoStatus(c.vencimientoTecnomecanica)
    return licSt !== 'ok' || soatSt !== 'ok' || tecnoSt !== 'ok' || !c.psicofisicoVigente
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <FaCar size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Seguridad Vial</h1>
            <p className="text-sm text-gray-500">Gestión de conductores, vehículos y documentación vial</p>
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
            <FaPlus size={14} /> Nuevo Conductor
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Conductores Activos</p>
              <p className="text-3xl font-bold text-green-600">{activos}</p>
              <p className="text-xs text-gray-400 mt-1">En servicio</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Lic. por Vencer</p>
              <p className="text-3xl font-bold text-yellow-600">{licPorVencer + licVencidas}</p>
              <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1"><FaExclamationTriangle size={10} /> Atención requerida</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">SOAT/Tecno. Alertas</p>
              <p className="text-3xl font-bold text-orange-600">{soatPorVencer}</p>
              <p className="text-xs text-gray-400 mt-1">Documentos vencidos/próximos</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Psicofísico Vencido</p>
              <p className="text-3xl font-bold text-red-600">{psicoPendiente}</p>
              <p className="text-xs text-gray-400 mt-1">Sin apto vigente</p>
            </div>
          </div>

          {alerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-700 flex items-center gap-2 mb-3">
                <FaExclamationTriangle /> Alertas de Vencimientos
              </h3>
              <div className="space-y-2">
                {alerts.map(c => {
                  const licSt = getVencimientoStatus(c.vencimientoLicencia)
                  const soatSt = getVencimientoStatus(c.vencimientoSOAT)
                  const tecnoSt = getVencimientoStatus(c.vencimientoTecnomecanica)
                  const issues = []
                  if (licSt !== 'ok') issues.push(`Licencia ${licSt === 'expired' ? 'VENCIDA' : 'por vencer'} (${c.vencimientoLicencia})`)
                  if (soatSt !== 'ok') issues.push(`SOAT ${soatSt === 'expired' ? 'VENCIDO' : 'por vencer'} (${c.vencimientoSOAT})`)
                  if (tecnoSt !== 'ok') issues.push(`Tecnomecánica ${tecnoSt === 'expired' ? 'VENCIDA' : 'por vencer'} (${c.vencimientoTecnomecanica})`)
                  if (!c.psicofisicoVigente) issues.push('Psicofísico no vigente')
                  return (
                    <div key={c.id} className="bg-white rounded-lg px-4 py-2 border border-yellow-100 text-sm">
                      <div className="font-medium text-gray-800">{c.nombre} — {c.placa}</div>
                      <div className="text-yellow-600 text-xs">{issues.join(' | ')}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Infracciones por Conductor</h3>
              {barInfracciones.labels.length > 0 ? (
                <Bar data={barInfracciones} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              ) : <p className="text-gray-400 text-sm text-center py-8">Sin infracciones registradas</p>}
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Conductores por Categoría</h3>
              <div className="flex justify-center">
                <div style={{ maxWidth: 250 }}>
                  <Doughnut data={doughnutCategoria} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LISTA */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, placa o cédula..." className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="">Todos los estados</option>
              <option>Activo</option>
              <option>Inactivo</option>
              <option>Suspendido</option>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Conductor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Cat.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Vehículo / Placa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Licencia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SOAT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tecno.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Psicofísico</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Infracc.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => {
                  const licSt = getVencimientoStatus(c.vencimientoLicencia)
                  const soatSt = getVencimientoStatus(c.vencimientoSOAT)
                  const tecnoSt = getVencimientoStatus(c.vencimientoTecnomecanica)
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{c.nombre}</div>
                        <div className="text-gray-400 text-xs">{c.cedula}</div>
                      </td>
                      <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{c.categoria}</span></td>
                      <td className="px-4 py-3">
                        <div className="text-gray-700">{c.vehiculo}</div>
                        <div className="text-blue-600 font-mono text-xs font-medium">{c.placa}</div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <StatusDot status={licSt} />
                        <span className={licSt !== 'ok' ? 'text-red-600 font-medium' : 'text-gray-600'}>{c.vencimientoLicencia}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <StatusDot status={soatSt} />
                        <span className={soatSt !== 'ok' ? 'text-red-600 font-medium' : 'text-gray-600'}>{c.vencimientoSOAT}</span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <StatusDot status={tecnoSt} />
                        <span className={tecnoSt !== 'ok' ? 'text-red-600 font-medium' : 'text-gray-600'}>{c.vencimientoTecnomecanica}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.psicofisicoVigente ? <FaCheckCircle className="text-green-500 mx-auto" size={14} /> : <FaTimesCircle className="text-red-500 mx-auto" size={14} />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={c.infracciones > 0 ? 'text-red-600 font-bold' : 'text-gray-400'}>{c.infracciones}</span>
                      </td>
                      <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(c.estado)}`}>{c.estado}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedId(c.id); setView('detalle') }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Ver detalle"><FaEye size={13} /></button>
                          <button onClick={() => handleEdit(c)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Editar"><FaEdit size={13} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Eliminar"><FaTrash size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="px-4 py-10 text-center text-gray-400">No se encontraron conductores</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETALLE */}
      {view === 'detalle' && selectedConductor && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('lista')} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              ← Volver
            </button>
            <h2 className="text-lg font-bold text-gray-900">{selectedConductor.nombre}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(selectedConductor.estado)}`}>{selectedConductor.estado}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Datos del Conductor</h3>
              <div className="flex justify-between"><span className="text-gray-500">Cédula:</span><span className="font-mono">{selectedConductor.cedula}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">No. Licencia:</span><span className="font-mono text-blue-600">{selectedConductor.licencia}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Categoría:</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{selectedConductor.categoria}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Sede:</span><span>{selectedConductor.sede}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Infracciones:</span><span className={selectedConductor.infracciones > 0 ? 'text-red-600 font-bold' : 'text-green-600'}>{selectedConductor.infracciones}</span></div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Vehículo</h3>
              <div className="flex justify-between"><span className="text-gray-500">Vehículo:</span><span>{selectedConductor.vehiculo}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Placa:</span><span className="font-mono text-blue-600 font-bold">{selectedConductor.placa}</span></div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-gray-800 border-b pb-2">Documentación</h3>
              {[
                { label: 'Venc. Licencia', date: selectedConductor.vencimientoLicencia },
                { label: 'SOAT', date: selectedConductor.vencimientoSOAT },
                { label: 'Tecnomecánica', date: selectedConductor.vencimientoTecnomecanica },
                { label: 'Psicofísico', date: selectedConductor.vencimientoPsicofisico },
              ].map(item => {
                const st = getVencimientoStatus(item.date)
                return (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-gray-500">{item.label}:</span>
                    <span className={`text-xs font-medium flex items-center gap-1 ${st === 'ok' ? 'text-green-600' : st === 'soon' ? 'text-yellow-600' : 'text-red-600'}`}>
                      <StatusDot status={st} /> {item.date}
                    </span>
                  </div>
                )
              })}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Psicofísico Vigente:</span>
                {selectedConductor.psicofisicoVigente
                  ? <FaCheckCircle className="text-green-500" size={14} />
                  : <FaTimesCircle className="text-red-500" size={14} />}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3">Capacitaciones Viales</h3>
              {selectedConductor.capacitacionesViales.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedConductor.capacitacionesViales.map((cap, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">{cap}</span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Sin capacitaciones registradas</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleEdit(selectedConductor)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <FaEdit size={13} /> Editar
            </button>
            <button onClick={() => handleDelete(selectedConductor.id)} className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
              <FaTrash size={13} /> Eliminar
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      {view === 'form' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Editar Conductor' : 'Nuevo Conductor'}</h2>
            <button onClick={() => setView('lista')} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre Completo *</label>
              <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Nombre completo del conductor" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Cédula *</label>
              <input value={form.cedula} onChange={e => setForm(p => ({ ...p, cedula: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="No. de cédula" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">No. Licencia</label>
              <input value={form.licencia} onChange={e => setForm(p => ({ ...p, licencia: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="No. de licencia" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Categoría Licencia</label>
              <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value as CategoriaLicencia }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Vencimiento Licencia</label>
              <input type="date" value={form.vencimientoLicencia} onChange={e => setForm(p => ({ ...p, vencimientoLicencia: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Vencimiento Psicofísico</label>
              <input type="date" value={form.vencimientoPsicofisico} onChange={e => setForm(p => ({ ...p, vencimientoPsicofisico: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Psicofísico Vigente</label>
              <select value={form.psicofisicoVigente ? 'si' : 'no'} onChange={e => setForm(p => ({ ...p, psicofisicoVigente: e.target.value === 'si' }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Vehículo *</label>
              <input value={form.vehiculo} onChange={e => setForm(p => ({ ...p, vehiculo: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Marca y modelo" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Placa *</label>
              <input value={form.placa} onChange={e => setForm(p => ({ ...p, placa: e.target.value.toUpperCase() }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="ABC-123" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Vencimiento SOAT</label>
              <input type="date" value={form.vencimientoSOAT} onChange={e => setForm(p => ({ ...p, vencimientoSOAT: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Vencimiento Tecnomecánica</label>
              <input type="date" value={form.vencimientoTecnomecanica} onChange={e => setForm(p => ({ ...p, vencimientoTecnomecanica: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Infracciones</label>
              <input type="number" min={0} value={form.infracciones} onChange={e => setForm(p => ({ ...p, infracciones: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sede *</label>
              <select value={form.sede} onChange={e => setForm(p => ({ ...p, sede: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="">Seleccionar sede</option>
                {SEDES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Estado</label>
              <select value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoConductor }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>Activo</option>
                <option>Inactivo</option>
                <option>Suspendido</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Capacitaciones Viales</label>
              <div className="flex gap-2 mb-2">
                <input value={capInput} onChange={e => setCapInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCap()} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Nombre de la capacitación..." />
                <button type="button" onClick={addCap} className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm hover:bg-gray-200">Agregar</button>
              </div>
              {form.capacitacionesViales.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.capacitacionesViales.map((cap, i) => (
                    <span key={i} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {cap}
                      <button type="button" onClick={() => removeCap(i)} className="hover:text-red-500"><FaTimes size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setView('lista')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button onClick={handleSave} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              {editingId ? 'Guardar Cambios' : 'Registrar Conductor'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
