import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  FaWhatsapp,
  FaUser,
  FaPhone,
  FaPaperPlane,
  FaHeadset,
} from 'react-icons/fa';
import {
  FiMessageSquare,
  FiArrowRight,
  FiClock,
  FiCheck,
} from 'react-icons/fi';
import { MdOutlineSupportAgent } from 'react-icons/md';

const WHATSAPP_NUMBER = '8801781540625';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [focused, setFocused] = useState('');
  const [sent, setSent] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const text = `Hello, I am ${form.name}%0APhone: ${form.phone}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');

    setSent(true);
    setTimeout(() => setSent(false), 3000);

    Swal.fire({
      icon: 'success',
      title: 'Opening WhatsApp…',
      text: 'Your message is ready to send!',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#22c55e',
      confirmButtonText: 'Got it',
      timer: 3000,
      timerProgressBar: true,
    });

    setForm({ name: '', phone: '', message: '' });
  };

  const inputBase = {
    width: '100%',
    background: '#0f172a',
    border: '0.5px solid #1e293b',
    borderRadius: 14,
    padding: '13px 16px 13px 44px',
    color: '#f8fafc',
    fontSize: 13,
    fontFamily: "'Sora', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const inputFocused = name => ({
    borderColor: focused === name ? 'rgba(34,197,94,0.5)' : '#1e293b',
    boxShadow: focused === name ? '0 0 0 3px rgba(34,197,94,0.08)' : 'none',
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: #334155; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,197,94,0.25); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(34,197,94,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .fade-up   { animation: fadeUp 0.4s ease both; }
        .fade-up-1 { animation: fadeUp 0.4s 0.06s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s 0.12s ease both; }
        .fade-up-3 { animation: fadeUp 0.4s 0.18s ease both; }
        .fade-up-4 { animation: fadeUp 0.4s 0.24s ease both; }
        .fade-up-5 { animation: fadeUp 0.4s 0.30s ease both; }
        .wa-pulse  { animation: pulse-ring 2s infinite; }
      `}</style>

      <div className="w-full max-w-md">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="text-center mb-8 fade-up">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '0.5px solid rgba(34,197,94,0.25)',
              color: '#4ade80',
            }}
          >
            <MdOutlineSupportAgent size={13} />
            24/7 Support Available
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold mb-2"
            style={{ color: '#f8fafc', letterSpacing: '-0.03em' }}
          >
            Get in Touch
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>
            Send us a message — we reply within minutes on WhatsApp
          </p>
        </div>

        {/* ── Card ─────────────────────────────────────────────── */}
        <div
          className="rounded-3xl overflow-hidden fade-up-1"
          style={{
            background: '#0a1628',
            border: '0.5px solid #1e293b',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              height: 2,
              background:
                'linear-gradient(90deg, #22c55e, #16a34a, transparent)',
            }}
          />

          <div className="p-7">
            {/* Support info strip */}
            <div
              className="fade-up-2 flex items-center gap-3 p-3.5 rounded-2xl mb-6"
              style={{
                background: 'rgba(34,197,94,0.06)',
                border: '0.5px solid rgba(34,197,94,0.15)',
              }}
            >
              <div
                className="wa-pulse w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(34,197,94,0.15)' }}
              >
                <FaWhatsapp size={16} style={{ color: '#4ade80' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-semibold"
                  style={{ color: '#e2e8f0' }}
                >
                  WhatsApp Support
                </p>
                <p className="text-[11px]" style={{ color: '#475569' }}>
                  +880 1781-540625
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#4ade80',
                    boxShadow: '0 0 6px #4ade80',
                  }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: '#4ade80' }}
                >
                  Online
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="fade-up-3 relative">
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <FaUser
                    size={12}
                    style={{
                      color: focused === 'name' ? '#4ade80' : '#334155',
                      transition: 'color 0.2s',
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                  required
                  style={{ ...inputBase, ...inputFocused('name') }}
                />
              </div>

              {/* Phone */}
              <div className="fade-up-3 relative">
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <FaPhone
                    size={12}
                    style={{
                      color: focused === 'phone' ? '#4ade80' : '#334155',
                      transition: 'color 0.2s',
                    }}
                  />
                </div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused('')}
                  required
                  style={{ ...inputBase, ...inputFocused('phone') }}
                />
              </div>

              {/* Message */}
              <div className="fade-up-4 relative">
                <div
                  className="absolute flex items-center justify-center"
                  style={{ left: 14, top: 15, pointerEvents: 'none' }}
                >
                  <FiMessageSquare
                    size={12}
                    style={{
                      color: focused === 'message' ? '#4ade80' : '#334155',
                      transition: 'color 0.2s',
                    }}
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Tell us how we can help…"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused('')}
                  rows={4}
                  required
                  style={{
                    ...inputBase,
                    ...inputFocused('message'),
                    resize: 'none',
                    paddingTop: 13,
                  }}
                />
              </div>

              {/* Submit button */}
              <div className="fade-up-5">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-300 relative overflow-hidden"
                  style={{ background: sent ? '#16a34a' : '#22c55e' }}
                  onMouseEnter={e => {
                    if (!sent) e.currentTarget.style.filter = 'brightness(0.9)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  {sent ? (
                    <>
                      <FiCheck size={15} />
                      Opening WhatsApp…
                    </>
                  ) : (
                    <>
                      <FaWhatsapp size={16} />
                      Send via WhatsApp
                      <FiArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div
                style={{ flex: 1, height: '0.5px', background: '#1e293b' }}
              />
              <span className="text-[11px]" style={{ color: '#334155' }}>
                or
              </span>
              <div
                style={{ flex: 1, height: '0.5px', background: '#1e293b' }}
              />
            </div>

            {/* Direct WhatsApp link */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
              style={{
                background: 'rgba(34,197,94,0.08)',
                color: '#4ade80',
                border: '0.5px solid rgba(34,197,94,0.2)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(34,197,94,0.14)';
                e.currentTarget.style.borderColor = 'rgba(34,197,94,0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(34,197,94,0.08)';
                e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)';
              }}
            >
              <FaWhatsapp size={15} />
              Chat directly on WhatsApp
            </a>
          </div>

          {/* Footer strip */}
          <div
            className="px-7 py-4 flex items-center justify-between"
            style={{ borderTop: '0.5px solid #1e293b', background: '#080e1c' }}
          >
            <div className="flex items-center gap-1.5">
              <FiClock size={11} style={{ color: '#334155' }} />
              <span className="text-[11px]" style={{ color: '#334155' }}>
                Avg. reply: ~3 min
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaHeadset size={11} style={{ color: '#334155' }} />
              <span className="text-[11px]" style={{ color: '#334155' }}>
                Support 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
