import express from "express";
import {
  uploadProfilePicture,
  uploadProductImages,
  uploadPaymentReceipt,
  uploadOtherClinicRecordImages,
  deleteImage,
  getOptimizedImageUrl,
  testCloudinaryConnection
} from "../controllers/cloudinary.controller.js";

const router = express.Router();

// Upload profile picture (for patients, staff, owners)
router.post("/upload/profile", uploadProfilePicture);

// Upload product images (for inventory products)
router.post("/upload/product-images", uploadProductImages);

// Upload payment receipt image
router.post("/upload/payment-receipt", uploadPaymentReceipt);

// Upload other clinic record images (profile picture and record image)
router.post("/upload/clinic-record-images", uploadOtherClinicRecordImages);

// Delete image by public_id
router.delete("/delete/:public_id", deleteImage);

// Get optimized image URL
router.get("/optimize", getOptimizedImageUrl);

// Test Cloudinary connection
router.get("/test-connection", testCloudinaryConnection);

export default router;