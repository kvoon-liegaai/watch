<template>
  <van-overlay :show="isLoading">
    <div class="wrapper" @click.stop @touch.stop>
      <van-loading type="circular" size="24px" text-color="white">检测中</van-loading>
    </div>
  </van-overlay>
  
  <van-button class="cmdBtn" type="primary" round size="small"  @touchend="trySendHealthCommand">开始检测</van-button>

  <div id="ht">
    <!-- 心率 -->
    <div class="card card-heart">
      <van-row>
        <van-col span="8" class="heart">
          <div class="icon-wrapper">
            <heart-rate theme="outline" size="40" fill="#ff7a7a"/>      
          </div>
        </van-col>
        <!-- TODO: skeleton component -->
        <van-col span="16">
          <div class="title">
            <span>
              心率
              <span class="subtitle">(BPM)</span>
            </span>
          </div>
          <div class="desc">
            <span class="value">{{heartRateData}}</span>
            <span class="unit">次/每分钟</span>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 体温 -->
    <div class="card card-heat">
      <van-row>
        <van-col span="8">
          <div class="icon-wrapper">
            <thermometer theme="multi-color" size="40" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']"/>
          </div>
        </van-col>
        <van-col span="16">
          <div class="title">
            <span>体温
              <span class="subtitle">(Celsius)</span>
            </span>
          </div>
          <div class="desc">
            <span class="value">{{temperatureData}}</span>
            <span class="unit">℃</span>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 步数 -->
    <div class="card card-step">
      <van-row class="row-step">
        <van-col span="8">
          <div class="icon-wrapper">
            <foot theme="multi-color" size="40" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']"/>
          </div>
        </van-col>
        <van-col span="16">
          <div class="title">
            <span>步数</span>
          </div>
          <div class="desc">
            <span class="value">{{stepsData}}</span>
            <span class="unit">步</span>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 血压 -->
    <div class="card card-step">
      <van-row class="row-step">
        <van-col span="8" style="display:flex;align-items:center">
          <div class="icon-wrapper" style="">
            <heart theme="outline" size="40" fill="#ff7a7a"/>
          </div>
        </van-col>
        <van-col span="16">
          <div class="title">
            <span>
              血压
              <span class="subtitle">(mmHg)</span>
            </span>
          </div>
          <div class="desc">
            <span class="unit">高压 </span>
            <span class="value">{{BloodPressureSystolicData}}</span>
            <span class="unit">低压 </span>
            <span class="value">{{BloodPressureDiastolicData}}</span>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- 血氧 -->
    <div class="card card-step">
      <van-row class="row-step">
        <van-col span="8">
          <div class="icon-wrapper">
            <halo theme="two-tone" size="36" :fill="['#333' ,'#ff7a7a']"/>
          </div>
        </van-col>
        <van-col span="16">
          <div class="title">
            <span>血氧</span>
          </div>
          <div class="desc">
            <span class="value">{{BloodOxygenData}}</span>
            <span class="unit">%</span>
          </div>
        </van-col>
      </van-row>
    </div>
    <!-- <div style="padding:15px;">
      <van-button type="primary" round
        @touchend="acquireHeartRate"
        >
        心率</van-button>
    </div>
    <div style="padding:15px;">
      <van-button type="primary" round
        @touchend="acquireTemperature">
        温度</van-button>
    </div>
    <div style="padding:15px;">
      <van-button type="primary" round
        @touchend="acquireSteps">
        步数</van-button>
    </div> -->
  </div>
