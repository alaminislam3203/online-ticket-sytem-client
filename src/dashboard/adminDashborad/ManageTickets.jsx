import { useEffect, useState } from 'react';

const statusConfig = {
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

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, { headers })
      .then(r => r.json())
      .then(data => {
        // /api/tickets returns { tickets, total } when paginated — handle both
        const list = Array.isArray(data) ? data : data.tickets || [];
        setTickets(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setActionId(id + status);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tickets/status/${id}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status }),
        },
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="px-4 py-8">
      <h2 className="text-lg font-bold text-white mb-6">Manage Tickets</h2>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '0.5px solid #1e293b' }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            background: '#0f172a',
            color: '#334155',
            borderBottom: '0.5px solid #1e293b',
          }}
        >
          <span className="col-span-4">Ticket</span>
          <span className="col-span-2">Vendor</span>
          <span className="col-span-2">Transport</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {/* Rows */}
        {tickets.map((t, i) => {
          const s = statusConfig[t.verificationStatus] || statusConfig.pending;
          const busy = id => actionId === t._id + id;

          return (
            <div
              key={t._id}
              className="grid grid-cols-12 px-5 py-4 items-center"
              style={{
                background: i % 2 === 0 ? '#0a1020' : '#0f172a',
                borderBottom:
                  i < tickets.length - 1 ? '0.5px solid #1e293b' : 'none',
              }}
            >
              {/* Ticket info */}
              <div className="col-span-4 flex items-center gap-3">
                {t.image && (
                  <img
                    src={t.image}
                    alt={t.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {t.title || '—'}
                  </p>
                  <p
                    className="text-[10px] truncate"
                    style={{ color: '#475569' }}
                  >
                    {t.from} → {t.to}
                  </p>
                </div>
              </div>

              {/* Vendor email */}
              <div className="col-span-2">
                <p
                  className="text-[10px] truncate"
                  style={{ color: '#64748b' }}
                >
                  {t.vendorEmail || '—'}
                </p>
              </div>

              {/* Transport */}
              <div className="col-span-2">
                <p className="text-xs" style={{ color: '#94a3b8' }}>
                  {t.busType || t.transportType || '—'}
                </p>
              </div>

              {/* Status badge */}
              <div className="col-span-2">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: s.bg,
                    color: s.color,
                    border: `0.5px solid ${s.border}`,
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => updateStatus(t._id, 'approved')}
                  disabled={!!actionId || t.verificationStatus === 'approved'}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    color: '#4ade80',
                    border: '0.5px solid rgba(34,197,94,0.3)',
                  }}
                >
                  {busy('approved') ? '…' : 'Approve'}
                </button>
                <button
                  onClick={() => updateStatus(t._id, 'rejected')}
                  disabled={!!actionId || t.verificationStatus === 'rejected'}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    color: '#f87171',
                    border: '0.5px solid rgba(239,68,68,0.3)',
                  }}
                >
                  {busy('rejected') ? '…' : 'Reject'}
                </button>
              </div>
            </div>
          );
        })}

        {tickets.length === 0 && (
          <div className="py-16 text-center" style={{ background: '#0f172a' }}>
            <p className="text-sm" style={{ color: '#475569' }}>
              No tickets found.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#334155' }}>
        {tickets.length} total ticket{tickets.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default ManageTickets;
