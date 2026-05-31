import { useEffect, useState } from 'react';

const ROLES = ['user', 'vendor', 'admin'];

const roleBadge = (role, isFraud) => {
  if (isFraud)
    return {
      label: 'Fraud',
      bg: 'rgba(239,68,68,0.12)',
      color: '#f87171',
      border: 'rgba(239,68,68,0.3)',
    };
  if (role === 'admin')
    return {
      label: 'Admin',
      bg: 'rgba(168,85,247,0.12)',
      color: '#c084fc',
      border: 'rgba(168,85,247,0.3)',
    };
  if (role === 'vendor')
    return {
      label: 'Vendor',
      bg: 'rgba(234,179,8,0.12)',
      color: '#facc15',
      border: 'rgba(234,179,8,0.3)',
    };
  return {
    label: 'User',
    bg: 'rgba(59,130,246,0.12)',
    color: '#60a5fa',
    border: 'rgba(59,130,246,0.3)',
  };
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null); // tracks which user is being updated

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers })
      .then(r => r.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const patch = async (url, id, updater) => {
    setActionId(id);
    try {
      const res = await fetch(url, { method: 'PATCH', headers });
      if (res.ok)
        setUsers(prev => prev.map(u => (u._id === id ? updater(u) : u)));
    } catch (e) {
      console.error(e);
    }
    setActionId(null);
  };

  const makeAdmin = id =>
    patch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/make-admin/${id}`,
      id,
      u => ({ ...u, role: 'admin' }),
    );
  const makeVendor = id =>
    patch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/make-vendor/${id}`,
      id,
      u => ({ ...u, role: 'vendor' }),
    );
  const markFraud = id =>
    patch(
      `${import.meta.env.VITE_API_URL}/api/admin/users/mark-fraud/${id}`,
      id,
      u => ({ ...u, isFraud: true }),
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="px-4 py-8">
      <h2 className="text-lg font-bold text-white mb-6">Manage Users</h2>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '0.5px solid #1e293b' }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-12 px-5 py-3 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            background: '#0f172a',
            color: '#334155',
            borderBottom: '0.5px solid #1e293b',
          }}
        >
          <span className="col-span-4">User</span>
          <span className="col-span-2">Role</span>
          <span className="col-span-6 text-right">Actions</span>
        </div>

        {/* Rows */}
        {users.map((u, i) => {
          const badge = roleBadge(u.role, u.isFraud);
          const busy = actionId === u._id;
          const initials = u.name
            ? u.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : 'U';

          return (
            <div
              key={u._id}
              className="grid grid-cols-12 px-5 py-4 items-center"
              style={{
                background: i % 2 === 0 ? '#0a1020' : '#0f172a',
                borderBottom:
                  i < users.length - 1 ? '0.5px solid #1e293b' : 'none',
              }}
            >
              {/* User info */}
              <div className="col-span-4 flex items-center gap-3">
                {u.photoURL ? (
                  <img
                    src={u.photoURL}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: 'rgba(59,130,246,0.15)',
                      color: '#60a5fa',
                    }}
                  >
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {u.name || '—'}
                  </p>
                  <p
                    className="text-[10px] truncate"
                    style={{ color: '#475569' }}
                  >
                    {u.email}
                  </p>
                </div>
              </div>

              {/* Role badge */}
              <div className="col-span-2">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    border: `0.5px solid ${badge.border}`,
                  }}
                >
                  {badge.label}
                </span>
              </div>

              {/* Action buttons */}
              <div className="col-span-6 flex items-center justify-end gap-2 flex-wrap">
                {/* Make Admin */}
                <button
                  onClick={() => makeAdmin(u._id)}
                  disabled={busy || u.role === 'admin'}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(168,85,247,0.12)',
                    color: '#c084fc',
                    border: '0.5px solid rgba(168,85,247,0.3)',
                  }}
                >
                  {busy ? '…' : 'Make Admin'}
                </button>

                {/* Make Vendor */}
                <button
                  onClick={() => makeVendor(u._id)}
                  disabled={busy || u.role === 'vendor'}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: 'rgba(234,179,8,0.12)',
                    color: '#facc15',
                    border: '0.5px solid rgba(234,179,8,0.3)',
                  }}
                >
                  {busy ? '…' : 'Make Vendor'}
                </button>

                {/* Mark as Fraud — vendor only */}
                {u.role === 'vendor' && !u.isFraud && (
                  <button
                    onClick={() => markFraud(u._id)}
                    disabled={busy}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(239,68,68,0.12)',
                      color: '#f87171',
                      border: '0.5px solid rgba(239,68,68,0.3)',
                    }}
                  >
                    {busy ? '…' : 'Mark Fraud'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="py-16 text-center" style={{ background: '#0f172a' }}>
            <p className="text-sm" style={{ color: '#475569' }}>
              No users found.
            </p>
          </div>
        )}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#334155' }}>
        {users.length} total user{users.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default ManageUsers;
