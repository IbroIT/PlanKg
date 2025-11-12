import api from './axios';

export const servicesAPI = {
  getCategories: async (lang = 'ru') => {
    const response = await api.get(`/categories/?lang=${lang}`);
    return response.data;
  },
  
  getServices: async (params = {}) => {
    const response = await api.get('/services/', { params });
    return response.data;
  },
  
  getServiceDetail: async (id, lang = 'ru') => {
    const response = await api.get(`/services/${id}/?lang=${lang}`);
    return response.data;
  },
  
  createService: async (data) => {
    const formData = new FormData();
    
    // Add translations as JSON string
    formData.append('translations', JSON.stringify(data.translations));
    formData.append('category_id', data.category_id);
    formData.append('price_type', data.price_type);
    formData.append('city', data.city);
    
    if (data.price) formData.append('price', data.price);
    if (data.district) formData.append('district', data.district);
    if (data.image1) formData.append('image1', data.image1);
    if (data.image2) formData.append('image2', data.image2);
    if (data.image3) formData.append('image3', data.image3);
    
    const response = await api.post('/services/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  updateService: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'translations') {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await api.patch(`/services/${id}/update/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  deleteService: async (id) => {
    await api.delete(`/services/${id}/delete/`);
  },
  
  getMyServices: async (lang = 'ru') => {
    const response = await api.get(`/services/my/?lang=${lang}`);
    return response.data;
  },
};
