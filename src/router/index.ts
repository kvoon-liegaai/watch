import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HealthView from '../views/HealthView/HealthView.vue'
import MapView from "@/views/MapView/MapView.vue"
import MdFiveView from "@/views/mdFiveView.vue"
import BannedView from "@/views/BannedView.vue"
import SetView from "@/views/setView/SetView.vue"

import {useAuthStore} from "@/stores/authStore"


const routes: Array<RouteRecordRaw> = [
  {
    path:"/",
    redirect:(to)=>{
      return {name:"health"}
    }
  },
  {
    path:"/banned",
    name:"banned",
    component:BannedView
  },
  {
    //path: '/health/:imei',
    path:'/health',
    name: 'health',
    component: HealthView,
    // props:true,
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  },
  {
    path:"/set",
    name:"set",
    component:SetView
  }
  // {
  //   path: '/mdFiveview',
  //   name: 'mdFiveview',
  //   component: MdFiveView
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next)=>{
  if(to.name == "banned"){
    next();
  }
  if(!to.query.imei){
    // 无 imei
    next({name:'banned'})
  }
  else{
    // 有 imei
    const authStore = useAuthStore();
    authStore.saveImei(to.query.imei as string);
    next();
  }
})

router.afterEach(()=>{
  window.scrollTo(0,0);// chrome     
  document.body.scrollTop = 0// firefox     
  document.documentElement.scrollTop = 0// safari     
  window.pageYOffset = 0
})

export default router