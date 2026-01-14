# 🚀 Vercel Deployment Guide - Smart Institutional CRM

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Vercel CLI installed: `npm install -g vercel`
- Git repository (optional but recommended)

## 📦 Deployment Steps

### Step 1: Deploy Backend API

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy backend:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel Dashboard:**
   - Go to your backend project in Vercel Dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     ```
     MONGODB_URI=mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster
     JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
     NODE_ENV=production
     ```

5. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Update .env.production with your backend URL:**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```

3. **Deploy frontend:**
   ```bash
   vercel --prod
   ```

4. **Your frontend will be live at:** `https://your-frontend.vercel.app`

## 🔧 Alternative: Deploy via Vercel Dashboard

### Backend Deployment:
1. Go to https://vercel.com/new
2. Import your Git repository or upload the `backend` folder
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** backend
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
4. Add environment variables (MONGODB_URI, JWT_SECRET, NODE_ENV)
5. Click "Deploy"

### Frontend Deployment:
1. Go to https://vercel.com/new
2. Import your Git repository or upload the project root
3. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** ./
   - **Build Command:** npm run build
   - **Output Directory:** build
4. Add environment variable:
   - `REACT_APP_API_URL=https://your-backend.vercel.app/api`
5. Click "Deploy"

## ⚙️ Post-Deployment Configuration

### Update CORS in Backend
After deployment, update your backend's CORS configuration in `server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'  // Add your frontend URL
  ],
  credentials: true
};
```

Redeploy backend after this change.

## 🔍 Troubleshooting

### Issue: API calls failing
- **Solution:** Verify REACT_APP_API_URL in frontend environment variables
- Check browser console for CORS errors
- Ensure backend URL is correct and accessible

### Issue: Database connection errors
- **Solution:** Verify MONGODB_URI in backend environment variables
- Check MongoDB Atlas network access (allow all IPs: 0.0.0.0/0)
- Verify database user credentials

### Issue: Authentication not working
- **Solution:** Check JWT_SECRET is set in backend environment variables
- Verify token is being sent in API requests
- Check browser localStorage for token

### Issue: Build fails
- **Solution:** Run `npm install` in both frontend and backend
- Check for TypeScript errors: `npm run build` locally
- Verify all dependencies are in package.json

## 📝 Important Notes

1. **Environment Variables:** Never commit .env files to Git
2. **MongoDB Atlas:** Ensure IP whitelist includes 0.0.0.0/0 for Vercel
3. **JWT Secret:** Use a strong, unique secret in production
4. **CORS:** Update allowed origins after deployment
5. **File Uploads:** Vercel has 4.5MB limit for serverless functions
6. **Cold Starts:** First request may be slow due to serverless nature

## 🔐 Security Checklist

- [ ] Change JWT_SECRET from default value
- [ ] Update MongoDB credentials if using default
- [ ] Configure CORS with specific frontend URL
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Review and update all environment variables
- [ ] Test authentication flow in production
- [ ] Verify file upload functionality

## 📊 Monitoring

- **Vercel Dashboard:** Monitor deployments, logs, and analytics
- **MongoDB Atlas:** Monitor database performance and usage
- **Error Tracking:** Check Vercel function logs for errors

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for frontend errors
3. Check Vercel function logs for backend errors
4. Verify all environment variables are set correctly

---

**Deployment Complete! 🎉**

Your Smart Institutional CRM is now live on Vercel!
