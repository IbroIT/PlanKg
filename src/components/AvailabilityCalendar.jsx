import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { servicesAPI } from '../api/services';
import { isAuthenticated } from '../api/auth';

export default function AvailabilityCalendar({ service, onAvailabilityChange }) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDates, setLoadingDates] = useState(new Set());
  const [editingMode, setEditingMode] = useState(false);

  useEffect(() => {
    if (service?.id) {
      loadAvailability();
    }
  }, [service?.id]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await servicesAPI.getAvailability(service.id);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getAvailabilityForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availability.find(item => item.date === dateStr);
  };

  const toggleAvailability = async (date) => {
    if (!isAuthenticated() || !editingMode) return;

    const dateStr = date.toISOString().split('T')[0];
    const existingAvailability = getAvailabilityForDate(date);

    // Add this date to loading state
    setLoadingDates(prev => new Set(prev).add(dateStr));

    try {
      if (existingAvailability) {
        // Update existing availability
        const newAvailability = !existingAvailability.is_available;
        await servicesAPI.updateAvailability(existingAvailability.id, {
          is_available: newAvailability
        });
        setAvailability(prev =>
          prev.map(item =>
            item.id === existingAvailability.id
              ? { ...item, is_available: newAvailability }
              : item
          )
        );
      } else {
        // Create new availability
        const newAvailability = await servicesAPI.createAvailability({
          service: service.id,
          date: dateStr,
          is_available: false // Start as booked (red)
        });
        setAvailability(prev => [...prev, newAvailability]);
      }

      if (onAvailabilityChange) {
        onAvailabilityChange();
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    } finally {
      // Remove this date from loading state
      setLoadingDates(prev => {
        const newSet = new Set(prev);
        newSet.delete(dateStr);
        return newSet;
      });
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    t('calendar.january', 'January'),
    t('calendar.february', 'February'),
    t('calendar.march', 'March'),
    t('calendar.april', 'April'),
    t('calendar.may', 'May'),
    t('calendar.june', 'June'),
    t('calendar.july', 'July'),
    t('calendar.august', 'August'),
    t('calendar.september', 'September'),
    t('calendar.october', 'October'),
    t('calendar.november', 'November'),
    t('calendar.december', 'December')
  ];

  const dayNames = [
    t('calendar.sunday', 'Sun'),
    t('calendar.monday', 'Mon'),
    t('calendar.tuesday', 'Tue'),
    t('calendar.wednesday', 'Wed'),
    t('calendar.thursday', 'Thu'),
    t('calendar.friday', 'Fri'),
    t('calendar.saturday', 'Sat')
  ];

  // Check if user is the owner of the service
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isOwner = currentUser && service?.user && currentUser.id === service.user.id;

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 gap-3 sm:gap-0">
        <h3 className="text-lg md:text-xl font-semibold text-[#1E2A3A]">
          {t('service.availabilityCalendar', 'Календарь доступности')}
        </h3>
        {isOwner && (
          <button
            type="button"
            onClick={() => setEditingMode(!editingMode)}
            className={`px-3 md:px-4 py-2 md:py-2 rounded-lg font-medium transition text-sm md:text-base ${
              editingMode
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#F4B942] text-[#1E2A3A] hover:bg-[#e5a832]'
            }`}
          >
            {editingMode ? t('calendar.stopEditing', 'Stop editing') : t('calendar.editCalendar', 'Edit calendar')}
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
          <span>{t('calendar.available', 'Available')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
          <span>{t('calendar.booked', 'Booked')}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-100 border border-gray-300 rounded mr-2"></div>
          <span>{t('calendar.noInfo', 'No info')}</span>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className="p-2 md:p-2 hover:bg-gray-100 rounded-lg transition touch-manipulation"
        >
          <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h4 className="text-base md:text-lg font-semibold text-[#1E2A3A] px-2">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>

        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className="p-2 md:p-2 hover:bg-gray-100 rounded-lg transition touch-manipulation"
        >
          <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-3 md:mb-4">
        {dayNames.map((day, index) => (
          <div key={index} className="p-1 md:p-2 text-center text-xs md:text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-1 md:p-2"></div>;
          }

          const availabilityInfo = getAvailabilityForDate(date);
          const isPast = isPastDate(date);
          const today = isToday(date);
          const dateStr = date.toISOString().split('T')[0];
          const isLoading = loadingDates.has(dateStr);

          let cellClass = 'p-1 md:p-2 text-center text-xs md:text-sm cursor-pointer transition relative touch-manipulation ';
          let cellStyle = {};

          if (isPast) {
            cellClass += 'text-gray-400 bg-gray-50 cursor-not-allowed';
          } else if (availabilityInfo) {
            if (availabilityInfo.is_available) {
              cellClass += 'bg-green-100 border border-green-300 text-green-800 hover:bg-green-200';
            } else {
              cellClass += 'bg-red-100 border border-red-300 text-red-800 hover:bg-red-200';
            }
          } else {
            cellClass += 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200';
          }

          if (today) {
            cellClass += ' ring-1 md:ring-2 ring-[#F4B942]';
          }

          if (editingMode && !isPast && isOwner && !isLoading) {
            cellClass += ' hover:scale-105 active:scale-95';
          }

          if (isLoading) {
            cellClass += ' cursor-not-allowed';
          }

          return (
            <div
              key={index}
              className={cellClass}
              onClick={() => !isPast && editingMode && isOwner && !isLoading && toggleAvailability(date)}
              title={editingMode && !isPast && isOwner ? t('calendar.clickToToggle', 'Click to toggle status') : ''}
            >
              {date.getDate()}
              {isLoading && editingMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded">
                  <div className="w-2 h-2 md:w-3 md:h-3 border-2 border-[#F4B942] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editingMode && (
        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm md:text-sm text-blue-800 mb-2 font-medium">
            <strong>{t('calendar.howItWorks', 'How the calendar works:')}</strong>
          </p>
          <ul className="text-xs md:text-sm text-blue-800 space-y-1">
            <li>• {t('calendar.firstClick', 'First click - booked (red)')} <span className="text-red-600 font-semibold">{t('calendar.booked', 'booked')}</span> ({t('calendar.redColor', 'red color')})</li>
            <li>• {t('calendar.secondClick', 'Second click - available (green)')} <span className="text-green-600 font-semibold">{t('calendar.available', 'available')}</span> ({t('calendar.greenColor', 'green color')})</li>
            <li>• {t('calendar.grayColor', 'Gray - no information')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}