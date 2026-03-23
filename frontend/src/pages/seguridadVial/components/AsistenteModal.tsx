import { useState } from 'react';
import { 
  LightBulbIcon,
  TruckIcon,
  UserIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ChevronRightIcon,
  BookOpenIcon,
  VideoCameraIcon,
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
    id: 'vehiculos',
    titulo: 'Gestión de Vehículos',
    icon: TruckIcon,
    contenido: 'Administre el parque automotor de su empresa, registre nuevos vehículos y controle documentos.',
    pasos: [
      'Haga clic en "Vehículos" en el menú superior',
      'Seleccione "Agregar vehículo" para crear uno nuevo',
      'Complete todos los campos obligatorios (placa, marca, modelo, año)',
      'Registre las fechas de vencimiento de SOAT y tecnomecánica',
      'Guarde el registro y verifique en el listado'
    ]
  },
  {
    id: 'conductores',
    titulo: 'Administración de Conductores',
    icon: UserIcon,
    contenido: 'Registre conductores internos (empleados) o externos y controle el estado de sus licencias.',
    pasos: [
      'Acceda a "Conductores" desde el menú principal',
      'Registre un nuevo conductor con su información personal',
      'Ingrese los datos de la licencia de conducción',
      'Verifique fechas de expedición y vencimiento',
      'El sistema alertará automáticamente cuando esté por vencer'
    ]
  },
  {
    id: 'comparendos',
    titulo: 'Registro de Comparendos',
    icon: DocumentTextIcon,
    contenido: 'Registre infracciones de tránsito, controle pagos pendientes y genere reportes.',
    pasos: [
      'Ingrese a "Comparendos" y seleccione "Ingresar comparendo"',
      'Complete el número de comparendo y datos de la infracción',
      'Seleccione el vehículo y conductor involucrado',
      'Registre el valor de la multa y estado inicial',
      'Actualice el estado cuando sea pagado o aplazado'
    ]
  },
  {
    id: 'inspecciones',
    titulo: 'Inspecciones Preoperacionales',
    icon: ClipboardDocumentCheckIcon,
    contenido: 'Realice inspecciones diarias de vehículos antes de su operación.',
    pasos: [
      'Seleccione "Generar inspección" desde el menú Vehículos',
      'Elija el vehículo a inspeccionar',
      'Complete el checklist de revisión (luces, llantas, niveles, etc.)',
      'Registre el kilometraje inicial',
      'Firme y guarde la inspección'
    ]
  },
  {
    id: 'busqueda',
    titulo: 'Búsqueda por Placa',
    icon: BookOpenIcon,
    contenido: 'Localice rápidamente un vehículo para ver su historial y registrar mantenimientos.',
    pasos: [
      'En la página de inicio, use el campo "Placa del vehículo"',
      'Seleccione la placa de la lista desplegable',
      'Haga clic en "Cargar" para ver la información completa',
      'Acceda a bitácoras, mantenimientos o inspecciones desde allí'
    ]
  }
];

const preguntasFrecuentes = [
  {
    pregunta: '¿Cómo sé si un vehículo tiene documentos vencidos?',
    respuesta: 'El sistema muestra indicadores visuales en el listado de vehículos. Los documentos vencidos aparecen con iconos rojos, y los próximos a vencer con iconos amarillos.'
  },
  {
    pregunta: '¿Puedo registrar conductores que no son empleados?',
    respuesta: 'Sí, puede registrar conductores externos seleccionando la opción "Externo" al crear el conductor. Esto es útil para contratistas o terceristas.'
  },
  {
    pregunta: '¿Qué pasa si un conductor tiene la licencia vencida?',
    respuesta: 'El sistema mostrará alertas en el dashboard y no permitirá asignar ese conductor a inspecciones hasta que actualice su licencia.'
  },
  {
    pregunta: '¿Cómo exporto el maestro de inspecciones?',
    respuesta: 'Vaya a Vehículos → Maestro inspecciones preoperacionales. Allí podrá descargar un archivo Excel con todo el historial.'
  },
  {
    pregunta: '¿Puedo editar una inspección ya guardada?',
    respuesta: 'Las inspecciones aprobadas no pueden editarse por integridad de datos. Si hay un error, debe crear una nueva inspección con las observaciones correspondientes.'
  }
];

export default function AsistenteModal({ isOpen, onClose }: Props) {
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaAyuda | null>(null);
  const [mostrarFAQ, setMostrarFAQ] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asistente de Seguridad Vial"
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
                    ¡Bienvenido al módulo de Seguridad Vial!
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Seleccione un tema para obtener ayuda paso a paso, o consulte las preguntas frecuentes.
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

            {/* Video tutorial (placeholder) */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <VideoCameraIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ¿Necesita más ayuda?
                  </p>
                  <p className="text-xs text-gray-500">
                    Contacte al administrador del sistema para capacitación personalizada.
                  </p>
                </div>
              </div>
            </div>
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
