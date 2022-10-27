import { app, Menu, Tray } from 'electron'
import { getPathByPublic } from './path'
import { getWin } from './win'
import { start, stop, isRunning, onProxyStatusChange } from './proxy'

let tray = null

const getImage = state => getPathByPublic(state ? '/dock/proxy-open.png' : '/dock/favicon.png')

export default () => {
  const proxyIsRunning = isRunning()

  tray = new Tray(getImage(proxyIsRunning))

  const menu = Menu.buildFromTemplate([
    {
      label: '打开窗口',
      click: () => {
        getWin().show()
      },
    },
    { type: 'separator' },
    {
      id: 'start-proxy',
      label: '启动代理服务',
      enabled: !proxyIsRunning,
      click: () => {
        start()
      },
    },
    {
      id: 'stop-proxy',
      label: '停止代理服务',
      enabled: proxyIsRunning,
      click: () => {
        stop()
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setContextMenu(menu)
  tray.setToolTip('ServiceForce Develop Tool')

  tray.on('click', () => {
    if (process.platform !== 'darwin') {
      getWin().show()
    }
  })

  onProxyStatusChange(state => {
    menu.getMenuItemById('start-proxy').enabled = !state
    menu.getMenuItemById('stop-proxy').enabled = state
    tray.setImage(getImage(state))
  })
}

export const getTray = () => tray
