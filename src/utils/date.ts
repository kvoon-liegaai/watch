function formatDate(date:Date){
  const y = date.getUTCFullYear()
  let m:string | number = date.getUTCMonth();
  m = m < 10 ? "0" + m : m;
  m = Number(m) + 1;
  let d:string | number = date.getUTCDate();
  d = d < 10 ? "0" + d : d;
  let h:string | number = date.getUTCHours();
  h = h < 10 ? "0" + h : h;
  let M:string | number = date.getUTCMinutes();
  M = M < 10 ? "0" + M : M;
  let s:string | number = date.getUTCSeconds();
  s = s < 10 ? "0" + s : s;
  
  return `${y}-${m}-${d} ${h}:${M}:${s}`
}

export function getBEdate(){
  const date = new Date();
  const Bdate:Date = new Date(date.getTime() - 3 * 24*60*60*1000) // 3 * 24 hours
  const Edate:Date = new Date(date.getTime() + 60 * 1000);
  const BeginTime = formatDate(Bdate)
  const EndTime = formatDate(Edate)
  console.log('BeginTime',BeginTime)
  console.log('EndTime',EndTime)
  return {
    BeginTime,
    EndTime
  }
}