import { FaListAlt } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function BateriaPsicosocial() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaListAlt />}
      title={t('sgsst.psychosocial.title')}
      color="purple"
      mockData={true}
    />
  )
}
