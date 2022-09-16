<template>
  map
</template>

<script setup lang="ts">
  // vueuse
  import {useEventBus} from "@vueuse/core"
  import {Title} from "@/types/"
  // vue
  import { onMounted } from "vue";
  onMounted(()=>{
    const titleBus = useEventBus<Title>("titleBus")
    titleBus.emit("地图")
  })
</script>

<style>

</style>