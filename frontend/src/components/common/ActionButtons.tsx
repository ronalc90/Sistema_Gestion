import { useTranslation } from '../../hooks/useTranslation'

interface ActionButtonsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export default function ActionButtons({ onView, onEdit, onDelete }: ActionButtonsProps) {
  const { t } = useTranslation()

  const handleClick = (e: React.MouseEvent, callback?: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    callback?.()
  }

  return (
    <div className="flex items-center gap-1">
      {onView && (
        <button
          type="button"
          onClick={(e) => handleClick(e, onView)}
          title={t('common.view')}
          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={(e) => handleClick(e, onEdit)}
          title={t('common.edit')}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => handleClick(e, onDelete)}
          title={t('common.delete')}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  )
}
