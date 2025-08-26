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

// Add pulse animation CSS for user location
const mapStyles = document.createElement('style');
mapStyles.textContent = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
  
  .clinic-marker {
    transition: all 0.2s ease-out;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  
  .clinic-marker:hover {
    transform: scale(1.1) translateZ(0);
    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
  }
  
  .user-location-marker {
    animation: pulse 2s infinite;
    will-change: transform, box-shadow;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
  
  .mapboxgl-popup-content {
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border: none;
  }
  
  .mapboxgl-popup-close-button {
    font-size: 18px;
    padding: 8px;
    transition: all 0.2s ease;
  }
  
  .mapboxgl-popup-close-button:hover {
    background-color: rgba(0,0,0,0.1);
    border-radius: 4px;
  }
  
  .mapboxgl-map {
    font-family: inherit;
  }
  
  .mapboxgl-canvas-container canvas {
    will-change: transform;
    transform: translateZ(0);
  }
  
  .mapboxgl-ctrl-group {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .mapboxgl-ctrl button {
    transition: all 0.2s ease;
    will-change: background-color;
  }
  
  .mapboxgl-ctrl button:hover {
    background-color: rgba(0,0,0,0.05);
  }
  
  /* Optimize during map interactions */
  .mapboxgl-map.mapboxgl-interactive {
    cursor: grab;
  }
  
  .mapboxgl-map.mapboxgl-interactive:active {
    cursor: grabbing;
  }
  
  /* GPU acceleration for smooth performance */
  .mapboxgl-canvas {
    image-rendering: optimizeSpeed;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
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

// Add these handler functions after your existing functions (around line 1000)


// Load clinic locations
const fetchClinicLocations = useCallback(async () => {
  try {
    setLoadingClinicLocations(true);
    // Use fallback URL if environment variable is not set
    const baseUrl = apiUrl || 'http://localhost:3000';
    const fetchUrl = `${baseUrl}/api/cliniclocation/clinics?includeInactive=true`;
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


// Get user's current location with ultra-high accuracy - Enhanced for automatic high precision
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
    text: 'Auto-detecting your precise location for best clinic recommendations...', 
    type: 'info' 
  });

  // Ultra-high accuracy options for maximum precision - Enhanced for automatic use
  const highAccuracyOptions = {
    enableHighAccuracy: true, // Force GPS usage
    timeout: 60000, // Extended timeout for automatic high precision
    maximumAge: 0 // No cached data - force fresh reading
  };

  // Enhanced medium accuracy options with longer timeouts
  const mediumAccuracyOptions = {
    enableHighAccuracy: true,
    timeout: 30000, // Extended timeout for better accuracy
    maximumAge: 2000 // Very short cache for fresher data
  };

  // Improved fallback options with network-based location
  const fallbackOptions = {
    enableHighAccuracy: false,
    timeout: 20000, // Longer timeout for network location
    maximumAge: 10000 // Shorter cache for automatic detection
  };

  let bestPosition = null;
  let attemptCount = 0;
  const maxAttempts = 4; // Increased attempts for automatic high precision
  let isCompleted = false; // Flag to prevent multiple completions

  const completeLocationUpdate = (position, accuracyType) => {
    if (isCompleted) return; // Prevent multiple completions
    isCompleted = true;
    
    const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
    
    console.log('🎯 High precision location obtained:', {
      accuracy: Math.round(accuracy) + 'm',
      coordinates: [longitude, latitude],
      type: accuracyType
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
    
    // Enhanced success message based on accuracy achieved
    let message = '';
    let messageType = 'success';
    
    if (accuracy <= 5) {
      message = `🎯 Ultra-precision location detected (±${Math.round(accuracy)}m) - Perfect for clinic discovery!`;
    } else if (accuracy <= 10) {
      message = `🎯 High-precision location detected (±${Math.round(accuracy)}m) - Excellent accuracy!`;
    } else if (accuracy <= 20) {
      message = `📍 Precise location detected (±${Math.round(accuracy)}m) - Very good accuracy!`;
    } else if (accuracy <= 50) {
      message = `📍 Good location detected (±${Math.round(accuracy)}m) - Suitable for clinic finding!`;
    } else {
      message = `📍 Location detected (±${Math.round(accuracy)}m) - Basic accuracy achieved`;
      messageType = 'warning';
    }
    
    setLocationMessage({ text: message, type: messageType });

    // Update map with enhanced zoom levels based on accuracy - Auto-zoom to user location
    if (map.current) {
      const zoomLevel = accuracy <= 5 ? 20 :     // Ultra-precision - street detail
                       accuracy <= 10 ? 19 :    // High precision - building level
                       accuracy <= 15 ? 18 :    // Excellent - detailed street
                       accuracy <= 25 ? 17 :    // Very good - street view
                       accuracy <= 40 ? 16 :    // Good - neighborhood
                       accuracy <= 75 ? 15 :    // Fair - district view
                       accuracy <= 150 ? 14 :   // Poor - city area
                       13;                       // Very poor - wide area
      
      console.log(`🗺️ Auto-zooming map to zoom level ${zoomLevel} based on ${Math.round(accuracy)}m accuracy`);
      
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: zoomLevel,
        duration: 2500, // Longer animation for better UX
        essential: true,
        easing: (t) => t * (2 - t) // Smooth easing function
      });
      
      // Enhanced accuracy circle visualization
      if (map.current.getSource('user-accuracy-circle')) {
        map.current.removeSource('user-accuracy-circle');
        map.current.removeLayer('user-accuracy-circle');
      }
      
      // Create enhanced accuracy circle with better visual feedback
      const accuracyCircle = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        properties: {
          accuracy: accuracy,
          type: accuracyType
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
          'circle-radius': accuracy <= 5 ? 6 : 
                          accuracy <= 10 ? 8 : 
                          accuracy <= 20 ? 12 : 
                          accuracy <= 50 ? 16 : 20,
          'circle-color': accuracy <= 5 ? '#059669' :   // Emerald (ultra-precision)
                         accuracy <= 10 ? '#10b981' :  // Green (high precision)
                         accuracy <= 20 ? '#3b82f6' :  // Blue (good precision)
                         accuracy <= 50 ? '#f59e0b' :  // Amber (fair precision)
                         '#ef4444',                     // Red (poor precision)
          'circle-opacity': 0.7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.9
        }
      });
    }
  };

  const handleLocationError = (error, isLastAttempt = false) => {
    console.error(`Location attempt ${attemptCount} failed:`, error);
    
    if (!isLastAttempt && attemptCount < maxAttempts) {
      // Try next accuracy level
      if (attemptCount === 1) {
        tryGetLocation(mediumAccuracyOptions, 'medium');
      } else {
        tryGetLocation(fallbackOptions, 'fallback');
      }
      return;
    }

    // Final error handling - ensure loading is stopped
    if (!isCompleted) {
      isCompleted = true;
      setLoadingUserLocation(false);
      
      let errorMessage = 'Unable to retrieve your location';
      let retryMessage = '';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          retryMessage = 'Go to browser settings > Privacy & Security > Location > Allow this site to access your location. For best accuracy, also enable "High accuracy" location mode in your device settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          retryMessage = 'Make sure GPS is enabled on your device and you have a stable internet connection. Try moving to an open area for better GPS reception.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out.';
          retryMessage = 'GPS signal may be weak. Try moving near a window or outdoors for better GPS reception, then try again.';
          break;
      }
      
      setUserLocationError(`${errorMessage} ${retryMessage}`);
      setLocationMessage({ 
        text: `${errorMessage} Try enabling high-accuracy GPS in your device settings.`, 
        type: 'error' 
      });
    }
  };

  const tryGetLocation = (options, attemptType = 'high') => {
    if (isCompleted) return; // Don't start new attempts if already completed
    
    attemptCount++;
    
    console.log(`🎯 Location attempt ${attemptCount}/${maxAttempts}: Seeking ${attemptType} precision...`);
    
    setLocationMessage({ 
      text: `🎯 Attempt ${attemptCount}/${maxAttempts}: Auto-detecting ${attemptType} precision location...`, 
      type: 'info' 
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (isCompleted) return; // Don't process if already completed
        
        const { latitude, longitude, accuracy } = position.coords;
        
        console.log(`📍 Location attempt ${attemptCount} (${attemptType}) result:`, {
          accuracy: Math.round(accuracy) + 'm',
          coordinates: [longitude, latitude],
          quality: accuracy <= 5 ? 'Ultra-precision' : 
                  accuracy <= 10 ? 'High-precision' : 
                  accuracy <= 20 ? 'Good precision' : 
                  accuracy <= 50 ? 'Fair precision' : 'Low precision'
        });

        // Update best position if this is more accurate
        if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
          console.log(`✅ New best position found: ${Math.round(accuracy)}m accuracy`);
        }

        // Enhanced thresholds for automatic high precision detection
        
        // If we get ultra-precision (≤ 5m), use it immediately - Perfect for clinic discovery
        if (accuracy <= 5) {
          console.log('🎯 Ultra-precision achieved! Using immediately.');
          completeLocationUpdate(position, 'Ultra-Precision GPS');
          return;
        }

        // If we get high precision (≤ 10m), use it immediately - Excellent for mapping
        if (accuracy <= 10) {
          console.log('🎯 High precision achieved! Using immediately.');
          completeLocationUpdate(position, 'High-Precision GPS');
          return;
        }

        // If we get very good precision (≤ 15m), use it on first attempt or immediately on later attempts
        if (accuracy <= 15) {
          console.log('📍 Very good precision achieved!');
          completeLocationUpdate(position, 'Very Good Precision');
          return;
        }

        // If we get good precision (≤ 25m), use it after second attempt
        if (accuracy <= 25 && attemptCount >= 2) {
          console.log('📍 Good precision achieved after multiple attempts.');
          completeLocationUpdate(position, 'Good Precision');
          return;
        }

        // If accuracy needs improvement, try continuous GPS tracking for ultra-high precision
        if (accuracy > 15 && attemptCount <= 2) {
          console.log(`🔄 Accuracy needs improvement (${Math.round(accuracy)}m). Starting continuous GPS tracking...`);
          
          setLocationMessage({ 
            text: `🔄 Enhancing precision (current: ${Math.round(accuracy)}m). Continuous GPS tracking active...`, 
            type: 'warning' 
          });
          
          let watchAttempts = 0;
          const maxWatchAttempts = 12; // More attempts for automatic high precision
          let bestWatchPosition = position;
          
          const watchId = navigator.geolocation.watchPosition(
            (watchPosition) => {
              if (isCompleted) {
                navigator.geolocation.clearWatch(watchId);
                return;
              }
              
              watchAttempts++;
              const watchAccuracy = watchPosition.coords.accuracy;
              const improvement = bestWatchPosition ? Math.round(bestWatchPosition.coords.accuracy - watchAccuracy) : 0;
              
              console.log(`🔄 Continuous GPS update ${watchAttempts}/${maxWatchAttempts}:`, {
                accuracy: Math.round(watchAccuracy) + 'm',
                improvement: improvement > 0 ? `+${improvement}m better` : improvement < 0 ? `${Math.abs(improvement)}m worse` : 'no change',
                quality: watchAccuracy <= 5 ? 'Ultra-precision' : 
                        watchAccuracy <= 10 ? 'High-precision' : 
                        watchAccuracy <= 20 ? 'Good precision' : 'Fair precision'
              });

              // Update best position from watching
              if (watchAccuracy < bestWatchPosition.coords.accuracy) {
                bestWatchPosition = watchPosition;
                console.log(`✅ GPS tracking improved accuracy to ${Math.round(watchAccuracy)}m`);
                
                // Update UI with improving accuracy
                setLocationMessage({ 
                  text: `🎯 GPS tracking improving: ${Math.round(watchAccuracy)}m accuracy (${watchAttempts}/${maxWatchAttempts})`, 
                  type: 'info' 
                });
              }
              
              // Ultra-precision achieved from continuous tracking - use immediately
              if (watchAccuracy <= 5) {
                console.log('🎯 Ultra-precision achieved via continuous GPS tracking!');
                navigator.geolocation.clearWatch(watchId);
                completeLocationUpdate(watchPosition, 'Ultra-Precision Tracking');
                return;
              }
              
              // High precision achieved from continuous tracking - use immediately
              if (watchAccuracy <= 10) {
                console.log('🎯 High precision achieved via continuous GPS tracking!');
                navigator.geolocation.clearWatch(watchId);
                completeLocationUpdate(watchPosition, 'High-Precision Tracking');
                return;
              }
              
              // Very good precision from tracking - use after some attempts
              if (watchAccuracy <= 15 && watchAttempts >= 3) {
                console.log('📍 Very good precision achieved via GPS tracking!');
                navigator.geolocation.clearWatch(watchId);
                completeLocationUpdate(watchPosition, 'Enhanced GPS Tracking');
                return;
              }
              
              // Good precision from tracking - use after more attempts
              if (watchAccuracy <= 20 && watchAttempts >= 6) {
                console.log('📍 Good precision achieved via extended GPS tracking!');
                navigator.geolocation.clearWatch(watchId);
                completeLocationUpdate(watchPosition, 'Extended GPS Tracking');
                return;
              }
              
              // Stop watching after max attempts and use best position
              if (watchAttempts >= maxWatchAttempts) {
                console.log(`⏰ Max GPS tracking attempts reached. Best accuracy: ${Math.round(bestWatchPosition.coords.accuracy)}m`);
                navigator.geolocation.clearWatch(watchId);
                
                if (bestWatchPosition.coords.accuracy <= 50) {
                  completeLocationUpdate(bestWatchPosition, 'Best GPS Available');
                } else {
                  console.log('🔄 GPS tracking insufficient. Trying medium accuracy...');
                  tryGetLocation(mediumAccuracyOptions, 'medium');
                }
              }
            },
            (watchError) => {
              navigator.geolocation.clearWatch(watchId);
              console.error('❌ GPS tracking error:', watchError);
              if (!isCompleted) {
                console.log('🔄 GPS tracking failed. Trying medium accuracy...');
                tryGetLocation(mediumAccuracyOptions, 'medium');
              }
            },
            { ...highAccuracyOptions, timeout: 30000 } // Extended timeout for watch
          );

          // Extended watch duration for automatic high precision
          setTimeout(() => {
            if (!isCompleted) {
              console.log(`⏰ GPS tracking timeout after 35 seconds. Best accuracy: ${Math.round(bestWatchPosition.coords.accuracy)}m`);
              navigator.geolocation.clearWatch(watchId);
              
              if (bestWatchPosition.coords.accuracy <= 40) {
                completeLocationUpdate(bestWatchPosition, 'Enhanced Auto-GPS');
              } else {
                console.log('🔄 Extended GPS tracking insufficient. Trying medium accuracy...');
                tryGetLocation(mediumAccuracyOptions, 'medium');
              }
            }
          }, 35000); // Longer timeout for automatic precision
        } else {
          // Try next accuracy level if attempts remaining
          if (attemptCount === 2) {
            console.log('🔄 Trying medium accuracy mode...');
            tryGetLocation(mediumAccuracyOptions, 'medium');
          } else if (attemptCount === 3) {
            console.log('🔄 Trying fallback accuracy mode...');
            tryGetLocation(fallbackOptions, 'fallback');
          }
        }
        
        // Final attempt - use best position we have
        if (attemptCount >= maxAttempts) {
          console.log(`🏁 Final attempt reached. Using best available position.`);
          if (bestPosition) {
            const bestAccuracy = bestPosition.coords.accuracy;
            const accuracyType = bestAccuracy <= 5 ? 'Ultra-precision (final)' :
                                bestAccuracy <= 10 ? 'High-precision (final)' :
                                bestAccuracy <= 25 ? 'Good precision (final)' :
                                bestAccuracy <= 50 ? 'Fair precision (final)' :
                                bestAccuracy <= 100 ? 'Basic precision (final)' : 'Limited precision';
            console.log(`🎯 Using best position: ${Math.round(bestAccuracy)}m accuracy`);
            completeLocationUpdate(bestPosition, accuracyType);
          } else {
            console.log('❌ No position obtained after all attempts');
            handleLocationError(new Error('No position obtained after all attempts'), true);
          }
        }
      },
      (error) => {
        console.error(`❌ Location attempt ${attemptCount} failed:`, error);
        handleLocationError(error, attemptCount >= maxAttempts);
      },
      options
    );
  };

  // Start with ultra-high accuracy attempt for automatic precision
  console.log('🚀 Starting automatic high-precision location detection...');
  tryGetLocation(highAccuracyOptions, 'high');
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
      
      // Add the new clinic to the state
      setClinicLocations(prev => [...prev, data.data]);
      
      // Force refresh the clinic locations from the server to ensure consistency
      setTimeout(() => {
        fetchClinicLocations();
      }, 500);
      
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
}, [apiUrl, currentusertoken, clinicFormData, resetClinicForm, fetchClinicLocations]);

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
      
      // Update the clinic in the state
      setClinicLocations(prev => prev.map(clinic => 
        clinic._id === selectedClinicLocation._id ? data.data : clinic
      ));
      
      // Force refresh the clinic locations from the server to ensure consistency
      setTimeout(() => {
        fetchClinicLocations();
      }, 500);
      
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
}, [apiUrl, currentusertoken, clinicFormData, selectedClinicLocation, resetClinicForm, fetchClinicLocations]);

