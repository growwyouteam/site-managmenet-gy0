# Construction Site Management System - Setup Instructions

## ⚠️ CRITICAL WARNINGS

1. **IN-MEMORY STORAGE**: This system uses in-memory data structures and session storage. **ALL DATA WILL BE LOST ON SERVER RESTART**.
2. This is intentional per project requirements for demonstration purposes.
3. Do NOT use in production without implementing persistent storage (MongoDB/PostgreSQL).

---

## Quick Start Guide

### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start the server
npm run dev
```

**Backend will run on**: `http://localhost:5000`

### Step 2: Frontend Setup

Open a NEW terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run on**: `http://localhost:3000`

### Step 3: Access the Application

1. Open browser: `http://localhost:3000`
2. Use demo credentials to login:

**Admin Login:**
- Email: `admin@construction.com`
- Password: `password123`

**Site Manager Login:**
- Email: `rajesh@construction.com`
- Password: `manager123`

---

## Project Structure

```
construction-site-management/
├── backend/                    # Node.js + Express backend
│   ├── server.js              # Main server file
│   ├── db.js                  # In-memory database with seed data
│   ├── package.json
│   ├── .env.example
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── siteController.js
│   ├── routes/                # API routes
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── site.js
│   ├── middleware/            # Auth, validation, error handling
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validators.js
│   └── uploads/               # File uploads (auto-created)
│
└── frontend/                   # React frontend
    ├── src/
    │   ├── main.jsx           # Entry point
    │   ├── App.jsx            # Main app with routing
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   ├── api.js         # Axios instance
    │   │   └── socket.js      # Socket.IO client
    │   ├── components/
    │   │   ├── Toast.jsx
    │   │   ├── Camera.jsx
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Admin/         # 13 admin pages
    │   │   └── SiteManager/   # 12 site manager pages
    │   └── styles/
    │       └── App.css
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## Features Implemented

### Admin Features ✅
- Dashboard with summary cards
- Attendance management
- Machines (4 categories: Big Machines, Lab Equipment, Consumables, Equipment)
- Stock management per site
- Project CRUD with detail view
- Vendor management with payments
- Expense tracking
- Resource transfer (labour, machines, stock)
- Accounts & finance tracking
- User management (create/deactivate site managers)
- Reports generation (JSON download)
- Real-time notifications with sound

### Site Manager Features ✅
- Dashboard with quick actions
- Mark attendance with live photo
- Labour enrollment and management
- Labour attendance tracking
- Stock in (material receipt from vendors)
- Transfer requests
- Daily reports (morning/evening) with photos
- Gallery for progress photos
- Expense submission
- Labour payment processing
- Notifications from admin
- Profile view

---

## Technical Features

### Backend
- ✅ Session-based authentication (express-session)
- ✅ Role-based access control (admin/sitemanager)
- ✅ Input validation (express-validator)
- ✅ File uploads (Multer)
- ✅ Real-time notifications (Socket.IO)
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Password hashing (bcryptjs)

### Frontend
- ✅ React 18 with functional components
- ✅ React Router v6 for routing
- ✅ Context API for state management
- ✅ Axios for HTTP requests
- ✅ Socket.IO client for real-time updates
- ✅ Camera component for live photo capture
- ✅ Toast notifications
- ✅ Web Audio API for notification sounds
- ✅ Responsive design

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/projects` - List projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/projects/:id` - Project details
- `GET /api/admin/machines?category=big` - List machines
- `POST /api/admin/machines` - Add machine
- `GET /api/admin/stocks` - List stocks
- `POST /api/admin/stocks` - Add stock
- `GET /api/admin/vendors` - List vendors
- `POST /api/admin/vendors` - Create vendor
- `POST /api/admin/vendors/payment` - Record vendor payment
- `GET /api/admin/expenses` - List expenses
- `DELETE /api/admin/expenses/:id` - Delete expense
- `GET /api/admin/users` - List site managers
- `POST /api/admin/users` - Create site manager
- `DELETE /api/admin/users/:id` - Deactivate user
- `GET /api/admin/transfers` - List transfers
- `POST /api/admin/transfers` - Create transfer
- `GET /api/admin/accounts` - Accounts summary
- `GET /api/admin/reports?type=expenses&startDate=...&endDate=...` - Generate reports
- `GET /api/admin/notifications` - List notifications
- `POST /api/admin/notifications` - Send notification

### Site Manager Endpoints
- `GET /api/site/dashboard` - Dashboard data
- `POST /api/site/attendance` - Mark attendance
- `GET /api/site/attendance` - Get my attendance
- `GET /api/site/labours` - List labours
- `POST /api/site/labours` - Enroll labour
- `POST /api/site/labour-attendance` - Mark labour attendance
- `GET /api/site/labour-attendance` - Get labour attendance
- `POST /api/site/stock-in` - Add stock
- `GET /api/site/stocks` - Get stocks
- `POST /api/site/daily-report` - Submit daily report
- `GET /api/site/daily-reports` - Get reports
- `POST /api/site/gallery` - Upload images
- `GET /api/site/gallery` - Get gallery images
- `POST /api/site/expenses` - Add expense
- `GET /api/site/expenses` - Get expenses
- `POST /api/site/transfer` - Request transfer
- `GET /api/site/transfers` - Get transfers
- `POST /api/site/payment` - Pay labour
- `GET /api/site/payments` - Get payments
- `GET /api/site/notifications` - Get notifications
- `GET /api/site/profile` - Get profile
- `GET /api/site/vendors` - Get vendors (for dropdown)
- `GET /api/site/projects` - Get assigned projects

### File Upload
- `POST /api/upload` - Single file upload
- `POST /api/upload-multiple` - Multiple files upload
- `GET /uploads/:filename` - Access uploaded files

---

## Testing the Application

### 1. Test Admin Login
1. Go to `http://localhost:3000`
2. Click "Login as Admin" or enter credentials manually
3. You should see the admin dashboard

