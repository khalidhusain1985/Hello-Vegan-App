<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
        <router-link to="/notifications" slot="end">
          <img src="/tpl1/images/notification.jpg" class=" font-lg btn-round-lg text-current" :class="{'animate__animated animate__headShake animate__infinite infinite':store.notification_rec.length}">
        </router-link>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-refresher slot="fixed" @ionRefresh="refresher($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="row feed-body">
        <div class="col">
          <ion-list>
            <ion-item v-for="(n,i) in store.notification_rec" v-bind:i>
              <ion-label>
                <strong>{{n?.title}}</strong>
                <br>
                {{n?.content}}
                <br>
                <span class="text-muted">{{ pitLib.dt.fromNow(n.created_at) }}</span>

              </ion-label>
              <ion-row>
                <ion-col>
                  <ion-button shape="round" @click="delNotif(n)">
                    <ion-icon slot="icon-only" :icon="checkmark"></ion-icon>
                  </ion-button>
                </ion-col>
              </ion-row>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import axios from "axios";
import {endpoints} from "../../helpers/endpoints";
import {pitLib} from "../../helpers/pitLib";
import {onMounted, ref, watch} from "vue";
import {PaginatedApiResponse} from "../../types";
import CommonVeganLogCreate from "../../components/common/veganlog/CommonVeganLogCreate.vue";
import $ from "jquery";
import {store} from "../../store/DataLake";
import {checkmark, heart} from "ionicons/icons";
onMounted(()=>{
  // vlogsRefetch()
})
const vlogs=ref<Array<any>>([])
const page=ref(1)
async function vlogsRefetch() {
  axios.post<PaginatedApiResponse>(
      endpoints.notification.index,
      {
        target_user:pitLib.auth.get()?._id
      },
      {
        headers: pitLib.util.headers(),
      }
  ).then((d)=>{
    if(d.data.status){
      store.notification_rec=d.data.data?.data
    }
  })
}


function delNotif(n:any) {
  axios.post<PaginatedApiResponse>(endpoints.notification.delete, {
    _id:n?._id,
  }, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d=>{
    if(d.data.status){
      vlogsRefetch()
    }
  })

}


function refresher(event : any) {
  page.value=1
  vlogs.value=[]
  vlogsRefetch()
  event.target.complete();
}
function loadComments(v: any) {
  if ($("#load_comment_btn_" + v._id).length) {
    $("#load_comment_btn_" + v._id).click();
  }
}
</script>

