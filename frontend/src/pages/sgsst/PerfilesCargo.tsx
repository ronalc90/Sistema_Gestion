import { useState } from 'react'
import { FaSlideshare, FaPlus, FaEdit, FaEye, FaToggleOn, FaToggleOff, FaArrowLeft, FaSearch } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type View = 'dashboard' | 'lista' | 'detalle' | 'formulario'
type NivelRiesgo = 'I' | 'II' | 'III' | 'IV' | 'V'

interface PerfilCargo {
  id: string
  codigo: string
  nombre: string
  area: string
  sede: string
  nivelRiesgo: NivelRiesgo
  descripcion: string
  funciones: string
  riesgosPrincipales: string
  eppRequerido: string[]
  examenesRequeridos: string[]
  capacitaciones: string[]
  certificaciones: string[]
  activo: boolean
}

const mockPerfiles: PerfilCargo[] = [
  {
    id: '1', codigo: 'PC-001', nombre: 'Operario de Producción', area: 'Producción', sede: 'Sede Principal',
    nivelRiesgo: 'III', descripcion: 'Operación de maquinaria y equipos de producción industrial.',
    funciones: 'Operar maquinaria, controlar calidad en línea, reportar anomalías.',
    riesgosPrincipales: 'Atrapamiento, ruido, vibraciones, posturas forzadas',
    eppRequerido: ['Casco', 'Tapabocas', 'Protector auditivo', 'Guantes de vaqueta', 'Botas con puntera'],
    examenesRequeridos: ['Audiometría', 'Visiometría', 'Osteomusuclar', 'Espirometría'],
    capacitaciones: ['Manejo seguro de máquinas', 'Bloqueo y etiquetado', 'Primeros auxilios'],
    certificaciones: ['Operador de máquinas', 'Seguridad industrial básica'],
    activo: true
  },
  {
    id: '2', codigo: 'PC-002', nombre: 'Técnico Electricista', area: 'Mantenimiento', sede: 'Sede Principal',
    nivelRiesgo: 'III', descripcion: 'Mantenimiento y reparación de sistemas eléctricos industriales.',
    funciones: 'Instalación y mantenimiento eléctrico, diagnóstico de fallas, gestión de tableros.',
    riesgosPrincipales: 'Electrocución, arco eléctrico, caídas, quemaduras',
    eppRequerido: ['Casco dieléctrico', 'Guantes dieléctricos', 'Botas dieléctricas', 'Gafas de seguridad', 'Ropa ignífuga'],
    examenesRequeridos: ['Visiometría', 'Electrocardiograma', 'Laboratorio clínico'],
    capacitaciones: ['Trabajo en alturas', 'Riesgo eléctrico', 'Uso de EPP eléctrico'],
    certificaciones: ['RETIE', 'Trabajo en alturas nivel avanzado'],
    activo: true
  },
  {
    id: '3', codigo: 'PC-003', nombre: 'Auxiliar Administrativo', area: 'Administración', sede: 'Sede Norte',
    nivelRiesgo: 'I', descripcion: 'Apoyo a procesos administrativos y gestión documental.',
    funciones: 'Archivo, atención al cliente, digitación, gestión de comunicaciones.',
    riesgosPrincipales: 'Ergonómico por sedestación prolongada, visual por pantallas',
    eppRequerido: ['Filtro de pantalla', 'Reposapiés'],
    examenesRequeridos: ['Visiometría', 'Osteomuscular'],
    capacitaciones: ['Higiene postural', 'Pausas activas', 'Manejo de estrés'],
    certificaciones: [],
    activo: true
  },
  {
    id: '4', codigo: 'PC-004', nombre: 'Conductor', area: 'Logística', sede: 'Sede Principal',
    nivelRiesgo: 'III', descripcion: 'Transporte de personal y mercancías en rutas asignadas.',
    funciones: 'Conducción vehicular, mantenimiento preventivo del vehículo, reportes de ruta.',
    riesgosPrincipales: 'Accidente de tránsito, fatiga, sedestación prolongada',
    eppRequerido: ['Cinturón de seguridad', 'Chaleco reflectivo', 'Gafas de sol'],
    examenesRequeridos: ['Visiometría', 'Psicosensotécnico', 'Laboratorio clínico', 'Psicológico'],
    capacitaciones: ['Conducción segura', 'Manejo defensivo', 'Primeros auxilios vial'],
    certificaciones: ['Licencia de conducción C2', 'Curso de mercancías peligrosas'],
    activo: true
  },
  {
    id: '5', codigo: 'PC-005', nombre: 'Técnico de Laboratorio', area: 'Calidad', sede: 'Sede Principal',
    nivelRiesgo: 'II', descripcion: 'Análisis y control de calidad en laboratorio de producción.',
    funciones: 'Toma de muestras, análisis físico-químico, registro de resultados, calibración de equipos.',
    riesgosPrincipales: 'Exposición química, biológica, salpicaduras, cortes',
    eppRequerido: ['Bata de laboratorio', 'Guantes de nitrilo', 'Gafas de seguridad', 'Tapabocas N95'],
    examenesRequeridos: ['Audiometría', 'Espirometría', 'Visiometría', 'Laboratorio completo'],
    capacitaciones: ['Manejo de sustancias químicas', 'Bioseguridad', 'Gestión de residuos peligrosos'],
    certificaciones: ['BPL - Buenas Prácticas de Laboratorio'],
    activo: true
  },
  {
    id: '6', codigo: 'PC-006', nombre: 'Jefe de Mantenimiento', area: 'Mantenimiento', sede: 'Sede Principal',
    nivelRiesgo: 'III', descripcion: 'Gestión y supervisión del área de mantenimiento industrial.',
    funciones: 'Planificación de mantenimiento, supervisión de equipos, gestión de contratistas.',
    riesgosPrincipales: 'Riesgo eléctrico, mecánico, locativos, caídas en altura',
    eppRequerido: ['Casco', 'Gafas de seguridad', 'Botas con puntera', 'Guantes'],
    examenesRequeridos: ['Visiometría', 'Osteomuscular', 'Electrocardiograma', 'Laboratorio clínico'],
    capacitaciones: ['Trabajo en alturas', 'Bloqueo/etiquetado LOTO', 'Gestión del riesgo'],
    certificaciones: ['Coordinador de trabajo en alturas'],
    activo: true
  },
  {
    id: '7', codigo: 'PC-007', nombre: 'Analista de Calidad', area: 'Calidad', sede: 'Sede Sur',
    nivelRiesgo: 'II', descripcion: 'Análisis, control e implementación de sistemas de calidad.',
    funciones: 'Auditorías internas, análisis de no conformidades, indicadores de calidad.',
    riesgosPrincipales: 'Ergonómico, visual, estrés laboral',
    eppRequerido: ['Bata', 'Guantes de nitrilo', 'Gafas de seguridad'],
    examenesRequeridos: ['Visiometría', 'Osteomuscular', 'Psicológico'],
    capacitaciones: ['Auditorías ISO 9001', 'Herramientas de calidad', 'Manejo del estrés'],
    certificaciones: ['Auditor interno ISO 9001'],
    activo: true
  },
  {
    id: '8', codigo: 'PC-008', nombre: 'Almacenista', area: 'Logística', sede: 'Sede Norte',
    nivelRiesgo: 'II', descripcion: 'Gestión de almacén, recepción y despacho de materiales.',
    funciones: 'Recepción, almacenamiento, control de inventarios, despacho de materiales.',
    riesgosPrincipales: 'Caída de objetos, sobreesfuerzo, montacargas, locativos',
    eppRequerido: ['Casco', 'Chaleco reflectivo', 'Botas con puntera', 'Guantes de cuero'],
    examenesRequeridos: ['Osteomuscular', 'Visiometría', 'Audiometría'],
    capacitaciones: ['Manejo de cargas', 'Operación de montacargas', 'Orden y aseo'],
    certificaciones: ['Operador de montacargas'],
    activo: false
  }
]

