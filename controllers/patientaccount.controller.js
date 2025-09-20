/* eslint-disable no-undef */
import Patientaccount from "../models/patientaccount.js";
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { emailServiceManager } from '../utils/emailServiceManager.js';
import Adminaccount from "../models/adminaccount.js";
import Staffaccount from "../models/staffacount.js";
import Owneraccount from "../models/owneraccount.js";


dotenv.config();







const generateAuthToken = (patient) => {
  return jwt.sign({
    id: patient._id,
    email: patient.patientemail,
    role: 'patient',
    clinic: null,
    name: `${patient.patientfirstname} ${patient.patientlastname}`
  },
  process.env.JWT_SECRET, { expiresIn: "30d" }); // Increased expiration
}

// Unified middleware to verify admin, staff, or owner authentication for patient management
export const verifyManagementAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    // Try to verify with JWT_SECRET first (staff/owner tokens)
    try {
      const tokendecoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if it's a staff or owner token
      if (tokendecoded.role === 'staff' || tokendecoded.role === 'owner') {
        req.user = {
          id: tokendecoded.id,
          email: tokendecoded.email,
          role: tokendecoded.role,
          clinic: tokendecoded.clinic
        };
        return next();
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // If JWT_SECRET fails, try JWT_KEY (admin tokens)
      try {
        const tokendecoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = {
          id: tokendecoded.id,
          role: 'admin'
        };
        return next();
      } catch (adminError) {
        console.error("Token verification failed for both JWT_SECRET and JWT_KEY:", adminError);
        return res.status(401).json({
          message: "Invalid token",
          error: adminError.message
        });
      }
    }

    // If we get here, the token was valid but the role wasn't authorized
    return res.status(403).json({
      message: "Insufficient permissions. Only admin, staff, or owner can perform this action."
    });

  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({
      message: "Invalid token",
      error: error.message
    });
  }
}

// In verifyloggedinpatientacc:




