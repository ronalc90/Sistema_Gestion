import { useState, useEffect, useCallback } from 'react';
import { 
  CalendarIcon, 
  TableCellsIcon, 
  ListBulletIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import PageHeader from '../../components/common/PageHeader';
import DashboardStats from './components/DashboardStats';
import DashboardCharts from './components/DashboardCharts';
import TablaActividadesMes from './components/TablaActividadesMes';
import TablaCompletaActividades from './components/TablaCompletaActividades';
import CalendarioMensual from './components/CalendarioMensual';
import AgendaDiaria from './components/AgendaDiaria';
import FiltrosPanel from './components/FiltrosPanel';
import ActividadModal from './components/ActividadModal';
import ReportesPanel from './components/ReportesPanel';
import ConfirmModal from '../../components/common/ConfirmModal';
import { planeadorActividadesApi } from '../../api/planeadorActividades.api';
import type { 
  ActividadPlaneada, 
  DashboardActividades, 
  FiltrosActividades 
} from '../../types';
import toast from 'react-hot-toast';

type VistaActual = 'dashboard' | 'tabla' | 'calendario' | 'agenda' | 'reportes';

const defaultFiltros: FiltrosActividades = {};

const defaultDashboard: DashboardActividades = {
  totalActividades: 0,
  actividadesMesActual: 0,
  actividadesSinSede: 0,
  indicadorCumplimiento: 0,
  porPrioridad: { BAJA: 0, MEDIA: 0, ALTA: 0, URGENTE: 0 },
  porPHVA: { PLANEAR: 0, HACER: 0, VERIFICAR: 0, ACTUAR: 0 },
  porEstado: { PLANEADO: 0, EN_PROCESO: 0, REPROGRAMADO: 0, FINALIZADA: 0, CANCELADA: 0 },
  actividadesVencidas: 0,
  presupuestoAsignado: 0,
  presupuestoEjecutado: 0,
};

export default function PlaneadorActividades() {
  const [vistaActual, setVistaActual] = useState<VistaActual>('dashboard');
  const [dashboard, setDashboard] = useState<DashboardActividades>(defaultDashboard);
  const [actividades, setActividades] = useState<ActividadPlaneada[]>([]);
  const [filtros, setFiltros] = useState<FiltrosActividades>(defaultFiltros);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingActividades, setLoadingActividades] = useState(true);
  const [modalActividad, setModalActividad] = useState<'create' | 'edit' | null>(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<ActividadPlaneada | null>(null);
  const [modalEliminar, setModalEliminar] = useState(false);

  // Cargar dashboard
  const cargarDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const res = await planeadorActividadesApi.getDashboard();
      setDashboard(res.data);
    } catch (error) {
      toast.error('Error al cargar el dashboard');
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  // Cargar actividades
  const cargarActividades = useCallback(async () => {
    try {
      setLoadingActividades(true);
      const res = await planeadorActividadesApi.list(filtros);
      setActividades(res.data);
    } catch (error) {
      toast.error('Error al cargar actividades');
    } finally {
      setLoadingActividades(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarDashboard();
    cargarActividades();
  }, [cargarDashboard, cargarActividades]);

  const handleBuscar = () => {
    cargarActividades();
  };

  const handleLimpiarFiltros = () => {
    setFiltros(defaultFiltros);
    setTimeout(() => cargarActividades(), 0);
  };

  // Tabs de navegación
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: ChartBarIcon },
    { id: 'tabla' as const, label: 'Tabla', icon: TableCellsIcon },
    { id: 'calendario' as const, label: 'Calendario', icon: CalendarIcon },
    { id: 'agenda' as const, label: 'Agenda', icon: ListBulletIcon },
    { id: 'reportes' as const, label: 'Reportes', icon: ChartBarIcon },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Planeador de Actividades SG-SST"
        breadcrumbs={[
          { label: 'SG-SST', path: '/sgsst' },
          { label: 'Planeador de Actividades' }
        ]}
      />

      {/* Acciones principales */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setVistaActual(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all
                ${vistaActual === tab.id 
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                           bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                           bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ArrowUpTrayIcon className="w-4 h-4" />
            Importar
          </button>
          <button 
            onClick={() => { setActividadSeleccionada(null); setModalActividad('create'); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Nueva Actividad
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosPanel
        filtros={filtros}
        onChange={setFiltros}
        onBuscar={handleBuscar}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* Contenido según vista */}
      {vistaActual === 'dashboard' && (
        <div className="space-y-6">
          {/* Estadísticas */}
          <DashboardStats data={dashboard} loading={loadingDashboard} />

          {/* Gráficos */}
          <DashboardCharts data={dashboard} loading={loadingDashboard} />

          {/* Tablas del mes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TablaActividadesMes
              actividades={actividades}
              loading={loadingActividades}
              titulo="Actividades Mes Actual"
              mostrarSede={true}
            />
            <TablaActividadesMes
              actividades={actividades.filter(a => !a.sedeId)}
              loading={loadingActividades}
              titulo="Actividades Sin Sede"
              mostrarSede={false}
            />
          </div>
        </div>
      )}

      {vistaActual === 'tabla' && (
        <TablaCompletaActividades
          actividades={actividades}
          loading={loadingActividades}
          onVer={(act) => { setActividadSeleccionada(act); }}
          onEditar={(act) => { setActividadSeleccionada(act); setModalActividad('edit'); }}
          onEliminar={(act) => { setActividadSeleccionada(act); setModalEliminar(true); }}
        />
      )}

      {vistaActual === 'calendario' && (
        <CalendarioMensual
          actividades={actividades}
          loading={loadingActividades}
          onVerActividad={(act) => console.log('Ver', act)}
        />
      )}

      {vistaActual === 'agenda' && (
        <AgendaDiaria
          actividades={actividades}
          loading={loadingActividades}
          onVerActividad={(act) => console.log('Ver', act)}
        />
      )}

      {vistaActual === 'reportes' && (
        <ReportesPanel
          onGenerarReporte={(params) => {
            console.log('Generar reporte:', params);
            toast.success('Reporte generado exitosamente');
          }}
        />
      )}

      {/* Modal de Actividad */}
      <ActividadModal
        isOpen={modalActividad !== null}
        onClose={() => { setModalActividad(null); setActividadSeleccionada(null); }}
        actividad={actividadSeleccionada}
        onGuardar={(data) => {
          console.log('Guardar:', data);
          toast.success(modalActividad === 'create' ? 'Actividad creada' : 'Actividad actualizada');
          setModalActividad(null);
          setActividadSeleccionada(null);
          cargarActividades();
        }}
        onGuardarNuevo={(data) => {
          console.log('Guardar y nuevo:', data);
          toast.success('Actividad creada');
          setActividadSeleccionada(null);
          cargarActividades();
        }}
      />

      {/* Modal de Confirmar Eliminación */}
      <ConfirmModal
        isOpen={modalEliminar}
        onClose={() => { setModalEliminar(false); setActividadSeleccionada(null); }}
        onConfirm={() => {
          console.log('Eliminar:', actividadSeleccionada);
          toast.success('Actividad eliminada');
          setModalEliminar(false);
          setActividadSeleccionada(null);
          cargarActividades();
        }}
        message={`¿Eliminar la actividad "${actividadSeleccionada?.nombre}"?`}
      />
    </div>
  );
}
