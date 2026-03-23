import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { ActividadPlaneada } from '../../../types';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';

interface Props {
  actividades: ActividadPlaneada[];
  loading?: boolean;
  titulo: string;
  mostrarSede?: boolean;
}

function getBadgeColor(estado: string): string {
  const colors: Record<string, string> = {
    PLANEADO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    EN_PROCESO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    REPROGRAMADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    FINALIZADA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CANCELADA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[estado] || colors.PLANEADO;
}

function getPrioridadColor(prioridad: string): string {
  const colors: Record<string, string> = {
    BAJA: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
    MEDIA: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    ALTA: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    URGENTE: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[prioridad] || colors.BAJA;
}

function getEstadoLabel(estado: string): string {
  return catalogosSGSST.estados.find(e => e.value === estado)?.label || estado;
}

function getPrioridadLabel(prioridad: string): string {
  return catalogosSGSST.prioridades.find(p => p.value === prioridad)?.label || prioridad;
}

export default function TablaActividadesMes({ actividades, loading, titulo, mostrarSede = true }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  const actividadesFiltradas = actividades.filter(a =>
    `${a.codigo} ${a.nombre} ${a.tipoEvento}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(actividadesFiltradas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const actividadesPagina = actividadesFiltradas.slice(inicio, inicio + porPagina);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{titulo}</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              className="pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <span className="text-xs text-gray-500">
            {actividadesFiltradas.length} registros
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Código</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Nombre</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Prioridad</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Estado</th>
              {mostrarSede && <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Sede</th>}
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {actividadesPagina.length === 0 ? (
              <tr>
                <td colSpan={mostrarSede ? 7 : 6} className="px-4 py-8 text-center text-gray-400">
                  No hay datos en la tabla
                </td>
              </tr>
            ) : (
              actividadesPagina.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {act.codigo}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-xs truncate">
                    {act.nombre}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {catalogosSGSST.tiposEvento.find(t => t.value === act.tipoEvento)?.label || act.tipoEvento}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(act.prioridad)}`}>
                      {getPrioridadLabel(act.prioridad)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(act.estado)}`}>
                      {getEstadoLabel(act.estado)}
                    </span>
                  </td>
                  {mostrarSede && (
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {act.sede?.nombre || 
                       <span className="text-yellow-600 dark:text-yellow-400 text-xs">Sin sede</span>}
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {new Date(act.fechaInicio).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Siguiente
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
