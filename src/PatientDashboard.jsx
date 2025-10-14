import React, {useState, useEffect, useRef, useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import navlogo from  "../src/assets/images/navlogo.png";
import defaultprofilepic from '../src/assets/images/defaulticon.png';
import ambherlogo from '../src/assets/images/ambherlogo.png';
import bautistalogo from '../src/assets/images/bautistalogo.png';
import defaultimageplaceholder from "../src/assets/images/defaultimageplaceholder.png";
import { useAuth } from "./hooks/patientuseAuth";
import useApiService from "./hooks/useApiService";
import useSmartCache from "./hooks/useSmartCache";
import imageCompression from "browser-image-compression";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import Footer from "./Footer";
import defaulticon from "../src/assets/images/defaulticon.png";






// Skeleton Loading Components for Appointments
const AppointmentRowSkeleton = () => (
  <tr className="hover:bg-gray-50 transition-all ease-in-out duration-100 border-b-2 animate-pulse">
    {/* Date Created column */}
    <td className="py-3 px-6 text-center">
      <div className="h-5 bg-gray-300 rounded w-24 mx-auto"></div>
    </td>
    
    {/* Ambher Appointment column */}
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center items-center">
        <div className="h-5 bg-gray-300 rounded w-20 mr-1"></div>
        <div className="h-5 bg-gray-300 rounded w-16 mr-3"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20 px-4 py-2"></div>
      </div>
    </td>
    
    {/* Empty column */}
    <td className="py-3 px-6 text-center"></td>
    
    {/* Bautista Appointment column */}
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center items-center">
        <div className="h-5 bg-gray-300 rounded w-20 mr-1"></div>
        <div className="h-5 bg-gray-300 rounded w-16 mr-3"></div>
        <div className="h-8 bg-gray-200 rounded-full w-20 px-4 py-2"></div>
      </div>
    </td>
    
    {/* Actions column */}
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex justify-center items-center">
        <div className="h-9 bg-gray-300 rounded-2xl w-16 mr-2"></div>
        <div className="h-9 bg-gray-300 rounded-2xl w-20"></div>
      </div>
    </td>
  </tr>
);

// Mobile Card Skeleton for appointments
const AppointmentCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="h-4 bg-gray-300 rounded w-24"></div>
      <div className="h-6 bg-gray-300 rounded-full w-16"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
    <div className="flex gap-2 mt-4">
      <div className="h-8 bg-gray-300 rounded-lg w-16"></div>
      <div className="h-8 bg-gray-300 rounded-lg w-20"></div>
    </div>
  </div>
);

