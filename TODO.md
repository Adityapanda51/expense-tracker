# TODO

- [ ] Confirm the failing request URL (Network tab) and whether it is `GET /` or `GET /api/...`.
- [ ] If it is `GET /`, ensure frontend API calls use `/api` baseURL (not `/`).
- [ ] Verify `/api/health` works on the deployed domain.
- [ ] If `/api/...` works but `GET /` is returning 404, decide whether to map `/` to frontend SPA only (expected) or also to backend.
- [ ] Implement the chosen fix:
  - [ ] Option A (recommended): keep SPA fallback for `/`, do not send root requests to backend.
  - [ ] Option B: add Express route `app.get('/')` to return a JSON health message.
  - [ ] Option C: change vercel.json rewrites to map `/` to `/api/index.js` (only if you want root to behave like API).
- [ ] Deploy again and re-test.

