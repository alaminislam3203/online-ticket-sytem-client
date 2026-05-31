import { useEffect, useState } from 'react';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';
import { useAuth } from '../../Context/AuthContext';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const axiosSecure = UseAxiosSecure();

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    axiosSecure
      .get(`/transactions/${user.email}`)
      .then(res => {
        setTransactions(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-lg font-bold text-white mb-6">Transaction History</h2>

      {transactions.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
        >
          <p className="text-4xl mb-3">💳</p>
          <p className="text-sm font-semibold" style={{ color: '#475569' }}>
            No transactions yet
          </p>
          <p className="text-xs mt-1" style={{ color: '#334155' }}>
            Completed payments will appear here.
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '0.5px solid #1e293b' }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: '#0f172a',
              color: '#334155',
              borderBottom: '0.5px solid #1e293b',
            }}
          >
            <span>Transaction ID</span>
            <span>Ticket</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Date</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800">
            {transactions.map((tx, i) => (
              <div
                key={tx._id || i}
                className="grid grid-cols-4 px-5 py-4 items-center transition-colors duration-150"
                style={{ background: i % 2 === 0 ? '#0a1020' : '#0f172a' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.background = '#111827')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background =
                    i % 2 === 0 ? '#0a1020' : '#0f172a')
                }
              >
                {/* Transaction ID */}
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono truncate max-w-[120px]"
                    style={{
                      background: 'rgba(59,130,246,0.1)',
                      color: '#60a5fa',
                      border: '0.5px solid rgba(59,130,246,0.2)',
                    }}
                    title={tx.transactionId}
                  >
                    {tx.transactionId
                      ? tx.transactionId.slice(0, 14) + '…'
                      : '—'}
                  </span>
                </div>

                {/* Ticket title */}
                <span
                  className="text-xs font-medium truncate pr-2"
                  style={{ color: '#94a3b8' }}
                >
                  {tx.title || '—'}
                </span>

                {/* Amount */}
                <span
                  className="text-sm font-bold text-right"
                  style={{ color: '#4ade80' }}
                >
                  ৳{Number(tx.amount || 0).toLocaleString()}
                </span>

                {/* Date */}
                <span
                  className="text-xs text-right"
                  style={{ color: '#475569' }}
                >
                  {tx.date
                    ? new Date(tx.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
            ))}
          </div>

          {/* Footer summary */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              background: '#0f172a',
              borderTop: '0.5px solid #1e293b',
            }}
          >
            <span className="text-xs" style={{ color: '#334155' }}>
              {transactions.length} transaction
              {transactions.length !== 1 ? 's' : ''}
            </span>
            <span className="text-sm font-bold" style={{ color: '#4ade80' }}>
              Total: ৳
              {transactions
                .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
