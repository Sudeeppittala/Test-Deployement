import React, { useEffect } from 'react';

const TermsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="bg-slate-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 mb-6">Terms & Conditions</h1>
          <p className="text-xl text-gray-500">Effective Date: January 1, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="prose prose-lg prose-slate max-w-none text-gray-600">
          <p className="lead text-xl mb-10">
            Welcome to Placemein. By accessing our platform or using our services, you agree to be bound by these Terms and Conditions.
          </p>

          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Services</h3>
              <p>
                Placemein provides placement facilitation, training, and recruitment services. We connect educational institutions and students with corporate hiring partners. We do not guarantee a job offer but guarantee access to opportunities as per the specific program terms.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. User Obligations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Students:</strong> Must provide accurate academic and personal information. Any falsification of records will lead to immediate disqualification.</li>
                <li><strong>Colleges:</strong> Must ensure student availability for scheduled drives and facilitate infrastructure for on-campus rounds.</li>
                <li><strong>Corporates:</strong> Must provide clear job descriptions and timely feedback on interviewed candidates.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Payments and Refunds</h3>
              <p>
                For paid training programs (e.g., the 90-Day Sprint), fees are non-refundable once the batch commences, unless otherwise specified in the enrollment agreement. Corporate recruitment fees follow the service agreement signed individually with each partner.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property</h3>
              <p>
                All content, training materials, assessment logic, and platform code are the exclusive property of Placemein Operations. Unauthorized reproduction or sharing of our proprietary curriculum is strictly prohibited.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h3>
              <p>
                Placemein is an intermediary. We are not liable for employment disputes, salary negotiations, or workplace conditions once a candidate joins a corporate partner.
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">6. Governing Law</h3>
              <p>
                These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              For legal inquiries, please contact: legal@placemein.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;