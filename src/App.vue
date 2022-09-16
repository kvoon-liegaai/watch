<template>
  <van-nav-bar :title="title" />
  <div class="content">
    <router-view/>
  </div>
  <van-tabbar placeholder class="tabbar" route v-model="active" v-if="showTabbar">
    <van-tabbar-item @touchend="switchPage('health')" icon="like" name="health">健康</van-tabbar-item>
    <van-tabbar-item @touchend="switchPage('map')" icon="map-marked" name="map">地图</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
  import {onMounted, ref,Ref, watchEffect} from "vue"
  import {Title} from "@/types/"
  import {useEventBus} from "@vueuse/core"
  import router from "@/router"
  import {useAuthStore} from "@/stores/authStore"
  //激活的 tabbar item
  let active = ref("health");
  // title
  let title:Ref<Title> = ref("健康");
  // bus to change title 
  const titleBus = useEventBus<Title>("titleBus")
  const listener = (curTitle:Title) => {
    title.value = curTitle
  }
  const unsubscribe = titleBus.on(listener)

  // 是否展示tabbar
  const showTabbar = ref<boolean>(true);
  watchEffect(()=>{
    if(title.value === "错误"){
      showTabbar.value = false;
    }
    else{
      showTabbar.value = true;
    }
  })
  // tabbar 切换页面
  function switchPage(name:string){
    const authStore = useAuthStore()
    router.push({
      name,
      query:{
        imei:authStore.Imei
      },
      replace:true
    })
  }
</script>

<style lang="scss">
#app {
  font-family: "阿里妈妈数黑体 Bold", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width:375px;
  height:667px;
  background-color:$theme-bg;
  .content{
    //navbar == tabbar == 80px
    //height:1154px;
    background-color: $theme-bg;
  }

  :deep(.van-nav-bar__title.van-ellipsis){
    line-height: 1.5;
    font-size:600px;
  }
}
</style>
