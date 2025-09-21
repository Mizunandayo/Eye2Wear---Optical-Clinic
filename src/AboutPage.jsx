import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import navlogo from "../src/assets/images/navlogo.png";
import Typewriter from "typewriter-effect";
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import { useAuth } from "./hooks/patientuseAuth";
import defaulticon from "../src/assets/images/defaulticon.png";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  };
  const { handlelogout, fetchpatientdetails, showLogoutModal, confirmLogout, cancelLogout } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadpatient = async () => {
      // Only fetch patient details if user is logged in
      if (localStorage.getItem("patienttoken")) {
        try {
          const data = await fetchpatientdetails(true); // Allow guest access
          if (data) {
            setpatientfirstname(data.patientfirstname || '');
            setpatientprofilepicture(data.patientprofilepicture || '');
          }
        } catch {
          console.log('Failed to fetch patient details, but continuing as guest');
          // Don't redirect on error, just continue as guest user
        }
      }
    };
    loadpatient();
  }, [fetchpatientdetails]);

  // Handle clicking outside mobile menu to close it
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
              className="mobile-menu-button lg:hidden p-2 rounded-lg text-black hover:bg-gray-100 transition-colors duration-200"
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
                className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              {localStorage.getItem("patienttoken") && (
                <Link 
                  to="/patientdashboard" 
                  className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Appointments
                </Link>
              )}
              <Link 
                to="/patientproducts" 
                className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Store
              </Link>
              {localStorage.getItem("patienttoken") && (
                <>
                  <Link 
                    to="/patientwishlist" 
                    className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  >
                    Wishlist
                  </Link>
                  <Link 
                    to="/patientorders" 
                    className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  >
                    Orders
                  </Link>
                </>
              )}
              <Link 
                to="/aboutpage" 
                className="px-4 py-2 text-sm font-semibold text-sky-600 bg-sky-50 rounded-lg transition-all duration-200"
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
                  <span className="text-sm font-medium text-black hidden sm:block">{patientfirstname}</span>
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
                      className="flex items-center px-4 py-3 text-sm text-black hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Demographic Profile
                    </Link>
                    
                    <div
                      onClick={handlelogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faUserShield} className="mr-3 w-4 h-4" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/userlogin"
                className="hidden lg:block bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Login
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
                  className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Home
                </Link>
                {localStorage.getItem("patienttoken") && (
                  <Link 
                    to="/patientdashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  >
                    Appointments
                  </Link>
                )}
                <Link 
                  to="/patientproducts" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Store
                </Link>
                {localStorage.getItem("patienttoken") && (
                  <>
                    <Link 
                      to="/patientwishlist" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                    >
                      Wishlist
                    </Link>
                    <Link 
                      to="/patientorders" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                    >
                      Orders
                    </Link>
                  </>
                )}
                <Link 
                  to="/aboutpage" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-semibold text-sky-600 bg-sky-50 rounded-lg transition-all duration-200"
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
                    
                    <Link 
                      to="/patientinformation"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200 mx-0"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                      Demographic Profile
                    </Link>
                    
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
                      className="block w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md text-left"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <section id="section1" className="motion-preset-slide-up min-h-[100vh] pt-12 bg-gradient-to-br from-green-50 via-violet-50 to-blue-100 sm:py-16 lg:py-20 xl:py-24 h-full w-full">

          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-3xl text-center lg:text-left">
            <p className="text-base sm:text-lg text-[#1d1d1d] max-w-2xl mx-auto lg:mx-0">Comprehensive Eye Care Solutions</p>
              <h2 className="text-2xl sm:text-3xl text-[#1d1d1d] md:text-4xl mt-4 sm:mt-6 lg:text-5xl xl:text-6xl font-albertsans font-bold">Everything you need to know about <span className="text-[#0a72b3]">Eye2Wear</span></h2>
              <p className="text-base sm:text-lg text-[#1d1d1d] max-w-2xl mt-3 sm:mt-4 mx-auto lg:mx-0">Filling the communication gap between optometry and ophthalmology we are integrating two of the top clinics, Ambher Optical and Bautista Eye Center, to offer the complete spectrum of eye care services under a single roof.</p>
            </div>

          <div className="mt-8 sm:mt-14 rounded-2xl w-full h-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">

              <div className="w-full h-full"><img src={compre} className="w-full h-32 sm:h-47 shadow-md rounded-2xl object-cover"/> <h1 className="mt-2 sm:mt-3 font-albertsans font-semibold text-sm sm:text-base text-[#0b66ac] text-center">Comprehensive Care</h1></div>
              <div className="w-full h-full"><img src={modern} className="shadow-md w-full h-32 sm:h-47 rounded-2xl object-cover"/> <h1 className="mt-2 sm:mt-3 font-albertsans font-semibold text-sm sm:text-base text-[#078d2b] text-center">Modern Technology</h1></div>
              <div className="w-full h-full"><img src={eyespecialistexpert} className="shadow-md w-full h-32 sm:h-47 rounded-2xl object-cover"/> <h1 className="mt-2 sm:mt-3 font-albertsans font-semibold text-sm sm:text-base text-[#522f94] text-center">Expert Eye Specialists</h1></div>
              <div className="w-full h-full"><img src={digitalplatform} className="shadow-md w-full h-32 sm:h-47 rounded-2xl object-cover"/> <h1 className="mt-2 sm:mt-3 font-albertsans font-semibold text-sm sm:text-base text-[#d01a44] text-center">Digital Platform</h1></div>

          </div>


          </div>


      </section>









      <section id="section2" className="py-12 sm:py-16 bg-white lg:py-20 xl:py-28 min-h-[100vh] sm:min-h-[160vh] w-[99.5%] flex">
           
          
           <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-center lg:text-center">
              <h2 className="text-2xl sm:text-3xl text-[#1d1d1d] md:text-4xl mt-4 sm:mt-6 lg:text-5xl xl:text-6xl font-albertsans font-bold">The <span className="text-[#eca025]">DevOps</span> Team</h2>
              <p className="text-base sm:text-lg text-[#1d1d1d] max-w-2xl mt-3 sm:mt-4">We make everything aligned with our goals and visions. Passionate in technology and innovation. Strive for the best!</p>
            </div>

            <div className="px-4 sm:px-8 lg:px-30 gap-4 sm:gap-6 lg:gap-10 flex flex-col sm:flex-row mt-8 sm:mt-12 lg:mt-15 w-full h-auto">
                <div id="image1" className="p-4 sm:p-5 w-full h-48 sm:h-64 lg:h-100 shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 hover:scale-105 sm:rotate-1 sm:hover:rotate-0">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white text-sm sm:text-base">Francis Daniel M. Genese</h1>
                        <p className="text-white text-xs sm:text-sm">Full-Stack Developer - UI/UX Designer</p>
                    </div> 
                </div>

                <div id="image3" className="p-4 sm:p-5 w-full h-48 sm:h-64 lg:h-100 shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 hover:scale-105 sm:rotate-1 sm:hover:rotate-0">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white text-sm sm:text-base">Aljhon P. Lopez</h1>
                        <p className="text-white text-xs sm:text-sm">Documentation</p> 
                    </div>
                </div>
                
                <div id="image4" className="p-4 sm:p-5 w-full h-48 sm:h-64 lg:h-100 shadow-md rounded-2xl flex items-end justify-baseline relative overflow-hidden group transform transition duration-300 hover:scale-105 sm:-rotate-1 sm:hover:rotate-0">
                    <div> 
                        <h1 className="font-albertsans font-semibold text-white text-sm sm:text-base">Gabriel B. Velasco</h1>
                        <p className="text-white text-xs sm:text-sm">System Analyst</p>
                    </div> 
                </div>

            </div>

          </div>



      </section>

      


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
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default AboutPage;