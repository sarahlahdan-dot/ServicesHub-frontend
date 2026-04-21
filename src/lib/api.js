import axios from 'axios';
import { getStoredToken } from './auth';

const baseURL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function unwrap(response) {
  return response.data;
}

export function extractApiError(error, fallbackMessage = 'Something went wrong.') {
  return (
    error.response?.data?.message ||
    error.response?.data?.err ||
    error.message ||
    fallbackMessage
  );
}

export const authApi = {
  register(payload) {
    return api.post('/auth/register', payload).then(unwrap);
  },
  login(payload) {
    return api.post('/auth/login', payload).then(unwrap);
  },
  verify() {
    return api.get('/auth/verify').then(unwrap);
  },
};

export const servicesApi = {
  list() {
    return api.get('/services').then(unwrap);
  },
  get(id) {
    return api.get(`/services/${id}`).then(unwrap);
  },
  create(payload) {
    return api.post('/services', payload).then(unwrap);
  },
  update(id, payload) {
    return api.put(`/services/${id}`, payload).then(unwrap);
  },
  remove(id) {
    return api.delete(`/services/${id}`).then(unwrap);
  },
};

export const bookingsApi = {
  create(payload) {
    return api.post('/bookings', payload).then(unwrap);
  },
  mine() {
    return api.get('/bookings/mine').then(unwrap);
  },
  updateStatus(id, status) {
    return api.patch(`/bookings/${id}/status`, { status }).then(unwrap);
  },
  getChat(id) {
    return api.get(`/bookings/${id}/chat`).then(unwrap);
  },
  sendChatMessage(id, message) {
    return api.post(`/bookings/${id}/chat`, { message }).then(unwrap);
  },
};

export const cartApi = {
  get() {
    return api.get('/cart').then(unwrap);
  },
  addItem(payload) {
    return api.post('/cart/items', payload).then(unwrap);
  },
  removeItem(serviceId) {
    return api.delete(`/cart/items/${serviceId}`).then(unwrap);
  },
  checkout() {
    return api.post('/cart/checkout').then(unwrap);
  },
};

export const reviewsApi = {
  byService(serviceId) {
    return api.get(`/reviews/service/${serviceId}`).then(unwrap);
  },
  create(bookingId, payload) {
    return api.post(`/reviews/${bookingId}`, payload).then(unwrap);
  },
};

export const messagesApi = {
  listForUser(userId) {
    return api.get(`/messages/user/${userId}`).then(unwrap);
  },
  sendToUser(userId, content) {
    return api.post(`/messages/user/${userId}`, { content }).then(unwrap);
  },
};