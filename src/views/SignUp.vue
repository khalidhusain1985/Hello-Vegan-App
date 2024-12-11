<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Sign Up</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="row">
        <div class="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat" style="background-image: url(/tpl1/images/login-bg_2.jpg);"></div>
        <div class="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
          <div class="card shadow-none border-0 ms-auto me-auto login-card">
            <div class="card-body rounded-0 text-left">
              <h2 class="fw-700 display1-size display2-md-size mb-4">Create <br>your account</h2>
              <ui-panel ref="divResp_" :type="otpResponse?.status?'success':'warning'" :content="otpResponse?.message" :show="otpResponse" v-if="!otpResponse?.status&&otpResponse?.message"></ui-panel>
              <ui-panel ref="divResp" :type="signupResponse?.status?'success':'warning'" :content="signupResponse?.message" :show="signupResponse" v-if="signupResponse?.message"></ui-panel>

              <form v-if="!otpResponse?.status" @submit.prevent="reqOtp()">

                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-user text-grey-500 pe-0"></i>
                  <input v-model="fd.name" type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Name">
                </div>
                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-email text-grey-500 pe-0"></i>
                  <input v-model="fd.email" type="email" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
                </div>
                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-mobile text-grey-500 pe-0"></i>
                  <input v-model="fd.phone" type="tel" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Phone">
                </div>
                <div class="form-group icon-input mb-3">
                  <input v-model="fd.password" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                  <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                </div>
                <div class="form-group icon-input mb-1">
                  <input v-model="fd.password_confirmation" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Confirm Password">
                  <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                </div>
                <div class="form-check text-left mb-3">
                  <input type="checkbox" class="form-check-input mt-2" id="exampleCheck2">
                  <label class="form-check-label font-xsss text-grey-500" for="exampleCheck2">Accept Term and Conditions</label>
                  <!-- <a href="#" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Forgot your Password?</a> -->
                </div>
              </form>

              <form v-if="otpResponse?.status">

                <div class="row justify-content-center">
                  <div class="col-12 col-md-6 col-lg-4" style="min-width: 500px;">
                    <div class="card bg-white mb-5 mt-5 border-0" style="box-shadow: 0 12px 15px rgba(0, 0, 0, 0.02);">
                      <div class="card-body p-5 text-center">
                        <h4>Verify</h4>
                        <p>Your code was sent to you via email</p>

                        <div class="form-group mb-4">
                          <label for="otp">Enter 4 Digit OTP Here</label>
                          <input v-model="fd_otp.otp" id="otp" placeholder="Eg. 1234" class="form-control text-center fw-500" type="number" maxlength="4"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div class="col-sm-12 p-0 text-left">
                <div class="form-group mb-1">
                  <button v-if="!otpResponse?.status" :disabled="runTime.loading" @click="reqOtp()" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                    <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span v-if="!runTime.loading">Next</span>
                  </button>
                  <button v-if="otpResponse?.status" :disabled="runTime.loading" @click="verifOtp()" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                    <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span v-if="!runTime.loading">Signup</span>
                  </button>
                </div>
                <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Already have account <router-link to="/login" class="fw-700 ms-1">Login</router-link></h6>
              </div>

            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import {useRouter} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {ApiResponse, PaginatedApiResponse} from "../../types";
import {endpoints} from "../../helpers/endpoints";
import axios from "axios";
import {cuteAlert} from "cute-alert";
import UiPanel from "../../components/parts/ui-panel.vue";

const router=useRouter()
const fd=reactive({
  name:'',phone:'',email:'',password:'',password_confirmation:''
})
const fd_otp=reactive({
  otp:undefined
})
const runTime=reactive({
  loading:false
})
const signupResponse=ref<ApiResponse>()
const otpResponse=ref<ApiResponse>()
function signup() {
  runTime.loading=true
  axios.post<PaginatedApiResponse>(
      endpoints.user.create,
      fd
  ).then((d)=>{
    signupResponse.value=d.data
    if (signupResponse.value?.status){
      cuteAlert({
        type: 'success',
        title: "Hurray!",
        primaryButtonText: 'Ok',
        description: 'Account created successfully!. Please login',
      }).then(()=>{
        router.push('/login')
      })
    }
    runTime.loading=false
  })
}
function verifOtp() {
  runTime.loading=true
  axios.post<PaginatedApiResponse>(
      endpoints.otp.verify,
      {
        target:fd.email,otp:fd_otp.otp.toString()
      }
  ).then((d)=>{
    signupResponse.value=d.data
    if (signupResponse.value?.status){
      signup()
      //   nuxtStorage.sessionStorage.setData(env.KEYWORDS.USER_SESSION_KEY,signupResponse.value?.data,env.SES_LOGIN_EXPIRY_DAYS,'d')
    } else {
      cuteAlert({
        type: 'error',
        title: "Oops",
        primaryButtonText: 'Ok',
        description: d.data?.message,
      })
    }
    runTime.loading=false
  })
}
function reqOtp() {
  if (!fd.name){
    return otpResponse.value={
      status:false,
      message:"Name is required",
      data: null,
    }
  }
  if (!fd.phone){
    return otpResponse.value={
      status:false,
      message:"Phone is required",
      data: null,
    }
  }
  if (!fd.email){
    return otpResponse.value={
      status:false,
      message:"Email is required",
      data: null,
    }
  }
  if (!fd.password){
    return otpResponse.value={
      status:false,
      message:"Password is required",
      data: null,
    }
  }
  if (fd.password!==fd.password_confirmation){
    return otpResponse.value={
      status:false,
      message:"Confirmation password not matched",
      data: null,
    }
  }
  runTime.loading=true
  axios.post<PaginatedApiResponse>(
      endpoints.otp.create.email,
      {
        target:fd.email
      }
  ).then((d)=>{
    otpResponse.value=d.data
    runTime.loading=false
  })
}

onMounted(()=>{
  signupResponse.value=otpResponse.value=undefined
})
</script>
