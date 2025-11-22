import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  const privacy = t('privacy', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {privacy.title}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8 leading-relaxed">
              {privacy.intro}
            </p>

            <p className="text-gray-700 mb-12 leading-relaxed font-medium">
              {privacy.consent}
            </p>

            {/* General Provisions */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.general.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{privacy.sections.general['1']}</p>
                <p>{privacy.sections.general['2']}</p>
                <p>{privacy.sections.general['3']}</p>
              </div>
            </section>

            {/* Personal Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.personalData.title}
              </h2>
              <p className="text-gray-700 mb-4">{privacy.sections.personalData['1']}</p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                {privacy.sections.personalData.dataList.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              <p className="text-gray-700 mb-4">{privacy.sections.personalData['2']}</p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                {privacy.sections.personalData.usageList.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              <p className="text-gray-700 mb-4">{privacy.sections.personalData['3']}</p>
              <p className="text-gray-700">{privacy.sections.personalData['4']}</p>
            </section>

            {/* Information Usage */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.informationUsage.title}
              </h2>
              <p className="text-gray-700 mb-4">{privacy.sections.informationUsage['1']}</p>
              <p className="text-gray-700 mb-4">{privacy.sections.informationUsage['2']}</p>
              <p className="text-gray-700 mb-4">{privacy.sections.informationUsage['3']}</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {privacy.sections.informationUsage.prohibitedList.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </section>

            {/* Registration */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.registration.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{privacy.sections.registration['1']}</p>
                <p>{privacy.sections.registration['2']}</p>
                <p>{privacy.sections.registration['3']}</p>
              </div>
            </section>

            {/* Responsibility */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.responsibility.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{privacy.sections.responsibility['1']}</p>
                <p>{privacy.sections.responsibility['2']}</p>
                <p>{privacy.sections.responsibility['3']}</p>
              </div>
            </section>

            {/* Paid Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.paidServices.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{privacy.sections.paidServices['1']}</p>
                <p>{privacy.sections.paidServices['2']}</p>
                <p>{privacy.sections.paidServices['3']}</p>
              </div>
            </section>

            {/* Changes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.changes.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{privacy.sections.changes['1']}</p>
                <p>{privacy.sections.changes['2']}</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {privacy.sections.contact.title}
              </h2>
              <p className="text-gray-700 mb-4">{privacy.sections.contact.text}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> {privacy.sections.contact.email}
                </p>
                <p className="text-gray-700">
                  <strong>{t('footer.contact')}:</strong> {privacy.sections.contact.phone}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}