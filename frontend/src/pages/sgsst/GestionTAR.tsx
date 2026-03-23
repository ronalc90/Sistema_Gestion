import { useState } from 'react'
import { FaCrosshairs, FaPlus, FaEdit, FaEye, FaArrowLeft, FaSearch, FaExclamationTriangle } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type View = 'dashboard' | 'lista' | 'detalle' | 'formulario'
type TipoTrabajo = 'Trabajo en alturas' | 'Espacios confinados' | 'Trabajos en caliente' | 'Trabajo eléctrico' | 'Excavaciones' | 'Otro'
type EstadoPermiso = 'Activo' | 'Cerrado' | 'Suspendido'

interface PermisoTAR {
  id: string
  codigo: string
  tipoTrabajo: TipoTrabajo
  fecha: string
  horaInicio: string
  horaFin: string
  trabajador: string
  cedula: string
  cargo: string
  area: string
  sede: string
  ubicacion: string
  descripcionTarea: string
  riesgosIdentificados: string
  medidasControl: string
  eppRequerido: string
  responsableSupervisor: string
  estado: EstadoPermiso
  verificacionFinal: boolean
  observaciones?: string
}

const mockPermisos: PermisoTAR[] = [
  {
    id: '1', codigo: 'TAR-001', tipoTrabajo: 'Trabajo en alturas', fecha: '2026-03-10',
    horaInicio: '07:00', horaFin: '12:00',
    trabajador: 'Hernán Torres', cedula: '19890123', cargo: 'Técnico Electricista',
    area: 'Mantenimiento', sede: 'Sede Principal', ubicacion: 'Cubierta edificio A, piso 5',
    descripcionTarea: 'Instalación de luminarias LED en cubierta del edificio de administración.',
    riesgosIdentificados: 'Caída de altura, resbalamiento, quemaduras eléctricas, vientos fuertes',
    medidasControl: 'Línea de vida certificada, puntos de anclaje verificados, arnés tipo X, casco con barbuquejo',
    eppRequerido: 'Arnés de cuerpo completo, casco con barbuquejo, guantes dieléctricos, botas antideslizantes',
    responsableSupervisor: 'Carlos Jiménez', estado: 'Cerrado', verificacionFinal: true,
    observaciones: 'Trabajo completado sin incidentes. Verificación final satisfactoria.'
  },
  {
    id: '2', codigo: 'TAR-002', tipoTrabajo: 'Espacios confinados', fecha: '2026-03-12',
    horaInicio: '08:00', horaFin: '14:00',
    trabajador: 'Roberto Pinto', cedula: '91234567', cargo: 'Técnico de Mantenimiento',
    area: 'Producción', sede: 'Sede Principal', ubicacion: 'Tanque de almacenamiento T-03',
    descripcionTarea: 'Limpieza interna y revisión de recubrimiento del tanque de agua industrial.',
    riesgosIdentificados: 'Atmósfera deficiente de oxígeno, gases tóxicos, atrapamiento, temperatura',
    medidasControl: 'Monitoreo continuo de atmósfera, vigía externo permanente, equipo de rescate en standby',
    eppRequerido: 'Equipo de respiración autónoma, arnés, traje Tyvek, casco, botas de seguridad',
    responsableSupervisor: 'Sandra López', estado: 'Cerrado', verificacionFinal: true
  },
  {
    id: '3', codigo: 'TAR-003', tipoTrabajo: 'Trabajos en caliente', fecha: '2026-03-15',
    horaInicio: '09:00', horaFin: '17:00',
    trabajador: 'Luis Rodríguez', cedula: '80456789', cargo: 'Soldador',
    area: 'Mantenimiento', sede: 'Sede Sur', ubicacion: 'Taller de soldadura, área B',
    descripcionTarea: 'Reparación estructural de bastidor metálico de transportador.',
    riesgosIdentificados: 'Incendio, explosión, radiación UV, quemaduras, humos de soldadura',
    medidasControl: 'Extintor tipo ABC disponible, área delimitada, retiro de material combustible a 10m',
    eppRequerido: 'Careta de soldadura, guantes de cuero, delantal ignífugo, botas con puntera',
    responsableSupervisor: 'Ing. Pérez', estado: 'Activo', verificacionFinal: false,
    observaciones: 'Trabajo en curso. Vigía presente en todo momento.'
  },
  {
    id: '4', codigo: 'TAR-004', tipoTrabajo: 'Trabajo eléctrico', fecha: '2026-03-16',
    horaInicio: '06:00', horaFin: '10:00',
    trabajador: 'Hernán Torres', cedula: '19890123', cargo: 'Técnico Electricista',
    area: 'Mantenimiento', sede: 'Sede Norte', ubicacion: 'Cuarto eléctrico, tablero principal TP-01',
    descripcionTarea: 'Mantenimiento preventivo y reemplazo de disyuntores en tablero principal.',
    riesgosIdentificados: 'Contacto eléctrico directo, arco eléctrico, quemaduras, shock eléctrico',
    medidasControl: 'Bloqueo y etiquetado LOTO verificado, prueba de ausencia de tensión, zona despejada',
    eppRequerido: 'Guantes dieléctricos clase 2, pantalla facial, ropa ignífuga, botas dieléctricas',
    responsableSupervisor: 'Carlos Jiménez', estado: 'Suspendido', verificacionFinal: false,
    observaciones: 'Suspendido por lluvia y humedad en cuarto eléctrico. Reprogramado.'
  },
  {
    id: '5', codigo: 'TAR-005', tipoTrabajo: 'Excavaciones', fecha: '2026-03-18',
    horaInicio: '07:00', horaFin: '16:00',
    trabajador: 'Jorge Herrera', cedula: '71678901', cargo: 'Auxiliar de Obra',
    area: 'Infraestructura', sede: 'Sede Principal', ubicacion: 'Parqueadero zona C, red hidrosanitaria',
    descripcionTarea: 'Excavación para instalación de red de aguas residuales industriales.',
    riesgosIdentificados: 'Derrumbe de taludes, contacto con redes eléctricas subterráneas, gases',
    medidasControl: 'Entibado de trinchera, planos de redes verificados, detector de gases, barreras perimetrales',
    eppRequerido: 'Casco, chaleco reflectivo, botas con puntera, guantes de cuero',
    responsableSupervisor: 'Jefe de Obras', estado: 'Activo', verificacionFinal: false
  },
  {
    id: '6', codigo: 'TAR-006', tipoTrabajo: 'Otro', fecha: '2026-03-20',
    horaInicio: '08:00', horaFin: '13:00',
    trabajador: 'Carlos Martínez', cedula: '10234567', cargo: 'Operario',
    area: 'Producción', sede: 'Sede Principal', ubicacion: 'Línea de producción 3, módulo F',
    descripcionTarea: 'Retiro y limpieza de equipo de producción con solventes industriales.',
    riesgosIdentificados: 'Inhalación de vapores, incendio, contacto dérmico con solventes',
    medidasControl: 'Ventilación forzada, uso de EPP completo, kit antiderrames disponible',
    eppRequerido: 'Respirador con filtro orgánico, guantes de nitrilo, gafas de seguridad, bata',
    responsableSupervisor: 'Jefe de Producción', estado: 'Cerrado', verificacionFinal: true
  }
]

