import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
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
      const subcategories = allData.flatMap(parent => {
        return (parent.subcategories || []).map(sub => ({
          ...sub,
          parentName: parent.name
        }));
      });
      setCategories(subcategories);
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
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== '-created_at'
  );

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E2A3A] mb-4">
            {t('nav.services')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('services.description', 'Найдите идеальную услугу для ваших потребностей')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1E2A3A]">
                  {t('filters.filter')}
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[#F4B942] hover:text-[#e5a832] font-medium transition-colors"
                  >
                    {t('filters.clear')}
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('filters.search')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder={t('home.searchPlaceholder')}
                    className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('filters.category')}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
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
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('filters.city')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder={t('auth.city')}
                    className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('filters.priceRange')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      placeholder={t('filters.minPrice')}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      placeholder={t('filters.maxPrice')}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                  {t('filters.sortBy')}
                </label>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                >
                  <option value="-created_at">{t('filters.newest')}</option>
                  <option value="created_at">{t('filters.oldest')}</option>
                  <option value="price">{t('filters.priceAsc')}</option>
                  <option value="-price">{t('filters.priceDesc')}</option>
                  <option value="-rating">{t('filters.ratingDesc')}</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={fetchServices}
                className="w-full bg-[#F4B942] text-[#1E2A3A] py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {t('filters.apply')}
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1E2A3A]">
                    {t('services.found', 'Найдено услуг')}: {services.length}
                  </h3>
                  {hasActiveFilters && (
                    <p className="text-sm text-gray-600 mt-1">
                      {t('filters.activeFilters')}
                    </p>
                  )}
                </div>
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mt-4 sm:mt-0">
                  <button className="bg-[#E9EEF4] text-[#1E2A3A] px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    {t('filters.showFilters')}
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-l-[#1E2A3A] rounded-full animate-ping"></div>
                </div>
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 mx-auto mb-6 bg-[#E9EEF4] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1E2A3A] mb-2">
                  {t('common.noResults')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('services.tryChangingFilters', 'Попробуйте изменить параметры фильтрации')}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-semibold hover:bg-[#e5a832] transition-colors"
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