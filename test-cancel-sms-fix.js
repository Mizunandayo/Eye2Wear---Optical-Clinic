// Test the fixed cancel SMS functionality
import http from 'http';

function testCancelSMS() {
  console.log('🧪 TESTING FIXED CANCEL SMS');
  console.log('============================');
  
  const postData = JSON.stringify({
    appointmentId: '68cfcf2bfa12672fbc50e8a5',
    clinicType: 'ambher'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/sms/appointment-cancellation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(responseData);
        console.log('\n✅ RESPONSE:', JSON.stringify(result, null, 2));
        
        if (result.success) {
          console.log('\n🎯 FIXED CANCEL SMS ANALYSIS:');
          console.log('  Status:', result.message);
          console.log('  Message ID:', result.messageId);
          console.log('  iProg ID:', result.iprogMessageId);
          console.log('  \n📱 SMS should now be delivered to patient!');
          console.log('  \n🔍 Check server terminal for debugging logs');
        } else {
          console.log('\n❌ CANCEL SMS STILL FAILING:', result.message || result.error);
        }
      } catch (error) {
        console.log('\n❌ Failed to parse response:', responseData);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message);
    console.log('\n💡 Make sure server is running: node server.js');
  });

  req.write(postData);
  req.end();
}

console.log('🔧 CANCEL SMS FIX APPLIED');
console.log('=========================');
console.log('✅ Updated SMS controller to use clinic-specific email fields:');
console.log('  - Ambher: patientambherappointmentemail');
console.log('  - Bautista: patientbautistaappointmentemail');
console.log('✅ Added detailed logging for debugging');
console.log('✅ Enhanced error messages with email information');
console.log('\n🧪 Testing the fix...\n');

testCancelSMS();