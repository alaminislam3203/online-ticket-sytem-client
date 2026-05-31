import { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../Context/AuthContext';
import logo from '../assets/logo1.png';
import {
  FiHome,
  FiGrid,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiMapPin,
  FiSearch,
  FiMenu,
  FiX,
  FiLayout,
  FiBell,
  FiBriefcase,
} from 'react-icons/fi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';

const cities = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Rangpur',
];

const Navbar = () => {
  const { user, signOutUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ticketsRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ticketsRef.current && !ticketsRef.current.contains(e.target))
        setTicketsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    signOutUser();
    setProfileOpen(false);
    setMobileOpen(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery('');
    setMobileOpen(false);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <nav
        className="fixed top-0 w-full z-50 h-16 flex items-center px-6"
        style={{ background: '#0f172a', borderBottom: '0.5px solid #1e293b' }}
      >
        <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin ml-auto" />
      </nav>
    );
  }

  return (
    <>
      {/* ─── DESKTOP NAVBAR ─── */}
      <nav
        className="hidden lg:block fixed top-0 w-full z-50"
        style={{ background: '#0f172a', borderBottom: '0.5px solid #1e293b' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex-shrink-0 flex items-center gap-2 mr-2"
            >
              <img
                src={logo}
                alt="Voyago"
                className="w-9 h-9 rounded-full object-cover"
                style={{ border: '2px solid #334155' }}
              />
              <span
                className="font-bold text-lg tracking-tight hidden xl:block"
                style={{ color: '#f8fafc' }}
              >
                VOYAGO
              </span>
            </NavLink>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-md flex items-center h-10 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                background: '#1e293b',
                border: '0.5px solid #334155',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#f97316')}
              onBlur={e => (e.currentTarget.style.borderColor = '#334155')}
            >
              <FiSearch
                className="ml-3 flex-shrink-0"
                size={15}
                style={{ color: '#64748b' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="flex-1 h-full px-3 text-sm outline-none bg-transparent"
                style={{ color: '#e2e8f0' }}
              />
              {searchQuery && (
                <button
                  type="submit"
                  className="h-full px-4 flex items-center transition-colors"
                  style={{ background: '#f97316' }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = '#ea580c')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background = '#f97316')
                  }
                >
                  <FiSearch className="text-white" size={14} />
                </button>
              )}
            </form>

            {/* Nav Links */}
            <div className="flex items-center gap-1 ml-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-orange-400' : 'hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive
                    ? 'rgba(249,115,22,0.12)'
                    : 'transparent',
                  color: isActive ? '#fb923c' : '#94a3b8',
                })}
              >
                <FiHome size={15} />
                Home
              </NavLink>

              {user && (
                <NavLink
                  to="/tickets"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200`
                  }
                  style={({ isActive }) => ({
                    background: isActive
                      ? 'rgba(249,115,22,0.12)'
                      : 'transparent',
                    color: isActive ? '#fb923c' : '#94a3b8',
                  })}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.color = '#f8fafc';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <FiBriefcase size={15} />
                  All Tickets
                </NavLink>
              )}
            </div>
            {/* Tickets Dropdown */}
            <div className="relative" ref={ticketsRef}>
              <button
                onClick={() => setTicketsOpen(!ticketsOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.color = '#f8fafc';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }}
              >
                <MdOutlineConfirmationNumber size={15} />
                Tickets
                <FiChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${ticketsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {ticketsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden z-50"
                  style={{
                    background: '#0f172a',
                    border: '0.5px solid #334155',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                >
                  <div
                    className="px-3 py-2"
                    style={{ borderBottom: '0.5px solid #1e293b' }}
                  >
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: '#475569' }}
                    >
                      Select City
                    </p>
                  </div>
                  {cities.map(city => (
                    <NavLink
                      key={city}
                      to={`/tickets/${city.toLowerCase()}`}
                      onClick={() => setTicketsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                          isActive ? 'font-medium' : ''
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#fb923c' : '#94a3b8',
                        background: isActive
                          ? 'rgba(249,115,22,0.1)'
                          : 'transparent',
                      })}
                      onMouseEnter={e => {
                        if (!e.currentTarget.dataset.active) {
                          e.currentTarget.style.background = '#1e293b';
                          e.currentTarget.style.color = '#f8fafc';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!e.currentTarget.dataset.active) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }
                      }}
                    >
                      <FiMapPin
                        size={13}
                        style={{ color: '#f97316', flexShrink: 0 }}
                      />
                      {city}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 ml-auto">
              {!user ? (
                <>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                    style={{ color: '#94a3b8', border: '0.5px solid #334155' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#f97316';
                      e.currentTarget.style.color = '#fb923c';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.color = '#94a3b8';
                    }}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 shadow-sm"
                    style={{ background: '#f97316' }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.background = '#ea580c')
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.background = '#f97316')
                    }
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200"
                    style={{ border: '0.5px solid transparent' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#1e293b';
                      e.currentTarget.style.borderColor = '#334155';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full overflow-hidden"
                      style={{ border: '2px solid #334155' }}
                    >
                      <img
                        src={
                          user?.photoURL ||
                          'https://i.ibb.co/4pDNDk1/avatar.png'
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                        onError={e =>
                          (e.target.src = 'https://i.ibb.co/4pDNDk1/avatar.png')
                        }
                      />
                    </div>
                    <div className="hidden xl:block text-left">
                      <p
                        className="text-xs leading-none"
                        style={{ color: '#475569' }}
                      >
                        {getGreeting()}
                      </p>
                      <p
                        className="text-sm font-semibold leading-tight mt-0.5"
                        style={{ color: '#e2e8f0' }}
                      >
                        {user?.displayName?.split(' ')[0] || 'User'}
                      </p>
                    </div>
                    <FiChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                      style={{ color: '#475569' }}
                    />
                  </button>

                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                      style={{
                        background: '#0f172a',
                        border: '0.5px solid #334155',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }}
                    >
                      {/* User Info Header */}
                      <div
                        className="px-4 py-3"
                        style={{
                          background: '#1e293b',
                          borderBottom: '0.5px solid #334155',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full overflow-hidden"
                            style={{ border: '2px solid #f97316' }}
                          >
                            <img
                              src={
                                user?.photoURL ||
                                'https://i.ibb.co/4pDNDk1/avatar.png'
                              }
                              alt="avatar"
                              className="w-full h-full object-cover"
                              onError={e =>
                                (e.target.src =
                                  'https://i.ibb.co/4pDNDk1/avatar.png')
                              }
                            />
                          </div>
                          <div>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: '#f8fafc' }}
                            >
                              {user?.displayName || 'User'}
                            </p>
                            <p
                              className="text-xs truncate max-w-[130px]"
                              style={{ color: '#64748b' }}
                            >
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <NavLink
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#94a3b8' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#1e293b';
                            e.currentTarget.style.color = '#fb923c';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                          }}
                        >
                          <FiLayout size={15} /> Dashboard
                        </NavLink>
                        <NavLink
                          to={(() => {
                            const token = localStorage.getItem('token');
                            try {
                              const role = JSON.parse(
                                atob(token.split('.')[1]),
                              ).role;
                              if (role === 'admin')
                                return '/dashboard/manu-admin/admin-profile';
                              if (role === 'vendor')
                                return '/dashboard/vendor-dashboard/vendor-profile';
                              return '/dashboard/user-profile';
                            } catch {
                              return '/dashboard/user-profile';
                            }
                          })()}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: '#94a3b8' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#1e293b';
                            e.currentTarget.style.color = '#fb923c';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#94a3b8';
                          }}
                        >
                          <FiUser size={15} /> My Profile
                        </NavLink>
                        <div
                          style={{
                            borderTop: '0.5px solid #1e293b',
                            marginTop: '4px',
                            paddingTop: '4px',
                          }}
                        >
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium transition-colors"
                            style={{ color: '#f87171' }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.background =
                                'rgba(248,113,113,0.08)')
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.background = 'transparent')
                            }
                          >
                            <FiLogOut size={15} /> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE TOP BAR ─── */}
      <div
        className="lg:hidden fixed top-0 w-full z-50"
        style={{ background: '#0f172a', borderBottom: '0.5px solid #1e293b' }}
      >
        <div className="px-4 pt-3 pb-2.5">
          {/* Row 1: Avatar + Greeting + Hamburger */}
          <div className="flex items-center justify-between mb-2.5">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                style={{ border: '2px solid #334155' }}
              >
                <img
                  src={user?.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                  alt="avatar"
                  className="w-full h-full object-cover"
                  onError={e =>
                    (e.target.src = 'https://i.ibb.co/4pDNDk1/avatar.png')
                  }
                />
              </div>
              <div className="text-left">
                <p
                  className="text-[11px] leading-none"
                  style={{ color: '#475569' }}
                >
                  {getGreeting()}
                </p>
                <p
                  className="text-sm font-semibold leading-tight mt-0.5"
                  style={{ color: '#f8fafc' }}
                >
                  {user
                    ? (user?.displayName?.split(' ')[0] || 'User') + ' 👋'
                    : 'Hello, Guest'}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: '#1e293b',
                  border: '0.5px solid #334155',
                  color: '#64748b',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f97316')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >
                <FiBell size={17} />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: '#1e293b',
                  border: '0.5px solid #334155',
                  color: '#64748b',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#f97316')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >
                {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>

          {/* Row 2: Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center h-10 rounded-xl overflow-hidden transition-all"
            style={{ background: '#1e293b', border: '0.5px solid #334155' }}
          >
            <FiSearch
              className="ml-3 flex-shrink-0"
              size={15}
              style={{ color: '#64748b' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="flex-1 h-full px-2.5 text-sm outline-none bg-transparent"
              style={{ color: '#e2e8f0' }}
            />
            {searchQuery && (
              <button
                type="submit"
                className="h-full px-3.5 flex items-center"
                style={{ background: '#f97316' }}
              >
                <FiSearch className="text-white" size={14} />
              </button>
            )}
          </form>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div
            className="px-4 py-3 space-y-1 shadow-lg"
            style={{ borderTop: '0.5px solid #1e293b', background: '#0f172a' }}
          >
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                color: isActive ? '#fb923c' : '#94a3b8',
              })}
            >
              <FiHome size={16} /> Home
            </NavLink>

            {/* Cities accordion */}
            <div>
              <button
                onClick={() => setTicketsOpen(!ticketsOpen)}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e =>
                  (e.currentTarget.style.background = '#1e293b')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                <span className="flex items-center gap-2.5">
                  <MdOutlineConfirmationNumber size={16} /> All Tickets
                </span>
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${ticketsOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {ticketsOpen && (
                <div
                  className="ml-4 mt-1 space-y-0.5 pl-3"
                  style={{ borderLeft: '2px solid rgba(249,115,22,0.2)' }}
                >
                  {cities.map(city => (
                    <NavLink
                      key={city}
                      to={`/tickets/${city.toLowerCase()}`}
                      onClick={() => {
                        setMobileOpen(false);
                        setTicketsOpen(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#fb923c' : '#94a3b8',
                        fontWeight: isActive ? '500' : '400',
                      })}
                    >
                      <FiMapPin size={13} style={{ color: '#f97316' }} /> {city}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={({ isActive }) => ({
                  background: isActive
                    ? 'rgba(249,115,22,0.12)'
                    : 'transparent',
                  color: isActive ? '#fb923c' : '#94a3b8',
                })}
              >
                <FiLayout size={16} /> Dashboard
              </NavLink>
            )}

            <div
              style={{
                borderTop: '0.5px solid #1e293b',
                paddingTop: '8px',
                marginTop: '8px',
              }}
            >
              {!user ? (
                <div className="flex gap-2">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium rounded-lg transition-all"
                    style={{ color: '#94a3b8', border: '0.5px solid #334155' }}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-semibold text-white rounded-lg transition-all"
                    style={{ background: '#f97316' }}
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: '#f87171' }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background =
                      'rgba(248,113,113,0.08)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <FiLogOut size={16} /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── MOBILE BOTTOM NAV ─── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ background: '#0f172a', borderTop: '0.5px solid #1e293b' }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          <NavLink
            to="/"
            className="flex flex-col items-center gap-1 flex-1 transition-colors"
            style={({ isActive }) => ({
              color: isActive ? '#f97316' : '#475569',
            })}
          >
            <FiHome size={21} />
            <span className="text-[10px] font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/tickets/dhaka"
            className="flex flex-col items-center gap-1 flex-1 transition-colors"
            style={({ isActive }) => ({
              color: isActive ? '#f97316' : '#475569',
            })}
          >
            <MdOutlineConfirmationNumber size={21} />
            <span className="text-[10px] font-medium">Tickets</span>
          </NavLink>

          {/* Center highlight — Dashboard */}
          <NavLink
            to="/dashboard"
            className="flex flex-col items-center gap-1 flex-1 -mt-5"
          >
            {({ isActive }) => (
              <>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
                  style={{
                    background: '#f97316',
                    border: '3px solid #0f172a',
                    boxShadow: isActive
                      ? '0 0 0 1px #334155, 0 4px 16px rgba(249,115,22,0.4)'
                      : '0 0 0 1px #334155',
                  }}
                >
                  <FiGrid size={22} className="text-white" />
                </div>
                <span
                  className="text-[10px] font-semibold mt-0.5"
                  style={{ color: isActive ? '#f97316' : '#64748b' }}
                >
                  Board
                </span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/contact"
            className="flex flex-col items-center gap-1 flex-1 transition-colors"
            style={({ isActive }) => ({
              color: isActive ? '#f97316' : '#475569',
            })}
          >
            <FiBell size={21} />
            <span className="text-[10px] font-medium">Alerts</span>
          </NavLink>

          <button
            onClick={() => navigate(user ? '/dashboard/profile' : '/login')}
            className="flex flex-col items-center gap-1 flex-1 transition-colors"
            style={{ color: '#475569' }}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="me"
                className="w-6 h-6 rounded-full object-cover"
                style={{ border: '1px solid #f97316' }}
                onError={e =>
                  (e.target.src = 'https://i.ibb.co/4pDNDk1/avatar.png')
                }
              />
            ) : (
              <FiUser size={21} />
            )}
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Bottom spacing for mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Navbar;
