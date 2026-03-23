import { useState } from 'react'
import { FaListOl, FaInfoCircle, FaEdit, FaCog, FaSearch, FaDownload, faCheck } from 'react-icons/fa'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type TabType = 'estandares' | 'informe' | 'matriz' | 'operaciones'

interface Criterio {
  numeral: string
  criterio: string
  semaforo: 'verde' | 'amarillo' | 'rojo' | 'azul' | ''
  cumplimiento: string
  documentos: number
}

const criteriosData: Criterio[] = [
  { numeral: '1.1.1', criterio: 'Asignar una persona que cumpla con el siguiente perfil: El diseño e implementación del Sistema de Gestión de SST podrá ser realizado por profesionales en SST, profesionales con posgrado en SST, que c...', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.2', criterio: 'Asignar y documentar las responsabilidades específicas en el Sistema de Gestión SST a todos los niveles de la organización, para el desarrollo y mejora continua de dicho Sistema.', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.3', criterio: 'Definir y asignar el talento humano, los recursos financieros, técnicos y tecnológicos, requeridos para la implementación, mantenimiento y continuidad del Sistema de Gestión de SST.', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.4', criterio: 'Garantizar que todos los trabajadores, independientemente de su forma de vinculación o contratación están afiliados al Sistema de Seguridad Social en Salud, Pensión y Riesgos Laborales.', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.5', criterio: 'En el caso que aplique, identificar a los trabajadores que se dediquen en forma permanente al ejercicio de las actividades de alto riesgo establecidas en el Decreto 2090 de 2003 o de las normas que lo...', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.6', criterio: 'Conformar y garantizar el funcionamiento del Comité Paritario de Seguridad y Salud en el Trabajo – COPASST.', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.7', criterio: 'Capacitar a lo (sic) integrantes del COPASST para el cumplimiento efectivo de las responsabilidades que les asigna la ley.', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.1.8', criterio: 'Conformar y garantizar el funcionamiento del Comité de Convivencia Laboral de acuerdo con la normatividad vigente.', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.2.1', criterio: 'Elaborar y ejecutar el programa de capacitación en promoción y prevención, que incluye lo referente a los peligros/riesgos prioritarios y las medidas de prevención y control, extensivo a todos los niv...', semaforo: '', cumplimiento: '', documentos: 0 },
  { numeral: '1.2.2', criterio: 'Realizar actividades de inducción y reinducción, las cuales deben estar incluidas en el programa de capacitación, dirigidas a todos los trabajadores, independientemente de su forma de vinculación y/o ...', semaforo: '', cumplimiento: '', documentos: 0 },
]

const barData = {
  labels: ['VERIFICACIÓN', 'MEJORAMIENTO', 'GESTIÓN DE RIESGOS', 'GESTIÓN DE RECURSOS'],
  datasets: [
    {
      label: 'Cumplimiento',
      data: [0, 0, 0, 0],
      backgroundColor: '#3b82f6',
      borderRadius: 2,
    },
  ],
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 1,
      ticks: {
        callback: (value: number) => value + '%',
        color: '#6b7280',
        font: { size: 11 },
      },
      grid: {
        color: '#e5e7eb',
        drawBorder: false,
      },
    },
    x: {
      ticks: {
        color: '#6b7280',
        font: { size: 10 },
      },
      grid: { display: false },
    },
  },
}

const cumplimientos = [
  { value: 'CT', label: 'CT - Cumple totalmente' },
  { value: 'CP', label: 'CP - Cumple parcialmente' },
  { value: 'NC', label: 'NC - No cumple' },
  { value: 'NAJ', label: 'NAJ - No aplica justificado' },
  { value: 'NAS', label: 'NAS - No aplica No justificado' },
]

