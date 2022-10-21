// 加载 script 标签 引入 aimap
export function loadJS(src:string){
  return new Promise((resolve,reject)=>{
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src= src;
    document.body.appendChild(script);
      
    script.onload = ()=>{
      resolve("success");
    }
    script.onerror = ()=>{
      reject("fail");
    }
  })
}