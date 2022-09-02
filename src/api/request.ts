import axios, {AxiosInterceptorManager} from "axios";

export const request = axios.create({
  baseURL:"http://127.0.0.1:4523/m1/1514334-0-default",
  timeout: 1000,
})

request.interceptors.request.use((config)=>{
  //@ts-ignore
  config.headers["Authorization"] ="1234"
  return config;
},(error)=>{
  console.log('error',error)
  return Promise.reject(error)
})


request.interceptors.response.use((response)=>{
  return response.data;
},(error)=>{
  console.log('error',error)
  return Promise.reject(error)
})