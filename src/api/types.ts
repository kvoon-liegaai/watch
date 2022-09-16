export interface CommandReq{
  AccessToken:string;
  Imei:string;
  Time:string;
  CommandCode:"9012" | "0039", // 9012 健康请求 0039 定位请求
  ReqId:string;
}

//请求
export interface DataReq  {
  AccessToken:string;
  Imei:string;
  BeginTime:string;
  EndTime:string;
}
//响应
export interface MyResponse<T>{
  Code:number;
  Message:string;
  Result:T
}

//Token
export type TokenReq = {
  Password:string;
  AppId:string;
  Timestamp:string;
} 
export interface TokenResult {
    AccessToken:  string;
    CustomerName: string;
    Expire:       number;
    UserId:       number;
}

//HeartRate
export type HeartRateReq = DataReq

export interface HeartRateResult extends Array<any> {
  HeartRate:string;
  Hrtime:unknown;
}[]

//Temperature
export type TemperatureReq = DataReq;
export interface TemperatureResult extends Array<any> {
  Temperature:number;
  TemperatureTime:unknown;
}[]

//Steps
export type StepsReq = DataReq;
export interface StepsResult extends Array<any> {
  Imei:string;
  Steps:number;
  Distance:number;
  Calorie:number;
}

// Blood Pressure
export type BloodPressureReq = DataReq;
export interface BloodPressureResult extends Array<any> {
  "Systolic": number;
  "Diastolic": number;
  "BpTime": string;
}

// Blood Oxygen
export type BloodOxygenReq = DataReq;
export interface BloodOxygenResult extends Array<any> {
  "BloodOxygen": number;
  "BloodOxygenTime": string;
}