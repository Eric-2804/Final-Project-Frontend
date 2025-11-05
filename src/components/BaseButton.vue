<template>
  <q-btn
  :color="color"
  :size="size"
  :label="label"
  :loading="loading"
  @click="$emit('click')"
  style="width: 100%;"
>
  <template #loading>
    <Spiner size="30px" color="white" />
  </template>
</q-btn>
</template>

<script setup>
import Spiner from "./Spiner.vue";

defineProps({
  color: { 
    type: String, 
    default: "primary" 
  },
  size: { 
    type: String,
     default: "md" 
    },
  label: { 
    type: String, 
    default: "" 
  },
  loading: { type: Boolean, 
    default: false },
});

defineEmits(["click"]);
</script>
