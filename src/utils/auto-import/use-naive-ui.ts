import { NModal, createDiscreteApi } from 'naive-ui'
NModal.props.maskClosable = { type: Boolean, default: false }
export const {
  dialog: nDialog,
  loadingBar: nLoadingBar,
  message: nMessage,
  modal: nModal,
  notification: nNotification,
} = createDiscreteApi(['dialog', 'loadingBar', 'message', 'modal', 'notification'])
