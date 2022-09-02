import {request} from "./request"

import {HeartRateReq} from "@/api/types"

export const  getHeartRateByTime = async (params:HeartRateReq)=>(
  await request.post("/api/heartrate/get_heartrate_bytime",params,{
    headers:{
      'Content-Type': 'application/json'
    }
  })
)