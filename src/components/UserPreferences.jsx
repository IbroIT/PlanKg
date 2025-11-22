import { useState, useEffect } from 'react';
import { useCookies } from '../hooks/useCookies';

export default function UserPreferences() {
  const { isAccepted, setCookie, getCookie } = useCookies();
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    // Загружаем сохраненные предпочтения, если cookies разрешены
    if (isAccepted('preferences')) {
      const savedTheme = getCookie('user_theme');
      const savedLanguage = getCookie('user_language');

      if (savedTheme) setTheme(savedTheme);
      if (savedLanguage) setLanguage(savedLanguage);
    }
  }, [isAccepted, getCookie]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (isAccepted('preferences')) {
      setCookie('user_theme', newTheme, 365);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (isAccepted('preferences')) {
      setCookie('user_language', newLanguage, 365);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Пользовательские предпочтения</h3>

      {/* Theme Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Тема оформления
        </label>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4B942] focus:border-[#F4B942]"
        >
          <option value="light">Светлая</option>
          <option value="dark">Темная</option>
          <option value="auto">Автоматически</option>
        </select>
      </div>

      {/* Language Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Язык
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4B942] focus:border-[#F4B942]"
        >
          <option value="ru">Русский</option>
          <option value="ky">Кыргызский</option>
          <option value="en">English</option>
        </select>
      </div>

      {!isAccepted('preferences') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ Предпочтения не будут сохранены, так как cookies предпочтений отключены.
            Вы можете включить их в настройках cookies.
          </p>
        </div>
      )}
    </div>
  );
}