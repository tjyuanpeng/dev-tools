<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import hotkeys from 'hotkeys-js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Promotion, Remove, CloseBold } from '@element-plus/icons-vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useOptionsStore } from './options.store'
import { useConfigStore } from '@/store/config.store'
import type { FormInstance, FormRules } from 'element-plus'

const optionsStore = useOptionsStore()
const configStore = useConfigStore()

const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  port: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      type: 'number',
      min: 1000,
      max: 9999,
      message: '请输入范围为1000~9999的数字',
      trigger: 'blur',
    },
  ],
  label: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      validator(rule: any, value: any, callback: any, source: any, options: any) {
        const found = optionsStore.env.filter(item => item.label === value)
        if (found.length > 1) {
          callback('名称重复')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
  url: [
    { required: true, message: '必填项', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL', trigger: 'blur' },
  ],
  key: [
    { required: true, message: '必填项', trigger: 'blur' },
    {
      validator(_rule, value, callback) {
        const found = optionsStore.env.filter(item => item.key === value)
        if (found.length > 1) {
          callback('关键字重复')
        }
        callback()
      },
      trigger: 'blur',
    },
    {
      validator(rule, value, callback) {
        const infos = rule.field?.split('.') || []
        const index: number = Number(infos[1])
        if (configStore.proxy.env[index] === undefined) {
          return callback()
        }
        const oldValue = configStore.proxy.env[index].key
        if (oldValue === value) {
          return callback()
        }
        const rulesFound = configStore.proxy.rules.find(item => item.env === oldValue)
        const defaultRuleFound = configStore.proxy.defaultRule.env === oldValue
        if (rulesFound || defaultRuleFound) {
          callback('关键字正在被使用，不可修改')
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
})

const layoutRef = ref<LayoutRef>()
function handleAdd() {
  optionsStore.add()
  nextTick(() => layoutRef.value?.scrollToBottom())
}

async function handleSave() {
  await formRef.value?.validate()
  await optionsStore.save()
  ElMessage.success({ message: '保存成功' })
}
onMounted(() =>
  hotkeys('ctrl+s, command+s', () => {
    handleSave()
  })
)
onUnmounted(() => hotkeys.unbind('ctrl+s, command+s'))
onBeforeRouteLeave(async () => {
  if (optionsStore.$hasChange) {
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
</script>

<template>
  <layout-normal title="配置" ref="layoutRef">
    <template #extra>
      <el-button :icon="Remove" text @click="optionsStore.load()">重置</el-button>
      <el-button type="primary" text :icon="Promotion" @click="handleSave()">
        保存{{ optionsStore.$hasChange ? '*' : '' }}
      </el-button>
    </template>
    <el-form
      ref="formRef"
      :model="optionsStore"
      hide-required-asterisk
      scroll-to-error
      label-width="120px"
    >
      <el-form-item label="桌面通知">
        <el-switch v-model="optionsStore.notification" />
      </el-form-item>
      <el-form-item label="代理端口" prop="port" :rules="rules.port">
        <el-tooltip
          placement="left"
          :content="`http://localhost:${optionsStore.port}/`"
          :hide-after="50"
          transition=""
          enterable
        >
          <el-input v-model.number="optionsStore.port" maxlength="4" />
        </el-tooltip>
      </el-form-item>

      <el-divider />

      <el-form-item
        v-for="(item, index) in optionsStore.env"
        :key="index"
        :label="index === 0 ? '代理环境配置' : ''"
      >
        <el-form-item class="item-key" :prop="'env.' + index + '.key'" :rules="rules.key">
          <el-input v-model="item.key" placeholder="关键字" maxlength="20" />
        </el-form-item>
        <el-form-item class="item-label" :prop="'env.' + index + '.label'" :rules="rules.label">
          <el-input v-model="item.label" placeholder="名称" maxlength="20" />
        </el-form-item>
        <el-form-item class="item-value" :prop="'env.' + index + '.value'" :rules="rules.url">
          <el-input v-model="item.value" placeholder="URL" maxlength="100" />
        </el-form-item>
        <el-button
          type="danger"
          plain
          text
          circle
          :icon="CloseBold"
          @click="optionsStore.remove(index)"
        />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Plus" text @click="handleAdd">增加项目</el-button>
      </el-form-item>
    </el-form>
  </layout-normal>
</template>

<style scoped>
.item-key {
  flex: 1;
  margin-right: 1em;
}
.item-label {
  flex: 2;
  margin-right: 1em;
}
.item-value {
  flex: 3;
  margin-right: 1em;
}
</style>
