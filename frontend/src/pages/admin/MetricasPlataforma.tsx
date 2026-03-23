import { useState, useEffect } from 'react'
import { usersApi } from '../../api/users.api'
import toast from 'react-hot-toast'

interface Metrics {
  resumen: {
    totalUsuarios: number
    loginsHoy: number
    loginsMes: number
  }
  usuariosPorRol: { rol: string; cantidad: number }[]
  usuariosPorEstado: { estado: string; cantidad: number }[]
  loginsPorDia: { dia: string; logins: number }[]
  nuevosUsuariosPorDia: { dia: string; nuevos: number }[]
  actividadReciente: {
    id: string
    accion: string
    usuario: string
    email: string
    rol: string
    fecha: string
    ip: string | null
  }[]
}

const ROL_LABELS: Record<string, string> = {
  ADMIN_TOTAL: 'Super Admin',
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  USUARIO: 'Usuario',
}

const ACCION_LABELS: Record<string, { label: string; color: string }> = {
  LOGIN: { label: 'Inicio de sesión', color: 'bg-green-100 text-green-800' },
  LOGOUT: { label: 'Cierre de sesión', color: 'bg-gray-100 text-gray-700' },
  CREAR_USUARIO: { label: 'Creó usuario', color: 'bg-blue-100 text-blue-800' },
  EDITAR_USUARIO: { label: 'Editó usuario', color: 'bg-yellow-100 text-yellow-800' },
  ELIMINAR_USUARIO: { label: 'Eliminó usuario', color: 'bg-red-100 text-red-800' },
  CAMBIAR_PASSWORD: { label: 'Cambió contraseña', color: 'bg-purple-100 text-purple-800' },
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString('es-CO')}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

function SimpleBarChart({ data, dataKey, labelKey, label }: {
  data: Record<string, unknown>[]
  dataKey: string
  labelKey: string
  label: string
}) {
  if (!data.length) return <p className="text-sm text-gray-400 text-center py-4">Sin datos</p>
  const max = Math.max(...data.map((d) => d[dataKey] as number), 1)
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 text-xs w-20 shrink-0 truncate">{String(item[labelKey])}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.round(((item[dataKey] as number) / max) * 100)}%` }}
            />
          </div>
          <span className="text-gray-700 font-medium w-8 text-right">{item[dataKey] as number}</span>
        </div>
      ))}
      <p className="text-xs text-gray-400 pt-1">{label}</p>
    </div>
  )
}

export default function MetricasPlataforma() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchMetrics = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await usersApi.getMetrics()
      setMetrics(res.data)
    } catch {
      toast.error('Error al cargar métricas')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    // Auto-refresh every 30s
    const interval = setInterval(() => fetchMetrics(true), 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Métricas de Plataforma</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitoreo de uso en tiempo real</p>
        </div>
        <button
          onClick={() => fetchMetrics(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 disabled:opacity-60"
        >
          <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Usuarios registrados"
          value={metrics.resumen.totalUsuarios}
          color="bg-primary-50 text-primary-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Inicios de sesión hoy"
          value={metrics.resumen.loginsHoy}
          color="bg-green-50 text-green-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          }
        />
        <StatCard
          label="Inicios de sesión este mes"
          value={metrics.resumen.loginsMes}
          color="bg-blue-50 text-blue-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Logins por día */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Inicios de sesión — Últimos 7 días</h3>
          <SimpleBarChart
            data={metrics.loginsPorDia}
            dataKey="logins"
            labelKey="dia"
            label="Logins por día"
          />
        </div>

        {/* Usuarios por rol */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Usuarios por rol</h3>
          <div className="space-y-3">
            {metrics.usuariosPorRol.map((item) => (
              <div key={item.rol} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{ROL_LABELS[item.rol] || item.rol}</span>
                <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {item.cantidad}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Por estado</h4>
            <div className="space-y-2">
              {metrics.usuariosPorEstado.map((item) => (
                <div key={item.estado} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.estado}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.cantidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Actividad reciente</h3>
        </div>
        {metrics.actividadReciente.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Sin actividad registrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Acción</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Usuario</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Rol</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">IP</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {metrics.actividadReciente.map((log) => {
                  const accion = ACCION_LABELS[log.accion] || { label: log.accion, color: 'bg-gray-100 text-gray-700' }
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${accion.color}`}>
                          {accion.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-900">{log.usuario}</p>
                        <p className="text-xs text-gray-400">{log.email}</p>
                      </td>
                      <td className="px-4 py-2.5 text-gray-600">{ROL_LABELS[log.rol] || log.rol}</td>
                      <td className="px-4 py-2.5 text-gray-500 font-mono text-xs">{log.ip || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(log.fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
