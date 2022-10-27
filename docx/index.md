<script setup>
import { useRouter, withBase } from 'vitepress'
import { Right, Download } from '@element-plus/icons-vue'

const router = useRouter()
function go(path) {
  router.go(withBase(path))
}
</script>

# ServiceForce Develop Tool

ServiceForce 前端开发工具

助力前端开发

<el-button size="large" round :icon="Right" type="success" @click="go('/guide/')">开始</el-button>
<el-button size="large" round :icon="Download" @click="go('/download/')">下载</el-button>
