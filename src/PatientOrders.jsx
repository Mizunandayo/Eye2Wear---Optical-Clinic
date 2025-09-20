import React, {useState, useEffect, useCallback} from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import navlogo from  "../src/assets/images/navlogo.png";
import bautistalogo from"../src/assets/images/bautistalogo.png";
import ambherlogo from"../src/assets/images/ambherlogo.png";
import { useAuth } from "./hooks/patientuseAuth";
import useApiService from "./hooks/useApiService";
import useSmartCache from "./hooks/useSmartCache";
import darklogo from "../src/assets/images/darklogo.png";
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import { checkAndUpdateOrderStatus, updateAmbherOrderStatus, updateBautistaOrderStatus } from '../utils/orderStatusUpdater';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Footer from "./Footer";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import defaulticon from "../src/assets/images/defaulticon.png";






// Skeleton component for order items
const OrderSkeleton = () => (
  <div className="pb-7 shadow-md rounded-2xl py-3.25 px-3.25 mb-3 border-1 flex flex-col sm:flex-row items-start sm:items-center w-full h-auto animate-pulse">
    {/* Product image skeleton - responsive sizing */}
    <div className="mr-0 sm:mr-5 w-full sm:w-35 h-48 sm:h-35 bg-gray-300 rounded-2xl mb-4 sm:mb-0"></div>
    
    <div className="mt-2 h-auto w-full flex flex-col items-start">
      {/* Product name and status skeleton - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between w-full mb-5 gap-2 sm:gap-0">
        {/* Product name skeleton - responsive sizing */}
        <div className="h-5 sm:h-6 bg-gray-300 rounded w-full sm:w-96"></div>
        {/* Status badge skeleton - responsive sizing */}
        <div className="ml-0 sm:ml-3 h-6 sm:h-8 bg-gray-200 rounded-full w-24 sm:w-28 self-start sm:self-center"></div>
      </div>
      
      {/* Order details section skeleton - responsive grid */}
      <div className="justify-between w-full grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:items-center text-[#323232] font-semibold text-[13px]">
        {/* Date Ordered - matches actual structure with icon and text */}
        <div className="flex items-center gap-1">
          {/* Icon skeleton */}
          <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gray-300 rounded mt-0.5"></div>
          <div>
            {/* Label skeleton */}
            <div className="h-3 bg-gray-300 rounded w-20 mb-1"></div>
            {/* Value skeleton */}
            <div className="h-3 sm:h-4 bg-gray-300 rounded w-28 sm:w-32"></div>
          </div>
        </div>
        
        {/* Pickup info */}
        <div className="flex items-center gap-1">
          {/* Icon skeleton */}
          <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gray-300 rounded mt-0.5"></div>
          <div>
            {/* Label skeleton */}
            <div className="h-3 bg-gray-300 rounded w-32 sm:w-40 mb-1"></div>
            {/* Value skeleton */}
            <div className="h-3 sm:h-4 bg-gray-300 rounded w-32 sm:w-36"></div>
          </div>
        </div>
        
        {/* Quantity */}
        <div className="flex items-center gap-1">
          {/* Icon skeleton */}
          <div className="w-5 sm:w-6 h-5 sm:h-6 bg-gray-300 rounded mt-0.5"></div>
          <div>
            {/* Label skeleton */}
            <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
            {/* Value skeleton */}
            <div className="h-3 sm:h-4 bg-gray-300 rounded w-8"></div>
          </div>
        </div>
        
        {/* Amount */}
        <div className="flex items-center gap-1">
          {/* Currency symbol skeleton */}
          <div className="w-4 h-5 sm:h-6 bg-gray-300 rounded"></div>
          <div>
            {/* Label skeleton */}
            <div className="h-3 bg-gray-300 rounded w-20 sm:w-24 mb-1"></div>
            {/* Value skeleton */}
            <div className="h-3 sm:h-4 bg-gray-300 rounded w-16 sm:w-20"></div>
          </div>
        </div>
      </div>
      
      {/* Total price section skeleton */}
      <div className="flex items-center justify-between border-t-2 w-full h-10 mt-5">
        <div></div>
        <div className="flex items-center gap-3 mt-5 h-auto">
          {/* "Total Price:" label skeleton */}
          <div className="h-4 sm:h-5 bg-gray-300 rounded w-20 sm:w-24"></div>
          {/* Price value skeleton */}
          <div className="h-5 sm:h-7 bg-gray-300 rounded w-24 sm:w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, index) => (
      <OrderSkeleton key={index} />
    ))}
  </div>
);






















function PatientOrders(){

  const apiUrl = import.meta.env.VITE_API_URL;


  
  const [patientfirstname, setpatientfirstname] = useState('');
  const [patientlastname, setpatientlastname] = useState('');
  const [patientmiddlename, setpatientmiddlename] = useState('');
  const [patientemail, setpatientemail] = useState('');
  const [patientprofilepicture, setpatientprofilepicture] = useState('');
  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  }



 const {handlelogout, fetchpatientdetails, showLogoutModal, confirmLogout, cancelLogout} = useAuth();
 const { 
   fetchAmbherOrders, 
   fetchBautistaOrders,
   invalidateOrderData 
 } = useApiService();
 
 // Smart caching with real-time updates
 const { smartFetch, realtimeUpdates, CACHE_DURATIONS } = useSmartCache();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  //Retrieveing Data from useAuth Hook
  useEffect(() => {
    const loadpatient = async () => {

      try{

      const data = await fetchpatientdetails();
      if(data){
        setpatientfirstname(data.patientfirstname || '');
        setpatientmiddlename(data.patientmiddlename || '');
        setpatientlastname(data.patientlastname || '');
        setpatientemail(data.patientemail || '');
        setpatientprofilepicture(data.patientprofilepicture || '');
        localStorage.setItem("patientemail", data.patientemail);
      }
    }catch(error){

        console.error("Error fetching patient details", error);

    }
   }; loadpatient();
  }, [fetchpatientdetails]);






















 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
 //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT

