import { toRaw, ref, Ref } from 'vue'
import { Pinia, PiniaPlugin } from 'pinia'
import { diff } from 'just-diff'
import { cloneDeep } from 'lodash-es'

declare module 'pinia' {
  interface Pinia {
    _detectHasChangeDiffState: Record<string, StateTree>
  }

  export interface DefineStoreOptionsBase<S, Store> {
    detectHasChange?: boolean
  }

  export interface PiniaCustomProperties {
    set $hasChange(value: boolean | Ref<boolean>)
    get $hasChange(): boolean
    $resetDiffState: () => void
  }
}

const plugin: PiniaPlugin = ({ pinia, store, options: { detectHasChange } }) => {
  if (!detectHasChange) {
    return
  }

  if (!pinia._detectHasChangeDiffState) {
    pinia._detectHasChangeDiffState = {}
  }

  store.$hasChange = ref(false)
  store.$resetDiffState = () => {
    pinia._detectHasChangeDiffState[store.$id] = cloneDeep(toRaw(pinia.state.value[store.$id]))
    store.$hasChange = false
  }
  store.$resetDiffState()

  store.$subscribe(
    () => {
      const oldV = pinia._detectHasChangeDiffState[store.$id]
      const newV = toRaw(pinia.state.value[store.$id])
      const df = diff(oldV, newV)
      store.$hasChange = df.length > 0
    },
    { detached: true }
  )
}

export default plugin
