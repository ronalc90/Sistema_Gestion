import { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { catalogosVial } from '../../../api/seguridadVial.api';
import type { Vehiculo } from '../../../types';
import toast from 'react-hot-toast';

interface Props {
  subVista: 'lista' | 'nuevo' | 'editar' | 'inspeccion';
  onChangeSubVista: (vista: 'lista' | 'nuevo' | 'editar' | 'inspeccion') => void;
  vehiculos: Vehiculo[];
  loading?: boolean;
  onRefresh: () => void;
}

function getEstadoClases(estado: string): string {
  const map: Record<string, string> = {
    ACTIVO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    MANTENIMIENTO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    INACTIVO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    BAJA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return map[estado] || map.INACTIVO;
}

function getTipoLabel(tipo: string): string {
  return catalogosVial.tiposVehiculo.find(t => t.value === tipo)?.label || tipo;
}

export default function VehiculosPanel({ 
  subVista, 
  onChangeSubVista, 
  vehiculos, 
  loading,
  onRefresh 
}: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [vehiculoEditando, setVehiculoEditando] = useState<Vehiculo | null>(null);

  const vehiculosFiltrados = vehiculos.filter(v =>
    `${v.placa} ${v.marca} ${v.modelo}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEditar = (vehiculo: Vehiculo) => {
    setVehiculoEditando(vehiculo);
    onChangeSubVista('editar');
  };

  const handleEliminar = (_id: string) => {
    if (confirm('¿Eliminar este vehículo?')) {
      toast.success('Vehículo eliminado');
      onRefresh();
    }
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(subVista === 'nuevo' ? 'Vehículo creado' : 'Vehículo actualizado');
    onChangeSubVista('lista');
    onRefresh();
  };

  if (subVista === 'nuevo' || subVista === 'editar') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {subVista === 'nuevo' ? 'Nuevo Vehículo' : 'Editar Vehículo'}
          </h3>
          <button
            onClick={() => onChangeSubVista('lista')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver al listado
          </button>
        </div>

        <form onSubmit={handleGuardar} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Placa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={vehiculoEditando?.placa}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="ABC123"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                defaultValue={vehiculoEditando?.tipo}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Seleccionar...</option>
                {catalogosVial.tiposVehiculo.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={vehiculoEditando?.marca}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={vehiculoEditando?.modelo}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Año <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={vehiculoEditando?.ano}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={vehiculoEditando?.color}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo Combustible
              </label>
              <select
                defaultValue={vehiculoEditando?.tipoCombustible}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {catalogosVial.tiposCombustible.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                defaultValue={vehiculoEditando?.estado || 'ACTIVO'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {catalogosVial.estadosVehiculo.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vencimiento SOAT
              </label>
              <input
                type="date"
                defaultValue={vehiculoEditando?.fechaVencimientoSOAT}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vencimiento Tecnomecánica
              </label>
              <input
                type="date"
                defaultValue={vehiculoEditando?.fechaVencimientoTecnomecanica}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kilometraje Actual
              </label>
              <input
                type="number"
                defaultValue={vehiculoEditando?.kilometrajeActual}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onChangeSubVista('lista')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                       bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {subVista === 'nuevo' ? 'Crear Vehículo' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (subVista === 'inspeccion') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Inspección Preoperacional
          </h3>
          <button
            onClick={() => onChangeSubVista('lista')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver
          </button>
        </div>
        
        <div className="text-center py-12 text-gray-500">
          <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Formulario de inspección preoperacional</p>
          <p className="text-sm">Seleccione un vehículo para realizar la inspección</p>
        </div>
      </div>
    );
  }

  // Vista lista (default)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar vehículo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onChangeSubVista('inspeccion')}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            Inspeccionar
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => { setVehiculoEditando(null); onChangeSubVista('nuevo'); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                     bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            Nuevo Vehículo
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Placa</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Vehículo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Documentos</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Kilometraje</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Cargando vehículos...
                </td>
              </tr>
            ) : vehiculosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No se encontraron vehículos
                </td>
              </tr>
            ) : (
              vehiculosFiltrados.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {v.placa}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {v.marca} {v.modelo}
                      </p>
                      <p className="text-xs text-gray-500">{v.ano} • {v.color}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {getTipoLabel(v.tipo)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoClases(v.estado)}`}>
                      {catalogosVial.estadosVehiculo.find(e => e.value === v.estado)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {v.fechaVencimientoSOAT && new Date(v.fechaVencimientoSOAT) > new Date() ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" title="SOAT vigente" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-red-500" title="SOAT vencido" />
                      )}
                      {v.fechaVencimientoTecnomecanica && new Date(v.fechaVencimientoTecnomecanica) > new Date() ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" title="Tecno vigente" />
                      ) : (
                        <XCircleIcon className="w-4 h-4 text-red-500" title="Tecno vencida" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {v.kilometrajeActual?.toLocaleString()} km
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditar(v)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEliminar(v.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  );
}
