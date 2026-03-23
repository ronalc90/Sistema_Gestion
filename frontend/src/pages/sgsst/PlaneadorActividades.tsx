import { useState, useEffect } from 'react'
import { 
  FaCalendar, FaFilter, FaChartBar, FaTable, FaPlus, FaEdit, FaTrash, 
  FaSearch, FaDownload, FaUpload, FaFileCsv, FaFileExcel, FaPrint,
  FaChevronLeft, FaChevronRight, FaCalendarDay, FaCalendarWeek, 
  FaClipboardList, FaUserFriends, FaMoneyBill, FaClock, FaCheckCircle,
  FaExclamationTriangle, FaChartPie, FaChartLine, FaEllipsisV,
  faUser
} from 'react-icons/fa'
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler
)

type TabType = 'estadistica' | 'filtro' | 'resumen' | 'reportes'
type VistaType = 'tabla' | 'mensual' | 'agenda' | 'participantes'
type PrioridadType = 'Baja' | 'Media' | 'Alta' | 'Urgente'
type EstadoType = 'Planeado' | 'EnProceso' | 'Reprogramado' | 'Finalizada' | 'Cancelada'
type ModalidadType = 'Presencial' | 'Virtual' | 'Combinada'

interface Actividad {
  id: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  tipoEvento: string
  programa: string
  tematica: string
  prioridad: PrioridadType
  estado: EstadoType
  modalidad: ModalidadType
  responsable: string
  contratista?: string
  empleadoContratista?: string
  categoria1: string
  categoria2: string
  categoria3: string
  sede: string
  participantes: number
  asistentes: number
  presupuestoAsignado: number
  presupuestoEjecutado: number
  cobertura: number
}

const mockActividades: Actividad[] = [
  {
    id: '1',
    nombre: 'Capacitación en Trabajo en Alturas',
    fechaInicio: '2024-01-15',
    fechaFin: '2024-01-15',
    tipoEvento: 'Capacitación',
    programa: 'Programa de trabajo en alturas',
    tematica: 'Trabajos en alturas',
    prioridad: 'Alta',
    estado: 'Finalizada',
    modalidad: 'Presencial',
    responsable: 'Juan Pérez',
    categoria1: 'Nacional',
    categoria2: 'Sedes Administrativas',
    categoria3: 'UEN CPP',
    sede: 'Sede Principal',
    participantes: 25,
    asistentes: 23,
    presupuestoAsignado: 5000000,
    presupuestoEjecutado: 4800000,
    cobertura: 92
  },
  {
    id: '2',
    nombre: 'Simulacro de Evacuación',
    fechaInicio: '2024-02-20',
    fechaFin: '2024-02-20',
    tipoEvento: 'Simulacros de emergencia',
    programa: 'Plan de atención y respuesta ante emergencias',
    tematica: 'Plan de Emergencia',
    prioridad: 'Urgente',
    estado: 'Planeado',
    modalidad: 'Presencial',
    responsable: 'María García',
    categoria1: 'Nacional',
    categoria2: 'Obras',
    categoria3: 'DEI',
    sede: 'Sede Norte',
    participantes: 50,
    asistentes: 0,
    presupuestoAsignado: 3000000,
    presupuestoEjecutado: 0,
    cobertura: 0
  },
  {
    id: '3',
    nombre: 'Inspección de EPP',
    fechaInicio: '2024-01-10',
    fechaFin: '2024-01-12',
    tipoEvento: 'Inspección y listas de chequeo',
    programa: 'Programa de Inspecciones',
    tematica: 'EPPs',
    prioridad: 'Media',
    estado: 'Finalizada',
    modalidad: 'Presencial',
    responsable: 'Carlos López',
    categoria1: 'Regional Antioquia',
    categoria2: 'Sedes ABR',
    categoria3: 'UEN CPP',
    sede: 'Sede Sur',
    participantes: 15,
    asistentes: 15,
    presupuestoAsignado: 1500000,
    presupuestoEjecutado: 1450000,
    cobertura: 100
  },
  {
    id: '4',
    nombre: 'Charla de Seguridad Vial',
    fechaInicio: '2024-03-05',
    fechaFin: '2024-03-05',
    tipoEvento: 'Charlas',
    programa: 'PESV',
    tematica: 'Seguridad Vial',
    prioridad: 'Baja',
    estado: 'EnProceso',
    modalidad: 'Virtual',
    responsable: 'Ana Rodríguez',
    categoria1: 'Nacional',
    categoria2: 'Sedes Administrativas',
    categoria3: 'DEI',
    sede: 'Sede Principal',
    participantes: 100,
    asistentes: 45,
    presupuestoAsignado: 2000000,
    presupuestoEjecutado: 800000,
    cobertura: 45
  },
  {
    id: '5',
    nombre: 'Evaluación de Riesgo Químico',
    fechaInicio: '2024-01-25',
    fechaFin: '2024-01-30',
    tipoEvento: 'Identificación riesgos',
    programa: 'Programa Riesgo Químico',
    tematica: 'Químicos',
    prioridad: 'Alta',
    estado: 'Finalizada',
    modalidad: 'Presencial',
    responsable: 'Pedro Martínez',
    categoria1: 'Regional Caribe',
    categoria2: 'Obras',
    categoria3: 'UEN CPP',
    sede: 'Sede Caribe',
    participantes: 10,
    asistentes: 10,
    presupuestoAsignado: 8000000,
    presupuestoEjecutado: 7800000,
    cobertura: 100
  }
]

