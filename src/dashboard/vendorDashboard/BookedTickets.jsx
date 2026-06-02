import { useEffect, useState } from 'react';
import {
  FaBus,
  FaUser,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaBoxes,
  FaMoneyBillWave,
  FaShieldAlt,
  FaTicketAlt,
  FaEnvelope,
  FaPhone,
  FaRoute,
} from 'react-icons/fa';
import {
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import { MdVerified, MdPendingActions } from 'react-icons/md';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';

const ITEMS = 10;

const formatDate = d => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime12h = t => {
  if (!t) return '—';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

const adminStatusConfig = s => {
  const v = s?.toLowerCase();
  if (v === 'approved')
    return {
      bg: 'rgba(16,185,129,0.12)',
      color: '#34d399',
      border: 'rgba(16,185,129,0.3)',
      label: 'Approved',
      icon: <MdVerified size={11} />,
    };
  return {
    bg: 'rgba(245,158,11,0.12)',
    color: '#fbbf24',
    border: 'rgba(245,158,11,0.3)',
    label: 'Pending Review',
    icon: <MdPendingActions size={11} />,
  };
};

// ── Skeleton ──────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div
    className="grid gap-3 px-5 py-4 animate-pulse"
    style={{
      gridTemplateColumns: '1.4fr 1.2fr 1.2fr 0.5fr 0.7fr 0.7fr 0.8fr',
      borderBottom: '0.5px solid #1e293b',
    }}
  >
    {[80, 70, 60, 30, 50, 50, 60].map((w, i) => (
      <div
        key={i}
        style={{
          height: 11,
          background: '#1e293b',
          borderRadius: 6,
          width: `${w}%`,
        }}
      />
    ))}
  </div>
);

// ── Mobile Card ───────────────────────────────────────────────────
const MobileCard = ({ b, i }) => {
  const asc = adminStatusConfig(b.adminStatus);

  return (
    <div
      className="rounded-2xl p-4 mb-3"
      style={{
        background: i % 2 === 0 ? '#0a1020' : '#0f172a',
        border: '0.5px solid #1e293b',
      }}
    >
      {/* Header: customer + paid badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.12)' }}
          >
            <FaUser size={13} style={{ color: '#60a5fa' }} />
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-bold truncate"
              style={{ color: '#e2e8f0' }}
            >
              {b.customerName || b.email?.split('@')[0] || '—'}
            </p>
            <p
              className="text-[10px] truncate mt-0.5"
              style={{ color: '#475569' }}
            >
              {b.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
          <span
            className="px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{
              background: 'rgba(59,130,246,0.15)',
              color: '#60a5fa',
              border: '0.5px solid rgba(59,130,246,0.3)',
            }}
          >
            PAID
          </span>
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
            style={{
              background: asc.bg,
              color: asc.color,
              border: `0.5px solid ${asc.border}`,
            }}
          >
            {asc.icon} {asc.label}
          </span>
        </div>
      </div>

      {/* Ticket title */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
        style={{ background: '#1e293b' }}
      >
        <FaTicketAlt size={10} style={{ color: '#f97316' }} />
        <p className="text-[11px] font-semibold" style={{ color: '#cbd5e1' }}>
          {b.title || '—'}
        </p>
      </div>

      {/* Route */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt size={9} style={{ color: '#f97316' }} />
          <span className="text-xs font-bold" style={{ color: '#f97316' }}>
            {b.from}
          </span>
        </div>
        <div className="flex-1 mx-2 h-px" style={{ background: '#1e293b' }} />
        <FaArrowRight size={8} style={{ color: '#334155' }} />
        <div className="flex-1 mx-2 h-px" style={{ background: '#1e293b' }} />
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt size={9} style={{ color: '#64748b' }} />
          <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>
            {b.to}
          </span>
        </div>
      </div>

      {/* Info chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: '#1e293b' }}
        >
          <FaCalendarAlt size={9} style={{ color: '#475569' }} />
          <span className="text-[10px]" style={{ color: '#64748b' }}>
            {formatDate(b.departureDate)}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: '#1e293b' }}
        >
          <FaClock size={9} style={{ color: '#475569' }} />
          <span className="text-[10px]" style={{ color: '#64748b' }}>
            {formatTime12h(b.departureTime)}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ background: '#1e293b' }}
        >
          <FaBoxes size={9} style={{ color: '#475569' }} />
          <span className="text-[10px]" style={{ color: '#64748b' }}>
            {b.quantity || 1} seat{(b.quantity || 1) > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Price + boarding/drop */}
      <div
        className="flex items-center justify-between pt-2.5"
        style={{ borderTop: '0.5px solid #1e293b' }}
      >
        <div>
          {b.boardingPoint && (
            <p className="text-[9px] mb-0.5" style={{ color: '#334155' }}>
              <span style={{ color: '#475569' }}>Board: </span>
              {b.boardingPoint}
            </p>
          )}
          {b.dropPoint && (
            <p className="text-[9px]" style={{ color: '#334155' }}>
              <span style={{ color: '#475569' }}>Drop: </span>
              {b.dropPoint}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[9px] mb-0.5" style={{ color: '#475569' }}>
            Total Paid
          </p>
          <p className="text-base font-extrabold" style={{ color: '#34d399' }}>
            ৳{b.price?.toLocaleString?.() ?? b.price}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────
const BookedTickets = () => {
  const axiosSecure = UseAxiosSecure();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get('/api/requested-booking')
      .then(res => {
        const all = Array.isArray(res.data)
          ? res.data
          : (res.data?.bookings ?? []);
        // Only paid bookings
        setBookings(all.filter(b => b.status?.toLowerCase() === 'paid'));
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [axiosSecure]);

  // Search filter
  const filtered = bookings.filter(b => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.customerName?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.from?.toLowerCase().includes(q) ||
      b.to?.toLowerCase().includes(q) ||
      b.title?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS));
  const current = filtered.slice((page - 1) * ITEMS, page * ITEMS);

  // Stats
  const totalRevenue = bookings.reduce((s, b) => s + (b.price || 0), 0);
  const pendingAdmin = bookings.filter(
    b => b.adminStatus?.toLowerCase() === 'pending',
  ).length;
  const approvedAdmin = bookings.filter(
    b => b.adminStatus?.toLowerCase() === 'approved',
  ).length;
  const totalSeats = bookings.reduce((s, b) => s + (b.quantity || 1), 0);

  const handleSearchChange = v => {
    setSearch(v);
    setPage(1);
  };

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
        .fade-up   { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation: fadeUp 0.4s 0.05s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s 0.12s ease both; }
        .fade-up-3 { animation: fadeUp 0.4s 0.20s ease both; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-6 md:mb-8 fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-semibold mb-3"
            style={{
              background: 'rgba(59,130,246,0.12)',
              border: '0.5px solid rgba(59,130,246,0.3)',
              color: '#60a5fa',
            }}
          >
            <FaTicketAlt size={10} /> Booked Tickets
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h1
                className="text-2xl md:text-3xl font-extrabold"
                style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
              >
                Paid <span style={{ color: '#60a5fa' }}>Bookings</span>
              </h1>
              <p
                className="text-xs md:text-sm mt-1"
                style={{ color: '#64748b' }}
              >
                {loading
                  ? 'Loading...'
                  : `${bookings.length} confirmed paid booking${bookings.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-5 md:mb-6 fade-up-1">
            {[
              {
                label: 'Total Bookings',
                value: bookings.length,
                color: '#60a5fa',
                icon: <FaTicketAlt size={13} />,
              },
              {
                label: 'Total Revenue',
                value: `৳${totalRevenue.toLocaleString()}`,
                color: '#34d399',
                icon: <FaMoneyBillWave size={13} />,
              },
              {
                label: 'Seats Booked',
                value: totalSeats,
                color: '#f97316',
                icon: <FaBoxes size={13} />,
              },
              {
                label: 'Pending Review',
                value: pendingAdmin,
                color: '#fbbf24',
                icon: <MdPendingActions size={14} />,
              },
            ].map(s => (
              <div
                key={s.label}
                className="px-3 md:px-4 py-3 md:py-4 rounded-2xl flex items-center gap-3"
                style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${s.color}18`,
                    border: `0.5px solid ${s.color}40`,
                    color: s.color,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <p
                    className="text-lg md:text-xl font-extrabold leading-none"
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
              </div>
            ))}
          </div>
        )}

        {/* ── Search bar ── */}
        {!loading && bookings.length > 0 && (
          <div className="mb-4 fade-up-2">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl max-w-sm"
              style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
            >
              <FiSearch size={13} style={{ color: '#475569', flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, route…"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e2e8f0',
                  fontSize: 12,
                  width: '100%',
                }}
              />
              {search && (
                <button onClick={() => handleSearchChange('')}>
                  <FiX size={13} style={{ color: '#475569' }} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Mobile Cards ── */}
        <div className="md:hidden fade-up-3">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 animate-pulse space-y-2.5"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #1e293b',
                  }}
                >
                  {[90, 70, 50].map((w, j) => (
                    <div
                      key={j}
                      style={{
                        height: 11,
                        background: '#1e293b',
                        borderRadius: 6,
                        width: `${w}%`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : current.length === 0 ? (
            <EmptyState
              search={search}
              onClear={() => handleSearchChange('')}
            />
          ) : (
            current.map((b, i) => <MobileCard key={b._id} b={b} i={i} />)
          )}
        </div>

        {/* ── Desktop Table ── */}
        <div
          className="hidden md:block rounded-2xl overflow-hidden fade-up-3"
          style={{ border: '0.5px solid #1e293b' }}
        >
          {/* Table header */}
          <div
            className="grid gap-3 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              gridTemplateColumns: '1.4fr 1.2fr 1.2fr 0.5fr 0.7fr 0.7fr 0.8fr',
              background: '#0a1020',
              color: '#334155',
              borderBottom: '0.5px solid #1e293b',
            }}
          >
            <span>Customer</span>
            <span>Ticket</span>
            <span>Route</span>
            <span>Seats</span>
            <span>Departure</span>
            <span>Total</span>
            <span>Admin Status</span>
          </div>

          {/* Rows */}
          {loading ? (
            Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
          ) : current.length === 0 ? (
            <EmptyState
              search={search}
              onClear={() => handleSearchChange('')}
              isTable
            />
          ) : (
            current.map((b, i) => {
              const asc = adminStatusConfig(b.adminStatus);
              return (
                <div
                  key={b._id}
                  className="grid gap-3 px-5 py-4 items-center transition-colors duration-150"
                  style={{
                    gridTemplateColumns:
                      '1.4fr 1.2fr 1.2fr 0.5fr 0.7fr 0.7fr 0.8fr',
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
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.1)' }}
                    >
                      <FaUser size={11} style={{ color: '#60a5fa' }} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: '#e2e8f0' }}
                      >
                        {b.customerName || '—'}
                      </p>
                      <p
                        className="text-[9px] truncate mt-0.5"
                        style={{ color: '#475569' }}
                      >
                        {b.email}
                      </p>
                    </div>
                  </div>

                  {/* Ticket */}
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
                  <div className="flex items-center gap-1 min-w-0">
                    <span
                      className="text-xs font-bold truncate"
                      style={{ color: '#f97316' }}
                    >
                      {b.from}
                    </span>
                    <FaArrowRight
                      size={8}
                      style={{ color: '#334155', flexShrink: 0 }}
                    />
                    <span
                      className="text-xs truncate"
                      style={{ color: '#64748b' }}
                    >
                      {b.to}
                    </span>
                  </div>

                  {/* Seats */}
                  <div className="flex items-center gap-1.5">
                    <FaBoxes size={10} style={{ color: '#475569' }} />
                    <span
                      className="text-xs font-bold"
                      style={{ color: '#94a3b8' }}
                    >
                      {b.quantity || 1}
                    </span>
                  </div>

                  {/* Departure */}
                  <div>
                    <p
                      className="text-[11px] font-medium"
                      style={{ color: '#94a3b8' }}
                    >
                      {formatDate(b.departureDate)}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: '#475569' }}
                    >
                      {formatTime12h(b.departureTime)}
                    </p>
                  </div>

                  {/* Total */}
                  <div>
                    <p
                      className="text-sm font-extrabold"
                      style={{ color: '#34d399' }}
                    >
                      ৳{b.price?.toLocaleString?.() ?? b.price}
                    </p>
                    {b.unitPrice && b.quantity > 1 && (
                      <p
                        className="text-[9px] mt-0.5"
                        style={{ color: '#334155' }}
                      >
                        ৳{b.unitPrice} × {b.quantity}
                      </p>
                    )}
                  </div>

                  {/* Admin Status */}
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold w-fit"
                    style={{
                      background: asc.bg,
                      color: asc.color,
                      border: `0.5px solid ${asc.border}`,
                    }}
                  >
                    {asc.icon} {asc.label}
                  </span>
                </div>
              );
            })
          )}

          {/* Pagination footer */}
          {!loading && filtered.length > ITEMS && (
            <PaginationBar
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              total={filtered.length}
            />
          )}
        </div>

        {/* Mobile pagination */}
        {!loading && filtered.length > ITEMS && (
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

// ── Pagination Bar ────────────────────────────────────────────────
const PaginationBar = ({ page, totalPages, setPage, total }) => (
  <div
    className="flex items-center justify-between px-5 py-3"
    style={{ background: '#0a1020', borderTop: '0.5px solid #1e293b' }}
  >
    <span className="text-xs" style={{ color: '#334155' }}>
      Showing{' '}
      <span style={{ color: '#94a3b8' }}>
        {(page - 1) * ITEMS + 1}–{Math.min(page * ITEMS, total)}
      </span>{' '}
      of <span style={{ color: '#94a3b8' }}>{total}</span>
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
              background: page === p ? '#3b82f6' : '#1e293b',
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
);

// ── Empty State ───────────────────────────────────────────────────
const EmptyState = ({ search, onClear, isTable }) => (
  <div
    className="flex flex-col items-center justify-center py-20"
    style={isTable ? { background: '#0f172a' } : {}}
  >
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
      style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
    >
      <FiInbox size={28} style={{ color: '#334155' }} />
    </div>
    <p className="text-sm font-semibold" style={{ color: '#475569' }}>
      {search ? 'No results found' : 'No paid bookings yet'}
    </p>
    <p className="text-xs mt-1 text-center px-6" style={{ color: '#334155' }}>
      {search
        ? `No bookings match "${search}"`
        : 'Paid bookings will appear here after successful payments'}
    </p>
    {search && (
      <button
        onClick={onClear}
        className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold"
        style={{
          background: 'rgba(59,130,246,0.12)',
          color: '#60a5fa',
          border: '0.5px solid rgba(59,130,246,0.3)',
        }}
      >
        Clear search
      </button>
    )}
  </div>
);

export default BookedTickets;
