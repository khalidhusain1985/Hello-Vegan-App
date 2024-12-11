<template>
  <div>
    <textarea ref="editor" :value="modelValue"></textarea>
  </div>
</template>

<script setup>
import {ref, watch, onMounted, onBeforeUnmount} from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const editor = ref(null);

onMounted(() => {
  if (editor.value) {
    // Initialize CKEditor
    const editorInstance = CKEDITOR.replace(editor.value, {versionCheck: false});

    // Set the initial data
    editorInstance.setData(props.modelValue);

    // Handle editor data changes
    editorInstance.on('change', () => {
      const data = editorInstance.getData();
      emit('update:modelValue', data);
    });

    // Cleanup on unmount
    onBeforeUnmount(() => {
      if (editorInstance) {
        editorInstance.destroy();
      }
    });

    // Watch for modelValue changes
    watch(
        () => props.modelValue,
        (newValue) => {
          if (editorInstance && editorInstance.getData() !== newValue) {
            editorInstance.setData(newValue);
          }
        }
    );
  }
});
</script>

<style scoped>
/* Add any custom styles for your CKEditor component here */
</style>
