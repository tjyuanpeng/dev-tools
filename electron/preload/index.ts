import { contextBridge, ipcRenderer } from 'electron'
import './app-loading'

const invoke = [
  'getVersions',
  'toggleDevTools',
  'openLogFile',
  'resetUserData',
  'getConfig',
  'setConfig',
  'startProxy',
  'stopProxy',
  'proxyIsRunning',
]

const ons = ['onProxyStatusChange', 'onStoreChange', '__ELECTRON_LOG_IPC_default__']

const createExports = () => {
  const exports = {}
  for (const name of invoke) {
    exports[name] = (...args) => ipcRenderer.invoke(name, ...args)
  }
  for (const name of ons) {
    exports[name] = callback => ipcRenderer.on(name, callback)
  }
  return exports
}

contextBridge.exposeInMainWorld('electronAPI', createExports())
