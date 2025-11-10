<template>
  <div>
    <q-btn
      v-if="showButton"
      :label="buttonLabel"
      color="primary"
      @click="openModal"
    />

    <q-dialog v-model="isOpen" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6 text-bold">
          {{ modalTitle }}
        </q-card-section>

        <q-separator />

        <q-card-section>
          <FormSede
            :initial-data="initialData"
            @saved="onSave"
            @cancel="closeModal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import FormSede from "./FormSede.vue";

const props = defineProps({
  buttonLabel: String,
  modalTitle: String,
  initialData: Object,
  showButton: { type: Boolean, default: true },
});

const emit = defineEmits(["saved"]);

const isOpen = ref(false);

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}

function onSave(data) {
  emit("saved", data);
  closeModal();
}

defineExpose({ openModal, closeModal });
</script>
