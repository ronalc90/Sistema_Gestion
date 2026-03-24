import { useState } from 'react';
import { 
  LightBulbIcon,
  ChartBarIcon,
  FunnelIcon,
  QrCodeIcon,
  UserGroupIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Modal from '../../../components/common/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface TemaAyuda {
  id: string;
  titulo: string;
  icon: React.ComponentType<{ className?: string }>;
  contenido: string;
  pasos?: string[];
}

const temasAyuda: TemaAyuda[] = [
  {
    id: 'estadisticas',
    titulo: 'Estadísticas Rápidas',
    icon: ChartBarIcon,
    contenido: 'Visualice el resumen de accesos del mes, gráficos por tipo de persona y estadísticas históricas.',
    pasos: [
      'Acceda a la pestaña "Estadística rápida"',
      'Observe el total de accesos del mes actual',
      'Analice el gráfico circular por tipo de persona (Empleado, Contratista, Visitante)',
      'Revista el histórico de accesos por mes en el gráfico de barras',
      'Use esta información para identificar patrones de ingreso'
    ]
  },
  {
    id: 'filtro',
    titulo: 'Filtro Específico',
    icon: FunnelIcon,
    contenido: 'Genere reportes detallados filtrando por fecha, tipo de persona, contratista, documento y categorías.',
    pasos: [
      'Vaya a la pestaña "Filtro específico"',
      'Seleccione el rango de fechas deseado',
      'Elija el tipo de persona (Empleado, Contratista o Visitante)',
      'Filtre por contratista específico si es necesario',
      'Ingrese un número de documento para búsqueda puntual',
      'Use las categorías para filtrar por estructura organizacional',
      'Presione "Buscar" para ver los resultados',
      'Exporte a CSV si necesita el reporte fuera del sistema'
    ]
  },
  {
    id: 'qr',
    titulo: 'Códigos QR de Acceso',
    icon: QrCodeIcon,
    contenido: 'Genere códigos QR para cada sede y facilite el registro de acceso mediante dispositivos móviles.',
    pasos: [
      'Ingrese a la pestaña "QR-Acceso"',
      'Seleccione la sede para la que desea generar el código',
      'Descargue o imprima el código QR generado',
      'Coloque el código en el punto de ingreso',
      'Los usuarios escanean el código con su teléfono',
      'El sistema redirige automáticamente al formulario de registro',
      'Cada código es único por sede y puede regenerarse cuando sea necesario'
    ]
  },
  {
    id: 'visitantes',
    titulo: 'Configuración de Visitantes',
    icon: UserGroupIcon,
    contenido: 'Defina cómo el sistema debe comportarse cuando un visitante no está previamente registrado.',
    pasos: [
      'Acceda a la pestaña "Visitantes"',
      'Seleccione el modo de operación deseado:',
      '  • No permitir: Rechaza accesos no registrados',
      '  • Permitir anónimo: Registra como visitante genérico',
      '  • Permitir con registro: Requiere registro previo obligatorio',
      'Configure opciones adicionales como tiempo máximo de visita',
      'Active notificaciones para administradores si lo desea',
      'Guarde los cambios presionando "Actualizar configuración"'
    ]
  }
];

const preguntasFrecuentes = [
  {
    pregunta: '¿Cómo exporto los registros de acceso?',
    respuesta: 'Vaya a la pestaña "Filtro específico", aplique los filtros deseados, y presione el botón "Exportar CSV" que aparecerá en la parte superior de los resultados.'
  },
  {
    pregunta: '¿Puedo ver quién está dentro de las instalaciones en este momento?',
    respuesta: 'Sí, en el dashboard principal se muestra el número de "Personas dentro". Para ver el detalle, use el filtro específico y busque registros de entrada del día actual sin su correspondiente salida.'
  },
  {
    pregunta: '¿Cómo genero un nuevo código QR si se pierde o daña?',
    respuesta: 'Acceda a la pestaña "QR-Acceso", seleccione la sede correspondiente y presione "Regenerar código". El código anterior quedará automáticamente inactivo.'
  },
  {
    pregunta: '¿Qué pasa si un visitante no tiene registro previo?',
    respuesta: 'Depende de la configuración en la pestaña "Visitantes". Puede configurarse para rechazar el acceso, permitirlo como anónimo, o requerir que el visitante se registre previamente.'
  },
  {
    pregunta: '¿Cuánto tiempo se guardan los registros de acceso?',
    respuesta: 'Los registros se mantienen por un período de 2 años para consulta y auditoría. Pasado este tiempo, se archivan automáticamente.'
  },
  {
    pregunta: '¿Puedo integrar el control de acceso con otro sistema?',
    respuesta: 'Sí, en la pestaña "QR-Acceso" tiene la opción "Sistema de un Tercero" donde puede configurar integraciones con sistemas externos mediante API.'
  }
];

export default function AsistenteModal({ isOpen, onClose }: Props) {
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaAyuda | null>(null);
  const [mostrarFAQ, setMostrarFAQ] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asistente de Control de Acceso"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => { setTemaSeleccionado(null); setMostrarFAQ(false); }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {temaSeleccionado || mostrarFAQ ? '← Volver al inicio' : ''}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      }
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {!temaSeleccionado && !mostrarFAQ && (
          <>
            {/* Bienvenida */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <LightBulbIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">
                    ¡Bienvenido al Sistema de Control de Acceso!
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Este sistema le permite gestionar y monitorear todos los ingresos y salidas de personas en sus instalaciones. Seleccione un tema para obtener ayuda.
                  </p>
                </div>
              </div>
            </div>

            {/* Temas de ayuda */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Temas de ayuda
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {temasAyuda.map((tema) => (
                  <button
                    key={tema.id}
                    onClick={() => setTemaSeleccionado(tema)}
                    className="flex items-start gap-3 p-4 text-left bg-white dark:bg-gray-700 
                             border border-gray-200 dark:border-gray-600 rounded-lg
                             hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <tema.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h6 className="font-medium text-gray-800 dark:text-gray-200">{tema.titulo}</h6>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tema.contenido}</p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Preguntas frecuentes */}
            <button
              onClick={() => setMostrarFAQ(true)}
              className="w-full flex items-center justify-center gap-2 p-4 
                       border border-dashed border-gray-300 dark:border-gray-600 rounded-lg
                       hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50
                       transition-colors"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ver preguntas frecuentes
              </span>
            </button>
          </>
        )}

        {/* Detalle de tema seleccionado */}
        {temaSeleccionado && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <temaSeleccionado.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {temaSeleccionado.titulo}
                </h4>
                <p className="text-sm text-gray-500">{temaSeleccionado.contenido}</p>
              </div>
            </div>

            {temaSeleccionado.pasos && (
              <div>
                <h5 className="font-medium text-gray-800 dark:text-gray-100 mb-3">
                  Pasos a seguir:
                </h5>
                <div className="space-y-3">
                  {temaSeleccionado.pasos.map((paso, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 
                                     text-blue-600 dark:text-blue-400 rounded-full 
                                     flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{paso}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preguntas frecuentes */}
        {mostrarFAQ && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              Preguntas Frecuentes
            </h4>
            <div className="space-y-3">
              {preguntasFrecuentes.map((faq, index) => (
                <details 
                  key={index} 
                  className="group bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                    <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                      {faq.pregunta}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
                    {faq.respuesta}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
