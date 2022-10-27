import initApp from './services/app'
import initStore from './services/store'
import initIpc from './services/ipc'
import initTray from './services/tray'
import initWin from './services/win'
import initLog, { getLog } from './services/log'
import initProxy from './services/proxy'
import initNoitce from './services/notice'

async function start() {
  // base
  initLog()
  initStore()
  initNoitce()

  // app
  await initApp()
  initProxy()
  initIpc()

  // GUI
  initTray()
  initWin()

  getLog().info('App initialized.')
}

start()
