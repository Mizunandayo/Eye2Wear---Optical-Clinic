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

  // Add CSS animation for spinner
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);


  
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
const [isExportingPDF, setIsExportingPDF] = useState(false);


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

  // Modern PDF Export function using Puppeteer backend
  const exportBillingToPDF = async (orderData) => {
    setIsExportingPDF(true);
    try {
      // Determine if it's Ambher or Bautista order
      const isAmbher = orderData.patientorderambherid;
      
      // Extract order details
      const orderId = isAmbher ? orderData.patientorderambherid : orderData.patientorderbautistaid;
      const orderStatus = isAmbher ? orderData.patientorderambherstatus : orderData.patientorderbautistastatus;
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
      const customFee = isAmbher 
        ? orderData.patientorderambhercustomfee 
        : orderData.patientorderbautistacustomfee;
      const discountPercentage = isAmbher 
        ? orderData.patientorderambherdiscount 
        : orderData.patientorderbautistadiscount;
      const discountAmount = isAmbher 
        ? orderData.patientorderambherdiscountamount 
        : orderData.patientorderbautistadiscountamount;
      const paymentMethod = isAmbher
        ? orderData.patientorderambherproductpaymentmethod
        : orderData.patientorderbautistaproductpaymentmethod;
      const paymentHistory = isAmbher
        ? orderData.patientorderambherpaymenthistory || []
        : orderData.patientorderbautistapaymenthistory || [];
      
      // Debug: Log payment history
      console.log('📊 Payment History for PDF:', paymentHistory);
      console.log('📊 Number of payments:', paymentHistory.length);
      
      const clinic = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
      const clinicAddress = isAmbher
        ? orderData.patientorderambherproductchosenpickupplace
        : orderData.patientorderbautistaproductchosenpickupplace;
      const customerName = `${orderData.patientfirstname} ${orderData.patientlastname}`;
      const customerEmail = orderData.patientemail;
      const orderDate = formatorderDates(orderData.createdAt);
      const orderNotes = isAmbher 
        ? orderData.patientorderambherproductnotes 
        : orderData.patientorderbautistaproductnotes;

      // Calculate payment details
      const hasDownpayment = Number(amountPaid) < Number(productTotal);
      const remainingBalance = Number(productTotal) - Number(amountPaid);
      const subtotal = Number(productPrice) * Number(productQuantity);
      const tinNumber = isAmbher ? 'TIN: 123-456-789-001' : 'TIN: 987-654-321-002';
      
      // Format payment history rows - ensure all payments are shown
      let paymentHistoryRows = '';
      let runningTotal = 0;
      
      // Check if we have payment history array with data
      if (paymentHistory && paymentHistory.length > 0) {
        // Use payment history from database
        paymentHistory.forEach((payment, index) => {
          runningTotal += Number(payment.amount);
          const paymentDate = new Date(payment.paymentDate);
          const formattedDateTime = paymentDate.toLocaleString('en-PH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
          });
          
          paymentHistoryRows += `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 6px 4px; font-size: 10px; color: #333;">${index + 1}</td>
              <td style="padding: 6px 4px; font-size: 10px; color: #333;">${payment.paymentType || 'Payment'}</td>
              <td style="padding: 6px 4px; font-size: 10px; color: #333;">${formattedDateTime}</td>
              <td style="padding: 6px 4px; text-align: right; font-size: 10px; font-weight: 600; color: #000;">₱${Number(payment.amount).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td style="padding: 6px 4px; font-size: 10px; color: #333;">${payment.processedBy || 'System'}</td>
            </tr>
          `;
        });
      } else if (amountPaid > 0) {
        // Fallback: If no payment history array but there's an amount paid, show it
        runningTotal = Number(amountPaid);
        const formattedDateTime = new Date(orderData.createdAt).toLocaleString('en-PH', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Manila'
        });
        
        paymentHistoryRows += `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 6px 4px; font-size: 10px; color: #333;">1</td>
            <td style="padding: 6px 4px; font-size: 10px; color: #333;">Initial Payment</td>
            <td style="padding: 6px 4px; font-size: 10px; color: #333;">${formattedDateTime}</td>
            <td style="padding: 6px 4px; text-align: right; font-size: 10px; font-weight: 600; color: #000;">₱${Number(amountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td style="padding: 6px 4px; font-size: 10px; color: #333;">System</td>
          </tr>
        `;
      }
      
      // Build payment history section HTML - show if there's payment history OR any amount paid
      const paymentHistorySection = (paymentHistory && paymentHistory.length > 0) || amountPaid > 0 ? `
        <div style="margin-top: 25px;">
          <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 12px;">
            <h3 style="color: #000; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              Payment History
            </h3>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="border-bottom: 1px solid #ddd;">
                <th style="padding: 6px 4px; text-align: left; font-weight: 600; color: #555;">#</th>
                <th style="padding: 6px 4px; text-align: left; font-weight: 600; color: #555;">Type</th>
                <th style="padding: 6px 4px; text-align: left; font-weight: 600; color: #555;">Date & Time</th>
                <th style="padding: 6px 4px; text-align: right; font-weight: 600; color: #555;">Amount</th>
                <th style="padding: 6px 4px; text-align: left; font-weight: 600; color: #555;">Processed By</th>
              </tr>
            </thead>
            <tbody>
              ${paymentHistoryRows}
            </tbody>
            <tfoot>
              <tr style="border-top: 1px solid #000;">
                <td colspan="3" style="padding: 8px 4px; text-align: right; font-weight: 700; font-size: 11px;">TOTAL PAID:</td>
                <td style="padding: 8px 4px; text-align: right; font-weight: 700; font-size: 11px;">₱${runningTotal.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ` : '';
      
      // Determine status badge
      const statusBadge = remainingBalance <= 0 
        ? `<div style="border: 2px solid #10b981; color: #10b981; padding: 8px 20px; display: inline-block; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">✓ Fully Paid</div>`
        : `<div style="border: 2px solid #dc2626; color: #dc2626; padding: 8px 20px; display: inline-block; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">⚠ Partial Payment</div>`;
      
      // Create modern HTML receipt
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
              
              .receipt-container {
                max-width: 700px;
                margin: 0 auto;
                background: white;
              }
              
              .receipt-header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 15px;
                margin-bottom: 20px;
              }
              
              .receipt-header h1 {
                font-size: 16px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
              }
              
              .clinic-name {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 4px;
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
              
              .receipt-body {
                padding: 0;
              }
              
              .receipt-info {
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
              
              .customer-section {
                background: #fafafa;
                padding: 12px 15px;
                margin-bottom: 20px;
                border-left: 3px solid #000;
              }
              
              .customer-section h3 {
                color: #000;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 6px;
              }
              
              .customer-section p {
                color: #333;
                font-size: 11px;
                margin: 2px 0;
              }
              
              .products-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 11px;
              }
              
              .products-table thead {
                border-bottom: 2px solid #000;
              }
              
              .products-table th {
                padding: 8px 6px;
                text-align: left;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                color: #000;
              }
              
              .products-table td {
                padding: 12px 6px;
                border-bottom: 1px solid #eee;
                font-size: 11px;
                color: #333;
              }
              
              .products-table tbody tr:last-child td {
                border-bottom: none;
              }
              
              .product-name {
                font-weight: 600;
                color: #000;
              }
              
              .notes-section {
                background: #fffbeb;
                border-left: 3px solid #f59e0b;
                padding: 10px 12px;
                margin: 15px 0;
                font-size: 10px;
              }
              
              .notes-section strong {
                color: #92400e;
                font-size: 9px;
                display: block;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.3px;
              }
              
              .notes-section p {
                color: #78350f;
                font-size: 10px;
                line-height: 1.4;
              }
              
              .totals-section {
                margin: 20px 0;
                padding: 15px 0;
                border-top: 1px solid #ddd;
                border-bottom: 2px solid #000;
              }
              
              .total-row {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                font-size: 11px;
              }
              
              .total-row.subtotal {
                color: #666;
              }
              
              .total-row.discount {
                color: #dc2626;
                font-weight: 600;
              }
              
              .total-row.grand-total {
                font-size: 14px;
                font-weight: 700;
                color: #000;
                border-top: 1px solid #000;
                padding-top: 10px;
                margin-top: 8px;
              }
              
              .remaining-balance {
                background: #fef2f2;
                border-left: 3px solid #dc2626;
                padding: 10px 12px;
                margin-top: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
              }
              
              .remaining-balance span:first-child {
                color: #991b1b;
                font-weight: 700;
              }
              
              .remaining-balance span:last-child {
                color: #dc2626;
                font-weight: 700;
                font-size: 13px;
              }
              
              .status-badge-container {
                text-align: center;
                margin: 25px 0;
              }
              
              .receipt-footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                margin-top: 20px;
              }
              
              .receipt-footer p {
                color: #666;
                font-size: 9px;
                margin: 4px 0;
              }
              
              .receipt-footer .thank-you {
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
            <div class="receipt-container">
              <!-- Header -->
              <div class="receipt-header">
                <h1>Official Receipt</h1>
                <div class="clinic-name">${clinic}</div>
                <div class="clinic-address">${clinicAddress}</div>
                <div class="tin-number">${tinNumber}</div>
              </div>
              
              <!-- Body -->
              <div class="receipt-body">
                <!-- Receipt Info -->
                <div class="receipt-info">
                  <div class="info-group">
                    <h4>Receipt No</h4>
                    <p>#${orderId}</p>
                  </div>
                  <div class="info-group">
                    <h4>Date</h4>
                    <p>${orderDate}</p>
                  </div>
                  <div class="info-group">
                    <h4>Status</h4>
                    <p>${orderStatus}</p>
                  </div>

                </div>
                
                <!-- Customer Info -->
                <div class="customer-section">
                  <h3>Bill To</h3>
                  <p style="font-weight: 600;">${customerName}</p>
                  <p>${customerEmail}</p>
                </div>
                
                <!-- Products Table -->
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style="text-align: center; width: 60px;">Qty</th>
                      <th style="text-align: right; width: 100px;">Unit Price</th>
                      <th style="text-align: right; width: 100px;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="product-name">${productName}</td>
                      <td style="text-align: center;">${productQuantity}</td>
                      <td style="text-align: right;">₱${Number(productPrice).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td style="text-align: right; font-weight: 600;">₱${subtotal.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  </tbody>
                </table>
                
                ${orderNotes && orderNotes.trim() ? `
                <div class="notes-section">
                  <strong>Order Notes</strong>
                  <p>${orderNotes}</p>
                </div>
                ` : ''}
                
                <!-- Totals -->
                <div class="totals-section">
                  <div class="total-row subtotal">
                    <span>Subtotal</span>
                    <span>₱${subtotal.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  ${customFee > 0 ? `
                  <div class="total-row subtotal">
                    <span>Custom Fee</span>
                    <span>₱${Number(customFee).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  ` : ''}
                  ${discountPercentage > 0 ? `
                  <div class="total-row discount">
                    <span>Discount (${discountPercentage}%)</span>
                    <span>-₱${Number(discountAmount).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  ` : ''}
                  <div class="total-row grand-total">
                    <span>TOTAL AMOUNT</span>
                    <span>₱${Number(productTotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  ${remainingBalance > 0 ? `
                  <div class="remaining-balance">
                    <span>Remaining Balance</span>
                    <span>₱${remainingBalance.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  ` : ''}
                </div>
                
                <!-- Payment History -->
                ${paymentHistorySection}
                
                <!-- Status Badge -->
                <div class="status-badge-container">
                  ${statusBadge}
                </div>
              </div>
              
              <!-- Footer -->
              <div class="receipt-footer">
                <p class="thank-you">Thank you for your business</p>
                <p>This is an official receipt generated by Eye2Wear Optical System</p>
                <p>Generated on: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Generate filename
      const statusText = orderStatus.replace(/\s+/g, '_');
      const fileName = `Receipt_${clinic.replace(/\s+/g, '_')}_Order_${orderId}_${statusText}_${customerName.replace(/\s+/g, '_')}.pdf`;

      // Send HTML to backend for PDF generation using Puppeteer
      const response = await fetch(`${apiUrl}/api/pdf/generate`, {
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
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
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
                          <div id="ambhertotalprice" className="flex items-center gap-3 mt-5 h-auto"><h1 className="font-semibold font-albertsans text-[#343434] text-base sm:text-[17px]">Total Price: </h1><p className="font-semibold font-albertsans text-xl sm:text-[25px] text-[#549013]">₱{Number(order.patientorderambherproducttotal).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div>
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
                          <div id="bautistatotalprice" className="flex items-center gap-3 mt-5 h-auto"><h1 className="font-semibold font-albertsans text-[#343434] text-base sm:text-[17px]">Total Price: </h1><p className="font-semibold font-albertsans text-xl sm:text-[25px] text-[#549013]">₱{Number(order.patientorderbautistaproducttotal).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    onClick={() => exportBillingToPDF(selectedOrderForView)}
                    disabled={isExportingPDF}
                    style={{
                      backgroundColor: isExportingPDF ? '#9ca3af' : '#184d85',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      fontFamily: 'albertsans',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: 'none',
                      cursor: isExportingPDF ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!isExportingPDF) {
                        e.target.style.backgroundColor = '#0f3a6b';
                        e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isExportingPDF) {
                        e.target.style.backgroundColor = '#184d85';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                      }
                    }}
                  >
                    {isExportingPDF ? (
                      <>
                        <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-download" style={{ fontSize: '18px' }}></i>
                        Export PDF
                      </>
                    )}
                  </button>
                  <div 
                    onClick={closeViewOrderModal}
                    style={{ cursor: 'pointer', color: '#6b7280', fontSize: '50px', lineHeight: '1' }}
                    onMouseEnter={(e) => e.target.style.color = '#000000'}
                    onMouseLeave={(e) => e.target.style.color = '#6b7280'}
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
                  const customFee = isAmbher 
                    ? selectedOrderForView.patientorderambhercustomfee 
                    : selectedOrderForView.patientorderbautistacustomfee;
                  const discountPercentage = isAmbher 
                    ? selectedOrderForView.patientorderambherdiscount 
                    : selectedOrderForView.patientorderbautistadiscount;
                  const discountAmount = isAmbher 
                    ? selectedOrderForView.patientorderambherdiscountamount 
                    : selectedOrderForView.patientorderbautistadiscountamount;
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
                            
                            {/* Customization Fee */}
                            {customFee > 0 && (
                              <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                                <span className="text-black font-medium font-albertsans">Customization Fee:</span>
                                <span className="font-semibold font-albertsans">₱{Number(customFee).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                              </div>
                            )}
                            
                            {/* Discount */}
                            {discountPercentage > 0 && (
                              <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                                <span className="text-black font-medium font-albertsans">
                                  Discount ({discountPercentage}%):
                                </span>
                                <span className="font-semibold font-albertsans text-red-600">
                                  -₱{Number(discountAmount).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                              </div>
                            )}
                            
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
                                  <span className={`text-2xl font-bold font-albertsans ${isAmbher ? 'text-[#23a54a]' : 'text-[#23a54a]'}`}>₱{Number(productTotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
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