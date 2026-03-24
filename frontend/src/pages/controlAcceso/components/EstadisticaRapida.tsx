import { useEffect, useState } from 'react';
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
import { Doughnut, Bar } from 'react-chartjs-2';
import { controlAccesoApi, catalogosAcceso } from '../../../api/controlAcceso.api';
import type { DashboardControlAcceso } from '../../../types';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const defaultDashboard: DashboardControlAcceso = {
  accesosMesActual: 0,
  accesosHoy: 0,
  accesosPorTipo: { EMPLEADO: 0, CONTRATISTA: 0, VISITANTE: 0 },
  accesosPorMes: [],
  personasDentro: 0,
  visitantesActivos: 0,
  alertasPendientes: 0,
};

export default function EstadisticaRapida() {
  const [data, setData] = useState<DashboardControlAcceso>(defaultDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await controlAccesoApi.getDashboard();
        setData(res.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const doughnutData = {
    labels: catalogosAcceso.tiposPersona.map(t => t.label),
    datasets: [
      {
        data: [
          data.accesosPorTipo.EMPLEADO,
          data.accesosPorTipo.CONTRATISTA,
          data.accesosPorTipo.VISITANTE,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(249, 115, 22, 0.8)',   // orange
          'rgba(168, 85, 247, 0.8)',   // purple
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: data.accesosPorMes.map(m => m.mes),
    datasets: [
      {
        label: 'Accesos',
        data: data.accesosPorMes.map(m => m.cantidad),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const hasData = data.accesosMesActual > 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Accesos este mes */}
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Accesos este mes</p>
          <p className="text-4xl font-bold text-gray-800 dark:text-gray-100 mt-2">
            Total {data.accesosMesActual}
          </p>
        </div>

        {/* Gráfico Donut */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Conteo general de ingresos por tipo de persona
          </h3>
          <div className="h-64 relative">
            {hasData ? (
              <Doughnut 
                data={doughnutData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                      },
                    },
                  },
                  cutout: '60%',
                }} 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No hay datos para el gráfico
              </div>
            )}
          </div>
          
          {/* Leyenda personalizada */}
          {hasData && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {catalogosAcceso.tiposPersona.map((tipo, index) => {
                const colors = ['bg-blue-500', 'bg-orange-500', 'bg-purple-500'];
                return (
                  <div key={tipo.value} className="text-center">
                    <div className={`w-3 h-3 ${colors[index]} rounded-full mx-auto mb-1`} />
                    <p className="text-xs text-gray-600 dark:text-gray-400">{tipo.label}</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {data.accesosPorTipo[tipo.value as keyof typeof data.accesosPorTipo]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-center text-gray-700 dark:text-gray-300 mb-4">
          Conteo de accesos por mes (año actual)
        </h3>
        <div className="h-64">
          {hasData ? (
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <p>No hay datos para el gráfico</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
