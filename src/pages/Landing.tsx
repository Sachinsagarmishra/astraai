import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const features = [
    {
      emoji: '📅',
      title: 'Daily Panchang',
      desc: 'Check accurate sunrise/sunset, Abhijit Muhurta, Rahu Kaal, Tithi, and Nakshatra for your city.'
    },
    {
      emoji: '📿',
      title: 'Digital Jaap Mala',
      desc: 'Maintain your spiritual chanting streaks with automated counts, intervals, and vibration feedback.'
    },
    {
      emoji: '✨',
      title: 'AI Palmistry',
      desc: 'Get modern, positive, and detailed readings of your Life, Heart, Head, and Fate lines using Gemini AI.'
    },
    {
      emoji: '📖',
      title: 'Puja Vidhi Library',
      desc: 'Follow verified step-by-step guidelines, checklist requirements, and audio/mantra templates.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-orange-200/20 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-amber-200/20 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🕉️</span>
          <span className="font-serif text-2xl font-semibold text-stone-900 tracking-wide">Astrai</span>
        </div>
        <div>
          <a
            href="#download"
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-5 py-2.5 rounded-full text-sm transition-all shadow-md shadow-orange-600/10"
          >
            Download App
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto z-10 py-16">
        <h1 className="font-serif text-5xl md:text-6xl text-stone-900 leading-tight mb-6 tracking-tight">
          Your AI Spiritual <br />
          <span className="text-orange-600">Companion</span>
        </h1>
        <p className="text-stone-500 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Deepen your spiritual practice. Check your daily Panchang, track your chants with a digital mala, analyze destiny lines using AI, and follow verified Puja rituals.
        </p>

        {/* Store Links */}
        <div id="download" className="flex flex-col sm:flex-row gap-4 mb-20">
          <a
            href="#"
            className="flex items-center bg-stone-950 text-white rounded-2xl px-6 py-3 border border-stone-800 hover:bg-stone-900 transition-colors shadow-lg"
          >
            <span className="text-3xl mr-3">🤖</span>
            <span className="text-left">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">Get it on</span>
              <span className="text-md font-bold block">Google Play</span>
            </span>
          </a>

          <a
            href="#"
            className="flex items-center bg-stone-950 text-white rounded-2xl px-6 py-3 border border-stone-800 hover:bg-stone-900 transition-colors shadow-lg"
          >
            <span className="text-3xl mr-3">🍏</span>
            <span className="text-left">
              <span className="text-[10px] text-stone-400 block uppercase font-semibold">Download on the</span>
              <span className="text-md font-bold block">App Store</span>
            </span>
          </a>
        </div>

        {/* Philosophy Panel */}
        <div className="bg-white/80 border border-stone-100/50 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-sm text-left max-w-3xl mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full opacity-30 -z-10" />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-rose-500 text-xl font-bold">❤️</span>
            <span className="text-xs font-bold tracking-widest text-rose-500 uppercase">Our Core Philosophy</span>
          </div>
          <h2 className="font-serif text-3xl text-stone-900 mb-4">मन से, डर से नहीं</h2>
          <p className="text-stone-600 leading-relaxed text-md">
            Connect with the divine through pure devotion and joy, not fear. Astrai rejects fear-mongering and fatalistic predictions. All calculations, rituals, and AI palmistry guides are designed to cultivate peace, focus, and positive transformation in your daily life.
          </p>
        </div>

        {/* Features Grid */}
        <div className="w-full text-left mb-16">
          <h3 className="text-xs font-bold tracking-widest text-stone-400 uppercase text-center mb-12">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-3xl p-6 border border-stone-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                  {feature.emoji}
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mb-2">{feature.title}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-100 py-10 z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕉️</span>
            <span className="font-serif font-bold text-stone-900">Astrai</span>
          </div>
          
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-stone-500">
            <Link to="/privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-orange-600 transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-orange-600 transition-colors">Disclaimer</Link>
          </div>
          
          <div className="text-xs text-stone-400">
            © 2026 Astrai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
