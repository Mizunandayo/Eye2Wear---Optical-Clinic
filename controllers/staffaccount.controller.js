/* eslint-disable no-undef */
import Staffaccount from "../models/staffacount.js";
import AmbherInventoryCategory from "../models/ambherinventorycategory.js";
import BautistaInventoryCategory from "../models/bautistainventorycategory.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

dotenv.config();

//Retrieve (Single Staff) Controller
export const getstaffaccountbyid = async (req, res) => {
  try {
    const { id } = req.params;
    // Use lean() for better performance when not modifying the document
    const staffacc = await Staffaccount.findById(id).lean();
    
    if (!staffacc) {
      return res.status(404).json({ message: "Staff not found" });
    }
    
    res.status(200).json(staffacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getstaffaccounts = async (req, res) => {
  try {
    // Optimized query with field selection, lean(), and proper sorting
    const staffacc = await Staffaccount.find({})
      .select('staffId staffemail stafflastname stafffirstname staffmiddlename staffprofilepicture staffclinic staffiseyespecialist isVerified createdAt')
      .sort({ staffId: -1 }) // Sort by ID descending for newest first
      .lean(); // Returns plain JavaScript objects for better performance
    
    res.status(200).json(staffacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Retrieve (Single by lastname ) Controller
export const getstaffaccountbylastname = async (req, res) => {
  try {
    const { stafflastname } = req.params;
    const staffacc = await Staffaccount.findOne({stafflastname: stafflastname});
    res.status(200).json(staffacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








export const getloggedinstaffacc = async (req, res) => {
  try{

    const staff = await Staffaccount.findById(req.staff.id)
    .select('-password')
    .lean();

    if(!staff){
      return res.status(404).json({message: "Staff does not exist"});
    }

    res.status(200).json({
        stafflastname: staff.stafflastname,
        stafffirstname: staff.stafffirstname,
        staffmiddlename: staff.staffmiddlename,
        staffprofilepicture: staff.staffprofilepicture
    });

  }catch (error){

    console.error("Failed to fetch staff account details: ", error);
    res.status(500).json({
      message: "Error retrieving staff data",
      error: error.message
    });

  }
};


export const verifyloggedinstaffacc = async (req, res, next) => {
  try{
    const stafftoken = req.header('Authorization')?.replace('Bearer ','');

    if(!stafftoken){
      return res.status(401).json({message: 'Authorization required'});
    }

    const tokendecoded = jwt.verify(stafftoken, process.env.JWT_SECRET);
    req.staff = {
      id: tokendecoded.id,
      email: tokendecoded.email,
      role: tokendecoded.role,
      clinic: tokendecoded.clinic
    };
    next();
  
  }catch(error){
    console.error("Token not verified:", error);
    res.status(401).json({
      message:"Invalid Token",
      error: error.message
    });
  }
}


















//Retrieve (Existing Email) Controller
export const existingemail = async (req, res) => {
  try{

    const staffemail = req.params.staffemail;

    const existingemail = await Staffaccount.findOne({staffemail});
    res.json({exists: !!existingemail});
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};




//Create (Staff) Controller
export const createStaff = async (req, res) => {
  try {
    const staffacc = await Staffaccount.create(req.body);
    res.status(200).json(staffacc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





//Update (Staff) Controller
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the current staff before updating to compare changes
    const currentStaff = await Staffaccount.findById(id);
    if (!currentStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update the staff account
    const _staffacc = await Staffaccount.findByIdAndUpdate(id, req.body);
    const updatedstaffacc = await Staffaccount.findById(id);

    // Check if profile-related fields were updated
    const profileFieldsChanged = 
      req.body.staffprofilepicture && req.body.staffprofilepicture !== currentStaff.staffprofilepicture ||
      req.body.staffprofilepicture_public_id && req.body.staffprofilepicture_public_id !== currentStaff.staffprofilepicture_public_id ||
      req.body.stafffirstname && req.body.stafffirstname !== currentStaff.stafffirstname ||
      req.body.stafflastname && req.body.stafflastname !== currentStaff.stafflastname ||
      req.body.staffmiddlename && req.body.staffmiddlename !== currentStaff.staffmiddlename;

    // If profile fields changed, cascade updates to inventory categories
    if (profileFieldsChanged) {
      console.log('Staff profile fields changed, cascading updates to inventory categories...');
      console.log('Changed fields:', {
        profilePicture: req.body.staffprofilepicture !== currentStaff.staffprofilepicture,
        profilePicturePublicId: req.body.staffprofilepicture_public_id !== currentStaff.staffprofilepicture_public_id,
        firstName: req.body.stafffirstname !== currentStaff.stafffirstname,
        lastName: req.body.stafflastname !== currentStaff.stafflastname,
        middleName: req.body.staffmiddlename !== currentStaff.staffmiddlename
      });
      
      const updateData = {};
      
      // Only update fields that were actually changed
      if (req.body.staffprofilepicture && req.body.staffprofilepicture !== currentStaff.staffprofilepicture) {
        console.log('Updating staff profile picture from', currentStaff.staffprofilepicture, 'to', req.body.staffprofilepicture);
        updateData.ambherinventorycategoryaddedbyprofilepicture = req.body.staffprofilepicture;
        updateData.bautistainventorycategoryaddedbyprofilepicture = req.body.staffprofilepicture;
      }
      
      if (req.body.staffprofilepicture_public_id && req.body.staffprofilepicture_public_id !== currentStaff.staffprofilepicture_public_id) {
        console.log('Updating staff profile picture public_id from', currentStaff.staffprofilepicture_public_id, 'to', req.body.staffprofilepicture_public_id);
        updateData.ambherinventorycategoryaddedbyprofilepicture_public_id = req.body.staffprofilepicture_public_id;
        updateData.bautistainventorycategoryaddedbyprofilepicture_public_id = req.body.staffprofilepicture_public_id;
      }
      
      if (req.body.stafffirstname && req.body.stafffirstname !== currentStaff.stafffirstname) {
        updateData.ambherinventorycategoryaddedbyfirstname = req.body.stafffirstname;
        updateData.bautistainventorycategoryaddedbyfirstname = req.body.stafffirstname;
      }
      
      if (req.body.stafflastname && req.body.stafflastname !== currentStaff.stafflastname) {
        updateData.ambherinventorycategoryaddedbylastname = req.body.stafflastname;
        updateData.bautistainventorycategoryaddedbylastname = req.body.stafflastname;
      }
      
      if (req.body.staffmiddlename && req.body.staffmiddlename !== currentStaff.staffmiddlename) {
        updateData.ambherinventorycategoryaddedbymiddlename = req.body.staffmiddlename;
        updateData.bautistainventorycategoryaddedbymiddlename = req.body.staffmiddlename;
      }

      console.log('Final staff updateData object:', updateData);

      // Update Ambher inventory categories created by this staff
      const ambherUpdateData = {};
      Object.keys(updateData).forEach(key => {
        if (key.startsWith('ambher')) {
          ambherUpdateData[key] = updateData[key];
        }
      });

      console.log('Staff Ambher update data:', ambherUpdateData);
      if (Object.keys(ambherUpdateData).length > 0) {
        const result = await AmbherInventoryCategory.updateMany(
          { ambherinventorycategoryaddedbyemail: currentStaff.staffemail },
          { $set: { ...ambherUpdateData, updatedAt: new Date() } }
        );
        console.log(`Updated ${result.modifiedCount} Ambher inventory categories for staff: ${currentStaff.staffemail}`);
      }

      // Update Bautista inventory categories created by this staff
      const bautistaUpdateData = {};
      Object.keys(updateData).forEach(key => {
        if (key.startsWith('bautista')) {
          bautistaUpdateData[key] = updateData[key];
        }
      });

      console.log('Staff Bautista update data:', bautistaUpdateData);
      if (Object.keys(bautistaUpdateData).length > 0) {
        const result = await BautistaInventoryCategory.updateMany(
          { bautistainventorycategoryaddedbyemail: currentStaff.staffemail },
          { $set: { ...bautistaUpdateData, updatedAt: new Date() } }
        );
        console.log(`Updated ${result.modifiedCount} Bautista inventory categories for staff: ${currentStaff.staffemail}`);
      }
    }

    res.status(200).json(updatedstaffacc);
  } catch (error) {
    console.error('Error updating staff account and cascading updates:', error);
    res.status(500).json({ message: error.message });
  }
};





//Delete (Staff) Controller
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    let staffacc = await Staffaccount.findOneAndDelete({staffId: id});
    
    if (!staffacc) {
      staffacc = await Staffaccount.findByIdAndDelete(id);
    }

    if (!staffacc) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};










//Login Staff Controller
export const stafflogin = async(req, res) => {
  try{
    const {staffemail,staffpassword} = req.body;

    const staff = await Staffaccount.findOne({staffemail}).select('+staffpassword');
    if(!staff) {
      return res.status(401).json({message:"Login Error, Invalid Credentials"});
    }

    const loginmatch = await bcrypt.compare(staffpassword, staff.staffpassword);
    if(!loginmatch) {
      return res.status(401).json({message:"Login Error, Invalid Credentials"});
    }

    const jsontoken = jwt.sign(
      {
        id: staff._id,
        email: staff.staffemail,
        role: 'staff',
        clinic: staff.staffclinic,
        name: `${staff.stafffirstname} ${staff.stafflastname}`
      },
      process.env.JWT_SECRET,
      {expiresIn: "30d"}
    );

    const stafflogin = staff.toObject();
    delete stafflogin.staffpassword;

    res.json({
      message:"Login Success",
      jsontoken,
      staff: stafflogin
    });

  } catch(error){
    console.error("Login Failed", error);
    res.status(500).json({message:"Server Failed"});
  }
};