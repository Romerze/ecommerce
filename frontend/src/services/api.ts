import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  registrar: (datos: any) => api.post('/auth/registrar', datos),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  obtenerPerfil: () => api.get('/auth/perfil')
};

// Productos
export const productosAPI = {
  obtenerTodos: (params?: any) => api.get('/productos', { params }),
  obtenerPorId: (id: string) => api.get(`/productos/${id}`),
  crear: (datos: any) => api.post('/productos', datos),
  actualizar: (id: string, datos: any) => api.put(`/productos/${id}`, datos),
  eliminar: (id: string) => api.delete(`/productos/${id}`)
};

// Pedidos
export const pedidosAPI = {
  crear: (datos: any) => api.post('/pedidos', datos),
  obtenerMisPedidos: () => api.get('/pedidos/mis-pedidos'),
  obtenerPorId: (id: string) => api.get(`/pedidos/${id}`),
  obtenerTodos: () => api.get('/pedidos/todos'),
  actualizarEstado: (id: string, estado: string) => api.put(`/pedidos/${id}/estado`, { estado })
};

export default api;
