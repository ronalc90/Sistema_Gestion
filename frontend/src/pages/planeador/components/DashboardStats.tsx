import { 
  ClipboardDocumentListIcon, 
  CalendarIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import type { DashboardActividades } from '../../../types';

interface Props {
  data: DashboardActividades;
  loading?: boolean;
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle,
  trend
}: { 
  title: string; 
  value: string | number; 
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  subtitle?: string;
  trend?: { value: number; positive: boolean };
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    gray: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  };

  return (
    <div className={`rounded-xl border p-5 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtitle && <p className="mt-1 text-xs opacity-70">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? <ArrowTrendingUpIcon className="w-3 h-3" /> : <ArrowTrendingDownIcon className="w-3 h-3" />}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const presupuestoVariacion = data.presupuestoAsignado > 0 
    ? Math.round((data.presupuestoEjecutado / data.presupuestoAsignado) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Indicadores principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Actividades"
          value={data.totalActividades}
          icon={ClipboardDocumentListIcon}
          color="blue"
          subtitle="Registradas en el sistema"
        />
        <StatCard
          title="Mes Actual"
          value={data.actividadesMesActual}
          icon={CalendarIcon}
          color="green"
          subtitle="Actividades programadas"
        />
        <StatCard
          title="Sin Sede Asignada"
          value={data.actividadesSinSede}
          icon={MapPinIcon}
          color="yellow"
          subtitle="Requieren asignación"
        />
        <StatCard
          title="Indicador Cumplimiento"
          value={`${data.indicadorCumplimiento}%`}
          icon={CheckCircleIcon}
          color="purple"
          subtitle="Meta: 90%"
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Actividades Vencidas"
          value={data.actividadesVencidas}
          icon={ExclamationCircleIcon}
          color="red"
          subtitle="Requieren atención urgente"
        />
        <StatCard
          title="Presupuesto Asignado"
          value={`$${(data.presupuestoAsignado / 1000000).toFixed(1)}M`}
          icon={CurrencyDollarIcon}
          color="blue"
          subtitle="Total periodo"
        />
        <StatCard
          title="Presupuesto Ejecutado"
          value={`$${(data.presupuestoEjecutado / 1000000).toFixed(1)}M`}
          icon={CurrencyDollarIcon}
          color="green"
          subtitle={`${presupuestoVariacion}% del asignado`}
        />
        <StatCard
          title="Variación Presupuesto"
          value={`${presupuestoVariacion}%`}
          icon={presupuestoVariacion > 100 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon}
          color={presupuestoVariacion > 100 ? 'red' : 'green'}
          subtitle={presupuestoVariacion > 100 ? 'Sobre ejecución' : 'Dentro del presupuesto'}
        />
      </div>
    </div>
  );
}
