const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const usuariosRoutes = require('./routes/usuarios');
app.use('/', usuariosRoutes);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/Login')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