const handleDeleteClinicLocation = useCallback(async () => {
  if (!selectedClinicLocation) return;

  setIsSavingLocation(true);
  try {
    const response = await fetch(`${apiUrl}/api/cliniclocation/clinics/${selectedClinicLocation.clinicId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // Remove the clinic from the state immediately
      setClinicLocations(prev => prev.filter(clinic => clinic._id !== selectedClinicLocation._id));
      
      // Force refresh the clinic locations from the server to ensure consistency
      setTimeout(() => {
        fetchClinicLocations();
      }, 500);
      
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
      throw new Error('Failed to delete clinic location');
    }
  } catch (error) {
    console.error('Error deleting clinic location:', error);
    setLocationMessage({ text: 'Failed to delete clinic location', type: 'error' });
  } finally {
    setIsSavingLocation(false);
  }
}, [apiUrl, currentusertoken, selectedClinicLocation]);

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
      
      // Update the clinic in the state without triggering map re-renders
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

// Initialize Mapbox map
useEffect(() => {
  // Only initialize if we're on the mapping dashboard and haven't initialized yet
  if (activedashboard !== 'mappingintegration' || !mapContainer.current || map.current) return;

  // Set Mapbox access token
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Initialize the map
  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11', // You can change this to satellite-v9 or other styles
    center: [120.4818, 14.6417], // Static center - Metro Manila center
    zoom: 10, // Static zoom level
    projection: 'mercator',
    // Disable rotation and pitch for smooth 2D experience
    bearing: 0, // North-up orientation
    pitch: 0, // Flat 2D view
    dragRotate: false, // Disable rotation with right-click drag
    pitchWithRotate: false, // Disable pitch adjustment
    touchPitch: false, // Disable touch pitch on mobile
    keyboard: true, // Keep keyboard navigation
    scrollZoom: true, // Keep scroll zoom
    boxZoom: true, // Keep box zoom
    dragPan: true, // Keep pan/drag
    doubleClickZoom: true, // Keep double-click zoom
    touchZoomRotate: {
      around: 'center' // Keep zoom but disable rotate on touch
    },
    // Performance optimizations for smooth interactions
    performanceMetricsCollection: false, // Disable metrics collection
    preserveDrawingBuffer: false, // Better performance
    antialias: false, // Disable antialiasing for better performance
    attributionControl: false, // Remove attribution for better performance
    logoPosition: 'bottom-right', // Keep logo but optimize position
    maxZoom: 18, // Limit max zoom for better performance
    minZoom: 8, // Limit min zoom for Metro Manila area
    renderWorldCopies: false, // Don't render world copies for better performance
    optimizeForTerrain: false, // Optimize for 2D performance
    // Reduce rendering frequency for smoother interactions
    maxTileCacheSize: 50, // Reduce tile cache size
    localIdeographFontFamily: false, // Disable local font loading
    // Enable hardware acceleration
    failIfMajorPerformanceCaveat: false,
    // Smooth transitions but optimized
    fadeDuration: 0, // Disable fade for better performance during interaction
    crossSourceCollisions: false // Disable collision detection for better performance
  });

  // Add navigation controls (without rotation controls)
  map.current.addControl(new mapboxgl.NavigationControl({
    showCompass: false, // Hide compass since rotation is disabled
    showZoom: true,
    visualizePitch: false // Hide pitch visualization
  }));

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
  
  map.current.addControl(geolocate);

  // Handle map load
  map.current.on('load', () => {
    console.log('Map loaded successfully');
    setMapLoaded(true);
    
    // Additional performance optimizations after map loads
    const mapInstance = map.current;
    
    // Optimize rendering for smooth interactions
    mapInstance._logoControl && mapInstance.removeControl(mapInstance._logoControl);
    
    // Set canvas context attributes for better performance
    const canvas = mapInstance.getCanvasContainer().querySelector('canvas');
    if (canvas) {
      canvas.style.willChange = 'transform';
      canvas.style.imageRendering = 'pixelated'; // Faster rendering during movement
    }
    
    // Optimize pan and zoom performance
    mapInstance.scrollZoom.setWheelZoomRate(1/300); // Smoother scroll zoom
    mapInstance.dragPan.setDragPan({ inertia: true, deceleration: 3000 }); // Smooth drag with inertia
    
    // Performance optimizations for smooth map interactions
    const optimizeMapPerformance = () => {
      const mapInstance = map.current;
      
      // Throttle move events to reduce CPU usage during pan/zoom
      let moveTimeout;
      mapInstance.on('movestart', () => {
        // Disable marker animations during movement for better performance
        const markers = document.querySelectorAll('.clinic-marker, .user-location-marker');
        markers.forEach(marker => {
          marker.style.transition = 'none';
        });
      });
      
      mapInstance.on('move', () => {
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          // Re-enable animations after movement stops
          const markers = document.querySelectorAll('.clinic-marker, .user-location-marker');
          markers.forEach(marker => {
            marker.style.transition = 'all 0.2s ease-out';
          });
        }, 100);
      });
      
      mapInstance.on('moveend', () => {
        // Re-enable all animations when movement ends
        const markers = document.querySelectorAll('.clinic-marker, .user-location-marker');
        markers.forEach(marker => {
          marker.style.transition = 'all 0.2s ease-out';
        });
      });
    };
    
    // Apply performance optimizations
    optimizeMapPerformance();
  });

  // Clean up on unmount
  return () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
      setMapLoaded(false);
    }
  };
}, [activedashboard]); // Only re-initialize when switching to/from mapping dashboard

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
  
  console.log('🔄 Clinic markers effect triggered');
  console.log('📍 Map loaded:', mapLoaded);
  console.log('🏥 Clinic locations count:', clinicLocations?.length);
  console.log('📋 Clinic locations data:', clinicLocations);
  
  // Clear existing clinic markers
  const existingMarkers = document.querySelectorAll('.clinic-marker');
  console.log('🧹 Clearing existing markers:', existingMarkers.length);
  existingMarkers.forEach(marker => {
    const parent = marker.parentElement;
    if (parent) parent.remove();
  });
  
  // Add clinic markers with debugging
  if (Array.isArray(clinicLocations) && clinicLocations.length > 0) {
    console.log('➕ Adding clinic markers...');
    clinicLocations.forEach((clinic, index) => {
      console.log(`🏥 Processing clinic ${index + 1}/${clinicLocations.length}:`, clinic.clinicName);
      console.log(`📍 Clinic coordinates:`, clinic.coordinates);
      
      // Handle GeoJSON format from database: coordinates.coordinates = [longitude, latitude]
      let longitude, latitude;
      
      if (clinic.coordinates?.coordinates && Array.isArray(clinic.coordinates.coordinates)) {
        // GeoJSON format from database
        longitude = clinic.coordinates.coordinates[0];
        latitude = clinic.coordinates.coordinates[1];
        console.log(`Using GeoJSON coordinates: [${longitude}, ${latitude}]`);
      } else if (clinic.coordinates?.longitude && clinic.coordinates?.latitude) {
        // Object format
        longitude = clinic.coordinates.longitude;
        latitude = clinic.coordinates.latitude;
        console.log(`Using object coordinates: [${longitude}, ${latitude}]`);
      }
      
      if (longitude && latitude) {
        console.log(`Creating marker for ${clinic.clinicName} at [${longitude}, ${latitude}]`);
        
        // Create marker element with enhanced styling for different clinic types
        const markerEl = document.createElement('div');
        markerEl.className = 'clinic-marker';
        
        // Determine marker styling based on clinic type
        let backgroundColor, borderColor, markerText, markerIcon;
        if (clinic.clinicType === 'Ambher Optical') {
          backgroundColor = '#3B82F6';
          borderColor = 'white';
          markerText = 'A';
          markerIcon = '';
        } else if (clinic.clinicType === 'Bautista Eye Center') {
          backgroundColor = '#EF4444';
          borderColor = 'white';
          markerText = 'B';
          markerIcon = '';
        } else if (clinic.clinicType === 'External Eye Clinic' || clinic.isExternal) {
          backgroundColor = '#10B981';
          borderColor = 'white';
          markerText = 'E';
          markerIcon = '👁️';
        } else {
          backgroundColor = '#8B5CF6';
          borderColor = 'white';
          markerText = 'O';
          markerIcon = '';
        }
        
        markerEl.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: ${backgroundColor};
          border: 3px solid ${borderColor};
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${clinic.isExternal ? '16px' : '12px'};
          z-index: 1000;
          transition: all 0.2s ease;
        `;
        markerEl.innerHTML = clinic.isExternal ? markerIcon : markerText;

        // Enhanced popup content with more details
        const popupContent = `
          <div class="p-3 min-w-64">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-sm text-gray-800 flex-1">${clinic.clinicName}</h3>
              <span class="ml-2 px-2 py-1 text-xs rounded-full ${
                clinic.clinicType === 'Ambher Optical' ? 'bg-blue-100 text-blue-800' :
                clinic.clinicType === 'Bautista Eye Center' ? 'bg-red-100 text-red-800' :
                clinic.isExternal ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }">${clinic.clinicType}</span>
            </div>
            
            <div class="space-y-1 text-xs text-gray-600">
              <div class="flex items-start">
                <i class="bx bx-map-pin text-gray-400 mr-1 mt-0.5"></i>
                <span>${clinic.address?.fullAddress || 'No address available'}</span>
              </div>
              
              <div class="flex items-center">
                <i class="bx bx-phone text-gray-400 mr-1"></i>
                <span>${clinic.contactInfo?.phone || 'Contact info not available'}</span>
              </div>
              
              ${clinic.distance ? `
                <div class="flex items-center">
                  <i class="bx bx-current-location text-gray-400 mr-1"></i>
                  <span>${clinic.distance}km from your location</span>
                </div>
              ` : ''}
              
              ${clinic.services && clinic.services.length > 0 ? `
                <div class="mt-2">
                  <div class="text-xs font-medium text-gray-700 mb-1">Services:</div>
                  <div class="flex flex-wrap gap-1">
                    ${clinic.services.slice(0, 3).map(service => 
                      `<span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">${service}</span>`
                    ).join('')}
                    ${clinic.services.length > 3 ? `<span class="text-xs text-gray-500">+${clinic.services.length - 3} more</span>` : ''}
                  </div>
                </div>
              ` : ''}
              
              ${clinic.isExternal ? `
                <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <div class="flex items-center text-xs text-yellow-800">
                    <i class="bx bx-info-circle mr-1"></i>
                    External clinic - verify details before visiting
                  </div>
                  ${clinic.verified === false ? `
                    <button onclick="addToDatabase('${clinic.id}')" class="mt-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                      Add to Database
                    </button>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        `;

        // Create popup
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        // Add marker to map
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map.current);
          
        console.log(`Marker created and added for ${clinic.clinicName}`);
      } else {
        console.warn(`Clinic ${clinic.clinicName} has invalid coordinates:`, clinic.coordinates);
      }
    });
    
    setLocationMessage({ 
      text: `${clinicLocations.length} clinic locations loaded on map`, 
      type: 'success' 
    });
  } else {
    console.warn('No clinic locations found or not an array:', clinicLocations);
    setLocationMessage({ 
      text: 'No clinic locations available to display', 
      type: 'warning' 
    });
  }

  // Add nearby clinic markers if they exist
  if (Array.isArray(nearbyEyeClinics) && nearbyEyeClinics.length > 0) {
    nearbyEyeClinics.forEach((clinic) => {
      if (clinic.coordinates?.longitude && clinic.coordinates?.latitude) {
        console.log(`Creating nearby clinic marker for ${clinic.name}`);
        
        // Create marker for nearby clinic with special styling
        const nearbyMarkerEl = document.createElement('div');
        nearbyMarkerEl.className = 'clinic-marker nearby-clinic-marker';
        nearbyMarkerEl.style.cssText = `
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #10B981;
          border: 2px solid #FBBF24;
          box-shadow: 0 2px 8px rgba(16,185,129,0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          z-index: 1000;
          animation: pulse 2s infinite;
        `;
        nearbyMarkerEl.innerHTML = '👁️';

        // Create popup for nearby clinic
        const nearbyPopup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3 min-w-64">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-sm text-gray-800 flex-1">${clinic.name}</h3>
              <span class="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                Nearby
              </span>
            </div>
            
            <div class="space-y-1 text-xs text-gray-600">
              <div class="flex items-start">
                <i class="bx bx-map-pin text-gray-400 mr-1 mt-0.5"></i>
                <span>${clinic.address?.fullAddress || 'Address not available'}</span>
              </div>
              
              <div class="flex items-center">
                <i class="bx bx-current-location text-gray-400 mr-1"></i>
                <span>${clinic.distance}km from your location</span>
              </div>
              
              <div class="flex items-center">
                <i class="bx bx-search-alt text-gray-400 mr-1"></i>
                <span>Found via: ${clinic.searchTerm}</span>
              </div>
              
              <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <div class="flex items-center text-xs text-green-800 mb-2">
                  <i class="bx bx-info-circle mr-1"></i>
                  External clinic found nearby
                </div>
                <button 
                  onclick="window.addNearbyClinicToDatabase('${clinic.id}')" 
                  class="w-full px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                  Add to Database
                </button>
              </div>
            </div>
          </div>
        `);

        // Add nearby clinic marker to map
        new mapboxgl.Marker(nearbyMarkerEl)
          .setLngLat([clinic.coordinates.longitude, clinic.coordinates.latitude])
          .setPopup(nearbyPopup)
          .addTo(map.current);
      }
    });
  }
}, [mapLoaded, clinicLocations, nearbyEyeClinics]);

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
    userMarkerEl.className = 'user-location-marker';
    userMarkerEl.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #10B981;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: pulse 2s infinite;
    `;

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
                    <button
                      onClick={getUserLocation}
                      disabled={loadingUserLocation}
                      className={`px-4 py-2 text-white rounded-lg transition-colors font-medium flex items-center gap-2 ${
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
                      <div className="flex flex-col items-start">
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
                    </button>
                    
                    <button
                      onClick={() => {
                        resetClinicForm();
                        setShowAddClinicDialog(true);
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      <i className="bx bx-plus mr-2"></i>
                      Add Clinic
                    </button>
                    
                    <button
                      onClick={() => setIsEditingLocation(!isEditingLocation)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isEditingLocation 
                          ? 'bg-orange-500 text-white hover:bg-orange-600' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <i className={`bx ${isEditingLocation ? 'bx-x' : 'bx-edit'} mr-2`}></i>
                      {isEditingLocation ? 'Cancel Edit' : 'Edit Mode'}
                    </button>
                  </div>
                </div>

                {/* Status Messages */}
                {locationMessage.text && (
                  <div className={`transition-all duration-300 ease-in-out mb-4 p-3 rounded-lg ${
                    locationMessage.type === 'success' ? 'bg-green-100 border border-green-300 text-green-800' :
                    locationMessage.type === 'error' ? 'bg-red-100 border border-red-300 text-red-800' :
                    locationMessage.type === 'warning' ? 'bg-yellow-100 border border-yellow-300 text-yellow-800' :
                    'bg-blue-100 border border-blue-300 text-blue-800'
                  }`}>
                    <div className="transition-all duration-300 ease-in-out flex items-center">
                      <i className={`bx ${
                        locationMessage.type === 'success' ? 'bx-check-circle' :
                        locationMessage.type === 'error' ? 'bx-error-circle' :
                        locationMessage.type === 'warning' ? 'bx-error' :
                        'bx-info-circle'
                      } mr-2`}></i>
                      {locationMessage.text}
                    </div>
                  </div>
                )}

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
                <div className="transition-all duration-300 ease-in-out gap-4 flex justify-center items-start flex-1 min-h-140 h-auto">
                  
                  {/* Geographic Map Container - 70% width */}
                  <div id="geographicmapcontainer" className="transition-all duration-300 ease-in-out relative bg-gray-100 rounded-2xl shadow-lg flex flex-col justify-center items-center w-[70%]  overflow-hidden">
                    {/* Mapbox Container */}
                    <div 
                      ref={mapContainer}
                      className="transition-all duration-300 ease-in-out w-full h-full rounded-2xl"
                      style={{ 
                        minHeight: '580px',
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


                    {/*Real time longitude and latitude*/}
                    <div 
                      id="realtimelongitudeandlatitude" 
                      className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20 cursor-pointer hover:bg-white transition-colors"
                      onClick={copyCoordinatesToClipboard}
                      title="Click to copy coordinates to clipboard"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                        <i className="bx bx-crosshair mr-1"></i>
                        Real-time Coordinates
                        <i className="bx bx-copy ml-2 text-gray-500 text-xs"></i>
                      </h4>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Longitude:</span>
                          <span className="text-blue-600 font-semibold">
                            {realtimeCoordinates.longitude.toFixed(6)}°
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Latitude:</span>
                          <span className="text-green-600 font-semibold">
                            {realtimeCoordinates.latitude.toFixed(6)}°
                          </span>
                        </div>
                        {realtimeCoordinates.accuracy && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accuracy:</span>
                            <span className={`font-semibold ${
                              realtimeCoordinates.accuracy <= 20 ? 'text-green-500' :
                              realtimeCoordinates.accuracy <= 50 ? 'text-yellow-500' :
                              'text-red-500'
                            }`}>
                              ±{Math.round(realtimeCoordinates.accuracy)}m
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-gray-200">
                          <span className="text-gray-500">Updated:</span>
                          <span className="text-gray-500">
                            {realtimeCoordinates.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Map Legend */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg z-20">
                      <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                          <span>Ambher Optical</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow"></div>
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
                  <div id="cliniclocationscontainer" className="bg-white shadow-lg rounded-2xl flex flex-col w-[30%] min-h-[580px] overflow-y-auto">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h3 className="font-bold text-gray-800 mb-1 flex items-center">
                        <i className="bx bx-list-ul mr-2 text-[#184d85]"></i>
                        Clinic Locations
                      </h3>
                      <p className="text-sm text-gray-600">Total: {clinicLocations?.length || 0} clinics</p>
                    </div>
                    
                    {/* Clinic List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                              <button
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
                              </button>
                              <button
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
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedClinicLocation(clinic);
                                  setShowDeleteClinicDialog(true);
                                }}
                                className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                              >
                                <i className="bx bx-trash"></i>
                                Delete
                              </button>
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