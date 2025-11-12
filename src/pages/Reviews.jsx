import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { reviewsAPI } from '../api/reviews';

export default function Reviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [statistics, setStatistics] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });

  useEffect(() => {
    fetchReviews();
  }, [activeFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Получаем все отзывы
      const data = await reviewsAPI.getServiceReviews('');
      
      // Преобразуем данные в нужный формат
      const formattedReviews = data.map(review => ({
        id: review.id,
        date: new Date(review.created_at).toLocaleDateString('ru-RU'),
        rating: review.rating,
        text: review.comment,
        author: review.user?.username || review.user?.email || 'Пользователь',
        service: review.service
      }));

      setReviews(formattedReviews);
      
      // Расчет статистики
      const total = formattedReviews.length;
      if (total > 0) {
        const avgRating = formattedReviews.reduce((sum, r) => sum + r.rating, 0) / total;
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        formattedReviews.forEach(r => distribution[r.rating]++);
        
        setStatistics({
          totalReviews: total,
          averageRating: avgRating.toFixed(1),
          ratingDistribution: distribution
        });
      }
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-[#F4B942] fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderRatingBar = (stars, count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 w-16">
          <span className="text-sm text-[#1E2A3A] font-medium">{stars}</span>
          <svg className="w-4 h-4 text-[#F4B942] fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="flex-1 h-1.5 bg-[#E9EEF4] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#F4B942] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 w-8">{count}</span>
      </div>
    );
  };

  const filters = [
    { id: 'all', label: 'Все', count: 2 },
    { id: 'cleaning', label: 'Уборка, клининг, домработницы', count: 2 }
  ];

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4" style={{ maxWidth: '1200px' }}>
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#1E2A3A]">Отзывы</h1>
          <Link 
            to="/reviews/all" 
            className="text-sm text-[#1E2A3A] hover:text-[#2E3F54] hover:underline transition-colors"
          >
            Смотреть все отзывы
          </Link>
        </div>

        {/* Фильтры */}
        <div className="flex items-center space-x-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 font-medium text-sm ${
                activeFilter === filter.id
                  ? 'bg-[#1E2A3A] text-white shadow-lg'
                  : 'bg-white text-[#1E2A3A] border border-[#E9EEF4] hover:bg-[#E9EEF4]'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Блок статистики */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <p className="text-sm text-gray-500 mb-4">
                  {statistics.totalReviews} {statistics.totalReviews === 1 ? 'оценка' : 'оценки'}
                </p>
                
                <div className="flex items-center space-x-4 mb-6">
                  <svg className="w-16 h-16 text-[#F4B942] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-5xl font-bold text-[#1E2A3A]">{statistics.averageRating}</span>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars}>
                      {renderRatingBar(stars, statistics.ratingDistribution[stars], statistics.totalReviews)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Карточки отзывов */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-sm text-gray-500">{review.date}</p>
                    {renderStars(review.rating)}
                  </div>

                  <div className="space-y-3">
                    <p className={`text-[#1E2A3A] leading-relaxed ${
                      !expandedReviews.has(review.id) ? 'line-clamp-3' : ''
                    }`}>
                      {review.text}
                    </p>

                    {review.text.length > 150 && (
                      <button
                        onClick={() => toggleReviewExpansion(review.id)}
                        className="flex items-center space-x-2 text-[#1E2A3A] hover:text-[#2E3F54] hover:underline text-sm font-medium transition-colors"
                      >
                        <span>{expandedReviews.has(review.id) ? 'Скрыть' : 'Показать еще'}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-300 ${
                            expandedReviews.has(review.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    {review.author && (
                      <p className="text-sm text-gray-600 italic mt-4">— {review.author}</p>
                    )}
                  </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[#E9EEF4] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1E2A3A] mb-2">Отзывов пока нет</h3>
                  <p className="text-gray-600">Будьте первым, кто оставит отзыв!</p>
                </div>
              )}

              {/* Пагинация */}
              {reviews.length > 0 && (
                <div className="flex justify-center items-center space-x-2 pt-8">
                  <button className="w-10 h-10 rounded-full bg-white border border-[#E9EEF4] text-[#1E2A3A] hover:bg-[#1E2A3A] hover:text-white transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button className="w-10 h-10 rounded-full bg-[#1E2A3A] text-white font-medium">1</button>
                  <button className="w-10 h-10 rounded-full bg-white border border-[#E9EEF4] text-[#1E2A3A] hover:bg-[#1E2A3A] hover:text-white transition-colors duration-300 font-medium">2</button>
                  <button className="w-10 h-10 rounded-full bg-white border border-[#E9EEF4] text-[#1E2A3A] hover:bg-[#1E2A3A] hover:text-white transition-colors duration-300 font-medium">3</button>
                  
                  <button className="w-10 h-10 rounded-full bg-white border border-[#E9EEF4] text-[#1E2A3A] hover:bg-[#1E2A3A] hover:text-white transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
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
