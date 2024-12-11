<script setup lang="ts">
import {store} from "../store/DataLake";
import {ref} from "vue";
import {Vue3Lottie} from "vue3-lottie";

const u=store.state_user
const inSubscription=ref<boolean>()
const emit=defineEmits(['inSubscription'])
const props=defineProps(['quotacode'])

const sp=ref<any>()
sp.value=u?.subscriptionpurchases?.[0]
inSubscription.value = sp.value?.quota[props.quotacode]>sp.value?.usage[props.quotacode]
emit("inSubscription",inSubscription.value)
</script>

<template>
  <div v-if="!inSubscription" class="card border border-info rounded-lg shadow p-3 text-center mb-3">
    <h4 class="text-info mt-3">Time to be a Pro!</h4>
    <Vue3Lottie
        animationLink="/json/premium_1.json"
        :height="150"
        :width="150"
    />
    <h5 class="text-warning" v-if="sp"> <b>{{sp?.usage[props.quotacode]}}</b> post of <b>{{sp?.quota[props.quotacode]}}</b> used!</h5>
    <h5 class="text-muted">Get a suitable package to post more content!</h5>
    <div class="row">
      <div class="col">
        <router-link to="/subscription/purchase" class="btn btn-info rounded">Purchase <i class="fa fas fa-check ml-2"></i></router-link>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
