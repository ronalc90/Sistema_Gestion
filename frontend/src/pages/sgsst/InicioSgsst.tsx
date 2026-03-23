import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

/* ── tipos ─────────────────────────────────────────────────── */
interface KpiCard {
  label: string
  value: string | number
  sub?: string
  color: string
  bg: string
}

/* ── sub-componentes ───────────────────────────────────────── */
function FilterBar() {
  return (
    <div className="flex flex-wrap gap-3 items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filtros</span>
      </div>
      <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-400">
        <option>Nivel Nacional</option>
        <option>Regional Antioquia</option>
        <option>Regional Centro</option>
        <option>Regional Caribe</option>
        <option>Sedes Administrativas</option>
        <option>Obras</option>
        <option>Salas de Negocios</option>
      </select>
      <div className="flex items-center gap-2 flex-1 min-w-48">
        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar sede..."
          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>
    </div>
  )
}

function KpiCardComp({ card }: { card: KpiCard }) {
  return (
    <div className={`${card.bg} rounded-xl p-4 border border-white/60 shadow-sm`}>
      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
      <p className="text-xs font-semibold text-gray-700 mt-0.5">{card.label}</p>
      {card.sub && <p className="text-[11px] text-gray-500 mt-0.5">{card.sub}</p>}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <span className="text-primary-600">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/* ── mini gráfico SVG de operaciones ───────────────────────── */
function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const w = 100 / data.length
  return (
    <svg viewBox="0 0 100 40" className="w-full h-16">
      {data.map((v, i) => {
        const h = (v / max) * 36
        return (
          <rect
            key={i}
            x={i * w + w * 0.1}
            y={40 - h - 2}
            width={w * 0.8}
            height={h}
            rx="1.5"
            className="fill-primary-500"
            opacity={0.7 + (i / data.length) * 0.3}
          />
        )
      })}
    </svg>
  )
}

/* ── datos mock ─────────────────────────────────────────────── */
const kpisCumplimiento: KpiCard[] = [
  { label: 'Cumplimiento SG (PHVA)', value: '72%', sub: 'Planear·Hacer·Verificar·Actuar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Hallazgos abiertos', value: 14, sub: 'Matriz de mejora', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Prioridad alta', value: 3, sub: 'Requieren acción inmediata', color: 'text-red-600', bg: 'bg-red-50' },
]

const kpisAccidentalidad: KpiCard[] = [
  { label: 'Accidentes mes', value: 2, sub: '1 grave · 1 leve', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Investigaciones abiertas', value: 1, sub: 'En curso', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Casos de salud', value: 5, sub: 'Enf. laboral: 2 · Común: 3', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Ausentismo (días)', value: 18, sub: 'Este mes', color: 'text-violet-600', bg: 'bg-violet-50' },
]

const kpisRiesgos: KpiCard[] = [
  { label: 'Riesgos identificados', value: '1.240', sub: 'Biológicos · Químicos · Físicos…', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Riesgos latentes', value: 89, sub: 'Sin controles', color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Inspecciones realizadas', value: 34, sub: 'Extintores · Botiquines · Bioseg.', color: 'text-teal-600', bg: 'bg-teal-50' },
]

const kpisPersonal: KpiCard[] = [
  { label: 'Trabajadores activos', value: 348, sub: 'Internos', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Trabajadores inactivos', value: 12, sub: 'Internos', color: 'text-gray-500', bg: 'bg-gray-50' },
  { label: 'Contratistas activos', value: 76, sub: 'Riesgo alto: 8 · Medio: 22', color: 'text-violet-600', bg: 'bg-violet-50' },
]

const kpisLogistica: KpiCard[] = [
  { label: 'Aforo total sedes', value: '2.150', sub: 'Capacidad registrada', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { label: 'Vehículos registrados', value: 43, sub: 'Comparendos activos: 2', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Documentos digitales', value: 210, sub: 'Vencidos próximos: 7', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Batería psicosocial', value: '68%', sub: 'Aplicación completada', color: 'text-amber-600', bg: 'bg-amber-50' },
]

const operacionesData = [3, 7, 5, 12, 8, 15, 9, 11, 6, 14, 10, 13, 7, 16, 11, 9, 14, 18, 12, 15, 8, 11, 7, 13, 10, 17, 12, 9, 14, 11]

const topUsuarios = [
  { nombre: 'Carlos Restrepo', accesos: 42 },
  { nombre: 'Laura Gómez', accesos: 37 },
  { nombre: 'Andrés Martínez', accesos: 31 },
  { nombre: 'María Torres', accesos: 28 },
  { nombre: 'Juan Pérez', accesos: 19 },
]

/* ── página principal ──────────────────────────────────────── */
export default function InicioSgsst() {
  const user = useAuthStore((s) => s.user)
  const [period] = useState('mes')
  void period

  const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="p-5 space-y-5 max-w-screen-xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Panel de Mando — SGSST</h1>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{fechaHoy} · {user?.nombre}</p>
      </div>

      {/* Filtros */}
      <FilterBar />

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Columna izquierda + centro */}
        <div className="xl:col-span-2 space-y-5">

          {/* Cumplimiento */}
          <Section
            title="Cumplimiento y Gestión"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <div className="grid grid-cols-3 gap-3">
              {kpisCumplimiento.map((k) => <KpiCardComp key={k.label} card={k} />)}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Avance PHVA</span><span className="font-semibold text-emerald-600">72%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </Section>

          {/* Accidentalidad */}
          <Section
            title="Accidentalidad y Salud"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpisAccidentalidad.map((k) => <KpiCardComp key={k.label} card={k} />)}
            </div>
          </Section>

          {/* Riesgos */}
          <Section
            title="Operación Segura y Riesgos"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          >
            <div className="grid grid-cols-3 gap-3">
              {kpisRiesgos.map((k) => <KpiCardComp key={k.label} card={k} />)}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5">
              {[
                { label: 'Biológico', v: 210, color: 'bg-green-400' },
                { label: 'Biomecánico', v: 340, color: 'bg-blue-400' },
                { label: 'Químico', v: 180, color: 'bg-yellow-400' },
                { label: 'Físico', v: 290, color: 'bg-orange-400' },
                { label: 'Otros', v: 220, color: 'bg-purple-400' },
              ].map((r) => (
                <div key={r.label} className="text-center">
                  <div className="text-xs font-bold text-gray-700">{r.v}</div>
                  <div className={`${r.color} rounded h-1.5 my-1`} />
                  <div className="text-[10px] text-gray-500">{r.label}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Personal */}
          <Section
            title="Gestión de Personal"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {kpisPersonal.map((k) => <KpiCardComp key={k.label} card={k} />)}
            </div>
          </Section>

          {/* Logística */}
          <Section
            title="Logística y Operaciones"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {kpisLogistica.map((k) => <KpiCardComp key={k.label} card={k} />)}
            </div>
          </Section>

        </div>

        {/* Columna derecha — Actividad */}
        <div className="space-y-5">

          {/* Mis operaciones */}
          <Section
            title="Mis operaciones"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
          >
            <p className="text-xs text-gray-400 mb-2">Últimos 30 días · {user?.nombre?.split(' ')[0]}</p>
            <MiniBarChart data={operacionesData} />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Hace 30 días</span><span>Hoy</span>
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span className="text-gray-500">Total acciones</span>
              <span className="font-bold text-primary-600">{operacionesData.reduce((a, b) => a + b, 0)}</span>
            </div>
          </Section>

          {/* Accesos de usuarios */}
          <Section
            title="Accesos de usuarios"
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          >
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[{ label: 'Hoy', v: 12 }, { label: 'Semana', v: 38 }, { label: 'Mes', v: 95 }].map((i) => (
                <div key={i.label} className="bg-primary-50 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-primary-700">{i.v}</p>
                  <p className="text-[10px] text-gray-500">{i.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Mayor actividad</p>
            <div className="space-y-2">
              {topUsuarios.map((u, i) => (
                <div key={u.nombre} className="flex items-center gap-2">
                  <span className="text-[10px] w-4 text-gray-400 font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{u.nombre}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1 mt-0.5">
                      <div
                        className="bg-primary-500 h-1 rounded-full"
                        style={{ width: `${(u.accesos / topUsuarios[0].accesos) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 shrink-0">{u.accesos}</span>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
