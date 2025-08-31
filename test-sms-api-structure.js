// Simple test to verify SMS endpoints structure
console.log('🧪 Testing SMS API structure...');

fetch('http://localhost:3000/api/sms', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('📊 SMS API Response Status:', response.status);
  if (response.status === 401) {
    console.log('✅ SMS API endpoint is accessible (requires auth)');
  }
  return response.json();
})
.then(data => {
  console.log('📄 SMS API Response Structure:', {
    hasData: !!data.data,
    hasSmsMessages: !!data.smsMessages,
    isArray: Array.isArray(data),
    keys: Object.keys(data)
  });
})
.catch(error => {
  if (error.message.includes('fetch')) {
    console.log('❌ Server not running on port 3000');
  } else {
    console.log('📊 API Error:', error.message);
  }
});
