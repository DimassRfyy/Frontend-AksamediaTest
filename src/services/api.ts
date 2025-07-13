import axios from 'axios';

const BASE_URL = import.meta.env.VITE_REACT_API_URL || 'https://aksatestbe.winnipos.web.id/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const isAxiosError = axios.isAxiosError;

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = (username: string, password: string) =>
  apiClient.post('/login', { username, password });

export const logout = () =>
  apiClient.post('/logout');

export const getDivisions = (params?: any) =>
  apiClient.get('/divisions', { params });

export const getEmployees = (params?: any) =>
  apiClient.get('/employees', { params });

export const createEmployee = (data: any) =>
  apiClient.post('/employees', data);

export const updateEmployee = (id: string | number, data: any) =>
  apiClient.put(`/employees/${id}`, data);

export const deleteEmployee = (id: string | number) =>
  apiClient.delete(`/employees/${id}`);

export default apiClient; 