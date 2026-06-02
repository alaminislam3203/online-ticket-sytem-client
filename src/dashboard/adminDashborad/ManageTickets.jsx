import { useEffect, useState } from 'react';
import {
  FiCheck,
  FiX,
  FiRefreshCw,
  FiMapPin,
  FiUser,
  FiSearch,
  FiClock,
} from 'react-icons/fi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';
import { FaBus, FaTrain, FaShip, FaPlane } from 'react-icons/fa';

const STATUS = {
  pending: {
    label: 'Pending',
    bg: 'rgba(234,179,8,0.12)',
    color: '#facc15',
    border: 'rgba(234,179,8,0.3)',
  },
  approved: {
    label: 'Approved',
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
};

const transportIcon = type => {
  const t = (type || '').toLowerCase();
  if (t === 'train') return <FaTrain size={11} />;
  if (t === 'launch') return <FaShip size={11} />;
  if (t === 'plane') return <FaPlane size={11} />;
  return <FaBus size={11} />;
};

const FILTERS = ['all', 'pending', 'approved', 'rejected'];

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // ticketId + action string
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const load = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/all-tickets`, { headers })
      .then(r => r.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    const key = id + status;
    setActionId(key);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets/status/${id}`,
        { method: 'PATCH', headers, body: JSON.stringify({ status }) },
      );
      if (res.ok)
        setTickets(prev =>
          prev.map(t =>
            t._id === id ? { ...t, verificationStatus: status } : t,
          ),
        );
    } catch (e) {
      console.error(e);
    }
    setActionId(null);
  };

  const counts = {
    all: tickets.length,
    pending: tickets.filter(
      t => (t.verificationStatus || 'pending') === 'pending',
    ).length,
    approved: tickets.filter(t => t.verificationStatus === 'approved').length,
    rejected: tickets.filter(t => t.verificationStatus === 'rejected').length,
  };

  const visible = tickets.filter(t => {
    const st = t.verificationStatus || 'pending';
    const matchFilter = filter === 'all' || st === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.vendorEmail?.toLowerCase().includes(q) ||
      t.vendorName?.toLowerCase().includes(q) ||
      t.from?.toLowerCase().includes(q) ||
      t.to?.toLowerCase().includes(q) ||
      t.busType?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Manage Tickets</h2>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
            Approve or reject vendor-submitted tickets
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: '#0f172a',
            color: '#64748b',
            border: '0.5px solid #1e293b',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
          onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
        >
          <FiRefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {FILTERS.map(f => {
          const s = STATUS[f] || {
            color: '#94a3b8',
            bg: 'rgba(148,163,184,0.08)',
            border: 'rgba(148,163,184,0.2)',
          };
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-xl px-4 py-3 text-left transition-all"
              style={{
                background: active ? s.bg : '#0a1020',
                border: `0.5px solid ${active ? s.border : '#1e293b'}`,
              }}
            >
              <p
                className="text-xl font-bold"
                style={{ color: active ? s.color : '#f8fafc' }}
              >
                {counts[f]}
              </p>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: active ? s.color : '#475569' }}
              >
                {f}
              </p>
            </button>
          );
        })}
      </div>

      {/* Search + filter pills */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#475569' }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title, vendor, route, transport…"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: '#0a1020',
              border: '0.5px solid #1e293b',
              color: '#94a3b8',
            }}
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map(f => {
            const s = STATUS[f] || {
              color: '#818cf8',
              bg: 'rgba(99,102,241,0.15)',
              border: 'rgba(99,102,241,0.3)',
            };
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold capitalize transition-all"
                style={{
                  background: filter === f ? s.bg : '#0a1020',
                  color: filter === f ? s.color : '#475569',
                  border: `0.5px solid ${filter === f ? s.border : '#1e293b'}`,
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '0.5px solid #1e293b' }}
      >
        {/* Head */}
        <div
          className="hidden md:grid px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            gridTemplateColumns: '2.6fr 1.6fr 1fr 1fr 1fr 1fr',
            background: '#0f172a',
            color: '#334155',
            borderBottom: '0.5px solid #1e293b',
          }}
        >
          <span>Ticket</span>
          <span>Vendor</span>
          <span>Transport</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {visible.length === 0 ? (
          <div className="py-16 text-center" style={{ background: '#0f172a' }}>
            <MdOutlineConfirmationNumber
              size={32}
              className="mx-auto mb-3"
              style={{ color: '#1e293b' }}
            />
            <p className="text-sm" style={{ color: '#475569' }}>
              No tickets found.
            </p>
          </div>
        ) : (
          visible.map((t, i) => {
            const st = t.verificationStatus || 'pending';
            const s = STATUS[st] || STATUS.pending;
            const busy = act => actionId === t._id + act;
            const isLast = i === visible.length - 1;

            return (
              <div
                key={t._id}
                className="grid px-5 py-4 items-center transition-colors md:grid"
                style={{
                  gridTemplateColumns: '2.6fr 1.6fr 1fr 1fr 1fr 1fr',
                  background: i % 2 === 0 ? '#0a1020' : '#0d1526',
                  borderBottom: isLast ? 'none' : '0.5px solid #1e293b',
                }}
              >
                {/* Ticket */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                    style={{
                      border: '0.5px solid #1e293b',
                      background: '#060d1a',
                    }}
                  >
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MdOutlineConfirmationNumber
                          size={18}
                          style={{ color: '#334155' }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {t.title || '—'}
                    </p>
                    <p
                      className="text-[10px] flex items-center gap-1 mt-0.5"
                      style={{ color: '#475569' }}
                    >
                      <FiMapPin
                        size={9}
                        style={{ color: '#f97316', flexShrink: 0 }}
                      />
                      {t.from} → {t.to}
                    </p>
                    {t.departureDate && (
                      <p
                        className="text-[10px] mt-0.5 flex items-center gap-1"
                        style={{ color: '#334155' }}
                      >
                        <FiClock size={9} /> {t.departureDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vendor */}
                <div className="min-w-0">
                  <p
                    className="text-[11px] flex items-center gap-1.5 truncate"
                    style={{ color: '#64748b' }}
                  >
                    <FiUser size={10} style={{ flexShrink: 0 }} />
                    {t.vendorName || '—'}
                  </p>
                  <p
                    className="text-[10px] mt-0.5 truncate"
                    style={{ color: '#334155' }}
                  >
                    {t.vendorEmail || ''}
                  </p>
                </div>

                {/* Transport — busType from DB */}
                <div>
                  <span
                    className="text-[11px] font-medium flex items-center gap-1.5"
                    style={{ color: '#94a3b8' }}
                  >
                    {transportIcon(t.busType)}
                    {t.busType || '—'}
                  </span>
                </div>

                {/* Price */}
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: '#facc15' }}
                  >
                    ৳{t.price ?? '—'}
                  </p>
                  {t.quantity != null && (
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: '#334155' }}
                    >
                      qty: {t.quantity}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                <div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: s.bg,
                      color: s.color,
                      border: `0.5px solid ${s.border}`,
                    }}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Action buttons — Approve / Reject / Pending reset */}
                <div className="flex items-center justify-end gap-2">
                  {/* Approve */}
                  <button
                    onClick={() => updateStatus(t._id, 'approved')}
                    disabled={!!actionId || st === 'approved'}
                    title="Approve"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(34,197,94,0.1)',
                      color: '#4ade80',
                      border: '0.5px solid rgba(34,197,94,0.25)',
                    }}
                    onMouseEnter={e => {
                      if (!e.currentTarget.disabled)
                        e.currentTarget.style.background =
                          'rgba(34,197,94,0.22)';
                    }}
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = 'rgba(34,197,94,0.1)')
                    }
                  >
                    {busy('approved') ? (
                      <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiCheck size={11} /> Approve
                      </>
                    )}
                  </button>

                  {/* Reject */}
                  <button
                    onClick={() => updateStatus(t._id, 'rejected')}
                    disabled={!!actionId || st === 'rejected'}
                    title="Reject"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(239,68,68,0.1)',
                      color: '#f87171',
                      border: '0.5px solid rgba(239,68,68,0.25)',
                    }}
                    onMouseEnter={e => {
                      if (!e.currentTarget.disabled)
                        e.currentTarget.style.background =
                          'rgba(239,68,68,0.22)';
                    }}
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')
                    }
                  >
                    {busy('rejected') ? (
                      <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiX size={11} /> Reject
                      </>
                    )}
                  </button>

                  {/* Pending (reset) */}
                  <button
                    onClick={() => updateStatus(t._id, 'pending')}
                    disabled={!!actionId || st === 'pending'}
                    title="Set Pending"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(234,179,8,0.1)',
                      color: '#facc15',
                      border: '0.5px solid rgba(234,179,8,0.25)',
                    }}
                    onMouseEnter={e => {
                      if (!e.currentTarget.disabled)
                        e.currentTarget.style.background =
                          'rgba(234,179,8,0.2)';
                    }}
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = 'rgba(234,179,8,0.1)')
                    }
                  >
                    {busy('pending') ? (
                      <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiClock size={11} /> Pending
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs" style={{ color: '#334155' }}>
          Showing {visible.length} of {tickets.length} ticket
          {tickets.length !== 1 ? 's' : ''}
        </p>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs"
            style={{ color: '#818cf8' }}
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
};

export default ManageTickets;
