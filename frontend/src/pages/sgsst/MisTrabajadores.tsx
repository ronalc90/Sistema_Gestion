import { FaUsers } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function MisTrabajadores() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaUsers />}
      title={t('sgsst.workers.title')}
      color="blue"
      mockData={true}
    />
  )
}
