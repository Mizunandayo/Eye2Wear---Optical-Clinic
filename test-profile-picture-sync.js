/* eslint-disable no-undef */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Patientdemographic from "./models/patientdemographic.js";
import PatientAppointment from "./models/patientappointment.js";
import Patientaccount from "./models/patientaccount.js";

dotenv.config();

// Test Profile Picture and Name Fields Synchronization
async function testDataSynchronization() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to database");

        // Test email for the sync test
        const testEmail = "test.sync@example.com";
        const oldProfilePicture = "old-profile-picture-url.jpg";
        const newProfilePicture = "new-profile-picture-url.jpg";
        
        const oldFirstName = "OldFirstName";
        const oldLastName = "OldLastName";
        const oldMiddleName = "OldMiddleName";
        
        const newFirstName = "NewFirstName";
        const newLastName = "NewLastName";
        const newMiddleName = "NewMiddleName";

        console.log("\n🧪 Testing Profile Picture and Name Fields Synchronization");
        console.log("=" .repeat(80));

        // Step 1: Clean up any existing test data
        console.log("\n1. Cleaning up existing test data...");
        await Patientaccount.deleteMany({ patientemail: testEmail });
        await Patientdemographic.deleteMany({ patientemail: testEmail });
        await PatientAppointment.deleteMany({ patientappointmentemail: testEmail });
        console.log("✅ Test data cleaned up");

        // Step 2: Create a test patient account
        console.log("\n2. Creating test patient account...");
        const testAccount = new Patientaccount({
            patientemail: testEmail,
            patientpassword: "testpassword123",
            patientlastname: oldLastName,
            patientfirstname: oldFirstName,
            patientmiddlename: oldMiddleName,
            patientprofilepicture: oldProfilePicture,
            role: "patient",
            isVerified: true
        });
        await testAccount.save();
        console.log("✅ Test patient account created");

        // Step 3: Create a test demographic record
        console.log("\n3. Creating test demographic record...");
        const testDemographic = new Patientdemographic({
            patientemail: testEmail,
            patientlastname: oldLastName,
            patientfirstname: oldFirstName,
            patientmiddlename: oldMiddleName,
            patientage: "25",
            patientbirthdate: "1999-01-01",
            patientgender: "Male",
            patientcontactnumber: "1234567890",
            patienthomeaddress: "Test Address",
            patientemergencycontactname: "Emergency Contact",
            patientemergencycontactnumber: "0987654321",
            patientprofilepicture: oldProfilePicture,
            role: "patient",
            isVerified: true
        });
        await testDemographic.save();
        console.log("✅ Test demographic record created");

        // Step 4: Create test appointments
        console.log("\n4. Creating test appointments...");
        const testAppointment1 = new PatientAppointment({
            patientappointmentlastname: oldLastName,
            patientappointmentfirstname: oldFirstName,
            patientappointmentmiddlename: oldMiddleName,
            patientappointmentemail: testEmail,
            patientappointmentprofilepicture: oldProfilePicture,
            patientambherappointmentdate: "2024-01-15",
            patientambherappointmenttime: "10:00",
            patientambherappointmentlocation: "Main Clinic"
        });

        const testAppointment2 = new PatientAppointment({
            patientappointmentlastname: oldLastName,
            patientappointmentfirstname: oldFirstName,
            patientappointmentmiddlename: oldMiddleName,
            patientappointmentemail: testEmail,
            patientappointmentprofilepicture: oldProfilePicture,
            patientbautistaappointmentdate: "2024-01-20",
            patientbautistaappointmenttime: "14:00",
            patientbautistaappointmentlocation: "Branch Clinic"
        });

        await testAppointment1.save();
        await testAppointment2.save();
        console.log("✅ Test appointments created");

        // Step 5: Verify initial state
        console.log("\n5. Verifying initial state...");
        const initialAccount = await Patientaccount.findOne({ patientemail: testEmail });
        const initialDemographic = await Patientdemographic.findOne({ patientemail: testEmail });
        const initialAppointments = await PatientAppointment.find({ patientappointmentemail: testEmail });

        console.log(`   Account: ${initialAccount.patientfirstname} ${initialAccount.patientlastname} | ${initialAccount.patientprofilepicture}`);
        console.log(`   Demographic: ${initialDemographic.patientfirstname} ${initialDemographic.patientlastname} | ${initialDemographic.patientprofilepicture}`);
        console.log(`   Appointment 1: ${initialAppointments[0].patientappointmentfirstname} ${initialAppointments[0].patientappointmentlastname} | ${initialAppointments[0].patientappointmentprofilepicture}`);
        console.log(`   Appointment 2: ${initialAppointments[1].patientappointmentfirstname} ${initialAppointments[1].patientappointmentlastname} | ${initialAppointments[1].patientappointmentprofilepicture}`);

        // Step 6: Test Profile Picture Update Only
        console.log("\n6. Testing Profile Picture Update Only...");
        console.log(`   Changing profile picture from: ${oldProfilePicture} to: ${newProfilePicture}`);
        
        await Patientdemographic.findOneAndUpdate(
            { patientemail: testEmail },
            { patientprofilepicture: newProfilePicture },
            { new: true }
        );
        console.log("✅ Profile picture updated");

        // Wait for sync
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify profile picture sync
        const updatedAccount = await Patientaccount.findOne({ patientemail: testEmail });
        const updatedAppointments = await PatientAppointment.find({ patientappointmentemail: testEmail });

        console.log("   Results after profile picture update:");
        console.log(`   Account profile picture: ${updatedAccount.patientprofilepicture} (should be ${newProfilePicture})`);
        console.log(`   Account name: ${updatedAccount.patientfirstname} ${updatedAccount.patientlastname} (should remain ${oldFirstName} ${oldLastName})`);
        console.log(`   Appointment 1 profile picture: ${updatedAppointments[0].patientappointmentprofilepicture} (should be ${newProfilePicture})`);
        console.log(`   Appointment 1 name: ${updatedAppointments[0].patientappointmentfirstname} ${updatedAppointments[0].patientappointmentlastname} (should remain ${oldFirstName} ${oldLastName})`);

        // Step 7: Test Name Fields Update Only
        console.log("\n7. Testing Name Fields Update Only...");
        console.log(`   Changing name from: ${oldFirstName} ${oldLastName} to: ${newFirstName} ${newLastName}`);
        
        await Patientdemographic.findOneAndUpdate(
            { patientemail: testEmail },
            { 
                patientfirstname: newFirstName,
                patientlastname: newLastName,
                patientmiddlename: newMiddleName
            },
            { new: true }
        );
        console.log("✅ Name fields updated");

        // Wait for sync
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify name sync
        const nameUpdatedAccount = await Patientaccount.findOne({ patientemail: testEmail });
        const nameUpdatedAppointments = await PatientAppointment.find({ patientappointmentemail: testEmail });

        console.log("   Results after name update:");
        console.log(`   Account name: ${nameUpdatedAccount.patientfirstname} ${nameUpdatedAccount.patientlastname} (should be ${newFirstName} ${newLastName})`);
        console.log(`   Account profile picture: ${nameUpdatedAccount.patientprofilepicture} (should remain ${newProfilePicture})`);
        console.log(`   Appointment 1 name: ${nameUpdatedAppointments[0].patientappointmentfirstname} ${nameUpdatedAppointments[0].patientappointmentlastname} (should be ${newFirstName} ${newLastName})`);
        console.log(`   Appointment 1 profile picture: ${nameUpdatedAppointments[0].patientappointmentprofilepicture} (should remain ${newProfilePicture})`);

        // Step 8: Final Validation
        console.log("\n8. Final Validation Results:");
        console.log("=" .repeat(50));
        
        // Check final state
        const finalAccount = await Patientaccount.findOne({ patientemail: testEmail });
        const finalDemographic = await Patientdemographic.findOne({ patientemail: testEmail });
        const finalAppointments = await PatientAppointment.find({ patientappointmentemail: testEmail });

        // Validate all fields are synchronized
        const tests = [
            {
                name: "Demographic profile picture updated",
                result: finalDemographic.patientprofilepicture === newProfilePicture
            },
            {
                name: "Demographic name updated",
                result: finalDemographic.patientfirstname === newFirstName && finalDemographic.patientlastname === newLastName
            },
            {
                name: "Account profile picture synced",
                result: finalAccount.patientprofilepicture === newProfilePicture
            },
            {
                name: "Account name synced",
                result: finalAccount.patientfirstname === newFirstName && finalAccount.patientlastname === newLastName
            },
            {
                name: "Appointment 1 profile picture synced",
                result: finalAppointments[0].patientappointmentprofilepicture === newProfilePicture
            },
            {
                name: "Appointment 1 name synced",
                result: finalAppointments[0].patientappointmentfirstname === newFirstName && finalAppointments[0].patientappointmentlastname === newLastName
            },
            {
                name: "Appointment 2 profile picture synced",
                result: finalAppointments[1].patientappointmentprofilepicture === newProfilePicture
            },
            {
                name: "Appointment 2 name synced",
                result: finalAppointments[1].patientappointmentfirstname === newFirstName && finalAppointments[1].patientappointmentlastname === newLastName
            }
        ];

        let passedTests = 0;
        for (const test of tests) {
            const status = test.result ? "PASS" : "FAIL";
            console.log(`   ✅ ${test.name}: ${status}`);
            if (test.result) passedTests++;
        }

        console.log("\n" + "=" .repeat(80));
        if (passedTests === tests.length) {
            console.log("🎉 ALL TESTS PASSED! Profile picture and name synchronization is working correctly.");
        } else {
            console.log(`❌ ${tests.length - passedTests} TESTS FAILED! Please check the synchronization logic.`);
        }
        console.log("=" .repeat(80));

        // Step 9: Test Static Sync Method
        console.log("\n🧪 Testing Static Sync Method");
        console.log("=" .repeat(50));
        
        // Create a test record for static method test
        const staticTestEmail = "static.test@example.com";
        const staticTestDemographic = new Patientdemographic({
            patientemail: staticTestEmail,
            patientlastname: "StaticLast",
            patientfirstname: "StaticFirst",
            patientmiddlename: "StaticMiddle",
            patientage: "30",
            patientbirthdate: "1994-01-01",
            patientgender: "Female",
            patientcontactnumber: "1111111111",
            patienthomeaddress: "Static Address",
            patientemergencycontactname: "Static Emergency",
            patientemergencycontactnumber: "2222222222",
            patientprofilepicture: "static-test-profile.jpg",
            role: "patient",
            isVerified: true
        });
        await staticTestDemographic.save();

        const staticTestAppointment = new PatientAppointment({
            patientappointmentlastname: "OldStaticLast",
            patientappointmentfirstname: "OldStaticFirst",
            patientappointmentmiddlename: "OldStaticMiddle",
            patientappointmentemail: staticTestEmail,
            patientappointmentprofilepicture: "old-static-profile.jpg",
            patientambherappointmentdate: "2024-02-15",
            patientambherappointmenttime: "11:00"
        });
        await staticTestAppointment.save();

        console.log("Testing static sync method...");
        const syncResult = await Patientdemographic.syncProfilePicture(staticTestEmail);
        console.log(`Sync result: ${syncResult.message}`);

        // Verify static method worked
        const staticUpdatedAppointment = await PatientAppointment.findOne({ patientappointmentemail: staticTestEmail });
        const staticMethodProfileWorked = staticUpdatedAppointment.patientappointmentprofilepicture === "static-test-profile.jpg";
        const staticMethodNameWorked = staticUpdatedAppointment.patientappointmentfirstname === "StaticFirst" && 
                                     staticUpdatedAppointment.patientappointmentlastname === "StaticLast";
        
        console.log(`Static method profile picture test: ${staticMethodProfileWorked ? 'PASS' : 'FAIL'}`);
        console.log(`Static method name fields test: ${staticMethodNameWorked ? 'PASS' : 'FAIL'}`);

        // Step 10: Clean up test data
        console.log("\n10. Cleaning up test data...");
        await Patientaccount.deleteMany({ patientemail: testEmail });
        await Patientdemographic.deleteMany({ patientemail: testEmail });
        await PatientAppointment.deleteMany({ patientappointmentemail: testEmail });
        await Patientdemographic.deleteMany({ patientemail: staticTestEmail });
        await PatientAppointment.deleteMany({ patientappointmentemail: staticTestEmail });
        console.log("✅ Test data cleaned up");

    } catch (error) {
        console.error("❌ Test failed with error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\n✅ Disconnected from database");
        console.log("\n🏁 Test completed!");
    }
}

// Run the test
testDataSynchronization();