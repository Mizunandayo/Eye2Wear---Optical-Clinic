/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import eye2wearbg from "../src/assets/images/eye2wearbg.png";
import landingbg2 from "../src/assets/images/landingbg2.png";
import navlogo from  "../src/assets/images/navlogo.png";
import Typewriter from "typewriter-effect";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faClock, faUser, faPhone, faHome, faCalendar, faUserShield, faCamera, faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faEye as faEyeRegular} from "@fortawesome/free-regular-svg-icons";
import defaultprofilepic from '../src/assets/images/defaulticon.png'
import { GenderBox } from "./components/GenderBox";
import { useAuth } from "./hooks/patientuseAuth";
import useCloudinaryUpload from "./hooks/useCloudinaryUpload";
import storeimage from "../src/assets/images/store.png";
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import Footer from "./Footer";
import defaulticon from "../src/assets/images/defaulticon.png";



function PatientInformation(){

    const apiUrl = import.meta.env.VITE_API_URL;
  //For switching title forms

  const [activeForm, setactiveForm] = useState ('patientdemographic');
  
 

  const formtitles = {
    patientdemographic: 'Patient Demographic',
    medicalhistory: 'Medical History',
    ocularhistory: 'Ocular History',
    lifestylevisual: 'Lifestyle & Visual'
  };










  //PATIENT DEMOGRAPHIC DATAS
  const [selectedprofile, setselectedprofile] = useState(null);
  const [previewimage, setpreviewimage] = useState (null);

  const [patientfirstname, setpatientfirstname] = useState('');






  //PATIENT MEDICAL HISTORY
  const [showeyedisease, setshoweyedisease] = useState(false);
  const [eyediseasedetails, seteyediseasedetails] = useState("");


  const [showautoimmune, setshowautoimmune] = useState(false);
  const [autoimmunedetails, setautoimmunedetails] = useState("");

  const [showneuro, setshowneuro] = useState(false);
  const [neurodetails, setneurodetails] = useState("");

  const [showallergies, setshowallergies] = useState(false);
  const [allergiesdetails, setallergiesdetails] = useState("");

  const [showmedications, setshowmedications] = useState(false);
  const [medicationdetails, setmedicationdetails] = useState("");

  const [showpasteyesurgeries, setshowpasteyesurgeries] = useState(false);
  const [eyesurgeriesdetails, seteyesurgeriesdetails] = useState("");

  const [showblooddisorders, setshowblooddisorders] = useState(false);
  const [blooddisordersdetails, setblooddisordersdetails] = useState("");


  const [showadditionalnotes, setshowadditionalnotes] = useState(false);
  const [additionaldetails, setadditionaldetails] = useState("");





  const [showotherpasteyecondition, setshowotherpasteyecondition] = useState(false);
  const [otherpasteyeconditiondetails, setotherpasteyeconditiondetails] = useState("");










  const imageinputref = useRef(null);




  //Handles the click event of upload button
  const handleuploadclick = () => {
    imageinputref.current.click();
  };


  const handleremoveprofile = () => {
    setselectedprofile(null);
    setpreviewimage(null);
    setdemographicformdata(prev => ({
      ...prev,
      patientprofilepicture: ''
    }))
    if(imageinputref.current){
      imageinputref.current.value = "";
    }
  }
  




  const handleprofilechange = (e) => {
    const file = e.target.files[0];
    if(file){
      // Client-side validation
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB limit
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      // Check file size
      if (file.size > maxSizeInBytes) {
        showProfileToast(false, "Image file is too large. Please choose an image smaller than 10MB.");
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        showProfileToast(false, "Invalid file format. Please choose a JPG, PNG, GIF, or WebP image.");
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Store the file for later Cloudinary upload
      setselectedprofile(file);
      
      // Create preview URL for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        setpreviewimage(reader.result);
      };
      
      reader.onerror = () => {
        showProfileToast(false, "Error reading the image file. Please try again.");
      };

      reader.readAsDataURL(file);
      
      // Reset any previous Cloudinary errors
      resetCloudinaryError();
    }
  }




  const textarearef = useRef(null);
  const adjusttextareaheight = () => {
    if(textarearef.current){
      textarearef.current.style.height = 'auto';
      textarearef.current.style.height = `${textarearef.current.scrollHeight}px`;
    }
  }


  useEffect(() => {
    adjusttextareaheight();
  }, [showneuro, showallergies, showautoimmune, showeyedisease, showmedications, showpasteyesurgeries, showeyedisease, showblooddisorders, showadditionalnotes, showotherpasteyecondition]);









  const [patientemail, setpatientemail] = useState('');
  const [patientlastname, setpatientlastname] = useState('');
  const [patientid, setpatientid] = useState('');
  const [patientprofilepicture, setpatientprofilepicture] = useState('');

  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  }

  const {handlelogout, fetchpatientdetails, fetchpatientdemographicbyemail, showLogoutModal, confirmLogout, cancelLogout} = useAuth();
  
  // Cloudinary upload hook
  const {
    uploadProfilePicture,
    uploading: cloudinaryUploading,
    uploadProgress,
    error: cloudinaryError,
    resetError: resetCloudinaryError
  } = useCloudinaryUpload();
  






  const [demographicformdata, setdemographicformdata] = useState({

    role:'Patient',
    patientdemographicId:'',
    patientlastname: '',
    patientfirstname:'',
    patientmiddlename:'',
    patientprofilepicture:'',
    patientage:'',
    patientbirthdate:'',
    patientgender:'',
    patientcontactnumber:'',
    patienthomeaddress:'',
    patientemergencycontactname:'',
    patientemergencycontactnumber:''
  });




  const [isexistingdemographic, setisexistingdemographic] = useState(false);
  const [demographicid, setdemographicid] = useState(null);
  const [isloadingdemographic, setisloadingdemographic] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
