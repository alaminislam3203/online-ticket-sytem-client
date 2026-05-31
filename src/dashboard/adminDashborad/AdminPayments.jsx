import { useEffect, useState } from 'react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments`, { headers })
      .then(r => r.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = payments.reduce((s, p) => s + Number(p.amount || 0), 0);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">All Payments</h2>
        <div
          className="px-4 py-2 rounded-xl text-sm font-bold"
          style={{
            background: 'rgba(34,197,94,0.12)',
            color: '#4ade80',
            border: '0.5px solid rgba(34,197,94,0.3)',
          }}
        >
          Total: ${totalRevenue.toFixed(2)}
        </div>
      </div>

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
          <span className="col-span-3">Transaction ID</span>
          <span className="col-span-3">User</span>
          <span className="col-span-2">Ticket</span>
          <span className="col-span-2 text-right">Amount</span>
          <span className="col-span-2 text-right">Date</span>
        </div>

        {payments.map((p, i) => (
          <div
            key={p._id || i}
            className="grid grid-cols-12 px-5 py-4 items-center"
            style={{
              background: i % 2 === 0 ? '#0a1020' : '#0f172a',
              borderBottom:
                i < payments.length - 1 ? '0.5px solid #1e293b' : 'none',
            }}
          >
            <div className="col-span-3">
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-mono"
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  color: '#c084fc',
                  border: '0.5px solid rgba(168,85,247,0.2)',
                }}
                title={p.transactionId}
              >
                {p.transactionId ? p.transactionId.slice(0, 16) + '…' : '—'}
              </span>
            </div>
            <div className="col-span-3">
              <p className="text-xs truncate" style={{ color: '#94a3b8' }}>
                {p.email || '—'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs truncate" style={{ color: '#64748b' }}>
                {p.title || '—'}
              </p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-sm font-bold" style={{ color: '#4ade80' }}>
                ${Number(p.amount || 0).toFixed(2)}
              </p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs" style={{ color: '#475569' }}>
                {p.date || p.createdAt
                  ? new Date(p.date || p.createdAt).toLocaleDateString(
                      'en-US',
                      { day: 'numeric', month: 'short', year: 'numeric' },
                    )
                  : '—'}
              </p>
            </div>
          </div>
        ))}

        {payments.length === 0 && (
          <div className="py-16 text-center" style={{ background: '#0f172a' }}>
            <p className="text-sm" style={{ color: '#475569' }}>
              No payments yet.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#334155' }}>
        {payments.length} transaction{payments.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default AdminPayments;