export default function MatrizLegal() {
  const [activeTab, setActiveTab] = useState<TabType>('estandares')
  const [periodo, setPeriodo] = useState('2022-01')
  const [completadoGeneral] = useState(0)
  const [completadoParcial] = useState(0)
  const [cumplimientoMasivo, setCumplimientoMasivo] = useState('')

  const handleEstablecerCumplimiento = () => {
    if (!cumplimientoMasivo) {
      toast.error('Seleccione un tipo de cumplimiento')
      return
    }
    toast.success(`Cumplimiento "${cumplimientoMasivo}" establecido masivamente`)
  }

  const getSemaforoColor = (semaforo: string) => {
    switch (semaforo) {
      case 'verde': return 'bg-green-500'
      case 'amarillo': return 'bg-yellow-500'
      case 'rojo': return 'bg-red-500'
      case 'azul': return 'bg-blue-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          CumplimientoPeriodo: Visualizar matriz legal SG-SST de un periodo
        </h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-full shrink-0">
            <FaInfoCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              ¿Para qué es este formulario de visualizar matriz legal SG-SST de un periodo?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              En este formulario podrás visualizar la matriz legal de la empresa según el periodo que has seleccionado anteriormente.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6">
          {[
            { id: 'estandares', label: 'Estándares mínimos' },
            { id: 'informe', label: 'Informe acciones de mejora definidas' },
            { id: 'matriz', label: 'Matriz general' },
            { id: 'operaciones', label: 'Operaciones masivas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'estandares' && (
        <>
          {/* Periodo Selector */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Periodo:</span>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="form-select"
              >
                <option value="2022-01">2022-01</option>
                <option value="2022-02">2022-02</option>
                <option value="2023-01">2023-01</option>
                <option value="2023-02">2023-02</option>
              </select>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Diagnóstico inicial</h3>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Completado general: {completadoGeneral}%
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Completado parcial: {completadoParcial}%
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Los porcentajes mostrados en los gráficos es de la sumatoria general, ya que es la que especifica la norma!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ¡¡El completado parcial es una muestra de progreso, sin embargo, el porcentaje que es tenido en cuenta es el completado general!!
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="relative h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">No hay datos para el gráfico</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I PLANEAR</h3>
              <div className="relative h-48">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mostrando</span>
                <select className="form-select py-1 text-sm w-20">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">resultados por página</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Buscar:</span>
                <input type="text" className="form-input py-1 text-sm" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-16">Numeral</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Criterio</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-24">Semaforo</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-24">Cumplimiento</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-24">Documentos</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase w-20">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {criteriosData.map((item) => (
                    <tr key={item.numeral} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{item.numeral}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{item.criterio}</td>
                      <td className="px-4 py-3 text-center">
                        <div className={`inline-block w-4 h-4 rounded-full ${getSemaforoColor(item.semaforo)}`} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.cumplimiento || '-'}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{item.documentos}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
                            <FaEdit className="w-3 h-3" />
                          </button>
                          <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                            <FaCog className="w-3 h-3" />
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total registros encontrados: {criteriosData.length}
              </p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                  Previo
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">2</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">3</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">...</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">6</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'operaciones' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            Utilice esta opción cuando quiera establecer el cumplimiento del periodo o la matriz masivamente para los numerales sin evaluar.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cumplimiento:</label>
              <select
                value={cumplimientoMasivo}
                onChange={(e) => setCumplimientoMasivo(e.target.value)}
                className="form-select w-full"
              >
                <option value="">Seleccione uno</option>
                {cumplimientos.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleEstablecerCumplimiento}
              className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
            >
              Establecer cumplimiento
            </button>
          </div>

          <div className="flex justify-center mt-8">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              Regresar al escritorio
            </button>
          </div>
        </div>
      )}

      {activeTab === 'informe' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FaListOl className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Informe de Acciones de Mejora</h3>
          <p className="text-gray-500 dark:text-gray-400">Seleccione un período para visualizar las acciones de mejora definidas</p>
        </div>
      )}

      {activeTab === 'matriz' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <FaListOl className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Matriz General</h3>
          <p className="text-gray-500 dark:text-gray-400">Vista completa de la matriz legal consolidada</p>
        </div>
      )}
    </div>
  )
}
