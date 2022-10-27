<script setup lang="ts">
import { ref, useSlots, onMounted, onUnmounted } from 'vue'
import { ElScrollbar } from 'element-plus'

const slots = useSlots()
const props = defineProps({
  title: String,
  scrollWhenDragging: Boolean,
})

const scrollbar = ref<InstanceType<typeof ElScrollbar>>()
function scrollToBottom() {
  scrollbar.value?.setScrollTop(scrollbar.value.wrap$?.scrollHeight || 9999)
}
defineExpose({
  scrollbar,
  scrollToBottom,
})

// dragging scroll helper
const scrollWhenDragging = (e: DragEvent) => {
  const el = e.target as Element
  const sb = scrollbar.value
  const st = sb!.wrap$!.scrollTop
  if (el.matches('.el-header')) {
    sb!.setScrollTop(st - 10)
  } else if (el.matches('.status-bar')) {
    sb!.setScrollTop(st + 10)
  }
}
onMounted(() => {
  if (props.scrollWhenDragging) {
    window.addEventListener('dragover', scrollWhenDragging)
  }
})
onUnmounted(() => {
  if (props.scrollWhenDragging) {
    window.removeEventListener('dragover', scrollWhenDragging)
  }
})
</script>

<template>
  <el-container>
    <el-header>
      <div class="title" v-if="slots.title"><slot name="title"></slot></div>
      <div class="title" v-else>{{ title }}</div>
      <div v-if="slots.extra"><slot name="extra"></slot></div>
    </el-header>
    <el-scrollbar always ref="scrollbar">
      <el-main>
        <slot></slot>
      </el-main>
    </el-scrollbar>
  </el-container>
</template>

<style scoped>
.el-header {
  --el-header-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.title {
  font-size: 24px;
  font-weight: bold;
  user-select: none;
}
.el-main {
  padding-top: 8px;
  overflow: visible;
}
</style>
