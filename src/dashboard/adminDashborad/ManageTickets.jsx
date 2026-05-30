import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManageTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Fetch Tickets
  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets`,
      );

      setTickets(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Handle Status
  const handleStatus = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tickets/status/${id}`,
        {
          status,
        },
      );

      Swal.fire({
        icon: 'success',
        title: `Ticket ${status}`,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800">
          Manage Tickets
        </h1>

        <p className="text-slate-500 mt-2 font-medium">
          Manage and verify all transport tickets easily.
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            {/* Head */}
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-5 px-6 text-left">#</th>

                <th className="py-5 px-6 text-left">Ticket Title</th>

                <th className="py-5 px-6 text-left">Route</th>

                <th className="py-5 px-6 text-left">Price</th>

                <th className="py-5 px-6 text-left">Status</th>

                <th className="py-5 px-6 text-left">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {currentTickets.map((ticket, index) => (
                <tr
                  key={ticket._id}
                  className="border-b hover:bg-slate-50 transition duration-300"
                >
                  {/* Index */}
                  <td className="py-5 px-6 font-bold text-slate-700">
                    {startIndex + index + 1}
                  </td>

                  {/* Title */}
                  <td className="py-5 px-6">
                    <h2 className="font-bold text-slate-800">{ticket.title}</h2>
                  </td>

                  {/* Route */}
                  <td className="py-5 px-6 text-slate-600 font-medium">
                    {ticket.from} → {ticket.to}
                  </td>

                  {/* Price */}
                  <td className="py-5 px-6">
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold">
                      ৳ {ticket.price}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-5 px-6">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        ticket.verificationStatus === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : ticket.verificationStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {ticket.verificationStatus || 'pending'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-5 px-6">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleStatus(ticket._id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleStatus(ticket._id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-500">
              No Tickets Found
            </h2>
          </div>
        )}

        {/* Pagination */}
        {tickets.length > 0 && (
          <div className="flex justify-center items-center gap-3 flex-wrap p-6 border-t bg-slate-50">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-5 py-2 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-slate-900 transition"
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages).keys()].map(num => (
              <button
                key={num}
                onClick={() => setCurrentPage(num + 1)}
                className={`w-11 h-11 rounded-xl font-bold transition ${
                  currentPage === num + 1
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {num + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-5 py-2 rounded-xl bg-slate-800 text-white font-semibold disabled:opacity-40 hover:bg-slate-900 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTickets;
