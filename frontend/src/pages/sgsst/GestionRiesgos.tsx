import { FaChartArea } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function GestionRiesgos() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaChartArea />}
      title={t('sgsst.riskManagement.title')}
      color="orange"
      mockData={true}
    />
  )
}
