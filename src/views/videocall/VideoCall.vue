<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.name }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="row mt-3">
        <div class="col-12">
          <div class="row">
            <div class="col">
              <span class="badge badge-danger">LIVE</span>
            </div>
            <div class="col">
              <a @click="endCall()" role="button" class="btn btn-danger btn-block"><i class="feather-phone-off text-white font-md"></i></a>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col"></div>
            <div class="col">
              <video ref="localVideo" class="w150 h200 rounded-3 " autoplay muted ></video>
            </div>
            <div class="col"></div>
          </div>
        </div>
        <div class="col-12">
          <video ref="remoteVideo" class="w-100" autoplay  ></video>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import {onMounted, ref, watch} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import {store} from "../../../store/DataLake";
import axios from "axios";
import {PaginatedApiResponse} from "../../../types";
import {pitLib} from "../../../helpers/pitLib";
import {endpoints} from "../../../helpers/endpoints";
import {Camera, CameraResultType} from "@capacitor/camera";
import {cuteAlert} from "cute-alert";

const loadingVidResp=ref<boolean>(false)
const friendsPage=ref<number>(1)
const vidResp=ref<PaginatedApiResponse>()
let localStream:any;
const localVideo = ref();
const peer = store.peer;
const remoteVideo = ref();
const peerId = ref<string>();
const callActive = ref<boolean>(false);
const incomingCall=ref()
const route=useRoute()
const router=useRouter()
let callInstance :any;

watch(() => store.vidcall_upd, (s) => {
  if(vidResp.value?.data.data[0].target_id[0]._id!==pitLib.auth.get()?._id){
    callInstance = peer.call(s?.peer_id, localStream);
    callActive.value = true;
    callInstance.on("stream", (remoteStream:any) => {
      remoteVideo.value.srcObject = remoteStream;
    });
  }
})
function refetchVidResp(){
  loadingVidResp.value = true;
  axios.post<PaginatedApiResponse>(
      endpoints.videocall.index,
      {
        _id:route.params._id
      },
      {
        headers: pitLib.util.headers(),
      },
  ).then(d=>{
    vidResp.value=d.data
    upd()
    loadingVidResp.value=false
  })
}

function upd() {
  if(vidResp.value?.data.data[0].target_id[0]._id===pitLib.auth.get()?._id){
    axios.post<PaginatedApiResponse>(
        endpoints.videocall.update,
        {
          _id: route.params._id,peer_id:peerId.value
        },
        {
          headers: pitLib.util.headers(),
        },
    ).then(d=>{
      vidResp.value=d.data
      loadingVidResp.value=false
    })
  }
}
const getMedia = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    audio:true,video:true
  }).catch((e)=>{
    alert(e.toString())
  })
  localVideo.value.srcObject = localStream;
};

onMounted(async () => {
  await getMedia()
  refetchVidResp()
  peerId.value = peer?.id

  peer.on("call", (call: any) => {
    incomingCall.value = call; // Set the incoming call state to display the modal
    incomingCall.value.answer(localStream);
    callActive.value = true;

    incomingCall.value.on("stream", (remoteStream: any) => {
      remoteVideo.value.srcObject = remoteStream;
      remoteStream.addEventListener('ended', () => {
        endCall()
      });
    });
    incomingCall.value.on("close", (remoteStream: any) => {
      endCall()
    });

    incomingCall.value = null;
  });
})
const endCall = () => {
  // if (callInstance) {
  //   callInstance.close();
  //   callActive.value = false;
  // }
  // if (localStream) {
  //   localStream.getTracks().forEach((track:any) => track.stop());
  // }
  // remoteVideo.value.srcObject = null;
  // router.push('/')
  location.href="/"
};
onBeforeRouteLeave((to, from, next) => {
  endCall();next()
});
</script>

