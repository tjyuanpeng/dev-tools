import { defineStore } from 'pinia'

export const useConfigStore = defineStore('configStore', {
  state: () => ({
    notification: false,
    proxy: {
      port: 0,
      rules: [] as Rule[],
      defaultRule: {} as DefaultRule,
      env: [] as EnvItem[],
    },
  }),
  actions: {
    async $init() {
      const value = await window.electronAPI.getConfig()
      this.$patch({
        ...value,
      })
      window.electronAPI.onStoreChange((_event: any, newValue: any) => {
        this.$patch({
          ...newValue,
        })
      })
    },
    getEnv(key: string) {
      const found = this.proxy.env.find(item => item.key === key)
      if (!found) {
        throw new Error(`the env with key:${key} was not found!`)
      }
      return found
    },
    createUrl(url: string, base: string) {
      try {
        return new URL(url, base).toString()
      } catch (_e) {
        console.error(_e)
        return ''
      }
    },
  },
})
