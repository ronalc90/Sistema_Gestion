import { FaHeartbeat } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function ReporteAccidentes() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaHeartbeat />}
      title={t('sgsst.accidents.title')}
      color="red"
      mockData={true}
    />
  )
}
