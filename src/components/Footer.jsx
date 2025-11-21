import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-b from-[#1E2A3A] to-[#0f1724] text-white mt-auto z-10 relative">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#F4B942] rounded-lg flex items-center justify-center mr-3">
                <span className="text-[#1E2A3A] font-bold text-lg">P</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Plan.kg</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t('footer.about', 'Платформа для поиска и предоставления качественных услуг. Связываем клиентов с проверенными специалистами.')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-[#F4B942] mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/services" className="text-gray-300 hover:text-[#F4B942] transition-all duration-300 flex items-center group">
                  <svg className="w-4 h-4 mr-3 text-[#F4B942] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {t('nav.services')}
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-[#F4B942] transition-all duration-300 flex items-center group">
                  <svg className="w-4 h-4 mr-3 text-[#F4B942] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {t('footer.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="text-lg font-bold text-[#F4B942] mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t('footer.forProviders')}
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/add-service" className="text-gray-300 hover:text-[#F4B942] transition-all duration-300 flex items-center group">
                  <svg className="w-4 h-4 mr-3 text-[#F4B942] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {t('profile.addService')}
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-[#F4B942] transition-all duration-300 flex items-center group">
                  <svg className="w-4 h-4 mr-3 text-[#F4B942] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-[#F4B942] mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-[#F4B942] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>service2aces@gmail.com</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-[#F4B942] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+996 500 691 995</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-[#F4B942] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Бишкек, Кыргызстан</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>&copy; 2025 Plan.kg {t('footer.rights', 'Все права защищены.')}</p>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="/terms" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                {t('footer.terms')}
              </a>
              <a href="/cookies" className="text-gray-400 hover:text-[#F4B942] transition-colors">
                {t('footer.cookies')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="bg-gradient-to-r from-[#F4B942] to-transparent h-1"></div>
    </footer>
  );
}