const AppointmentTableSkeleton = () => (
  <div className="rounded-2xl shadow-lg w-full h-full overflow-hidden">
    {/* Desktop Table View */}
    <div className="hidden md:block h-full overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#2781af] sticky top-0 z-10">
          <tr className="text-[#ffffff] font-albertsans font-bold">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center w-1/5">Date Created</th> 
            <th className="pb-3 pt-3 pl-2 pr-2 text-center w-1/4">Ambher Appointment</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center w-1/12"></th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center w-1/4">Bautista Appointment</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center w-1/6">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {[...Array(5)].map((_, index) => (
            <AppointmentRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Mobile Card View */}
    <div className="md:hidden p-4 h-full overflow-y-auto">
      {[...Array(3)].map((_, index) => (
        <AppointmentCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Pagination Component
const PaginationComponent = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  itemName = "items"
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center w-full px-4 py-3 bg-white border-t border-gray-200 rounded-b-2xl">
      <div className="flex-1 flex justify-between sm:hidden">
        <div
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === 1 
              ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100' 
              : 'text-black bg-white hover:bg-gray-50 cursor-pointer'
          }`}
        >
          Previous
        </div>
        <div
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === totalPages 
              ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100' 
              : 'text-black bg-white hover:bg-gray-50 cursor-pointer'
          }`}
        >
          Next
        </div>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center gap-5">
        <div>
          <p className="text-sm text-black font-albertsans">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> {itemName}
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous Button */}
            <div
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <i className="bx bx-chevron-left text-lg"></i>
            </div>
            
            {/* Page Numbers */}
            {getPageNumbers().map((pageNum) => (
              <div
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`cursor-pointer relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNum === currentPage
                    ? 'z-10 bg-[#2781af] border-[#2781af] text-white'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </div>
            ))}
            
            {/* Next Button */}
            <div
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages 
                  ? 'opacity-50 cursor-not-allowed text-gray-400' 
                  : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <i className="bx bx-chevron-right text-lg"></i>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

function PatientDashboard(){

  const _apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  




  const [activeappointmenttable, setactiveappointmenttable] = useState('bookappointment');
  const showappointmenttable = (appointmenttableid) => {
        setactiveappointmenttable(appointmenttableid);
  };










  
  const [patientfirstname, setpatientfirstname] = useState('');
  const [patientprofilepicture, setpatientprofilepicture] = useState('');
  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAmbherServices, setShowAmbherServices] = useState(false);
  const [showBautistaServices, setShowBautistaServices] = useState(false);
  const [showAmbherAppointmentForm, setShowAmbherAppointmentForm] = useState(false);
  const [showBautistaAppointmentForm, setShowBautistaAppointmentForm] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  // Service states
  const [ambherServices, setAmbherServices] = useState([]);
  const [bautistaServices, setBautistaServices] = useState([]);
  const [loadingAmbherServices, setLoadingAmbherServices] = useState(true);
  const [loadingBautistaServices, setLoadingBautistaServices] = useState(true);
  
  // Demographic profile completion states
  const [isDemographicLoading, setIsDemographicLoading] = useState(true);
  const [isDemographicComplete, setIsDemographicComplete] = useState(false);
  
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  }



 const {handlelogout, fetchpatientdetails, fetchpatientdemographicbyemail, showLogoutModal, confirmLogout, cancelLogout} = useAuth();
 const { 
   fetchPatientAppointments, 
   invalidateAppointmentData 
 } = useApiService();

 // Smart caching with real-time updates for appointments
 const { smartFetch, realtimeUpdates, CACHE_DURATIONS, invalidateCache, triggerRealtimeUpdate } = useSmartCache();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track if initial load has been done to prevent infinite loops
  const hasLoadedInitialData = useRef(false);

  //Retrieveing Data from useAuth Hook
  useEffect(() => {
    // Prevent running this effect multiple times
    if (hasLoadedInitialData.current) {
      return;
    }

    const loadpatient = async () => {

      try{

      const data = await fetchpatientdetails();
      if(data){
        setpatientfirstname(data.patientfirstname || '');
        setpatientprofilepicture(data.patientprofilepicture || '');
        localStorage.setItem("patientemail", data.patientemail);
        
        // Fetch appointments immediately after patient details are loaded
        if (data.patientemail) {
          console.log('📅 Patient details loaded, fetching appointments...');
          try {
            setloadingappointments(true);
            const appointmentData = await fetchPatientAppointments(data.patientemail);
            setpatientappointments(appointmentData || []);
            sethasInitialLoad(true);
            hasLoadedInitialData.current = true; // Mark as loaded
            console.log('📅 Initial appointments loaded:', appointmentData?.length || 0, 'appointments');
          } catch (error) {
            console.error("Error fetching initial appointments:", error);
            seterrorloadingappointments(error.message);
            setpatientappointments([]);
            hasLoadedInitialData.current = true; // Mark as attempted even on error
          } finally {
            setloadingappointments(false);
          }
        }
      }
    }catch(error){

        console.error("Error fetching patient details", error);

    }
   }; loadpatient();
  }, [fetchpatientdetails, fetchPatientAppointments]);


  // Fetch Ambher Services
  useEffect(() => {
    const fetchAmbherServices = async () => {
      try {
        const response = await fetch(`/api/ambherservice`);
        if (!response.ok) throw new Error("Failed to fetch Ambher services");
        const data = await response.json();
        // Filter only active (non-archived) services
        const activeServices = data.filter(service => !service.ambherserviceisarchived);
        setAmbherServices(activeServices);
      } catch (error) {
        console.error("Error fetching Ambher services:", error);
        setAmbherServices([]);
      } finally {
        setLoadingAmbherServices(false);
      }
    };

    fetchAmbherServices();
  }, []);

  // Fetch Bautista Services
  useEffect(() => {
    const fetchBautistaServices = async () => {
      try {
        const response = await fetch(`/api/bautistaservice`);
        if (!response.ok) throw new Error("Failed to fetch Bautista services");
        const data = await response.json();
        // Filter only active (non-archived) services
        const activeServices = data.filter(service => !service.bautistaserviceisarchived);
        setBautistaServices(activeServices);
      } catch (error) {
        console.error("Error fetching Bautista services:", error);
        setBautistaServices([]);
      } finally {
        setLoadingBautistaServices(false);
      }
    };

    fetchBautistaServices();
  }, []);




  const [patientdemographics, setpatientdemographics] = useState(null);

  // Enhanced demographic loading with profile completion check
  useEffect(() => {
    const loadingpatientdemographics = async (email) => {
      try {
        setIsDemographicLoading(true);
        const demgoraphicdata = await fetchpatientdemographicbyemail(email);
        
        if (demgoraphicdata && demgoraphicdata._id) {
          // Check if demographic profile has all required fields
          const requiredFields = [
            'patientlastname',
            'patientfirstname', 
            'patientmiddlename',
            'patientage',
            'patientbirthdate',
            'patientgender',
            'patientcontactnumber',
            'patienthomeaddress',
            'patientemergencycontactname',
            'patientemergencycontactnumber'
          ];
          
          const isComplete = requiredFields.every(field => 
            demgoraphicdata[field] && 
            demgoraphicdata[field].toString().trim() !== ''
          );
          
          setpatientdemographics(demgoraphicdata);
          setIsDemographicComplete(isComplete);
        } else {
          // No demographic profile found
          setpatientdemographics(null);
          setIsDemographicComplete(false);
        }
      } catch (error) {
        console.error("Failed fetching patientdemo", error);
        setpatientdemographics(null);
        setIsDemographicComplete(false);
      } finally {
        setIsDemographicLoading(false);
      }
    };

    if (patientfirstname) {
      const email = localStorage.getItem("patientemail");
      if (email) {
        loadingpatientdemographics(email);
      }
    }
  }, [patientfirstname, fetchpatientdemographicbyemail]);





    const [issubmitting, setissubmitting] = useState(false);

  const [additionaldetails, setadditionaldetails] = useState("");


  const textarearef = useRef(null);
  const adjusttextareaheight = () => {
    if(textarearef.current){
      textarearef.current.style.height = 'auto';
      textarearef.current.style.height = `${textarearef.current.scrollHeight}px`;
    }
  }






    // Note: These states are commented out as they're not currently used
    // const [showotherpatientbautistaappointmentotherservice, setshowotherpatientbautistaappointmentotherservice] = useState(false);
    // const [patientbautistaappointmentotherservicenote, setpatientbautistaappointmentotherservicenote] = useState("");

    // const [showotherpatientambherappointmentotherservice, setshowotherpatientambherappointmentotherservice] = useState(false);
    const [patientambherappointmentotherservicenote] = useState("");

    // Clinic location states
    const [ambherlocations, setambherlocations] = useState([]);
    const [bautistalocations, setbautistalocations] = useState([]);
    const [loadinglocations, setloadinglocations] = useState(false);

  // Function to fetch clinic locations by type
  const fetchcliniclocations = async (clinicType) => {
    try {
      setloadinglocations(true);
      const response = await fetch(`/api/cliniclocation/clinics/type/${encodeURIComponent(clinicType)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        console.error('Failed to fetch clinic locations:', data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching clinic locations:', error);
      return [];
    } finally {
      setloadinglocations(false);
    }
  };

  // Helper function to get location address by clinic ID
  const getLocationAddress = (clinicId, locations) => {
    if (!clinicId || !locations) return '';
    const location = locations.find(loc => loc.clinicId === clinicId);
    return location ? (location.address?.fullAddress || `${location.address?.street}, ${location.address?.city}` || location.clinicName) : '';
  };

  // Load clinic locations on component mount
  useEffect(() => {
    const loadcliniclocations = async () => {
      const [ambherData, bautistaData] = await Promise.all([
        fetchcliniclocations('Ambher Optical'),
        fetchcliniclocations('Bautista Eye Center')
      ]);
      
      setambherlocations(ambherData);
      setbautistalocations(bautistaData);
    };

    loadcliniclocations();
  }, []);

  useEffect(() => {
    adjusttextareaheight();
  });

  // Initialize services visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint
      setIsMobile(!isDesktop);
      if (isDesktop) {
        setShowAmbherServices(true);
        setShowBautistaServices(true);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicking outside mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);















 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
const patientsubmitappointment = async (formData) => {
  setissubmitting(true);

  try{

    // Validate that we have patient demographics
    if (!patientdemographics) {
      throw new Error('Patient demographic information is required. Please complete your profile first.');
    }

    if (!patientdemographics.patientlastname || !patientdemographics.patientfirstname || !patientdemographics.patientemail) {
      throw new Error('Patient name and email are required. Please complete your profile first.');
    }

    // Check which clinics have appointments
    const hasAmbherAppointment = formData.get('patientambherappointmentdate') && 
                                  formData.get('patientambherappointmenttime') && 
                                  formData.get('patientambherappointmentlocation');
    
    const hasBautistaAppointment = formData.get('patientbautistaappointmentdate') && 
                                    formData.get('patientbautistaappointmenttime') && 
                                    formData.get('patientbautistaappointmentlocation');

    const patientappointmentdata = {

      patientappointmentstatus: "Pending",

      patientappointmentprofilepicture: patientdemographics.patientprofilepicture || '',
      patientappointmentlastname: patientdemographics.patientlastname,
      patientappointmentfirstname: patientdemographics.patientfirstname,
      patientappointmentmiddlename: patientdemographics.patientmiddlename || '',
      patientappointmentemail: patientdemographics.patientemail,


      patientappointmentstaffname:"Staff Name",
      

      patientadditionalappointmentnotes: additionaldetails,
      patientadditionalappointmentnotesimage: "default-profile-url",
      patientappointmentpaymentotal: 0,
    }

    // Only add Ambher Optical data if an appointment is selected
    if (hasAmbherAppointment) {
      Object.assign(patientappointmentdata, {
        // Ambher Optical Clinic Data
        patientambherappointmenteyespecialist: "Optometrist Name",
        patientambherappointmentstaffname: "Ambher Staff Name",
        patientambherappointmentdate: formData.get('patientambherappointmentdate'),
        patientambherappointmenttime: formData.get('patientambherappointmenttime'),
        patientambherappointmentlocation: formData.get('patientambherappointmentlocation'),
        patientambherappointmentlocationaddress: getLocationAddress(formData.get('patientambherappointmentlocation'), ambherlocations),
        patientambherappointmentcataractscreening: formData.has('patientambherappointmentcataractscreening'),
        patientambherappointmentpediatricassessment: formData.has('patientambherappointmentpediatricassessment'),
        patientambherappointmentcolorvisiontesting: formData.has('patientambherappointmentcolorvisiontesting'),
        patientambherappointmentlowvisionaid: formData.has('patientambherappointmentlowvisionaid'),
        patientambherappointmentrefraction: formData.has('patientambherappointmentrefraction'),
        patientambherappointmentcontactlensefitting: formData.has('patientambherappointmentcontactlensefitting'),
        patientambherappointmentotherservice: formData.has('patientambherappointmentotherservice'),
        patientambherappointmentotherservicenote: patientambherappointmentotherservicenote || '',
        patientambherappointmentstatus: "Pending",
        patientambherappointmentpaymentotal: 0,
        patientambherappointmentconsultationremarkssubject: "",
        patientambherappointmentconsultationremarks:"",
        patientambherappointmentprescription: "",
        patientambherappointmentrating: 0,
        patientambherappointmentfeedback: "",
      });
    }

    // Only add Bautista Eye Center data if an appointment is selected
    if (hasBautistaAppointment) {
      Object.assign(patientappointmentdata, {
        // Bautista Eye Clinic Data
        patientbautistaappointmenteyespecialist: "Ophthalmologist Name",
        patientbautistaappointmentstaffname: "Bautista Staff Name",
        patientbautistaappointmentdate: formData.get('patientbautistaappointmentdate'),
        patientbautistaappointmenttime: formData.get('patientbautistaappointmenttime'),
        patientbautistaappointmentlocation: formData.get('patientbautistaappointmentlocation'),
        patientbautistaappointmentlocationaddress: getLocationAddress(formData.get('patientbautistaappointmentlocation'), bautistalocations),
        patientbautistaappointmentcomprehensiveeyeexam: formData.has('patientbautistaappointmentcomprehensiveeyeexam'),
        patientbautistaappointmentdiabeticretinopathy: formData.has('patientbautistaappointmentdiabeticretinopathy'),
        patientbautistaappointmentglaucoma: formData.has('patientbautistaappointmentglaucoma'),
        patientbautistaappointmenthypertensiveretinopathy: formData.has('patientbautistaappointmenthypertensiveretinopathy'),
        patientbautistaappointmentretinolproblem: formData.has('patientbautistaappointmentretinolproblem'),
        patientbautistaappointmentcataractsurgery: formData.has('patientbautistaappointmentcataractsurgery'),
        patientbautistaappointmentpterygiumsurgery: formData.has('patientbautistaappointmentpterygiumsurgery'),
        patientbautistaappointmentotherservice: formData.has('patientbautistaappointmentotherservice'),
        patientbautistaappointmentotherservicenote: patientambherappointmentotherservicenote || '',
        patientbautistaappointmentstatus: "Pending",
        patientbautistaappointmentpaymentotal: 0,
        patientbautistaappointmentconsultationremarkssubject: "",
        patientbautistaappointmentconsultationremarks: "",
        patientbautistaappointmentprescription: "",
        patientbautistaappointmentrating: 0,
        patientbautistaappointmentfeedback: "",
      });
    }

    // Debug: Log appointment data being sent
    console.log('Appointment data being sent:', patientappointmentdata);
    console.log('Patient demographics:', patientdemographics);
    console.log('Has Ambher Appointment:', hasAmbherAppointment);
    console.log('Has Bautista Appointment:', hasBautistaAppointment);

    // Create FormData for file uploads
    const submissionFormData = new FormData();
    
    // Add all appointment data
    Object.keys(patientappointmentdata).forEach(key => {
      submissionFormData.append(key, patientappointmentdata[key]);
    });

    // Add supporting documents
    console.log('Supporting documents before submission:', supportingdocuments);
    supportingdocuments.forEach((doc, index) => {
      console.log(`Adding supporting document ${index}:`, {
        originalname: doc.originalname,
        size: doc.size,
        type: doc.type
      });
      
      // Create a new File object with the correct name to ensure it's preserved
      const renamedFile = new File([doc.file], doc.originalname, {
        type: doc.file.type,
        lastModified: doc.file.lastModified
      });
      
      submissionFormData.append(`supportingdocuments`, renamedFile, doc.originalname);
      submissionFormData.append(`supportingdocument_${index}_originalname`, doc.originalname);
      submissionFormData.append(`supportingdocument_${index}_size`, doc.size.toString());
      submissionFormData.append(`supportingdocument_${index}_type`, doc.type);
    });

    // Debug: Log FormData contents
    console.log('FormData entries:');
    for (const [key, value] of submissionFormData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type
        });
      } else {
        console.log(`${key}:`, value);
      }
    }

    const response = await fetch(`/api/patientappointments/appointments`,{
      method: 'POST',
      headers: {
        'Authorization' : `Bearer ${localStorage.getItem('patienttoken')}`
        // Don't set Content-Type for FormData - let browser set it with boundary
      },
      body: submissionFormData
    });


    if(!response.ok){
      const errorText = await response.text();
      console.error('Server response:', response.status, errorText);
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }


    const result = await response.json();
    console.log('Patient Appointment Successfully Submitted for Review', result);

    console.log('🔄 Starting immediate appointment list refresh...');
    
    // Set flag to prevent tab switching interference
    setjustSubmittedAppointment(true);
    
    // Use dedicated post-submission refresh function
    await refreshAppointmentsAfterSubmission();
    
    // Also trigger real-time updates for other components
    triggerRealtimeUpdate('appointments');
    invalidateAppointmentData();
    
    // Reset form state
    setadditionaldetails('');
    setsupportingdocuments([]); // Clear supporting documents
    
    // Clean up preview URLs
    supportingdocuments.forEach(doc => {
      if (doc.previewUrl) {
        URL.revokeObjectURL(doc.previewUrl);
      }
    });
    
    // Close both appointment forms
    setShowAmbherAppointmentForm(false);
    setShowBautistaAppointmentForm(false);
    
    // Clear all form fields using a small delay to ensure form elements are rendered
    setTimeout(() => {
      // Ambher Optical fields
      const ambherDateInput = document.getElementById('patientambherappointmentdate');
      const ambherTimeInput = document.getElementById('patientambherappointmenttime');
      const ambherLocationInput = document.getElementById('patientambherappointmentlocation');
      
      // Bautista Eye Center fields
      const bautistaDateInput = document.getElementById('patientbautistaappointmentdate');
      const bautistaTimeInput = document.getElementById('patientbautistaappointmenttime');
      const bautistaLocationInput = document.getElementById('patientbautistaappointmentlocation');
      
      if (ambherDateInput) ambherDateInput.value = '';
      if (ambherTimeInput) ambherTimeInput.value = '';
      if (ambherLocationInput) ambherLocationInput.value = '';
      if (bautistaDateInput) bautistaDateInput.value = '';
      if (bautistaTimeInput) bautistaTimeInput.value = '';
      if (bautistaLocationInput) bautistaLocationInput.value = '';
      
      // Clear all checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name^="patient"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }, 100);
    
    // Switch to appointment list AFTER refresh completes
    setactiveappointmenttable('appointmentlist');
    
    // Scroll to top of the page smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Clear the flag after a delay to allow normal fetching again
    setTimeout(() => {
      console.log('🔄 Resetting justSubmittedAppointment flag after 3 seconds');
      setjustSubmittedAppointment(false);
    }, 3000); // 3 seconds should be enough
    
    console.log('✅ Appointment submission and refresh completed');
    
    // Show success toast
    setAppointmentIsClicked(true);
    setAppointmentToastMessage("Appointment Submitted Successfully!");
    setAppointmentToast(true);
    setAppointmentToastClosing(false);
    
  }catch(error) {
    console.error('Error Submitting Patient Appointment: ', error);
    
    // Show error toast
    setAppointmentIsClicked(false);
    setAppointmentToastMessage(error.message || "Failed to submit appointment");
    setAppointmentToast(true);
    setAppointmentToastClosing(false);
    
  }finally{
    setissubmitting(false);
  }
};









//CHECKS AMBHER OPTICAL AND BAUTISTA EYE CENTER EXISTING SCHEDULED APPOINTMENTS
const checkclinicscheduledappointments = async (formData) => {
  try {
    const existingappointmentambherDate = formData.get('patientambherappointmentdate');
    const existingappointmentambherTime = formData.get('patientambherappointmenttime');
    const existingappointmentambherLocation = formData.get('patientambherappointmentlocation');
    const existingappointmentbautistaDate = formData.get('patientbautistaappointmentdate');
    const existingappointmentbautistaTime = formData.get('patientbautistaappointmenttime');
    const existingappointmentbautistaLocation = formData.get('patientbautistaappointmentlocation');

    //Checks existing appointment schedules for Ambher Optical (with location)
    if (existingappointmentambherDate && existingappointmentambherTime && existingappointmentambherLocation) {
      const ambherexistingscheduleresponse = await fetch(`/api/patientappointments/appointments/ambher/${existingappointmentambherDate}/${existingappointmentambherTime}/${existingappointmentambherLocation}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      });
      
      if (ambherexistingscheduleresponse.ok) {
        const existingAmbherAppointments = await ambherexistingscheduleresponse.json();
        if (existingAmbherAppointments.length > 0) {
          return {
            conflict: true,
            message: "Selected date, time and location for Ambher Optical is already booked by another patient."
          };
        }
      }
    }

    //Checks existing appointment schedules for Bautista Eye Center (with location)
    if (existingappointmentbautistaDate && existingappointmentbautistaTime && existingappointmentbautistaLocation) {
      const bautisaexistingscheduleresponse = await fetch(`/api/patientappointments/appointments/bautista/${existingappointmentbautistaDate}/${existingappointmentbautistaTime}/${existingappointmentbautistaLocation}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      });
      
      if (bautisaexistingscheduleresponse.ok) {
        const existingBautistaAppointments = await bautisaexistingscheduleresponse.json();
        if (existingBautistaAppointments.length > 0) {
          return {
            conflict: true,
            message: "Selected date, time and location for Bautista Eye Center is already booked by another patient."
          };
        }
      }
    }

    return { conflict: false };

  } catch (error) {
    console.error("Failed to check existing appointments:", error);
    return { conflict: false }; 
  }
};





















 //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES
 //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES
 //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES
 //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES
 //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES //CHECKS IF THERE ARE EMPTY FIELDS IN APPOINTMENTFORM TO AVOID NULL VALUES

// Legacy error notification system (replaced by toast)
// const[patientappointmentformerror, setpatientappointmentformerror] = useState(null);
const [showpatientappointmentformError, setshowpatientappointmentformError] = useState(false);
// const [patientappointmentformerrorClosing, setpatientappointmentformerrorClosing] = useState(false);

// Toast states
const [appointmentToast, setAppointmentToast] = useState(false);
const [appointmentToastMessage, setAppointmentToastMessage] = useState("");
const [appointmentToastClosing, setAppointmentToastClosing] = useState(false);
const [appointmentIsClicked, setAppointmentIsClicked] = useState(false);
const [appointmentProgressWidth, setAppointmentProgressWidth] = useState('0%');

// Profile update toast states
const [profileToast, setProfileToast] = useState(false);
const [profileToastMessage, setProfileToastMessage] = useState("");
const [profileToastClosing, setProfileToastClosing] = useState(false);
const [profileIsClicked, setProfileIsClicked] = useState(false);
const [profileProgressWidth, setProfileProgressWidth] = useState('0%');




const handlesubmitpatientappointment = async (e) => {
  e.preventDefault();
  console.log('Submit handler triggered'); // Debug log
  console.log('Patient demographics:', patientdemographics); // Debug log
  console.log('Supporting documents:', supportingdocuments); // Debug log

  const appointmentformdata = new FormData(e.target);
  console.log('Form data entries:'); // Debug log
  for (let [key, value] of appointmentformdata.entries()) {
    console.log(key, value);
  }
  
  const { conflict, message } = await checkclinicscheduledappointments(appointmentformdata);
  if (conflict) {
    setAppointmentIsClicked(false);
    setAppointmentToastMessage(message);
    setAppointmentToast(true);
    setAppointmentToastClosing(false);
    return;
  }


  const patientambherappointmentdate = appointmentformdata.get('patientambherappointmentdate');
  const patientambherappointmenttime = appointmentformdata.get('patientambherappointmenttime');
  const patientambherappointmentlocation = appointmentformdata.get('patientambherappointmentlocation');
  const patientbautistaappointmentdate = appointmentformdata.get('patientbautistaappointmentdate');
  const patientbautistaappointmenttime = appointmentformdata.get('patientbautistaappointmenttime');
  const patientbautistaappointmentlocation = appointmentformdata.get('patientbautistaappointmentlocation');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowdate = tomorrow.toISOString().split('T')[0];

  let errormessage = null;
  
  if(!patientambherappointmentdate && !patientbautistaappointmentdate) {
    errormessage = "Please select at least one clinic appointment date";
  }
  else if((patientambherappointmentdate && !patientambherappointmenttime) || 
          (patientbautistaappointmentdate && !patientbautistaappointmenttime)){
    errormessage = "Please select time for your appointment";
  }
  else if((patientambherappointmentdate && !patientambherappointmentlocation) || 
          (patientbautistaappointmentdate && !patientbautistaappointmentlocation)){
    errormessage = "Please select clinic location for your appointment";
  }
  else if(patientambherappointmentdate && patientambherappointmentdate < tomorrowdate) {
    errormessage = "Scheduled appointment date for Ambher Optical must be scheduled for tomorrow or later";
  }
  else if(patientbautistaappointmentdate && patientbautistaappointmentdate < tomorrowdate) {
    errormessage = "Scheduled appointment date for Bautista Eye Center must be scheduled for tomorrow or later";
  }
  else if(patientambherappointmentdate && patientbautistaappointmentdate &&
          patientambherappointmentdate === patientbautistaappointmentdate &&
          patientambherappointmenttime === patientbautistaappointmenttime) {
    errormessage = "Appointed schedule for date and time cannot be the same for both clinics";
  }

  if(errormessage){
    setAppointmentIsClicked(false);
    setAppointmentToastMessage(errormessage);
    setAppointmentToast(true);
    setAppointmentToastClosing(false);
    return;
  }

  setshowpatientappointmentformError(false);
  // setpatientappointmentformerror(null); // Now using toast
  setAppointmentToast(false); // Reset toast
  patientsubmitappointment(appointmentformdata);
};


//TIMEOUT FOR APPOINTMENTFORM ERROR 
useEffect(() => {
  if (showpatientappointmentformError) {
    const timer = setTimeout(() => {
      // setpatientappointmentformerrorClosing(true); // Now using toast
      setTimeout(() => {
        setshowpatientappointmentformError(false);
        // setpatientappointmentformerror(null); // Now using toast
      }, 300);
     }, 4000); 
    return () => clearTimeout(timer);
  }
}, [showpatientappointmentformError]);

// Toast auto-hide functionality
useEffect(() => {
  if (appointmentToast) {
    setAppointmentProgressWidth('0%');
    setAppointmentToastClosing(false);
    setTimeout(() => {
      setAppointmentProgressWidth('100%');
    }, 100);
    
    const timer = setTimeout(() => {
      setAppointmentToastClosing(true);
      setTimeout(() => {
        setAppointmentToast(false);
        setAppointmentProgressWidth('0%');
      }, 300);
    }, 4000);
    
    return () => clearTimeout(timer);
  }
}, [appointmentToast]);

// Profile toast auto-hide functionality
useEffect(() => {
  if (profileToast) {
    setProfileProgressWidth('0%');
    setProfileToastClosing(false);
    setTimeout(() => {
      setProfileProgressWidth('100%');
    }, 100);
    
    const timer = setTimeout(() => {
      setProfileToastClosing(true);
      setTimeout(() => {
        setProfileToast(false);
        setProfileProgressWidth('0%');
      }, 300);
    }, 4000);
    
    return () => clearTimeout(timer);
  }
}, [profileToast]);

// Helper function to show profile update toast
const showProfileToast = (isSuccess, message) => {
  setProfileIsClicked(isSuccess);
  setProfileToastMessage(message);
  setProfileToast(true);
  setProfileToastClosing(false);
};

// Example usage for profile updates:
// For successful profile update: showProfileToast(true, "Profile updated successfully!");
// For failed profile update: showProfileToast(false, "Failed to update profile. Please try again.");











const handleviewappointment = (appointment) => {
  setselectedpatientappointment(appointment);

};










 //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT
 //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT
 //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT
 //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT
 //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT //LOADING THE APPOINTMENTS LIST BY GRABBING THE EMAIL OF THE PATIENT
 const [patientappointments, setpatientappointments] = useState([]);
 const [loadingappointmens, setloadingappointments] = useState(false);
 const [errorloadingappointments, seterrorloadingappointments] = useState(null);
 const [selectedpatientappointment, setselectedpatientappointment] = useState(null);
 const [viewpatientappointment, setviewpatientappointment] = useState(false);
 const [deletepatientappointment, setdeletepatientappointment] = useState(false);
 const [deletingappointment, setdeletingappointment] = useState(false); // Loading state for delete operation
 const [justDeletedAppointment, setjustDeletedAppointment] = useState(false); // Flag to prevent refetch after deletion
 const [hasInitialLoad, sethasInitialLoad] = useState(false); // Track if we've loaded at least once
 const [justSubmittedAppointment, setjustSubmittedAppointment] = useState(false); // Flag to prevent cache interference after submission
 const [lastRefreshTime, setlastRefreshTime] = useState(0); // Track when we last refreshed

 // Pagination state for appointments
 const [currentPage, setCurrentPage] = useState(1);
 const appointmentsPerPage = 6; // Number of appointments to display per page

 // Helper function to check if patient has pending Ambher appointment
 const hasPendingAmbherAppointment = () => {
   return patientappointments.some(appointment => 
     appointment.patientambherappointmentdate && 
     appointment.patientambherappointmentstatus === 'Pending'
   );
 };

 // Helper function to check if patient has pending Bautista appointment
 const hasPendingBautistaAppointment = () => {
   return patientappointments.some(appointment => 
     appointment.patientbautistaappointmentdate && 
     appointment.patientbautistaappointmentstatus === 'Pending'
   );
 };

 // Helper function to check if patient has accepted Ambher appointment
 const hasAcceptedAmbherAppointment = () => {
   return patientappointments.some(appointment => 
     appointment.patientambherappointmentdate && 
     appointment.patientambherappointmentstatus === 'Accepted'
   );
 };

 // Helper function to check if patient has accepted Bautista appointment
 const hasAcceptedBautistaAppointment = () => {
   return patientappointments.some(appointment => 
     appointment.patientbautistaappointmentdate && 
     appointment.patientbautistaappointmentstatus === 'Accepted'
   );
 };

 // Search functionality for appointments with debounce
 const [searchAppointments, setSearchAppointments] = useState('');
 const [debouncedSearch, setDebouncedSearch] = useState('');
 const [filteredAppointments, setFilteredAppointments] = useState([]);

 // Sorting and filtering states
 const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
 const [statusFilter, setStatusFilter] = useState([]);
 const [showStatusFilter, setShowStatusFilter] = useState(false);
 const [showColumnToggle, setShowColumnToggle] = useState(false);
 const [visibleColumns, setVisibleColumns] = useState({
   dateCreated: false,
   ambherAppointment: true,
   bautistaAppointment: true,
   actions: true
 });

 // Debounce search input
 useEffect(() => {
   const handler = setTimeout(() => {
     setDebouncedSearch(searchAppointments);
   }, 300); // 300ms debounce delay

   return () => {
     clearTimeout(handler);
   };
 }, [searchAppointments]);

 
 // Add a ref to track if we're already fetching to prevent duplicate calls
 const isFetchingRef = useRef(false);
 const lastFetchTimeRef = useRef(0);
 const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Search functionality with debounce
const searchAppointmentsDebounce = useCallback((searchTerm) => {
  if (!searchTerm.trim()) {
    setFilteredAppointments([]);
    setCurrentPage(1);
    return;
  }

  const filtered = patientappointments.filter(appointment => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search in appointment ID
    const appointmentId = appointment.patientappointmentid?.toString().toLowerCase() || '';
    
    // Search in created date
    const createdDate = formatappointmatedates(appointment.createdAt)?.toLowerCase() || '';
    
    // Search in Ambher appointment details
    const ambherDate = appointment.patientambherappointmentdate ? 
      formatappointmatedates(appointment.patientambherappointmentdate)?.toLowerCase() : '';
    const ambherTime = appointment.patientambherappointmenttime ? 
      formatappointmenttimes(appointment.patientambherappointmenttime)?.toLowerCase() : '';
    const ambherStatus = appointment.patientambherappointmentstatus?.toLowerCase() || '';
    const ambherLocation = appointment.patientambherappointmentlocation?.toLowerCase() || '';
    
    // Search in Bautista appointment details
    const bautistaDate = appointment.patientbautistaappointmentdate ? 
      formatappointmatedates(appointment.patientbautistaappointmentdate)?.toLowerCase() : '';
    const bautistaTime = appointment.patientbautistaappointmenttime ? 
      formatappointmenttimes(appointment.patientbautistaappointmenttime)?.toLowerCase() : '';
    const bautistaStatus = appointment.patientbautistaappointmentstatus?.toLowerCase() || '';
    const bautistaLocation = appointment.patientbautistaappointmentlocation?.toLowerCase() || '';
    
    return appointmentId.includes(searchLower) ||
           createdDate.includes(searchLower) ||
           ambherDate.includes(searchLower) ||
           ambherTime.includes(searchLower) ||
           ambherStatus.includes(searchLower) ||
           ambherLocation.includes(searchLower) ||
           bautistaDate.includes(searchLower) ||
           bautistaTime.includes(searchLower) ||
           bautistaStatus.includes(searchLower) ||
           bautistaLocation.includes(searchLower);
  });

  setFilteredAppointments(filtered);
  setCurrentPage(1); // Reset to first page when searching
}, [patientappointments]);

