<template>
  <van-overlay :show="isLoading_wrapper" style="z-index:9999;text-align:center;vertical-align:middle;">
    <div class="wrapper" @click.stop @touch.stop >
      <van-loading type="circular" size="24px" text-color="white">loading</van-loading>
    </div>
  </van-overlay>
  <div ref="map" id="map" style="height:100%"></div>
  <div ref="mark" id="mark"></div>
  <!--  侧边按钮 -->
  <div class="side-btn-group">
    <div @touchend="trySendLocationCommand">
      <repositioning theme="multi-color" size="30" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>  
    </div>
    <div class="play-btn" v-if="isTrackLayerVisible">
      <play v-show="!isTrackLayerPlaying" @touchend="switchTrackPlayStatus" class="play-btn" theme="multi-color" size="30" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>
      <pause-one v-show="isTrackLayerPlaying" @touchend="switchTrackPlayStatus" class="play-btn" theme="multi-color" size="30" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>
    </div>
    <div v-if="isTrackLayerVisible" @touchend="switchMassMarkerLayer(result)">
      <transfer v-show="!hasMassMark" theme="filled" size="30" fill="#333" :strokeWidth="2"/>
      <transfer v-show="hasMassMark" theme="multi-color" size="30" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>
    </div>
  </div>
  <div class="sub-btn-group">
    <van-button class="history-btn" round plain hairline size="small" type="primary" @touchend="switchTrack(result)">
      <span v-show="!isTrackLayerVisible">查看历史轨迹</span>
      <span v-show="isTrackLayerVisible">关闭历史轨迹</span>
    </van-button>
  </div>
</template>

