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


    //Profile picture properties - Cloudinary
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
    
    // Cloudinary public_id for profile picture management
    patientprofilepicture_public_id: {
      type: String,
      default: null
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

// ACTIVE: Re-enable pre save middleware for field change tracking
PatientdemographicSchema.pre('save', function(next) {
  // Track which fields are being modified for selective sync
  this._profilePictureModified = this.isModified('patientprofilepicture');
  this._nameFieldsModified = this.isModified('patientlastname') || 
                            this.isModified('patientfirstname') || 
                            this.isModified('patientmiddlename');
  this._isNewDocument = this.isNew;
  
  next();
});

// ACTIVE: Re-enable post save middleware for automatic sync
PatientdemographicSchema.post('save', async function(doc) {
  try {
    // Sync if fields were modified OR if it's a new document with valid profile/name data
    const shouldSyncProfile = this._profilePictureModified || 
                             (this._isNewDocument && doc.patientprofilepicture && doc.patientprofilepicture !== 'default-profile-url');
    const shouldSyncNames = this._nameFieldsModified || 
                           (this._isNewDocument && (doc.patientlastname || doc.patientfirstname || doc.patientmiddlename));
    
    if (shouldSyncProfile || shouldSyncNames) {
      try {
        // Import models here to avoid circular dependency issues
        const Patientaccount = mongoose.model('Patientaccount');
        const PatientAppointment = mongoose.model('PatientAppointment');
        
        // Prepare update object for patient account with only changed fields
        const accountUpdateData = {};
        if (shouldSyncProfile) {
          accountUpdateData.patientprofilepicture = doc.patientprofilepicture;
          accountUpdateData.patientprofilepicture_public_id = doc.patientprofilepicture_public_id;
        }
        if (shouldSyncNames) {
          accountUpdateData.patientlastname = doc.patientlastname;
          accountUpdateData.patientfirstname = doc.patientfirstname;
          accountUpdateData.patientmiddlename = doc.patientmiddlename;
        }
        
        // Use updateOne for better performance (no document return)
        const result = await Patientaccount.updateOne(
          { patientemail: doc.patientemail },
          { $set: accountUpdateData }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Patient account synced for: ${doc.patientemail} (${this._isNewDocument ? 'new' : 'updated'} demographic)`);
        } else {
          console.log(`⚠️ No patient account found to sync for: ${doc.patientemail}`);
        }

        // Sync with PatientAppointment model if needed (async without blocking)
        if (shouldSyncProfile || shouldSyncNames) {
          const appointmentUpdateData = {};
          if (shouldSyncProfile) {
            appointmentUpdateData.patientappointmentprofilepicture = doc.patientprofilepicture;
          }
          if (shouldSyncNames) {
            appointmentUpdateData.patientappointmentlastname = doc.patientlastname;
            appointmentUpdateData.patientappointmentfirstname = doc.patientfirstname;
            appointmentUpdateData.patientappointmentmiddlename = doc.patientmiddlename;
          }
          
          // Use fire-and-forget for appointment updates to not slow down the main operation
          PatientAppointment.updateMany(
            { patientappointmentemail: doc.patientemail },
            { $set: appointmentUpdateData }
          ).then((appointmentResult) => {
            if (appointmentResult.modifiedCount > 0) {
              console.log(`✅ ${appointmentResult.modifiedCount} appointment(s) synced for: ${doc.patientemail}`);
            }
          }).catch((appointmentError) => {
            console.error('❌ Error syncing appointments:', appointmentError);
          });
        }
      } catch (error) {
        console.error('❌ Error in sync operation:', error);
      }
    }
  } catch (error) {
    console.error('❌ Error setting up sync:', error);
  }
});


// ACTIVE: Re-enable pre findOneAndUpdate middleware for tracking changes
PatientdemographicSchema.pre('findOneAndUpdate', function(next) {
  // Track which fields are being updated
  const update = this.getUpdate();
  const $set = update.$set || update;
  
  this._profilePictureModified = $set.patientprofilepicture !== undefined;
  this._nameFieldsModified = $set.patientlastname !== undefined || 
                            $set.patientfirstname !== undefined || 
                            $set.patientmiddlename !== undefined;
  
  next();
});

// ACTIVE: Re-enable post findOneAndUpdate middleware for automatic sync
PatientdemographicSchema.post('findOneAndUpdate', async function(doc) {
  if (!doc) return; // No document was updated
  
  try {
    const shouldSyncProfile = this._profilePictureModified;
    const shouldSyncNames = this._nameFieldsModified;
    
    if (shouldSyncProfile || shouldSyncNames) {
      // Import models here to avoid circular dependency issues
      const Patientaccount = mongoose.model('Patientaccount');
      const PatientAppointment = mongoose.model('PatientAppointment');
      
      // Prepare update object for patient account with only changed fields
      const accountUpdateData = {};
      if (shouldSyncProfile) {
        accountUpdateData.patientprofilepicture = doc.patientprofilepicture;
      }
      if (shouldSyncNames) {
        accountUpdateData.patientlastname = doc.patientlastname;
        accountUpdateData.patientfirstname = doc.patientfirstname;
        accountUpdateData.patientmiddlename = doc.patientmiddlename;
      }
      
      // Sync patient account
      const result = await Patientaccount.updateOne(
        { patientemail: doc.patientemail },
        { $set: accountUpdateData }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Patient account synced via update for: ${doc.patientemail}`);
      }

      // Sync patient appointments (fire-and-forget)
      const appointmentUpdateData = {};
      if (shouldSyncProfile) {
        appointmentUpdateData.patientappointmentprofilepicture = doc.patientprofilepicture;
      }
      if (shouldSyncNames) {
        appointmentUpdateData.patientappointmentlastname = doc.patientlastname;
        appointmentUpdateData.patientappointmentfirstname = doc.patientfirstname;
        appointmentUpdateData.patientappointmentmiddlename = doc.patientmiddlename;
      }
      
      PatientAppointment.updateMany(
        { patientappointmentemail: doc.patientemail },
        { $set: appointmentUpdateData }
      ).then((appointmentResult) => {
        if (appointmentResult.modifiedCount > 0) {
          console.log(`✅ ${appointmentResult.modifiedCount} appointment(s) synced via update for: ${doc.patientemail}`);
        }
      }).catch((appointmentError) => {
        console.error('❌ Error syncing appointments via update:', appointmentError);
      });
    }
  } catch (error) {
    console.error('❌ Error in findOneAndUpdate sync:', error);
  }
});

// ACTIVE: Re-enable bulk update middleware for automatic sync
PatientdemographicSchema.post(['updateOne', 'updateMany'], async function(result) {
  try {
    // For bulk operations, we need to sync all potentially affected records
    if (result.modifiedCount > 0) {
      const update = this.getUpdate();
      const $set = update.$set || update;
      
      const shouldSyncProfile = $set.patientprofilepicture !== undefined;
      const shouldSyncNames = $set.patientlastname !== undefined || 
                              $set.patientfirstname !== undefined || 
                              $set.patientmiddlename !== undefined;
      
      if (shouldSyncProfile || shouldSyncNames) {
        // Get the filter to find affected documents
        const filter = this.getFilter();
        
        // Find all affected demographics to get their emails
        const affectedDemographics = await this.model.find(filter)
          .select('patientemail patientprofilepicture patientlastname patientfirstname patientmiddlename')
          .lean();
        
        if (affectedDemographics.length > 0) {
          // Import models here to avoid circular dependency issues
          const Patientaccount = mongoose.model('Patientaccount');
          const PatientAppointment = mongoose.model('PatientAppointment');
          
          // Sync accounts for each affected demographic
          for (const demographic of affectedDemographics) {
            const accountUpdateData = {};
            if (shouldSyncProfile) {
              accountUpdateData.patientprofilepicture = demographic.patientprofilepicture;
            }
            if (shouldSyncNames) {
              accountUpdateData.patientlastname = demographic.patientlastname;
              accountUpdateData.patientfirstname = demographic.patientfirstname;
              accountUpdateData.patientmiddlename = demographic.patientmiddlename;
            }
            
            // Sync patient account
            await Patientaccount.updateOne(
              { patientemail: demographic.patientemail },
              { $set: accountUpdateData }
            );
            
            // Sync appointments (fire-and-forget)
            const appointmentUpdateData = {};
            if (shouldSyncProfile) {
              appointmentUpdateData.patientappointmentprofilepicture = demographic.patientprofilepicture;
            }
            if (shouldSyncNames) {
              appointmentUpdateData.patientappointmentlastname = demographic.patientlastname;
              appointmentUpdateData.patientappointmentfirstname = demographic.patientfirstname;
              appointmentUpdateData.patientappointmentmiddlename = demographic.patientmiddlename;
            }
            
            PatientAppointment.updateMany(
              { patientappointmentemail: demographic.patientemail },
              { $set: appointmentUpdateData }
            ).catch((appointmentError) => {
              console.error('❌ Error syncing appointments in bulk update:', appointmentError);
            });
          }
          
          console.log(`✅ Bulk sync completed for ${affectedDemographics.length} demographic(s)`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in bulk update sync:', error);
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

// Additional performance indexes
PatientdemographicSchema.index({ updatedAt: -1 }); // For recent updates
PatientdemographicSchema.index({ patientcontactnumber: 1 }); // Phone number searches
PatientdemographicSchema.index({ patientgender: 1, patientage: 1 }); // Demographics filtering
PatientdemographicSchema.index({ patientlastname: 1, patientfirstname: 1, patientmiddlename: 1 }); // Full name search

// Optimized static method to sync profile picture and name fields for a specific patient
PatientdemographicSchema.statics.syncProfilePicture = async function(patientemail) {
  try {
    const demographic = await this.findOne({ patientemail }).select('patientemail patientprofilepicture patientlastname patientfirstname patientmiddlename').lean();
    if (demographic) {
      // Sync with patient account using updateOne for better performance
      const accountResult = await Patientaccount.updateOne(
        { patientemail: patientemail },
        { 
          $set: {
            patientprofilepicture: demographic.patientprofilepicture,
            patientlastname: demographic.patientlastname,
            patientfirstname: demographic.patientfirstname,
            patientmiddlename: demographic.patientmiddlename
          }
        }
      );

      // Fire-and-forget sync with patient appointments
      const PatientAppointment = mongoose.model('PatientAppointment');
      PatientAppointment.updateMany(
        { patientappointmentemail: patientemail },
        { 
          $set: {
            patientappointmentprofilepicture: demographic.patientprofilepicture,
            patientappointmentlastname: demographic.patientlastname,
            patientappointmentfirstname: demographic.patientfirstname,
            patientappointmentmiddlename: demographic.patientmiddlename
          }
        }
      ).then((appointmentResult) => {
        if (appointmentResult.modifiedCount > 0) {
          console.log(`✅ Profile synced to ${appointmentResult.modifiedCount} appointment(s) for: ${patientemail}`);
        }
      }).catch((appointmentError) => {
        console.error('❌ Error syncing appointments:', appointmentError);
      });

      return { 
        success: true, 
        message: 'Profile picture and name fields synced successfully to account and appointments',
        accountModified: accountResult.modifiedCount > 0
      };
    }
    return { success: false, message: 'Demographic record not found' };
  } catch (error) {
    console.error('Error in syncProfilePicture:', error);
    return { success: false, message: error.message };
  }
};

// Optimized static method to sync all profile pictures and name fields (for data migration)
PatientdemographicSchema.statics.syncAllProfilePictures = async function() {
  try {
    // Use aggregation pipeline for better performance
    const demographics = await this.aggregate([
      {
        $project: {
          patientemail: 1,
          patientprofilepicture: 1,
          patientlastname: 1,
          patientfirstname: 1,
          patientmiddlename: 1
        }
      }
    ]);

    if (demographics.length === 0) {
      return { success: true, message: 'No demographics found to sync' };
    }
    
    let syncCount = 0;
    
    // Process in batches of 50 for better performance
    const batchSize = 50;
    for (let i = 0; i < demographics.length; i += batchSize) {
      const batch = demographics.slice(i, i + batchSize);
      
      // Prepare bulk operations for patient accounts
      const accountBulkOps = batch.map(demographic => ({
        updateOne: {
          filter: { patientemail: demographic.patientemail },
          update: {
            $set: {
              patientprofilepicture: demographic.patientprofilepicture,
              patientlastname: demographic.patientlastname,
              patientfirstname: demographic.patientfirstname,
              patientmiddlename: demographic.patientmiddlename
            }
          }
        }
      }));

      // Execute bulk update for patient accounts
      const accountResult = await Patientaccount.bulkWrite(accountBulkOps);
      syncCount += accountResult.modifiedCount;

      // Fire-and-forget bulk update for appointments
      const PatientAppointment = mongoose.model('PatientAppointment');
      const appointmentBulkOps = batch.map(demographic => ({
        updateMany: {
          filter: { patientappointmentemail: demographic.patientemail },
          update: {
            $set: {
              patientappointmentprofilepicture: demographic.patientprofilepicture,
              patientappointmentlastname: demographic.patientlastname,
              patientappointmentfirstname: demographic.patientfirstname,
              patientappointmentmiddlename: demographic.patientmiddlename
            }
          }
        }
      }));

      PatientAppointment.bulkWrite(appointmentBulkOps).then((appointmentResult) => {
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${appointmentResult.modifiedCount} appointments synced`);
      }).catch((appointmentError) => {
        console.error(`❌ Error syncing appointment batch ${Math.floor(i/batchSize) + 1}:`, appointmentError);
      });

      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${accountResult.modifiedCount} accounts synced`);
    }
    
    return { 
      success: true, 
      message: `Synced ${syncCount} profile pictures and name fields to accounts. Appointment sync in progress.`,
      accountsSynced: syncCount,
      totalProcessed: demographics.length
    };
  } catch (error) {
    console.error('Error in syncAllProfilePictures:', error);
    return { success: false, message: error.message };
  }
};

export default mongoose.model("Patientdemographic", PatientdemographicSchema);
