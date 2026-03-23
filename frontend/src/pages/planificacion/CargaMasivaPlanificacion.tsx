import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { useTranslation } from '../../hooks/useTranslation'

interface PlanRow {
  idSede: string
  nitContratista: string
  cargo: string
  cantidad: number
  fechaInicio: string
  fechaFin: string
  valid: boolean
  error?: string
}

export default function CargaMasivaPlanificacion() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<PlanRow[]>([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)

        const parsed: PlanRow[] = json.map((row) => {
          const idSede = String(row['ID Sede'] ?? '')
          const nitContratista = String(row['NIT Contratista'] ?? '')
          const cargo = String(row['Cargo'] ?? '')
          const cantidad = Number(row['Cantidad'] ?? 0)
          const fechaInicio = String(row['Fecha Inicio'] ?? '')
          const fechaFin = String(row['Fecha Fin'] ?? '')

          let error = ''
          if (!idSede) error += 'ID Sede requerido. '
          if (!nitContratista) error += 'NIT Contratista requerido. '
          if (!cargo) error += 'Cargo requerido. '
          if (!cantidad || isNaN(cantidad)) error += 'Cantidad inválida. '
          if (!fechaInicio) error += 'Fecha Inicio requerida. '
          if (!fechaFin) error += 'Fecha Fin requerida. '

          return { idSede, nitContratista, cargo, cantidad, fechaInicio, fechaFin, valid: !error, error }
        })
        setRows(parsed)
      } catch {
        toast.error(t('errors.generic'))
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleUpload = () => {
    const valid = rows.filter((r) => r.valid)
    if (valid.length === 0) {
      toast.error(t('common.noResults'))
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success(t('success.uploaded'))
      navigate('/planificacion/cargos')
    }, 1000)
  }

  const validCount = rows.filter((r) => r.valid).length
  const errorCount = rows.filter((r) => !r.valid).length

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.planning.bulkUpload') + ' - ' + t('navigation.planning')}
        breadcrumbs={[
          { label: t('navigation.planning') },
          { label: t('modules.planning.bulkUpload') },
        ]}
      />

      {/* Upload Zone */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Archivo Excel</h2>
        <p className="text-xs text-gray-500 mb-4">
          El archivo debe tener las columnas:{' '}
          <span className="font-medium text-gray-700">
            ID Sede, NIT Contratista, Cargo, Cantidad, Fecha Inicio, Fecha Fin
          </span>
        </p>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {fileName ? (
            <p className="text-sm font-medium text-primary-600">{fileName}</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">{t('common.browse')}</p>
              <p className="text-xs text-gray-400 mt-1">Formatos soportados: .xlsx, .xls</p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-gray-700">
              {rows.length} registros leídos
            </span>
            {validCount > 0 && (
              <span className="text-sm text-green-600 font-medium">✓ {validCount} válidos</span>
            )}
            {errorCount > 0 && (
              <span className="text-sm text-red-600 font-medium">✗ {errorCount} con errores</span>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">#</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">ID Sede</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">NIT Contratista</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">Cargo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">Cantidad</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">Fecha Inicio</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">Fecha Fin</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{t('common.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className={row.valid ? '' : 'bg-red-50'}>
                    <td className="px-4 py-2 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 text-sm">{row.idSede}</td>
                    <td className="px-4 py-2 text-sm">{row.nitContratista}</td>
                    <td className="px-4 py-2 text-sm">{row.cargo}</td>
                    <td className="px-4 py-2 text-sm">{row.cantidad}</td>
                    <td className="px-4 py-2 text-sm">{row.fechaInicio}</td>
                    <td className="px-4 py-2 text-sm">{row.fechaFin}</td>
                    <td className="px-4 py-2 text-xs">
                      {row.valid ? (
                        <span className="text-green-600 font-medium">OK</span>
                      ) : (
                        <span className="text-red-600" title={row.error}>Error</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              className="btn-primary"
              onClick={handleUpload}
              disabled={loading || validCount === 0}
            >
              {loading ? t('common.loading') : t('common.bulkUpload') + ' ' + validCount}
            </button>
            <button className="btn-secondary" onClick={() => { setRows([]); setFileName('') }}>
              {t('common.clear')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
