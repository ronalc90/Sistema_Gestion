import { useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  FaHandshake,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaClipboardList,
  FaDownload,
} from 'react-icons/fa'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'lista' | 'detalle' | 'nueva'

type EstadoContratista = 'Activo' | 'Inactivo' | 'Suspendido' | 'En evaluación'
type TipoServicio =
  | 'Construcción'
  | 'Mantenimiento'
  | 'Consultoría'
  | 'Logística'
  | 'Limpieza'
  | 'Vigilancia'
  | 'Tecnología'
  | 'Otro'

interface DocumentoContratista {
  nombre: string
  estado: 'Vigente' | 'Vencido' | 'Pendiente'
  fechaVencimiento: string
}

interface Contratista {
  id: number
  nit: string
  razonSocial: string
  representante: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  tipoServicio: TipoServicio
  estado: EstadoContratista
  arl: string
  polizaRC: string
  fechaInicioContrato: string
  fechaFinContrato: string
  sede: string
  personalActivo: number
  nivelRiesgo: 'Bajo' | 'Medio' | 'Alto'
  calificacion: number
  documentos: DocumentoContratista[]
  observaciones: string
}

const mockContratistas: Contratista[] = [
  {
    id: 1,
    nit: '900.123.456-7',
    razonSocial: 'Constructora Andina S.A.S',
    representante: 'Carlos Méndez',
    telefono: '310 456 7890',
    email: 'carlos@constructoraandina.com',
    direccion: 'Cra 15 # 80-45',
    ciudad: 'Bogotá',
    tipoServicio: 'Construcción',
    estado: 'Activo',
    arl: 'Sura',
    polizaRC: 'POL-2024-0012',
    fechaInicioContrato: '2024-01-15',
    fechaFinContrato: '2026-01-14',
    sede: 'Sede Principal',
    personalActivo: 12,
    nivelRiesgo: 'Alto',
    calificacion: 4.2,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-06-30' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Certificado ARL', estado: 'Vigente', fechaVencimiento: '2025-09-15' },
    ],
    observaciones: 'Contratista con experiencia en obras civiles de alto riesgo.',
  },
  {
    id: 2,
    nit: '800.987.654-3',
    razonSocial: 'Servicios Técnicos Industriales Ltda',
    representante: 'Ana Gómez',
    telefono: '315 789 0123',
    email: 'ana@servtecind.com',
    direccion: 'Av 30 # 25-67',
    ciudad: 'Medellín',
    tipoServicio: 'Mantenimiento',
    estado: 'Activo',
    arl: 'Positiva',
    polizaRC: 'POL-2024-0089',
    fechaInicioContrato: '2024-03-01',
    fechaFinContrato: '2025-02-28',
    sede: 'Planta Norte',
    personalActivo: 5,
    nivelRiesgo: 'Medio',
    calificacion: 3.8,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vencido', fechaVencimiento: '2024-12-31' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-02-28' },
      { nombre: 'Certificado ARL', estado: 'Pendiente', fechaVencimiento: '-' },
    ],
    observaciones: 'Pendiente renovar cámara de comercio y certificado ARL.',
  },
  {
    id: 3,
    nit: '901.234.567-8',
    razonSocial: 'Vigilancia y Seguridad ProTech S.A',
    representante: 'Luis Torres',
    telefono: '320 111 2233',
    email: 'ltorres@protech.com',
    direccion: 'Cll 100 # 15-20',
    ciudad: 'Cali',
    tipoServicio: 'Vigilancia',
    estado: 'Activo',
    arl: 'Colmena',
    polizaRC: 'POL-2025-0003',
    fechaInicioContrato: '2025-01-01',
    fechaFinContrato: '2025-12-31',
    sede: 'Todas las sedes',
    personalActivo: 20,
    nivelRiesgo: 'Medio',
    calificacion: 4.5,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-09-30' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Certificado ARL', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Licencia Vigilancia', estado: 'Vigente', fechaVencimiento: '2026-06-30' },
    ],
    observaciones: 'Empresa de vigilancia con supervisión 24/7.',
  },
  {
    id: 4,
    nit: '700.456.789-1',
    razonSocial: 'Aseo Industrial del Valle S.A.S',
    representante: 'María Ruiz',
    telefono: '312 345 6789',
    email: 'mruiz@aseoindustrial.com',
    direccion: 'Cra 8 # 12-34',
    ciudad: 'Barranquilla',
    tipoServicio: 'Limpieza',
    estado: 'Suspendido',
    arl: 'Sura',
    polizaRC: 'POL-2023-0115',
    fechaInicioContrato: '2023-06-01',
    fechaFinContrato: '2024-05-31',
    sede: 'Sede Sur',
    personalActivo: 0,
    nivelRiesgo: 'Bajo',
    calificacion: 2.9,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vencido', fechaVencimiento: '2024-05-31' },
      { nombre: 'Póliza RC', estado: 'Vencido', fechaVencimiento: '2024-05-31' },
      { nombre: 'Certificado ARL', estado: 'Vencido', fechaVencimiento: '2024-05-31' },
    ],
    observaciones: 'Contrato suspendido por incumplimiento en SST.',
  },
  {
    id: 5,
    nit: '860.123.987-5',
    razonSocial: 'TechSoft Consultoría S.A.S',
    representante: 'Pedro Vargas',
    telefono: '317 654 3210',
    email: 'pedro@techsoft.co',
    direccion: 'Av El Dorado # 68-45',
    ciudad: 'Bogotá',
    tipoServicio: 'Tecnología',
    estado: 'En evaluación',
    arl: 'Liberty',
    polizaRC: 'POL-2025-0044',
    fechaInicioContrato: '2025-02-01',
    fechaFinContrato: '2025-07-31',
    sede: 'Sede Principal',
    personalActivo: 3,
    nivelRiesgo: 'Bajo',
    calificacion: 0,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Póliza RC', estado: 'Pendiente', fechaVencimiento: '-' },
      { nombre: 'Certificado ARL', estado: 'Pendiente', fechaVencimiento: '-' },
    ],
    observaciones: 'Nuevo contratista en proceso de homologación SST.',
  },
  {
    id: 6,
    nit: '830.456.123-9',
    razonSocial: 'Logística Express Colombia S.A',
    representante: 'Sandra Moreno',
    telefono: '301 987 6543',
    email: 'smoreno@logexpress.com',
    direccion: 'Zona Industrial Calle 13 # 82-40',
    ciudad: 'Bogotá',
    tipoServicio: 'Logística',
    estado: 'Activo',
    arl: 'AXA Colpatria',
    polizaRC: 'POL-2024-0199',
    fechaInicioContrato: '2024-07-01',
    fechaFinContrato: '2026-06-30',
    sede: 'Centro Distribución',
    personalActivo: 8,
    nivelRiesgo: 'Alto',
    calificacion: 4.0,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-10-31' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-06-30' },
      { nombre: 'Certificado ARL', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'SOAT Vehículos', estado: 'Vigente', fechaVencimiento: '2025-08-15' },
    ],
    observaciones: 'Maneja transporte de carga pesada — riesgo vial alto.',
  },
]