const tipoColors: Record<TipoTrabajo, string> = {
  'Trabajo en alturas': 'bg-blue-100 text-blue-700',
  'Espacios confinados': 'bg-gray-100 text-gray-700',
  'Trabajos en caliente': 'bg-red-100 text-red-700',
  'Trabajo eléctrico': 'bg-yellow-100 text-yellow-700',
  'Excavaciones': 'bg-orange-100 text-orange-700',
  'Otro': 'bg-purple-100 text-purple-700'
}

const estadoColors: Record<EstadoPermiso, string> = {
  'Activo': 'bg-green-100 text-green-700',
  'Cerrado': 'bg-gray-100 text-gray-600',
  'Suspendido': 'bg-red-100 text-red-700'
}

const tiposTrabajo: TipoTrabajo[] = ['Trabajo en alturas', 'Espacios confinados', 'Trabajos en caliente', 'Trabajo eléctrico', 'Excavaciones', 'Otro']
const estadosPermiso: EstadoPermiso[] = ['Activo', 'Cerrado', 'Suspendido']

const emptyForm: Omit<PermisoTAR, 'id'> = {
  codigo: '', tipoTrabajo: 'Trabajo en alturas', fecha: '', horaInicio: '', horaFin: '',
  trabajador: '', cedula: '', cargo: '', area: '', sede: '', ubicacion: '',
  descripcionTarea: '', riesgosIdentificados: '', medidasControl: '', eppRequerido: '',
  responsableSupervisor: '', estado: 'Activo', verificacionFinal: false, observaciones: ''
}

