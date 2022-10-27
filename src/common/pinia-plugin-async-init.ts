import { PiniaPlugin } from 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $initComplete: Promise<void>
  }
}

const plugin: PiniaPlugin = ({ store }) => {
  if (typeof store.$init !== 'function') {
    return
  }
  store.$initComplete = Promise.resolve(store.$init())
}

export default plugin
