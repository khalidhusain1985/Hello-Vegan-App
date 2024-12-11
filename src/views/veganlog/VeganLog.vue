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
      <div class="row mt-1">
        <div class="col">
          <common-vegan-log-create v-if="inSubscription"></common-vegan-log-create>
          <QuotaFullCard quotacode="veganlog" @inSubscription="inSubscription=$event"></QuotaFullCard>
        </div>
      </div>

      <div class="row feed-body">
        <div class="col">
          <div v-for="(v,i) in vlogs" :key="i" class="card data-card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
            <RouterLink :to="'/veganlog/'+v._id">
              <div class="card-body p-0 d-flex">
                <figure class="avatar me-3">
                  <img
                      :src="pitLib.media.pluckFirst(v.created_by[0].media,null,env.USER_PROFILE_PIC)"
                      alt="image"
                      style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"
                      class="float-right p-0 bg-white rounded-pill shadow-xss"
                  />
                </figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1">
                  <span
                      class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500"
                  >{{ pitLib.dt.fromNow(v?.created_at) }}
                    <br />
                    <strong class="text-secondary">{{
                        v?.created_by?.[0]?.name
                      }}</strong>
                  </span>
                </h4>
                <a class="ms-auto"
                   id="dropdownMenu5"
                   data-bs-toggle="dropdown"
                   aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
                <div
                    class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg"
                    aria-labelledby="dropdownMenu5"
                    style="z-index: 100">
                  <ul>
                    <li @click="reportPost(v,$event)">
                      <i class="fa-solid fa-flag me-2"></i> Report
                    </li>
                    <li @click="saveLink(v)">
                      <i class="fa-solid fa-bookmark me-2"></i> Save Link
                    </li>
                    <li
                        v-if="
                        v?.created_by?.[0]?.id === pitLib.auth.get()?.userId
                      "
                        @click="deletePost(v._id)"
                    >
                      <i class="fa-solid fa-trash-alt me-2"></i> Delete
                    </li>
                  </ul>
                </div>
              </div>
              <div
                  v-if="v?.media?.length"
                  class="card-body p-0 mb-3 rounded-3 overflow-hidden"
              >
                <div v-for="(media,_m) in v?.media" :key="_m" class="row">
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
                  <div
                      v-if="media?.ref_code == 'vegan_log_image'"
                      class="col-12"
                  >
                    <div class="img-container" v-if="media?.ref_code == 'vegan_log_image'">
                      <img
                          :src="
                        media?.is_local
                          ? env.BASEPOINT + media?.path
                          : media?.path
                      "
                          class="img-fluid card-img mb-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body p-0 me-lg-5">
                <p v-html="v?.content"></p>
              </div>
            </RouterLink>
            <div class="card-body d-flex p-0">
              <a
                  :id="'ic_lk_' + v?._id"
                  @click="likeToggle(v)"
                  role="button"
                  class="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2"
              >
                <i
                    :class="{
                      'fa-solid text-primary': v?.like.length,
                      'fa-regular': !v?.like.length,
                    }"
                    class="icon fa-thumbs-up fa-2x"
                ></i>
                <div class="spinner-border d-none loader" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
                <strong class="ms-2">{{ v?.likes?.[0]?.total }} Likes</strong>
              </a>
              <div class="emoji-wrap">
                <ul class="emojis list-inline mb-0">
                  <li class="emoji list-inline-item">
                    <i class="fa-regular fa-face-angry"></i>
                  </li>
                  <li class="emoji list-inline-item">
                    <i class="fa-regular fa-face-surprise"></i>
                  </li>
                </ul>
              </div>
              <a
                  role="button"
                  @click="loadComments(v)"
                  class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"
              ><i
                  class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"
              ></i
              ><span class="d-none-xss"
              >{{ v?.comments?.[0]?.total ?? 0 }} Comment</span
              ></a
              >
              <SharerCard
                  :title="v.content"
                  :url="pitLib.util.url('veganlog/' + v._id)"
              ></SharerCard>
            </div>
            <Comment class="mt-2" target="veganlog" :target_id="v._id"></Comment>
          </div>

          <div v-if="vlogsResponse?.data?.pages>page" class="row mt-2">
            <div class="col text-center">
              <button @click="page++;vlogsRefetch()" v-if="!loadingVlogsResponse" class="btn btn-primary btn-lg text-white rounded shadow-lg">
                Load More
                <i class="fa-solid fa-angle-down ms-2"></i>
              </button>
              <Vue3Lottie
                  v-if="loadingVlogsResponse"
                  animationLink="/json/loading_2.json"
                  :height="200"
                  :width="200"
              />
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import axios from "axios";
import {endpoints} from "../../../helpers/endpoints";
import {pitLib} from "../../../helpers/pitLib";
import {onMounted, ref, watch} from "vue";
import {PaginatedApiResponse} from "../../../types";
import {env} from "../../../helpers/env";
import {Vue3Lottie} from "vue3-lottie";
import Comment from "../../../components/Comment.vue";
import CommonVeganLogCreate from "../../../components/common/veganlog/CommonVeganLogCreate.vue";
import SharerCard from "../../../components/parts/SharerCard.vue";
import $ from "jquery";
import {cuteAlert, cuteToast} from "cute-alert";
import QuotaFullCard from "../../../components/QuotaFullCard.vue";
import {store} from "../../../store/DataLake";
onMounted(()=>{
  vlogsRefetch()
})
const vlogs=ref<Array<any>>([])
const page=ref(1)
const vlogsResponse=ref<PaginatedApiResponse>()
const loadingVlogsResponse=ref<boolean>(true)
const inSubscription = ref<boolean>();
async function vlogsRefetch() {
  loadingVlogsResponse.value=true
  await axios.post<PaginatedApiResponse>(endpoints.veganlog.index, {
    status: "approved"
  }, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d=>{
     loadingVlogsResponse.value=false
     vlogsResponse.value=d.data
  })
}
watch(vlogsResponse,(vr:any)=>{
  if (vr.data?.data){
    // eslint-disable-next-line no-unsafe-optional-chaining
    vlogs.value.push(...vr?.data?.data)
  }
})

