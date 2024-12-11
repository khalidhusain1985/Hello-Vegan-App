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
              <h5>Create New Recipe</h5>
            </div>
            <div :class="{'d-none':!inSubscription}">
              <div class="row mt-3">
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group">
                    <label class="mont-font fw-600 font-xsss">Title</label>
                    <input v-model="formData.title" type="text" class="form-control">
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" v-if="!loadingCategResponse">
                    <label class="mont-font fw-600 font-xsss">Category</label>
                    <select v-model="formData.category" class="form-control">
                      <option :value="c?._id" v-for="c in categResp?.data?.data">{{c?.title}}</option>
                    </select>
                  </div>
                </div>

                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group" >
                    <div class="form-group" v-if="!loadingCategResponse">
                      <label class="mont-font fw-600 font-xsss">Tags</label>
                      <tags @value="formData.tags=$event" class="form-control"></tags>
                    </div>
                  </div>
                </div>
                <div class="col-12 mb-2">
                  <div class="form-group" >
                    <div class="form-group" v-if="!loadingCategResponse">
                      <label class="mont-font fw-600 font-xsss">Content</label>
                      <editor v-model="formData.content"></editor>

                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
                  <div class="form-group mb-0 w-100">
                    <input ref="field_logo" @change="handleLogo()" type="file" name="file" id="file" class="input-file">
                    <label for="file" class="rounded-3 text-center bg-white btn-tertiary js-labelFile p-4 w-100 border-dashed">
                      <i v-if="!logo_preview" class="ti-cloud-down large-icon me-3 d-block"></i>
                      <span v-if="!logo_preview" class="js-fileName">Choose Logo or Drop Here</span>
                      <img v-if="logo_preview" :src="logo_preview" class="img-thumbnail">
                    </label>
                  </div>
                </div>
              </div>
              <ui-panel class="mt-3" ref="divResp" :type="createResp?.status===true?'success':'warning'" :content="createResp?.message" @show="createResp=$event" v-if="createResp"></ui-panel>
              <div class="row mt-3">
                <div class="col text-right">
                  <button :disabled="loadingCreateResp" @click="submit" class="btn btn-primary text-white" >
                    <span v-if="loadingCreateResp" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span v-if="!loadingCreateResp">Submit</span>
                  </button>
                </div>
              </div>
            </div>
            <QuotaFullCard quotacode="recipe" @inSubscription="inSubscription=$event"></QuotaFullCard>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {ApiResponse, PaginatedApiResponse} from "../../../types";
import {onMounted, reactive, ref, watch} from "vue";
import UiPanel from "../../../components/parts/ui-panel.vue";
import axios from "axios";
import {endpoints} from "../../../helpers/endpoints";
import {pitLib} from "../../../helpers/pitLib";
import Tags from "../../../components/Tagify.vue";
import Editor from "../../../components/editor.vue";
import {env} from "../../../helpers/env";
import Comment from "../../../components/Comment.vue";
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {Vue3Lottie} from "vue3-lottie";
import {store} from "../../../store/DataLake";
import QuotaFullCard from "../../../components/QuotaFullCard.vue";

const loadingCreateResp=ref<boolean>(false)
const createResp=ref<ApiResponse>()
const field_logo=ref(null)
const logo_preview=ref(null)
const formData=reactive({
  title:"",tags:'',content:null,logo:null,category:null
})
const inSubscription = ref<boolean>();

const categResp=ref<PaginatedApiResponse>()
const loadingCategResponse=ref<boolean>(true)
function refetch() {
  loadingCategResponse.value = true
  axios.post<PaginatedApiResponse>(endpoints.recipe.category.index, {
    status:"active"
  }, {
    headers: pitLib.util.headers(),
    params: {pagination:500}
  }).then(d => {
    loadingCategResponse.value = false
    categResp.value = d.data
  })
}

async function submit() {
  loadingCreateResp.value=true
  var tags=formData.tags?JSON.parse(formData.tags).map(o=>o.value):null
  let fd=new FormData()
  fd.append("title",formData.title)
  if (tags){
    tags.forEach((item) => fd.append("tags", item))
  }
  fd.append("content",formData.content)
  fd.append("logo",field_logo.value?.files[0])
  fd.append("category",formData.category)
  fd.append("status","active")
  await axios.post<PaginatedApiResponse>(endpoints.recipe.create, fd, {
    headers: pitLib.util.headers(),
  }).then(d => {
    loadingCreateResp.value = false
    createResp.value = d.data
  })
}

async function handleLogo() {
  logo_preview.value=await pitLib.media.getBase64(field_logo.value?.files[0])
  formData.logo=field_logo.value?.files[0]
}

onMounted(()=>{
  refetch()
  new Tagify(document.querySelector('#tags'))
})
</script>

