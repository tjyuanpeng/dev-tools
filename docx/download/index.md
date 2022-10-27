<script setup>
import { reactive, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { Apple, Download } from '@element-plus/icons-vue'
import { version } from '../../package.json'

let win = reactive({
  version: '-',
  url: '',
})
let mac = reactive({
  version: '-',
  url: '',
})

onMounted(async () => {
  const responseWin = await fetch(withBase(`./download-win.json`))
  const dataWin = await responseWin.json()
  console.log('# data win: ', dataWin)
  win.version = dataWin.version
  win.url = dataWin.url

  const responseMac = await fetch(withBase(`./download-mac.json`))
  const dataMac = await responseMac.json()
  console.log('# data mac: ', dataMac)
  mac.version = dataMac.version
  mac.url = dataMac.url
})

function download(data) {
  window.open(data.url, '_blank')
}
</script>

# 下载

## Windows

<el-button size="large" type="primary" round :icon="Download" @click="download(win)">下载 v{{ win.version }}</el-button>

### changelog

v1.0.5

- 修复 代理规则 修改无响应的 bug

v1.0.4

- 修复 代理规则 修改无响应的 bug
- 修复 log store 初始化 bug

v1.0.3

- 修复 30x 跳转导致的页面无法打开
- 修复 CSP 策略阻止 http 请求的问题
- 增加 X-SFDT-TARGET header 用来辨识请求的真实 url

v1.0.2

- 修改内置环境配置的 URL
- 修复环境配置 http 地址，导致的 307 跳转问题
- 增加 debug actions

v1.0.1

- 修复选项页面下，新增环境条目，关键字检验 bug

v1.0.0

- 项目初始化
- 开发代理功能
- 版本更新提醒
- 支持 mac、windows

## Mac

<el-button size="large" type="success" round :icon="Apple" @click="download(mac)">下载 v{{ mac.version }}</el-button>

### changelog

v1.0.5

- 修复 代理规则 修改无响应的 bug

v1.0.4

- 修复 代理规则 修改无响应的 bug
- 修复 log store 初始化 bug

v1.0.2

- 修改内置环境配置的 URL
- 修复环境配置 http 地址，导致的 307 跳转问题
- 增加 debug actions

v1.0.0

- 项目初始化
- 开发代理功能
- 版本更新提醒
- 支持 mac、windows
