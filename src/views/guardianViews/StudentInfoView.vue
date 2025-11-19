<script setup>
import { reactive } from 'vue'

/* Datos temporales (quemados) para pruebas */
const user = reactive({
  firstName: 'Edward',
  lastName: 'Petrico',
  email: 'EdPetrico@gmail.com',
  role: 'Guardian',
  nucleus: 'Central Educational Nucleus'
})

/* Formulario reactivo */
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

/* Métodos */
function saveChanges() {
  console.log('Data sent:', form)
  // Aquí luego harás el fetch o axios.post al backend
}

function cancel() {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border-bottom: 1px solid #444;
}
</style>
