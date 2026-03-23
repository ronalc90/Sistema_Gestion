import { ReactNode, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { FaPlus, FaSearch, FaFilter, FaDownload, FaCalendar, FaUser, FaClipboard } from 'react-icons/fa'

interface Props {
  icon: ReactNode
  title: string
  description?: string
  color?: string
  mockData?: boolean
}

export default function SgsstPage({ icon, title, description, color = 'blue', mockData = true }: Props) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('listado')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)

  const colors: Record<string, { bg: string; border: string; text: string; light: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', light: 'bg-blue-100' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', light: 'bg-green-100' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', light: 'bg-orange-100' },
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', light: 'bg-red-100' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', light: 'bg-purple-100' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', light: 'bg-teal-100' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', light: 'bg-yellow-100' },
  }

  const c = colors[color] ?? colors.blue

  // Generar datos mock según el título
  const getMockData = () => {
    if (title.toLowerCase().includes('trabajador')) {
      return [
        { id: 1, nombre: 'Juan Pérez', cargo: 'Operario', sede: 'Principal', estado: 'Activo' },
        { id: 2, nombre: 'María García', cargo: 'Supervisora', sede: 'Norte', estado: 'Activo' },
        { id: 3, nombre: 'Carlos López', cargo: 'Técnico', sede: 'Sur', estado: 'Incapacitado' },
      ]
    }
    if (title.toLowerCase().includes('periodo')) {
      return [
        { id: 1, nombre: '2024 - Periodo 1', inicio: '01/01/2024', fin: '30/06/2024', estado: 'Activo' },
        { id: 2, nombre: '2024 - Periodo 2', inicio: '01/07/2024', fin: '31/12/2024', estado: 'Pendiente' },
      ]
    }
    if (title.toLowerCase().includes('indicador')) {
      return [
        { id: 1, nombre: 'Frecuencia de accidentes', meta: '2.5', actual: '1.8', cumplimiento: '72%' },
        { id: 2, nombre: 'Severidad de accidentes', meta: '100', actual: '85', cumplimiento: '85%' },
        { id: 3, nombre: 'Cumplimiento de capacitaciones', meta: '100%', actual: '95%', cumplimiento: '95%' },
      ]
    }
    return [
      { id: 1, nombre: 'Item de ejemplo 1', descripcion: 'Descripción del item 1', fecha: '2024-01-15', estado: 'Activo' },
      { id: 2, nombre: 'Item de ejemplo 2', descripcion: 'Descripción del item 2', fecha: '2024-02-20', estado: 'Pendiente' },
      { id: 3, nombre: 'Item de ejemplo 3', descripcion: 'Descripción del item 3', fecha: '2024-03-10', estado: 'Completado' },
    ]
  }

  const mockItems = getMockData()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 ${c.light} rounded-lg`}>
            <span className={`text-xl ${c.text}`}>{icon}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description || `Gestión de ${title.toLowerCase()}`}</p>
          </div>
        </div>
      </div>

      {mockData ? (
        <>
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
            <nav className="flex space-x-6">
              {['Listado', 'Nuevo', 'Reportes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.toLowerCase()
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg">
                <FaFilter />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Nuevo
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <FaDownload className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {Object.keys(mockItems[0]).map((key) => (
                    <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {Object.entries(item).map(([key, value]) => (
                      <td key={key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {key === 'estado' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            value === 'Activo' ? 'bg-green-100 text-green-800' :
                            value === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            value === 'Completado' ? 'bg-blue-100 text-blue-800' :
                            value === 'Incapacitado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {String(value)}
                          </span>
                        ) : (
                          String(value)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <FaClipboard className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded">
                          <FaCalendar className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded">
                          <FaUser className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {mockItems.length} de {mockItems.length} registros
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                Anterior
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                Siguiente
              </button>
            </div>
          </div>

          {/* Modal Mock */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nuevo Registro</h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input type="text" className="form-input w-full" placeholder="Ingrese el nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                    <textarea className="form-input w-full" rows={3} placeholder="Ingrese la descripción" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                    <select className="form-select w-full">
                      <option>Activo</option>
                      <option>Pendiente</option>
                      <option>Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      setShowModal(false)
                      alert('Funcionalidad mock: El registro se guardaría aquí')
                    }}
                    className="btn-primary"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={`rounded-xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center ${c.bg} ${c.border}`}>
          <div className="text-5xl mb-4 opacity-60">{icon}</div>
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-sm opacity-70 max-w-xs">
            {t('common.moduleInDev', { title: title.toLowerCase() })}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/60 border">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {t('common.underConstruction')}
          </span>
        </div>
      )}
    </div>
  )
}
