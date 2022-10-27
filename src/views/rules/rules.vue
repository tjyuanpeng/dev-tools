<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import hotkeys from 'hotkeys-js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, CloseBold, Promotion, DocumentCopy, Sort, Remove } from '@element-plus/icons-vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useRulesStore } from './rules.store'
import { useConfigStore } from '@/store/config.store'
import type { FormInstance, FormRules } from 'element-plus'

const rulesStore = useRulesStore()
const configStore = useConfigStore()

const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  from: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      validator(rule, value, callback) {
        const infos = rule.field?.split('.') || []
        const index: number = Number(infos[1])
        const isRegexp = (value: string) => {
          try {
            return !!new RegExp(value)
          } catch (_e) {
            return false
          }
        }
        const { from = '', matchMode } = rulesStore.rules[index]
        if (matchMode !== 'regexp' && !from.startsWith('/')) {
          return callback('必须以"/"为开头')
        } else if (matchMode === 'regexp' && !isRegexp(from)) {
          return callback('请输入正确的正则表达式')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  env: [{ required: true, message: '必填项', trigger: 'change' }],
  envPath: [{ trigger: 'blur' }],
  to: [
    { required: true, message: '必填项', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL', trigger: 'blur' },
  ],
})

const layoutRef = ref<LayoutRef>()
function handleAdd() {
  rulesStore.add()
  nextTick(() => layoutRef.value?.scrollToBottom())
}

async function handleSave() {
  await formRef.value?.validate()
  await rulesStore.save()
  ElMessage.success({ message: '保存成功' })
}

onMounted(() =>
  hotkeys('ctrl+s, command+s', () => {
    handleSave()
  })
)
onUnmounted(() => hotkeys.unbind('ctrl+s, command+s'))
onBeforeRouteLeave(async () => {
  if (rulesStore.$hasChange) {
    const action = await ElMessageBox({
      type: 'warning',
      title: '是否保存修改？',
      message: '修改尚未保存',
      autofocus: true,
      showCancelButton: true,
      confirmButtonText: '保存并继续',
      cancelButtonText: '取消操作',
    })
    if (action === 'confirm') {
      await handleSave()
    }
  }
})

const drag = reactive({
  from: -1,
  to: -1,
  start(e: DragEvent, index: number) {
    drag.from = index
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
    }
  },
  end() {
    drag.from = -1
    drag.to = -1
  },
  over(event: DragEvent, index: number) {
    if (drag.from === index) {
      return
    }
    event.preventDefault()
    drag.to = index
  },
  leave(e: DragEvent) {
    drag.to = -1
  },
  drop(event: DragEvent) {
    event.preventDefault()
    rulesStore.swap(drag.from, drag.to)
  },
})
</script>

<template>
  <layout-normal title="代理规则" scrollWhenDragging ref="layoutRef">
    <template #extra>
      <el-button :icon="Remove" text @click="rulesStore.$init()">重置</el-button>
      <el-button type="primary" text :icon="Promotion" @click="handleSave">
        保存{{ rulesStore.$hasChange ? '*' : '' }}
      </el-button>
    </template>
    <el-form ref="formRef" :model="rulesStore" hide-required-asterisk scroll-to-error>
      <el-form-item label="默认匹配" label-width="120px">
        <el-form-item prop="defaultRule.env" :rules="rules.env" class="w-150">
          <el-select v-model="rulesStore.defaultRule.env">
            <el-option
              v-for="item in configStore.proxy.env"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-tooltip
          placement="left"
          :content="rulesStore.defaultRule.to"
          :hide-after="50"
          transition=""
          enterable
        >
          <el-form-item
            v-if="rulesStore.defaultRule.env === 'custom'"
            class="ml-4"
            prop="defaultRule.to"
            :rules="rules.to"
          >
            <el-input
              v-model="rulesStore.defaultRule.to"
              placeholder="完整的URL地址"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item v-else class="ml-4" prop="defaultRule.envPath" :rules="rules.envPath">
            <el-input
              v-model="rulesStore.defaultRule.envPath"
              placeholder="相对路径"
              maxlength="40"
            />
          </el-form-item>
        </el-tooltip>
      </el-form-item>

      <el-divider />

      <el-form-item
        v-for="(item, index) in rulesStore.rules"
        :key="index"
        :class="{
          'drag-from': drag.from === index,
          droppable: drag.from !== -1 && drag.from !== index,
          'drop-target': drag.to === index,
        }"
        @dragover="drag.over($event, index)"
        @dragleave="drag.leave($event)"
        @drop="drag.drop($event)"
        @dragend="drag.end"
      >
        <el-checkbox v-model="item.enable" />

        <el-form-item class="w-100 ml-20">
          <el-select v-model="item.matchMode" :disabled="!item.enable">
            <el-option
              v-for="item in rulesStore.matchMode"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="flex-1 ml-4" :prop="'rules.' + index + '.from'" :rules="rules.from">
          <el-input v-model="item.from" placeholder="from..." :disabled="!item.enable" />
        </el-form-item>

        <el-form-item class="w-150 ml-20" :prop="'rules.' + index + '.env'" :rules="rules.env">
          <el-select :disabled="!item.enable" v-model="item.env" placeholder="目标环境">
            <el-option
              v-for="item in configStore.proxy.env"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-tooltip placement="left" :content="item.to" :hide-after="50" transition="" enterable>
          <el-form-item
            v-if="item.env === 'custom'"
            class="flex-1 ml-4"
            :prop="'rules.' + index + '.to'"
            :rules="rules.to"
          >
            <el-input
              v-model="item.to"
              :disabled="!item.enable"
              placeholder="完整的URL地址"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-else
            class="flex-1 ml-4"
            :prop="'rules.' + index + '.envPath'"
            :rules="rules.envPath"
          >
            <el-input
              v-model="item.envPath"
              :disabled="!item.enable"
              placeholder="相对路径"
              maxlength="40"
            ></el-input>
          </el-form-item>
        </el-tooltip>

        <el-button
          class="ml-20 drag-handler"
          title="拖动排序"
          text
          circle
          tabindex="-1"
          :icon="Sort"
          draggable="true"
          @dragstart="drag.start($event, index)"
        />

        <el-button
          class="ml-12"
          title="复制"
          text
          circle
          :icon="DocumentCopy"
          @click="rulesStore.copy(index)"
        />

        <el-button
          class="ml-12"
          title="删除"
          type="danger"
          text
          circle
          :icon="CloseBold"
          @click="rulesStore.remove(index)"
        />
      </el-form-item>
      <el-form-item label-width="35px">
        <el-button :icon="Plus" text @click="handleAdd">增加项目</el-button>
      </el-form-item>
    </el-form>
  </layout-normal>
</template>

<style scoped>
.w-100 {
  width: 100px;
}
.w-150 {
  width: 150px;
}
.flex-1 {
  flex: 1;
}

.ml-4 {
  margin-left: 4px;
}
.ml-8 {
  margin-left: 8px;
}
.ml-12 {
  margin-left: 12px;
}
.ml-20 {
  margin-left: 20px;
}

.el-form-item__content {
  flex-wrap: nowrap;
}
.item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
  line-height: 32px;
  position: relative;
  font-size: var(--font-size);
  min-width: 0;
}
.drag-handler {
  cursor: grab;
}

.drag-from {
  opacity: 0.5;
}

.droppable {
  outline: lightgrey dashed 2px;
  outline-offset: 6px;
}
.droppable * {
  pointer-events: none;
}

.drop-target {
  outline: green solid 4px;
}
</style>
