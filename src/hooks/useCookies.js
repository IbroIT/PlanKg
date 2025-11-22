import { useState, useEffect } from 'react';
import { cookieUtils, COOKIE_TYPES } from '../utils/cookies';

export const useCookies = () => {
  const [consent, setConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedConsent = cookieUtils.getConsent();
    setConsent(savedConsent);
    setIsLoading(false);
  }, []);

  const acceptAllCookies = () => {
    const allAccepted = {
      [COOKIE_TYPES.NECESSARY]: true,
      [COOKIE_TYPES.ANALYTICS]: true,
      [COOKIE_TYPES.MARKETING]: true,
      [COOKIE_TYPES.PREFERENCES]: true
    };
    cookieUtils.setConsent(allAccepted);
    setConsent(allAccepted);
    return allAccepted;
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly = {
      [COOKIE_TYPES.NECESSARY]: true,
      [COOKIE_TYPES.ANALYTICS]: false,
      [COOKIE_TYPES.MARKETING]: false,
      [COOKIE_TYPES.PREFERENCES]: false
    };
    cookieUtils.setConsent(necessaryOnly);
    setConsent(necessaryOnly);
    return necessaryOnly;
  };

  const updateConsent = (newConsent) => {
    cookieUtils.setConsent(newConsent);
    setConsent(newConsent);
    return newConsent;
  };

  const isAccepted = (type) => {
    return cookieUtils.isAccepted(type);
  };

  const setCookie = (name, value, days = 365, path = '/') => {
    if (isAccepted(COOKIE_TYPES.NECESSARY) || isAccepted(COOKIE_TYPES.PREFERENCES)) {
      cookieUtils.set(name, value, days, path);
    }
  };

  const getCookie = (name) => {
    return cookieUtils.get(name);
  };

  const removeCookie = (name, path = '/') => {
    cookieUtils.remove(name, path);
  };

  return {
    consent,
    isLoading,
    acceptAllCookies,
    acceptNecessaryOnly,
    updateConsent,
    isAccepted,
    setCookie,
    getCookie,
    removeCookie
  };
};