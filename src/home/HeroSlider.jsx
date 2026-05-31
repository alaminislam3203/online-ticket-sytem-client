import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import bus2 from '../assets/bus2.jpg';
import bus3 from '../assets/bus3.jpg';
import bus4 from '../assets/bus4.jpg';
import banner from '../assets/banner.png';
import { FiArrowRight, FiMapPin, FiClock } from 'react-icons/fi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';

const SLIDES = [
  {
    img: banner,
    tag: '🔥 Limited Seats Available',
    title: 'Travel Smarter,\nArrive Faster',
    subtitle:
      'Book intercity bus tickets in seconds. Safe, comfortable & affordable.',
    btn1: 'Book Now',
    btn2: 'View Routes',
    route: '/tickets',
    accent: 'from-blue-900/80 to-blue-900/40',
    badge: 'Up to 30% Off',
  },
  {
    img: bus2,
    tag: '⚡ Flash Deal — Today Only',
    title: 'Dhaka to Chittagong\nStarting ৳450',
    subtitle:
      'AC & Non-AC buses available. Multiple departure times every day.',
    btn1: 'Grab Deal',
    btn2: 'Learn More',
    route: '/tickets/chittagong',
    accent: 'from-slate-900/80 to-slate-800/30',
    badge: 'Hurry — Few Left!',
  },
  {
    img: bus3,
    tag: '✨ Premium AC Service',
    title: 'Comfort Rides to\nSylhet & Rajshahi',
    subtitle: 'Reclining seats, WiFi onboard & punctual departures guaranteed.',
    btn1: 'Book Seat',
    btn2: 'Explore',
    route: '/tickets/sylhet',
    accent: 'from-emerald-900/75 to-emerald-800/25',
    badge: 'Exclusive Deal 40% Off',
  },
  {
    img: bus4,
    tag: '🛡️ Safe & Reliable',
    title: 'Khulna, Rangpur\n& Beyond',
    subtitle:
      'Covering all major cities. Track your bus live. Instant e-ticket.',
    btn1: 'See Routes',
    btn2: 'Find More',
    route: '/tickets/khulna',
    accent: 'from-orange-900/70 to-orange-800/20',
    badge: 'Best Price Guarantee',
  },
];

// ─── Mobile Slider ───────────────────────────────────────────────
const MobileSlider = ({ slides, current, setCurrent, navigate }) => (
  <div className="md:hidden relative w-full overflow-hidden rounded-2xl mt-4 shadow-lg">
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{ transform: `translateX(-${current * 100}%)` }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className="relative min-w-full h-56 overflow-hidden rounded-2xl flex-shrink-0"
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`}
          />

          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <span className="text-orange-300 text-[10px] font-semibold mb-1">
              {slide.tag}
            </span>
            <h2 className="text-white text-base font-bold leading-snug mb-1">
              {slide.title.replace('\n', ' ')}
            </h2>
            <p className="text-white/70 text-[11px] mb-3 line-clamp-1">
              {slide.subtitle}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(slide.route)}
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-full transition-all shadow"
              >
                {slide.btn1}
              </button>
              <button
                onClick={() => navigate(slide.route)}
                className="text-white/80 text-xs hover:text-orange-300 transition underline underline-offset-2"
              >
                {slide.btn2}
              </button>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow">
            {slide.badge}
          </div>
        </div>
      ))}
    </div>

    {/* Dots */}
    <div className="flex justify-center gap-2 mt-3 pb-1">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrent(i)}
          className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'bg-orange-500 w-5' : 'bg-gray-300 w-2'}`}
        />
      ))}
    </div>
  </div>
);

// ─── Desktop Slider ──────────────────────────────────────────────
const DesktopSlider = ({ slides, current, setCurrent, navigate }) => (
  <div className="hidden md:block relative w-full overflow-hidden mt-6 shadow-xl rounded-3xl">
    {/* Grid background */}
    <div
      className="absolute inset-0 opacity-[0.04] pointer-events-none z-10"
      style={{
        backgroundImage:
          'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{ transform: `translateX(-${current * 100}%)` }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          className="relative min-w-full h-[420px] lg:h-[500px] flex-shrink-0 overflow-hidden"
        >
          <img
            src={slide.img}
            alt={slide.title}
            className="w-full h-full object-cover scale-105 transition-transform duration-700"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`}
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="pl-12 lg:pl-20 max-w-xl">
              <span className="inline-block text-orange-300 text-xs font-semibold tracking-wide mb-3">
                {slide.tag}
              </span>

              <h1 className="text-white text-3xl lg:text-5xl font-bold leading-tight mb-3 whitespace-pre-line drop-shadow-lg">
                {slide.title}
              </h1>

              <p className="text-white/75 text-sm lg:text-base mb-6 max-w-sm leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(slide.route)}
                  className="flex items-center gap-2 px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5"
                >
                  <MdOutlineConfirmationNumber size={17} />
                  {slide.btn1}
                </button>
                <button
                  onClick={() => navigate(slide.route)}
                  className="group flex items-center gap-2 px-5 py-3 text-white/80 hover:text-white font-medium transition-colors"
                >
                  {slide.btn2}
                  <FiArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </button>
              </div>

              {/* Info pills */}
              <div className="flex items-center gap-3 mt-6">
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/20">
                  <FiMapPin size={11} /> 6 Cities Covered
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/20">
                  <FiClock size={11} /> Daily Departures
                </span>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-6 right-8 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            {slide.badge}
          </div>

          {/* Slide number */}
          <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">
            {String(i + 1).padStart(2, '0')} /{' '}
            {String(slides.length).padStart(2, '0')}
          </div>
        </div>
      ))}
    </div>

    {/* Dot indicators */}
    <div className="flex justify-center gap-2 mt-5 pb-1">
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrent(i)}
          className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'bg-orange-500 w-6' : 'bg-gray-300/60 w-2 hover:bg-gray-400'}`}
        />
      ))}
    </div>

    {/* Side nav arrows */}
    <button
      onClick={() => setCurrent((current - 1 + SLIDES.length) % SLIDES.length)}
      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20"
    >
      <FiArrowRight size={18} className="rotate-180" />
    </button>
    <button
      onClick={() => setCurrent((current + 1) % SLIDES.length)}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all border border-white/20"
    >
      <FiArrowRight size={18} />
    </button>
  </div>
);

// ─── Main Export ─────────────────────────────────────────────────
const HeroSlider = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MobileSlider
        slides={SLIDES}
        current={current}
        setCurrent={setCurrent}
        navigate={navigate}
      />
      <DesktopSlider
        slides={SLIDES}
        current={current}
        setCurrent={setCurrent}
        navigate={navigate}
      />
    </>
  );
};

export default HeroSlider;
