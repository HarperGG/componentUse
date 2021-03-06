import { withInstall } from '@/utils'
import basicModal from './src/BasicModal'

export const BasicModal = withInstall(basicModal)
export { useModalContext } from './src/hooks/useModalContext'
export { useModalInner, useModal } from './src/hooks/useModal'
