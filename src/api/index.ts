import {request} from "./request"

import {
  CommandReq,
  TokenReq,TokenResult,
  HeartRateReq, HeartRateResult,
  TemperatureReq, TemperatureResult,
  StepsReq, StepsResult,
  BloodPressureReq, BloodPressureResult,
  BloodOxygenReq,BloodOxygenResult,
} from "@/api/types"

export const sendCommand = async (params:CommandReq)=>{
  return await request<TokenResult>({
    url:"/command/sendcommand",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getToken = async (params:TokenReq) => {
  return await request<TokenResult>({
    url:"/token/get_token",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getHeartRateByTime = async (params:HeartRateReq)=>{
  return await request<HeartRateResult>({
    url:"/heartrate/get_heartrate_bytime",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getTemperatureByTime = async (params:TemperatureReq)=>{
  return await request<TemperatureResult>({
    url:"/temperature/get_temperature_bytime",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getStepsByTime = async (params: StepsReq) => {
  return await request<StepsResult>({
    url:"/steps/get_steps_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}

export const getBloodPressureByTime = async (params:BloodPressureReq) => {
  return await request<BloodPressureResult>({
    url:"/bloodpressure/get_bloodpressure_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}

export const getBloodOxygenByTime = async (params:BloodOxygenReq) => {
  return await request<BloodOxygenResult>({
    url:"/bloodoxygen/get_bloodoxygen_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}