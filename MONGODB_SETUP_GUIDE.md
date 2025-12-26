# 🗄️ MongoDB Database Setup Guide

## ✅ Kya Complete Ho Gaya

Backend ab **MongoDB database** use kar raha hai! Saara data permanently save hoga.

### Updated Components:
- ✅ MongoDB connection setup
- ✅ Mongoose models created (User, Project, Vendor, Expense, Labour)
- ✅ Controllers updated to use MongoDB
- ✅ Database seed script ready
- ✅ Server.js updated with MongoDB connection

---

## 🚀 Setup Instructions (Step by Step)

### Step 1: MongoDB Connection String Add Karo

Aapne already `.env` file mein MongoDB connection string add kar di hai. Verify karo:

```bash
# backend/.env file mein ye hona chahiye:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/construction-site
```

**MongoDB Atlas Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

### Step 2: Mongoose Install Karo

```bash
cd backend
npm install mongoose
```

### Step 3: Database Seed Karo (First Time Only)

Pehli baar database mein default users aur sample data create karne ke liye:

```bash
npm run seed
```

Ye create karega:
- ✅ Admin user (admin@construction.com / password123)
- ✅ Site Manager (rajesh@construction.com / manager123)
- ✅ Sample project
- ✅ Sample vendor
- ✅ Sample labour

### Step 4: Backend Server Start Karo

```bash
npm start
```

Ya development mode ke liye:
```bash
npm run dev
```

### Step 5: Frontend Start Karo (New Terminal)

```bash
cd frontend
npm run dev
```

---

## 📊 Database Structure

### Collections Created:

1. **users** - Admin aur Site Managers
   - name, email, password (hashed), role, phone, salary, etc.

2. **projects** - Construction projects
   - name, location, startDate, endDate, budget, status, assignedManager

3. **vendors** - Suppliers
   - name, contact, email, address, pendingAmount, totalSupplied

4. **expenses** - Project expenses
   - projectId, name, amount, category, voucherNumber, remarks

5. **labours** - Workers
   - name, phone, dailyWage, designation, assignedSite

---

## 🔐 Login Credentials

**Admin:**
- Email: `admin@construction.com`
- Password: `password123`

**Site Manager:**
- Email: `rajesh@construction.com`
- Password: `manager123`

---

## ✨ Features

### Data Persistence:
- ✅ Data permanently saved in MongoDB
- ✅ Server restart karne par bhi data safe rahega
- ✅ Password hashing with bcrypt
- ✅ Auto-generated IDs (userId, vendorId)
- ✅ Timestamps (createdAt, updatedAt)

### Working Features:
- ✅ Login/Logout with MongoDB
- ✅ Users CRUD (Create, Read, Update, Delete)
- ✅ Projects CRUD
- ✅ Vendors CRUD
- ✅ Expenses CRUD
- ✅ Dashboard with real-time stats
- ✅ Password visibility toggle
- ✅ Table action buttons (View, Edit, Delete)

---

## 🧪 Testing

### 1. Database Connection Test
```bash
cd backend
npm start
```

Console mein ye dikhna chahiye:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database: construction-site
🚀 Server running on port 5000
```

### 2. Create User Test
1. Frontend kholo: http://localhost:3000
2. Admin se login karo
3. Users page par jao
4. Naya user create karo
5. MongoDB Atlas dashboard mein check karo - user save hona chahiye

### 3. Data Persistence Test
1. User create karo
2. Backend server stop karo (Ctrl+C)
3. Server phir se start karo
4. Login karke check karo - user abhi bhi hona chahiye ✅

---

## 📁 File Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Project.js           # Project model
│   ├── Vendor.js            # Vendor model
│   ├── Expense.js           # Expense model
│   ├── Labour.js            # Labour model
│   └── index.js             # Export all models
├── controllers/
│   ├── authController.js    # Updated for MongoDB
│   ├── adminController.js   # Updated for MongoDB
│   └── adminController.old.js # Backup (in-memory version)
├── scripts/
│   └── seedDatabase.js      # Database seed script
├── .env                     # MongoDB connection string
└── server.js                # Updated with MongoDB connection
```

---

## 🐛 Troubleshooting

### Issue 1: "MongooseError: The `uri` parameter to `openUri()` must be a string"
**Solution:** 
- `.env` file mein `MONGODB_URI` properly set hai ya nahi check karo
- Connection string mein username/password correct hai

### Issue 2: "MongoNetworkError: failed to connect"
**Solution:**
- Internet connection check karo
- MongoDB Atlas mein IP whitelist check karo (0.0.0.0/0 allow karo)
- Connection string correct hai verify karo

### Issue 3: "Authentication failed"
**Solution:**
- MongoDB Atlas username/password correct hai check karo
- Special characters ko URL encode karo (% symbols)

### Issue 4: Database seed nahi ho raha
**Solution:**
```bash
# Manually seed karo:
cd backend
node scripts/seedDatabase.js
```

### Issue 5: "User already exists" error
**Solution:**
- Ye normal hai agar seed script dobara run karo
- Users already create ho chuke hain
- Directly login kar sakte ho

---

## 🔄 Migration from In-Memory to MongoDB

### What Changed:
1. ❌ `db.js` (in-memory) → ✅ Mongoose models
2. ❌ `db.users.find()` → ✅ `User.find()`
3. ❌ `db.projects.push()` → ✅ `new Project().save()`
4. ❌ Data lost on restart → ✅ Permanent storage

### Backup:
- Old in-memory controller: `adminController.old.js`
- Agar koi issue ho to restore kar sakte ho

---

## 📊 MongoDB Atlas Dashboard

### View Your Data:
1. MongoDB Atlas login karo
2. Cluster → Browse Collections
3. Database: `construction-site`
4. Collections dekho:
   - users
   - projects
   - vendors
   - expenses
   - labours

---

## 🎯 Next Steps

1. ✅ Mongoose install karo: `npm install mongoose`
2. ✅ Database seed karo: `npm run seed`
3. ✅ Backend start karo: `npm start`
4. ✅ Frontend start karo: `npm run dev`
5. ✅ Login karke test karo
6. ✅ User create karke data persistence verify karo

---

## 📞 Commands Summary

```bash
# Backend setup
cd backend
npm install mongoose
npm run seed              # First time only
npm start                 # Production
npm run dev               # Development with auto-reload

# Frontend
cd frontend
npm run dev

# Database seed (if needed again)
cd backend
npm run seed
```

---

## ✅ Success Indicators

Sab kuch sahi hai agar:
- ✅ Console mein "MongoDB Connected" dikhe
- ✅ Login successful ho
- ✅ User create ho jaye
- ✅ Server restart ke baad bhi data rahe
- ✅ MongoDB Atlas dashboard mein data dikhe

---

**🎉 Congratulations! Aapka backend ab MongoDB se connected hai!**

Data ab permanently save hoga. Server restart karne par bhi data safe rahega.
