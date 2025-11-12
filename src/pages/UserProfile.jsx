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
      const [userData, servicesData] = await Promise.all([
        axios.get(`/users/${id}/`),
        axios.get(`/services/?user=${id}`)
      ]);
      
      setUser(userData.data);
      const userServices = servicesData.data.results || servicesData.data;
      setServices(userServices);
      
      // Получаем отзывы для каждой услуги пользователя
      if (userServices.length > 0) {
        const reviewsPromises = userServices.map(service => 
          axios.get(`/reviews/${service.id}/`).catch(() => ({ data: [] }))
        );
        const reviewsResponses = await Promise.all(reviewsPromises);
        
        // Объединяем все отзывы в один массив
        const allReviews = reviewsResponses.flatMap(response => response.data);
        console.log('Loaded reviews for services:', allReviews);
        setReviews(allReviews);
      }
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
                  <p className="text-sm text-gray-600">Услуг</p>
                </div>
                <div className="bg-[#E9EEF4] rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold text-[#1E2A3A]">
                      {user.rating && typeof user.rating === 'number' ? user.rating.toFixed(1) : '—'}
                    </span>
                    <svg className="w-6 h-6 text-[#F4B942] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">Рейтинг</p>
                </div>
                <div className="bg-[#E9EEF4] rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#1E2A3A]">{reviews.length}</p>
                  <p className="text-sm text-gray-600">Отзывов</p>
                </div>
              </div>

              {/* Контакты */}
              {(user.phone || user.email) && (
                <div className="mt-6 space-y-2">
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
                </div>
              )}
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
              Услуги ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'reviews'
                  ? 'bg-[#F4B942] text-[#1E2A3A] shadow-lg'
                  : 'text-gray-600 hover:bg-[#E9EEF4]'
              }`}
            >
              Отзывы ({reviews.length})
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
                          Отзывы об услуге ({reviews.filter(review => review.service?.id === service.id).length})
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
                            <span>Показать все отзывы ({reviews.filter(review => review.service?.id === service.id).length})</span>
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
                <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">Услуг пока нет</h3>
                <p className="text-gray-600">У этого пользователя еще нет добавленных услуг</p>
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
                        {review.service?.title || 'Услуга'}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
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
                <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">Отзывов пока нет</h3>
                <p className="text-gray-600">Этот пользователь еще не оставлял отзывы</p>
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
