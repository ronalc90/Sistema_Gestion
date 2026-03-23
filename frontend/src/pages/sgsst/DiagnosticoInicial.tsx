import { useState } from 'react'
import { FaClipboard, FaInfoCircle, FaEdit, FaCog, FaSearch, FaDownload } from 'react-icons/fa'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type TabType = 'estandares' | 'informe'

interface Criterio {
  numeral: string
  criterio: string
  semaforo: 'verde' | 'amarillo' | 'rojo' | 'azul'
  cumplimiento: string
  documentos: number
}

const criteriosData: Criterio[] = [
  { numeral: '1.1.1', criterio: 'Asignar una persona que cumpla con el siguiente perfil: El diseño e implementación del Sistema de Gestión de SST podrá ser realizado por profesionales en SST, profesionales con posgrado en SST...', semaforo: 'verde', cumplimiento: 'CT', documentos: 0 },
  { numeral: '1.1.2', criterio: 'Asignar y documentar las responsabilidades específicas en el Sistema de Gestión SST a todos los niveles de la organización, para el desarrollo y mejora continua de dicho Sistema.', semaforo: 'verde', cumplimiento: 'CT', documentos: 0 },
  { numeral: '1.1.3', criterio: 'Definir y asignar el talento humano, los recursos financieros, técnicos y tecnológicos, requeridos para la implementación, mantenimiento y continuidad del Sistema de Gestión de SST.', semaforo: 'verde', cumplimiento: 'CT', documentos: 0 },
  { numeral: '1.1.4', criterio: 'Garantizar que todos los trabajadores, independientemente de su forma de vinculación o contratación están afiliados al Sistema de Seguridad Social en Salud, Pensión y Riesgos Laborales.', semaforo: 'verde', cumplimiento: 'CT', documentos: 0 },
  { numeral: '1.1.5', criterio: 'En el caso que aplique, identificar a los trabajadores que se dediquen en forma permanente al ejercicio de las actividades de alto riesgo establecidas en el Decreto 2090 de 2003...', semaforo: 'azul', cumplimiento: 'NAJ', documentos: 0 },
  { numeral: '1.2.1', criterio: 'Adoptar una política de Seguridad y Salud en el Trabajo que sea pertinente con el tipo de actividad económica, tamaño de la empresa y diseñada con participación de los trabajadores.', semaforo: 'verde', cumplimiento: 'CT', documentos: 2 },
  { numeral: '2.1.1', criterio: 'Realizar la identificación de peligros, evaluación y valoración de riesgos con la participación de los trabajadores, visitantes y contratistas donde aplique.', semaforo: 'amarillo', cumplimiento: 'CP', documentos: 1 },
  { numeral: '2.2.1', criterio: 'Establecer un plan de trabajo anual que contenga objetivos, metas, responsable y recursos definidos, basado en los resultados del diagnóstico inicial.', semaforo: 'verde', cumplimiento: 'CT', documentos: 3 },
]

const barData = {
  labels: ['GESTIÓN DE\nRECURSOS', 'GESTIÓN DE\nRIESGOS', 'MEJORAMIENTO', 'VERIFICACIÓN', 'GESTIÓN\nDOCUMENTAL'],
  datasets: [
    {
      label: 'Cumplimiento (%)',
      data: [75, 95, 100, 100, 90, 85],
      backgroundColor: '#3b82f6',
      borderRadius: 4,
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
      max: 100,
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

const doughnutData = {
  labels: ['Planeado', 'Hecho', 'Verificado', 'Actuar'],
  datasets: [
    {
      data: [25, 25, 25, 25],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      borderWidth: 2,
      borderColor: '#ffffff',
    },
  ],
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
  },
}

export default function DiagnosticoInicial() {
  const [activeTab, setActiveTab] = useState<TabType>('estandares')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCriterios = criteriosData.filter(c => 
    c.criterio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.numeral.includes(searchTerm)
  )

  const getSemaforoColor = (semaforo: string) => {
    switch (semaforo) {
      case 'verde': return 'bg-green-500'
      case 'amarillo': return 'bg-yellow-500'
      case 'rojo': return 'bg-red-500'
      case 'azul': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          CumplimientoPeriodo: Visualizar matriz legal SG-SST de un período
        </h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-full shrink-0">
            <FaInfoCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
              ¿Para qué es este formulario de visualizar matriz legal SG-SST de un período?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              En este formulario podrás visualizar la matriz legal de la empresa según el período que has seleccionado anteriormente.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('estandares')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'estandares'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Estándares mínimos
          </button>
          <button
            onClick={() => setActiveTab('informe')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'informe'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            Informe acciones de mejora definidas
          </button>
        </nav>
      </div>

      {activeTab === 'estandares' && (
        <>
          {/* Dashboard Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Panel - Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Diagnóstico inicial</h2>
              
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg font-semibold text-lg mb-2">
                Completado general: 91.2%
              </div>
              
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Completado parcial: 95.6%
              </p>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Los porcentajes mostrados en los gráficos es de la sumatoria general, ya que es la que especifica la norma!
              </p>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                ¡¡El completado parcial es una muestra de progreso, sin embargo, el porcentaje que es tenido en cuenta es el completado general!!
              </p>

              <button className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors">
                <FaInfoCircle />
                Ayuda: Resultados de la evaluación de Estándares Mínimos
              </button>
            </div>

            {/* Middle Panel - Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">Informe acciones de mejora definidas</h3>
              <div className="h-64">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            {/* Right Panel - Doughnut Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
              <div className="relative h-48 w-48">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">I PLANEAR</span>
                  <span className="text-3xl font-bold text-gray-800 dark:text-white">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input py-1 text-sm pr-8"
                    placeholder="..."
                  />
                  <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                </div>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1">
                  <FaDownload className="w-3 h-3" />
                  Excel
                </button>
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
                  {filteredCriterios.map((item) => (
                    <tr key={item.numeral} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{item.numeral}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{item.criterio}</td>
                      <td className="px-4 py-3 text-center">
                        <div className={`inline-block w-4 h-4 rounded-full ${getSemaforoColor(item.semaforo)}`} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.cumplimiento}</span>
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
                Mostrando 1 al {filteredCriterios.length} de {criteriosData.length} registros
              </p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                  Anterior
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  2
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'informe' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
          <FaClipboard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Informe de Acciones de Mejora</h3>
          <p className="text-gray-500 dark:text-gray-400">Seleccione un período para visualizar las acciones de mejora definidas</p>
        </div>
      )}
    </div>
  )
}
