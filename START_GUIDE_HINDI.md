# 🚀 Construction Site Management System - Startup Guide (Hindi)

## ⚡ Quick Start (5 Minutes Mein)

### Step 1: Backend Start Karein (Terminal 1)

```bash
# Backend folder mein jaayein
cd backend

# Dependencies install karein (pehli baar)
npm install

# Server start karein
npm run dev
```

**✅ Success Message Dikhe To:**
```
✅ Server running on port 5000
✅ In-memory database initialized
✅ Sample data loaded
```

**❌ Agar Error Aaye:**
- Port already in use: `taskkill /PID <PID> /F`
- Module not found: `npm install` phir se run karein

---

### Step 2: Frontend Start Karein (Terminal 2 - Naya Terminal)

```bash
# Frontend folder mein jaayein
cd frontend

# Dependencies install karein (pehli baar)
npm install

# Development server start karein
npm run dev
```

**✅ Success Message Dikhe To:**
```
VITE ready in xxx ms
➜  Local:   http://localhost:3000/
```

---

### Step 3: Browser Mein Open Karein

1. Browser open karein (Chrome/Edge recommended)
2. Ye URL open karein: `http://localhost:3000`
3. Login page dikhega

---

### Step 4: Login Karein

**Admin Login:**
```
Email: admin@construction.com
Password: password123
```

**Site Manager Login:**
```
Email: rajesh@construction.com
Password: manager123
```

---

## 🔧 Agar Connection Issue Ho

### Test 1: Backend Check Karein
```bash
# Project root folder mein
node test-connection.js
```

### Test 2: Browser Console Check Karein
1. Browser mein F12 press karein
2. Console tab mein errors dekhein
3. Network tab mein API calls check karein

### Test 3: Ports Check Karein
```powershell
# PowerShell mein
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## 📁 File Structure

```
construction-site-management/
├── backend/              ← Terminal 1 yahaan se run karein
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend/             ← Terminal 2 yahaan se run karein
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

---

## 🎯 Important URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Test**: http://localhost:5000/api/auth/me

---

## ⚠️ Common Mistakes

1. ❌ **Dono terminals ek hi folder mein** → Backend aur frontend alag folders hain
2. ❌ **npm install nahi kiya** → Pehle `npm install` zaroor run karein
3. ❌ **Backend start nahi kiya** → Pehle backend, phir frontend start karein
4. ❌ **Wrong port** → Frontend: 3000, Backend: 5000

---

## ✅ Checklist

Ye sab check karein:

- [ ] Backend terminal mein "Server running on port 5000" dikha?
- [ ] Frontend terminal mein "Local: http://localhost:3000" dikha?
- [ ] Browser mein login page dikh raha hai?
- [ ] F12 press karne par console mein koi red error nahi?
- [ ] Login credentials sahi hain?

---

## 🆘 Help Commands

### Backend Restart:
```bash
# Backend terminal mein Ctrl+C press karein
# Phir:
npm run dev
```

### Frontend Restart:
```bash
# Frontend terminal mein Ctrl+C press karein
# Phir:
npm run dev
```

### Complete Reset:
```bash
# Backend
cd backend
rm -rf node_modules
npm install
npm run dev

# Frontend (naya terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📸 Screenshots Kahan Dekhein

Agar issue ho to ye screenshots lein:

1. **Backend Terminal** - Server start hone ka message
2. **Frontend Terminal** - Vite start hone ka message
3. **Browser Console (F12)** - Koi error hai to
4. **Browser Network Tab** - API calls fail ho rahe hain to

---

## 💡 Pro Tips

1. **Hamesha pehle backend start karein, phir frontend**
2. **Dono terminals ko open rakhein**
3. **Browser cache clear karein agar issue ho**: Ctrl + Shift + R
4. **Incognito mode use na karein** (session issues ho sakte hain)

---

## 🎉 Success!

Agar login ho gaya aur sidebar dikh raha hai to **CONGRATULATIONS!** 🎊

Ab aap:
- ✅ Admin panel use kar sakte hain
- ✅ Site Manager panel use kar sakte hain
- ✅ Sabhi features test kar sakte hain

---

**Happy Coding!** 🏗️💻
