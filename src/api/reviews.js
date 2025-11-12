import api from './axios';

export const reviewsAPI = {
  getServiceReviews: async (serviceId) => {
    console.log('Fetching reviews for service:', serviceId);
    const response = await api.get(`/reviews/${serviceId}/`);
    console.log('Reviews response:', response.data);
    return response.data;
  },
  
  getMyReview: async (serviceId) => {
    try {
      const response = await api.get(`/reviews/my/${serviceId}/`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  
  createReview: async (data) => {
    const response = await api.post('/reviews/create/', data);
    return response.data;
  },
  
  updateReview: async (id, data) => {
    const response = await api.patch(`/reviews/${id}/update/`, data);
    return response.data;
  },
  
  deleteReview: async (id) => {
    await api.delete(`/reviews/${id}/delete/`);
  },
};
