<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-card>
        <div class="row">
          <div class="col">
            <div class="card shadow-none border-0 ms-auto me-auto login-card">
              <div class="card-body rounded-0 text-left">
                <h2 class="fw-700 display1-size display2-md-size mb-3">Login into <br>your account</h2>
                <form @submit.prevent="login()">
                  <!--              <ui-panel ref="divResp" :type="loginResponse?.status===true?'success':'warning'" :content="loginResponse?.message" @show="loginResponse=$event" v-if="loginResponse"></ui-panel>-->
                  <div class="form-group icon-input mb-3">
                    <i class="font-sm ti-email text-grey-500 pe-0"></i>
                    <input v-model="fd.email" type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
                  </div>
                  <div class="form-group icon-input mb-1">
                    <input v-model="fd.password" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                    <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                  </div>
                  <div class="form-check text-left mb-3">
                    <input type="checkbox" class="form-check-input mt-2" id="exampleCheck5">
                    <label class="form-check-label font-xsss text-grey-500" for="exampleCheck5">Remember me</label>
<!--                    <a href="forgot.html" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a>-->
                  </div>
                </form>

                <div class="col-sm-12 p-0 text-left">
                  <div class="form-group mb-1">
                    <button @click="login()" type="submit" :disabled="runTime.loading"  class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                      <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span v-if="!runTime.loading">Login</span>
                    </button>
                  </div>
                  <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Dont have account <router-link to="/signup" class="fw-700 ms-1">Register</router-link></h6>
                  <h6><router-link to="/forgot-password" class="fw-700 ms-1">Forgot Password</router-link></h6>
                </div>
                <div class="col-sm-12 p-0 text-center mt-2">

<!--                  <h6 class="mb-0 d-inline-block bg-white fw-500 font-xsss text-grey-500 mb-3">Or, Sign in with your social account </h6>-->
<!--                  <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-facebook border-0 p-0 mb-2"><img src="/tpl1/images/icon-1.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Google</a></div>-->
<!--                  <div class="form-group mb-1"><a href="#" class="form-control text-left style2-input text-white fw-600 bg-twiiter border-0 p-0 "><img src="/tpl1/images/icon-3.png" alt="icon" class="ms-2 w40 mb-1 me-5"> Sign in with Facebook</a></div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonCard,
  IonGrid,
  IonInput,
  IonRow,
  IonCol,
  IonContent,
  IonCardContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/vue';
import {reactive} from "vue";
import {endpoints} from "../../helpers/endpoints";
import {pitLib} from "../../helpers/pitLib";
import axios from "axios";
import {ApiResponse} from "../../types";
import {cuteAlert} from "cute-alert";
import UiPanel from "../../components/parts/ui-panel.vue";
const runTime=reactive({
  loading:false,
})
const fd=reactive({
  email:null,password:null,
})
async function login() {
  runTime.loading = true
  const {data} = await axios.post<ApiResponse>(endpoints.user.login, fd, {
  })
  await cuteAlert({
    type: data.status?"success":"error",
    title: data.message,
    timer: 3000,
    primaryButtonText: 'Ok',
    // secondaryButtonText: 'Cancel'
  })
  if (data.status){
    pitLib.auth.set(JSON.stringify(data.data))
    location.href='/'
  }
  runTime.loading = false
}
</script>

