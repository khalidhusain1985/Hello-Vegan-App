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
      <div class="row" style="background-image: url(/tpl1/images/bg-23.png);">
        <div class="col-xl-5 d-none d-xl-block p-0 vh-100 bg-image-cover bg-no-repeat" style="background-image: url(/tpl1/images/bg2.png);"></div>
        <div class="col-xl-7 vh-100 align-items-center d-flex bg-white rounded-3 overflow-hidden">
          <div class="card shadow-none border-0 ms-auto me-auto login-card">
            <div class="card-body rounded-0 text-left">
              <h2 class="fw-700 display1-size display2-md-size mb-3">Forgot <br>your Password?</h2>
              <ui-panel :type="otpResponse?.status?'success':'warning'" :content="otpResponse?.message" v-if="!verifOtpResponse"></ui-panel>
              <ui-panel :type="verifOtpResponse?.status?'success':'warning'" :content="verifOtpResponse?.message" ></ui-panel>

              <form v-if="!otpResponse?.data" @submit.prevent="reqOtp()">
                <div class="form-group icon-input mb-3">
                  <i class="font-sm ti-email text-grey-500 pe-0"></i>
                  <input v-model="fd.email" type="text" class="style2-input ps-5 form-control text-grey-900 font-xsss fw-600" placeholder="Your Email Address">
                </div>
                <div class="form-group icon-input mb-1">
                  <input v-model="fd.password" type="Password" class="style2-input ps-5 form-control text-grey-900 font-xss ls-3" placeholder="Password">
                  <i class="font-sm ti-lock text-grey-500 pe-0"></i>
                </div>
                <div class="form-check text-left mb-3">
                  <router-link to="/login" class="fw-600 font-xsss text-grey-700 mt-1 float-right">Try Login</router-link>
                </div>
                <div class="col-sm-12 p-0 text-left">
                  <div class="form-group mb-1">
                    <button type="submit" :disabled="runTime.loading" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0">
                      <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span v-if="!runTime.loading">Next</span>
                    </button>
                  </div>
                  <h6 class="text-grey-500 font-xsss fw-500 mt-0 mb-0 lh-32">Dont have account <router-link to="/signup" class="fw-700 ms-1">Register</router-link></h6>
                </div>
              </form>

              <form v-if="otpResponse?.data" @submit.prevent="verifOtp()">
                <div class="row justify-content-center">
                  <div class="col-12 col-md-6 col-lg-4" style="min-width: 500px;">
                    <div class="card bg-white mb-5 mt-5 border-0" style="box-shadow: 0 12px 15px rgba(0, 0, 0, 0.02);">
                      <div class="card-body p-5 text-center">
                        <h4>Verify</h4>
                        <p>Your code was sent to you via email</p>

                        <div class="otp-field mb-4">
                          <input :maxlength="1" :id="'otp_'+i" class="form-control fw-800" type="number" @change="handleOtpEnter(i)" @keyup.delete="handleOtpDelete(i)" v-model="fd_otp.otp[i]" v-for="(n,i) in 4" :disabled="fd_otp.otp[i]" :class="{'disabled':fd_otp.otp[i]}"/>
                          <button @click="handleOtpReset()" class="btn btn-sm btn-warning">Clear</button>
                        </div>
                      </div>
                      <button type="submit" :disabled="runTime.loading" class="form-control text-center style2-input text-white fw-600 bg-dark border-0 p-0 ">
                        <span v-if="runTime.loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span v-if="!runTime.loading">Change Password</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
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
import {reactive, ref} from "vue";
import {endpoints} from "../../helpers/endpoints";
import {pitLib} from "../../helpers/pitLib";
import axios from "axios";
import {ApiResponse, PaginatedApiResponse} from "../../types";
import {cuteAlert} from "cute-alert";
import UiPanel from "../../components/parts/ui-panel.vue";
import {useRouter} from "vue-router";
const runTime=reactive({
  loading:false,
})
const fd=reactive({
  _id:'',email:'',password:''
})
const fd_otp=reactive({
  otp:[]
})
const divResp=ref()
const otpResponse=ref<ApiResponse>()
const verifOtpResponse=ref<ApiResponse>()
const updateResponse=ref<ApiResponse>()
const router=useRouter()
function update() {
  runTime.loading=true
  axios.post<ApiResponse>(
      endpoints.user.update,
      fd,
      {
        headers: pitLib.util.headers(),
      },
  ).then((d)=>{
    updateResponse.value=d.data
    if (updateResponse.value?.status){
      cuteAlert({
        type: 'success',
        title: "Hurray!",
        description: "Password updated!",
      }).then(()=>{
        router.push('/login')
      })
    }
    runTime.loading=false
  })
}
function verifOtp() {
  runTime.loading=true
  axios.post<ApiResponse>(
      endpoints.otp.verify,
      {target:fd.email,otp:fd_otp.otp.join('')},
      {
        headers: pitLib.util.headers(),
      },
  ).then((d)=>{
    verifOtpResponse.value=d.data
    if (verifOtpResponse.value?.status){
      update()
      //   nuxtStorage.sessionStorage.setData(env.KEYWORDS.USER_SESSION_KEY,signupResponse.value?.data,env.SES_LOGIN_EXPIRY_DAYS,'d')
    }
    runTime.loading=false
  })
}
function reqOtp() {
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
  runTime.loading=true
  axios.post<ApiResponse>(
      endpoints.otp.create.email,
      {target:fd.email},
      {
        headers: pitLib.util.headers(),
      },
  ).then((d)=>{
    fd._id=d.data?.data._id
    otpResponse.value=d.data
    runTime.loading=false
  })
}

function handleOtpEnter(i:number) {
  $("#otp_"+(i+1)).focus()
}
function handleOtpDelete(i:number) {
  if(i>0){
    fd_otp[i]=undefined
  }
}
function handleOtpReset() {
  for (let i = 0; i < fd_otp.otp.length; i++) {
    fd_otp.otp[i]=undefined
  }
}
</script>

<style>
.otp-field {
  flex-direction: row;
  column-gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-field input {
  height: 45px;
  width: 42px;
  border-radius: 6px;
  outline: none;
  font-size: 1.125rem;
  text-align: center;
  border: 1px solid #ddd;
}
.otp-field input:focus {
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
.otp-field input::-webkit-inner-spin-button,
.otp-field input::-webkit-outer-spin-button {
  display: none;
}
</style>