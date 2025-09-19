/* eslint-disable no-undef */
import Owneraccount from "../models/owneraccount.js";
import AmbherInventoryCategory from "../models/ambherinventorycategory.js";
import BautistaInventoryCategory from "../models/bautistainventorycategory.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();


//Retrieve (All Owner) Controller
export const getowneraccounts = async (req, res) => {
  try {
    // Optimized query with field selection, lean(), and proper sorting
    const owneracc = await Owneraccount.find({})
      .select('ownerId owneremail ownerlastname ownerfirstname ownermiddlename ownerprofilepicture ownerclinic owneriseyespecialist isVerified createdAt')
      .sort({ ownerId: -1 }) // Sort by ID descending for newest first
      .lean(); // Returns plain JavaScript objects for better performance
    
    res.status(200).json(owneracc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//Retrieve (Single ) Controller
export const getowneraccountbyid = async (req, res) => {
  try {
    const { id } = req.params;
    // Use lean() for better performance when not modifying the document
    const owneracc = await Owneraccount.findById(id).lean();
    
    if (!owneracc) {
      return res.status(404).json({ message: "Owner not found" });
    }
    
    res.status(200).json(owneracc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Retrieve (Single by lastname ) Controller
export const getowneraccountbylastname = async (req, res) => {
  try {
    const { ownerlastname } = req.params;
    const owneracc = await Owneraccount.findOne({ownerlastname: ownerlastname});
    res.status(200).json(owneracc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








export const getloggedinowneracc = async (req, res) => {
  try{

    const owner = await Owneraccount.findById(req.owner.id)
    .select('-password')
    .lean();

    if(!owner){
      return res.status(404).json({message: "owner does not exist"});
    }

    res.status(200).json({
        ownerlastname: owner.ownerlastname,
        ownerfirstname: owner.ownerfirstname,
        ownermiddlename: owner.ownermiddlename,
        ownerprofilepicture: owner.ownerprofilepicture,
        ownerclinic: owner.ownerclinic
    });

  }catch (error){

    console.error("Failed to fetch owner account details: ", error);
    res.status(500).json({
      message: "Error retrieving owner data",
      error: error.message
    });

  }
};


export const verifyloggedinowneracc = async (req, res, next) => {
  try{
    const ownertoken = req.header('Authorization')?.replace('Bearer ','');

    if(!ownertoken){
      return res.status(401).json({message: 'Authorization required'});
    }

    const tokendecoded = jwt.verify(ownertoken, process.env.JWT_SECRET);
    req.owner = {
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

    const owneremail = req.params.owneremail;

    const existingemail = await Owneraccount.findOne({owneremail});
    res.json({exists: !!existingemail});
  }
  catch(error){
    res.status(500).json({ message: error.message });
  }
};




//Create (owner) Controller
export const createOwner = async (req, res) => {
  try {
    const owneracc = await Owneraccount.create(req.body);
    res.status(200).json(owneracc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





//Update (Owner) Controller
export const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the current owner before updating to compare changes
    const currentOwner = await Owneraccount.findById(id);
    if (!currentOwner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Update the owner account
    const _owneracc = await Owneraccount.findByIdAndUpdate(id, req.body);
    const updatedowneracc = await Owneraccount.findById(id);

    // Check if profile-related fields were updated
    const profileFieldsChanged = 
      req.body.ownerprofilepicture && req.body.ownerprofilepicture !== currentOwner.ownerprofilepicture ||
      req.body.ownerprofilepicture_public_id && req.body.ownerprofilepicture_public_id !== currentOwner.ownerprofilepicture_public_id ||
      req.body.ownerfirstname && req.body.ownerfirstname !== currentOwner.ownerfirstname ||
      req.body.ownerlastname && req.body.ownerlastname !== currentOwner.ownerlastname ||
      req.body.ownermiddlename && req.body.ownermiddlename !== currentOwner.ownermiddlename;

    // If profile fields changed, cascade updates to inventory categories
    if (profileFieldsChanged) {
      console.log('Owner profile fields changed, cascading updates to inventory categories...');
      console.log('Changed fields:', {
        profilePicture: req.body.ownerprofilepicture !== currentOwner.ownerprofilepicture,
        profilePicturePublicId: req.body.ownerprofilepicture_public_id !== currentOwner.ownerprofilepicture_public_id,
        firstName: req.body.ownerfirstname !== currentOwner.ownerfirstname,
        lastName: req.body.ownerlastname !== currentOwner.ownerlastname,
        middleName: req.body.ownermiddlename !== currentOwner.ownermiddlename
      });
      
      const updateData = {};
      
      // Only update fields that were actually changed
      if (req.body.ownerprofilepicture && req.body.ownerprofilepicture !== currentOwner.ownerprofilepicture) {
        console.log('Updating profile picture from', currentOwner.ownerprofilepicture, 'to', req.body.ownerprofilepicture);
        updateData.ambherinventorycategoryaddedbyprofilepicture = req.body.ownerprofilepicture;
        updateData.bautistainventorycategoryaddedbyprofilepicture = req.body.ownerprofilepicture;
      }
      
      if (req.body.ownerprofilepicture_public_id && req.body.ownerprofilepicture_public_id !== currentOwner.ownerprofilepicture_public_id) {
        console.log('Updating profile picture public_id from', currentOwner.ownerprofilepicture_public_id, 'to', req.body.ownerprofilepicture_public_id);
        updateData.ambherinventorycategoryaddedbyprofilepicture_public_id = req.body.ownerprofilepicture_public_id;
        updateData.bautistainventorycategoryaddedbyprofilepicture_public_id = req.body.ownerprofilepicture_public_id;
      }
      
      if (req.body.ownerfirstname && req.body.ownerfirstname !== currentOwner.ownerfirstname) {
        updateData.ambherinventorycategoryaddedbyfirstname = req.body.ownerfirstname;
        updateData.bautistainventorycategoryaddedbyfirstname = req.body.ownerfirstname;
      }
      
      if (req.body.ownerlastname && req.body.ownerlastname !== currentOwner.ownerlastname) {
        updateData.ambherinventorycategoryaddedbylastname = req.body.ownerlastname;
        updateData.bautistainventorycategoryaddedbylastname = req.body.ownerlastname;
      }
      
      if (req.body.ownermiddlename && req.body.ownermiddlename !== currentOwner.ownermiddlename) {
        updateData.ambherinventorycategoryaddedbymiddlename = req.body.ownermiddlename;
        updateData.bautistainventorycategoryaddedbymiddlename = req.body.ownermiddlename;
      }

      console.log('Final updateData object:', updateData);

      // Update Ambher inventory categories created by this owner
      const ambherUpdateData = {};
      Object.keys(updateData).forEach(key => {
        if (key.startsWith('ambher')) {
          ambherUpdateData[key] = updateData[key];
        }
      });

      console.log('Ambher update data:', ambherUpdateData);
      if (Object.keys(ambherUpdateData).length > 0) {
        const result = await AmbherInventoryCategory.updateMany(
          { ambherinventorycategoryaddedbyemail: currentOwner.owneremail },
          { $set: { ...ambherUpdateData, updatedAt: new Date() } }
        );
        console.log(`Updated ${result.modifiedCount} Ambher inventory categories for owner: ${currentOwner.owneremail}`);
      }

      // Update Bautista inventory categories created by this owner
      const bautistaUpdateData = {};
      Object.keys(updateData).forEach(key => {
        if (key.startsWith('bautista')) {
          bautistaUpdateData[key] = updateData[key];
        }
      });

      console.log('Bautista update data:', bautistaUpdateData);
      if (Object.keys(bautistaUpdateData).length > 0) {
        const result = await BautistaInventoryCategory.updateMany(
          { bautistainventorycategoryaddedbyemail: currentOwner.owneremail },
          { $set: { ...bautistaUpdateData, updatedAt: new Date() } }
        );
        console.log(`Updated ${result.modifiedCount} Bautista inventory categories for owner: ${currentOwner.owneremail}`);
      }
    }

    res.status(200).json(updatedowneracc);
  } catch (error) {
    console.error('Error updating owner account and cascading updates:', error);
    res.status(500).json({ message: error.message });
  }
};




//Delete (Owner) Controller
export const deleteOwner= async (req, res) => {
  try {
    const { id } = req.params;
    let owneracc = await Owneraccount.findOneAndDelete({ownerId: id});
    
    if (!owneracc) {
      owneracc = await Owneraccount.findByIdAndDelete(id);
    }

    if (!owneracc) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({ message: "Owner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};









//Login owner Controller
export const ownerlogin = async(req, res) => {
  try{
    const {owneremail,ownerpassword} = req.body;

    const owner = await Owneraccount.findOne({owneremail}).select('+ownerpassword');
    if(!owner) {
      return res.status(401).json({message:"Login Error, Invalid Credentials"});
    }

    const loginmatch = await bcrypt.compare(ownerpassword, owner.ownerpassword);
    if(!loginmatch) {
      return res.status(401).json({message:"Login Error, Invalid Credentials"});
    }

    const jsontoken = jwt.sign(
      {
        id: owner._id,
        email: owner.owneremail,
        role: 'owner',
        clinic: owner.ownerclinic,
        name: `${owner.ownerfirstname} ${owner.ownerlastname}`
      },
      process.env.JWT_SECRET,
      {expiresIn: "30d"}
    );

    const ownerlogin = owner.toObject();
    delete ownerlogin.ownerpassword;

    res.json({
      message:"Login Success",
      jsontoken,
      owner: ownerlogin
    });

  } catch(error){
    console.error("Login Failed", error);
    res.status(500).json({message:"Server Failed"});
  }
};