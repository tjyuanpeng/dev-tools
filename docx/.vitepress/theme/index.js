import 'element-plus/dist/index.css'
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
  },
}
