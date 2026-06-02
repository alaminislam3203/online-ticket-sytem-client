import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import loginImg from '../assets/Login.jpg';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { HiTicket } from 'react-icons/hi2';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
  const { googleLogin, resetPassword, setUser, setLoading, signInUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // ── Role based redirect ──────────────────────────────────
  const redirectByRole = role => {
    if (role === 'admin') return navigate('/');
    if (role === 'vendor') return navigate('/');
    return navigate('/');
  };

  // ── Email/Password Login ─────────────────────────────────
  const handleLogin = async data => {
    setLoading(true);
    const toastId = toast.loading('Signing you in...');
    try {
      await signInUser(data.email, data.password);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
      );

      localStorage.setItem('token', res.data.token);
      setUser({
        role: res.data.role,
        email: data.email,
        token: res.data.token,
      });

      toast.success('Login Successful!', { id: toastId });
      redirectByRole(res.data.role);
      window.location.reload();
    } catch (err) {
      console.error('Login error:', err);
      let msg = 'Something went wrong!';
      if (err.code === 'auth/invalid-credential')
        msg = 'Invalid email or password.';
      else if (err.code === 'auth/user-not-found')
        msg = 'No account found with this email.';
      else if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      toast.error(err.response?.data?.message || msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ─────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const userCredential = await googleLogin();
      const email = userCredential.user.email;
      const name = userCredential.user.displayName;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-login`,
        { email, name },
      );

      localStorage.setItem('token', res.data.token);
      setUser({ role: res.data.role, email, token: res.data.token });

      toast.success(`Welcome back, ${name || email}!`);
      redirectByRole(res.data.role);
      window.location.reload();
    } catch (err) {
      console.error('Google login failed:', err);
      toast.error('Google Login Failed. Try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Forgot Password ──────────────────────────────────────
  const handleForgot = async () => {
    const email = watch('email');
    if (!email) return toast.error('Enter your email first');
    try {
      await resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (err) {
      console.error('Reset failed:', err);
      toast.error('Unable to send password reset email');
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

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .login-left { display: none !important; }
          .login-right { padding: 32px 24px; }
        }

        /* ---- LEFT PANEL ---- */
        .login-left {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
        
          pointer-events: none;
          z-index: 1;
        }

        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: orb-float 8s ease-in-out infinite;
        }
        .login-orb-1 {
          width: 300px; height: 300px;
        
          top: -80px; left: -80px;
        }
        .login-orb-2 {
          width: 200px; height: 200px;
        
          bottom: -60px; right: -60px;
          animation-delay: -4s;
        }

        @keyframes orb-float {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(20px,-20px) scale(1.05); }
        }

        .login-img {
          position: relative;
          z-index: 2;
          width: 95%;
          max-width: 700px;
          height: 100%;
          object-fit: cover;
          animation: img-rise 0.8s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes img-rise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-badge {
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
          z-index: 3;
          animation: fade-up 1s 0.4s both;
        }

        @keyframes fade-up {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }

        .login-badge span {
          color: #a5b4fc;
          font-size: 13px;
          font-weight: 500;
        }

        /* ---- RIGHT PANEL ---- */
        .login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 1px;
          height: 100%;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          animation: card-in 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .login-form-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .login-logo-dot {
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

        .login-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.3px;
        }

        .login-heading {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          font-weight: 800;
          color: #f8fafc;
          line-height: 1.15;
          margin-bottom: 6px;
          letter-spacing: -0.8px;
        }

        .login-sub {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 28px;
        }

        .login-sub a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .login-sub a:hover { color: #a5b4fc; }

        /* ---- GOOGLE BTN ---- */
        .login-google-btn {
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

        .login-google-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }
        .login-google-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* ---- DIVIDER ---- */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .login-divider-text {
          color: #475569;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ---- FIELDS ---- */
        .login-field-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 8px;
        }

        .login-field-wrap { position: relative; }

        .login-field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          font-size: 16px;
          pointer-events: none;
          transition: color 0.2s;
        }

        .login-field-input {
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

        .login-field-input::placeholder { color: #475569; }

        .login-field-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .login-field-wrap:focus-within .login-field-icon { color: #818cf8; }

        .login-field-input.input-error {
          border-color: rgba(244,63,94,0.5);
        }

        .login-error-msg {
          color: #f43f5e;
          font-size: 12px;
          margin-top: 5px;
          padding-left: 4px;
        }

        /* ---- EYE TOGGLE ---- */
        .login-eye-toggle {
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
          font-size: 17px;
          transition: color 0.2s;
        }
        .login-eye-toggle:hover { color: #818cf8; }

        /* ---- FORGOT ---- */
        .forgot-link {
          display: block;
          text-align: right;
          color: #818cf8;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          margin: 10px 0 20px;
          text-decoration: none;
          transition: color 0.2s;
          background: none;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
        }
        .forgot-link:hover { color: #a5b4fc; }

        /* ---- SUBMIT BTN ---- */
        .login-submit-btn {
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
        .login-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .login-submit-btn:hover::before { opacity: 1; }
        .login-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(99,102,241,0.45); }
        .login-submit-btn:active { transform: translateY(0); }
        .login-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .login-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-bottom-link {
          text-align: center;
          margin-top: 22px;
          color: #475569;
          font-size: 14px;
        }
        .login-bottom-link a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .login-bottom-link a:hover { color: #a5b4fc; }
      `}</style>

      <div className="login-root">
        {/* LEFT */}
        <div className="login-left">
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <img src={loginImg} alt="login" className="login-img" />
          <div className="login-badge">
            <HiTicket style={{ color: '#818cf8', fontSize: 16 }} />
            <span>Welcome back to VOYAGO</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-form-logo">
              <div className="login-logo-dot">
                <HiTicket />
              </div>
              <span className="login-logo-text">VOYAGO</span>
            </div>

            <h2 className="login-heading">Welcome back</h2>
            <p className="login-sub">
              New here? <Link to="/register">Create an account</Link>
            </p>

            {/* Google */}
            <button
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <div className="login-spinner" />
              ) : (
                <FcGoogle size={20} />
              )}
              Continue with Google
            </button>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or</span>
              <div className="login-divider-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="login-field-group">
                {/* Email */}
                <div>
                  <div className="login-field-wrap">
                    <FiMail className="login-field-icon" />
                    <input
                      {...register('email', { required: 'Email is required' })}
                      placeholder="Email address"
                      className={`login-field-input${errors.email ? ' input-error' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="login-error-msg">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="login-field-wrap">
                    <FiLock className="login-field-icon" />
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'At least 6 characters',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className={`login-field-input${errors.password ? ' input-error' : ''}`}
                      style={{ paddingRight: '44px' }}
                    />
                    <button
                      type="button"
                      className="login-eye-toggle"
                      onClick={() => setShowPassword(p => !p)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="login-error-msg">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Forgot password */}
              <button
                type="button"
                className="forgot-link"
                onClick={handleForgot}
              >
                Forgot password?
              </button>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="login-spinner" />
                ) : (
                  <>
                    Sign In <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="login-bottom-link">
              New here? <Link to="/register">Create an account →</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
