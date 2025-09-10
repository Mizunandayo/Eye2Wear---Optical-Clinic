import dotenv from 'dotenv';
import iPragSMS from './utils/iprogSMS.js';
import process from 'process';

// Load environment variables
dotenv.config();

// Test clinic-specific SMS client functionality
async function testClinicSMSClients() {
  console.log('🧪 Testing Clinic-Specific SMS Clients...\n');

  // Test Ambher client
  console.log('📋 Testing Ambher Optical client:');
  const ambherClient = iPragSMS.createForAmbher();
  const ambherInfo = ambherClient.getProviderInfo();
  console.log('   Clinic:', ambherInfo.clinic);
  console.log('   Configured:', ambherInfo.configured);
  console.log('   API Token (first 10 chars):', ambherClient.apiToken ? ambherClient.apiToken.substring(0, 10) + '...' : 'None');

  // Test Bautista client
  console.log('\n📋 Testing Bautista Eye Center client:');
  const bautistaClient = iPragSMS.createForBautista();
  const bautistaInfo = bautistaClient.getProviderInfo();
  console.log('   Clinic:', bautistaInfo.clinic);
  console.log('   Configured:', bautistaInfo.configured);
  console.log('   API Token (first 10 chars):', bautistaClient.apiToken ? bautistaClient.apiToken.substring(0, 10) + '...' : 'None');

  // Test generic clinic client
  console.log('\n📋 Testing generic clinic client (Ambher):');
  const genericAmbherClient = iPragSMS.createForClinic('Ambher Optical');
  console.log('   API Token (first 10 chars):', genericAmbherClient.apiToken ? genericAmbherClient.apiToken.substring(0, 10) + '...' : 'None');

  console.log('\n📋 Testing generic clinic client (Bautista):');
  const genericBautistaClient = iPragSMS.createForClinic('Bautista Eye Center');
  console.log('   API Token (first 10 chars):', genericBautistaClient.apiToken ? genericBautistaClient.apiToken.substring(0, 10) + '...' : 'None');

  // Test unknown clinic
  console.log('\n📋 Testing unknown clinic client:');
  const unknownClient = iPragSMS.createForClinic('Unknown Clinic');
  console.log('   API Token (first 10 chars):', unknownClient.apiToken ? unknownClient.apiToken.substring(0, 10) + '...' : 'None');

  // Test environment variables
  console.log('\n🔧 Environment Variables:');
  console.log('   AMBHER_IPROG_API_TOKEN:', process.env.AMBHER_IPROG_API_TOKEN ? process.env.AMBHER_IPROG_API_TOKEN.substring(0, 10) + '...' : 'Not set');
  console.log('   BAUTISTA_IPROG_API_TOKEN:', process.env.BAUTISTA_IPROG_API_TOKEN ? process.env.BAUTISTA_IPROG_API_TOKEN.substring(0, 10) + '...' : 'Not set');

  console.log('\n✅ Clinic-specific SMS client test completed!');
}

// Run the test
testClinicSMSClients().catch(console.error);
