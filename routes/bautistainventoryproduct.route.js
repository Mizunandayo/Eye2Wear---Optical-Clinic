import express from "express";

import {

    createbautistainventoryproduct,
    getallbautistainventoryproduct,
    getbautistainventoryproductbyid,
    updatebautistainventoryproductbyid,
    deletebautistainventoryproductbyid,
    archivebautistainventoryproductbyid,
    unarchivebautistainventoryproductbyid,


     } from "../controllers/bautistainventoryproduct.controller.js";
      



const bautistainventoryproductrouter = express.Router();



bautistainventoryproductrouter.get("/", getallbautistainventoryproduct);
bautistainventoryproductrouter.get("/:id", getbautistainventoryproductbyid);

bautistainventoryproductrouter.post("/", createbautistainventoryproduct);
bautistainventoryproductrouter.put("/:id", updatebautistainventoryproductbyid);
bautistainventoryproductrouter.delete("/:id", deletebautistainventoryproductbyid);

// Archive/Unarchive routes
bautistainventoryproductrouter.patch("/:id/archive", archivebautistainventoryproductbyid);
bautistainventoryproductrouter.patch("/:id/unarchive", unarchivebautistainventoryproductbyid);



export default bautistainventoryproductrouter;
