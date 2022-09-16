import {defineStore} from "pinia"
export const useAuthStore = defineStore("authStore",{
  state:()=>{
    return {
      Imei:"",
      AppId:"381",
      AppKey:"CAEED868-C695-43EE-8941-9BDC5D551564"
    }
  },
  actions:{
    saveImei(Imei:string){
      console.log("authStore", Imei)
      this.Imei = Imei;
    }
  }
})