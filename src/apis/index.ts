// src/api/index.ts
import axios from 'axios';
import { store } from '../store'; // <-- Import your Redux store

const api = axios.create({
  baseURL: 'https://your-api-base-url.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

export default api;
