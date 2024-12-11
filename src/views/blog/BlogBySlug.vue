<script setup lang="ts">

import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {pitLib} from "../../../helpers/pitLib";
import {PaginatedApiResponse} from "../../../types";
import {endpoints} from "../../../helpers/endpoints";
import {env} from "../../../helpers/env";
import axios from "axios";
import {Vue3Lottie} from "vue3-lottie";
import Comment from "../../../components/Comment.vue";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {store} from "../../../store/DataLake";

const route=useRoute()
const blogsResponse=ref<PaginatedApiResponse>()
const loadingBlogsResponse=ref<boolean>()
const html=ref<string>('')
function blogsRefetch() {
  axios.post<PaginatedApiResponse>(endpoints.blog.index, {
    slug:route.params.slug,
    status:"active"
  }, {
    headers: pitLib.util.headers(),
  }).then(d=>{
    loadingBlogsResponse.value=false
    blogsResponse.value=d.data
  })
}

async function getHtml(path:string) {
  fetch(env.BASEPOINT+ path).then(d=>d.text()).then(r=>{
    html.value=r
  })
}

onMounted(()=>{
  blogsRefetch()
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
      <div class="row mt-1">
        <div class="col">
          <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
            <div class="card-body p-0">
              <RouterLink to="/blog/create" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary fa-solid fa-plus me-2 bg-greylight"></i>
                Add New Blog
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="row feed-body">
        <div class="col">
          <div v-if="blogsResponse?.status&&!loadingBlogsResponse" class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
            <div class="card-body p-0">
              <h5>{{blogsResponse?.data?.data?.[0]?.title}}</h5>
              <div v-if="blogsResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <div v-for="media in blogsResponse?.data?.data?.[0]?.media" class="">
                  <img v-if="media?.ref_code=='blog_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                  <div v-if="media?.ref_code=='blog_content'&&getHtml(media?.path)" v-html="html??''">

                  </div>
                  <Vue3Lottie v-if="!html"
                              animationLink="/json/loading_2.json"
                              :height="200"
                              :width="200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped></style>
