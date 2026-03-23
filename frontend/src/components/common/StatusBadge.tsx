import { useTranslation } from '../../hooks/useTranslation'

interface StatusBadgeProps {
  active: boolean
  activeLabel?: string
  inactiveLabel?: string
}

export default function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: StatusBadgeProps) {
  const { t } = useTranslation()
  return (
    <span className={active ? 'text-green-700 font-medium' : 'text-gray-400'}>
      {active ? (activeLabel ?? t('common.active')) : (inactiveLabel ?? t('common.inactive'))}
    </span>
  )
}
