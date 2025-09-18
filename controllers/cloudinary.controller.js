/* eslint-disable no-undef */
import CloudinaryService from "../utils/cloudinaryService.js";
import multer from 'multer';

/**
 * Enhanced Image Upload Controller with Cloudinary Integration
 * This controller provides examples for handling image uploads across different models
 */

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * Upload Profile Picture (for Patient, Staff, Owner accounts)
 */
export const uploadProfilePicture = [
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const { userId, userType } = req.body;
      
      console.log('Cloudinary upload request:', { userId, userType, hasFile: !!req.file });
      
      if (!userId || !userType) {
        console.log('Missing userId or userType:', { userId, userType });
        return res.status(400).json({
          success: false,
          message: 'User ID and user type are required'
        });
      }

      // Upload to Cloudinary
      const uploadResult = await CloudinaryService.uploadImage(
        req.file.buffer,
        {
          folder: `eye2wear/profiles/${userType}`,
          public_id: `${userType}_${userId}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        }
      );

      // Determine which model to update based on userType
      let Model;
      let updateField;
      let publicIdField;
      
      switch (userType) {
        case 'patient': {
          const Patientdemographic = (await import('../models/patientdemographic.js')).default;
          Model = Patientdemographic;
          updateField = 'patientprofilepicture';
          publicIdField = 'patientprofilepicture_public_id';
          break;
        }
        case 'staff': {
          const Staffaccount = (await import('../models/staffacount.js')).default;
          Model = Staffaccount;
          updateField = 'staffprofilepicture';
          publicIdField = 'staffprofilepicture_public_id';
          break;
        }
        case 'owner': {
          const Owneraccount = (await import('../models/owneraccount.js')).default;
          Model = Owneraccount;
          updateField = 'ownerprofilepicture';
          publicIdField = 'ownerprofilepicture_public_id';
          break;
        }
        case 'admin': {
          const Adminaccount = (await import('../models/adminaccount.js')).default;
          Model = Adminaccount;
          updateField = 'adminprofilepicture';
          publicIdField = 'adminprofilepicture_public_id';
          break;
        }
        case 'other': {
          // For other clinic records, we'll just upload to Cloudinary without updating any model
          // The frontend will handle storing the URL
          Model = null;
          updateField = null;
          publicIdField = null;
          break;
        }
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid user type'
          });
      }

      // Get current user to delete old image if exists
      let currentUser;
      
      // Handle 'other' type (no database update needed)
      if (userType === 'other') {
        return res.status(200).json({
          success: true,
          message: 'Image uploaded successfully to Cloudinary',
          data: {
            imageUrl: uploadResult.url,
            public_id: uploadResult.public_id
          }
        });
      }
      
      if (userType === 'patient') {
        // For patients, try to find by ID first, then by email if ID doesn't work
        if (userId.includes('@')) {
          // If userId looks like an email, search by email
          currentUser = await Model.findOne({ patientemail: userId });
        } else {
          // Try to find by ID, but don't fail if it's not a valid ObjectId
          try {
            currentUser = await Model.findById(userId);
          } catch {
            // If ID is invalid, try to find by email in case userId is actually an email
            currentUser = await Model.findOne({ patientemail: userId });
          }
        }
      } else if (userType === 'staff') {
        // For staff, handle email identifier properly
        if (userId.includes('@')) {
          // If userId looks like an email, search by email
          currentUser = await Model.findOne({ staffemail: userId });
        } else {
          // Try to find by ID first
          try {
            currentUser = await Model.findById(userId);
          } catch {
            // If ID is invalid, try to find by email in case userId is actually an email
            currentUser = await Model.findOne({ staffemail: userId });
          }
        }
      } else if (userType === 'owner') {
        // For owners, handle email identifier properly
        if (userId.includes('@')) {
          // If userId looks like an email, search by email
          currentUser = await Model.findOne({ owneremail: userId });
        } else {
          // Try to find by ID first
          try {
            currentUser = await Model.findById(userId);
          } catch {
            // If ID is invalid, try to find by email in case userId is actually an email
            currentUser = await Model.findOne({ owneremail: userId });
          }
        }
      } else if (userType === 'admin') {
        // For admins, handle email identifier properly
        if (userId.includes('@')) {
          // If userId looks like an email, search by email
          currentUser = await Model.findOne({ adminemail: userId });
        } else {
          // Try to find by ID first
          try {
            currentUser = await Model.findById(userId);
          } catch {
            // If ID is invalid, try to find by email in case userId is actually an email
            currentUser = await Model.findOne({ adminemail: userId });
          }
        }
      } else {
        // For other user types, use the original findById approach
        currentUser = await Model.findById(userId);
      }
      
      if (!currentUser && userType === 'patient') {
        // For patients, we'll just upload the image without updating any existing record
        // The demographic creation/update will handle linking the image later
        return res.status(200).json({
          success: true,
          message: 'Profile picture uploaded successfully (no existing record to update)',
          data: {
            imageUrl: uploadResult.url,
            public_id: uploadResult.public_id
          }
        });
      } else if (!currentUser) {
        return res.status(404).json({
          success: false,
          message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found`
        });
      }

      // Delete old image if exists
      if (currentUser[publicIdField]) {
        try {
          await CloudinaryService.deleteImage(currentUser[publicIdField]);
        } catch (deleteError) {
          console.warn('Could not delete old image:', deleteError.message);
        }
      }

      // Update user with new image URL and public_id
      const updateData = {
        [updateField]: uploadResult.url,
        [publicIdField]: uploadResult.public_id
      };

      let updatedUser;
      if (userType === 'patient' && userId.includes('@')) {
        // If we found patient by email, update by email
        updatedUser = await Model.findOneAndUpdate(
          { patientemail: userId },
          updateData,
          { new: true, runValidators: true }
        );
      } else if (userType === 'staff' && userId.includes('@')) {
        // If we found staff by email, update by email
        updatedUser = await Model.findOneAndUpdate(
          { staffemail: userId },
          updateData,
          { new: true, runValidators: true }
        );
      } else if (userType === 'owner' && userId.includes('@')) {
        // If we found owner by email, update by email
        updatedUser = await Model.findOneAndUpdate(
          { owneremail: userId },
          updateData,
          { new: true, runValidators: true }
        );
      } else {
        // Update by ID for other cases
        updatedUser = await Model.findByIdAndUpdate(
          currentUser._id, // Use the actual found user's ID
          updateData,
          { new: true, runValidators: true }
        );
      }

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: {
          imageUrl: uploadResult.url,
          public_id: uploadResult.public_id,
          user: updatedUser
        }
      });

    } catch (error) {
      console.error('Profile picture upload error:', {
        message: error.message,
        stack: error.stack,
        userId: req.body?.userId,
        userType: req.body?.userType
      });
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile picture',
        error: error.message
      });
    }
  }
];

