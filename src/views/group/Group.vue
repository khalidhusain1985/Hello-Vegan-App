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
      <div class="row">
        <div class="col">
          <Vue3Lottie
              v-if="loadingGroupsResp"
              animationLink="/json/loading_2.json"
              :height="200"
              :width="200"
          />
        </div>
      </div>
      <div class="row">
        <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
          <div class="card-body p-0">
            <router-link to="/group/create" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary fa-solid fa-plus me-2 bg-greylight"></i>
              Create New Group
            </router-link>
          </div>
        </div>
        <div class="col-md-6 col-sm-6 pe-2 ps-2 color border-gray-200 shadow-sm " v-for="(g,i) in groupResp?.data.data" :key="i">
          <div class="card d-block m-10 border-0 shadow-xss rounded-3 overflow-hidden mb-3" style="border-radius: 20px; ">
            <div class="card-body position-relative h50 bg-image-cover bg-image-top" :style="{ backgroundImage: 'url(' + env.BASEPOINT+g?.media?.[0]?.path + ')' }"></div>
            <div class="card-body d-block w-10 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
              <figure class="avatar position-absolute w75 z-index-1" style="top:-10px; left: 15px;">
                <img :src="g?.media.length ? env.BASEPOINT + g?.media[0].path : env.NO_IMG_USER" alt="image" class="float-right p-1 bg-white rounded-circle w-100">
              </figure>
              <div class="clearfix"></div>
              <h4 class="fw-700  font-xsss mt-3 mb-1" >{{ g?.title }}</h4>
              <p class="fw-500 font-xsssss text-grey-500 mt-0 mb-3">
                <span>Created By:-</span> {{ g?.created_by?.[0].name }}
              </p>
              <span class="position-absolute right-15 top-0 d-flex align-items-center">
                      <router-link :to="'/group/'+g._id" class="d-lg-block ">
                        <i class="fa fa-solid fa-circle-right btn-round-md font-md bg-primary text-white"></i>
                      </router-link>
                    </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="groupResp" class="row mt-2">
        <div class="col">
          <nav aria-label="...">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{'disabled':page==1}">
                <a role="button" class="page-link" @click="page=Number(page)-1;refetchGroupsResp()">Previous</a>
              </li>
              <li v-for="p in groupResp.data.pages" :key="p" class="page-item" :class="{ active: page==Number(p) }">
                <a role="button" class="page-link" @click="page=Number(p);refetchGroupsResp()">{{p}}</a>
              </li>
              <li class="page-item" :class="{'disabled':groupResp.data.page==page}">
                <a role="button" class="page-link" @click="page=Number(page)+1;refetchGroupsResp()">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import {pitLib} from "../../../helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";
import {store} from "../../../store/DataLake";
import {PaginatedApiResponse} from "../../../types";
import {onMounted, ref} from "vue";
import {endpoints} from "../../../helpers/endpoints";
import axios from "axios";
import {env} from "../../../helpers/env";
const groupResp=ref<PaginatedApiResponse>()
const loadingGroupsResp=ref<boolean>(false)
const page=ref<number>(1)
function refetchGroupsResp(){
  loadingGroupsResp.value=true
  axios.post<PaginatedApiResponse>(
      endpoints.group.my,
      {},
      {
        headers: pitLib.util.headers(),
        params:{page:page.value}
      },
  ).then((d)=>{
    loadingGroupsResp.value=false
    groupResp.value=d.data
  })
}

onMounted(()=>{
  refetchGroupsResp()
})
</script>

