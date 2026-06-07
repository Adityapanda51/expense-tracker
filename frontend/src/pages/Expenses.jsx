import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';

export default function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
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
      let response;
      if (searchTerm) {
        response = await expenseAPI.search(searchTerm, { page, limit });
      } else {
        response = await expenseAPI.getAll({ category: selectedCategory || undefined, page, limit });
      }
      setExpenses(response.data.expenses);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to load expenses:', error);
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
    if (window.confirm('Are you sure?')) {
      try {
        await expenseAPI.delete(id);
        loadExpenses();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingId(null);
    loadExpenses();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        <input
          type="text"
          placeholder="Search by description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No expenses found
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400">Description</th>
                  <th className="text-left px-4 py-3 text-gray-600 dark:text-gray-400">Category</th>
                  <th className="text-right px-4 py-3 text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-center px-4 py-3 text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                      {expense.description}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-300">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-300">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(expense._id);
                          setShowForm(true);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
            </span>
            <div className="space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= total}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
