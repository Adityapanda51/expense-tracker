import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import { validateExpense } from '../middleware/validation.js';

export const createExpense = async (req, res) => {
  try {
    const { error } = validateExpense(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { amount, category, description, date } = req.body;

    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = { userId: req.userId };
    if (category) {
      filter.category = category;
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { error } = validateExpense(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchExpenses = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const searchQuery = {
      userId: req.userId,
      $or: [
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    };

    const expenses = await Expense.find(searchQuery)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(searchQuery);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      expenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Monthly expenses (this month)
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1),
          },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Monthly breakdown for last 12 months
    const monthlyBreakdown = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const nextDate = new Date(currentYear, currentMonth - i + 1, 1);
      
      const monthData = await Expense.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: date,
              $lt: nextDate,
            },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyBreakdown.push({
        name: monthNames[date.getMonth()],
        value: monthData[0]?.total || 0,
      });
    }

    // By category
    const byCategory = await Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    // Recent expenses
    const recentExpenses = await Expense.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(5);

    res.json({
      success: true,
      totalExpenses: totalExpenses[0]?.total || 0,
      monthlyExpenses: monthlyExpenses[0]?.total || 0,
      monthlyBreakdown,
      byCategory,
      recentExpenses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
