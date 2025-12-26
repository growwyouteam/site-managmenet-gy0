# ⚡ Quick Deployment Steps - Vercel

## 🚀 Deploy in 10 Minutes

### Step 1: Push to GitHub (2 min)
```bash
cd "c:\Users\Admin\Desktop\site project"
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy Backend (3 min)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo
3. **Set Root Directory:** `backend`
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `mongodb+srv://growwyouwithus_db_user:yvn3QUOSBeZoE2H5@cluster0.racbswp.mongodb.net/site?appName=Cluster0`
   - `SESSION_SECRET` = `your-random-secret-key-here`
5. Click Deploy
6. **Copy your backend URL** (e.g., `https://backend-xyz.vercel.app`)

### Step 3: Deploy Frontend (3 min)
1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the **SAME** GitHub repo
3. **Set Root Directory:** `frontend`
4. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://YOUR-BACKEND-URL.vercel.app/api`
   - `VITE_SOCKET_URL` = `https://YOUR-BACKEND-URL.vercel.app`
5. Click Deploy
6. **Copy your frontend URL** (e.g., `https://frontend-xyz.vercel.app`)

### Step 4: Update Backend (2 min)
1. Go to backend project in Vercel
2. Settings → Environment Variables
3. Add/Update `FRONTEND_URL` = `https://YOUR-FRONTEND-URL.vercel.app`
4. Deployments → Redeploy latest

### Step 5: Test (1 min)
1. Visit your frontend URL
2. Login with: `admin@construction.com` / `password123`
3. ✅ Done!

---

## 🔧 Important URLs Format

**Backend Environment Variables:**
```
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend Environment Variables:**
```
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_SOCKET_URL=https://your-backend.vercel.app
```

⚠️ **Note:** Make sure to include `/api` at the end of `VITE_API_BASE_URL`

---

## 🐛 Common Issues

**CORS Error?**
- Check `FRONTEND_URL` is set in backend
- Redeploy backend after setting it

**404 on API calls?**
- Ensure `VITE_API_BASE_URL` ends with `/api`
- Clear browser cache (Ctrl + Shift + R)

**Login not working?**
- Check MongoDB URI is correct
- Verify MongoDB Atlas allows all IPs (0.0.0.0/0)

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed (root: `backend`)
- [ ] Backend env vars set
- [ ] Frontend deployed (root: `frontend`)
- [ ] Frontend env vars set with backend URL
- [ ] Backend `FRONTEND_URL` updated
- [ ] Backend redeployed
- [ ] Login tested successfully

---

**Full Guide:** See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions
