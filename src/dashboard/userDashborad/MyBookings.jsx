import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../Context/AuthContext';
import UseAxiosSecure from '../hooks/UseAxiosSecure';
import {
  FaBus,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaBoxes,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { FiInbox, FiAlertCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

// ─── Status config ────────────────────────────────────────────────
const statusConfig = s => {
  const v = s?.toLowerCase();
  if (v === 'approved' || v === 'accepted')
    return {
      bg: 'rgba(16,185,129,0.12)',
      color: '#34d399',
      border: 'rgba(16,185,129,0.3)',
      label: 'Accepted',
    };
  if (v === 'rejected')
    return {
      bg: 'rgba(239,68,68,0.12)',
      color: '#f87171',
      border: 'rgba(239,68,68,0.3)',
      label: 'Rejected',
    };
  if (v === 'paid')
    return {
      bg: 'rgba(59,130,246,0.12)',
      color: '#60a5fa',
      border: 'rgba(59,130,246,0.3)',
      label: 'Paid',
    };
  return {
    bg: 'rgba(245,158,11,0.12)',
    color: '#fbbf24',
    border: 'rgba(245,158,11,0.3)',
    label: 'Pending',
  };
};

const formatDate = d => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─── 12-hour time format ──────────────────────────────────────────
const formatTime12h = t => {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

// ─── Countdown hook ───────────────────────────────────────────────
const useCountdown = (departureDate, departureTime) => {
  const getTarget = () => {
    if (!departureDate) return null;
    const dateStr = departureTime
      ? `${departureDate}T${departureTime}`
      : `${departureDate}T00:00:00`;
    return new Date(dateStr).getTime();
  };

  const calc = () => {
    const target = getTarget();
    if (!target) return null;
    const diff = target - Date.now();
    if (diff <= 0) return { expired: true, label: 'Departed' };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const label =
      d > 0
        ? `${d}d ${h}h ${String(m).padStart(2, '0')}m`
        : h > 0
          ? `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
          : `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    return { expired: false, label };
  };

  const [countdown, setCountdown] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(id);
  }, [departureDate, departureTime]);

  return countdown;
};

// ─── Single Booking Card ──────────────────────────────────────────
const BookingCard = ({ booking, onPay, paying }) => {
  const sc = statusConfig(booking.status);
  const countdown = useCountdown(booking.departureDate, booking.departureTime);
  const isAccepted = ['approved', 'accepted'].includes(
    booking.status?.toLowerCase(),
  );
  const isRejected = booking.status?.toLowerCase() === 'rejected';
  const isPaid = booking.status?.toLowerCase() === 'paid';
  const canPay = isAccepted && countdown && !countdown.expired;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#334155')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
    >
      {/* ── Top strip: title + status ── */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: '#1e293b' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FaTicketAlt size={11} style={{ color: '#f97316', flexShrink: 0 }} />
          <p
            className="text-[12px] md:text-sm font-semibold truncate"
            style={{ color: '#e2e8f0' }}
          >
            {booking.title || 'Ticket'}
          </p>
        </div>
        <span
          className="text-[9px] md:text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ml-2"
          style={{
            background: sc.bg,
            color: sc.color,
            border: `0.5px solid ${sc.border}`,
          }}
        >
          {sc.label}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex gap-3">
        {/* Image */}
        {booking.image && (
          <img
            src={booking.image}
            alt={booking.title}
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover flex-shrink-0 border"
            style={{ borderColor: '#1e293b' }}
          />
        )}
        {!booking.image && (
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(249,115,22,0.08)',
              border: '0.5px solid rgba(249,115,22,0.2)',
            }}
          >
            <FaBus size={20} style={{ color: '#f97316', opacity: 0.5 }} />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Route */}
          <div className="flex items-center gap-1.5 text-[11px] md:text-xs">
            <span className="font-bold" style={{ color: '#f97316' }}>
              {booking.from || '—'}
            </span>
            <FaArrowRight size={8} style={{ color: '#334155' }} />
            <span style={{ color: '#64748b' }}>{booking.to || '—'}</span>
            {booking.busType && (
              <span
                className="px-1.5 py-0.5 rounded text-[9px]"
                style={{ background: '#1e293b', color: '#475569' }}
              >
                {booking.busType}
              </span>
            )}
          </div>

          {/* Boarding → Drop */}
          {(booking.boardingPoint || booking.dropPoint) && (
            <div className="flex items-center gap-1.5 text-[10px] md:text-[11px]">
              <span style={{ color: '#34d399' }}>
                ↑ {booking.boardingPoint || '—'}
              </span>
              <span style={{ color: '#334155' }}>·</span>
              <span style={{ color: '#60a5fa' }}>
                ↓ {booking.dropPoint || '—'}
              </span>
            </div>
          )}

          {/* Date + Time */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <FaCalendarAlt size={9} style={{ color: '#475569' }} />
              <span
                className="text-[10px] md:text-[11px]"
                style={{ color: '#64748b' }}
              >
                {formatDate(booking.departureDate)}
              </span>
            </div>
            {booking.departureTime && (
              <div className="flex items-center gap-1">
                <FaClock size={9} style={{ color: '#475569' }} />
                <span
                  className="text-[10px] md:text-[11px]"
                  style={{ color: '#64748b' }}
                >
                  {formatTime12h(booking.departureTime)}
                </span>
              </div>
            )}
          </div>

          {/* Qty + Price */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <FaBoxes size={9} style={{ color: '#475569' }} />
              <span
                className="text-[10px] md:text-[11px]"
                style={{ color: '#64748b' }}
              >
                Qty:{' '}
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>
                  {booking.quantity || 1}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaMoneyBillWave size={9} style={{ color: '#34d399' }} />
              <span
                className="text-[10px] md:text-[11px] font-bold"
                style={{ color: '#34d399' }}
              >
                ৳{Number(booking.price || 0).toLocaleString('en-BD')}
              </span>
            </div>
          </div>

          {/* Passenger name + mobile */}
          {(booking.customerName || booking.mobile) && (
            <div className="flex items-center gap-3 flex-wrap">
              {booking.customerName && (
                <span className="text-[10px]" style={{ color: '#475569' }}>
                  👤 {booking.customerName}
                </span>
              )}
              {booking.mobile && (
                <span className="text-[10px]" style={{ color: '#475569' }}>
                  📞 {booking.mobile}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom: Countdown + Action ── */}
      <div
        className="px-4 py-3 flex items-center justify-between gap-3 border-t"
        style={{ borderColor: '#1e293b' }}
      >
        {/* Countdown */}
        <div>
          {!isRejected && countdown && !countdown.expired && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  background: isAccepted
                    ? '#34d399'
                    : isPaid
                      ? '#60a5fa'
                      : '#fbbf24',
                }}
              />
              <span
                className="text-[10px] md:text-[11px] font-mono font-semibold"
                style={{ color: '#64748b' }}
              >
                {countdown.label}
              </span>
            </div>
          )}
          {countdown?.expired && !isRejected && (
            <div className="flex items-center gap-1">
              <FiAlertCircle size={10} style={{ color: '#f87171' }} />
              <span className="text-[10px]" style={{ color: '#f87171' }}>
                Departed
              </span>
            </div>
          )}
          {isRejected && (
            <span className="text-[10px]" style={{ color: '#475569' }}>
              Booking rejected
            </span>
          )}
        </div>

        {/* Pay Now button — only when Accepted & not departed */}
        {isAccepted && !isPaid && (
          <button
            onClick={() => onPay(booking)}
            disabled={!canPay || paying === booking._id}
            className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canPay ? 'rgba(99,102,241,0.15)' : '#1e293b',
              color: canPay ? '#818cf8' : '#475569',
              border: `0.5px solid ${canPay ? 'rgba(99,102,241,0.4)' : '#334155'}`,
            }}
          >
            {paying === booking._id ? (
              <>
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />{' '}
                Processing…
              </>
            ) : countdown?.expired ? (
              <>
                <FiAlertCircle size={10} /> Payment Expired
              </>
            ) : (
              <>💳 Pay Now</>
            )}
          </button>
        )}

        {isPaid && (
          <span
            className="text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-xl"
            style={{
              background: 'rgba(59,130,246,0.1)',
              color: '#60a5fa',
              border: '0.5px solid rgba(59,130,246,0.3)',
            }}
          >
            ✓ Paid
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="rounded-2xl overflow-hidden animate-pulse"
    style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
  >
    <div
      className="px-4 py-3 border-b flex justify-between"
      style={{ borderColor: '#1e293b' }}
    >
      <div
        style={{
          height: 12,
          width: '50%',
          background: '#1e293b',
          borderRadius: 6,
        }}
      />
      <div
        style={{
          height: 12,
          width: '15%',
          background: '#1e293b',
          borderRadius: 99,
        }}
      />
    </div>
    <div className="p-4 flex gap-3">
      <div
        style={{
          width: 60,
          height: 60,
          background: '#1e293b',
          borderRadius: 12,
          flexShrink: 0,
        }}
      />
      <div className="flex-1 space-y-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              height: 11,
              background: '#1e293b',
              borderRadius: 6,
              width: i === 3 ? '40%' : '70%',
            }}
          />
        ))}
      </div>
    </div>
    <div
      className="px-4 py-3 border-t"
      style={{ borderColor: '#1e293b', height: 44 }}
    >
      <div
        style={{
          height: 11,
          width: '30%',
          background: '#1e293b',
          borderRadius: 6,
        }}
      />
    </div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────