</template>
<script setup lang="ts">
  // 图标
  import {HeartRate, Thermometer,Foot, Heart, Halo} from "@icon-park/vue-next"
  // vant 组件
  import { Notify } from "vant"
  // pinia
  import {useHealthStore} from "@/stores/healthStore"
  import {useAuthStore} from "@/stores/authStore"
  // api
  import {sendCommand} from "@/api"
  // types
  import {CommandReq, DataReq, HeartRateReq, TemperatureReq, StepsReq,BloodPressureReq, BloodOxygenReq} from "@/api/types"
  // vue
  import {onMounted, onUnmounted, ref} from "vue"
  import type {Ref} from "vue"
  // vueuse
  import {useEventBus} from "@vueuse/core"
  import type {Title} from "@/types" // 标题类型
  // token
  import {reqToken} from "@/utils/reqToken"
  import {getAccessToken, getUserId} from "@/utils/auth"
  // utils time
  import {getBEdate} from "@/utils/date"
  
  
  // 遮罩层
  let isLoading = ref<boolean>(false)
  /* 主动发起检测请求 */
  const authStore = useAuthStore();
  async function trySendHealthCommand(){
    // prepare params for sendcommand
    const params:CommandReq = {
      AccessToken:getAccessToken(),
      Imei:authStore.Imei,
      Time:String(Date.now()),
      CommandCode:"9012", // 9012 健康请求 0039 定位请求
      ReqId:getUserId()
    }
    // try send health command
    try {
      // loading status
      isLoading.value = true;
      const res = await sendCommand(params);
      console.log('health res',res)
    } catch (error) {
      Notify({type:"danger",message:`健康检测:${error}`});
    } finally{
      isLoading.value = false;
    }
    await update();
  }
  // 获取请求 params
  function getDataReq():DataReq{
    const AccessToken = getAccessToken();
    const {BeginTime, EndTime} = getBEdate();
    const params: DataReq = {
      AccessToken,
      Imei:authStore.Imei,
      BeginTime,
      EndTime
    }
    return params;
  }
  
  //store
  const healthStore = useHealthStore();
  /* HeartRate */
  //data
  const heartRateData:Ref<string> = ref("0");
  //method
  async function acquireHeartRate(){
    const params:HeartRateReq = getDataReq();
    try {
      await healthStore.reqHeartRate(params);

      const length = healthStore.heartRates.length;
      heartRateData.value = length > 0 ? healthStore.heartRates[length-1].HeartRate : "0";
    } catch (error) {
      console.log(error)
      Notify({type:"warning",message:`心率更新异常:${error}`})
    }
  }
  
  /* Temperature */
  const temperatureData:Ref<number> = ref(0);
  async function acquireTemperature(){
    const params:TemperatureReq = getDataReq();
    try {
      await healthStore.reqTemperature(params);

      const length = healthStore.temperatures.length;
      temperatureData.value = length > 0 ? healthStore.temperatures[length-1].Temperature : 0;
    } catch (error) {
      Notify({type:"warning",message:` 体温更新异常:${error}`})
    }
  }

  /*Steps*/
  const stepsData:Ref<number> = ref(0)
  async function acquireSteps(){
    const params:StepsReq = getDataReq();
    try {
      await healthStore.reqSteps(params);
      stepsData.value = healthStore.steps.Steps;
    } catch (error) {
      Notify({type:"warning",message:`步数更新异常:${error}`})
    }
  }

  /* Blood Pressure */
  const BloodPressureSystolicData = ref<number>(0); // 收缩压
  const BloodPressureDiastolicData = ref<number>(0); // 舒展压
  async function acquireBloodPressure(){
    const params:BloodPressureReq = getDataReq();
    try {
      await healthStore.reqBloodPressure(params);
      const length = healthStore.bloodPressures.length;
      BloodPressureSystolicData.value = length > 0 ? healthStore.bloodPressures[length - 1].Systolic : 0;
      BloodPressureDiastolicData.value = length > 0 ? healthStore.bloodPressures[length - 1].Diastolic : 0;
    } catch (error) {
      Notify({type:"warning",message:`血压更新异常:${error}`}) 
    }
  }

  /* Blood Oxygen */
  const BloodOxygenData = ref<number>(0)
  async function acquireBloodOxygen(){
    const params:BloodOxygenReq = getDataReq();
    try {
      await healthStore.reqBloodOxygen(params);
      const length = healthStore.bloodOxygens.length;
      BloodOxygenData.value = length > 0 ? healthStore.bloodOxygens[length - 1].BloodOxygen : 0;
    } catch (error) {
      Notify({type:"warning",message:`血压更新异常:${error}`}) 
    }
  }

  async function update(){
    try {
      await acquireHeartRate();
      await acquireTemperature();
      await acquireSteps();
      await acquireBloodPressure();
      await acquireBloodOxygen();
    } catch (error) {
      console.error("update errror", error)
    }
  }
  let timer:number;
  onMounted(async ()=>{
    // emit change title
    const titleBus = useEventBus<Title>("titleBus")
    titleBus.emit("健康")
    //token
    await reqToken();
    // update data when page is mounted
    await update();
    // Data is updated every half minute
    timer = setInterval(async ()=>{
      await update();
    }, 5*1000)
  })
  onUnmounted(()=>{
    // stop data update operation
    clearInterval(timer)
  })
</script>

<style lang="scss" scoped>

  // 发送命令按钮
  .cmdBtn{
    position: fixed;
    bottom:80px;
    left: 0;
    right: 0;
    margin:0 auto;
    width:100px;
  }
  // 遮罩层
   .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  #ht{
    display:flex;
    flex-direction: column;
    &>*{
      flex-grow: 1;
    }
    .card{
      background-color:$theme-box;
      margin:10px 15px;
      background-color: #fff;
      padding:12px;
      border-radius:15px;
      &:last-child{
        margin-bottom:75px;
      }
      .icon-wrapper{
        & {
          //background-color: #bfc;
        }
        width:100%;
        //padding:30px 0;
        padding:8px 0;
        border-radius: 25px;
        background: #ffffff;
        box-shadow:  5px 5px 5px #d9d9d9,
                    -5px -5px 5px #ffffff;
        &::after{
          content:"";
          display:table;
        }
      }
      .title{
        //font-size:larger;
        font-size:normal;
        line-height:1.5;
        white-space: nowrap;
        &>span{
          display: inline-block;
          border-bottom: 1.5px solid #f1f1f1;
          //padding:0px 60px;
          width:180px;
        }
        .subtitle{
          font-size:xx-small;color:gray
        }
      }
      .desc{
        padding-top:10px;
        line-height: 1.5;
        .value{
          //font-size:44px;
          font-size:large;
          margin-right:5px;
        }
        .unit{
          //font-size:22px;
          font-size:small;
        }
      }
    }
    .card-heart{
      @extend .card;
      .heart {
        color: #e00;
        transform-origin: center;
        @keyframes beat{
          to { transform: scale(1.1); }
        }
        .icon-wrapper{
          .i-icon.i-icon-heart-rate{
            animation: beat .25s infinite alternate;
          }
        }
      }
    }
  }
</style>