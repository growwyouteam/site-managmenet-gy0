# Vercel Deployment Guide - JWT Authentication

## ✅ Changes Made for Vercel Compatibility

### Backend Changes
1. **Converted from Session-based to JWT Authentication**
   - Sessions don't work on Vercel serverless functions (stateless)
   - JWT tokens are stored client-side and sent with each request
   - Tokens expire after 7 days

2. **Updated Files:**
   - `backend/controllers/authController.js` - Now generates JWT tokens on login
   - `backend/middleware/auth.js` - Verifies JWT tokens from Authorization header
   - `backend/package.json` - Added `jsonwebtoken` dependency
   - `backend/.env.example` - Added `JWT_SECRET` variable

### Frontend Changes
1. **Updated Authentication Context**
   - Stores JWT token in `localStorage`
   - Automatically includes token in all API requests
   - Clears token on logout or 401 errors

2. **Updated Files:**
   - `frontend/src/context/AuthContext.jsx` - JWT token management
   - `frontend/src/services/api.js` - Authorization header handling

---

## 🚀 Deployment Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Deploy Backend to Vercel

1. **Go to Vercel Dashboard** (https://vercel.com)
2. **Import your backend folder** as a new project
3. **Configure Environment Variables** in Vercel:
   - `MONGODB_URI` = Your MongoDB Atlas connection string
   - `JWT_SECRET` = A strong random secret (e.g., `your-secret-key-12345`)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = Your frontend Vercel URL (add after frontend deployment)

4. **Deploy** - Vercel will automatically detect the configuration
5. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard**
2. **Import your frontend folder** as a new project
3. **Configure Environment Variables** in Vercel:
   - `VITE_API_BASE_URL` = `https://your-backend.vercel.app/api`

4. **Deploy** - Vercel will build and deploy your frontend
5. **Copy your frontend URL** (e.g., `https://your-frontend.vercel.app`)

### Step 4: Update Backend CORS Settings

1. Go back to **Backend Vercel Project**
2. **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` = `https://your-frontend.vercel.app`
4. **Redeploy** the backend

---

## 🔐 Environment Variables Summary

### Backend (Vercel)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/site
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

---

## 🧪 Testing After Deployment

1. **Open your frontend URL**
2. **Try logging in** with demo credentials:
   - Admin: `admin@construction.com` / `password123`
   - Site Manager: `rajesh@construction.com` / `manager123`
3. **Check browser console** for any errors
4. **Verify** you're not redirected back to login

---

## 🐛 Troubleshooting

### Issue: "405 Method Not Allowed"
**Cause:** Frontend is calling its own domain instead of backend
**Solution:** Set `VITE_API_BASE_URL` environment variable in Vercel

### Issue: "Login successful but redirects back to login"
**Cause:** JWT token not being stored or sent properly
**Solution:** 
- Check browser localStorage for `token` key
- Check Network tab → Headers → Authorization header
- Verify backend `JWT_SECRET` is set

### Issue: "CORS Error"
**Cause:** Backend doesn't allow frontend domain
**Solution:** Update `FRONTEND_URL` in backend environment variables

### Issue: "401 Unauthorized on /auth/me"
**Cause:** Token expired or invalid
**Solution:** 
- Clear localStorage and login again
- Check backend logs for JWT verification errors
- Verify `JWT_SECRET` matches between deployments

---

## 📝 Important Notes

1. **JWT Secret:** Must be the same across all backend instances
2. **Token Expiry:** Tokens expire after 7 days (configurable in `authController.js`)
3. **Logout:** Handled client-side by removing token from localStorage
4. **Security:** Always use HTTPS in production (Vercel provides this automatically)

---

## 🔄 Redeployment

If you make changes:

1. **Backend changes:** Commit and push → Vercel auto-deploys
2. **Frontend changes:** Commit and push → Vercel auto-deploys
3. **Environment variable changes:** Update in Vercel dashboard → Redeploy

---

## ✨ What's Different from Session-based Auth?

| Feature | Session-based | JWT-based |
|---------|--------------|-----------|
| Storage | Server memory | Client localStorage |
| Vercel Compatible | ❌ No | ✅ Yes |
| Scalability | Limited | Excellent |
| Token in | Cookie | Authorization header |
| Logout | Server destroys session | Client removes token |

---

## 🎯 Next Steps After Deployment

1. ✅ Test all authentication flows
2. ✅ Test all CRUD operations
3. ✅ Verify file uploads work
4. ✅ Check MongoDB data persistence
5. ✅ Monitor Vercel function logs for errors

---

**Your app is now ready for production on Vercel! 🎉**
