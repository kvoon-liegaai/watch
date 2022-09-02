import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HealthView from '../views/HealthView.vue'
import MapView from "@/views/MapView.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path:"/",
    redirect:"/health"
  },
  {
    path: '/health',
    name: 'health',
    component: HealthView
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