const [activeorderstable, setactiveorderstable] = useState('ambherorderstable');
const [ambherOrders, setAmbherOrders] = useState([]);
const [bautistaOrders, setBautistaOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [filterambherorderedproductsStatus, setfilterambherorderedproductsStatus] = useState('All');
const [filterbautistaorderedproductsStatus, setfilterbautistaorderedproductsStatus] = useState('All');
const [filteredambherOrders, setfilteredambherOrders] = useState([]);
const [filteredbautistaOrders, setfilteredbautistaOrders] = useState([]);
const [searchpatientorderedProducts, setsearchpatientorderedProducts] = useState('');

// View Order Modal states
const [selectedOrderForView, setSelectedOrderForView] = useState(null);
const [showViewOrderModal, setShowViewOrderModal] = useState(false);
const [viewOrderCurrentImageIndex, setViewOrderCurrentImageIndex] = useState(0);


const showorderstable = (orderstableid) => {
      setactiveorderstable(orderstableid);
      setsearchpatientorderedProducts('');
};

          


//SEARCH ORDERED PRODUCT 
useEffect(() => {
  const filterpatientOrders = (orders, statusFilter, isAmbher) => {


    let filtered = [...orders];
    

    if (statusFilter !== 'All') {
      const statusField = isAmbher ? 'patientorderambherstatus' : 'patientorderbautistastatus';
      filtered = filtered.filter(order => order[statusField] === statusFilter);
    }
    
    if (searchpatientorderedProducts) {
      const productNameField = isAmbher ? 'patientorderambherproductname' : 'patientorderbautistaproductname';
      filtered = filtered.filter(order => 
        order[productNameField].toLowerCase().includes(searchpatientorderedProducts.toLowerCase())
      );
    }

    return filtered;
    
  };

  if (activeorderstable === 'ambherorderstable') {
    const filtered = filterpatientOrders(ambherOrders, filterambherorderedproductsStatus, true);
    setfilteredambherOrders(filtered);
  } else {
    const filtered = filterpatientOrders(bautistaOrders, filterbautistaorderedproductsStatus, false);
    setfilteredbautistaOrders(filtered);
  }
}, [ambherOrders, bautistaOrders, filterambherorderedproductsStatus, filterbautistaorderedproductsStatus, activeorderstable, searchpatientorderedProducts]);
    





const handleSearch = (term) => {
  setsearchpatientorderedProducts(term);
};




//FETCHING PATIENT ORDERS WITH SMART CACHING
const fetchpatientorders = useCallback(async (forceRefresh = false) => {
  try {
    setLoading(true);

    if (activeorderstable === 'ambherorderstable') {
      // Smart cached Ambher orders fetching
      const data = await smartFetch(
        `ambherOrders_${patientemail}`,
        () => fetchAmbherOrders(patientemail),
        CACHE_DURATIONS.orders,
        forceRefresh
      );
      
      // Check and automatically update order status for pickup dates that match today
      const updatedData = await checkAndUpdateOrderStatus(data || [], 'ambher', updateAmbherOrderStatus);
      
      setAmbherOrders(updatedData);
      setfilteredambherOrders(updatedData); 

    } else {
      // Smart cached Bautista orders fetching
      const data = await smartFetch(
        `bautistaOrders_${patientemail}`,
        () => fetchBautistaOrders(patientemail),
        CACHE_DURATIONS.orders,
        forceRefresh
      );
      
      // Check and automatically update order status for pickup dates that match today
      const updatedData = await checkAndUpdateOrderStatus(data || [], 'bautista', updateBautistaOrderStatus);
      
      setBautistaOrders(updatedData);
      setfilteredbautistaOrders(updatedData); 
    }

  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    setLoading(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeorderstable, patientemail, smartFetch, CACHE_DURATIONS]);

useEffect(() => {
    if (patientemail) {
      fetchpatientorders();
    }
  }, [patientemail, activeorderstable, fetchpatientorders]);

// Listen for real-time order updates
useEffect(() => {
  if (realtimeUpdates.has('orders')) {
    console.log('📦 Real-time orders update detected, refreshing data...');
    if (patientemail) {
      fetchpatientorders(true); // Force refresh on real-time update
    }
  }
}, [realtimeUpdates, patientemail, fetchpatientorders]);

// Periodic status check - every 5 minutes
useEffect(() => {
  const statusCheckInterval = setInterval(async () => {
    console.log('🔄 Checking for orders with pickup dates matching today...');
    
    if (activeorderstable === 'ambherorderstable' && ambherOrders.length > 0) {
      const updatedAmbherOrders = await checkAndUpdateOrderStatus(ambherOrders, 'ambher', updateAmbherOrderStatus);
      if (JSON.stringify(updatedAmbherOrders) !== JSON.stringify(ambherOrders)) {
        setAmbherOrders(updatedAmbherOrders);
        setfilteredambherOrders(updatedAmbherOrders);
        console.log('✅ Ambher orders updated due to pickup date matching today');
      }
    } else if (activeorderstable === 'bautistaorderstable' && bautistaOrders.length > 0) {
      const updatedBautistaOrders = await checkAndUpdateOrderStatus(bautistaOrders, 'bautista', updateBautistaOrderStatus);
      if (JSON.stringify(updatedBautistaOrders) !== JSON.stringify(bautistaOrders)) {
        setBautistaOrders(updatedBautistaOrders);
        setfilteredbautistaOrders(updatedBautistaOrders);
        console.log('✅ Bautista orders updated due to pickup date matching today');
      }
    }
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(statusCheckInterval);
}, [activeorderstable, ambherOrders, bautistaOrders]);




  const formatorderDates = (formattednewdate) => {
    const datedata = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(formattednewdate).toLocaleDateString(undefined, datedata);
  };




  const formatorderstatusColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-900';
      case 'Ready for Pickup':
        return 'bg-blue-100 text-blue-900';
      case 'Completed':
        return 'bg-green-100 text-green-900';
      case 'Cancelled':
        return 'bg-red-100 text-red-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  // PDF Export function for billing details
  const exportBillingToPDF = async (orderData) => {
    try {
      // Determine if it's Ambher or Bautista order
      const isAmbher = orderData.patientorderambherid;
      
      // Extract order details
      const orderId = isAmbher ? orderData.patientorderambherid : orderData.patientorderbautistaid;
      const productName = isAmbher 
        ? orderData.patientorderambherproductname 
        : orderData.patientorderbautistaproductname;
      const productPrice = isAmbher 
        ? orderData.patientorderambherproductprice 
        : orderData.patientorderbautistaproductprice;
      const productQuantity = isAmbher 
        ? orderData.patientorderambherproductquantity 
        : orderData.patientorderbautistaproductquantity;
      const amountPaid = isAmbher 
        ? orderData.patientorderambheramountpaid 
        : orderData.patientorderbautistaamountpaid;
      const productTotal = isAmbher 
        ? orderData.patientorderambherproducttotal 
        : orderData.patientorderbautistaproducttotal;
      const clinic = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
      const clinicAddress = isAmbher
        ? orderData.patientorderambherproductchosenpickupplace
        : orderData.patientorderbautistaproductchosenpickupplace;
      const customerName = `${patientfirstname} ${patientlastname}`;
      const customerEmail = patientemail;
      const orderDate = formatorderDates(orderData.createdAt);
      const orderNotes = isAmbher 
        ? orderData.patientorderambherproductnotes 
        : orderData.patientorderbautistaproductnotes;

      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Set font
      pdf.setFont('helvetica');
      
      // Header Section
      pdf.setFontSize(20);
      pdf.setTextColor(24, 77, 133); // #184d85
      pdf.text('OFFICIAL RECEIPT', pageWidth / 2, 25, { align: 'center' });
      
      // Clinic Information
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(clinic, pageWidth / 2, 40, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(clinicAddress, pageWidth / 2, 48, { align: 'center' });
      
      // TIN Number (You should replace this with actual TIN)
      const tinNumber = isAmbher ? 'TIN: 123-456-789-001' : 'TIN: 987-654-321-002';
      pdf.text(tinNumber, pageWidth / 2, 55, { align: 'center' });
      
      // Horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(20, 65, pageWidth - 20, 65);
      
      // Receipt Details
      pdf.setFontSize(12);
      const leftCol = 25;
      const rightCol = 120;
      let yPos = 80;
      
      // Receipt Information
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Receipt No: #${orderId}`, leftCol, yPos);
      pdf.text(`Date: ${orderDate}`, rightCol, yPos);
      yPos += 10;
      
      // Customer Information
      pdf.text('BILL TO:', leftCol, yPos);
      yPos += 8;
      pdf.text(`${customerName}`, leftCol, yPos);
      yPos += 6;
      pdf.text(`${customerEmail}`, leftCol, yPos);
      yPos += 15;
      
      // Table Header
      pdf.setFillColor(24, 77, 133); // #184d85
      pdf.setTextColor(255, 255, 255);
      pdf.rect(20, yPos, pageWidth - 40, 10, 'F');
      
      pdf.setFontSize(10);
      pdf.text('DESCRIPTION', 25, yPos + 7);
      pdf.text('QTY', 120, yPos + 7);
      pdf.text('UNIT PRICE', 140, yPos + 7);
      pdf.text('AMOUNT', 170, yPos + 7);
      
      yPos += 15;
      
      // Product Details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      // Product name (split if too long)
      const productNameLines = pdf.splitTextToSize(productName, 90);
      pdf.text(productNameLines, 25, yPos);
      
      // Calculate the height needed for product name
      const lineHeight = 5;
      const productNameHeight = productNameLines.length * lineHeight;
      
      pdf.text(`${productQuantity}`, 120, yPos);
      pdf.text(`PHP ${Number(productPrice).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 140, yPos);
      pdf.text(`PHP ${(Number(productPrice) * Number(productQuantity)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, yPos);
      
      yPos += Math.max(productNameHeight, 8) + 5;
      
      // Order notes if available
      if (orderNotes && orderNotes.trim()) {
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text('Notes:', 25, yPos);
        yPos += 5;
        const notesLines = pdf.splitTextToSize(orderNotes, 160);
        pdf.text(notesLines, 25, yPos);
        yPos += notesLines.length * 4 + 5;
      }
      
      // Horizontal line before totals
      pdf.setLineWidth(0.3);
      pdf.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;
      
      // Totals Section
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      
      const subtotal = Number(productPrice) * Number(productQuantity);
      
      pdf.text('Subtotal:', 140, yPos);
      pdf.text(`PHP ${subtotal.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, yPos);
      yPos += 8;
      
      // Amount Paid
      pdf.text('Amount Paid:', 140, yPos);
      pdf.text(`PHP ${Number(amountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, yPos);
      yPos += 8;
      
      // Remaining Balance (if any)
      const remainingBalance = Number(productTotal) - Number(amountPaid);
      if (remainingBalance > 0) {
        pdf.setTextColor(196, 54, 54); // Red color for balance
        pdf.text('Remaining Balance:', 140, yPos);
        pdf.text(`PHP ${remainingBalance.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, yPos);
        yPos += 8;
      }
      
      // Total line
      pdf.setLineWidth(0.5);
      pdf.line(135, yPos, pageWidth - 20, yPos);
      yPos += 8;
      
      // Total Amount
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('TOTAL:', 140, yPos);
      pdf.text(`PHP ${Number(productTotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 170, yPos);
      
      yPos += 25;
      
      // Payment Status
      pdf.setFontSize(10);
      if (remainingBalance <= 0) {
        pdf.setTextColor(35, 165, 74); // Green
        pdf.text('FULLY PAID', pageWidth / 2, yPos, { align: 'center' });
      } else {
        pdf.setTextColor(196, 54, 54); // Red
        pdf.text('PARTIAL PAYMENT', pageWidth / 2, yPos, { align: 'center' });
      }
      
      yPos += 20;
      
      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Thank you for your business!', pageWidth / 2, yPos, { align: 'center' });
      yPos += 6;
      pdf.text('This is an official receipt generated by Eye2Wear Optical System', pageWidth / 2, yPos, { align: 'center' });
      yPos += 6;
      pdf.text(`Generated on: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`, pageWidth / 2, yPos, { align: 'center' });
      
      // Save the PDF
      const fileName = `Receipt_${clinic.replace(' ', '_')}_Order_${orderId}_${customerName.replace(' ', '_')}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // View Order Modal handlers
  const handleViewOrder = (order) => {
    setSelectedOrderForView(order);
    setViewOrderCurrentImageIndex(0);
    setShowViewOrderModal(true);
  };

  const closeViewOrderModal = () => {
    setShowViewOrderModal(false);
    setSelectedOrderForView(null);
    setViewOrderCurrentImageIndex(0);
  };

  const nextViewOrderImage = () => {
    if (selectedOrderForView) {
      const isAmbher = selectedOrderForView.patientorderambherid;
      const images = isAmbher 
        ? selectedOrderForView.patientorderambherproductimage 
        : selectedOrderForView.patientorderbautistaproductimage;
      
      if (images && images.length > 0) {
        setViewOrderCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  };

  const prevViewOrderImage = () => {
    if (selectedOrderForView) {
      const isAmbher = selectedOrderForView.patientorderambherid;
      const images = isAmbher 
        ? selectedOrderForView.patientorderambherproductimage 
        : selectedOrderForView.patientorderbautistaproductimage;
      
      if (images && images.length > 0) {
        setViewOrderCurrentImageIndex((prevIndex) => 
          prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
      }
    }
  };















  



          
          
        




















































































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
                  className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Home
                </Link>
                <Link 
                  to="/patientdashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Appointments
                </Link>
                <Link 
                  to="/patientproducts" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Store
                </Link>
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
                  className="block px-3 py-2 text-base font-semibold text-sky-600 bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Orders
                </Link>
                <Link 
                  to="/aboutpage" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-black hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
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
                      className="block"
                    >
                      <div className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Login
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

    {/* First Section */}
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 motion-preset-slide-up bg-cover bg-center min-h-[100vh] h-auto w-[100vw] flex justify-center align-center pb-50" >
    <div className="bg-cover bg-center h-auto w-full flex  justify-center " >

      <div className="w-full h-auto flex flex-col justify-start items-start pt-3 p-3">






              <div id="patientordersmanagement" className="px-4 sm:px-5 pb-4 pt-8 transition-all duration-300 ease-in-out w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">   

              <div className="flex items-center mt-8"><i className="bx bxs-package text-[#184d85] text-[25px] mr-2"/> <h1 className="font-albertsans font-bold text-[#184d85] text-[25px]">My Orders</h1></div>

  <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center mt-3 gap-3 sm:gap-0 sm:h-[60px]">
  <div onClick={() => showorderstable('ambherorderstable')} className={`gap-2 w-full sm:w-auto mr-0 sm:mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out border-2 b-[#909090] rounded-3xl px-4 sm:px-6 py-3 text-center flex justify-center items-center ${activeorderstable ==='ambherorderstable' ? 'bg-[#238823] rounded-2xl' : ''}`}>
    <img src={ambherlogo} className="w-5 h-5"/>        
    <h1 className={`font-albertsans font-semibold text-sm sm:text-base ${activeorderstable ==='ambherorderstable' ? 'text-white' : 'text-[#1f1f1f]'}`}>Ambher Optical <span className="bg-gray-200 text-gray-500 font-semibold px-2 rounded-full ml-2 text-sm"> {ambherOrders.length} </span></h1>
  </div>
  <div onClick={() => showorderstable('bautistaorderstable')} className={`gap-2 w-full sm:w-auto ml-0 sm:ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out border-2 b-[#909090] rounded-3xl px-4 sm:px-6 py-3 text-center flex justify-center items-center ${activeorderstable ==='bautistaorderstable' ? 'bg-sky-600 rounded-2xl' : ''}`}>
    <img src={bautistalogo} className="w-5 h-5"/>        
    <h1 className={`font-albertsans font-semibold text-sm sm:text-base ${activeorderstable ==='bautistaorderstable' ? 'text-white' : 'text-[#1f1f1f]'}`}>Bautista Eye Center <span className="bg-gray-200 text-gray-500 font-semibold px-2 rounded-full ml-2 text-sm"> {bautistaOrders.length} </span></h1>
  </div>
  
  </div>


                




          { activeorderstable === 'ambherorderstable' && ( <div id="ambherorderstable" className="p-2 animate-fadeInUp flex flex-col lg:flex-row items-start w-full min-h-[80] h-auto rounded-2xl mt-5" >
                <div className="p-3 rounded-2xl w-full lg:w-[20%] h-auto mr-0 lg:mr-2 mb-4 lg:mb-0 overflow-y-auto overflow-x-hidden">
                <div className="pb-3 flex items-center w-full mt-2 lg:mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by status</h1></div>

                <div className="flex flex-row lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
                {['All', 'Pending', 'Ready for Pickup', 'Completed'].map(status => {
                    const patientorderedstatusCount = status === 'All'  ? ambherOrders.length : ambherOrders.filter(order => order.patientorderambherstatus === status).length; 
                    
                    // Color themes for each status
                    const getStatusColors = (status, isActive) => {
                      switch(status) {
                        case 'All':
                          return isActive 
                            ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-600 shadow-lg' 
                            : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400';
                        case 'Pending':
                          return isActive 
                            ? 'bg-yellow-800 text-white border-orange-500 shadow-lg' 
                            : 'border-orange-300 hover:bg-orange-50 hover:border-orange-400';
                        case 'Ready for Pickup':
                          return isActive 
                            ? 'bg-sky-800 text-white border-blue-500 shadow-lg' 
                            : 'border-blue-300 hover:bg-blue-50 hover:border-blue-400';
                        case 'Completed':
                          return isActive 
                            ? 'bg-green-700 text-white border-green-500 shadow-lg' 
                            : 'border-green-300 hover:bg-green-50 hover:border-green-400';
                        default:
                          return 'border-gray-300 hover:bg-gray-50';
                      }
                    };
  
                    return (
                       <div key={status} onClick={() => {setfilterambherorderedproductsStatus(status); setsearchpatientorderedProducts('');}} className={`mt-0 lg:mt-3 rounded-2xl transition-all duration-300 ease-in-out border-2 py-2 px-3 lg:px-2 text-center flex justify-center items-center whitespace-nowrap lg:whitespace-normal cursor-pointer ${getStatusColors(status, filterambherorderedproductsStatus === status)}`} >
                        <h1 className={`font-albertsans font-semibold text-sm lg:text-base ${filterambherorderedproductsStatus === status ? 'text-white' : 'text-[#1f1f1f]'}`}>{status} <span className={`font-semibold px-2 rounded-full ml-2 text-sm ${filterambherorderedproductsStatus === status ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}> {patientorderedstatusCount} </span> </h1>  </div>
                        );})}
                </div>

          </div>
          <div className="flex flex-col justify-start items-start ml-0 lg:ml-2 rounded-2xl w-full lg:w-[80%] min-h-[540px] max-h-auto h-auto shadow-b-lg">
              <div className="ml-2 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-0 w-full"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-0 sm:mr-3">Search: </h2><div className="relative flex items-center justify-center gap-3 w-full sm:w-auto"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input value={searchpatientorderedProducts} onChange={(e) => handleSearch(e.target.value)} type="text" placeholder="Enter ordered product name here..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full sm:w-250 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
              <div className="mt-5 w-full rounded-2xl h-auto grid grid-cols-1 gap-3 px-2 pt-2">{/* Changed to responsive grid layout */}
                      
                      
                      {loading ? (
                        <OrderListSkeleton />
                      ) : filteredambherOrders.length === 0 ? (
                        <div>No orders found</div>
                      ) : (
                        filteredambherOrders.map(order => (

                  <div key={order.patientorderambherid} onClick={() => handleViewOrder(order)} className="pb-7 shadow-md rounded-2xl py-3.25 px-3.25 flex flex-col sm:flex-row items-start sm:items-center motion-preset-slide-up w-full h-auto cursor-pointer hover:shadow-lg transition-all duration-300">
                   <img src={order.patientorderambherproductimage?.[0] || 'default-image-url'} alt={order.patientorderambherproductname} className="mr-0 sm:mr-5 w-full sm:w-35 h-48 sm:h-35 rounded-2xl object-cover mb-4 sm:mb-0"/>
                    <div className="mt-2 h-auto w-full flex flex-col items-start">
                        <div className="flex flex-col sm:flex-row sm:justify-between w-full items-start sm:items-center gap-2 sm:gap-0">
                          <h1 className="font-semibold font-albertsans text-lg sm:text-[20px] text-[#1f1f1f]">{order.patientorderambherproductname}</h1> 
                          <span className={`${formatorderstatusColor(order.patientorderambherstatus)} ml-0 sm:ml-3 font-albertsans font-semibold rounded-full text-sm sm:text-[15px] leading-5 px-3 sm:px-4 py-1 sm:py-2 inline-flex self-start sm:self-center`}>{order.patientorderambherstatus}</span> 
                        </div>
                        <div className="mt-5 justify-between w-full grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:items-center text-[#323232] font-semibold text-[13px]">
                          <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5 font-semibold text-lg sm:text-[22px]"/><div><p className="text-[#777777] font-medium text-xs sm:text-[13px]">Date Ordered</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">{formatorderDates(order.createdAt)}</p></div></div>
                          <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5 font-semibold text-lg sm:text-[22px]"/><div><p className="text-[#777777] font-medium text-xs sm:text-[13px]">Pickup at Ambher Optical</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">{order.patientorderambherproductpickupstatus === 'Now'  ? `Completed (${formatorderDates(order.createdAt)})` : order.patientorderambherproductchosenpickupdate && order.patientorderambherproductchosenpickupdate !== 'Later' && order.patientorderambherproductchosenpickupdate !== 'Now' ? `Available for Pickup: ${formatorderDates(order.patientorderambherproductchosenpickupdate)}` : "To be scheduled"}</p></div></div>
                          <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-package mt-0.5 font-semibold text-lg sm:text-[22px]"/><div><p className="text-[#777777] font-medium text-xs sm:text-[13px]">Quantity</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">x{order.patientorderambherproductquantity}</p></div></div>
                          <div className="flex items-center gap-1"><p className="font-semibold text-lg sm:text-[22px] text-[#565656]">₱</p><div> <p className="text-[#777777] font-medium text-xs sm:text-[13px]">{Number(order.patientorderambheramountpaid) < Number(order.patientorderambherproducttotal) ? (<span className="px-1 py-.5 bg-yellow-100 text-yellow-900 font-alberstans rounded-md">Down Payment</span> ): "Amount Paid"}</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">{Number(order.patientorderambheramountpaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div></div>
                        </div>
                        <div className="flex items-center justify-between border-t-2 w-full h-10 mt-5">
                          <div></div>
                          <div className="flex items-center gap-3 mt-5 h-auto"><h1 className="font-semibold font-albertsans text-[#343434] text-base sm:text-[17px]">Total Price: </h1><p className="font-semibold font-albertsans text-xl sm:text-[25px] text-[#549013]">₱{(order.patientorderambherproductprice * order.patientorderambherproductquantity).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div>
                        </div>
                    </div>
                  </div>
                        ))
                      )}
                  
              

              </div>
          </div>

          </div>

          )}


          { activeorderstable === 'bautistaorderstable' && ( <div id="bautistaorderstable" className="p-2 animate-fadeInUp flex flex-col lg:flex-row items-start w-full h-auto lg:h-[83%] rounded-2xl mt-5" >

              <div className="p-3 rounded-2xl w-full lg:w-[20%] h-auto mr-0 lg:mr-2 mb-4 lg:mb-0 overflow-y-auto overflow-x-hidden">
                <div className="pb-3 flex items-center w-full mt-2 lg:mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by status</h1></div>

                <div className="flex flex-row lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
                {['All', 'Pending', 'Ready for Pickup', 'Completed'].map(status => {
                    const patientorderedstatusCount = status === 'All'  ? bautistaOrders.length : bautistaOrders.filter(order => order.patientorderbautistastatus === status).length; 
                    
                    // Color themes for each status
                    const getStatusColors = (status, isActive) => {
                      switch(status) {
                        case 'All':
                          return isActive 
                            ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-600 shadow-lg' 
                            : 'border-slate-300 hover:bg-slate-50 hover:border-slate-400';
                        case 'Pending':
                          return isActive 
                            ? 'bg-yellow-800 text-white border-orange-500 shadow-lg' 
                            : 'border-orange-300 hover:bg-orange-50 hover:border-orange-400';
                        case 'Ready for Pickup':
                          return isActive 
                            ? 'bg-sky-800 text-white border-blue-500 shadow-lg' 
                            : 'border-blue-300 hover:bg-blue-50 hover:border-blue-400';
                        case 'Completed':
                          return isActive 
                            ? 'bg-green-700 text-white border-green-500 shadow-lg' 
                            : 'border-green-300 hover:bg-green-50 hover:border-green-400';
                        default:
                          return 'border-gray-300 hover:bg-gray-50';
                      }
                    };
  
                    return (
                       <div key={status} onClick={() => {setfilterbautistaorderedproductsStatus(status); setsearchpatientorderedProducts('');}} className={`mt-0 lg:mt-3 rounded-2xl transition-all duration-300 ease-in-out border-2 py-2 px-3 lg:px-2 text-center flex justify-center items-center whitespace-nowrap lg:whitespace-normal cursor-pointer ${getStatusColors(status, filterbautistaorderedproductsStatus === status)}`} >
                        <h1 className={`font-albertsans font-semibold text-sm lg:text-base ${filterbautistaorderedproductsStatus === status ? 'text-white' : 'text-[#1f1f1f]'}`}>{status} <span className={`font-semibold px-2 rounded-full ml-2 text-sm ${filterbautistaorderedproductsStatus === status ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}> {patientorderedstatusCount} </span> </h1>  </div>
                        );})}
                </div>

          </div>
          <div className="flex flex-col justify-start items-start ml-0 lg:ml-2 rounded-2xl w-full lg:w-[80%] min-h-[540px] max-h-auto h-auto shadow-b-lg">
              <div className="ml-2 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-0 w-full"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-0 sm:mr-3">Search: </h2><div className="relative flex items-center justify-center gap-3 w-full sm:w-auto"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input value={searchpatientorderedProducts}  onChange={(e) => handleSearch(e.target.value)}  type="text" placeholder="Enter ordered product name here..."   className="transition-all duration-300 ease-in-out py-2 pl-10 w-full sm:w-250 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
              <div className="mt-5 w-full rounded-2xl h-auto grid grid-cols-1 gap-3 px-2 pt-2">{/* Changed to responsive grid layout */}
                      
                      
                      {loading ? (
                        <OrderListSkeleton />
                      ) : filteredbautistaOrders.length === 0 ? (
                        <div>No orders found</div>
                      ) : (
                        filteredbautistaOrders.map(order => (

                  <div key={order.patientorderbautistaid} onClick={() => handleViewOrder(order)} className="pb-7 shadow-md rounded-2xl py-3.25 px-3.25 flex flex-col sm:flex-row items-start sm:items-center motion-preset-slide-up w-full h-auto cursor-pointer hover:shadow-lg transition-all duration-300">
                    <img src={order.patientorderbautistaproductimage?.[0] || 'default-image-url'} alt={order.patientorderbautistaproductname} className="mr-0 sm:mr-5 w-full sm:w-35 h-48 sm:h-35 rounded-2xl object-cover mb-4 sm:mb-0"/>
                    <div className="mt-2 h-auto w-full flex flex-col items-start">
                        <div className="flex flex-col sm:flex-row sm:justify-between w-full items-start sm:items-center gap-2 sm:gap-0">
                          <h1 className="font-semibold font-albertsans text-lg sm:text-[20px] text-[#1f1f1f]">{order.patientorderbautistaproductname}</h1> 
                          <span className={`${formatorderstatusColor(order.patientorderbautistastatus)} ml-0 sm:ml-3 font-albertsans font-semibold rounded-full text-sm sm:text-[15px] leading-5 px-3 sm:px-4 py-1 sm:py-2 inline-flex self-start sm:self-center`}>{order.patientorderbautistastatus}</span>
                        </div>
                        <div className="mt-5 justify-between w-full grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-0 sm:flex sm:items-center text-[#323232] font-semibold text-[13px]">
                          <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5 font-semibold text-lg sm:text-[22px]"/><div><p className="text-[#777777] font-medium text-xs sm:text-[13px]">Date Ordered</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">{formatorderDates(order.createdAt)}</p></div></div>
                          <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5 font-semibold text-lg sm:text-[22px]"/><div><p className="text-[#777777] font-medium text-xs sm:text-[13px]">Pickup at Bautista Eye Center</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">{order.patientorderbautistaproductpickupstatus === 'Now'  ? `Completed (${formatorderDates(order.createdAt)})` : order.patientorderbautistaproductchosenpickupdate && order.patientorderbautistaproductchosenpickupdate !== 'Later' && order.patientorderbautistaproductchosenpickupdate !== 'Now' ? `Available for Pickup: ${formatorderDates(order.patientorderbautistaproductchosenpickupdate)}` : "To be scheduled"}</p></div></div>
                          <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-package mt-0.5 font-semibold text-lg sm:text-[22px]"/><div><p className="text-[#777777] font-medium text-xs sm:text-[13px]">Quantity</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">x{order.patientorderbautistaproductquantity}</p></div></div>
                          <div className="flex items-center gap-1"><p className="font-semibold text-lg sm:text-[22px] text-[#565656]">₱</p><div> <p className="text-[#777777] font-medium text-xs sm:text-[13px]">{Number(order.patientorderbautistaamountpaid) < Number(order.patientorderbautistaproducttotal) ? (<span className="px-1 py-.5 bg-yellow-100 text-yellow-900 font-alberstans rounded-md">Down Payment</span> ): "Amount Paid"}</p><p className="text-[#303030] font-semibold text-sm sm:text-[15px]">{Number(order.patientorderbautistaamountpaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div></div>
                        </div>
                        <div className="flex items-center justify-between border-t-2 w-full h-10 mt-5">
                          <div></div>
                          <div className="flex items-center gap-3 mt-5 h-auto"><h1 className="font-semibold font-albertsans text-[#343434] text-base sm:text-[17px]">Total Price: </h1><p className="font-semibold font-albertsans text-xl sm:text-[25px] text-[#549013]">₱{(order.patientorderbautistaproductprice * order.patientorderbautistaproductquantity).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div>
                        </div>
                    </div>
                  </div>
                        ))
                      )}
                   
              

              </div>
          </div>

          </div>)}


        {/* View Order Modal */}
        {showViewOrderModal && selectedOrderForView && (
          <div className="fixed inset-0 bg-[#000000b1] flex justify-center z-20 ">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[160vh] overflow-y-auto shadow-2xl mt-20">
              <div className="sticky z-99 top-0 bg-white border-b px-8 py-6 flex justify-between items-center rounded-t-2xl">
                    <div className="flex justify-center items-center">
                      <img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all p-1" />
                      <h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Billing Details</h1>
                    </div>
                <div className="flex items-center gap-4">
                  {(() => {
                    const orderStatus = selectedOrderForView.patientorderambherid 
                      ? selectedOrderForView.patientorderambherstatus 
                      : selectedOrderForView.patientorderbautistastatus;
                    
                    return orderStatus === 'Completed' && (
                      <div
                        onClick={() => exportBillingToPDF(selectedOrderForView)}
                        className="bg-[#184d85] hover:bg-[#0f3a6b] text-white px-6 py-3 rounded-lg font-medium font-albertsans transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <i className="bx bx-download text-lg"></i>
                        Export PDF
                      </div>
                    );
                  })()}
                  <div 
                    onClick={closeViewOrderModal}
                    className="cursor-pointer text-gray-500 hover:text-black text-[50px]"
                  >
                    ×
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                {(() => {
                  const isAmbher = selectedOrderForView.patientorderambherid;
                  const productName = isAmbher 
                    ? selectedOrderForView.patientorderambherproductname 
                    : selectedOrderForView.patientorderbautistaproductname;
                  const productImages = isAmbher 
                    ? selectedOrderForView.patientorderambherproductimage 
                    : selectedOrderForView.patientorderbautistaproductimage;
                  const productPrice = isAmbher 
                    ? selectedOrderForView.patientorderambherproductprice 
                    : selectedOrderForView.patientorderbautistaproductprice;
                  const productQuantity = isAmbher 
                    ? selectedOrderForView.patientorderambherproductquantity 
                    : selectedOrderForView.patientorderbautistaproductquantity;
                  const orderStatus = isAmbher 
                    ? selectedOrderForView.patientorderambherstatus 
                    : selectedOrderForView.patientorderbautistastatus;
                  const amountPaid = isAmbher 
                    ? selectedOrderForView.patientorderambheramountpaid 
                    : selectedOrderForView.patientorderbautistaamountpaid;
                  const productTotal = isAmbher 
                    ? selectedOrderForView.patientorderambherproducttotal 
                    : selectedOrderForView.patientorderbautistaproducttotal;
                  const pickupStatus = isAmbher 
                    ? selectedOrderForView.patientorderambherproductpickupstatus 
                    : selectedOrderForView.patientorderbautistaproductpickupstatus;
                  const pickupDate = isAmbher 
                    ? selectedOrderForView.patientorderambherproductchosenpickupdate 
                    : selectedOrderForView.patientorderbautistaproductchosenpickupdate;
                  const orderNotes = isAmbher 
                    ? selectedOrderForView.patientorderambherproductnotes 
                    : selectedOrderForView.patientorderbautistaproductnotes;
                  const clinic = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
                  const clinicaddress = isAmbher
            ? selectedOrderForView.patientorderambherproductchosenpickupplace
            : selectedOrderForView.patientorderbautistaproductchosenpickupplace;

                  return (
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                      {/* Product Images - Takes 3 columns (Left side, wider) */}
                      <div className="xl:col-span-3 xl:order-1 space-y-6">
                        <div className="flex items-center">
                          <i className="bx bx-image text-3xl text-gray-600 mr-3"></i>
                          <h3 className="text-xl font-semibold font-albertsans text-gray-800">Product Images</h3>
                        </div>
                        {productImages && productImages.length > 0 ? (
                          <div className="relative">
                            <img 
                              src={productImages[viewOrderCurrentImageIndex]} 
                              alt={productName}
                              className="w-full h-96 object-cover rounded-xl border border-gray-200 shadow-lg"
                            />
                            
                            {productImages && productImages.length > 1 && (
                              <>
                                <div
                                  onClick={prevViewOrderImage}
                                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-400 cursor-pointer bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 shadow-lg transition-all"
                                >
                                  <i className="bx bx-chevron-left text-xl text-white"></i>
                                </div>
                                <div 
                                  onClick={nextViewOrderImage}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-400 cursor-pointer bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 shadow-lg transition-all"
                                >
                                  <i className="bx bx-chevron-right text-xl text-white"></i>
                                </div>
                                
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-400 bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                  {viewOrderCurrentImageIndex + 1} / {productImages.length}
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 shadow-lg">
                            <div className="text-center">
                              <i className="bx bx-image text-6xl text-gray-400 mb-3"></i>
                              <span className="text-gray-500 text-lg">No image available</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Image thumbnails */}
                        {productImages && productImages.length > 1 && (
                          <div className="flex space-x-3 overflow-x-auto py-2">
                            {productImages.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${productName} ${index + 1}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-3 transition-all shadow-md hover:shadow-lg ${
                                  index === viewOrderCurrentImageIndex ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setViewOrderCurrentImageIndex(index)}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Billing Information - Takes 2 columns (Right side, smaller) */}
                      <div className="xl:col-span-2 xl:order-2 space-y-6">
                        <div className={`p-6 rounded-xl border ${isAmbher ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                          <div className="flex items-center mb-6">
                            <i className={`bx bx-credit-card text-2xl mr-3 ${isAmbher ? 'text-green-600' : 'text-blue-600'}`}></i>
                            <h3 className="text-xl font-bold font-albertsans text-gray-800">Payment Summary</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                              <span className="text-black font-medium font-albertsans">Item:</span>
                              <span className="font-semibold font-albertsans text-gray-800 text-sm text-right">{productName}</span>
                            </div>
                            <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                              <span className="text-black font-medium font-albertsans">Unit Price:</span>
                              <span className="font-semibold font-albertsans">₱{Number(productPrice).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                            <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                              <span className="text-black font-medium font-albertsans">Quantity:</span>
                              <span className="font-semibold font-albertsans">x{productQuantity}</span>
                            </div>
                            <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                              <span className="text-black font-medium font-albertsans">Subtotal:</span>
                              <span className="font-semibold font-albertsans">₱{(Number(productPrice) * Number(productQuantity)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </div>
                            
                            <div className={`bg-white p-5 rounded-lg border shadow-sm ${isAmbher ? 'border-green-300' : 'border-blue-300'}`}>
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-black font-medium font-albertsans text-sm">
                                  {Number(amountPaid) < Number(productTotal) ? 'Down Payment:' : 'Amount Paid:'}
                                </span>
                                <span className="font-bold font-albertsans text-[#5c5c5c] text-lg">₱{Number(amountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                              </div>
                              
                              {Number(amountPaid) < Number(productTotal) && (
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-black font-medium font-albertsans text-sm">Remaining Balance:</span>
                                  <span className="font-bold font-albertsans text-[#c53636] text-lg">₱{(Number(productTotal) - Number(amountPaid)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                              )}
                              
                              <div className="border-t-2 border-gray-300 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-bold font-albertsans text-gray-800">Total Amount:</span>
                                  <span className={`text-2xl font-bold font-albertsans ${isAmbher ? 'text-[#23a54a]' : 'text-[#23a54a]'}`}>₱{(Number(productPrice) * Number(productQuantity)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-center pt-3">
                              <span className={`${formatorderstatusColor(orderStatus)} px-4 py-2 rounded-full text-sm font-bold font-albertsans`}>
                                Payment Status: {orderStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Information */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <div className="flex items-center mb-6">
                            <i className="bx bx-info-circle text-2xl text-gray-600 mr-3"></i>
                            <h3 className="text-lg font-bold font-albertsans text-gray-800">Order Information</h3>
                          </div>
                          
                          {/* Order Overview Card */}
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-4">
                            <div className="grid grid-cols-1 gap-4">
                              {/* Order ID & Status */}
                              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans mb-1">Order ID</p>
                                  <p className="font-semibold font-albertsans text-gray-800">#{isAmbher ? selectedOrderForView.patientorderambherid : selectedOrderForView.patientorderbautistaid}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans mb-1">Status</p>
                                  <span className={`${formatorderstatusColor(orderStatus)} px-3 py-1 rounded-full text-xs font-bold font-albertsans`}>
                                    {orderStatus}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Clinic & Date */}
                              <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                                    <i className="bx bxs-clinic text-blue-600 text-lg"></i>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans">Clinic</p>
                                    <p className="font-semibold font-albertsans text-gray-800">{clinic}</p>
                                  </div>
                                </div>

                         <div className="flex items-start">
                          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-3 flex-shrink-0">
                            <i className="bx bx-map text-red-600 text-lg"></i>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans">Clinic Address</p>
                            <p className="font-semibold font-albertsans text-gray-800 text-sm leading-relaxed">{clinicaddress}</p>
                          </div>
                        </div>


                                
                                <div className="flex items-center">
                                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mr-3">
                                    <i className="bx bxs-calendar text-green-600 text-lg"></i>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans">Order Date</p>
                                    <p className="font-semibold font-albertsans text-gray-800">{formatorderDates(selectedOrderForView.createdAt)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Pickup Information Card */}
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-4">
                            <div className="flex items-center mb-3">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${
                                pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now' && pickupStatus !== 'Now' 
                                  ? 'bg-green-100' 
                                  : 'bg-orange-100'
                              }`}>
                                <i className={`bx bxs-truck text-lg ${
                                  pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now' && pickupStatus !== 'Now' 
                                    ? 'text-green-600' 
                                    : 'text-orange-600'
                                }`}></i>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans">Pickup Status</p>
                                <p className="font-semibold font-albertsans text-gray-800">
                                  {pickupStatus === 'Now' 
                                    ? `Completed (${formatorderDates(selectedOrderForView.createdAt)})`
                                    : pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now'
                                      ? "Available for Pickup Date"
                                      : pickupStatus === 'Later' 
                                        ? "To be scheduled"
                                        : pickupStatus
                                  }
                                </p>
                              </div>
                            </div>
                            
                            {pickupStatus === 'Later' && (!pickupDate || pickupDate === 'Later') && (
                              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center">
                                  <i className="bx bx-time text-yellow-600 mr-2"></i>
                                  <p className="text-sm text-yellow-800 font-albertsans">
                                    <span className="font-medium">Pickup scheduling:</span> The {clinic} will set the pickup date and will be displayed here.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now' && pickupStatus !== 'Now' && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                  <i className="bx bx-calendar-check text-green-600 mr-2"></i>
                                  <p className="text-sm text-green-800 font-albertsans">
                                    <span className="font-medium">Available for Pickup:</span> Your order is available for pickup on {formatorderDates(pickupDate)}.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Order Notes Card */}
                          {orderNotes && (
                            <div className={`p-5 rounded-xl border shadow-sm ${isAmbher ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                              <div className="flex items-center mb-3">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${isAmbher ? 'bg-green-100' : 'bg-blue-100'}`}>
                                  <i className={`bx bxs-note text-lg ${isAmbher ? 'text-green-600' : 'text-blue-600'}`}></i>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium font-albertsans">Special Instructions</p>
                                  <p className="font-semibold font-albertsans text-gray-800">Order Notes</p>
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-black whitespace-pre-wrap text-sm leading-relaxed font-albertsans">{orderNotes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}




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
   )
  }
        
export default PatientOrders