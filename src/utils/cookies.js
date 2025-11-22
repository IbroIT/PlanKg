// Утилита для работы с cookies
export const cookieUtils = {
  // Установка cookie
  set(name, value, days = 365, path = '/') {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`;
  },

  // Получение cookie
  get(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Удаление cookie
  remove(name, path = '/') {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
  },

  // Проверка, приняты ли cookies определенного типа
  isAccepted(type) {
    const consent = this.get('cookieConsent');
    if (!consent) return false;

    try {
      const preferences = JSON.parse(consent);
      return preferences[type] === true;
    } catch {
      return false;
    }
  },

  // Сохранение предпочтений cookies
  setConsent(preferences) {
    this.set('cookieConsent', JSON.stringify(preferences), 365);
  },

  // Получение предпочтений cookies
  getConsent() {
    const consent = this.get('cookieConsent');
    if (!consent) return null;

    try {
      return JSON.parse(consent);
    } catch {
      return null;
    }
  }
};

// Типы cookies
export const COOKIE_TYPES = {
  NECESSARY: 'necessary',
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PREFERENCES: 'preferences'
};

// Настройки cookies по умолчанию
export const DEFAULT_COOKIE_SETTINGS = {
  [COOKIE_TYPES.NECESSARY]: true, // Обязательные cookies всегда true
  [COOKIE_TYPES.ANALYTICS]: false,
  [COOKIE_TYPES.MARKETING]: false,
  [COOKIE_TYPES.PREFERENCES]: false
};