import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';

export default function Expenses() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Sync searchTerm with URL query param
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Other'];

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      if (searchTerm) {
        response = await expenseAPI.search(searchTerm, { page, limit });
      } else {
        response = await expenseAPI.getAll({ category: selectedCategory || undefined, page, limit });
      }
      
      // Defensively fallback to an empty array if endpoints return bad metadata shapes
      const fetchedExpenses = response?.data?.expenses || [];
      const fetchedTotal = response?.data?.total || 0;
      
      setExpenses(fetchedExpenses);
      setTotal(fetchedTotal);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadExpenses();
  }, [page, searchTerm, selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        loadExpenses();
      } catch (error) {
        alert('Failed to delete expense');
        console.error('Delete failed:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    loadExpenses();
  };

  // Safely accumulate dynamic sums with fallback checks
  const totalAmount = expenses.reduce((sum, exp) => sum + (exp?.amount || 0), 0);

  // Calculate clean indicators for pagination limits
  const safeExpensesLength = expenses.length;
  const itemStartRange = safeExpensesLength > 0 ? (page - 1) * limit + 1 : 0;
  const itemEndRange = Math.min(page * limit, total);

  return (
    <div className="space-y-10 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Manage and monitor your daily spending.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 cursor-pointer flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Expense
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          onClose={handleFormClose}
          expenseId={editingId}
        />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 text-red-600 dark:text-red-400 font-bold flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-8 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative group">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Search Description
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="What did you buy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-3 px-12 text-sm focus:ring-4 focus:ring-blue-500/10 dark:text-white transition-all outline-none"
              />
              <div className="absolute left-4 top-3.5 text-lg">🔍</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Filter by Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-3 px-12 text-sm focus:ring-4 focus:ring-blue-500/10 dark:text-white transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute left-4 top-3.5 text-lg">📁</div>
              <div className="absolute right-4 top-3.5 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-slate-500 dark:text-slate-400 mt-6 font-bold">Fetching records...</p>
          </div>
        </div>
      ) : safeExpensesLength === 0 ? (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="text-7xl mb-8">🏜️</div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nothing found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-sm mx-auto font-medium">
            {searchTerm || selectedCategory ? "We couldn't find any expenses matching your filters. Try something else!" : "You haven't added any expenses yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl shadow-xl shadow-blue-500/20 p-8 border border-white/10 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs font-black uppercase tracking-widest">Page Summary</p>
                <p className="text-4xl font-black text-white mt-2">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-xl">
                <span className="text-3xl text-white">💰</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50">
                    <th className="text-left px-8 py-5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Date</th>
                    <th className="text-left px-8 py-5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Detail</th>
                    <th className="text-left px-8 py-5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Category</th>
                    <th className="text-right px-8 py-5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Amount</th>
                    <th className="text-center px-8 py-5 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm font-bold">
                        {expense.date 
                          ? new Date(expense.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : 'Recent'}
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-slate-900 dark:text-slate-100 font-black">{expense.description || 'Unnamed Transaction'}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black">
                          {expense.category || 'Other'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-slate-900 dark:text-slate-100 font-black text-lg">
                          ₹{(expense.amount || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => {
                              setEditingId(expense._id);
                              setShowForm(true);
                            }}
                            className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="bg-slate-100 dark:bg-slate-700 p-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white">{itemStartRange}</span> - <span className="text-slate-900 dark:text-white">{itemEndRange}</span> of <span className="text-slate-900 dark:text-white">{total}</span> records
            </span>
            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Prev
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}