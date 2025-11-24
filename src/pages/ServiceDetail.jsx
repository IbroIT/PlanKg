import { useTranslation } from 'react-i18next';
import '../ServiceDetail.adaptive.css';
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesAPI } from '../api/services';
import { reviewsAPI } from '../api/reviews';
import { isAuthenticated } from '../api/auth';
import ReviewCard from '../components/ReviewCard';
import { FaMoneyBillWave, FaCalendarAlt, FaHeart, FaCamera, FaClock, FaMicrophone, FaUser, FaMapMarkerAlt, FaUtensils, FaMusic, FaCar, FaHome, FaBirthdayCake, FaTools, FaUsers, FaShieldAlt, FaMagic, FaVideo, FaStar, FaPhone, FaInstagram, FaFacebook } from 'react-icons/fa';
import twogislogo from '../assets/2gis.jpg';
const translateVideoFormat = (format, t) => {
  const translations = {
    'hd': t('service.videoFormatOptions.hd'),
    '4k': t('service.videoFormatOptions.4k'),
    'full_hd': t('service.videoFormatOptions.full_hd')
  };
  return translations[format] || format;
};

const translateServiceType = (type, t) => {
  const translations = {
    'buffet': t('service.serviceTypeOptions.buffet'),
    'banquet': t('service.serviceTypeOptions.banquet'),
    'individual': t('service.serviceTypeOptions.individual')
  };
  return translations[type] || type;
};

const translatePerformanceType = (type, t) => {
  const translations = {
    'live': t('service.performanceTypeOptions.live'),
    'dj': t('service.performanceTypeOptions.dj'),
    'backing_track': t('service.performanceTypeOptions.backing_track')
  };
  return translations[type] || type;
};

