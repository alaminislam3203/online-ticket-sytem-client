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

  // ------------------- Handle Login -------------------
  const handleLogin = async data => {
    setLoading(true);
    try {
      const userCredential = await signInUser(data.email, data.password);
      console.log('Firebase login successful:', userCredential);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
      );
      console.log('API Success:', res.data);

      localStorage.setItem('access-token', res.data.token);

      console.log('Before setUser');

      setUser({
        role: res.data.role,
        email: data.email,
        token: res.data.token,
      });

      console.log('After setUser');

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        timer: 2000,
        showConfirmButton: false,
      });

      console.log('Role:', res.data.role);
      setLoading(false);
      if (res.data.role === 'admin') {
        console.log('Navigating to admin dashboard');
        navigate('/dashboard/manu-admin');
      } else if (res.data.role === 'vendor') {
        console.log('Navigating to vendor dashboard');
        navigate('/dashboard/vendor-dashboard/manu-vendor');
      } else {
        navigate('/dashboard/user-home');
      }
    } catch (err) {
      console.error('REAL ERROR:', err);

      let errorMessage = 'Something went wrong!';

      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'ভুল ইমেইল অথবা পাসওয়ার্ড দিয়েছেন। আবার চেষ্টা করুন।';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'এই ইমেইলে কোনো অ্যাকাউন্ট নেই।';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'আপনার পাসওয়ার্ডটি ভুল।';
      }
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.message || errorMessage,
      });
      setLoading(false);
    }
  };

  // ------------------- Google Login -------------------
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await googleLogin();

      setUser({
        role: 'user',
        email: userCredential.user.email,
        token: null,
      });

      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful',
        text: `Welcome ${userCredential.user.email}`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(from);
    } catch (err) {
      console.error('Google login failed:', err);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: 'Something went wrong. Try again.',
      });
    }
  };

  // ------------------- Forgot Password -------------------
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

      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4">Login</h2>

        <form onSubmit={handleSubmit(handleLogin)}>
          <input
            {...register('email', { required: true })}
            placeholder="Email"
            className="input input-bordered w-full mb-3"
          />
          {errors.name?.type === 'required' && (
            <p className="text-red-500"> email is required </p>
          )}
          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-2"
          />
          {errors.password?.type === 'required' && (
            <p className="text-red-500"> Password is required </p>
          )}
          {errors.password?.type === 'minLength' && (
            <p className="text-red-500"> Password is required </p>
          )}
          <p
            onClick={handleForgot}
            className="text-sm text-blue-600 cursor-pointer"
          >
            Forgot password?
          </p>

          <button className="btn btn-primary w-full mt-4">Login</button>
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
