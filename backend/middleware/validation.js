import Joi from 'joi';

export const validateSignup = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email',
      'any.required': 'Email is required',
    }),
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(user);
};

export const validateLogin = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email must be a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  });
  return schema.validate(user);
};

export const validateExpense = (expense) => {
  const schema = Joi.object({
    amount: Joi.number().min(0.01).required().messages({
      'number.min': 'Amount must be greater than 0',
      'any.required': 'Amount is required',
    }),
    category: Joi.string()
      .valid('Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Education', 'Other')
      .required()
      .messages({
        'any.only': 'Invalid category',
        'any.required': 'Category is required',
      }),
    description: Joi.string().max(500).required().messages({
      'string.max': 'Description must not exceed 500 characters',
      'any.required': 'Description is required',
    }),
    date: Joi.date().required().messages({
      'any.required': 'Date is required',
    }),
  });
  return schema.validate(expense);
};
