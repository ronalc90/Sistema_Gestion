import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  InformationCircleIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { controlAccesoApi, catalogosAcceso } from '../../../api/controlAcceso.api';
import type { ConfiguracionAcceso } from '../../../types';
import toast from 'react-hot-toast';

const defaultConfig: ConfiguracionAcceso = {
  id: '1',
  modoVisitantes: 'PERMITIR_CON_REGISTRO',
  requiereTemperatura: false,
  requiereFoto: true,
  permitirAccesoManual: true,
  tiempoMaximoVisitaHoras: 8,
  notificarAdminNuevosRegistros: true,
  updatedAt: '',
};

export default function ConfiguracionVisitantes() {
  const [config, setConfig] = useState<ConfiguracionAcceso>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await controlAccesoApi.getConfiguracion();
        if (res.data) {
          setConfig(res.data);
        }
      } catch (error) {
        // Usar configuración por defecto
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await controlAccesoApi.updateConfiguracion(config.id, config);
      toast.success('Configuración actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const getIconoModo = (modo: string) => {
    switch (modo) {
      case 'NO_PERMITIR':
        return <NoSymbolIcon className="w-6 h-6 text-red-500" />;
      case 'PERMITIR_ANONIMO':
        return <UserGroupIcon className="w-6 h-6 text-yellow-500" />;
      case 'PERMITIR_CON_REGISTRO':
        return <ShieldCheckIcon className="w-6 h-6 text-green-500" />;
      default:
        return <UserGroupIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserGroupIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Modo de Visitantes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Define la forma en que se comporta el sistema de control de acceso cuando no se ha reconocido el número de documento ingresado
            </p>
          </div>
        </div>

        {/* Opciones de Modo */}
        <div className="space-y-4 mb-8">
          {catalogosAcceso.modosVisitante.map((modo) => (
            <label
              key={modo.value}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${config.modoVisitantes === modo.value 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
            >
              <input
                type="radio"
                name="modoVisitante"
                value={modo.value}
                checked={config.modoVisitantes === modo.value}
                onChange={(e) => setConfig({ ...config, modoVisitantes: e.target.value as any })}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getIconoModo(modo.value)}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {modo.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {modo.descripcion}
                </p>
              </div>
            </label>
          ))}
        </div>

        {/* Configuraciones adicionales */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">
            Configuraciones adicionales
          </h4>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <UserPlusIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Permitir acceso manual</span>
              </div>
              <input
                type="checkbox"
                checked={config.permitirAccesoManual}
                onChange={(e) => setConfig({ ...config, permitirAccesoManual: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <InformationCircleIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Notificar a administradores de nuevos registros</span>
              </div>
              <input
                type="checkbox"
                checked={config.notificarAdminNuevosRegistros}
                onChange={(e) => setConfig({ ...config, notificarAdminNuevosRegistros: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </label>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Tiempo máximo de visita (horas)</span>
              </div>
              <input
                type="number"
                min="1"
                max="24"
                value={config.tiempoMaximoVisitaHoras}
                onChange={(e) => setConfig({ ...config, tiempoMaximoVisitaHoras: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
              />
            </div>
          </div>
        </div>

        {/* Nota importante */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Nota importante:</strong>
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                La opción "Permitir con registro" puede requerir activación de formatos adicionales no contemplados para su sistema. 
                Consulte con el administrador antes de habilitar esta opción.
              </p>
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white 
                     bg-yellow-500 hover:bg-yellow-600 
                     rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              'Actualizar configuración'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Icono de reloj para la duración
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
