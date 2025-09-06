import React, { useState, useEffect, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";

import navlogo from "../src/assets/images/navlogo.png";
import Typewriter from "typewriter-effect";

import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";

import { useAuth } from "./hooks/patientuseAuth";

import compre from "../src/assets/images/compre.png";
import modern from "../src/assets/images/modern.png";
import eyespecialistexpert from "../src/assets/images/eyespecialistexpert.png";
import digitalplatform from "../src/assets/images/digitalplatform.png";
import DevOpslogo from "../src/assets/images/DevOpslogo.png";
import Footer from "./Footer";







function AboutPage() {
  const [patientfirstname, setpatientfirstname] = useState('');
  const [patientprofilepicture, setpatientprofilepicture] = useState('');
  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  };
  const { handlelogout, fetchpatientdetails } = useAuth();

  useEffect(() => {
    const loadpatient = async () => {
      const data = await fetchpatientdetails();
      if (data) {
        setpatientfirstname(data.patientfirstname || '');
        setpatientprofilepicture(data.patientprofilepicture || '');
      }
    };
    loadpatient();
  }, [fetchpatientdetails]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const currentusertoken = useMemo(() => localStorage.getItem("patienttoken"), []);
  const currentuserloggedin = useMemo(() => localStorage.getItem("patienttoken") ? "Patient" : null, []);





















  


  return (
    <> 
      <header id="header" className="backdrop-blur-md bg-[#ffffff36] sticky top-0 flex justify-between items-center text-black px-4 md:px-32  w-[99vw] drop-shadow-md z-50">
        <a href="#">
          <img src={navlogo} alt="" className="w-24 sm:w-28 md:w-33 hover:scale-105 transition-all"></img>
        </a>




        {/* Desktop Navigation */}
        <ul className="hidden xl:flex items-center gap-12 font-semibold text-base">
          <Link to="/patientlandingpage" className="text-[#000000] hover:text-white no-underline"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white text-black rounded-md transition-all cursor-pointer">Home</li></Link>
          <Link to="/patientdashboard"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Appointments</li></Link>
          <Link to="/patientproducts"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Store</li></Link>
          <Link to="/patientwishlist"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Wishlist</li></Link>
          <Link to="/patientorders"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Orders</li></Link>
          <Link to="/aboutpage"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">About</li></Link>
        </ul>

        {/* Mobile Navigation */}

        {localStorage.getItem("patienttoken") ? (
          <div id="profilecard" className="relative items-center justify-center flex">
            <div id="profile" onClick={showlogout} className="ml-2 sm:ml-3 flex justify-center items-center bg-[#fbfbfb00] border-2 border-gray-200 shadow-lg rounded-full hover:cursor-pointer hover:scale-105 transition-all">
              {!patientprofilepicture ? (
                <div className="h-10 w-10 sm:h-13 sm:w-13 rounded-full bg-gray-300 animate-pulse"></div>
              ) : (
                <img src={patientprofilepicture || 'default-profile.png'} alt="Profile" className="h-10 w-10 sm:h-13 sm:w-13 rounded-full"/>
              )}
            </div>

            {showlogoutbtn && (
              <div className="w-64 sm:w-75 flex-col p-4 sm:p-5 motion-preset-fade absolute top-full mt-2 z-[9999] flex justify-center items-start bg-[#ffffff] rounded-2xl hover:cursor-pointer transition-all shadow-lg right-0 sm:right-auto">
                <div className="hover:bg-[#f7f7f7] transition-all duration-300 ease-in-out py-2 px-1 rounded-2xl gap-3 flex items-center h-auto w-full">
                  {!patientprofilepicture ? (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 animate-pulse"></div>
                  ) : (
                    <img src={patientprofilepicture} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"/>
                  )}
                  <h1 className="font-albertsans font-semibold text-base sm:text-[19px]">{patientfirstname}</h1>
                </div>
                <div className="border-b-2 rounded-full border-[#747474] h-1 w-full my-1"></div>

                {localStorage.getItem("patienttoken") && (
                  <Link to="/patientinformation" className="w-full">
                    <div className="gap-2 flex items-center py-2 px-1 hover:bg-[#f7f7f7] duration-300 ease-in-out hover:text-[#000000] rounded-2xl transition-all cursor-pointer">
                      <img src={profileuser} className="w-7 h-7 sm:w-9 sm:h-9"/>
                      <h1 className="text-sm sm:text-[16px] text-[#202020]">Demographic Profile</h1>
                    </div>
                  </Link>
                )}

                <div id="logoutdiv" className="mt-2 px-1 py-2 hover:bg-[#f7f7f7] flex items-center gap-2 w-full rounded-2xl hover:cursor-pointer transition-all" onClick={handlelogout}>
                  <img src={logout} className="w-7 h-7 sm:w-9 sm:h-9"/>
                  <p className="font-semibold text-[#E04F5F] text-sm sm:text-[16px]">Logout</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/userlogin">
            <div className="ml-2 sm:ml-3 flex justify-center items-center p-2 sm:p-3 bg-[#027bbf] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" onClick={handlelogout}>
              <i className="bx bx-user-circle mt-1 pr-1 sm:pr-2 font-semibold text-white text-sm sm:text-[17px]"/>
              <p className="font-semibold text-white text-sm sm:text-[17px]">Login</p>
            </div>
          </Link>
        )}
      </header>














      



      <section id="section1" className="motion-preset-slide-up min-h-[100vh] pt-12  bg-gradient-to-br from-green-50 via-violet-50 to-blue-100 sm:py-16 lg:py-20 xl:py-24 h-full w-full ">

          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-3xl  lg:text-left">
            <p className="text-lg text-[#1d1d1d] max-w-2xl">Comprehensive Eye Care Solutions</p>
              <h2 className="text-3xl text-[#1d1d1d] sm:text-4xl mt-6 lg:text-5xl xl:text-6xl font-albertsans font-bold">Everything you need to know about <span className="text-[#0a72b3]">Eye2Wear</span></h2>
              <p className="text-lg text-[#1d1d1d] max-w-2xl mt-4">Filling the communication gap between optometry and ophthalmology we are integrating two of the top clinics, Ambher Optical and Bautista Eye Center, to offer the complete spectrum of eye care services under a single roof.</p>
            </div>



            
          <div className="mt-14  rounded-2xl w-full h-50 flex justify-center items-center gap-6">

              <div className="w-full  h-full"><img src={compre} className="w-full h-47 shadow-md rounded-2xl"/> <h1 className="mt-3 font-albertsans font-semibold text-[#0b66ac]">Comprehensive Care</h1></div>
              <div className="w-full  h-full "><img src={modern}  className="shadow-md w-full h-47 rounded-2xl"/> <h1 className="mt-3 font-albertsans font-semibold text-[#078d2b]">Modern Technology</h1></div>
              <div className="w-full h-full  "><img src={eyespecialistexpert}  className="shadow-md w-full h-47 rounded-2xl"/> <h1 className="mt-3 font-albertsans font-semibold text-[#522f94]">Expert Eye Specialists</h1></div>
              <div className="w-full  h-full  "><img src={digitalplatform}  className="shadow-md w-full h-47 rounded-2xl"/> <h1 className="mt-3 font-albertsans font-semibold  text-[#d01a44]">Digital Platform</h1></div>

          </div>


          </div>


      </section>









      <section id="section2" className="py-16 bg-white sm:py-20 lg:py-28 min-h-[160vh] w-[99.5%] flex ">
           
          
           <div className="w-full  flex flex-col items-center ">
            <div className="max-w-3xl  lg:text-center">
              <h2 className="text-3xl text-[#1d1d1d] sm:text-4xl mt-6 lg:text-5xl xl:text-6xl font-albertsans font-bold">The <span className="text-[#eca025]">DevOps</span> Team</h2>
              <p className="text-lg text-[#1d1d1d] max-w-2xl mt-4">We make everything aligned with our goals and visions. Passionate in technology and innovation. Strive for the best!</p>
            </div>

            <div className="px-30 gap-10 flex mt-15 w-full h-100 ">
                <div id="image1" className="p-5 w-full h-full shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 -rotate-1 hover:rotate-0 hover:scale-105">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white">Francis Genese</h1>
                        <p className="text-white">Full-Stack Developer</p>
                    </div> 
                </div>
                <div id="image2" className="p-5 w-full h-full shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 rotate-1 hover:rotate-0 hover:scale-105">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white">Johannes Aquino</h1>
                        <p className="text-white">Quality Analyst</p> 
                    </div> 
                </div>
                <div id="image3" className="p-5 w-full h-full shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 -rotate-1 hover:rotate-0 hover:scale-105">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white">Aljhon Lopez</h1>
                        <p className="text-white">Documentation</p>
                    </div> 
                </div>
                <div id="image4" className="p-5 w-full h-full shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 rotate-1 hover:rotate-0 hover:scale-105">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white">Gabriel Velasco</h1>
                        <p className="text-white">System Analyst</p> 
                    </div>
                </div>
            </div>








          </div>



      </section>

      


      <Footer />


    </>
  );
}

export default AboutPage;