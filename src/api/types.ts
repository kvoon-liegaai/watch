export interface MyResponse<T>{
  Code:number;
  Message:string;
  Result:T
}

export interface DataReq  {
  AccessToken:string;
  Imei:string;
  BeginTime:string;
  EndTime:string;
}

//HeartRate
export type HeartRateReq = DataReq

export interface HeartRateResult {
  HeartRate:number;
  Hrtime:unknown;
}[]

//Temperature
export type TemperatureReq = DataReq;
export interface TemperatureResult {
  Temperature:number;
  TemperatureTime:unknown;
}[]

//Steps
export type StepsReq = DataReq;
export interface StepsResult {
  Imei:string;
  Steps:number;
  Distance:number;
  Calorie:number;
}[]