import { useEffect, useState } from 'react';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A';

  const rows = [
    { label: 'Full Name', value: user?.name || '—' },
    { label: 'Email', value: user?.email || '—' },
    { label: 'Role', value: 'ADMIN' },
    {
      label: 'Member Since',
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '—',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Avatar card */}
      <div
        className="rounded-2xl p-8 flex flex-col items-center text-center mb-6"
        style={{ background: 'linear-gradient(135deg,#0f172a 60%,#1a0a2e)' }}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 mb-4"
            style={{ borderColor: 'rgba(168,85,247,0.4)' }}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4"
            style={{
              background: 'rgba(168,85,247,0.15)',
              borderColor: 'rgba(168,85,247,0.35)',
              color: '#c084fc',
            }}
          >
            {initials}
          </div>
        )}
        <h2 className="text-xl font-bold text-white">
          {user?.name || 'Admin'}
        </h2>
        <p className="text-sm mt-1" style={{ color: '#64748b' }}>
          {user?.email}
        </p>
        <span
          className="mt-3 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(168,85,247,0.15)',
            color: '#c084fc',
            border: '0.5px solid rgba(168,85,247,0.3)',
          }}
        >
          ADMIN
        </span>
      </div>

      {/* Info rows */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#0f172a', border: '0.5px solid #1e293b' }}
      >
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-6 py-4"
            style={{
              borderBottom:
                i < rows.length - 1 ? '0.5px solid #1e293b' : 'none',
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#475569' }}
            >
              {row.label}
            </span>
            <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
