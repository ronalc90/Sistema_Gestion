import { FaUnlockAlt } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function ControlesAcceso() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaUnlockAlt />}
      title={t('sgsst.accessControl.title')}
      color="green"
      mockData={true}
    />
  )
}
