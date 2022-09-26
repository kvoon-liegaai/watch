export default function debounce(callback:()=>any, callback2:()=>any, delay:number){
  let timer:number;
  return function (...args:any[]){
    if(timer){
      clearTimeout(timer);
      console.log("clearTimeout")
      timer = setTimeout(()=>{
        //@ts-ignore
        callback.call(this, ...args)
      },delay)
      console.log("settimeout", timer)
      //@ts-ignore
      callback2.call(this)
    }
    else{
      timer = setTimeout(()=>{
        //@ts-ignore
        callback.call(this,...args)
      })
      console.log("settimeout", timer)
    }
  }
}