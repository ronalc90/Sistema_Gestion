import { FaHandshake } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function ContratistasSST() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaHandshake />}
      title={t('sgsst.contractors.title')}
      color="blue"
      mockData={true}
    />
  )
}
