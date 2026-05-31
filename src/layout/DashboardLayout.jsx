import { useContext, useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router';
import { FaBus, FaHome, FaUserShield, FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';
import ManuAdmin from '../dashboard/adminDashborad/ManuAdmin';
import ManuVendor from '../dashboard/vendorDashboard/ManuVendor';
import ManuUser from '../dashboard/userDashborad/ManuUser';

const roleAccent = {
  admin: {
    color: '#a855f7',
    light: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    glow: 'rgba(168,85,247,0.08)',
    label: 'Admin',
  },
  vendor: {
    color: '#f97316',
    light: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.3)',
    glow: 'rgba(249,115,22,0.08)',
    label: 'Vendor',
  },
  user: {
    color: '#3b82f6',
    light: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.3)',
    glow: 'rgba(59,130,246,0.08)',
    label: 'User',
  },
};
const getAccent = role => roleAccent[role?.toLowerCase()] || roleAccent.user;

const DashboardLayout = () => {
  const { user, loading, role } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const accent = getAccent(role);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'transparent' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(249,115,22,0.12)',
              border: '0.5px solid rgba(249,115,22,0.3)',
            }}
          >
            <FaBus size={22} style={{ color: '#f97316' }} />
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#f97316',
                  animation: `pulse-dot 1.2s ${i * 0.2}s infinite`,
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse-dot { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-8px);opacity:1} }`}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const Sidebar = () => (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(249,115,22,0.15)',
            border: '0.5px solid rgba(249,115,22,0.3)',
          }}
        >
          <FaBus size={15} style={{ color: '#f97316' }} />
        </div>
        <span
          className="text-xl font-extrabold tracking-tight"
          style={{ color: '#f8fafc', letterSpacing: '-0.03em' }}
        >
          VOYAGO
        </span>
      </div>

      {/* User pill */}
      <div
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl mb-6"
        style={{
          background: accent.light,
          border: `0.5px solid ${accent.border}`,
        }}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
            style={{ border: `1px solid ${accent.border}` }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: accent.light }}
          >
            <FaUserShield size={13} style={{ color: accent.color }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold truncate"
            style={{ color: '#e2e8f0' }}
          >
            {user?.displayName || user?.email?.split('@')[0]}
          </p>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{
              background: accent.color,
              color: '#fff',
              letterSpacing: '0.03em',
            }}
          >
            {accent.label}
          </span>
        </div>
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: '#4ade80', boxShadow: '0 0 5px #4ade80' }}
        />
      </div>

      {/* Home link */}
      <div className="mb-4">
        <NavLink to="/">
          {({ isActive }) => (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                border: isActive
                  ? '0.5px solid rgba(249,115,22,0.3)'
                  : '0.5px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isActive
                    ? 'rgba(249,115,22,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  border: isActive
                    ? '0.5px solid rgba(249,115,22,0.3)'
                    : '0.5px solid rgba(255,255,255,0.08)',
                }}
              >
                <FaHome
                  size={12}
                  style={{ color: isActive ? '#fb923c' : '#475569' }}
                />
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: isActive ? '#fb923c' : '#94a3b8' }}
              >
                Home
              </span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '0.5px',
          background: 'rgba(255,255,255,0.06)',
          marginBottom: 16,
        }}
      />

      {/* Role menu */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {role === 'admin' ? (
          <ManuAdmin />
        ) : role === 'vendor' ? (
          <ManuVendor />
        ) : (
          <ManuUser />
        )}
      </div>

      {/* Bottom strip */}
      <div
        className="mt-6 pt-4 flex items-center gap-2"
        style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#4ade80', boxShadow: '0 0 5px #4ade80' }}
        />
        <span className="text-[11px]" style={{ color: '#334155' }}>
          Active session
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex relative"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

      {/* Subtle grid overlay (no bg set — inherits from root) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Role-tinted ambient glow bottom-right */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent.color}0a 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col relative z-10 flex-shrink-0"
        style={{
          width: 260,

          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '0.5px solid rgba(255,255,255,0.07)',
          padding: '28px 20px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <Sidebar />
      </aside>

      {/* ── Mobile overlay ───────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className="fixed top-0 left-0 h-full z-50 lg:hidden flex flex-col transition-transform duration-300"
        style={{
          width: 260,
          background: 'rgba(8,14,28,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '0.5px solid rgba(255,255,255,0.07)',
          padding: '28px 20px',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          overflowY: 'auto',
        }}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            color: '#475569',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >
          <FaTimes size={12} />
        </button>
        <Sidebar />
      </aside>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Mobile topbar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
          style={{
            background: 'rgba(8,14,28,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              color: '#94a3b8',
            }}
          >
            <FaBars size={14} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(249,115,22,0.15)' }}
            >
              <FaBus size={12} style={{ color: '#f97316' }} />
            </div>
            <span
              className="text-sm font-bold"
              style={{ color: '#f8fafc', letterSpacing: '-0.02em' }}
            >
              VOYAGO
            </span>
          </div>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="avatar"
              className="w-8 h-8 rounded-xl object-cover flex-shrink-0"
              style={{ border: `1px solid ${accent.border}` }}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: accent.light,
                border: `0.5px solid ${accent.border}`,
              }}
            >
              <FaUserShield size={13} style={{ color: accent.color }} />
            </div>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
