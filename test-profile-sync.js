// Test script to verify profile picture synchronization between models
import mongoose from "mongoose";
import Patientdemographic from "./models/patientdemographic.js";
import Patientaccount from "./models/patientaccount.js";
import dotenv from "dotenv";

// Fix for ES modules not having global process
const process = await import('process');

dotenv.config();

async function testProfileSync() {
  try {
    // Connect to database
    await mongoose.connect(process.default.env.MONGO_URI);
    console.log("✅ Connected to database");

    // Find a real patient from your database
    const testPatient = await Patientdemographic.findOne({});
    if (!testPatient) {
      console.log("❌ No patients found in database. Please create a patient first.");
      return;
    }

    const testEmail = testPatient.patientemail;
    console.log(`\n🧪 Testing with patient: ${testEmail}`);

    // Test 1: Test save operation
    console.log("\n=== Test 1: Save Operation ===");
    const newProfilePicture1 = `test-profile-save-${Date.now()}.jpg`;
    
    const demographic = await Patientdemographic.findOne({ patientemail: testEmail });
    if (demographic) {
      demographic.patientprofilepicture = newProfilePicture1;
      await demographic.save();
      
      // Wait a moment for the middleware to execute
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if account was updated
      const account = await Patientaccount.findOne({ patientemail: testEmail });
      if (account && account.patientprofilepicture === newProfilePicture1) {
        console.log("✅ Save operation sync: SUCCESS");
      } else {
        console.log("❌ Save operation sync: FAILED");
        console.log(`Expected: ${newProfilePicture1}`);
        console.log(`Account has: ${account?.patientprofilepicture}`);
      }
    }

    // Test 2: Test findOneAndUpdate operation
    console.log("\n=== Test 2: FindOneAndUpdate Operation ===");
    const newProfilePicture2 = `test-profile-update-${Date.now()}.jpg`;
    
    await Patientdemographic.findOneAndUpdate(
      { patientemail: testEmail },
      { patientprofilepicture: newProfilePicture2 },
      { new: true }
    );
    
    // Wait a moment for the middleware to execute
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if account was updated
    const accountAfterUpdate = await Patientaccount.findOne({ patientemail: testEmail });
    if (accountAfterUpdate && accountAfterUpdate.patientprofilepicture === newProfilePicture2) {
      console.log("✅ FindOneAndUpdate sync: SUCCESS");
    } else {
      console.log("❌ FindOneAndUpdate sync: FAILED");
      console.log(`Expected: ${newProfilePicture2}`);
      console.log(`Account has: ${accountAfterUpdate?.patientprofilepicture}`);
    }

    // Test 3: Test updateOne operation
    console.log("\n=== Test 3: UpdateOne Operation ===");
    const newProfilePicture3 = `test-profile-updateone-${Date.now()}.jpg`;
    
    await Patientdemographic.updateOne(
      { patientemail: testEmail },
      { patientprofilepicture: newProfilePicture3 }
    );
    
    // Wait a moment for the middleware to execute
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if account was updated
    const accountAfterUpdateOne = await Patientaccount.findOne({ patientemail: testEmail });
    if (accountAfterUpdateOne && accountAfterUpdateOne.patientprofilepicture === newProfilePicture3) {
      console.log("✅ UpdateOne sync: SUCCESS");
    } else {
      console.log("❌ UpdateOne sync: FAILED");
      console.log(`Expected: ${newProfilePicture3}`);
      console.log(`Account has: ${accountAfterUpdateOne?.patientprofilepicture}`);
    }

    // Test 4: Manual sync function
    console.log("\n=== Test 4: Manual Sync Function ===");
    const syncResult = await Patientdemographic.syncProfilePicture(testEmail);
    console.log("Manual sync result:", syncResult);

    // Test 5: Current state verification
    console.log("\n=== Test 5: Final State Verification ===");
    const finalDemographic = await Patientdemographic.findOne({ patientemail: testEmail });
    const finalAccount = await Patientaccount.findOne({ patientemail: testEmail });
    
    console.log(`Demographic profile picture: ${finalDemographic?.patientprofilepicture}`);
    console.log(`Account profile picture: ${finalAccount?.patientprofilepicture}`);
    
    if (finalDemographic?.patientprofilepicture === finalAccount?.patientprofilepicture) {
      console.log("✅ Final state: SYNCHRONIZED");
    } else {
      console.log("❌ Final state: NOT SYNCHRONIZED");
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  }
}

// Run the test
testProfileSync();