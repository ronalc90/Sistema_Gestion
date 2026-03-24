// ==========================================
// TIPOS DE USUARIO Y AUTENTICACIÓN
// ==========================================

export type RolUsuario = 'ADMIN_TOTAL' | 'ADMIN' | 'USUARIO' | 'SUPERVISOR';
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

// ==========================================
// TIPOS DE SEDES
// ==========================================

export type EstadoSede = 'ACTIVO' | 'INACTIVO';

export interface Sede {
  id: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  email?: string;
  encargado?: string;
  estado: EstadoSede;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSedeData {
  nombre: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  email?: string;
  encargado?: string;
  estado?: EstadoSede;
}

// ==========================================
// TIPOS DE CONTRATISTAS
// ==========================================

export type EstadoContratista = 'ACTIVO' | 'INACTIVO';

export interface Contratista {
  id: string;
  nombre: string;
  nit?: string;
  representante?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado: EstadoContratista;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContratistaData {
  nombre: string;
  nit?: string;
  representante?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado?: EstadoContratista;
}

// ==========================================
// TIPOS DE CENTROS DE COSTOS
// ==========================================

export interface CentroCosto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  presupuesto?: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCentroCostoData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  presupuesto?: number;
  activo?: boolean;
}

// ==========================================
// TIPOS DE EMPLEADOS
// ==========================================

export type TipoIdentificacion = 'CC' | 'CE' | 'PASAPORTE' | 'NIT';
export type EstadoEmpleado = 'ACTIVO' | 'INACTIVO' | 'VACACIONES' | 'INCAPACITADO';
export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'PREFIERO_NO_DECIR';

export interface Empleado {
  id: string;
  tipoId: TipoIdentificacion;
  numeroId: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: Genero;
  direccion?: string;
  cargo?: string;
  fechaIngreso: string;
  fechaRetiro?: string;
  salario?: number;
  estado: EstadoEmpleado;
  eps?: string;
  fondoPensiones?: string;
  arl?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  sedeId: string;
  sede?: Sede;
  contratistaId?: string;
  contratista?: Contratista;
  centroCostoId?: string;
  centroCosto?: CentroCosto;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmpleadoData {
  tipoId?: TipoIdentificacion;
  numeroId: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: Genero;
  direccion?: string;
  cargo?: string;
  fechaIngreso?: string;
  salario?: number;
  eps?: string;
  fondoPensiones?: string;
  arl?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  sedeId: string;
  contratistaId?: string;
  centroCostoId?: string;
}

// ==========================================
// TIPOS DE ACTIVIDADES
// ==========================================

export interface Actividad {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TIPOS DEL PLANEADOR DE ACTIVIDADES SG-SST
// ==========================================

export type PrioridadActividad = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type EstadoActividad = 'PLANEADO' | 'EN_PROCESO' | 'REPROGRAMADO' | 'FINALIZADA' | 'CANCELADA';
export type ModalidadActividad = 'PRESENCIAL' | 'VIRTUAL' | 'COMBINADA';
export type FasePHVA = 'PLANEAR' | 'HACER' | 'VERIFICAR' | 'ACTUAR';

export type TipoEventoSGSST = 
  | 'CAPACITACION' 
  | 'INSPECCIONES' 
  | 'SIMULACROS' 
  | 'REUNIONES' 
  | 'ACCIDENTES' 
  | 'EPP' 
  | 'EXAMENES_MEDICOS' 
  | 'INDUCCION'
  | 'INVESTIGACION'
  | 'MEJORA'
  | 'AUDITORIA'
  | 'OTRO';

export type ProgramaSGSST = 
  | 'SG-SST'
  | 'RIESGO_QUIMICO'
  | 'TRABAJO_ALTURAS'
  | 'ESPACIOS_CONFINADOS'
  | 'EQUIPO_PESADO'
  | 'SEGURIDAD_VIAL'
  | 'EMERGENCIAS'
  | 'MEDICINA_LABORAL'
  | 'AUDITORIA'
  | 'GESTION_RIESGO'
  | 'OTRO';

export type TematicaSGSST = 
  | 'SEGURIDAD_VIAL'
  | 'RIESGO_BIOLOGICO'
  | 'ERGONOMIA'
  | 'RIESGO_ELECTRICO'
  | 'FISICO_QUIMICO'
  | 'PSICOSOCIAL'
  | 'MECANICO'
  | 'LOCATIVO'
  | 'PUBLICO'
  | 'SST_GENERAL'
  | 'EMERGENCIA'
  | 'PRIMEROS_AUXILIOS'
  | 'BRIGADISTA'
  | 'EVACUACION'
  | 'OTRO';

export interface ParticipanteActividad {
  id: string;
  empleadoId?: string;
  empleado?: Empleado;
  contratistaId?: string;
  contratista?: Contratista;
  externoNombre?: string;
  externoEmail?: string;
  externoTelefono?: string;
  externoEmpresa?: string;
  asistio: boolean;
  observaciones?: string;
}

export interface ActividadPlaneada {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  tipoEvento: TipoEventoSGSST;
  programa: ProgramaSGSST;
  tematica: TematicaSGSST;
  prioridad: PrioridadActividad;
  estado: EstadoActividad;
  modalidad: ModalidadActividad;
  fasePHVA: FasePHVA;
  
