# ✅ Pre-Deployment Checklist

## Before Pushing to GitHub:

- [ ] Backend `.env` file is NOT committed (check .gitignore)
- [ ] MongoDB Atlas connection string is ready
- [ ] All code is committed to GitHub

## Push to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Deploy on Render:

### Backend (Web Service):
1. Root Directory: `backend`
2. Build: `npm install`
3. Start: `npm start`
4. Environment Variables:
   - PORT = 5001
   - MONGODB_URI = (your MongoDB Atlas URL)
   - JWT_SECRET = (random secret key)
   - NODE_ENV = production

### Frontend (Static Site):
1. Root Directory: (empty)
2. Build: `npm install && npm run build`
3. Publish: `build`
4. Environment Variable:
   - REACT_APP_API_URL = (your backend URL)/api

### Final Step:
Add to backend environment:
- FRONTEND_URL = (your frontend URL)

## 🎉 Done! Your app is live.
