import {defineStore} from "pinia"

import {
  MyResponse, 
  HeartRateReq, HeartRateResult, 
  TemperatureReq, TemperatureResult,
  StepsReq, StepsResult
} from "@/api/types"

import {
  getHeartRateByTime,
  getTemperatureByTime,
  getStepsByTime, 
} from "@/api"


export const useHealthStore = defineStore("healthStore",{
  state:()=>{
    return {
      heartRates:[] as unknown,
      temperatures:[] as unknown,
      steps: [] as unknown,
    }
  },
  actions:{
    /**
     * 获取心率数据
     * @param params - 请求参数所需参数
     * @returns Promise
     */
    async reqHeartRate(params:HeartRateReq){
      try {
        const res:Awaited<Promise<MyResponse<HeartRateResult>>> = await getHeartRateByTime(params);
        const Result = res.Result
        this.heartRates = Result
        return Promise.resolve("刷新成功")
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async reqTemperature(params:TemperatureReq){
      try {
        const res:Awaited<Promise<MyResponse<TemperatureResult>>> = await getTemperatureByTime(params);
        const Result = res.Result
        this.temperatures= Result
        return Promise.resolve("刷新成功")
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async reqSteps(params:StepsReq){
      try {
        const res:Awaited<Promise<MyResponse<StepsResult>>> = await getStepsByTime(params);
        const Result = res.Result
        this.steps = Result
        return Promise.resolve("刷新成功")
      } catch (error) {
        return Promise.reject(error);
      }
    },
  }
})