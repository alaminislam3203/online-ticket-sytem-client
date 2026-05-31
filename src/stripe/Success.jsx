import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const run = async () => {
      try {
        // confirm-booking + transaction দুটোই একসাথে
        const bookingRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/confirm-booking`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          },
        );

        const data = await bookingRes.json();

        // Already saved মানেও success
        if (bookingRes.ok || data?.message === 'Already saved') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    };

    run();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm" style={{ color: '#475569' }}>
            Confirming your booking…
          </p>
        </div>
      )}

      {status === 'success' && (
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center flex flex-col items-center gap-5"
          style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
        >
          {/* Animated checkmark */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(34,197,94,0.12)',
              border: '0.5px solid rgba(34,197,94,0.3)',
            }}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              style={{ color: '#4ade80' }}
            >
              <path
                d="M10 21l7 7 13-14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                strokeDashoffset="0"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Payment Successful!
            </h1>
            <p className="text-sm mt-2" style={{ color: '#64748b' }}>
              Your booking has been confirmed. Check your dashboard for details.
            </p>
          </div>

          {sessionId && (
            <div
              className="w-full px-4 py-3 rounded-xl text-left"
              style={{ background: '#060d1a', border: '0.5px solid #1e293b' }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-1"
                style={{ color: '#334155' }}
              >
                Session ID
              </p>
              <p
                className="text-xs font-mono break-all"
                style={{ color: '#475569' }}
              >
                {sessionId}
              </p>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                color: '#fff',
                border: '0.5px solid rgba(59,130,246,0.4)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              My Bookings
            </button>
            <button
              onClick={() => navigate('/dashboard/history')}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'rgba(34,197,94,0.12)',
                color: '#4ade80',
                border: '0.5px solid rgba(34,197,94,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Transactions
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center flex flex-col items-center gap-5"
          style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '0.5px solid rgba(239,68,68,0.3)',
            }}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              style={{ color: '#f87171' }}
            >
              <path
                d="M12 12l16 16M28 12L12 28"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="text-sm mt-2" style={{ color: '#64748b' }}>
              We couldn't confirm your booking. Please contact support with your
              session ID.
            </p>
          </div>

          {sessionId && (
            <div
              className="w-full px-4 py-3 rounded-xl text-left"
              style={{ background: '#060d1a', border: '0.5px solid #1e293b' }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-1"
                style={{ color: '#334155' }}
              >
                Session ID
              </p>
              <p
                className="text-xs font-mono break-all"
                style={{ color: '#475569' }}
              >
                {sessionId}
              </p>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: '#1e293b',
                color: '#94a3b8',
                border: '0.5px solid #334155',
              }}
            >
              Go Home
            </button>
            <button
              onClick={() => navigate('/dashboard/bookings')}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{
                background: 'rgba(59,130,246,0.12)',
                color: '#60a5fa',
                border: '0.5px solid rgba(59,130,246,0.3)',
              }}
            >
              My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
