import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useTranslation } from '../hooks/useTranslation'
import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa'
import { ParticleBackground } from '../components/effects/ParticleBackground'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const { theme, toggleTheme } = useThemeStore()
  const { t, language, setLanguage, languages } = useTranslation()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      toast.success(t('success.login'))
      navigate('/')
    } else {
      setError(t('auth.invalidCredentials'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden">
      {/* Animated Particle Background */}
      <ParticleBackground theme={theme} />
      
      {/* Decorative gradient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Settings Bar */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
          <FaGlobe className="text-gray-500 dark:text-gray-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
            className="bg-transparent text-gray-700 dark:text-gray-200 text-sm font-medium focus:outline-none cursor-pointer"
            aria-label={t('language.select')}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm rounded-full p-2 hover:scale-110 transition-transform duration-200"
          aria-label={t('theme.toggle')}
          title={theme === 'light' ? t('theme.dark') : t('theme.light')}
        >
          {theme === 'light' ? (
            <FaMoon className="w-5 h-5 text-gray-600" />
          ) : (
            <FaSun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-primary-500/30 dark:bg-primary-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative inline-flex items-center justify-center w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl shadow-xl shadow-primary-500/25">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {t('common.appName')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-200/50 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                {t('auth.email')}
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 hover:from-primary-500/5 hover:via-primary-500/5 hover:to-primary-500/5 transition-all duration-300 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 px-4 py-3 text-sm text-red-700 dark:text-red-400 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t('common.loading')}
                </span>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>

          {/* Credentials hint */}
          <div className="mt-6 pt-5 border-t border-gray-200/60 dark:border-gray-700/50">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-2">Credenciales de prueba</p>
            <div className="flex flex-col gap-1.5 text-center">
              <code className="text-xs bg-gray-100 dark:bg-gray-900/50 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 font-mono">
                admin@gmail.com / admin
              </code>
              <code className="text-xs bg-purple-100 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg text-purple-600 dark:text-purple-400 font-mono">
                admintotal@gmail.com / admin
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          © {new Date().getFullYear()} {t('common.appName')} — Todos los derechos reservados
        </p>
      </div>
    </div>
  )
}
