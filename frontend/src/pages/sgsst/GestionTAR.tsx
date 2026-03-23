import { FaCrosshairs } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function GestionTAR() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaCrosshairs />}
      title={t('sgsst.tar.title')}
      color="orange"
      mockData={true}
    />
  )
}
