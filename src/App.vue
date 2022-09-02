<template>
  <van-nav-bar title="标题" />
  <div class="content">
    <router-view/>
  </div>
  <van-tabbar placeholder class="tabbar" route v-model="active">
    <van-tabbar-item replace to="/health" icon="like" name="health">健康</van-tabbar-item>
    <van-tabbar-item replace to="/map" icon="map-marked" name="map">地图</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {ref} from "vue"
let active = ref("health");
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
