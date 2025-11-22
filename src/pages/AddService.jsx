import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';
import { servicesAPI } from '../api/services';

// Category-specific fields mapping (using slugs as keys)
const CATEGORY_FIELDS = {
  'category-1': [
    'shooting_hour_price', 'full_day_price', 'love_story_price', 'portfolio_photos_count',
    'shooting_style', 'delivery_time_days', 'experience_years', 'second_operator',
    'drone_available', 'video_format', 'sound_recording', 'montage_included'
  ],
  'category-2': [
    'shooting_hour_price', 'full_day_price', 'love_story_price', 'portfolio_photos_count',
    'shooting_style', 'delivery_time_days', 'experience_years', 'second_operator',
    'drone_available', 'video_format', 'sound_recording', 'montage_included'
  ],
  'category-3': [
    'video_presentation', 'languages', 'dress_code', 'experience_years',
    'time_limit'
  ],
  'category-4': [
    'capacity', 'stage_available', 'sound_available', 'parking_available',
    'projector_available', 'decor_available', 'menu_available', 'working_hours'
  ],
  'category-5': [
    'minimum_order', 'services_offered', 'wedding_decor_price',
    'custom_calculation'
  ],
  'category-6': [
    'cuisine_type', 'service_type', 'minimum_order', 'delivery_included',
    'staff_included'
  ],
  'category-7': [
    'performance_video', 'equipment_provided', 'repertoire', 'performance_type',
    'music_genre'
  ],
  'category-8': [
    'show_type', 'performance_video', 'stage_requirements', 'character_type',
    'show_duration', 'props_included', 'experience_years'
  ],
  'category-9': [
    'experience_years', 'services_offered'
  ],
  'category-10': [
    'vehicle_type', 'vehicle_capacity', 'driver_included', 'decoration_available'
  ],
  'category-11': [
    'service_duration', 'home_visit'
  ],
  'category-12': [
    'cake_weight_kg', 'flavors_available', 'advance_order_days'
  ],
  'category-13': [
    'equipment_type', 'rental_duration', 'rental_price'
  ],
  'category-14': [
    'staff_count', 'uniform_provided'
  ],
  'category-15': [
    'license_number', 'guard_count'
  ],
  'category-16': [
    'character_type', 'show_duration', 'props_included'
  ],
  'category-17': [
    'lighting_type', 'sound_system', 'stage_setup'
  ]
};

