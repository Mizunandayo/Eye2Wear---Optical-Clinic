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


const patientorderbautistarouter = express.Router();

patientorderbautistarouter.post('/', createpatientorderbautista);
patientorderbautistarouter.get('/', getallpatientorderbautistas);
patientorderbautistarouter.get('/email/:email', getorderbautistasbyemail);
patientorderbautistarouter.get('/:id', getpatientorderbautistabyid);
patientorderbautistarouter.get("/bautistaproductsoldcount/:productid", getbautistaproductsoldcountbyid);
patientorderbautistarouter.put('/:id', updateorderbautistabyid);
patientorderbautistarouter.put('/update-payment/:id', updatePaymentBautista);
patientorderbautistarouter.delete('/:id', deleteorderbautistabyid);


export default patientorderbautistarouter;