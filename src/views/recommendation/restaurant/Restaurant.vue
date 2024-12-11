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
          <div v-for="v in restaurants" class="card data-card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
            <div class="card-body p-0 d-flex">
              <figure class="avatar me-3"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
              <h4 class="fw-700 text-grey-900 font-xssss mt-1">
                  <span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">{{pitLib.dt.fromNow(v?.created_at)}}
                    <br>
                    <strong class="text-secondary">{{v?.created_by?.[0]?.name}}</strong>
                  </span>
              </h4>
              <a class="ms-auto" id="dropdownMenu5" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
              <div class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu5">
                <ul>
                  <li><i class="fa-solid fa-check me-2"></i> Save Link</li>
                </ul>
              </div>
            </div>
            <h5>{{v?.title}}</h5>
            <h6 v-if="v?.discount"><span class="badge badge-warning">{{v?.discount}}% Discount</span> </h6>
            <div v-if="v?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
              <RouterLink :to="'/recommendation/restaurant/'+v?.slug">
                <div v-for="media in v?.media" class="img-container">
                  <img v-if="media?.ref_code=='restaurant_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid card-img mb-2">
                </div>
              </RouterLink>
            </div>
            <div class="card-body p-0 me-lg-5">
              <p v-html="v?.content"></p>
            </div>
            <div class="card-body d-flex p-0">
              <div class="emoji-wrap">
                <ul class="emojis list-inline mb-0">
                  <li class="emoji list-inline-item"><i class="fa-regular fa-face-angry"></i></li>
                  <li class="emoji list-inline-item"><i class="fa-regular fa-face-surprise"></i></li>
                </ul>
              </div>
              <a role="button"
                 @click="loadComments(v)" class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i><span class="d-none-xss">{{v?.comments?.[0]?.total??0}} Comment</span></a>
              <SharerCard
                  :title="v.content"
                  :url="pitLib.util.url('recommendation/restaurants/' + v.slug)"
              ></SharerCard>
            </div>
            <Comment class="mt-2" target="restaurant" :target_id="v._id"> </Comment>
          </div>
          <div v-if="restaurantsResponse?.data?.pages>page" class="row mt-2">
            <div class="col text-center">
              <button @click="page++;restaurantsRefetch()" v-if="!loadingVlogsResponse" class="btn btn-primary btn-lg text-white rounded shadow-lg">
                Load More
                <i class="fa-solid fa-angle-down ms-2"></i>
              </button>
              <client-only>
                <Vue3Lottie
                    v-if="loadingVlogsResponse"
                    animationLink="/json/loading_2.json"
                    :height="200"
                    :width="200"
                />
              </client-only>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import {pitLib} from "../../../../helpers/pitLib";
import {env} from "../../../../helpers/env";
import {endpoints} from "../../../../helpers/endpoints";
import axios from "axios";
import {PaginatedApiResponse} from "../../../../types";
import Comment from "../../../../components/Comment.vue";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {Vue3Lottie} from "vue3-lottie";
import {store} from "../../../../store/DataLake";
import SharerCard from "../../../../components/parts/SharerCard.vue";
import $ from "jquery";

const page=ref(1)
const loadingVlogsResponse=ref<boolean>(true)
const restaurantsResponse=ref<PaginatedApiResponse>()
const restaurants=ref<Array<any>>([])

watch(restaurantsResponse,(vr:any)=>{
  if (vr.data?.data){
    restaurants.value.push(...vr?.data?.data)
  }
})
function restaurantsRefetch() {
  loadingVlogsResponse.value=true
  axios.post<PaginatedApiResponse>(endpoints.restaurant.index, {}, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d=>{
    loadingVlogsResponse.value=false
    restaurantsResponse.value=d.data
  })
}

onMounted(()=>{
  restaurantsRefetch()
})
function loadComments(v: any) {
  if ($("#load_comment_btn_" + v._id).length) {
    $("#load_comment_btn_" + v._id).click();
  }
}
</script>

<style scoped></style>
