import {defineStore} from "pinia"

import {
  MyResponse, 
  HeartRateReq, HeartRateResult, 
  TemperatureReq, TemperatureResult,
  StepsReq, StepsResult,
  BloodPressureReq, BloodPressureResult,
  BloodOxygenReq, BloodOxygenResult,
} from "@/api/types"

import {
  getHeartRateByTime,
  getTemperatureByTime,
  getStepsByTime,
  getBloodPressureByTime,
  getBloodOxygenByTime
} from "@/api"

export const useHealthStore = defineStore("healthStore",{
  state:()=>{
    return {
      heartRates:[{HeartRate:"0", Hrtime:""}],
      temperatures:[{Temperature:0, TemperatureTime:""}],
      steps: {Imei:"",Steps:0,Distance:0.0,Calorie:0.0},
      bloodPressures:[{"Systolic":0, "Diastolic":0, "BpTime":""}],
      bloodOxygens:[{"BloodOxygen":0,"BloodOxygenTime": ""}],
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
        return Promise.resolve("心率刷新成功")
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async reqTemperature(params:TemperatureReq){
      try {
        const res:Awaited<Promise<MyResponse<TemperatureResult>>> = await getTemperatureByTime(params);
        const Result = res.Result
        this.temperatures= Result
        return Promise.resolve("体温刷新成功")
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async reqSteps(params:StepsReq){
      try {
        const res:Awaited<Promise<MyResponse<StepsResult>>> = await getStepsByTime(params);
        const Result = res.Result
        this.steps = Result
        return Promise.resolve("步数刷新成功")
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async reqBloodPressure(params:BloodPressureReq){
      try {
        const res:Awaited<Promise<MyResponse<BloodPressureResult>>> = await getBloodPressureByTime(params);
        const Result = res.Result;
        this.bloodPressures = Result;
        return Promise.resolve("血压刷新成功")
      } catch (error) {
        return Promise.reject(error) 
      }
    },
    async reqBloodOxygen(params:BloodOxygenReq){
      try {
        const res:Awaited<Promise<MyResponse<BloodOxygenResult>>> = await getBloodOxygenByTime(params);
        const Result = res.Result;
        this.bloodOxygens = Result;
        return Promise.resolve("血氧刷新成功")
      } catch (error) {
        return Promise.reject(error) 
      }
    }
  }
})