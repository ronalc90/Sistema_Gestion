import { useEffect, useState } from 'react';
import { 
  TruckIcon, 
  UserIcon, 
  DocumentTextIcon, 
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { seguridadVialApi } from '../../../api/seguridadVial.api';
import type { DashboardSeguridadVial } from '../../../types';

const defaultDashboard: DashboardSeguridadVial = {
  totalVehiculos: 0,
  vehiculosActivos: 0,
  vehiculosEnMantenimiento: 0,
  vehiculosSOATVencido: 0,
  vehiculosTecnoVencido: 0,
  totalConductores: 0,
  conductoresLicenciaVencida: 0,
  totalComparendos: 0,
  comparendosPendientes: 0,
  comparendosMes: 0,
  inspeccionesHoy: 0,
  inspeccionesAprobadas: 0,
  inspeccionesConNovedades: 0,
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardVial() {
  const [data, setData] = useState<DashboardSeguridadVial>(defaultDashboard);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await seguridadVialApi.getDashboard();
        setData(res.data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vehículos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TruckIcon className="w-5 h-5" />
          Estado de Vehículos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Vehículos"
            value={data.totalVehiculos}
            icon={TruckIcon}
            color="blue"
            subtitle="En el sistema"
          />
          <StatCard
            title="Vehículos Activos"
            value={data.vehiculosActivos}
            icon={CheckCircleIcon}
            color="green"
            subtitle="Operativos"
          />
          <StatCard
            title="En Mantenimiento"
            value={data.vehiculosEnMantenimiento}
            icon={CalendarIcon}
            color="yellow"
            subtitle="Temporalmente fuera"
          />
          <StatCard
            title="SOAT Vencido"
            value={data.vehiculosSOATVencido}
            icon={ExclamationTriangleIcon}
            color="red"
            subtitle="Requieren renovación"
          />
        </div>
      </div>

      {/* Conductores y Comparendos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Conductores
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Conductores"
              value={data.totalConductores}
              icon={UserIcon}
              color="blue"
            />
            <StatCard
              title="Licencias Vencidas"
              value={data.conductoresLicenciaVencida}
              icon={XCircleIcon}
              color="red"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5" />
            Comparendos
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Comparendos"
              value={data.totalComparendos}
              icon={DocumentTextIcon}
              color="purple"
            />
            <StatCard
              title="Pendientes"
              value={data.comparendosPendientes}
              icon={ExclamationTriangleIcon}
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Inspecciones */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <ClipboardDocumentCheckIcon className="w-5 h-5" />
          Inspecciones Preoperacionales - Hoy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Inspecciones"
            value={data.inspeccionesHoy}
            icon={ClipboardDocumentCheckIcon}
            color="blue"
            subtitle="Realizadas hoy"
          />
          <StatCard
            title="Aprobadas"
            value={data.inspeccionesAprobadas}
            icon={CheckCircleIcon}
            color="green"
            subtitle="Sin novedades"
          />
          <StatCard
            title="Con Novedades"
            value={data.inspeccionesConNovedades}
            icon={ExclamationTriangleIcon}
            color="yellow"
            subtitle="Requieren atención"
          />
        </div>
      </div>
    </div>
  );
}
