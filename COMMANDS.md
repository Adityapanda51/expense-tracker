# Commands Reference Guide

## ⚡ QUICK START (Copy & Paste)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Then open browser
```
http://localhost:5173
```

---

## 🔧 BACKEND COMMANDS

### Setup
```bash
cd backend
npm install              # Install dependencies
npm install -g nodemon   # (Optional) Global nodemon for watch mode
```

### Configuration
```bash
# Edit .env file with your MongoDB URI
nano .env                # macOS/Linux
code .env                # VS Code
# or open in any text editor
```

### Running
```bash
npm run dev              # Development (with auto-reload)
npm start                # Production
```

### Testing APIs (with curl)
```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual JWT)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get expenses
curl http://localhost:5000/api/expenses \
  -H "Authorization: Bearer TOKEN"

# Get dashboard
curl http://localhost:5000/api/expenses/dashboard \
  -H "Authorization: Bearer TOKEN"
```

### Debugging
```bash
# View logs in terminal
npm run dev              # Shows all logs

# Check if port is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # macOS/Linux
```

---

## 🎨 FRONTEND COMMANDS

### Setup
```bash
cd frontend
npm install              # Install dependencies
```

### Running
```bash
npm run dev              # Development server on http://localhost:5173
npm run build            # Build for production (creates dist/)
npm run preview          # Preview production build
```

### Debugging
```bash
# Check port is in use
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # macOS/Linux

# Change port
npm run dev -- --port 3000    # Run on port 3000
```

### Build Output
```bash
npm run build
# Output in: frontend/dist/
```

---

## 📦 DATABASE COMMANDS

### MongoDB Atlas (Cloud)
```bash
# No local commands needed, managed in cloud
# Connection string: mongodb+srv://user:password@cluster.mongodb.net/expense-tracker
```

### MongoDB Local (if using local DB)
```bash
# Start MongoDB service
mongod                   # macOS/Linux
# Windows: Start MongoDB from Services app

# Connect to database
mongosh                  # Connect to local database
show dbs                 # List databases
use expense-tracker      # Switch database
db.expenses.find()       # View expenses
db.users.find()          # View users
```

---

## 🧪 POSTMAN COLLECTIONS

### Signup
```
Method: POST
URL: http://localhost:5000/api/auth/signup
Headers: Content-Type: application/json
Body:
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

### Login
```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Expense
```
Method: POST
URL: http://localhost:5000/api/expenses
Headers:
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>
Body:
{
  "amount": 50.00,
  "category": "Food",
  "description": "Lunch at restaurant",
  "date": "2024-01-15"
}
```

### Get Expenses
```
Method: GET
URL: http://localhost:5000/api/expenses?page=1&limit=10
Headers:
  - Authorization: Bearer <TOKEN>
```

### Search Expenses
```
Method: GET
URL: http://localhost:5000/api/expenses/search?q=lunch&page=1&limit=10
Headers:
  - Authorization: Bearer <TOKEN>
```

### Filter by Category
```
Method: GET
URL: http://localhost:5000/api/expenses?category=Food&page=1&limit=10
Headers:
  - Authorization: Bearer <TOKEN>
```

### Get Dashboard
```
Method: GET
URL: http://localhost:5000/api/expenses/dashboard
Headers:
  - Authorization: Bearer <TOKEN>
```

### Update Expense
```
Method: PUT
URL: http://localhost:5000/api/expenses/<EXPENSE_ID>
Headers:
  - Content-Type: application/json
  - Authorization: Bearer <TOKEN>
Body:
{
  "amount": 75.00,
  "category": "Entertainment",
  "description": "Movie tickets",
  "date": "2024-01-16"
}
```

### Delete Expense
```
Method: DELETE
URL: http://localhost:5000/api/expenses/<EXPENSE_ID>
Headers:
  - Authorization: Bearer <TOKEN>
```

---

## 🐛 TROUBLESHOOTING COMMANDS

