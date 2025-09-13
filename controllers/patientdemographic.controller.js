  /* eslint-disable no-undef */   
  import Patientdemographic from "../models/patientdemographic.js";
  import Patientaccount from "../models/patientaccount.js";
  import jwt from "jsonwebtoken";
  import dotenv from "dotenv";
  import { Trophy } from "lucide-react";


  dotenv.config();





  //Retrieve (All Patient Demographic) Controller
  export const getpatientdemographics = async (req, res) => {
    try {
      // Optimized query with lean() and field selection for better performance
      const patientdemo = await Patientdemographic.find()
        .select('patientdemographicId patientemail patientfirstname patientmiddlename patientlastname patientage patientbirthdate patientgender patientcontactnumber patienthomeaddress patientemergencycontactname patientemergencycontactnumber patientprofilepicture createdAt')
        .lean(); // Returns plain JavaScript objects instead of Mongoose documents
      
      res.status(200).json(patientdemo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //Retrieve (Single Demographic) Controller
  export const getpatientdemographicbyid = async (req, res) => {
    try {
      const { id } = req.params;
      // Optimized query with field selection and lean()
      const patientdemo = await Patientdemographic.findById(id)
        .select('patientdemographicId patientemail patientfirstname patientmiddlename patientlastname patientage patientbirthdate patientgender patientcontactnumber patienthomeaddress patientemergencycontactname patientemergencycontactnumber patientprofilepicture createdAt updatedAt')
        .lean(); // Returns plain JavaScript objects for better performance
      
      if (!patientdemo) {
        return res.status(404).json({ message: "Patient demographic not found" });
      }
      
      res.status(200).json(patientdemo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  //Retrieve (Single Demographic by lastname ) Controller
  export const getpatientdemographicbylastname = async (req, res) => {
    try {
      const { patientlastname } = req.params;
      // Optimized query with field selection, lean(), and indexed lastname lookup
      const patientdemo = await Patientdemographic.findOne({
        patientlastname: patientlastname
      })
      .select('patientdemographicId patientemail patientfirstname patientmiddlename patientlastname patientage patientbirthdate patientgender patientcontactnumber patienthomeaddress patientemergencycontactname patientemergencycontactnumber patientprofilepicture createdAt')
      .lean(); // Returns plain JavaScript objects for better performance
      
      if (!patientdemo) {
        return res.status(404).json({ message: "Patient demographic not found" });
      }
      
      res.status(200).json(patientdemo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

















  //Verify Patient
  export const verifypatient = async(req,res,next) => {
    try{
      const token = req.headers.authorization?.split(" ")[1];
      if(!token) return res.status(401).json({message: "Unauthorized"});

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.patient = decoded;
      next();

    }catch(error){
      res.status(401).json({message: "Invalid Token", error});
    }
  }


  export const getcurrentpatientdemographic = async (req, res) => {
    try{
      // Optimized query with field selection, lean(), and indexed email lookup
      const demographic = await Patientdemographic.findOne({
        patientemail: req.patient.email
      })
      .select('patientdemographicId patientemail patientfirstname patientmiddlename patientlastname patientage patientbirthdate patientgender patientcontactnumber patienthomeaddress patientemergencycontactname patientemergencycontactnumber patientprofilepicture createdAt updatedAt')
      .lean(); // Returns plain JavaScript objects for better performance

      if(!demographic) return res.status(404).json({message: "No patient demographic data found"});
      res.status(200).json(demographic);

    }catch(error){
      return res.status(500).json({message:error.message});
    }
  }
























  //GET PATIENT DEMOGRAPHIC BY EMAIL
  export const getpatientdemographicbyemail = async (req, res) => {
    try{
      const {patientemail} = req.params;
      
      // Handle access based on user type from middleware
      if (req.userType === 'Patient') {
        // Patients can only access their own demographic data
        if (req.patient.email !== patientemail) {
          return res.status(403).json({
            message: "Access denied. You can only access your own demographic data."
          });
        }
      } else if (req.userType === 'Staff' || req.userType === 'Owner') {
        // Staff and Owners can access any patient's demographic data for business operations
        // No additional restriction needed
      } else {
        return res.status(403).json({
          message: "Access denied. Invalid user type."
        });
      }
      
      // Optimized query with field selection, lean(), and indexed email lookup
      const patientdemo = await Patientdemographic.findOne({
        patientemail: patientemail
      })
      .select('patientdemographicId patientemail patientfirstname patientmiddlename patientlastname patientage patientbirthdate patientgender patientcontactnumber patienthomeaddress patientemergencycontactname patientemergencycontactnumber patientprofilepicture createdAt updatedAt')
      .lean(); // Returns plain JavaScript objects for better performance

      if(!patientdemo){
        return res.status(404).json({
          message:"Patient doesn't have an existing demographic profile"
        });
      }

      res.status(200).json(patientdemo);

    }catch(error){
      res.status(500).json({
        message: error.message
      });
    }
  }








  //CREATE PATIENT DEMOGRAPHIC
//AICODE

 export const createpatientdemographic = async (req, res) => {
  try{

    const requiredfields = [
      'patientemail',
      'patientlastname',
      'patientfirstname',
      'patientmiddlename',
      'patientage',
      'patientbirthdate',
      'patientgender',
      'patientcontactnumber',
      'patienthomeaddress',
      'patientemergencycontactname',
      'patientemergencycontactnumber',
    ];

    for (const field of requiredfields) {
      if(!req.body[field]) {
        return res.status(400).json({message: `${field} is required`});
      }
    }

    const existing = await Patientdemographic.findOne({
      patientemail: req.body.patientemail
    });

    if(existing) {
      return res.status(400).json({
        message: "Patient demographic profile is existing in this email"
      });
    }

    const newdemographic = await Patientdemographic.create(req.body);
    res.status(201).json(newdemographic);


  }catch(error){
     res.status(500).json({
      message: error.message.includes("validation")
      ? "Invalid format"
      :"Server error",
      details: error.message
     });
  }
 }









  //UPDATE PATIENT DEMOGRAPHIC
  export const updatepatientdemographic = async (req, res) => {
    try{
      const { id } = req.params;
      const updateddata = req.body;

      // Validate required fields including profile picture
      const requiredFields = [
        'patientemail',
        'patientlastname', 
        'patientfirstname',
        'patientmiddlename',
        'patientage',
        'patientbirthdate',
        'patientgender',
        'patientcontactnumber',
        'patienthomeaddress',
        'patientemergencycontactname',
        'patientemergencycontactnumber',
        'patientprofilepicture'
      ];

      // Check for missing or empty required fields
      for (const field of requiredFields) {
        if (!updateddata[field] || (typeof updateddata[field] === 'string' && updateddata[field].trim() === '')) {
          let fieldName = field.replace('patient', '').replace(/([A-Z])/g, ' $1').toLowerCase();
          fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
          
          // Special case for profile picture
          if (field === 'patientprofilepicture') {
            return res.status(400).json({
              message: "Profile picture is required",
              field: field,
              error: "VALIDATION_ERROR"
            });
          }
          
          return res.status(400).json({
            message: `${fieldName} is required`,
            field: field,
            error: "VALIDATION_ERROR"
          });
        }
      }

      const existingdemo = await Patientdemographic.findById(id);
      if(!existingdemo){
        return res.status(404).json({message: "Patient Demographic data not found"});
      }

      const updateddemographic = await Patientdemographic.findByIdAndUpdate(
        id,
        updateddata,
        {new: true, runValidators: true}
      );

      if(!updateddemographic){
        return res.status(404).json({message: "Patient Demographic data not found"});
      }

      res.status(200).json(updateddemographic);
    }catch(error){
      // Handle specific validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: validationErrors[0] || "Validation failed",
          error: "VALIDATION_ERROR",
          details: validationErrors
        });
      }

      // Handle profile picture specific errors
      if (error.message.includes('patientprofilepicture')) {
        return res.status(400).json({
          message: "Profile picture is required",
          error: "VALIDATION_ERROR",
          details: error.message
        });
      }

      res.status(500).json({
        message: error.message.includes("validation")
        ? "Invalid format"
        : "Server Error",
        details: error.message
      });
    }
  };

  // Sync profile picture between demographic and account models
  export const syncProfilePicture = async (req, res) => {
    try {
      const { patientemail } = req.params;
      
      if (!patientemail) {
        return res.status(400).json({ 
          message: "Patient email is required" 
        });
      }

      const result = await Patientdemographic.syncProfilePicture(patientemail);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({
        message: "Error syncing profile picture",
        error: error.message
      });
    }
  };

  // Sync all profile pictures (for data migration)
  export const syncAllProfilePictures = async (req, res) => {
    try {
      const result = await Patientdemographic.syncAllProfilePictures();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({
        message: "Error syncing all profile pictures",
        error: error.message
      });
    }
  };

  // Debug endpoint to test profile picture sync
  export const debugProfileSync = async (req, res) => {
    try {
      const { patientemail } = req.params;
      const { newProfilePicture } = req.body;
      
      if (!patientemail || !newProfilePicture) {
        return res.status(400).json({ 
          message: "Patient email and new profile picture are required" 
        });
      }

      console.log(`🔧 DEBUG: Testing profile sync for ${patientemail} with ${newProfilePicture}`);

      // Update the demographic record
      const updatedDemographic = await Patientdemographic.findOneAndUpdate(
        { patientemail: patientemail },
        { patientprofilepicture: newProfilePicture },
        { new: true }
      );

      if (!updatedDemographic) {
        return res.status(404).json({ 
          message: "Demographic record not found" 
        });
      }

      // Wait a moment for middleware to execute
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if the account was updated
      const accountRecord = await Patientaccount.findOne({ patientemail: patientemail });
      
      const syncSuccess = accountRecord && accountRecord.patientprofilepicture === newProfilePicture;

      res.status(200).json({
        success: syncSuccess,
        message: syncSuccess ? "Profile picture synced successfully" : "Profile picture sync failed",
        demographic: {
          email: updatedDemographic.patientemail,
          profilePicture: updatedDemographic.patientprofilepicture
        },
        account: {
          email: accountRecord?.patientemail,
          profilePicture: accountRecord?.patientprofilepicture
        },
        synced: syncSuccess
      });

    } catch (error) {
      res.status(500).json({
        message: "Error in debug profile sync",
        error: error.message
      });
    }
  };

  // Test validation endpoint
  export const testValidation = async (req, res) => {
    try {
      const { id } = req.params;
      const testData = req.body;

      console.log(`🔧 VALIDATION TEST: Testing update for ID ${id}`);
      console.log(`📋 Test data:`, testData);

      // Attempt the update with validation
      const result = await Patientdemographic.findByIdAndUpdate(
        id,
        testData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "Validation passed successfully",
        result: result
      });

    } catch (error) {
      console.log(`❌ Validation failed:`, error.message);
      
      // Return specific validation error message
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: validationErrors[0] || "Validation failed", 
          error: "VALIDATION_ERROR",
          details: validationErrors
        });
      }

      res.status(400).json({
        success: false,
        message: error.message,
        error: "VALIDATION_ERROR"
      });
    }
  };









  //Delete (Patient Profile) Controller
  export const deletepatientdemographic = async (req, res) => {
    try {
      const { id } = req.params;
      let patientdemo = await Patientdemographic.findOneAndDelete({patientId: id});
      
      if (!patientdemo) {
        patientdemo = await Patientdemographic.findByIdAndDelete(id);
      }
  
      if (!patientdemo) {
        return res.status(404).json({ message: "Patient not found" });
      }
  
      res.status(200).json({ message: "Patient Profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  









