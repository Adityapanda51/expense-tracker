import { useEffect, useState } from 'react';
import { expenseAPI } from '../services/api';

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Other'];

export default function ExpenseForm({ onClose, expenseId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (expenseId) {
      const fetchExpense = async () => {
        try {
          const response = await expenseAPI.getOne(expenseId);
          const expense = response.data.expense;
          setFormData({
            amount: expense.amount,
            category: expense.category,
            description: expense.description,
            date: new Date(expense.date).toISOString().split('T')[0],
          });
        } catch (err) {
          setError('Failed to load expense');
        }
      };
      fetchExpense();
    }
  }, [expenseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (expenseId) {
        await expenseAPI.update(expenseId, formData);
      } else {
        await expenseAPI.create(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in">
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {expenseId ? 'Edit Entry' : 'New Expense'}
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-6 border border-red-100 dark:border-red-900/30 text-sm font-bold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              required
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-transparent rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-bold text-lg"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-transparent rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-bold cursor-pointer appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-4 pointer-events-none text-slate-400">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-transparent rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-bold"
              placeholder="What was this for?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-6 py-4 border border-transparent rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-bold cursor-pointer"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : (expenseId ? 'Update Record' : 'Create Record')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
