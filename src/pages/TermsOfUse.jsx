import { useTranslation } from 'react-i18next';

export default function TermsOfUse() {
  const { t } = useTranslation();

  const terms = t('terms', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {terms.title}
          </h1>

          <div className="prose prose-lg max-w-none">
            {/* Legal Status */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {terms.sections.legalStatus.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{terms.sections.legalStatus['1']}</p>
                <p>{terms.sections.legalStatus['2']}</p>
                <p>{terms.sections.legalStatus['3']}</p>
              </div>
            </section>

            {/* Liability Limitation */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {terms.sections.liabilityLimitation.title}
              </h2>
              <p className="text-gray-700 mb-4">{terms.sections.liabilityLimitation['1']}</p>
              <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
                {terms.sections.liabilityLimitation.notResponsibleList.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
              <p className="text-gray-700 mb-4">{terms.sections.liabilityLimitation['2']}</p>
              <p className="text-gray-700">{terms.sections.liabilityLimitation['3']}</p>
            </section>

            {/* User Responsibility */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {terms.sections.userResponsibility.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{terms.sections.userResponsibility['1']}</p>
                <p>{terms.sections.userResponsibility['2']}</p>
              </div>
            </section>

            {/* Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {terms.sections.security.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{terms.sections.security['1']}</p>
                <p>{terms.sections.security['2']}</p>
                <p>{terms.sections.security['3']}</p>
              </div>
            </section>

            {/* Jurisdiction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {terms.sections.jurisdiction.title}
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>{terms.sections.jurisdiction['1']}</p>
                <p>{terms.sections.jurisdiction['2']}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}