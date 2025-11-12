const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// ✅ REGISTRO DE USUARIO
router.post('/register', async (req, res) => {
  try {
    const data = req.body;

    // Validar si el correo ya existe
    const existing = await Usuario.findOne({ email: data.email });
    if (existing) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    const newUser = new Usuario(data);
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
  } catch (err) {
    console.error('❌ Error en /register:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (user.password !== password) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Login exitoso', user });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
