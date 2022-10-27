<script setup lang="ts">
import { ref, watch } from 'vue'
import { Warning, Download } from '@element-plus/icons-vue'
import { useUpdateStore } from '@/store/update.store'

const updateStore = useUpdateStore()
const show = ref(false)
watch(
  () => updateStore.needForceUpdate,
  value => {
    if (value) {
      show.value = true
    }
  }
)
function gotoDownloadPage() {
  show.value = false
  window.open(updateStore.downloadUrl, '_blank')
}
function beforeClose() {
  show.value = false
}
</script>

<template>
  <div class="force-update">
    <el-dialog
      v-model="show"
      fullscreen
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="beforeClose"
    >
      <template #header>
        <div class="title">
          <el-icon class="warning-icon"><Warning /></el-icon>
          <span>升级提醒</span>
        </div>
      </template>
      <div class="content">
        <div>请升级到最新版本！</div>
        <el-divider />
        <h3>最新版本：{{ updateStore.latestVersion }}</h3>
        <ul v-if="updateStore.changelogs && updateStore.changelogs.length > 0">
          <li v-for="line in updateStore.changelogs" :key="line">{{ line }}</li>
        </ul>
        <br />
        <br />
        <el-button type="primary" :icon="Download" @click="gotoDownloadPage">
          去往下载页面
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.force-update :deep(.el-dialog.is-fullscreen) {
  display: flex;
  flex-direction: column;
}
.force-update :deep(.el-dialog__body) {
  flex: 1;
}
.title {
  font-size: 28px;
  font-weight: bold;
}
.warning-icon {
  color: #b88230;
  vertical-align: middle;
  margin-top: -4px;
  margin-right: 0.5em;
}
.content {
  padding: 0 40px;
}
</style>
