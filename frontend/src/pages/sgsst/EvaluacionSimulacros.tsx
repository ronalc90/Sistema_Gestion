import { FaBullseye } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function EvaluacionSimulacros() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaBullseye />}
      title={t('sgsst.drills.title')}
      color="yellow"
      mockData={true}
    />
  )
}
