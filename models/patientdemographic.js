import mongoose from "mongoose";
import Patientaccount from "../models/patientaccount.js";
import AutoIncrement from "mongoose-sequence";

// Import PatientAppointment for profile picture synchronization
// Note: This creates a circular dependency, so we'll import it inside functions when needed




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
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
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
  
  // Track if name fields were modified
  this._nameFieldsModified = this.isModified('patientlastname') || 
                            this.isModified('patientfirstname') || 
                            this.isModified('patientmiddlename');
  
  next();
});

PatientdemographicSchema.post('save', async function(doc) {
  try {
    // Check if we need to sync profile picture or name fields
    const shouldSyncProfile = this._profilePictureModified;
    const shouldSyncNames = this._nameFieldsModified;
    
    if (shouldSyncProfile || shouldSyncNames) {
      console.log(`Syncing data for patient: ${doc.patientemail}`);
      
      // Prepare update object for patient account
      const accountUpdateData = {};
      if (shouldSyncProfile) {
        accountUpdateData.patientprofilepicture = doc.patientprofilepicture;
      }
      if (shouldSyncNames) {
        accountUpdateData.patientlastname = doc.patientlastname;
        accountUpdateData.patientfirstname = doc.patientfirstname;
        accountUpdateData.patientmiddlename = doc.patientmiddlename;
      }
      
      // Update the corresponding patient account
      const result = await Patientaccount.findOneAndUpdate(
        { patientemail: doc.patientemail },
        accountUpdateData,
        { new: true }
      );
      
      if (result) {
        const syncedFields = [];
        if (shouldSyncProfile) syncedFields.push('profile picture');
        if (shouldSyncNames) syncedFields.push('name fields');
        console.log(`✅ ${syncedFields.join(' and ')} synced successfully for patient: ${doc.patientemail}`);
      } else {
        console.log(`⚠️ No patient account found for email: ${doc.patientemail}`);
      }

      // Also sync with PatientAppointment model
      try {
        // Import PatientAppointment dynamically to avoid circular dependency
        const PatientAppointment = mongoose.model('PatientAppointment');
        
        // Prepare update object for appointments
        const appointmentUpdateData = {};
        if (shouldSyncProfile) {
          appointmentUpdateData.patientappointmentprofilepicture = doc.patientprofilepicture;
        }
        if (shouldSyncNames) {
          appointmentUpdateData.patientappointmentlastname = doc.patientlastname;
          appointmentUpdateData.patientappointmentfirstname = doc.patientfirstname;
          appointmentUpdateData.patientappointmentmiddlename = doc.patientmiddlename;
        }
        
        const appointmentResult = await PatientAppointment.updateMany(
          { patientappointmentemail: doc.patientemail },
          appointmentUpdateData
        );
        
        if (appointmentResult.modifiedCount > 0) {
          const syncedFields = [];
          if (shouldSyncProfile) syncedFields.push('profile picture');
          if (shouldSyncNames) syncedFields.push('name fields');
          console.log(`✅ ${syncedFields.join(' and ')} synced to ${appointmentResult.modifiedCount} appointment(s) for patient: ${doc.patientemail}`);
        } else {
          console.log(`ℹ️ No appointments found to update for patient: ${doc.patientemail}`);
        }
      } catch (appointmentError) {
        console.error('❌ Error syncing data to appointments:', appointmentError);
      }
    }
  } catch (error) {
    console.error('❌ Error syncing data to patient account:', error);
  }
});

// Middleware to sync profile picture on update operations
PatientdemographicSchema.pre('findOneAndUpdate', function(next) {
  // Check if patientprofilepicture is being updated
  const update = this.getUpdate();
  this._profilePictureUpdate = update && (update.patientprofilepicture || update.$set?.patientprofilepicture);
  
  // Check if name fields are being updated
  this._nameFieldsUpdate = update && (
    update.patientlastname || update.$set?.patientlastname ||
    update.patientfirstname || update.$set?.patientfirstname ||
    update.patientmiddlename || update.$set?.patientmiddlename
  );
  
  next();
});

