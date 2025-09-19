import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import {
     createpatientorderambher,
     getallpatientorderambhers,
     getpatientorderambherbyid,
     getorderambhersbyemail,
     updateorderambherbyid,
     deleteorderambherbyid,
     getambherproductsoldcountbyid,
     updatePaymentAmbher,
} from '../controllers/patientorderambher.controller.js';


const patientorderambherrouter = express.Router();

patientorderambherrouter.post('/', protect, createpatientorderambher);
patientorderambherrouter.get('/', protect, getallpatientorderambhers);
patientorderambherrouter.get('/email/:email', protect, getorderambhersbyemail);
patientorderambherrouter.get('/:id', protect, getpatientorderambherbyid);
patientorderambherrouter.get("/ambherproductsoldcount/:productid", protect, getambherproductsoldcountbyid);
patientorderambherrouter.put('/:id', protect, updateorderambherbyid);
patientorderambherrouter.put('/update-payment/:id', protect, updatePaymentAmbher);
patientorderambherrouter.delete('/:id', protect, deleteorderambherbyid);


export default patientorderambherrouter;