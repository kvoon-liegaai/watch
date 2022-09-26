export function hideAll(statusObj:any):any{
  for (const key in statusObj) {
    if (Object.prototype.hasOwnProperty.call(statusObj, key)) {
      statusObj[key] = false;
    }
  }
  
}
export function showKB(statusObj:any, targetKey:string){
  hideAll(statusObj);
  statusObj[targetKey] = true;
}