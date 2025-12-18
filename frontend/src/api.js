import axios from "axios";

const api = axios.create({
  baseURL: "https://skill-sync-bl6v.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