const tiposEvento = [
  'Identificación riesgos', 'Estandarización', 'Fichas de conocimiento básico',
  'Reuniones', 'Capacitación, entrenamiento y certificación', 'Carnetización',
  'Control de riesgos/infraestructura', 'Inspección y listas de chequeo',
  'Inspección y listas de chequeo COVID-19', 'Preoperacionales',
  'Señalización y delimitación', 'Gestión incidentes/accidentes',
  'Simulacros de emergencia', 'Gestión de indicadores', 'ACPM',
  'Lecciones aprendidas', 'Charlas', 'Mediciones de higiene',
  'Dotación/ EPPs', 'Permisos de trabajo', 'Exámenes Médicos',
  'Inducción y Reinducción', 'Caracterización de incidentes', 'SIGSTO',
  'EASYFACE', 'Protocolo de Bioseguridad'
]

const programas = [
  'Programa de trabajo en alturas', 'Programa Riesgo Químico', 'Programa Riesgo eléctrico',
  'Programa para Equipos y maquinaria', 'Programa para excavaciones y espacios confinados',
  'Programa Orden y aseo', 'Programa de Inspecciones', 'Programa de Auditoria',
  'Procedimiento de investigación de incidentes', 'Procedimiento de indicadores de gestión',
  'PESV', 'SVE - Riesgo Musculo-Esqueletico', 'SVE - Riesgo Psicosocial',
  'SVE - Auditivo', 'SVE- Respiratorio', 'Medicina del trabajo', 'SG-SST',
  'Plan de atención y respuesta ante emergencias', 'PAPSO'
]

const tematicas = [
  'Orden y aseo', 'Trabajos en alturas', 'Químicos', 'Maquinaria y equipo',
  'Herramientas manuales y de potencia', 'Eléctrico', 'Excavaciones', 'Ergonómico',
  'Ruido', 'Vibraciones', 'EPPs', 'Autocuidado', 'Riesgo biológico',
  'Riesgo psicosocial', 'Objetivos y metas', 'Medicina del trabajo', 'Inventario',
  'Incidentes, Accidentes', 'Recursos', 'Documentación', 'Programas TAR',
  'COVID-19', 'Identificación de Peligros y Riesgos', 'Plan de Emergencia',
  'SG-SST', 'Seguridad Vial'
]