//LOADING PATIENT DEMOGRAPHIC DATA OR IF NOT IT WILL BE A CREATION OF DEMOGRAPHIC DATA
  useEffect(() => {
    const loadpatientaccount = async () => {
      try {
        setisloadingdemographic(true);
        console.log('Starting to load patient account...');
        const patientdata = await fetchpatientdetails();
        console.log('Patient data received:', patientdata);

        if(patientdata){
          setpatientfirstname(patientdata.patientfirstname || '');
          setpatientprofilepicture(patientdata.patientprofilepicture || '');
          setpatientemail(patientdata.patientemail || '');

          console.log('Fetching demographic data for email:', patientdata.patientemail);
          const demographicdata = await fetchpatientdemographicbyemail(patientdata.patientemail);
          console.log('Demographic data received:', demographicdata);
          
          if(demographicdata){
            setdemographicid(demographicdata._id);
            setisexistingdemographic(true);
            setdemographicformdata(prev => ({
              ...prev,
              ...demographicdata,
              patientemail: patientdata.patientemail,
            }));

            if(demographicdata.patientprofilepicture) {
              setpreviewimage(demographicdata.patientprofilepicture);
            }
            
          }else{
            console.log('No demographic data found, setting up for new profile creation');
            setisexistingdemographic(false);
            setdemographicformdata(prev => ({
              ...prev,
              patientemail: patientdata.patientemail,
              patientfirstname: patientdata.patientfirstname || '',
              patientlastname: patientdata.patientlastname || '',
              patientmiddlename: patientdata.patientmiddlename || '',
              patientprofilepicture: patientdata.patientprofilepicture || ''
            }));
          }
        } else {
          console.log('No patient data received');
        }
      } catch (error) {
        console.error('Error loading patient account:', error);
      } finally {
        setisloadingdemographic(false);
      }
    };
      loadpatientaccount();
  }, [fetchpatientdetails, fetchpatientdemographicbyemail]);

  // Mobile menu click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && 
          !event.target.closest('.mobile-menu-container') && 
          !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Toast state variables - moved here to be declared before useEffect
  const [profileToast, setProfileToast] = useState(false);
  const [profileToastMessage, setProfileToastMessage] = useState("");
  const [profileToastClosing, setProfileToastClosing] = useState(false);
  const [profileIsClicked, setProfileIsClicked] = useState(false);
  const [profileProgressWidth, setProfileProgressWidth] = useState('0%');

  // Toast auto-close effect
  useEffect(() => {
    if (profileToast) {
      setProfileProgressWidth('0%');
      setProfileToastClosing(false);
      
      // Start progress bar
      setTimeout(() => {
        setProfileProgressWidth('100%');
      }, 100);
      
      // Close toast after 4 seconds
      const timeout = setTimeout(() => {
        setProfileToastClosing(true);
        setTimeout(() => {
          setProfileToast(false);
        }, 3000); // 3s for closing animation
      }, 4000);
      
      return () => clearTimeout(timeout);
    }
  }, [profileToast]);

  // Function to show profile toast
  const showProfileToast = (isSuccess, message) => {
    setProfileIsClicked(isSuccess);
    setProfileToastMessage(message);
    setProfileToast(true);
    setProfileToastClosing(false);
  };

  const [message, setmessage] = useState('');
  const [issubmitting, setissubmitting] = useState(false);
   


        









