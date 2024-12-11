<template v-once>
  <textarea v-if="mode === 'textarea'" :value="value" v-on:change="handle()"/>
  <input v-else  v-on:change="handle($event)" :value="value">
</template>

<script>
import Tagify from "@yaireo/tagify"
import "@yaireo/tagify/dist/tagify.css"

export default {
  name: "Tags",
  emits:['value'],
  props: {
    mode: String,
    settings: Object,
    value: [String, Array],
  },
  watch: {
    value(newVal, oldVal) {
      console.log([newVal, oldVal])
      this.tagify.loadOriginalValues(newVal)
    },
  },
  mounted() {
    this.tagify = new Tagify(this.$el, this.settings)
  },
  methods:{
    handle:function ($event) {
      this.$emit('value', $event.target.value);
    }
  }
};

</script>