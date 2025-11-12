const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  role: String,
  firstName: String,
  lastName: String,
  documentType: String,
  documentNumber: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: String,
  address: String,
  birthDate: String,
  stratum: String,
  sisben: String,
  eps: String,
  bloodType: String,
  victimPopulation: String,
  ethnicity: String,
  disability: String
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
