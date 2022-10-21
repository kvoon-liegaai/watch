import {partial} from "ramda"

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

export const sendCommand = async (params:CommandReq):Promise<MyResponse<any>>=>{
  return await request<any>({
    url:"/command/sendcommand",
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}


const getData = async <T,K>(url:string, params:T):Promise<MyResponse<K>>=>{
  return await request<K>({
    url,
    method:"POST",
    data:params,
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

export const getToken = partial<string, TokenReq, Promise<MyResponse<TokenResult>>>(getData, ["token/get_token"])

export const getHeartRateByTime = partial<string, HeartRateReq, Promise<MyResponse<HeartRateResult>>>(getData, ["/heartrate/get_heartrate_bytime"])

export const getTemperatureByTime = partial<string, TemperatureReq, Promise<MyResponse<TemperatureResult>>>(getData, ["/temperature/get_temperature_bytime"])

export const getStepsByTime = partial<string, StepsReq, Promise<MyResponse<StepsResult>>>(getData, ["/steps/get_steps_bytime"])

export const getBloodPressureByTime = partial<string, BloodPressureReq, Promise<MyResponse<BloodPressureResult>>>(getData, ["/bloodpressure/get_bloodpressure_bytime"])

export const getBloodOxygenByTime = partial<string, BloodOxygenReq, Promise<MyResponse<BloodOxygenResult>>>(getData, ["/bloodoxygen/get_bloodoxygen_bytime"])

export const getTrack = partial<string, TrackReq, Promise<MyResponse<TrackResult>>>(getData, ["/track/get_track_info"])
