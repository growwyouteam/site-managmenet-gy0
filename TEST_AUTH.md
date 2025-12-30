# Authentication Debug Steps

## Local Testing (अभी के लिए)

### 1. Browser Console में check करें:

**Login करने के बाद:**
```javascript
// Check if token is stored
localStorage.getItem('token')

// Should show something like: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Network Tab में check करें:

**Login Request (`/api/auth/login`):**
- Response में `token` field होना चाहिए
- Response example:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1..."
  }
}
```

**Me Request (`/api/auth/me`):**
- Request Headers में होना चाहिए:
```
Authorization: Bearer eyJhbGciOiJIUzI1...
```

---

## अगर Token नहीं दिख रहा:

### Quick Fix - Frontend को restart करें:

```bash
# Frontend terminal में Ctrl+C दबाएं
# फिर फिर से start करें:
npm run dev
```

### Browser Cache Clear करें:
1. Browser DevTools खोलें (F12)
2. Application Tab → Storage → Clear site data
3. Page refresh करें (Ctrl+Shift+R)

---

## अगर फिर भी redirect हो रहा है:

### Check करें कि backend JWT support कर रहा है:

**Test API directly:**
```bash
# PowerShell में:
curl http://localhost:5000/api/health
```

Should return: `{"success":true,"message":"Server is running..."}`

---

## Common Issues:

### Issue 1: "withCredentials: true" causing problems
**Solution:** JWT में cookies की जरूरत नहीं, Authorization header use होता है

### Issue 2: Token localStorage में save नहीं हो रहा
**Solution:** 
- Browser console errors check करें
- `localStorage.setItem('token', 'test')` manually try करें

### Issue 3: Authorization header नहीं जा रहा
**Solution:**
- Network tab में request headers check करें
- API interceptor properly set हो रहा है या नहीं

---

## Debug Commands:

**Browser Console में paste करें:**

```javascript
// Check current token
console.log('Token:', localStorage.getItem('token'));

// Check API base URL
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);

// Manually test login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@construction.com',
    password: 'password123'
  })
})
.then(r => r.json())
.then(data => {
  console.log('Login Response:', data);
  if(data.data.token) {
    localStorage.setItem('token', data.data.token);
    console.log('Token saved!');
  }
});
```

---

## Next Steps:

1. ✅ Browser console खोलें
2. ✅ Login करें
3. ✅ Check करें: `localStorage.getItem('token')`
4. ✅ Network tab में `/api/auth/me` request देखें
5. ✅ Authorization header check करें

**Mujhe batayein console में kya error aa raha hai!**
