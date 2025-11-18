import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesAPI } from '../api/services';
import { reviewsAPI } from '../api/reviews';
import { isAuthenticated } from '../api/auth';
import ReviewCard from '../components/ReviewCard';
import { FaMoneyBillWave, FaCalendarAlt, FaHeart, FaCamera, FaClock, FaMicrophone, FaUser, FaMapMarkerAlt, FaUtensils, FaMusic, FaCar, FaHome, FaBirthdayCake, FaTools, FaUsers, FaShieldAlt, FaMagic, FaVideo, FaStar } from 'react-icons/fa';

export default function ServiceDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // City translation mapping
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

  const translateCity = (city) => {
    return t(`cities.${cityKeys[city] || 'bishkek'}`);
  };

  const nextImage = useCallback(() => {
    if (service && service.images && service.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === service.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  }, [service]);

  const prevImage = useCallback(() => {
    if (service && service.images && service.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? service.images.length - 1 : prevIndex - 1
      );
    }
  }, [service]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const fetchData = useCallback(async () => {
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
  }, [id, i18n.language]);

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData();
  }, [id, i18n.language, fetchData]);

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
                service.images.length > 1 ? (
                  // Slider for more than 1 image
                  <div className="relative">
                    <div className="relative h-96 overflow-hidden cursor-pointer" onClick={() => openImageModal(currentImageIndex)}>
                      <img
                        src={service.images[currentImageIndex]}
                        alt={`${service.title} ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                      />
                      
                      {/* Navigation arrows */}
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Image counter */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {service.images.length}
                      </div>
                      
                      {/* Zoom icon */}
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Thumbnail indicators */}
                    <div className="flex justify-center space-x-2 p-4 bg-gray-50">
                      {service.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentImageIndex ? 'bg-[#F4B942]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // Single image
                  <img
                    src={service.images[0]}
                    alt={`${service.title} 1`}
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => openImageModal(0)}
                  />
                )
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

              {/* Category-specific Information */}
              {service.category && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    {t('service.detailedInfo')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Photographer */}
                    {(service.category.name.toLowerCase().includes('photographer') || 
                      service.category.name.toLowerCase().includes('фотограф')) && (
                      <div className="space-y-4">
                        {service.shooting_hour_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.shootingHourPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.shooting_hour_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.full_day_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCalendarAlt className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.fullDayPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.full_day_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.love_story_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaHeart className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.loveStoryPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.love_story_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.portfolio_photos_count && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCamera className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.portfolio')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.portfolio_photos_count} фото</p>
                          </div>
                        )}
                        {service.shooting_style && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.shootingStyle')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.shooting_style}</p>
                          </div>
                        )}
                        {service.delivery_time_days && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.deliveryTime')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.delivery_time_days} дней</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Videographer */}
                    {(service.category.name.toLowerCase().includes('video') || 
                      service.category.name.toLowerCase().includes('видео')) && (
                      <div className="space-y-4">
                        {service.shooting_hour_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.shootingHourPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.shooting_hour_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.full_day_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCalendarAlt className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.fullDayPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.full_day_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.video_format && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaVideo className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.videoFormat')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.video_format}</p>
                          </div>
                        )}
                        {service.second_operator && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUser className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.secondOperator')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.second_operator ? 'Да' : 'Нет'}</p>
                          </div>
                        )}
                        {service.montage_included && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaTools className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.montage')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.montage_included ? 'Включён' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.sound_recording && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMicrophone className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.soundRecording')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.sound_recording ? 'Да' : 'Нет'}</p>
                          </div>
                        )}
                        {service.portfolio_photos_count && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCamera className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.portfolio')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.portfolio_photos_count} фото</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Host/MC */}
                    {(service.category.name.toLowerCase().includes('host') || 
                      service.category.name.toLowerCase().includes('ведущ')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.hourlyPayment')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.languages && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.languages')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.languages}</p>
                          </div>
                        )}
                        {service.dress_code && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.dressCode')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.dress_code}</p>
                          </div>
                        )}
                        {service.time_limit && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.timeLimit')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.time_limit}</p>
                          </div>
                        )}
                        {service.additional_services && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.whatIncluded')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{typeof service.additional_services === 'string' ? service.additional_services : JSON.stringify(service.additional_services)}</p>
                          </div>
                        )}
                        {service.performance_video && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaVideo className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.videoPresentation')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">Доступно</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Venues/Restaurants */}
                    {(service.category.name.toLowerCase().includes('venue') || 
                      service.category.name.toLowerCase().includes('hall') ||
                      service.category.name.toLowerCase().includes('restaurant') ||
                      service.category.name.toLowerCase().includes('зал') || 
                      service.category.name.toLowerCase().includes('площадк') ||
                      service.category.name.toLowerCase().includes('ресторан')) && (
                      <div className="space-y-4">
                        {service.capacity && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUsers className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.capacity')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.capacity} чел.</p>
                          </div>
                        )}
                        {service.rental_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.rentalPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.rental_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.average_check && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.averageCheck')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.average_check} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.working_hours && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.workingHours')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.working_hours}</p>
                          </div>
                        )}
                        {service.cuisine_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUtensils className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.cuisine')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.cuisine_type}</p>
                          </div>
                        )}
                        <div className="bg-[#E9EEF4] p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-2">{t('service.conveniences')}</div>
                          <div className="flex flex-wrap gap-2">
                            {service.stage_available && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{t('service.stage')}</span>}
                            {service.sound_available && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{t('service.sound')}</span>}
                            {service.parking_available && <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">{t('service.parking')}</span>}
                            {service.projector_available && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{t('service.projector')}</span>}
                            {service.decor_available && <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">{t('service.decor')}</span>}
                            {service.menu_available && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">{t('service.menu')}</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Florist */}
                    {(service.category.name.toLowerCase().includes('florist') || 
                      service.category.name.toLowerCase().includes('флорист')) && (
                      <div className="space-y-4">
                        {service.minimum_order && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.minimumOrder')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.minimum_order} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.wedding_decor_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.weddingDecor')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.wedding_decor_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.custom_calculation && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaTools className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.individualCalculation')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">Да</p>
                          </div>
                        )}
                        {service.additional_services && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.whatTheyDo')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{typeof service.additional_services === 'string' ? service.additional_services : JSON.stringify(service.additional_services)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Catering */}
                    {(service.category.name.toLowerCase().includes('catering') || 
                      service.category.name.toLowerCase().includes('кейтеринг')) && (
                      <div className="space-y-4">
                        {service.minimum_order && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.minimumOrder')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.minimum_order} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.average_check && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.pricePerPerson')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.average_check} ${t('service.currency')}</p>
                          </div>
                        )}
                        {service.service_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUtensils className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.serviceType')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.service_type}</p>
                          </div>
                        )}
                        {service.delivery_included && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.delivery')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.delivery_included ? 'Включена' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.staff_included && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUser className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.waiters')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.staff_included ? 'Включены' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.menu_available && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUtensils className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.menuAvailable')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">Доступно</p>
                          </div>
                        )}
                        {service.additional_services && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaTools className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.inventory')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{typeof service.additional_services === 'string' ? service.additional_services : JSON.stringify(service.additional_services)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Music/DJ */}
                    {(service.category.name.toLowerCase().includes('music') || 
                      service.category.name.toLowerCase().includes('dj') ||
                      service.category.name.toLowerCase().includes('музык')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.hourlyPayment')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.equipment_provided && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMusic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.equipment')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.equipment_provided ? 'Предоставляется' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.repertoire && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMusic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.repertoire')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.repertoire}</p>
                          </div>
                        )}
                        {service.performance_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMicrophone className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.performanceFormat')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.performance_type}</p>
                          </div>
                        )}
                        {service.music_genre && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMusic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.musicGenre')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.music_genre}</p>
                          </div>
                        )}
                        {service.time_limit && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.workTime')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.time_limit}</p>
                          </div>
                        )}
                        {service.performance_video && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaVideo className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.performanceVideo')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">Доступно</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Artist */}
                    {(service.category.name.toLowerCase().includes('artist') || 
                      service.category.name.toLowerCase().includes('артист')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.costServices')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.show_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.showType')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.show_type}</p>
                          </div>
                        )}
                        {service.show_duration && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.showDuration')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.show_duration}</p>
                          </div>
                        )}
                        {service.stage_requirements && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.stageRequirements')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.stage_requirements}</p>
                          </div>
                        )}
                        {service.performance_video && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaVideo className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.performanceVideo')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">Доступно</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Transport */}
                    {(service.category.name.toLowerCase().includes('transport') || 
                      service.category.name.toLowerCase().includes('транспорт')) && (
                      <div className="space-y-4">
                        {service.vehicle_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCar className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.vehicleType')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.vehicle_type}</p>
                          </div>
                        )}
                        {service.vehicle_capacity && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUsers className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.vehicleCapacity')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.vehicle_capacity} чел.</p>
                          </div>
                        )}
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.hourPrice')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.minimum_order && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.minOrder')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.minimum_order} ч</p>
                          </div>
                        )}
                        {service.driver_included && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUser className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.driver')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.driver_included ? 'Включён' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.decoration_available && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.decoration')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.decoration_available ? 'Доступно' : 'Нет'}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stylist */}
                    {(service.category.name.toLowerCase().includes('stylist') || 
                      service.category.name.toLowerCase().includes('стилист')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.costServices')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.home_visit && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaHome className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.homeVisit')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.home_visit ? 'Да' : 'Нет'}</p>
                          </div>
                        )}
                        {service.additional_services && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.providedServices')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{typeof service.additional_services === 'string' ? service.additional_services : JSON.stringify(service.additional_services)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Baker */}
                    {(service.category.name.toLowerCase().includes('baker') || 
                      service.category.name.toLowerCase().includes('cake') ||
                      service.category.name.toLowerCase().includes('пекар') || 
                      service.category.name.toLowerCase().includes('торт')) && (
                      <div className="space-y-4">
                        {service.cake_weight_kg && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaBirthdayCake className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.cakePriceKg')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.cake_weight_kg} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.flavors_available && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUtensils className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.availableFlavors')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.flavors_available}</p>
                          </div>
                        )}
                        {service.advance_order_days && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCalendarAlt className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.orderAdvance')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.advance_order_days} дней</p>
                          </div>
                        )}
                        {service.minimum_order && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.minOrderKg')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.minimum_order} кг</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Equipment */}
                    {(service.category.name.toLowerCase().includes('equipment') || 
                      service.category.name.toLowerCase().includes('оборудов')) && (
                      <div className="space-y-4">
                        {service.rental_price && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.rentalCost')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.rental_price} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.rental_duration && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.rentalPeriod')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.rental_duration}</p>
                          </div>
                        )}
                        {service.equipment_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaTools className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.equipmentType')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.equipment_type}</p>
                          </div>
                        )}
                        {service.additional_services && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.equipment')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{typeof service.additional_services === 'string' ? service.additional_services : JSON.stringify(service.additional_services)}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Staff */}
                    {(service.category.name.toLowerCase().includes('staff') || 
                      service.category.name.toLowerCase().includes('персонал')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.hourlyPayment')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.staff_count && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUsers className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.staffCount')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.staff_count} чел.</p>
                          </div>
                        )}
                        {service.uniform_provided && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.uniform')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.uniform_provided ? 'Предоставляется' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.service_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaUtensils className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.specialization')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.service_type}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Security */}
                    {(service.category.name.toLowerCase().includes('security') || 
                      service.category.name.toLowerCase().includes('охрана')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.hourPriceSecurity')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.license_number && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.licenseNumber')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.license_number}</p>
                          </div>
                        )}
                        {service.guard_count && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaShieldAlt className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.guardsCount')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.guard_count} чел.</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Animator */}
                    {(service.category.name.toLowerCase().includes('animator') || 
                      service.category.name.toLowerCase().includes('аниматор')) && (
                      <div className="space-y-4">
                        {service.hourly_rate && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMoneyBillWave className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.hourPriceAnimation')}</span>
                            </div>
                            <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency')}</p>
                          </div>
                        )}
                        {service.character_type && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.characters')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.character_type}</p>
                          </div>
                        )}
                        {service.show_duration && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaClock className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.showDurationAnimation')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.show_duration}</p>
                          </div>
                        )}
                        {service.props_included && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.props')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{service.props_included ? 'Включён' : 'Отдельно'}</p>
                          </div>
                        )}
                        {service.additional_services && (
                          <div className="bg-[#E9EEF4] p-4 rounded-lg">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaMagic className="w-4 h-4 mr-2" />
                              <span className="text-sm">{t('service.scenario')}</span>
                            </div>
                            <p className="text-lg font-semibold text-[#1E2A3A]">{typeof service.additional_services === 'string' ? service.additional_services : JSON.stringify(service.additional_services)}</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* Venue/Restaurant Specific Info */}
              {(service.capacity || service.average_check || service.event_duration) && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    {t('service.venueInfo')}
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
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.average_check} ${t('service.currency')}</p>
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
                    {t('service.specialistInfo')}
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
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} ${t('service.currency')}/час</p>
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
                        {t('service.website')}
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
                  {translateCity(service.city)}
                </div>
              </div>

              {/* Videos */}
              {service.videos && service.videos.length > 0 && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    {t('service.videos')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.videos.map((video, index) => (
                      <video key={index} controls className="w-full rounded-lg">
                        <source src={video} type="video/mp4" />
                        {t('service.videoNotSupported')}
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
                    {showReviewForm ? t('service.cancel') : t('service.addReview', 'Оставить отзыв')}
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
                        <span className="font-bold text-[#1E2A3A] text-lg">{reviews.length}</span> {t('service.reviewsCount', { count: reviews.length })}
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
                    <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">{t('service.noReviewsYet')}</h3>
                    <p className="text-gray-600 mb-6">{t('service.beFirstToReview')}</p>
                    {isAuthenticated() && !showReviewForm && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {t('service.leaveFirstReview')}
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
                  ? `${service.hourly_rate} ${t('service.currency')}/${t('service.hour')}`
                  : service.price_type === 'fixed' && service.price
                  ? `${service.price} ${t('service.currency')}`
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

                  {/* Social Media Links */}
                  {(service.user.whatsapp || service.user.telegram || service.user.instagram) && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('profile.socialMedia')}
                      </h4>
                      <div className="flex space-x-2">
                        {service.user.whatsapp && (
                          <a
                            href={`https://wa.me/${service.user.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            title="WhatsApp"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                          </a>
                        )}
                        {service.user.telegram && (
                          <a
                            href={`https://t.me/${service.user.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            title="Telegram"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                          </a>
                        )}
                        {service.user.instagram && (
                          <a
                            href={`https://instagram.com/${service.user.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition"
                            title="Instagram"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

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
                      className="block w-full bg-linear-to-r from-purple-500 to-pink-500 text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      📷 {t('service.instagram')}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && service.images && service.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-full p-4">
            {/* Close button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all duration-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Main image */}
            <img
              src={service.images[currentImageIndex]}
              alt={`${service.title} ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Modal navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition-all duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 transition-all duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image counter in modal */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {service.images.length}
            </div>
            
            {/* Thumbnail strip */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
              {service.images.slice(Math.max(0, currentImageIndex - 2), Math.min(service.images.length, currentImageIndex + 3)).map((image, index) => {
                const actualIndex = Math.max(0, currentImageIndex - 2) + index;
                return (
                  <button
                    key={actualIndex}
                    onClick={(e) => { e.stopPropagation(); goToImage(actualIndex); }}
                    className={`w-12 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                      actualIndex === currentImageIndex ? 'border-[#F4B942]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${actualIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



