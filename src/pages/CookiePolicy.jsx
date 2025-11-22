import { useTranslation } from 'react-i18next';

export default function CookiePolicy() {
  const { t } = useTranslation();
  const cookies = t('cookies', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {cookies.title}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8 leading-relaxed">
              {cookies.intro}
            </p>

            <p className="text-gray-700 mb-12 leading-relaxed">
              {cookies.consent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}