/**
 * Upload Product Images (for Inventory Products)
 */
export const uploadProductImages = [
  upload.array('productImages', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided'
        });
      }

      const { productId, productType } = req.body;
      
      if (!productId || !productType) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and product type are required'
        });
      }

      // Upload multiple images to Cloudinary
      const uploadPromises = req.files.map(file => 
        CloudinaryService.uploadImage(
          file.buffer,
          {
            folder: `eye2wear/products/${productType}`,
            public_id: `${productType}_${productId}_${Date.now()}_${Math.random()}`,
            transformation: [
              { width: 800, height: 800, crop: 'fit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          }
        )
      );

      const uploadResults = await Promise.all(uploadPromises);
      
      // Extract URLs and public_ids
      const imageUrls = uploadResults.map(result => result.url);
      const publicIds = uploadResults.map(result => result.public_id);

      // If productId is 'temp', just return the URLs without updating database
      if (productId === 'temp') {
        return res.status(200).json({
          success: true,
          message: 'Product images uploaded successfully (temporary)',
          data: {
            imageUrls: imageUrls,
            public_ids: publicIds
          }
        });
      }

      // Determine which model to update
      let Model;
      let updateField;
      let publicIdField;
      
      switch (productType) {
        case 'ambher': {
          const AmbherInventoryProduct = (await import('../models/ambherinventoryproduct.js')).default;
          Model = AmbherInventoryProduct;
          updateField = 'ambherinventoryproductimagepreviewimages';
          publicIdField = 'ambherinventoryproductimagepreviewimages_public_ids';
          break;
        }
        case 'bautista': {
          const BautistaInventoryProduct = (await import('../models/bautistainventoryproduct.js')).default;
          Model = BautistaInventoryProduct;
          updateField = 'bautistainventoryproductimagepreviewimages';
          publicIdField = 'bautistainventoryproductimagepreviewimages_public_ids';
          break;
        }
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid product type'
          });
      }

      // Get current product to delete old images if exists
      const currentProduct = await Model.findById(productId);
      
      if (!currentProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Delete old images if exists
      if (currentProduct[publicIdField] && currentProduct[publicIdField].length > 0) {
        try {
          await CloudinaryService.deleteMultipleImages(currentProduct[publicIdField]);
        } catch (deleteError) {
          console.warn('Could not delete old images:', deleteError.message);
        }
      }

      // Update product with new image URLs and public_ids
      const updateData = {
        [updateField]: imageUrls,
        [publicIdField]: publicIds
      };

      const updatedProduct = await Model.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Product images uploaded successfully',
        data: {
          imageUrls: imageUrls,
          public_ids: publicIds,
          product: updatedProduct
        }
      });

    } catch (error) {
      console.error('Product images upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload product images',
        error: error.message
      });
    }
  }
];