const estadoColor: Record<EstadoContratista, string> = {
  Activo: 'bg-green-100 text-green-800',
  Inactivo: 'bg-gray-100 text-gray-700',
  Suspendido: 'bg-red-100 text-red-800',
  'En evaluación': 'bg-yellow-100 text-yellow-800',
}

const riesgoColor: Record<string, string> = {
  Bajo: 'bg-green-100 text-green-700',
  Medio: 'bg-yellow-100 text-yellow-700',
  Alto: 'bg-red-100 text-red-700',
}

const docEstadoColor: Record<string, string> = {
  Vigente: 'text-green-600',
  Vencido: 'text-red-600',
  Pendiente: 'text-yellow-600',
}

const docEstadoIcon: Record<string, JSX.Element> = {
  Vigente: <FaCheckCircle className="text-green-500" />,
  Vencido: <FaTimesCircle className="text-red-500" />,
  Pendiente: <FaExclamationTriangle className="text-yellow-500" />,
}

const emptyForm: Omit<Contratista, 'id' | 'documentos'> = {
  nit: '',
  razonSocial: '',
  representante: '',
  telefono: '',
  email: '',
  direccion: '',
  ciudad: '',
  tipoServicio: 'Mantenimiento',
  estado: 'En evaluación',
  arl: '',
  polizaRC: '',
  fechaInicioContrato: '',
  fechaFinContrato: '',
  sede: '',
  personalActivo: 0,
  nivelRiesgo: 'Bajo',
  calificacion: 0,
  observaciones: '',
}

