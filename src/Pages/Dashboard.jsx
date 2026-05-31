import React, { useContext } from 'react';
import { FaBars, FaUserShield } from 'react-icons/fa';
import { Outlet } from 'react-router';
import { AuthContext } from '../Context/AuthContext'; // আপনার পাথের সাথে মিলিয়ে নিন
import ManuAdmin from '../dashboard/adminDashborad/ManuAdmin';
import ManuVendor from '../dashboard/vendorDashboard/ManuVendor';
import ManuUser from '../dashboard/userDashborad/ManuUser';

const Dashboard = () => {
  const { role, roleLoading } = useContext(AuthContext);

  if (roleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="drawer lg:drawer-open min-h-screen">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* MAIN CONTENT */}
        <div className="drawer-content flex flex-col flex-1">
          {/* Navbar */}
          <div className="w-full navbar  text-white flex justify-between px-4">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost lg:hidden"
            >
              <FaBars className="text-xl" />
            </label>
            <h1 className="text-lg font-bold capitalize">{role} Dashboard</h1>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <FaUserShield className="text-2xl" />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 text-black rounded-box w-52"
              >
                <li>
                  <a>User Dashboard</a>
                </li>
                <li>
                  <a>Vendor Dashboard</a>
                </li>
                <li>
                  <a>Admin Dashboard</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 md:p-8">
            <Outlet /> {/* চাইল্ড রাউট এখানে রেন্ডার হবে */}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <div className="menu p-4 w-80 min-h-full">
            <h2 className="text-xl font-bold mb-6 mt-2 px-2 capitalize">
              {role} Dashboard
            </h2>

            {/* ডাইনামিক মেনু রেন্ডারিং */}
            {role === 'admin' && <ManuAdmin />}
            {role === 'vendor' && <ManuVendor />}
            {role === 'user' && <ManuUser />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