export default function GestionTAR() {
  const [view, setView] = useState<View>('dashboard')
  const [permisos, setPermisos] = useState<PermisoTAR[]>(mockPermisos)
  const [selected, setSelected] = useState<PermisoTAR | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [form, setForm] = useState<Omit<PermisoTAR, 'id'>>(emptyForm)

  const filtered = permisos.filter(p => {
    const matchSearch = p.trabajador.toLowerCase().includes(search.toLowerCase()) || p.codigo.includes(search) || p.ubicacion.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipo === '' || p.tipoTrabajo === filterTipo
    const matchEstado = filterEstado === '' || p.estado === filterEstado
    return matchSearch && matchTipo && matchEstado
  })

  const activos = permisos.filter(p => p.estado === 'Activo').length
  const tipoConteos = tiposTrabajo.map(t => permisos.filter(p => p.tipoTrabajo === t).length)

  const doughnutData = {
    labels: tiposTrabajo,
    datasets: [{ data: tipoConteos, backgroundColor: ['#3b82f6','#6b7280','#ef4444','#eab308','#f97316','#a855f7'], borderWidth: 2 }]
  }
  const barData = {
    labels: tiposTrabajo.map(t => t.split(' ').slice(0, 2).join(' ')),
    datasets: [{ label: 'Permisos', data: tipoConteos, backgroundColor: '#ea580c', borderRadius: 6 }]
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setView('formulario') }
  const openEdit = (p: PermisoTAR) => { setForm({ ...p }); setEditingId(p.id); setView('formulario') }
  const openDetail = (p: PermisoTAR) => { setSelected(p); setView('detalle') }

  const handleSave = () => {
    if (!form.codigo || !form.trabajador || !form.fecha || !form.descripcionTarea) {
      toast.error('Complete los campos obligatorios'); return
    }
    if (editingId) {
      setPermisos(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p))
      toast.success('Permiso actualizado correctamente')
    } else {
      setPermisos(prev => [...prev, { ...form, id: Date.now().toString() }])
      toast.success('Permiso creado correctamente')
    }
    setView('lista')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600 text-xl"><FaCrosshairs /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión TAR — Trabajos de Alto Riesgo</h1>
            <p className="text-sm text-gray-500">Permisos de trabajo para actividades de alto riesgo</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'lista'].map(v => (
            <button key={v} onClick={() => setView(v as View)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 border hover:bg-orange-50'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            <FaPlus /> Nuevo Permiso
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Permisos', value: permisos.length, color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { label: 'Activos Ahora', value: activos, color: 'bg-green-50 border-green-200 text-green-700' },
              { label: 'Suspendidos', value: permisos.filter(p => p.estado === 'Suspendido').length, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Cerrados', value: permisos.filter(p => p.estado === 'Cerrado').length, color: 'bg-gray-50 border-gray-200 text-gray-700' }
            ].map((kpi, i) => (
              <div key={i} className={`border rounded-xl p-4 ${kpi.color}`}>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-sm mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
          {activos > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-orange-700">Permisos activos en ejecución</p>
                <p className="text-sm text-orange-600">{activos} permiso(s) TAR están actualmente en ejecución. Asegúrese de que los supervisores están en sitio.</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Distribución por Tipo de Trabajo</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'right' } }, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Permisos por Tipo</h3>
              <div className="h-56">
                <Bar data={barData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Permisos Activos</h3></div>
            {permisos.filter(p => p.estado === 'Activo').length === 0
              ? <div className="text-center py-6 text-gray-400">No hay permisos activos en este momento</div>
              : <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>{['Código','Tipo','Trabajador','Ubicación','Horario','Supervisor'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {permisos.filter(p => p.estado === 'Activo').map(p => (
                    <tr key={p.id} className="hover:bg-orange-50">
                      <td className="px-4 py-3 font-mono text-orange-600 text-xs">{p.codigo}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tipoColors[p.tipoTrabajo]}`}>{p.tipoTrabajo}</span></td>
                      <td className="px-4 py-3 font-medium">{p.trabajador}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.ubicacion}</td>
                      <td className="px-4 py-3 text-gray-500">{p.horaInicio} — {p.horaFin}</td>
                      <td className="px-4 py-3 text-gray-600">{p.responsableSupervisor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        </div>
      )}

      {/* Lista */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar trabajador, código, ubicación..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
              <option value="">Todos los tipos</option>
              {tiposTrabajo.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
              <option value="">Todos los estados</option>
              {estadosPermiso.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Fecha','Tipo','Trabajador','Ubicación','Horario','Estado','Verif.','Acciones'].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-orange-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-orange-600 text-xs">{p.codigo}</td>
                    <td className="px-3 py-3 text-gray-500">{p.fecha}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tipoColors[p.tipoTrabajo]}`}>{p.tipoTrabajo.split(' ').slice(0,3).join(' ')}</span></td>
                    <td className="px-3 py-3 font-medium">{p.trabajador}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs max-w-xs truncate">{p.ubicacion}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{p.horaInicio}–{p.horaFin}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[p.estado]}`}>{p.estado}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${p.verificacionFinal ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.verificacionFinal ? 'OK' : 'Pend.'}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(p)} className="p-1.5 text-orange-600 hover:bg-orange-100 rounded"><FaEye /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FaEdit /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-10 text-gray-400">No se encontraron permisos</div>}
          </div>
        </div>
      )}

      {/* Detalle */}
      {view === 'detalle' && selected && (
        <div className="max-w-4xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-orange-600 hover:underline text-sm"><FaArrowLeft /> Volver a lista</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.codigo} — {selected.tipoTrabajo}</h2>
                <p className="text-sm text-gray-500">{selected.trabajador} ({selected.cedula}) — {selected.cargo} — {selected.area}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${estadoColors[selected.estado]}`}>{selected.estado}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${selected.verificacionFinal ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selected.verificacionFinal ? 'Verificación OK' : 'Sin verificación'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-5">
              {[
                { label: 'Fecha', value: selected.fecha },
                { label: 'Horario', value: `${selected.horaInicio} — ${selected.horaFin}` },
                { label: 'Sede', value: selected.sede },
                { label: 'Ubicación', value: selected.ubicacion },
                { label: 'Supervisor', value: selected.responsableSupervisor },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="font-medium text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Descripción de la Tarea', value: selected.descripcionTarea },
                { label: 'Riesgos Identificados', value: selected.riesgosIdentificados },
                { label: 'Medidas de Control', value: selected.medidasControl },
                { label: 'EPP Requerido', value: selected.eppRequerido },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-2">{value}</p>
                </div>
              ))}
              {selected.observaciones && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">Observaciones</p>
                  <p className="text-gray-600">{selected.observaciones}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"><FaEdit className="inline mr-1" />Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {view === 'formulario' && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-orange-600 hover:underline text-sm"><FaArrowLeft /> Volver</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">{editingId ? 'Editar Permiso TAR' : 'Nuevo Permiso de Trabajo TAR'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Código *', field: 'codigo' },
                { label: 'Trabajador *', field: 'trabajador' },
                { label: 'Cédula', field: 'cedula' },
                { label: 'Cargo', field: 'cargo' },
                { label: 'Área', field: 'area' },
                { label: 'Sede', field: 'sede' },
                { label: 'Fecha *', field: 'fecha', type: 'date' },
                { label: 'Hora Inicio', field: 'horaInicio', type: 'time' },
                { label: 'Hora Fin', field: 'horaFin', type: 'time' },
                { label: 'Responsable Supervisor', field: 'responsableSupervisor' },
                { label: 'Ubicación *', field: 'ubicacion' },
              ].map(({ label, field, type = 'text' }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as any)[field] ?? ''} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Trabajo</label>
                <select value={form.tipoTrabajo} onChange={e => setForm(prev => ({ ...prev, tipoTrabajo: e.target.value as TipoTrabajo }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {tiposTrabajo.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.estado} onChange={e => setForm(prev => ({ ...prev, estado: e.target.value as EstadoPermiso }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {estadosPermiso.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {['descripcionTarea','riesgosIdentificados','medidasControl','eppRequerido'].map(field => (
                <div key={field} className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <textarea value={(form as any)[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea value={form.observaciones || ''} onChange={e => setForm(prev => ({ ...prev, observaciones: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="verificacion" checked={form.verificacionFinal} onChange={e => setForm(prev => ({ ...prev, verificacionFinal: e.target.checked }))} className="h-4 w-4 accent-orange-500" />
              <label htmlFor="verificacion" className="text-sm text-gray-700">Verificación final completada</label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">Guardar</button>
              <button onClick={() => setView('lista')} className="px-5 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
