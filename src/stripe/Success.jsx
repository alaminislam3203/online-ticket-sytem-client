import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const Success = () => {
  const query = new URLSearchParams(useLocation().search);
  const sessionId = query.get('session_id');
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    if (sessionId) {
      axios.post(`${import.meta.env.VITE_API_URL}/api/save-transaction`, {
        sessionId,
      });
      axios.post(`${import.meta.env.VITE_API_URL}/api/confirm-booking`, {
        sessionId,
      });
    }
  }, [sessionId]);

  return (
    <div style={styles.page}>
      {/* Ambient blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{ ...styles.particle, ...particleStyle(i) }} />
      ))}

      {/* Card */}
      <div
        style={{
          ...styles.card,
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translateY(0) scale(1)'
            : 'translateY(32px) scale(0.97)',
          transition:
            'opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* Top glow strip */}
        <div style={styles.topStrip} />

        {/* Check icon */}
        <div style={styles.iconWrap}>
          <div
            style={{
              ...styles.iconRing,
              animation: 'ringPulse 2.5s ease-in-out infinite',
            }}
          />
          <div style={styles.iconInner}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <path
                d="M8 20L15.5 27.5L30 11"
                stroke="#fff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <p style={styles.eyebrow}>Transaction Complete</p>
        <h1 style={styles.heading}>Payment Successful</h1>
        <p style={styles.sub}>
          Your booking has been confirmed and your ticket is on its way. A
          confirmation has been sent to your email.
        </p>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Session ID */}
        {sessionId && (
          <div style={styles.sessionBox}>
            <span style={styles.sessionLabel}>Session ID</span>
            <span style={styles.sessionId}>{sessionId}</span>
          </div>
        )}

        {/* Buttons */}
        <div style={styles.btnRow}>
          <button
            style={styles.btnPrimary}
            onClick={() => navigate('/dashboard/bookings')}
            onMouseEnter={e =>
              (e.currentTarget.style.transform = 'translateY(-2px)')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            View My Bookings
          </button>
          <button
            style={styles.btnSecondary}
            onClick={() => navigate('/')}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Back to Home
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.18); opacity: 0.15; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-80px) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

function particleStyle(i) {
  const left = [8, 15, 22, 35, 48, 55, 62, 70, 78, 85, 90, 5][i];
  const delay = [0, 0.8, 1.6, 0.4, 1.2, 2, 0.2, 1.4, 0.6, 1.8, 1, 2.2][i];
  const size = [4, 6, 3, 5, 4, 7, 3, 5, 6, 4, 3, 5][i];
  return {
    left: `${left}%`,
    bottom: `${10 + (i % 4) * 8}%`,
    width: size,
    height: size,
    animationDelay: `${delay}s`,
    animationDuration: `${3 + (i % 3)}s`,
  };
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Sora', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    left: '-5%',
    width: 480,
    height: 480,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '-10%',
    right: '-5%',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob3: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(251,191,36,0.5)',
    animation: 'floatUp 3s ease-in-out infinite',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 28,
    padding: '52px 44px 44px',
    maxWidth: 480,
    width: '100%',
    textAlign: 'center',
    boxShadow:
      '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
    zIndex: 10,
  },
  topStrip: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 3,
    background:
      'linear-gradient(90deg, transparent, #fbbf24, #10b981, transparent)',
    borderRadius: '0 0 4px 4px',
  },
  iconWrap: {
    position: 'relative',
    width: 80,
    height: 80,
    margin: '0 auto 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRing: {
    position: 'absolute',
    inset: -8,
    borderRadius: '50%',
    background:
      'radial-gradient(circle, rgba(16,185,129,0.35) 0%, transparent 70%)',
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 32px rgba(16,185,129,0.45)',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#10b981',
    margin: '0 0 10px',
  },
  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: '#f8fafc',
    margin: '0 0 14px',
    lineHeight: 1.15,
  },
  sub: {
    fontSize: 14.5,
    color: '#94a3b8',
    lineHeight: 1.7,
    margin: '0 0 28px',
  },
  divider: {
    height: 1,
    background:
      'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
    margin: '0 0 24px',
  },
  sessionBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '14px 18px',
    margin: '0 0 28px',
    textAlign: 'left',
  },
  sessionLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#64748b',
  },
  sessionId: {
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    color: '#fbbf24',
    wordBreak: 'break-all',
    lineHeight: 1.5,
  },
  btnRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  btnPrimary: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    color: '#0f172a',
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
    fontWeight: 700,
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(251,191,36,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnSecondary: {
    padding: '14px 24px',
    background: 'transparent',
    color: '#94a3b8',
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
  },
};

export default Success;
