import { release } from 'os'
import { app, BrowserWindow } from 'electron'
import { getPathByPublic } from './path'
import { getLog } from './log'
import { isRunning, onProxyStatusChange } from './proxy'

const log = getLog('app')

let appQuitting = false

const getImage = () => getPathByPublic(isRunning() ? 'proxy-open.png' : 'favicon.png')

export default () => {
  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) app.disableHardwareAcceleration()

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName())

  if (!app.requestSingleInstanceLock()) {
    log.warn('only allow one instance to run, app is quiting.')
    app.quit()
    process.exit(0)
  }

  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  if (process.platform === 'darwin') {
    app.dock.setIcon(getImage())
    onProxyStatusChange(() => {
      app.dock.setIcon(getImage())
    })
  }

  app.on('before-quit', function () {
    appQuitting = true
    log.warn('App quited.')
  })

  app.on('window-all-closed', () => {
    log.debug('window-all-closed')
  })

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    allWindows[0].show()
  })

  return app.whenReady()
}

export const isAppQuitting = () => {
  return appQuitting
}
