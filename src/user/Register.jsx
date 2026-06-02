import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUploadCloud,
  FiArrowRight,
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { HiSparkles, HiTicket } from 'react-icons/hi2';
import registerImg from '../assets/register (7).png';
import { AuthContext } from '../Context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { googleLogin, createUser, updateUserProfile } =
    useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ------------------- Image Upload -------------------
  const handleImageUpload = async file => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
      { method: 'POST', body: formData },
    );

    const data = await res.json();
    return data.data.display_url;
  };

  // ------------------- Google Register -------------------
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const userCredential = await googleLogin();
      const email = userCredential.user.email;
      const name = userCredential.user.displayName;
      const photoURL = userCredential.user.photoURL;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-login`,
        { email, name, photoURL },
      );

      localStorage.setItem('token', res.data.token);
      toast.success('Google Login Successful!');
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Google Login Failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ------------------- Email Register -------------------
  const handleRegister = async e => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoFile = e.target.photo.files[0];

    if (!photoFile) {
      return toast.error('Please select a profile photo');
    }

    setLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
      const photoURL = await handleImageUpload(photoFile);
      await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL });

      await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
        name,
        email,
        password,
        role: 'user',
        photoURL,
      });

      localStorage.setItem('token', '');
      toast.success('Registered successfully!', { id: toastId });
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ top: 60 }}
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f1f5f9',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        .reg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .reg-root { grid-template-columns: 1fr; }
          .reg-left { display: none !important; }
          .reg-right { padding: 32px 24px; }
        }

        /* ---- LEFT PANEL ---- */
        .reg-left {
          position: relative;
          overflow: hidden;
         
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reg-left::before {
          content: '';
          position: absolute;
          inset: 0;
         
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: orb-float 8s ease-in-out infinite;
        }
        .orb-1 {
          width: 300px; height: 300px;
         
          top: -80px; left: -80px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 200px; height: 200px;
          bottom: -60px; right: -60px;
          animation-delay: -4s;
        }

        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }

        .reg-img {
          position: relative;
          width: 95%;
          max-width: 700px;
          border-radius: 24px;
          object-fit: cover;
          animation: img-rise 0.8s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes img-rise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .left-badge {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
      
          backdrop-filter: blur(12px);
          border-radius: 40px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          animation: fade-up 1s 0.4s both;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }

        .left-badge span {
          color: #a5b4fc;
          font-size: 13px;
          font-weight: 500;
        }

        /* ---- RIGHT PANEL ---- */
        .reg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        
          position: relative;
        }

        .reg-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px;
          height: 100%;
        
        }

        .form-card {
          width: 100%;
          max-width: 420px;
          animation: card-in 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .form-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .logo-dot {
          width: 32px; height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #fff;
          box-shadow: 0 0 20px rgba(99,102,241,0.5);
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.3px;
        }

        .form-heading {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #f8fafc;
          line-height: 1.15;
          margin-bottom: 6px;
          letter-spacing: -0.8px;
        }

        .form-sub {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 28px;
          font-weight: 400;
        }

        .form-sub a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .form-sub a:hover { color: #a5b4fc; }

        /* ---- GOOGLE BTN ---- */
        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin-bottom: 20px;
        }

        .google-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }

        .google-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ---- DIVIDER ---- */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .divider-text {
          color: #475569;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ---- FIELD GROUP ---- */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .field-wrap {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          font-size: 16px;
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 14px 13px 42px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .field-input::placeholder { color: #475569; }

        .field-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .field-input:focus ~ .field-icon,
        .field-wrap:focus-within .field-icon {
          color: #818cf8;
        }

        /* ---- FILE INPUT ---- */
        .file-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
          font-size: 14px;
          font-weight: 400;
        }

        .file-label:hover {
          border-color: rgba(99,102,241,0.4);
          background: rgba(99,102,241,0.06);
          color: #a5b4fc;
        }

        .file-label.has-file {
          border-color: rgba(99,102,241,0.4);
          color: #a5b4fc;
          background: rgba(99,102,241,0.06);
        }

        .file-input-hidden {
          display: none;
        }

        /* ---- EYE TOGGLE ---- */
        .eye-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          transition: color 0.2s;
        }

        .eye-toggle:hover { color: #818cf8; }

        /* ---- SUBMIT BTN ---- */
        .submit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
          letter-spacing: -0.1px;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.45); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .login-link {
          text-align: center;
          margin-top: 22px;
          color: #475569;
          font-size: 14px;
        }

        .login-link a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .login-link a:hover { color: #a5b4fc; }
      `}</style>

      <div className="reg-root">
        {/* LEFT */}
        <div className="reg-left">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <img src={registerImg} alt="register" className="reg-img" />
          <div className="left-badge">
            <HiTicket style={{ color: '#818cf8', fontSize: 16 }} />
            <span>Join thousands of users today</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="reg-right">
          <div className="form-card">
            <div className="form-logo">
              <div className="logo-dot">
                <HiTicket />
              </div>
              <span className="logo-text">VOYAGO</span>
            </div>

            <h2 className="form-heading">Create your account</h2>
            <p className="form-sub">
              Already have one? <Link to="/login">Sign in</Link>
            </p>

            {/* Google */}
            <button
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="spinner" />
              ) : (
                <FcGoogle size={20} />
              )}
              Continue with Google
            </button>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">or</span>
              <div className="divider-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleRegister}>
              <div className="field-group">
                {/* Name */}
                <div className="field-wrap">
                  <FiUser className="field-icon" />
                  <input
                    name="name"
                    placeholder="Full name"
                    required
                    className="field-input"
                  />
                </div>

                {/* Email */}
                <div className="field-wrap">
                  <FiMail className="field-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    required
                    className="field-input"
                  />
                </div>

                {/* Photo upload */}
                <div>
                  <label
                    className={`file-label${fileName ? ' has-file' : ''}`}
                    htmlFor="photo-upload"
                  >
                    <FiUploadCloud size={18} />
                    <span>{fileName || 'Upload profile photo'}</span>
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    name="photo"
                    accept="image/*"
                    required
                    className="file-input-hidden"
                    onChange={e => setFileName(e.target.files[0]?.name || '')}
                  />
                </div>

                {/* Password */}
                <div className="field-wrap">
                  <FiLock className="field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password (min 6 chars)"
                    required
                    minLength={6}
                    className="field-input"
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <div className="spinner" />
                ) : (
                  <>
                    Create Account <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
