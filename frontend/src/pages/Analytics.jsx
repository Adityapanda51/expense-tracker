import { useEffect, useState } from 'react';
import { expenseAPI } from '../services/api';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getDashboard();
      setData(response.data);
    } catch (err) {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in pb-12">
      {/* Dark Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-950 p-10 sm:p-16 rounded-[3rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
        <div className="absolute top-0 right-0 p-10 opacity-40">
          <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-12 group-hover:scale-110 transition-transform duration-700">
            <polyline points="23 6 13.5 16 8.5 11 1 19"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white">
            Analytics
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
            Deep dive into your spending patterns and uncover insights to optimize your financial health.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Spending Trend (Area Chart) */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
            <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl">📊</span>
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyBreakdown}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff'}}
                itemStyle={{color: '#fff'}}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-800 dark:border-slate-700 shadow-xl shadow-slate-900/20">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-white">
            <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl text-white">🍕</span>
            Category Share
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.byCategory}
                dataKey="total"
                nameKey="_id"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                stroke="none"
              >
                {data.byCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{backgroundColor: '#020617', borderRadius: '16px', border: 'none', color: '#fff'}}
              />
              <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-300 font-bold text-xs uppercase tracking-wider">{value}</span>}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Details */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 border border-slate-800 dark:border-slate-800 shadow-2xl shadow-slate-900/40">
        <h3 className="text-3xl font-black mb-10 text-white tracking-tight text-center sm:text-left">Detailed Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.byCategory.map((cat, idx) => (
            <div key={cat._id} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110" style={{ backgroundColor: `${COLORS[idx % COLORS.length]}20`, color: COLORS[idx % COLORS.length] }}>
                  {idx === 0 ? '🍔' : idx === 1 ? '🚗' : idx === 2 ? '🎮' : '💰'}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{cat.count} Items</span>
              </div>
              <h4 className="text-xl font-black text-white mb-2">{cat._id}</h4>
              <p className="text-3xl font-black tracking-tighter" style={{ color: COLORS[idx % COLORS.length] }}>
                ₹{cat.total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}<span className="text-lg opacity-40">.{(cat.total % 1).toFixed(2).split('.')[1]}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
