export const apiList = {
  "getHeartrateByTime":"/api/heartrate/get_heartrate_bytime",
  "getTemperatureByTime":"/api/heartrate/get_heartrate_bytime"
}

export type ApiKeyType = keyof typeof apiList

export interface ApiKeyDataType{
  "getHeartrateByTime":{
    Result:[
      HeartRate:number,
      HrTime:string
    ],
    Code:number,
    Message:string
  },
  "getTemperatureByTime":{
    Result:[
      Temperature:number,
      TemperatureTime:string
    ],
    Code:number,
    Message:string
  }
}