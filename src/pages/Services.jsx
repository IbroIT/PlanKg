import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { servicesAPI } from '../api/services';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_rating: searchParams.get('min_rating') || '',
    ordering: searchParams.get('ordering') || '-created_at',
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [panelTransform, setPanelTransform] = useState('translateX(100%)');
  const [panelOpacity, setPanelOpacity] = useState(0);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const filtersRef = useRef(null);

  const cityOptions = [
    { value: 'Бишкек', key: 'bishkek' },
    { value: 'Ош', key: 'osh' },
    { value: 'Токмок', key: 'tokmok' },
    { value: 'Кант', key: 'kant' },
    { value: 'Кара-Балта', key: 'karaBalta' },
    { value: 'Шопоков', key: 'shopokov' },
    { value: 'Каинды', key: 'kaindy' },
    { value: 'Кара-Суу', key: 'karaSuu' },
    { value: 'Ноокат', key: 'nookat' },
    { value: 'Узген (Өзгөн)', key: 'uzgen' },
    { value: 'Манас', key: 'manas' },
    { value: 'Кара-Куль', key: 'karaKul' },
    { value: 'Майлуу-Суу', key: 'mailuuSuu' },
    { value: 'Таш-Кумыр', key: 'tashKumyr' },
    { value: 'Кербен (Ала-Бука)', key: 'kerben' },
    { value: 'Каракол', key: 'karakol' },
    { value: 'Балыкчы', key: 'balykchy' },
    { value: 'Чолпон-Ата', key: 'cholponAta' },
    { value: 'Нарын', key: 'naryn' },
    { value: 'Кочкор', key: 'kochkor' },
    { value: 'Ат-Башы', key: 'atBashi' },
    { value: 'Талас', key: 'talas' },
    { value: 'Кызыл-Адыр', key: 'kyzylAdyr' },
    { value: 'Баткен', key: 'batken' },
    { value: 'Кызыл-Кыя', key: 'kyzylKiya' },
    { value: 'Сулюкта', key: 'sulukta' }
  ];

  // Считаем активные фильтры
  useEffect(() => {
    const count = Object.entries(filters).filter(([key, value]) => 
      value && value !== '-created_at' && value !== ''
    ).length;
    setActiveFilterCount(count);
  }, [filters]);

  // Управление анимацией фильтров
  useEffect(() => {
    if (mobileFiltersOpen) {
      setIsAnimating(true);
      // Немного задержки для инициализации
      setTimeout(() => {
        setOverlayOpacity(1);
        setPanelTransform('translateX(0)');
        setPanelOpacity(1);
      }, 10);
    } else {
      setOverlayOpacity(0);
      setPanelTransform('translateX(100%)');
      setPanelOpacity(0);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [mobileFiltersOpen]);

  useEffect(() => {
    fetchCategories();
  }, [i18n.language]);

  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      city: searchParams.get('city') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
      min_rating: searchParams.get('min_rating') || '',
      ordering: searchParams.get('ordering') || '-created_at',
    });
  }, [searchParams]);

  useEffect(() => {
    fetchServices();
  }, [filters, i18n.language]);

  const fetchCategories = async () => {
    try {
      const data = await servicesAPI.getCategories(i18n.language);
      const allData = Array.isArray(data) ? data : (data.results || []);
      
      const parentCategories = allData.map(parent => ({
        id: parent.id,
        name: parent.name,
        parentName: null,
        isParent: true
      }));
      
      const subcategories = allData.flatMap(parent => {
        return (parent.subcategories || []).map(sub => ({
          ...sub,
          parentName: parent.name,
          isParent: false
        }));
      });
      
      const allCategories = [...parentCategories, ...subcategories];
      setCategories(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = { lang: i18n.language };
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key];
      });
      const data = await servicesAPI.getServices(params);
      setServices(data.results || data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = {};
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params[k] = newFilters[k];
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      min_price: '',
      max_price: '',
      min_rating: '',
      ordering: '-created_at',
    });
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const applyFilters = () => {
    fetchServices();
    setMobileFiltersOpen(false);
  };

  // Компонент фильтров для переиспользования
  const FiltersContent = () => (
    <div className="space-y-4">
      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
          {t('filters.category')}
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 bg-[#E9EEF4] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] text-sm"
        >
          <option value="">{t('filters.allCategories')}</option>
          {Array.isArray(categories) && categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
          {t('filters.city')}
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="w-full px-3 py-2 bg-[#E9EEF4] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] text-sm"
        >
          <option value="">{t('filters.allCities', 'Все города')}</option>
          {cityOptions.map(city => (
            <option key={city.value} value={city.value}>{t(`cities.${city.key}`)}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
          {t('filters.priceRange')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="number"
              value={filters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              placeholder={t('filters.minPrice')}
              className="w-full px-3 py-2 bg-[#E9EEF4] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              value={filters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              placeholder={t('filters.maxPrice')}
              className="w-full px-3 py-2 bg-[#E9EEF4] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
          {t('filters.sortBy')}
        </label>
        <select
          value={filters.ordering}
          onChange={(e) => handleFilterChange('ordering', e.target.value)}
          className="w-full px-3 py-2 bg-[#E9EEF4] border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] text-sm"
        >
          <option value="-created_at">{t('filters.newest')}</option>
          <option value="created_at">{t('filters.oldest')}</option>
          <option value="price">{t('filters.priceAsc')}</option>
          <option value="-price">{t('filters.priceDesc')}</option>
          <option value="-rating">{t('filters.ratingDesc')}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-4">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mt-8 font-bold text-[#1E2A3A]">
                {t('nav.services')}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {t('services.description', 'Найдите идеальную услугу для ваших потребностей')}
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden bg-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 font-semibold text-[#1E2A3A] relative"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <span>{t('filters.filter')}</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden mb-4">
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="w-full px-4 py-3 bg-white border-0 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E2A3A]">
                  {t('filters.filter')}
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#F4B942] hover:text-[#e5a832] font-medium transition-colors"
                  >
                    {t('filters.clear')}
                  </button>
                )}
              </div>

              <FiltersContent />

              <button
                onClick={fetchServices}
                className="w-full bg-[#F4B942] text-[#1E2A3A] py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
              >
                {t('filters.apply')}
              </button>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
          {isAnimating && (
            <div 
              className="fixed inset-0 z-50 lg:hidden transition-opacity duration-300"
              style={{ opacity: overlayOpacity }}
            >
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black transition-opacity duration-300"
                style={{ opacity: overlayOpacity * 0.5 }}
                onClick={() => setMobileFiltersOpen(false)}
              />
              
              {/* Filters Panel */}
              <div 
                ref={filtersRef}
                className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto transform transition-all duration-300"
                style={{ 
                  transform: panelTransform,
                  opacity: panelOpacity
                }}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-[#1E2A3A]">
                      {t('filters.filter')}
                    </h2>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Filters Content */}
                  <FiltersContent />

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-8 pt-4 border-t border-gray-200">
                    <button
                      onClick={clearFilters}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      {t('filters.clear')}
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 bg-[#F4B942] text-[#1E2A3A] py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-colors"
                    >
                      {t('filters.apply')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1E2A3A]">
                    {t('services.found', 'Найдено услуг')}: {services.length}
                  </h3>
                  {activeFilterCount > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {activeFilterCount} {t('filters.activeFilters')}
                    </p>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#F4B942] hover:text-[#e5a832] font-medium px-3 py-1 rounded-full bg-yellow-50 transition-colors"
                  >
                    {t('filters.clear')}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">{t('common.loading')}</p>
                </div>
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#E9EEF4] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-2">
                  {t('common.noResults')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('services.tryChangingFilters', 'Попробуйте изменить параметры фильтрации')}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#F4B942] text-[#1E2A3A] px-4 py-2 rounded-xl font-semibold hover:bg-[#e5a832] transition-colors"
                >
                  {t('filters.clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}