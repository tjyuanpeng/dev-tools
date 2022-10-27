<script setup lang="ts">
import { useProxyStore } from '@/store/proxy.store'
import { useConfigStore } from '@/store/config.store'
import { Position } from '@element-plus/icons-vue'
import StartIcon from './icons/start.svg'
import StopIcon from './icons/stop.svg'

const proxyStore = useProxyStore()
const configStore = useConfigStore()

function handleOpen() {
  window.open(`http://localhost:${configStore.proxy.port}/`)
}
</script>

<template>
  <div class="status-bar">
    <div class="left"></div>
    <div class="right">
      <el-button
        v-if="!proxyStore.isRunning"
        type="primary"
        round
        :icon="StartIcon"
        @click="proxyStore.start()"
      >
        &nbsp;启动&nbsp;
      </el-button>
      <template v-else>
        <el-button text round :icon="Position" @click="handleOpen">打开代理地址</el-button>
        <el-button type="warning" round :icon="StopIcon" @click="proxyStore.stop()">
          &nbsp;停止&nbsp;
        </el-button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: auto;
}
</style>
