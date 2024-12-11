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
          <div class="card w-100 border-0 bg-white shadow-xs p-0 mb-4">

            <div class="card-body p-lg-5 p-4 w-100 border-0">
              <div class="row">
                <div class="col-lg-12">
                  <h4 class="mb-4 font-xxl fw-700 mont-font mb-lg-5 mb-4 font-md-xs">Settings</h4>
                  <div class="nav-caption fw-600 font-xssss text-grey-500 mb-2">Genaral</div>
                  <ul class="list-inline mb-4">
                    <li class="list-inline-item d-block border-bottom me-0">
                      <RouterLink to="/me/profile" class="pt-2 pb-2 d-flex align-items-center">
                        <i class="btn-round-md bg-gold-gradiant text-white fa-solid fa-address-card font-md me-3"></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">Account</h4>
                        <i class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                      </RouterLink>
                    </li>
                    <li class="list-inline-item d-block border-bottom me-0">
                      <RouterLink to="/me/subscription" class="pt-2 pb-2 d-flex align-items-center">
                        <i class="btn-round-md bg-gold-gradiant text-white fa-solid fa-address-card font-md me-3"></i>
                        <h4 class="fw-600 font-xsss mb-0 mt-0">Subscription</h4>
                        <i class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i>
                      </RouterLink>
                    </li>
                    <li class="list-inline-item d-block border-bottom me-0"><RouterLink to="/friends" class="pt-2 pb-2 d-flex align-items-center"><i class="btn-round-md bg-gold-gradiant text-white fa-solid fa-user-group font-md me-3"></i> <h4 class="fw-600 font-xsss mb-0 mt-0">Friends</h4><i class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i></RouterLink></li>

                  </ul>

<!--                  <div class="nav-caption fw-600 font-xsss text-grey-500 mb-2">Acount</div>-->
<!--                  <ul class="list-inline mb-4">-->
<!--                    <li class="list-inline-item d-block border-bottom me-0"><a href="payment.html" class="pt-2 pb-2 d-flex align-items-center"><i class="btn-round-md bg-mini-gradiant text-white feather-credit-card font-md me-3"></i> <h4 class="fw-600 font-xsss mb-0 mt-0">My Cards</h4><i class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i></a></li>-->
<!--                  </ul>-->

                  <div class="nav-caption fw-600 font-xsss text-grey-500 mb-2">Other</div>
                  <ul class="list-inline">
                    <li class="list-inline-item d-block me-0"><a role="button" @click="logout()" class="pt-2 pb-2 d-flex align-items-center"><i class="btn-round-md bg-red-gradiant text-white feather-lock font-md me-3"></i> <h4 class="fw-600 font-xsss mb-0 mt-0">
                      <span v-if="loadingLogOut" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span v-if="!loadingLogOut">Logout</span>
                    </h4><i class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i></a></li>
                    <li class="list-inline-item d-block me-0"><a role="button" @click="deleteMyAccount()" class="pt-2 pb-2 d-flex align-items-center"><i class="btn-round-md bg-red-gradiant text-white feather-lock font-md me-3"></i> <h4 class="fw-600 font-xsss mb-0 mt-0">
                      <span v-if="loadingDelAc" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span v-if="!loadingDelAc">Delete Account</span>
                    </h4><i class="ti-angle-right font-xsss text-grey-500 ms-auto mt-3"></i></a></li>
                  </ul>
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
import axios from "axios";
import {endpoints} from "../../../helpers/endpoints";
import {pitLib} from "../../../helpers/pitLib";
import { ref} from "vue";
import {ApiResponse} from "../../../types";
import {useRouter} from "vue-router";
import {store} from "../../../store/DataLake";
import {cuteAlert} from "cute-alert";
const router=useRouter()

const loadingLogOut=ref(false)
const loadingDelAc=ref(false)

function logout() {
  loadingLogOut.value=true
  axios.post<ApiResponse>(
      endpoints.user.logout,
      {
        headers: pitLib.util.headers(),
      },
  ).then(()=>{
    pitLib.auth.clear()
    router.push('/login')
    loadingLogOut.value=false
  })
}
function deleteMyAccount() {
  cuteAlert({
    type: 'question',
    title: "Attention!",
    description: 'Do you want to delete your account?',
    primaryButtonText: 'Yes',
    secondaryButtonText: 'Cancel',
  }).then((d:string)=> {
    if (d == 'primaryButtonClicked') {
      loadingDelAc.value=true
      axios.post<ApiResponse>(
          endpoints.user.update,
          {
            _id:pitLib.auth.get()?._id,status:"inactive"
          },
          {
            headers: pitLib.util.headers(),
          },
      ).then(()=>{
        pitLib.auth.clear()
        router.push('/login')
        loadingDelAc.value=false
      })
    }
  });

}
</script>

