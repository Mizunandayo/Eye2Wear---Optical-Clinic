import Ambherservice from "../models/ambherservice.js";

// Get all Ambher services
export const getAmbherServices = async (req, res) => {
  try {
    const services = await Ambherservice.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching Ambher services:", error);
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

// Get single Ambher service by ID
export const getAmbherServiceById = async (req, res) => {
  try {
    const service = await Ambherservice.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching Ambher service:", error);
    res.status(500).json({ message: "Error fetching service", error: error.message });
  }
};

// Check if service name exists
export const checkAmbherServiceNameExists = async (req, res) => {
  try {
    const { servicename, excludeId } = req.body;
    
    const query = { 
      ambherservicename: { $regex: new RegExp(`^${servicename}$`, 'i') }
    };
    
    // Exclude current service ID when editing
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingService = await Ambherservice.findOne(query);
    
    res.status(200).json({ exists: !!existingService });
  } catch (error) {
    console.error("Error checking service name:", error);
    res.status(500).json({ message: "Error checking service name", error: error.message });
  }
};

// Create new Ambher service
export const createAmbherService = async (req, res) => {
  try {
    const {
      ambherservicename,
      ambherservicedescription,
      ambherserviceprice,
      ambherserviceaddedby,
      ambherserviceaddedbytype,
      ambherserviceaddedbyfirstname,
      ambherserviceaddedbylastname,
      ambherserviceaddedbyprofilepicture
    } = req.body;

    // Check if service name already exists
    const existingService = await Ambherservice.findOne({
      ambherservicename: { $regex: new RegExp(`^${ambherservicename}$`, 'i') }
    });

    if (existingService) {
      return res.status(400).json({ message: "Service name already exists" });
    }

    const newService = new Ambherservice({
      ambherservicename,
      ambherservicedescription,
      ambherserviceprice,
      ambherserviceaddedby,
      ambherserviceaddedbytype,
      ambherserviceaddedbyfirstname,
      ambherserviceaddedbylastname,
      ambherserviceaddedbyprofilepicture
    });

    const savedService = await newService.save();
    res.status(201).json({
      message: "Service created successfully",
      service: savedService
    });
  } catch (error) {
    console.error("Error creating Ambher service:", error);
    res.status(500).json({ message: "Error creating service", error: error.message });
  }
};

// Update Ambher service
export const updateAmbherService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ambherservicename,
      ambherservicedescription,
      ambherserviceprice
    } = req.body;

    // Check if service name already exists (excluding current service)
    if (ambherservicename) {
      const existingService = await Ambherservice.findOne({
        ambherservicename: { $regex: new RegExp(`^${ambherservicename}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingService) {
        return res.status(400).json({ message: "Service name already exists" });
      }
    }

    const updatedService = await Ambherservice.findByIdAndUpdate(
      id,
      {
        ambherservicename,
        ambherservicedescription,
        ambherserviceprice
      },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService
    });
  } catch (error) {
    console.error("Error updating Ambher service:", error);
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};

// Archive/Unarchive Ambher service
export const archiveAmbherService = async (req, res) => {
  try {
    const { id } = req.params;
    const { archive } = req.body;

    const updatedService = await Ambherservice.findByIdAndUpdate(
      id,
      { ambherserviceisarchived: archive },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: archive ? "Service archived successfully" : "Service unarchived successfully",
      service: updatedService
    });
  } catch (error) {
    console.error("Error archiving Ambher service:", error);
    res.status(500).json({ message: "Error archiving service", error: error.message });
  }
};

// Delete Ambher service (if needed)
export const deleteAmbherService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Ambherservice.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service deleted successfully",
      service: deletedService
    });
  } catch (error) {
    console.error("Error deleting Ambher service:", error);
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};
