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
  FaUnlockAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaDoorOpen,
  FaIdCard,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaExclamationTriangle,
  FaBuilding,
  FaShieldAlt,
} from 'react-icons/fa'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'lista' | 'registros' | 'nueva'

type EstadoZona = 'Activa' | 'Inactiva' | 'Mantenimiento'
type NivelAcceso = 'Público' | 'Restringido' | 'Confidencial' | 'Crítico'
type TipoControl = 'Tarjeta RFID' | 'Biométrico' | 'PIN' | 'Llave' | 'Guardia' | 'Combinado'

interface RegistroAcceso {
  id: number
  fecha: string
  hora: string
  persona: string
  tipo: 'Empleado' | 'Contratista' | 'Visitante'
  accion: 'Entrada' | 'Salida' | 'Acceso denegado'
  metodo: string
}

interface ZonaControlada {
  id: number
  codigo: string
  nombre: string
  descripcion: string
  sede: string
  edificio: string
  piso: string
  nivelAcceso: NivelAcceso
  tipoControl: TipoControl
  estado: EstadoZona
  responsable: string
  capacidadMaxima: number
  ocupacionActual: number
  horarioAcceso: string
  requerimientoEPP: string[]
  permisosRequeridos: string[]
  registros: RegistroAcceso[]
}

const mockRegistros = (zonaId: number): RegistroAcceso[] => [
  {
    id: zonaId * 100 + 1,
    fecha: '2026-03-23',
    hora: '08:05',
    persona: 'Carlos Rodríguez',
    tipo: 'Empleado',
    accion: 'Entrada',
    metodo: 'Tarjeta RFID',
  },
  {
    id: zonaId * 100 + 2,
    fecha: '2026-03-23',
    hora: '08:47',
    persona: 'Ana Gómez',
    tipo: 'Contratista',
    accion: 'Entrada',
    metodo: 'Guardia',
  },
  {
    id: zonaId * 100 + 3,
    fecha: '2026-03-23',
    hora: '09:15',
    persona: 'Juan Pérez',
    tipo: 'Visitante',
    accion: 'Acceso denegado',
    metodo: 'Tarjeta RFID',
  },
  {
    id: zonaId * 100 + 4,
    fecha: '2026-03-22',
    hora: '17:30',
    persona: 'Carlos Rodríguez',
    tipo: 'Empleado',
    accion: 'Salida',
    metodo: 'Tarjeta RFID',
  },
]