// Field labels and types
const FIELD_CONFIG = {
  // Common fields
  price: { label: 'service.price', type: 'number', suffix: 'currency' },
  price_type: { label: 'addService.priceType', type: 'select', options: ['fixed', 'negotiable'] },

  // Photo/Video fields
  shooting_hour_price: { label: 'addService.fields.shooting_hour_price', type: 'number', suffix: 'currency' },
  full_day_price: { label: 'addService.fields.full_day_price', type: 'number', suffix: 'currency' },
  love_story_price: { label: 'addService.fields.love_story_price', type: 'number', suffix: 'currency' },
  portfolio_photos_count: { label: 'addService.fields.portfolio_photos_count', type: 'number' },
  delivery_time_days: { label: 'addService.fields.delivery_time_days', type: 'number' },
  shooting_style: { label: 'addService.fields.shooting_style', type: 'text' },
  second_operator: { label: 'addService.fields.second_operator', type: 'boolean' },
  drone_available: { label: 'addService.fields.drone_available', type: 'boolean' },
  video_format: { label: 'addService.fields.video_format', type: 'select', options: ['hd', '4k', 'full_hd'] },
  sound_recording: { label: 'addService.fields.sound_recording', type: 'boolean' },
  montage_included: { label: 'addService.fields.montage_included', type: 'boolean' },
  video_presentation: { label: 'addService.fields.video_presentation', type: 'url' },

  // Host/MC fields
  languages: { label: 'addService.fields.languages', type: 'text' },
  dress_code: { label: 'addService.fields.dress_code', type: 'text' },
  time_limit: { label: 'addService.fields.time_limit', type: 'text' },

  // Venue fields
  capacity: { label: 'addService.fields.capacity', type: 'number' },
  stage_available: { label: 'addService.fields.stage_available', type: 'boolean' },
  sound_available: { label: 'addService.fields.sound_available', type: 'boolean' },
  parking_available: { label: 'addService.fields.parking_available', type: 'boolean' },
  projector_available: { label: 'addService.fields.projector_available', type: 'boolean' },
  decor_available: { label: 'addService.fields.decor_available', type: 'boolean' },
  menu_available: { label: 'addService.fields.menu_available', type: 'boolean' },
  working_hours: { label: 'addService.fields.working_hours', type: 'text' },

  // Florist/Decorator fields
  services_offered: { label: 'addService.fields.services_offered', type: 'textarea' },
  wedding_decor_price: { label: 'addService.fields.wedding_decor_price', type: 'number', suffix: 'currency' },
  custom_calculation: { label: 'addService.fields.custom_calculation', type: 'boolean' },

  // Catering fields
  cuisine_type: { label: 'addService.fields.cuisine_type', type: 'text' },
  service_type: { label: 'addService.fields.service_type', type: 'select', options: ['buffet', 'banquet', 'individual'] },
  minimum_order: { label: 'addService.fields.minimum_order', type: 'number' },
  delivery_included: { label: 'addService.fields.delivery_included', type: 'boolean' },
  staff_included: { label: 'addService.fields.staff_included', type: 'boolean' },

  // Music fields
  music_genre: { label: 'addService.fields.music_genre', type: 'text' },
  equipment_provided: { label: 'addService.fields.equipment_provided', type: 'boolean' },
  repertoire: { label: 'addService.fields.repertoire', type: 'textarea' },
  performance_type: { label: 'addService.fields.performance_type', type: 'select', options: ['live', 'dj', 'backing_track'] },

  // Artist/Show fields
  show_type: { label: 'addService.fields.show_type', type: 'text' },
  performance_video: { label: 'addService.fields.performance_video', type: 'url' },
  stage_requirements: { label: 'addService.fields.stage_requirements', type: 'textarea' },
  character_type: { label: 'addService.fields.character_type', type: 'text' },
  show_duration: { label: 'addService.fields.show_duration', type: 'number' },
  props_included: { label: 'addService.fields.props_included', type: 'boolean' },

  // Organizer fields
  experience_years: { label: 'addService.fields.experience_years', type: 'number' },

  // Transport fields
  vehicle_type: { label: 'addService.fields.vehicle_type', type: 'text' },
  vehicle_capacity: { label: 'addService.fields.vehicle_capacity', type: 'number' },
  driver_included: { label: 'addService.fields.driver_included', type: 'boolean' },
  decoration_available: { label: 'addService.fields.decoration_available', type: 'boolean' },

  // Beauty fields
  service_duration: { label: 'addService.fields.service_duration', type: 'number' },
  home_visit: { label: 'addService.fields.home_visit', type: 'boolean' },

  // Bakery fields
  cake_weight_kg: { label: 'addService.fields.cake_weight_kg', type: 'number' },
  flavors_available: { label: 'addService.fields.flavors_available', type: 'textarea' },
  advance_order_days: { label: 'addService.fields.advance_order_days', type: 'number' },

  // Equipment rental fields
  equipment_type: { label: 'addService.fields.equipment_type', type: 'text' },
  rental_duration: { label: 'addService.fields.rental_duration', type: 'text' },
  rental_price: { label: 'addService.fields.rental_price', type: 'number', suffix: 'currency' },

  // Staff fields
  staff_count: { label: 'addService.fields.staff_count', type: 'number' },
  uniform_provided: { label: 'addService.fields.uniform_provided', type: 'boolean' },

  // Security fields
  license_number: { label: 'addService.fields.license_number', type: 'text' },
  guard_count: { label: 'addService.fields.guard_count', type: 'number' },

  // Technical fields
  lighting_type: { label: 'addService.fields.lighting_type', type: 'text' },
  sound_system: { label: 'addService.fields.sound_system', type: 'text' },
  stage_setup: { label: 'addService.fields.stage_setup', type: 'boolean' }
};

