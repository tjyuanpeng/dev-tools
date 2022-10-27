import { defineStore } from 'pinia'
import axios from 'axios'
import { lt } from 'semver'

import { useInfoStore } from '@/store/info.store'

const url =
  import.meta.env.MODE === 'development'
    ? 'http://g.lenovo.com.cn/api/v4/snippets/11/raw'
    : 'http://g.lenovo.com.cn/api/v4/snippets/10/raw'
const period = 1000 * 60 * 60

export const useUpdateStore = defineStore('updateStore', {
  state: () => ({
    downloadUrl: 'http://yuanpeng3.g.lenovo.com.cn/dev-tool/download/',
    latestVersion: '',
    minVersion: '',
    changelogs: [],
    checkSuccess: false,
    needForceUpdate: false,
    needFriendlyUpdate: false,
  }),
  actions: {
    async $init() {
      await this.check()
    },
    async check() {
      try {
        const res = await axios.get(url, {
          timeout: 2000,
        })
        const { mac, ...win } = res.data
        const infoStore = useInfoStore()
        const data = infoStore.isMac ? mac : win
        this.$patch({
          ...data,
          checkSuccess: true,
        })
      } catch (e) {
        console.error(e)
        this.checkSuccess = false
      } finally {
        await this.validate()
        setTimeout(this.check, period)
      }
    },
    async validate() {
      if (!this.checkSuccess) {
        this.$patch({
          needFriendlyUpdate: false,
          needForceUpdate: false,
        })
        return
      }
      const infoStore = useInfoStore()
      await infoStore.$initComplete
      const currentVersion = infoStore.versions.app
      this.$patch({
        needFriendlyUpdate: lt(currentVersion, this.latestVersion),
        needForceUpdate: lt(currentVersion, this.minVersion),
      })
    },
  },
})