const mockZonas: ZonaControlada[] = [
  {
    id: 1,
    codigo: 'ZC-001',
    nombre: 'Sala de Servidores',
    descripcion: 'Centro de datos principal con equipos críticos de TI',
    sede: 'Sede Principal',
    edificio: 'Torre A',
    piso: 'Piso 3',
    nivelAcceso: 'Crítico',
    tipoControl: 'Biométrico',
    estado: 'Activa',
    responsable: 'Pedro Vargas',
    capacidadMaxima: 5,
    ocupacionActual: 2,
    horarioAcceso: 'Lun-Vie 07:00-20:00 / Guardia 24h',
    requerimientoEPP: ['Pulsera antiestática'],
    permisosRequeridos: ['Permiso TI nivel 2', 'Autorización Gerencia'],
    registros: mockRegistros(1),
  },
  {
    id: 2,
    codigo: 'ZC-002',
    nombre: 'Cuarto de Químicos',
    descripcion: 'Almacenamiento de sustancias peligrosas certificadas',
    sede: 'Planta Norte',
    edificio: 'Bodega B',
    piso: 'Planta baja',
    nivelAcceso: 'Restringido',
    tipoControl: 'Tarjeta RFID',
    estado: 'Activa',
    responsable: 'Carlos Méndez',
    capacidadMaxima: 3,
    ocupacionActual: 0,
    horarioAcceso: 'Lun-Sáb 06:00-18:00',
    requerimientoEPP: ['Guantes', 'Gogles', 'Delantal PVC'],
    permisosRequeridos: ['Manejo sustancias peligrosas', 'Autorización SST'],
    registros: mockRegistros(2),
  },
  {
    id: 3,
    codigo: 'ZC-003',
    nombre: 'Zona de Alta Tensión',
    descripcion: 'Tableros eléctricos y transformadores de alta tensión',
    sede: 'Planta Norte',
    edificio: 'Edificio Industrial',
    piso: 'Planta baja',
    nivelAcceso: 'Crítico',
    tipoControl: 'Llave',
    estado: 'Activa',
    responsable: 'Luis Torres',
    capacidadMaxima: 2,
    ocupacionActual: 0,
    horarioAcceso: 'Solo personal eléctrico certificado',
    requerimientoEPP: ['Casco dieléctrico', 'Guantes dieléctricos', 'Botas dieléctricas', 'Careta arco'],
    permisosRequeridos: ['Licencia eléctrico RETIE', 'Permiso trabajo eléctrico'],
    registros: mockRegistros(3),
  },
  {
    id: 4,
    codigo: 'ZC-004',
    nombre: 'Gerencia General',
    descripcion: 'Oficinas directivas y sala de juntas ejecutiva',
    sede: 'Sede Principal',
    edificio: 'Torre A',
    piso: 'Piso 10',
    nivelAcceso: 'Confidencial',
    tipoControl: 'PIN',
    estado: 'Activa',
    responsable: 'Recepción Gerencia',
    capacidadMaxima: 20,
    ocupacionActual: 8,
    horarioAcceso: 'Lun-Vie 08:00-18:00',
    requerimientoEPP: [],
    permisosRequeridos: ['Cita previa'],
    registros: mockRegistros(4),
  },
  {
    id: 5,
    codigo: 'ZC-005',
    nombre: 'Sala de Mezclas',
    descripcion: 'Área de mezcla y preparación de productos industriales',
    sede: 'Planta Norte',
    edificio: 'Edificio Industrial',
    piso: 'Piso 1',
    nivelAcceso: 'Restringido',
    tipoControl: 'Combinado',
    estado: 'Mantenimiento',
    responsable: 'Jefe Producción',
    capacidadMaxima: 8,
    ocupacionActual: 0,
    horarioAcceso: 'En mantenimiento — acceso suspendido',
    requerimientoEPP: ['Casco', 'Gafas', 'Respirador', 'Guantes'],
    permisosRequeridos: ['TAR mezclas', 'Autorización producción'],
    registros: [],
  },
  {
    id: 6,
    codigo: 'ZC-006',
    nombre: 'Archivo General',
    descripcion: 'Bóveda documental con registros históricos de la empresa',
    sede: 'Sede Sur',
    edificio: 'Edificio Administrativo',
    piso: 'Sótano',
    nivelAcceso: 'Restringido',
    tipoControl: 'Guardia',
    estado: 'Activa',
    responsable: 'Jefe Documental',
    capacidadMaxima: 10,
    ocupacionActual: 1,
    horarioAcceso: 'Lun-Vie 08:00-17:00 (con solicitud previa)',
    requerimientoEPP: [],
    permisosRequeridos: ['Solicitud documental aprobada'],
    registros: mockRegistros(6),
  },
]

const nivelColor: Record<NivelAcceso, string> = {
  Público: 'bg-gray-100 text-gray-700',
  Restringido: 'bg-yellow-100 text-yellow-700',
  Confidencial: 'bg-blue-100 text-blue-700',
  Crítico: 'bg-red-100 text-red-700',
}

const estadoZonaColor: Record<EstadoZona, string> = {
  Activa: 'bg-green-100 text-green-700',
  Inactiva: 'bg-gray-100 text-gray-600',
  Mantenimiento: 'bg-orange-100 text-orange-700',
}

const accionColor: Record<string, string> = {
  Entrada: 'text-green-600',
  Salida: 'text-blue-600',
  'Acceso denegado': 'text-red-600',
}

const accionIcon: Record<string, JSX.Element> = {
  Entrada: <FaDoorOpen className="text-green-500" />,
  Salida: <FaDoorOpen className="text-blue-500" style={{ transform: 'scaleX(-1)' }} />,
  'Acceso denegado': <FaTimesCircle className="text-red-500" />,
}

