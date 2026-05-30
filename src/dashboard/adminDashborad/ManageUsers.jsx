import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access-token');

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateRole = async (id, role) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/role/${id}`, {
      role,
    });

    Swal.fire({
      icon: 'success',
      title: `User is now ${role}`,
    });

    fetchUsers();
  };

  const markFraud = async id => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/fraud/${id}`);

    Swal.fire({
      icon: 'warning',
      title: 'Vendor marked as fraud',
    });

    fetchUsers();
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-100">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6">
        Manage Users
      </h1>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
        <table className="min-w-[700px] w-full">
          {/* Head */}
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="py-4 px-6 text-left">Name</th>
              <th className="py-4 px-6 text-left">Email</th>
              <th className="py-4 px-6 text-left">Role</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.map(user => (
              <tr
                key={user._id}
                className="border-b hover:bg-slate-50 transition"
              >
                {/* Name */}
                <td className="py-4 px-6 font-semibold text-slate-800">
                  {user.name}
                </td>

                {/* Email */}
                <td className="py-4 px-6 text-slate-600">{user.email}</td>

                {/* Role */}
                <td className="py-4 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === 'admin'
                        ? 'bg-blue-100 text-blue-700'
                        : user.role === 'vendor'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateRole(user._id, 'admin')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Admin
                    </button>

                    <button
                      onClick={() => updateRole(user._id, 'vendor')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                    >
                      Vendor
                    </button>

                    {user.role === 'vendor' && (
                      <button
                        onClick={() => markFraud(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Fraud
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
