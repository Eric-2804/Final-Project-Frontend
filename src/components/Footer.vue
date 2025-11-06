<template>
  <q-footer elevated style="background-color: #1E40AF; color: white;">
    <div class="q-py-xs q-px-md">
      <div class="row q-col-gutter-md wrap">
        <!-- Support Section -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-transparent text-white" flat>
            <q-card-section>
              <div class="text-h6">Soporte</div>
            </q-card-section>
            <q-list dense>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="admin_panel_settings" />
                </q-item-section>
                <q-item-section>Mensaje a un administrador</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="bug_report" />
                </q-item-section>
                <q-item-section>Informa un problema</q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon name="help" />
                </q-item-section>
                <q-item-section>Ayuda</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- About Us Section -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-transparent text-white" flat>
            <q-card-section>
              <div class="text-h6">Sobre nosotros</div>
            </q-card-section>
            <q-list dense>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="flag" />
                </q-item-section>
                <q-item-section>Misión</q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="visibility" />
                </q-item-section>
                <q-item-section>Visión</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- Social Media Section -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-transparent text-white" flat>
            <q-card-section>
              <div class="text-h6">Nuestras redes</div>
            </q-card-section>
            <q-list dense>
              <q-item clickable tag="a" href="https://twitter.com/ColeUnidos" target="_blank">
                <q-item-section avatar>
                  <q-icon name="fab fa-twitter" />
                </q-item-section>
                <q-item-section>@ColeUnidos</q-item-section>
              </q-item>
              <q-item clickable tag="a" href="https://facebook.com/ColegioUnidoElSaber" target="_blank">
                <q-item-section avatar>
                  <q-icon name="fab fa-facebook" />
                </q-item-section>
                <q-item-section>Colegio Unido (El Saber)</q-item-section>
              </q-item>
              <q-item clickable tag="a" href="https://instagram.com/C.U_Saber" target="_blank">
                <q-item-section avatar>
                  <q-icon name="fab fa-instagram" />
                </q-item-section>
                <q-item-section>@C.U_Saber</q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>

        <!-- More Info Section -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="bg-transparent text-white" flat>
            <q-card-section>
              <div class="text-h6">Más información</div>
            </q-card-section>
            <q-list dense>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="phone" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>3200203402</q-item-label>
                  <q-item-label caption class="text-grey-4">Línea directa</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="location_on" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Calle 3 # 23-32</q-item-label>
                  <q-item-label caption class="text-grey-4">Ubicación</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
      <div class="text-center">
   2025 Colegio Unido El Saber - Todos los derechos reservados
      </div>
    </div>
  </q-footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterComponent'
})
</script>