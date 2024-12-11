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
          <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
            <div class="card-header bg-transparent">
              Purchase Subscription
            </div>
            <div class="card-body p-0">
              <section class="pricing py-5">
                <div class="container">
                  <div class="row">
                    <div class="col">
                      <label for="exampleFormControlSelect1">Mode Of Payment</label>
                      <select v-model="pg" class="form-control" id="exampleFormControlSelect1">
                        <option value="national">National</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                  </div>
                  <div class="row" v-if="subscriptionResponse?.status&&!loadingRequestSubs">
                    <!-- Free Tier -->
                    <div class="col-12 col-md-4 col-lg-4 col-xl-4" v-for="s of subscriptionResponse?.data">
                      <div class="card mb-5 mb-lg-0">
                        <div class="card-body">
                          <h5 class="card-title text-muted text-uppercase text-center">
                            <img :src="s?.images?.[0]" height="40" width="40">
                          </h5>
                          <h5 class="card-title text-muted text-uppercase text-center">{{s?.name}}</h5>
                          <h6 class="card-price text-center">$ {{s?.prices.at(-1).unit_amount/100}}<span class="period">/ {{s?.prices.at(-1).recurring?.interval}}</span></h6>
                          <hr>
                          <ul class="fa-ul">
                            <li v-for="f of s?.marketing_features"><span class="fa-li"><i class="fas fa-check"></i></span>{{f.name}}</li>
                            <!--                              <li class="text-muted"><span class="fa-li"><i class="fas fa-times"></i></span>Monthly Status Reports</li> -->
                          </ul>
                          <div class="d-grid mt-3">
                            <a role="button" @click="purchase(s)" class="btn btn-primary text-uppercase text-white" :class="{'disabled':!pg}">Select</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-md-4 col-lg-4 col-xl-4" v-if="subsResp?.data?.data?.length">
                      <div class="card mb-5 mb-lg-0">
                        <div class="card-body">
                          <h5 class="card-title text-muted text-uppercase text-center">
                            <img src="https://cdn-icons-png.flaticon.com/128/575/575927.png" height="40" width="40">
                          </h5>
                          <h5 class="card-title text-muted text-uppercase text-center">Free</h5>
                          <h6 class="card-price text-center">Free Forever!</h6>
                          <hr>
                          <ul class="fa-ul">
                            <li>
                              <span class="fa-li"><i class="fas fa-check"></i></span>
                              {{subsResp?.data?.data?.[0].limits.veganlog}} Veganlog
                            </li>
                            <li>
                              <span class="fa-li"><i class="fas fa-check"></i></span>
                              {{subsResp?.data?.data?.[0].limits.blog}} Blog
                            </li>
                            <li>
                              <span class="fa-li"><i class="fas fa-check"></i></span>
                              {{subsResp?.data?.data?.[0].limits.events}} Events
                            </li>
                            <li>
                              <span class="fa-li"><i class="fas fa-check"></i></span>
                              {{subsResp?.data?.data?.[0].limits.recipe}} Recipe
                            </li>
                            <li>
                              <span class="fa-li"><i class="fas fa-check"></i></span>
                              {{subsResp?.data?.data?.[0].limits.reel}} Reel
                            </li>
                            <!--                              <li class="text-muted"><span class="fa-li"><i class="fas fa-times"></i></span>Monthly Status Reports</li> -->
                          </ul>
                          <div class="d-grid mt-3">
                            <a role="button" @click="purchaseFree()" class="btn btn-primary text-uppercase text-white" :class="{'disabled':!pg}">Select</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Vue3Lottie v-if="loadingRequestSubs"
                              animationLink="/json/loading_2.json"
                              :height="200"
                              :width="200"
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import {Vue3Lottie} from "vue3-lottie";
import {store} from "../../../store/DataLake";
import {onMounted, ref} from "vue";
import axios from "axios";
import {PaginatedApiResponse} from "../../../types";
import {endpoints} from "../../../helpers/endpoints";
import {pitLib} from "../../../helpers/pitLib";
import {cuteAlert, cuteToast} from "cute-alert";
import {useRouter} from "vue-router";
const loadingRequestSubs=ref<boolean>(false)
const router=useRouter()
const subsResp=ref<PaginatedApiResponse>()
const pg=ref<"national"|"international">("international")
const subscriptionResponse=ref<PaginatedApiResponse>()
function refetchSubscriptionResponse() {
  loadingRequestSubs.value=true
  axios.post<PaginatedApiResponse>(
      endpoints.subscription.indexStripe,
      {

      },
      {
        headers: pitLib.util.headers(),
      }
  ).then((d)=>{
    loadingRequestSubs.value=false
    subscriptionResponse.value=d.data
  })
}

function purchase(s:any) {
  loadingRequestSubs.value =true
  axios.post<PaginatedApiResponse>(
      (pg.value=='international')?endpoints.subscription.purchaseStripe:endpoints.subscription.purchase,
      {price_id:s.default_price},
      {
        headers: pitLib.util.headers(),
      }
  ).then((d)=>{
    loadingRequestSubs.value =false
    cuteToast({
      type: d?.status?"success":"warning",
      title: d?.data?.message,
      timer: 5000
    })
  })
}

function refreshSubs() {
  axios.post<PaginatedApiResponse>(
      endpoints.subscription.index,
      {},
      {
        headers: pitLib.util.headers(),
      }
  ).then((d)=>{
    subsResp.value=d.data
  })
}
function purchaseFree(){
  cuteAlert({
    type: 'question',
    title: "Are you sure to get free subscription?",
    description: 'You will miss premium features!',
    primaryButtonText: 'Yes',
    secondaryButtonText: 'Cancel',
  }).then((d:string)=>{
    if (d=='primaryButtonClicked'){
      loadingRequestSubs.value=true
      axios.post<PaginatedApiResponse>(
          endpoints.subscription.purchase,
          {},
          {
            headers: pitLib.util.headers(),
          }
      ).then(()=>{
        loadingRequestSubs.value=false
        router.push('/me/subscription')
      })
    }
  })
}
onMounted(()=>{
  refetchSubscriptionResponse()
  refreshSubs()
})
</script>

