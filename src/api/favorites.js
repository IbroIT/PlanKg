import api from './axios';

// Get all favorites
export const getFavorites = async () => {
  const response = await api.get('/favorites/');
  return response.data;
};

// Toggle favorite (add or remove)
export const toggleFavorite = async (serviceId) => {
  const response = await api.post(`/favorites/toggle/${serviceId}/`);
  return response.data;
};
