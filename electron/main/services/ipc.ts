import { app, ipcMain, BrowserWindow, shell } from 'electron'
import { start, stop, isRunning, onProxyStatusChange } from './proxy'
import { getWin, skipSaveBounds } from './win'
import { getStore, onStoreChange } from './store'
import { getLogFilePath } from './log'

const invoke = {
  getVersions() {
    return {
      app: app.getVersion(),
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
    }
  },
  toggleDevTools() {
    const win = BrowserWindow.getFocusedWindow()
    win.webContents.toggleDevTools()
  },
  openLogFile() {
    shell.showItemInFolder(getLogFilePath())
  },
  resetUserData() {
    skipSaveBounds()
    getStore().clear()
    app.quit()
  },
  getConfig(_e, key, defaultValue) {
    return getStore().get(key, defaultValue)
  },
  setConfig(_e, key, newValue) {
    const store = getStore()
    const oldValue = getStore().get(key)

    let v = newValue
    if (typeof oldValue === 'object') {
      v = {
        ...oldValue,
        ...newValue,
      }
    }
    store.set(key, v)
  },
  startProxy() {
    return start()
  },
  stopProxy() {
    return stop()
  },
  proxyIsRunning() {
    return isRunning()
  },
}

const ons = {
  onProxyStatusChange,
  onStoreChange,
}

export default () => {
  for (const [k, v] of Object.entries(invoke)) {
    ipcMain.handle(k, v)
  }

  for (const [name, func] of Object.entries(ons)) {
    func((...args: any[]) => {
      getWin().webContents.send(name, ...args)
    })
  }
}
