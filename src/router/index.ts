import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HealthView from '../views/HealthView.vue'
import MapView from "@/views/MapView.vue"
import MdFiveView from "@/views/mdFiveView.vue"
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
  {
    path: '/mdFiveview',
    name:'mdFiveview',
    component: MdFiveView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach(()=>{
  window.scrollTo(0,0);// chrome     
  document.body.scrollTop = 0// firefox     
  document.documentElement.scrollTop = 0// safari     
  window.pageYOffset = 0
})

export default router
