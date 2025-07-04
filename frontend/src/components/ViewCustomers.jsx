import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error('Failed to fetch customers:', err));
  }, []);

  return (
    <div className="p-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-2xl shadow-lg text-white mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Total Customers</h2>
          <p className="text-4xl font-extrabold mt-1">{customers.length}</p>
        </div>
        <User className="w-12 h-12" />
      </div>

      {/* Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Customer List</h3>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          {showList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showList ? 'Hide List' : 'View List'}</span>
        </button>
      </div>

      {/* Cards View */}
      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{customer.name}</h4>
                    <p className="text-sm text-gray-500">Customer</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {customer.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {customer.mobile || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCustomers;
