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
      setServices(servicesData.results || servicesData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await authAPI.updateProfile(formData);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setEditMode(false);
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
          <div className="bg-gradient-to-r from-[#1E2A3A] to-[#2a3f54] rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-6 md:mb-0">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#F4B942] to-[#e5a832] rounded-full flex items-center justify-center shadow-2xl">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
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
                      <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-[#E9EEF4] border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F4B942] text-[#1E2A3A]"
                      />
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
                      <span className="font-semibold text-[#1E2A3A]">{user?.phone || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">{t('auth.city')}</span>
                      <span className="font-semibold text-[#1E2A3A]">{user?.city || '-'}</span>
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
                        Все ({services.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('approved')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          activeTab === 'approved' 
                            ? 'bg-green-500 text-white' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                      >
                        Активные ({approvedServices.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          activeTab === 'pending' 
                            ? 'bg-yellow-500 text-white' 
                            : 'text-gray-600 hover:text-yellow-600'
                        }`}
                      >
                        На модерации ({pendingServices.length})
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
                            {service.status === 'pending' ? '⏳ На модерации' : '❌ Отклонено'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-[#E9EEF4] rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#1E2A3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1E2A3A] mb-2">
                      {t('profile.noServices')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {t('profile.addFirstService')}
                    </p>
                    <button
                      onClick={() => navigate('/add-service')}
                      className="bg-[#F4B942] text-[#1E2A3A] px-8 py-3 rounded-xl font-bold hover:bg-[#e5a832] transition-all duration-300 shadow-lg hover:shadow-xl"
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