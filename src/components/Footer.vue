<template>
  <div class="bg-primary text-white custom-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Soporte -->
        <div class="footer-column">
          <h3 class="footer-title">Soporte</h3>
          <ul class="footer-list">
            <li>
              <q-icon name="admin_panel_settings" size="18px" />
              <span>Mensaje a un administrador</span>
            </li>
            <li>
              <q-icon name="bug_report" size="18px" />
              <span>Informa un problema</span>
            </li>
            <li>
              <q-icon name="help" size="18px" />
              <span>Ayuda</span>
            </li>
          </ul>
        </div>

        <!-- Sobre nosotros -->
        <div class="footer-column">
          <h3 class="footer-title">Sobre nosotros</h3>
          <ul class="footer-list">
            <li>
              <q-icon name="flag" size="18px" />
              <span>Misión</span>
            </li>
            <li>
              <q-icon name="visibility" size="18px" />
              <span>Visión</span>
            </li>
          </ul>
        </div>

        <!-- Nuestras redes -->
        <div class="footer-column">
          <h3 class="footer-title">Nuestras redes</h3>
          <ul class="footer-list">
            <li>
              <q-icon name="fab fa-twitter" size="18px" />
              <span>@ColeUnidos</span>
            </li>
            <li>
              <q-icon name="fab fa-facebook" size="18px" />
              <span>Colegio Unido (El Saber)</span>
            </li>
            <li>
              <q-icon name="fab fa-instagram" size="18px" />
              <span>@C.U_Saber</span>
            </li>
          </ul>
        </div>

        <!-- Más información -->
        <div class="footer-column">
          <h3 class="footer-title">Más información</h3>
          <ul class="footer-list">
            <li>
              <q-icon name="phone" size="18px" />
              <div class="info-text">
                <span class="info-main">3200203402</span>
                <span class="info-caption">Línea directa</span>
              </div>
            </li>
            <li>
              <q-icon name="location_on" size="18px" />
              <div class="info-text">
                <span class="info-main">Calle 3 # 23-32</span>
                <span class="info-caption">Ubicación</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        © 2025 Colegio Unido El Saber - Todos los derechos reservados
      </div>
    </div>
  </div>
  
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FooterComponent'
})
</script>

<style scoped>
.custom-footer {
  /* Se eliminan los estilos de ancho y margen que causaban problemas */
}

.footer-content {
  padding: 24px 32px; /* Padding unificado */
  max-width: 1400px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px; /* 🔹 menos separación entre columnas */
  margin-bottom: 12px; /* 🔹 menos espacio antes del borde inferior */
}
/* Ajuste para columnas y alineación */
.footer-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.footer-list li {
  font-size: 13px;
  line-height: 1.3;
}
.footer-title {
  font-size: 16px; /* 🔹 más compacto */
  margin-bottom: 10px;
}


.footer-list li:hover {
  opacity: 0.8;
}

.footer-list li .q-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-main {
  font-size: 14px;
  font-weight: 500;
}

.info-caption {
  font-size: 12px;
  opacity: 0.7;
}

.footer-bottom {
    text-align: center;
  padding-top: 12px; /* 🔹 menos espacio arriba del texto final */
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 12px;
  opacity: 0.85;
}
.footer-container {
  display: flex;
  justify-content: space-between; /* distribuye los elementos */
  align-items: center; /* centra verticalmente */
  flex-wrap: wrap; /* evita desbordes en pantallas pequeñas */
  background: linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%);
  color: white;
  padding: 10px 20px;
  font-size: 14px;
}

.footer-section {
  display: flex;
  align-items: center;
  gap: 10px; /* separa los íconos o textos */
}

.footer-section p {
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-content {
    padding: 24px 16px 16px;
  }
}
</style>