/**
 * Test script to verify patient data synchronization between models
 * Tests the automatic sync of firstname, lastname, middlename, and profile picture
 * across PatientDemographic, PatientAccount, and PatientAppointment models
 */

/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patientdemographic from './models/patientdemographic.js';
import Patientaccount from './models/patientaccount.js';
import PatientAppointment from './models/patientappointment.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for testing');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test data
const testPatientEmail = 'test.sync@example.com';
const originalData = {
  patientemail: testPatientEmail,
  patientlastname: 'OriginalLast',
  patientfirstname: 'OriginalFirst',
  patientmiddlename: 'OriginalMiddle',
  patientprofilepicture: 'original-profile.jpg',
  patientage: '25',
  patientbirthdate: '1998-01-01',
  patientgender: 'Male',
  patientcontactnumber: '+1234567890',
  patienthomeaddress: '123 Test Street',
  patientemergencycontactname: 'Emergency Contact',
  patientemergencycontactnumber: '+0987654321'
};

const updatedData = {
  patientlastname: 'UpdatedLast',
  patientfirstname: 'UpdatedFirst',
  patientmiddlename: 'UpdatedMiddle',
  patientprofilepicture: 'updated-profile.jpg'
};

// Clean up test data
const cleanupTestData = async () => {
  try {
    await Patientdemographic.deleteMany({ patientemail: testPatientEmail });
    await Patientaccount.deleteMany({ patientemail: testPatientEmail });
    await PatientAppointment.deleteMany({ patientappointmentemail: testPatientEmail });
    console.log('🧹 Cleaned up test data');
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
};

// Create test patient account
const createTestPatientAccount = async () => {
  try {
    const patientAccount = new Patientaccount({
      patientemail: testPatientEmail,
      patientpassword: 'testpassword123',
      patientlastname: originalData.patientlastname,
      patientfirstname: originalData.patientfirstname,
      patientmiddlename: originalData.patientmiddlename,
      patientprofilepicture: originalData.patientprofilepicture,
      role: 'patient'
    });
    
    await patientAccount.save();
    console.log('✅ Created test patient account');
    return patientAccount;
  } catch (error) {
    console.error('❌ Error creating test patient account:', error);
    throw error;
  }
};

// Create test patient appointment
const createTestPatientAppointment = async () => {
  try {
    const appointment = new PatientAppointment({
      patientappointmentemail: testPatientEmail,
      patientappointmentlastname: originalData.patientlastname,
      patientappointmentfirstname: originalData.patientfirstname,
      patientappointmentmiddlename: originalData.patientmiddlename,
      patientappointmentprofilepicture: originalData.patientprofilepicture,
      patientappointmentstatus: 'Pending',
      patientambherappointmentdate: '2024-01-15',
      patientambherappointmenttime: '10:00 AM'
    });
    
    await appointment.save();
    console.log('✅ Created test patient appointment');
    return appointment;
  } catch (error) {
    console.error('❌ Error creating test patient appointment:', error);
    throw error;
  }
};

// Test sync via save operation
const testSyncViaSave = async () => {
  console.log('\n🧪 Testing sync via save operation...');
  
  try {
    // Create demographic record
    const demographic = new Patientdemographic(originalData);
    await demographic.save();
    console.log('✅ Created patient demographic');
    
    // Wait a moment for sync to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the demographic
    demographic.patientlastname = updatedData.patientlastname;
    demographic.patientfirstname = updatedData.patientfirstname;
    demographic.patientmiddlename = updatedData.patientmiddlename;
    demographic.patientprofilepicture = updatedData.patientprofilepicture;
    
    await demographic.save();
    console.log('✅ Updated patient demographic via save');
    
    // Wait for sync to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if account was synced
    const syncedAccount = await Patientaccount.findOne({ patientemail: testPatientEmail });
    if (syncedAccount) {
      console.log('📋 Patient Account sync status:');
      console.log(`   Last name: ${syncedAccount.patientlastname} (expected: ${updatedData.patientlastname})`);
      console.log(`   First name: ${syncedAccount.patientfirstname} (expected: ${updatedData.patientfirstname})`);
      console.log(`   Middle name: ${syncedAccount.patientmiddlename} (expected: ${updatedData.patientmiddlename})`);
      console.log(`   Profile picture: ${syncedAccount.patientprofilepicture} (expected: ${updatedData.patientprofilepicture})`);
      
      const accountSynced = syncedAccount.patientlastname === updatedData.patientlastname &&
                           syncedAccount.patientfirstname === updatedData.patientfirstname &&
                           syncedAccount.patientmiddlename === updatedData.patientmiddlename &&
                           syncedAccount.patientprofilepicture === updatedData.patientprofilepicture;
      
      console.log(accountSynced ? '✅ Patient Account sync: SUCCESS' : '❌ Patient Account sync: FAILED');
    } else {
      console.log('❌ Patient Account not found');
    }
    
    // Check if appointment was synced
    const syncedAppointment = await PatientAppointment.findOne({ patientappointmentemail: testPatientEmail });
    if (syncedAppointment) {
      console.log('📋 Patient Appointment sync status:');
      console.log(`   Last name: ${syncedAppointment.patientappointmentlastname} (expected: ${updatedData.patientlastname})`);
      console.log(`   First name: ${syncedAppointment.patientappointmentfirstname} (expected: ${updatedData.patientfirstname})`);
      console.log(`   Middle name: ${syncedAppointment.patientappointmentmiddlename} (expected: ${updatedData.patientmiddlename})`);
      console.log(`   Profile picture: ${syncedAppointment.patientappointmentprofilepicture} (expected: ${updatedData.patientprofilepicture})`);
      
      const appointmentSynced = syncedAppointment.patientappointmentlastname === updatedData.patientlastname &&
                               syncedAppointment.patientappointmentfirstname === updatedData.patientfirstname &&
                               syncedAppointment.patientappointmentmiddlename === updatedData.patientmiddlename &&
                               syncedAppointment.patientappointmentprofilepicture === updatedData.patientprofilepicture;
      
      console.log(appointmentSynced ? '✅ Patient Appointment sync: SUCCESS' : '❌ Patient Appointment sync: FAILED');
    } else {
      console.log('❌ Patient Appointment not found');
    }
    
  } catch (error) {
    console.error('❌ Error in save sync test:', error);
  }
};

// Test sync via findOneAndUpdate operation
const testSyncViaUpdate = async () => {
  console.log('\n🧪 Testing sync via findOneAndUpdate...');
  
  try {
    // Reset data first
    await Patientdemographic.findOneAndUpdate(
      { patientemail: testPatientEmail },
      { 
        patientlastname: originalData.patientlastname,
        patientfirstname: originalData.patientfirstname,
        patientmiddlename: originalData.patientmiddlename,
        patientprofilepicture: originalData.patientprofilepicture
      },
      { new: true }
    );
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update via findOneAndUpdate
    await Patientdemographic.findOneAndUpdate(
      { patientemail: testPatientEmail },
      { 
        patientlastname: 'UpdatedViaFind',
        patientfirstname: 'UpdatedViaFind',
        patientmiddlename: 'UpdatedViaFind',
        patientprofilepicture: 'updated-via-find.jpg'
      },
      { new: true }
    );
    
    console.log('✅ Updated patient demographic via findOneAndUpdate');
    
    // Wait for sync to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check sync results
    const syncedAccount = await Patientaccount.findOne({ patientemail: testPatientEmail });
    const syncedAppointment = await PatientAppointment.findOne({ patientappointmentemail: testPatientEmail });
    
    if (syncedAccount) {
      const accountSynced = syncedAccount.patientlastname === 'UpdatedViaFind' &&
                           syncedAccount.patientfirstname === 'UpdatedViaFind' &&
                           syncedAccount.patientmiddlename === 'UpdatedViaFind' &&
                           syncedAccount.patientprofilepicture === 'updated-via-find.jpg';
      
      console.log(accountSynced ? '✅ Account sync via update: SUCCESS' : '❌ Account sync via update: FAILED');
    }
    
    if (syncedAppointment) {
      const appointmentSynced = syncedAppointment.patientappointmentlastname === 'UpdatedViaFind' &&
                               syncedAppointment.patientappointmentfirstname === 'UpdatedViaFind' &&
                               syncedAppointment.patientappointmentmiddlename === 'UpdatedViaFind' &&
                               syncedAppointment.patientappointmentprofilepicture === 'updated-via-find.jpg';
      
      console.log(appointmentSynced ? '✅ Appointment sync via update: SUCCESS' : '❌ Appointment sync via update: FAILED');
    }
    
  } catch (error) {
    console.error('❌ Error in update sync test:', error);
  }
};

// Test the manual sync function
const testManualSync = async () => {
  console.log('\n🧪 Testing manual sync function...');
  
  try {
    // Use the static sync method
    const result = await Patientdemographic.syncProfilePicture(testPatientEmail);
    console.log('📋 Manual sync result:', result);
    
    if (result.success) {
      console.log('✅ Manual sync: SUCCESS');
    } else {
      console.log('❌ Manual sync: FAILED');
    }
    
  } catch (error) {
    console.error('❌ Error in manual sync test:', error);
  }
};

// Main test function
const runTests = async () => {
  try {
    console.log('🚀 Starting Patient Data Synchronization Tests');
    console.log('=' * 50);
    
    // Connect to database
    await connectDB();
    
    // Clean up any existing test data
    await cleanupTestData();
    
    // Create test patient account and appointment
    await createTestPatientAccount();
    await createTestPatientAppointment();
    
    // Run tests
    await testSyncViaSave();
    await testSyncViaUpdate();
    await testManualSync();
    
    // Cleanup
    await cleanupTestData();
    
    console.log('\n🎉 All tests completed!');
    console.log('=' * 50);
    
  } catch (error) {
    console.error('❌ Test execution error:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the tests
runTests();