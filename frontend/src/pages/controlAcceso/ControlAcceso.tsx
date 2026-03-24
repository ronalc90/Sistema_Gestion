import { useState } from 'react';
import { 
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  FunnelIcon,
  QrCodeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import PageHeader from '../../components/common/PageHeader';
import EstadisticaRapida from './components/EstadisticaRapida';
import FiltroEspecifico from './components/FiltroEspecifico';
import QRAcceso from './components/QRAcceso';
import ConfiguracionVisitantes from './components/ConfiguracionVisitantes';
import AsistenteModal from './components/AsistenteModal';
import toast from 'react-hot-toast';

type TabActiva = 'estadisticas' | 'filtro' | 'qr' | 'visitantes';

export default function ControlAcceso() {
  const [tabActiva, setTabActiva] = useState<TabActiva>('estadisticas');
  const [modalAsistente, setModalAsistente] = useState(false);

  const tabs = [
    { id: 'estadisticas' as const, label: 'Estadística rápida', icon: ChartBarIcon },
    { id: 'filtro' as const, label: 'Filtro específico', icon: FunnelIcon },
    { id: 'qr' as const, label: 'QR-Acceso', icon: QrCodeIcon },
    { id: 'visitantes' as const, label: 'Visitantes', icon: UserGroupIcon },
  ];

  const handleExportarCSV = () => {
    toast.success('Exportando maestro completo en CSV...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Sistema de control de acceso: Panel central"
        breadcrumbs={[
          { label: 'SG-SST', path: '/sgsst' },
          { label: 'Controles de Acceso' }
        ]}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleExportarCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                   text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Maestro completo en CSV
        </button>
        <button
          onClick={() => setModalAsistente(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium 
                   text-gray-700 dark:text-gray-200 
                   bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <QuestionMarkCircleIcon className="w-4 h-4" />
          Asistente
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors
                ${tabActiva === tab.id 
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido según tab */}
      <div className="mt-6">
        {tabActiva === 'estadisticas' && <EstadisticaRapida />}
        {tabActiva === 'filtro' && <FiltroEspecifico />}
        {tabActiva === 'qr' && <QRAcceso />}
        {tabActiva === 'visitantes' && <ConfiguracionVisitantes />}
      </div>

      {/* Modal Asistente */}
      <AsistenteModal 
        isOpen={modalAsistente} 
        onClose={() => setModalAsistente(false)} 
      />
    </div>
  );
}
