import React, { useEffect, useState } from 'react';
import {
  FaUser,
  FaBus,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
});

const RequestedBookings = () => {
  const [booking, setBooking] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/requested-booking`)
      .then(res => setBooking(res.data || []))
      .catch(err => console.log(err));
  }, []);

  // pagination safe fix
  const totalPages = Math.max(1, Math.ceil(booking.length / itemsPerPage));

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBookings = booking.slice(indexOfFirst, indexOfLast);

  // normalize status (IMPORTANT FIX)
  const getStatusStyle = status => {
    const s = status?.toLowerCase();

    if (s === 'pending') return 'bg-yellow-50 text-yellow-600';
    if (s === 'approved') return 'bg-green-50 text-green-600';
    if (s === 'rejected') return 'bg-red-50 text-red-600';
    if (s === 'paid') return 'bg-blue-50 text-blue-600';

    return 'bg-slate-100 text-slate-600';
  };

  const handleApprove = async id => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/requested-booking/approve/${id}`,
      );

      setBooking(prev =>
        prev.map(b => (b._id === id ? { ...b, status: 'Approved' } : b)),
      );

      Toast.fire({ icon: 'success', title: 'Approved' });
    } catch {
      Toast.fire({ icon: 'error', title: 'Failed' });
    }
  };

  const handleReject = async id => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/requested-booking/reject/${id}`,
      );

      setBooking(prev =>
        prev.map(b => (b._id === id ? { ...b, status: 'Rejected' } : b)),
      );

      Toast.fire({ icon: 'success', title: 'Rejected' });
    } catch {
      Toast.fire({ icon: 'error', title: 'Failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Requested Bookings
        </h1>

        <p className="text-slate-500 mt-2 text-sm md:text-base">
          Manage all customer booking requests
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-5 bg-slate-900 text-slate-200 text-sm font-semibold uppercase tracking-wide">
          <div>Customer</div>
          <div>Date</div>
          <div>Bus</div>
          <div>Price</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>

        {/* Table Rows */}
        {currentBookings.length > 0 ? (
          currentBookings.map(b => (
            <div
              key={b._id}
              className="grid grid-cols-6 gap-4 px-6 py-5 items-center border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
            >
              {/* Customer */}
              <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <div className="bg-amber-100 p-2 rounded-full">
                  <FaUser className="text-amber-600 text-sm" />
                </div>

                <span className="truncate">
                  {b.customerName || b.email || 'Unknown'}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FaMapMarkerAlt className="text-blue-500" />

                <span>{b.bookingDate || 'N/A'}</span>
              </div>

              {/* Bus */}
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <FaBus className="text-orange-500" />

                <span>{b.title || 'N/A'}</span>
              </div>

              {/* Price */}
              <div className="font-bold text-emerald-600 flex items-center gap-2 text-sm">
                <FaMoneyBillWave className="text-emerald-500" />

                <span>৳{b.price}</span>
              </div>

              {/* Status */}
              <div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${getStatusStyle(
                    b.status,
                  )}`}
                >
                  {b.status || 'unknown'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleApprove(b._id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl shadow-md transition duration-200"
                >
                  <FaCheckCircle className="text-lg" />
                </button>

                <button
                  onClick={() => handleReject(b._id)}
                  className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl shadow-md transition duration-200"
                >
                  <FaTimesCircle className="text-lg" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-14 text-center text-slate-400 text-lg">
            No Booking Requests Found
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* Pagination */}
      <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
        {/* Page Info */}
        <div className="text-sm text-slate-500 font-medium">
          Page <span className="text-slate-800 font-bold">{currentPage}</span>{' '}
          of <span className="text-slate-800 font-bold">{totalPages}</span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-md rounded-2xl p-2">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:scale-105'
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages })
            .slice(
              Math.max(currentPage - 2, 0),
              Math.min(currentPage + 1, totalPages),
            )
            .map((_, index) => {
              const page = Math.max(currentPage - 2, 0) + index + 1;

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-amber-500 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}

          {/* Next */}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:scale-105'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestedBookings;
