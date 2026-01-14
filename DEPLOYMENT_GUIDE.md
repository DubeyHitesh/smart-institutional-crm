# 🚀 Deploy to Render - Complete Guide

## Prerequisites
✅ GitHub account
✅ Code pushed to GitHub repository
✅ MongoDB Atlas connection string ready

---

## 🔧 STEP 1: Deploy Backend

### 1.1 Go to Render
- Visit: https://render.com
- Click **"Get Started for Free"**
- Sign up with GitHub

### 1.2 Create Web Service
- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository
- Select your repo: `smart-institutional-crm`

### 1.3 Configure Backend Service
```
Name: smart-crm-backend
Region: Choose closest to you
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 1.4 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:
```
PORT = 5001
MONGODB_URI = mongodb+srv://admin:adminforever@smart-crm-cluster.hwyemja.mongodb.net/smart_crm_master?retryWrites=true&w=majority&appName=smart-crm-cluster
JWT_SECRET = your-super-secret-jwt-key-change-this
NODE_ENV = production
```

### 1.5 Deploy
- Click **"Create Web Service"**
- Wait 3-5 minutes for deployment
- Copy your backend URL: `https://smart-crm-backend.onrender.com`

---

## 🎨 STEP 2: Deploy Frontend

### 2.1 Create Static Site
- Click **"New +"** → **"Static Site"**
- Select same GitHub repository

### 2.2 Configure Frontend Service
```
Name: smart-crm-frontend
Branch: main
Root Directory: (leave empty)
Build Command: npm install && npm run build
Publish Directory: build
```

### 2.3 Add Environment Variable
Click **"Advanced"** → **"Add Environment Variable"**

```
REACT_APP_API_URL = https://smart-crm-backend.onrender.com/api
```
(Replace with YOUR actual backend URL from Step 1.5)

### 2.4 Deploy
- Click **"Create Static Site"**
- Wait 3-5 minutes
- Your app is live! 🎉

---

## 🔄 STEP 3: Update Backend CORS

### 3.1 Add Frontend URL to Backend
- Go to your backend service on Render
- Click **"Environment"**
- Add new variable:
```
FRONTEND_URL = https://smart-crm-frontend.onrender.com
```
(Replace with YOUR actual frontend URL)

- Click **"Save Changes"**
- Backend will auto-redeploy

---

## ✅ STEP 4: Test Your App

1. Open your frontend URL: `https://smart-crm-frontend.onrender.com`
2. Register a new admin account
3. Login and test features

---

## 📝 Important Notes

### Free Tier Limitations:
- ⚠️ Backend sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds to wake up
- ✅ Frontend is always fast (no sleep)
- ✅ 750 hours/month free (enough for 1 service 24/7)

### Auto-Deploy:
- ✅ Push to GitHub → Auto-deploys to Render
- ✅ No manual redeployment needed

### Troubleshooting:
- **CORS Error**: Check FRONTEND_URL in backend env variables
- **API Error**: Check REACT_APP_API_URL in frontend env variables
- **Database Error**: Verify MongoDB Atlas connection string
- **Build Failed**: Check logs in Render dashboard

---

## 🔗 Your URLs

After deployment, save these:

**Frontend**: `https://smart-crm-frontend.onrender.com`
**Backend**: `https://smart-crm-backend.onrender.com`
**MongoDB**: Already on Atlas (cloud)

---

## 🎯 Quick Commands

### View Logs:
- Go to service → Click **"Logs"** tab

### Manual Redeploy:
- Go to service → Click **"Manual Deploy"** → **"Deploy latest commit"**

### Update Environment Variables:
- Go to service → **"Environment"** → Edit → **"Save Changes"**

---

## 🚀 You're Done!

Your Smart Institutional CRM is now live and accessible worldwide! 🌍

Share your frontend URL with users to start using the system.
