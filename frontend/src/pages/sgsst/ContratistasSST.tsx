import { useState, useRef } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import {
  FaHandshake, FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaQrcode, FaUpload, FaDownload, FaFileExcel, FaEllipsisV,
  FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
  FaUser, FaBuilding, FaPhone, FaEnvelope, FaCalendarAlt,
  FaShieldAlt, FaPrint, FaHome, FaArrowLeft, FaArrowRight,
  FaFolder, FaUsers, FaTable, FaChartBar,
  FaFile, FaHeartbeat, FaWhatsapp,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = 'panel' | 'agregar' | 'trabajadores' | 'qr' | 'importacion' | 'informacion' | 'matriz' | 'csv' | 'csvparam'
type NivelRiesgo = 'I' | 'II' | 'III' | 'IV' | 'V'
type Tamano = 'Micro' | 'Pequeña' | 'Mediana' | 'Grande'
type Estado = 'Activo' | 'Inactivo' | 'Suspendido' | 'En evaluación'
type DocEstado = 'Vigente' | 'Vencido' | 'Pendiente'

interface DocItem { nombre: string; estado: DocEstado; fechaVencimiento: string }

interface Contratista {
  id: string
  // 1. Datos Básicos
  razonSocial: string
  representante: string
  nombreComercial: string
  nit: string
  nitDigito: string
  direccion: string
  telefono: string
  email: string
  sitioWeb: string
  // 2. Clasificación Empresarial
  tipo: string
  tamano: Tamano
  departamento: string
  municipio: string
  actividadEconomica: string
  // 3. Clasificación SG-SST
  arl: string
  nivelRiesgo: NivelRiesgo
  vencimientoSS: string
  operadorPagoSS: string
  centroEntrenamiento: string
  consultaExamenMedico: boolean
  ipsExamenes: string
  // 4. Detalles de Contratación
  clasificacionCategoria: string
  clasificacionCuadrante: string
  personaContacto: string
  contactoAdmin: string
  actividades: string
  costoHora: string
  // 5. Permisos / Configuración
  activo: boolean
  actualizacionMasivaSS: string
  actualizacionMasivaCursos: string
  usuario: string
  clave: string
  permisosEspeciales: boolean
  // 6. Categorización Interna
  categoria1: string
  categoria2: string
  categoria3: string
  // 7. Integración Externa
  codigoSistemaExterno: string
  // Stats (internal)
  estado: Estado
  diasCorte: number
  totalTrabajadores: number
  trabajadoresActivos: number
  trabajadoresHabilitados: number
  ssAlDia: number
  conCertificaciones: number
  conInduccion: number
  documentos: DocItem[]
}

type ContratistaForm = Omit<Contratista, 'id' | 'documentos'>

interface Trabajador {
  id: string
  documento: string
  nombre: string
  cargo: string
  historia: boolean
  activo: boolean
  habilitado: boolean
  parafiscales: boolean
  certificacion: boolean
  otrosCursos: boolean
  induccion: boolean
  contratistaId: string
  sede: string
  // Sec 1
  empleadoActivo: boolean
  fechaExpedicion: string
  fechaNacimiento: string
  sexo: string
  estadoCivil: string
  ubicacionFisica: string
  tipoVinculacion: string
  salario: string
  nivelEscolaridad: string
  raza: string
  // Sec 2
  eps: string
  direccionResidencia: string
  telefonoResidencia: string
  telefonoMovil: string
  grupoSanguineo: string
  discapacidad: string
  contactoEmergencias: string
  telefonoEmergencias: string
  enfermedades: string[]
  transporte: string
  ingresoEmpresa: string
  retiroEmpresa: string
  // Sec 3
  vencExamen: string
  vencAlturas: string
  vencConfinados: string
  certRequeridas: string[]
  // Sec 4
  accesoContratista: boolean
  estadoSS: boolean
  certTareas: boolean
  cursoEspecifico: boolean
  induccionSitio: boolean
  fechaRevision: string
  periodicidadExamen: number
  accesoGeneral: boolean
  // Sec 5
  fotografia: string
  notas: string
}

type TrabajadorForm = Omit<Trabajador, 'id'>

// ─── Static data ─────────────────────────────────────────────────────────────
const DPTOS_COL = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bogotá','Bolívar','Boyacá','Caldas',
  'Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Guainía',
  'Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño','N. de Santander',
  'Putumayo','Quindío','Risaralda','San Andrés','Santander','Sucre','Tolima',
  'Valle del Cauca','Vaupés','Vichada','Otro',
]
const MUNICIPIOS_MAP: Record<string, string[]> = {
  'Amazonas': ['Leticia','Puerto Nariño'],
  'Antioquia': ['Medellín','Bello','Itagüí','Envigado','Rionegro','Apartadó','Caucasia','Turbo'],
  'Arauca': ['Arauca','Saravena','Arauquita','Tame'],
  'Atlántico': ['Barranquilla','Soledad','Malambo','Sabanagrande','Sabanalarga'],
  'Bogotá': ['Bogotá D.C.'],
  'Bolívar': ['Cartagena','Magangué','El Carmen de Bolívar','Turbaco'],
  'Boyacá': ['Tunja','Duitama','Sogamoso','Chiquinquirá'],
  'Caldas': ['Manizales','La Dorada','Chinchiná','Riosucio'],
  'Caquetá': ['Florencia','San Vicente del Caguán','Puerto Rico'],
  'Casanare': ['Yopal','Aguazul','Villanueva','Tauramena'],
  'Cauca': ['Popayán','Santander de Quilichao','Puerto Tejada'],
  'Cesar': ['Valledupar','Aguachica','Codazzi','Bosconia'],
  'Chocó': ['Quibdó','Istmina','Tadó'],
  'Córdoba': ['Montería','Cereté','Lorica','Sahagún'],
  'Cundinamarca': ['Soacha','Facatativá','Zipaquirá','Chía','Fusagasugá','Mosquera','Madrid'],
  'Guainía': ['Inírida'],
  'Guaviare': ['San José del Guaviare','El Retorno'],
  'Huila': ['Neiva','Pitalito','Garzón','La Plata'],
  'La Guajira': ['Riohacha','Maicao','Uribia','Manaure'],
  'Magdalena': ['Santa Marta','Ciénaga','Fundación','El Banco'],
  'Meta': ['Villavicencio','Acacías','Granada','Puerto López'],
  'Nariño': ['Pasto','Tumaco','Ipiales','Túquerres'],
  'N. de Santander': ['Cúcuta','Ocaña','Pamplona','Villa del Rosario'],
  'Putumayo': ['Mocoa','Puerto Asís','Orito'],
  'Quindío': ['Armenia','Calarcá','Montenegro','Quimbaya'],
  'Risaralda': ['Pereira','Dosquebradas','Santa Rosa de Cabal','La Virginia'],
  'San Andrés': ['San Andrés','Providencia'],
  'Santander': ['Bucaramanga','Floridablanca','Girón','Barrancabermeja','Piedecuesta'],
  'Sucre': ['Sincelejo','Corozal','San Marcos','Sampués'],
  'Tolima': ['Ibagué','Espinal','Melgar','Honda'],
  'Valle del Cauca': ['Cali','Buenaventura','Palmira','Buga','Tuluá','Cartago','Jamundí'],
  'Vaupés': ['Mitú'],
  'Vichada': ['Puerto Carreño'],
  'Otro': ['Otro municipio'],
}
const ARLS_COL = ['Alfa','AXA Colpatria','Aurora','Bolivar','Colmena','La Previsora','La Equidad','Liberty','Mapfre','Positiva','Royal','Sura']
const OPERADORES_SS = ['SOI','Mi planilla','Aportes en linea','Asopagos','Fedecajas (Pila Facil) Suspendida Temporalmente','Simple','Arus (Enlace operativo)']
const CLASIFICACIONES_CAT = [
  'SERVICIO DE CONSTRUCCIÓN','ALQUILER DE EQUIPOS','CONTRATOS TODO COSTO',
  'HONORARIOS PROFESIONALES','CONTRATOS MANO DE OBRA','PRESTACIÓN DE SERVICIOS',
  'SUMINISTRO × CONTRATO','TRANSPORTES Y ACARREOS','CONTRATOS DE VIGILANCIA',
]
const CLASIFICACIONES_CUAD = [
  '1 PRELIMINARES Y DEMOLICIONES','2 MOVIMIENTO DE TIERRAS','3 CIMENTACIONES',
  '4 ESTRUCTURAS METÁLICAS','5 CONCRETO ESTRUCTURAL','6 MAMPOSTERÍA',
  '7 CUBIERTAS Y FACHADAS','8 IMPERMEABILIZACIONES','9 INSTALACIONES HIDRÁULICAS',
  '10 INSTALACIONES SANITARIAS','11 ESTRUCTURA','12 INSTALACIONES ELÉCTRICAS',
  '13 INSTALACIONES GAS','14 INSTALACIONES ESPECIALES','15 CIELOS RASOS',
  '16 PISOS Y ENCHAPES','17 ESTUCADOS Y PINTURAS','18 CARPINTERÍA MADERA',
  '19 CARPINTERÍA METÁLICA','20 VIDRIOS Y ESPEJOS','21 APARATOS SANITARIOS',
  '22 EQUIPOS ESPECIALES','23 URBANISMO EXTERIOR','24 SEÑALIZACIÓN',
  '25 MOBILIARIO','26 EQUIPOS DE COCINA','27 ASCENSORES Y ESCALERAS',
  '28 OBRA CIVIL COMPLEMENTARIA','29 CONSULTORÍA Y GERENCIA','30 ALIMENTACIÓN',
]
const CATEGORIAS_1 = ['Nacional','Regional Antioquia','Regional Centro','Regional Caribe']
const CATEGORIAS_2 = ['Sedes Administrativas','Sedes ABR','Obras','Salas de Negocios']
const CATEGORIAS_3 = ['UEN CPP','DEI']
const CIIU_CODES = [
  '0111 - Cultivo de cereales','0112 - Cultivo de arroz','0121 - Cultivo de frutas tropicales',
  '1011 - Procesamiento y conservación de carne','1030 - Elaboración de aceites',
  '2010 - Fabricación de sustancias químicas básicas','2100 - Fabricación de productos farmacéuticos',
  '2410 - Industrias básicas de hierro y acero','2511 - Fabricación de productos metálicos',
  '2610 - Fabricación de componentes electrónicos','2910 - Fabricación de vehículos automotores',
  '3311 - Mantenimiento de maquinaria','3320 - Instalación de maquinaria industrial',
  '4111 - Construcción de edificios residenciales','4112 - Construcción de edificios no residenciales',
  '4210 - Construcción de carreteras','4220 - Construcción de proyectos de servicio público',
  '4290 - Construcción de otras obras de ingeniería civil',
  '4511 - Comercio de vehículos automotores','4711 - Comercio al por menor no especializado',
  '4923 - Transporte de carga por carretera','5210 - Almacenamiento y depósito',
  '5610 - Actividades de restaurantes','6110 - Actividades de telecomunicaciones',
  '6201 - Desarrollo de sistemas informáticos','6290 - Otras actividades de tecnología',
  '6412 - Bancos comerciales','6810 - Actividades inmobiliarias',
  '6920 - Actividades de contabilidad','7010 - Administración empresarial',
  '7110 - Actividades de arquitectura e ingeniería','7210 - Investigación y desarrollo',
  '7490 - Otras actividades profesionales','7735 - Alquiler de maquinaria',
  '8010 - Actividades de seguridad privada','8121 - Limpieza general de edificios',
  '8130 - Paisajismo y jardinería','8299 - Otras actividades de apoyo empresarial',
  '8411 - Administración pública general','8542 - Educación superior',
  '8610 - Actividades hospitalarias','8621 - Práctica médica',
  '9311 - Gestión de instalaciones deportivas','9511 - Mantenimiento de computadores',
  '9600 - Otras actividades de servicios personales','9900 - Organizaciones extraterritoriales',
]

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DEFAULTS = {
  nombreComercial: '', nitDigito: '0', direccion: 'Calle 1 # 1-1', sitioWeb: '',
  tipo: 'Juridica', actividadEconomica: '4111 - Construcción de edificios residenciales',
  vencimientoSS: '30', operadorPagoSS: 'SOI', centroEntrenamiento: '',
  consultaExamenMedico: false, ipsExamenes: '',
  clasificacionCategoria: 'CONTRATOS TODO COSTO', clasificacionCuadrante: '1 PRELIMINARES Y DEMOLICIONES',
  personaContacto: '', contactoAdmin: '', costoHora: '',
  actualizacionMasivaSS: 'No', actualizacionMasivaCursos: 'No',
  clave: '', permisosEspeciales: false,
  categoria1: 'Nacional', categoria2: 'Obras', categoria3: 'UEN CPP',
  codigoSistemaExterno: '', diasCorte: 30, estado: 'Activo' as Estado,
}

