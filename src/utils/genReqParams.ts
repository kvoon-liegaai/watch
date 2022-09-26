import { getBEdate } from "./date";
import { getAccessToken } from "./auth";
import { CommandReq,CommandCodeType, DataReq, TrackReq } from "@/api/types";
import { useAuthStore } from "@/stores/authStore";
import { getUserId } from "./auth";
import * as R from "ramda"

export function genReqParams<T extends DataReq | TrackReq>(map?:string):T{
  const AccessToken = getAccessToken();
  const {BeginTime, EndTime} = getBEdate();
  const authStore = useAuthStore();
  let base:any = {
    AccessToken,
    Imei:authStore.Imei,
    BeginTime,
    EndTime,
  }
  let params:T;
  if(map){
    base["MapType"] = map;
  }
  params = base;
  return params;
}

/*export function genCommandParams(commandCode:CommandCodeType, commandValue?:string):CommandReq{
  const authStore = useAuthStore();
  const result:CommandReq = {
    AccessToken:getAccessToken(),
    Imei:authStore.Imei,
    Time:String(Date.now()),
    CommandCode:commandCode, // 9012 健康请求 0039 定位请求
    ReqId:getUserId()
  }
  if(commandValue){
    result["CommandValue"] = commandValue
  }
  return result;
 }
*/

export const genCommandParams = R.curry((commandCode:CommandCodeType, commandValue?:string):CommandReq => {
  const authStore = useAuthStore();
  const result:CommandReq = {
    AccessToken:getAccessToken(),
    Imei:authStore.Imei,
    Time:String(Date.now()),
    CommandCode:commandCode, // 9012 健康请求 0039 定位请求
    ReqId:getUserId()
  }
  if(commandValue){
    result["CommandValue"] = commandValue
  }
  return result;
 }
)