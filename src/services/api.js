import axios from "axios";

const api = axios.create({
  baseURL: "https://proyecto-final-ptwh.onrender.com/", // tu backend
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;