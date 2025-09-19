import express from 'express';
import {
     createpatientorderbautista,
     getallpatientorderbautistas,
     getpatientorderbautistabyid,
     getorderbautistasbyemail,
     updateorderbautistabyid,
     deleteorderbautistabyid,
     getbautistaproductsoldcountbyid,
     updatePaymentBautista,
} from '../controllers/patientorderbautista.controller.js';
import { protect } from '../middleware/authMiddleware.js';


const patientorderbautistarouter = express.Router();

patientorderbautistarouter.post('/', protect, createpatientorderbautista);
patientorderbautistarouter.get('/', protect, getallpatientorderbautistas);
patientorderbautistarouter.get('/email/:email', protect, getorderbautistasbyemail);
patientorderbautistarouter.get('/:id', protect, getpatientorderbautistabyid);
patientorderbautistarouter.get("/bautistaproductsoldcount/:productid", protect, getbautistaproductsoldcountbyid);
patientorderbautistarouter.put('/:id', protect, updateorderbautistabyid);
patientorderbautistarouter.put('/update-payment/:id', protect, updatePaymentBautista);
patientorderbautistarouter.delete('/:id', protect, deleteorderbautistabyid);


export default patientorderbautistarouter;