// Quick test script to verify announcement API endpoints

const API_BASE = 'http://localhost:3000';

// Test 1: Get all announcements (should work with valid token)
async function testGetAnnouncements() {
    console.log('🧪 Testing GET /announcements/all...');

    // You'll need to replace this with a real token from your login
    const token = 'YOUR_JWT_TOKEN_HERE';

    try {
        const response = await fetch(`${API_BASE}/announcements/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log('✅ GET Response:', result);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Test 2: Get announcement count
async function testGetCount() {
    console.log('\n🧪 Testing GET /announcements/count...');

    const token = 'YOUR_JWT_TOKEN_HERE';

    try {
        const response = await fetch(`${API_BASE}/announcements/count`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log('✅ Count Response:', result);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Instructions
console.log(`
📋 ANNOUNCEMENT API TEST INSTRUCTIONS:

1. Login to your application (student or faculty)
2. Open browser DevTools (F12)
3. Go to Application/Storage → Local Storage
4. Copy the 'token' value
5. Replace 'YOUR_JWT_TOKEN_HERE' in this file with your token
6. Run: node backend/test_announcements.js

OR test directly in browser console:
- Login to the dashboard
- Open DevTools Console (F12)
- Run the fetch commands directly (token is already in localStorage)

Example browser console test:
---------------------------------
const token = localStorage.getItem('token');
fetch('http://localhost:3000/announcements/all', {
    headers: { 'Authorization': \`Bearer \${token}\` }
}).then(r => r.json()).then(console.log);
`);

// Uncomment to run tests (after adding your token)
// testGetAnnouncements();
// testGetCount();
