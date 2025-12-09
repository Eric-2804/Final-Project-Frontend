<template>
  <div padding>
    <h1 class="q-ma-none q-mb-md">Comunicaciones</h1>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-5">
        <q-card>
          <q-card-section>
            <h2 class="text-h6 q-ma-none">Enviar Mensaje</h2>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="sendMessage">
              <q-select
                v-model="message.recipient"
                :options="recipientOptions"
                label="Destinatario"
                required
              />
              <q-input v-model="message.subject" label="Asunto" required />
              <q-editor v-model="message.body" class="q-mt-md" />
              <div class="actions-container q-mt-md">
                <Button
                  label="Enviar Mensaje"
                  type="submit"
                  color="primary"
                  size="md"
                  icon="send"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-7">
        <q-card>
          <q-card-section>
            <h2 class="text-h6 q-ma-none">Mensajes Enviados</h2>
          </q-card-section>
          <q-list bordered separator>
            <q-expansion-item
              v-for="sentMessage in sentMessages"
              :key="sentMessage.id"
              :label="sentMessage.subject"
              :caption="`Para: ${sentMessage.recipient} - ${sentMessage.date}`"
              icon="message"
            >
              <q-card>
                <q-card-section v-html="sentMessage.body" />
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useNotify } from '../../composables/useNotify.js';
import Button from '../../components/Button.vue';

export default {
  name: 'Communications',
  components: {
    Button,
  },
  setup() {
    const { showNotify } = useNotify();
    const message = ref({
      recipient: '',
      subject: '',
      body: '',
    });

    const recipientOptions = ['Coordinador', 'Grupo 101', 'Grupo 102'];
    const sentMessages = ref([
      {
        id: 1,
        recipient: 'Coordinador',
        subject: 'Consulta sobre horarios',
        body: 'Estimado coordinador, quisiera saber si hay cambios en los horarios de la próxima semana.',
        date: '2024-05-10',
      },
    ]);

    const sendMessage = () => {
      sentMessages.value.unshift({
        ...message.value,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
      });
      showNotify('Mensaje enviado exitosamente');
      message.value = { recipient: '', subject: '', body: '' };
    };

    return {
      message,
      recipientOptions,
      sentMessages,
      sendMessage,
    };
  },
};
</script>

<style scoped>
.actions-container {
  display: flex;
  justify-content: flex-end;
}

</style>