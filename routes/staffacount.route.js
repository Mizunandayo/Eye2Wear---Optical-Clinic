      import express from "express";
      import { protect } from "../middleware/authMiddleware.js";
      import {
            stafflogin,

            getstaffaccounts,
            getstaffaccountbyid,
            getloggedinstaffacc,
            verifyloggedinstaffacc,
            getstaffaccountbylastname,
            existingemail, 
            createStaff,
            updateStaff, 
            deleteStaff } from "../controllers/staffaccount.controller.js";



      const staffrouter = express.Router();

      //Retrieve staff data (protected)
      staffrouter.get("/", protect, getstaffaccounts);
      staffrouter.get("/id/:id", protect, getstaffaccountbyid);
      staffrouter.get("/stafflastname/:stafflastname", protect, getstaffaccountbylastname);
      staffrouter.get("/me", verifyloggedinstaffacc, getloggedinstaffacc);



      //Retrieve Existing Email datas (public for registration)
      staffrouter.get("/check-email/:staffemail", existingemail);


      //Create staff data (protected)
      staffrouter.post("/", protect, createStaff);

      //Update staff data (protected)
      staffrouter.put("/:id", protect, updateStaff);

      //Delete staff data (protected)
      staffrouter.delete("/:id", protect, deleteStaff);



      //Login staff (public)
      staffrouter.post("/login", stafflogin);



      export default staffrouter;
      