const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = UseAxiosSecure();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchBookings = useCallback(() => {
    if (!user?.email) return;
    setLoading(true);
    axiosSecure
      .get(`/bookings/${user.email}`)
      .then(res => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ── Pay Now ──────────────────────────────────────────────────
  const handlePay = async booking => {
    setPaying(booking._id);
    try {
      const res = await axiosSecure.post('/create-checkout-session', {
        ticketId: booking.ticketId,
        quantity: booking.quantity || 1,
        bookingId: booking._id,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      Swal.fire({
        title: 'Payment Error',
        text: err?.response?.data?.message || 'Could not initiate payment.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#f97316',
      });
    } finally {
      setPaying(null);
    }
  };

  // ── Tab filter ───────────────────────────────────────────────
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'paid', label: 'Paid' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const filtered =
    activeTab === 'all'
      ? bookings
      : bookings.filter(b => {
          const s = b.status?.toLowerCase();
          if (activeTab === 'accepted')
            return s === 'approved' || s === 'accepted';
          return s === activeTab;
        });

  const counts = tabs.reduce((acc, t) => {
    acc[t.key] =
      t.key === 'all'
        ? bookings.length
        : bookings.filter(b => {
            const s = b.status?.toLowerCase();
            if (t.key === 'accepted')
              return s === 'approved' || s === 'accepted';
            return s === t.key;
          }).length;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen px-3 md:px-4 py-5 md:py-8"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold mb-2"
            style={{
              background: 'rgba(249,115,22,0.12)',
              border: '0.5px solid rgba(249,115,22,0.3)',
              color: '#fb923c',
            }}
          >
            <FaBus size={9} /> My Bookings
          </div>
          <h1
            className="text-xl md:text-2xl font-extrabold"
            style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
          >
            My Booked Tickets
          </h1>
          <p
            className="text-[11px] md:text-sm mt-0.5"
            style={{ color: '#64748b' }}
          >
            {loading
              ? 'Loading...'
              : `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} total`}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="bg-white/5 rounded-xl border overflow-x-auto mb-4 md:mb-5"
          style={{ borderColor: '#1e293b' }}
        >
          <div className="flex min-w-max">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex flex-col items-center gap-0.5 px-3 md:px-4 py-2 md:py-2.5 text-[9px] md:text-[11px] font-semibold transition whitespace-nowrap"
                style={{
                  borderRight:
                    i < tabs.length - 1 ? '0.5px solid #1e293b' : 'none',
                  color: activeTab === tab.key ? '#f97316' : '#475569',
                }}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span
                    className="text-[8px] md:text-[9px] font-bold px-1 md:px-1.5 py-0.5 rounded-full"
                    style={{
                      background:
                        activeTab === tab.key
                          ? 'rgba(249,115,22,0.2)'
                          : '#1e293b',
                      color: activeTab === tab.key ? '#f97316' : '#475569',
                    }}
                  >
                    {counts[tab.key]}
                  </span>
                )}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl"
            style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
          >
            <FiInbox size={32} style={{ color: '#334155', marginBottom: 12 }} />
            <p className="text-sm font-semibold" style={{ color: '#475569' }}>
              {activeTab === 'all'
                ? 'No bookings yet'
                : `No ${activeTab} bookings`}
            </p>
            <p
              className="text-xs mt-1 text-center px-8"
              style={{ color: '#334155' }}
            >
              {activeTab === 'all'
                ? 'Book a ticket from the All Tickets page to get started'
                : `You have no bookings with "${activeTab}" status`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(b => (
              <BookingCard
                key={b._id}
                booking={b}
                onPay={handlePay}
                paying={paying}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
