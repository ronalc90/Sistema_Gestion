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
