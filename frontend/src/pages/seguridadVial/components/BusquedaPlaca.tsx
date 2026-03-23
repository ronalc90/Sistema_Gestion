import { useState } from 'react';
import { MagnifyingGlassIcon, TruckIcon } from '@heroicons/react/24/outline';
import type { Vehiculo } from '../../../types';

interface Props {
  vehiculos: Vehiculo[];
  loading?: boolean;
}

export default function BusquedaPlaca({ vehiculos, loading }: Props) {
  const [placa, setPlaca] = useState('');
  const [vehiculoEncontrado, setVehiculoEncontrado] = useState<Vehiculo | null>(null);
  const [buscando, setBuscando] = useState(false);

  const handleBuscar = () => {
    if (!placa.trim()) return;
    
    setBuscando(true);
    // Simular búsqueda
    setTimeout(() => {
      const encontrado = vehiculos.find(v => 
        v.placa.toLowerCase() === placa.toLowerCase()
      );
      setVehiculoEncontrado(encontrado || null);
      setBuscando(false);
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Localizar Vehículo por Placa
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Localice rápidamente un automotor por <strong>placa</strong> para cargar bitácoras y mantenimientos
      </p>

      {/* Selector de Placa */}
      <div className="flex gap-3">
        <div className="flex-1">
          <select
            value={placa}
            onChange={(e) => {
              setPlaca(e.target.value);
              setVehiculoEncontrado(null);
            }}
            className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccione un vehículo...</option>
            {vehiculos.map((v) => (
              <option key={v.id} value={v.placa}>
                {v.placa} - {v.marca} {v.modelo} ({v.color})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleBuscar}
          disabled={!placa || buscando}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        >
          {buscando ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
          Cargar
        </button>
      </div>

      {/* Resultado de la búsqueda */}
      {vehiculoEncontrado && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <TruckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                {vehiculoEncontrado.marca} {vehiculoEncontrado.modelo}
              </h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 my-1">
                {vehiculoEncontrado.placa}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-500">Color:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">{vehiculoEncontrado.color}</span>
                </div>
                <div>
                  <span className="text-gray-500">Año:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">{vehiculoEncontrado.ano}</span>
                </div>
                <div>
                  <span className="text-gray-500">Kilometraje:</span>{' '}
                  <span className="text-gray-700 dark:text-gray-300">
                    {vehiculoEncontrado.kilometrajeActual?.toLocaleString()} km
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>{' '}
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium
                    ${vehiculoEncontrado.estado === 'ACTIVO' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {vehiculoEncontrado.estado}
                  </span>
                </div>
              </div>
              
              {/* Documentos */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className={`p-2 rounded text-xs
                  ${new Date(vehiculoEncontrado.fechaVencimientoSOAT || '') > new Date()
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                  SOAT: {vehiculoEncontrado.fechaVencimientoSOAT 
                    ? new Date(vehiculoEncontrado.fechaVencimientoSOAT).toLocaleDateString('es-CO')
                    : 'No registrado'}
                </div>
                <div className={`p-2 rounded text-xs
                  ${new Date(vehiculoEncontrado.fechaVencimientoTecnomecanica || '') > new Date()
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                  Tecnomecánica: {vehiculoEncontrado.fechaVencimientoTecnomecanica
                    ? new Date(vehiculoEncontrado.fechaVencimientoTecnomecanica).toLocaleDateString('es-CO')
                    : 'No registrado'}
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  Ver Bitácora
                </button>
                <button className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                  Registrar Mantenimiento
                </button>
                <button className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded hover:bg-purple-700">
                  Inspección Preoperacional
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje cuando no se encuentra */}
      {vehiculoEncontrado === null && placa && !buscando && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-700 dark:text-yellow-400 text-sm">
            No se encontró ningún vehículo con la placa <strong>{placa}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
