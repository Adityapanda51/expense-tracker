# Expense Tracker Application

A full-stack MERN application for tracking and managing personal expenses with user authentication, categorization, search, filtering, and analytics.

## Features Implemented ✅

### Core Features
- ✅ **User Authentication**: JWT-based login and signup with password hashing (bcryptjs)
- ✅ **Add/Edit/Delete Expenses**: Full CRUD operations for expenses
- ✅ **View Expense History**: Paginated expense list with sorting
- ✅ **Search Expenses**: Search by description with text matching
- ✅ **Filter by Category**: Filter expenses by predefined categories
- ✅ **Dashboard**: Shows total expenses, monthly breakdown, and recent transactions
- ✅ **Expense Charts**: Pie chart for category breakdown and bar chart for monthly data (Recharts)
- ✅ **Dark Mode**: Theme toggle with localStorage persistence

### Technical Features
- ✅ **REST APIs**: Complete REST API with proper HTTP status codes
- ✅ **Form Validation**: Server-side validation with Joi, client-side with React Hook Form
- ✅ **Responsive UI**: Mobile-first design with TailwindCSS
- ✅ **Database Integration**: MongoDB with Mongoose ODM
- ✅ **Error Handling**: Comprehensive error handling and user feedback

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema with password hashing
│   │   └── Expense.js          # Expense schema with validation
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── expenseRoutes.js    # Expense endpoints
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── validation.js       # Input validation with Joi
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   └── expenseController.js # Expense logic
│   ├── server.js               # Express server entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # Auth state management
│   │   │   └── ThemeContext.jsx # Dark mode state
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Signup page
│   │   │   ├── Dashboard.jsx   # Dashboard with charts
│   │   │   └── Expenses.jsx    # Expense management page
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── ExpenseForm.jsx # Add/Edit expense modal
│   │   │   └── ProtectedRoute.jsx # Protected routes wrapper
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # Tailwind CSS
│   │   └── main.jsx            # React entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for validation
- **CORS** for cross-origin requests

### Frontend
- **React.js** with **Vite**
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization
- **React Hook Form** for form handling
- **TailwindCSS** for styling
- **Context API** for state management

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account or local MongoDB

### Backend Setup

1. **Configure Environment Variables**
   ```bash
   cd backend
   ```
   
   Create `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
   JWT_SECRET=your-secret-key-here-change-in-production
   NODE_ENV=development
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Backend Server**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   App will open at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Expenses (all protected with JWT)
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses with pagination & filtering
- `GET /api/expenses/:id` - Get single expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/search?q=query` - Search expenses
- `GET /api/expenses/dashboard` - Get dashboard data (stats & charts)

## Usage

### Creating an Account
1. Click "Sign up" on the login page
2. Enter name, email, and password (min 6 characters)
3. Account created successfully

### Adding Expenses
1. Login to the application
2. Click "Add Expense" button
3. Fill in amount, category, description, and date
4. Click "Save"

### Viewing Dashboard
1. Dashboard shows:
   - Total expenses across all time
   - Monthly expenses for current month
   - Pie chart of expenses by category
   - Recent transactions table

### Searching & Filtering
1. Go to Expenses page
2. Use search bar to find by description
3. Use category dropdown to filter by type
4. Results update in real-time

### Dark Mode
1. Click moon/sun icon in top right
2. Theme preference is saved automatically

## Expense Categories
- Food
- Transport
- Entertainment
- Utilities
- Healthcare
- Shopping
- Education
- Other

## Key Features Explanation

### Authentication
- JWT tokens stored in localStorage
- Auto-logout if token expires
- Protected routes prevent unauthorized access

### Form Validation
- **Backend**: Joi validates all inputs with specific rules
- **Frontend**: React Hook Form provides real-time validation
- Error messages shown to users clearly

### Dashboard Analytics
- Pie chart shows distribution across categories
- Bar chart displays monthly spending
- Recent transactions table shows latest 5 expenses
- Stats cards show total and monthly totals

### Search & Filter
- Case-insensitive description search
- Instant filtering by category
- Pagination for large datasets (10 per page)

## Security Features
- Passwords hashed with bcryptjs (10 salt rounds)
- JWT tokens with 30-day expiration
- Protected API routes require valid token
- Input validation on both client and server
- CORS enabled for secure cross-origin requests

## Error Handling
- Proper HTTP status codes (400, 401, 403, 404, 500)
- User-friendly error messages
- Server-side error logging
- Form validation feedback

## Performance Optimizations
- Database indexes on frequently queried fields
- Pagination to handle large datasets
- Lazy loading of components
- Efficient re-renders with React Context

## Future Enhancements
- Budget limits and alerts
- Recurring expenses
- Expense export to CSV/PDF
- Mobile app version
- Cloud backup
- Multi-currency support
- Social expense sharing
- Advanced analytics and reports

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB URI in `.env`
- Verify IP whitelist in MongoDB Atlas
- Ensure network connectivity

### Frontend API calls failing
- Check backend is running on port 5000
- Verify CORS configuration
- Check network tab in browser DevTools

### Dark mode not persisting
- Clear browser localStorage
- Check browser allows localStorage

## License
ISC

## Author
Expense Tracker Team

---

**Built with ❤️ using MERN Stack**
