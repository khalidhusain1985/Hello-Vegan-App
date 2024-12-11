<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import {cuteAlert} from "cute-alert";
import axios from "axios";
import {ApiResponse} from "../../../types";
import {endpoints} from "../../../helpers/endpoints";
import {pitLib} from "../../../helpers/pitLib";
import UiPanel from "../../parts/ui-panel.vue";

const fd = reactive({
  description: undefined, video: undefined
});
const target_image=ref()
const target_video=ref()
const createResp=ref<ApiResponse>()
const loadingCreateResp=ref<boolean>(false)
function confirmPopup() {
  cuteAlert({
    type: 'question',
    title: "Attention!",
    description: 'Make sure to post valid vegan post!',
    primaryButtonText: 'Yes',
    secondaryButtonText: 'Cancel',
  }).then((d:string)=>{
    if (d=='primaryButtonClicked'){
      submit()
    }
  })
}
async function submit() {
  loadingCreateResp.value = true
  let _fd = new FormData()
  _fd.append("description", fd.description)
  _fd.append("video", fd.video)

  await axios.post<ApiResponse>(endpoints.reel.create, _fd, {
    headers:pitLib.util.headers()
  }).then((async (d) => {
    createResp.value = d.data
    if (createResp.value?.status) {
      fd.video=null
      fd.description=''
      target_image.value=null
      target_video.value=null
      await cuteAlert({
        type:  "success" ,
        title: d.data.message,
        timer: 3000,
        primaryButtonText: 'Ok',
        // secondaryButtonText: 'Cancel'
      })
    }
    loadingCreateResp.value = false
  }))
}
function filePicker() {
  document.getElementsByClassName('sel_image')[0].click();
}
function vidPicker() {
  document.getElementsByClassName('sel_video')[0].click();
}

async function setVideo() {
  target_video.value=URL.createObjectURL(fd.video)
  console.log(target_video.value)
}
watch(fd,()=>{createResp.value=null})


</script>

<template>
  <div class="card w-100 shadow-xss rounded-xxl border-0 ps-4 pt-4 pe-4 pb-3 mb-3">
    <div class="card-body p-0">
      <a href="#" class=" font-xssss fw-600 text-grey-500 card-body p-0 d-flex align-items-center"><i class="btn-round-sm font-xs text-primary feather-edit-3 me-2 bg-greylight"></i>Share Your Thoughts</a>
    </div>
    <div class="card-body p-0 mt-3 position-relative">
      <figure class="avatar position-absolute ms-2 mt-1 top-5"><img src="/tpl1/images/user-8.png" alt="image" class="shadow-sm rounded-circle w30"></figure>
      <textarea v-model="fd.description" class="h100 bor-0 w-100 rounded-xxl p-2 ps-5 font-xssss text-grey-500 fw-500 border-light-md theme-dark-bg" cols="30" rows="10" placeholder="What's on your mind?"></textarea>
    </div>
    <div class="card-body d-flex p-0 mt-0">
      <a @click="vidPicker()" class="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"><i class="font-md text-danger feather-video me-2"></i><span class="d-none-xs">Video</span></a>
      <input class="sel_video d-none" @change="fd.video=$event.target.files[0];setVideo()"  accept="video/*" type='file'/>
      <!--                <a href="#" class="d-flex align-items-center font-xssss fw-600 ls-1 text-grey-700 text-dark pe-4"><i class="font-md text-warning feather-camera me-2"></i><span class="d-none-xs">Feeling/Activity</span></a>-->
      <!--                <a @click="submit()" class="ms-auto"><i class="fa-solid fa-check text-grey-900 btn-round-md btn-success font-xss"></i></a>-->
      <a href="#" class="ms-auto" id="dropdownMenu4" data-bs-toggle="dropdown" aria-expanded="false"><i class="ti-more-alt text-grey-900 btn-round-md bg-greylight font-xss"></i></a>
      <div class="dropdown-menu dropdown-menu-start p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu4">
        <div class="card-body p-0 d-flex">
          <i class="feather-bookmark text-grey-500 me-3 font-lg"></i>
          <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Save Link <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Add this to your saved items</span></h4>
        </div>
        <div class="card-body p-0 d-flex mt-2">
          <i class="feather-alert-circle text-grey-500 me-3 font-lg"></i>
          <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Hide Post <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
        </div>
        <div class="card-body p-0 d-flex mt-2">
          <i class="feather-alert-octagon text-grey-500 me-3 font-lg"></i>
          <h4 class="fw-600 text-grey-900 font-xssss mt-0 me-4">Hide all from Group <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
        </div>
        <div class="card-body p-0 d-flex mt-2">
          <i class="feather-lock text-grey-500 me-3 font-lg"></i>
          <h4 class="fw-600 mb-0 text-grey-900 font-xssss mt-0 me-4">Unfollow Group <span class="d-block font-xsssss fw-500 mt-1 lh-3 text-grey-500">Save to your saved items</span></h4>
        </div>
      </div>
    </div>
    <div class="card-body p-0 mt-3" >
      <div class="text-right">
        <button @click="confirmPopup()" :disabled="loadingCreateResp" type="button" class="btn btn-primary rounded-pill text-white">
          <span v-if="!loadingCreateResp" >Post</span>
          <i v-if="loadingCreateResp" class="fas fa-spinner fa-spin"></i>
        </button>
        <div class="row">
          <div class="col-3 mb-3" v-if="target_image">
            <img :src="target_image" class="img-thumbnail"  alt="">
          </div>
          <div class="col-4 mb-3" v-if="target_video">
            <div class="ratio ratio-16x9">
              <video class="embed-responsive-item rounded" :src="target_video" controls></video>
            </div>
          </div>
        </div>
      </div>
      <ui-panel class="mt-3" ref="divResp" :type="createResp?.status?'success':'warning'" :content="createResp?.message" @show="createResp=$event" v-if="createResp"></ui-panel>

    </div>
  </div>

</template>

<style scoped></style>
