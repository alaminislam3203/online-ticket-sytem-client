import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';
import { AuthContext } from '../Context/AuthContext';
import {
  FaBus,
  FaMapMarkerAlt,
  FaClock,
  FaChair,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaCalendarAlt,
  FaArrowLeft,
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import {
  MdWifi,
  MdOutlineConfirmationNumber,
  MdAcUnit,
  MdLocalDining,
  MdChargingStation,
} from 'react-icons/md';
import { FiArrowRight, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

// ─── City color map ───────────────────────────────────────────────
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
const fallbacks = [
  {
    color: '#06b6d4',
    light: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.3)',
  },
  {
    color: '#84cc16',
    light: 'rgba(132,204,22,0.12)',
    border: 'rgba(132,204,22,0.3)',
  },
];
const getTheme = city => cityColors[city?.toLowerCase()] || fallbacks[0];

// ─── Helpers ──────────────────────────────────────────────────────
const formatDate = d => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
const formatDateShort = d => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
const isBookable = departureDate => {
  if (!departureDate) return false;
  const diff = (new Date(departureDate) - new Date()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 15;
};
const getDaysUntil = departureDate => {
  if (!departureDate) return null;
  const diff = Math.ceil(
    (new Date(departureDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return diff;
};

// perk icon guesser
const perkIcon = perk => {
  const p = perk.toLowerCase();
  if (/wifi|wi-fi/.test(p)) return <MdWifi size={13} />;
  if (/ac|air/.test(p)) return <MdAcUnit size={13} />;
  if (/food|meal|snack|dining/.test(p)) return <MdLocalDining size={13} />;
  if (/charg|usb|power/.test(p)) return <MdChargingStation size={13} />;
  return <FaCheckCircle size={11} />;
};

// ─── Skeleton ─────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div style={{ height: 320, background: '#1e293b', borderRadius: 24 }} />
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{ height: 80, background: '#1e293b', borderRadius: 16 }}
        />
      ))}
    </div>
    <div style={{ height: 200, background: '#1e293b', borderRadius: 16 }} />
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────
const TicketDetails = () => {
  const { cityName, ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const theme = getTheme(cityName);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get(`/api/tickets/${ticketId}`)
      .then(res => setTicket(res.data))
      .catch(err => {
        if (err.response?.status === 404) {
          setError('Ticket not found or unavailable.');
        } else {
          setError('Failed to load ticket. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [ticketId, axiosSecure]);

  const handleBook = async () => {
    if (!user?.email) {
      return Swal.fire({
        title: 'Login Required',
        text: 'Please login to book this ticket.',
        icon: 'warning',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: theme.color,
        confirmButtonText: 'Go to Login',
      }).then(r => r.isConfirmed && navigate('/login'));
    }

    setBooking(true);
    try {
      const res = await axiosSecure.post('/create-checkout-session', {
        ticketId: ticket._id,
        quantity: 1,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      Swal.fire({
        title: 'Payment Error',
        text:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Could not initiate payment. Please try again.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: theme.color,
      });
    } finally {
      setBooking(false);
    }
  };
  const soldOut = ticket?.quantity === 0;
  const bookable = ticket ? isBookable(ticket.departureDate) : false;
  const daysUntil = ticket ? getDaysUntil(ticket.departureDate) : null;
  const isLow = ticket?.quantity > 0 && ticket.quantity <= 5;
  const canBook = !soldOut && bookable;

  const cityLabel = cityName
    ? cityName.charAt(0).toUpperCase() + cityName.slice(1)
    : '';

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #020817; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
        .fade-up-2 { animation: fadeUp 0.45s 0.12s ease both; }
        .fade-up-3 { animation: fadeUp 0.45s 0.20s ease both; }
        .fade-up-4 { animation: fadeUp 0.45s 0.28s ease both; }
        .fade-up-5 { animation: fadeUp 0.45s 0.36s ease both; }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="fade-up flex items-center gap-2 mb-6 text-sm font-medium transition-all duration-200 group"
          style={{ color: '#64748b' }}
          onMouseEnter={e => (e.currentTarget.style.color = theme.color)}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
          >
            <FiArrowLeft size={14} />
          </span>
          Back to {cityLabel} routes
        </button>

        {/* Loading */}
        {loading && <Skeleton />}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-32 fade-up">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '0.5px solid rgba(239,68,68,0.2)',
              }}
            >
              <FiAlertCircle size={36} style={{ color: '#f87171' }} />
            </div>
            <p className="text-xl font-bold mb-2" style={{ color: '#f87171' }}>
              {error}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: theme.light,
                color: theme.color,
                border: `0.5px solid ${theme.border}`,
              }}
            >
              <FiArrowLeft size={13} /> Go Back
            </button>
          </div>
        )}

        {/* Main content */}
        {!loading && !error && ticket && (
          <div className="space-y-5">
            {/* ── Hero card ─────────────────────────────────────── */}
            <div
              className="fade-up-1 relative rounded-3xl overflow-hidden"
              style={{ border: `0.5px solid ${theme.border}` }}
            >
              {/* Background image or gradient */}
              {ticket.image ? (
                <div className="relative h-64 sm:h-80 overflow-hidden">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      transform: imgLoaded ? 'scale(1)' : 'scale(1.04)',
                    }}
                    onLoad={() => setImgLoaded(true)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to bottom, rgba(2,8,23,0.1) 0%, rgba(2,8,23,0.85) 100%)',
                    }}
                  />
                </div>
              ) : (
                <div
                  className="h-56 sm:h-64 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${theme.light}, rgba(2,8,23,0.95))`,
                  }}
                >
                  {/* decorative rings */}
                  {[160, 240, 320].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: s,
                        height: s,
                        borderRadius: '50%',
                        border: `0.5px solid ${theme.color}`,
                        opacity: 0.08 - i * 0.02,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                  <FaBus
                    size={64}
                    style={{ color: theme.color, opacity: 0.18 }}
                  />
                </div>
              )}

              {/* Overlay info (bottom of image) */}
              <div
                style={{
                  position: ticket.image ? 'absolute' : 'relative',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: ticket.image ? 'transparent' : '#0f172a',
                  padding: '24px 28px',
                }}
              >
                {/* Badge row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: theme.light,
                      color: theme.color,
                      border: `0.5px solid ${theme.border}`,
                    }}
                  >
                    <FaMapMarkerAlt size={10} />
                    {cityLabel} · Bus Route
                  </span>
                  {ticket.approved && (
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        color: '#34d399',
                        border: '0.5px solid rgba(16,185,129,0.3)',
                      }}
                    >
                      <FaCheckCircle size={9} /> Verified Operator
                    </span>
                  )}
                  {soldOut && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: '#f87171',
                        border: '0.5px solid rgba(239,68,68,0.3)',
                      }}
                    >
                      Sold Out
                    </span>
                  )}
                  {!soldOut && isLow && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(245,158,11,0.15)',
                        color: '#fbbf24',
                        border: '0.5px solid rgba(245,158,11,0.3)',
                      }}
                    >
                      Only {ticket.quantity} seats left!
                    </span>
                  )}
                  {daysUntil !== null &&
                    daysUntil >= 0 &&
                    daysUntil <= 3 &&
                    !soldOut && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: 'rgba(239,68,68,0.12)',
                          color: '#fca5a5',
                          border: '0.5px solid rgba(239,68,68,0.25)',
                        }}
                      >
                        Departs in {daysUntil === 0 ? 'today' : `${daysUntil}d`}
                      </span>
                    )}
                </div>

                {/* Title */}
                <h1
                  className="text-2xl sm:text-3xl font-extrabold leading-tight mb-1"
                  style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
                >
                  {ticket.title}
                </h1>
                <p className="text-sm" style={{ color: '#64748b' }}>
                  {ticket.from} → {ticket.to}
                </p>
              </div>
            </div>

            {/* ── Route strip ───────────────────────────────────── */}
            <div
              className="fade-up-2 rounded-2xl p-5"
              style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
            >
              <div className="flex items-center justify-between gap-4">
                {/* From */}
                <div className="flex-1">
                  <p
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: '#475569' }}
                  >
                    From
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: theme.light,
                        border: `0.5px solid ${theme.border}`,
                      }}
                    >
                      <FaMapMarkerAlt
                        size={14}
                        style={{ color: theme.color }}
                      />
                    </div>
                    <p
                      className="text-xl font-extrabold"
                      style={{ color: theme.color }}
                    >
                      {ticket.from}
                    </p>
                  </div>
                  {ticket.departureTime && (
                    <p
                      className="text-sm mt-1 font-semibold"
                      style={{ color: '#94a3b8' }}
                    >
                      {ticket.departureTime}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: theme.light,
                      border: `0.5px solid ${theme.border}`,
                    }}
                  >
                    <FaArrowRight size={14} style={{ color: theme.color }} />
                  </div>
                  <p className="text-[10px]" style={{ color: '#334155' }}>
                    Direct
                  </p>
                </div>

                {/* To */}
                <div className="flex-1 text-right">
                  <p
                    className="text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: '#475569' }}
                  >
                    To
                  </p>
                  <div className="flex items-center gap-2 justify-end">
                    <p
                      className="text-xl font-extrabold"
                      style={{ color: '#e2e8f0' }}
                    >
                      {ticket.to}
                    </p>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: '#1e293b',
                        border: '0.5px solid #334155',
                      }}
                    >
                      <FaMapMarkerAlt size={14} style={{ color: '#64748b' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Info grid ─────────────────────────────────────── */}
            <div className="fade-up-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: (
                    <FaCalendarAlt size={14} style={{ color: theme.color }} />
                  ),
                  label: 'Departure Date',
                  value: formatDateShort(ticket.departureDate),
                  sub: formatDate(ticket.departureDate).split(',')[0], // weekday
                },
                {
                  icon: <FaClock size={14} style={{ color: theme.color }} />,
                  label: 'Departure Time',
                  value: ticket.departureTime || '—',
                  sub:
                    daysUntil !== null && daysUntil >= 0
                      ? daysUntil === 0
                        ? 'Today'
                        : `In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`
                      : daysUntil !== null
                        ? 'Past date'
                        : '',
                },
                {
                  icon: (
                    <FaChair
                      size={14}
                      style={{
                        color: soldOut
                          ? '#f87171'
                          : isLow
                            ? '#fbbf24'
                            : theme.color,
                      }}
                    />
                  ),
                  label: 'Seats Available',
                  value: soldOut ? 'Sold Out' : `${ticket.quantity}`,
                  sub: soldOut ? 'No seats' : isLow ? 'Limited!' : 'seats left',
                  valueColor: soldOut
                    ? '#f87171'
                    : isLow
                      ? '#fbbf24'
                      : '#f8fafc',
                },
                {
                  icon: (
                    <FaShieldAlt
                      size={14}
                      style={{ color: ticket.approved ? '#34d399' : '#64748b' }}
                    />
                  ),
                  label: 'Operator Status',
                  value: ticket.approved ? 'Verified' : 'Pending',
                  sub: ticket.approved ? 'Trusted operator' : 'Under review',
                  valueColor: ticket.approved ? '#34d399' : '#94a3b8',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #1e293b',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: '#1e293b' }}
                    >
                      {item.icon}
                    </div>
                    <p
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: '#475569' }}
                    >
                      {item.label}
                    </p>
                  </div>
                  <p
                    className="text-base font-bold"
                    style={{ color: item.valueColor || '#f8fafc' }}
                  >
                    {item.value}
                  </p>
                  {item.sub && (
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: '#475569' }}
                    >
                      {item.sub}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ── Amenities + Description ───────────────────────── */}
            <div className="fade-up-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Perks */}
              {ticket.perks?.length > 0 && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #1e293b',
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-4"
                    style={{ color: '#475569' }}
                  >
                    Included Amenities
                  </p>
                  <div className="space-y-2.5">
                    {ticket.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: theme.light }}
                        >
                          <span style={{ color: theme.color }}>
                            {perkIcon(perk)}
                          </span>
                        </div>
                        <span
                          className="text-sm font-medium"
                          style={{ color: '#cbd5e1' }}
                        >
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description / extra info */}
              <div
                className="rounded-2xl p-5"
                style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: '#475569' }}
                >
                  Trip Information
                </p>
                <div className="space-y-3">
                  {ticket.description ? (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#94a3b8' }}
                    >
                      {ticket.description}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: '#334155' }}>
                      No additional description provided.
                    </p>
                  )}

                  {/* Extra fields if present */}
                  {ticket.stops?.length > 0 && (
                    <div className="mt-3">
                      <p
                        className="text-[11px] uppercase tracking-wider mb-2"
                        style={{ color: '#334155' }}
                      >
                        Stops
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.stops.map((stop, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs"
                            style={{
                              background: '#1e293b',
                              color: '#64748b',
                              border: '0.5px solid #334155',
                            }}
                          >
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Booking panel ─────────────────────────────────── */}
            <div
              className="fade-up-5 rounded-2xl p-6"
              style={{
                background: '#0f172a',
                border: `0.5px solid ${canBook ? theme.border : '#1e293b'}`,
                boxShadow: canBook ? `0 0 40px ${theme.color}0a` : 'none',
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                {/* Price block */}
                <div>
                  <p
                    className="text-[11px] uppercase tracking-widest mb-1"
                    style={{ color: '#475569' }}
                  >
                    Ticket Price
                  </p>
                  <div className="flex items-end gap-2">
                    <span
                      className="text-5xl font-extrabold leading-none"
                      style={{ color: theme.color, letterSpacing: '-0.03em' }}
                    >
                      ৳{ticket.price}
                    </span>
                    <span className="text-sm mb-1" style={{ color: '#475569' }}>
                      / seat
                    </span>
                  </div>
                  {!soldOut && (
                    <p className="text-xs mt-2" style={{ color: '#475569' }}>
                      <span style={{ color: '#64748b' }}>
                        {ticket.quantity} seat{ticket.quantity !== 1 ? 's' : ''}{' '}
                        remaining
                      </span>
                      {isLow && (
                        <span style={{ color: '#fbbf24' }}> · Book fast!</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Action block */}
                <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[200px]">
                  {canBook ? (
                    <button
                      onClick={handleBook}
                      disabled={booking}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
                      style={{ background: theme.color }}
                      onMouseEnter={e => {
                        if (!booking)
                          e.currentTarget.style.filter = 'brightness(0.88)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.filter = 'none';
                      }}
                    >
                      {booking ? (
                        <>
                          <span
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            style={{ animation: 'spin 0.6s linear infinite' }}
                          />
                          Processing…
                        </>
                      ) : (
                        <>
                          <MdOutlineConfirmationNumber size={16} />
                          Book This Ticket
                        </>
                      )}
                    </button>
                  ) : soldOut ? (
                    <div
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        color: '#f87171',
                        border: '0.5px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      Sold Out
                    </div>
                  ) : (
                    <div
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold"
                      style={{
                        background: '#1e293b',
                        color: '#64748b',
                        border: '0.5px solid #334155',
                      }}
                    >
                      <FiAlertCircle size={14} />
                      {daysUntil !== null && daysUntil < 0
                        ? 'Departure passed'
                        : 'Not yet bookable'}
                    </div>
                  )}

                  {/* Notice */}
                  {!soldOut &&
                    !bookable &&
                    daysUntil !== null &&
                    daysUntil > 15 && (
                      <p
                        className="text-[11px] text-center"
                        style={{ color: '#475569' }}
                      >
                        Opens for booking {15 - (daysUntil - 15)} days before
                        departure
                      </p>
                    )}
                  {canBook && (
                    <p
                      className="text-[11px] text-center"
                      style={{ color: '#475569' }}
                    >
                      Secure checkout · Instant confirmation
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Related navigation ────────────────────────────── */}
            <div className="flex items-center justify-between pt-2 pb-6">
              <button
                onClick={() => navigate(`/tickets/${cityName}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: '#0f172a',
                  color: '#64748b',
                  border: '0.5px solid #1e293b',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.color = theme.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                <FiArrowLeft size={13} />
                All {cityLabel} tickets
              </button>

              <button
                onClick={() => navigate('/tickets')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: '#0f172a',
                  color: '#64748b',
                  border: '0.5px solid #1e293b',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.color = theme.color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1e293b';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                Browse all routes
                <FiArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default TicketDetails;
