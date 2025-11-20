import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';
import { servicesAPI } from '../api/services';

// Category-specific fields mapping (using slugs as keys)
const CATEGORY_FIELDS = {
  'photographers': [
    'shooting_hour_price', 'full_day_price', 'love_story_price', 'portfolio_photos_count',
    'shooting_style', 'delivery_time_days', 'experience_years', 'second_operator',
    'drone_available', 'video_format', 'sound_recording', 'montage_included'
  ],
  'videographers': [
    'shooting_hour_price', 'full_day_price', 'love_story_price', 'portfolio_photos_count',
    'shooting_style', 'delivery_time_days', 'experience_years', 'second_operator',
    'drone_available', 'video_format', 'sound_recording', 'montage_included'
  ],
  'hosts-toastmasters': [
    'video_presentation', 'languages', 'dress_code', 'experience_years',
    'time_limit'
  ],
  'venues-restaurants-halls': [
    'capacity', 'stage_available', 'sound_available', 'parking_available',
    'projector_available', 'decor_available', 'menu_available', 'working_hours'
  ],
  'florists-decorators': [
    'minimum_order', 'services_offered', 'wedding_decor_price',
    'custom_calculation'
  ],
  'catering': [
    'cuisine_type', 'service_type', 'minimum_order', 'delivery_included',
    'staff_included'
  ],
  'musicians-djs-bands': [
    'performance_video', 'equipment_provided', 'repertoire', 'performance_type',
    'music_genre'
  ],
  'artists-show-programs': [
    'show_type', 'performance_video', 'stage_requirements', 'character_type',
    'show_duration', 'props_included', 'experience_years'
  ],
  'event-organizers-agencies': [
    'experience_years', 'services_offered'
  ],
  'transportation': [
    'vehicle_type', 'vehicle_capacity', 'driver_included', 'decoration_available'
  ],
  'stylists-makeup-hairdressers': [
    'service_duration', 'home_visit'
  ],
  'bakeries-cakes-desserts': [
    'cake_weight_kg', 'flavors_available', 'advance_order_days'
  ],
  'photo-zones-equipment-props': [
    'equipment_type', 'rental_duration', 'rental_price'
  ],
  'waiters-event-staff': [
    'staff_count', 'uniform_provided'
  ],
  'security': [
    'license_number', 'guard_count'
  ],
  'animators-children-events': [
    'character_type', 'show_duration', 'props_included'
  ],
  'lighting-sound-stage': [
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
          telegram: userData.telegram || ''
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
                  {config.suffix === 'currency' ? t('service.currency') : config.suffix}
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
    if (!formData.translations.en.title.trim()) {
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          en: { ...prev.translations.ru }
        }
      }));
    }
    if (!formData.translations.kg.title.trim()) {
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          kg: { ...prev.translations.ru }
        }
      }));
    }
    
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
      avatar: formData.avatar,
      image1: formData.image1,
      image2: formData.image2,
      image3: formData.image3,
      image4: formData.image4,
      image5: formData.image5,
      video1: formData.video1,
      video2: formData.video2,
    };

    // Add category-specific fields only if they have values
    getCategoryFields().forEach(fieldName => {
      if (formData[fieldName] !== null && formData[fieldName] !== undefined && formData[fieldName] !== '') {
        submitData[fieldName] = formData[fieldName];
      }
    });

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
      if (!updatedTranslations.en.title.trim()) {
        updatedTranslations.en = { ...updatedTranslations.ru };
      }
      if (!updatedTranslations.kg.title.trim()) {
        updatedTranslations.kg = { ...updatedTranslations.ru };
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
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{t('addService.title')}</h1>
                <p className="text-gray-300 text-lg">
                  {t('addService.subtitle', 'Добавьте новую услугу и начните получать заказы')}
                </p>
              </div>
              <div className="bg-[#F4B942] text-[#1E2A3A] px-4 py-2 rounded-full font-bold">
                {t('addService.step')} 1/1
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('addService.category')} *
                </label>
                <div className="relative">
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                    className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] appearance-none"
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

              {/* Language Tabs */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.serviceInfo')}
                </h3>
                
                <div className="flex space-x-2 bg-[#E9EEF4] p-1 rounded-xl mb-6">
                  {['ru', 'en', 'kg'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setCurrentLang(lang)}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
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
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      {t('addService.serviceName')} *
                    </label>
                    <input
                      type="text"
                      placeholder={t('addService.serviceNamePlaceholder')}
                      value={formData.translations[currentLang].title}
                      onChange={(e) => handleTranslationChange(currentLang, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      {t('addService.serviceDescription')} *
                    </label>
                    <textarea
                      placeholder={t('addService.serviceDescriptionPlaceholder')}
                      value={formData.translations[currentLang].description}
                      onChange={(e) => handleTranslationChange(currentLang, 'description', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 resize-none"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Price Type */}
              <div>
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('addService.priceType')} *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
                    <span className={`font-semibold ${
                      formData.price_type === 'fixed' ? 'text-white' : 'text-gray-600'
                    }`}>
                      {t('addService.fixed')}
                    </span>
                  </label>
                  <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
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
                    <span className={`font-semibold ${
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
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                    {t('service.price')} ({t('service.currency')}) *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] pl-12"
                      placeholder="0"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <span className="font-semibold">{t('service.currency')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Category-specific fields */}
              {getCategoryFields().length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                    {t('addService.additionalInfo')}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {getCategoryFields().map(fieldName => renderField(fieldName))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.location')}
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      {t('auth.city')} *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      required
                    >
                      <option value="">{t('addService.selectCity')}</option>
                      <option value="Бишкек">{t('cities.bishkek')}</option>
                      <option value="Ош">{t('cities.osh')}</option>
                      <option value="Токмок">{t('cities.tokmok')}</option>
                      <option value="Кант">{t('cities.kant')}</option>
                      <option value="Кара-Балта">{t('cities.karaBalta')}</option>
                      <option value="Шопоков">{t('cities.shopokov')}</option>
                      <option value="Каинды">{t('cities.kaindy')}</option>
                      <option value="Кара-Суу">{t('cities.karaSuu')}</option>
                      <option value="Ноокат">{t('cities.nookat')}</option>
                      <option value="Узген (Өзгөн)">{t('cities.uzgen')}</option>
                      <option value="Манас">{t('cities.manas')}</option>
                      <option value="Кара-Куль">{t('cities.karaKul')}</option>
                      <option value="Майлуу-Суу">{t('cities.mailuuSuu')}</option>
                      <option value="Таш-Кумыр">{t('cities.tashKumyr')}</option>
                      <option value="Кербен (Ала-Бука)">{t('cities.kerben')}</option>
                      <option value="Каракол">{t('cities.karakol')}</option>
                      <option value="Балыкчы">{t('cities.balykchy')}</option>
                      <option value="Чолпон-Ата">{t('cities.cholponAta')}</option>
                      <option value="Нарын">{t('cities.naryn')}</option>
                      <option value="Кочкор">{t('cities.kochkor')}</option>
                      <option value="Ат-Башы">{t('cities.atBashi')}</option>
                      <option value="Талас">{t('cities.talas')}</option>
                      <option value="Кызыл-Адыр">{t('cities.kyzylAdyr')}</option>
                      <option value="Баткен">{t('cities.batken')}</option>
                      <option value="Кызыл-Кыя">{t('cities.kyzylKiya')}</option>
                      <option value="Сулюкта">{t('cities.sulukta')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.contactInfo')}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      {t('addService.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      placeholder="+996 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      placeholder="+996 XXX XXX XXX или @username"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      Telegram
                    </label>
                    <input
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => handleInputChange('telegram', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.images')}
                </h3>
                
                {/* Avatar */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                    {t('addService.avatar', 'Аватарка сервиса')}
                  </label>
                  <p className="text-gray-600 text-sm mb-4">
                    {t('addService.avatarHint', 'Загрузите основное изображение для вашего сервиса')}
                  </p>
                  <div className="text-center">
                    <label className="cursor-pointer group">
                      <div 
                        id="avatar-preview"
                        className="w-32 h-32 mx-auto bg-[#E9EEF4] rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#F4B942] transition-colors flex flex-col items-center justify-center mb-2 overflow-hidden"
                      >
                        <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-500">{t('addService.uploadAvatar', 'Загрузить аватарку')}</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'avatar')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {t('addService.imagesHint', 'Добавьте до 5 фотографий вашей услуги')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="text-center">
                      <label className="cursor-pointer group">
                        <div 
                          id={`image${num}-preview`}
                          className="w-full h-32 bg-[#E9EEF4] rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#F4B942] transition-colors flex flex-col items-center justify-center mb-2 overflow-hidden"
                        >
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">{t('addService.uploadImage')}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, `image${num}`)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.video')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('addService.videoHint')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map((num) => (
                    <div key={num} className="text-center">
                      <label className="cursor-pointer group">
                        <div 
                          id={`video${num}-preview`}
                          className="w-full h-32 bg-[#E9EEF4] rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#F4B942] transition-colors flex flex-col items-center justify-center mb-2 overflow-hidden"
                        >
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">{t('addService.uploadVideo')}</span>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileChange(e, `video${num}`)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#F4B942] text-[#1E2A3A] px-8 py-4 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#1E2A3A] border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('addService.submit')}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-white border-2 border-[#1E2A3A] text-[#1E2A3A] px-8 py-4 rounded-xl font-bold hover:bg-[#1E2A3A] hover:text-white transition-all duration-300"
                >
                  {t('addService.cancel')}
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#F4B942] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1E2A3A] mb-2">
                Расширить аудиторию?
              </h3>
              <p className="text-gray-600">
                Хотите заполнить услугу на английском и кыргызском языках? Это поможет привлечь больше клиентов из разных стран.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleFillLanguages}
                className="w-full bg-[#F4B942] text-[#1E2A3A] py-4 px-6 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Заполнить на других языках
              </button>

              <button
                onClick={handlePublishNow}
                className="w-full bg-white border-2 border-[#1E2A3A] text-[#1E2A3A] py-4 px-6 rounded-xl font-bold hover:bg-[#1E2A3A] hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Опубликовать сейчас
              </button>
            </div>

            <button
              onClick={() => setShowLanguageModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}