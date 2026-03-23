import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { dashboardApi, DashboardStats } from '../../api/dashboard.api'

const ACCESOS_RAPIDOS = [
  { label: 'Sedes', path: '/sedes', color: 'bg-emerald-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { label: 'Empleados', path: '/empleados', color: 'bg-blue-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: 'Contratistas', path: '/contratistas', color: 'bg-violet-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Visitantes', path: '/visitantes', color: 'bg-amber-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { label: 'Planificación', path: '/planificacion/cargos', color: 'bg-cyan-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  { label: 'Documentos', path: '/documentos', color: 'bg-rose-500', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
]

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default function Inicio() {
  const user = useAuthStore((s) => s.user)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'
  const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* Header saludo */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {saludo}, {user?.nombre?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-0.5 capitalize">{fechaHoy}</p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Empleados activos" value={stats.empleados.activos} sub={`${stats.empleados.total} en total`} color="text-blue-600" />
          <StatCard label="Sedes activas" value={stats.sedes.activas} sub={`${stats.sedes.total} en total`} color="text-emerald-600" />
          <StatCard label="Contratistas" value={stats.contratistas.activos} sub={`${stats.contratistas.total} en total`} color="text-violet-600" />
          <StatCard label="Visitantes hoy" value={stats.visitantes.hoy} sub={`${stats.visitantes.enSitio} en sitio ahora`} color="text-amber-600" />
          <StatCard label="Planif. hoy" value={stats.planificaciones.hoy} sub={`${stats.planificaciones.pendientes} pendientes`} color="text-cyan-600" />
        </div>
      ) : null}

      {/* Accesos rápidos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Accesos rápidos</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ACCESOS_RAPIDOS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-2 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`${item.color} text-white rounded-lg p-2.5 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium text-gray-600 text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Distribución empleados por contratista */}
      {stats && stats.empleados.porContratista.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Empleados por contratista</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
            {stats.empleados.porContratista
              .sort((a, b) => b.cantidad - a.cantidad)
              .slice(0, 6)
              .map((item) => {
                const pct = stats.empleados.total > 0 ? Math.round((item.cantidad / stats.empleados.total) * 100) : 0
                return (
                  <div key={item.contratista} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-36 truncate shrink-0">{item.contratista}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">{item.cantidad}</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

    </div>
  )
}
