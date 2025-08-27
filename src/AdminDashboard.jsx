import React, { useState,useRef, useEffect, useCallback, useMemo } from "react";
import { Link} from "react-router-dom";
import landinglogo from "../src/assets/images/landinglogo.png";
import { useAuth as useAdminAuth} from "./hooks/adminuseAuth";
import { useAuth as useStaffAuth} from "./hooks/staffuseAuth";
import { useAuth as useOwnerAuth} from "./hooks/owneruseAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bautistalogo from"../src/assets/images/bautistalogo.png";
import ambherlogo from"../src/assets/images/ambherlogo.png";
import defaultprofilepic from '../src/assets/images/defaulticon.png'
import imageCompression from "browser-image-compression";
import darklogo from "../src/assets/images/darklogo.png";
import addimage from "../src/assets/images/addimage.png";
import axios from "axios";
import { GenderBoxAdminDash } from "./components/GenderBoxAdminDash";
import { OwnerClinicBox } from "./components/OwnerClinicBox";
import {OwnereyespecialistYesorNoBox} from "./components/OwnereyespecialistYesorNoBox";
import { StaffeyespecialistYesorNoBox } from "./components/StaffeyespecialistYesorNoBox";
import { BautistaeyespecialistBox } from "./components/BautistaeyespecialistBox";
import { AmbhereyespecialistBox } from "./components/AmbhereyespecialistBox";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import defaultimageplaceholder from "../src/assets/images/defaultimageplaceholder.png";
import { AmbherinventorycategoryBox } from "./components/AmbherinventorycategoryBox";
import { BautistainventorycategoryBox } from "./components/BautistainventorycategoryBox";
import cautionlowstockalert from "../src/assets/images/caution.png";
import starimage from "../src/assets/images/star.png";
import useSmartCache from './hooks/useSmartCache';
import { useImageOptimization } from './utils/imageOptimization';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';








// Disable Mapbox telemetry globally to prevent ERR_BLOCKED_BY_CLIENT errors
// Simple approach to prevent analytics requests that get blocked by ad blockers
if (typeof window !== 'undefined') {
  // Block fetch requests to analytics endpoints
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && (
        url.includes('events.mapbox.com') || 
        url.includes('analytics.mapbox.com') ||
        url.includes('telemetry') ||
        url.includes('/events/v2')
      )) {
      console.log('🚫 Blocked fetch telemetry request:', url);
      // Return a resolved promise to prevent errors
      return Promise.resolve(new Response('{}', { status: 200, statusText: 'OK' }));
    }
    return originalFetch.call(this, url, options);
  };
}

// Add essential CSS for Mapbox functionality that can't be replaced with Tailwind
const mapStyles = document.createElement('style');
mapStyles.textContent = `
  /* Essential Mapbox functionality CSS */
  .mapboxgl-ctrl-directions {
    display: none !important;
  }

  /* Make waypoints non-draggable and non-interactive */
  .mapbox-directions-waypoint,
  .mapbox-directions-waypoint-0,
  .mapbox-directions-waypoint-1 {
    pointer-events: none !important;
    cursor: default !important;
  }

  /* Disable interaction with route line */
  .mapbox-directions-route-line,
  .mapbox-directions-route-line-alt {
    pointer-events: none !important;
  }

  /* Route line styling */
  .mapbox-directions-route-line {
    line-color: #2781af;
    line-width: 5;
    line-opacity: 0.8;
  }

  .mapbox-directions-route-line-alt {
    line-color: #94a3b8;
    line-width: 3;
    line-opacity: 0.6;
  }

  /* Essential fullscreen functionality that can't be replaced with Tailwind */
  .mapboxgl-map:-webkit-full-screen,
  .mapboxgl-map:-moz-full-screen,
  .mapboxgl-map:fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    left: 0 !important;
    top: 0 !important;
    position: fixed !important;
    z-index: 999999 !important;
  }

  #geographicmapcontainer:-webkit-full-screen,
  #geographicmapcontainer:-moz-full-screen,
  #geographicmapcontainer:fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    left: 0 !important;
    top: 0 !important;
    position: fixed !important;
    z-index: 999999 !important;
    background: #000 !important;
  }

  body:-webkit-full-screen,
  body:-moz-full-screen,
  body:fullscreen {
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Directions panel fullscreen responsiveness */
  #geographicmapcontainer:-webkit-full-screen .directions-content,
  #geographicmapcontainer:-moz-full-screen .directions-content,
  #geographicmapcontainer:fullscreen .directions-content {
    max-height: calc(100vh - 120px) !important;
  }

  /* Mapbox Popup Styling */
  .mapboxgl-popup {
    z-index: 1000 !important;
    max-width: 320px !important;
  }

  .mapboxgl-popup-content {
    background: white !important;
    border-radius: 13px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    padding: 0 !important;
    overflow: hidden !important;
    max-width: 320px !important;
    width: auto !important;
  }

  .mapboxgl-popup-anchor-top .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
    border-bottom-color: white !important;
  }

  .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip,
  .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
    border-top-color: white !important;
  }

  .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    border-right-color: white !important;
  }

  .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    border-left-color: white !important;
  }

  .mapboxgl-popup-close-button {
    position: absolute !important;
    right: 8px !important;
    top: 8px !important;
    width: 24px !important;
    height: 24px !important;
    background: rgba(0, 0, 0, 0.1) !important;
    border-radius: 50% !important;
    border: none !important;
    color: #666 !important;
    font-size: 16px !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s ease !important;
    z-index: 10 !important;
  }

  .mapboxgl-popup-close-button:hover {
    background: rgba(0, 0, 0, 0.2) !important;
    color: #333 !important;
  }
`;
document.head.appendChild(mapStyles);



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
    <div className="flex items-center  px-4 py-3 bg-white border-t border-gray-200 rounded-b-2xl">
      <div className="flex-1 flex justify-between sm:hidden">
        <div
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === 1 
              ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100' 
              : 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
          }`}
        >
          Previous
        </div>
        <div
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
            currentPage === totalPages 
              ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-100' 
              : 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
          }`}
        >
          Next
        </div>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center gap-5">
        <div>
          <p className="text-sm text-gray-700 font-albertsans">
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

// Skeleton Loading Components
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-12 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center">
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      </div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-6 bg-gray-300 rounded-full w-16 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center space-x-2">
        <div className="h-8 w-16 bg-gray-300 rounded-2xl"></div>
        <div className="h-8 w-16 bg-gray-300 rounded-2xl"></div>
      </div>
    </td>
  </tr>
);

// Admin Table Skeleton with separate action columns
const AdminTableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-12 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center">
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      </div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-6 bg-gray-300 rounded-full w-16 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-8 w-16 bg-gray-300 rounded-2xl mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-8 w-16 bg-gray-300 rounded-2xl mx-auto"></div>
    </td>
  </tr>
);

const CategoryTableSkeleton = () => (
  <tr className="animate-pulse hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2">
    <td className="px-5 text-center">
      <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
    </td>
    <td className="px-5 text-center">
      <div className="flex items-center justify-center">
        <div className="h-12 w-12 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    </td>
    <td className="px-5 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="px-5 py-4 text-center">
      <div className="flex justify-center">
        <div className="h-8 w-16 bg-gray-300 rounded-2xl"></div>
      </div>
    </td>
  </tr>
);

const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-4 shadow-md">
    <div className="h-40 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
  </div>
);

const AppointmentSkeleton = () => (
  <tr className="animate-pulse hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2">
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex items-center whitespace-nowrap">
        <div className="h-12 w-12 bg-gray-300 rounded-full mr-3"></div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center items-center whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-24 mr-2"></div>
        <div className="h-4 bg-gray-300 rounded w-16 mr-3"></div>
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center items-center whitespace-nowrap">
        <div className="h-4 bg-gray-300 rounded w-24 mr-2"></div>
        <div className="h-4 bg-gray-300 rounded w-16 mr-3"></div>
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="flex justify-center space-x-2">
        <div className="h-8 w-16 bg-gray-300 rounded-2xl"></div>
      </div>
    </td>
  </tr>
);

