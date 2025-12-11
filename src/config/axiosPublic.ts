import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const apiPublic = axios.create({
  baseURL: apiUrl,
  withCredentials: false,
});

export default apiPublic;
