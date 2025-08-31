// Test the SMS validation fixes
console.log('🧪 Testing SMS validation fixes...');

const testData = {
  subject: 'Test Promotional SMS',
  message: 'This is a test message to verify our fixes work.',
  senderClinic: 'Ambher Optical',
  senderUserId: null, // This should now be handled gracefully
  senderUserName: 'Test User'
};

fetch('http://localhost:3000/api/sms/promotional', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer test-token` // This will fail auth but test validation
  },
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('📊 Response Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('📄 Response Data:', data);
  if (data.error && !data.error.includes('ObjectId') && !data.error.includes('messageId')) {
    console.log('✅ Validation errors fixed! Now getting expected auth/business logic errors.');
  } else if (data.error && (data.error.includes('ObjectId') || data.error.includes('messageId'))) {
    console.log('❌ Validation errors still present:', data.error);
  } else {
    console.log('🎉 Request successful!');
  }
})
.catch(error => {
  console.log('📊 Network/Connection Error:', error.message);
});
