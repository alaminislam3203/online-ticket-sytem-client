import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import {
  FaMapMarkerAlt,
  FaBus,
  FaClock,
  FaChair,
  FaBolt,
  FaStar,
  FaArrowRight,
  FaFire,
  FaTag,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdOutlineConfirmationNumber, MdWifi, MdAcUnit } from 'react-icons/md';
import { FiArrowRight, FiFilter, FiChevronDown } from 'react-icons/fi';
import UseAxiosSecure from '../hooks/UseAxiosSecure';

// ─── City color map ───────────────────────────────────────────────
const cityColors = {
  dhaka: {
    color: '#f97316',
    lightColor: 'rgba(249,115,22,0.12)',
    borderColor: 'rgba(249,115,22,0.3)',
  },
  chittagong: {
    color: '#3b82f6',
    lightColor: 'rgba(59,130,246,0.12)',
    borderColor: 'rgba(59,130,246,0.3)',
  },
  sylhet: {
    color: '#10b981',
    lightColor: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.3)',
  },
  rajshahi: {
    color: '#a855f7',
    lightColor: 'rgba(168,85,247,0.12)',
    borderColor: 'rgba(168,85,247,0.3)',
  },
  khulna: {
    color: '#f59e0b',
    lightColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.3)',
  },
  rangpur: {
    color: '#ec4899',
    lightColor: 'rgba(236,72,153,0.12)',
    borderColor: 'rgba(236,72,153,0.3)',
  },
};

// Fallback palette cycling for cities not in the map
const fallbackPalettes = [
  {
    color: '#06b6d4',
    lightColor: 'rgba(6,182,212,0.12)',
    borderColor: 'rgba(6,182,212,0.3)',
  },
  {
    color: '#84cc16',
    lightColor: 'rgba(132,204,22,0.12)',
    borderColor: 'rgba(132,204,22,0.3)',
  },
  {
    color: '#f43f5e',
    lightColor: 'rgba(244,63,94,0.12)',
    borderColor: 'rgba(244,63,94,0.3)',
  },
];

const getCityTheme = (city, index = 0) => {
  const key = city?.toLowerCase();
  return cityColors[key] || fallbackPalettes[index % fallbackPalettes.length];
};

const formatDate = d => {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─── Skeleton card ────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse"
    style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
  >
    <div style={{ height: 2, background: '#1e293b' }} />
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div
          style={{
            width: 32,
            height: 32,
            background: '#1e293b',
            borderRadius: 8,
          }}
        />
        <div
          style={{
            height: 12,
            width: '55%',
            background: '#1e293b',
            borderRadius: 6,
          }}
        />
      </div>
      <div
        style={{
          height: 10,
          width: '80%',
          background: '#1e293b',
          borderRadius: 6,
        }}
      />
      <div
        style={{
          height: 10,
          width: '50%',
          background: '#1e293b',
          borderRadius: 6,
        }}
      />
      <div
        className="flex justify-between pt-3"
        style={{ borderTop: '0.5px solid #1e293b' }}
      >
        <div
          style={{
            height: 20,
            width: 60,
            background: '#1e293b',
            borderRadius: 6,
          }}
        />
        <div
          style={{
            height: 28,
            width: 28,
            background: '#1e293b',
            borderRadius: 8,
          }}
        />
      </div>
    </div>
  </div>
);