const categorias1 = ['Nacional', 'Regional Antioquia', 'Regional Centro', 'Regional Caribe']
const categorias2 = ['Sedes Administrativas', 'Sedes ABR', 'Obras', 'Salas de Negocios']
const categorias3 = ['UEN CPP', 'DEI']

export default function PlaneadorActividades() {
  // Estados
  const [activeTab, setActiveTab] = useState<TabType>('estadistica')
  const [vistaActual, setVistaActual] = useState<VistaType>('tabla')
  const [actividades, setActividades] = useState<Actividad[]>(mockActividades)
  const [actividadesFiltradas, setActividadesFiltradas] = useState<Actividad[]>(mockActividades)
  const [loading, setLoading] = useState(false)
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    fechaInicioDesde: '',
    fechaInicioHasta: '',
    fechaFinDesde: '',
    fechaFinHasta: '',
    tipoEvento: '',
    programa: '',
    tematica: '',
    prioridad: '',
    estado: '',
    modalidad: '',
    responsable: '',
    contratista: '',
    empleadoContratista: '',
    categoria1: '',
    categoria2: '',
    categoria3: '',
    sede: ''
  })
  
  // Estados de modal
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formActividad, setFormActividad] = useState<Partial<Actividad>>({
    prioridad: 'Media',
    estado: 'Planeado',
    modalidad: 'Presencial'
  })
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Estados de calendario
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // Calcular estadísticas
  const stats = {
    total: actividades.length,
    finalizadas: actividades.filter(a => a.estado === 'Finalizada').length,
    enProceso: actividades.filter(a => a.estado === 'EnProceso').length,
    planeadas: actividades.filter(a => a.estado === 'Planeado').length,
    altaPrioridad: actividades.filter(a => a.prioridad === 'Alta' || a.prioridad === 'Urgente').length,
    coberturaPromedio: actividades.length > 0 
      ? Math.round(actividades.reduce((acc, a) => acc + a.cobertura, 0) / actividades.length)
      : 0
  }
  
  // Filtrar actividades
  const aplicarFiltros = () => {
    setLoading(true)
    setTimeout(() => {
      let filtradas = [...actividades]
      
      if (filtros.fechaInicioDesde) {
        filtradas = filtradas.filter(a => a.fechaInicio >= filtros.fechaInicioDesde)
      }
      if (filtros.fechaInicioHasta) {
        filtradas = filtradas.filter(a => a.fechaInicio <= filtros.fechaInicioHasta)
      }
      if (filtros.tipoEvento) {
        filtradas = filtradas.filter(a => a.tipoEvento === filtros.tipoEvento)
      }
      if (filtros.programa) {
        filtradas = filtradas.filter(a => a.programa === filtros.programa)
      }
      if (filtros.tematica) {
        filtradas = filtradas.filter(a => a.tematica === filtros.tematica)
      }
      if (filtros.prioridad) {
        filtradas = filtradas.filter(a => a.prioridad === filtros.prioridad)
      }
      if (filtros.estado) {
        filtradas = filtradas.filter(a => a.estado === filtros.estado)
      }
      if (filtros.modalidad) {
        filtradas = filtradas.filter(a => a.modalidad === filtros.modalidad)
      }
      if (filtros.responsable) {
        filtradas = filtradas.filter(a => a.responsable.toLowerCase().includes(filtros.responsable.toLowerCase()))
      }
      if (filtros.categoria1) {
        filtradas = filtradas.filter(a => a.categoria1 === filtros.categoria1)
      }
      if (filtros.categoria2) {
        filtradas = filtradas.filter(a => a.categoria2 === filtros.categoria2)
      }
      if (filtros.categoria3) {
        filtradas = filtradas.filter(a => a.categoria3 === filtros.categoria3)
      }
      if (filtros.sede) {
        filtradas = filtradas.filter(a => a.sede.toLowerCase().includes(filtros.sede.toLowerCase()))
      }
      
      setActividadesFiltradas(filtradas)
      setCurrentPage(1)
      setLoading(false)
      
      if (filtradas.length === 0) {
        toast.info('No se encontraron actividades con los filtros seleccionados')
      }
    }, 500)
  }
  
  const limpiarFiltros = () => {
    setFiltros({
      fechaInicioDesde: '',
      fechaInicioHasta: '',
      fechaFinDesde: '',
      fechaFinHasta: '',
      tipoEvento: '',
      programa: '',
      tematica: '',
      prioridad: '',
      estado: '',
      modalidad: '',
      responsable: '',
      contratista: '',
      empleadoContratista: '',
      categoria1: '',
      categoria2: '',
      categoria3: '',
      sede: ''
    })
    setActividadesFiltradas(actividades)
    toast.success('Filtros limpiados')
  }
  
  // CRUD
  const handleGuardarActividad = () => {
    if (!formActividad.nombre || !formActividad.fechaInicio) {
      toast.error('Nombre y fecha de inicio son requeridos')
      return
    }
    
    if (editingId) {
      setActividades(prev => prev.map(a => a.id === editingId ? { ...a, ...formActividad } as Actividad : a))
      toast.success('Actividad actualizada')
    } else {
      const nueva: Actividad = {
        ...formActividad as Actividad,
        id: Date.now().toString(),
        participantes: 0,
        asistentes: 0,
        presupuestoAsignado: 0,
        presupuestoEjecutado: 0,
        cobertura: 0
      }
      setActividades(prev => [...prev, nueva])
      toast.success('Actividad creada')
    }
    setShowModal(false)
    setEditingId(null)
    setFormActividad({ prioridad: 'Media', estado: 'Planeado', modalidad: 'Presencial' })
  }
  
  const handleEliminar = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta actividad?')) {
      setActividades(prev => prev.filter(a => a.id !== id))
      toast.success('Actividad eliminada')
    }
  }
  
  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = actividadesFiltradas.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(actividadesFiltradas.length / itemsPerPage)
  
  // Gráficos
  const dataPrioridad = {
    labels: ['Baja', 'Media', 'Alta', 'Urgente'],
    datasets: [{
      data: [
        actividades.filter(a => a.prioridad === 'Baja').length,
        actividades.filter(a => a.prioridad === 'Media').length,
        actividades.filter(a => a.prioridad === 'Alta').length,
        actividades.filter(a => a.prioridad === 'Urgente').length
      ],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
    }]
  }
  
  const dataEstado = {
    labels: ['Planeado', 'En Proceso', 'Reprogramado', 'Finalizada', 'Cancelada'],
    datasets: [{
      data: [
        actividades.filter(a => a.estado === 'Planeado').length,
        actividades.filter(a => a.estado === 'EnProceso').length,
        actividades.filter(a => a.estado === 'Reprogramado').length,
        actividades.filter(a => a.estado === 'Finalizada').length,
        actividades.filter(a => a.estado === 'Cancelada').length
      ],
      backgroundColor: ['#6b7280', '#3b82f6', '#f59e0b', '#10b981', '#ef4444']
    }]
  }
  
  const dataPHVA = {
    labels: ['Planear', 'Hacer', 'Verificar', 'Actuar'],
    datasets: [{
      label: 'Actividades',
      data: [
        actividades.filter(a => a.programa.includes('Plan') || a.tipoEvento.includes('planeación')).length,
        actividades.filter(a => a.estado === 'EnProceso' || a.estado === 'Finalizada').length,
        actividades.filter(a => a.tipoEvento.includes('Inspección') || a.tipoEvento.includes('Auditoría')).length,
        actividades.filter(a => a.tipoEvento.includes('mejora') || a.tipoEvento.includes('ACPM')).length
      ],
      backgroundColor: '#3b82f6'
    }]
  }
  
  // Helpers
  const getPrioridadColor = (prioridad: PrioridadType) => {
    const colors = {
      'Baja': 'bg-green-100 text-green-800',
      'Media': 'bg-blue-100 text-blue-800',
      'Alta': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-100 text-red-800'
    }
    return colors[prioridad] || 'bg-gray-100'
  }
  
  const getEstadoColor = (estado: EstadoType) => {
    const colors = {
      'Planeado': 'bg-gray-100 text-gray-800',
      'EnProceso': 'bg-blue-100 text-blue-800',
      'Reprogramado': 'bg-yellow-100 text-yellow-800',
      'Finalizada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    }
    return colors[estado] || 'bg-gray-100'
  }
  
  // Renderizado de calendario
  const renderCalendario = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const days = []
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800/50" />)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const actividadesDia = actividadesFiltradas.filter(a => a.fechaInicio === dateStr)
      
      days.push(
        <div key={day} className="h-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 overflow-hidden">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{day}</span>
          {actividadesDia.map((a, idx) => (
            <div key={idx} className={`text-xs mt-1 p-1 rounded truncate ${getPrioridadColor(a.prioridad)}`}>
              {a.nombre}
            </div>
          ))}
        </div>
      )
    }
    
    return days
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FaCalendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Actividades: Menú planeador de actividades</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gestión integral de actividades SG-SST</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus />
              Nueva Actividad
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6">
          {[
            { id: 'estadistica', label: 'Estadística rápida', icon: FaChartBar },
            { id: 'filtro', label: 'Filtro específico', icon: FaFilter },
            { id: 'resumen', label: 'Resumen actividades', icon: FaClipboardList },
            { id: 'reportes', label: 'Reportes e informes', icon: FaChartPie }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Contenido según tab */}
      {activeTab === 'estadistica' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Actividades</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Finalizadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.finalizadas}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">En Proceso</p>
              <p className="text-2xl font-bold text-blue-600">{stats.enProceso}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Planeadas</p>
              <p className="text-2xl font-bold text-gray-600">{stats.planeadas}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Alta Prioridad</p>
              <p className="text-2xl font-bold text-red-600">{stats.altaPrioridad}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Cobertura Prom.</p>
              <p className="text-2xl font-bold text-purple-600">{stats.coberturaPromedio}%</p>
            </div>
          </div>
          
          {/* Tablas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Actividades mes actual */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Actividades mes actual</h3>
              </div>
              <div className="p-4">
                {currentItems.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Nombre</th>
                        <th className="text-left py-2">Estado</th>
                        <th className="text-right py-2">Cobertura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.slice(0, 5).map((a) => (
                        <tr key={a.id} className="border-b last:border-0">
                          <td className="py-2 text-gray-700 dark:text-gray-300">{a.nombre}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded text-xs ${getEstadoColor(a.estado)}`}>
                              {a.estado}
                            </span>
                          </td>
                          <td className="py-2 text-right">{a.cobertura}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center text-gray-500 py-8">No hay datos en la tabla</p>
                )}
              </div>
            </div>
            
            {/* Gráficos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Indicador de cumplimiento mes actual</h3>
              {actividades.length > 0 ? (
                <div className="h-48">
                  <Doughnut data={dataEstado} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No hay datos para el gráfico</p>
              )}
            </div>
          </div>
          
          {/* Más gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Prioridad de actividades</h3>
              {actividades.length > 0 ? (
                <div className="h-48">
                  <Pie data={dataPrioridad} options={{ maintainAspectRatio: false }} />
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No hay datos para el gráfico</p>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cantidad de actividades PHVA</h3>
              {actividades.length > 0 ? (
                <div className="h-48">
                  <Bar data={dataPHVA} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No hay datos para el gráfico</p>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cobertura vs Participantes</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Población objeto</span>
                    <span className="font-medium">{actividades.reduce((acc, a) => acc + a.participantes, 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cantidad asistentes</span>
                    <span className="font-medium">{actividades.reduce((acc, a) => acc + a.asistentes, 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.coberturaPromedio}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Porc. cobertura</span>
                    <span className="font-medium">{stats.coberturaPromedio}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${stats.coberturaPromedio}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'filtro' && (
        <div className="space-y-6">
          {/* Panel de filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FaFilter />
                Filtros de búsqueda
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={limpiarFiltros} className="btn-secondary text-sm">
                  Limpiar
                </button>
                <button onClick={aplicarFiltros} className="btn-primary text-sm flex items-center gap-2">
                  <FaSearch />
                  Buscar
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fechas */}
              <div>
                <label className="form-label text-xs">Fecha INICIO desde</label>
                <input
                  type="date"
                  className="form-input"
                  value={filtros.fechaInicioDesde}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicioDesde: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Fecha INICIO hasta</label>
                <input
                  type="date"
                  className="form-input"
                  value={filtros.fechaInicioHasta}
                  onChange={(e) => setFiltros({ ...filtros, fechaInicioHasta: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Fecha FIN desde</label>
                <input
                  type="date"
                  className="form-input"
                  value={filtros.fechaFinDesde}
                  onChange={(e) => setFiltros({ ...filtros, fechaFinDesde: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label text-xs">Fecha FIN hasta</label>
                <input
                  type="date"
                  className="form-input"
                  value={filtros.fechaFinHasta}
                  onChange={(e) => setFiltros({ ...filtros, fechaFinHasta: e.target.value })}
                />
              </div>
              
              {/* Tipo evento */}
              <div>
                <label className="form-label text-xs">Tipo de evento</label>
                <select
                  className="form-select"
                  value={filtros.tipoEvento}
                  onChange={(e) => setFiltros({ ...filtros, tipoEvento: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              {/* Programa */}
              <div>
                <label className="form-label text-xs">Programa que interviene</label>
                <select
                  className="form-select"
                  value={filtros.programa}
                  onChange={(e) => setFiltros({ ...filtros, programa: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {programas.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              {/* Temática */}
              <div>
                <label className="form-label text-xs">Temática</label>
                <select
                  className="form-select"
                  value={filtros.tematica}
                  onChange={(e) => setFiltros({ ...filtros, tematica: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {tematicas.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              {/* Prioridad */}
              <div>
                <label className="form-label text-xs">Prioridad</label>
                <select
                  className="form-select"
                  value={filtros.prioridad}
                  onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              
              {/* Estado */}
              <div>
                <label className="form-label text-xs">Estado</label>
                <select
                  className="form-select"
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  <option value="Planeado">Planeado</option>
                  <option value="EnProceso">En Proceso</option>
                  <option value="Reprogramado">Reprogramado</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              
              {/* Modalidad */}
              <div>
                <label className="form-label text-xs">Modalidad</label>
                <select
                  className="form-select"
                  value={filtros.modalidad}
                  onChange={(e) => setFiltros({ ...filtros, modalidad: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Combinada">Combinada</option>
                </select>
              </div>
              
              {/* Responsable */}
              <div>
                <label className="form-label text-xs">Responsable</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar..."
                  value={filtros.responsable}
                  onChange={(e) => setFiltros({ ...filtros, responsable: e.target.value })}
                />
              </div>
              
              {/* Categorías */}
              <div>
                <label className="form-label text-xs">Categoría 1 (mayor nivel)</label>
                <select
                  className="form-select"
                  value={filtros.categoria1}
                  onChange={(e) => setFiltros({ ...filtros, categoria1: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {categorias1.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label text-xs">Categoría 2 (nivel intermedio)</label>
                <select
                  className="form-select"
                  value={filtros.categoria2}
                  onChange={(e) => setFiltros({ ...filtros, categoria2: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {categorias2.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label text-xs">Categoría 3 (nivel inferior)</label>
                <select
                  className="form-select"
                  value={filtros.categoria3}
                  onChange={(e) => setFiltros({ ...filtros, categoria3: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {categorias3.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              {/* Sede */}
              <div>
                <label className="form-label text-xs">Sede</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Buscar sede..."
                  value={filtros.sede}
                  onChange={(e) => setFiltros({ ...filtros, sede: e.target.value })}
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Recuerde:</strong> Los filtros por categoría requieren que se haya ingresado el dato de sede en el registro o datos de origen
              </p>
            </div>
          </div>
          
          {/* Mensaje si no hay resultados */}
          {actividadesFiltradas.length === 0 && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <FaSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Sin resultados. Debe indicar el nivel de filtro deseado en la parte superior y hacer clic sobre el botón Buscar para continuar.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Presione Buscar sin seleccionar ningún filtro para presentar todos los datos.
              </p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-4">
              {/* Selector de vista */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de vista:</span>
                <select
                  className="form-select text-sm"
                  value={vistaActual}
                  onChange={(e) => setVistaActual(e.target.value as VistaType)}
                >
                  <option value="tabla">Tabla de datos de registros</option>
                  <option value="mensual">Planeador mensual de actividades</option>
                  <option value="agenda">Vista de agenda por día</option>
                  <option value="participantes">Tabla de actividades y participantes</option>
                </select>
              </div>
              
              {/* Items por página */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mostrando</span>
                <select
                  className="form-select text-sm w-20"
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">resultados por página</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="btn-secondary text-sm flex items-center gap-2">
                <FaFileCsv />
                CSV
              </button>
              <button className="btn-secondary text-sm flex items-center gap-2">
                <FaFileExcel />
                Excel
              </button>
              <button className="btn-secondary text-sm flex items-center gap-2">
                <FaPrint />
                Imprimir
              </button>
            </div>
          </div>
          
          {/* Contenido según vista */}
          {vistaActual === 'tabla' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Fechas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Programa</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Prioridad</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Cobertura</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentItems.map((actividad) => (
                      <tr key={actividad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-white">{actividad.nombre}</p>
                          <p className="text-xs text-gray-500">{actividad.sede}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          <div className="text-xs">{actividad.fechaInicio}</div>
                          <div className="text-xs">{actividad.fechaFin}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{actividad.tipoEvento}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs max-w-xs truncate">{actividad.programa}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getPrioridadColor(actividad.prioridad)}`}>
                            {actividad.prioridad}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(actividad.estado)}`}>
                            {actividad.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${actividad.cobertura >= 80 ? 'bg-green-500' : actividad.cobertura >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${actividad.cobertura}%` }}
                              />
                            </div>
                            <span className="text-xs">{actividad.cobertura}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingId(actividad.id)
                                setFormActividad(actividad)
                                setShowModal(true)
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEliminar(actividad.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Total registros encontrados: {actividadesFiltradas.length}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Primero
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Previo
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded ${currentPage === page ? 'bg-green-600 text-white' : 'border hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {vistaActual === 'mensual' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FaCalendar />
                  {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="px-3 py-1 text-sm bg-gray-100 rounded"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                  <div key={dia} className="bg-gray-50 dark:bg-gray-900 p-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400">
                    {dia}
                  </div>
                ))}
                {renderCalendario()}
              </div>
            </div>
          )}
          
          {vistaActual === 'agenda' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Vista de Agenda por Día</h3>
              <div className="space-y-4">
                {actividadesFiltradas.slice(0, 7).map((actividad, idx) => (
                  <div key={actividad.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex flex-col items-center min-w-[80px]">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{15 + idx}</span>
                      <span className="text-xs text-gray-500">Enero</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{actividad.nombre}</h4>
                      <p className="text-sm text-gray-500">{actividad.tipoEvento} • {actividad.sede}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${getPrioridadColor(actividad.prioridad)}`}>
                          {actividad.prioridad}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getEstadoColor(actividad.estado)}`}>
                          {actividad.estado}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{actividad.responsable}</p>
                      <p className="text-xs text-gray-500">{actividad.participantes} participantes</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {vistaActual === 'participantes' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">Actividad</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Población Objeto</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Asistentes</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">Cobertura %</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">Presupuesto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((actividad) => (
                    <tr key={actividad.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-white">{actividad.nombre}</p>
                        <p className="text-xs text-gray-500">{actividad.tematica}</p>
                      </td>
                      <td className="px-4 py-3 text-center">{actividad.participantes}</td>
                      <td className="px-4 py-3 text-center">{actividad.asistentes}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`${actividad.cobertura >= 80 ? 'text-green-600' : actividad.cobertura >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {actividad.cobertura}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-xs text-gray-600">Asig: ${actividad.presupuestoAsignado.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">Eje: ${actividad.presupuestoEjecutado.toLocaleString()}</p>
                        <div className="w-full h-1 bg-gray-200 rounded mt-1">
                          <div
                            className="h-1 bg-blue-500 rounded"
                            style={{ width: `${(actividad.presupuestoEjecutado / actividad.presupuestoAsignado) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Modal de Actividad */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Editar Actividad' : 'Nueva Actividad'}
              </h3>
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setFormActividad({ prioridad: 'Media', estado: 'Planeado', modalidad: 'Presencial' }) }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="form-label">Nombre de la actividad *</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={formActividad.nombre || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, nombre: e.target.value })}
                  placeholder="Ingrese el nombre de la actividad"
                />
              </div>
              
              <div>
                <label className="form-label">Fecha inicio *</label>
                <input
                  type="date"
                  className="form-input w-full"
                  value={formActividad.fechaInicio || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, fechaInicio: e.target.value })}
                />
              </div>
              
              <div>
                <label className="form-label">Fecha fin</label>
                <input
                  type="date"
                  className="form-input w-full"
                  value={formActividad.fechaFin || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, fechaFin: e.target.value })}
                />
              </div>
              
              <div>
                <label className="form-label">Tipo de evento</label>
                <select
                  className="form-select w-full"
                  value={formActividad.tipoEvento || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, tipoEvento: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label">Programa</label>
                <select
                  className="form-select w-full"
                  value={formActividad.programa || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, programa: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {programas.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label">Temática</label>
                <select
                  className="form-select w-full"
                  value={formActividad.tematica || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, tematica: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {tematicas.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label">Prioridad</label>
                <select
                  className="form-select w-full"
                  value={formActividad.prioridad || 'Media'}
                  onChange={(e) => setFormActividad({ ...formActividad, prioridad: e.target.value as PrioridadType })}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Estado</label>
                <select
                  className="form-select w-full"
                  value={formActividad.estado || 'Planeado'}
                  onChange={(e) => setFormActividad({ ...formActividad, estado: e.target.value as EstadoType })}
                >
                  <option value="Planeado">Planeado</option>
                  <option value="EnProceso">En Proceso</option>
                  <option value="Reprogramado">Reprogramado</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Modalidad</label>
                <select
                  className="form-select w-full"
                  value={formActividad.modalidad || 'Presencial'}
                  onChange={(e) => setFormActividad({ ...formActividad, modalidad: e.target.value as ModalidadType })}
                >
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Combinada">Combinada</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Responsable</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={formActividad.responsable || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, responsable: e.target.value })}
                  placeholder="Nombre del responsable"
                />
              </div>
              
              <div>
                <label className="form-label">Sede</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={formActividad.sede || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, sede: e.target.value })}
                  placeholder="Nombre de la sede"
                />
              </div>
              
              <div>
                <label className="form-label">Categoría 1</label>
                <select
                  className="form-select w-full"
                  value={formActividad.categoria1 || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, categoria1: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {categorias1.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label">Categoría 2</label>
                <select
                  className="form-select w-full"
                  value={formActividad.categoria2 || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, categoria2: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {categorias2.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div>
                <label className="form-label">Categoría 3</label>
                <select
                  className="form-select w-full"
                  value={formActividad.categoria3 || ''}
                  onChange={(e) => setFormActividad({ ...formActividad, categoria3: e.target.value })}
                >
                  <option value="">Seleccione uno</option>
                  {categorias3.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setShowModal(false); setEditingId(null); setFormActividad({ prioridad: 'Media', estado: 'Planeado', modalidad: 'Presencial' }) }}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button onClick={handleGuardarActividad} className="btn-primary flex items-center gap-2">
                <FaCheckCircle />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
