/* eslint-disable no-undef */
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import Patientaccount from '../models/patientaccount.js';
import dotenv from 'dotenv';

dotenv.config();

// Use the frontend client ID for Google OAuth verification
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const generateAuthToken = (patient) => {
  return jwt.sign({
    id: patient._id,
    email: patient.patientemail,
    role: 'patient',
    clinic: null,
    name: `${patient.patientfirstname} ${patient.patientlastname}`
  },
  process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Load default profile picture as base64
const loadDefaultProfilePic = async () => {
  // Return a simple default avatar SVG
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCA3NUMyMCA2NS4wNTg5IDI3LjE2MzQgNTcgMzYgNTdINjRDNzIuODM2NiA1NyA4MCA2NS4wNTg5IDgwIDc1VjgwSDIwVjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
};

// Helper function to parse Google name
const parseGoogleName = (name) => {
  const nameParts = name.trim().split(' ');
  
  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      middleName: '',
      lastName: ''
    };
  } else if (nameParts.length === 2) {
    return {
      firstName: nameParts[0],
      middleName: '',
      lastName: nameParts[1]
    };
  } else if (nameParts.length >= 3) {
    return {
      firstName: nameParts[0],
      middleName: nameParts.slice(1, -1).join(' '),
      lastName: nameParts[nameParts.length - 1]
    };
  }
  
  return {
    firstName: name,
    middleName: '',
    lastName: ''
  };
};

// Google OAuth Registration
export const googleRegister = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists
    const existingUser = await Patientaccount.findOne({ patientemail: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Account with this email already exists. Please use login instead."
      });
    }

    // Parse the name
    const { firstName, middleName, lastName } = parseGoogleName(name);

    // Load default profile picture or use Google picture
    let profilePicture;
    if (picture) {
      // For now, use the Google picture URL directly or fallback to default
      try {
        // Simple validation of the picture URL
        if (picture.startsWith('https://')) {
          profilePicture = picture;
        } else {
          profilePicture = await loadDefaultProfilePic();
        }
      } catch (error) {
        console.error("Failed to process Google profile picture:", error);
        profilePicture = await loadDefaultProfilePic();
      }
    } else {
      profilePicture = await loadDefaultProfilePic();
    }

    // Create new patient account
    const patientData = {
      role: 'Patient',
      patientemail: email,
      patientpassword: 'google_auth_' + Math.random().toString(36), // Random password for Google users
      patientfirstname: firstName,
      patientmiddlename: middleName || '',
      patientlastname: lastName || 'N/A', // Provide default value if lastName is empty
      patientprofilepicture: profilePicture,
      isVerified: true // Google accounts are pre-verified
    };

    const newPatient = await Patientaccount.create(patientData);

    // Generate JWT token for auto-login
    const token = generateAuthToken(newPatient);

    // Remove password from response
    const { patientpassword: _, ...patientResponse } = newPatient.toObject();

    res.status(201).json({
      success: true,
      message: "Account created successfully with Google",
      autoLogin: true,
      jsontoken: token,
      patient: patientResponse
    });

  } catch (error) {
    console.error("Google registration error:", error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Registration validation failed",
        errors: validationErrors,
        details: error.errors
      });
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please use login instead."
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to register with Google",
      error: error.message
    });
  }
};

// Google OAuth Login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required"
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.VITE_GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    // Find existing user
    const patient = await Patientaccount.findOne({ patientemail: email })
      .select('_id patientemail patientfirstname patientlastname patientmiddlename patientprofilepicture patientId isVerified')
      .lean();

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email. Please register first."
      });
    }

    // Generate JWT token
    const token = generateAuthToken(patient);

    res.json({
      success: true,
      message: "Login successful",
      jsontoken: token,
      patient
    });

  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login with Google",
      error: error.message
    });
  }
};