// SG-SST Shared Data — Resolución 0312 de 2019

export interface Criterio {
  numeral: string
  criterio: string
  ciclo: 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR'
  estandar: string
  puntaje: number
}

export const CRITERIOS: Criterio[] = [
  // ── I. PLANEAR — Recursos ────────────────────────────────────────────
  {
    numeral: '1.1.1',
    criterio: 'Asignar una persona que cumpla con el siguiente perfil: El diseño e implementación del Sistema de Gestión de SST podrá ser realizado por profesionales en SST, profesionales con posgrado en SST, que cuenten con licencia en SST vigente y que acrediten mínimo dos (2) años de experiencia certificada por las empresas o entidades en las que laboraron en actividades de SST.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.2',
    criterio: 'Asignar y documentar las responsabilidades específicas en el Sistema de Gestión SST a todos los niveles de la organización, para el desarrollo y mejora continua de dicho Sistema.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.3',
    criterio: 'Definir y asignar el talento humano, los recursos financieros, técnicos y tecnológicos, requeridos para la implementación, mantenimiento y continuidad del Sistema de Gestión de SST.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.4',
    criterio: 'Garantizar que todos los trabajadores, independientemente de su forma de vinculación o contratación están afiliados al Sistema de Seguridad Social en Salud, Pensión y Riesgos Laborales.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.5',
    criterio: 'En el caso que aplique, identificar a los trabajadores que se dediquen en forma permanente al ejercicio de las actividades de alto riesgo establecidas en el Decreto 2090 de 2003 o de las normas que lo modifiquen, complementen o sustituyan y cotizar el porcentaje adicional establecido en dicho decreto.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.6',
    criterio: 'Conformar y garantizar el funcionamiento del Comité Paritario de Seguridad y Salud en el Trabajo – COPASST.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.7',
    criterio: 'Capacitar a los integrantes del COPASST para el cumplimiento efectivo de las responsabilidades que les asigna la ley.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.1.8',
    criterio: 'Conformar y garantizar el funcionamiento del Comité de Convivencia Laboral de acuerdo con la normatividad vigente.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 0.5,
  },
  {
    numeral: '1.2.1',
    criterio: 'Elaborar y ejecutar el programa de capacitación en promoción y prevención, que incluye lo referente a los peligros/riesgos prioritarios y las medidas de prevención y control, extensivo a todos los niveles de la organización.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 2,
  },
  {
    numeral: '1.2.2',
    criterio: 'Realizar actividades de inducción y reinducción, las cuales deben estar incluidas en el programa de capacitación, dirigidas a todos los trabajadores, independientemente de su forma de vinculación y/o contratación.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 2,
  },
  {
    numeral: '1.3.1',
    criterio: 'Revisión de alta dirección: La alta dirección realiza una revisión del SG-SST, con una periodicidad mínima anual, de conformidad con las modificaciones en los procesos, resultados de auditorías y demás informes.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 1,
  },
  {
    numeral: '1.3.2',
    criterio: 'Identificación y documentación de las necesidades de salud de los trabajadores.',
    ciclo: 'PLANEAR',
    estandar: 'Recursos',
    puntaje: 1,
  },
  // ── I. PLANEAR — Gestión integral del SG-SST ────────────────────────
  {
    numeral: '2.1.1',
    criterio: 'Política de Seguridad y Salud en el Trabajo: La empresa tiene definida la política de SST. Se encuentra firmada, fechada, comunicada al COPASST y publicada.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  {
    numeral: '2.2.1',
    criterio: 'Objetivos definidos, claros, medibles, cuantificables, con metas, documentados, revisados del SG-SST.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  {
    numeral: '2.3.1',
    criterio: 'Evaluación e identificación de prioridades: La empresa realizó la evaluación inicial del SG-SST.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  {
    numeral: '2.4.1',
    criterio: 'Plan que identifica objetivos, metas, responsabilidad, recursos con cronograma y firmado.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 2,
  },
  {
    numeral: '2.5.1',
    criterio: 'Archivo o retención documental: El empleador tiene definido los documentos del SG-SST, el archivo, la conservación de la documentación y registros.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 2,
  },
  {
    numeral: '2.6.1',
    criterio: 'Rendición de cuentas de manera anual.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  {
    numeral: '2.7.1',
    criterio: 'Identificar la normatividad nacional aplicable al Sistema de Gestión de SST y actualizar la matriz legal.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 2,
  },
  {
    numeral: '2.8.1',
    criterio: 'Mecanismos de comunicación, auto reporte en Sistema de Gestión de Seguridad y Salud en el Trabajo.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  {
    numeral: '2.9.1',
    criterio: 'Identificación, evaluación, para adquisición de productos y servicios en Sistema de Gestión de Seguridad y Salud en el Trabajo.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  {
    numeral: '2.10.1',
    criterio: 'Evaluación y selección de proveedores y contratistas.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 2,
  },
  {
    numeral: '2.11.1',
    criterio: 'Se tiene en cuenta aspectos de SST al evaluar el impacto de los cambios internos y externos de la empresa sobre el Sistema de Gestión de SST.',
    ciclo: 'PLANEAR',
    estandar: 'Gestión integral del SG-SST',
    puntaje: 1,
  },
  // ── II. HACER — Gestión de la salud ─────────────────────────────────
  {
    numeral: '3.1.1',
    criterio: 'Evaluación Médica Ocupacional: El empleador tiene establecidos de manera previa los factores de riesgo ocupacional a que está expuesto el trabajador para lo cual solicita concepto médico pre-ocupacional.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.2',
    criterio: 'Actividades de Promoción y Prevención en Salud: Se realizan actividades de promoción de la salud y la prevención de los riesgos en el trabajo y se lleva registro de dicha actividad.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.3',
    criterio: 'Información al médico de los perfiles de cargo: El empleador suministra al médico los perfiles de cargo y las actividades de riesgo al cual está expuesto el trabajador.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.4',
    criterio: 'Realización de los exámenes médicos ocupacionales: peligros-diagnósticos de salud.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.5',
    criterio: 'Custodia de Historias Clínicas: El empleador garantiza la custodia y confidencialidad de las historias clínicas de los trabajadores.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.6',
    criterio: 'Restricciones y recomendaciones médico laborales: El empleador acata las restricciones y recomendaciones médico laborales realizadas al trabajador.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.7',
    criterio: 'Estilos de vida y entornos saludables (controles tabaquismo, alcoholismo, farmacodependencia y otros).',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.8',
    criterio: 'Agua potable, servicios sanitarios y disposición de basuras.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.1.9',
    criterio: 'Eliminación adecuada de residuos sólidos, líquidos o gaseosos.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.2.1',
    criterio: 'Reporte de los accidentes de trabajo y enfermedad laboral a la ARL, EPS y Dirección Territorial del Ministerio de Trabajo.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 2,
  },
  {
    numeral: '3.2.2',
    criterio: 'Investigación de Accidentes, Incidentes y Enfermedad Laboral: El empleador realiza la investigación de los accidentes e incidentes de trabajo y las enfermedades laborales.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 2,
  },
  {
    numeral: '3.2.3',
    criterio: 'Registro y análisis estadístico de Incidentes, Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.3.1',
    criterio: 'Medición de la severidad de los Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.3.2',
    criterio: 'Medición de la frecuencia de los Incidentes, Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.3.3',
    criterio: 'Medición de la mortalidad de Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.3.4',
    criterio: 'Medición de la prevalencia de incidentes, Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.3.5',
    criterio: 'Medición de la incidencia de Incidentes, Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  {
    numeral: '3.3.6',
    criterio: 'Medición del ausentismo por incidentes, Accidentes de Trabajo y Enfermedad Laboral.',
    ciclo: 'HACER',
    estandar: 'Gestión de la salud',
    puntaje: 1,
  },
  // ── II. HACER — Gestión de peligros y riesgos ────────────────────────
  {
    numeral: '4.1.1',
    criterio: 'Metodología para la identificación, evaluación y valoración de peligros: Se tiene una metodología documentada para identificar los peligros, evaluar y calificar los riesgos, en la que se incluye principio de precaución.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 4,
  },
  {
    numeral: '4.1.2',
    criterio: 'Identificación de peligros con participación de todos los niveles de la empresa.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 4,
  },
  {
    numeral: '4.1.3',
    criterio: 'Identificación y priorización de la naturaleza de los peligros (Metodología adicional, cancerígenos y otros).',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 3,
  },
  {
    numeral: '4.1.4',
    criterio: 'Realización mediciones ambientales, químicos, físicos y biológicos.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 4,
  },
  {
    numeral: '4.2.1',
    criterio: 'Implementación de medidas de prevención y control frente a peligros/riesgos identificados.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 2.5,
  },
  {
    numeral: '4.2.2',
    criterio: 'Verificación aplicación de las medidas de prevención y control por parte de los trabajadores.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 2.5,
  },
  {
    numeral: '4.2.3',
    criterio: 'Elaboración de procedimientos, instructivos, fichas, protocolos.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 2.5,
  },
  {
    numeral: '4.2.4',
    criterio: 'Realización de inspecciones sistemáticas a las instalaciones, maquinaria o equipos con participación del COPASST.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 2.5,
  },
  {
    numeral: '4.2.5',
    criterio: 'Mantenimiento periódico de instalaciones, equipos, máquinas, herramientas.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 2.5,
  },
  {
    numeral: '4.2.6',
    criterio: 'Entrega de Elementos de Protección Persona EPP, se verifica con contratistas y subcontratistas.',
    ciclo: 'HACER',
    estandar: 'Gestión de peligros y riesgos',
    puntaje: 2.5,
  },
  // ── II. HACER — Gestión de amenazas ─────────────────────────────────
  {
    numeral: '5.1.1',
    criterio: 'Se cuenta con el Plan de Prevención, Preparación y Respuesta ante Emergencias.',
    ciclo: 'HACER',
    estandar: 'Gestión de amenazas',
    puntaje: 5,
  },
  {
    numeral: '5.1.2',
    criterio: 'Brigada de prevención conformada, capacitada y dotada.',
    ciclo: 'HACER',
    estandar: 'Gestión de amenazas',
    puntaje: 5,
  },
  // ── III. VERIFICAR ──────────────────────────────────────────────────
  {
    numeral: '6.1.1',
    criterio: 'Indicadores estructura: Contar con los indicadores de estructura definidos en el SG-SST.',
    ciclo: 'VERIFICAR',
    estandar: 'Verificación del SG-SST',
    puntaje: 1.25,
  },
  {
    numeral: '6.1.2',
    criterio: 'Indicadores proceso: Contar con los indicadores de proceso definidos en el SG-SST.',
    ciclo: 'VERIFICAR',
    estandar: 'Verificación del SG-SST',
    puntaje: 1.25,
  },
  {
    numeral: '6.1.3',
    criterio: 'Indicadores resultado: Contar con los indicadores de resultado definidos en el SG-SST.',
    ciclo: 'VERIFICAR',
    estandar: 'Verificación del SG-SST',
    puntaje: 1.25,
  },
  {
    numeral: '6.1.4',
    criterio: 'Revisión por la alta dirección: La alta dirección realiza la revisión del SG-SST con una periodicidad mínima anual.',
    ciclo: 'VERIFICAR',
    estandar: 'Verificación del SG-SST',
    puntaje: 1.25,
  },
  // ── IV. ACTUAR ──────────────────────────────────────────────────────
  {
    numeral: '7.1.1',
    criterio: 'Definición de acciones preventivas y correctivas con base en resultados del SG-SST.',
    ciclo: 'ACTUAR',
    estandar: 'Mejoramiento',
    puntaje: 2.5,
  },
  {
    numeral: '7.1.2',
    criterio: 'Acciones de mejora conforme a revisión de la alta dirección.',
    ciclo: 'ACTUAR',
    estandar: 'Mejoramiento',
    puntaje: 2.5,
  },
  {
    numeral: '7.1.3',
    criterio: 'Acciones de mejora con base en investigaciones de accidentes de trabajo y enfermedades laborales.',
    ciclo: 'ACTUAR',
    estandar: 'Mejoramiento',
    puntaje: 2.5,
  },
  {
    numeral: '7.1.4',
    criterio: 'Elaboración Plan de Mejora e implementación de medidas y acciones correctivas solicitadas por autoridades y ARL.',
    ciclo: 'ACTUAR',
    estandar: 'Mejoramiento',
    puntaje: 2.5,
  },
]

