import { FaSearch } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function InspeccionesSeguridad() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaSearch />}
      title={t('sgsst.inspections.title')}
      color="blue"
      mockData={true}
    />
  )
}
