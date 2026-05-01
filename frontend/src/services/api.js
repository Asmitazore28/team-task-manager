import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://team-task-manager-backend-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
  getMe: () => api.get("/auth/me"),
};

export const projectAPI = {
  getAll: () => api.get("/projects"),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (id, userId) => api.post(`/projects/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members`, { data: { userId } }),
};

export const taskAPI = {
  getAll: (params) => api.get("/tasks", { params }),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  assign: (id, assignedTo) => api.put(`/tasks/${id}/assign`, { assignedTo }),
  delete: (id) => api.delete(`/tasks/${id}`),
  getDashboard: () => api.get("/tasks/dashboard"),
  getUsers: () => api.get("/tasks/users"),
};

export default api;
