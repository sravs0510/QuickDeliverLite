import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    yellow: 'border-yellow-500 text-yellow-600',
    purple: 'border-purple-500 text-purple-600',
    indigo: 'border-indigo-500 text-indigo-600',
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow border-l-4 ${colorMap[color]} flex items-center justify-between`}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  );
};

export default StatCard;
