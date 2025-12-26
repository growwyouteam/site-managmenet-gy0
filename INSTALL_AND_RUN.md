# 🚀 Installation & Run Guide

## ⚡ Quick Start (Copy-Paste Commands)

### Step 1: Install Backend Dependencies
```powershell
cd backend
npm install
```

### Step 2: Install Frontend Dependencies (Including Tailwind)
```powershell
cd ../frontend
npm install
```

### Step 3: Start Backend Server
```powershell
# Terminal 1 - Backend
cd backend
npm run dev
```

**Wait for:** `✅ Server running on port 5000`

### Step 4: Start Frontend Server
```powershell
# Terminal 2 - Frontend (New Terminal)
cd frontend
npm run dev
```

**Wait for:** `➜ Local: http://localhost:3000/`

### Step 5: Open Browser
```
http://localhost:3000
```

**Login:**
- Admin: `admin@construction.com` / `password123`
- Site Manager: `rajesh@construction.com` / `manager123`

---

## 📱 Test Mobile View

1. Open `http://localhost:3000`
2. Press `F12` (DevTools)
3. Click device toolbar icon (or `Ctrl+Shift+M`)
4. Select "iPhone 12 Pro" or any mobile device
5. Test hamburger menu (top-left corner)

---

## ✅ What's New

### 1. Tailwind CSS Installed ✅
- Modern utility-first CSS framework
- Custom color theme
- Responsive breakpoints
- Mobile-first design

### 2. Mobile Hamburger Menu ✅
- Sidebar slides in from left
- Dark overlay
- Smooth animations
- Touch-friendly

### 3. Fully Responsive ✅
- Desktop: Full sidebar (240px)
- Tablet: Optimized layout
- Mobile: Hamburger menu

---

## 🐛 If Installation Fails

### Error: "Cannot find module"
```powershell
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```powershell
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use different port
# In backend/.env change PORT=5001
```

### Error: Tailwind not working
```powershell
# Clear Vite cache
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

## 📝 Verification Steps

### Backend Running:
```
✅ Server running on port 5000
✅ In-memory database initialized
✅ Sample data loaded
```

### Frontend Running:
```
✅ VITE v5.x.x ready
✅ Local: http://localhost:3000/
✅ Network: use --host to expose
```

### Browser:
```
✅ Login page loads
✅ No console errors (F12)
✅ Tailwind classes working
✅ Sidebar visible
✅ Hamburger menu on mobile
```

---

## 🎯 Next: Test All Features

After installation, test these:

### Admin Panel:
- [ ] Dashboard loads
- [ ] Can navigate all pages
- [ ] Machines page shows categories
- [ ] Can add/delete items
- [ ] Forms submit properly
- [ ] Tables display data

### Site Manager Panel:
- [ ] Dashboard loads
- [ ] Can mark attendance
- [ ] Camera works
- [ ] Can add labour
- [ ] Forms submit properly
- [ ] Notifications work

### Mobile:
- [ ] Hamburger menu works
- [ ] Sidebar slides in/out
- [ ] All pages responsive
- [ ] Buttons touchable
- [ ] Forms usable
- [ ] Tables scrollable

---

**Installation complete! Ab test karo sab features.** ✅
