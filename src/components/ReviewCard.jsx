import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { reviewsAPI } from '../api/reviews';

export default function ReviewCard({ review, onReviewUpdate, onReviewDelete }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    comment: review.comment
  });
  const [loading, setLoading] = useState(false);

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isOwner = currentUser && review.user && currentUser.id === review.user.id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleSaveEdit = async () => {
    // Validation
    if (editData.rating < 1 || editData.rating > 5) {
      alert(t('service.invalidRating', 'Пожалуйста, выберите рейтинг от 1 до 5 звезд'));
      return;
    }

    if (!editData.comment || editData.comment.trim().length < 10) {
      alert(t('service.commentTooShort', 'Комментарий должен содержать минимум 10 символов'));
      return;
    }

    try {
      setLoading(true);
      const updatedReview = await reviewsAPI.updateReview(review.id, {
        rating: editData.rating,
        comment: editData.comment.trim(),
      });
      
      setIsEditing(false);
      if (onReviewUpdate) {
        onReviewUpdate(updatedReview);
      }
      alert(t('reviews.reviewUpdated'));
      // Перезагружаем страницу для обновления данных
      window.location.reload();
    } catch (error) {
      console.error('Error updating review:', error);
      alert(t('reviews.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await reviewsAPI.deleteReview(review.id);
      
      setShowDeleteModal(false);
      if (onReviewDelete) {
        onReviewDelete(review.id);
      }
      alert(t('reviews.reviewDeleted'));
      // Перезагружаем страницу для обновления данных
      window.location.reload();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(t('reviews.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-[#F4B942] fill-current' : 'text-gray-300'
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">
      {/* User Info */}
      <div className="flex items-start mb-4">
        <Link 
          to={`/users/${review.user.id}`}
          className="w-12 h-12 rounded-full bg-[#E9EEF4] flex items-center justify-center mr-4 shrink-0 hover:ring-2 hover:ring-[#F4B942] transition-all duration-300"
        >
          {review.user.avatar ? (
            <img
              src={review.user.avatar}
              alt={review.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-[#1E2A3A] font-semibold text-lg">
              {review.user.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Link 
              to={`/users/${review.user.id}`}
              className="font-semibold text-[#1E2A3A] hover:text-[#F4B942] transition-colors"
            >
              {review.user.first_name || review.user.username}
            </Link>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {formatDate(review.created_at)}
              </span>
              {isOwner && !isEditing && (
                <div className="flex space-x-1">
                  <button
                    onClick={handleEdit}
                    className="text-gray-500 hover:text-[#F4B942] transition-colors p-1"
                    title={t('reviews.edit')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                    title={t('reviews.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Rating Stars */}
          <div className="flex items-center mb-3">
            {isEditing ? (
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditData({ ...editData, rating: star })}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        star <= editData.rating ? 'text-[#F4B942] fill-current' : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </button>
                ))}
              </div>
            ) : (
              renderStars(review.rating)
            )}
          </div>
          {/* Comment */}
          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editData.comment}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setEditData({ ...editData, comment: e.target.value });
                  }
                }}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F4B942] focus:border-[#F4B942] resize-none"
                placeholder={t('service.commentPlaceholder', 'Напишите подробный отзыв...')}
                maxLength="500"
              />
              <div className="flex justify-between items-center mt-1">
                <div className={`text-xs ${
                  editData.comment.trim().length < 10
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}>
                  {editData.comment.trim().length < 10
                    ? t('service.commentTooShort', `Нужно еще ${10 - editData.comment.trim().length} символов`)
                    : t('service.commentValid', 'Комментарий корректный')
                  }
                </div>
                <div className="text-xs text-gray-400">
                  {editData.comment.length}/500
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="bg-[#F4B942] text-[#1E2A3A] px-4 py-2 rounded-lg font-semibold hover:bg-[#e5a832] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#1E2A3A] border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {t('reviews.save')}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-200 text-[#1E2A3A] px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  {t('reviews.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1E2A3A] mb-2">
                {t('reviews.confirmDelete')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('reviews.confirmDeleteMessage')}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 text-[#1E2A3A] py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  {t('reviews.cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    t('reviews.delete')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
