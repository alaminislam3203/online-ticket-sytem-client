import { useNavigate } from 'react-router';

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#060d1a' }}
    >
      <div
        className="rounded-2xl p-10 max-w-md w-full text-center flex flex-col items-center gap-5"
        style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(234,179,8,0.12)',
            border: '0.5px solid rgba(234,179,8,0.3)',
          }}
        >
          <svg
            className="w-10 h-10"
            viewBox="0 0 40 40"
            fill="none"
            style={{ color: '#facc15' }}
          >
            <path
              d="M20 12v10M20 28v1"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle
              cx="20"
              cy="20"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
          <p className="text-sm mt-2" style={{ color: '#64748b' }}>
            Your payment was not completed. No charges were made.
          </p>
        </div>

        <div
          className="w-full px-4 py-3 rounded-xl text-sm"
          style={{
            background: '#060d1a',
            border: '0.5px solid #1e293b',
            color: '#475569',
          }}
        >
          Your booking is still{' '}
          <span style={{ color: '#facc15' }}>pending</span>. You can try paying
          again from your bookings page.
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: '#1e293b',
              color: '#94a3b8',
              border: '0.5px solid #334155',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#273549')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1e293b')}
          >
            Go Home
          </button>
          <button
            onClick={() => navigate('/dashboard/bookings')}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              color: '#fff',
              border: '0.5px solid rgba(59,130,246,0.4)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