/**
 * Upload Payment Receipt Image
 */
export const uploadPaymentReceipt = [
  upload.single('receiptImage'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No receipt image file provided'
        });
      }

      const { orderId, orderType } = req.body;
      
      if (!orderId || !orderType) {
        return res.status(400).json({
          success: false,
          message: 'Order ID and order type are required'
        });
      }

      // Upload to Cloudinary
      const uploadResult = await CloudinaryService.uploadImage(
        req.file.buffer,
        {
          folder: `eye2wear/receipts/${orderType}`,
          public_id: `receipt_${orderType}_${orderId}_${Date.now()}`,
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        }
      );

      // Determine which model to update
      let Model;
      let updateField;
      let publicIdField;
      
      switch (orderType) {
        case 'ambher': {
          const PatientOrderAmbher = (await import('../models/patientorderambher.js')).default;
          Model = PatientOrderAmbher;
          updateField = 'patientorderambherproductpaymentreceiptimage';
          publicIdField = 'patientorderambherproductpaymentreceiptimage_public_id';
          break;
        }
        case 'bautista': {
          const PatientOrderBautista = (await import('../models/patientorderbautista.js')).default;
          Model = PatientOrderBautista;
          updateField = 'patientorderbautistaproductpaymentreceiptimage';
          publicIdField = 'patientorderbautistaproductpaymentreceiptimage_public_id';
          break;
        }
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid order type'
          });
      }

      // Get current order to delete old receipt if exists
      const currentOrder = await Model.findById(orderId);
      
      if (!currentOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Delete old receipt image if exists
      if (currentOrder[publicIdField]) {
        try {
          await CloudinaryService.deleteImage(currentOrder[publicIdField]);
        } catch (deleteError) {
          console.warn('Could not delete old receipt:', deleteError.message);
        }
      }

      // Update order with new receipt URL and public_id
      const updateData = {
        [updateField]: uploadResult.url,
        [publicIdField]: uploadResult.public_id
      };

      const updatedOrder = await Model.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Payment receipt uploaded successfully',
        data: {
          receiptUrl: uploadResult.url,
          public_id: uploadResult.public_id,
          order: updatedOrder
        }
      });

    } catch (error) {
      console.error('Payment receipt upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload payment receipt',
        error: error.message
      });
    }
  }
];

/**
 * Upload Other Clinic Record Images (Profile Picture and Record Image)
 */
