import { useState } from 'react'
import {
  FaPen, FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes,
  FaSave, FaFilter, FaDownload, FaExclamationTriangle, FaCheckCircle,
  FaClock, FaClipboardList, FaChartBar, FaSearch,
} from 'react-icons/fa'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'lista' | 'nueva' | 'detalle'
type TipoAccion = 'Correctiva' | 'Preventiva' | 'De mejora'
type EstadoAccion = 'Abierta' | 'En proceso' | 'Cerrada' | 'Vencida'
type Prioridad = 'Alta' | 'Media' | 'Baja'

interface AccionCorrectiva {
  id: number
  codigo: string
  tipo: TipoAccion
  fecha: string
  origen: string
  descripcionHallazgo: string
  analisisCausa: string
  accionPropuesta: string
  responsable: string
  area: string
  sede: string
  fechaLimite: string
  fechaCierre?: string
  estado: EstadoAccion
  prioridad: Prioridad
  eficacia?: string
  evidencias: number
  verificadoPor?: string
}

const initialAcciones: AccionCorrectiva[] = [
  { id: 1, codigo: 'AC-001', tipo: 'Correctiva', fecha: '2026-01-10', origen: 'Auditoría interna', descripcionHallazgo: 'No se evidencia el registro de capacitaciones del personal en temas de SST durante el último trimestre.', analisisCausa: 'Falta de seguimiento al cronograma de capacitaciones y ausencia de responsable directo del registro.', accionPropuesta: 'Designar responsable de seguimiento, actualizar el cronograma y registrar todas las capacitaciones realizadas en el sistema.', responsable: 'Coordinador SST', area: 'Recursos Humanos', sede: 'Sede Principal', fechaLimite: '2026-02-28', fechaCierre: '2026-02-20', estado: 'Cerrada', prioridad: 'Alta', eficacia: 'Efectiva', evidencias: 3, verificadoPor: 'Director SST' },
  { id: 2, codigo: 'AC-002', tipo: 'Correctiva', fecha: '2026-01-15', origen: 'Inspección de seguridad', descripcionHallazgo: 'Detectada falta de señalización de emergencias en el tercer piso del edificio administrativo.', analisisCausa: 'Señales deterioradas por humedad no fueron reemplazadas oportunamente.', accionPropuesta: 'Adquisición e instalación inmediata de señales nuevas resistentes a la humedad.', responsable: 'Jefe de Mantenimiento', area: 'Mantenimiento', sede: 'Sede Principal', fechaLimite: '2026-02-15', fechaCierre: '2026-02-10', estado: 'Cerrada', prioridad: 'Alta', eficacia: 'Efectiva', evidencias: 2, verificadoPor: 'Coordinador SST' },
  { id: 3, codigo: 'AC-003', tipo: 'Preventiva', fecha: '2026-01-20', origen: 'Análisis de riesgos', descripcionHallazgo: 'Identificado riesgo alto de caída en área de bodegas por ausencia de barandas en plataforma elevada.', analisisCausa: 'La plataforma fue instalada sin cumplir los estándares de trabajo en alturas.', accionPropuesta: 'Instalación de barandas certificadas y anclajes de seguridad en toda la plataforma.', responsable: 'Jefe de Producción', area: 'Producción', sede: 'Sede Norte', fechaLimite: '2026-03-31', estado: 'En proceso', prioridad: 'Alta', evidencias: 1 },
  { id: 4, codigo: 'AC-004', tipo: 'De mejora', fecha: '2026-02-01', origen: 'Sugerencia del trabajador', descripcionHallazgo: 'Los trabajadores reportan incomodidad y molestias en espalda por sillas inadecuadas en área de digitación.', analisisCausa: 'Las sillas actuales no cumplen con criterios ergonómicos para trabajo prolongado en computador.', accionPropuesta: 'Adquisición de sillas ergonómicas certificadas para el 100% del personal de digitación.', responsable: 'Recursos Humanos', area: 'Administración', sede: 'Sede Principal', fechaLimite: '2026-04-30', estado: 'Abierta', prioridad: 'Media', evidencias: 0 },
  { id: 5, codigo: 'AC-005', tipo: 'Correctiva', fecha: '2026-02-05', origen: 'Accidente de trabajo', descripcionHallazgo: 'Trabajador sufrió quemadura de primer grado por contacto con superficie caliente sin señalizar.', analisisCausa: 'Equipo de proceso sin señalización de advertencia de temperatura, ausencia de EPP térmico en zona.', accionPropuesta: 'Señalizar todos los equipos calientes, dotar al personal de guantes térmicos y capacitar en manejo seguro.', responsable: 'Coordinador SST', area: 'Producción', sede: 'Sede Sur', fechaLimite: '2026-02-20', estado: 'Vencida', prioridad: 'Alta', evidencias: 2 },
  { id: 6, codigo: 'AC-006', tipo: 'Preventiva', fecha: '2026-02-10', origen: 'Revisión por la dirección', descripcionHallazgo: 'La empresa no cuenta con un programa documentado de mantenimiento preventivo de equipos críticos.', analisisCausa: 'No existe procedimiento formal para el mantenimiento preventivo, se trabaja únicamente de forma reactiva.', accionPropuesta: 'Elaborar e implementar el programa de mantenimiento preventivo con cronograma anual.', responsable: 'Jefe de Mantenimiento', area: 'Mantenimiento', sede: 'Todas', fechaLimite: '2026-05-31', estado: 'En proceso', prioridad: 'Media', evidencias: 1 },
  { id: 7, codigo: 'AC-007', tipo: 'De mejora', fecha: '2026-02-15', origen: 'Auditoría externa', descripcionHallazgo: 'El sistema de gestión no cuenta con indicadores de seguimiento actualizados ni mediciones en los últimos 6 meses.', analisisCausa: 'No se ha designado responsable para el seguimiento y medición de indicadores SST.', accionPropuesta: 'Designar responsable, definir frecuencia de medición y actualizar todos los indicadores del sistema.', responsable: 'Coordinador SST', area: 'SST', sede: 'Sede Principal', fechaLimite: '2026-03-31', estado: 'En proceso', prioridad: 'Alta', evidencias: 0 },
]

