import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { useTranslation } from '../../hooks/useTranslation'

interface EmpRow {
  tipoId: string
  numeroId: string
  nombres: string
  apellidos: string
  cargo: string
  sedeId: string
  valid: boolean
  error?: string
}

export default function CargaMasiva() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<EmpRow[]>([])
  const [fileName, setFileName] = useState('')

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
        const parsed: EmpRow[] = json.map((row) => {
          const tipoId = String(row['Tipo ID'] ?? row['TipoID'] ?? 'CC')
          const numeroId = String(row['N° ID'] ?? row['Numero ID'] ?? row['NumeroId'] ?? '')
          const nombres = String(row['Nombres'] ?? '')
          const apellidos = String(row['Apellidos'] ?? '')
          const cargo = String(row['Cargo'] ?? '')
          const sedeId = String(row['ID Sede'] ?? row['Sede'] ?? '')
          let error = ''
          if (!numeroId) error += 'N° ID requerido. '
          if (!nombres) error += 'Nombres requerido. '
          if (!apellidos) error += 'Apellidos requerido. '
          if (!cargo) error += 'Cargo requerido. '
          return { tipoId, numeroId, nombres, apellidos, cargo, sedeId, valid: !error, error }
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
    if (!valid.length) { toast.error(t('common.noResults')); return }
    setTimeout(() => {
      toast.success(t('success.uploaded'))
      navigate('/empleados')
    }, 800)
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([['Tipo ID', 'N° ID', 'Nombres', 'Apellidos', 'Cargo', 'ID Sede']])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Empleados')
    XLSX.writeFile(wb, 'plantilla_empleados.xlsx')
  }

  const validCount = rows.filter((r) => r.valid).length
  const errorCount = rows.filter((r) => !r.valid).length

  return (
    <div className="p-6">
      <PageHeader
        title={t('modules.employees.bulkUpload') + ' - ' + t('navigation.employees')}
        breadcrumbs={[
          { label: t('navigation.employees'), path: '/empleados' },
          { label: t('modules.employees.bulkUpload') },
        ]}
      />

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Archivo Excel</h2>
            <p className="text-xs text-gray-500 mt-1">
              Columnas requeridas: <span className="font-medium text-gray-700">Tipo ID, N° ID, Nombres, Apellidos, Cargo, ID Sede</span>
            </p>
          </div>
          <button className="btn-secondary text-xs" onClick={downloadTemplate}>
            {t('common.downloadTemplate')}
          </button>
        </div>

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
              <p className="text-xs text-gray-400 mt-1">.xlsx, .xls</p>
            </>
          )}
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-gray-700">{rows.length} registros</span>
            {validCount > 0 && <span className="text-sm text-green-600 font-medium">✓ {validCount} válidos</span>}
            {errorCount > 0 && <span className="text-sm text-red-600 font-medium">✗ {errorCount} errores</span>}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    '#',
                    t('modules.employees.idType'),
                    t('modules.employees.idNumber'),
                    t('modules.employees.firstName'),
                    t('modules.employees.lastName'),
                    t('common.position'),
                    'ID Sede',
                    t('common.status'),
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => (
                  <tr key={i} className={r.valid ? '' : 'bg-red-50'}>
                    <td className="px-4 py-2 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 text-sm">{r.tipoId}</td>
                    <td className="px-4 py-2 text-sm">{r.numeroId}</td>
                    <td className="px-4 py-2 text-sm">{r.nombres}</td>
                    <td className="px-4 py-2 text-sm">{r.apellidos}</td>
                    <td className="px-4 py-2 text-sm">{r.cargo}</td>
                    <td className="px-4 py-2 text-sm">{r.sedeId}</td>
                    <td className="px-4 py-2 text-xs">
                      {r.valid ? <span className="text-green-600">OK</span> : <span className="text-red-600" title={r.error}>Error</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary" onClick={handleUpload} disabled={validCount === 0}>
              {t('common.bulkUpload')} {validCount}
            </button>
            <button className="btn-secondary" onClick={() => { setRows([]); setFileName('') }}>{t('common.clear')}</button>
          </div>
        </>
      )}
    </div>
  )
}
