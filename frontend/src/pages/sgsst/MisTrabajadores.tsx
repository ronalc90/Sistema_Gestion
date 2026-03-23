import { useState } from 'react'
import {
  FaUsers, FaEdit, FaEye, FaTimes,
  FaFilter, FaSearch, FaCheckCircle, FaExclamationTriangle,
  FaClock, FaUserCheck, FaDownload, FaChartBar, FaPlus,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'lista' | 'detalle'
type EstadoVinculacion = 'Activo' | 'Inactivo' | 'Vacaciones' | 'Incapacidad'

interface Trabajador {
  id: number
  cedula: string
  nombre: string
  cargo: string
  area: string
  sede: string
  fechaIngreso: string
  tipoContrato: string
  estado: EstadoVinculacion
  arl: string
  eps: string
  examenIngreso: boolean
  examenPeriodicoVigente: boolean
  fechaUltimoExamen: string
  inducciones: number
  capacitaciones: number
  epp: boolean
  riesgo: string
}

const workers0: Trabajador[] = [
  { id: 1, cedula: '1020304050', nombre: 'Carlos Martínez López', cargo: 'Operario de producción', area: 'Producción', sede: 'Sede Principal', fechaIngreso: '2022-03-15', tipoContrato: 'Indefinido', estado: 'Activo', arl: 'Positiva', eps: 'Sanitas', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-08-20', inducciones: 3, capacitaciones: 8, epp: true, riesgo: 'III' },
  { id: 2, cedula: '1120304051', nombre: 'Ana María González', cargo: 'Técnica de laboratorio', area: 'Laboratorio', sede: 'Sede Principal', fechaIngreso: '2021-07-01', tipoContrato: 'Indefinido', estado: 'Activo', arl: 'Colmena', eps: 'Nueva EPS', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-09-15', inducciones: 3, capacitaciones: 12, epp: true, riesgo: 'II' },
  { id: 3, cedula: '1130304052', nombre: 'José Fernando Ruiz', cargo: 'Técnico electricista', area: 'Mantenimiento', sede: 'Sede Principal', fechaIngreso: '2020-01-10', tipoContrato: 'Indefinido', estado: 'Activo', arl: 'Positiva', eps: 'Sanitas', examenIngreso: true, examenPeriodicoVigente: false, fechaUltimoExamen: '2024-01-10', inducciones: 3, capacitaciones: 15, epp: true, riesgo: 'III' },
  { id: 4, cedula: '1140304053', nombre: 'Laura Patricia Díaz', cargo: 'Auxiliar administrativo', area: 'Administración', sede: 'Sede Norte', fechaIngreso: '2023-02-28', tipoContrato: 'Término fijo', estado: 'Activo', arl: 'Colmena', eps: 'Compensar', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-10-05', inducciones: 2, capacitaciones: 5, epp: true, riesgo: 'I' },
  { id: 5, cedula: '1150304054', nombre: 'Miguel Ángel Torres', cargo: 'Conductor de carga', area: 'Logística', sede: 'Sede Principal', fechaIngreso: '2019-05-20', tipoContrato: 'Indefinido', estado: 'Activo', arl: 'Sura', eps: 'Sura EPS', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-11-01', inducciones: 4, capacitaciones: 18, epp: true, riesgo: 'III' },
  { id: 6, cedula: '1160304055', nombre: 'Sandra Milena Castro', cargo: 'Jefe de producción', area: 'Producción', sede: 'Sede Principal', fechaIngreso: '2018-08-15', tipoContrato: 'Indefinido', estado: 'Vacaciones', arl: 'Positiva', eps: 'Sanitas', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-07-20', inducciones: 4, capacitaciones: 22, epp: true, riesgo: 'III' },
  { id: 7, cedula: '1170304056', nombre: 'Ricardo Hernández Mora', cargo: 'Almacenista', area: 'Logística', sede: 'Sede Sur', fechaIngreso: '2024-01-08', tipoContrato: 'Término fijo', estado: 'Activo', arl: 'Colmena', eps: 'Nueva EPS', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-12-01', inducciones: 2, capacitaciones: 4, epp: false, riesgo: 'II' },
  { id: 8, cedula: '1180304057', nombre: 'Diana Carolina Vargas', cargo: 'Analista de calidad', area: 'Calidad', sede: 'Sede Principal', fechaIngreso: '2022-09-01', tipoContrato: 'Indefinido', estado: 'Incapacidad', arl: 'Positiva', eps: 'Famisanar', examenIngreso: true, examenPeriodicoVigente: true, fechaUltimoExamen: '2025-06-15', inducciones: 3, capacitaciones: 10, epp: true, riesgo: 'II' },
]

const estadoColor: Record<EstadoVinculacion, string> = {
  'Activo': 'bg-green-100 text-green-700',
  'Inactivo': 'bg-gray-100 text-gray-700',
  'Vacaciones': 'bg-blue-100 text-blue-700',
  'Incapacidad': 'bg-yellow-100 text-yellow-700',
}

const riesgoColor: Record<string, string> = {
  'I': 'bg-green-100 text-green-700',
  'II': 'bg-blue-100 text-blue-700',
  'III': 'bg-yellow-100 text-yellow-700',
  'IV': 'bg-orange-100 text-orange-700',
  'V': 'bg-red-100 text-red-700',
}

export default function MisTrabajadores() {
  const [view, setView] = useState<View>('dashboard')
  const [workers] = useState<Trabajador[]>(workers0)
  const [selected, setSelected] = useState<Trabajador | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterArea, setFilterArea] = useState('Todos')

  const activos = workers.filter(w => w.estado === 'Activo').length
  const examenesVigentes = workers.filter(w => w.examenPeriodicoVigente).length
  const sinEpp = workers.filter(w => !w.epp).length
  const examenesVencidos = workers.filter(w => !w.examenPeriodicoVigente).length
  const areas = [...new Set(workers.map(w => w.area))]

  const filtrados = workers.filter(w => {
    const matchEstado = filterEstado === 'Todos' || w.estado === filterEstado
    const matchArea = filterArea === 'Todos' || w.area === filterArea
    const matchSearch = !searchTerm || w.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || w.cedula.includes(searchTerm) || w.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    return matchEstado && matchArea && matchSearch
  })

  const chartEstados = {
    labels: ['Activo', 'Vacaciones', 'Incapacidad', 'Inactivo'],
    datasets: [{ data: [activos, workers.filter(w => w.estado === 'Vacaciones').length, workers.filter(w => w.estado === 'Incapacidad').length, workers.filter(w => w.estado === 'Inactivo').length], backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#9CA3AF'], borderWidth: 0 }],
  }
  const chartAreas = {
    labels: areas,
    datasets: [{ label: 'Trabajadores', data: areas.map(a => workers.filter(w => w.area === a).length), backgroundColor: '#3B82F6', borderRadius: 6 }],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-lg"><FaUsers /></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mis Trabajadores — SST</h1>
              <p className="text-sm text-gray-500">Gestión del personal en el Sistema de Gestión de SST</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${view === 'dashboard' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}><FaChartBar /> Dashboard</button>
            <button onClick={() => setView('lista')} className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${view === 'lista' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}><FaUsers /> Lista</button>
            <button onClick={() => toast('Módulo de vinculación próximamente', { icon: 'ℹ️' })} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaPlus /> Vincular trabajador</button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total trabajadores</p>
                <p className="text-3xl font-bold text-gray-900">{workers.length}</p>
                <p className="text-xs text-gray-400 mt-1">{activos} activos actualmente</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaUserCheck className="text-green-500" /> Exámenes vigentes</p>
                <p className="text-3xl font-bold text-green-600">{examenesVigentes}</p>
                <p className="text-xs text-gray-400 mt-1">{workers.length > 0 ? Math.round((examenesVigentes / workers.length) * 100) : 0}% cobertura</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaClock className="text-red-500" /> Exámenes vencidos</p>
                <p className="text-3xl font-bold text-red-600">{examenesVencidos}</p>
                <p className="text-xs text-gray-400 mt-1">Requieren atención</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaExclamationTriangle className="text-yellow-500" /> Sin EPP completo</p>
                <p className="text-3xl font-bold text-yellow-600">{sinEpp}</p>
                <p className="text-xs text-gray-400 mt-1">Dotación pendiente</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Estado de vinculación</h3>
                <div className="h-52 flex items-center justify-center">
                  <Doughnut data={chartEstados} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Trabajadores por área</h3>
                <div className="h-52">
                  <Bar data={chartAreas} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Alertas SST</h3>
                <button onClick={() => setView('lista')} className="text-sm text-blue-600 hover:underline">Ver todos</button>
              </div>
              <div className="divide-y divide-gray-50">
                {workers.filter(w => !w.examenPeriodicoVigente || !w.epp).map(w => (
                  <div key={w.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{w.nombre}</p>
                      <p className="text-xs text-gray-500">{w.cargo} — {w.area}</p>
                    </div>
                    <div className="flex gap-2">
                      {!w.examenPeriodicoVigente && <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Examen vencido</span>}
                      {!w.epp && <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">EPP incompleto</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'lista' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500"><FaFilter className="text-blue-500" /></div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar trabajador..." className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm w-52 focus:outline-none focus:border-blue-400" />
              </div>
              <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400">
                <option value="Todos">Todos los estados</option>
                {['Activo', 'Vacaciones', 'Incapacidad', 'Inactivo'].map(e => <option key={e}>{e}</option>)}
              </select>
              <select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400">
                <option value="Todos">Todas las áreas</option>
                {areas.map(a => <option key={a}>{a}</option>)}
              </select>
              <span className="ml-auto text-sm text-gray-500">{filtrados.length} trabajador(es)</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Trabajador', 'Cargo / Área', 'Sede', 'Ingreso', 'Riesgo', 'Examen', 'EPP', 'Estado', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtrados.map(w => (
                      <tr key={w.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-800">{w.nombre}</p>
                          <p className="text-xs text-gray-400">{w.cedula}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-700">{w.cargo}</p>
                          <p className="text-xs text-gray-400">{w.area}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{w.sede}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{w.fechaIngreso}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${riesgoColor[w.riesgo] || 'bg-gray-100 text-gray-600'}`}>Clase {w.riesgo}</span></td>
                        <td className="px-4 py-3 text-center">
                          {w.examenPeriodicoVigente ? <FaCheckCircle className="text-green-500 mx-auto" /> : <FaExclamationTriangle className="text-red-500 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {w.epp ? <FaCheckCircle className="text-green-500 mx-auto" /> : <FaExclamationTriangle className="text-yellow-500 mx-auto" />}
                        </td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${estadoColor[w.estado]}`}>{w.estado}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => { setSelected(w); setView('detalle') }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FaEye /></button>
                            <button onClick={() => toast('Edición próximamente', { icon: 'ℹ️' })} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><FaEdit /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtrados.length === 0 && <div className="text-center py-12 text-gray-400">No hay trabajadores que coincidan.</div>}
              </div>
            </div>
          </div>
        )}

        {view === 'detalle' && selected && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.nombre}</h2>
                  <p className="text-sm text-gray-500">CC {selected.cedula} · {selected.cargo}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-sm px-3 py-1 rounded-full ${estadoColor[selected.estado]}`}>{selected.estado}</span>
                  <button onClick={() => setView('lista')} className="p-2 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Área', value: selected.area },
                  { label: 'Sede', value: selected.sede },
                  { label: 'Tipo de contrato', value: selected.tipoContrato },
                  { label: 'Fecha de ingreso', value: selected.fechaIngreso },
                  { label: 'ARL', value: selected.arl },
                  { label: 'EPS', value: selected.eps },
                  { label: 'Clase de riesgo', value: `Clase ${selected.riesgo}` },
                  { label: 'Último examen', value: selected.fechaUltimoExamen },
                  { label: 'Examen periódico', value: selected.examenPeriodicoVigente ? 'Vigente ✓' : 'Vencido ✗' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{selected.inducciones}</p>
                  <p className="text-xs text-blue-600 mt-1">Inducciones</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{selected.capacitaciones}</p>
                  <p className="text-xs text-green-600 mt-1">Capacitaciones</p>
                </div>
                <div className={`rounded-xl p-4 text-center ${selected.epp ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-lg font-bold ${selected.epp ? 'text-green-700' : 'text-red-700'}`}>{selected.epp ? '✓' : '✗'}</p>
                  <p className={`text-xs mt-1 ${selected.epp ? 'text-green-600' : 'text-red-600'}`}>EPP {selected.epp ? 'Completo' : 'Incompleto'}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <FaDownload /> Exportar hoja SST
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
