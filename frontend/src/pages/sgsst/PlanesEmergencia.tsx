import { FaBullhorn } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function PlanesEmergencia() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaBullhorn />}
      title={t('sgsst.emergency.title')}
      color="red"
      mockData={true}
    />
  )
}
