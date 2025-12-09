<template>
  <button
    :type="type"
    :class="['base-btn', color, size]"
    @click="handleClick"
    :disabled="loading"
  >
    <Spinner v-if="loading" size="1.5em" color="white" />
    <span v-else>
      <span v-if="icon" class="material-icons">{{ icon }}</span>
      {{ label }}
    </span>
  </button>
</template>

<script setup>
import Spinner from './Spinner.vue';

defineProps({
  color: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  icon: { type: String, default: null },
  label: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script> 

<style scoped> 
.base-btn { 
  border: none; 
  padding: 10px 20px; 
  border-radius: 8px; 
  font-weight: bold; 
  cursor: pointer; 
} 

.base-btn.primary { 
  background-color: #1976d2; 
  color: white; 
} 

.base-btn.md { 
  font-size: 16px; 
} 
</style>