export const uploadOtherClinicRecordImages = [
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'recordImage', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { recordId } = req.body;
      
      if (!recordId) {
        return res.status(400).json({
          success: false,
          message: 'Record ID is required'
        });
      }

      const uploadResults = {};
      
      // Upload profile picture if provided
      if (req.files && req.files.profilePicture) {
        const profileFile = req.files.profilePicture[0];
        const profileUploadResult = await CloudinaryService.uploadImage(
          profileFile.buffer,
          {
            folder: 'eye2wear/clinic-records/profiles',
            public_id: `clinic_profile_${recordId}_${Date.now()}`,
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          }
        );
        uploadResults.profilePicture = {
          url: profileUploadResult.url,
          public_id: profileUploadResult.public_id
        };
      }

      // Upload record image if provided
      if (req.files && req.files.recordImage) {
        const recordFile = req.files.recordImage[0];
        const recordUploadResult = await CloudinaryService.uploadImage(
          recordFile.buffer,
          {
            folder: 'eye2wear/clinic-records/documents',
            public_id: `clinic_record_${recordId}_${Date.now()}`,
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          }
        );
        uploadResults.recordImage = {
          url: recordUploadResult.url,
          public_id: recordUploadResult.public_id
        };
      }

      if (Object.keys(uploadResults).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided'
        });
      }

      // Get current record to delete old images if they exist
      const OtherClinicRecord = (await import('../models/otherclinicrecord.js')).default;
      const currentRecord = await OtherClinicRecord.findById(recordId);
      
      if (!currentRecord) {
        return res.status(404).json({
          success: false,
          message: 'Clinic record not found'
        });
      }

      // Delete old images if they exist
      if (uploadResults.profilePicture && currentRecord.patientotherclinicprofilepicture_public_id) {
        try {
          await CloudinaryService.deleteImage(currentRecord.patientotherclinicprofilepicture_public_id);
        } catch (deleteError) {
          console.warn('Could not delete old profile picture:', deleteError.message);
        }
      }

      if (uploadResults.recordImage && currentRecord.patientotherclinicrecordimage_public_id) {
        try {
          await CloudinaryService.deleteImage(currentRecord.patientotherclinicrecordimage_public_id);
        } catch (deleteError) {
          console.warn('Could not delete old record image:', deleteError.message);
        }
      }

      // Update record with new image URLs and public_ids
      const updateData = {};
      if (uploadResults.profilePicture) {
        updateData.patientotherclinicprofilepicture = uploadResults.profilePicture.url;
        updateData.patientotherclinicprofilepicture_public_id = uploadResults.profilePicture.public_id;
      }
      if (uploadResults.recordImage) {
        updateData.patientotherclinicrecordimage = uploadResults.recordImage.url;
        updateData.patientotherclinicrecordimage_public_id = uploadResults.recordImage.public_id;
      }

      const updatedRecord = await OtherClinicRecord.findByIdAndUpdate(
        recordId,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Clinic record images uploaded successfully',
        data: {
          uploadResults,
          record: updatedRecord
        }
      });

    } catch (error) {
      console.error('Clinic record images upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload clinic record images',
        error: error.message
      });
    }
  }
];

/**
 * Delete Image by Public ID
 */
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;
    
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await CloudinaryService.deleteImage(public_id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result
    });

  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

/**
 * Get Optimized Image URL
 */
export const getOptimizedImageUrl = async (req, res) => {
  try {
    const { public_id, type = 'default' } = req.query;
    
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const optimizedUrl = CloudinaryService.getOptimizedUrl(public_id, type);

    res.status(200).json({
      success: true,
      optimizedUrl
    });

  } catch (error) {
    console.error('Image optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get optimized image URL',
      error: error.message
    });
  }
};

/**
 * Test Cloudinary Connection
 */
export const testCloudinaryConnection = async (req, res) => {
  try {
    const result = await CloudinaryService.testConnection();
    
    res.status(result.success ? 200 : 500).json(result);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to test Cloudinary connection',
      error: error.message
    });
  }
};