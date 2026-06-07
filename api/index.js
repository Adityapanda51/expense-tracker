import serverlessHttp from 'serverless-http';
import app from '../backend/server.js';

// Vercel Serverless Route Handler wrapper for the Express app.
// Ensure we export a handler function (no direct app.listen usage on Vercel).
export default serverlessHttp(app);


