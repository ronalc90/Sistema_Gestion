import { useState } from 'react'
import { FaHeartbeat, FaPlus, FaEdit, FaEye, FaArrowLeft, FaSearch } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type View = 'dashboard' | 'lista' | 'detalle' | 'formulario'
type TipoEvento = 'Accidente de trabajo' | 'Incidente' | 'Enfermedad laboral' | 'Casi accidente'
type Gravedad = 'Leve' | 'Moderado' | 'Grave' | 'Fatal'
type EstadoEvento = 'Reportado' | 'En investigación' | 'Cerrado'

interface Accidente {
  id: string
  codigo: string
  tipo: TipoEvento
  fecha: string
  hora: string
  trabajador: string
  cedula: string
  cargo: string
  area: string
  sede: string
  descripcion: string
  causaInmediata: string
  causaBasica: string
  partesCuerpo: string[]
  diasPerdidos: number
  gravedad: Gravedad
  estado: EstadoEvento
  medidasControl: string
  responsableInvestigacion: string
  fechaInvestigacion?: string
}

const mockAccidentes: Accidente[] = [
  {
    id: '1', codigo: 'EVT-001', tipo: 'Accidente de trabajo', fecha: '2026-01-08', hora: '10:30',
    trabajador: 'Carlos Martínez', cedula: '10234567', cargo: 'Operario de Producción', area: 'Producción', sede: 'Sede Principal',
    descripcion: 'Trabajador sufrió atrapamiento de mano derecha en rodillo de máquina empacadora durante limpieza sin bloqueo LOTO.',
    causaInmediata: 'Contacto con rodillo en movimiento', causaBasica: 'Falta de procedimiento de bloqueo y falla en supervisión',
    partesCuerpo: ['Mano derecha', 'Dedos índice y medio'],
    diasPerdidos: 15, gravedad: 'Moderado', estado: 'Cerrado',
    medidasControl: 'Implementación obligatoria de LOTO, capacitación a operarios, señalización reforzada.',
    responsableInvestigacion: 'Ing. Sandra López', fechaInvestigacion: '2026-01-10'
  },
  {
    id: '2', codigo: 'EVT-002', tipo: 'Casi accidente', fecha: '2026-01-20', hora: '14:15',
    trabajador: 'Ana Gómez', cedula: '52345678', cargo: 'Técnico de Laboratorio', area: 'Calidad', sede: 'Sede Principal',
    descripcion: 'Casi derrame de ácido sulfúrico al manipular contenedor dañado. No hubo contacto con trabajadora.',
    causaInmediata: 'Contenedor con tapa defectuosa', causaBasica: 'Falta de inspección de envases antes de uso',
    partesCuerpo: [],
    diasPerdidos: 0, gravedad: 'Leve', estado: 'Cerrado',
    medidasControl: 'Protocolo de inspección de envases, cambio de proveedor de contenedores.',
    responsableInvestigacion: 'Ing. Sandra López', fechaInvestigacion: '2026-01-21'
  },
  {
    id: '3', codigo: 'EVT-003', tipo: 'Accidente de trabajo', fecha: '2026-02-05', hora: '08:45',
    trabajador: 'Luis Rodríguez', cedula: '80456789', cargo: 'Conductor', area: 'Logística', sede: 'Sede Principal',
    descripcion: 'Colisión trasera en semáforo. Vehículo de empresa impactado por tercero. Trabajador presenta whiplash.',
    causaInmediata: 'Colisión por vehículo de tercero', causaBasica: 'Condición de vía y factor externo',
    partesCuerpo: ['Cervical', 'Hombro izquierdo'],
    diasPerdidos: 14, gravedad: 'Moderado', estado: 'Cerrado',
    medidasControl: 'Reporte ARL, seguimiento médico, revisión de rutas de alto riesgo vial.',
    responsableInvestigacion: 'Jefe de Logística', fechaInvestigacion: '2026-02-06'
  },
  {
    id: '4', codigo: 'EVT-004', tipo: 'Incidente', fecha: '2026-02-18', hora: '11:00',
    trabajador: 'Jorge Herrera', cedula: '71678901', cargo: 'Almacenista', area: 'Logística', sede: 'Sede Norte',
    descripcion: 'Caída de estante por mala distribución de carga. No hubo lesionados pero se dañaron materiales.',
    causaInmediata: 'Sobrecarga en estantería superior', causaBasica: 'Falta de señalización de capacidad máxima',
    partesCuerpo: [],
    diasPerdidos: 0, gravedad: 'Leve', estado: 'Cerrado',
    medidasControl: 'Señalización de capacidades máximas, reconfiguración de almacenamiento.',
    responsableInvestigacion: 'Ing. Sandra López', fechaInvestigacion: '2026-02-19'
  },
  {
    id: '5', codigo: 'EVT-005', tipo: 'Enfermedad laboral', fecha: '2026-03-01', hora: '09:00',
    trabajador: 'Sandra López', cedula: '60901234', cargo: 'Jefe de Mantenimiento', area: 'Mantenimiento', sede: 'Sede Principal',
    descripcion: 'Diagnóstico de síndrome del túnel carpiano bilateral asociado a uso de herramientas vibratorias por más de 8 años.',
    causaInmediata: 'Exposición crónica a vibraciones de mano-brazo', causaBasica: 'Ausencia de rotación de actividades y evaluación periódica de riesgo ergonómico',
    partesCuerpo: ['Muñeca derecha', 'Muñeca izquierda'],
    diasPerdidos: 7, gravedad: 'Moderado', estado: 'En investigación',
    medidasControl: 'Rotación de tareas, uso de herramientas anti-vibración, fisioterapia.',
    responsableInvestigacion: 'Médico Laboral', fechaInvestigacion: '2026-03-03'
  },
  {
    id: '6', codigo: 'EVT-006', tipo: 'Accidente de trabajo', fecha: '2026-03-15', hora: '16:20',
    trabajador: 'Hernán Torres', cedula: '19890123', cargo: 'Técnico Electricista', area: 'Mantenimiento', sede: 'Sede Principal',
    descripcion: 'Contacto eléctrico indirecto al intervenir tablero sin verificar des-energización completa del sistema.',
    causaInmediata: 'Contacto con conductor energizado a 220V', causaBasica: 'Omisión del procedimiento de bloqueo/etiquetado',
    partesCuerpo: ['Mano izquierda', 'Antebrazo izquierdo'],
    diasPerdidos: 0, gravedad: 'Grave', estado: 'En investigación',
    medidasControl: 'Suspensión de actividades eléctricas hasta investigación, refuerzo de capacitación LOTO eléctrico.',
    responsableInvestigacion: 'Gerencia SGSST'
  }
]

