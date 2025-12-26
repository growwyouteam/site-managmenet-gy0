# Backend Integration Complete Guide

## ✅ Changes Made

### 1. Frontend Updated to Use Backend API
- **AuthContext**: Now uses backend API for login/logout instead of mock users
- **Users Component**: Now uses backend API for CRUD operations
- All data now saves to backend database instead of sessionStorage

### 2. Backend API Endpoints Available

#### Authentication
- `POST /api/auth/login` - Login (email, password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

#### Admin Routes (require admin authentication)
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/vendors` - Get vendors
- `POST /api/admin/vendors` - Create vendor
- `GET /api/admin/expenses` - Get expenses
- `POST /api/admin/expenses` - Create expense
- And many more...

## 🚀 How to Run

### Step 1: Start Backend Server
```bash
cd backend
npm install
npm start
```
Backend will run on: http://localhost:5000

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:3000

## 🔐 Default Login Credentials

**Admin:**
- Email: admin@construction.com
- Password: password123

**Site Manager:**
- Email: rajesh@construction.com
- Password: manager123

## 📝 Important Notes

### Current Status:
- ✅ Backend API is ready and working
- ✅ Frontend AuthContext updated to use backend
- ✅ Users component updated to use backend
- ⚠️ Other components still using sessionStorage (need migration)

### Data Persistence:
- Backend uses **IN-MEMORY storage** (data lost on restart)
- To add real database (MongoDB):
  1. Install mongoose: `npm install mongoose`
  2. Replace `db.js` with Mongoose models
  3. Update controllers to use async/await with database

## 🔧 Next Steps to Complete Migration

### Components that need backend integration:
1. Dashboard.jsx
2. Projects.jsx
3. Vendors.jsx
4. Expenses.jsx
5. Machines.jsx
6. Stock.jsx
7. Attendance.jsx
8. Transfer.jsx
9. Accounts.jsx
10. Reports.jsx
11. Notifications.jsx
12. All SiteManager components

### Migration Pattern:
Replace this:
```javascript
import { getCollection, saveCollection } from '../../services/storage';
const data = getCollection('users', []);
```

With this:
```javascript
import api from '../../services/api';
const response = await api.get('/admin/users');
const data = response.data.data;
```

## 🐛 Troubleshooting

### Issue: "Network Error" or "Failed to fetch"
**Solution:** Make sure backend server is running on port 5000

### Issue: "401 Unauthorized"
**Solution:** Login again, session may have expired

### Issue: "CORS Error"
**Solution:** Backend CORS is configured for http://localhost:3000
Check `backend/server.js` CORS settings

### Issue: Data not persisting
**Solution:** Backend uses in-memory storage. Data will be lost on server restart.
For persistence, integrate MongoDB.

## 📦 Database Schema (Current In-Memory)

```javascript
db = {
  users: [],           // Admin & Site Managers
  projects: [],        // Construction projects
  labours: [],         // Workers
  machines: {},        // Equipment
  stocks: [],          // Materials
  vendors: [],         // Suppliers
  expenses: [],        // Expenses
  accounts: {},        // Financial data
  attendance: [],      // Attendance records
  dailyReports: [],    // Daily reports
  gallery: [],         // Photos
  notifications: [],   // Notifications
  transfers: [],       // Transfers
  payments: []         // Payments
}
```

## 🔄 API Response Format

All API responses follow this format:
```javascript
{
  success: true/false,
  data: {...},         // Response data
  error: "..."         // Error message (if failed)
}
```

## 📞 Need Help?

Check these files:
- Backend routes: `backend/routes/`
- Backend controllers: `backend/controllers/`
- Frontend API service: `frontend/src/services/api.js`
- Auth context: `frontend/src/context/AuthContext.jsx`
