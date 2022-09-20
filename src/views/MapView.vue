<template>
  <van-overlay :show="isLoading_wrapper" style="z-index:9999">
    <div class="wrapper" @click.stop @touch.stop >
      <van-loading type="circular" size="24px" text-color="white">检测中</van-loading>
    </div>
  </van-overlay>

  <div ref="map" id="map" style="height:567px;"></div>
  <div ref="mark" id="mark"></div>
  <div class="side-btn-group">
    <van-button type="primary" size="small" round @touchend="trySendLocationCommand" >请求定位</van-button>
  </div>
  <div class="sub-btn-group">
    <Transition name="fade">
      <div v-if="isTrackLayerVisible" @touchend="switchMassMarkerLayer(result)" style="width:32px;height:32px;background-color:white;border-radius:50%;border:2px solid black;">
        <transfer v-show="!hasMassMark" theme="filled" size="28" fill="#333" :strokeWidth="2"/>
        <transfer v-show="hasMassMark" theme="multi-color" size="28" :fill="['#333' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>
      </div><!--占位-->
    </Transition>
    <van-button class="history-btn" round size="small" type="primary" @touchend="switchTrack(result)">
      <span v-show="!isTrackLayerVisible">查看历史轨迹</span>
      <span v-show="isTrackLayerVisible">关闭历史轨迹</span>
    </van-button>
    <Transition name="fade">
      <div class="play-btn" v-if="isTrackLayerVisible">
        <play v-show="!isTrackLayerPlaying" @touchend="switchTrackPlayStatus" class="play-btn" theme="multi-color" size="36" :fill="['' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>
        <pause-one v-show="isTrackLayerPlaying" @touchend="switchTrackPlayStatus" class="play-btn" theme="multi-color" size="36" :fill="['' ,'#2F88FF' ,'#FFF' ,'#43CCF8']" :strokeWidth="2"/>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  // icon
  import {Play,PauseOne,Transfer} from "@icon-park/vue-next"
  // vueuse
  import {useEventBus} from "@vueuse/core"
  // types
  import {Title} from "@/types/"
  import { CommandReq, MyResponse, TrackReq, TrackResult } from "@/api/types";
  // vue
  import { ref, onMounted, Transition} from "vue";
  // pinia
  import { useAuthStore } from "@/stores/authStore";
  // api
  import {getTrack, sendCommand} from "@/api/"
  import { genReqParams } from "@/utils/genReqParams";
  import { Notify } from "vant";
  import { getAccessToken, getUserId } from "@/utils/auth";
  // isloading
  let isLoading_wrapper = ref<boolean>(false);
  //dom
  let map = ref(null);
  let mark = ref(null);
  let theMap:any = null;
  //路径数据
  let result = ref<TrackResult>();
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
  async function trySendLocationCommand():Promise<void>{
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
  }
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
        logoPosition:'top-left'
    });
    const nav = new window.aimap.NavigationControl({
      showCompass: false,
    });
    // 增加地图缩放按钮
    theMap.addControl(nav);
    // 增加地图罗盘
    // theMap.addControl(new window.aimap.CompassControl());
    // 添加图标
    // theMap.addImage("company-yellow","./img/local.svg", {type:"svg"})
    theMap.on("load",()=>{
      // 默认Marker
      const newest_marker = new window.aimap.Marker({color:"tomato"})
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
          duration: 8,
          autoplay: false
      },
      minZoom: 3,
      maxZoom: 20,
    })
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
  async function reqTrack():Promise<Location|undefined>{
    try {
        const params:TrackReq = genReqParams<TrackReq>("Baidu");
        const res:MyResponse<TrackResult> = await getTrack(params)
        result.value = res.Result;
        const newest_loc:Location = result.value[result.value.length - 1];
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
  onMounted(async ()=>{
    const titleBus = useEventBus<Title>("titleBus")
    let newest_loc:any;
    titleBus.emit("地图")
    // 显示加载遮罩
    isLoading_wrapper.value = true;
    // 获取地图数据
    try {
      newest_loc = await reqTrack();
    } catch (error) {
      Notify({type:"danger",message:"地图数据获取失败"}) 
      console.log('error 地图数据获取失败',error)
    }
    // 加载aimap
    try {
      await LoadJs("https://location-dev.newayz.com/aimap-gl-js/v2.4.0/aimap-gl.js")
    } catch (error) {
     Notify({type:"danger",message:"加载地图组件失败"}) 
     console.log('error 加载地图组件失败',error)
    }
    //初始化地图
    initMap(newest_loc.Lng, newest_loc.Lat);
  })
</script>

<style lang="scss" scoped>
  .btn{
    position: fixed;
    left: 0;
    right: 0;
    margin:0 auto;
  }
  .side-btn-group{
    @extend .btn;
    display: inline-block;
    width:50px;
    top:80px;
    left:-300px;
    //background-color: #bfc;
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