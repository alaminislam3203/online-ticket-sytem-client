import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const BookedTickets = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  console.log('BookedTickets - User:', user);
  console.log('BookedTickets - Tickets:', tickets);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/bookings/${user.email}`)
        .then(res => {
          setTickets(res.data);
          console.log('BookedTickets - Fetched Tickets:', res.data);
        })
        .catch(err => console.log(err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-amber-700">
            🎫 My Booked Tickets
          </h1>
          <p className="text-gray-600 mt-2">
            View all your booked tickets in one place
          </p>
        </div>

        {/* Empty State */}
        {tickets.length === 0 ? (
          <div className="bg-white shadow-lg rounded-2xl p-10 text-center border border-amber-100">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
              alt="No Tickets"
              className="w-28 mx-auto mb-4"
            />

            <h2 className="text-2xl font-bold text-gray-700">
              No Tickets Booked Yet 😔
            </h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven’t booked any tickets yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <div
                key={ticket._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-amber-100"
              >
                {/* Top Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                  <h2 className="text-xl font-bold text-white">
                    {ticket.title}
                  </h2>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">💰 Price</span>
                    <span className="font-bold text-amber-700">
                      ৳ {ticket.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">📅 Date</span>
                    <span className="text-gray-700 text-sm">
                      {new Date(ticket.date).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">📌 Status</span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ticket.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                  <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-semibold transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedTickets;
