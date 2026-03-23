import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { seguridadVialApi, catalogosVial } from '../../../api/seguridadVial.api';
import type { Conductor } from '../../../types';
import toast from 'react-hot-toast';

export default function ConductoresPanel() {
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [conductorEditando, setConductorEditando] = useState<Conductor | null>(null);

  useEffect(() => {
    cargarConductores();
  }, []);

  const cargarConductores = async () => {
    try {
      setLoading(true);
      const res = await seguridadVialApi.listConductores();
      setConductores(res.data);
    } catch (error) {
      toast.error('Error al cargar conductores');
    } finally {
      setLoading(false);
    }
  };

  const conductoresFiltrados = conductores.filter(c =>
    `${c.numeroLicencia} ${c.externoNombre} ${c.empleado?.nombres} ${c.empleado?.apellidos}`.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const handleEditar = (conductor: Conductor) => {
    setConductorEditando(conductor);
    setModalAbierto(true);
  };

  const handleNuevo = () => {
    setConductorEditando(null);
    setModalAbierto(true);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(conductorEditando ? 'Conductor actualizado' : 'Conductor creado');
    setModalAbierto(false);
    cargarConductores();
  };

  const getEstadoLicenciaClases = (estado: string): string => {
    const map: Record<string, string> = {
      VIGENTE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      VENCIDA: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      SUSPENDIDA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      CANCELADA: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return map[estado] || map.VIGENTE;
  };

  const estaVencida = (fecha: string) => new Date(fecha) < new Date();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conductor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64"
            />
          </div>
        </div>
        <button 
          onClick={handleNuevo}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                   bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4" />
          Nuevo Conductor
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Conductor</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Licencia</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Categoría</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Vencimiento</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Cargando conductores...
                </td>
              </tr>
            ) : conductoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No se encontraron conductores
                </td>
              </tr>
            ) : (
              conductoresFiltrados.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {c.esExterno ? c.externoNombre : `${c.empleado?.nombres} ${c.empleado?.apellidos}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.esExterno ? 'Externo' : 'Empleado'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                    {c.numeroLicencia}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {c.categoriaLicencia}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className={`w-4 h-4 ${estaVencida(c.fechaVencimientoLicencia) ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={estaVencida(c.fechaVencimientoLicencia) ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                        {new Date(c.fechaVencimientoLicencia).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getEstadoLicenciaClases(c.estadoLicencia)}`}>
                      {catalogosVial.estadosLicencia.find(e => e.value === c.estadoLicencia)?.label}
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
                      <button 
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {conductorEditando ? 'Editar Conductor' : 'Nuevo Conductor'}
              </h3>
            </div>
            <form onSubmit={handleGuardar} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Conductor
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tipo" value="empleado" defaultChecked className="rounded" />
                    <span className="text-sm">Empleado</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="tipo" value="externo" className="rounded" />
                    <span className="text-sm">Externo</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Licencia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue={conductorEditando?.numeroLicencia}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    defaultValue={conductorEditando?.categoriaLicencia}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    {catalogosVial.categoriasLicencia.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organismo de Tránsito
                  </label>
                  <input
                    type="text"
                    defaultValue={conductorEditando?.organismoTransito}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha Expedición
                  </label>
                  <input
                    type="date"
                    defaultValue={conductorEditando?.fechaExpedicionLicencia}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha Vencimiento
                  </label>
                  <input
                    type="date"
                    defaultValue={conductorEditando?.fechaVencimientoLicencia}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                           bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
