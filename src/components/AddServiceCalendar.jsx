import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function AddServiceCalendar({ availability, setAvailability }) {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const toggleAvailability = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingAvailability = getAvailabilityForDate(date);

    if (existingAvailability) {
      // Update existing availability - toggle between available (true) and booked (false)
      const newAvailability = !existingAvailability.is_available;
      setAvailability(prev =>
        prev.map(item =>
          item.date === dateStr
            ? { ...item, is_available: newAvailability }
            : item
        )
      );
    } else {
      // Create new availability - start as booked (false)
      setAvailability(prev => [...prev, {
        date: dateStr,
        is_available: false // Start as booked (red)
      }]);
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
    t('calendar.january', 'Январь'),
    t('calendar.february', 'Февраль'),
    t('calendar.march', 'Март'),
    t('calendar.april', 'Апрель'),
    t('calendar.may', 'Май'),
    t('calendar.june', 'Июнь'),
    t('calendar.july', 'Июль'),
    t('calendar.august', 'Август'),
    t('calendar.september', 'Сентябрь'),
    t('calendar.october', 'Октябрь'),
    t('calendar.november', 'Ноябрь'),
    t('calendar.december', 'Декабрь')
  ];

  const dayNames = [
    t('calendar.sunday', 'Вс'),
    t('calendar.monday', 'Пн'),
    t('calendar.tuesday', 'Вт'),
    t('calendar.wednesday', 'Ср'),
    t('calendar.thursday', 'Чт'),
    t('calendar.friday', 'Пт'),
    t('calendar.saturday', 'Сб')
  ];

  return (
    <div>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h4 className="text-lg font-semibold text-[#1E2A3A]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>

        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {dayNames.map((day, index) => (
          <div key={index} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="p-2"></div>;
          }

          const availabilityInfo = getAvailabilityForDate(date);
          const isPast = isPastDate(date);
          const today = isToday(date);

          let cellClass = 'p-2 text-center text-sm cursor-pointer transition relative ';
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
            cellClass += ' ring-2 ring-[#F4B942]';
          }

          if (!isPast) {
            cellClass += ' hover:scale-105';
          }

          return (
            <div
              key={index}
              className={cellClass}
              onClick={() => !isPast && toggleAvailability(date)}
              title={!isPast ? t('calendar.clickToToggle', 'Нажмите чтобы изменить статус') : ''}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          <strong>Как работает календарь:</strong>
        </p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Первый клик по дате - отмечает как <span className="text-red-600 font-semibold">занято</span> (красный цвет)</li>
          <li>• Второй клик по дате - отмечает как <span className="text-green-600 font-semibold">свободно</span> (зеленый цвет)</li>
          <li>• Серый цвет - нет информации о доступности</li>
        </ul>
      </div>
    </div>
  );
}