import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicesAPI } from '../api/services';
import Logo from '/logo.png';
// Deep Blue Particle Background
const DeepBlueBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 40;
    
    class Particle {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = `rgba(244, 185, 66, ${this.opacity})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.fillStyle = '#1E2A3A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      particles.forEach((particle, index) => {
        particles.forEach((particle2, index2) => {
          if (index !== index2) {
            const dx = particle.x - particle2.x;
            const dy = particle.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(244, 185, 66, ${0.08 * (1 - distance / 120)})`;
              ctx.lineWidth = 0.3;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.stroke();
            }
          }
        });
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

// Geometric Pattern Overlay
const GeometricPattern = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
      {/* Hexagon pattern */}
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(244, 185, 66, 0.1) 2px, transparent 0),
            radial-gradient(circle at 75% 75%, rgba(244, 185, 66, 0.1) 2px, transparent 0)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: '0 0, 40px 40px'
        }}
      />
      
      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-linear-to-r from-transparent via-[#F4B942] to-transparent"
            style={{
              top: `${(i * 15) % 100}%`,
              left: '0',
              width: '100%',
              animation: `slideRight ${20 + i * 3}s linear infinite`,
              animationDelay: `${i * 1}s`,
              opacity: 0.05
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Floating Amber Elements
const FloatingAmberElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden md:block">
      {/* Large amber glow */}
      <div className="absolute top-1/3 -left-40 w-80 h-80">
        <div className="absolute w-full h-full bg-[#F4B942] rounded-full blur-3xl opacity-5 animate-pulse-slow" />
      </div>
      
      <div className="absolute bottom-1/3 -right-40 w-96 h-96">
        <div className="absolute w-full h-full bg-[#F4B942] rounded-full blur-3xl opacity-5 animate-pulse-medium" />
      </div>
      
      {/* Small floating amber dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-[#F4B942] rounded-full opacity-20"
          style={{
            left: `${15 + (i * 15)}%`,
            top: `${10 + (i * 12) % 70}%`,
            animation: `floatAmber ${15 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 1.5}s`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};

// Animated Icon Component
const AnimatedCategoryIcon = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderIcon = () => {
    if (category.icon && typeof category.icon === 'string') {
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      
      if (emojiRegex.test(category.icon)) {
        return (
          <div className={`text-3xl transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}>
            {category.icon}
          </div>
        );
      }
      
      return (
        <div className="relative">
          <img 
            src={category.icon} 
            alt={category.name} 
            className={`w-10 h-10 object-cover rounded-xl transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <svg 
            className="w-10 h-10 hidden" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      );
    }

    return (
      <svg 
        className={`w-10 h-10 transition-all duration-500 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    );
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {renderIcon()}
    </div>
  );
};

// Animated Category Card
const CategoryCard = ({ category, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`opacity-0 transform translate-y-8 ${
        isVisible ? 'animate-fade-in-up' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link
        to={`/services?category=${category.id}`}
        className="group relative block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#F4B942] transform hover:-translate-y-2 h-56 md:h-64"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Amber glow effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-linear-to-br from-[#F4B942]/5 to-transparent rounded-2xl"></div>
        )}

        <div className="relative p-6 md:p-8 text-center">
          {/* Icon container */}
          <div className="relative inline-block mb-4 md:mb-6">
            <div className="absolute inset-0 bg-[#F4B942] rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-all duration-500 group-hover:scale-110"></div>
            
            <div className="relative bg-white rounded-2xl p-4 md:p-5 group-hover:bg-[#F4B942] transition-all duration-500 shadow-sm border border-gray-100 group-hover:border-transparent group-hover:shadow-md">
              <div className="text-[#1E2A3A] group-hover:text-white transition-colors duration-500">
                <AnimatedCategoryIcon category={category} />
              </div>
            </div>
          </div>

          <div className="relative">
            <h3 className="text-lg md:text-xl font-semibold text-[#1E2A3A] group-hover:text-[#1E2A3A] transition-all duration-500 mb-2 md:mb-3">
              {category.name}
            </h3>

            {category.description && (
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 group-hover:text-gray-700 transition-all duration-500">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-center space-x-2 text-gray-500 group-hover:text-[#F4B942] transition-colors duration-300">
              <span className="text-xs md:text-sm font-medium">Explore services</span>
              <svg 
                className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// Animated Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12 md:py-20">
    <div className="relative">
      <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-[#E9EEF4] border-t-[#1E2A3A] rounded-full animate-spin"></div>
      <div className="absolute inset-1 md:inset-2 border-4 border-transparent border-r-[#F4B942] rounded-full animate-ping"></div>
    </div>
  </div>
);

export default function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);
  const searchInputRef = useRef(null);

  // Popular search terms
  const popularSearches = [
    'фотограф',
    'видеограф',
    'ведущий',
    'DJ',
    'флорист',
    'кейтеринг',
    'пекарня',
    'аниматор',
    'транспорт',
    'декоратор'
  ];

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const filteredPopular = popularSearches.filter(search => 
        search.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const allSuggestions = [
        ...filteredCategories.map(cat => ({ type: 'category', ...cat })),
        ...filteredPopular.map(search => ({ type: 'search', name: search, id: search }))
      ].slice(0, 8);
      
      setSuggestions(allSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, categories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, servicesData] = await Promise.all([
        servicesAPI.getCategories(i18n.language),
        servicesAPI.getServices({ page_size: 8, lang: i18n.language }),
      ]);
      setCategories(categoriesData);
      setServices(servicesData.results || servicesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      searchInputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'category') {
      navigate(`/services?category=${suggestion.id}`);
    } else {
      setSearchQuery(suggestion.name);
      navigate(`/services?search=${encodeURIComponent(suggestion.name)}`);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="bg-[#1E2A3A] relative min-h-screen">
      <DeepBlueBackground />
      <GeometricPattern />
      <FloatingAmberElements />
      
      {/* Hero Section */}
      <section className="relative bg-[#1E2A3A] text-white py-16 md:py-24 lg:py-32">
        {/* Amber accent elements */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          <div className="absolute top-10 left-10 md:top-20 md:left-20 w-20 h-20 md:w-32 md:h-32 bg-[#F4B942] rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-24 h-24 md:w-48 md:h-48 bg-[#F4B942] rounded-full blur-3xl animate-pulse-medium"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 md:mb-8">
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="bg-linear-to-r from-white via-[#F4B942] to-gray-300 bg-clip-text text-transparent">
                  {t('home.title')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8 md:mb-10">
                {t('home.subtitle')}
              </p>
            </div>
            
            <div className={`max-w-2xl mx-auto transition-all duration-300 relative z-50 ${
              isSearchFocused ? 'scale-105' : 'scale-100'
            }`}>
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t('home.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      if (!isClickingSuggestion) {
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full pl-12 md:pl-16 pr-6 md:pr-8 py-4 md:py-5 rounded-2xl text-gray-800 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#F4B942] shadow-2xl text-base md:text-lg border-0"
                  />
                  <div className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#F4B942] text-[#1E2A3A] px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl font-semibold hover:bg-[#e5a832] transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-sm md:text-base"
                >
                  {t('filters.search')}
                </button>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto z-10000"
                  onMouseDown={() => setIsClickingSuggestion(true)}
                  onMouseUp={() => setIsClickingSuggestion(false)}
                  onMouseLeave={() => setShowSuggestions(false)}
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.type}-${suggestion.id || suggestion.name}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    >
                      <div className="flex items-center flex-1">
                        {suggestion.type === 'category' ? (
                          <>
                            <div className="w-10 h-10 bg-[#F4B942]/10 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{suggestion.name}</div>
                              <div className="text-sm text-gray-500">{t('home.category', 'Категория')}</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-[#1E2A3A]/10 rounded-lg flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{suggestion.name}</div>
                              <div className="text-sm text-gray-500">{t('home.popularSearch', 'Популярный поиск')}</div>
                            </div>
                          </>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-0 md:py-16 lg:py-20 relative z-10 -mt-8 md:mt-0">
        <div className="container mx-auto px-4">
          <div className="text-center mt-6 md:mt-0 md:mb-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              {t('home.allCategories', 'Популярные категории')}
            </h2>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : categories.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.slice(0, showAllCategories ? categories.length : 8).map((category, index) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    index={index}
                  />
                ))}
              </div>
              
              {categories.length > 8 && !showAllCategories && (
                <div className="text-center mt-12 md:mt-18">
                  <button
                    onClick={() => setShowAllCategories(true)}
                    className="bg-[#F4B942] text-[#1E2A3A] px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transform text-sm md:text-base"
                  >
                    {t('home.showAllCategories', 'Показать все категории')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 md:py-16 bg-white rounded-2xl shadow-lg mx-4 md:mx-0">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-[#E9EEF4] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-[#1E2A3A] mb-2">
                {t('common.noCategories', 'Категории не найдены')}
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                {t('common.tryAgainLater', 'Попробуйте обновить страницу позже')}
              </p>
              <button
                onClick={fetchData}
                className="bg-[#F4B942] text-[#1E2A3A] px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:scale-105 transform text-sm md:text-base"
              >
                {t('common.retry', 'Попробовать снова')}
              </button>
            </div>
          )}
        </div>
      </section>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes floatAmber {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-15px) scale(1.1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-25px) scale(1.2);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-15px) scale(1.1);
            opacity: 0.3;
          }
        }
        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
        @keyframes pulse-medium {
          0%, 100% {
            opacity: 0.03;
          }
          50% {
            opacity: 0.08;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-medium {
          animation: pulse-medium 3s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}