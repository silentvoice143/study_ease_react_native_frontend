// src/api/index.ts
import axios from 'axios';
import { store } from '../store'; // <-- Import your Redux store

const api = axios.create({
  baseURL: 'https://a8354ea6a6ae.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const fullUrl = `${config.baseURL || ''}${config.url}`;
    console.log('Request URL:', fullUrl);
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
