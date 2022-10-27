import { toRaw, watch, WatchStopHandle } from 'vue'
import { defineStore } from 'pinia'
import { useConfigStore } from '@/store/config.store'

const watchers: WatchStopHandle[] = []

export const useRulesStore = defineStore('RulesStore', {
  state: () => ({
    rules: [] as Rule[],
    defaultRule: {} as DefaultRule,
    matchMode: [
      {
        name: '前缀匹配',
        value: 'prefix',
      },
      {
        name: '精确匹配',
        value: 'exact',
      },
      {
        name: '正则匹配',
        value: 'regexp',
      },
    ],
  }),
  actions: {
    async $init() {
      const value = await window.electronAPI.getConfig('proxy')
      this.$patch({
        rules: value.rules,
        defaultRule: value.defaultRule,
      })
      this.$resetDiffState()

      const configStore = useConfigStore()
      const resolveField = (item: Rule | DefaultRule) => {
        if (item.env === 'custom') {
          item.envPath = ''
          return
        }
        const env = configStore.getEnv(item.env)
        item.to = configStore.createUrl(item.envPath || '', env.value)
      }
      watchers.forEach(unwatch => unwatch())
      watchers.push(
        watch(this.defaultRule, item => {
          resolveField(item)
        })
      )
      watchers.push(
        watch(this.rules, items => {
          items.forEach(resolveField)
        })
      )
    },
    add() {
      const configStore = useConfigStore()
      this.rules.push({
        enable: true,
        matchMode: 'prefix',
        env: configStore.proxy.env[0].key,
      } as Rule)
    },
    copy(i: number) {
      this.rules.splice(i + 1, 0, { ...this.rules[i] })
    },
    remove(index: number) {
      this.rules.splice(index, 1)
      if (this.rules.length === 0) {
        this.add()
      }
    },
    swap(from: number, to: number) {
      this.rules[to] = this.rules.splice(from, 1, this.rules[to])[0]
    },
    async save() {
      await window.electronAPI.setConfig('proxy', {
        rules: toRaw(this.rules),
        defaultRule: toRaw(this.defaultRule),
      })
      this.$resetDiffState()
    },
  },
  detectHasChange: true,
})
