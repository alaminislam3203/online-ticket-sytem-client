import { useEffect, useState } from 'react';

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/tickets`, { headers })
      .then(r => r.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const advertisedCount = tickets.filter(t => t.isAdvertised).length;

  const toggleAdvertise = async ticket => {
    const next = !ticket.isAdvertised;

    if (next && advertisedCount >= 6) {
      setError('Cannot advertise more than 6 tickets at a time.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setActionId(ticket._id);
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/tickets/advertise/${ticket._id}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ isAdvertised: next }),
        },
      );

      if (res.ok) {
        setTickets(prev =>
          prev.map(t =>
            t._id === ticket._id ? { ...t, isAdvertised: next } : t,
          ),
        );
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update.');
        setTimeout(() => setError(''), 3000);
      }
    } catch (e) {
      setError('Something went wrong.');
      setTimeout(() => setError(''), 3000);
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Advertise Tickets</h2>
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background:
              advertisedCount >= 6
                ? 'rgba(239,68,68,0.12)'
                : 'rgba(34,197,94,0.12)',
            color: advertisedCount >= 6 ? '#f87171' : '#4ade80',
            border: `0.5px solid ${advertisedCount >= 6 ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
          }}
        >
          {advertisedCount}/6 advertised
        </span>
      </div>

      {/* Error toast */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'rgba(239,68,68,0.12)',
            color: '#f87171',
            border: '0.5px solid rgba(239,68,68,0.3)',
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
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
          <span className="col-span-5">Ticket</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-3 text-right">Advertise</span>
        </div>

        {tickets.map((t, i) => (
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
            <div className="col-span-5 flex items-center gap-3">
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

            {/* Transport */}
            <div className="col-span-2">
              <p className="text-xs" style={{ color: '#94a3b8' }}>
                {t.busType || t.transportType || '—'}
              </p>
            </div>

            {/* Price */}
            <div className="col-span-2">
              <p className="text-sm font-bold" style={{ color: '#60a5fa' }}>
                ${t.price}
              </p>
            </div>

            {/* Toggle */}
            <div className="col-span-3 flex justify-end">
              <button
                onClick={() => toggleAdvertise(t)}
                disabled={actionId === t._id}
                className="relative w-12 h-6 rounded-full transition-all duration-300 disabled:opacity-50"
                style={{
                  background: t.isAdvertised
                    ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                    : '#1e293b',
                  border:
                    '0.5px solid ' +
                    (t.isAdvertised ? 'rgba(124,58,237,0.5)' : '#334155'),
                }}
                title={t.isAdvertised ? 'Unadvertise' : 'Advertise'}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    background: t.isAdvertised ? '#c4b5fd' : '#475569',
                    left: t.isAdvertised ? 'calc(100% - 1.375rem)' : '0.125rem',
                  }}
                />
              </button>
            </div>
          </div>
        ))}

        {tickets.length === 0 && (
          <div className="py-16 text-center" style={{ background: '#0f172a' }}>
            <p className="text-sm" style={{ color: '#475569' }}>
              No approved tickets found.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#334155' }}>
        {tickets.length} approved ticket{tickets.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default AdvertiseTickets;
