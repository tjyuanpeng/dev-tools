import { toRaw } from 'vue'
import { defineStore } from 'pinia'
import { useConfigStore } from '@/store/config.store'
import { useRulesStore } from '@/views/rules/rules.store'

export const useOptionsStore = defineStore('optionsStore', {
  state: () => ({
    port: 8000,
    notification: false,
    env: [] as EnvItem[],
  }),
  actions: {
    async $init() {
      await this.load()
    },
    async load() {
      const config = await window.electronAPI.getConfig()
      this.$patch({
        port: config.proxy.port,
        notification: config.notification,
        env: config.proxy.env,
      })
      this.$resetDiffState()
    },
    getEnv(key: string) {
      const found = this.env.find(item => item.key === key)
      if (!found) {
        throw new Error(`the env with key:${key} was not found!`)
      }
      return found
    },
    add() {
      this.env.push({} as EnvItem)
    },
    remove(index: number) {
      this.env.splice(index, 1)
      if (this.env.length === 0) {
        this.add()
      }
    },
    async save() {
      const { defaultRule, rules } = this.getFixedRules()
      await window.electronAPI.setConfig('proxy', {
        port: this.port,
        env: toRaw(this.env),
        defaultRule,
        rules,
      })
      await window.electronAPI.setConfig('notification', this.notification)
      this.$resetDiffState()

      const rulesStore = useRulesStore()
      await rulesStore.$init()
    },
    getFixedRules() {
      const configStore = useConfigStore()

      const defaultRule = toRaw(configStore.proxy.defaultRule)
      const rules = toRaw(configStore.proxy.rules)

      if (defaultRule.env !== 'custom') {
        const key = defaultRule.env
        const oldValue = configStore.getEnv(key).value
        const newValue = this.getEnv(key).value
        if (oldValue !== newValue) {
          defaultRule.to = configStore.createUrl(defaultRule.envPath || '', newValue)
        }
      }

      for (const rule of rules) {
        const key = rule.env
        if (key === 'custom') {
          continue
        }
        const oldValue = configStore.getEnv(key).value
        const newValue = this.getEnv(key).value
        if (oldValue !== newValue) {
          rule.to = configStore.createUrl(rule.envPath || '', newValue)
        }
      }

      return { defaultRule, rules }
    },
  },
  detectHasChange: true,
})