//Retrieve (All Patient) Controller
export const getpatientaccounts = async (req, res) => {
  try {
    // Optimized query with field selection, lean(), and proper sorting
    const patientacc = await Patientaccount.find({})
      .select('patientId patientemail patientlastname patientfirstname patientmiddlename patientprofilepicture isVerified createdAt')
      .sort({ patientId: -1 }) // Sort by ID descending for newest first
      .lean(); // Returns plain JavaScript objects for better performance
    
    res.status(200).json(patientacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Retrieve (Single ) Controller
export const getpatientaccountbyid = async (req, res) => {
  try {
    const { id } = req.params;
    // Use lean() for better performance when not modifying the document
    const patientacc = await Patientaccount.findById(id).lean();
    
    if (!patientacc) {
      return res.status(404).json({ message: "Patient not found" });
    }
    
    res.status(200).json(patientacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Retrieve (Single by lastname ) Controller
export const getpatientaccountbylastname = async (req, res) => {
  try {
    const { patientlastname } = req.params;
    const patientacc = await Patientaccount.findOne({patientlastname: patientlastname});
    res.status(200).json(patientacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








export const getloggedinpatientacc = async (req, res) => {
  try{
    // Optimized query with lean() and specific field selection for faster response
    const patient = await Patientaccount.findById(req.patient.id)
      .select('patientlastname patientfirstname patientmiddlename patientemail patientId patientprofilepicture isVerified')
      .lean(); // Use lean() for better performance

    if(!patient){
      return res.status(404).json({message: "Patient does not exist"});
    }

    res.status(200).json({
      patientlastname: patient.patientlastname,
      patientfirstname: patient.patientfirstname,
      patientmiddlename: patient.patientmiddlename,
      patientemail: patient.patientemail,
      patientId: patient.patientId,
      patientprofilepicture: patient.patientprofilepicture
    });

  }catch (error){

    console.error("Failed to fetch patient account details: ", error);
    res.status(500).json({
      message: "Error retrieving patient data",
      error: error.message
    });

  }
};



export const getpatientbyemail = async (req, res) => {
  try {
    const { patientemail } = req.params;
    const patient = await Patientaccount.findOne({ patientemail }).select(
      "patientprofilepicture patientfirstname patientmiddlename patientlastname"
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





export const verifyloggedinpatientacc = async(req,res,next) => {
  try{
    const patienttoken = req.header('Authorization')?.replace('Bearer ', '');

    if(!patienttoken){
      console.error("No token provided");
      return res.status(401).json({message: "Authorization Required" });
    }

    const tokendecoded = jwt.verify(patienttoken, process.env.JWT_SECRET);
    console.log("Decoded token: ", tokendecoded);

    req.patient = {id: tokendecoded.id, email: tokendecoded.email};
    next();

  }catch(error){
    console.error("Token verification failed: ", error.message);
    res.status(401).json({message: "Invalid token", error});
  }
};




















//Retrieve (Existing Email) Controller
export const existingemail = async (req, res) => {
  try{

    const patientemail = req.params.patientemail;

    const existingemail = await Patientaccount.findOne({patientemail});
    res.json({exists: !!existingemail});
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};




//Create (Patient) Controller
export const createPatient = async (req, res) => {
  try {
    // Ensure the account is created as unverified
    const patientData = {
      ...req.body,
      isVerified: false
    };

    const patientacc = await Patientaccount.create(patientData);
    
    // Send verification email
    const emailResult = await sendVerificationEmail(patientacc);
    
    if (emailResult.success) {
      // Return success without sensitive data
      const { patientpassword: _, verificationtoken: __, ...safePatientData } = patientacc.toObject();
      
      res.status(201).json({
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        patient: safePatientData
      });
    } else {
      // If email fails, we should still create the account but inform the user
      res.status(201).json({
        success: true,
        message: "Account created successfully, but there was an issue sending the verification email. Please try to resend it later.",
        emailError: true
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};





//Update (Patient) Controller
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patientacc = await Patientaccount.findByIdAndUpdate(id, req.body);

    if (!patientacc) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const updatedpatientacc = await Patientaccount.findById(id);
    res.status(200).json(updatedpatientacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




//Delete (Patient) Controller
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    let patientacc = await Patientaccount.findOneAndDelete({patientId: id});
    
    if (!patientacc) {
      patientacc = await Patientaccount.findByIdAndDelete(id);
    }

    if (!patientacc) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};











//Login Patient Controller
export const patientlogin = async(req, res) => {
  try{
    const {patientemail,patientpassword} = req.body;

    // Optimized query with lean() and specific field selection for faster login
    const patient = await Patientaccount.findOne({patientemail: patientemail})
      .select('_id patientemail patientpassword patientfirstname patientlastname patientmiddlename patientprofilepicture patientId isVerified')
      .lean();
      
    if(!patient) {
      return res.status(401).json({message:"Login Error, Invalid Credentials"});
    }

    // Check if account is verified
    if(!patient.isVerified) {
      return res.status(401).json({message:"Account not verified. Please check your email."});
    }

    const loginmatch = await bcrypt.compare(patientpassword, patient.patientpassword);
    if(!loginmatch) {
      return res.status(401).json({message:"Login Error, Invalid Credentials"});
    }

    const jsontoken = generateAuthToken(patient);

    // Remove password from response (already lean object)
    const { patientpassword: _, ...patientlogin } = patient;

    res.json({
      message:"Login Success",
      jsontoken,
      patient: patientlogin
    });

  } catch(error){
    console.error("Login Failed", error);
    res.status(500).json({message:"Server Failed"});
  }
};

// Email verification functions
const sendVerificationEmail = async (patient) => {
  try {
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update patient with verification token
    await Patientaccount.findByIdAndUpdate(patient._id, {
      verificationtoken: verificationToken,
      verificationtokenexpires: verificationTokenExpires
    });

    // Use unified email service manager (automatically selects SMTP or Gmail API)
    const emailResult = await emailServiceManager.sendVerificationEmail(
      patient.patientemail,
      verificationToken,
      patient.patientfirstname,
      'Eye2Wear' // Default clinic name, could be dynamic based on context
    );

    if (emailResult.success) {
      console.log('Verification email sent successfully');
      return { success: true };
    } else {
      throw new Error('Email service returned failure');
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error: error.message };
  }
};

// Verify email controller
export const verifyEmail = async (req, res) => {
  try {
    const { id, token } = req.params;

    // Find patient with matching ID and valid token
    const patient = await Patientaccount.findOne({
      _id: id,
      verificationtoken: token,
      verificationtokenexpires: { $gt: new Date() }
    });

    if (!patient) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link"
      });
    }

    // Update patient as verified and remove verification token
    await Patientaccount.findByIdAndUpdate(id, {
      isVerified: true,
      verificationtoken: undefined,
      verificationtokenexpires: undefined
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now log in to your account."
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during email verification"
    });
  }
};

// Resend verification email controller
export const resendVerificationEmail = async (req, res) => {
  try {
    const { patientemail } = req.body;

    const patient = await Patientaccount.findOne({ patientemail });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Account not found"
      });
    }

    if (patient.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified"
      });
    }

    const emailResult = await sendVerificationEmail(patient);

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Verification email sent successfully"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send verification email"
      });
    }

  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export { sendVerificationEmail };


