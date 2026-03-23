import { FaFlask } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function GestionQuimicos() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaFlask />}
      title={t('sgsst.chemicals.title')}
      color="teal"
      mockData={true}
    />
  )
}
