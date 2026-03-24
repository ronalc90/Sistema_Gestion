import { useState } from 'react'
import { FaBuilding, FaSave, FaInfoCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaIdCard } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface EmpresaData {
  nombre: string
  nombreComercial: string
  departamento: string
  municipio: string
  nit: string
  nitDigito: string
  nivelRiesgo: string
  tamanoEmpresa: string
  arl: string
  telefono: string
  direccion: string
  sitioWeb: string
  correo: string
  actividadEconomica: string
  consultaMedicoContratista: boolean
  desbloquearDiagnostico: boolean
}

const initialData: EmpresaData = {
  nombre: 'Coninsa Ramon H. S.A.',
  nombreComercial: 'Coninsa Ramon H.',
  departamento: 'ANTIOQUIA',
  municipio: 'MEDELLIN',
  nit: '890911431',
  nitDigito: '890911431-1',
  nivelRiesgo: 'Nivel V',
  tamanoEmpresa: 'GRANDE',
  arl: 'Bolivar',
  telefono: '5116199',
  direccion: 'Calle 55  45  55',
  sitioWeb: '',
  correo: 'lorozco@coninsa.co',
  actividadEconomica: '4111 Construcción de edificios residenciales',
  consultaMedicoContratista: false,
  desbloquearDiagnostico: true,
}

const departamentos = ['ANTIOQUIA', 'ATLANTICO', 'BOGOTA', 'BOLIVAR', 'CALDAS', 'CAUCA', 'CESAR', 'CORDOBA', 'CUNDINAMARCA', 'HUILA', 'MAGDALENA', 'META', 'NARIÑO', 'NORTE DE SANTANDER', 'QUINDIO', 'RISARALDA', 'SANTANDER', 'TOLIMA', 'VALLE DEL CAUCA']
const municipios = ['MEDELLIN', 'BARRANQUILLA', 'BOGOTA', 'CARTAGENA', 'MANIZALES', 'POPAYAN', 'VALLEDUPAR', 'MONTERIA', 'ARMENIA', 'PEREIRA', 'BUCARAMANGA', 'IBAGUE', 'CALI']
const tamanosEmpresa = ['MICRO', 'PEQUEÑA', 'MEDIANA', 'GRANDE']
const arls = ['Bolivar', 'SURA', 'Colmena', 'Positiva', 'Seguros Bolivar', 'Liberty', 'AXA Colpatria', 'Mapfre', 'Allianz']
const nivelesRiesgo = ['Nivel I', 'Nivel II', 'Nivel III', 'Nivel IV', 'Nivel V']
const actividadesEconomicas = [
  '4111 Construcción de edificios residenciales',
  '4112 Construcción de edificios no residenciales',
  '4120 Construcción de obras de ingeniería civil',
  '4210 Construcción de carreteras y vías de ferrocarril',
  '4220 Construcción de proyectos de servicio público',
  '4290 Construcción de obras de ingeniería civil n.c.p.',
]

type TabType = 'detalles' | 'personalizacion' | 'politica' | 'referencias'

