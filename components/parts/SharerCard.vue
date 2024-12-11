<script setup lang="ts">
import {pitLib} from "../../helpers/pitLib";
import {useClipboard} from "@vueuse/core";
import {watch} from "vue";

const props = defineProps(['url','title'])
const { copy } = useClipboard()
</script>

<template>
  <a href="#" id="dropdownMenu21" data-bs-toggle="dropdown" aria-expanded="false" class="ms-auto d-flex align-items-center fw-600 text-grey-900 text-dark lh-26 font-xssss"><i class="feather-share-2 text-grey-900 text-dark btn-round-sm font-lg"></i><span class="d-none-xs">Share</span></a>
  <div class="dropdown-menu dropdown-menu-end p-4 rounded-xxl border-0 shadow-lg" aria-labelledby="dropdownMenu21">
    <h4 class="fw-700 font-xss text-grey-900 d-flex align-items-center">Share <i class="feather-x ms-auto font-xssss btn-round-xs bg-greylight text-grey-900 me-2"></i></h4>
    <div class="card-body p-0 d-flex">
      <ul class="d-flex align-items-center justify-content-between mt-2">
        <li class="me-1"><a :href="'https://www.facebook.com/sharer/sharer.php?u='+props.url" class="btn-round-lg bg-facebook"><i class="font-xs ti-facebook text-white"></i></a></li>
        <li class="me-1"><a :href="'http://twitter.com/share?text='+props?.title+'&url='+props.url+'&hashtags=hellovegan'" class="btn-round-lg bg-twiiter"><i class="font-xs ti-twitter-alt text-white"></i></a></li>
        <li class="me-1"><a :href="'https://wa.me/?text='+props.url" class="btn-round-lg bg-whatsup"><i class="fa-brands fa-whatsapp fa-lg text-white"></i></a></li>
         <li class="me-1"><a :href="'http://pinterest.com/pin/create/button/?url='+props.url" class="btn-round-lg bg-pinterest"><i class="font-xs ti-pinterest text-white"></i></a></li>
         <li class="me-1"><a :href="'https://t.me/share/url?url='+props.url+'&text='+props?.title" class="btn-round-lg bg-primary"><i class="fa-brands fa-telegram fa-lg text-white"></i></a></li>
      </ul>
    </div>
    <h4 @click="copy(pitLib.util.url(props.url))" class="fw-700 font-xssss mt-4 text-grey-500 d-flex align-items-center mb-3">Copy Link</h4>
    <i @click="copy(pitLib.util.url(props.url))" class="feather-copy position-absolute right-35 mt-3 font-xs text-grey-500"></i>
    <input @click="copy(pitLib.util.url(props.url))" type="text" :value="pitLib.util.url(props.url)" class="bg-grey text-grey-500 font-xssss border-0 lh-32 p-2 font-xssss fw-600 rounded-3 w-100 theme-dark-bg">
  </div>
</template>

<style scoped></style>
