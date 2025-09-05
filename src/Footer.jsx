
import React from "react";
import { Link } from "react-router-dom";
import landinglogo from "../src/assets/images/landinglogo.png";
import ambherlogo from "../src/assets/images/ambherlogo.png";
import bautistalogo from "../src/assets/images/bautistalogo.png";

function Footer() {
  return (
    <section id="section3" className=" mt-50 relative bg-[#0D0D0D] text-white overflow-hidden min-h-screen h-auto w-[99vw]">
        {/* Gradient Overlays */}
        <div className="-translate-x-1/3 -translate-y-1/3 absolute top-0 left-0 w-90 h-90 bg-blue-500/10 blur-3xl rounded-full "></div>
        <div className="bg-green-500/10 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 absolute bottom-0 right-0 w-90 h-90 "></div>

        {/* Content */}
        <div className="relative z-10 max-w-[1300px] mx-auto px-6">
          <div className="py-16 md:py-24">
            <div className="flex flex-col md:flex-row justify-between gap-14">
              {/* Left Section */}
              <div>
                <img
                  src={landinglogo}
                  alt="Eye2Wear Logo"
                  className="w-40 h-auto mb-6"
                />
                <p className="text-gray-400 text-sm sm:text-base max-w-sm leading-relaxed">
                  Comprehensive eye care platform bridging optometry and ophthalmology with{" "}
                  <span className="text-blue-400 font-medium">Eye2Wear</span> innovative solutions.
                </p>

                <div className="flex flex-wrap gap-6 pt-10">
                  <Link to="/patientlandingpage">
                    <span className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Home
                    </span>
                  </Link>
                  <Link to="/patientdashboard">
                    <span className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Appointments
                    </span>
                  </Link>
                  <Link to="/patientproducts">
                    <span className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Store
                    </span>
                  </Link>
                  <Link to="/patientwishlist">
                    <span className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors cursor-pointer">
                      Wishlist
                    </span>
                  </Link>

                 <Link to="/patientorders">
                    <span className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors cursor-pointer">
                     Orders
                    </span>
                  </Link>

                  <Link to="/aboutpage">
                    <span className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors cursor-pointer">
                      About
                    </span>
                  </Link>
                </div>

                {/* Services */}
                <div className="mb-8 mt-10">
                  <p className="text-lg font-semibold mb-3 text-white">Services</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">• Comprehensive Eye Exams</p>
                    <p className="text-sm text-gray-300">• Contact Lens Fitting</p>
                    <p className="text-sm text-gray-300">• Eye Surgery Consultation</p>
                    <p className="text-sm text-gray-300">• Eyewear Selection</p>
                    <p className="text-sm text-gray-300">• Digital Eye Strain Assessment</p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div>
                 <div className="flex items-center gap-3">
                   <img src={ambherlogo} className="w-6 h-6 rounded-full"/>
                    <div>
                        <p className="text-[17px]  font-medium text-white">Ambher Optical</p>
                      </div>
                    </div>


                <div className="mt-3  mb-6">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-envelope text-blue-400"></i>
                    <a
                      href="mailto:ambheroptical@gmail.com"
                      className="text-gray-300 hover:text-white text-sm sm:text-[14px] transition-colors"
                    >
                      ambheroptical@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-phone text-green-400"></i>
                    <span className="text-gray-300 text-sm sm:text-base">
                      +639171744327
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-map text-red-400"></i>
                    <span className="text-gray-300 text-sm sm:text-base">
                      Balanga, Bataan
                    </span>
                  </div>
                </div>



                 <div className="flex items-center gap-3">
                   <img src={bautistalogo} className="w-6 h-6 rounded-full"/>
                    <div>
                        <p className="text-[17px]  font-medium text-white">Bautista Eye Center</p>
                      </div>
                    </div>

                <div className="mt-3  mb-6">
                  <div className="flex items-center gap-2">
                    <i className="bx bx-envelope text-blue-400"></i>
                    <a href="mailto:bautistaeyecenter@gmail.com" className="transition-colors text-gray-300 hover:text-white text-sm sm:text-[14px]">
                      bautistaeyecenter@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-phone text-green-400"></i>
                    <span className="text-gray-300 text-sm sm:text-base">
                      +639171265762
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-map text-red-400"></i>
                    <span className="text-gray-300 text-sm sm:text-base">
                      Balanga, Bataan
                    </span>
                  </div>
                </div>





              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 border-t border-gray-800/70 py-6 text-center text-xs text-gray-500">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                © {new Date().getFullYear()}{" "}
                <span className="text-gray-300 font-medium">Eye2Wear</span>. All rights reserved.
              </div>

            </div>
          </div>
        </div>
      </section>
    );
}

export default Footer;