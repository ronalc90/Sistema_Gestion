import { FaPen } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function AccionesCorrectivas() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaPen />}
      title={t('sgsst.correctiveActions.title')}
      color="orange"
      mockData={true}
    />
  )
}