<script setup lang="ts">
  // icon
  import {Play,PauseOne,Transfer,Repositioning} from "@icon-park/vue-next"
  // vueuse
  import {useEventBus} from "@vueuse/core"
  // types
  import {Title} from "@/types/"
  import { CommandReq, MyResponse, TrackReq, TrackResult } from "@/api/types";
  // vue
  import { ref, onMounted, onUnmounted} from "vue";
  // pinia
  import { useAuthStore } from "@/stores/authStore";
  // api
  import {getTrack, sendCommand} from "@/api/"
  import { genReqParams } from "@/utils/genReqParams";
  import { Notify } from "vant";
  import { getAccessToken, getUserId } from "@/utils/auth";
  // utils
  import throttle from "@/utils/throttle";
  // isloading
  let isLoading_wrapper = ref<boolean>(false);
  //dom
  let map = ref(null);
  let mark = ref(null);
  let theMap:any = null;
  // 
  let newest_marker = ref<any>(null);
  //路径数据
  let result = ref<TrackResult>();
  let newest_loc = ref<Location>({Lng:0,Lat:0});
  //路径层
  let trackLayer:any = null;
  let isTrackLayerVisible = ref<boolean>(false);
  let isTrackLayerPlaying = ref<boolean>(false);
  // 撒点层
  let massMarkLayer:any = null;
  let hasMassMark = ref<boolean>(false);
  // 遮罩层
  let isLoading = ref<boolean>(false)

  /* 主动发起检测请求 */
  const authStore = useAuthStore();
  const trySendLocationCommand = throttle(
    async ():Promise<void>=>{
      // prepare params for sendcommand
      const params:CommandReq = {
        AccessToken:getAccessToken(),
        Imei:authStore.Imei,
        Time:String(Date.now()),
        CommandCode:"0039", // 9012 健康请求 0039 定位请求
        ReqId:getUserId()
      }
      // try send health command
      try {
        // loading status
        isLoading_wrapper.value = true;
        const res = await sendCommand(params);
        console.log("location commmand res",res)
        Notify({type:"success",message:"请求成功"})
      } catch (error) {
        Notify({type:"danger",message:`请求定位:${error}`});
      } finally{
        isLoading_wrapper.value = false;
      }
    },
    ()=>{
      isLoading_wrapper.value = true;
      setTimeout(()=>{
        Notify({type:"success",message:"请求成功"})
        isLoading_wrapper.value = false;
      },400)
    }, 
    5*60*1000,
  )

  // 加载 script 标签 引入aimap
  function LoadJs(src:string){
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

  // 初始化地图
  function initMap(Lng:number, Lat:number){
    // 指定 accessToken，用于服务鉴权
    window.aimap.accessToken = 'UFJGhyFdSzvm0ZbecYglp6CssgnDK7PZ';
    // 指定 baseApiUrl，用于指定服务地址，当处于私有化部署的环境中时，务必注意修改此项
    window.aimap.baseApiUrl = 'https://location-dev.newayz.com';
    theMap = new window.aimap.Map({
      container: map.value,
      // 地图中心点
      // center: [113.950442, 22.539902],//lng, lat
      center: [Lng, Lat],//lng, lat
      // 地图缩放级别
      zoom: 13,
      // 地图倾斜角度
      pitch: 0,
      // 地图旋转角度
      bearing: 0,
      // 地图样式
      style: 'aimap://styles/aimap/normal-v3',
      // style: `aimap://styles/aimap/darkblue-v5`,
      trackResize:true,//根据 dom 节点设置大小
      logoPosition:'top-left',
      dragRotate:true,

    });

    const nav = new window.aimap.NavigationControl({
      showCompass: false,
    });
    // 增加地图缩放按钮
    theMap.addControl(nav);
    // 增加地图罗盘
    theMap.addControl(nav, "top-right")
    // theMap.addControl(new window.aimap.CompassControl(),"top-right");
    // 添加图标
    // theMap.addImage("company-yellow","./img/local.svg", {type:"svg"})
    theMap.on("load",()=>{
      // 默认Marker
      newest_marker.value = new window.aimap.Marker({color:"tomato"})
          .setLngLat([Lng, Lat])
          .addTo(theMap);
      isLoading_wrapper.value = false;
    })
  }

  // Result ----> coordinates: number[][]
  function trackResultToCoordinates(result:TrackResult):number[][]{
    console.log(result)
    console.log("trackResultToCoordinates")
    let arr:number[][] = []
    result.forEach(item =>
      arr.push([item["Lng"], item["Lat"]])
    )
    return arr;
  }
  // 设置轨迹图层
  function setTrackLayer(result:TrackResult){
    const coordinates = trackResultToCoordinates(result);
    trackLayer = new window.aimap.TrackLayer({
      dataType: 'geojson',
      map:theMap,
      data: {
          coordinates
      },
      spatialReference: "bd09",
      style: {
          "line-color": "rgba(0,153,128,.8)",
          "line-width": 3,
          // "line-dasharray":[8,1.5],//实线:虚线
          "line-cap":"round",
          "trackPoint": {
              "circle-color": "#ff0000",
              "circle-radius": 4
          },
          "start": {
              "circle-color": "#006699",
              "circle-radius": 4,
              'text-field': '起点',
              'text-size': 14,
              'text-color': '#aaa',
              'text-anchor': 'right',
              "text-font":["Avenir", "Helvetica", "Arial", "sans-serif"],
          },
          "end": {
              "circle-color": "tomato",
              "circle-radius": 4,
              'text-field': '终点',
              'text-size': 14,
              'text-color': '#aaa',
              'text-anchor': 'left',
              "text-font":["Avenir", "Helvetica", "Arial", "sans-serif"],
          }
      },
      animation: {
          repeat: true,
          duration: 10,
          autoplay: false
      },
      minZoom: 3,
      maxZoom: 20,
    })
    //@ts-ignore
    trackLayer.on((e)=>{
      console.log('e',e)
    })
  }

  // 切换轨迹显示/隐藏
  function switchTrack(result:TrackResult|undefined){
    if(!trackLayer){
      if(result != undefined){
        setTrackLayer(result)
        isTrackLayerVisible.value = true;
      }
      else{
        Notify({type:"danger", message:"缺少数据无法生成历史轨迹"})
      }
    }
    else if (isTrackLayerVisible.value){
      console.log("hide")
      trackLayer.hide();
      isTrackLayerVisible.value = false;
      // // 暂停动画
      trackLayer.pause();
      isTrackLayerPlaying.value = false;
      // 隐藏撒点
      if(massMarkLayer){
        massMarkLayer.hide();
      }
      hasMassMark.value = false;
    }
    else{
      console.log("show")
      trackLayer.show();
      isTrackLayerVisible.value = true;
    }
  }
  
  // 切换轨迹播放/暂停
  function switchTrackPlayStatus(){
    if(isTrackLayerPlaying.value){
      trackLayer.pause();
      isTrackLayerPlaying.value = false;
      console.log('isTrackLayerPlaying',isTrackLayerPlaying)
    }
    else{
      trackLayer.play();
      isTrackLayerPlaying.value = true;
      console.log('isTrackLayerPlaying',isTrackLayerPlaying)
    }
  }

  /**
   * @remarks 
   * 
   * 设置 result 坐标信息数组,并返回一个最新的坐标点 Location 可用于初始化地图
   * 
   * @returns newet_loc - 最新轨迹坐标
   */
  interface Location{
    Lng:number;
    Lat:number
  }

  function bd09togcj02(bd_lng: number, bd_lat: number): number[] {
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    let x = bd_lng - 0.0065;
    let y = bd_lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    let gg_lng = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  }

  async function reqTrack():Promise<Location|undefined>{
    try {
        const params:TrackReq = genReqParams<TrackReq>("Baidu");
        const res:MyResponse<TrackResult> = await getTrack(params)
        result.value = res.Result;
        const newest_loc:Location = res.Result.length ? result.value[result.value.length - 1] : undefined;
        [newest_loc.Lng, newest_loc.Lat] = bd09togcj02(newest_loc.Lng, newest_loc.Lat)
        return newest_loc;
      } catch (error) {
        console.log('map data init error',error)
      }
  }

  // 设置撒点图层
  function setMassMarkerLayer(result:TrackResult){
    const coordinates = trackResultToCoordinates(result);
    const data:Array<{type:string, coordinates:number[]}> = [];
    coordinates.forEach(item=>{
      data.push({type:"Point",coordinates:item});
    })

    massMarkLayer = new window.aimap.MassMarkerLayer({
      map:theMap,
      data,
      spatialReference: 'bd09'
    })
  }

  // 轨迹撒点/撤销撒点
  function switchMassMarkerLayer(result:TrackResult|undefined){
    if(!massMarkLayer){
      if(result != undefined){
        setMassMarkerLayer(result)
        hasMassMark.value = true;
      }
      else{
        Notify({type:"danger", message:"缺少数据无法生成撒点"})
      }
    }
    else if (hasMassMark.value){
      console.log("hasMassMark hide")
      massMarkLayer.hide();
      hasMassMark.value = false;
    }
    else{
      console.log("hasMassMark show")
      massMarkLayer.show();
      hasMassMark.value = true;
    }
  }

  let timer = ref<number>()

  onUnmounted(()=>{
    clearInterval(timer.value)
  })
  
  onMounted(async ()=>{
    const titleBus = useEventBus<Title>("titleBus")
    titleBus.emit("地图")
    // 显示加载遮罩
    isLoading_wrapper.value = true;
    // 加载aimap
    if(!window.aimap){
      try {
        await LoadJs("https://location-dev.newayz.com/aimap-gl-js/v2.4.0/aimap-gl.js")
      } catch (error) {
      Notify({type:"danger",message:"加载地图组件失败"}) 
        console.log('error 加载地图组件失败',error)
      }
    }

    let cur_loc = await reqTrack();
    if (!cur_loc) {
      cur_loc = {} as Location;
      cur_loc.Lng = 12684494.69;
      cur_loc.Lat = 2559051.81;
      [cur_loc.Lng, cur_loc.Lat] = bd09togcj02(cur_loc.Lng, cur_loc.Lat);
    }


    initMap(cur_loc.Lng, cur_loc.Lat);

    // 获取地图数据
    timer.value = setInterval(async ()=>{
      try {
        const cur_loc = await reqTrack();
        //@ts-ignore
        console.log("最新地理位置", cur_loc.Lng, cur_loc.Lat);
        console.log("当前地理位置", newest_loc.value.Lng, newest_loc.value.Lat)

        if(cur_loc != undefined){ // 当前定位存在且与视图最新定位不一致
          if(cur_loc.Lng!=newest_loc.value.Lng || cur_loc.Lat!=newest_loc.value.Lat){
            console.log("位置变动")
            newest_loc.value = cur_loc;
            // 地图已渲染
            if(theMap){
              // 更新视图中心点
              theMap.setCenter([cur_loc.Lng, cur_loc.Lat])
              // 修改中心点marker
              newest_marker.value.setLngLat([cur_loc.Lng, cur_loc.Lat])
              // 修改轨迹
              if (trackLayer) {
                trackLayer.remove();
              }

              if(result.value && isTrackLayerVisible.value) setTrackLayer(result.value);
              // 重新绘制图层
              theMap.triggerRepaint();
              console.log("更新了中心点")
            }
          }
          else{
            console.log("位置无变动");
          }
        }
      } catch (error) {
        Notify({type:"danger",message:`${error}`}) 
        console.log('地图更新失败:',error)
      }
    },10000)
    // //初始化地图
    // initMap(newest_loc.value.Lng, newest_loc.value.Lat);
  })
</script>

<style lang="scss" scoped>
  /*#mao{
    height:100% !important;
  }*/
  .btn{
    position: fixed;
    left: 0;
    right: 0;
    margin:0 auto;
  }
  .side-btn-group{
    @extend .btn;
    text-align:center;
    &>*{
      // 分隔符
      border-bottom:1px solid #ddd;
    }
    display: flex;
    flex-direction: column;
    display: inline-block;
    width:34px;
    top:80px;
    left:-300px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0,0,0,.5);
    background-color: white;
  }
  .sub-btn-group{
    @extend .btn;
    display:flex;
    justify-content: center;
    align-items: center;
    bottom:80px;
    //background-color: #bfa;
    height:40px;
    .history-btn{
      width:120px;
      margin:0 10px;
      box-shadow: 0 0 10px rgba(0,0,0,.5);
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>