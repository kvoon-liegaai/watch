<template>
  <!--遮罩-->
  <van-overlay :show="isSetting" style="z-index:9999;text-align:center;vertical-align:middle !important;">
    <div class="wrapper" @click.stop @touch.stop>
      <van-loading type="circular" size="24px" text-color="white" >设置中...</van-loading>
    </div>
  </van-overlay>

  <van-cell-group insert>
    <!-- 计步器开关 -->
    <van-cell title-class="cell-title" title="开启计步器">
      <template #right-icon>
        <van-switch :model-value="isPedometerChecked" size="24"
          @update:model-value="onPedometerCheckSwitch"/>
      </template>
    </van-cell>
    <!-- GPS上传时间间隔 -->
    <!-- @touchstart.stop="showKB(keyboardStatus, 'isGPSKBshow')" -->
    <van-field 
      clearable
      :rules="[{validator:validators.GPS}]"
      @blur="onInputFinished('GPS','0305',GPSTimeInterval, validators.GPS);keyboardStatus.isGPSKBshow = false"
      type="number"
      placeholder="10" label="GPS定位间隔" input-align="right" v-model.number="GPSTimeInterval" clickable
      ref="GPSFieldRef">
      <template #right-icon>
        <span>分钟</span>
      </template>
    </van-field>
    <!-- <van-number-keyboard
      v-model="GPSTimeInterval"
      :show="keyboardStatus.isGPSKBshow"
      :maxlength="6"
      @blur="onInputFinished('0305',GPSTimeInterval, validators.GPS);keyboardStatus.isGPSKBshow = false"
      close-button-text="完成"
    /> -->
    <!-- 体温上传时间间隔 -->
    <!-- @touchstart.stop="showKB(keyboardStatus, 'isTemperatureKBshow')" -->
    <van-field
      clearable
      type="number"
      @blur="onInputFinished('TEMPERATURE','9113',temperatureTimeInterval,validators.temperature);keyboardStatus.isTemperatureKBshow = false"
      :rules="[{validator:validators.temperature}]"
      placeholder="10" label="体温测量间隔" input-align="right" v-model.number.lazy="temperatureTimeInterval" clickable>
      <template #right-icon>
        <span>小时</span>
      </template>
    </van-field>
    <!-- <van-number-keyboard
      v-model="temperatureTimeInterval"
      :show="keyboardStatus.isTemperatureKBshow"
      :maxlength="6"
      @blur="onInputFinished('9113',temperatureTimeInterval,validators.temperature);keyboardStatus.isTemperatureKBshow = false"
      close-button-text="完成"
    /> -->
    <!-- 心率上传时间间隔 -->
    <!-- @touchstart.stop="showKB(keyboardStatus,'isHeartRateKBshow')" -->
    <van-field
    clearable
    type="number"
    @blur="onInputFinished('HEARTRATE','2815',heartRateTimeInterval,validators.heartRate);keyboardStatus.isHeartRateKBshow = false"
    :rules="[{validator:validators.heartRate}]"
    placeholder="500" label="心率测量间隔" input-align="right" v-model.number="heartRateTimeInterval" clickable>
      <template #right-icon>
        <span>秒</span>
      </template>
    </van-field>
    <!-- <van-number-keyboard
      v-model="heartRateTimeInterval"
      :show="keyboardStatus.isHeartRateKBshow"
      :maxlength="6"
      @blur="onInputFinished('2815',heartRateTimeInterval,validators.heartRate);keyboardStatus.isHeartRateKBshow = false"
      close-button-text="完成"
    /> -->
  </van-cell-group>

  <van-form @submit="setLinkmans(linkmans)" @failed="onFailed">
    <van-cell-group title="紧急联系人" style="background-color:transparent">
      <van-field
      v-for="(linkman, index) in linkmans"
      :key="index"
      v-model.trim ="linkmans[index]"
      type="tel"
      center
      clearable
      :label="'联系人'+(index+1)"
      placeholder="请输入电话号码"
      :rules="[{validator:validators.linkman}]"
      >
        <template #left-icon>
          <van-icon name="friends"/>
        </template>
      </van-field>
      <div style="margin:16px;">
        <van-button round block size="small" type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-cell-group>
  </van-form> 
  
</template>

