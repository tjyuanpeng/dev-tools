import { createRouter, createWebHashHistory } from 'vue-router'
import RulesView from './views/rules/rules.vue'
import LogsView from './views/logs/logs.vue'
import OptionsView from './views/options/options.vue'
import AboutView from './views/about/about.vue'
import UpdateView from './views/update/update.vue'

const routes = [
  { path: '/rules', component: RulesView },
  { path: '/logs', component: LogsView },
  { path: '/options', component: OptionsView },
  { path: '/about', component: AboutView },
  { path: '/update', component: UpdateView },
  { path: '/', redirect: '/rules' },
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
})

export default router
