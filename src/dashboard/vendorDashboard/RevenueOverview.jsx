import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaBus, FaUsers, FaTicketAlt } from 'react-icons/fa';

import axios from 'axios';

const RevenueOverview = () => {
  const [overview, setOverview] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalTickets: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/vendor/revenue-overview`)
      .then(res => {
        setOverview(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const cards = [
    {
      title: 'Total Revenue',
      value: `৳ ${overview.totalRevenue}`,
      icon: <FaMoneyBillWave />,
      bg: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Bookings',
      value: overview.totalBookings,
      icon: <FaBus />,
      bg: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Total Tickets',
      value: overview.totalTickets,
      icon: <FaTicketAlt />,
      bg: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Total Customers',
      value: overview.totalCustomers,
      icon: <FaUsers />,
      bg: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
          Revenue Overview
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor your ticket sales and earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${card.bg} rounded-3xl p-6 text-white shadow-xl hover:scale-105 transition duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium opacity-90">{card.title}</h3>

                <h2 className="text-3xl font-extrabold mt-2">{card.value}</h2>
              </div>

              <div className="text-5xl opacity-80">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Table */}
      <div className="mt-10 bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-300">
          <h2 className="text-2xl font-bold text-slate-900">Revenue Summary</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="text-left py-4 px-6 font-semibold">Category</th>

                <th className="text-left py-4 px-6 font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody className="text-slate-800">
              <tr className="border-b border-slate-200 hover:bg-slate-100 transition">
                <td className="py-4 px-6 font-semibold">Ticket Revenue</td>

                <td className="py-4 px-6 text-green-600 font-bold">
                  ৳ {overview.totalRevenue}
                </td>
              </tr>

              <tr className="border-b border-slate-200 hover:bg-slate-100 transition">
                <td className="py-4 px-6 font-semibold">Total Bookings</td>

                <td className="py-4 px-6 text-blue-600 font-bold">
                  {overview.totalBookings}
                </td>
              </tr>

              <tr className="border-b border-slate-200 hover:bg-slate-100 transition">
                <td className="py-4 px-6 font-semibold">Active Tickets</td>

                <td className="py-4 px-6 text-orange-600 font-bold">
                  {overview.totalTickets}
                </td>
              </tr>

              <tr className="hover:bg-slate-100 transition">
                <td className="py-4 px-6 font-semibold">Customers</td>

                <td className="py-4 px-6 text-pink-600 font-bold">
                  {overview.totalCustomers}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
