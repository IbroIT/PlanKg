import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../api/services';

// Иконки для категорий
const CategoryIcons = {
  default: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  beauty: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  health: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  education: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  repair: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  cleaning: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  transport: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  )
};

const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase();
  if (name?.includes('красот')) return CategoryIcons.beauty;
  if (name?.includes('здоров')) return CategoryIcons.health;
  if (name?.includes('образован') || name?.includes('обучен')) return CategoryIcons.education;
  if (name?.includes('ремонт') || name?.includes('техник')) return CategoryIcons.repair;
  if (name?.includes('уборк') || name?.includes('чист')) return CategoryIcons.cleaning;
  if (name?.includes('транспорт') || name?.includes('перевоз')) return CategoryIcons.transport;
  return CategoryIcons.default;
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, servicesData] = await Promise.all([
        servicesAPI.getCategories(i18n.language),
        servicesAPI.getServices({ page_size: 8, lang: i18n.language }),
      ]);
      setCategories(categoriesData);
      setServices(servicesData.results || servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(searchQuery)}`;
    } else {
      searchInputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EEF4]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1E2A3A] via-[#243143] to-[#2a3f54] text-white py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-[#F4B942] rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#F4B942] rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#F4B942] rounded-full blur-lg"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {t('home.title')}
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 leading-relaxed">
                {t('home.subtitle')}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto transition-all duration-300 ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t('home.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-14 pr-8 py-5 rounded-2xl text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-4 focus:ring-[#F4B942] focus:ring-opacity-50 shadow-2xl text-lg border-0"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#F4B942] text-[#1E2A3A] px-8 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  {t('filters.search')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white border-opacity-50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F4B942] to-[#e5a832] rounded-2xl shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#1E2A3A] mb-3">
              {t('home.allCategories', 'Популярные категории')}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('home.categoriesDescription', 'Откройте для себя широкий спектр услуг в различных категориях')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin"></div>
                <div className="absolute inset-0 border-4 border-transparent border-l-[#1E2A3A] rounded-full animate-ping"></div>
              </div>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/services?category=${category.id}`}
                  className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#F4B942] hover:border-opacity-50"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Background gradient animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-[#E9EEF4] opacity-100 group-hover:from-[#F4B942] group-hover:to-[#e5a832] group-hover:opacity-5 transition-all duration-500"></div>
                  
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#F4B942] to-[#e5a832] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 group-hover:animate-pulse"></div>
                  <div className="absolute inset-[2px] rounded-3xl bg-white -z-5"></div>

                  <div className="relative p-6 text-center">
                    {/* Icon with floating animation */}
                    <div className="relative inline-block mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F4B942] to-[#e5a832] rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500 group-hover:scale-110"></div>
                      <div className="relative bg-gradient-to-br from-[#E9EEF4] to-white rounded-2xl p-4 group-hover:from-[#F4B942] group-hover:to-[#e5a832] transition-all duration-500 shadow-inner border border-gray-100 group-hover:border-transparent">
                        <div className="text-[#1E2A3A] group-hover:text-white transition-colors duration-500 transform group-hover:scale-110">
                          {getCategoryIcon(category.name)}
                        </div>
                      </div>
                    </div>

                    {/* Category name with gradient text */}
                    <h3 className="text-lg font-bold text-[#1E2A3A] group-hover:text-[#F4B942] transition-all duration-500 mb-2">
                      {category.name}
                    </h3>

                    {/* Description with fade effect */}
                    {category.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-[#F4B942] transition-colors duration-500">
                        {category.description}
                      </p>
                    )}

                    {/* Animated arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#F4B942] to-[#e5a832] rounded-full flex items-center justify-center shadow-lg">
                        <svg 
                          className="w-4 h-4 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 group-hover:animate-shine transition-all duration-700"></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#E9EEF4] to-white rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">
                {t('common.noCategories', 'Категории не найдены')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('common.tryAgainLater', 'Попробуйте обновить страницу позже')}
              </p>
              <button
                onClick={fetchData}
                className="bg-gradient-to-r from-[#F4B942] to-[#e5a832] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                {t('common.retry', 'Попробовать снова')}
              </button>
            </div>
          )}

          {/* View All Categories Button */}
          {categories.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/categories"
                className="inline-flex items-center space-x-2 bg-white text-[#1E2A3A] px-8 py-4 rounded-2xl font-bold hover:bg-[#F4B942] hover:text-[#1E2A3A] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200"
              >
                <span>Все категории</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 group hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-[#E9EEF4] rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E9EEF4] to-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-[#F4B942] group-hover:to-[#e5a832] transition-all duration-500 shadow-inner">
                <svg className="w-10 h-10 text-[#1E2A3A] group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E2A3A] mb-3">
                {t('home.fastBooking', 'Быстрое бронирование')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.fastBookingDesc', 'Мгновенное подтверждение и удобное расписание')}
              </p>
            </div>
            
            <div className="text-center p-8 group hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-[#E9EEF4] rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E9EEF4] to-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-[#F4B942] group-hover:to-[#e5a832] transition-all duration-500 shadow-inner">
                <svg className="w-10 h-10 text-[#1E2A3A] group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E2A3A] mb-3">
                {t('home.qualityServices', 'Качественные услуги')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.qualityServicesDesc', 'Проверенные специалисты и отличные отзывы')}
              </p>
            </div>
            
            <div className="text-center p-8 group hover:transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-[#E9EEF4] rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E9EEF4] to-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-[#F4B942] group-hover:to-[#e5a832] transition-all duration-500 shadow-inner">
                <svg className="w-10 h-10 text-[#1E2A3A] group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E2A3A] mb-3">
                {t('home.securePayments', 'Безопасные платежи')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('home.securePaymentsDesc', 'Защищенные транзакции и гарантии')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}