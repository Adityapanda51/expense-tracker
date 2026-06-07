import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ExpenseForm from '../components/ExpenseForm';

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#6366f1'];

const categoryIcons = {
  'Food': '🍕',
  'Transport': '🚗',
  'Entertainment': '🎬',
  'Utilities': '💡',
  'Healthcare': '🏥',
  'Shopping': '🛍️',
  'Education': '📚',
  'Other': '✨'
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await expenseAPI.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    fetchDashboard();
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-500 dark:text-slate-400 mt-6 font-black tracking-tight text-xl">Analyzing Finances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] p-12 text-center animate-in">
        <p className="text-red-600 dark:text-red-400 font-black text-xl mb-6">{error}</p>
        <button
          onClick={fetchDashboard}
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-red-600/20 cursor-pointer active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">No data available</div>;
  }

  const hasExpenses = dashboard.recentExpenses && dashboard.recentExpenses.length > 0;

  // Fallback safe defaults for standard numeric metrics to prevent string format crashes
  const totalOutflow = dashboard.totalExpenses || 0;
  const currentMonthOutflow = dashboard.monthlyExpenses || 0;

  return (
    <div className="space-y-12 animate-in pb-12">
      {/* Quick Add Modal */}
      {showForm && (
        <ExpenseForm onClose={handleFormClose} />
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Financial Summary
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium pl-1">Everything looks good today. Keep it up!</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="group flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-[1.5rem] font-black text-sm shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 active:scale-95 self-start lg:self-auto"
        >
          <span className="text-xl group-hover:rotate-180 transition-transform duration-700">🔄</span> 
          Sync Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="relative group overflow-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-slate-200 dark:border-slate-700 card-hover">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mb-8">💎</div>
            <h3 className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-3">
              Total Outflow
            </h3>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              ₹{totalOutflow.toLocaleString('en-IN', { minimumFractionDigits: 0 })}<span className="text-2xl text-slate-400">.{(totalOutflow % 1).toFixed(2).split('.')[1]}</span>
            </p>
          </div>
        </div>

        <div className="relative group overflow-hidden bg-slate-900 dark:bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/20 card-hover">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 dark:bg-slate-900/5 rounded-2xl flex items-center justify-center text-3xl mb-8">⚡</div>
            <h3 className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-3">
              Current Month
            </h3>
            <p className="text-5xl font-black text-white dark:text-slate-900 tracking-tighter">
              ₹{currentMonthOutflow.toLocaleString('en-IN', { minimumFractionDigits: 0 })}<span className="text-2xl opacity-40">.{(currentMonthOutflow % 1).toFixed(2).split('.')[1]}</span>
            </p>
          </div>
        </div>

        <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[2.5rem] p-10 shadow-2xl shadow-blue-500/30 card-hover md:col-span-2 lg:col-span-1">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md">🚀</div>
              </div>
              <div>
                <h3 className="text-blue-100/80 text-xs font-black uppercase tracking-[0.2em] mb-1">
                  Quick Actions
                </h3>
                <p className="text-xl font-black text-white leading-tight">Manage funds with speed.</p>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col gap-3">
              <button 
                onClick={() => setShowForm(true)}
                className="w-full bg-white text-blue-600 py-3 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all cursor-pointer shadow-lg shadow-blue-900/10 active:scale-95"
              >
                + ADD EXPENSE
              </button>
              <button 
                onClick={() => navigate('/expenses')}
                className="w-full bg-blue-500/30 text-white py-3 rounded-2xl font-black text-xs hover:bg-blue-500/40 transition-all cursor-pointer border border-white/10 active:scale-95"
              >
                VIEW ALL HISTORY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Growth Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm p-10 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
              <span className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-2xl">📊</span>
              Expense Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dashboard.monthlyBreakdown || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 800 }}
                dy={15}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(59, 130, 246, 0.03)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 dark:bg-white p-5 rounded-2xl shadow-2xl border-none">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                        <p className="text-white dark:text-slate-900 text-xl font-black">₹{(payload[0].value || 0).toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#trendGradient)" 
                radius={[12, 12, 12, 12]} 
                barSize={40}
              />
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Categories */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm p-10 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
              <span className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-2xl">🎨</span>
              Categories
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={dashboard.byCategory || []}
                dataKey="total"
                nameKey="_id"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={10}
                stroke="none"
              >
                {(dashboard.byCategory || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 dark:bg-white p-5 rounded-2xl shadow-2xl border-none">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{payload[0].name}</p>
                        <p className="text-white dark:text-slate-900 text-xl font-black">₹{(payload[0].value || 0).toFixed(2)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {(dashboard.byCategory || []).slice(0, 4).map((cat, idx) => (
              <div key={cat._id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{cat._id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm p-12 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Recent Activity
          </h3>
          <span className="bg-slate-100 dark:bg-slate-700 px-6 py-2 rounded-2xl text-xs font-black text-slate-500 dark:text-slate-400 tracking-widest">
            LATEST 5 TRANSACTIONS
          </span>
        </div>
        
        {hasExpenses ? (
          <div className="space-y-6">
            {dashboard.recentExpenses.map((expense) => (
              <div 
                key={expense._id} 
                className="group flex items-center justify-between p-6 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {categoryIcons[expense.category] || '✨'}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{expense.description}</h4>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">{expense.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹{(expense.amount || 0).toFixed(2)}</p>
                  <p className="text-slate-400 text-xs font-bold mt-1">
                    {expense.date 
                      ? new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long' }) 
                      : 'Recent'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🏝️</div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">Clean Slate</h4>
            <p className="text-slate-400 mt-2">Start your financial journey by adding an expense.</p>
          </div>
        )}
      </div>
    </div>
  );
}