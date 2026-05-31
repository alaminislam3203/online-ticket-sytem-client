import React from 'react';
import appImg from '../assets/app-v2.jpg';
import { FaApple, FaGooglePlay, FaWhatsapp } from 'react-icons/fa';
import { FiCheck, FiSmartphone } from 'react-icons/fi';

const FEATURES = [
  'Faster and easier booking',
  'Get alerts before every departure',
  'Easy access to your tickets',
  'Onboard with digital tickets',
];

const MobileApp = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full">
            <FiSmartphone size={12} />
            Now Available on Mobile
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* LEFT — App image */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-orange-500/15 blur-3xl rounded-full scale-75" />
              <div className="relative w-full max-w-sm mx-auto">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-950/60">
                  <img
                    src={appImg}
                    alt="Voyago Mobile App"
                    className="w-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/30">
                  Free Download
                </div>
                {/* Floating stat */}
                <div className="absolute -bottom-4 -left-4 bg-white/8 backdrop-blur-xl border border-white/15 rounded-2xl px-4 py-2.5 shadow-xl">
                  <p className="text-orange-400 text-lg font-bold leading-none">
                    4.8 ★
                  </p>
                  <p className="text-blue-200/60 text-[10px] mt-0.5">
                    10k+ Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="lg:w-1/2 max-w-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Get More Out of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                Voyago
              </span>{' '}
              with our Mobile App
            </h2>

            <p className="text-blue-300/60 text-sm md:text-base mb-7 leading-relaxed">
              Book intercity bus tickets anytime, anywhere. Get real-time
              updates, manage bookings and travel smarter.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {FEATURES.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-white/5 border border-white/8 rounded-xl px-3.5 py-2.5 hover:border-orange-400/30 hover:bg-white/8 transition-all duration-200"
                >
                  <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck size={11} className="text-emerald-400" />
                  </div>
                  <p className="text-blue-100/80 text-sm">{item}</p>
                </div>
              ))}
            </div>

            {/* Store buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Google Play */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 hover:border-orange-400/40 text-white transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <FaGooglePlay className="text-2xl text-orange-400 group-hover:scale-110 transition-transform" />
                <div className="leading-tight">
                  <p className="text-[10px] text-blue-300/60 uppercase tracking-wide">
                    Get it on
                  </p>
                  <p className="text-sm font-semibold">Google Play</p>
                </div>
              </a>

              {/* App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/10 hover:border-orange-400/40 text-white transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <FaApple className="text-2xl group-hover:scale-110 transition-transform" />
                <div className="leading-tight">
                  <p className="text-[10px] text-blue-300/60 uppercase tracking-wide">
                    Download on the
                  </p>
                  <p className="text-sm font-semibold">App Store</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://api.whatsapp.com/send?phone=8801781540625"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-400/50 text-white transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <FaWhatsapp className="text-2xl text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="leading-tight">
                  <p className="text-[10px] text-emerald-300/60 uppercase tracking-wide">
                    Book on
                  </p>
                  <p className="text-sm font-semibold">WhatsApp</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
