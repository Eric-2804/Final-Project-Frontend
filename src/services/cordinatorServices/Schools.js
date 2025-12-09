import api from "../api.js";

export async function getColegios() {
  const res = await api.get("/school"); // sin /api extra
  return res.data;
}