### Check if ports are in use
```bash
# Windows
netstat -ano | findstr :5000    # Backend
netstat -ano | findstr :5173    # Frontend

# macOS/Linux
lsof -i :5000                   # Backend
lsof -i :5173                   # Frontend
```

### Kill process using port (macOS/Linux)
```bash
kill -9 <PID>                   # Replace <PID> with process ID
```

### Kill process using port (Windows)
```bash
taskkill /PID <PID> /F          # Replace <PID> with process ID
```

### Clear npm cache
```bash
npm cache clean --force
```

### Reinstall dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Check installed versions
```bash
node --version              # Node version
npm --version               # NPM version
npm list axios              # Specific package version
npm list                    # All installed packages
```

---

## 📋 ENVIRONMENT SETUP

### Backend .env Template
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Frontend API Configuration
Edit `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

## 📚 USEFUL ALIASES (Optional)

Add to your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Quick start
alias exp-backend='cd /path/to/expense-tracker/backend && npm run dev'
alias exp-frontend='cd /path/to/expense-tracker/frontend && npm run dev'

# Reinstall
alias reinstall-backend='cd backend && rm -rf node_modules && npm install'
alias reinstall-frontend='cd frontend && rm -rf node_modules && npm install'
```

---

## 🚀 DEPLOYMENT COMMANDS

### Build Frontend for Production
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Deploy to Vercel
```bash
npm install -g vercel      # Install Vercel CLI
cd frontend
vercel                     # Follow prompts
```

### Deploy to Netlify
```bash
npm install -g netlify-cli # Install Netlify CLI
cd frontend
netlify deploy --prod      # After running npm run build
```

### Deploy Backend to Heroku
```bash
npm install -g heroku      # Install Heroku CLI
heroku login               # Login to Heroku
cd backend
heroku create app-name     # Create app
git push heroku main       # Deploy
heroku open                # Open app
```

---

## 🔗 USEFUL LINKS

- Node.js: https://nodejs.org/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Postman: https://www.postman.com/
- React Docs: https://react.dev/
- Express Docs: https://expressjs.com/
- Mongoose: https://mongoosejs.com/

---

## 💡 TIPS

1. **Keep terminals organized** - Use terminal tabs or split view
2. **Save common commands** - Create aliases for frequently used commands
3. **Monitor logs** - Keep backend terminal visible to see errors
4. **Use Postman** - Test APIs before using frontend
5. **Check browser console** - Always check for frontend errors
6. **Check backend terminal** - Always check for backend errors
7. **Refresh browser** - Clear cache if styles don't update
8. **Check .env** - Always verify environment variables are set

---

## ⚙️ ENVIRONMENT VARIABLES

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend (hardcoded in api.js)
- `API_URL` - Backend API URL (default: http://localhost:5000/api)

---

## 📊 Database Indexes

Automatically created:
- `(userId, date)` - For expense sorting
- `(userId, category)` - For category filtering

---

## ✅ Pre-Flight Checklist

Before starting:
- [ ] Node.js v16+ installed
- [ ] MongoDB connection string ready
- [ ] Backend `.env` configured
- [ ] Port 5000 available
- [ ] Port 5173 available
- [ ] Dependencies installed

Before deploying:
- [ ] Update JWT_SECRET
- [ ] Update MongoDB connection string
- [ ] Set NODE_ENV to production
- [ ] Test all features
- [ ] Update frontend API URL

---

## 🆘 QUICK HELP

**Something's wrong?**
1. Check terminal errors (backend & frontend)
2. Check browser console (Frontend)
3. Try refreshing the page
4. Try restarting the servers
5. Check if ports are in use
6. Review setup guides (SETUP.md files)

**Nothing helps?**
1. Check README.md for troubleshooting section
2. Review backend/SETUP.md
3. Review frontend/SETUP.md
4. Check BUILD_COMPLETE.md for detailed info

---

This reference covers all common commands for development, testing, and deployment.
