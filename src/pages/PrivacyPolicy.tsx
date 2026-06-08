import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-serif text-stone-900 mb-6">Privacy Policy</h1>
        <p className="text-stone-500 text-sm mb-6">Last Updated: June 8, 2026</p>
        
        <div className="space-y-6 text-stone-600 leading-relaxed text-sm">
          <p>
            Welcome to Astrai ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application and our website.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as your profile details (e.g., city and preferred deity for Panchang calculations) and any images you upload for AI analysis (e.g., palm photos for palmistry readings). We do not store your raw images on our servers longer than necessary to perform the analysis.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">2. How We Use Your Information</h2>
          <p>
            We use your details to calculate accurate daily Panchang timings based on your city, personalize your spiritual feed, and process palm analysis through our secure cloud-based AI service.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">3. Security of Your Data</h2>
          <p>
            Your AI requests and API keys are strictly processed server-side. We use industry-standard encryption protocols to transfer data between the app and our VPS backend servers.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">4. Third-Party Services</h2>
          <p>
            We utilize third-party AI models (like Google Gemini) to generate personalized readings. Your uploaded images are sent securely to these models for computational analysis and are not used for model training or stored permanently.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">5. Your Rights</h2>
          <p>
            You can delete your local preferences, reset your counter statistics, and clear your session data at any time from within the app settings.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">6. Contact Us</h2>
          <p>
            If you have any questions or feedback regarding this Privacy Policy, please contact us at support@sachindesign.com.
          </p>
        </div>
      </div>
    </div>
  );
}
