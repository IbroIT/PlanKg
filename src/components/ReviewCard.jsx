import { Link } from 'react-router-dom';

export default function ReviewCard({ review }) {
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
            <span className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </span>
          </div>
          
          {/* Rating Stars */}
          <div className="flex mb-3">
            {renderStars(review.rating)}
          </div>
          
          {/* Comment */}
          <p className="text-gray-700 leading-relaxed">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
