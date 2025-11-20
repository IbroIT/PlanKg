import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, isAuthenticated } from '../api/auth';
import { servicesAPI } from '../api/services';
import ServiceCard from '../components/ServiceCard';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('services');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);



  // City translation keys
  const cityKeys = {
    'Бишкек': 'bishkek',
    'Ош': 'osh',
    'Токмок': 'tokmok',
    'Кант': 'kant',
    'Кара-Балта': 'karaBalta',
    'Шопоков': 'shopokov',
    'Каинды': 'kaindy',
    'Кара-Суу': 'karaSuu',
    'Ноокат': 'nookat',
    'Узген (Өзгөн)': 'uzgen',
    'Манас': 'manas',
    'Кара-Куль': 'karaKul',
    'Майлуу-Суу': 'mailuuSuu',
    'Таш-Кумыр': 'tashKumyr',
    'Кербен (Ала-Бука)': 'kerben',
    'Каракол': 'karakol',
    'Балыкчы': 'balykchy',
    'Чолпон-Ата': 'cholponAta',
    'Нарын': 'naryn',
    'Кочкор': 'kochkor',
    'Ат-Башы': 'atBashi',
    'Талас': 'talas',
    'Кызыл-Адыр': 'kyzylAdyr',
    'Баткен': 'batken',
    'Кызыл-Кыя': 'kyzylKiya',
    'Сулюкта': 'sulukta'
  };

  // City options for select
  const cityOptions = Object.keys(cityKeys).map(city => ({
    value: city,
    label: t(`cities.${cityKeys[city]}`)
  }));

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [i18n.language]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, servicesData] = await Promise.all([
        authAPI.getProfile(),
        servicesAPI.getMyServices(i18n.language),
      ]);
      setUser(userData);
      setFormData(userData);
      setAvatarPreview(userData.avatar);
      setServices(servicesData.results || servicesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Добавляем текстовые поля
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'avatar') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Добавляем файл аватарки, если он выбран
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }
      
      const updated = await authAPI.updateProfile(formDataToSend);
      console.log('Updated user data:', updated); // Отладка
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(updated.avatar); // Обновляем превью на URL из API ответа
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t('common.error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E9EEF4] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E9EEF4] border-t-[#F4B942] rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-transparent border-l-[#1E2A3A] rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  const approvedServices = services.filter(s => s.status === 'approved');
  const pendingServices = services.filter(s => s.status === 'pending');
  const rejectedServices = services.filter(s => s.status === 'rejected');

  return (
    <div className="min-h-screen bg-[#E9EEF4] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-linear-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-linear-to-br from-[#F4B942] to-[#e5a832] rounded-full flex items-center justify-center shadow-2xl">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || user?.email}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {(user?.first_name?.charAt(0) || user?.username?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user?.username || user?.email}
                  </h1>
                  {user?.role === 'provider' && (
                    <p className="text-gray-300">{t('auth.provider')}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-4">
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {t('profile.editProfile')}
                  </button>
                )}
                <button
                  onClick={() => navigate('/add-service')}
                  className="bg-white text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('profile.addService')}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-[#1E2A3A] mb-4">{t('profile.profileInfo')}</h2>
                
                {editMode ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('auth.firstName')}
                      </label>
                      <input
                        type="text"
                        value={formData.first_name || ''}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('auth.lastName')}
                      </label>
                      <input
                        type="text"
                        value={formData.last_name || ''}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('auth.phone')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('auth.city')}
                      </label>
                      <select
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      >
                        <option value="">{t('filters.allCities')}</option>
                        {cityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('profile.bio')}
                      </label>
                      <textarea
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows="4"
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('profile.avatar')}
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-20 h-20 bg-[#E9EEF4] border-2 border-dashed border-[#F4B942] rounded-full flex items-center justify-center overflow-hidden">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg className="w-8 h-8 text-[#F4B942]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">
                            {t('profile.avatarHint')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t('profile.avatarFormats')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('profile.whatsapp')}
                      </label>
                      <input
                        type="text"
                        value={formData.whatsapp || ''}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder={t('profile.whatsappPlaceholder')}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('profile.telegram')}
                      </label>
                      <input
                        type="text"
                        value={formData.telegram || ''}
                        onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                        placeholder={t('profile.telegramPlaceholder')}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1E2A3A] mb-2">
                        {t('profile.instagram')}
                      </label>
                      <input
                        type="text"
                        value={formData.instagram || ''}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder={t('profile.instagramPlaceholder')}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-[#F4B942] text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {t('profile.save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setFormData(user);
                          setAvatarFile(null);
                          setAvatarPreview(user?.avatar);
                        }}
                        className="flex-1 bg-gray-200 text-[#1E2A3A] px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
                      >
                        {t('addService.cancel')}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('auth.email')}</span>
                      <span className="font-semibold text-[#1E2A3A]">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('auth.phone')}</span>
                      <span className="font-semibold text-[#1E2A3A]">{user?.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('auth.city')}</span>
                      <span className="font-semibold text-[#1E2A3A]">{user?.city ? t(`cities.${cityKeys[user?.city]}`) : '—'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('service.rating')}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-[#F4B942] fill-current mr-1" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="font-semibold text-[#1E2A3A]">
                          {user?.rating ? Number(user.rating).toFixed(1) : '0.0'}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">({user?.reviews_count || 0})</span>
                      </div>
                    </div>
                    {user?.bio && (
                      <div className="pt-2">
                        <p className="text-gray-600 text-sm mb-2">{t('profile.bio')}</p>
                        <p className="text-[#1E2A3A] bg-[#E9EEF4] p-3 rounded-xl">{user.bio}</p>
                      </div>
                    )}
                    <div className="pt-2">
                      <p className="text-gray-600 text-sm mb-2">{t('profile.socialMedia')}</p>
                      <div className="space-y-2">
                        {user?.whatsapp ? (
                          <div className="flex items-center space-x-2 text-[#1E2A3A] bg-[#E9EEF4] p-3 rounded-xl">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                            <span>{user.whatsapp}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400 bg-gray-100 p-3 rounded-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>—</span>
                          </div>
                        )}
                        {user?.telegram ? (
                          <div className="flex items-center space-x-2 text-[#1E2A3A] bg-[#E9EEF4] p-3 rounded-xl">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            <span>{user.telegram}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400 bg-gray-100 p-3 rounded-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>—</span>
                          </div>
                        )}
                        {user?.instagram ? (
                          <div className="flex items-center space-x-2 text-[#1E2A3A] bg-[#E9EEF4] p-3 rounded-xl">
                            <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            <span>{user.instagram}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-400 bg-gray-100 p-3 rounded-xl">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>—</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Recommendation if no contacts */}
                {(!user?.city && !user?.phone && !user?.whatsapp && !user?.telegram && !user?.instagram) && (
                  <div className="mt-6 bg-[#E9EEF4] rounded-xl p-4 border-l-4 border-[#F4B942]">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-[#F4B942] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-[#1E2A3A] mb-1">{t('profile.fillProfile', 'Заполните профиль')}</h4>
                        <p className="text-gray-600 text-sm">{t('profile.fillProfileDesc', 'Добавьте город и контактные данные, чтобы клиенты могли легко связаться с вами')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Card */}
              {services.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-[#1E2A3A] mb-4">{t('profile.stats')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <span className="text-green-700 font-semibold">{t('service.approved')}</span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                        {approvedServices.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                      <span className="text-yellow-700 font-semibold">{t('service.pending')}</span>
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full font-bold">
                        {pendingServices.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                      <span className="text-red-700 font-semibold">{t('service.rejected')}</span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                        {rejectedServices.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Services Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#1E2A3A] mb-4 sm:mb-0">{t('profile.myServices')}</h2>
                  
                  {/* Status Tabs */}
                  {services.length > 0 && (
                    <div className="flex space-x-2 bg-[#E9EEF4] p-1 rounded-xl">
                      <button
                          onClick={() => setActiveTab('all')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'all' 
                              ? 'bg-[#F4B942] text-[#1E2A3A]' 
                              : 'text-gray-600 hover:text-[#1E2A3A]'
                          }`}
                        >
                          {t('profile.allServices')} ({services.length})
                        </button>
                      <button
                          onClick={() => setActiveTab('approved')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'approved' 
                              ? 'bg-green-500 text-white' 
                              : 'text-gray-600 hover:text-green-600'
                          }`}
                        >
                          {t('profile.approvedServices')} ({approvedServices.length})
                        </button>
                      <button
                          onClick={() => setActiveTab('pending')}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            activeTab === 'pending' 
                              ? 'bg-yellow-500 text-white' 
                              : 'text-gray-600 hover:text-yellow-600'
                          }`}
                        >
                          {t('profile.pendingServices')} ({pendingServices.length})
                        </button>
                    </div>
                  )}
                </div>

                {services.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {(activeTab === 'all' ? services : 
                      activeTab === 'approved' ? approvedServices :
                      activeTab === 'pending' ? pendingServices : services
                    ).map((service) => (
                      <div key={service.id} className="relative">
                        <ServiceCard service={service} />
                        {service.status !== 'approved' && (
                          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold z-10 ${
                            service.status === 'pending' 
                              ? 'bg-yellow-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {service.status === 'pending' ? t('profile.pendingStatus') : t('profile.rejectedStatus')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-[#E9EEF4] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1E2A3A] mb-2">
                      {t('profile.noServices', 'Нет услуг пока')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t('profile.addFirstService')}
                    </p>
                    <button
                      onClick={() => navigate('/add-service')}
                      className="bg-[#F4B942] text-[#1E2A3A] px-6 py-2 md:px-8 md:py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {t('profile.addService')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}