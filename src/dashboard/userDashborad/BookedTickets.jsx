import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../Context/AuthContext';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';

// ── Countdown hook ──────────────────────────────────────────
const useCountdown = (departureDate, departureTime) => {
  const calc = useCallback(() => {
    if (!departureDate) return null;
    // departureDate + departureTime মিলিয়ে exact datetime বানাও
    const timeStr = departureTime || '00:00';
    const target = new Date(`${departureDate}T${timeStr}:00`);
    const diff = target - new Date();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }, [departureDate, departureTime]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    setTime(calc());
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
};

// ── Single booking card ─────────────────────────────────────
const BookingCard = ({ booking, onPayNow }) => {
  // tickets collection থেকে আসা departureDate ও departureTime
  const departureDate = booking.departureDate || booking.from_date;
  const departureTime = booking.departureTime || booking.departure_time;
  const countdown = useCountdown(departureDate, departureTime);
  const isPast = !countdown;
  const status = (booking.status || 'pending').toLowerCase();

  const statusConfig = {
    pending: {
      label: 'Pending',
      bg: 'rgba(234,179,8,0.12)',
      color: '#facc15',
      border: 'rgba(234,179,8,0.3)',
    },
    approved: {
      label: 'Accepted',
      bg: 'rgba(34,197,94,0.12)',
      color: '#4ade80',
      border: 'rgba(34,197,94,0.3)',
    },
    rejected: {
      label: 'Rejected',
      bg: 'rgba(239,68,68,0.12)',
      color: '#f87171',
      border: 'rgba(239,68,68,0.3)',
    },
    paid: {
      label: 'Paid',
      bg: 'rgba(59,130,246,0.12)',
      color: '#60a5fa',
      border: 'rgba(59,130,246,0.3)',
    },
  };
  const s = statusConfig[status] || statusConfig.pending;
  const canPay = status === 'approved' && !isPast;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
    >
      {booking.image && (
        <img
          src={booking.image}
          alt={booking.ticketTitle || 'Ticket'}
          className="w-full h-36 object-cover"
        />
      )}

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-white leading-snug">
            {booking.ticketTitle || booking.title || 'Ticket'}
          </h3>
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0"
            style={{
              background: s.bg,
              color: s.color,
              border: `0.5px solid ${s.border}`,
            }}
          >
            {s.label}
          </span>
        </div>

        {/* Route */}
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: '#64748b' }}
        >
          <span>{booking.from}</span>
          <span>→</span>
          <span>{booking.to}</span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            {
              label: 'Quantity',
              value: booking.quantity || booking.bookingQuantity || 1,
            },
            {
              label: 'Total Price',
              value: `$${(
                (booking.price || booking.unitPrice || 0) *
                (booking.quantity || booking.bookingQuantity || 1)
              ).toFixed(2)}`,
            },
            {
              label: 'Departure Date',
              value: departureDate
                ? new Date(departureDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '—',
            },
            {
              label: 'Departure Time',
              value: departureTime || '—',
            },
          ].map(item => (
            <div key={item.label}>
              <p
                className="text-[10px] uppercase tracking-widest mb-0.5"
                style={{ color: '#334155' }}
              >
                {item.label}
              </p>
              <p className="font-semibold" style={{ color: '#94a3b8' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Countdown */}
        {status !== 'rejected' && !isPast && countdown && (
          <div
            className="rounded-xl p-3 flex flex-col gap-1"
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '0.5px solid #1e293b',
            }}
          >
            <p
              className="text-[10px] uppercase tracking-widest text-center mb-1"
              style={{ color: '#334155' }}
            >
              Departure Countdown
            </p>
            <div className="grid grid-cols-4 gap-1 text-center">
              {[
                { label: 'Days', val: countdown.days },
                { label: 'Hours', val: countdown.hours },
                { label: 'Min', val: countdown.minutes },
                { label: 'Sec', val: countdown.seconds },
              ].map(t => (
                <div
                  key={t.label}
                  className="rounded-lg py-1.5"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #1e293b',
                  }}
                >
                  <p
                    className="text-lg font-bold tabular-nums"
                    style={{ color: '#60a5fa' }}
                  >
                    {String(t.val).padStart(2, '0')}
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-widest"
                    style={{ color: '#334155' }}
                  >
                    {t.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isPast && status !== 'rejected' && status !== 'paid' && (
          <p className="text-xs text-center" style={{ color: '#ef4444' }}>
            Departure date has passed
          </p>
        )}

        {canPay && (
          <button
            onClick={() => onPayNow(booking)}
            className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: '0.5px solid rgba(59,130,246,0.4)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

// ── Main page ───────────────────────────────────────────────
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    axiosSecure
      .get(`/bookings/${user.email}`)
      .then(res => {
        setBookings(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const handlePayNow = async booking => {
    setPayLoading(true);
    try {
      const res = await axiosSecure.post('/create-checkout-session', {
        ticketId: booking.ticketId,
        quantity: booking.quantity || booking.bookingQuantity || 1,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-lg font-bold text-white mb-6">My Booked Tickets</h2>

      {bookings.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
        >
          <p className="text-4xl mb-3">🎟️</p>
          <p className="text-sm font-semibold" style={{ color: '#475569' }}>
            No bookings yet
          </p>
          <p className="text-xs mt-1" style={{ color: '#334155' }}>
            Browse tickets and make your first booking!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bookings.map(b => (
            <BookingCard key={b._id} booking={b} onPayNow={handlePayNow} />
          ))}
        </div>
      )}

      {payLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
