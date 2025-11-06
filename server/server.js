const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000; 


const dbURI = 'mongodb://localhost:27017/Login'; 
mongoose.connect(dbURI)
  .then(() => console.log('Backend conectado a MongoDB.'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

app.use(express.json()); 
app.use(cors({ origin: 'http://localhost:5173' })); 

const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    year: { type: Number, required: true }
}, { collection: 'PruebaLogin' });

const User = mongoose.model('User', usuarioSchema);

app.post('/login', async (req, res) => {
    const { email, password, role, year } = req.body;

    try {
        const user = await User.findOne({
            email: email,
            password: password,
            role: role,
            year: parseInt(year) 
        });

        if (user) {
            return res.status(200).json({ message: 'Login exitoso', user: user });
        } else {
            return res.status(401).json({ message: 'Credenciales, rol o año no válidos.' });
        }

    } catch (error) {
        console.error('Error durante el login:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});