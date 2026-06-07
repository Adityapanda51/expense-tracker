# Deploy Backend to Render (Express + MongoDB)

This backend is a standard Express server (NOT serverless). Use Render **Web Service**.

## 1) Prerequisites
- MongoDB URI (MongoDB Atlas or similar)
- A JWT secret

## 2) Create a Render Web Service
- Dashboard → **New +** → **Web Service**
- Connect your Git repo (this backend folder recommended)

## 3) Build / Start commands
In Render, set:
- **Root Directory**: `backend` (recommended)
- **Build Command**: `npm install`
- **Start Command**: `npm run start`

> If Render runs `npm install` automatically for the root directory you select, you can leave Build Command empty.

## 4) Environment variables
In Render → Environment, add:

- `NODE_ENV=production`
- `PORT=10000` (Render will provide a port too; 10000 works as a default)
- `MONGODB_URI=YOUR_MONGODB_URI`
- `JWT_SECRET=YOUR_STRONG_RANDOM_SECRET`

## 5) CORS / Frontend URL
Your backend currently uses permissive CORS (`app.use(cors())`), so it will accept requests from Netlify.

Optionally, if you later want stricter CORS, update backend middleware to allow only your Netlify domain.

## 6) Health check
You can verify the service is up at:
- `GET /api/health`

## 7) Update Netlify frontend env var
On Netlify, set during build:
- `VITE_API_URL=https://YOUR-RENDER-SERVICE-URL/api`

That ensures all frontend axios calls go to the correct backend endpoints.