const MOCK: Contratista[] = [
  {
    id: '1', nit: '900123456', razonSocial: 'Constructora Andina S.A.S',
    representante: 'Carlos Méndez', telefono: '310 456 7890', email: 'carlos@constructoraandina.com',
    departamento: 'Cundinamarca', municipio: 'Soacha', nivelRiesgo: 'IV', tamano: 'Mediana',
    arl: 'Sura', actividades: 'Obras civiles y construcción de infraestructura',
    activo: true, usuario: 'constructoraandina',
    totalTrabajadores: 45, trabajadoresActivos: 38, trabajadoresHabilitados: 35,
    ssAlDia: 30, conCertificaciones: 28, conInduccion: 33,
    ...MOCK_DEFAULTS,
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-06-30' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Certificado ARL', estado: 'Vigente', fechaVencimiento: '2025-09-15' },
    ],
  },
  {
    id: '2', nit: '800987654', razonSocial: 'Servicios Técnicos Industriales Ltda',
    representante: 'Ana Gómez', telefono: '315 789 0123', email: 'ana@servtecind.com',
    departamento: 'Antioquia', municipio: 'Medellín', nivelRiesgo: 'III', tamano: 'Pequeña',
    arl: 'Positiva', actividades: 'Mantenimiento de equipos industriales',
    activo: true, usuario: 'servtecind',
    totalTrabajadores: 12, trabajadoresActivos: 10, trabajadoresHabilitados: 9,
    ssAlDia: 8, conCertificaciones: 7, conInduccion: 9,
    ...MOCK_DEFAULTS, estado: 'Activo',
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vencido', fechaVencimiento: '2024-12-31' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-02-28' },
      { nombre: 'Certificado ARL', estado: 'Pendiente', fechaVencimiento: '-' },
    ],
  },
  {
    id: '3', nit: '901234567', razonSocial: 'Vigilancia y Seguridad ProTech S.A',
    representante: 'Luis Torres', telefono: '320 111 2233', email: 'ltorres@protech.com',
    departamento: 'Valle del Cauca', municipio: 'Cali', nivelRiesgo: 'III', tamano: 'Grande',
    arl: 'Colmena', actividades: 'Vigilancia privada y seguridad 24/7',
    activo: true, usuario: 'protech',
    totalTrabajadores: 80, trabajadoresActivos: 75, trabajadoresHabilitados: 70,
    ssAlDia: 68, conCertificaciones: 60, conInduccion: 72,
    ...MOCK_DEFAULTS,
    clasificacionCategoria: 'CONTRATOS DE VIGILANCIA',
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-09-30' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Certificado ARL', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Licencia Vigilancia', estado: 'Vigente', fechaVencimiento: '2026-06-30' },
    ],
  },
  {
    id: '4', nit: '700456789', razonSocial: 'Aseo Industrial del Valle S.A.S',
    representante: 'María Ruiz', telefono: '312 345 6789', email: 'mruiz@aseoindustrial.com',
    departamento: 'Atlántico', municipio: 'Barranquilla', nivelRiesgo: 'II', tamano: 'Pequeña',
    arl: 'Sura', actividades: 'Servicios de aseo y limpieza industrial',
    activo: false, usuario: 'aseoindustrial',
    totalTrabajadores: 20, trabajadoresActivos: 0, trabajadoresHabilitados: 0,
    ssAlDia: 0, conCertificaciones: 0, conInduccion: 0,
    ...MOCK_DEFAULTS, estado: 'Suspendido',
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vencido', fechaVencimiento: '2024-05-31' },
      { nombre: 'Póliza RC', estado: 'Vencido', fechaVencimiento: '2024-05-31' },
      { nombre: 'Certificado ARL', estado: 'Vencido', fechaVencimiento: '2024-05-31' },
    ],
  },
  {
    id: '5', nit: '860123987', razonSocial: 'TechSoft Consultoría S.A.S',
    representante: 'Pedro Vargas', telefono: '317 654 3210', email: 'pedro@techsoft.co',
    departamento: 'Cundinamarca', municipio: 'Soacha', nivelRiesgo: 'I', tamano: 'Micro',
    arl: 'Liberty', actividades: 'Consultoría en tecnología y sistemas',
    activo: false, usuario: 'techsoft',
    totalTrabajadores: 5, trabajadoresActivos: 3, trabajadoresHabilitados: 2,
    ssAlDia: 3, conCertificaciones: 0, conInduccion: 1,
    ...MOCK_DEFAULTS, estado: 'En evaluación',
    clasificacionCategoria: 'HONORARIOS PROFESIONALES',
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'Póliza RC', estado: 'Pendiente', fechaVencimiento: '-' },
      { nombre: 'Certificado ARL', estado: 'Pendiente', fechaVencimiento: '-' },
    ],
  },
  {
    id: '6', nit: '830456123', razonSocial: 'Logística Express Colombia S.A',
    representante: 'Sandra Moreno', telefono: '301 987 6543', email: 'smoreno@logexpress.com',
    departamento: 'Cundinamarca', municipio: 'Soacha', nivelRiesgo: 'V', tamano: 'Grande',
    arl: 'AXA Colpatria', actividades: 'Transporte de carga pesada y logística',
    activo: true, usuario: 'logexpress',
    totalTrabajadores: 60, trabajadoresActivos: 55, trabajadoresHabilitados: 50,
    ssAlDia: 48, conCertificaciones: 40, conInduccion: 52,
    ...MOCK_DEFAULTS,
    clasificacionCategoria: 'TRANSPORTES Y ACARREOS',
    documentos: [
      { nombre: 'RUT', estado: 'Vigente', fechaVencimiento: '2026-12-31' },
      { nombre: 'Cámara de Comercio', estado: 'Vigente', fechaVencimiento: '2025-10-31' },
      { nombre: 'Póliza RC', estado: 'Vigente', fechaVencimiento: '2025-06-30' },
      { nombre: 'Certificado ARL', estado: 'Vigente', fechaVencimiento: '2025-12-31' },
      { nombre: 'SOAT Vehículos', estado: 'Vigente', fechaVencimiento: '2025-08-15' },
    ],
  },
]

const EMPTY_FORM: ContratistaForm = {
  razonSocial: '', representante: '', nombreComercial: '',
  nit: '', nitDigito: '', direccion: '', telefono: '', email: '', sitioWeb: '',
  tipo: 'Juridica', tamano: 'Pequeña', departamento: '', municipio: '',
  actividadEconomica: '',
  arl: '', nivelRiesgo: 'I', vencimientoSS: '30', operadorPagoSS: '',
  centroEntrenamiento: '', consultaExamenMedico: false, ipsExamenes: '',
  clasificacionCategoria: '', clasificacionCuadrante: '',
  personaContacto: '', contactoAdmin: '', actividades: '', costoHora: '',
  activo: true, actualizacionMasivaSS: 'No', actualizacionMasivaCursos: 'No',
  usuario: '', clave: '', permisosEspeciales: false,
  categoria1: '', categoria2: '', categoria3: '', codigoSistemaExterno: '',
  estado: 'En evaluación', diasCorte: 30,
  totalTrabajadores: 0, trabajadoresActivos: 0, trabajadoresHabilitados: 0,
  ssAlDia: 0, conCertificaciones: 0, conInduccion: 0,
}

const REQUISITOS = [
  'ARL vigente', 'Póliza RC', 'Cámara de Comercio', 'RUT',
  'EPS al día', 'Parafiscales', 'Plan trabajo SST', 'Reglamento Higiene',
  'SGSST implementado',
]

const TABS: { id: Tab; label: string; activeClass: string }[] = [
  { id: 'panel', label: 'Panel de contratistas', activeClass: 'bg-green-600 text-white' },
  { id: 'agregar', label: '+ Agregar contratista', activeClass: 'bg-teal-600 text-white' },
  { id: 'trabajadores', label: 'Contratistas/Trabajadores', activeClass: 'bg-teal-600 text-white' },
  { id: 'qr', label: 'QR de Acceso', activeClass: 'bg-teal-600 text-white' },
  { id: 'importacion', label: 'Importación/Actualización', activeClass: 'bg-teal-600 text-white' },
  { id: 'informacion', label: 'Información registrada por contratistas', activeClass: 'bg-orange-500 text-white' },
  { id: 'matriz', label: 'Matriz de cumplimiento a requisitos', activeClass: 'bg-teal-600 text-white' },
  { id: 'csv', label: 'Maestro contratistas CSV', activeClass: 'bg-gray-600 text-white' },
  { id: 'csvparam', label: 'Maestro contratistas CSV parametrizado', activeClass: 'bg-gray-600 text-white' },
]

const estadoBadge: Record<Estado, string> = {
  Activo: 'bg-green-100 text-green-800', Inactivo: 'bg-gray-100 text-gray-700',
  Suspendido: 'bg-red-100 text-red-800', 'En evaluación': 'bg-yellow-100 text-yellow-800',
}
const riesgoBadge: Record<NivelRiesgo, string> = {
  I: 'bg-green-100 text-green-700', II: 'bg-lime-100 text-lime-700',
  III: 'bg-yellow-100 text-yellow-700', IV: 'bg-orange-100 text-orange-700', V: 'bg-red-100 text-red-700',
}
const docIcon: Record<DocEstado, JSX.Element> = {
  Vigente: <FaCheckCircle className="text-green-500" />,
  Vencido: <FaTimesCircle className="text-red-500" />,
  Pendiente: <FaExclamationTriangle className="text-yellow-500" />,
}

const STEPS = ['Datos Básicos', 'Clasificación', 'Contratación', 'Configuración']
const MODAL_TABS_TRB = ['Información Personal', 'Contacto y Vital', 'Certificaciones', 'Controles de Acceso', 'Multimedia']
const EPS_LIST = ['Salud Total','Sura EPS','Sanitas','Compensar','Coomeva','Nueva EPS','Famisanar','Medimás','Coosalud','Mutual Ser','Cajacopi','Emssanar','SOS']
const ESCOLARIDAD = ['Analfabeta','Primaria Completa','Primaria Incompleta','Secundaria Completa','Secundaria Incompleta','Tecnico','Tecnologico','Profesional Completo','Profesional Incompleto','Especialista','Master','Magister','Doctorado']
const RAZAS = ['No Aplica','No Informa','Caucasica','Negra/Afrocolombiana','Indígena','Mestiza','Mulata','Raizal','Gitana (Rrom)']
const ESTADOS_CIVILES = ['Soltero','Casado','Union Libre','Viudo','Divorciado']
const VINCULACIONES_BASICOS = ['Empleado','Contratista','Temporal','Practicante','Aprendiz','EnMision']
const VINCULACIONES_CONTRATO = ['SinContrato','TerminoFijo','Indefinido','ObraLabor','PrestacionServicios','Aprendizaje','Ocasional']
const GRUPOS_SANGUINEOS = ['O+','O-','A+','A-','B+','B-','AB+','AB-']
const DISCAPACIDADES = ['NO','Motriz','Visual','Auditiva','Sensorial','Mental','Psiquica']
const TRANSPORTES = ['A Pie','Bicicleta Publica','Bicicleta Particular','Motocicleta','Vehiculo Compartido','Vehiculo Individual','Vehiculo De Empresa','Bus Urbano','Medio Masivo','Metro','Taxi','Otro']
const CERTIFICACIONES_OPC = ['Alturas','EspaciosConfinados','TrabajoEnCaliente','Radiaciones','SeguridadVial','Brigadista','RiesgoSanitario','Alimentos','Químicos','TemperaturasExtremas']
const ENFERMEDADES_OPC = ['Ninguno','Embarazo','Convivencia con personal salud','Convivencia mayores de 60','Comorbilidades preexistentes','Enfermedad pulmonar','Enfermedad cardiaca','Enfermedad renal','Enfermedad inmunosupresora','Hipertensión','Diabetes','Cáncer','Trasplante']
const SEDES_DISPONIBLES = ['CONTROL PROVISIONAL LA RIVIERE ET3 T2','Salitre Centrik Town','34 STREET','ELEMENT','TORRES BAHÍA','SinAsignar - Incorrecta','Sede Principal','Obra Norte','Obra Sur','Centro Comercial Santafé','Parque Empresarial']

const EMPTY_TRABAJADOR: TrabajadorForm = {
  documento:'',nombre:'',cargo:'',historia:false,activo:true,habilitado:true,
  parafiscales:false,certificacion:false,otrosCursos:false,induccion:false,
  contratistaId:'',sede:'',empleadoActivo:true,fechaExpedicion:'',fechaNacimiento:'',
  sexo:'M',estadoCivil:'Soltero',ubicacionFisica:'',tipoVinculacion:'Contratista',
  salario:'',nivelEscolaridad:'',raza:'No Aplica',eps:'',direccionResidencia:'',
  telefonoResidencia:'',telefonoMovil:'',grupoSanguineo:'O+',discapacidad:'NO',
  contactoEmergencias:'',telefonoEmergencias:'',enfermedades:['Ninguno'],
  transporte:'Bus Urbano',ingresoEmpresa:'',retiroEmpresa:'',
  vencExamen:'',vencAlturas:'',vencConfinados:'',certRequeridas:[],
  accesoContratista:true,estadoSS:false,certTareas:false,cursoEspecifico:false,
  induccionSitio:false,fechaRevision:'',periodicidadExamen:365,accesoGeneral:true,
  fotografia:'',notas:'',
}