// Create debounced search function using useRef to persist the debounced function
const debouncedSearchRef = useRef();

// Sorting function
const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};

// Get sorted and filtered appointments
const getSortedAndFilteredAppointments = () => {
  let data = [...patientappointments];
  
  // Apply status filter
  if (statusFilter.length > 0) {
    data = data.filter(appointment => {
      const ambherMatch = appointment.patientambherappointmentdate && 
        statusFilter.includes(appointment.patientambherappointmentstatus);
      const bautistaMatch = appointment.patientbautistaappointmentdate && 
        statusFilter.includes(appointment.patientbautistaappointmentstatus);
      return ambherMatch || bautistaMatch;
    });
  }
  
  // Apply debounced search filter
  if (debouncedSearch.trim()) {
    const searchLower = debouncedSearch.toLowerCase();
    data = data.filter(appointment => {
      const dateCreated = formatappointmatedates(appointment.createdAt).toLowerCase();
      const ambherDate = appointment.patientambherappointmentdate ? 
        formatappointmatedates(appointment.patientambherappointmentdate).toLowerCase() : '';
      const ambherTime = appointment.patientambherappointmenttime ? 
        formatappointmenttimes(appointment.patientambherappointmenttime).toLowerCase() : '';
      const ambherStatus = appointment.patientambherappointmentstatus ? 
        appointment.patientambherappointmentstatus.toLowerCase() : '';
      const bautistaDate = appointment.patientbautistaappointmentdate ? 
        formatappointmatedates(appointment.patientbautistaappointmentdate).toLowerCase() : '';
      const bautistaTime = appointment.patientbautistaappointmenttime ? 
        formatappointmenttimes(appointment.patientbautistaappointmenttime).toLowerCase() : '';
      const bautistaStatus = appointment.patientbautistaappointmentstatus ? 
        appointment.patientbautistaappointmentstatus.toLowerCase() : '';
      
      return dateCreated.includes(searchLower) ||
        ambherDate.includes(searchLower) ||
        ambherTime.includes(searchLower) ||
        ambherStatus.includes(searchLower) ||
        bautistaDate.includes(searchLower) ||
        bautistaTime.includes(searchLower) ||
        bautistaStatus.includes(searchLower);
    });
  }
  
  // Apply sorting
  if (sortConfig.key) {
    data.sort((a, b) => {
      let aValue, bValue;
      
      switch(sortConfig.key) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'ambherDate':
          aValue = a.patientambherappointmentdate ? new Date(a.patientambherappointmentdate) : new Date(0);
          bValue = b.patientambherappointmentdate ? new Date(b.patientambherappointmentdate) : new Date(0);
          break;
        case 'bautistaDate':
          aValue = a.patientbautistaappointmentdate ? new Date(a.patientbautistaappointmentdate) : new Date(0);
          bValue = b.patientbautistaappointmentdate ? new Date(b.patientbautistaappointmentdate) : new Date(0);
          break;
        case 'ambherStatus':
          aValue = a.patientambherappointmentstatus || '';
          bValue = b.patientambherappointmentstatus || '';
          break;
        case 'bautistaStatus':
          aValue = a.patientbautistaappointmentstatus || '';
          bValue = b.patientbautistaappointmentstatus || '';
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  } else {
    // Default sorting: Show future appointments first, sorted by nearest date
    const now = new Date();
    
    data.sort((a, b) => {
      // Get the earliest appointment date for each record
      const getEarliestAppointment = (appointment) => {
        const dates = [];
        
        if (appointment.patientambherappointmentdate) {
          const ambherDateTime = new Date(appointment.patientambherappointmentdate);
          if (appointment.patientambherappointmenttime) {
            const [hours, minutes] = appointment.patientambherappointmenttime.split(':');
            ambherDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
          }
          dates.push(ambherDateTime);
        }
        
        if (appointment.patientbautistaappointmentdate) {
          const bautistaDateTime = new Date(appointment.patientbautistaappointmentdate);
          if (appointment.patientbautistaappointmenttime) {
            const [hours, minutes] = appointment.patientbautistaappointmenttime.split(':');
            bautistaDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
          }
          dates.push(bautistaDateTime);
        }
        
        return dates.length > 0 ? new Date(Math.min(...dates)) : null;
      };
      
      const aDate = getEarliestAppointment(a);
      const bDate = getEarliestAppointment(b);
      
      // If no dates, push to end
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      
      const aIsFuture = aDate >= now;
      const bIsFuture = bDate >= now;
      
      // Future appointments first
      if (aIsFuture && !bIsFuture) return -1;
      if (!aIsFuture && bIsFuture) return 1;
      
      // Both future: sort by nearest first
      if (aIsFuture && bIsFuture) {
        return aDate - bDate;
      }
      
      // Both past: sort by most recent first
      return bDate - aDate;
    });
  }
  
  return data;
};

// Toggle status filter
const toggleStatusFilter = (status) => {
  setStatusFilter(prev => {
    if (prev.includes(status)) {
      return prev.filter(s => s !== status);
    } else {
      return [...prev, status];
    }
  });
  setCurrentPage(1); // Reset to first page when filter changes
};

// Toggle column visibility
const toggleColumn = (columnKey) => {
  setVisibleColumns(prev => ({
    ...prev,
    [columnKey]: !prev[columnKey]
  }));
};

// Get unique statuses from appointments
const getUniqueStatuses = () => {
  const statuses = new Set();
  patientappointments.forEach(appointment => {
    if (appointment.patientambherappointmentstatus) {
      statuses.add(appointment.patientambherappointmentstatus);
    }
    if (appointment.patientbautistaappointmentstatus) {
      statuses.add(appointment.patientbautistaappointmentstatus);
    }
  });
  return Array.from(statuses).sort();
};

// Count appointments by status
const getStatusCount = (status) => {
  // Count total clinic appointments (not unique appointment records)
  // If one appointment has both Ambher and Bautista with same status, count both
  let count = 0;
  
  patientappointments.forEach(appointment => {
    // Count Ambher appointment if it exists and has this status
    if (appointment.patientambherappointmentdate && 
        appointment.patientambherappointmentstatus === status) {
      count++;
    }
    
    // Count Bautista appointment if it exists and has this status
    if (appointment.patientbautistaappointmentdate && 
        appointment.patientbautistaappointmentstatus === status) {
      count++;
    }
  });
  
  return count;
};

// Pagination helper functions
const handlePageChange = (page) => {
  setCurrentPage(page);
};

const getPaginatedAppointments = () => {
  const dataToDisplay = getSortedAndFilteredAppointments();
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;
  return dataToDisplay.slice(startIndex, endIndex);
};

// Handle search input change
const handleSearchAppointments = (e) => {
  const value = e.target.value;
  setSearchAppointments(value);
  if (debouncedSearchRef.current) {
    debouncedSearchRef.current(value);
  }
};

 // Dedicated function for refreshing appointments after submission
 const refreshAppointmentsAfterSubmission = useCallback(async () => {
   console.log('🔄 Starting post-submission appointment refresh...');
   
   const email = localStorage.getItem("patientemail");
   if (!email) return;
   
   try {
     // Show loading state
     setloadingappointments(true);
     seterrorloadingappointments(null);
     
     // Bypass all caches and fetch directly from API
     console.log('🔄 Fetching fresh data directly from API...');
     const token = localStorage.getItem('patienttoken');
     const response = await fetch(`/api/patientappointments/appointments/email/${email}`, {
       headers: { 'Authorization': `Bearer ${token}` }
     });
     
     if (!response.ok) {
       throw new Error(`HTTP error! Status: ${response.status}`);
     }
     
     const freshData = await response.json();
     console.log('🔄 Post-submission fresh data received:', freshData?.length || 0, 'appointments');
     
     // Immediately update state
     setpatientappointments(freshData || []);
     sethasInitialLoad(true);
     setlastRefreshTime(Date.now()); // Track refresh time
     
     // Clear all related caches
     const cacheKey = `appointmentData_${email}`;
     invalidateCache([cacheKey, `patientAppointments_${email}`]);
     
   } catch (error) {
     console.error('❌ Error in post-submission refresh:', error);
     seterrorloadingappointments(error.message);
   } finally {
     setloadingappointments(false);
   }
 }, [invalidateCache]);

 // Smart cached appointment fetching with real-time updates
 const fetchAppointmentData = useCallback(async (forceRefresh = false) => {
   const now = Date.now();
   
   // Prevent concurrent calls and add cooldown
   if (isFetchingRef.current || (!forceRefresh && now - lastFetchTimeRef.current < FETCH_COOLDOWN)) {
     console.log('📅 Fetch blocked - already in progress or in cooldown');
     return;
   }

   isFetchingRef.current = true;
   lastFetchTimeRef.current = now;
   setloadingappointments(true);
   seterrorloadingappointments(null);

   try {
     const email = localStorage.getItem("patientemail");
     if (!email) {
       throw new Error("Patient email not found");
     }
     
     console.log('📅 Fetching appointment data...', { forceRefresh, timestamp: new Date().toISOString() });
     
     // Use smart cached appointment fetching with correct duration key
     const data = await smartFetch(
       `appointmentData_${email}`,
       () => fetchPatientAppointments(email),
       CACHE_DURATIONS.appointments,
       forceRefresh
     );
     
     console.log('📅 Appointment data received:', data?.length || 0, 'appointments');
     setpatientappointments(data || []);
     sethasInitialLoad(true); // Mark that we've completed at least one load

   } catch (error) {
     console.error("Error fetching appointments: ", error);
     seterrorloadingappointments(error.message);
     // Set empty array on error to prevent infinite loading
     setpatientappointments([]);
   } finally {
     setloadingappointments(false);
     isFetchingRef.current = false;
   }
 }, [smartFetch, CACHE_DURATIONS.appointments, fetchPatientAppointments]);

 // Initialize appointment data when switching to appointment list
 useEffect(() => {
   console.log('📅 Tab switch effect triggered:', { 
     activeappointmenttable, 
     hasInitialLoad,
     appointmentCount: patientappointments.length,
     isLoading: loadingappointmens,
     justSubmitted: justSubmittedAppointment
   });
   
   if (activeappointmenttable === 'appointmentlist') {
     console.log('📅 Tab switched to appointment list');
     
     // Don't fetch if we just submitted an appointment - our fresh data should persist
     if (justSubmittedAppointment) {
       console.log('📅 Just submitted appointment, skipping fetch to preserve fresh data');
       return;
     }
     
     // Only fetch if we don't have data and aren't already loading
     if (patientappointments.length === 0 && !hasInitialLoad && !loadingappointmens && !isFetchingRef.current && !justDeletedAppointment) {
       console.log('📅 No appointments data, fetching...');
       fetchAppointmentData();
     } else {
       console.log('📅 Already have data or loading, skipping fetch');
     }
   } else {
     // Reset states when leaving appointment list
     console.log('📅 Left appointment list, resetting flags');
     seterrorloadingappointments(null);
     setjustSubmittedAppointment(false); // Reset the flag when leaving
   }
 }, [activeappointmenttable, loadingappointmens, fetchAppointmentData, hasInitialLoad, patientappointments.length, justSubmittedAppointment, justDeletedAppointment]);

 // Listen for real-time appointment updates with debounce
 useEffect(() => {
   if (!realtimeUpdates.has('appointments') || activeappointmenttable !== 'appointmentlist') {
     return;
   }

   // Don't override fresh data if we just submitted an appointment or recently refreshed or just deleted
   if (justSubmittedAppointment || justDeletedAppointment || (Date.now() - lastRefreshTime < 5000)) {
     console.log('📅 Real-time update detected but skipping - recent refresh, submission, or deletion');
     return;
   }

   console.log('📅 Real-time appointment update detected, scheduling refresh...');
   
   // Debounce real-time updates to prevent spam
   const debounceTimer = setTimeout(() => {
     fetchAppointmentData(true); // Force refresh on real-time update
   }, 500); // 500ms debounce

   return () => clearTimeout(debounceTimer);
 }, [realtimeUpdates, fetchAppointmentData, activeappointmenttable, justSubmittedAppointment, justDeletedAppointment, lastRefreshTime]);
 

 

//CONVERTS THE APPOINTMENT DATE INTO (ex. Sep 26, 2025)
 const formatappointmatedates = (datestring) => {
  if(!datestring) return '';
  const date = new Date(datestring);

  return date.toLocaleDateString('en-US',{
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
 };



//Formats the time selected
const formatappointmenttimes = (formattedtimestring) => {
  if (!formattedtimestring) return ''; 
  return formattedtimestring; 
};

// Helper function to check if appointment can be deleted
// Hide delete button if any appointment (Ambher or Bautista) has "Accepted" or "Completed" status
const canDeleteAppointment = (appointment) => {
  const ambherStatus = appointment.patientambherappointmentstatus;
  const bautistaStatus = appointment.patientbautistaappointmentstatus;
  
  // Check if either clinic has accepted/completed status
  const hasAcceptedOrCompleted = 
    ambherStatus === 'Accepted' || ambherStatus === 'Completed' ||
    bautistaStatus === 'Accepted' || bautistaStatus === 'Completed';
  
  return !hasAcceptedOrCompleted;
};

// Helper function to check if a pending appointment can be cancelled
// Show cancel button for pending appointments when there's an accepted/completed appointment in the same record
const canCancelPendingAppointment = (appointment, clinicType) => {
  const ambherStatus = appointment.patientambherappointmentstatus;
  const bautistaStatus = appointment.patientbautistaappointmentstatus;
  
  if (clinicType === 'ambher') {
    // Can cancel pending Ambher appointment if Bautista is accepted/completed
    return ambherStatus === 'Pending' && (bautistaStatus === 'Accepted' || bautistaStatus === 'Completed');
  } else if (clinicType === 'bautista') {
    // Can cancel pending Bautista appointment if Ambher is accepted/completed
    return bautistaStatus === 'Pending' && (ambherStatus === 'Accepted' || ambherStatus === 'Completed');
  }
  
  return false;
};

// Initialize debounced search function
useEffect(() => {
  debouncedSearchRef.current = debounce((searchTerm) => {
    searchAppointmentsDebounce(searchTerm);
  }, 300);
}, [searchAppointmentsDebounce]);




//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
const handledeleteappointment = async (appointmentId) => {
  setdeletingappointment(true); // Start loading state
  console.log('🗑️ Attempting to delete appointment with ID:', appointmentId);
  console.log('🗑️ Selected appointment object:', selectedpatientappointment);
  console.log('🗑️ Full appointment data:', {
    _id: selectedpatientappointment?._id,
    patientappointmentid: selectedpatientappointment?.patientappointmentid,
    receivedParameter: appointmentId
  });
  
  try{
    const deleteUrl = `/api/patientappointments/appointments/${appointmentId}`;
    console.log('🌐 DELETE URL:', deleteUrl);
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if(!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`Failed to Delete Appointment: ${response.status} ${response.statusText}`);
    }

    console.log('✅ Appointment deleted successfully');
    
    // Set flag to prevent automatic refetch
    setjustDeletedAppointment(true);
    
    // Remove from local state immediately for instant UI update
    setpatientappointments(prev => {
      const updatedAppointments = prev.filter(appt => appt.patientappointmentid !== appointmentId);
      console.log('🔄 Updated appointments list:', updatedAppointments.length, 'appointments remaining');
      return updatedAppointments;
    });

    // Clear ALL appointment-related caches (both frontend and API service caches)
    const email = localStorage.getItem("patientemail");
    if (email) {
      const cacheKeys = [
        `appointmentData_${email}`,        // SmartCache key
        `patientAppointments_${email}`     // ApiService cache key
      ];
      console.log('🔄 Invalidating all appointment caches:', cacheKeys);
      invalidateCache(cacheKeys);
    }
    
    // DO NOT trigger real-time updates immediately - let backend cache expire naturally
    // triggerRealtimeUpdate('appointments'); // REMOVED - causes premature refetch
    // invalidateAppointmentData(); // REMOVED - causes premature refetch

    // Close the modal and reset selected appointment immediately
    setdeletepatientappointment(false);
    setselectedpatientappointment(null);
    
    // Reset the flag after a longer delay to prevent refetch
    setTimeout(() => {
      setjustDeletedAppointment(false);
      console.log('🔄 Deletion flag reset, backend cache should be expired now');
    }, 5000); // Increased to 5 seconds to let backend cache expire

    }catch(error){
      console.error("Appointment deletion failed: ", error);
      seterrorloadingappointments(error.message);
      
      // Close modal on error too to prevent stale state
      setdeletepatientappointment(false);
      setselectedpatientappointment(null);
    } finally {
      setdeletingappointment(false); // End loading state
    }
}

// Cancel specific clinic appointment (set status to 'Cancelled')
const handleCancelAppointment = async (appointmentId, clinicType) => {
  console.log('🚫 Attempting to cancel appointment with ID:', appointmentId, 'for clinic:', clinicType);
  
  try {
    const updateUrl = `/api/patientappointments/appointments/${appointmentId}`;
    console.log('🌐 PUT URL:', updateUrl);

    // Prepare the update data based on clinic type
    const updateData = {};
    if (clinicType === 'ambher') {
      updateData.patientambherappointmentstatus = 'Cancelled';
    } else if (clinicType === 'bautista') {
      updateData.patientbautistaappointmentstatus = 'Cancelled';
    }

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
      throw new Error(`Failed to Cancel Appointment: ${response.status} ${response.statusText}`);
    }

    const updatedAppointment = await response.json();
    console.log('✅ Appointment cancelled successfully:', updatedAppointment);

    // Update local state immediately for instant UI update
    setpatientappointments(prev => 
      prev.map(appt => 
        appt.patientappointmentid === appointmentId ? updatedAppointment : appt
      )
    );

    // Update the selected appointment for the modal if it's currently viewing this appointment
    if (selectedpatientappointment && selectedpatientappointment.patientappointmentid === appointmentId) {
      setselectedpatientappointment(updatedAppointment);
    }

    // Clear cache and trigger updates
    const email = localStorage.getItem("patientemail");
    if (email) {
      const cacheKey = `appointmentData_${email}`;
      console.log('🔄 Invalidating cache:', cacheKey);
      invalidateCache([cacheKey]);
    }
    
    // Trigger real-time updates
    triggerRealtimeUpdate('appointments');
    invalidateAppointmentData();

    // Show success message
    const clinicName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    console.log(`✅ ${clinicName} appointment cancelled successfully`);

  } catch (error) {
    console.error("Appointment cancellation failed: ", error);
    seterrorloadingappointments(error.message);
  }
};







  // Supporting documents/images (up to 5 files)
  const [supportingdocuments, setsupportingdocuments] = useState([]);
  const supportingdocumentsinputref = useRef(null);
  const MAX_SUPPORTING_DOCUMENTS = 5;


  // Supporting documents handling functions
  const handlesupportingdocumentsupload = () => {
    supportingdocumentsinputref.current.click();
  };

  const handlesupportingdocumentschange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (supportingdocuments.length + files.length > MAX_SUPPORTING_DOCUMENTS) {
      alert(`You can only upload up to ${MAX_SUPPORTING_DOCUMENTS} supporting documents/images.`);
      return;
    }

    const validFiles = [];
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    for (const file of files) {
      // Check file type (exclude videos)
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not supported. Please upload images or documents only (no videos).`);
        continue;
      }

      // Check file size (max 10MB per file)
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxFileSize) {
        alert(`File "${file.name}" is too large. Maximum file size is 10MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      const processedFiles = [];
      
      for (const file of validFiles) {
        let processedFile = file;
        
        // Compress images
        if (file.type.startsWith('image/')) {
          const imageConfig = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            initialQuality: 0.8
          };
          processedFile = await imageCompression(file, imageConfig);
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(processedFile);
        
        processedFiles.push({
          file: processedFile,
          originalname: file.name,
          size: processedFile.size,
          type: processedFile.type,
          previewUrl: previewUrl,
          id: Date.now() + Math.random() // Temporary ID
        });
        
        console.log(`Processed supporting document:`, {
          originalname: file.name,
          size: processedFile.size,
          type: processedFile.type
        });
      }

      setsupportingdocuments(prev => [...prev, ...processedFiles]);
      
      // Clear the input
      if (supportingdocumentsinputref.current) {
        supportingdocumentsinputref.current.value = "";
      }
      
    } catch (error) {
      console.error("Error processing files:", error);
      alert("Error processing files. Please try again.");
    }
  };

  const removesupportingdocument = (documentId) => {
    setsupportingdocuments(prev => {
      const updated = prev.filter(doc => doc.id !== documentId);
      // Clean up preview URLs
      const removedDoc = prev.find(doc => doc.id === documentId);
      if (removedDoc && removedDoc.previewUrl) {
        URL.revokeObjectURL(removedDoc.previewUrl);
      }
      return updated;
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'bx-image';
    if (mimeType === 'application/pdf') return 'bx-file-pdf';
    if (mimeType.includes('word')) return 'bx-file-doc';
    if (mimeType === 'text/plain') return 'bx-file-txt';
    return 'bx-file';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to handle document viewing
  const handledocumentview = (document) => {
    // For saved documents (from appointments), open in new tab or download
    if (document.url) {
      const fileUrl = `${_apiUrl}${document.url}`;
      
      // For images, show in modal instead of opening new tab
      const mimeType = document.type || document.mimetype;
      if (mimeType.startsWith('image/')) {
        setSelectedImage({
          url: fileUrl,
          name: document.originalname,
          mimeType: mimeType,
          originalDocument: document
        });
        setShowImageModal(true);
      } else if (mimeType === 'application/pdf') {
        // For PDFs, open in new tab
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
      } else {
        // For other file types, trigger download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = document.originalname;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (document.previewUrl) {
      // For form upload documents (before submission), open preview in new tab
      const mimeType = document.type;
      if (mimeType.startsWith('image/')) {
        setSelectedImage({
          url: document.previewUrl,
          name: document.originalname,
          mimeType: mimeType,
          originalDocument: document
        });
        setShowImageModal(true);
      } else {
        // For non-image files in form upload, show info that file will be downloadable after submission
        alert(`${document.originalname} will be available for download after appointment submission.`);
      }
    }
  };

  // Function to handle proper image download with correct MIME type
  const handleImageDownload = async (imageData) => {
    setIsDownloading(true);
    try {
      // Fetch the image as a blob to preserve MIME type
      const response = await fetch(imageData.url);
      const blob = await response.blob();
      
      // Ensure filename has proper extension based on MIME type
      let filename = imageData.name;
      const mimeToExtension = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'image/bmp': '.bmp',
        'image/tiff': '.tiff'
      };
      
      // Check if filename already has an extension
      const hasExtension = /\.[a-zA-Z]{2,4}$/.test(filename);
      if (!hasExtension && imageData.mimeType) {
        const extension = mimeToExtension[imageData.mimeType.toLowerCase()];
        if (extension) {
          filename += extension;
        }
      }
      
      // Create object URL with proper MIME type
      const url = window.URL.createObjectURL(new Blob([blob], { type: imageData.mimeType }));
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback to simple download
      const link = document.createElement('a');
      link.href = imageData.url;
      link.download = imageData.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };






 const [showbautistafeedbackdialog, setshowbautistafeedbackdialog] = useState(false);
 const [showambherfeedbackdialog, setshowambherfeedbackdialog] = useState(false);
 const [bautistaappointmentrating, setbautistaappointmentrating] = useState(null);
 const [bautistaappointmentfeedback, setbautistaappointmentfeedback] = useState("");
 const [ambherappointmentrating, setambherappointmentrating] = useState(null);
 const [ambherappointmentfeedback, setambherappointmentfeedback] = useState("");

 // Image modal states
 const [showImageModal, setShowImageModal] = useState(false);
 const [selectedImage, setSelectedImage] = useState(null);
 const [isDownloading, setIsDownloading] = useState(false);

 // PDF Export state
 const [isExportingPDF, setIsExportingPDF] = useState(false);

 // Keyboard support for image modal
 useEffect(() => {
   const handleKeyDown = (event) => {
     if (event.key === 'Escape' && showImageModal) {
       setShowImageModal(false);
       setSelectedImage(null);
     }
   };

   if (showImageModal) {
     document.addEventListener('keydown', handleKeyDown);
     // Prevent body scroll when modal is open
     document.body.style.overflow = 'hidden';
   }

   return () => {
     document.removeEventListener('keydown', handleKeyDown);
     document.body.style.overflow = 'unset';
   };
 }, [showImageModal]);




 //UPDATING THE FIELDS OF PATIENT APPOINTMENT FEEDBACKS
 const handlesubmitfeedback = async(clinicType) => {
  try{
    const appointmentid = selectedpatientappointment.patientappointmentid;
    const feedbackrating = clinicType === 'ambher' ? ambherappointmentrating : bautistaappointmentrating;
    const feedbackmessage = clinicType === 'ambher' ? ambherappointmentfeedback : bautistaappointmentfeedback;

    const response = await fetch(`/api/patientappointments/appointments/${appointmentid}`,{
      method: "PUT",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${localStorage.getItem('patienttoken')}`
      },
      body: JSON.stringify({
        [`patient${clinicType}appointmentrating`] : feedbackrating,
        [`patient${clinicType}appointmentfeedback`] : feedbackmessage
      })
    });


    if(!response.ok) {
      throw new Error("Failed to submit patient feedback");
    }

    const updatedappointment = await response.json();
    setselectedpatientappointment(updatedappointment);
    setpatientappointments(prevappointments =>
      prevappointments.map(appt =>
        appt.patientappointmentid === updatedappointment.patientappointmentid ? updatedappointment : appt
      )
    );


    if(clinicType === 'ambher') {
      setshowambherfeedbackdialog(false);
      setambherappointmentrating(null);
      setambherappointmentfeedback("");
    }else{
      setshowbautistafeedbackdialog(false);
      setbautistaappointmentrating(null);
      setbautistaappointmentfeedback("");
    }


    console.log(`${clinicType} Feedback Submitted Successfully`);
  
  }catch (error){
    console.error(`Patient feedback submission failed: ${clinicType} `, error);
  }
 };


// Modern PDF Export function for Appointments using Puppeteer backend
const exportAppointmentToPDF = async (appointmentData, clinicType) => {
  setIsExportingPDF(true);
  try {
    // Determine if it's Ambher or Bautista appointment based on the clinicType parameter
    const isAmbher = clinicType === 'ambher';
    
    // Extract appointment details
    const appointmentId = isAmbher 
      ? appointmentData.patientambherappointmentid 
      : appointmentData.patientbautistaappointmentid;
    const appointmentStatus = isAmbher 
      ? appointmentData.patientambherappointmentstatus 
      : appointmentData.patientbautistaappointmentstatus;
    const eyeSpecialist = isAmbher 
      ? appointmentData.patientambherappointmenteyespecialist 
      : appointmentData.patientbautistaappointmenteyespecialist;
    const appointmentDate = isAmbher 
      ? appointmentData.patientambherappointmentdate 
      : appointmentData.patientbautistaappointmentdate;
    const appointmentTime = isAmbher 
      ? appointmentData.patientambherappointmenttime 
      : appointmentData.patientbautistaappointmenttime;
    const locationAddress = isAmbher 
      ? appointmentData.patientambherappointmentlocationaddress 
      : appointmentData.patientbautistaappointmentlocationaddress;
    const billingTotal = isAmbher 
      ? appointmentData.patientambherappointmentpaymentotal 
      : appointmentData.patientbautistaappointmentpaymentotal;
    const consultationRemarksSubject = isAmbher 
      ? appointmentData.patientambherappointmentconsultationremarkssubject 
      : appointmentData.patientbautistaappointmentconsultationremarkssubject;
    const consultationRemarks = isAmbher 
      ? appointmentData.patientambherappointmentconsultationremarks 
      : appointmentData.patientbautistaappointmentconsultationremarks;
    const prescription = isAmbher 
      ? appointmentData.patientambherappointmentprescription 
      : appointmentData.patientbautistaappointmentprescription;
    
    const clinic = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
    const clinicColor = isAmbher ? '#10b981' : '#3b82f6';
    const customerName = `${appointmentData.patientappointmentfirstname} ${appointmentData.patientappointmentlastname}`;
    const customerEmail = appointmentData.patientappointmentemail;
    const formattedDate = formatappointmatedates(appointmentDate);
    const formattedTime = formatappointmenttimes(appointmentTime);
    const tinNumber = isAmbher ? 'TIN: 123-456-789-001' : 'TIN: 987-654-321-002';
    
    // Get services done from database arrays (without prices)
    let servicesHTML = '';
    if (isAmbher) {
      // Get Ambher services from servicesavailed array
      const services = [];
      if (appointmentData.patientambherappointmentservicesavailed && appointmentData.patientambherappointmentservicesavailed.length > 0) {
        appointmentData.patientambherappointmentservicesavailed.forEach(service => {
          services.push({
            name: service.serviceName
          });
        });
      }
      if (appointmentData.patientambherappointmentotherservice) {
        services.push({
          name: `Other Service: ${appointmentData.patientambherappointmentotherservicenote || 'Not specified'}`
        });
      }
      
      if (services.length > 0) {
        servicesHTML = services.map(service => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-size: 11px; color: #333; font-weight: 500;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #10b981; font-size: 14px;">✓</span>
                <span>${service.name}</span>
              </div>
            </td>
          </tr>
        `).join('');
      }
    } else {
      // Get Bautista services from servicesavailed array
      const services = [];
      if (appointmentData.patientbautistaappointmentservicesavailed && appointmentData.patientbautistaappointmentservicesavailed.length > 0) {
        appointmentData.patientbautistaappointmentservicesavailed.forEach(service => {
          services.push({
            name: service.serviceName
          });
        });
      }
      if (appointmentData.patientbautistaappointmentotherservice) {
        services.push({
          name: `Other Service: ${appointmentData.patientbautistaappointmentotherservicenote || 'Not specified'}`
        });
      }
      
      if (services.length > 0) {
        servicesHTML = services.map(service => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 8px; font-size: 11px; color: #333; font-weight: 500;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: #3b82f6; font-size: 14px;">✓</span>
                <span>${service.name}</span>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
    
    // Create modern HTML appointment summary
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: white;
              padding: 20px;
              color: #000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            .appointment-container {
              max-width: 700px;
              margin: 0 auto;
              background: white;
            }
            
            .appointment-header {
              text-align: center;
              border-bottom: 2px solid ${clinicColor};
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            
            .appointment-header h1 {
              font-size: 16px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
              color: ${clinicColor};
            }
            
            .clinic-name {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 4px;
              color: ${clinicColor};
            }
            
            .clinic-address {
              font-size: 11px;
              color: #555;
              margin-bottom: 2px;
            }
            
            .tin-number {
              font-size: 10px;
              color: #666;
              margin-top: 4px;
            }
            
            .appointment-body {
              padding: 0;
            }
            
            .appointment-info {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #ddd;
            }
            
            .info-group {
              font-size: 11px;
            }
            
            .info-group h4 {
              color: #666;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 3px;
              font-weight: 600;
            }
            
            .info-group p {
              color: #000;
              font-size: 11px;
              font-weight: 600;
            }
            
            .patient-section {
              background: #fafafa;
              padding: 12px 15px;
              margin-bottom: 20px;
              border-left: 3px solid ${clinicColor};
            }
            
            .patient-section h3 {
              color: #000;
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }
            
            .patient-section p {
              color: #333;
              font-size: 11px;
              margin: 2px 0;
            }
            
            .services-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              font-size: 11px;
            }
            
            .services-table thead {
              border-bottom: 2px solid ${clinicColor};
            }
            
            .services-table th {
              padding: 8px 6px;
              text-align: left;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              color: ${clinicColor};
            }
            
            .services-table td {
              padding: 12px 6px;
              border-bottom: 1px solid #eee;
              font-size: 11px;
              color: #333;
            }
            
            .services-table tbody tr:last-child td {
              border-bottom: none;
            }
            
            .notes-section {
              background: #f0f9ff;
              border-left: 3px solid ${clinicColor};
              padding: 10px 12px;
              margin: 15px 0;
              font-size: 10px;
            }
            
            .notes-section strong {
              color: ${clinicColor};
              font-size: 9px;
              display: block;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            
            .notes-section p {
              color: #333;
              font-size: 10px;
              line-height: 1.4;
            }
            
            .totals-section {
              margin: 20px 0;
              padding: 15px 0;
              border-top: 1px solid #ddd;
              border-bottom: 2px solid ${clinicColor};
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              font-size: 14px;
              font-weight: 700;
              color: ${clinicColor};
            }
            
            .status-badge {
              text-align: center;
              margin: 25px 0;
            }
            
            .status-badge div {
              border: 2px solid ${clinicColor};
              color: ${clinicColor};
              padding: 8px 20px;
              display: inline-block;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .appointment-footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              margin-top: 20px;
            }
            
            .appointment-footer p {
              color: #666;
              font-size: 9px;
              margin: 4px 0;
            }
            
            .appointment-footer .thank-you {
              color: #000;
              font-size: 12px;
              font-weight: 700;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="appointment-container">
            <!-- Header -->
            <div class="appointment-header">
              <h1>Appointment Summary</h1>
              <div class="clinic-name">${clinic}</div>
              <div class="clinic-address">${locationAddress}</div>
              <div class="tin-number">${tinNumber}</div>
            </div>
            
            <!-- Body -->
            <div class="appointment-body">
              <!-- Appointment Info -->
              <div class="appointment-info">
                <div class="info-group">
                  <h4>Appointment No</h4>
                  <p>#${appointmentId}</p>
                </div>
                <div class="info-group">
                  <h4>Date & Time</h4>
                  <p>${formattedDate} (${formattedTime})</p>
                </div>
                <div class="info-group">
                  <h4>Status</h4>
                  <p>${appointmentStatus}</p>
                </div>
                <div class="info-group">
                  <h4>Eye Specialist</h4>
                  <p>${eyeSpecialist || 'Not assigned'}</p>
                </div>
              </div>
              
              <!-- Patient Info -->
              <div class="patient-section">
                <h3>Patient Information</h3>
                <p style="font-weight: 600;">${customerName}</p>
                <p>${customerEmail}</p>
              </div>
              
              <!-- Services Table -->
              ${servicesHTML ? `
              <div style="margin-bottom: 20px;">
                <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; color: ${clinicColor};">
                  Services Performed
                </h3>
                <table class="services-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${servicesHTML}
                  </tbody>
                </table>
              </div>
              ` : ''}
              
              ${consultationRemarksSubject || consultationRemarks ? `
              <div class="notes-section">
                <strong>Consultation Notes</strong>
                ${consultationRemarksSubject ? `<p style="font-weight: 600; margin-bottom: 4px;">${consultationRemarksSubject}</p>` : ''}
                ${consultationRemarks ? `<p>${consultationRemarks}</p>` : ''}
              </div>
              ` : ''}
              
              ${prescription ? `
              <div class="notes-section">
                <strong>Prescription</strong>
                <p>${prescription}</p>
              </div>
              ` : ''}
              
              <!-- Totals -->
              ${billingTotal ? `
              <div class="totals-section">
                <div class="total-row">
                  <span>TOTAL BILLING</span>
                  <span>₱${Number(billingTotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>
              ` : ''}
              
              <!-- Status Badge -->
              <div class="status-badge">
                <div>✓ ${appointmentStatus}</div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="appointment-footer">
              <p class="thank-you">Thank you for choosing ${clinic}</p>
              <p>This is an official appointment summary generated by Eye2Wear Optical System</p>
              <p>Generated on: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Generate filename
    const statusText = appointmentStatus.replace(/\s+/g, '_');
    const fileName = `Appointment_Summary_${clinic.replace(/\s+/g, '_')}_${appointmentId}_${statusText}_${customerName.replace(/\s+/g, '_')}.pdf`;

    // Send HTML to backend for PDF generation using Puppeteer
    const response = await fetch(`${_apiUrl}/api/pdf/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent,
        fileName
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    // Get the PDF as arrayBuffer for proper binary handling
    const arrayBuffer = await response.arrayBuffer();
    
    // Create blob from arrayBuffer with correct MIME type
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup after a short delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Error generating appointment PDF:', error);
    alert('Error generating appointment PDF. Please try again.');
  } finally {
    setIsExportingPDF(false);
  }
};







//AVAILABLE TIME FOR EACH CLINIC

const ambherappointmentschedules = [
  '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  
];

const bautistaappointmentschedules = [
  '9:00 AM', '10:00 AM', '11:00 AM', 
  '12:00 PM', '1:00 PM', '2:00 PM',  '3:00 PM'
 
];



//GET TOMORROW DATE
const getdatetomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};


//GET UP TO THREE MONTHS OF APPOINTMET AVAILABILITY
const getuptothreemonthsappointmentavailability = () => {
  const threemonthsavailability = new Date();
  threemonthsavailability.setMonth(threemonthsavailability.getMonth() + 3);
  return threemonthsavailability.toISOString().split('T')[0];
};


//DISABLES WEEKEND APPOINTMENTS IN BAUTISTA
const disablebautistaweekends = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; 
};



//TOAST MESSAAGE WHEN SELECTED A WRONG DATEs
 const [bautistashownotavailweekendToast, setbautistashownotavailweekendToast] = useState(false);
 const [bautistashownotavailweekendToastClosing, setbautistashownotavailweekendToastClosing] = useState(false);


useEffect(() => {
  if(bautistashownotavailweekendToast){
    const bautistashownotavailweekendToastTimer = setTimeout(() => {
      setbautistashownotavailweekendToastClosing(true);
      setTimeout(() => setbautistashownotavailweekendToast(false), 300);}, 4000);
  
    return () => clearTimeout(bautistashownotavailweekendToastTimer);
  }
}, [bautistashownotavailweekendToast]);
































































































  return (
    <>
      {/* CSS for animations and mobile optimizations */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          /* Enhanced mobile-friendly scrollbars */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 6px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 6px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1;
          }

          /* Ensure touch-friendly tap targets on mobile */
          @media (max-width: 768px) {
            button, [role="button"], input[type="submit"], input[type="button"] {
              min-height: 44px;
              min-width: 44px;
            }
            
            /* Prevent zoom on inputs on iOS */
            input[type="text"], input[type="email"], input[type="password"], input[type="date"], select, textarea {
              font-size: 16px !important;
            }
            
            /* Improve form control spacing on mobile */
            select, input, textarea {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
            }
          }

          /* Smooth focus transitions */
          input:focus, select:focus, textarea:focus {
            outline: none;
            transition: all 0.2s ease-in-out;
          }
        `}
      </style>


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

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-1">
              <Link 
                to="/patientlandingpage" 
                className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                to="/patientdashboard" 
                className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Appointments
              </Link>
              <Link 
                to="/patientproducts" 
                className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Store
              </Link>
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
              <Link 
                to="/aboutpage" 
                className="px-4 py-2 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                About
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <div
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button p-2 rounded-lg text-black hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </div>
            </div>

            {/* Profile Section - Hidden on mobile */}
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
              <Link to="/userlogin" className="hidden lg:block">
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-container lg:hidden fixed top-[52px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 animate-in slide-in-from-top duration-200">
          <div className="px-4 py-2 space-y-1">
            {/* Mobile Navigation Links */}
            <Link 
              to="/patientlandingpage" 
              className="block px-4 py-3 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/patientdashboard" 
              className="block px-4 py-3 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Appointments
            </Link>
            <Link 
              to="/patientproducts" 
              className="block px-4 py-3 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Store
            </Link>
            <Link 
              to="/patientwishlist" 
              className="block px-4 py-3 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link 
              to="/patientorders" 
              className="block px-4 py-3 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Orders
            </Link>
            <Link 
              to="/aboutpage" 
              className="block px-4 py-3 text-sm font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Mobile Profile Section */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              {localStorage.getItem("patienttoken") ? (
                <>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-2">
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
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{patientfirstname}</p>
                      <p className="text-xs text-gray-500">Patient Account</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/patientinformation" 
                    className="flex items-center px-4 py-3 text-sm text-black hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3 w-4 h-4" />
                    Demographic Profile
                  </Link>
                  
                  <div
                    onClick={() => {
                      handlelogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faUserShield} className="mr-3 w-4 h-4" />
                    Logout
                  </div>
                </>
              ) : (
                <Link 
                  to="/userlogin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Login
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}











    {/* First Section */} {/* First Section */} {/* First Section */} {/* First Section */}
    <section className="pb-50 motion-preset-slide-up bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 bg-cover bg-center min-h-[100vh] w-full flex justify-center align-center px-2 sm:px-4" >
   
   
{/* Loading State - Show first priority */}
{isDemographicLoading ? (
  <div className="w-full max-w-lg mx-auto flex items-center justify-center mt-16 sm:mt-24 md:mt-32 p-4 sm:p-6">
    <div className="flex flex-col items-center justify-center w-full h-full p-8 sm:p-8">
      {/* Loading Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-[#184d85] mb-4"></div>
      

    </div>
  </div>
) : (
  <>
    {/* Complete Profile Message - Only show when not loading and profile is incomplete */}
    {!isDemographicComplete && (
      <div className="w-full max-w-lg mx-auto flex items-center justify-center mt-16 sm:mt-24 md:mt-32 p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center w-full h-full p-8 sm:p-8 ">

          <h1 className="font-albertsans font-bold text-[#184d85] text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-center leading-tight">
            Complete Your Profile
          </h1>
          <p className="text-sm sm:text-base text-center text-black/70 mb-6 sm:mb-8 leading-relaxed max-w-md">
            To access appointment features, please complete your demographic profile.
          </p>
          <Link to="/patientinformation" className="w-full sm:w-auto">
            <div className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-center">
              <h1 className="font-albertsans font-semibold text-sm sm:text-base">Go to Demographic Profile</h1>
            </div>
          </Link>
        </div>
      </div>
    )}
    
    {/* Appointment Dashboard - Only show when not loading and profile is complete */}
    {isDemographicComplete && (
    <div 
      id="appointmentpanel" 
      className="bg-cover bg-center h-full w-full flex items-center justify-center" >

      <div className="w-full h-full flex justify-start items-start pt-3 ">

       <div  className="h-auto w-full flex flex-col items-center justify-center mb-3" >

      
      <div id="appointment" className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 w-full h-[100%] p-2 sm:p-4 mt-12 rounded-2xl" >  
          
                <div className="flex items-center justify-center w-full"><i className="bx bxs-calendar text-[#184d85] text-[20px] sm:text-[25px] mr-2"/> <h1 className="font-albertsans font-bold text-[#184d85] text-[20px] sm:text-[25px]">Appointments</h1></div>

                                 <div className="flex flex-col gap-4 sm:gap-7 pt-3 justify-between items-center mt-4 sm:mt-8 h-auto">
                <Link to="/patientinformation">
                {!patientdemographics ? (
                  // Skeleton Loading State
                  <div id="patientcard" className="flex justify-center items-start border-1 bg-white rounded-2xl shadow-md w-full max-w-[290px] h-[80px] animate-pulse">
                    <div className="w-[125px] h-full rounded-2xl flex justify-center items-center">
                      <div className="h-18 w-18 rounded-full bg-gray-300"></div>
                    </div>
                    <div className="bg-white min-w-0 flex flex-col justify-center items-start pl-2 pr-2 w-full h-full rounded-3xl">
                      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ) : (
                  // Actual Patient Card
                  <div id="patientcard" className="flex justify-center items-start border-1 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-100 ease-in-out rounded-2xl shadow-md w-full max-w-[290px] h-[80px]">
                    <div className="w-[125px] h-full rounded-2xl flex justify-center items-center">
                      <img src={patientdemographics?.patientprofilepicture || defaultprofilepic} alt="Profile" className="h-18 w-18 rounded-full object-cover"></img>
                    </div>
                    <div className="bg-white min-w-0 flex flex-col justify-center items-start pl-2 pr-2 w-full h-full rounded-3xl">
                      <h1 className="font-albertsans font-bold text-[15px] sm:text-[17px] truncate w-full text-black">{patientdemographics?.patientfirstname || ''} {patientdemographics?.patientlastname || ''}</h1>
                      <p className="text-[11px] sm:text-[13px] truncate w-full text-black/70">{patientdemographics?.patientemail || ''}</p>
                    </div>
                  </div>
                )}
                </Link> 
                   <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                  <div onClick={() => showappointmenttable('bookappointment')}  className={`hover:cursor-pointer hover:rounded-2xl transition-all duration-100 ease-in-out border-2 b-[#909090] rounded-3xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-center flex justify-center items-center w-full sm:w-auto ${activeappointmenttable==='bookappointment' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[13px] sm:text-[15px] text-[#5d5d5d] ${activeappointmenttable ==='bookappointment' ? 'text-white' : ''}`}>Book Appointment</h1></div>
                  <div onClick={() => showappointmenttable('appointmentlist')}  className={`hover:cursor-pointer hover:rounded-2xl transition-all duration-100 ease-in-out border-2 b-[#909090] rounded-3xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-center flex justify-center items-center w-full sm:w-auto ${activeappointmenttable ==='appointmentlist' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[13px] sm:text-[15px] text-[#5d5d5d] ${activeappointmenttable ==='appointmentlist' ? 'text-white' : ''}`}>Appointment List</h1></div>
                 </div> 
                 </div> 
                                 
                
                <div className="flex justify-center items-start" id="overview">


  {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/}
  {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/}
  {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/}
  {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/}
  {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/} {/*Patient Appointment Booking*/}
                 { activeappointmenttable === 'bookappointment' && ( 
                  <div id="bookappointment" className="animate-fadeInUp w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8 mt-6 sm:mt-5">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                      
             


                      <form onSubmit={handlesubmitpatientappointment} className="p-4 sm:p-8">
                        
                        {/* Error messages now handled by toast notification */}

                        {/* Clinic Selection Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                          
                          {/* Ambher Optical Card */}
                          <div  className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 overflow-hidden">
                            <div className="bg-white bg-opacity-80 px-4 sm:px-6 py-3 sm:py-4 border-b border-green-200">
                              <div className="flex items-center gap-4">
                                <img src={ambherlogo} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-sm" alt="Ambher Optical"/>  
                                <div>
                                  <h2 className="text-lg sm:text-xl font-bold text-green-700 font-albertsans">Ambher Optical</h2>
                                  <p className="text-gray-900 text-xs sm:text-sm">Vision Care & Eye Wellness</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">


                              {/* Services Description */}
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <i className="bx bx-list-check text-green-600"></i>
                                    Our Services
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowAmbherServices(!showAmbherServices)}
                                    style={{
                                      display: isMobile ? 'flex' : 'none',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.375rem 0.75rem',
                                      fontSize: '0.875rem',
                                      fontWeight: '500',
                                      color: '#166534',
                                      backgroundColor: '#dcfce7',
                                      borderRadius: '0.5rem',
                                      border: 'none',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#bbf7d0'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dcfce7'}
                                  >
                                    {showAmbherServices ? 'Hide Services' : 'Show Services'}
                                    <i className={`bx ${showAmbherServices ? 'bx-chevron-up' : 'bx-chevron-down'} text-sm`}></i>
                                  </button>
                                </h3>
                                {/* Mobile: Show when toggled, Desktop: Always show */}
                                <div className={`md:block ${showAmbherServices ? 'block' : 'hidden'}`}>
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-green-200">
                                  <p className="text-black leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                                    <span className="font-semibold text-green-700">Ambher Optical</span> specializes in comprehensive vision care and eye wellness services. Our experienced optometrists provide:
                                  </p>
                                  
                                  <div className="space-y-2 sm:space-y-3 text-gray-600">
                                    {loadingAmbherServices ? (
                                      // Loading skeleton
                                      <>
                                        {[...Array(3)].map((_, index) => (
                                          <div key={index} className="flex items-start gap-2 sm:gap-3 animate-pulse">
                                            <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                                            <div className="flex-1 space-y-2">
                                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    ) : ambherServices.length > 0 ? (
                                      // Display fetched services
                                      ambherServices.map((service) => (
                                        <div key={service._id} className="flex items-start gap-2 sm:gap-3">
                                          <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                          <div>
                                            <span className="font-medium text-black">{service.ambherservicename}</span> - {service.ambherservicedescription}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      // No services available
                                      <div className="flex items-center gap-2 text-gray-500 py-2">
                                        <i className="bx bx-info-circle text-lg"></i>
                                        <span className="text-sm">No services available at the moment.</span>
                                      </div>
                                    )}
                                  </div>

                                </div>
                                </div>
                              </div>

                              {/* Appointment Booking Prompt/Mask */}
                              {!showAmbherAppointmentForm ? (
                                <div className="flex flex-col items-center justify-center gap-4">
                                  {hasAcceptedAmbherAppointment() ? (
                                    <div className="text-center py-4">
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-300 rounded-lg">
                                        <i className="bx bx-check-circle text-green-600 text-lg"></i>
                                        <span className="text-sm text-green-800 font-medium">You have an accepted appointment</span>
                                      </div>
                                    </div>
                                  ) : hasPendingAmbherAppointment() ? (
                                    <div className="text-center py-4">
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-lg">
                                        <i className="bx bx-info-circle text-yellow-600 text-lg"></i>
                                        <span className="text-sm text-yellow-800 font-medium">You have a pending appointment</span>

                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <button
                                        type="button"
                                        onClick={() => setShowAmbherAppointmentForm(true)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.5rem',
                                          padding: '0.5rem 1rem',
                                          backgroundColor: '#16a34a',
                                          color: '#ffffff',
                                          fontSize: '0.875rem',
                                          fontWeight: '500',
                                          borderRadius: '0.5rem',
                                          border: 'none',
                                          cursor: 'pointer',
                                          transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
                                      >
                                        <i className="bx bx-calendar-plus text-base"></i>
                                        Book Ambher Appointment
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {/* Date, Time & Location Selection */}
                                  <div id="ambheropticalappointmentdatetimelocationselection" className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-full flex justify-end mb-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowAmbherAppointmentForm(false);
                                          // Clear the form fields
                                          document.getElementById('patientambherappointmentdate').value = '';
                                          document.getElementById('patientambherappointmenttime').value = '';
                                          document.getElementById('patientambherappointmentlocation').value = '';
                                        }}
                                        style={{
                                          fontSize: '0.875rem',
                                          color: '#16a34a',
                                          fontWeight: '500',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          cursor: 'pointer',
                                          transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#15803d'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#16a34a'}
                                      >
                                        <i className="bx bx-x" style={{ fontSize: '1.125rem' }}></i>
                                        Cancel Booking
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                      <div>
                                        <label className="block text-sm font-semibold text-black mb-2" htmlFor="patientambherappointmentdate">
                                          Preferred Date
                                        </label>
                                        <input 
                                          className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
                                          min={getdatetomorrow()} 
                                          max={getuptothreemonthsappointmentavailability()} 
                                          type="date" 
                                          name="patientambherappointmentdate" 
                                          id="patientambherappointmentdate" 
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-semibold text-black mb-2" htmlFor="patientambherappointmenttime">
                                          Preferred Time
                                        </label>
                                        <select 
                                          name="patientambherappointmenttime" 
                                          id="patientambherappointmenttime" 
                                          className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                        >
                                          <option value="">Select a time</option>
                                          {ambherappointmentschedules.map((time, index) => (
                                            <option key={index} value={time}>{time}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-black mb-2" htmlFor="patientambherappointmentlocation">
                                        Clinic Location
                                      </label>
                                      <select 
                                        name="patientambherappointmentlocation" 
                                        id="patientambherappointmentlocation" 
                                        className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                        disabled={loadinglocations}
                                      >
                                        <option value="">
                                          {loadinglocations ? 'Loading locations...' : 'Select a location'}
                                        </option>
                                        {ambherlocations.map((location) => (
                                          <option key={location.clinicId} value={location.clinicId}>
                                            {location.clinicName} - {location.address?.city || location.address?.fullAddress}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>











                          {/* Bautista Eye Center Card */}
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 overflow-hidden">
                            <div className="bg-white bg-opacity-80 px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-200">
                              <div className="flex items-center gap-4">
                                <img src={bautistalogo} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-sm" alt="Bautista Eye Center"/>  
                                <div>
                                  <h2 className="text-lg sm:text-xl font-bold text-sky-800 font-albertsans">Bautista Eye Center</h2>
                                  <p className="text-gray-900 text-xs sm:text-sm">Comprehensive Eye Care & Surgery</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">


                              {/* Weekend Toast */}
                              {bautistashownotavailweekendToast && (
                                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                                  <div className={`${bautistashownotavailweekendToastClosing ? 'motion-opacity-out-0' : 'motion-preset-bounce'} bg-red-50 border-2 border-red-300 rounded-xl shadow-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 max-w-md`}>
                                    <div className="flex-shrink-0">
                                      <i className="bx bx-calendar-x text-red-500 text-2xl sm:text-3xl"></i>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-red-800 font-semibold text-sm sm:text-base mb-1">Weekend Not Available</p>
                                      <p className="text-red-700 text-xs sm:text-sm">Bautista Eye Center is only available for appointments on weekdays (Monday - Friday)</p>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setbautistashownotavailweekendToastClosing(true);
                                        setTimeout(() => setbautistashownotavailweekendToast(false), 300);
                                      }}
                                      className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                      <i className="bx bx-x text-xl"></i>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Services Description */}
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <i className="bx bx-list-check text-sky-600"></i>
                                    Our Services
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowBautistaServices(!showBautistaServices)}
                                    style={{
                                      display: isMobile ? 'flex' : 'none',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      padding: '0.375rem 0.75rem',
                                      fontSize: '0.875rem',
                                      fontWeight: '500',
                                      color: '#1e40af',
                                      backgroundColor: '#dbeafe',
                                      borderRadius: '0.5rem',
                                      border: 'none',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#bfdbfe'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dbeafe'}
                                  >
                                    {showBautistaServices ? 'Hide Services' : 'Show Services'}
                                    <i className={`bx ${showBautistaServices ? 'bx-chevron-up' : 'bx-chevron-down'} text-sm`}></i>
                                  </button>
                                </h3>
                                {/* Mobile: Show when toggled, Desktop: Always show */}
                                <div className={`md:block ${showBautistaServices ? 'block' : 'hidden'}`}>
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-blue-200">
                                  <p className="text-black leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                                    <span className="font-semibold text-sky-700">Bautista Eye Center</span> offers comprehensive eye care and advanced surgical procedures. Our ophthalmologists specialize in:
                                  </p>
                                  
                                  <div className="space-y-2 sm:space-y-3 text-gray-600">
                                    {loadingBautistaServices ? (
                                      // Loading skeleton
                                      <>
                                        {[...Array(3)].map((_, index) => (
                                          <div key={index} className="flex items-start gap-2 sm:gap-3 animate-pulse">
                                            <div className="w-5 h-5 bg-gray-300 rounded-full mt-0.5 flex-shrink-0"></div>
                                            <div className="flex-1 space-y-2">
                                              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                              <div className="h-3 bg-gray-200 rounded w-full"></div>
                                            </div>
                                          </div>
                                        ))}
                                      </>
                                    ) : bautistaServices.length > 0 ? (
                                      // Display fetched services
                                      bautistaServices.map((service) => (
                                        <div key={service._id} className="flex items-start gap-2 sm:gap-3">
                                          <i className="bx bx-check-circle text-sky-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                          <div>
                                            <span className="font-medium text-black">{service.bautistaservicename}</span> - {service.bautistaservicedescription}
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      // No services available
                                      <div className="flex items-center gap-2 text-gray-500 py-2">
                                        <i className="bx bx-info-circle text-lg"></i>
                                        <span className="text-sm">No services available at the moment.</span>
                                      </div>
                                    )}
                                  </div>
                                  

                                  

                                </div>
                                </div>
                              </div>

                              {/* Appointment Booking Prompt/Mask */}
                              {!showBautistaAppointmentForm ? (
                                <div className="flex flex-col items-center justify-center gap-4">
                                  {hasAcceptedBautistaAppointment() ? (
                                    <div className="text-center py-4">
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg">
                                        <i className="bx bx-check-circle text-blue-600 text-lg"></i>
                                        <span className="text-sm text-blue-800 font-medium">You have an accepted appointment</span>
                                      </div>
                                    </div>
                                  ) : hasPendingBautistaAppointment() ? (
                                    <div className="text-center py-4">
                                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg">
                                        <i className="bx bx-info-circle text-blue-600 text-lg"></i>
                                        <span className="text-sm text-blue-800 font-medium">You have a pending appointment</span>

                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <button
                                        type="button"
                                        onClick={() => setShowBautistaAppointmentForm(true)}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.5rem',
                                          padding: '0.5rem 1rem',
                                          backgroundColor: '#2563eb',
                                          color: '#ffffff',
                                          fontSize: '0.875rem',
                                          fontWeight: '500',
                                          borderRadius: '0.5rem',
                                          border: 'none',
                                          cursor: 'pointer',
                                          transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                      >
                                        <i className="bx bx-calendar-plus text-base"></i>
                                        Book Bautista Appointment
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  {/* Date, Time & Location Selection */}
                                  <div id="bautistaeyecenterappointmentdatetimelocationselection" className="flex flex-col items-center justify-center gap-4">
                                    <div className="w-full flex justify-end mb-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowBautistaAppointmentForm(false);
                                          // Clear the form fields
                                          document.getElementById('patientbautistaappointmentdate').value = '';
                                          document.getElementById('patientbautistaappointmenttime').value = '';
                                          document.getElementById('patientbautistaappointmentlocation').value = '';
                                        }}
                                        style={{
                                          fontSize: '0.875rem',
                                          color: '#2563eb',
                                          fontWeight: '500',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          cursor: 'pointer',
                                          transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                                      >
                                        <i className="bx bx-x" style={{ fontSize: '1.125rem' }}></i>
                                        Cancel Booking
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                      <div>
                                        <label className="block text-sm font-semibold text-black mb-2" htmlFor="patientbautistaappointmentdate">
                                          Preferred Date
                                        </label>
                                        <input 
                                          className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
                                          type="date" 
                                          name="patientbautistaappointmentdate" 
                                          id="patientbautistaappointmentdate" 
                                          min={getdatetomorrow()} 
                                          max={getuptothreemonthsappointmentavailability()}
                                          onChange={(e) => {
                                            if (disablebautistaweekends(e.target.value)) {
                                              // Clear the input immediately
                                              e.target.value = "";
                                              
                                              // Reset toast state
                                              setbautistashownotavailweekendToast(false);
                                              setbautistashownotavailweekendToastClosing(false);
                                              
                                              // Show toast after a brief delay
                                              setTimeout(() => {
                                                setbautistashownotavailweekendToast(true);
                                                
                                                // Auto-dismiss after 4 seconds
                                                setTimeout(() => {
                                                  setbautistashownotavailweekendToastClosing(true);
                                                  setTimeout(() => {
                                                    setbautistashownotavailweekendToast(false);
                                                    setbautistashownotavailweekendToastClosing(false);
                                                  }, 300);
                                                }, 4000);
                                              }, 50);
                                            }
                                          }}
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-semibold text-black mb-2" htmlFor="patientbautistaappointmenttime">
                                          Preferred Time
                                        </label>
                                        <select 
                                          name="patientbautistaappointmenttime" 
                                          id="patientbautistaappointmenttime" 
                                          className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                        >
                                          <option value="">Select a time</option>
                                          {bautistaappointmentschedules.map((time, index) => (
                                            <option key={index} value={time}>{time}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-black mb-2" htmlFor="patientbautistaappointmentlocation">
                                        Clinic Location
                                      </label>
                                      <select 
                                        name="patientbautistaappointmentlocation" 
                                        id="patientbautistaappointmentlocation" 
                                        className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                        disabled={loadinglocations}
                                      >
                                        <option value="">
                                          {loadinglocations ? 'Loading locations...' : 'Select a location'}
                                        </option>
                                        {bautistalocations.map((location) => (
                                          <option key={location.clinicId} value={location.clinicId}>
                                            {location.clinicName} - {location.address?.city || location.address?.fullAddress}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Warning message when both clinics have pending/accepted appointments */}
                        {(hasPendingAmbherAppointment() || hasAcceptedAmbherAppointment()) && (hasPendingBautistaAppointment() || hasAcceptedBautistaAppointment()) && (
                            <div className="w-full"></div>
                        )}

                        {/* Additional Information Section - Hidden if both clinics have pending/accepted appointments */}
                        {!((hasPendingAmbherAppointment() || hasAcceptedAmbherAppointment()) && (hasPendingBautistaAppointment() || hasAcceptedBautistaAppointment())) && (
                          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                              <i className="bx bx-note text-gray-600"></i>
                              Additional Information
                            </h3>
                          
                          <div className="flex flex-col gap-6 sm:gap-8">
                            {/* Notes Section */}
                            <div>
                              <label className="block text-sm font-semibold text-black mb-3" htmlFor="patientadditionalappointmentnotes">
                                Additional Appointment Notes
                              </label>
                              <textarea 
                                className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base" 
                                ref={textarearef} 
                                rows={4} 
                                value={additionaldetails} 
                                onChange={(e) => {setadditionaldetails(e.target.value); adjusttextareaheight();}} 
                                placeholder="Please provide any additional details about your appointment, symptoms, or special requirements..."
                              />
                            </div>

                            {/* Supporting Documents Upload Section */}
                            <div>
                              <label className="block text-sm font-semibold text-black mb-3">
                                Supporting Documents/Images
                              </label>
                              <div className="space-y-4">
                                {/* Multiple documents upload */}
                                <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50">
                                  <div className="text-center mb-4">
                                    <i className="bx bx-file-plus text-4xl text-sky-500 mb-2"></i>
                                    <p className="text-sm text-gray-600 mb-4">
                                      Upload up to {MAX_SUPPORTING_DOCUMENTS} files
                                    </p>
                                  </div>

                                  <input 
                                    className="hidden" 
                                    type="file" 
                                    multiple
                                    onChange={handlesupportingdocumentschange} 
                                    accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" 
                                    ref={supportingdocumentsinputref} 
                                  />
                                  
                                  <div className="space-y-3 text-center">
                                    <div 
                                      type="button"
                                      onClick={handlesupportingdocumentsupload}
                                      disabled={supportingdocuments.length >= MAX_SUPPORTING_DOCUMENTS}
                                      className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors duration-200 ${
                                        supportingdocuments.length >= MAX_SUPPORTING_DOCUMENTS
                                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                          : 'text-white bg-[#136d11]'
                                      }`}
                                    >
                                      <i className="bx bx-plus text-lg"></i>
                                      Add Documents/Images
                                    </div>
                                    
                                    <p className="text-xs text-gray-500">
                                      Maximum file size: 10MB per file | No videos allowed
                                    </p>
                                  </div>

                                  {/* Display uploaded supporting documents */}
                                  {supportingdocuments.length > 0 && (
                                    <div className="mt-6 space-y-3">
                                      <h5 className="font-semibold text-black text-center">
                                        Uploaded Files ({supportingdocuments.length}/{MAX_SUPPORTING_DOCUMENTS})
                                      </h5>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {supportingdocuments.map((doc) => (
                                          <div key={doc.id} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                                            <div 
                                              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                                              onClick={() => handledocumentview(doc)}
                                              title="Click to open/download document"
                                            >
                                              <i className={`bx ${getFileIcon(doc.type)} text-2xl ${
                                                doc.type.startsWith('image/') ? 'text-green-500' :
                                                doc.type === 'application/pdf' ? 'text-red-500' :
                                                doc.type.includes('word') ? 'text-sky-500' :
                                                'text-gray-500'
                                              }`}></i>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate" title={doc.originalname}>
                                                  {doc.originalname}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  {formatFileSize(doc.size)} • Click to open/download
                                                </p>
                                              </div>
                                            </div>
                                            <button 
                                              type="button"
                                              onClick={() => removesupportingdocument(doc.id)}
                                              style={{
                                                marginLeft: '8px',
                                                padding: '8px',
                                                color: '#ef4444',
                                                backgroundColor: 'transparent',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s ease-in-out',
                                              }}
                                              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                              title="Remove file"
                                            >
                                              <i className="bx bx-trash text-lg"></i>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        )}

                        {/* Submit Section - Hidden if both clinics have pending/accepted appointments */}
                        {!((hasPendingAmbherAppointment() || hasAcceptedAmbherAppointment()) && (hasPendingBautistaAppointment() || hasAcceptedBautistaAppointment())) && (
                          <div className="flex justify-center pt-8">
                            <button 
                              type="submit" 
                              disabled={issubmitting} 
                              className="rounded-3xl px-12 py-4 text-lg font-semibold transition-all duration-300 flex items-center gap-3 min-w-[280px] justify-center border-0 outline-none focus:outline-none appearance-none"
                              style={{
                                backgroundColor: issubmitting ? '#9ca3af' : '#075985',
                                color: issubmitting ? '#e5e7eb' : '#ffffff',
                              cursor: issubmitting ? 'not-allowed' : 'pointer',
                              border: 'none',
                              outline: 'none',
                              transform: issubmitting ? 'none' : 'scale(1)',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!issubmitting) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!issubmitting) {
                                e.target.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            {issubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                <span>Submitting Appointment...</span>
                              </>
                            ) : (
                              <>
                                <i className="bx bx-calendar-check text-xl"></i>
                                <span>Submit Appointment Request</span>
                              </>
                            )}
                          </button>
                        </div>
                        )}
                      </form>
                    </div>
                  </div>
                )}



































  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
      { activeappointmenttable === 'appointmentlist' && ( <div id="appointmentlist" className= " mt-16 animate-fadeInUp flex flex-col items-start  w-[100%] h-[83%] rounded-2xl" >
         
         



                <div className="mb-40 flex flex-col justify-center items-start h-[500px] w-full rounded-3xl ">

      {loadingappointmens && !hasInitialLoad ? (
        <AppointmentTableSkeleton />
      ) : errorloadingappointments ? (
    <div className="w-full h-[40px] rounded-tl-2xl rounded-tr-2xl flex justify-center items-center bg-red-50 text-red-600 font-semibold font-albertsans">
    Error: {errorloadingappointments}
  </div>
  ) : patientappointments.length === 0 ? (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
      <div className="text-center p-8">
        <div className="mb-4">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-7 0h8m0 0v4a1 1 0 01-1 1H9a1 1 0 01-1-1V7m0 0V3a1 1 0 011-1h6a1 1 0 011 1v4"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 font-albertsans mb-2">No Appointments Found</h3>
        <p className="text-gray-500 font-albertsans mb-4">You don't have any scheduled appointments yet.</p>
        <div 
          onClick={() => showappointmenttable('bookappointment')}
          className="bg-[#2781af] hover:bg-[#1f6591] text-white font-albertsans font-semibold py-2 px-6 rounded-2xl transition-all duration-200 cursor-pointer"
        >
          Book New Appointment
        </div>
      </div>
    </div>
    

  ) : (
    <>
      {/* Enhanced Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 w-full gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto flex-1">
          <h2 className="font-albertsans font-bold text-[18px] text-[#383838] flex-shrink-0">Search:</h2>
          <div className="relative flex items-center w-full sm:flex-1">
            <i className="bx bx-search absolute left-3 text-2xl text-gray-500 z-10"></i>
            <input       
              type="text" 
              placeholder="Enter appointment details..."   
              value={searchAppointments}
              onChange={handleSearchAppointments}
              className="transition-all duration-300 ease-in-out py-2 pl-10 pr-12 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
            />
            {searchAppointments && (
              <div
                onClick={() => {
                  setSearchAppointments('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 text-xl text-gray-500 hover:text-black z-10 transition-colors duration-200 cursor-pointer"
                title="Clear search"
              >
                <i className="bx bx-x"></i>
              </div>
            )}
          </div>
        </div>
        
        {/* Filter and View Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter Button */}
          <div className="relative">
            <div
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              style={{
                backgroundColor: statusFilter.length > 0 ? '#2781af' : '#f3f4f6',
                color: statusFilter.length > 0 ? '#ffffff' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              className="hover:shadow-md"
            >
              <i className="bx bx-filter text-lg"></i>
              Status
              {statusFilter.length > 0 && (
                <span style={{
                  backgroundColor: '#ffffff',
                  color: '#2781af',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {statusFilter.length}
                </span>
              )}
            </div>
            
            {/* Status Filter Dropdown */}
            {showStatusFilter && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: '0',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '12px',
                minWidth: '200px',
                zIndex: 50
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '8px'
                }}>
                  Filter by Status
                </div>
                {getUniqueStatuses().map(status => (
                  <div
                    key={status}
                    onClick={() => toggleStatusFilter(status)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      backgroundColor: statusFilter.includes(status) ? '#f0f9ff' : 'transparent'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: statusFilter.includes(status) ? '#2781af' : '#ffffff',
                      borderColor: statusFilter.includes(status) ? '#2781af' : '#d1d5db'
                    }}>
                      {statusFilter.includes(status) && (
                        <i className="bx bx-check" style={{ fontSize: '12px', color: '#ffffff' }}></i>
                      )}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      flex: 1,
                      color: '#374151'
                    }}>
                      {status}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      backgroundColor: '#f3f4f6',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {getStatusCount(status)}
                    </span>
                  </div>
                ))}
                {statusFilter.length > 0 && (
                  <div
                    onClick={() => {
                      setStatusFilter([]);
                      setCurrentPage(1);
                    }}
                    style={{
                      marginTop: '8px',
                      padding: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '8px'
                    }}
                    className="hover:text-red-700"
                  >
                    Clear filters
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Column Toggle Button */}
          <div className="relative">
            <div
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '8px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              className="hover:shadow-md"
            >
              <i className="bx bx-columns text-lg"></i>
              Columns
            </div>
            
            {/* Column Toggle Dropdown */}
            {showColumnToggle && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: '0',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '12px',
                minWidth: '180px',
                zIndex: 50
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '8px'
                }}>
                  Show/Hide Columns
                </div>
                {Object.entries(visibleColumns)
                  .filter(([key]) => key !== 'actions')
                  .map(([key, visible]) => (
                  <div
                    key={key}
                    onClick={() => toggleColumn(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      backgroundColor: visible ? '#f0f9ff' : 'transparent'
                    }}
                    className="hover:bg-gray-50"
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #d1d5db',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: visible ? '#2781af' : '#ffffff',
                      borderColor: visible ? '#2781af' : '#d1d5db'
                    }}>
                      {visible && (
                        <i className="bx bx-check" style={{ fontSize: '12px', color: '#ffffff' }}></i>
                      )}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      color: '#374151',
                      textTransform: 'capitalize'
                    }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

 <div className="bg-white rounded-lg border border-gray-200 shadow-sm w-full h-full overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block h-full overflow-hidden">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                {visibleColumns.dateCreated && (
                  <th 
                    onClick={() => handleSort('createdAt')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    title="Click to sort"
                  >
                    <div className="flex items-center gap-2">
                      <span>Date Created</span>
                      {sortConfig.key === 'createdAt' ? (
                        <i className={`bx ${sortConfig.direction === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'} text-base`}></i>
                      ) : (
                        <i className="bx bx-chevron-up text-base opacity-0 group-hover:opacity-30"></i>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.ambherAppointment && (
                  <th 
                    onClick={() => handleSort('ambherDate')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    title="Click to sort"
                  >
                    <div className="flex items-center gap-2">
                      <span>Ambher Optical</span>
                      {sortConfig.key === 'ambherDate' ? (
                        <i className={`bx ${sortConfig.direction === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'} text-base`}></i>
                      ) : (
                        <i className="bx bx-chevron-up text-base opacity-0 group-hover:opacity-30"></i>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.bautistaAppointment && (
                  <th 
                    onClick={() => handleSort('bautistaDate')}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                    title="Click to sort"
                  >
                    <div className="flex items-center gap-2">
                      <span>Bautista Eye Center</span>
                      {sortConfig.key === 'bautistaDate' ? (
                        <i className={`bx ${sortConfig.direction === 'asc' ? 'bx-chevron-up' : 'bx-chevron-down'} text-base`}></i>
                      ) : (
                        <i className="bx bx-chevron-up text-base opacity-0 group-hover:opacity-30"></i>
                      )}
                    </div>
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedAppointments().map((appointment) => (
                <tr 
                  key={appointment._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {visibleColumns.dateCreated && (
                    <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {formatappointmatedates(appointment.createdAt)}
                      </div>
                    </td>
                  )}
                  {visibleColumns.ambherAppointment && (
                    <td style={{ padding: '16px' }}>
                      {appointment.patientambherappointmentdate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {formatappointmatedates(appointment.patientambherappointmentdate)}
                          </span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            ({formatappointmenttimes(appointment.patientambherappointmenttime)})
                          </span>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: 
                              appointment.patientambherappointmentstatus === 'Cancelled' ? '#fed7aa' :
                              appointment.patientambherappointmentstatus === 'Declined' ? '#fecaca' :
                              appointment.patientambherappointmentstatus === 'Pending' ? '#fef08a' :
                              appointment.patientambherappointmentstatus === 'Accepted' ? '#bbf7d0' :
                              appointment.patientambherappointmentstatus === 'Completed' ? '#bfdbfe' :
                              appointment.patientambherappointmentstatus === 'Expired' ? '#e5e7eb' :
                              '#f3f4f6',
                            color:
                              appointment.patientambherappointmentstatus === 'Cancelled' ? '#9a3412' :
                              appointment.patientambherappointmentstatus === 'Declined' ? '#991b1b' :
                              appointment.patientambherappointmentstatus === 'Pending' ? '#854d0e' :
                              appointment.patientambherappointmentstatus === 'Accepted' ? '#166534' :
                              appointment.patientambherappointmentstatus === 'Completed' ? '#1e40af' :
                              appointment.patientambherappointmentstatus === 'Expired' ? '#374151' :
                              '#1f2937'
                          }}>
                            {appointment.patientambherappointmentstatus}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.bautistaAppointment && (
                    <td style={{ padding: '16px' }}>
                      {appointment.patientbautistaappointmentdate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {formatappointmatedates(appointment.patientbautistaappointmentdate)}
                          </span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            ({formatappointmenttimes(appointment.patientbautistaappointmenttime)})
                          </span>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: 
                              appointment.patientbautistaappointmentstatus === 'Cancelled' ? '#fed7aa' :
                              appointment.patientbautistaappointmentstatus === 'Declined' ? '#fecaca' :
                              appointment.patientbautistaappointmentstatus === 'Pending' ? '#fef08a' :
                              appointment.patientbautistaappointmentstatus === 'Accepted' ? '#bbf7d0' :
                              appointment.patientbautistaappointmentstatus === 'Completed' ? '#bfdbfe' :
                              appointment.patientbautistaappointmentstatus === 'Expired' ? '#e5e7eb' :
                              '#f3f4f6',
                            color:
                              appointment.patientbautistaappointmentstatus === 'Cancelled' ? '#9a3412' :
                              appointment.patientbautistaappointmentstatus === 'Declined' ? '#991b1b' :
                              appointment.patientbautistaappointmentstatus === 'Pending' ? '#854d0e' :
                              appointment.patientbautistaappointmentstatus === 'Accepted' ? '#166534' :
                              appointment.patientbautistaappointmentstatus === 'Completed' ? '#1e40af' :
                              appointment.patientbautistaappointmentstatus === 'Expired' ? '#374151' :
                              '#1f2937'
                          }}>
                            {appointment.patientbautistaappointmentstatus}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '14px', color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td style={{ padding: '16px', whiteSpace: 'nowrap', textAlign: 'right', fontSize: '14px', fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '6px 12px',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            fontSize: '12px',
                            fontWeight: '500',
                            borderRadius: '6px',
                            color: '#374151',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        >
                          <i className="bx bx-show" style={{ marginRight: '4px' }}></i>
                          View
                        </button>
                        {canDeleteAppointment(appointment) && (
                          <button
                            onClick={() => {
                              console.log('🔍 Setting appointment for deletion:', {
                                _id: appointment._id,
                                patientappointmentid: appointment.patientappointmentid,
                                fullAppointment: appointment
                              });
                              setdeletepatientappointment(true); 
                              setselectedpatientappointment(appointment);
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '6px 12px',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              color: '#ffffff',
                              backgroundColor: '#dc2626',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                          >
                            <i className="bx bx-trash" style={{ marginRight: '4px' }}></i>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4 h-[400px] overflow-y-auto">
        {getPaginatedAppointments().map((appointment) => (
          <div key={appointment._id} className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <i className="bx bx-calendar text-[#2781af] text-lg"></i>
                <span className="text-sm font-semibold text-gray-600">
                  Created: {formatappointmatedates(appointment.createdAt)}
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                ID: {appointment.patientappointmentid}
              </span>
            </div>

            {/* Ambher Appointment Section */}
            {appointment.patientambherappointmentdate && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <img src={ambherlogo} className="w-6 h-6 rounded" alt="Ambher"/>
                  <h3 className="text-sm font-bold text-green-800">Ambher Optical</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{formatappointmatedates(appointment.patientambherappointmentdate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{formatappointmenttimes(appointment.patientambherappointmenttime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-xs font-medium">{getLocationAddress(appointment.patientambherappointmentlocation, ambherlocations)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-600">Status:</span>
                    <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
                      appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-orange-200 text-orange-900' :
                      appointment.patientambherappointmentstatus === 'Declined' ? 'bg-red-100 text-red-800' :
                      appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]' :
                      appointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]' :
                      appointment.patientambherappointmentstatus === 'Expired' ? 'bg-gray-300 text-gray-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.patientambherappointmentstatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bautista Appointment Section */}
            {appointment.patientbautistaappointmentdate && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <img src={bautistalogo} className="w-6 h-6 rounded" alt="Bautista"/>
                  <h3 className="text-sm font-bold text-sky-800">Bautista Eye Center</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{formatappointmatedates(appointment.patientbautistaappointmentdate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-semibold">{formatappointmenttimes(appointment.patientbautistaappointmenttime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-xs font-medium">{getLocationAddress(appointment.patientbautistaappointmentlocation, bautistalocations)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-600">Status:</span>
                    <span className={`text-xs font-semibold rounded-full px-3 py-1 ${
                      appointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-orange-200 text-orange-900' :
                      appointment.patientbautistaappointmentstatus === 'Declined' ? 'bg-red-100 text-red-800' :
                      appointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]' :
                      appointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]' :
                      appointment.patientbautistaappointmentstatus === 'Expired' ? 'bg-gray-300 text-gray-700' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.patientbautistaappointmentstatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Action Buttons */}
            <div className="flex gap-2 pt-2">
              <div 
                onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
                className={`${canDeleteAppointment(appointment) ? 'flex-1' : 'w-full'} bg-[#383838] hover:bg-[#595959] text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2`}
              >
                <i className="bx bx-show text-lg"></i>
                View
              </div>
              {canDeleteAppointment(appointment) && (
                <div
                  onClick={() => {
                    console.log('🔍 Mobile: Setting appointment for deletion:', {
                      _id: appointment._id,
                      patientappointmentid: appointment.patientappointmentid,
                      fullAppointment: appointment
                    });
                    setdeletepatientappointment(true); 
                    setselectedpatientappointment(appointment);
                  }}
                  className="flex-1 bg-[#8c3226] hover:bg-[#ab4f43] text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <i className="bx bx-trash text-lg"></i>
                  Delete
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Appointment Modal */}
      {deletepatientappointment && (
        <div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
          <div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
            <div className="flex justify-between items-center w-full mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <i className="bx bxs-trash text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Delete Appointment</h2>
                </div>
              </div>
              <div 
                onClick={() => {
                  setdeletepatientappointment(false);
                  setselectedpatientappointment(null);
                }} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              >
                <i className="bx bx-x text-gray-600 text-xl"/>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this appointment?
              </p>

              {selectedpatientappointment && (
                <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Appointment ID: {selectedpatientappointment.patientappointmentid}</p>
                  </div>
                  
                  {selectedpatientappointment.patientambherappointmentdate && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="font-medium text-gray-700 mb-1">Ambher Optical Center:</p>
                      <p className="text-sm text-gray-600">Date: {formatappointmatedates(selectedpatientappointment.patientambherappointmentdate)}</p>
                      <p className="text-sm text-gray-600">Time: {formatappointmenttimes(selectedpatientappointment.patientambherappointmenttime)}</p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-green-100 text-green-700' :
                          selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          selectedpatientappointment.patientambherappointmentstatus === 'Declined' ? 'bg-red-100 text-red-700' :
                          selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-blue-100 text-blue-700' :
                          selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-gray-100 text-gray-700' :
                          selectedpatientappointment.patientambherappointmentstatus === 'Expired' ? 'bg-gray-300 text-gray-700' : ''
                        }`}>
                          {selectedpatientappointment.patientambherappointmentstatus}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  {selectedpatientappointment.patientbautistaappointmentdate && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="font-medium text-gray-700 mb-1">Bautista Eye Center:</p>
                      <p className="text-sm text-gray-600">Date: {formatappointmatedates(selectedpatientappointment.patientbautistaappointmentdate)}</p>
                      <p className="text-sm text-gray-600">Time: {formatappointmenttimes(selectedpatientappointment.patientbautistaappointmenttime)}</p>
                      <p className="text-sm text-gray-600">
                        Status: <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-green-100 text-green-700' :
                          selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          selectedpatientappointment.patientbautistaappointmentstatus === 'Declined' ? 'bg-red-100 text-red-700' :
                          selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-blue-100 text-blue-700' :
                          selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-gray-100 text-gray-700' :
                          selectedpatientappointment.patientbautistaappointmentstatus === 'Expired' ? 'bg-gray-300 text-gray-700' : ''
                        }`}>
                          {selectedpatientappointment.patientbautistaappointmentstatus}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setdeletepatientappointment(false);
                    setselectedpatientappointment(null);
                  }}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    borderRadius: "12px",
                    fontWeight: 500,
                    transition: "background-color 0.2s ease-in-out",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                >
                  Cancel
                </button>

                <button
                  onClick={deletingappointment ? undefined : () => handledeleteappointment(selectedpatientappointment.patientappointmentid)}
                  disabled={deletingappointment}
                  style={{
                    flex: 1,
                    padding: "12px 24px",
                    backgroundColor: deletingappointment ? "#9ca3af" : "#ef4444",
                    color: "#ffffff",
                    borderRadius: "12px",
                    fontWeight: 500,
                    transition: "background-color 0.2s ease-in-out",
                    cursor: deletingappointment ? "not-allowed" : "pointer",
                    opacity: deletingappointment ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!deletingappointment) {
                      e.currentTarget.style.backgroundColor = "#dc2626";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!deletingappointment) {
                      e.currentTarget.style.backgroundColor = "#ef4444";
                    }
                  }}
                >
                  {deletingappointment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Appointment'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
  </>
  )}  {/* Pagination Component for Appointments */}
  {(() => {
    const dataToDisplay = getSortedAndFilteredAppointments();
    const totalAppointments = dataToDisplay.length;
    const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);
    
    return totalAppointments > 0 && (
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalAppointments}
        itemsPerPage={appointmentsPerPage}
        itemName="appointments"
      />
    );
  })()}


                </div>

             </div> )}



                </div>
           
                 </div>

     
  


 {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
 {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
                         {viewpatientappointment && selectedpatientappointment && (
                         <div id="viewpatientappointment" className="pt-30 h-auto bg-opacity-0 flex justify-center items-center z-[60] fixed inset-0 bg-[#000000af] bg-opacity-50 p-2 sm:p-8">
                           <div className="mt-20 animate-fadeInUp w-full max-w-7xl mx-auto max-h-full flex flex-col">
                             <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-h-full flex flex-col">
                               
                               {/* Header */}
                               <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                       <i className="bx bx-calendar-check text-sky-600 text-xl sm:text-2xl"></i>
                                     </div>
                                     <div>
                                       <h1 className="text-lg sm:text-2xl font-bold text-gray-800 font-albertsans">Appointment Details</h1>
                                     </div>
                                   </div>
                                   <div 
                                     onClick={() => setviewpatientappointment(false)} 
                                     className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 border-none cursor-pointer"
                                   >
                                     <i className="bx bx-x text-gray-600 text-xl sm:text-2xl"></i>
                                   </div>
                                 </div>
                               </div>

                               <div className="p-8 overflow-y-auto flex-1">
                                 {/* Clinic Cards */}
                                 <div className="grid lg:grid-cols-2 gap-8 mb-8">

{selectedpatientappointment.patientambherappointmentdate && (
  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 overflow-hidden">
    <div className="bg-white bg-opacity-80 px-6 py-4 border-b border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={ambherlogo} className="w-12 h-12 rounded-lg shadow-sm" alt="Ambher Optical"/>  
          <div>
            <h2 className="text-xl font-bold text-green-700 font-albertsans">Ambher Optical</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-albertsans font-semibold rounded-full text-sm leading-5 px-4 py-2 inline-flex
            ${selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-orange-200 text-orange-900':
              selectedpatientappointment.patientambherappointmentstatus === 'Declined' ? 'bg-red-100 text-red-800':
              selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
              selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
              selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
              selectedpatientappointment.patientambherappointmentstatus === 'Expired' ? 'bg-gray-300 text-gray-700':
              'bg-gray-100 text-gray-800'}`}>
            {selectedpatientappointment.patientambherappointmentstatus}
          </span>

          {/* Export PDF Button - Only show when Completed */}
          {selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
            <button
              onClick={() => !isExportingPDF && exportAppointmentToPDF(selectedpatientappointment, 'ambher')}
              disabled={isExportingPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isExportingPDF ? '#9ca3af' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isExportingPDF ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isExportingPDF) {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isExportingPDF) {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              {isExportingPDF ? (
                <>
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    borderRadius: '50%',
                    height: '16px',
                    width: '16px',
                    borderBottom: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderLeft: '2px solid transparent',
                    borderRight: '2px solid transparent'
                  }}></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <i className="bx bxs-file-pdf" style={{ fontSize: '18px' }}></i>
                  <span>Export PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>

    <div className="p-6 space-y-6">
      {/* Appointment Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bx bx-calendar text-green-600"></i>
          Appointment Details
        </h3>
        <div className="bg-white rounded-xl p-4 border border-green-200">
          {(selectedpatientappointment.patientambherappointmentstatus === "Accepted" ||
          selectedpatientappointment.patientambherappointmentstatus === "Completed") && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500">Eye Specialist:</span>
              <p className="text-gray-800 font-semibold">{selectedpatientappointment.patientambherappointmenteyespecialist}</p>
            </div>
          )}
          
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-500">Date & Time:</span>
            <p className="text-gray-800 font-semibold">
              {formatappointmatedates(selectedpatientappointment.patientambherappointmentdate)} 
              <span className="ml-2">({formatappointmenttimes(selectedpatientappointment.patientambherappointmenttime)})</span>
            </p>
          </div>

          <div className="mb-3">
            <span className="text-sm font-medium text-gray-500">Clinic Location Address:</span>
            <p className="text-gray-800 font-semibold">{selectedpatientappointment.patientambherappointmentlocationaddress}</p>
          </div>

          {selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
              <span className="text-sm font-medium text-green-700">Total Billed:</span>
              <p className="text-green-800 font-bold text-lg">
                ₱{selectedpatientappointment.patientambherappointmentpaymentotal}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Appointment Button - Only for pending appointments when other clinic is accepted/completed */}
      {canCancelPendingAppointment(selectedpatientappointment, 'ambher') && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-x-circle text-red-600"></i>
            Cancel Appointment
          </h3>
          <div className="bg-white rounded-xl p-4 border border-red-200">
            <p className="text-gray-600 mb-4 text-sm">
              Since your other appointment has been confirmed, you can cancel this pending appointment if needed.
            </p>
            <div
              onClick={() => handleCancelAppointment(selectedpatientappointment.patientappointmentid, 'ambher')}
              className="w-full cursor-pointer bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="bx bx-x-circle text-lg"></i>
              Cancel Ambher Optical Appointment
            </div>
          </div>
        </div>
      )}

      {/* Services - Only show if not Pending, Accepted, or Cancelled */}
      {selectedpatientappointment.patientambherappointmentstatus !== "Pending" && 
       selectedpatientappointment.patientambherappointmentstatus !== "Accepted" && 
       selectedpatientappointment.patientambherappointmentstatus !== "Cancelled" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-list-check text-green-600"></i>
            Services Done
          </h3>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="space-y-3">
              {/* Display services from database array when completed */}
              {selectedpatientappointment.patientambherappointmentservicesavailed && 
               selectedpatientappointment.patientambherappointmentservicesavailed.length > 0 ? (
                selectedpatientappointment.patientambherappointmentservicesavailed.map((service) => (
                  <div key={service.serviceId} className="flex items-center gap-3">
                    <i className="bx bx-check-circle text-green-500 text-lg"></i>
                    <span className="text-black font-medium">{service.serviceName}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <i className="bx bx-info-circle text-2xl mb-2"></i>
                  <p className="text-sm">No services recorded for this appointment</p>
                </div>
              )}
              
              {/* Show other service if applicable */}
              {selectedpatientappointment.patientambherappointmentotherservice && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <i className="bx bx-check-circle text-green-500 text-lg"></i>
                    <span className="text-black font-medium">Other Service</span>
                  </div>
                  <div className="ml-8 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="text-green-800 text-sm">{selectedpatientappointment.patientambherappointmentotherservicenote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consultation Details - Only for Completed */}
      {selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-clipboard text-green-600"></i>
            Consultation Details
          </h3>
          <div className="bg-white rounded-xl p-4 border border-green-200 space-y-4">
            {selectedpatientappointment.patientambherappointmentconsultationremarkssubject && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Subject:</span>
                <p className="text-black mt-1">{selectedpatientappointment.patientambherappointmentconsultationremarkssubject}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientambherappointmentconsultationremarks && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Remarks:</span>
                <p className="text-black mt-1">{selectedpatientappointment.patientambherappointmentconsultationremarks}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientambherappointmentprescription && (
              <div>
                <span className="text-sm font-medium text-gray-500">Prescription:</span>
                <p className="text-black mt-1">{selectedpatientappointment.patientambherappointmentprescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-star text-green-600"></i>
            Feedback
          </h3>
          
          {selectedpatientappointment.patientambherappointmentrating === 0 && selectedpatientappointment.patientambherappointmentfeedback === "" ? (
            <div 
              onClick={() => setshowambherfeedbackdialog(true)}  
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="bx bx-message-square-dots text-lg"></i>
              Submit Feedback
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <span className="text-sm font-medium text-gray-500">Your Feedback:</span>
              <div className="mt-2">
                <Stack spacing={1}>
                  <Rating size="large" value={selectedpatientappointment.patientambherappointmentrating} readOnly /> 
                </Stack>  
                <p className="text-black mt-2">{selectedpatientappointment.patientambherappointmentfeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

{selectedpatientappointment.patientbautistaappointmentdate && (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 overflow-hidden">
    <div className="bg-white bg-opacity-80 px-6 py-4 border-b border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={bautistalogo} className="w-12 h-12 rounded-lg shadow-sm" alt="Bautista Eye Center"/>  
          <div>
            <h2 className="text-xl font-bold text-sky-800 font-albertsans">Bautista Eye Center</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-albertsans font-semibold rounded-full text-sm leading-5 px-4 py-2 inline-flex
            ${selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-orange-200 text-orange-900':
              selectedpatientappointment.patientbautistaappointmentstatus === 'Declined' ? 'bg-red-100 text-red-800':
              selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
              selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
              selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
              selectedpatientappointment.patientbautistaappointmentstatus === 'Expired' ? 'bg-gray-300 text-gray-700':
              'bg-gray-100 text-gray-800'}`}>
            {selectedpatientappointment.patientbautistaappointmentstatus}
          </span>

          {/* Export PDF Button - Only show when Completed */}
          {selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
            <button
              onClick={() => !isExportingPDF && exportAppointmentToPDF(selectedpatientappointment, 'bautista')}
              disabled={isExportingPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isExportingPDF ? '#9ca3af' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isExportingPDF ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isExportingPDF) {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isExportingPDF) {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              {isExportingPDF ? (
                <>
                  <div style={{
                    animation: 'spin 1s linear infinite',
                    borderRadius: '50%',
                    height: '16px',
                    width: '16px',
                    borderBottom: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderLeft: '2px solid transparent',
                    borderRight: '2px solid transparent'
                  }}></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <i className="bx bxs-file-pdf" style={{ fontSize: '18px' }}></i>
                  <span>Export PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>

    <div className="p-6 space-y-6">
      {/* Appointment Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bx bx-calendar text-sky-600"></i>
          Appointment Details
        </h3>
        <div className="bg-white rounded-xl p-4 border border-blue-200">
          {(selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" ||
          selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500">Eye Specialist:</span>
              <p className="text-gray-800 font-semibold">{selectedpatientappointment.patientbautistaappointmenteyespecialist}</p>
            </div>
          )}
          
          <div className="mb-3">
            <span className="text-sm font-medium text-gray-500">Date & Time:</span>
            <p className="text-gray-800 font-semibold">
              {formatappointmatedates(selectedpatientappointment.patientbautistaappointmentdate)} 
              <span className="ml-2">({formatappointmenttimes(selectedpatientappointment.patientbautistaappointmenttime)})</span>
            </p>
          </div>

          <div className="mb-3">
            <span className="text-sm font-medium text-gray-500">Clinic Location Address:</span>
            <p className="text-gray-800 font-semibold">{selectedpatientappointment.patientbautistaappointmentlocationaddress}</p>
          </div>

          {selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
              <span className="text-sm font-medium text-sky-700">Total Billed:</span>
              <p className="text-sky-800 font-bold text-lg">
                ₱{selectedpatientappointment.patientbautistaappointmentpaymentotal}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Appointment Button - Only for pending appointments when other clinic is accepted/completed */}
      {canCancelPendingAppointment(selectedpatientappointment, 'bautista') && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-x-circle text-red-600"></i>
            Cancel Appointment
          </h3>
          <div className="bg-white rounded-xl p-4 border border-red-200">
            <p className="text-gray-600 mb-4 text-sm">
              Since your other appointment has been confirmed, you can cancel this pending appointment if needed.
            </p>
            <div
              onClick={() => handleCancelAppointment(selectedpatientappointment.patientappointmentid, 'bautista')}
              className="cursor-pointer w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className=" cursor-pointer bx bx-x-circle text-lg"></i>
              Cancel Bautista Eye Center Appointment
            </div>
          </div>
        </div>
      )}

      {/* Services - Only show if not Pending, Accepted, or Cancelled */}
      {selectedpatientappointment.patientbautistaappointmentstatus !== "Pending" && 
       selectedpatientappointment.patientbautistaappointmentstatus !== "Accepted" && 
       selectedpatientappointment.patientbautistaappointmentstatus !== "Cancelled" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-list-check text-sky-600"></i>
            Services Done
          </h3>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="space-y-3">
              {/* Display services from database array when completed */}
              {selectedpatientappointment.patientbautistaappointmentservicesavailed && 
               selectedpatientappointment.patientbautistaappointmentservicesavailed.length > 0 ? (
                selectedpatientappointment.patientbautistaappointmentservicesavailed.map((service) => (
                  <div key={service.serviceId} className="flex items-center gap-3">
                    <i className="bx bx-check-circle text-sky-500 text-lg"></i>
                    <span className="text-black font-medium">{service.serviceName}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <i className="bx bx-info-circle text-2xl mb-2"></i>
                  <p className="text-sm">No services recorded for this appointment</p>
                </div>
              )}
              
              {/* Show other service if applicable */}
              {selectedpatientappointment.patientbautistaappointmentotherservice && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <i className="bx bx-check-circle text-sky-500 text-lg"></i>
                    <span className="text-black font-medium">Other Service</span>
                  </div>
                  <div className="ml-8 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sky-800 text-sm">{selectedpatientappointment.patientbautistaappointmentotherservicenote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Consultation Details - Only for Completed */}
      {selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-clipboard text-sky-600"></i>
            Consultation Details
          </h3>
          <div className="bg-white rounded-xl p-4 border border-blue-200 space-y-4">
            {selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Subject:</span>
                <p className="text-black mt-1">{selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientbautistaappointmentconsultationremarks && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Remarks:</span>
                <p className="text-black mt-1">{selectedpatientappointment.patientbautistaappointmentconsultationremarks}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientbautistaappointmentprescription && (
              <div>
                <span className="text-sm font-medium text-gray-500">Prescription:</span>
                <p className="text-black mt-1">{selectedpatientappointment.patientbautistaappointmentprescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-star text-sky-600"></i>
            Feedback
          </h3>
          
          {selectedpatientappointment.patientbautistaappointmentrating === 0 && selectedpatientappointment.patientbautistaappointmentfeedback === "" ? (
            <div 
              onClick={() => setshowbautistafeedbackdialog(true)}  
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="bx bx-message-square-dots text-lg"></i>
              Submit Feedback
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <span className="text-sm font-medium text-gray-500">Your Feedback:</span>
              <div className="mt-2">
                <Stack spacing={1}>
                  <Rating size="large" value={selectedpatientappointment.patientbautistaappointmentrating} readOnly /> 
                </Stack>  
                <p className="text-black mt-2">{selectedpatientappointment.patientbautistaappointmentfeedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}
                               </div>

                               {/* Combined Payment Total */}
                               {(selectedpatientappointment.patientambherappointmentstatus === "Completed" &&
                                 selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (
                                 <div className="px-8 pb-6">
                                   <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                                     <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                         <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                           <i className="bx bx-receipt text-white text-xl"></i>
                                         </div>
                                         <div>
                                           <h3 className="text-xl font-bold text-gray-800 font-albertsans">Combined Total Billing</h3>
                                           <p className="text-gray-600">Total cost for both clinic appointments</p>
                                         </div>
                                       </div>
                                       <div className="text-right">
                                         <p className="text-3xl font-bold text-gray-800">
                                           ₱{(selectedpatientappointment.patientambherappointmentpaymentotal + selectedpatientappointment.patientbautistaappointmentpaymentotal).toLocaleString()}
                                         </p>
                                         <p className="text-sm text-gray-500">Total Amount</p>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               )}

                               {/* Additional Information Section */}
                               <div className="bg-gray-50 rounded-t-3xl px-8 py-6 border-t border-gray-100">
                                 <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                   <i className="bx bx-note text-gray-600"></i>
                                   Additional Information
                                 </h3>
                                 
                                 <div className="space-y-6">
                                   {/* Patient Notes */}
                                   <div className="bg-white rounded-xl p-6 border border-gray-200">
                                     <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                       <i className="bx bx-message-detail text-gray-600"></i>
                                       Patient Appointment Notes
                                     </h4>
                                     <div className="space-y-4">
                                       <div>
                                         <p className="text-black leading-relaxed break-words whitespace-pre-wrap">
                                           {selectedpatientappointment.patientadditionalappointmentnotes || "No additional notes provided"}
                                         </p>
                                       </div>
                                     </div>
                                   </div>

                                   {/* Supporting Documents Display */}
                                   {selectedpatientappointment.patientsupportingdocuments && selectedpatientappointment.patientsupportingdocuments.length > 0 && (
                                     <div className="bg-white rounded-xl p-6 border border-gray-200">
                                       <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                         <i className="bx bx-file text-gray-600"></i>
                                         Supporting Documents ({selectedpatientappointment.patientsupportingdocuments.length})
                                       </h4>
                                       
                                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                         {selectedpatientappointment.patientsupportingdocuments.map((doc, index) => (
                                           <div 
                                             key={index} 
                                             className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                             onClick={() => handledocumentview(doc)}
                                             title={doc.mimetype.startsWith('image/') ? "Click to view image" : "Click to open/download document"}
                                           >
                                             <div className="flex items-center gap-3 mb-3">
                                               <i className={`bx ${getFileIcon(doc.mimetype)} text-2xl ${
                                                 doc.mimetype.startsWith('image/') ? 'text-green-500' :
                                                 doc.mimetype === 'application/pdf' ? 'text-red-500' :
                                                 doc.mimetype.includes('word') ? 'text-sky-500' :
                                                 'text-gray-500'
                                               }`}></i>
                                               <div className="flex-1 min-w-0">
                                                 <p className="text-sm font-medium text-gray-800 truncate" title={doc.originalname}>
                                                   {doc.originalname}
                                                 </p>
                                                 <p className="text-xs text-gray-500">
                                                   {formatFileSize(doc.size)} • {doc.mimetype.startsWith('image/') ? 'Click to view' : 'Click to open/download'}
                                                 </p>
                                               </div>
                                             </div>
                                             
                                             {/* Preview for images */}
                                             {doc.mimetype.startsWith('image/') && (
                                               <div className="mb-3">
                                                 <img 
                                                   src={`${_apiUrl}${doc.url}`} 
                                                   alt={doc.originalname}
                                                   className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                   onError={(e) => {
                                                     e.target.src = defaultimageplaceholder;
                                                   }}
                                                 />
                                               </div>
                                             )}
                                             
                                             {/* Download button */}
                                             <a 
                                               href={`${_apiUrl}${doc.url}`}
                                               target="_blank"
                                               rel="noopener noreferrer"
                                               download={doc.originalname}
                                               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-sky-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 w-full justify-center"
                                               onClick={(e) => e.stopPropagation()}
                                             >
                                               <i className="bx bx-download text-sm"></i>
                                               Download
                                             </a>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </div>
                             </div>
                           </div>

                           {/* Feedback Dialogs - Keep the existing ones */}
                           {showambherfeedbackdialog && (
                             <div className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
                                <div className="flex flex-col items mt-60 mb-60 bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
                                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#08404d]"><i className="ml-3 bx bxs-message-square-dots text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[20px] font-albertsans font-bold text-[#f0f0f0]">Ambher Optical Appointment FeedBack</h1></div>
                              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                                  <div className="px-5 flex flex-col justify-center  h-full mt-4 w-full"><p className="font-albertsans font-semibold text-[20px] text-[#424242] ">Rate our service</p>
                                  <Stack spacing={1}>
                                           <Rating size="large" value={ambherappointmentrating}  onChange={(e) => setambherappointmentrating(Number(e.target.value))}  sx={{fontSize: '2rem'}} name="half-rating-read" defaultValue={0} precision={1} />
                                   </Stack>  
                                  </div>

                                  <div className=" mt-4 px-5 w-full  flex flex-col">
                                     <textarea className="w-full text-[20px] rounded-md p-2  bg-[#ededed]   text-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentfeedback} onChange={(e) => {setambherappointmentfeedback(e.target.value); adjusttextareaheight();}} placeholder="How's your experience?"/>                   
                                  </div>

                                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-100 ease-in-out" onClick={() => {setshowambherfeedbackdialog(false); setambherappointmentfeedback(""); setambherappointmentrating(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                                    <div className="hover:cursor-pointer bg-[#08404d]  ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-100 ease-in-out" onClick={() => {handlesubmitfeedback('ambher'); setshowambherfeedbackdialog(false);}}><p className=" text-[#ffffff]">Submit</p></div>
                                  </div>
                                  </div>
                                </div>
                               </div>
                           )}

                           {showbautistafeedbackdialog && (
                             <div className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
                                <div className="flex flex-col items mt-60 mb-60 bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
                                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#08404d]"><i className="ml-3 bx bxs-message-square-dots text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[20px] font-albertsans font-bold text-[#f0f0f0]">Bautista Eye Center Appointment FeedBack</h1></div>
                              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                                  <div className="px-5 flex flex-col justify-center  h-full mt-4 w-full"><p className="font-albertsans font-semibold text-[20px] text-[#424242] ">Rate our service</p>
                                  <Stack spacing={1}>
                                           <Rating size="large" value={bautistaappointmentrating}  onChange={(e) => setbautistaappointmentrating(Number(e.target.value))}  sx={{fontSize: '2rem'}} name="half-rating-read" defaultValue={0} precision={1} />
                                   </Stack>  
                                  </div>

                                  <div className=" mt-4 px-5 w-full  flex flex-col">
                                     <textarea className="w-full text-[20px] rounded-md p-2  bg-[#ededed]   text-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentfeedback} onChange={(e) => {setbautistaappointmentfeedback(e.target.value); adjusttextareaheight();}} placeholder="How's your experience?"/>                   
                                  </div>

                                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-100 ease-in-out" onClick={() => {setshowbautistafeedbackdialog(false); setbautistaappointmentfeedback(""); setbautistaappointmentrating(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                                    <div className="hover:cursor-pointer bg-[#08404d]  ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-100 ease-in-out" onClick={() => {handlesubmitfeedback('bautista'); setshowbautistafeedbackdialog(false);}}><p className=" text-[#ffffff]">Submit</p></div>
                                  </div>
                                  </div>
                                </div>
                               </div>
                           )}
                         </div>
                      )}                 












                      
                      
                      
                      
       </div>
      </div>
      </div>
   )}
  </>
)}

      
        </section>

      {/* Toast Component */}
      {appointmentToast && (
        <div className="bottom-4 right-8 z-101 transform fixed">
          <div key={appointmentIsClicked ? 'success' : 'error'} className={`${appointmentToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
            {appointmentIsClicked ? (          
              <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
            ) : (
              <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
            )}
            {appointmentToastMessage}

            <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${appointmentIsClicked ? 'bg-green-500' : 'bg-red-500'}`} style={{width: appointmentProgressWidth, transition: 'width 4s linear'}}/>
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

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-[#00000075] flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <i className="bx bx-x text-black" style={{ fontSize: '24px' }}></i>
            </button>
            
            {/* Image container */}
            <div className="bg-white rounded-lg p-4 max-h-full overflow-auto">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{selectedImage.name}</h3>
              </div>
              
              <div className="flex justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = defaultimageplaceholder;
                  }}
                />
              </div>
              
              {/* Download button in modal */}
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => handleImageDownload(selectedImage)}
                  disabled={isDownloading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '8px',
                    border: '1px solid',
                    transition: 'all 0.2s ease-in-out',
                    cursor: isDownloading ? 'not-allowed' : 'pointer',
                    color: isDownloading ? '#6b7280' : '#2563eb',
                    backgroundColor: isDownloading ? '#f3f4f6' : '#eff6ff',
                    borderColor: isDownloading ? '#d1d5db' : '#bfdbfe',
                  }}
                  onMouseEnter={(e) => {
                    if (!isDownloading) {
                      e.target.style.backgroundColor = '#dbeafe';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDownloading) {
                      e.target.style.backgroundColor = '#eff6ff';
                    }
                  }}
                >
                  {isDownloading ? (
                    <>
                      <i 
                        className="bx bx-loader-alt"
                        style={{
                          fontSize: '14px',
                          animation: 'spin 1s linear infinite',
                          transformOrigin: 'center',
                        }}
                      ></i>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-download" style={{ fontSize: '14px' }}></i>
                      Download Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      {/* Logout Confirmation Modal */}
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
   )
  }
        
export default PatientDashboard