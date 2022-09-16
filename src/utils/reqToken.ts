import {Md5} from "ts-md5"
import {setToken, setLoginTime} from "./auth";
import {getToken} from "@/api"

//登录信息 store
import {useAuthStore} from "@/stores/authStore"
import { storeToRefs } from "pinia";

export async function reqToken(){
  // appkey appid from store
  const authStore = useAuthStore();
  const {AppKey, AppId} = storeToRefs(authStore)
  // current time
  const Timestamp = String(Date.now());
  // md5
  const Password = Md5.hashStr(`${AppKey.value}${AppId.value}${Timestamp}`);
  console.log('Password',Password)
  try {
    const res = await getToken({Password, AppId:AppId.value, Timestamp})
    console.log('get token success',res)
    
    // save the token to the localStorage
    const {Result} = res;
    setToken(Result) 
    
    // save the latest login time to the localStorage
    setLoginTime(Timestamp);

    return Promise.resolve("reqToken success")
  } catch (error) {
    return Promise.reject(`get Token fail: ${error}`) 
  }
}