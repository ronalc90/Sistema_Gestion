import Modal from './Modal'
import { useTranslation } from '../../hooks/useTranslation'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmModalProps) {
  const { t } = useTranslation()
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? t('common.confirmDelete')}
      size="sm"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            {t('common.delete')}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message ?? t('common.deleteWarning')}</p>
    </Modal>
  )
}
