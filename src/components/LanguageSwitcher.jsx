import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiChevronDown, FiCheck } from 'react-icons/fi';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'ru', name: 'Русский', nativeName: 'Русский' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'kg', name: 'Кыргызча', nativeName: 'Кыргызча' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-3 px-4 py-3 rounded-2xl bg-white/10 hover:bg-[#F4B942] text-white hover:text-[#1E2A3A] transition-all duration-300 shadow-md min-w-[60px] justify-center backdrop-blur-sm border border-white/10"
      >
        <FiGlobe className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
        <span className="font-semibold text-sm hidden lg:block">
          {currentLanguage.code.toUpperCase()}
        </span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-dropdown">
          <div className="p-4">
            <div className="px-3 py-2 mb-2 border-b border-white/10">
              <h3 className="text-lg font-bold text-[#1E2A3A] flex items-center space-x-2">
                <FiGlobe className="w-5 h-5" />
                <span>Выберите язык</span>
              </h3>
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                  i18n.language === lang.code 
                    ? 'bg-gradient-to-r from-[#F4B942] to-[#F4B942]/20 text-[#1E2A3A] shadow-lg' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  i18n.language === lang.code 
                    ? 'bg-[#1E2A3A] text-white' 
                    : 'bg-[#E9EEF4] group-hover:bg-[#F4B942] group-hover:text-[#1E2A3A]'
                }`}>
                  <span className="font-bold text-sm">{lang.code.toUpperCase()}</span>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <span className="font-semibold text-left">{lang.name}</span>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700">
                    {lang.nativeName}
                  </span>
                </div>
                {i18n.language === lang.code && (
                  <FiCheck className="w-5 h-5 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}