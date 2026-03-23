import { FaCar } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function SeguridadVial() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaCar />}
      title={t('sgsst.roadSafety.title')}
      color="blue"
      mockData={true}
    />
  )
}
