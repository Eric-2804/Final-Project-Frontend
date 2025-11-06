<template>
  <q-spinner
    :color= 'white'
    :size="size"
  />
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: '3em',
  },
});
</script>