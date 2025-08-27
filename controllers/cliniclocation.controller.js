import ClinicLocation from '../models/cliniclocation.js';
import fetch from 'node-fetch';
import mongoose from 'mongoose';


// Get all clinic locations
export const getAllClinicLocations = async (req, res) => {
  try {
    // Allow optional query parameter to include inactive clinics
    const includeInactive = req.query.includeInactive === 'true';
    const showDeleted = req.query.showDeleted === 'true';
    
    let filter = {};
    
    if (showDeleted) {
      // Show only deleted (inactive) clinics
      filter = { isActive: false };
    } else if (includeInactive) {
      // Show all clinics (active and inactive)
      filter = {};
    } else {
      // Default: show only active clinics
      filter = { isActive: true };
    }
    
    const locations = await ClinicLocation.find(filter);
    res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic locations',
      error: error.message
    });
  }
};

// Get clinic location by clinic ID
export const getClinicLocationById = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const location = await ClinicLocation.findOne({ clinicId, isActive: true });
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Clinic location not found'
      });
    }

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic location',
      error: error.message
    });
  }
};

// Get current user's clinic location
export const getCurrentUserClinicLocation = async (req, res) => {
  try {
    // Extract user info from request (you'll need to add auth middleware)
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const userClinic = req.user?.clinic;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    let clinicType = userClinic;
    
    // If clinic type is not available, determine from role
    if (!clinicType) {
      if (userRole === 'staff' || userRole === 'owner') {
        // You might need to query the user's clinic from their profile
        clinicType = 'Ambher Optical'; // Default, should be dynamic
      }
    }

    const location = await ClinicLocation.findOne({ 
      clinicType,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching clinic location',
      error: error.message
    });
  }
};

// Create or update clinic location
export const upsertClinicLocation = async (req, res) => {
  try {
    const {
      clinicId: bodyClinicId,
      clinicName,
      clinicType,
      address,
      longitude,
      latitude,
      contactInfo,
      operatingHours,
      services
    } = req.body;

    // Get clinicId from URL params (for PUT requests) or body (for POST requests)
    const clinicId = req.params.clinicId || bodyClinicId;

    // For now, we'll use a default user ID. You should implement proper auth
    const userId = req.user?.id || new mongoose.Types.ObjectId();

    // Generate unique clinic ID if not provided
    const generateUniqueClinicId = () => {
      const baseId = clinicType.toLowerCase().replace(/\s+/g, '-');
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      return `${baseId}-${timestamp}-${randomSuffix}`;
    };

    const locationData = {
      clinicId: clinicId || generateUniqueClinicId(),
      clinicName,
      clinicType,
      address,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude] // [lng, lat] format for GeoJSON
      },
      contactInfo: contactInfo || {},
      operatingHours: operatingHours || {},
      services: services || [],
      isActive: true, // Explicitly set to active when creating/updating
      updatedBy: userId
    };

    let location;
    let isNewClinic = false;

    // Check if this is an update (clinicId provided and exists) or create new
    if (clinicId) {
      // Update existing clinic
      location = await ClinicLocation.findOneAndUpdate(
        { clinicId: locationData.clinicId },
        locationData,
        {
          new: true,
          runValidators: true
        }
      );

      if (!location) {
        return res.status(404).json({
          success: false,
          message: 'Clinic location not found for update'
        });
      }
    } else {
      // Create new clinic
      locationData.createdBy = userId;
      location = new ClinicLocation(locationData);
      await location.save();
      isNewClinic = true;
    }

    res.status(isNewClinic ? 201 : 200).json({
      success: true,
      message: `Clinic location ${isNewClinic ? 'created' : 'updated'} successfully`,
      data: location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving clinic location',
      error: error.message
    });
  }
};

// Find nearby clinics
export const findNearbyClinic = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters

    const nearbyClinic = await ClinicLocation.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.status(200).json({
      success: true,
      data: nearbyClinic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding nearby clinics',
      error: error.message
    });
  }
};

// Geocode address using Mapbox
export const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.query;
    
    const response = await fetch(
      // eslint-disable-next-line no-undef
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}&limit=1&country=ph`
    );

    const data = await response.json();

    if (data.features.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const feature = data.features[0];
    res.status(200).json({
      success: true,
      data: {
        coordinates: {
          longitude: feature.center[0],
          latitude: feature.center[1]
        },
        address: feature.place_name
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error geocoding address',
      error: error.message
    });
  }
};

// Delete clinic location
export const deleteClinicLocation = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const userId = req.user?.id;
    const { hardDelete = false } = req.query; // Allow hard delete via query parameter
    
    if (hardDelete === 'true') {
      // Permanently delete from database
      const result = await ClinicLocation.findOneAndDelete({ clinicId });
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Clinic location not found'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Clinic location permanently deleted successfully'
      });
    } else {
      // Soft delete (mark as inactive)
      const result = await ClinicLocation.findOneAndUpdate(
        { clinicId },
        { isActive: false, updatedBy: userId }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Clinic location not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Clinic location deleted successfully'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting clinic location',
      error: error.message
    });
  }
};

// Toggle clinic active status
export const toggleClinicActiveStatus = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const userId = req.user?.id;
    
    const clinic = await ClinicLocation.findOne({ clinicId });
    
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: 'Clinic location not found'
      });
    }
    
    clinic.isActive = !clinic.isActive;
    clinic.updatedBy = userId;
    await clinic.save();

    res.status(200).json({
      success: true,
      message: `Clinic ${clinic.isActive ? 'activated' : 'deactivated'} successfully`,
      data: clinic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling clinic status',
      error: error.message
    });
  }
};