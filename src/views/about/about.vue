<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useInfoStore } from '@/store/info.store'

const infoStore = useInfoStore()

function reloadWindow() {
  window.location.reload()
}

function openLogFile() {
  window.electronAPI.openLogFile()
}

async function resetUserData() {
  await ElMessageBox.confirm('you`ll lose everything, and app will exit', 'Are you sure?')
  window.electronAPI.resetUserData()
}
</script>

<template>
  <layout-normal title="关于">
    <h3>项目 git 地址：</h3>
    <div>
      <a target="_blank" href="http://g.lenovo.com.cn/yuanpeng3/dev-tool">
        http://g.lenovo.com.cn/yuanpeng3/dev-tool
      </a>
    </div>
    <h3>项目文档：</h3>
    <div>
      <a target="_blank" href="http://yuanpeng3.g.lenovo.com.cn/dev-tool/">
        http://yuanpeng3.g.lenovo.com.cn/dev-tool/
      </a>
    </div>
    <h3>提交问题：</h3>
    <div>
      <a target="_blank" href="http://g.lenovo.com.cn/yuanpeng3/dev-tool/-/issues">
        http://g.lenovo.com.cn/yuanpeng3/dev-tool/-/issues
      </a>
    </div>
    <br />
    <br />
    <el-descriptions title="" border :column="1">
      <el-descriptions-item label="app">{{ infoStore.versions.app }}</el-descriptions-item>
      <el-descriptions-item label="app-mode">{{ infoStore.versions.mode }}</el-descriptions-item>
      <el-descriptions-item label="node">{{ infoStore.versions.node }}</el-descriptions-item>
      <el-descriptions-item label="chrome">{{ infoStore.versions.chrome }}</el-descriptions-item>
      <el-descriptions-item label="electron">
        {{ infoStore.versions.electron }}
      </el-descriptions-item>
      <el-descriptions-item label="">
        <el-button text @click="reloadWindow">Reload Window</el-button>
        <el-button text @click="openLogFile">Open Log File</el-button>
        <el-button text @click="resetUserData">Reset User Data</el-button>
      </el-descriptions-item>
    </el-descriptions>
  </layout-normal>
</template>
