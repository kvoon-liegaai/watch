<template>
  <div id="md">
    <div>
      <label>
        key
        <input type="text" v-model="key"/>
      </label>
    </div>
    <div>
      <label for="">
        appid
        <input type="text" v-model="appid"/>
      </label>
    </div>
    <div>
      <label>
        timestamp
        <span>{{timestamp}}</span>
      </label>
    </div>
    <div>
      <label>
        password
        <div>
          <span style="background-color:#bbb">{{password}}</span>
        </div>
      </label>
    </div> 
  </div>
</template>

<script setup lang="ts">
  import { computed } from "@vue/reactivity";
  import {ref} from "vue"
  import {Md5} from 'ts-md5';

  let key = ref<string>("CAEED868-C695-43EE-8941-9BDC5D551564")
  let appid = ref<string>("138")

  let timestamp = ref<number>(Date.now())
  setInterval(()=>{
    timestamp.value = Date.now();
  },15000);
  
  let password = computed(()=>{
    return Md5.hashStr(key.value + appid.value + timestamp.value)
  })
  
</script>

<style lang="scss" scoped>
#md > div{
  margin:30px 0px;
}
</style>