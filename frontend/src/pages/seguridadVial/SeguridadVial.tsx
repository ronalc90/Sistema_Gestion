import { useState, useEffect, useCallback } from 'react';
import { 
  QuestionMarkCircleIcon,
  TruckIcon,
  UserIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
  ListBulletIcon,
  SearchIcon,
  TableCellsIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import PageHeader from '../../components/common/PageHeader';
import DashboardVial from './components/DashboardVial';
import VehiculosPanel from './components/VehiculosPanel';
import ConductoresPanel from './components/ConductoresPanel';
import ComparendosPanel from './components/ComparendosPanel';
import EncuestaPanel from './components/EncuestaPanel';
import AsistenteModal from './components/AsistenteModal';
import BusquedaPlaca from './components/BusquedaPlaca';
import { seguridadVialApi } from '../../api/seguridadVial.api';
import type { Vehiculo } from '../../types';
import toast from 'react-hot-toast';

type VistaActual = 'inicio' | 'vehiculos' | 'conductores' | 'comparendos' | 'encuesta';
type SubVista = 'lista' | 'nuevo' | 'editar' | 'inspeccion';

interface DropdownItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface NavItem {
  id: VistaActual;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  dropdown?: DropdownItem[];
}

export default function SeguridadVial() {
  const [vistaActual, setVistaActual] = useState<VistaActual>('inicio');
  const [subVista, setSubVista] = useState<SubVista>('lista');
  const [dropdownAbierto, setDropdownAbierto] = useState<VistaActual | null>(null);
  const [modalAsistente, setModalAsistente] = useState(false);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarVehiculos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await seguridadVialApi.listVehiculos();
      setVehiculos(res.data);
    } catch (error) {
      toast.error('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarVehiculos();
  }, [cargarVehiculos]);

  const handleVehiculosAction = (action: string) => {
    switch (action) {
      case 'nuevo':
        setVistaActual('vehiculos');
        setSubVista('nuevo');
        break;
      case 'lista':
        setVistaActual('vehiculos');
        setSubVista('lista');
        break;
      case 'inspeccion':
        setVistaActual('vehiculos');
        setSubVista('inspeccion');
        break;
      case 'maestro':
        toast.success('Descargando maestro de inspecciones...');
        break;
    }
    setDropdownAbierto(null);
  };

  const handleConductoresAction = (action: string) => {
    setVistaActual('conductores');
    setSubVista('lista');
    setDropdownAbierto(null);
  };

  const handleComparendosAction = (action: string) => {
    switch (action) {
      case 'nuevo':
        setVistaActual('comparendos');
        setSubVista('nuevo');
        break;
      case 'lista':
        setVistaActual('comparendos');
        setSubVista('lista');
        break;
    }
    setDropdownAbierto(null);
  };

  const handleEncuestaAction = (action: string) => {
    setVistaActual('encuesta');
    setSubVista('lista');
    setDropdownAbierto(null);
  };

  const navItems: NavItem[] = [
    {
      id: 'vehiculos',
      label: 'Vehículos',
      icon: TruckIcon,
      color: 'bg-green-600 hover:bg-green-700',
      dropdown: [
        { id: 'nuevo', label: 'Agregar vehículo', icon: PlusIcon, action: () => handleVehiculosAction('nuevo') },
        { id: 'lista', label: 'Vehículos registrados', icon: ListBulletIcon, action: () => handleVehiculosAction('lista') },
        { id: 'inspeccion', label: 'Generar inspección', icon: SearchIcon, action: () => handleVehiculosAction('inspeccion') },
        { id: 'maestro', label: 'Maestro inspecciones preoperacionales', icon: TableCellsIcon, action: () => handleVehiculosAction('maestro') },
      ]
    },
    {
      id: 'conductores',
      label: 'Conductores',
      icon: UserIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      dropdown: [
        { id: 'admin', label: 'Admin conductores', icon: UserIcon, action: () => handleConductoresAction('admin') },
      ]
    },
    {
      id: 'comparendos',
      label: 'Comparendos',
      icon: DocumentTextIcon,
      color: 'bg-red-600 hover:bg-red-700',
      dropdown: [
        { id: 'nuevo', label: 'Ingresar comparendo', icon: PlusIcon, action: () => handleComparendosAction('nuevo') },
        { id: 'lista', label: 'Comparendos registrados', icon: ListBulletIcon, action: () => handleComparendosAction('lista') },
      ]
    },
    {
      id: 'encuesta',
      label: 'Encuesta Seguridad Vial',
      icon: ClipboardDocumentCheckIcon,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      dropdown: [
        { id: 'panel', label: 'Ver Panel', icon: ComputerDesktopIcon, action: () => handleEncuestaAction('panel') },
      ]
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Seguridad Vial - Panel de Mando"
        breadcrumbs={[
          { label: 'SG-SST', path: '/sgsst' },
          { label: 'Seguridad Vial' }
        ]}
      />

      {/* Navbar Horizontal con Dropdowns */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Asistente - Botón Simple */}
          <button
            onClick={() => setModalAsistente(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
                     text-gray-700 dark:text-gray-200 
                     bg-gray-100 dark:bg-gray-700 
                     hover:bg-gray-200 dark:hover:bg-gray-600
                     rounded-lg transition-colors"
          >
            <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500" />
            Asistente
          </button>

          {/* Separador */}
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Dropdowns Principales */}
          {navItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => setDropdownAbierto(dropdownAbierto === item.id ? null : item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium 
                         text-white ${item.color} 
                         rounded-lg transition-colors shadow-sm`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${dropdownAbierto === item.id ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownAbierto === item.id && item.dropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={subItem.action}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200
                                 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <subItem.icon className="w-4 h-4 text-gray-400" />
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      {vistaActual === 'inicio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imagen / Ilustración */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 relative">
                {/* Ilustración SVG de seguridad vial */}
                <svg viewBox="0 0 200 200" className="w-full h-full text-blue-500">
                  <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1" />
                  <rect x="60" y="110" width="80" height="40" rx="8" fill="currentColor" opacity="0.3" />
                  <circle cx="75" cy="150" r="12" fill="currentColor" opacity="0.5" />
                  <circle cx="125" cy="150" r="12" fill="currentColor" opacity="0.5" />
                  <path d="M100 40 L100 90 M80 60 L120 60" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M90 100 L98 108 L110 92" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Bienvenido al Módulo de Seguridad Vial
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Gestione vehículos, conductores, comparendos y encuestas de seguridad vial
              </p>
            </div>
          </div>

          {/* Búsqueda por Placa */}
          <BusquedaPlaca vehiculos={vehiculos} loading={loading} />
        </div>
      )}

      {vistaActual === 'vehiculos' && (
        <VehiculosPanel 
          subVista={subVista} 
          onChangeSubVista={setSubVista}
          vehiculos={vehiculos}
          loading={loading}
          onRefresh={cargarVehiculos}
        />
      )}

      {vistaActual === 'conductores' && (
        <ConductoresPanel />
      )}

      {vistaActual === 'comparendos' && (
        <ComparendosPanel subVista={subVista} onChangeSubVista={setSubVista} />
      )}

      {vistaActual === 'encuesta' && (
        <EncuestaPanel />
      )}

      {/* Modal Asistente */}
      <AsistenteModal 
        isOpen={modalAsistente} 
        onClose={() => setModalAsistente(false)} 
      />
    </div>
  );
}
