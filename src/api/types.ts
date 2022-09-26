export type CommandCodeType = 
  "9012" | // 健康请求
  "0039" | // 定位请求
  "0305" | // GPS上传间隔
  "2815" | // 心率上传间隔
  "9113" | // 体温上传间隔
  "0079" // 计步器开关

export interface CommandReq{
  AccessToken:string;
  Imei:string;
  Time:string;
  CommandCode:CommandCodeType;
  CommandValue?:string;
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

// track 定位
export interface TrackReq extends DataReq{
  MapType:"Baidu" | "Google";
}
export interface TrackResult extends Array<any>{
  "GpsTime": string,
  "Lat": number,
  "Lng": number,
  "PosType": string,
  "Speed": number,
  "Direction": number 
}