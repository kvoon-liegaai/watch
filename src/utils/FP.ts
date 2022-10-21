// function programming utils
// curried console log
/**
 * @remarks 柯里化的 console.log 接收一个描述字符串和一个值用于打印到控制台
 * 
 * @params frontString - 描述字符串
 * @params data - 要打印的值
 */

import {curry} from "ramda"

export const log = curry(<T>(frontString:string, data:T):T=>{
    console.log(`${frontString}: `,data);
    return data;
})