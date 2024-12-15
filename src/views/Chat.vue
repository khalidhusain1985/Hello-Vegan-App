<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ targetUser?targetUser.name: $route.name }}</ion-title>
        <button @click="initiateCall()" slot="end">
          <img src="https://img.icons8.com/?size=48&id=13068&format=png" class=" font-lg btn-round-lg text-current" >
        </button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.name }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="row">
        <div class="col">
          <div class="box shimmer" v-if="loadingUserChat">
            <div class="lines">
              <div class="lines s_shimmer"></div>
            </div>
          </div>
          <div class="w-100 p-3 scroll-x" v-if="!loadingUserChat&&userChatResponse">
            <div v-for="m in userChatResponse?.data?.data">
              <div v-if="m?.created_by?.[0]?._id!==pitLib.auth.get()?._id">
                <div class="message">
                  <div class="message-content font-xssss lh-24 fw-500">{{m?.content}}</div>
                </div>
                <div class="date-break font-xsssss lh-24 fw-500 text-grey-500 mt-2 mb-2 text-left">{{pitLib.dt.fromNow(m?.created_at)}}</div>
              </div>
              <div v-if="m?.created_by?.[0]?._id===pitLib.auth.get()?._id">
                <div class="message self text-right mt-2">
                  <div class="message-content font-xssss lh-24 fw-500">{{m?.content}}</div>
                </div>
                <div class="date-break font-xsssss lh-24 fw-500 text-grey-500 mt-2 mb-2 text-right">{{pitLib.dt.fromNow(m?.created_at)}}</div>
              </div>
            </div>
            <div ref="endOfMessages"></div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <div class="row mb-2 footer fixed-bottom">
        <div class="col">
          <div class="form-group icon-right-input style1-input ">
            <input v-on:keyup.enter="send()" v-model="chatFormData.content" type="text" placeholder="Start typing.." class="form-control rounded-xl bg-greylight border-0 font-xssss fw-500 ps-3">
            <i @click="send()" v-if="!loadingSendMessage" role="button" class="fa-regular fa-paper-plane text-grey-500 font-md"></i>
            <i v-if="loadingSendMessage" class="fa-solid fa-spinner fa-spin-pulse" role="status" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import {onMounted, reactive, ref, watch} from "vue";
import {ApiResponse, PaginatedApiResponse, User} from "../../types";
import {endpoints} from "../../helpers/endpoints";
import {useFetch} from "@vueuse/core";
import {pitLib} from "../../helpers/pitLib";
import {env} from "../../helpers/env";
const friendsPage=ref<number>(1)
const peerId=ref<string>('')
const route=useRoute()
const SOCKET_MSG_SEND_AUD=new Audio(env.SOCKET_MSG_SEND_AUD)
const SOCKET_MSG_REC_AUD=new Audio(env.SOCKET_MSG_REC_AUD)
const loadingUserChat=ref<true|false>(false)
const userChatResponse=ref<PaginatedApiResponse>()

const loadingSendMessage=ref<true|false>(false)
const sendMessageResponse=ref<ApiResponse>()

const userChatPage=ref<number>(1)
const targetUser=ref<User>()
axios.post<PaginatedApiResponse>(endpoints.user.list, {_id:route.params._id}, {
  headers: pitLib.util.headers(),
}).then(d=>{
  targetUser.value=d.data.data.data[0]
})

const endOfMessages=ref()
const chatFormData=reactive({
  to:route.params._id,content:''
})

var peer = new Peer();
import {useRoute} from "vue-router";

import axios from "axios";
import {store} from "../../store/DataLake";
import {cuteToast} from "cute-alert";
import router from "@/router";
// navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
//
// });
peer.on('open', function(id:string) {
  peerId.value=id
});

watch(() => store.chat_msg, (msg) => {
  const m=JSON.parse(msg);
  SOCKET_MSG_REC_AUD.play()
  if(m?.created_by?.[0]?._id==targetUser.value?._id){
    userChatResponse.value?.data?.data.push(m);
  } else{
    // Message from non focused user
    cuteToast({
      type: "info",
      title: m?.created_by?.[0]?.name+" messaged.",
      timer: 5000
    })
  }
});


function getUserChat(){
  loadingUserChat.value=true
  axios.post<PaginatedApiResponse>(endpoints.chat.index,{
    to:route.params._id
  },{
    headers:pitLib.util.headers(),
    params:{page:userChatPage.value}
  }).then((d)=>{
    userChatResponse.value=d.data
    loadingUserChat.value=false
    endOfMessages.value.scrollIntoView({ behavior: 'smooth' })
  })
}
function send(){
  if (!chatFormData.content){
    return
  }
  loadingSendMessage.value=true
  axios.post<PaginatedApiResponse>(endpoints.chat.create,chatFormData,{
    headers:pitLib.util.headers(),
    params:{page:userChatPage.value}
  }).then((d)=>{
    sendMessageResponse.value=d.data
    loadingSendMessage.value=false

    if (d.data.status){
      userChatResponse.value?.data?.data.push(d?.data.data)
      endOfMessages.value.scrollIntoView({ behavior: 'smooth' })
      chatFormData.content=''
      SOCKET_MSG_SEND_AUD.play()
    }
  })
}

onMounted(()=>{
  getUserChat()
})
function initiateCall() {
  axios.post<PaginatedApiResponse>(
      endpoints.videocall.create,
      {
        target_id:route.params._id
      },
      {
        headers: pitLib.util.headers(),
      },
  ).then(d=>{
    if(d.status) {
      router.push("/videocall/"+d.data.data._id)
    }
    // loadingVidResp.value=false
  })
}
</script>

