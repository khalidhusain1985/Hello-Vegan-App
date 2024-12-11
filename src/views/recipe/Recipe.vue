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
      <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
        <div class="card-body p-0">
          <RouterLink to="/recipe/create/new" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary fa-solid fa-plus me-2 bg-greylight"></i>
            Add New Recipe
          </RouterLink>
        </div>

      </div>
      <div class="row feed-body">
        <div class="col">
          <div v-for="v in recipes" class="card data-card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
            <RouterLink :to="'/recipe/'+v?.slug">
              <div class="card-body p-0 d-flex">
                <figure class="avatar me-3"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w45"></figure>
                <h4 class="fw-700 text-grey-900 font-xssss mt-1"><span class="d-block font-xssss fw-500 mt-1 lh-3 text-grey-500">
                  {{pitLib.dt.fromNow(v?.created_at)}}
                  <br>
                  <strong class="text-secondary">{{v?.created_by?.[0]?.name}}</strong>
                </span></h4>
                <a href="#" class="ms-auto" id="dropdownMenu5" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
                <div class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu5">
                  <ul>
                    <li><i class="fa-solid fa-check me-2"></i> Save Link</li>
                  </ul>
                </div>
              </div>
              <h5 class="text-primary-soft text-truncate">{{v?.title}}</h5>
              <div v-if="v?.media?.length" class="card-body p-0 mb-3 rounded-3 overflow-hidden">
                <div v-for="media in v?.media" >
                  <div :class="{'img-container':media?.ref_code=='recipe_image'}">
                    <img v-if="media?.ref_code=='recipe_image'" :src="media?.is_local?env.BASEPOINT+ media?.path:media?.path" class="img-fluid card-img mb-2">
                  </div>
                </div>
              </div>
            </RouterLink>
            <div class="card-body d-flex p-0">
              <!--                <a :id="'ic_lk_'+v?._id" @click="likeToggle(v)" role="button" class="emoji-bttn d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss me-2">-->
              <!--                  <i :class="{'fa-solid text-primary':v?.like.length,'fa-regular':!v?.like.length}" class="icon fa-thumbs-up fa-2x"></i>-->
              <!--                  <div class="spinner-border d-none loader" role="status">-->
              <!--                    <span class="sr-only">Loading...</span>-->
              <!--                  </div>-->
              <!--                  <strong class="ms-2">{{v?.likes?.[0]?.total}} Likes</strong>-->
              <!--                </a>-->
              <div class="emoji-wrap">
                <ul class="emojis list-inline mb-0">
                  <li class="emoji list-inline-item"><i class="fa-regular fa-face-angry"></i></li>
                  <li class="emoji list-inline-item"><i class="fa-regular fa-face-surprise"></i></li>
                </ul>
              </div>
              <a role="button"
                 @click="loadComments(v)" class="d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-message-circle text-dark text-grey-900 btn-round-sm font-lg"></i><span class="d-none-xss">{{v?.comments?.[0]?.total??0}} Comment</span></a>
              <SharerCard :title="v.title" :url="pitLib.util.url('recipe/'+v.slug)"></SharerCard></div>
            <Comment class="mt-2" target="recipe" :target_id="v._id"> </Comment>
          </div>

          <div v-if="recipesResponse?.data?.pages>page" class="row mt-2">
            <div class="col text-center">
              <button @click="page++;recipesRefetch()" v-if="!loadingRecipesResponse" class="btn btn-primary btn-lg text-white rounded shadow-lg">
                Load More
                <i class="fa-solid fa-angle-down ms-2"></i>
              </button>
              <client-only>
                <Vue3Lottie
                    v-if="loadingRecipesResponse"
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
import {pitLib} from "../../../helpers/pitLib";
import {env} from "../../../helpers/env";
import {endpoints} from "../../../helpers/endpoints";
import axios from "axios";
import {PaginatedApiResponse} from "../../../types";
import Comment from "../../../components/Comment.vue";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {Vue3Lottie} from "vue3-lottie";
import SharerCard from "../../../components/parts/SharerCard.vue";
import {store} from "../../../store/DataLake";

const page=ref(1)
const loadingRecipesResponse=ref<boolean>(true)
const recipesResponse=ref<PaginatedApiResponse>()
const recipes=ref<Array<any>>([])

watch(recipesResponse,(vr:any)=>{
  if (vr.data?.data){
    recipes.value.push(...vr?.data?.data)
  }
})
function recipesRefetch() {
  loadingRecipesResponse.value=true
  axios.post<PaginatedApiResponse>(endpoints.recipe.index, {status:"active"}, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d=>{
    loadingRecipesResponse.value=false
    recipesResponse.value=d.data
  })
}

async function likeToggle(v: any) {
  const item = recipes.value.find((item:any) => item._id === v._id);

  axios.post<PaginatedApiResponse|any>(endpoints.like.toggle, {
    target:"event",target_id:v._id
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
      pitLib.notify("Recipe "+((d?.data?.deletedCount)?"Unliked":"Liked")+" by "+pitLib.auth.get()?.name,pitLib.util.trimmer(v.title),v.created_by[0]._id);
    }
  })
}

onMounted(()=>{
  recipesRefetch()
})
function loadComments(v: any) {
  if ($("#load_comment_btn_" + v._id).length) {
    $("#load_comment_btn_" + v._id).click();
  }
}
</script>

<style scoped></style>
