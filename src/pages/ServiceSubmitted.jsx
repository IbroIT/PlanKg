import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ServiceSubmitted() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9EEF4] via-white to-[#E9EEF4] flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F4B942] to-[#e5a832]"></div>
          
          {/* Animated Success Icon */}
          <div className="mb-8">
            <div className="relative inline-block">
              {/* Outer Circle */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                {/* Inner Circle */}
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg 
                    className="w-10 h-10 text-white transform scale-0 animate-scaleIn" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Floating Particles */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#F4B942] rounded-full opacity-0 animate-float"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#F4B942] rounded-full opacity-0 animate-float" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-[#1E2A3A] mb-4 bg-gradient-to-r from-[#1E2A3A] to-[#2a3f54] bg-clip-text text-transparent">
            {t('serviceSubmitted.title', { defaultValue: 'Заявка успешно отправлена!' })}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed text-lg">
            {t('serviceSubmitted.message', { 
              defaultValue: 'Спасибо за добавление объявления! Ваша заявка отправлена на модерацию. Мы проверим её в течение 24 часов и опубликуем после одобрения.' 
            })}
          </p>

          {/* Time Info Card */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-center text-amber-800">
              <div className="relative">
                <svg className="w-6 h-6 mr-3 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <span className="font-semibold text-sm">
                  {t('serviceSubmitted.timeframe', { defaultValue: 'Время обработки:' })}
                </span>
                <p className="text-xs text-amber-600 mt-1">
                  {t('serviceSubmitted.timeframeDetail', { defaultValue: 'Обычно до 24 часов' })}
                </p>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="flex items-center justify-center text-sm text-gray-500 mb-8 p-3 bg-[#E9EEF4] rounded-lg">
            <svg className="w-5 h-5 mr-2 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>
              {t('serviceSubmitted.statusInfo', { 
                defaultValue: 'Статус заявки можно отслеживать в личном кабинете' 
              })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/profile"
              className="group block w-full bg-gradient-to-r from-[#F4B942] to-[#e5a832] text-[#1E2A3A] px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                {t('serviceSubmitted.viewProfile', { defaultValue: 'Перейти в профиль' })}
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/"
              className="group block w-full bg-white border-2 border-[#1E2A3A] text-[#1E2A3A] px-8 py-4 rounded-xl font-bold hover:bg-[#1E2A3A] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              <span className="flex items-center justify-center">
                {t('serviceSubmitted.goHome', { defaultValue: 'На главную' })}
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-center text-gray-600 mb-3">
              <svg className="w-5 h-5 mr-2 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-[#1E2A3A]">
                {t('serviceSubmitted.needHelp', { defaultValue: 'Нужна помощь?' })}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              {t('serviceSubmitted.contactText', { defaultValue: 'Мы всегда готовы ответить на ваши вопросы' })}
            </p>
            <a 
              href="mailto:support@plan.kg" 
              className="inline-flex items-center text-[#F4B942] font-semibold hover:text-[#e5a832] transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t('serviceSubmitted.contactUs', { defaultValue: 'support@plan.kg' })}
            </a>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-[#F4B942] rounded-full animate-pulse"></div>
            <span>{t('serviceSubmitted.moderationInProgress', { defaultValue: 'Модерация в процессе' })}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-10px) scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}