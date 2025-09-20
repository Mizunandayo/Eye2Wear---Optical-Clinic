import dotenv from "dotenv";
import Patientaccount from "../models/patientaccount.js";
import Adminaccount from "../models/adminaccount.js";
import Owneraccount from "../models/owneraccount.js";
import Staffaccount from "../models/staffacount.js";
import { sendAccountCreationEmail } from '../utils/emailService.js';



dotenv.config();



//Account Creation Email
export const patientaccountcreationemail = async(req, res) => {

    try{

    const{email, password} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await sendAccountCreationEmail(email, password, 'Patient');
    
    console.log('Patient account creation email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending patient account creation email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account creation email"});
            }          };





          
 
//Staff Creation Email
export const staffaccountcreationemail = async(req, res) => {

    try{

    const{email, password} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await sendAccountCreationEmail(email, password, 'Staff');
    
    console.log('Staff account creation email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending staff account creation email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account creation email"});
            }

          };




 //Owner Creation Email
export const owneraccountcreationemail = async(req, res) => {

    try{

    const{email, password} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await sendAccountCreationEmail(email, password, 'Owner');
    
    console.log('Owner account creation email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending owner account creation email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account creation email"});
            }

          }; 
          
   
          





 //Admin Creation Email
 export const adminaccountcreationemail = async(req, res) => {

    try{

    const{email, password} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await sendAccountCreationEmail(email, password, 'Admin');
    
    console.log('Admin account creation email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending admin account creation email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account creation email"});
            }

          };    