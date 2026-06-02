import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  FiUploadCloud,
  FiLink,
  FiFileText,
  FiX,
  FiChevronDown,
} from 'react-icons/fi';
import { MdOutlineContentPaste } from 'react-icons/md';

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
  const jsonFileRef = useRef(null);

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
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // JSON auto-fill
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonOpen, setJsonOpen] = useState(false);

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
    setImageUrl('');
  };

  const handleImageUrlChange = e => {
    setImageUrl(e.target.value);
    if (e.target.value) {
      setPreview(e.target.value);
      setImageFile(null);
    } else {
      setPreview(null);
    }
  };

  const uploadToImgbb = async () => {
    if (!imageFile) return imageUrl || null;
    const data = new FormData();
    data.append('image', imageFile);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
      { method: 'POST', body: data },
    );
    const json = await res.json();
    return json?.data?.url || null;
  };

  // ── JSON fill logic ──────────────────────────────────────
  const applyJson = raw => {
    setJsonError('');
    try {
      const obj = JSON.parse(raw);
      const mapped = {
        title: obj.title || obj.name || '',
        from: obj.from || obj.origin || '',
        to: obj.to || obj.destination || '',
        busType: obj.busType || obj.type || obj.transportType || 'Bus',
        price: obj.price != null ? String(obj.price) : '',
        quantity:
          obj.quantity != null
            ? String(obj.quantity)
            : obj.seats != null
              ? String(obj.seats)
              : '',
        departureDate: obj.departureDate || obj.date || '',
        departureTime: obj.departureTime || obj.time || obj.departure || '',
        perks: Array.isArray(obj.perks) ? obj.perks : [],
      };
      setForm(f => ({ ...f, ...mapped }));

      // image from JSON
      const img = obj.image || obj.imageUrl || obj.thumbnail || '';
      if (img) {
        setImageUrl(img);
        setPreview(img);
        setImageFile(null);
      }

      setJsonText('');
      setJsonOpen(false);
    } catch {
      setJsonError('Invalid JSON — please check the format.');
    }
  };

  const handleJsonPaste = e => {
    const val = e.target.value;
    setJsonText(val);
    setJsonError('');
  };

  const handleJsonFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const raw = ev.target.result;
      setJsonText(raw);
      applyJson(raw);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!imageFile && !imageUrl) {
      setError('Please upload a ticket image or provide an image URL.');
      return;
    }

    setUploading(true);
    const finalImageUrl = await uploadToImgbb();
    setUploading(false);

    if (!finalImageUrl) {
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
            image: finalImageUrl,
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

      {/* ── JSON Auto-fill Section ── */}
      <div
        className="mb-6 rounded-xl overflow-hidden"
        style={{ border: '0.5px solid #1e293b' }}
      >
        <button
          type="button"
          onClick={() => setJsonOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors"
          style={{ background: '#0b1220', color: '#64748b' }}
        >
          <span className="flex items-center gap-2">
            <FiFileText size={15} style={{ color: '#6366f1' }} />
            Auto-fill from JSON
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
            >
              optional
            </span>
          </span>
          <FiChevronDown
            size={15}
            className={`transition-transform duration-200 ${jsonOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {jsonOpen && (
          <div
            className="px-4 pb-4 pt-3 space-y-3"
            style={{ background: '#060d1a' }}
          >
            <p className="text-xs" style={{ color: '#475569' }}>
              Paste JSON or upload a{' '}
              <code style={{ color: '#818cf8' }}>.json</code> file — fields will
              be filled automatically.
            </p>

            {/* Paste area */}
            <div className="relative">
              <textarea
                value={jsonText}
                onChange={handleJsonPaste}
                placeholder={
                  '{\n  "title": "Dhaka → Chittagong",\n  "from": "Dhaka",\n  "to": "Chittagong",\n  "price": 550,\n  "quantity": 40,\n  "busType": "Bus",\n  "departureDate": "2025-08-01",\n  "departureTime": "08:00",\n  "perks": ["AC", "WiFi"]\n}'
                }
                rows={7}
                className="w-full px-4 py-3 rounded-xl text-xs outline-none resize-none font-mono transition-all"
                style={{
                  background: '#0b1220',
                  border: '0.5px solid #1e293b',
                  color: '#94a3b8',
                }}
              />
              {jsonText && (
                <button
                  type="button"
                  onClick={() => {
                    setJsonText('');
                    setJsonError('');
                  }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: '#1e293b', color: '#64748b' }}
                >
                  <FiX size={11} />
                </button>
              )}
            </div>

            {jsonError && (
              <p className="text-xs" style={{ color: '#f87171' }}>
                {jsonError}
              </p>
            )}

            <div className="flex gap-2">
              {/* Apply paste */}
              <button
                type="button"
                onClick={() => applyJson(jsonText)}
                disabled={!jsonText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: '#818cf8',
                  border: '0.5px solid rgba(99,102,241,0.3)',
                }}
              >
                <MdOutlineContentPaste size={13} /> Apply JSON
              </button>

              {/* Upload JSON file */}
              <button
                type="button"
                onClick={() => jsonFileRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: '#0b1220',
                  color: '#64748b',
                  border: '0.5px solid #1e293b',
                }}
              >
                <FiUploadCloud size={13} /> Upload .json file
              </button>
              <input
                ref={jsonFileRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleJsonFile}
              />
            </div>
          </div>
        )}
      </div>

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
                onError={() => setPreview(null)}
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FiUploadCloud size={24} style={{ color: '#334155' }} />
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

          {/* Image URL field */}
          <div className="mt-2 relative">
            <FiLink
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: '#475569' }}
            />
            <input
              type="url"
              value={imageUrl}
              onChange={handleImageUrlChange}
              placeholder="Or paste image URL here…"
              className={inputClass}
              style={{ ...inputStyle, paddingLeft: '32px', fontSize: '12px' }}
            />
            {imageUrl && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  setPreview(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#475569' }}
              >
                <FiX size={13} />
              </button>
            )}
          </div>
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

        {/* Vendor info */}
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
