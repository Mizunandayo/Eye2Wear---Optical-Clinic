      import express from "express";
      import { protect } from "../middleware/authMiddleware.js";
      import {
            adminlogin,

            getadminaccounts,
            getadminaccountbyid,
            getloggedinadminacc,
            verifyloggedinadminacc,
            getadminaccountbylastname,
            existingemail, 
            createAdmin,
            updateAdmin, 
            deleteAdmin } from "../controllers/adminaccount.controller.js";



      const adminrouter = express.Router();

      //Retrieve Admin data
      adminrouter.get("/", protect, getadminaccounts);
      adminrouter.get("/id/:id", protect, getadminaccountbyid);
      adminrouter.get("/adminlastname/:adminlastname", protect, getadminaccountbylastname);
      adminrouter.get("/me", verifyloggedinadminacc, getloggedinadminacc);



      //Retrieve Existing Email datas
      adminrouter.get("/check-email/:adminemail", existingemail);


      //Create Admin data
      adminrouter.post("/", protect, createAdmin);

      //Update Admin data
      adminrouter.put("/:id", protect, updateAdmin);

      //Delete Admin data
      adminrouter.delete("/:id", protect, deleteAdmin);



      //Login Admin
      adminrouter.post("/login", adminlogin);



      export default adminrouter;
      