import hotkeys from 'hotkeys-js'

export default () => {
  hotkeys.filter = function () {
    return true
  }
  hotkeys('ctrl+shift+i', () => {
    window.electronAPI.toggleDevTools()
  })
}
