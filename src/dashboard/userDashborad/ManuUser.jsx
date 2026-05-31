import { NavLink } from 'react-router';
import { FaUser, FaTicketAlt, FaHistory } from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

const navItems = [
  {
    to: '/dashboard/user-profile',
    icon: <FaUser size={13} />,
    label: 'My Profile',
    desc: 'Account & settings',
  },
  {
    to: '/dashboard/bookings',
    icon: <FaTicketAlt size={13} />,
    label: 'My Bookings',
    desc: 'View booked tickets',
  },
  {
    to: '/dashboard/history',
    icon: <FaHistory size={12} />,
    label: 'Payment History',
    desc: 'Transactions & receipts',
  },
];

const ManuUser = () => {
  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .nav-item { animation: slideIn 0.3s ease both; }
        .nav-item:nth-child(1) { animation-delay: 0.04s; }
        .nav-item:nth-child(2) { animation-delay: 0.09s; }
        .nav-item:nth-child(3) { animation-delay: 0.14s; }
      `}</style>

      {/* Section label */}
      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1"
        style={{ color: '#334155' }}
      >
        My Account
      </p>

      <ul className="space-y-1">
        {navItems.map(item => (
          <li key={item.to} className="nav-item">
            <NavLink to={item.to}>
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
                  style={{
                    background: isActive
                      ? 'rgba(59,130,246,0.12)'
                      : 'transparent',
                    border: isActive
                      ? '0.5px solid rgba(59,130,246,0.3)'
                      : '0.5px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#0f172a';
                      e.currentTarget.style.borderColor = '#1e293b';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: '#3b82f6' }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(59,130,246,0.2)' : '#0f172a',
                      color: isActive ? '#60a5fa' : '#475569',
                      border: isActive
                        ? '0.5px solid rgba(59,130,246,0.3)'
                        : '0.5px solid #1e293b',
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold leading-none"
                      style={{ color: isActive ? '#93c5fd' : '#94a3b8' }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[10px] mt-0.5 truncate"
                      style={{ color: isActive ? '#3b82f6' : '#334155' }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  {/* Chevron */}
                  <FiChevronRight
                    size={12}
                    style={{
                      color: isActive ? '#3b82f6' : '#1e293b',
                      flexShrink: 0,
                      transition: 'color 0.2s',
                    }}
                  />
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ManuUser;
