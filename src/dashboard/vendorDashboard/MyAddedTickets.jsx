import React, { useEffect, useState } from 'react';
import {
  FaBus,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';

import axios from 'axios';

const MyAddedTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tickets`)
      .then(res => {
        setTickets(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            My Added Tickets
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Manage, update and monitor all your bus tickets easily
          </p>
        </div>

        <div className="bg-white shadow-md px-6 py-4 rounded-2xl border border-slate-200">
          <p className="text-slate-900 text-sm">Total Tickets</p>

          <h2 className="text-3xl font-bold text-amber-600">
            {tickets.length}
          </h2>
        </div>
      </div>

      {/* Tickets */}
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {tickets.map(ticket => (
            <div
              key={ticket._id}
              className="group bg-white rounded-[30px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200"
            >
              {/* Top Banner */}
              <div className="relative bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {ticket.title}
                    </h2>

                    <p className="text-amber-100 mt-1 text-sm">
                      Premium Bus Service
                    </p>
                  </div>

                  <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold border border-white/30">
                    Available
                  </span>
                </div>

                {/* Decorative Blur */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              {/* Body */}
              <div className="p-6 md:p-7 space-y-5">
                {/* Route */}
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <FaMapMarkerAlt className="text-amber-600 text-lg" />
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Route</p>

                      <h3 className="font-bold text-slate-700">
                        {ticket.from} → {ticket.to}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Date + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-3 rounded-xl">
                        <FaCalendarAlt className="text-amber-600" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">Journey Date</p>

                        <h3 className="font-bold text-slate-700">
                          {ticket.date}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <FaMoneyBillWave className="text-green-600" />
                      </div>

                      <div>
                        <p className="text-sm text-slate-400">Ticket Price</p>

                        <h3 className="font-bold text-green-600 text-xl">
                          ৳ {ticket.price}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus Type */}
                <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <FaBus className="text-orange-500 text-lg" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">Bus Type</p>

                    <h3 className="font-bold text-slate-700">
                      {ticket.busType}
                    </h3>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-[1.02] transition-all duration-300 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg">
                    <FaEdit />
                    Update Ticket
                  </button>

                  <button className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:scale-[1.02] transition-all duration-300 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold shadow-lg">
                    <FaTrashAlt />
                    Delete Ticket
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[30px] shadow-lg p-12 text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-6">
            <FaBus className="text-4xl text-amber-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-800">
            No Tickets Found
          </h2>

          <p className="text-slate-500 mt-3 text-lg">
            You have not added any bus ticket yet.
          </p>

          <button className="mt-8 bg-gradient-to-r from-amber-600 to-amber-300 text-white px-8 py-3 rounded-2xl font-semibold hover:scale-105 transition duration-300">
            Add New Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAddedTickets;
