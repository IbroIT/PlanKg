import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();

  const faq = t('faq', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {faq.title}
          </h1>

          <div className="space-y-8">
            {/* Questions and Answers */}
            <section>
              <div className="space-y-6">
                {faq.questions.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Provider Responsibilities */}
            <section className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {faq.responsibilities.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {faq.responsibilities.list.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>

            {/* Advantages */}
            <section className="bg-green-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {faq.advantages.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {faq.advantages.list.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}