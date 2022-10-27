import { Notification } from 'electron'
import { getPathByPublic } from './path'
import { getStore } from './store'

let enable = true
export const showNotice = options => {
  const notice = new Notification({
    icon: getPathByPublic('favicon.png'),
    ...options,
  })
  if (enable) {
    notice.show()
  }
  return notice
}

export default () => {
  const store = getStore()
  store.onDidChange('notification', newValue => {
    enable = newValue
  })
}
