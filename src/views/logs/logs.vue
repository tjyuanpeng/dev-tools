<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { debounce, throttle } from 'lodash-es'
import hotkeys from 'hotkeys-js'
import { ElMessage } from 'element-plus'
import { CircleClose, Search, CopyDocument } from '@element-plus/icons-vue'
import { useLogsStore } from './logs.store'
import { useInfoStore } from '@/store/info.store'

const logsStore = useLogsStore()
const infoStore = useInfoStore()

// auto scroll
const layoutRef = ref<LayoutRef>()
const autoScroll = () => logsStore.autoScroll && layoutRef.value?.scrollToBottom()
watch(() => logsStore.lines.length, throttle(autoScroll, 100, { leading: false }))
onMounted(autoScroll)

// search text
const search = () => {
  let value = logsStore.searchText
  if (value === '' && logsStore.preSearchText === '') {
    return
  }
  logsStore.preSearchText = value

  const lines = document.querySelectorAll('#log-lines .line .line-content')
  var reg = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig')
  logsStore.searchedCount = 0
  lines.forEach(line => {
    const onlyText = line.textContent || ''
    if (value === '') {
      line.innerHTML = onlyText
      return
    }
    line.innerHTML = onlyText.replace(reg, match => {
      logsStore.searchedCount++
      return `<span class="hightlight" >${match}</span>`
    })
  })
}
const debouncedSearch = debounce(search, 150)
watch(() => logsStore.lines.length, throttle(search, 200, { leading: false }))
onMounted(search)

// copy line
async function copy(index: number) {
  await navigator.clipboard.writeText(logsStore.lines[index])
  ElMessage.success({ message: '复制成功' })
}

// hot key
const searchInputRef = ref()
onMounted(() => hotkeys('ctrl+f, command+f', () => searchInputRef.value.focus()))
onUnmounted(() => hotkeys.unbind('ctrl+f, command+f'))
</script>

<template>
  <layout-normal title="日志" ref="layoutRef">
    <template #extra>
      <span class="search-result" v-if="logsStore.searchedCount !== 0">
        找到: {{ logsStore.searchedCount }}
      </span>
      <el-input
        ref="searchInputRef"
        class="search-input ml-12"
        :placeholder="infoStore.isWin ? '搜索 ctrl+f' : '搜索 cmd+f'"
        maxlength="50"
        clearable
        :prefix-icon="Search"
        v-model="logsStore.searchText"
        @input="debouncedSearch"
      />
      <el-switch class="ml-28" v-model="logsStore.autoScroll" active-text="自动滚动" />
      <el-switch class="ml-28" v-model="logsStore.wordWrap" active-text="文字换行" />
      <el-button class="ml-12" text :icon="CircleClose" @click="logsStore.clear()">清空</el-button>
    </template>
    <div id="log-lines" class="container">
      <div
        :class="{ line: true, wrap: logsStore.wordWrap }"
        v-for="(item, index) in logsStore.lines"
        key="index"
      >
        <span class="copy" title="复制" @click="copy(index)">
          <el-icon><CopyDocument /></el-icon>
        </span>
        <span class="line-content">{{ item }}</span>
      </div>
    </div>
  </layout-normal>
</template>

<style scoped>
.ml-12 {
  margin-left: 12px;
}

.ml-28 {
  margin-left: 28px;
}

.search-result {
  color: #b1b3b8;
}

.search-input {
  display: inline-block;
  width: 150px;
}

.line {
  position: relative;
  display: inline-block;
  min-width: 100%;
  margin-left: -20px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  white-space: nowrap;
  font-family: 'consolas', 'PingFang SC', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

.line.wrap {
  word-break: break-all;
  white-space: initial;
}

.line.wrap:nth-child(even) {
  background-color: #e9e9eb;
}

.copy {
  position: absolute;
  visibility: hidden;
  cursor: pointer;
  left: 0px;
  width: 20px;
  text-align: center;
}

.line:hover,
.line.wrap:hover {
  background-color: #c6e2ff;
}

.line:hover .copy {
  visibility: visible;
}

.line :deep(.hightlight) {
  font-weight: bold;
  background-color: yellow;
}
</style>
