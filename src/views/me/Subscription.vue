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
              Your Subscription
              <router-link to="/subscription/purchase" class="btn btn-link float-end">Purchase</router-link>
            </div>
            <div class="card-body p-0">
              <div class="" v-if="sp">
                <div class="border border-primary p-2 rounded-lg shadow">
                  <center>
                    <img :height="40" :width="40" :src="sp?.additional?.images?.[0]">
                    <h5 class="text-info">{{sp?.additional?.description}}</h5>
                    <h6 class="text-muted">Expiring in {{pitLib.dt.diffDays(new Date(),sp?.expire_by)}} days.</h6>
                  </center>
                </div>
                <table class="table table-responsive">
                  <thead>
                  <tr>
                    <th>Type</th>
                    <th>Subscription</th>
                    <th>Usage</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Veganlog</td>
                    <td>{{sp?.quota?.veganlog}}</td>
                    <td>{{sp?.usage?.veganlog}}</td>
                  </tr>
                  <tr>
                    <td>Blog</td>
                    <td>{{sp?.quota?.blog}}</td>
                    <td>{{sp?.usage?.blog}}</td>
                  </tr>
                  <tr>
                    <td>Recipe</td>
                    <td>{{sp?.quota?.recipe}}</td>
                    <td>{{sp?.usage?.recipe}}</td>
                  </tr>
                  <tr>
                    <td>Events</td>
                    <td>{{sp?.quota?.event}}</td>
                    <td>{{sp?.usage?.event}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-center" v-if="!sp">
                <h3 class="text-info mt-3">Time to be a Pro!</h3>
                <Vue3Lottie
                    animationLink="/json/premium_1.json"
                    :height="200"
                    :width="200"
                />
                <h5>Time to get a subscription!</h5>
                <router-link to="/subscription/purchase" class="btn btn-info rounded">Purchase <i class="fa fas fa-check ml-2"></i></router-link>
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
import {pitLib} from "../../../helpers/pitLib";
import {Vue3Lottie} from "vue3-lottie";
import {store} from "../../../store/DataLake";
import {ref} from "vue";
const sp=ref<any>()
sp.value=store.state_user?.subscriptionpurchases?.[0]
</script>

