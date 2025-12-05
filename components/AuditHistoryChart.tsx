import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', hazards: 4, safe: 24 },
  { name: 'Tue', hazards: 3, safe: 28 },
  { name: 'Wed', hazards: 2, safe: 30 },
  { name: 'Thu', hazards: 6, safe: 20 },
  { name: 'Fri', hazards: 1, safe: 35 },
  { name: 'Sat', hazards: 0, safe: 15 },
  { name: 'Sun', hazards: 0, safe: 10 },
];

export const AuditHistoryChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Safety Audit Summary</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{fill: '#f3f4f6'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Bar dataKey="safe" name="Safe Items" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="hazards" name="Hazards Detected" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};