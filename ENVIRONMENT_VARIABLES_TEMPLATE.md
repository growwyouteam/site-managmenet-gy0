# 🔐 Environment Variables Template

## Copy-Paste Ready Templates for Vercel Dashboard

---

## 🖥️ Backend Environment Variables

**Where to add:** Vercel Dashboard → Backend Project → Settings → Environment Variables

### Variable 1: NODE_ENV
```
NODE_ENV
```
**Value:**
```
production
```

### Variable 2: MONGODB_URI
```
MONGODB_URI
```
**Value:**
```
mongodb+srv://growwyouwithus_db_user:yvn3QUOSBeZoE2H5@cluster0.racbswp.mongodb.net/site?appName=Cluster0
```

### Variable 3: SESSION_SECRET
```
SESSION_SECRET
```
**Value:** (Generate a random string or use this)
```
construction-site-secret-key-2024-change-this-to-random-string
```

### Variable 4: FRONTEND_URL
```
FRONTEND_URL
```
**Value:** (Add AFTER frontend is deployed)
```
https://your-frontend-app.vercel.app
```

---

## 🎨 Frontend Environment Variables

**Where to add:** Vercel Dashboard → Frontend Project → Settings → Environment Variables

### Variable 1: VITE_API_BASE_URL
```
VITE_API_BASE_URL
```
**Value:** (Replace with your backend URL)
```
https://your-backend-app.vercel.app/api
```
⚠️ **Important:** Must end with `/api`

### Variable 2: VITE_SOCKET_URL
```
VITE_SOCKET_URL
```
**Value:** (Replace with your backend URL)
```
https://your-backend-app.vercel.app
```
⚠️ **Important:** NO `/api` at the end

---

## 📋 Quick Copy Format

### Backend (All 4 variables)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://growwyouwithus_db_user:yvn3QUOSBeZoE2H5@cluster0.racbswp.mongodb.net/site?appName=Cluster0
SESSION_SECRET=construction-site-secret-key-2024-change-this-to-random-string
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend (All 2 variables)
```
VITE_API_BASE_URL=https://your-backend-app.vercel.app/api
VITE_SOCKET_URL=https://your-backend-app.vercel.app
```

---

## 🔄 Deployment Order Reminder

1. **First:** Deploy backend with first 3 variables (skip FRONTEND_URL)
2. **Second:** Deploy frontend with both variables (use backend URL)
3. **Third:** Update backend with FRONTEND_URL and redeploy

---

## ✅ Verification Checklist

After setting all variables:

- [ ] Backend has 4 environment variables
- [ ] Frontend has 2 environment variables
- [ ] `VITE_API_BASE_URL` ends with `/api`
- [ ] `VITE_SOCKET_URL` does NOT end with `/api`
- [ ] Both URLs use `https://` (not `http://`)
- [ ] Backend redeployed after adding `FRONTEND_URL`

---

**Last Updated:** December 26, 2024
