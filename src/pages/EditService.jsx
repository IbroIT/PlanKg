import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditService() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState('ru');
  const [user, setUser] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [formData, setFormData] = useState({
    translations: {
      ru: { 
        title: '', 
        description: '',
        additional_services: '',
        languages: '',
        dress_code: '',
        working_hours: '',
        services_offered: '',
        cuisine_type: '',
        music_genre: '',
        repertoire: '',
        show_type: '',
        stage_requirements: '',
        character_type: '',
        vehicle_type: '',
        equipment_type: '',
        rental_duration: '',
        license_number: '',
      },
      en: { 
        title: '', 
        description: '',
        additional_services: '',
        languages: '',
        dress_code: '',
        working_hours: '',
        services_offered: '',
        cuisine_type: '',
        music_genre: '',
        repertoire: '',
        show_type: '',
        stage_requirements: '',
        character_type: '',
        vehicle_type: '',
        equipment_type: '',
        rental_duration: '',
        license_number: '',
      },
      kg: { 
        title: '', 
        description: '',
        additional_services: '',
        languages: '',
        dress_code: '',
        working_hours: '',
        services_offered: '',
        cuisine_type: '',
        music_genre: '',
        repertoire: '',
        show_type: '',
        stage_requirements: '',
        character_type: '',
        vehicle_type: '',
        equipment_type: '',
        rental_duration: '',
        license_number: '',
      },
    },
    category_id: '',
    avatar: null,
    avatar_url: null,
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
    image1_url: null,
    image2_url: null,
    image3_url: null,
    image4_url: null,
    image5_url: null,
    video1: null,
    video2: null,
    video1_url: null,
    video2_url: null,
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
  });  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchCategories();
    fetchUserData();
    fetchServiceData();
  }, [i18n.language]);

  const fetchUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await servicesAPI.getCategories(i18n.language);
      const allData = Array.isArray(data) ? data : (data.results || []);
      setCategories(allData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchServiceData = async () => {
    try {
      setFetchLoading(true);
      const serviceData = await servicesAPI.getServiceDetail(id, i18n.language);
      console.log('Fetched service data:', serviceData);

      // Check if user owns this service
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || serviceData.user.id !== currentUser.id) {
        alert('У вас нет прав на редактирование этой услуги');
        navigate('/profile');
        return;
      }

      // Translatable fields that should be in translations
      const translatableFields = ['additional_services', 'languages', 'dress_code', 'working_hours', 
                                 'services_offered', 'cuisine_type', 'music_genre', 'repertoire', 
                                 'show_type', 'stage_requirements', 'character_type', 'vehicle_type', 
                                 'equipment_type', 'rental_duration', 'license_number'];

      // Initialize translations with existing data or defaults
      const translations = serviceData.translations || {
        ru: { title: '', description: '' },
        en: { title: '', description: '' },
        kg: { title: '', description: '' },
      };

      console.log('Original translations from API:', serviceData.translations);
      console.log('Processed translations:', translations);

      // Ensure all languages have basic structure and translatable fields
      ['ru', 'en', 'kg'].forEach(lang => {
        if (!translations[lang]) {
          translations[lang] = { title: '', description: '' };
        }
        // Copy title and description if they exist
        if (serviceData.title && lang === 'ru') translations[lang].title = serviceData.title;
        if (serviceData.description && lang === 'ru') translations[lang].description = serviceData.description;
        
        // For translatable fields, put the direct field value into the current language
        // Since API returns them directly, we'll assume they're in the default language (ru)
        if (lang === 'ru') {
          translatableFields.forEach(field => {
            if (serviceData[field] !== null && serviceData[field] !== undefined) {
              translations[lang][field] = serviceData[field];
            }
          });
        } else {
          // For other languages, copy from ru if not set
          translatableFields.forEach(field => {
            if (!translations[lang][field] && translations.ru[field]) {
              translations[lang][field] = translations.ru[field];
            }
          });
        }
      });

      // Populate form data
      setFormData({
        translations: translations,
        category_id: serviceData.category?.id || '',
        avatar: null, // Files can't be pre-populated, but we'll show existing avatar
        avatar_url: serviceData.avatar, // Store existing avatar URL for preview
        price: serviceData.price || '',
        price_type: serviceData.price_type || 'fixed',
        city: serviceData.city || '',
        phone: serviceData.phone || '',
        email: serviceData.email || '',
        instagram: serviceData.instagram || '',
        whatsapp: serviceData.whatsapp || '',
        telegram: serviceData.telegram || '',
        two_gis_link: serviceData.two_gis_link || '',
        capacity: serviceData.capacity || '',
        average_check: serviceData.average_check || '',
        event_duration: serviceData.event_duration || '',
        additional_services: serviceData.additional_services || '', // Keep for backward compatibility
        experience_years: serviceData.experience_years || '',
        hourly_rate: serviceData.hourly_rate || '',
        gender: serviceData.gender || 'any',
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image1_url: serviceData.images?.[0] || null, // Store existing image URLs for preview
        image2_url: serviceData.images?.[1] || null,
        image3_url: serviceData.images?.[2] || null,
        image4_url: serviceData.images?.[3] || null,
        image5_url: serviceData.images?.[4] || null,
        video1: null,
        video2: null,
        video1_url: serviceData.videos?.[0] || null, // Store existing video URLs for preview
        video2_url: serviceData.videos?.[1] || null,
        // Category-specific fields
        shooting_hour_price: serviceData.shooting_hour_price || '',
        full_day_price: serviceData.full_day_price || '',
        love_story_price: serviceData.love_story_price || '',
        portfolio_photos_count: serviceData.portfolio_photos_count || '',
        delivery_time_days: serviceData.delivery_time_days || '',
        shooting_style: serviceData.shooting_style || '',
        second_operator: serviceData.second_operator || false,
        drone_available: serviceData.drone_available || false,
        video_format: serviceData.video_format || 'hd',
        sound_recording: serviceData.sound_recording || false,
        montage_included: serviceData.montage_included || false,
        video_presentation: serviceData.video_presentation || '',
        languages: serviceData.languages || '', // Keep for backward compatibility
        dress_code: serviceData.dress_code || '',
        time_limit: serviceData.time_limit || '',
        stage_available: serviceData.stage_available || false,
        sound_available: serviceData.sound_available || false,
        parking_available: serviceData.parking_available || false,
        projector_available: serviceData.projector_available || false,
        decor_available: serviceData.decor_available || false,
        menu_available: serviceData.menu_available || false,
        working_hours: serviceData.working_hours || '',
        services_offered: serviceData.services_offered || '',
        wedding_decor_price: serviceData.wedding_decor_price || '',
        custom_calculation: serviceData.custom_calculation || false,
        cuisine_type: serviceData.cuisine_type || '',
        service_type: serviceData.service_type || 'buffet',
        minimum_order: serviceData.minimum_order || '',
        delivery_included: serviceData.delivery_included || false,
        staff_included: serviceData.staff_included || false,
        music_genre: serviceData.music_genre || '',
        equipment_provided: serviceData.equipment_provided || false,
        repertoire: serviceData.repertoire || '',
        performance_type: serviceData.performance_type || 'live',
        show_type: serviceData.show_type || '',
        performance_video: serviceData.performance_video || '',
        stage_requirements: serviceData.stage_requirements || '',
        character_type: serviceData.character_type || '',
        show_duration: serviceData.show_duration || '',
        props_included: serviceData.props_included || false,
        vehicle_type: serviceData.vehicle_type || '',
        vehicle_capacity: serviceData.vehicle_capacity || '',
        driver_included: serviceData.driver_included || false,
        decoration_available: serviceData.decoration_available || false,
        service_duration: serviceData.service_duration || '',
        home_visit: serviceData.home_visit || false,
        cake_weight_kg: serviceData.cake_weight_kg || '',
        flavors_available: serviceData.flavors_available || '',
        advance_order_days: serviceData.advance_order_days || '',
        equipment_type: serviceData.equipment_type || '',
        rental_duration: serviceData.rental_duration || '',
        rental_price: serviceData.rental_price || '',
        staff_count: serviceData.staff_count || '',
        uniform_provided: serviceData.uniform_provided || false,
        license_number: serviceData.license_number || '',
        guard_count: serviceData.guard_count || '',
        lighting_type: serviceData.lighting_type || '',
        sound_system: serviceData.sound_system || '',
        stage_setup: serviceData.stage_setup || false
      });
    } catch (error) {
      console.error('Error fetching service data:', error);
      alert('Ошибка при загрузке данных услуги');
      navigate('/profile');
    } finally {
      setFetchLoading(false);
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
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [currentLang]: {
            ...prev.translations[currentLang],
            [field]: value,
          },
        },
        [field]: value, // Keep for backward compatibility
      }));
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
      (formData.translations?.[currentLang]?.[fieldName] || formData[fieldName] || '') : 
      formData[fieldName];    const fieldId = `field-${fieldName}`;

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

    // If user chose to fill other languages, validate they are filled
    if (currentLang === 'en' && (!formData.translations.en.title.trim() || !formData.translations.en.description.trim())) {
      alert('Пожалуйста, заполните название и описание услуги на английском языке.');
      return;
    }
    if (currentLang === 'kg' && (!formData.translations.kg.title.trim() || !formData.translations.kg.description.trim())) {
      alert('Пожалуйста, заполните название и описание услуги на кыргызском языке.');
      return;
    }

    await updateService();
  };

  const updateService = async () => {
    setLoading(true);

    const updateData = {
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

    // Add category-specific fields
    const categoryFields = getCategoryFields();
    categoryFields.forEach(field => {
      if (formData[field] !== null && formData[field] !== undefined && formData[field] !== '') {
        updateData[field] = formData[field];
      }
    });

    // Add common additional fields
    const additionalFields = [
      'capacity', 'average_check', 'event_duration', 'additional_services',
      'experience_years', 'hourly_rate', 'gender', 'two_gis_link'
    ];
    additionalFields.forEach(field => {
      if (formData[field] !== null && formData[field] !== undefined && formData[field] !== '') {
        updateData[field] = formData[field];
      }
    });

    // Add translatable fields from translations (take from current language)
    const translatableFields = ['additional_services', 'languages', 'dress_code', 'working_hours', 
                               'services_offered', 'cuisine_type', 'music_genre', 'repertoire', 
                               'show_type', 'stage_requirements', 'character_type', 'vehicle_type', 
                               'equipment_type', 'rental_duration', 'license_number'];
    translatableFields.forEach(field => {
      const value = formData.translations[currentLang]?.[field];
      if (value !== null && value !== undefined && value !== '') {
        updateData[field] = value;
      }
    });

    console.log('Updating service with data:', updateData);

    try {
      await servicesAPI.updateService(id, updateData);
      alert('Услуга успешно обновлена и отправлена на модерацию!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating service:', error);
      alert(t('common.error'));
    } finally {
      setLoading(false);
    }
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

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4B942]"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-3 md:py-8">
      <div className="container mx-auto px-2 md:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-3 md:p-8 mb-6 md:mb-8 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
              <div className="flex-1">
                <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t('editService.title', 'Редактировать услугу')}</h1>
                <p className="text-gray-300 text-xs md:text-lg">
                  {t('editService.subtitle', 'Внесите изменения в вашу услугу')}
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
                  <div id="avatar-preview" className="mt-2">
                    {formData.avatar_url && (
                      <div className="relative inline-block">
                        <img src={formData.avatar_url} alt="Current avatar" className="w-full h-32 object-cover rounded-xl" />
                        <span className="absolute top-2 right-2 bg-[#F4B942] text-[#1E2A3A] text-xs px-2 py-1 rounded">
                          {t('editService.currentImage', 'Текущее изображение')}
                        </span>
                      </div>
                    )}
                  </div>
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
                      <div id={`image${num}-preview`} className="mt-2">
                        {formData[`image${num}_url`] && (
                          <div className="relative inline-block">
                            <img src={formData[`image${num}_url`]} alt={`Current image ${num}`} className="w-full h-32 object-cover rounded-xl" />
                            <span className="absolute top-2 right-2 bg-[#F4B942] text-[#1E2A3A] text-xs px-2 py-1 rounded">
                              {t('editService.currentImage', 'Текущее изображение')}
                            </span>
                          </div>
                        )}
                      </div>
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
                      <div id={`video${num}-preview`} className="mt-2">
                        {formData[`video${num}_url`] && (
                          <div className="relative inline-block">
                            <video src={formData[`video${num}_url`]} className="w-full h-32 object-cover rounded-xl" controls></video>
                            <span className="absolute top-2 right-2 bg-[#F4B942] text-[#1E2A3A] text-xs px-2 py-1 rounded">
                              {t('editService.currentVideo', 'Текущее видео')}
                            </span>
                          </div>
                        )}
                      </div>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('editService.update', 'Обновить услугу')}
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
    </div>
  );
}