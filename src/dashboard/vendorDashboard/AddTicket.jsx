import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const TRANSPORT_TYPES = ['Bus', 'Train', 'Launch', 'Plane'];
const PERKS_OPTIONS = [
  'AC',
  'Breakfast',
  'WiFi',
  'USB Charging',
  'Recliner Seat',
  'Snacks',
  'Blanket',
  'Entertainment',
];

const AddTicket = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [vendor, setVendor] = useState({ email: '', name: '' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data =>
        setVendor({ email: data.email || '', name: data.name || '' }),
      )
      .catch(() => {});
  }, []);
  const [form, setForm] = useState({
    title: '',
    from: '',
    to: '',
    busType: 'Bus',
    price: '',
    quantity: '',
    departureDate: '',
    departureTime: '',
    perks: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const togglePerk = perk => {
    setForm(f => ({
      ...f,
      perks: f.perks.includes(perk)
        ? f.perks.filter(p => p !== perk)
        : [...f.perks, perk],
    }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToImgbb = async () => {
    if (!imageFile) return null;
    const data = new FormData();
    data.append('image', imageFile);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      { method: 'POST', body: data },
    );
    const json = await res.json();
    return json?.data?.url || null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please upload a ticket image.');
      return;
    }

    setUploading(true);
    const imageUrl = await uploadToImgbb();
    setUploading(false);

    if (!imageUrl) {
      setError('Image upload failed. Try again.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendor/tickets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            quantity: Number(form.quantity),
            image: imageUrl,
            vendorName: vendor.name,
            vendorEmail: vendor.email,
          }),
        },
      );

      if (res.ok) {
        setSuccess(true);
        setTimeout(
          () => navigate('/dashboard/vendor-dashboard/my-tickets'),
          1500,
        );
      } else {
        const d = await res.json();
        setError(d.message || 'Failed to add ticket.');
      }
    } catch {
      setError('Something went wrong.');
    }
    setSubmitting(false);
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200';
  const inputStyle = {
    background: '#060d1a',
    border: '0.5px solid #1e293b',
    color: '#94a3b8',
  };
  const labelClass =
    'block text-[10px] font-semibold uppercase tracking-widest mb-1.5';
  const labelStyle = { color: '#475569' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-lg font-bold text-white mb-6">Add New Ticket</h2>

      {success && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold"
          style={{
            background: 'rgba(34,197,94,0.12)',
            color: '#4ade80',
            border: '0.5px solid rgba(34,197,94,0.3)',
          }}
        >
          ✓ Ticket added! Redirecting…
        </div>
      )}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{
            background: 'rgba(239,68,68,0.12)',
            color: '#f87171',
            border: '0.5px solid rgba(239,68,68,0.3)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image upload */}
        <div>
          <label className={labelClass} style={labelStyle}>
            Ticket Image
          </label>
          <label
            className="flex flex-col items-center justify-center w-full h-36 rounded-xl cursor-pointer transition-all duration-200"
            style={{
              background: preview ? 'transparent' : '#060d1a',
              border: '0.5px dashed #334155',
              overflow: 'hidden',
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">🖼️</span>
                <span className="text-xs" style={{ color: '#475569' }}>
                  Click to upload image
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>
        </div>

        {/* Title */}
        <div>
          <label className={labelClass} style={labelStyle}>
            Ticket Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. Dhaka → Chittagong Express"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>
              From
            </label>
            <input
              name="from"
              value={form.from}
              onChange={handleChange}
              required
              placeholder="City"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              To
            </label>
            <input
              name="to"
              value={form.to}
              onChange={handleChange}
              required
              placeholder="City"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Transport type */}
        <div>
          <label className={labelClass} style={labelStyle}>
            Transport Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {TRANSPORT_TYPES.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, busType: t }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background:
                    form.busType === t ? 'rgba(234,179,8,0.15)' : '#060d1a',
                  color: form.busType === t ? '#facc15' : '#475569',
                  border: `0.5px solid ${form.busType === t ? 'rgba(234,179,8,0.4)' : '#1e293b'}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Price / Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>
              Price (per unit ৳)
            </label>
            <input
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="0.00"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Ticket Quantity
            </label>
            <input
              type="number"
              min="1"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="e.g. 50"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Departure date / time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>
              Departure Date
            </label>
            <input
              type="date"
              name="departureDate"
              value={form.departureDate}
              onChange={handleChange}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Departure Time
            </label>
            <input
              type="time"
              name="departureTime"
              value={form.departureTime}
              onChange={handleChange}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Perks */}
        <div>
          <label className={labelClass} style={labelStyle}>
            Perks
          </label>
          <div className="flex flex-wrap gap-2">
            {PERKS_OPTIONS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => togglePerk(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: form.perks.includes(p)
                    ? 'rgba(34,197,94,0.12)'
                    : '#060d1a',
                  color: form.perks.includes(p) ? '#4ade80' : '#475569',
                  border: `0.5px solid ${form.perks.includes(p) ? 'rgba(34,197,94,0.3)' : '#1e293b'}`,
                }}
              >
                {form.perks.includes(p) ? '✓ ' : ''}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor info (readonly) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} style={labelStyle}>
              Vendor Name
            </label>
            <input
              value={vendor.name || '—'}
              readOnly
              className={inputClass}
              style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Vendor Email
            </label>
            <input
              value={vendor.email || '—'}
              readOnly
              className={inputClass}
              style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || submitting}
          className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg,#ca8a04,#a16207)',
            color: '#fff',
            border: '0.5px solid rgba(234,179,8,0.4)',
          }}
        >
          {uploading
            ? 'Uploading image…'
            : submitting
              ? 'Adding ticket…'
              : 'Add Ticket'}
        </button>
      </form>
    </div>
  );
};

export default AddTicket;
