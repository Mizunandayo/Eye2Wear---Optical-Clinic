import express from "express";
import {
  getBautistaServices,
  getBautistaServiceById,
  checkBautistaServiceNameExists,
  createBautistaService,
  updateBautistaService,
  archiveBautistaService,
  deleteBautistaService
} from "../controllers/bautistaservice.controller.js";

const router = express.Router();

// Get all services
router.get("/", getBautistaServices);

// Get single service by ID
router.get("/:id", getBautistaServiceById);

// Check if service name exists
router.post("/check-name", checkBautistaServiceNameExists);

// Create new service
router.post("/", createBautistaService);

// Update service
router.put("/:id", updateBautistaService);

// Archive/Unarchive service
router.patch("/:id/archive", archiveBautistaService);

// Delete service
router.delete("/:id", deleteBautistaService);

export default router;
