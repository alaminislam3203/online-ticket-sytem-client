import { useEffect, useState } from 'react';
import {
  FaUser,
  FaBus,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaArrowRight,
  FaTicketAlt,
  FaBoxes,
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

// ── Skeleton ──────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div
    className="grid gap-4 px-4 py-4 animate-pulse"
    style={{
      gridTemplateColumns: '1.2fr 1.4fr 1.2fr 0.6fr 0.8fr 0.8fr 0.8fr',
      borderBottom: '0.5px solid #1e293b',
    }}
  >
    {[1, 2, 3, 4, 5, 6, 7].map(i => (
      <div
        key={i}
        style={{
          height: 12,
          background: '#1e293b',
          borderRadius: 6,
          width: i === 7 ? '60%' : '80%',
        }}
      />
    ))}
  </div>
);

// ── Mobile Card ───────────────────────────────────────────────────
const MobileCard = ({ b, i, handleApprove, handleReject }) => {
  const sc = statusConfig(b.status);
  const isActionable = !['approved', 'rejected', 'paid'].includes(
    b.status?.toLowerCase(),
  );
  const totalPrice = b.price || (b.unitPrice || 0) * (b.quantity || 1);

  return (
    <div
      className="rounded-xl p-3.5 mb-2"
      style={{
        background: i % 2 === 0 ? '#0a1020' : '#0f172a',
        border: '0.5px solid #1e293b',
      }}
    >
      {/* Top row: customer + status */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(249,115,22,0.12)' }}
          >
            <FaUser size={10} style={{ color: '#f97316' }} />
          </div>
          <div className="min-w-0">
            <p
              className="text-[11px] font-semibold truncate"
              style={{ color: '#e2e8f0' }}
            >
              {b.customerName || b.email || '—'}
            </p>
            <p className="text-[9px] truncate" style={{ color: '#475569' }}>
              {b.email || ''}
            </p>
          </div>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-semibold flex-shrink-0"
          style={{
            background: sc.bg,
            color: sc.color,
            border: `0.5px solid ${sc.border}`,
          }}
        >
          {sc.label}
        </span>
      </div>

      {/* Ticket title */}
      <div className="flex items-center gap-1.5 mb-2">
        <FaTicketAlt size={9} style={{ color: '#f97316', flexShrink: 0 }} />
        <p
          className="text-[11px] font-medium truncate"
          style={{ color: '#cbd5e1' }}
        >
          {b.title || '—'}
        </p>
      </div>

      {/* Route */}
      <div className="flex items-center gap-1.5 mb-2">
        <FaBus size={9} style={{ color: '#475569', flexShrink: 0 }} />
        <div className="flex items-center gap-1 text-[10px]">
          <span className="font-semibold" style={{ color: '#f97316' }}>
            {b.from || '—'}
          </span>
          <FaArrowRight size={7} style={{ color: '#334155' }} />
          <span style={{ color: '#64748b' }}>{b.to || '—'}</span>
        </div>
      </div>

      {/* Qty + Price + Date */}
      <div className="flex items-center gap-3 mb-2.5 flex-wrap">
        <div className="flex items-center gap-1">
          <FaBoxes size={9} style={{ color: '#475569' }} />
          <span className="text-[10px]" style={{ color: '#64748b' }}>
            Qty:{' '}
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>
              {b.quantity || 1}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FaMoneyBillWave size={9} style={{ color: '#34d399' }} />
          <span className="text-[10px] font-bold" style={{ color: '#34d399' }}>
            ${totalPrice?.toFixed ? totalPrice.toFixed(2) : totalPrice}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <FaCalendarAlt size={9} style={{ color: '#475569' }} />
          <span className="text-[10px]" style={{ color: '#64748b' }}>
            {formatDate(b.createdAt || b.bookingDate)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => handleApprove(b._id)}
          disabled={!isActionable}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(16,185,129,0.12)',
            border: '0.5px solid rgba(16,185,129,0.3)',
            color: '#34d399',
          }}
        >
          <FaCheckCircle size={10} /> Approve
        </button>
        <button
          onClick={() => handleReject(b._id)}
          disabled={!isActionable}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(239,68,68,0.12)',
            border: '0.5px solid rgba(239,68,68,0.3)',
            color: '#f87171',
          }}
        >
          <FaTimesCircle size={10} /> Reject
        </button>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────
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
      className="min-h-screen px-3 md:px-4 py-6 md:py-8"
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
        {/* ── Header ── */}
        <div
          className="mb-5 md:mb-8"
          style={{ animation: 'fadeUp 0.4s ease both' }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-semibold mb-3"
            style={{
              background: 'rgba(249,115,22,0.12)',
              border: '0.5px solid rgba(249,115,22,0.3)',
              color: '#fb923c',
            }}
          >
            <FaBus size={10} /> Vendor Panel
          </div>
          <h1
            className="text-2xl md:text-3xl font-extrabold"
            style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
          >
            Requested Bookings
          </h1>
          <p className="text-xs md:text-sm mt-1" style={{ color: '#64748b' }}>
            {loading
              ? 'Loading...'
              : `${bookings.length} total booking requests`}
          </p>
        </div>

        {/* ── Stats ── */}
        {!loading && bookings.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6"
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
                className="px-3 md:px-4 py-2.5 md:py-3 rounded-xl"
                style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
              >
                <p
                  className="text-xl md:text-2xl font-extrabold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[10px] md:text-xs mt-0.5"
                  style={{ color: '#475569' }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Mobile Cards (md এর নিচে) ── */}
        <div
          className="md:hidden"
          style={{ animation: 'fadeUp 0.4s 0.1s ease both' }}
        >
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3.5 animate-pulse"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #1e293b',
                  }}
                >
                  {[1, 2, 3].map(j => (
                    <div
                      key={j}
                      className="mb-2"
                      style={{
                        height: 11,
                        background: '#1e293b',
                        borderRadius: 6,
                        width: j === 3 ? '50%' : '80%',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : current.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-2xl"
              style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
            >
              <FiInbox
                size={32}
                style={{ color: '#334155', marginBottom: 10 }}
              />
              <p className="text-sm font-semibold" style={{ color: '#475569' }}>
                No booking requests yet
              </p>
              <p
                className="text-xs mt-1 text-center px-6"
                style={{ color: '#334155' }}
              >
                Requests will appear here when customers book your tickets
              </p>
            </div>
          ) : (
            <>
              {current.map((b, i) => (
                <MobileCard
                  key={b._id}
                  b={b}
                  i={i}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                />
              ))}
            </>
          )}
        </div>

        {/* ── Desktop Table (md এবং উপরে) ── */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden"
          style={{
            border: '0.5px solid #1e293b',
            animation: 'fadeUp 0.4s 0.1s ease both',
          }}
        >
          {/* Table header */}
          <div
            className="grid gap-4 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              gridTemplateColumns: '1.2fr 1.4fr 1.2fr 0.6fr 0.8fr 0.8fr 0.8fr',
              background: '#0a1020',
              color: '#334155',
              borderBottom: '0.5px solid #1e293b',
            }}
          >
            <span>Customer</span>
            <span>Ticket</span>
            <span>Route</span>
            <span>Qty</span>
            <span>Total Price</span>
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
              const totalPrice =
                b.price || (b.unitPrice || 0) * (b.quantity || 1);

              return (
                <div
                  key={b._id}
                  className="grid gap-4 px-4 py-4 items-center transition-colors duration-150"
                  style={{
                    gridTemplateColumns:
                      '1.2fr 1.4fr 1.2fr 0.6fr 0.8fr 0.8fr 0.8fr',
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
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: '#94a3b8' }}
                      >
                        {b.customerName || '—'}
                      </p>
                      <p
                        className="text-[9px] truncate"
                        style={{ color: '#475569' }}
                      >
                        {b.email || ''}
                      </p>
                    </div>
                  </div>

                  {/* Ticket title */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FaTicketAlt
                      size={10}
                      style={{ color: '#f97316', flexShrink: 0 }}
                    />
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: '#cbd5e1' }}
                    >
                      {b.title || '—'}
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

                  {/* Quantity */}
                  <div className="flex items-center gap-1.5">
                    <FaBoxes size={10} style={{ color: '#475569' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: '#94a3b8' }}
                    >
                      {b.quantity || 1}
                    </span>
                  </div>

                  {/* Total Price */}
                  <div className="flex items-center gap-1.5">
                    <FaMoneyBillWave size={10} style={{ color: '#34d399' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: '#34d399' }}
                    >
                      $
                      {totalPrice?.toFixed ? totalPrice.toFixed(2) : totalPrice}
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

        {/* Mobile Pagination */}
        {!loading && bookings.length > ITEMS && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ background: '#1e293b', color: '#64748b' }}
            >
              <FiChevronLeft size={13} />
            </button>
            <span className="text-xs px-3" style={{ color: '#64748b' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ background: '#1e293b', color: '#64748b' }}
            >
              <FiChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestedBookings;