const origenes = ['Auditoría interna', 'Auditoría externa', 'Inspección de seguridad', 'Accidente de trabajo', 'Incidente', 'Análisis de riesgos', 'Revisión por la dirección', 'Sugerencia del trabajador', 'Requisito legal', 'Otro']
const areas = ['SST', 'Producción', 'Administración', 'Mantenimiento', 'Recursos Humanos', 'Logística', 'Calidad', 'Todas']
const sedes = ['Sede Principal', 'Sede Norte', 'Sede Sur', 'Todas']

const emptyForm = {
  tipo: 'Correctiva' as TipoAccion,
  fecha: new Date().toISOString().slice(0, 10),
  origen: '',
  descripcionHallazgo: '',
  analisisCausa: '',
  accionPropuesta: '',
  responsable: '',
  area: '',
  sede: '',
  fechaLimite: '',
  prioridad: 'Media' as Prioridad,
}

export default function AccionesCorrectivas() {
  const [view, setView] = useState<View>('dashboard')
  const [acciones, setAcciones] = useState<AccionCorrectiva[]>(initialAcciones)
  const [selected, setSelected] = useState<AccionCorrectiva | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [editId, setEditId] = useState<number | null>(null)
  const [filterEstado, setFilterEstado] = useState<string>('Todos')
  const [filterTipo, setFilterTipo] = useState<string>('Todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const total = acciones.length
  const cerradas = acciones.filter(a => a.estado === 'Cerrada').length
  const enProceso = acciones.filter(a => a.estado === 'En proceso').length
  const vencidas = acciones.filter(a => a.estado === 'Vencida').length
  const abiertas = acciones.filter(a => a.estado === 'Abierta').length

  const filtradas = acciones.filter(a => {
    const matchEstado = filterEstado === 'Todos' || a.estado === filterEstado
    const matchTipo = filterTipo === 'Todos' || a.tipo === filterTipo
    const matchSearch = !searchTerm || a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || a.descripcionHallazgo.toLowerCase().includes(searchTerm.toLowerCase()) || a.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    return matchEstado && matchTipo && matchSearch
  })

  const estadoColor: Record<EstadoAccion, string> = {
    'Abierta': 'bg-blue-100 text-blue-800',
    'En proceso': 'bg-yellow-100 text-yellow-800',
    'Cerrada': 'bg-green-100 text-green-800',
    'Vencida': 'bg-red-100 text-red-800',
  }

  const prioridadColor: Record<Prioridad, string> = {
    'Alta': 'bg-red-100 text-red-700',
    'Media': 'bg-yellow-100 text-yellow-700',
    'Baja': 'bg-green-100 text-green-700',
  }

  const tipoColor: Record<TipoAccion, string> = {
    'Correctiva': 'bg-orange-100 text-orange-700',
    'Preventiva': 'bg-blue-100 text-blue-700',
    'De mejora': 'bg-teal-100 text-teal-700',
  }

  const chartEstados = {
    labels: ['Abiertas', 'En proceso', 'Cerradas', 'Vencidas'],
    datasets: [{ data: [abiertas, enProceso, cerradas, vencidas], backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'], borderWidth: 0 }],
  }

  const chartTipos = {
    labels: ['Correctivas', 'Preventivas', 'De mejora'],
    datasets: [{
      label: 'Acciones',
      data: [acciones.filter(a => a.tipo === 'Correctiva').length, acciones.filter(a => a.tipo === 'Preventiva').length, acciones.filter(a => a.tipo === 'De mejora').length],
      backgroundColor: ['#F97316', '#3B82F6', '#14B8A6'],
      borderRadius: 6,
    }],
  }

  function handleSave() {
    if (!form.origen || !form.descripcionHallazgo || !form.accionPropuesta || !form.responsable || !form.area || !form.sede || !form.fechaLimite) {
      toast.error('Complete todos los campos obligatorios')
      return
    }
    if (editId !== null) {
      setAcciones(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a))
      toast.success('Acción actualizada')
    } else {
      const newAccion: AccionCorrectiva = {
        id: Date.now(),
        codigo: `AC-${String(acciones.length + 1).padStart(3, '0')}`,
        ...form,
        estado: 'Abierta',
        evidencias: 0,
      }
      setAcciones(prev => [...prev, newAccion])
      toast.success('Acción registrada')
    }
    setForm({ ...emptyForm })
    setEditId(null)
    setView('lista')
  }

  function handleEdit(a: AccionCorrectiva) {
    setForm({ tipo: a.tipo, fecha: a.fecha, origen: a.origen, descripcionHallazgo: a.descripcionHallazgo, analisisCausa: a.analisisCausa, accionPropuesta: a.accionPropuesta, responsable: a.responsable, area: a.area, sede: a.sede, fechaLimite: a.fechaLimite, prioridad: a.prioridad })
    setEditId(a.id)
    setView('nueva')
  }

  function handleDelete(id: number) {
    setAcciones(prev => prev.filter(a => a.id !== id))
    setShowDeleteConfirm(null)
    toast.success('Acción eliminada')
  }

  function handleCerrar(id: number) {
    setAcciones(prev => prev.map(a => a.id === id ? { ...a, estado: 'Cerrada', fechaCierre: new Date().toISOString().slice(0, 10) } : a))
    toast.success('Acción cerrada')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-lg">
              <FaPen />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Acciones Correctivas, Preventivas y de Mejora</h1>
              <p className="text-sm text-gray-500">Gestión y seguimiento de ACPM del SG-SST</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView('dashboard')} className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${view === 'dashboard' ? 'bg-orange-50 border-orange-300 text-orange-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              <FaChartBar /> Dashboard
            </button>
            <button onClick={() => setView('lista')} className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${view === 'lista' ? 'bg-orange-50 border-orange-300 text-orange-700' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              <FaClipboardList /> Lista
            </button>
            <button onClick={() => { setView('nueva'); setEditId(null); setForm({ ...emptyForm }) }} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <FaPlus /> Nueva Acción
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total ACPM</p>
                <p className="text-3xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-400 mt-1">Acciones registradas</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaCheckCircle className="text-green-500" /> Cerradas</p>
                <p className="text-3xl font-bold text-green-600">{cerradas}</p>
                <p className="text-xs text-gray-400 mt-1">{total > 0 ? Math.round((cerradas / total) * 100) : 0}% completadas</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaClock className="text-yellow-500" /> En proceso</p>
                <p className="text-3xl font-bold text-yellow-600">{enProceso}</p>
                <p className="text-xs text-gray-400 mt-1">En seguimiento activo</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1"><FaExclamationTriangle className="text-red-500" /> Vencidas</p>
                <p className="text-3xl font-bold text-red-600">{vencidas}</p>
                <p className="text-xs text-gray-400 mt-1">Requieren atención</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Estado de Acciones</h3>
                <div className="h-52 flex items-center justify-center">
                  <Doughnut data={chartEstados} options={{ plugins: { legend: { position: 'bottom' } }, maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Acciones por Tipo</h3>
                <div className="h-52">
                  <Bar data={chartTipos} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Acciones recientes</h3>
                <button onClick={() => setView('lista')} className="text-sm text-orange-600 hover:underline">Ver todas</button>
              </div>
              <div className="divide-y divide-gray-50">
                {acciones.slice(0, 5).map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-mono font-semibold text-gray-700 shrink-0">{a.codigo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${tipoColor[a.tipo]}`}>{a.tipo}</span>
                      <span className="text-sm text-gray-600 truncate">{a.descripcionHallazgo}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-4 ${estadoColor[a.estado]}`}>{a.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LISTA */}
        {view === 'lista' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500"><FaFilter className="text-orange-500" /> Filtros:</div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..." className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm w-48 focus:outline-none focus:border-orange-400" />
              </div>
              <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400">
                <option value="Todos">Todos los estados</option>
                {['Abierta', 'En proceso', 'Cerrada', 'Vencida'].map(e => <option key={e}>{e}</option>)}
              </select>
              <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400">
                <option value="Todos">Todos los tipos</option>
                {['Correctiva', 'Preventiva', 'De mejora'].map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="ml-auto text-sm text-gray-500">{filtradas.length} resultado(s)</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Código', 'Tipo', 'Origen', 'Hallazgo', 'Responsable', 'Fecha Límite', 'Prioridad', 'Estado', 'Acciones'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtradas.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{a.codigo}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${tipoColor[a.tipo]}`}>{a.tipo}</span></td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{a.origen}</td>
                        <td className="px-4 py-3 text-gray-800 max-w-xs"><p className="line-clamp-2 text-xs">{a.descripcionHallazgo}</p></td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{a.responsable}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{a.fechaLimite}</td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${prioridadColor[a.prioridad]}`}>{a.prioridad}</span></td>
                        <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${estadoColor[a.estado]}`}>{a.estado}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => { setSelected(a); setView('detalle') }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Ver"><FaEye /></button>
                            <button onClick={() => handleEdit(a)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Editar"><FaEdit /></button>
                            {a.estado !== 'Cerrada' && <button onClick={() => handleCerrar(a.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Cerrar acción"><FaCheck /></button>}
                            {showDeleteConfirm === a.id ? (
                              <div className="flex gap-1">
                                <button onClick={() => handleDelete(a.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><FaCheck /></button>
                                <button onClick={() => setShowDeleteConfirm(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><FaTimes /></button>
                              </div>
                            ) : (
                              <button onClick={() => setShowDeleteConfirm(a.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Eliminar"><FaTrash /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtradas.length === 0 && (
                  <div className="text-center py-12 text-gray-400">No hay acciones que coincidan con los filtros.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DETALLE */}
        {view === 'detalle' && selected && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-gray-900">{selected.codigo}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${tipoColor[selected.tipo]}`}>{selected.tipo}</span>
                    <span className={`text-sm px-3 py-1 rounded-full ${estadoColor[selected.estado]}`}>{selected.estado}</span>
                  </div>
                  <p className="text-sm text-gray-500">Registrada el {selected.fecha} · Origen: {selected.origen}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(selected)} className="flex items-center gap-1 px-3 py-2 text-sm border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50"><FaEdit /> Editar</button>
                  <button onClick={() => setView('lista')} className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"><FaTimes /> Cerrar</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Responsable', value: selected.responsable },
                  { label: 'Área', value: selected.area },
                  { label: 'Sede', value: selected.sede },
                  { label: 'Prioridad', value: selected.prioridad },
                  { label: 'Fecha límite', value: selected.fechaLimite },
                  { label: 'Fecha cierre', value: selected.fechaCierre || '—' },
                  { label: 'Verificado por', value: selected.verificadoPor || '—' },
                  { label: 'Eficacia', value: selected.eficacia || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {[
                { label: 'Descripción del hallazgo', value: selected.descripcionHallazgo },
                { label: 'Análisis de causa raíz', value: selected.analisisCausa },
                { label: 'Acción propuesta', value: selected.accionPropuesta },
              ].map(({ label, value }) => (
                <div key={label} className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3">{value}</p>
                </div>
              ))}

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">{selected.evidencias} evidencia(s) adjunta(s)</span>
                <button className="ml-auto flex items-center gap-2 px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  <FaDownload /> Descargar reporte
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FORM */}
        {view === 'nueva' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{editId ? 'Editar Acción' : 'Registrar Nueva ACPM'}</h2>
                <button onClick={() => { setView('lista'); setEditId(null); setForm({ ...emptyForm }) }} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de Acción *</label>
                  <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as TipoAccion }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    {['Correctiva', 'Preventiva', 'De mejora'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prioridad *</label>
                  <select value={form.prioridad} onChange={e => setForm(f => ({ ...f, prioridad: e.target.value as Prioridad }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    {['Alta', 'Media', 'Baja'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha de registro *</label>
                  <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha límite *</label>
                  <input type="date" value={form.fechaLimite} onChange={e => setForm(f => ({ ...f, fechaLimite: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Origen *</label>
                  <select value={form.origen} onChange={e => setForm(f => ({ ...f, origen: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    <option value="">Seleccionar origen</option>
                    {origenes.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Responsable *</label>
                  <input value={form.responsable} onChange={e => setForm(f => ({ ...f, responsable: e.target.value }))} placeholder="Nombre del responsable" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Área *</label>
                  <select value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    <option value="">Seleccionar área</option>
                    {areas.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Sede *</label>
                  <select value={form.sede} onChange={e => setForm(f => ({ ...f, sede: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                    <option value="">Seleccionar sede</option>
                    {sedes.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción del hallazgo *</label>
                  <textarea value={form.descripcionHallazgo} onChange={e => setForm(f => ({ ...f, descripcionHallazgo: e.target.value }))} rows={3} placeholder="Describa el hallazgo o no conformidad detectada..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Análisis de causa raíz</label>
                  <textarea value={form.analisisCausa} onChange={e => setForm(f => ({ ...f, analisisCausa: e.target.value }))} rows={3} placeholder="Describa las causas raíz identificadas..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Acción propuesta *</label>
                  <textarea value={form.accionPropuesta} onChange={e => setForm(f => ({ ...f, accionPropuesta: e.target.value }))} rows={3} placeholder="Describa la acción a implementar para eliminar la causa raíz..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => { setView('lista'); setEditId(null); setForm({ ...emptyForm }) }} className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  <FaSave /> {editId ? 'Actualizar' : 'Registrar Acción'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
