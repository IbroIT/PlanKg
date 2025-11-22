# Система управления Cookies в PlanKg

## Обзор

В приложении PlanKg реализована комплексная система управления cookies, которая обеспечивает соответствие требованиям GDPR и других стандартов приватности.

## Компоненты системы

### 1. CookieBanner (`src/components/CookieBanner.jsx`)
Баннер согласия с cookies, который отображается при первом посещении сайта.

**Функции:**
- Проверка согласия пользователя
- Возможность принять все cookies или только необходимые
- Кнопка для открытия детальных настроек
- Сохранение предпочтений в localStorage

### 2. CookieSettings (`src/components/CookieSettings.jsx`)
Модальное окно с детальными настройками cookies.

**Типы cookies:**
- **Необходимые** - обязательные для работы сайта (нельзя отключить)
- **Аналитические** - для сбора статистики (Google Analytics, Yandex Metrika)
- **Маркетинговые** - для персонализированной рекламы
- **Предпочтений** - для сохранения пользовательских настроек

### 3. CookiePolicy (`src/pages/CookiePolicy.jsx`)
Страница с подробной информацией о политике использования cookies.

### 4. Утилиты cookies (`src/utils/cookies.js`)
Набор функций для работы с cookies:
- `set()`, `get()`, `remove()` - базовые операции
- `isAccepted(type)` - проверка согласия на определенный тип
- `setConsent()`, `getConsent()` - управление предпочтениями

### 5. Хук useCookies (`src/hooks/useCookies.js`)
React хук для удобной работы с cookies в компонентах.

## Использование в коде

### Базовое использование cookies

```jsx
import { useCookies } from '../hooks/useCookies';

function MyComponent() {
  const { setCookie, getCookie, isAccepted } = useCookies();

  const savePreference = () => {
    if (isAccepted('preferences')) {
      setCookie('user_theme', 'dark', 365);
    }
  };

  return <button onClick={savePreference}>Сохранить тему</button>;
}
```

### Проверка согласия перед использованием сервисов

```jsx
import { useCookies } from '../hooks/useCookies';
import { COOKIE_TYPES } from '../utils/cookies';

function AnalyticsComponent() {
  const { isAccepted } = useCookies();

  useEffect(() => {
    if (isAccepted(COOKIE_TYPES.ANALYTICS)) {
      // Инициализация Google Analytics
      gtag('config', 'GA_MEASUREMENT_ID');
    }
  }, [isAccepted]);

  return null;
}
```

### Сохранение пользовательских предпочтений

```jsx
import { useCookies } from '../hooks/useCookies';

function UserPreferences() {
  const { isAccepted, setCookie, getCookie } = useCookies();
  const [theme, setTheme] = useState(getCookie('theme') || 'light');

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (isAccepted('preferences')) {
      setCookie('theme', newTheme, 365);
    }
  };

  return (
    <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
      <option value="light">Светлая</option>
      <option value="dark">Темная</option>
    </select>
  );
}
```

## Интеграция с аналитикой

### Google Analytics

```jsx
// В компоненте App.jsx или отдельном компоненте
import { useCookies } from './hooks/useCookies';
import { COOKIE_TYPES } from './utils/cookies';

function GoogleAnalytics() {
  const { isAccepted } = useCookies();

  useEffect(() => {
    if (isAccepted(COOKIE_TYPES.ANALYTICS)) {
      // Загрузка Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    }
  }, [isAccepted]);

  return null;
}
```

### Yandex Metrika

```jsx
function YandexMetrika() {
  const { isAccepted } = useCookies();

  useEffect(() => {
    if (isAccepted(COOKIE_TYPES.ANALYTICS)) {
      // Инициализация Yandex Metrika
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(YANDEX_COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
      });
    }
  }, [isAccepted]);

  return null;
}
```

## Добавление новых типов cookies

1. Добавьте новый тип в `COOKIE_TYPES` в `src/utils/cookies.js`
2. Обновите `DEFAULT_COOKIE_SETTINGS`
3. Добавьте секцию в `CookieSettings.jsx`
4. Обновите `CookiePolicy.jsx`

## Тестирование

### Проверка работы баннера
1. Очистите localStorage браузера
2. Перезагрузите страницу
3. Проверьте отображение баннера

### Проверка настроек
1. Нажмите "Настроить" в баннере
2. Проверьте работу чекбоксов
3. Проверьте сохранение настроек

### Проверка сохранения предпочтений
1. Включите cookies предпочтений
2. Измените какие-либо настройки
3. Перезагрузите страницу
4. Проверьте, сохранились ли настройки

## Соответствие стандартам

Система разработана с учетом требований:
- GDPR (Общий регламент по защите данных)
- CCPA (Калифорнийский закон о защите потребителей)
- Стандарты IAB Transparency & Consent Framework

## Поддержка

При возникновении вопросов по работе системы cookies обращайтесь к разработчикам проекта.