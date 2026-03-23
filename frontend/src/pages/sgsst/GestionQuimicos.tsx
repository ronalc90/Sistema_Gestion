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
  FaFlask,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFileAlt,
  FaDownload,
  FaShieldAlt,
  FaFire,
  FaBiohazard,
  FaSkull,
} from 'react-icons/fa'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type View = 'dashboard' | 'lista' | 'detalle' | 'nueva'

type ClasificacionGHS =
  | 'Inflamable'
  | 'Corrosivo'
  | 'Tóxico'
  | 'Oxidante'
  | 'Explosivo'
  | 'Irritante'
  | 'Peligro ambiental'
  | 'Presión'

type EstadoFDS = 'Vigente' | 'Vencida' | 'Pendiente'
type EstadoInventario = 'Normal' | 'Bajo stock' | 'Agotado' | 'Exceso'

interface Quimico {
  id: number
  codigo: string
  nombre: string
  nombreComercial: string
  cas: string
  fabricante: string
  proveedor: string
  sede: string
  area: string
  clasificacionGHS: ClasificacionGHS[]
  estadoFDS: EstadoFDS
  fechaVencimientoFDS: string
  cantidad: number
  unidad: string
  stockMinimo: number
  estadoInventario: EstadoInventario
  almacenamiento: string
  usoDescripcion: string
  epp: string[]
  primerosAuxilios: string
  derrames: string
  responsable: string
  observaciones: string
}

