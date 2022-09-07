import {request} from "./request"

import {
  HeartRateReq, HeartRateResult,
  TemperatureReq, TemperatureResult,
  StepsReq, StepsResult,
} from "@/api/types"

export const getHeartRateByTime = async (params:HeartRateReq)=>{
  return await request<HeartRateResult>({
    url:"/api/heartrate/get_heartrate_bytime",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getTemperatureByTime = async (params:TemperatureReq)=>{
  return await request<TemperatureResult>({
    url:"/api/temperature/get_temperature_bytime",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getStepsByTime = async (params: StepsReq) => {
  return await request<StepsResult>({
    url:"/api/steps/get_steps_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}