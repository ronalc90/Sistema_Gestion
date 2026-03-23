import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { useThemeStore } from '../../stores/themeStore'
import { useTranslation } from '../../hooks/useTranslation'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useThemeStore()
  const { t } = useTranslation()
  const location = useLocation()

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Initialize theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-target"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-gray-800 dark:text-white">{t('common.appName')}</span>
        </div>

        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
