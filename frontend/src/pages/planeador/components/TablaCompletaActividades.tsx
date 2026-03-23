import { useState } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import type { ActividadPlaneada } from '../../../types';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';

interface Props {
  actividades: ActividadPlaneada[];
  loading?: boolean;
  onVer?: (act: ActividadPlaneada) => void;
  onEditar?: (act: ActividadPlaneada) => void;
  onEliminar?: (act: ActividadPlaneada) => void;
}

function getEstadoClases(estado: string): string {
  const map: Record<string, string> = {
    PLANEADO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    EN_PROCESO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    REPROGRAMADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    FINALIZADA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    CANCELADA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return map[estado] || map.PLANEADO;
}

function getPrioridadClases(prioridad: string): string {
  const map: Record<string, string> = {
    BAJA: 'border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400',
    MEDIA: 'border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400',
    ALTA: 'border-orange-300 text-orange-600 dark:border-orange-600 dark:text-orange-400',
    URGENTE: 'border-red-300 text-red-600 dark:border-red-600 dark:text-red-400',
  };
  return map[prioridad] || map.BAJA;
}

function getPhvaClases(fase: string): string {
  const map: Record<string, string> = {
    PLANEAR: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
    HACER: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    VERIFICAR: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    ACTUAR: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
  };
  return map[fase] || map.PLANEAR;
}

function formatCurrency(value?: number): string {
  if (!value) return '-';
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function TablaCompletaActividades({ 
  actividades, 
  loading, 
  onVer, 
  onEditar, 
  onEliminar 
}: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());

  const actividadesFiltradas = actividades.filter(a =>
    `${a.codigo} ${a.nombre} ${a.descripcion} ${a.responsable?.nombre || ''}`.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(actividadesFiltradas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const actividadesPagina = actividadesFiltradas.slice(inicio, inicio + porPagina);

  const toggleSeleccion = (id: string) => {
    const nuevo = new Set(seleccionados);
    if (nuevo.has(id)) nuevo.delete(id);
    else nuevo.add(id);
    setSeleccionados(nuevo);
  };

  const toggleSeleccionTodos = () => {
    if (seleccionados.size === actividadesPagina.length) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(actividadesPagina.map(a => a.id)));
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar actividades..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <FunnelIcon className="w-4 h-4" />
            Filtros
          </button>
        </div>

        <div className="flex items-center gap-3">
          {seleccionados.size > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {seleccionados.size} seleccionados
            </span>
          )}
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar
          </button>
          <select
            value={porPagina}
            onChange={(e) => { setPorPagina(Number(e.target.value)); setPagina(1); }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={actividadesPagina.length > 0 && seleccionados.size === actividadesPagina.length}
                  onChange={toggleSeleccionTodos}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Código</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Actividad</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Tipo/Programa</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">PHVA</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Prioridad</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Fechas</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Presupuesto</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {actividadesPagina.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
                    <p>No hay actividades para mostrar</p>
                    <p className="text-xs">Ajuste los filtros o cree una nueva actividad</p>
                  </div>
                </td>
              </tr>
            ) : (
              actividadesPagina.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={seleccionados.has(act.id)}
                      onChange={() => toggleSeleccion(act.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {act.codigo}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{act.nombre}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{act.descripcion}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {catalogosSGSST.tiposEvento.find(t => t.value === act.tipoEvento)?.label}
                      </span>
                      <p className="text-xs text-gray-500">
                        {catalogosSGSST.programas.find(p => p.value === act.programa)?.label}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getPhvaClases(act.fasePHVA)}`}>
                      {act.fasePHVA}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${getPrioridadClases(act.prioridad)}`}>
                      {catalogosSGSST.prioridades.find(p => p.value === act.prioridad)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoClases(act.estado)}`}>
                      {catalogosSGSST.estados.find(e => e.value === act.estado)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(act.fechaInicio).toLocaleDateString('es-CO')}
                      </p>
                      <p className="text-gray-400">
                        {new Date(act.fechaFin).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {act.presupuestoAsignado ? (
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">{formatCurrency(act.presupuestoAsignado)}</p>
                        {act.presupuestoEjecutado !== undefined && (
                          <p className={`text-xs ${act.presupuestoEjecutado > act.presupuestoAsignado ? 'text-red-500' : 'text-green-500'}`}>
                            Ej: {formatCurrency(act.presupuestoEjecutado)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onVer?.(act)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditar?.(act)}
                        className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEliminar?.(act)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {inicio + 1} a {Math.min(inicio + porPagina, actividadesFiltradas.length)} de {actividadesFiltradas.length} resultados
          </p>
          <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
}
