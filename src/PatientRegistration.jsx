import { useEffect, useState } from 'react';
import defaultprofilepic from '../src/assets/images/defaulticon.png';
import { useNavigate } from "react-router-dom";
import landinglogodark from  "../src/assets/images/landinglogodark.png";

import React from "react";
import landingbg2 from "../src/assets/images/landingbg2.png";
import regbg from  "../src/assets/images/regbg.png";
import {Link} from "react-router-dom";




function PatientRegistration() {

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const emailcharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //Blank variables that stores all data to be sent to database
    const [formdata, setformdata] = useState({
      role:'Patient',
      patientemail:'',
      patientpassword:'',
      patientlastname:'',
      patientfirstname:'',
      patientmiddlename:'',
      patientprofilepicture:'' // Holds the profile picture 
    });

    //Tracks if the saving process is ongoing
    const [issubmitting, setissubmitting] = useState(false);
    //It stores messages whether to show the user sucessful or not
    const [message, setmessage] = useState({ text:'', type:''});
    
    //Checks if email is existing
    const [emailexist, setemailexist] = useState(false);
    const [checkemail, setcheckemail] = useState(false);
    const [emailerror, setemailerror] = useState(false);




    //Check Email if it is already existing in mongodb atlas
    useEffect(() => {
      const debounceemailcheck = async () => {
        
        //Don't check if email input is empty
        if(!formdata.patientemail) {
          setemailerror(false);
          setemailexist(false);
          return;
        }



        if(!emailcharacters.test(formdata.patientemail)) {
          setemailerror(true);
          return;
        }

        setcheckemail (true);

        try{
          //Request to server if the email exists in patientaccounts collection
          const patientresponse = await fetch(
            `/api/patientaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`
     
          );

          //Request to server if the email exists in adminaccounts collection
          const adminresponse = await fetch(
           `/api/adminaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`
     
          );
          
        const patientdata = await patientresponse.json();
        const admindata = await adminresponse.json();
        //Save wether email existss in db
        setemailexist(patientdata.exists  ||  admindata.exists); 
        setemailerror(patientdata.exists  ||  admindata.exists);




      }catch(error){
        console.error("Failed email validation:", error);
      }finally{
        //Check email done
        setcheckemail(false);
      }

      }

      const timer = setTimeout(debounceemailcheck, 500);
      return () => clearTimeout(timer); //Cleanup
    }, [formdata.patientemail]);








    //Loads the default profile picture for the patient when the page loads
    useEffect(() => {
      const loaddefaultprofilepic = async () => {
        try{

          //Fetches the defaultprofile image
          const response = await fetch(defaultprofilepic);
          const blob = await response.blob(); //Converts image to usable string
          const load = new FileReader();


          //When loaded, it saves the defaultprofile to the variable profilepicture
          load.onloadend = () => {
            setformdata(prev => ({
              ...prev,
              patientprofilepicture: load.result //It now saves the profileimage to the variable
            }));
          };
          load.readAsDataURL(blob); //Reads the usable image string

        }catch(error){
          console.error("Failed to load image: ", error);
        }
      };
      loaddefaultprofilepic();
    }, []);












  //Handlechange function to be used in input forms
    const handlechange = (e) => {
      const {name, value} = e.target
      setformdata(prev => ({
        ...prev,
        [name]: value
      }))
    }



  //Handles submit used in form when a button is clicked to submit request
    const handlesubmit = async (e) => {
      e.preventDefault()
      setissubmitting(true)
      setmessage({
        text:'', type:''
      })





    try{

      //Make sure that the image is in base64 format
      let defaultprofilepicbase64 = formdata.patientprofilepicture;

      //If not, it will convert it to base64
      if(!formdata.patientprofilepicture.startsWith('data:image')){
        const response = await fetch(formdata.patientprofilepicture);
        const blob = await response.blob();
        defaultprofilepicbase64 = await new Promise((resolve) => {
          const load = new FileReader();
          load.onloadend = () => resolve(load.result);
          load.readAsDataURL(blob);
        });
      }




  //Sends all patient data to the server
      const response = await fetch(`/api/patientaccounts`,{
        //POST Request to create the patient data
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({ //Convert to text format for sending
          ...formdata, //All of the patient form data
          patientprofilepicture: defaultprofilepicbase64
        })
      });

  //If response is not ok
      if(!response.ok){
        throw new Error("Registration Failed")
      }

        //If response is success, it will send data to the api and to the database   
       await response.json();

       setmessage({
        text:"Registration Sucessful!",
         type:"success"});




         //Resets the input forms except the profile picture
        setformdata({
          role: 'Patient',
          patientemail:'',
          patientpassword:'',
          patientlastname:'',
          patientfirstname:'',
          patientmiddlename:'',
          patientprofilepicture:defaultprofilepicbase64
        })

                         //AUTOMATIC NAVIGATION AFTER SUCCESSFUL LOGIN
                         setTimeout(() => {
                          navigate("/userlogin");
                      }, 2000);
      } 
      
      
      
    //Error encounter  
      catch(error){
        console.error("Error:", error)
        setmessage({
          text:"Registration Failed. Try again", 
          type:"error"
        })





        
      }finally{
        setissubmitting(false)
      }
  }










  return (
    <>





            <section className="min-h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${landingbg2})` }}>
      
      
      
 
      
      
      
      
            <div className="justify-center items-center login-container bg-white bg-gradient-to-tl flex flex-col lg:flex-row rounded-xl sm:rounded-2xl lg:rounded-4xl h-auto lg:h-180 w-full max-w-sm sm:max-w-lg lg:max-w-none lg:w-290 shadow-lg overflow-hidden">




      <div className="w-full h-full rounded-xl sm:rounded-2xl lg:rounded-4xl py-6 sm:py-8 lg:py-5">


      <form className="flex flex-col mx-4 sm:mx-8 lg:ml-15 lg:mr-15 mt-2 w-full lg:w-fullx" onSubmit={handlesubmit}>
      <div className="registration-container">
       <img src={landinglogodark} className="w-48 sm:w-60 lg:w-70 mb-4 sm:mb-6 lg:mb-8 mx-auto lg:mx-0"/>
      <h1 className="font-league text-[#3da9d1] text-[22px] sm:text-[26px] lg:text-[27px] text-center lg:text-left mb-2">Account Creation</h1>
      {message.text && (
        <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold text-center lg:text-left mb-3`}>
          {message.text}
        </div>
      )}

      <h1 className="font-albertsans italic text-[#060606] text-[16px] sm:text-[18px] lg:text-[20px] text-center lg:text-left mb-6 sm:mb-8 lg:mb-6">Let's create your account!</h1>




      <div className="form-group mb-4 sm:mb-5 lg:mb-4 flex flex-col lg:flex-row lg:items-center">
      <label className="font-albertsans font-bold italic text-[#595968] text-[16px] sm:text-[18px] lg:text-[19px] mb-2 lg:mb-0 lg:w-32" htmlFor="email">Email :</label>
      <div className="flex flex-col lg:ml-6 flex-1">
      <input className="bg-gray-200 text-[16px] sm:text-[18px] lg:text-[18px] text-gray-600 pl-3 rounded-2xl h-10 sm:h-11 lg:h-10 w-full" placeholder="Enter your email..." type="text" name="patientemail" id="patientemail" value={formdata.patientemail} onChange={handlechange} required/>
      {checkemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
      {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
      {emailerror && emailexist && (<p className= "text-red-500 text-sm mt-1">Email already exist</p>)}
   
      </div>
      </div>



      <div className="form-group mb-4 sm:mb-5 lg:mb-4 flex flex-col lg:flex-row lg:items-center">
      <label className="font-albertsans font-bold italic text-[#595968] text-[16px] sm:text-[18px] lg:text-[19px] mb-2 lg:mb-0 lg:w-32" htmlFor="passwrd">Password :</label>
      <div className="flex-1 lg:ml-6">
      <input className="bg-gray-200 text-[16px] sm:text-[18px] lg:text-[18px] text-gray-600 pl-3 rounded-2xl h-10 sm:h-11 lg:h-10 w-full" placeholder="Enter your password..." type="password" name="patientpassword" id="patientpassword" value={formdata.patientpassword} onChange={handlechange} required min="6"/>
      </div>
      </div>

      <div className="form-group mb-4 sm:mb-5 lg:mb-4 flex flex-col lg:flex-row lg:items-center">
      <label className="font-albertsans font-bold italic text-[#595968] text-[16px] sm:text-[18px] lg:text-[19px] mb-2 lg:mb-0 lg:w-32" htmlFor="lastname">Last Name :</label>
      <div className="flex-1 lg:ml-6">
      <input className="bg-gray-200 text-[16px] sm:text-[18px] lg:text-[18px] text-gray-600 pl-3 rounded-2xl h-10 sm:h-11 lg:h-10 w-full" placeholder="Enter your lastname..." type="text" name="patientlastname" id="patientlastname" value={formdata.patientlastname} onChange={handlechange} required/>
      </div>
      </div>

      <div className="form-group mb-4 sm:mb-5 lg:mb-4 flex flex-col lg:flex-row lg:items-center">
      <label className="font-albertsans font-bold italic text-[#595968] text-[16px] sm:text-[18px] lg:text-[19px] mb-2 lg:mb-0 lg:w-32" htmlFor="firstname">First Name :</label>
      <div className="flex-1 lg:ml-6">
      <input className="bg-gray-200 text-[16px] sm:text-[18px] lg:text-[18px] text-gray-600 pl-3 rounded-2xl h-10 sm:h-11 lg:h-10 w-full" placeholder="Enter your firstname..." type="text" name="patientfirstname" id="patientfirstname" value={formdata.patientfirstname} onChange={handlechange} required/>
      </div>
      </div>

      <div className="form-group mb-6 sm:mb-8 lg:mb-6 flex flex-col lg:flex-row lg:items-center">
      <label className="font-albertsans font-bold italic text-[#595968] text-[16px] sm:text-[18px] lg:text-[19px] mb-2 lg:mb-0 lg:w-32" htmlFor="middlename">Middle Name :</label>
      <div className="flex-1 lg:ml-6">
      <input className="bg-gray-200 text-[16px] sm:text-[18px] lg:text-[18px] text-gray-600 pl-3 rounded-2xl h-10 sm:h-11 lg:h-10 w-full" placeholder="Enter your middlename..." type="text" name="patientmiddlename" id="patientmiddlename" value={formdata.patientmiddlename} onChange={handlechange} required/>
      </div>
      </div>
      

     
   
      <button type="submit" disabled={issubmitting} className={`submit-btn w-full flex items-center justify-center gap-2 ${issubmitting ? 'bg-gray-400 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300 ease-in-out`} style={{ backgroundColor: issubmitting ? "#9ca3af" : "#2b2b44", fontSize: "18px", padding: "12px 20px", color: "white", borderRadius: "20px" }}>
        {issubmitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span className="text-[16px] sm:text-[18px] lg:text-[18px]">Registering...</span>
          </>
        ) : (
          <span className="text-[16px] sm:text-[18px] lg:text-[18px]">Register</span>
        )}
      </button>
   
       <div className="flex items-center justify-center mt-4 sm:mt-5 gap-1">
       <h1 className="text-[14px] sm:text-[15px] lg:text-[15px] font-semibold text-[#4b4b53]">Already have an account?</h1>
       <Link to="/userlogin"> <div className="flex justify-center items-center p-2 sm:p-3 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all text-[#]"><p className="font-bold text-[16px] sm:text-[17px] lg:text-[16px] text-[#177084]">Sign In</p></div></Link>
       </div>


      </div>
      </form>


      </div>
      
      
      
      <div className="bg-cover bg-center w-full h-32 sm:h-48 lg:h-full rounded-b-xl sm:rounded-b-2xl lg:rounded-r-4xl lg:rounded-l-none shadow-lg" style={{ backgroundImage: `url(${regbg})` }}>

      </div>





      </div>



</section>

    </>
  )
}

export default PatientRegistration