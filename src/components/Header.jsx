import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { isAuthenticated, clearAuthTokens } from '../api/auth';
import LanguageSwitcher from './LanguageSwitcher';
import axios from '../api/axios';

// Импорт иконок для навигации
import { 
  FiGrid, 
  FiHeart, 
  FiPlusCircle, 
  FiUser, 
  FiLogOut, 
  FiLogIn, 
  FiUserPlus,
  FiMenu,
  FiX,
  FiChevronDown,
  FiMapPin,
  FiSearch
} from 'react-icons/fi';

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const categoriesRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    fetchCategories();
    checkMobile();

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      checkMobile();
    };

    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [i18n.language]);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1280);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/categories/?lang=${i18n.language}`);
      const data = response.data.results || response.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleLogout = () => {
    clearAuthTokens();
    setUser(null);
    window.location.href = '/';
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'text-[#F4B942]' : 'text-white';
  };

  // Фильтрация категорий по поисковому запросу
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories?.some(sub =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#1E2A3A]/95 backdrop-blur-xl shadow-2xl py-2 border-b border-white/5' 
          : 'bg-[#1E2A3A] shadow-lg py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-end gap-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105 shrink-0 mr-auto"
          >
            <div className="relative">
              <img src="/logo.png" alt="Plan.kg Logo" className="w-10 h-10 rounded-xl z-10 relative" />
              <div className="absolute -inset-2 bg-[#F4B942]/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-linear-to-r from-white to-[#E9EEF4] bg-clip-text text-transparent">
                Plan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {/* Categories Dropdown */}
            <div 
              ref={categoriesRef}
              className="relative"
            >
              <button 
                onMouseEnter={() => setIsCategoriesOpen(true)}
                className={`group flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:text-[#F4B942] text-white ${isCategoriesOpen ? 'bg-white/10 text-[#F4B942]' : ''}`}
              >
                <FiGrid className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold text-lg">{t('nav.categories', { defaultValue: 'Категории' })}</span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesOpen && categories.length > 0 && (
                <div 
                  className="fixed left-1/2 transform -translate-x-1/2 top-20 bg-white rounded-3xl shadow-2xl border border-gray-100 w-[900px] max-w-[90vw] overflow-hidden animate-fade-in z-50"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                      <h3 className="text-xl font-bold text-[#1E2A3A]">
                        {t('header.allCategories')}
                      </h3>
                      <div className="relative w-64">
                        <FiSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input 
                          type="text" 
                          placeholder={t('header.search')} 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F4B942]/30 focus:border-[#F4B942] text-sm text-gray-800 placeholder-gray-400"
                        />
                      </div>
                    </div>
                    
                    {filteredCategories.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {filteredCategories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <Link
                              to={`/services?category=${category.id}`}
                              className="block p-3 bg-gray-50 rounded-xl group cursor-pointer hover:bg-[#F4B942] transition-all duration-200"
                              onClick={() => {
                                setIsCategoriesOpen(false);
                                setSearchQuery('');
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-[#1E2A3A] group-hover:text-white text-sm">
                                  {category.name}
                                </span>
                                {category.subcategories && category.subcategories.length > 0 && (
                                  <span className="text-xs text-gray-500 group-hover:text-white/80 bg-white/50 group-hover:bg-white/20 px-2 py-0.5 rounded-md">
                                    {category.subcategories.length}
                                  </span>
                                )}
                              </div>
                            </Link>
                            
                            {category.subcategories && category.subcategories.length > 0 && (
                              <ul className="space-y-1 pl-3 border-l-2 border-gray-200">
                                {category.subcategories.slice(0, 4).map((sub) => (
                                  <li key={sub.id}>
                                    <Link
                                      to={`/services?category=${sub.id}`}
                                      className="block px-3 py-2 text-xs text-gray-600 hover:text-[#F4B942] hover:bg-gray-50 rounded-lg transition-all duration-150"
                                      onClick={() => {
                                        setIsCategoriesOpen(false);
                                        setSearchQuery('');
                                      }}
                                    >
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                                {category.subcategories.length > 4 && (
                                  <li>
                                    <Link
                                      to={`/services?category=${category.id}`}
                                      className="block px-3 py-2 text-xs text-[#F4B942] hover:bg-gray-50 rounded-lg transition-all duration-150 font-medium"
                                      onClick={() => {
                                        setIsCategoriesOpen(false);
                                        setSearchQuery('');
                                      }}
                                    >
                                      + {t('header.showMore')} {category.subcategories.length - 4}
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">{t('header.noCategories')}</p>
                        <p className="text-gray-400 text-sm mt-1">{t('header.tryDifferentQuery')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {user && (
              <>
                <Link 
                  to="/favorites" 
                  className={`group flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:text-[#F4B942] ${isActiveLink('/favorites')}`}
                >
                  <FiHeart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold text-lg">{t('nav.favorites')}</span>
                </Link>
                <Link 
                  to="/add-service" 
                  className="group flex items-center space-x-3 bg-linear-to-r from-[#F4B942] to-[#e5a832] text-[#1E2A3A] px-6 py-3 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg border border-[#F4B942]/30"
                >
                  <FiPlusCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-lg">{t('nav.addService')}</span>
                </Link>
              </>
            )}
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden xl:flex items-center space-x-3 shrink-0">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className={`group flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:text-[#F4B942] ${isActiveLink('/profile')}`}
                >
                  <FiUser className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold text-lg">{t('nav.profile')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:bg-red-500/20 hover:text-red-300 text-white"
                >
                  <FiLogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold text-lg">{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`group flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:text-[#F4B942] ${isActiveLink('/login')}`}
                >
                  <FiLogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-semibold text-lg">{t('nav.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="group flex items-center space-x-3 bg-linear-to-r from-[#F4B942] to-[#e5a832] text-[#1E2A3A] px-6 py-3 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg border border-[#F4B942]/30"
                >
                  <FiUserPlus className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-lg">{t('nav.register')}</span>
                </Link>
              </>
            )}
            
            <div className="pl-3">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden relative w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-[#F4B942] text-white hover:text-[#1E2A3A] transition-all duration-300 group backdrop-blur-sm mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6 transition-all duration-300" />
            ) : (
              <FiMenu className="w-6 h-6 transition-all duration-300" />
            )}
            <div className="absolute -inset-1 bg-[#F4B942]/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`xl:hidden overflow-hidden transition-all duration-500 ${
          isMenuOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 space-y-3 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            {/* Categories in Mobile */}
            <div className="space-y-3">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoriesOpen(!isCategoriesOpen);
                }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 mobile-category-button"
              >
                <div className="flex items-center space-x-3">
                  <FiGrid className="w-5 h-5 text-white" />
                  <span className="font-semibold text-lg text-white">{t('nav.categories')}</span>
                </div>
                <FiChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCategoriesOpen && (
                <div 
                  className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10"
                  onClick={(e) => {
                    // Закрываем меню только если клик был на фоне, а не на контенте
                    if (e.target === e.currentTarget) {
                      setIsCategoriesOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Категории</h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCategoriesOpen(false);
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    >
                      <FiX className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="relative mb-4" onClick={(e) => e.stopPropagation()}>
                    <FiSearch className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder={t('header.searchCategories')} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/20 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#F4B942]/50 focus:border-transparent text-white placeholder-white/50"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div 
                    className="space-y-2 max-h-60 overflow-y-auto"
                    onTouchStart={(e) => {
                      setTouchStartY(e.touches[0].clientY);
                      setIsScrolling(false);
                    }}
                    onTouchMove={(e) => {
                      const touchY = e.touches[0].clientY;
                      const deltaY = Math.abs(touchY - touchStartY);
                      if (deltaY > 5) { // Уменьшили порог до 5px для более точного определения прокрутки
                        setIsScrolling(true);
                      }
                    }}
                    onTouchEnd={() => {
                      // Сбрасываем флаг через небольшую задержку
                      setTimeout(() => setIsScrolling(false), 150);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {filteredCategories.map((category, index) => (
                      <div key={category.id} className={`space-y-2 ${index < filteredCategories.length - 1 ? 'border-b border-white/10 pb-3 mb-3' : ''}`}>
                        <Link
                          to={`/services?category=${category.id}`}
                          className="block p-3 rounded-xl hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20 mobile-menu-link"
                          onTouchEnd={(e) => {
                            if (isScrolling) {
                              e.preventDefault();
                              return;
                            }
                            e.preventDefault();
                            setIsMenuOpen(false);
                            setIsCategoriesOpen(false);
                            navigate(`/services?category=${category.id}`);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            setIsCategoriesOpen(false);
                            navigate(`/services?category=${category.id}`);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{category.name}</span>
                          </div>
                        </Link>
                        
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="ml-4 space-y-1 border-l-2 border-white/10 pl-3">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/services?category=${sub.id}`}
                                className="block p-2 text-sm text-white rounded-lg hover:bg-white/10 transition-all duration-200 mobile-menu-link"
                                onTouchEnd={(e) => {
                                  if (isScrolling) {
                                    e.preventDefault();
                                    return;
                                  }
                                  e.preventDefault();
                                  setIsMenuOpen(false);
                                  setIsCategoriesOpen(false);
                                  navigate(`/services?category=${sub.id}`);
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsMenuOpen(false);
                                  setIsCategoriesOpen(false);
                                  navigate(`/services?category=${sub.id}`);
                                }}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {filteredCategories.length === 0 && (
                      <div className="text-center py-4 text-white/70">
                        <FiSearch className="w-8 h-8 mx-auto mb-2 text-white/50" />
                        <p>{t('header.noCategories')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {user && (
              <>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHeart className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-lg text-white">{t('nav.favorites')}</span>
                </Link>
                <Link
                  to="/add-service"
                  className="flex items-center space-x-3 bg-linear-to-r from-[#F4B942] to-[#e5a832] text-[#1E2A3A] p-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 group mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiPlusCircle className="w-5 h-5 text-[#1E2A3A] transition-transform group-hover:scale-110" />
                  <span className="text-lg text-white">{t('nav.addService')}</span>
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-lg text-white">{t('nav.profile')}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl hover:bg-red-500/20 transition-all duration-300 group text-left"
                >
                  <FiLogOut className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-lg text-white">{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiLogIn className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-lg text-white">{t('nav.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 bg-linear-to-r from-[#F4B942] to-[#e5a832] text-[#1E2A3A] p-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 group mobile-menu-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUserPlus className="w-5 h-5 text-[#1E2A3A] transition-transform group-hover:scale-110" />
                  <span className="text-lg text-white">{t('nav.register')}</span>
                </Link>
              </>
            )}
            
            <div className="pt-4 border-t border-white/20">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Mobile touch improvements */
        @media (max-width: 1279px) {
          .mobile-menu-button {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .mobile-menu-link {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .mobile-category-button {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
        }
      `}</style>
    </header>
  );
}