import { getBEdate } from "./date";
import { getAccessToken } from "./auth";
import { DataReq, TrackReq } from "@/api/types";
import { useAuthStore } from "@/stores/authStore";
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