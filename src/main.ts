import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//import store from './store'

import "normalize.css"
import 'vant/lib/index.css';
import "@icon-park/vue-next/styles/index.css"
import "@/assets/font/index.css"

import {createPinia} from "pinia"

import {
  Col,
  Row,
  Tabbar,
  TabbarItem,
  NavBar,
  Button,
  Toast,
  Notify,
  Skeleton,
  Overlay,
  Loading,
  Cell,
  CellGroup,
  Switch,
  Field,
  NumberKeyboard
} from "vant"

createApp(App)
  .use(createPinia())
  //.use(store)
  .use(router)
  //vant
  .use(Col)
  .use(Row)
  .use(Tabbar)
  .use(TabbarItem)
  .use(NavBar)
  .use(Button)
  .use(Toast)
  .use(Notify)
  .use(Skeleton)
  .use(Overlay)
  .use(Loading)
  .use(Cell)
  .use(CellGroup)
  .use(Switch)
  .use(Field)
  .use(NumberKeyboard)
  .mount('#app')