export default function AddService() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState('ru');
  const [user, setUser] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [formData, setFormData] = useState({
    translations: {
      ru: { 
        title: '', 
        description: '',
      },
      en: { 
        title: '', 
        description: '',
      },
      kg: { 
        title: '', 
        description: '',
      },
    },
    category_id: '',
    avatar: null,
    price: '',
    price_type: 'fixed',
    city: '',
    phone: '',
    email: '',
    instagram: '',
    whatsapp: '',
    telegram: '',
    two_gis_link: '',
    capacity: '',
    average_check: '',
    event_duration: '',
    additional_services: '',
    experience_years: '',
    hourly_rate: '',
    gender: 'any',
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    video1: null,
    video2: null,
    // Category-specific fields
    shooting_hour_price: '',
    full_day_price: '',
    love_story_price: '',
    portfolio_photos_count: '',
    delivery_time_days: '',
    shooting_style: '',
    second_operator: false,
    drone_available: false,
    video_format: 'hd',
    sound_recording: false,
    montage_included: false,
    video_presentation: '',
    languages: '',
    dress_code: '',
    time_limit: '',
    stage_available: false,
    sound_available: false,
    parking_available: false,
    projector_available: false,
    decor_available: false,
    menu_available: false,
    working_hours: '',
    services_offered: '',
    wedding_decor_price: '',
    custom_calculation: false,
    cuisine_type: '',
    service_type: 'buffet',
    minimum_order: '',
    delivery_included: false,
    staff_included: false,
    music_genre: '',
    equipment_provided: false,
    repertoire: '',
    performance_type: 'live',
    show_type: '',
    performance_video: '',
    stage_requirements: '',
    character_type: '',
    show_duration: '',
    props_included: false,
    vehicle_type: '',
    vehicle_capacity: '',
    driver_included: false,
    decoration_available: false,
    service_duration: '',
    home_visit: false,
    cake_weight_kg: '',
    flavors_available: '',
    advance_order_days: '',
    equipment_type: '',
    rental_duration: '',
    rental_price: '',
    staff_count: '',
    uniform_provided: false,
    license_number: '',
    guard_count: '',
    lighting_type: '',
    sound_system: '',
    stage_setup: false
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchCategories();
    fetchUserData();
  }, [i18n.language]);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          city: userData.city || '',
          phone: userData.phone || '',
          email: userData.email || '',
          instagram: userData.instagram || '',
          whatsapp: userData.whatsapp || '',
          telegram: userData.telegram || '',
          two_gis_link: userData.two_gis_link || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await servicesAPI.getCategories(i18n.language);
      const allData = Array.isArray(data) ? data : (data.results || []);
      // Show all categories, not just subcategories
      setCategories(allData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleTranslationChange = (lang, field, value) => {
    setFormData({
      ...formData,
      translations: {
        ...formData.translations,
        [lang]: {
          ...formData.translations[lang],
          [field]: value,
        },
      },
    });
  };

  const getCategoryFields = () => {
    if (!formData.category_id || !categories.length) return [];
    
    const selectedCategory = categories.find(cat => cat.id.toString() === formData.category_id.toString());
    if (!selectedCategory) return [];
    
    let fields = CATEGORY_FIELDS[selectedCategory.slug] || [];
    
    // If price type is negotiable, filter out price-related fields
    if (formData.price_type === 'negotiable') {
      fields = fields.filter(field => {
        // Filter out fields that contain 'price' in their name (but not 'price_type')
        return !field.includes('price') || field === 'price_type';
      });
    }
    
    return fields;
  };

  const handleInputChange = (field, value) => {
    // Check if this is a translatable text field
    const translatableFields = ['additional_services', 'languages', 'dress_code', 'working_hours', 
                               'services_offered', 'cuisine_type', 'music_genre', 'repertoire', 
                               'show_type', 'stage_requirements', 'character_type', 'vehicle_type', 
                               'equipment_type', 'rental_duration', 'license_number'];
    const isTranslatableText = translatableFields.includes(field);
    
    if (isTranslatableText) {
      setFormData({
        ...formData,
        translations: {
          ...formData.translations,
          [currentLang]: {
            ...formData.translations[currentLang],
            [field]: value,
          },
        },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const renderField = (fieldName) => {
    const config = FIELD_CONFIG[fieldName];
    if (!config) return null;

    // For translatable text fields, use translations
    const translatableFields = ['additional_services', 'languages', 'dress_code', 'working_hours', 
                               'services_offered', 'cuisine_type', 'music_genre', 'repertoire', 
                               'show_type', 'stage_requirements', 'character_type', 'vehicle_type', 
                               'equipment_type', 'rental_duration', 'license_number'];
    const isTranslatableText = (config.type === 'text' || config.type === 'textarea') && 
      translatableFields.includes(fieldName);
    
    const value = isTranslatableText ? 
      (formData.translations[currentLang]?.[fieldName] || '') : 
      formData[fieldName];
    
    const fieldId = `field-${fieldName}`;

    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
          {t(config.label)}
        </label>
        
        {config.type === 'boolean' ? (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleInputChange(fieldName, e.target.checked)}
              className="w-5 h-5 text-[#F4B942] bg-[#E9EEF4] border-gray-300 rounded focus:ring-[#F4B942] focus:ring-2"
            />
            <span className="text-gray-600">{value ? t('common.yes') : t('common.no')}</span>
          </label>
        ) : config.type === 'select' ? (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
          >
            <option value="">{t('common.select')}</option>
            {config.options.map(option => (
              <option key={option} value={option}>
                {option === 'hd' ? 'HD' : 
                 option === '4k' ? '4K' : 
                 option === 'full_hd' ? 'Full HD' :
                 option === 'buffet' ? t('addService.fields.options.buffet') :
                 option === 'banquet' ? t('addService.fields.options.banquet') :
                 option === 'individual' ? t('addService.fields.options.individual') :
                 option === 'live' ? t('addService.fields.options.live') :
                 option === 'dj' ? t('addService.fields.options.dj') :
                 option === 'backing_track' ? t('addService.fields.options.backing_track') :
                 option}
              </option>
            ))}
          </select>
        ) : config.type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            rows="3"
            className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 resize-none"
            placeholder={`${t('common.enter')} ${t(config.label).toLowerCase()}`}
          />
        ) : config.type === 'url' ? (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
            placeholder="https://example.com"
          />
        ) : (
          <div className="relative">
            <input
              type={config.type}
              value={value || ''}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className={`w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 ${
                config.suffix ? 'pr-16' : ''
              }`}
              placeholder={`${t('common.enter')} ${t(config.label).toLowerCase()}`}
            />
            {config.suffix && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <span className="font-semibold">
                  {config.suffix === 'currency' ? t('service.currency', 'сом') : config.suffix}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least Russian is filled
    if (!formData.translations.ru.title.trim() || !formData.translations.ru.description.trim()) {
      alert('Пожалуйста, заполните название и описание услуги на русском языке.');
      setCurrentLang('ru');
      return;
    }
    
    // Check if Russian is filled and current language is Russian - show modal
    if (currentLang === 'ru' && formData.translations.ru.title.trim() && formData.translations.ru.description.trim()) {
      setShowLanguageModal(true);
      return;
    }
    
    // If user chose to fill other languages, validate they are filled
    if (currentLang === 'en' && (!formData.translations.en.title.trim() || !formData.translations.en.description.trim())) {
      alert('Пожалуйста, заполните название и описание услуги на английском языке.');
      return;
    }
    if (currentLang === 'kg' && (!formData.translations.kg.title.trim() || !formData.translations.kg.description.trim())) {
      alert('Пожалуйста, заполните название и описание услуги на кыргызском языке.');
      return;
    }
    
    // If user didn't go through modal (direct submit), copy Russian to other languages
    setFormData(prev => {
      const updatedTranslations = { ...prev.translations };
      
      // Ensure all languages have translations object
      if (!updatedTranslations.en) updatedTranslations.en = {};
      if (!updatedTranslations.kg) updatedTranslations.kg = {};
      
      // Copy missing title and description from Russian
      if (!updatedTranslations.en.title?.trim()) {
        updatedTranslations.en.title = updatedTranslations.ru.title || '';
      }
      if (!updatedTranslations.en.description?.trim()) {
        updatedTranslations.en.description = updatedTranslations.ru.description || '';
      }
      if (!updatedTranslations.kg.title?.trim()) {
        updatedTranslations.kg.title = updatedTranslations.ru.title || '';
      }
      if (!updatedTranslations.kg.description?.trim()) {
        updatedTranslations.kg.description = updatedTranslations.ru.description || '';
      }
      
      return {
        ...prev,
        translations: updatedTranslations
      };
    });
    
    await submitService();
  };

  const submitService = async () => {
    setLoading(true);

    const submitData = {
      translations: formData.translations,
      category_id: formData.category_id,
      price_type: formData.price_type,
      city: formData.city,
      price: formData.price,
      phone: formData.phone,
      email: formData.email,
      instagram: formData.instagram,
      whatsapp: formData.whatsapp,
      telegram: formData.telegram,
      two_gis_link: formData.two_gis_link,
      avatar: formData.avatar,
      image1: formData.image1,
      image2: formData.image2,
      image3: formData.image3,
      image4: formData.image4,
      image5: formData.image5,
      video1: formData.video1,
      video2: formData.video2,
    };

    console.log('Submitting formData:', submitData);
    console.log('Avatar in formData:', formData.avatar);

    try {
      await servicesAPI.createService(submitData);
      navigate('/service-submitted');
    } catch (error) {
      console.error('Error creating service:', error);
      alert(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = () => {
    // Copy Russian to other languages if not filled
    setFormData(prev => {
      const updatedTranslations = { ...prev.translations };
      
      // Ensure all languages have translations object
      if (!updatedTranslations.en) updatedTranslations.en = {};
      if (!updatedTranslations.kg) updatedTranslations.kg = {};
      
      // Copy missing title and description from Russian
      if (!updatedTranslations.en.title?.trim()) {
        updatedTranslations.en.title = updatedTranslations.ru.title || '';
      }
      if (!updatedTranslations.en.description?.trim()) {
        updatedTranslations.en.description = updatedTranslations.ru.description || '';
      }
      if (!updatedTranslations.kg.title?.trim()) {
        updatedTranslations.kg.title = updatedTranslations.ru.title || '';
      }
      if (!updatedTranslations.kg.description?.trim()) {
        updatedTranslations.kg.description = updatedTranslations.ru.description || '';
      }
      
      return {
        ...prev,
        translations: updatedTranslations
      };
    });
    setShowLanguageModal(false);
    // Need to wait for state update, so use setTimeout
    setTimeout(() => submitService(), 0);
  };

  const handleFillLanguages = () => {
    setShowLanguageModal(false);
    // Switch to English tab
    setCurrentLang('en');
  };

  const languageNames = {
    ru: 'Русский',
    en: 'English',
    kg: 'Кыргызча'
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (30 MB limit)
      const maxSize = 30 * 1024 * 1024; // 30 MB in bytes
      if (file.size > maxSize) {
        alert(t('service.fileSizeError', 'Размер файла не должен превышать 30 МБ'));
        e.target.value = ''; // Clear the input
        return;
      }

      setFormData({ ...formData, [field]: file });
      
      // Preview image/video
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewElement = document.getElementById(`${field}-preview`);
        if (previewElement) {
          if (field.startsWith('video')) {
            previewElement.innerHTML = `
              <video src="${e.target.result}" class="w-full h-32 object-cover rounded-xl" controls></video>
            `;
          } else {
            previewElement.innerHTML = `
              <img src="${e.target.result}" alt="Preview" class="w-full h-32 object-cover rounded-xl" />
            `;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-3 md:py-8">
      <div className="container mx-auto px-2 md:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-3 md:p-8 mb-6 md:mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t('addService.title')}</h1>
                <p className="text-gray-300 text-xs md:text-lg">
                  {t('addService.subtitle', 'Добавьте новую услугу и начните получать заказы')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-3 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-2 md:mb-3">
                  {t('addService.category')} *
                </label>
                <div className="relative">
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] appearance-none text-sm md:text-base"
                    required
                  >
                    <option value="">{t('addService.selectCategory')}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-2 md:mb-3">
                  {t('addService.selectCity')} *
                </label>
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] appearance-none text-sm md:text-base"
                    required
                  >
                    <option value="">{t('addService.selectCity')}</option>
                    {[
                      { key: 'bishkek', label: t('cities.bishkek') },
                      { key: 'osh', label: t('cities.osh') },
                      { key: 'tokmok', label: t('cities.tokmok') },
                      { key: 'kant', label: t('cities.kant') },
                      { key: 'karaBalta', label: t('cities.karaBalta') },
                      { key: 'shopokov', label: t('cities.shopokov') },
                      { key: 'kaindy', label: t('cities.kaindy') },
                      { key: 'karaSuu', label: t('cities.karaSuu') },
                      { key: 'nookat', label: t('cities.nookat') },
                      { key: 'uzgen', label: t('cities.uzgen') },
                      { key: 'manas', label: t('cities.manas') },
                      { key: 'karaKul', label: t('cities.karaKul') },
                      { key: 'mailuuSuu', label: t('cities.mailuuSuu') },
                      { key: 'tashKumyr', label: t('cities.tashKumyr') },
                      { key: 'kerben', label: t('cities.kerben') },
                      { key: 'karakol', label: t('cities.karakol') },
                      { key: 'balykchy', label: t('cities.balykchy') },
                      { key: 'cholponAta', label: t('cities.cholponAta') },
                      { key: 'naryn', label: t('cities.naryn') },
                      { key: 'kochkor', label: t('cities.kochkor') },
                      { key: 'atBashi', label: t('cities.atBashi') },
                      { key: 'talas', label: t('cities.talas') },
                      { key: 'kyzylAdyr', label: t('cities.kyzylAdyr') },
                      { key: 'batken', label: t('cities.batken') },
                      { key: 'kyzylKiya', label: t('cities.kyzylKiya') },
                      { key: 'sulukta', label: t('cities.sulukta') }
                    ].map((city) => (
                      <option key={city.key} value={city.key}>{city.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-[#1E2A3A] mb-3 md:mb-4">
                  {t('addService.serviceInfo')}
                </h3>
                
                <div className="flex flex-wrap gap-1 md:gap-2 bg-[#E9EEF4] p-1 rounded-xl mb-4 md:mb-6">
                  {['ru', 'en', 'kg'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setCurrentLang(lang)}
                      className={`flex-1 min-w-0 px-2 md:px-4 py-2 md:py-3 rounded-lg font-semibold transition-all text-xs md:text-sm ${
                        currentLang === lang 
                          ? 'bg-[#F4B942] text-[#1E2A3A] shadow-md' 
                          : 'text-gray-600 hover:text-[#1E2A3A]'
                      }`}
                    >
                      {languageNames[lang]} {lang === 'ru' ? '*' : ''}
                    </button>
                  ))}
                </div>

                {/* Translation Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2 md:mb-3">
                      {t('addService.serviceName')} *
                    </label>
                    <input
                      type="text"
                      placeholder={t('addService.serviceNamePlaceholder')}
                      value={formData.translations[currentLang].title}
                      onChange={(e) => handleTranslationChange(currentLang, 'title', e.target.value)}
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2 md:mb-3">
                      {t('addService.serviceDescription')} *
                    </label>
                    <textarea
                      placeholder={t('addService.serviceDescriptionPlaceholder')}
                      value={formData.translations[currentLang].description}
                      onChange={(e) => handleTranslationChange(currentLang, 'description', e.target.value)}
                      rows="3 md:rows-4"
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 resize-none text-sm md:text-base"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Price Type */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-2 md:mb-3">
                  {t('addService.priceType')} *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`relative flex items-center justify-center p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.price_type === 'fixed' 
                      ? 'border-[#F4B942] bg-[#F4B942]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="fixed"
                      checked={formData.price_type === 'fixed'}
                      onChange={(e) => handleInputChange('price_type', e.target.value)}
                      className="sr-only"
                    />
                    <span className={`font-semibold text-sm md:text-base ${
                      formData.price_type === 'fixed' ? 'text-white' : 'text-gray-600'
                    }`}>
                      {t('addService.fixed')}
                    </span>
                  </label>
                  <label className={`relative flex items-center justify-center p-3 md:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.price_type === 'negotiable' 
                      ? 'border-[#F4B942] bg-[#F4B942]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      value="negotiable"
                      checked={formData.price_type === 'negotiable'}
                      onChange={(e) => handleInputChange('price_type', e.target.value)}
                      className="sr-only"
                    />
                    <span className={`font-semibold text-sm md:text-base ${
                      formData.price_type === 'negotiable' ? 'text-white' : 'text-gray-600'
                    }`}>
                      {t('addService.negotiable')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Price Input */}
              {formData.price_type === 'fixed' && (
                <div>
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-2 md:mb-3">
                    {t('service.price')} ({t('service.currency', 'сом')}) *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] pl-10 md:pl-12 text-sm md:text-base"
                      placeholder="0"
                      required
                    />
                    <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <span className="font-semibold text-sm md:text-base">{t('service.currency', 'сом')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-[#1E2A3A] mb-4 md:mb-6">
                  {t('addService.contactInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                      {t('addService.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+996 XXX XXX XXX"
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+996 XXX XXX XXX"
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                      Telegram
                    </label>
                    <input
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => handleInputChange('telegram', e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                      {t('addService.twoGis')}
                    </label>
                    <input
                      type="url"
                      value={formData.two_gis_link}
                      onChange={(e) => handleInputChange('two_gis_link', e.target.value)}
                      placeholder="https://2gis.kg/..."
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-[#1E2A3A] mb-4 md:mb-6">
                  {t('addService.media')}
                </h3>
                
                {/* Avatar */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                    {t('addService.avatar')}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'avatar')}
                    className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F4B942] file:text-[#1E2A3A] hover:file:bg-[#e5a832]"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('service.fileSizeHint', 'Максимальный размер файла: 30 МБ')}</p>
                  <div id="avatar-preview" className="mt-2"></div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num}>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('addService.image')} {num}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, `image${num}`)}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F4B942] file:text-[#1E2A3A] hover:file:bg-[#e5a832]"
                      />
                      <p className="text-xs text-gray-500 mt-1">{t('service.fileSizeHint', 'Максимальный размер файла: 30 МБ')}</p>
                      <div id={`image${num}-preview`} className="mt-2"></div>
                    </div>
                  ))}
                </div>

                {/* Videos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(num => (
                    <div key={num}>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('addService.video')} {num}
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, `video${num}`)}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#F4B942] file:text-[#1E2A3A] hover:file:bg-[#e5a832]"
                      />
                      <p className="text-xs text-gray-500 mt-1">{t('service.fileSizeHint', 'Максимальный размер файла: 30 МБ')}</p>
                      <div id={`video${num}-preview`} className="mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 md:pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#F4B942] text-[#1E2A3A] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm md:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#1E2A3A] border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('addService.submit')}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-white border-2 border-[#1E2A3A] text-[#1E2A3A] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-[#1E2A3A] hover:text-white transition-all duration-300 text-sm md:text-base"
                >
                  {t('addService.cancel')}
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
            <p>
              {t('addService.needHelp')}{' '}
              <a href="mailto:support@plan.kg" className="text-[#F4B942] font-semibold hover:underline">
                {t('addService.contactSupport')}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xl z-50 flex items-center justify-center p-3 md:p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-[#F4B942] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1E2A3A] mb-2">
                Расширить аудиторию?
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Хотите заполнить услугу на английском и кыргызском языках? Это поможет привлечь больше клиентов из разных стран.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleFillLanguages}
                className="w-full bg-[#F4B942] text-[#1E2A3A] py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Заполнить на других языках
              </button>

              <button
                onClick={handlePublishNow}
                className="w-full bg-white border-2 border-[#1E2A3A] text-[#1E2A3A] py-3 md:py-4 px-4 md:px-6 rounded-xl font-bold hover:bg-[#1E2A3A] hover:text-white transition-all duration-300 flex items-center justify-center text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Опубликовать сейчас
              </button>
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}