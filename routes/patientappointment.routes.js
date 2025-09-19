import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import {
    createpatientappointment,
    getallpatientappointments,
    getpatientappointmentbyid,
    getappointmentsbyemail,
    updateappointmentbyid,
    deleteappointmentbyid,
    getambherappointmentsbydatetime,
    getbautistaappointmentsbydatetime,
    upload,
} from '../controllers/patientappointment.controller.js';


const patientappointmentrouter = express.Router();

// Use multer middleware for appointment creation to handle file uploads (protected)
patientappointmentrouter.post('/appointments', protect, upload.array('supportingdocuments', 5), createpatientappointment);
patientappointmentrouter.get('/appointments', protect, getallpatientappointments);
patientappointmentrouter.get('/appointments/email/:email', protect, getappointmentsbyemail);
patientappointmentrouter.get('/appointments/:id', protect, getpatientappointmentbyid);
patientappointmentrouter.put('/appointments/:id', protect, updateappointmentbyid);
patientappointmentrouter.get('/appointments/ambher/:date/:time', protect, getambherappointmentsbydatetime);
patientappointmentrouter.get('/appointments/bautista/:date/:time', protect, getbautistaappointmentsbydatetime);
patientappointmentrouter.delete('/appointments/:id', protect, deleteappointmentbyid);


export default patientappointmentrouter;