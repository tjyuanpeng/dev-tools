<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Switch, Setting, Monitor, Coffee } from '@element-plus/icons-vue'
import { useUpdateStore } from '@/store/update.store'
import UpgradeIcon from './icons/upgrade.svg'
import CoffeeIcon from './icons/coffee.svg'

const route = useRoute()
const updateStore = useUpdateStore()
</script>

<template>
  <el-menu :default-active="route.path" :router="true" class="menu">
    <el-menu-item index="/rules">
      <el-icon><Switch /></el-icon>
      <span>代理规则</span>
    </el-menu-item>
    <el-menu-item index="/logs">
      <el-icon><Monitor /></el-icon>
      <span>代理日志</span>
    </el-menu-item>
    <el-menu-item index="/options">
      <el-icon><Setting /></el-icon>
      <span>选项</span>
    </el-menu-item>
    <el-menu-item index="/about">
      <el-icon><CoffeeIcon /></el-icon>
      <span>关于</span>
    </el-menu-item>
    <el-menu-item v-if="updateStore.needFriendlyUpdate" index="/update" class="important">
      <el-icon>
        <UpgradeIcon />
      </el-icon>
      <span>升级*</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.menu {
  height: 100%;
  user-select: none;
}
.menu :deep(.el-menu-item.is-active) {
  font-weight: bold;
}
.important {
  color: crimson;
}
</style>
