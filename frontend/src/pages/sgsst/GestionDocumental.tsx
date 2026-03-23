import { FaFolderOpen } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function GestionDocumental() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaFolderOpen />}
      title={t('sgsst.documentManagement.title')}
      color="blue"
      mockData={true}
    />
  )
}
