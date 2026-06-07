import { useEffect, useState } from 'react';
import { expenseAPI } from '../services/api';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1'];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-700 dark:text-red-400 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your spending at a glance</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-8 border border-blue-200 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                Total Expenses
              </h3>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3">
                ₹{dashboard.totalExpenses.toFixed(2)}
              </p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-8 border border-green-200 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold uppercase tracking-wide">
                This Month
              </h3>
              <p className="text-4xl font-bold text-green-600 dark:text-emerald-400 mt-3">
                ₹{dashboard.monthlyExpenses.toFixed(2)}
              </p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        {dashboard.byCategory && dashboard.byCategory.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              💳 Expenses by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboard.byCategory}
                  dataKey="total"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                >
                  {dashboard.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Monthly Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            📈 Monthly Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      {hasExpenses && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            ⏰ Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Category</th>
                  <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentExpenses.map((expense) => (
                  <tr 
                    key={expense._id} 
                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-200 font-medium">{expense.description}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{expense.category}</td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-gray-200 font-semibold">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!hasExpenses && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
          <p className="text-blue-700 dark:text-blue-400 font-semibold">No expenses yet</p>
          <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">Start adding expenses to see them here</p>
        </div>
      )}
    </div>
  );
}
