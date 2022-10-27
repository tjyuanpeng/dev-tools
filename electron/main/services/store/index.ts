import { app } from 'electron'
import Store from 'electron-store'
import { EventEmitter } from 'events'
import { getPathByRoot } from '../path'
import configDefaults from './config-defaults'
import { getLog } from '../log'

const log = getLog('app')
const storeEmitter = new EventEmitter()
let store = null

export default () => {
  store = new Store({
    defaults: configDefaults,
    cwd: app.isPackaged ? app.getPath('userData') : getPathByRoot('../'),
  })

  store.onDidAnyChange((newValue, oldValue) => {
    storeEmitter.emit('change', newValue, oldValue)
  })

  console.log(`config file path: [${store.path}]`)
}

export const getStore = () => store

export const onStoreChange = callback => storeEmitter.on('change', callback)
