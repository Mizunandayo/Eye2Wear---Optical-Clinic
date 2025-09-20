import express from "express";
import { googleRegister, googleLogin } from "../controllers/googleauth.controller.js";

const googleauthrouter = express.Router();

// Google OAuth Registration
googleauthrouter.post("/register", googleRegister);

// Google OAuth Login
googleauthrouter.post("/login", googleLogin);

export default googleauthrouter;