import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import landinglogodark from  "../src/assets/images/landinglogodark.png";
import eye2wearbg from '../src/assets/images/eye2wearbg.png';

import React from "react";
import {Link} from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import useCloudinaryUpload from "./hooks/useCloudinaryUpload";




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
    const [isGoogleRegistering, setIsGoogleRegistering] = useState(false);

    // Cloudinary upload hook
    const {
      uploadProfilePicture,
      uploading: cloudinaryUploading,
      uploadProgress
    } = useCloudinaryUpload();

    // State for profile picture file handling
    const [selectedProfileFile, setSelectedProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    // Handle Google OAuth response
    const handleGoogleResponse = useCallback(async (response) => {
      setIsGoogleRegistering(true);
      setmessage({ text: '', type: '' });

      try {
        const result = await fetch('/api/google-auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: response.credential
          })
        });

        const data = await result.json();

        if (data.success) {
          // If registration is successful and user is automatically logged in
          if (data.autoLogin && data.jsontoken && data.patient) {
            // Set all localStorage items to match regular patient login
            localStorage.setItem("patienttoken", data.jsontoken);
            localStorage.setItem("patientdetails", JSON.stringify(data.patient));
            localStorage.setItem("patientid", data.patient._id);
            localStorage.setItem("patientemail", data.patient.patientemail);
            localStorage.setItem("patientfirstname", data.patient.patientfirstname);
            localStorage.setItem("patientlastname", data.patient.patientlastname);
            localStorage.setItem("patientname", data.patient.patientfirstname + " " + data.patient.patientlastname);
            localStorage.setItem('role', 'patient');
            localStorage.setItem('token', data.jsontoken);
            localStorage.setItem('needsSocketInit', 'true');
            
            // Set axios default authorization header
            if (window.axios) {
              window.axios.defaults.headers.common['Authorization'] = `Bearer ${data.jsontoken}`;
            }

            setmessage({
              text: data.message + " Redirecting to anding page...",
              type: "success"
            });

            // Navigate to patient dashboard
            setTimeout(() => {
              navigate("/patientlandingpage");
            }, 2000);
          } else {
            // Regular registration flow - redirect to login
            setmessage({
              text: data.message + " Redirecting to login...",
              type: "success"
            });

            setTimeout(() => {
              navigate("/userlogin");
            }, 2000);
          }
        } else {
          setmessage({
            text: data.message || "Google registration failed. Please try again.",
            type: "error"
          });
        }
      } catch (error) {
        console.error("Google registration error:", error);
        setmessage({
          text: "Google registration failed. Please try again.",
          type: "error"
        });
      } finally {
        setIsGoogleRegistering(false);
      }
    }, [navigate]);

    // Initialize Google OAuth
    useEffect(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      }
    }, [handleGoogleResponse]);

    // Handle Google Sign-In button click
    const handleGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.prompt();
      }
    };




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
          // Make all email check requests concurrently using Promise.all for better performance
          const [patientresponse, adminresponse, staffresponse, ownerresponse] = await Promise.all([
            fetch(`/api/patientaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`),
            fetch(`/api/adminaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`),
            fetch(`/api/staffaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`),
            fetch(`/api/owneraccounts/check-email/${encodeURIComponent(formdata.patientemail)}`)
          ]);
          
          // Parse all responses concurrently
          const [patientdata, admindata, staffdata, ownerdata] = await Promise.all([
            patientresponse.json(),
            adminresponse.json(),
            staffresponse.json(),
            ownerresponse.json()
          ]);
          
          //Save wether email exists in any account type
          setemailexist(patientdata.exists || admindata.exists || staffdata.exists || ownerdata.exists); 
          setemailerror(patientdata.exists || admindata.exists || staffdata.exists || ownerdata.exists);




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
      // Set default profile picture URL (not base64)
      setformdata(prev => ({
        ...prev,
        patientprofilepicture: 'default-profile-url'
      }));
    }, []);












  //Handlechange function to be used in input forms
    const handlechange = (e) => {
      const {name, value} = e.target
      setformdata(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Handle file selection for profile picture
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setmessage({
            text: 'Please select a valid image file',
            type: 'error'
          });
          return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setmessage({
            text: 'Image file is too large. Please choose a smaller image (max 10MB)',
            type: 'error'
          });
          return;
        }

        setSelectedProfileFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfilePreview(e.target.result);
        };
        reader.readAsDataURL(file);

        // Clear any previous messages
        setmessage({ text: '', type: '' });
      }
    };



  //Handles submit used in form when a button is clicked to submit request
    const handlesubmit = async (e) => {
      e.preventDefault()
      
      // Prevent submission if email already exists
      if (emailexist) {
        setmessage({
          text: 'Please use a different email address. This email is already in use.',
          type: 'error'
        });
        return;
      }
      
      // Prevent submission if email format is invalid
      if (!emailcharacters.test(formdata.patientemail)) {
        setmessage({
          text: 'Please enter a valid email address.',
          type: 'error'
        });
        return;
      }
      
      setissubmitting(true)
      setmessage({
        text:'', type:''
      })

    try{
      // Prepare the patient data to send
      let patientDataToSend = { ...formdata };

      // Handle profile picture upload to Cloudinary if a file is selected
      if (selectedProfileFile) {
        try {
          console.log("Uploading profile picture to Cloudinary...");
          
          // Use patient email as identifier for Cloudinary folder structure
          const identifier = formdata.patientemail || `patient_${Date.now()}`;
          
          const uploadResult = await uploadProfilePicture(
            selectedProfileFile, 
            identifier,
            'patient'
          );
          
          // Update the data with Cloudinary URL and public_id
          patientDataToSend = {
            ...patientDataToSend,
            patientprofilepicture: uploadResult.imageUrl,
            patientprofilepicture_public_id: uploadResult.public_id
          };
          
          console.log("Profile picture uploaded to Cloudinary:", uploadResult);
          
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
        }
      } else {
        // If no file selected, use default profile URL (not base64)
        patientDataToSend = {
          ...patientDataToSend,
          patientprofilepicture: 'default-profile-url',
          patientprofilepicture_public_id: null
        };
      }

  //Sends all patient data to the server
      const response = await fetch(`/api/patientaccounts`,{
        //POST Request to create the patient data
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(patientDataToSend)
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

         //Resets the input forms
        setformdata({
          role: 'Patient',
          patientemail:'',
          patientpassword:'',
          patientlastname:'',
          patientfirstname:'',
          patientmiddlename:'',
          patientprofilepicture: ''
        });

        // Reset file selection
        setSelectedProfileFile(null);
        setProfilePreview(null);

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
        console.error("Error:", error);
        
        // Handle different types of errors
        let errorMessage = "Registration failed. Please try again.";
        
        if (error.message) {
          if (error.message.includes("upload") || error.message.includes("Cloudinary")) {
            errorMessage = `Image upload failed: ${error.message}. Please try a different image.`;
          } else if (error.message.includes("413") || error.message.includes("file size") || error.message.includes("size limit") || error.message.includes("too large")) {
            errorMessage = "Image file is too large. Please choose a smaller image (max 10MB).";
          } else if (error.message.includes("file type") || error.message.includes("format") || error.message.includes("Invalid")) {
            errorMessage = "Invalid file format. Please choose a valid image file.";
          } else if (error.message.includes("400")) {
            errorMessage = "Invalid data provided. Please check all required fields.";
          } else if (error.message.includes("401") || error.message.includes("unauthorized")) {
            errorMessage = "Authentication failed. Please try again.";
          } else if (error.message.includes("403") || error.message.includes("forbidden")) {
            errorMessage = "You don't have permission to perform this action.";
          } else if (error.message.includes("500") || error.message.includes("Server error")) {
            errorMessage = "Server error occurred. Please try again or contact support.";
          } else if (error.message.includes("Network")) {
            errorMessage = "Network error. Please check your connection and try again.";
          } else {
            errorMessage = error.message;
          }
        }
        
        setmessage({
          text: errorMessage, 
          type:"error"
        });
      }finally{
        setissubmitting(false)
      }
  }




















  








  return (
    <>
      <section className="min-h-screen w-[99vw]" style={{
        backgroundImage: `url(${eye2wearbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-10 backdrop-blur-sm text-gray-900">
          
          {/* Registration Form Container */}
          <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg rounded-2xl sm:rounded-3xl border-1 border-black/50 flex flex-col gap-3 sm:gap-5 items-center justify-center px-4 sm:px-6 py-6 sm:py-8 my-8">
            {/* Logo */}
            <div className="flex justify-center gap-2 md:justify-start">
              <div className="mb-1 flex items-center gap-2">
                <img src={landinglogodark} alt="Eye2Wear" className="h-16 sm:h-20 w-auto" />
              </div>
            </div>
            
            <div className="w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-0">
              {/* Registration Form */}
              <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handlesubmit}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-xl sm:text-2xl font-bold text-sky-700">Create your account</h1>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Enter your details below to create your account
                  </p>
                </div>
                
                {/* Error/Success Messages */}
                {message.text && (
                  <div 
                    className="text-center p-2 sm:p-3 rounded-md text-xs sm:text-sm font-medium mx-2 sm:mx-0"
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
                    <Label htmlFor="patientemail" className="text-gray-900 text-xs sm:text-sm">Email</Label>
                    <Input
                      id="patientemail"
                      type="email"
                      name="patientemail"
                      placeholder="m@example.com"
                      value={formdata.patientemail}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-auto text-sm sm:text-base"
                      required
                    />
                    {checkemail && <p className="text-gray-500 text-xs sm:text-sm mt-1">Checking Email</p>}
                    {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-xs sm:text-sm mt-1">Enter a valid email address</p>)}
                    {emailerror && emailexist && (<p className= "text-red-500 text-xs sm:text-sm mt-1">Email already in use</p>)}
                  </div>
                  
                  {/* Password Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientpassword" className="text-gray-900 text-xs sm:text-sm">Password</Label>
                    <div className="relative">
                      <Input
                        id="patientpassword"
                        type={showPassword ? "text" : "password"}
                        name="patientpassword"
                        placeholder="Enter your password..."
                        value={formdata.patientpassword}
                        onChange={handlechange}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 pr-10 h-10 sm:h-auto text-sm sm:text-base"
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
                          <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </button>
                    </div>
                    {formdata.patientpassword && formdata.patientpassword.length > 0 && (
                      <p className={`text-xs sm:text-sm mt-1 transition-colors duration-200 ${
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
                    <Label htmlFor="patientfirstname" className="text-gray-900 text-xs sm:text-sm">First Name</Label>
                    <Input
                      id="patientfirstname"
                      type="text"
                      name="patientfirstname"
                      placeholder="Enter your first name..."
                      value={formdata.patientfirstname}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-auto text-sm sm:text-base"
                      required
                    />
                  </div>

                  {/* Last Name Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientlastname" className="text-gray-900 text-xs sm:text-sm">Last Name</Label>
                    <Input
                      id="patientlastname"
                      type="text"
                      name="patientlastname"
                      placeholder="Enter your last name..."
                      value={formdata.patientlastname}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-auto text-sm sm:text-base"
                      required
                    />
                  </div>

                  {/* Middle Name Field */}
                  <div className="grid gap-2">
                    <Label htmlFor="patientmiddlename" className="text-gray-900 text-xs sm:text-sm">Middle Name</Label>
                    <Input
                      id="patientmiddlename"
                      type="text"
                      name="patientmiddlename"
                      placeholder="Enter your middle name..."
                      value={formdata.patientmiddlename}
                      onChange={handlechange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-auto text-sm sm:text-base"
                      required
                    />
                  </div>

                  
                  {/* Register Button */}
                  <button 
                    type="submit" 
                    disabled={issubmitting || emailexist || checkemail || !emailcharacters.test(formdata.patientemail)}
                    style={{
                      width: '100%',
                      height: '44px',
                      backgroundColor: (issubmitting || emailexist || checkemail || !emailcharacters.test(formdata.patientemail)) ? '#9ca3af' : '#1f2937',
                      color: (issubmitting || emailexist || checkemail || !emailcharacters.test(formdata.patientemail)) ? '#6b7280' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: (issubmitting || emailexist || checkemail || !emailcharacters.test(formdata.patientemail)) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      marginTop: '10px'
                    }}
                    onMouseEnter={(e) => {
                      if (!issubmitting && !emailexist && !checkemail && emailcharacters.test(formdata.patientemail)) {
                        e.target.style.backgroundColor = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!issubmitting && !emailexist && !checkemail && emailcharacters.test(formdata.patientemail)) {
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
                    ) : checkemail ? (
                      "Checking Email..."
                    ) : emailexist ? (
                      "Email Already In Use"
                    ) : !emailcharacters.test(formdata.patientemail) && formdata.patientemail ? (
                      "Invalid Email Format"
                    ) : (
                      "Register"
                    )}
                  </button>
                
                {/* Or continue with */}
                <div className="relative text-center text-xs sm:text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300">
                  <span className="relative z-10 px-2 text-gray-600 bg-white">
                    Or continue with
                  </span>
                </div>
                
                {/* Google Registration Button */}
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleRegistering}
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: isGoogleRegistering ? '#f3f4f6' : 'transparent',
                    color: isGoogleRegistering ? '#9ca3af' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isGoogleRegistering ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isGoogleRegistering) {
                      e.target.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isGoogleRegistering) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">
                    {isGoogleRegistering ? 'Registering with Google...' : 'Continue with Google'}
                  </span>
                </button>
                </div>
                
                {/* Sign In Link */}
                <div className="text-center text-xs sm:text-sm text-gray-600">
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