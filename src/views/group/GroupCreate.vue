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
      <div class="row mt-3">
        <div class="col-12 col-md-6 col-lg-6 col-xl-6 mb-2">
          <div class="form-group">
            <label class="mont-font fw-600 font-xsss">Title</label>
            <input v-model="formData.title" type="text" class="form-control">
          </div>
        </div>
        <div class="col">
          <label class="mont-font fw-600 font-xsss">Description</label>
          <textarea rows="6" v-model="formData.description" type="text" class="form-control"></textarea>
        </div>
      </div>
      <div class="row">
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
      <div class="row">
        <div class="col">
          <div class="form-group">
            <label class="mont-font fw-600 font-xsss">Friends</label>
            <input @change="members=$event?.target?.tagifyValue" id="friends" type="text" class="form-control">
          </div>
        </div>
      </div>
      <ui-panel class="mt-3" ref="divResp" :type="createResponse?.status?'success':'warning'" :content="createResponse?.message" @show="createResponse=$event" v-if="createResponse"></ui-panel>
      <div class="row mt-3">
        <div class="col text-right">
          <button @click="submit()" :disabled="loadingCreateResp" type="button" class="btn btn-primary rounded-pill text-white">
            <span v-if="!loadingCreateResp" >Post</span>
            <i v-if="loadingCreateResp" class="fas fa-spinner fa-spin"></i>
          </button>
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
import {ApiResponse, PaginatedApiResponse} from "../../../types";
import {onMounted, reactive, ref, watch} from "vue";
import {endpoints} from "../../../helpers/endpoints";
import axios from "axios";
import {env} from "../../../helpers/env";
import UiPanel from "../../../components/parts/ui-panel.vue";
import {useRouter} from "vue-router";
import {cuteToast} from "cute-alert";

const formData = reactive({
  title:"",logo:null,description:""
})
const logo_preview=ref()
const friendsPage=ref<number>(1)
const field_logo=ref(null)
const members=ref()
const router=useRouter()
async function handleLogo() {
  logo_preview.value=await pitLib.media.getBase64(field_logo.value?.files[0])
  formData.logo=field_logo.value?.files[0]
}
const createResponse=ref<ApiResponse>()
const friendsResp=ref<ApiResponse>()
const loadingCreateResp=ref<boolean>(false)
const loadingFriendsResp=ref<boolean>(false)
function refetchFriendsResp(){
  loadingFriendsResp.value=true
  axios.post<PaginatedApiResponse>(
      endpoints.friend.index.my,
      {},
      {
        headers: pitLib.util.headers(),
        params:{pagination:1000}
      }
  ).then(d=>{
    loadingFriendsResp.value=false
    friendsResp.value=d.data
  })
}

watch(friendsResp,f=>{
  new Tagify(document.querySelector('#friends'),{
    enforceWhitelist: true,
    whitelist: friendsResp.value?.data.data.map(item => ({
      value: item.name,
      key: item._id
    })),
    maxTags: 10,
    dropdown: {
      maxItems: 20,           // <- mixumum allowed rendered suggestions
      classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
      enabled: 0,             // <- show suggestions on focus
      closeOnSelect: false    // <- do not hide the suggestions dropdown once an item has been selected
    }
  })
})
watch(members,f=>{
  try {
    members.value=f?JSON.parse(f)?.map((o:any)=>o.key):[]
  } catch (e) {}
})
function submit() {
  loadingCreateResp.value=true
  let fd=new FormData()
  fd.append("title",formData.title)
  fd.append("logo",formData.logo)
  fd.append("description",formData.description)
  axios.post<ApiResponse>(
      endpoints.group.create,
      fd,
      {
        headers: pitLib.util.headers(),
      }
  ).then((d)=>{
    createResponse.value=d.data
  }).then(()=>{
    if(createResponse.value?.status){
      axios.post<PaginatedApiResponse>(
          endpoints.group.member.create,
          {
            group_id:createResponse.value.data._id,
            user_id:members.value
          },
          {
            headers: pitLib.util.headers(),
          }
      ).then((d)=>{
        loadingCreateResp.value=false
        createResponse.value=d
        if(d.data.status){
          cuteToast({
            type: d?.status? "success":"warning",
            title: d?.message,
            timer: 5000
          }).then(()=>{
            router.push("/group")
          })

        }
      })
    }
  })
}

onMounted(()=>{
  refetchFriendsResp()
})
</script>