const mockQuimicos: Quimico[] = [
  {
    id: 1,
    codigo: 'QUI-001',
    nombre: 'Ácido clorhídrico',
    nombreComercial: 'Muriático',
    cas: '7647-01-0',
    fabricante: 'Merck',
    proveedor: 'Distribuciones Químicas S.A',
    sede: 'Planta Norte',
    area: 'Producción',
    clasificacionGHS: ['Corrosivo', 'Tóxico'],
    estadoFDS: 'Vigente',
    fechaVencimientoFDS: '2026-06-30',
    cantidad: 80,
    unidad: 'litros',
    stockMinimo: 20,
    estadoInventario: 'Normal',
    almacenamiento: 'Cuarto ventilado, gabinete de ácidos, separado de bases y metales',
    usoDescripcion: 'Limpieza industrial de superficies metálicas y tratamiento de aguas',
    epp: ['Guantes neopreno', 'Careta facial', 'Delantal PVC', 'Botas PVC'],
    primerosAuxilios: 'Contacto piel: lavar con abundante agua 15 min. Ingestión: NO inducir vómito, agua. Inhalación: aire fresco, médico inmediato.',
    derrames: 'Evacuar área. Neutralizar con bicarbonato. Absorber con arena. No usar agua a presión.',
    responsable: 'Carlos Méndez',
    observaciones: 'Almacenar en envases originales. Revisar mensualmente.',
  },
  {
    id: 2,
    codigo: 'QUI-002',
    nombre: 'Hidróxido de sodio',
    nombreComercial: 'Soda cáustica',
    cas: '1310-73-2',
    fabricante: 'Dow Chemical',
    proveedor: 'Químicos del Norte Ltda',
    sede: 'Planta Norte',
    area: 'Producción',
    clasificacionGHS: ['Corrosivo'],
    estadoFDS: 'Vigente',
    fechaVencimientoFDS: '2025-12-31',
    cantidad: 45,
    unidad: 'kg',
    stockMinimo: 15,
    estadoInventario: 'Normal',
    almacenamiento: 'Lugar seco, gabinete de bases. Separado de ácidos.',
    usoDescripcion: 'Ajuste de pH en procesos industriales y limpieza de tuberías.',
    epp: ['Guantes neopreno', 'Gogles', 'Delantal PVC'],
    primerosAuxilios: 'Contacto: lavar agua abundante. Ojos: irrigar 15 min. Ingestión: agua, médico.',
    derrames: 'Absorber con material inerte. No mezclar con ácidos. Disposición como residuo peligroso.',
    responsable: 'Carlos Méndez',
    observaciones: 'Alta higroscopicidad. Mantener bien cerrado.',
  },
  {
    id: 3,
    codigo: 'QUI-003',
    nombre: 'Gasolina',
    nombreComercial: 'Gasolina corriente',
    cas: '8006-61-9',
    fabricante: 'Ecopetrol',
    proveedor: 'Terpel',
    sede: 'Sede Principal',
    area: 'Mantenimiento',
    clasificacionGHS: ['Inflamable'],
    estadoFDS: 'Vencida',
    fechaVencimientoFDS: '2024-09-30',
    cantidad: 5,
    unidad: 'galones',
    stockMinimo: 2,
    estadoInventario: 'Bajo stock',
    almacenamiento: 'Depósito antiexplosión, alejado de fuentes de ignición.',
    usoDescripcion: 'Combustible para equipos y generadores de emergencia.',
    epp: ['Guantes nitrilo', 'Careta facial'],
    primerosAuxilios: 'Inhalación: aire fresco. Piel: lavar con agua y jabón. No inducir vómito en ingestión.',
    derrames: 'Eliminar fuentes de ignición. Absorber con arena. Ventilar área.',
    responsable: 'Andrés López',
    observaciones: 'FDS vencida — requiere actualización urgente.',
  },
  {
    id: 4,
    codigo: 'QUI-004',
    nombre: 'Hipoclorito de sodio',
    nombreComercial: 'Cloro industrial',
    cas: '7681-52-9',
    fabricante: 'Química Básica',
    proveedor: 'Suministros Industriales S.A',
    sede: 'Todas las sedes',
    area: 'Servicios Generales',
    clasificacionGHS: ['Corrosivo', 'Irritante', 'Peligro ambiental'],
    estadoFDS: 'Vigente',
    fechaVencimientoFDS: '2026-03-31',
    cantidad: 120,
    unidad: 'litros',
    stockMinimo: 30,
    estadoInventario: 'Normal',
    almacenamiento: 'Lugar fresco, oscuro. Separado de ácidos y amoniaco.',
    usoDescripcion: 'Desinfección de superficies, tratamiento de agua potable.',
    epp: ['Guantes PVC', 'Gogles', 'Mascarilla respiratoria'],
    primerosAuxilios: 'Piel/ojos: lavar agua. Inhalación: aire fresco. Evitar mezcla con ácidos (libera cloro).',
    derrames: 'Neutralizar con tiosulfato. Absorber. No verter a alcantarillado.',
    responsable: 'María Torres',
    observaciones: 'No mezclar NUNCA con amoníaco ni ácidos.',
  },
  {
    id: 5,
    codigo: 'QUI-005',
    nombre: 'Acetona',
    nombreComercial: 'Acetona técnica',
    cas: '67-64-1',
    fabricante: 'BASF',
    proveedor: 'Químicos del Valle',
    sede: 'Taller',
    area: 'Mantenimiento',
    clasificacionGHS: ['Inflamable', 'Irritante'],
    estadoFDS: 'Vigente',
    fechaVencimientoFDS: '2025-08-31',
    cantidad: 3,
    unidad: 'galones',
    stockMinimo: 5,
    estadoInventario: 'Bajo stock',
    almacenamiento: 'Ambiente ventilado, lejos de llamas. Recipiente metálico cerrado.',
    usoDescripcion: 'Limpieza de herramientas y desengrasar superficies metálicas.',
    epp: ['Guantes nitrilo', 'Gogles', 'Mascarilla orgánica'],
    primerosAuxilios: 'Inhalación: aire fresco. Piel: lavar. Ojos: irrigar 15 min.',
    derrames: 'Eliminar fuentes de ignición. Ventilar. Absorber con arena. Eliminar como residuo peligroso.',
    responsable: 'Andrés López',
    observaciones: 'Stock bajo — solicitar pedido urgente.',
  },
  {
    id: 6,
    codigo: 'QUI-006',
    nombre: 'Asbesto crisotilo',
    nombreComercial: 'N/A',
    cas: '12001-29-5',
    fabricante: 'N/A',
    proveedor: 'N/A',
    sede: 'Bodega antigua',
    area: 'Almacén',
    clasificacionGHS: ['Tóxico'],
    estadoFDS: 'Pendiente',
    fechaVencimientoFDS: '-',
    cantidad: 0,
    unidad: 'kg',
    stockMinimo: 0,
    estadoInventario: 'Agotado',
    almacenamiento: 'Sellado — no manipular sin EPP específico para carcinógenos.',
    usoDescripcion: 'PROHIBIDO — material heredado. En proceso de disposición final.',
    epp: ['Traje tyvek', 'Respirador P100', 'Guantes dobles'],
    primerosAuxilios: 'Inhalación: médico inmediato. Exposición prolongada: vigilancia médica.',
    derrames: 'No barrer. Humedecer y recoger en bolsa roja. Disposición como residuo peligroso especial.',
    responsable: 'Jefe SST',
    observaciones: 'Material PROHIBIDO por ley. Gestionar disposición final con empresa certificada.',
  },
  {
    id: 7,
    codigo: 'QUI-007',
    nombre: 'Nitrógeno líquido',
    nombreComercial: 'N2 criogénico',
    cas: '7727-37-9',
    fabricante: 'Air Products',
    proveedor: 'Gases Industriales Andina',
    sede: 'Laboratorio',
    area: 'Calidad',
    clasificacionGHS: ['Presión'],
    estadoFDS: 'Vigente',
    fechaVencimientoFDS: '2026-01-31',
    cantidad: 2,
    unidad: 'tanques 200L',
    stockMinimo: 1,
    estadoInventario: 'Normal',
    almacenamiento: 'Área ventilada. Tanques encadenados. Detectores de O2 instalados.',
    usoDescripcion: 'Congelación criogénica para conservación de muestras en laboratorio.',
    epp: ['Guantes criogénicos', 'Careta facial', 'Delantal cuero'],
    primerosAuxilios: 'Quemadura criogénica: NO frotar. Agua tibia. Médico inmediato. Asfixia: aire fresco.',
    derrames: 'Evacuar área — riesgo asfixia. Ventilar. Dejar evaporar sin fuentes de calor.',
    responsable: 'Jefe Laboratorio',
    observaciones: 'Nunca almacenar en espacios cerrados sin ventilación adecuada.',
  },
]

