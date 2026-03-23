import api from './client';
import type { 
  Vehiculo, 
  Conductor, 
  Comparendo, 
  InspeccionPreoperacional,
  EncuestaSeguridadVial,
  DashboardSeguridadVial
} from '../types';

// ==========================================
// PAYLOADS
// ==========================================

export interface VehiculoPayload {
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  ano: number;
  color: string;
  numeroMotor?: string;
  numeroChasis?: string;
  vin?: string;
  tipoCombustible: string;
  capacidadPasajeros?: number;
  capacidadCarga?: number;
  fechaVencimientoSOAT?: string;
  fechaVencimientoTecnomecanica?: string;
  fechaVencimientoTarjetaOperacion?: string;
  empresaAseguradora?: string;
  estado?: string;
  sedeId?: string;
  kilometrajeActual?: number;
  observaciones?: string;
}

export interface ConductorPayload {
  empleadoId?: string;
  externoNombre?: string;
  externoIdentificacion?: string;
  externoTelefono?: string;
  externoEmail?: string;
  numeroLicencia: string;
  categoriaLicencia: string;
  fechaExpedicionLicencia: string;
  fechaVencimientoLicencia: string;
  organismoTransito: string;
  estadoLicencia?: string;
  esExterno?: boolean;
  observaciones?: string;
}

export interface ComparendoPayload {
  numeroComparendo: string;
  fechaInfraccion: string;
  horaInfraccion?: string;
  lugarInfraccion: string;
  tipoComparendo: string;
  codigoInfraccion?: string;
  descripcionInfraccion: string;
  valorMulta: number;
  estado?: string;
  fechaNotificacion?: string;
  fechaPago?: string;
  valorPago?: number;
  vehiculoId?: string;
  conductorId?: string;
  sedeId?: string;
  observaciones?: string;
}

export interface InspeccionPayload {
  fecha: string;
  hora: string;
  vehiculoId: string;
  conductorId: string;
  kilometrajeInicial: number;
  lucesAltas: boolean;
  lucesBajas: boolean;
  direccionales: boolean;
  lucesFreno: boolean;
  lucesRetroceso: boolean;
  nivelAceite: boolean;
  nivelFrenos: boolean;
  nivelRefrigerante: boolean;
  nivelDireccion: boolean;
  llantaDelanteraIzquierda: boolean;
  llantaDelanteraDerecha: boolean;
  llantaTraseraIzquierda: boolean;
  llantaTraseraDerecha: boolean;
  llantaRepuesto: boolean;
  frenos: boolean;
  direccion: boolean;
  claxon: boolean;
  cinturonesSeguridad: boolean;
  espejosRetrovisores: boolean;
  limpiaparabrisas: boolean;
  vidrios: boolean;
  puertas: boolean;
  tarjetaPropiedad: boolean;
  soat: boolean;
  revisionTecnomecanica: boolean;
  seguroContractual: boolean;
  seguroExtracontractual: boolean;
  observaciones?: string;
  novedades?: string;
}

// ==========================================
// CATÁLOGOS
// ==========================================