const TRABAJADORES_MOCK: Trabajador[] = [
  { id:'w1',documento:'1002490066',nombre:'LUIS EDUARDO PEÑALOZA DE LA OSSA',cargo:'',historia:false,activo:true,habilitado:true,parafiscales:false,certificacion:true,otrosCursos:true,induccion:true,contratistaId:'1',sede:'CONTROL PROVISIONAL LA RIVIERE ET3 T2',empleadoActivo:true,fechaExpedicion:'2005-03-10',fechaNacimiento:'1985-03-15',sexo:'M',estadoCivil:'Casado',ubicacionFisica:'Torre A Piso 3',tipoVinculacion:'Contratista',salario:'2500000',nivelEscolaridad:'Tecnico',raza:'No Aplica',eps:'Sura EPS',direccionResidencia:'Calle 50 # 30-15',telefonoResidencia:'6017551234',telefonoMovil:'3105551234',grupoSanguineo:'O+',discapacidad:'NO',contactoEmergencias:'María Peñaloza',telefonoEmergencias:'3115559876',enfermedades:['Ninguno'],transporte:'Bus Urbano',ingresoEmpresa:'2023-01-15',retiroEmpresa:'',vencExamen:'2025-12-31',vencAlturas:'2025-06-30',vencConfinados:'',certRequeridas:['Alturas'],accesoContratista:true,estadoSS:false,certTareas:true,cursoEspecifico:true,induccionSitio:true,fechaRevision:'2025-09-30',periodicidadExamen:365,accesoGeneral:true,fotografia:'',notas:'' },
  { id:'w2',documento:'1037625656',nombre:'MELISSA LOMBANA FERRER',cargo:'PROFESIONAL SST',historia:true,activo:false,habilitado:false,parafiscales:false,certificacion:false,otrosCursos:false,induccion:false,contratistaId:'2',sede:'Salitre Centrik Town',empleadoActivo:false,fechaExpedicion:'2010-07-22',fechaNacimiento:'1990-07-22',sexo:'F',estadoCivil:'Soltera',ubicacionFisica:'Oficina SST',tipoVinculacion:'PrestacionServicios',salario:'4500000',nivelEscolaridad:'Profesional Completo',raza:'No Aplica',eps:'Sanitas',direccionResidencia:'Carrera 15 # 85-20',telefonoResidencia:'6014441122',telefonoMovil:'3164441122',grupoSanguineo:'A+',discapacidad:'NO',contactoEmergencias:'Julio Lombana',telefonoEmergencias:'3104449911',enfermedades:['Ninguno'],transporte:'Vehiculo Individual',ingresoEmpresa:'2022-06-01',retiroEmpresa:'',vencExamen:'2025-05-31',vencAlturas:'',vencConfinados:'',certRequeridas:[],accesoContratista:false,estadoSS:false,certTareas:false,cursoEspecifico:false,induccionSitio:false,fechaRevision:'',periodicidadExamen:365,accesoGeneral:false,fotografia:'',notas:'Contrato pendiente de renovación' },
  { id:'w3',documento:'1012403694',nombre:'DILY ZULAIDY LATORRE LUQUE',cargo:'PROFESIONAL SST',historia:false,activo:false,habilitado:false,parafiscales:false,certificacion:true,otrosCursos:true,induccion:true,contratistaId:'2',sede:'.',empleadoActivo:false,fechaExpedicion:'2012-11-05',fechaNacimiento:'1992-11-05',sexo:'F',estadoCivil:'Soltero',ubicacionFisica:'',tipoVinculacion:'PrestacionServicios',salario:'4000000',nivelEscolaridad:'Profesional Completo',raza:'No Aplica',eps:'Compensar',direccionResidencia:'Av 68 # 22-15',telefonoResidencia:'6013332200',telefonoMovil:'3173332200',grupoSanguineo:'B+',discapacidad:'NO',contactoEmergencias:'Rosa Luque',telefonoEmergencias:'3183339988',enfermedades:['Ninguno'],transporte:'Medio Masivo',ingresoEmpresa:'2023-03-01',retiroEmpresa:'',vencExamen:'2025-09-30',vencAlturas:'',vencConfinados:'',certRequeridas:[],accesoContratista:false,estadoSS:false,certTareas:true,cursoEspecifico:true,induccionSitio:true,fechaRevision:'',periodicidadExamen:365,accesoGeneral:false,fotografia:'',notas:'' },
  { id:'w4',documento:'1012403695',nombre:'DILY ZULAIDY LATORRE LUQUE',cargo:'PROFESIONAL CONSULTORIA',historia:false,activo:false,habilitado:true,parafiscales:false,certificacion:true,otrosCursos:true,induccion:true,contratistaId:'2',sede:'SinAsignar - Incorrecta',empleadoActivo:true,fechaExpedicion:'2012-11-05',fechaNacimiento:'1992-11-05',sexo:'F',estadoCivil:'Soltero',ubicacionFisica:'',tipoVinculacion:'Contratista',salario:'3800000',nivelEscolaridad:'Profesional Completo',raza:'No Aplica',eps:'Compensar',direccionResidencia:'Av 68 # 22-15',telefonoResidencia:'6013332200',telefonoMovil:'3173332200',grupoSanguineo:'B+',discapacidad:'NO',contactoEmergencias:'Rosa Luque',telefonoEmergencias:'3183339988',enfermedades:['Ninguno'],transporte:'Medio Masivo',ingresoEmpresa:'2023-08-01',retiroEmpresa:'',vencExamen:'2025-12-31',vencAlturas:'',vencConfinados:'',certRequeridas:[],accesoContratista:false,estadoSS:false,certTareas:true,cursoEspecifico:true,induccionSitio:true,fechaRevision:'',periodicidadExamen:365,accesoGeneral:false,fotografia:'',notas:'' },
  { id:'w5',documento:'8164901',nombre:'SANTIAGO MOSQUERA',cargo:'GERENTE',historia:false,activo:false,habilitado:true,parafiscales:false,certificacion:true,otrosCursos:true,induccion:true,contratistaId:'2',sede:'SinAsignar - Incorrecta',empleadoActivo:false,fechaExpedicion:'2000-04-18',fechaNacimiento:'1978-04-18',sexo:'M',estadoCivil:'Casado',ubicacionFisica:'Gerencia',tipoVinculacion:'Empleado',salario:'8000000',nivelEscolaridad:'Especialista',raza:'No Aplica',eps:'Salud Total',direccionResidencia:'Calle 100 # 9-43',telefonoResidencia:'6016667788',telefonoMovil:'3006667788',grupoSanguineo:'O-',discapacidad:'NO',contactoEmergencias:'Patricia Mosquera',telefonoEmergencias:'3016669900',enfermedades:['Hipertensión'],transporte:'Vehiculo Individual',ingresoEmpresa:'2020-01-01',retiroEmpresa:'',vencExamen:'2026-01-31',vencAlturas:'',vencConfinados:'',certRequeridas:[],accesoContratista:false,estadoSS:false,certTareas:true,cursoEspecifico:true,induccionSitio:true,fechaRevision:'2026-01-01',periodicidadExamen:365,accesoGeneral:true,fotografia:'',notas:'' },
  { id:'w6',documento:'1022349317',nombre:'GUSTAVO DIAZ CIFUENTES',cargo:'APOYO EN OFICIOS VARIOS',historia:false,activo:true,habilitado:true,parafiscales:false,certificacion:true,otrosCursos:true,induccion:true,contratistaId:'3',sede:'SinAsignar - Incorrecta',empleadoActivo:true,fechaExpedicion:'2015-09-12',fechaNacimiento:'1995-09-12',sexo:'M',estadoCivil:'Soltero',ubicacionFisica:'Bodega',tipoVinculacion:'Contratista',salario:'1300000',nivelEscolaridad:'Secundaria Completa',raza:'No Aplica',eps:'Nueva EPS',direccionResidencia:'Cra 30 # 4-50',telefonoResidencia:'6014448877',telefonoMovil:'3114448877',grupoSanguineo:'A-',discapacidad:'NO',contactoEmergencias:'Carmen Cifuentes',telefonoEmergencias:'3124449966',enfermedades:['Ninguno'],transporte:'Bicicleta Particular',ingresoEmpresa:'2024-02-01',retiroEmpresa:'',vencExamen:'2025-08-31',vencAlturas:'2025-03-31',vencConfinados:'',certRequeridas:['Alturas','SeguridadVial'],accesoContratista:true,estadoSS:false,certTareas:true,cursoEspecifico:true,induccionSitio:true,fechaRevision:'2025-08-01',periodicidadExamen:365,accesoGeneral:true,fotografia:'',notas:'' },
  { id:'w7',documento:'1045678912',nombre:'ANDREA CAROLINA MESA RESTREPO',cargo:'INSPECTOR SST',historia:true,activo:true,habilitado:true,parafiscales:true,certificacion:true,otrosCursos:false,induccion:true,contratistaId:'1',sede:'Obra Norte',empleadoActivo:true,fechaExpedicion:'2013-05-20',fechaNacimiento:'1993-05-20',sexo:'F',estadoCivil:'Union Libre',ubicacionFisica:'Campo',tipoVinculacion:'TerminoFijo',salario:'2800000',nivelEscolaridad:'Tecnologico',raza:'No Aplica',eps:'Famisanar',direccionResidencia:'Calle 72 # 45-12',telefonoResidencia:'6018881122',telefonoMovil:'3208881122',grupoSanguineo:'B-',discapacidad:'NO',contactoEmergencias:'Luis Mesa',telefonoEmergencias:'3218889900',enfermedades:['Ninguno'],transporte:'Motocicleta',ingresoEmpresa:'2023-07-01',retiroEmpresa:'',vencExamen:'2026-07-31',vencAlturas:'2025-12-31',vencConfinados:'2025-06-30',certRequeridas:['Alturas','EspaciosConfinados','TrabajoEnCaliente'],accesoContratista:true,estadoSS:true,certTareas:true,cursoEspecifico:false,induccionSitio:true,fechaRevision:'2026-01-01',periodicidadExamen:365,accesoGeneral:true,fotografia:'',notas:'' },
  { id:'w8',documento:'1098765432',nombre:'CAMILO ERNESTO VARGAS PINILLA',cargo:'OPERARIO',historia:false,activo:true,habilitado:false,parafiscales:false,certificacion:false,otrosCursos:false,induccion:false,contratistaId:'6',sede:'SinAsignar - Incorrecta',empleadoActivo:true,fechaExpedicion:'2018-01-30',fechaNacimiento:'1998-01-30',sexo:'M',estadoCivil:'Soltero',ubicacionFisica:'',tipoVinculacion:'ObraLabor',salario:'1160000',nivelEscolaridad:'Secundaria Incompleta',raza:'No Aplica',eps:'Coosalud',direccionResidencia:'Transv 22 # 15-8',telefonoResidencia:'',telefonoMovil:'3001112233',grupoSanguineo:'O+',discapacidad:'NO',contactoEmergencias:'Rosa Pinilla',telefonoEmergencias:'3011119988',enfermedades:['Ninguno'],transporte:'A Pie',ingresoEmpresa:'2025-01-10',retiroEmpresa:'',vencExamen:'',vencAlturas:'',vencConfinados:'',certRequeridas:[],accesoContratista:true,estadoSS:false,certTareas:false,cursoEspecifico:false,induccionSitio:false,fechaRevision:'',periodicidadExamen:365,accesoGeneral:false,fotografia:'',notas:'Pendiente de inducción y examen médico' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function certDateStatus(fecha: string): { label: string; cls: string } {
  if (!fecha) return { label: 'Pendiente', cls: 'bg-yellow-100 text-yellow-800' }
  const today = new Date()
  const d = new Date(fecha + 'T00:00:00')
  if (d < today) return { label: 'Vencido', cls: 'bg-red-100 text-red-800' }
  const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  if (diff <= 30) return { label: 'Por vencer', cls: 'bg-orange-100 text-orange-700' }
  return { label: 'Vigente', cls: 'bg-green-100 text-green-800' }
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ContratistasSST() {
  const [tab, setTab] = useState<Tab>('panel')
  const [items, setItems] = useState<Contratista[]>(MOCK)
  const [selected, setSelected] = useState<Contratista | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ContratistaForm>(EMPTY_FORM)
  const [filtroRiesgo, setFiltroRiesgo] = useState('Todos')
  const [filtroTamano, setFiltroTamano] = useState('Todos')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [importRows, setImportRows] = useState<Record<string, unknown>[]>([])
  const [csvParams, setCsvParams] = useState({ estado: 'Todos', riesgo: 'Todos', tamano: 'Todos' })
  const fileRef = useRef<HTMLInputElement>(null)
  const [qrSelected, setQrSelected] = useState(items[0]?.id ?? '')
  // Trabajadores filter state
  const [tipoVista, setTipoVista] = useState<'tabla' | 'furat'>('tabla')
  const [filtroContratistaQ, setFiltroContratistaQ] = useState('')
  const [filtroContratistaId, setFiltroContratistaId] = useState('')
  const [showContratistaDropdown, setShowContratistaDropdown] = useState(false)
  const [filtroCuadrante, setFiltroCuadrante] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroArl, setFiltroArl] = useState('')
  const [resultados, setResultados] = useState<Contratista[] | null>(null)
  // Empleados/trabajadores
  const [trabajadores] = useState<Trabajador[]>(TRABAJADORES_MOCK)
  const [vistaEmpleados, setVistaEmpleados] = useState(false)
  const [searchTrb, setSearchTrb] = useState('')
  const [paginaTrb, setPaginaTrb] = useState(1)
  const [perPageTrb, setPerPageTrb] = useState(25)
  const [trabajadorModal, setTrabajadorModal] = useState<Trabajador | null>(null)
  const [trabajadorForm, setTrabajadorForm] = useState<TrabajadorForm>(EMPTY_TRABAJADOR)
  const [modalTab, setModalTab] = useState(0)
  const stf = (k: keyof TrabajadorForm, v: unknown) => setTrabajadorForm(p => ({ ...p, [k]: v }))

  const sf = (k: keyof ContratistaForm, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  // Sub-modal state
  const [showCertModal, setShowCertModal] = useState(false)
  const [showSoportesModal, setShowSoportesModal] = useState(false)
  const [showSSModal, setShowSSModal] = useState(false)
  const [showAlturasModal, setShowAlturasModal] = useState(false)
  const [soportesUploads, setSoportesUploads] = useState<{ id: string; nombre: string; size: string; dataUrl: string }[]>([])


  function openNew() { setForm(EMPTY_FORM); setEditId(null); setStep(0); setTab('agregar') }
  function openEdit(c: Contratista) {
    const { id: _i, documentos: _d, ...rest } = c
    setForm(rest); setEditId(c.id); setStep(0); setTab('agregar')
  }
  function handleSave() {
    if (!form.nit || !form.razonSocial) { toast.error('NIT y nombre de empresa son obligatorios'); return }
    if (editId) {
      setItems(p => p.map(c => c.id === editId ? { ...c, ...form } : c))
      toast.success('Contratista actualizado')
    } else {
      setItems(p => [...p, { id: Date.now().toString(), ...form, documentos: [] }])
      toast.success('Contratista registrado')
    }
    setTab('trabajadores')
  }
  function handleDelete(id: string) {
    setItems(p => p.filter(c => c.id !== id))
    setConfirmDel(null)
    if (selected?.id === id) setSelected(null)
    toast.success('Contratista eliminado')
  }
  function exportCSV(parameterized = false) {
    let data = parameterized
      ? items.filter(c =>
          (csvParams.estado === 'Todos' || c.estado === csvParams.estado) &&
          (csvParams.riesgo === 'Todos' || c.nivelRiesgo === csvParams.riesgo) &&
          (csvParams.tamano === 'Todos' || c.tamano === csvParams.tamano)
        )
      : items
    const rows = data.map(c => ({
      NIT: c.nit, 'Razón Social': c.razonSocial, Representante: c.representante,
      Teléfono: c.telefono, Email: c.email, Departamento: c.departamento,
      Municipio: c.municipio, 'Nivel Riesgo': c.nivelRiesgo, Tamaño: c.tamano,
      ARL: c.arl, CIIU: c.actividadEconomica, Estado: c.estado,
      'Total Trabajadores': c.totalTrabajadores, 'Activos': c.trabajadoresActivos,
    }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Contratistas')
    XLSX.writeFile(wb, parameterized ? 'maestro-contratistas-param.xlsx' : 'maestro-contratistas.xlsx')
    toast.success(`${rows.length} registros exportados`)
  }
  function handleImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const wb = XLSX.read(new Uint8Array(ev.target?.result as ArrayBuffer), { type: 'array' })
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { raw: false, defval: '' })
        setImportRows(json)
        toast.success(`${json.length} filas cargadas`)
      } catch { toast.error('Error al leer el archivo') }
    }
    reader.readAsArrayBuffer(file)
  }

  function handleGuardarNota() {
    const nota = trabajadorForm.notas.trim()
    if (!nota) { toast.error('Escribe una nota antes de guardar'); return }
    const phone = (trabajadorForm.telefonoMovil || '').replace(/\D/g, '')
    const contratista = items.find(c => c.id === trabajadorForm.contratistaId)
    const email = contratista?.email ?? ''
    const nombre = trabajadorForm.nombre
    const fecha = new Date().toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    const msg = `📋 Nota SST [${fecha}]\nTrabajador: ${nombre}\nDoc: ${trabajadorForm.documento}\n\n${nota}`
    if (phone) {
      window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(msg)}`, '_blank')
    }
    if (email) {
      setTimeout(() => {
        const subject = encodeURIComponent(`Nota SST – ${nombre} (${trabajadorForm.documento})`)
        const body = encodeURIComponent(msg)
        window.open(`mailto:${email}?subject=${subject}&body=${body}`)
      }, 500)
    }
    toast.success(`Nota guardada${phone ? ` · WhatsApp +57${phone}` : ''}${email ? ` · Email ${email}` : ''}`)
  }

  function buildSoportesDocs() {
    const docs: { id: string; nombre: string; vencimiento: string; estado: string }[] = [
      { id: 'doc-id', nombre: 'Documento de Identidad', vencimiento: '—', estado: 'Vigente' },
      { id: 'doc-eps', nombre: `Afiliación EPS — ${trabajadorForm.eps || 'Sin EPS'}`, vencimiento: '—', estado: trabajadorForm.estadoSS ? 'Vigente' : 'Pendiente' },
      { id: 'doc-examen', nombre: 'Examen Médico Ocupacional', vencimiento: trabajadorForm.vencExamen || '—', estado: certDateStatus(trabajadorForm.vencExamen).label },
    ]
    if (trabajadorForm.vencAlturas || trabajadorForm.certRequeridas.includes('Alturas')) {
      docs.push({ id: 'doc-alturas', nombre: 'Cert. Trabajo Seguro en Alturas', vencimiento: trabajadorForm.vencAlturas || '—', estado: certDateStatus(trabajadorForm.vencAlturas).label })
    }
    if (trabajadorForm.vencConfinados || trabajadorForm.certRequeridas.includes('EspaciosConfinados')) {
      docs.push({ id: 'doc-conf', nombre: 'Cert. Espacios Confinados', vencimiento: trabajadorForm.vencConfinados || '—', estado: certDateStatus(trabajadorForm.vencConfinados).label })
    }
    trabajadorForm.certRequeridas.filter(c => c !== 'Alturas' && c !== 'EspaciosConfinados').forEach((c, i) => {
      docs.push({ id: `doc-cert-${i}`, nombre: `Certificado ${c}`, vencimiento: '—', estado: 'Pendiente' })
    })
    return docs
  }

  // ── Dashboard totals ───────────────────────────────────────────────────────
  const totalActivos = items.reduce((s, c) => s + c.trabajadoresActivos, 0)
  const totalInactivos = items.reduce((s, c) => s + (c.totalTrabajadores - c.trabajadoresActivos), 0)
  const totalHabilitados = items.reduce((s, c) => s + c.trabajadoresHabilitados, 0)
  const totalDeshabilitados = items.reduce((s, c) => s + (c.totalTrabajadores - c.trabajadoresHabilitados), 0)
  const totalSS = items.reduce((s, c) => s + c.ssAlDia, 0)
  const totalSSPend = items.reduce((s, c) => s + (c.trabajadoresActivos - c.ssAlDia), 0)
  const totalCert = items.reduce((s, c) => s + c.conCertificaciones, 0)
  const totalSinCert = items.reduce((s, c) => s + (c.trabajadoresActivos - c.conCertificaciones), 0)
  const totalInduccion = items.reduce((s, c) => s + c.conInduccion, 0)
  const totalSinInduccion = items.reduce((s, c) => s + (c.trabajadoresActivos - c.conInduccion), 0)
  const totalWorkers = items.reduce((s, c) => s + c.totalTrabajadores, 0)

  const nivelCounts = (['I', 'II', 'III', 'IV', 'V'] as NivelRiesgo[]).map(n => items.filter(c => c.nivelRiesgo === n).length)
  const tamanoCounts = (['Micro', 'Pequeña', 'Mediana', 'Grande'] as Tamano[]).map(t => items.filter(c => c.tamano === t).length)

  const barData = {
    labels: ['I', 'II', 'III', 'IV', 'V'],
    datasets: [{ label: 'Contratistas', data: nivelCounts, backgroundColor: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'], borderRadius: 4 }],
  }
  const donutData = {
    labels: ['Micro', 'Pequeña', 'Mediana', 'Grande'],
    datasets: [{ data: tamanoCounts, backgroundColor: ['#3b82f6', '#f97316', '#ef4444', '#22c55e'] }],
  }

  const qrContratista = items.find(c => c.id === qrSelected)

  // ── Renders ────────────────────────────────────────────────────────────────
  const renderPanel = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">Distribución de Contratistas por Nivel de Riesgo</h3>
        <div className="h-64">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} />
        </div>
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          {(['I', 'II', 'III', 'IV', 'V'] as NivelRiesgo[]).map((n, i) => (
            <span key={n} className={`px-2 py-0.5 rounded text-xs font-medium ${['bg-green-100 text-green-700', 'bg-lime-100 text-lime-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700'][i]}`}>
              {n}: {nivelCounts[i]}
            </span>
          ))}
        </div>
      </div>

      {/* Workers state table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-white border-b">
          <h3 className="font-semibold text-red-600 text-sm text-center">Estado general de trabajadores de contratistas</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left text-xs text-gray-600 font-semibold">Estado</th>
              <th className="px-3 py-2 text-right text-xs text-gray-600 font-semibold">Conteo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['Activo (por contratista)', totalActivos],
              ['Inactivo (por contratista)', totalInactivos],
              ['Habilitado (por contratante)', totalHabilitados],
              ['Deshabilitado (por contratante)', totalDeshabilitados],
              ['Seguridad social al día', totalSS],
              ['Seguridad social pendiente', totalSSPend],
              ['Cuenta con certificaciones de tarea', totalCert],
              ['Sin certificaciones de tarea', totalSinCert],
              ['Realizada inducción en sitio', totalInduccion],
              ['Pendiente inducción en sitio', totalSinInduccion],
              ['Con cursos específicos vigentes', totalCert],
              ['Sin cursos específicos reportados', totalSinCert],
            ].map(([label, val]) => (
              <tr key={label as string} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-xs text-gray-700">{label as string}</td>
                <td className="px-3 py-2 text-xs text-gray-800 font-medium text-right">{val as number}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td className="px-3 py-2 text-xs font-bold text-gray-700" colSpan={2}>
                Total registros encontrados: {items.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Donut chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-4 text-sm">Distribución de contratistas por tamaño</h3>
        <div className="h-64 flex items-center justify-center">
          <Doughnut
            data={donutData}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, font: { size: 11 } } },
                tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}` } },
              },
              cutout: '60%',
            }}
          />
        </div>
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          {(['Micro', 'Pequeña', 'Mediana', 'Grande'] as Tamano[]).map((t, i) => (
            <span key={t} className={`px-2 py-0.5 rounded text-xs font-medium ${['bg-blue-100 text-blue-700', 'bg-orange-100 text-orange-700', 'bg-red-100 text-red-700', 'bg-green-100 text-green-700'][i]}`}>
              {t}: {tamanoCounts[i]}
            </span>
          ))}
        </div>
      </div>

      {/* KPI bar */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Contratistas activos', val: items.filter(c => c.estado === 'Activo').length, color: 'text-green-600 bg-green-50 border-green-200' },
          { label: 'Total trabajadores', val: totalWorkers, color: 'text-blue-600 bg-blue-50 border-blue-200' },
          { label: 'Docs vencidos/pend.', val: items.reduce((s, c) => s + c.documentos.filter(d => d.estado !== 'Vigente').length, 0), color: 'text-red-600 bg-red-50 border-red-200' },
          { label: 'En evaluación', val: items.filter(c => c.estado === 'En evaluación').length, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
        ].map(k => (
          <div key={k.label} className={`rounded-lg border p-4 ${k.color}`}>
            <div className="text-2xl font-bold">{k.val}</div>
            <div className="text-xs mt-1 opacity-80">{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAgregar = () => {
    const municipios = form.departamento ? (MUNICIPIOS_MAP[form.departamento] ?? []) : []
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Stepper */}
          <div className="flex border-b border-gray-200">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={`flex-1 py-3 text-xs font-medium text-center border-b-2 transition-colors ${
                  i === step ? 'border-blue-600 text-blue-600 bg-blue-50' :
                  i < step ? 'border-green-500 text-green-600' : 'border-transparent text-gray-400'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-1 ${
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>{i < step ? '✓' : i + 1}</span>
                {s}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── STEP 0: Datos Básicos ─────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">1. Datos Básicos de la Empresa</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Nombre empresa Contratista <span className="text-red-500">*</span></label>
                    <input className="form-input" value={form.razonSocial} onChange={e => sf('razonSocial', e.target.value)} placeholder="Nombre de la empresa Contratista" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Nombre del representante legal</label>
                    <input className="form-input" value={form.representante} onChange={e => sf('representante', e.target.value)} placeholder="Nombre del representante legal" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Nombre Comercial</label>
                    <input className="form-input" value={form.nombreComercial} onChange={e => sf('nombreComercial', e.target.value)} placeholder="Nombre Comercial" />
                  </div>
                  <div>
                    <label className="form-label">Nit <span className="text-red-500">*</span></label>
                    <input className="form-input" value={form.nit} onChange={e => sf('nit', e.target.value.replace(/\D/g, ''))} placeholder="N.I.T" />
                  </div>
                  <div>
                    <label className="form-label">Nit - Dígito</label>
                    <input className="form-input" value={form.nitDigito} onChange={e => sf('nitDigito', e.target.value)} placeholder="Dígito de verificación" maxLength={1} />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Dirección</label>
                    <input className="form-input" value={form.direccion} onChange={e => sf('direccion', e.target.value)} placeholder="Dirección empresa contratista" />
                  </div>
                  <div>
                    <label className="form-label">Teléfono</label>
                    <input className="form-input" value={form.telefono} onChange={e => sf('telefono', e.target.value)} placeholder="Número telefónico empresa Contratista" />
                  </div>
                  <div>
                    <label className="form-label">Correo</label>
                    <input type="email" className="form-input" value={form.email} onChange={e => sf('email', e.target.value)} placeholder="Correo electrónico empresa contratista" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Sitio web</label>
                    <input className="form-input" value={form.sitioWeb} onChange={e => sf('sitioWeb', e.target.value)} placeholder="Sitio web empresa contratista" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 1: Clasificación ─────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 mb-4">2. Clasificación Empresarial</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Tipo</label>
                      <select className="form-select" value={form.tipo} onChange={e => sf('tipo', e.target.value)}>
                        <option value="">Seleccionar</option>
                        <option>Juridica</option>
                        <option>Natural</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Tamaño de la empresa</label>
                      <select className="form-select" value={form.tamano} onChange={e => sf('tamano', e.target.value as Tamano)}>
                        <option value="">Seleccionar</option>
                        {(['Micro', 'Pequeña', 'Mediana', 'Grande'] as Tamano[]).map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Departamento</label>
                      <select className="form-select" value={form.departamento} onChange={e => { sf('departamento', e.target.value); sf('municipio', '') }}>
                        <option value="">Seleccionar</option>
                        {DPTOS_COL.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Municipio</label>
                      <select className="form-select" value={form.municipio} onChange={e => sf('municipio', e.target.value)} disabled={!form.departamento}>
                        <option value="">Seleccionar municipio</option>
                        {municipios.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Actividad económica</label>
                      <select className="form-select" value={form.actividadEconomica} onChange={e => sf('actividadEconomica', e.target.value)}>
                        <option value="">Seleccionar código CIIU</option>
                        {CIIU_CODES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 mb-4">3. Clasificación SG-SST</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">ARL</label>
                      <select className="form-select" value={form.arl} onChange={e => sf('arl', e.target.value)}>
                        <option value="">Seleccionar ARL</option>
                        {ARLS_COL.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Nivel de riesgo</label>
                      <select className="form-select" value={form.nivelRiesgo} onChange={e => sf('nivelRiesgo', e.target.value as NivelRiesgo)}>
                        {(['I', 'II', 'III', 'IV', 'V'] as NivelRiesgo[]).map(n => (
                          <option key={n} value={n}>Nivel {n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Venc. seguridad social</label>
                      <select className="form-select" value={form.vencimientoSS} onChange={e => sf('vencimientoSS', e.target.value)}>
                        <option value="">Seleccionar día</option>
                        {Array.from({ length: 31 }, (_, i) => String(i + 1)).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Operador Pago Seguridad Social</label>
                      <select className="form-select" value={form.operadorPagoSS} onChange={e => sf('operadorPagoSS', e.target.value)}>
                        <option value="">Seleccionar operador</option>
                        {OPERADORES_SS.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Centro de entrenamiento</label>
                      <select className="form-select" value={form.centroEntrenamiento} onChange={e => sf('centroEntrenamiento', e.target.value)}>
                        <option value="">Seleccionar centro</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-700">Consulta examen médico</div>
                          <div className="text-xs text-gray-400">Habilita la consulta de exámenes médicos del contratista</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => sf('consultaExamenMedico', !form.consultaExamenMedico)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.consultaExamenMedico ? 'bg-primary-600' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.consultaExamenMedico ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                    {form.consultaExamenMedico && (
                      <div className="col-span-2">
                        <label className="form-label">IPS exámenes médicos</label>
                        <input className="form-input" value={form.ipsExamenes} onChange={e => sf('ipsExamenes', e.target.value)} placeholder="Nombre de la IPS" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Contratación ─────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">4. Detalles de Contratación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Clasificación por categoría</label>
                    <select className="form-select" value={form.clasificacionCategoria} onChange={e => sf('clasificacionCategoria', e.target.value)}>
                      <option value="">Seleccionar categoría</option>
                      {CLASIFICACIONES_CAT.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Clasificación por cuadrante</label>
                    <select className="form-select" value={form.clasificacionCuadrante} onChange={e => sf('clasificacionCuadrante', e.target.value)}>
                      <option value="">Seleccionar etapa de obra</option>
                      {CLASIFICACIONES_CUAD.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Persona de contacto para contratación</label>
                    <input className="form-input" value={form.personaContacto} onChange={e => sf('personaContacto', e.target.value)} placeholder="Nombre de contacto" />
                  </div>
                  <div>
                    <label className="form-label">Contacto administrador contrato</label>
                    <input className="form-input" value={form.contactoAdmin} onChange={e => sf('contactoAdmin', e.target.value)} placeholder="Nombre del administrador" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Actividad(es) principales contratada(s)</label>
                    <textarea className="form-input" rows={3} value={form.actividades} onChange={e => sf('actividades', e.target.value)} placeholder="Describa las actividades principales contratadas..." />
                  </div>
                  <div>
                    <label className="form-label">Costo por hora (Si aplica)</label>
                    <input className="form-input" value={form.costoHora} onChange={e => sf('costoHora', e.target.value.replace(/\D/g, ''))} placeholder="Valor en pesos" />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Configuración ─────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                {/* Permisos Especiales */}
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 mb-4">5. Permisos Especiales y Configuración de Usuario</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Activo?</div>
                        <div className="text-xs text-gray-400">Activa o desactiva el contratista en el sistema</div>
                      </div>
                      <button type="button" onClick={() => sf('activo', !form.activo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.activo ? 'bg-primary-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-blue-800">Permisos especiales</div>
                        <button type="button" onClick={() => sf('permisosEspeciales', !form.permisosEspeciales)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.permisosEspeciales ? 'bg-primary-600' : 'bg-gray-300'}`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.permisosEspeciales ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <p className="text-xs text-blue-700">Indique si este contratista puede realizar operaciones especiales extendidas sobre todos los trabajadores de su empresa.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Actualización masiva de seguridad social</label>
                        <select className="form-select" value={form.actualizacionMasivaSS} onChange={e => sf('actualizacionMasivaSS', e.target.value)}>
                          <option>No</option>
                          <option>Si</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Actualización masiva de cursos específicos</label>
                        <select className="form-select" value={form.actualizacionMasivaCursos} onChange={e => sf('actualizacionMasivaCursos', e.target.value)}>
                          <option>No</option>
                          <option>Si</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Usuario</label>
                        <input className="form-input" value={form.usuario} onChange={e => sf('usuario', e.target.value)} placeholder="Nombre de usuario" />
                      </div>
                      <div>
                        <label className="form-label">Clave</label>
                        <input type="password" className="form-input" value={form.clave} onChange={e => sf('clave', e.target.value)} placeholder="Contraseña" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categorización Interna */}
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 mb-4">6. Categorización Interna</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="form-label">Categoría 1 (mayor nivel)</label>
                      <select className="form-select" value={form.categoria1} onChange={e => sf('categoria1', e.target.value)}>
                        <option value="">Seleccionar</option>
                        {CATEGORIAS_1.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Categoría 2 (nivel intermedio)</label>
                      <select className="form-select" value={form.categoria2} onChange={e => sf('categoria2', e.target.value)}>
                        <option value="">Seleccionar</option>
                        {CATEGORIAS_2.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Categoría 3 (nivel inferior)</label>
                      <select className="form-select" value={form.categoria3} onChange={e => sf('categoria3', e.target.value)}>
                        <option value="">Seleccionar</option>
                        {CATEGORIAS_3.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Integración Externa */}
                <div>
                  <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 mb-4">7. Integración Externa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Código de sistema externo</label>
                      <input className="form-input" value={form.codigoSistemaExterno} onChange={e => sf('codigoSistemaExterno', e.target.value)} placeholder="ID para sistemas como Colmedicos/Sofia" />
                    </div>
                    <div>
                      <label className="form-label">Estado del contratista</label>
                      <select className="form-select" value={form.estado} onChange={e => sf('estado', e.target.value as Estado)}>
                        {(['Activo', 'Inactivo', 'Suspendido', 'En evaluación'] as Estado[]).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step nav */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between">
            <div className="flex gap-2">
              {step > 0 && (
                <button className="btn-secondary flex items-center gap-1" onClick={() => setStep(s => s - 1)}>
                  <FaArrowLeft className="text-xs" /> Anterior
                </button>
              )}
              <button className="btn-secondary" onClick={() => setTab('trabajadores')}>Cancelar</button>
            </div>
            {step < 3 ? (
              <button className="btn-primary flex items-center gap-1" onClick={() => setStep(s => s + 1)}>
                Siguiente <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button className="btn-primary" onClick={handleSave}>
                {editId ? 'Actualizar' : 'Guardar contratista'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderTrabajadores = () => {
    const sugerencias = filtroContratistaQ.length >= 2
      ? items.filter(c => c.razonSocial.toLowerCase().includes(filtroContratistaQ.toLowerCase()) || c.nit.includes(filtroContratistaQ))
      : []

    function buscar(todos = false) {
      setVistaEmpleados(false)
      let res = todos ? items : items.filter(c => {
        const matchContratista = !filtroContratistaId || c.id === filtroContratistaId
        const matchCuadrante = !filtroCuadrante || c.clasificacionCuadrante === filtroCuadrante
        const matchCategoria = !filtroCategoria || c.clasificacionCategoria === filtroCategoria
        const matchRiesgo = filtroRiesgo === 'Todos' || c.nivelRiesgo === filtroRiesgo
        const matchTamano = filtroTamano === 'Todos' || c.tamano === filtroTamano
        const matchArl = !filtroArl || c.arl === filtroArl
        return matchContratista && matchCuadrante && matchCategoria && matchRiesgo && matchTamano && matchArl
      })
      setResultados(res)
    }

    const data = resultados ?? []

    return (
      <div className="space-y-4">
        {/* ── Filter card ── */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <FaSearch className="text-gray-400 text-sm" />
            <span className="font-semibold text-gray-700 text-sm">Filtros de búsqueda</span>
            <button className="ml-auto btn-primary flex items-center gap-2 text-xs" onClick={openNew}>
              <FaPlus className="text-xs" /> Nuevo contratista
            </button>
          </div>
          <div className="p-5 space-y-4">
            {/* Tipo de vista */}
            <div>
              <label className="form-label mb-2">Tipo de vista para los resultados</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTipoVista('tabla')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    tipoVista === 'tabla' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <FaTable className="text-xs" /> Tabla de datos de registros
                </button>
                <button
                  onClick={() => setTipoVista('furat')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    tipoVista === 'furat' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <FaChartBar className="text-xs" /> Reportes FURAT por contratista
                </button>
              </div>
            </div>

            {/* Filters grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Contratista específico */}
              <div className="relative">
                <label className="form-label">Contratista específico</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                  <input
                    className="form-input pl-8"
                    placeholder="Seleccione y digite para buscar"
                    value={filtroContratistaQ}
                    onChange={e => { setFiltroContratistaQ(e.target.value); setFiltroContratistaId(''); setShowContratistaDropdown(true) }}
                    onFocus={() => setShowContratistaDropdown(true)}
                    onBlur={() => setTimeout(() => setShowContratistaDropdown(false), 200)}
                  />
                  {filtroContratistaId && (
                    <button onClick={() => { setFiltroContratistaQ(''); setFiltroContratistaId('') }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>
                {showContratistaDropdown && sugerencias.length > 0 && (
                  <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {sugerencias.map(c => (
                      <button
                        key={c.id}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 border-b border-gray-100 last:border-0"
                        onMouseDown={() => { setFiltroContratistaQ(c.razonSocial); setFiltroContratistaId(c.id); setShowContratistaDropdown(false) }}
                      >
                        <span className="font-medium text-gray-800">{c.razonSocial}</span>
                        <span className="text-gray-400 ml-2">NIT: {c.nit}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cuadrante */}
              <div>
                <label className="form-label">Cuadrante (etapa de obra)</label>
                <select className="form-select" value={filtroCuadrante} onChange={e => setFiltroCuadrante(e.target.value)}>
                  <option value="">Todos los cuadrantes</option>
                  {CLASIFICACIONES_CUAD.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Categoría */}
              <div>
                <label className="form-label">Categoría de contratista</label>
                <select className="form-select" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
                  <option value="">Todas las categorías</option>
                  {CLASIFICACIONES_CAT.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Nivel de riesgo */}
              <div>
                <label className="form-label">Nivel de riesgo</label>
                <select className="form-select" value={filtroRiesgo} onChange={e => setFiltroRiesgo(e.target.value)}>
                  <option value="Todos">Todos los niveles</option>
                  {(['I', 'II', 'III', 'IV', 'V'] as NivelRiesgo[]).map(n => (
                    <option key={n} value={n}>Nivel {n}</option>
                  ))}
                </select>
              </div>

              {/* Tamaño */}
              <div>
                <label className="form-label">Tamaño</label>
                <select className="form-select" value={filtroTamano} onChange={e => setFiltroTamano(e.target.value)}>
                  <option value="Todos">Todos los tamaños</option>
                  {(['Micro', 'Pequeña', 'Mediana', 'Grande'] as Tamano[]).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* ARL */}
              <div>
                <label className="form-label">ARL</label>
                <select className="form-select" value={filtroArl} onChange={e => setFiltroArl(e.target.value)}>
                  <option value="">Todas las ARL</option>
                  {ARLS_COL.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-1 flex flex-wrap gap-3 items-center border-t border-gray-100">
              {/* Buscar principal */}
              <button
                onClick={() => buscar(false)}
                className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-lg text-sm transition-colors shadow-sm"
              >
                <FaSearch /> Buscar
              </button>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              {/* Ver todos */}
              <button
                onClick={() => { setVistaEmpleados(true); setResultados(null) }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                <FaUsers className="text-sm" /> Ver trabajadores de TODOS los contratistas
              </button>

              {/* CENSO */}
              <button
                onClick={() => toast('Informe de censo de población vulnerable (COVID-19)')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                <FaExclamationTriangle className="text-sm" /> Resultados de CENSO Población vulnerable
              </button>

              {/* Soportes */}
              <button
                onClick={() => toast('Repositorio global de documentos de contratistas')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
              >
                <FaFolder className="text-sm" /> Soportes
              </button>
            </div>
          </div>
        </div>

        {/* ── Results ── */}
        {vistaEmpleados ? renderEmpleados() : resultados === null ? (
          <div className="bg-white rounded-lg border border-dashed border-gray-300 py-16 text-center">
            <FaSearch className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Seleccione los filtros y presione <strong>Buscar</strong> para ver los resultados</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">{data.length} contratista(s) encontrado(s)</span>
              <button onClick={() => setResultados(null)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <FaTimes className="text-xs" /> Limpiar resultados
              </button>
            </div>

            {tipoVista === 'furat' ? (
              /* ── FURAT view ── */
              <div className="space-y-3">
                {data.map(c => {
                  const pct = c.totalTrabajadores > 0 ? Math.round((c.trabajadoresActivos / c.totalTrabajadores) * 100) : 0
                  return (
                    <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{c.razonSocial}</h4>
                          <p className="text-xs text-gray-400">NIT: {c.nit} · ARL: {c.arl} · Riesgo {c.nivelRiesgo}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[c.estado]}`}>{c.estado}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: 'Total', val: c.totalTrabajadores, color: 'text-gray-700' },
                          { label: 'Activos', val: c.trabajadoresActivos, color: 'text-green-600' },
                          { label: 'SS al día', val: c.ssAlDia, color: 'text-blue-600' },
                          { label: 'Certificados', val: c.conCertificaciones, color: 'text-purple-600' },
                        ].map(k => (
                          <div key={k.label} className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className={`text-xl font-bold ${k.color}`}>{k.val}</div>
                            <div className="text-xs text-gray-400">{k.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Trabajadores activos</span><span>{pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
                {data.length === 0 && <div className="bg-white rounded-lg border border-gray-200 py-10 text-center text-sm text-gray-400">No se encontraron contratistas con los filtros aplicados</div>}
              </div>
            ) : (
              /* ── Table view ── */
              <>
                <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Razón Social / NIT</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ARL / Riesgo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tamaño / Categoría</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Trabajadores</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Habilitados</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SS al día</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Certificaciones</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Docs</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.map(c => {
                        const docOk = c.documentos.filter(d => d.estado === 'Vigente').length
                        return (
                          <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-800 text-sm">{c.razonSocial}</div>
                              <div className="text-xs text-gray-400">{c.nit}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-gray-600">{c.arl}</div>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${riesgoBadge[c.nivelRiesgo]}`}>Nivel {c.nivelRiesgo}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-gray-600">{c.tamano}</div>
                              <div className="text-xs text-gray-400 truncate max-w-36">{c.clasificacionCategoria || '—'}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm font-medium">{c.totalTrabajadores}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-xs text-gray-700">{c.trabajadoresHabilitados}/{c.totalTrabajadores}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-medium ${c.ssAlDia === c.trabajadoresActivos ? 'text-green-600' : 'text-orange-600'}`}>
                                {c.ssAlDia}/{c.trabajadoresActivos}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-medium ${c.conCertificaciones === c.trabajadoresActivos ? 'text-green-600' : 'text-orange-600'}`}>
                                {c.conCertificaciones}/{c.trabajadoresActivos}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[c.estado]}`}>{c.estado}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-semibold ${docOk === c.documentos.length ? 'text-green-600' : 'text-red-600'}`}>
                                {docOk}/{c.documentos.length}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center relative">
                              <button onClick={() => setMenuId(menuId === c.id ? null : c.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                                <FaEllipsisV className="text-xs" />
                              </button>
                              {menuId === c.id && (
                                <div className="absolute right-8 top-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-36 text-left" onClick={() => setMenuId(null)}>
                                  <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 text-gray-700" onClick={() => setSelected(c)}>
                                    <FaEye className="text-blue-500" /> Ver detalle
                                  </button>
                                  <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 text-gray-700" onClick={() => openEdit(c)}>
                                    <FaEdit className="text-yellow-500" /> Editar
                                  </button>
                                  <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-gray-50 text-gray-700">
                                    <FaShieldAlt className="text-green-500" /> Evaluar
                                  </button>
                                  <button className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 text-red-600 border-t" onClick={() => setConfirmDel(c.id)}>
                                    <FaTrash /> Eliminar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {data.length === 0 && <div className="text-center py-10 text-sm text-gray-400">No se encontraron contratistas con los filtros aplicados</div>}
                </div>

                {/* Detail panel */}
                {selected && (
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800">{selected.razonSocial}</h3>
                        <p className="text-sm text-gray-500">NIT: {selected.nit} · {selected.municipio}, {selected.departamento}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[selected.estado]}`}>{selected.estado}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${riesgoBadge[selected.nivelRiesgo]}`}>Riesgo {selected.nivelRiesgo}</span>
                        <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 ml-2"><FaTimes /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
                      {([
                        [<FaUser />, 'Representante', selected.representante],
                        [<FaPhone />, 'Teléfono', selected.telefono],
                        [<FaEnvelope />, 'Email', selected.email],
                        [<FaShieldAlt />, 'ARL', selected.arl],
                        [<FaBuilding />, 'Tamaño', selected.tamano],
                        [<FaCalendarAlt />, 'Actividad', selected.actividadEconomica || '—'],
                      ] as [JSX.Element, string, string][]).map(([icon, label, val], i) => (
                        <div key={i} className="flex items-start gap-2 text-gray-600">
                          <span className="text-blue-400 mt-0.5 shrink-0">{icon}</span>
                          <div><span className="text-gray-400">{label}: </span>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Documentos</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {selected.documentos.map((d, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2 border border-gray-100 rounded-lg">
                            <div className="flex items-center gap-2">
                              {docIcon[d.estado]}
                              <span className="text-xs text-gray-700">{d.nombre}</span>
                            </div>
                            <span className="text-xs text-gray-400 ml-1">{d.fechaVencimiento !== '-' ? d.fechaVencimiento.slice(0, 7) : '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    )
  }

  function openTrabajadorEdit(t: Trabajador) {
    const { id: _i, ...rest } = t
    setTrabajadorForm(rest)
    setTrabajadorModal(t)
    setModalTab(0)
  }

  function renderEmpleados() {
    const q = searchTrb.toLowerCase()
    const trb = trabajadores.filter(t =>
      t.nombre.toLowerCase().includes(q) || t.documento.includes(q) || t.cargo.toLowerCase().includes(q)
    )
    const total = trb.length
    const start = (paginaTrb - 1) * perPageTrb
    const page = trb.slice(start, start + perPageTrb)
    const totalPages = Math.ceil(total / perPageTrb)
    const Ico = ({ v }: { v: boolean }) => v
      ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500"><FaCheckCircle className="text-white text-xs" /></span>
      : <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500"><FaTimesCircle className="text-white text-xs" /></span>

    return (
      <div className="space-y-3">
        {/* Header bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-wrap items-center gap-3">
          <button onClick={() => exportCSV(false)} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg">
            <FaFileExcel className="text-xs" /> Maestro en CSV
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Mostrando
            <select className="form-select w-16 py-1 text-xs" value={perPageTrb} onChange={e => { setPerPageTrb(Number(e.target.value)); setPaginaTrb(1) }}>
              {[10,25,50,100].map(n => <option key={n}>{n}</option>)}
            </select>
            resultados por página
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500">Buscar:</span>
            <input className="form-input w-44 py-1 text-xs" value={searchTrb} onChange={e => { setSearchTrb(e.target.value); setPaginaTrb(1) }} />
          </div>
          <button onClick={() => setVistaEmpleados(false)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <FaTimes className="text-xs" /> Cerrar vista
          </button>
        </div>

        {/* Title */}
        <div className="bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          Contratistas: Gestionar empleados contratistas
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Accion','Documento','Nombre','Cargo','Historia','Activo','Habilitado','Parafiscales','Certificacion','OtrosCursos','Induccion','Contratista','SEDES'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {page.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <button onClick={() => openTrabajadorEdit(t)} className="p-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded">
                      <FaEdit className="text-xs" />
                    </button>
                  </td>
                  <td className="px-3 py-2 font-mono text-gray-700">{t.documento}</td>
                  <td className="px-3 py-2 font-medium text-gray-800 min-w-40">{t.nombre}</td>
                  <td className="px-3 py-2 text-gray-500">{t.cargo || '—'}</td>
                  <td className="px-3 py-2 text-center"><Ico v={t.historia} /></td>
                  <td className="px-3 py-2 text-center"><Ico v={t.activo} /></td>
                  <td className="px-3 py-2 text-center"><Ico v={t.habilitado} /></td>
                  <td className="px-3 py-2 text-center"><Ico v={t.parafiscales} /></td>
                  <td className="px-3 py-2 text-center"><Ico v={t.certificacion} /></td>
                  <td className="px-3 py-2 text-center"><Ico v={t.otrosCursos} /></td>
                  <td className="px-3 py-2 text-center"><Ico v={t.induccion} /></td>
                  <td className="px-3 py-2 text-gray-600 min-w-36">{items.find(c => c.id === t.contratistaId)?.razonSocial ?? '—'}</td>
                  <td className="px-3 py-2 text-gray-500 min-w-44">{t.sede}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {page.length === 0 && <div className="text-center py-10 text-sm text-gray-400">No se encontraron registros</div>}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Mostrando {start + 1}–{Math.min(start + perPageTrb, total)} de {total}</span>
            <div className="flex gap-1">
              <button disabled={paginaTrb === 1} onClick={() => setPaginaTrb(p => p - 1)} className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40">‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPaginaTrb(p)} className={`px-2 py-1 rounded border ${paginaTrb === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>{p}</button>
              ))}
              <button disabled={paginaTrb === totalPages} onClick={() => setPaginaTrb(p => p + 1)} className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40">›</button>
            </div>
          </div>
        )}

        {/* ── Trabajador Modal ── */}
        {trabajadorModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-8 pb-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 bg-blue-800 rounded-t-xl">
                <div>
                  <h2 className="text-white font-bold text-base">{trabajadorForm.nombre || 'Nuevo trabajador'}</h2>
                  <p className="text-blue-200 text-xs">Doc: {trabajadorForm.documento} · {items.find(c => c.id === trabajadorForm.contratistaId)?.razonSocial ?? '—'}</p>
                </div>
                <button onClick={() => setTrabajadorModal(null)} className="text-white hover:text-blue-200"><FaTimes /></button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                {MODAL_TABS_TRB.map((t, i) => (
                  <button key={t} onClick={() => setModalTab(i)}
                    className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors ${modalTab === i ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* ── Tab 0: Información Personal ── */}
                {modalTab === 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Documento</label>
                      <input className="form-input bg-gray-100" value={trabajadorForm.documento} readOnly />
                    </div>
                    <div className="flex items-center gap-3 pt-5">
                      <button type="button" onClick={() => stf('empleadoActivo', !trabajadorForm.empleadoActivo)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${trabajadorForm.empleadoActivo ? 'bg-primary-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${trabajadorForm.empleadoActivo ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm text-gray-600">Empleado activo</span>
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Nombre completo</label>
                      <input className="form-input" value={trabajadorForm.nombre} onChange={e => stf('nombre', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Fecha expedición documento</label>
                      <input type="date" className="form-input" value={trabajadorForm.fechaExpedicion} onChange={e => stf('fechaExpedicion', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Fecha de nacimiento</label>
                      <input type="date" className="form-input" value={trabajadorForm.fechaNacimiento} onChange={e => stf('fechaNacimiento', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Sexo</label>
                      <select className="form-select" value={trabajadorForm.sexo} onChange={e => stf('sexo', e.target.value)}>
                        <option value="M">M</option><option value="F">F</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Estado civil</label>
                      <select className="form-select" value={trabajadorForm.estadoCivil} onChange={e => stf('estadoCivil', e.target.value)}>
                        {ESTADOS_CIVILES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Cargo</label>
                      <input className="form-input" value={trabajadorForm.cargo} onChange={e => stf('cargo', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Sede</label>
                      <select className="form-select" value={trabajadorForm.sede} onChange={e => stf('sede', e.target.value)}>
                        <option value="">Seleccionar sede</option>
                        {SEDES_DISPONIBLES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Ubicación física</label>
                      <input className="form-input" value={trabajadorForm.ubicacionFisica} onChange={e => stf('ubicacionFisica', e.target.value)} placeholder="Oficina, torre, bodega..." />
                    </div>
                    <div>
                      <label className="form-label">Tipo de vinculación</label>
                      <select className="form-select" value={trabajadorForm.tipoVinculacion} onChange={e => stf('tipoVinculacion', e.target.value)}>
                        <optgroup label="Básicos">{VINCULACIONES_BASICOS.map(v => <option key={v}>{v}</option>)}</optgroup>
                        <optgroup label="Por tipo de contrato">{VINCULACIONES_CONTRATO.map(v => <option key={v}>{v}</option>)}</optgroup>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Salario ($)</label>
                      <input className="form-input" value={trabajadorForm.salario} onChange={e => stf('salario', e.target.value.replace(/\D/g, ''))} placeholder="0" />
                    </div>
                    <div>
                      <label className="form-label">Nivel de escolaridad</label>
                      <select className="form-select" value={trabajadorForm.nivelEscolaridad} onChange={e => stf('nivelEscolaridad', e.target.value)}>
                        <option value="">Seleccionar</option>
                        {ESCOLARIDAD.map(e => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Raza / Grupo étnico</label>
                      <select className="form-select" value={trabajadorForm.raza} onChange={e => stf('raza', e.target.value)}>
                        {RAZAS.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* ── Tab 1: Contacto y Vital ── */}
                {modalTab === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">EPS</label>
                      <select className="form-select" value={trabajadorForm.eps} onChange={e => stf('eps', e.target.value)}>
                        <option value="">Seleccionar EPS</option>
                        {EPS_LIST.map(e => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Grupo sanguíneo (RH)</label>
                      <select className="form-select" value={trabajadorForm.grupoSanguineo} onChange={e => stf('grupoSanguineo', e.target.value)}>
                        {GRUPOS_SANGUINEOS.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="form-label">Dirección de residencia</label>
                      <input className="form-input" value={trabajadorForm.direccionResidencia} onChange={e => stf('direccionResidencia', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Teléfono residencia</label>
                      <input className="form-input" value={trabajadorForm.telefonoResidencia} onChange={e => stf('telefonoResidencia', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Teléfono móvil</label>
                      <input className="form-input" value={trabajadorForm.telefonoMovil} onChange={e => stf('telefonoMovil', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Condición discapacidad</label>
                      <select className="form-select" value={trabajadorForm.discapacidad} onChange={e => stf('discapacidad', e.target.value)}>
                        {DISCAPACIDADES.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Medio de transporte</label>
                      <select className="form-select" value={trabajadorForm.transporte} onChange={e => stf('transporte', e.target.value)}>
                        {TRANSPORTES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Contacto de emergencias</label>
                      <input className="form-input" value={trabajadorForm.contactoEmergencias} onChange={e => stf('contactoEmergencias', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Teléfono contacto emergencia</label>
                      <input className="form-input" value={trabajadorForm.telefonoEmergencias} onChange={e => stf('telefonoEmergencias', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Ingreso empresa</label>
                      <input type="date" className="form-input" value={trabajadorForm.ingresoEmpresa} onChange={e => stf('ingresoEmpresa', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Retiro empresa</label>
                      <input type="date" className="form-input" value={trabajadorForm.retiroEmpresa} onChange={e => stf('retiroEmpresa', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="form-label mb-2">Enfermedades previas / Condición especial</label>
                      <div className="grid grid-cols-2 gap-1.5 p-3 border border-gray-200 rounded-lg max-h-36 overflow-y-auto">
                        {ENFERMEDADES_OPC.map(e => (
                          <label key={e} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input type="checkbox" checked={trabajadorForm.enfermedades.includes(e)}
                              onChange={ev => stf('enfermedades', ev.target.checked
                                ? [...trabajadorForm.enfermedades.filter(x => x !== 'Ninguno'), e]
                                : trabajadorForm.enfermedades.filter(x => x !== e))}
                              className="rounded" />
                            {e}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab 2: Certificaciones ── */}
                {modalTab === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Vencimiento Examen(es) Médico(s)</label>
                      <input type="date" className="form-input" value={trabajadorForm.vencExamen} onChange={e => stf('vencExamen', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Vencimiento Certificación Alturas</label>
                      <input type="date" className="form-input" value={trabajadorForm.vencAlturas} onChange={e => stf('vencAlturas', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label">Vencimiento Espacios Confinados</label>
                      <input type="date" className="form-input" value={trabajadorForm.vencConfinados} onChange={e => stf('vencConfinados', e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="form-label mb-2">Certificación(es) requerida(s)</label>
                      <div className="grid grid-cols-2 gap-1.5 p-3 border border-gray-200 rounded-lg">
                        {CERTIFICACIONES_OPC.map(c => (
                          <label key={c} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 p-1 rounded">
                            <input type="checkbox" checked={trabajadorForm.certRequeridas.includes(c)}
                              onChange={ev => stf('certRequeridas', ev.target.checked
                                ? [...trabajadorForm.certRequeridas, c]
                                : trabajadorForm.certRequeridas.filter(x => x !== c))}
                              className="rounded" />
                            {c}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab 3: Controles de Acceso ── */}
                {modalTab === 3 && (
                  <div className="space-y-3">
                    {([
                      ['accesoContratista','Acceso del contratista','Permitir','Denegar'],
                      ['estadoSS','Estado de seguridad social','Aceptado','Rechazado'],
                      ['certTareas','Certificación de tareas','Aceptado','Rechazado'],
                      ['cursoEspecifico','Curso específico para su actividad','Tiene','Requiere'],
                      ['induccionSitio','Inducción en sitio','Tiene','Requiere'],
                      ['accesoGeneral','Acceso general al sistema','Permitido','Bloqueado'],
                    ] as [keyof TrabajadorForm, string, string, string][]).map(([key, label, on, off]) => (
                      <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-medium ${trabajadorForm[key] ? 'text-green-600' : 'text-gray-400'}`}>{trabajadorForm[key] ? on : off}</span>
                          <button type="button" onClick={() => stf(key, !trabajadorForm[key])}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${trabajadorForm[key] ? 'bg-primary-600' : 'bg-gray-300'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${trabajadorForm[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="form-label">Fecha próxima revisión</label>
                        <input type="date" className="form-input" value={trabajadorForm.fechaRevision} onChange={e => stf('fechaRevision', e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label">Periodicidad examen médico (días)</label>
                        <input type="number" className="form-input" value={trabajadorForm.periodicidadExamen} onChange={e => stf('periodicidadExamen', Number(e.target.value))} min={1} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Tab 4: Multimedia ── */}
                {modalTab === 4 && (
                  <div className="space-y-5">
                    <div>
                      <label className="form-label">Fotografía</label>
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden">
                          {trabajadorForm.fotografia
                            ? <img src={trabajadorForm.fotografia} className="w-full h-full object-cover" alt="foto" />
                            : <FaUser className="text-3xl text-gray-300" />}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="btn-secondary text-xs cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) { const r = new FileReader(); r.onload = ev => stf('fotografia', ev.target?.result as string); r.readAsDataURL(file) }
                            }} />
                            Subir fotografía
                          </label>
                          {trabajadorForm.fotografia && <button className="text-xs text-red-500 hover:text-red-700" onClick={() => stf('fotografia', '')}>Quitar foto</button>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="form-label mb-2">Consultas rápidas</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-md font-medium transition"
                          onClick={() => setShowCertModal(true)}
                        >
                          <FaSearch /> Consultar certificaciones
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-md font-medium transition"
                          onClick={() => setShowSoportesModal(true)}
                        >
                          <FaFile /> Ver soportes
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-medium transition"
                          onClick={() => setShowSSModal(true)}
                        >
                          <FaHeartbeat /> Estado general SS
                        </button>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs rounded-md font-medium transition"
                          onClick={() => setShowAlturasModal(true)}
                        >
                          <FaSearch /> Consultar Curso Alturas
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Notas / Observaciones</label>
                      <textarea className="form-input" rows={4} value={trabajadorForm.notas} onChange={e => stf('notas', e.target.value)} placeholder="Observaciones, motivos de bloqueo, etc." />
                      <div className="flex items-center justify-between mt-2 gap-3">
                        <p className="text-xs text-gray-400">Al guardar, se notificará vía WhatsApp al trabajador y por email al contratista.</p>
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-medium transition shrink-0"
                          onClick={handleGuardarNota}
                        >
                          <FaWhatsapp /> Guardar y notificar
                        </button>
                      </div>
                    </div>
                    {/* Auditoría (read-only) */}
                    <details className="border border-gray-200 rounded-lg">
                      <summary className="px-4 py-2 text-xs font-semibold text-gray-500 cursor-pointer bg-gray-50 rounded-lg">Auditoría del sistema (solo lectura)</summary>
                      <div className="px-4 py-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        {[
                          ['Contratista', items.find(c => c.id === trabajadorForm.contratistaId)?.razonSocial ?? '—'],
                          ['ID contratista', trabajadorForm.contratistaId],
                          ['ID trabajador', trabajadorModal?.id ?? '—'],
                          ['Login gestión', 'admin@empresa.com'],
                          ['Sesión contratista', trabajadorForm.contratistaId ?? '—'],
                          ['Actualización SS', trabajadorForm.ingresoEmpresa || '—'],
                        ].map(([k, v]) => (
                          <div key={k}><span className="font-medium">{k}:</span> {v}</div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between rounded-b-xl">
                <button className="btn-secondary" onClick={() => setTrabajadorModal(null)}>Cancelar</button>
                <button className="btn-primary" onClick={() => { toast.success('Trabajador actualizado'); setTrabajadorModal(null) }}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Sub-modal: Certificaciones ── */}
        {showCertModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-yellow-500 rounded-t-xl shrink-0">
                <div className="flex items-center gap-2 text-white">
                  <FaSearch />
                  <div>
                    <h3 className="font-bold text-sm">Consulta de Certificaciones</h3>
                    <p className="text-yellow-100 text-xs">{trabajadorForm.nombre} · Doc. {trabajadorForm.documento}</p>
                  </div>
                </div>
                <button onClick={() => setShowCertModal(false)} className="text-white hover:text-yellow-200"><FaTimes /></button>
              </div>
              <div className="overflow-y-auto p-6 flex-1">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Certificación</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Vencimiento</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { nombre: 'Examen Médico Ocupacional', fecha: trabajadorForm.vencExamen },
                      { nombre: 'Trabajo Seguro en Alturas', fecha: trabajadorForm.vencAlturas },
                      { nombre: 'Espacios Confinados', fecha: trabajadorForm.vencConfinados },
                      ...trabajadorForm.certRequeridas
                        .filter(c => c !== 'Alturas' && c !== 'EspaciosConfinados')
                        .map(c => ({ nombre: c, fecha: '' })),
                    ].map((cert, i) => {
                      const s = certDateStatus(cert.fecha)
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 text-xs text-gray-800 font-medium">{cert.nombre}</td>
                          <td className="px-4 py-2.5 text-xs text-gray-600">{cert.fecha || '—'}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}>{s.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Verificación de duplicados:</strong> {trabajadorForm.certRequeridas.length} certificaciones únicas registradas para este trabajador. No se detectaron duplicados.
                  </p>
                </div>
                {[trabajadorForm.vencAlturas, trabajadorForm.vencConfinados, trabajadorForm.vencExamen].some(f => f && certDateStatus(f).label === 'Vencido') && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-800 font-semibold">⚠️ Este trabajador tiene certificaciones vencidas y no debe tener acceso a las instalaciones hasta regularizar su situación.</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 border-t bg-gray-50 rounded-b-xl flex justify-end shrink-0">
                <button className="btn-secondary text-sm" onClick={() => setShowCertModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Sub-modal: Soportes (gestor documental) ── */}
        {showSoportesModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-sky-500 rounded-t-xl shrink-0">
                <div className="flex items-center gap-2 text-white">
                  <FaFile />
                  <div>
                    <h3 className="font-bold text-sm">Gestor de Soportes Documentales</h3>
                    <p className="text-sky-100 text-xs">{trabajadorForm.nombre} · Doc. {trabajadorForm.documento}</p>
                  </div>
                </div>
                <button onClick={() => setShowSoportesModal(false)} className="text-white hover:text-sky-200"><FaTimes /></button>
              </div>
              <div className="overflow-y-auto p-6 flex-1">
                <label className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 rounded-lg cursor-pointer hover:bg-sky-100 transition w-fit mb-4">
                  <FaUpload className="text-sky-600 text-sm" />
                  <span className="text-xs text-sky-700 font-medium">Subir nuevo soporte</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = ev => {
                        setSoportesUploads(p => [...p, { id: Date.now().toString(), nombre: file.name, size: (file.size / 1024).toFixed(1) + ' KB', dataUrl: ev.target?.result as string }])
                        toast.success(`Soporte "${file.name}" cargado`)
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                </label>
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Documento</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Vencimiento</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Estado</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-600">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {buildSoportesDocs().map(doc => {
                      const s = certDateStatus(doc.vencimiento === '—' ? '' : doc.vencimiento)
                      return (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 text-xs text-gray-800 font-medium">
                            <div className="flex items-center gap-2"><FaFile className="text-red-400 shrink-0" />{doc.nombre}</div>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-600">{doc.vencimiento}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.cls}`}>{doc.estado}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button className="text-xs text-sky-600 hover:text-sky-800 font-medium" onClick={() => toast.success(`Abriendo ${doc.nombre}...`)}>Ver</button>
                          </td>
                        </tr>
                      )
                    })}
                    {soportesUploads.map(up => (
                      <tr key={up.id} className="hover:bg-gray-50 bg-green-50">
                        <td className="px-4 py-2.5 text-xs text-gray-800 font-medium">
                          <div className="flex items-center gap-2"><FaFile className="text-green-500 shrink-0" />{up.nombre} <span className="text-gray-400">({up.size})</span></div>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-600">—</td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Cargado</span>
                        </td>
                        <td className="px-4 py-2.5 text-center flex items-center justify-center gap-3">
                          <a href={up.dataUrl} download={up.nombre} className="text-xs text-sky-600 hover:text-sky-800 font-medium">Descargar</a>
                          <button className="text-xs text-red-500 hover:text-red-700" onClick={() => setSoportesUploads(p => p.filter(x => x.id !== up.id))}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t bg-gray-50 rounded-b-xl flex justify-end shrink-0">
                <button className="btn-secondary text-sm" onClick={() => setShowSoportesModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Sub-modal: Estado General Seguridad Social ── */}
        {showSSModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-green-600 rounded-t-xl shrink-0">
                <div className="flex items-center gap-2 text-white">
                  <FaHeartbeat />
                  <div>
                    <h3 className="font-bold text-sm">Estado General de Seguridad Social</h3>
                    <p className="text-green-100 text-xs">{trabajadorForm.nombre} · Doc. {trabajadorForm.documento}</p>
                  </div>
                </div>
                <button onClick={() => setShowSSModal(false)} className="text-white hover:text-green-200"><FaTimes /></button>
              </div>
              <div className="overflow-y-auto p-6 flex-1 space-y-4">
                <div className={`p-3 rounded-lg border ${trabajadorForm.estadoSS ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-sm font-semibold ${trabajadorForm.estadoSS ? 'text-green-800' : 'text-red-800'}`}>
                    {trabajadorForm.estadoSS ? '✅ Seguridad Social al día' : '❌ Seguridad Social pendiente o con novedad'}
                  </p>
                </div>
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Concepto</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Entidad</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Estado</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Actualización</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { concepto: 'Salud (EPS)', entidad: trabajadorForm.eps || '—', ok: trabajadorForm.estadoSS },
                      { concepto: 'Pensión', entidad: 'Colpensiones / AFP', ok: trabajadorForm.estadoSS },
                      { concepto: 'ARL', entidad: items.find(c => c.id === trabajadorForm.contratistaId)?.arl || '—', ok: trabajadorForm.estadoSS },
                    ].map(row => (
                      <tr key={row.concepto} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-xs text-gray-800 font-medium">{row.concepto}</td>
                        <td className="px-4 py-2.5 text-xs text-gray-600">{row.entidad}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {row.ok ? 'Al día' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-500">{trabajadorForm.ingresoEmpresa || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Historial de planillas (últimos 3 períodos)</h4>
                  <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Período</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Operador</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-600">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {['2026-02', '2026-01', '2025-12'].map((mes, i) => (
                        <tr key={mes}>
                          <td className="px-3 py-2 text-gray-700">{mes}</td>
                          <td className="px-3 py-2 text-gray-500">{items.find(c => c.id === trabajadorForm.contratistaId)?.operadorPagoSS || 'SOI'}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded font-medium ${i === 0 && !trabajadorForm.estadoSS ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {i === 0 && !trabajadorForm.estadoSS ? 'Pendiente' : 'Pagado'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="px-6 py-3 border-t bg-gray-50 rounded-b-xl flex justify-end shrink-0">
                <button className="btn-secondary text-sm" onClick={() => setShowSSModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Sub-modal: Curso Trabajo Seguro en Alturas ── */}
        {showAlturasModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 bg-blue-700 rounded-t-xl shrink-0">
                <div className="flex items-center gap-2 text-white">
                  <FaSearch />
                  <div>
                    <h3 className="font-bold text-sm">Curso Trabajo Seguro en Alturas</h3>
                    <p className="text-blue-200 text-xs">{trabajadorForm.nombre} · Doc. {trabajadorForm.documento}</p>
                  </div>
                </div>
                <button onClick={() => setShowAlturasModal(false)} className="text-white hover:text-blue-300"><FaTimes /></button>
              </div>
              <div className="overflow-y-auto p-6 flex-1 space-y-4">
                {(() => {
                  const s = certDateStatus(trabajadorForm.vencAlturas)
                  const esCertificado = trabajadorForm.certRequeridas.includes('Alturas')
                  const contratista = items.find(c => c.id === trabajadorForm.contratistaId)
                  return (
                    <>
                      <div className={`p-4 rounded-lg border-2 ${s.label === 'Vigente' ? 'border-green-300 bg-green-50' : s.label === 'Vencido' ? 'border-red-300 bg-red-50' : s.label === 'Por vencer' ? 'border-orange-300 bg-orange-50' : 'border-gray-300 bg-gray-50'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-800">Certificación de Trabajo en Alturas</p>
                            <p className="text-xs text-gray-500 mt-0.5">Resolución 4272 / 2021 — MINTRABAJO</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.cls}`}>{s.label}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-gray-500">Vencimiento:</p>
                            <p className="font-semibold text-gray-800">{trabajadorForm.vencAlturas || 'No registrado'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Centro de entrenamiento:</p>
                            <p className="font-semibold text-gray-800">{contratista?.centroEntrenamiento || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Requerido para el cargo:</p>
                            <p className={`font-semibold ${esCertificado ? 'text-green-700' : 'text-gray-600'}`}>{esCertificado ? 'Sí' : 'No requerido'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Acceso habilitado:</p>
                            <p className={`font-semibold ${trabajadorForm.habilitado ? 'text-green-700' : 'text-red-700'}`}>{trabajadorForm.habilitado ? 'Sí' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                      {s.label === 'Vencido' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-800 font-semibold">⛔ Certificación vencida</p>
                          <p className="text-xs text-red-700 mt-1">Este trabajador no debe realizar trabajos en altura hasta renovar su certificación en un centro autorizado por el Ministerio de Trabajo.</p>
                        </div>
                      )}
                      {s.label === 'Por vencer' && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-xs text-orange-800 font-semibold">⚠️ Certificación próxima a vencer</p>
                          <p className="text-xs text-orange-700 mt-1">Se recomienda programar la renovación antes de la fecha de vencimiento.</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-600 mb-2">Historial de certificaciones</h4>
                        <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="px-3 py-2 text-left font-semibold text-gray-600">Vencimiento</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-600">Nivel</th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-600">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {trabajadorForm.vencAlturas ? (
                              <tr>
                                <td className="px-3 py-2 text-gray-700">{trabajadorForm.vencAlturas}</td>
                                <td className="px-3 py-2 text-gray-500">Avanzado (50h)</td>
                                <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded font-medium ${s.cls}`}>{s.label}</span></td>
                              </tr>
                            ) : (
                              <tr><td colSpan={3} className="px-3 py-3 text-center text-gray-400 italic">Sin registros de cursos</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )
                })()}
              </div>
              <div className="px-6 py-3 border-t bg-gray-50 rounded-b-xl flex justify-end shrink-0">
                <button className="btn-secondary text-sm" onClick={() => setShowAlturasModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderQR = () => {
    const c = qrContratista
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><FaQrcode className="text-blue-500" /> QR de Acceso</h3>
          <div className="mb-4">
            <label className="form-label">Seleccionar contratista</label>
            <select className="form-select" value={qrSelected} onChange={e => setQrSelected(e.target.value)}>
              {items.map(c => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
            </select>
          </div>
          {c && (
            <div className="text-center">
              {/* QR placeholder SVG */}
              <div className="inline-block p-4 border-2 border-gray-800 rounded-lg mb-4 bg-white">
                <svg width="160" height="160" viewBox="0 0 160 160" className="block">
                  <rect width="160" height="160" fill="white" />
                  {/* QR-like pattern */}
                  {[...Array(8)].map((_, row) => [...Array(8)].map((_, col) => {
                    const val = ((row * 7 + col * 3 + parseInt(c.id)) % 3) === 0
                    return val ? <rect key={`${row}-${col}`} x={col * 17 + 12} y={row * 17 + 12} width="14" height="14" fill="#1e293b" rx="1" /> : null
                  }))}
                  {/* Corner markers */}
                  <rect x="8" y="8" width="44" height="44" fill="none" stroke="#1e293b" strokeWidth="4" />
                  <rect x="16" y="16" width="28" height="28" fill="#1e293b" />
                  <rect x="108" y="8" width="44" height="44" fill="none" stroke="#1e293b" strokeWidth="4" />
                  <rect x="116" y="16" width="28" height="28" fill="#1e293b" />
                  <rect x="8" y="108" width="44" height="44" fill="none" stroke="#1e293b" strokeWidth="4" />
                  <rect x="16" y="116" width="28" height="28" fill="#1e293b" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-gray-800">{c.razonSocial}</div>
              <div className="text-xs text-gray-500 mb-4">NIT: {c.nit}</div>
              <div className="flex gap-2 justify-center">
                <button className="btn-primary flex items-center gap-2" onClick={() => toast.success('QR descargado')}><FaDownload className="text-xs" /> Descargar</button>
                <button className="btn-secondary flex items-center gap-2" onClick={() => toast.success('Enviando a impresora...')}><FaPrint className="text-xs" /> Imprimir</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderImportacion = () => (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-700 mb-1">Importación / Actualización Masiva</h3>
        <p className="text-xs text-gray-500 mb-4">Sube un archivo Excel con los contratistas para crearlos o actualizarlos masivamente.</p>

        <button className="text-sm text-primary-600 hover:underline mb-4 flex items-center gap-1"
          onClick={() => {
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
              ['NIT', 'Razon Social', 'Representante', 'Telefono', 'Email', 'Departamento', 'Municipio', 'Nivel Riesgo', 'ARL', 'CIIU', 'Estado'],
              ['900123456-7', 'Ejemplo S.A.S', 'Juan Pérez', '300 000 0000', 'ejemplo@co', 'Cundinamarca', 'Bogotá', 'III', 'Sura', '4111', 'Activo'],
            ]), 'Contratistas')
            XLSX.writeFile(wb, 'plantilla-contratistas.xlsx')
          }}
        ><FaDownload className="text-xs" /> Descargar plantilla Excel</button>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleImportFile(f) }}
          onClick={() => fileRef.current?.click()}
        >
          <FaUpload className={`text-3xl mx-auto mb-2 ${dragging ? 'text-primary-400' : 'text-gray-300'}`} />
          <p className="text-sm text-gray-500">{dragging ? 'Suelta el archivo aquí' : 'Arrastra un archivo .xlsx aquí o haz clic'}</p>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImportFile(f); e.target.value = '' }} />
      </div>

      {importRows.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{importRows.length} filas cargadas — vista previa</span>
            <button className="btn-primary text-sm" onClick={() => { toast.success(`${importRows.length} contratistas procesados`); setImportRows([]) }}>
              Confirmar importación
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>{Object.keys(importRows[0]).map(k => <th key={k} className="px-3 py-2 text-left font-semibold text-gray-600">{k}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {importRows.slice(0, 10).map((r, i) => (
                  <tr key={i}>{Object.values(r).map((v, j) => <td key={j} className="px-3 py-2 text-gray-700">{String(v)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )

  const renderInformacion = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Información registrada por contratistas</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contratista</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIT</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Trabajadores</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Última act.</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Evaluación</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Soportes</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{c.razonSocial}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.nit}</td>
                <td className="px-4 py-3 text-center">{c.totalTrabajadores}</td>
                <td className="px-4 py-3 text-center text-xs text-gray-500">{c.clasificacionCategoria || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-medium ${c.activo ? 'text-green-600' : 'text-gray-400'}`}>
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold ${c.documentos.filter(d => d.estado === 'Vigente').length === c.documentos.length ? 'text-green-600' : 'text-orange-600'}`}>
                    {c.documentos.filter(d => d.estado === 'Vigente').length}/{c.documentos.length}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[c.estado]}`}>{c.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderMatriz = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-700">Matriz de cumplimiento a requisitos</h3>
        <p className="text-xs text-gray-400 mt-1">Estado de cumplimiento de requisitos SST por contratista</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-600 sticky left-0 bg-gray-50 min-w-48">Contratista</th>
              {REQUISITOS.map(r => (
                <th key={r} className="px-3 py-3 text-center font-semibold text-gray-600 min-w-28">{r}</th>
              ))}
              <th className="px-4 py-3 text-center font-semibold text-gray-600">% Cumpl.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(c => {
              // Derive compliance from documents (simplified)
              const comp = REQUISITOS.map((req, i) => {
                const docMap: Record<string, string> = {
                  'ARL vigente': 'Certificado ARL', 'Póliza RC': 'Póliza RC',
                  'Cámara de Comercio': 'Cámara de Comercio', 'RUT': 'RUT',
                }
                const docName = docMap[req]
                if (docName) {
                  const doc = c.documentos.find(d => d.nombre === docName)
                  if (doc) return doc.estado === 'Vigente' ? 'cumple' : doc.estado === 'Vencido' ? 'vencido' : 'pendiente'
                }
                return ((parseInt(c.id) + i) % 5 === 0) ? 'pendiente' : ((parseInt(c.id) + i) % 7 === 0) ? 'vencido' : 'cumple'
              })
              const pct = Math.round((comp.filter(x => x === 'cumple').length / REQUISITOS.length) * 100)
              return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 sticky left-0 bg-white font-medium text-gray-800">{c.razonSocial}</td>
                  {comp.map((v, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      {v === 'cumple' ? <FaCheckCircle className="text-green-500 mx-auto" /> :
                       v === 'vencido' ? <FaTimesCircle className="text-red-500 mx-auto" /> :
                       <FaExclamationTriangle className="text-yellow-500 mx-auto" />}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${pct >= 80 ? 'bg-green-100 text-green-700' : pct >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {pct}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500" /> Cumple</span>
        <span className="flex items-center gap-1"><FaTimesCircle className="text-red-500" /> Vencido</span>
        <span className="flex items-center gap-1"><FaExclamationTriangle className="text-yellow-500" /> Pendiente</span>
      </div>
    </div>
  )

  const renderCSV = () => (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <FaFileExcel className="text-green-500 text-4xl mx-auto mb-3" />
        <h3 className="font-semibold text-gray-700 mb-2">Maestro Contratistas CSV</h3>
        <p className="text-sm text-gray-500 mb-6">Exporta todos los contratistas registrados con sus datos principales a un archivo Excel.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-xs text-gray-600">
          <p className="font-medium mb-1">Incluye los campos:</p>
          <p>NIT · Razón Social · Representante · Teléfono · Email · Departamento · Municipio · Nivel Riesgo · Tamaño · ARL · CIIU · Estado · Total Trabajadores · Activos</p>
        </div>
        <button className="btn-primary flex items-center gap-2 mx-auto" onClick={() => exportCSV(false)}>
          <FaDownload className="text-xs" /> Descargar Excel ({items.length} registros)
        </button>
      </div>
    </div>
  )

  const renderCSVParam = () => (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaFileExcel className="text-green-500 text-2xl" />
          <h3 className="font-semibold text-gray-700">Maestro Contratistas CSV Parametrizado</h3>
        </div>
        <p className="text-sm text-gray-500 mb-5">Filtra los registros antes de exportar.</p>
        <div className="space-y-4 mb-6">
          <div>
            <label className="form-label">Estado</label>
            <select className="form-select" value={csvParams.estado} onChange={e => setCsvParams(p => ({ ...p, estado: e.target.value }))}>
              <option value="Todos">Todos</option>
              {['Activo', 'Inactivo', 'Suspendido', 'En evaluación'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Nivel de Riesgo</label>
            <select className="form-select" value={csvParams.riesgo} onChange={e => setCsvParams(p => ({ ...p, riesgo: e.target.value }))}>
              <option value="Todos">Todos</option>
              {['I', 'II', 'III', 'IV', 'V'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Tamaño empresa</label>
            <select className="form-select" value={csvParams.tamano} onChange={e => setCsvParams(p => ({ ...p, tamano: e.target.value }))}>
              <option value="Todos">Todos</option>
              {['Micro', 'Pequeña', 'Mediana', 'Grande'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>
        {(() => {
          const count = items.filter(c =>
            (csvParams.estado === 'Todos' || c.estado === csvParams.estado) &&
            (csvParams.riesgo === 'Todos' || c.nivelRiesgo === csvParams.riesgo) &&
            (csvParams.tamano === 'Todos' || c.tamano === csvParams.tamano)
          ).length
          return (
            <button className="btn-primary flex items-center gap-2" onClick={() => exportCSV(true)}>
              <FaDownload className="text-xs" /> Exportar {count} registro(s)
            </button>
          )
        })()}
      </div>
    </div>
  )

  const RENDERS: Record<Tab, () => JSX.Element> = {
    panel: renderPanel, agregar: renderAgregar, trabajadores: renderTrabajadores,
    qr: renderQR, importacion: renderImportacion, informacion: renderInformacion,
    matriz: renderMatriz, csv: renderCSV, csvparam: renderCSVParam,
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" onClick={() => menuId && setMenuId(null)}>
      {/* Blue header */}
      <div className="bg-blue-900 text-white px-6 pt-4 pb-0">
        <div className="flex items-center gap-2 mb-4">
          <FaHandshake className="text-blue-300 text-xl" />
          <h1 className="text-base font-semibold">Contratistas: Gestionar contratistas</h1>
        </div>
        <div className="flex flex-wrap gap-1.5 pb-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMenuId(null) }}
              className={`px-3 py-2 rounded-t text-xs font-medium transition-colors whitespace-nowrap ${
                tab === t.id ? t.activeClass : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {RENDERS[tab]()}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 bg-white py-4 text-center">
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm flex items-center gap-2 mx-auto"
          onClick={() => toast('Regresando al escritorio...')}
        >
          <FaHome /> Regresar al escritorio
        </button>
      </div>

      {/* Confirm delete modal */}
      {confirmDel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-80">
            <h3 className="font-bold text-gray-800 mb-2">¿Eliminar contratista?</h3>
            <p className="text-sm text-gray-600 mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button className="btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700" onClick={() => handleDelete(confirmDel)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
