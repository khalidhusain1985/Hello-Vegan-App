<script setup lang="ts">

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {PaginatedApiResponse} from "../../../../types";
import {endpoints} from "../../../../helpers/endpoints";
import {env} from "../../../../helpers/env";
import axios from "axios";
import {Vue3Lottie} from "vue3-lottie";
import Comment from "../../../../components/Comment.vue";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {pitLib} from "../../../../helpers/pitLib";
import moment from "moment";
import {store} from "../../../../store/DataLake";
const route=useRoute()
const restaurantsResponse=ref<PaginatedApiResponse>()
const loadingRestaurantsResponse=ref<boolean>()
const html=ref<string>('')
function restaurantsRefetch() {
  axios.post<PaginatedApiResponse>(endpoints.restaurant.index, {
    slug:route.params.slug,
  }, {
    headers: pitLib.util.headers(),
  }).then(d=>{
    loadingRestaurantsResponse.value=false
    restaurantsResponse.value=d.data
  })
}

async function getHtml(path:string) {
  fetch(env.BASEPOINT+ path).then(d=>d.text()).then(r=>{
    html.value=r
  })
}

onMounted(()=>{
  restaurantsRefetch()
})
</script>

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

      <div class="row feed-body">
        <div class="col">
          <Vue3Lottie v-if="loadingRestaurantsResponse"
                      animationLink="/json/loading_2.json"
                      :height="200"
                      :width="200"
          />
          <div v-if="restaurantsResponse?.status&&!loadingRestaurantsResponse" class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
            <div class="card-body p-0">
              <h5>{{restaurantsResponse?.data?.data?.[0]?.title}}</h5>
              <div v-if="restaurantsResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <div v-for="media in restaurantsResponse?.data?.data?.[0]?.media" class="">
                  <img v-if="media?.ref_code=='restaurant_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                </div>
              </div>
              <p>{{restaurantsResponse?.data?.data?.[0]?.content}}</p>
              <h5><i class="fa-regular fa-clock me-2"></i> Timing : <span class="text-cyan">{{moment(restaurantsResponse?.data?.data?.[0]?.open,"HH:mm").format('HH:mm A')}}</span> to <span class="text-cyan"> {{moment(restaurantsResponse?.data?.data?.[0]?.close,"HH:mm").format('HH:mm A')}}</span></h5>
              <h5><i class="fa-solid fa-phone me-2"></i> Contact : <span class="text-cyan">{{restaurantsResponse?.data?.data?.[0]?.contact}}</span></h5>
            </div>
            <Comment class="mt-2" target="restaurant" :target_id="restaurantsResponse?.data?.data?.[0]?._id"> </Comment>

          </div>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped></style>
