import { useCallback } from 'react'
import { useLanguageStore } from '../stores/languageStore'
import es from '../i18n/es.json'
import en from '../i18n/en.json'

const translations = { es, en }

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore()
  const t = translations[language]

  const getNestedValue = useCallback((obj: any, path: string): string => {
    const keys = path.split('.')
    let result = obj
    for (const key of keys) {
      if (result === undefined || result === null) return path
      result = result[key]
    }
    return typeof result === 'string' ? result : path
  }, [])

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = getNestedValue(t, key)
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{{${k}}}`, String(v))
        })
      }
      return text
    },
    [t, getNestedValue]
  )

  // Helper para traducir enums
  const translateEnum = useCallback(
    (enumType: string, value: string): string => {
      const key = `enums.${enumType}.${value}`
      const translated = getNestedValue(t, key)
      return translated !== key ? translated : value
    },
    [t, getNestedValue]
  )

  return {
    t: translate,
    te: translateEnum,
    language,
    setLanguage,
    languages: [
      { code: 'es' as const, label: 'Español' },
      { code: 'en' as const, label: 'English' },
    ],
  }
}
