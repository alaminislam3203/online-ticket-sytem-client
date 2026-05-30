import { useEffect, useMemo, useState } from 'react';
import {
  FaUserCircle,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('access-token');

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/payments`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Error');

        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const currentPayments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return payments.slice(start, start + itemsPerPage);
  }, [payments, currentPage]);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        Loading payments...
      </div>
    );

  if (error)
    return (
      <div className="h-96 flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-amber-400 to-amber-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Payments
            </h1>

            <p className="text-slate-900 mt-2 text-sm md:text-base">
              Monitor and manage all financial transactions
            </p>
          </div>

          {/* TOTAL CARD */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl px-6 py-4 min-w-[180px]">
            <p className="text-slate-900 text-sm font-medium">Total Volume</p>

            <h2 className="text-3xl font-extrabold text-amber-500 mt-1">
              {payments.length}
            </h2>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.5fr_1fr] gap-4 px-6 py-4 bg-slate-300 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
          <div>Customer</div>
          <div>Amount</div>
          <div>Transaction ID</div>
          <div>Date</div>
        </div>

        {/* TABLE BODY */}
        {currentPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-4">
              💳
            </div>

            <h2 className="text-2xl font-bold text-slate-700">
              No Payments Found
            </h2>

            <p className="text-slate-500 mt-2">
              Transactions will appear here after successful payments
            </p>
          </div>
        ) : (
          currentPayments.map((pay, idx) => (
            <div
              key={idx}
              className="grid md:grid-cols-[1.5fr_1fr_1.5fr_1fr] grid-cols-1 gap-4 px-6 py-5 items-start md:items-center border-b border-slate-100 hover:bg-amber-50 transition-all duration-200"
            >
              {/* CUSTOMER */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-amber-300 text-amber-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {pay.email?.charAt(0).toUpperCase()}
                </div>

                <div className="overflow-hidden">
                  <p className="text-slate-800 font-medium truncate">
                    {pay.email || 'Unknown User'}
                  </p>

                  <p className="text-xs text-slate-600">Customer Account</p>
                </div>
              </div>

              {/* AMOUNT */}
              <div>
                <span className="inline-flex items-center bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                  💰 ${pay.amount || 0}
                </span>
              </div>

              {/* TRANSACTION */}
              <div className="overflow-hidden">
                <div className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl text-xs md:text-sm font-mono truncate">
                  {pay.transactionId || 'No Transaction ID'}
                </div>
              </div>

              {/* DATE */}
              <div className="text-slate-600 text-sm">
                {pay.date ? new Date(pay.date).toLocaleString() : 'N/A'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-amber-300 hover:border-amber-300 transition-all flex items-center justify-center text-slate-700"
          >
            <FaChevronLeft />
          </button>

          <div className="px-5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-700 font-medium">
            Page <span className="font-bold text-amber-600">{currentPage}</span>{' '}
            of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-amber-300 hover:border-amber-300 transition-all flex items-center justify-center text-slate-700"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </>
  );
};

export default AdminPayments;
