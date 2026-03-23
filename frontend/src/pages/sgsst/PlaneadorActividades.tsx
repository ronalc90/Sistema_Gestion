import { FaCalendar } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function PlaneadorActividades() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaCalendar />}
      title={t('sgsst.activityPlanner.title')}
      color="green"
      mockData={true}
    />
  )
}
