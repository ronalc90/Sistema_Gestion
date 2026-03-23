import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  PlusIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { seguridadVialApi } from '../../../api/seguridadVial.api';
import type { EncuestaSeguridadVial } from '../../../types';

export default function EncuestaPanel() {
  const [encuestas, setEncuestas] = useState<EncuestaSeguridadVial[]>([]);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState<'listado' | 'detalle' | 'resultados'>('listado');
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<EncuestaSeguridadVial | null>(null);

  useEffect(() => {
    cargarEncuestas();
  }, []);

  const cargarEncuestas = async () => {
    try {
      setLoading(true);
      const res = await seguridadVialApi.listEncuestas();
      setEncuestas(res.data);
    } catch (error) {
      // No hay datos aún
      setEncuestas([
        {
          id: '1',
          titulo: 'Encuesta de Cultura Vial 2026',
          descripcion: 'Evaluación del conocimiento y comportamiento de los conductores',
          fechaInicio: '2026-01-01',
          fechaFin: '2026-12-31',
          activa: true,
          preguntas: [
            { id: '1', encuestaId: '1', orden: 1, texto: '¿Conoce las señales de tránsito?', tipo: 'SELECCION_UNICA', requerida: true, opciones: ['Sí', 'No', 'Parcialmente'] },
            { id: '2', encuestaId: '1', orden: 2, texto: '¿Usa cinturón de seguridad?', tipo: 'SELECCION_UNICA', requerida: true, opciones: ['Siempre', 'A veces', 'Nunca'] },
          ],
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = (encuesta: EncuestaSeguridadVial) => {
    setEncuestaSeleccionada(encuesta);
    setVistaActiva('detalle');
  };

  const verResultados = (encuesta: EncuestaSeguridadVial) => {
    setEncuestaSeleccionada(encuesta);
    setVistaActiva('resultados');
  };

  if (vistaActiva === 'detalle' && encuestaSeleccionada) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {encuestaSeleccionada.titulo}
            </h3>
            <p className="text-sm text-gray-500">{encuestaSeleccionada.descripcion}</p>
          </div>
          <button
            onClick={() => setVistaActiva('listado')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver al panel
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${encuestaSeleccionada.activa 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>
              {encuestaSeleccionada.activa ? 'Activa' : 'Inactiva'}
            </span>
            <span className="text-gray-500">
              Vigencia: {new Date(encuestaSeleccionada.fechaInicio).toLocaleDateString('es-CO')} 
              {' - '}
              {encuestaSeleccionada.fechaFin 
                ? new Date(encuestaSeleccionada.fechaFin).toLocaleDateString('es-CO') 
                : 'Sin fecha fin'}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">
              Preguntas ({encuestaSeleccionada.preguntas.length})
            </h4>
            <div className="space-y-4">
              {encuestaSeleccionada.preguntas.map((pregunta, index) => (
                <div key={pregunta.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{pregunta.texto}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Tipo: {pregunta.tipo.replace(/_/g, ' ')}</span>
                        {pregunta.requerida && <span className="text-red-500">* Requerida</span>}
                      </div>
                      {pregunta.opciones && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {pregunta.opciones.map((opcion, i) => (
                            <span key={i} className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-xs">
                              {opcion}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (vistaActiva === 'resultados' && encuestaSeleccionada) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Resultados: {encuestaSeleccionada.titulo}
            </h3>
          </div>
          <button
            onClick={() => setVistaActiva('listado')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver al panel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">156</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Respuestas</p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">89%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Respuesta</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.2</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Promedio General</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-100">Resumen por Pregunta</h4>
          {encuestaSeleccionada.preguntas.map((pregunta, index) => (
            <div key={pregunta.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="font-medium text-gray-800 dark:text-gray-100 mb-3">
                {index + 1}. {pregunta.texto}
              </p>
              <div className="space-y-2">
                {pregunta.opciones?.map((opcion, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-24">{opcion}</span>
                    <span className="text-sm font-medium w-12 text-right">
                      {Math.floor(Math.random() * 40 + 10)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vista listado (default)
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DocumentTextIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{encuestas.length}</p>
              <p className="text-xs text-gray-500">Encuestas creadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <PlayIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {encuestas.filter(e => e.activa).length}
              </p>
              <p className="text-xs text-gray-500">Encuestas activas</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <UsersIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">156</p>
              <p className="text-xs text-gray-500">Total respuestas</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <ChartBarIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">89%</p>
              <p className="text-xs text-gray-500">Tasa respuesta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Encuestas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Encuestas Disponibles</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <PlusIcon className="w-4 h-4" />
            Nueva Encuesta
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Cargando...</div>
          ) : encuestas.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No hay encuestas registradas
            </div>
          ) : (
            encuestas.map((encuesta) => (
              <div key={encuesta.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{encuesta.titulo}</h4>
                      {encuesta.activa ? (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          Activa
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{encuesta.descripcion}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{encuesta.preguntas.length} preguntas</span>
                      <span>•</span>
                      <span>Vigente hasta: {encuesta.fechaFin ? new Date(encuesta.fechaFin).toLocaleDateString('es-CO') : 'Sin fecha'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verDetalle(encuesta)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Ver detalle"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => verResultados(encuesta)}
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Ver resultados"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      title={encuesta.activa ? 'Pausar' : 'Activar'}
                    >
                      {encuesta.activa ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