const clasificacionIcon: Partial<Record<ClasificacionGHS, JSX.Element>> = {
  Inflamable: <FaFire className="text-orange-500" />,
  Corrosivo: <FaSkull className="text-gray-600" />,
  Tóxico: <FaBiohazard className="text-green-700" />,
  Explosivo: <FaExclamationTriangle className="text-red-500" />,
}

const fdsColor: Record<EstadoFDS, string> = {
  Vigente: 'bg-green-100 text-green-700',
  Vencida: 'bg-red-100 text-red-700',
  Pendiente: 'bg-yellow-100 text-yellow-700',
}

const inventarioColor: Record<EstadoInventario, string> = {
  Normal: 'bg-green-100 text-green-700',
  'Bajo stock': 'bg-yellow-100 text-yellow-700',
  Agotado: 'bg-gray-100 text-gray-600',
  Exceso: 'bg-blue-100 text-blue-700',
}

const emptyForm: Omit<Quimico, 'id' | 'clasificacionGHS' | 'epp'> = {
  codigo: '',
  nombre: '',
  nombreComercial: '',
  cas: '',
  fabricante: '',
  proveedor: '',
  sede: '',
  area: '',
  estadoFDS: 'Vigente',
  fechaVencimientoFDS: '',
  cantidad: 0,
  unidad: '',
  stockMinimo: 0,
  estadoInventario: 'Normal',
  almacenamiento: '',
  usoDescripcion: '',
  primerosAuxilios: '',
  derrames: '',
  responsable: '',
  observaciones: '',
}

