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
import { checkAndUpdateOrderStatus, updateAmbherOrderStatus, updateBautistaOrderStatus } from '../utils/orderStatusUpdater';









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

  /* Always ensure map container and map have full size */
  #geographicmapcontainer {
    width: 100% !important;
    height: 100% !important;
    min-height: 580px !important;
    position: relative !important;
    background: #000 !important;
  }
  .mapboxgl-map {
    width: 100% !important;
    height: 100% !important;
    min-height: 580px !important;
    position: relative !important;
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

  // Stock alert visibility states - reset on page reload
  const [hiddenAmbherOutOfStock, setHiddenAmbherOutOfStock] = useState(false);
  const [hiddenAmbherCriticalStock, setHiddenAmbherCriticalStock] = useState(false);
  const [hiddenAmbherLowStock, setHiddenAmbherLowStock] = useState(false);
  const [hiddenBautistaOutOfStock, setHiddenBautistaOutOfStock] = useState(false);
  const [hiddenBautistaCriticalStock, setHiddenBautistaCriticalStock] = useState(false);
  const [hiddenBautistaLowStock, setHiddenBautistaLowStock] = useState(false);



  
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

  // Helper function to get user's allowed clinic type(s)
  const getUserAllowedClinicTypes = useCallback(() => {
    if (currentuserloggedin === "Admin") {
      return ['Ambher Optical', 'Bautista Eye Center']; // Admin can create any type
    } else if (currentuserloggedin === "Staff") {
      const userClinic = localStorage.getItem('staffclinic') || staffclinic;
      return userClinic === "Bautista Eye Center" ? ['Bautista Eye Center'] : ['Ambher Optical'];
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic === "Bautista Eye Center" ? ['Bautista Eye Center'] : ['Ambher Optical'];
    }
    return ['Ambher Optical']; // Default fallback
  }, [currentuserloggedin, staffclinic, ownerownedclinic]);

  // Helper function to get user's default clinic type
  const getUserDefaultClinicType = useCallback(() => {
    if (currentuserloggedin === "Staff") {
      return localStorage.getItem('staffclinic') || staffclinic || 'Ambher Optical';
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic || 'Ambher Optical';
    }
    return 'Ambher Optical'; // Default for admin and others
  }, [currentuserloggedin, staffclinic, ownerownedclinic]);


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













//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
//PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE //PATIENT ACCOUNT TABLE
const [showaddpatientdialog, setshowaddpatientdialog] = useState(false);
const [showviewpatientdialog, setshowviewpatientdialog] = useState(false);
const [showdeletepatientdialog, setshowdeletepatientdialog] = useState(false);
const [patients, setpatients] = useState([]);
const [selectedpatientaccount, setselectedpatientaccount] = useState(null);
const [selectededitpatientaccount, setselectededitpatientaccount] = useState(null);
const [loadingpatients, setloadingpatients] = useState(true);
const [failedloadingpatients, setfailedloadingpatients] = useState(null);
const [selectedprofile, setselectedprofile] = useState(null);
const [previewimage, setpreviewimage] = useState (null);
const imageinputref = useRef(null);
const [searchpatients, setsearchpatients] = useState('');
const [filteredpatients, setfilteredpatients] = useState([]);
const [emailexist, setemailexist] = useState(false);
const [checkemail, setcheckemail] = useState(false);
const [emailerror, setemailerror] = useState(false);
const emailcharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const [issubmitting, setissubmitting] = useState(false);
const [isdeletingpatient, setisdeletingpatient] = useState(false);
const [message, setmessage] = useState({ text:'', type:''});


//Blank variables that stores all data to be sent to database
const [formdata, setformdata] = useState({
    role:'Patient',
    patientemail:'',
    patientpassword:'',
    patientlastname:'',
    patientfirstname:'',
    patientmiddlename:'',
    patientprofilepicture:'' // Holds the profile picture 
});

//Debounce check for search input
const searchpatientdebounce = (functions, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => functions.apply(this, args), delay);
  }
};

//Patient search filter
const filterpatientaccount = useCallback(searchpatientdebounce((term) => {
  if(!term) {
    setfilteredpatients(patients);
    return;
  }

  const filtered = patients.filter(patient =>
    patient.patientlastname.toLowerCase().includes(term.toLowerCase()) ||
    patient.patientfirstname.toLowerCase().includes(term.toLowerCase()) ||
    patient.patientmiddlename.toLowerCase().includes(term.toLowerCase()) ||
    patient.patientemail.toLowerCase().includes(term.toLowerCase()) ||
    patient.patientId.toString().includes(term)
  );

  setfilteredpatients(filtered);
}, 300), [patients]);

//Fetching patient list and data from database
useEffect(() => {
  if(activeaccounttable === 'patientaccounttable'){

    const fetchpatients = async () => {
      try{

        const fetchresponse = await fetch('/api/patientaccounts', {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if(!fetchresponse.ok){
          throw new Error("Failed to fetch patient accounts");
        }

        const patientdata = await fetchresponse.json();
        setpatients(patientdata);
      
      }catch(error){
        setfailedloadingpatients(error.message);
      }finally{
        setloadingpatients(false);
      }
    };
    fetchpatients();

  }
}, [activeaccounttable]);

//Patient Filter
useEffect(() => {
  filterpatientaccount(searchpatients);
}, [searchpatients, filterpatientaccount]);

const renderpatientaccounts = () => {

const patientstorender = searchpatients ? filteredpatients : patients;
const paginatedPatients = getPaginatedData(patientstorender, 'patients');
const totalPatients = patientstorender.length;
const totalPages = Math.ceil(totalPatients / itemsPerPage);

if (loadingpatients) {
  return (
    <div>
      <div className="overflow-x-auto w-full h-full">
        <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
          <thead className="rounded-tl-2xl rounded-tr-2xl">
            <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
              <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
              <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>          
              <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {[...Array(5)].map((_, index) => (
              <TableRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

if (failedloadingpatients) {
  return (
    <div className="overflow-x-auto w-full h-full">
      <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
        <thead className="rounded-tl-2xl rounded-tr-2xl">
          <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
            <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>          
            <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <tr>
            <td colSpan="9" className="p-4 bg-red-50 text-red-600 text-center">
              Error: {failedloadingpatients}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

if(searchpatients && filteredpatients.length == 0){
  return(
    <div className="overflow-x-auto w-full h-full">
      <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
        <thead className="rounded-tl-2xl rounded-tr-2xl">
          <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
            <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>          
            <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <tr>
            <td colSpan="9" className="rounded-2xl py-6 px-4 bg-yellow-50 text-yellow-600 text-center">
              No patients found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

return (
  <div>
    <div className="overflow-x-auto w-full h-full">
      <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
        <thead className="rounded-tl-2xl rounded-tr-2xl">
          <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
            <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>          
            <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl">Actions</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-200 bg-white">
        {paginatedPatients.map((patient) => (
          <tr key={patient._id}  className="hover:bg-gray-100  items-center justify-center transition-all duration-300 ease-in-out hover:cursor-pointer ">
            <td  className="py-3 px-6 text-[#3a3a3a] font-albertsans font-medium ">#{patient.patientId}</td>
            <td  className="py-3 px-6 text-center">
              <div className="flex justify-center">
              <img 
                src={patient.patientprofilepicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'default-profile-url'; 
                }}
              />
              </div>
            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">{patient.patientlastname}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium max-w-[150px]">{patient.patientfirstname}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{patient.patientmiddlename}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <a href={`mailto:${patient.patientemail}`} className="text-blue-400 hover:underline">
                {patient.patientemail}
              </a>

            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <span className={`rounded-2xl text-xs px-5 py-4 ${patient.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                {patient.isVerified ? 'Active' : 'Pending'}
              </span>
            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
              {new Date(patient.createdAt).toLocaleDateString('en-US',{
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap flex items-center justify-center gap-2">
              <div onClick={() =>  {
              setselectededitpatientaccount({
                 id: patient._id,
                 email: patient.patientemail,
                 lastname: patient.patientlastname,
                 firstname: patient.patientfirstname,
                 middlename: patient.patientmiddlename,
                 profilepicture: patient.patientprofilepicture
                 });

              setformdata({
                role: 'Patient',
                patientemail: patient.patientemail,
                patientpassword: patient.patientpassword,
                patientlastname: patient.patientlastname,
                patientfirstname: patient.patientfirstname,
                patientmiddlename: patient.patientmiddlename,
                patientprofilepicture: patient.patientprofilepicture
              });

              setpreviewimage(patient.patientprofilepicture);
              setshowviewpatientdialog(true);}}

             className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-pencil text-white mr-1"/><h1 className="text-white">Edit</h1></div>
             
             <div onClick={() =>  {
              setselectedpatientaccount({
                 id: patient.patientId,
                 email: patient.patientemail,
                 name: `${patient.patientfirstname} ${patient.patientlastname}`});
                          
              setshowdeletepatientdialog(true);}}

             className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>
             
             </td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
    
    {/* Pagination Component */}
    {totalPatients > 0 && (
      <PaginationComponent
        currentPage={currentPage.patients}
        totalPages={totalPages}
        onPageChange={(page) => handlePageChange('patients', page)}
        totalItems={totalPatients}
        itemsPerPage={itemsPerPage}
      />
    )}
  </div>
);
};

//PROFILE IMAGE TYPE HANDLING
const handleprofilechange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;


  const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
  if(!imagefiletype.includes(file.type)) {
    alert("Please select an image file (JPG or PNG)");
    return;
  }


  const maximagefile = 1;
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 1MB");
    return;
  }

  setselectedprofile(null);
  setpreviewimage(null);

  if(imageinputref.current){
    imageinputref.current.value = "";
  }






  try{

    const imageconfiguration = {
      maximagemb: 1,
      maxworh: 800,
      useWebWorker: true,
      initialQuality: 0.8
    };


    const compressedimageprofile = await imageCompression(file, imageconfiguration);
    const reader = new FileReader();
    reader.onloadend = () => {

      if(reader.error){
        console.error("Error processing image file : ", reader.error);
        alert("Error processing image file. Try again");
        return;
      }
      setpreviewimage(reader.result);
    };


    reader.onerror = () => {
      console.error("File Reader Error : ", reader.error);
      alert("Error reading file. Try again");
      return;
    };

    reader.readAsDataURL(compressedimageprofile);
    setselectedprofile(compressedimageprofile);
  

  } catch (error) {

    console.error("Image file compression failed : ", error.message);
    alert("Image file compression failed. Try again");
    return;

  }
    

};

//Handles the click event of upload button
const handleuploadclick = () => {
  imageinputref.current.click();
};

const handleremoveprofile = () => {
  setselectedprofile(null);
  setpreviewimage(null);
  if(imageinputref.current){
    imageinputref.current.value = "";
  }
}


//Chceks if email is already existing
useEffect(() => {
      const debounceemailcheck = async () => {
        
        //Don't check if email input is empty
        if(!formdata.patientemail) {
          setemailerror(false);
          setemailexist(false);
          return;
        }



        if(!emailcharacters.test(formdata.patientemail)) {
          setemailerror(true);
          return;
        }

        setcheckemail (true);

        try{
          //Request to server if the email exists in patientaccounts collection
          const patientresponse = await fetch(
            `/api/patientaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`
     
          );



          //Request to server if the email exists in staffaccounts collection
          const staffresponse = await fetch(
             `/api/staffaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`
                 
          );


          //Request to server if the email exists in adminaccounts collection
          const ownerresponse = await fetch(
              `/api/owneraccounts/check-email/${encodeURIComponent(formdata.patientemail)}`
                 
           );


          //Request to server if the email exists in adminaccounts collection
          const adminresponse = await fetch(
              `/api/adminaccounts/check-email/${encodeURIComponent(formdata.patientemail)}`
                 
          );
          
        const patientdata = await patientresponse.json();
        const staffdata = await staffresponse.json();
        const ownerdata = await ownerresponse.json();
        const admindata = await adminresponse.json();

        //Save wether email existss in db
        setemailexist(patientdata.exists || staffdata.exists  ||  ownerdata.exists   ||  admindata.exists); 
        setemailerror(patientdata.exists || staffdata.exists  ||  ownerdata.exists   ||  admindata.exists);




      }catch(error){
        console.error("Failed email validation:", error);
      }finally{
        //Check email done
        setcheckemail(false);
      }

      }

      const timer = setTimeout(debounceemailcheck, 500);
      return () => clearTimeout(timer); //Cleanup
}, [formdata.patientemail]);





  //Handlechange function to be used in input forms
const handlechange = (e) => {
    const {name, value} = e.target
    setformdata(prev => ({
      ...prev,
      [name]: value
    }))
} 

  
//INSERT PATIENT ACCOUNT  //INSERT PATIENT ACCOUNT  //INSERT PATIENT ACCOUNT   //INSERT PATIENT ACCOUNT  //INSERT PATIENT ACCOUNT  //INSERT PATIENT ACCOUNT 
  const handlesubmit = async (e) => {
    e.preventDefault()
    setissubmitting(true)
    setmessage({
      text:'', type:''
    })

  try{

    const patientaccsubmission = {
      ...formdata,
      patientprofilepicture: previewimage || formdata.patientprofilepicture
    };

//Sends all patient data to the server
    const response = await fetch(`/api/patientaccounts`,{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            'Authorization': `Bearer ${currentusertoken}`
          },
          body: JSON.stringify(patientaccsubmission)
    });


    await axios.post(`/api/accountcreation/patient`, {
      email: formdata.patientemail, 
      password: formdata.patientpassword});

    await response.json();
    setmessage({text:"Registration Sucessful!",type:"success"});
      
  
      //Resets the input forms except the profile picture
      setformdata({
        role: 'Patient',
        patientemail:'',
        patientpassword:'',
        patientlastname:'',
        patientfirstname:'',
        patientmiddlename:'',
        patientprofilepicture: ''
      });

      setselectedprofile(null);
      setpreviewimage(null);


 
  //Error encounter  
    } catch(error) {
      console.error("Error:", error)
      setmessage({text:"Registration Failed. Try again",type:"error"});
           
    } finally {
      setissubmitting(false)
    }
}

//DELETE PATIENT ACCOUNT    //DELETE PATIENT ACCOUNT    //DELETE PATIENT ACCOUNT    //DELETE PATIENT ACCOUNT    //DELETE PATIENT ACCOUNT    //DELETE PATIENT ACCOUNT  
  const deletepatientaccount = async () => {
    try{
      if(!selectedpatientaccount) return;

      setisdeletingpatient(true);

      const response = await fetch(`/api/patientaccounts/${selectedpatientaccount.id}`,{
        method: 'DELETE',
        headers:{
          'Authorization': `Bearer ${currentusertoken}`
        }
      });



      await axios.post(`/api/accountdeletion/patient`, {
        email: selectedpatientaccount.email});



      if(!response.ok){
        throw new Error("Failed to delete patient account");
      }



      const fetchresponse = await fetch('/api/patientaccounts', {
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
          }
      });

      if(!fetchresponse.ok) {
        throw new Error("Failed to retrieve updated patientaccounts table");
      }

      const patientaccounts = await fetchresponse.json();
      setpatients(patientaccounts);

      setshowdeletepatientdialog(false);
      setselectedpatientaccount(null);

      
    }catch (error){
      console.error("Failed deleting patient: ", error);
    } finally {
      setisdeletingpatient(false);
    }
  };

//UPDATE PATIENT ACCOUNT  //UPDATE PATIENT ACCOUNT  //UPDATE PATIENT ACCOUNT  //UPDATE PATIENT ACCOUNT  //UPDATE PATIENT ACCOUNT  //UPDATE PATIENT ACCOUNT
  const updatepatientaccount = async (e) => {
    
    e.preventDefault();
    setissubmitting(true);
    setmessage({text:'', type:''});

    try{
      if(!selectededitpatientaccount) return;

      const updatepatientaccountdetails = {
        ...formdata,
        patientprofilepicture: previewimage || formdata.patientprofilepicture
      };

      const response = await fetch(`/api/patientaccounts/${selectededitpatientaccount.id}`,{
        method:'PUT',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}`
        },
        body: JSON.stringify(updatepatientaccountdetails)
      });


      if(!response.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update patient account");
      }

      const fetchresponse = await fetch('/api/patientaccounts',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}` 
        }
      });

      if(!fetchresponse.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update patient account table");
      }

      //Success account update
      const patientdata = await fetchresponse.json();
      setpatients(patientdata);
      setmessage({text:"Patient Account Updated Successfully!", type:"success"});

      setTimeout(() => {
        setissubmitting(false);
        setselectededitpatientaccount(null);
        setshowviewpatientdialog(false);
      }, 1500);

    } catch (error){
      console.error("Error updating patient account : ", error);
      setissubmitting(false);
      setmessage({text: "Failed to update account. Please try again", type:"error"});
    }
  }























//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE
//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE
//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE
//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE
//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE
//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE
//STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE //STAFF ACCOUNT TABLE

const [showaddstaffdialog, setshowaddstaffdialog] = useState(false);
const [showviewstaffdialog, setshowviewstaffdialog] = useState(false);
const [showdeletestaffdialog, setshowdeletestaffdialog] = useState(false);
const [staffs, setstaffs] = useState([]);
const [selectedstaffaccount, setselectedstaffaccount] = useState(null);
const [selectededitstaffaccount, setselectededitstaffaccount] = useState(null);
const [loadingstaffs, setloadingstaffs] = useState(true);
const [failedloadingstaffs, setfailedloadingstaffs] = useState(null);
const [staffselectedprofile, setstaffselectedprofile] = useState(null);
const [staffpreviewimage, setstaffpreviewimage] = useState (null);
const staffimageinputref = useRef(null);
const [searchstaffs, setsearchstaffs] = useState('');
const [filteredstaffs, setfilteredstaffs] = useState([]);
const [staffemailexist, setstaffemailexist] = useState(false);
const [staffcheckemail, setstaffcheckemail] = useState(false);
const [staffemailerror, setstaffemailerror] = useState(false);
const staffemailcharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const [staffissubmitting, setstaffissubmitting] = useState(false);
const [isdeletingstaff, setisdeletingstaff] = useState(false);
const [staffmessage, setstaffmessage] = useState({ text:'', type:''});


//Blank variables that stores all data to be sent to database
const [staffformdata, setstaffformdata] = useState({
    role:'Staff',
    staffemail:'',
    staffpassword:'',
    stafflastname:'',
    stafffirstname:'',
    staffmiddlename:'',
    staffclinic:'',
    staffiseyespecialist: '',
    staffprofilepicture:'' // Holds the profile picture 
});

//Debounce check for search input
const searchstaffdebounce = (functions, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => functions.apply(this, args), delay);
  }
};

//staff search filter
const filterstaffaccount = useCallback(searchstaffdebounce((term) => {
  if(!term) {
    setfilteredstaffs(staffs);
    return;
  }

  const filtered = staffs.filter(staff =>
    staff.stafflastname.toLowerCase().includes(term.toLowerCase()) ||
    staff.stafffirstname.toLowerCase().includes(term.toLowerCase()) ||
    staff.staffmiddlename.toLowerCase().includes(term.toLowerCase()) ||
    staff.staffemail.toLowerCase().includes(term.toLowerCase()) ||
    staff.staffId.toString().includes(term)
  );

  setfilteredstaffs(filtered);
}, 300), [staffs]);

//Fetching staff list and data from database
useEffect(() => {
  const fetchstaffs = async () => {
    try{

      const fetchresponse = await fetch('/api/staffaccounts', {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
        }
      });
      
      if(!fetchresponse.ok){
        throw new Error("Failed to fetch staff accounts");
      }

      const staffdata = await fetchresponse.json();
      setstaffs(staffdata);
    
    }catch(error){
      setfailedloadingstaffs(error.message);
    }finally{
      setloadingstaffs(false);
    }
  };
  
  if(currentusertoken) {
    fetchstaffs();
  }
}, [currentusertoken]);

//staff Filter
useEffect(() => {
  filterstaffaccount(searchstaffs);
}, [searchstaffs, filterstaffaccount]);

const renderstaffaccounts = () => {

const staffstorender = searchstaffs ? filteredstaffs : staffs;
const paginatedStaffs = getPaginatedData(staffstorender, 'staff');
const totalStaffs = staffstorender.length;
const totalPages = Math.ceil(totalStaffs / itemsPerPage);

return (
  <div>
    <div className="overflow-x-auto w-full h-full">
      <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
        <thead className="rounded-tl-2xl rounded-tr-2xl">
          <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
            <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Clinic</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Eye Specialist</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tr-2xl">Actions</th>

            {currentuserloggedin !== "Staff" && (
              <>
                <th className="pb-3 pt-3 text-center pr-3"></th>
                <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl"></th>
              </>
            )}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-200 bg-white">
          {loadingstaffs && (
            <>
              {[...Array(5)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </>
          )}

          {failedloadingstaffs && (
            <tr>
              <td colSpan="12" className="p-4 bg-red-50 text-red-600 text-center">
                Error: {failedloadingstaffs}
              </td>
            </tr>
          )}

          {(!loadingstaffs && !failedloadingstaffs && searchstaffs && filteredstaffs.length === 0) && (
            <tr>
              <td colSpan="12" className="rounded-2xl py-6 px-4 bg-yellow-50 text-yellow-600 text-center">
                No staffs found.
              </td>
            </tr>
          )}

          {(!loadingstaffs && !failedloadingstaffs && staffstorender.length > 0) && paginatedStaffs.map((staff) => (
          <tr key={staff._id}  className="hover:bg-gray-100  transition-all duration-300 ease-in-out hover:cursor-pointer ">
            <td  className="py-3 px-6 text-[#3a3a3a] font-albertsans font-medium ">#{staff.staffId}</td>
            <td  className="py-3 px-6 text-center">
            <div className="flex justify-center">
              <img 
                src={staff.staffprofilepicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'default-profile-url'; // Fallback image
                }}
              />
              </div>
            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">{staff.stafflastname}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium max-w-[150px]">{staff.stafffirstname}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.staffmiddlename}</td>
    
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <a href={`mailto:${staff.staffemail}`} className="text-blue-400 hover:underline">
                {staff.staffemail}
              </a>

            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">{staff.staffclinic}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.staffiseyespecialist}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <span className={`rounded-2xl text-xs px-5 py-4 ${staff.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                {staff.isVerified ? 'Active' : 'Pending'}
              </span>
            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
              {new Date(staff.createdAt).toLocaleDateString('en-US',{
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </td>
            {(currentuserloggedin !== "Staff" || (currentuserloggedin === "Staff" && staff.staffemail === JSON.parse(localStorage.getItem("currentuser"))?.email)) && (
              <>
                <td><div onClick={() =>  {
                  setselectededitstaffaccount({
                     id: staff._id,
                     email: staff.staffemail,
                     lastname: staff.stafflastname,
                     firstname: staff.stafffirstname,
                     middlename: staff.staffmiddlename,
                     eyespecialist: staff.staffiseyespecialist,
                     profilepicture: staff.staffprofilepicture
                     });

                  setstaffformdata({
                    role: 'staff',
                    staffemail: staff.staffemail,
                    staffpassword: staff.staffpassword,
                    stafflastname: staff.stafflastname,
                    stafffirstname: staff.stafffirstname,
                    staffmiddlename: staff.staffmiddlename,
                    staffiseyespecialist: staff.staffiseyespecialist,
                    staffprofilepicture: staff.staffprofilepicture
                  });

                  setstaffpreviewimage(staff.staffprofilepicture);
                  setshowviewstaffdialog(true);}}

                 className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-pencil text-white mr-1"/><h1 className="text-white">Edit</h1></div></td>
    
                {currentuserloggedin !== "Staff" && (
                  <td><div onClick={() =>  {
                    setselectedstaffaccount({
                       id: staff.staffId,
                       email: staff.staffemail,
                       name: `${staff.stafffirstname} ${staff.stafflastname}`});
                                
                    setshowdeletestaffdialog(true);}}

                   className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div></td>
                )}
              </>
            )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {/* Pagination Component */}
    {totalStaffs > 0 && (
      <PaginationComponent
        currentPage={currentPage.staff}
        totalPages={totalPages}
        onPageChange={(page) => handlePageChange('staff', page)}
        totalItems={totalStaffs}
        itemsPerPage={itemsPerPage}
      />
    )}
  </div>
);
};

//PROFILE IMAGE TYPE HANDLING
const staffhandleprofilechange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;


  const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
  if(!imagefiletype.includes(file.type)) {
    alert("Please select an image file (JPG or PNG)");
    return;
  }


  const maximagefile = 1;
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 1MB");
    return;
  }

  setstaffselectedprofile(null);
  setstaffpreviewimage(null);

  if(staffimageinputref.current){
    staffimageinputref.current.value = "";
  }






  try{

    const imageconfiguration = {
      maximagemb: 1,
      maxworh: 800,
      useWebWorker: true,
      initialQuality: 0.8
    };


    const compressedimageprofile = await imageCompression(file, imageconfiguration);
    const reader = new FileReader();
    reader.onloadend = () => {

      if(reader.error){
        console.error("Error processing image file : ", reader.error);
        alert("Error processing image file. Try again");
        return;
      }
      setstaffpreviewimage(reader.result);
    };


    reader.onerror = () => {
      console.error("File Reader Error : ", reader.error);
      alert("Error reading file. Try again");
      return;
    };

    reader.readAsDataURL(compressedimageprofile);
    setstaffselectedprofile(compressedimageprofile);
  

  } catch (error) {

    console.error("Image file compression failed : ", error.message);
    alert("Image file compression failed. Try again");
    return;

  }
    

};

//Handles the click event of upload button
const staffhandleuploadclick = () => {
  staffimageinputref.current.click();
};

const staffhandleremoveprofile = () => {
  setstaffselectedprofile(null);
  setstaffpreviewimage(null);
  if(staffimageinputref.current){
    staffimageinputref.current.value = "";
  }
}


//Chceks if email is already existing
useEffect(() => {
      const debounceemailcheck = async () => {
        
        //Don't check if email input is empty
        if(!staffformdata.staffemail) {
          setstaffemailerror(false);
          setstaffemailexist(false);
          return;
        }



        if(!staffemailcharacters.test(staffformdata.staffemail)) {
          setstaffemailerror(true);
          return;
        }

        setstaffcheckemail (true);

        try{
          //Request to server if the email exists in patientaccounts collection
          const patientresponse = await fetch(
            `/api/patientaccounts/check-email/${encodeURIComponent(staffformdata.staffemail)}`
     
          );



          //Request to server if the email exists in staffaccounts collection
          const staffresponse = await fetch(
             `/api/staffaccounts/check-email/${encodeURIComponent(staffformdata.staffemail)}`
                 
          );


          //Request to server if the email exists in adminaccounts collection
          const ownerresponse = await fetch(
              `/api/owneraccounts/check-email/${encodeURIComponent(staffformdata.staffemail)}`
                 
           );


          //Request to server if the email exists in adminaccounts collection
          const adminresponse = await fetch(
              `/api/adminaccounts/check-email/${encodeURIComponent(staffformdata.staffemail)}`
                 
          );
          
        const patientdata = await patientresponse.json();
        const staffdata = await staffresponse.json();
        const ownerdata = await ownerresponse.json();
        const admindata = await adminresponse.json();

        //Save wether email existss in db
        setstaffemailexist(patientdata.exists || staffdata.exists  ||  ownerdata.exists   ||  admindata.exists); 
        setstaffemailerror(patientdata.exists || staffdata.exists  ||  ownerdata.exists   ||  admindata.exists);




      }catch(error){
        console.error("Failed email validation:", error);
      }finally{
        //Check email done
        setstaffcheckemail(false);
      }

      }

      const timer = setTimeout(debounceemailcheck, 500);
      return () => clearTimeout(timer); //Cleanup
}, [staffformdata.staffemail]);




  //Handlechange function to be used in input forms
const staffhandlechange = (e) => {
    const {name, value} = e.target
    setstaffformdata(prev => ({
      ...prev,
      [name]: value
    }))
}

  
//INSERT staff ACCOUNT  //INSERT staff ACCOUNT  //INSERT staff ACCOUNT   //INSERT staff ACCOUNT  //INSERT staff ACCOUNT  //INSERT staff ACCOUNT 
  const staffhandlesubmit = async (e) => {
    e.preventDefault()
    setstaffissubmitting(true)
    setstaffmessage({
      text:'', type:''
    })

  try{

    
    const staffaccsubmission = {
      ...staffformdata,
      staffclinic: ownerownedclinic,
      staffiseyespecialist: staffformdata.staffiseyespecialist,
      staffprofilepicture: staffpreviewimage || staffformdata.staffprofilepicture
    };

    console.log(staffaccsubmission);

//Sends all staff data to the server
    const response = await fetch(`/api/staffaccounts`,{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            'Authorization': `Bearer ${currentusertoken}`
          },
          body: JSON.stringify(staffaccsubmission)
    });


    await axios.post(`/api/accountcreation/staff`, {
      email: staffformdata.staffemail, 
      password: staffformdata.staffpassword});


    //If response is success, it will send data to the api and to the database   
    await response.json();
    setstaffmessage({text:"Registration Sucessful!",type:"success"});
    
      
       
      //Resets the input forms except the profile picture
      setstaffformdata({
        role: 'staff',
        staffemail:'',
        staffpassword:'',
        stafflastname:'',
        stafffirstname:'',
        staffmiddlename:'',
        staffclinic: '',
        staffiseyespecialist:'',
        staffprofilepicture: ''
      });



      setstaffselectedprofile(null);
      setstaffpreviewimage(null);



 
  //Error encounter  
    } catch(error) {
      console.error("Error:", error)
      setstaffmessage({text:"Registration Failed. Try again",type:"error"});
           
    } finally {
      setstaffissubmitting(false)
    }
}

//DELETE staff ACCOUNT    //DELETE staff ACCOUNT    //DELETE staff ACCOUNT    //DELETE staff ACCOUNT    //DELETE staff ACCOUNT    //DELETE staff ACCOUNT  
  const deletestaffaccount = async () => {
    try{
      if(!selectedstaffaccount) return;

      setisdeletingstaff(true);

      const response = await fetch(`/api/staffaccounts/${selectedstaffaccount.id}`,{
        method: 'DELETE',
        headers:{
          'Authorization': `Bearer ${currentusertoken}`
        }
      });



      await axios.post(`/api/accountdeletion/staff`, {
        email: selectedstaffaccount.email});



      if(!response.ok){
        throw new Error("Failed to delete staff account");
      }

      const fetchresponse = await fetch('/api/staffaccounts', {
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
          }
      });
      
      if(!fetchresponse.ok) {
        throw new Error("Failed to retrieve updated staffaccounts table");
      }

      const staffaccounts = await fetchresponse.json();
      setstaffs(staffaccounts);

      setshowdeletestaffdialog(false);
      setselectedstaffaccount(null);

      
    }catch (error){
      console.error("Failed deleting staff: ", error);
    } finally {
      setisdeletingstaff(false);
    }
  };

//UPDATE staff ACCOUNT  //UPDATE staff ACCOUNT  //UPDATE staff ACCOUNT  //UPDATE staff ACCOUNT  //UPDATE staff ACCOUNT  //UPDATE staff ACCOUNT
  const updatestaffaccount = async (e) => {
    
    e.preventDefault();
    setstaffissubmitting(true);
    setstaffmessage({text:'', type:''});

    try{
      if(!selectededitstaffaccount) return;

      const updatestaffaccountdetails = {
        ...staffformdata,
        staffiseyespecialist:staffformdata.staffiseyespecialist,
        staffprofilepicture: staffpreviewimage || staffformdata.staffprofilepicture
      };

      const response = await fetch(`/api/staffaccounts/${selectededitstaffaccount.id}`,{
        method:'PUT',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}`
        },
        body: JSON.stringify(updatestaffaccountdetails)
      });


      if(!response.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update staff account");
      }

      const fetchresponse = await fetch('/api/staffaccounts',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}` 
        }
      });

      if(!fetchresponse.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update staff account table");
      }

      //Success account update
      const staffdata = await fetchresponse.json();
      setstaffs(staffdata);
      setstaffmessage({text:"Staff Account Updated Successfully!", type:"success"});

      setTimeout(() => {
        setstaffissubmitting(false);
        setselectededitstaffaccount(null);
        setshowviewstaffdialog(false);
        setstaffmessage({text:"", type:""});
      }, 1500);

    } catch (error){
      console.error("Error updating staff account : ", error);
      setstaffissubmitting(false);
      setstaffmessage({text: "Failed to update account. Please try again", type:"error"});
    }
  }











//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE
//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE
//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE
//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE
//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE
//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE
//OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE //OWNER ACCOUNT TABLE

  const [showaddownerdialog, setshowaddownerdialog] = useState(false);
  const [showviewownerdialog, setshowviewownerdialog] = useState(false);
  const [showdeleteownerdialog, setshowdeleteownerdialog] = useState(false);
  const [owners, setowners] = useState([]);
  const [selectedowneraccount, setselectedowneraccount] = useState(null);
  const [selectededitowneraccount, setselectededitowneraccount] = useState(null);
  const [loadingowners, setloadingowners] = useState(true);
  const [failedloadingowners, setfailedloadingowners] = useState(null);
  const [ownerselectedprofile, setownerselectedprofile] = useState(null);
  const [ownerpreviewimage, setownerpreviewimage] = useState (null);
  const ownerimageinputref = useRef(null);
  const [searchowners, setsearchowners] = useState('');
  const [filteredowners, setfilteredowners] = useState([]);
  const [owneremailexist, setowneremailexist] = useState(false);
  const [ownercheckemail, setownercheckemail] = useState(false);
  const [owneremailerror, setowneremailerror] = useState(false);
  const owneremailcharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [ownerissubmitting, setownerissubmitting] = useState(false);
  const [isdeletingowner, setisdeletingowner] = useState(false);
  const [ownermessage, setownermessage] = useState({ text:'', type:''});


  //Blank variables that stores all data to be sent to database
  const [ownerformdata, setownerformdata] = useState({
      role:'Owner',
      owneremail:'',
      ownerpassword:'',
      ownerlastname:'',
      ownerfirstname:'',
      ownermiddlename:'',
      ownerclinic: '',
      owneriseyespecialist: '',
      ownerprofilepicture:'' // Holds the profile picture 
  });

  //Debounce check for search input
  const searchownerdebounce = (functions, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => functions.apply(this, args), delay);
    }
  };

  //owner search filter
  const filterowneraccount = useCallback(searchownerdebounce((term) => {
    if(!term) {
      setfilteredowners(owners);
      return;
    }
  
    const filtered = owners.filter(owner =>
      owner.ownerlastname.toLowerCase().includes(term.toLowerCase()) ||
      owner.ownerfirstname.toLowerCase().includes(term.toLowerCase()) ||
      owner.ownermiddlename.toLowerCase().includes(term.toLowerCase()) ||
      owner.owneremail.toLowerCase().includes(term.toLowerCase()) ||
      owner.ownerclinic.toLowerCase().includes(term.toLowerCase()) ||
      owner.ownerId.toString().includes(term)
    );

    setfilteredowners(filtered);
  }, 300), [owners]);

  //Fetching owner list and data from database
  useEffect(() => {
    const fetchowners = async () => {
      try{

        const fetchresponse = await fetch('/api/owneraccounts', {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if(!fetchresponse.ok){
          throw new Error("Failed to fetch owner accounts");
        }

        const ownerdata = await fetchresponse.json();
        setowners(ownerdata);
      
      }catch(error){
        setfailedloadingowners(error.message);
      }finally{
        setloadingowners(false);
      }
    };
    
    if(currentusertoken) {
      fetchowners();
    }
  }, [currentusertoken]);

  //owner Filter
  useEffect(() => {
    filterowneraccount(searchowners);
  }, [searchowners, filterowneraccount]);

  const renderowneraccounts = () => {

  const ownerstorender = searchowners ? filteredowners : owners;

  return (
    <div className="overflow-x-auto w-full h-full">
      <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
        <thead className="rounded-tl-2xl rounded-tr-2xl">
          <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
            <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Clinic</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Eye Specialist</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
            <th className={`pb-3 pt-3 pl-2 pr-2 text-center ${currentuserloggedin === "Staff" ? "rounded-tr-2xl" : ""}`}>Date Created</th>
            {currentuserloggedin !== "Staff" && (
              <>
                <th className="pb-3 pt-3 text-center pr-3"></th>
                <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl"></th>
              </>
            )}

          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-200 bg-white">
          {loadingowners && (
            <>
              {[...Array(5)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </>
          )}

          {failedloadingowners && (
            <tr>
              <td colSpan="12" className="p-4 bg-red-50 text-red-600 text-center">
                Error: {failedloadingowners}
              </td>
            </tr>
          )}

          {(!loadingowners && !failedloadingowners && searchowners && filteredowners.length === 0) && (
            <tr>
              <td colSpan="12" className="rounded-2xl py-6 px-4 bg-yellow-50 text-yellow-600 text-center">
                No owners found.
              </td>
            </tr>
          )}

          {(!loadingowners && !failedloadingowners && ownerstorender.length > 0) && ownerstorender.map((owner) => (
            <tr key={owner._id}  className="hover:bg-gray-100  transition-all duration-300 ease-in-out hover:cursor-pointer ">
              <td  className="py-3 px-6 text-[#3a3a3a] font-albertsans font-medium ">#{owner.ownerId}</td>
              <td  className="py-3 px-6 text-center">
                <div className="flex justify-center">
                <img 
                  src={owner.ownerprofilepicture} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'default-profile-url'; // Fallback image
                  }}
                />
                </div>
              </td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">{owner.ownerlastname}</td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium max-w-[150px]">{owner.ownerfirstname}</td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{owner.ownermiddlename}</td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                <a href={`mailto:${owner.owneremail}`} className="text-blue-400 hover:underline">
                  {owner.owneremail}
                </a>

              </td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">{owner.ownerclinic}</td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{owner.owneriseyespecialist}</td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                <span className={`rounded-2xl text-xs px-5 py-4 ${owner.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                  {owner.isVerified ? 'Active' : 'Pending'}
                </span>
              </td>
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
                {new Date(owner.createdAt).toLocaleDateString('en-US',{
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </td>
              {currentuserloggedin !== "Staff" && (
                <>
                  <td><div onClick={() =>  {
                    setselectededitowneraccount({
                       id: owner._id,
                       email: owner.owneremail,
                       lastname: owner.ownerlastname,
                       firstname: owner.ownerfirstname,
                       middlename: owner.ownermiddlename,
                       clinic: owner.ownerclinic,
                       eyespecialist: owner.owneriseyespecialist,
                       profilepicture: owner.ownerprofilepicture
                       });
  
                    setownerformdata({
                      role: 'owner',
                      owneremail: owner.owneremail,
                      ownerpassword: owner.ownerpassword,
                      ownerlastname: owner.ownerlastname,
                      ownerfirstname: owner.ownerfirstname,
                      ownermiddlename: owner.ownermiddlename,
                      ownerclinic: owner.ownerclinic,
                      owneriseyespecialist: owner.owneriseyespecialist,
                      ownerprofilepicture: owner.ownerprofilepicture
                    });
  
                    setownerpreviewimage(owner.ownerprofilepicture);
                    setshowviewownerdialog(true);}}
  
                   className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-pencil text-white mr-1"/><h1 className="text-white">Edit</h1></div></td>
      
                  <td><div onClick={() =>  {
                    setselectedowneraccount({
                       id: owner.ownerId,
                       email: owner.owneremail,
                       name: `${owner.ownerfirstname} ${owner.ownerlastname}`});
                                
                    setshowdeleteownerdialog(true);}}
  
                   className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div></td>
                </>
              )}


              </tr>
  ))}
        </tbody>
      </table>
      

    </div>
  );
  };

  //PROFILE IMAGE TYPE HANDLING
  const ownerhandleprofilechange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;


    const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
    if(!imagefiletype.includes(file.type)) {
      alert("Please select an image file (JPG or PNG)");
      return;
    }


    const maximagefile = 1;
    if(file.size > maximagefile * 1024 * 1024){
      alert("Image is too large. Please select image under 1MB");
      return;
    }

    setownerselectedprofile(null);
    setownerpreviewimage(null);

    if(ownerimageinputref.current){
      ownerimageinputref.current.value = "";
    }






    try{

      const imageconfiguration = {
        maximagemb: 1,
        maxworh: 800,
        useWebWorker: true,
        initialQuality: 0.8
      };


      const compressedimageprofile = await imageCompression(file, imageconfiguration);
      const reader = new FileReader();
      reader.onloadend = () => {

        if(reader.error){
          console.error("Error processing image file : ", reader.error);
          alert("Error processing image file. Try again");
          return;
        }
        setownerpreviewimage(reader.result);
      };


      reader.onerror = () => {
        console.error("File Reader Error : ", reader.error);
        alert("Error reading file. Try again");
        return;
      };

      reader.readAsDataURL(compressedimageprofile);
      setownerselectedprofile(compressedimageprofile);
    

    } catch (error) {

      console.error("Image file compression failed : ", error.message);
      alert("Image file compression failed. Try again");
      return;

    }
      

  };

  //Handles the click event of upload button
  const ownerhandleuploadclick = () => {
    ownerimageinputref.current.click();
  };

  const ownerhandleremoveprofile = () => {
    setownerselectedprofile(null);
    setownerpreviewimage(null);
    if(ownerimageinputref.current){
      ownerimageinputref.current.value = "";
    }
  }


  //Chceks if email is already existing
  useEffect(() => {
        const debounceemailcheck = async () => {
          
          //Don't check if email input is empty
          if(!ownerformdata.owneremail) {
            setowneremailerror(false);
            setowneremailexist(false);
            return;
          }
  
  
  
          if(!owneremailcharacters.test(ownerformdata.owneremail)) {
            setowneremailerror(true);
            return;
          }
  
          setownercheckemail (true);
  
          try{
            //Request to server if the email exists in patientaccounts collection
            const patientresponse = await fetch(
              `/api/patientaccounts/check-email/${encodeURIComponent(ownerformdata.owneremail)}`
       
            );
  
            //Request to server if the email exists in adminaccounts collection
            const staffresponse = await fetch(
              `/api/staffaccounts/check-email/${encodeURIComponent(ownerformdata.owneremail)}`
       
            );
            

            //Request to server if the email exists in owneraccounts collection
            const ownerresponse = await fetch(
               `/api/owneraccounts/check-email/${encodeURIComponent(ownerformdata.owneremail)}`
                   
            );


            //Request to server if the email exists in adminaccounts collection
            const adminresponse = await fetch(
               `/api/adminaccounts/check-email/${encodeURIComponent(ownerformdata.owneremail)}`
                   
            );
            
          const patientdata = await patientresponse.json();
          const staffdata = await staffresponse.json();
          const ownerdata = await ownerresponse.json();
          const admindata = await adminresponse.json();

          //Save wether email existss in db
          setowneremailexist(patientdata.exists  ||  staffdata.exists || ownerdata.exists  ||  admindata.exists); 
          setowneremailerror(patientdata.exists  ||  staffdata.exists || ownerdata.exists  ||  admindata.exists);
  
  
  
  
        }catch(error){
          console.error("Failed email validation:", error);
        }finally{
          //Check email done
          setownercheckemail(false);
        }
  
        }
  
        const timer = setTimeout(debounceemailcheck, 500);
        return () => clearTimeout(timer); //Cleanup
  }, [ownerformdata.owneremail]);




    //Handlechange function to be used in input forms
  const ownerhandlechange = (e) => {
      const {name, value} = e.target
      setownerformdata(prev => ({
        ...prev,
        [name]: value
      }))
  }

    
  //INSERT owner ACCOUNT  //INSERT owner ACCOUNT  //INSERT owner ACCOUNT   //INSERT owner ACCOUNT  //INSERT owner ACCOUNT  //INSERT owner ACCOUNT 
    const ownerhandlesubmit = async (e) => {
      e.preventDefault()
      setownerissubmitting(true)
      setownermessage({
        text:'', type:''
      })

    try{

      
      const owneraccsubmission = {
        ...ownerformdata,
        ownerclinic: ownerformdata.ownerclinic,
        owneriseyespecialist: ownerformdata.owneriseyespecialist,
        ownerprofilepicture: ownerpreviewimage || ownerformdata.ownerprofilepicture
      };

      console.log("Submitting", owneraccsubmission);


  //Sends all owner data to the server
      const response = await fetch(`/api/owneraccounts`,{
            method: "POST",
            headers: {
              "Content-Type":"application/json",
              'Authorization': `Bearer ${currentusertoken}`
            },
            body: JSON.stringify(owneraccsubmission)
      });




      const data = await response.json();
      if(!response.ok) {
        throw new Error(data.message || "Registration Failed");
      }

      //If response is success, it will send data to the api and to the database   
      setownermessage({text:"Registration Sucessful!",type:"success"});
      
        
         
        //Resets the input forms except the profile picture
        setownerformdata({
          role: 'owner',
          owneremail:'',
          ownerpassword:'',
          ownerlastname:'',
          ownerfirstname:'',
          ownermiddlename:'',
          ownerclinic: '',
          owneriseyespecialist: '',
          ownerprofilepicture: ''
        });



        setownerselectedprofile(null);
        setownerpreviewimage(null);



   
    //Error encounter  
      } catch(error) {
        console.error("Error:", error)
        setownermessage({text: error.message || "Registration Failed",type:"error"});
             
      } finally {
        setownerissubmitting(false)
      }
  }

  //DELETE owner ACCOUNT    //DELETE owner ACCOUNT    //DELETE owner ACCOUNT    //DELETE owner ACCOUNT    //DELETE owner ACCOUNT    //DELETE owner ACCOUNT  
    const deleteowneraccount = async () => {
      try{
        if(!selectedowneraccount) return;

        setisdeletingowner(true);

        const response = await fetch(`/api/owneraccounts/${selectedowneraccount.id}`,{
          method: 'DELETE',
          headers:{
            'Authorization': `Bearer ${currentusertoken}`
          }
        });


        await axios.post(`/api/accountdeletion/owner`, {
          email: selectedowneraccount.email});


        if(!response.ok){
          throw new Error("Failed to delete owner account");
        }

        const fetchresponse = await fetch('/api/owneraccounts', {
            headers:{
              'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
            }
        });
        
        if(!fetchresponse.ok) {
          throw new Error("Failed to retrieve updated owneraccounts table");
        }

        const owneraccounts = await fetchresponse.json();
        setowners(owneraccounts);

        setshowdeleteownerdialog(false);
        setselectedowneraccount(null);

        
      }catch (error){
        console.error("Failed deleting owner: ", error);
      } finally {
        setisdeletingowner(false);
      }
    };

  //UPDATE owner ACCOUNT  //UPDATE owner ACCOUNT  //UPDATE owner ACCOUNT  //UPDATE owner ACCOUNT  //UPDATE owner ACCOUNT  //UPDATE owner ACCOUNT
    const updateowneraccount = async (e) => {
      
      e.preventDefault();
      setownerissubmitting(true);
      setownermessage({text:'', type:''});

      try{
        if(!selectededitowneraccount) return;

        const updateowneraccountdetails = {
          ...ownerformdata,
          ownerprofilepicture: ownerpreviewimage || ownerformdata.ownerprofilepicture
        };

        const response = await fetch(`/api/owneraccounts/${selectededitowneraccount.id}`,{
          method:'PUT',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('admintoken')}`
          },
          body: JSON.stringify(updateowneraccountdetails)
        });


        if(!response.ok) {
          const errorresponse = await response.json();
          throw new Error(errorresponse.message || "Failed to update owner account");
        }

        const fetchresponse = await fetch('/api/owneraccounts',{
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('admintoken')}` 
          }
        });

        if(!fetchresponse.ok) {
          const errorresponse = await response.json();
          throw new Error(errorresponse.message || "Failed to update owner account table");
        }

        //Success account update
        const ownerdata = await fetchresponse.json();
        setowners(ownerdata);
        setownermessage({text:"Owner Account Updated Successfully!", type:"success"});

        setTimeout(() => {
          setownerissubmitting(false);
          setselectededitowneraccount(null);
          setshowviewownerdialog(false);
          setownermessage({text:"", type:""});
        }, 1500);

      } catch (error){
        console.error("Error updating owner account : ", error);
        setownerissubmitting(false);
        setownermessage({text: "Failed to update account. Please try again", type:"error"});
      }
    }

















//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE
//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE
//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE
//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE
//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE
//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE
//ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE //ADMIN ACCOUNT TABLE

const [showaddadmindialog, setshowaddadmindialog] = useState(false);
const [showviewadmindialog, setshowviewadmindialog] = useState(false);
const [showdeleteadmindialog, setshowdeleteadmindialog] = useState(false);
const [admins, setadmins] = useState([]);
const [selectedadminaccount, setselectedadminaccount] = useState(null);
const [selectededitadminaccount, setselectededitadminaccount] = useState(null);
const [loadingadmins, setloadingadmins] = useState(true);
const [failedloadingadmins, setfailedloadingadmins] = useState(null);
const [adminselectedprofile, setadminselectedprofile] = useState(null);
const [adminpreviewimage, setadminpreviewimage] = useState (null);
const adminimageinputref = useRef(null);
const [searchadmins, setsearchadmins] = useState('');
const [filteredadmins, setfilteredadmins] = useState([]);
const [adminemailexist, setadminemailexist] = useState(false);
const [admincheckemail, setadmincheckemail] = useState(false);
const [adminemailerror, setadminemailerror] = useState(false);
const adminemailcharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const [adminissubmitting, setadminissubmitting] = useState(false);
const [isdeletingadmin, setisdeletingadmin] = useState(false);
const [adminmessage, setadminmessage] = useState({ text:'', type:''});


//Blank variables that stores all data to be sent to database
const [adminformdata, setadminformdata] = useState({
  role:'Admin',
  adminemail:'',
  adminpassword:'',
  adminlastname:'',
  adminfirstname:'',
  adminmiddlename:'',
  adminprofilepicture:'' // Holds the profile picture 
});

//Debounce check for search input
const searchadmindebounce = (functions, delay) => {
let timer;
return function (...args) {
  clearTimeout(timer);
  timer = setTimeout(() => functions.apply(this, args), delay);
}
};

//admin search filter
const filteradminaccount = useCallback(searchadmindebounce((term) => {
if(!term) {
  setfilteredadmins(admins);
  return;
}

const filtered = admins.filter(admin =>
  admin.adminlastname.toLowerCase().includes(term.toLowerCase()) ||
  admin.adminfirstname.toLowerCase().includes(term.toLowerCase()) ||
  admin.adminmiddlename.toLowerCase().includes(term.toLowerCase()) ||
  admin.adminemail.toLowerCase().includes(term.toLowerCase()) ||
  admin.adminId.toString().includes(term)
);

setfilteredadmins(filtered);
}, 300), [admins]);

//Fetching admin list and data from database
useEffect(() => {
const fetchadmins = async () => {
  try{

    const fetchresponse = await fetch('/api/adminaccounts', {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });
    
    if(!fetchresponse.ok){
      throw new Error("Failed to fetch admin accounts");
    }

    const admindata = await fetchresponse.json();
    setadmins(admindata);
  
  }catch(error){
    setfailedloadingadmins(error.message);
  }finally{
    setloadingadmins(false);
  }
};

if(currentusertoken) {
  fetchadmins();
}
}, [currentusertoken]);

//admin Filter
useEffect(() => {
filteradminaccount(searchadmins);
}, [searchadmins, filteradminaccount]);

const renderadminaccounts = () => {

const adminstorender = searchadmins ? filteredadmins : admins;

return (
<div className="overflow-x-auto w-full h-full">
  <table className="w-full rounded-tl-2xl  rounded-tr-2xl shadow-lg">
    <thead className="rounded-tl-2xl rounded-tr-2xl">
      <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl ">
        <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
        <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
        <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
        <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
        <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
        <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
        <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
        <th className={`pb-3 pt-3 pl-2 pr-2 text-center ${currentuserloggedin === "Staff" ? "rounded-tr-2xl" : ""}`}>Date Created</th>
        {currentuserloggedin !== "Staff" && (
          <>
            <th className="pb-3 pt-3 text-center pr-3"></th>
            <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl"></th>
          </>
        )}

      </tr>
    </thead>
    
    <tbody className="divide-y divide-gray-200 bg-white">
      {loadingadmins && (
        <>
          {[...Array(5)].map((_, index) => (
            <AdminTableRowSkeleton key={index} />
          ))}
        </>
      )}

      {failedloadingadmins && (
        <tr>
          <td colSpan="10" className="p-4 bg-red-50 text-red-600 text-center">
            Error: {failedloadingadmins}
          </td>
        </tr>
      )}

      {(!loadingadmins && !failedloadingadmins && searchadmins && filteredadmins.length === 0) && (
        <tr>
          <td colSpan="10" className="rounded-2xl py-6 px-4 bg-yellow-50 text-yellow-600 text-center">
            No admins found.
          </td>
        </tr>
      )}

      {(!loadingadmins && !failedloadingadmins && adminstorender.length > 0) && adminstorender.map((admin) => (
        <tr key={admin._id}  className="hover:bg-gray-100  transition-all duration-300 ease-in-out hover:cursor-pointer ">
          <td  className="py-3 px-6 text-[#3a3a3a] font-albertsans font-medium ">#{admin.adminId}</td>
          <td  className="py-3 px-6 text-center">
            <div className="flex justify-center">
            <img 
              src={admin.adminprofilepicture} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'default-profile-url'; // Fallback image
              }}
            />
            </div>
          </td>
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">{admin.adminlastname}</td>
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium max-w-[150px]">{admin.adminfirstname}</td>
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{admin.adminmiddlename}</td>
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
            <a href={`mailto:${admin.adminemail}`} className="text-blue-400 hover:underline">
              {admin.adminemail}
            </a>

          </td>
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
            <span className={`rounded-2xl text-xs px-5 py-4 ${admin.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
              {admin.isVerified ? 'Active' : 'Pending'}
            </span>
          </td>
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
            {new Date(admin.createdAt).toLocaleDateString('en-US',{
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </td>
          {currentuserloggedin !== "Staff" && (
            <>
              <td><div onClick={() =>  {
                setselectededitadminaccount({
                   id: admin._id,
                   email: admin.adminemail,
                   lastname: admin.adminlastname,
                   firstname: admin.adminfirstname,
                   middlename: admin.adminmiddlename,
                   profilepicture: admin.adminprofilepicture
                   });

                setadminformdata({
                  role: 'Admin',
                  adminemail: admin.adminemail,
                  adminpassword: admin.adminpassword,
                  adminlastname: admin.adminlastname,
                  adminfirstname: admin.adminfirstname,
                  adminmiddlename: admin.adminmiddlename,
                  adminprofilepicture: admin.adminprofilepicture
                });

                setadminpreviewimage(admin.adminprofilepicture);
                setshowviewadmindialog(true);}}

               className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-pencil text-white mr-1"/><h1 className="text-white">Edit</h1></div></td>

              <td><div onClick={() =>  {
                setselectedadminaccount({
                   id: admin.adminId,
                   email: admin.adminemail,
                   name: `${admin.adminfirstname} ${admin.adminlastname}`});
                            
                setshowdeleteadmindialog(true);}}

               className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div></td>
            </>
          )}


          </tr>
))}
    </tbody>
  </table>
  

</div>
);
};

//PROFILE IMAGE TYPE HANDLING
const adminhandleprofilechange = async (e) => {
const file = e.target.files[0];

if (!file) return;


const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
if(!imagefiletype.includes(file.type)) {
  alert("Please select an image file (JPG or PNG)");
  return;
}


const maximagefile = 1;
if(file.size > maximagefile * 1024 * 1024){
  alert("Image is too large. Please select image under 1MB");
  return;
}

setadminselectedprofile(null);
setadminpreviewimage(null);

if(adminimageinputref.current){
  adminimageinputref.current.value = "";
}






try{

  const imageconfiguration = {
    maximagemb: 1,
    maxworh: 800,
    useWebWorker: true,
    initialQuality: 0.8
  };


  const compressedimageprofile = await imageCompression(file, imageconfiguration);
  const reader = new FileReader();
  reader.onloadend = () => {

    if(reader.error){
      console.error("Error processing image file : ", reader.error);
      alert("Error processing image file. Try again");
      return;
    }
    setadminpreviewimage(reader.result);
  };


  reader.onerror = () => {
    console.error("File Reader Error : ", reader.error);
    alert("Error reading file. Try again");
    return;
  };

  reader.readAsDataURL(compressedimageprofile);
  setadminselectedprofile(compressedimageprofile);


} catch (error) {

  console.error("Image file compression failed : ", error.message);
  alert("Image file compression failed. Try again");
  return;

}
  

};

//Handles the click event of upload button
const adminhandleuploadclick = () => {
adminimageinputref.current.click();
};

const adminhandleremoveprofile = () => {
setadminselectedprofile(null);
setadminpreviewimage(null);
if(adminimageinputref.current){
  adminimageinputref.current.value = "";
}
}


//Chceks if email is already existing
useEffect(() => {
    const debounceemailcheck = async () => {
      
      //Don't check if email input is empty
      if(!adminformdata.adminemail) {
        setadminemailerror(false);
        setadminemailexist(false);
        return;
      }



      if(!adminemailcharacters.test(adminformdata.adminemail)) {
        setadminemailerror(true);
        return;
      }

      setadmincheckemail (true);

      try{
        //Request to server if the email exists in patientaccounts collection
        const patientresponse = await fetch(
          `/api/patientaccounts/check-email/${encodeURIComponent(adminformdata.adminemail)}`
   
        );

        //Request to server if the email exists in adminaccounts collection
        const staffresponse = await fetch(
          `/api/staffaccounts/check-email/${encodeURIComponent(adminformdata.adminemail)}`
   
        );
        

        //Request to server if the email exists in adminaccounts collection
        const ownerresponse = await fetch(
           `/api/owneraccounts/check-email/${encodeURIComponent(adminformdata.adminemail)}`
               
        );


        //Request to server if the email exists in adminaccounts collection
        const adminresponse = await fetch(
           `/api/adminaccounts/check-email/${encodeURIComponent(adminformdata.adminemail)}`
               
        );
        
      const patientdata = await patientresponse.json();
      const staffdata = await staffresponse.json();
      const ownerdata = await ownerresponse.json();
      const admindata = await adminresponse.json();

      //Save wether email existss in db
      setadminemailexist(patientdata.exists  ||  staffdata.exists || ownerdata.exists  ||  admindata.exists); 
      setadminemailerror(patientdata.exists  ||  staffdata.exists || ownerdata.exists  ||  admindata.exists);




    }catch(error){
      console.error("Failed email validation:", error);
    }finally{
      //Check email done
      setadmincheckemail(false);
    }

    }

    const timer = setTimeout(debounceemailcheck, 500);
    return () => clearTimeout(timer); //Cleanup
}, [adminformdata.adminemail]);




//Handlechange function to be used in input forms
const adminhandlechange = (e) => {
  const {name, value} = e.target
  setadminformdata(prev => ({
    ...prev,
    [name]: value
  }))
}


//INSERT admin ACCOUNT  //INSERT admin ACCOUNT  //INSERT admin ACCOUNT   //INSERT admin ACCOUNT  //INSERT admin ACCOUNT  //INSERT admin ACCOUNT 
const adminhandlesubmit = async (e) => {
  e.preventDefault()
  setadminissubmitting(true)
  setadminmessage({
    text:'', type:''
  })

try{

  
  const adminaccsubmission = {
    ...adminformdata,
    adminprofilepicture: adminpreviewimage || adminformdata.adminprofilepicture
  };



//Sends all admin data to the server
  const response = await fetch(`/api/adminaccounts`,{
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          'Authorization': `Bearer ${currentusertoken}`
        },
        body: JSON.stringify(adminaccsubmission)
  });


  
  await axios.post(`/api/accountcreation/admin`, {
    email: adminformdata.adminemail, 
    password: adminformdata.adminpassword});

  //If response is success, it will send data to the api and to the database   
  await response.json();
  setadminmessage({text:"Registration Sucessful!",type:"success"});
  
    
     
    //Resets the input forms except the profile picture
    setadminformdata({
      role: 'Admin',
      adminemail:'',
      adminpassword:'',
      adminlastname:'',
      adminfirstname:'',
      adminmiddlename:'',
      adminprofilepicture: ''
    });



    setadminselectedprofile(null);
    setadminpreviewimage(null);




//Error encounter  
  } catch(error) {
    console.error("Error:", error)
    setadminmessage({text:"Registration Failed. Try again",type:"error"});
         
  } finally {
    setadminissubmitting(false)
  }
}

//DELETE admin ACCOUNT    //DELETE admin ACCOUNT    //DELETE admin ACCOUNT    //DELETE admin ACCOUNT    //DELETE admin ACCOUNT    //DELETE admin ACCOUNT  
const deleteadminaccount = async () => {
  try{
    if(!selectedadminaccount) return;

    setisdeletingadmin(true);

    const response = await fetch(`/api/adminaccounts/${selectedadminaccount.id}`,{
      method: 'DELETE',
      headers:{
        'Authorization': `Bearer ${currentusertoken}`
      }
    });


    await axios.post(`/api/accountdeletion/admin`, {
      email: selectedadminaccount.email});



    if(!response.ok){
      throw new Error("Failed to delete admin account");
    }

    const fetchresponse = await fetch('/api/adminaccounts', {
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
        }
    });
    
    if(!fetchresponse.ok) {
      throw new Error("Failed to retrieve updated adminaccounts table");
    }

    const adminaccounts = await fetchresponse.json();
    setadmins(adminaccounts);

    setshowdeleteadmindialog(false);
    setselectedadminaccount(null);

    
  }catch (error){
    console.error("Failed deleting admin: ", error);
  } finally {
    setisdeletingadmin(false);
  }
};

//UPDATE admin ACCOUNT  //UPDATE admin ACCOUNT  //UPDATE admin ACCOUNT  //UPDATE admin ACCOUNT  //UPDATE admin ACCOUNT  //UPDATE admin ACCOUNT
const updateadminaccount = async (e) => {
  
  e.preventDefault();
  setadminissubmitting(true);
  setadminmessage({text:'', type:''});

  try{
    if(!selectededitadminaccount) return;

    const updateadminaccountdetails = {
      ...adminformdata,
      adminprofilepicture: adminpreviewimage || adminformdata.adminprofilepicture
    };

    const response = await fetch(`/api/adminaccounts/${selectededitadminaccount.id}`,{
      method:'PUT',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${localStorage.getItem('admintoken')}`
      },
      body: JSON.stringify(updateadminaccountdetails)
    });


    if(!response.ok) {
      const errorresponse = await response.json();
      throw new Error(errorresponse.message || "Failed to update admin account");
    }

    const fetchresponse = await fetch('/api/adminaccounts',{
      headers: {
        'Authorization' : `Bearer ${localStorage.getItem('admintoken')}` 
      }
    });

    if(!fetchresponse.ok) {
      const errorresponse = await response.json();
      throw new Error(errorresponse.message || "Failed to update admin account table");
    }

    //Success account update
    const admindata = await fetchresponse.json();
    setadmins(admindata);
    setadminmessage({text:"Admin Account Updated Successfully!", type:"success"});

    setTimeout(() => {
      setadminissubmitting(false);
      setselectededitadminaccount(null);
      setshowviewadmindialog(false);
      setadminmessage({text:"", type:""});
    }, 1500);

  } catch (error){
    console.error("Error updating admin account : ", error);
    setadminissubmitting(false);
    setadminmessage({text: "Failed to update account. Please try again", type:"error"});
  }
};


















//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
//PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE //PATIENT PROFILE
const [showpatientpofile, setshowpatientpofile] = useState(false);
const [showaddpatientpofile, setshowaddpatientprofile] = useState(false);
const [activeprofiletable, setactiveprofiletable] = useState('patientprofiletable');
const [loadingpatientdemographics, setloadingpatientdemographics] = useState(true);
const [patientdemographics, setpatientdemographics] = useState([]);
const [patientdemoerror, setpatientdemoerror] = useState(null);
const [showdeletepatientprofiledialog, setshowdeletepatientprofiledialog] = useState(false);
const [selectedpatientprofile,setselectedpatientprofile] = useState(null);
const [demopatientemailexist, setdemopatientemailexist] = useState(false);
const [demopatientcheckemail, setdemopatientcheckemail] = useState(false);
const [demopatientemailerror, setdemopatientemailerror] = useState(false);
const [emailisnotpatient,setemailisnotpatient] = useState(false);
const [emailisnotpatienterror,setemailisnotpatienterror] = useState(false);
const demopatientemailcharacters = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const [addpatientprofilemessage, setaddpatientprofilemessage] = useState ({text: "", type: ""});
const [addpatientprofileissubmitting, setaddpatientprofileissubmitting] = useState(false);
const [addpatientprofilepreviewimage, setaddpatientprofilepreviewimage] = useState(null);
const addpatientprofileimageinputref= useRef(null);

// Search functionality for Profile Information
const [searchPatientProfiles, setSearchPatientProfiles] = useState('');
const [filteredPatientProfiles, setFilteredPatientProfiles] = useState([]);

// Appointment state variables - must be declared before search functions
const [activeappointmentstable, setactiveappointmentstable] = useState('allappointmentstable');
const [patientappointments, setpatientappointments] = useState([]);
const [loadingappointmens, setloadingappointments] = useState(false);
const [errorloadingappointments, seterrorloadingappointments] = useState(null);
const [selectedpatientappointment, setselectedpatientappointment] = useState(null);
const [viewpatientappointment, setviewpatientappointment] = useState(false);
const [deletepatientappointment, setdeletepatientappointment] = useState(false);
const [isAcceptingAppointment, setIsAcceptingAppointment] = useState(false);
const [isCompletingAppointment, setIsCompletingAppointment] = useState(false);
const [bautistaeyespecialist, setbautistaeyespecialist] = useState('');
const [ambhereyespecialist, setambhereyespecialist] = useState('');
const [ambherappointmentpaymentotal, setambherappointmentpaymentotal] = useState(null);
const [bautistaappointmentpaymentotal, setbautistaappointmentpaymentotal] = useState(null);
const [bautistaappointmentconsultationremarkssubject, setbautistaappointmentconsultationremarkssubject] = useState("");
const [ambherappointmentconsultationremarkssubject, setambherappointmentconsultationremarkssubject] = useState("");
const [bautistaappointmentconsultationremarks, setbautistaappointmentconsultationremarks] = useState("");
const [ambherappointmentconsultationremarks, setambherappointmentconsultationremarks] = useState("");
const [bautistaappointmentprescription, setbautistaappointmentprescription] = useState("");
const [ambherappointmentprescription, setambherappointmentprescription] = useState("");

// Search functionality for Appointments
const [searchAppointments, setSearchAppointments] = useState('');
const [filteredAppointments, setFilteredAppointments] = useState([]);

// Search function definitions - must be defined before useEffect hooks that use them
// Search functionality for Patient Profiles
const searchPatientProfilesDebounce = (functions, delay) => {
let timeout;
return (...args) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => functions.apply(this, args), delay);
};
};

const filterPatientProfiles = useCallback(searchPatientProfilesDebounce((term) => {
if (!term) {
  setFilteredPatientProfiles(patientdemographics);
} else {
  const filtered = patientdemographics.filter(profile => 
    profile.patientfirstname?.toLowerCase().includes(term.toLowerCase()) ||
    profile.patientlastname?.toLowerCase().includes(term.toLowerCase()) ||
    profile.patientemail?.toLowerCase().includes(term.toLowerCase()) ||
    profile.patientcontactnumber?.includes(term) ||
    profile.patientgender?.toLowerCase().includes(term.toLowerCase()) ||
    profile.patienthomeaddress?.toLowerCase().includes(term.toLowerCase())
  );
  setFilteredPatientProfiles(filtered);
}
}, 300), [patientdemographics]);

// Search functionality for Appointments
const searchAppointmentsDebounce = (functions, delay) => {
let timeout;
return (...args) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => functions.apply(this, args), delay);
};
};

const filterAppointments = useCallback(searchAppointmentsDebounce((term) => {
if (!term) {
  setFilteredAppointments(patientappointments);
} else {
  const searchTerm = term.toLowerCase();
  const filtered = patientappointments.filter(appointment => {
    // Helper function to format dates for searching
    const formatDateForSearch = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toLowerCase();
      } catch {
        return '';
      }
    };

    return (
      // Patient name search
      appointment.patientappointmentfirstname?.toLowerCase().includes(searchTerm) ||
      appointment.patientappointmentlastname?.toLowerCase().includes(searchTerm) ||
      appointment.patientappointmentemail?.toLowerCase().includes(searchTerm) ||
      `${appointment.patientappointmentfirstname} ${appointment.patientappointmentlastname}`.toLowerCase().includes(searchTerm) ||
      
      // Date created search
      formatDateForSearch(appointment.createdAt).includes(searchTerm) ||
      
      // Ambher appointment date search
      formatDateForSearch(appointment.patientambherappointmentdate).includes(searchTerm) ||
      appointment.patientambherappointmentdate?.toLowerCase().includes(searchTerm) ||
      
      // Bautista appointment date search
      formatDateForSearch(appointment.patientbautistaappointmentdate).includes(searchTerm) ||
      appointment.patientbautistaappointmentdate?.toLowerCase().includes(searchTerm) ||
      
      // Appointment status search
      appointment.patientambherappointmentstatus?.toLowerCase().includes(searchTerm) ||
      appointment.patientbautistaappointmentstatus?.toLowerCase().includes(searchTerm) ||
      
      // Additional appointment fields
      appointment.patientappointmentid?.toString().includes(searchTerm) ||
      appointment.patientappointmentclinic?.toLowerCase().includes(searchTerm) ||
      appointment.patientappointmentservice?.toLowerCase().includes(searchTerm) ||
      appointment.patientappointmenteyespecialist?.toLowerCase().includes(searchTerm)
    );
  });
  setFilteredAppointments(filtered);
}
}, 300), [patientappointments]);

// Initialize filtered appointments when appointments data changes
useEffect(() => {
setFilteredAppointments(patientappointments || []);
}, [patientappointments]);

//AI CODE
const calculateAge = (birthdate) => {
if (!birthdate) return '';

const birthDate = new Date(birthdate);
const today = new Date();

let age = today.getFullYear() - birthDate.getFullYear();
const monthDiff = today.getMonth() - birthDate.getMonth();

// Adjust age if birthday hasn't occurred yet this year
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
  age--;
}

// Ensure minimum age is 1
return Math.max(1, age);
};

const resetpatientprofileformdata = () => {
setdemoformdata({
  patientemail: '',
  patientlastname: '',
  patientfirstname: '',
  patientmiddlename: '',
  patientage: '',
  patientbirthdate: '',
  patientgender: '',
  patientcontactnumber: '',
  patienthomeaddress: '',
  patientemergencycontactname: '',
  patientemergencycontactnumber: '',
  patientprofilepicture: ''
});
setaddpatientprofilepreviewimage(null);
setselectedpatientprofile(null);
if (addpatientprofileimageinputref.current) {
  addpatientprofileimageinputref.current.value = "";
}
};


const showprofiletable = (profiletableid) => {
    setactiveprofiletable(profiletableid);
};


const [selectedpatientdemo, setselectedpatientdemo] = useState(null);
const [demoformdata, setdemoformdata] = useState({
patientemail: '',
patientlastname: '',
patientfirstname: '',
patientmiddlename: '',
patientage: '',
patientbirthdate: '',
patientgender: '',
patientcontactnumber: '',
patienthomeaddress: '',
patientemergencycontactname: '',
patientemergencycontactnumber: '',
patientprofilepicture: ''
});



//RETRIEVING THE PATIENT DEMOGRAPHICS
// Smart cached demographics fetching with real-time updates
const fetchDemographicsData = useCallback(async (forceRefresh = false) => {
setloadingpatientdemographics(true);
setpatientdemoerror(null);

try {
  const demographics = await smartFetch(
    'adminDemographics',
    async () => {
      const response = await fetch('/api/patientdemographics', {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
        }
      });

      if (!response.ok) throw new Error("Failed to retrieve patient demographics");
      return response.json();
    },
    CACHE_DURATIONS.MEDIUM, // 5 minutes cache
    forceRefresh
  );

  setpatientdemographics(demographics);
} catch (error) {
  setpatientdemoerror(error.message);
} finally {
  setloadingpatientdemographics(false);
}
}, [smartFetch, CACHE_DURATIONS, currentusertoken]);

useEffect(() => {
if(activeprofiletable === "patientprofiletable") {
  fetchDemographicsData();
}
}, [activeprofiletable, fetchDemographicsData]);

// Listen for real-time demographics updates
useEffect(() => {
if (realtimeUpdates.has('demographics')) {
  fetchDemographicsData(true); // Force refresh on real-time update
}
}, [realtimeUpdates, fetchDemographicsData]);

// Patient Profiles Filter
useEffect(() => {
if (searchPatientProfiles) {
  filterPatientProfiles(searchPatientProfiles);
} else {
  setFilteredPatientProfiles(patientdemographics);
}
}, [searchPatientProfiles, filterPatientProfiles, patientdemographics]);

// Initialize filtered data when demographics load
useEffect(() => {
setFilteredPatientProfiles(patientdemographics);
}, [patientdemographics]);




const renderpatientprofiles = () => {

if(loadingpatientdemographics) {
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <ProfileSkeleton key={index} />
      ))}
    </div>
  );
}


if(patientdemoerror){
  return(
    <div className="rounded-lg p-4 bg-red-50 text-red-600">
      Error: {patientdemoerror}
    </div>
  );
}


// Show filtered results if search is active, otherwise show no results message for original data
const displayData = searchPatientProfiles.trim() ? filteredPatientProfiles : patientdemographics;

if(displayData.length === 0){
  const message = searchPatientProfiles.trim() 
    ? `No patient profiles found matching "${searchPatientProfiles}".`
    : "No patient profiles found.";
  return(
    <div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">{message}</div>
  );
}




return (
  <div className="overflow-y-auto w-full h-full flex flex-wrap content-start gap-3 pl-2 pt-2">
  
  {displayData.map((patient) => (
    <div id="patientcard" key={patient._id} onClick={() => {
    setshowpatientpofile(true);
    setselectedpatientdemo(patient);
    setdemoformdata({
      patientlastname: patient.patientlastname,
      patientfirstname: patient.patientfirstname,
      patientmiddlename: patient.patientmiddlename,
      patientage: patient.patientage,
      patientbirthdate: patient.patientbirthdate,
      patientgender: patient.patientgender,
      patientcontactnumber: patient.patientcontactnumber,
      patienthomeaddress: patient.patienthomeaddress,
      patientemergencycontactname: patient.patientemergencycontactname,
      patientemergencycontactnumber: patient.patientemergencycontactnumber,
      patientprofilepicture: patient.patientprofilepicture

    });

    setpreviewimage(patient.patientprofilepicture);
    setselectedpatientprofile({
      id: patient._id,
      email: patient.patientemail,
      name: `${patient.patientfirstname} ${patient.patientlastname}`});
  }}
  
  className="flex justify-center items-center mb-1 bg-white shadow-lg w-[316px] h-[120px] rounded-3xl hover:cursor-pointer hover:scale-105 transition-all ease-in-out duration-300 " >
    <div className="w-[125px] h-full  rounded-2xl flex justify-center items-center">
    <img src={patient.patientprofilepicture || defaultprofilepic} alt="Profile" className="h-18 w-18 rounded-full object-cover"></img>
    </div>
    <div className="bg-white min-w-0 flex flex-col justify-center items-start pl-2 pr-2 w-full h-full  rounded-3xl">
      <h1 className="font-albertsans font-semibold text-[17px] truncate w-full text-[#2d3744]">{patient.patientfirstname} {patient.patientlastname}</h1>
      <p className="text-[14px] truncate w-full">{patient.patientemail}</p>
    </div>
  </div>
  ))}


  
  </div>

);
};


//Debounce Email Check
useEffect(() =>{
  const demoformdebounceemailcheck = async () => {
    if(!demoformdata.patientemail) {
      setdemopatientemailerror(false);
      setdemopatientemailexist(false);
      setemailisnotpatient(false);
      setemailisnotpatienterror(false);
      return;
    }


    if(!demopatientemailcharacters.test(demoformdata.patientemail)){
      setdemopatientemailerror(false);
      setdemopatientemailexist(false);
      setemailisnotpatient(false);
      setemailisnotpatienterror(false); 
      return;
    }


    setdemopatientcheckemail(true);



    try{
      const demoresponse = await fetch(`/api/patientdemographics/patientemail/${encodeURIComponent(demoformdata.patientemail)}`);

      const demodata = await demoresponse.json();

      if(demodata && !demodata.message){
        setdemopatientemailerror(true);
        setdemopatientemailexist(true);
        setemailisnotpatient(false);
        setemailisnotpatienterror(false);
        setdemopatientcheckemail(false);
        return;
      }

      const [patientresponse, staffresponse, ownerresponse, adminresponse] = await Promise.all([
        fetch(`/api/patientaccounts/check-email/${encodeURIComponent(demoformdata.patientemail)}`),
        fetch(`/api/staffaccounts/check-email/${encodeURIComponent(demoformdata.patientemail)}`),
        fetch(`/api/owneraccounts/check-email/${encodeURIComponent(demoformdata.patientemail)}`),
        fetch(`/api/adminaccounts/check-email/${encodeURIComponent(demoformdata.patientemail)}`)
      ]);


      const [patientdata, staffdata, ownerdata, admindata] = await Promise.all([
          patientresponse.json(),
          staffresponse.json(),
          ownerresponse.json(),
          adminresponse.json()
      ]);


      const accountexists = patientdata.exists || staffdata.exists || ownerdata.exists || admindata.exists;

      if(accountexists){
          const isnonpatient = staffdata.exists || ownerdata.exists || admindata.exists;
          setdemopatientemailerror(false);
          setdemopatientemailexist(false);
          setemailisnotpatient(isnonpatient);
          setemailisnotpatienterror(isnonpatient);
      }else{
          setdemopatientemailerror(false);
          setdemopatientemailexist(false);
          setemailisnotpatient(false);
          setemailisnotpatienterror(false);
      }


    }catch(error){
      console.error("Failed Email Validation: ", error);
          setdemopatientemailerror(false);
          setdemopatientemailexist(false);
          setemailisnotpatient(false);
          setemailisnotpatienterror(false);
    }finally{
          setdemopatientcheckemail(false);
    }


  };

  const timer = setTimeout(demoformdebounceemailcheck, 500);
  return () => clearTimeout(timer);
}, [demoformdata.patientemail]);




//INSERT PATIENT PROFILE  //INSERT PATIENT PROFILE  //INSERT PATIENT PROFILE  //INSERT PATIENT PROFILE  //INSERT PATIENT PROFILE  //INSERT PATIENT PROFILE
const addpatientprofile = async (e) => {
  e.preventDefault();
  setaddpatientprofileissubmitting(true);
  setaddpatientprofilemessage({text: "", type: ""});

  try{
    if(demopatientemailerror || demopatientemailexist || emailisnotpatienterror) {
      throw new Error("Fix email validation before submitting");
    }


    const demoformdatatosend = {
      ...demoformdata,
      patientprofilepicture: addpatientprofilepreviewimage || demoformdata.patientprofilepicture
    };

    const response = await fetch(`/api/patientdemographics`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(demoformdatatosend)
    });


    if(!response.ok) {
          const errordata = await response.json();
          throw new Error(errordata.message || "Failed to create patient profile");
    }

    const fetchresponse = await fetch('/api/patientdemographics', {
      headers: {
        'Authorization' : `Bearer ${currentusertoken}`
      }
    });

    const updateddata = await fetchresponse.json();
    setpatientdemographics(updateddata);

    resetpatientprofileformdata();
    setaddpatientprofilemessage({
      text: "Patient Profile successfully created",
      type: "success"
    });

  }catch (error) {
    console.error("Error creating patient profile: ", error);
    setaddpatientprofilemessage({
      text: error.message || "Failed to create patient profile",
      type: "success"
    });
  }finally{
    setaddpatientprofileissubmitting(false);
  }
}



//DISPLAY AND UPDATE PATIENT PROFILE
const retrieveandupdatepatientprofile = async (e) => {
  e.preventDefault();

  try{


    const response = await fetch(`/api/patientdemographics/${selectedpatientdemo._id}`,{
      method: 'PUT',
      headers:{
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        ...demoformdata,
        patientprofilepicture: previewimage || demoformdata.patientprofilepicture
      })
    });


    if(!response.ok) throw new Error("Failed to update patient demographics");

    const fetchresponse = await fetch('/api/patientdemographics',{
      headers: {'Authorization' : `Bearer ${currentusertoken}`}
    });

    const updateddata = await fetchresponse.json();
    setpatientdemographics(updateddata);
    setshowpatientpofile(false);

  }catch(error){
    console.error("Error updating patient demographic: ", error);
  }
}


//DELETE PATIENT PROFILE  //DELETE PATIENT PROFILE  //DELETE PATIENT PROFILE  //DELETE PATIENT PROFILE  //DELETE PATIENT PROFILE  //DELETE PATIENT PROFILE
const deletepatientprofile = async () => {
    try{
      if(!selectedpatientprofile) return;

      const response = await fetch(`/api/patientdemographics/${selectedpatientprofile.id}`,{
        method: 'DELETE',
        headers:{
          'Authorization': `Bearer ${currentusertoken}`
        }
      });



      if(!response.ok){
        throw new Error("Failed to delete patient account");
      }



      const fetchresponse = await fetch('/api/patientdemographics', {
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
          }
      });

      if(!fetchresponse.ok) {
        throw new Error("Failed to retrieve updated patient profile");
      }
      const data = await fetchresponse.json();
      setpatientdemographics(data);

      setshowpatientpofile(false)
      setshowdeletepatientprofiledialog(false);
      setselectedpatientprofile(null);

      
    }catch (error){
      console.error("Failed deleting patient: ", error);
    }
  };



//PROFILE IMAGE TYPE HANDLING
const addpatientprofilehandlechange = async (e) => {
const file = e.target.files[0];

if (!file) return;


const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
if(!imagefiletype.includes(file.type)) {
  alert("Please select an image file (JPG or PNG)");
  return;
}


const maximagefile = 1;
if(file.size > maximagefile * 1024 * 1024){
  alert("Image is too large. Please select image under 1MB");
  return;
}

setselectedpatientprofile(null);
setaddpatientprofilepreviewimage(null);

if(addpatientprofileimageinputref.current){
  addpatientprofileimageinputref.current.value = "";
}






try{

  const imageconfiguration = {
    maximagemb: 1,
    maxworh: 800,
    useWebWorker: true,
    initialQuality: 0.8
  };


  const compressedimageprofile = await imageCompression(file, imageconfiguration);
  const reader = new FileReader();
  reader.onloadend = () => {

    if(reader.error){
      console.error("Error processing image file : ", reader.error);
      alert("Error processing image file. Try again");
      return;
    }
    setaddpatientprofilepreviewimage(reader.result);
  };


  reader.onerror = () => {
    console.error("File Reader Error : ", reader.error);
    alert("Error reading file. Try again");
    return;
  };

  reader.readAsDataURL(compressedimageprofile);
  setselectedpatientprofile(compressedimageprofile);


} catch (error) {

  console.error("Image file compression failed : ", error.message);
  alert("Image file compression failed. Try again");
  return;

}
  

};

//Handles the click event of upload button
const addpatientprofilehandleuploadclick = () => {
addpatientprofileimageinputref.current.click();
};

const addpatientprofilehandleremoveprofile = () => {
setselectedpatientprofile(null);
setaddpatientprofilepreviewimage(null);
if(addpatientprofileimageinputref.current){
  addpatientprofileimageinputref.current.value = "";
}
}
















//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT
//APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT //APPOINTMENT MANAGEMENT

const showappointmentstable = (appointmentstableid) => {
    setactiveappointmentstable(appointmentstableid);
};

// Search functionality for Appointments - search states are already defined above

const textarearef = useRef(null);
const adjusttextareaheight = () => {
  if(textarearef.current){
    textarearef.current.style.height = 'auto';
    textarearef.current.style.height = `${textarearef.current.scrollHeight}px`;
  }
}









  const [showotherpatientbautistaappointmentotherservice, setshowotherpatientbautistaappointmentotherservice] = useState(false);
  const [patientbautistaappointmentotherservicenote, setpatientbautistaappointmentotherservicenote] = useState("");

  const [showotherpatientambherappointmentotherservice, setshowotherpatientambherappointmentotherservice] = useState(false);
  const [patientambherappointmentotherservicenote, setpatientambherappointmentotherservicenote] = useState("");



useEffect(() => {
  adjusttextareaheight();
});



// Smart cached appointment fetching with real-time updates
const fetchAppointmentData = useCallback(async (forceRefresh = false) => {
 setloadingappointments(true);
 seterrorloadingappointments(null);

 try {
   const appointments = await smartFetch(
     'adminAppointments',
     async () => {
       const response = await fetch('/api/patientappointments/appointments', {
         headers: {
           Authorization: `Bearer ${currentusertoken}`
         }
       });

       if (!response.ok) throw new Error("Failed to fetch patient appointments");
       return response.json();
     },
     CACHE_DURATIONS.MEDIUM, // 5 minutes cache
     forceRefresh
   );

   setpatientappointments(appointments);
 } catch (error) {
   seterrorloadingappointments(error.message);
 } finally {
   setloadingappointments(false);
 }
}, [smartFetch, CACHE_DURATIONS, currentusertoken]);

useEffect(() => {
 if(activeappointmentstable === 'allappointmentstable') {
   fetchAppointmentData();
 }
}, [activeappointmentstable, fetchAppointmentData]);

// Listen for real-time appointment updates
useEffect(() => {
 if (realtimeUpdates.has('appointment')) {
   fetchAppointmentData(true); // Force refresh on real-time update
 }
}, [realtimeUpdates, fetchAppointmentData]);

// Appointments Filter
useEffect(() => {
if (searchAppointments) {
  filterAppointments(searchAppointments);
} else {
  setFilteredAppointments(patientappointments);
}
}, [searchAppointments, filterAppointments, patientappointments]);

// Initialize filtered data when appointments load
useEffect(() => {
setFilteredAppointments(patientappointments);
}, [patientappointments]);






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



//CONVERTS THE APPOINTMENT TIME INTO (ex. 10:00 P.M.)
//Formats the time selected
const formatappointmenttime = (formattedtimestring) => {
if (!formattedtimestring) return ''; 
return formattedtimestring; 
};




//WHOLE APPOINTMENT DELETE //WHOLE APPOINTMENT DELETE //WHOLE APPOINTMENT DELETE //WHOLE APPOINTMENT DELETE   
const handledeleteappointment = async (appointmentId) => {
// Check if user has permission to delete appointments
if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner" && currentuserloggedin !== "Admin") {
  console.error("Only Staff, Owner, and Admin can delete appointments");
  return;
}

// Validate appointmentId
if (!appointmentId) {
  console.error("Appointment ID is missing");
  return;
}

try {
  const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    }
  });

  if (!response.ok) throw new Error('Failed to Delete Appointment');

  setpatientappointments(prev =>
    prev.filter(appt => appt.patientappointmentid !== appointmentId)
  );

} catch (error) {
  console.error("Appointment deletion failed: ", error);
  seterrorloadingappointments(error.message);
}
}


//AICODE
//CLINIC APPOINTMENT DELETE (NULLIFY FIELDS)
const handledeleteappointmentbyclinic = async (appointmentId, clinicType) => {
// Check if user has permission to delete appointments
if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner" && currentuserloggedin !== "Admin") {
  console.error("Only Staff, Owner, and Admin can delete appointments");
  return;
}

// Validate appointmentId
if (!appointmentId) {
  console.error("Appointment ID is missing");
  return;
}

try {
  // First check if there's an appointment in the other clinic
  const appointment = patientappointments.find(appt => 
    appt.patientappointmentid === appointmentId
  );

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Check if there's a scheduled appointment in the other clinic
  const hasOtherClinicAppointment = clinicType === 'bautista' ? 
    appointment.patientambherappointmentdate && appointment.patientambherappointmenttime :
    appointment.patientbautistaappointmentdate && appointment.patientbautistaappointmenttime;

  if (hasOtherClinicAppointment) {
    // If there's an appointment in the other clinic, nullify only the current clinic's fields
    const fieldsToNullify = clinicType === 'ambher' ? {
      patientambherappointmentid: null,
      patientambherappointmenteyespecialist: null,
      patientambherappointmentstaffname: null,
      patientambherappointmentdate: null,
      patientambherappointmenttime: null,
      patientambherappointmentcomprehensiveeyeexam: null,
      patientambherappointmentdiabeticretinopathy: null,
      patientambherappointmentglaucoma: null,
      patientambherappointmenthypertensiveretinopathy: null,
      patientambherappointmentretinolproblem: null,
      patientambherappointmentcataractsurgery: null,
      patientambherappointmentpterygiumsurgery: null,
      patientambherappointmentstatus: null,
      patientambherappointmentstatushistory: null,
      patientambherappointmentpaymentotal: null,
      patientambherappointmentconsultationremarkssubject: null,
      patientambherappointmentconsultationremarks: null,
      patientambherappointmentprescription: null,
      patientambherappointmentrating: null,
      patientambherappointmentfeedback: null
    } : {
      patientbautistaappointmentid: null,
      patientbautistaappointmenteyespecialist: null,
      patientbautistaappointmentstaffname: null,
      patientbautistaappointmentdate: null,
      patientbautistaappointmenttime: null,
      patientbautistaappointmentcomprehensiveeyeexam: null,
      patientbautistaappointmentdiabeticretinopathy: null,
      patientbautistaappointmentglaucoma: null,
      patientbautistaappointmenthypertensiveretinopathy: null,
      patientbautistaappointmentretinolproblem: null,
      patientbautistaappointmentcataractsurgery: null,
      patientbautistaappointmentpterygiumsurgery: null,
      patientbautistaappointmentstatus: null,
      patientbautistaappointmentstatushistory: null,
      patientbautistaappointmentpaymentotal: null,
      patientbautistaappointmentconsultationremarkssubject: null,
      patientbautistaappointmentconsultationremarks: null,
      patientbautistaappointmentprescription: null,
      patientbautistaappointmentrating: null,
      patientbautistaappointmentfeedback: null
    };

    // Make API call to update appointment with nullified fields
    const response = await fetch(
      `/api/patientappointments/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentusertoken}`
        },
        body: JSON.stringify(fieldsToNullify)
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to nullify appointment fields');
    }

    // Update the UI with the new appointment data
    const updatedAppointment = await response.json();
    setselectedpatientappointment(updatedAppointment);
    
    // Update the appointments list to reflect the change
    setpatientappointments(prevAppointments => 
      prevAppointments.map(appt => 
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      ).filter(appt => {
        if (clinicType === 'ambher') {
          return appt.patientambherappointmentdate !== null && 
                 appt.patientambherappointmenttime !== null && 
                 appt.patientambherappointmentid !== null;
        } else {
          return appt.patientbautistaappointmentdate !== null && 
                 appt.patientbautistaappointmenttime !== null && 
                 appt.patientbautistaappointmentid !== null;
        }
      })
    );


    
  } else {
    // If no appointment in other clinic, delete the entire appointment
    const response = await fetch(
     `/api/patientappointments/appointments/${appointmentId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${currentusertoken}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete appointment');
    }

    // Remove the appointment from the list
    setpatientappointments(prevAppointments =>
      prevAppointments.filter(appt => 
        clinicType === 'bautista' ? 
          appt.patientbautistaappointmentid !== appointmentId :
          appt.patientambherappointmentid !== appointmentId
      )
    );

    // Clear selected appointment if it was the deleted one
    if (selectedpatientappointment) {
      if (clinicType === 'bautista' && selectedpatientappointment.patientbautistaappointmentid === appointmentId) {
        setselectedpatientappointment(null);
      } else if (clinicType === 'ambher' && selectedpatientappointment.patientambherappointmentid === appointmentId) {
        setselectedpatientappointment(null);
      }
    }
  }
  
  console.log(`${clinicType} appointment handled successfully`);
} catch (error) {
  console.error(`Error handling ${clinicType} appointment:`, error);
  // TODO: Add error handling UI feedback
}
};

// ... existing code ...







const handleviewappointment = (appointment) => {
setselectedpatientappointment(appointment);

// Populate form fields with existing appointment data
if (appointment) {
  // Ambher Optical data
  if (appointment.patientambherappointmentdate) {
    setambhereyespecialist(appointment.patientambherappointmenteyespecialist || '');
    setambherappointmentpaymentotal(appointment.patientambherappointmentpaymentotal || null);
    setambherappointmentconsultationremarkssubject(appointment.patientambherappointmentconsultationremarkssubject || '');
    setambherappointmentconsultationremarks(appointment.patientambherappointmentconsultationremarks || '');
    setambherappointmentprescription(appointment.patientambherappointmentprescription || '');
  }
  
  // Bautista Eye Center data
  if (appointment.patientbautistaappointmentdate) {
    setbautistaeyespecialist(appointment.patientbautistaappointmenteyespecialist || '');
    setbautistaappointmentpaymentotal(appointment.patientbautistaappointmentpaymentotal || null);
    setbautistaappointmentconsultationremarkssubject(appointment.patientbautistaappointmentconsultationremarkssubject || '');
    setbautistaappointmentconsultationremarks(appointment.patientbautistaappointmentconsultationremarks || '');
    setbautistaappointmentprescription(appointment.patientbautistaappointmentprescription || '');
  }
}
};




//UPDATING APPOINTMENT STATUS
const handleacceptappointment = async (appointmentId, clinicType) => {
// Check if user has permission to accept appointments
if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
  console.error("Only Staff and Owner can accept appointments");
  return;
}

// Validate appointmentId
if (!appointmentId) {
  console.error("Appointment ID is missing");
  return;
}

// Set loading state to true
setIsAcceptingAppointment(true);

try{
  const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`,{
    method: "PUT",
    headers: {
      "Content-Type" : "application/json",
    },
    body:JSON.stringify({
      [`patient${clinicType}appointmentstatus`]: 'Accepted',
      [`patient${clinicType}appointmentstatushistory`]:{
        changedBy: adminfirstname
      },
      [`patient${clinicType}appointmenteyespecialist`]:clinicType === 'ambher' ? ambhereyespecialist : bautistaeyespecialist
    })
  })


  if(!response.ok){
    throw new Error("Failed to update appointment status");
  }

  const updatedappointment = await response.json();
  setselectedpatientappointment(updatedappointment);
  setpatientappointments(prevappointments =>
    prevappointments.map(appt =>
      appt.id === updatedappointment._id ? updatedappointment : appt
    )
  );


  console.log(`${clinicType} Appointment has been accepted successfully`);

  }catch(error){
    console.error(`Failed to accept ${clinicType} patient appointment:`, error);
  } finally {
    // Always set loading state to false when done
    setIsAcceptingAppointment(false);
  }

};





//AICODE
const handleCompleteAppointment = async (appointmentId, clinicType) => {
  // Check if user has permission to complete appointments
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can complete appointments");
    return;
  }

  // Validate appointmentId
  if (!appointmentId) {
    console.error("Appointment ID is missing");
    return;
  }

  // Set loading state to true
  setIsCompletingAppointment(true);
  
  try {
    // Make API call to update appointment status with correct URL
    const response = await fetch(
      `/api/patientappointments/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentusertoken}`
        },
        body: JSON.stringify({
          [`patient${clinicType}appointmentstatus`]: 'Completed',
          [`patient${clinicType}appointmentstatushistory`]: {
            changedBy: adminfirstname
          },
          [`patient${clinicType}appointmenteyespecialist`]: clinicType === 'ambher' ? ambhereyespecialist : bautistaeyespecialist,
          [`patient${clinicType}appointmentpaymentotal`]: clinicType === 'ambher' ? ambherappointmentpaymentotal : bautistaappointmentpaymentotal,
          [`patient${clinicType}appointmentconsultationremarkssubject`]: clinicType === 'ambher' ? ambherappointmentconsultationremarkssubject : bautistaappointmentconsultationremarkssubject,
          [`patient${clinicType}appointmentconsultationremarks`]: clinicType === 'ambher' ? ambherappointmentconsultationremarks : bautistaappointmentconsultationremarks,
          [`patient${clinicType}appointmentprescription`]: clinicType === 'ambher' ? ambherappointmentprescription : bautistaappointmentprescription,

        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update appointment status');
    }

    // Update the UI with the new appointment data
    const updatedAppointment = await response.json();
    setselectedpatientappointment(updatedAppointment);
    
    // Update the appointments list to reflect the change
    setpatientappointments(prevAppointments => 
      prevAppointments.map(appt => 
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
    
    console.log(`${clinicType} appointment completed successfully`);
  } catch (error) {
    console.error(`Error completing ${clinicType} appointment:`, error);
    // TODO: Add error handling UI feedback
  } finally {
    // Always set loading state to false when done
    setIsCompletingAppointment(false);
  }
};
















//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  
//MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS //MEDICAL RECORDS  

// Medical records state variables and search functionality are already defined above

// Medical Records State Variables
const [otherclinicrecords, setotherclinicrecords] = useState([]);
const [activemedicalrecordstable, setactivemedicalrecordstable] = useState('allmedicalrecordstable');
const showmedicalrecordstable = (medicalrecordstableid) => {
    setactivemedicalrecordstable(medicalrecordstableid);
};

const [showotherclinicrecord, setshowotherclinicrecord] = useState(false);
const [activepatientmedicalrecordstable, setactivepatientmedicalrecordstable] = useState('medicalrecordsconsultationtable');
const showpatientmedicalrecordstable = (patientmedicalrecordstableid) => {
    setactivepatientmedicalrecordstable(patientmedicalrecordstableid);
};

const [selectedpatientmedicalrecord,setselectedpatientmedicalrecord] = useState(null);
const [showpatientmedicalrecord, setshowpatientmedicalrecord] = useState(false);
const [showpatientmedicalrecordconsultation, setshowpatientmedicalrecordconsultation] = useState(false);
const [showpatientaddothermedicalrecord, setshowpatientaddothermedicalrecord] = useState(false);
const [showotherclinicrecordimage, setshowotherclinicrecordimage] = useState(false);

// Medical Records Search State
const [searchmedicalrecords, setsearchmedicalrecords] = useState('');
const [filteredmedicalrecords, setfilteredmedicalrecords] = useState([]);

// Pagination State Variables
const [currentPage, setCurrentPage] = useState({
  patients: 1,
  staff: 1,
  owners: 1,
  administrators: 1,
  appointments: 1,
  medicalRecords: 1,
  ambherInventory: 1,
  bautistaInventory: 1,
  ambherOrders: 1,
  bautistaOrders: 1,
  profiles: 1
});

const itemsPerPage = 10; // Number of items to display per page for tables

// Dynamic inventory per page based on container height
const [inventoryItemsPerPage, setInventoryItemsPerPage] = useState(20);
const inventoryContainerRef = useRef(null);

// Dynamic appointments per page based on container height
const [appointmentsPerPage, setAppointmentsPerPage] = useState(6);
const appointmentTableRef = useRef(null);

// Calculate optimal appointments per page based on container height
const calculateAppointmentsPerPage = useCallback(() => {
  if (appointmentTableRef.current) {
    const containerHeight = appointmentTableRef.current.clientHeight;
    const headerHeight = 60; // Approximate height of table header
    const paginationHeight = 60; // Approximate height of pagination
    const rowHeight = 80; // Approximate height of each appointment row
    const padding = 20; // Extra padding for better spacing
    
    const availableHeight = containerHeight - headerHeight - paginationHeight - padding;
    const calculatedRows = Math.floor(availableHeight / rowHeight);
    
    // Ensure minimum of 3 appointments and maximum of 20 for performance
    const optimalRows = Math.max(3, Math.min(calculatedRows, 20));
    
    if (optimalRows !== appointmentsPerPage) {
      setAppointmentsPerPage(optimalRows);
      // Reset to first page when changing page size
      setCurrentPage(prev => ({ ...prev, appointments: 1 }));
    }
  }
}, [appointmentsPerPage]);

// Calculate optimal inventory items per page based on container height
const calculateInventoryItemsPerPage = useCallback(() => {
  if (inventoryContainerRef.current) {
    const containerHeight = inventoryContainerRef.current.clientHeight;
    const headerHeight = 100; // Approximate height of filters and search
    const paginationHeight = 60; // Approximate height of pagination
    const cardHeight = 320; // Approximate height of each inventory card (220px width + spacing)
    const cardsPerRow = 4; // Approximate cards per row based on container width
    const padding = 40; // Extra padding for better spacing
    
    const availableHeight = containerHeight - headerHeight - paginationHeight - padding;
    const calculatedRows = Math.floor(availableHeight / cardHeight);
    const optimalItems = Math.max(1, calculatedRows) * cardsPerRow;
    
    // Ensure minimum of 8 items and maximum of 40 for performance
    const finalOptimalItems = Math.max(8, Math.min(optimalItems, 40));
    
    if (finalOptimalItems !== inventoryItemsPerPage) {
      setInventoryItemsPerPage(finalOptimalItems);
      // Reset to first page when changing page size
      setCurrentPage(prev => ({ 
        ...prev, 
        ambherInventory: 1,
        bautistaInventory: 1
      }));
    }
  }
}, [inventoryItemsPerPage]);

// Recalculate when window resizes or component mounts
useEffect(() => {
  const handleResize = () => {
    calculateAppointmentsPerPage();
    calculateInventoryItemsPerPage();
  };

  // Initial calculation
  setTimeout(() => {
    calculateAppointmentsPerPage();
    calculateInventoryItemsPerPage();
  }, 100); // Small delay to ensure DOM is ready
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [calculateAppointmentsPerPage, calculateInventoryItemsPerPage]);

// Recalculate when switching between appointment tables
useEffect(() => {
  if (activedashboard === 'appointmentmanagement') {
    setTimeout(calculateAppointmentsPerPage, 100);
  }
}, [activedashboard, activeappointmentstable, calculateAppointmentsPerPage]);

// Recalculate when switching between inventory tables or dashboard
useEffect(() => {
  if (activedashboard === 'inventorymanagement') {
    setTimeout(calculateInventoryItemsPerPage, 100);
  }
}, [activedashboard, calculateInventoryItemsPerPage]);

// Pagination functions
const handlePageChange = (section, page) => {
  setCurrentPage(prev => ({
    ...prev,
    [section]: page
  }));
};

// Get paginated data function
const getPaginatedData = (data, section) => {
  const page = currentPage[section] || 1;
  let itemsPerPageToUse;
  
  if (section === 'ambherInventory' || section === 'bautistaInventory') {
    itemsPerPageToUse = inventoryItemsPerPage;
  } else if (section === 'appointments') {
    itemsPerPageToUse = appointmentsPerPage;
  } else {
    itemsPerPageToUse = itemsPerPage;
  }
  
  const startIndex = (page - 1) * itemsPerPageToUse;
  const endIndex = startIndex + itemsPerPageToUse;
  return data.slice(startIndex, endIndex);
};

const [otherclinicselectedimage, setotherclinicselectedimage] = useState(null);
const [otherclinicpreviewimage, setotherclinicpreviewimage] = useState (null);
const otherclinicimageinputref = useRef(null);


//PROFILE IMAGE TYPE HANDLING
const otherclinichandleprofilechange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;


  const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
  if(!imagefiletype.includes(file.type)) {
    alert("Please select an image file (JPG or PNG)");
    return;
  }


  const maximagefile = 2;
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 2MB");
    return;
  }

  setotherclinicselectedimage(null);
  setotherclinicpreviewimage(null);

  if(otherclinicimageinputref.current){
    otherclinicimageinputref.current.value = "";
  }






  try{

    const imageconfiguration = {
      maximagemb: 1,
      maxworh: 800,
      useWebWorker: true,
      initialQuality: 0.8
    };


    const compressedimageprofile = await imageCompression(file, imageconfiguration);
    const reader = new FileReader();
    reader.onloadend = () => {

      if(reader.error){
        console.error("Error processing image file : ", reader.error);
        alert("Error processing image file. Try again");
        return;
      }
      setotherclinicpreviewimage(reader.result);
    };


    reader.onerror = () => {
      console.error("File Reader Error : ", reader.error);
      alert("Error reading file. Try again");
      return;
    };

    reader.readAsDataURL(compressedimageprofile);
    setotherclinicselectedimage(compressedimageprofile);
  

  } catch (error) {

    console.error("Image file compression failed : ", error.message);
    alert("Image file compression failed. Try again");
    return;

  }
    

};

//Handles the click event of upload button
const otherclinichandleuploadclick = () => {
  otherclinicimageinputref.current.click();
};

const otherclinichandleremoveprofile = () => {
  setotherclinicselectedimage(null);
  setotherclinicpreviewimage(null);
  if(otherclinicimageinputref.current){
    otherclinicimageinputref.current.value = "";
  }
}









const fetchotherclinicrecords = async () => {
  try{
    const response = await fetch(`/api/otherclinicrecord?includeImages=false`, {
      headers: {
        'Authorization' : `Bearer ${currentusertoken}`
      }
    });

    if(!response.ok){
      throw new Error (`HTTP error! Error: ${response.status}`);
    }

    const data = await response.json();
    // Handle both old format (array) and new format (object with data property)
    if (data.data) {
      setotherclinicrecords(data.data);
    } else {
      setotherclinicrecords(data);
    }

  }catch(error){
    console.error('Error fetching other clinic records: ', error);
    setotherclinicrecords([]); // Set empty array on error
  }
};

// Fetch patient-specific medical records
const fetchPatientMedicalRecords = useCallback(async (patientEmail) => {
  if (!patientEmail) {
    console.log('No patient email provided');
    setotherclinicrecords([]);
    return;
  }

  try {
    console.log('Fetching medical records for patient:', patientEmail);
    const response = await fetch(`/api/otherclinicrecord/patient/${encodeURIComponent(patientEmail)}?includeImages=false`, {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received medical records data:', data);
    
    // Handle both old format (array) and new format (object with data property)
    if (data.data) {
      setotherclinicrecords(data.data);
    } else {
      setotherclinicrecords(data || []);
    }

  } catch (error) {
    console.error('Error fetching patient medical records:', error);
    setotherclinicrecords([]);
  }
}, [currentusertoken]);

// Filter medical records based on search term
const filterMedicalRecords = useCallback((term) => {
  if (!term.trim()) {
    setfilteredmedicalrecords(patientdemographics || []);
    return;
  }

  const searchTerm = term.toLowerCase().trim();
  const filtered = (patientdemographics || []).filter(patient => {
    return (
      patient.patientfirstname?.toLowerCase().includes(searchTerm) ||
      patient.patientmiddlename?.toLowerCase().includes(searchTerm) ||
      patient.patientlastname?.toLowerCase().includes(searchTerm) ||
      patient.patientemail?.toLowerCase().includes(searchTerm) ||
      patient.patientdemographicId?.toString().includes(searchTerm) ||
      `${patient.patientfirstname} ${patient.patientmiddlename} ${patient.patientlastname}`.toLowerCase().includes(searchTerm) ||
      `${patient.patientfirstname} ${patient.patientlastname}`.toLowerCase().includes(searchTerm)
    );
  });

  setfilteredmedicalrecords(filtered);
}, [patientdemographics]);

// Update filtered records when search term changes
useEffect(() => {
  filterMedicalRecords(searchmedicalrecords);
}, [searchmedicalrecords, filterMedicalRecords]);

// Initialize filtered records when patientdemographics changes
useEffect(() => {
  setfilteredmedicalrecords(patientdemographics || []);
}, [patientdemographics]);

useEffect(() => {
  fetchotherclinicrecords();
}, []);

// Fetch patient-specific medical records when a patient is selected
useEffect(() => {
  if (selectedpatientmedicalrecord?.patientemail) {
    console.log('Patient selected, fetching medical records for:', selectedpatientmedicalrecord.patientemail);
    fetchPatientMedicalRecords(selectedpatientmedicalrecord.patientemail);
  } else {
    console.log('No patient selected, clearing medical records');
    setotherclinicrecords([]);
  }
}, [selectedpatientmedicalrecord?.patientemail, fetchPatientMedicalRecords]);

// Load medical record image by ID
const loadMedicalRecordImage = useCallback(async (recordId) => {
  if (!recordId) {
    console.log('No record ID provided for image loading');
    return null;
  }

  try {
    console.log('Loading medical record image for ID:', recordId);
    const response = await fetch(`/api/otherclinicrecord/${recordId}?includeImages=true`, {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Loaded medical record with image:', data);
    
    return data.patientotherclinicrecordimage || null;

  } catch (error) {
    console.error('Error loading medical record image:', error);
    return null;
  }
}, [currentusertoken]);

const [otherclinicname, setotherclinicname] = useState('');
const [othercliniceyespecialist, setothercliniceyespecialist] = useState('');
const [otherclinicconsultationdate, setotherclinicconsultationdate] = useState('');
const [otherclinicrecordissubmitting, setotherclinicrecordissubmitting] = useState(false);

const submitotherclinicdata = async (e) => {
e.preventDefault();
setotherclinicrecordissubmitting(true);

try{


  const otherclinicrecorddata = {

      patientotherclinicprofilepicture: selectedpatientmedicalrecord.patientprofilepicture,
      patientothercliniclastname: selectedpatientmedicalrecord.patientlastname,
      patientotherclinicfirstname: selectedpatientmedicalrecord.patientfirstname,
      patientotherclinicmiddlename: selectedpatientmedicalrecord.patientmiddlename,
      patientotherclinicemail: selectedpatientmedicalrecord.patientemail,


      patientotherclinicname: otherclinicname,
      patientothercliniceyespecialist: othercliniceyespecialist,
      patientotherclinicconsultationdate: otherclinicconsultationdate,
      patientotherclinicsubmittedbyfirstname: adminfirstname,
      patientotherclinicsubmittedbymiddlename: adminmiddlename,
      patientotherclinicsubmittedbylastname: adminlastname,
      patientotherclinicsubmittedbytype: currentuserloggedin,

      patientotherclinicrecordimage: otherclinicpreviewimage,
      
      }
  console.log("Submittin ReCORDD", otherclinicrecorddata);

  const response = await fetch(`/api/otherclinicrecord`,{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            'Authorization': `Bearer ${currentusertoken}`
          },
          body: JSON.stringify(otherclinicrecorddata)
  });

  console.log("Submittin ReCORDD", otherclinicrecorddata);

  if(!response.ok){
    throw new Error(`HTTP error! Error: ${response.status}`);
  }


  const result = await response.json();
  console.log('Other Clinic Record Successfull Submitted for Review', result);
  await fetchotherclinicrecords();
  setotherclinicselectedimage(false);
  setotherclinicpreviewimage(null);
  setotherclinicname("");
  setothercliniceyespecialist("");
  setotherclinicconsultationdate("");



}catch(error) {
  console.error('Error Submitting Other Clinic Record: ', error);
}finally{
  setotherclinicrecordissubmitting(false);
}
};












const [showdeleteotherclinicrecorddialog, setshowdeleteotherclinicrecorddialog] = useState(false);


const deleteotherclinicrecord = async () => {
try{
  if(!selectedpatientappointment) return;

  const response = await fetch(`/api/otherclinicrecord/${selectedpatientappointment.otherclinicid}`,{
    method: 'DELETE',
    headers:{
      'Authorization' : `Bearer ${currentusertoken}`
    }
  });

  const result = await response.json();
  if(!response.ok){
    throw new Error(result.message || "Failed to delete record");
  }

  await fetchotherclinicrecords();
  setselectedpatientappointment(null);
  setshowdeleteotherclinicrecorddialog(false);

}catch(error){
  console.error("Failed to delete:", error.message);
}
}




















//CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
//CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
//CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
//CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
//CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT
//CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT //CATEGORIES MANAGEMENT

// Set default inventory table based on user role and clinic
const getDefaultInventoryTable = () => {
if (isAmbherOnlyUser()) {
  return 'ambherinventorytable';
} else if (isBautistaOnlyUser()) {
  return 'bautistainventorytable';
}
return 'ambherinventorytable'; // Default for admin
};

const [activeinventorytable, setactiveinventorytable] = useState(getDefaultInventoryTable());
const showinventorytable = (inventorytableid) => {
    setactiveinventorytable(inventorytableid);
};

// Update default tables when user data changes
useEffect(() => {
if (userDataLoaded) {
  // Update inventory table based on current user clinic
  const staffClinic = localStorage.getItem('staffclinic');
  const ownerClinic = localStorage.getItem('ownerclinic');
  
  if (currentuserloggedin === "Staff") {
    if (staffClinic === 'Bautista Eye Center' || staffclinic === 'Bautista Eye Center') {
      setactiveinventorytable('bautistainventorytable');
    } else if (staffClinic === 'Ambher Optical' || staffclinic === 'Ambher Optical') {
      setactiveinventorytable('ambherinventorytable');
    }
  } else if (currentuserloggedin === "Owner") {
    if (ownerClinic === 'Bautista Eye Center' || ownerownedclinic === 'Bautista Eye Center') {
      setactiveinventorytable('bautistainventorytable');
    } else if (ownerClinic === 'Ambher Optical' || ownerownedclinic === 'Ambher Optical') {
      setactiveinventorytable('ambherinventorytable');
    }
  }
  // Admin users keep the default 'ambherinventorytable'
}
}, [userDataLoaded, staffclinic, ownerownedclinic, currentuserloggedin]);

const [activeambherinventorycategorytable, setactiveambherinventorycategorytable] = useState('all');
const showambherinventorycategory = (ambherinventorycategorytableid) => {
    setactiveambherinventorycategorytable(ambherinventorycategorytableid);
};

const [showaddambherinventorycategorydialog, setshowaddambherinventorycategorydialog] = useState(false);
const [showaddambheraddinventorycategory, setshowaddambheraddinventorycategory] = useState(false);
const [showdeleteambherinventorycategorydialog, setshowdeleteambherinventorycategorydialog] = useState(false);
const [ambherinventorycategorynameset, setambherinventorycategorynameset] = useState("");
const [ambherinventorycategoryissubmitting, setambherinventorycategoryissubmitting] = useState(false);
const [ambherinventorycategorynamecheck, setambherinventorycategorynamecheck] = useState(false);
const [ambherinventorycategorynameerror, setambherinventorycategorynameerror] = useState(false);
const [ambherinventorycategorynameexist, setambherinventorycategorynameexist] = useState(false);
const [ambherinventorycategorylist, setambherinventorycategorylist] = useState([]);
const [loadingambherinventorycategorylist, setloadingambherinventorycategorylist] = useState(true);
const [selectedambherinventorycategory, setselectedambherinventorycategory] = useState(null);




const currentuserdata = JSON.parse(localStorage.getItem("currentuser")) || {};


//INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME 
const submitambherinventorycategory = async (e) => {
  e.preventDefault();
  setambherinventorycategoryissubmitting(true);

try{


  const ambherinventorycategorydata = {


    ambherinventorycategoryname: ambherinventorycategorynameset,

    ambherinventorycategoryaddedbyprofilepicture: currentuserdata.profilepicture || '',
    ambherinventorycategoryaddedbylastname: currentuserdata.lastname || '',
    ambherinventorycategoryaddedbyfirstname: currentuserdata.firstname || '',
    ambherinventorycategoryaddedbymiddlename: currentuserdata.middlename || '',
    ambherinventorycategoryaddedbytype: currentuserdata.type || '',
    ambherinventorycategoryaddedbyemail: currentuserdata.email || '',




  }

  console.log(ambherinventorycategorydata);
  const response = await fetch(`/api/ambherinventorycategory`,{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    },
    body: JSON.stringify(ambherinventorycategorydata)
  });



  if(!response.ok){
    throw new Error(`Response fetching error! Error: ${response.status}`);

  }


  const result = await response.json();
  console.log('Ambher Inventory Category insertion successful: ', result);

  setambherinventorycategorylist(prev => [result, ...prev]);
  setambherinventorycategorynameset("");
  setshowaddambheraddinventorycategory(false);


}catch(error) {
  console.error('Error Ambher Inventory Category insertion: ', error);
  setambherinventorycategoryissubmitting(false);
}finally{
  setambherinventorycategoryissubmitting(false);
}
};




//Checks If Category Name is Already is Existing
useEffect(() => {
let ismounted = true;
const checkambherinventorycategoryname = async () => {
  const categoryname = ambherinventorycategorynameset.trim();

  if(!categoryname){
    if(ismounted){
      setambherinventorycategorynameerror(false);
      setambherinventorycategorynameexist(false);
    }
    return;
  }


  if (ismounted) setambherinventorycategorynamecheck(true);

  try{
    const response = await fetch(`/api/ambherinventorycategory/ambherinventorycategoryname/${encodeURIComponent(categoryname)}`);
 
    if(!ismounted) return;

    const data = await response.json();

    if(response.ok){
      setambherinventorycategorynameerror(true);
      setambherinventorycategorynameexist(true);
    }else if(response.status === 404){
      setambherinventorycategorynameerror(false);
      setambherinventorycategorynameexist(false);
    }
  
  }catch(error){
    if(ismounted){
      setambherinventorycategorynameerror(false);
      setambherinventorycategorynameexist(false);
    }
  }finally{
    if(ismounted) setambherinventorycategorynamecheck(false);
  }

};


const timer = setTimeout(checkambherinventorycategoryname, 500);
return () => {
  ismounted = false;
  clearTimeout(timer);
};
}, [ambherinventorycategorynameset])



//Fetching Ambher Inventory Categories
useEffect(() => {
const fetchambhercategories = async () => {
  try{
    const response = await fetch(`/api/ambherinventorycategory`);
    if(!response.ok) throw new Error("Failed to fetch Ambher Inevntory Categories");

    const data = await response.json();
    setambherinventorycategorylist(data);
  
  }catch(error){
    console.error("Error fetching ambher categories: ", error);
  }finally{
    setloadingambherinventorycategorylist(false);
  }
};
fetchambhercategories();
}, []);



const fetchambherinventorycategories = async () => {
try{
  const response = await fetch(`/api/ambherinventorycategory`);
  if(!response.ok) throw new Error("Failed to retrieve ambher inventory categories");

  const data = await response.json();
  setambherinventorycategorylist(data);
}catch(error){
  console.error("Fetching ambherinventorycategory failed", error);
}finally{
  setloadingambherinventorycategorylist(false);
}
};

useEffect(() => {
fetchambherinventorycategories();
}, []);



//Delete Ambher Inventory Category
const deleteambherinventorycategory = async () => {
if(!selectedambherinventorycategory) return;

try{
  const response = await fetch(`/api/ambherinventorycategory/${selectedambherinventorycategory.ambherinventorycategoryid}`,{
    method: 'DELETE',
    headers:{
      'Authorization' : `Bearer ${currentusertoken}`
    }
  });

  if(!response.ok) throw new Error("Failed to delete ambher inventory category");

  setambherinventorycategorylist(prev => prev.filter(cat => cat.ambherinventorycategoryid !== selectedambherinventorycategory.ambherinventorycategoryid));
  setshowdeleteambherinventorycategorydialog(false);
  setselectedambherinventorycategory(null);

}catch(error){
  console.error("Ambher Inventory Category Delete Failed: ", error);
}
}
















const [activebautistainventorycategorytable, setactivebautistainventorycategorytable] = useState('all');
const showbautistainventorycategory = (bautistainventorycategorytableid) => {
    setactivebautistainventorycategorytable(bautistainventorycategorytableid);
};

// Advanced filters state for Bautista
const [activeBautistaProductFilter, setActiveBautistaProductFilter] = useState('all');
const [bautistaPriceSortingProducts, setBautistaPriceSortingProducts] = useState('none');
const [bautistaQuantitySortingProducts, setBautistaQuantitySortingProducts] = useState('none');

const bautistaProductFilters = [
  { id: 'polarized', label: 'Polarized' },
  { id: 'kids', label: 'Kids' },
  { id: 'adults', label: 'Adults' },
  { id: 'men', label: "Men's" },
  { id: 'women', label: "Women's" },
  { id: 'unisex', label: 'Unisex' }
];

const [showaddbautistainventorycategorydialog, setshowaddbautistainventorycategorydialog] = useState(false);
const [showaddbautistaaddinventorycategory, setshowaddbautistaaddinventorycategory] = useState(false);
const [showdeletebautistainventorycategorydialog, setshowdeletebautistainventorycategorydialog] = useState(false);
const [bautistainventorycategorynameset, setbautistainventorycategorynameset] = useState("");
const [bautistainventorycategoryissubmitting, setbautistainventorycategoryissubmitting] = useState(false);
const [bautistainventorycategorynamecheck, setbautistainventorycategorynamecheck] = useState(false);
const [bautistainventorycategorynameerror, setbautistainventorycategorynameerror] = useState(false);
const [bautistainventorycategorynameexist, setbautistainventorycategorynameexist] = useState(false);
const [bautistainventorycategorylist, setbautistainventorycategorylist] = useState([]);
const [loadingbautistainventorycategorylist, setloadingbautistainventorycategorylist] = useState(true);
const [selectedbautistainventorycategory, setselectedbautistainventorycategory] = useState(null);





//INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME //INSERT AMBHER INVENTORY CATEGORY NAME 
const submitbautistainventorycategory = async (e) => {
  e.preventDefault();
  setbautistainventorycategoryissubmitting(true);

try{


  const bautistainventorycategorydata = {


    bautistainventorycategoryname: bautistainventorycategorynameset,

    bautistainventorycategoryaddedbyprofilepicture: currentuserdata.profilepicture || '',
    bautistainventorycategoryaddedbylastname: currentuserdata.lastname || '',
    bautistainventorycategoryaddedbyfirstname: currentuserdata.firstname || '',
    bautistainventorycategoryaddedbymiddlename: currentuserdata.middlename || '',
    bautistainventorycategoryaddedbytype: currentuserdata.type || '',
    bautistainventorycategoryaddedbyemail: currentuserdata.email || '',




  }

  console.log(bautistainventorycategorydata);
  const response = await fetch(`/api/bautistainventorycategory`,{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    },
    body: JSON.stringify(bautistainventorycategorydata)
  });



  if(!response.ok){
    throw new Error(`Response fetching error! Error: ${response.status}`);

  }


  const result = await response.json();
  console.log('Bautista Inventory Category insertion successful: ', result);

  setbautistainventorycategorylist(prev => [result, ...prev]);
  setbautistainventorycategorynameset("");
  setshowaddbautistaaddinventorycategory(false);


}catch(error) {
  console.error('Error Bautista Inventory Category insertion: ', error);
  setbautistainventorycategoryissubmitting(false);
}finally{
  setbautistainventorycategoryissubmitting(false);
}
};




//Checks If Category Name is Already is Existing
useEffect(() => {
let ismounted = true;
const checkbautistainventorycategoryname = async () => {
  const categoryname = bautistainventorycategorynameset.trim();

  if(!categoryname){
    if(ismounted){
      setbautistainventorycategorynameerror(false);
      setbautistainventorycategorynameexist(false);
    }
    return;
  }


  if (ismounted) setbautistainventorycategorynamecheck(true);

  try{
    const response = await fetch(`/api/bautistainventorycategory/bautistainventorycategoryname/${encodeURIComponent(categoryname)}`);
 
    if(!ismounted) return;

    const data = await response.json();

    if(response.ok){
      setbautistainventorycategorynameerror(true);
      setbautistainventorycategorynameexist(true);
    }else if(response.status === 404){
      setbautistainventorycategorynameerror(false);
      setbautistainventorycategorynameexist(false);
    }
  
  }catch(error){
    if(ismounted){
      setbautistainventorycategorynameerror(false);
      setbautistainventorycategorynameexist(false);
    }
  }finally{
    if(ismounted) setbautistainventorycategorynamecheck(false);
  }

};


const timer = setTimeout(checkbautistainventorycategoryname, 500);
return () => {
  ismounted = false;
  clearTimeout(timer);
};
}, [bautistainventorycategorynameset])



//Fetching Bautista Inventory Categories
useEffect(() => {
const fetchbautistacategories = async () => {
  try{
    const response = await fetch(`/api/bautistainventorycategory`);
    if(!response.ok) throw new Error("Failed to fetch Bautista Inevntory Categories");



    const data = await response.json();
    setbautistainventorycategorylist(data);
  
    console.log("Bautista categories", data);

  }catch(error){
    console.error("Error fetching bautista categories: ", error);
  }finally{
    setloadingbautistainventorycategorylist(false);
  }
};
fetchbautistacategories();
}, []);



const fetchbautistainventorycategories = async () => {
try{
  const response = await fetch(`/api/bautistainventorycategory`);
  if(!response.ok) throw new Error("Failed to retrieve bautista inventory categories");

  const data = await response.json();
  setbautistainventorycategorylist(data);
}catch(error){
  console.error("Fetching bautistainventorycategory failed", error);
}finally{
  setloadingbautistainventorycategorylist(false);
}
};

useEffect(() => {
fetchbautistainventorycategories();
}, []);



//Delete Bautista Inventory Category
const deletebautistainventorycategory = async () => {
if(!selectedbautistainventorycategory) return;

try{
  const response = await fetch(`/api/bautistainventorycategory/${selectedbautistainventorycategory.bautistainventorycategoryid}`,{
    method: 'DELETE',
    headers:{
      'Authorization' : `Bearer ${currentusertoken}`
    }
  });

  if(!response.ok) throw new Error("Failed to delete bautista inventory category");

  setbautistainventorycategorylist(prev => prev.filter(cat => cat.bautistainventorycategoryid !== selectedbautistainventorycategory.bautistainventorycategoryid));
  setshowdeletebautistainventorycategorydialog(false);
  setselectedbautistainventorycategory(null);

}catch(error){
  console.error("Bautista Inventory Category Delete Failed: ", error);
}
}






//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
//INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT //INVENTORY MANAGEMENT
const [showaddambherinventoryproductdialog, setshowaddambherinventoryproductdialog] = useState(false);
const [ambherinventorycategorynamebox, setambherinventorycategorynamebox] = useState("");
const [addambherinventoryproductname, setaddambherinventoryproductname] = useState("");
const [addambherinventoryproductbrand, setaddambherinventoryproductbrand] = useState("");
const [addambherinventoryproductmodelnumber, setaddambherinventoryproductmodelnumber] = useState("");
const [addambherinventoryproductdescription, setaddambherinventoryproductdescription] = useState("");
const [addambherinventoryproductprice, setaddambherinventoryproductprice] = useState();
const [addambherinventoryproductquantity, setaddambherinventoryproductquantity] = useState();
const [addambherinventoryproductimageselectedimages, setaddambherinventoryproductimageselectedimages] = useState([]);
const [addambherinventoryproductimagepreviewimages, setaddambherinventoryproductimagepreviewimages] = useState([]);
const [currentimageindex, setcurrentimageindex] = useState(0);
const addambherinventoryproductimageimageinputref = useRef(null);
const [ambherinventoryproductissubmitting, setambherinventoryproductissubmitting] = useState(false);
const [ambherinventoryproducts, setambherinventoryproducts] = useState([]);
const [ambherloadingproducts, setambherloadingproducts] = useState(true);
const [selectedambherproduct, setselectedambherproduct] = useState(null);
const [showdeleteambherproduct, setshowdeleteambherproduct] = useState(false);
const [selecteddeleteambherproduct, setselecteddeleteambherproduct] = useState([]);
const [wishlistCounts, setWishlistCounts] = useState({});










const fetchWishlistCounts = async (productIds, clinicType) => {
try {
  const idsParam = Array.isArray(productIds) ? productIds.join(',') : productIds;
  
  const response = await fetch(
    `/api/patientwishlistinventoryproduct/wishlist-count/${idsParam}/${clinicType}`,
    {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch wishlist counts. Status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch(error) {
  console.error("Error fetching wishlist counts:", error);
  return Array.isArray(productIds) ? {} : 0;
}
};


useEffect(() => {
const fetchAllWishlistCounts = async () => {
  try {
    const productIds = ambherinventoryproducts.map(p => p.ambherinventoryproductid);
    if (productIds.length === 0) return;
    
    const counts = await fetchWishlistCounts(productIds, 'ambher');
    setWishlistCounts(prev => ({ ...prev, ...counts }));
  } catch(error) {
    console.error("Error fetching wishlist counts:", error);
  }
};

if (ambherinventoryproducts.length > 0) {
  fetchAllWishlistCounts();
}
}, [ambherinventoryproducts, currentusertoken]);










// --- INVENTORY PRODUCT FILTERS STATE & LOGIC ---
// Place these near your other inventory-related useState declarations
const [activeProductFilter, setActiveProductFilter] = useState('all');
const [quantitySortingProducts, setQuantitySortingProducts] = useState('none');
const productFilters = [

{ id: 'polarized', label: 'Polarized' },
{ id: 'kids', label: 'Kids' },
{ id: 'adults', label: 'Adults' },
{ id: 'men', label: 'Men' },
{ id: 'women', label: 'Women' },
{ id: 'unisex', label: 'Unisex' },


];

// Filtering logic for Ambher products
const [pricesortingProducts, setpricesortingProducts] = useState('none');
const filteredAmbherProducts = ambherinventoryproducts.filter(product => {
// Category filter
const categoryMatch =
  activeambherinventorycategorytable === 'all' ||
  product.ambherinventoryproductcategory === activeambherinventorycategorytable;

// Product filter
const nameDesc = `${product.ambherinventoryproductname || ''} ${product.ambherinventoryproductdescription || ''}`.toLowerCase();
if (activeProductFilter === 'all') return categoryMatch;
if (activeProductFilter === 'eyeclinic')
  return categoryMatch && (product.ambherinventoryproducttype?.toLowerCase().includes('clinic') || nameDesc.includes('clinic'));
if (activeProductFilter === 'polarized')
  return categoryMatch && (product.ambherinventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized'));
if (activeProductFilter === 'kids')
  return categoryMatch && (product.ambherinventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid'));
if (activeProductFilter === 'adults')
  return categoryMatch && (product.ambherinventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult'));
if (activeProductFilter === 'men')
  return categoryMatch && (product.ambherinventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men'));
if (activeProductFilter === 'women')
  return categoryMatch && (product.ambherinventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women'));
if (activeProductFilter === 'unisex')
  return categoryMatch && (product.ambherinventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex'));
if (activeProductFilter === 'frameshape')
  return categoryMatch && (product.ambherinventoryproductframeshape?.toLowerCase().length > 0 || nameDesc.includes('shape'));
if (activeProductFilter === 'faceshape')
  return categoryMatch && (product.ambherinventoryproductfaceshape?.toLowerCase().length > 0 || nameDesc.includes('face'));
if (activeProductFilter === 'accessories')
  return categoryMatch && (product.ambherinventoryproducttype?.toLowerCase().includes('accessor') || nameDesc.includes('accessor'));
return categoryMatch;
});

// Sorting logic for Ambher products
const sortedFilteredAmbherProducts = [...filteredAmbherProducts].sort((a, b) => {
  // Priority 1: Out of stock WITH urgent restock alert (highest priority)
  const aOutOfStockWithAlert = (a.ambherinventoryproductquantity || 0) === 0 && (wishlistCounts[a.ambherinventoryproductid] ?? 0) > 0;
  const bOutOfStockWithAlert = (b.ambherinventoryproductquantity || 0) === 0 && (wishlistCounts[b.ambherinventoryproductid] ?? 0) > 0;
  
  if (aOutOfStockWithAlert && !bOutOfStockWithAlert) return -1;
  if (!aOutOfStockWithAlert && bOutOfStockWithAlert) return 1;
  if (aOutOfStockWithAlert && bOutOfStockWithAlert) {
    // Both have urgent alerts, sort by wishlist count (higher count first)
    return (wishlistCounts[b.ambherinventoryproductid] ?? 0) - (wishlistCounts[a.ambherinventoryproductid] ?? 0);
  }
  
  // Priority 2: Out of stock WITHOUT urgent restock alert
  const aOutOfStockNoAlert = (a.ambherinventoryproductquantity || 0) === 0 && (wishlistCounts[a.ambherinventoryproductid] ?? 0) === 0;
  const bOutOfStockNoAlert = (b.ambherinventoryproductquantity || 0) === 0 && (wishlistCounts[b.ambherinventoryproductid] ?? 0) === 0;
  
  if (aOutOfStockNoAlert && !bOutOfStockNoAlert) return -1;
  if (!aOutOfStockNoAlert && bOutOfStockNoAlert) return 1;
  
  // Priority 3: Critical stock (≤3 items)
  const aCritical = (a.ambherinventoryproductquantity || 0) > 0 && (a.ambherinventoryproductquantity || 0) <= 3;
  const bCritical = (b.ambherinventoryproductquantity || 0) > 0 && (b.ambherinventoryproductquantity || 0) <= 3;
  
  if (aCritical && !bCritical) return -1;
  if (!aCritical && bCritical) return 1;
  if (aCritical && bCritical) {
    // Both critical, sort by quantity (lower first - more urgent)
    return (a.ambherinventoryproductquantity || 0) - (b.ambherinventoryproductquantity || 0);
  }
  
  // Priority 4: Low stock (4-6 items)
  const aLowStock = (a.ambherinventoryproductquantity || 0) >= 4 && (a.ambherinventoryproductquantity || 0) <= 6;
  const bLowStock = (b.ambherinventoryproductquantity || 0) >= 4 && (b.ambherinventoryproductquantity || 0) <= 6;
  
  if (aLowStock && !bLowStock) return -1;
  if (!aLowStock && bLowStock) return 1;
  if (aLowStock && bLowStock) {
    // Both low stock, sort by quantity (lower first)
    return (a.ambherinventoryproductquantity || 0) - (b.ambherinventoryproductquantity || 0);
  }
  
  // Priority 5: Regular inventory - apply user-selected sorting
  if (pricesortingProducts === 'Highesttolowest') {
    return (b.ambherinventoryproductprice || 0) - (a.ambherinventoryproductprice || 0);
  } else if (pricesortingProducts === 'Lowesttohighest') {
    return (a.ambherinventoryproductprice || 0) - (b.ambherinventoryproductprice || 0);
  } else if (quantitySortingProducts === 'Highesttolowest') {
    return (b.ambherinventoryproductquantity || 0) - (a.ambherinventoryproductquantity || 0);
  } else if (quantitySortingProducts === 'Lowesttohighest') {
    return (a.ambherinventoryproductquantity || 0) - (b.ambherinventoryproductquantity || 0);
  } else {
    // Default: highest to lowest quantity
    return (b.ambherinventoryproductquantity || 0) - (a.ambherinventoryproductquantity || 0);
  }
});

// Filter out of stock products if needed
const finalFilteredAmbherProducts = (() => {
  if (quantitySortingProducts === 'Outofstock') {
    return sortedFilteredAmbherProducts.filter(product => (product.ambherinventoryproductquantity || 0) === 0);
  } else if (quantitySortingProducts === 'LowStock') {
    return sortedFilteredAmbherProducts.filter(product => {
      const qty = product.ambherinventoryproductquantity || 0;
      return qty >= 4 && qty <= 6;
    });
  } else if (quantitySortingProducts === 'CriticalStock') {
    return sortedFilteredAmbherProducts.filter(product => {
      const qty = product.ambherinventoryproductquantity || 0;
      return qty >= 1 && qty <= 3;
    });
  }
  return sortedFilteredAmbherProducts;
})();

const ambherinventoryproductcount = ambherinventoryproducts.filter(
product => product.ambherinventoryproductquantity <= 6
);




//PRODUCT IMAGE HANDLING

const addambherinventoryproductimagehandlechange = async (e) => {
const files = Array.from(e.target.files);

if(addambherinventoryproductimageselectedimages.length + files.length > 5){
  alert("Maximum of only 5 product images");
  return;
}

const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
const maximagefile = 2;

for(const file of files) {
  if(!imagefiletype.includes(file.type)) {
    alert("Please select image files (JPG / PNG");
    return;
  }

  if(file.size > maximagefile * 1024 * 1024) {
    alert("Please select images under 2MB");
    return;
  }
}



try{
  const compressedimages = await Promise.all(
    files.map(async (file) => {
      const imageconfiguration = {
        maximagemb: 1,
        maxworh: 800,
        useWebWorker: true,
        initialQuality: 0.8
      };

      const compressedimage = await imageCompression(file, imageconfiguration);
      return compressedimage;
    })
  );



  const previewurls = await Promise.all(
    compressedimages.map(async (image) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(image);
      });
    })
  );



  setaddambherinventoryproductimageselectedimages(prev => [...prev, ...compressedimages]);
  setaddambherinventoryproductimagepreviewimages(prev => [...prev, ...previewurls]);
  setcurrentimageindex(0);


}catch(error){
  console.error("Image compression failed: ", error.message);
  alert("Image compression failed");
}

if(addambherinventoryproductimageimageinputref.current){
   addambherinventoryproductimageimageinputref.current.value = "";
}

};







//PREVIOUS  IMAGE
const handlepreviousimage = (e) => {
e.preventDefault(); 
if (selectedambherproduct) {
  if (!selectedambherproduct.ambherinventoryproductimagepreviewimages?.length) return;
  setcurrentimageindex(prev => prev === 0 ? selectedambherproduct.ambherinventoryproductimagepreviewimages.length - 1 : prev - 1 );

} else {
  if (!addambherinventoryproductimagepreviewimages?.length) return;
  setcurrentimageindex(prev => prev === 0 ? addambherinventoryproductimagepreviewimages.length - 1 : prev - 1 );
}
};

//NEXT IMAGE
const handlenextimage = (e) => {
e.preventDefault();
if (selectedambherproduct) {
  if (!selectedambherproduct.ambherinventoryproductimagepreviewimages?.length) return;
  setcurrentimageindex(prev => prev === selectedambherproduct.ambherinventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1 );

} else {
  if (!addambherinventoryproductimagepreviewimages?.length) return;
  setcurrentimageindex(prev => prev === addambherinventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1);

}
};





const addambherinventoryproductimagehandleremove = (indextoremove) => {
setaddambherinventoryproductimageselectedimages(prev =>
  prev.filter((_, index) => index !== indextoremove)
);

setaddambherinventoryproductimagepreviewimages(prev =>
  prev.filter((_, index) => index !== indextoremove)
);

setcurrentimageindex(prev =>
  prev >= indextoremove && prev > 0 ? prev - 1 : prev
);
};

const addambherinventoryproductimagehandleuploadclick = () => {
addambherinventoryproductimageimageinputref.current.click();
};

const resetaddambherinventoryproductdialog = () => {
setambherinventorycategorynamebox("");
setaddambherinventoryproductname("");
setaddambherinventoryproductbrand("");
setaddambherinventoryproductmodelnumber("");
setaddambherinventoryproductdescription("");
setaddambherinventoryproductprice("");
setaddambherinventoryproductquantity("");
setaddambherinventoryproductimageselectedimages([]);
setaddambherinventoryproductimagepreviewimages([]);
setcurrentimageindex(0);
setmessage('');
setselectedambherproduct(null);
};


//FETCHING PRODUCTS

const fetchambherproducts = async () => {
  try{
    const response = await fetch(`/api/ambherinventoryproduct`, {
      headers:{
        'Authorization' : `Bearer ${currentusertoken}`
      }
    });
    
    if(!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    setambherinventoryproducts(data);
     setambherloadingproducts(false);
  }catch(error){
    console.error("Failed fetching products: ", error);
    setambherloadingproducts(false);
  }
};


useEffect(() => {
  fetchambherproducts();
}, []);



//INSERTING PRODUCT
const handlesubmitaddambherinventoryproduct = async (e) => {

  e.preventDefault();
  setambherinventoryproductissubmitting(true);

try{

 if (addambherinventoryproductimagepreviewimages.length === 0) {
  alert("Upload at least 1 product image");
         return;
  }


  const ambherinventoryproductdata = {


    ambherinventoryproductcategory: ambherinventorycategorynamebox || '',
    ambherinventoryproductname: addambherinventoryproductname || '',
    ambherinventoryproductbrand:  addambherinventoryproductbrand || '',
    ambherinventoryproductmodelnumber: addambherinventoryproductmodelnumber || '',
    ambherinventoryproductdescription: addambherinventoryproductdescription || '',
    ambherinventoryproductprice: Number(addambherinventoryproductprice) || 0,
    ambherinventoryproductquantity:  Number(addambherinventoryproductquantity) || 0,
    ambherinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || '',



    ambherinventoryproductaddedbyprofilepicture: currentuserdata.profilepicture || '',
    ambherinventoryproductaddedbylastname: currentuserdata.lastname || '',
    ambherinventoryproductaddedbyfirstname: currentuserdata.firstname || '',
    ambherinventoryproductaddedbymiddlename: currentuserdata.middlename || '',
    ambherinventoryproductaddedbytype: currentuserdata.type || '',
    ambherinventoryproductaddedbyemail: currentuserdata.email || '',
     ambherinventoryproductwishlistcount: 0 ,



  }

  console.log(ambherinventoryproductdata);
  const response = await fetch(`/api/ambherinventoryproduct`,{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    },
    body: JSON.stringify(ambherinventoryproductdata)
  });



  if(!response.ok){
    throw new Error(`Response fetching error! Error: ${response.status}`);

  }


  const result = await response.json();
  console.log('Ambher Inventory Product insertion successful: ', result);
  await fetchambherproducts();
  resetaddambherinventoryproductdialog();
  setshowaddambherinventoryproductdialog(false);

}catch(error) {
  console.error('Error Ambher Inventory Product insertion: ', error);
  setambherinventoryproductissubmitting(false);
}finally{
  setambherinventoryproductissubmitting(false);
}

};

//UPDATING PRODUCT
const handleupdateambherinventoryproduct = async (e) => {

  e.preventDefault();
  setambherinventoryproductissubmitting(true);

try{
 
 if (!selectedambherproduct) {
    throw new Error ("No product is selected"); 
  }


  const updateambherproduct = {


    ambherinventoryproductcategory: ambherinventorycategorynamebox || '',
    ambherinventoryproductname: addambherinventoryproductname || '',
    ambherinventoryproductbrand:  addambherinventoryproductbrand || '',
    ambherinventoryproductmodelnumber: addambherinventoryproductmodelnumber || '',
    ambherinventoryproductdescription: addambherinventoryproductdescription || '',
    ambherinventoryproductprice: Number(addambherinventoryproductprice) || 0,
    ambherinventoryproductquantity:  Number(addambherinventoryproductquantity) || 0,
    ambherinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || '',



    ambherinventoryproductaddedbyprofilepicture: currentuserdata.profilepicture || '',
    ambherinventoryproductaddedbylastname: currentuserdata.lastname || '',
    ambherinventoryproductaddedbyfirstname: currentuserdata.firstname || '',
    ambherinventoryproductaddedbymiddlename: currentuserdata.middlename || '',
    ambherinventoryproductaddedbytype: currentuserdata.type || '',
    ambherinventoryproductaddedbyemail: currentuserdata.email || '',
    ambherinventoryproductwishlistcount: 0 ,


  }


  const response = await fetch(`/api/ambherinventoryproduct/${selectedambherproduct.ambherinventoryproductid}`,{
    method: 'PUT',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    },
    body: JSON.stringify(updateambherproduct)
  });



  if(!response.ok){
    throw new Error(`Response fetching error! Error: ${response.status}`);

  }


  const result = await response.json();
  console.log('Ambher Inventory Product updated successful: ', result);


  const updatedambherproduct = ambherinventoryproducts.map(product =>
    product.ambherinventoryproductid === selectedambherproduct.ambherinventoryproductid ? result : product);

  setambherinventoryproducts(updatedambherproduct);
  resetaddambherinventoryproductdialog();
  setshowaddambherinventoryproductdialog(false);
  setselectedambherproduct(null);

}catch(error) {
  console.error('Error Ambher Inventory Product update: ', error);
  setambherinventoryproductissubmitting(false);
}finally{
  setambherinventoryproductissubmitting(false);
}

};


//DELETE PRODUCT
const deleteambherproduct = async (e) => {
  e.preventDefault();

  if(!selectedambherproduct) {
    alert("No product is selected");
    return;
  }

  try{
    const response = await fetch(`/api/ambherinventoryproduct/${selectedambherproduct.ambherinventoryproductid}`,{
      method: 'DELETE',
      headers: {
        'Authorization' : `Bearer ${currentusertoken}`
      }
    });

    if(!response.ok) {
      throw new Error(`Failed to delete ambher product: ${response.status}`);
    }


    setambherinventoryproducts(prev => prev.filter(product => product.ambherinventoryproductid!== selectedambherproduct.ambherinventoryproductid));
    resetaddambherinventoryproductdialog();
    setselectedambherproduct(null);
    setshowaddambherinventoryproductdialog(false);
    setshowdeleteambherproduct(false);

 
 
  }catch(error){
    console.error('Error deleting ambher product:', error);
  }

};




















const [showaddbautistainventoryproductdialog, setshowaddbautistainventoryproductdialog] = useState(false);
const [bautistainventorycategorynamebox, setbautistainventorycategorynamebox] = useState("");
const [addbautistainventoryproductname, setaddbautistainventoryproductname] = useState("");
const [addbautistainventoryproductbrand, setaddbautistainventoryproductbrand] = useState("");
const [addbautistainventoryproductmodelnumber, setaddbautistainventoryproductmodelnumber] = useState("");
const [addbautistainventoryproductdescription, setaddbautistainventoryproductdescription] = useState("");
const [addbautistainventoryproductprice, setaddbautistainventoryproductprice] = useState();
const [addbautistainventoryproductquantity, setaddbautistainventoryproductquantity] = useState();
const [addbautistainventoryproductimageselectedimages, setaddbautistainventoryproductimageselectedimages] = useState([]);
const [addbautistainventoryproductimagepreviewimages, setaddbautistainventoryproductimagepreviewimages] = useState([]);
const [bautistacurrentimageindex, setbautistacurrentimageindex] = useState(0);
const addbautistainventoryproductimageimageinputref = useRef(null);
const [bautistainventoryproductissubmitting, setbautistainventoryproductissubmitting] = useState(false);
const [bautistainventoryproducts, setbautistainventoryproducts] = useState([]);
const [bautistaloadingproducts, setbautistaloadingproducts] = useState(true);
const [selectedbautistaproduct, setselectedbautistaproduct] = useState(null);
const [showdeletebautistaproduct, setshowdeletebautistaproduct] = useState(false);
const [selecteddeletebautistaproduct, setselecteddeletebautistaproduct] = useState([]);
        
        
// Filtering logic for Bautista products
const filteredBautistaProducts = bautistainventoryproducts.filter(product => {
const categoryMatch =
  activebautistainventorycategorytable === 'all' ||
  product.bautistainventoryproductcategory === activebautistainventorycategorytable;

const nameDesc = `${product.bautistainventoryproductname || ''} ${product.bautistainventoryproductdescription || ''}`.toLowerCase();
if (activeProductFilter === 'all') return categoryMatch;
if (activeProductFilter === 'eyeclinic')
  return categoryMatch && (product.bautistainventoryproducttype?.toLowerCase().includes('clinic') || nameDesc.includes('clinic'));
if (activeProductFilter === 'polarized')
  return categoryMatch && (product.bautistainventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized'));
if (activeProductFilter === 'kids')
  return categoryMatch && (product.bautistainventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid'));
if (activeProductFilter === 'adults')
  return categoryMatch && (product.bautistainventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult'));
if (activeProductFilter === 'men')
  return categoryMatch && (product.bautistainventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men'));
if (activeProductFilter === 'women')
  return categoryMatch && (product.bautistainventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women'));
if (activeProductFilter === 'unisex')
  return categoryMatch && (product.bautistainventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex'));
if (activeProductFilter === 'frameshape')
  return categoryMatch && (product.bautistainventoryproductframeshape?.toLowerCase().length > 0 || nameDesc.includes('shape'));
if (activeProductFilter === 'faceshape')
  return categoryMatch && (product.bautistainventoryproductfaceshape?.toLowerCase().length > 0 || nameDesc.includes('face'));
if (activeProductFilter === 'accessories')
  return categoryMatch && (product.bautistainventoryproducttype?.toLowerCase().includes('accessor') || nameDesc.includes('accessor'));
return categoryMatch;
});

// Sorting logic for Bautista products
const sortedFilteredBautistaProducts = [...filteredBautistaProducts].sort((a, b) => {
  // Priority 1: Out of stock WITH urgent restock alert (highest priority)
  const aOutOfStockWithAlert = (a.bautistainventoryproductquantity || 0) === 0 && (wishlistCounts[a.bautistainventoryproductid] ?? 0) > 0;
  const bOutOfStockWithAlert = (b.bautistainventoryproductquantity || 0) === 0 && (wishlistCounts[b.bautistainventoryproductid] ?? 0) > 0;
  
  if (aOutOfStockWithAlert && !bOutOfStockWithAlert) return -1;
  if (!aOutOfStockWithAlert && bOutOfStockWithAlert) return 1;
  if (aOutOfStockWithAlert && bOutOfStockWithAlert) {
    // Both have urgent alerts, sort by wishlist count (higher count first)
    return (wishlistCounts[b.bautistainventoryproductid] ?? 0) - (wishlistCounts[a.bautistainventoryproductid] ?? 0);
  }
  
  // Priority 2: Out of stock WITHOUT urgent restock alert
  const aOutOfStockNoAlert = (a.bautistainventoryproductquantity || 0) === 0 && (wishlistCounts[a.bautistainventoryproductid] ?? 0) === 0;
  const bOutOfStockNoAlert = (b.bautistainventoryproductquantity || 0) === 0 && (wishlistCounts[b.bautistainventoryproductid] ?? 0) === 0;
  
  if (aOutOfStockNoAlert && !bOutOfStockNoAlert) return -1;
  if (!aOutOfStockNoAlert && bOutOfStockNoAlert) return 1;
  
  // Priority 3: Critical stock (≤3 items)
  const aCritical = (a.bautistainventoryproductquantity || 0) > 0 && (a.bautistainventoryproductquantity || 0) <= 3;
  const bCritical = (b.bautistainventoryproductquantity || 0) > 0 && (b.bautistainventoryproductquantity || 0) <= 3;
  
  if (aCritical && !bCritical) return -1;
  if (!aCritical && bCritical) return 1;
  if (aCritical && bCritical) {
    // Both critical, sort by quantity (lower first - more urgent)
    return (a.bautistainventoryproductquantity || 0) - (b.bautistainventoryproductquantity || 0);
  }
  
  // Priority 4: Low stock (4-6 items)
  const aLowStock = (a.bautistainventoryproductquantity || 0) >= 4 && (a.bautistainventoryproductquantity || 0) <= 6;
  const bLowStock = (b.bautistainventoryproductquantity || 0) >= 4 && (b.bautistainventoryproductquantity || 0) <= 6;
  
  if (aLowStock && !bLowStock) return -1;
  if (!aLowStock && bLowStock) return 1;
  if (aLowStock && bLowStock) {
    // Both low stock, sort by quantity (lower first)
    return (a.bautistainventoryproductquantity || 0) - (b.bautistainventoryproductquantity || 0);
  }
  
  // Priority 5: Regular inventory - apply user-selected sorting
  if (bautistaPriceSortingProducts === 'Highesttolowest') {
    return (b.bautistainventoryproductprice || 0) - (a.bautistainventoryproductprice || 0);
  } else if (bautistaPriceSortingProducts === 'Lowesttohighest') {
    return (a.bautistainventoryproductprice || 0) - (b.bautistainventoryproductprice || 0);
  } else if (bautistaQuantitySortingProducts === 'Highesttolowest') {
    return (b.bautistainventoryproductquantity || 0) - (a.bautistainventoryproductquantity || 0);
  } else if (bautistaQuantitySortingProducts === 'Lowesttohighest') {
    return (a.bautistainventoryproductquantity || 0) - (b.bautistainventoryproductquantity || 0);
  } else {
    // Default: highest to lowest quantity
    return (b.bautistainventoryproductquantity || 0) - (a.bautistainventoryproductquantity || 0);
  }
});

// Filter out of stock products if needed
const finalFilteredBautistaProducts = (() => {
  if (bautistaQuantitySortingProducts === 'Outofstock') {
    return sortedFilteredBautistaProducts.filter(product => (product.bautistainventoryproductquantity || 0) === 0);
  } else if (bautistaQuantitySortingProducts === 'LowStock') {
    return sortedFilteredBautistaProducts.filter(product => {
      const qty = product.bautistainventoryproductquantity || 0;
      return qty >= 4 && qty <= 6;
    });
  } else if (bautistaQuantitySortingProducts === 'CriticalStock') {
    return sortedFilteredBautistaProducts.filter(product => {
      const qty = product.bautistainventoryproductquantity || 0;
      return qty >= 1 && qty <= 3;
    });
  }
  return sortedFilteredBautistaProducts;
})();

const bautistainventoryproductcount = bautistainventoryproducts.filter(
product => product.bautistainventoryproductquantity <= 6
);


useEffect(() => {
const fetchAllWishlistCounts = async () => {
  try {
    const productIds = bautistainventoryproducts.map(p => p.bautistainventoryproductid);
    if (productIds.length === 0) return;
    
    const counts = await fetchWishlistCounts(productIds, 'bautista');
    setWishlistCounts(prev => ({ ...prev, ...counts }));
  } catch(error) {
    console.error("Error fetching wishlist counts:", error);
  }
};

if (bautistainventoryproducts.length > 0) {
  fetchAllWishlistCounts();
}
}, [bautistainventoryproducts, currentusertoken]);





        
        //PRODUCT IMAGE HANDLING
        
        const addbautistainventoryproductimagehandlechange = async (e) => {
          const files = Array.from(e.target.files);
        
          if(addbautistainventoryproductimageselectedimages.length + files.length > 5){
            alert("Maximum of only 5 product images");
            return;
          }
        
          const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
          const maximagefile = 2;
        
          for(const file of files) {
            if(!imagefiletype.includes(file.type)) {
              alert("Please select image files (JPG / PNG");
              return;
            }
        
            if(file.size > maximagefile * 1024 * 1024) {
              alert("Please select images under 2MB");
              return;
            }
          }
        
        
        
          try{
            const compressedimages = await Promise.all(
              files.map(async (file) => {
                const imageconfiguration = {
                  maximagemb: 1,
                  maxworh: 800,
                  useWebWorker: true,
                  initialQuality: 0.8
                };
        
                const compressedimage = await imageCompression(file, imageconfiguration);
                return compressedimage;
              })
            );
        
        
        
            const previewurls = await Promise.all(
              compressedimages.map(async (image) => {
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    resolve(reader.result);
                  };
                  reader.readAsDataURL(image);
                });
              })
            );
        
        
        
            setaddbautistainventoryproductimageselectedimages(prev => [...prev, ...compressedimages]);
            setaddbautistainventoryproductimagepreviewimages(prev => [...prev, ...previewurls]);
            setbautistacurrentimageindex(0);
        
        
          }catch(error){
            console.error("Image compression failed: ", error.message);
            alert("Image compression failed");
          }
        
          if(addbautistainventoryproductimageimageinputref.current){
             addbautistainventoryproductimageimageinputref.current.value = "";
          }
        
        };
        
        
        
        
        
        
        
        //PREVIOUS  IMAGE
        const bautistahandlepreviousimage = (e) => {
          e.preventDefault(); 
          if (selectedbautistaproduct) {
            if (!selectedbautistaproduct.bautistainventoryproductimagepreviewimages?.length) return;
            setbautistacurrentimageindex(prev => prev === 0 ? selectedbautistaproduct.bautistainventoryproductimagepreviewimages.length - 1 : prev - 1 );
        
          } else {
            if (!addbautistainventoryproductimagepreviewimages?.length) return;
            setbautistacurrentimageindex(prev => prev === 0 ? addbautistainventoryproductimagepreviewimages.length - 1 : prev - 1 );
          }
        };
        
        //NEXT IMAGE
        const bautistahandlenextimage = (e) => {
          e.preventDefault();
          if (selectedbautistaproduct) {
            if (!selectedbautistaproduct.bautistainventoryproductimagepreviewimages?.length) return;
            setbautistacurrentimageindex(prev => prev === selectedbautistaproduct.bautistainventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1 );
        
          } else {
            if (!addbautistainventoryproductimagepreviewimages?.length) return;
            setbautistacurrentimageindex(prev => prev === addbautistainventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1);
        
          }
        };
        
        
        
        
        
        const addbautistainventoryproductimagehandleremove = (indextoremove) => {
          setaddbautistainventoryproductimageselectedimages(prev =>
            prev.filter((_, index) => index !== indextoremove)
          );
        
          setaddbautistainventoryproductimagepreviewimages(prev =>
            prev.filter((_, index) => index !== indextoremove)
          );
        
          setbautistacurrentimageindex(prev =>
            prev >= indextoremove && prev > 0 ? prev - 1 : prev
          );
        };
        
        const addbautistainventoryproductimagehandleuploadclick = () => {
          addbautistainventoryproductimageimageinputref.current.click();
        };
        
         const resetaddbautistainventoryproductdialog = () => {
          setbautistainventorycategorynamebox("");
          setaddbautistainventoryproductname("");
          setaddbautistainventoryproductbrand("");
          setaddbautistainventoryproductmodelnumber("");
          setaddbautistainventoryproductdescription("");
          setaddbautistainventoryproductprice("");
          setaddbautistainventoryproductquantity("");
          setaddbautistainventoryproductimageselectedimages([]);
          setaddbautistainventoryproductimagepreviewimages([]);
          setbautistacurrentimageindex(0);
          setmessage('');
          setselectedbautistaproduct(null);
        };
        
        
        //FETCHING PRODUCTS
        
          const fetchbautistaproducts = async () => {
            try{
              const response = await fetch(`/api/bautistainventoryproduct`, {
                headers:{
                  'Authorization' : `Bearer ${currentusertoken}`
                }
              });
              
              if(!response.ok) throw new Error("Failed to fetch products");
        
              const data = await response.json();
              setbautistainventoryproducts(data);
               setbautistaloadingproducts(false);
            }catch(error){
              console.error("Failed fetching products: ", error);
              setbautistaloadingproducts(false);
            }
          };
        
        
          useEffect(() => {
            fetchbautistaproducts();
          }, []);
        
        
        
        //INSERTING PRODUCT
        const handlesubmitaddbautistainventoryproduct = async (e) => {
        
            e.preventDefault();
            setbautistainventoryproductissubmitting(true);
        
          try{
        
           if (addbautistainventoryproductimagepreviewimages.length === 0) {
            alert("Upload at least 1 product image");
                   return;
            }
        
        
            const bautistainventoryproductdata = {
        
        
              bautistainventoryproductcategory: bautistainventorycategorynamebox || '',
              bautistainventoryproductname: addbautistainventoryproductname || '',
              bautistainventoryproductbrand:  addbautistainventoryproductbrand || '',
              bautistainventoryproductmodelnumber: addbautistainventoryproductmodelnumber || '',
              bautistainventoryproductdescription: addbautistainventoryproductdescription || '',
              bautistainventoryproductprice: Number(addbautistainventoryproductprice) || 0,
              bautistainventoryproductquantity:  Number(addbautistainventoryproductquantity) || 0,
              bautistainventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || '',
        
        
        
              bautistainventoryproductaddedbyprofilepicture: currentuserdata.profilepicture || '',
              bautistainventoryproductaddedbylastname: currentuserdata.lastname || '',
              bautistainventoryproductaddedbyfirstname: currentuserdata.firstname || '',
              bautistainventoryproductaddedbymiddlename: currentuserdata.middlename || '',
              bautistainventoryproductaddedbytype: currentuserdata.type || '',
              bautistainventoryproductaddedbyemail: currentuserdata.email || '',
              bautistainventoryproductwishlistcount: 0 ,

        
        
            }
        
            console.log(bautistainventoryproductdata);
            const response = await fetch(`/api/bautistainventoryproduct`,{
              method: 'POST',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${currentusertoken}`
              },
              body: JSON.stringify(bautistainventoryproductdata)
            });
        
        
        
            if(!response.ok){
              throw new Error(`Response fetching error! Error: ${response.status}`);
        
            }
        
        
            const result = await response.json();
            console.log('Ambher Inventory Product insertion successful: ', result);
            await fetchbautistaproducts();
            resetaddbautistainventoryproductdialog();
            setshowaddbautistainventoryproductdialog(false);
        
          }catch(error) {
            console.error('Error Ambher Inventory Product insertion: ', error);
            setbautistainventoryproductissubmitting(false);
          }finally{
            setbautistainventoryproductissubmitting(false);
          }
        
        };
        
        //UPDATING PRODUCT
        const handleupdatebautistainventoryproduct = async (e) => {
        
            e.preventDefault();
            setbautistainventoryproductissubmitting(true);
        
          try{
           
           if (!selectedbautistaproduct) {
              throw new Error ("No product is selected"); 
            }
        
        
            const updatebautistaproduct = {
        
        
              bautistainventoryproductcategory: bautistainventorycategorynamebox || '',
              bautistainventoryproductname: addbautistainventoryproductname || '',
              bautistainventoryproductbrand:  addbautistainventoryproductbrand || '',
              bautistainventoryproductmodelnumber: addbautistainventoryproductmodelnumber || '',
              bautistainventoryproductdescription: addbautistainventoryproductdescription || '',
              bautistainventoryproductprice: Number(addbautistainventoryproductprice) || 0,
              bautistainventoryproductquantity:  Number(addbautistainventoryproductquantity) || 0,
              bautistainventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || '',
        
        
        
              bautistainventoryproductaddedbyprofilepicture: currentuserdata.profilepicture || '',
              bautistainventoryproductaddedbylastname: currentuserdata.lastname || '',
              bautistainventoryproductaddedbyfirstname: currentuserdata.firstname || '',
              bautistainventoryproductaddedbymiddlename: currentuserdata.middlename || '',
              bautistainventoryproductaddedbytype: currentuserdata.type || '',
              bautistainventoryproductaddedbyemail: currentuserdata.email || '',
               bautistainventoryproductwishlistcount: 0 ,
        
        
            }
        
        
            const response = await fetch(`/api/bautistainventoryproduct/${selectedbautistaproduct.bautistainventoryproductid}`,{
              method: 'PUT',
              headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${currentusertoken}`
              },
              body: JSON.stringify(updatebautistaproduct)
            });
        
        
        
            if(!response.ok){
              throw new Error(`Response fetching error! Error: ${response.status}`);
        
            }
        
        
            const result = await response.json();
            console.log('Ambher Inventory Product updated successful: ', result);
        
        
            const updatedbautistaproduct = bautistainventoryproducts.map(product =>
              product.bautistainventoryproductid === selectedbautistaproduct.bautistainventoryproductid ? result : product);
        
            setbautistainventoryproducts(updatedbautistaproduct);
            resetaddbautistainventoryproductdialog();
            setshowaddbautistainventoryproductdialog(false);
            setselectedbautistaproduct(null);
        
          }catch(error) {
            console.error('Error Ambher Inventory Product update: ', error);
            setbautistainventoryproductissubmitting(false);
          }finally{
            setbautistainventoryproductissubmitting(false);
          }
        
        };
        
        
        //DELETE PRODUCT
        const deletebautistaproduct = async (e) => {
            e.preventDefault();
        
            if(!selectedbautistaproduct) {
              alert("No product is selected");
              return;
            }
        
            try{
              const response = await fetch(`/api/bautistainventoryproduct/${selectedbautistaproduct.bautistainventoryproductid}`,{
                method: 'DELETE',
                headers: {
                  'Authorization' : `Bearer ${currentusertoken}`
                }
              });
        
              if(!response.ok) {
                throw new Error(`Failed to delete bautista product: ${response.status}`);
              }
        
        
              setbautistainventoryproducts(prev => prev.filter(product => product.bautistainventoryproductid!== selectedbautistaproduct.bautistainventoryproductid));
              resetaddbautistainventoryproductdialog();
              setselectedbautistaproduct(null);
              setshowaddbautistainventoryproductdialog(false);
              setshowdeletebautistaproduct(false);
        
           
           
            }catch(error){
              console.error('Error deleting bautista product:', error);
            }
        
        };







// Add these states near your other state declarations
const [cliniclowstockProducts, setcliniclowstockProducts] = useState([]);
const [cliniccriticalstockProducts, setcliniccriticalstockProducts] = useState([]);
const [clinicoutofstockProducts, setclinicoutofstockProducts] = useState([]);

// Add this useEffect to check stock levels when inventory changes
useEffect(() => {
if (activeinventorytable === 'ambherinventorytable') {
  const criticalStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity > 0 && 
              product.ambherinventoryproductquantity <= 3
  );
  const lowStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity >= 4 && 
              product.ambherinventoryproductquantity <= 6
  );
  const outOfStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity === 0
  );
  setcliniccriticalstockProducts(criticalStock);
  setcliniclowstockProducts(lowStock);
  setclinicoutofstockProducts(outOfStock);
} else if (activeinventorytable === 'bautistainventorytable') {
  const criticalStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity > 0 && 
              product.bautistainventoryproductquantity <= 3
  );
  const lowStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity >= 4 && 
              product.bautistainventoryproductquantity <= 6
  );
  const outOfStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity === 0
  );
  setcliniccriticalstockProducts(criticalStock);
  setcliniclowstockProducts(lowStock);
  setclinicoutofstockProducts(outOfStock);
}
}, [ambherinventoryproducts, bautistainventoryproducts, activeinventorytable]);


































//BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS 
//BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS 
//BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS 
//BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS 
//BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS //BILLINGS AND ORDERS 

// Set default billings and orders table based on user role and clinic
const getDefaultBillingsTable = () => {
if (isAmbherOnlyUser()) {
  return 'ambherbillingsandorderstable';
} else if (isBautistaOnlyUser()) {
  return 'bautistabillingsandorderstable';
}
return 'ambherbillingsandorderstable'; // Default for admin
};

const [activebillingsandorderstable, setactivebillingsandorderstable] = useState(getDefaultBillingsTable());
const showbillingsandorderstable = (billingsandorderstableid) => {
    setactivebillingsandorderstable(billingsandorderstableid);
};

// Update default billing table when user data changes
useEffect(() => {
if (userDataLoaded) {
  // Update billing and orders table based on current user clinic
  const staffClinic = localStorage.getItem('staffclinic');
  const ownerClinic = localStorage.getItem('ownerclinic');
  
  if (currentuserloggedin === "Staff") {
    if (staffClinic === 'Bautista Eye Center' || staffclinic === 'Bautista Eye Center') {
      setactivebillingsandorderstable('bautistabillingsandorderstable');
    } else if (staffClinic === 'Ambher Optical' || staffclinic === 'Ambher Optical') {
      setactivebillingsandorderstable('ambherbillingsandorderstable');
    }
  } else if (currentuserloggedin === "Owner") {
    if (ownerClinic === 'Bautista Eye Center' || ownerownedclinic === 'Bautista Eye Center') {
      setactivebillingsandorderstable('bautistabillingsandorderstable');
    } else if (ownerClinic === 'Ambher Optical' || ownerownedclinic === 'Ambher Optical') {
      setactivebillingsandorderstable('ambherbillingsandorderstable');
    }
  }
  // Admin users keep the default 'ambherbillingsandorderstable'
}
}, [userDataLoaded, staffclinic, ownerownedclinic, currentuserloggedin]);


const [ambherpickupStatus, setambherpickupStatus] = useState('Later'); 
const [bautistapickupStatus, setbautistapickupStatus] = useState('Later'); 
const [activeambherpickupnoworlater, setactiveambherpickupnoworlater] = useState(null);
const [activebautistapickupnoworlater, setactivebautistapickupnoworlater] = useState(null);


const showambherpickupnoworlater = (pickupnoworlaterid) => {
    setactiveambherpickupnoworlater(pickupnoworlaterid);

if (pickupnoworlaterid === 'ambherorderpickupnow') {
  setambherpickupStatus('Now');
} else if (pickupnoworlaterid === 'ambherorderpickuplater') {
  setambherpickupStatus('Later');
}



};


const showbautistapickupnoworlater = (pickupnoworlaterid) => {
    setactivebautistapickupnoworlater(pickupnoworlaterid);

if (pickupnoworlaterid === 'bautistaorderpickupnow') {
  setbautistapickupStatus('Now');
} else if (pickupnoworlaterid === 'bautistaorderpickuplater') {
  setbautistapickupStatus('Later');
}



};

const [ambherorders, setambherOrders] = useState([]);
const [bautistaorders, setbautistaOrders] = useState([]);
const [ambherfilter, setambherFilter] = useState('All');
const [bautistafilter, setbautistaFilter] = useState('All');
const [loadingAmbherOrders, setLoadingAmbherOrders] = useState(true);
const [loadingBautistaOrders, setLoadingBautistaOrders] = useState(true);
const [searchambherTerm, setambherSearchTerm] = useState('');
const [searchbautistaTerm, setbautistaSearchTerm] = useState('');
const [searchpatientorderambherTerm, setsearchpatientorderambherTerm] = useState('');
const [searchpatientorderbautistaTerm, setsearchpatientorderbautistaTerm] = useState('');
const [showpatientorderambher, setshowpatientorderambher] = useState(false);
const [showpatientorderbautista, setshowpatientorderbautista] = useState(false);
const [showpatientorderedambher, setshowpatientorderedambher] = useState(false);
const [showpatientorderedbautista, setshowpatientorderedbautista] = useState(false);
const [ambhercount, setambherCount] = useState(1);
const [bautistacount, setbautistaCount] = useState(1);
const [selectedorderambherproduct, setselectedorderambherproduct] = useState(null);
const [selectedorderbautistaproduct, setselectedorderbautistaproduct] = useState(null);

// View Order Modal States
const [selectedOrderForView, setSelectedOrderForView] = useState(null);
const [showViewOrderModal, setShowViewOrderModal] = useState(false);
const [viewOrderCurrentImageIndex, setViewOrderCurrentImageIndex] = useState(0);
const [selectedPickupDate, setSelectedPickupDate] = useState('');
const [additionalPayment, setAdditionalPayment] = useState('');
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
const [paymentMessage, setPaymentMessage] = useState({ text: '', type: '' });

// Periodic status check - every 5 minutes
useEffect(() => {
  const statusCheckInterval = setInterval(async () => {
    console.log('🔄 Checking for orders with pickup dates matching today...');
    
    // Check Ambher orders
    if (ambherorders.length > 0) {
      const updatedAmbherOrders = await checkAndUpdateOrderStatus(ambherorders, 'ambher', updateAmbherOrderStatus);
      if (JSON.stringify(updatedAmbherOrders) !== JSON.stringify(ambherorders)) {
        setambherOrders(updatedAmbherOrders);
        console.log('✅ Ambher orders updated due to pickup date changes');
      }
    }
    
    // Check Bautista orders
    if (bautistaorders.length > 0) {
      const updatedBautistaOrders = await checkAndUpdateOrderStatus(bautistaorders, 'bautista', updateBautistaOrderStatus);
      if (JSON.stringify(updatedBautistaOrders) !== JSON.stringify(bautistaorders)) {
        setbautistaOrders(updatedBautistaOrders);
        console.log('✅ Bautista orders updated due to pickup date changes');
      }
    }
  }, 5 * 60 * 1000); // 5 minutes

  return () => clearInterval(statusCheckInterval);
}, [ambherorders, bautistaorders]);



//Order Ambher
const [orderambherinventorycategorynamebox , setorderambherinventorycategorynamebox ] = useState("");
const [orderambherinventoryproductname , setorderambherinventoryproductname ] = useState("");
const [orderambherinventoryproductbrand , setorderambherinventoryproductbrand ] = useState("");
const [orderambherinventoryproductmodelnumber, setorderambherinventoryproductmodelnumber ] = useState("");
const [orderambherinventoryproductdescription , setorderambherinventoryproductdescription ] = useState("");
const [orderambherinventoryproductnotes , setorderambherinventoryproductnotes ] = useState("");
const [orderambherinventoryproductprice , setorderambherinventoryproductprice ] = useState( );
const [orderambherinventoryproductquantity , setorderambherinventoryproductquantity ] = useState( );
const [orderambherinventoryproductimagepreviewimages , setorderambherinventoryproductimagepreviewimages ] = useState([]);
const [orderambhercurrentimageindex, setorderambhercurrentimageindex] = useState(0);
const [orderambherEmail, setorderambherEmail] = useState('');
const [orderambherprofilePicture, setorderambherprofilePicture] = useState('');
const [orderambherfullName,setorderambherfullName] = useState('');
const [orderambherlastName, setorderambherlastName] = useState('');
const [orderambhermiddleName, setorderambhermiddleName] = useState('');
const [orderambherfirstName, setorderambherfirstName] = useState('');
const [orderambhercontactNumber, setorderambhercontactNumber] = useState('');
const [orderambherpickupplace, setorderambherpickupplace] = useState('');
const [orderambherdownPayment, setorderambherdownPayment] = useState('');
const [orderambhercustomFee, setorderambhercustomFee] = useState('');
const [orderambheramountPaid, setorderambheramountPaid] = useState('');
const [orderambherNotes, setorderambherNotes] = useState('');
const orderambherSubtotal = Number(orderambherinventoryproductprice) * Number(ambhercount);
const orderambhertotalwithFee = orderambherSubtotal + Number(orderambhercustomFee);
const orderambherremainingBalance = orderambhertotalwithFee - Number(orderambheramountPaid);
const orderambheramountpaidChange = Number(orderambheramountPaid) - orderambhertotalwithFee;
const [orderambhercheckEmail, setorderambhercheckEmail] = useState(false);
const [orderambheremailError, setorderambheremailError] = useState(false); 
const [patientorderambherproductisClicked, setpatientorderambherproductisClicked] = useState(false);
const [patientorderambherproductToast, setpatientorderambherproductToast] = useState(false);
const [patientorderambherproductToastMessage, setpatientorderambherproductToastMessage] = useState("");
const [patientorderambherproductToastClosing, setpatientorderambherproductToastClosing] = useState(false);
const [ambherproductsoldCount, setambherproductsoldCount] = useState(0);
const [ambherproductsoldCounts, setambherproductsoldCounts] = useState(0);
const [isSubmittingAmbherCompleteOrder, setIsSubmittingAmbherCompleteOrder] = useState(false);
const [isSubmittingAmbherPendingOrder, setIsSubmittingAmbherPendingOrder] = useState(false);


//Order Bautista
 const [orderbautistainventorycategorynamebox , setorderbautistainventorycategorynamebox ] = useState("");
const [orderbautistainventoryproductname , setorderbautistainventoryproductname ] = useState("");
const [orderbautistainventoryproductbrand , setorderbautistainventoryproductbrand ] = useState("");
const [orderbautistainventoryproductmodelnumber, setorderbautistainventoryproductmodelnumber ] = useState("");
const [orderbautistainventoryproductdescription , setorderbautistainventoryproductdescription ] = useState("");
const [orderbautistainventoryproductnotes , setorderbautistainventoryproductnotes ] = useState("");
const [orderbautistainventoryproductprice , setorderbautistainventoryproductprice ] = useState( );
const [orderbautistainventoryproductquantity , setorderbautistainventoryproductquantity ] = useState( );
const [orderbautistainventoryproductimagepreviewimages , setorderbautistainventoryproductimagepreviewimages ] = useState([]);
const [orderbautistacurrentimageindex, setorderbautistacurrentimageindex] = useState(0);
const [orderbautistaEmail, setorderbautistaEmail] = useState('');
const [orderbautistaprofilePicture, setorderbautistaprofilePicture] = useState('');
const [orderbautistafullName,setorderbautistafullName] = useState('');
const [orderbautistalastName, setorderbautistalastName] = useState('');
const [orderbautistamiddleName, setorderbautistamiddleName] = useState('');
const [orderbautistafirstName, setorderbautistafirstName] = useState('');
const [orderbautistacontactNumber, setorderbautistacontactNumber] = useState('');
const [orderbautistapickupplace, setorderbautistapickupplace] = useState('');
const [orderbautistadownPayment, setorderbautistadownPayment] = useState('');
const [orderbautistacustomFee, setorderbautistacustomFee] = useState('');
const [orderbautistaamountPaid, setorderbautistaamountPaid] = useState('');
const [orderbautistaNotes, setorderbautistaNotes] = useState('');
const orderbautistaSubtotal = Number(orderbautistainventoryproductprice) * Number(bautistacount);
const orderbautistatotalwithFee = orderbautistaSubtotal + Number(orderbautistacustomFee);
const orderbautistaremainingBalance = orderbautistatotalwithFee - Number(orderbautistaamountPaid);
const orderbautistaamountpaidChange = Number(orderbautistaamountPaid) - orderbautistatotalwithFee;
const [orderbautistacheckEmail, setorderbautistacheckEmail] = useState(false);
const [orderbautistaemailError, setorderbautistaemailError] = useState(false); 
const [patientorderbautistaproductisClicked, setpatientorderbautistaproductisClicked] = useState(false);
const [patientorderbautistaproductToast, setpatientorderbautistaproductToast] = useState(false);
const [patientorderbautistaproductToastMessage, setpatientorderbautistaproductToastMessage] = useState("");
const [patientorderbautistaproductToastClosing, setpatientorderbautistaproductToastClosing] = useState(false);
const [bautistaproductsoldCount, setbautistaproductsoldCount] = useState(0);
const [bautistaproductsoldCounts, setbautistaproductsoldCounts] = useState(0);
const [isSubmittingBautistaCompleteOrder, setIsSubmittingBautistaCompleteOrder] = useState(false);
const [isSubmittingBautistaPendingOrder, setIsSubmittingBautistaPendingOrder] = useState(false);




const [progressWidth, setProgressWidth] = useState('0%');   



//Fetching ambherproducts sold count  
useEffect(() => {
const fetchSoldCount = async () => {
  if (!selectedorderambherproduct?.ambherinventoryproductid) return;

  try {
    const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${selectedorderambherproduct.ambherinventoryproductid}`);
    if (!response.ok) throw new Error("Failed to fetch sold count");
    const data = await response.json();
    setambherproductsoldCount(data.sold || 0);
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

fetchSoldCount();
}, [selectedorderambherproduct]);





//Fetching bautistaproducts sold count  
useEffect(() => {
const fetchSoldCount = async () => {
  if (!selectedorderbautistaproduct?.bautistainventoryproductid) return;

  try {
    const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${selectedorderbautistaproduct.bautistainventoryproductid}`);
    if (!response.ok) throw new Error("Failed to fetch sold count");
    const data = await response.json();
    setbautistaproductsoldCount(data.sold || 0);
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

fetchSoldCount();
}, [selectedorderbautistaproduct]);





//Fetching ambherproducts sold count for every card display 
useEffect(() => {
const fetchAllSoldCounts = async () => {
  const counts = {};

  await Promise.all(
    ambherinventoryproducts.map(async (product) => {
      try {
        const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${product.ambherinventoryproductid}`);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        counts[product.ambherinventoryproductid] = data.sold || 0;
      } catch (error) {
        console.error("Error fetching sold count for", product.ambherinventoryproductid, error);
        counts[product.ambherinventoryproductid] = 0;
      }
    })
  );

  setambherproductsoldCounts(counts);
};

if (ambherinventoryproducts.length > 0) {
  fetchAllSoldCounts();
}
}, [ambherinventoryproducts]);








//Fetching bautistaproducts sold count for every card display 
useEffect(() => {
const fetchAllSoldCounts = async () => {
  const counts = {};

  await Promise.all(
    bautistainventoryproducts.map(async (product) => {
      try {
        const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${product.bautistainventoryproductid}`);
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        counts[product.bautistainventoryproductid] = data.sold || 0;
      } catch (error) {
        console.error("Error fetching sold count for", product.bautistainventoryproductid, error);
        counts[product.bautistainventoryproductid] = 0;
      }
    })
  );

  setbautistaproductsoldCounts(counts);
};

if (bautistainventoryproducts.length > 0) {
  fetchAllSoldCounts();
}
}, [bautistainventoryproducts]);




















// UseEffect for Product Orddering Toast
useEffect(() => {
if (patientorderambherproductToast) {
  setProgressWidth('0%');
  setpatientorderambherproductToastClosing(false);

  const progresstimer = setTimeout(() => {
    setProgressWidth('100%');
  }, 50);

  // Close toast after 4 seconds
  const toasttimer = setTimeout(() => {
    setpatientorderambherproductToastClosing(true);
    setTimeout(() => {
      setpatientorderambherproductToast(false);
      setProgressWidth('0%');
    }, 300);
  }, 4000);

  return () => {
    clearTimeout(progresstimer);
    clearTimeout(toasttimer);
  }
}else if(patientorderbautistaproductToast){
  setProgressWidth('0%');
  setpatientorderbautistaproductToastClosing(false);

  const progresstimer = setTimeout(() => {
    setProgressWidth('100%');
  }, 50);

  // Close toast after 4 seconds
  const toasttimer = setTimeout(() => {
    setpatientorderbautistaproductToastClosing(true);
    setTimeout(() => {
      setpatientorderbautistaproductToast(false);
      setProgressWidth('0%');
    }, 300);
  }, 4000);

  return () => {
    clearTimeout(progresstimer);
    clearTimeout(toasttimer);
  }
}
}, [patientorderambherproductToast, patientorderbautistaproductToast]);





//CHECK EMAIL IF EXISTS IN AMBHER ORDER FORM
useEffect(() => {
const checkAndFetchPatientDetails = async () => {
  // Check if user has permission to create orders
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can create orders for patients");
    setorderambheremailError(true);
    return;
  }

  if (!orderambherEmail) {
    setorderambheremailError(false);
    setorderambherfullName("");
    setorderambherlastName("");
    setorderambhermiddleName("");
    setorderambherfirstName("");
    setorderambherprofilePicture("");
    setorderambhercontactNumber("");
    return;
  }

  if (!emailcharacters.test(orderambherEmail)) {
    setorderambheremailError(true);
    setorderambherfullName("");
    setorderambherlastName("");
    setorderambhermiddleName("");
    setorderambherfirstName("");
    setorderambherprofilePicture("");
    setorderambhercontactNumber("");
    return;
  }

  // Skip API call if data is already fetched for this email
  if (orderambherfullName && orderambhercontactNumber && !orderambheremailError) {
    console.log("Patient data already fetched for:", orderambherEmail);
    return;
  }

  setorderambhercheckEmail(true);

  try {
    // Check if email exists
    const checkRes = await fetch(`/api/patientaccounts/check-email/${orderambherEmail}`);
    const checkData = await checkRes.json();

    if (checkData.exists) {
      setorderambheremailError(false);

      // Get full name info
      const patientRes = await fetch(`/api/patientaccounts/get-by-email/${orderambherEmail}`);
      const patient = await patientRes.json();

      const fullName = `${patient.patientfirstname} ${patient.patientmiddlename || ""} ${patient.patientlastname}`.trim();
      const lastName = ` ${patient.patientlastname}`.trim();
      const middleName = ` ${patient.patientmiddlename || ""} `.trim();
      const firstName =` ${patient.patientfirstname}`.trim();
      const profilePicture = ` ${patient.patientprofilepicture}`.trim();


      setorderambherfullName(fullName);
      setorderambherlastName(lastName);
      setorderambhermiddleName(middleName);
      setorderambherfirstName(firstName);
      setorderambherprofilePicture(profilePicture);

      // Fetch patient demographic data for contact information
      try {
        const demographicResponse = await fetch(
          `/api/patientdemographics/patientemail/${orderambherEmail}`,
          {
            headers: {
              'Authorization': `Bearer ${currentusertoken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (demographicResponse.ok) {
          const demographicData = await demographicResponse.json();
          console.log("Demographics data fetched:", demographicData);
          
          if (demographicData.patientcontactnumber) {
            setorderambhercontactNumber(demographicData.patientcontactnumber);
          } else {
            setorderambhercontactNumber("");
          }
        } else {
          console.log("Demographics API response:", demographicResponse.status, demographicResponse.statusText);
          setorderambhercontactNumber("");
        }
      } catch (error) {
        console.error("Error fetching demographics:", error);
        setorderambhercontactNumber("");
      }

    } else {
    setorderambheremailError(true);
    setorderambherfullName("");
    setorderambherlastName("");
    setorderambhermiddleName("");
    setorderambherfirstName("");
    setorderambherprofilePicture("");
    setorderambhercontactNumber("");
    }
  } catch (err) {
    console.error("Error checking patient details:", err);
    setorderambheremailError(true);
    setorderambherfullName("");
    setorderambherlastName("");
    setorderambhermiddleName("");
    setorderambherfirstName("");
    setorderambherprofilePicture("");
    setorderambhercontactNumber("");
  } finally {
    setorderambhercheckEmail(false);
  }
};

// Debounce with 800ms delay to reduce API calls
const delay = setTimeout(checkAndFetchPatientDetails, 800);
return () => clearTimeout(delay);
}, [orderambherEmail, currentusertoken, emailcharacters, currentuserloggedin]);


//CHECK EMAIL IF EXISTS IN bautista ORDER FORM
useEffect(() => {
const checkAndFetchPatientDetails = async () => {
  // Check if user has permission to create orders
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can create orders for patients");
    setorderbautistaemailError(true);
    return;
  }

  if (!orderbautistaEmail) {
    setorderbautistaemailError(false);
    setorderbautistafullName("");
    setorderbautistalastName("");
    setorderbautistamiddleName("");
    setorderbautistafirstName("");
    setorderbautistaprofilePicture("");
    setorderbautistacontactNumber("");
    return;
  }

  if (!emailcharacters.test(orderbautistaEmail)) {
    setorderbautistaemailError(true);
    setorderbautistafullName("");
    setorderbautistalastName("");
    setorderbautistamiddleName("");
    setorderbautistafirstName("");
    setorderbautistaprofilePicture("");
    setorderbautistacontactNumber("");
    return;
  }

  // Skip API call if data is already fetched for this email
  if (orderbautistafullName && orderbautistacontactNumber && !orderbautistaemailError) {
    console.log("Patient data already fetched for:", orderbautistaEmail);
    return;
  }

  setorderbautistacheckEmail(true);

  try {
    // Check if email exists
    const checkRes = await fetch(`/api/patientaccounts/check-email/${orderbautistaEmail}`);
    const checkData = await checkRes.json();

    if (checkData.exists) {
      setorderbautistaemailError(false);

      // Get full name info
      const patientRes = await fetch(`/api/patientaccounts/get-by-email/${orderbautistaEmail}`);
      const patient = await patientRes.json();

      const fullName = `${patient.patientfirstname} ${patient.patientmiddlename || ""} ${patient.patientlastname}`.trim();
      const lastName = ` ${patient.patientlastname}`.trim();
      const middleName = ` ${patient.patientmiddlename || ""} `.trim();
      const firstName =` ${patient.patientfirstname}`.trim();
      const profilePicture = ` ${patient.patientprofilepicture}`.trim();


      setorderbautistafullName(fullName);
      setorderbautistalastName(lastName);
      setorderbautistamiddleName(middleName);
      setorderbautistafirstName(firstName);
      setorderbautistaprofilePicture(profilePicture);

      // Fetch patient demographic data for contact information
      try {
        const demographicResponse = await fetch(
          `/api/patientdemographics/patientemail/${orderbautistaEmail}`,
          {
            headers: {
              'Authorization': `Bearer ${currentusertoken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (demographicResponse.ok) {
          const demographicData = await demographicResponse.json();
          console.log("Demographics data fetched:", demographicData);
          
          if (demographicData.patientcontactnumber) {
            setorderbautistacontactNumber(demographicData.patientcontactnumber);
          } else {
            setorderbautistacontactNumber("");
          }
        } else {
          console.log("Demographics API response:", demographicResponse.status, demographicResponse.statusText);
          setorderbautistacontactNumber("");
        }
      } catch (error) {
        console.error("Error fetching demographics:", error);
        setorderbautistacontactNumber("");
      }

    } else {
    setorderbautistaemailError(true);
    setorderbautistafullName("");
    setorderbautistalastName("");
    setorderbautistamiddleName("");
    setorderbautistafirstName("");
    setorderbautistaprofilePicture("");
    setorderbautistacontactNumber("");
    }
  } catch (err) {
    console.error("Error checking patient details:", err);
    setorderbautistaemailError(true);
    setorderbautistafullName("");
    setorderbautistalastName("");
    setorderbautistamiddleName("");
    setorderbautistafirstName("");
    setorderbautistaprofilePicture("");
    setorderbautistacontactNumber("");
  } finally {
    setorderbautistacheckEmail(false);
  }
};

// Debounce with 800ms delay to reduce API calls
const delay = setTimeout(checkAndFetchPatientDetails, 800);
return () => clearTimeout(delay);
}, [orderbautistaEmail, currentusertoken, emailcharacters, currentuserloggedin]);






  const fetchambherOrders = useCallback(async () => {
    try {
      setLoadingAmbherOrders(true);
      
      const response = await fetch(`/api/patientorderambher`, {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
         
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check and automatically update order status for pickup dates that match today
      const updatedData = await checkAndUpdateOrderStatus(data, 'ambher', updateAmbherOrderStatus);
      
      setambherOrders(updatedData);
  
    } catch (err) {
        console.log(err);
    } finally {
      setLoadingAmbherOrders(false);
    }
  }, [currentusertoken]);

useEffect(() => {
fetchambherOrders(); 
}, [fetchambherOrders]);




const filteredambherOrders = ambherorders.filter(order => {
  const matchesFilter = ambherfilter === 'All' || order.patientorderambherstatus === ambherfilter;
  const matchesSearch = order.patientorderambherproductname.toLowerCase().includes(searchambherTerm.toLowerCase()) ||
                       order.patientfirstname.toLowerCase().includes(searchambherTerm.toLowerCase()) ||
                       order.patientlastname.toLowerCase().includes(searchambherTerm.toLowerCase());
  return matchesFilter && matchesSearch;
});









    const fetchbautistaOrders = useCallback(async () => {
    try {
      setLoadingBautistaOrders(true);
      
      const response = await fetch(`/api/patientorderbautista`, {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
         
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check and automatically update order status for pickup dates that match today
      const updatedData = await checkAndUpdateOrderStatus(data, 'bautista', updateBautistaOrderStatus);
      
      setbautistaOrders(updatedData);
  
    } catch (err) {
        console.log(err);
    } finally {
      setLoadingBautistaOrders(false);
    }
  }, [currentusertoken]);

useEffect(() => {
fetchbautistaOrders(); 
}, [fetchbautistaOrders]);

// Function to immediately refresh orders and update UI
const refreshOrdersWithStatusCheck = useCallback(async () => {
  console.log('🔄 Refreshing orders with immediate status check...');
  
  try {
    // Fetch fresh data from API
    await Promise.all([fetchambherOrders(), fetchbautistaOrders()]);
    console.log('✅ Orders refreshed with latest status updates');
  } catch (error) {
    console.error('❌ Error refreshing orders:', error);
  }
}, [fetchambherOrders, fetchbautistaOrders]);



const filteredbautistaOrders = bautistaorders.filter(order => {
  const matchesFilter = bautistafilter === 'All' || order.patientorderbautistastatus === bautistafilter;
  const matchesSearch = order.patientorderbautistaproductname.toLowerCase().includes(searchbautistaTerm.toLowerCase()) ||
                       order.patientfirstname.toLowerCase().includes(searchbautistaTerm.toLowerCase()) ||
                       order.patientlastname.toLowerCase().includes(searchbautistaTerm.toLowerCase());
  return matchesFilter && matchesSearch;
});



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

// View Order Modal handlers
const handleViewOrder = (order) => {
  setSelectedOrderForView(order);
  setViewOrderCurrentImageIndex(0);
  setShowViewOrderModal(true);
  
  // Initialize pickup date if already set
  const isAmbher = order.patientorderambherid;
  const existingPickupDate = isAmbher 
    ? order.patientorderambherproductchosenpickupdate 
    : order.patientorderbautistaproductchosenpickupdate;
  setSelectedPickupDate(existingPickupDate || '');
};

const closeViewOrderModal = () => {
  setShowViewOrderModal(false);
  setSelectedOrderForView(null);
  setViewOrderCurrentImageIndex(0);
  setSelectedPickupDate('');
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

// Function to update pickup date for orders
const updatePickupDate = useCallback(async (pickupDate) => {
  if (!selectedOrderForView || !pickupDate) return;
  
  try {
    const isAmbher = selectedOrderForView.patientorderambherid;
    const orderId = isAmbher 
      ? selectedOrderForView.patientorderambherid 
      : selectedOrderForView.patientorderbautistaid;
    
    const endpoint = isAmbher 
      ? `${apiUrl}/api/patientorderambher/${orderId}`
      : `${apiUrl}/api/patientorderbautista/${orderId}`;
    
    console.log(`🔄 Updating pickup date for ${isAmbher ? 'ambher' : 'bautista'} order ${orderId} to ${pickupDate}`);
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        // Update the available for pickup date (this is what determines status)
        patientorderambheravailableforpickupdate: pickupDate,
        patientorderbautistaavailableforpickupdate: pickupDate,
        // Also update the chosen pickup date for consistency
        patientorderbautistaproductchosenpickupdate: pickupDate,
        patientorderambherproductchosenpickupdate: pickupDate
      })
    });

    if (response.ok) {
      console.log(`✅ Successfully updated pickup date for ${isAmbher ? 'ambher' : 'bautista'} order ${orderId}`);
      
      // Update the local state immediately
      setSelectedOrderForView(prev => ({
        ...prev,
        patientorderambheravailableforpickupdate: pickupDate,
        patientorderbautistaavailableforpickupdate: pickupDate,
        patientorderbautistaproductchosenpickupdate: pickupDate,
        patientorderambherproductchosenpickupdate: pickupDate
      }));
      
      // Create updated order object for status checking with the new pickup date
      const updatedOrder = {
        ...selectedOrderForView,
        patientorderambheravailableforpickupdate: pickupDate,
        patientorderbautistaavailableforpickupdate: pickupDate,
        patientorderbautistaproductchosenpickupdate: pickupDate,
        patientorderambherproductchosenpickupdate: pickupDate
      };
      
      // Immediately check and update status based on new pickup date
      console.log('� Checking status after pickup date change...');
      const clinic = isAmbher ? 'ambher' : 'bautista';
      const updateCallback = isAmbher ? updateAmbherOrderStatus : updateBautistaOrderStatus;
      
      const [updatedOrderWithStatus] = await checkAndUpdateOrderStatus([updatedOrder], clinic, updateCallback);
      
      // Update the selected order with the new status if it changed
      if (updatedOrderWithStatus) {
        setSelectedOrderForView(updatedOrderWithStatus);
        console.log(`🎯 Order ${orderId} status immediately updated to: ${isAmbher ? updatedOrderWithStatus.patientorderambherstatus : updatedOrderWithStatus.patientorderbautistastatus}`);
      }
      
      // Refresh the orders list to show updated status immediately
      setTimeout(() => {
        refreshOrdersWithStatusCheck();
      }, 500);
      
      console.log('✅ Pickup date updated and status checked with UI refresh');
    } else {
      console.error(`❌ Failed to update pickup date: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error updating pickup date:', error);
  }
}, [selectedOrderForView, currentusertoken, apiUrl, checkAndUpdateOrderStatus, updateAmbherOrderStatus, updateBautistaOrderStatus, refreshOrdersWithStatusCheck]);

const handlePickupDateChange = (e) => {
  const selectedDate = e.target.value;
  setSelectedPickupDate(selectedDate);
  updatePickupDate(selectedDate);
};

// Function to mark order as complete
const markOrderAsComplete = useCallback(async () => {
  if (!selectedOrderForView) return;
  
  try {
    const isAmbher = selectedOrderForView.patientorderambherid;
    const orderId = isAmbher 
      ? selectedOrderForView.patientorderambherid 
      : selectedOrderForView.patientorderbautistaid;
    
    const endpoint = isAmbher 
      ? `${apiUrl}/api/patientorderambher/${orderId}`
      : `${apiUrl}/api/patientorderbautista/${orderId}`;
    
    console.log(`🔄 Marking ${isAmbher ? 'ambher' : 'bautista'} order ${orderId} as complete`);
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        // Update order status to Completed
        patientorderambherstatus: 'Completed',
        patientorderbautistastatus: 'Completed',
        // Update pickup status to Now (which indicates completed)
        patientorderambherproductpickupstatus: 'Now',
        patientorderbautistaproductpickupstatus: 'Now',
        changedBy: `${adminfirstname} ${adminlastname}` || 'Admin User'
      })
    });

    if (response.ok) {
      const updatedOrder = await response.json();
      console.log(`✅ Successfully marked ${isAmbher ? 'ambher' : 'bautista'} order ${orderId} as complete`);
      
      // Update the product quantity after completing the order
      try {
        const productId = isAmbher 
          ? selectedOrderForView.patientorderambherproductid 
          : selectedOrderForView.patientorderbautistaproductid;
        const quantityOrdered = isAmbher 
          ? selectedOrderForView.patientorderambherproductquantity 
          : selectedOrderForView.patientorderbautistaproductquantity;
        
        const inventoryEndpoint = isAmbher 
          ? `${apiUrl}/api/ambherinventoryproduct/${productId}`
          : `${apiUrl}/api/bautistainventoryproduct/${productId}`;
        
        // Get current product data to calculate new quantity
        const currentProductResponse = await fetch(inventoryEndpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (currentProductResponse.ok) {
          const currentProduct = await currentProductResponse.json();
          const currentQuantity = isAmbher 
            ? currentProduct.ambherinventoryproductquantity 
            : currentProduct.bautistainventoryproductquantity;
          const newQuantity = currentQuantity - quantityOrdered;
          
          const updateBody = isAmbher 
            ? { ambherinventoryproductquantity: newQuantity }
            : { bautistainventoryproductquantity: newQuantity };
          
          const updateResponse = await fetch(inventoryEndpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentusertoken}`
            },
            body: JSON.stringify(updateBody)
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error('Failed to update product quantity:', errorText);
          } else {
            console.log(`✅ Successfully updated inventory quantity: ${currentQuantity} → ${newQuantity}`);
            
            // Update local inventory state
            if (isAmbher) {
              setambherinventoryproducts(prevProducts => 
                prevProducts.map(product => product.ambherinventoryproductid === productId
                  ? { ...product, ambherinventoryproductquantity: newQuantity }
                  : product
                )
              );
            } else {
              setbautistainventoryproducts(prevProducts => 
                prevProducts.map(product => product.bautistainventoryproductid === productId
                  ? { ...product, bautistainventoryproductquantity: newQuantity }
                  : product
                )
              );
            }
            
            // Refresh sold counts after completing the order
            try {
              const soldCountResponse = await fetch(`${apiUrl}/api/${isAmbher ? 'patientorderambher' : 'patientorderbautista'}/${isAmbher ? 'ambher' : 'bautista'}productsoldcount/${productId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${currentusertoken}`
                }
              });
              
              if (soldCountResponse.ok) {
                const soldData = await soldCountResponse.json();
                const newSoldCount = soldData.sold || 0;
                
                // Update sold counts state
                if (isAmbher) {
                  setambherproductsoldCounts(prevCounts => ({
                    ...prevCounts,
                    [productId]: newSoldCount
                  }));
                } else {
                  setbautistaproductsoldCounts(prevCounts => ({
                    ...prevCounts,
                    [productId]: newSoldCount
                  }));
                }
                
                console.log(`✅ Updated sold count for product ${productId}: ${newSoldCount}`);
              } else {
                console.warn('Failed to fetch updated sold count');
              }
            } catch (soldCountError) {
              console.error('❌ Failed to update sold count:', soldCountError);
            }
          }
        } else {
          console.error('Failed to get current product data for inventory update');
        }
      } catch (inventoryError) {
        console.error('❌ Failed to update inventory quantity:', inventoryError);
      }
      
      // Remove the product from patient's wishlist after completing the order
      try {
        const customerEmail = isAmbher 
          ? selectedOrderForView.patientemail 
          : selectedOrderForView.patientemail;
        const productId = isAmbher 
          ? selectedOrderForView.patientorderambherproductid 
          : selectedOrderForView.patientorderbautistaproductid;
        const clinicType = isAmbher ? 'ambher' : 'bautista';

        const deletewishlistResponse = await fetch(`${apiUrl}/api/patientwishlistinventoryproduct/admin-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentusertoken}` 
          },
          body: JSON.stringify({
            email: customerEmail,
            productId: productId,
            clinicType: clinicType
          })
        });

        if (!deletewishlistResponse.ok) {
          const errorText = await deletewishlistResponse.text();
          console.warn('Failed to delete wishlisted item of the user:', errorText);
        } else {
          console.log('✅ Wishlisted product from patient wishlist is successfully deleted');
        }

      } catch (wishlistError) {
        console.error('❌ Failed to delete the wishlisted product:', wishlistError);
      }
      
      // Update the local state immediately
      setSelectedOrderForView(updatedOrder);
      
      // Update the orders list to reflect the change
      if (isAmbher) {
        setambherOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      } else {
        setbautistaOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }
      
      // Refresh orders list to ensure consistency
      setTimeout(() => {
        refreshOrdersWithStatusCheck();
      }, 500);
      
      console.log('🎯 Order marked as complete and UI updated');
    } else {
      console.error(`❌ Failed to mark order as complete: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error marking order as complete:', error);
  }
}, [selectedOrderForView, currentusertoken, apiUrl, adminfirstname, adminlastname, refreshOrdersWithStatusCheck, setSelectedOrderForView, setambherOrders, setbautistaOrders, setambherinventoryproducts, setbautistainventoryproducts, setambherproductsoldCounts, setbautistaproductsoldCounts]);

// Function to get minimum date (tomorrow)
const getMinDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Handle additional payment processing
const handleAdditionalPayment = async () => {
  if (!additionalPayment || Number(additionalPayment) <= 0) {
    setPaymentMessage({ text: 'Please enter a valid payment amount', type: 'error' });
    return;
  }

  setIsProcessingPayment(true);
  setPaymentMessage({ text: '', type: '' });

  try {
    const isAmbher = selectedOrderForView.patientorderambherid;
    const currentAmountPaid = Number(isAmbher 
      ? selectedOrderForView.patientorderambheramountpaid 
      : selectedOrderForView.patientorderbautistaamountpaid);
    const productTotal = Number(isAmbher 
      ? selectedOrderForView.patientorderambherproducttotal 
      : selectedOrderForView.patientorderbautistaproducttotal);
    const additionalAmount = Number(additionalPayment);
    const newTotalPaid = currentAmountPaid + additionalAmount;
    const remainingBalance = productTotal - currentAmountPaid;
    
    // Calculate change if payment exceeds remaining balance
    const change = additionalAmount > remainingBalance ? additionalAmount - remainingBalance : 0;
    const finalAmountPaid = Math.min(newTotalPaid, productTotal);
    
    const orderId = isAmbher 
      ? selectedOrderForView.patientorderambherid 
      : selectedOrderForView.patientorderbautistaid;
    
    const endpoint = isAmbher 
      ? `${apiUrl}/api/patientorderambher/update-payment/${orderId}`
      : `${apiUrl}/api/patientorderbautista/update-payment/${orderId}`;
    
    const updateData = isAmbher ? {
      patientorderambheramountpaid: finalAmountPaid,
      patientorderambheramountpaidchange: change
    } : {
      patientorderbautistaamountpaid: finalAmountPaid,
      patientorderbautistaamountpaidchange: change
    };

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      // Update the selected order view with new payment data
      const updatedOrder = {
        ...selectedOrderForView,
        ...(isAmbher ? {
          patientorderambheramountpaid: finalAmountPaid,
          patientorderambheramountpaidchange: change
        } : {
          patientorderbautistaamountpaid: finalAmountPaid,
          patientorderbautistaamountpaidchange: change
        })
      };
      setSelectedOrderForView(updatedOrder);
      
      // Refresh the orders list to reflect the updated payment data
      if (isAmbher) {
        await fetchambherOrders();
      } else {
        await fetchbautistaOrders();
      }
      
      // Clear the additional payment input
      setAdditionalPayment('');
      
      // Show success message
      if (change > 0) {
        setPaymentMessage({ 
          text: `Payment processed successfully. Change: ₱${change.toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
          type: 'success' 
        });
      } else {
        setPaymentMessage({ text: 'Payment processed successfully', type: 'success' });
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setPaymentMessage({ text: '', type: '' });
      }, 3000);
      
    } else {
      throw new Error('Failed to process payment');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    setPaymentMessage({ text: 'Failed to process payment. Please try again.', type: 'error' });
  } finally {
    setIsProcessingPayment(false);
  }
};

const handlePaymentInputChange = (e) => {
  const value = e.target.value;
  if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
    setAdditionalPayment(value);
  }
};







//SET ORDER AMBHER VIEWING PREVIOUS  IMAGE
        const orderambherhandlepreviousimage = (e) => {
          e.preventDefault(); 
          if (selectedorderambherproduct) {
            if (!selectedorderambherproduct.ambherinventoryproductimagepreviewimages?.length) return;
            setorderambhercurrentimageindex(prev => prev === 0 ? selectedorderambherproduct.ambherinventoryproductimagepreviewimages.length - 1 : prev - 1 );
        
          } else {
            if (!orderambherinventoryproductimagepreviewimages?.length) return;
            setorderambhercurrentimageindex(prev => prev === 0 ? orderambherinventoryproductimagepreviewimages.length - 1 : prev - 1 );
          }
        };
        
        //NEXT IMAGE
        const orderambherhandlenextimage = (e) => {
          e.preventDefault();
          if (selectedorderambherproduct) {
            if (!selectedorderambherproduct.ambherinventoryproductimagepreviewimages?.length) return;
            setorderambhercurrentimageindex(prev => prev === selectedorderambherproduct.ambherinventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1 );
        
          } else {
            if (!orderambherinventoryproductimagepreviewimages?.length) return;
            setorderambhercurrentimageindex(prev => prev === orderambherinventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1);
        
          }
        };

 


//SET ORDER bautista VIEWING PREVIOUS  IMAGE
        const orderbautistahandlepreviousimage = (e) => {
          e.preventDefault(); 
          if (selectedorderbautistaproduct) {
            if (!selectedorderbautistaproduct.bautistainventoryproductimagepreviewimages?.length) return;
            setorderbautistacurrentimageindex(prev => prev === 0 ? selectedorderbautistaproduct.bautistainventoryproductimagepreviewimages.length - 1 : prev - 1 );
        
          } else {
            if (!orderbautistainventoryproductimagepreviewimages?.length) return;
            setorderbautistacurrentimageindex(prev => prev === 0 ? orderbautistainventoryproductimagepreviewimages.length - 1 : prev - 1 );
          }
        };
        
        //NEXT IMAGE
        const orderbautistahandlenextimage = (e) => {
          e.preventDefault();
          if (selectedorderbautistaproduct) {
            if (!selectedorderbautistaproduct.bautistainventoryproductimagepreviewimages?.length) return;
            setorderbautistacurrentimageindex(prev => prev === selectedorderbautistaproduct.bautistainventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1 );
        
          } else {
            if (!orderbautistainventoryproductimagepreviewimages?.length) return;
            setorderbautistacurrentimageindex(prev => prev === orderbautistainventoryproductimagepreviewimages.length - 1 ? 0 : prev + 1);
        
          }
        };






//FUNCTION BUTTON FOR COMPLETE ORDER  

//AMBHER OPTICAL ORDER PRODUCT
const submitpatientorderambher = async (e) => {
e.preventDefault();
setIsSubmittingAmbherCompleteOrder(true);

try {
  // Prepare order data
  const orderData = {
    // Patient Information
    patientprofilepicture: orderambherprofilePicture,
    patientfirstname: orderambherfirstName,
    patientmiddlename: orderambhermiddleName,
    patientlastname: orderambherlastName,
    patientemail: orderambherEmail,
    patientcontactnumber: orderambhercontactNumber,

    // Ordered Product Info
    patientorderambherproductid: selectedorderambherproduct?.ambherinventoryproductid,
    patientorderambherproductname: orderambherinventoryproductname,
    patientorderambherproductbrand: orderambherinventoryproductbrand,
    patientorderambherproductmodelnumber: orderambherinventoryproductmodelnumber,
    patientorderambherproductcategory: orderambherinventorycategorynamebox,
    patientorderambherproductimage: orderambherinventoryproductimagepreviewimages,
    patientorderambherproductprice: orderambherinventoryproductprice,
    patientorderambherproductquantity: ambhercount,
    patientorderambherproductsubtotal: orderambherinventoryproductprice * ambhercount,
    patientorderambherproductdescription: orderambherinventoryproductdescription,
    patientorderambherproductnotes: orderambherNotes,

    //Total
    patientorderambhercustomfee: Number(orderambhercustomFee),
    patientorderambheramountpaid: Number(orderambheramountPaid),
    patientorderambherproducttotal: orderambhertotalwithFee,
    patientorderambherremainingbalance: orderambherremainingBalance,
    patientorderambheramountpaidChange: orderambheramountpaidChange,

    //Payment
    patientorderambherproductpaymentmethod: 'Cash',
    patientorderambherproductpaymentreceiptimage: '',
    patientorderambherproductpaymentstatus: 'Fully Paid', //"Partially Paid" or "Fully Paid"
    patientorderambherproductpaymenttransactionid: '',

    //Pickup if not "Now"
    patientorderambherproductpickupstatus: ambherpickupStatus, //'Now' or 'Later'
    patientorderambherproductchosenpickupdate: 'Now',
    patientorderambherproductchosenpickuptime: 'Default',
    patientorderambherproductchosenpickupplace: orderambherpickupplace,

    //Authorized Person
    patientorderambherproducauthorizedname: adminfirstname + " " + adminmiddlename + " " + adminlastname,
    patientorderambherproducauthorizedtype: currentuserloggedin,

    // Order History
    patientorderambherstatus: 'Completed',
    patientorderambherhistory: [{
      status: 'Completed',
      changedAt: new Date(),
      changedBy: `${orderambherfirstName} ${orderambherlastName}`
    }]
  };

  console.log('Submitting order:', orderData);

  // Submit order using admin token
  const response = await fetch(`/api/patientorderambher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
    },
    body: JSON.stringify(orderData)
  });

  // Handle response
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server response:', errorText);
    throw new Error(errorText || `Server error: ${response.status}`);
  }

  // If order was successful, update the product quantity
  const productId = selectedorderambherproduct?.ambherinventoryproductid;
  const quantityOrdered = ambhercount;
  
  const updateResponse = await fetch(`/api/ambherinventoryproduct/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${currentusertoken}` // Using admin token
    },
    body: JSON.stringify({
      ambherinventoryproductquantity: selectedorderambherproduct.ambherinventoryproductquantity - quantityOrdered
    })
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error('Failed to update product quantity:', errorText);
    throw new Error(`Failed to update inventory: ${errorText}`);
  }
    
  // Update local state
  setambherinventoryproducts(prevProducts => 
    prevProducts.map(product => product.ambherinventoryproductid === productId
        ? { ...product, ambherinventoryproductquantity: product.ambherinventoryproductquantity - quantityOrdered }
        : product
    )
  );





try {

const deletewishlistResponse = await fetch(`/api/patientwishlistinventoryproduct/admin-delete`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${currentusertoken}` 
  },
  body: JSON.stringify({
    email: orderambherEmail,
    productId: selectedorderambherproduct?.ambherinventoryproductid,
    clinicType: 'ambher'
  })
});


if (!deletewishlistResponse.ok) {
  const errorText = await deletewishlistResponse.text();
  console.warn('Failed to delete wishlisted item of the user', errorText);
} else {
  console.log('Wishlisted product from patient wishlist is successfully deleted');
}


} catch (wishlistError) {
console.error('Failed to deleting the wishlisted product', wishlistError);
}




  // Handle success
  const result = await response.json();
  setpatientorderambherproductisClicked(true);
  setpatientorderambherproductToastMessage("Order Submitted Successfully!");
  setpatientorderambherproductToast(true);
  setpatientorderambherproductToastClosing(false);

  // Reset form fields
  setorderambherEmail('');
  setorderambherprofilePicture('');
  setorderambherfullName('');
  setorderambherlastName('');
  setorderambhermiddleName('');
  setorderambherfirstName('');
  setorderambhercontactNumber('');
  setorderambherdownPayment('');
  setorderambhercustomFee('');
  setorderambheramountPaid('');
  setorderambherNotes('');
  setambherproductsoldCount(0);
  setambherpickupStatus('Later');
  // Reset state
  setselectedorderambherproduct(null);
  setshowpatientorderambher(false);
  await fetchambherOrders();

} catch (error) {
  console.error('Submission error:', error);
  setpatientorderambherproductToastMessage(error.message);
  setpatientorderambherproductToast(true);
  setpatientorderambherproductToastClosing(false);
} finally {
  setIsSubmittingAmbherCompleteOrder(false);
}
};

//BAUTISTA ORDER PRODUCT
const submitpatientorderbautista = async (e) => {
e.preventDefault();
setIsSubmittingBautistaCompleteOrder(true);

try {
  // Prepare order data
  const orderData = {
    // Patient Information
    patientprofilepicture: orderbautistaprofilePicture,
    patientfirstname: orderbautistafirstName,
    patientmiddlename: orderbautistamiddleName,
    patientlastname: orderbautistalastName,
    patientemail: orderbautistaEmail,
    patientcontactnumber: orderbautistacontactNumber,

    // Ordered Product Info
    patientorderbautistaproductid: selectedorderbautistaproduct?.bautistainventoryproductid,
    patientorderbautistaproductname: orderbautistainventoryproductname,
    patientorderbautistaproductbrand: orderbautistainventoryproductbrand,
    patientorderbautistaproductmodelnumber: orderbautistainventoryproductmodelnumber,
    patientorderbautistaproductcategory: orderbautistainventorycategorynamebox,
    patientorderbautistaproductimage: orderbautistainventoryproductimagepreviewimages,
    patientorderbautistaproductprice: orderbautistainventoryproductprice,
    patientorderbautistaproductquantity: bautistacount,
    patientorderbautistaproductsubtotal: orderbautistainventoryproductprice * bautistacount,
    patientorderbautistaproductdescription: orderbautistainventoryproductdescription,
    patientorderbautistaproductnotes: orderbautistaNotes,

    //Total
    patientorderbautistacustomfee: Number(orderbautistacustomFee),
    patientorderbautistaamountpaid: Number(orderbautistaamountPaid),
    patientorderbautistaproducttotal: orderbautistatotalwithFee,
    patientorderbautistaremainingbalance: orderbautistaremainingBalance,
    patientorderbautistaamountpaidChange: orderbautistaamountpaidChange,

    //Payment
    patientorderbautistaproductpaymentmethod: 'Cash',
    patientorderbautistaproductpaymentreceiptimage: '',
    patientorderbautistaproductpaymentstatus: 'Fully Paid', //"Partially Paid" or "Fully Paid"
    patientorderbautistaproductpaymenttransactionid: '',

    //Pickup if not "Now"
    patientorderbautistaproductpickupstatus: bautistapickupStatus, //'Now' or 'Later'
    patientorderbautistaproductchosenpickupdate: 'Now',
    patientorderbautistaproductchosenpickuptime: 'Default',
    patientorderbautistaproductchosenpickupplace: orderbautistapickupplace,

    //Authorized Person
    patientorderbautistaproducauthorizedname: adminfirstname + " " + adminmiddlename + " " + adminlastname,
    patientorderbautistaproducauthorizedtype: currentuserloggedin,

    // Order History
    patientorderbautistastatus: 'Completed',
    patientorderbautistahistory: [{
      status: 'Completed',
      changedAt: new Date(),
      changedBy: `${orderbautistafirstName} ${orderbautistalastName}`
    }]
  };

  console.log('Submitting order:', orderData);

  // Submit order using admin token
  const response = await fetch(`/api/patientorderbautista`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
    },
    body: JSON.stringify(orderData)
  });

  // Handle response
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server response:', errorText);
    throw new Error(errorText || `Server error: ${response.status}`);
  }

  // If order was successful, update the product quantity
  const productId = selectedorderbautistaproduct?.bautistainventoryproductid;
  const quantityOrdered = bautistacount;
  
  const updateResponse = await fetch(`/api/bautistainventoryproduct/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${currentusertoken}` // Using admin token
    },
    body: JSON.stringify({
      bautistainventoryproductquantity: selectedorderbautistaproduct.bautistainventoryproductquantity - quantityOrdered
    })
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    console.error('Failed to update product quantity:', errorText);
    throw new Error(`Failed to update inventory: ${errorText}`);
  }
    
  // Update local state
  setbautistainventoryproducts(prevProducts => 
    prevProducts.map(product => product.bautistainventoryproductid === productId
        ? { ...product, bautistainventoryproductquantity: product.bautistainventoryproductquantity - quantityOrdered }
        : product
    )
  );





try {

const deletewishlistResponse = await fetch(`/api/patientwishlistinventoryproduct/admin-delete`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${currentusertoken}` 
  },
  body: JSON.stringify({
    email: orderbautistaEmail,
    productId: selectedorderbautistaproduct?.bautistainventoryproductid,
    clinicType: 'bautista'
  })
});


if (!deletewishlistResponse.ok) {
  const errorText = await deletewishlistResponse.text();
  console.warn('Failed to delete wishlisted item of the user', errorText);
} else {
  console.log('Wishlisted product from patient wishlist is successfully deleted');
}


} catch (wishlistError) {
console.error('Failed to deleting the wishlisted product', wishlistError);
}




  // Handle success
  const result = await response.json();
  setpatientorderbautistaproductisClicked(true);
  setpatientorderbautistaproductToastMessage("Order Submitted Successfully!");
  setpatientorderbautistaproductToast(true);
  setpatientorderbautistaproductToastClosing(false);

  // Reset form fields
  setorderbautistaEmail('');
  setorderbautistaprofilePicture('');
  setorderbautistafullName('');
  setorderbautistalastName('');
  setorderbautistamiddleName('');
  setorderbautistafirstName('');
  setorderbautistacontactNumber('');
  setorderbautistadownPayment('');
  setorderbautistacustomFee('');
  setorderbautistaamountPaid('');
  setorderbautistaNotes('');
  setbautistaproductsoldCount(0);
  setbautistapickupStatus('Later');
  // Reset state
  setselectedorderbautistaproduct(null);
  setshowpatientorderbautista(false);
  await fetchbautistaOrders();

} catch (error) {
  console.error('Submission error:', error);
  setpatientorderbautistaproductToastMessage(error.message);
  setpatientorderbautistaproductToast(true);
  setpatientorderbautistaproductToastClosing(false);
} finally {
  setIsSubmittingBautistaCompleteOrder(false);
}
};



//FUNCTION BUTTON FOR PENDING ORDER

//AMBHER OPTICAL ORDER PRODUCT
const submitpatientpendingorderambher = async (e) => {
e.preventDefault();
setIsSubmittingAmbherPendingOrder(true);

try {
  // Prepare order data
  const orderData = {
    // Patient Information
    patientprofilepicture: orderambherprofilePicture,
    patientfirstname: orderambherfirstName,
    patientmiddlename: orderambhermiddleName,
    patientlastname: orderambherlastName,
    patientemail: orderambherEmail,
    patientcontactnumber: orderambhercontactNumber,

    // Ordered Product Info
    patientorderambherproductid: selectedorderambherproduct?.ambherinventoryproductid,
    patientorderambherproductname: orderambherinventoryproductname,
    patientorderambherproductbrand: orderambherinventoryproductbrand,
    patientorderambherproductmodelnumber: orderambherinventoryproductmodelnumber,
    patientorderambherproductcategory: orderambherinventorycategorynamebox,
    patientorderambherproductimage: orderambherinventoryproductimagepreviewimages,
    patientorderambherproductprice: orderambherinventoryproductprice,
    patientorderambherproductquantity: ambhercount,
    patientorderambherproductsubtotal: orderambherinventoryproductprice * ambhercount,
    patientorderambherproductdescription: orderambherinventoryproductdescription,
    patientorderambherproductnotes: orderambherNotes,

    //Total
    patientorderambhercustomfee: Number(orderambhercustomFee),
    patientorderambheramountpaid: Number(orderambheramountPaid),
    patientorderambherproducttotal: orderambhertotalwithFee,
    patientorderambherremainingbalance: orderambherremainingBalance,
    patientorderambheramountpaidChange: orderambheramountpaidChange,

    //Payment
    patientorderambherproductpaymentmethod: 'Cash',
    patientorderambherproductpaymentreceiptimage: '',
    patientorderambherproductpaymentstatus: 'Partially Paid', //"Partially Paid" or "Fully Paid"
    patientorderambherproductpaymenttransactionid: '',

    //Pickup if not "Now"
    patientorderambherproductpickupstatus: ambherpickupStatus, //'Now' or 'Later'
    patientorderambherproductchosenpickupdate: 'Later',
    patientorderambherproductchosenpickuptime: 'Default',
    patientorderambherproductchosenpickupplace: orderambherpickupplace,

    //Authorized Person
    patientorderambherproducauthorizedname: adminfirstname + " " + adminmiddlename + " " + adminlastname,
    patientorderambherproducauthorizedtype: currentuserloggedin,

    // Order History
    patientorderambherstatus: 'Pending',
    patientorderambherhistory: [{
      status: 'Pending',
      changedAt: new Date(),
      changedBy: `${orderambherfirstName} ${orderambherlastName}`
    }]
  };

  console.log('Submitting order:', orderData);

  // Submit order using admin token
  const response = await fetch(`/api/patientorderambher`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
    },
    body: JSON.stringify(orderData)
  });

  // Handle response
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server response:', errorText);
    throw new Error(errorText || `Server error: ${response.status}`);
  }

  


  // Handle success
  const result = await response.json();
  console.log(result);
  setpatientorderambherproductisClicked(true);
  setpatientorderambherproductToastMessage("Pending Order Submitted Successfully!");
  setpatientorderambherproductToast(true);
  setpatientorderambherproductToastClosing(false);

  // Reset form fields
  setorderambherEmail('');
  setorderambherprofilePicture('');
  setorderambherfullName('');
  setorderambherlastName('');
  setorderambhermiddleName('');
  setorderambherfirstName('');
  setorderambhercontactNumber('');
  setorderambherdownPayment('');
  setorderambhercustomFee('');
  setorderambheramountPaid('');
  setorderambherNotes('');
  setambherproductsoldCount(0);
  setambherpickupStatus('Later');
  // Reset state
  setselectedorderambherproduct(null);
  setshowpatientorderambher(false);
  await fetchambherOrders();

} catch (error) {
  console.error('Submission error:', error);
  setpatientorderambherproductToastMessage(error.message);
  setpatientorderambherproductToast(true);
  setpatientorderambherproductToastClosing(false);
} finally {
  setIsSubmittingAmbherPendingOrder(false);
}
};

//BAUTISTA ORDER PRODUCT
const submitpatientpendingorderbautista = async (e) => {
e.preventDefault();
setIsSubmittingBautistaPendingOrder(true);

try {
  // Prepare order data
  const orderData = {
    // Patient Information
    patientprofilepicture: orderbautistaprofilePicture,
    patientfirstname: orderbautistafirstName,
    patientmiddlename: orderbautistamiddleName,
    patientlastname: orderbautistalastName,
    patientemail: orderbautistaEmail,
    patientcontactnumber: orderbautistacontactNumber,

    // Ordered Product Info
    patientorderbautistaproductid: selectedorderbautistaproduct?.bautistainventoryproductid,
    patientorderbautistaproductname: orderbautistainventoryproductname,
    patientorderbautistaproductbrand: orderbautistainventoryproductbrand,
    patientorderbautistaproductmodelnumber: orderbautistainventoryproductmodelnumber,
    patientorderbautistaproductcategory: orderbautistainventorycategorynamebox,
    patientorderbautistaproductimage: orderbautistainventoryproductimagepreviewimages,
    patientorderbautistaproductprice: orderbautistainventoryproductprice,
    patientorderbautistaproductquantity: bautistacount,
    patientorderbautistaproductsubtotal: orderbautistainventoryproductprice * bautistacount,
    patientorderbautistaproductdescription: orderbautistainventoryproductdescription,
    patientorderbautistaproductnotes: orderbautistaNotes,

    //Total
    patientorderbautistacustomfee: Number(orderbautistacustomFee),
    patientorderbautistaamountpaid: Number(orderbautistaamountPaid),
    patientorderbautistaproducttotal: orderbautistatotalwithFee,
    patientorderbautistaremainingbalance: orderbautistaremainingBalance,
    patientorderbautistaamountpaidChange: orderbautistaamountpaidChange,

    //Payment
    patientorderbautistaproductpaymentmethod: 'Cash',
    patientorderbautistaproductpaymentreceiptimage: '',
    patientorderbautistaproductpaymentstatus: 'Partially Paid', //"Partially Paid" or "Fully Paid"
    patientorderbautistaproductpaymenttransactionid: '',

    //Pickup if not "Now"
    patientorderbautistaproductpickupstatus: bautistapickupStatus, //'Now' or 'Later'
    patientorderbautistaproductchosenpickupdate: 'Later',
    patientorderbautistaproductchosenpickuptime: 'Default',
    patientorderbautistaproductchosenpickupplace: orderbautistapickupplace,

    //Authorized Person
    patientorderbautistaproducauthorizedname: adminfirstname + " " + adminmiddlename + " " + adminlastname,
    patientorderbautistaproducauthorizedtype: currentuserloggedin,

    // Order History
    patientorderbautistastatus: 'Pending',
    patientorderbautistahistory: [{
      status: 'Pending',
      changedAt: new Date(),
      changedBy: `${orderbautistafirstName} ${orderbautistalastName}`
    }]
  };

  console.log('Submitting order:', orderData);

  // Submit order using admin token
  const response = await fetch(`/api/patientorderbautista`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
    },
    body: JSON.stringify(orderData)
  });

  // Handle response
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server response:', errorText);
    throw new Error(errorText || `Server error: ${response.status}`);
  }

  


  // Handle success
  const result = await response.json();
  console.log(result);
  setpatientorderbautistaproductisClicked(true);
  setpatientorderbautistaproductToastMessage("Pending Order Submitted Successfully!");
  setpatientorderbautistaproductToast(true);
  setpatientorderbautistaproductToastClosing(false);

  // Reset form fields
  setorderbautistaEmail('');
  setorderbautistaprofilePicture('');
  setorderbautistafullName('');
  setorderbautistalastName('');
  setorderbautistamiddleName('');
  setorderbautistafirstName('');
  setorderbautistacontactNumber('');
  setorderbautistadownPayment('');
  setorderbautistacustomFee('');
  setorderbautistaamountPaid('');
  setorderbautistaNotes('');
  setbautistaproductsoldCount(0);
  setbautistapickupStatus('Later');  
  // Reset state
  setselectedorderbautistaproduct(null);
  setshowpatientorderbautista(false);
  await fetchbautistaOrders();

} catch (error) {
  console.error('Submission error:', error);
  setpatientorderbautistaproductToastMessage(error.message);
  setpatientorderbautistaproductToast(true);
  setpatientorderbautistaproductToastClosing(false);
} finally {
  setIsSubmittingBautistaPendingOrder(false);
}
};























//2DMAPPING//2DMAPPING//2DMAPPING








//2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING //2D MAPPING 
  // --- Mapbox Fullscreen Fix ---
  useEffect(() => {
    // Wait for map to be initialized
    if (!window.mapboxgl || !document.getElementById('geographicmapcontainer')) return;
    const mapContainer = document.getElementById('geographicmapcontainer');
    // Handler for fullscreenchange
    const handleFullscreenChange = () => {
      // Only use map.current.resize(), never map.current.getMap()
      if (map && map.current && typeof map.current.resize === 'function') {
        setTimeout(() => {
          map.current.resize();
          console.log('🔄 Map resized for fullscreen mode');
        }, 100);
      } else {
        // Fallback: try to find mapboxgl.Map instance from DOM
        const mapDiv = mapContainer.querySelector('.mapboxgl-map');
        if (mapDiv && mapDiv._map && typeof mapDiv._map.resize === 'function') {
          setTimeout(() => {
            mapDiv._map.resize();
            console.log('🔄 Map resized for fullscreen mode (fallback)');
          }, 100);
        }
      }
    };
    mapContainer.addEventListener('fullscreenchange', handleFullscreenChange);
    mapContainer.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    mapContainer.addEventListener('mozfullscreenchange', handleFullscreenChange);
    mapContainer.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      mapContainer.removeEventListener('fullscreenchange', handleFullscreenChange);
      mapContainer.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      mapContainer.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      mapContainer.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
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

// Initialize edit mode data attribute
useEffect(() => {
  document.body.setAttribute('data-edit-mode', 'false');
  return () => {
    document.body.removeAttribute('data-edit-mode');
  };
}, []);
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
  clinicType: 'Ambher Optical', // Will be updated when user data loads
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
const fetchClinicLocations = useCallback(async (includeInactive = false) => {
  try {
    setLoadingClinicLocations(true);
    // Use fallback URL if environment variable is not set
    const baseUrl = apiUrl || 'http://localhost:3000';
    
    // Build query parameter for including inactive clinics
    const includeParam = includeInactive ? '?includeInactive=true' : '';
    
    // Try multiple endpoints to fetch clinics
    const possibleUrls = [
      `${baseUrl}/api/cliniclocation/clinics${includeParam}`,        // Primary endpoint
      `${baseUrl}/api/cliniclocation/all-clinics${includeParam}`,    // Alternative endpoint
      `${baseUrl}/api/cliniclocation${includeParam}`                 // Fallback endpoint
    ];
    
    let response;
    let fetchUrl;
    
    // Try each URL until one works
    for (const url of possibleUrls) {
      try {
        fetchUrl = url;
        console.log('Trying to fetch clinic locations from:', fetchUrl);
        
        response = await fetch(fetchUrl, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          break; // Success, exit the loop
        } else if (response.status === 404 && url !== possibleUrls[possibleUrls.length - 1]) {
          console.log(`Endpoint ${url} not found, trying next...`);
          continue; // Try next URL
        }
      } catch (error) {
        console.log(`Error with ${url}:`, error);
        if (url === possibleUrls[possibleUrls.length - 1]) {
          throw error; // If it's the last URL, throw the error
        }
        continue; // Try next URL
      }
    }
    
    console.log('API URL from env:', apiUrl);
    console.log('Current user token exists:', !!currentusertoken);
    console.log('Final fetch URL used:', fetchUrl);

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('Received clinic data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        // Filter out inactive clinics for display unless specifically requested
        const filteredClinics = includeInactive ? data.data : data.data.filter(clinic => clinic.isActive !== false);
        console.log(`Setting clinic locations: ${filteredClinics.length} clinics (includeInactive: ${includeInactive})`);
        setClinicLocations(filteredClinics);
        setLocationMessage({ 
          text: `Loaded ${filteredClinics.length} clinic locations from database`, 
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
  // Get the current user's default clinic type
  const defaultClinicType = (() => {
    if (currentuserloggedin === "Staff") {
      return localStorage.getItem('staffclinic') || staffclinic || 'Ambher Optical';
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic || 'Ambher Optical';
    }
    return 'Ambher Optical'; // Default for admin and others
  })();
  
  console.log('🔄 Resetting clinic form with clinic type:', defaultClinicType);
  
  setClinicFormData({
    clinicName: '',
    clinicType: defaultClinicType,
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
}, [currentuserloggedin, staffclinic, ownerownedclinic]);

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
    console.log('💾 Saving clinic location with data:', {
      clinicName: clinicFormData.clinicName,
      clinicType: clinicFormData.clinicType,
      coordinates: clinicFormData.coordinates
    });
    
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
    
    // Use hard delete to permanently remove from database
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${clinicIdToDelete}?hardDelete=true`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('✅ Clinic permanently deleted from database');
      
      // Refresh the clinic locations to get updated data (fetch all remaining clinics)
      await fetchClinicLocations(true); // true = include all clinics (active and inactive)
      
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
      // Check if the click target is a marker by looking for clinic marker data attribute
      const clickTarget = e.originalEvent?.target;
      
      // If clicking on a marker, don't open add dialog
      if (clickTarget && (
        clickTarget.hasAttribute('data-clinic-marker') ||
        clickTarget.tagName === 'IMG' || 
        clickTarget.closest('.mapboxgl-marker') ||
        clickTarget.classList.contains('mapboxgl-marker')
      )) {
        console.log('🎯 Clicked on clinic marker, ignoring map click for add dialog');
        return;
      }
      
      console.log('🗺️ Clicked on empty map area, opening add dialog');
      const { lng, lat } = e.lngLat;
      
      // Ensure clinic type is set to the correct value for the current user
      const currentClinicType = getUserDefaultClinicType();
      console.log('🏥 Setting clinic type for new clinic:', currentClinicType);
      
      setClinicFormData(prev => ({
        ...prev,
        clinicType: currentClinicType,
        coordinates: { longitude: lng, latitude: lat }
      }));
      
      // Show add form dialog only when clicking on empty map areas
      setShowAddClinicDialog(true);
    }
  };

  map.current.on('click', handleMapClick);

  return () => {
    if (map.current) {
      map.current.off('click', handleMapClick);
    }
  };
}, [mapLoaded, isEditingLocation, getUserDefaultClinicType]);

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

      // If marker already exists, update it with new data instead of just reusing
      if (markersOnMap.has(clinicId)) {
        const existingMarker = markersOnMap.get(clinicId);
        // Update position if it can change
        existingMarker.setLngLat([longitude, latitude]);
        
        // Update marker styling for edit mode accessibility
        const markerElement = existingMarker.getElement();
        if (markerElement) {
          // Check if user can edit this clinic type for visual feedback
          const userDefaultClinicType = getUserDefaultClinicType();
          const isAdminUser = currentuserloggedin === 'Admin';
          const canEditThisClinic = isAdminUser || clinic.clinicType === userDefaultClinicType;
          
          markerElement.style.cssText = `
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: white;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            ${!clinic.isActive ? 'opacity: 0.6;' : ''}
            ${isEditingLocation ? (canEditThisClinic ? 'transform: scale(1.1); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);' : 'opacity: 0.5; filter: grayscale(50%); cursor: not-allowed;') : ''}
          `;
          
          // Update tooltip
          if (isEditingLocation) {
            markerElement.title = canEditThisClinic ? `Click to edit ${clinic.clinicName}` : `Cannot edit ${clinic.clinicType} clinics (Access denied)`;
          } else {
            markerElement.title = clinic.isActive ? clinic.clinicName : `${clinic.clinicName} (Inactive)`;
          }
        }
        
        // UPDATE: Recreate popup content with current clinic data to reflect status changes
        const updatedPopupContent = `
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
            <div class="flex items-center gap-2 mb-2">
              <div class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                clinic.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }">
                                <div class="w-2 h-2 rounded-full ${
                                  clinic.isActive ? 'bg-green-500' : 'bg-gray-400'
                                }"></div>
                                ${clinic.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
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

        // Update the popup content with current clinic data
        const updatedPopup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false 
        }).setHTML(updatedPopupContent);

        // Add event listener to track when this popup opens
        updatedPopup.on('open', () => {
          // Close the previously open popup if it exists
          if (currentPopup.current && currentPopup.current !== updatedPopup) {
            currentPopup.current.remove();
          }
          // Set this popup as the current one
          currentPopup.current = updatedPopup;
        });

        // Add event listener to clear reference when popup closes
        updatedPopup.on('close', () => {
          if (currentPopup.current === updatedPopup) {
            currentPopup.current = null;
          }
        });

        // Set the updated popup on the existing marker
        existingMarker.setPopup(updatedPopup);
        
        newMarkers.set(clinicId, existingMarker);
        markersOnMap.delete(clinicId); // Mark as processed
      } else {
        // Create a new marker
        const markerEl = document.createElement('img');
        markerEl.className = `w-10 h-10 rounded-full transition-all duration-200 ease-out will-change-transform transform-gpu hover:shadow-lg cursor-pointer border-2 border-white shadow-md ${isEditingLocation ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`;
        
        // Add data attribute to identify as clinic marker
        markerEl.setAttribute('data-clinic-marker', 'true');
        markerEl.setAttribute('data-clinic-id', clinicId);
        
        if (clinic.clinicType === 'Ambher Optical') {
          markerEl.src = ambherlogo;
        } else if (clinic.clinicType === 'Bautista Eye Center') {
          markerEl.src = bautistalogo;
        } else {
          // Fallback for any other clinic type, though not expected
          markerEl.src = defaultprofilepic; 
        }
        
        // Check if user can edit this clinic type for visual feedback
        const userDefaultClinicType = getUserDefaultClinicType();
        const isAdminUser = currentuserloggedin === 'Admin';
        const canEditThisClinic = isAdminUser || clinic.clinicType === userDefaultClinicType;
        
        markerEl.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          ${!clinic.isActive ? 'opacity: 0.6;' : ''}
          ${isEditingLocation ? (canEditThisClinic ? 'transform: scale(1.1); ' : 'opacity: 0.8; filter: grayscale(50%); cursor: not-allowed;') : ''}
        `;
        
        // Set tooltip based on edit mode and accessibility
        if (isEditingLocation) {
          markerEl.title = canEditThisClinic ? `Click to edit ${clinic.clinicName}` : `Cannot edit ${clinic.clinicType} clinics (Access denied)`;
        } else {
          markerEl.title = clinic.isActive ? clinic.clinicName : `${clinic.clinicName} (Inactive)`;
        }

        const popupContent = `
          <div class="bg-white p-4 w-72 sm:w-80 max-w-sm relative">
            
            <div class="flex items-center mb-3 pr-6">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mr-3">
                <img src="${clinic.clinicType === 'Ambher Optical' ? ambherlogo : bautistalogo}" class="w-10 h-10 rounded-full object-cover"/>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-bold text-lg text-[#1f1f1f] ">${clinic.clinicName}</h3>
                <span class="inline-block rounded-2xl px-2 py-1 text-[13px] font-semibold ${
                  clinic.clinicType === 'Ambher Optical' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-sky-800'
                }">
                  ${clinic.clinicType}
                </span>
              </div>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                clinic.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-600'
                              }">
                                <div class="w-2 h-2 rounded-full ${
                                  clinic.isActive ? 'bg-green-500' : 'bg-gray-400'
                                }"></div>
                                ${clinic.isActive ? 'Active' : 'Inactive'}
                              </div>
                            </div>
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

        // Add click handler for edit mode - populate form with clinic data
        markerEl.addEventListener('click', (e) => {
          // Check current edit mode state directly from DOM or a global flag
          const currentEditMode = document.body.getAttribute('data-edit-mode') === 'true';
          
          if (currentEditMode) {
            e.stopPropagation(); // Prevent map click handler from firing
            e.preventDefault(); // Prevent any default behavior
            
            // Check if user can edit this clinic type
            const userDefaultClinicType = getUserDefaultClinicType();
            const isAdminUser = currentuserloggedin === 'Admin';
            
            if (!isAdminUser && clinic.clinicType !== userDefaultClinicType) {
              console.log('🚫 Access denied: User cannot edit', clinic.clinicType, 'clinics');
              setLocationMessage({
                text: `Access denied: You can only edit ${userDefaultClinicType} clinic locations`,
                type: 'error'
              });
              return;
            }
            
            console.log('🔧 Edit mode: Clicked marker for clinic:', clinic.clinicName);
            console.log('🔧 Edit mode: Populating form with clinic data:', clinic);
            
            // Populate the form with the clicked clinic's data
            setClinicFormData({
              clinicName: clinic.clinicName || '',
              clinicType: clinic.clinicType || 'Ambher Optical',
              address: {
                street: clinic.address?.street || '',
                city: clinic.address?.city || '',
                state: clinic.address?.state || 'Bataan',
                zipCode: clinic.address?.zipCode || '',
                country: clinic.address?.country || 'Philippines',
                fullAddress: clinic.address?.fullAddress || ''
              },
              coordinates: {
                longitude: longitude,
                latitude: latitude
              },
              contactInfo: {
                phone: clinic.contactInfo?.phone || '',
                email: clinic.contactInfo?.email || '',
                website: clinic.contactInfo?.website || ''
              },
              operatingHours: clinic.operatingHours || {
                monday: { open: '09:00', close: '18:00', closed: false },
                tuesday: { open: '09:00', close: '18:00', closed: false },
                wednesday: { open: '09:00', close: '18:00', closed: false },
                thursday: { open: '09:00', close: '18:00', closed: false },
                friday: { open: '09:00', close: '18:00', closed: false },
                saturday: { open: '09:00', close: '17:00', closed: false },
                sunday: { open: '10:00', close: '16:00', closed: true }
              },
              services: clinic.services || []
            });
            
            // Set the selected clinic for editing
            setSelectedClinicLocation(clinic);
            
            // Close any open popups first
            if (currentPopup.current) {
              currentPopup.current.remove();
              currentPopup.current = null;
            }
            
            // Small delay to ensure state is set before opening dialog
            setTimeout(() => {
              // Show the EDIT dialog (not add dialog)
              setShowEditClinicDialog(true);
              console.log('✅ Opening EDIT dialog for clinic:', clinic.clinicName);
            }, 50);
          } else {
            // Normal mode - just show popup
            console.log('📍 Normal mode: Showing popup for clinic:', clinic.clinicName);
          }
        }, true); // Use capture phase to ensure it fires before map click


          
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

}, [mapLoaded, clinicLocations, userLocation, isEditingLocation, currentuserloggedin, getUserDefaultClinicType]); // Include all dependencies used in marker click handlers

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
    fetchClinicLocations(true); // true = include all clinics (active and inactive)
    getUserLocation();
  }
}, [activedashboard, fetchClinicLocations, getUserLocation]);

// Load clinic locations automatically for staff/owner users after login
useEffect(() => {
  if (userDataLoaded && (currentuserloggedin === "Staff" || currentuserloggedin === "Owner")) {
    console.log('Auto-loading clinic locations for', currentuserloggedin, 'user after login...');
    
    const loadClinicLocationsOnLogin = async () => {
      try {
        await fetchClinicLocations(true); // true = include all clinics (active and inactive)
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

// Update clinic form data clinic type when user data is loaded
useEffect(() => {
  if (userDataLoaded && (currentuserloggedin === 'Staff' || currentuserloggedin === 'Owner')) {
    const correctClinicType = (() => {
      if (currentuserloggedin === "Staff") {
        return localStorage.getItem('staffclinic') || staffclinic || 'Ambher Optical';
      } else if (currentuserloggedin === "Owner") {
        return ownerownedclinic || 'Ambher Optical';
      }
      return 'Ambher Optical';
    })();
    
    console.log('🏥 Updating clinic form data with correct clinic type:', correctClinicType);
    
    setClinicFormData(prev => ({
      ...prev,
      clinicType: correctClinicType
    }));
  }
}, [userDataLoaded, currentuserloggedin, staffclinic, ownerownedclinic]);



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






  useEffect(() => {
  const mapContainer = document.getElementById('geographicmapcontainer');
  const handleFullscreenChange = () => {
    // If not in fullscreen, reset styles and force map resize
    const isFullscreen = document.fullscreenElement === mapContainer ||
      document.webkitFullscreenElement === mapContainer ||
      document.mozFullScreenElement === mapContainer;
    if (!isFullscreen && mapContainer) {
      mapContainer.style.width = '';
      mapContainer.style.height = '';
      mapContainer.style.position = '';
      mapContainer.style.zIndex = '';
      // If using Mapbox GL JS, force map resize
      if (window.geographicMap && typeof window.geographicMap.resize === 'function') {
        window.geographicMap.resize();
      }
    }
  };
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  };
}, []);































































































































































































































































































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






{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 

{ (activedashboard === 'accountmanagement' || isAdminRole) && ( <div id="accountmanagement" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   

  <div className="flex items-center"><i className="bx bxs-user-account text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Account Management</h1></div>
  <div className={`flex ${isAdminRole ? 'justify-start' : 'justify-between'} items-center mt-3 h-[60px] ${isAdminRole ? 'gap-4' : ''}`}>
    {/* Hide Patient and Staff tabs for admin users */}
    {!isAdminRole && (
      <>
        <div onClick={() => showaccounttable('patientaccounttable')}  className={`cursor-pointer hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeaccounttable ==='patientaccounttable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeaccounttable ==='patientaccounttable' ? 'text-white' : ''}`}>Patients</h1></div>
        <div onClick={() => showaccounttable('staffaccounttable')}  className={`cursor-pointer hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeaccounttable ==='staffaccounttable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {` font-albertsans font-semibold text-[#5d5d5d] ${activeaccounttable ==='staffaccounttable' ? 'text-white' : ''}`}>Staff</h1></div>
      </>
    )}
    <div onClick={() => showaccounttable('owneraccounttable')}  className={`cursor-pointer hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeaccounttable ==='owneraccounttable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeaccounttable ==='owneraccounttable' ? 'text-white' : ''}`}>Owner</h1></div>
    <div onClick={() => showaccounttable('administratoraccounttable')}  className={`cursor-pointer hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeaccounttable ==='administratoraccounttable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeaccounttable ==='administratoraccounttable' ? 'text-white' : ''}`}>Administrator</h1></div>
   </div>


{/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} {/*Patient Account Table*/} 
   { (activeaccounttable === 'patientaccounttable' && !isAdminRole) && ( <div id="patientaccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

        <div className=" mt-5  w-full h-[60px] flex justify-between gap-10 rounded-3xl pl-5 pr-5">              
        <div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter patient name..." value={searchpatients} onChange={(e) => {setsearchpatients(e.target.value); filterpatientaccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
        <div onClick={() => setshowaddpatientdialog(true)}  className="w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Patient</p></div>
        </div>

        <div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
         {renderpatientaccounts()}
        </div>

        
        {/*Add Patient Dialog*/}
           {showaddpatientdialog && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Patient Account</h1></div>
                    <div onClick={() => {setshowaddpatientdialog(false),   setmessage('') }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>

            <form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={handlesubmit}>
                  <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
                    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
                      <div className=" w-fit h-fit">
                        <img className=" object-cover h-90  w-90 rounded-full" src={previewimage || defaultprofilepic}/>
                      
                        <input  className="hidden" type="file" onChange={handleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={imageinputref} />
                        <div onClick={handleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                              
                        {selectedprofile && (<div onClick={handleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
                        </div>
                    </div>

                    <div className="w-full h-full  rounded-2xl">
                          <div className=" w-full h-full rounded-4xl">
                    
                    

                          <div className="registration-container">
                       
                          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
                          {message.text && (
                            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
                              {message.text}
                            </div>
                          )}
                    
                          <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create patient account!</h1>
                    
                    
                    
                    
                          <div className="form-group mt-10  flex">
                          <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
                          <div className="flex flex-col">
                          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="patientemail" id="patientemail" value={formdata.patientemail} onChange={handlechange} required/>
                          {checkemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
                          {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
                          {emailerror && emailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                       
                          </div>
                          </div>
                    
                    
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="passwrd">Password : </label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="patientpassword" id="patientpassword" value={formdata.patientpassword} onChange={handlechange} required min="6"/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="lastname">Last Name :</label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="patientlastname" id="patientlastname" value={formdata.patientlastname} onChange={handlechange} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="firstname">First Name :</label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="patientfirstname" id="patientfirstname" value={formdata.patientfirstname} onChange={handlechange} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="middlename">Middle Name :</label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="patientmiddlename" id="patientmiddlename" value={formdata.patientmiddlename} onChange={handlechange} required/></div>
                          
                    
                         
                       
                          <button type="submit" disabled={issubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
                            {issubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </button>
                       

                    
                    
                          </div>
                  
                    
                    
                          </div>

                    </div>
                  </div>
                  </form>
             </div>
           </div>
        )}






        {showdeletepatientdialog && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
             <form className="flex flex-col  w-full h-fit " onSubmit={handlesubmit}>

                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Patient Account</h1></div>
                <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this patient account?</p>
                    {selectedpatientaccount && ( <>
                              <p className="text-[16px] mt-3">Patient Id: {selectedpatientaccount.id}</p>
                              <p className="text-[16px]">Patient Name: {selectedpatientaccount.name}</p> </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeletepatientdialog(false); setselectedpatientaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
                        isdeletingpatient 
                          ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
                          : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
                      }`} onClick={isdeletingpatient ? undefined : deletepatientaccount}>
                        <p className="text-[#ffffff] flex items-center">
                          {isdeletingpatient ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </p>
                      </div>
                    </div>
                </div>

             </form>
             </div>
           </div>
        )}




         {showviewpatientdialog && (
            <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
              <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
                   <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                     <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Patient Account</h1></div>
                     <div onClick={() => {setshowviewpatientdialog(false);
                                          setselectededitpatientaccount(null);
                                          setformdata({
                                            role: 'Patient',
                                            patientemail: '',

                                            patientlastname: '',
                                            patientfirstname: '',
                                            patientmiddlename: '',
                                            patientprofilepicture: ''
                                          });
                                          setpreviewimage(null);
                     }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                   </div>

              <form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={updatepatientaccount}>
                   <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
                      <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
                        <div className=" w-fit h-fit">
                         <img className=" object-cover h-90  w-90 rounded-full" src={previewimage || defaultprofilepic}/>
                        
                          <input  className="hidden" type="file" onChange={handleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={imageinputref} />
                          <div onClick={handleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                                                 
                          {selectedprofile && (<div onClick={handleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
                         </div>
                     </div>
     
                      <div className="w-full h-full  rounded-2xl">
                            <div className=" w-full h-full rounded-4xl">
                                       
                                       
                   
                            <div className="registration-container">
                        
                            <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
                            {message.text && (
                              <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
                                {message.text}
                              </div>
                            )}
                                       
                           <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                                       
                                       
                                       
                                       
                           <div className="form-group mt-10  flex">
                           <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
                            <div className="flex flex-col">
                            <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="patientemail" id="patientemail" value={formdata.patientemail} onChange={handlechange} required/>
                                {checkemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
                                {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
                                 {emailerror && emailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                                          
                           </div>
                            </div>
                                       
                                       
 
                           <div className="form-group mt-5">
                           <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="lastname">Last Name :</label>
                           <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="patientlastname" id="patientlastname" value={formdata.patientlastname} onChange={handlechange} required/></div>
                                       
                           <div className="form-group mt-5">
                           <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="firstname">First Name :</label>
                           <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="patientfirstname" id="patientfirstname" value={formdata.patientfirstname} onChange={handlechange} required/></div>
                                       
                           <div className="form-group mt-5">
                           <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="middlename">Middle Name :</label>
                           <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="patientmiddlename" id="patientmiddlename" value={formdata.patientmiddlename} onChange={handlechange} required/></div>
                                             
                                       
                                            
                                          
                           <button type="submit" disabled={issubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
                             {issubmitting ? (
                               <>
                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                 Saving...
                               </>
                             ) : (
                               "Save"
                             )}
                           </button> 
                                          
     
                                       
                                       
                           </div>
                                     
                                       
                                       
                            </div>

                      </div>
                   </div>
                    </form>
              </div>
            </div>
        )}

   </div> )}



{/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/}              
   { (activeaccounttable === 'staffaccounttable' && !isAdminRole) && ( <div id="staffaccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter staff name..." value={searchstaffs} onChange={(e) => {setsearchstaffs(e.target.value); filterstaffaccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
{currentuserloggedin !== "Staff" && (
<div onClick={() => setshowaddstaffdialog(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Staff</p></div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderstaffaccounts()}
</div>


{/*Add staff Dialog*/}
{showaddstaffdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add staff Account</h1></div>
  <div onClick={() => setshowaddstaffdialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={staffhandlesubmit}>
<div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
  <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
    <div className=" w-fit h-fit">
      <img className=" object-cover h-90  w-90 rounded-full" src={staffpreviewimage || defaultprofilepic}/>
    
      <input  className="hidden" type="file" onChange={staffhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={staffimageinputref} />
      <div onClick={staffhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                            
      {staffselectedprofile && (<div onClick={staffhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
      </div>
  </div>

  <div className="w-full h-full  rounded-2xl">
        <div className=" w-full h-full rounded-4xl">
   
  

        <div className="registration-container">
     
        <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
        {staffmessage.text && (
          <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
            {staffmessage.text}
          </div>
        )}
  
        <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create staff account!</h1>
  
  
  
  
        <div className="form-group mt-10  flex">
        <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffemail">Email :</label>
        <div className="flex flex-col">
        <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="staffemail" id="staffemail" value={staffformdata.staffemail} onChange={staffhandlechange} required/>
        {staffcheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
        {staffemailerror && !staffemailexist && !staffemailcharacters.test(staffformdata.staffemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
        {staffemailerror && staffemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
     
        </div>
        </div>
  
  
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffpassword">Password : </label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="staffpassword" id="staffpassword" value={staffformdata.staffpassword} onChange={staffhandlechange} required min="6"/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafflastname">Last Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="stafflastname" id="stafflastname" value={staffformdata.stafflastname} onChange={staffhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafffirstname">First Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="stafffirstname" id="stafffirstname" value={staffformdata.stafffirstname} onChange={staffhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffmiddlename">Middle Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="staffmiddlename" id="staffmiddlename" value={staffformdata.staffmiddlename} onChange={staffhandlechange} required/></div>
        
        <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffclinic">Eye Specialist:</label>
        <div className="ml-4"><StaffeyespecialistYesorNoBox value={staffformdata.staffiseyespecialist} onChange={staffhandlechange} /></div>
        </div>
       
     
        <button type="submit" disabled={staffissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
          {staffissubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
     

  
  
        </div>

  
  
        </div>

  </div>
</div>
</form>
</div>
</div>
)}


{showdeletestaffdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

<div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
<form className="flex flex-col  w-full h-fit " onSubmit={staffhandlesubmit}>

<div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#cfcfcf]">Delete Staff Account</h1></div>
<div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this staff account?</p>
  {selectedstaffaccount && ( <>
            <p className="text-[16px] mt-3">Staff Id: {selectedstaffaccount.id}</p>
            <p className="text-[16px]">Staff Name: {selectedstaffaccount.name}</p> </>)}  
  </div>        
  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeletestaffdialog(false); setselectedstaffaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
    <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
      isdeletingstaff 
        ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
        : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
    }`} onClick={isdeletingstaff ? undefined : deletestaffaccount}>
      <p className="text-[#ffffff] flex items-center">
        {isdeletingstaff ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </p>
    </div>
  </div>
</div>

</form>
</div>
</div>
)}




{showviewstaffdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
   <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Staff Account</h1></div>
   <div onClick={() => {setshowviewstaffdialog(false);
                        setselectededitstaffaccount(null);
                        setstaffformdata({
                          role: 'staff',
                          staffemail: '',
                          stafflastname: '',
                          stafffirstname: '',
                          staffmiddlename: '',
                          staffiseyespecialist:'',
                          staffprofilepicture: ''
                        });
                        setstaffpreviewimage(null);
   }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
 </div>

<form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={updatestaffaccount}>
 <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
      <div className=" w-fit h-fit">
       <img className=" object-cover h-90  w-90 rounded-full" src={staffpreviewimage || defaultprofilepic}/>
      
        <input  className="hidden" type="file" onChange={staffhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={staffimageinputref} />
        <div onClick={staffhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                               
        {selectedprofile && (<div onClick={staffhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
       </div>
   </div>

    <div className="w-full h-full  rounded-2xl">
          <div className=" w-full h-full rounded-4xl">
                     
                     
 
          <div className="registration-container">
      
          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
          {staffmessage.text && (
            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
              {staffmessage.text}
            </div>
          )}
                     
         <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                     
                     
                     
                     
         <div className="form-group mt-10  flex">
         <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
          <div className="flex flex-col">
          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="staffemail" id="staffemail" value={staffformdata.staffemail} onChange={staffhandlechange} required/>
         {staffcheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
         {staffemailerror && !staffemailexist && !staffemailcharacters.test(staffformdata.staffemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
          {staffemailerror && staffemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                        
         </div>
          </div>
                     
                     
    

         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafflastname">Last Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="stafflastname" id="stafflastname" value={staffformdata.stafflastname} onChange={staffhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafffirstname">First Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="stafffirstname" id="stafffirstname" value={staffformdata.stafffirstname} onChange={staffhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffmiddlename">Middle Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="staffmiddlename" id="staffmiddlename" value={staffformdata.staffmiddlename} onChange={staffhandlechange} required/></div>
                           
                     
         <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffclinic">Eye Specialist:</label>
        <div className="ml-4"><StaffeyespecialistYesorNoBox value={staffformdata.staffiseyespecialist} onChange={staffhandlechange} /></div>
        </div>
                        
         <button type="submit" disabled={staffissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {staffissubmitting ? (
             <>
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
               Saving...
             </>
           ) : (
             "Save"
           )}
         </button>
                        

                     
                     
         </div>
                   
                     
                     
          </div>

    </div>
 </div>
  </form>
</div>
</div>
)}

   </div> )}



{/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/}
   { activeaccounttable === 'owneraccounttable' && ( <div id="owneraccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter owner name..." value={searchowners} onChange={(e) => {setsearchowners(e.target.value); filterowneraccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
{currentuserloggedin !== "Staff" && (
<div onClick={() => setshowaddownerdialog(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Owner</p></div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderowneraccounts()}
</div>


{/*Add owner Dialog*/}
{showaddownerdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Owner Account</h1></div>
  <div onClick={() => setshowaddownerdialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form className="flex flex-col  ml-15 mr-15   w-fullx" onSubmit={ownerhandlesubmit}>
<div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
  <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
    <div className=" w-fit h-fit">
      <img className=" object-cover h-90  w-90 rounded-full" src={ownerpreviewimage || defaultprofilepic}/>
    
      <input  className="hidden" type="file" onChange={ownerhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={ownerimageinputref} />
      <div onClick={ownerhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                            
      {ownerselectedprofile && (<div onClick={ownerhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
      </div>
  </div>

  <div className="w-full h-full  rounded-2xl">
        <div className=" w-full h-full rounded-4xl">
   
  

        <div className=" registration-container">
     
        <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
        {ownermessage.text && (
          <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
            {ownermessage.text}
          </div>
        )}
  
        <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create owner account!</h1>
  
  
  
  
        <div className="form-group mt-10  flex">
        <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="owneremail">Email :</label>
        <div className="flex flex-col">
        <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="owneremail" id="owneremail" value={ownerformdata.owneremail} onChange={ownerhandlechange} required/>
        {ownercheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
        {owneremailerror && !owneremailexist && !owneremailcharacters.test(ownerformdata.owneremail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
        {owneremailerror && owneremailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
     
        </div>
        </div>
  
  
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerpassword">Password : </label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="ownerpassword" id="ownerpassword" value={ownerformdata.ownerpassword} onChange={ownerhandlechange} required min="6"/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerlastname">Last Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="ownerlastname" id="ownerlastname" value={ownerformdata.ownerlastname} onChange={ownerhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerfirstname">First Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="ownerfirstname" id="ownerfirstname" value={ownerformdata.ownerfirstname} onChange={ownerhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownermiddlename">Middle Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="ownermiddlename" id="ownermiddlename" value={ownerformdata.ownermiddlename} onChange={ownerhandlechange} required/></div>
        
         <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Clinic :</label>
        <div className="ml-22"><OwnerClinicBox value={ownerformdata.ownerclinic} onChange={ownerhandlechange} /></div>   
        </div>
     

        <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Eye Specialist:</label>
        <div className="ml-4"><OwnereyespecialistYesorNoBox value={ownerformdata.owneriseyespecialist} onChange={ownerhandlechange} /></div>
        </div>
        

       
     
        <button type="submit" disabled={ownerissubmitting} className="submit-btn mt-6 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
          {ownerissubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
     

  
  
        </div>

  
  
        </div>

  </div>
</div>
</form>
</div>
</div>
)}


{showdeleteownerdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

<div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
<form className="flex flex-col  w-full h-fit " onSubmit={ownerhandlesubmit}>

<div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#cfcfcf]">Delete owner Account</h1></div>
<div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this owner account?</p>
  {selectedowneraccount && ( <>
            <p className="text-[16px] mt-3">Owner Id: {selectedowneraccount.id}</p>
            <p className="text-[16px]">Owner Name: {selectedowneraccount.name}</p> </>)}  
  </div>        
  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteownerdialog(false); setselectedowneraccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
    <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
      isdeletingowner 
        ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
        : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
    }`} onClick={isdeletingowner ? undefined : deleteowneraccount}>
      <p className="text-[#ffffff] flex items-center">
        {isdeletingowner ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </p>
    </div>
  </div>
</div>

</form>
</div>
</div>
)}




{showviewownerdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
   <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Owner Account</h1></div>
   <div onClick={() => {setshowviewownerdialog(false);
                        setselectededitowneraccount(null);
                        setownerformdata({
                          role: 'Owner',
                          owneremail: '',
                          ownerlastname: '',
                          ownerfirstname: '',
                          ownermiddlename: '',
                          ownerclinic: '',
                          ownerprofilepicture: ''
                        });
                        setownerpreviewimage(null);
   }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
 </div>

<form className="flex flex-col  ml-15 mr-15  w-fullx" onSubmit={updateowneraccount}>
 <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
      <div className=" w-fit h-fit">
       <img className=" object-cover h-90  w-90 rounded-full" src={ownerpreviewimage || defaultprofilepic}/>
      
        <input  className="hidden" type="file" onChange={ownerhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={ownerimageinputref} />
        <div onClick={ownerhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                               
        {selectedprofile && (<div onClick={ownerhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
       </div>
   </div>

    <div className="w-full h-full  rounded-2xl">
          <div className=" w-full h-full rounded-4xl">
                     
                     
 
          <div className="registration-container">
      
          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
          {ownermessage.text && (
            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
              {ownermessage.text}
            </div>
          )}
                     
         <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                     
                     
                     
                     
         <div className="form-group mt-10  flex">
         <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
          <div className="flex flex-col">
          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="owneremail" id="owneremail" value={ownerformdata.owneremail} onChange={ownerhandlechange} required/>
         {ownercheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
         {owneremailerror && !owneremailexist && !owneremailcharacters.test(ownerformdata.owneremail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
          {owneremailerror && owneremailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                        
         </div>
          </div>
                     
                     

         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerlastname">Last Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="ownerlastname" id="ownerlastname" value={ownerformdata.ownerlastname} onChange={ownerhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerfirstname">First Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="ownerfirstname" id="ownerfirstname" value={ownerformdata.ownerfirstname} onChange={ownerhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownermiddlename">Middle Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="ownermiddlename" id="ownermiddlename" value={ownerformdata.ownermiddlename} onChange={ownerhandlechange} required/></div>
                           
         <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Clinic :</label>
        <div className="ml-22"><OwnerClinicBox value={ownerformdata.ownerclinic} onChange={ownerhandlechange} /></div>   
        </div>
     

        <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Eye Specialist:</label>
        <div className="ml-4"><OwnereyespecialistYesorNoBox value={ownerformdata.owneriseyespecialist} onChange={ownerhandlechange} /></div>
        </div>        
                          
                    
         <button type="submit" disabled={ownerissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {ownerissubmitting ? (
             <>
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
               Saving...
             </>
           ) : (
             "Save"
           )}
         </button>
                        

                     
                     
         </div>
                   
                     
                     
          </div>

    </div>
 </div>
  </form>
</div>
</div>
)}

   </div> )}




{/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/}
   { activeaccounttable === 'administratoraccounttable' && ( <div id="administratoraccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter admin name..." value={searchadmins} onChange={(e) => {setsearchadmins(e.target.value); filteradminaccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
{currentuserloggedin !== "Staff" && (
<div onClick={() => setshowaddadmindialog(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Admin</p></div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderadminaccounts()}
</div>


{/*Add admin Dialog*/}
{showaddadmindialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Admin Account</h1></div>
  <div onClick={() => setshowaddadmindialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form className="flex flex-col  ml-15 mr-15   w-fullx" onSubmit={adminhandlesubmit}>
<div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
  <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
    <div className=" w-fit h-fit">
      <img className=" object-cover h-90  w-90 rounded-full" src={adminpreviewimage || defaultprofilepic}/>
    
      <input  className="hidden" type="file" onChange={adminhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={adminimageinputref} />
      <div onClick={adminhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                            
      {adminselectedprofile && (<div onClick={adminhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
      </div>
  </div>

  <div className="w-full h-full  rounded-2xl">
        <div className=" w-full h-full rounded-4xl">
   
  

        <div className=" registration-container">
     
        <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
        {adminmessage.text && (
          <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
            {adminmessage.text}
          </div>
        )}
  
        <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create admin account!</h1>
  
  
  
  
        <div className="form-group mt-10  flex">
        <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminemail">Email :</label>
        <div className="flex flex-col">
        <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="adminemail" id="adminemail" value={adminformdata.adminemail} onChange={adminhandlechange} required/>
        {admincheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
        {adminemailerror && !adminemailexist && !adminemailcharacters.test(adminformdata.adminemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
        {adminemailerror && adminemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
     
        </div>
        </div>
  
  
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminpassword">Password : </label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="adminpassword" id="adminpassword" value={adminformdata.adminpassword} onChange={adminhandlechange} required min="6"/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminlastname">Last Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="adminlastname" id="adminlastname" value={adminformdata.adminlastname} onChange={adminhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminfirstname">First Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="adminfirstname" id="adminfirstname" value={adminformdata.adminfirstname} onChange={adminhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminmiddlename">Middle Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="adminmiddlename" id="adminmiddlename" value={adminformdata.adminmiddlename} onChange={adminhandlechange} required/></div>
        

       
     
        <button type="submit" disabled={adminissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
          {adminissubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
     

  
  
        </div>

  
  
        </div>

  </div>
</div>
</form>
</div>
</div>
)}


{showdeleteadmindialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

<div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
<form className="flex flex-col  w-full h-fit " onSubmit={adminhandlesubmit}>

<div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#cfcfcf]">Delete Admin Account</h1></div>
<div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this admin account?</p>
  {selectedadminaccount && ( <>
            <p className="text-[16px] mt-3">Admin Id: {selectedadminaccount.id}</p>
            <p className="text-[16px]">Admin Name: {selectedadminaccount.name}</p> </>)}  
  </div>        
  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteadmindialog(false); setselectedadminaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
    <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
      isdeletingadmin 
        ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
        : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
    }`} onClick={isdeletingadmin ? undefined : deleteadminaccount}>
      <p className="text-[#ffffff] flex items-center">
        {isdeletingadmin ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </p>
    </div>
  </div>
</div>

</form>
</div>
</div>
)}




{showviewadmindialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
   <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Admin Account</h1></div>
   <div onClick={() => {setshowviewadmindialog(false);
                        setselectededitadminaccount(null);
                        setadminformdata({
                          role: 'Admin',
                          adminemail: '',
                          adminlastname: '',
                          adminfirstname: '',
                          adminmiddlename: '',
                          adminprofilepicture: ''
                        });
                        setadminpreviewimage(null);
   }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
 </div>

<form className="flex flex-col  ml-15 mr-15  w-fullx" onSubmit={updateadminaccount}>
 <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
      <div className=" w-fit h-fit">
       <img className=" object-cover h-90  w-90 rounded-full" src={adminpreviewimage || defaultprofilepic}/>
      
        <input  className="hidden" type="file" onChange={adminhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={adminimageinputref} />
        <div onClick={adminhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                               
        {selectedprofile && (<div onClick={adminhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
       </div>
   </div>

    <div className="w-full h-full  rounded-2xl">
          <div className=" w-full h-full rounded-4xl">
                     
                     
 
          <div className="registration-container">
      
          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
          {adminmessage.text && (
            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
              {adminmessage.text}
            </div>
          )}
                     
         <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                     
                     
                     
                     
         <div className="form-group mt-10  flex">
         <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
          <div className="flex flex-col">
          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="adminemail" id="adminemail" value={adminformdata.adminemail} onChange={adminhandlechange} required/>
         {admincheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
         {adminemailerror && !adminemailexist && !adminemailcharacters.test(adminformdata.adminemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
          {adminemailerror && adminemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                        
         </div>
          </div>
                     
                     
    

         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminlastname">Last Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="adminlastname" id="adminlastname" value={adminformdata.adminlastname} onChange={adminhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminfirstname">First Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="adminfirstname" id="adminfirstname" value={adminformdata.adminfirstname} onChange={adminhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminmiddlename">Middle Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="adminmiddlename" id="adminmiddlename" value={adminformdata.adminmiddlename} onChange={adminhandlechange} required/></div>
                                      
                          
                    
         <button type="submit" disabled={adminissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {adminissubmitting ? (
             <>
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
               Saving...
             </>
           ) : (
             "Save"
           )}
         </button>
                        

                     
                     
         </div>
                   
                     
                     
          </div>

    </div>
 </div>
  </form>
</div>
</div>
)}

   </div> )}


</div> )}

{/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} 
{/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} 
{/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} 
{/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} 
{/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} {/*End of Account Management*/} 



{/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} 
{/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} 
{/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} 
{/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} 
{/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} {/*Profile Information*/} 

{ (activedashboard === 'profileinformation' && !isAdminRole) && ( <div id="profileinformation" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   


<div className="flex items-center"><i className="bx bxs-user-detail text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Profile Information</h1></div>
<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showprofiletable('patientprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='patientprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='patientprofiletable' ? 'text-white' : ''}`}>Patients</h1></div>
<div onClick={() => showprofiletable('staffprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='staffprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='staffprofiletable' ? 'text-white' : ''}`}>Staff</h1></div>
<div onClick={() => showprofiletable('ownerprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='ownerprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='ownerprofiletable' ? 'text-white' : ''}`}>Owner</h1></div>
<div onClick={() => showprofiletable('administratorprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='administratorprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='administratorprofiletable' ? 'text-white' : ''}`}>Administrator</h1></div>
</div>




{/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} 
{ activeprofiletable === 'patientprofiletable' && ( <div id="patientprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter patient name..." value={searchPatientProfiles} onChange={(e) => {setSearchPatientProfiles(e.target.value); filterPatientProfiles(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
<div onClick={() => setshowaddpatientprofile(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Patient Profile</p></div>
</div>

<div className=" rounded-3xl min-h-[85%] h-auto pb-5 w-full mt-2 bg-[#f7f7f7]">
{renderpatientprofiles()}
</div>





{showpatientpofile && (
<div id="patientdemographicprofileform" className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[780px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Patient Profile</h1></div>
  <div onClick={() => {setshowpatientpofile(false); resetpatientprofileformdata();}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={retrieveandupdatepatientprofile}>
           
           <div className="ml-25 mt-5 flex ">


           <div className=" w-60 h-60 ml-10">
             <img className=" object-cover h-60 w-full rounded-full" src={previewimage || defaultprofilepic}/>

             <input  className="hidden" type="file" onChange={handleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={imageinputref} />
             <div onClick={handleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
             
             {selectedprofile && (<div onClick={handleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
           </div>

           <div className=" ml-15">

            

            <div className=" h-fit form-group  ">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientlastname">Last Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientlastname} onChange={(e) => setdemoformdata({...demoformdata, patientlastname: e.target.value})} type="text" name="patientlastname" id="patientlastname" placeholder="Patient Last Name..."/></div>

             <div className=" h-fit form-group  mt-5">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientfirstname">First Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientfirstname} onChange={(e) => setdemoformdata({...demoformdata, patientfirstname: e.target.value})}  type="text" name="patientfirstname" id="patientfirstname" placeholder="Patient First Name..."/></div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientmiddlename">Middle Name :</label>     
             <input className="w-112 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientmiddlename} onChange={(e) => setdemoformdata({...demoformdata, patientmiddlename: e.target.value})}  type="text" name="patientmiddlename" id="patientmiddlename" placeholder="Patient Middle Name.."/></div>



             <div className=" mt-5 flex items-center">
            <div className="">
                   
                 <div className=" h-fit form-group">
                <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientbirthdate">Birthdate :</label>     
                <input className="w-38 justify-center border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"      value={demoformdata.patientbirthdate} 
                                 onChange={(e) => {
                                   const newpatientBirthdate = e.target.value;
                                   setdemoformdata({
                                     ...demoformdata, 
                                     patientbirthdate: newpatientBirthdate,
                                     patientage: calculateAge(newpatientBirthdate)
                                   });
                                 }}  
                                 type="date" 
                                 name="patientbirthdate" 
                                 id="patientbirthdate" 
                                 placeholder=""
                                 max={new Date().toISOString().split('T')[0]}/> </div>
                             

                 </div>
             <div className="">

             <div className=" h-fit form-group ml-15">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientage">Age :</label>     
             <input className="w-32 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  readOnly value={demoformdata.patientage} onChange={(e) => setdemoformdata({...demoformdata, patientage: e.target.value})} type="number" name="patientage" id="patientage" placeholder="Age..."/></div>

                 </div>




             </div>




             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientgender">Gender :</label>     
             <div className="ml-3"><GenderBoxAdminDash value={demoformdata.patientgender} onChange={(e) => setdemoformdata({...demoformdata, patientgender: e.target.value})} /></div>  </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientcontactnumber">Contact Number :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientcontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientcontactnumber: e.target.value})} type="text" name="patientcontactnumber" id="patientcontactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patienthomeaddress">Home Address :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"   value={demoformdata.patienthomeaddress} onChange={(e) => setdemoformdata({...demoformdata, patienthomeaddress: e.target.value})}  type="text" name="patienthomeaddress" id="patienthomeaddress" placeholder="Ex: #001 Sison St., Townsite, Limay, Bataan"/> </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactname">Emergency Contact Name :</label>     
             <input className="w-90 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientemergencycontactname} onChange={(e) => setdemoformdata({...demoformdata,patientemergencycontactname: e.target.value})}  type="text" name="patientemergencycontactname" id="patientemergencycontactname" placeholder="Ex: Juan Dela Cruz"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactnumber">Emergency Contact Number :</label>     
             <input className="w-84 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold" value={demoformdata.patientemergencycontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientemergencycontactnumber: e.target.value})}  type="text" name="patientemergencycontactnumber" id="patientemergencyconctactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>



           <div className=" mt-10">

           <button type="submit" disabled={issubmitting} className={`submit-btn mt-12 w-full flex justify-center items-center ${issubmitting? "opacity-75 cursor-not-allowed" : "" }`} style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
              Save Changes
           </button>

             </div>



             <div onClick={() =>  {
  setshowdeletepatientprofiledialog(true);
  }}

 className="bg-[#8c3226] hover:bg-[#ab4f43] mt-4 h-[50px]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 hover:cursor-pointer rounded-[20px]"><h1 className="text-white font-albertsans font-semibold text-[20px]">Delete</h1></div>




{showdeletepatientprofiledialog && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">


                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Patient Profile</h1></div>
                <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this patient profile?</p>
                    {selectedpatientprofile && ( <>
                             <p className="text-[16px]">Patient Name: {selectedpatientprofile.name}</p>
                              <p className="text-[16px] mt-3">Patient Email: {selectedpatientprofile.email}</p>
                               </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeletepatientprofiledialog(false); setselectedpatientprofile(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={deletepatientprofile}><p className=" text-[#ffffff]">Delete</p></div>
                    </div>
                </div>

             </div>
           </div>
        )}
       

          </div>
             

           </div>
         

          </form>
</div>
</div>)}





{showaddpatientpofile && (
<div id="patientdemographicprofileform" className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[780px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Patient Profile</h1></div>
  <div onClick={() =>{setshowaddpatientprofile(false); resetpatientprofileformdata();}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={addpatientprofile}>
           
           <div className="ml-25 mt-5 flex ">


           <div className=" w-60 h-60 ml-10">
             <img className=" object-cover h-60 w-full rounded-full" src={addpatientprofilepreviewimage || defaultprofilepic}/>

             <input  className="hidden" type="file" onChange={addpatientprofilehandlechange} accept="image/jpeg, image/jpg, image/png" ref={addpatientprofileimageinputref} />
             <div onClick={addpatientprofilehandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
             
             {selectedpatientprofile && (<div onClick={addpatientprofilehandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
           </div>

           <div className=" ml-15">


           <div className="form-group flex mb-3">
               <label className="text-[23px] font-bold text-[#2d2d44]"  htmlFor="patientemail">Patient Email :</label>
               <div className="flex flex-col">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" onChange={(e) => setdemoformdata({...demoformdata, patientemail: e.target.value.trim()})} value={demoformdata.patientemail} id="patientemail" name="patientemail" required type="email" placeholder="Patient Email"/>
               <div>
                       {demopatientcheckemail && (
                        <p className="text-gray-500 text-sm">Checking Email...</p>
                       )}



                       {!demopatientcheckemail && (
                        <>

                        {demopatientemailerror && !demopatientemailexist && (
                             <p className="text-red-500 text-sm">
                              Please enter a valid email address
                             </p>
                           )}
              

                        {demopatientemailexist && (
                             <p className="text-red-500 text-sm">
                                A patient profile already exists with this email
                             </p>
                            )}

              
                        {emailisnotpatienterror && (
                              <p className="text-red-500 text-sm">
                                 This email belongs to a staff/admin account and cannot be used for patient profiles
                              </p>
                             )}
                        </>
                       )}

               </div>
                </div>
              
                </div>


            <div className=" h-fit form-group  ">
             <label className="text-[23px]  font-bold  text-[#2d2d44]" htmlFor="patientlastname">Last Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientlastname} onChange={(e) => setdemoformdata({...demoformdata, patientlastname: e.target.value})} type="text" name="patientlastname" id="patientlastname" placeholder="Patient Last Name..."/></div>

             <div className=" h-fit form-group  mt-5">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientfirstname">First Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientfirstname} onChange={(e) => setdemoformdata({...demoformdata, patientfirstname: e.target.value})}  type="text" name="patientfirstname" id="patientfirstname" placeholder="Patient First Name..."/></div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientmiddlename">Middle Name :</label>     
             <input className="w-112 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientmiddlename} onChange={(e) => setdemoformdata({...demoformdata, patientmiddlename: e.target.value})}  type="text" name="patientmiddlename" id="patientmiddlename" placeholder="Patient Middle Name.."/></div>



             <div className=" mt-5 flex items-center">
               <div className="">
                   
                 <div className=" h-fit form-group ">
                <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientbirthdate">Birthdate :</label>     
                <input className="w-38 justify-center border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientbirthdate}     onChange={(e) => {
const newBirthdate = e.target.value;
setdemoformdata({
...demoformdata, 
patientbirthdate: newBirthdate,
patientage: calculateAge(newBirthdate)
});
}} max={new Date().toISOString().split('T')[0]}  type="date" name="patientbirthdate" id="patientbirthdate" placeholder=""/> </div>

                 </div>
             <div className="">

             <div className=" h-fit form-group ml-15">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientage">Age :</label>     
             <input className=" w-32 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  readOnly value={demoformdata.patientage} onChange={(e) => setdemoformdata({...demoformdata, patientage: e.target.value})} type="number" name="patientage" id="patientage" placeholder="Age..."/></div>

                 </div>




             </div>




             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientgender">Gender :</label>     
             <div className="ml-3"><GenderBoxAdminDash value={demoformdata.patientgender} onChange={(e) => setdemoformdata({...demoformdata, patientgender: e.target.value})} /></div>  </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientcontactnumber">Contact Number :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientcontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientcontactnumber: e.target.value})} type="text" name="patientcontactnumber" id="patientcontactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patienthomeaddress">Home Address :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"   value={demoformdata.patienthomeaddress} onChange={(e) => setdemoformdata({...demoformdata, patienthomeaddress: e.target.value})}  type="text" name="patienthomeaddress" id="patienthomeaddress" placeholder="Ex: #001 Sison St., Townsite, Limay, Bataan"/> </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactname">Emergency Contact Name :</label>     
             <input className="w-90 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientemergencycontactname} onChange={(e) => setdemoformdata({...demoformdata,patientemergencycontactname: e.target.value})}  type="text" name="patientemergencycontactname" id="patientemergencycontactname" placeholder="Ex: Juan Dela Cruz"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactnumber">Emergency Contact Number :</label>     
             <input className="w-84 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold" value={demoformdata.patientemergencycontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientemergencycontactnumber: e.target.value})}  type="text" name="patientemergencycontactnumber" id="patientemergencyconctactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>



           <div className=" mt-10">

           <button type="submit" disabled={issubmitting} className={`submit-btn mt-12 w-full flex justify-center items-center ${issubmitting? "opacity-75 cursor-not-allowed" : "" }`} style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
              Create Patient Profile
           </button>

             </div>





          </div>
             

           </div>
         

          </form>
</div>
</div>)}



</div>)}



{/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/}              
{ activeprofiletable === 'staffprofiletable' && ( <div id="staffprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
</div>)}



{/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/}
{ activeprofiletable === 'ownerprofiletable' && ( <div id="ownerprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
</div>)}




{/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/}
{ activeprofiletable === 'administratorprofiletable' && ( <div id="administratorprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
</div>)}






</div> )}

{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 





{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}

 { (activedashboard === 'appointmentmanagement' && !isAdminRole) && (<div id="appointmentmanagement" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl flex flex-col" >   

<div className="flex items-center"><i className="bx bxs-calendar text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Appointment Management</h1></div>





{loggedinusertype?.type === "Admin"&& (

<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showappointmentstable('allappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='allappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='allappointmentstable' ? 'text-white' : ''}`}>All</h1></div>
<div onClick={() => showappointmentstable('ambherappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='ambherappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='ambherappointmentstable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
<div onClick={() => showappointmentstable('bautistaappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='bautistaappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='bautistaappointmentstable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
</div>
)} 




{(loggedinusertype?.type === "Owner" || loggedinusertype?.type === "Staff") && loggedinusertype?.clinic === "Bautista Eye Center" && (
<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showappointmentstable('bautistaappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='bautistaappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='bautistaappointmentstable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
</div>
)}



{(loggedinusertype?.type === "Owner" || loggedinusertype?.type === "Staff") && loggedinusertype?.clinic === "Ambher Optical" && (
<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showappointmentstable('ambherappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='ambherappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='ambherappointmentstable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
</div>
)} 











{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}
{ activeappointmentstable === 'allappointmentstable' && ( <div id="allappointmentstable" className="animate-fadeInUp flex flex-col border-t-2 border-[#909090] w-[100%] flex-1 rounded-2xl mt-5 min-h-0" ref={appointmentTableRef}>

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter appointment details..." value={searchAppointments} onChange={(e) => {setSearchAppointments(e.target.value); filterAppointments(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
</div>

{loadingappointmens ? (
<div className="space-y-4 p-4 flex-1">
{[...Array(4)].map((_, index) => (
<AppointmentSkeleton key={index} />
))}
</div>
) : errorloadingappointments ? (
<div className="rounded-lg p-4 bg-red-50 text-red-600 flex-1 flex items-center justify-center">
Error: {errorloadingappointments}
</div>
) : (filteredAppointments.length === 0 && searchAppointments.trim()) ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6 flex-1 flex items-center justify-center">
No appointments found matching "{searchAppointments}".
</div>
) : patientappointments.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6 flex-1 flex items-center justify-center">No patient appointments found.</div>

) :(<div className="flex flex-col flex-1 rounded-3xl w-full mt-2 bg-[#f7f7f7] min-h-0">
<div className="flex-1 overflow-auto">
<table className="min-w-full divide-y divide-gray-200 h-full">
<thead className="bg- sticky top-0 z-10">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Ambher Appoinment</th>
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Bautista Appoinment</th>
<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className="divide-y divide-gray-200 bg-white">
{(() => {
const dataToDisplay = searchAppointments.trim() ? filteredAppointments : patientappointments;
const paginatedAppointments = getPaginatedData(dataToDisplay, 'appointments');
return paginatedAppointments.map((appointment) => (
<tr 
key={appointment._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6 text-[#171717] text-[15px] text-center font-albertsans font-medium whitespace-nowrap">
  #{appointment.patientappointmentid}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
       <div className="flex  items-center whitespace-nowrap">
    <img 
      src={appointment.patientappointmentprofilepicture}
      alt="Profile" 
      className=" rounded-full h-12 mr-3 w-12 object-cover"
      onError={(e) => {
        e.target.src = 'default-profile-url';
      }}
    />
    <h1 className="py-3 px-6 text-[#171717] text-[15px] text-center font-albertsans font-medium whitespace-nowrap">{appointment.patientappointmentfirstname} {appointment.patientappointmentlastname}</h1>
    </div>
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
    <span className="py-3 px-6 text-[#171717] text-[15px]  text-center font-albertsans font-medium whitespace-nowrap">
      {new Date(appointment.createdAt).toLocaleDateString('en-US',{
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}  
    </span>          
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
  {appointment.patientambherappointmentdate && (
    <div className="font-albertsans text-[#171717] font-medium flex  justify-center items-center whitespace-nowrap">
      <span className="font-albertsans text-[#171717] text-[15px] font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientambherappointmentdate)} </span> 
      <span className="ml-1 font-albertsans text-[#171717] text-[15px] font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientambherappointmenttime)})</span> 
      <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
appointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{appointment.patientambherappointmentstatus}</span>
    </div>
  )}
</td>

<td className="py-3 px-6 w-auto  text-center font-albertsans text-[#171717] font-medium whitespace-nowrap">
  {appointment.patientbautistaappointmentdate && (
    <div className="font-albertsans text-[#171717] font-medium flex justify-center items-center whitespace-nowrap">
      <span className="font-albertsans text-[15px]  text-[#171717] font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientbautistaappointmentdate)}</span> 
      <span className="ml-1 font-albertsans  text-[15px] text-[#171717] font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientbautistaappointmenttime)})</span> 
      
<span className={` ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
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
    className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white ">View</h1></div>

<div onClick={() =>  {setdeletepatientappointment(true);
                  setselectedpatientappointment(appointment);
}}
  className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>

        {deletepatientappointment && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
   

                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1></div>
                <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                    {selectedpatientappointment && ( <>
                              <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientappointmentid}</p> </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setdeletepatientappointment(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {handledeleteappointment(selectedpatientappointment.patientappointmentid);setdeletepatientappointment(false); }}><p className=" text-[#ffffff]">Delete</p></div>
                    </div>
                </div>

             </div>
           </div>
        )}


        

</td>
</tr>
));
})()}
</tbody>
</table>
</div>

{/* Pagination Component for Appointments */}
{(() => {
const dataToDisplay = searchAppointments.trim() ? filteredAppointments : patientappointments;
const totalAppointments = dataToDisplay.length;
const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);

return totalAppointments > 0 && (
<PaginationComponent
currentPage={currentPage.appointments}
totalPages={totalPages}
onPageChange={(page) => handlePageChange('appointments', page)}
totalItems={totalAppointments}
itemsPerPage={appointmentsPerPage}
itemName="appointments"
/>
);
})()}
</div>
)}

{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
           {viewpatientappointment && selectedpatientappointment && (
           <div id="viewpatientappointment" className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] mt-10  animate-fadeInUp ">
                   <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                   <Link to=""><div id="patientcard"  className=" flex justify-center items-start mt-5 ml-3 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-300 ease-in-out  rounded-2xl w-[500px] h-[80px]">
          <div className="w-max mr-3 h-full  rounded-2xl flex justify-center items-center">
          <img  src={selectedpatientappointment?.patientappointmentprofilepicture || defaultprofilepic}  alt="Profile" className="h-20 w-20 rounded-full object-cover"></img>
          </div>
          <div className="bg-white  flex flex-col justify-center items-start pl-2 pr-2 w-[500px] h-full  rounded-3xl">
            <h1 className="font-albertsans font-bold text-[20px] w-full text-[#2d3744]"> {selectedpatientappointment?.patientappointmentfirstname || ''} {selectedpatientappointment?.patientappointmentlastname || ''}</h1>
            <p className="text-[15px]  w-full text-[#535354]">{selectedpatientappointment?.patientappointmentemail || ''}</p>
          </div>
      </div>
      </Link> 
                     <div onClick={() => {setviewpatientappointment(false); setbautistaeyespecialist(''); setambhereyespecialist('');}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                   </div>






    <div className="mt-10 flex justify-start items-start  w-full rounded-3xl ">
{selectedpatientappointment.patientambherappointmentdate && (


<div className="flex flex-col mr-3 bg-[#fdfdfd]    h-auto w-full rounded-3xl">
<div className="flex p-3">
<img src={ambherlogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#237234] mt-1 ml-3">Ambher Optical</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientambherappointmentstatus}</span>
</div>

<div className="flex ">     

<div className="flex flex-col w-full pr-3">           
<div className=" flex flex-col h-fit form-group ml-3  mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientambherappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" required={!!ambherservicesselected}/>*/}
<div className="h-max w-full  flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientambherappointmentstatus === "Accepted" ||
selectedpatientappointment.patientambherappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientambherappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientambherappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientambherappointmenttime)})</span></h1>


{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientambherappointmentpaymentotal}
</p>

</div>
)}
</div>

</div>






</div>

</div>

<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcataractscreening} type="checkbox" name="patientambherappointmentcataractscreening" id="patientambherappointmentcataractscreening" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcataractscreening">Visual/Cataract Screening</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricassessment} type="checkbox" name="patientambherappointmentpediatricassessment" id="patientambherappointmentpediatricassessment" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricassessment">Pediatric Assessment</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricoptometrist} type="checkbox" name="patientambherappointmentpediatricoptometrist" id="patientambherappointmentpediatricoptometrist" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricoptometrist">Pediatric Optometrist</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcolorvisiontesting} type="checkbox" name="patientambherappointmentcolorvisiontesting" id="patientambherappointmentcolorvisiontesting" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcolorvisiontesting">Color Vision Testing</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentlowvisionaid} type="checkbox" name="patientambherappointmentlowvisionaid" id="patientambherappointmentlowvisionaid" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentlowvisionaid">Low Vision Aid</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentrefraction} type="checkbox" name="patientambherappointmentrefraction" id="patientambherappointmentrefraction" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentrefraction">Refraction</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcontactlensefitting} type="checkbox" name="patientambherappointmentcontactlensefitting" id="patientambherappointmentcontactlensefitting" />
<label className="text-[18px]   font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcontactlensefitting">Contact Lense Fitting</label>   
</div>  


<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientambherappointmentotherservice} onChange={(e) => setshowotherpatientambherappointmentotherservice(e.target.checked)}  type="checkbox" name="patientambherappointmentotherservice" id="patientambherappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentotherservice">Other</label>   
</div>  

{selectedpatientappointment.patientambherappointmentotherservice && (
<div className="mt-3 ml-17">
<p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientambherappointmentotherservicenote}</p>
</div>
)}    



{selectedpatientappointment.patientambherappointmentstatus === "Pending" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6 mr-4" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><AmbhereyespecialistBox value={ambhereyespecialist} onChange={(e) => setambhereyespecialist(e.target.value)} /></div>  

{ambhereyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Ambher Appointment</h1>
)}
</div>
)} 
</div>


)}



{selectedpatientappointment.patientambherappointmentstatus === "Accepted" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Ambher Optical  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={ambherappointmentpaymentotal} onChange={(e) => setambherappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientambherappointmentpaymentotal" id="patientambherappointmentpaymentotal" placeholder="Total Payment"/>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarkssubject} onChange={(e) => {setambherappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarks} onChange={(e) => {setambherappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>




<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentprescription} onChange={(e) => {setambherappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{ambherappointmentpaymentotal && ambherappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Ambher Appointment</h1>
)}
</div>
)}


</div>
)}



{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-15" >


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarkssubject}</p>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarks}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientambherappointmentprescription}</p>
</div>
{selectedpatientappointment.patientambherappointmentrating != 0 && selectedpatientappointment.patientambherappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientambherappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientambherappointmentfeedback}</p>
</div>
)} 

</div>
)}










</div>

</div>
)}







{selectedpatientappointment.patientbautistaappointmentdate && (
<div className="flex flex-col bg-[#fdfdfd]  h-auto w-full rounded-3xl">
<div className="flex p-3 ">
<img src={bautistalogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#2387c5] mt-1 ml-3">Bautista Eye Center</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientbautistaappointmentstatus}</span>
</div>



<div className="flex flex-col mr-3 pr-8 bg-[#fdfdfd] h-auto  w-full rounded-3xl">


<div className="flex flex-col  w-full">           
<div className="mr-10 flex flex-col h-fit form-group ml-3 mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientbautistaappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientbautistaappointmentdate" id="patientbautistaappointmentdate" placeholder="" required={!!bautistaservicesselected}/>*/}
<div className="h-max w-full flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" ||
selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientbautistaappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientbautistaappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientbautistaappointmenttime)})</span></h1>


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-5.5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientbautistaappointmentpaymentotal}
</p>
</div>
)}
</div>

</div>





</div>



<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentcomprehensiveeyeexam} type="checkbox" name="patientbautistaappointmentcomprehensiveeyeexam" id="patientbautistaappointmentcomprehensiveeyeexam" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcomprehensiveeyeexam">Comprehensive Eye Exam</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentdiabeticretinopathy} type="checkbox" name="patientbautistaappointmentdiabeticretinopathy" id="patientbautistaappointmentdiabeticretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentdiabeticretinopathy">Diabetic Retinopathy</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentglaucoma} type="checkbox" name="patientbautistaappointmentglaucoma" id="patientbautistaappointmentglaucoma" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentglaucoma">Glaucoma</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmenthypertensiveretinopathy} type="checkbox" name="patientbautistaappointmenthypertensiveretinopathy" id="patientbautistaappointmenthypertensiveretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmenthypertensiveretinopathy">Hypertensive Retinopathy</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentretinolproblem} type="checkbox" name="patientbautistaappointmentretinolproblem" id="patientbautistaappointmentretinolproblem" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentretinolproblem">Retinol Problem</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentcataractsurgery} type="checkbox" name="patientbautistaappointmentcataractsurgery" id="patientbautistaappointmentcataractsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcataractsurgery">Cataract Surgery</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentpterygiumsurgery} type="checkbox" name="patientbautistaappointmentpterygiumsurgery" id="patientbautistaappointmentpterygiumsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentpterygiumsurgery">Pterygium Surgery</label>   
</div>  

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentotherservice}  type="checkbox" name="patientbautistaappointmentotherservice" id="patientbautistaappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentotherservice">Other</label>   
</div>  


{selectedpatientappointment.patientbautistaappointmentotherservice && (
<div className="mt-3 ml-17">
<p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientbautistaappointmentotherservicenote}</p>
</div>
)}    






{selectedpatientappointment.patientbautistaappointmentstatus === "Pending" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><BautistaeyespecialistBox value={bautistaeyespecialist} onChange={(e) => setbautistaeyespecialist(e.target.value)}/></div>
{bautistaeyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Bautista Appointment</h1>
)}
</div>
)}
</div>
)}



{selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Bautista Eye Center  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={bautistaappointmentpaymentotal} onChange={(e) => setbautistaappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientbautistaappointmentpaymentotal" id="patientbautistaappointmentpaymentotal" placeholder="Total Payment"/>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarkssubject} onChange={(e) => {setbautistaappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify consultation subject..."/>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarks} onChange={(e) => {setbautistaappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>



<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentprescription} onChange={(e) => {setbautistaappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{bautistaappointmentpaymentotal && bautistaappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Bautista Appointment</h1>
)}
</div>
)}

</div>
)}


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-15" >


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarks}</p>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentprescription}</p>
</div>



{selectedpatientappointment.patientbautistaappointmentrating != 0 && selectedpatientappointment.patientbautistaappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientbautistaappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientbautistaappointmentfeedback}</p>
</div>
)} 


</div>
)}








</div>

</div>
</div>
)}
</div>

{(selectedpatientappointment.patientambherappointmentstatus === "Completed" &&
selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (
<div className="bg-[#dbfac8] w-full p-3 mt-20 rounded-2xl">
<div className="  items-center  flex justify-between">
<h1 className=" text-[#237234] font-bold font-albertsans text-[20px] ">Combined Total Payment : </h1>
<p className="text-[#2b5910] text-[24px] font-albertsans font-semibold">
₱{(selectedpatientappointment.patientambherappointmentpaymentotal + selectedpatientappointment.patientbautistaappointmentpaymentotal).toLocaleString()}
</p>
</div>
</div>

)}






<div className="w-full mt-5 p-3 flex flex-col mb-7 bg-[#e5e7eb] rounded-2xl  ">
            <label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientadditionalappointmentnotes">Patient Appointment Notes :</label>  

             <div>{selectedpatientappointment.patientadditionalappointmentnotes ||"No additional notes"}</div>
                                   <div className=" w-fit h-fit mt-5 mb-5">
                                   <img className=" object-cover  rounded-2xl" src={selectedpatientappointment.patientadditionalappointmentnotesimage || defaultimageplaceholder}/>                 
                                   </div>
            </div>
             </div>

           </div>
        )}


</div> )}



















{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}
{ activeappointmentstable === 'ambherappointmentstable' && ( <div id="ambherappointmentstable" className="animate-fadeInUp flex flex-col border-t-2 border-[#909090] w-[100%] flex-1 rounded-2xl mt-5 min-h-0" ref={appointmentTableRef}>

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter appointment details..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
</div>

{loadingappointmens ? (
<div className="space-y-4 p-4">
{[...Array(4)].map((_, index) => (
<AppointmentSkeleton key={index} />
))}
</div>
) : errorloadingappointments ? (
<div className="rounded-lg p-4 bg-red-50 text-red-600">
Error: {errorloadingappointments}
</div>
) : patientappointments.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">No patient appointments found.</div>

) :(<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Ambher Appoinment</th>


<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className="divide-y divide-gray-200 bg-white">

{patientappointments.filter(appointment =>{
if(activeappointmentstable === 'ambherappointmentstable'){
return appointment.patientambherappointmentdate !== "" &&
   appointment.patientambherappointmenttime !== "" &&
   appointment.patientambherappointmentid !== null;
}
return true;
}).map((appointment) => (
<tr 
key={appointment._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
#{appointment.patientappointmentid}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
     <div className="flex  items-center whitespace-nowrap">
  <img 
    src={appointment.patientappointmentprofilepicture} 
    alt="Profile" 
    className=" rounded-full h-12 mr-3 w-12 object-cover"
    onError={(e) => {
      e.target.src = 'default-profile-url';
    }}
  />
  <h1 className="font-albertsans text-[#171717]font-medium whitespace-nowrap">{appointment.patientappointmentfirstname} {appointment.patientappointmentlastname}</h1>
  </div>
</td>

<td className="py-3 px-6  text-center font-albertsans text-[#171717] font-medium whitespace-nowrap">
  <span className="font-albertsans text-[#171717]font-medium whitespace-nowrap">
    {new Date(appointment.createdAt).toLocaleDateString('en-US',{
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}  
  </span>          
</td>

<td className="whitespace-nowrap">
{appointment.patientambherappointmentdate && (
  <div className=" font-albertsans text-[#171717] font-medium flex  justify-center items-center whitespace-nowrap">
    <span className="font-albertsans text-[#171717]font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientambherappointmentdate)} </span> 
    <span className="ml-1 font-albertsans text-[#171717]font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientambherappointmenttime)})</span> 
    <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
appointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{appointment.patientambherappointmentstatus}</span>
  </div>
)}
</td>





<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">

<div onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
  className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>

<div onClick={() =>  {setdeletepatientappointment(true);
                setselectedpatientappointment(appointment);
}}
className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>

      {deletepatientappointment && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                  {selectedpatientappointment && ( <>
                            <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientambherappointmentid}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setdeletepatientappointment(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                    <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {handledeleteappointmentbyclinic(selectedpatientappointment.patientappointmentid, 'ambher');setdeletepatientappointment(false); }}><p className=" text-[#ffffff]">Delete</p></div>
                  </div>
              </div>

           </div>
         </div>
      )}


      

</td>
</tr>
))}
</tbody>
</table>
</div>
)}



{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
         {viewpatientappointment && selectedpatientappointment && (
         <div id="viewpatientappointment" className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
           <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] mt-10  animate-fadeInUp ">
                 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                 <Link to=""><div id="patientcard"  className=" flex justify-center items-start mt-5 ml-3 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-300 ease-in-out  rounded-2xl w-[500px] h-[80px]">
        <div className="w-max mr-3 h-full  rounded-2xl flex justify-center items-center">
        <img  src={selectedpatientappointment?.patientappointmentprofilepicture || defaultprofilepic}  alt="Profile" className="h-20 w-20 rounded-full object-cover"></img>
        </div>
        <div className="bg-white  flex flex-col justify-center items-start pl-2 pr-2 w-[500px] h-full  rounded-3xl">
          <h1 className="font-albertsans font-bold text-[20px] w-full text-[#2d3744]"> {selectedpatientappointment?.patientappointmentfirstname || ''} {selectedpatientappointment?.patientappointmentlastname || ''}</h1>
          <p className="text-[15px]  w-full text-[#535354]">{selectedpatientappointment?.patientappointmentemail || ''}</p>
        </div>
    </div>
    </Link> 
                   <div onClick={() => {setviewpatientappointment(false); setambhereyespecialist('');}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                 </div>






  <div className="mt-10 flex justify-start items-start  w-full rounded-3xl ">
{selectedpatientappointment.patientambherappointmentdate && (


<div className="flex flex-col mr-3 bg-[#fdfdfd]    h-auto w-full rounded-3xl">
<div className="flex p-3">
<img src={ambherlogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#237234] mt-1 ml-3">Ambher Optical</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientambherappointmentstatus}</span>
</div>

<div className="flex ">     

<div className="flex flex-col w-full pr-3">           
<div className=" flex flex-col h-fit form-group ml-3  mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientambherappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" required={!!ambherservicesselected}/>*/}
<div className="h-max w-full  flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientambherappointmentstatus === "Accepted" ||
selectedpatientappointment.patientambherappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientambherappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientambherappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientambherappointmenttime)})</span></h1>


{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientambherappointmentpaymentotal}
</p>

</div>
)}
</div>

</div>





</div>

</div>

<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcataractscreening} type="checkbox" name="patientambherappointmentcataractscreening" id="patientambherappointmentcataractscreening" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcataractscreening">Visual/Cataract Screening</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricassessment} type="checkbox" name="patientambherappointmentpediatricassessment" id="patientambherappointmentpediatricassessment" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricassessment">Pediatric Assessment</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricoptometrist} type="checkbox" name="patientambherappointmentpediatricoptometrist" id="patientambherappointmentpediatricoptometrist" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricoptometrist">Pediatric Optometrist</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcolorvisiontesting} type="checkbox" name="patientambherappointmentcolorvisiontesting" id="patientambherappointmentcolorvisiontesting" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcolorvisiontesting">Color Vision Testing</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentlowvisionaid} type="checkbox" name="patientambherappointmentlowvisionaid" id="patientambherappointmentlowvisionaid" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentlowvisionaid">Low Vision Aid</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentrefraction} type="checkbox" name="patientambherappointmentrefraction" id="patientambherappointmentrefraction" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentrefraction">Refraction</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcontactlensefitting} type="checkbox" name="patientambherappointmentcontactlensefitting" id="patientambherappointmentcontactlensefitting" />
<label className="text-[18px]   font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcontactlensefitting">Contact Lense Fitting</label>   
</div>  

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientambherappointmentotherservice}  type="checkbox" name="patientambherappointmentotherservice" id="patientambherappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentotherservice">Other</label>   
</div>  


{selectedpatientappointment.patientambherappointmentotherservice && (
<div className="mt-3 ml-17 flex">
 <p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientambherappointmentotherservicenote}</p>
</div>
)}   


{selectedpatientappointment.patientambherappointmentstatus === "Pending" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6 mr-4" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><AmbhereyespecialistBox value={ambhereyespecialist} onChange={(e) => setambhereyespecialist(e.target.value)} /></div>  

{ambhereyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Ambher Appointment</h1>
)}
</div>
)} 
</div>


)}



{selectedpatientappointment.patientambherappointmentstatus === "Accepted" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6 " >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Ambher Optical  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={ambherappointmentpaymentotal} onChange={(e) => setambherappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientambherappointmentpaymentotal" id="patientambherappointmentpaymentotal" placeholder="Total Payment"/>



<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarkssubject} onChange={(e) => {setambherappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarks} onChange={(e) => {setambherappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentprescription} onChange={(e) => {setambherappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{ambherappointmentpaymentotal && ambherappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Ambher Appointment</h1>
)}
</div>
)}


</div>
)}



{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-15" >


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarkssubject}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarks}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientambherappointmentprescription}</p>
</div>


{selectedpatientappointment.patientambherappointmentrating != 0 && selectedpatientappointment.patientambherappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientambherappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientambherappointmentfeedback}</p>
</div>
)} 

</div>
)}



</div>

</div>
)}



</div>


<div className="w-full mt-5 p-3 flex flex-col mb-7 bg-[#e5e7eb] rounded-2xl  ">
          <label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientadditionalappointmentnotes">Patient Appointment Notes :</label>  

           <div>{selectedpatientappointment.patientadditionalappointmentnotes ||"No additional notes"}</div>
                                 <div className=" w-fit h-fit mt-5 mb-5">
                                 <img className=" object-cover  rounded-2xl" src={selectedpatientappointment.patientadditionalappointmentnotesimage || defaultimageplaceholder}/>                 
                                 </div>
          </div>
           </div>

         </div>
      )}


</div>)}







{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}
{ activeappointmentstable === 'bautistaappointmentstable' && ( <div id="bautistaappointmentstable" className="animate-fadeInUp flex flex-col border-t-2 border-[#909090] w-[100%] flex-1 rounded-2xl mt-5 min-h-0" ref={appointmentTableRef}>
<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter appointment details..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
</div>

{loadingappointmens ? (
<div className="space-y-4 p-4">
{[...Array(4)].map((_, index) => (
<AppointmentSkeleton key={index} />
))}
</div>
) : errorloadingappointments ? (
<div className="rounded-lg p-4 bg-red-50 text-red-600">
Error: {errorloadingappointments}
</div>
) : patientappointments.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">No patient appointments found.</div>

) :(<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Bautista Appoinment</th>
<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className="divide-y divide-gray-200 bg-white">
{patientappointments.filter(appointment =>{
if(activeappointmentstable === 'bautistaappointmentstable'){
return appointment.patientbautistaappointmentdate !== "" &&
   appointment.patientbautistaappointmenttime !== "" &&
   appointment.patientbautistaappointmentid !== null;
}
return true;
}).map((appointment) => (
<tr 
key={appointment._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6  text-center font-albertsans text-[#171717]font-medium whitespace-nowrap">
#{appointment.patientappointmentid}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
     <div className="flex  items-center whitespace-nowrap">
  <img 
    src={appointment.patientappointmentprofilepicture} 
    alt="Profile" 
    className=" rounded-full h-12 mr-3 w-12 object-cover"
    onError={(e) => {
      e.target.src = 'default-profile-url';
    }}
  />
  <h1 className="font-albertsans text-[#171717]font-medium whitespace-nowrap">{appointment.patientappointmentfirstname} {appointment.patientappointmentlastname}</h1>
  </div>
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
  <span className="font-albertsans text-[#171717]font-medium whitespace-nowrap">
    {new Date(appointment.createdAt).toLocaleDateString('en-US',{
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}  
  </span>          
</td>



<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
{appointment.patientbautistaappointmentdate && (
  <div className="font-albertsans text-[#171717] font-medium flex justify-center items-center whitespace-nowrap">
    <span className="font-albertsans text-[#171717] font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientbautistaappointmentdate)}</span> 
    <span className="ml-1 font-albertsans text-[#171717] font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientbautistaappointmenttime)})</span> 
    
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
  className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>

<div onClick={() =>  {setdeletepatientappointment(true);
                setselectedpatientappointment(appointment);
}}
className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>

      {deletepatientappointment && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                  {selectedpatientappointment && ( <>
                            <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientbautistaappointmentid}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setdeletepatientappointment(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                    <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {handledeleteappointmentbyclinic(selectedpatientappointment.patientappointmentid, 'bautista') ;setdeletepatientappointment(false); }}><p className=" text-[#ffffff]">Delete</p></div>
                  </div>
              </div>

           </div>
         </div>
      )}


      

</td>
</tr>
))}
</tbody>
</table>
</div>
)}

{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
         {viewpatientappointment && selectedpatientappointment && (
         <div id="viewpatientappointment" className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
           <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] mt-10  animate-fadeInUp ">
                 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                 <Link to=""><div id="patientcard"  className=" flex justify-center items-start mt-5 ml-3 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-300 ease-in-out  rounded-2xl w-[500px] h-[80px]">
        <div className="w-max mr-3 h-full  rounded-2xl flex justify-center items-center">
        <img  src={selectedpatientappointment?.patientappointmentprofilepicture || defaultprofilepic}  alt="Profile" className="h-20 w-20 rounded-full object-cover"></img>
        </div>
        <div className="bg-white  flex flex-col justify-center items-start pl-2 pr-2 w-[500px] h-full  rounded-3xl">
          <h1 className="font-albertsans font-bold text-[20px] w-full text-[#2d3744]"> {selectedpatientappointment?.patientappointmentfirstname || ''} {selectedpatientappointment?.patientappointmentlastname || ''}</h1>
          <p className="text-[15px]  w-full text-[#535354]">{selectedpatientappointment?.patientappointmentemail || ''}</p>
        </div>
    </div>
    </Link> 
                   <div onClick={() => {setviewpatientappointment(false); setbautistaeyespecialist('');}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                 </div>






  <div className="mt-10 flex justify-start items-start  w-full rounded-3xl ">








{selectedpatientappointment.patientbautistaappointmentdate && (
<div className="flex flex-col bg-[#fdfdfd]  h-auto w-full rounded-3xl">
<div className="flex p-3 ">
<img src={bautistalogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#2387c5] mt-1 ml-3">Bautista Eye Center</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientbautistaappointmentstatus}</span>
</div>



<div className="flex flex-col mr-3 pr-8 bg-[#fdfdfd] h-auto  w-full rounded-3xl">


<div className="flex flex-col  w-full">           
<div className="mr-10 flex flex-col h-fit form-group ml-3 mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientbautistaappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientbautistaappointmentdate" id="patientbautistaappointmentdate" placeholder="" required={!!bautistaservicesselected}/>*/}
<div className="h-max w-full flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" ||
selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientbautistaappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientbautistaappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientbautistaappointmenttime)})</span></h1>


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-5.5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientbautistaappointmentpaymentotal}
</p>
</div>
)}
</div>

</div>





</div>



<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentcomprehensiveeyeexam} type="checkbox" name="patientbautistaappointmentcomprehensiveeyeexam" id="patientbautistaappointmentcomprehensiveeyeexam" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcomprehensiveeyeexam">Comprehensive Eye Exam</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentdiabeticretinopathy} type="checkbox" name="patientbautistaappointmentdiabeticretinopathy" id="patientbautistaappointmentdiabeticretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentdiabeticretinopathy">Diabetic Retinopathy</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentglaucoma} type="checkbox" name="patientbautistaappointmentglaucoma" id="patientbautistaappointmentglaucoma" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentglaucoma">Glaucoma</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmenthypertensiveretinopathy} type="checkbox" name="patientbautistaappointmenthypertensiveretinopathy" id="patientbautistaappointmenthypertensiveretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmenthypertensiveretinopathy">Hypertensive Retinopathy</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentretinolproblem} type="checkbox" name="patientbautistaappointmentretinolproblem" id="patientbautistaappointmentretinolproblem" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentretinolproblem">Retinol Problem</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentcataractsurgery} type="checkbox" name="patientbautistaappointmentcataractsurgery" id="patientbautistaappointmentcataractsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcataractsurgery">Cataract Surgery</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentpterygiumsurgery} type="checkbox" name="patientbautistaappointmentpterygiumsurgery" id="patientbautistaappointmentpterygiumsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentpterygiumsurgery">Pterygium Surgery</label>   
</div>  


<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentotherservice} onChange={(e) => setshowotherpatientbautistaappointmentotherservice(e.target.checked)}  type="checkbox" name="patientbautistaappointmentotherservice" id="patientbautistaappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentotherservice">Other</label>   
</div>  


{selectedpatientappointment.patientbautistaappointmentotherservice && (
<div className="mt-3 ml-17">
<p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientbautistaappointmentotherservicenote}</p>
</div>
)}    



{selectedpatientappointment.patientbautistaappointmentstatus === "Pending" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><BautistaeyespecialistBox value={bautistaeyespecialist} onChange={(e) => setbautistaeyespecialist(e.target.value)}/></div>
{bautistaeyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Bautista Appointment</h1>
)}
</div>
)}
</div>
)}



{selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Bautista Eye Center  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={bautistaappointmentpaymentotal} onChange={(e) => setbautistaappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientbautistaappointmentpaymentotal" id="patientbautistaappointmentpaymentotal" placeholder="Total Payment"/>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarkssubject} onChange={(e) => {setbautistaappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarks} onChange={(e) => {setbautistaappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentprescription} onChange={(e) => {setbautistaappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{bautistaappointmentpaymentotal && bautistaappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Bautista Appointment</h1>
)}
</div>
)}

</div>
)}


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-15" >

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarks}</p>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentprescription}</p>
</div>


{selectedpatientappointment.patientbautistaappointmentrating != 0 && selectedpatientappointment.patientbautistaappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientbautistaappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientbautistaappointmentfeedback}</p>
</div>
)} 


</div>
)}



</div>

</div>
</div>
)}
</div>




<div className="w-full mt-5 p-3 flex flex-col mb-7 bg-[#e5e7eb] rounded-2xl  ">
          <label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientadditionalappointmentnotes">Patient Appointment Notes :</label>  

           <div>{selectedpatientappointment.patientadditionalappointmentnotes ||"No additional notes"}</div>
                                 <div className=" w-fit h-fit mt-5 mb-5">
                                 <img className=" object-cover  rounded-2xl" src={selectedpatientappointment.patientadditionalappointmentnotesimage || defaultimageplaceholder}/>                 
                                 </div>
          </div>
           </div>

         </div>
      )}


</div> )}

 </div>)}

{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 











{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}

{ (activedashboard === 'medicalrecords' && !isAdminRole) && (<div id="medicalrecords" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   
  


<div className="flex items-center"><i className="bx bxs-data text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Medical Records</h1></div>

















{ activemedicalrecordstable === 'allmedicalrecordstable' && ( <div id="allmedicalrecordstable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[90%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input 
type="text" 
placeholder="Enter medical record details..." 
value={searchmedicalrecords}
onChange={(e) => setsearchmedicalrecords(e.target.value)}
className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
/></div></div>
</div>

{loadingappointmens ? (
<div className="space-y-4 p-4">
{[...Array(4)].map((_, index) => (
<AppointmentSkeleton key={index} />
))}
</div>
) : errorloadingappointments ? (
<div className="rounded-lg p-4 bg-red-50 text-red-600">
Error: {errorloadingappointments}
</div>
) : filteredmedicalrecords.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">No patient medical records found.</div>

) :(

<div className="overflow-y-auto overflow-hidden rounded-3xl  w-full mt-2 bg-[#f7f7f7] ">
<table className=" min-w-full divide-y divide-gray-200 ">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Last Ambher Appointment</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Last Bautista Appointment</th>


<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className=" divide-y divide-gray-200 bg-white  ">

{filteredmedicalrecords.map((patients) => (
<tr 
key={patients._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
#{patients.patientdemographicId}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">
     <div className="flex  items-center">
  <img 
    src={patients.patientprofilepicture} 
    alt="Profile" 
    className=" rounded-full h-12 mr-3 w-12 object-cover"
    onError={(e) => {
      e.target.src = 'default-profile-url';
    }}
  />
  <h1 className="font-albertsans text-[#171717]  text-center text-[15px] font-medium ">{patients.patientfirstname} {patients.patientlastname}</h1>
  </div>
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">
  {(() => {
  const lastambherappointment = patientappointments
                                  .filter(lastapp => lastapp.patientappointmentemail === patients.patientemail && lastapp.patientambherappointmentdate && lastapp.patientambherappointmentstatus === 'Completed')
                                  .sort((a,b) => new Date(b.patientambherappointmentdate) - new Date(a.patientambherappointmentdate))[0];
  
  return lastambherappointment ? (
    <div>
      <p>{formatappointmatedates(lastambherappointment.patientambherappointmentdate)}</p>
      <p className="text-gray-500 text-[14px]">{formatappointmenttime(lastambherappointment.patientambherappointmenttime)}</p>
    </div>
  ):(
    <p className="text-gray-500">No completed appointments</p>
  );
 })()}
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">
 {(() => {
  const lastbautistaappointment = patientappointments
                                  .filter(lastapp => lastapp.patientappointmentemail === patients.patientemail && lastapp.patientbautistaappointmentdate  && lastapp.patientbautistaappointmentstatus === 'Completed')
                                  .sort((a,b) => new Date(b.patientbautistaappointmentdate) - new Date(a.patientbautistaappointmentdate))[0];
  
  return lastbautistaappointment ? (
    <div>
      <p>{formatappointmatedates(lastbautistaappointment.patientbautistaappointmentdate)}</p>
      <p className="text-gray-500 text-[14px]">{formatappointmenttime(lastbautistaappointment.patientbautistaappointmenttime)}</p>
    </div>
  ):(
    <p className="text-gray-500">No completed appointments</p>
  );
 })()}
</td>





<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">

<div onClick={() =>  {setshowpatientmedicalrecord(true);
                    setselectedpatientmedicalrecord(patients);}} className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>




      

</td>
</tr>
))}
</tbody>
</table>
</div>
)}

</div> )}




{showpatientmedicalrecord && (
<div id="patientdemographicprofileform" className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 pb-5 bg-white rounded-2xl w-[1300px] h-[780px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Patient Medical Record</h1></div>
  <div onClick={() => setshowpatientmedicalrecord(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<div className="flex justify-center items-center rounded-2xl h-[670px] w-full">
  <div className=" flex flex-col pt-10 pl-3 items-center h-full w-[35%]  rounded-2xl">
      <img src={selectedpatientmedicalrecord.patientprofilepicture} className="w-65 h-65 rounded-full"></img>
       <div className="mt-10  flex  items-center h-auto w-full">
        <h1 className="  w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Name :</h1>
        <p className=" text-center bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientfirstname}  {selectedpatientmedicalrecord.patientlastname}</p>
       </div>
       <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className=" w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Email :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientemail}</p>
       </div>
        <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className=" w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Contact No :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientcontactnumber}</p>
       </div>
        <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className="w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Gender :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientgender}</p>
       </div>
        <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className=" w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Bithdate :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{formatappointmatedates(selectedpatientmedicalrecord.patientbirthdate)}</p>
       </div>
                    


  </div>
  <div className="h-full flex flex-col  w-[65%] px-3 rounded-2xl">
      <div className="flex justify-center items-center mt-3 w-full h-[60px]">
      <div onClick={() => showpatientmedicalrecordstable('medicalrecordsconsultationtable')}  className={`cursor-pointer w-full mr-5 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activepatientmedicalrecordstable ==='medicalrecordsconsultationtable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activepatientmedicalrecordstable ==='medicalrecordsconsultationtable' ? 'text-white' : ''}`}>Consultation</h1></div>
      <div onClick={() => showpatientmedicalrecordstable('medicalrecordspastvisitstable')}  className={`cursor-pointer w-full ml-5 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activepatientmedicalrecordstable ==='medicalrecordspastvisitstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d]   ${activepatientmedicalrecordstable ==='medicalrecordspastvisitstable' ? 'text-white' : ''}`}>Other Clinic Records</h1></div>
      </div>

 { activepatientmedicalrecordstable === 'medicalrecordsconsultationtable' && (
  <div  id='medicalrecordsconsultationtable'className="border-10 overflow-y-auto p-2 w-full h-full bg-[#e5e7eb] mt-3 rounded-2xl">  

   {(() => {
          
           const completedAppointments = patientappointments
             .filter(appointment => 
                     appointment.patientappointmentemail === selectedpatientmedicalrecord.patientemail && 
                     ((appointment.patientambherappointmentstatus === 'Completed') || 
                      (appointment.patientbautistaappointmentstatus === 'Completed')))

             .flatMap(appointment => {
                const appointments = [];

                if(appointment.patientambherappointmentstatus === 'Completed'){
                  appointments.push({
                      ...appointment,
                      clinicType: 'ambher',
                      profilepicture: appointment.patientappointmentprofilepicture,
                      firstname: appointment.patientappointmentfirstname,
                      middlename: appointment.patientappointmentmiddlename,
                      lastname: appointment.patientappointmentlastname,
                      email: appointment.patientappointmentemail,
                      date: appointment.patientambherappointmentdate,
                      time: appointment.patientambherappointmenttime,
                      status: appointment.patientambherappointmentstatus,
                      eyespecialist: appointment.patientambherappointmenteyespecialist,
                      consultationremarkssubject: appointment.patientambherappointmentconsultationremarkssubject,
                      consultationremarks: appointment.patientambherappointmentconsultationremarks,
                      consultationprescription: appointment.patientambherappointmentprescription
                  });  
                }


                if(appointment.patientbautistaappointmentstatus === 'Completed'){
                  appointments.push({
                      ...appointment,
                      clinicType: 'bautista',
                      profilepicture: appointment.patientappointmentprofilepicture,
                      firstname: appointment.patientappointmentfirstname,
                      middlename: appointment.patientappointmentmiddlename,
                      lastname: appointment.patientappointmentlastname,
                      email: appointment.patientappointmentemail,
                      date: appointment.patientbautistaappointmentdate,
                      time: appointment.patientbautistaappointmenttime,
                      status: appointment.patientbautistaappointmentstatus,
                      eyespecialist: appointment.patientbautistaappointmenteyespecialist,
                      consultationremarkssubject: appointment.patientbautistaappointmentconsultationremarkssubject,
                      consultationremarks: appointment.patientbautistaappointmentconsultationremarks,
                      consultationprescription: appointment.patientbautistaappointmentprescription
                  });  
                }

                return appointments;
             })
             .sort((a, b) => {
                const datea = new Date(a.date);
                const dateb = new Date(b.date);
                return dateb - datea;
             });
             

       return completedAppointments.map((appointment, index) => (

         <div key={index} className="pl-3 mt-3 w-full h-[80px] shadow-sm bg-white rounded-2xl flex justify-between items-center">
            <div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
                <h1 className="font-albertsans truncate w-full font-semibold text-[#134882] text-[18px]">{appointment.consultationremarkssubject}</h1>
            </div>


            <div className=" px-2 flex flex-col justify-center items-center rounded-2xl h-full w-[220px]">
              <h1 className="font-medium truncate w-full">{formatappointmatedates(appointment.date)}</h1> 
              <h1 className="text-[#4a4a4a] font-sm truncate w-full">{formatappointmenttime(appointment.time)}</h1> 
            </div>

            <div className=" px-2 flex justify-center items-center rounded-2xl h-full w-[220px] ">
              <h1 className="font-medium truncate w-full">{appointment.eyespecialist}</h1>
            </div>

              <div className="rounded-2xl h-full w-auto mr-4 flex justify-center items-center "><div onClick={() => {setshowpatientmedicalrecordconsultation(true);setselectedpatientappointment(appointment);}} className="bg-[#383838]  hover:bg-[#595959]   transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white ">View</h1></div></div>
            </div>

             ));
             
      })()}      

</div>
)}









{/*AICODE*/}

 { activepatientmedicalrecordstable === 'medicalrecordspastvisitstable' && (
  <div  id='medicalrecordspastvisitstable'className="  p-2 w-full h-full mt-3 rounded-2xl">  
     <div onClick={() => setshowpatientaddothermedicalrecord(true)}  className="py-2 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Record</p></div>
  <div className="border-10 overflow-y-auto p-2 w-full h-[530px] bg-[#e5e7eb] mt-3 rounded-2xl"> 

         {(() => {
// Show loading skeleton while fetching records
if (loadingpatientdemographics) {
return (
<div className="space-y-3">
{[...Array(3)].map((_, index) => (
  <MedicalRecordRowSkeleton key={index} />
))}
</div>
);
}

// Show error message if failed to load
if (patientdemoerror) {
return (
<div className="text-center text-red-500 mt-4 p-4 bg-red-50 rounded-2xl">
<i className="bx bx-error text-2xl mb-2"></i>
<p>{patientdemoerror}</p>
<button 
  onClick={() => fetchDemographicsData(true)} 
  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
>
  Retry
</button>
</div>
);
}

console.log('Filtering records for patient:', selectedpatientmedicalrecord?.patientemail);
console.log('Total otherclinicrecords:', otherclinicrecords?.length || 0);
console.log('Sample record emails:', (Array.isArray(otherclinicrecords) ? otherclinicrecords : []).slice(0, 3).map(r => r.patientotherclinicemail));

const filteredRecords = (Array.isArray(otherclinicrecords) ? otherclinicrecords : [])
.filter(record => {
const recordEmail = record.patientotherclinicemail?.toLowerCase()?.trim();
const selectedEmail = selectedpatientmedicalrecord.patientemail?.toLowerCase()?.trim();
const matches = recordEmail === selectedEmail;
if (matches) {
console.log('Found matching record:', record);
}
return matches;
})
.sort((a, b) => new Date(b.patientotherclinicconsultationdate) - new Date(a.patientotherclinicconsultationdate));

console.log('Filtered records count:', filteredRecords.length);

if (filteredRecords.length === 0) {
return <div className="text-center text-gray-500 mt-4">No other clinic records found</div>;
}

return filteredRecords.map((record) => (
<div key={record._id || record.otherclinicid} className="pl-3 mt-3 w-full h-[80px] shadow-sm bg-white rounded-2xl flex justify-between items-center">
<div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
<h1 className="font-albertsans truncate w-full font-semibold text-[#134882] text-[18px]">{record.patientotherclinicname}</h1>
</div>

<div className="px-2 flex flex-col justify-center items-center rounded-2xl h-full w-[220px]">
<h1 className="font-medium truncate w-full">{formatappointmatedates(record.patientotherclinicconsultationdate)}</h1>
</div>

<div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
<h1 className="font-medium truncate w-full">{record.patientothercliniceyespecialist}</h1>
</div>

<div className="rounded-2xl h-full w-auto mr-4 flex justify-center items-center">
<div 
  onClick={() => {
    setshowotherclinicrecord(true);
    setselectedpatientappointment({
      ...record,
      otherclinicid: record.patientotherclinicrecordid,
      date: record.patientotherclinicconsultationdate,
      eyespecialist: record.patientothercliniceyespecialist,
      clinicname: record.patientotherclinicname,
      submittedbyfirstname: record.patientotherclinicsubmittedbyfirstname,
      submittedbymiddlename: record.patientotherclinicsubmittedbymiddlename,
      submittedbylastname: record.patientotherclinicsubmittedbylastname,
      patientotherclinicrecordimage: record.patientotherclinicrecordimage
    });
  }} 
  className="bg-[#383838] hover:bg-[#595959] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"
>
  <h1 className="text-white">View</h1>
</div>

<div onClick={() =>  {
    setselectedpatientappointment({
      ...record,
      otherclinicid: record.patientotherclinicrecordid,
      date: record.patientotherclinicconsultationdate,
      eyespecialist: record.patientothercliniceyespecialist,
      clinicname: record.patientotherclinicname,
      submittedbyfirstname: record.patientotherclinicsubmittedbyfirstname,
      submittedbymiddlename: record.patientotherclinicsubmittedbymiddlename,
      submittedbylastname: record.patientotherclinicsubmittedbylastname,
      patientotherclinicrecordimage: record.patientotherclinicrecordimage
    });
  setshowdeleteotherclinicrecorddialog(true);}}

 className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-3 ml-2 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>
</div>
</div>
));
})()}

          
          
  </div>
   </div>
 )}


   
  </div>
</div>


</div>




</div>)}


{showpatientmedicalrecordconsultation && (
<div id="patientdemographicprofileformconsultation" className="overflow-y-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="mt-50 mb-30 pl-5 pr-5 pb-5 bg-white rounded-2xl w-[800px] h-max  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">View Consultation</h1></div>
  <div onClick={() => setshowpatientmedicalrecordconsultation(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

  <div className="px-2 pt-5 flex flex-col  h-max w-full rounded-2xl ">
    <div className="w-full h-auto flex justify-between items-center">
    <h1 className="font-albertsans font-bold text-[17px] text-[#2b2b2b]"><span className="text-[#333333] text-[19px] font-albertsans font-semibold">{selectedpatientappointment.eyespecialist}</span></h1>
    <div className="pr-4 flex flex-col justify-center items-center">
    <h1 className="text-[#333333] text-[17px] font-albertsans font-semibold"> {formatappointmatedates(selectedpatientappointment.date)}</h1>
    <h1 className="text-[#333333] text-[15px] font-albertsans font-medium"> {formatappointmenttime(selectedpatientappointment.time)}</h1>
    </div>
  </div>


      <h1 className="text-[#333333] text-[16px] mt-15 font-albertsans font-semibold">{selectedpatientappointment.consultationremarkssubject}</h1>
      <h1 className="text-[#333333] text-[15px]  font-albertsans font-medium mt-1"> - {selectedpatientappointment.consultationremarks}</h1>
    <div className="p-2 w-full h-auto rounded-2xl border-3 mt-3 bg-[#e5e7eb]">

      <h1 className="text-[#333333] text-[15px] font-albertsans font-bold mt-1">Prescription</h1>
      <h1 className="break-words min-w-0 text-[#333333] text-[15px] font-albertsans font-medium mt-1"> {selectedpatientappointment.consultationprescription}</h1>
    </div>

  </div>



</div>




</div>)}







{showpatientaddothermedicalrecord && (
<div id="patientshowpatientaddothermedicalrecord" className=" bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="  pl-5 pr-5 pb-5 bg-white rounded-2xl w-[800px] h-max  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Other Clinic Record</h1></div>
  <div onClick={() => setshowpatientaddothermedicalrecord(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={submitotherclinicdata}>
<div className="px-2 pt-5 flex flex-col justify-center items-center  h-max w-full rounded-2xl ">
           <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="otherclinicname">Clinic :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={otherclinicname} onChange={(e) => setotherclinicname(e.target.value)} id="otherclinicname" name="otherclinicname" required  placeholder="Other clinic name..."/>
                </div>
            </div>


            <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="othercliniceyespecialist">Eye Specialist :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={othercliniceyespecialist} onChange={(e) => setothercliniceyespecialist(e.target.value)} id="othercliniceyespecialist" name="othercliniceyespecialist" required  placeholder="Eye specialist name..."/>
                </div>
            </div>

            <div className="form-group flex  items-center mb-3">
               <label className=" w-[192px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]"htmlFor="otherclinicconsultationdate">Consulted Date: </label>     
               <input className=" h-10 w-114 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold" value={otherclinicconsultationdate} onChange={(e) => setotherclinicconsultationdate(e.target.value)} type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" /> </div>
       


            <div className="flex flex-col justify center items-center w-fit h-fit mt-5">

              {!otherclinicselectedimage && (<div onClick={otherclinichandleuploadclick}  className="  w-80 h-80 mt-5 flex justify-center items-center    rounded-2xl cursor-pointer transition-all" ><img src={addimage} className=" w-60 h-60 object-cover"/></div>
              )}      

              {otherclinicselectedimage && 
              (
                <div className="w-80 h-80 flex justify-center items-center relative rounded-2xl overflow-hidden">
               <div onClick={otherclinichandleremoveprofile} className="absolute top-0 right-0   flex justify-center items-center align-middle p-1 bg-[#333333] rounded-full hover:cursor-pointer transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/></div>
                <img onClick={() => setshowotherclinicrecordimage(true)} className=" cursor-pointer hover:cursor-pointer object-cover w-80 h-80 rounded-2xl" src={otherclinicpreviewimage || defaultimageplaceholder}/></div>
              )}      
 
                                
                <input  className="hidden" type="file" onChange={otherclinichandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={otherclinicimageinputref} />
          


            {otherclinicselectedimage && otherclinicname !== "" && othercliniceyespecialist!== "" &&  otherclinicconsultationdate !== "" && (

         <button type="submit" disabled={otherclinicrecordissubmitting} className="submit-btn mt-12 w-full" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {otherclinicrecordissubmitting ? "Submitting..." : "Submit"}
         </button>
            )}      
            </div>
</div>

</form>


</div>




</div>)}


{showotherclinicrecordimage && (
<div className="p-5 overflow-hidden fixed inset-0 flex justify-center items-center z-999 bg-[#000000af] bg-opacity-50">
<div onClick={() => setshowotherclinicrecordimage(false)} className="absolute top-3 right-3 flex justify-center items-center align-middle p-1 bg-[#333333] rounded-full hover:cursor-pointer transition-all z-[1000]" ><i className="bx bx-x font-bold text-[30px] text-white"/></div>
{selectedpatientappointment?.patientotherclinicrecordimage ? (
<img 
src={selectedpatientappointment.patientotherclinicrecordimage.startsWith('data:') 
? selectedpatientappointment.patientotherclinicrecordimage 
: `data:image/jpeg;base64,${selectedpatientappointment.patientotherclinicrecordimage}`} 
alt="Other Clinic Record" 
className="max-w-full max-h-full" 
/>
) : (
<div className="text-white text-center">
<i className="bx bx-image text-6xl mb-4"></i>
<p className="text-xl">No image available</p>
</div>
)}
</div>
)}





{showotherclinicrecord && (

<div id="patientshowpatientaddothermedicalrecord" className="overflow-y-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="mt-30 mb-30 pl-5 pr-5 pb-5 bg-white rounded-2xl w-[800px] h-max  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">View Clinic Record</h1></div>
  <div onClick={() => setshowotherclinicrecord(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={submitotherclinicdata}>
<div className="px-2 pt-5 flex flex-col justify-center items-center  h-max w-full rounded-2xl ">
           <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="otherclinicname">Clinic :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={selectedpatientappointment.clinicname || ''} readOnly id="otherclinicname" name="otherclinicname" placeholder="Other clinic name..."/>
                </div>
            </div>


            <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="othercliniceyespecialist">Eye Specialist :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={selectedpatientappointment.eyespecialist || ''} readOnly id="othercliniceyespecialist" name="othercliniceyespecialist" placeholder="Eye specialist name..."/>
                </div>
            </div>

            <div className="form-group flex  items-center mb-3">
               <label className=" w-[192px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]"htmlFor="otherclinicconsultationdate">Consulted Date: </label>     
               <input className=" h-10 w-114 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold" value={selectedpatientappointment.date || ''} readOnly type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" /> </div>
       


            <MedicalRecordImageViewer 
              record={selectedpatientappointment}
              loadMedicalRecordImage={loadMedicalRecordImage}
              onImageClick={() => setshowotherclinicrecordimage(true)}
             
            />
                                
            <input  classNam="hover:cursor-pointer object-cover w-80 h-80" className="hidden" type="file" onChange={otherclinichandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={otherclinicimageinputref} />

</div>
</form>
</div>
</div>
)}







{showdeleteotherclinicrecorddialog && (

           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
             

                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Clinic Record</h1></div>
                <div className="mt-10 flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this clinic record?</p>
                    {selectedpatientappointment && ( <>
                              <p className="text-[16px] mt-5 font-albertsans ">Clinic Name: {selectedpatientappointment.clinicname}</p>
                              <p className="text-[16px] mt-2 font-albertsans">Eye Specialist: {selectedpatientappointment.eyespecialist}</p>
                              <p className="text-[16px] mt-2 font-albertsans">Consulted Date: {formatappointmatedates(selectedpatientappointment.date)}</p>
                              </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteotherclinicrecorddialog(false); setselectedpatientaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={deleteotherclinicrecord}><p className=" text-[#ffffff]">Delete</p></div>
                    </div>
                </div>

             </div>
           </div>

)}

  
</div> )}

{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}

























{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}

{ (activedashboard === 'inventorymanagement' && !isAdminRole) && ( <div id="inventorymanagement" className="pl-5 pr-5 pb-26 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-auto rounded-2xl flex flex-col" >   

<div className="flex items-center"><i className="bx bxs-package text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Inventory Management</h1></div>

<div className="flex justify-start items-center">
{/*<div onClick={() => showinventorytable('allinventorytable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeinventorytable ==='allinventorytable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeinventorytable ==='allinventorytable' ? 'text-white' : ''}`}>All</h1></div>*/}

{/* Show Ambher Optical tab only if admin or Ambher user */}
{(currentuserloggedin === 'Admin' || isAmbherOnlyUser()) && (
<div onClick={() => showinventorytable('ambherinventorytable')}  className={`opacity-0 hidden mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl  text-center flex justify-center items-center ${activeinventorytable ==='ambherinventorytable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeinventorytable ==='ambherinventorytable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
)}

{/* Show Bautista Eye Center tab only if admin or Bautista user */}
{(currentuserloggedin === 'Admin' || isBautistaOnlyUser()) && (
<div onClick={() => showinventorytable('bautistainventorytable')}  className={`opacity-0 hidden ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl  text-center flex justify-center items-center ${activeinventorytable ==='bautistainventorytable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeinventorytable ==='bautistainventorytable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
)}

</div>



  









{ activeinventorytable === 'ambherinventorytable' && ( <div id="ambherinventorytable" className="p-2 animate-fadeInUp border-[#909090] w-[100%] flex-1 min-h-0 rounded-2xl mt-5 flex flex-col" ref={inventoryContainerRef}>


{(cliniccriticalstockProducts.length > 0 || cliniclowstockProducts.length > 0 || clinicoutofstockProducts.length > 0) && (
<div >
{clinicoutofstockProducts.length > 0 && !hiddenAmbherOutOfStock && (
<div className=" border-red-600   flexitems-center p-5 w-full h-auto bg-red-100 rounded-2xl border-1 mb-2 relative">
<div 
  onClick={() => setHiddenAmbherOutOfStock(true)}
  className="absolute top-3 right-3 text-red-700 hover:text-red-900 hover:bg-red-200 rounded-full p-1 transition-all duration-200"
  title="Hide alert"
>
  <i className="bx bx-x text-lg"></i>
</div>
<div className="flex items-center">
<i className="bx bx-error text-red-700 text-2xl"></i>
<h1 className="ml-1 font-albertsans font-semibold text-red-900 text-[18px]">Out of Stock Alert</h1>
</div>

<div className="ml-1">
<p className="font-semibold text-red-900 text-[14px]"> {clinicoutofstockProducts.length} Item(s) are currently out of stock.</p>
</div>
</div>
)}

{cliniccriticalstockProducts.length > 0 && !hiddenAmbherCriticalStock && (
<div className="flexitems-center p-5 w-full h-auto bg-orange-100 rounded-2xl border-1 border-orange-500 mb-2 relative">
<div 
  onClick={() => setHiddenAmbherCriticalStock(true)}
  className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 hover:bg-orange-200 rounded-full p-1 transition-all duration-200"
  title="Hide alert"
>
  <i className="bx bx-x text-lg"></i>
</div>
<div className="flex items-center">
<i className="bx bx-error text-orange-600 text-2xl"></i>
<h1 className="ml-1 font-albertsans font-semibold text-orange-800 text-[18px]">Critical Stock Alert</h1>
</div>

<div className="ml-1">
<p className="font-semibold text-orange-800 text-[14px]">  {cliniccriticalstockProducts.length} Item(s) require immediate attention (3 or less in stock).</p>
</div>
</div>
)}

{cliniclowstockProducts.length > 0 && !hiddenAmbherLowStock && (
<div className="flexitems-center p-5 w-full h-auto bg-yellow-100 rounded-2xl border-1 border-yellow-400 mb-2 relative">
<div 
  onClick={() => setHiddenAmbherLowStock(true)}
  className="absolute top-3 right-3 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-200 rounded-full p-1 transition-all duration-200"
  title="Hide alert"
>
  <i className="bx bx-x text-lg"></i>
</div>
<div className="flex items-center">
<img src={cautionlowstockalert} className="w-8 h-8"></img>
<h1 className="ml-1 font-albertsans font-semibold text-yellow-700 text-[18px]">Low Stock Alert</h1>
</div>

<div className="ml-1">
<p className="font-semibold text-yellow-700 text-[14px]">  {cliniclowstockProducts.length} Item(s) need attention (4-6 in stock).</p>
</div>
</div>
)}</div>
)}



<div className="flex  items-start mt-5">

<div className="p-3   rounded-2xl w-[20%] h-full  mr-2 overflow-y-auto overflow-x-hidden">


  <div onClick={() => {setambherinventorycategorynamebox(null); setshowaddambherinventorycategorydialog(true);}}   className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#383838] rounded-3xl flex justify-center items-center px-4 py-2 transition-all duration-300 ease-in-out"><p className="font-semibold font-albertsans text-white text-[18px] ml-2">Manage Categories</p></div>
{/* Filter by Category Header */}
<div className="border-b-2 pb-3 flex items-center w-full mt-7">
<i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
<h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">
Filter by category
</h1>
</div>

{/* Category Filters (styled like Advanced Filters chips) */}
<div className="flex flex-wrap gap-2 mt-2 mb-4">
{/* All Category */}
<div
onClick={() => showambherinventorycategory('all')}
className={`w-full text-center justify-center cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center
${
activeambherinventorycategorytable === 'all'
? 'bg-[#2781af] text-white border-[#2781af]'
: 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
}`}
>
All
<span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
{ambherinventoryproducts.length}
</span>
</div>


{/* Dynamic Categories */}
{ambherinventorycategorylist.map(category => {
const productcount = ambherinventoryproducts.filter(
product => product.ambherinventoryproductcategory === category.ambherinventorycategoryname
).length;

return (
<div
key={category._id}
onClick={() =>
setactiveambherinventorycategorytable(category.ambherinventorycategoryname)
}
className={`w-full text-center justify-center cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center
${
activeambherinventorycategorytable === category.ambherinventorycategoryname
? 'bg-[#2781af] text-white border-[#2781af]'
: 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
}`}
>
{category.ambherinventorycategoryname}
<span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
{productcount}
</span>
</div>
);
})}
</div>



<div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Advanced Filters</h1></div>
{activeProductFilter !== 'all' && (
      <div
        className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md"
        
        onClick={() => setActiveProductFilter('all')}
      >
        Clear filter
      </div>
    )}

  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    {productFilters.map(filter => {
      // Count products matching this filter
      const count = ambherinventoryproducts.filter(product => {
        const nameDesc = `${product.ambherinventoryproductname || ''} ${product.ambherinventoryproductdescription || ''}`.toLowerCase();
        if (filter.id === 'polarized')
          return product.ambherinventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized');
        if (filter.id === 'kids')
          return product.ambherinventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid');
        if (filter.id === 'adults')
          return product.ambherinventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult');
        if (filter.id === 'men')
          return product.ambherinventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men');
        if (filter.id === 'women')
          return product.ambherinventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women');
        if (filter.id === 'unisex')
          return product.ambherinventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex');
        return false;
      }).length;
      return (
        <div key={filter.id}
          className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
            ${activeProductFilter === filter.id
              ? 'bg-[#2781af] rounded-2xl text-white'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
          onClick={() => setActiveProductFilter(filter.id)}
        >
          <span >{filter.label}</span>
          <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
            {count}
          </span>
        </div>
      );
    })}
  </div>
  
  <div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by price</h1></div>
  {pricesortingProducts !== 'none' && (
    <div
      className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
      onClick={() => setpricesortingProducts('none')}
    >
      Clear filter
    </div>
  )}
{/* Price filter options styled like Advanced Filters */}
<div className="flex flex-wrap gap-2 mt-2 mb-4">
<div
onClick={() => setpricesortingProducts('Highesttolowest')}
className={`text-center  w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
${
pricesortingProducts === 'Highesttolowest'
? 'bg-[#2781af] text-white border-[#2781af]'
: 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
}`}
>
Highest to Lowest
</div>

<div
onClick={() => setpricesortingProducts('Lowesttohighest')}
className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
${
pricesortingProducts === 'Lowesttohighest'
? 'bg-[#2781af] text-white border-[#2781af]'
: 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
}`}
>
Lowest to Highest
</div>
</div>

  {/* Quantity Filter for Ambher */}
  <div className="border-b-2 pb-3 flex items center w-full mt-7">
    <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
    <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by quantity</h1>
  </div>
  {quantitySortingProducts !== 'none' && (
    <div
      className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
      onClick={() => setQuantitySortingProducts('none')}
    >
      Clear filter
    </div>
  )}
  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    <div
      onClick={() => setQuantitySortingProducts('Highesttolowest')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${quantitySortingProducts === 'Highesttolowest'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Highest to Lowest
    </div>




    <div
      onClick={() => setQuantitySortingProducts('Lowesttohighest')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${quantitySortingProducts === 'Lowesttohighest'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Lowest to Highest
    </div>

   <div
      onClick={() => setQuantitySortingProducts('Outofstock')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${quantitySortingProducts === 'Outofstock'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Out of Stock
    </div>


    <div
      onClick={() => setQuantitySortingProducts('CriticalStock')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${quantitySortingProducts === 'CriticalStock'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Critical Stock (1-3)
    </div>
    

    <div
      onClick={() => setQuantitySortingProducts('LowStock')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${quantitySortingProducts === 'LowStock'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Low Stock (4-6)
    </div>


  </div>


{/*<div className=""> <AmbherinventorycategoryBox value={ambherinventorycategorynamebox} loading={loadingambherinventorycategorylist} onChange={(e) => setambherinventorycategorynamebox(e.target.value)} categories={ambherinventorycategorylist}/></div>*/}

</div>
<div className=" flex flex-col justify-start  ml-2 rounded-2xl w-[90%]  h-auto shadow-b-lg ">
<div className="flex justify-end items-center w-full h-[9%] rounded-2xl mb-2 mt-3"> <div onClick={() => setshowaddambherinventoryproductdialog(true)}  className="w-50 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx  bx-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Product</p></div> </div>

<div className="w-[100%] rounded-2xl flex-1 overflow-auto flex flex-wrap content-start gap-3 pl-2 pt-2 bg-[#ffffff]">
  
<div className="flex flex-col w-full">
  <div className="flex flex-wrap p-4 flex-1">
    {ambherloadingproducts ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {[...Array(8)].map((_, index) => (
          <InventorySkeleton key={index} />
        ))}
      </div>
    ): ambherinventoryproducts.length === 0 ? (
      <div>No Products Found...</div> 
    ):(
      (() => {
        const paginatedProducts = getPaginatedData(finalFilteredAmbherProducts, 'ambherInventory');
        return paginatedProducts.map((product) => (
<div key={product.ambherinventoryproductid} onClick={() => {setshowaddambherinventoryproductdialog(true);
                                                             setselectedambherproduct(product);
                                                             setcurrentimageindex(0);
                                                             setambherinventorycategorynamebox(product?.ambherinventoryproductcategory || '');
                                                             setaddambherinventoryproductname(product?.ambherinventoryproductname || '');
                                                             setaddambherinventoryproductbrand(product?.ambherinventoryproductbrand || '');
                                                             setaddambherinventoryproductmodelnumber(product?.ambherinventoryproductmodelnumber || '');
                                                             setaddambherinventoryproductdescription(product?.ambherinventoryproductdescription || '');
                                                             setaddambherinventoryproductprice(product?.ambherinventoryproductprice || 0);
                                                             setaddambherinventoryproductquantity(product?.ambherinventoryproductquantity || 0);
                                                             setaddambherinventoryproductimagepreviewimages(product?.ambherinventoryproductimagepreviewimages || []);
}} className="motion-preset-slide-up mr-3 mb-3 flex flex-col items-start justify-start w-[220px] h-auto shadow-md bg-white rounded-2xl ">
  <img src={product.ambherinventoryproductimagepreviewimages[0] || defaultimageplaceholder}  alt={product.ambherinventoryproductname} className={`rounded-tr-2xl  rounded-tl-2xl w-full h-45 ${product.ambherinventoryproductquantity === 0 ? 'opacity-50': ''}`}/>
  
  
  {product.ambherinventoryproductquantity === 0 ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-red-200"><h1 className="text-red-900">Out of Stock</h1></div>): 
   product.ambherinventoryproductquantity <= 3 ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-orange-200"><h1 className="text-orange-900">Critical Stock</h1></div>):
   product.ambherinventoryproductquantity <= 6 ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-yellow-200"><h1 className="text-yellow-900">Low Stock</h1></div>): null}


  <div className="mx-1  w-fit rounded-md py-1 px-2  rounded-1xl h-fit  bg-[#F0F6FF] mt-2 break-words min-w-0 "><h1 className={`font-medium   text-[13px] min-w-0 break-words text-[#0d0d0d] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`} >{product.ambherinventoryproductcategory}</h1></div>
  <div className="w-full h-auto ml-2 mt-2 "><h1 className={`font-semibold  text-[15px] min-w-0 break-words text-[#0d0d0d] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.ambherinventoryproductname}</h1></div>
  <div className="w-fit h-auto ml-2 mt-1 "><h1 className={`font-albertsans font-bold text-[18px] min-w-0 break-words ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>₱{Number(product.ambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1></div>
  <div className="w-full h-auto ml-2 mt-5 mb-1 "><h1 className={`font-albertsans font-medium  text-[15px] min-w-0 break-words ${product.ambherinventoryproductquantity === 0 ? 'text-red-600' : product.ambherinventoryproductquantity <= 3 ? 'text-orange-600' : product.ambherinventoryproductquantity <= 6 ? 'text-yellow-600' : 'text-[#4e4f4f]'}`}>{product.ambherinventoryproductquantity === 0 ? ('Out Of Stock'):(`In Stock: ${product.ambherinventoryproductquantity}${product.ambherinventoryproductquantity <= 3 ? ' (Critical)': product.ambherinventoryproductquantity <= 6 ? ' (Low)': ''}`)}</h1></div>   
  
  {/* Urgent Restock Alert - Show when out of stock but has wishlist items */}
  {product.ambherinventoryproductquantity === 0 && (wishlistCounts[product.ambherinventoryproductid] ?? 0) > 0 && (
    <div className="w-auto h-auto ml-2 mb-2">
      <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-r-md">
        <div className="flex items-center">
          <i className="bx bx-error text-red-500 text-lg mr-2"></i>
          <div>
            <h1 className="font-albertsans font-semibold text-red-700 text-[13px]">URGENT RESTOCK</h1>
            <p className="font-albertsans font-medium text-red-600 text-[12px]">
              {wishlistCounts[product.ambherinventoryproductid]} customer(s) waiting
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
  
  <div className="w-full h-auto ml-2 mb-1  flex items-center"> <p className="font-albertsans font-medium  text-[15px] text-[#4e4f4f]">Wishlisted: {wishlistCounts[product.ambherinventoryproductid] ?? 0}  </p></div>
  <div className="w-full h-auto ml-2 mb-3  flex items-center"> <p className="font-albertsans font-medium  text-[15px] text-[#4e4f4f]">Sold: {ambherproductsoldCounts[product.ambherinventoryproductid] ?? 0}  </p></div>
</div>  
        ));
      })()
    )}


  </div>

  {/* Pagination Component for Ambher Inventory */}
  {(() => {
    const totalProducts = finalFilteredAmbherProducts.length;
    
    return totalProducts > 0 && (
      <PaginationComponent
        currentPage={currentPage.ambherInventory}
        onPageChange={(page) => handlePageChange('ambherInventory', page)}
        totalItems={totalProducts}
        itemsPerPage={inventoryItemsPerPage}
        itemName="products"
      />
    );
  })()}
</div>

</div>
</div>
</div>
</div>)}








{/*Ambher Inventory Category*/}
{showaddambherinventorycategorydialog && (

<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Category Management</h1></div>
  <div onClick={() => setshowaddambherinventorycategorydialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<div className="flex flex-col justify-center items-center h-[84%] rounded-2xl w-full">
  <div className=" h-[10%] mb-2 mt-2 w-full rounded-2xl flex justify-end items-center">
        <div onClick={() => setshowaddambheraddinventorycategory(true)}  className="py-2 w-[200px] mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-categories text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Category</p></div>

  </div>
  <div  className="p-2  animate-fadeInUp flex  items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{ambherinventorycategorylist.length === 0 ? (
<div className="bg-yellow-100 w-full py-3 rounded-tl-2xl rounded-tr-2xl flex justify-center items-center"><h1 className="text-yellow-900 font-albertsans font-medium ">No Ambher Optical Inventory Categories</h1></div>
):(
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">Category</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Created By</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Date Created</th>


<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>




<tbody className="divide-y divide-gray-200 bg-white">
{loadingambherinventorycategorylist ? (
<>
{[...Array(5)].map((_, index) => (
<CategoryTableSkeleton key={index} />
))}
</>
): (
ambherinventorycategorylist.map((category) => (

<tr 
key={category._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>

<td className="px-5 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
{category.ambherinventorycategoryname}
</td>
<td className="px-5 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
<div className="flex items-center justify-center">
<img 
src={category.ambherinventorycategoryaddedbyprofilepicture || 'default-profile.png'}
alt="Profile" 
className="rounded-full h-12 w-12 object-cover mr-3"
onError={(e) => {
  e.target.src = 'default-profile.png';
}}
/>
<div>
<p className="font-medium">
  {category.ambherinventorycategoryaddedbyfirstname} {category.ambherinventorycategoryaddedbylastname}
</p>
<p className="text-gray-500 text-sm ">
  {category.ambherinventorycategoryaddedbytype}
</p>
</div>
</div>
</td>
<td className="px-5 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
{new Date(category.createdAt).toLocaleDateString()}
</td>
<td className="flex justify-center items-center  font-medium px-5 py-4 whitespace-nowrap text-sm  ">


<div onClick={() => {setshowdeleteambherinventorycategorydialog(true);
                  setselectedambherinventorycategory(category);}} className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>
</td>
</tr>
))
)}
</tbody>
</table>
)}

</div>
  </div>
</div>


</div>
</div>



)}

{showaddambheraddinventorycategory && (

<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[700px] h-[270px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Category Name</h1></div>
  <div onClick={() => setshowaddambheraddinventorycategory(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>
<form onSubmit={submitambherinventorycategory}>
<div className="flex flex-col justify-center items-center h-[84%] rounded-2xl w-full">
  <div className="  mt-10 h-auto  w-full rounded-2xl flex flex-col  justify-center items-end">
         <div className="w-full ">
            <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="lastname">Category Name :</label>
            <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-120"  value={ambherinventorycategorynameset} onChange={(e) => setambherinventorycategorynameset(e.target.value)} type="text" name="patientlastname" id="patientlastname"  required/></div>
       
            {ambherinventorycategorynamecheck && (
               <div className="mt-1 w-120">
                        <p className="text-gray-500  font-medium font-albertsans">Checking Category Name...</p>
               </div>
            )}
            
            {ambherinventorycategorynameexist && (
               <div className="mt-1 w-120">
                        <p className="text-red-500 font-medium font-albertsans">Category is already existing...</p>
               </div>
            )}



        <button type="submit" disabled={ambherinventorycategoryissubmitting} className="submit-btn mt-2 w-full" style={{ backgroundColor: "#4ca22b", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px", width: "200px"  }}>
          {ambherinventorycategoryissubmitting ? "Adding..." : "Add"}
        </button>       


  </div>
  <div className=" h-full w-full rounded-2xl"></div>

</div>
</form>
</div>
</div>

)}

{showdeleteambherinventorycategorydialog && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Inventory Category</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this category?</p>
                  {selectedambherinventorycategory && ( <>
                            <p className="text-[18px] mt-3">Category Name: {selectedambherinventorycategory.ambherinventorycategoryname}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setshowdeleteambherinventorycategorydialog(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                    <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => deleteambherinventorycategory()}><p className=" text-[#ffffff]">Delete</p></div>
                  </div>
              </div>

           </div>
         </div>
)}

{/*Ambher Inventory Product*/}
{showaddambherinventoryproductdialog && (

           <div className="overflow-y-auto h-auto  bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="motion-preset-fade  mt-10 pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-auto mb-10 animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">{selectedambherproduct ?  "Edit Product" : "Add Product"}</h1></div>
                    <div onClick={() => {setshowaddambherinventoryproductdialog(false);  resetaddambherinventoryproductdialog(); }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>

            <form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={selectedambherproduct ? handleupdateambherinventoryproduct : handlesubmitaddambherinventoryproduct}>
                  <div className="flex justify-center items-start bg-[#fcfcfc] rounded-2xl w-full h-auto">
                    <div className="pb-10 w-full h-full mr-15 rounded-2xl flex justify-center mt-5">



                        <div className="h-fit w-fit ">

                  <div className="relative">
                  <img  className="w-120 object-cover rounded-2xl h-120" src={(selectedambherproduct?.ambherinventoryproductimagepreviewimages?.[currentimageindex]) || (addambherinventoryproductimagepreviewimages?.[currentimageindex]) || defaultimageplaceholder}/>


                       {((selectedambherproduct?.ambherinventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addambherinventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <button type="button" onClick={handlepreviousimage}  className="bg-opacity-50 hover:bg-opacity-75 rounded-full text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-black"><i className="bx bx-chevron-left text-2xl" /></button>

                             <button type="button" onClick={handlenextimage}  className="rounded-full absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-black hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></button>

                           </>
                         )}
                       </div>
                        
                        
                          {addambherinventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 ">
                              {addambherinventoryproductimagepreviewimages.map((preview, index) => (
                                  <div key={index} className="relative">
                                  <img src={preview} className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${currentimageindex === index ? 'ring-2 ring-blue-500' : ''}`} />
                                  <button onClick={() => addambherinventoryproductimagehandleremove(index)}   className="absolute -top-2 -right-2  rounded-full p-1 hover:bg-red-600 bg-red-500 text-white  " > <i className="bx bx-x text-lg" /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        
                        
                          <input className="hidden"  multiple type="file" accept="image/jpeg, image/jpg, image/png" ref={addambherinventoryproductimageimageinputref} onChange={addambherinventoryproductimagehandlechange}    />

                          <div onClick={addambherinventoryproductimagehandleuploadclick} className="hover:cursor-pointer  hover:scale-105 transition-all mt-3 rounded-2xl flex justify-center items-center align-middle p-3 bg-[#0ea0cd]  " ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/>
                            <p className="text-white font-semibold text-[20px] ">Upload {addambherinventoryproductimagepreviewimages.length}/5 Images</p>

                          </div>
                        </div>









                    </div>

                    <div className="w-full h-auto flex items-start mb-10 rounded-2xl">
                          <div className=" w-full h-auto  rounded-4xl">
                    
                    

                          <div className="registration-container">
                       
                          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Product Details</h1>
                          {message.text && (
                            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
                              {message.text}
                            </div>
                          )}
                    
                          <h1 className=" font-albertsans font-semibold italic text-[#595968] text-[20px]">Let's add product inventory!</h1>
                    
                    
                    
                    
                          <div className="form-group mt-10  flex">
                          <label className="  font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="ambherinventorycategorynamebox">Category :</label>
                          <div className="flex flex-col">
                          <div className="ml-13"> <AmbherinventorycategoryBox  value={ambherinventorycategorynamebox} loading={loadingambherinventorycategorylist} onChange={(e) => setambherinventorycategorynamebox(e.target.value)} categories={ambherinventorycategorylist}/></div>
                          </div>
                          </div>
                    
                    
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addambherinventoryproductname">Product Name : </label>
                          <input className="bg-gray-200 text-[18px] text-gray-600 pl-3 rounded-2xl ml-1 h-10 w-70" placeholder="Enter Product Name..." type="text" name="addambherinventoryproductname" id="addambherinventoryproductname" value={addambherinventoryproductname} onChange={(e) => setaddambherinventoryproductname(e.target.value)} required /></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addambherinventoryproductbrand">Product Brand : </label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-1 h-10 w-70" placeholder="Enter Product Brand..." type="text" name="addambherinventoryproductbrand" id="addambherinventoryproductbrand" value={addambherinventoryproductbrand} onChange={(e) => setaddambherinventoryproductbrand(e.target.value)} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addambherinventoryproductmodelnumber">Model Number :</label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-2  h-10 w-70" placeholder="Enter Model Number..." type="text" name="addambherinventoryproductmodelnumber" id="addambherinventoryproductmodelnumber" value={addambherinventoryproductmodelnumber} onChange={(e) => setaddambherinventoryproductmodelnumber(e.target.value)} required/></div>
                    
                          <div className="form-group mt-5 flex flex-col">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addambherinventoryproductdescription">Product Description:</label>
                           <textarea className="w-full text-[18px]  text-gray-600 rounded-md  border-2  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={addambherinventoryproductdescription} onChange={(e) => {setaddambherinventoryproductdescription(e.target.value); adjusttextareaheight();}} placeholder="Product description..."/>
                          </div>

                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addambherinventoryproductprice">Price :</label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-2  h-10 w-70" placeholder="Enter Price..." type="number" name="addambherinventoryproductprice" id="addambherinventoryproductprice" value={addambherinventoryproductprice} onChange={(e) => setaddambherinventoryproductprice(e.target.value)} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addambherinventoryproductquantity">Quantity :</label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-2  h-10 w-70" placeholder="Enter Quantity..." type="number" name="addambherinventoryproductquantity" id="addambherinventoryproductquantity" value={addambherinventoryproductquantity} onChange={(e) => setaddambherinventoryproductquantity(e.target.value)} required/></div>
                    

                          <button type="submit" disabled={ambherinventoryproductissubmitting} className="submit-btn mt-12 w-full" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
                                      {ambherinventoryproductissubmitting 
                                     ? (selectedambherproduct ? "Updating..." : "Adding...") 
                                     : (selectedambherproduct ? "Update Product" : "Add Product")}
                          </button>
                        {selectedambherproduct && (
                         <div className="mt-3 w-full hover:cursor-pointer bg-[#4e0f0f] justify-center flex items-center  rounded-2xl h-fit w-fit px-7 py-3  transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteambherproduct(true); setselecteddeleteambherproduct(selectedambherproduct);}}><p className=" text-[#ffffff] font-semibold font-albertsans text-[20px]">Delete</p></div>

                        )}

                    
                    
                          </div>
                  
                    
                    
                          </div>

                    </div>
                  </div>
                  </form>
             </div>
           </div>


)}



{showdeleteambherproduct && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Ambher Optical Product</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this product?</p>
                  {selecteddeleteambherproduct && ( <>
                            <p className="text-[18px] mt-3">Product Name: {selecteddeleteambherproduct.ambherinventoryproductname}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setshowdeleteambherproduct(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                        {selectedambherproduct && (
                   <button type="button" onClick={deleteambherproduct}  className="submit-btn w-full" style={{ backgroundColor: "#4e0f0f", fontSize: "20px", color: "white", borderRadius: "20px", width: "120px"}}>
                      Delete
                   </button>)} 






                  </div>
              </div>

           </div>
         </div>
)}


















{ activeinventorytable === 'bautistainventorytable' && ( <div id="bautistainventorytable" className="p-2 animate-fadeInUp border-[#909090] w-[100%] flex-1 min-h-0 rounded-2xl mt-5 flex flex-col" ref={inventoryContainerRef}>

{(cliniccriticalstockProducts.length > 0 || cliniclowstockProducts.length > 0 || clinicoutofstockProducts.length > 0) && (
<div >
{clinicoutofstockProducts.length > 0 && !hiddenBautistaOutOfStock && (
<div className=" border-red-600   flexitems-center p-5 w-full h-auto bg-red-100 rounded-2xl border-1 mb-2 relative">
<div 
  onClick={() => setHiddenBautistaOutOfStock(true)}
  className="absolute top-3 right-3 text-red-700 hover:text-red-900 hover:bg-red-200 rounded-full p-1 transition-all duration-200"
  title="Hide alert"
>
  <i className="bx bx-x text-lg"></i>
</div>
<div className="flex items-center">
<i className="bx bx-error text-red-700 text-2xl"></i>
<h1 className="ml-1 font-albertsans font-semibold text-red-900 text-[18px]">Out of Stock Alert</h1>
</div>

<div className="ml-1">
<p className="font-semibold text-red-900 text-[14px]"> {clinicoutofstockProducts.length} Item(s) are currently out of stock.</p>
</div>
</div>
)}

{cliniccriticalstockProducts.length > 0 && !hiddenBautistaCriticalStock && (
<div className="flexitems-center p-5 w-full h-auto bg-orange-100 rounded-2xl border-1 border-orange-500 mb-2 relative">
<div 
  onClick={() => setHiddenBautistaCriticalStock(true)}
  className="absolute top-3 right-3 text-orange-600 hover:text-orange-800 hover:bg-orange-200 rounded-full p-1 transition-all duration-200"
  title="Hide alert"
>
  <i className="bx bx-x text-lg"></i>
</div>
<div className="flex items-center">
<i className="bx bx-error text-orange-600 text-2xl"></i>
<h1 className="ml-1 font-albertsans font-semibold text-orange-800 text-[18px]">Critical Stock Alert</h1>
</div>

<div className="ml-1">
<p className="font-semibold text-orange-800 text-[14px]">  {cliniccriticalstockProducts.length} Item(s) require immediate attention (3 or less in stock).</p>
</div>
</div>
)}

{cliniclowstockProducts.length > 0 && !hiddenBautistaLowStock && (
<div className="flexitems-center p-5 w-full h-auto bg-yellow-100 rounded-2xl border-1 border-yellow-400 mb-2 relative">
<div 
  onClick={() => setHiddenBautistaLowStock(true)}
  className="absolute top-3 right-3 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-200 rounded-full p-1 transition-all duration-200"
  title="Hide alert"
>
  <i className="bx bx-x text-lg"></i>
</div>
<div className="flex items-center">
<img src={cautionlowstockalert} className="w-8 h-8"></img>
<h1 className="ml-1 font-albertsans font-semibold text-yellow-700 text-[18px]">Low Stock Alert</h1>
</div>

<div className="ml-1">
<p className="font-semibold text-yellow-700 text-[14px]">  {cliniclowstockProducts.length} Item(s) need attention (4-6 in stock).</p>
</div>
</div>
)}</div>
)}



<div className="flex  items-start ">
<div className="p-3 shadow-b-lg  rounded-2xl w-[20%] h-full  mr-2 overflow-y-auto overflow-x-hidden">

  <div onClick={() => {setbautistainventorycategorynamebox(null); setshowaddbautistainventorycategorydialog(true);}}   className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#383838] rounded-3xl flex justify-center items-center px-4 py-2 transition-all duration-300 ease-in-out"><p className="font-semibold font-albertsans text-white text-[18px] ml-2">Manage Categories</p></div>
  <div className="border-b-2 pb-3 flex items center w-full mt-7"><i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" /><h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by category</h1></div>


  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    <div
      onClick={() => showbautistainventorycategory('all')}
      className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
        ${activebautistainventorycategorytable === 'all'
          ? 'bg-[#2781af] rounded-2xl text-white'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      <span>All</span>
      <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
        {bautistainventoryproducts.length}
      </span>
    </div>

    {bautistainventorycategorylist.map(category => {
      const productcount = bautistainventoryproducts.filter(product =>
        product.bautistainventoryproductcategory === category.bautistainventorycategoryname).length;
      return(
        <div key={category._id}
          onClick={() => setactivebautistainventorycategorytable(category.bautistainventorycategoryname)}
          className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
            ${activebautistainventorycategorytable === category.bautistainventorycategoryname
              ? 'bg-[#2781af] rounded-2xl text-white'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        >
          <span>{category.bautistainventorycategoryname}</span>
          <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
            {productcount}
          </span>
        </div>
      )
    })}
  </div>

  {/* Advanced Filters for Bautista */}
  <div className="border-b-2 pb-3 flex items center w-full mt-7">
    <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
    <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Advanced Filters</h1>
  </div>
  {activeBautistaProductFilter !== 'all' && (
    <div
      className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md"
      onClick={() => setActiveBautistaProductFilter('all')}
    >
      Clear filter
    </div>
  )}

  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    {bautistaProductFilters.map(filter => {
      // Count products matching this filter
      const count = bautistainventoryproducts.filter(product => {
        const nameDesc = `${product.bautistainventoryproductname || ''} ${product.bautistainventoryproductdescription || ''}`.toLowerCase();
        if (filter.id === 'polarized')
          return product.bautistainventoryproducttype?.toLowerCase().includes('polarized') || nameDesc.includes('polarized');
        if (filter.id === 'kids')
          return product.bautistainventoryproductfor?.toLowerCase().includes('kid') || nameDesc.includes('kid');
        if (filter.id === 'adults')
          return product.bautistainventoryproductfor?.toLowerCase().includes('adult') || nameDesc.includes('adult');
        if (filter.id === 'men')
          return product.bautistainventoryproductfor?.toLowerCase().includes('men') || nameDesc.includes('men');
        if (filter.id === 'women')
          return product.bautistainventoryproductfor?.toLowerCase().includes('women') || nameDesc.includes('women');
        if (filter.id === 'unisex')
          return product.bautistainventoryproductfor?.toLowerCase().includes('unisex') || nameDesc.includes('unisex');
        return false;
      }).length;
      return (
        <div key={filter.id}
          className={`cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium flex items-center justify-center w-full
            ${activeBautistaProductFilter === filter.id
              ? 'bg-[#2781af] rounded-2xl text-white'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
          onClick={() => setActiveBautistaProductFilter(filter.id)}
        >
          <span>{filter.label}</span>
          <span className="ml-2 bg-gray-200 text-gray-600 font-semibold px-2 rounded-full text-xs">
            {count}
          </span>
        </div>
      );
    })}
  </div>

  {/* Price Filter for Bautista */}
  <div className="border-b-2 pb-3 flex items center w-full mt-7">
    <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
    <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by price</h1>
  </div>
  {bautistaPriceSortingProducts !== 'none' && (
    <div
      className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
      onClick={() => setBautistaPriceSortingProducts('none')}
    >
      Clear filter
    </div>
  )}
  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    <div
      onClick={() => setBautistaPriceSortingProducts('Highesttolowest')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaPriceSortingProducts === 'Highesttolowest'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Highest to Lowest
    </div>

    <div
      onClick={() => setBautistaPriceSortingProducts('Lowesttohighest')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaPriceSortingProducts === 'Lowesttohighest'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Lowest to Highest
    </div>
  </div>

  {/* Quantity Filter for Bautista */}
  <div className="border-b-2 pb-3 flex items center w-full mt-7">
    <i className="bx bx-filter font-albertsans font-semibold text-[#363636] text-[25px]" />
    <h1 className="ml-2 text-[16px] font-albertsans font-semibold text-[#363636]">Filter by quantity</h1>
  </div>
  {bautistaQuantitySortingProducts !== 'none' && (
    <div
      className="text-center cursor-pointer px-4 py-1 rounded-2xl border border-[#2781af] bg-white text-[#2781af] font-medium transition-all duration-200 hover:bg-[#2781af] hover:text-white hover:shadow-md mt-2"
      onClick={() => setBautistaQuantitySortingProducts('none')}
    >
      Clear filter
    </div>
  )}
  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    <div
      onClick={() => setBautistaQuantitySortingProducts('Highesttolowest')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaQuantitySortingProducts === 'Highesttolowest'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Highest to Lowest
    </div>

    <div
      onClick={() => setBautistaQuantitySortingProducts('Lowesttohighest')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaQuantitySortingProducts === 'Lowesttohighest'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Lowest to Highest
    </div>

    <div
      onClick={() => setBautistaQuantitySortingProducts('Outofstock')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaQuantitySortingProducts === 'Outofstock'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Out of Stock
    </div>

    <div
      onClick={() => setBautistaQuantitySortingProducts('CriticalStock')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaQuantitySortingProducts === 'CriticalStock'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Critical Stock (1-3)
    </div>


    <div
      onClick={() => setBautistaQuantitySortingProducts('LowStock')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaQuantitySortingProducts === 'LowStock'
          ? 'bg-[#2781af] text-white border-[#2781af]'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
    >
      Low Stock (4-6)
    </div>


  </div>


{/*<div className=""> <AmbherinventorycategoryBox value={bautistainventorycategorynamebox} loading={loadingbautistainventorycategorylist} onChange={(e) => setbautistainventorycategorynamebox(e.target.value)} categories={bautistainventorycategorylist}/></div>*/}

</div>
<div className=" flex flex-col justify-start  ml-2 rounded-2xl w-[90%]  h-auto shadow-b-lg ">
<div className="flex justify-end items-center w-full h-[9%] rounded-2xl mb-2 mt-3"> <div onClick={() => setshowaddbautistainventoryproductdialog(true)}  className="w-50 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx  bx-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Product</p></div> </div>

<div className="w-[100%] rounded-2xl flex-1 overflow-auto flex flex-wrap content-start gap-3 pl-2 pt-2 bg-[#ffffff]">
  
<div className="flex flex-col w-full">
  <div className="flex flex-wrap p-4 flex-1">
    {bautistaloadingproducts ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {[...Array(8)].map((_, index) => (
          <InventorySkeleton key={index} />
        ))}
      </div>
    ): bautistainventoryproducts.length === 0 ? (
      <div>No Products Found...</div> 
    ):(
      (() => {
        const paginatedProducts = getPaginatedData(finalFilteredBautistaProducts, 'bautistaInventory');
        return paginatedProducts.map((product) => (
<div key={product.bautistainventoryproductid} onClick={() => {setshowaddbautistainventoryproductdialog(true);
                                                             setselectedbautistaproduct(product);
                                                             setcurrentimageindex(0);
                                                             setbautistainventorycategorynamebox(product?.bautistainventoryproductcategory || '');
                                                             setaddbautistainventoryproductname(product?.bautistainventoryproductname || '');
                                                             setaddbautistainventoryproductbrand(product?.bautistainventoryproductbrand || '');
                                                             setaddbautistainventoryproductmodelnumber(product?.bautistainventoryproductmodelnumber || '');
                                                             setaddbautistainventoryproductdescription(product?.bautistainventoryproductdescription || '');
                                                             setaddbautistainventoryproductprice(product?.bautistainventoryproductprice || 0);
                                                             setaddbautistainventoryproductquantity(product?.bautistainventoryproductquantity || 0);
                                                             setaddbautistainventoryproductimagepreviewimages(product?.bautistainventoryproductimagepreviewimages || []);
}} className="motion-preset-slide-up mr-3 mb-3 flex flex-col items-start justify-start w-[220px] h-auto shadow-md bg-white rounded-2xl ">
  <img src={product.bautistainventoryproductimagepreviewimages[0] || defaultimageplaceholder}  alt={product.bautistainventoryproductname} className={`rounded-tr-2xl  rounded-tl-2xl w-full h-45 ${product.bautistainventoryproductquantity === 0 ? 'opacity-50': ''}`}/>
  
  
  {product.bautistainventoryproductquantity === 0 ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-red-200"><h1 className="text-red-900">Out of Stock</h1></div>): 
   product.bautistainventoryproductquantity <= 3 ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-orange-200"><h1 className="text-orange-900">Critical Stock</h1></div>):
   product.bautistainventoryproductquantity <= 6 ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-yellow-200"><h1 className="text-yellow-900">Low Stock</h1></div>): null}


  <div className="mx-1  w-fit rounded-md py-1 px-2  rounded-1xl h-fit  bg-[#F0F6FF] mt-2 break-words min-w-0 "><h1 className={`font-medium   text-[13px] min-w-0 break-words text-[#0d0d0d] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`} >{product.bautistainventoryproductcategory}</h1></div>
  <div className="w-full h-auto ml-2 mt-2 "><h1 className={`font-semibold  text-[15px] min-w-0 break-words text-[#0d0d0d] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.bautistainventoryproductname}</h1></div>
  <div className="w-fit h-auto ml-2 mt-1 "><h1 className={`font-albertsans font-bold text-[18px] min-w-0 break-words ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>₱{Number(product.bautistainventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1></div>
  <div className="w-full h-auto ml-2 mt-2  "><h1 className={`font-albertsans font-medium  text-[15px] min-w-0 break-words ${product.bautistainventoryproductquantity === 0 ? 'text-red-600' : product.bautistainventoryproductquantity <= 3 ? 'text-orange-600' : product.bautistainventoryproductquantity <= 6 ? 'text-yellow-600' : 'text-[#4e4f4f]'}`}>{product.bautistainventoryproductquantity === 0 ? ('Out Of Stock'):(`In Stock: ${product.bautistainventoryproductquantity}${product.bautistainventoryproductquantity <= 3 ? ' (Critical)': product.bautistainventoryproductquantity <= 6 ? ' (Low)': ''}`)}</h1></div>   
  
  {/* Urgent Restock Alert - Show when out of stock but has wishlist items */}
  {product.bautistainventoryproductquantity === 0 && (wishlistCounts[product.bautistainventoryproductid] ?? 0) > 0 && (
    <div className="w-auto h-auto ml-2 mb-2">
      <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded-r-md">
        <div className="flex items-center">
          <i className="bx bx-error text-red-500 text-lg mr-2"></i>
          <div>
            <h1 className="font-albertsans font-semibold text-red-700 text-[13px]">URGENT RESTOCK</h1>
            <p className="font-albertsans font-medium text-red-600 text-[12px]">
              {wishlistCounts[product.bautistainventoryproductid]} customer(s) waiting
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
  
  <div className="w-full h-auto ml-2 mb-1  flex items-center"> <p className="font-albertsans font-medium  text-[15px] text-[#4e4f4f]">Wishlisted: {wishlistCounts[product.bautistainventoryproductid] ?? 0}  </p></div>
  <div className="w-full h-auto ml-2 mb-3  flex items-center"> <p className="font-albertsans font-medium  text-[15px] text-[#4e4f4f]">Sold: {bautistaproductsoldCounts[product.bautistainventoryproductid] ?? 0}  </p></div>
</div>
        ));
      })()
    )}
  </div>

  {/* Pagination Component for Bautista Inventory */}
  {(() => {
    const totalProducts = finalFilteredBautistaProducts.length;
    
    return totalProducts > 0 && (
      <PaginationComponent
        currentPage={currentPage.bautistaInventory}
        onPageChange={(page) => handlePageChange('bautistaInventory', page)}
        totalItems={totalProducts}
        itemsPerPage={inventoryItemsPerPage}
        itemName="products"
      />
    );
  })()}
</div>

</div>
</div>
</div>

</div>)}




{/*Ambher Inventory Category*/}
{showaddbautistainventorycategorydialog && (

<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Category Management</h1></div>
  <div onClick={() => setshowaddbautistainventorycategorydialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<div className="flex flex-col justify-center items-center h-[84%] rounded-2xl w-full">
  <div className=" h-[10%] mb-2 mt-2 w-full rounded-2xl flex justify-end items-center">
        <div onClick={() => setshowaddbautistaaddinventorycategory(true)}  className="py-2 w-[200px] mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-categories text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Category</p></div>

  </div>
  <div  className="p-2  animate-fadeInUp flex  items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{bautistainventorycategorylist.length === 0 ? (
<div className="bg-yellow-100 w-full py-3 rounded-tl-2xl rounded-tr-2xl flex justify-center items-center"><h1 className="text-yellow-900 font-albertsans font-medium ">No Bautista Eye Center Inventory Categories</h1></div>
):(
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">Category</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Created By</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Date Created</th>


<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>




<tbody className="divide-y divide-gray-200 bg-white">
{loadingbautistainventorycategorylist ? (
<>
{[...Array(5)].map((_, index) => (
<CategoryTableSkeleton key={index} />
))}
</>
): (
bautistainventorycategorylist.map((category) => (

<tr 
key={category._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>

<td className="px-5 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
{category.bautistainventorycategoryname}
</td>
<td className="px-5 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
<div className="flex items-center justify-center">
<img 
src={category.bautistainventorycategoryaddedbyprofilepicture || 'default-profile.png'}
alt="Profile" 
className="rounded-full h-12 w-12 object-cover mr-3"
onError={(e) => {
  e.target.src = 'default-profile.png';
}}
/>
<div>
<p className="font-medium">
  {category.bautistainventorycategoryaddedbyfirstname} {category.bautistainventorycategoryaddedbylastname}
</p>
<p className="text-gray-500 text-sm ">
  {category.bautistainventorycategoryaddedbytype}
</p>
</div>
</div>
</td>
<td className="px-5 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
{new Date(category.createdAt).toLocaleDateString()}
</td>
<td className="flex justify-center items-center  font-medium px-5 py-4 whitespace-nowrap text-sm  ">


<div onClick={() => {setshowdeletebautistainventorycategorydialog(true);
                  setselectedbautistainventorycategory(category);}} className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>
</td>
</tr>
))
)}
</tbody>
</table>
)}

</div>
  </div>
</div>


</div>
</div>



)}

{showaddbautistaaddinventorycategory && (

<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[700px] h-[270px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Category Name</h1></div>
  <div onClick={() => setshowaddbautistaaddinventorycategory(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>
<form onSubmit={submitbautistainventorycategory}>
<div className="flex flex-col justify-center items-center h-[84%] rounded-2xl w-full">
  <div className="  mt-10 h-auto  w-full rounded-2xl flex flex-col  justify-center items-end">
         <div className="w-full ">
            <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="lastname">Category Name :</label>
            <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-120"  value={bautistainventorycategorynameset} onChange={(e) => setbautistainventorycategorynameset(e.target.value)} type="text" name="patientlastname" id="patientlastname"  required/></div>
       
            {bautistainventorycategorynamecheck && (
               <div className="mt-1 w-120">
                        <p className="text-gray-500  font-medium font-albertsans">Checking Category Name...</p>
               </div>
            )}
            
            {bautistainventorycategorynameexist && (
               <div className="mt-1 w-120">
                        <p className="text-red-500 font-medium font-albertsans">Category is already existing...</p>
               </div>
            )}



        <button type="submit" disabled={bautistainventorycategoryissubmitting} className="submit-btn mt-2 w-full" style={{ backgroundColor: "#4ca22b", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px", width: "200px"  }}>
          {bautistainventorycategoryissubmitting ? "Adding..." : "Add"}
        </button>       


  </div>
  <div className=" h-full w-full rounded-2xl"></div>

</div>
</form>
</div>
</div>

)}

{showdeletebautistainventorycategorydialog && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Inventory Category</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this category?</p>
                  {selectedbautistainventorycategory && ( <>
                            <p className="text-[18px] mt-3">Category Name: {selectedbautistainventorycategory.bautistainventorycategoryname}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setshowdeletebautistainventorycategorydialog(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                    <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => deletebautistainventorycategory()}><p className=" text-[#ffffff]">Delete</p></div>
                  </div>
              </div>

           </div>
         </div>
)}

{/*Ambher Inventory Product*/}
{showaddbautistainventoryproductdialog && (

           <div className="overflow-y-auto h-auto  bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="motion-preset-fade  mt-10 pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-auto mb-10 animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">{selectedbautistaproduct ?  "Edit Product" : "Add Product"}</h1></div>
                    <div onClick={() => {setshowaddbautistainventoryproductdialog(false);  resetaddbautistainventoryproductdialog(); }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>

            <form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={selectedbautistaproduct ? handleupdatebautistainventoryproduct : handlesubmitaddbautistainventoryproduct}>
                  <div className="flex justify-center items-start bg-[#fcfcfc] rounded-2xl w-full h-auto">
                    <div className="pb-10 w-full h-full mr-15 rounded-2xl flex justify-center mt-5">



                        <div className="h-fit w-fit ">

                  <div className="relative">
                  <img  className="w-120 object-cover rounded-2xl h-120" src={(selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.[bautistacurrentimageindex]) || (addbautistainventoryproductimagepreviewimages?.[bautistacurrentimageindex]) || defaultimageplaceholder}/>


                       {((selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addbautistainventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <button type="button" onClick={bautistahandlepreviousimage}  className="bg-opacity-50 hover:bg-opacity-75 rounded-full text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-black"><i className="bx bx-chevron-left text-2xl" /></button>

                             <button type="button" onClick={bautistahandlenextimage}  className="rounded-full absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-black hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></button>

                           </>
                         )}
                       </div>
                        
                        
                          {addbautistainventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 ">
                              {addbautistainventoryproductimagepreviewimages.map((preview, index) => (
                                  <div key={index} className="relative">
                                  <img src={preview} className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${bautistacurrentimageindex === index ? 'ring-2 ring-blue-500' : ''}`} />
                                  <button onClick={() => addbautistainventoryproductimagehandleremove(index)}   className="absolute -top-2 -right-2  rounded-full p-1 hover:bg-red-600 bg-red-500 text-white  " > <i className="bx bx-x text-lg" /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        
                        
                          <input className="hidden"  multiple type="file" accept="image/jpeg, image/jpg, image/png" ref={addbautistainventoryproductimageimageinputref} onChange={addbautistainventoryproductimagehandlechange}    />

                          <div onClick={addbautistainventoryproductimagehandleuploadclick} className="hover:cursor-pointer  hover:scale-105 transition-all mt-3 rounded-2xl flex justify-center items-center align-middle p-3 bg-[#0ea0cd]  " ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/>
                            <p className="text-white font-semibold text-[20px] ">Upload {addbautistainventoryproductimagepreviewimages.length}/5 Images</p>

                          </div>
                        </div>









                    </div>

                    <div className="w-full h-auto flex items-start mb-10 rounded-2xl">
                          <div className=" w-full h-auto  rounded-4xl">
                    
                    

                          <div className="registration-container">
                       
                          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Product Details</h1>
                          {message.text && (
                            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
                              {message.text}
                            </div>
                          )}
                    
                          <h1 className=" font-albertsans font-semibold italic text-[#595968] text-[20px]">Let's add product inventory!</h1>
                    
                    
                    
                    
                          <div className="form-group mt-10  flex">
                          <label className="  font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="bautistainventorycategorynamebox">Category :</label>
                          <div className="flex flex-col">
                          <div className="ml-13"> <BautistainventorycategoryBox  value={bautistainventorycategorynamebox} loading={loadingbautistainventorycategorylist} onChange={(e) => setbautistainventorycategorynamebox(e.target.value)} categories={bautistainventorycategorylist}/></div>
                          </div>
                          </div>
                    
                    
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addbautistainventoryproductname">Product Name : </label>
                          <input className="bg-gray-200 text-[18px] text-gray-600 pl-3 rounded-2xl ml-1 h-10 w-70" placeholder="Enter Product Name..." type="text" name="addbautistainventoryproductname" id="addbautistainventoryproductname" value={addbautistainventoryproductname} onChange={(e) => setaddbautistainventoryproductname(e.target.value)} required /></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addbautistainventoryproductbrand">Product Brand : </label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-1 h-10 w-70" placeholder="Enter Product Brand..." type="text" name="addbautistainventoryproductbrand" id="addbautistainventoryproductbrand" value={addbautistainventoryproductbrand} onChange={(e) => setaddbautistainventoryproductbrand(e.target.value)} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addbautistainventoryproductmodelnumber">Model Number :</label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-2  h-10 w-70" placeholder="Enter Model Number..." type="text" name="addbautistainventoryproductmodelnumber" id="addbautistainventoryproductmodelnumber" value={addbautistainventoryproductmodelnumber} onChange={(e) => setaddbautistainventoryproductmodelnumber(e.target.value)} required/></div>
                    
                          <div className="form-group mt-5 flex flex-col">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addbautistainventoryproductdescription">Product Description:</label>
                           <textarea className="w-full text-[18px]  text-gray-600 rounded-md  border-2  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={addbautistainventoryproductdescription} onChange={(e) => {setaddbautistainventoryproductdescription(e.target.value); adjusttextareaheight();}} placeholder="Product description..."/>
                          </div>

                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addbautistainventoryproductprice">Price :</label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-2  h-10 w-70" placeholder="Enter Price..." type="number" name="addbautistainventoryproductprice" id="addbautistainventoryproductprice" value={addbautistainventoryproductprice} onChange={(e) => setaddbautistainventoryproductprice(e.target.value)} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[19px]" htmlFor="addbautistainventoryproductquantity">Quantity :</label>
                          <input className="bg-gray-200 text-[18px]  text-gray-600 pl-3 rounded-2xl ml-2  h-10 w-70" placeholder="Enter Quantity..." type="number" name="addbautistainventoryproductquantity" id="addbautistainventoryproductquantity" value={addbautistainventoryproductquantity} onChange={(e) => setaddbautistainventoryproductquantity(e.target.value)} required/></div>
                    

                          <button type="submit" disabled={bautistainventoryproductissubmitting} className="submit-btn mt-12 w-full" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
                                      {bautistainventoryproductissubmitting 
                                     ? (selectedbautistaproduct ? "Updating..." : "Adding...") 
                                     : (selectedbautistaproduct ? "Update Product" : "Add Product")}
                          </button>
                        {selectedbautistaproduct && (
                         <div className="mt-3 w-full hover:cursor-pointer bg-[#4e0f0f] justify-center flex items-center  rounded-2xl h-fit w-fit px-7 py-3  transition-all duration-300 ease-in-out" onClick={() => {setshowdeletebautistaproduct(true); setselecteddeletebautistaproduct(selectedbautistaproduct);}}><p className=" text-[#ffffff] font-semibold font-albertsans text-[20px]">Delete</p></div>

                        )}

                    
                    
                          </div>
                  
                    
                    
                          </div>

                    </div>
                  </div>
                  </form>
             </div>
           </div>


)}



{showdeletebautistaproduct && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Bautista Eye Center Product</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this product?</p>
                  {selecteddeletebautistaproduct && ( <>
                            <p className="text-[18px] mt-3">Product Name: {selecteddeletebautistaproduct.bautistainventoryproductname}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setshowdeletebautistaproduct(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                        {selectedbautistaproduct && (
                   <button type="button" onClick={deletebautistaproduct}  className="submit-btn w-full" style={{ backgroundColor: "#4e0f0f", fontSize: "20px", color: "white", borderRadius: "20px", width: "120px"}}>
                      Delete
                   </button>)} 






                  </div>
              </div>

           </div>
         </div>
)}











</div> )}

{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}
{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}
{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}
{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}
{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}{/*End of Inventory Management*/}






{/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} 
{/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} 
{/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} 
{/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} 
{/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} {/*Start of Billings and Orders*/} 

{ (activedashboard === 'billingsandorders' && !isAdminRole) && ( <div id="billingsandorders"  className="pl-5 pr-5 pb-26 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] min-h-full h-auto rounded-2xl" >   

  <div className="flex items-center"><i className="bx bxs-receipt text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Billings and Orders</h1></div>
  
  <div className="flex justify-start items-center ">
  
  {/* Show Ambher Optical tab only if admin or Ambher user */}
  {(currentuserloggedin === 'Admin' || isAmbherOnlyUser()) && (
    <div onClick={() => showbillingsandorderstable('ambherbillingsandorderstable')}  className={`opacity-0 hidden mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl  text-center flex justify-center items-center ${activebillingsandorderstable ==='ambherbillingsandorderstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activebillingsandorderstable ==='ambherbillingsandorderstable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
  )}
  
  {/* Show Bautista Eye Center tab only if admin or Bautista user */}
  {(currentuserloggedin === 'Admin' || isBautistaOnlyUser()) && (
    <div onClick={() => showbillingsandorderstable('bautistabillingsandorderstable')}  className={`opacity-0 hidden ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl  text-center flex justify-center items-center ${activebillingsandorderstable ==='bautistabillingsandorderstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activebillingsandorderstable ==='bautistabillingsandorderstable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
  )}
  
  </div>






  { activebillingsandorderstable === 'ambherbillingsandorderstable' && ( <div id="ambherbillingsandorderstable" className="p-2  animate-fadeInUp  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
 <div className="ml-2 w-full flex  items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input value={searchambherTerm} onChange={(e) => setambherSearchTerm(e.target.value)} type="text" placeholder="Enter product name..."   className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
 <div className="mt-5 ml-2 w-full flex justify-between items-center font-semibold text-[#383838] font-albertsans ">
  <div className="flex items-center">
  <i className="bx bx-filter mr-2 text-[20px]"/>
 <h1 className="text-[15px] mr-8">Filter by status </h1>
 <div className="gap-2 flex">
 {['All', 'Pending', 'Ready for Pickup', 'Completed'].map((status) => {
   const statusCount = status === 'All' ? ambherorders.length : ambherorders.filter(order => order.patientorderambherstatus === status).length;
   
   return (
     <div key={status} onClick={() => setambherFilter(status)} className={`border-1 cursor-pointer transition-all duration-300 ease-in-out py-2 px-5 rounded-md text-[14px] ${ambherfilter === status ? 'bg-[#2781af] text-white' : 'hover:bg-[#2781af] hover:text-white'}`}>
       {status} <span className="bg-gray-200 text-gray-500 font-semibold px-2 rounded-full ml-2 text-sm">{statusCount}</span>
     </div>
   );
 })}
 </div>
 </div>
 <div className="flex justify-end items-center w-auto h-[9%] rounded-2xl mb-2 mt-3"> <div onClick={() => setshowpatientorderambher(true)}  className="w-50 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center  items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx  bx-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Set Order</p></div> </div>

 </div>


 <div className=" w-full h-auto mt-5">
{loadingAmbherOrders ? (
<OrderListSkeleton />
) : filteredambherOrders.length === 0 ? (
<div className="text-gray-500 p-4">No orders found</div>
) : (
filteredambherOrders.map((order) => (
    <div  key={order.ambherinventoryproductid} onClick={() => {
      setSelectedOrderForView(order);
      setShowViewOrderModal(true);
      setViewOrderCurrentImageIndex(0);
    }} className="hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer pb-7 shadow-md rounded-2xl py-3.25 px-3.25 mb-3 border-1 flex items-center motion-preset-slide-up w-full h-auto ">
     <img src={order.patientorderambherproductimage?.[0] || 'default-image-url'} alt={order.patientorderambherproductname}  className="mr-5 w-35 h-35 rounded-2xl"/>
      <div className="mt-2 h-auto w-full flex flex-col items-start">
          <div className="flex justify-between w-full"><h1 className="font-semibold font-albertsans text-[20px] text-[#1f1f1f]">{order.patientorderambherproductname}</h1>                  
      <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex ${
      order.patientorderambherstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
      order.patientorderambherstatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
      order.patientorderambherstatus === 'Ready for Pickup' ? 'bg-purple-100 text-purple-800' :
      order.patientorderambherstatus === 'Completed' ? 'bg-green-100 text-green-800' :
      'bg-red-100 text-red-800'
    }`}>
      {order.patientorderambherstatus}
    </span>  </div>
          <h1 className="font-semibold font-albertsans text-[13px] text-[#1f1f1f]">Customer: {order.patientfirstname} {order.patientmiddlename} {order.patientlastname}</h1>
          <div className=" mt-5 justify-between w-full flex items-center text-[#323232]  font-semibold text-[13px]">
            <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5  font-semibold text-[22px]"/><div><p className="text-[#777777] font-medium text-[13px]">Date Ordered</p><p className="text-[#303030]  font-semibold text-[15px]">{formatorderDates(order.createdAt)}</p></div></div>
            <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5  font-semibold text-[22px]"/><div><p className="text-[#777777] font-medium text-[13px]">Pickup at Ambher Optical</p><p className="text-[#303030]  font-semibold text-[15px]">{order.patientorderambherproductpickupstatus === 'Now'  ? `Completed (${formatorderDates(order.createdAt)})` : order.patientorderambherproductchosenpickupdate && order.patientorderambherproductchosenpickupdate !== 'Later' && order.patientorderambherproductchosenpickupdate !== 'Now' ? `Available for Pickup: ${formatorderDates(order.patientorderambherproductchosenpickupdate)}` : "To be scheduled"}</p></div></div>
            <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-package mt-0.5  font-semibold text-[22px]"/><div><p className="text-[#777777]  font-medium text-[13px]">Quantity</p><p className="text-[#303030]  font-semibold text-[15px]">{order.patientorderambherproductquantity}</p></div></div>
            <div className="flex items-center gap-1"><p className="font-semibold text-[22px] text-[#565656]">₱</p><div> <p className="text-[#777777]  font-medium text-[13px]">{Number(order.patientorderambheramountpaid) < Number(order.patientorderambherproducttotal) ? (<span className="px-1 py-.5 bg-yellow-100 text-yellow-900 font-alberstans rounded-md">Down Payment</span> ): "Amount Paid"}</p><p className="text-[#303030]  font-semibold text-[15px]">{Number(order.patientorderambheramountpaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div></div>
          </div>
          <div className="flex items-center justify-between border-t-2 w-full h-10 mt-5">
            <div></div>
            <div className="flex items-center gap-3 mt-5 h-auto"><h1 className="font-semibold font-albertsans text-[#343434] text-[17px]">Total Price: </h1><p className="font-semibold font-albertsans text-[25px] text-[#549013]">  ₱{Number(order.patientorderambherproducttotal).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div>
          </div>
      </div>
    </div>
))
)}
 </div>



  
  </div>)}



{showpatientorderambher && (

           <div className="overflow-y-auto h-auto px-10 bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="motion-preset-fade  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Set Order</h1></div>
                    <div onClick={() => {
                       setorderambherEmail('');
                       setorderambherprofilePicture('');
                       setorderambherfullName('');
                       setorderambherlastName('');
                       setorderambhermiddleName('');
                       setorderambherfirstName('');
                       setorderambhercontactNumber('');
                       setorderambherpickupplace('');
                       setorderambherdownPayment('');
                       setorderambhercustomFee('');
                       setorderambheramountPaid('');
                       setorderambherNotes('');
                       setactiveambherpickupnoworlater(null);
                       setambherCount(0); 
                       setambherpickupStatus('Later');
                       setambherproductsoldCount(0);
                       setselectedorderambherproduct(null);
                       setshowpatientorderambher(false);}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>


                  <div className="gap-2 mt-3 w-full h-auto  flex items-start justify-center">



                  <div className=" p-2 w-[25%] max-h-145  ">  
                    <div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input onChange={(e) => setsearchpatientorderambherTerm(e.target.value)} value={searchpatientorderambherTerm} type="text" placeholder="Enter product name..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
                  <div className="mt-2 p-2 w-full max-h-138 overflow-y-auto  "> 
  {ambherloadingproducts ? (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <InventorySkeleton key={index} />
      ))}
    </div>
  ): ambherinventoryproducts.length === 0 ? (
    <div>No Products Found...</div> 
  ):(
    [...filteredAmbherProducts]
  .filter(product => 
    product.ambherinventoryproductname.toLowerCase().includes(searchpatientorderambherTerm.toLowerCase())
  )
    .sort((a, b) => {
      const aquant = a.ambherinventoryproductquantity || 0;
      const bquant = b.ambherinventoryproductquantity || 0;
      return bquant - aquant;
    }).map((product) => (


        <div key={product.ambherinventoryproductid} onClick={() => {
                                                            console.log('Selecting product:', product);
                                                             setselectedorderambherproduct(product);
                                                             setorderambhercurrentimageindex(0);
                                                             setambherCount(1);
                                                             setorderambherinventorycategorynamebox(product?.ambherinventoryproductcategory || '');
                                                             setorderambherinventoryproductname(product?.ambherinventoryproductname || '');
                                                             setorderambherinventoryproductbrand(product?.ambherinventoryproductbrand || '');
                                                             setorderambherinventoryproductmodelnumber(product?.ambherinventoryproductmodelnumber || '');
                                                             setorderambherinventoryproductdescription(product?.ambherinventoryproductdescription || '');
                                                             setorderambherinventoryproductnotes(product?.ambherinventoryproductnotes || '');
                                                             setorderambherinventoryproductprice(product?.ambherinventoryproductprice || 0);
                                                             setorderambherinventoryproductquantity(product?.ambherinventoryproductquantity || 0);
                                                             setorderambherinventoryproductimagepreviewimages(product?.ambherinventoryproductimagepreviewimages || []);}}    className={`${product.ambherinventoryproductquantity == 0 ? 'opacity-50 relative' : ''} mb-2  items-center p-2 min-h-25 h-auto rounded-2xl border-1 hover:shadow-md hover:cursor-pointer transition-all duration-300 ease-in-out max-w-full`} >
             {product.ambherinventoryproductquantity == 0 && (
                            
                  <div className="absolute inset-0 flex items-center  justify-center"><h1 className="font-albertsans font-semibold bg-gray-200 text-lg  px-2 py-1 rounded-lg">Out of Stock</h1></div>
                    
              )}

                      <div  className="flex items-center">
                        <img src={product.ambherinventoryproductimagepreviewimages[0]} className="mr-2 w-18 h-18 rounded-md shrink-0"/>
                        <h1 className="ml-2 font-albertsans text-[#36454F] font-semibold text-[14px] break-words max-w-[200px] overflow-hidden">
                          {product.ambherinventoryproductname}
                        </h1>
                        </div>
                         <div className="w-full flex items-end justify-end  ">
                          <h1 className=" ml-2 font-albertsans font-medium text-[12px] break-words max-w-[200px] overflow-hidden">
                          Qty: {product.ambherinventoryproductquantity}
                        </h1>
                        </div>
                        
                      </div>
               
    ))
  )}


                      
                      
                  </div>

                   </div>
            <div className="w-[75%] min-h-100 h-auto ">

      {selectedorderambherproduct && (
               <div className="pb-20 motion-opacity-in-0  bg-[#fefefe] rounded-2xl w-full h-auto animate-fadeInUp ">



            <form className="flex flex-col  ml-15 mr-15 mt-5    pb-10" >
                  <div className=" flex justify-center items-start rounded-2xl w-full h-auto">
                    <div className=" pb-10 w-full h-full mr-15 rounded-2xl flex justify-center ">



                        <div className=" h-fit w-fit flex-none">

                  <div className=" relative">
                  

                  <img  className="mt-2 w-100 object-cover rounded-2xl h-100" src={(selectedorderambherproduct?.ambherinventoryproductimagepreviewimages?.[orderambhercurrentimageindex]) || defaultimageplaceholder}/>

                       {((selectedorderambherproduct?.ambherinventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addambherinventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <div type="button" onClick={orderambherhandlepreviousimage}  className="cursor-pointer bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-2xl" /></div>

                             <div type="button" onClick={orderambherhandlenextimage}  className="cursor-pointer rounded-2xl absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></div>

                           </>
                         )}

                        {orderambherinventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 p-4 border-y-1 rounded-2xl bg-[#fbfbfb]  items-center ">
                                {orderambherinventoryproductimagepreviewimages.map((preview, index) => (
                                    <div key={index} className="relative">
                                    <img 
                                        onClick={() => setorderambhercurrentimageindex(index)} 
                                        src={preview} 
                                        className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${orderambhercurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} 
                                    />
                                    </div>
                                ))}
                            </div>
                          )}

                       </div>
                        
                        

                        </div>



                    </div>
            
                    <div className="  w-full h-auto flex items-start mb-10 rounded-2xl min-w-0">
                          <div className=" w-[100%] h-auto  rounded-4xl">
                    
                    

                          <div className=" w-[100%] registration-container">

                      
                          <div className="flex items-center mx-1  w-fit  h-fit  mt-2 break-words min-w-0 "><h1 className="font-albertsans rounded-md py-1 px-2  rounded-1xl bg-[#F0F6FF] font-medium   text-[#0d0d0d]  min-w-0 break-words ">{orderambherinventorycategorynamebox}</h1>
                          <p className="font-albertsans ml-1">by</p>
                          <p className="font-albertsans ml-1 font-semibold  ">{orderambherinventoryproductbrand}</p>
                          </div>
                          
                       

                          <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-albertsans font-bold text-[#212121] text-[29px]">{orderambherinventoryproductname}</h1>
           
                          <div className="mt-1 flex items-center">
                            <img src={starimage} className="w-5 h-5"/>
                            <p className="font-albertsans ml-2 mt-1 text-[15px] font-semibold">4.8</p><span className="mt-1 text-[13px] pr-3 ml-2">(89 reviews)</span>
                            
                            <p className="mt-1 font-albertsans border-l-2  border-[#8c8c8c] pl-3  text-[13px]">{ambherproductsoldCount} sold</p>
                          </div>
          
                    
                          <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[40px]">₱{Number(orderambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                    
                          <p className="font-albertsans mt-6  font-medium text-[#020202] text-[18px]">Description</p>
                          <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3">{orderambherinventoryproductdescription}</p>
                        
                      <div className="gap-4 mt-15 flex items-center">
                            <p className="font-albertsans font-semibold ">Quantity:</p>
                          <div className="w-auto h-10  flex items-center justify-between border-1 rounded-2xl">
                            <div   className={`font-bold h-full w-10 bg-gray-100 rounded-l-2xl flex items-center justify-center cursor-pointer select-none ${ambhercount <= 1 ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }} type="button" onClick={() => setambherCount (c => Math.max(1, c - 1))}>-</div>

                                <input type="number" min="1" max={orderambherinventoryproductquantity}  value={ambhercount}
                                       onChange={(e) => {
                                         const ambhercountvalue = parseInt(e.target.value);
                                         if (!isNaN(ambhercountvalue)) {
                                           const clampedambhercountValue = Math.max(1, Math.min(orderambherinventoryproductquantity, ambhercountvalue));
                                           setambherCount(clampedambhercountValue);
                                         }
                                       }}
                                       className="w-16 text-center border-0 focus:outline-none font-semibold"/>
                                     
                            <div  className={`font-bold h-full w-10 bg-gray-100 rounded-r-2xl flex items-center justify-center cursor-pointer select-none  ${ambhercount >= orderambherinventoryproductquantity ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }}  type="button" onClick={() => setambherCount ((c) => Math.min(c + 1, orderambherinventoryproductquantity))}>+</div> 
                           </div>
                                 <p className="font-albertsans font-semibold text-[#616161] text-[14px]">{orderambherinventoryproductquantity} pieces available </p>
                         </div>


                     
                          </div>
                  

                    
                          </div>


                    </div>
                  </div>
                   <div className=" border-1 mt-10 p-5 w-full h-auto rounded-md ">
                   <div className="w-full  flex items-center justify-center"><h1 className=" font-albertsans text-[#184d85] text-[25px] font-bold">Product Order Form</h1> </div>

                <div className="flex items-start justify-center mt-10">                  
                   <div className="pb-2  w-[100%] h-[100%]">
                   <div className="flex items-center gap-2  ">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Customer Email : </h1>
                      <div><input value={orderambherEmail} onChange={(e) => setorderambherEmail(e.target.value)} type="text" placeholder="Enter customer email..."   className="transition-all duration-300 ease-in-out  px-5 py-1.5 rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                    {orderambhercheckEmail && ( <p className="text-gray-500 text-sm ml-1">Checking email...</p>)}
                      {orderambheremailError && (<p className="text-red-500 text-sm ml-1">Email does not exist</p>)}
                         </div>
                       
                   </div>

                   <div className="flex items-center gap-2 mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Full Name : </h1>
                      <input  readOnly value={orderambherfullName} onChange={(e) => setorderambherfullName(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] "></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Contact Number : </h1>
                      <input readOnly value={orderambhercontactNumber} onChange={(e) => setorderambhercontactNumber(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Clinic Address : </h1>
                      <select  
                        value={orderambherpickupplace} 
                        onChange={(e) => setorderambherpickupplace(e.target.value)} 
                        className="transition-all duration-300 ease-in-out min-w-14 w-56 max-w-56 pl-5 pr-10 py-1.5 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500 appearance-none"
                      >
                        <option value="">Select Clinic Address</option>
                        {clinicLocations
                          .filter(clinic => 
                            clinic.clinicType === (localStorage.getItem('staffclinic') || ownerownedclinic) && 
                            clinic.isActive && 
                            clinic.address?.fullAddress
                          )
                          .map((clinic, index) => (
                            <option key={clinic._id || index} value={clinic.address.fullAddress}>
                              {clinic.address.fullAddress}
                            </option>
                          ))
                        }
                      </select>
                   </div>                    

                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Custom Fee : </h1>
                      <input  value={orderambhercustomFee} onChange={(e) => setorderambhercustomFee(e.target.value)} type="text"   className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Amount Paid : </h1>
                      <input  value={orderambheramountPaid} onChange={(e) => setorderambheramountPaid(e.target.value)}  type="text" placeholder="50% for downpayment"  className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>
                  

                  {Number(orderambheramountPaid) >= Number(orderambhertotalwithFee) > 0 &&(
                      <div className="flex items-center gap-2  mt-3">
                              <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Pickup : </h1>
                              <div onClick={() => showambherpickupnoworlater('ambherorderpickupnow')}  className={`px-5 py-2 cursor-pointer mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl   text-center flex justify-center items-center ${activeambherpickupnoworlater ==='ambherorderpickupnow' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeambherpickupnoworlater ==='ambherorderpickupnow' ? 'text-white' : ''}`}>Now</h1></div>
                              <div onClick={() => showambherpickupnoworlater('ambherorderpickuplater')}  className={`px-5 py-2 cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl  text-center flex justify-center items-center ${activeambherpickupnoworlater ==='ambherorderpickuplater' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeambherpickupnoworlater ==='ambherorderpickuplater' ? 'text-white' : ''}`}>Later</h1></div>
                      </div>
                  )}


                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Order Notes : </h1>
                      <textarea className=" transition-all duration-300 ease-in-out  w-56 px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500" value={orderambherNotes} ref={textarearef} rows={1} style={{minHeight:'30px'}} type="text"  onChange={(e) =>  {setorderambherNotes(e.target.value); adjusttextareaheight();}} />
                   </div>


                   </div>

                   <div className="flex flex-col justify-center items-start w-[100%] h-[100%]">                
                   <div className="flex justify-center items-start w-[100%] h-[100%]">
                       <div className=" gap-2 flex flex-col h-full w-full "> 
                          <h1 className="text-[15px] font-albertsans font-semibold">Item Price </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Quantity </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Subtotal </h1>
                          <h1 className="text-[15px] w-full font-albertsans font-semibold">Customization Fee </h1> 
                          <h1 className="text-[15px] border-b-1 pb-2 w-full font-albertsans font-semibold">Discount </h1>     
                          <h1 className=" font-albertsans font-semibold text-[19px] mt-5">Overall Total </h1>
                          <h1 className=" w-full font-albertsans font-semibold">Amount Paid </h1> 
                          {Number(orderambheramountPaid) > Number(orderambhertotalwithFee) ? (
                           <h1 className=" w-full font-albertsans font-semibold">Change </h1>   
                          ):(
                           <h1 className=" w-full font-albertsans font-semibold">Remaining Balance </h1>       
                          )}
                          
                         
                       </div>
                       <div className=" flex flex-col items-end gap-2  justify-end h-full w-full "> 
                          <h1 className="font-albertsans font-medium text-[#242424]">₱ {Number(orderambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})} </h1>
                          <h1 className="font-albertsans font-semibold">x {ambhercount}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambherinventoryproductprice * ambhercount).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambhercustomFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className=" font-albertsans font-medium">0</h1>     
                          <h1 className="font-albertsans font-bold text-[#478d12] text-[25px] mt-3">₱ {Number(orderambhertotalwithFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambheramountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          {Number(orderambheramountPaid) > Number(orderambhertotalwithFee) ? (
                           <h1 className="font-albertsans font-medium">₱ {Number(orderambheramountpaidChange).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          ):(
                            <h1 className="font-albertsans font-medium">₱ {Number(orderambherremainingBalance).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          )}

                       </div> 


                   </div>

                  {(Number(orderambherremainingBalance) === 0 || Number(orderambheramountpaidChange) > 0) && activeambherpickupnoworlater==='ambherorderpickupnow' ? (
                    <div
                      onClick={(e) => submitpatientorderambher(e)} 
                      disabled={isSubmittingAmbherCompleteOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAmbherCompleteOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                      )}
                    </div>
                    ) : (
                   (Number(orderambheramountPaid) >= Number(orderambhertotalwithFee) * 0.50) || activeambherpickupnoworlater==='ambherorderpickuplater' ? (
                    <div
                      onClick={(e) => submitpatientpendingorderambher(e)}
                      disabled={isSubmittingAmbherPendingOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#F08000] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAmbherPendingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Set as Pending Order</p>
                      )}
                    </div>
                    ) : null)}
                      



                </div>   
                </div> 
                   </div>

                  </form>
             </div>
      )}
     



                        
                  </div>


                  </div>
             </div>
           </div>


  )}





{patientorderambherproductToast && (
<div className=" bottom-4 right-8  z-101   transform fixed " >
    <div key={patientorderambherproductisClicked ? 'added' : 'removed'}  className={` ${patientorderambherproductToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s]  motion-ease-spring-smooth' : 'motion-preset-slide-left'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
      {patientorderambherproductisClicked ? (          
         <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
      ) : (
        <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
      )}
      {patientorderambherproductToastMessage}

      <div  className={`rounded-b-2xl absolute bottom-0 left-0 h-1 bg-green-500 `}  style={{width: progressWidth,transition: 'width 4s linear' }}/>

    </div>

</div>  
)}



{showpatientorderedambher && (

           <div className="overflow-y-auto h-auto px-10 bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="motion-preset-fade  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">View Order </h1></div>
                    <div onClick={() => {
                       setorderambherEmail('');
                       setorderambherprofilePicture('');
                       setorderambherfullName('');
                       setorderambherlastName('');
                       setorderambhermiddleName('');
                       setorderambherfirstName('');
                       setorderambhercontactNumber('');
                       setorderambherpickupplace('');
                       setorderambherdownPayment('');
                       setorderambhercustomFee('');
                       setorderambheramountPaid('');
                       setorderambherNotes('');
                       setactiveambherpickupnoworlater(null);
                       setambherCount(0); 
                       setambherproductsoldCount(0);
                       setselectedorderambherproduct(null);
                       setshowpatientorderedambher(false);}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>




         


           <div className="pb-20 motion-opacity-in-0  bg-[#fefefe] rounded-2xl w-full h-auto animate-fadeInUp ">

            <form className="flex flex-col  ml-15 mr-15 mt-5    pb-10" >
                  <div className=" flex justify-center items-start rounded-2xl w-full h-auto">
                    <div className=" pb-10 w-full h-full mr-15 rounded-2xl flex justify-center ">



                        <div className=" h-fit w-fit flex-none">

                  <div className=" relative">
                  

                  <img  className="mt-2 w-100 object-cover rounded-2xl h-100" src={(selectedorderambherproduct?.ambherinventoryproductimagepreviewimages?.[orderambhercurrentimageindex]) || defaultimageplaceholder}/>

                       {((selectedorderambherproduct?.ambherinventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addambherinventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <div type="button" onClick={orderambherhandlepreviousimage}  className="cursor-pointer bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-2xl" /></div>

                             <div type="button" onClick={orderambherhandlenextimage}  className="cursor-pointer rounded-2xl absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></div>

                           </>
                         )}

                        {orderambherinventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 p-4 border-y-1 rounded-2xl bg-[#fbfbfb]  items-center ">
                                {orderambherinventoryproductimagepreviewimages.map((preview, index) => (
                                    <div key={index} className="relative">
                                    <img 
                                        onClick={() => setorderambhercurrentimageindex(index)} 
                                        src={preview} 
                                        className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${orderambhercurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} 
                                    />
                                    </div>
                                ))}
                            </div>
                          )}

                       </div>
                        
                        

                        </div>



                    </div>
            
                    <div className="  w-full h-auto flex items-start mb-10 rounded-2xl min-w-0">
                          <div className=" w-[100%] h-auto  rounded-4xl">
                    
                    

                          <div className=" w-[100%] registration-container">

                      
                          <div className="flex items-center mx-1  w-fit  h-fit  mt-2 break-words min-w-0 "><h1 className="font-albertsans rounded-md py-1 px-2  rounded-1xl bg-[#F0F6FF] font-medium   text-[#0d0d0d]  min-w-0 break-words ">{selectedorderambherproduct?.patientorderambherproductcategory}</h1>
                          <p className="font-albertsans ml-1">by</p>
                          <p className="font-albertsans ml-1 font-semibold  ">{selectedorderambherproduct?.patientorderambherproductbrand}</p>
                          </div>
                          
                       

                          <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-albertsans font-bold text-[#212121] text-[29px]">{selectedorderambherproduct?.patientorderambherproductname}</h1>
           
                          <div className="mt-1 flex items-center">
                            <img src={starimage} className="w-5 h-5"/>
                            <p className="font-albertsans ml-2 mt-1 text-[15px] font-semibold">4.8</p><span className="mt-1 text-[13px] pr-3 ml-2">(89 reviews)</span>
                            
                            <p className="mt-1 font-albertsans border-l-2  border-[#8c8c8c] pl-3  text-[13px]">{ambherproductsoldCount} sold</p>
                          </div>
          
                    
                          <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[40px]">₱{Number(selectedorderambherproduct?.patientorderambherproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                    
                          <p className="font-albertsans mt-6  font-medium text-[#020202] text-[18px]">Description</p>
                          <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3">{selectedorderambherproduct?.patientorderambherproductdescription}</p>
                        
                      <div className="gap-4 mt-15 flex items-center">
                            <p className="font-albertsans font-semibold ">Quantity:</p>
                          <div className="w-auto h-10  flex items-center justify-between border-1 rounded-2xl">
                            <div   className={`font-bold h-full w-10 bg-gray-100 rounded-l-2xl flex items-center justify-center cursor-pointer select-none ${ambhercount <= 1 ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }} type="button" onClick={() => setambherCount (c => Math.max(1, c - 1))}>-</div>

                                <input type="number" min="1" max={orderambherinventoryproductquantity}  value={ambhercount}
                                       onChange={(e) => {
                                         const ambhercountvalue = parseInt(e.target.value);
                                         if (!isNaN(ambhercountvalue)) {
                                           const clampedambhercountValue = Math.max(1, Math.min(orderambherinventoryproductquantity, ambhercountvalue));
                                           setambherCount(clampedambhercountValue);
                                         }
                                       }}
                                       className="w-16 text-center border-0 focus:outline-none font-semibold"/>
                                     
                            <div  className={`font-bold h-full w-10 bg-gray-100 rounded-r-2xl flex items-center justify-center cursor-pointer select-none  ${ambhercount >= orderambherinventoryproductquantity ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }}  type="button" onClick={() => setambherCount ((c) => Math.min(c + 1, orderambherinventoryproductquantity))}>+</div> 
                           </div>
                                 <p className="font-albertsans font-semibold text-[#616161] text-[14px]">{orderambherinventoryproductquantity} pieces available </p>
                         </div>


                     
                          </div>
                  

                    
                          </div>


                    </div>
                  </div>
                   <div className=" border-1 mt-10 p-5 w-full h-auto rounded-md ">
                   <div className="w-full  flex items-center justify-center"><h1 className=" font-albertsans text-[#184d85] text-[25px] font-bold">Product Order Form</h1> </div>

                <div className="flex items-start justify-center mt-10">                  
                   <div className="pb-2  w-[100%] h-[100%]">
                   <div className="flex items-center gap-2  ">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Customer Email : </h1>
                      <div><input value={orderambherEmail} onChange={(e) => setorderambherEmail(e.target.value)} type="text" placeholder="Enter customer email..."   className="transition-all duration-300 ease-in-out  px-5 py-1.5 rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                    {orderambhercheckEmail && ( <p className="text-gray-500 text-sm ml-1">Checking email...</p>)}
                      {orderambheremailError && (<p className="text-red-500 text-sm ml-1">Email does not exist</p>)}
                         </div>
                       
                   </div>

                   <div className="flex items-center gap-2 mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Full Name : </h1>
                      <input  readOnly value={orderambherfullName} onChange={(e) => setorderambherfullName(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] "></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Contact Number : </h1>
                      <input readOnly value={orderambhercontactNumber} onChange={(e) => setorderambhercontactNumber(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Clinic Address : </h1>
                      <select  
                        value={orderambherpickupplace} 
                        onChange={(e) => setorderambherpickupplace(e.target.value)} 
                        className="transition-all duration-300 ease-in-out min-w-14 w-56 max-w-56 px-5 py-1.5 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                      >
                        <option value="">Select Clinic Address</option>
                        {clinicLocations
                          .filter(clinic => 
                            clinic.clinicType === (localStorage.getItem('staffclinic') || ownerownedclinic) && 
                            clinic.isActive && 
                            clinic.address?.fullAddress
                          )
                          .map((clinic, index) => (
                            <option key={clinic._id || index} value={clinic.address.fullAddress}>
                              {clinic.address.fullAddress}
                            </option>
                          ))
                        }
                      </select>
                   </div>



                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Custom Fee : </h1>
                      <input  value={orderambhercustomFee} onChange={(e) => setorderambhercustomFee(e.target.value)} type="text"   className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Amount Paid : </h1>
                      <input  value={orderambheramountPaid} onChange={(e) => setorderambheramountPaid(e.target.value)}  type="text" placeholder="50% for downpayment"  className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>
                  

                  {Number(orderambheramountPaid) >= Number(orderambhertotalwithFee) > 0 &&(
                      <div className="flex items-center gap-2  mt-3">
                              <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Pickup : </h1>
                              <div onClick={() => showambherpickupnoworlater('ambherorderpickupnow')}  className={`px-5 py-2 cursor-pointer mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl   text-center flex justify-center items-center ${activeambherpickupnoworlater ==='ambherorderpickupnow' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeambherpickupnoworlater ==='ambherorderpickupnow' ? 'text-white' : ''}`}>Now</h1></div>
                              <div onClick={() => showambherpickupnoworlater('ambherorderpickuplater')}  className={`px-5 py-2 cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl  text-center flex justify-center items-center ${activeambherpickupnoworlater ==='ambherorderpickuplater' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeambherpickupnoworlater ==='ambherorderpickuplater' ? 'text-white' : ''}`}>Later</h1></div>
                      </div>
                  )}


                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Order Notes : </h1>
                      <textarea className=" transition-all duration-300 ease-in-out  w-56 px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500" value={orderambherNotes} ref={textarearef} rows={1} style={{minHeight:'30px'}} type="text"  onChange={(e) =>  {setorderambherNotes(e.target.value); adjusttextareaheight();}} />
                   </div>


                   </div>

                   <div className="flex flex-col justify-center items-start w-[100%] h-[100%]">                
                   <div className="flex justify-center items-start w-[100%] h-[100%]">
                       <div className=" gap-2 flex flex-col h-full w-full "> 
                          <h1 className="text-[15px] font-albertsans font-semibold">Item Price </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Quantity </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Subtotal </h1>
                          <h1 className="text-[15px] w-full font-albertsans font-semibold">Customization Fee </h1> 
                          <h1 className="text-[15px] border-b-1 pb-2 w-full font-albertsans font-semibold">Discount </h1>     
                          <h1 className=" font-albertsans font-semibold text-[19px] mt-5">Overall Total </h1>
                          <h1 className=" w-full font-albertsans font-semibold">Amount Paid </h1> 
                          {Number(orderambheramountPaid) > Number(orderambhertotalwithFee) ? (
                           <h1 className=" w-full font-albertsans font-semibold">Change </h1>   
                          ):(
                           <h1 className=" w-full font-albertsans font-semibold">Remaining Balance </h1>       
                          )}
                          
                         
                       </div>
                       <div className=" flex flex-col items-end gap-2  justify-end h-full w-full "> 
                          <h1 className="font-albertsans font-medium text-[#242424]">₱ {Number(orderambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})} </h1>
                          <h1 className="font-albertsans font-semibold">x {ambhercount}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambherinventoryproductprice * ambhercount).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambhercustomFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className=" font-albertsans font-medium">0</h1>     
                          <h1 className="font-albertsans font-bold text-[#478d12] text-[25px] mt-3">₱ {Number(orderambhertotalwithFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderambheramountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          {Number(orderambheramountPaid) > Number(orderambhertotalwithFee) ? (
                           <h1 className="font-albertsans font-medium">₱ {Number(orderambheramountpaidChange).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          ):(
                            <h1 className="font-albertsans font-medium">₱ {Number(orderambherremainingBalance).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          )}

                       </div> 


                   </div>

                  {(Number(orderambherremainingBalance) === 0 || Number(orderambheramountpaidChange) > 0) && activeambherpickupnoworlater==='ambherorderpickupnow' ? (
                    <div
                      onClick={(e) => submitpatientorderambher(e)} 
                      disabled={isSubmittingAmbherCompleteOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAmbherCompleteOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                      )}
                    </div>
                    ) : (
                   (Number(orderambheramountPaid) >= Number(orderambhertotalwithFee) * 0.50) || activeambherpickupnoworlater==='ambherorderpickuplater' ? (
                    <div 
                      onClick={(e) => submitpatientpendingorderambher(e)} 
                      disabled={isSubmittingAmbherPendingOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#F08000] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingAmbherPendingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Set as Pending Order</p>
                      )}
                    </div>
                    ) : null)}
                      



                </div>   
                </div> 
                   </div>

                  </form>
             </div>
     
     



                        
                


                  </div>
             </div>
     


  )}































  
  { activebillingsandorderstable === 'bautistabillingsandorderstable' && ( <div id="bautistabillingsandorderstable" className="p-2  animate-fadeInUp  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
 <div className="ml-2 w-full flex  items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input value={searchbautistaTerm} onChange={(e) => setbautistaSearchTerm(e.target.value)} type="text" placeholder="Enter product name..."   className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
 <div className="mt-5 ml-2 w-full flex justify-between items-center font-semibold text-[#383838] font-albertsans ">
  <div className="flex items-center">
  <i className="bx bx-filter mr-2 text-[20px]"/>
 <h1 className="text-[15px] mr-8">Filter by status </h1>
 <div className="gap-2 flex">
 {['All', 'Pending', 'Ready for Pickup', 'Completed'].map((status) => {
   const statusCount = status === 'All' ? bautistaorders.length : bautistaorders.filter(order => order.patientorderbautistastatus === status).length;
   
   return (
     <div key={status} onClick={() => setbautistaFilter(status)} className={`border-1 cursor-pointer transition-all duration-300 ease-in-out py-2 px-5 rounded-md text-[14px] ${bautistafilter === status ? 'bg-[#2781af] text-white' : 'hover:bg-[#2781af] hover:text-white'}`}>
       {status} <span className="bg-gray-200 text-gray-500 font-semibold px-2 rounded-full ml-2 text-sm">{statusCount}</span>
     </div>
   );
 })}
 </div>
 </div>
 <div className="flex justify-end items-center w-auto h-[9%] rounded-2xl mb-2 mt-3"> <div onClick={() => setshowpatientorderbautista(true)}  className="w-50 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center  items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx  bx-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Set Order</p></div> </div>

 </div>


 <div className=" w-full h-auto mt-5">
{loadingBautistaOrders ? (
<OrderListSkeleton />
) : filteredbautistaOrders.length === 0 ? (
<div className="text-gray-500 p-4">No orders found</div>
) : (
filteredbautistaOrders.map((order) => (
    <div  key={order.ambherinventoryproductid} onClick={() => {
      setSelectedOrderForView(order);
      setShowViewOrderModal(true);
      setViewOrderCurrentImageIndex(0);
    }} className="hover:bg-gray-100 transition-all duration-300 ease-in-out cursor-pointer pb-7 shadow-md rounded-2xl py-3.25 px-3.25 mb-3 border-1 flex items-center motion-preset-slide-up w-full h-auto ">
     <img src={order.patientorderbautistaproductimage?.[0] || 'default-image-url'} alt={order.patientorderbautistaproductname}  className="mr-5 w-35 h-35 rounded-2xl"/>
      <div className="mt-2 h-auto w-full flex flex-col items-start">
          <div className="flex justify-between w-full"><h1 className="font-semibold font-albertsans text-[20px] text-[#1f1f1f]">{order.patientorderbautistaproductname}</h1>                   <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex ${
      order.patientorderbautistastatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
      order.patientorderbautistastatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
      order.patientorderbautistastatus === 'Ready for Pickup' ? 'bg-purple-100 text-purple-800' :
      order.patientorderbautistastatus === 'Completed' ? 'bg-green-100 text-green-800' :
      'bg-red-100 text-red-800'
    }`}>
      {order.patientorderbautistastatus}
    </span>  </div>
          <h1 className="font-semibold font-albertsans text-[13px] text-[#1f1f1f]">Customer: {order.patientfirstname} {order.patientmiddlename} {order.patientlastname}</h1>
          <div className=" mt-5 justify-between w-full flex items-center text-[#323232]  font-semibold text-[13px]">
            <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5  font-semibold text-[22px]"/><div><p className="text-[#777777] font-medium text-[13px]">Date Ordered</p><p className="text-[#303030]  font-semibold text-[15px]">{formatorderDates(order.createdAt)}</p></div></div>
            <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-calendar mt-0.5  font-semibold text-[22px]"/><div><p className="text-[#777777] font-medium text-[13px]">Pickup at Bautista Eye Center</p><p className="text-[#303030]  font-semibold text-[15px]">{order.patientorderbautistaproductpickupstatus === 'Now'  ? `Completed (${formatorderDates(order.createdAt)})` : order.patientorderbautistaproductchosenpickupdate && order.patientorderbautistaproductchosenpickupdate !== 'Later' && order.patientorderbautistaproductchosenpickupdate !== 'Now' ? `Available for Pickup: ${formatorderDates(order.patientorderbautistaproductchosenpickupdate)}` : "To be scheduled"}</p></div></div>
            <div className="flex items-center gap-1"><i className="text-[#565656] bx bxs-package mt-0.5  font-semibold text-[22px]"/><div><p className="text-[#777777]  font-medium text-[13px]">Quantity</p><p className="text-[#303030]  font-semibold text-[15px]">{order.patientorderbautistaproductquantity}</p></div></div>
            <div className="flex items-center gap-1"><p className="font-semibold text-[22px] text-[#565656]">₱</p><div> <p className="text-[#777777]  font-medium text-[13px]">{Number(order.patientorderbautistaamountpaid) < Number(order.patientorderbautistaproducttotal) ? (<span className="px-1 py-.5 bg-yellow-100 text-yellow-900 font-alberstans rounded-md">Down Payment</span> ): "Amount Paid"}</p><p className="text-[#303030]  font-semibold text-[15px]">{Number(order.patientorderbautistaamountpaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div></div>
          </div>
          <div className="flex items-center justify-between border-t-2 w-full h-10 mt-5">
            <div></div>
            <div className="flex items-center gap-3 mt-5 h-auto"><h1 className="font-semibold font-albertsans text-[#343434] text-[17px]">Total Price: </h1><p className="font-semibold font-albertsans text-[25px] text-[#549013]">  ₱{Number(order.patientorderbautistaproducttotal).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p></div>
          </div>
      </div>
    </div>
))
)}
 </div>



  
  </div>)}



{showpatientorderbautista && (

           <div className="overflow-y-auto h-auto px-10 bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="motion-preset-fade  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Set Order</h1></div>
                    <div onClick={() => {
                       setorderbautistaEmail('');
                       setorderbautistaprofilePicture('');
                       setorderbautistafullName('');
                       setorderbautistalastName('');
                       setorderbautistamiddleName('');
                       setorderbautistafirstName('');
                       setorderbautistacontactNumber('');
                       setorderbautistadownPayment('');
                       setorderbautistacustomFee('');
                       setorderbautistapickupplace('');
                       setorderbautistaamountPaid('');
                       setorderbautistaNotes('');
                       setactivebautistapickupnoworlater(null);
                       setbautistaCount(0); 
                       setambherpickupStatus('Later');
                       setbautistaproductsoldCount(0);
                       setselectedorderbautistaproduct(null);
                       setshowpatientorderbautista(false);}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>                               


                  <div className="gap-2 mt-3 w-full h-auto  flex items-start justify-center">



                  <div className=" p-2 w-[25%] max-h-145  ">  
                    <div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input onChange={(e) => setsearchpatientorderbautistaTerm(e.target.value)} value={searchpatientorderbautistaTerm} type="text" placeholder="Enter product name..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
                  <div className="mt-2 p-2 w-full max-h-138 overflow-y-auto  "> 
  {bautistaloadingproducts ? (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <InventorySkeleton key={index} />
      ))}
    </div>
  ): bautistainventoryproducts.length === 0 ? (
    <div>No Products Found...</div> 
  ):(
    [...filteredBautistaProducts]
  .filter(product => 
    product.bautistainventoryproductname.toLowerCase().includes(searchpatientorderbautistaTerm.toLowerCase())
  )
    .sort((a, b) => {
      const aquant = a.bautistainventoryproductquantity || 0;
      const bquant = b.bautistainventoryproductquantity || 0;
      return bquant - aquant;
    }).map((product) => (


        <div key={product.bautistainventoryproductid} onClick={() => {
                                                            console.log('Selecting product:', product);
                                                             setselectedorderbautistaproduct(product);
                                                             setorderbautistacurrentimageindex(0);
                                                             setbautistaCount(1);
                                                             setorderbautistainventorycategorynamebox(product?.bautistainventoryproductcategory || '');
                                                             setorderbautistainventoryproductname(product?.bautistainventoryproductname || '');
                                                             setorderbautistainventoryproductbrand(product?.bautistainventoryproductbrand || '');
                                                             setorderbautistainventoryproductmodelnumber(product?.bautistainventoryproductmodelnumber || '');
                                                             setorderbautistainventoryproductdescription(product?.bautistainventoryproductdescription || '');
                                                             setorderbautistainventoryproductprice(product?.bautistainventoryproductprice || 0);
                                                             setorderbautistainventoryproductquantity(product?.bautistainventoryproductquantity || 0);
                                                             setorderbautistainventoryproductimagepreviewimages(product?.bautistainventoryproductimagepreviewimages || []);}}    className={`${product.bautistainventoryproductquantity == 0 ? 'opacity-50 relative' : ''} mb-2  items-center p-2 min-h-25 h-auto rounded-2xl border-1 hover:shadow-md hover:cursor-pointer transition-all duration-300 ease-in-out max-w-full`} >
             {product.bautistainventoryproductquantity == 0 && (
                            
                  <div className="absolute inset-0 flex items-center  justify-center"><h1 className="font-albertsans font-semibold bg-gray-200 text-lg  px-2 py-1 rounded-lg">Out of Stock</h1></div>
                    
              )}

                      <div  className="flex items-center">
                        <img src={product.bautistainventoryproductimagepreviewimages[0]} className="mr-2 w-18 h-18 rounded-md shrink-0"/>
                        <h1 className="ml-2 font-albertsans text-[#36454F] font-semibold text-[14px] break-words max-w-[200px] overflow-hidden">
                          {product.bautistainventoryproductname}
                        </h1>
                        </div>
                         <div className="w-full flex items-end justify-end  ">
                          <h1 className=" ml-2 font-albertsans font-medium text-[12px] break-words max-w-[200px] overflow-hidden">
                          Qty: {product.bautistainventoryproductquantity}
                        </h1>
                        </div>
                        
                      </div>
               
    ))
  )}


                      
                      
                  </div>

                   </div>
            <div className="w-[75%] min-h-100 h-auto ">

      {selectedorderbautistaproduct && (
               <div className="pb-20 motion-opacity-in-0  bg-[#fefefe] rounded-2xl w-full h-auto animate-fadeInUp ">



            <form className="flex flex-col  ml-15 mr-15 mt-5    pb-10" >
                  <div className=" flex justify-center items-start rounded-2xl w-full h-auto">
                    <div className=" pb-10 w-full h-full mr-15 rounded-2xl flex justify-center ">



                        <div className=" h-fit w-fit flex-none">

                  <div className=" relative">
                  

                  <img  className="mt-2 w-100 object-cover rounded-2xl h-100" src={(selectedorderbautistaproduct?.bautistainventoryproductimagepreviewimages?.[orderbautistacurrentimageindex]) || defaultimageplaceholder}/>

                       {((selectedorderbautistaproduct?.bautistainventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addbautistainventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <div type="button" onClick={orderbautistahandlepreviousimage}  className="cursor-pointer bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-2xl" /></div>

                             <div type="button" onClick={orderbautistahandlenextimage}  className="cursor-pointer rounded-2xl absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></div>

                           </>
                         )}

                        {orderbautistainventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 p-4 border-y-1 rounded-2xl bg-[#fbfbfb]  items-center ">
                                {orderbautistainventoryproductimagepreviewimages.map((preview, index) => (
                                    <div key={index} className="relative">
                                    <img 
                                        onClick={() => setorderbautistacurrentimageindex(index)} 
                                        src={preview} 
                                        className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${orderbautistacurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} 
                                    />
                                    </div>
                                ))}
                            </div>
                          )}

                       </div>
                        
                        

                        </div>



                    </div>
            
                    <div className="  w-full h-auto flex items-start mb-10 rounded-2xl min-w-0">
                          <div className=" w-[100%] h-auto  rounded-4xl">
                    
                    

                          <div className=" w-[100%] registration-container">

                      
                          <div className="flex items-center mx-1  w-fit  h-fit  mt-2 break-words min-w-0 "><h1 className="font-albertsans rounded-md py-1 px-2  rounded-1xl bg-[#F0F6FF] font-medium   text-[#0d0d0d]  min-w-0 break-words ">{orderbautistainventorycategorynamebox}</h1>
                          <p className="font-albertsans ml-1">by</p>
                          <p className="font-albertsans ml-1 font-semibold  ">{orderbautistainventoryproductbrand}</p>
                          </div>
                          
                       

                          <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-albertsans font-bold text-[#212121] text-[29px]">{orderbautistainventoryproductname}</h1>
           
                          <div className="mt-1 flex items-center">
                            <img src={starimage} className="w-5 h-5"/>
                            <p className="font-albertsans ml-2 mt-1 text-[15px] font-semibold">4.8</p><span className="mt-1 text-[13px] pr-3 ml-2">(89 reviews)</span>
                            
                            <p className="mt-1 font-albertsans border-l-2  border-[#8c8c8c] pl-3  text-[13px]">{bautistaproductsoldCount} sold</p>
                          </div>
          
                    
                          <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[40px]">₱{Number(orderbautistainventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                    
                          <p className="font-albertsans mt-6  font-medium text-[#020202] text-[18px]">Description</p>
                          <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3">{orderbautistainventoryproductdescription}</p>
                        
                      <div className="gap-4 mt-15 flex items-center">
                            <p className="font-albertsans font-semibold ">Quantity:</p>
                          <div className="w-auto h-10  flex items-center justify-between border-1 rounded-2xl">
                            <div   className={`font-bold h-full w-10 bg-gray-100 rounded-l-2xl flex items-center justify-center cursor-pointer select-none ${bautistacount <= 1 ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }} type="button" onClick={() => setbautistaCount (c => Math.max(1, c - 1))}>-</div>

                                <input type="number" min="1" max={orderbautistainventoryproductquantity}  value={bautistacount}
                                       onChange={(e) => {
                                         const bautistacountvalue = parseInt(e.target.value);
                                         if (!isNaN(bautistacountvalue)) {
                                           const clampedbautistacountValue = Math.max(1, Math.min(orderbautistainventoryproductquantity, bautistacountvalue));
                                           setbautistaCount(clampedbautistacountValue);
                                         }
                                       }}
                                       className="w-16 text-center border-0 focus:outline-none font-semibold"/>
                                     
                            <div  className={`font-bold h-full w-10 bg-gray-100 rounded-r-2xl flex items-center justify-center cursor-pointer select-none  ${bautistacount >= orderbautistainventoryproductquantity ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }}  type="button" onClick={() => setbautistaCount ((c) => Math.min(c + 1, orderbautistainventoryproductquantity))}>+</div> 
                           </div>
                                 <p className="font-albertsans font-semibold text-[#616161] text-[14px]">{orderbautistainventoryproductquantity} pieces available </p>
                         </div>


                     
                          </div>
                  

                    
                          </div>


                    </div>
                  </div>
                   <div className=" border-1 mt-10 p-5 w-full h-auto rounded-md ">
                                             <div className="w-full  flex items-center justify-center"><h1 className=" font-albertsans text-[#184d85] text-[25px] font-bold">Product Order Form</h1> </div>

                <div className="flex items-start justify-center mt-10">                  
                   <div className="pb-2  w-[100%] h-[100%]">
                   <div className="flex items-center gap-2  ">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Customer Email : </h1>
                      <div><input value={orderbautistaEmail} onChange={(e) => setorderbautistaEmail(e.target.value)} type="text" placeholder="Enter customer email..."   className="transition-all duration-300 ease-in-out  px-5 py-1.5 rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                    {orderbautistacheckEmail && ( <p className="text-gray-500 text-sm ml-1">Checking email...</p>)}
                      {orderbautistaemailError && (<p className="text-red-500 text-sm ml-1">Email does not exist</p>)}
                         </div>
                       
                   </div>

                   <div className="flex items-center gap-2 mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Full Name : </h1>
                      <input  readOnly value={orderbautistafullName} onChange={(e) => setorderbautistafullName(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] "></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Contact Number : </h1>
                      <input readOnly value={orderbautistacontactNumber} onChange={(e) => setorderbautistacontactNumber(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Clinic Address : </h1>
                      <select  
                        value={orderbautistapickupplace} 
                        onChange={(e) => setorderbautistapickupplace(e.target.value)} 
                        className="transition-all duration-300 ease-in-out min-w-14 w-56 max-w-56 px-5 py-1.5 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                      >
                        <option value="">Select Clinic Address</option>
                        {clinicLocations
                          .filter(clinic => 
                            clinic.clinicType === "Bautista Eye Center" && 
                            clinic.isActive && 
                            clinic.address?.fullAddress
                          )
                          .map((clinic, index) => (
                            <option key={clinic._id || index} value={clinic.address.fullAddress}>
                              {clinic.address.fullAddress}
                            </option>
                          ))
                        }
                      </select>
                   </div>

                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Custom Fee : </h1>
                      <input  value={orderbautistacustomFee} onChange={(e) => setorderbautistacustomFee(e.target.value)} type="text"   className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Amount Paid : </h1>
                      <input  value={orderbautistaamountPaid} onChange={(e) => setorderbautistaamountPaid(e.target.value)}  type="text" placeholder="50% for downpayment"  className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>
                  

                  {Number(orderbautistaamountPaid) >= Number(orderbautistatotalwithFee) > 0 &&(
                      <div className="flex items-center gap-2  mt-3">
                              <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Pickup : </h1>
                              <div onClick={() => showbautistapickupnoworlater('bautistaorderpickupnow')}  className={`px-5 py-2 cursor-pointer mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl   text-center flex justify-center items-center ${activebautistapickupnoworlater ==='bautistaorderpickupnow' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activebautistapickupnoworlater ==='bautistaorderpickupnow' ? 'text-white' : ''}`}>Now</h1></div>
                              <div onClick={() => showbautistapickupnoworlater('bautistaorderpickuplater')}  className={`px-5 py-2 cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl  text-center flex justify-center items-center ${activebautistapickupnoworlater ==='bautistaorderpickuplater' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activebautistapickupnoworlater ==='bautistaorderpickuplater' ? 'text-white' : ''}`}>Later</h1></div>
                      </div>
                  )}


                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Order Notes : </h1>
                      <textarea className=" transition-all duration-300 ease-in-out  w-56 px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500" value={orderbautistaNotes} ref={textarearef} rows={1} style={{minHeight:'30px'}} type="text"  onChange={(e) =>  {setorderbautistaNotes(e.target.value); adjusttextareaheight();}} />
                   </div>


                   </div>

                   <div className="flex flex-col justify-center items-start w-[100%] h-[100%]">                
                   <div className="flex justify-center items-start w-[100%] h-[100%]">
                       <div className=" gap-2 flex flex-col h-full w-full "> 
                          <h1 className="text-[15px] font-albertsans font-semibold">Item Price </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Quantity </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Subtotal </h1>
                          <h1 className="text-[15px] w-full font-albertsans font-semibold">Customization Fee </h1> 
                          <h1 className="text-[15px] border-b-1 pb-2 w-full font-albertsans font-semibold">Discount </h1>     
                          <h1 className=" font-albertsans font-semibold text-[19px] mt-5">Overall Total </h1>
                          <h1 className=" w-full font-albertsans font-semibold">Amount Paid </h1> 
                          {Number(orderbautistaamountPaid) > Number(orderbautistatotalwithFee) ? (
                           <h1 className=" w-full font-albertsans font-semibold">Change </h1>   
                          ):(
                           <h1 className=" w-full font-albertsans font-semibold">Remaining Balance </h1>       
                          )}
                          
                         
                       </div>
                       <div className=" flex flex-col items-end gap-2  justify-end h-full w-full "> 
                          <h1 className="font-albertsans font-medium text-[#242424]">₱ {Number(orderbautistainventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})} </h1>
                          <h1 className="font-albertsans font-semibold">x {bautistacount}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderbautistainventoryproductprice * bautistacount).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderbautistacustomFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className=" font-albertsans font-medium">0</h1>     
                          <h1 className="font-albertsans font-bold text-[#478d12] text-[25px] mt-3">₱ {Number(orderbautistatotalwithFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderbautistaamountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          {Number(orderbautistaamountPaid) > Number(orderbautistatotalwithFee) ? (
                           <h1 className="font-albertsans font-medium">₱ {Number(orderbautistaamountpaidChange).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          ):(
                            <h1 className="font-albertsans font-medium">₱ {Number(orderbautistaremainingBalance).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          )}

                       </div> 


                   </div>

                  {(Number(orderbautistaremainingBalance) === 0 || Number(orderbautistaamountpaidChange) > 0) && activebautistapickupnoworlater==='bautistaorderpickupnow' ? (
                    <div
                      onClick={(e) => submitpatientorderbautista(e)} 
                      disabled={isSubmittingBautistaCompleteOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingBautistaCompleteOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                      )}
                    </div>
                    ) : (
                   (Number(orderbautistaamountPaid) >= Number(orderbautistatotalwithFee) * 0.50) || activebautistapickupnoworlater==='bautistaorderpickuplater' ? (
                    <div 
                      onClick={(e) => submitpatientpendingorderbautista(e)} 
                      disabled={isSubmittingBautistaPendingOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#F08000] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingBautistaPendingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Set as Pending Order</p>
                      )}
                    </div>
                    ) : null)}
                      



                </div>   
                </div> 
                   </div>

                  </form>
             </div>
      )}
     



                        
                  </div>


                  </div>
             </div>
           </div>


  )}


{patientorderbautistaproductToast && (
<div className=" bottom-4 right-8  z-101   transform fixed " >
    <div key={patientorderbautistaproductisClicked ? 'added' : 'removed'}  className={` ${patientorderbautistaproductToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s]  motion-ease-spring-smooth' : 'motion-preset-slide-left'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
      {patientorderbautistaproductisClicked ? (          
         <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
      ) : (
        <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
      )}
      {patientorderbautistaproductToastMessage}

      <div  className={`rounded-b-2xl absolute bottom-0 left-0 h-1 bg-green-500 `}  style={{width: progressWidth,transition: 'width 4s linear' }}/>

    </div>

</div>  
)}



      {showpatientorderedbautista && (

           <div className="overflow-y-auto h-auto px-10 bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="motion-preset-fade  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">View Order </h1></div>
                    <div onClick={() => {
                       setorderbautistaEmail('');
                       setorderbautistaprofilePicture('');
                       setorderbautistafullName('');
                       setorderbautistalastName('');
                       setorderbautistamiddleName('');
                       setorderbautistafirstName('');
                       setorderbautistacontactNumber('');
                       setorderbautistadownPayment('');
                       setorderbautistacustomFee('');
                       setorderbautistaamountPaid('');
                       setorderbautistaNotes('');
                       setactivebautistapickupnoworlater(null);
                       setbautistaCount(0); 
                       setbautistaproductsoldCount(0);
                       setselectedorderbautistaproduct(null);
                       setshowpatientorderedbautista(false);}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>




         


           <div className="pb-20 motion-opacity-in-0  bg-[#fefefe] rounded-2xl w-full h-auto animate-fadeInUp ">

            <form className="flex flex-col  ml-15 mr-15 mt-5    pb-10" >
                  <div className=" flex justify-center items-start rounded-2xl w-full h-auto">
                    <div className=" pb-10 w-full h-full mr-15 rounded-2xl flex justify-center ">



                        <div className=" h-fit w-fit flex-none">

                  <div className=" relative">
                  

                  <img  className="mt-2 w-100 object-cover rounded-2xl h-100" src={(selectedorderbautistaproduct?.bautistainventoryproductimagepreviewimages?.[orderbautistacurrentimageindex]) || defaultimageplaceholder}/>

                       {((selectedorderbautistaproduct?.bautistainventoryproductimagepreviewimages?.length || 0) > 1 || 
                         addbautistainventoryproductimagepreviewimages?.length > 1) && (
                           <>
                             <div type="button" onClick={orderbautistahandlepreviousimage}  className="cursor-pointer bg-opacity-50 hover:bg-opacity-75 rounded-2xl text-white p-2 absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-500"><i className="bx bx-chevron-left text-2xl" /></div>

                             <div type="button" onClick={orderbautistahandlenextimage}  className="cursor-pointer rounded-2xl absolute bg-opacity-50 text-white p-2 transform -translate-y-1/2 bg-gray-500 hover:bg-opacity-75 right-2 top-1/2">  <i className="bx bx-chevron-right text-2xl" /></div>

                           </>
                         )}

                        {orderbautistainventoryproductimagepreviewimages.length > 0 && (
                            <div className="overflow-x-auto flex gap-2 mt-2 p-4 border-y-1 rounded-2xl bg-[#fbfbfb]  items-center ">
                                {orderbautistainventoryproductimagepreviewimages.map((preview, index) => (
                                    <div key={index} className="relative">
                                    <img 
                                        onClick={() => setorderbautistacurrentimageindex(index)} 
                                        src={preview} 
                                        className={`rounded-lg cursor-pointer object-cover w-20 h-20 ${orderbautistacurrentimageindex === index ? 'border-2 border-[#78b0d4]' : ''}`} 
                                    />
                                    </div>
                                ))}
                            </div>
                          )}

                       </div>
                        
                        

                        </div>



                    </div>
            
                    <div className="  w-full h-auto flex items-start mb-10 rounded-2xl min-w-0">
                          <div className=" w-[100%] h-auto  rounded-4xl">
                    
                    

                          <div className=" w-[100%] registration-container">

                      
                          <div className="flex items-center mx-1  w-fit  h-fit  mt-2 break-words min-w-0 "><h1 className="font-albertsans rounded-md py-1 px-2  rounded-1xl bg-[#F0F6FF] font-medium   text-[#0d0d0d]  min-w-0 break-words ">{selectedorderbautistaproduct?.patientorderbautistaproductcategory}</h1>
                          <p className="font-albertsans ml-1">by</p>
                          <p className="font-albertsans ml-1 font-semibold  ">{selectedorderbautistaproduct?.patientorderbautistaproductbrand}</p>
                          </div>
                          
                       

                          <h1 className="font-albertsans mt-3 min-w-0 break-words h-fit w-full font-albertsans font-bold text-[#212121] text-[29px]">{selectedorderbautistaproduct?.patientorderbautistaproductname}</h1>
           
                          <div className="mt-1 flex items-center">
                            <img src={starimage} className="w-5 h-5"/>
                            <p className="font-albertsans ml-2 mt-1 text-[15px] font-semibold">4.8</p><span className="mt-1 text-[13px] pr-3 ml-2">(89 reviews)</span>
                            
                            <p className="mt-1 font-albertsans border-l-2  border-[#8c8c8c] pl-3  text-[13px]">{bautistaproductsoldCount} sold</p>
                          </div>
          
                    
                          <p className="mt-5 font-albertsans font-semibold text-[#478d12] text-[40px]">₱{Number(selectedorderbautistaproduct?.patientorderbautistaproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</p>
                    
                          <p className="font-albertsans mt-6  font-medium text-[#020202] text-[18px]">Description</p>
                          <p className="font-albertsans font-semibold text-[#4b4b4b] mt-3">{selectedorderbautistaproduct?.patientorderbautistaproductdescription}</p>
                        
                      <div className="gap-4 mt-15 flex items-center">
                            <p className="font-albertsans font-semibold ">Quantity:</p>
                          <div className="w-auto h-10  flex items-center justify-between border-1 rounded-2xl">
                            <div   className={`font-bold h-full w-10 bg-gray-100 rounded-l-2xl flex items-center justify-center cursor-pointer select-none ${bautistacount <= 1 ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }} type="button" onClick={() => setbautistaCount (c => Math.max(1, c - 1))}>-</div>

                                <input type="number" min="1" max={orderbautistainventoryproductquantity}  value={bautistacount}
                                       onChange={(e) => {
                                         const bautistacountvalue = parseInt(e.target.value);
                                         if (!isNaN(bautistacountvalue)) {
                                           const clampedbautistacountValue = Math.max(1, Math.min(orderbautistainventoryproductquantity, bautistacountvalue));
                                           setbautistaCount(clampedbautistacountValue);
                                         }
                                       }}
                                       className="w-16 text-center border-0 focus:outline-none font-semibold"/>
                                     
                            <div  className={`font-bold h-full w-10 bg-gray-100 rounded-r-2xl flex items-center justify-center cursor-pointer select-none  ${bautistacount >= orderbautistainventoryproductquantity ? "opacity-50 cursor-not-allowed" : "active:bg-gray-200"}`} style={{ WebkitTapHighlightColor: 'transparent' }}  type="button" onClick={() => setbautistaCount ((c) => Math.min(c + 1, orderbautistainventoryproductquantity))}>+</div> 
                           </div>
                                 <p className="font-albertsans font-semibold text-[#616161] text-[14px]">{orderbautistainventoryproductquantity} pieces available </p>
                         </div>


                     
                          </div>
                  

                    
                          </div>


                    </div>
                  </div>
                   <div className=" border-1 mt-10 p-5 w-full h-auto rounded-md ">
                   <div className="w-full  flex items-center justify-center"><h1 className=" font-albertsans text-[#184d85] text-[25px] font-bold">Product Order Form</h1> </div>

                <div className="flex items-start justify-center mt-10">                  
                   <div className="pb-2  w-[100%] h-[100%]">
                   <div className="flex items-center gap-2  ">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Customer Email : </h1>
                      <div><input value={orderbautistaEmail} onChange={(e) => setorderbautistaEmail(e.target.value)} type="text" placeholder="Enter customer email..."   className="transition-all duration-300 ease-in-out  px-5 py-1.5 rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                    {orderbautistacheckEmail && ( <p className="text-gray-500 text-sm ml-1">Checking email...</p>)}
                      {orderbautistaemailError && (<p className="text-red-500 text-sm ml-1">Email does not exist</p>)}
                         </div>
                       
                   </div>

                   <div className="flex items-center gap-2 mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Full Name : </h1>
                      <input  readOnly value={orderbautistafullName} onChange={(e) => setorderbautistafullName(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] "></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Contact Number : </h1>
                      <input readOnly value={orderbautistacontactNumber} onChange={(e) => setorderbautistacontactNumber(e.target.value)} type="text"   className="transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Clinic Address : </h1>
                      <select  
                        value={orderbautistapickupplace} 
                        onChange={(e) => setorderbautistapickupplace(e.target.value)} 
                        className="transition-all duration-300 ease-in-out min-w-14 w-56 max-w-56 px-5 py-1.5 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                      >
                        <option value="">Select Clinic Address</option>
                        {clinicLocations
                          .filter(clinic => 
                            clinic.clinicType === "Bautista Eye Center" && 
                            clinic.isActive && 
                            clinic.address?.fullAddress
                          )
                          .map((clinic, index) => (
                            <option key={clinic._id || index} value={clinic.address.fullAddress}>
                              {clinic.address.fullAddress}
                            </option>
                          ))
                        }
                      </select>
                   </div>

                  <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Custom Fee : </h1>
                      <input  value={orderbautistacustomFee} onChange={(e) => setorderbautistacustomFee(e.target.value)} type="text"   className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>

                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Amount Paid : </h1>
                      <input  value={orderbautistaamountPaid} onChange={(e) => setorderbautistaamountPaid(e.target.value)}  type="text" placeholder="50% for downpayment"  className=" transition-all duration-300 ease-in-out  min-w-14 w-auto px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input>
                   </div>
                  

                  {Number(orderbautistaamountPaid) >= Number(orderbautistatotalwithFee) > 0 &&(
                      <div className="flex items-center gap-2  mt-3">
                              <h1 className=" w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Pickup : </h1>
                              <div onClick={() => showbautistapickupnoworlater('bautistaorderpickupnow')}  className={`px-5 py-2 cursor-pointer mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl   text-center flex justify-center items-center ${activebautistapickupnoworlater ==='bautistaorderpickupnow' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activebautistapickupnoworlater ==='bautistaorderpickupnow' ? 'text-white' : ''}`}>Now</h1></div>
                              <div onClick={() => showbautistapickupnoworlater('bautistaorderpickuplater')}  className={`px-5 py-2 cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-2xl  text-center flex justify-center items-center ${activebautistapickupnoworlater ==='bautistaorderpickuplater' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activebautistapickupnoworlater ==='bautistaorderpickuplater' ? 'text-white' : ''}`}>Later</h1></div>
                      </div>
                  )}


                   <div className="flex items-center gap-2  mt-3">
                      <h1 className="w-35 text-[#242424] font-albertsans font-semibold text-[17px]">Order Notes : </h1>
                      <textarea className=" transition-all duration-300 ease-in-out  w-56 px-5 py-1.5  rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500" value={orderbautistaNotes} ref={textarearef} rows={1} style={{minHeight:'30px'}} type="text"  onChange={(e) =>  {setorderbautistaNotes(e.target.value); adjusttextareaheight();}} />
                   </div>


                   </div>

                   <div className="flex flex-col justify-center items-start w-[100%] h-[100%]">                
                   <div className="flex justify-center items-start w-[100%] h-[100%]">
                       <div className=" gap-2 flex flex-col h-full w-full "> 
                          <h1 className="text-[15px] font-albertsans font-semibold">Item Price </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Quantity </h1>
                          <h1 className="text-[15px] font-albertsans font-semibold">Subtotal </h1>
                          <h1 className="text-[15px] w-full font-albertsans font-semibold">Customization Fee </h1> 
                          <h1 className="text-[15px] border-b-1 pb-2 w-full font-albertsans font-semibold">Discount </h1>     
                          <h1 className=" font-albertsans font-semibold text-[19px] mt-5">Overall Total </h1>
                          <h1 className=" w-full font-albertsans font-semibold">Amount Paid </h1> 
                          {Number(orderbautistaamountPaid) > Number(orderbautistatotalwithFee) ? (
                           <h1 className=" w-full font-albertsans font-semibold">Change </h1>   
                          ):(
                           <h1 className=" w-full font-albertsans font-semibold">Remaining Balance </h1>       
                          )}
                          
                         
                       </div>
                       <div className=" flex flex-col items-end gap-2  justify-end h-full w-full "> 
                          <h1 className="font-albertsans font-medium text-[#242424]">₱ {Number(orderbautistainventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})} </h1>
                          <h1 className="font-albertsans font-semibold">x {bautistacount}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderbautistainventoryproductprice * bautistacount).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderbautistacustomFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className=" font-albertsans font-medium">0</h1>     
                          <h1 className="font-albertsans font-bold text-[#478d12] text-[25px] mt-3">₱ {Number(orderbautistatotalwithFee).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          <h1 className="font-albertsans font-medium">₱ {Number(orderbautistaamountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          {Number(orderbautistaamountPaid) > Number(orderbautistatotalwithFee) ? (
                           <h1 className="font-albertsans font-medium">₱ {Number(orderbautistaamountpaidChange).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          ):(
                            <h1 className="font-albertsans font-medium">₱ {Number(orderbautistaremainingBalance).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1>
                          )}

                       </div> 


                   </div>

                  {(Number(orderbautistaremainingBalance) === 0 || Number(orderbautistaamountpaidChange) > 0) && activebautistapickupnoworlater==='bautistaorderpickupnow' ? (
                    <div 
                      onClick={(e) => submitpatientorderbautista(e)} 
                      disabled={isSubmittingBautistaCompleteOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingBautistaCompleteOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                      )}
                    </div>
                    ) : (
                   (Number(orderbautistaamountPaid) >= Number(orderbautistatotalwithFee) * 0.50) || activebautistapickupnoworlater==='bautistaorderpickuplater' ? (
                    <div 
                      onClick={(e) => submitpatientpendingorderbautista(e)} 
                      disabled={isSubmittingBautistaPendingOrder}
                      className="w-full mt-10 p-2 hover:cursor-pointer hover:scale-103 bg-[#F08000] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingBautistaPendingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                        </>
                      ) : (
                        <p className="font-bold font-albertsans text-white text-[18px] ml-2">Set as Pending Order</p>
                      )}
                    </div>
                    ) : null)}
                      



                </div>   
                </div> 
                   </div>

                  </form>
             </div>
     
     



                        
                


                  </div>
             </div>
     


  )}


</div> )}



            {/* View Order Details Modal */}
{showViewOrderModal && selectedOrderForView && (
  <div className="fixed inset-0 bg-[#000000b1] flex items-center justify-center z-20 p-4">
    <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
      <div className="sticky z-99 top-0 bg-white border-b px-8 py-6 flex justify-between items-center rounded-t-2xl">
        <div className="flex justify-center items-center">
          <img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all p-1" />
          <h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Billing Details</h1>
        </div>
        <div 
          onClick={closeViewOrderModal}
          className="cursor-pointer text-gray-500 hover:text-gray-700 text-[50px]"
        >
          ×
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
          const hasRemainingBalance = Number(amountPaid) < Number(productTotal);
          const orderNotes = isAmbher 
            ? selectedOrderForView.patientorderambherproductnotes 
            : selectedOrderForView.patientorderbautistaproductnotes;
          const clinic = isAmbher ? 'Ambher Optical' : 'Bautista Eye Center';
          const clinicaddress = isAmbher
            ? selectedOrderForView.patientorderambherproductchosenpickupplace
            : selectedOrderForView.patientorderbautistaproductchosenpickupplace;
          const customerName = isAmbher 
            ? `${selectedOrderForView.patientfirstname} ${selectedOrderForView.patientlastname}`
            : `${selectedOrderForView.patientfirstname} ${selectedOrderForView.patientlastname}`;
          const customerEmail = isAmbher 
            ? selectedOrderForView.patientemail 
            : selectedOrderForView.patientemail;

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
                      <span className="text-gray-700 font-medium font-albertsans">Customer:</span>
                      <span className="font-semibold font-albertsans text-gray-800 text-sm text-right">{customerName}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                      <span className="text-gray-700 font-medium font-albertsans">Email:</span>
                      <span className="font-semibold font-albertsans text-gray-800 text-sm text-right">{customerEmail}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                      <span className="text-gray-700 font-medium font-albertsans">Item:</span>
                      <span className="font-semibold font-albertsans text-gray-800 text-sm text-right">{productName}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                      <span className="text-gray-700 font-medium font-albertsans">Unit Price:</span>
                      <span className="font-semibold font-albertsans">₱{Number(productPrice).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                      <span className="text-gray-700 font-medium font-albertsans">Quantity:</span>
                      <span className="font-semibold font-albertsans">x{productQuantity}</span>
                    </div>
                    <div className={`flex justify-between items-center py-2 border-b ${isAmbher ? 'border-green-200' : 'border-blue-200'}`}>
                      <span className="text-gray-700 font-medium font-albertsans">Subtotal:</span>
                      <span className="font-semibold font-albertsans">₱{(Number(productPrice) * Number(productQuantity)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                    
                    <div className={`bg-white p-5 rounded-lg border shadow-sm ${isAmbher ? 'border-green-300' : 'border-blue-300'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-medium font-albertsans text-sm">
                          {Number(amountPaid) < Number(productTotal) ? 'Down Payment:' : 'Amount Paid:'}
                        </span>
                        <span className="font-bold font-albertsans text-[#5c5c5c] text-lg">₱{Number(amountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      </div>
                      
                      {Number(amountPaid) < Number(productTotal) && (
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-700 font-medium font-albertsans text-sm">Remaining Balance:</span>
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
                        Order Status: {orderStatus}
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
                          {orderStatus === 'Ready for Pickup' 
                            ? 'Ready for Pickup'
                            : pickupStatus === 'Now' 
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
                    
                    {/* Show Mark as Complete button when order status is Ready for Pickup */}
                    {orderStatus === 'Ready for Pickup' && pickupStatus !== 'Now' && !hasRemainingBalance && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center mb-3">
                          <i className="bx bx-check-circle text-green-600 mr-2"></i>
                          <p className="text-sm text-green-800 font-albertsans">
                            <span className="font-medium">Order Ready:</span> This order is ready for pickup and can be marked as complete.
                          </p>
                        </div>
                        <div
                          onClick={markOrderAsComplete}
                          className="w-full p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"
                        >
                          <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Show date picker only if order is not Ready for Pickup, not completed AND payment is fully settled */}
                    {orderStatus !== 'Ready for Pickup' && pickupStatus !== 'Now' && !hasRemainingBalance && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center mb-3">
                          <i className="bx bx-time text-yellow-600 mr-2"></i>
                          <p className="text-sm text-yellow-800 font-albertsans">
                            <span className="font-medium">Pickup scheduling:</span> {pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now' ? 'Update pickup date for this order.' : 'Select a pickup date for this order.'}
                          </p>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-yellow-800 mb-2 font-albertsans">
                            {pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now' ? 'Change Pickup Date:' : 'Select Pickup Date:'}
                          </label>
                          <input
                            type="date"
                            value={selectedPickupDate}
                            onChange={handlePickupDateChange}
                            min={getMinDate()}
                            className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm font-albertsans"
                          />
                          {selectedPickupDate && (
                            <p className="mt-2 text-xs text-yellow-700 font-albertsans">
                              Pickup scheduled for: {new Date(selectedPickupDate).toLocaleDateString('en-PH', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Show payment requirement message when there's a remaining balance */}
                    {pickupStatus !== 'Now' && hasRemainingBalance && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center mb-3">
                          <i className="bx bx-credit-card text-red-600 mr-2"></i>
                          <p className="text-sm text-red-800 font-albertsans">
                            <span className="font-medium">Payment Required:</span> Full payment must be completed before scheduling pickup.
                          </p>
                        </div>
                        
                        {/* Payment Balance Information */}
                        <div className="bg-white p-3 rounded-lg border border-red-200 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-red-700 font-medium font-albertsans">Remaining Balance:</span>
                            <span className="font-bold text-red-700 font-albertsans">₱{(Number(productTotal) - Number(amountPaid)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 font-albertsans">Total Amount:</span>
                            <span className="text-xs text-gray-600 font-albertsans">₱{Number(productTotal).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 font-albertsans">Amount Paid:</span>
                            <span className="text-xs text-gray-600 font-albertsans">₱{Number(amountPaid).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        </div>

                        {/* Payment Collection Form */}
                        <div className="bg-white p-4 rounded-lg border border-red-200">
                          <div className="flex items-center mb-3">
                            <i className="bx bx-money text-green-600 mr-2"></i>
                            <h4 className="font-medium text-gray-800 font-albertsans">Collect Additional Payment</h4>
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2 font-albertsans">
                              Payment Amount (₱)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={additionalPayment}
                              onChange={handlePaymentInputChange}
                              placeholder="Enter payment amount"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-albertsans"
                              disabled={isProcessingPayment}
                            />
                            <p className="mt-1 text-xs text-gray-500 font-albertsans">
                              Remaining balance: ₱{(Number(productTotal) - Number(amountPaid)).toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </p>
                          </div>

                          {/* Payment Message */}
                          {paymentMessage.text && (
                            <div className={`mb-3 p-3 rounded-lg border ${
                              paymentMessage.type === 'success' 
                                ? 'bg-green-50 border-green-200 text-green-800' 
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                              <div className="flex items-center">
                                <i className={`bx ${paymentMessage.type === 'success' ? 'bx-check-circle' : 'bx-error-circle'} mr-2`}></i>
                                <p className="text-sm font-albertsans">{paymentMessage.text}</p>
                              </div>
                            </div>
                          )}

                          {/* Process Payment Button */}
                          <button
                            onClick={handleAdditionalPayment}
                            disabled={isProcessingPayment || !additionalPayment || Number(additionalPayment) <= 0}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium text-sm font-albertsans transition-colors duration-200 flex items-center justify-center"
                          >
                            {isProcessingPayment ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-credit-card mr-2"></i>
                                Process Payment
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Show current pickup date info when available */}
                    {pickupDate && pickupDate !== 'Later' && pickupDate !== 'Now' && pickupStatus !== 'Now' && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <i className="bx bx-calendar-check text-green-600 mr-2"></i>
                          <p className="text-sm text-green-800 font-albertsans">
                            <span className="font-medium">Chosen Pickup Date:</span> {formatorderDates(pickupDate)}
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
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed font-albertsans">{orderNotes}</p>
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



{/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} 
{/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} 
{/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} 
{/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} 
{/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} {/*End of Billings and Orders*/} 





































































          
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
                <div onClick={getUserLocation} disabled={loadingUserLocation} className={`bg-gray-800 rounded-2xl cursor-pointer hover:cursor-pointer transition-all gap-2 duration-300 ease-in-out  px-4 py-2 text-white  font-medium flex items-center  `}>
                     <i className={`bx ${loadingUserLocation ? 'bx-loader-alt bx-spin' : 'bx-current-location'}`}></i>

                      <div className=" select-none   rounded-2xl cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out flex flex-col items-start">
                        <span className="text-[15px]">{loadingUserLocation ? 'Locating...' : userLocation ? 'Update Location' : 'Get Location'} </span>

                       {userLocation && !loadingUserLocation && (
                          <span className="text-[12px] opacity-90">
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
                        const newEditMode = !isEditingLocation;
                        setIsEditingLocation(newEditMode);
                        // Set data attribute for marker click handlers to access
                        document.body.setAttribute('data-edit-mode', newEditMode.toString());
                        console.log('🔧 Edit mode toggled:', newEditMode);
                      }} className={`cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out px-4 py-2  flex items-center select-none rounded-2xl  font-medium  ${
                       isEditingLocation 
                          ? 'bg-[#ebab53] text-white ' 
                          : 'bg-[#d3710e] text-white '
                      }`}>
                      
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





                {/* geomaincontainer */}
                <div className="transition-all duration-300 ease-in-out gap-4 flex justify-center items-start flex-1 h-[580px]">
                  

                  {/* geomaincontainer map  */}
                  <div id="geographicmapcontainer" className="flex flex-col justify-center items-center transition-all duration-300 ease-in-out relative bg-[#efefef] rounded-2xl shadow-lg  w-[70%] h-[580px] overflow-hidden">
                   
                   
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


                    
                    {/* Map loading state */}
                    {!mapLoaded && (
                        <div className=" bg-white/80 flex items-center justify-center  absolute z-30 inset-0  ">
                        <div className="text-center">
                          <div className="mx-auto animate-spin rounded-full h-12 w-12 border-b-2 border-[#096482]  mb-3"></div>
                          <p className="text-[#1e1e1e]">Loading map...</p>
                        </div>
                          </div>
                      )}



                  {/*Edit notice widget*/}
                    {isEditingLocation && mapLoaded && (
                       <div className="backdrop-blur-sm absolute top-4 left-4 bg-white/95  rounded-lg p-3 shadow-lg z-20">
                        <h1 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><i className="bx bx-info-circle text-[#08a0d3]"></i>Edit Mode Active</h1>
                        <ul className="text-[13px] text-[#1c1c1c] space-y-1">
                          <li>• Click anywhere to add new clinic</li>
                          <li>• Click clinic markers to edit</li>
                          <li>• Use controls to move around the map</li>
                        </ul>
                        </div>
                       )}



                    {/* direction widget */}
                    {showDirections && (
                      <div 
                        ref={directionsPanelRef} 
                        className={` absolute top-2.5 left-2.5 w-80   bg-white rounded-xl shadow-xl z-[50] overflow-hidden transition-transform duration-300 ease-in-out ${showDirections ? 'translate-x-0' : '-translate-x-full'}`}>
                       


                        {/* direction header */}
                        <div className="bg-[#2781af] text-white pr-2 pl-3 flex justify-between items-center">
                          <h3 className="font-bold">Route Directions</h3>
                          <div onClick={clearDirections} className="bg-transparent border-none duration-300 text-white text-lg cursor-pointer p-1 rounded transition-all ease-in-out " >
                            <i className="bx bx-x"></i>
                             </div>
                       </div>
                        


                        {/* direction routes */}
                        <div className="directions-content h-auto max-h-[480px] overflow-y-auto p-2.5">
                          {isLoadingRoute && (
                                <div className="flex items-center justify-center py-8">
                                 <div className="border-[#096482]  animate-spin rounded-full h-8 w-8 border-b-2 "></div>
                                 <span className="text-[#1e1e1e] ml-3">Loading route...</span>
                                 </div>
                          )}



                          
                          {!isLoadingRoute && !routeInfo && directionsSteps.length === 0 && (
                              <div className="text-[#2f2f2f] text-center py-8 ">
                              <i className="bx bx-map-pin text-4xl mb-2"></i>
                              <p>Select clinic to get directions</p>
                              </div>
                          )}
                          

                          {routeInfo && (
                            <div className="bg-[#f4f4f4] p-2.5 mb-2.5 rounded-lg ">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-800">{routeInfo.distance} km</p>
                                  <p className="text-sm text-gray-600">{routeInfo.duration} minutes</p>
                                </div>
                                <i className="bx bx-car text-[25px] text-[#08a0d3]"></i>
                                 </div>
                               </div>
                          )}
                          

                          {directionsSteps.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3 text-gray-800">Routes</h4>
                              {directionsSteps.map((step, index) => (
                                <div key={index} className={`py-2 flex gap-2.5 items-center  ${index !== directionsSteps.length - 1 ? 'border-b border-[#5959593b]' : ''}`}>
                                  <div className="w-6 h-6 bg-[#2781af] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                                    <i className={`bx ${getStepIcon(step.maneuver.type)}`}></i>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-[14px] leading-snug" dangerouslySetInnerHTML={{ __html: step.maneuver.instruction }}></p>
                                    <p className="text-[11px] text-gray-500 mt-1"> {(step.distance / 1000).toFixed(1)} km  </p>
                                  </div>
                                </div>
                                  ))}
                               </div>
                             )}
                          </div>
                         </div>
                             )}
 





                    {/* Map Legend */}
                 <div ref={legendControlRef} className="absolute bottom-4 right-4 bg-[#ffffff]/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
                     <h4 className="text-[#1b1b1b] font-semibold mb-2">Legend</h4>
                     <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                           <img src={ambherlogo} className="w-4 h-4 rounded-full"/><span>Ambher Optical</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <img src={bautistalogo} className="w-4 h-4 rounded-full"/><span>Bautista Eye Center</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#39850d] border-1 border-white shadow animate-pulse"></div><span>Your Location</span>
                        </div>

                        {userLocation && (
                          <div className="border-t pt-2 mt-2">
                             <div className="text-[11px] text-[#1c1c1c]">
                                 <div className="flex items-center gap-1">
                                 <i className={`bx ${ userLocation.accuracy <= 20 ? 'bx-check-circle text-[#39850d]' :
                                                      userLocation.accuracy <= 50 ? 'bx-check-circle text-[#1589b3]' :
                                                      userLocation.accuracy <= 100 ? 'bx-error-circle text-[#e2c92b]' :
                                                     'bx-error-circle text-red-500'}`}></i>
                              
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
                    <div className="p-4 border-b border-[#e8e8e8] bg-[#d9f1ff] ">
                      <h3 className="flex items-center font-bold text-[#2f2f2f] font-albertsans text-[18px] mb-1 "><i className="bx bx-list-ul mr-2 font-bold"></i>  Clinic Locations  </h3>
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
                        (() => {
                          // Filter and sort clinics: user's clinic type first, then others
                          const userDefaultClinicType = getUserDefaultClinicType();
                          const isAdminUser = currentuserloggedin === 'Admin';
                          
                          const sortedClinics = [...clinicLocations].sort((a, b) => {
                            // If admin, show all equally
                            if (isAdminUser) return 0;
                            
                            // Priority order: user's clinic type first, then others
                            if (a.clinicType === userDefaultClinicType && b.clinicType !== userDefaultClinicType) {
                              return -1; // a comes first
                            }
                            if (a.clinicType !== userDefaultClinicType && b.clinicType === userDefaultClinicType) {
                              return 1; // b comes first
                            }
                            return 0; // same priority
                          });

                          return sortedClinics.map((clinic, index) => {
                            // Check if user can edit this clinic type
                            const canEditThisClinic = isAdminUser || clinic.clinicType === userDefaultClinicType;
                            
                            return (
                              <div
                                key={clinic._id || `clinic-${index}`}
                                className="p-3 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 bg-white"
                                onClick={() => {
                                  // Center map on clinic
                                  if (map.current && clinic.coordinates?.coordinates) {
                                    map.current.flyTo({
                                      center: [clinic.coordinates.coordinates[0], clinic.coordinates.coordinates[1]],
                                      zoom: 16,
                                      duration: 1500
                                    });
                                    
                                    // Find the corresponding marker and open its popup
                                    const clinicId = clinic._id;
                                    const marker = mapMarkersRef.current.get(clinicId);
                                    if (marker) {
                                      // Close any currently open popup
                                      if (currentPopup.current) {
                                        currentPopup.current.remove();
                                      }
                                      
                                      // Open the marker's popup after a short delay to allow map animation
                                      setTimeout(() => {
                                        const popup = marker.getPopup();
                                        if (popup) {
                                          marker.togglePopup();
                                        }
                                      }, 800); // Delay to allow flyTo animation to progress
                                    }
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">{clinic.clinicName}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    clinic.clinicType === 'Ambher Optical'
                                      ? 'bg-green-100 text-green-800'
                                      : clinic.clinicType === 'Bautista Eye Center'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {clinic.clinicType === 'Ambher Optical' ? 'Ambher' : 
                                     clinic.clinicType === 'Bautista Eye Center' ? 'Bautista' : 'External'}
                                  </span>
                                </div>
                                
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{clinic.address?.fullAddress || 'Address not available'}</p>
                                
                                {/* Coordinates Display */}
                                {clinic.coordinates?.coordinates && (
                                  <div className="text-xs  mb-2 flex items-center gap-1">
                                    <i className="bx bx-current-location text-[#b42525]"></i>
                                    {clinic.coordinates.coordinates[1].toFixed(4)}°, {clinic.coordinates.coordinates[0].toFixed(4)}°
                                  </div>
                                )}

                                {clinic.contactInfo?.phone && (
                                  <div className="text-xs  mb-2 flex items-center gap-1">
                                    <i className="bx bx-phone text-[#209206]"></i>
                                    {clinic.contactInfo.phone}
                                  </div>
                                )}

                               {clinic.contactInfo?.email && (
                                  <div className="text-xs  mb-2 flex items-center gap-1">
                                    <i className="bx bx-envelope text-[#4d9be0]"></i>
                                    {clinic.contactInfo.email}
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
                                
                                {/* Action Buttons - Only show for authorized clinics or admins */}
                                {canEditThisClinic && (
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
                                )}
                                

                              </div>
                            );
                          });
                        })()
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
                <div
                  onClick={() => setShowAddClinicDialog(false)}
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <i className="bx bx-x text-[20px]"></i>
                </div>
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
                      value={clinicFormData?.clinicType || getUserDefaultClinicType()}
                      onChange={(e) => setClinicFormData(prev => ({ ...prev, clinicType: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                      disabled={getUserAllowedClinicTypes().length === 1}
                    >
                      {getUserAllowedClinicTypes().map(clinicType => (
                        <option key={clinicType} value={clinicType}>{clinicType}</option>
                      ))}
                    </select>
                    {getUserAllowedClinicTypes().length === 1 && (
                      <p className="text-sm text-gray-500 mt-1">
                        You can only create clinics for your assigned clinic type: {getUserAllowedClinicTypes()[0]}
                      </p>
                    )}
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
                  onClick={() => {setShowEditClinicDialog(false); setClinicFormData({});}}
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
                      value={clinicFormData?.clinicType || getUserDefaultClinicType()}
                      onChange={(e) => setClinicFormData(prev => ({ ...prev, clinicType: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                      disabled={getUserAllowedClinicTypes().length === 1}
                    >
                      {getUserAllowedClinicTypes().map(clinicType => (
                        <option key={clinicType} value={clinicType}>{clinicType}</option>
                      ))}
                    </select>
                    {getUserAllowedClinicTypes().length === 1 && (
                      <p className="text-sm text-gray-500 mt-1">
                        You can only modify clinics for your assigned clinic type: {getUserAllowedClinicTypes()[0]}
                      </p>
                    )}
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
                    onClick={() => {setClinicFormData({}); setShowEditClinicDialog(false)}}
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
                <div
                  onClick={() => setShowClinicDetailsDialog(false)}
                  className="cursor-pointer hover:cursor-pointer text-gray-500 hover:text-gray-700"
                >
                  <i className="bx bx-x text-[30px]"></i>
                </div>
              </div>
              
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedClinicLocation.clinicType === 'Ambher Optical' ? ambherlogo : bautistalogo} 
                      alt={selectedClinicLocation.clinicType}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedClinicLocation.clinicName}</h4>
                      <span className="text-sm text-gray-600">{selectedClinicLocation.clinicType}</span>
                    </div>
                  </div>                <div className="flex items-start gap-2">
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
              
              {/* Action Buttons - Only show for authorized clinics or admins */}
              {(() => {
                const userDefaultClinicType = getUserDefaultClinicType();
                const isAdminUser = currentuserloggedin === 'Admin';
                const canEditThisClinic = isAdminUser || selectedClinicLocation.clinicType === userDefaultClinicType;
                
                return canEditThisClinic ? (
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
                ) : (
                  <div className="mt-6">

                  </div>
                );
              })()}

           
           
            </div>
          </div>
        )}





 

      
      
          </div></div>
          </section>
    </>
  )
}

export default AdminDashboard