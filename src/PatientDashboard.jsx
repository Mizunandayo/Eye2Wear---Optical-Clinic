import React, {useState, useEffect, useRef, useCallback} from "react";
import {Link} from "react-router-dom";
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
function PatientDashboard(){

  const _apiUrl = import.meta.env.VITE_API_URL;

  




  const [activeappointmenttable, setactiveappointmenttable] = useState('bookappointment');
  const showappointmenttable = (appointmenttableid) => {
        setactiveappointmenttable(appointmenttableid);
  };










  
  const [patientfirstname, setpatientfirstname] = useState('');
  const [patientprofilepicture, setpatientprofilepicture] = useState('');
  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
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

  //Retrieveing Data from useAuth Hook
  useEffect(() => {
    const loadpatient = async () => {

      try{

      const data = await fetchpatientdetails();
      if(data){
        setpatientfirstname(data.patientfirstname || '');
        setpatientprofilepicture(data.patientprofilepicture || '');
        localStorage.setItem("patientemail", data.patientemail);
      }
    }catch(error){

        console.error("Error fetching patient details", error);

    }
   }; loadpatient();
  }, [fetchpatientdetails]);





  const [patientdemographics, setpatientdemographics] = useState(null);

  useEffect(() => {
    const loadingpatientdemographics = async (email) => {
      try{
        const demgoraphicdata = await fetchpatientdemographicbyemail(email);
        setpatientdemographics(demgoraphicdata || {});

      }catch(error){
        console.error("Failed fetching patientdemo", error);
      }
    };

    if(patientfirstname && !patientdemographics) {
      const email = localStorage.getItem("patientemail");

      if(email) {
        loadingpatientdemographics(email);
      }
    }
  }, [patientfirstname, patientdemographics, fetchpatientdemographicbyemail]);





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















 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
 //INSERTING PATIENT APPOINTMENT FORM TO DATABASE //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  //INSERTING PATIENT APPOINTMENT FORM TO DATABASE  
const patientsubmitappointment = async (formData) => {
  setissubmitting(true);

  try{


    const patientappointmentdata = {

      patientappointmentstatus: "Pending",

      patientappointmentprofilepicture: patientdemographics?.patientprofilepicture || '',
      patientappointmentlastname: patientdemographics?.patientlastname || '',
      patientappointmentfirstname: patientdemographics?.patientfirstname || '',
      patientappointmentmiddlename: patientdemographics?.patientmiddlename || '',
      patientappointmentemail: patientdemographics?.patientemail || '',


      patientappointmentstaffname:"Staff Name",
      


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



      patientadditionalappointmentnotes: additionaldetails,
      patientadditionalappointmentnotesimage: defaultimageplaceholder,
      patientappointmentpaymentotal: 0,
    }

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
      throw new Error(`HTTP error! Error: ${response.status}`);
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
    
    // Switch to appointment list AFTER refresh completes
    setactiveappointmenttable('appointmentlist');
    
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
    const existingappointmentbautistaDate = formData.get('patientbautistaappointmentdate');
    const existingappointmentbautistaTime = formData.get('patientbautistaappointmenttime');

    //Checks existing appointment schedules for Ambher Optical
    if (existingappointmentambherDate && existingappointmentambherTime) {
      const ambherexistingscheduleresponse = await fetch(`/api/patientappointments/appointments/ambher/${existingappointmentambherDate}/${existingappointmentambherTime}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      });
      

      if (ambherexistingscheduleresponse.ok) {
        const existingAmbherAppointments = await ambherexistingscheduleresponse.json();
        if (existingAmbherAppointments.length > 0) {
          return {
            conflict: true,
            message: "Selected date and time for Ambher Optical is already booked by another patient."
          };
        }
      }
    }

    //Checks existing appointment schedules for Bautista Eye Center
    if (existingappointmentbautistaDate && existingappointmentbautistaTime) {
      const bautisaexistingscheduleresponse = await fetch(`/api/patientappointments/appointments/bautista/${existingappointmentbautistaDate}/${existingappointmentbautistaTime}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('patienttoken')}`
        }
      });
      
      if (bautisaexistingscheduleresponse.ok) {
        const existingBautistaAppointments = await bautisaexistingscheduleresponse.json();
        if (existingBautistaAppointments.length > 0) {
          return {
            conflict: true,
            message: "Selected date and time for Bautista Eye Center is already booked by another patient."};}}
          

      }return { conflict: false };
      


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

 
 // Add a ref to track if we're already fetching to prevent duplicate calls
 const isFetchingRef = useRef(false);
 const lastFetchTimeRef = useRef(0);
 const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetches

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




//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
//DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT //DELETE PATIENT APPOINTMENT
const handledeleteappointment = async (appointmentId) => {
  setdeletingappointment(true); // Start loading state
  console.log('🗑️ Attempting to delete appointment with ID:', appointmentId);
  
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

    // Close the modal after successful deletion
    setdeletepatientappointment(false);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setjustDeletedAppointment(false);
    }, 2000);

    }catch(error){
      console.error("Appointment deletion failed: ", error);
      seterrorloadingappointments(error.message);
    } finally {
      setdeletingappointment(false); // End loading state
    }
}







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

     {/* NavBar */}
      <header id="header" className="backdrop-blur-md bg-[#ffffff36] sticky top-0 flex justify-between items-center text-black px-2 sm:px-4 md:px-32 w-full drop-shadow-md z-50">
        <Link to="/patientlandingpage">
          <img src={navlogo} alt="" className="w-28 sm:w-33 hover:scale-105 transition-all"></img>
        </Link>

        <ul className="hidden xl:flex items-center gap-8 lg:gap-12 font-semibold text-base">
        <Link to="/patientlandingpage" className="text-[#000000] hover:text-white no-underline"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white text-black rounded-md transition-all cursor-pointer">Home</li></Link>
        <Link to="/patientdashboard"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Appointments</li></Link>
        <Link to="/patientproducts"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Store</li></Link>
        <Link to="/patientwishlist"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Wishlist</li></Link>
        <Link to="/patientorders"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">Orders</li></Link>
        <Link to="/aboutpage"><li className="text-[15px] p-3 hover:bg-[#2781af] hover:text-white rounded-md transition-all cursor-pointer">About</li></Link>





        </ul>

      {/* Search 
      
              <div className="relative hidden md:flex items-center justify-center gap-3">
          <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
          <input type="text" placeholder="Search..." className="py-2 pl-10 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500"></input>
        </div>
        
      */}



 
    {localStorage.getItem ("patienttoken")? (

      
    <div id="profilecard" className="relative items-center justify-center flex">
    <div id="profile" onClick={showlogout}  className="ml-2 sm:ml-3 flex justify-center items-center bg-[#fbfbfb00] border-2 border-gray-200 shadow-lg rounded-full hover:cursor-pointer hover:scale-105 transition-all">
     {!patientprofilepicture ? (
       // Skeleton loading for navbar profile picture
       <div className="h-10 w-10 sm:h-13 sm:w-13 rounded-full bg-gray-300 animate-pulse"></div>
     ) : (
       <img src={patientprofilepicture || 'default-profile.png'} alt="Profile" className="h-10 w-10 sm:h-13 sm:w-13 rounded-full"></img>
     )}
    </div>

{showlogoutbtn && (
    <div className="w-64 sm:w-75 flex-col p-4 sm:p-5 motion-preset-fade absolute top-full mt-2 flex justify-center items-start bg-[#ffffff] rounded-2xl hover:cursor-pointer transition-all right-0 sm:right-auto shadow-lg" >

      <div className="hover:bg-[#f7f7f7] transition-all duration-300 ease-in-out py-2 px-1 rounded-2xl gap-3 flex items-center h-auto w-full ">
        {!patientprofilepicture ? (
          // Skeleton loading for dropdown profile picture
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 animate-pulse"></div>
        ) : (
          <img src={patientprofilepicture} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"/>
        )}
        <h1 className="font-albertsans font-semibold text-[16px] sm:text-[19px] truncate">{patientfirstname}</h1>
      </div>
      <div className="border-b-2 rounded-full border-[#747474] h-1 w-full my-1">

      </div>

     {localStorage.getItem("patienttoken") && (
      <Link to="/patientinformation" className="w-full"><div className="gap-2 flex items-center py-2 px-1 hover:bg-[#f7f7f7] duration-300 ease-in-out hover:text-[#000000] rounded-2xl transition-all cursor-pointer"> <img src={profileuser} className="w-8 h-8 sm:w-9 sm:h-9"/><h1 className="text-[14px] sm:text-[16px] text-[#202020]">Demographic Profile</h1></div></Link>
     )}

     <div 
       id="logoutdiv" 
       className="mt-2 px-1 py-2 hover:bg-[#f7f7f7] flex items-center gap-2 w-full rounded-2xl hover:cursor-pointer transition-all" 
       onClick={handlelogout}
     >
    <img src={logout} className="w-8 h-8 sm:w-9 sm:h-9"/>
    <p className="font-semibold text-[#E04F5F] text-[14px] sm:text-[16px]">Logout</p>
  </div> 
  </div>   
)}
    </div>

    
       
    ):(
      <Link to="/userlogin">
         <div className="ml-3  flex justify-center items-center p-3 bg-[#027bbf] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" onClick={handlelogout}>
         <i className="bx bx-user-circle mt-1 pr-2 font-semibold text-white text-[17px]"/>
         <p className="font-semibold text-white text-[17px]">Login</p>
       </div>
      </Link>
    )
  
  }
     

     {/* Dropdown menu 
             <div className="bx bx-menu block  sm:opacity-100 text-5xl cursor-pointer" onClick={() => setismenuopen(!ismenuopen)}></div>
        <div className={`absolute xl:hidden top-24 left-0 w-full text-white bg-sky-700 rounded-3xl mt-5 mr-5 ml-5 flex flex-col items-center gap-6 font-semibold text-lg transform transition-transform
          ${ismenuopen ? "opacity-100" : "opacity-0"}`} style={{transition: "transform 0.3s ease, opacity 0.3s ease"}}>


          <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-p">Home</li>
          <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">Product</li>
          <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">Explore</li>
          <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">Contact</li>
          </div>
 */}


      </header>











    {/* First Section */} {/* First Section */} {/* First Section */} {/* First Section */}
    <section className="pb-50 motion-preset-slide-up bg-cover bg-center min-h-[100vh] w-full flex justify-center align-center px-2 sm:px-4" >
    <div className="bg-cover bg-center h-full w-full flex items-center justify-center " >

      <div className="w-full h-full flex justify-start items-start pt-3 ">

       <div  className="h-auto w-full flex flex-col items-center justify-center mb-3" >

      
      <div id="appointment" className="bg-white w-full h-[100%] p-2 sm:p-4 mt-12 rounded-2xl" >  
          
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
                      <h1 className="font-albertsans font-bold text-[15px] sm:text-[17px] truncate w-full text-[#2d3744]">{patientdemographics?.patientfirstname || ''} {patientdemographics?.patientlastname || ''}</h1>
                      <p className="text-[11px] sm:text-[13px] truncate w-full text-[#535354]">{patientdemographics?.patientemail || ''}</p>
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
                  <div id="bookappointment" className="animate-fadeInUp w-full max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8 mt-6 sm:mt-25">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                      
                      {/* Form Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="bx bx-calendar-plus text-blue-600 text-xl sm:text-2xl"></i>
                          </div>
                          <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 font-albertsans">Book Your Appointment</h1>
                            <p className="text-gray-600 mt-1 text-sm sm:text-base">Schedule your consultation with our expert eye care professionals</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handlesubmitpatientappointment} className="p-4 sm:p-8">
                        
                        {/* Error messages now handled by toast notification */}

                        {/* Clinic Selection Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                          
                          {/* Ambher Optical Card */}
                          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 overflow-hidden">
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
                              {/* Date, Time & Location Selection */}
                              <div className="flex flex-col items-center justify-center gap-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="patientambherappointmentdate">
                                    Preferred Date
                                  </label>
                                  <input 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
                                    min={getdatetomorrow()} 
                                    max={getuptothreemonthsappointmentavailability()} 
                                    type="date" 
                                    name="patientambherappointmentdate" 
                                    id="patientambherappointmentdate" 
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="patientambherappointmenttime">
                                    Preferred Time
                                  </label>
                                  <select 
                                    name="patientambherappointmenttime" 
                                    id="patientambherappointmenttime" 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                  >
                                    <option value="">Select a time</option>
                                    {ambherappointmentschedules.map((time, index) => (
                                      <option key={index} value={time}>{time}</option>
                                    ))}
                                  </select>
                                </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="patientambherappointmentlocation">
                                    Clinic Location
                                  </label>
                                  <select 
                                    name="patientambherappointmentlocation" 
                                    id="patientambherappointmentlocation" 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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

                              {/* Services Description */}
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                  <i className="bx bx-list-check text-green-600"></i>
                                  Our Services
                                </h3>
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-green-200">
                                  <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                                    <span className="font-semibold text-green-700">Ambher Optical</span> specializes in comprehensive vision care and eye wellness services. Our experienced optometrists provide:
                                  </p>
                                  
                                  <div className="space-y-2 sm:space-y-3 text-gray-600">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Visual & Cataract Screening</span> - Early detection and assessment of cataracts and vision problems
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Pediatric Eye Care</span> - Specialized assessments and optometry services for children
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Color Vision Testing</span> - Comprehensive color blindness and vision deficiency evaluations
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Low Vision Solutions</span> - Assistive devices and rehabilitation for vision impairment
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Refraction Services</span> - Precise measurement for eyeglass and contact lens prescriptions
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-green-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Contact Lens Fitting</span> - Professional fitting and consultation for all contact lens types
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                    <p className="text-xs sm:text-sm text-green-800">
                                      <i className="bx bx-info-circle mr-2"></i>
                                      <span className="font-medium">Please specify your preferred service</span> in the additional notes section below when booking your appointment.
                                    </p>
                                  </div>
                                </div>
                              </div>
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
                              {/* Date, Time & Location Selection */}
                              <div className="flex flex-col items-center justify-center gap-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="patientbautistaappointmentdate">
                                    Preferred Date
                                  </label>
                                  <input 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
                                    type="date" 
                                    name="patientbautistaappointmentdate" 
                                    id="patientbautistaappointmentdate" 
                                    min={getdatetomorrow()} 
                                    max={getuptothreemonthsappointmentavailability()}
                                    onChange={(e) => {
                                      if (disablebautistaweekends(e.target.value)) {
                                        setbautistashownotavailweekendToast(false);
                                        setbautistashownotavailweekendToastClosing(false);
                                        setTimeout(() => {
                                          setbautistashownotavailweekendToast(true);
                                          e.target.value = "";
                                        }, 50);
                                      }
                                    }}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="patientbautistaappointmenttime">
                                    Preferred Time
                                  </label>
                                  <select 
                                    name="patientbautistaappointmenttime" 
                                    id="patientbautistaappointmenttime" 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                                  >
                                    <option value="">Select a time</option>
                                    {bautistaappointmentschedules.map((time, index) => (
                                      <option key={index} value={time}>{time}</option>
                                    ))}
                                  </select>
                                </div>
                                        </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="patientbautistaappointmentlocation">
                                    Clinic Location
                                  </label>
                                  <select 
                                    name="patientbautistaappointmentlocation" 
                                    id="patientbautistaappointmentlocation" 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
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

                              {/* Weekend Toast */}
                              {bautistashownotavailweekendToast && (
                                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                                  <div className={`${bautistashownotavailweekendToastClosing ? 'motion-opacity-out-0' : 'motion-preset-bounce'} bg-red-50 border border-red-200 rounded-lg shadow-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3`}>
                                    <i className="bx bx-x-circle text-red-500 text-lg sm:text-xl"></i>
                                    <span className="text-red-800 font-medium text-sm sm:text-base">Bautista weekend dates are not available</span>
                                  </div>
                                </div>
                              )}

                              {/* Services Description */}
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                                  <i className="bx bx-list-check text-blue-600"></i>
                                  Our Services
                                </h3>
                                <div className="bg-white rounded-xl p-4 sm:p-6 border border-blue-200">
                                  <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                                    <span className="font-semibold text-blue-700">Bautista Eye Center</span> offers comprehensive eye care and advanced surgical procedures. Our ophthalmologists specialize in:
                                  </p>
                                  
                                  <div className="space-y-2 sm:space-y-3 text-gray-600">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Comprehensive Eye Examinations</span> - Complete diagnostic evaluations and vision assessments
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Diabetic Retinopathy Management</span> - Specialized care for diabetes-related eye complications
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Glaucoma Treatment</span> - Advanced diagnosis and management of intraocular pressure disorders
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Hypertensive Retinopathy Care</span> - Treatment for high blood pressure-related eye damage
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Retinal Problem Solutions</span> - Expert diagnosis and treatment of retinal disorders
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 sm:gap-3">
                                      <i className="bx bx-check-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>
                                      <div>
                                        <span className="font-medium text-gray-700">Surgical Procedures</span> - Cataract surgery and pterygium removal with modern techniques
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                    <p className="text-xs sm:text-sm text-blue-800">
                                      <i className="bx bx-info-circle mr-2"></i>
                                      <span className="font-medium">Please specify your preferred service</span> in the additional notes section below when booking your appointment.
                                    </p>
                                  </div>
                                  
                                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-xs text-amber-800 flex items-center gap-2">
                                      <i className="bx bx-calendar-x text-amber-600"></i>
                                      <span className="font-medium">Note:</span> Weekend appointments are not available at this location.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Information Section */}
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                            <i className="bx bx-note text-gray-600"></i>
                            Additional Information
                          </h3>
                          
                          <div className="flex flex-col gap-6 sm:gap-8">
                            {/* Notes Section */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3" htmlFor="patientadditionalappointmentnotes">
                                Additional Appointment Notes
                              </label>
                              <textarea 
                                className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[100px] sm:min-h-[120px] text-sm sm:text-base" 
                                ref={textarearef} 
                                rows={4} 
                                value={additionaldetails} 
                                onChange={(e) => {setadditionaldetails(e.target.value); adjusttextareaheight();}} 
                                placeholder="Please provide any additional details about your appointment, symptoms, or special requirements..."
                              />
                            </div>

                            {/* Supporting Documents Upload Section */}
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Supporting Documents/Images
                              </label>
                              <div className="space-y-4">
                                {/* Multiple documents upload */}
                                <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50">
                                  <div className="text-center mb-4">
                                    <i className="bx bx-file-plus text-4xl text-blue-500 mb-2"></i>
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
                                      <h5 className="font-semibold text-gray-700 text-center">
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
                                                doc.type.includes('word') ? 'text-blue-500' :
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

                        {/* Submit Section */}
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
                      </form>
                    </div>
                  </div>
                )}



































  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
  {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/} {/*Patient Appointment List*/}
      { activeappointmenttable === 'appointmentlist' && ( <div id="appointmentlist" className= " mt-35 animate-fadeInUp flex flex-col items-start border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl" >
                
                <div className="mb-40 flex justify-center items-start h-[500px] w-full rounded-3xl ">

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
          className="bg-[#2781af] hover:bg-[#1f6591] text-white font-albertsans font-semibold py-2 px-6 rounded-2xl transition-all duration-200"
        >
          Book New Appointment
        </div>
      </div>
    </div>
    

  ) : (
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
          {patientappointments.map((appointment) => (
            <tr 
              key={appointment._id}
              className="hover:bg-gray-50 transition-all ease-in-out duration-100 border-b-2"
            >
              <td className="py-3 px-6 text-[#454444] text-center font-albertsans font-medium ">
                {formatappointmatedates(appointment.createdAt)}{}
              </td>
              <td className="py-3 px-6 text-[#454444] text-center font-albertsans font-medium ">
                {appointment.patientambherappointmentdate && (
                  <div className="text-sm font-albertsans text-gray-900 flex  justify-center items-center">
                    <span className="font-semibold items-start">{formatappointmatedates(appointment.patientambherappointmentdate)} </span> 
                    <span className="ml-1 font-semibold items-start">({formatappointmenttimes(appointment.patientambherappointmenttime)})</span> 
                    <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
  ${appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
    appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
    appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
    appointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
    'bg-red-100 text-red-800'}`}>{appointment.patientambherappointmentstatus}</span>
                  </div>
                )}
              </td>

              <td className="py-3 px-6 text-[#454444] text-center font-albertsans font-medium ">

              </td>
              <td className="py-3 px-6 text-[#454444] text-center font-albertsans font-medium ">
                {appointment.patientbautistaappointmentdate && (
                  <div className="text-sm font-albertsans text-gray-900 flex justify-center items-center">
                    <span className="font-semibold">{formatappointmatedates(appointment.patientbautistaappointmentdate)}</span> 
                    <span className="ml-1 font-semibold">({formatappointmenttimes(appointment.patientbautistaappointmenttime)})</span> 
                    
<span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
  ${appointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
    appointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
    appointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
    appointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#103d4a]':
    'bg-red-100 text-red-800'}`}>{appointment.patientbautistaappointmentstatus}</span>
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">
               
              <div onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
                  className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-100 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>

              <div onClick={() =>  {setdeletepatientappointment(true);
                                setselectedpatientappointment(appointment);
              }}
                className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-100 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4 h-full overflow-y-auto">
        {patientappointments.map((appointment) => (
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
                      appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-green-100 text-green-800' :
                      appointment.patientambherappointmentstatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
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
                  <h3 className="text-sm font-bold text-blue-800">Bautista Eye Center</h3>
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
                      appointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      appointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-green-100 text-green-800' :
                      appointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
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
              <button 
                onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
                className="flex-1 bg-[#383838] hover:bg-[#595959] text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i className="bx bx-show text-lg"></i>
                View
              </button>
              <button 
                onClick={() => {setdeletepatientappointment(true); setselectedpatientappointment(appointment);}}
                className="flex-1 bg-[#8c3226] hover:bg-[#ab4f43] text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i className="bx bx-trash text-lg"></i>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deletepatientappointment && (
        <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50 px-4">
          <div className="flex flex-col items bg-white rounded-2xl w-full max-w-md h-fit animate-fadeInUp">
            <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]">
              <i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/>
              <h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1>
            </div>
            <div className="flex flex-col items-center h-fit rounded-br-2xl rounded-bl-2xl">
              <div className="px-5 flex flex-col justify-center h-[130px] w-full">
                <p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                {selectedpatientappointment && (
                  <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientappointmentid}</p>
                )}  
              </div>        
              <div className="pr-5 pl-5 flex justify-end items-center h-[80px] w-full">
                <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141] rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-100 ease-in-out" onClick={() => setdeletepatientappointment(false)}>
                  <p className="text-[#ffffff]">Cancel</p>
                </div>
                <div 
                  className={`${deletingappointment ? 'cursor-not-allowed opacity-70' : 'hover:cursor-pointer hover:bg-[#7f1a1a] hover:scale-105'} bg-[#4e0f0f] ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-100 ease-in-out flex items-center justify-center`} 
                  onClick={() => {
                    if (!deletingappointment) {
                      handledeleteappointment(selectedpatientappointment.patientappointmentid);
                    }
                  }}
                >
                  {deletingappointment ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-[#ffffff]">Deleting...</p>
                    </>
                  ) : (
                    <p className="text-[#ffffff]">Delete</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
                </div>

             </div> )}
                </div>
           
                 </div>

     
  


 {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
 {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
                         {viewpatientappointment && selectedpatientappointment && (
                         <div id="viewpatientappointment" className="h-auto bg-opacity-0 flex justify-center items-center z-[60] fixed inset-0 bg-[#000000af] bg-opacity-50 p-2 sm:p-8">
                           <div className="animate-fadeInUp w-full max-w-7xl mx-auto max-h-full flex flex-col">
                             <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-h-full flex flex-col">
                               
                               {/* Header */}
                               <div className="bg-gradient-to-r from-blue-50 to-green-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                       <i className="bx bx-calendar-check text-blue-600 text-xl sm:text-2xl"></i>
                                     </div>
                                     <div>
                                       <h1 className="text-lg sm:text-2xl font-bold text-gray-800 font-albertsans">Appointment Details</h1>
                                       <p className="text-gray-600 mt-1 text-sm sm:text-base">View your scheduled appointment information</p>
                                     </div>
                                   </div>
                                   <button 
                                     onClick={() => setviewpatientappointment(false)} 
                                     className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 border-none cursor-pointer"
                                   >
                                     <i className="bx bx-x text-gray-600 text-xl sm:text-2xl"></i>
                                   </button>
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
            <p className="text-gray-900 text-sm">Vision Care & Eye Wellness</p>
          </div>
        </div>
        <span className={`font-albertsans font-semibold rounded-full text-sm leading-5 px-4 py-2 inline-flex
          ${selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-red-100 text-red-800':
            selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
            selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-green-100 text-green-800':
            selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-blue-100 text-blue-800':
            'bg-red-100 text-red-800'}`}>
          {selectedpatientappointment.patientambherappointmentstatus}
        </span>
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
              <span className="text-sm font-medium text-green-700">Payment Total:</span>
              <p className="text-green-800 font-bold text-lg">
                ₱{selectedpatientappointment.patientambherappointmentpaymentotal}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Services - Only show if not Pending */}
      {selectedpatientappointment.patientambherappointmentstatus !== "Pending" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-list-check text-green-600"></i>
            Selected Services
          </h3>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <div className="space-y-3">
              {selectedpatientappointment.patientambherappointmentcataractscreening && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Visual/Cataract Screening</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentpediatricassessment && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Pediatric Assessment</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentpediatricoptometrist && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Pediatric Optometrist</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentcolorvisiontesting && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Color Vision Testing</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentlowvisionaid && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Low Vision Aid</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentrefraction && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Refraction</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentcontactlensefitting && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-green-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Contact Lens Fitting</span>
                </div>
              )}
              
              {selectedpatientappointment.patientambherappointmentotherservice && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <i className="bx bx-check-circle text-green-500 text-lg"></i>
                    <span className="text-gray-700 font-medium">Other Service</span>
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
                <p className="text-gray-700 mt-1">{selectedpatientappointment.patientambherappointmentconsultationremarkssubject}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientambherappointmentconsultationremarks && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Remarks:</span>
                <p className="text-gray-700 mt-1">{selectedpatientappointment.patientambherappointmentconsultationremarks}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientambherappointmentprescription && (
              <div>
                <span className="text-sm font-medium text-gray-500">Prescription:</span>
                <p className="text-gray-700 mt-1">{selectedpatientappointment.patientambherappointmentprescription}</p>
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
            <button  
              onClick={() => setshowambherfeedbackdialog(true)}  
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="bx bx-message-square-dots text-lg"></i>
              Submit Feedback
            </button>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-green-200">
              <span className="text-sm font-medium text-gray-500">Your Feedback:</span>
              <div className="mt-2">
                <Stack spacing={1}>
                  <Rating size="large" value={selectedpatientappointment.patientambherappointmentrating} readOnly /> 
                </Stack>  
                <p className="text-gray-700 mt-2">{selectedpatientappointment.patientambherappointmentfeedback}</p>
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
            <p className="text-gray-900 text-sm">Comprehensive Eye Care & Surgery</p>
          </div>
        </div>
        <span className={`font-albertsans font-semibold rounded-full text-sm leading-5 px-4 py-2 inline-flex
          ${selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-red-100 text-red-800':
            selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
            selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-green-100 text-green-800':
            selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-blue-100 text-blue-800':
            'bg-red-100 text-red-800'}`}>
          {selectedpatientappointment.patientbautistaappointmentstatus}
        </span>
      </div>
    </div>

    <div className="p-6 space-y-6">
      {/* Appointment Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bx bx-calendar text-blue-600"></i>
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
              <span className="text-sm font-medium text-blue-700">Payment Total:</span>
              <p className="text-blue-800 font-bold text-lg">
                ₱{selectedpatientappointment.patientbautistaappointmentpaymentotal}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Services - Only show if not Pending */}
      {selectedpatientappointment.patientbautistaappointmentstatus !== "Pending" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-list-check text-blue-600"></i>
            Selected Services
          </h3>
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="space-y-3">
              {selectedpatientappointment.patientbautistaappointmentcomprehensiveeyeexam && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Comprehensive Eye Exam</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmentdiabeticretinopathy && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Diabetic Retinopathy</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmentglaucoma && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Glaucoma</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmenthypertensiveretinopathy && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Hypertensive Retinopathy</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmentretinolproblem && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Retinal Problem</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmentcataractsurgery && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Cataract Surgery</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmentpterygiumsurgery && (
                <div className="flex items-center gap-3">
                  <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                  <span className="text-gray-700 font-medium">Pterygium Surgery</span>
                </div>
              )}
              
              {selectedpatientappointment.patientbautistaappointmentotherservice && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <i className="bx bx-check-circle text-blue-500 text-lg"></i>
                    <span className="text-gray-700 font-medium">Other Service</span>
                  </div>
                  <div className="ml-8 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-blue-800 text-sm">{selectedpatientappointment.patientbautistaappointmentotherservicenote}</p>
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
            <i className="bx bx-clipboard text-blue-600"></i>
            Consultation Details
          </h3>
          <div className="bg-white rounded-xl p-4 border border-blue-200 space-y-4">
            {selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Subject:</span>
                <p className="text-gray-700 mt-1">{selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientbautistaappointmentconsultationremarks && (
              <div>
                <span className="text-sm font-medium text-gray-500">Consultation Remarks:</span>
                <p className="text-gray-700 mt-1">{selectedpatientappointment.patientbautistaappointmentconsultationremarks}</p>
              </div>
            )}
            
            {selectedpatientappointment.patientbautistaappointmentprescription && (
              <div>
                <span className="text-sm font-medium text-gray-500">Prescription:</span>
                <p className="text-gray-700 mt-1">{selectedpatientappointment.patientbautistaappointmentprescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <i className="bx bx-star text-blue-600"></i>
            Feedback
          </h3>
          
          {selectedpatientappointment.patientbautistaappointmentrating === 0 && selectedpatientappointment.patientbautistaappointmentfeedback === "" ? (
            <button  
              onClick={() => setshowbautistafeedbackdialog(true)}  
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <i className="bx bx-message-square-dots text-lg"></i>
              Submit Feedback
            </button>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-blue-200">
              <span className="text-sm font-medium text-gray-500">Your Feedback:</span>
              <div className="mt-2">
                <Stack spacing={1}>
                  <Rating size="large" value={selectedpatientappointment.patientbautistaappointmentrating} readOnly /> 
                </Stack>  
                <p className="text-gray-700 mt-2">{selectedpatientappointment.patientbautistaappointmentfeedback}</p>
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
                                           <h3 className="text-xl font-bold text-gray-800 font-albertsans">Combined Total Payment</h3>
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
                                         <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
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
                                                 doc.mimetype.includes('word') ? 'text-blue-500' :
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
                                               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200 w-full justify-center"
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
      {showLogoutModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to log out? You will need to sign in again to access your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={cancelLogout}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all duration-200"
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