import { defineStore } from 'pinia'

const MAX_LINES = 1000

export const useLogsStore = defineStore('logsStore', {
  state: () => ({
    lines: [] as string[],
    autoScroll: true,
    searchText: '',
    preSearchText: '',
    searchedCount: 0,
    wordWrap: false,
  }),
  getters: {},
  actions: {
    $init() {
      window.electronAPI.__ELECTRON_LOG_IPC_default__((_event: any, state: any) => {
        if (this.lines.length === MAX_LINES) {
          this.lines.shift()
        }
        this.lines.push(state.data.join(' '))
      })
    },
    clear() {
      this.lines.length = 0
    },
  },
})
