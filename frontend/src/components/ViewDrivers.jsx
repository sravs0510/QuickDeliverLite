import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Truck, ChevronDown, ChevronUp, Mail, Phone, ShieldCheck } from 'lucide-react';

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/drivers')
      .then(res => setDrivers(res.data))
      .catch(err => console.error('Failed to fetch drivers:', err));
  }, []);

  return (
    <div className="p-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-2xl shadow-lg text-white mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Total Drivers</h2>
          <p className="text-4xl font-extrabold mt-1">{drivers.length}</p>
        </div>
        <Truck className="w-12 h-12" />
      </div>

      {/* Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Driver List</h3>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700"
        >
          {showList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showList ? 'Hide List' : 'View List'}</span>
        </button>
      </div>

      {/* Cards View */}
      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Truck className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{driver.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{driver.status}</p>
                  </div>
                </div>
                <ShieldCheck className="text-green-500 w-5 h-5" />
              </div>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {driver.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {driver.mobile || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDrivers;
