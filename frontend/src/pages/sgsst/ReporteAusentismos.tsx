import { useState } from 'react'
import { FaUserTimes, FaPlus, FaEdit, FaEye, FaArrowLeft, FaSearch, FaCalendarAlt } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type View = 'dashboard' | 'lista' | 'detalle' | 'formulario'
type TipoAusentismo = 'Enfermedad común' | 'Accidente de trabajo' | 'Enfermedad laboral' | 'Licencia' | 'Ausencia injustificada' | 'Calamidad doméstica'
type EstadoAusentismo = 'Activo' | 'Cerrado' | 'En seguimiento'

interface Ausentismo {
  id: string
  codigo: string
  trabajador: string
  cedula: string
  cargo: string
  area: string
  sede: string
  fechaInicio: string
  fechaFin: string
  diasAusentismo: number
  tipoAusentismo: TipoAusentismo
  diagnostico: string
  icd10: string
  entidadARL?: string
  diasIncapacidad: number
  estado: EstadoAusentismo
  observaciones?: string
}

const mockAusentismos: Ausentismo[] = [
  {
    id: '1', codigo: 'AUS-001', trabajador: 'Carlos Martínez', cedula: '10234567', cargo: 'Operario de Producción',
    area: 'Producción', sede: 'Sede Principal', fechaInicio: '2026-01-05', fechaFin: '2026-01-12',
    diasAusentismo: 7, tipoAusentismo: 'Enfermedad común', diagnostico: 'Gripa con complicaciones respiratorias',
    icd10: 'J10.1', diasIncapacidad: 7, estado: 'Cerrado', observaciones: 'Paciente recuperado sin secuelas.'
  },
  {
    id: '2', codigo: 'AUS-002', trabajador: 'Ana Gómez', cedula: '52345678', cargo: 'Técnico de Laboratorio',
    area: 'Calidad', sede: 'Sede Principal', fechaInicio: '2026-01-15', fechaFin: '2026-02-14',
    diasAusentismo: 30, tipoAusentismo: 'Enfermedad laboral', diagnostico: 'Hipoacusia neurosensorial bilateral',
    icd10: 'H83.3', entidadARL: 'SURA', diasIncapacidad: 30, estado: 'En seguimiento',
    observaciones: 'Caso reportado a ARL para calificación de origen.'
  },
  {
    id: '3', codigo: 'AUS-003', trabajador: 'Luis Rodríguez', cedula: '80456789', cargo: 'Conductor',
    area: 'Logística', sede: 'Sede Principal', fechaInicio: '2026-02-03', fechaFin: '2026-02-17',
    diasAusentismo: 14, tipoAusentismo: 'Accidente de trabajo', diagnostico: 'Fractura de radio distal derecho',
    icd10: 'S52.5', entidadARL: 'Positiva', diasIncapacidad: 14, estado: 'Cerrado',
    observaciones: 'Accidente en vía pública, cubierto por ARL.'
  },
  {
    id: '4', codigo: 'AUS-004', trabajador: 'María Castillo', cedula: '43567890', cargo: 'Auxiliar Administrativo',
    area: 'Administración', sede: 'Sede Norte', fechaInicio: '2026-02-20', fechaFin: '2026-03-04',
    diasAusentismo: 12, tipoAusentismo: 'Licencia', diagnostico: 'Licencia de maternidad',
    icd10: 'Z34', diasIncapacidad: 0, estado: 'Cerrado', observaciones: 'Licencia remunerada por ley.'
  },
  {
    id: '5', codigo: 'AUS-005', trabajador: 'Jorge Herrera', cedula: '71678901', cargo: 'Almacenista',
    area: 'Logística', sede: 'Sede Norte', fechaInicio: '2026-02-25', fechaFin: '2026-02-25',
    diasAusentismo: 1, tipoAusentismo: 'Ausencia injustificada', diagnostico: 'No presentó soporte médico',
    icd10: '', diasIncapacidad: 0, estado: 'Cerrado', observaciones: 'Se realizó llamado de atención formal.'
  },
  {
    id: '6', codigo: 'AUS-006', trabajador: 'Patricia Silva', cedula: '32789012', cargo: 'Analista de Calidad',
    area: 'Calidad', sede: 'Sede Sur', fechaInicio: '2026-03-01', fechaFin: '2026-03-05',
    diasAusentismo: 5, tipoAusentismo: 'Calamidad doméstica', diagnostico: 'Fallecimiento familiar primer grado',
    icd10: '', diasIncapacidad: 0, estado: 'Cerrado', observaciones: 'Calamidad doméstica debidamente soportada.'
  },
  {
    id: '7', codigo: 'AUS-007', trabajador: 'Hernán Torres', cedula: '19890123', cargo: 'Técnico Electricista',
    area: 'Mantenimiento', sede: 'Sede Principal', fechaInicio: '2026-03-10', fechaFin: '2026-03-24',
    diasAusentismo: 14, tipoAusentismo: 'Enfermedad común', diagnostico: 'Lumbalgia mecánica aguda',
    icd10: 'M54.5', diasIncapacidad: 14, estado: 'Activo', observaciones: 'En tratamiento fisioterapéutico.'
  },
  {
    id: '8', codigo: 'AUS-008', trabajador: 'Sandra López', cedula: '60901234', cargo: 'Jefe de Mantenimiento',
    area: 'Mantenimiento', sede: 'Sede Principal', fechaInicio: '2026-03-15', fechaFin: '2026-03-22',
    diasAusentismo: 7, tipoAusentismo: 'Enfermedad laboral', diagnostico: 'Síndrome del túnel carpiano bilateral',
    icd10: 'G56.0', entidadARL: 'SURA', diasIncapacidad: 7, estado: 'En seguimiento',
    observaciones: 'Caso abierto con ARL. Pendiente calificación.'
  }
]

