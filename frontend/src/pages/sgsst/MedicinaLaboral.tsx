import { useState } from 'react'
import { FaUserMd, FaPlus, FaEdit, FaEye, FaArrowLeft, FaSearch, FaExclamationTriangle } from 'react-icons/fa'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

type View = 'dashboard' | 'lista' | 'detalle' | 'formulario'
type TipoExamen = 'Ingreso' | 'Periódico' | 'Egreso' | 'Post-incapacidad' | 'Reubicación'
type ResultadoExamen = 'Apto' | 'Apto con restricciones' | 'No apto' | 'Pendiente'

interface ExamenMedico {
  id: string
  codigo: string
  trabajador: string
  cedula: string
  cargo: string
  area: string
  sede: string
  tipoExamen: TipoExamen
  fechaExamen: string
  fechaVencimiento: string
  medico: string
  entidad: string
  resultado: ResultadoExamen
  restricciones?: string
  observaciones?: string
  vigente: boolean
}

const isVigente = (fechaVencimiento: string): boolean => {
  return new Date(fechaVencimiento) >= new Date()
}

const mockExamenes: ExamenMedico[] = [
  {
    id: '1', codigo: 'EXM-001', trabajador: 'Carlos Martínez', cedula: '10234567', cargo: 'Operario de Producción',
    area: 'Producción', sede: 'Sede Principal', tipoExamen: 'Periódico', fechaExamen: '2025-03-10',
    fechaVencimiento: '2026-03-10', medico: 'Dr. Andrés Ospina', entidad: 'IPS Salud Laboral S.A.',
    resultado: 'Apto', vigente: true
  },
  {
    id: '2', codigo: 'EXM-002', trabajador: 'Ana Gómez', cedula: '52345678', cargo: 'Técnico de Laboratorio',
    area: 'Calidad', sede: 'Sede Principal', tipoExamen: 'Ingreso', fechaExamen: '2025-06-15',
    fechaVencimiento: '2026-06-15', medico: 'Dra. Carmen Ruiz', entidad: 'Clínica del Trabajo',
    resultado: 'Apto con restricciones', restricciones: 'No exponer a productos químicos volátiles por más de 4 horas continuas.',
    vigente: true
  },
  {
    id: '3', codigo: 'EXM-003', trabajador: 'Luis Rodríguez', cedula: '80456789', cargo: 'Conductor',
    area: 'Logística', sede: 'Sede Principal', tipoExamen: 'Post-incapacidad', fechaExamen: '2026-02-28',
    fechaVencimiento: '2027-02-28', medico: 'Dr. Héctor Morales', entidad: 'IPS Ocupacional Ltda.',
    resultado: 'Apto', vigente: true
  },
  {
    id: '4', codigo: 'EXM-004', trabajador: 'María Castillo', cedula: '43567890', cargo: 'Auxiliar Administrativo',
    area: 'Administración', sede: 'Sede Norte', tipoExamen: 'Periódico', fechaExamen: '2024-09-05',
    fechaVencimiento: '2025-09-05', medico: 'Dra. Lucía Vargas', entidad: 'Centro Médico Empresarial',
    resultado: 'Apto', vigente: false
  },
  {
    id: '5', codigo: 'EXM-005', trabajador: 'Jorge Herrera', cedula: '71678901', cargo: 'Almacenista',
    area: 'Logística', sede: 'Sede Norte', tipoExamen: 'Ingreso', fechaExamen: '2025-11-20',
    fechaVencimiento: '2026-11-20', medico: 'Dr. Andrés Ospina', entidad: 'IPS Salud Laboral S.A.',
    resultado: 'Apto', vigente: true
  },
  {
    id: '6', codigo: 'EXM-006', trabajador: 'Patricia Silva', cedula: '32789012', cargo: 'Analista de Calidad',
    area: 'Calidad', sede: 'Sede Sur', tipoExamen: 'Reubicación', fechaExamen: '2026-01-10',
    fechaVencimiento: '2027-01-10', medico: 'Dra. Carmen Ruiz', entidad: 'Clínica del Trabajo',
    resultado: 'Apto con restricciones', restricciones: 'Evitar bipedestación prolongada mayor a 2 horas.',
    vigente: true
  },
  {
    id: '7', codigo: 'EXM-007', trabajador: 'Hernán Torres', cedula: '19890123', cargo: 'Técnico Electricista',
    area: 'Mantenimiento', sede: 'Sede Principal', tipoExamen: 'Periódico', fechaExamen: '2024-08-12',
    fechaVencimiento: '2025-08-12', medico: 'Dr. Héctor Morales', entidad: 'IPS Ocupacional Ltda.',
    resultado: 'No apto', observaciones: 'Pendiente concepto de especialista. Restricción temporal de trabajo en alturas.',
    vigente: false
  },
  {
    id: '8', codigo: 'EXM-008', trabajador: 'Sandra López', cedula: '60901234', cargo: 'Jefe de Mantenimiento',
    area: 'Mantenimiento', sede: 'Sede Principal', tipoExamen: 'Periódico', fechaExamen: '2026-03-01',
    fechaVencimiento: '2026-03-30', medico: 'Dra. Lucía Vargas', entidad: 'Centro Médico Empresarial',
    resultado: 'Pendiente', vigente: true
  },
  {
    id: '9', codigo: 'EXM-009', trabajador: 'Roberto Pinto', cedula: '91234567', cargo: 'Operario de Producción',
    area: 'Producción', sede: 'Sede Sur', tipoExamen: 'Egreso', fechaExamen: '2026-02-15',
    fechaVencimiento: '2026-02-15', medico: 'Dr. Andrés Ospina', entidad: 'IPS Salud Laboral S.A.',
    resultado: 'Apto', vigente: false
  },
  {
    id: '10', codigo: 'EXM-010', trabajador: 'Camila Moreno', cedula: '23456789', cargo: 'Analista de Calidad',
    area: 'Calidad', sede: 'Sede Norte', tipoExamen: 'Ingreso', fechaExamen: '2026-03-10',
    fechaVencimiento: '2027-03-10', medico: 'Dra. Carmen Ruiz', entidad: 'Clínica del Trabajo',
    resultado: 'Apto', vigente: true
  }
]

