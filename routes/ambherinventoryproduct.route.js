import express from "express";

import {

    createambherinventoryproduct,
    getallambherinventoryproduct,
    getambherinventoryproductbyid,
    updateambherinventoryproductbyid,
    deleteambherinventoryproductbyid,
    archiveambherinventoryproductbyid,
    unarchiveambherinventoryproductbyid,


     } from "../controllers/ambherinventoryproduct.controller.js";
      



const ambherinventoryproductrouter = express.Router();



ambherinventoryproductrouter.get("/", getallambherinventoryproduct);
ambherinventoryproductrouter.get("/:id", getambherinventoryproductbyid);

ambherinventoryproductrouter.post("/", createambherinventoryproduct);
ambherinventoryproductrouter.put("/:id", updateambherinventoryproductbyid);
ambherinventoryproductrouter.delete("/:id", deleteambherinventoryproductbyid);

// Archive/Unarchive routes
ambherinventoryproductrouter.patch("/:id/archive", archiveambherinventoryproductbyid);
ambherinventoryproductrouter.patch("/:id/unarchive", unarchiveambherinventoryproductbyid);



export default ambherinventoryproductrouter;
