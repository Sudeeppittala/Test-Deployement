import React, { useEffect } from 'react';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      <div className="bg-slate-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-500">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-gray-600 mb-10">
            At Placemein ("we," "our," or "us"), we are committed to protecting the privacy and security of the data entrusted to us by students, colleges, and corporate partners. This Privacy Policy outlines how we collect, use, and safeguard your information.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">1. Information We Collect</h3>
          <p className="mb-4 text-gray-600">We collect information to facilitate the placement process:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li><strong>Student Data:</strong> Name, contact details, academic records, portfolio links, resume content, and assessment scores.</li>
            <li><strong>College Data:</strong> Institutional details, placement officer contacts, and batch demographics.</li>
            <li><strong>Corporate Data:</strong> HR point-of-contact information, hiring requirements, and job descriptions.</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">2. How We Use Your Information</h3>
          <p className="mb-4 text-gray-600">Your data is used exclusively for:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li>Matching students with relevant job opportunities.</li>
            <li>Coordinating placement drives and interview schedules.</li>
            <li>Analyzing placement trends to improve our training programs.</li>
            <li>Communicating updates regarding drives, offers, and training schedules.</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">3. Third-Party Sharing</h3>
          <p className="mb-4 text-gray-600">
            We do not sell your personal data. We share data only with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-8">
            <li><strong>Corporate Partners:</strong> Student profiles are shared with hiring partners for recruitment purposes only.</li>
            <li><strong>Colleges:</strong> Outcome data is shared with respective institutions for placement tracking.</li>
            <li><strong>Service Providers:</strong> Secure infrastructure providers (e.g., AWS, Google Cloud) who assist in our operations.</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">4. Data Retention</h3>
          <p className="mb-8 text-gray-600">
            We retain student data for the duration of the placement cycle and up to 2 years post-placement to support alumni hiring and audit trails. You may request deletion of your account at any time, subject to pending interview processes.
          </p>

          <h3 className="text-2xl font-bold text-slate-900 mt-12 mb-6">5. Your Rights</h3>
          <p className="mb-8 text-gray-600">
            You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact our Data Protection Officer.
          </p>

          <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100 mt-12">
            <h4 className="font-bold text-lg text-slate-900 mb-2">Contact Us</h4>
            <p className="text-gray-600 mb-4">For privacy concerns, please reach out to:</p>
            <p className="font-medium text-slate-900">Placemein Operations<br/>5th Floor, APHB Colony, Indira Nagar<br/>Gachibowli, Hyderabad, Telangana 500032<br/>Email: privacy@placemein.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;