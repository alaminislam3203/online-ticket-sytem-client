import { useEffect, useState } from 'react';
import {
  FaUser,
  FaBus,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaArrowRight,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiInbox } from 'react-icons/fi';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  background: '#0f172a',
  color: '#f8fafc',
});

const statusConfig = s => {
  const v = s?.toLowerCase();
  if (v === 'approved')
    return {
      bg: 'rgba(16,185,129,0.12)',
      color: '#34d399',
      border: 'rgba(16,185,129,0.3)',
      label: 'Approved',
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

const ITEMS = 10;

// ── Skeleton row ─────────────────────────────────────────────────
const SkeletonRow = () => (
  <div
    className="grid grid-cols-6 gap-4 px-6 py-4 animate-pulse"
    style={{ borderBottom: '0.5px solid #1e293b' }}
  >
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div
        key={i}
        style={{
          height: 12,
          background: '#1e293b',
          borderRadius: 6,
          width: i === 6 ? '70%' : '85%',
        }}
      />
    ))}
  </div>
);

const RequestedBookings = () => {
  const axiosSecure = UseAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get('/api/requested-booking')
      .then(res => setBookings(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS));
  const current = bookings.slice((page - 1) * ITEMS, page * ITEMS);

  const handleApprove = async id => {
    try {
      await axiosSecure.patch(`/api/requested-booking/approve/${id}`);
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: 'Approved' } : b)),
      );
      Toast.fire({ icon: 'success', title: 'Booking approved' });
    } catch {
      Toast.fire({ icon: 'error', title: 'Failed to approve' });
    }
  };

  const handleReject = async id => {
    try {
      await axiosSecure.patch(`/api/requested-booking/reject/${id}`);
      setBookings(prev =>
        prev.map(b => (b._id === id ? { ...b, status: 'Rejected' } : b)),
      );
      Toast.fire({ icon: 'success', title: 'Booking rejected' });
    } catch {
      Toast.fire({ icon: 'error', title: 'Failed to reject' });
    }
  };

  const pending = bookings.filter(
    b => b.status?.toLowerCase() === 'pending',
  ).length;
  const approved = bookings.filter(
    b => b.status?.toLowerCase() === 'approved',
  ).length;
  const paid = bookings.filter(b => b.status?.toLowerCase() === 'paid').length;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8" style={{ animation: 'fadeUp 0.4s ease both' }}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-3"
            style={{
              background: 'rgba(249,115,22,0.12)',
              border: '0.5px solid rgba(249,115,22,0.3)',
              color: '#fb923c',
            }}
          >
            <FaBus size={11} /> Vendor Panel
          </div>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
          >
            Requested Bookings
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {loading
              ? 'Loading...'
              : `${bookings.length} total booking requests`}
          </p>
        </div>

        {/* Stats */}
        {!loading && bookings.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
            style={{ animation: 'fadeUp 0.4s 0.05s ease both' }}
          >
            {[
              { label: 'Total', value: bookings.length, color: '#f97316' },
              { label: 'Pending', value: pending, color: '#fbbf24' },
              { label: 'Approved', value: approved, color: '#34d399' },
              { label: 'Paid', value: paid, color: '#60a5fa' },
            ].map(s => (
              <div
                key={s.label}
                className="px-4 py-3 rounded-xl"
                style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
              >
                <p
                  className="text-2xl font-extrabold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '0.5px solid #1e293b',
            animation: 'fadeUp 0.4s 0.1s ease both',
          }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-6 gap-4 px-6 py-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: '#0a1020',
              color: '#334155',
              borderBottom: '0.5px solid #1e293b',
            }}
          >
            <span>Customer</span>
            <span>Route</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Rows */}
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : current.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20"
              style={{ background: '#0f172a' }}
            >
              <FiInbox
                size={36}
                style={{ color: '#334155', marginBottom: 12 }}
              />
              <p className="text-sm font-semibold" style={{ color: '#475569' }}>
                No booking requests yet
              </p>
              <p className="text-xs mt-1" style={{ color: '#334155' }}>
                Requests will appear here when customers book your tickets
              </p>
            </div>
          ) : (
            current.map((b, i) => {
              const sc = statusConfig(b.status);
              const isActionable = !['approved', 'rejected', 'paid'].includes(
                b.status?.toLowerCase(),
              );

              return (
                <div
                  key={b._id}
                  className="grid grid-cols-6 gap-4 px-6 py-4 items-center transition-colors duration-150"
                  style={{
                    background: i % 2 === 0 ? '#0a1020' : '#0f172a',
                    borderBottom: '0.5px solid #1e293b',
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = '#111827')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? '#0a1020' : '#0f172a')
                  }
                >
                  {/* Customer */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(249,115,22,0.12)' }}
                    >
                      <FaUser size={11} style={{ color: '#f97316' }} />
                    </div>
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: '#94a3b8' }}
                    >
                      {b.customerName || b.email || '—'}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-1 text-xs min-w-0">
                    <span
                      className="font-semibold truncate"
                      style={{ color: '#f97316' }}
                    >
                      {b.from || '—'}
                    </span>
                    <FaArrowRight
                      size={8}
                      style={{ color: '#334155', flexShrink: 0 }}
                    />
                    <span className="truncate" style={{ color: '#64748b' }}>
                      {b.to || '—'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt size={10} style={{ color: '#475569' }} />
                    <span className="text-xs" style={{ color: '#64748b' }}>
                      {formatDate(b.createdAt || b.bookingDate)}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-1.5">
                    <FaMoneyBillWave size={10} style={{ color: '#34d399' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: '#34d399' }}
                    >
                      ৳{b.price}
                    </span>
                  </div>

                  {/* Status */}
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold w-fit"
                    style={{
                      background: sc.bg,
                      color: sc.color,
                      border: `0.5px solid ${sc.border}`,
                    }}
                  >
                    {sc.label}
                  </span>

                  {/* Actions */}
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleApprove(b._id)}
                      disabled={!isActionable}
                      title="Approve"
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                      style={{
                        background: 'rgba(16,185,129,0.12)',
                        border: '0.5px solid rgba(16,185,129,0.3)',
                      }}
                      onMouseEnter={e => {
                        if (isActionable)
                          e.currentTarget.style.filter = 'brightness(1.3)';
                      }}
                      onMouseLeave={e =>
                        (e.currentTarget.style.filter = 'none')
                      }
                    >
                      <FaCheckCircle size={13} style={{ color: '#34d399' }} />
                    </button>
                    <button
                      onClick={() => handleReject(b._id)}
                      disabled={!isActionable}
                      title="Reject"
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        border: '0.5px solid rgba(239,68,68,0.3)',
                      }}
                      onMouseEnter={e => {
                        if (isActionable)
                          e.currentTarget.style.filter = 'brightness(1.3)';
                      }}
                      onMouseLeave={e =>
                        (e.currentTarget.style.filter = 'none')
                      }
                    >
                      <FaTimesCircle size={13} style={{ color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination footer */}
          {!loading && bookings.length > ITEMS && (
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{
                background: '#0a1020',
                borderTop: '0.5px solid #1e293b',
              }}
            >
              <span className="text-xs" style={{ color: '#334155' }}>
                Page <span style={{ color: '#94a3b8' }}>{page}</span> of{' '}
                <span style={{ color: '#94a3b8' }}>{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: '#1e293b', color: '#64748b' }}
                >
                  <FiChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const p = Math.max(1, page - 2) + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: page === p ? '#f97316' : '#1e293b',
                        color: page === p ? '#fff' : '#64748b',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: '#1e293b', color: '#64748b' }}
                >
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestedBookings;
