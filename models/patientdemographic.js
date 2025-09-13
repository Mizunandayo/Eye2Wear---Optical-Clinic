import mongoose from "mongoose";
import Patientaccount from "../models/patientaccount.js";
import AutoIncrement from "mongoose-sequence";






const PatientdemographicSchema = mongoose.Schema(
  {

    //Here are the model details required for patient demographic



    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patientaccount'
    },






    //PatientID properties Auto Increment
    patientdemographicId: {
      type: Number,
      unique:true,
      index: true
    },


    role:{
      type: String
    },


    //Email properties
    patientemail:{
      type: String,
      required: [true, "Please provide your email address"],
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true,
      maxlength: 50,
      validate: {
        validator: function(v) {
          return v !== null && undefined && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Not a valid email"
      }


    },


    //Lastname properties
    patientlastname:{
      type: String,
      required: [true, "Please provide your last name"],
      trim: true,
    },


    //Firstname properties
    patientfirstname:{
      type: String,
      required: [true, "Please provide your first name"],
      trim: true,
     },


    //Middlename properties
    patientmiddlename:{
      type: String,
      required: [true, "Please provide your middle name"],
      trim: true,
    },



    
    //Age properties
    patientage:{
      type: String,
      required: [true, "Please provide your age"],
      trim: true,
    },

    //Birthdate properties
    patientbirthdate:{
      type: String,
      required: [true, "Please provide your birthdate"],
      trim: true,
    },

    //Gender properties
    patientgender:{
      type: String,
      required: [true, "Please provide your gender"],
      enum: ['Male', 'Female', 'Other']
    },


    //Contactnumber properties
    patientcontactnumber:{
      type: String,
      required: [true, "Please provide your contact number"],
      trim: true,
    },
    
    
    //Homeaddress properties
    patienthomeaddress:{
      type: String,
      required: [true, "Please provide your home address"],
      trim: true,
    },    

    //Emergencycontactname properties
    patientemergencycontactname:{
      type: String,
      required: [true, "Please provide contact name"],
      trim: true,
    }, 

    //Emergencycontactnumber properties
    patientemergencycontactnumber:{
      type: String,
      required: [true, "Please provide your contact number"],
      trim: true,
    }, 


    //Profile picture properties
    patientprofilepicture: {
      type: String,
      required: [true, "Profile picture is required"],
      default:"default-profile-url",
      validate: {
        validator: function(v) {
          return v !== null && v !== undefined && v.trim() !== '';
        },
        message: "Profile picture is required"
      }
    },



    isVerified: {type: Boolean, default: false},
    verificationtoken: {type: String},
    verificationtokenexpires: {type: Date},
 
    //resetpasswordtoken: {type: String},
 //   resetpasswordexpires: {type: Date}


},
  {
    timestamps: true,
  }
);



//AICODE

PatientdemographicSchema.post('remove', async function(){
  const doc = await this.constructor.findOne().sort('-patientdemographicId');
  const newSeq = doc ? doc.patientdemographicId: 0;

  await mongoose.connection.db.collection('counters').updateOne(
    {_id: "patient_demographic_Id"},
    {$set: {seq: newSeq}}
  );
});

// Middleware to sync profile picture with patientaccount
PatientdemographicSchema.pre('save', function(next) {
  // Track if patientprofilepicture was modified
  this._profilePictureModified = this.isModified('patientprofilepicture');
  next();
});

PatientdemographicSchema.post('save', async function(doc) {
  try {
    // Only sync if patientprofilepicture was modified
    if (this._profilePictureModified) {
      console.log(`Syncing profile picture for patient: ${doc.patientemail}`);
      
      // Update the corresponding patient account with the new profile picture
      const result = await Patientaccount.findOneAndUpdate(
        { patientemail: doc.patientemail },
        { patientprofilepicture: doc.patientprofilepicture },
        { new: true }
      );
      
      if (result) {
        console.log(`✅ Profile picture synced successfully for patient: ${doc.patientemail}`);
      } else {
        console.log(`⚠️ No patient account found for email: ${doc.patientemail}`);
      }
    }
  } catch (error) {
    console.error('❌ Error syncing profile picture to patient account:', error);
  }
});

// Middleware to sync profile picture on update operations
PatientdemographicSchema.pre('findOneAndUpdate', function(next) {
  // Check if patientprofilepicture is being updated
  const update = this.getUpdate();
  this._profilePictureUpdate = update && (update.patientprofilepicture || update.$set?.patientprofilepicture);
  next();
});

