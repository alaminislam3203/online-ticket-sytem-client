import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';
import { AuthContext } from '../Context/AuthContext';
import {
  FaBus,
  FaMapMarkerAlt,
  FaClock,
  FaChair,
  FaStar,
  FaShieldAlt,
  FaArrowRight,
  FaBolt,
  FaFire,
  FaTag,
  FaCalendarAlt,
  FaTimes,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdWifi, MdOutlineConfirmationNumber, MdAcUnit } from 'react-icons/md';
import { FiArrowRight, FiX, FiFilter } from 'react-icons/fi';

// ─── City color map ──────────────────────────────────────────────
const cityColors = {
  dhaka: {
    color: '#f97316',
    light: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.3)',
  },
  chittagong: {
    color: '#3b82f6',
    light: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
  },
  sylhet: {
    color: '#10b981',
    light: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
  },
  rajshahi: {
    color: '#a855f7',
    light: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
  },
  khulna: {
    color: '#f59e0b',
    light: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
  },
  rangpur: {
    color: '#ec4899',
    light: 'rgba(236,72,153,0.12)',
    border: 'rgba(236,72,153,0.3)',
  },
};

const getTheme = city =>
  cityColors[city?.toLowerCase()] || {
    color: '#f97316',
    light: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.3)',
  };

// ─── Helpers ─────────────────────────────────────────────────────
const isBookable = departureDate => {
  if (!departureDate) return false;
  const today = new Date();
  const departure = new Date(departureDate);
  const diffDays = (departure - today) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 7;
};

