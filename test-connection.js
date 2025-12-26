/**
 * Connection Test Script
 * Run this to check if backend is accessible
 */

const http = require('http');

console.log('🔍 Testing Backend Connection...\n');

// Test backend server
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/me',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log('✅ Backend is RUNNING!');
  console.log(`   Status Code: ${res.statusCode}`);
  console.log(`   Port: 5000`);
  console.log(`   URL: http://localhost:5000\n`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('   Response:', data);
    console.log('\n✅ Backend connection successful!');
    console.log('   Now start frontend: cd frontend && npm run dev\n');
  });
});

req.on('error', (error) => {
  console.log('❌ Backend is NOT RUNNING!');
  console.log(`   Error: ${error.message}\n`);
  console.log('📝 Solution:');
  console.log('   1. Open terminal');
  console.log('   2. cd backend');
  console.log('   3. npm run dev\n');
});

req.end();