export default function GestionQuimicos() {
  const [view, setView] = useState<View>('dashboard')
  const [quimicos, setQuimicos] = useState<Quimico[]>(mockQuimicos)
  const [selected, setSelected] = useState<Quimico | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [filtroFDS, setFiltroFDS] = useState<string>('Todos')
  const [filtroInventario, setFiltroInventario] = useState<string>('Todos')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // KPIs
  const fdsVencidas = quimicos.filter(q => q.estadoFDS === 'Vencida').length
  const fdsPendientes = quimicos.filter(q => q.estadoFDS === 'Pendiente').length
  const bajosStock = quimicos.filter(q => q.estadoInventario === 'Bajo stock').length
  const peligrosos = quimicos.filter(q => q.clasificacionGHS.includes('Tóxico') || q.clasificacionGHS.includes('Explosivo')).length

  // Charts
  const fdsData = {
    labels: ['Vigente', 'Vencida', 'Pendiente'],
    datasets: [
      {
        data: [
          quimicos.filter(q => q.estadoFDS === 'Vigente').length,
          fdsVencidas,
          fdsPendientes,
        ],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
      },
    ],
  }

  const clasificaciones = ['Inflamable', 'Corrosivo', 'Tóxico', 'Oxidante', 'Explosivo', 'Irritante']
  const clasificacionCounts = clasificaciones.map(
    c => quimicos.filter(q => q.clasificacionGHS.includes(c as ClasificacionGHS)).length
  )
  const barData = {
    labels: clasificaciones,
    datasets: [
      {
        label: 'Sustancias',
        data: clasificacionCounts,
        backgroundColor: ['#f97316', '#6b7280', '#16a34a', '#7c3aed', '#dc2626', '#ca8a04'],
        borderRadius: 4,
      },
    ],
  }

  const filtered = quimicos.filter(q => {
    const matchSearch =
      q.nombre.toLowerCase().includes(search.toLowerCase()) ||
      q.codigo.toLowerCase().includes(search.toLowerCase()) ||
      q.cas.includes(search)
    const matchFDS = filtroFDS === 'Todos' || q.estadoFDS === filtroFDS
    const matchInv = filtroInventario === 'Todos' || q.estadoInventario === filtroInventario
    return matchSearch && matchFDS && matchInv
  })

  function handleNew() {
    setForm(emptyForm)
    setEditId(null)
    setView('nueva')
  }

  function handleEdit(q: Quimico) {
    const { clasificacionGHS: _c, epp: _e, id: _i, ...rest } = q
    setForm(rest)
    setEditId(q.id)
    setView('nueva')
  }

  function handleSave() {
    if (!form.codigo || !form.nombre) {
      toast.error('Código y nombre son obligatorios')
      return
    }
    if (editId !== null) {
      setQuimicos(prev =>
        prev.map(q => q.id === editId ? { ...q, ...form } : q)
      )
      toast.success('Sustancia actualizada')
    } else {
      const nueva: Quimico = {
        id: Date.now(),
        clasificacionGHS: [],
        epp: [],
        ...form,
      }
      setQuimicos(prev => [...prev, nueva])
      toast.success('Sustancia registrada')
    }
    setView('lista')
  }

  function handleDelete(id: number) {
    setQuimicos(prev => prev.filter(q => q.id !== id))
    setConfirmDelete(null)
    if (selected?.id === id) setView('lista')
    toast.success('Sustancia eliminada')
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
          <div className="bg-teal-100 p-3 rounded-xl">
            <FaFlask className="text-teal-600 text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Químicos</h1>
            <p className="text-sm text-gray-500">Inventario y Hojas de Seguridad (FDS/SDS)</p>
          </div>
        </div>
        <div className="flex gap-2">
          {view === 'dashboard' && (
            <button
              onClick={() => setView('lista')}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
            >
              <FaFlask /> Ver inventario
            </button>
          )}
          {view === 'lista' && (
            <button
              onClick={handleNew}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700"
            >
              <FaPlus /> Nueva sustancia
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
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                view === v ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'
              }`}
            >
              {v === 'dashboard' ? 'Dashboard' : 'Inventario'}
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
              { label: 'Total sustancias', value: quimicos.length, color: 'teal', icon: <FaFlask /> },
              { label: 'FDS vencidas', value: fdsVencidas, color: 'red', icon: <FaFileAlt /> },
              { label: 'Bajo stock', value: bajosStock, color: 'yellow', icon: <FaExclamationTriangle /> },
              { label: 'Alta peligrosidad', value: peligrosos, color: 'purple', icon: <FaBiohazard /> },
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
              <h3 className="font-semibold text-gray-700 mb-4">Estado de FDS</h3>
              <div className="h-56 flex items-center justify-center">
                <Doughnut data={fdsData} options={{ plugins: { legend: { position: 'bottom' } } }} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-4">Clasificación GHS</h3>
              <div className="h-56">
                <Bar
                  data={barData}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                />
              </div>
            </div>
          </div>

          {/* Alertas */}
          {(fdsVencidas > 0 || fdsPendientes > 0 || bajosStock > 0) && (
            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> Alertas
              </h3>
              <div className="space-y-2">
                {quimicos
                  .filter(q => q.estadoFDS !== 'Vigente' || q.estadoInventario === 'Bajo stock' || q.estadoInventario === 'Agotado')
                  .map(q => (
                    <div key={q.id} className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-2 text-sm">
                      <span className="font-medium text-gray-700">{q.codigo} — {q.nombre}</span>
                      <div className="flex gap-2">
                        {q.estadoFDS !== 'Vigente' && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${fdsColor[q.estadoFDS]}`}>
                            FDS {q.estadoFDS}
                          </span>
                        )}
                        {(q.estadoInventario === 'Bajo stock' || q.estadoInventario === 'Agotado') && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${inventarioColor[q.estadoInventario]}`}>
                            {q.estadoInventario}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== LISTA ===== */}
      {view === 'lista' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <FaSearch className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, código, CAS..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filtroFDS}
                onChange={e => setFiltroFDS(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {['Todos', 'Vigente', 'Vencida', 'Pendiente'].map(o => <option key={o}>{o}</option>)}
              </select>
              <select
                value={filtroInventario}
                onChange={e => setFiltroInventario(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {['Todos', 'Normal', 'Bajo stock', 'Agotado', 'Exceso'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <span className="text-sm text-gray-500 self-center">{filtered.length} sustancia(s)</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Código / Sustancia</th>
                  <th className="px-4 py-3 text-left">Clasificación GHS</th>
                  <th className="px-4 py-3 text-left">Sede / Área</th>
                  <th className="px-4 py-3 text-center">Stock</th>
                  <th className="px-4 py-3 text-center">FDS</th>
                  <th className="px-4 py-3 text-center">Inventario</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{q.nombre}</div>
                      <div className="text-xs text-gray-400">{q.codigo} · CAS: {q.cas}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {q.clasificacionGHS.map(c => (
                          <span key={c} className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                            {clasificacionIcon[c]} {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{q.sede}</div>
                      <div className="text-xs text-gray-400">{q.area}</div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-teal-700">
                      {q.cantidad} {q.unidad}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${fdsColor[q.estadoFDS]}`}>
                        {q.estadoFDS}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${inventarioColor[q.estadoInventario]}`}>
                        {q.estadoInventario}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => { setSelected(q); setView('detalle') }}
                          className="text-teal-500 hover:text-teal-700"
                          title="Ver FDS"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(q)}
                          className="text-yellow-500 hover:text-yellow-700"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(q.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">No se encontraron sustancias</div>
            )}
          </div>
        </div>
      )}

      {/* ===== DETALLE FDS ===== */}
      {view === 'detalle' && selected && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selected.nombre}</h2>
                <p className="text-gray-500 text-sm">
                  {selected.codigo} · Nombre comercial: {selected.nombreComercial} · CAS: {selected.cas}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${fdsColor[selected.estadoFDS]}`}>
                  FDS {selected.estadoFDS}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${inventarioColor[selected.estadoInventario]}`}>
                  {selected.estadoInventario}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
              <div><span className="text-gray-400">Fabricante:</span> <span className="font-medium">{selected.fabricante}</span></div>
              <div><span className="text-gray-400">Proveedor:</span> <span className="font-medium">{selected.proveedor}</span></div>
              <div><span className="text-gray-400">Sede:</span> <span className="font-medium">{selected.sede} — {selected.area}</span></div>
              <div><span className="text-gray-400">Stock:</span> <span className="font-medium text-teal-700">{selected.cantidad} {selected.unidad}</span></div>
              <div><span className="text-gray-400">Stock mínimo:</span> <span className="font-medium">{selected.stockMinimo} {selected.unidad}</span></div>
              <div><span className="text-gray-400">Vence FDS:</span> <span className="font-medium">{selected.fechaVencimientoFDS}</span></div>
              <div><span className="text-gray-400">Responsable:</span> <span className="font-medium">{selected.responsable}</span></div>
            </div>

            {/* Clasificación */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Clasificación GHS</h4>
              <div className="flex gap-2 flex-wrap">
                {selected.clasificacionGHS.map(c => (
                  <span key={c} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 font-medium">
                    {clasificacionIcon[c] || <FaShieldAlt className="text-gray-400" />} {c}
                  </span>
                ))}
              </div>
            </div>

            {/* EPP */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">EPP requerido</h4>
              <div className="flex gap-2 flex-wrap">
                {selected.epp.map((e, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    <FaCheckCircle /> {e}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Secciones FDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Almacenamiento', content: selected.almacenamiento, color: 'blue' },
              { label: 'Primeros auxilios', content: selected.primerosAuxilios, color: 'green' },
              { label: 'Control de derrames', content: selected.derrames, color: 'orange' },
            ].map(s => (
              <div key={s.label} className={`bg-${s.color}-50 rounded-xl p-4 border border-${s.color}-100`}>
                <h4 className={`font-semibold text-${s.color}-700 mb-2`}>{s.label}</h4>
                <p className="text-sm text-gray-700">{s.content}</p>
              </div>
            ))}
          </div>

          {selected.observaciones && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <strong className="text-yellow-700">Observaciones:</strong>
              <p className="text-sm text-gray-700 mt-1">{selected.observaciones}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(selected)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-yellow-600"
            >
              <FaEdit /> Editar
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200">
              <FaDownload /> Exportar FDS
            </button>
          </div>
        </div>
      )}

      {/* ===== FORMULARIO ===== */}
      {view === 'nueva' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            {editId ? 'Editar sustancia' : 'Nueva sustancia química'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Código interno', key: 'codigo' },
              { label: 'Nombre IUPAC / técnico', key: 'nombre' },
              { label: 'Nombre comercial', key: 'nombreComercial' },
              { label: 'Número CAS', key: 'cas' },
              { label: 'Fabricante', key: 'fabricante' },
              { label: 'Proveedor', key: 'proveedor' },
              { label: 'Sede', key: 'sede' },
              { label: 'Área', key: 'area' },
              { label: 'Cantidad actual', key: 'cantidad', type: 'number' },
              { label: 'Unidad', key: 'unidad' },
              { label: 'Stock mínimo', key: 'stockMinimo', type: 'number' },
              { label: 'Fecha vencimiento FDS', key: 'fechaVencimientoFDS', type: 'date' },
              { label: 'Responsable', key: 'responsable' },
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
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado FDS</label>
              <select
                value={form.estadoFDS}
                onChange={e => setForm(p => ({ ...p, estadoFDS: e.target.value as EstadoFDS }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Vigente', 'Vencida', 'Pendiente'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Estado inventario</label>
              <select
                value={form.estadoInventario}
                onChange={e => setForm(p => ({ ...p, estadoInventario: e.target.value as EstadoInventario }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                {['Normal', 'Bajo stock', 'Agotado', 'Exceso'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Almacenamiento</label>
              <textarea
                value={form.almacenamiento}
                onChange={e => setForm(p => ({ ...p, almacenamiento: e.target.value }))}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Uso / Descripción</label>
              <textarea
                value={form.usoDescripcion}
                onChange={e => setForm(p => ({ ...p, usoDescripcion: e.target.value }))}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Primeros auxilios</label>
              <textarea
                value={form.primerosAuxilios}
                onChange={e => setForm(p => ({ ...p, primerosAuxilios: e.target.value }))}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Control de derrames</label>
              <textarea
                value={form.derrames}
                onChange={e => setForm(p => ({ ...p, derrames: e.target.value }))}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Observaciones</label>
              <textarea
                value={form.observaciones}
                onChange={e => setForm(p => ({ ...p, observaciones: e.target.value }))}
                rows={2}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
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
            <h3 className="font-bold text-gray-800 mb-2">¿Eliminar sustancia?</h3>
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
