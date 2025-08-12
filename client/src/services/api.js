import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  getFeatured: () => api.get('/projects?featured=true&limit=3'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  uploadImage: (id, formData) => api.post(`/projects/${id}/upload-image`, formData),
  deleteImage: (id, imageId) => api.delete(`/projects/${id}/images/${imageId}`),
};

// Volunteers API
export const volunteersAPI = {
  signup: (data) => api.post('/volunteers/signup', data),
  confirmEmail: (token) => api.post('/volunteers/confirm-email', { token }),
  getAll: (params) => api.get('/volunteers', { params }),
  getById: (id) => api.get(`/volunteers/${id}`),
  updateStatus: (id, status) => api.put(`/volunteers/${id}/status`, status),
  getStats: () => api.get('/volunteers/stats/overview'),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (id, volunteerId) => api.post(`/events/${id}/register`, { volunteerId }),
};

// News API
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getBySlug: (slug) => api.get(`/news/${slug}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
  updateStatus: (id, status) => api.put(`/news/${id}/status`, { status }),
};

// Donations API
export const donationsAPI = {
  createStripeIntent: (data) => api.post('/donations/create-payment-intent', data),
  createRazorpayOrder: (data) => api.post('/donations/create-razorpay-order', data),
  confirmStripe: (data) => api.post('/donations/confirm-stripe', data),
  confirmRazorpay: (data) => api.post('/donations/confirm-razorpay', data),
  getAll: (params) => api.get('/donations', { params }),
  getStats: () => api.get('/donations/stats'),
};

// Contact API
export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
  getInfo: () => api.get('/contact/info'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getPendingVolunteers: (params) => api.get('/admin/volunteers/pending', { params }),
  getRecentDonations: (params) => api.get('/admin/donations/recent', { params }),
  getUpcomingEvents: () => api.get('/admin/events/upcoming'),
  getActiveProjects: () => api.get('/admin/projects/active'),
  approveVolunteer: (id) => api.post(`/admin/volunteers/${id}/approve`),
  rejectVolunteer: (id, reason) => api.post(`/admin/volunteers/${id}/reject`, { reason }),
  getDonationReports: (params) => api.get('/admin/reports/donations', { params }),
  getVolunteerReports: (params) => api.get('/admin/reports/volunteers', { params }),
};

// Helper functions for specific use cases
export const getFeaturedProjects = async () => {
  try {
    const response = await projectsAPI.getFeatured();
    return response.data.projects;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
};

export const getProjectById = async (id) => {
  try {
    const response = await projectsAPI.getById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const getNewsBySlug = async (slug) => {
  try {
    const response = await newsAPI.getBySlug(slug);
    return response.data;
  } catch (error) {
    console.error('Error fetching news article:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await eventsAPI.getById(id);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default api;
