

import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";





const OtherClinicRecordSchema = new mongoose.Schema({



patientotherclinicrecordid:{
    type: Number,
    unique: true
},


//PATIENT INFORMATION
// Patient profile picture - Cloudinary URL
patientotherclinicprofilepicture: String,
// Cloudinary public_id for patient profile picture
patientotherclinicprofilepicture_public_id: {type: String, default: null},
patientothercliniclastname:{type: String, required: true},
patientotherclinicfirstname:{type: String, required: true},
patientotherclinicmiddlename: String,
patientotherclinicemail: {type: String, required: true},


patientotherclinicname: String,
patientothercliniceyespecialist: String,
patientotherclinicconsultationdate: String,
patientotherclinidescription: String,
patientotherclinicsubmittedbyfirstname: String,
patientotherclinicsubmittedbymiddlename: String,
patientotherclinicsubmittedbylastname: String,
patientotherclinicsubmittedbytype: String,

// Other clinic record image - Cloudinary URL (backwards compatibility)
patientotherclinicrecordimage: {
        type: String,
        required: false, // Make optional to handle cases where image fails to load
        default: null, // Use null instead of string for better performance
        maxlength: 2097152 // Limit base64 size to ~1.5MB actual image size (will be removed when migrated to Cloudinary)
      },
// Cloudinary public_id for other clinic record image
patientotherclinicrecordimage_public_id: {type: String, default: null},

// Multiple files support - Array of Cloudinary URLs
patientotherclinicrecordfiles: {
        type: [String],
        default: [],
        required: false
      },
// Array of Cloudinary public_ids for multiple files
patientotherclinicrecordfiles_public_ids: {
        type: [String], 
        default: [],
        required: false
      },
// Array of original file names for multiple files
patientotherclinicrecordfiles_names: {
        type: [String], 
        default: [],
        required: false
      },





//TIMESTAMPS
createdAt: {type: Date, default: Date.now},
updatedAt: {type: Date, default: Date.now}




});



//AUTO INCREMENT OtherClinicRecordSchema
OtherClinicRecordSchema.plugin(AutoIncrement(mongoose),{
    inc_field: "patientotherclinicrecordid",
    id: "other_clinic_record_seq",
    start_seq: true,
    disable_hooks: false
});

// Add indexes for better query performance - optimized for medical records
OtherClinicRecordSchema.index({ patientotherclinicrecordid: -1 }); // Primary sorting
OtherClinicRecordSchema.index({ patientotherclinicemail: 1 }); // Email filtering - most common query
OtherClinicRecordSchema.index({ patientotherclinicname: 1 }); // Clinic name filtering
OtherClinicRecordSchema.index({ patientothercliniclastname: 1, patientotherclinicfirstname: 1 }); // Name searches
OtherClinicRecordSchema.index({ createdAt: -1 }); // Date sorting
OtherClinicRecordSchema.index({ patientotherclinicconsultationdate: -1 }); // Consultation date sorting
OtherClinicRecordSchema.index({ patientotherclinicemail: 1, patientotherclinicconsultationdate: -1 }); // Compound index for patient medical history
OtherClinicRecordSchema.index({ patientothercliniclastname: 'text', patientotherclinicfirstname: 'text', patientotherclinicemail: 'text', patientotherclinicname: 'text' }); // Text search

// Add a sparse index for images to optimize queries that exclude large image data
OtherClinicRecordSchema.index({ patientotherclinicrecordimage: 1 }, { sparse: true });



export default mongoose.model("OtherClinicRecord", OtherClinicRecordSchema);