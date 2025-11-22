import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cookieUtils, COOKIE_TYPES, DEFAULT_COOKIE_SETTINGS } from '../utils/cookies';

export default function CookieSettings({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(DEFAULT_COOKIE_SETTINGS);

  useEffect(() => {
    if (isOpen) {
      const savedSettings = cookieUtils.getConsent();
      if (savedSettings) {
        setSettings({ ...DEFAULT_COOKIE_SETTINGS, ...savedSettings });
      }
    }
  }, [isOpen]);

  const handleSettingChange = (type, value) => {
    if (type === COOKIE_TYPES.NECESSARY) return; // Обязательные cookies нельзя отключить
    setSettings(prev => ({ ...prev, [type]: value }));
  };

  const saveSettings = () => {
    cookieUtils.setConsent(settings);
    onClose();

    // Здесь можно добавить логику активации/деактивации сервисов
    if (settings[COOKIE_TYPES.ANALYTICS]) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    if (settings[COOKIE_TYPES.MARKETING]) {
      enableMarketing();
    } else {
      disableMarketing();
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      [COOKIE_TYPES.NECESSARY]: true,
      [COOKIE_TYPES.ANALYTICS]: true,
      [COOKIE_TYPES.MARKETING]: true,
      [COOKIE_TYPES.PREFERENCES]: true
    };
    setSettings(allAccepted);
    cookieUtils.setConsent(allAccepted);
    onClose();
    enableAnalytics();
    enableMarketing();
  };

  const declineAll = () => {
    const allDeclined = {
      [COOKIE_TYPES.NECESSARY]: true, // Обязательные остаются
      [COOKIE_TYPES.ANALYTICS]: false,
      [COOKIE_TYPES.MARKETING]: false,
      [COOKIE_TYPES.PREFERENCES]: false
    };
    setSettings(allDeclined);
    cookieUtils.setConsent(allDeclined);
    onClose();
    disableAnalytics();
    disableMarketing();
  };

  // Функции для управления аналитикой и маркетингом
  const enableAnalytics = () => {
    // Здесь можно инициализировать Google Analytics, Yandex Metrika и т.д.
    console.log('Analytics enabled');
    // Пример: gtag('consent', 'update', { analytics_storage: 'granted' });
  };

  const disableAnalytics = () => {
    console.log('Analytics disabled');
    // Пример: gtag('consent', 'update', { analytics_storage: 'denied' });
  };

  const enableMarketing = () => {
    console.log('Marketing enabled');
    // Здесь можно инициализировать маркетинговые пиксели, рекламу и т.д.
  };

  const disableMarketing = () => {
    console.log('Marketing disabled');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-[#1E2A3A] to-[#0f1724] text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
              </svg>
              <h2 className="text-2xl font-bold">Настройки Cookies</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Necessary Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Необходимые Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Эти cookies необходимы для правильной работы сайта. Они обеспечивают базовую функциональность,
                  такую как безопасность, навигация и доступ к защищенным областям сайта.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={settings[COOKIE_TYPES.NECESSARY]}
                  disabled
                  className="w-5 h-5 text-[#F4B942] bg-gray-100 border-gray-300 rounded focus:ring-[#F4B942] cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-gray-500">Обязательно</span>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Аналитические Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Эти cookies помогают нам понять, как посетители взаимодействуют с сайтом,
                  собирая анонимную информацию для статистики и улучшения пользовательского опыта.
                </p>
              </div>
              <label className="ml-4 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[COOKIE_TYPES.ANALYTICS]}
                  onChange={(e) => handleSettingChange(COOKIE_TYPES.ANALYTICS, e.target.checked)}
                  className="w-5 h-5 text-[#F4B942] bg-gray-100 border-gray-300 rounded focus:ring-[#F4B942]"
                />
              </label>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Маркетинговые Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Эти cookies используются для показа релевантной рекламы и маркетингового контента.
                  Они могут отслеживать ваши посещения различных сайтов.
                </p>
              </div>
              <label className="ml-4 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[COOKIE_TYPES.MARKETING]}
                  onChange={(e) => handleSettingChange(COOKIE_TYPES.MARKETING, e.target.checked)}
                  className="w-5 h-5 text-[#F4B942] bg-gray-100 border-gray-300 rounded focus:ring-[#F4B942]"
                />
              </label>
            </div>
          </div>

          {/* Preferences Cookies */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cookies предпочтений
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Эти cookies позволяют сайту запоминать ваши предпочтения и настройки,
                  такие как язык, регион или персонализированные параметры отображения.
                </p>
              </div>
              <label className="ml-4 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[COOKIE_TYPES.PREFERENCES]}
                  onChange={(e) => handleSettingChange(COOKIE_TYPES.PREFERENCES, e.target.checked)}
                  className="w-5 h-5 text-[#F4B942] bg-gray-100 border-gray-300 rounded focus:ring-[#F4B942]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={declineAll}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-colors rounded-lg text-sm"
            >
              Отклонить все
            </button>
            <button
              onClick={acceptAll}
              className="px-6 py-2 bg-[#F4B942] hover:bg-[#e6a839] text-[#1E2A3A] font-bold transition-colors rounded-lg text-sm"
            >
              Принять все
            </button>
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-[#1E2A3A] hover:bg-[#2A3B4A] text-white font-medium transition-colors rounded-lg text-sm"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}