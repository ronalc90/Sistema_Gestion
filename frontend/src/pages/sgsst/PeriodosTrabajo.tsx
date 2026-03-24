import { useState } from 'react'
import { FaInfoCircle, FaCheck, FaArrowLeft } from 'react-icons/fa'
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
import toast from 'react-hot-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

type TabType = 'establecer' | 'gestionar'

interface Periodo {
  id: string
  nombre: string
  anio: string
  ciclo: string
}

const periodosMock: Periodo[] = [
  { id: '1', nombre: '2020-01', anio: '2020', ciclo: 'I. PLANEAR' },
  { id: '2', nombre: '2020-02', anio: '2020', ciclo: 'II. HACER' },
  { id: '3', nombre: '2021-01', anio: '2021', ciclo: 'III. VERIFICAR' },
  { id: '4', nombre: '2021-02', anio: '2021', ciclo: 'IV. ACTUAR' },
  { id: '5', nombre: '2022-01', anio: '2022', ciclo: 'I. PLANEAR' },
  { id: '6', nombre: '2023-01', anio: '2023', ciclo: 'II. HACER' },
]

const barData = {
  labels: ['GESTIÓN DE RIESGOS', 'GESTIÓN DE RECURSOS', 'GESTIÓN DE DOCUMENTOS', 'GESTIÓN INTEGRAL', 'MEJORAMIENTO CONTINUO', 'RECURSOS HUMANOS', 'VERIFICACIÓN'],
  datasets: [
    {
      label: 'Cumplimiento (%)',
      data: [100, 100, 100, 92, 75, 100, 25],
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
    title: {
      display: true,
      text: 'Resumen por estandar',
      align: 'start' as const,
      font: { size: 14 },
      color: '#374151',
    },
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
        font: { size: 9 },
        maxRotation: 0,
      },
      grid: { display: false },
    },
  },
}

const doughnutData = {
  labels: ['Planear', 'Hacer', 'Verificar', 'Actuar'],
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
  cutout: '65%',
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Resumen por ciclo PHVA',
      align: 'start' as const,
      font: { size: 14 },
      color: '#374151',
      padding: { bottom: 20 },
    },
  },
}

export default function PeriodosTrabajo() {
  const [activeTab, setActiveTab] = useState<TabType>('establecer')
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('2020-01')
  const [periodoActivo, setPeriodoActivo] = useState<string | null>(null)

  const handleEstablecerPeriodo = () => {
    setPeriodoActivo(selectedPeriodo)
    toast.success(`Período ${selectedPeriodo} establecido para esta sesión`)
  }

  const getCicloText = () => {
    const periodo = periodosMock.find(p => p.nombre === selectedPeriodo)
    return periodo?.ciclo || 'II. HACER'
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Periodos: Administrar periodos
        </h1>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-blue-500 rounded-full shrink-0 mt-0.5">
            <FaInfoCircle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
              ¿Para qué es este formulario de administrar periodos?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Aquí podrá administrar tus periodos, estableciendo nuevos o ya creados para trabajar.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('establecer')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'establecer'
                ? 'border-gray-400 text-gray-900 dark:text-white border-2 border-b-0 rounded-t-lg bg-gray-50 dark:bg-gray-800'
                : 'border-transparent text-blue-600 hover:text-blue-800'
            }`}
          >
            Establecer periodo
          </button>
          <button
            onClick={() => setActiveTab('gestionar')}
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'gestionar'
                ? 'border-gray-400 text-gray-900 dark:text-white border-2 border-b-0 rounded-t-lg bg-gray-50 dark:bg-gray-800'
                : 'border-transparent text-blue-600 hover:text-blue-800'
            }`}
          >
            Gestionar periodo
          </button>
        </nav>
      </div>

      {activeTab === 'establecer' && (
        <>
          {/* Tip */}
          <div className="mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-bold">TIP:</span> Cuando seleccione un periodo se mostrará en las gráficas su estado actual. Haga click en el botón{' '}
              <span className="font-bold">Establecer periodo para esta sesión</span> para trabajar en ese periodo.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Año - Periodo:
                </label>
                <select
                  value={selectedPeriodo}
                  onChange={(e) => setSelectedPeriodo(e.target.value)}
                  className="form-select w-full max-w-md"
                >
                  {periodosMock.map((p) => (
                    <option key={p.id} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleEstablecerPeriodo}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FaCheck className="w-4 h-4" />
                Establecer periodo para esta sesión
              </button>

              {periodoActivo && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✓ Período activo: <strong>{periodoActivo}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Right Panel - PHVA Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="relative h-64">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{getCicloText()}</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Chart - Resumen por estandar */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="h-72">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
              <FaArrowLeft className="w-4 h-4" />
              Regresar al escritorio
            </button>
          </div>
        </>
      )}

      {activeTab === 'gestionar' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gestionar Períodos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            En esta sección podrá crear, editar y eliminar períodos de trabajo para el sistema SG-SST.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Período</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Año</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Ciclo PHVA</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {periodosMock.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{p.nombre}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.anio}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.ciclo}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        periodoActivo === p.nombre
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {periodoActivo === p.nombre ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedPeriodo(p.nombre)
                          setActiveTab('establecer')
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