const nivelRiesgoColors: Record<NivelRiesgo, string> = {
  'I': 'bg-green-100 text-green-700',
  'II': 'bg-yellow-100 text-yellow-700',
  'III': 'bg-orange-100 text-orange-700',
  'IV': 'bg-red-100 text-red-700',
  'V': 'bg-red-200 text-red-900'
}

const emptyForm: Omit<PerfilCargo, 'id'> = {
  codigo: '', nombre: '', area: '', sede: '', nivelRiesgo: 'I',
  descripcion: '', funciones: '', riesgosPrincipales: '',
  eppRequerido: [], examenesRequeridos: [], capacitaciones: [], certificaciones: [],
  activo: true
}

export default function PerfilesCargo() {
  const [view, setView] = useState<View>('dashboard')
  const [perfiles, setPerfiles] = useState<PerfilCargo[]>(mockPerfiles)
  const [selected, setSelected] = useState<PerfilCargo | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterRiesgo, setFilterRiesgo] = useState('')
  const [form, setForm] = useState<Omit<PerfilCargo, 'id'>>(emptyForm)
  const [eppInput, setEppInput] = useState('')
  const [examInput, setExamInput] = useState('')
  const [capInput, setCapInput] = useState('')
  const [certInput, setCertInput] = useState('')

  const filteredPerfiles = perfiles.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.area.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase())
    const matchRiesgo = filterRiesgo === '' || p.nivelRiesgo === filterRiesgo
    return matchSearch && matchRiesgo
  })

  const byRiesgo = ['I', 'II', 'III', 'IV', 'V'].map(r => perfiles.filter(p => p.nivelRiesgo === r).length)
  const areas = [...new Set(perfiles.map(p => p.area))]
  const byArea = areas.map(a => perfiles.filter(p => p.area === a).length)

  const doughnutData = {
    labels: ['Riesgo I', 'Riesgo II', 'Riesgo III', 'Riesgo IV', 'Riesgo V'],
    datasets: [{ data: byRiesgo, backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444', '#991b1b'], borderWidth: 2 }]
  }
  const barData = {
    labels: areas,
    datasets: [{ label: 'Perfiles por área', data: byArea, backgroundColor: '#9333ea', borderRadius: 6 }]
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setEppInput(''); setExamInput(''); setCapInput(''); setCertInput(''); setView('formulario') }
  const openEdit = (p: PerfilCargo) => {
    setForm({ codigo: p.codigo, nombre: p.nombre, area: p.area, sede: p.sede, nivelRiesgo: p.nivelRiesgo,
      descripcion: p.descripcion, funciones: p.funciones, riesgosPrincipales: p.riesgosPrincipales,
      eppRequerido: [...p.eppRequerido], examenesRequeridos: [...p.examenesRequeridos],
      capacitaciones: [...p.capacitaciones], certificaciones: [...p.certificaciones], activo: p.activo })
    setEditingId(p.id); setEppInput(''); setExamInput(''); setCapInput(''); setCertInput(''); setView('formulario')
  }
  const openDetail = (p: PerfilCargo) => { setSelected(p); setView('detalle') }

  const handleToggleActivo = (id: string) => {
    setPerfiles(prev => prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p))
    toast.success('Estado actualizado')
  }

  const addTag = (field: 'eppRequerido' | 'examenesRequeridos' | 'capacitaciones' | 'certificaciones', value: string) => {
    if (!value.trim()) return
    setForm(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }))
  }
  const removeTag = (field: 'eppRequerido' | 'examenesRequeridos' | 'capacitaciones' | 'certificaciones', idx: number) => {
    setForm(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }))
  }

  const handleSave = () => {
    if (!form.codigo || !form.nombre || !form.area || !form.sede) {
      toast.error('Complete los campos obligatorios'); return
    }
    if (editingId) {
      setPerfiles(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p))
      toast.success('Perfil actualizado correctamente')
    } else {
      const newP: PerfilCargo = { ...form, id: Date.now().toString() }
      setPerfiles(prev => [...prev, newP])
      toast.success('Perfil creado correctamente')
    }
    setView('lista')
  }

  const TagPills = ({ items, color }: { items: string[], color: string }) => (
    <div className="flex flex-wrap gap-1">
      {items.map((item, i) => <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{item}</span>)}
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600 text-xl"><FaSlideshare /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Perfiles de Cargo SST</h1>
            <p className="text-sm text-gray-500">Gestión de perfiles ocupacionales y requisitos SST</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'lista'].map(v => (
            <button key={v} onClick={() => setView(v as View)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border hover:bg-purple-50'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
            <FaPlus /> Nuevo Perfil
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Perfiles', value: perfiles.length, color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { label: 'Activos', value: perfiles.filter(p => p.activo).length, color: 'bg-green-50 border-green-200 text-green-700' },
              { label: 'Riesgo Alto (III+)', value: perfiles.filter(p => ['III','IV','V'].includes(p.nivelRiesgo)).length, color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { label: 'Áreas Cubiertas', value: areas.length, color: 'bg-blue-50 border-blue-200 text-blue-700' }
            ].map((kpi, i) => (
              <div key={i} className={`border rounded-xl p-4 ${kpi.color}`}>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-sm mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Distribución por Nivel de Riesgo</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'right' } }, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Perfiles por Área</h3>
              <div className="h-56">
                <Bar data={barData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold text-gray-700">Resumen de Perfiles</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Cargo','Área','Nivel Riesgo','EPP Req.','Estado'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {perfiles.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-purple-600">{p.codigo}</td>
                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-500">{p.area}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${nivelRiesgoColors[p.nivelRiesgo]}`}>Nivel {p.nivelRiesgo}</span></td>
                    <td className="px-4 py-3 text-gray-600">{p.eppRequerido.length} items</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cargo, área, código..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <select value={filterRiesgo} onChange={e => setFilterRiesgo(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
              <option value="">Todos los niveles</option>
              {['I','II','III','IV','V'].map(r => <option key={r} value={r}>Nivel {r}</option>)}
            </select>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Cargo','Área','Sede','Nivel Riesgo','EPP','Exámenes','Estado','Acciones'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPerfiles.map(p => (
                  <tr key={p.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-purple-600 text-xs">{p.codigo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-500">{p.area}</td>
                    <td className="px-4 py-3 text-gray-500">{p.sede}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${nivelRiesgoColors[p.nivelRiesgo]}`}>Nivel {p.nivelRiesgo}</span></td>
                    <td className="px-4 py-3 text-gray-600">{p.eppRequerido.length}</td>
                    <td className="px-4 py-3 text-gray-600">{p.examenesRequeridos.length}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openDetail(p)} className="p-1.5 text-purple-600 hover:bg-purple-100 rounded"><FaEye /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FaEdit /></button>
                        <button onClick={() => handleToggleActivo(p.id)} className={`p-1.5 rounded ${p.activo ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}`}>
                          {p.activo ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPerfiles.length === 0 && <div className="text-center py-10 text-gray-400">No se encontraron perfiles</div>}
          </div>
        </div>
      )}

      {/* Detalle */}
      {view === 'detalle' && selected && (
        <div className="max-w-4xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-purple-600 hover:underline text-sm"><FaArrowLeft /> Volver a lista</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.nombre}</h2>
                <p className="text-sm text-gray-500">{selected.codigo} — {selected.area} — {selected.sede}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${nivelRiesgoColors[selected.nivelRiesgo]}`}>Nivel de Riesgo {selected.nivelRiesgo}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${selected.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{selected.activo ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><h4 className="font-semibold text-gray-700 mb-1">Descripción</h4><p className="text-sm text-gray-600">{selected.descripcion}</p></div>
              <div><h4 className="font-semibold text-gray-700 mb-1">Funciones</h4><p className="text-sm text-gray-600">{selected.funciones}</p></div>
              <div className="md:col-span-2"><h4 className="font-semibold text-gray-700 mb-1">Riesgos Principales</h4><p className="text-sm text-gray-600">{selected.riesgosPrincipales}</p></div>
              <div><h4 className="font-semibold text-gray-700 mb-2">EPP Requerido</h4><TagPills items={selected.eppRequerido} color="bg-orange-100 text-orange-700" /></div>
              <div><h4 className="font-semibold text-gray-700 mb-2">Exámenes Requeridos</h4><TagPills items={selected.examenesRequeridos} color="bg-blue-100 text-blue-700" /></div>
              <div><h4 className="font-semibold text-gray-700 mb-2">Capacitaciones</h4><TagPills items={selected.capacitaciones} color="bg-purple-100 text-purple-700" /></div>
              <div><h4 className="font-semibold text-gray-700 mb-2">Certificaciones</h4><TagPills items={selected.certificaciones} color="bg-green-100 text-green-700" /></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"><FaEdit className="inline mr-1" />Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {view === 'formulario' && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-purple-600 hover:underline text-sm"><FaArrowLeft /> Volver</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">{editingId ? 'Editar Perfil de Cargo' : 'Nuevo Perfil de Cargo'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Código *', field: 'codigo', type: 'text' },
                { label: 'Nombre del Cargo *', field: 'nombre', type: 'text' },
                { label: 'Área *', field: 'area', type: 'text' },
                { label: 'Sede *', field: 'sede', type: 'text' },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as any)[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Riesgo</label>
                <select value={form.nivelRiesgo} onChange={e => setForm(prev => ({ ...prev, nivelRiesgo: e.target.value as NivelRiesgo }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {['I','II','III','IV','V'].map(r => <option key={r} value={r}>Nivel {r}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Funciones</label>
                <textarea value={form.funciones} onChange={e => setForm(prev => ({ ...prev, funciones: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Riesgos Principales</label>
                <textarea value={form.riesgosPrincipales} onChange={e => setForm(prev => ({ ...prev, riesgosPrincipales: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
            </div>
            {/* Tag inputs */}
            {[
              { label: 'EPP Requerido', field: 'eppRequerido' as const, input: eppInput, setInput: setEppInput, color: 'bg-orange-100 text-orange-700' },
              { label: 'Exámenes Requeridos', field: 'examenesRequeridos' as const, input: examInput, setInput: setExamInput, color: 'bg-blue-100 text-blue-700' },
              { label: 'Capacitaciones', field: 'capacitaciones' as const, input: capInput, setInput: setCapInput, color: 'bg-purple-100 text-purple-700' },
              { label: 'Certificaciones', field: 'certificaciones' as const, input: certInput, setInput: setCertInput, color: 'bg-green-100 text-green-700' },
            ].map(({ label, field, input, setInput, color }) => (
              <div key={field} className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex gap-2 mb-2">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(field, input); setInput('') }}}
                    placeholder="Escribe y presiona Enter" className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  <button type="button" onClick={() => { addTag(field, input); setInput('') }} className="px-3 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm hover:bg-purple-200">Agregar</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {form[field].map((item, i) => (
                    <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium ${color} flex items-center gap-1`}>
                      {item} <button onClick={() => removeTag(field, i)} className="ml-1 font-bold hover:opacity-70">×</button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4 flex items-center gap-2">
              <input type="checkbox" id="activo" checked={form.activo} onChange={e => setForm(prev => ({ ...prev, activo: e.target.checked }))} className="h-4 w-4 accent-purple-600" />
              <label htmlFor="activo" className="text-sm text-gray-700">Perfil activo</label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Guardar</button>
              <button onClick={() => setView('lista')} className="px-5 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
