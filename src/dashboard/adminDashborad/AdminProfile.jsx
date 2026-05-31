import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import {
  FaEnvelope,
  FaUserShield,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const AdminProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-[35px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="bg-gradient-to-b from-orange-500 to-amber-500 text-white p-8 flex flex-col items-center justify-center relative">
          {/* Glow */}
          <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          {/* Image + Role */}
          <div className="relative z-10 w-fit mx-auto">
            {/* Image */}
            <img
              src={user?.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
              alt="Admin"
              className="w-40 h-40 rounded-full border-4 border-white shadow-2xl object-cover"
            />

            {/* Badge (Role + Active) */}
            <div className="absolute top-4 -right-6 -translate-x-1/2 rounded-full shadow-lg flex items-center gap-2">
              {/* Active Dot */}
              <span className="relative flex h-8 w-9">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-25"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-green-600"></span>
              </span>
            </div>
          </div>
          {/* Role */}
          <div className="mt-4 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-semibold flex items-center gap-2 z-10">
            <FaUserShield />
            Administrator
          </div>

          <p className="text-center text-blue-100 mt-6 leading-relaxed z-10">
            Manage all buses, vendors, bookings and platform revenue from one
            powerful dashboard.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2 p-6 md:p-10">
          {/* Heading */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-800">
              Admin Profile
            </h1>

            <p className="text-slate-500 mt-2">
              Welcome back to your dashboard.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="bg-slate-100 hover:bg-blue-50 transition rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl text-2xl">
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Email Address</p>

                  <h3 className="font-bold text-slate-800 break-all">
                    {user?.email}
                  </h3>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="bg-slate-100 hover:bg-indigo-50 transition rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl text-2xl">
                  <FaUserShield />
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Role</p>

                  <h3 className="font-bold text-slate-800">Super Admin</h3>
                </div>
              </div>
            </div>

            {/* Active Status */}

            {/* Phone */}
            <div className="bg-slate-100 hover:bg-green-50 transition rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 text-green-600 p-4 rounded-2xl text-2xl">
                  <FaPhoneAlt />
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Phone Number</p>

                  <h3 className="font-bold text-slate-800">+880 1234-567890</h3>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-slate-100 hover:bg-orange-50 transition rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl text-2xl">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <p className="text-slate-500 text-sm">Location</p>

                  <h3 className="font-bold text-slate-800">
                    Dhaka, Bangladesh
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <button className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 rounded-2xl font-bold shadow-lg transition duration-300">
              Edit Profile
            </button>

            <button className="flex-1 border-2 border-slate-300 hover:border-red-400 hover:text-red-500 text-slate-700 py-4 rounded-2xl font-bold transition duration-300">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
