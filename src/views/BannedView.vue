<template>
  <div>找不到imei</div>
</template>

<script setup lang='ts'>
  import { onMounted } from 'vue';
  import {useEventBus} from "@vueuse/core"
  import {Title} from "@/types"
  onMounted(()=>{
    const titleBus = useEventBus<Title>("titleBus");
    titleBus.emit("错误");
  })
</script>

<style lang='scss' scoped>
  div{
    font-size:large;
    margin-top:30px;
    text-align: center;
  }
</style>