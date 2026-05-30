import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../Context/AuthContext';

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/transactions/${user.email}`)
        .then(res => setTransactions(res.data))
        .catch(err => console.log(err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          💳 Transaction History
        </h1>
        <p className="text-gray-500 mt-2">Your payment records in one place</p>
      </div>

      {/* Empty state */}
      {transactions.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">No transactions found 😔</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map(item => (
            <div
              key={item._id}
              className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h2>

              {/* Amount */}
              <div className="text-2xl font-bold text-green-600 mb-3">
                ৳ {item.amount}
              </div>

              {/* Transaction ID */}
              <div className="text-xs text-gray-500 break-all mb-2">
                ID: {item.transactionId}
              </div>

              {/* Date */}
              <div className="text-sm text-gray-500">
                {new Date(item.date).toLocaleString()}
              </div>

              {/* Badge */}
              <div className="mt-4">
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
