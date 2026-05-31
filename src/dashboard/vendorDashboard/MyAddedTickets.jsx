import { useEffect, useState } from 'react';
import {
  FaBus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrashAlt,
  FaChair,
  FaCheckCircle,
  FaClock,
  FaPlus,
} from 'react-icons/fa';
import { MdAcUnit, MdWifi } from 'react-icons/md';
import { FiArrowRight, FiAlertTriangle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';

const statusStyle = s => {
  if (s === 'approved')
    return {
      bg: 'rgba(16,185,129,0.12)',
      color: '#34d399',
      border: 'rgba(16,185,129,0.3)',
    };
  if (s === 'rejected')
    return {
      bg: 'rgba(239,68,68,0.12)',
      color: '#f87171',
      border: 'rgba(239,68,68,0.3)',
    };
  return {
    bg: 'rgba(245,158,11,0.12)',
    color: '#fbbf24',
    border: 'rgba(245,158,11,0.3)',
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

// ── Skeleton ─────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="animate-pulse rounded-2xl overflow-hidden"
    style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
  >
    <div style={{ height: 2, background: '#1e293b' }} />
    <div className="p-5 space-y-4">
      <div
        style={{
          height: 14,
          width: '55%',
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
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{ height: 56, background: '#1e293b', borderRadius: 12 }}
          />
        ))}
      </div>
      <div style={{ height: 36, background: '#1e293b', borderRadius: 12 }} />
    </div>
  </div>
);

