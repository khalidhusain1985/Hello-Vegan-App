<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay" v-if="pitLib.auth.is()">
        <ion-content>
          <ion-list id="inbox-list" >
            <ion-list-header style="cursor:pointer" @click="redirectUrl('/me')">
              <img class="w40 rounded rounded-circle" :src='env.NO_IMG_USER'>
              {{pitLib.auth.get()?.name}}
            </ion-list-header>
            <ion-note @click="redirectUrl('/me')">{{pitLib.auth.get()?.email}}</ion-note>

            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
<!--                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>-->
                <img class="menu-img" :src="p?.image" >
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <ion-list id="labels-list">
            <ion-list-header>Recommendations</ion-list-header>

            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in recommendations" :key="i">
              <ion-item @click="selectedIndexRecommendations = i" router-direction="root" :router-link="p.url" lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndexRecommendations === i }">
                <img class="menu-img" :src="p.image" >
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
    menuController
} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import {calendar, fastFood, home, newspaper, personAdd, reader, restaurant,} from 'ionicons/icons';
import {pitLib} from "../helpers/pitLib";
import {env} from "../helpers/env";
import {useRoute, useRouter} from "vue-router";
import {io} from "socket.io-client";
import {endpoints} from "../helpers/endpoints";
import {store} from "../store/DataLake";
import {PaginatedApiResponse} from "../types";
import axios from "axios";
import {cuteAlert, cuteToast} from "cute-alert";
// import { Plugins } from '@capacitor/core';
// const { PhotoLibrary, Permissions } = Plugins;
const router = useRouter();
const route = useRoute();
const selectedIndex = ref(0);
const selectedIndexRecommendations = ref(0);
const appPages = [
  {
    title: 'Vegan Log',
    url: '/home',
    iosIcon: home,
    mdIcon: home,
    image:"/images/vlog.jpeg"
  },
  {
    title: 'Reels',
    url: '/reel',
    iosIcon: home,
    mdIcon: home,
    image:"/images/reel.jpg"
  },
  {
    title: 'Blogs',
    url: '/blog',
    iosIcon: reader,
    mdIcon: reader,
    image:"/images/blog.jpeg"
  },
  {
    title: 'News',
    url: '/news',
    iosIcon: newspaper,
    mdIcon: newspaper,
    image:"/images/news.jpeg"
  },
  {
    title: 'Events',
    url: '/events',
    iosIcon: calendar,
    mdIcon: calendar,
    image:"/images/event.jpeg"
  },
  {
    title: 'Recipe',
    url: '/recipes',
    iosIcon: fastFood,
    mdIcon: fastFood,
    image:"/images/recipe.jpeg"
  },
  {
    title: 'Friends',
    url: '/friends',
    iosIcon: personAdd,
    mdIcon: personAdd,
    image:"https://cdn-icons-png.flaticon.com/128/2024/2024079.png"
  },
  {
    title: 'Groups',
    url: '/group',
    iosIcon: personAdd,
    mdIcon: personAdd,
    image:"/tpl1/images/group.jpg"
  },
];
const recommendations = [
  {
    title: 'Restaurants',
    url: '/recommendation/restaurant',
    iosIcon: restaurant,
    mdIcon: restaurant,
    image:"/images/blog.jpeg"
  },
];

const path = window.location.pathname.split('folder/')[1];
if (path !== undefined) {
  selectedIndex.value = appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
}
const SOCKET_NOTIFICATION_RECEIVE_AUD=new Audio(env.SOCKET_NOTIFICATION_RECEIVE_AUD)
const SOCKET_MSG_REC_AUD=new Audio(env.SOCKET_MSG_REC_AUD)
const audioPlayerIncomingCall=new Audio("/sound/notification/ring_01.mp3")
if(pitLib.auth.is()){
  const socket =io.connect(endpoints.socket.index,{
    auth: {
      _id: pitLib.auth.get()._id
    },
  });
  socket.on('connect', () => {
    socket.on(env.SOCKET_MSG_RECEIVE, (msg:string) => {
      if(route.name !== "Chat"){
        var m=JSON.parse(msg);
        SOCKET_MSG_REC_AUD.play()
        cuteToast({
          type: "info",
          title: m?.created_by?.[0]?.name+" messaged.",
          description:m?.content,
          timer: 5000
        })
      }
      console.log(route.name)
      store.chat_msg=msg
    });
    socket.on(env.SOCKET_NOTIFICATION_RECEIVE, (msg: any) => {
      SOCKET_NOTIFICATION_RECEIVE_AUD.play()
      store.notification_rec.push(JSON.parse(msg))
    });
    socket.on(env.SOCKET_MSG_RECEIVE + route.params._id, (msg: any) => {
      store.group_msg=msg
    });
    socket.on(env.SOCKET_VIDEO_CALL_REC, (msg: any) => {
      const _d=JSON.parse(msg);
      audioPlayerIncomingCall.play();
      audioPlayerIncomingCall.loop = true;
      cuteAlert({
        type: 'question',
        title: "Please pickup the call!",
        description: 'Pickup or drop',
        primaryButtonText: 'Pickup',
        secondaryButtonText: 'Drop',
      }).then((d:string)=>{
        if (d=='primaryButtonClicked'){
          audioPlayerIncomingCall.pause();
          router.push('/videocall/'+_d._id)
        }else {
          audioPlayerIncomingCall.pause();
        }
      })
    });
    socket.on(env.SOCKET_VIDEO_CALL_UPD, (msg: any) => {
      console.log("---",msg)
      store.vidcall_upd=JSON.parse(msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });


  axios.post<PaginatedApiResponse>(
      endpoints.notification.index,
      {
        target_user:pitLib.auth.get()?._id
      },
      {
        headers: pitLib.util.headers(),
      }
  ).then((d)=>{
    if(d.data.data?.data?.length){
      store.notification_rec=d.data.data?.data
    }
  })
}

function redirectUrl(url:string){
  router.push(url).then(()=>{
    menuController.close()
  })
}
//
// const requestPermissions = async () => {
//   // Request Camera Permission
//   const cameraPermission = await Permissions.request({ name: 'camera' });
//   if (!cameraPermission.granted) {
//     await cuteAlert({
//       type: 'warning',
//       title: "Attention!",
//       description: 'We dont have permission to access camera',
//       primaryButtonText: 'Ok',
//     })
//     return;
//   }
//   // Request Microphone Permission
//   const microphonePermission = await Permissions.request({ name: 'microphone' });
//   if (!microphonePermission.granted) {
//     await cuteAlert({
//       type: 'warning',
//       title: "Attention!",
//       description: 'We dont have permission to access microphone',
//       primaryButtonText: 'Ok',
//     })
//     return;
//   }
//
//   const photosPermission = await Permissions.request({ name: 'photos' });
//   if (!photosPermission.granted) {
//     await cuteAlert({
//       type: 'warning',
//       title: "Attention!",
//       description: 'We dont have permission to access photos',
//       primaryButtonText: 'Ok',
//     })
//     return;
//   }
//
// };
//
//
// onMounted(()=>{
//   setTimeout(()=>{
//     requestPermissions()
//   },1000)
// })
</script>


<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
.menu-img{
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>