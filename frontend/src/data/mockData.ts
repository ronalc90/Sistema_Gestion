// ==========================================
// MOCK DATA – Todos los módulos
// ==========================================

export interface MockCentroCosto {
  id: string
  codigo: string
  nombre: string
  descripcion?: string
  presupuesto?: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface MockContratista {
  id: string
  nombre: string
  nit: string
  representante: string
  telefono: string
  email: string
  direccion: string
  estado: 'ACTIVO' | 'INACTIVO'
  createdAt: string
  updatedAt: string
}

export interface HorarioDia {
  inicio: string
  fin: string
  activo: boolean
}

export interface MockSede {
  id: string
  codigo: number
  nombre: string
  tiempoDescanso: string
  fechaInicial: string
  fechaFinal: string
  estado: 'ACTIVO' | 'INACTIVO'
  nombreColeccion: string
  centroCostoId?: string
  centroCostoNombre?: string
  horarios: Record<string, HorarioDia>
  createdAt: string
  updatedAt: string
}

export interface MockEmpleado {
  id: string
  tipoId: 'CC' | 'CE' | 'PASAPORTE' | 'NIT'
  numeroId: string
  nombres: string
  apellidos: string
  email: string
  telefono: string
  fechaNacimiento: string
  genero: 'MASCULINO' | 'FEMENINO' | 'OTRO'
  direccion: string
  cargo: string
  fechaIngreso: string
  salario: number
  estado: 'ACTIVO' | 'INACTIVO' | 'VACACIONES' | 'INCAPACITADO'
  eps: string
  fondoPensiones: string
  arl: string
  contactoEmergencia: string
  telefonoEmergencia: string
  sedeId: string
  sedeNombre: string
  contratistaId: string
  contratistaNombre: string
  centroCostoId: string
  centroCostoNombre: string
  createdAt: string
  updatedAt: string
}

export interface MockActividad {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface MockDestino {
  id: string
  nombre: string
  descripcion: string
  estado: 'ACTIVO' | 'INACTIVO'
  sedeId: string
  sedeNombre: string
  createdAt: string
  updatedAt: string
}

export interface MockPlanificacionCargo {
  id: string
  contratistaId: string
  contratistaNombre: string
  sedeId: string
  sedeNombre: string
  cargo: string
  cantidad: number
  fechaInicio: string
  fechaFin: string
  createdAt: string
  updatedAt: string
}

export interface MockVisitante {
  id: string
  nombre: string
  identificacion: string
  tipo: 'PERSONAL' | 'EMPRESARIAL' | 'PROVEEDOR' | 'CLIENTE' | 'OTRO'
  empresa: string
  telefono: string
  email: string
  motivo: string
  fechaEntrada: string
  fechaSalida?: string
  estado: 'EN_SITIO' | 'FINALIZADA'
  sedeId: string
  sedeNombre: string
  createdAt: string
  updatedAt: string
}

export interface MockDocumento {
  id: string
  nombre: string
  tipo: 'CONTRATO' | 'CEDULA' | 'HV' | 'CERTIFICADO' | 'LICENCIA' | 'EXAMEN_MEDICO' | 'POLIZA' | 'OTRO'
  descripcion: string
  url: string
  empleadoId: string
  empleadoNombre: string
  createdAt: string
  updatedAt: string
}

// ============ CENTROS DE COSTO ============
const now = new Date().toISOString()
export const mockCentrosCostos: MockCentroCosto[] = [
  { id: 'cc-1', codigo: '4554', nombre: 'Centro Administrativo', descripcion: 'Gestión administrativa general', presupuesto: 50000000, activo: true, createdAt: now, updatedAt: now },
  { id: 'cc-2', codigo: '20113087', nombre: 'Centro Operativo Norte', descripcion: 'Operaciones zona norte', presupuesto: 120000000, activo: true, createdAt: now, updatedAt: now },
  { id: 'cc-3', codigo: '20113084', nombre: 'Centro Operativo Sur', descripcion: 'Operaciones zona sur', presupuesto: 90000000, activo: false, createdAt: now, updatedAt: now },
  { id: 'cc-4', codigo: '569855', nombre: 'Centro Logístico', descripcion: 'Gestión logística y transporte', presupuesto: 75000000, activo: true, createdAt: now, updatedAt: now },
  { id: 'cc-5', codigo: '14', nombre: 'Centro Comercial', descripcion: 'Operaciones comerciales', presupuesto: 200000000, activo: true, createdAt: now, updatedAt: now },
  { id: 'cc-6', codigo: 'test', nombre: 'Centro de Pruebas', descripcion: 'Ambiente de pruebas', presupuesto: 5000000, activo: true, createdAt: now, updatedAt: now },
]

// ============ CONTRATISTAS ============
export const mockContratistas: MockContratista[] = [
  { id: 'con-1', nombre: 'FERRALPE SAS', nit: '900123456-7', representante: 'Carlos Ferral', telefono: '3001234567', email: 'contacto@ferralpe.com', direccion: 'Cra 15 #45-22, Bogotá', estado: 'ACTIVO', createdAt: now, updatedAt: now },
  { id: 'con-2', nombre: '3S INGENIERIA ESPECIALIZADA SAS', nit: '900234567-8', representante: 'Ana García', telefono: '3102345678', email: 'info@3singenieria.com', direccion: 'Av 68 #22-30, Bogotá', estado: 'ACTIVO', createdAt: now, updatedAt: now },
  { id: 'con-3', nombre: 'ENCHAPES Y ACABADOS JCL S.A.S', nit: '900345678-9', representante: 'Jorge Cárdenas', telefono: '3203456789', email: 'ventas@enchapesjcl.com', direccion: 'Cl 80 #12-15, Medellín', estado: 'ACTIVO', createdAt: now, updatedAt: now },
  { id: 'con-4', nombre: 'CYC OBRAS CIVILES SAS', nit: '900456789-0', representante: 'María López', telefono: '3104567890', email: 'obras@cycobras.com', direccion: 'Tr 20 #55-10, Cali', estado: 'INACTIVO', createdAt: now, updatedAt: now },
  { id: 'con-5', nombre: 'CONINSA SAS', nit: '800123456-1', representante: 'Pedro Morales', telefono: '3005678901', email: 'contacto@coninsa.com', direccion: 'Cra 43A #1-50, Medellín', estado: 'ACTIVO', createdAt: now, updatedAt: now },
  { id: 'con-6', nombre: '23 MYM', nit: '900567890-1', representante: 'Luis Martínez', telefono: '3146789012', email: 'info@23mym.com', direccion: 'Cl 100 #15-30, Bogotá', estado: 'ACTIVO', createdAt: now, updatedAt: now },
]

// ============ SEDES ============
const defaultHorarios = {
  lunes:    { inicio: '07:00', fin: '17:00', activo: true },
  martes:   { inicio: '07:00', fin: '17:00', activo: true },
  miercoles:{ inicio: '07:00', fin: '17:00', activo: true },
  jueves:   { inicio: '07:00', fin: '17:00', activo: true },
  viernes:  { inicio: '07:00', fin: '17:00', activo: true },
  sabado:   { inicio: '08:00', fin: '13:00', activo: false },
  domingo:  { inicio: '',      fin: '',      activo: false },
}

export const mockSedes: MockSede[] = [
  { id: 'sede-1',  codigo: 83,  nombre: '34 STREET',              tiempoDescanso: '1', fechaInicial: '2020-01-01', fechaFinal: '2025-12-31', estado: 'ACTIVO',   nombreColeccion: 'sede_34_street',      centroCostoId: 'cc-6', centroCostoNombre: 'test',       horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-2',  codigo: 38,  nombre: 'ALAMOS',                 tiempoDescanso: '1', fechaInicial: '2019-06-01', fechaFinal: '2024-06-01', estado: 'INACTIVO', nombreColeccion: 'sede_alamos',         centroCostoId: 'cc-1', centroCostoNombre: '4554',       horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-3',  codigo: 80,  nombre: 'ALAMOS ETAPA 5',         tiempoDescanso: '1', fechaInicial: '2021-03-01', fechaFinal: '2026-03-01', estado: 'INACTIVO', nombreColeccion: 'sede_alamos_etapa5',  horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-4',  codigo: 88,  nombre: 'ALAMOS ETAPA 6',         tiempoDescanso: '1', fechaInicial: '2022-01-01', fechaFinal: '2027-01-01', estado: 'ACTIVO',   nombreColeccion: 'sede_alamos_etapa6',  horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-5',  codigo: 70,  nombre: 'AMANTINA',               tiempoDescanso: '1', fechaInicial: '2018-05-01', fechaFinal: '2023-05-01', estado: 'INACTIVO', nombreColeccion: 'sede_amantina',       centroCostoId: 'cc-2', centroCostoNombre: '20113087',   horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-6',  codigo: 103, nombre: 'AMANTINA T2',            tiempoDescanso: '1', fechaInicial: '2023-01-01', fechaFinal: '2028-01-01', estado: 'ACTIVO',   nombreColeccion: 'sede_amantina_t2',    horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-7',  codigo: 50,  nombre: 'BODEGA SMURFIT KAPPA',   tiempoDescanso: '1', fechaInicial: '2019-01-01', fechaFinal: '2024-01-01', estado: 'INACTIVO', nombreColeccion: 'sede_smurfit',        horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-8',  codigo: 94,  nombre: 'BRINSA',                 tiempoDescanso: '1', fechaInicial: '2022-07-01', fechaFinal: '2027-07-01', estado: 'ACTIVO',   nombreColeccion: 'sede_brinsa',         horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-9',  codigo: 66,  nombre: 'CAMPURA',                tiempoDescanso: '1', fechaInicial: '2017-11-01', fechaFinal: '2022-11-01', estado: 'INACTIVO', nombreColeccion: 'sede_campura',        centroCostoId: 'cc-3', centroCostoNombre: '20113084',   horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-10', codigo: 102, nombre: 'CAMPURA ETAPA 4-TORRE 1',tiempoDescanso: '1', fechaInicial: '2023-05-01', fechaFinal: '2028-05-01', estado: 'ACTIVO',   nombreColeccion: 'sede_campura_etapa4', horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-11', codigo: 55,  nombre: 'CASTELLI',               tiempoDescanso: '1', fechaInicial: '2021-08-01', fechaFinal: '2026-08-01', estado: 'ACTIVO',   nombreColeccion: 'sede_castelli',       horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-12', codigo: 31,  nombre: 'CASTILLA URBANA',        tiempoDescanso: '1', fechaInicial: '2018-02-01', fechaFinal: '2023-02-01', estado: 'INACTIVO', nombreColeccion: 'sede_castilla',       centroCostoId: 'cc-4', centroCostoNombre: '569855',     horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-13', codigo: 33,  nombre: 'CENTENARI',              tiempoDescanso: '1', fechaInicial: '2019-04-01', fechaFinal: '2024-04-01', estado: 'INACTIVO', nombreColeccion: 'sede_centenari',      horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-14', codigo: 113, nombre: 'CESDE PRUEBAS S.A.S',    tiempoDescanso: '1', fechaInicial: '2023-09-01', fechaFinal: '2024-09-01', estado: 'INACTIVO', nombreColeccion: 'sede_cesde',          horarios: defaultHorarios, createdAt: now, updatedAt: now },
  { id: 'sede-15', codigo: 58,  nombre: 'CIVITA',                 tiempoDescanso: '1', fechaInicial: '2020-06-01', fechaFinal: '2025-06-01', estado: 'ACTIVO',   nombreColeccion: 'sede_civita',         centroCostoId: 'cc-5', centroCostoNombre: '14',         horarios: defaultHorarios, createdAt: now, updatedAt: now },
]

// ============ EMPLEADOS ============
export const mockEmpleados: MockEmpleado[] = [
  { id: 'emp-1', tipoId: 'CC', numeroId: '1012345678', nombres: 'Juan Carlos', apellidos: 'Rodríguez Pérez', email: 'jrodriguez@empresa.com', telefono: '3001234567', fechaNacimiento: '1990-05-15', genero: 'MASCULINO', direccion: 'Cra 7 #45-12, Bogotá', cargo: 'Operario', fechaIngreso: '2021-03-01', salario: 1600000, estado: 'ACTIVO', eps: 'Sura', fondoPensiones: 'Protección', arl: 'Sura', contactoEmergencia: 'María Rodríguez', telefonoEmergencia: '3012345678', sedeId: 'sede-1', sedeNombre: '34 STREET', contratistaId: 'con-1', contratistaNombre: 'FERRALPE SAS', centroCostoId: 'cc-1', centroCostoNombre: 'Centro Administrativo', createdAt: now, updatedAt: now },
  { id: 'emp-2', tipoId: 'CC', numeroId: '1023456789', nombres: 'María Fernanda', apellidos: 'García López', email: 'mgarcia@empresa.com', telefono: '3102345678', fechaNacimiento: '1995-08-22', genero: 'FEMENINO', direccion: 'Cl 80 #20-30, Bogotá', cargo: 'Supervisora', fechaIngreso: '2020-07-15', salario: 2500000, estado: 'ACTIVO', eps: 'Nueva EPS', fondoPensiones: 'Porvenir', arl: 'Colmena', contactoEmergencia: 'Pedro García', telefonoEmergencia: '3023456789', sedeId: 'sede-6', sedeNombre: 'AMANTINA T2', contratistaId: 'con-2', contratistaNombre: '3S INGENIERIA', centroCostoId: 'cc-2', centroCostoNombre: 'Centro Operativo Norte', createdAt: now, updatedAt: now },
  { id: 'emp-3', tipoId: 'CC', numeroId: '1034567890', nombres: 'Luis Alberto', apellidos: 'Martínez Soto', email: 'lmartinez@empresa.com', telefono: '3203456789', fechaNacimiento: '1988-12-10', genero: 'MASCULINO', direccion: 'Av 19 #100-50, Bogotá', cargo: 'Técnico', fechaIngreso: '2019-01-10', salario: 1900000, estado: 'VACACIONES', eps: 'Compensar', fondoPensiones: 'Protección', arl: 'Sura', contactoEmergencia: 'Ana Martínez', telefonoEmergencia: '3034567890', sedeId: 'sede-8', sedeNombre: 'BRINSA', contratistaId: 'con-3', contratistaNombre: 'ENCHAPES Y ACABADOS JCL', centroCostoId: 'cc-3', centroCostoNombre: 'Centro Operativo Sur', createdAt: now, updatedAt: now },
  { id: 'emp-4', tipoId: 'CE', numeroId: 'CE-456789', nombres: 'Andrea', apellidos: 'López Ramírez', email: 'alopez@empresa.com', telefono: '3104567890', fechaNacimiento: '1993-03-25', genero: 'FEMENINO', direccion: 'Cra 30 #22-15, Cali', cargo: 'Coordinadora', fechaIngreso: '2022-05-01', salario: 3000000, estado: 'ACTIVO', eps: 'Famisanar', fondoPensiones: 'Colfondos', arl: 'Positiva', contactoEmergencia: 'Carlos López', telefonoEmergencia: '3045678901', sedeId: 'sede-10', sedeNombre: 'CAMPURA ETAPA 4', contratistaId: 'con-5', contratistaNombre: 'CONINSA SAS', centroCostoId: 'cc-4', centroCostoNombre: 'Centro Logístico', createdAt: now, updatedAt: now },
  { id: 'emp-5', tipoId: 'CC', numeroId: '1056789012', nombres: 'Roberto', apellidos: 'Vargas Jiménez', email: 'rvargas@empresa.com', telefono: '3005678901', fechaNacimiento: '1985-07-30', genero: 'MASCULINO', direccion: 'Cl 50 #8-90, Medellín', cargo: 'Auxiliar', fechaIngreso: '2018-11-20', salario: 1400000, estado: 'INACTIVO', eps: 'Sura', fondoPensiones: 'Protección', arl: 'Sura', contactoEmergencia: 'Lucía Vargas', telefonoEmergencia: '3056789012', sedeId: 'sede-11', sedeNombre: 'CASTELLI', contratistaId: 'con-4', contratistaNombre: 'CYC OBRAS CIVILES', centroCostoId: 'cc-5', centroCostoNombre: 'Centro Comercial', createdAt: now, updatedAt: now },
]

// ============ ACTIVIDADES ============
export const mockActividades: MockActividad[] = [
  { id: 'act-1', codigo: 'ACT001', nombre: 'Mantenimiento Eléctrico', descripcion: 'Mantenimiento de instalaciones eléctricas', activo: true, createdAt: now, updatedAt: now },
  { id: 'act-2', codigo: 'ACT002', nombre: 'Limpieza General', descripcion: 'Limpieza y aseo de instalaciones', activo: true, createdAt: now, updatedAt: now },
  { id: 'act-3', codigo: 'ACT003', nombre: 'Vigilancia', descripcion: 'Control de acceso y seguridad', activo: true, createdAt: now, updatedAt: now },
  { id: 'act-4', codigo: 'ACT004', nombre: 'Mantenimiento Locativo', descripcion: 'Reparaciones y mantenimiento de estructura', activo: true, createdAt: now, updatedAt: now },
  { id: 'act-5', codigo: 'ACT005', nombre: 'Instalación de Redes', descripcion: 'Instalación de redes eléctricas y de datos', activo: false, createdAt: now, updatedAt: now },
]

// ============ DESTINOS ============
export const mockDestinos: MockDestino[] = [
  { id: 'des-1', nombre: 'Piso 1 - Recepción', descripcion: 'Área de recepción principal', estado: 'ACTIVO', sedeId: 'sede-1', sedeNombre: '34 STREET', createdAt: now, updatedAt: now },
  { id: 'des-2', nombre: 'Piso 3 - Oficinas', descripcion: 'Oficinas administrativas', estado: 'ACTIVO', sedeId: 'sede-1', sedeNombre: '34 STREET', createdAt: now, updatedAt: now },
  { id: 'des-3', nombre: 'Planta Industrial', descripcion: 'Zona de producción', estado: 'ACTIVO', sedeId: 'sede-8', sedeNombre: 'BRINSA', createdAt: now, updatedAt: now },
  { id: 'des-4', nombre: 'Bodega Norte', descripcion: 'Almacenamiento zona norte', estado: 'INACTIVO', sedeId: 'sede-11', sedeNombre: 'CASTELLI', createdAt: now, updatedAt: now },
  { id: 'des-5', nombre: 'Torre A', descripcion: 'Torre residencial A', estado: 'ACTIVO', sedeId: 'sede-10', sedeNombre: 'CAMPURA ETAPA 4', createdAt: now, updatedAt: now },
]

// ============ PLANIFICACIÓN CARGOS ============
export const mockPlanificacionCargos: MockPlanificacionCargo[] = [
  { id: 'plan-1', contratistaId: 'con-1', contratistaNombre: 'FERRALPE SAS', sedeId: 'sede-1', sedeNombre: '34 STREET', cargo: 'Soporte', cantidad: 2, fechaInicio: '2025-08-13', fechaFin: '2025-08-16', createdAt: now, updatedAt: now },
  { id: 'plan-2', contratistaId: 'con-2', contratistaNombre: '3S INGENIERIA ESPECIALIZADA SAS', sedeId: 'sede-6', sedeNombre: 'AMANTINA T2', cargo: 'Prueba2', cantidad: 2, fechaInicio: '2025-02-06', fechaFin: '2025-02-20', createdAt: now, updatedAt: now },
  { id: 'plan-3', contratistaId: 'con-6', contratistaNombre: '23 MYM', sedeId: 'sede-10', sedeNombre: 'CAMPURA ETAPA 4', cargo: 'Prueba', cantidad: 2, fechaInicio: '2025-02-07', fechaFin: '2025-02-20', createdAt: now, updatedAt: now },
  { id: 'plan-4', contratistaId: 'con-4', contratistaNombre: 'CYC OBRAS CIVILES SAS', sedeId: 'sede-9', sedeNombre: 'CAMPURA', cargo: 'Prueba2', cantidad: 5, fechaInicio: '2024-11-19', fechaFin: '2024-11-21', createdAt: now, updatedAt: now },
  { id: 'plan-5', contratistaId: 'con-2', contratistaNombre: '3S INGENIERIA ESPECIALIZADA SAS', sedeId: 'sede-11', sedeNombre: 'SEDE CENTRO', cargo: 'Prueba', cantidad: 2, fechaInicio: '2024-11-06', fechaFin: '2024-11-21', createdAt: now, updatedAt: now },
  { id: 'plan-6', contratistaId: 'con-2', contratistaNombre: '3S INGENIERIA ESPECIALIZADA SAS', sedeId: 'sede-12', sedeNombre: 'URBANA PARK', cargo: 'Ayudante', cantidad: 5, fechaInicio: '2023-04-17', fechaFin: '2023-04-30', createdAt: now, updatedAt: now },
  { id: 'plan-7', contratistaId: 'con-3', contratistaNombre: 'ENCHAPES Y ACABADOS JCL S.A.S', sedeId: 'sede-13', sedeNombre: 'RESERVA DE BUCAROS', cargo: 'Ayudante', cantidad: 6, fechaInicio: '2020-10-06', fechaFin: '2020-10-31', createdAt: now, updatedAt: now },
  { id: 'plan-8', contratistaId: 'con-1', contratistaNombre: 'FERRALPE SAS', sedeId: 'sede-14', sedeNombre: 'SEDE DE PRUEBA', cargo: 'Ingeniero Pruebas', cantidad: 10, fechaInicio: '2025-08-12', fechaFin: '2028-12-31', createdAt: now, updatedAt: now },
]

// ============ VISITANTES ============
export const mockVisitantes: MockVisitante[] = [
  { id: 'vis-1', nombre: 'Carlos Herrera', identificacion: '1099876543', tipo: 'EMPRESARIAL', empresa: 'Proveedor ABC', telefono: '3001112233', email: 'cherrera@proveedor.com', motivo: 'Entrega de materiales', fechaEntrada: '2025-03-20T09:00:00', fechaSalida: '2025-03-20T10:30:00', estado: 'FINALIZADA', sedeId: 'sede-1', sedeNombre: '34 STREET', createdAt: now, updatedAt: now },
  { id: 'vis-2', nombre: 'Laura Jiménez', identificacion: '1098765432', tipo: 'PERSONAL', empresa: '', telefono: '3112223344', email: '', motivo: 'Visita a empleado', fechaEntrada: '2025-03-20T14:00:00', estado: 'EN_SITIO', sedeId: 'sede-6', sedeNombre: 'AMANTINA T2', createdAt: now, updatedAt: now },
  { id: 'vis-3', nombre: 'Empresa Técnica SAS', identificacion: '900111222-3', tipo: 'PROVEEDOR', empresa: 'Empresa Técnica SAS', telefono: '3213334455', email: 'soporte@tecnica.com', motivo: 'Mantenimiento de equipos', fechaEntrada: '2025-03-19T08:00:00', fechaSalida: '2025-03-19T16:00:00', estado: 'FINALIZADA', sedeId: 'sede-8', sedeNombre: 'BRINSA', createdAt: now, updatedAt: now },
]

// ============ DOCUMENTOS ============
export const mockDocumentos: MockDocumento[] = [
  { id: 'doc-1', nombre: 'Contrato Juan Rodríguez', tipo: 'CONTRATO', descripcion: 'Contrato de trabajo por obra', url: '/docs/contrato-emp1.pdf', empleadoId: 'emp-1', empleadoNombre: 'Juan Carlos Rodríguez', createdAt: '2021-03-01', updatedAt: '2021-03-01' },
  { id: 'doc-2', nombre: 'Cédula María García', tipo: 'CEDULA', descripcion: 'Copia cédula de ciudadanía', url: '/docs/cedula-emp2.pdf', empleadoId: 'emp-2', empleadoNombre: 'María Fernanda García', createdAt: '2020-07-15', updatedAt: '2020-07-15' },
  { id: 'doc-3', nombre: 'Hoja de vida Luis Martínez', tipo: 'HV', descripcion: 'CV actualizado', url: '/docs/hv-emp3.pdf', empleadoId: 'emp-3', empleadoNombre: 'Luis Alberto Martínez', createdAt: '2019-01-10', updatedAt: '2019-01-10' },
  { id: 'doc-4', nombre: 'Examen médico Andrea López', tipo: 'EXAMEN_MEDICO', descripcion: 'Examen de ingreso 2022', url: '/docs/exam-emp4.pdf', empleadoId: 'emp-4', empleadoNombre: 'Andrea López Ramírez', createdAt: '2022-05-01', updatedAt: '2022-05-01' },
  { id: 'doc-5', nombre: 'Licencia Roberto Vargas', tipo: 'LICENCIA', descripcion: 'Licencia de conducción', url: '/docs/licencia-emp5.pdf', empleadoId: 'emp-5', empleadoNombre: 'Roberto Vargas Jiménez', createdAt: '2018-11-20', updatedAt: '2018-11-20' },
]
