import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { toggleFavorite } from '../api/favorites';
import { isAuthenticated } from '../api/auth';

export default function ServiceCard({ service, onFavoriteChange }) {
  console.log('ServiceCard service:', service);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(service.is_favorited || false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Маппинг городов на translation keys
  const cityKeys = {
    'Бишкек': 'bishkek',
    'Ош': 'osh',
    'Токмок': 'tokmok',
    'Кант': 'kant',
    'Кара-Балта': 'karaBalta',
    'Шопоков': 'shopokov',
    'Каинды': 'kaindy',
    'Кара-Суу': 'karaSuu',
    'Ноокат': 'nookat',
    'Узген (Өзгөн)': 'uzgen',
    'Манас': 'manas',
    'Кара-Куль': 'karaKul',
    'Майлуу-Суу': 'mailuuSuu',
    'Таш-Кумыр': 'tashKumyr',
    'Кербен (Ала-Бука)': 'kerben',
    'Каракол': 'karakol',
    'Балыкчы': 'balykchy',
    'Чолпон-Ата': 'cholponAta',
    'Нарын': 'naryn',
    'Кочкор': 'kochkor',
    'Ат-Башы': 'atBashi',
    'Талас': 'talas',
    'Кызыл-Адыр': 'kyzylAdyr',
    'Баткен': 'batken',
    'Кызыл-Кыя': 'kyzylKiya',
    'Сулюкта': 'sulukta'
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }

    if (isTogglingFavorite) return;

    try {
      setIsTogglingFavorite(true);
      const result = await toggleFavorite(service.id);
      console.log('Toggle favorite result:', result);
      setIsFavorited(result.is_favorited);
      if (onFavoriteChange) {
        onFavoriteChange(service.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/services/${service.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full relative border border-gray-100 hover:border-[#F4B942] hover:border-opacity-30 cursor-pointer"
    >
      <button
        onClick={handleFavoriteClick}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-all duration-300 group-hover:bg-[#F4B942] group-hover:bg-opacity-10"
        disabled={isTogglingFavorite}
      >
        <svg
          className={isFavorited ? 'w-5 h-5 text-red-500 fill-current' : 'w-5 h-5 text-gray-400 group-hover:text-white'}
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {service.status === 'pending' && (
        <div className="absolute top-4 left-4 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
          {t('service.pending')}
        </div>
      )}

      <div className="h-48 bg-linear-to-br from-[#E9EEF4] to-gray-100 overflow-hidden relative">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              if (service.logo) {
                e.target.src = service.logo;
              } else {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : service.logo ? (
          <img
            src={service.logo}
            alt={service.title}
            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="w-full h-full flex items-center justify-center text-gray-400" style={{display: 'none'}}>
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-6">
        {service.category && (
          <div className="flex items-center mb-3">
            <div className="bg-[#E9EEF4] text-[#1E2A3A] px-3 py-1 rounded-full text-xs font-medium">
              {service.category.name}
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-[#1E2A3A] mb-3 line-clamp-2 group-hover:text-[#F4B942] transition-colors duration-300">
          {service.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t(`cities.${cityKeys[service.city] || 'bishkek'}`)}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 gap-3">
            <div className="text-[#F4B942] font-bold text-xl">
              {service.price_type === 'fixed' && service.price
                ? `${service.price} ${t('service.currency')}`
                : t('service.negotiable')}
            </div>          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {(() => {
              console.log('ServiceCard service:', service);
              console.log('reviews_count:', service.reviews_count, 'type:', typeof service.reviews_count);
              return service.rating > 0;
            })() && (
              <div className="flex items-center bg-[#E9EEF4] px-2 py-1 sm:px-3 rounded-full">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#F4B942] fill-current mr-1" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-xs sm:text-sm font-semibold text-[#1E2A3A]">
                  {service.rating ? Number(service.rating).toFixed(1) : '0.0'}
                </span>
                <span className="ml-1 text-xs text-gray-500">
                  ({service.reviews_count || 0})
                </span>
              </div>
            )}

            {service.created_at && (
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(service.created_at).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#F4B942] group-hover:border-opacity-20 transition-all duration-500" />
    </div>
  );
}
