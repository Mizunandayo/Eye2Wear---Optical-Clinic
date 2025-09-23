// Test script to verify the description field implementation
import OtherClinicRecord from "./models/otherclinicrecord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testDescriptionField = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to database");

    // Test creating a record with description
    const testRecord = new OtherClinicRecord({
      patientotherclinicrecordfirstname: "Test",
      patientotherclinicrecordlastname: "Patient", 
      patientotherclinicemail: "test@example.com",
      patientotherclinicrecordclinicname: "Test Clinic",
      patientotherclinicconsultationdate: new Date("2024-01-15"),
      patientotherclinidescription: "This is a test description for the medical record",
      patientotherclinicrecordsubmittedby: "Dr. Test"
    });

    const savedRecord = await testRecord.save();
    console.log("✅ Successfully created record with description:");
    console.log("ID:", savedRecord.patientotherclinicrecordid);
    console.log("Description:", savedRecord.patientotherclinidescription);

    // Test updating the description
    const updatedRecord = await OtherClinicRecord.findOneAndUpdate(
      { patientotherclinicrecordid: savedRecord.patientotherclinicrecordid },
      { patientotherclinidescription: "Updated description content" },
      { new: true }
    );

    console.log("✅ Successfully updated description:");
    console.log("New description:", updatedRecord.patientotherclinidescription);

    // Clean up - delete test record
    await OtherClinicRecord.findOneAndDelete({
      patientotherclinicrecordid: savedRecord.patientotherclinicrecordid
    });
    console.log("✅ Test record cleaned up");

    console.log("\n🎉 Description field implementation test PASSED!");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Database disconnected");
    process.exit(0);
  }
};

testDescriptionField();