export const catalogosVial = {
  tiposVehiculo: [
    { value: 'CARRO', label: 'Carro', icon: 'Car' },
    { value: 'MOTO', label: 'Moto', icon: 'Motorcycle' },
    { value: 'CAMION', label: 'Camión', icon: 'Truck' },
    { value: 'CAMIONETA', label: 'Camioneta', icon: 'Truck' },
    { value: 'BUS', label: 'Bus', icon: 'Bus' },
    { value: 'VAN', label: 'Van', icon: 'Van' },
    { value: 'OTRO', label: 'Otro', icon: 'QuestionMark' },
  ],

  estadosVehiculo: [
    { value: 'ACTIVO', label: 'Activo', color: 'green' },
    { value: 'MANTENIMIENTO', label: 'En Mantenimiento', color: 'yellow' },
    { value: 'INACTIVO', label: 'Inactivo', color: 'gray' },
    { value: 'BAJA', label: 'De Baja', color: 'red' },
  ],

  tiposCombustible: [
    { value: 'GASOLINA', label: 'Gasolina' },
    { value: 'DIESEL', label: 'Diesel' },
    { value: 'GAS', label: 'Gas (GLP/GNV)' },
    { value: 'ELECTRICO', label: 'Eléctrico' },
    { value: 'HIBRIDO', label: 'Híbrido' },
  ],

  categoriasLicencia: [
    { value: 'A1', label: 'A1 - Motos hasta 125cc' },
    { value: 'A2', label: 'A2 - Motos más de 125cc' },
    { value: 'B1', label: 'B1 - Automóviles, camperos, camionetas' },
    { value: 'B2', label: 'B2 - Camiones, buses, busetas' },
    { value: 'B3', label: 'B3 - Vehículos articulados' },
    { value: 'C1', label: 'C1 - Automóviles, camperos, camionetas (servicio público)' },
    { value: 'C2', label: 'C2 - Camiones, buses, busetas (servicio público)' },
    { value: 'C3', label: 'C3 - Vehículos articulados (servicio público)' },
  ],

  estadosLicencia: [
    { value: 'VIGENTE', label: 'Vigente', color: 'green' },
    { value: 'VENCIDA', label: 'Vencida', color: 'red' },
    { value: 'SUSPENDIDA', label: 'Suspendida', color: 'yellow' },
    { value: 'CANCELADA', label: 'Cancelada', color: 'gray' },
  ],

  tiposComparendo: [
    { value: 'LEVE', label: 'Leve', color: 'yellow' },
    { value: 'GRAVE', label: 'Grave', color: 'orange' },
    { value: 'GRAVISIMO', label: 'Gravísimo', color: 'red' },
  ],

  estadosComparendo: [
    { value: 'PENDIENTE', label: 'Pendiente', color: 'red' },
    { value: 'PAGADO', label: 'Pagado', color: 'green' },
    { value: 'APLAZADO', label: 'Aplazado', color: 'yellow' },
    { value: 'EN_RECURSO', label: 'En Recurso', color: 'blue' },
  ],
};

// ==========================================
// API
// ==========================================

