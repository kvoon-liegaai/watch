import {TokenResult} from "@/api/types"


/* token */
// save token
export function setToken(tokenResult: TokenResult){
  const {UserId, CustomerName, AccessToken, Expire} = tokenResult;
  localStorage.setItem("USER_ID",JSON.stringify(UserId));
  localStorage.setItem("CUSTOMER_NAME",CustomerName);
  localStorage.setItem("ACCESS_TOKEN",AccessToken);
  localStorage.setItem("EXPIRE",JSON.stringify(Expire));
  console.log("token 本地存储成功")
}

// get access token
export function getAccessToken():string{
  return localStorage.getItem("ACCESS_TOKEN") || "";
}

// get expire
export function getExpire(){
  return localStorage.getItem("EXPIRE") || "";
}

// get user id
export function getUserId(){
  return localStorage.getItem("USER_ID") || "";
}

/* login time */
// save login time
export function setLoginTime(login_time:string){
  localStorage.setItem("LOGIN_TIME",login_time)
  console.log("login time 本地存储成功")
}

export function getLoginTime():string{
  return localStorage.getItem("LOGIN_TIME") || "";
}


/* removeAuth */
export function removeAuth(){
  localStorage.removeItem("USER_ID");
  localStorage.removeItem("CUSTOMER_NAME");
  localStorage.removeItem("ACCESS_TOKEN");
  localStorage.removeItem("EXPIRE");
  localStorage.removeItem("LOGIN_TIME")
}