export default function ServiceDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [contactInitiated, setContactInitiated] = useState(false);
  const [showContactFeedback, setShowContactFeedback] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // City translation mapping
  const translateCity = (city) => {
    return t(`cities.${city || 'bishkek'}`);
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
      console.log('Service data:', serviceData);
      console.log('Service avatar:', serviceData.avatar);
      
      // Process images and videos to include all available files
      const processedServiceData = { ...serviceData };
      
      console.log('Raw images array:', processedServiceData.images);
      console.log('Raw videos array:', processedServiceData.videos);
      
      // Log individual image and video fields
      for (let i = 1; i <= 10; i++) {
        const imageField = `image${i}`;
        if (processedServiceData[imageField]) {
          console.log(`Found ${imageField}:`, processedServiceData[imageField]);
        }
      }
      for (let i = 1; i <= 3; i++) {
        const videoField = `video${i}`;
        if (processedServiceData[videoField]) {
          console.log(`Found ${videoField}:`, processedServiceData[videoField]);
        }
      }
      
      // Collect all images from arrays and individual fields
      const allImages = [];
      
      // First, add images from the images array if it exists
      if (processedServiceData.images && Array.isArray(processedServiceData.images)) {
        processedServiceData.images.forEach(img => {
          if (img && typeof img === 'string' && img.trim()) {
            allImages.push(img.trim());
          }
        });
      }
      
      // Then add individual image fields if they exist and aren't already in the array
      for (let i = 1; i <= 10; i++) {
        const imageField = `image${i}`;
        const imageUrl = processedServiceData[imageField];
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() && !allImages.includes(imageUrl.trim())) {
          allImages.push(imageUrl.trim());
        }
      }
      
      // Remove duplicates and filter out empty/null values
      processedServiceData.images = [...new Set(allImages.filter(img => img && img.trim()))];
      
      // Collect all videos from arrays and individual fields
      const allVideos = [];
      
      // First, add videos from the videos array if it exists
      if (processedServiceData.videos && Array.isArray(processedServiceData.videos)) {
        processedServiceData.videos.forEach(vid => {
          if (vid && typeof vid === 'string' && vid.trim()) {
            allVideos.push(vid.trim());
          }
        });
      }
      
      // Then add individual video fields if they exist and aren't already in the array
      for (let i = 1; i <= 3; i++) {
        const videoField = `video${i}`;
        const videoUrl = processedServiceData[videoField];
        if (videoUrl && typeof videoUrl === 'string' && videoUrl.trim() && !allVideos.includes(videoUrl.trim())) {
          allVideos.push(videoUrl.trim());
        }
      }
      
      // Remove duplicates and filter out empty/null values
      processedServiceData.videos = [...new Set(allVideos.filter(vid => vid && vid.trim()))];
      
      console.log('Final images array:', processedServiceData.images);
      console.log('Final videos array:', processedServiceData.videos);
      console.log('Total images found:', processedServiceData.images.length);
      console.log('Total videos found:', processedServiceData.videos.length);
      
      setService(processedServiceData);
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && contactInitiated) {
        setShowContactFeedback(true);
        setContactInitiated(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [contactInitiated]);

  useEffect(() => {
    if (contactInitiated) {
      const timer = setTimeout(() => {
        setShowContactFeedback(true);
        setContactInitiated(false);
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, [contactInitiated]);

  const handleDeleteService = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    setShowDeleteModal(false);
    try {
      await servicesAPI.deleteService(service.id);
      alert(t('service.deleteSuccess', 'Услуга успешно удалена'));
      navigate('/profile'); // или '/services'
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(t('service.deleteError', 'Ошибка при удалении услуги'));
    }
  };

  const cancelDeleteService = () => {
    setShowDeleteModal(false);
  };

  const handleArchiveService = async () => {
    try {
      await servicesAPI.archiveService(service.id);
      alert(t('service.archiveSuccess', 'Услуга успешно архивирована'));
      // Обновляем статус услуги
      setService({ ...service, status: 'archived' });
    } catch (error) {
      console.error('Error archiving service:', error);
      alert(t('service.archiveError', 'Ошибка при архивировании услуги'));
    }
  };

  const handleUnarchiveService = async () => {
    try {
      await servicesAPI.unarchiveService(service.id);
      alert(t('service.unarchiveSuccess', 'Услуга успешно восстановлена'));
      // Обновляем статус услуги на pending для модерации
      setService({ ...service, status: 'pending' });
    } catch (error) {
      console.error('Error unarchiving service:', error);
      alert(t('service.unarchiveError', 'Ошибка при восстановлении услуги'));
    }
  };

  const handleShareClick = async () => {
    const shareData = {
      title: service.title,
      text: service.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert(t('service.linkCopied', 'Ссылка скопирована в буфер обмена'));
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareData.url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(t('service.linkCopied', 'Ссылка скопирована в буфер обмена'));
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      alert(t('service.invalidRating', 'Пожалуйста, выберите рейтинг от 1 до 5 звезд'));
      return;
    }

    if (!reviewData.comment || reviewData.comment.trim().length < 10) {
      alert(t('service.commentTooShort', 'Комментарий должен содержать минимум 10 символов'));
      return;
    }

    try {
      await reviewsAPI.createReview({
        service: service.id,
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
      });
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      // Refresh reviews
      const updatedReviews = await reviewsAPI.getServiceReviews(id);
      setReviews(updatedReviews);
      alert(t('service.reviewSubmitted', 'Отзыв успешно отправлен'));
    } catch (error) {
      console.error('Error submitting review:', error);

      // Handle specific validation errors
      if (error.response && error.response.data) {
        const errorData = error.response.data;

        if (errorData.comment && Array.isArray(errorData.comment)) {
          alert(errorData.comment[0]);
        } else if (errorData.rating && Array.isArray(errorData.rating)) {
          alert(errorData.rating[0]);
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          alert(errorData.non_field_errors[0]);
        } else if (errorData.detail) {
          alert(errorData.detail);
        } else {
          alert(t('service.reviewError', 'Ошибка при отправке отзыва'));
        }
      } else {
        alert(t('service.reviewError', 'Ошибка при отправке отзыва'));
      }
    }
  };

  const handleReviewUpdate = (updatedReview) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
    window.location.reload();
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(prevReviews =>
      prevReviews.filter(review => review.id !== reviewId)
    );
    window.location.reload();
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
            {/* Service Info */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-[#1E2A3A] mb-4">
                        {service.title}
                      </h1>

                      <div className="flex items-center gap-4 mb-4">
                        {service.category && (
                          <div className="inline-block bg-[#E9EEF4] px-4 py-2 rounded-lg">
                            <span className="text-[#1E2A3A] font-medium">{service.category.name}</span>
                          </div>
                        )}

                        {/* Status Badge - only for pending services */}
                        {service.status === 'pending' && (
                          <div className="inline-block bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">{t('service.pending')}</span>
                            </div>
                          </div>
                        )}
                        {service.status === 'archived' && (
                          <div className="inline-block bg-gray-100 border border-gray-400 text-gray-700 px-4 py-2 rounded-lg">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                              </svg>
                              <span className="font-medium">{t('service.archived')}</span>
                            </div>
                          </div>
                        )}
                      </div>                  <div className="flex items-center mb-6">
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
                </div>

                {service.avatar && (
                  <div className="w-64 h-64 rounded-lg overflow-hidden shadow-lg shrink-0">
                    <img
                      src={service.avatar}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Individual Provider Specific Info */}
              {(service.experience_years || service.hourly_rate) && (
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
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.experience_years} {t('service.years')}</p>
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
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.hourly_rate} {t('service.currency', 'сом')}/{t('service.hour')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lighting/Sound/Stage Equipment Specific Info */}
              {(service.lighting_type || service.sound_system || service.stage_setup) && (
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <h2 className="text-xl font-semibold text-[#1E2A3A] mb-4">
                    {t('service.equipmentInfo')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {service.lighting_type && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-sm">{t('service.lightingType')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.lighting_type}</p>
                      </div>
                    )}
                    {service.sound_system && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <span className="text-sm">{t('service.soundSystem')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.sound_system}</p>
                      </div>
                    )}
                    {service.stage_setup && (
                      <div className="bg-[#E9EEF4] p-4 rounded-lg">
                        <div className="flex items-center text-gray-600 mb-1">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-sm">{t('service.stageSetup')}</span>
                        </div>
                        <p className="text-xl font-bold text-[#1E2A3A]">{service.stage_setup ? t('common.yes') : t('common.no')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(service.phone || service.email || service.website || service.instagram || service.facebook || service.two_gis_link) && (
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
                        <FaInstagram className="w-5 h-5 mr-3" />
                        @{service.instagram}
                      </a>
                    )}
                    {service.facebook && (
                      <a href={`https://facebook.com/${service.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <span className="mr-3">👤</span>
                        {service.facebook}
                      </a>
                    )}
                    {service.two_gis_link && (
                      <a href={service.two_gis_link} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-[#F4B942] transition">
                        <img src={twogislogo} alt="2GIS" className="w-5 h-5 mr-3" />
                        {t('service.twoGis')}
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
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setReviewData({ ...reviewData, comment: e.target.value });
                        }
                      }}
                      rows="4"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        reviewData.comment.trim().length < 10 && reviewData.comment.length > 0
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#F4B942] focus:border-[#F4B942]'
                      }`}
                      required
                      placeholder={t('service.commentPlaceholder', 'Напишите подробный отзыв (минимум 10 символов)...')}
                      maxLength="500"
                    ></textarea>
                    <div className="flex justify-between items-center mt-1">
                      <div className={`text-xs ${
                        reviewData.comment.trim().length < 10
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }`}>
                        {reviewData.comment.trim().length < 10
                          ? t('service.commentTooShort', `Нужно еще ${10 - reviewData.comment.trim().length} символов`)
                          : t('service.commentValid', 'Комментарий корректный')
                        }
                      </div>
                      <div className="text-xs text-gray-400">
                        {reviewData.comment.length}/500
                      </div>
                    </div>
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
                    {reviews.map((review) => <ReviewCard key={review.id} review={review} onReviewUpdate={handleReviewUpdate} onReviewDelete={handleReviewDelete} />)}
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
                  ? `${service.hourly_rate} ${t('service.currency', 'сом')}/${t('service.hour')}`
                  : service.price_type === 'fixed' && service.price
                  ? `${service.price} ${t('service.currency', 'сом')}`
                  : t('service.negotiable')}
              </div>

              {/* Share Button */}
              <div className="mb-4">
                <button
                  onClick={handleShareClick}
                  className="inline-flex items-center bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  {t('service.share', 'Поделиться')}
                </button>
              </div>

              {/* Edit and Delete Buttons for Owner */}
              {(() => {
                const currentUser = JSON.parse(localStorage.getItem('user'));
                const isOwner = currentUser && service.user && currentUser.id === service.user.id;
                const canEdit = service.status === 'pending' || service.status === 'approved';

                if (isOwner) {
                  return (
                    <div className="mb-4 space-y-3">
                      {canEdit && (
                        <Link
                          to={`/edit-service/${service.id}`}
                          className="inline-flex items-center bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          {t('service.edit', 'Редактировать')}
                        </Link>
                      )}
                      <button
                        onClick={handleDeleteService}
                        className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('service.delete', 'Удалить')}
                      </button>
                      {service.status !== 'archived' ? (
                        <button
                          onClick={handleArchiveService}
                          className="inline-flex items-center bg-yellow-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          {t('service.archive', 'Архивировать')}
                        </button>
                      ) : (
                        <button
                          onClick={handleUnarchiveService}
                          className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {t('service.unarchive', 'Восстановить')}
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })()}

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
                    <div className="flex items-center flex-1">
                      {service.user.avatar && (
                        <img
                          src={service.user.avatar}
                          alt={service.user.first_name || service.user.username}
                          className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-[#F4B942]"
                        />
                      )}
                      <div className="flex-1">
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
                      onClick={() => setContactInitiated(true)}
                      className="block w-full bg-[#F4B942] text-[#1E2A3A] text-center py-3 rounded-lg font-semibold hover:bg-[#e5a832] transition mb-3"
                    >
                      <FaPhone className="w-5 h-5 inline mr-2" /> {t('service.contactProvider')}
                    </a>
                  )}
                </div>
              )}

              {/* Gallery in sidebar */}
              {((service.images && service.images.length > 0) || (service.videos && service.videos.length > 0)) && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('service.gallery', 'Галерея')}
                  </h3>
                  
                  {/* Tabs */}
                  <div className="flex mb-4 bg-[#E9EEF4] rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('photos')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === 'photos'
                          ? 'bg-white text-[#1E2A3A] shadow-sm'
                          : 'text-gray-600 hover:text-[#1E2A3A]'
                      }`}
                    >
                      {t('service.photos', 'Фото')} ({service.images ? service.images.length : 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('videos')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === 'videos'
                          ? 'bg-white text-[#1E2A3A] shadow-sm'
                          : 'text-gray-600 hover:text-[#1E2A3A]'
                      }`}
                    >
                      {t('service.videos', 'Видео')} ({service.videos ? service.videos.length : 0})
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* Images */}
                    {activeTab === 'photos' && service.images && service.images.length > 0 && service.images.map((image, index) => (
                      <div key={`image-${index}`} className="relative group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 aspect-square" onClick={() => openImageModal(index)}>
                        <img
                          src={image}
                          alt={`${service.title} ${index + 1}`}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Failed to load image:', image);
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <div className="backdrop-blur-sm bg-white/20 rounded-full p-3">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                    
                    {/* Videos */}
                    {activeTab === 'videos' && service.videos && service.videos.length > 0 && service.videos.map((video, index) => (
                      <div key={`video-${index}`} className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-500 aspect-square">
                        <video
                          controls
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          poster={service.images && service.images[0] ? service.images[0] : undefined}
                          preload="metadata"
                        >
                          <source src={video} type="video/mp4" />
                          {t('service.videoNotSupported')}
                        </video>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none">
                          <div className="backdrop-blur-sm bg-white/20 rounded-full p-4">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 bg-linear-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          <FaVideo className="w-3 h-3 inline mr-1" />
                          {t('service.video')}
                        </div>
                      </div>
                    ))}
                    
                    {/* No content message */}
                    {activeTab === 'photos' && (!service.images || service.images.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>{t('service.noPhotos', 'Нет фотографий')}</p>
                      </div>
                    )}
                    
                    {activeTab === 'videos' && (!service.videos || service.videos.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p>{t('service.noVideos', 'Нет видео')}</p>
                      </div>
                    )}
                  </div>
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

      {/* Contact Feedback Modal */}
      {showContactFeedback && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white bg-opacity-50 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-[#1E2A3A] mb-4 text-center">
              {t('service.contactSuccess')}
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowContactFeedback(false)}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                {t('service.yes')}
              </button>
              <button
                onClick={() => {
                  setShowContactFeedback(false);
                  navigate('/services');
                }}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                {t('service.no')}
              </button>
            </div>
            <p className="text-center text-gray-600 mt-4 text-sm">
              {t('service.contactFeedback')}
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">
                {t('service.confirmDelete', 'Вы уверены, что хотите удалить эту услугу?')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('service.confirmDeleteDescription', 'Это действие нельзя отменить. Услуга будет удалена навсегда.')}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDeleteService}
                  className="flex-1 bg-gray-200 text-[#1E2A3A] py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  {t('service.cancel', 'Отмена')}
                </button>
                <button
                  onClick={confirmDeleteService}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  {t('service.delete', 'Удалить')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



