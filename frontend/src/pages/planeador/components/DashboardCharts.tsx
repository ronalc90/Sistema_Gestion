import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import type { DashboardActividades } from '../../../types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface Props {
  data: DashboardActividades;
  loading?: boolean;
}

export default function DashboardCharts({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const prioridadData = {
    labels: ['Baja', 'Media', 'Alta', 'Urgente'],
    datasets: [
      {
        data: [data.porPrioridad.BAJA, data.porPrioridad.MEDIA, data.porPrioridad.ALTA, data.porPrioridad.URGENTE],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',  // gray
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(249, 115, 22, 0.8)',   // orange
          'rgba(239, 68, 68, 0.8)',    // red
        ],
        borderColor: [
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const phvaData = {
    labels: ['Planear', 'Hacer', 'Verificar', 'Actuar'],
    datasets: [
      {
        label: 'Actividades',
        data: [data.porPHVA.PLANEAR, data.porPHVA.HACER, data.porPHVA.VERIFICAR, data.porPHVA.ACTUAR],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(34, 197, 94, 0.8)',    // green
          'rgba(234, 179, 8, 0.8)',    // yellow
          'rgba(168, 85, 247, 0.8)',   // purple
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const cumplimientoData = {
    labels: ['Cumplido', 'Pendiente'],
    datasets: [
      {
        data: [data.indicadorCumplimiento, 100 - data.indicadorCumplimiento],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',    // green
          'rgba(229, 231, 235, 0.5)',  // gray light
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(209, 213, 219)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563',
        },
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#4B5563',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const hasData = data.totalActividades > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gráfico de Cumplimiento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Indicador de Cumplimiento
        </h3>
        <div className="h-64 relative">
          {hasData ? (
            <Doughnut 
              data={cumplimientoData} 
              options={{
                ...commonOptions,
                cutout: '70%',
              }} 
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No hay datos para el gráfico</p>
            </div>
          )}
          {hasData && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {data.indicadorCumplimiento}%
                </p>
                <p className="text-xs text-gray-500">Cumplimiento</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Prioridades */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Prioridad de Actividades
        </h3>
        <div className="h-64">
          {hasData ? (
            <Pie data={prioridadData} options={commonOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No hay datos para el gráfico</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de PHVA */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Actividades por PHVA
        </h3>
        <div className="h-64">
          {hasData ? (
            <Bar data={phvaData} options={barOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-sm">No hay datos para el gráfico</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
