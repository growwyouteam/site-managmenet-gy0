# 🚀 Vercel Deployment Guide - Construction Site Management System

This guide provides step-by-step instructions to deploy both the frontend and backend of your Construction Site Management System on Vercel.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables Configuration](#environment-variables-configuration)
5. [Testing Your Deployment](#testing-your-deployment)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before you begin, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Atlas**: Your database connection string (already configured in `.env.example`)
4. **Git Installed**: To push your code to GitHub

---

## 🔧 Step 1: Prepare Your Code for Deployment

### 1.1 Update Your Local Environment Files

**Backend `.env` file** (located in `backend/.env`):
```env 
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://growwyouwithus_db_user:yvn3QUOSBeZoE2H5@cluster0.racbswp.mongodb.net/site?appName=Cluster0
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
FRONTEND_URL=https://your-frontend-app.vercel.app
```

**Frontend `.env` file** (located in `frontend/.env`):
```env
# Leave empty for development (uses proxy)
# Will be set in Vercel dashboard for production
VITE_API_BASE_URL=
VITE_SOCKET_URL=
```

### 1.2 Push Your Code to GitHub

```bash
# Initialize git if not already done
cd "c:\Users\Admin\Desktop\site project"
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment with CORS fixes"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend to Vercel

### 2.1 Import Backend Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. **IMPORTANT**: Set the **Root Directory** to `backend`
   - Click on **"Edit"** next to Root Directory
   - Type: `backend`
   - Click **"Continue"**

### 2.2 Configure Backend Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset**: Other
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 2.3 Add Backend Environment Variables

Click on **"Environment Variables"** and add the following:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://growwyouwithus_db_user:yvn3QUOSBeZoE2H5@cluster0.racbswp.mongodb.net/site?appName=Cluster0` |
| `SESSION_SECRET` | `your-super-secret-key-change-this-to-random-string` |
| `FRONTEND_URL` | (Leave empty for now, will update after frontend deployment) |

### 2.4 Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-backend-app.vercel.app`
4. **SAVE THIS URL** - you'll need it for frontend configuration

### 2.5 Test Backend Deployment

Visit: `https://your-backend-app.vercel.app/api/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running on Vercel",
  "timestamp": "2024-12-26T11:47:00.000Z"
}
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Import Frontend Project

1. Go back to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select the **SAME GitHub repository**
4. **IMPORTANT**: Set the **Root Directory** to `frontend`
   - Click on **"Edit"** next to Root Directory
   - Type: `frontend`
   - Click **"Continue"**

### 3.2 Configure Frontend Build Settings

Vercel should auto-detect Vite, verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Frontend Environment Variables

Click on **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://your-backend-app.vercel.app/api` |
| `VITE_SOCKET_URL` | `https://your-backend-app.vercel.app` |

**Replace `your-backend-app.vercel.app` with your actual backend URL from Step 2.4**

### 3.4 Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-frontend-app.vercel.app`

---

## 🔄 Step 4: Update Backend Environment Variables

Now that you have the frontend URL, update the backend:

1. Go to your **backend project** in Vercel dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Find `FRONTEND_URL` and click **"Edit"**
4. Set value to: `https://your-frontend-app.vercel.app`
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click the **three dots** on the latest deployment → **"Redeploy"**

---

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Frontend Access

1. Visit your frontend URL: `https://your-frontend-app.vercel.app`
2. You should see the login page

### 5.2 Test Login

Use the default credentials:

**Admin Login:**
- Email: `admin@construction.com`
- Password: `password123`

**Site Manager Login:**
- Email: `rajesh@construction.com`
- Password: `manager123`

### 5.3 Verify API Connection

1. After logging in, check the browser console (F12)
2. You should see successful API calls
3. No CORS errors should appear

---

## 🔧 Environment Variables Reference

### Backend Environment Variables (Vercel Dashboard)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://growwyouwithus_db_user:yvn3QUOSBeZoE2H5@cluster0.racbswp.mongodb.net/site?appName=Cluster0
SESSION_SECRET=your-super-secret-key-change-this-to-random-string
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend Environment Variables (Vercel Dashboard)

```env
VITE_API_BASE_URL=https://your-backend-app.vercel.app/api
VITE_SOCKET_URL=https://your-backend-app.vercel.app
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Errors

**Symptoms:** Browser console shows CORS policy errors

**Solution:**
1. Verify `FRONTEND_URL` is set correctly in backend environment variables
2. Ensure backend is redeployed after updating environment variables
3. Check that both URLs use HTTPS (not HTTP)

### Issue 2: API Calls Failing (404 Errors)

**Symptoms:** API calls return 404 Not Found

**Solution:**
1. Verify `VITE_API_BASE_URL` includes `/api` at the end
2. Example: `https://your-backend.vercel.app/api` (not just `https://your-backend.vercel.app`)
3. Clear browser cache and hard reload (Ctrl + Shift + R)

### Issue 3: Database Connection Errors

**Symptoms:** Login fails, data not loading

**Solution:**
1. Verify MongoDB URI is correct in backend environment variables
2. Check MongoDB Atlas network access allows all IPs (0.0.0.0/0)
3. Ensure database user has read/write permissions

### Issue 4: Socket.IO Not Working

**Symptoms:** Real-time notifications not working

**Note:** Socket.IO has limitations on Vercel serverless functions. For full Socket.IO support, consider:
- Using a dedicated WebSocket service (like Pusher, Ably)
- Deploying backend to a platform that supports WebSockets (Railway, Render, Heroku)

### Issue 5: Session Not Persisting

**Symptoms:** User gets logged out frequently

**Solution:**
1. Ensure `withCredentials: true` is set in axios configuration (already done)
2. Verify cookies are being sent in requests (check Network tab)
3. Consider using JWT tokens instead of sessions for serverless environments

### Issue 6: Build Failures

**Frontend Build Fails:**
```bash
# Check build locally first
cd frontend
npm install
npm run build
```

**Backend Build Fails:**
```bash
# Check backend locally
cd backend
npm install
node api/index.js
```

---

## 📝 Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel with `backend` root directory
- [ ] Backend environment variables configured
- [ ] Backend health endpoint working
- [ ] Frontend deployed to Vercel with `frontend` root directory
- [ ] Frontend environment variables configured with backend URL
- [ ] Backend `FRONTEND_URL` updated with frontend URL
- [ ] Backend redeployed after frontend URL update
- [ ] Login working on production
- [ ] No CORS errors in browser console
- [ ] Data loading correctly from MongoDB

---

## 🎯 Post-Deployment Steps

### 1. Set Up Custom Domains (Optional)

**Backend:**
1. Go to backend project → Settings → Domains
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Update DNS records as instructed

**Frontend:**
1. Go to frontend project → Settings → Domains
2. Add your custom domain (e.g., `app.yourdomain.com`)
3. Update DNS records as instructed

### 2. Update Environment Variables with Custom Domains

After setting up custom domains, update:

**Backend `FRONTEND_URL`:**
```
https://app.yourdomain.com
```

**Frontend Environment Variables:**
```
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

### 3. Enable Automatic Deployments

Both projects are now set to auto-deploy when you push to GitHub:
- Push to `main` branch → Automatic production deployment
- Create pull request → Automatic preview deployment

---

## 🔐 Security Recommendations

1. **Change Default Passwords**: Update admin and manager passwords after first login
2. **Update SESSION_SECRET**: Use a strong random string (32+ characters)
3. **MongoDB Security**: 
   - Use strong database password
   - Restrict IP access if possible
   - Enable MongoDB Atlas encryption
4. **Environment Variables**: Never commit `.env` files to GitHub
5. **HTTPS Only**: Ensure both frontend and backend use HTTPS

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs:
   - Project → Deployments → Click on deployment → View Function Logs
2. Check browser console for errors (F12)
3. Verify all environment variables are set correctly
4. Ensure MongoDB Atlas is accessible

---

## 🎉 Success!

Your Construction Site Management System is now live on Vercel!

**Your URLs:**
- Frontend: `https://your-frontend-app.vercel.app`
- Backend API: `https://your-backend-app.vercel.app/api`

**Default Login Credentials:**
- Admin: `admin@construction.com` / `password123`
- Site Manager: `rajesh@construction.com` / `manager123`

---

**Last Updated:** December 26, 2024
**Version:** 1.0.0
