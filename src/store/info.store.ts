import { defineStore } from 'pinia'

export const useInfoStore = defineStore('infoStore', {
  state: () => ({
    isMac: navigator.userAgentData?.platform.toLowerCase().indexOf('macos') !== -1,
    isWin: navigator.userAgentData?.platform.toLowerCase().indexOf('windows') !== -1,
    versions: {
      mode: import.meta.env.MODE,
      app: '',
      node: '',
      chrome: '',
      electron: '',
    },
  }),
  actions: {
    async $init() {
      const versions = await window.electronAPI.getVersions()
      this.$patch({
        versions,
      })
    },
  },
})
