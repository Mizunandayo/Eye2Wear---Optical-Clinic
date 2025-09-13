// Test script to verify profile picture validation
import mongoose from "mongoose";
import Patientdemographic from "./models/patientdemographic.js";
import dotenv from "dotenv";

// Fix for ES modules not having global process
const process = await import('process');

dotenv.config();

async function testProfilePictureValidation() {
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

    console.log(`\n🧪 Testing validation with patient ID: ${testPatient._id}`);

    // Test 1: Try to update with empty profile picture
    console.log("\n=== Test 1: Empty Profile Picture ===");
    try {
      await Patientdemographic.findByIdAndUpdate(
        testPatient._id,
        { patientprofilepicture: "" },
        { new: true, runValidators: true }
      );
      console.log("❌ Should have failed with empty profile picture");
    } catch (error) {
      console.log("✅ Correctly caught empty profile picture error:");
      console.log(`   Error: ${error.message}`);
    }

    // Test 2: Try to update with null profile picture
    console.log("\n=== Test 2: Null Profile Picture ===");
    try {
      await Patientdemographic.findByIdAndUpdate(
        testPatient._id,
        { patientprofilepicture: null },
        { new: true, runValidators: true }
      );
      console.log("❌ Should have failed with null profile picture");
    } catch (error) {
      console.log("✅ Correctly caught null profile picture error:");
      console.log(`   Error: ${error.message}`);
    }

    // Test 3: Try to update with whitespace-only profile picture
    console.log("\n=== Test 3: Whitespace-only Profile Picture ===");
    try {
      await Patientdemographic.findByIdAndUpdate(
        testPatient._id,
        { patientprofilepicture: "   " },
        { new: true, runValidators: true }
      );
      console.log("❌ Should have failed with whitespace-only profile picture");
    } catch (error) {
      console.log("✅ Correctly caught whitespace-only profile picture error:");
      console.log(`   Error: ${error.message}`);
    }

    // Test 4: Try to update with valid profile picture
    console.log("\n=== Test 4: Valid Profile Picture ===");
    try {
      const validProfilePicture = `valid-profile-${Date.now()}.jpg`;
      const result = await Patientdemographic.findByIdAndUpdate(
        testPatient._id,
        { patientprofilepicture: validProfilePicture },
        { new: true, runValidators: true }
      );
      console.log("✅ Successfully updated with valid profile picture:");
      console.log(`   New profile picture: ${result.patientprofilepicture}`);
    } catch (error) {
      console.log("❌ Unexpected error with valid profile picture:");
      console.log(`   Error: ${error.message}`);
    }

    // Test 5: Test with missing profile picture in update data
    console.log("\n=== Test 5: Missing Profile Picture Field ===");
    try {
      await Patientdemographic.findByIdAndUpdate(
        testPatient._id,
        { 
          patientfirstname: "Updated Name"
          // patientprofilepicture is intentionally missing
        },
        { new: true, runValidators: true }
      );
      console.log("✅ Update without profile picture field worked (field not required in partial updates)");
    } catch (error) {
      console.log("ℹ️ Update without profile picture field failed:");
      console.log(`   Error: ${error.message}`);
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  }
}

// Run the test
testProfilePictureValidation();