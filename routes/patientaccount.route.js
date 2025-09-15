import express from "express";

import {
      patientlogin,
      //resetpassword,
      getpatientaccounts,
      getpatientaccountbyid,
      getloggedinpatientacc,
      verifyloggedinpatientacc,
      getpatientaccountbylastname,
      existingemail, 
      createPatient,
      updatePatient,
      getpatientbyemail,
      //forgotpassword,
      deletePatient,
      verifyEmail,
      resendVerificationEmail,
      verifyManagementAuth,
     } from "../controllers/patientaccount.controller.js";
      

const patientrouter = express.Router();




    






//Retrieve Patient data
patientrouter.get("/", getpatientaccounts);
patientrouter.get("/id/:id", getpatientaccountbyid);
patientrouter.get("/patientlastname/:patientlastname", getpatientaccountbylastname);
patientrouter.get("/me", verifyloggedinpatientacc, getloggedinpatientacc);
patientrouter.get("/get-by-email/:patientemail", getpatientbyemail);


//Retrieve Existing Email datas
patientrouter.get("/check-email/:patientemail", existingemail);


//Create Patient data
patientrouter.post("/", createPatient);

//Update Patient data
patientrouter.put("/:id", updatePatient);

//Delete Patient data
patientrouter.delete("/:id", verifyManagementAuth, deletePatient);



//Login Patient
patientrouter.post("/login", patientlogin);
//patientrouter.post('/forgot-password', forgotpassword );
//patientrouter.post('/reset-password/:id/:token', resetpassword );

//Email Verification Routes
patientrouter.get("/verify-email/:id/:token", verifyEmail);
patientrouter.post("/resend-verification", resendVerificationEmail);



export default patientrouter;