// ── Edit Modal ────────────────────────────────────────────────────
const EditModal = ({ ticket, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: ticket.title || '',
    from: ticket.from || '',
    to: ticket.to || '',
    price: ticket.price || '',
    quantity: ticket.quantity || '',
    departureDate: ticket.departureDate || '',
    departureTime: ticket.departureTime || '',
    busType: ticket.busType || '',
  });

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const fields = [
    { name: 'title', label: 'Bus Title', type: 'text', full: true },
    { name: 'from', label: 'From', type: 'text' },
    { name: 'to', label: 'To', type: 'text' },
    { name: 'price', label: 'Price (৳)', type: 'number' },
    { name: 'quantity', label: 'Seats', type: 'number' },
    { name: 'departureDate', label: 'Date', type: 'date' },
    { name: 'departureTime', label: 'Time', type: 'time' },
    { name: 'busType', label: 'Bus Type', type: 'text' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: '#0f172a',
          border: '0.5px solid rgba(249,115,22,0.3)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '0.5px solid #1e293b' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.15)' }}
            >
              <FaEdit size={12} style={{ color: '#f97316' }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: '#f8fafc' }}>
              Edit Ticket
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1 rounded-lg"
            style={{ color: '#64748b', border: '0.5px solid #1e293b' }}
          >
            Close
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(f => (
              <div key={f.name} className={f.full ? 'col-span-2' : ''}>
                <label
                  className="block text-[10px] uppercase tracking-wider mb-1"
                  style={{ color: '#475569' }}
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#1e293b',
                    color: '#e2e8f0',
                    border: '0.5px solid #334155',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#f97316')}
                  onBlur={e => (e.target.style.borderColor = '#334155')}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ color: '#64748b', border: '0.5px solid #1e293b' }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(ticket._id, form)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: '#f97316' }}
              onMouseEnter={e =>
                (e.currentTarget.style.filter = 'brightness(0.88)')
              }
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Ticket Card ───────────────────────────────────────────────────
const TicketCard = ({ ticket, onEdit, onDelete, index }) => {
  const ss = statusStyle(ticket.verificationStatus);
  const hasAC = ticket.perks?.some(p => /ac|air/i.test(p));
  const hasWifi = ticket.perks?.some(p => /wifi/i.test(p));
  const isLow = ticket.quantity > 0 && ticket.quantity <= 5;
  const soldOut = ticket.quantity === 0;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: '#0f172a',
        border: '0.5px solid #1e293b',
        animation: `fadeUp 0.4s ${index * 0.06}s ease both`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '0.5px solid rgba(249,115,22,0.3)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(249,115,22,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '0.5px solid #1e293b';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top strip */}
      <div style={{ height: 2, background: '#f97316', opacity: 0.6 }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(249,115,22,0.12)' }}
            >
              <FaBus size={14} style={{ color: '#f97316' }} />
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm font-bold truncate"
                style={{ color: '#f8fafc' }}
              >
                {ticket.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasAC && (
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-medium"
                    style={{ color: '#34d399' }}
                  >
                    <MdAcUnit size={10} />
                    AC
                  </span>
                )}
                {hasWifi && <MdWifi size={10} style={{ color: '#60a5fa' }} />}
              </div>
            </div>
          </div>

          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ml-2"
            style={{
              background: ss.bg,
              color: ss.color,
              border: `0.5px solid ${ss.border}`,
            }}
          >
            {ticket.verificationStatus === 'approved'
              ? '✓ Approved'
              : ticket.verificationStatus === 'rejected'
                ? '✗ Rejected'
                : '⏳ Pending'}
          </span>
        </div>

        {/* Route */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-3"
          style={{ background: '#1e293b' }}
        >
          <span className="text-sm font-bold" style={{ color: '#f97316' }}>
            {ticket.from}
          </span>
          <div className="flex-1 flex items-center gap-1">
            <div style={{ flex: 1, height: 1, background: '#334155' }} />
            <FiArrowRight size={11} style={{ color: '#475569' }} />
            <div style={{ flex: 1, height: 1, background: '#334155' }} />
          </div>
          <span className="text-sm font-bold" style={{ color: '#94a3b8' }}>
            {ticket.to}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            {
              icon: <FaCalendarAlt size={10} />,
              label: 'Date',
              value: formatDate(ticket.departureDate),
            },
            {
              icon: <FaClock size={10} />,
              label: 'Time',
              value: ticket.departureTime || '—',
            },
            {
              icon: <FaMoneyBillWave size={10} />,
              label: 'Price',
              value: `৳${ticket.price}`,
              green: true,
            },
            {
              icon: <FaChair size={10} />,
              label: 'Seats',
              value: soldOut ? 'Sold Out' : `${ticket.quantity} left`,
              warn: isLow,
              red: soldOut,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="px-3 py-2.5 rounded-xl"
              style={{ background: '#1e293b' }}
            >
              <div
                className="flex items-center gap-1 mb-1"
                style={{ color: '#475569' }}
              >
                {item.icon}
                <span className="text-[9px] uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
              <p
                className="text-xs font-bold"
                style={{
                  color: item.green
                    ? '#34d399'
                    : item.red
                      ? '#f87171'
                      : item.warn
                        ? '#fbbf24'
                        : '#e2e8f0',
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Rejected notice */}
        {ticket.verificationStatus === 'rejected' && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '0.5px solid rgba(239,68,68,0.2)',
            }}
          >
            <FiAlertTriangle size={12} style={{ color: '#f87171' }} />
            <p className="text-[11px]" style={{ color: '#f87171' }}>
              Rejected tickets cannot be edited or deleted
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(ticket)}
            disabled={ticket.verificationStatus === 'rejected'}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(59,130,246,0.12)',
              color: '#60a5fa',
              border: '0.5px solid rgba(59,130,246,0.25)',
            }}
            onMouseEnter={e => {
              if (ticket.verificationStatus !== 'rejected')
                e.currentTarget.style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
          >
            <FaEdit size={10} /> Edit
          </button>
          <button
            onClick={() => onDelete(ticket._id)}
            disabled={ticket.verificationStatus === 'rejected'}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(239,68,68,0.12)',
              color: '#f87171',
              border: '0.5px solid rgba(239,68,68,0.25)',
            }}
            onMouseEnter={e => {
              if (ticket.verificationStatus !== 'rejected')
                e.currentTarget.style.filter = 'brightness(1.2)';
            }}
            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
          >
            <FaTrashAlt size={10} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────
const MyAddedTickets = () => {
  const axiosSecure = UseAxiosSecure();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTicket, setEditTicket] = useState(null);

  const fetchTickets = () => {
    setLoading(true);
    axiosSecure
      .get('/api/vendor/tickets')
      .then(res => setTickets(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleDelete = async id => {
    const confirm = await Swal.fire({
      title: 'Delete this ticket?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      background: '#0f172a',
      color: '#f8fafc',
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/api/vendor/tickets/${id}`);
      setTickets(prev => prev.filter(t => t._id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#f8fafc',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        background: '#0f172a',
        color: '#f8fafc',
      });
    }
  };

  const handleSave = async (id, data) => {
    try {
      await axiosSecure.put(`/api/vendor/tickets/${id}`, data);
      setEditTicket(null);
      fetchTickets();
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#f8fafc',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        background: '#0f172a',
        color: '#f8fafc',
      });
    }
  };

  const approved = tickets.filter(
    t => t.verificationStatus === 'approved',
  ).length;
  const pending = tickets.filter(
    t => t.verificationStatus === 'pending',
  ).length;
  const rejected = tickets.filter(
    t => t.verificationStatus === 'rejected',
  ).length;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
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
            My Added Tickets
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            {loading ? 'Loading...' : `${tickets.length} tickets total`}
          </p>
        </div>

        {/* Stats */}
        {!loading && tickets.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            style={{ animation: 'fadeUp 0.4s 0.05s ease both' }}
          >
            {[
              { label: 'Total', value: tickets.length, color: '#f97316' },
              { label: 'Approved', value: approved, color: '#34d399' },
              { label: 'Pending', value: pending, color: '#fbbf24' },
              { label: 'Rejected', value: rejected, color: '#f87171' },
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

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-28"
            style={{ animation: 'fadeUp 0.4s ease both' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
            >
              <FaBus size={28} style={{ color: '#334155' }} />
            </div>
            <p className="text-lg font-semibold" style={{ color: '#475569' }}>
              No tickets added yet
            </p>
            <p className="text-sm mt-1 mb-5" style={{ color: '#334155' }}>
              Start by adding your first bus ticket
            </p>
            <button
              onClick={() =>
                (window.location.href =
                  '/dashboard/vendor-dashboard/add-ticket')
              }
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#f97316' }}
              onMouseEnter={e =>
                (e.currentTarget.style.filter = 'brightness(0.88)')
              }
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              <FaPlus size={12} /> Add Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((ticket, i) => (
              <TicketCard
                key={ticket._id}
                ticket={ticket}
                index={i}
                onEdit={setEditTicket}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {editTicket && (
        <EditModal
          ticket={editTicket}
          onClose={() => setEditTicket(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default MyAddedTickets;
