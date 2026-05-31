import {
  FaBus,
  FaBolt,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaClock,
  FaTicketAlt,
} from 'react-icons/fa';

const stats = [
  { value: '50K+', label: 'Tickets booked' },
  { value: '120+', label: 'Bus operators' },
  { value: '64', label: 'Districts covered' },
  { value: '4.8★', label: 'User rating' },
];

const features = [
  {
    icon: <FaBolt />,
    iconBg: '#fff7ed',
    iconColor: '#f97316',
    title: 'Instant booking',
    desc: 'Book your seat in under 60 seconds with real-time availability.',
  },
  {
    icon: <FaShieldAlt />,
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
    title: 'Secure payments',
    desc: 'Stripe-powered checkout with SSL encryption on every transaction.',
  },
  {
    icon: <FaMapMarkerAlt />,
    iconBg: '#eff4ff',
    iconColor: '#2563eb',
    title: '64 districts',
    desc: 'All major routes across Bangladesh covered by verified operators.',
  },
  {
    icon: <FaMobileAlt />,
    iconBg: '#fdf4ff',
    iconColor: '#9333ea',
    title: 'Mobile first',
    desc: 'Fully responsive design — works perfectly on any screen size.',
  },
  {
    icon: <FaClock />,
    iconBg: '#fff7ed',
    iconColor: '#ea580c',
    title: '24/7 support',
    desc: 'Our team is always ready to help you with any booking issue.',
  },
  {
    icon: <FaTicketAlt />,
    iconBg: '#f0fdfa',
    iconColor: '#0d9488',
    title: 'E-tickets',
    desc: 'Get your ticket instantly via email — no printing needed.',
  },
];

const steps = [
  {
    title: 'Search your route',
    desc: 'Enter your departure city, destination, and travel date to see all available buses.',
  },
  {
    title: 'Choose your bus',
    desc: 'Compare operators, timings, seat availability, and prices — then pick the best option for you.',
  },
  {
    title: 'Pay and travel',
    desc: 'Complete payment securely via Stripe. Your e-ticket arrives instantly in your email.',
  },
];

const team = [
  {
    initials: 'RH',
    name: 'Rafiul Hasan',
    role: 'Founder & CEO',
    bg: '#fff7ed',
    color: '#c2410c',
  },
  {
    initials: 'TI',
    name: 'Tanvir Islam',
    role: 'Lead Developer',
    bg: '#eff6ff',
    color: '#1d4ed8',
  },
  {
    initials: 'NA',
    name: 'Nadia Akter',
    role: 'UI/UX Designer',
    bg: '#f0fdf4',
    color: '#15803d',
  },
  {
    initials: 'MR',
    name: 'Mahfuz Rahman',
    role: 'Operations',
    bg: '#fdf4ff',
    color: '#7e22ce',
  },
];

const About = () => {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* HERO */}
      <div
        style={{
          color: '#fff',
          padding: '5rem 2rem 4rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',

            border: '0.5px solid #334155',
            color: '#f97316',
            fontSize: '12px',
            padding: '5px 14px',
            borderRadius: '20px',
            marginBottom: '1.5rem',
          }}
        >
          <FaBus style={{ fontSize: '13px' }} />
          About Voyago
        </div>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: '600',
            margin: '0 0 1rem',
            lineHeight: '1.2',
            color: '#fff',
          }}
        >
          Travel smarter
          <br />
          across <span style={{ color: '#f97316' }}>Bangladesh</span>
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: '#94a3b8',
            maxWidth: '520px',
            margin: '0 auto 2rem',
            lineHeight: '1.7',
          }}
        >
          Voyago makes bus ticket booking fast, secure, and hassle-free — from
          any device, anytime.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2.5rem',
            paddingTop: '2.5rem',
            borderTop: '0.5px solid #1e293b',
          }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#f97316',
                }}
              >
                {s.value}
              </div>
              <div
                style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div
        style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#f97316',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 8px',
          }}
        >
          Why Voyago
        </p>
        <h2 style={{ fontSize: '26px', fontWeight: '600', margin: '0 0 1rem' }}>
          Everything you need for your journey
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: '#64748b',
            lineHeight: '1.7',
            margin: '0 0 2rem',
          }}
        >
          We built Voyago to remove the friction from bus travel — no queues, no
          uncertainty, just a confirmed seat on your phone.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: f.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  fontSize: '18px',
                  color: f.iconColor,
                }}
              >
                {f.icon}
              </div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 6px',
                  color: '#ea580c',
                }}
              >
                {f.title}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748b',
                  lineHeight: '1.6',
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <hr
        style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0' }}
      />

      {/* HOW IT WORKS */}
      <div
        style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#f97316',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 8px',
          }}
        >
          How it works
        </p>
        <h2 style={{ fontSize: '26px', fontWeight: '600', margin: '0 0 2rem' }}>
          Book your ticket in 3 steps
        </h2>

        <div>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '1.5rem 0',
                borderBottom:
                  i < steps.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#0f172a',
                  color: '#f97316',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    margin: '0 0 4px',
                  }}
                >
                  {s.title}
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr
        style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0' }}
      />

      {/* TEAM */}
      <div
        style={{ padding: '4rem 2rem', maxWidth: '1100px', margin: '0 auto' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#f97316',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            margin: '0 0 8px',
          }}
        >
          The team
        </p>
        <h2 style={{ fontSize: '26px', fontWeight: '600', margin: '0 0 8px' }}>
          Built with care in Bangladesh
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: '#64748b',
            lineHeight: '1.7',
            margin: '0 0 2rem',
          }}
        >
          A small passionate team focused on making travel better for everyone.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
          }}
        >
          {team.map((m, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                padding: '1.5rem 1rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: m.bg,
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 auto 12px',
                }}
              >
                {m.initials}
              </div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 4px',
                  color: 'black',
                }}
              >
                {m.name}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                {m.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 12px',
          }}
        >
          Ready to book your next trip?
        </h2>
        <p style={{ fontSize: '15px', color: '#94a3b8', margin: '0 0 2rem' }}>
          Join thousands of travelers who trust Voyago every day.
        </p>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f97316',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            padding: '12px 28px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Get started →
        </button>
      </div>
    </div>
  );
};

export default About;