  fechaInicio: string;
  fechaFin: string;
  horaInicio?: string;
  horaFin?: string;
  
  responsableId: string;
  responsable?: User;
  contratistaId?: string;
  contratista?: Contratista;
  empleadoResponsableId?: string;
  empleadoResponsable?: Empleado;
  
  sedeId?: string;
  sede?: Sede;
  categoria1?: string;
  categoria2?: string;
  categoria3?: string;
  
  presupuestoAsignado?: number;
  presupuestoEjecutado?: number;
  recursos?: string;
  
  participantes: ParticipanteActividad[];
  cantidadParticipantes: number;
  coberturaEsperada?: number;
  
  observaciones?: string;
  resultados?: string;
  evidencias?: string[];
  
  empresaId: string;
  creadoPorId: string;
  creadoPor?: User;
  
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosActividades {
  fechaInicioDesde?: string;
  fechaInicioHasta?: string;
  fechaFinDesde?: string;
  fechaFinHasta?: string;
  tipoEvento?: TipoEventoSGSST;
  programa?: ProgramaSGSST;
  tematica?: TematicaSGSST;
  prioridad?: PrioridadActividad;
  estado?: EstadoActividad;
  modalidad?: ModalidadActividad;
  responsableId?: string;
  contratistaId?: string;
  empleadoContratistaId?: string;
  categoria1?: string;
  categoria2?: string;
  categoria3?: string;
  sedeId?: string;
  empresaId?: string;
  busqueda?: string;
}

export interface DashboardActividades {
  totalActividades: number;
  actividadesMesActual: number;
  actividadesSinSede: number;
  indicadorCumplimiento: number;
  porPrioridad: Record<PrioridadActividad, number>;
  porPHVA: Record<FasePHVA, number>;
  porEstado: Record<EstadoActividad, number>;
  actividadesVencidas: number;
  presupuestoAsignado: number;
  presupuestoEjecutado: number;
}

export interface ReporteActividadesParams {
  tipoReporte: 'ACTIVIDADES' | 'VENCIDAS' | 'PHVA' | 'RECURSOS' | 'PRESUPUESTO' | 'COBERTURA';
  agrupacion?: 'SEDE' | 'MES' | 'PROGRAMA' | 'TIPO_EVENTO' | 'AREA' | 'RESPONSABLE';
  criterio?: 'ESTADO' | 'PRIORIDAD' | 'CUMPLIMIENTO' | 'COBERTURA';
  tipoGrafico?: 'BARRAS' | 'PASTEL' | 'LINEA' | 'TABLA';
  fechaDesde?: string;
  fechaHasta?: string;
  periodo?: 'ANIO' | 'SEMESTRE' | 'TRIMESTRE' | 'MES' | 'SEMANA';
  sedeId?: string;
  programa?: ProgramaSGSST;
}

// ==========================================
// TIPOS DE DESTINOS
// ==========================================

export type EstadoDestino = 'ACTIVO' | 'INACTIVO';

export interface Destino {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: EstadoDestino;
  sedeId: string;
  sede?: Sede;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TIPOS DE PLANIFICACIÓN
// ==========================================

export type EstadoPlanificacion = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';

export interface Planificacion {
  id: string;
  fecha: string;
  descripcion?: string;
  estado: EstadoPlanificacion;
  horaInicio?: string;
  horaFin?: string;
  observaciones?: string;
  creadorId: string;
  creador?: User;
  empleadoId: string;
  empleado?: Empleado;
  contratistaId?: string;
  contratista?: Contratista;
  actividadId?: string;
  actividad?: Actividad;
  destinoId?: string;
  destino?: Destino;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TIPOS DE TURNOS
// ==========================================

export type TipoTurno = 'DIURNO' | 'NOCTURNO' | 'MIXTO' | 'FIN_DE_SEMANA' | 'FESTIVO';
export type EstadoTurno = 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';

export interface Turno {
  id: string;
  fecha: string;
  tipo: TipoTurno;
  horaInicio: string;
  horaFin: string;
  estado: EstadoTurno;
  observaciones?: string;
  empleadoId: string;
  empleado?: Empleado;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TIPOS DE VISITANTES
// ==========================================

export type TipoVisitante = 'PERSONAL' | 'EMPRESARIAL' | 'PROVEEDOR' | 'CLIENTE' | 'OTRO';
export type EstadoVisitante = 'EN_SITIO' | 'FINALIZADA';

export interface Visitante {
  id: string;
  tipo: TipoVisitante;
  nombre: string;
  identificacion?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  motivo: string;
  fechaEntrada: string;
  fechaSalida?: string;
  estado: EstadoVisitante;
  observaciones?: string;
  sedeId: string;
  sede?: Sede;
  registradoPorId: string;
  registradoPor?: User;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TIPOS DE DOCUMENTOS
// ==========================================

export type TipoDocumento = 'CONTRATO' | 'CEDULA' | 'HV' | 'CERTIFICADO' | 'LICENCIA' | 'EXAMEN_MEDICO' | 'POLIZA' | 'OTRO';

export interface Documento {
  id: string;
  nombre: string;
  tipo: TipoDocumento;
  descripcion?: string;
  url: string;
  tamanio: number;
  mimeType: string;
  carpeta: string;
  empleadoId?: string;
  empleado?: Empleado;
  subidoPorId: string;
  subidoPor?: User;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// TIPOS DE API Y PAGINACIÓN
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// ==========================================
// TIPOS DE MENÚ
// ==========================================

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: MenuItem[];
  badge?: number;
  roles?: RolUsuario[];
}

// ==========================================
// TIPOS DE DASHBOARD
// ==========================================

export interface DashboardStats {
  totalEmpleados: number;
  empleadosActivos: number;
  totalContratistas: number;
  totalSedes: number;
  visitasHoy: number;
  planificacionesPendientes: number;
  ingresosDiarios: number;
  empleadosPorContratista: { nombre: string; cantidad: number }[];
  planificacionesPorMes: { mes: string; cantidad: number }[];
}

// ==========================================
// TIPOS DE SEGURIDAD VIAL
// ==========================================

export type TipoVehiculo = 'CARRO' | 'MOTO' | 'CAMION' | 'CAMIONETA' | 'BUS' | 'VAN' | 'OTRO';
export type EstadoVehiculo = 'ACTIVO' | 'MANTENIMIENTO' | 'INACTIVO' | 'BAJA';
export type TipoCombustible = 'GASOLINA' | 'DIESEL' | 'GAS' | 'ELECTRICO' | 'HIBRIDO';
export type EstadoLicencia = 'VIGENTE' | 'VENCIDA' | 'SUSPENDIDA' | 'CANCELADA';
export type TipoComparendo = 'LEVE' | 'GRAVE' | 'GRAVISIMO';
export type EstadoComparendo = 'PENDIENTE' | 'PAGADO' | 'APLAZADO' | 'EN_RECURSO';
export type CategoriaLicencia = 'A1' | 'A2' | 'B1' | 'B2' | 'B3' | 'C1' | 'C2' | 'C3';

export interface Vehiculo {
  id: string;
  placa: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  ano: number;
  color: string;
  numeroMotor?: string;
  numeroChasis?: string;
  vin?: string;
  tipoCombustible: TipoCombustible;
  capacidadPasajeros?: number;
  capacidadCarga?: number;
  fechaVencimientoSOAT?: string;
  fechaVencimientoTecnomecanica?: string;
  fechaVencimientoTarjetaOperacion?: string;
  empresaAseguradora?: string;
  estado: EstadoVehiculo;
  sedeId?: string;
  sede?: Sede;
  kilometrajeActual: number;
  fechaUltimoMantenimiento?: string;
  proximoMantenimiento?: string;
  observaciones?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conductor {
  id: string;
  empleadoId?: string;
  empleado?: Empleado;
  externoNombre?: string;
  externoIdentificacion?: string;
  externoTelefono?: string;
  externoEmail?: string;
  numeroLicencia: string;
  categoriaLicencia: CategoriaLicencia;
  fechaExpedicionLicencia: string;
  fechaVencimientoLicencia: string;
  organismoTransito: string;
  estadoLicencia: EstadoLicencia;
  esExterno: boolean;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comparendo {
  id: string;
  numeroComparendo: string;
  fechaInfraccion: string;
  horaInfraccion?: string;
  lugarInfraccion: string;
  tipoComparendo: TipoComparendo;
  codigoInfraccion?: string;
  descripcionInfraccion: string;
  valorMulta: number;
  estado: EstadoComparendo;
  fechaNotificacion?: string;
  fechaPago?: string;
  valorPago?: number;
  vehiculoId?: string;
  vehiculo?: Vehiculo;
  conductorId?: string;
  conductor?: Conductor;
  empleadoReportaId?: string;
  empleadoReporta?: Empleado;
  sedeId?: string;
  sede?: Sede;
  evidencias?: string[];
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InspeccionPreoperacional {
  id: string;
  fecha: string;
  hora: string;
  vehiculoId: string;
  vehiculo?: Vehiculo;
  conductorId: string;
  conductor?: Conductor;
  kilometrajeInicial: number;
  kilometrajeFinal?: number;
  // Sistema de luces
  lucesAltas: boolean;
  lucesBajas: boolean;
  direccionales: boolean;
  lucesFreno: boolean;
  lucesRetroceso: boolean;
  // Niveles
  nivelAceite: boolean;
  nivelFrenos: boolean;
  nivelRefrigerante: boolean;
  nivelDireccion: boolean;
  // Llantas
  llantaDelanteraIzquierda: boolean;
  llantaDelanteraDerecha: boolean;
  llantaTraseraIzquierda: boolean;
  llantaTraseraDerecha: boolean;
  llantaRepuesto: boolean;
  // Otros sistemas
  frenos: boolean;
  direccion: boolean;
  claxon: boolean;
  cinturonesSeguridad: boolean;
  espejosRetrovisores: boolean;
  limpiaparabrisas: boolean;
  vidrios: boolean;
  puertas: boolean;
  // Documentos
  tarjetaPropiedad: boolean;
  soat: boolean;
  revisionTecnomecanica: boolean;
  seguroContractual: boolean;
  seguroExtracontractual: boolean;
  // Observaciones
  observaciones?: string;
  novedades?: string;
  estado: 'APROBADA' | 'RECHAZADA' | 'CON_NOVEDADES';
  firmaConductor?: string;
  firmaVerificador?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EncuestaSeguridadVial {
  id: string;
  titulo: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  activa: boolean;
  preguntas: PreguntaEncuestaVial[];
  respuestas?: RespuestaEncuestaVial[];
  createdAt: string;
  updatedAt: string;
}

export interface PreguntaEncuestaVial {
  id: string;
  encuestaId: string;
  orden: number;
  texto: string;
  tipo: 'SELECCION_UNICA' | 'SELECCION_MULTIPLE' | 'ABIERTA' | 'ESCALA';
  opciones?: string[];
  requerida: boolean;
}

export interface RespuestaEncuestaVial {
  id: string;
  encuestaId: string;
  empleadoId?: string;
  empleado?: Empleado;
  fechaRespuesta: string;
  respuestas: { preguntaId: string; respuesta: string | string[] }[];
}

export interface DashboardSeguridadVial {
  totalVehiculos: number;
  vehiculosActivos: number;
  vehiculosEnMantenimiento: number;
  vehiculosSOATVencido: number;
  vehiculosTecnoVencido: number;
  totalConductores: number;
  conductoresLicenciaVencida: number;
  totalComparendos: number;
  comparendosPendientes: number;
  comparendosMes: number;
  inspeccionesHoy: number;
  inspeccionesAprobadas: number;
  inspeccionesConNovedades: number;
}

// ==========================================
// TIPOS DE CONTROL DE ACCESO
// ==========================================

export type TipoAcceso = 'ENTRADA' | 'SALIDA';
export type TipoPersonaAcceso = 'EMPLEADO' | 'CONTRATISTA' | 'VISITANTE';
export type EstadoAcceso = 'ACTIVO' | 'INACTIVO';
export type ModoVisitante = 'NO_PERMITIR' | 'PERMITIR_ANONIMO' | 'PERMITIR_CON_REGISTRO';
export type MetodoAutenticacion = 'QR' | 'DOCUMENTO' | 'TARJETA' | 'MANUAL';

export interface RegistroAcceso {
  id: string;
  fecha: string;
  hora: string;
  tipoAcceso: TipoAcceso;
  tipoPersona: TipoPersonaAcceso;
  personaId?: string;
  personaNombre?: string;
  documento?: string;
  empleadoId?: string;
  empleado?: Empleado;
  contratistaId?: string;
  contratista?: Contratista;
  visitanteId?: string;
  visitante?: Visitante;
  sedeId: string;
  sede?: Sede;
  destinoId?: string;
  destino?: Destino;
  observaciones?: string;
  metodoAutenticacion: MetodoAutenticacion;
  verificadoPor?: string;
  usuarioVerificador?: User;
  fotoCaptura?: string;
  temperatura?: number;
  itemsRegistrados?: string;
  vehiculoPlaca?: string;
  createdAt: string;
}

export interface ConfiguracionAcceso {
  id: string;
  modoVisitantes: ModoVisitante;
  requiereTemperatura: boolean;
  requiereFoto: boolean;
  permitirAccesoManual: boolean;
  tiempoMaximoVisitaHoras: number;
  notificarAdminNuevosRegistros: boolean;
  sedeId?: string;
  sede?: Sede;
  updatedAt: string;
}

export interface CodigoQRAcceso {
  id: string;
  codigo: string;
  sedeId: string;
  sede?: Sede;
  activo: boolean;
  fechaGeneracion: string;
  fechaExpiracion?: string;
  usosMaximos?: number;
  usosActuales: number;
  tipoPermitido: TipoPersonaAcceso[];
  createdAt: string;
}

export interface DashboardControlAcceso {
  accesosMesActual: number;
  accesosHoy: number;
  accesosPorTipo: Record<TipoPersonaAcceso, number>;
  accesosPorMes: { mes: string; cantidad: number }[];
  personasDentro: number;
  visitantesActivos: number;
  alertasPendientes: number;
}
