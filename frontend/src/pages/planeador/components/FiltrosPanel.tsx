import { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import type { FiltrosActividades } from '../../../types';
import { catalogosSGSST } from '../../../api/planeadorActividades.api';

interface Props {
  filtros: FiltrosActividades;
  onChange: (filtros: FiltrosActividades) => void;
  onBuscar: () => void;
  onLimpiar: () => void;
}

export default function FiltrosPanel({ filtros, onChange, onBuscar, onLimpiar }: Props) {
  const [expandido, setExpandido] = useState(false);

  const handleChange = (campo: keyof FiltrosActividades, valor: string) => {
    onChange({ ...filtros, [campo]: valor || undefined });
  };

  const tieneFiltros = Object.values(filtros).some(v => v !== undefined && v !== '');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header del panel */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Filtros Avanzados</h3>
          {tieneFiltros && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              Activos
            </span>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          {expandido ? <XMarkIcon className="w-5 h-5" /> : <span className="text-sm">Mostrar</span>}
        </button>
      </div>

      {/* Contenido expandido */}
      {expandido && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          {/* Búsqueda general */}
          <div className="py-3">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código, nombre, descripción..."
                value={filtros.busqueda || ''}
                onChange={(e) => handleChange('busqueda', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fechas */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <CalendarIcon className="w-4 h-4" />
                Fecha Inicio
              </div>
              <div className="space-y-2">
                <input
                  type="date"
                  placeholder="Desde"
                  value={filtros.fechaInicioDesde || ''}
                  onChange={(e) => handleChange('fechaInicioDesde', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="date"
                  placeholder="Hasta"
                  value={filtros.fechaInicioHasta || ''}
                  onChange={(e) => handleChange('fechaInicioHasta', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <CalendarIcon className="w-4 h-4" />
                Fecha Fin
              </div>
              <div className="space-y-2">
                <input
                  type="date"
                  placeholder="Desde"
                  value={filtros.fechaFinDesde || ''}
                  onChange={(e) => handleChange('fechaFinDesde', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="date"
                  placeholder="Hasta"
                  value={filtros.fechaFinHasta || ''}
                  onChange={(e) => handleChange('fechaFinHasta', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Filtros principales */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <TagIcon className="w-4 h-4" />
                Clasificación
              </div>
              <div className="space-y-2">
                <select
                  value={filtros.tipoEvento || ''}
                  onChange={(e) => handleChange('tipoEvento', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Tipo de Evento</option>
                  {catalogosSGSST.tiposEvento.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <select
                  value={filtros.programa || ''}
                  onChange={(e) => handleChange('programa', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Programa</option>
                  {catalogosSGSST.programas.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <select
                  value={filtros.tematica || ''}
                  onChange={(e) => handleChange('tematica', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Temática</option>
                  {catalogosSGSST.tematicas.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estado y Prioridad */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <TagIcon className="w-4 h-4" />
                Estado y Prioridad
              </div>
              <div className="space-y-2">
                <select
                  value={filtros.prioridad || ''}
                  onChange={(e) => handleChange('prioridad', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Prioridad</option>
                  {catalogosSGSST.prioridades.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Estado</option>
                  {catalogosSGSST.estados.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
                <select
                  value={filtros.modalidad || ''}
                  onChange={(e) => handleChange('modalidad', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Modalidad</option>
                  {catalogosSGSST.modalidades.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Responsable */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <UserIcon className="w-4 h-4" />
                Responsable
              </div>
              <div className="space-y-2">
                <select
                  value={filtros.responsableId || ''}
                  onChange={(e) => handleChange('responsableId', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Responsable</option>
                  <option value="1">Juan Pérez</option>
                  <option value="2">María García</option>
                </select>
                <select
                  value={filtros.contratistaId || ''}
                  onChange={(e) => handleChange('contratistaId', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Contratista/Externo</option>
                  <option value="1">Constructora XYZ</option>
                </select>
              </div>
            </div>

            {/* Organizacional */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <BuildingOfficeIcon className="w-4 h-4" />
                Organización
              </div>
              <div className="space-y-2">
                <select
                  value={filtros.sedeId || ''}
                  onChange={(e) => handleChange('sedeId', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Sede</option>
                  <option value="1">Sede Principal</option>
                  <option value="2">Sede Norte</option>
                </select>
                <input
                  type="text"
                  placeholder="Categoría 1"
                  value={filtros.categoria1 || ''}
                  onChange={(e) => handleChange('categoria1', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder="Categoría 2"
                  value={filtros.categoria2 || ''}
                  onChange={(e) => handleChange('categoria2', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onLimpiar}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                       bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600
                       transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={onBuscar}
              className="px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 rounded-lg hover:bg-blue-700
                       transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
