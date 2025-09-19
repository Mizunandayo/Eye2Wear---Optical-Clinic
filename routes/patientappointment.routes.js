import express from 'express';
import {
    createpatientappointment,
    getallpatientappointments,
    getpatientappointmentbyid,
    getappointmentsbyemail,
    updateappointmentbyid,
    deleteappointmentbyid,
    getambherappointmentsbydatetime,
    getbautistaappointmentsbydatetime,
    getambherappointmentsbydatetimeandlocation,
    getbautistaappointmentsbydatetimeandlocation,
    upload,
} from '../controllers/patientappointment.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { appointmentAccess, staffOwnerAdminAccess, appointmentModifyAccess } from '../middleware/appointmentAuth.js';


const patientappointmentrouter = express.Router();

// Use multer middleware for appointment creation to handle file uploads
patientappointmentrouter.post('/appointments', protect, appointmentAccess, upload.array('supportingdocuments', 5), createpatientappointment);
patientappointmentrouter.get('/appointments', protect, staffOwnerAdminAccess, getallpatientappointments);
patientappointmentrouter.get('/appointments/email/:email', protect, appointmentAccess, getappointmentsbyemail);
patientappointmentrouter.get('/appointments/:id', protect, appointmentAccess, getpatientappointmentbyid);
patientappointmentrouter.put('/appointments/:id', protect, appointmentModifyAccess, updateappointmentbyid);
patientappointmentrouter.get('/appointments/ambher/:date/:time', protect, appointmentAccess, getambherappointmentsbydatetime);
patientappointmentrouter.get('/appointments/bautista/:date/:time', protect, appointmentAccess, getbautistaappointmentsbydatetime);
patientappointmentrouter.get('/appointments/ambher/:date/:time/:location', protect, appointmentAccess, getambherappointmentsbydatetimeandlocation);
patientappointmentrouter.get('/appointments/bautista/:date/:time/:location', protect, appointmentAccess, getbautistaappointmentsbydatetimeandlocation);
patientappointmentrouter.delete('/appointments/:id', protect, appointmentModifyAccess, deleteappointmentbyid);


export default patientappointmentrouter;