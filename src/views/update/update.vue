<script setup lang="ts">
import { useUpdateStore } from '@/store/update.store'
import { Download } from '@element-plus/icons-vue'

const updateStore = useUpdateStore()
function gotoDownloadPage() {
  window.open(updateStore.downloadUrl, '_blank')
}
</script>

<template>
  <layout-normal title="升级">
    <h3>最新版本：{{ updateStore.latestVersion }}</h3>
    <ul v-if="updateStore.changelogs && updateStore.changelogs.length > 0">
      <li v-for="line in updateStore.changelogs" :key="line">{{ line }}</li>
    </ul>
    <br />
    <br />
    <el-button type="primary" :icon="Download" @click="gotoDownloadPage"> 去往下载页面 </el-button>
  </layout-normal>
</template>
