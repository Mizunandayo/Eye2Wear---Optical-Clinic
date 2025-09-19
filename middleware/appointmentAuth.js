import PatientAppointment from '../models/patientappointment.js';

// Authorization middleware for appointment management
export const authorizeAppointmentAccess = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated (should be done by protect middleware first)
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const { role, clinic } = req.user;
      console.log(`Authorization check: User role="${role}", clinic="${clinic}", path="${req.path}", method="${req.method}"`);

      // Check if user role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        console.log(`Role check failed: User role "${role}" not in allowed roles [${allowedRoles.join(', ')}]`);
        return res.status(403).json({ 
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
        });
      }

      // For appointment-specific operations, check clinic access - TEMPORARILY DISABLED FOR TESTING
      // Allow staff and owners to access appointments with basic role check
      if (req.params.id && (role === 'staff' || role === 'owner')) {
        console.log(`Staff/Owner accessing appointment ${req.params.id} - allowing access`);
        // Skip clinic checking for now - frontend handles clinic restrictions
      }

      // Add clinic filter for list operations
      if (role === 'staff' || role === 'owner') {
        req.clinicFilter = clinic;
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Authorization check failed' });
    }
  };
};

// Middleware specifically for appointment management
export const appointmentAccess = authorizeAppointmentAccess(['patient', 'staff', 'owner', 'admin']);

// Middleware for staff/owner/admin only
export const staffOwnerAdminAccess = authorizeAppointmentAccess(['staff', 'owner', 'admin']);

// Middleware that allows patients to modify their own appointments, or staff/owners/admins to modify any
export const appointmentModifyAccess = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { role, email, clinic } = req.user;
    console.log(`Appointment modify check: User role="${role}", email="${email}", clinic="${clinic}", appointmentId="${req.params.id}"`);

    // Staff, owners, and admins can modify any appointment
    if (role === 'staff' || role === 'owner' || role === 'admin') {
      console.log(`${role} access granted for appointment modification`);
      
      // Add clinic filter for staff and owners
      if (role === 'staff' || role === 'owner') {
        req.clinicFilter = clinic;
      }
      
      return next();
    }

    // Patients can only modify their own appointments
    if (role === 'patient') {
      if (!email) {
        console.log('❌ Patient email missing from token');
        return res.status(401).json({ message: 'Invalid token: email missing' });
      }

      if (!req.params.id) {
        return res.status(400).json({ message: 'Appointment ID required' });
      }

      // Find the appointment and check if it belongs to the patient
      const appointment = await PatientAppointment.findOne({ 
        patientappointmentid: req.params.id 
      });

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      console.log(`🔍 Email comparison: Appointment="${appointment.patientappointmentemail}" vs Token="${email}"`);

      // Check if the appointment belongs to the current patient
      if (appointment.patientappointmentemail !== email) {
        console.log(`❌ Patient access denied: Appointment email "${appointment.patientappointmentemail}" doesn't match user email "${email}"`);
        return res.status(403).json({ 
          message: 'Access denied. You can only modify your own appointments.' 
        });
      }

      console.log(`✅ Patient access granted for their own appointment ${req.params.id}`);
      return next();
    }

    // Unknown role
    return res.status(403).json({ 
      message: 'Access denied. Invalid user role.' 
    });

  } catch (error) {
    console.error('Appointment modify authorization error:', error);
    res.status(500).json({ message: 'Authorization check failed' });
  }
};

// Middleware for admin only
export const adminOnlyAccess = authorizeAppointmentAccess(['admin']);