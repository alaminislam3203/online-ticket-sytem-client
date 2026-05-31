import { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../Context/AuthContext';
import {
  FaBus,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
} from 'react-icons/fa';
import { useSearchParams } from 'react-router';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const date = searchParams.get('date');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tickets`)
      .then(res => {
        console.log('All Tickets from server:', res.data);

        const filtered = res.data.filter(ticket => {
          console.log(
            'Checking ticket:',
            ticket.departureDate,
            'against',
            date,
          );

          return (
            ticket.from === from &&
            ticket.to === to &&
            ticket.departureDate === date &&
            ticket.verificationStatus === 'approved'
          );
        });

        setTickets(filtered);
      })
      .catch(err => {
        console.log(err);
        Swal.fire('Error', 'Data load failed', 'error');
      })
      .finally(() => setLoading(false));
  }, [from, to, date]);

  // PAYMENT
  const handlePayment = async bus => {
    if (!user) {
      return Swal.fire('Login Required', 'Please login first', 'warning');
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          ticketId: bus._id,
          email: user.email,
        },
      );

      window.location.replace(res.data.url);
    } catch (error) {
      console.log(error);

      Swal.fire('Error', 'Payment Failed', 'error');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* TOP */}
        <div className="bg-blue-950 text-white rounded-3xl p-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Available Buses
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-orange-400">From</p>
              <h2 className="text-2xl font-bold">{from}</h2>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-orange-400">To</p>
              <h2 className="text-2xl font-bold">{to}</h2>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <p className="text-orange-400">Date</p>
              <h2 className="text-2xl font-bold">{date}</h2>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20">
            <span className="loading loading-spinner loading-lg text-warning"></span>
          </div>
        ) : tickets.length === 0 ? (
          // NO DATA
          <div className=" rounded-3xl p-12 text-center shadow">
            <h2 className="text-4xl font-bold text-red-500">No Bus Found</h2>

            <p className="text-slate-500 mt-3">
              No buses available for this route
            </p>
          </div>
        ) : (
          // CARDS
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <div
                key={ticket._id}
                className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition"
              >
                {/* IMAGE */}
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-56 object-cover"
                />

                {/* BODY */}
                <div className="p-5">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {ticket.title}
                  </h2>

                  <div className="space-y-3 mt-5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-orange-500" />

                      <p>
                        {ticket.from} → {ticket.to}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-orange-500" />

                      <p>{ticket.departureDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaClock className="text-orange-500" />

                      <p>{ticket.departureTime}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaBus className="text-orange-500" />

                      <p>{ticket.transportType}</p>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <p className="text-slate-500 text-sm">Price</p>

                      <h2 className="text-3xl font-bold text-orange-500">
                        ৳ {ticket.price}
                      </h2>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-500 text-sm">Seats</p>

                      <h2 className="text-xl font-bold text-slate-700">
                        {ticket.quantity}
                      </h2>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() => setSelectedBus(ticket)}
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-bold transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedBus && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative">
              {/* CLOSE */}
              <button
                onClick={() => setSelectedBus(null)}
                className="absolute top-4 right-4 bg-red-100 text-red-500 p-2 rounded-full"
              >
                <FaTimes />
              </button>

              {/* IMAGE */}
              <img
                src={selectedBus.image}
                alt={selectedBus.title}
                className="w-full h-56 object-cover"
              />

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="text-3xl font-bold text-slate-800">
                  {selectedBus.title}
                </h2>

                <div className="space-y-3 mt-5 text-slate-600">
                  <p>
                    Route: {selectedBus.from} → {selectedBus.to}
                  </p>

                  <p>Date: {selectedBus.departureDate}</p>

                  <p>Time: {selectedBus.departureTime}</p>

                  <p>Seats: {selectedBus.quantity}</p>

                  <p>User: {user?.email}</p>
                </div>

                {/* PRICE */}
                <div className="bg-orange-50 rounded-2xl p-4 mt-5 flex justify-between">
                  <span className="font-bold text-slate-700">Total Price</span>

                  <span className="text-2xl font-bold text-orange-500">
                    ৳ {selectedBus.price}
                  </span>
                </div>

                {/* PAYMENT */}
                <button
                  onClick={() => handlePayment(selectedBus)}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition"
                >
                  Pay with Stripe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
