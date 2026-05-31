import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiMapPin, FiCalendar, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';

const cities = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Rangpur',
];

const SearchBar = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [swapping, setSwapping] = useState(false);
  const navigate = useNavigate();

  const handleSwap = () => {
    setSwapping(true);
    setTimeout(() => setSwapping(false), 400);
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert('Please select From, To and Date');
      return;
    }
    if (from === to) {
      alert('From and To cannot be same');
      return;
    }
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative w-full py-16 md:py-24 flex items-center justify-center">
      <div className="relative w-full max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <MdOutlineConfirmationNumber size={13} />
            Fast & Easy Booking
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Book Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
              Bus Ticket
            </span>
          </h2>
          <p className="text-blue-300/70 text-sm mt-2">
            Search from 6 cities · Instant e-ticket · Best price guaranteed
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* From / Swap / To row */}
          <div className="flex flex-col md:flex-row items-stretch gap-3 mb-3">
            {/* FROM */}
            <div className="flex-1 group">
              <label className="text-[10px] font-semibold text-blue-300/60 uppercase tracking-wider px-1 mb-1 block">
                From
              </label>
              <div className="flex items-center gap-2.5 bg-white/8 hover:bg-white/12 border border-white/10 group-focus-within:border-orange-400/60 rounded-2xl px-4 py-3.5 transition-all duration-200">
                <FiMapPin className="text-orange-400 flex-shrink-0" size={17} />
                <select
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" disabled style={{ background: '#1e3a5f' }}>
                    Select city
                  </option>
                  {cities.map(city => (
                    <option
                      key={city}
                      value={city}
                      style={{ background: '#1e3a5f' }}
                    >
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap */}
            <div className="flex items-end justify-center pb-1 md:pt-5">
              <button
                onClick={handleSwap}
                className="w-10 h-10 bg-orange-500 hover:bg-orange-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <FiRefreshCw
                  size={16}
                  className={swapping ? 'animate-spin' : ''}
                />
              </button>
            </div>

            {/* TO */}
            <div className="flex-1 group">
              <label className="text-[10px] font-semibold text-blue-300/60 uppercase tracking-wider px-1 mb-1 block">
                To
              </label>
              <div className="flex items-center gap-2.5 bg-white/8 hover:bg-white/12 border border-white/10 group-focus-within:border-orange-400/60 rounded-2xl px-4 py-3.5 transition-all duration-200">
                <FiMapPin
                  className="text-orange-400 flex-shrink-0 rotate-180"
                  size={17}
                />
                <select
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" disabled style={{ background: '#1e3a5f' }}>
                    Select city
                  </option>
                  {cities.map(city => (
                    <option
                      key={city}
                      value={city}
                      style={{ background: '#1e3a5f' }}
                    >
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date + Search row */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* DATE */}
            <div className="flex-1 group">
              <label className="text-[10px] font-semibold text-blue-300/60 uppercase tracking-wider px-1 mb-1 block">
                Travel Date
              </label>
              <div className="flex items-center gap-2.5 bg-white/8 hover:bg-white/12 border border-white/10 group-focus-within:border-orange-400/60 rounded-2xl px-4 py-3.5 transition-all duration-200">
                <FiCalendar
                  className="text-orange-400 flex-shrink-0"
                  size={17}
                />
                <input
                  type="date"
                  value={date}
                  min={today}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* SEARCH BUTTON */}
            <div className="md:w-48">
              <label className="text-[10px] font-semibold text-transparent uppercase tracking-wider px-1 mb-1 block select-none">
                &nbsp;
              </label>
              <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-yellow-400 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-400/40 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <FiSearch size={16} />
                Search Bus
              </button>
            </div>
          </div>

          {/* Bottom trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-5 border-t border-white/8">
            {[
              '✅ Instant Confirmation',
              '🔒 Secure Payment',
              '🎟️ E-Ticket',
              '🔄 Easy Refund',
            ].map(item => (
              <span
                key={item}
                className="text-blue-300/50 text-[11px] font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
