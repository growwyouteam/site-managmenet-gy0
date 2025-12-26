# Construction Site Management System

A full-stack web application for managing construction sites with two user roles: **Admin** and **Site Manager**.

## ⚠️ IMPORTANT WARNING

**This system uses IN-MEMORY session storage and data structures. All data will be LOST on server restart.**

This is intentional per project requirements. The system is designed for demonstration purposes.

## Features

### Admin Panel
- **Dashboard**: Overview of projects, site managers, labours, and expenses
- **Attendance**: View site manager attendance and manage salaries
- **Machines**: Manage equipment in 4 categories (Big Machines, Lab Equipment, Consumables, Equipment)
- **Stock**: Global stock management per site
- **Projects**: CRUD operations, project details, resource transfers
- **Vendors**: Vendor management, payments, material receipts
- **Expenses**: View and manage all expenses
- **Transfer**: Transfer labour, machines, and stock between sites
- **Accounts**: Capital, bank/cash transactions, P&L reports
- **Users**: Add/edit/deactivate site managers
- **Reports**: Generate downloadable reports (month-wise, project-wise, etc.)
- **Notifications**: Real-time notifications with sound alerts

### Site Manager Panel
- **Dashboard**: Personal overview and assigned projects
- **Attendance**: Mark attendance with live photo capture
- **Labour**: Enroll and manage labour
- **Labour Attendance**: Mark labour attendance with photos
- **Stock In**: Record material receipts from vendors with photos
- **Transfer**: Request resource transfers
- **Daily Report**: Submit morning/evening reports with photos
- **Gallery**: Upload progress photos
- **Expenses**: Add expense records with vouchers
- **Payment**: Pay labour charges
- **Notifications**: Receive admin notifications
- **Profile**: View personal details

## Tech Stack

### Backend
- Node.js + Express
- express-session (in-memory session storage)
- Socket.IO (real-time notifications)
- Multer (file uploads)
- express-validator (input validation)
- bcryptjs (password hashing)

### Frontend
- React 18 (functional components)
- React Router v6
- Axios (HTTP client)
- Socket.IO Client
- Vite (build tool)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Edit `.env` and set your values:
```
PORT=5000
SESSION_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:3000
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

## Default Credentials

### Admin
- **Email**: admin@construction.com
- **Password**: password123

### Site Manager
- **Email**: rajesh@construction.com
- **Password**: manager123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/projects` - List projects
- `POST /api/admin/projects` - Create project
- `GET /api/admin/machines` - List machines
- `POST /api/admin/machines` - Add machine
- `GET /api/admin/stocks` - List stocks
- `GET /api/admin/vendors` - List vendors
- `GET /api/admin/expenses` - List expenses
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create site manager
- `GET /api/admin/reports` - Generate reports
- `POST /api/admin/notifications` - Send notification

### Site Manager Endpoints
- `GET /api/site/dashboard` - Dashboard data
- `POST /api/site/attendance` - Mark attendance
- `POST /api/site/labours` - Enroll labour
- `POST /api/site/labour-attendance` - Mark labour attendance
- `POST /api/site/stock-in` - Add stock
- `POST /api/site/daily-report` - Submit report
- `POST /api/site/gallery` - Upload images
- `POST /api/site/expenses` - Add expense
- `POST /api/site/payment` - Pay labour
- `GET /api/site/notifications` - Get notifications

### File Upload
- `POST /api/upload` - Single file upload
- `POST /api/upload-multiple` - Multiple files upload

## Testing

### Test API with curl

```bash
# Health check
curl http://localhost:5000/api/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@construction.com","password":"password123"}' \
  -c cookies.txt

# Get dashboard (with session cookie)
curl http://localhost:5000/api/admin/dashboard -b cookies.txt
```

### Test Notifications

1. Login as admin and site manager in different browsers
2. Admin sends notification from Notifications page
3. Site manager receives real-time notification with sound

### Test File Upload

1. Use Camera component to capture live photo
2. Or upload file from device
3. Files stored in `/backend/uploads/` directory
4. Accessible via `http://localhost:5000/uploads/filename`

## Project Structure

```
construction-site-management/
├── backend/
│   ├── server.js              # Main server file
│   ├── db.js                  # In-memory database
│   ├── package.json
│   ├── .env.example
│   ├── controllers/           # Business logic
│   ├── routes/                # API routes
│   ├── middleware/            # Auth, validation, error handling
│   └── uploads/               # Uploaded files
│
└── frontend/
    ├── src/
    │   ├── main.jsx           # Entry point
    │   ├── App.jsx            # Main app component
    │   ├── context/           # Auth context
    │   ├── services/          # API & Socket services
    │   ├── components/        # Reusable components
    │   ├── pages/             # Page components
    │   │   ├── Admin/         # Admin pages
    │   │   └── SiteManager/   # Site manager pages
    │   └── styles/            # CSS files
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## How It Works

### Session Management
- Uses `express-session` with default MemoryStore
- Sessions stored in server memory (lost on restart)
- Session cookie sent with each request
- Frontend uses `withCredentials: true` for Axios

### Data Storage
- All data stored in `db.js` in-memory object
- Seed data created on server startup
- No database connection required

### Real-time Notifications
- Socket.IO connection established after login
- Server emits events when actions occur
- Frontend plays sound using Web Audio API
- Toast notification displayed

### File Uploads
- Multer middleware handles multipart/form-data
- Files saved to `/backend/uploads/` directory
- Express static middleware serves files
- Can also accept base64 encoded images

## Migrating to Persistent Storage

To migrate from in-memory to MongoDB:

### 1. Install MongoDB packages
```bash
npm install mongoose connect-mongo
```

### 2. Replace db.js with Mongoose models
```javascript
// Example: models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  // ... other fields
});

module.exports = mongoose.model('User', userSchema);
```

### 3. Update session store
```javascript
// server.js
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  })
}));
```

### 4. Update controllers
```javascript
// Replace: const user = db.users.find(...)
// With: const user = await User.findOne(...)
```

### 5. Add MongoDB connection
```javascript
// server.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));
```

## Security Notes

- Passwords hashed with bcryptjs
- Session secret should be changed in production
- CORS configured for specific origin
- Helmet.js for security headers
- Input validation with express-validator
- File upload size limits enforced
- Role-based access control middleware

## Limitations

1. **Data Loss**: All data lost on server restart
2. **Session Storage**: Sessions stored in memory (not scalable)
3. **File Storage**: Files stored locally (not cloud storage)
4. **No Database**: No persistent data storage
5. **Single Server**: Not designed for horizontal scaling

## Production Considerations

For production deployment:

1. Use MongoDB or PostgreSQL for data persistence
2. Use Redis or MongoDB for session storage
3. Use cloud storage (AWS S3, Cloudinary) for files
4. Add proper authentication (JWT + refresh tokens)
5. Implement rate limiting
6. Add logging (Winston, Morgan)
7. Use environment-specific configs
8. Add monitoring (PM2, New Relic)
9. Use HTTPS
10. Add backup strategies

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Camera not working
- Ensure HTTPS or localhost
- Grant camera permissions in browser
- Check browser console for errors

### Socket not connecting
- Check CORS settings
- Verify Socket.IO client/server versions match
- Check browser console for connection errors

### Session not persisting
- Ensure `withCredentials: true` in Axios
- Check cookie settings in browser
- Verify session secret is set

## License

MIT

## Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Remember**: This is a demonstration system with in-memory storage. Do not use in production without implementing persistent storage!