const emptyForm: Omit<ZonaControlada, 'id' | 'registros' | 'requerimientoEPP' | 'permisosRequeridos'> = {
  codigo: '',
  nombre: '',
  descripcion: '',
  sede: '',
  edificio: '',
  piso: '',
  nivelAcceso: 'Restringido',
  tipoControl: 'Tarjeta RFID',
  estado: 'Activa',
  responsable: '',
  capacidadMaxima: 10,
  ocupacionActual: 0,
  horarioAcceso: '',
}

export default function ControlesAcceso() {
  const [view, setView] = useState<View>('dashboard')
  const [zonas, setZonas] = useState<ZonaControlada[]>(mockZonas)
  const [selected, setSelected] = useState<ZonaControlada | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [filtroNivel, setFiltroNivel] = useState<string>('Todos')
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // KPIs
  const zonasActivas = zonas.filter(z => z.estado === 'Activa').length
  const zonasCriticas = zonas.filter(z => z.nivelAcceso === 'Crítico').length
  const enMantenimiento = zonas.filter(z => z.estado === 'Mantenimiento').length
  const totalRegistrosHoy = zonas.reduce(
    (s, z) => s + z.registros.filter(r => r.fecha === '2026-03-23').length,
    0
  )
  const accesoDenegados = zonas.reduce(
    (s, z) => s + z.registros.filter(r => r.accion === 'Acceso denegado').length,
    0
  )

  // Charts
  const nivelCounts = (['Público', 'Restringido', 'Confidencial', 'Crítico'] as NivelAcceso[]).map(
    n => zonas.filter(z => z.nivelAcceso === n).length
  )
  const doughnutData = {
    labels: ['Público', 'Restringido', 'Confidencial', 'Crítico'],
    datasets: [
      {
        data: nivelCounts,
        backgroundColor: ['#6b7280', '#f59e0b', '#3b82f6', '#ef4444'],
      },
    ],
  }

  const sedeCounts = [...new Set(zonas.map(z => z.sede))].map(s => ({
    sede: s,
    count: zonas.filter(z => z.sede === s).length,
  }))
  const barData = {
    labels: sedeCounts.map(s => s.sede),
    datasets: [
      {
        label: 'Zonas',
        data: sedeCounts.map(s => s.count),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
    ],
  }

  const filtered = zonas.filter(z => {
    const matchSearch =
      z.nombre.toLowerCase().includes(search.toLowerCase()) ||
      z.codigo.toLowerCase().includes(search.toLowerCase()) ||
      z.sede.toLowerCase().includes(search.toLowerCase())
    const matchNivel = filtroNivel === 'Todos' || z.nivelAcceso === filtroNivel
    const matchEstado = filtroEstado === 'Todos' || z.estado === filtroEstado
    return matchSearch && matchNivel && matchEstado
  })

  function handleNew() {
    setForm(emptyForm)
    setEditId(null)
    setView('nueva')
  }

  function handleEdit(z: ZonaControlada) {
    const { registros: _r, id: _i, requerimientoEPP: _e, permisosRequeridos: _p, ...rest } = z
    setForm(rest)
    setEditId(z.id)
    setView('nueva')
  }

  function handleSave() {
    if (!form.codigo || !form.nombre) {
      toast.error('Código y nombre son obligatorios')
      return
    }
    if (editId !== null) {
      setZonas(prev => prev.map(z => z.id === editId ? { ...z, ...form } : z))
      toast.success('Zona actualizada')
    } else {
      const nueva: ZonaControlada = {
        id: Date.now(),
        registros: [],
        requerimientoEPP: [],
        permisosRequeridos: [],
        ...form,
      }
      setZonas(prev => [...prev, nueva])
      toast.success('Zona registrada')
    }
    setView('lista')
  }

  function handleDelete(id: number) {
    setZonas(prev => prev.filter(z => z.id !== id))
    setConfirmDelete(null)
    if (selected?.id === id) setView('lista')
    toast.success('Zona eliminada')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {(view === 'lista' || view === 'registros' || view === 'nueva') && (
            <button
              onClick={() => setView(view === 'registros' ? 'lista' : 'dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaArrowLeft />
            </button>
          )}
          <div className="bg-green-100 p-3 rounded-xl">
            <FaUnlockAlt className="text-green-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Controles de Acceso</h1>
            <p className="text-sm text-gray-500">Zonas restringidas y registros de ingreso</p>
          </div>
        </div>
        <div className="flex gap-2">
          {view === 'dashboard' && (
            <button
              onClick={() => setView('lista')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <FaLock /> Ver zonas
            </button>
          )}
          {view === 'lista' && (
            <button
              onClick={handleNew}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <FaPlus /> Nueva zona
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {(view === 'dashboard' || view === 'lista') && (
        <div className="flex gap-2 mb-6">
          {(['dashboard', 'lista'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                view === v ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {v === 'dashboard' ? 'Dashboard' : 'Zonas'}
            </button>
          ))}
        </div>
      )}

      {/* ===== DASHBOARD ===== */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Zonas activas', value: zonasActivas, color: 'green', icon: <FaCheckCircle /> },
              { label: 'Zonas críticas', value: zonasCriticas, color: 'red', icon: <FaShieldAlt /> },
              { label: 'En mantenimiento', value: enMantenimiento, color: 'orange', icon: <FaBuilding /> },
              { label: 'Accesos hoy', value: totalRegistrosHoy, color: 'blue', icon: <FaClock /> },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className={`text-${k.color}-500 text-xl mb-2`}>{k.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{k.value}</div>
                <div className="text-xs text-gray-500">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Alerta accesos denegados */}
          {accesoDenegados > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-lg" />
              <p className="text-sm text-red-700">
                <strong>{accesoDenegados} intento(s) de acceso denegado</strong> registrados. Revisar registros.
              </p>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-4">Zonas por nivel de acceso</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-4">Zonas por sede</h3>
              <div className="h-56">
                <Bar
                  data={barData}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaClock className="text-green-500" /> Actividad reciente (hoy)
            </h3>
            <div className="space-y-2">
              {zonas
                .flatMap(z => z.registros.filter(r => r.fecha === '2026-03-23').map(r => ({ ...r, zona: z.nombre })))
                .slice(0, 6)
                .map(r => (
                  <div key={r.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      {accionIcon[r.accion]}
                      <span className="font-medium text-gray-700">{r.persona}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-gray-600">{r.zona}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{r.hora}</span>
                      <span className={`font-medium ${accionColor[r.accion]}`}>{r.accion}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== LISTA ZONAS ===== */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <FaSearch className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar zona, código, sede..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filtroNivel}
                onChange={e => setFiltroNivel(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {['Todos', 'Público', 'Restringido', 'Confidencial', 'Crítico'].map(o => <option key={o}>{o}</option>)}
              </select>
              <select
                value={filtroEstado}
                onChange={e => setFiltroEstado(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {['Todos', 'Activa', 'Inactiva', 'Mantenimiento'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <span className="text-sm text-gray-500 self-center">{filtered.length} zona(s)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(z => {
              const ocuPct = z.capacidadMaxima > 0 ? Math.round((z.ocupacionActual / z.capacidadMaxima) * 100) : 0
              return (
                <div key={z.id} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-800">{z.nombre}</div>
                      <div className="text-xs text-gray-400">{z.codigo} · {z.sede}</div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${nivelColor[z.nivelAcceso]}`}>
                        {z.nivelAcceso}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoZonaColor[z.estado]}`}>
                        {z.estado}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">{z.descripcion}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Ocupación: {z.ocupacionActual}/{z.capacidadMaxima}</span>
                    <span>{ocuPct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div
                      className={`h-1.5 rounded-full ${ocuPct >= 80 ? 'bg-red-500' : ocuPct >= 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                      style={{ width: `${ocuPct}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                    <FaIdCard />
                    <span>{z.tipoControl}</span>
                    <span className="mx-1">·</span>
                    <FaUser />
                    <span>{z.responsable}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelected(z); setView('registros') }}
                      className="flex-1 text-center text-xs py-1.5 rounded bg-green-50 text-green-700 hover:bg-green-100 flex items-center justify-center gap-1"
                    >
                      <FaEye /> Registros
                    </button>
                    <button
                      onClick={() => handleEdit(z)}
                      className="px-3 py-1.5 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(z.id)}
                      className="px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">No se encontraron zonas</div>
          )}
        </div>
      )}

      {/* ===== REGISTROS DE ZONA ===== */}
      {view === 'registros' && selected && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">{selected.nombre}</h2>
                <p className="text-sm text-gray-500">{selected.codigo} · {selected.sede} · {selected.edificio} {selected.piso}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${nivelColor[selected.nivelAcceso]}`}>
                {selected.nivelAcceso}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-gray-400">Control:</span> <span className="font-medium">{selected.tipoControl}</span></div>
              <div><span className="text-gray-400">Horario:</span> <span className="font-medium">{selected.horarioAcceso}</span></div>
              <div>
                <span className="text-gray-400">Capacidad:</span>{' '}
                <span className="font-medium">{selected.ocupacionActual}/{selected.capacidadMaxima}</span>
              </div>
              <div><span className="text-gray-400">Responsable:</span> <span className="font-medium">{selected.responsable}</span></div>
            </div>

            {selected.requerimientoEPP.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-gray-500 font-medium">EPP requerido: </span>
                {selected.requerimientoEPP.map((e, i) => (
                  <span key={i} className="inline-flex items-center gap-1 mr-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                    <FaCheckCircle /> {e}
                  </span>
                ))}
              </div>
            )}

            {selected.permisosRequeridos.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500 font-medium">Permisos: </span>
                {selected.permisosRequeridos.map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1 mr-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs">
                    <FaShieldAlt /> {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" /> Registros de acceso
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Fecha / Hora</th>
                  <th className="px-4 py-3 text-left">Persona</th>
                  <th className="px-4 py-3 text-center">Tipo</th>
                  <th className="px-4 py-3 text-center">Método</th>
                  <th className="px-4 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selected.registros.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.fecha}</div>
                      <div className="text-xs text-gray-400">{r.hora}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{r.persona}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{r.tipo}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">{r.metodo}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`flex items-center justify-center gap-1 font-medium text-xs ${accionColor[r.accion]}`}>
                        {accionIcon[r.accion]} {r.accion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selected.registros.length === 0 && (
              <div className="text-center py-8 text-gray-400">Sin registros para esta zona</div>
            )}
          </div>

          <button
            onClick={() => handleEdit(selected)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600"
          >
            <FaEdit /> Editar zona
          </button>
        </div>
      )}

      {/* ===== FORMULARIO ===== */}
      {view === 'nueva' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            {editId ? 'Editar zona controlada' : 'Nueva zona controlada'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Código', key: 'codigo' },
              { label: 'Nombre de la zona', key: 'nombre' },
              { label: 'Sede', key: 'sede' },
              { label: 'Edificio', key: 'edificio' },
              { label: 'Piso / Nivel', key: 'piso' },
              { label: 'Responsable', key: 'responsable' },
              { label: 'Capacidad máxima', key: 'capacidadMaxima', type: 'number' },
              { label: 'Ocupación actual', key: 'ocupacionActual', type: 'number' },
              { label: 'Horario de acceso', key: 'horarioAcceso' },
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Nivel de acceso</label>
              <select
                value={form.nivelAcceso}
                onChange={e => setForm(p => ({ ...p, nivelAcceso: e.target.value as NivelAcceso }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Público', 'Restringido', 'Confidencial', 'Crítico'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo de control</label>
              <select
                value={form.tipoControl}
                onChange={e => setForm(p => ({ ...p, tipoControl: e.target.value as TipoControl }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Tarjeta RFID', 'Biométrico', 'PIN', 'Llave', 'Guardia', 'Combinado'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado</label>
              <select
                value={form.estado}
                onChange={e => setForm(p => ({ ...p, estado: e.target.value as EstadoZona }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Activa', 'Inactiva', 'Mantenimiento'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
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

      {/* Modal eliminar */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-96">
            <h3 className="font-bold text-gray-800 mb-2">¿Eliminar zona?</h3>
            <p className="text-sm text-gray-600 mb-4">Se eliminarán también todos los registros asociados.</p>
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