### 2. Test Site Manager Login
1. Logout from admin
2. Click "Login as Site Manager"
3. You should see the site manager dashboard

### 3. Test Real-time Notifications
1. Open two browser windows
2. Login as admin in one, site manager in another
3. Admin: Go to Notifications → Send notification to site manager
4. Site Manager: Should receive notification with sound

### 4. Test Camera Feature
1. Login as site manager
2. Go to Attendance
3. Click "Capture Photo"
4. Allow camera permissions
5. Capture photo and submit attendance

### 5. Test CRUD Operations
- **Admin**: Create project, add machines, enroll site managers
- **Site Manager**: Enroll labour, mark attendance, add expenses

---

## Troubleshooting

### Port Already in Use

**Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

### Camera Not Working
- Ensure you're using HTTPS or localhost
- Grant camera permissions in browser
- Check browser console for errors

### Socket.IO Not Connecting
- Check if backend is running on port 5000
- Verify CORS settings in `server.js`
- Check browser console for connection errors

### Session Not Persisting
- Ensure `withCredentials: true` in Axios config
- Check cookie settings in browser
- Verify session secret is set in `.env`

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## Migrating to Persistent Storage

### Step 1: Install MongoDB Packages
```bash
cd backend
npm install mongoose connect-mongo
```

### Step 2: Create Mongoose Models
Replace `db.js` with Mongoose models:

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'sitemanager'] },
  phone: String,
  salary: Number,
  assignedSites: [String],
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### Step 3: Update Session Store
```javascript
// server.js
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
```

### Step 4: Connect to MongoDB
```javascript
// server.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));
```

### Step 5: Update Controllers
Replace in-memory operations with Mongoose queries:

```javascript
// Before (in-memory)
const user = db.users.find(u => u.email === email);

// After (MongoDB)
const user = await User.findOne({ email });
```

---

## Production Deployment Checklist

- [ ] Use MongoDB for data persistence
- [ ] Use Redis/MongoDB for session storage
- [ ] Use cloud storage (AWS S3, Cloudinary) for files
- [ ] Implement JWT authentication with refresh tokens
- [ ] Add rate limiting
- [ ] Add logging (Winston, Morgan)
- [ ] Use environment-specific configs
- [ ] Add monitoring (PM2, New Relic)
- [ ] Use HTTPS
- [ ] Add backup strategies
- [ ] Implement proper error tracking (Sentry)
- [ ] Add API documentation (Swagger)
- [ ] Implement data validation on all endpoints
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline

---

## Support & Documentation

- **README.md**: Full project documentation
- **Backend Comments**: Every controller and route is commented
- **Frontend Comments**: Every component is documented
- **API Documentation**: See endpoints section above

---

## License

MIT

---

## Important Notes

1. **Data Loss**: Remember that all data is lost on server restart
2. **Development Only**: This setup is for development/demonstration
3. **Security**: Change session secret and passwords in production
4. **File Storage**: Files stored locally in `/uploads` folder
5. **Scalability**: Not designed for horizontal scaling

---

**Enjoy building with the Construction Site Management System!** 🏗️
