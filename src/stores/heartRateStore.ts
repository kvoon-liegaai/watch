import {defineStore} from "pinia"

import {HeartRateReq} from "@/api/types"

import { getHeartRateByTime } from "@/api"

interface HeartRate {
  HeartRate:number;
  HrTime:number;
}

export const useHeartRateStore =  defineStore("heartRateStore",{
  state:()=>{
    return {
      heartRates:[] as Array<HeartRate>
    }
  },
  actions:{
    async reqHeartRate(params:HeartRateReq){
      try {
        const res = await getHeartRateByTime(params);
        const {Result} = res;
        console.log('Result',Result)
      } catch (error) {
        console.log('action error',error)
      }
    }
  }
})