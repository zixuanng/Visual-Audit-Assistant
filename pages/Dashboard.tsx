import React from 'react';
import { AuditHistoryChart } from '../components/AuditHistoryChart';
import { ClipboardCheck, AlertTriangle, PackageCheck, TrendingUp } from 'lucide-react';

const StatCard: React.FC<{
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, value, change, icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {change && (
        <p className={`text-xs font-medium mt-2 flex items-center ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {change}
        </p>
      )}
    </div>
    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of recent audit activities and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Audits" 
          value="1,248" 
          change="+12% from last month" 
          trend="up"
          icon={<ClipboardCheck size={24} />} 
        />
        <StatCard 
          title="Safety Hazards" 
          value="14" 
          change="-5% from last month" 
          trend="down" // down is good for hazards, visual interpretation depends on context but using green for 'good' trend usually
          icon={<AlertTriangle size={24} className="text-orange-500" />} 
        />
        <StatCard 
          title="Items Counted" 
          value="45.2k" 
          change="+8% from last month" 
          trend="up"
          icon={<PackageCheck size={24} />} 
        />
        <StatCard 
          title="Efficiency Score" 
          value="94%" 
          change="+2% from last month" 
          trend="up"
          icon={<TrendingUp size={24} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <AuditHistoryChart />
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-md flex flex-col justify-between">
           <div>
             <h3 className="text-lg font-semibold mb-2">Start a New Audit</h3>
             <p className="text-blue-100 text-sm mb-6">Use the AI-powered visual assistant to instantly analyze shelves, check compliance, and count inventory.</p>
           </div>
           <button 
             onClick={() => window.location.hash = '#audit'}
             className="bg-white text-blue-700 py-3 px-4 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors w-full flex items-center justify-center gap-2"
           >
             Go to Audit Tool <ClipboardCheck size={16} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <PackageCheck size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Aisle {i} Inventory Check</h4>
                <p className="text-xs text-gray-500">Completed 2 hours ago by System</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Compliant
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};