const ProfileSkeleton = () => (
  <div className="animate-pulse bg-white shadow-lg w-[316px] h-[120px] rounded-3xl">
    <div className="flex justify-center items-center h-full">
      <div className="w-[125px] h-full flex justify-center items-center">
        <div className="h-18 w-18 bg-gray-300 rounded-full"></div>
      </div>
      <div className="flex flex-col justify-center items-start pl-2 pr-2 w-full h-full">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const InventorySkeleton = () => (
  <div className="animate-pulse flex flex-col items-start justify-start w-[220px] h-auto shadow-md bg-white rounded-2xl mr-3 mb-3">
    <div className="h-45 bg-gray-300 rounded-tr-2xl rounded-tl-2xl w-full"></div>
    <div className="mx-1 w-fit rounded-md py-1 px-2 bg-gray-200 mt-2">
      <div className="h-3 bg-gray-300 rounded w-16"></div>
    </div>
    <div className="w-full h-auto ml-2 mt-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
    <div className="w-fit h-auto ml-2 mt-1">
      <div className="h-5 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="w-full h-auto ml-2 mt-5 mb-1">
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="w-full h-auto ml-2 mb-1 flex items-center">
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="w-full h-auto ml-2 mb-3 flex items-center">
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
);

// Skeleton component for order items - matches the order card layout
const OrderSkeleton = () => (
  <div className="pb-7 shadow-md rounded-2xl py-3.25 px-3.25 mb-3 border-1 flex items-center w-full h-auto animate-pulse">
    {/* Product image skeleton - matches w-35 h-35 */}
    <div className="mr-5 w-35 h-35 bg-gray-300 rounded-2xl"></div>
    
    <div className="mt-2 h-auto w-full flex flex-col items-start">
      {/* Product name and status skeleton - matches flex justify-between */}
      <div className="flex justify-between w-full mb-2">
        <div className="h-6 bg-gray-300 rounded w-80"></div>
        <div className="h-8 bg-gray-200 rounded-full w-28 px-4 py-2"></div>
      </div>
      
      {/* Customer name skeleton */}
      <div className="h-4 bg-gray-300 rounded w-64 mb-5"></div>
      
      {/* Order details section skeleton - matches mt-5 justify-between w-full flex items-center */}
      <div className="mt-5 justify-between w-full flex items-center">
        {/* Date Ordered - matches actual structure */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div>
            <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-28"></div>
          </div>
        </div>
        
        {/* Pickup info - matches actual structure */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div>
            <div className="h-3 bg-gray-300 rounded w-36 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
        </div>
        
        {/* Quantity - matches actual structure */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div>
            <div className="h-3 bg-gray-300 rounded w-16 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-6"></div>
          </div>
        </div>
        
        {/* Amount - matches actual structure */}
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div>
            <div className="h-3 bg-gray-300 rounded w-28 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
      
      {/* Total price section skeleton - matches border-t-2 w-full h-10 mt-5 */}
      <div className="flex items-center justify-between border-t-2 w-full h-10 mt-5">
        <div></div>
        <div className="flex items-center gap-3 mt-5 h-auto">
          <div className="h-5 bg-gray-300 rounded w-24"></div>
          <div className="h-7 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-3 w-full">
    {[...Array(3)].map((_, index) => (
      <OrderSkeleton key={index} />
    ))}
  </div>
);

// Medical Record Skeleton Components
const MedicalRecordRowSkeleton = () => (
  <div className="animate-pulse pl-3 mt-3 w-full h-[80px] shadow-sm bg-white rounded-2xl flex justify-between items-center">
    <div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
      <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
    </div>
    <div className="px-2 flex flex-col justify-center items-center rounded-2xl h-full w-[220px]">
      <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
    </div>
    <div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
      <div className="h-4 bg-gray-300 rounded w-28 mx-auto"></div>
    </div>
    <div className="rounded-2xl h-full w-auto mr-4 flex justify-center items-center">
      <div className="h-8 w-16 bg-gray-300 rounded-2xl mr-2"></div>
      <div className="h-8 w-20 bg-gray-300 rounded-2xl"></div>
    </div>
  </div>
);

const MedicalRecordImageSkeleton = () => (
  <div className="animate-pulse flex flex-col justify-center items-center w-fit h-fit mt-5">
    <div className="object-cover max-w-150 h-40 bg-gray-300 rounded-2xl"></div>
  </div>
);

// Optimized Medical Record Image Component
const OptimizedMedicalRecordImage = ({ src, alt = "Medical Record", className = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    // Create a new image element to preload
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
      setHasError(false);
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    
    // Start loading the image
    img.src = src;
    
    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  if (isLoading) {
    return <MedicalRecordImageSkeleton />;
  }
  
  if (hasError || !imageSrc) {
    return (
      <div className="flex flex-col justify-center items-center w-fit h-fit mt-5">
        <div className="object-cover max-w-150 h-40 bg-gray-200 rounded-2xl flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <i className="bx bx-image text-3xl mb-2"></i>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col justify-center items-center w-fit h-fit mt-5">
      <img 
        className={`object-cover max-w-150 rounded-2xl ${className}`}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

// Medical Record Image Viewer with automatic loading
const MedicalRecordImageViewer = ({ record, loadMedicalRecordImage, onImageClick }) => {
  const [imageData, setImageData] = useState(record?.patientotherclinicrecordimage || null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Load image when component mounts if no image data exists
  useEffect(() => {
    const loadImage = async () => {
      if (!imageData && record?.otherclinicid && loadMedicalRecordImage) {
        setIsLoadingImage(true);
        setImageError(false);
        
        try {
          console.log('Loading image for record ID:', record.otherclinicid);
          const image = await loadMedicalRecordImage(record.otherclinicid);
          if (image) {
            setImageData(image);
            // Also update the record object for the modal
            if (record) {
              record.patientotherclinicrecordimage = image;
            }
          } else {
            setImageError(true);
          }
        } catch (error) {
          console.error('Error loading medical record image:', error);
          setImageError(true);
        } finally {
          setIsLoadingImage(false);
        }
      }
    };

    loadImage();
  }, [record?.otherclinicid, imageData, loadMedicalRecordImage, record]);

  if (isLoadingImage) {
    return (
      <div className="flex flex-col justify-center items-center w-fit h-fit mt-5">
        <div className="hover:cursor-pointer object-cover w-80 h-80 bg-gray-200 rounded-2xl flex items-center justify-center animate-pulse">
          <div className="text-gray-500 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm">Loading image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (imageData && !imageError) {
    const imageSrc = imageData.startsWith('data:') 
      ? imageData 
      : `data:image/jpeg;base64,${imageData}`;

    return (
      <div className="flex flex-col justify center items-center w-fit h-fit mt-5">
        <div onClick={() => onImageClick && onImageClick()} className="cursor-pointer">
          <OptimizedMedicalRecordImage 
            src={imageSrc}
            alt="Medical Record Image"
            className="hover:cursor-pointer object-cover w-80 h-80"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-fit h-fit mt-5">
      <div className="object-cover max-w-150 h-40 bg-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <i className="bx bx-image text-3xl mb-2"></i>
          <p className="text-sm">{imageError ? 'Failed to load image' : 'No image available'}</p>
        </div>
      </div>
    </div>
  );
};
















































function AdminDashboard(){

  const apiUrl = import.meta.env.VITE_API_URL;

  // Memoize the user type to prevent JSON.parse on every render
  const loggedinusertype = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('currentuser'));
    } catch {
      return null;
    }
  }, []);
  
  // Smart caching with real-time updates for admin data - memoized to prevent re-initialization
  const smartCacheInstance = useSmartCache();
  const { smartFetch, realtimeUpdates, CACHE_DURATIONS } = smartCacheInstance;
  
  // Image optimization hook for better performance
  const {
    preloadAllImages,
    getImageProps,
    manageCacheSize,
    isImageLoaded,
    loadingProgress
  } = useImageOptimization();
  



  const [adminfirstname, setadminfirstname] = useState('');
  const [adminmiddlename, setadminmiddlename] = useState('');
  const [adminlastname, setadminlastname] = useState('');
  const [adminrole, setadminrole] = useState('');
  const [admintype, setadmintype] = useState('');
  const [adminprofilepicture, setadminprofilepicture] = useState('');


  const [showlogoutbtn, setshowlogoutbtn] = useState(false);
  const showlogout = () => {
    setshowlogoutbtn(!showlogoutbtn);
  }



  
  //Retrieveing Data from useAuth Hook - Memoized to prevent re-initialization
  const {stafflogout, fetchstaffdetails} = useStaffAuth();
  const {ownerlogout, fetchownerdetails} = useOwnerAuth();
  const {adminlogout, fetchadmindetails} = useAdminAuth();

  const [ownerownedclinic,setownerownedclinic] = useState('');
  const [staffclinic, setStaffClinic] = useState('');
  const [currentUserClinic, setCurrentUserClinic] = useState('');

  // Memoize these to prevent recalculation on every render
  const currentusertoken = useMemo(() => 
    localStorage.getItem("stafftoken") ||
    localStorage.getItem("ownertoken") ||
    localStorage.getItem("admintoken"), []
  );

  const currentuserloggedin = useMemo(() => 
    localStorage.getItem("stafftoken") ? "Staff" :
    localStorage.getItem("ownertoken") ? "Owner" :
    localStorage.getItem("admintoken") ? "Admin" : null, []
  );

  // Helper function to determine if user should see only Ambher Optical data
  const isAmbherOnlyUser = () => {
    if (currentuserloggedin === "Staff") {
      return localStorage.getItem('staffclinic') === 'Ambher Optical' || staffclinic === 'Ambher Optical';
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic === 'Ambher Optical';
    }
    return false; // Admin can see all data
  };

  // Helper function to determine if user should see only Bautista Eye Center data
  const isBautistaOnlyUser = () => {
    if (currentuserloggedin === "Staff") {
      return localStorage.getItem('staffclinic') === 'Bautista Eye Center' || staffclinic === 'Bautista Eye Center';
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic === 'Bautista Eye Center';
    }
    return false; // Admin can see all data
  };


  const handlelogout = () => {
    if(currentuserloggedin === "Admin") adminlogout();
    else if(currentuserloggedin === "Staff") stafflogout();
    else if (currentuserloggedin === "Owner") ownerlogout();
  }                           
  


  
  // Track if user data has been loaded to prevent infinite re-renders
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  // Load user data once on component mount - avoiding auth function dependencies
  useEffect(() => {
    if (userDataLoaded || !currentuserloggedin) return;

    const loadUser = async () => {
      try {
        let data;

        if(currentuserloggedin === "Admin"){
          data = await fetchadmindetails();
          
          if(data) {
            setadminfirstname(data.adminfirstname || '');
            setadminmiddlename(data.adminmiddlename || '');
            setadminlastname(data.adminlastname || '');
            setadminprofilepicture(data.adminprofilepicture || '');
            setadmintype(data.role || '');
          }
        }
        else if(currentuserloggedin === "Staff"){
          data = await fetchstaffdetails();
          
          if(data) {
            setadminfirstname(data.stafffirstname || '');
            setadminmiddlename(data.staffmiddlename || '');
            setadminlastname(data.stafflastname || '');
            setadminprofilepicture(data.staffprofilepicture || '');
            setStaffClinic(data.staffclinic || '');
            setCurrentUserClinic(data.staffclinic || '');
            setadmintype(data.role || '');
          }
        }
        else if(currentuserloggedin === "Owner"){
          data = await fetchownerdetails();
          if(data) {
            setadminfirstname(data.ownerfirstname || '');
            setadminmiddlename(data.ownermiddlename || '');
            setadminlastname(data.ownerlastname || '');
            setadminprofilepicture(data.ownerprofilepicture || '');
            setownerownedclinic(data.ownerclinic || '');
            setCurrentUserClinic(data.ownerclinic || '');
            setadmintype(data.role || '');
          }
        }
        
        setUserDataLoaded(true);
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserDataLoaded(true); // Still mark as loaded to prevent infinite retry
      }
    };

    loadUser();
  }, [currentuserloggedin, userDataLoaded]); // Removed fetchClinicLocations to avoid hoisting issues








  // Check if user role is admin - enhanced detection (memoized to prevent recalculation)
  const isAdminRole = useMemo(() => {
    return loggedinusertype?.role === 'admin' || 
           loggedinusertype?.role === 'Admin' ||
           localStorage.getItem('admintoken') !== null;
  }, [loggedinusertype?.role]);
  
  // For testing: uncomment the line below to force admin view
  // const isAdminRole = true;
  
  const [sidebarexpanded, setsidebarexpanded] = useState(false);
  const toggleadminsidebar = () => {
    setsidebarexpanded(!sidebarexpanded);
  }

  // Set default dashboard based on user role - admin users default to account management
  const [activedashboard, setactivedashboard] = useState(isAdminRole ? 'accountmanagement' : 'summaryoverview');
  const showdashboard = (dashboardid) => {
     setactivedashboard(dashboardid);
  };



  

  const [currenttime, setcurrenttime] = useState(new Date());

  useEffect(() => {
    const time  = setInterval(() =>{
      setcurrenttime(new Date());
    },1000);

    return () => clearInterval(time);
  }, []);

  const currentdateoption = {weekday: 'long', year: 'numeric', month:'long', day:'numeric'};
  const currenttimeoption = {hour: '2-digit', minute: '2-digit', second: '2-digit'};





  const [activetodaysappointmentfilter, setactivetodaysappointmentfilter] = useState('filteralltoday');
  const activetodayfilter = (activefilter) => {
    setactivetodaysappointmentfilter(activefilter);
  };


  const [activependingordersfilter, setactivependingordersfilter] = useState('filterallpending');
  const activependingfilter = (activependingorder) => {
    setactivependingordersfilter(activependingorder);
  };



  const [activestockfilter, setactivestockfilter] = useState('filterallstock');
  const activestockinventoryfilter = (activestockinvfilter) => {
    setactivestockfilter(activestockinvfilter);
  };




  const [activeunreadfilter, setactiveunreadfilter] = useState('filterallunread');
  const activeunreadmessagesfilter = (activeunreadmsgfilter) => {
    setactiveunreadfilter(activeunreadmsgfilter);
  };





  // Set default account table based on user role - admin users default to administrator table
  const [activeaccounttable, setactiveaccounttable] = useState(isAdminRole ? 'administratoraccounttable' : 'patientaccounttable');
  const showaccounttable = (accounttableid) => {
        setactiveaccounttable(accounttableid);
  };
















































//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 

const [clinicLocations, setClinicLocations] = useState([]);
const [loadingClinicLocations, setLoadingClinicLocations] = useState(true);
const [selectedClinicLocation, setSelectedClinicLocation] = useState(null);
const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
const [showEditClinicDialog, setShowEditClinicDialog] = useState(false);
const [showDeleteClinicDialog, setShowDeleteClinicDialog] = useState(false);
const [showClinicDetailsDialog, setShowClinicDetailsDialog] = useState(false);
const [isEditingLocation, setIsEditingLocation] = useState(false);
const [isSavingLocation, setIsSavingLocation] = useState(false);
const [locationMessage, setLocationMessage] = useState({ text: '', type: '' });

// Nearby clinic discovery states
const [nearbyEyeClinics, setNearbyEyeClinics] = useState([]);
const [loadingNearbyClinic, setLoadingNearbyClinic] = useState(false);
const [searchRadius, setSearchRadius] = useState(5000); // 5km default
const [showNearbyClinicPanel, setShowNearbyClinicPanel] = useState(false);
const [showAddExternalClinicDialog, setShowAddExternalClinicDialog] = useState(false);
const [selectedNearbyClinic, setSelectedNearbyClinic] = useState(null);

// User location states
const [userLocation, setUserLocation] = useState(null);
const [loadingUserLocation, setLoadingUserLocation] = useState(false);
const [userLocationError, setUserLocationError] = useState(null);

// Mapbox states
const mapContainer = useRef(null);
const map = useRef(null);
const mapMarkersRef = useRef(new Map()); // Use a ref to persist markers across renders
const [mapLoaded, setMapLoaded] = useState(false);
const [mapCenter, setMapCenter] = useState([120.4818, 14.6417]); // Metro Manila center
const [mapZoom, setMapZoom] = useState(10);
const [realtimeCoordinates, setRealtimeCoordinates] = useState({
  longitude: 120.4818,
  latitude: 14.6417,
  accuracy: null,
  timestamp: new Date()
});

// Clinic form data state
const [clinicFormData, setClinicFormData] = useState({
  clinicName: '',
  clinicType: currentUserClinic || (staffclinic || ownerownedclinic || 'Ambher Optical'),
  address: {
    street: '',
    city: '',
    state: 'Bataan',
    zipCode: '',
    country: 'Philippines',
    fullAddress: ''
  },
  coordinates: {
    longitude: 120.4818, // Manila, Philippines longitude
    latitude: 14.6417   // Manila, Philippines latitude
  },
  contactInfo: {
    phone: '',
    email: '',
    website: ''
  },
  operatingHours: {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '17:00', closed: false },
    sunday: { open: '10:00', close: '16:00', closed: true }
  },
  services: []
});

//direction and routing variables
const [showDirections, setShowDirections] = useState(false);
const [routeInfo, setRouteInfo] = useState(null);
const [directionsSteps, setDirectionsSteps] = useState([]);
const [isLoadingRoute, setIsLoadingRoute] = useState(false);
const directionsControl = useRef(null);
const isInitializingMap = useRef(false); // Track if map is currently being initialized
const directionsInitialized = useRef(false); // Track if directions control has been initialized
const currentPopup = useRef(null); // Track current open popup to close it when opening a new one

















// Add these handler functions after your existing functions (around line 1000)


// Load clinic locations
const fetchClinicLocations = useCallback(async () => {
  try {
    setLoadingClinicLocations(true);
    // Use fallback URL if environment variable is not set
    const baseUrl = apiUrl || 'http://localhost:3000';
    // Only fetch active clinics by default (don't include inactive/deleted ones)
    const fetchUrl = `${baseUrl}/api/cliniclocation/clinics`;
    console.log('Fetching clinic locations from:', fetchUrl);
    console.log('API URL from env:', apiUrl);
    console.log('Current user token exists:', !!currentusertoken);
    
    const response = await fetch(fetchUrl, {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('Received clinic data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        console.log('Setting clinic locations:', data.data);
        setClinicLocations(data.data);
        setLocationMessage({ 
          text: `Loaded ${data.data.length} clinic locations from database`, 
          type: 'success' 
        });
      } else {
        console.warn('Invalid data structure received:', data);
        setLocationMessage({ text: 'Invalid data received from server', type: 'warning' });
        setClinicLocations([]);
      }
    } else {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      setLocationMessage({ 
        text: `Failed to load clinics: ${response.status} ${response.statusText}`, 
        type: 'error' 
      });
      setClinicLocations([]);
    }
  } catch (error) {
    console.error('Network error fetching clinic locations:', error);
    setLocationMessage({ text: 'Network error loading clinic locations', type: 'error' });
    setClinicLocations([]);
  } finally {
    setLoadingClinicLocations(false);
  }
}, [apiUrl, currentusertoken]);


// Get user's current location with highest accuracy possible (Google-like approach)
const getUserLocation = useCallback(() => {
  if (!navigator.geolocation) {
    setUserLocationError('Geolocation is not supported by this browser');
    setLocationMessage({ 
      text: 'Your browser does not support location services. Please use a modern browser.', 
      type: 'error' 
    });
    return;
  }

  setLoadingUserLocation(true);
  setUserLocationError(null);
  setLocationMessage({ 
    text: 'Getting your precise location...', 
    type: 'info' 
  });

  // Ultra-high accuracy options for maximum precision (Google-like)
  const maxAccuracyOptions = {
    enableHighAccuracy: true, // Force GPS usage
    timeout: 30000, // 30 second timeout for GPS lock
    maximumAge: 0 // No cached data - force fresh reading
  };

  console.log('🎯 Getting highest accuracy location (Google-like approach)...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
      
      console.log('📍 Location obtained:', {
        accuracy: Math.round(accuracy) + 'm',
        coordinates: [longitude, latitude]
      });
      
      setUserLocation({
        latitude,
        longitude,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        speed,
        timestamp: position.timestamp
      });
      
      setLoadingUserLocation(false);


      // Auto-zoom to user location based on accuracy
      if (map.current) {
        const zoomLevel = accuracy <= 10 ? 18 :     // High precision - building level
                         accuracy <= 25 ? 16 :     // Good precision - neighborhood
                         accuracy <= 50 ? 15 :     // Fair precision - district
                         accuracy <= 100 ? 14 :    // Basic precision - city area
                         13;                        // Poor precision - wide area
        
        console.log(`🗺️ Zooming to user location (zoom: ${zoomLevel}, accuracy: ${Math.round(accuracy)}m)`);
        
        map.current.flyTo({
          center: [longitude, latitude],
          zoom: zoomLevel,
          duration: 2000,
          essential: true
        });
        
        // Add accuracy circle visualization
        if (map.current.getSource('user-accuracy-circle')) {
          map.current.removeSource('user-accuracy-circle');
          map.current.removeLayer('user-accuracy-circle');
        }
        
        const accuracyCircle = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          properties: {
            accuracy: accuracy
          }
        };
        
        map.current.addSource('user-accuracy-circle', {
          type: 'geojson',
          data: accuracyCircle
        });
        
        map.current.addLayer({
          id: 'user-accuracy-circle',
          type: 'circle',
          source: 'user-accuracy-circle',
          paint: {
            'circle-radius': Math.max(8, Math.min(accuracy / 2, 25)),
            'circle-color': accuracy <= 10 ? '#10b981' :  // Green (high precision)
                           accuracy <= 50 ? '#3b82f6' :  // Blue (good precision)
                           '#f59e0b',                     // Amber (fair precision)
            'circle-opacity': 0.6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.8
          }
        });
      }
    },
    (error) => {
      console.error('❌ Location error:', error);
      setLoadingUserLocation(false);
      
      let errorMessage = 'Unable to retrieve your location';
      let retryMessage = '';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          retryMessage = 'Click the location icon in your browser\'s address bar and allow location access.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          retryMessage = 'Make sure GPS is enabled and you have an internet connection.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          retryMessage = 'Try moving to an area with better GPS signal and try again.';
          break;
      }
      
      setUserLocationError(`${errorMessage} ${retryMessage}`);
      setLocationMessage({ 
        text: `${errorMessage} ${retryMessage}`, 
        type: 'error' 
      });
    },
    maxAccuracyOptions
  );
}, []);

// Handle map click to add new clinic
const handleMapClick = (e) => {
  if (!isEditingLocation) return;
  
  const mapElement = e.currentTarget;
  const rect = mapElement.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  // Convert click coordinates to longitude/latitude
  const longitude = 119 + (x / 100) * 8; // Rough conversion for Philippines bounds
  const latitude = 21 - (y / 100) * 17;
  
  setClinicFormData(prev => ({
    ...prev,
    coordinates: { longitude, latitude }
  }));
};

// Search for nearby eye clinics using Google Places API (alternative service)
const searchNearbyEyeClinics = useCallback(async (userLat, userLng, radius = searchRadius) => {
  if (!userLat || !userLng) {
    setLocationMessage({ 
      text: 'User location required to search for nearby clinics', 
      type: 'warning' 
    });
    return;
  }

  setLoadingNearbyClinic(true);
  setLocationMessage({ 
    text: 'Searching for nearby eye clinics...', 
    type: 'info' 
  });

  try {
    // Search for nearby eye clinics using multiple search terms
    const searchTerms = [
      'eye clinic',
      'optical clinic', 
      'eye doctor',
      'ophthalmologist',
      'optometrist',
      'eye care center'
    ];

    const allNearbyClinic = [];

    // Use Mapbox Places API to search for eye-related establishments
    for (const term of searchTerms) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?` +
          `access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&` +
          `proximity=${userLng},${userLat}&` +
          `limit=10&` +
          `country=ph&` +
          `types=poi`
        );

        if (response.ok) {
          const data = await response.json();
          
          data.features.forEach(feature => {
            const distance = calculateDistance(
              userLat, userLng,
              feature.center[1], feature.center[0]
            );

            if (distance <= radius / 1000) { // Convert meters to km
              allNearbyClinic.push({
                id: `external-${feature.id}`,
                name: feature.place_name || feature.text,
                clinicType: 'External Eye Clinic',
                address: {
                  fullAddress: feature.place_name
                },
                coordinates: {
                  longitude: feature.center[0],
                  latitude: feature.center[1]
                },
                distance: distance,
                source: 'mapbox',
                isExternal: true,
                searchTerm: term,
                contactInfo: {
                  phone: 'Contact info not available',
                  email: 'Not available'
                },
                services: ['General Eye Care'],
                verified: false
              });
            }
          });
        }
      } catch (error) {
        console.warn(`Error searching for "${term}":`, error);
      }
    }

    // Remove duplicates based on similar coordinates (within 100m)
    const uniqueClinic = [];
    allNearbyClinic.forEach(clinic => {
      const isDuplicate = uniqueClinic.some(existing => 
        calculateDistance(
          clinic.coordinates.latitude, clinic.coordinates.longitude,
          existing.coordinates.latitude, existing.coordinates.longitude
        ) < 0.1 // Less than 100m apart
      );
      if (!isDuplicate) {
        uniqueClinic.push(clinic);
      }
    });

    // Sort by distance
    uniqueClinic.sort((a, b) => a.distance - b.distance);

    setNearbyEyeClinics(uniqueClinic);
    setShowNearbyClinicPanel(true);
    
    setLocationMessage({ 
      text: `Found ${uniqueClinic.length} nearby eye clinics within ${radius/1000}km`, 
      type: 'success' 
    });

  } catch (error) {
    console.error('Error searching nearby clinics:', error);
    setLocationMessage({ 
      text: 'Failed to search for nearby clinics. Please try again.', 
      type: 'error' 
    });
  } finally {
    setLoadingNearbyClinic(false);
  }
}, [searchRadius]);

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// Add external clinic to our database
const addExternalClinic = useCallback(async (clinicData) => {
  setIsSavingLocation(true);
  try {
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        clinicId: `external-${Date.now()}`,
        clinicName: clinicData.name,
        clinicType: 'External Eye Clinic',
        address: clinicData.address,
        longitude: clinicData.coordinates.longitude,
        latitude: clinicData.coordinates.latitude,
        contactInfo: clinicData.contactInfo,
        services: clinicData.services || ['General Eye Care'],
        operatingHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '15:00', closed: true }
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      setClinicLocations(prev => [...prev, data.data]);
      setLocationMessage({ 
        text: 'External clinic added successfully!', 
        type: 'success' 
      });
      setShowAddExternalClinicDialog(false);
    } else {
      throw new Error('Failed to add clinic');
    }
  } catch (error) {
    console.error('Error adding external clinic:', error);
    setLocationMessage({ 
      text: 'Failed to add external clinic. Please try again.', 
      type: 'error' 
    });
  } finally {
    setIsSavingLocation(false);
  }
}, [apiUrl, currentusertoken]);

// Reset clinic form
const resetClinicForm = useCallback(() => {
  setClinicFormData({
    clinicName: '',
    clinicType: currentUserClinic || (staffclinic || ownerownedclinic || 'Ambher Optical'),
    address: {
      street: '',
      city: '',
      state: 'Metro Manila',
      zipCode: '',
      country: 'Philippines',
      fullAddress: ''
    },
    coordinates: { x: 50, y: 50 },
    contactInfo: { phone: '', email: '', website: '' },
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    },
    services: []
  });
}, [currentUserClinic, staffclinic, ownerownedclinic]);

// Copy coordinates to clipboard
const copyCoordinatesToClipboard = useCallback(async () => {
  const coordText = `${realtimeCoordinates.latitude.toFixed(6)}, ${realtimeCoordinates.longitude.toFixed(6)}`;
  try {
    await navigator.clipboard.writeText(coordText);
    setLocationMessage({ 
      text: 'Coordinates copied to clipboard!', 
      type: 'success' 
    });
  } catch (error) {
    console.error('Failed to copy coordinates:', error);
    setLocationMessage({ 
      text: 'Failed to copy coordinates', 
      type: 'error' 
    });
  }
}, [realtimeCoordinates]);



// Handler functions for clinic location dialogs
const handleSaveClinicLocation = useCallback(async () => {
  if (!clinicFormData?.clinicName || !clinicFormData?.coordinates?.latitude || !clinicFormData?.coordinates?.longitude) {
    setLocationMessage({ text: 'Please fill in all required fields', type: 'error' });
    return;
  }

  setIsSavingLocation(true);
  try {
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clinicName: clinicFormData.clinicName,
        clinicType: clinicFormData.clinicType,
        address: clinicFormData.address,
        longitude: clinicFormData.coordinates.longitude,
        latitude: clinicFormData.coordinates.latitude,
        contactInfo: clinicFormData.contactInfo,
        operatingHours: clinicFormData.operatingHours,
        services: clinicFormData.services
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Add the new clinic to the state directly, which will trigger the marker effect
      setClinicLocations(prev => [...prev, data.data]);
      
      setLocationMessage({ text: 'Clinic location saved successfully', type: 'success' });
      setShowAddClinicDialog(false);
      resetClinicForm();
      
      // Zoom to the new clinic location on the map
      if (map.current && data.data?.coordinates) {
        const coords = data.data.coordinates.coordinates || [data.data.coordinates.longitude, data.data.coordinates.latitude];
        map.current.flyTo({
          center: coords,
          zoom: 14,
          duration: 2000
        });
      }
    } else {
      throw new Error('Failed to save clinic location');
    }
  } catch (error) {
    console.error('Error saving clinic location:', error);
    setLocationMessage({ text: 'Failed to save clinic location', type: 'error' });
  } finally {
    setIsSavingLocation(false);
  }
}, [apiUrl, currentusertoken, clinicFormData, resetClinicForm]);

const handleUpdateClinicLocation = useCallback(async () => {
  if (!selectedClinicLocation || !clinicFormData?.clinicName || !clinicFormData?.coordinates?.latitude || !clinicFormData?.coordinates?.longitude) {
    setLocationMessage({ text: 'Please fill in all required fields', type: 'error' });
    return;
  }

  setIsSavingLocation(true);
  try {
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${selectedClinicLocation.clinicId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clinicName: clinicFormData.clinicName,
        clinicType: clinicFormData.clinicType,
        address: clinicFormData.address,
        longitude: clinicFormData.coordinates.longitude,
        latitude: clinicFormData.coordinates.latitude,
        contactInfo: clinicFormData.contactInfo,
        operatingHours: clinicFormData.operatingHours,
        services: clinicFormData.services
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Update the clinic in the state directly, which will trigger the marker effect
      setClinicLocations(prev => prev.map(clinic => 
        clinic._id === selectedClinicLocation._id ? data.data : clinic
      ));
      
      setLocationMessage({ text: 'Clinic location updated successfully', type: 'success' });
      setShowEditClinicDialog(false);
      setSelectedClinicLocation(null);
      resetClinicForm();
      
      // Zoom to the updated clinic location on the map
      if (map.current && data.data?.coordinates) {
        const coords = data.data.coordinates.coordinates || [data.data.coordinates.longitude, data.data.coordinates.latitude];
        map.current.flyTo({
          center: coords,
          zoom: 14,
          duration: 2000
        });
      }
    } else {
      throw new Error('Failed to update clinic location');
    }
  } catch (error) {
    console.error('Error updating clinic location:', error);
    setLocationMessage({ text: 'Failed to update clinic location', type: 'error' });
  } finally {
    setIsSavingLocation(false);
  }
}, [apiUrl, currentusertoken, clinicFormData, selectedClinicLocation, resetClinicForm]);

const handleDeleteClinicLocation = useCallback(async () => {
  if (!selectedClinicLocation) return;

  setIsSavingLocation(true);
  try {
    console.log('🗑️ Deleting clinic location:', selectedClinicLocation);
    
    // Use the clinicId field from the selected clinic, not the MongoDB _id
    const clinicIdToDelete = selectedClinicLocation.clinicId || selectedClinicLocation._id;
    
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${clinicIdToDelete}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ Clinic deleted successfully from database');
      
      // Refresh the clinic locations to get updated data (removes soft-deleted clinics)
      await fetchClinicLocations();
      
      setLocationMessage({ text: 'Clinic location deleted successfully', type: 'success' });
      setShowDeleteClinicDialog(false);
      setSelectedClinicLocation(null);
      
      // Fly back to center view on the map after deletion
      if (map.current) {
        map.current.flyTo({
          center: [120.4818, 14.6417], // Metro Manila center
          zoom: 10,
          duration: 2000
        });
      }
    } else {
      const errorData = await response.text();
      console.error('❌ Delete failed with response:', response.status, errorData);
      throw new Error(`Failed to delete clinic location: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error deleting clinic location:', error);
    setLocationMessage({ text: 'Failed to delete clinic location: ' + error.message, type: 'error' });
  } finally {
    setIsSavingLocation(false);
  }
}, [apiUrl, currentusertoken, selectedClinicLocation, fetchClinicLocations]);

// Toggle clinic active status
const handleToggleClinicStatus = useCallback(async (clinic) => {
  try {
    console.log('Toggling clinic status for:', clinic.clinicName);
    
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${clinic.clinicId}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Toggle response:', data);
      
      // Update the clinic in the state, which will trigger the marker effect
      setClinicLocations(prev => 
        prev.map(c => c._id === clinic._id ? { ...c, isActive: data.data.isActive } : c)
      );
      
      setLocationMessage({ 
        text: `Clinic ${data.data.isActive ? 'activated' : 'deactivated'} successfully`, 
        type: 'success' 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setLocationMessage({ text: '', type: '' });
      }, 3000);
      
    } else {
      throw new Error('Failed to toggle clinic status');
    }
  } catch (error) {
    console.error('Error toggling clinic status:', error);
    setLocationMessage({ text: 'Failed to toggle clinic status', type: 'error' });
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      setLocationMessage({ text: '', type: '' });
    }, 5000);
  }
}, [apiUrl, currentusertoken]);




const initializeDirectionsControl = useCallback(() => {
  if (!map.current || directionsControl.current || directionsInitialized.current) return;

  console.log('🧭 Initializing directions control...');
  directionsInitialized.current = true; // Mark as initialized to prevent re-initialization

  directionsControl.current = new MapboxDirections({
    accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    unit: 'metric',
    profile: 'mapbox/driving',
    alternatives: false, // Disable alternatives for cleaner display
    geometries: 'geojson',
    controls: {
      instructions: false, // We'll show custom instructions
      inputs: false, // Disable input fields to prevent manual editing
      profileSwitcher: false
    },
    flyTo: false, // Disable automatic flying to route
    interactive: false // Make waypoints non-interactive/non-draggable
  });

  // Add the control to the map but hide it visually
  map.current.addControl(directionsControl.current, 'top-left');
  
  // Hide the default directions control UI
  setTimeout(() => {
    const directionsElement = document.querySelector('.mapboxgl-ctrl-directions');
    if (directionsElement) {
      directionsElement.style.display = 'none';
    }
  }, 100);
  
  // Listen for route events
  directionsControl.current.on('route', (event) => {
    console.log('🛣️ Route calculated:', event);
    if (event.route && event.route[0]) {
      const route = event.route[0];
      setRouteInfo({
        distance: (route.distance / 1000).toFixed(1), // Convert to km
        duration: Math.round(route.duration / 60), // Convert to minutes
        geometry: route.geometry
      });
      setDirectionsSteps(route.legs[0]?.steps || []);
      setIsLoadingRoute(false);
      setShowDirections(true); // Show our custom directions panel
      console.log('✅ Route info updated successfully');
      
      // Make waypoints non-draggable after route calculation
      setTimeout(() => {
        const waypoints = document.querySelectorAll('.mapbox-directions-waypoint');
        waypoints.forEach(waypoint => {
          waypoint.style.pointerEvents = 'none';
          waypoint.style.cursor = 'default';
        });
        
        // Also disable dragging on route line
        const routeLines = document.querySelectorAll('.mapbox-directions-route-line');
        routeLines.forEach(line => {
          line.style.pointerEvents = 'none';
        });
      }, 100);
    }
  });

  directionsControl.current.on('error', (e) => {
    setIsLoadingRoute(false);
    console.error('❌ Error calculating route:', e);
    setLocationMessage({
      text: 'Failed to calculate route. Please try again.',
      type: 'error'
    });
  });

  directionsControl.current.on('clear', () => {
    console.log('🧹 Directions cleared');
    setShowDirections(false);
    setRouteInfo(null);
    setDirectionsSteps([]);
  });

  console.log('✅ Directions control initialized successfully');
}, []);

const clearDirections = useCallback(() => {
  console.log('🧹 Clearing directions...');
  if (directionsControl.current) {
    directionsControl.current.removeRoutes();
  }
  setShowDirections(false);
  setRouteInfo(null);
  setDirectionsSteps([]);
  setIsLoadingRoute(false);
  
  setLocationMessage({
    text: 'Directions cleared',
    type: 'info'
  });
}, []);


const getStepIcon = (maneuverType) => {
  const iconMap = {
    'turn': 'bx-turn-right',
    'new name': 'bx-right-arrow',
    'depart': 'bx-play',
    'arrive': 'bx-flag',
    'merge': 'bx-merge',
    'on ramp': 'bx-up-arrow',
    'off ramp': 'bx-down-arrow',
    'fork': 'bx-git-branch',
    'end of road': 'bx-stop',
    'use lane': 'bx-right-arrow',
    'continue': 'bx-up-arrow',
    'roundabout': 'bx-refresh',
    'rotary': 'bx-refresh',
    'roundabout turn': 'bx-refresh',
    'notification': 'bx-info-circle',
    'exit roundabout': 'bx-log-out',
    'exit rotary': 'bx-log-out'
  };
  
  return iconMap[maneuverType] || 'bx-right-arrow';
};
















  const legendControlRef = useRef(null);
  const directionsPanelRef = useRef(null);

  // Custom Fullscreen Control
  const toggleFullscreen = useCallback(() => {
    const container = map.current.getContainer();
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

    if (!fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
  }, []);

  // Initialize Mapbox map
  useEffect(() => {
    console.log('🔄 Map useEffect triggered - Dashboard:', activedashboard);
    
    // Debug current state (without adding to dependencies)
    console.log('🔍 Map Debug State:', {
      mapExists: !!map.current,
      mapLoaded: mapLoaded,
      isInitializing: isInitializingMap.current,
      activeDashboard: activedashboard,
      containerExists: !!mapContainer.current
    });
    
    // Only initialize if we're on the mapping dashboard
    if (activedashboard !== 'mappingintegration') {
      console.log('❌ Not on mapping dashboard, skipping map initialization');
      return;
    }

    // Check if container exists and map needs initialization
    if (!mapContainer.current) {
      console.log('❌ Map container not found, waiting...');
      return;
    }

    // Prevent multiple simultaneous initializations
    if (isInitializingMap.current) {
      console.log('⏳ Map is already being initialized, skipping...');
      return;
    }

    // If map already exists and is working properly, don't reinitialize unnecessarily
    if (map.current && map.current.getContainer() === mapContainer.current) {
      console.log('✅ Map already initialized and working properly - KEEPING EXISTING MAP');
      return;
    }

    // Set initialization flag
    isInitializingMap.current = true;
    console.log('🔄 Setting initialization flag to true');

    // Clean up existing map if it exists but container is different
    if (map.current) {
      console.log('🧹 Cleaning up existing map before reinitializing...');
      try {
        // Remove all existing controls before cleanup to prevent duplication
        const controls = map.current._controls;
        if (controls && controls.length > 0) {
          controls.slice().forEach(control => {
            try {
              map.current.removeControl(control);
            } catch (e) {
              console.warn('Could not remove control:', e);
            }
          });
          console.log('🧹 Removed all existing map controls');
        }
        map.current.remove();
      } catch (error) {
        console.warn('Warning during map cleanup:', error);
      }
      map.current = null;
      setMapLoaded(false);
      
      // Clear markers reference when map is destroyed during re-initialization
      mapMarkersRef.current.clear();
      
      // Clear directions control reference during re-initialization
      if (directionsControl.current) {
        directionsControl.current = null;
      }
      directionsInitialized.current = false;
      
      console.log('🧹 Cleared markers reference during map cleanup');
    }

    console.log('🚀 Initializing new map instance...');

    // Set Mapbox access token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    try {
      // Initialize the map with minimal, stable configuration
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [120.4818, 14.6417], // Metro Manila center
        zoom: 10,
        // Disable rotation and tilting
        bearing: 0, // Lock rotation to north-up
        pitch: 0, // Keep map flat (no 3D tilt)
        maxPitch: 0, // Prevent any tilting
        dragRotate: false, // Disable rotation via drag
        touchPitch: false, // Disable pitch on touch devices
        // Essential options only to prevent URL parsing errors
        attributionControl: true,
        logoPosition: 'bottom-right',
        // Disable telemetry to prevent network errors
        collectResourceTiming: false,
        transformRequest: (url) => {
          // Block analytics/telemetry requests
          if (url.includes('events.mapbox.com') || url.includes('analytics') || url.includes('telemetry')) {
            console.log('🚫 Blocked telemetry request:', url);
            return { url: '', headers: {} };
          }
          return { url, headers: {} };
        }
      });

      console.log('✅ Map instance created successfully');
    } catch (error) {
      console.error('❌ Failed to create map instance:', error);
      setLocationMessage({ 
        text: 'Failed to initialize map. Please refresh the page.', 
        type: 'error' 
      });
      isInitializingMap.current = false; // Reset flag on error
      return;
    }

    // Add navigation controls (without rotation controls) - only once
    if (!map.current._controls || map.current._controls.length === 0) {
      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: false, // Hide compass since rotation is disabled
        showZoom: true,
        visualizePitch: false // Hide pitch visualization
      }));
      console.log('✅ Added navigation controls to map');
    } else {
      console.log('⚠️ Navigation controls already exist, skipping addition');
    }

    // Add ultra-high accuracy geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true, // Force GPS usage
        timeout: 30000, // Extended timeout for GPS lock
        maximumAge: 0 // No cached data - force fresh reading
      },
      trackUserLocation: true, // Continuously track user location
      showUserHeading: true, // Show direction user is facing
      showAccuracyCircle: true, // Show accuracy circle around user location
      fitBoundsOptions: {
        maxZoom: 17, // Higher zoom for better accuracy visualization
        padding: 50 // Padding around accuracy circle
      }
    });
    
    // Add enhanced event listeners for accuracy feedback
    geolocate.on('geolocate', (e) => {
      const accuracy = e.coords.accuracy;
      const accuracyLevel = accuracy <= 20 ? 'excellent' : accuracy <= 50 ? 'good' : accuracy <= 100 ? 'fair' : 'poor';
      const accuracyColor = accuracy <= 20 ? 'success' : accuracy <= 50 ? 'success' : accuracy <= 100 ? 'warning' : 'error';
      
      console.log('Geolocate control update:', {
        accuracy: Math.round(accuracy),
        level: accuracyLevel,
        coordinates: [e.coords.longitude, e.coords.latitude]
      });
      
      setLocationMessage({ 
        text: `Location updated: ${accuracyLevel} accuracy (${Math.round(accuracy)}m)`, 
        type: accuracyColor
      });
      
      // Update user location state with geolocate data
      setUserLocation({
        latitude: e.coords.latitude,
        longitude: e.coords.longitude,
        accuracy: e.coords.accuracy,
        altitude: e.coords.altitude,
        altitudeAccuracy: e.coords.altitudeAccuracy,
        heading: e.coords.heading,
        speed: e.coords.speed,
        timestamp: Date.now()
      });
    });
    
    geolocate.on('trackuserlocationstart', () => {
      setLocationMessage({ 
        text: 'Starting high-accuracy location tracking...', 
        type: 'info' 
      });
    });
    
    geolocate.on('trackuserlocationend', () => {
      setLocationMessage({ 
        text: 'Location tracking stopped', 
        type: 'info' 
      });
    });
    
    geolocate.on('error', (e) => {
      console.error('Geolocate control error:', e);
      setLocationMessage({ 
        text: 'Geolocate failed. Use "Get My Location" button for manual location.', 
        type: 'error' 
      });
    });
    
    // Add geolocate control - check if not already added
    const existingGeolocate = map.current._controls.find(control => 
      control instanceof mapboxgl.GeolocateControl
    );
    if (!existingGeolocate) {
      map.current.addControl(geolocate);
      console.log('✅ Added geolocate control to map');
    } else {
      console.log('⚠️ Geolocate control already exists, skipping addition');
    }

    // Add fullscreen control for better user experience - check if not already added
    const existingFullscreen = map.current._controls.find(control => 
      control instanceof mapboxgl.FullscreenControl
    );
    if (!existingFullscreen) {
      const fullscreenControl = new mapboxgl.FullscreenControl({
        container: document.querySelector('#geographicmapcontainer')
      });
      map.current.addControl(fullscreenControl, 'top-right');
      console.log('✅ Added fullscreen control to map');
    } else {
      console.log('⚠️ Fullscreen control already exists, skipping addition');
    }


    // Add fullscreen event listeners for better UX
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.mozFullScreenElement;
      
      if (isFullscreen) {
        console.log('🔍 Map entered fullscreen mode');
        setLocationMessage({ 
          text: '🔍 Map in fullscreen mode - Press ESC to exit', 
          type: 'info' 
        });
        
        // Force map container to take full screen dimensions
        const mapContainer = document.querySelector('#geographicmapcontainer');
        const mapElement = map.current.getContainer();
        
        if (mapContainer) {
          mapContainer.style.width = '100vw';
          mapContainer.style.height = '100vh';
          mapContainer.style.maxWidth = '100vw';
          mapContainer.style.maxHeight = '100vh';
          mapContainer.style.minWidth = '100vw';
          mapContainer.style.minHeight = '100vh';
          mapContainer.style.margin = '0';
          mapContainer.style.padding = '0';
          mapContainer.style.position = 'fixed';
          mapContainer.style.top = '0';
          mapContainer.style.left = '0';
          mapContainer.style.right = '0';
          mapContainer.style.bottom = '0';
          mapContainer.style.zIndex = '999999';
          mapContainer.style.border = 'none';
          mapContainer.style.outline = 'none';
          mapContainer.style.boxSizing = 'border-box';
        }
        
        if (mapElement) {
          mapElement.style.width = '100vw';
          mapElement.style.height = '100vh';
          mapElement.style.maxWidth = '100vw';
          mapElement.style.maxHeight = '100vh';
          mapElement.style.minWidth = '100vw';
          mapElement.style.minHeight = '100vh';
          mapElement.style.position = 'absolute';
          mapElement.style.top = '0';
          mapElement.style.left = '0';
          mapElement.style.right = '0';
          mapElement.style.bottom = '0';
          mapElement.style.margin = '0';
          mapElement.style.padding = '0';
          mapElement.style.border = 'none';
          mapElement.style.outline = 'none';
          mapElement.style.boxSizing = 'border-box';
        }
        
        // Also force all child elements to take full width
        const allElements = document.querySelectorAll('#geographicmapcontainer *');
        allElements.forEach(el => {
          if (el.classList.contains('mapboxgl-map') || 
              el.classList.contains('mapboxgl-canvas-container') || 
              el.classList.contains('mapboxgl-canvas')) {
            el.style.width = '100vw';
            el.style.height = '100vh';
            el.style.maxWidth = '100vw';
            el.style.maxHeight = '100vh';
            el.style.minWidth = '100vw';
            el.style.minHeight = '100vh';
            el.style.boxSizing = 'border-box';
          }
        });
        
        // Force immediate map resize to handle fullscreen dimensions
        if (map.current) {
          map.current.resize();
        }
        
        // Force map resize again after a delay to ensure proper rendering
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('🔄 Map resized for fullscreen mode');
          }
        }, 100);
        
        // Additional resize after fullscreen transition completes
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('🔄 Map resized again after fullscreen transition');
          }
        }, 300);
        
        // No need to add additional controls in fullscreen mode
        // Legend and directions panels are already properly positioned

      } else {
        console.log('🔍 Map exited fullscreen mode');
        setLocationMessage({ 
          text: '🔍 Fullscreen mode disabled', 
          type: 'info' 
        });
        
        // Reset container styles when exiting fullscreen but preserve visibility
        const mapContainer = document.querySelector('#geographicmapcontainer');
        const mapElement = map.current.getContainer();
        
        if (mapContainer) {
          // Reset fullscreen-specific styles but keep essential ones
          mapContainer.style.position = 'relative';
          mapContainer.style.width = '100%';
          mapContainer.style.height = '580px'; // Match container CSS class height
          mapContainer.style.maxWidth = 'none';
          mapContainer.style.maxHeight = 'none';
          mapContainer.style.minWidth = 'auto';
          mapContainer.style.minHeight = '580px'; // Match container height
          mapContainer.style.margin = '0';
          mapContainer.style.padding = '0';
          mapContainer.style.top = 'auto';
          mapContainer.style.left = 'auto';
          mapContainer.style.right = 'auto';
          mapContainer.style.bottom = 'auto';
          mapContainer.style.zIndex = 'auto';
          mapContainer.style.border = 'none';
          mapContainer.style.outline = 'none';
          mapContainer.style.boxSizing = 'border-box';
          mapContainer.style.display = 'block'; // Ensure visibility
          mapContainer.style.visibility = 'visible'; // Ensure visibility
        }
        
        if (mapElement) {
          // Reset fullscreen-specific styles but keep essential ones for map element
          mapElement.style.position = 'relative';
          mapElement.style.width = '100%';
          mapElement.style.height = '100%';
          mapElement.style.maxWidth = 'none';
          mapElement.style.maxHeight = 'none';
          mapElement.style.minWidth = 'auto';
          mapElement.style.minHeight = 'auto';
          mapElement.style.top = 'auto';
          mapElement.style.left = 'auto';
          mapElement.style.right = 'auto';
          mapElement.style.bottom = 'auto';
          mapElement.style.margin = '0';
          mapElement.style.padding = '0';
          mapElement.style.border = 'none';
          mapElement.style.outline = 'none';
          mapElement.style.boxSizing = 'border-box';
          mapElement.style.display = 'block'; // Ensure visibility
          mapElement.style.visibility = 'visible'; // Ensure visibility
        }
        
        // Reset all child elements styles but preserve essential ones
        const allElements = document.querySelectorAll('#geographicmapcontainer *');
        allElements.forEach(el => {
          if (el.classList.contains('mapboxgl-map') || 
              el.classList.contains('mapboxgl-canvas-container') || 
              el.classList.contains('mapboxgl-canvas')) {
            // Reset fullscreen styles but keep essential display properties
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.maxWidth = 'none';
            el.style.maxHeight = 'none';
            el.style.minWidth = 'auto';
            el.style.minHeight = 'auto';
            el.style.boxSizing = 'border-box';
            el.style.display = 'block'; // Ensure visibility
            el.style.visibility = 'visible'; // Ensure visibility
          }
        });
        
        // Force map resize when exiting fullscreen with multiple resize calls
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
        
        // Additional resize after DOM has settled
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            // Force a redraw to ensure proper rendering
            map.current.getMap().triggerRepaint();
          }
        }, 300);
        
        // Move legend and directions back to their original container
        if (legendControlRef.current && legendControlRef.current.parentNode) {
            legendControlRef.current.parentNode.removeChild(legendControlRef.current);
            document.querySelector('#geographicmapcontainer').appendChild(legendControlRef.current);
        }
        if (directionsPanelRef.current && directionsPanelRef.current.parentNode) {
            directionsPanelRef.current.parentNode.removeChild(directionsPanelRef.current);
            document.querySelector('#geographicmapcontainer').appendChild(directionsPanelRef.current);
        }
      }
      
      // Resize map to fit container
      setTimeout(() => {
        if (map.current) {
          map.current.resize();
        }
      }, 100);

      // Clear message after 3 seconds
      setTimeout(() => {
        setLocationMessage({ text: '', type: '' });
      }, 3000);
    };

    // Add fullscreen event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    // Handle map load
    map.current.on('load', () => {
      console.log('✅ Map loaded successfully');
      setMapLoaded(true);
      isInitializingMap.current = false; // Reset initialization flag
    });

    // Clean up on unmount
    return () => {
      // Remove fullscreen event listeners
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
      }
      
      // Clear markers reference when map is destroyed
      mapMarkersRef.current.clear();
      
      // Clear directions control reference
      if (directionsControl.current) {
        directionsControl.current = null;
      }
      
      // Reset initialization flags
      isInitializingMap.current = false;
      directionsInitialized.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activedashboard]); // Only depend on dashboard switch - mapLoaded intentionally excluded to prevent infinite loop