const calculateAge = (birthdate) => {
  if (!birthdate) return '';
  
  const birthDate = new Date(birthdate);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // If birthday hasn't occurred yet this year, subtract 1 from age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};



const handleinputchange = (e) => {
  const {name, value} = e.target;
  
  // If the changed field is birthdate, calculate age
  if (name === 'patientbirthdate') {
    const age = calculateAge(value);
    setdemographicformdata(prev => ({
      ...prev,
      [name]: value,
      patientage: age
    }));
  } else {
    setdemographicformdata(prev => ({
      ...prev,
      [name]: value  
    }));
  }
};






const submitpatientdemographic = async (e) => {
  e.preventDefault();
  setissubmitting(true);
  setmessage(null);

  try {
    console.log("Submitting: ", demographicformdata);
    
    // Prepare the demographic data
    let patientdemographictosend = { ...demographicformdata };
    
    // Handle profile picture upload to Cloudinary if a new file is selected
    if (selectedprofile) {
      try {
        showProfileToast(true, "Uploading profile picture to cloud storage...");
        
        // Upload to Cloudinary first
        // Use patient email as identifier for Cloudinary folder structure
        const identifier = demographicformdata.patientemail || patientemail || `patient_${Date.now()}`;
        console.log("Uploading image with identifier:", identifier);
        console.log("Patient email from form data:", demographicformdata.patientemail);
        console.log("Patient email from state:", patientemail);
        
        const uploadResult = await uploadProfilePicture(
          selectedprofile, 
          identifier,
          'patient'
        );
        
        // Update the form data with Cloudinary URL and public_id
        patientdemographictosend = {
          ...patientdemographictosend,
          patientprofilepicture: uploadResult.imageUrl,
          patientprofilepicture_public_id: uploadResult.public_id
        };
        
        console.log("Image uploaded to Cloudinary:", uploadResult);
        showProfileToast(true, "Profile picture uploaded successfully!");
        
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
      }
    }
    
    // Remove default profile picture if it's the placeholder
    if (patientdemographictosend.patientprofilepicture === defaultprofilepic) {
      patientdemographictosend.patientprofilepicture = 'default-profile-url';
      patientdemographictosend.patientprofilepicture_public_id = null;
    }

    let endpoint = `/api/patientdemographics`;
    let method = "POST";
    
    if(isexistingdemographic) {
      endpoint = `/api/patientdemographics/${demographicid}`;
      method = "PUT";
    }

    showProfileToast(true, "Saving demographic information...");

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("patienttoken")}`
      },
      body: JSON.stringify(patientdemographictosend)
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        errorData = { 
          message: `Server error (${response.status}). Please try again.` 
        };
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}: Failed to save demographic data`);
    }

    const responsedata = await response.json();
    console.log("Success: ", responsedata);
    
    // Update local state with the saved data
    setdemographicformdata(prev => ({
      ...prev,
      patientprofilepicture: patientdemographictosend.patientprofilepicture,
      patientprofilepicture_public_id: patientdemographictosend.patientprofilepicture_public_id
    }));
    
    // Clear the selected file since it's now uploaded
    setselectedprofile(null);
    
    // Show success toast
    showProfileToast(true, isexistingdemographic 
      ? "Updated Patient Demographic Successfully" 
      : "Created Patient Demographic Successfully");

    if(!isexistingdemographic && responsedata._id) {
      setisexistingdemographic(true);
      setdemographicid(responsedata._id);
    }

  } catch(error) {
    console.error("Error: ", error);
    
    // Handle different types of errors
    let errorMessage = "Failed to update profile. Please try again.";
    
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
        errorMessage = "Session expired. Please log in again.";
      } else if (error.message.includes("403") || error.message.includes("forbidden")) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (error.message.includes("404") || error.message.includes("not found")) {
        errorMessage = "Profile not found. Please refresh and try again.";
      } else if (error.message.includes("500") || error.message.includes("Server error")) {
        errorMessage = "Server error occurred. Please try again or contact support.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    showProfileToast(false, errorMessage);
  } finally {
    setissubmitting(false);
  }
}






















































  return (
    <>
      <header className="fixed top-0 w-full backdrop-blur-lg bg-white/90 border-b border-white/20 shadow-lg z-50 transition-all duration-300">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" flex justify-between items-center h-13">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={navlogo} 
                alt="Eye2Wear Logo" 
                className="h-10 w-auto hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Mobile menu button */}
            <div
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </div>

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-1">
              <Link 
                to="/patientlandingpage" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                to="/patientdashboard" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Appointments
              </Link>
              <Link 
                to="/patientproducts" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Store
              </Link>
              <Link 
                to="/patientwishlist" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Wishlist
              </Link>
              <Link 
                to="/patientorders" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Orders
              </Link>
              <Link 
                to="/aboutpage" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                About
              </Link>
            </nav>

            {/* Profile Section */}
            {localStorage.getItem("patienttoken") ? (
              <div className="relative hidden lg:block">
                <div 
                  onClick={showlogout}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  {!patientprofilepicture || patientprofilepicture === "default-profile-url" ? (
                    <img 
                      src={defaulticon} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200"
                    />
                  ) : (
                    <img 
                      src={patientprofilepicture} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{patientfirstname}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showlogoutbtn && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {!patientprofilepicture || patientprofilepicture === "default-profile-url" ? (
                          <img 
                            src={defaulticon} 
                            className="w-10 h-10 rounded-full object-cover"
                            alt="Profile"
                          />
                        ) : (
                          <img 
                            src={patientprofilepicture} 
                            className="w-10 h-10 rounded-full object-cover"
                            alt="Profile"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{patientfirstname}</p>
                          <p className="text-xs text-gray-500">Patient Account</p>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      to="/patientinformation" 
                      className="flex items-center px-4 py-3 text-sm text-sky-600 bg-sky-50 hover:bg-sky-50 transition-colors font-semibold"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Demographic Profile
                    </Link>
                    
                    <div
                      onClick={handlelogout}
                      className="cursor-pointer w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-3 w-4 h-4" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/userlogin" className="hidden lg:block">
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu-container lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-2 space-y-1">
                <Link 
                  to="/patientlandingpage" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Home
                </Link>
                <Link 
                  to="/patientdashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Appointments
                </Link>
                <Link 
                  to="/patientproducts" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Store
                </Link>
                <Link 
                  to="/patientwishlist" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Wishlist
                </Link>
                <Link 
                  to="/patientorders" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Orders
                </Link>
                <Link 
                  to="/aboutpage" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  About
                </Link>

                {/* Mobile Profile Section */}
                {localStorage.getItem("patienttoken") ? (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex items-center px-3 py-2 space-x-3">
                      {!patientprofilepicture || patientprofilepicture === "default-profile-url" ? (
                        <img 
                          src={defaulticon} 
                          alt="Profile" 
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-200"
                        />
                      ) : (
                        <img 
                          src={patientprofilepicture} 
                          alt="Profile" 
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-200"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{patientfirstname}</p>
                        <p className="text-xs text-gray-500">Patient Account</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center px-3 py-2 text-sm text-sky-600 bg-sky-50 rounded-lg transition-all duration-200 mx-0 font-semibold">
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Demographic Profile
                    </div>
                    
                    <div
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handlelogout();
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-3 w-4 h-4" />
                      Logout
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <Link 
                      to="/userlogin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block"
                    >
                      <button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Login
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>








      {/* Main Content */}
      <div className="min-h-screen  pt-16" style={{
        backgroundImage: `url(${eye2wearbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="container mx-auto px-4 py-8">


          {/* Main Card */}
          <div className="max-w-6xl mx-auto">
            <div className="mb-20 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-sky-800 px-8 py-6">
                <div className="flex items-center justify-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <FontAwesomeIcon icon={faEye} className="text-white text-2xl" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Patient Information Form</h1>
                    <p className="text-sky-100">Complete your profile for better eye care service</p>
                  </div>
                </div>
              </div>




              {/* Form Content */}
              <div className="p-8">
                {/* Patient Demographic Form */}
                <div 
                  className={`transition-all duration-300 ${activeForm === 'patientdemographic' ? 'block' : 'hidden'}`}
                >
                  {isloadingdemographic ? (
                    // Enhanced Skeleton Loading
                    <div className="animate-pulse">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Picture Skeleton */}
                        <div className="lg:col-span-1 flex flex-col items-center">
                          <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-6"></div>
                          <div className="w-32 h-10 bg-gray-200 rounded-lg mb-4"></div>
                          <div className="w-28 h-10 bg-gray-200 rounded-lg"></div>
                        </div>

                        {/* Form Fields Skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="space-y-2">
                              <div className="h-5 w-32 bg-gray-200 rounded"></div>
                              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
                            </div>
                          ))}
                          <div className="h-12 w-full bg-gray-200 rounded-lg mt-8"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Enhanced Form
                    <form onSubmit={submitpatientdemographic} className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Picture Section */}
                        <div className="lg:col-span-1">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                              {previewimage || (demographicformdata.patientprofilepicture && demographicformdata.patientprofilepicture !== '') ? (
                                <img 
                                  className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                                  src={previewimage || demographicformdata.patientprofilepicture}
                                  alt="Profile"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              {/* Fallback placeholder when no image */}
                              <div 
                                className={`relative w-48 h-48 rounded-full border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center ${
                                  previewimage || (demographicformdata.patientprofilepicture && demographicformdata.patientprofilepicture !== '') ? 'hidden' : 'flex'
                                }`}
                                style={{ display: previewimage || (demographicformdata.patientprofilepicture && demographicformdata.patientprofilepicture !== '') ? 'none' : 'flex' }}
                              >
                                <div className="text-center">
                                  <FontAwesomeIcon 
                                    icon={faUser} 
                                    className="text-sky-400 text-6xl mb-2"
                                  />
                                  <p className="text-sky-600 text-sm font-medium">No Photo</p>
                                </div>
                              </div>
                              <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <FontAwesomeIcon 
                                  icon={faCamera} 
                                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"
                                />
                              </div>
                            </div>
                            
                            <input  
                              className="hidden" 
                              type="file" 
                              onChange={handleprofilechange} 
                              accept="image/jpeg, image/jpg, image/png, image/gif, image/webp" 
                              ref={imageinputref} 
                            />
                            
                            <div className="flex items-center gap-2">
                              {(selectedprofile || previewimage) && (
                                <button
                                  type="button"
                                  onClick={handleremoveprofile}
                                  className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                  title="Remove Photo"
                                >
                                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                </button>
                              )}
                              
                              <div
                                type="button"
                                onClick={handleuploadclick}
                                className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              >
                                <FontAwesomeIcon icon={faCamera} className="mr-2" />
                                Upload Photo
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Name Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="flex items-center text-sm font-medium text-gray-700">

                                Last Name
                              </label>
                              <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                                value={demographicformdata.patientlastname} 
                                onChange={handleinputchange} 
                                type="text" 
                                name="patientlastname" 
                                id="patientlastname" 
                                placeholder="Enter your last name"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center text-sm font-medium text-gray-700">

                                First Name
                              </label>
                              <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                                value={demographicformdata.patientfirstname} 
                                onChange={handleinputchange}  
                                type="text" 
                                name="patientfirstname" 
                                id="patientfirstname" 
                                placeholder="Enter your first name"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">

                              Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demographicformdata.patientmiddlename} 
                              onChange={handleinputchange}  
                              type="text" 
                              name="patientmiddlename" 
                              id="patientmiddlename" 
                              placeholder="Enter your middle name (optional)"
                            />
                          </div>

                          {/* Birthdate and Age */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="flex items-center text-sm font-medium text-gray-700">

                                Birthdate
                              </label>
                              <input 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
                                value={demographicformdata.patientbirthdate} 
                                onChange={handleinputchange}  
                                type="date" 
                                name="patientbirthdate" 
                                id="patientbirthdate"
                                max={new Date().toISOString().split('T')[0]}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center text-sm font-medium text-gray-700">

                                Age
                              </label>
                              <input 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                                value={demographicformdata.patientage}  
                                readOnly 
                                type="number" 
                                name="patientage" 
                                id="patientage" 
                                placeholder="Auto-calculated from birthdate"
                              />
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">

                              Gender
                            </label>
                            <div className="mt-2">
                              <GenderBox value={demographicformdata.patientgender} onChange={handleinputchange} />
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">

                              Contact Number
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demographicformdata.patientcontactnumber} 
                              onChange={handleinputchange}  
                              type="text" 
                              name="patientcontactnumber" 
                              id="patientcontactnumber" 
                              placeholder="Ex: 09123456789"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">

                              Home Address
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demographicformdata.patienthomeaddress} 
                              onChange={handleinputchange}  
                              type="text" 
                              name="patienthomeaddress" 
                              id="patienthomeaddress" 
                              placeholder="Complete home address"
                              required
                            />
                          </div>

                          {/* Emergency Contact Section */}
                          <div className="border-t border-gray-200 pt-6 mt-8">
                            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-6">
                              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                  <FontAwesomeIcon icon={faUserShield} className="text-red-600" />
                                </div>
                                Emergency Contact Information
                              </h3>
                              <p className="text-sm text-gray-600">
                                This information will be used to contact someone in case of medical emergencies.
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">

                                  Contact Name
                                </label>
                                <input 
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-gray-400"
                                  value={demographicformdata.patientemergencycontactname} 
                                  onChange={handleinputchange}  
                                  type="text" 
                                  name="patientemergencycontactname" 
                                  id="patientemergencycontactname" 
                                  placeholder="Emergency contact name"
                                  required
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">

                                  Contact Number
                                </label>
                                <input 
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-gray-400"
                                  value={demographicformdata.patientemergencycontactnumber} 
                                  onChange={handleinputchange}  
                                  type="text" 
                                  name="patientemergencycontactnumber" 
                                  id="patientemergencycontactnumber" 
                                  placeholder="Emergency contact number"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <div className="pt-8">
                            <button 
                              type="submit" 
                              disabled={issubmitting} 
                              className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
                                issubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
                              }`}
                            >
                              <div className=" ease-in-out absolute inset-0 bg-sky-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
                              <div className="relative flex items-center">
                                {issubmitting ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isexistingdemographic ? "Updating Profile..." : "Saving Profile..."}
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon icon={faEdit} className="mr-3" />
                                    {isexistingdemographic ? "Update Profile" : "Save Profile"}
                                  </>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>

 
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#111827'
            }}>
              Confirm Logout
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelLogout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Update Toast Component */}
      {profileToast && (
        <div className="bottom-4 right-8 z-101 transform fixed">
          <div key={profileIsClicked ? 'success' : 'error'} className={`${profileToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
            {profileIsClicked ? (          
              <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
            ) : (
              <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
            )}
            {profileToastMessage}

            <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${profileIsClicked ? 'bg-green-500' : 'bg-red-500'}`} style={{width: profileProgressWidth, transition: 'width 4s linear'}}/>
          </div>
        </div>  
      )}
    </>
  )
  }
        
export default PatientInformation