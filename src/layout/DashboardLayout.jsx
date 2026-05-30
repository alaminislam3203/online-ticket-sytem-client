import { useContext } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router';
import { FaBars, FaBus, FaHome, FaUserShield } from 'react-icons/fa';
import { AuthContext } from '../Context/AuthContext';
import ManuAdmin from '../dashboard/adminDashborad/ManuAdmin';
import ManuVendor from '../dashboard/vendorDashboard/ManuVendor';
import ManuUser from '../dashboard/userDashborad/ManuUser';

const DashboardLayout = () => {
  const { user, loading, role } = useContext(AuthContext);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="drawer lg:drawer-open">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* MAIN CONTENT */}
        <div className="drawer-content flex flex-col">
          {/* MOBILE NAVBAR */}
          <div className="navbar bg-[#081028] text-white lg:hidden">
            {/* MENU BUTTON */}
            <div className="flex-none">
              <label
                htmlFor="dashboard-drawer"
                className="btn btn-square btn-ghost"
              >
                <FaBars className="text-xl" />
              </label>
            </div>

            {/* TITLE */}
            <div className="flex-1">
              <h2 className="text-lg font-bold">Dashboard</h2>
            </div>

            {/* USER ICON */}
            <div className="flex-none">
              <button className="btn btn-ghost btn-circle">
                <FaUserShield className="text-2xl" />
              </button>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side z-50">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

          <div className="w-72 min-h-full bg-[#081028] text-white p-5">
            {/* LOGO */}
            <div className="flex items-center gap-3 mb-10 mt-4">
              <FaBus className="text-3xl text-primary" />

              <h2 className="text-3xl font-bold">Voyago</h2>
            </div>

            {/* HOME */}
            <ul className="menu mb-6">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-slate-700'
                    }`
                  }
                >
                  <FaHome />
                  Home
                </NavLink>
              </li>
            </ul>

            {role === 'admin' ? (
              <ManuAdmin />
            ) : role === 'vendor' ? (
              <ManuVendor />
            ) : (
              <ManuUser />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
