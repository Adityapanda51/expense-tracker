import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

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
      setExpenses(response.data.expenses);
      setTotal(response.data.total);
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

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track all your expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md flex items-center gap-2"
        >
          + Add Expense
        </button>
      </div>

      {showForm && (
        <ExpenseForm
          onClose={handleFormClose}
          expenseId={editingId}
        />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading expenses...</p>
          </div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-12 text-center">
          <p className="text-blue-700 dark:text-blue-400 font-semibold text-lg">No expenses found</p>
          <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
            {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Start by adding your first expense'}
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl shadow-lg p-6 border border-blue-200 dark:border-slate-600">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Amount on this page</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">₹{totalAmount.toFixed(2)}</p>
          </div>

          {/* Expenses Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                    <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">Date</th>
                    <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">Description</th>
                    <th className="text-left px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">Category</th>
                    <th className="text-right px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">Amount</th>
                    <th className="text-center px-6 py-3 text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <td className="px-6 py-3 text-gray-900 dark:text-gray-200">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-gray-900 dark:text-gray-200 font-medium">
                        {expense.description}
                      </td>
                      <td className="px-6 py-3">
                        <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-xs font-semibold">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-gray-900 dark:text-gray-200">
                        ₹{expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setEditingId(expense._id);
                              setShowForm(true);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                          >
                            ✏️ Edit
                          </button>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors"
                          >
                            🗑️ Delete
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-semibold">{total}</span> expenses
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
