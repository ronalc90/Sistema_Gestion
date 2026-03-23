import { useState, useMemo } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import type { ActividadPlaneada } from '../../../types';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';

interface Props {
  actividades: ActividadPlaneada[];
  loading?: boolean;
  onVerActividad?: (act: ActividadPlaneada) => void;
}

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function getColorPrioridad(prioridad: string): string {
  const map: Record<string, string> = {
    BAJA: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    MEDIA: 'bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    ALTA: 'bg-orange-200 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    URGENTE: 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  };
  return map[prioridad] || map.BAJA;
}

export default function CalendarioMensual({ actividades, loading, onVerActividad }: Props) {
  const [fechaActual, setFechaActual] = useState(new Date());

  const { diasCalendario, actividadesPorDia } = useMemo(() => {
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0);
    
    // Día de la semana del primer día (0 = domingo)
    const diaSemanaInicio = primerDia.getDay();
    // Total de días en el mes
    const totalDias = ultimoDia.getDate();
    
    // Generar array de días (incluyendo días del mes anterior para completar la semana)
    const dias: { fecha: Date; esMesActual: boolean; numero: number }[] = [];
    
    // Días del mes anterior
    const diasMesAnterior = diaSemanaInicio;
    const ultimoDiaMesAnterior = new Date(año, mes, 0).getDate();
    for (let i = diasMesAnterior - 1; i >= 0; i--) {
      dias.push({
        fecha: new Date(año, mes - 1, ultimoDiaMesAnterior - i),
        esMesActual: false,
        numero: ultimoDiaMesAnterior - i
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= totalDias; i++) {
      dias.push({
        fecha: new Date(año, mes, i),
        esMesActual: true,
        numero: i
      });
    }
    
    // Días del mes siguiente para completar la cuadrícula (6 filas = 42 días)
    const diasRestantes = 42 - dias.length;
    for (let i = 1; i <= diasRestantes; i++) {
      dias.push({
        fecha: new Date(año, mes + 1, i),
        esMesActual: false,
        numero: i
      });
    }

    // Agrupar actividades por día
    const actividadesDia: Record<string, ActividadPlaneada[]> = {};
    actividades.forEach(act => {
      const fechaInicio = new Date(act.fechaInicio);
      const fechaFin = new Date(act.fechaFin);
      
      // Para cada día del rango de la actividad
      for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0];
        if (!actividadesDia[key]) actividadesDia[key] = [];
        // Evitar duplicados si la actividad dura varios días
        if (!actividadesDia[key].find(a => a.id === act.id)) {
          actividadesDia[key].push(act);
        }
      }
    });

    return { diasCalendario: dias, actividadesPorDia: actividadesDia };
  }, [fechaActual, actividades]);

  const mesAnterior = () => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1));
  };

  const mesSiguiente = () => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1));
  };

  const hoy = new Date();
  const esHoy = (fecha: Date) => 
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header del calendario */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={mesAnterior}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFechaActual(new Date())}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={mesSiguiente}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {catalogosSGSST.prioridades.map(p => (
            <div key={p.value} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${getColorPrioridad(p.value).split(' ')[0]}`} />
              <span className="text-gray-600 dark:text-gray-400">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid del calendario */}
      <div className="p-4">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {diasSemana.map(dia => (
            <div key={dia} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Días */}
        <div className="grid grid-cols-7 gap-1">
          {diasCalendario.map((dia, index) => {
            const fechaKey = dia.fecha.toISOString().split('T')[0];
            const actsDia = actividadesPorDia[fechaKey] || [];
            
            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border rounded-lg transition-colors
                  ${dia.esMesActual 
                    ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-transparent'}
                  ${esHoy(dia.fecha) ? 'ring-2 ring-blue-500' : ''}
                  hover:border-blue-300 dark:hover:border-blue-700
                `}
              >
                <div className={`text-right text-sm font-medium mb-1
                  ${dia.esMesActual 
                    ? 'text-gray-700 dark:text-gray-300' 
                    : 'text-gray-400 dark:text-gray-600'}
                  ${esHoy(dia.fecha) ? 'text-blue-600 dark:text-blue-400' : ''}
                `}>
                  {dia.numero}
                </div>
                <div className="space-y-1">
                  {actsDia.slice(0, 3).map(act => (
                    <button
                      key={act.id}
                      onClick={() => onVerActividad?.(act)}
                      className={`w-full text-left text-xs px-2 py-1 rounded truncate 
                                hover:opacity-80 transition-opacity ${getColorPrioridad(act.prioridad)}`}
                      title={`${act.codigo} - ${act.nombre}`}
                    >
                      {act.codigo}
                    </button>
                  ))}
                  {actsDia.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{actsDia.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumen */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-400">
              Total actividades: <strong className="text-gray-900 dark:text-gray-100">{actividades.length}</strong>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Este mes: <strong className="text-gray-900 dark:text-gray-100">
                {actividades.filter(a => {
                  const fecha = new Date(a.fechaInicio);
                  return fecha.getMonth() === fechaActual.getMonth() && 
                         fecha.getFullYear() === fechaActual.getFullYear();
                }).length}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-xs">Haz clic en una actividad para ver detalles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
