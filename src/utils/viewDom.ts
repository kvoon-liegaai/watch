import type {Ref} from "vue"
export function safeUpdateViewWithArrayData(target:Ref, newHistoryVals:any[], propName:string){
  const length = newHistoryVals.length;
  target.value = length > 0 ? newHistoryVals[length - 1][propName] : "0";
}