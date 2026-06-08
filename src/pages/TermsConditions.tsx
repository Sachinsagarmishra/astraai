import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-serif text-stone-900 mb-6">Terms and Conditions</h1>
        <p className="text-stone-500 text-sm mb-6">Last Updated: June 8, 2026</p>
        
        <div className="space-y-6 text-stone-600 leading-relaxed text-sm">
          <p>
            These Terms and Conditions govern your use of the Astrai mobile app and website. By accessing or using our services, you agree to comply with and be bound by these terms.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">1. Eligibility</h2>
          <p>
            You must be at least 13 years of age to use our application. By using our service, you represent that you meet this requirement.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">2. Usage Rules</h2>
          <p>
            Our digital mala (Jaap) and puja guides are intended for personal, non-commercial, and spiritual practice. You agree not to exploit or abuse the interface, trigger malicious requests, or attempt to bypass rates limits on our API.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">3. AI Insights and Astrological Readings</h2>
          <p>
            All palm readings and astrological summaries provided by the AI are generated computationally based on modern machine learning algorithms. They are designed for self-reflection and entertainment purposes and should not be used as professional medical, legal, or financial advice.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">4. Disclaimers and Limitation of Liability</h2>
          <p>
            The app is provided on an "as-is" and "as-available" basis. We make no warranties regarding the accuracy, completeness, or spiritual outcome of the rituals or AI analyses. In no event shall we be liable for any indirect or consequential damages.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">5. Updates and Modifications</h2>
          <p>
            We reserves the right to modify these terms or discontinue any feature of our application at any time without prior notice.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">6. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
}
