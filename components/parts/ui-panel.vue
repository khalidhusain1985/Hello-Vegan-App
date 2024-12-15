<script setup lang="ts">
import {ref, watch} from "vue";

const props=defineProps(['show','content','type'])
const show=ref<boolean>(props.show??true)
const emits=defineEmits(['show'])
watch(props,()=>{
  show.value=true
})
</script>

<template>
  <div v-if="show" class="alert alert-dismissible fade show" :class="['alert','alert-dismissible','fade','show','alert-'+props.type]" role="alert">
    <div class="" v-html="props.content">
    </div>
    <button type="button" @click="show=!show;$emit(emits,show)" class="btn-close"  aria-label="Close"></button>
  </div>
</template>

<style scoped></style>
