# 🔧 Troubleshooting Guide - Backend Connection Issues

## ❌ Problem: Frontend se Backend Connect Nahi Ho Raha

### ✅ Solution Steps (Step by Step Follow Karein)

---

## Step 1: Backend Server Check Karein

### Terminal 1 mein Backend Start karein:
```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
✅ Server running on port 5000
✅ In-memory database initialized
✅ Sample data loaded
```

**Agar error aaye:**

### Error: "Port 5000 already in use"
```powershell
# Windows PowerShell mein ye command run karein:
netstat -ano | findstr :5000
# Process ID milega, usko kill karein:
taskkill /PID <PID_NUMBER> /F

# Phir se backend start karein
npm run dev
```

### Error: "Cannot find module"
```bash
# node_modules delete karke reinstall karein
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Step 2: Frontend Server Check Karein

### Terminal 2 mein Frontend Start karein:
```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

**Agar error aaye:**

### Error: "Port 3000 already in use"
```powershell
# Windows PowerShell mein:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Phir se frontend start karein
npm run dev
```

---

## Step 3: Browser Console Check Karein

1. Browser mein `http://localhost:3000` open karein
2. Press `F12` (Developer Tools)
3. **Console** tab mein dekhein

### Agar ye errors dikhein:

#### Error: "Network Error" ya "ERR_CONNECTION_REFUSED"
**Matlab:** Backend server running nahi hai

**Solution:**
```bash
# Backend terminal check karein
# Agar running nahi hai to start karein:
cd backend
npm run dev
```

#### Error: "CORS Error"
**Matlab:** CORS configuration issue hai

**Solution:** Backend `server.js` mein CORS check karein (already configured hai)

#### Error: "401 Unauthorized"
**Matlab:** Session issue hai

**Solution:** 
1. Browser cache clear karein
2. Cookies clear karein
3. Page refresh karein

---

## Step 4: Network Tab Check Karein

1. Developer Tools mein **Network** tab open karein
2. Login try karein
3. `/api/auth/login` request dekhein

### Request Failed (Red Color):
- **Status: Failed** → Backend not running
- **Status: 404** → Route not found
- **Status: 500** → Server error (backend terminal mein error dekhein)
- **Status: 0** → CORS issue

### Request Success (Green Color):
- **Status: 200** → Login successful ✅

---

## Step 5: Backend .env File Check Karein

File: `backend/.env`

```env
PORT=5000
NODE_ENV=development
SESSION_SECRET=construction-site-secret-key-change-in-production-2024
FRONTEND_URL=http://localhost:3000
```

**Agar .env file nahi hai:**
```bash
cd backend
copy .env.example .env
```

---

## Step 6: Test Backend Directly

Backend test karne ke liye browser mein ye URL open karein:
```
http://localhost:5000/api/auth/me
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Not authenticated"
}
```

Agar ye response aaye to backend working hai ✅

**Agar "Cannot GET" ya timeout aaye:**
- Backend server running nahi hai
- Port 5000 blocked hai

---

## Step 7: Common Issues & Solutions

### Issue 1: "Cannot read property 'role' of null"
**Cause:** User login nahi hai
**Solution:** Login page se login karein

### Issue 2: Sidebar nahi dikh raha
**Cause:** User object null hai
**Solution:** 
1. Logout karein
2. Login karein
3. Page refresh karein

### Issue 3: API calls fail ho rahe hain
**Cause:** Backend server down hai
**Solution:** Backend restart karein

### Issue 4: Session persist nahi ho raha
**Cause:** Cookies disabled hain
**Solution:** 
1. Browser settings mein cookies enable karein
2. Incognito/Private mode use na karein

---

## Step 8: Complete Reset (Agar kuch kaam na kare)

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules package-lock.json .vite
npm install
npm run dev

# Browser
# Clear all cookies and cache
# Hard refresh: Ctrl + Shift + R
```

---

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Browser console mein koi error nahi
- [ ] Network tab mein API calls success (200)
- [ ] Login page dikh raha hai
- [ ] Login credentials kaam kar rahe hain
- [ ] Sidebar dikh raha hai after login
- [ ] Dashboard load ho raha hai

---

## 🔍 Debug Commands

### Check if ports are in use:
```powershell
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Kill process on port:
```powershell
# Windows
taskkill /PID <PID> /F
```

### Check backend logs:
Backend terminal mein errors dekhein

### Check frontend logs:
Browser console (F12) mein errors dekhein

---

## 📞 Still Not Working?

### Check ye files:

1. **backend/server.js** - Line 39: `origin: 'http://localhost:3000'`
2. **frontend/vite.config.js** - Line 11: `target: 'http://localhost:5000'`
3. **frontend/src/services/api.js** - Line 10: `baseURL: '/api'`
4. **backend/.env** - PORT=5000, FRONTEND_URL=http://localhost:3000

### Test Login Manually:

```bash
# PowerShell mein ye command run karein:
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@construction.com","password":"password123"}'
```

Expected response: `{"success":true,"data":{...}}`

---

## 🎯 Quick Fix Commands

```bash
# Backend restart
cd backend
npm run dev

# Frontend restart
cd frontend
npm run dev

# Browser
# Press Ctrl + Shift + R (hard refresh)
# Clear cookies: F12 → Application → Cookies → Delete all
```

---

## 📝 Login Credentials (Yaad Rakhein)

**Admin:**
- Email: `admin@construction.com`
- Password: `password123`

**Site Manager:**
- Email: `rajesh@construction.com`
- Password: `manager123`

---

**Agar phir bhi issue ho to backend aur frontend dono ke terminal ka screenshot share karein!** 📸
