<template>
  <div id="ht">
    <!-- 心率 -->
    <div class="card card-heart">
      <van-row>
        <van-col span="8" class="heart">
          <div class="icon-wrapper">
            <heart-rate theme="outline" size="48" fill="#ff7a7a"/>      
          </div>
        </van-col>
        <van-col span="16">
          <div class="title">
            <span>心率</span>
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
            <thermometer theme="multi-color" size="48" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']"/>
          </div>
        </van-col>
        <van-col span="16">
          <div class="title">
            <span>体温</span>
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
            <foot theme="multi-color" size="48" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']"/>
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
    <div style="padding:15px;">
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
    </div>
  </div>
</template>
<script setup lang="ts">
  // 图标
  import {HeartRate, Thermometer,Foot} from "@icon-park/vue-next"
  import {useHealthStore} from "@/stores/healthStore"
  import {HeartRateReq, TemperatureReq, StepsReq} from "@/api/types"
  import {onMounted, ref} from "vue"
  import type {Ref} from "vue"

  //store
  var healthStore = useHealthStore();

  /* HeartRate */
  //data
  const heartRateData:Ref<number> = ref(0);
  //method
  async function acquireHeartRate(){
    try {
      const params:HeartRateReq = {
        AccessToken:"1234",
        Imei:"1234",
        BeginTime:"1234",
        EndTime:"1234"
      }
      await healthStore.reqHeartRate(params);
      heartRateData.value = healthStore.heartRates[0].HeartRate
    } catch (error) {
      //TODO: Toast
      //console.log('Toast',error)
    }
  }
  const temperatureData:Ref<number> = ref(0);
  async function acquireTemperature(){
    try {
      const params:TemperatureReq = {
        AccessToken:"1234",
        Imei:"1234",
        BeginTime:"1234",
        EndTime:"1234"
      }
      await healthStore.reqTemperature(params);
      temperatureData.value = healthStore.temperatures[0].Temperature;
    } catch (error) {
      //TODO:Toast
      // console.log('error',error)
    }
  }
  const stepsData:Ref<number> = ref(0)
  async function acquireSteps(){
    try {
      const params:StepsReq = {
        AccessToken:"1234",
        Imei:"1234",
        BeginTime:"1234",
        EndTime:"1234"
      }
      await healthStore.reqSteps(params);
      stepsData.value = healthStore.steps[0].Steps;
    } catch (error) {
      //TODO:Toast
      // console.log('error',error)
    }
  }
  onMounted(()=>{
    setInterval(async ()=>{
      await acquireHeartRate();
      await acquireTemperature();
      await acquireSteps();
    },3000)
  })

</script>

<style lang="scss" scoped>
  #ht{
    display:flex;
    flex-direction: column;
    &>*{
      flex-grow: 1;
    }
    .card{
      background-color:$theme-box;
      margin:15px 15px;
      background-color: #fff;
      padding:15px;
      border-radius:15px;
      .icon-wrapper{
        width:100%;
        padding:30px 0;
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
        font-size:larger;
        line-height:1.5;
        &>span{
          display: inline-block;
          border-bottom: 1.5px solid #f1f1f1;
          padding:0px 70px;
        }
      }
      .desc{
        line-height: 1.5;
        .value{
          font-size:44px;
          margin-right:5px;
        }
        .unit{
          font-size:22px;
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