const tipoColors: Record<TipoEvento, string> = {
  'Accidente de trabajo': 'bg-red-100 text-red-700',
  'Incidente': 'bg-yellow-100 text-yellow-700',
  'Enfermedad laboral': 'bg-orange-100 text-orange-700',
  'Casi accidente': 'bg-blue-100 text-blue-700'
}

const gravedadColors: Record<Gravedad, string> = {
  'Leve': 'bg-green-100 text-green-700',
  'Moderado': 'bg-yellow-100 text-yellow-700',
  'Grave': 'bg-orange-100 text-orange-700',
  'Fatal': 'bg-red-200 text-red-900'
}

const estadoColors: Record<EstadoEvento, string> = {
  'Reportado': 'bg-blue-100 text-blue-700',
  'En investigación': 'bg-yellow-100 text-yellow-700',
  'Cerrado': 'bg-green-100 text-green-700'
}

const tiposEvento: TipoEvento[] = ['Accidente de trabajo', 'Incidente', 'Enfermedad laboral', 'Casi accidente']
const gravedades: Gravedad[] = ['Leve', 'Moderado', 'Grave', 'Fatal']
const estados: EstadoEvento[] = ['Reportado', 'En investigación', 'Cerrado']

const emptyForm: Omit<Accidente, 'id'> = {
  codigo: '', tipo: 'Accidente de trabajo', fecha: '', hora: '', trabajador: '', cedula: '',
  cargo: '', area: '', sede: '', descripcion: '', causaInmediata: '', causaBasica: '',
  partesCuerpo: [], diasPerdidos: 0, gravedad: 'Leve', estado: 'Reportado',
  medidasControl: '', responsableInvestigacion: '', fechaInvestigacion: ''
}

