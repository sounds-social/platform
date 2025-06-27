import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Platform Hosting Costs', value: 10, color: '#8884d8' },
  { name: 'Platform Development', value: 10, color: '#82ca9d' },
  { name: 'Supported Musicians', value: 80, color: '#ffc658' },
];

const SupportOverview = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How Your Support Money is Used</h2>
          <p className="mt-4 text-lg text-gray-600">Transparency is key. Here's a breakdown of how your monthly support is distributed.</p>
        </div>

        <div className="mt-10 bg-white rounded-lg shadow-lg p-6 md:p-10 flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-1/2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0 md:ml-10">
            <ul className="space-y-4">
              {data.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="inline-block w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></span>
                  <p className="text-lg text-gray-700"><span className="font-bold">{item.value}%</span> {item.name}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-gray-600 text-sm">
              The remaining 80% is split evenly among the musicians you support. In the future, you'll be able to customize this split.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Supported Musicians</h3>
          <p className="text-gray-600">List of supported musicians will appear here.</p>
          {/* Placeholder for supported musicians list */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example: */}
            {/* <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
              <img src="https://via.placeholder.com/50" alt="Musician Avatar" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-gray-800">Musician Name</p>
                <p className="text-sm text-gray-500">@musicianslug</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportOverview;