// Initialize directions control after map is loaded
useEffect(() => {
  if (mapLoaded && activedashboard === 'mappingintegration' && !directionsInitialized.current) {
    console.log('🗺️ Map loaded, initializing directions control...');
    initializeDirectionsControl();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [mapLoaded, activedashboard]); // Remove initializeDirectionsControl from deps to prevent re-runs

// Simplified map container health check - prevent map destruction
useEffect(() => {
  if (activedashboard !== 'mappingintegration' || !map.current) return;

  // Just log that we're monitoring the map health, but don't interfere with it
  console.log('🔍 Map health check - map is active');

  return () => {
    // Cleanup timeout if needed
  };
}, [activedashboard]); // Removed clinicLocations to prevent unnecessary re-renders

// Separate effect for map click handler to avoid dependency issues
useEffect(() => {
  if (!map.current || !mapLoaded) return;

  const handleMapClick = (e) => {
    if (isEditingLocation) {
      const { lng, lat } = e.lngLat;
      setClinicFormData(prev => ({
        ...prev,
        coordinates: { longitude: lng, latitude: lat }
      }));
      
      // Show form dialog
      setShowAddClinicDialog(true);
    }
  };

  map.current.on('click', handleMapClick);

  return () => {
    if (map.current) {
      map.current.off('click', handleMapClick);
    }
  };
}, [mapLoaded, isEditingLocation]);

// Separate effect for real-time coordinate tracking
useEffect(() => {
  if (!map.current || !mapLoaded) return;

  const mapInstance = map.current;

  // Real-time coordinate tracking function
  const updateRealtimeCoordinates = (lngLat) => {
    setRealtimeCoordinates({
      longitude: lngLat.lng,
      latitude: lngLat.lat,
      accuracy: userLocation?.accuracy || null,
      timestamp: new Date()
    });
  };

  // Event handlers
  const handleMouseMove = (e) => {
    updateRealtimeCoordinates(e.lngLat);
  };

  const handleMapMove = () => {
    const center = mapInstance.getCenter();
    updateRealtimeCoordinates(center);
  };

  // Add event listeners
  mapInstance.on('mousemove', handleMouseMove);
  mapInstance.on('move', handleMapMove);

  // Initial coordinate update
  updateRealtimeCoordinates(mapInstance.getCenter());

  // Cleanup function
  return () => {
    if (mapInstance) {
      mapInstance.off('mousemove', handleMouseMove);
      mapInstance.off('move', handleMapMove);
    }
  };
}, [mapLoaded, userLocation]);

// Separate effect for handling clinic markers
useEffect(() => {
  if (!map.current || !mapLoaded || !clinicLocations) return;

  console.log('🔄 Syncing clinic markers with map...');
  const markersOnMap = mapMarkersRef.current;
  const newMarkers = new Map();

  // Add or update markers for current clinic locations
  if (Array.isArray(clinicLocations)) {
    clinicLocations.forEach(clinic => {
      const clinicId = clinic._id;
      if (!clinicId) {
        console.warn('Clinic found with no _id:', clinic);
        return;
      }

      let longitude, latitude;

      if (clinic.coordinates?.coordinates && Array.isArray(clinic.coordinates.coordinates)) {
        longitude = clinic.coordinates.coordinates[0];
        latitude = clinic.coordinates.coordinates[1];
      } else if (clinic.coordinates?.longitude && clinic.coordinates?.latitude) {
        longitude = clinic.coordinates.longitude;
        latitude = clinic.coordinates.latitude;
      }

      if (!longitude || !latitude) {
        console.warn(`Clinic ${clinic.clinicName} has invalid coordinates.`);
        return;
      }

      // If marker already exists, keep it and move it to the new set
      if (markersOnMap.has(clinicId)) {
        const existingMarker = markersOnMap.get(clinicId);
        // Optional: Update position if it can change, though full re-render on location change is often fine
        existingMarker.setLngLat([longitude, latitude]);
        newMarkers.set(clinicId, existingMarker);
        markersOnMap.delete(clinicId); // Mark as processed
      } else {
        // Create a new marker
        const markerEl = document.createElement('img');
        markerEl.className = 'w-10 h-10 rounded-full transition-all duration-200 ease-out will-change-transform transform-gpu hover:shadow-lg cursor-pointer border-2 border-white shadow-md';
        
        if (clinic.clinicType === 'Ambher Optical') {
          markerEl.src = ambherlogo;
        } else if (clinic.clinicType === 'Bautista Eye Center') {
          markerEl.src = bautistalogo;
        } else {
          // Fallback for any other clinic type, though not expected
          markerEl.src = defaultprofilepic; 
        }
        
        markerEl.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        `;

        const popupContent = `
          <div class="bg-white p-4 w-72 sm:w-80 max-w-sm relative">
            
            <div class="flex items-center mb-3 pr-6">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mr-3">
                <img src="${clinic.clinicType === 'Ambher Optical' ? ambherlogo : bautistalogo}" class="w-10 h-10 rounded-full object-cover"/>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-lg text-[#1f1f1f] ">${clinic.clinicName}</h3>
                <span class="inline-block rounded-2xl px-2 py-1 text-[13px] font-semibold ${
                  clinic.clinicType === 'Ambher Optical' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }">
                  ${clinic.clinicType}
                </span>
              </div>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <div class="font-medium flex items-start justify-start"><i class="bx bx-map text-[#b42525] mr-2 mt-0.5 flex-shrink-0"></i><p class="break-words">${clinic.address.fullAddress}</p></div>
              ${clinic.contactInfo.phone ? `<div class="font-medium flex items-center justify-start"><i class="bx bx-phone text-[#209206] mr-2 flex-shrink-0"></i><p class="break-all">${clinic.contactInfo.phone}</p></div>` : ''}
              ${clinic.contactInfo.email ? `<div class="font-medium flex items-start justify-start"><i class="bx bx-envelope text-[#4d9be0] mr-2 mt-0.5 flex-shrink-0"></i><p class="break-all"><a href="mailto:${clinic.contactInfo.email}" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">${clinic.contactInfo.email}</a></p></div>` : ''}
            </div>

            <div class="flex w-full h-10 mb-4 gap-1">
              <div onclick="showDirectionsToClinic('${clinic._id}')" class="gap-1 flex items-center justify-center text-white font-semibold w-1/2 h-full cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#177898] rounded-2xl bg-[#0e80a7] text-xs sm:text-sm"><i class="bx bx-directions"></i> Directions</div>
              <div onclick="window.open('https://www.google.com/maps?layer=c&cbll=${latitude},${longitude}', '_blank')" class="gap-1 flex items-center justify-center text-white font-semibold w-1/2 h-full cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#d39228] rounded-2xl bg-[#dd9a2d] text-xs sm:text-sm"><i class="bx bx-street-view"></i> Street View</div>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false 
        }).setHTML(popupContent);

        // Add event listener to track when this popup opens
        popup.on('open', () => {
          // Close the previously open popup if it exists
          if (currentPopup.current && currentPopup.current !== popup) {
            currentPopup.current.remove();
          }
          // Set this popup as the current one
          currentPopup.current = popup;
        });

        // Add event listener to clear reference when popup closes
        popup.on('close', () => {
          if (currentPopup.current === popup) {
            currentPopup.current = null;
          }
        });

        const newMarker = new mapboxgl.Marker(markerEl)
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map.current);


          
        newMarkers.set(clinicId, newMarker);
      }
    });
  }

  // Remove markers that are no longer in clinicLocations
  markersOnMap.forEach((marker, clinicId) => {
    console.log(`Removing stale marker for clinic ID: ${clinicId}`);
    marker.remove();
  });

  // Update the ref with the new set of markers
  mapMarkersRef.current = newMarkers;

  console.log(`✅ Map synced. Total markers: ${mapMarkersRef.current.size}`);

}, [mapLoaded, clinicLocations, userLocation]); // Include userLocation since it's used in popup content

