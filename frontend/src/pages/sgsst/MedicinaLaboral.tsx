import { FaUserMd } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function MedicinaLaboral() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaUserMd />}
      title={t('sgsst.occupationalHealth.title')}
      color="green"
      mockData={true}
    />
  )
}