PatientdemographicSchema.post('findOneAndUpdate', async function(doc) {
  try {
    if (doc && (this._profilePictureUpdate || this._nameFieldsUpdate)) {
      const updateValue = this.getUpdate();
      
      console.log(`Syncing data via update for patient: ${doc.patientemail}`);
      
      // Prepare update object for patient account
      const accountUpdateData = {};
      if (this._profilePictureUpdate) {
        const newProfilePicture = updateValue.patientprofilepicture || updateValue.$set?.patientprofilepicture;
        accountUpdateData.patientprofilepicture = newProfilePicture;
      }
      if (this._nameFieldsUpdate) {
        const newLastName = updateValue.patientlastname || updateValue.$set?.patientlastname;
        const newFirstName = updateValue.patientfirstname || updateValue.$set?.patientfirstname;
        const newMiddleName = updateValue.patientmiddlename || updateValue.$set?.patientmiddlename;
        
        if (newLastName !== undefined) accountUpdateData.patientlastname = newLastName;
        if (newFirstName !== undefined) accountUpdateData.patientfirstname = newFirstName;
        if (newMiddleName !== undefined) accountUpdateData.patientmiddlename = newMiddleName;
      }
      
      // Update the corresponding patient account
      const result = await Patientaccount.findOneAndUpdate(
        { patientemail: doc.patientemail },
        accountUpdateData,
        { new: true }
      );
      
      if (result) {
        const syncedFields = [];
        if (this._profilePictureUpdate) syncedFields.push('profile picture');
        if (this._nameFieldsUpdate) syncedFields.push('name fields');
        console.log(`✅ ${syncedFields.join(' and ')} synced via update for patient: ${doc.patientemail}`);
      } else {
        console.log(`⚠️ No patient account found for email: ${doc.patientemail}`);
      }

      // Also sync with PatientAppointment model
      try {
        // Import PatientAppointment dynamically to avoid circular dependency
        const PatientAppointment = mongoose.model('PatientAppointment');
        
        // Prepare update object for appointments
        const appointmentUpdateData = {};
        if (this._profilePictureUpdate) {
          const newProfilePicture = updateValue.patientprofilepicture || updateValue.$set?.patientprofilepicture;
          appointmentUpdateData.patientappointmentprofilepicture = newProfilePicture;
        }
        if (this._nameFieldsUpdate) {
          const newLastName = updateValue.patientlastname || updateValue.$set?.patientlastname;
          const newFirstName = updateValue.patientfirstname || updateValue.$set?.patientfirstname;
          const newMiddleName = updateValue.patientmiddlename || updateValue.$set?.patientmiddlename;
          
          if (newLastName !== undefined) appointmentUpdateData.patientappointmentlastname = newLastName;
          if (newFirstName !== undefined) appointmentUpdateData.patientappointmentfirstname = newFirstName;
          if (newMiddleName !== undefined) appointmentUpdateData.patientappointmentmiddlename = newMiddleName;
        }
        
        const appointmentResult = await PatientAppointment.updateMany(
          { patientappointmentemail: doc.patientemail },
          appointmentUpdateData
        );
        
        if (appointmentResult.modifiedCount > 0) {
          const syncedFields = [];
          if (this._profilePictureUpdate) syncedFields.push('profile picture');
          if (this._nameFieldsUpdate) syncedFields.push('name fields');
          console.log(`✅ ${syncedFields.join(' and ')} synced to ${appointmentResult.modifiedCount} appointment(s) via update for patient: ${doc.patientemail}`);
        } else {
          console.log(`ℹ️ No appointments found to update for patient: ${doc.patientemail}`);
        }
      } catch (appointmentError) {
        console.error('❌ Error syncing data to appointments via update:', appointmentError);
      }
    }
  } catch (error) {
    console.error('❌ Error syncing data to patient account:', error);
  }
});