export default function ContratistasSST() {
  const [view, setView] = useState<View>('dashboard')
  const [contratistas, setContratistas] = useState<Contratista[]>(mockContratistas)
  const [selected, setSelected] = useState<Contratista | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('Todos')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // KPIs
  const totalActivos = contratistas.filter(c => c.estado === 'Activo').length
  const totalPersonal = contratistas.reduce((s, c) => s + c.personalActivo, 0)
  const docsVencidos = contratistas.reduce(
    (s, c) => s + c.documentos.filter(d => d.estado === 'Vencido').length,
    0
  )
  const enEvaluacion = contratistas.filter(c => c.estado === 'En evaluación').length

  // Charts
  const estadoCounts = ['Activo', 'Inactivo', 'Suspendido', 'En evaluación'].map(
    e => contratistas.filter(c => c.estado === e).length
  )
  const doughnutData = {
    labels: ['Activo', 'Inactivo', 'Suspendido', 'En evaluación'],
    datasets: [
      {
        data: estadoCounts,
        backgroundColor: ['#10b981', '#6b7280', '#ef4444', '#f59e0b'],
      },
    ],
  }

  const tipoLabels: TipoServicio[] = [
    'Construcción',
    'Mantenimiento',
    'Consultoría',
    'Logística',
    'Limpieza',
    'Vigilancia',
    'Tecnología',
    'Otro',
  ]
  const tipoCounts = tipoLabels.map(t => contratistas.filter(c => c.tipoServicio === t).length)
  const barData = {
    labels: tipoLabels,
    datasets: [
      {
        label: 'Contratistas',
        data: tipoCounts,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  }

  const filtered = contratistas.filter(c => {
    const matchSearch =
      c.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
      c.nit.includes(search) ||
      c.representante.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'Todos' || c.estado === filtroEstado
    const matchTipo = filtroTipo === 'Todos' || c.tipoServicio === filtroTipo
    return matchSearch && matchEstado && matchTipo
  })

  function handleNew() {
    setForm(emptyForm)
    setEditId(null)
    setView('nueva')
  }

  function handleEdit(c: Contratista) {
    const { documentos: _d, id: _i, ...rest } = c
    setForm(rest)
    setEditId(c.id)
    setView('nueva')
  }

  function handleSave() {
    if (!form.nit || !form.razonSocial || !form.representante) {
      toast.error('NIT, razón social y representante son obligatorios')
      return
    }
    if (editId !== null) {
      setContratistas(prev =>
        prev.map(c =>
          c.id === editId ? { ...c, ...form } : c
        )
      )
      toast.success('Contratista actualizado')
    } else {
      const nuevo: Contratista = {
        id: Date.now(),
        ...form,
        documentos: [],
      }
      setContratistas(prev => [...prev, nuevo])
      toast.success('Contratista registrado')
    }
    setView('lista')
  }

  function handleDelete(id: number) {
    setContratistas(prev => prev.filter(c => c.id !== id))
    setConfirmDelete(null)
    if (selected?.id === id) setView('lista')
    toast.success('Contratista eliminado')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {view !== 'dashboard' && (
            <button
              onClick={() => setView(view === 'detalle' ? 'lista' : 'dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft />
            </button>
          )}
          <div className="bg-blue-100 p-3 rounded-xl">
            <FaHandshake className="text-blue-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Contratistas SST</h1>
            <p className="text-sm text-gray-500">Gestión y homologación de contratistas</p>
          </div>
        </div>
        <div className="flex gap-2">
          {view === 'dashboard' && (
            <button
              onClick={() => setView('lista')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FaClipboardList /> Ver todos
            </button>
          )}
          {view === 'lista' && (
            <button
              onClick={handleNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <FaPlus /> Nuevo
            </button>
          )}
        </div>
      </div>

      {/* Nav tabs */}
      {view === 'dashboard' || view === 'lista' ? (
        <div className="flex gap-2 mb-6">
          {(['dashboard', 'lista'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                view === v ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {v === 'dashboard' ? 'Dashboard' : 'Listado'}
            </button>
          ))}
        </div>
      ) : null}

      {/* ===== DASHBOARD ===== */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Contratistas activos', value: totalActivos, color: 'green', icon: <FaHandshake /> },
              { label: 'Personal en sitio', value: totalPersonal, color: 'blue', icon: <FaUser /> },
              { label: 'Docs vencidos', value: docsVencidos, color: 'red', icon: <FaFileAlt /> },
              { label: 'En evaluación', value: enEvaluacion, color: 'yellow', icon: <FaShieldAlt /> },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className={`text-${k.color}-500 text-xl mb-2`}>{k.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{k.value}</div>
                <div className="text-xs text-gray-500">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-4">Estado de contratistas</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-4">Contratistas por tipo de servicio</h3>
              <div className="h-56">
                <Bar
                  data={barData}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
          </div>

          {/* Alertas documentos vencidos */}
          {docsVencidos > 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> Alertas de documentos vencidos/pendientes
              </h3>
              <div className="space-y-2">
                {contratistas.map(c =>
                  c.documentos
                    .filter(d => d.estado !== 'Vigente')
                    .map((d, i) => (
                      <div
                        key={`${c.id}-${i}`}
                        className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-2 text-sm"
                      >
                        <span className="font-medium text-gray-700">{c.razonSocial}</span>
                        <span className="text-gray-600">{d.nombre}</span>
                        <span className={`font-semibold ${docEstadoColor[d.estado]}`}>{d.estado}</span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== LISTA ===== */}
      {view === 'lista' && (
        <div className="space-y-4">
          {/* Filtros */}
          <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <FaSearch className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por razón social, NIT..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {['Todos', 'Activo', 'Inactivo', 'Suspendido', 'En evaluación'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <select
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {['Todos', 'Construcción', 'Mantenimiento', 'Consultoría', 'Logística', 'Limpieza', 'Vigilancia', 'Tecnología', 'Otro'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500 self-center">{filtered.length} resultado(s)</span>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Razón Social / NIT</th>
                  <th className="px-4 py-3 text-left">Servicio</th>
                  <th className="px-4 py-3 text-left">Representante</th>
                  <th className="px-4 py-3 text-center">Personal</th>
                  <th className="px-4 py-3 text-center">Riesgo</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-center">Docs</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(c => {
                  const docOk = c.documentos.filter(d => d.estado === 'Vigente').length
                  const docTotal = c.documentos.length
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{c.razonSocial}</div>
                        <div className="text-xs text-gray-400">{c.nit}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.tipoServicio}</td>
                      <td className="px-4 py-3 text-gray-600">{c.representante}</td>
                      <td className="px-4 py-3 text-center font-semibold text-blue-700">{c.personalActivo}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${riesgoColor[c.nivelRiesgo]}`}>
                          {c.nivelRiesgo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[c.estado]}`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`text-xs font-semibold ${
                            docOk === docTotal ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {docOk}/{docTotal}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => { setSelected(c); setView('detalle') }}
                            className="text-blue-500 hover:text-blue-700"
                            title="Ver detalle"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(c)}
                            className="text-yellow-500 hover:text-yellow-700"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(c.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">No se encontraron contratistas</div>
            )}
          </div>
        </div>
      )}

      {/* ===== DETALLE ===== */}
      {view === 'detalle' && selected && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.razonSocial}</h2>
                <p className="text-gray-500 text-sm">NIT: {selected.nit}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoColor[selected.estado]}`}>
                  {selected.estado}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${riesgoColor[selected.nivelRiesgo]}`}>
                  Riesgo {selected.nivelRiesgo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FaUser className="text-blue-400" />
                <div><span className="text-gray-400">Representante:</span> {selected.representante}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaPhone className="text-blue-400" />
                <div><span className="text-gray-400">Teléfono:</span> {selected.telefono}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaEnvelope className="text-blue-400" />
                <div><span className="text-gray-400">Email:</span> {selected.email}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaBuilding className="text-blue-400" />
                <div><span className="text-gray-400">Ciudad:</span> {selected.ciudad}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaShieldAlt className="text-blue-400" />
                <div><span className="text-gray-400">ARL:</span> {selected.arl}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaFileAlt className="text-blue-400" />
                <div><span className="text-gray-400">Póliza RC:</span> {selected.polizaRC}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="text-blue-400" />
                <div><span className="text-gray-400">Contrato:</span> {selected.fechaInicioContrato} → {selected.fechaFinContrato}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaUser className="text-blue-400" />
                <div><span className="text-gray-400">Personal activo:</span> {selected.personalActivo}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaBuilding className="text-blue-400" />
                <div><span className="text-gray-400">Sede:</span> {selected.sede}</div>
              </div>
            </div>

            {selected.observaciones && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <strong>Observaciones:</strong> {selected.observaciones}
              </div>
            )}
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-blue-500" /> Documentos requeridos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selected.documentos.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {docEstadoIcon[d.estado]}
                    <span className="text-sm font-medium text-gray-700">{d.nombre}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${docEstadoColor[d.estado]}`}>{d.estado}</div>
                    {d.fechaVencimiento !== '-' && (
                      <div className="text-xs text-gray-400">Vence: {d.fechaVencimiento}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(selected)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600"
            >
              <FaEdit /> Editar
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200">
              <FaDownload /> Exportar
            </button>
          </div>
        </div>
      )}

      {/* ===== FORMULARIO ===== */}
      {view === 'nueva' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            {editId ? 'Editar contratista' : 'Nuevo contratista'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'NIT', key: 'nit' },
              { label: 'Razón Social', key: 'razonSocial' },
              { label: 'Representante Legal', key: 'representante' },
              { label: 'Teléfono', key: 'telefono' },
              { label: 'Email', key: 'email' },
              { label: 'Dirección', key: 'direccion' },
              { label: 'Ciudad', key: 'ciudad' },
              { label: 'ARL', key: 'arl' },
              { label: 'Póliza RC', key: 'polizaRC' },
              { label: 'Sede asignada', key: 'sede' },
              { label: 'Personal activo', key: 'personalActivo', type: 'number' },
              { label: 'Calificación (0-5)', key: 'calificacion', type: 'number' },
              { label: 'Fecha inicio contrato', key: 'fechaInicioContrato', type: 'date' },
              { label: 'Fecha fin contrato', key: 'fechaFinContrato', type: 'date' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={(form as any)[f.key]}
                  onChange={e =>
                    setForm(p => ({
                      ...p,
                      [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo de servicio</label>
              <select
                value={form.tipoServicio}
                onChange={e => setForm(p => ({ ...p, tipoServicio: e.target.value as TipoServicio }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Construcción', 'Mantenimiento', 'Consultoría', 'Logística', 'Limpieza', 'Vigilancia', 'Tecnología', 'Otro'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <select
                value={form.estado}
                onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoContratista }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Activo', 'Inactivo', 'Suspendido', 'En evaluación'].map(o => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Nivel de riesgo</label>
              <select
                value={form.nivelRiesgo}
                onChange={e => setForm(p => ({ ...p, nivelRiesgo: e.target.value as 'Bajo' | 'Medio' | 'Alto' }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Bajo', 'Medio', 'Alto'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Observaciones</label>
              <textarea
                value={form.observaciones}
                onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editId ? 'Actualizar' : 'Guardar'}
            </button>
            <button
              onClick={() => setView('lista')}
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-96">
            <h3 className="font-bold text-gray-800 mb-2">¿Eliminar contratista?</h3>
            <p className="text-sm text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
