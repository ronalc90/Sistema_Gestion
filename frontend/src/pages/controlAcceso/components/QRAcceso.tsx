import { useState, useEffect } from 'react';
import { ArrowTopRightOnSquareIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { controlAccesoApi } from '../../../api/controlAcceso.api';
import type { CodigoQRAcceso, Sede } from '../../../types';
import toast from 'react-hot-toast';

// Mock de sedes para el ejemplo
const sedesMock: Sede[] = [
  { id: '2418', nombre: 'PRINCIPAL', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '2758', nombre: 'GERENCIA OPERATIVA', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '4055', nombre: 'CIVITA TORRE 2 ETAPA 1A - ENVIGADO', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '4100', nombre: 'CENTRO DE DISTRIBUCION', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '4200', nombre: 'OFICINA ADMINISTRATIVA NORTE', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '4300', nombre: 'PLANTA DE PRODUCCION', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '4400', nombre: 'BODEGA CENTRAL', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
  { id: '4500', nombre: 'CENTRO DE CAPACITACION', direccion: '', estado: 'ACTIVO', createdAt: '', updatedAt: '' },
];

export default function QRAcceso() {
  const [codigoQR, setCodigoQR] = useState<CodigoQRAcceso | null>(null);
  const [sedeSeleccionada, setSedeSeleccionada] = useState('2418');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generarQR();
  }, [sedeSeleccionada]);

  const generarQR = async () => {
    setLoading(true);
    try {
      const res = await controlAccesoApi.generarQR(sedeSeleccionada);
      setCodigoQR(res.data);
    } catch (error) {
      toast.error('Error al generar código QR');
    } finally {
      setLoading(false);
    }
  };

  // URL para el QR (simulada)
  const qrUrl = `https://sigsto.com/acceso?sede=${sedeSeleccionada}&codigo=${codigoQR?.codigo || '82-67'}`;
  
  // URL de imagen QR usando API gratuita
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrUrl)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel QR */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Sistema Propio
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Utilice el siguiente código QR para lograr acceso directo al sistema de control de acceso propio de la herramienta SIGSTO.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          También puede ingresar manualmente al sistema de controles de acceso mediante el botón en la pantalla de login del SIGSTO.
        </p>

        {/* Selector de Sede */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Seleccione la sede:
          </label>
          <select
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {sedesMock.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.id} - {sede.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Código QR */}
        <div className="flex flex-col items-center">
          <div className="p-6 bg-white rounded-xl shadow-lg">
            {loading ? (
              <div className="w-[250px] h-[250px] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              <img 
                src={qrImageUrl} 
                alt="Código QR de acceso" 
                className="w-[250px] h-[250px]"
              />
            )}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Código:</p>
            <p className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-100">
              {codigoQR?.codigo || '82-67'}
            </p>
          </div>
          <button 
            onClick={generarQR}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Regenerar código
          </button>
        </div>
      </div>

      {/* Lista de Sedes y Opciones */}
      <div className="space-y-6">
        {/* Lista de Sedes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BuildingOfficeIcon className="w-5 h-5" />
            Sedes Disponibles
          </h3>
          <div className="overflow-y-auto max-h-80 border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">ID</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Nombre</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {sedesMock.map((sede) => (
                  <tr 
                    key={sede.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer
                      ${sedeSeleccionada === sede.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onClick={() => setSedeSeleccionada(sede.id)}
                  >
                    <td className="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {sede.id}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {sede.nombre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sistema de Tercero */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Sistema de un Tercero
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
            Si su empresa utiliza un sistema de control de acceso externo, puede configurarlo aquí.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                           bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            Configurar integración
          </button>
        </div>

        {/* Información */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
            ¿Cómo usar el código QR?
          </h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
            <li>Descargue o capture el código QR generado</li>
            <li>Imprímalo y colóquelo en el punto de acceso</li>
            <li>Los usuarios escanean con su teléfono</li>
            <li>El sistema redirige automáticamente al punto de registro</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
