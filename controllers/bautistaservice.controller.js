import Bautistaservice from "../models/bautistaservice.js";

// Get all Bautista services
export const getBautistaServices = async (req, res) => {
  try {
    const services = await Bautistaservice.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching Bautista services:", error);
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

// Get single Bautista service by ID
export const getBautistaServiceById = async (req, res) => {
  try {
    const service = await Bautistaservice.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching Bautista service:", error);
    res.status(500).json({ message: "Error fetching service", error: error.message });
  }
};

// Check if service name exists
export const checkBautistaServiceNameExists = async (req, res) => {
  try {
    const { servicename, excludeId } = req.body;
    
    const query = { 
      bautistaservicename: { $regex: new RegExp(`^${servicename}$`, 'i') }
    };
    
    // Exclude current service ID when editing
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingService = await Bautistaservice.findOne(query);
    
    res.status(200).json({ exists: !!existingService });
  } catch (error) {
    console.error("Error checking service name:", error);
    res.status(500).json({ message: "Error checking service name", error: error.message });
  }
};

// Create new Bautista service
export const createBautistaService = async (req, res) => {
  try {
    const {
      bautistaservicename,
      bautistaservicedescription,
      bautistaserviceprice,
      bautistaserviceaddedby,
      bautistaserviceaddedbytype,
      bautistaserviceaddedbyfirstname,
      bautistaserviceaddedbylastname,
      bautistaserviceaddedbyprofilepicture
    } = req.body;

    // Check if service name already exists
    const existingService = await Bautistaservice.findOne({
      bautistaservicename: { $regex: new RegExp(`^${bautistaservicename}$`, 'i') }
    });

    if (existingService) {
      return res.status(400).json({ message: "Service name already exists" });
    }

    const newService = new Bautistaservice({
      bautistaservicename,
      bautistaservicedescription,
      bautistaserviceprice,
      bautistaserviceaddedby,
      bautistaserviceaddedbytype,
      bautistaserviceaddedbyfirstname,
      bautistaserviceaddedbylastname,
      bautistaserviceaddedbyprofilepicture
    });

    const savedService = await newService.save();
    res.status(201).json({
      message: "Service created successfully",
      service: savedService
    });
  } catch (error) {
    console.error("Error creating Bautista service:", error);
    res.status(500).json({ message: "Error creating service", error: error.message });
  }
};

// Update Bautista service
export const updateBautistaService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bautistaservicename,
      bautistaservicedescription,
      bautistaserviceprice
    } = req.body;

    // Check if service name already exists (excluding current service)
    if (bautistaservicename) {
      const existingService = await Bautistaservice.findOne({
        bautistaservicename: { $regex: new RegExp(`^${bautistaservicename}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingService) {
        return res.status(400).json({ message: "Service name already exists" });
      }
    }

    const updatedService = await Bautistaservice.findByIdAndUpdate(
      id,
      {
        bautistaservicename,
        bautistaservicedescription,
        bautistaserviceprice
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
    console.error("Error updating Bautista service:", error);
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};

// Archive/Unarchive Bautista service
export const archiveBautistaService = async (req, res) => {
  try {
    const { id } = req.params;
    const { archive } = req.body;

    const updatedService = await Bautistaservice.findByIdAndUpdate(
      id,
      { bautistaserviceisarchived: archive },
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
    console.error("Error archiving Bautista service:", error);
    res.status(500).json({ message: "Error archiving service", error: error.message });
  }
};

// Delete Bautista service (if needed)
export const deleteBautistaService = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Bautistaservice.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service deleted successfully",
      service: deletedService
    });
  } catch (error) {
    console.error("Error deleting Bautista service:", error);
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};
