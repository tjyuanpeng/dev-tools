import 'element-plus/dist/index.css'
import '@/common/js-sdk-pro.min.js'

import { createApp } from 'vue'
import initHotkeys from './common/hotkeys'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import router from './router'
import App from './components/App.vue'
import LayoutNormal from '@/components/layout/normal.vue'
import PiniaPluginDetectChange from '@/common/pinia-plugin-detect-change'
import PiniaPluginAsyncInit from '@/common/pinia-plugin-async-init'
import { useLogsStore } from '@/views/logs/logs.store'

async function start() {
  const app = createApp(App)

  // components
  app.use(ElementPlus)
  app.component('layout-normal', LayoutNormal)

  // router
  app.use(router)

  // store
  const pinia = createPinia()
  pinia.use(PiniaPluginDetectChange)
  pinia.use(PiniaPluginAsyncInit)
  app.use(pinia)

  // hotkeys
  initHotkeys()

  // here is initializing log store to show logs, not depend on logs page init.
  useLogsStore()

  await app.mount('#app').$nextTick()
  postMessage({ payload: 'removeLoading' }, '*')
}

start()
