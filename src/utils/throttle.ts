export default function throttle(callback:(...args:any[])=>any, callback2:(...args:any[])=>any, delay:number){
  let pre_time:number;
  return function(...args:any[]){
    if(pre_time){
      let cur_time = Date.now();
      console.log("距离上次请求时间:", cur_time-pre_time, "节流时间:", delay)
      if(cur_time-pre_time > delay){
        console.log("节流通过")
        //@ts-ignore
        callback.call(this, ...args)
        pre_time = cur_time;
      }
      else{
        console.log("触发节流 delay",delay)
        //@ts-ignore
        callback2.call(this)
      }
    }
    else{
      // 第一次请求不节流
      pre_time = Date.now();
      //@ts-ignore
      callback.call(this, ...args)
    }
  }
}