import { app, BrowserWindow, shell } from 'electron'
import { isAppQuitting } from './app'
import { getPathByPublic, getPathByRoot, getPathByPreLoad } from './path'
import { getStore } from './store'
import { isRunning, onProxyStatusChange } from './proxy'

let win: BrowserWindow | null = null

const getImage = state => getPathByPublic(state ? 'proxy-open.png' : 'favicon.png')

let SaveBoundsFlag = true

const saveBounds = () => SaveBoundsFlag && getStore().set('window', win.getBounds())

export default () => {
  const store = getStore()
  const bound = store.get('window', {})
  const proxyIsRunning = isRunning()

  win = new BrowserWindow({
    icon: getImage(proxyIsRunning),
    width: 1000,
    height: 800,
    ...bound,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      spellcheck: false,
      preload: getPathByPreLoad('index.js'),
    },
  })

  win.removeMenu()

  if (app.isPackaged) {
    win.loadFile(getPathByRoot('index.html'))
  } else {
    win.loadURL(
      `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
    )
    win.webContents.openDevTools({ mode: 'bottom' })
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  win.on('close', function (e) {
    saveBounds()
    if (isAppQuitting()) {
      return
    }
    e.preventDefault()
    win.hide()
  })

  win.on('session-end', function () {
    saveBounds()
  })

  onProxyStatusChange(state => {
    win.setIcon(getImage(state))
  })
}

export const getWin = () => win

export const skipSaveBounds = () => (SaveBoundsFlag = false)