const resultadoColors: Record<ResultadoExamen, string> = {
  'Apto': 'bg-green-100 text-green-700',
  'Apto con restricciones': 'bg-yellow-100 text-yellow-700',
  'No apto': 'bg-red-100 text-red-700',
  'Pendiente': 'bg-gray-100 text-gray-600'
}

const tiposExamen: TipoExamen[] = ['Ingreso', 'Periódico', 'Egreso', 'Post-incapacidad', 'Reubicación']
const resultados: ResultadoExamen[] = ['Apto', 'Apto con restricciones', 'No apto', 'Pendiente']

const emptyForm: Omit<ExamenMedico, 'id' | 'vigente'> = {
  codigo: '', trabajador: '', cedula: '', cargo: '', area: '', sede: '',
  tipoExamen: 'Ingreso', fechaExamen: '', fechaVencimiento: '', medico: '', entidad: '',
  resultado: 'Pendiente', restricciones: '', observaciones: ''
}

export default function MedicinaLaboral() {
  const [view, setView] = useState<View>('dashboard')
  const [examenes, setExamenes] = useState<ExamenMedico[]>(mockExamenes)
  const [selected, setSelected] = useState<ExamenMedico | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterResultado, setFilterResultado] = useState('')
  const [form, setForm] = useState<Omit<ExamenMedico, 'id' | 'vigente'>>(emptyForm)

  const filtered = examenes.filter(e => {
    const matchSearch = e.trabajador.toLowerCase().includes(search.toLowerCase()) || e.cedula.includes(search) || e.codigo.includes(search)
    const matchTipo = filterTipo === '' || e.tipoExamen === filterTipo
    const matchRes = filterResultado === '' || e.resultado === filterResultado
    return matchSearch && matchTipo && matchRes
  })

  const vigentes = examenes.filter(e => e.vigente).length
  const vencidos = examenes.filter(e => !e.vigente).length
  const resultadoConteos = resultados.map(r => examenes.filter(e => e.resultado === r).length)
  const tipoConteos = tiposExamen.map(t => examenes.filter(e => e.tipoExamen === t).length)

  const doughnutData = {
    labels: resultados,
    datasets: [{ data: resultadoConteos, backgroundColor: ['#22c55e','#eab308','#ef4444','#9ca3af'], borderWidth: 2 }]
  }
  const barData = {
    labels: tiposExamen,
    datasets: [{ label: 'Exámenes por tipo', data: tipoConteos, backgroundColor: '#16a34a', borderRadius: 6 }]
  }

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setView('formulario') }
  const openEdit = (e: ExamenMedico) => {
    setForm({ codigo: e.codigo, trabajador: e.trabajador, cedula: e.cedula, cargo: e.cargo, area: e.area, sede: e.sede,
      tipoExamen: e.tipoExamen, fechaExamen: e.fechaExamen, fechaVencimiento: e.fechaVencimiento,
      medico: e.medico, entidad: e.entidad, resultado: e.resultado, restricciones: e.restricciones, observaciones: e.observaciones })
    setEditingId(e.id); setView('formulario')
  }
  const openDetail = (e: ExamenMedico) => { setSelected(e); setView('detalle') }

  const handleSave = () => {
    if (!form.codigo || !form.trabajador || !form.cedula || !form.fechaExamen || !form.medico) {
      toast.error('Complete los campos obligatorios'); return
    }
    const vigente = isVigente(form.fechaVencimiento)
    if (editingId) {
      setExamenes(prev => prev.map(e => e.id === editingId ? { ...e, ...form, vigente } : e))
      toast.success('Examen actualizado correctamente')
    } else {
      setExamenes(prev => [...prev, { ...form, id: Date.now().toString(), vigente }])
      toast.success('Examen registrado correctamente')
    }
    setView('lista')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg text-green-600 text-xl"><FaUserMd /></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Medicina Laboral</h1>
            <p className="text-sm text-gray-500">Control de exámenes médicos ocupacionales</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['dashboard', 'lista'].map(v => (
            <button key={v} onClick={() => setView(v as View)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border hover:bg-green-50'}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            <FaPlus /> Nuevo Examen
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {view === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Exámenes', value: examenes.length, color: 'bg-green-50 border-green-200 text-green-700' },
              { label: 'Vigentes', value: vigentes, color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { label: 'Vencidos', value: vencidos, color: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'No Aptos', value: examenes.filter(e => e.resultado === 'No apto').length, color: 'bg-orange-50 border-orange-200 text-orange-700' }
            ].map((kpi, i) => (
              <div key={i} className={`border rounded-xl p-4 ${kpi.color}`}>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <div className="text-sm mt-1">{kpi.label}</div>
              </div>
            ))}
          </div>
          {vencidos > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700">Exámenes vencidos</p>
                <p className="text-sm text-red-600">{vencidos} trabajador(es) tienen exámenes médicos vencidos. Se recomienda programar exámenes de forma inmediata.</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Distribución por Resultado</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'right' } }, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Exámenes por Tipo</h3>
              <div className="h-56">
                <Bar data={barData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b"><h3 className="font-semibold text-gray-700">Exámenes Recientes</h3></div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Trabajador','Tipo','Fecha Examen','Vencimiento','Resultado','Estado'].map(h => <th key={h} className="px-4 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {examenes.slice(0, 5).map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-green-600 text-xs">{e.codigo}</td>
                    <td className="px-4 py-3 font-medium">{e.trabajador}</td>
                    <td className="px-4 py-3 text-gray-500">{e.tipoExamen}</td>
                    <td className="px-4 py-3 text-gray-500">{e.fechaExamen}</td>
                    <td className={`px-4 py-3 text-xs font-medium ${e.vigente ? 'text-green-600' : 'text-red-600'}`}>{e.fechaVencimiento}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${resultadoColors[e.resultado]}`}>{e.resultado}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${e.vigente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.vigente ? 'Vigente' : 'Vencido'}</span></td>
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
                className="pl-9 pr-4 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
              <option value="">Todos los tipos</option>
              {tiposExamen.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterResultado} onChange={e => setFilterResultado(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
              <option value="">Todos los resultados</option>
              {resultados.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>{['Código','Trabajador','Cargo','Tipo','Fecha Examen','Vencimiento','Resultado','Vigencia','Acciones'].map(h => <th key={h} className="px-3 py-3 text-left">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-3 py-3 font-mono text-green-600 text-xs">{e.codigo}</td>
                    <td className="px-3 py-3 font-medium">{e.trabajador}</td>
                    <td className="px-3 py-3 text-gray-500 text-xs">{e.cargo}</td>
                    <td className="px-3 py-3 text-gray-600">{e.tipoExamen}</td>
                    <td className="px-3 py-3 text-gray-500">{e.fechaExamen}</td>
                    <td className={`px-3 py-3 text-xs font-medium ${e.vigente ? 'text-green-600' : 'text-red-600'}`}>{e.fechaVencimiento}</td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${resultadoColors[e.resultado]}`}>{e.resultado}</span></td>
                    <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${e.vigente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.vigente ? 'Vigente' : 'Vencido'}</span></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(e)} className="p-1.5 text-green-600 hover:bg-green-100 rounded"><FaEye /></button>
                        <button onClick={() => openEdit(e)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FaEdit /></button>
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
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-green-600 hover:underline text-sm"><FaArrowLeft /> Volver a lista</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.trabajador}</h2>
                <p className="text-sm text-gray-500">{selected.cedula} — {selected.cargo} — {selected.area}</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${resultadoColors[selected.resultado]}`}>{selected.resultado}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${selected.vigente ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selected.vigente ? 'Vigente' : 'Vencido'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                { label: 'Código', value: selected.codigo },
                { label: 'Sede', value: selected.sede },
                { label: 'Tipo de Examen', value: selected.tipoExamen },
                { label: 'Fecha Examen', value: selected.fechaExamen },
                { label: 'Fecha Vencimiento', value: selected.fechaVencimiento },
                { label: 'Médico', value: selected.medico },
                { label: 'Entidad', value: selected.entidad },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="font-medium text-gray-700">{value}</p>
                </div>
              ))}
              {selected.restricciones && (
                <div className="col-span-3">
                  <p className="text-xs text-gray-400 uppercase mb-0.5">Restricciones</p>
                  <p className="text-yellow-700 bg-yellow-50 rounded-lg p-2 text-sm">{selected.restricciones}</p>
                </div>
              )}
              {selected.observaciones && (
                <div className="col-span-3">
                  <p className="text-xs text-gray-400 uppercase mb-0.5">Observaciones</p>
                  <p className="text-gray-600">{selected.observaciones}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <button onClick={() => openEdit(selected)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"><FaEdit className="inline mr-1" />Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {view === 'formulario' && (
        <div className="max-w-3xl space-y-4">
          <button onClick={() => setView('lista')} className="flex items-center gap-2 text-green-600 hover:underline text-sm"><FaArrowLeft /> Volver</button>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5">{editingId ? 'Editar Examen Médico' : 'Nuevo Examen Médico'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Código *', field: 'codigo' },
                { label: 'Trabajador *', field: 'trabajador' },
                { label: 'Cédula *', field: 'cedula' },
                { label: 'Cargo', field: 'cargo' },
                { label: 'Área', field: 'area' },
                { label: 'Sede', field: 'sede' },
                { label: 'Fecha Examen *', field: 'fechaExamen', type: 'date' },
                { label: 'Fecha Vencimiento', field: 'fechaVencimiento', type: 'date' },
                { label: 'Médico *', field: 'medico' },
                { label: 'Entidad', field: 'entidad' },
              ].map(({ label, field, type = 'text' }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={(form as any)[field] ?? ''} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Examen</label>
                <select value={form.tipoExamen} onChange={e => setForm(prev => ({ ...prev, tipoExamen: e.target.value as TipoExamen }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                  {tiposExamen.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
                <select value={form.resultado} onChange={e => setForm(prev => ({ ...prev, resultado: e.target.value as ResultadoExamen }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                  {resultados.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Restricciones</label>
                <textarea value={form.restricciones || ''} onChange={e => setForm(prev => ({ ...prev, restricciones: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea value={form.observaciones || ''} onChange={e => setForm(prev => ({ ...prev, observaciones: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Guardar</button>
              <button onClick={() => setView('lista')} className="px-5 py-2 border text-gray-600 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
