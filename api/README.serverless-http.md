This file documents the Express-on-Vercel integration approach.

Implemented change:
- api/index.js now exports a Vercel-compatible request handler that forwards to the Express app.
- Uses `serverless-http` to adapt Express to serverless runtime.

Why:
- The original `export default app` pattern is not reliably compatible with Vercel Route Handlers / rewrites.
- With serverless-http, /api/auth/signup correctly reaches the Express route definitions in backend/server.js.