const tipoColors: Record<TipoAusentismo, string> = {
  'Enfermedad común': 'bg-blue-100 text-blue-700',
  'Accidente de trabajo': 'bg-red-100 text-red-700',
  'Enfermedad laboral': 'bg-orange-100 text-orange-700',
  'Licencia': 'bg-green-100 text-green-700',
  'Ausencia injustificada': 'bg-gray-100 text-gray-700',
  'Calamidad doméstica': 'bg-purple-100 text-purple-700'
}

const estadoColors: Record<EstadoAusentismo, string> = {
  'Activo': 'bg-yellow-100 text-yellow-700',
  'Cerrado': 'bg-green-100 text-green-700',
  'En seguimiento': 'bg-orange-100 text-orange-700'
}

const tiposList: TipoAusentismo[] = ['Enfermedad común', 'Accidente de trabajo', 'Enfermedad laboral', 'Licencia', 'Ausencia injustificada', 'Calamidad doméstica']

const emptyForm: Omit<Ausentismo, 'id'> = {
  codigo: '', trabajador: '', cedula: '', cargo: '', area: '', sede: '',
  fechaInicio: '', fechaFin: '', diasAusentismo: 0, tipoAusentismo: 'Enfermedad común',
  diagnostico: '', icd10: '', entidadARL: '', diasIncapacidad: 0, estado: 'Activo', observaciones: ''
}

