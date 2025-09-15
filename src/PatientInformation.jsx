/* eslint-disable no-unused-vars */
import React, {useEffect, useRef, useState} from "react";
import {Link, Navigate} from "react-router-dom";

import landingbg2 from "../src/assets/images/landingbg2.png";
import navlogo from  "../src/assets/images/navlogo.png";
import Typewriter from "typewriter-effect";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faClock, faUser, faPhone, faHome, faCalendar, faUserShield, faCamera, faEdit} from "@fortawesome/free-solid-svg-icons";
import {faEye as faEyeRegular} from "@fortawesome/free-regular-svg-icons";
import defaultprofilepic from '../src/assets/images/defaulticon.png'
import { GenderBox } from "./components/GenderBox";
import { useAuth } from "./hooks/patientuseAuth";
import storeimage from "../src/assets/images/store.png";
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import Footer from "./Footer";




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
      patientprofilepicture: 'default-profile-url'
    }))
    if(imageinputref.current){
      imageinputref.current.value = "";
    }
  }
  




  const handleprofilechange = (e) => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onloadend = () =>{
        setdemographicformdata(prev => ({
          ...prev,
          patientprofilepicture: reader.result
        }));

        setpreviewimage(reader.result);
      };

      reader.readAsDataURL(file);
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
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  }

  const {handlelogout, fetchpatientdetails, fetchpatientdemographicbyemail} = useAuth();
  






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
    
    // Remove the default profile picture if it's the placeholder
    const patientdemographictosend = {
      ...demographicformdata,
      patientprofilepicture: demographicformdata.patientprofilepicture === defaultprofilepic 
        ? null 
        : demographicformdata.patientprofilepicture
    };

    let endpoint = `/api/patientdemographics`;
    let method = "POST";
    
    if(isexistingdemographic) {
      endpoint = `/api/patientdemographics/${demographicid}`;
      method = "PUT";
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("patienttoken")}`
      },
      body: JSON.stringify(patientdemographictosend)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save demographic data");
    }

    const responsedata = await response.json();
    console.log("Success: ", responsedata);
    
    setmessage({
      text: isexistingdemographic 
        ? "Updated Patient Demographic Successfully" 
        : "Created Patient Demographic Successfully",
      type: "success"
    });

    if(!isexistingdemographic && responsedata._id) {
      setisexistingdemographic(true);
      setdemographicid(responsedata._id);
    }

  } catch(error) {
    console.error("Error: ", error);
    setmessage({
      text: error.message || "Failed, Please try again",
      type: "error"
    });
  } finally {
    setissubmitting(false);
  }
}






















































  return (
    <>
      <header className="fixed top-0 w-full backdrop-blur-lg bg-white/90 border-b border-white/20 shadow-lg z-50 transition-all duration-300">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={navlogo} 
                alt="Eye2Wear Logo" 
                className="h-10 w-auto hover:scale-105 transition-transform duration-200"
              />
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
              <div className="relative">
                <div 
                  onClick={showlogout}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  {!patientprofilepicture ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 animate-pulse flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                    </div>
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
                        {!patientprofilepicture ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-white" />
                          </div>
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
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Demographic Profile
                    </Link>
                    
                    <button
                      onClick={handlelogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-3 w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/userlogin">
                <button className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/patientlandingpage" 
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Main Card */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-sky-600 to-indigo-600 px-8 py-6">
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
                              {previewimage || (defaultprofilepic && defaultprofilepic !== '') ? (
                                <img 
                                  className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                                  src={previewimage || defaultprofilepic}
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
                                  previewimage || (defaultprofilepic && defaultprofilepic !== '') ? 'hidden' : 'flex'
                                }`}
                                style={{ display: previewimage || (defaultprofilepic && defaultprofilepic !== '') ? 'none' : 'flex' }}
                              >
                                <div className="text-center">
                                  <FontAwesomeIcon 
                                    icon={faUser} 
                                    className="text-sky-400 text-6xl mb-2"
                                  />
                                  <p className="text-sky-600 text-sm font-medium">No Photo</p>
                                </div>
                              </div>
                              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
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
                              accept="image/jpeg, image/jpg, image/png" 
                              ref={imageinputref} 
                            />
                            
                            <button
                              type="button"
                              onClick={handleuploadclick}
                              className="flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <FontAwesomeIcon icon={faCamera} className="mr-2" />
                              Upload Photo
                            </button>
                            
                            {selectedprofile && (
                              <button
                                type="button"
                                onClick={handleremoveprofile}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Remove
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Name Fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="flex items-center text-sm font-medium text-gray-700">
                                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                                  <FontAwesomeIcon icon={faUser} className="text-sky-600 text-sm" />
                                </div>
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
                                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                                  <FontAwesomeIcon icon={faUser} className="text-sky-600 text-sm" />
                                </div>
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
                              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                                <FontAwesomeIcon icon={faUser} className="text-sky-600 text-sm" />
                              </div>
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
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                  <FontAwesomeIcon icon={faCalendar} className="text-green-600 text-sm" />
                                </div>
                                Birthdate
                              </label>
                              <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                                value={demographicformdata.patientbirthdate} 
                                onChange={handleinputchange}  
                                type="date" 
                                name="patientbirthdate" 
                                id="patientbirthdate"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center text-sm font-medium text-gray-700">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                  <span className="text-gray-600 text-sm font-medium">#</span>
                                </div>
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
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                              Gender
                            </label>
                            <div className="mt-2">
                              <GenderBox value={demographicformdata.patientgender} onChange={handleinputchange} />
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                <FontAwesomeIcon icon={faPhone} className="text-indigo-600 text-sm" />
                              </div>
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
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                <FontAwesomeIcon icon={faHome} className="text-orange-600 text-sm" />
                              </div>
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
                                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                    <FontAwesomeIcon icon={faUser} className="text-red-600 text-sm" />
                                  </div>
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
                                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                                    <FontAwesomeIcon icon={faPhone} className="text-red-600 text-sm" />
                                  </div>
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
                              <div className="absolute inset-0 bg-gradient-to-r from-sky-700 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></div>
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
    </>
  )
  }
        
export default PatientInformation