PatientdemographicSchema.post('findOneAndUpdate', async function(doc) {
  try {
    if (doc && this._profilePictureUpdate) {
      const updateValue = this.getUpdate();
      const newProfilePicture = updateValue.patientprofilepicture || updateValue.$set?.patientprofilepicture;
      
      console.log(`Syncing profile picture via update for patient: ${doc.patientemail}`);
      
      // Update the corresponding patient account with the new profile picture
      const result = await Patientaccount.findOneAndUpdate(
        { patientemail: doc.patientemail },
        { patientprofilepicture: newProfilePicture },
        { new: true }
      );
      
      if (result) {
        console.log(`✅ Profile picture synced via update for patient: ${doc.patientemail}`);
      } else {
        console.log(`⚠️ No patient account found for email: ${doc.patientemail}`);
      }
    }
  } catch (error) {
    console.error('❌ Error syncing profile picture to patient account:', error);
  }
});

// Additional middleware for other update operations
PatientdemographicSchema.pre(['updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  this._profilePictureUpdate = update && (update.patientprofilepicture || update.$set?.patientprofilepicture);
  next();
});

PatientdemographicSchema.post(['updateOne', 'updateMany'], async function(result) {
  try {
    if (result.modifiedCount > 0 && this._profilePictureUpdate) {
      const filter = this.getFilter();
      const update = this.getUpdate();
      const newProfilePicture = update.patientprofilepicture || update.$set?.patientprofilepicture;
      
      console.log(`Syncing profile picture via bulk update operation`);
      
      // Find affected documents and sync their profile pictures
      const affectedDocs = await this.model.find(filter);
      
      for (const doc of affectedDocs) {
        const accountResult = await Patientaccount.findOneAndUpdate(
          { patientemail: doc.patientemail },
          { patientprofilepicture: newProfilePicture },
          { new: true }
        );
        
        if (accountResult) {
          console.log(`✅ Profile picture synced via bulk update for patient: ${doc.patientemail}`);
        } else {
          console.log(`⚠️ No patient account found for email: ${doc.patientemail}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error syncing profile picture in bulk update:', error);
  }
});

PatientdemographicSchema.plugin(AutoIncrement(mongoose),{
  inc_field:'patientdemographicId',
  id: 'patient_demographic_Id',
  start_seq: 1,
  disable_hooks: false 
});

// Create indexes for better query performance
// Note: patientemail already has an index due to unique: true
PatientdemographicSchema.index({ patientdemographicId: -1 }); // Primary sorting
PatientdemographicSchema.index({ patientemail: 1, patientdemographicId: -1 }); // Email + ID compound
PatientdemographicSchema.index({ patientgender: 1 }); // Gender filtering
PatientdemographicSchema.index({ patientage: 1 }); // Age filtering
PatientdemographicSchema.index({ patientlastname: 1, patientfirstname: 1 }); // Name searches
PatientdemographicSchema.index({ createdAt: -1 }); // Date sorting
PatientdemographicSchema.index({ patientlastname: 'text', patientfirstname: 'text', patientemail: 'text' }); // Text search

// Static method to sync profile picture for a specific patient
PatientdemographicSchema.statics.syncProfilePicture = async function(patientemail) {
  try {
    const demographic = await this.findOne({ patientemail });
    if (demographic) {
      await Patientaccount.findOneAndUpdate(
        { patientemail: patientemail },
        { patientprofilepicture: demographic.patientprofilepicture },
        { new: true }
      );
      return { success: true, message: 'Profile picture synced successfully' };
    }
    return { success: false, message: 'Demographic record not found' };
  } catch (error) {
    console.error('Error in syncProfilePicture:', error);
    return { success: false, message: error.message };
  }
};

// Static method to sync all profile pictures (for data migration)
PatientdemographicSchema.statics.syncAllProfilePictures = async function() {
  try {
    const demographics = await this.find({});
    let syncCount = 0;
    
    for (const demographic of demographics) {
      await Patientaccount.findOneAndUpdate(
        { patientemail: demographic.patientemail },
        { patientprofilepicture: demographic.patientprofilepicture },
        { new: true }
      );
      syncCount++;
    }
    
    return { success: true, message: `Synced ${syncCount} profile pictures` };
  } catch (error) {
    console.error('Error in syncAllProfilePictures:', error);
    return { success: false, message: error.message };
  }
};

export default mongoose.model("Patientdemographic", PatientdemographicSchema);
