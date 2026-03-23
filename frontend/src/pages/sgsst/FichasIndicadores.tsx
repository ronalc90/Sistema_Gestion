import { FaTasks } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function FichasIndicadores() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaTasks />}
      title={t('sgsst.indicators.title')}
      color="teal"
      mockData={true}
    />
  )
}
