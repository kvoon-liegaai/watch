import {request} from "./request"

import {
  MyResponse,
  CommandReq,
  TokenReq,TokenResult,
  HeartRateReq, HeartRateResult,
  TemperatureReq, TemperatureResult,
  StepsReq, StepsResult,
  BloodPressureReq, BloodPressureResult,
  BloodOxygenReq,BloodOxygenResult,
  TrackReq, TrackResult
} from "@/api/types"
// 
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

export const getToken = async (params:TokenReq):Promise<MyResponse<TokenResult>> => {
  return await request<TokenResult>({
    url:"/token/get_token",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getHeartRateByTime = async (params:HeartRateReq):Promise<MyResponse<HeartRateResult>> =>{
  return await request<HeartRateResult>({
    url:"/heartrate/get_heartrate_bytime",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getTemperatureByTime = async (params:TemperatureReq): Promise<MyResponse<TemperatureResult>>=>{
  return await request<TemperatureResult>({
    url:"/temperature/get_temperature_bytime",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getStepsByTime = async (params: StepsReq):Promise<MyResponse<StepsResult>> => {
  return await request<StepsResult>({
    url:"/steps/get_steps_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}

export const getBloodPressureByTime = async (params:BloodPressureReq):Promise<MyResponse<BloodPressureResult>> => {
  return await request<BloodPressureResult>({
    url:"/bloodpressure/get_bloodpressure_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}

export const getBloodOxygenByTime = async (params:BloodOxygenReq):Promise<MyResponse<BloodOxygenResult>> => {
  return await request<BloodOxygenResult>({
    url:"/bloodoxygen/get_bloodoxygen_bytime",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}

export async function getTrack(params:TrackReq):Promise<MyResponse<TrackResult>>{
  return await request<TrackResult>({
    url:"/track/get_track_info",
    method:"POST",
    data: params,
    headers:{
      'Content-Type' : "application/json"
    }
  })
}