// ─── Single Ticket Card ───────────────────────────────────────────
const TicketCard = ({ ticket, cityColor, navigate }) => {
  const isLowSeat = ticket.quantity > 0 && ticket.quantity <= 5;
  const soldOut = ticket.quantity === 0;
  const hasAC = ticket.perks?.some(p => /ac|air/i.test(p));
  const hasWifi = ticket.perks?.some(p => /wifi|wi-fi/i.test(p));
  const dateStr = formatDate(ticket.departureDate);

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{
        background: soldOut ? '#090f1a' : '#0f172a',
        border: '0.5px solid #1e293b',
        opacity: soldOut ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (soldOut) return;
        e.currentTarget.style.border = `0.5px solid ${cityColor}50`;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${cityColor}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '0.5px solid #1e293b';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onClick={() =>
        !soldOut &&
        navigate(`/tickets/${ticket.from?.toLowerCase()}/${ticket._id}`)
      }
    >
      {/* Top color strip */}
      <div
        style={{
          height: '2px',
          background: cityColor,
          opacity: soldOut ? 0.3 : 0.6,
        }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${cityColor}18` }}
            >
              <FaBus size={14} style={{ color: cityColor }} />
            </div>
            <div>
              <p
                className="text-xs font-semibold leading-tight"
                style={{ color: '#e2e8f0' }}
              >
                {ticket.title}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                {hasAC && (
                  <>
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: '#34d399' }}
                    >
                      AC
                    </span>
                    <MdAcUnit size={10} style={{ color: '#34d399' }} />
                  </>
                )}
                {hasWifi && <MdWifi size={10} style={{ color: '#60a5fa' }} />}
                {ticket.approved && (
                  <>
                    <span className="text-[10px]" style={{ color: '#334155' }}>
                      ·
                    </span>
                    <FaCheckCircle size={9} style={{ color: '#34d399' }} />
                    <span className="text-[10px]" style={{ color: '#34d399' }}>
                      Verified
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {soldOut && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#f87171',
              }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-center min-w-[52px]">
            {ticket.departureTime && (
              <p
                className="text-base font-bold leading-none"
                style={{ color: '#f8fafc' }}
              >
                {ticket.departureTime}
              </p>
            )}
            <p
              className="text-[10px] mt-1 font-medium"
              style={{ color: cityColor }}
            >
              {ticket.from}
            </p>
          </div>

          <div className="flex-1 flex items-center gap-1">
            <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: `${cityColor}15`,
                border: `0.5px solid ${cityColor}40`,
              }}
            >
              <FaArrowRight size={8} style={{ color: cityColor }} />
            </div>
            <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
          </div>

          <div className="text-center min-w-[52px]">
            <p
              className="text-base font-bold leading-none"
              style={{ color: '#f8fafc' }}
            >
              &nbsp;
            </p>
            <p
              className="text-[10px] mt-1 font-medium"
              style={{ color: '#64748b' }}
            >
              {ticket.to}
            </p>
          </div>
        </div>

        {/* Date */}
        {dateStr && (
          <div className="flex items-center gap-1 mb-3">
            <FaCalendarAlt size={10} style={{ color: '#475569' }} />
            <span className="text-[11px]" style={{ color: '#64748b' }}>
              {dateStr}
            </span>
          </div>
        )}

        {/* Perks */}
        {ticket.perks?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ticket.perks.slice(0, 2).map((perk, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px]"
                style={{ background: '#1e293b', color: '#64748b' }}
              >
                {perk}
              </span>
            ))}
            {ticket.perks.length > 2 && (
              <span className="text-[10px]" style={{ color: '#334155' }}>
                +{ticket.perks.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '0.5px solid #1e293b' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FaChair
                size={11}
                style={{
                  color: isLowSeat
                    ? '#f87171'
                    : soldOut
                      ? '#334155'
                      : '#475569',
                }}
              />
              <span
                className="text-[11px] font-medium"
                style={{
                  color: isLowSeat
                    ? '#f87171'
                    : soldOut
                      ? '#475569'
                      : '#64748b',
                }}
              >
                {soldOut
                  ? 'Sold out'
                  : isLowSeat
                    ? `Only ${ticket.quantity} left!`
                    : `${ticket.quantity} seats`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-bold" style={{ color: cityColor }}>
              ৳{ticket.price}
            </span>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
              style={{ background: soldOut ? '#1e293b' : cityColor }}
            >
              <FiArrowRight size={13} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── City Section ─────────────────────────────────────────────────
const CitySection = ({ cityName, tickets, theme, navigate, cityIndex }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? tickets : tickets.slice(0, 5);
  const slug = cityName.toLowerCase();

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: theme.lightColor,
              border: `0.5px solid ${theme.borderColor}`,
            }}
          >
            <FaMapMarkerAlt size={16} style={{ color: theme.color }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#f8fafc' }}>
              {cityName}
            </h2>
            <p className="text-xs" style={{ color: '#475569' }}>
              {tickets.length} routes available
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold ml-1"
            style={{
              background: theme.lightColor,
              color: theme.color,
              border: `0.5px solid ${theme.borderColor}`,
            }}
          >
            {tickets.filter(t => t.perks?.some(p => /ac|air/i.test(p))).length}{' '}
            AC buses
          </div>
        </div>

        <button
          onClick={() => navigate(`/tickets/${slug}`)}
          className="flex items-center gap-1.5 text-xs font-semibold transition-opacity"
          style={{ color: theme.color }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          View all <FiArrowRight size={13} />
        </button>
      </div>

      {/* Ticket grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {visible.map(ticket => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            cityColor={theme.color}
            navigate={navigate}
          />
        ))}
      </div>

      {tickets.length > 5 && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: theme.lightColor,
              color: theme.color,
              border: `0.5px solid ${theme.borderColor}`,
            }}
          >
            <FiChevronDown
              size={14}
              style={{
                transform: showAll ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
            {showAll ? 'Show less' : `Show all ${tickets.length} routes`}
          </button>
        </div>
      )}
    </section>
  );
};

// ─── Skeleton section ─────────────────────────────────────────────
const SkeletonSection = () => (
  <section className="mb-12">
    <div className="flex items-center gap-3 mb-5">
      <div
        style={{
          width: 40,
          height: 40,
          background: '#1e293b',
          borderRadius: 12,
        }}
      />
      <div className="space-y-1">
        <div
          style={{
            height: 14,
            width: 100,
            background: '#1e293b',
            borderRadius: 6,
          }}
        />
        <div
          style={{
            height: 10,
            width: 80,
            background: '#1e293b',
            borderRadius: 6,
          }}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </section>
);

// ─── Main Component ───────────────────────────────────────────────
const AllTickets = () => {
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'AC', 'Non-AC', 'Available', 'Bookable'];

  useEffect(() => {
    setLoading(true);
    setError(null);
    axiosSecure
      .get('/api/tickets?limit=1000')
      .then(res => setAllTickets(res.data.tickets || []))
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load tickets. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  // Group tickets by "from" city
  const groupedByCity = allTickets.reduce((acc, ticket) => {
    const city = ticket.from || 'Unknown';
    if (!acc[city]) acc[city] = [];
    acc[city].push(ticket);
    return acc;
  }, {});

  // Apply filter within each city group
  const isBookable = t => {
    if (!t.departureDate) return false;
    const diff =
      (new Date(t.departureDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  const applyFilter = tickets => {
    switch (activeFilter) {
      case 'AC':
        return tickets.filter(t => t.perks?.some(p => /ac|air/i.test(p)));
      case 'Non-AC':
        return tickets.filter(t => !t.perks?.some(p => /ac|air/i.test(p)));
      case 'Available':
        return tickets.filter(t => t.quantity > 0);
      case 'Bookable':
        return tickets.filter(t => t.quantity > 0 && isBookable(t));
      default:
        return tickets;
    }
  };

  const filteredCities = Object.entries(groupedByCity)
    .map(([city, tickets], index) => ({
      city,
      tickets: applyFilter(tickets),
      theme: getCityTheme(city, index),
    }))
    .filter(entry => entry.tickets.length > 0);

  const totalTickets = allTickets.length;
  const uniqueCities = Object.keys(groupedByCity).length;
  const uniqueOperators = [...new Set(allTickets.map(t => t.title))].length;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(249,115,22,0.12)',
              border: '0.5px solid rgba(249,115,22,0.3)',
              color: '#fb923c',
            }}
          >
            <MdOutlineConfirmationNumber size={13} />
            Live Ticket Availability
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-extrabold leading-tight"
                style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
              >
                All Bus Routes
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#64748b' }}>
                {loading
                  ? 'Loading tickets...'
                  : `${totalTickets} tickets across ${uniqueCities} cities — updated live`}
              </p>
            </div>

            {/* Stats pills */}
            {!loading && (
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: 'Cities', value: uniqueCities, color: '#f97316' },
                  {
                    label: 'Operators',
                    value: uniqueOperators,
                    color: '#3b82f6',
                  },
                  {
                    label: 'Available',
                    value: allTickets.filter(t => t.quantity > 0).length,
                    color: '#10b981',
                  },
                ].map(s => (
                  <div
                    key={s.label}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{
                      background: '#0f172a',
                      border: '0.5px solid #1e293b',
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </span>
                    <span className="text-xs" style={{ color: '#475569' }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className="flex items-center gap-2 mb-8 p-1 rounded-xl w-fit"
          style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
        >
          <FiFilter size={14} style={{ color: '#475569', marginLeft: '8px' }} />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: activeFilter === f ? '#f97316' : 'transparent',
                color: activeFilter === f ? '#fff' : '#64748b',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{ borderTop: '0.5px solid #1e293b', marginBottom: '32px' }}
        />

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '0.5px solid rgba(239,68,68,0.2)',
              }}
            >
              <FaBus size={28} style={{ color: '#f87171' }} />
            </div>
            <p className="text-lg font-semibold" style={{ color: '#f87171' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: 'rgba(249,115,22,0.12)',
                color: '#fb923c',
                border: '0.5px solid rgba(249,115,22,0.3)',
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <>
            <SkeletonSection />
            <SkeletonSection />
          </>
        )}

        {/* City Sections */}
        {!loading &&
          !error &&
          (filteredCities.length > 0 ? (
            filteredCities.map((entry, index) => (
              <CitySection
                key={entry.city}
                cityName={entry.city}
                tickets={entry.tickets}
                theme={entry.theme}
                navigate={navigate}
                cityIndex={index}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
              >
                <FaBus size={28} style={{ color: '#334155' }} />
              </div>
              <p className="text-lg font-semibold" style={{ color: '#475569' }}>
                No tickets found
              </p>
              <p className="text-sm mt-1" style={{ color: '#334155' }}>
                Try a different filter
              </p>
              <button
                onClick={() => setActiveFilter('All')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: 'rgba(249,115,22,0.12)',
                  color: '#fb923c',
                  border: '0.5px solid rgba(249,115,22,0.3)',
                }}
              >
                Clear filter
              </button>
            </div>
          ))}

        {/* Bottom CTA */}
        {!loading && !error && (
          <div
            className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ border: '0.5px solid #1e293b' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: '#f8fafc' }}>
                Can't find your route?
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                Contact our support team — we'll find you a bus.
              </p>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex-shrink-0"
              style={{ background: '#f97316' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#ea580c')}
              onMouseLeave={e => (e.currentTarget.style.background = '#f97316')}
            >
              Contact Support <FiArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