// ── Empresa defaults ─────────────────────────────────────────────────────────
export interface EmpresaData {
  nombre: string
  departamento: string
  municipio: string
  nombreComercial: string
  tamano: string
  arl: string
  nit: string
  nivelRiesgo: string
  nitDigito: string
  telefono: string
  actividadEconomica: string
  direccion: string
  consultaMedico: string
  sitioWeb: string
  correo: string
  politica: string
  referenciasExternas: string
  logoUrl: string
}

export const EMPRESA_DEFAULT: EmpresaData = {
  nombre: 'Coninsa Ramon H. S.A.',
  departamento: 'Antioquia',
  municipio: 'Medellín',
  nombreComercial: 'Coninsa Ramon H.',
  tamano: 'GRANDE',
  arl: 'Positiva Compañía de Seguros',
  nit: '890911431',
  nivelRiesgo: 'IV',
  nitDigito: '890911431-1',
  telefono: '5116199',
  actividadEconomica: 'Construcción de edificios residenciales',
  direccion: 'Calle 55 # 45-55',
  consultaMedico: '',
  sitioWeb: 'https://www.coninsa.co',
  correo: 'lorozco@coninsa.co',
  politica:
    'Coninsa Ramon H. S.A., empresa comprometida con la Seguridad y Salud en el Trabajo, se compromete a proporcionar condiciones de trabajo seguras y saludables para la prevención de lesiones y enfermedades laborales relacionadas con el trabajo y a través del Sistema de Gestión de Seguridad y Salud en el Trabajo SG-SST.',
  referenciasExternas: '',
  logoUrl: '',
}

// ── Periodo types ─────────────────────────────────────────────────────────────
export interface Periodo {
  id: string
  anio: number
  ciclo: string // '01' | '02' — semestre
  label: string
  activo: boolean
  creado: string
}

export interface CriterioEstado {
  numeral: string
  semaforo: 'CT' | 'CP' | 'NC' | 'NAJ' | ''
  cumplimiento: number
  observacion: string
  documentos: number
}

export interface PeriodoData {
  periodoId: string
  estados: CriterioEstado[]
}

// ── Actividad planeador ───────────────────────────────────────────────────────
export interface ActividadPlaneador {
  id: string
  nombre: string
  tipo: string
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA'
  cicloPhva: 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR'
  fechaInicio: string
  fechaFin: string
  sedeId?: string
  sede?: string
  poblacionObjetivo: number
  asistentes: number
  estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA'
  mes: number
  anio: number
}
