import { NavLink } from 'react-router';
import {
  FaUserTie,
  FaPlusCircle,
  FaListAlt,
  FaCalendarCheck,
  FaChartLine,
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

const navItems = [
  {
    to: '/dashboard/vendor-dashboard/vendor-profile',
    icon: <FaUserTie size={13} />,
    label: 'Vendor Profile',
    desc: 'Account & settings',
  },
  {
    to: '/dashboard/vendor-dashboard/add-ticket',
    icon: <FaPlusCircle size={13} />,
    label: 'Add Ticket',
    desc: 'Create new listing',
  },
  {
    to: '/dashboard/vendor-dashboard/my-tickets',
    icon: <FaListAlt size={13} />,
    label: 'My Added Tickets',
    desc: 'Manage your tickets',
  },
  {
    to: '/dashboard/vendor-dashboard/requested-bookings',
    icon: <FaCalendarCheck size={13} />,
    label: 'Requested Bookings',
    desc: 'Pending approvals',
  },
  {
    to: '/dashboard/vendor-dashboard/revenue',
    icon: <FaChartLine size={13} />,
    label: 'Revenue Overview',
    desc: 'Earnings & analytics',
  },
];

const color = '#f97316';
const activeLight = 'rgba(249,115,22,0.12)';
const activeBorder = 'rgba(249,115,22,0.3)';
const activeIcon = 'rgba(249,115,22,0.2)';
const activeText = '#fdba74';
const activeDesc = '#f97316';

const ManuVendor = () => {
  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .vendor-nav-item { animation: slideIn 0.3s ease both; }
        .vendor-nav-item:nth-child(1) { animation-delay: 0.04s; }
        .vendor-nav-item:nth-child(2) { animation-delay: 0.08s; }
        .vendor-nav-item:nth-child(3) { animation-delay: 0.12s; }
        .vendor-nav-item:nth-child(4) { animation-delay: 0.16s; }
        .vendor-nav-item:nth-child(5) { animation-delay: 0.20s; }
      `}</style>

      <p
        className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-1"
        style={{ color: '#334155' }}
      >
        Vendor Panel
      </p>

      <ul className="space-y-1">
        {navItems.map(item => (
          <li key={item.to} className="vendor-nav-item">
            <NavLink to={item.to}>
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: isActive ? activeLight : 'transparent',
                    border: isActive
                      ? `0.5px solid ${activeBorder}`
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
                      style={{ background: color }}
                    />
                  )}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isActive
                        ? activeIcon
                        : 'rgba(255,255,255,0.04)',
                      color: isActive ? activeText : '#475569',
                      border: isActive
                        ? `0.5px solid ${activeBorder}`
                        : '0.5px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold leading-none"
                      style={{ color: isActive ? activeText : '#94a3b8' }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="text-[10px] mt-0.5 truncate"
                      style={{ color: isActive ? activeDesc : '#334155' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <FiChevronRight
                    size={12}
                    style={{
                      color: isActive ? color : 'rgba(255,255,255,0.1)',
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

export default ManuVendor;
