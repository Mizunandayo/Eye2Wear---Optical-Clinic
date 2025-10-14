import express from "express";
import {
  getAmbherServices,
  getAmbherServiceById,
  checkAmbherServiceNameExists,
  createAmbherService,
  updateAmbherService,
  archiveAmbherService,
  deleteAmbherService
} from "../controllers/ambherservice.controller.js";

const router = express.Router();

// Get all services
router.get("/", getAmbherServices);

// Get single service by ID
router.get("/:id", getAmbherServiceById);

// Check if service name exists
router.post("/check-name", checkAmbherServiceNameExists);

// Create new service
router.post("/", createAmbherService);

// Update service
router.put("/:id", updateAmbherService);

// Archive/Unarchive service
router.patch("/:id/archive", archiveAmbherService);

// Delete service
router.delete("/:id", deleteAmbherService);

export default router;
