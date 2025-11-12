import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';
import { servicesAPI } from '../api/services';

export default function AddService() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState('ru');
  const [formData, setFormData] = useState({
    translations: {
      ru: { title: '', description: '' },
      en: { title: '', description: '' },
      kg: { title: '', description: '' },
    },
    category_id: '',
    price: '',
    price_type: 'fixed',
    city: '',
    image1: null,
    image2: null,
    image3: null,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchCategories();
  }, [i18n.language]);

  const fetchCategories = async () => {
    try {
      const data = await servicesAPI.getCategories(i18n.language);
      const allData = Array.isArray(data) ? data : (data.results || []);
      const subcategories = allData.flatMap(parent => parent.subcategories || []);
      setCategories(subcategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleTranslationChange = (lang, field, value) => {
    setFormData({
      ...formData,
      translations: {
        ...formData.translations,
        [lang]: {
          ...formData.translations[lang],
          [field]: value,
        },
      },
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById(`${field}-preview`).innerHTML = `
          <img src="${e.target.result}" alt="Preview" class="w-full h-32 object-cover rounded-xl" />
        `;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await servicesAPI.createService(formData);
      navigate('/service-submitted');
    } catch (error) {
      console.error('Error creating service:', error);
      alert(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const languageNames = {
    ru: 'Русский',
    en: 'English',
    kg: 'Кыргызча'
  };

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{t('addService.title')}</h1>
                <p className="text-gray-300 text-lg">
                  {t('addService.subtitle', 'Добавьте новую услугу и начните получать заказы')}
                </p>
              </div>
              <div className="bg-[#F4B942] text-[#1E2A3A] px-4 py-2 rounded-full font-bold">
                {t('addService.step')} 1/1
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Language Tabs */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.serviceInfo')}
                </h3>
                
                <div className="flex space-x-2 bg-[#E9EEF4] p-1 rounded-xl mb-6">
                  {['ru', 'en', 'kg'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setCurrentLang(lang)}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                        currentLang === lang 
                          ? 'bg-[#F4B942] text-[#1E2A3A] shadow-md' 
                          : 'text-gray-600 hover:text-[#1E2A3A]'
                      }`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>

                {/* Translation Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      {t('addService.serviceName')} *
                    </label>
                    <input
                      type="text"
                      placeholder={t('addService.serviceNamePlaceholder')}
                      value={formData.translations[currentLang].title}
                      onChange={(e) => handleTranslationChange(currentLang, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                      {t('addService.serviceDescription')} *
                    </label>
                    <textarea
                      placeholder={t('addService.serviceDescriptionPlaceholder')}
                      value={formData.translations[currentLang].description}
                      onChange={(e) => handleTranslationChange(currentLang, 'description', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500 resize-none"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                    {t('addService.category')} *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] appearance-none"
                      required
                    >
                      <option value="">{t('addService.selectCategory')}</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Price Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                    {t('addService.priceType')} *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.price_type === 'fixed' 
                        ? 'border-[#F4B942] bg-[#F4B942]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="fixed"
                        checked={formData.price_type === 'fixed'}
                        onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                        className="sr-only"
                      />
                      <span className={`font-semibold ${
                        formData.price_type === 'fixed' ? 'text-white' : 'text-gray-600'
                      }`}>
                        {t('addService.fixed')}
                      </span>
                    </label>
                    <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.price_type === 'negotiable' 
                        ? 'border-[#F4B942] bg-[#F4B942]' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="negotiable"
                        checked={formData.price_type === 'negotiable'}
                        onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                        className="sr-only"
                      />
                      <span className={`font-semibold ${
                        formData.price_type === 'negotiable' ? 'text-white' : 'text-gray-600'
                      }`}>
                        {t('addService.negotiable')}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Input */}
              {formData.price_type === 'fixed' && (
                <div>
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                    {t('service.price')} (сом) *
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] pl-12"
                      placeholder="0"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <span className="font-semibold">сом</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.location')}
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-[#1E2A3A] mb-3">
                    {t('auth.city')} *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A] placeholder-gray-500"
                    placeholder={t('auth.cityPlaceholder')}
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold text-[#1E2A3A] mb-4">
                  {t('addService.images')}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t('addService.imagesHint', 'Добавьте до 3 фотографий вашей услуги')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="text-center">
                      <label className="cursor-pointer group">
                        <div 
                          id={`image${num}-preview`}
                          className="w-full h-32 bg-[#E9EEF4] rounded-xl border-2 border-dashed border-gray-300 group-hover:border-[#F4B942] transition-colors flex flex-col items-center justify-center mb-2 overflow-hidden"
                        >
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">{t('addService.uploadImage')}</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, `image${num}`)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#F4B942] text-[#1E2A3A] px-8 py-4 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#1E2A3A] border-t-transparent rounded-full animate-spin mr-2"></div>
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('addService.submit')}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 bg-white border-2 border-[#1E2A3A] text-[#1E2A3A] px-8 py-4 rounded-xl font-bold hover:bg-[#1E2A3A] hover:text-white transition-all duration-300"
                >
                  {t('addService.cancel')}
                </button>
              </div>
            </form>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              {t('addService.needHelp')}{' '}
              <a href="mailto:support@plan.kg" className="text-[#F4B942] font-semibold hover:underline">
                {t('addService.contactSupport')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}