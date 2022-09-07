import axios, {AxiosRequestConfig} from "axios";

import { MyResponse } from "./types";

const instance = axios.create({
  baseURL:"http://127.0.0.1:4523/mock/1514334",
  timeout: 1000,
})

instance.interceptors.request.use((config)=>{
  //@ts-ignore
  config.headers["Authorization"] ="1234"
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
    console.log('data',data)
    return data.Code === 1
      ? data
      : Promise.reject(data.Message)
  } catch (error) {
    return Promise.reject(error)
  }
}