# Backend Setup Instructions

## Quick Start

1. **Navigate to backend directory**
   ```bash
   cd expense-tracker/backend
   ```

2. **Configure Environment Variables**
   
   Edit `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/expense-tracker?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-key-change-in-production
   NODE_ENV=development
   ```

   **Getting MongoDB URI:**
   1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
   2. Create a cluster or select existing one
   3. Click "Connect" → "Connect Your Application"
   4. Copy the connection string
   5. Replace `<username>`, `<password>`, and database name in the URI

3. **Install dependencies** (already done)
   ```bash
   npm install
   ```

4. **Start backend server**
   ```bash
   npm run dev    # Development with auto-reload
   ```
   or
   ```bash
   npm start      # Production
   ```

   Server will run on `http://localhost:5000`

5. **Verify server is running**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Response: `{"success":true,"message":"Server is running"}`

## Database Models

### User Model
- Email (unique, validated)
- Name
- Password (hashed with bcryptjs)
- Timestamps (createdAt, updatedAt)

### Expense Model
- UserId (reference to User)
- Amount (decimal, min 0.01)
- Category (enum: Food, Transport, Entertainment, Utilities, Healthcare, Shopping, Education, Other)
- Description (string, max 500 chars)
- Date (date field)
- Timestamps (createdAt, updatedAt)

## API Testing with Postman

### 1. Signup
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response contains token:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### 3. Create Expense (Protected - Add token in header)
```
POST http://localhost:5000/api/expenses
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

### 4. Get All Expenses
```
GET http://localhost:5000/api/expenses?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Search Expenses
```
GET http://localhost:5000/api/expenses/search?q=lunch&page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Filter by Category
```
GET http://localhost:5000/api/expenses?category=Food&page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

### 7. Get Dashboard Data
```
GET http://localhost:5000/api/expenses/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

Response includes:
- totalExpenses: sum of all expenses
- monthlyExpenses: sum for current month
- byCategory: breakdown by category
- recentExpenses: last 5 expenses

## Troubleshooting

### Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

Or change PORT in `.env` and update frontend API_URL

### MongoDB connection error
- Check `.env` file has correct MongoDB URI
- Verify MongoDB cluster is running and accessible
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Try connection string directly: `mongosh "mongodb+srv://..."`

### JWT errors
- Make sure `JWT_SECRET` is set in `.env`
- Change SECRET in production!
- Tokens expire after 30 days

### CORS errors
- Ensure backend CORS is configured to allow frontend origin
- In production, set specific origin instead of "*"

## Production Deployment

Before deploying to production:

1. **Update `.env`**
   ```
   NODE_ENV=production
   JWT_SECRET=<use-strong-random-secret>
   MONGODB_URI=<production-db-uri>
   ```

2. **Enable request logging**
3. **Set up error monitoring** (Sentry, LogRocket, etc.)
4. **Use environment-specific configuration**
5. **Add rate limiting**
6. **Enable HTTPS only**
7. **Use security headers** (helmet.js)

## Performance Tips

1. Database indexes are already configured on:
   - userId + date (for sorting)
   - userId + category (for filtering)

2. Implement caching for dashboard data
3. Add pagination to prevent large data transfers
4. Use compression middleware (gzip)
5. Monitor slow queries with MongoDB Atlas

## Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with expiration
- ✅ Input validation with Joi
- ✅ CORS configured
- ✅ User can only access their own expenses
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add helmet for security headers
- ⚠️ TODO: Implement request logging
