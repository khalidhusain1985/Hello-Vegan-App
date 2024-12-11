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
          <div class="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
            <div class="card-body d-flex align-items-center p-0">
              <h2 class="fw-700 mb-0 mt-0 font-md text-grey-900">Friends</h2>
              <span v-if="searchedQuery" class="ms-5 badge badge-primary bg-success badge-lg">Searching : {{searchedQuery}}</span>
              <div class="search-form-2 ms-auto">
                <i class="ti-search font-xss"></i>
                <input v-model="searchedQuery" @input="getData()" type="search" class="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0 text-secondary"  placeholder="At least 3-4 words..">
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-lg-10 col-xl-8">
              <ul class="nav nav-tabs">
                <li class="nav-item">
                  <a @click="tab='friends'" :class="{'active':tab=='friends'}" role="button" class="nav-link"><i class="fas fa-user-group me-2"></i> Friends</a>
                </li>
                <li class="nav-item">
                  <a @click="tab='new'" :class="{'active':tab=='new'}" role="button" class="nav-link"><i class="fas fa-user-plus me-2"></i> Find Friends</a>
                </li>
                <li class="nav-item">
                  <a @click="tab='pending'" :class="{'active':tab=='pending'}" role="button" class="nav-link"><i class="fas fa-user-clock me-2"></i> Sent Requests</a>
                </li>
                <li class="nav-item">
                  <a @click="tab='requests'" :class="{'active':tab=='requests'}" role="button" class="nav-link"><i class="fas fa-hand me-2"></i> Friend Requests</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <Vue3Lottie
                  v-if="loadingUserResponse"
                  animationLink="/json/loading_1.json"
                  :height="200"
                  :width="200"
              />
              <div class="row ps-2 pe-2" v-if="userResponse?.status">
                <div v-for="u in userResponse.data.data" class="col-md-3 col-sm-4 pe-2 ps-2" >
                  <div class="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-3">
                    <div class="card-body d-block w-100 ps-3 pe-3 pb-4 text-center">
                      <div class="row">
                        <div class="col">
                          <RouterLink :to="'/chat/'+u._id">
                            <figure class="avatar ms-auto me-auto mb-0 position-relative w65"><img :src="u?.media.length?env.BASEPOINT+u?.media?.[0].path:env.NO_IMG_USER" alt="image" class="float-right p-0 bg-white rounded-pill w-100 shadow-xss"></figure>
                          </RouterLink>
                        </div>
                      </div>
                      <div class="clearfix"></div>
                      <h4 class="fw-700 font-xsss mt-3 mb-1"><RouterLink :to="'/chat/'+u._id">{{u?.name}}</RouterLink> </h4>
                      <p class="fw-500 font-xsssss text-grey-500 mt-0 mb-3">{{u?.email}}</p>
                      <a v-if="tab=='new'" :id="'btn_send_request_'+u._id" :class="{'disabled':loadingTarget==u._id}" role="button" @click="sendRequest(u)" class="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-success font-xsssss fw-700 ls-lg text-white" >
                        <span v-if="loadingTarget!==u._id">ADD FRIEND</span>
                        <span v-if="loadingTarget==u._id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      </a>
                      <a v-if="tab=='friends'||tab=='pending'" :id="'btn_remove_request_'+u._id" :class="{'disabled':loadingTarget==u._id}" role="button" @click="confDel(u)" class="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-danger font-xsssss fw-700 ls-lg text-white" >
                        <span v-if="loadingTarget!==u._id">Remove</span>
                        <span v-if="loadingTarget==u._id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      </a>
                      <a v-if="tab=='requests'" :id="'btn_accept_request_'+u._id" :class="{'disabled':loadingTarget==u._id}" role="button" @click="confAccept(u)" class="mt-0 btn pt-2 pb-2 ps-3 pe-3 lh-24 ms-1 ls-3 d-inline-block rounded-xl bg-info font-xsssss fw-700 ls-lg text-white" >
                        <span v-if="loadingTarget!==u._id">Accept</span>
                        <span v-if="loadingTarget==u._id" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="userResponse" class="row mt-2">
                <div class="col">
                  <nav aria-label="...">
                    <ul class="pagination justify-content-center">
                      <li class="page-item" :class="{'disabled':page==1}">
                        <a role="button" class="page-link" @click="page=Number(page)-1;getData()">Previous</a>
                      </li>
                      <li v-for="p in userResponse.data.pages" :key="p" class="page-item" :class="{ active: page==Number(p) }">
                        <a role="button" class="page-link" @click="page=Number(p);getData()">{{p}}</a>
                      </li>
                      <li class="page-item" :class="{'disabled':userResponse.data.page==page}">
                        <a role="button" class="page-link" @click="page=Number(page)+1;getData()">Next</a>
                      </li>
                    </ul>
                  </nav>
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
import {IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import {onMounted, ref, watch} from "vue";
import {endpoints} from "../../../helpers/endpoints";
import axios from "axios";
import {ApiResponse, PaginatedApiResponse, User} from "../../../types";
import {pitLib} from "../../../helpers/pitLib";
import {cuteAlert, cuteToast} from "cute-alert";
import {env} from "../../../helpers/env";
import {Vue3Lottie} from "vue3-lottie";
import {store} from "../../../store/DataLake";
const page=ref<number>(1)
const loadingUserResponse=ref<boolean>(true)
const loadingTarget=ref()
const userResponse=ref()
const tab=ref<"new"|"friends"|"pending"|"requests">("friends")
const searchedQuery=ref<string>()
let sourcedEndpoint=endpoints.friend.index.new
sourcedEndpoint=endpoints.friend.index.my
function getData(){
  loadingUserResponse.value=true
  axios.post<PaginatedApiResponse>(sourcedEndpoint, searchedQuery.value?{
    "name": {"$regex": searchedQuery.value, "$options": "i" }
  }:{}, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d=>{
    userResponse.value=d.data
    loadingUserResponse.value=false
  })
}
onMounted(async () => {
  getData()
})
watch(tab,t=>{
  page.value=1
  if (t=='new'){
    sourcedEndpoint=endpoints.friend.index.new
  }
  if (t=='friends'){
    sourcedEndpoint=endpoints.friend.index.my
  }
  if (t=='pending'){
    sourcedEndpoint=endpoints.friend.index.pending
  }
  if (t=='requests'){
    sourcedEndpoint=endpoints.friend.index.requests
  }
  getData()
})

function sendRequest(u:any) {
  loadingTarget.value=u._id
  axios.post<PaginatedApiResponse>(endpoints.friend.create, {to_id:u._id}, {
    headers: pitLib.util.headers(),
  }).then(d=>{
    cuteAlert({
      type:  d.data.status?"success":"error" ,
      title: d.data.message,
      timer: 3000,
      primaryButtonText: 'Ok',
      // secondaryButtonText: 'Cancel'
    })
    loadingTarget.value=null
    getData()
  })
}
async function confDel(u: User) {
  let d = await cuteAlert({
    type: "warning",
    title: "Are you sure?",
    description:"You are about to unfriend!",
    primaryButtonText: 'Yes! Unfriend',
    secondaryButtonText: 'Cancel'
  })
  if (d=="primaryButtonClicked") {
    axios.post<ApiResponse>(endpoints.friend.unfriend, {user_id: u?._id}, {
      headers: pitLib.util.headers(),
      params: {page: page.value}
    }).then(d=>{
      cuteToast({
        type: d.data.status?"success":"error",
        title: 'Result',
        description: d.data.message ,
        timer: 1500
      })
      getData()
    })
  }
}
function confAccept(u:User) {
  axios.post<ApiResponse>(endpoints.friend.respond, {user_id:u?._id, status:"confirmed"}, {
    headers: pitLib.util.headers(),
    params: {page: page.value}
  }).then(d=>{
    cuteToast({
      type: d.data.status?"success":"error",
      title: 'Result',
      description: d.data.message ,
      timer: 1500
    })
    getData()
  })
}
</script>

<style scoped></style>
