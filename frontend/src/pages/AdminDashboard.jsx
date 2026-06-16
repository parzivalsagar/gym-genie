import { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminDashboard() {
  const [reports, setReports] = useState({ totalUsers: 0, totalSellers: 0, totalOrders: 0, totalProducts: 0 });

  useEffect(() => { api.get('/admin/reports').then(res => setReports(res.data)).catch(console.error); }, []);

  const stats = [
    { label: 'Total Users', value: reports.totalUsers, icon: '👥', color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Total Sellers', value: reports.totalSellers, icon: '🏪', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Orders', value: reports.totalOrders, icon: '📦', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Total Products', value: reports.totalProducts, icon: '🏋️', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>ADMIN DASHBOARD</h1>
        <p className="text-dark-400 text-sm mt-1">Platform overview and analytics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(item => (
          <div key={item.label} className={`${item.bg} border border-border rounded-xl p-5 transition-all hover:scale-[1.02] duration-300`}>
            <div className="text-2xl mb-3">{item.icon}</div>
            <p className={`text-2xl sm:text-3xl font-bold ${item.color}`} style={{ fontFamily: 'var(--font-heading)' }}>{item.value}</p>
            <p className="text-dark-400 text-xs sm:text-sm mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
