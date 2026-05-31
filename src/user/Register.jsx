import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../hooks/UseAxiosSecure';
import registerImg from '../assets/register (7).png';
import { AuthContext } from '../Context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const { googleLogin, createUser, updateUserProfile } =
    useContext(AuthContext);

  //const [error, setError] = useState("");

  // ------------------- Google Login -------------------
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await googleLogin();

      // backend save
      await axiosSecure.post('/api/register', {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
      });

      Swal.fire({
        icon: 'success',
        title: 'Google Login Successful',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: err.message,
      });
    }
  };

  // ------------------- Image Upload -------------------
  const handleImageUpload = async file => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const data = await res.json();
    return data.data.display_url;
  };

  // ------------------- Register -------------------
  const handleRegister = async e => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoFile = e.target.photo.files[0];

    if (!photoFile) {
      return Swal.fire('Please select a photo');
    }

    try {
      // 1️⃣ Upload image
      const photoURL = await handleImageUpload(photoFile);

      // 2️⃣ Firebase create user
      await createUser(email, password);

      // 3️⃣ Update profile
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      // 4️⃣ Save to backend
      await axiosSecure.post('/api/register', {
        name,
        email,
        password,
        role: 'user',
        photoURL,
      });

      Swal.fire({
        icon: 'success',
        title: 'Registered Successfully',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 items-center">
      <img
        src={registerImg}
        alt="register"
        className="hidden md:block h-full object-cover"
      />

      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4">Register</h2>

        <form onSubmit={handleRegister}>
          <input
            name="name"
            placeholder="Name"
            required
            className="input input-bordered w-full mb-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="input input-bordered w-full mb-2"
          />

          <input
            type="file"
            name="photo"
            required
            className="file-input w-full mb-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="input input-bordered w-full mb-3"
          />

          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full mt-3"
        >
          Register with Google
        </button>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
