import dotenv from "dotenv";
import Patientaccount from "../models/patientaccount.js";
import Adminaccount from "../models/adminaccount.js";
import Owneraccount from "../models/owneraccount.js";
import Staffaccount from "../models/staffacount.js";
import { emailServiceManager } from '../utils/emailServiceManager.js';



dotenv.config();



//Account deletion Email
export const patientaccountdeletionemail = async(req, res) => {

    try{

    const{email} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await emailServiceManager.sendAccountDeletionEmail(email, 'Patient');
    
    console.log('Patient account deletion email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending patient account deletion email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account deletion email"});
            }

          };



          
 
//Staff deletion Email
export const staffaccountdeletionemail = async(req, res) => {

    try{

    const{email} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await emailServiceManager.sendAccountDeletionEmail(email, 'Staff');
    
    console.log('Staff account deletion email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending staff account deletion email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account deletion email"});
            }

          };




 //Owner deletion Email
export const owneraccountdeletionemail = async(req, res) => {

    try{

    const{email} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await emailServiceManager.sendAccountDeletionEmail(email, 'Owner');
    
    console.log('Owner account deletion email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending owner account deletion email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account deletion email"});
            }

          }; 
          
   
          





 //Admin deletion Email
 export const adminaccountdeletionemail = async(req, res) => {

    try{

    const{email} =req.body;
    
    // Use the enhanced email service with retry logic and production optimizations
    const result = await emailServiceManager.sendAccountDeletionEmail(email, 'Admin');
    
    console.log('Admin account deletion email sent successfully:', result.messageId);
    res.status(200).json({Status: "Success", messageId: result.messageId});
              

            }catch(error){
              console.error('Error sending admin account deletion email:', error);
              res.status(500).json({Status: "Error", message: "Failed to send account deletion email"});
            }

          };    