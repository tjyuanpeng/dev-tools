import { defineStore } from 'pinia'

export const useProxyStore = defineStore('proxyStore', {
  state: () => ({
    isRunning: false,
  }),
  actions: {
    async $init() {
      const state = await window.electronAPI.proxyIsRunning()
      this.isRunning = state

      window.electronAPI.onProxyStatusChange((_event: any, state: any) => {
        this.isRunning = state
      })
    },
    async start() {
      await window.electronAPI.startProxy()
    },
    async stop() {
      await window.electronAPI.stopProxy()
    },
  },
})
