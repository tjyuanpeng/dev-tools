<script setup lang="ts">
import SideBar from '@/components/side-bar/side-bar.vue'
import StatusBar from '@/components/status-bar/status-bar.vue'
import ForceUpdate from '@/components/force-update/force-update.vue'
</script>

<template>
  <el-container>
    <el-container class="main">
      <el-aside width="200px">
        <SideBar />
      </el-aside>
      <router-view></router-view>
    </el-container>
    <el-footer class="footer">
      <StatusBar />
      <ForceUpdate />
    </el-footer>
  </el-container>
</template>

<style scoped>
.aside {
  width: 200px;
}
.main {
  border-top: 1px solid var(--el-menu-border-color);
  height: calc(100vh - 60px);
}
.footer {
  background-color: #d9ecff;
  border-top: 1px solid #c6e2ff;
}
</style>

<style>
html,
body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    '微软雅黑', Arial, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
#app {
  min-height: 100vh;
}
</style>