// Global function for adding nearby clinic from popup
useEffect(() => {
  window.addNearbyClinicToDatabase = (clinicId) => {
    const clinic = nearbyEyeClinics.find(c => c.id === clinicId);
    if (clinic) {
      setSelectedNearbyClinic(clinic);
      setShowAddExternalClinicDialog(true);
    }
  };
  
  return () => {
    delete window.addNearbyClinicToDatabase;
  };
}, [nearbyEyeClinics]);

// Update user location on map
useEffect(() => {
  if (map.current && userLocation) {
    // Add user location marker
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-md animate-location-pulse transform-gpu will-change-auto';

    new mapboxgl.Marker(userMarkerEl)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);

    // Center map on user location with smooth animation
    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 12,
      duration: 2000, // 2 seconds for smooth transition
      essential: true, // This animation is essential for accessibility
      easing: (t) => t * (2 - t) // Smooth easing function (ease-out)
    });
  }
}, [userLocation]);

// Handle clinic form input changes
const handleClinicFormChange = (field, value) => {
  const keys = field.split('.');
  setClinicFormData(prev => {
    const updated = { ...prev };
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return updated;
  });
};

// Add new clinic
const handleAddClinic = async () => {
  try {
    setIsSavingLocation(true);
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        ...clinicFormData,
        longitude: clinicFormData.coordinates.longitude,
        latitude: clinicFormData.coordinates.latitude
      })
    });

    if (response.ok) {
      const newClinic = {
        ...clinicFormData,
        _id: Date.now().toString() // Temporary ID
      };
      setClinicLocations(prev => [...prev, newClinic]);
      setLocationMessage({ text: 'Clinic location added successfully!', type: 'success' });
      setShowAddClinicDialog(false);
      resetClinicForm();
    } else {
      setLocationMessage({ text: 'Failed to add clinic location', type: 'error' });
    }
  } catch (error) {
    console.error('Error adding clinic:', error);
    setLocationMessage({ text: 'Error adding clinic location', type: 'error' });
  } finally {
    setIsSavingLocation(false);
  }
};

