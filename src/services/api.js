import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:3000",
=======
  baseURL: "http://localhost:3000/api", // tu backend
>>>>>>> a04662ec567adaca03374e615271a7ff09a6b9ba
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;