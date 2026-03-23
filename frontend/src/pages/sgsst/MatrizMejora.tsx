import { useState } from 'react'
import {
  FaThumbtack, FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaSave,
  FaFilter, FaDownload, FaChartBar, FaListUl, FaCheckCircle,
  FaClock, FaExclamationCircle, FaSearch, FaCheck,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'lista' | 'nueva' | 'detalle'
type EstadoMejora = 'Pendiente' | 'En ejecución' | 'Completada' | 'Cancelada'
type Prioridad = 'Alta' | 'Media' | 'Baja'
type Fuente = 'Auditoría' | 'Inspección' | 'Diagnóstico SST' | 'Revisión dirección' | 'Indicadores' | 'Sugerencia' | 'Legal' | 'Otro'

interface MejoraSGSST {
  id: number
  codigo: string
  fecha: string
  fuente: Fuente
  proceso: string
  oportunidad: string
  objetivo: string
  actividades: string
  responsable: string
  recurso: string
  fechaInicio: string
  fechaFin: string
  avance: number
  estado: EstadoMejora
  prioridad: Prioridad
  observaciones?: string
}

const initialMejoras: MejoraSGSST[] = [
  { id: 1, codigo: 'OM-001', fecha: '2026-01-05', fuente: 'Auditoría', proceso: 'Gestión SST', oportunidad: 'Fortalecer el programa de vigilancia epidemiológica para trabajadores expuestos a ruido industrial.', objetivo: 'Reducir en un 30% la prevalencia de hipoacusia laboral antes del cierre del periodo.', actividades: 'Realizar audiometrías basales, implementar programa de conservación auditiva, capacitar a los trabajadores.', responsable: 'Médico Laboral', recurso: 'Presupuesto $5.000.000', fechaInicio: '2026-02-01', fechaFin: '2026-06-30', avance: 40, estado: 'En ejecución', prioridad: 'Alta', observaciones: 'Se han realizado las audiometrías basales al 60% del personal expuesto.' },
  { id: 2, codigo: 'OM-002', fecha: '2026-01-10', fuente: 'Diagnóstico SST', proceso: 'Talento Humano', oportunidad: 'Incrementar la cobertura del programa de capacitación en SST para todos los niveles de la organización.', objetivo: 'Alcanzar el 100% de cobertura en capacitación de SST para todos los trabajadores.', actividades: 'Diseñar calendario de capacitaciones, realizar talleres presenciales y virtuales, evaluar aprendizajes.', responsable: 'Coordinador SST', recurso: 'Presupuesto $2.000.000', fechaInicio: '2026-01-15', fechaFin: '2026-12-31', avance: 25, estado: 'En ejecución', prioridad: 'Alta' },
  { id: 3, codigo: 'OM-003', fecha: '2026-01-15', fuente: 'Indicadores', proceso: 'Producción', oportunidad: 'Mejorar el orden y aseo en áreas de producción para reducir incidentes por condiciones locativas.', objetivo: 'Cero incidentes por condiciones locativas en el semestre.', actividades: 'Implementar metodología 5S, asignar responsables por zona, realizar auditorías semanales.', responsable: 'Jefe de Producción', recurso: 'Recursos propios', fechaInicio: '2026-02-01', fechaFin: '2026-07-31', avance: 60, estado: 'En ejecución', prioridad: 'Media' },
  { id: 4, codigo: 'OM-004', fecha: '2026-01-20', fuente: 'Revisión dirección', proceso: 'Gestión SST', oportunidad: 'Automatizar el sistema de reporte e investigación de incidentes para reducir tiempos de respuesta.', objetivo: 'Reducir a menos de 24 horas el tiempo de reporte e investigación inicial de incidentes.', actividades: 'Evaluar plataformas digitales, implementar app de reporte, capacitar al personal.', responsable: 'Coordinador SST', recurso: 'Presupuesto $8.000.000', fechaInicio: '2026-03-01', fechaFin: '2026-09-30', avance: 0, estado: 'Pendiente', prioridad: 'Media' },
  { id: 5, codigo: 'OM-005', fecha: '2026-02-01', fuente: 'Legal', proceso: 'Seguridad Industrial', oportunidad: 'Actualizar el programa de trabajo seguro en alturas conforme a la Resolución 4272 de 2021.', objetivo: 'Cumplir al 100% con los requisitos legales vigentes para trabajo en alturas.', actividades: 'Revisar procedimientos, actualizar permisos de trabajo, certificar trabajadores expuestos.', responsable: 'Coordinador SST', recurso: 'Presupuesto $3.500.000', fechaInicio: '2026-02-15', fechaFin: '2026-05-31', avance: 75, estado: 'En ejecución', prioridad: 'Alta', observaciones: 'Certificación de trabajadores en proceso.' },
  { id: 6, codigo: 'OM-006', fecha: '2026-02-05', fuente: 'Sugerencia', proceso: 'Bienestar', oportunidad: 'Implementar programa de ergonomía integral para reducir las enfermedades laborales de origen osteomuscular.', objetivo: 'Reducir en un 20% las consultas médicas por dolencias osteomusculares.', actividades: 'Evaluar puestos de trabajo, realizar pausas activas, capacitar en higiene postural, ajustar mobiliario.', responsable: 'Fisioterapeuta', recurso: 'Presupuesto $1.500.000', fechaInicio: '2026-03-01', fechaFin: '2026-12-31', avance: 10, estado: 'En ejecución', prioridad: 'Baja' },
  { id: 7, codigo: 'OM-007', fecha: '2026-02-10', fuente: 'Inspección', proceso: 'Logística', oportunidad: 'Establecer protocolo de seguridad para manejo de cargas en bodega para prevenir lesiones.', objetivo: 'Cero accidentes relacionados con manejo manual de cargas durante el año.', actividades: 'Diseñar protocolo, capacitar al personal, instalar señalización y ayudas mecánicas.', responsable: 'Jefe de Logística', recurso: 'Presupuesto $1.200.000', fechaInicio: '2026-03-01', fechaFin: '2026-06-30', avance: 0, estado: 'Pendiente', prioridad: 'Alta' },
  { id: 8, codigo: 'OM-008', fecha: '2026-01-01', fuente: 'Auditoría', proceso: 'Mantenimiento', oportunidad: 'Mejorar el sistema de bloqueo y etiquetado (LOTO) en equipos de mantenimiento.', objetivo: 'Implementar LOTO en el 100% de los equipos identificados como críticos.', actividades: 'Inventariar equipos, comprar candados y etiquetas, capacitar técnicos, documentar procedimiento.', responsable: 'Jefe de Mantenimiento', recurso: 'Presupuesto $2.800.000', fechaInicio: '2025-11-01', fechaFin: '2026-01-31', avance: 100, estado: 'Completada', prioridad: 'Alta', observaciones: 'Implementación completada y verificada.' },
]

const procesos = ['Gestión SST', 'Talento Humano', 'Producción', 'Logística', 'Mantenimiento', 'Bienestar', 'Calidad', 'Seguridad Industrial', 'Administración']
const fuentes: Fuente[] = ['Auditoría', 'Inspección', 'Diagnóstico SST', 'Revisión dirección', 'Indicadores', 'Sugerencia', 'Legal', 'Otro']

const emptyForm = {
  fecha: new Date().toISOString().slice(0, 10),
  fuente: 'Auditoría' as Fuente,
  proceso: '',
  oportunidad: '',
  objetivo: '',
  actividades: '',
  responsable: '',
  recurso: '',
  fechaInicio: '',
  fechaFin: '',
  avance: 0,
  prioridad: 'Media' as Prioridad,
  observaciones: '',
}

export default function MatrizMejora() {
  const [view, setView] = useState<View>('dashboard')
  const [mejoras, setMejoras] = useState<MejoraSGSST[]>(initialMejoras)
  const [selected, setSelected] = useState<MejoraSGSST | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState<number | null>(null)
  const [filterEstado, setFilterEstado] = useState('Todos')
  const [filterPrioridad, setFilterPrioridad] = useState('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const completadas = mejoras.filter(m => m.estado === 'Completada').length
  const enEjecucion = mejoras.filter(m => m.estado === 'En ejecución').length
  const pendientes = mejoras.filter(m => m.estado === 'Pendiente').length
  const avancePromedio = mejoras.length > 0 ? Math.round(mejoras.reduce((s, m) => s + m.avance, 0) / mejoras.length) : 0

  const filtradas = mejoras.filter(m => {
    const matchEstado = filterEstado === 'Todos' || m.estado === filterEstado
    const matchPrio = filterPrioridad === 'Todos' || m.prioridad === filterPrioridad
    const matchSearch = !searchTerm || m.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || m.oportunidad.toLowerCase().includes(searchTerm.toLowerCase()) || m.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    return matchEstado && matchPrio && matchSearch
  })

  const estadoColor: Record<EstadoMejora, string> = {
    'Pendiente': 'bg-gray-100 text-gray-700',
    'En ejecución': 'bg-blue-100 text-blue-700',
    'Completada': 'bg-green-100 text-green-700',
    'Cancelada': 'bg-red-100 text-red-700',
  }

  const prioridadColor: Record<Prioridad, string> = {
    'Alta': 'bg-red-100 text-red-700',
    'Media': 'bg-yellow-100 text-yellow-700',
    'Baja': 'bg-green-100 text-green-700',
  }

  const chartEstados = {
    labels: ['Pendiente', 'En ejecución', 'Completada', 'Cancelada'],
    datasets: [{ data: [pendientes, enEjecucion, completadas, mejoras.filter(m => m.estado === 'Cancelada').length], backgroundColor: ['#9CA3AF', '#3B82F6', '#10B981', '#EF4444'], borderWidth: 0 }],
  }

  const procesosUnicos = [...new Set(mejoras.map(m => m.proceso))].slice(0, 6)
  const chartProcesos = {
    labels: procesosUnicos,
    datasets: [{
      label: 'Oportunidades',
      data: procesosUnicos.map(p => mejoras.filter(m => m.proceso === p).length),
      backgroundColor: '#14B8A6',
      borderRadius: 6,
    }],
  }

  function handleSave() {
    if (!form.proceso || !form.oportunidad || !form.objetivo || !form.responsable || !form.fechaInicio || !form.fechaFin) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editId !== null) {
      setMejoras(prev => prev.map(m => m.id === editId ? { ...m, ...form } : m))
      toast.success('Oportunidad actualizada')
    } else {
      const nueva: MejoraSGSST = {
        id: Date.now(),
        codigo: `OM-${String(mejoras.length + 1).padStart(3, '0')}`,
        ...form,
        estado: 'Pendiente',
      }
      setMejoras(prev => [...prev, nueva])
      toast.success('Oportunidad de mejora registrada')
    }
    setForm({ ...emptyForm })
    setEditId(null)
    setView('lista')
  }

  function handleEdit(m: MejoraSGSST) {
    setForm({ fecha: m.fecha, fuente: m.fuente, proceso: m.proceso, oportunidad: m.oportunidad, objetivo: m.objetivo, actividades: m.actividades, responsable: m.responsable, recurso: m.recurso, fechaInicio: m.fechaInicio, fechaFin: m.fechaFin, avance: m.avance, prioridad: m.prioridad, observaciones: m.observaciones || '' })
    setEditId(m.id)
    setView('nueva')
  }

  function handleDelete(id: number) {
    setMejoras(prev => prev.filter(m => m.id !== id))
    setShowDeleteConfirm(null)
    toast.success('Registro eliminado')
  }

  function handleCompletar(id: number) {
    setMejoras(prev => prev.map(m => m.id === id ? { ...m, estado: 'Completada', avance: 100 } : m))
    toast.success('Oportunidad marcada como completada')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 text-lg">
              <FaThumbtack />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Matriz de Oportunidades de Mejora</h1>
              <p className="text-sm text-gray-500">Seguimiento de oportunidades y planes de mejora del SG-SST</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${view === 'dashboard' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              <FaChartBar /> Dashboard
            </button>
            <button onClick={() => setView('lista')} className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${view === 'lista' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              <FaListUl /> Matriz
            </button>
            <button onClick={() => { setView('nueva'); setEditId(null); setForm({ ...emptyForm }) }} className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">
              <FaPlus /> Nueva Oportunidad
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total Oportunidades</p>
                <p className="text-3xl font-bold text-gray-900">{mejoras.length}</p>
                <p className="text-xs text-gray-400 mt-1">Registradas en el sistema</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaCheckCircle className="text-green-500" /> Completadas</p>
                <p className="text-3xl font-bold text-green-600">{completadas}</p>
                <p className="text-xs text-gray-400 mt-1">{mejoras.length > 0 ? Math.round((completadas / mejoras.length) * 100) : 0}% del total</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaClock className="text-blue-500" /> En ejecución</p>
                <p className="text-3xl font-bold text-blue-600">{enEjecucion}</p>
                <p className="text-xs text-gray-400 mt-1">En seguimiento activo</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaExclamationCircle className="text-teal-500" /> Avance global</p>
                <p className="text-3xl font-bold text-teal-600">{avancePromedio}%</p>
                <p className="text-xs text-gray-400 mt-1">Promedio de ejecución</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Estado de Oportunidades</h3>
                <div className="h-52 flex items-center justify-center">
                  <Doughnut data={chartEstados} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Por Proceso</h3>
                <div className="h-52">
                  <Bar data={chartProcesos} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Avance por Oportunidad</h3>
              <div className="space-y-3">
                {mejoras.slice(0, 6).map(m => (
                  <div key={m.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 truncate flex-1 mr-4">{m.codigo} — {m.oportunidad.slice(0, 60)}...</span>
                      <span className="text-sm font-semibold text-teal-700 shrink-0">{m.avance}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.avance === 100 ? 'bg-green-500' : m.avance >= 50 ? 'bg-teal-500' : 'bg-blue-400'}`} style={{ width: `${m.avance}%` }} />
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
              <div className="flex items-center gap-2 text-sm text-gray-500"><FaFilter className="text-teal-500" /> Filtros:</div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..." className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm w-48 focus:outline-none focus:border-teal-400" />
              </div>
              <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-400">
                <option value="Todos">Todos los estados</option>
                {['Pendiente', 'En ejecución', 'Completada', 'Cancelada'].map(e => <option key={e}>{e}</option>)}
              </select>
              <select value={filterPrioridad} onChange={e => setFilterPrioridad(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-400">
                <option value="Todos">Todas las prioridades</option>
                {['Alta', 'Media', 'Baja'].map(p => <option key={p}>{p}</option>)}
              </select>
              <span className="ml-auto text-sm text-gray-500">{filtradas.length} resultado(s)</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Código', 'Fuente', 'Proceso', 'Oportunidad', 'Responsable', 'Fecha Fin', 'Avance', 'Prioridad', 'Estado', 'Acciones'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtradas.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{m.codigo}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{m.fuente}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">{m.proceso}</td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs"><p className="line-clamp-2 text-xs">{m.oportunidad}</p></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{m.responsable}</td>
                        <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{m.fechaFin}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${m.avance === 100 ? 'bg-green-500' : 'bg-teal-400'}`} style={{ width: `${m.avance}%` }} />
                            </div>
                            <span className="text-xs text-gray-600">{m.avance}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${prioridadColor[m.prioridad]}`}>{m.prioridad}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${estadoColor[m.estado]}`}>{m.estado}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => { setSelected(m); setView('detalle') }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><FaEye /></button>
                            <button onClick={() => handleEdit(m)} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded"><FaEdit /></button>
                            {m.estado !== 'Completada' && <button onClick={() => handleCompletar(m.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Completar"><FaCheck /></button>}
                            {showDeleteConfirm === m.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDelete(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FaCheck /></button>
                                <button onClick={() => setShowDeleteConfirm(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><FaTimes /></button>
                              </div>
                            ) : (
                              <button onClick={() => setShowDeleteConfirm(m.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtradas.length === 0 && <div className="text-center py-12 text-gray-400">No hay registros que coincidan con los filtros.</div>}
              </div>
            </div>
          </div>
        )}

        {view === 'detalle' && selected && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-gray-900">{selected.codigo}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${estadoColor[selected.estado]}`}>{selected.estado}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${prioridadColor[selected.prioridad]}`}>{selected.prioridad}</span>
                  </div>
                  <p className="text-sm text-gray-500">Registrada el {selected.fecha} · Fuente: {selected.fuente}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(selected)} className="flex items-center gap-1 px-3 py-2 text-sm border border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50"><FaEdit /> Editar</button>
                  <button onClick={() => setView('lista')} className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"><FaTimes /> Cerrar</button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Avance de ejecución</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${selected.avance === 100 ? 'bg-green-500' : 'bg-teal-500'}`} style={{ width: `${selected.avance}%` }} />
                  </div>
                  <span className="text-lg font-bold text-teal-700">{selected.avance}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Proceso', value: selected.proceso },
                  { label: 'Responsable', value: selected.responsable },
                  { label: 'Recurso', value: selected.recurso },
                  { label: 'Fecha inicio', value: selected.fechaInicio },
                  { label: 'Fecha fin', value: selected.fechaFin },
                  { label: 'Fuente', value: selected.fuente },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {[
                { label: 'Oportunidad identificada', value: selected.oportunidad },
                { label: 'Objetivo', value: selected.objetivo },
                { label: 'Actividades a desarrollar', value: selected.actividades },
                ...(selected.observaciones ? [{ label: 'Observaciones', value: selected.observaciones }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">{value}</p>
                </div>
              ))}

              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 px-3 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  <FaDownload /> Descargar reporte
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'nueva' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{editId ? 'Editar Oportunidad' : 'Registrar Oportunidad de Mejora'}</h2>
                <button onClick={() => { setView('lista'); setEditId(null); setForm({ ...emptyForm }) }} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { field: 'fuente', label: 'Fuente *', type: 'select', options: fuentes },
                  { field: 'proceso', label: 'Proceso *', type: 'select', options: procesos },
                  { field: 'prioridad', label: 'Prioridad *', type: 'select', options: ['Alta', 'Media', 'Baja'] },
                  { field: 'responsable', label: 'Responsable *', type: 'text', placeholder: 'Nombre del responsable' },
                  { field: 'fechaInicio', label: 'Fecha inicio *', type: 'date' },
                  { field: 'fechaFin', label: 'Fecha fin *', type: 'date' },
                  { field: 'recurso', label: 'Recurso', type: 'text', placeholder: 'Recursos asignados' },
                  { field: 'avance', label: 'Avance (%)', type: 'number' },
                ].map(({ field, label, type, options, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    {type === 'select' ? (
                      <select value={(form as Record<string, string | number>)[field] as string} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400">
                        {field !== 'fuente' && field !== 'prioridad' && <option value="">Seleccionar</option>}
                        {options?.map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={type} value={(form as Record<string, string | number>)[field] as string | number} onChange={e => setForm(f => ({ ...f, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))} placeholder={placeholder} min={type === 'number' ? 0 : undefined} max={type === 'number' ? 100 : undefined} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { field: 'oportunidad', label: 'Oportunidad identificada *', placeholder: 'Describa la oportunidad de mejora...' },
                  { field: 'objetivo', label: 'Objetivo *', placeholder: 'Describa el objetivo...' },
                  { field: 'actividades', label: 'Actividades a desarrollar *', placeholder: 'Liste las actividades...' },
                  { field: 'observaciones', label: 'Observaciones', placeholder: 'Observaciones adicionales...' },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <textarea value={(form as Record<string, string | number>)[field] as string} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} rows={2} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-400 resize-none" />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => { setView('lista'); setEditId(null); setForm({ ...emptyForm }) }} className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                  <FaSave /> {editId ? 'Actualizar' : 'Registrar Mejora'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
