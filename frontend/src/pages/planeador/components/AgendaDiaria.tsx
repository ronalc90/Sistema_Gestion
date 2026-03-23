import { useState, useMemo } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import type { ActividadPlaneada } from '../../../types';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';

interface Props {
  actividades: ActividadPlaneada[];
  loading?: boolean;
  onVerActividad?: (act: ActividadPlaneada) => void;
}

function getColorPrioridad(prioridad: string): string {
  const map: Record<string, string> = {
    BAJA: 'border-l-gray-400',
    MEDIA: 'border-l-blue-400',
    ALTA: 'border-l-orange-400',
    URGENTE: 'border-l-red-500',
  };
  return map[prioridad] || map.BAJA;
}

function getEstadoClases(estado: string): string {
  const map: Record<string, string> = {
    PLANEADO: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    EN_PROCESO: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    REPROGRAMADO: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    FINALIZADA: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    CANCELADA: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return map[estado] || map.PLANEADO;
}

// const horas = Array.from({ length: 12 }, (_, i) => i + 7); // 7am a 6pm - para futura vista por horas

export default function AgendaDiaria({ actividades, loading, onVerActividad }: Props) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const actividadesDelDia = useMemo(() => {
    const fechaKey = fechaSeleccionada.toISOString().split('T')[0];
    return actividades.filter(act => {
      const inicio = new Date(act.fechaInicio).toISOString().split('T')[0];
      const fin = new Date(act.fechaFin).toISOString().split('T')[0];
      return fechaKey >= inicio && fechaKey <= fin;
    }).sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));
  }, [fechaSeleccionada, actividades]);

  const diaAnterior = () => {
    setFechaSeleccionada(new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() - 1)));
  };

  const diaSiguiente = () => {
    setFechaSeleccionada(new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1)));
  };

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString('es-CO', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const esHoy = (fecha: Date) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  // const getHoraActividad = (hora?: string) => {
  //   if (!hora) return null;
  //   const [h] = hora.split(':').map(Number);
  //   return h;
  // };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className={`text-lg font-semibold ${esHoy(fechaSeleccionada) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>
            {formatearFecha(fechaSeleccionada)}
            {esHoy(fechaSeleccionada) && (
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                Hoy
              </span>
            )}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={diaAnterior}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFechaSeleccionada(new Date())}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={diaSiguiente}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {actividadesDelDia.length} actividades programadas
        </div>
      </div>

      {/* Agenda */}
      <div className="p-4">
        {actividadesDelDia.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No hay actividades programadas para este día</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Selecciona otra fecha o crea una nueva actividad
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {actividadesDelDia.map((act) => (
              <div
                key={act.id}
                onClick={() => onVerActividad?.(act)}
                className={`p-4 rounded-lg border-l-4 bg-gray-50 dark:bg-gray-700/30 
                          hover:bg-gray-100 dark:hover:bg-gray-700/50 
                          cursor-pointer transition-all ${getColorPrioridad(act.prioridad)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-500">{act.codigo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getEstadoClases(act.estado)}`}>
                        {catalogosSGSST.estados.find(e => e.value === act.estado)?.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {act.fasePHVA}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {act.nombre}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {act.descripcion}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                      {act.horaInicio && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          <span>{act.horaInicio} - {act.horaFin || 'Sin hora fin'}</span>
                        </div>
                      )}
                      {act.sede?.nombre && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          <span>{act.sede.nombre}</span>
                        </div>
                      )}
                      {act.responsable?.nombre && (
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-3.5 h-3.5" />
                          <span>{act.responsable.nombre}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <FlagIcon className="w-3.5 h-3.5" />
                        <span className={act.prioridad === 'URGENTE' ? 'text-red-500 font-medium' : ''}>
                          {catalogosSGSST.prioridades.find(p => p.value === act.prioridad)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-1 rounded text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                      {catalogosSGSST.tiposEvento.find(t => t.value === act.tipoEvento)?.label}
                    </span>
                    {act.cantidadParticipantes > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {act.cantidadParticipantes} participantes
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mini calendario de navegación rápida */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 7 }, (_, i) => {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - 3 + i);
            const esSeleccionada = fecha.toDateString() === fechaSeleccionada.toDateString();
            
            return (
              <button
                key={i}
                onClick={() => setFechaSeleccionada(new Date(fecha))}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg min-w-[60px]
                  ${esSeleccionada 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                <span className="text-xs opacity-80">
                  {fecha.toLocaleDateString('es-CO', { weekday: 'short' })}
                </span>
                <span className="text-lg font-semibold">
                  {fecha.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
