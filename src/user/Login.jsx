import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import loginImg from '../assets/Login.jpg';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../Context/AuthContext';

const Login = () => {
  const { googleLogin, resetPassword, setUser, setLoading, signInUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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
    try {
      // 1. Firebase auth
      await signInUser(data.email, data.password);

      // 2. Backend JWT
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
      );

      // FIX: 'access-token' → 'token' (সব component এ 'token' দিয়ে read হয়)
      localStorage.setItem('token', res.data.token);

      setUser({
        role: res.data.role,
        email: data.email,
        token: res.data.token,
      });

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 2000,
        showConfirmButton: false,
      });

      redirectByRole(res.data.role);
    } catch (err) {
      console.error('Login error:', err);

      let errorMessage = 'Something went wrong!';
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      }

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Google Login ─────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await googleLogin();
      const email = userCredential.user.email;
      const name = userCredential.user.displayName;

      // Backend এ user save + JWT token নাও
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/google-login`,
        { email, name },
      );

      // FIX: token save করা হচ্ছে
      localStorage.setItem('token', res.data.token);

      setUser({
        role: res.data.role,
        email: email,
        token: res.data.token,
      });

      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful',
        text: `Welcome ${name || email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      redirectByRole(res.data.role);
    } catch (err) {
      console.error('Google login failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Something went wrong. Try again.',
      });
    }
  };

  // ── Forgot Password ──────────────────────────────────────
  const handleForgot = async () => {
    const email = watch('email');
    if (!email) return Swal.fire('Enter your email first');
    try {
      await resetPassword(email);
      Swal.fire({
        icon: 'success',
        title: 'Password Reset',
        text: 'Password reset email sent',
      });
    } catch (err) {
      console.error('Reset failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: 'Unable to send password reset email',
      });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 items-center">
      <img src={loginImg} className="hidden md:block h-full object-cover" />

      <div className="p-8 max-w-md mx-auto w-full">
        <h2 className="text-3xl font-bold mb-4">Login</h2>

        <form onSubmit={handleSubmit(handleLogin)}>
          <input
            {...register('email', { required: true })}
            placeholder="Email"
            className="input input-bordered w-full mb-3"
          />
          {errors.email?.type === 'required' && (
            <p className="text-red-500 mb-2">Email is required</p>
          )}

          <input
            {...register('password', { required: true, minLength: 6 })}
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-2"
          />
          {errors.password?.type === 'required' && (
            <p className="text-red-500">Password is required</p>
          )}
          {errors.password?.type === 'minLength' && (
            <p className="text-red-500">
              Password must be at least 6 characters
            </p>
          )}

          <p
            onClick={handleForgot}
            className="text-sm text-blue-600 cursor-pointer mb-4"
          >
            Forgot password?
          </p>

          <button className="btn btn-primary w-full">Login</button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full mt-3"
        >
          Login with Google
        </button>

        <p className="text-center mt-4">
          New here?{' '}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
