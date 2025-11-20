import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../api/axios';

export default function UserProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userData, servicesData, reviewsData] = await Promise.all([
        axios.get(`/users/${id}/`),
        axios.get(`/services/?user=${id}`),
        axios.get(`/reviews/?user=${id}`)
      ]);
      
      setUser(userData.data);
      const userServices = servicesData.data.results || servicesData.data;
      setServices(userServices);
      
      // Получаем отзывы о услугах пользователя
      setReviews(reviewsData.data.results || reviewsData.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-[#F4B942] fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center py-8">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <div className="w-24 h-24 bg-[#E9EEF4] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-[#1E2A3A] mb-2">Пользователь не найден</h3>
          <p className="text-gray-600 mb-6">Возможно, профиль был удален</p>
          <Link
            to="/"
            className="inline-block bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-semibold hover:bg-[#e5a832] transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
        {/* Профиль пользователя */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Аватар */}
            <div className="relative shrink-0">
              <div className="w-32 h-32 bg-linear-to-br from-[#F4B942] to-[#e5a832] rounded-full flex items-center justify-center shadow-xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              {user.is_verified && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#1E2A3A] mb-2">
                    {user.username || user.email}
                  </h1>
                  {user.bio && (
                    <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                  )}
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-[#E9EEF4] rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#1E2A3A]">{services.length}</p>
                  <p className="text-sm text-gray-600">{t('profile.services', 'Услуг')}</p>
                </div>
                <div className="bg-[#E9EEF4] rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold text-[#1E2A3A]">
                      {typeof user.rating === 'number' ? user.rating.toFixed(1) : '—'}
                    </span>
                    <svg className="w-6 h-6 text-[#F4B942] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{t('profile.rating', 'Рейтинг')}</p>
                </div>
                <div className="bg-[#E9EEF4] rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#1E2A3A]">{reviews.length}</p>
                  <p className="text-sm text-gray-600">{t('profile.reviews', 'Отзывов')}</p>
                </div>
              </div>

              {/* Контакты */}
              <div className="mt-6">
                {(user.phone || user.email || user.whatsapp || user.telegram || user.instagram || user.city) ? (
                  <div className="space-y-2">
                    {user.city && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{t('cities.' + user.city.toLowerCase().replace(/\s+/g, ''), user.city)}</span>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user.whatsapp && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                        <span>{user.whatsapp}</span>
                      </div>
                    )}
                    {user.telegram && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        <span>{user.telegram}</span>
                      </div>
                    )}
                    {user.instagram && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>{user.instagram}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#E9EEF4] rounded-xl p-4 border-l-4 border-[#F4B942]">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-[#F4B942] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-[#1E2A3A] mb-1">Заполните профиль для лучших контактов</h4>
                        <p className="text-gray-600 text-sm">Добавьте город и социальные сети, чтобы клиенты могли легко связаться с вами</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'services'
                  ? 'bg-[#F4B942] text-[#1E2A3A] shadow-lg'
                  : 'text-gray-600 hover:bg-[#E9EEF4]'
              }`}
            >
              {t('profile.servicesTab', 'Услуги')} ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'bg-[#F4B942] text-[#1E2A3A] shadow-lg'
                  : 'text-gray-600 hover:bg-[#E9EEF4]'
              }`}
            >
              {t('profile.reviewsTab', 'Отзывы')} ({reviews.length})
            </button>
          </div>
        </div>

        {/* Контент табов */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <Link to={`/services/${service.id}`} className="block">
                    <div className="grid md:grid-cols-[300px_1fr] gap-6 p-6">
                      {/* Изображение */}
                      <div className="relative h-48 md:h-full bg-gray-200 rounded-xl overflow-hidden">
                        {service.images && service.images[0] ? (
                          <img
                            src={service.images[0]}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Информация об услуге */}
                      <div className="flex flex-col">
                        <h3 className="font-bold text-2xl text-[#1E2A3A] mb-3 hover:text-[#F4B942] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[#F4B942] font-bold text-2xl">
                            {service.price} сом
                          </span>
                          {service.rating && (
                            <div className="flex items-center space-x-2">
                              {renderStars(Math.round(service.rating))}
                              <span className="text-sm text-gray-600 ml-1">
                                ({service.reviews_count || 0})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Отзывы для этой услуги */}
                  {reviews.filter(review => review.service?.id === service.id).length > 0 && (
                    <div className="border-t border-gray-200 p-6 bg-linear-to-br from-[#E9EEF4] to-white">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg text-[#1E2A3A] flex items-center">
                          <svg className="w-5 h-5 mr-2 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {t('profile.reviewsForService', 'Отзывы об услуге')} ({reviews.filter(review => review.service?.id === service.id).length})
                        </h4>
                      </div>
                      <div className="space-y-4">
                        {reviews
                          .filter(review => review.service?.id === service.id)
                          .slice(0, 3)
                          .map((review) => (
                            <div
                              key={review.id}
                              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                            >
                              {/* Информация о пользователе */}
                              {review.user && (
                                <div className="flex items-center space-x-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#F4B942] to-[#e5a832] flex items-center justify-center shrink-0">
                                    {review.user.avatar ? (
                                      <img
                                        src={review.user.avatar}
                                        alt={review.user.username}
                                        className="w-full h-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-white font-semibold">
                                        {review.user.username?.charAt(0).toUpperCase() || 'U'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-[#1E2A3A]">
                                      {review.user.username || review.user.email}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      {renderStars(review.rating)}
                                      <span className="text-xs font-semibold text-[#1E2A3A]">
                                        {review.rating}/5
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-gray-700 leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        {reviews.filter(review => review.service?.id === service.id).length > 3 && (
                          <Link
                            to={`/services/${service.id}#reviews`}
                            className="inline-flex items-center space-x-2 text-[#F4B942] hover:text-[#e5a832] font-semibold transition-colors group"
                          >
                            <span>{t('profile.showAllReviews', 'Показать все отзывы')} ({reviews.filter(review => review.service?.id === service.id).length})</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-[#E9EEF4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">{t('profile.noServices', 'Нет услуг пока')}</h3>
                <p className="text-gray-600">{t('profile.noServicesDesc', 'Этот пользователь еще не добавил услуг')}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/services/${review.service?.id}`}
                        className="font-semibold text-[#1E2A3A] hover:text-[#F4B942] transition-colors"
                      >
                        {review.service?.title || t('profile.service', 'Услуга')}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-[#1E2A3A]">
                        {review.rating}/5
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-[#E9EEF4] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">{t('profile.noReviews', 'Отзывов пока нет')}</h3>
                <p className="text-gray-600">{t('profile.noReviewsDesc', 'Этот пользователь еще не оставлял отзывы')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