// Update clinic
const handleUpdateClinic = async () => {
  try {
    setIsSavingLocation(true);
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${selectedClinicLocation._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        ...clinicFormData,
        longitude: clinicFormData.coordinates.longitude,
        latitude: clinicFormData.coordinates.latitude
      })
    });

    if (response.ok) {
      setClinicLocations(prev => 
        prev.map(clinic => 
          clinic._id === selectedClinicLocation._id ? { ...clinic, ...clinicFormData } : clinic
        )
      );
      setLocationMessage({ text: 'Clinic location updated successfully!', type: 'success' });
      setShowEditClinicDialog(false);
      setSelectedClinicLocation(null);
      resetClinicForm();
    } else {
      setLocationMessage({ text: 'Failed to update clinic location', type: 'error' });
    }
  } catch (error) {
    console.error('Error updating clinic:', error);
    setLocationMessage({ text: 'Error updating clinic location', type: 'error' });
  } finally {
    setIsSavingLocation(false);
  }
};

// Delete clinic
const handleDeleteClinic = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${selectedClinicLocation._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (response.ok) {
      setClinicLocations(prev => 
        prev.filter(clinic => clinic._id !== selectedClinicLocation._id)
      );
      setLocationMessage({ text: 'Clinic location deleted successfully!', type: 'success' });
      setShowDeleteClinicDialog(false);
      setSelectedClinicLocation(null);
    } else {
      setLocationMessage({ text: 'Failed to delete clinic location', type: 'error' });
    }
  } catch (error) {
    console.error('Error deleting clinic:', error);
    setLocationMessage({ text: 'Error deleting clinic location', type: 'error' });
  }
};

