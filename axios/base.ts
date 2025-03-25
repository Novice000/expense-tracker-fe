import axios from "axios";

const BASEURL: string = "http://localhost:8000/api";

const base = axios.create({
  baseURL: BASEURL,
  timeout: 10 * 1000,
});

const baseAuth = axios.create({
  baseURL: BASEURL,
  timeout: 10 * 1000,
});

baseAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export {baseAuth, base}
