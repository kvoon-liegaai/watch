import type {Ref} from 'vue';
import {Notify} from "vant";
/**
 * 
 * @param wrapperState 遮罩层显示状态
 * @param message 提示消息
 * @param time 超时时长
 */
export function onLoadTimeout(wrapperState:Ref<boolean>,message:string, time:number):void{
  setTimeout(() => {
    wrapperState.value = false;
    Notify({type:"warning", message})
  }, time)
}