export default function DetallesEmpresa() {
  const [activeTab, setActiveTab] = useState<TabType>('detalles')
  const [form, setForm] = useState<EmpresaData>(initialData)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (field: keyof EmpresaData, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulación de guardado
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSaved(true)
    toast.success('Empresa guardada exitosamente')
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'detalles', label: 'Detalles empresa' },
    { id: 'personalizacion', label: 'Personalización' },
    { id: 'politica', label: 'Política empresa' },
    { id: 'referencias', label: 'Referencias externas' },
  ]

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FaBuilding className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Empresa: Crear o editar empresa</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        {activeTab === 'detalles' && (
          <div className="p-6 space-y-6">
            {/* Primera fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Nombre empresa:" value={form.nombre} onChange={(v) => set('nombre', v)} icon={<FaInfoCircle className="text-orange-400" />} required />
              <FormField label="Nombre Comercial:" value={form.nombreComercial} onChange={(v) => set('nombreComercial', v)} icon={<FaInfoCircle className="text-blue-400" />} />
              <FormField label="Nit:" value={form.nit} onChange={(v) => set('nit', v)} icon={<FaInfoCircle className="text-orange-400" />} />
            </div>

            {/* Segunda fila */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SelectField label="Departamento:" value={form.departamento} onChange={(v) => set('departamento', v)} options={departamentos} icon={<FaMapMarkerAlt className="text-orange-400" />} />
              <SelectField label="Municipio:" value={form.municipio} onChange={(v) => set('municipio', v)} options={municipios} icon={<FaMapMarkerAlt className="text-orange-400" />} />
              <SelectField label="Tamaño de la empresa:" value={form.tamanoEmpresa} onChange={(v) => set('tamanoEmpresa', v)} options={tamanosEmpresa} icon={<FaInfoCircle className="text-orange-400" />} />
              <SelectField label="ARL:" value={form.arl} onChange={(v) => set('arl', v)} options={arls} icon={<FaInfoCircle className="text-orange-400" />} />
            </div>

            {/* Tercera fila */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <SelectField label="Nivel de riesgo:" value={form.nivelRiesgo} onChange={(v) => set('nivelRiesgo', v)} options={nivelesRiesgo} icon={<FaInfoCircle className="text-orange-400" />} />
              <FormField label="N.I.T - Dígito:" value={form.nitDigito} onChange={(v) => set('nitDigito', v)} icon={<FaInfoCircle className="text-blue-400" />} />
            </div>

            {/* Cuarta fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Teléfono:" value={form.telefono} onChange={(v) => set('telefono', v)} icon={<FaPhone className="text-orange-400" />} />
              <FormField label="Dirección:" value={form.direccion} onChange={(v) => set('direccion', v)} icon={<FaMapMarkerAlt className="text-orange-400" />} />
              <FormField label="Sitio web:" value={form.sitioWeb} onChange={(v) => set('sitioWeb', v)} placeholder="Sitio web empresa" icon={<FaGlobe className="text-blue-400" />} />
            </div>

            {/* Quinta fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Actividad económica:" value={form.actividadEconomica} onChange={(v) => set('actividadEconomica', v)} options={actividadesEconomicas} icon={<FaInfoCircle className="text-orange-400" />} />
              <FormField label="Correo:" value={form.correo} onChange={(v) => set('correo', v)} type="email" icon={<FaEnvelope className="text-orange-400" />} />
            </div>

            {/* Toggle médico contratista */}
            <div className="flex items-center gap-4 py-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-12 h-6 rounded-full transition-colors ${form.consultaMedicoContratista ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${form.consultaMedicoContratista ? 'translate-x-6' : ''}`} />
                </div>
                <input
                  type="checkbox"
                  checked={form.consultaMedicoContratista}
                  onChange={(e) => set('consultaMedicoContratista', e.target.checked)}
                  className="hidden"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Consulta médico contratista</span>
              </label>
            </div>

            {/* Checkbox desbloquear diagnóstico */}
            <div className="flex items-start gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                id="desbloquearDiagnostico"
                checked={form.desbloquearDiagnostico}
                onChange={(e) => set('desbloquearDiagnostico', e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="desbloquearDiagnostico" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Desbloquear diagnóstico inicial para edición (Solo cuando ya he creado al menos un periodo)
              </label>
            </div>
          </div>
        )}

        {activeTab === 'personalizacion' && (
          <div className="p-12 text-center">
            <FaIdCard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Personalización</h3>
            <p className="text-gray-500 dark:text-gray-400">Configure los colores, logos y temas de su empresa</p>
            <div className="mt-6 flex justify-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-blue-500 cursor-pointer hover:ring-4 ring-blue-300 transition-all" />
              <div className="w-20 h-20 rounded-lg bg-green-500 cursor-pointer hover:ring-4 ring-green-300 transition-all" />
              <div className="w-20 h-20 rounded-lg bg-purple-500 cursor-pointer hover:ring-4 ring-purple-300 transition-all" />
              <div className="w-20 h-20 rounded-lg bg-orange-500 cursor-pointer hover:ring-4 ring-orange-300 transition-all" />
            </div>
          </div>
        )}

        {activeTab === 'politica' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Política de la Empresa</h3>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese la política de la empresa aquí..."
              defaultValue="Nuestra empresa se compromete a garantizar la seguridad y salud de todos sus trabajadores, mediante la implementación de un Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST) que cumpla con la normativa vigente y mejore continuamente."
            />
          </div>
        )}

        {activeTab === 'referencias' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Referencias Externas</h3>
            <div className="space-y-4">
              {['Norma ISO 45001', 'Decreto 1072 de 2015', 'Resolución 0312 de 2019', 'Ley 1562 de 2012'].map((ref, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">{ref}</span>
                  <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                    Ver documento →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-green-600 dark:text-green-400">✓ Cambios guardados</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <FaSave />
              Guardar
            </>
          )}
        </button>
      </div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  icon?: React.ReactNode
  required?: boolean
}

function FormField({ label, value, onChange, type = 'text', placeholder, icon, required }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  icon?: React.ReactNode
}

function SelectField({ label, value, onChange, options, icon }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {icon && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
