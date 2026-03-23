import { FaExclamationTriangle } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function ActosCondicionesInseguras() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaExclamationTriangle />}
      title={t('sgsst.unsafeConditions.title')}
      color="red"
      mockData={true}
    />
  )
}