export const seguridadVialApi = {
  // Dashboard
  getDashboard: async (): Promise<{ data: DashboardSeguridadVial }> => {
    // Simulación - reemplazar con llamada real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            totalVehiculos: 45,
            vehiculosActivos: 38,
            vehiculosEnMantenimiento: 5,
            vehiculosSOATVencido: 2,
            vehiculosTecnoVencido: 3,
            totalConductores: 52,
            conductoresLicenciaVencida: 4,
            totalComparendos: 28,
            comparendosPendientes: 12,
            comparendosMes: 3,
            inspeccionesHoy: 18,
            inspeccionesAprobadas: 15,
            inspeccionesConNovedades: 3,
          }
        });
      }, 500);
    });
  },

  // Vehículos
  listVehiculos: async (params?: { search?: string; estado?: string; sedeId?: string }): Promise<{ data: Vehiculo[] }> => {
    // Simulación
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              placa: 'ABC123',
              tipo: 'CARRO',
              marca: 'Toyota',
              modelo: 'Corolla',
              ano: 2022,
              color: 'Blanco',
              tipoCombustible: 'GASOLINA',
              estado: 'ACTIVO',
              kilometrajeActual: 45000,
              sedeId: '1',
              fechaVencimientoSOAT: '2026-06-15',
              fechaVencimientoTecnomecanica: '2026-09-20',
              createdAt: '2024-01-15',
              updatedAt: '2025-03-20',
            },
            {
              id: '2',
              placa: 'DEF456',
              tipo: 'CAMIONETA',
              marca: 'Ford',
              modelo: 'Ranger',
              ano: 2023,
              color: 'Gris',
              tipoCombustible: 'DIESEL',
              estado: 'ACTIVO',
              kilometrajeActual: 28000,
              sedeId: '1',
              fechaVencimientoSOAT: '2026-04-10',
              fechaVencimientoTecnomecanica: '2026-07-15',
              createdAt: '2024-02-20',
              updatedAt: '2025-03-18',
            },
          ]
        });
      }, 500);
    });
  },

  getVehiculoById: async (id: string): Promise<{ data: Vehiculo }> => {
    return api.get(`/seguridad-vial/vehiculos/${id}`);
  },

  createVehiculo: async (data: VehiculoPayload): Promise<{ data: Vehiculo }> => {
    return api.post('/seguridad-vial/vehiculos', data);
  },

  updateVehiculo: async (id: string, data: Partial<VehiculoPayload>): Promise<{ data: Vehiculo }> => {
    return api.put(`/seguridad-vial/vehiculos/${id}`, data);
  },

  deleteVehiculo: async (id: string): Promise<void> => {
    return api.delete(`/seguridad-vial/vehiculos/${id}`);
  },

  getVehiculoByPlaca: async (placa: string): Promise<{ data: Vehiculo | null }> => {
    return api.get(`/seguridad-vial/vehiculos/placa/${placa}`);
  },

  // Conductores
  listConductores: async (): Promise<{ data: Conductor[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              empleadoId: '1',
              numeroLicencia: '1234567890',
              categoriaLicencia: 'B1',
              fechaExpedicionLicencia: '2020-01-15',
              fechaVencimientoLicencia: '2030-01-15',
              organismoTransito: 'Bogotá',
              estadoLicencia: 'VIGENTE',
              esExterno: false,
              createdAt: '2024-01-15',
              updatedAt: '2025-01-15',
            },
          ]
        });
      }, 500);
    });
  },

  createConductor: async (data: ConductorPayload): Promise<{ data: Conductor }> => {
    return api.post('/seguridad-vial/conductores', data);
  },

  updateConductor: async (id: string, data: Partial<ConductorPayload>): Promise<{ data: Conductor }> => {
    return api.put(`/seguridad-vial/conductores/${id}`, data);
  },

  deleteConductor: async (id: string): Promise<void> => {
    return api.delete(`/seguridad-vial/conductores/${id}`);
  },

  // Comparendos
  listComparendos: async (): Promise<{ data: Comparendo[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: '1',
              numeroComparendo: 'CMP-2026-001',
              fechaInfraccion: '2026-03-10',
              horaInfraccion: '08:30',
              lugarInfraccion: 'Av. El Dorado con Calle 26',
              tipoComparendo: 'GRAVE',
              descripcionInfraccion: 'Exceso de velocidad',
              valorMulta: 312000,
              estado: 'PENDIENTE',
              vehiculoId: '1',
              createdAt: '2026-03-10',
              updatedAt: '2026-03-10',
            },
          ]
        });
      }, 500);
    });
  },

  createComparendo: async (data: ComparendoPayload): Promise<{ data: Comparendo }> => {
    return api.post('/seguridad-vial/comparendos', data);
  },

  updateComparendo: async (id: string, data: Partial<ComparendoPayload>): Promise<{ data: Comparendo }> => {
    return api.put(`/seguridad-vial/comparendos/${id}`, data);
  },

  deleteComparendo: async (id: string): Promise<void> => {
    return api.delete(`/seguridad-vial/comparendos/${id}`);
  },

  // Inspecciones Preoperacionales
  listInspecciones: async (): Promise<{ data: InspeccionPreoperacional[] }> => {
    return api.get('/seguridad-vial/inspecciones');
  },

  createInspeccion: async (data: InspeccionPayload): Promise<{ data: InspeccionPreoperacional }> => {
    return api.post('/seguridad-vial/inspecciones', data);
  },

  getInspeccionById: async (id: string): Promise<{ data: InspeccionPreoperacional }> => {
    return api.get(`/seguridad-vial/inspecciones/${id}`);
  },

  // Encuestas
  listEncuestas: async (): Promise<{ data: EncuestaSeguridadVial[] }> => {
    return api.get('/seguridad-vial/encuestas');
  },

  getEncuestaActiva: async (): Promise<{ data: EncuestaSeguridadVial | null }> => {
    return api.get('/seguridad-vial/encuestas/activa');
  },
};