const formatDate = d => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─── Ticket Card ─────────────────────────────────────────────────
const TicketCard = ({ bus, theme, onView }) => {
  const isLow = bus.quantity > 0 && bus.quantity <= 5;
  const soldOut = bus.quantity === 0;
  const hasAC = bus.perks?.some(p => /ac|air/i.test(p));
  const hasWifi = bus.perks?.some(p => /wifi|wi-fi/i.test(p));

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col"
      style={{
        background: soldOut ? '#090f1a' : '#0f172a',
        border: '0.5px solid #1e293b',
        opacity: soldOut ? 0.6 : 1,
      }}
      onMouseEnter={e => {
        if (soldOut) return;
        e.currentTarget.style.border = `0.5px solid ${theme.color}50`;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 32px ${theme.color}15`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '0.5px solid #1e293b';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Color strip */}
      <div
        style={{
          height: '2px',
          background: soldOut ? '#334155' : theme.color,
          opacity: 0.7,
        }}
      />

      {/* Image */}
      {bus.image && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={bus.image}
            alt={bus.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #0f172a 10%, transparent 70%)',
            }}
          />
          {bus.approved && (
            <div
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{
                background: 'rgba(16,185,129,0.2)',
                color: '#34d399',
                border: '0.5px solid rgba(16,185,129,0.3)',
              }}
            >
              <FaCheckCircle size={8} /> Verified
            </div>
          )}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(239,68,68,0.2)',
                  color: '#f87171',
                  border: '0.5px solid rgba(239,68,68,0.3)',
                }}
              >
                SOLD OUT
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Title + badge row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: theme.light }}
            >
              <FaBus size={13} style={{ color: theme.color }} />
            </div>
            <h3
              className="text-sm font-bold leading-tight truncate"
              style={{ color: '#f8fafc' }}
            >
              {bus.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasAC && (
              <span
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-semibold"
                style={{
                  background: 'rgba(16,185,129,0.12)',
                  color: '#34d399',
                }}
              >
                <MdAcUnit size={9} /> AC
              </span>
            )}
            {hasWifi && (
              <span
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-semibold"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  color: '#60a5fa',
                }}
              >
                <MdWifi size={9} /> WiFi
              </span>
            )}
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-3">
          <div className="min-w-0 flex-1 text-center">
            <p
              className="text-xs font-bold truncate"
              style={{ color: theme.color }}
            >
              {bus.from}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div style={{ width: 20, height: 1, background: '#1e293b' }} />
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                background: theme.light,
                border: `0.5px solid ${theme.border}`,
              }}
            >
              <FaArrowRight size={7} style={{ color: theme.color }} />
            </div>
            <div style={{ width: 20, height: 1, background: '#1e293b' }} />
          </div>
          <div className="min-w-0 flex-1 text-center">
            <p
              className="text-xs font-bold truncate"
              style={{ color: '#94a3b8' }}
            >
              {bus.to}
            </p>
          </div>
        </div>

        {/* Date & time */}
        <div className="flex items-center gap-3 mb-3">
          {bus.departureDate && (
            <div className="flex items-center gap-1">
              <FaCalendarAlt size={10} style={{ color: '#475569' }} />
              <span className="text-[11px]" style={{ color: '#64748b' }}>
                {formatDate(bus.departureDate)}
              </span>
            </div>
          )}
          {bus.departureTime && (
            <div className="flex items-center gap-1">
              <FaClock size={10} style={{ color: '#475569' }} />
              <span className="text-[11px]" style={{ color: '#64748b' }}>
                {bus.departureTime}
              </span>
            </div>
          )}
        </div>

        {/* Perks */}
        {bus.perks?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bus.perks.slice(0, 3).map((perk, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px]"
                style={{ background: '#1e293b', color: '#64748b' }}
              >
                {perk}
              </span>
            ))}
            {bus.perks.length > 3 && (
              <span className="text-[10px]" style={{ color: '#334155' }}>
                +{bus.perks.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: '0.5px solid #1e293b' }}
        >
          <div>
            <p
              className="text-lg font-extrabold leading-none"
              style={{ color: theme.color }}
            >
              ৳{bus.price}
            </p>
            <p
              className="text-[10px] mt-0.5 font-medium"
              style={{
                color: isLow ? '#f87171' : soldOut ? '#475569' : '#64748b',
              }}
            >
              {soldOut
                ? 'Sold out'
                : isLow
                  ? `Only ${bus.quantity} left!`
                  : `${bus.quantity} seats`}
            </p>
          </div>

          <button
            disabled={soldOut}
            onClick={() => !soldOut && onView(bus)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: soldOut ? '#1e293b' : theme.color }}
            onMouseEnter={e => {
              if (!soldOut) e.currentTarget.style.filter = 'brightness(0.88)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = 'none';
            }}
          >
            View Details <FiArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────
const TicketModal = ({ bus, theme, onClose, onBook }) => {
  if (!bus) return null;
  const bookable = isBookable(bus.departureDate);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#0f172a', border: `0.5px solid ${theme.border}` }}
      >
        {/* Image header */}
        <div className="relative h-44 overflow-hidden">
          {bus.image ? (
            <img
              src={bus.image}
              alt={bus.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: '#1e293b' }}
            >
              <FaBus size={40} style={{ color: theme.color, opacity: 0.4 }} />
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #0f172a 15%, transparent 65%)',
            }}
          />
          <div
            className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: theme.light,
              color: theme.color,
              border: `0.5px solid ${theme.border}`,
            }}
          >
            <FaBus size={10} /> {bus.title}
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(15,23,42,0.8)', color: '#94a3b8' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#f8fafc';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <FiX size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Route row */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: '#475569' }}
              >
                From
              </p>
              <p
                className="text-lg font-bold mt-0.5"
                style={{ color: theme.color }}
              >
                {bus.from}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: theme.light,
                border: `0.5px solid ${theme.border}`,
              }}
            >
              <FaArrowRight size={13} style={{ color: theme.color }} />
            </div>
            <div className="text-right">
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: '#475569' }}
              >
                To
              </p>
              <p
                className="text-lg font-bold mt-0.5"
                style={{ color: '#e2e8f0' }}
              >
                {bus.to}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div
            className="grid grid-cols-2 gap-3 p-4 rounded-xl"
            style={{ background: '#1e293b' }}
          >
            {[
              {
                label: 'Departure Date',
                value: formatDate(bus.departureDate),
                icon: <FaCalendarAlt size={11} />,
              },
              {
                label: 'Departure Time',
                value: bus.departureTime || '—',
                icon: <FaClock size={11} />,
              },
              {
                label: 'Seats Available',
                value: bus.quantity > 0 ? `${bus.quantity} seats` : 'Sold Out',
                icon: <FaChair size={11} />,
              },
              {
                label: 'Status',
                value: bus.approved ? 'Verified' : 'Pending',
                icon: <FaShieldAlt size={11} />,
              },
            ].map((item, i) => (
              <div key={i}>
                <div
                  className="flex items-center gap-1 mb-1"
                  style={{ color: '#475569' }}
                >
                  {item.icon}
                  <span className="text-[10px] uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: '#e2e8f0' }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Perks */}
          {bus.perks?.length > 0 && (
            <div>
              <p
                className="text-[10px] uppercase tracking-wider mb-2"
                style={{ color: '#475569' }}
              >
                Included Amenities
              </p>
              <div className="flex flex-wrap gap-1.5">
                {bus.perks.map((perk, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      background: '#1e293b',
                      color: '#94a3b8',
                      border: '0.5px solid #334155',
                    }}
                  >
                    <FaCheckCircle size={9} style={{ color: theme.color }} />
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Price + action */}
          <div
            className="flex items-center justify-between pt-4"
            style={{ borderTop: '0.5px solid #1e293b' }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: '#475569' }}
              >
                Total Price
              </p>
              <p
                className="text-3xl font-extrabold mt-0.5"
                style={{ color: theme.color }}
              >
                ৳{bus.price}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#64748b', border: '0.5px solid #1e293b' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.color = '#94a3b8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                Close
              </button>

              {bus.quantity > 0 && bookable ? (
                <button
                  onClick={() => onBook(bus)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                  style={{ background: theme.color }}
                  onMouseEnter={e => {
                    e.currentTarget.style.filter = 'brightness(0.88)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <MdOutlineConfirmationNumber size={15} />
                  Book Now
                </button>
              ) : (
                <div
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    color: '#f87171',
                    border: '0.5px solid rgba(239,68,68,0.2)',
                  }}
                >
                  {bus.quantity === 0 ? 'Sold Out' : 'Unavailable'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse"
    style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
  >
    <div style={{ height: 2, background: '#1e293b' }} />
    <div style={{ height: 144, background: '#1e293b' }} />
    <div className="p-4 space-y-3">
      <div
        style={{
          height: 12,
          width: '60%',
          background: '#1e293b',
          borderRadius: 6,
        }}
      />
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
          width: '40%',
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
            height: 32,
            width: 100,
            background: '#1e293b',
            borderRadius: 10,
          }}
        />
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────
const CityTickets = () => {
  const { cityName } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [tickets, setTickets] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const theme = getTheme(cityName);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get('/api/tickets?limit=1000')
      .then(res => {
        const filtered = (res.data.tickets || []).filter(
          t => t.from?.toLowerCase() === cityName?.toLowerCase(),
        );
        setTickets(filtered);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, [cityName, axiosSecure]);

  const handleBook = async bus => {
    try {
      if (!user?.email) {
        return Swal.fire({
          title: 'Login Required',
          text: 'Please login to book a ticket',
          icon: 'warning',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: theme.color,
        });
      }
      const res = await axiosSecure.post('/create-checkout-session', {
        ticketId: bus._id,
        email: user.email,
        price: bus.price,
        title: bus.title,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch {
      Swal.fire({
        title: 'Error',
        text: 'Payment failed. Please try again.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: theme.color,
      });
    }
  };

  const filters = ['All', 'Available', 'AC', 'Bookable'];
  const filteredTickets = tickets.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Available') return t.quantity > 0;
    if (filter === 'AC') return t.perks?.some(p => /ac|air/i.test(p));
    if (filter === 'Bookable')
      return t.quantity > 0 && isBookable(t.departureDate);
    return true;
  });

  const cityLabel = cityName
    ? cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase()
    : '';

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{
              background: theme.light,
              border: `0.5px solid ${theme.border}`,
              color: theme.color,
            }}
          >
            <FaMapMarkerAlt size={11} />
            {cityLabel} · Bus Routes
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1
                className="text-3xl sm:text-4xl font-extrabold"
                style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
              >
                Tickets from{' '}
                <span style={{ color: theme.color }}>{cityLabel}</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>
                {loading
                  ? 'Loading...'
                  : `${tickets.length} routes found — updated live`}
              </p>
            </div>

            {/* Quick stats */}
            {!loading && tickets.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: 'Total', value: tickets.length },
                  {
                    label: 'Available',
                    value: tickets.filter(t => t.quantity > 0).length,
                  },
                  {
                    label: 'Bookable',
                    value: tickets.filter(
                      t => t.quantity > 0 && isBookable(t.departureDate),
                    ).length,
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
                      style={{ color: theme.color }}
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

        {/* Filter bar */}
        <div
          className="flex items-center gap-2 mb-6 p-1 rounded-xl w-fit"
          style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
        >
          <FiFilter size={13} style={{ color: '#475569', marginLeft: 8 }} />
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: filter === f ? theme.color : 'transparent',
                color: filter === f ? '#fff' : '#64748b',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ borderTop: '0.5px solid #1e293b', marginBottom: 24 }} />

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
            >
              <FaBus size={28} style={{ color: '#334155' }} />
            </div>
            <p className="text-lg font-semibold" style={{ color: '#475569' }}>
              {tickets.length === 0
                ? `No tickets from ${cityLabel}`
                : 'No tickets match this filter'}
            </p>
            <p className="text-sm mt-1" style={{ color: '#334155' }}>
              {tickets.length > 0
                ? 'Try a different filter'
                : 'Check back soon for new routes'}
            </p>
            {filter !== 'All' && (
              <button
                onClick={() => setFilter('All')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: theme.light,
                  color: theme.color,
                  border: `0.5px solid ${theme.border}`,
                }}
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTickets.map(bus => (
              <TicketCard
                key={bus._id}
                bus={bus}
                theme={theme}
                onView={setSelectedBus}
              />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <div
            className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ border: '0.5px solid #1e293b' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: '#f8fafc' }}>
                Can't find your route?
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                Our support team is available 24/7 to help you.
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 flex-shrink-0"
              style={{ background: theme.color }}
              onMouseEnter={e => {
                e.currentTarget.style.filter = 'brightness(0.88)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.filter = 'none';
              }}
              onClick={() => (window.location.href = '/contact')}
            >
              Contact Support <FiArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedBus && (
        <TicketModal
          bus={selectedBus}
          theme={theme}
          onClose={() => setSelectedBus(null)}
          onBook={handleBook}
        />
      )}
    </div>
  );
};

export default CityTickets;
