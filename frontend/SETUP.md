# Frontend Setup Instructions

## Quick Start

1. **Navigate to frontend directory**
   ```bash
   cd expense-tracker/frontend
   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to http://localhost:5173

## Environment Configuration

The frontend automatically connects to `http://localhost:5000` for API calls.

To change the API URL, edit `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';  // Change this if needed
```

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Troubleshooting

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

### API calls returning 404
- Ensure backend is running on port 5000
- Check network tab in browser DevTools
- Verify backend `.env` has correct database URI

### Dark mode not working
- Clear localStorage: Open DevTools → Application → Local Storage → Clear All
- Refresh page

### Components not rendering
- Check browser console for errors
- Verify all context providers are set up in App.jsx
- Ensure routes are properly configured
