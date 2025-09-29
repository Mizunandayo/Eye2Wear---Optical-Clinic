// Script to update Ambher case numbers from "AMB-xxx" format to simple numeric format
import Patientdemographic from "./models/patientdemographic.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function updateAmbherCaseNumbers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to database");

    // Find all patients with Ambher medical records
    const patients = await Patientdemographic.find({
      "patientmedicalrecordambher.ambheropticalcaseno": { $exists: true }
    });

    console.log(`Found ${patients.length} patients with Ambher medical records`);

    for (const patient of patients) {
      let updated = false;

      for (const record of patient.patientmedicalrecordambher) {
        if (record.ambheropticalcaseno && record.ambheropticalcaseno.startsWith("AMB-")) {
          const oldCaseNumber = record.ambheropticalcaseno;
          // Extract number from "AMB-001" -> "1"
          const numberMatch = oldCaseNumber.match(/AMB-(\d+)/);
          if (numberMatch) {
            const newCaseNumber = parseInt(numberMatch[1]).toString();
            record.ambheropticalcaseno = newCaseNumber;
            console.log(`Updated case number: ${oldCaseNumber} -> ${newCaseNumber} for patient ${patient.patientemail}`);
            updated = true;
          }
        }
      }

      if (updated) {
        await patient.save();
        console.log(`✅ Saved updates for patient ${patient.patientemail}`);
      }
    }

    console.log("🎉 All Ambher case numbers updated successfully!");
    
  } catch (error) {
    console.error("❌ Error updating case numbers:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from database");
  }
}

// Run the update
updateAmbherCaseNumbers();