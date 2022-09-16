
import axios, {AxiosRequestConfig} from "axios";

import { MyResponse } from "./types";

import { getAccessToken, getLoginTime, getExpire, removeAuth} from "@/utils/auth";

const instance = axios.create({
  baseURL:"/api",
  //baseURL:"https://mock.apifox.cn/m1/1514334-0-default",
  //timeout: 1000,
})


instance.interceptors.request.use((config)=>{
  config.headers = config.headers ? config.headers : {};
  // 获取token时不验证过期时间
  if(config.url!.indexOf("/token") > -1){ // ! non-nullable assertion operator 非空断言
    return config;
  }
  else{
    const login_time = getLoginTime();
    const current_time = Date.now();
    const expire = Number(getExpire());
    const gap = current_time - Number(login_time)
    if(gap / 1000 > expire){
      removeAuth();
      return Promise.reject("登录过期")
    }
    else{
      console.log("token: 有效期内")
    }
    // add access token to header
    try {
      const accessToken = getAccessToken();
      config.headers["Authorization"] = accessToken;
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return config;
},(error)=>{
  return Promise.reject(error)
})


instance.interceptors.response.use((response)=>{
  return response;
},(error)=>{
  console.log('error',error)
  return Promise.reject(error)
})

export const request = async <T>(config: AxiosRequestConfig)=>{
  try {
    // AxiosInstance.request 方法提供了泛型 用于指定 response.data 的类型
    const {data} = await instance.request<MyResponse<T>>(config);
    return data.Code === 0
      ? data
      : Promise.reject(data.Message)
  } catch (error) {
    return Promise.reject(error)
  }
}