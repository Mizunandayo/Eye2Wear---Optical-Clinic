import { useEffect, useState, useMemo } from 'react';
import defaultprofilepic from '../src/assets/images/defaulticon.png';
import { useNavigate } from "react-router-dom";
import landinglogodark from  "../src/assets/images/landinglogodark.png";
import eye2wearbg from '../src/assets/images/eye2wearbg.png';

import React from "react";
import {Link} from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Eye, EyeOff } from "lucide-react";




function PatientRegistration() {

  const navigate = useNavigate();
  const emailcharacters = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

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
    const [showPassword, setShowPassword] = useState(false);




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

    }, [formdata.patientemail, emailcharacters]);








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
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration Failed")
      }

        //If response is success, it will send data to the api and to the database   
       const result = await response.json();

       if(result.success){
         setmessage({
          text: result.message,
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

        //Navigate to login page after successful registration
        setTimeout(() => {
          navigate("/userlogin");
        }, 3000);
       } else {
         setmessage({
          text: result.message || "Registration failed. Please try again.",
          type:"error"
         });
       }
      } 
      
      
      
    //Error encounter  
      catch(error){
        console.error("Error:", error)
        setmessage({
          text: error.message || "Registration Failed. Try again", 
          type:"error"
        })
      }finally{
        setissubmitting(false)
      }
  }










  return (
    <>
      <section className="absolute inset-0 h-full w-full" style={{
        backgroundImage: `url(${eye2wearbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="flex flex-col gap-4 p-6 h-full md:p-10 backdrop-blur-sm text-gray-900">
          
          {/* Registration Form Container */}
          <div className=" bg-white w-150 shadow-lg rounded-3xl border-1 border-black/50 flex flex-1 flex-col gap-5 items-center justify-center">
            {/* Logo */}
            <div className="flex justify-center gap-2 md:justify-start">
              <div className="mb-1 flex items-center gap-2">
                <img src={landinglogodark} alt="Eye2Wear" className="h-20 w-auto" />
              </div>
            </div>
            
            <div className="w-full max-w-md mx-auto">
              {/* Registration Form */}
              <form className="flex flex-col gap-6" onSubmit={handlesubmit}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold text-sky-700">Create your account</h1>
                  <p className="text-gray-600 text-sm">
                    Enter your details below to create your account
                  </p>
                </div>
                
                {/* Error/Success Messages */}
                {message.text && (
                  <div 
                    className="text-center p-3 rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
                      color: message.type === 'error' ? '#dc2626' : '#16a34a',
                      border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
                    }}
                  >
                    {message.text}
                  </div>
                )}

                <div className="grid gap-2">
                  {/* Email Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientemail" className="text-gray-900 text-sm">Email</Label>
                    <Input
                      id="patientemail"
                      type="email"
                      name="patientemail"
                      placeholder="m@example.com"
                      value={formdata.patientemail}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                    {checkemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
                    {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
                    {emailerror && emailexist && (<p className= "text-red-500 text-sm mt-1">Email already exist</p>)}
                  </div>
                  
                  {/* Password Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientpassword" className="text-gray-900 text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="patientpassword"
                        type={showPassword ? "text" : "password"}
                        name="patientpassword"
                        placeholder="Enter your password..."
                        value={formdata.patientpassword}
                        onChange={handlechange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 pr-10"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#6b7280'
                        }}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {formdata.patientpassword && formdata.patientpassword.length > 0 && (
                      <p className={`text-sm mt-1 transition-colors duration-200 ${
                        formdata.patientpassword.length >= 6 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formdata.patientpassword.length >= 6 
                          ? '✓ Password meets minimum length requirement' 
                          : `Password must be at least 6 characters (${formdata.patientpassword.length}/6)`
                        }
                      </p>
                    )}
                  </div>

                  {/* First Name Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientfirstname" className="text-gray-900 text-sm">First Name</Label>
                    <Input
                      id="patientfirstname"
                      type="text"
                      name="patientfirstname"
                      placeholder="Enter your first name..."
                      value={formdata.patientfirstname}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>

                  {/* Last Name Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientlastname" className="text-gray-900 text-sm">Last Name</Label>
                    <Input
                      id="patientlastname"
                      type="text"
                      name="patientlastname"
                      placeholder="Enter your last name..."
                      value={formdata.patientlastname}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>

                  {/* Middle Name Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientmiddlename" className="text-gray-900 text-sm">Middle Name</Label>
                    <Input
                      id="patientmiddlename"
                      type="text"
                      name="patientmiddlename"
                      placeholder="Enter your middle name..."
                      value={formdata.patientmiddlename}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                  
                  {/* Register Button */}
                  <button 
                    type="submit" 
                    disabled={issubmitting}
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: issubmitting ? '#9ca3af' : '#1f2937',
                      color: issubmitting ? '#6b7280' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: issubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      marginTop: '10px'
                    }}
                    onMouseEnter={(e) => {
                      if (!issubmitting) {
                        e.target.style.backgroundColor = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!issubmitting) {
                        e.target.style.backgroundColor = '#1f2937';
                      }
                    }}
                  >
                    {issubmitting ? (
                      <>
                        <div 
                          style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid transparent',
                            borderTop: '2px solid currentColor',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}
                        />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
                
                {/* Sign In Link */}
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    to="/userlogin" 
                    className="text-gray-900 underline underline-offset-4 hover:text-gray-700"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Add keyframe animation for spinner */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    </>
  )
}

export default PatientRegistration