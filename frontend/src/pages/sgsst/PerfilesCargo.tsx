import { FaSlideshare } from 'react-icons/fa'
import SgsstPage from './SgsstPage'
import { useTranslation } from '../../hooks/useTranslation'

export default function PerfilesCargo() {
  const { t } = useTranslation()
  return (
    <SgsstPage
      icon={<FaSlideshare />}
      title={t('sgsst.jobProfiles.title')}
      color="purple"
      mockData={true}
    />
  )
}