export default function ReporteAusentismos() {
  const [view, setView] = useState<View>('dashboard')
  const [registros, setRegistros] = useState<Ausentismo[]>(mockAusentismos)
  const [selected, setSelected] = useState<Ausentismo | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [form, setForm] = useState<Omit<Ausentismo, 'id'>>(emptyForm)

  const filtered = registros.filter(r => {
    const matchSearch = r.trabajador.toLowerCase().includes(search.toLowerCase()) || r.cedula.includes(search) || r.codigo.includes(search)
    const matchTipo = filterTipo === '' || r.tipoAusentismo === filterTipo
    const matchEstado = filterEstado === '' || r.estado === filterEstado
    return matchSearch && matchTipo && matchEstado
  })

  const totalDias = registros.reduce((s, r) => s + r.diasAusentismo, 0)
  const totalTrabajadores = registros.length
  const meses = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar']
  const mesesData = [2, 1, 3, 2, 3, 4]

  const tipoConteos = tiposList.map(t => registros.filter(r => r.tipoAusentismo === t).length)
  const tipoMasFrecuente = tiposList[tipoConteos.indexOf(Math.max(...tipoConteos))]

  const doughnutData = {
    labels: tiposList,
    datasets: [{ data: tipoConteos, backgroundColor: ['#3b82f6','#ef4444','#f97316','#22c55e','#6b7280','#a855f7'], borderWidth: 2 }]
  }
  const barData = {
    labels: meses,
    datasets: [{ label: 'Ausentismos', data: mesesData, backgroundColor: '#f59e0b', borderRadius: 6 }]
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setView('formulario') }
  const openEdit = (r: Ausentismo) => {
    setForm({ codigo: r.codigo, trabajador: r.trabajador, cedula: r.cedula, cargo: r.cargo, area: r.area, sede: r.sede,
      fechaInicio: r.fechaInicio, fechaFin: r.fechaFin, diasAusentismo: r.diasAusentismo, tipoAusentismo: r.tipoAusentismo,
      diagnostico: r.diagnostico, icd10: r.icd10, entidadARL: r.entidadARL, diasIncapacidad: r.diasIncapacidad,
      estado: r.estado, observaciones: r.observaciones })
    setEditingId(r.id); setView('formulario')
  }
  const openDetail = (r: Ausentismo) => { setSelected(r); setView('detalle') }

  const handleSave = () => {
    if (!form.codigo || !form.trabajador || !form.cedula || !form.fechaInicio) {
      toast.error('Complete los campos obligatorios'); return
    }
    if (editingId) {
      setRegistros(prev => prev.map(r => r.id === editingId ? { ...r, ...form } : r))
      toast.success('Registro actualizado correctamente')
    } else {
      setRegistros(prev => [...prev, { ...form, id: Date.now().toString() }])
      toast.success('Registro creado correctamente')
    }
    setView('lista')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600 text-xl"><FaUserTimes /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reporte de Ausentismos</h1>
            <p className="text-sm text-gray-500">Control y seguimiento de ausencias laborales</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'lista'].map(v => (
            <button key={v} onClick={() => setView(v as View)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border hover:bg-amber-50'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
            <FaPlus /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Ausentismos', value: totalTrabajadores, color: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: 'Días Perdidos', value: totalDias, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Tasa de Ausentismo', value: `${((totalDias / (registros.length * 30)) * 100).toFixed(1)}%`, color: 'bg-orange-50 border-orange-200 text-orange-700' },
              { label: 'Tipo más frecuente', value: tipoMasFrecuente.split(' ')[0], color: 'bg-blue-50 border-blue-200 text-blue-700' }
            ].map((kpi, i) => (
              <div key={i} className={`border rounded-xl p-4 ${kpi.color}`}>
                <div className="text-2xl font-bold">{kpi.value}</div>
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
              <h3 className="font-semibold text-gray-700 mb-4">Ausentismos Últimos 6 Meses</h3>
              <div className="h-56">
                <Bar data={barData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center gap-2">
              <FaCalendarAlt className="text-amber-500" />
              <h3 className="font-semibold text-gray-700">Registros Recientes</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Trabajador','Tipo','Días','Estado'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registros.slice(0, 5).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-amber-600 text-xs">{r.codigo}</td>
                    <td className="px-4 py-3 font-medium">{r.trabajador}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tipoColors[r.tipoAusentismo]}`}>{r.tipoAusentismo}</span></td>
                    <td className="px-4 py-3 font-semibold text-red-600">{r.diasAusentismo}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[r.estado]}`}>{r.estado}</span></td>
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar trabajador, cédula, código..."
                className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
              <option value="">Todos los tipos</option>
              {tiposList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
              <option value="">Todos los estados</option>
              {(['Activo','Cerrado','En seguimiento'] as EstadoAusentismo[]).map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Trabajador','Cargo','Tipo','Inicio','Días','Diagnóstico','Estado','Acciones'].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-amber-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-amber-600 text-xs">{r.codigo}</td>
                    <td className="px-3 py-3 font-medium">{r.trabajador}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{r.cargo}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${tipoColors[r.tipoAusentismo]}`}>{r.tipoAusentismo}</span></td>
                    <td className="px-3 py-3 text-gray-500">{r.fechaInicio}</td>
                    <td className="px-3 py-3 font-semibold text-red-600">{r.diasAusentismo}</td>
                    <td className="px-3 py-3 text-gray-600 max-w-xs truncate">{r.diagnostico}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${estadoColors[r.estado]}`}>{r.estado}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(r)} className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"><FaEye /></button>
                        <button onClick={() => openEdit(r)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FaEdit /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-10 text-gray-400">No se encontraron registros</div>}
          </div>
        </div>
      )}

      {/* Detalle */}
      {view === 'detalle' && selected && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-amber-600 hover:underline text-sm"><FaArrowLeft /> Volver a lista</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.trabajador}</h2>
                <p className="text-sm text-gray-500">{selected.cedula} — {selected.cargo} — {selected.area}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${tipoColors[selected.tipoAusentismo]}`}>{selected.tipoAusentismo}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${estadoColors[selected.estado]}`}>{selected.estado}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                { label: 'Código', value: selected.codigo },
                { label: 'Sede', value: selected.sede },
                { label: 'Días Ausentismo', value: `${selected.diasAusentismo} días` },
                { label: 'Fecha Inicio', value: selected.fechaInicio },
                { label: 'Fecha Fin', value: selected.fechaFin },
                { label: 'Días Incapacidad', value: `${selected.diasIncapacidad} días` },
                { label: 'Diagnóstico', value: selected.diagnostico },
                { label: 'Código ICD-10', value: selected.icd10 || '—' },
                { label: 'Entidad ARL', value: selected.entidadARL || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="font-medium text-gray-700">{value}</p>
                </div>
              ))}
              {selected.observaciones && (
                <div className="col-span-3">
                  <p className="text-xs text-gray-400 uppercase mb-0.5">Observaciones</p>
                  <p className="text-gray-600">{selected.observaciones}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"><FaEdit className="inline mr-1" />Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {view === 'formulario' && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-amber-600 hover:underline text-sm"><FaArrowLeft /> Volver</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">{editingId ? 'Editar Ausentismo' : 'Nuevo Registro de Ausentismo'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Código *', field: 'codigo' },
                { label: 'Trabajador *', field: 'trabajador' },
                { label: 'Cédula *', field: 'cedula' },
                { label: 'Cargo', field: 'cargo' },
                { label: 'Área', field: 'area' },
                { label: 'Sede', field: 'sede' },
                { label: 'Fecha Inicio *', field: 'fechaInicio', type: 'date' },
                { label: 'Fecha Fin', field: 'fechaFin', type: 'date' },
                { label: 'Días Ausentismo', field: 'diasAusentismo', type: 'number' },
                { label: 'Días Incapacidad', field: 'diasIncapacidad', type: 'number' },
                { label: 'Diagnóstico', field: 'diagnostico' },
                { label: 'Código ICD-10', field: 'icd10' },
                { label: 'Entidad ARL', field: 'entidadARL' },
              ].map(({ label, field, type = 'text' }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as any)[field] ?? ''} onChange={e => setForm(prev => ({ ...prev, [field]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ausentismo</label>
                <select value={form.tipoAusentismo} onChange={e => setForm(prev => ({ ...prev, tipoAusentismo: e.target.value as TipoAusentismo }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  {tiposList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={form.estado} onChange={e => setForm(prev => ({ ...prev, estado: e.target.value as EstadoAusentismo }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  {(['Activo','Cerrado','En seguimiento'] as EstadoAusentismo[]).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea value={form.observaciones || ''} onChange={e => setForm(prev => ({ ...prev, observaciones: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Guardar</button>
              <button onClick={() => setView('lista')} className="px-5 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
