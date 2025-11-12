import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesAPI } from '../api/services';
import { reviewsAPI } from '../api/reviews';
import { isAuthenticated } from '../api/auth';
import ReviewCard from '../components/ReviewCard';

export default function ServiceDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchData();
  }, [id, i18n.language]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceData, reviewsData] = await Promise.all([
        servicesAPI.getServiceDetail(id, i18n.language),
        reviewsAPI.getServiceReviews(id),
      ]);
      setService(serviceData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      alert(t('auth.login'));
      window.location.href = '/login';
      return;
    }
    
    // Валидация на фронтенде
    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      alert('Комментарий должен содержать минимум 10 символов');
      return;
    }
    
    if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
      alert('Выберите рейтинг от 1 до 5');
      return;
    }
    
    try {
      const payload = {
        service: parseInt(id, 10),
        rating: parseInt(reviewData.rating, 10),
        comment: reviewData.comment.trim(),
      };
      
      console.log('Submitting review:', payload);
      const newReview = await reviewsAPI.createReview(payload);
      console.log('Review created successfully:', newReview);
      
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
      
      // Обновляем список отзывов без полной перезагрузки
      console.log('Fetching updated reviews for service:', id);
      const updatedReviews = await reviewsAPI.getServiceReviews(id);
      console.log('Updated reviews:', updatedReviews);
      setReviews(updatedReviews);
      
      alert('Отзыв успешно добавлен!');
    } catch (error) {
      console.error('Error creating review:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Произошла ошибка при добавлении отзыва';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (data.comment) {
          errorMessage = Array.isArray(data.comment) ? data.comment[0] : data.comment;
        } else if (data.rating) {
          errorMessage = Array.isArray(data.rating) ? data.rating[0] : data.rating;
        } else if (data.service) {
          errorMessage = Array.isArray(data.service) ? data.service[0] : data.service;
        } else {
          errorMessage = JSON.stringify(data);
        }
      }
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4B942]"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('common.noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              {service.images && service.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${service.title} ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-[#1E2A3A] mb-4">
                {service.title}
              </h1>

              {service.category && (
                <div className="inline-block bg-[#E9EEF4] px-4 py-2 rounded-lg mb-4">
                  <span className="text-[#1E2A3A] font-medium">{service.category.name}</span>
                </div>
              )}

              <div className="flex items-center mb-6">
                {service.rating > 0 && (
                  <div className="flex items-center mr-6">
                    <svg className="w-6 h-6 text-[#F4B942] fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <span className="ml-2 text-lg font-semibold text-[#1E2A3A]">
                      {service.rating ? Number(service.rating).toFixed(1) : '0.0'}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({service.reviews_count || 0} {t('service.reviews')})
                    </span>
                  </div>
                )}
                <div className="flex items-center text-gray-500">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {service.views_count} {t('service.views', { defaultValue: 'views' })}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-[#1E2A3A] mb-3">
                  {t('service.description')}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              {/* Venue/Restaurant Specific Info */}
              {(service.capacity || service.average_check || service.event_duration) && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    Информация о заведении
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.capacity && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm">{t('service.capacity')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.capacity} чел.</p>
                      </div>
                    )}
                    {service.average_check && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{t('service.averageCheck')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.average_check} сом</p>
                      </div>
                    )}
                    {service.event_duration && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{t('service.eventDuration')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.event_duration}</p>
                      </div>
                    )}
                  </div>
                  {service.additional_services && Object.keys(service.additional_services).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-[#1E2A3A] mb-2">
                        {t('service.additionalServices')}
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {Object.entries(service.additional_services).map(([key, value]) => (
                          <li key={key}>{value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Individual Provider Specific Info */}
              {(service.experience_years || service.hourly_rate || service.gender) && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    Информация о специалисте
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.experience_years && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{t('service.experienceYears')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.experience_years} лет</p>
                      </div>
                    )}
                    {service.hourly_rate && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{t('service.hourlyRate')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} сом/час</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(service.phone || service.email || service.website || service.instagram || service.facebook) && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    {t('service.contact')}
                  </h2>
                  <div className="space-y-3">
                    {service.phone && (
                      <a href={`tel:${service.phone}`} className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {service.phone}
                      </a>
                    )}
                    {service.email && (
                      <a href={`mailto:${service.email}`} className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {service.email}
                      </a>
                    )}
                    {service.website && (
                      <a href={service.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Вебсайт
                      </a>
                    )}
                    {service.instagram && (
                      <a href={`https://instagram.com/${service.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <span className="mr-3">📷</span>
                        @{service.instagram}
                      </a>
                    )}
                    {service.facebook && (
                      <a href={`https://facebook.com/${service.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <span className="mr-3">👤</span>
                        {service.facebook}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex items-center text-gray-700 mb-3">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold mr-2">{t('service.location')}:</span>
                  {service.city}
                </div>
              </div>

              {/* Videos */}
              {service.videos && service.videos.length > 0 && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    Видео
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.videos.map((video, index) => (
                      <video key={index} controls className="w-full rounded-lg">
                        <source src={video} type="video/mp4" />
                        Ваш браузер не поддерживает видео.
                      </video>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div id="reviews" className="bg-white rounded-xl shadow-md p-6 mt-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#F4B942]">
                <h2 className="text-3xl font-bold text-[#1E2A3A] flex items-center">
                  <svg className="w-8 h-8 mr-3 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t('service.reviews')} ({reviews.length})
                </h2>
                {isAuthenticated() && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {showReviewForm ? 'Отменить' : t('service.addReview', 'Оставить отзыв')}
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-[#E9EEF4] rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('service.rating')}
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`w-8 h-8 ${
                              star <= reviewData.rating ? 'text-[#F4B942] fill-current' : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('service.comment', { defaultValue: 'Comment' })}
                    </label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942]"
                      required
                    ></textarea>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="bg-[#F4B942] text-[#1E2A3A] px-6 py-2 rounded-lg font-semibold hover:bg-[#e5a832] transition"
                    >
                      {t('addService.submit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-200 text-[#1E2A3A] px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      {t('addService.cancel')}
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4 mt-6">
                {reviews.length > 0 ? (
                  <>
                    <div className="bg-[#E9EEF4] rounded-xl p-4 mb-6">
                      <p className="text-center text-gray-600">
                        <span className="font-bold text-[#1E2A3A] text-lg">{reviews.length}</span> {reviews.length === 1 ? 'отзыв' : reviews.length < 5 ? 'отзыва' : 'отзывов'}
                      </p>
                    </div>
                    {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
                  </>
                ) : (
                  <div className="text-center py-16 bg-[#E9EEF4] rounded-xl">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">Отзывов пока нет</h3>
                    <p className="text-gray-600 mb-6">Будьте первым, кто оставит отзыв об этой услуге!</p>
                    {isAuthenticated() && !showReviewForm && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Оставить первый отзыв
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price & Contact */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              {/* Logo for venues/restaurants */}
              {service.logo && (
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <img
                    src={service.logo}
                    alt={service.title}
                    className="w-full h-32 object-contain"
                  />
                </div>
              )}

              <div className="text-3xl font-bold text-[#F4B942] mb-6">
                {service.price_type === 'hourly' && service.hourly_rate
                  ? `${service.hourly_rate} сом/час`
                  : service.price_type === 'fixed' && service.price
                  ? `${service.price} сом`
                  : t('service.negotiable')}
              </div>

              {/* Status Badge */}
              {service.status === 'pending' && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('service.pending')}</span>
                  </div>
                </div>
              )}

              {/* Provider Info */}
              {service.user && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                    {t('service.provider')}
                  </h3>
                  <Link
                    to={`/users/${service.user.id}`}
                    className="flex items-center mb-4 hover:bg-[#E9EEF4] p-3 rounded-lg transition"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#E9EEF4] flex items-center justify-center mr-4">
                      {service.user.avatar ? (
                        <img
                          src={service.user.avatar}
                          alt={service.user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[#1E2A3A] font-semibold text-2xl">
                          {service.user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E2A3A]">
                        {service.user.first_name || service.user.username}
                      </p>
                      {service.user.rating > 0 && (
                        <div className="flex items-center mt-1">
                          <svg className="w-4 h-4 text-[#F4B942] fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="ml-1 text-sm">
                            {service.user.rating ? Number(service.user.rating).toFixed(1) : '0.0'} ({service.user.reviews_count || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {(service.phone || service.user.phone) && (
                    <a
                      href={`tel:${service.phone || service.user.phone}`}
                      className="block w-full bg-[#F4B942] text-[#1E2A3A] text-center py-3 rounded-lg font-semibold hover:bg-[#e5a832] transition mb-3"
                    >
                      📞 {t('service.contactProvider')}
                    </a>
                  )}

                  {service.instagram && (
                    <a
                      href={`https://instagram.com/${service.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      📷 Instagram
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
