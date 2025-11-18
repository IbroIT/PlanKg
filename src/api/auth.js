import api from './axios';

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },
  
  updateProfile: async (data) => {
    let formDataToSend;
    
    // Если data уже является FormData, используем его напрямую
    if (data instanceof FormData) {
      formDataToSend = data;
    } else {
      // Иначе создаем новый FormData из объекта
      formDataToSend = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
          formDataToSend.append(key, data[key]);
        }
      });
    }
    
    const response = await api.patch('/users/me/', formDataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  getUserDetail: async (userId) => {
    const response = await api.get(`/users/${userId}/`);
    return response.data;
  },
};

export const setAuthTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};
