import { FaThumbtack } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function MatrizMejora() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaThumbtack />}
      title={t('sgsst.improvement.title')}
      color="teal"
      mockData={true}
    />
  )
}
