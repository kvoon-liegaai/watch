<template>
  <!--遮罩-->
  <van-overlay :show="isSetting">
    <div class="wrapper" @click.stop @touch.stop>
      <van-loading type="circular" size="24px" text-color="white">设置中...</van-loading>
    </div>
  </van-overlay>

  <!-- <van-button type="primary"  @click="run">run</van-button> -->
  

  <!-- @touchend="onInputFinished('0079',String(isPedometerChecked))" -->
  <van-cell-group insert>
    <!-- 计步器开关 -->
    <van-cell title-class="cell-title" title="开启计步器">
      <template #right-icon>
        <van-switch :model-value="isPedometerChecked" size="24"
          @update:model-value="onPedometerCheckSwitch"/>  <!--'0079',is-->
      </template>
    </van-cell>
    <!-- GPS上传时间间隔 -->
    <van-field label="GPS定位间隔" input-align="right" v-model="GPSTimeInterval" readonly clickable
      @touchstart.stop="showKB(keyboardStatus, 'isGPSKBshow')"
      ref="GPSFieldRef">
      <template #right-icon>
        <span>分钟</span>
      </template>
    </van-field>
    <van-number-keyboard
      v-model="GPSTimeInterval"
      :show="keyboardStatus.isGPSKBshow"
      :maxlength="6"
      @blur="onInputFinished('0305',GPSTimeInterval);keyboardStatus.isGPSKBshow = false"
      close-button-text="完成"
    />
    <!-- 体温上传时间间隔 -->
    <van-field label="体温测量间隔" input-align="right" v-model="temperatureTimeInterval" readonly clickable @touchstart.stop="showKB(keyboardStatus, 'isTemperatureKBshow')">
      <template #right-icon>
        <span>小时</span>
      </template>
    </van-field>
    <van-number-keyboard
      v-model="temperatureTimeInterval"
      :show="keyboardStatus.isTemperatureKBshow"
      :maxlength="6"
      @blur="onInputFinished('9113',GPSTimeInterval);keyboardStatus.isTemperatureKBshow = false"
      close-button-text="完成"
    />
    <!-- 心率上传时间间隔 -->
    <van-field label="心率测量间隔" input-align="right" v-model="heartRateTimeInterval" readonly clickable @touchstart.stop="showKB(keyboardStatus,'isHeartRateKBshow')">
      <template #right-icon>
        <span>秒</span>
      </template>
    </van-field>
    <van-number-keyboard
      v-model="heartRateTimeInterval"
      :show="keyboardStatus.isHeartRateKBshow"
      :maxlength="6"
      @blur="onInputFinished('2815',GPSTimeInterval);keyboardStatus.isHeartRateKBshow = false"
      close-button-text="完成"
    />
  </van-cell-group>

  <van-cell-group title="紧急联系人">
    <van-cell title="单元格" value="内容"></van-cell>
    <van-cell title="单元格" value="内容" label="描述信息"></van-cell>
  </van-cell-group>
  
</template>

<script setup lang="ts">
  import {ref, reactive} from "vue"
  import { sendCommand } from "@/api";
  /* utils */
  // 键盘显示
  import {showKB} from "@/utils/keyBoardGroupVis"
  import {genCommandParams} from "@/utils/genReqParams"
  // types
  import {CommandCodeType} from "@/api/types"
  import { Notify } from "vant";
  import type { FieldInstance } from 'vant';
  import * as R from "ramda"
  let isSetting = ref<boolean>(false);
  // 数字键盘状态
  const keyboardStatus = reactive({
    isGPSKBshow:false,
    isTemperatureKBshow:false,
    isHeartRateKBshow:false,
  })
  // 计步器开关
  const isPedometerChecked = ref<boolean>(false);
  // GPS
  const GPSTimeInterval = ref<string>("10");// minute 
  const GPSFieldRef = ref<FieldInstance>()
  // 体温
  const temperatureTimeInterval = ref<string>("10"); // hours
  // 心率
  const heartRateTimeInterval = ref<string>("500"); // second
  // async function trySendHealthCommand
  // const onPedometerCheckSwitch = compose(

  // );

  //TODO: curry
  /**
   * @remarks 
   * function: part of curried genCommandParams
  */
  const genPedometerCommandParams = genCommandParams("0079");
  function run(){
    const res = genPedometerCommandParams("true")
    console.log('run res', res)
  }
  // 切换计步开
  async function onPedometerCheckSwitch(newVal:boolean){
    const code = "0079";
    const params = genCommandParams(code,String(newVal))
    console.log('(setting):command params',params)
    try {
      // switch start
      isSetting.value = true;
      const res = await sendCommand(params);
      console.log('(setting) res',res)
      Notify({type:"success",message:"设置成功"})
      // switch success
      isPedometerChecked.value = newVal;
    } catch (error) {
      Notify({type:"danger",message:`${error}`})
    }
    finally{
      // switch end
      isSetting.value = false;
    }
  }
  // }
  // 输入结束
  async function onInputFinished(code:CommandCodeType, inputVal:string){
    const params = genCommandParams(code,inputVal)
    console.log('(setting):command params',params)
    try {
      // setting start
      isSetting.value = true;
      const res = await sendCommand(params);
      console.log('(setting) res',res)
      Notify({type:"success",message:"设置成功"})
    } catch (error) {
      Notify({type:"danger",message:`${error}`})
    }
    finally{
      // setting end
      isSetting.value = false;
    }
  }
 
</script>

<style lang="scss" scoped>
  .cell-title{
    text-align: left;
  }
  :deep(.van-cell-group__title){
    color:red;
  }
</style>