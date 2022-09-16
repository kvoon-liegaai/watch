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
          <div class="icon-wrapper" style="display:flex;justify-content:center">
            <Icon icon="healthicons:blood-pressure-2-outline" style="font-size:48px;margin-left:25px;"/><Icon icon/>
            <!-- <heart theme="outline" size="40" fill="#ff7a7a"/> -->
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
              <svg t="1663323461256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1314" width="40" height="40"><path d="M0 512a512 512 0 1 0 1024 0A512 512 0 1 0 0 512z" fill="#FF6655" p-id="1315"></path><path d="M521.572 459.446c0 23.477-117.57 130.031-117.57 252.839a121.544 121.544 0 0 0 117.57 126.42c65.016 0 117.57-60.862 117.57-126.42 1.445-120.46-116.125-228.459-117.57-252.84z m-152.065-210.4a147.37 147.37 0 0 0-15.351-8.307 78.019 78.019 0 0 0-20.77-5.96 75.671 75.671 0 0 0-12.46-2.708c-2.71-1.445-5.418-1.445-8.308-2.71a10.836 10.836 0 0 1-5.418-5.598 10.475 10.475 0 0 1-2.89-6.863 14.087 14.087 0 0 1 7.044-11.016 28.354 28.354 0 0 1 16.615-4.154 28.715 28.715 0 0 1 16.615 4.154 34.133 34.133 0 0 1 8.308 11.016 14.99 14.99 0 0 0 5.418 6.863 10.475 10.475 0 0 0 7.043 2.709 11.739 11.739 0 0 0 8.308-4.154 10.114 10.114 0 0 0 2.709-8.307 36.12 36.12 0 0 0-2.71-11.017 29.438 29.438 0 0 0-8.307-11.017 73.143 73.143 0 0 0-15.35-8.307 80.547 80.547 0 0 0-20.77-3.07 72.24 72.24 0 0 0-26.187 4.153 30.16 30.16 0 0 0-16.615 12.462 31.605 31.605 0 0 0-5.599 19.505 29.257 29.257 0 0 0 5.599 19.324 33.23 33.23 0 0 0 15.17 12.461 227.556 227.556 0 0 0 23.478 8.308 137.617 137.617 0 0 1 16.616 4.153 18.06 18.06 0 0 1 9.752 6.863 16.435 16.435 0 0 1 4.154 11.197 19.144 19.144 0 0 1-6.863 13.726 29.799 29.799 0 0 1-19.505 5.599 33.05 33.05 0 0 1-13.725-2.89 13.003 13.003 0 0 1-8.489-6.502 77.477 77.477 0 0 1-5.598-11.016 16.976 16.976 0 0 0-5.599-8.308 9.572 9.572 0 0 0-6.863-2.709 8.308 8.308 0 0 0-8.307 4.154 10.114 10.114 0 0 0-2.71 8.308 26.187 26.187 0 0 0 5.6 16.434 36.12 36.12 0 0 0 15.17 13.906 56.528 56.528 0 0 0 31.785 6.863 54.18 54.18 0 0 0 27.632-5.418 39.19 39.19 0 0 0 18.06-15.35 40.093 40.093 0 0 0 5.418-22.034 30.16 30.16 0 0 0-3.973-16.615c0.18-1.264-3.973-5.418-8.127-8.127z m118.834 36.12V255.91a46.414 46.414 0 0 0-4.153-21.13 26.187 26.187 0 0 0-12.462-12.462 59.237 59.237 0 0 0-24.742-5.598 54.18 54.18 0 0 0-23.658 4.153 26.548 26.548 0 0 0-13.726 9.572 21.491 21.491 0 0 0-4.154 12.462 10.475 10.475 0 0 0 2.71 7.043 11.378 11.378 0 0 0 7.223 2.89c2.89 0 5.599 0 5.599-1.445a13.906 13.906 0 0 0 4.154-6.863 44.97 44.97 0 0 1 8.307-7.946 33.772 33.772 0 0 1 13.906-2.71c6.863 0 12.462 1.265 13.726 4.154a19.866 19.866 0 0 1 4.154 13.726c-5.418 1.445-9.572 2.89-13.726 4.154a152.246 152.246 0 0 1-15.35 4.153c-5.419 1.445-9.573 1.445-11.017 2.89a29.077 29.077 0 0 0-18.06 9.572 25.645 25.645 0 0 0-6.863 16.615 23.84 23.84 0 0 0 4.154 13.906 23.297 23.297 0 0 0 11.016 9.572 28.715 28.715 0 0 0 16.615 4.154 36.12 36.12 0 0 0 18.06-4.154 55.263 55.263 0 0 0 16.615-11.017 28.896 28.896 0 0 0 8.308 9.753 12.461 12.461 0 0 0 6.863 4.154 19.144 19.144 0 0 0 8.307-2.89 7.585 7.585 0 0 0 4.154-6.863c0-1.445-1.445-4.154-2.709-9.752a16.796 16.796 0 0 1-3.973-11.017z m-23.478-11.016a48.04 48.04 0 0 1-2.709 18.06 30.883 30.883 0 0 1-9.752 8.127 21.853 21.853 0 0 1-13.725 2.89 16.435 16.435 0 0 1-11.198-4.154 13.184 13.184 0 0 1-4.153-9.752 8.488 8.488 0 0 1 4.153-8.308 24.923 24.923 0 0 0 7.044-4.154 100.775 100.775 0 0 0 13.725-2.709 75.13 75.13 0 0 0 15.351-4.154z m152.246-63.57a57.25 57.25 0 0 0-19.324-11.92 77.658 77.658 0 0 0-26.368-4.154 64.293 64.293 0 0 0-24.922 4.154 45.872 45.872 0 0 0-19.325 12.461 49.304 49.304 0 0 0-12.461 20.588 85.785 85.785 0 0 0 0 52.735 60.5 60.5 0 0 0 12.461 20.589 57.25 57.25 0 0 0 19.325 12.461 69.53 69.53 0 0 0 24.922 4.154 77.658 77.658 0 0 0 26.368-4.154 45.872 45.872 0 0 0 19.324-12.461 49.304 49.304 0 0 0 12.461-20.589 85.785 85.785 0 0 0 0-52.735 49.304 49.304 0 0 0-12.461-21.31z m-23.478 76.032a27.09 27.09 0 0 1-22.214 11.016 25.284 25.284 0 0 1-16.615-5.418 37.745 37.745 0 0 1-11.016-13.906 52.013 52.013 0 0 1-4.154-20.769 59.237 59.237 0 0 1 4.154-22.755 26.91 26.91 0 0 1 11.016-13.726 28.715 28.715 0 0 1 16.615-4.154 27.09 27.09 0 0 1 22.214 11.017 47.678 47.678 0 0 1 8.308 30.521 44.428 44.428 0 0 1-8.308 27.993z m147.911 12.461a20.227 20.227 0 0 0-11.016-2.89H683.57a16.976 16.976 0 0 1 4.153-5.418 105.47 105.47 0 0 1 18.06-16.615 131.657 131.657 0 0 0 19.325-16.615 117.21 117.21 0 0 0 11.197-13.906 33.05 33.05 0 0 0 5.418-20.769 46.234 46.234 0 0 0-2.71-13.726 30.883 30.883 0 0 0-6.862-11.016 72.24 72.24 0 0 0-11.197-8.308 56.889 56.889 0 0 0-23.478-4.154 69.892 69.892 0 0 0-19.324 2.71 117.751 117.751 0 0 0-13.906 8.307 33.41 33.41 0 0 0-8.308 12.461 44.066 44.066 0 0 0-2.71 12.462 22.394 22.394 0 0 0 2.71 8.307 11.378 11.378 0 0 0 7.043 2.71 22.394 22.394 0 0 0 8.308-2.71c1.264-2.89 2.709-5.598 4.154-9.752a42.08 42.08 0 0 1 2.709-6.863 20.408 20.408 0 0 1 18.06-9.752 18.06 18.06 0 0 1 9.571 2.89 16.073 16.073 0 0 1 7.044 6.862 27.27 27.27 0 0 1 2.709 9.572 36.12 36.12 0 0 1-2.71 11.197 46.956 46.956 0 0 1-7.043 11.017 48.04 48.04 0 0 1-12.461 11.016 165.79 165.79 0 0 0-13.726 11.197 246.157 246.157 0 0 0-22.213 20.77 39.37 39.37 0 0 0-5.599 8.126 77.116 77.116 0 0 0-2.709 8.308 9.752 9.752 0 0 0 4.154 8.308 13.184 13.184 0 0 0 11.017 4.153h66.46a11.558 11.558 0 0 0 8.308-2.709 10.294 10.294 0 0 0 2.709-6.862c2.709-4.335 1.264-7.224-0.18-8.489z" fill="#FFFFFF" p-id="1316"></path></svg>
            <!-- <halo theme="two-tone" size="36" :fill="['#333' ,'#ff7a7a']"/> -->
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
  </div>
</template>
<script setup lang="ts">
  // 图标
  import {HeartRate, Thermometer,Foot, Heart, Halo} from "@icon-park/vue-next"// icon park
  import {Icon} from "@iconify/vue";
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
  import {onMounted, onUnmounted, ref, defineProps} from "vue"
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
  async function trySendHealthCommand():Promise<void>{
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
  async function acquireHeartRate():Promise<void>{
    const params:HeartRateReq = getDataReq();
    try  {
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
  async function acquireTemperature():Promise<void>{
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
  async function acquireSteps():Promise<void>{
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
  async function acquireBloodPressure():Promise<void>{
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
  async function acquireBloodOxygen():Promise<void>{
    const params:BloodOxygenReq = getDataReq();
    try {
      await healthStore.reqBloodOxygen(params);
      const length = healthStore.bloodOxygens.length;
      BloodOxygenData.value = length > 0 ? healthStore.bloodOxygens[length - 1].BloodOxygen : 0;
    } catch (error) {
      Notify({type:"warning",message:`血压更新异常:${error}`}) 
    }
  }

  async function update():Promise<void>{
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