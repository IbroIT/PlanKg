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
    console.log('createService called with data:', data);
    console.log('Avatar in data:', data.avatar);
    const formData = new FormData();
    
    // Add translations as JSON string
    formData.append('translations', JSON.stringify(data.translations));
    formData.append('category_id', data.category_id);
    formData.append('price_type', data.price_type);
    formData.append('city', data.city);
    
    // Add optional fields
    const optionalFields = [
      'price', 'district', 'phone', 'email', 'website', 'instagram', 'facebook',
      'capacity', 'average_check', 'event_duration', 'additional_services',
      'experience_years', 'hourly_rate', 'gender', 'image1', 'image2', 'image3',
      'image4', 'image5', 'video1', 'video2', 'additional_fields', 'equipment_type',
      'rental_duration', 'rental_price', 'vehicle_type', 'vehicle_capacity',
      'driver_included', 'decoration_available', 'cuisine_type', 'service_type',
      'minimum_order', 'delivery_included', 'staff_included', 'service_duration',
      'home_visit', 'license_number', 'guard_count', 'character_type',
      'show_duration', 'props_included', 'lighting_type', 'sound_system',
      'stage_setup', 'shooting_hour_price', 'full_day_price', 'love_story_price',
      'portfolio_photos_count', 'delivery_time_days', 'shooting_style',
      'second_operator', 'drone_available', 'video_format', 'sound_recording',
      'montage_included', 'video_presentation', 'languages', 'dress_code',
      'time_limit', 'stage_available', 'sound_available', 'parking_available',
      'projector_available', 'decor_available', 'menu_available', 'working_hours',
      'music_genre', 'equipment_provided', 'repertoire', 'performance_type',
      'show_type', 'performance_video', 'stage_requirements', 'cake_weight_kg',
      'flavors_available', 'advance_order_days', 'staff_count', 'uniform_provided',
      'services_offered', 'wedding_decor_price', 'custom_calculation', 'avatar'
    ];
    
    optionalFields.forEach(field => {
      if (data[field] !== null && data[field] !== undefined && data[field] !== '') {
        console.log(`Appending ${field}:`, data[field]);
        formData.append(field, data[field]);
      }
    });
    
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
