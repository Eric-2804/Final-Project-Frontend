<template> 
  <q-spinner 
    :color="color" 
    :size="size" 
    :thickness="thickness" 
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
  thickness: { 
    type: Number, 
    default: 2, 
  }, 
}); 
</script>