import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { seguridadVialApi, catalogosVial } from '../../../api/seguridadVial.api';
import type { Comparendo } from '../../../types';
import toast from 'react-hot-toast';

interface Props {
  subVista: 'lista' | 'nuevo' | 'editar';
  onChangeSubVista: (vista: 'lista' | 'nuevo' | 'editar') => void;
}

export default function ComparendosPanel({ subVista, onChangeSubVista }: Props) {
  const [comparendos, setComparendos] = useState<Comparendo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [comparendoEditando, setComparendoEditando] = useState<Comparendo | null>(null);

  useEffect(() => {
    cargarComparendos();
  }, []);

  const cargarComparendos = async () => {
    try {
      setLoading(true);
      const res = await seguridadVialApi.listComparendos();
      setComparendos(res.data);
    } catch (error) {
      toast.error('Error al cargar comparendos');
    } finally {
      setLoading(false);
    }
  };

  const comparendosFiltrados = comparendos.filter(c =>
    `${c.numeroComparendo} ${c.descripcionInfraccion} ${c.lugarInfraccion}`.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const handleEditar = (comparendo: Comparendo) => {
    setComparendoEditando(comparendo);
    onChangeSubVista('editar');
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(subVista === 'nuevo' ? 'Comparendo registrado' : 'Comparendo actualizado');
    onChangeSubVista('lista');
    cargarComparendos();
  };

  const getTipoClases = (tipo: string): string => {
    const map: Record<string, string> = {
      LEVE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      GRAVE: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      GRAVISIMO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    return map[tipo] || map.LEVE;
  };

  const getEstadoClases = (estado: string): string => {
    const map: Record<string, string> = {
      PENDIENTE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      PAGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      APLAZADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      EN_RECURSO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    };
    return map[estado] || map.PENDIENTE;
  };

  if (subVista === 'nuevo' || subVista === 'editar') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {subVista === 'nuevo' ? 'Registrar Comparendo' : 'Editar Comparendo'}
          </h3>
          <button
            onClick={() => onChangeSubVista('lista')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver al listado
          </button>
        </div>

        <form onSubmit={handleGuardar} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número de Comparendo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue={comparendoEditando?.numeroComparendo}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="CMP-2026-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Comparendo
              </label>
              <select
                defaultValue={comparendoEditando?.tipoComparendo || 'LEVE'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                {catalogosVial.tiposComparendo.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha de Infracción <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                defaultValue={comparendoEditando?.fechaInfraccion}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hora de Infracción
              </label>
              <input
                type="time"
                defaultValue={comparendoEditando?.horaInfraccion}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lugar de Infracción <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue={comparendoEditando?.lugarInfraccion}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Av. El Dorado con Calle 26"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción de la Infracción <span className="text-red-500">*</span>
            </label>
            <textarea
              defaultValue={comparendoEditando?.descripcionInfraccion}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Exceso de velocidad..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor de la Multa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                defaultValue={comparendoEditando?.valorMulta}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                placeholder="312000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estado
              </label>
              <select
                defaultValue={comparendoEditando?.estado || 'PENDIENTE'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                {catalogosVial.estadosComparendo.map(e => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehículo
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option value="">Seleccionar vehículo...</option>
                <option value="1">ABC123 - Toyota Corolla</option>
                <option value="2">DEF456 - Ford Ranger</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conductor
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                <option value="">Seleccionar conductor...</option>
                <option value="1">Juan Pérez</option>
                <option value="2">María García</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => onChangeSubVista('lista')}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                       bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
            >
              {subVista === 'nuevo' ? 'Registrar Comparendo' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Vista lista
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comparendo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64"
            />
          </div>
        </div>
        <button 
          onClick={() => onChangeSubVista('nuevo')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                   bg-red-600 rounded-lg hover:bg-red-700"
        >
          <PlusIcon className="w-4 h-4" />
          Ingresar Comparendo
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Número</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Fecha</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Infracción</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Valor</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Cargando comparendos...
                </td>
              </tr>
            ) : comparendosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No se encontraron comparendos
                </td>
              </tr>
            ) : (
              comparendosFiltrados.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                    {c.numeroComparendo}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {new Date(c.fechaInfraccion).toLocaleDateString('es-CO')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200 max-w-xs truncate">
                      {c.descripcionInfraccion}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{c.lugarInfraccion}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTipoClases(c.tipoComparendo)}`}>
                      {catalogosVial.tiposComparendo.find(t => t.value === c.tipoComparendo)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                    ${c.valorMulta.toLocaleString('es-CO')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoClases(c.estado)}`}>
                      {catalogosVial.estadosComparendo.find(e => e.value === c.estado)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditar(c)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