<script setup lang="ts">
  import {ref, reactive, onMounted} from "vue"
  import { sendCommand } from "@/api";
  /* utils */
  import {genCommandParams} from "@/utils/genReqParams"
  // vant
  import { Notify} from "vant";
  // types
  import type {CommandCodeType, CommandReq, MyResponse} from "@/api/types"
  import type {FieldInstance } from 'vant';
  import type {FieldValue} from "@/types/"
  // ramda
  import {pipe, tap} from "ramda"
  //import {log} from "@/utils/FP"
  // localStorage
  import {getSetting, saveSetting,savePedometerSetting, saveLinkmansSetting} from "@/utils/auth"
  
  let isSetting = ref<boolean>(false);
  // 数字键盘状态
  const keyboardStatus = reactive({
    isGPSKBshow:false,
    isTemperatureKBshow:false,
    isHeartRateKBshow:false,
  })
  // 计步器开关
  const isPedometerChecked = ref<boolean>(true);
  function updateCheck(newCheckVal:boolean){
    isPedometerChecked.value = newCheckVal;
  }
  // GPS
  const GPSTimeInterval = ref<number|undefined>();// minute 
  const GPSFieldRef = ref<FieldInstance>()
  // 体温
  const temperatureTimeInterval = ref<number|undefined>(); // hours
  // 心率
  const heartRateTimeInterval = ref<number|undefined>(); // second
  // 联系人
  let linkmans = reactive<string[]>([])
  // Field校验函数
  const validators = {
    GPS:(val:FieldValue):true|string => Number(val) > 0 ? true : "请确保间隔时间为正整数",
    temperature:(val:FieldValue):true|string => Number(val) > 0 ? true : "请确保间隔时间为正整数",
    heartRate:(val:FieldValue):true|string => Number(val) >= 300 && Number(val) <= 65535 ? true : "请确保时间在300-65535秒内",
    linkman:(val:FieldValue):true|string=> {
      // 如果为空也通过验证
      if(!val) return true;
      return /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(String(val)) || /0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/.test(String(val)) ? true : "手机号格式有误"
    }
  }
  // 错误消息
  function onFailed(errInfo:{values:Array<any>,errors:Array<{name:string, message:string}>}){
    Notify({type:"warning",message:errInfo.errors[0].message})
  }
  

  /**
   * @remarks 
   * function: part of curried genCommandParams
   * @params commandValue - 请求命令值
   * */
  const genPedometerCommandParams = genCommandParams("0079");
  const runPedometerCheckSwitch = pipe<boolean[], string, CommandReq, Promise<MyResponse<any>>>(
    String,
    genPedometerCommandParams,
    sendCommand
  )
  /* 切换计步器开关 */
  async function onPedometerCheckSwitch(targetVal:boolean){
    try {
      // switch start
      isSetting.value = true;
      await runPedometerCheckSwitch(targetVal);
      updateCheck(targetVal)
      Notify({type:"success",message:'设置成功'})
      savePedometerSetting(targetVal);
    } catch (error) {
      Notify({type:"danger",message:`设置失败:${error}`})
    }
    finally{
      // switch end
      isSetting.value = false;
    }
  }


  // 输入结束
  async function onInputFinished(name:string, code:CommandCodeType, inputVal:FieldValue, validator:(val:FieldValue)=>boolean|string){
    console.log('inputVal',inputVal)
    const checkResult = validator(inputVal);
    if(typeof checkResult === "string"){
      onFailed({values:[inputVal],errors:[{name:code, message:checkResult}]})
      return
    }
    const params = genCommandParams(code,String(inputVal))
    console.log('(setting):command params',params)
    try {
      // setting start
      isSetting.value = true;
      const res = await sendCommand(params);
      console.log('(setting) res',res)
      saveSetting(name,inputVal)
      Notify({type:"success",message:"设置成功"})
    } catch (error) {
      Notify({type:"danger",message:`${error}`})
    }
    finally{
      // setting end
      isSetting.value = false;
    }
  }

  /* 设置紧急联系人 */
  const genLinkMansParams = genCommandParams("0001");
  function convertArrayToString(arr:string[]){
    let str = "";
    for(let i = 0; i < arr.length-1; i++){
      str += arr[i] + ","
    }
    str += arr[arr.length-1];
    return str;
  }
  const runSetLinkmans = pipe<any[], string, CommandReq, CommandReq, Promise<MyResponse<any>>>(
    convertArrayToString,
    genLinkMansParams,
    tap((x)=>console.log('设置紧急联系人请求参数:',x)),
    sendCommand
  )
  async function setLinkmans(linkmans:string[]|number[]){
    try {
      // switch start
      isSetting.value = true;
      await runSetLinkmans(linkmans);
      saveLinkmansSetting(linkmans);
      Notify({type:"success",message:'设置成功'})
    } catch (error) {
      Notify({type:"danger",message:`设置失败:${error}`});
    }
    finally{
      // switch end
      isSetting.value = false;
    }
  }

  onMounted(()=>{
    const setting = getSetting();
    console.log("setting")
    isPedometerChecked.value = setting.PEDOMETER
    GPSTimeInterval.value = setting.GPS
    temperatureTimeInterval.value = setting.TEMPERATURE
    heartRateTimeInterval.value = setting.HEARTRATE
    if(setting.LINKMANS){
      //@ts-ignore
      linkmans.push(...setting.LINKMANS);
    }
    else{
      //@ts-ignore
      linkmans.push(...["","",""])
    }
  })
 </script>

<style lang="scss" scoped>
  /*:deep(.van-cell-group__title){
    color:--van-gray-8;
  }*/
</style>