function reportPost(v: any,event:Event) {
  event.preventDefault();
  cuteAlert({
    type: 'warning',
    title: "Are you sure?",
    description: 'You are reporting this post!',
    primaryButtonText: 'Yes',
    secondaryButtonText: 'Cancel',
  }).then((d:string)=>{
    if (d=='primaryButtonClicked'){
      axios.post<PaginatedApiResponse>(
          endpoints.report.create,
          {
            target: "veganlog",
            target_id: v._id,
          },
          {
            headers: pitLib.util.headers(),
          }
      ).then(d=>{
        cuteToast({
          type: d.data.status?"success":"error",
          title: 'Result',
          description: d.data.message ,
          timer: 1500
        })
      })
    }
  })
}

async function likeToggle(v: any) {
  const item = vlogs.value.find((item: any) => item._id === v._id);

  axios.post<PaginatedApiResponse|any>(endpoints.like.toggle, {
    target: "veganlog", target_id: v._id
  }, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d => {
    d=d.data
    if (d.status) {
      item.like = d?.data.deletedCount ? [] : [d.data]
      if (item.likes.length > 0 && item.likes[0].total) {
        // If item.likes is not empty and total exists, update total
        item.likes[0].total = d?.data.deletedCount
            ? parseInt(item.likes[0].total) - 1
            : parseInt(item.likes[0].total) + 1;
      } else {
        // If item.likes is empty, handle accordingly, perhaps initializing the likes array and total
        item.likes = [{total: d?.data.deletedCount ? -1 : 1}];
      }
      pitLib.notify("Veganlog "+((d?.data?.deletedCount)?"Unliked":"Liked")+" by "+pitLib.auth.get()?.name,pitLib.util.trimmer(v.content),v.created_by[0]._id);
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

