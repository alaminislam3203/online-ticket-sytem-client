import { NavLink } from 'react-router';
import {
  FaUserShield,
  FaTicketAlt,
  FaUsers,
  FaCreditCard,
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

const navItems = [
  {
    to: '/dashboard/admin-profile',
    icon: <FaUserShield size={13} />,
    label: 'Admin Profile',
    desc: 'Account & settings',
    color: '#a855f7',
    activeLight: 'rgba(168,85,247,0.12)',
    activeBorder: 'rgba(168,85,247,0.3)',
    activeIcon: 'rgba(168,85,247,0.2)',
    activeText: '#c4b5fd',
    activeDesc: '#a855f7',
  },
  {
    to: '/dashboard/manage-tickets',
    icon: <FaTicketAlt size={13} />,
    label: 'Manage Tickets',
    desc: 'All platform tickets',
    color: '#a855f7',
    activeLight: 'rgba(168,85,247,0.12)',
    activeBorder: 'rgba(168,85,247,0.3)',
    activeIcon: 'rgba(168,85,247,0.2)',
    activeText: '#c4b5fd',
    activeDesc: '#a855f7',
  },
  {
    to: '/dashboard/manage-users',
    icon: <FaUsers size={13} />,
    label: 'Manage Users',
    desc: 'Users & roles',
    color: '#a855f7',
    activeLight: 'rgba(168,85,247,0.12)',
    activeBorder: 'rgba(168,85,247,0.3)',
    activeIcon: 'rgba(168,85,247,0.2)',
    activeText: '#c4b5fd',
    activeDesc: '#a855f7',
  },
  {
    to: '/dashboard/admin-payments',
    icon: <FaCreditCard size={13} />,
    label: 'Admin Payments',
    desc: 'Revenue & payouts',
    color: '#a855f7',
    activeLight: 'rgba(168,85,247,0.12)',
    activeBorder: 'rgba(168,85,247,0.3)',
    activeIcon: 'rgba(168,85,247,0.2)',
    activeText: '#c4b5fd',
    activeDesc: '#a855f7',
  },
];

const ManuAdmin = () => {
  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .admin-nav-item { animation: slideIn 0.3s ease both; }
        .admin-nav-item:nth-child(1) { animation-delay: 0.04s; }
        .admin-nav-item:nth-child(2) { animation-delay: 0.09s; }
        .admin-nav-item:nth-child(3) { animation-delay: 0.14s; }
        .admin-nav-item:nth-child(4) { animation-delay: 0.19s; }
      `}</style>

      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1"
        style={{ color: '#334155' }}
      >
        Admin Panel
      </p>

      <ul className="space-y-1">
        {navItems.map(item => (
          <li key={item.to} className="admin-nav-item">
            <NavLink to={item.to}>
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: isActive ? item.activeLight : 'transparent',
                    border: isActive
                      ? `0.5px solid ${item.activeBorder}`
                      : '0.5px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: item.color }}
                    />
                  )}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isActive
                        ? item.activeIcon
                        : 'rgba(255,255,255,0.04)',
                      color: isActive ? item.activeText : '#475569',
                      border: isActive
                        ? `0.5px solid ${item.activeBorder}`
                        : '0.5px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold leading-none"
                      style={{ color: isActive ? item.activeText : '#94a3b8' }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[10px] mt-0.5 truncate"
                      style={{ color: isActive ? item.activeDesc : '#334155' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <FiChevronRight
                    size={12}
                    style={{
                      color: isActive ? item.color : 'rgba(255,255,255,0.1)',
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

export default ManuAdmin;
