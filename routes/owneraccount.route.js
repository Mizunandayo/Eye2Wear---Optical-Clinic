      import express from "express";
      import { protect } from "../middleware/authMiddleware.js";
      import {
            ownerlogin,

            getowneraccounts,
            getowneraccountbyid,
            getloggedinowneracc,
            verifyloggedinowneracc,
            getowneraccountbylastname,
            existingemail, 
            createOwner,
            updateOwner, 
            deleteOwner } from "../controllers/owneraccount.controller.js";



      const ownerrouter = express.Router();

      //Retrieve owner data
      ownerrouter.get("/", protect, getowneraccounts);
      ownerrouter.get("/id/:id", protect, getowneraccountbyid);
      ownerrouter.get("/ownerlastname/:ownerlastname", protect, getowneraccountbylastname);
      ownerrouter.get("/me", verifyloggedinowneracc, getloggedinowneracc);



      //Retrieve Existing Email datas
      ownerrouter.get("/check-email/:owneremail", existingemail);


      //Create owner data
      ownerrouter.post("/", protect, createOwner);

      //Update owner data
      ownerrouter.put("/:id", protect, updateOwner);

      //Delete owner data
      ownerrouter.delete("/:id", protect, deleteOwner);



      //Login owner
      ownerrouter.post("/login", ownerlogin);



      export default ownerrouter;
      