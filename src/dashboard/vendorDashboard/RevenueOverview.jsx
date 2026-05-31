import { useEffect, useState } from 'react';
import {
  FaMoneyBillWave,
  FaBus,
  FaTicketAlt,
  FaChartLine,
} from 'react-icons/fa';
import { FiTrendingUp, FiArrowUp } from 'react-icons/fi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';
import UseAxiosSecure from '../../hooks/UseAxiosSecure';

// ── Skeleton card ─────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    className="animate-pulse rounded-2xl p-5"
    style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
  >
    <div
      style={{
        height: 10,
        width: '55%',
        background: '#1e293b',
        borderRadius: 6,
        marginBottom: 16,
      }}
    />
    <div
      style={{
        height: 28,
        width: '40%',
        background: '#1e293b',
        borderRadius: 6,
        marginBottom: 8,
      }}
    />
    <div
      style={{
        height: 8,
        width: '30%',
        background: '#1e293b',
        borderRadius: 6,
      }}
    />
  </div>
);

const RevenueOverview = () => {
  const axiosSecure = UseAxiosSecure();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get('/api/vendor/revenue')
      .then(res => {
        setData(res.data);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'Total Revenue',
      value: `৳${(data?.totalRevenue || 0).toLocaleString()}`,
      raw: data?.totalRevenue || 0,
      icon: <FaMoneyBillWave size={20} />,
      color: '#34d399',
      light: 'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.3)',
      sub: 'From paid bookings',
    },
    {
      title: 'Tickets Sold',
      value: (data?.totalTicketsSold || 0).toLocaleString(),
      raw: data?.totalTicketsSold || 0,
      icon: <MdOutlineConfirmationNumber size={20} />,
      color: '#60a5fa',
      light: 'rgba(59,130,246,0.12)',
      border: 'rgba(59,130,246,0.3)',
      sub: 'Seats confirmed',
    },
    {
      title: 'Tickets Added',
      value: (data?.totalTicketsAdded || 0).toLocaleString(),
      raw: data?.totalTicketsAdded || 0,
      icon: <FaBus size={18} />,
      color: '#f97316',
      light: 'rgba(249,115,22,0.12)',
      border: 'rgba(249,115,22,0.3)',
      sub: 'Listed on platform',
    },
    {
      title: 'Avg per Ticket',
      value: data?.totalTicketsSold
        ? `৳${Math.round(data.totalRevenue / data.totalTicketsSold).toLocaleString()}`
        : '৳0',
      raw: data?.totalTicketsSold
        ? Math.round(data.totalRevenue / data.totalTicketsSold)
        : 0,
      icon: <FaChartLine size={18} />,
      color: '#a78bfa',
      light: 'rgba(167,139,250,0.12)',
      border: 'rgba(167,139,250,0.3)',
      sub: 'Per seat revenue',
    },
  ];

  const tableRows = [
    {
      label: 'Total Revenue Earned',
      value: `৳${(data?.totalRevenue || 0).toLocaleString()}`,
      color: '#34d399',
    },
    {
      label: 'Total Tickets Sold',
      value: (data?.totalTicketsSold || 0).toLocaleString(),
      color: '#60a5fa',
    },
    {
      label: 'Total Tickets Listed',
      value: (data?.totalTicketsAdded || 0).toLocaleString(),
      color: '#f97316',
    },
    {
      label: 'Conversion Rate',
      value: data?.totalTicketsAdded
        ? `${Math.min(100, Math.round((data.totalTicketsSold / data.totalTicketsAdded) * 100))}%`
        : '0%',
      color: '#a78bfa',
    },
    {
      label: 'Average Revenue / Ticket',
      value: data?.totalTicketsSold
        ? `৳${Math.round(data.totalRevenue / data.totalTicketsSold).toLocaleString()}`
        : '৳0',
      color: '#fbbf24',
    },
  ];

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
        @keyframes countUp {
          from { opacity: 0; transform: translateY(8px); }
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
            <FiTrendingUp size={11} /> Revenue Overview
          </div>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
          >
            Earnings & Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>
            Track your ticket sales and revenue performance
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map((card, i) => (
                <div
                  key={card.title}
                  className="rounded-2xl p-5 transition-all duration-300"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #1e293b',
                    animation: `fadeUp 0.4s ${i * 0.07}s ease both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `0.5px solid ${card.border}`;
                    e.currentTarget.style.boxShadow = `0 8px 32px ${card.color}10`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '0.5px solid #1e293b';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon + title */}
                  <div className="flex items-center justify-between mb-4">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: '#475569' }}
                    >
                      {card.title}
                    </p>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: card.light,
                        border: `0.5px solid ${card.border}`,
                      }}
                    >
                      <span style={{ color: card.color }}>{card.icon}</span>
                    </div>
                  </div>

                  {/* Value */}
                  <p
                    className="text-2xl font-extrabold mb-1"
                    style={{
                      color: card.color,
                      animation: 'countUp 0.5s ease both',
                    }}
                  >
                    {card.value}
                  </p>
                  <p className="text-[11px]" style={{ color: '#334155' }}>
                    {card.sub}
                  </p>

                  {/* Mini bar */}
                  <div
                    className="mt-3 h-1 rounded-full overflow-hidden"
                    style={{ background: '#1e293b' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        background: card.color,
                        width: card.raw > 0 ? '100%' : '0%',
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </div>
              ))}
        </div>

        {/* Revenue Summary Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '0.5px solid #1e293b',
            animation: 'fadeUp 0.4s 0.3s ease both',
          }}
        >
          {/* Table header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              background: '#0a1020',
              borderBottom: '0.5px solid #1e293b',
            }}
          >
            <div>
              <h2 className="text-sm font-bold" style={{ color: '#f8fafc' }}>
                Revenue Summary
              </h2>
              <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>
                Detailed breakdown of your performance
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{
                background: 'rgba(52,211,153,0.1)',
                border: '0.5px solid rgba(52,211,153,0.25)',
              }}
            >
              <FiArrowUp size={11} style={{ color: '#34d399' }} />
              <span
                className="text-xs font-semibold"
                style={{ color: '#34d399' }}
              >
                Live data
              </span>
            </div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between">
                  <div
                    style={{
                      height: 12,
                      width: '35%',
                      background: '#1e293b',
                      borderRadius: 6,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      width: '20%',
                      background: '#1e293b',
                      borderRadius: 6,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : error ? (
            <div
              className="flex flex-col items-center py-16"
              style={{ background: '#0f172a' }}
            >
              <p className="text-sm" style={{ color: '#f87171' }}>
                Failed to load revenue data
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: 'rgba(249,115,22,0.12)',
                  color: '#fb923c',
                  border: '0.5px solid rgba(249,115,22,0.3)',
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            tableRows.map((row, i) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-6 py-4 transition-colors duration-150"
                style={{
                  background: i % 2 === 0 ? '#0a1020' : '#0f172a',
                  borderBottom:
                    i < tableRows.length - 1 ? '0.5px solid #1e293b' : 'none',
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.background = '#111827')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background =
                    i % 2 === 0 ? '#0a1020' : '#0f172a')
                }
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: '#64748b' }}
                >
                  {row.label}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: row.color }}
                >
                  {row.value}
                </span>
              </div>
            ))
          )}

          {/* Footer */}
          {!loading && !error && (
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{
                background: '#0a1020',
                borderTop: '0.5px solid #1e293b',
              }}
            >
              <span className="text-xs" style={{ color: '#334155' }}>
                All figures based on confirmed paid bookings
              </span>
              <span className="text-xs font-bold" style={{ color: '#34d399' }}>
                ৳{(data?.totalRevenue || 0).toLocaleString()} total
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
