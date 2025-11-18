import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFavorites } from '../api/favorites';
import ServiceCard from '../components/ServiceCard';

export default function Favorites() {
  const { t, i18n } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, [i18n.language]);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites(i18n.language);
      const favoritesArray = data.results || data;
      setFavorites(Array.isArray(favoritesArray) ? favoritesArray : []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteRemoved = (serviceId) => {
    setFavorites(favorites.filter(fav => fav.service.id !== serviceId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-transparent border-l-[#1E2A3A] rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-4 md:p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-4xl font-bold mb-2 flex items-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 mr-3 md:mr-4 text-[#F4B942]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {t('favorites.title')}
              </h1>
              <p className="text-gray-300 text-base md:text-lg">
                {t('favorites.subtitle')}
              </p>
            </div>
            <div className="bg-[#F4B942] text-[#1E2A3A] px-3 py-2 md:px-4 md:py-2 rounded-full font-bold text-sm md:text-base self-start md:self-auto">
              {favorites.length} {t('favorites.items')}
            </div>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12 text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-linear-to-br from-[#E9EEF4] to-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1E2A3A] mb-4">
              {t('favorites.emptyTitle')}
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md mx-auto">
              {t('favorites.emptyDescription')}
            </p>
            <a
              href="/services"
              className="inline-flex items-center bg-[#F4B942] text-[#1E2A3A] px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {t('favorites.browseServices')}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <ServiceCard
                key={favorite.id}
                service={favorite.service}
                onFavoriteChange={() => handleFavoriteRemoved(favorite.service.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}