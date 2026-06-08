import React from 'react';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-stone-100">
        <Link to="/" className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center mb-6">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-serif text-stone-900 mb-6">Disclaimer</h1>
        <p className="text-stone-500 text-sm mb-6">Last Updated: June 8, 2026</p>
        
        <div className="space-y-6 text-stone-600 leading-relaxed text-sm">
          <p className="font-medium text-stone-900">
            Please read this disclaimer carefully before using the Astrai app or website.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">1. No Professional Advice</h2>
          <p>
            The content, AI analysis, palmistry readings, and calculations presented by Astrai are for general educational, self-reflective, and informational purposes only. They do not constitute professional medical, legal, psychological, or financial advice. We encourage users to make decisions based on their own judgment and consult qualified professionals for specific advisory needs.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">2. Astrological Calculations</h2>
          <p>
            Our daily Panchang timings, sunrise/sunset, and Muhurtas are calculated based on latitude, longitude, and astronomical approximations. While we strive to ensure maximum accuracy, minor calculations differences may occur depending on the specific Panchang methodology (e.g., Drik Panchang, Surya Siddhanta). We do not guarantee absolute accuracy for all locations and dates.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">3. "मन से, डर से नहीं" Philosophy</h2>
          <p>
            Astrai operates on the core philosophy of "मन से, डर से नहीं" (through love and devotion, not fear). We strongly reject any fear-mongering, fatalistic predictions, or superstitious claims. All AI palmistry reports and recommendations are framed positively to guide personal development and spiritual focus, rather than instigating fear or absolute certainty.
          </p>

          <h2 className="text-xl font-semibold text-stone-900 mt-6 mb-2">4. User Responsibility</h2>
          <p>
            Rituals, chanting practices (Jaap), and meditation are personal commitments. The physical and emotional outcomes of these practices depend entirely on individual devotion, mental state, and focus. Astrai acts as a digital support tool and cannot guarantee specific physical, emotional, or spiritual results.
          </p>
        </div>
      </div>
    </div>
  );
}
