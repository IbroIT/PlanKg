import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cookieUtils, COOKIE_TYPES } from '../utils/cookies';

export default function CookieBanner() {
  const { t } = useTranslation();
  const banner = t('cookieBanner', { returnObjects: true });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, принял ли пользователь cookies ранее
    const consent = cookieUtils.getConsent();
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAllCookies = () => {
    const allAccepted = {
      [COOKIE_TYPES.NECESSARY]: true,
      [COOKIE_TYPES.ANALYTICS]: true,
      [COOKIE_TYPES.MARKETING]: true,
      [COOKIE_TYPES.PREFERENCES]: true
    };
    cookieUtils.setConsent(allAccepted);
    setIsVisible(false);
    enableServices(allAccepted);
  };

  const declineAllCookies = () => {
    const allDeclined = {
      [COOKIE_TYPES.NECESSARY]: true, // Обязательные остаются
      [COOKIE_TYPES.ANALYTICS]: false,
      [COOKIE_TYPES.MARKETING]: false,
      [COOKIE_TYPES.PREFERENCES]: false
    };
    cookieUtils.setConsent(allDeclined);
    setIsVisible(false);
  };

  // Функции для активации сервисов
  const enableServices = (preferences) => {
    if (preferences[COOKIE_TYPES.ANALYTICS]) {
      enableAnalytics();
    }
    if (preferences[COOKIE_TYPES.MARKETING]) {
      enableMarketing();
    }
  };

  const enableAnalytics = () => {
    console.log('Analytics enabled');
    // Здесь можно инициализировать Google Analytics
    // window.gtag && window.gtag('consent', 'update', { analytics_storage: 'granted' });
  };

  const enableMarketing = () => {
    console.log('Marketing enabled');
    // Здесь можно инициализировать маркетинговые пиксели
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-[#1E2A3A] to-[#0f1724] text-white p-6 shadow-2xl border-t-2 border-[#F4B942] z-50">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Cookie Icon and Content */}
          <div className="flex items-start gap-4 flex-1">
            <div className="shrink-0">
              <svg className="w-8 h-8 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#F4B942] mb-2">
                {banner.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {banner.description}
              </p>
              <a
                href="/cookies"
                className="inline-block text-[#F4B942] hover:text-white text-sm font-medium mt-2 transition-colors underline"
              >
                {banner.learnMore}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={declineAllCookies}
              className="px-6 py-2 bg-transparent border border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400 transition-all duration-300 rounded-lg text-sm font-medium"
            >
              {banner.decline}
            </button>
            <button
              onClick={acceptAllCookies}
              className="px-6 py-2 bg-[#F4B942] hover:bg-[#e6a839] text-[#1E2A3A] font-bold transition-all duration-300 rounded-lg text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {banner.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}