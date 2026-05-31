import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { MdFormatQuote } from 'react-icons/md';

const CustomerService = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch('/busFeedback.json')
      .then(res => res.json())
      .then(data => setFeedbacks(data));
  }, []);

  const doubled = [...feedbacks, ...feedbacks];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Header */}
      <div className="relative text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <FaStar size={11} />
          Trusted by Thousands
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Customer{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
            Feedback
          </span>
        </h2>
        <p className="text-blue-300/60 text-sm mt-3">
          Real reviews from real passengers across Bangladesh
        </p>
      </div>

      {/* Marquee track */}
      {feedbacks.length > 0 && (
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-blue-950 to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-blue-950 to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="flex gap-5 animate-marquee hover:pause-marquee">
              {doubled.map((fb, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-64 md:w-72 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-400/40 rounded-3xl p-5 transition-all duration-300 hover:bg-white/8 group"
                >
                  {/* Quote icon */}
                  <MdFormatQuote className="text-orange-400/50 text-3xl mb-2 group-hover:text-orange-400/80 transition-colors" />

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={13}
                        className={
                          i < fb.rating ? 'text-orange-400' : 'text-white/15'
                        }
                      />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-blue-100/75 text-sm leading-relaxed mb-4 line-clamp-3">
                    "{fb.feedback}"
                  </p>

                  {/* User */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-white/8">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <FiUser size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-none">
                        {fb.name}
                      </p>
                      <p className="text-blue-300/50 text-[10px] mt-0.5">
                        Verified Passenger
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom stats */}
      <div className="relative flex flex-wrap items-center justify-center gap-8 mt-12 px-4">
        {[
          { value: '10,000+', label: 'Happy Passengers' },
          { value: '4.8 ★', label: 'Average Rating' },
          { value: '6', label: 'Cities Covered' },
          { value: '99%', label: 'On-Time Arrival' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-orange-400">
              {stat.value}
            </p>
            <p className="text-blue-300/50 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default CustomerService;
