import { FaUserTimes } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function ReporteAusentismos() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaUserTimes />}
      title={t('sgsst.absenteeism.title')}
      color="yellow"
      mockData={true}
    />
  )
}