// Additional middleware for other update operations
PatientdemographicSchema.pre(['updateOne', 'updateMany'], function(next) {
  const update = this.getUpdate();
  this._profilePictureUpdate = update && (update.patientprofilepicture || update.$set?.patientprofilepicture);
  
  // Check if name fields are being updated
  this._nameFieldsUpdate = update && (
    update.patientlastname || update.$set?.patientlastname ||
    update.patientfirstname || update.$set?.patientfirstname ||
    update.patientmiddlename || update.$set?.patientmiddlename
  );
  
  next();
});

PatientdemographicSchema.post(['updateOne', 'updateMany'], async function(result) {
  try {
    if (result.modifiedCount > 0 && (this._profilePictureUpdate || this._nameFieldsUpdate)) {
      const filter = this.getFilter();
      const update = this.getUpdate();
      
      console.log(`Syncing data via bulk update operation`);
      
      // Find affected documents and sync their data
      const affectedDocs = await this.model.find(filter);
      
      for (const doc of affectedDocs) {
        // Prepare update object for patient account
        const accountUpdateData = {};
        if (this._profilePictureUpdate) {
          const newProfilePicture = update.patientprofilepicture || update.$set?.patientprofilepicture;
          accountUpdateData.patientprofilepicture = newProfilePicture;
        }
        if (this._nameFieldsUpdate) {
          const newLastName = update.patientlastname || update.$set?.patientlastname;
          const newFirstName = update.patientfirstname || update.$set?.patientfirstname;
          const newMiddleName = update.patientmiddlename || update.$set?.patientmiddlename;
          
          if (newLastName !== undefined) accountUpdateData.patientlastname = newLastName;
          if (newFirstName !== undefined) accountUpdateData.patientfirstname = newFirstName;
          if (newMiddleName !== undefined) accountUpdateData.patientmiddlename = newMiddleName;
        }
        
        // Sync with patient account
        const accountResult = await Patientaccount.findOneAndUpdate(
          { patientemail: doc.patientemail },
          accountUpdateData,
          { new: true }
        );
        
        if (accountResult) {
          const syncedFields = [];
          if (this._profilePictureUpdate) syncedFields.push('profile picture');
          if (this._nameFieldsUpdate) syncedFields.push('name fields');
          console.log(`✅ ${syncedFields.join(' and ')} synced via bulk update for patient: ${doc.patientemail}`);
        } else {
          console.log(`⚠️ No patient account found for email: ${doc.patientemail}`);
        }

        // Also sync with PatientAppointment model
        try {
          // Import PatientAppointment dynamically to avoid circular dependency
          const PatientAppointment = mongoose.model('PatientAppointment');
          
          // Prepare update object for appointments
          const appointmentUpdateData = {};
          if (this._profilePictureUpdate) {
            const newProfilePicture = update.patientprofilepicture || update.$set?.patientprofilepicture;
            appointmentUpdateData.patientappointmentprofilepicture = newProfilePicture;
          }
          if (this._nameFieldsUpdate) {
            const newLastName = update.patientlastname || update.$set?.patientlastname;
            const newFirstName = update.patientfirstname || update.$set?.patientfirstname;
            const newMiddleName = update.patientmiddlename || update.$set?.patientmiddlename;
            
            if (newLastName !== undefined) appointmentUpdateData.patientappointmentlastname = newLastName;
            if (newFirstName !== undefined) appointmentUpdateData.patientappointmentfirstname = newFirstName;
            if (newMiddleName !== undefined) appointmentUpdateData.patientappointmentmiddlename = newMiddleName;
          }
          
          const appointmentResult = await PatientAppointment.updateMany(
            { patientappointmentemail: doc.patientemail },
            appointmentUpdateData
          );
          
          if (appointmentResult.modifiedCount > 0) {
            const syncedFields = [];
            if (this._profilePictureUpdate) syncedFields.push('profile picture');
            if (this._nameFieldsUpdate) syncedFields.push('name fields');
            console.log(`✅ ${syncedFields.join(' and ')} synced to ${appointmentResult.modifiedCount} appointment(s) via bulk update for patient: ${doc.patientemail}`);
          } else {
            console.log(`ℹ️ No appointments found to update for patient: ${doc.patientemail}`);
          }
        } catch (appointmentError) {
          console.error('❌ Error syncing data to appointments via bulk update:', appointmentError);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error syncing data in bulk update:', error);
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

// Static method to sync profile picture and name fields for a specific patient
PatientdemographicSchema.statics.syncProfilePicture = async function(patientemail) {
  try {
    const demographic = await this.findOne({ patientemail });
    if (demographic) {
      // Sync with patient account
      await Patientaccount.findOneAndUpdate(
        { patientemail: patientemail },
        { 
          patientprofilepicture: demographic.patientprofilepicture,
          patientlastname: demographic.patientlastname,
          patientfirstname: demographic.patientfirstname,
          patientmiddlename: demographic.patientmiddlename
        },
        { new: true }
      );

      // Sync with patient appointments
      try {
        const PatientAppointment = mongoose.model('PatientAppointment');
        const appointmentResult = await PatientAppointment.updateMany(
          { patientappointmentemail: patientemail },
          { 
            patientappointmentprofilepicture: demographic.patientprofilepicture,
            patientappointmentlastname: demographic.patientlastname,
            patientappointmentfirstname: demographic.patientfirstname,
            patientappointmentmiddlename: demographic.patientmiddlename
          }
        );
        console.log(`✅ Profile picture and name fields synced to ${appointmentResult.modifiedCount} appointment(s) for patient: ${patientemail}`);
      } catch (appointmentError) {
        console.error('❌ Error syncing data to appointments:', appointmentError);
      }

      return { success: true, message: 'Profile picture and name fields synced successfully to account and appointments' };
    }
    return { success: false, message: 'Demographic record not found' };
  } catch (error) {
    console.error('Error in syncProfilePicture:', error);
    return { success: false, message: error.message };
  }
};

// Static method to sync all profile pictures and name fields (for data migration)
PatientdemographicSchema.statics.syncAllProfilePictures = async function() {
  try {
    const demographics = await this.find({});
    let syncCount = 0;
    let appointmentSyncCount = 0;
    
    for (const demographic of demographics) {
      // Sync with patient account
      await Patientaccount.findOneAndUpdate(
        { patientemail: demographic.patientemail },
        { 
          patientprofilepicture: demographic.patientprofilepicture,
          patientlastname: demographic.patientlastname,
          patientfirstname: demographic.patientfirstname,
          patientmiddlename: demographic.patientmiddlename
        },
        { new: true }
      );

      // Sync with patient appointments
      try {
        const PatientAppointment = mongoose.model('PatientAppointment');
        const appointmentResult = await PatientAppointment.updateMany(
          { patientappointmentemail: demographic.patientemail },
          { 
            patientappointmentprofilepicture: demographic.patientprofilepicture,
            patientappointmentlastname: demographic.patientlastname,
            patientappointmentfirstname: demographic.patientfirstname,
            patientappointmentmiddlename: demographic.patientmiddlename
          }
        );
        appointmentSyncCount += appointmentResult.modifiedCount;
      } catch (appointmentError) {
        console.error(`❌ Error syncing appointments for ${demographic.patientemail}:`, appointmentError);
      }

      syncCount++;
    }
    
    return { 
      success: true, 
      message: `Synced ${syncCount} profile pictures and name fields to accounts and ${appointmentSyncCount} appointment records` 
    };
  } catch (error) {
    console.error('Error in syncAllProfilePictures:', error);
    return { success: false, message: error.message };
  }
};

export default mongoose.model("Patientdemographic", PatientdemographicSchema);