// Load clinic locations and user location on component mount
useEffect(() => {
  if (activedashboard === 'mappingintegration') {
    fetchClinicLocations();
    getUserLocation();
  }
}, [activedashboard, fetchClinicLocations, getUserLocation]);

// Load clinic locations automatically for staff/owner users after login
useEffect(() => {
  if (userDataLoaded && (currentuserloggedin === "Staff" || currentuserloggedin === "Owner")) {
    console.log('Auto-loading clinic locations for', currentuserloggedin, 'user after login...');
    
    const loadClinicLocationsOnLogin = async () => {
      try {
        await fetchClinicLocations();
        console.log('Clinic locations loaded successfully for', currentuserloggedin);
      } catch (clinicError) {
        console.error('Error loading clinic locations on login:', clinicError);
        setLocationMessage({ 
          text: 'User logged in successfully, but failed to load clinic locations', 
          type: 'warning' 
        });
      }
    };
    
    loadClinicLocationsOnLogin();
  }
}, [userDataLoaded, currentuserloggedin, fetchClinicLocations]);

// Clear messages after 5 seconds
useEffect(() => {
  if (locationMessage.text) {
    const timer = setTimeout(() => {
      setLocationMessage({ text: '', type: '' });
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [locationMessage]);



// Add this useEffect to create global functions for popup interactions
useEffect(() => {
  // Global function for getting directions from popup
  window.showDirectionsToClinic = (clinicId) => {
    console.log('🧭 Showing directions to clinic:', clinicId);
    console.log('🔍 Debug state:', {
      mapLoaded,
      mapExists: !!map.current,
      directionsControlExists: !!directionsControl.current,
      directionsInitialized: directionsInitialized.current,
      userLocation,
      clinicLocationsCount: clinicLocations?.length || 0
    });
    
    const clinic = clinicLocations.find(c => c._id === clinicId);
    
    if (!clinic) {
      console.error('❌ Clinic not found:', clinicId);
      console.error('Available clinics:', clinicLocations.map(c => ({ id: c._id, name: c.clinicName })));
      alert('Clinic not found. Please try again.');
      return;
    }

    if (!userLocation) {
      console.error('❌ User location not available');
      alert('Please enable location services to get directions');
      return;
    }

    if (!map.current) {
      console.error('❌ Map not initialized');
      alert('Map is not ready. Please try again.');
      return;
    }

    if (!directionsControl.current) {
      console.error('❌ Directions control not initialized');
      console.log('🔄 Attempting to initialize directions control...');
      
      // Try to initialize directions control if it's missing
      if (mapLoaded && activedashboard === 'mappingintegration') {
        initializeDirectionsControl();
        // Wait a moment for initialization
        setTimeout(() => {
          if (directionsControl.current) {
            console.log('✅ Directions control initialized, retrying...');
            window.showDirectionsToClinic(clinicId);
          } else {
            alert('Directions service is not available. Please try again.');
          }
        }, 500);
      } else {
        alert('Directions service is not available. Please try again.');
      }
      return;
    }

    console.log('📍 Setting up route from user location to clinic...');
    console.log('User location:', userLocation);
    console.log('Clinic coordinates:', clinic.coordinates);

    setIsLoadingRoute(true);
    setShowDirections(true);
    setRouteInfo(null);
    setDirectionsSteps([]);

    try {
      // Clear any existing routes first
      directionsControl.current.removeRoutes();
      
      // Set origin (user location) - this will be locked and non-draggable
      directionsControl.current.setOrigin([userLocation.longitude, userLocation.latitude]);
      
      // Set destination (clinic location) - handle different coordinate formats
      let clinicLng, clinicLat;
      
      if (clinic.coordinates?.coordinates && Array.isArray(clinic.coordinates.coordinates)) {
        clinicLng = clinic.coordinates.coordinates[0];
        clinicLat = clinic.coordinates.coordinates[1];
      } else if (clinic.coordinates?.longitude && clinic.coordinates?.latitude) {
        clinicLng = clinic.coordinates.longitude;
        clinicLat = clinic.coordinates.latitude;
      } else {
        console.error('❌ Invalid clinic coordinates format:', clinic.coordinates);
        alert('Invalid clinic coordinates. Cannot calculate route.');
        setIsLoadingRoute(false);
        return;
      }

      console.log('🎯 Setting destination:', [clinicLng, clinicLat]);
      directionsControl.current.setDestination([clinicLng, clinicLat]);
      
      // Fly to show the route area
      map.current.fitBounds([
        [Math.min(userLocation.longitude, clinicLng), Math.min(userLocation.latitude, clinicLat)],
        [Math.max(userLocation.longitude, clinicLng), Math.max(userLocation.latitude, clinicLat)]
      ], {
        padding: 100,
        duration: 1000
      });
      
    } catch (error) {
      console.error('❌ Error setting up directions:', error);
      setIsLoadingRoute(false);
      alert('Failed to calculate route. Please try again.');
    }
  };

  return () => {
    // Cleanup
    delete window.showDirectionsToClinic;
  };
}, [clinicLocations, userLocation, mapLoaded, activedashboard, initializeDirectionsControl]); // Include all dependencies




































































































































































































































































  return (
    <>

     {/* NavBar */}
<div className="rounded-full mt-2 ml-3 mr-3 bg-[#003366] ">
      <header id="header" className="flex justify-between items-center text-black py-4 px-8 md:px-20  ">
        <a id:logocontain href="#" >
   
  {(localStorage.getItem('staffclinic') === 'Ambher Optical' || 
   localStorage.getItem('ownerclinic') === 'Ambher Optical') 
    ?  <div className="gap-2 flex items-center"><img src={ambherlogo} alt="Ambher Optical" className="w-14 hover:scale-105 transition-all   p-1"/><h1 className="font-albertsans font-semibold text-white text-[25px]">Ambher Optical</h1></div>

    : (localStorage.getItem('staffclinic') === 'Bautista Eye Center' || 
   localStorage.getItem('ownerclinic') === 'Bautista Eye Center')     ? 
    <div className="gap-2 flex items-center"><img src={bautistalogo} alt="Bautista Eye Center" className="w-14 hover:scale-105 transition-all   p-1"/><h1 className="font-albertsans font-semibold text-white text-[25px]">Bautista Eye Center</h1></div>
   :<img src={landinglogo} alt="Eye2Wear: Optical Clinic" className="w-60 hover:scale-105 transition-all   p-1"/>
}
        </a>



      {/* Search 
      
              <div className="relative hidden md:flex items-center justify-center gap-3">
          <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
          <input type="text" placeholder="Search..." className="py-2 pl-10 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500"></input>
        </div>
        
      */}





{currentusertoken ? (
    <div className="relative">
    <div id="profile" onClick={showlogout}  className="ml-3  flex justify-center items-center  bg-[#fbfbfb00] rounded-full p-1 hover:cursor-pointer hover:scale-105 transition-all">

     <img src={adminprofilepicture || 'default-profile.png'} alt="Profile" className="h-10 w-10 rounded-full"></img>
    </div>

    {showlogoutbtn && (
         <div id="logoutdiv" className=" absolute left-1/2 transform -translate-x-1/2 ml-3 mt-3  flex justify-center items-center p-3 bg-[#ad4e43] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" onClick={handlelogout}>
         <i className="bx bx-exit mt-1 pr-2 font-semibold text-white text-[17px]"/>
         <p className="font-semibold text-white text-[17px]">Logout</p>
       </div>    
      )}
    </div>


) : (   <Link to="/userlogin">
  <div className="ml-3  flex justify-center items-center p-3 bg-[#027bbf] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" onClick={handlelogout}>
  <i className="bx bx-user-circle mt-1 pr-2 font-semibold text-white text-[17px]"/>
  <p className="font-semibold text-white text-[17px]">Login</p>
</div>
</Link>)}

    
       
 
   

  


  




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
    </div>











    {/* First Section */} {/* First Section */} {/* First Section */} {/* First Section */}
        <section className="h-full  min-w-[99vw] flex justify-center align-center mt-3"   >

    
        
          {/* Conditionally render sidebar - hide for admin role */}
          {!isAdminRole && (
          <div className={`relative z-30 transition-all duration-300 ease-in-out flex flex-col justify-between items-start pl-3 bg-[#272828]  rounded-2xl    ml-3 mb-3 pt-3 pb-3 ${sidebarexpanded ? 'w-[365px]' : 'w-[85px]'}`} id="adminsidebar">

              <div className="group relative " id="expandbtn" onClick={toggleadminsidebar} ><div className="hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl  transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden">{sidebarexpanded &&(<i className='bx bx-collapse-horizontal  p-2 hover:text-white text-white text-[40px] ' ></i>)}   {!sidebarexpanded &&(<i className='bx bx-expand-horizontal  p-2 hover:text-white text-white text-[40px] ' ></i>)}<span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>{sidebarexpanded ? 'Collapse Sidebar' : ''}</span></div></div>
          
              <div className="group relative mt-5" onClick={() => showdashboard('summaryoverview')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl mr-2 transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden ${activedashboard ==='summaryoverview' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bx-list-ul  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='summaryoverview' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>   <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Summary Overview</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute  p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Summary Overview</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('accountmanagement')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden ${activedashboard ==='accountmanagement' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-user-account  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='accountmanagement' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Account Management</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Account Management</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('profileinformation')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='profileinformation' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-user-detail  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='profileinformation' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Profile Information</span>  {!sidebarexpanded && (<span className=" pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Profile Information</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('appointmentmanagement')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='appointmentmanagement' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-calendar  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='appointmentmanagement' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Appointment Management</span>  {!sidebarexpanded && (<span className=" pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Appointment Management</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('medicalrecords')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='medicalrecords' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-data  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='medicalrecords' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Medical Records</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Medical Records</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('inventorymanagement')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='inventorymanagement' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-package   p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='inventorymanagement' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={` text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Inventory Management</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Inventory Management</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('billingsandorders')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='billingsandorders' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-receipt   p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='billingsandorders' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Billing & Orders</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Billing & Orders</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('reportingandanalytics')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='reportingandanalytics' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-report  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='reportingandanalytics' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Reporting & Analytics</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Reporting & Analytics</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('mappingintegration')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='mappingintegration' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bx-street-view p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='mappingintegration' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Mapping Integration</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Mapping Integration</span>)}  </div></div>

              </div>
          )}

        <div  className={`rounded-2xl ${isAdminRole ? 'ml-3' : 'ml-3'} h-screen w-[100%] flex flex-col items-center justify-center mr-3 mb-3`} >
          
          <div className="flex flex-col items-start w-full h-[12%] rounded-2xl" id="greet">
            
            <h1 className="ml-5 mt-1 font-albertsans font-bold text-[40px] text-[#212134]">
              {isAdminRole ? `Good Day, ${adminfirstname}! - Account Management` : `Good Day, ${adminfirstname}!`}
            </h1>
            <p className="ml-5 font-geistsemibold text-[16px] text-[#23232a]">
              {isAdminRole ? 'Manage user accounts and permissions across the system.' : 'Stay on top of your tasks, monitor progress, and track status.'}
            </p>

          </div>


          <div className="w-full h-[88%]  rounded-2xl" id="overview">



















{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{ (activedashboard === 'summaryoverview' && !isAdminRole) && ( <div id="summaryoverview" className="   flex justify-center items-center w-[100%] h-[100%] rounded-2xl" > 
                
    {/* Left */}
    <div className="pl-5 w-[35%] h-full rounded-2xl flex flex-col justify-center items-center mr-2">

     <div id="todaysappointmentcontainer"  className="flex flex-col   h-[100%] bg-[#ffffff]    shadow-lg w-full  rounded-2xl pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out ">

        <div className="flex items-center"><i className="bx bxs-calendar text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Today's Appointment</h1></div>
        <p className="font-geistmedium text-[13px] text-[#333333]">{currenttime.toLocaleDateString(undefined, currentdateoption)}</p>
        <p className="font-geistmedium text-[13px] text-[#333333]">{currenttime.toLocaleTimeString(undefined, currenttimeoption)}</p>


      </div>




    </div>


    {/* Right */}
    <div className=" w-[65%] h-[100%] rounded-2xl flex flex-col justify-center items-center ml-2">
      <div className=" w-full h-[40%] rounded-2xl mb-2 flex justify-center items-center">



        <div className="pl-5 pr-5 pb-4 pt-4  transition-all duration-300 ease-in-out  shadow-lg w-[55%] mr-2 h-full rounded-2xl bg-[#ffffff]   " id="stockscontainer">
        <div className="flex items-center"><i className="bx bxs-package text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Stock Inventory</h1></div>

        </div>






        <div className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300 ease-in-out  shadow-lg w-[45%] ml-2 h-full rounded-2xl bg-[#ffffff]   " id="unreadmessagescontainer">
        <div className="flex items-center"><i className="bx bxs-message-dots text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Unread Messages</h1></div>

        </div>





      </div>

      
      <div id="pendingorderscontainer"  className="flex flex-col   h-[60%] bg-[#ffffff]    shadow-lg w-full  rounded-2xl pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out ">

        <div className="flex items-center"><i className="bx bxs-cart-alt text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Pending Orders</h1></div>


        </div>

    </div>  


  
   </div> )}


















































          
              { (activedashboard === 'reportingandanalytics' && !isAdminRole) && ( <div id="reportingandanalytics" className="border-2 border-red-500 w-[100%] h-[100%] rounded-2xl" >  asdasd5 </div> )}






















            {(activedashboard === 'mappingintegration' && !isAdminRole) && (
              <div id="mappingintegration" className="flex flex-col pl-5 pr-5 pb-3 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] min-h-full h-auto rounded-2xl">
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <i className="bx bx-street-view text-[#184d85] text-[30px] mr-3"/>
                    <div>
                      <h1 className="font-albertsans font-bold text-[#184d85] text-[28px]">Clinic Location Management</h1>

                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <div
                      onClick={getUserLocation}
                      disabled={loadingUserLocation}
                      className={`rounded-2xl cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out  px-4 py-2 text-white  font-medium flex items-center gap-2 ${
                        userLocation 
                          ? userLocation.accuracy <= 20 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : userLocation.accuracy <= 50 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : userLocation.accuracy <= 100 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-red-500 hover:bg-red-600'
                          : 'bg-purple-500 hover:bg-purple-600'
                      } disabled:opacity-50`}
                    >
                      <i className={`bx ${loadingUserLocation ? 'bx-loader-alt bx-spin' : 'bx-current-location'}`}></i>
                      <div className=" select-none   rounded-2xl cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out flex flex-col items-start">
                        <span className="text-sm">
                          {loadingUserLocation ? 'Finding Location...' : userLocation ? 'Update Location' : 'Get My Location'}
                        </span>
                        {userLocation && !loadingUserLocation && (
                          <span className="text-xs opacity-90">
                            {userLocation.accuracy <= 20 ? 'Excellent' :
                             userLocation.accuracy <= 50 ? 'Good' :
                             userLocation.accuracy <= 100 ? 'Fair' : 'Poor'} 
                            ({Math.round(userLocation.accuracy)}m)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div
                      onClick={() => {
                        resetClinicForm();
                        setShowAddClinicDialog(true);
                      }}
                      className="select-none flex items-center rounded-2xl cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out  px-4 py-2 bg-green-500 text-white  hover:bg-green-600 font-medium"
                    >
                      <i className="bx bx-plus mr-2"></i>
                      Add Clinic
                    </div>
                    
                    <div
                      onClick={() => setIsEditingLocation(!isEditingLocation)}
                      className={`flex items-center select-none rounded-2xl cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out px-4 py-2  font-medium  ${
                        isEditingLocation 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <i className={`bx ${isEditingLocation ? 'bx-x' : 'bx-edit'} mr-2`}></i>
                      {isEditingLocation ? 'Cancel Edit' : 'Edit Mode'}
                    </div>
                  </div>
                </div>



                {/* Loading States */}
                {loadingClinicLocations && (
                  <div className="transition-all duration-300 ease-in-out mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <i className="bx bx-loader-alt bx-spin text-blue-500 mr-2"></i>
                      <span className="text-blue-700">Loading clinic locations...</span>
                    </div>
                  </div>
                )}

                {/* Main Content - Map and Sidebar */}
                <div className="transition-all duration-300 ease-in-out gap-4 flex justify-center items-start flex-1 h-[580px]">
                  
                  {/* Geographic Map Container - 70% width */}
                  <div id="geographicmapcontainer" className="transition-all duration-300 ease-in-out relative bg-gray-100 rounded-2xl shadow-lg flex flex-col justify-center items-center w-[70%] h-[580px] overflow-hidden">
                    {/* Mapbox Container */}
                    <div 
                      ref={mapContainer}
                      className="transition-all duration-300 ease-in-out w-full h-full rounded-2xl"
                      style={{ 
                        minHeight: '580px',
                        height: '580px',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden'
                      }}
                    />
                    
                    {/* Loading State */}
                    {!mapLoaded && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                          <p className="text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    )}

                    {/* Edit Mode Instructions */}
                    {isEditingLocation && mapLoaded && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <i className="bx bx-info-circle text-blue-500"></i>
                          Edit Mode Active
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Click anywhere on map to add new clinic</li>
                          <li>• Click existing markers for options</li>
                          <li>• Use controls to navigate</li>
                        </ul>
                      </div>
                    )}

                    {/* Directions Panel */}
                    {showDirections && (
                      <div 
                        ref={directionsPanelRef} 
                        className={` absolute top-2.5 left-2.5 w-80   bg-white rounded-xl shadow-xl z-[1000] overflow-hidden transition-transform duration-300 ease-in-out ${
                          showDirections ? 'translate-x-0' : '-translate-x-full'
                        }`}
                      >
                        {/* Directions Header */}
                        <div className="bg-[#2781af] text-white p-4 flex justify-between items-center">
                          <h3 className="font-bold">Directions</h3>
                          <button 
                            onClick={clearDirections}
                            className="bg-transparent border-none text-white text-lg cursor-pointer p-1 rounded hover:bg-white/20 transition-colors duration-200"
                            title="Close directions"
                          >
                            <i className="bx bx-x"></i>
                          </button>
                        </div>
                        
                        {/* Directions Content */}
                        <div className="directions-content h-auto max-h-[480px] overflow-y-auto p-2.5">
                          {isLoadingRoute && (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                              <span className="ml-3 text-gray-600">Calculating route...</span>
                            </div>
                          )}
                          
                          {!isLoadingRoute && !routeInfo && directionsSteps.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <i className="bx bx-map-pin text-4xl mb-2"></i>
                              <p>Select a destination to get directions</p>
                            </div>
                          )}
                          
                          {routeInfo && (
                            <div className="bg-gray-50 p-2.5 mb-2.5 rounded-lg border-l-4 border-[#2781af]">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-800">{routeInfo.distance} km</p>
                                  <p className="text-sm text-gray-600">{routeInfo.duration} minutes</p>
                                </div>
                                <i className="bx bx-car text-2xl text-blue-500"></i>
                              </div>
                            </div>
                          )}
                          
                          {directionsSteps.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 text-gray-800">Turn-by-turn directions:</h4>
                              {directionsSteps.map((step, index) => (
                                <div key={index} className={`py-2 flex items-center gap-2.5 ${index !== directionsSteps.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                  <div className="w-6 h-6 bg-[#2781af] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                                    <i className={`bx ${getStepIcon(step.maneuver.type)}`}></i>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm leading-snug" dangerouslySetInnerHTML={{ __html: step.maneuver.instruction }}></p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {(step.distance / 1000).toFixed(1)} km
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}






                    {/* Map Legend */}
                    <div ref={legendControlRef} className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
                      <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <img src={ambherlogo} className="w-4 h-4 rounded-full"/>
                          <span>Ambher Optical</span>
                        </div>
                        <div className="flex items-center gap-2">
                       <img src={bautistalogo} className="w-4 h-4 rounded-full"/>
                          <span>Bautista Eye Center</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow animate-pulse"></div>
                          <span>Your Location</span>
                        </div>
                        {userLocation && (
                          <div className="border-t pt-2 mt-2">
                            <div className="text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <i className={`bx ${
                                  userLocation.accuracy <= 20 ? 'bx-check-circle text-green-500' :
                                  userLocation.accuracy <= 50 ? 'bx-check-circle text-blue-500' :
                                  userLocation.accuracy <= 100 ? 'bx-error-circle text-yellow-500' :
                                  'bx-error-circle text-red-500'
                                }`}></i>
                                <span>Accuracy: {Math.round(userLocation.accuracy)}m</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clinic Locations Container - 30% width */}
                  <div id="cliniclocationscontainer" className="bg-white shadow-lg rounded-2xl flex flex-col w-[30%] h-[580px] overflow-y-auto">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h3 className="font-bold text-gray-800 mb-1 flex items-center">
                        <i className="bx bx-list-ul mr-2 text-[#184d85]"></i>
                        Clinic Locations
                      </h3>
                      <p className="text-sm text-gray-600">Total: {clinicLocations?.length || 0} clinics</p>
                    </div>
                    
                    {/* Clinic List */}
                    <div className="flex-1   overflow-y-auto p-4 space-y-3">
                      {loadingClinicLocations ? (
                        <div className="text-center text-gray-500 py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                          <p>Loading clinic locations...</p>
                        </div>
                      ) : !clinicLocations || clinicLocations.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <div className="text-4xl mb-2">🏥</div>
                          <p className="font-medium">No clinics found</p>
                          <p className="text-xs mt-2 text-gray-400">Add your first clinic location</p>
                          <button
                            onClick={() => {
                              resetClinicForm();
                              setShowAddClinicDialog(true);
                            }}
                            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <i className="bx bx-plus mr-1"></i>
                            Add First Clinic
                          </button>
                        </div>
                      ) : (
                        clinicLocations.map((clinic, index) => (
                          <div
                            key={clinic._id || `clinic-${index}`}
                            className="p-3 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 bg-white"
                            onClick={() => {
                              setSelectedClinicLocation(clinic);
                              setShowClinicDetailsDialog(true);
                              // Center map on clinic
                              if (map.current && clinic.coordinates?.coordinates) {
                                map.current.flyTo({
                                  center: [clinic.coordinates.coordinates[0], clinic.coordinates.coordinates[1]],
                                  zoom: 16,
                                  duration: 1500
                                });
                              }
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{clinic.clinicName}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                clinic.clinicType === 'Ambher Optical'
                                  ? 'bg-blue-100 text-blue-800'
                                  : clinic.clinicType === 'Bautista Eye Center'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {clinic.clinicType === 'Ambher Optical' ? 'Ambher' : 
                                 clinic.clinicType === 'Bautista Eye Center' ? 'Bautista' : 'External'}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{clinic.address?.fullAddress || 'Address not available'}</p>
                            
                            {clinic.contactInfo?.phone && (
                              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                <i className="bx bx-phone"></i>
                                {clinic.contactInfo.phone}
                              </div>
                            )}
                            
                            {/* Coordinates Display */}
                            {clinic.coordinates?.coordinates && (
                              <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                <i className="bx bx-current-location"></i>
                                {clinic.coordinates.coordinates[1].toFixed(4)}°, {clinic.coordinates.coordinates[0].toFixed(4)}°
                              </div>
                            )}
                            
                            {/* Active Status Display */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                clinic.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  clinic.isActive ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                {clinic.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                            
                            <div className="flex gap-1 mt-3">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClinicLocation(clinic);
                                  setClinicFormData({
                                    ...clinic,
                                    address: clinic.address || { fullAddress: '' },
                                    contactInfo: clinic.contactInfo || { phone: '', email: '' },
                                    coordinates: clinic.coordinates ? {
                                      longitude: clinic.coordinates.coordinates[0],
                                      latitude: clinic.coordinates.coordinates[1]
                                    } : { longitude: 121.0583, latitude: 14.6091 }
                                  });
                                  setShowEditClinicDialog(true);
                                }}
                                className="flex-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                              >
                                <i className="bx bx-edit"></i>
                                Edit
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleClinicStatus(clinic);
                                }}
                                className={`flex-1 px-2 py-1 rounded text-xs transition-colors flex items-center justify-center gap-1 ${
                                  clinic.isActive 
                                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                                title={clinic.isActive ? 'Deactivate clinic' : 'Activate clinic'}
                              >
                                <i className={`bx ${clinic.isActive ? 'bx-pause' : 'bx-play'}`}></i>
                                {clinic.isActive ? 'Deactivate' : 'Activate'}
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClinicLocation(clinic);
                                  setShowDeleteClinicDialog(true);
                                }}
                                className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                              >
                                <i className="bx bx-trash"></i>
                                Delete
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

        {/* Add Clinic Dialog */}
        {showAddClinicDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add New Clinic Location</h3>
                <button
                  onClick={() => setShowAddClinicDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="bx bx-x text-2xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name *
                    </label>
                    <input
                      type="text"
                      value={clinicFormData?.clinicName || ''}
                      onChange={(e) => setClinicFormData(prev => ({ ...prev, clinicName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Type *
                    </label>
                    <select
                      value={clinicFormData?.clinicType || 'Ambher Optical'}
                      onChange={(e) => setClinicFormData(prev => ({ ...prev, clinicType: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="Ambher Optical">Ambher Optical</option>
                      <option value="Bautista Eye Center">Bautista Eye Center</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={clinicFormData?.address?.fullAddress || ''}
                    onChange={(e) => setClinicFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, fullAddress: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="Enter complete address"
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={clinicFormData?.contactInfo?.phone || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={clinicFormData?.contactInfo?.email || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Location Coordinates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={clinicFormData?.coordinates?.longitude || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        coordinates: { ...prev.coordinates, longitude: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Click map or enter longitude"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={clinicFormData?.coordinates?.latitude || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        coordinates: { ...prev.coordinates, latitude: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Click map or enter latitude"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <i className="bx bx-info-circle mr-1"></i>
                    {isEditingLocation 
                      ? "Edit mode is active. Click anywhere on the map to set the location."
                      : "Enable edit mode and click on the map to set precise coordinates."
                    }
                  </p>
                  {clinicFormData?.coordinates?.longitude && clinicFormData?.coordinates?.latitude && (
                    <p className="text-xs text-blue-600 mt-1">
                      Current: {clinicFormData.coordinates.latitude.toFixed(6)}°, {clinicFormData.coordinates.longitude.toFixed(6)}°
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddClinicDialog(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveClinicLocation}
                    disabled={isSavingLocation}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    {isSavingLocation ? 'Saving...' : 'Save Location'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Clinic Dialog */}
        {showEditClinicDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Clinic Location</h3>
                <button
                  onClick={() => setShowEditClinicDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="bx bx-x text-2xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Same form fields as Add Dialog but with edit data */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Name *
                    </label>
                    <input
                      type="text"
                      value={clinicFormData?.clinicName || ''}
                      onChange={(e) => setClinicFormData(prev => ({ ...prev, clinicName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter clinic name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Type *
                    </label>
                    <select
                      value={clinicFormData?.clinicType || 'Ambher Optical'}
                      onChange={(e) => setClinicFormData(prev => ({ ...prev, clinicType: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="Ambher Optical">Ambher Optical</option>
                      <option value="Bautista Eye Center">Bautista Eye Center</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={clinicFormData?.address?.fullAddress || ''}
                    onChange={(e) => setClinicFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, fullAddress: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="Enter complete address"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={clinicFormData?.contactInfo?.phone || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={clinicFormData?.contactInfo?.email || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={clinicFormData?.coordinates?.longitude || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        coordinates: { ...prev.coordinates, longitude: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Click map or enter longitude"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={clinicFormData?.coordinates?.latitude || ''}
                      onChange={(e) => setClinicFormData(prev => ({ 
                        ...prev, 
                        coordinates: { ...prev.coordinates, latitude: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Click map or enter latitude"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditClinicDialog(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateClinicLocation}
                    disabled={isSavingLocation}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                  >
                    {isSavingLocation ? 'Updating...' : 'Update Location'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Clinic Dialog */}
        {showDeleteClinicDialog && selectedClinicLocation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Delete Clinic Location</h3>
                <button
                  onClick={() => setShowDeleteClinicDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="bx bx-x text-2xl"></i>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <i className="bx bx-error-circle text-red-500 text-xl mt-0.5"></i>
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">Confirm Deletion</h4>
                      <p className="text-red-700 text-sm">
                        Are you sure you want to delete <strong>"{selectedClinicLocation.clinicName}"</strong>? 
                        This action cannot be undone.
                      </p>
                      <div className="mt-2 text-xs text-red-600">
                        <p>• Location: {selectedClinicLocation.address?.fullAddress}</p>
                        <p>• Type: {selectedClinicLocation.clinicType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteClinicDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClinicLocation}
                  disabled={isSavingLocation}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors"
                >
                  {isSavingLocation ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Clinic Details Dialog */}
        {showClinicDetailsDialog && selectedClinicLocation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Clinic Details</h3>
                <button
                  onClick={() => setShowClinicDetailsDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="bx bx-x text-2xl"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    selectedClinicLocation.clinicType === 'Ambher Optical' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedClinicLocation.clinicName}</h4>
                    <span className="text-sm text-gray-600">{selectedClinicLocation.clinicType}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <i className="bx bx-map-pin text-gray-500 mt-1"></i>
                  <p className="text-gray-700">{selectedClinicLocation.address?.fullAddress}</p>
                </div>
                
                {selectedClinicLocation.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <i className="bx bx-phone text-gray-500"></i>
                    <p className="text-gray-700">{selectedClinicLocation.contactInfo.phone}</p>
                  </div>
                )}
                
                {selectedClinicLocation.contactInfo?.email && (
                  <div className="flex items-center gap-2">
                    <i className="bx bx-envelope text-gray-500"></i>
                    <p className="text-gray-700">{selectedClinicLocation.contactInfo.email}</p>
                  </div>
                )}
                
                {selectedClinicLocation.coordinates?.coordinates && (
                  <div className="flex items-center gap-2">
                    <i className="bx bx-current-location text-gray-500"></i>
                    <p className="text-gray-700 text-sm">
                      {selectedClinicLocation.coordinates.coordinates[1].toFixed(6)}°, {selectedClinicLocation.coordinates.coordinates[0].toFixed(6)}°
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setClinicFormData({
                      ...selectedClinicLocation,
                      address: selectedClinicLocation.address || { fullAddress: '' },
                      contactInfo: selectedClinicLocation.contactInfo || { phone: '', email: '' },
                      coordinates: selectedClinicLocation.coordinates ? {
                        longitude: selectedClinicLocation.coordinates.coordinates[0],
                        latitude: selectedClinicLocation.coordinates.coordinates[1]
                      } : { longitude: 121.0583, latitude: 14.6091 }
                    });
                    setShowClinicDetailsDialog(false);
                    setShowEditClinicDialog(true);
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowClinicDetailsDialog(false);
                    setShowDeleteClinicDialog(true);
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        
     
 

     

 

      
      
          </div></div>
          </section>
    </>
  )
}

export default AdminDashboard