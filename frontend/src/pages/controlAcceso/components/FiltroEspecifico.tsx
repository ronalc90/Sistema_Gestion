import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  QrCodeIcon,
  IdentificationIcon,
  CreditCardIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { controlAccesoApi, catalogosAcceso } from '../../../api/controlAcceso.api';
import type { RegistroAcceso } from '../../../types';
import toast from 'react-hot-toast';

const metodosIconos: Record<string, React.ComponentType<{ className?: string }>> = {
  QR: QrCodeIcon,
  DOCUMENTO: IdentificationIcon,
  TARJETA: CreditCardIcon,
  MANUAL: PencilIcon,
};

export default function FiltroEspecifico() {
  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    tipoPersona: '',
    contratistaId: '',
    documento: '',
    categoria1: '',
    categoria2: '',
    categoria3: '',
    sedeId: '',
  });
  const [resultados, setResultados] = useState<RegistroAcceso[]>([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    try {
      // Filtrar solo los campos con valor
      const filtrosLimpios: Record<string, string> = {};
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) filtrosLimpios[key] = value;
      });
      const res = await controlAccesoApi.list(filtrosLimpios);
      setResultados(res.data);
      setBuscado(true);
    } catch (error) {
      toast.error('Error al buscar registros');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      tipoPersona: '',
      contratistaId: '',
      documento: '',
      categoria1: '',
      categoria2: '',
      categoria3: '',
      sedeId: '',
    });
    setResultados([]);
    setBuscado(false);
  };

  const handleExportar = () => {
    toast.success('Exportando resultados a CSV...');
  };

  const getTipoPersonaLabel = (tipo: string) => {
    return catalogosAcceso.tiposPersona.find(t => t.value === tipo)?.label || tipo;
  };

  const getTipoPersonaColor = (tipo: string) => {
    const colors: Record<string, string> = {
      EMPLEADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      CONTRATISTA: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      VISITANTE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getMetodoIcon = (metodo: string) => {
    const Icon = metodosIconos[metodo] || IdentificationIcon;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Panel de Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          Filtros de búsqueda
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de acceso DESDE:
            </label>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de acceso HASTA:
            </label>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Tipo Persona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de persona (E)mpleado, (C)ontratista o (V)isitante:
            </label>
            <select
              value={filtros.tipoPersona}
              onChange={(e) => setFiltros({ ...filtros, tipoPersona: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todos</option>
              {catalogosAcceso.tiposPersona.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Contratista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contratista:
            </label>
            <select
              value={filtros.contratistaId}
              onChange={(e) => setFiltros({ ...filtros, contratistaId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todos los contratistas</option>
              <option value="1">Constructora XYZ</option>
              <option value="2">Servicios de Seguridad ABC</option>
              <option value="3">Limpieza Express SAS</option>
            </select>
          </div>

          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              No. Documento:
            </label>
            <input
              type="text"
              value={filtros.documento}
              onChange={(e) => setFiltros({ ...filtros, documento: e.target.value })}
              placeholder="Ingrese un número"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Categoría 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría 1 (o de mayor nivel):
            </label>
            <select
              value={filtros.categoria1}
              onChange={(e) => setFiltros({ ...filtros, categoria1: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todas</option>
              <option value="nacional">Nacional</option>
              <option value="regionales">Regionales</option>
            </select>
          </div>

          {/* Categoría 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categoría 2 (o de nivel intermedio):
            </label>
            <select
              value={filtros.categoria2}
              onChange={(e) => setFiltros({ ...filtros, categoria2: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todas</option>
              <option value="sedes">Sedes</option>
              <option value="obras">Obras</option>
            </select>
          </div>

          {/* Sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sede:
            </label>
            <select
              value={filtros.sedeId}
              onChange={(e) => setFiltros({ ...filtros, sedeId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todas las sedes</option>
              <option value="1">Sede Principal</option>
              <option value="2">Sede Norte</option>
              <option value="3">Sede Sur</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white 
                     bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-4 h-4" />
            )}
            Buscar
          </button>
          <button
            onClick={handleLimpiar}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
          >
            Limpiar
          </button>
          {resultados.length > 0 && (
            <button
              onClick={handleExportar}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-green-700 
                       bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 ml-auto"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* Resultados */}
      {!buscado ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
          <FunnelIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            Sin resultados.
          </p>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
            Debe indicar el nivel de filtro deseado en la parte superior y hacer clic sobre el botón Buscar para continuar.
          </p>
          <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-4">
            Presione Buscar sin seleccionar ningún filtro para presentar todos los datos.
          </p>
        </div>
      ) : resultados.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
          <p className="text-gray-500">No se encontraron registros con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {resultados.length} registros encontrados
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Fecha/Hora</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Persona</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Documento</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Método</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Sede</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {resultados.map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {new Date(registro.fecha).toLocaleDateString('es-CO')}
                      </div>
                      <p className="text-xs text-gray-500">{registro.hora}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTipoPersonaColor(registro.tipoPersona)}`}>
                        {getTipoPersonaLabel(registro.tipoPersona)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {registro.empleado?.nombres || registro.contratista?.nombre || registro.visitante?.nombre || 'N/A'}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {registro.documento || registro.empleado?.numeroId || registro.visitante?.identificacion || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        {getMetodoIcon(registro.metodoAutenticacion)}
                        <span className="text-xs">
                          {catalogosAcceso.metodosAutenticacion.find(m => m.value === registro.metodoAutenticacion)?.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {registro.sede?.nombre || 'Sede Principal'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
