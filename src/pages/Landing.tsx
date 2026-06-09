import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Hand,
  Heart,
  ShieldCheck,
  Sparkles,
  Sun,
  TimerReset,
} from 'lucide-react';
import appIcon from '../../mobile/assets/icon.png';

const features = [
  {
    icon: CalendarDays,
    title: 'Daily Panchang',
    desc: 'Sunrise, sunset, tithi, nakshatra, Rahu Kaal, and auspicious windows in one calm daily view.',
  },
  {
    icon: TimerReset,
    title: 'Digital Jaap Mala',
    desc: 'A focused chanting counter with streaks, vibration feedback, and simple targets for daily sadhana.',
  },
  {
    icon: Hand,
    title: 'AI Palmistry',
    desc: 'Positive, reflective palm readings for life, heart, head, and fate lines using server-side AI.',
  },
  {
    icon: BookOpen,
    title: 'Puja Vidhi Library',
    desc: 'Step-by-step puja guides, samagri checklists, and mantra templates made for real practice.',
  },
];

const appRows = [
  ['Today', 'Abhijit Muhurta 11:58 AM'],
  ['Jaap', '108 / 108 completed'],
  ['Astro Lab', 'Palm reading ready'],
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#211a16] font-sans">
      <header className="sticky top-0 z-40 border-b border-[#eadfd2] bg-[#fbfaf6]/92 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Astrai home">
            <img src={appIcon} alt="Astrai" className="h-10 w-10 rounded-[10px]" />
            <div className="leading-tight">
              <div className="text-lg font-semibold">Astrai</div>
              <div className="text-xs text-[#8c6f5a]">मन से, डर से नहीं</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-[#6f5a49] md:flex">
            <a href="#features" className="hover:text-[#c6531d]">Features</a>
            <a href="#philosophy" className="hover:text-[#c6531d]">Philosophy</a>
            <a href="#support" className="hover:text-[#c6531d]">Support</a>
          </nav>

          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-md bg-[#c6531d] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a94216]"
          >
            Get App
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_440px] lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#ead3c0] bg-white px-3 py-2 text-sm font-semibold text-[#a94216]">
              <Sun className="h-4 w-4" />
              AI spiritual companion for daily practice
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#211a16] sm:text-6xl lg:text-7xl">
              Astrai
              <span className="mt-3 block text-[#c6531d]">spiritual guidance for everyday life.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6f5a49]">
              Panchang, jaap tracking, puja vidhi, and positive AI palmistry in one mobile-first experience built around devotion, clarity, and peace.
            </p>

            <div id="download" className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#support"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#211a16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Download Coming Soon
                <Sparkles className="h-4 w-4" />
              </a>
              <Link
                to="/privacy"
                className="inline-flex items-center justify-center rounded-md border border-[#d9c8b7] bg-white px-5 py-3 text-sm font-semibold text-[#3b3029] transition hover:border-[#c6531d]"
              >
                View Policies
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[380px] lg:justify-self-end">
            <div className="absolute inset-x-8 top-8 h-[520px] rounded-[42px] bg-[#e8c7a8]" />
            <div className="relative rounded-[42px] border-[10px] border-[#211a16] bg-[#211a16] p-3 shadow-2xl">
              <div className="overflow-hidden rounded-[30px] bg-[#fffaf2]">
                <div className="bg-[#c6531d] px-5 pb-8 pt-5 text-white">
                  <div className="mb-8 flex items-center justify-between">
                    <img src={appIcon} alt="" className="h-11 w-11 rounded-xl" />
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-white/80">Today&apos;s guidance</p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight">Begin with calm intention.</h2>
                </div>

                <div className="space-y-3 p-5">
                  {appRows.map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-[#eadfd2] bg-white p-4">
                      <div className="text-xs font-semibold uppercase text-[#a1846b]">{label}</div>
                      <div className="mt-1 text-sm font-semibold text-[#211a16]">{value}</div>
                    </div>
                  ))}

                  <div className="rounded-lg bg-[#211a16] p-4 text-white">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                      <Heart className="h-4 w-4 text-[#f5b48b]" />
                      मन से, डर से नहीं
                    </div>
                    <p className="text-sm leading-6 text-white/72">
                      Guidance that supports devotion without fear-based predictions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-[#eadfd2] bg-white py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase text-[#c6531d]">Core Features</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#211a16] sm:text-4xl">Built for repeat daily use.</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-lg border border-[#eadfd2] bg-[#fbfaf6] p-5">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-[#f4e2d1] text-[#c6531d]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#6f5a49]">{feature.desc}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="philosophy" className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c6531d]">Philosophy</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Devotion first. Fear never.</h2>
          </div>
          <div className="text-lg leading-8 text-[#6f5a49]">
            <p>
              Astrai is designed around positive reflection, not fatalism. The experience keeps rituals, calculations, and AI insights practical, respectful, and grounded in self-improvement.
            </p>
            <p className="mt-5 font-semibold text-[#211a16]">मन से, डर से नहीं.</p>
          </div>
        </section>
      </main>

      <footer id="support" className="border-t border-[#eadfd2] bg-[#211a16] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src={appIcon} alt="" className="h-10 w-10 rounded-[10px]" />
              <span className="text-lg font-semibold">Astrai</span>
            </div>
            <p className="mt-3 text-sm text-white/62">© 2026 Astrai. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-medium text-white/72">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-white">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