export default function ReporteAccidentes() {
  const [view, setView] = useState<View>('dashboard')
  const [eventos, setEventos] = useState<Accidente[]>(mockAccidentes)
  const [selected, setSelected] = useState<Accidente | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [form, setForm] = useState<Omit<Accidente, 'id'>>(emptyForm)
  const [partesInput, setPartesInput] = useState('')

  const filtered = eventos.filter(e => {
    const matchSearch = e.trabajador.toLowerCase().includes(search.toLowerCase()) || e.codigo.includes(search) || e.area.toLowerCase().includes(search.toLowerCase())
    const matchTipo = filterTipo === '' || e.tipo === filterTipo
    const matchEstado = filterEstado === '' || e.estado === filterEstado
    return matchSearch && matchTipo && matchEstado
  })

  const totalDias = eventos.reduce((s, e) => s + e.diasPerdidos, 0)
  const accidentes = eventos.filter(e => e.tipo === 'Accidente de trabajo').length
  const incidentes = eventos.filter(e => e.tipo === 'Incidente').length

  const tipoConteos = tiposEvento.map(t => eventos.filter(e => e.tipo === t).length)
  const gravedadConteos = gravedades.map(g => eventos.filter(e => e.gravedad === g).length)

  const doughnutData = {
    labels: tiposEvento,
    datasets: [{ data: tipoConteos, backgroundColor: ['#ef4444','#eab308','#f97316','#3b82f6'], borderWidth: 2 }]
  }
  const barData = {
    labels: gravedades,
    datasets: [{ label: 'Eventos por gravedad', data: gravedadConteos, backgroundColor: ['#22c55e','#eab308','#f97316','#991b1b'], borderRadius: 6 }]
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setPartesInput(''); setView('formulario') }
  const openEdit = (e: Accidente) => {
    setForm({ ...e }); setEditingId(e.id); setPartesInput(''); setView('formulario')
  }
  const openDetail = (e: Accidente) => { setSelected(e); setView('detalle') }

  const addParte = () => {
    if (!partesInput.trim()) return
    setForm(prev => ({ ...prev, partesCuerpo: [...prev.partesCuerpo, partesInput.trim()] }))
    setPartesInput('')
  }
  const removeParte = (idx: number) => setForm(prev => ({ ...prev, partesCuerpo: prev.partesCuerpo.filter((_, i) => i !== idx) }))

  const handleSave = () => {
    if (!form.codigo || !form.trabajador || !form.fecha || !form.descripcion) {
      toast.error('Complete los campos obligatorios'); return
    }
    if (editingId) {
      setEventos(prev => prev.map(e => e.id === editingId ? { ...e, ...form } : e))
      toast.success('Evento actualizado correctamente')
    } else {
      setEventos(prev => [...prev, { ...form, id: Date.now().toString() }])
      toast.success('Evento registrado correctamente')
    }
    setView('lista')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg text-red-600 text-xl"><FaHeartbeat /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reporte de Accidentes e Incidentes</h1>
            <p className="text-sm text-gray-500">Investigación y seguimiento de eventos SST</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'lista'].map(v => (
            <button key={v} onClick={() => setView(v as View)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border hover:bg-red-50'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            <FaPlus /> Nuevo Evento
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Eventos', value: eventos.length, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Accidentes', value: accidentes, color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { label: 'Incidentes', value: incidentes, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
              { label: 'Días Perdidos', value: totalDias, color: 'bg-gray-50 border-gray-200 text-gray-700' }
            ].map((kpi, i) => (
              <div key={i} className={`border rounded-xl p-4 ${kpi.color}`}>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-sm mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Distribución por Tipo</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'right' } }, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Eventos por Gravedad</h3>
              <div className="h-56">
                <Bar data={barData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Eventos Recientes</h3></div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Trabajador','Tipo','Gravedad','Días Perdidos','Estado'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventos.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-red-600 text-xs">{e.codigo}</td>
                    <td className="px-4 py-3 font-medium">{e.trabajador}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tipoColors[e.tipo]}`}>{e.tipo}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${gravedadColors[e.gravedad]}`}>{e.gravedad}</span></td>
                    <td className="px-4 py-3 font-semibold text-red-600">{e.diasPerdidos}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[e.estado]}`}>{e.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lista */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar trabajador, código, área..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Todos los tipos</option>
              {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
              <option value="">Todos los estados</option>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Fecha','Trabajador','Tipo','Gravedad','Días','Estado','Acciones'].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-red-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-red-600 text-xs">{e.codigo}</td>
                    <td className="px-3 py-3 text-gray-500">{e.fecha}</td>
                    <td className="px-3 py-3 font-medium">{e.trabajador}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tipoColors[e.tipo]}`}>{e.tipo}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${gravedadColors[e.gravedad]}`}>{e.gravedad}</span></td>
                    <td className="px-3 py-3 font-semibold text-red-600">{e.diasPerdidos}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[e.estado]}`}>{e.estado}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(e)} className="p-1.5 text-red-600 hover:bg-red-100 rounded"><FaEye /></button>
                        <button onClick={() => openEdit(e)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FaEdit /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-10 text-gray-400">No se encontraron eventos</div>}
          </div>
        </div>
      )}

      {/* Detalle */}
      {view === 'detalle' && selected && (
        <div className="max-w-4xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-red-600 hover:underline text-sm"><FaArrowLeft /> Volver a lista</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.codigo} — {selected.tipo}</h2>
                <p className="text-sm text-gray-500">{selected.trabajador} ({selected.cedula}) — {selected.cargo} — {selected.area}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${gravedadColors[selected.gravedad]}`}>{selected.gravedad}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${estadoColors[selected.estado]}`}>{selected.estado}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
              {[
                { label: 'Fecha', value: selected.fecha },
                { label: 'Hora', value: selected.hora },
                { label: 'Sede', value: selected.sede },
                { label: 'Días Perdidos', value: `${selected.diasPerdidos} días` },
                { label: 'Responsable Investigación', value: selected.responsableInvestigacion },
                { label: 'Fecha Investigación', value: selected.fechaInvestigacion || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="font-medium text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Descripción del Evento', value: selected.descripcion },
                { label: 'Causa Inmediata', value: selected.causaInmediata },
                { label: 'Causa Básica', value: selected.causaBasica },
                { label: 'Medidas de Control', value: selected.medidasControl },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-2">{value}</p>
                </div>
              ))}
              {selected.partesCuerpo.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Partes del Cuerpo Afectadas</p>
                  <div className="flex flex-wrap gap-1">
                    {selected.partesCuerpo.map((p, i) => <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">{p}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"><FaEdit className="inline mr-1" />Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {view === 'formulario' && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-red-600 hover:underline text-sm"><FaArrowLeft /> Volver</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">{editingId ? 'Editar Evento' : 'Nuevo Evento SST'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Código *', field: 'codigo' },
                { label: 'Trabajador *', field: 'trabajador' },
                { label: 'Cédula', field: 'cedula' },
                { label: 'Cargo', field: 'cargo' },
                { label: 'Área', field: 'area' },
                { label: 'Sede', field: 'sede' },
                { label: 'Fecha *', field: 'fecha', type: 'date' },
                { label: 'Hora', field: 'hora', type: 'time' },
                { label: 'Días Perdidos', field: 'diasPerdidos', type: 'number' },
                { label: 'Responsable Investigación', field: 'responsableInvestigacion' },
                { label: 'Fecha Investigación', field: 'fechaInvestigacion', type: 'date' },
              ].map(({ label, field, type = 'text' }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as any)[field] ?? ''} onChange={e => setForm(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
                <select value={form.tipo} onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value as TipoEvento }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                  {tiposEvento.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gravedad</label>
                <select value={form.gravedad} onChange={e => setForm(prev => ({ ...prev, gravedad: e.target.value as Gravedad }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                  {gravedades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.estado} onChange={e => setForm(prev => ({ ...prev, estado: e.target.value as EstadoEvento }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
                  {estados.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {['descripcion','causaInmediata','causaBasica','medidasControl'].map(field => (
                <div key={field} className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <textarea value={(form as any)[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Partes del Cuerpo Afectadas</label>
              <div className="flex gap-2 mb-2">
                <input value={partesInput} onChange={e => setPartesInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addParte() }}}
                  placeholder="Ej: Mano derecha" className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                <button type="button" onClick={addParte} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">Agregar</button>
              </div>
              <div className="flex flex-wrap gap-1">
                {form.partesCuerpo.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs flex items-center gap-1">
                    {p} <button onClick={() => removeParte(i)} className="font-bold hover:opacity-70">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Guardar</button>
              <button onClick={() => setView('lista')} className="px-5 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
