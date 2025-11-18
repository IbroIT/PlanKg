import api from './axios';

// Get all favorites
export const getFavorites = async (lang = 'ru') => {
  const response = await api.get('/favorites/', { params: { lang } });
  return response.data;
};

// Toggle favorite (add or remove)
export const toggleFavorite = async (serviceId) => {
  const response = await api.post(`/favorites/toggle/${serviceId}/`);
  return response.data;
};
