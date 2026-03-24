import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { planificacionesCargosApi } from '../../api/planificacionesCargos.api'

interface PlanRow {
  nombreSede: string
  nitContratista: string
  cargo: string
  cantidad: number
  fechaInicio: string
  fechaFin: string
  valid: boolean
  error?: string
}

function downloadEjemplo() {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([
    ['Sede', 'NIT Contratista', 'Cargo', 'Cantidad', 'Fecha Inicio', 'Fecha Fin'],
    ['Sede Principal', '900123456', 'Operario', 5, '2026-01-01', '2026-06-30'],
    ['Sede Norte', '800987654', 'Supervisor', 2, '2026-02-01', '2026-12-31'],
  ])
  XLSX.utils.book_append_sheet(wb, ws, 'Planificacion')
  XLSX.writeFile(wb, 'planificacion-ejemplo.xlsx')
}

export default function CargaMasivaPlanificacion() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<PlanRow[]>([])
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const processFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Solo se permiten archivos .xlsx o .xls')
      return
    }
    setFileName(file.name)
    setConfirmed(false)
    setRows([])

    const reader = new FileReader()

    reader.onerror = () => toast.error('No se pudo leer el archivo')

    reader.onload = (ev) => {
      try {
        const result = ev.target?.result
        if (!result) {
          toast.error('El archivo está vacío o no se pudo leer')
          return
        }
        const data = new Uint8Array(result as ArrayBuffer)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { raw: false, defval: '' })

        if (json.length === 0) {
          toast.error('El archivo no contiene filas de datos')
          return
        }

        const parsed: PlanRow[] = json.map((row) => {
          const nombreSede = String(row['Sede'] ?? '').trim()
          const nitContratista = String(row['NIT Contratista'] ?? '').trim()
          const cargo = String(row['Cargo'] ?? '').trim()
          const cantidadRaw = String(row['Cantidad'] ?? '').trim()
          const cantidad = Number(cantidadRaw)
          const fechaInicio = String(row['Fecha Inicio'] ?? '').trim()
          const fechaFin = String(row['Fecha Fin'] ?? '').trim()

          let error = ''
          if (!nombreSede) error += 'Sede requerida. '
          if (!nitContratista) error += 'NIT Contratista requerido. '
          if (!cargo) error += 'Cargo requerido. '
          if (!cantidadRaw || isNaN(cantidad) || cantidad <= 0) error += 'Cantidad inválida. '
          if (!fechaInicio) error += 'Fecha Inicio requerida. '
          if (!fechaFin) error += 'Fecha Fin requerida. '

          return { nombreSede, nitContratista, cargo, cantidad, fechaInicio, fechaFin, valid: !error, error: error.trim() }
        })

        setRows(parsed)
      } catch (err) {
        console.error('Error al parsear el archivo:', err)
        toast.error('Error al procesar el archivo Excel')
      }
    }

    reader.readAsArrayBuffer(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleUpload = async () => {
    const valid = rows.filter((r) => r.valid)
    if (valid.length === 0) {
      toast.error('No hay filas válidas para importar')
      return
    }
    setLoading(true)
    try {
      const res = await planificacionesCargosApi.bulkCreate(
        valid.map((r) => ({
          nombreSede: r.nombreSede,
          nitContratista: r.nitContratista,
          cargo: r.cargo,
          cantidad: r.cantidad,
          fechaInicio: r.fechaInicio,
          fechaFin: r.fechaFin,
        }))
      )
      const { created, errors } = res.data.data as { created: number; errors: { fila: number; error: string }[] }
      if (created > 0) toast.success(`${created} registros importados exitosamente`)
      if (errors.length > 0)
        toast.error(`${errors.length} fila(s) con errores del servidor`)
      if (created > 0) navigate('/planificacion/cargos')
    } catch {
      toast.error('Error al importar los registros')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setRows([])
    setFileName('')
    setConfirmed(false)
  }

  const validCount = rows.filter((r) => r.valid).length
  const errorCount = rows.filter((r) => !r.valid).length

  return (
    <div className="p-6">
      <PageHeader
        title="Carga Masiva - Planificación"
        breadcrumbs={[
          { label: 'Planificación' },
          { label: 'Cargos', path: '/planificacion/cargos' },
          { label: 'Carga Masiva' },
        ]}
      />

      {/* Upload zone */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-2 mb-1">
          <span className="text-sm font-medium text-gray-700">Selecciona un documento.</span>
          <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <p className="text-sm text-gray-400 mb-3">{fileName || 'Sin archivos seleccionados'}</p>

        <button
          type="button"
          className="text-sm text-primary-600 hover:underline mb-4 block"
          onClick={downloadEjemplo}
        >
          Descargar archivo de ejemplo.
        </button>

        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragging ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <svg
            className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-primary-400' : 'text-gray-300'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {dragging ? (
            <p className="text-sm font-medium text-primary-600">Suelta el archivo aquí</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">Arrastra un archivo aquí</p>
              <p className="text-xs text-gray-400 mt-1">Formatos soportados: .xlsx, .xls</p>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileInput}
        />

        <button
          type="button"
          className="btn-secondary mt-4"
          onClick={() => fileRef.current?.click()}
        >
          Seleccionar un documento.
        </button>
      </div>

      {/* Preview */}
      {rows.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{rows.length} registros leídos</span>
              {validCount > 0 && <span className="text-sm text-green-600 font-medium">✓ {validCount} válidos</span>}
              {errorCount > 0 && <span className="text-sm text-red-600 font-medium">✗ {errorCount} con errores</span>}
            </div>
            <button className="text-xs text-gray-400 hover:text-gray-600 underline" onClick={reset}>
              Limpiar
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sede</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NIT Contratista</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cargo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha Inicio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fecha Fin</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className={row.valid ? '' : 'bg-red-50'}>
                    <td className="px-4 py-2 text-xs text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2">{row.nombreSede}</td>
                    <td className="px-4 py-2">{row.nitContratista}</td>
                    <td className="px-4 py-2">{row.cargo}</td>
                    <td className="px-4 py-2">{row.cantidad}</td>
                    <td className="px-4 py-2">{row.fechaInicio}</td>
                    <td className="px-4 py-2">{row.fechaFin}</td>
                    <td className="px-4 py-2 text-xs">
                      {row.valid ? (
                        <span className="text-green-600 font-medium">OK</span>
                      ) : (
                        <span className="text-red-500" title={row.error}>Error</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirmation */}
          {!confirmed ? (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <p className="text-sm text-amber-700 flex-1">
                Se importarán <strong>{validCount}</strong> registro(s) a la base de datos. Esta acción no se puede deshacer.
              </p>
              <button
                className="btn-primary whitespace-nowrap"
                onClick={() => setConfirmed(true)}
                disabled={validCount === 0}
              >
                Confirmar importación
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700 flex-1">
                Listo para importar <strong>{validCount}</strong> registro(s).
              </p>
              <div className="flex gap-2">
                <button className="btn-secondary text-sm" onClick={() => setConfirmed(false)}>
                  Cancelar
                </button>
                <button
                  className="btn-primary text-sm whitespace-nowrap"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? 'Importando...' : 'Subir registros'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
