<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon name="heart" aria-hidden="true"></ion-icon>
          </ion-button>
        </ion-buttons>
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
      <div class="row mt-1">
        <div class="col">
          <common-vegan-log-create></common-vegan-log-create>
        </div>
      </div>

      <div class="row feed-body">
        <div class="col">
          <div v-if="vlogResponse?.status&&!loadingVlogResponse" class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
            <div class="card-body p-0">
              <p>{{vlogResponse?.data?.data?.[0]?.content}}</p>
              <div v-if="vlogResponse?.data?.data?.[0]?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <div v-for="media in vlogResponse?.data?.data?.[0]?.media" class="">
                  <img v-if="media?.ref_code=='vegan_log_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid mb-2">
                  <div
                      v-if="media?.ref_code == 'vegan_log_video'"
                      class="mb-x`2 rounded col-12"
                  >
                    <video controls class="float-right w-100">
                      <source
                          :src="env.BASEPOINT + media?.path"
                          type="video/mp4"
                      />
                    </video>
                  </div>
                  <client-only >
                    <Vue3Lottie v-if="!vlogResponse"
                                animationLink="/json/loading_2.json"
                                :height="50"
                                :width="200"
                    />
                  </client-only>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import {endpoints} from "../../../helpers/endpoints";
import {pitLib} from "../../../helpers/pitLib";
import {PaginatedApiResponse} from "../../../types";
import {env} from "../../../helpers/env";
import {Vue3Lottie} from "vue3-lottie";
import CommonVeganLogCreate from "../../../components/common/veganlog/CommonVeganLogCreate.vue";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
const loadingVlogResponse=ref<boolean>(true)
const vlogResponse=ref<PaginatedApiResponse>()
const route=useRoute()
onMounted(()=>{
  vlogRefetch()
})
async function vlogRefetch(){
  loadingVlogResponse.value=false
  await axios.post<PaginatedApiResponse>(endpoints.veganlog.index, {
    _id:route.params._id,
  }, {
    headers: pitLib.util.headers(),
  }).then(d=>{
    loadingVlogResponse.value=false
    vlogResponse.value=d.data
  })
}

</script>

