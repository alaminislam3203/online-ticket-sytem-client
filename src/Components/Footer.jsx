import { Link } from 'react-router';
import {
  FaFacebook,
  FaEnvelope,
  FaPhoneAlt,
  FaBus,
  FaCreditCard,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        color: '#94a3b8',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '3rem 1.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Brand */}
        <div>
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 0 12px',
            }}
          >
            <FaBus style={{ color: '#f97316' }} /> Voyago
          </h2>
          <p
            style={{
              fontSize: '13px',
              lineHeight: '1.7',
              color: '#64748b',
              margin: 0,
            }}
          >
            Book bus tickets easily with Voyago. Fast, secure and reliable
            travel booking platform in Bangladesh.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {[FaFacebook].map((Icon, i) => (
              <div
                key={i}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  border: '0.5px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '0 0 16px',
            }}
          >
            Quick links
          </p>
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {[
              ['/', 'Home'],
              ['/tickets', 'Tickets'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([path, label]) => (
              <li key={path}>
                <Link
                  to={path}
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '0 0 16px',
            }}
          >
            Contact
          </p>
          {[
            {
              icon: <FaEnvelope style={{ color: '#f97316' }} />,
              text: 'support@voyago.com',
            },
            {
              icon: <FaPhoneAlt style={{ color: '#10b981' }} />,
              text: '+880 1234-567890',
            },
            {
              icon: <FaFacebook style={{ color: '#3b82f6' }} />,
              text: 'Voyago Page',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: '#64748b',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              {item.text}
            </div>
          ))}
        </div>

        {/* Payment */}
        <div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: '0 0 16px',
            }}
          >
            Payment
          </p>
          {[
            {
              icon: <FaCreditCard />,
              label: 'Stripe',
              color: '#6366f1',
              status: 'Live',
              statusColor: '#818cf8',
              statusBg: '#1e3a5f',
            },
            {
              icon: <FaCreditCard />,
              label: 'bKash',
              color: '#ec4899',
              status: 'Soon',
              statusColor: '#475569',
              statusBg: '#1e293b',
            },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '22px',
                  borderRadius: '4px',
                  background: p.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                }}
              >
                {p.icon}
              </div>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                {p.label}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '20px',
                  background: p.statusBg,
                  color: p.statusColor,
                  marginLeft: 'auto',
                }}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr
        style={{ border: 'none', borderTop: '0.5px solid #1e293b', margin: 0 }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          © 2026 VOYAGO All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '0.5px solid #1e3a5f',
              color: '#818cf8',
            }}
          >
            🔒 SSL secured
          </span>
          <span
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '0.5px solid #1e293b',
              color: '#64748b',
            }}
          >
            ✓ Safe payments
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
