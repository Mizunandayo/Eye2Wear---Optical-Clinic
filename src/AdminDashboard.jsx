"use client"

import React, { useState,useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate} from "react-router-dom";
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
import useCloudinaryUpload from './hooks/useCloudinaryUpload';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { checkAndUpdateOrderStatus, updateAmbherOrderStatus, updateBautistaOrderStatus } from '../utils/orderStatusUpdater';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, LabelList } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Target, DollarSign, Package, Users, Calendar, RefreshCw, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./components/ui/chart";


















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

const SmsRowSkeleton = () => (
  <tr className="animate-pulse hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2">
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-6 bg-gray-300 rounded-full w-12 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-6 bg-gray-300 rounded-full w-24 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-6 bg-gray-300 rounded-full w-16 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-12 mx-auto"></div>
    </td>
    <td className="py-3 px-6 text-center">
      <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
    </td>
  </tr>
);

// Interactive Bar Chart Component for Completed Appointments
const InteractiveAppointmentChart = ({ appointmentsData, isAmbherOnlyUser, isBautistaOnlyUser, currentuserloggedin, getFilterDisplayText }) => {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [activeChart, setActiveChart] = React.useState("ambher");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

  // Function to extract available years from appointment data
  const getAvailableYearsFromAppointments = React.useCallback(() => {
    if (!appointmentsData || appointmentsData.length === 0) return [new Date().getFullYear()];
    
    const years = new Set();
    appointmentsData.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      if (!isNaN(appointmentDate.getTime())) {
        years.add(appointmentDate.getFullYear());
      }
    });
    
    return Array.from(years).sort((a, b) => b - a); // Sort in descending order (newest first)
  }, [appointmentsData]);

  // Filter data based on selected time range and generate complete date range
  const filteredData = React.useMemo(() => {
    if (!appointmentsData || appointmentsData.length === 0) return [];
    
    const now = new Date();
    let startDate, endDate;
    
    if (timeRange === "30d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      endDate = new Date(now);
    } else if (timeRange === "7d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date(now);
    } else if (timeRange === "365d") {
      // For Last Year, use the selected year
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    } else { // 90d
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 90);
      endDate = new Date(now);
    }
    
    // Generate complete date range
    const dateRange = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      dateRange.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Create a map of existing data for quick lookup
    const dataMap = appointmentsData.reduce((acc, item) => {
      const itemDate = new Date(item.date);
      if (itemDate >= startDate && itemDate <= endDate) {
        const dateString = itemDate.toISOString().split('T')[0];
        acc[dateString] = item;
      }
      return acc;
    }, {});
    
    // Generate complete dataset with zero values for missing dates
    // Apply clinic-specific filtering based on user permissions
    return dateRange.map(dateString => {
      const existingData = dataMap[dateString];
      return {
        date: dateString,
        ambher: (isAmbherOnlyUser() || currentuserloggedin === "Admin") ? (existingData?.ambher || 0) : 0,
        bautista: (isBautistaOnlyUser() || currentuserloggedin === "Admin") ? (existingData?.bautista || 0) : 0,
        total: ((isAmbherOnlyUser() || currentuserloggedin === "Admin") ? (existingData?.ambher || 0) : 0) + 
               ((isBautistaOnlyUser() || currentuserloggedin === "Admin") ? (existingData?.bautista || 0) : 0)
      };
    });
  }, [appointmentsData, timeRange, selectedYear, isAmbherOnlyUser, isBautistaOnlyUser, currentuserloggedin]);

  // Calculate totals for the filtered period
  const totals = React.useMemo(() => {
    if (!filteredData || filteredData.length === 0) return { ambher: 0, bautista: 0, total: 0 };
    
    return filteredData.reduce((acc, item) => ({
      ambher: acc.ambher + (item.ambher || 0),
      bautista: acc.bautista + (item.bautista || 0),
      total: acc.total + (item.total || 0)
    }), { ambher: 0, bautista: 0, total: 0 });
  }, [filteredData]);

  // Dynamic color theme based on user clinic
  const getChartColors = () => {
    if (isAmbherOnlyUser()) {
      return {
        ambher: "#66944C", // Primary green
        bautista: "#8ba888" // Secondary green
      };
    } else if (isBautistaOnlyUser()) {
      return {
        ambher: "#3b82f6", // Secondary blue
        bautista: "#1e3a8a" // Navy blue
      };
    } else {
      return {
        ambher: "#66944C", // Primary green for Ambher
        bautista: "#1e3a8a" // Navy for Bautista
      };
    }
  };

  const chartColors = getChartColors();

  // Generate dynamic title based on time range and selected year
  const getAppointmentChartTitle = () => {
    const dateText = getFilterDisplayText(timeRange, selectedYear);
    return `Completed Appointments - ${dateText}`;
  };

  // Determine available chart options based on user permissions
  const availableCharts = React.useMemo(() => {
    const charts = [];
    if (isAmbherOnlyUser() || currentuserloggedin === "Admin") {
      charts.push({ key: "ambher", label: "Ambher Completed", color: chartColors.ambher });
    }
    if (isBautistaOnlyUser() || currentuserloggedin === "Admin") {
      charts.push({ key: "bautista", label: "Bautista Completed", color: chartColors.bautista });
    }
    return charts;
  }, [isAmbherOnlyUser, isBautistaOnlyUser, currentuserloggedin, chartColors]);

  // Set default active chart based on available options
  React.useEffect(() => {
    if (availableCharts.length > 0 && !availableCharts.find(chart => chart.key === activeChart)) {
      setActiveChart(availableCharts[0].key);
    }
  }, [availableCharts, activeChart]);

  return (
    <div className="bg-gradient-to-b from-white to-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header with Interactive Buttons */}
      <div className="flex flex-col items-stretch border-b sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
          <h3 className="text-xl font-bold text-gray-800 font-albertsans">{getAppointmentChartTitle()}</h3>
          <p className="text-sm text-gray-600 font-albertsans">
            Interactive view of completed appointments over selected time period
          </p>
        </div>
        
        {/* Interactive Chart Selector */}
        <div className="flex">
          {availableCharts.map((chart) => (
            <button
              key={chart.key}
              onClick={() => setActiveChart(chart.key)}
              className={`relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors ${
                activeChart === chart.key 
                  ? 'bg-gray-50 border-l-2' 
                  : 'hover:bg-gray-25'
              } sm:border-t-0 sm:border-l sm:px-8 sm:py-6`}
              style={{ 
                borderLeftColor: activeChart === chart.key ? chart.color : undefined,
                backgroundColor: activeChart === chart.key ? `${chart.color}10` : undefined 
              }}
            >
              <span className="text-xs text-gray-500 font-albertsans">
                {chart.label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-2xl font-albertsans">
                {totals[chart.key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 px-6 py-4 border-t sm:border-t-0 sm:border-l">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full sm:w-[140px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
            aria-label="Select time range"
          >
            <option value="365d">Last Year</option>
            <option value="90d">Last 3 months</option>
            <option value="30d">Last 30 days</option>
            <option value="7d">Last 7 days</option>
          </select>
          {timeRange === "365d" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-[100px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
              aria-label="Select year for appointments"
            >
              {getAvailableYearsFromAppointments().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div className="px-2 pt-4 sm:px-6 sm:pt-6 pb-6">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={filteredData}
              margin={{ left: 12, right: 12, top: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (timeRange === "365d") {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "2-digit",
                    });
                  }
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis 
                domain={[0, 'dataMax']}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800 font-albertsans mb-2">
                          {new Date(label).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="font-albertsans text-sm" style={{ color: chartColors[activeChart] }}>
                          {availableCharts.find(chart => chart.key === activeChart)?.label}: {payload[0]?.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey={activeChart} 
                fill={chartColors[activeChart]}
                radius={8}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <i className="bx bx-bar-chart-alt-2 text-4xl mb-2"></i>
              <p className="font-albertsans">No completed appointment data available for the selected period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Interactive Revenue Chart Component
const InteractiveRevenueChart = ({ rawOrderData, rawAppointmentData, isAmbherOnlyUser, isBautistaOnlyUser, currentuserloggedin, getFilterDisplayText }) => {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [dataFilter, setDataFilter] = React.useState("all"); // all, appointments, orders
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());

  // Function to extract available years from order and appointment data
  const getAvailableYearsFromRevenue = React.useCallback(() => {
    const years = new Set();
    
    // Add years from order data
    if (rawOrderData && rawOrderData.length > 0) {
      rawOrderData.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (!isNaN(orderDate.getTime())) {
          years.add(orderDate.getFullYear());
        }
      });
    }
    
    // Add years from appointment data
    if (rawAppointmentData && rawAppointmentData.length > 0) {
      rawAppointmentData.forEach(appointment => {
        const appointmentDate = new Date(appointment.patientappointmentcreateddate || appointment.createdAt);
        if (!isNaN(appointmentDate.getTime())) {
          years.add(appointmentDate.getFullYear());
        }
      });
    }
    
    return Array.from(years).sort((a, b) => b - a); // Sort in descending order (newest first)
  }, [rawOrderData, rawAppointmentData]);

  // Filter and process data based on selected time range and data filter
  const filteredData = React.useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    
    if (timeRange === "30d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
      endDate = new Date(now);
    } else if (timeRange === "7d") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date(now);
    } else if (timeRange === "365d") {
      // For Last Year, use the selected year
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    } else { // 90d
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 90);
      endDate = new Date(now);
    }
    
    // Always use daily data from raw orders and appointments for consistency
    // This ensures data is available for all time ranges
    const dailyRevenue = {};
    
    // Initialize all dates in range with 0 revenue
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyRevenue[dateStr] = { 
        date: dateStr, 
        ordersRevenue: 0, 
        appointmentsRevenue: 0,
        totalRevenue: 0
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Process raw orders to calculate daily revenue
    if (rawOrderData && rawOrderData.length > 0) {
      rawOrderData.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= startDate && orderDate <= endDate) {
          // Only include completed orders
          const isCompleted = order.patientorderambherstatus === 'Completed' || 
                             order.patientorderbautistastatus === 'Completed';
          
          if (isCompleted) {
            // Apply clinic filtering
            let includeOrder = false;
            if (currentuserloggedin === "Admin") {
              includeOrder = true;
            } else if (isAmbherOnlyUser && isAmbherOnlyUser()) {
              includeOrder = order.patientorderambherproducttotal > 0;
            } else if (isBautistaOnlyUser && isBautistaOnlyUser()) {
              includeOrder = order.patientorderbautistaproducttotal > 0;
            }
            
            if (includeOrder) {
              const dateStr = orderDate.toISOString().split('T')[0];
              const total = order.patientorderambherproducttotal || order.patientorderbautistaproducttotal || 0;
              if (dailyRevenue[dateStr]) {
                dailyRevenue[dateStr].ordersRevenue += total;
              }
            }
          }
        }
      });
    }
    
    // Process raw appointments to calculate daily revenue
    if (rawAppointmentData && rawAppointmentData.length > 0) {
      rawAppointmentData.forEach(appointment => {
        const appointmentDate = new Date(appointment.createdAt || appointment.patientambherappointmentdate || appointment.patientbautistaappointmentdate);
        if (appointmentDate >= startDate && appointmentDate <= endDate) {
          // Only include completed appointments
          const isAmbherCompleted = appointment.patientambherappointmentstatus === 'Completed';
          const isBautistaCompleted = appointment.patientbautistaappointmentstatus === 'Completed';
          
          if (isAmbherCompleted || isBautistaCompleted) {
            // Apply clinic filtering
            let includeAppointment = false;
            if (currentuserloggedin === "Admin") {
              includeAppointment = true;
            } else if (isAmbherOnlyUser && isAmbherOnlyUser()) {
              includeAppointment = appointment.patientambherappointmentdate;
            } else if (isBautistaOnlyUser && isBautistaOnlyUser()) {
              includeAppointment = appointment.patientbautistaappointmentdate;
            }
            
            if (includeAppointment) {
              const dateStr = appointmentDate.toISOString().split('T')[0];
              const ambherPayment = isAmbherCompleted ? (appointment.patientambherappointmentpaymentotal || 0) : 0;
              const bautistaPayment = isBautistaCompleted ? (appointment.patientbautistaappointmentpaymentotal || 0) : 0;
              const total = ambherPayment + bautistaPayment;
              
              if (dailyRevenue[dateStr]) {
                dailyRevenue[dateStr].appointmentsRevenue += total;
              }
            }
          }
        }
      });
    }
    
    // Calculate total revenue and apply data filter
    Object.values(dailyRevenue).forEach(item => {
      if (dataFilter === "appointments") {
        item.totalRevenue = item.appointmentsRevenue;
      } else if (dataFilter === "orders") {
        item.totalRevenue = item.ordersRevenue;
      } else {
        item.totalRevenue = item.ordersRevenue + item.appointmentsRevenue;
      }
    });
    
    return Object.values(dailyRevenue).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [rawOrderData, rawAppointmentData, timeRange, selectedYear, dataFilter, isAmbherOnlyUser, isBautistaOnlyUser, currentuserloggedin]);

  // Calculate total revenue for the filtered period
  const totalRevenue = React.useMemo(() => {
    if (!filteredData || filteredData.length === 0) return { total: 0, orders: 0, appointments: 0 };
    
    const totals = filteredData.reduce((acc, item) => {
      acc.total += (item.totalRevenue || 0);
      acc.orders += (item.ordersRevenue || 0);
      acc.appointments += (item.appointmentsRevenue || 0);
      return acc;
    }, { total: 0, orders: 0, appointments: 0 });
    
    return totals;
  }, [filteredData]);

  // Dynamic title based on selected time range and data filter
  const getChartTitle = () => {
    const filterText = dataFilter === "appointments" ? "Appointments " : 
                      dataFilter === "orders" ? "Orders " : "";
    
    const dateText = getFilterDisplayText(timeRange, selectedYear);
    return `${filterText}Revenue - ${dateText}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header with Controls */}
      <div className="flex items-center gap-2 border-b py-5 px-6 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#184d85]" />
            <h3 className="text-xl font-bold text-gray-800 font-albertsans">{getChartTitle()}</h3>
          </div>
          <p className="text-sm text-gray-600 font-albertsans">
            Showing revenue trends for the selected period
          </p>
          {/* Summary for selected period */}
          {filteredData.length > 0 && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-albertsans">
              {dataFilter === "all" ? (
                <>
                  <span>Total Revenue: <strong className="text-gray-700">₱{totalRevenue.total.toLocaleString()}</strong></span>
                  <span>Orders: <strong className="text-green-600">₱{totalRevenue.orders.toLocaleString()}</strong></span>
                  <span>Appointments: <strong className="text-blue-600">₱{totalRevenue.appointments.toLocaleString()}</strong></span>
                </>
              ) : dataFilter === "orders" ? (
                <span>Orders Revenue: <strong className="text-green-600">₱{totalRevenue.orders.toLocaleString()}</strong></span>
              ) : (
                <span>Appointments Revenue: <strong className="text-blue-600">₱{totalRevenue.appointments.toLocaleString()}</strong></span>
              )}
              <span>{timeRange === "7d" || timeRange === "30d" ? "Days" : "Months"}: <strong className="text-gray-700">{filteredData.length}</strong></span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Data Filter */}
          <select
            value={dataFilter}
            onChange={(e) => setDataFilter(e.target.value)}
            className="w-[140px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
            aria-label="Select data type"
          >
            <option value="all">All</option>
            <option value="appointments">Appointments</option>
            <option value="orders">Orders</option>
          </select>
          
          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-[160px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
            aria-label="Select time range"
          >
            <option value="365d">Last Year</option>
            <option value="90d">Last 3 months</option>
            <option value="30d">Last 30 days</option>
            <option value="7d">Last 7 days</option>
          </select>
          
          {/* Year Selector - appears when Last Year is selected */}
          {timeRange === "365d" && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-[100px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
              aria-label="Select year for revenue"
            >
              {getAvailableYearsFromRevenue().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      
      {/* Chart Content */}
      <div className="px-2 pt-4 sm:px-6 sm:pt-6 pb-6">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart 
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: timeRange === "30d" ? 25 : 0 }}
            >
              <defs>
                {/* Orders gradient (Green) */}
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#66944C"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#66944C"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                {/* Appointments gradient (Blue) */}
                <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#206ba3"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#206ba3"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                {/* Total revenue gradient (Purple) */}
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={timeRange === "30d" ? 80 : timeRange === "365d" || timeRange === "90d" ? 120 : 32}
                angle={0}
                textAnchor="middle"
                height={30}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (timeRange === "7d") {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  } else if (timeRange === "30d") {
                    // For 30 days, show Jul 16 format
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  } else if (timeRange === "90d") {
                    // For 90 days, show month and day but less frequently
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  } else if (timeRange === "365d") {
                    // For 365 days, show month and year
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "2-digit",
                    });
                  }
                  return value;
                }}
                interval={
                  timeRange === "7d" ? 0 :
                  timeRange === "30d" ? Math.ceil(filteredData.length / 8) :
                  timeRange === "90d" ? Math.ceil(filteredData.length / 10) :
                  timeRange === "365d" ? Math.ceil(filteredData.length / 12) :
                  "preserveStart"
                }
              />
              <YAxis 
                domain={[0, 'dataMax']}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₱${value.toLocaleString()}`}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800 font-albertsans mb-2">
                          {timeRange === "7d" || timeRange === "30d" || timeRange === "365d"
                            ? new Date(label).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })
                            : label
                          }
                        </p>
                        {payload.map((entry, index) => (
                          <p key={index} style={{ color: entry.color }} className="font-albertsans text-sm">
                            {entry.name}: ₱{entry.value?.toLocaleString()}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Conditional rendering based on data filter */}
              {dataFilter === "all" ? (
                <>
                  {/* Show both orders and appointments as separate lines (not stacked) */}
                  <Area
                    dataKey="ordersRevenue"
                    type="monotone"
                    fill="url(#fillOrders)"
                    stroke="#66944C"
                    strokeWidth={2}
                    name="Orders Revenue"
                    fillOpacity={0.6}
                  />
                  <Area
                    dataKey="appointmentsRevenue"
                    type="monotone"
                    fill="url(#fillAppointments)"
                    stroke="#206ba3"
                    strokeWidth={2}
                    name="Appointments Revenue"
                    fillOpacity={0.6}
                  />
                </>
              ) : dataFilter === "orders" ? (
                <Area
                  dataKey="ordersRevenue"
                  type="monotone"
                  fill="url(#fillOrders)"
                  stroke="#66944C"
                  strokeWidth={2}
                  name="Orders Revenue"
                />
              ) : (
                <Area
                  dataKey="appointmentsRevenue"
                  type="monotone"
                  fill="url(#fillAppointments)"
                  stroke="#206ba3"
                  strokeWidth={2}
                  name="Appointments Revenue"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <i className="bx bx-trending-up text-4xl mb-2"></i>
              <p className="font-albertsans">No revenue data available for the selected period</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500 mx-auto mb-2"></div>
            <p className="text-sm">Loading image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (imageData && !imageError) {
    // Handle different image formats:
    // 1. Cloudinary URLs (http/https)
    // 2. Data URLs (data:image/...)
    // 3. BASE64 strings (fallback for old data)
    let imageSrc;
    if (imageData.startsWith('http')) {
      // Cloudinary URL - use directly
      imageSrc = imageData;
    } else if (imageData.startsWith('data:')) {
      // Data URL - use directly
      imageSrc = imageData;
    } else {
      // Assume BASE64 string (for backward compatibility)
      imageSrc = `data:image/jpeg;base64,${imageData}`;
    }

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

// Multi-File Viewer Component for Other Clinic Records
const OtherClinicMultiFileViewer = ({ record, onFileClick, showToast }) => {
  const [isLoading, setIsLoading] = useState(false);

  // API URL for secure downloads
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Function to get file extension from URL or filename
  const getFileExtension = (url) => {
    if (!url) return '';
    
    // Remove query parameters and get the path
    const cleanUrl = url.split('?')[0];
    const extension = cleanUrl.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  // Function to determine file type
  const getFileType = (url) => {
    const extension = getFileExtension(url);
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else if (url.includes('raw/upload')) {
      // Cloudinary raw uploads are typically PDFs or documents
      return 'pdf';
    } else {
      return 'document';
    }
  };

  // Function to download file with correct extension
  const downloadFile = async (url, originalName, fileIndex = null) => {
    try {
      setIsLoading(true);
      
      // Check if it's a Cloudinary URL and extract public ID
      if (url.includes('cloudinary.com') && url.includes('otherclinic_record_')) {
        // Use the stored public ID from the database instead of parsing from URL
        const publicIds = record?.patientotherclinicrecordfiles_public_ids || [];
        const singleImagePublicId = record?.patientotherclinicrecordimage_public_id;
        let publicIdWithPath = null;
        
        if (fileIndex !== null && publicIds[fileIndex]) {
          // Use the stored public ID for the specific file index
          publicIdWithPath = publicIds[fileIndex];
        } else if (url === singleImage && singleImagePublicId) {
          // Handle single image case
          publicIdWithPath = singleImagePublicId;
        } else {
          // Fallback: try to find matching public ID by checking the URL
          const urlFileName = url.split('/').pop().split('.')[0]; // Get filename without extension
          publicIdWithPath = publicIds.find(id => id.includes(urlFileName));
        }
        
        // Final fallback: parse from URL (but remove file extension for images)
        if (!publicIdWithPath) {
          const urlParts = url.split('/');
          const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
          
          if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
            publicIdWithPath = urlParts.slice(versionIndex + 1).join('/');
            // Remove file extension for images (but keep for documents/PDFs)
            if (url.includes('/image/upload/')) {
              publicIdWithPath = publicIdWithPath.replace(/\.[^/.]+$/, '');
            }
          }
        }
        
        if (publicIdWithPath) {
          console.log('Using public ID with path:', publicIdWithPath);
          
          // Use our secure backend endpoint instead of direct Cloudinary URL
          const secureDownloadUrl = `${apiUrl}/api/otherclinicrecord/download/${encodeURIComponent(publicIdWithPath)}?filename=${encodeURIComponent(originalName || 'medical_document')}`;
          
          console.log('Using secure download URL:', secureDownloadUrl);
        
          // Navigate to the download URL which will redirect to signed Cloudinary URL
          window.open(secureDownloadUrl, '_blank');
          
          console.log('Download initiated successfully!');
        }
        
      } else {
        // Fallback to original direct download method for non-Cloudinary URLs
        const response = await fetch(url);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        // Get the correct file extension based on blob MIME type
        let extension = '';
        const mimeType = blob.type;
        
        console.log('Blob MIME type:', mimeType, 'for URL:', url);
        
        // Map MIME types to extensions
        const mimeToExtension = {
          'application/pdf': 'pdf',
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg', 
          'image/png': 'png',
          'image/gif': 'gif',
          'image/webp': 'webp',
          'text/plain': 'txt',
          'application/msword': 'doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
        };
        
        extension = mimeToExtension[mimeType] || getFileExtension(url) || 'pdf';
        
        // Enhanced handling for Cloudinary raw uploads
        if (!extension && url.includes('raw/upload')) {
          extension = 'pdf';
        }
        
        // Try to extract original filename from Cloudinary URL if possible
        let cleanOriginalName = originalName;
        if (!originalName && url.includes('otherclinic_record_')) {
          // Extract filename pattern from URL like "otherclinic_record_1758608415710_1758608415736"
          const urlParts = url.split('/');
          const filename = urlParts[urlParts.length - 1];
          cleanOriginalName = filename.replace(/otherclinic_record_\d+_\d+/, 'medical_record');
        }
        
        const fileName = cleanOriginalName || `medical_record_${Date.now()}`;
        
        // Clean up the filename - remove any existing extensions and add the correct one
        const baseFileName = fileName.replace(/\.[^/.]+$/, '');
        const finalFileName = `${baseFileName}.${extension}`;
        
        console.log('Original name:', originalName, 'Clean name:', cleanOriginalName, 'Final name:', finalFileName, 'MIME type:', mimeType);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = finalFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up the object URL
        window.URL.revokeObjectURL(downloadUrl);
        
        // Use the showToast function passed as prop or fallback to existing toast system
        if (showToast) {
          showToast(`File downloaded successfully as ${finalFileName}!`, 'success');
        }
      }
      
    } catch (error) {
      console.error('Download error:', error);
      if (showToast) {
        showToast('Failed to download file. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get files from the record
  const files = record?.patientotherclinicrecordfiles || [];
  const fileNames = record?.patientotherclinicrecordfiles_names || [];
  const singleImage = record?.patientotherclinicrecordimage;

  // If we have multiple files, show them
  if (files.length > 0) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((fileUrl, index) => {
            const fileType = getFileType(fileUrl);
            const extension = getFileExtension(fileUrl);
            const originalName = fileNames[index] || `medical_record_${index + 1}`;
            
            return (
              <div key={index} className="relative group">
                <div className="w-full h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
                  {fileType === 'image' ? (
                    <img 
                      onClick={() => onFileClick && onFileClick(fileUrl)}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200" 
                      src={fileUrl}
                      alt={`Medical record ${index + 1}`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 cursor-pointer hover:bg-red-100 transition-colors duration-200">
                      <i className="bx bxs-file-pdf text-red-500 text-3xl mb-1"/>
                      <p className="text-xs text-gray-800 text-center px-2 font-medium break-words leading-tight" 
                         title={originalName}
                         style={{ 
                           wordBreak: 'break-word',
                           maxHeight: '2.5rem',
                           overflow: 'hidden',
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical'
                         }}>
                        {originalName || `${extension?.toUpperCase()} File`}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Download and View buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {fileType === 'image' ? (
                    <button
                      type="button"
                      onClick={() => onFileClick && onFileClick(fileUrl)}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                      title="View Image"
                    >
                      <i className="bx bx-show text-sm"/>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => window.open(fileUrl, '_blank')}
                      className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                      title="View Document"
                    >
                      <i className="bx bx-show text-sm"/>
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => downloadFile(fileUrl, originalName, index)}
                    disabled={isLoading}
                    className="w-8 h-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                    title="Download File"
                  >
                    {isLoading ? (
                      <i className="bx bx-loader-alt animate-spin text-sm"/>
                    ) : (
                      <i className="bx bx-download text-sm"/>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center text-sm text-gray-500">
          {files.length} file{files.length !== 1 ? 's' : ''} available
        </div>
      </div>
    );
  }

  // Fallback to single image if available
  if (singleImage) {
    const fileType = getFileType(singleImage);
    
    return (
      <div className="flex justify-center">
        <div className="relative group">
          <div className="w-80 h-80 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg bg-white">
            {fileType === 'image' ? (
              <img 
                onClick={() => onFileClick && onFileClick(singleImage)}
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200" 
                src={singleImage}
                alt="Medical record"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
                <i className="bx bxs-file-pdf text-red-500 text-6xl mb-2"/>
                <p className="text-gray-600 text-center">Medical Record Document</p>
              </div>
            )}
          </div>
          
          {/* Download and View buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {fileType === 'image' ? (
              <button
                type="button"
                onClick={() => onFileClick && onFileClick(singleImage)}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                title="View Image"
              >
                <i className="bx bx-show"/>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => window.open(singleImage, '_blank')}
                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
                title="View Document"
              >
                <i className="bx bx-show"/>
              </button>
            )}
            
            <button
              type="button"
              onClick={() => downloadFile(singleImage, 'medical_record')}
              disabled={isLoading}
              className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              title="Download File"
            >
              {isLoading ? (
                <i className="bx bx-loader-alt animate-spin"/>
              ) : (
                <i className="bx bx-download"/>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No files available
  return (
    <div className="flex flex-col justify-center items-center py-8">
      <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <i className="bx bx-file text-4xl mb-2"></i>
          <p className="text-sm">No files available</p>
        </div>
      </div>
    </div>
  );
};


































// TopProductsChart component using the new chart design
const TopProductsChart = ({ data, filter, year, onFilterChange, onYearChange, getAvailableYears, getResponsiveTitle, getFilterDisplayText }) => {
  // Transform the data to match the expected format
  const chartData = data?.map((item, index) => ({
    product: item.product,
    quantity: item.quantity,
    fill: `var(--chart-${(index % 5) + 1})`
  })) || [];

  const chartConfig = {
    quantity: {
      label: "Quantity",
    },
    ...chartData.reduce((config, item, index) => {
      config[item.product.toLowerCase().replace(/\s+/g, '')] = {
        label: item.product,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return config;
    }, {})
  };

  const totalQuantity = chartData.reduce((sum, item) => sum + item.quantity, 0);
  const topProduct = chartData[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#184d85]" />
                <span className="text-xl font-bold text-gray-800 font-albertsans">
                  {getResponsiveTitle('Top Products', filter, year)}
                </span>
              </div>
            </CardTitle>
            <CardDescription>
              <span className="text-sm text-gray-500 font-albertsans">
                Most ordered products for {getFilterDisplayText(filter, year).toLowerCase()}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-[140px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
              aria-label="Select date range for top products"
            >
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
            </select>
            {filter === 'lastYear' && (
              <select
                value={year}
                onChange={(e) => onYearChange(parseInt(e.target.value))}
                className="w-[100px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
                aria-label="Select year for top products"
              >
                {getAvailableYears().map(yearOption => (
                  <option key={yearOption} value={yearOption}>{yearOption}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 20,
                right: 50,
                top: 10,
                bottom: 10,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                horizontal={false}
                vertical={true}
                stroke="#555555"
                strokeDasharray="3 3"
                strokeOpacity={1}
              />
              <YAxis
                dataKey="product"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={90}
                tickFormatter={(value) => {
                  // Truncate long product names
                  if (value.length > 15) {
                    return value.substring(0, 15) + '...';
                  }
                  return value;
                }}
              />
              <XAxis 
                dataKey="quantity" 
                type="number" 
                hide 
                domain={[0, 'dataMax + 10']}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-gray-800 mb-1">
                          {data.product}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: <span className="font-medium text-gray-800">{data.quantity}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="quantity" 
                layout="vertical" 
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
              >
                <LabelList 
                  dataKey="quantity" 
                  position="right" 
                  style={{
                    fill: '#374151',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                  offset={8}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <i className="bx bx-bar-chart-alt text-4xl mb-2 opacity-50"></i>
              <p className="font-albertsans">No product data available</p>
              <p className="text-sm text-gray-400 font-albertsans mt-1">
                for {getFilterDisplayText(filter, year).toLowerCase()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className=" flex-col items-start gap-2 text-sm">
        <div className=" flex gap-2 leading-none font-medium">
          {topProduct && (
            <>
              {topProduct.product} leads with {topProduct.quantity} orders <TrendingUp className=" h-4 w-4" />
            </>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Total products ordered: {totalQuantity}
        </div>
      </CardFooter>
    </Card>
  );
};








function AdminDashboard(){

  // Use environment variable or fallback to relative URLs for production
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // Utility functions for file handling
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
      const fileUrl = `${apiUrl}${document.url}`;
      
      // For images, open in new tab or download
      const mimeType = document.type || document.mimetype;
      if (mimeType.startsWith('image/')) {
        // Open image in new tab for viewing
        window.open(fileUrl, '_blank');
      } else {
        // For other file types, open in new tab or download
        window.open(fileUrl, '_blank');
      }
    }
  };

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
  const { smartFetch, realtimeUpdates, CACHE_DURATIONS, triggerRealtimeUpdate } = smartCacheInstance;
  
  // Image optimization hook for better performance
  const {
    preloadAllImages,
    getImageProps,
    manageCacheSize,
    isImageLoaded,
    loadingProgress
  } = useImageOptimization();
  
  // Cloudinary upload hook for profile pictures
  const { uploadProfilePicture, uploadProductImages } = useCloudinaryUpload();
   



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

  // SMS Toast States
  const [smsToast, setSmsToast] = useState(false);
  const [smsToastMessage, setSmsToastMessage] = useState('');
  const [smsToastClosing, setSmsToastClosing] = useState(false);
  const [smsProgressWidth, setSmsProgressWidth] = useState('0%');
  const [smsIsClicked, setSmsIsClicked] = useState(false);
  const [smsToastType, setSmsToastType] = useState('success'); // 'success', 'error', 'warning'

  // PDF Export Toast States
  const [pdfToast, setPdfToast] = useState(false);
  const [pdfToastMessage, setPdfToastMessage] = useState('');
  const [pdfToastClosing, setPdfToastClosing] = useState(false);
  const [pdfProgressWidth, setPdfProgressWidth] = useState('0%');
  const [pdfIsClicked, setPdfIsClicked] = useState(false);

  // Add Patient Profile Toast States
  const [addPatientProfileToast, setAddPatientProfileToast] = useState(false);
  const [addPatientProfileToastMessage, setAddPatientProfileToastMessage] = useState('');
  const [addPatientProfileToastClosing, setAddPatientProfileToastClosing] = useState(false);
  const [addPatientProfileProgressWidth, setAddPatientProfileProgressWidth] = useState('0%');
  const [addPatientProfileIsClicked, setAddPatientProfileIsClicked] = useState(false);
  const [addPatientProfileToastType, setAddPatientProfileToastType] = useState('success'); // 'success', 'error', 'warning'

  // Update Patient Profile Toast States
  const [updatePatientProfileToast, setUpdatePatientProfileToast] = useState(false);
  const [updatePatientProfileToastMessage, setUpdatePatientProfileToastMessage] = useState('');
  const [updatePatientProfileToastClosing, setUpdatePatientProfileToastClosing] = useState(false);
  const [updatePatientProfileProgressWidth, setUpdatePatientProfileProgressWidth] = useState('0%');
  const [updatePatientProfileIsClicked, setUpdatePatientProfileIsClicked] = useState(false);
  const [updatePatientProfileToastType, setUpdatePatientProfileToastType] = useState('success'); // 'success', 'error', 'warning'

  // Medical Document Upload Toast States
  const [medicalDocumentToast, setMedicalDocumentToast] = useState(false);
  const [medicalDocumentToastMessage, setMedicalDocumentToastMessage] = useState('');
  const [medicalDocumentToastClosing, setMedicalDocumentToastClosing] = useState(false);
  const [medicalDocumentProgressWidth, setMedicalDocumentProgressWidth] = useState('0%');
  const [medicalDocumentIsClicked, setMedicalDocumentIsClicked] = useState(false);



  
  //Retrieveing Data from useAuth Hook - Memoized to prevent re-initialization
  const {stafflogout, fetchstaffdetails, showLogoutModal: showStaffLogoutModal, confirmLogout: confirmStaffLogout, cancelLogout: cancelStaffLogout} = useStaffAuth();
  const {ownerlogout, fetchownerdetails, showLogoutModal: showOwnerLogoutModal, confirmLogout: confirmOwnerLogout, cancelLogout: cancelOwnerLogout} = useOwnerAuth();
  const {adminlogout, fetchadmindetails, showLogoutModal, confirmLogout, cancelLogout} = useAdminAuth();

  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  // Authentication check - redirect to login if no valid tokens found
  useEffect(() => {
    const checkAuthentication = () => {
      const staffToken = localStorage.getItem('stafftoken');
      const ownerToken = localStorage.getItem('ownertoken');
      const adminToken = localStorage.getItem('admintoken');
      const generalToken = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      // Check if user has any valid authentication tokens
      const hasValidToken = staffToken || ownerToken || adminToken || generalToken;
      const hasValidRole = role && (role === 'staff' || role === 'owner' || role === 'admin');

      // If no valid token or role, redirect to login
      if (!hasValidToken || !hasValidRole) {
        console.log('No valid authentication found, redirecting to login...');
        localStorage.clear(); // Clear any invalid/partial data
        navigate('/userlogin');
        return;
      }

      // Additional check: ensure the role matches the token
      if ((role === 'staff' && !staffToken) || 
          (role === 'owner' && !ownerToken) || 
          (role === 'admin' && !adminToken)) {
        console.log('Token-role mismatch detected, redirecting to login...');
        localStorage.clear();
        navigate('/userlogin');
        return;
      }

      console.log('Authentication verified for role:', role);
      setIsAuthenticating(false); // Authentication passed, allow dashboard to render
    };

    checkAuthentication();
  }, [navigate]);

  const [ownerownedclinic,setownerownedclinic] = useState('');
  const [staffclinic, setStaffClinic] = useState('');

  // Reports and Analytics State - Optimized
  const [reportsData, setReportsData] = useState({
    appointments: [],
    ambherOrders: [],
    bautistaOrders: [],
    loading: true,
    error: null
  });
  
  const [reportsFilter, setReportsFilter] = useState({
    dateRange: 'thisMonth', // thisWeek, thisMonth, thisYear, custom
    startDate: '',
    endDate: '',
    reportType: 'overview' // overview, appointments, sales, revenue
  });

  // Separate filters for Sales by Category and Order Status Distribution charts
  const [salesCategoryFilter, setSalesCategoryFilter] = useState('thisMonth');
  const [orderStatusFilter, setOrderStatusFilter] = useState('thisMonth');
  const [topProductsFilter, setTopProductsFilter] = useState('thisMonth');
  const [salesCategoryYear, setSalesCategoryYear] = useState(new Date().getFullYear());
  const [orderStatusYear, setOrderStatusYear] = useState(new Date().getFullYear());
  const [topProductsYear, setTopProductsYear] = useState(new Date().getFullYear());

  // Recent Orders Pagination State
  const [recentOrdersCurrentPage, setRecentOrdersCurrentPage] = useState(1);
  const RECENT_ORDERS_PER_PAGE = 10;

  // Helper function to get date range based on filter
  const getDateRangeForFilter = useCallback((filterValue, selectedYear = null) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    switch (filterValue) {
      case 'thisWeek': {
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        return { start: startOfWeek, end: endOfDay };
      }
      case 'thisMonth': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: startOfMonth, end: endOfDay };
      }
      case 'thisYear': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return { start: startOfYear, end: endOfDay };
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        return { start: startOfLastMonth, end: endOfLastMonth };
      }
      case 'last3Months': {
        const start3MonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return { start: start3MonthsAgo, end: endOfDay };
      }
      case 'lastYear': {
        const year = selectedYear || now.getFullYear() - 1;
        const startOfSelectedYear = new Date(year, 0, 1);
        const endOfSelectedYear = new Date(year, 11, 31, 23, 59, 59);
        return { start: startOfSelectedYear, end: endOfSelectedYear };
      }
      default:
        return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: endOfDay };
    }
  }, []);

  // Helper function to get responsive title based on filter and year
  const getFilterDisplayText = useCallback((filterValue, selectedYear = null) => {
    const now = new Date();
    
    switch (filterValue) {
      case 'thisWeek': {
        // Get the start of the current week (Sunday)
        const startOfWeek = new Date(now);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        
        // Get the end of the current week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const monthName = startOfWeek.toLocaleDateString('en-US', { month: 'long' });
        const year = startOfWeek.getFullYear();
        
        // Check if week spans across different months
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${monthName} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${year}`;
        } else {
          const endMonthName = endOfWeek.toLocaleDateString('en-US', { month: 'long' });
          return `${monthName} ${startOfWeek.getDate()} - ${endMonthName} ${endOfWeek.getDate()}, ${year}`;
        }
      }
      case '7d': {
        // Last 7 days from today
        const endDate = new Date(now);
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 6); // 7 days including today
        
        const startMonthName = startDate.toLocaleDateString('en-US', { month: 'long' });
        const endMonthName = endDate.toLocaleDateString('en-US', { month: 'long' });
        const year = endDate.getFullYear();
        
        // Check if the 7 days span across different months
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${startMonthName} ${startDate.getDate()}-${endDate.getDate()}, ${year}`;
        } else {
          return `${startMonthName} ${startDate.getDate()} - ${endMonthName} ${endDate.getDate()}, ${year}`;
        }
      }
      case '30d': {
        // Last 30 days from today
        const endDate = new Date(now);
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 29); // 30 days including today
        
        const startMonthName = startDate.toLocaleDateString('en-US', { month: 'short' });
        const endMonthName = endDate.toLocaleDateString('en-US', { month: 'short' });
        const year = endDate.getFullYear();
        
        // Check if the 30 days span across different months
        if (startDate.getMonth() === endDate.getMonth()) {
          return `${startMonthName} ${startDate.getDate()}-${endDate.getDate()}, ${year}`;
        } else if (startDate.getFullYear() === endDate.getFullYear()) {
          return `${startMonthName} ${startDate.getDate()} - ${endMonthName} ${endDate.getDate()}, ${year}`;
        } else {
          return `${startMonthName} ${startDate.getDate()}, ${startDate.getFullYear()} - ${endMonthName} ${endDate.getDate()}, ${year}`;
        }
      }
      case '90d': {
        // Last 90 days - show as month range
        const endDate = new Date(now);
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 89); // 90 days including today
        
        const startMonthName = startDate.toLocaleDateString('en-US', { month: 'short' });
        const endMonthName = endDate.toLocaleDateString('en-US', { month: 'short' });
        const year = endDate.getFullYear();
        
        if (startDate.getFullYear() === endDate.getFullYear()) {
          return `${startMonthName}-${endMonthName} ${year}`;
        } else {
          return `${startMonthName} ${startDate.getFullYear()} - ${endMonthName} ${year}`;
        }
      }
      case '365d': {
        // Last 365 days - show as year
        const endDate = new Date(now);
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 364); // 365 days including today
        
        if (startDate.getFullYear() === endDate.getFullYear()) {
          return `${endDate.getFullYear()}`;
        } else {
          return `${startDate.getFullYear()}-${endDate.getFullYear()}`;
        }
      }
      case 'thisMonth': {
        const monthName = now.toLocaleDateString('en-US', { month: 'long' });
        const year = now.getFullYear();
        return `${monthName} ${year}`;
      }
      case 'thisYear': {
        return `${now.getFullYear()}`;
      }
      case 'lastMonth': {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthName = lastMonth.toLocaleDateString('en-US', { month: 'long' });
        const year = lastMonth.getFullYear();
        return `${monthName} ${year}`;
      }
      case 'last3Months': {
        const endMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startMonth = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        
        const startMonthName = startMonth.toLocaleDateString('en-US', { month: 'short' });
        const endMonthName = endMonth.toLocaleDateString('en-US', { month: 'short' });
        const year = endMonth.getFullYear();
        
        // Check if the 3 months span across different years
        if (startMonth.getFullYear() === endMonth.getFullYear()) {
          return `${startMonthName}-${endMonthName} ${year}`;
        } else {
          return `${startMonthName} ${startMonth.getFullYear()} - ${endMonthName} ${year}`;
        }
      }
      case 'lastYear': {
        return selectedYear ? `${selectedYear}` : `${now.getFullYear() - 1}`;
      }
      default: {
        const monthName = now.toLocaleDateString('en-US', { month: 'long' });
        const year = now.getFullYear();
        return `${monthName} ${year}`;
      }
    }
  }, []);

  // Helper function to generate responsive chart/table titles
  const getResponsiveTitle = useCallback((baseTitle, filterValue, selectedYear = null) => {
    const filterText = getFilterDisplayText(filterValue, selectedYear);
    return `${baseTitle} - ${filterText}`;
  }, [getFilterDisplayText]);

  // Function to extract available years from order data
  const getAvailableYears = useCallback(() => {
    const { ambherOrders = [], bautistaOrders = [] } = reportsData;
    const allOrders = [...(ambherOrders || []), ...(bautistaOrders || [])];
    
    const years = new Set();
    allOrders.forEach(order => {
      const orderDate = new Date(order.createdAt || order.patientorderambhercreateddate || order.patientorderbautistacreateddate);
      if (!isNaN(orderDate.getTime())) {
        years.add(orderDate.getFullYear());
      }
    });
    
    return Array.from(years).sort((a, b) => b - a); // Sort in descending order (newest first)
  }, [reportsData]);

  // Filter function for order data based on date range
  const filterOrdersByDateRange = useCallback((orders, filterValue, selectedYear = null) => {
    if (!orders || !Array.isArray(orders)) {
      return [];
    }
    const { start, end } = getDateRangeForFilter(filterValue, selectedYear);
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.patientorderambhercreateddate || order.patientorderbautistacreateddate);
      return orderDate >= start && orderDate <= end;
    });
  }, [getDateRangeForFilter]);

  // Memoize these to prevent recalculation on every render
  const currentusertoken = useMemo(() => 
    localStorage.getItem("stafftoken") ||
    localStorage.getItem("ownertoken") ||
    localStorage.getItem("admintoken"), []
  );

  const currentuserloggedin = useMemo(() => 
    localStorage.getItem("stafftoken") ? "Staff" :
    localStorage.getItem("ownertoken") ? "Owner" :
    localStorage.getItem("admintoken") ? "Admin" : null, 
  []);

  // Helper function to determine if user should see only Ambher Optical data
  const isAmbherOnlyUser = useCallback(() => {
    if (currentuserloggedin === "Staff") {
      return localStorage.getItem('staffclinic') === 'Ambher Optical' || staffclinic === 'Ambher Optical';
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic === 'Ambher Optical';
    }
    return false; // Admin can see all data
  }, [currentuserloggedin, staffclinic, ownerownedclinic]);

  // Helper function to determine if user should see only Bautista Eye Center data
  const isBautistaOnlyUser = useCallback(() => {
    if (currentuserloggedin === "Staff") {
      return localStorage.getItem('staffclinic') === 'Bautista Eye Center' || staffclinic === 'Bautista Eye Center';
    } else if (currentuserloggedin === "Owner") {
      return ownerownedclinic === 'Bautista Eye Center';
    }
    return false; // Admin can see all data
  }, [currentuserloggedin, staffclinic, ownerownedclinic]);

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

  // Helper function to get current clinic information for logged-in user
  const getCurrentClinicInfo = useCallback(() => {
    if (currentuserloggedin === "Admin") {
      return {
        clinicType: 'Admin Dashboard',
        logo: landinglogo,
        displayName: 'Admin Dashboard'
      };
    } else if (currentuserloggedin === "Staff") {
      const userClinic = localStorage.getItem('staffclinic') || staffclinic;
      if (userClinic === 'Bautista Eye Center') {
        return {
          clinicType: 'Bautista Eye Center',
          logo: bautistalogo,
          displayName: 'Bautista Eye Center'
        };
      } else {
        return {
          clinicType: 'Ambher Optical',
          logo: ambherlogo,
          displayName: 'Ambher Optical'
        };
      }
    } else if (currentuserloggedin === "Owner") {
      if (ownerownedclinic === 'Bautista Eye Center') {
        return {
          clinicType: 'Bautista Eye Center',
          logo: bautistalogo,
          displayName: 'Bautista Eye Center'
        };
      } else {
        return {
          clinicType: 'Ambher Optical',
          logo: ambherlogo,
          displayName: 'Ambher Optical'
        };
      }
    }
    return {
      clinicType: 'Unknown',
      logo: landinglogo,
      displayName: 'Unknown Clinic'
    };
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

  // Helper function to filter accounts by clinic based on user permissions
  const filterAccountsByClinic = useCallback((accounts, clinicField = 'clinic') => {
    // Admin can see all accounts
    if (currentuserloggedin === "Admin") {
      return accounts;
    }

    // Apply clinic filtering for Staff and Owner users
    if (isAmbherOnlyUser()) {
      return accounts.filter(account => account[clinicField] === "Ambher Optical");
    } else if (isBautistaOnlyUser()) {
      return accounts.filter(account => account[clinicField] === "Bautista Eye Center");
    }

    // Default to showing all accounts if no specific clinic restriction
    return accounts;
  }, [currentuserloggedin, isAmbherOnlyUser, isBautistaOnlyUser]);

  // Helper function to check if user has permission to perform operations on an appointment
  const canAccessAppointment = useCallback((appointment, clinicType = null) => {
    // Admin can access all appointments
    if (currentuserloggedin === "Admin") {
      return true;
    }

    // If clinicType is provided, check if user can access that specific clinic
    if (clinicType) {
      if (clinicType === 'ambher' && !isAmbherOnlyUser() && !isBautistaOnlyUser()) {
        return false; // If not clinic-specific user, default to false
      }
      if (clinicType === 'bautista' && !isBautistaOnlyUser() && !isAmbherOnlyUser()) {
        return false; // If not clinic-specific user, default to false
      }
      if (clinicType === 'ambher' && isBautistaOnlyUser()) {
        return false; // Bautista user cannot access Ambher appointments
      }
      if (clinicType === 'bautista' && isAmbherOnlyUser()) {
        return false; // Ambher user cannot access Bautista appointments
      }
      return true;
    }

    // If no specific clinic type, check based on appointment data
    if (!appointment) return false;

    // For Ambher Optical users
    if (isAmbherOnlyUser()) {
      // Can only access appointments that have Ambher appointment data (date indicates active appointment)
      return !!appointment.patientambherappointmentdate;
    }

    // For Bautista Eye Center users
    if (isBautistaOnlyUser()) {
      // Can only access appointments that have Bautista appointment data (date indicates active appointment)
      return !!appointment.patientbautistaappointmentdate;
    }

    // Default deny for safety
    return false;
  }, [currentuserloggedin, isAmbherOnlyUser, isBautistaOnlyUser]);


  const handlelogout = () => {
    if(currentuserloggedin === "Admin") adminlogout();
    else if(currentuserloggedin === "Staff") stafflogout();
    else if (currentuserloggedin === "Owner") ownerlogout();
  }                           
  


  
  // Track if user data has been loaded to prevent infinite re-renders
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  
  // Track if reports data has been loaded once to prevent refetching
  const [reportsDataLoadedOnce, setReportsDataLoadedOnce] = useState(false);
  
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
  }, [currentuserloggedin, userDataLoaded, fetchadmindetails, fetchownerdetails, fetchstaffdetails]); // Remove fetchReportsData from dependencies

  // Separate useEffect to handle reports data loading after user is authenticated
  useEffect(() => {
    if (userDataLoaded && !reportsDataLoadedOnce && currentuserloggedin) {
      console.log('🚀 User authenticated - reports will be loaded on first visit to reports section');
      setReportsDataLoadedOnce(true);
    }
  }, [userDataLoaded, reportsDataLoadedOnce, currentuserloggedin]);

  // PDF Toast handling - Auto-hide after showing
  useEffect(() => {
    if (pdfToast) {
      // Start progress animation
      setPdfProgressWidth('0%');
      setTimeout(() => setPdfProgressWidth('100%'), 100);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setPdfToastClosing(true);
        setTimeout(() => {
          setPdfToast(false);
          setPdfToastClosing(false);
          setPdfProgressWidth('0%');
          setPdfIsClicked(false);
        }, 3000);
      }, 4000);
    }
  }, [pdfToast]);

  // SMS Toast handling - Auto-hide after showing
  useEffect(() => {
    if (smsToast) {
      // Start progress animation
      setSmsProgressWidth('0%');
      setTimeout(() => setSmsProgressWidth('100%'), 100);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setSmsToastClosing(true);
        setTimeout(() => {
          setSmsToast(false);
          setSmsToastClosing(false);
          setSmsProgressWidth('0%');
          setSmsIsClicked(false);
        }, 3000);
      }, 4000);
    }
  }, [smsToast]);




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
const [showPatientPassword, setShowPatientPassword] = useState(false);


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
const totalPages = Math.ceil(totalPatients / accountItemsPerPage);

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
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Status</th>
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Status</th>
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Status</th>
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Status</th>
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
                src={patient.patientprofilepicture || defaultprofilepic} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = defaultprofilepic; 
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
    
    {/* Pagination Component - SMS Style */}
    {(() => {
      const shouldShowPagination = totalPatients > accountItemsPerPage;
      
      return !loadingpatients && shouldShowPagination && (
        <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 font-albertsans">
            Page {currentPage.patients} of {totalPages} ({totalPatients} total accounts)
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() => handlePageChange('patients', Math.max(1, currentPage.patients - 1))}
              disabled={currentPage.patients === 1}
              className="cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </div>
            
            {/* Page Numbers */}
            <div className="cursor-pointer flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const current = currentPage.patients;
                  return page === 1 || page === totalPages || 
                         (page >= current - 1 && page <= current + 1);
                })
                .map((page, index, array) => {
                  const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                      <div
                        onClick={() => handlePageChange('patients', page)}
                        className={`cursor-pointer px-3 py-1 rounded-md text-sm font-albertsans transition-colors ${
                          page === currentPage.patients
                            ? 'bg-[#184d85] text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>
            
            <div
              onClick={() => handlePageChange('patients', Math.min(totalPages, currentPage.patients + 1))}
              disabled={currentPage.patients === totalPages}
              className="cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </div>
          </div>
        </div>
      );
    })()}
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

  const maximagefile = 10; // Increased to 10MB for Cloudinary
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 10MB");
    return;
  }

  // Reset states
  setselectedprofile(null);
  setpreviewimage(null);

  if(imageinputref.current){
    imageinputref.current.value = "";
  }

  try {
    // Upload to Cloudinary
    const result = await uploadProfilePicture(file, formdata.patientemail || 'unknown', 'patient');
    
    if (result.success) {
      console.log('Patient profile upload successful:', result);
      setpreviewimage(result.data.imageUrl);
      setselectedprofile(file);
      
      // Update form data with Cloudinary URL
      setformdata(prev => ({
        ...prev,
        patientprofilepicture: result.data.imageUrl
      }));
    } else {
      console.error('Patient profile upload failed:', result.message);
      alert(`Upload failed: ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Patient profile upload error:", error);
    alert("Upload failed. Please try again.");
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
      patientprofilepicture: formdata.patientprofilepicture || defaultprofilepic
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
    
    // Refresh the patient list to show the new patient
    try {
      const fetchresponse = await fetch('/api/patientaccounts', {
        headers:{
          'Authorization':`Bearer ${currentusertoken}`
        }
      });
      
      if(fetchresponse.ok) {
        const patientaccounts = await fetchresponse.json();
        setpatients(patientaccounts);
      }
    } catch(fetchError) {
      console.error("Failed to refresh patient list:", fetchError);
    }

    // Close the modal after successful creation
    setshowaddpatientdialog(false);
      
  
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
            'Authorization':`Bearer ${currentusertoken}`
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
        patientprofilepicture: formdata.patientprofilepicture || defaultprofilepic
      };

      const response = await fetch(`/api/patientaccounts/${selectededitpatientaccount.id}`,{
        method:'PUT',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${currentusertoken}`
        },
        body: JSON.stringify(updatepatientaccountdetails)
      });


      if(!response.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update patient account");
      }

      const fetchresponse = await fetch('/api/patientaccounts',{
        headers: {
          'Authorization' : `Bearer ${currentusertoken}` 
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
const [showStaffPassword, setShowStaffPassword] = useState(false);


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
    staffprofilepicture:'', // Holds the profile picture 
    staffprofilepicture_public_id: '' // Cloudinary public_id
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
      setloadingstaffs(true); // Reset loading state
      try{

        const fetchresponse = await fetch('/api/staffaccounts', {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if(!fetchresponse.ok){
          throw new Error("Failed to fetch staff accounts");
        }

        let staffdata = await fetchresponse.json();
        
        // Apply clinic filtering (except for Admin)
        if (currentuserloggedin !== "Admin") {
          if (isAmbherOnlyUser()) {
            staffdata = staffdata.filter(staff => staff.staffclinic === "Ambher Optical");
          } else if (isBautistaOnlyUser()) {
            staffdata = staffdata.filter(staff => staff.staffclinic === "Bautista Eye Center");
          }
        }
        
        setstaffs(staffdata);
        setfailedloadingstaffs(null); // Clear any previous errors
      
      }catch(error){
        setfailedloadingstaffs(error.message);
      }finally{
        setloadingstaffs(false);
      }
    };
    
    // Fetch staff accounts for all authenticated users - filtering will be applied after data is retrieved
    if(currentusertoken && currentuserloggedin && userDataLoaded) {
      fetchstaffs();
    }
  }, [currentusertoken, currentuserloggedin, userDataLoaded, isAmbherOnlyUser, isBautistaOnlyUser]);//staff Filter
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
      `}
    </style>
    <div className="overflow-x-auto w-full h-full">
      <table className="w-full rounded-tl-2xl rounded-tr-2xl shadow-lg">
        <thead className="rounded-tl-2xl rounded-tr-2xl">
          <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tl-2xl">Id</th>
            <th className="pb-3 pt-3 pl-5 pr-5 text-center">Profile</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Lastname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Firstname</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Middlename</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Email</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Clinic</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Eye Specialist</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>
            <th className={`pb-3 pt-3 pl-2 pr-2 text-center ${currentuserloggedin !== "Staff" ? '' : 'rounded-tr-2xl'}`}>Actions</th>
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
              <td colSpan="10" className="p-4 bg-red-50 text-red-600 text-center">
                Error: {failedloadingstaffs}
              </td>
            </tr>
          )}

          {(!loadingstaffs && !failedloadingstaffs && searchstaffs && filteredstaffs.length === 0) && (
            <tr>
              <td colSpan="10" className="rounded-2xl py-6 px-4 bg-yellow-50 text-yellow-600 text-center">
                No staffs found.
              </td>
            </tr>
          )}

          {(!loadingstaffs && !failedloadingstaffs && staffstorender.length > 0) && paginatedStaffs.map((staff) => (
          <tr key={staff._id} className="hover:bg-gray-100 transition-all duration-300 ease-in-out hover:cursor-pointer">
            <td className="py-3 px-6 text-[#3a3a3a] font-albertsans font-medium">#{staff.staffId}</td>
            <td className="py-3 px-6 text-center">
              <div className="flex justify-center">
                <img 
                  src={staff.staffprofilepicture || defaultprofilepic} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultprofilepic; // Fallback image
                  }}
                />
              </div>
            </td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.stafflastname}</td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium max-w-[150px]">{staff.stafffirstname}</td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.staffmiddlename}</td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <a href={`mailto:${staff.staffemail}`} className="text-blue-400 hover:underline">
                {staff.staffemail}
              </a>
            </td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">{staff.staffclinic}</td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.staffiseyespecialist}</td>
            <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
              {new Date(staff.createdAt).toLocaleDateString('en-US',{
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </td>
            {(currentuserloggedin !== "Staff" || (currentuserloggedin === "Staff" && staff.staffemail === JSON.parse(localStorage.getItem("currentuser"))?.email)) && (
              <td className="py-3 px-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div 
                    onClick={() => {
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
                        staffprofilepicture: staff.staffprofilepicture,
                        staffprofilepicture_public_id: staff.staffprofilepicture_public_id
                      });

                      setstaffpreviewimage(staff.staffprofilepicture);
                      setstaffselectedprofile(null); // Reset selected profile when editing
                      setshowviewstaffdialog(true);
                    }}
                    className="bg-[#383838] hover:bg-[#595959] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"
                  >
                    <i className="bx bxs-pencil text-white mr-1"/>
                    <h1 className="text-white">Edit</h1>
                  </div>
                  
                  {currentuserloggedin !== "Staff" && (
                    <div 
                      onClick={() => {
                        setselectedstaffaccount({
                          id: staff.staffId,
                          email: staff.staffemail,
                          name: `${staff.stafffirstname} ${staff.stafflastname}`
                        });
                        setshowdeletestaffdialog(true);
                      }}
                      className="bg-[#8c3226] hover:bg-[#ab4f43] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"
                    >
                      <i className="bx bxs-trash text-white mr-1"/>
                      <h1 className="text-white">Delete</h1>
                    </div>
                  )}
                </div>
              </td>
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

  const maximagefile = 10; // Increased to 10MB for Cloudinary
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 10MB");
    return;
  }

  // Show preview immediately using URL.createObjectURL for better performance
  const previewUrl = URL.createObjectURL(file);
  setstaffpreviewimage(previewUrl);
  setstaffselectedprofile(file); // Store the actual file for Cloudinary upload
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

    let profilePictureUrl = staffformdata.staffprofilepicture || defaultprofilepic;
    let profilePicturePublicId = '';

    // If there's a profile picture file to upload
    if (staffselectedprofile) {
      setstaffmessage({text: 'Uploading profile picture...', type: 'info'});
      
      console.log('About to upload profile picture:', {
        file: staffselectedprofile,
        userId: staffformdata.staffemail,
        userType: 'staff'
      });
      
      try {
        const uploadResult = await uploadProfilePicture(
          staffselectedprofile, 
          staffformdata.staffemail, 
          'staff'
        );
        
        if (uploadResult.success) {
          profilePictureUrl = uploadResult.imageUrl;
          profilePicturePublicId = uploadResult.public_id;
          setstaffmessage({text: 'Profile picture uploaded successfully!', type: 'success'});
        } else {
          throw new Error(uploadResult.message || 'Failed to upload profile picture');
        }
      } catch (uploadError) {
        console.error('Profile picture upload error:', uploadError);
        setstaffmessage({text: `Upload failed: ${uploadError.message}`, type: 'error'});
        setstaffissubmitting(false);
        return;
      }
    }
    
    const staffaccsubmission = {
      ...staffformdata,
      staffclinic: ownerownedclinic,
      staffiseyespecialist: staffformdata.staffiseyespecialist,
      staffprofilepicture: profilePictureUrl,
      staffprofilepicture_public_id: profilePicturePublicId
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
    
    // Refresh the staff list to show the new staff member
    try {
      const fetchresponse = await fetch('/api/staffaccounts', {
        headers:{
          'Authorization':`Bearer ${currentusertoken}`
        }
      });
      
      if(fetchresponse.ok) {
        let staffaccounts = await fetchresponse.json();
        // Apply clinic filtering
        staffaccounts = filterAccountsByClinic(staffaccounts, 'staffclinic');
        setstaffs(staffaccounts);
      }
    } catch(fetchError) {
      console.error("Failed to refresh staff list:", fetchError);
    }

    // Close the modal after successful creation
    setshowaddstaffdialog(false);
      
       
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
        staffprofilepicture: '',
        staffprofilepicture_public_id: ''
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
            'Authorization':`Bearer ${currentusertoken}`
          }
      });
      
      if(!fetchresponse.ok) {
        throw new Error("Failed to retrieve updated staffaccounts table");
      }

      let staffaccounts = await fetchresponse.json();
      // Apply clinic filtering
      staffaccounts = filterAccountsByClinic(staffaccounts, 'staffclinic');
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

      let profilePictureUrl = staffformdata.staffprofilepicture;
      let profilePicturePublicId = staffformdata.staffprofilepicture_public_id;

      // If there's a new image file to upload
      if (staffselectedprofile) {
        setstaffmessage({text: 'Uploading profile picture...', type: 'info'});
        
        console.log('About to upload profile picture:', {
          file: staffselectedprofile,
          userId: staffformdata.staffemail,
          userType: 'staff',
          selectedStaff: selectededitstaffaccount?.staffemail
        });
        
        try {
          const uploadResult = await uploadProfilePicture(
            staffselectedprofile, 
            staffformdata.staffemail, 
            'staff'
          );
          
          if (uploadResult.success) {
            profilePictureUrl = uploadResult.imageUrl;
            profilePicturePublicId = uploadResult.public_id;
            setstaffmessage({text: 'Profile picture uploaded successfully!', type: 'success'});
          } else {
            throw new Error(uploadResult.message || 'Failed to upload profile picture');
          }
        } catch (uploadError) {
          console.error('Profile picture upload error:', uploadError);
          setstaffmessage({text: `Upload failed: ${uploadError.message}`, type: 'error'});
          setstaffissubmitting(false);
          return;
        }
      }

      const updatestaffaccountdetails = {
        ...staffformdata,
        staffiseyespecialist:staffformdata.staffiseyespecialist,
        staffprofilepicture: profilePictureUrl,
        staffprofilepicture_public_id: profilePicturePublicId
      };

      const response = await fetch(`/api/staffaccounts/${selectededitstaffaccount.id}`,{
        method:'PUT',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${currentusertoken}`
        },
        body: JSON.stringify(updatestaffaccountdetails)
      });


      if(!response.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update staff account");
      }

      const fetchresponse = await fetch('/api/staffaccounts',{
        headers: {
          'Authorization' : `Bearer ${currentusertoken}` 
        }
      });

      if(!fetchresponse.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update staff account table");
      }

      //Success account update
      let staffdata = await fetchresponse.json();
      // Apply clinic filtering
      staffdata = filterAccountsByClinic(staffdata, 'staffclinic');
      setstaffs(staffdata);
      setstaffmessage({text:"Staff Account Updated Successfully!", type:"success"});

      setTimeout(() => {
        setstaffissubmitting(false);
        setselectededitstaffaccount(null);
        setshowviewstaffdialog(false);
        setstaffmessage({text:"", type:""});
        setstaffformdata({
          role: 'staff',
          staffemail: '',
          stafflastname: '',
          stafffirstname: '',
          staffmiddlename: '',
          staffiseyespecialist:'',
          staffprofilepicture: '',
          staffprofilepicture_public_id: ''
        });
        setstaffpreviewimage(null);
        setstaffselectedprofile(null);
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
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);


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
      setloadingowners(true); // Reset loading state
      try{

        const fetchresponse = await fetch('/api/owneraccounts', {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if(!fetchresponse.ok){
          throw new Error("Failed to fetch owner accounts");
        }

        let ownerdata = await fetchresponse.json();
        
        // Apply clinic filtering (except for Admin)
        if (currentuserloggedin !== "Admin") {
          if (isAmbherOnlyUser()) {
            ownerdata = ownerdata.filter(owner => owner.ownerclinic === "Ambher Optical");
          } else if (isBautistaOnlyUser()) {
            ownerdata = ownerdata.filter(owner => owner.ownerclinic === "Bautista Eye Center");
          }
        }
        
        setowners(ownerdata);
        setfailedloadingowners(null); // Clear any previous errors
      
      }catch(error){
        setfailedloadingowners(error.message);
      }finally{
        setloadingowners(false);
      }
    };
    
    // Fetch owner accounts for all authenticated users - filtering will be applied after data is retrieved
    if(currentusertoken && currentuserloggedin && userDataLoaded) {
      fetchowners();
    }
  }, [currentusertoken, currentuserloggedin, userDataLoaded, isAmbherOnlyUser, isBautistaOnlyUser]);

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
                  src={owner.ownerprofilepicture || defaultprofilepic} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultprofilepic; // Fallback image
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

    const maximagefile = 10; // Increased to 10MB for Cloudinary
    if(file.size > maximagefile * 1024 * 1024){
      alert("Image is too large. Please select image under 10MB");
      return;
    }

    // Reset states
    setownerselectedprofile(null);
    setownerpreviewimage(null);

    if(ownerimageinputref.current){
      ownerimageinputref.current.value = "";
    }

    try {
      // Upload to Cloudinary
      const result = await uploadProfilePicture(file, ownerformdata.owneremail || 'unknown', 'owner');
      
      if (result && result.imageUrl) {
        console.log('Owner profile upload successful:', result);
        setownerpreviewimage(result.imageUrl);
        setownerselectedprofile(file);
        
        // Update form data with Cloudinary URL
        setownerformdata(prev => ({
          ...prev,
          ownerprofilepicture: result.imageUrl
        }));
      } else {
        console.error('Owner profile upload failed: No image URL returned', result);
        alert('Upload failed: No image URL returned from server');
      }
    } catch (error) {
      console.error("Owner profile upload error:", error);
      alert(`Upload failed: ${error.message || 'Unknown error occurred'}`);
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
        ownerprofilepicture: ownerformdata.ownerprofilepicture || defaultprofilepic // Use Cloudinary URL
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

      await axios.post(`/api/accountcreation/owner`, {
        email: ownerformdata.owneremail, 
        password: ownerformdata.ownerpassword});

      //If response is success, it will send data to the api and to the database   
      setownermessage({text:"Registration Sucessful!",type:"success"});
      
      // Refresh the owner list to show the new owner
      try {
        const fetchresponse = await fetch('/api/owneraccounts', {
          headers:{
            'Authorization':`Bearer ${currentusertoken}`
          }
        });
        
        if(fetchresponse.ok) {
          let owneraccounts = await fetchresponse.json();
          // Apply clinic filtering
          owneraccounts = filterAccountsByClinic(owneraccounts, 'ownerclinic');
          setowners(owneraccounts);
        }
      } catch(fetchError) {
        console.error("Failed to refresh owner list:", fetchError);
      }

      // Close the modal after successful creation
      setshowaddownerdialog(false);
        
         
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

        let owneraccounts = await fetchresponse.json();
        // Apply clinic filtering
        owneraccounts = filterAccountsByClinic(owneraccounts, 'ownerclinic');
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
          ownerprofilepicture: ownerformdata.ownerprofilepicture || defaultprofilepic // Use Cloudinary URL
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
        let ownerdata = await fetchresponse.json();
        // Apply clinic filtering
        ownerdata = filterAccountsByClinic(ownerdata, 'ownerclinic');
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
const [showAdminPassword, setShowAdminPassword] = useState(false);


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
              src={admin.adminprofilepicture || defaultprofilepic} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = defaultprofilepic; // Fallback image
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

const maximagefile = 10; // Increased to 10MB for Cloudinary
if(file.size > maximagefile * 1024 * 1024){
  alert("Image is too large. Please select image under 10MB");
  return;
}

// Show preview immediately using URL.createObjectURL for better performance
const previewUrl = URL.createObjectURL(file);
setadminpreviewimage(previewUrl);
setadminselectedprofile(file); // Store the actual file for Cloudinary upload

};

//Handles the click event of upload button
const adminhandleuploadclick = () => {
adminimageinputref.current.click();
};

const adminhandleremoveprofile = () => {
setadminselectedprofile(null);
setadminpreviewimage(null);
// Clear the profile picture from form data
setadminformdata(prev => ({
  ...prev,
  adminprofilepicture: ''
}));
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

  let profilePictureUrl = defaultprofilepic;

  // If there's a profile picture file selected, upload it to Cloudinary first
  if (adminselectedprofile) {
    setadminmessage({text: 'Uploading profile picture...', type: 'info'});
    
    try {
      const uploadResult = await uploadProfilePicture(
        adminselectedprofile, 
        adminformdata.adminemail, 
        'admin' // Use 'admin' type for admin accounts
      );
      
      if (uploadResult.success) {
        profilePictureUrl = uploadResult.data.imageUrl;
        setadminmessage({text: 'Profile picture uploaded successfully!', type: 'success'});
      } else {
        throw new Error(uploadResult.message || 'Failed to upload profile picture');
      }
    } catch (uploadError) {
      console.error('Profile picture upload error:', uploadError);
      setadminmessage({text: `Upload failed: ${uploadError.message}`, type: 'error'});
      setadminissubmitting(false);
      return;
    }
  }

  const adminaccsubmission = {
    ...adminformdata,
    adminprofilepicture: profilePictureUrl // Use uploaded Cloudinary URL or default
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

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Server error: ${response.status}`);
  }

  
  await axios.post(`/api/accountcreation/admin`, {
    email: adminformdata.adminemail, 
    password: adminformdata.adminpassword});

  //If response is success, it will send data to the api and to the database   
  await response.json();
  setadminmessage({text:"Registration Sucessful!",type:"success"});
  
  // Refresh the admin list to show the new admin
  try {
    const fetchresponse = await fetch('/api/adminaccounts', {
      headers:{
        'Authorization':`Bearer ${currentusertoken}`
      }
    });
    
    if(fetchresponse.ok) {
      const adminaccounts = await fetchresponse.json();
      setadmins(adminaccounts);
    }
  } catch(fetchError) {
    console.error("Failed to refresh admin list:", fetchError);
  }

  // Close the modal after successful creation
  setshowaddadmindialog(false);
  
    
     
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
    console.error("Error:", error);
    
    // Extract specific error message for better user feedback
    let errorMessage = "Registration Failed. Try again";
    
    if (error.message) {
      // Check for password validation error
      if (error.message.includes("adminpassword") && error.message.includes("shorter than the minimum allowed length")) {
        errorMessage = "Password must be at least 6 characters long.";
      } 
      // Check for email validation errors
      else if (error.message.includes("adminemail") && error.message.includes("is not a valid email")) {
        errorMessage = "Please enter a valid email address.";
      }
      // Check for duplicate email error
      else if (error.message.includes("duplicate key error") || error.message.includes("E11000")) {
        errorMessage = "This email address is already registered.";
      }
      // Check for required field errors
      else if (error.message.includes("Path") && error.message.includes("is required")) {
        const fieldMatch = error.message.match(/Path `(\w+)` is required/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1].replace('admin', '').replace(/([A-Z])/g, ' $1').toLowerCase().trim();
          errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
        }
      }
      // For other specific errors, show the error message if it's user-friendly
      else if (!error.message.includes("Error:") && error.message.length < 100) {
        errorMessage = error.message;
      }
    }
    
    setadminmessage({text: errorMessage, type: "error"});
         
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

    let profilePictureUrl = adminformdata.adminprofilepicture || defaultprofilepic;

    // If a new profile picture was selected, upload it to Cloudinary first
    if (adminselectedprofile) {
      setadminmessage({text: 'Uploading profile picture...', type: 'info'});
      
      try {
        const uploadResult = await uploadProfilePicture(
          adminselectedprofile, 
          adminformdata.adminemail, 
          'admin' // Use 'admin' type for admin accounts
        );
        
        if (uploadResult.success) {
          profilePictureUrl = uploadResult.data.imageUrl;
          setadminmessage({text: 'Profile picture uploaded successfully!', type: 'success'});
        } else {
          throw new Error(uploadResult.error || 'Failed to upload profile picture');
        }
      } catch (uploadError) {
        setadminmessage({text: `Upload failed: ${uploadError.message}`, type: 'error'});
        setadminissubmitting(false);
        return;
      }
    }

    const updateadminaccountdetails = {
      ...adminformdata,
      adminprofilepicture: profilePictureUrl
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
      // Reset profile picture states
      setadminselectedprofile(null);
      setadminpreviewimage(null);
      // Reset form data
      setadminformdata({
        role: 'Admin',
        adminemail: '',
        adminpassword: '',
        adminlastname: '',
        adminfirstname: '',
        adminmiddlename: '',
        adminprofilepicture: ''
      });
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
const [addpatientprofileselectedfile, setaddpatientprofileselectedfile] = useState(null);
const [addpatientprofileisuploadingimage, setaddpatientprofileisuploadingimage] = useState(false);
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
const [isDecliningAppointment, setIsDecliningAppointment] = useState(false);
const [isCancellingAppointment, setIsCancellingAppointment] = useState(false);
const [bautistaeyespecialist, setbautistaeyespecialist] = useState('');
const [ambhereyespecialist, setambhereyespecialist] = useState('');
const [ambherappointmentpaymentotal, setambherappointmentpaymentotal] = useState('');
const [bautistaappointmentpaymentotal, setbautistaappointmentpaymentotal] = useState('');
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
// Ensure patientdemographics is an array before filtering
const safePatientDemographics = Array.isArray(patientdemographics) ? patientdemographics : [];

if (!term) {
  setFilteredPatientProfiles(safePatientDemographics);
} else {
  const filtered = safePatientDemographics.filter(profile => 
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
      const response = await fetch('/api/patientdemographics?limit=50&page=1', {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
        }
      });

      if (!response.ok) throw new Error("Failed to retrieve patient demographics");
      const result = await response.json();
      // Extract data array from the new response structure
      const extractedData = result.data || result;
      return extractedData; // Fallback to result if data property doesn't exist
    },
    CACHE_DURATIONS.MEDIUM, // 5 minutes cache
    forceRefresh
  );

  // Ensure demographics is always an array before setting state
  const safedemographics = Array.isArray(demographics) ? demographics : [];
  setpatientdemographics(safedemographics);
} catch (error) {
  setpatientdemoerror(error.message);
} finally {
  setloadingpatientdemographics(false);
}
}, [smartFetch, CACHE_DURATIONS, currentusertoken]);

useEffect(() => {
if(activeprofiletable === "patientprofiletable") {
  // Force refresh to clear any cached data with old format
  fetchDemographicsData(true); // Force refresh on component mount
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
// Ensure both search and data are properly handled
const safePatientDemographics = Array.isArray(patientdemographics) ? patientdemographics : [];

if (searchPatientProfiles) {
  filterPatientProfiles(searchPatientProfiles);
} else {
  setFilteredPatientProfiles(safePatientDemographics);
}
}, [searchPatientProfiles, filterPatientProfiles, patientdemographics]);

// Initialize filtered data when demographics load
useEffect(() => {
const safePatientDemographics = Array.isArray(patientdemographics) ? patientdemographics : [];
setFilteredPatientProfiles(safePatientDemographics);
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

// Ensure displayData is always an array to prevent map errors
const safeDisplayData = Array.isArray(displayData) ? displayData : [];

if(safeDisplayData.length === 0){
  const message = searchPatientProfiles.trim() 
    ? `No patient profiles found matching "${searchPatientProfiles}".`
    : "No patient profiles found.";
  return(
    <div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">{message}</div>
  );
}




return (
  <div className="overflow-y-auto w-full h-full flex flex-wrap content-start gap-3 pl-2 pt-2">
  
  {safeDisplayData.map((patient) => (
    <div id="patientcard" key={patient._id} onClick={() => {
    setshowpatientpofile(true);
    setselectedpatientdemo(patient);
    setdemoformdata({
      patientemail: patient.patientemail,
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
  
  className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer w-79 min-h-[180px]">
    {/* Profile Section */}
    <div className="flex items-center gap-4 mb-4">
      <div className="relative">
        <img 
          id="patientprofileinformationpicture"
          src={patient.patientprofilepicture || defaultprofilepic} 
          alt="Profile" 
          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-albertsans font-semibold text-lg text-gray-900 truncate">
          {patient.patientfirstname} {patient.patientlastname}
        </h3>
        <p className="text-sm text-gray-500 truncate">{patient.patientemail}</p>
      </div>
    </div>

    {/* Patient Details */}
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <i className="bx bx-cake text-gray-400 text-sm"></i>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Age</span>
        </div>
        <span className="text-sm text-gray-700 font-medium">{patient.patientage}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <i className={`bx ${patient.patientgender?.toLowerCase() === 'male' ? 'bx-male' : patient.patientgender?.toLowerCase() === 'female' ? 'bx-female' : 'bx-user'} text-gray-400 text-sm`}></i>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Gender</span>
        </div>
        <span className="text-sm text-gray-700 font-medium">{patient.patientgender}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <i className="bx bx-phone text-gray-400 text-sm"></i>
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</span>
        </div>
        <span className="text-sm text-gray-700 font-medium">{patient.patientcontactnumber}</span>
      </div>
    </div>

    {/* Address */}
    <div className="mt-4 pt-3 border-t border-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <i className="bx bx-map text-gray-400 text-sm"></i>
        <p className="text-xs text-gray-400 uppercase tracking-wider">Address</p>
      </div>
      <p className="text-sm text-gray-600 truncate ml-6">{patient.patienthomeaddress}</p>
    </div>

    {/* Hover Effect Indicator */}
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
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
      ...demoformdata
    };

    const response = await fetch(`/api/patientdemographics?limit=100&page=1`, {
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

    // Use the smart fetch system to refresh demographics data
    await fetchDemographicsData(true); // Force refresh to get updated data

    resetpatientprofileformdata();
    setaddpatientprofilemessage({
      text: "Patient Profile successfully created",
      type: "success"
    });

    // Show success toast
    setAddPatientProfileToastMessage("Patient Profile successfully created");
    setAddPatientProfileToastType("success");
    setAddPatientProfileToast(true);
    setAddPatientProfileProgressWidth('0%');
    setAddPatientProfileIsClicked(false);

    // Auto-close modal after short delay
    setTimeout(() => {
      setshowaddpatientprofile(false);
    }, 1500);

  }catch (error) {
    console.error("Error creating patient profile: ", error);
    setaddpatientprofilemessage({
      text: error.message || "Failed to create patient profile",
      type: "error"
    });

    // Show error toast
    setAddPatientProfileToastMessage(error.message || "Failed to create patient profile");
    setAddPatientProfileToastType("error");
    setAddPatientProfileToast(true);
    setAddPatientProfileProgressWidth('0%');
    setAddPatientProfileIsClicked(false);

  }finally{
    setaddpatientprofileissubmitting(false);
  }
}



//DISPLAY AND UPDATE PATIENT PROFILE
const retrieveandupdatepatientprofile = async (e) => {
  e.preventDefault();
  setissubmitting(true);

  try{
    const response = await fetch(`/api/patientdemographics/${selectedpatientdemo._id}`,{
      method: 'PUT',
      headers:{
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(demoformdata)
    });

    if(!response.ok) {
      const errordata = await response.json();
      throw new Error(errordata.message || "Failed to update patient demographics");
    }

    // Use the smart fetch system to refresh demographics data
    await fetchDemographicsData(true); // Force refresh to get updated data
    
    // Show success toast
    setUpdatePatientProfileToastMessage("Patient profile updated successfully");
    setUpdatePatientProfileToastType("success");
    setUpdatePatientProfileToast(true);
    setUpdatePatientProfileProgressWidth('0%');
    setUpdatePatientProfileIsClicked(true);

    // Close modal after short delay
    setTimeout(() => {
      setshowpatientpofile(false);
    }, 1500);

  }catch(error){
    console.error("Error updating patient demographic: ", error);
    
    // Show error toast
    setUpdatePatientProfileToastMessage(error.message || "Failed to update patient profile");
    setUpdatePatientProfileToastType("error");
    setUpdatePatientProfileToast(true);
    setUpdatePatientProfileProgressWidth('0%');
    setUpdatePatientProfileIsClicked(false);
  }finally{
    setissubmitting(false);
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

      // Force refresh the demographics data to update the UI
      await fetchDemographicsData(true);

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

const maximagefile = 10; // Increased to 10MB to match other handlers
if(file.size > maximagefile * 1024 * 1024){
  alert("Image is too large. Please select image under 10MB");
  return;
}

// Set loading state
setaddpatientprofileisuploadingimage(true);

// Reset states
setselectedpatientprofile(null);
setaddpatientprofilepreviewimage(null);

if(addpatientprofileimageinputref.current){
  addpatientprofileimageinputref.current.value = "";
}

try {
  // Upload to Cloudinary
  const result = await uploadProfilePicture(file, demoformdata.patientemail || 'unknown', 'patient');
  
  if (result.success) {
    console.log('Patient profile upload successful:', result);
    setaddpatientprofilepreviewimage(result.data.imageUrl);
    setselectedpatientprofile(file);
    
    // Update form data with Cloudinary URL
    setdemoformdata(prev => ({
      ...prev,
      patientprofilepicture: result.data.imageUrl
    }));
  } else {
    console.error('Patient profile upload failed:', result.message);
    alert(`Upload failed: ${result.message || 'Unknown error'}`);
  }
} catch (error) {
  console.error("Image upload failed: ", error.message);
  alert("Image upload failed. Try again");
  return;
} finally {
  // Always clear loading state
  setaddpatientprofileisuploadingimage(false);
}
  

};

//Handles the click event of upload button
const addpatientprofilehandleuploadclick = () => {
addpatientprofileimageinputref.current.click();
};

const addpatientprofilehandleremoveprofile = () => {
setselectedpatientprofile(null);
setaddpatientprofilepreviewimage(null);
// Clear the profile picture from form data
setdemoformdata(prev => ({
  ...prev,
  patientprofilepicture: ''
}));
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

// Check clinic-specific access permissions
if (!canAccessAppointment(selectedpatientappointment)) {
  console.error("Access denied: You can only delete appointments from your clinic");
  alert("Access denied: You can only delete appointments from your clinic");
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







const handleviewappointment = async (appointment) => {
try {
  // Fetch complete appointment data including additional notes and supporting documents
  const response = await fetch(`/api/patientappointments/appointments/${appointment.patientappointmentid}`, {
    headers: {
      Authorization: `Bearer ${currentusertoken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch complete appointment data');
  }

  const completeAppointment = await response.json();
  setselectedpatientappointment(completeAppointment);

  // Populate form fields with existing appointment data
  if (completeAppointment) {
    // Ambher Optical data
    if (completeAppointment.patientambherappointmentdate) {
      // Only populate eye specialist if appointment is not pending
      if (completeAppointment.patientambherappointmentstatus !== 'Pending') {
        setambhereyespecialist(completeAppointment.patientambherappointmenteyespecialist || '');
      } else {
        setambhereyespecialist(''); // Clear eye specialist for pending appointments
      }
      setambherappointmentpaymentotal(completeAppointment.patientambherappointmentpaymentotal?.toString() || '');
      setambherappointmentconsultationremarkssubject(completeAppointment.patientambherappointmentconsultationremarkssubject || '');
      setambherappointmentconsultationremarks(completeAppointment.patientambherappointmentconsultationremarks || '');
      setambherappointmentprescription(completeAppointment.patientambherappointmentprescription || '');
    }
    
    // Bautista Eye Center data
    if (completeAppointment.patientbautistaappointmentdate) {
      // Only populate eye specialist if appointment is not pending
      if (completeAppointment.patientbautistaappointmentstatus !== 'Pending') {
        setbautistaeyespecialist(completeAppointment.patientbautistaappointmenteyespecialist || '');
      } else {
        setbautistaeyespecialist(''); // Clear eye specialist for pending appointments
      }
      setbautistaappointmentpaymentotal(completeAppointment.patientbautistaappointmentpaymentotal?.toString() || '');
      setbautistaappointmentconsultationremarkssubject(completeAppointment.patientbautistaappointmentconsultationremarkssubject || '');
      setbautistaappointmentconsultationremarks(completeAppointment.patientbautistaappointmentconsultationremarks || '');
      setbautistaappointmentprescription(completeAppointment.patientbautistaappointmentprescription || '');
    }
  }
} catch (error) {
  console.error('Error fetching complete appointment data:', error);
  // Fallback to the basic appointment data
  setselectedpatientappointment(appointment);
  
  // Populate form fields with basic appointment data
  if (appointment) {
    // Ambher Optical data
    if (appointment.patientambherappointmentdate) {
      // Only populate eye specialist if appointment is not pending
      if (appointment.patientambherappointmentstatus !== 'Pending') {
        setambhereyespecialist(appointment.patientambherappointmenteyespecialist || '');
      } else {
        setambhereyespecialist(''); // Clear eye specialist for pending appointments
      }
      setambherappointmentpaymentotal(appointment.patientambherappointmentpaymentotal?.toString() || '');
      setambherappointmentconsultationremarkssubject(appointment.patientambherappointmentconsultationremarkssubject || '');
      setambherappointmentconsultationremarks(appointment.patientambherappointmentconsultationremarks || '');
      setambherappointmentprescription(appointment.patientambherappointmentprescription || '');
    }
    
    // Bautista Eye Center data
    if (appointment.patientbautistaappointmentdate) {
      // Only populate eye specialist if appointment is not pending
      if (appointment.patientbautistaappointmentstatus !== 'Pending') {
        setbautistaeyespecialist(appointment.patientbautistaappointmenteyespecialist || '');
      } else {
        setbautistaeyespecialist(''); // Clear eye specialist for pending appointments
      }
      setbautistaappointmentpaymentotal(appointment.patientbautistaappointmentpaymentotal?.toString() || '');
      setbautistaappointmentconsultationremarkssubject(appointment.patientbautistaappointmentconsultationremarkssubject || '');
      setbautistaappointmentconsultationremarks(appointment.patientbautistaappointmentconsultationremarks || '');
      setbautistaappointmentprescription(appointment.patientbautistaappointmentprescription || '');
    }
  }
}
};




// Function to save service updates
const handleServiceUpdate = async (appointmentId, serviceUpdates) => {
  try {
    const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(serviceUpdates)
    });

    if (!response.ok) {
      console.error("Failed to update services");
      return false;
    }

    const updatedAppointment = await response.json();
    setselectedpatientappointment(updatedAppointment);
    
    // Update the appointments list
    setpatientappointments(prevAppointments => 
      prevAppointments.map(appt => 
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
    
    return true;
  } catch (error) {
    console.error("Error updating services:", error);
    return false;
  }
};

//UPDATING APPOINTMENT STATUS
const handleacceptappointment = async (appointmentId, clinicType) => {
// Check if user has permission to accept appointments
if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
  console.error("Only Staff and Owner can accept appointments");
  return;
}

// Check clinic-specific access permissions
if (!canAccessAppointment(selectedpatientappointment, clinicType)) {
  console.error(`Access denied: You can only accept appointments from your clinic (${clinicType})`);
  alert(`Access denied: You can only accept appointments from your clinic`);
  return;
}

// Validate appointmentId
if (!appointmentId) {
  console.error("Appointment ID is missing");
  return;
}

// Check if appointment status is Pending and validate eye specialist selection
const currentStatus = clinicType === 'ambher' 
  ? selectedpatientappointment?.patientambherappointmentstatus 
  : selectedpatientappointment?.patientbautistaappointmentstatus;

if (currentStatus === 'Pending') {
  const selectedEyeSpecialist = clinicType === 'ambher' ? ambhereyespecialist : bautistaeyespecialist;
  
  if (!selectedEyeSpecialist || selectedEyeSpecialist.trim() === '') {
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    alert(`Please select an Eye Specialist before accepting this ${clinicDisplayName} appointment.`);
    console.error(`Eye specialist must be selected to accept pending ${clinicType} appointment`);
    return;
  }
}

// Set loading state to true
setIsAcceptingAppointment(true);

try{
  const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`,{
    method: "PUT",
    headers: {
      "Content-Type" : "application/json",
      "Authorization": `Bearer ${currentusertoken}`
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
      appt._id === updatedappointment._id ? updatedappointment : appt
    )
  );

  // Clear the eye specialist selection after successful acceptance
  if (clinicType === 'ambher') {
    setambhereyespecialist('');
  } else {
    setbautistaeyespecialist('');
  }

  console.log(`${clinicType} Appointment has been accepted successfully`);

  // Get patient information for toast message
  const patientName = `${selectedpatientappointment.patientappointmentfirstname} ${selectedpatientappointment.patientappointmentlastname}`;
  
  // Try to get patient contact number from demographic data
  let patientContactNumber = 'Contact not available';
  try {
    // Get the appropriate token for authorization
    const staffToken = localStorage.getItem('stafftoken');
    const ownerToken = localStorage.getItem('ownertoken');
    const adminToken = localStorage.getItem('admintoken');
    const token = staffToken || ownerToken || adminToken;

    // Fetch patient demographic data to get contact number
    const demographicResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientappointment.patientappointmentemail}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (demographicResponse.ok) {
      const demographicData = await demographicResponse.json();
      if (demographicData && demographicData.patientcontactnumber) {
        patientContactNumber = demographicData.patientcontactnumber;
      }
    }
  } catch (demoError) {
    console.warn('Could not fetch patient demographic data:', demoError);
  }

  // Show success toast message
  const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
  setSmsToastMessage(`✅ ${clinicDisplayName} appointment accepted successfully! SMS sent to ${patientName} (${patientContactNumber})`);
  setSmsToast(true);
  setSmsToastClosing(false);
  setSmsIsClicked(true); // Green for success

  }catch(error){
    console.error(`Failed to accept ${clinicType} patient appointment:`, error);
    
    // Show error toast message
    const patientName = `${selectedpatientappointment?.patientappointmentfirstname || 'Unknown'} ${selectedpatientappointment?.patientappointmentlastname || 'Patient'}`;
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`❌ Failed to accept ${clinicDisplayName} appointment for ${patientName}: ${error.message}`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsIsClicked(false); // Red for error
  } finally {
    // Always set loading state to false when done
    setIsAcceptingAppointment(false);
  }

};

// Handle declining pending appointments
const handleDeclineAppointment = async (appointmentId, clinicType) => {
  // Check if user has permission to decline appointments
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can decline appointments");
    return;
  }

  // Check clinic-specific access permissions
  if (!canAccessAppointment(selectedpatientappointment, clinicType)) {
    console.error(`Access denied: You can only decline appointments from your clinic (${clinicType})`);
    alert(`Access denied: You can only decline appointments from your clinic`);
    return;
  }

  // Validate appointmentId
  if (!appointmentId) {
    console.error("Appointment ID is missing");
    return;
  }

  // Check if appointment status is Pending
  const currentStatus = clinicType === 'ambher' 
    ? selectedpatientappointment?.patientambherappointmentstatus 
    : selectedpatientappointment?.patientbautistaappointmentstatus;

  if (currentStatus !== 'Pending') {
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    alert(`Can only decline pending ${clinicDisplayName} appointments.`);
    console.error(`Cannot decline ${clinicType} appointment with status: ${currentStatus}`);
    return;
  }

  // Set loading state to true
  setIsDecliningAppointment(true);

  try {
    const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        [`patient${clinicType}appointmentstatus`]: 'Declined',
        [`patient${clinicType}appointmentstatushistory`]: {
          changedBy: adminfirstname
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to decline appointment");
    }

    const updatedappointment = await response.json();
    setselectedpatientappointment(updatedappointment);
    setpatientappointments(prevappointments =>
      prevappointments.map(appt =>
        appt._id === updatedappointment._id ? updatedappointment : appt
      )
    );

    console.log(`${clinicType} Appointment has been declined successfully`);

    // Get patient information for toast message
    const patientName = `${selectedpatientappointment.patientappointmentfirstname} ${selectedpatientappointment.patientappointmentlastname}`;
    
    // Try to get patient contact number from demographic data
    let patientContactNumber = 'Contact not available';
    try {
      // Get the appropriate token for authorization
      const staffToken = localStorage.getItem('stafftoken');
      const ownerToken = localStorage.getItem('ownertoken');
      const adminToken = localStorage.getItem('admintoken');
      const token = staffToken || ownerToken || adminToken;

      // Fetch patient demographic data to get contact number
      const demographicResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientappointment.patientappointmentemail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (demographicResponse.ok) {
        const demographicData = await demographicResponse.json();
        if (demographicData && demographicData.patientcontactnumber) {
          patientContactNumber = demographicData.patientcontactnumber;
        }
      }
    } catch (demoError) {
      console.warn('Could not fetch patient demographic data:', demoError);
    }

    // Show success toast message
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`❌ ${clinicDisplayName} appointment declined successfully! SMS sent to ${patientName} (${patientContactNumber})`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsToastType('warning'); // Use warning type for decline actions
    setSmsIsClicked(false); // Red/yellow for decline/cancellation

  } catch (error) {
    console.error(`Failed to decline ${clinicType} patient appointment:`, error);
    
    // Show error toast message
    const patientName = `${selectedpatientappointment?.patientappointmentfirstname || 'Unknown'} ${selectedpatientappointment?.patientappointmentlastname || 'Patient'}`;
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`❌ Failed to decline ${clinicDisplayName} appointment for ${patientName}: ${error.message}`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsToastType('error'); // Use error type for failures
    setSmsIsClicked(false); // Red for error
  } finally {
    // Always set loading state to false when done
    setIsDecliningAppointment(false);
  }
};

// Handle cancelling accepted appointments
const handleCancelAppointment = async (appointmentId, clinicType) => {
  // Check if user has permission to cancel appointments
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can cancel appointments");
    return;
  }

  // Check clinic-specific access permissions
  if (!canAccessAppointment(selectedpatientappointment, clinicType)) {
    console.error(`Access denied: You can only cancel appointments from your clinic (${clinicType})`);
    alert(`Access denied: You can only cancel appointments from your clinic`);
    return;
  }

  // Validate appointmentId
  if (!appointmentId) {
    console.error("Appointment ID is missing");
    return;
  }

  // Check if appointment status is Accepted
  const currentStatus = clinicType === 'ambher' 
    ? selectedpatientappointment?.patientambherappointmentstatus 
    : selectedpatientappointment?.patientbautistaappointmentstatus;

  if (currentStatus !== 'Accepted') {
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    alert(`Can only cancel accepted ${clinicDisplayName} appointments.`);
    console.error(`Cannot cancel ${clinicType} appointment with status: ${currentStatus}`);
    return;
  }

  // Set loading state to true
  setIsCancellingAppointment(true);

  try {
    const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        [`patient${clinicType}appointmentstatus`]: 'Cancelled',
        [`patient${clinicType}appointmentstatushistory`]: {
          changedBy: adminfirstname
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to cancel appointment");
    }

    const updatedappointment = await response.json();
    setselectedpatientappointment(updatedappointment);
    setpatientappointments(prevappointments =>
      prevappointments.map(appt =>
        appt._id === updatedappointment._id ? updatedappointment : appt
      )
    );

    console.log(`${clinicType} Appointment has been cancelled successfully`);

    // Get patient information for toast message
    const patientName = `${selectedpatientappointment.patientappointmentfirstname} ${selectedpatientappointment.patientappointmentlastname}`;
    
    // Try to get patient contact number from demographic data
    let patientContactNumber = 'Contact not available';
    try {
      // Get the appropriate token for authorization
      const staffToken = localStorage.getItem('stafftoken');
      const ownerToken = localStorage.getItem('ownertoken');
      const adminToken = localStorage.getItem('admintoken');
      const token = staffToken || ownerToken || adminToken;

      // Fetch patient demographic data to get contact number
      const demographicResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientappointment.patientappointmentemail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (demographicResponse.ok) {
        const demographicData = await demographicResponse.json();
        if (demographicData && demographicData.patientcontactnumber) {
          patientContactNumber = demographicData.patientcontactnumber;
        }
      }
    } catch (demoError) {
      console.warn('Could not fetch patient demographic data:', demoError);
    }

    // Show success toast message
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`❌ ${clinicDisplayName} appointment cancelled successfully! SMS sent to ${patientName} (${patientContactNumber})`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsToastType('warning'); // Use warning type for cancel actions
    setSmsIsClicked(false); // Red/yellow for decline/cancellation

  } catch (error) {
    console.error(`Failed to cancel ${clinicType} patient appointment:`, error);
    
    // Show error toast message
    const patientName = `${selectedpatientappointment?.patientappointmentfirstname || 'Unknown'} ${selectedpatientappointment?.patientappointmentlastname || 'Patient'}`;
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`❌ Failed to cancel ${clinicDisplayName} appointment for ${patientName}: ${error.message}`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsToastType('error'); // Use error type for failures
    setSmsIsClicked(false); // Red for error
  } finally {
    // Always set loading state to false when done
    setIsCancellingAppointment(false);
  }
};


//AICODE
const handleCompleteAppointment = async (appointmentId, clinicType) => {
  // Check if user has permission to complete appointments
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can complete appointments");
    return;
  }

  // Check clinic-specific access permissions
  if (!canAccessAppointment(selectedpatientappointment, clinicType)) {
    console.error(`Access denied: You can only complete appointments from your clinic (${clinicType})`);
    alert(`Access denied: You can only complete appointments from your clinic`);
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
          [`patient${clinicType}appointmentpaymentotal`]: clinicType === 'ambher' ? Number(ambherappointmentpaymentotal) || 0 : Number(bautistaappointmentpaymentotal) || 0,
          [`patient${clinicType}appointmentconsultationremarkssubject`]: clinicType === 'ambher' ? ambherappointmentconsultationremarkssubject : bautistaappointmentconsultationremarkssubject,
          [`patient${clinicType}appointmentconsultationremarks`]: clinicType === 'ambher' ? ambherappointmentconsultationremarks : bautistaappointmentconsultationremarks,
          [`patient${clinicType}appointmentprescription`]: clinicType === 'ambher' ? ambherappointmentprescription : bautistaappointmentprescription,
          
          // Include all service selections for Ambher
          ...(clinicType === 'ambher' && {
            patientambherappointmentcataractscreening: selectedpatientappointment.patientambherappointmentcataractscreening || false,
            patientambherappointmentpediatricassessment: selectedpatientappointment.patientambherappointmentpediatricassessment || false,
            patientambherappointmentpediatricoptometrist: selectedpatientappointment.patientambherappointmentpediatricoptometrist || false,
            patientambherappointmentcolorvisiontesting: selectedpatientappointment.patientambherappointmentcolorvisiontesting || false,
            patientambherappointmentlowvisionaid: selectedpatientappointment.patientambherappointmentlowvisionaid || false,
            patientambherappointmentrefraction: selectedpatientappointment.patientambherappointmentrefraction || false,
            patientambherappointmentcontactlensefitting: selectedpatientappointment.patientambherappointmentcontactlensefitting || false,
            patientambherappointmentotherservice: selectedpatientappointment.patientambherappointmentotherservice || false,
            patientambherappointmentotherservicenote: selectedpatientappointment.patientambherappointmentotherservicenote || ''
          }),
          
          // Include all service selections for Bautista
          ...(clinicType === 'bautista' && {
            patientbautistaappointmentcomprehensiveeyeexam: selectedpatientappointment.patientbautistaappointmentcomprehensiveeyeexam || false,
            patientbautistaappointmentdiabeticretinopathy: selectedpatientappointment.patientbautistaappointmentdiabeticretinopathy || false,
            patientbautistaappointmentglaucoma: selectedpatientappointment.patientbautistaappointmentglaucoma || false,
            patientbautistaappointmenthypertensiveretinopathy: selectedpatientappointment.patientbautistaappointmenthypertensiveretinopathy || false,
            patientbautistaappointmentretinolproblem: selectedpatientappointment.patientbautistaappointmentretinolproblem || false,
            patientbautistaappointmentcataractsurgery: selectedpatientappointment.patientbautistaappointmentcataractsurgery || false,
            patientbautistaappointmentpterygiumsurgery: selectedpatientappointment.patientbautistaappointmentpterygiumsurgery || false,
            patientbautistaappointmentotherservice: selectedpatientappointment.patientbautistaappointmentotherservice || false,
            patientbautistaappointmentotherservicenote: selectedpatientappointment.patientbautistaappointmentotherservicenote || ''
          })
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

    // Get patient information for toast message
    const patientName = `${selectedpatientappointment.patientappointmentfirstname} ${selectedpatientappointment.patientappointmentlastname}`;
    
    // Try to get patient contact number from demographic data
    let patientContactNumber = 'Contact not available';
    try {
      // Get the appropriate token for authorization
      const staffToken = localStorage.getItem('stafftoken');
      const ownerToken = localStorage.getItem('ownertoken');
      const adminToken = localStorage.getItem('admintoken');
      const token = staffToken || ownerToken || adminToken;

      // Fetch patient demographic data to get contact number
      const demographicResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientappointment.patientappointmentemail}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (demographicResponse.ok) {
        const demographicData = await demographicResponse.json();
        if (demographicData && demographicData.patientcontactnumber) {
          patientContactNumber = demographicData.patientcontactnumber;
        }
      }
    } catch (demoError) {
      console.warn('Could not fetch patient demographic data:', demoError);
    }

    // Show success toast message
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`✅ ${clinicDisplayName} appointment completed successfully! SMS sent to ${patientName} (${patientContactNumber})`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsIsClicked(true); // Green for success
  } catch (error) {
    console.error(`Error completing ${clinicType} appointment:`, error);
    
    // Show error toast message
    const patientName = `${selectedpatientappointment?.patientappointmentfirstname || 'Unknown'} ${selectedpatientappointment?.patientappointmentlastname || 'Patient'}`;
    const clinicDisplayName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';
    setSmsToastMessage(`❌ Failed to complete ${clinicDisplayName} appointment for ${patientName}: ${error.message}`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsIsClicked(false); // Red for error
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

// Medical Documents State
const [showpatientaddmedicaldocument, setshowpatientaddmedicaldocument] = useState(false);
const [showmedicaldocumentimage, setshowmedicaldocumentimage] = useState(false);
const [selectedmedicaldocument, setselectedmedicaldocument] = useState(null);
const [medicaldocumentfiles, setmedicaldocumentfiles] = useState([]);
const [uploaddingmedicaldocument, setuploaddingmedicaldocument] = useState(false);
const [showdeletemedicaldocumentdialog, setshowdeletemedicaldocumentdialog] = useState(false);

// Delete Medical Record Modal States
const [showdeletebautistamedicalrecorddialog, setshowdeletebautistamedicalrecorddialog] = useState(false);
const [showdeleteambhermedicalrecorddialog, setshowdeleteambhermedicalrecorddialog] = useState(false);

//Clinic Documents State
const [showaddbautistaclinicmedicalrecord, setshowaddbautistaclinicmedicalrecord] = useState(false);
const [showaddambherclinicmedicalrecord, setshowaddambherclinicmedicalrecord] = useState(false);

// Read-only form state (for cross-clinic viewing)
const [isbautistaformreadonly, setisbautistaformreadonly] = useState(false);
const [isambherformreadonly, setisambherformreadonly] = useState(false);

// Bautista Medical Record Edit/View State
const [selectedbautistarecord, setselectedbautistarecord] = useState(null);
const [iseditingbautistarecord, setiseditingbautistarecord] = useState(false);
const [generatedCaseNumber, setgeneratedCaseNumber] = useState('');

// Ambher Medical Record Edit/View State
const [selectedambherrecord, setselectedambherrecord] = useState(null);
const [iseditingambherrecord, setiseditingambherrecord] = useState(false);
const [generatedAmbherCaseNumber, setgeneratedAmbherCaseNumber] = useState('');

// Bautista Medical Record Delete State
const [showdeletebautistamedicaldialog, setshowdeletebautistamedicaldialog] = useState(false);
const [selectedbautistarecordtodelete, setselectedbautistarecordtodelete] = useState(null);

// Ambher Medical Record Delete State
const [showdeleteambhermedicaldialog, setshowdeleteambhermedicaldialog] = useState(false);
const [selectedambherrecordtodelete, setselectedambherrecordtodelete] = useState(null);

// Bautista Medical Record Toast State
const [bautistaRecordToast, setBautistaRecordToast] = useState(false);
const [bautistaRecordToastMessage, setBautistaRecordToastMessage] = useState('');
const [bautistaRecordToastType, setBautistaRecordToastType] = useState('success');
const [bautistaRecordToastClosing, setBautistaRecordToastClosing] = useState(false);
const [bautistaRecordProgressWidth, setBautistaRecordProgressWidth] = useState('0%');

// Ambher Medical Record Toast State
const [ambherRecordToast, setAmbherRecordToast] = useState(false);
const [ambherRecordToastMessage, setAmbherRecordToastMessage] = useState('');
const [ambherRecordToastType, setAmbherRecordToastType] = useState('success');
const [ambherRecordToastClosing, setAmbherRecordToastClosing] = useState(false);
const [ambherRecordProgressWidth, setAmbherRecordProgressWidth] = useState('0%');

// Case Number Validation State
const [caseNoValidation, setCaseNoValidation] = useState({ isChecking: false, isValid: true, message: '' });
const [caseNoValue, setCaseNoValue] = useState('');

// Ambher Case Number Validation State
const [ambherCaseNoValidation, setAmbherCaseNoValidation] = useState({ isChecking: false, isValid: true, message: '' });
const [ambherCaseNoValue, setAmbherCaseNoValue] = useState('');

// Medical Document Form State
const [medicaldocumentname, setmedicaldocumentname] = useState('');
const [medicaldocumentdescription, setmedicaldocumentdescription] = useState('');
const [medicaldocumentselectedfile, setmedicaldocumentselectedfile] = useState(null);
const [medicaldocumentpreviewurl, setmedicaldocumentpreviewurl] = useState(null);
const medicaldocumentinputref = useRef(null);

// Medical Records Search State - Separate search states for different sections
const [searchmedicalrecords, setsearchmedicalrecords] = useState(''); // Main medical records table search
const [searchpastvisitstable, setsearchpastvisitstable] = useState(''); // Past visits table search
const [searchmedicaldocuments, setsearchmedicaldocuments] = useState(''); // Medical documents table search
const [filteredmedicalrecords, setfilteredmedicalrecords] = useState([]);
const [medicaldocumentclinicfilter, setmedicaldocumentclinicfilter] = useState('all'); // 'all', 'ambher', 'bautista'

// Filtered other clinic records with memoization to prevent infinite loops
const filteredOtherClinicRecords = React.useMemo(() => {
  if (!selectedpatientmedicalrecord?.patientemail || !Array.isArray(otherclinicrecords)) {
    return [];
  }

  let filtered = otherclinicrecords
    .filter(record => {
      const recordEmail = record.patientotherclinicemail?.toLowerCase()?.trim();
      const selectedEmail = selectedpatientmedicalrecord.patientemail?.toLowerCase()?.trim();
      return recordEmail === selectedEmail;
    });

  // Apply search filter if search term exists
  if (searchpastvisitstable.trim()) {
    const searchTerm = searchpastvisitstable.toLowerCase().trim();
    filtered = filtered.filter(record => {
      const clinicNameMatch = record.patientotherclinicname?.toLowerCase().includes(searchTerm);
      const eyeSpecialistMatch = record.patientothercliniceyespecialist?.toLowerCase().includes(searchTerm);
      const submittedByMatch = (
        record.patientotherclinicsubmittedbyfirstname?.toLowerCase().includes(searchTerm) ||
        record.patientotherclinicsubmittedbymiddlename?.toLowerCase().includes(searchTerm) ||
        record.patientotherclinicsubmittedbylastname?.toLowerCase().includes(searchTerm) ||
        `${record.patientotherclinicsubmittedbyfirstname} ${record.patientotherclinicsubmittedbymiddlename} ${record.patientotherclinicsubmittedbylastname}`.toLowerCase().includes(searchTerm) ||
        `${record.patientotherclinicsubmittedbyfirstname} ${record.patientotherclinicsubmittedbylastname}`.toLowerCase().includes(searchTerm)
      );
      
      return clinicNameMatch || eyeSpecialistMatch || submittedByMatch;
    });
  }

  // Apply clinic filter
  if (medicaldocumentclinicfilter !== 'all') {
    filtered = filtered.filter(record => {
      if (medicaldocumentclinicfilter === 'ambher') {
        return record.patientotherclinicname?.toLowerCase().includes('ambher');
      } else if (medicaldocumentclinicfilter === 'bautista') {
        return record.patientotherclinicname?.toLowerCase().includes('bautista');
      }
      return true;
    });
  }

  // Sort by consultation date (newest first)
  return filtered.sort((a, b) => new Date(b.patientotherclinicconsultationdate) - new Date(a.patientotherclinicconsultationdate));
}, [otherclinicrecords, selectedpatientmedicalrecord?.patientemail, searchpastvisitstable, medicaldocumentclinicfilter]);

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

const accountItemsPerPage = 5; // Number of accounts to display per page for account management
const itemsPerPage = 10; // Number of items to display per page for other tables

// Dynamic inventory per page based on container height
const [inventoryItemsPerPage, setInventoryItemsPerPage] = useState(20);
const inventoryContainerRef = useRef(null);

// Dynamic appointments per page based on container height
const [appointmentsPerPage, setAppointmentsPerPage] = useState(6);
const appointmentTableRef = useRef(null);

// Medical records per page
const medicalRecordsPerPage = 6;

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
  } else if (section === 'medicalRecords') {
    itemsPerPageToUse = medicalRecordsPerPage;
  } else if (section === 'patients' || section === 'staff') {
    itemsPerPageToUse = accountItemsPerPage;
  } else {
    itemsPerPageToUse = itemsPerPage;
  }
  
  const startIndex = (page - 1) * itemsPerPageToUse;
  const endIndex = startIndex + itemsPerPageToUse;
  return data.slice(startIndex, endIndex);
};

const [otherclinicselectedimage, setotherclinicselectedimage] = useState(null);
const [otherclinicpreviewimage, setotherclinicpreviewimage] = useState (null);
const [otherclinicfiles, setotherclinicfiles] = useState([]);
const [uploadingotherclinicfiles, setuploadingotherclinicfiles] = useState(false);
const otherclinicimageinputref = useRef(null);


//PROFILE IMAGE TYPE HANDLING - Multi-file support
const otherclinichandleprofilechange = async (e) => {
  const files = Array.from(e.target.files);
  console.log('Files selected:', files);
  console.log('Files length:', files.length);
  console.log('File names:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
  
  if (!files.length) {
    console.log('No files selected, returning early');
    return;
  }

  // Check maximum of 5 files
  if (otherclinicfiles.length + files.length > 5) {
    setSmsToastMessage('Maximum 5 files allowed');
    setSmsToastType('error');
    setSmsToast(true);
    return;
  }

  // Validate file types and sizes
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      setSmsToastMessage('Please select image files (JPG, PNG) or PDF documents');
      setSmsToastType('error');
      setSmsToast(true);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSmsToastMessage(`File "${file.name}" is too large. Please select files under 10MB`);
      setSmsToastType('error');
      setSmsToast(true);
      return;
    }
  }

  setuploadingotherclinicfiles(true);
  
  try {
    // Use the new multi-file upload endpoint
    const formData = new FormData();
    
    console.log('Appending files to FormData:', files);
    
    // Append all files with the correct field name
    files.forEach((file, index) => {
      console.log(`Appending file ${index}:`, file.name, file.type, file.size);
      formData.append('otherclinicfiles', file);
    });
    
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    
    const uploadResponse = await fetch('/api/cloudinary/upload/otherclinic-files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: formData
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.message || 'Failed to upload files');
    }
    
    const uploadResult = await uploadResponse.json();
    console.log('Other clinic multi-file upload successful:', uploadResult);
    
    // Process successful uploads
    const newFiles = uploadResult.uploadedFiles.map((upload, index) => {
      // Try to get the original filename from multiple possible sources
      const originalName = upload.originalName || upload.name || files[index]?.name || `file_${index + 1}`;
      
      return {
        name: originalName,
        type: upload.mimetype.includes('pdf') ? 'pdf' : 'image',
        size: files[index]?.size || 0,
        originalFile: files[index],
        cloudinaryUrl: upload.url,
        cloudinaryPublicId: upload.public_id,
        preview: upload.mimetype.includes('pdf') ? null : URL.createObjectURL(files[index])
      };
    });

    console.log('Processed new files with names:', newFiles.map(f => ({ name: f.name, type: f.type })));

    // Add new files to the existing list
    setotherclinicfiles(prev => [...prev, ...newFiles]);
    
    let message = `${newFiles.length} file(s) uploaded successfully`;
    if (uploadResult.failedFiles && uploadResult.failedFiles.length > 0) {
      message += `, ${uploadResult.failedFiles.length} failed`;
    }
    
    setSmsToastMessage(message);
    setSmsToastType('success');
    setSmsToast(true);
    
  } catch (error) {
    console.error('Error uploading files:', error);
    setSmsToastMessage(`Upload failed: ${error.message}`);
    setSmsToastType('error');
    setSmsToast(true);
  } finally {
    setuploadingotherclinicfiles(false);
    // Clear the input
    if (otherclinicimageinputref.current) {
      otherclinicimageinputref.current.value = "";
    }
  }
};

//Handles the click event of upload button
const otherclinichandleuploadclick = () => {
  otherclinicimageinputref.current.click();
};

const removeOtherClinicFile = (index) => {
  setotherclinicfiles(prev => {
    const newFiles = [...prev];
    const removedFile = newFiles[index];
    
    // Revoke object URL to prevent memory leaks
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    
    newFiles.splice(index, 1);
    return newFiles;
  });
};

const otherclinichandleremoveprofile = () => {
  setotherclinicselectedimage(null);
  setotherclinicpreviewimage(null);
  setotherclinicfiles([]);
  setuploadingotherclinicfiles(false);
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

// Filter medical records based on search term and clinic filter
const filterMedicalRecords = useCallback((term) => {
  let filtered = patientdemographics || [];

  // Apply search filter if term exists
  if (term.trim()) {
    const searchTerm = term.toLowerCase().trim();
    filtered = filtered.filter(patient => {
      // Extract age number for more flexible age searching
      const agePattern = searchTerm.match(/(\d+)\s*(?:years?\s*old|yr|y\.o\.?)?/);
      const ageFromSearch = agePattern ? parseInt(agePattern[1]) : null;
      
      // Search in patient basic info
      const patientMatch = (
        patient.patientfirstname?.toLowerCase().includes(searchTerm) ||
        patient.patientmiddlename?.toLowerCase().includes(searchTerm) ||
        patient.patientlastname?.toLowerCase().includes(searchTerm) ||
        patient.patientemail?.toLowerCase().includes(searchTerm) ||
        patient.patientdemographicId?.toString().includes(searchTerm) ||
        patient.patientage?.toString().includes(searchTerm) ||
        patient.patientgender?.toLowerCase().includes(searchTerm) ||
        patient.patientphonenumber?.includes(searchTerm) ||
        patient.patientaddress?.toLowerCase().includes(searchTerm) ||
        `${patient.patientfirstname} ${patient.patientmiddlename} ${patient.patientlastname}`.toLowerCase().includes(searchTerm) ||
        `${patient.patientfirstname} ${patient.patientlastname}`.toLowerCase().includes(searchTerm) ||
        // Enhanced age searching - match "22 years old", "22 yr", "22 y.o.", etc.
        (ageFromSearch !== null && patient.patientage === ageFromSearch) ||
        `${patient.patientage} years old`.toLowerCase().includes(searchTerm) ||
        `${patient.patientage} year old`.toLowerCase().includes(searchTerm) ||
        // Gender variations
        (searchTerm.includes('male') && patient.patientgender?.toLowerCase().includes('male')) ||
        (searchTerm.includes('female') && patient.patientgender?.toLowerCase().includes('female'))
      );

      // Search in medical documents
      const documentsMatch = patient.patientmedicaldocuments?.some(doc => 
        doc.addedbyname?.toLowerCase().includes(searchTerm) ||
        doc.documentname?.toLowerCase().includes(searchTerm) ||
        doc.documentdescription?.toLowerCase().includes(searchTerm) ||
        doc.addedbyclinic?.toLowerCase().includes(searchTerm)
      );

      // Search in appointment details
      const appointmentMatch = patientappointments?.some(appointment => {
        if (appointment.patientappointmentemail !== patient.patientemail) return false;
        
        // Search in raw appointment data
        const rawAppointmentMatch = (
          // Ambher appointment details
          appointment.patientambherappointmentdate?.includes(searchTerm) ||
          appointment.patientambherappointmenttime?.toLowerCase().includes(searchTerm) ||
          appointment.patientambherappointmentstatus?.toLowerCase().includes(searchTerm) ||
          appointment.patientambherappointmentlocation?.toLowerCase().includes(searchTerm) ||
          appointment.patientambherappointmenttype?.toLowerCase().includes(searchTerm) ||
          appointment.patientambherappointmentreason?.toLowerCase().includes(searchTerm) ||
          
          // Bautista appointment details
          appointment.patientbautistaappointmentdate?.includes(searchTerm) ||
          appointment.patientbautistaappointmenttime?.toLowerCase().includes(searchTerm) ||
          appointment.patientbautistaappointmentstatus?.toLowerCase().includes(searchTerm) ||
          appointment.patientbautistaappointmentlocation?.toLowerCase().includes(searchTerm) ||
          appointment.patientbautistaappointmenttype?.toLowerCase().includes(searchTerm) ||
          appointment.patientbautistaappointmentreason?.toLowerCase().includes(searchTerm) ||
          
          // General appointment details
          appointment.patientappointmentid?.toString().includes(searchTerm) ||
          appointment.consultationremarkssubject?.toLowerCase().includes(searchTerm) ||
          appointment.consultationremarks?.toLowerCase().includes(searchTerm) ||
          appointment.prescriptionnotes?.toLowerCase().includes(searchTerm)
        );

        // Search in formatted appointment data (what's actually displayed in the table)
        const formattedAppointmentMatch = (
          // Formatted Ambher appointment date and time
          (appointment.patientambherappointmentdate && 
           formatappointmatedates(appointment.patientambherappointmentdate)?.toLowerCase().includes(searchTerm)) ||
          (appointment.patientambherappointmenttime && 
           formatappointmenttime(appointment.patientambherappointmenttime)?.toLowerCase().includes(searchTerm)) ||
           
          // Formatted Bautista appointment date and time
          (appointment.patientbautistaappointmentdate && 
           formatappointmatedates(appointment.patientbautistaappointmentdate)?.toLowerCase().includes(searchTerm)) ||
          (appointment.patientbautistaappointmenttime && 
           formatappointmenttime(appointment.patientbautistaappointmenttime)?.toLowerCase().includes(searchTerm))
        );

        return rawAppointmentMatch || formattedAppointmentMatch;
      });

      return patientMatch || documentsMatch || appointmentMatch;
    });
  }

  setfilteredmedicalrecords(filtered);
  // Reset to first page when searching or filtering
  setCurrentPage(prev => ({ ...prev, medicalRecords: 1 }));
}, [patientdemographics, patientappointments]);

// Reset medical records pagination when search or filter changes
useEffect(() => {
  setCurrentPage(prev => ({ ...prev, medicalRecords: 1 }));
}, [searchmedicaldocuments, medicaldocumentclinicfilter]);

// Filter individual medical documents based on search term and clinic filter
const filterPatientDocuments = useCallback((documents) => {
  if (!documents || documents.length === 0) return [];

  let filtered = [...documents];

  // Apply clinic filter
  if (medicaldocumentclinicfilter !== 'all') {
    filtered = filtered.filter(doc => {
      if (medicaldocumentclinicfilter === 'ambher') {
        return doc.addedbyclinic?.toLowerCase().includes('ambher');
      } else if (medicaldocumentclinicfilter === 'bautista') {
        return doc.addedbyclinic?.toLowerCase().includes('bautista');
      }
      return true;
    });
  }

  // Apply search filter to document-specific fields
  if (searchmedicaldocuments.trim()) {
    const searchTerm = searchmedicaldocuments.toLowerCase().trim();
    filtered = filtered.filter(doc => 
      doc.addedbyname?.toLowerCase().includes(searchTerm) ||
      doc.documentname?.toLowerCase().includes(searchTerm) ||
      doc.documentdescription?.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
}, [medicaldocumentclinicfilter, searchmedicaldocuments]);

// Update filtered records when search term or clinic filter changes
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
const [otherclinidescription, setotherclinidescription] = useState('');
const [otherclinicrecordissubmitting, setotherclinicrecordissubmitting] = useState(false);

const submitotherclinicdata = async (e) => {
e.preventDefault();
setotherclinicrecordissubmitting(true);

try{
  // Prepare file URLs from uploaded files
  const fileUrls = otherclinicfiles.map(file => file.cloudinaryUrl).filter(Boolean);
  const filePublicIds = otherclinicfiles.map(file => file.cloudinaryPublicId).filter(Boolean);
  const fileNames = otherclinicfiles.map(file => file.name).filter(Boolean);
  
  console.log('File URLs:', fileUrls);
  console.log('File Public IDs:', filePublicIds);
  console.log('File Names:', fileNames);

  const otherclinicrecorddata = {
      patientotherclinicprofilepicture: selectedpatientmedicalrecord.patientprofilepicture,
      patientothercliniclastname: selectedpatientmedicalrecord.patientlastname,
      patientotherclinicfirstname: selectedpatientmedicalrecord.patientfirstname,
      patientotherclinicmiddlename: selectedpatientmedicalrecord.patientmiddlename,
      patientotherclinicemail: selectedpatientmedicalrecord.patientemail,

      patientotherclinicname: otherclinicname,
      patientothercliniceyespecialist: othercliniceyespecialist,
      patientotherclinicconsultationdate: otherclinicconsultationdate,
      patientotherclinidescription: otherclinidescription,
      patientotherclinicsubmittedbyfirstname: adminfirstname,
      patientotherclinicsubmittedbymiddlename: adminmiddlename,
      patientotherclinicsubmittedbylastname: adminlastname,
      patientotherclinicsubmittedbytype: currentuserloggedin,

      // Use first file URL for backward compatibility, add all files array
      patientotherclinicrecordimage: fileUrls[0] || null,
      patientotherclinicrecordfiles: fileUrls, // Array of all uploaded file URLs
      patientotherclinicrecordfiles_public_ids: filePublicIds, // Array of all public IDs
      patientotherclinicrecordfiles_names: fileNames, // Array of original file names
      
      }
  console.log("Submitting Other Clinic Record", otherclinicrecorddata);

  const response = await fetch(`/api/otherclinicrecord`,{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            'Authorization': `Bearer ${currentusertoken}`
          },
          body: JSON.stringify(otherclinicrecorddata)
  });

  if(!response.ok){
    throw new Error(`HTTP error! Error: ${response.status}`);
  }

  const result = await response.json();
  console.log('Other Clinic Record Successfully Submitted', result);
  
  setSmsToastMessage('Other clinic record submitted successfully!');
  setSmsToastType('success');
  setSmsToast(true);
  
  await fetchotherclinicrecords();
  
  // Reset form
  setotherclinicselectedimage(false);
  setotherclinicpreviewimage(null);
  setotherclinicfiles([]);
  setotherclinicname("");
  setothercliniceyespecialist("");
  setotherclinicconsultationdate("");
  setotherclinidescription("");

}catch(error) {
  console.error('Error Submitting Other Clinic Record: ', error);
  setSmsToastMessage('Failed to submit other clinic record. Please try again.');
  setSmsToastType('error');
  setSmsToast(true);
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

// Medical Documents Handlers
const medicaldocumenthandleupload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  // Check if a patient is selected
  if (!selectedpatientmedicalrecord?.patientemail) {
    alert('No patient selected');
    return;
  }

  // Validate file sizes
  for (const file of files) {
    if (file.size > 10 * 1024 * 1024) {
      alert(`File "${file.name}" is too large. Please select files under 10MB`);
      return;
    }
  }

  setuploaddingmedicaldocument(true);

  const newFiles = [];
  
  for (const file of files) {
    try {
      // Upload through backend API with authentication
      const formData = new FormData();
      formData.append('recordImage', file);
      formData.append('recordId', selectedpatientmedicalrecord.patientemail);
      
      const uploadResponse = await fetch('/api/cloudinary/upload/clinic-record-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
        },
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('Medical document upload successful:', uploadResult);
      
      // Create file object for display
      const fileObj = {
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        size: file.size,
        originalFile: file,
        cloudinaryUrl: uploadResult.data?.recordImageUrl || uploadResult.data?.imageUrl,
        cloudinaryPublicId: uploadResult.data?.recordImage_public_id || uploadResult.data?.public_id,
        preview: file.type.includes('pdf') ? null : URL.createObjectURL(file)
      };
      
      newFiles.push(fileObj);
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      alert(`Failed to upload ${file.name}: ${error.message}`);
    }
  }

  // Add new files to the existing list
  setmedicaldocumentfiles(prev => [...prev, ...newFiles]);
  
  // Clear the input
  if (medicaldocumentinputref.current) {
    medicaldocumentinputref.current.value = "";
  }

  setuploaddingmedicaldocument(false);
};

const removeMedicalDocumentFile = (index) => {
  setmedicaldocumentfiles(prev => {
    const newFiles = [...prev];
    const removedFile = newFiles[index];
    
    // Revoke object URL to prevent memory leaks
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    
    newFiles.splice(index, 1);
    return newFiles;
  });
};

const medicaldocumenthandleuploadclick = () => {
  medicaldocumentinputref.current.click();
};

const medicaldocumenthandleremove = () => {
  setmedicaldocumentselectedfile(null);
  setmedicaldocumentpreviewurl(null);
  if(medicaldocumentinputref.current){
    medicaldocumentinputref.current.value = "";
  }
  window.cloudinaryMedicalDocumentUrl = null;
}

const submitMedicalDocuments = async (e) => {
  e.preventDefault();
  setuploaddingmedicaldocument(true);

  try {
    if (!medicaldocumentname.trim()) {
      alert("Please enter a document name");
      return;
    }

    if (medicaldocumentfiles.length === 0) {
      alert("Please upload at least one document");
      return;
    }

    // Submit each file as a separate medical document
    for (const file of medicaldocumentfiles) {
      const medicaldocumentdata = {
        patientEmail: selectedpatientmedicalrecord.patientemail,
        documentname: medicaldocumentname,
        documentdescription: medicaldocumentdescription,
        originalname: file.name,
        filename: file.name,
        mimetype: file.originalFile.type,
        size: file.size,
        documenturl: file.cloudinaryUrl,
        public_id: file.cloudinaryPublicId,
        addedbyname: `${adminfirstname} ${adminmiddlename} ${adminlastname}`,
        addedbyclinic: localStorage.getItem('staffclinic') || localStorage.getItem('ownerclinic'),
        addedbytype: currentuserloggedin,
        addedbydate: new Date().toISOString()
      };

      console.log("Submitting medical document:", medicaldocumentdata);

      const response = await fetch(`/api/patientdemographics/medical-documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${currentusertoken}`
        },
        body: JSON.stringify(medicaldocumentdata)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Medical document successfully submitted:', result);
    }

    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        // Fetch the updated patient record directly from the API
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record with new medical documents:', updatedPatientRecord);
          console.log('New medical documents count:', updatedPatientRecord.patientmedicaldocuments?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }

    // Refresh patient demographics data in the background
    fetchDemographicsData(true);
    
    // Reset form
    setmedicaldocumentname("");
    setmedicaldocumentdescription("");
    setmedicaldocumentfiles([]);
    setshowpatientaddmedicaldocument(false);

    // Show success toast
    setMedicalDocumentToastMessage(`Successfully uploaded ${medicaldocumentfiles.length} document(s)`);
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(true);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);

  } catch (error) {
    console.error('Error submitting medical documents:', error);
    
    // Show error toast
    setMedicalDocumentToastMessage('Failed to upload medical documents. Please try again.');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(false);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation for error toast
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);
  } finally {
    setuploaddingmedicaldocument(false);
  }
};

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Helper function to show Bautista record error toast
const showBautistaErrorToast = (message) => {
  setBautistaRecordToastMessage(message);
  setBautistaRecordToastType('error');
  setBautistaRecordToast(true);
  
  setTimeout(() => {
    setBautistaRecordProgressWidth('100%');
  }, 100);
  setTimeout(() => {
    setBautistaRecordToastClosing(true);
    setTimeout(() => {
      setBautistaRecordToast(false);
      setBautistaRecordToastClosing(false);
      setBautistaRecordProgressWidth('0%');
    }, 300);
  }, 4000);
};

// Case number validation function
const validateCaseNumber = async (caseNo) => {
  if (!caseNo || caseNo.trim() === '') {
    setCaseNoValidation({ isChecking: false, isValid: true, message: '' });
    return;
  }

  // If editing existing record and case number hasn't changed, skip validation
  if (selectedbautistarecord && selectedbautistarecord.caseNo === caseNo) {
    setCaseNoValidation({ isChecking: false, isValid: true, message: '' });
    return;
  }

  setCaseNoValidation({ isChecking: true, isValid: true, message: 'Checking...' });

  try {
    const response = await fetch(`/api/patientdemographics/check-case-number/${encodeURIComponent(caseNo)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check case number');
    }

    const result = await response.json();
    
    if (result.exists) {
      setCaseNoValidation({ 
        isChecking: false, 
        isValid: false, 
        message: 'Case number already exists' 
      });
    } else {
      setCaseNoValidation({ 
        isChecking: false, 
        isValid: true, 
        message: 'Case number available' 
      });
    }
  } catch (error) {
    console.error('Error checking case number:', error);
    setCaseNoValidation({ 
      isChecking: false, 
      isValid: true, 
      message: 'Unable to verify case number' 
    });
  }
};

// Debounced case number validation
const debouncedValidateCaseNumber = debounce((caseNo) => validateCaseNumber(caseNo), 500);

// Handle case number input change
const handleCaseNoChange = (e) => {
  const value = e.target.value;
  setCaseNoValue(value);
  
  if (!selectedbautistarecord) { // Only validate for new records
    debouncedValidateCaseNumber(value);
  }
};

// Submit Bautista Medical Record Function
const submitBautistaMedicalRecord = async (e) => {
  e.preventDefault();
  
  try {
    if (!selectedpatientmedicalrecord) {
      showBautistaErrorToast('Please select a patient first');
      return;
    }

    const formData = new FormData(e.target);
    
    // Validate required fields
    const caseNo = formData.get('caseNo');
    const patientstatus = formData.get('patientstatus');
    
    // Check for required fields
    if (!caseNo || caseNo.trim() === '') {
      showBautistaErrorToast('Case Number is required');
      return;
    }
    
    if (!patientstatus || patientstatus.trim() === '') {
      showBautistaErrorToast('Patient Status is required');
      return;
    }
    
    // Extract form data
    const medicalRecordData = {
      caseNo: formData.get('caseNo'),
      patientstatus: formData.get('patientstatus'),
      patientphilhealthcategory: formData.get('patientphilhealthcategory'),
      hmo: formData.get('hmo'),
      
      // Subjective
      chiefComplaint: formData.get('chiefComplaint'),
      historyOfPresentIllness: formData.get('historyOfPresentIllness'),
      hpn: formData.get('hpn') === 'on',
      dm: formData.get('dm') === 'on',
      asthma: formData.get('asthma') === 'on',
      ptb: formData.get('ptb') === 'on',
      othersHistory: formData.get('othersHistory'),
      height: formData.get('height'),
      weight: formData.get('weight'),
      
      // Objective - Visual Exam
      visualExam: {
        od: {
          sc: formData.get('visualExam_od_sc'),
          cc: formData.get('visualExam_od_cc'),
          ph: formData.get('visualExam_od_ph')
        },
        os: {
          sc: formData.get('visualExam_os_sc'),
          cc: formData.get('visualExam_os_cc'),
          ph: formData.get('visualExam_os_ph')
        }
      },
      
      // Objective - Refraction
      refraction: {
        od: {
          sphere: formData.get('refraction_od_sphere'),
          cylinder: formData.get('refraction_od_cylinder'),
          axis: formData.get('refraction_od_axis')
        },
        os: {
          sphere: formData.get('refraction_os_sphere'),
          cylinder: formData.get('refraction_os_cylinder'),
          axis: formData.get('refraction_os_axis')
        },
        adds: {
          right: formData.get('refraction_adds_right'),
          left: formData.get('refraction_adds_left')
        },
        pd: formData.get('refraction_pd')
      },
      
      // Objective - External Exam
      externalExam: {
        isEssentiallyNormal: formData.get('externalExam_isEssentiallyNormal') === 'on',
        details: formData.get('externalExam_details')
      },
      
      // Objective - Biomicroscopy
      biomicroscopy: {
        details: formData.get('biomicroscopy_details')
      },
      
      // Objective - Funduscopy
      funduscopy: {
        od: {
          cdRatio: formData.get('funduscopy_od_cdRatio'),
          details: formData.get('funduscopy_od_details')
        },
        os: {
          cdRatio: formData.get('funduscopy_os_cdRatio'),
          details: formData.get('funduscopy_os_details')
        }
      },
      
      // Objective - EOMS
      eoms: {
        isFullAndEqual: formData.get('eoms_isFullAndEqual') === 'on',
        details: formData.get('eoms_details')
      },
      
      // Objective - Tonometry
      tonometry: {
        time: formData.get('tonometry_time'),
        od: formData.get('tonometry_od'),
        os: formData.get('tonometry_os')
      },
      
      // Diagnosis
      diagnosis: {
        description: formData.get('diagnosis_description'),
        icd10Code: formData.get('diagnosis_icd10Code')
      },
      
      // Plans
      plans: {
        diagnostics: formData.get('plans_diagnostics'),
        therapeutics: formData.get('plans_therapeutics')
      },
      
      // Follow-up & Signature
      followUp: formData.get('followUp'),
      mdSignature: formData.get('mdSignature'),
      
      // Added by information
      addedbyname: `${adminfirstname} ${adminmiddlename} ${adminlastname}`,
      addedbyclinic: localStorage.getItem('staffclinic') || localStorage.getItem('ownerclinic') || 'Bautista Eye Center',
      addedbytype: currentuserloggedin
    };

    console.log("Submitting Bautista medical record:", medicalRecordData);

    const response = await fetch('/api/patientdemographics/bautista-medical-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        patientEmail: selectedpatientmedicalrecord.patientemail,
        medicalRecord: medicalRecordData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Check for specific validation errors
      if (errorData.errors && Array.isArray(errorData.errors)) {
        // If there are validation errors, show the first one
        throw new Error(errorData.errors[0].message || errorData.errors[0]);
      } else if (errorData.message) {
        throw new Error(errorData.message);
      } else if (response.status === 400) {
        throw new Error('Please check all required fields are filled correctly');
      } else {
        throw new Error('Failed to save medical record');
      }
    }

    const result = await response.json();
    console.log('Bautista medical record saved successfully:', result);

    // Reset form and close modal
    e.target.reset();
    setshowaddbautistaclinicmedicalrecord(false);
    setselectedbautistarecord(null);
    setgeneratedCaseNumber('');
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        // Fetch the updated patient record directly from the API
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record with new medical record:', updatedPatientRecord);
          console.log('New medical records count:', updatedPatientRecord.patientmedicalrecordbautista?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    // Show success toast
    setBautistaRecordToastMessage('Medical record saved successfully!');
    setBautistaRecordToastType('success');
    setBautistaRecordToast(true);
    
    // Start progress bar animation
    setTimeout(() => {
      setBautistaRecordProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setBautistaRecordToastClosing(true);
      setTimeout(() => {
        setBautistaRecordToast(false);
        setBautistaRecordToastClosing(false);
        setBautistaRecordProgressWidth('0%');
      }, 300);
    }, 4000);

    // Clear the generated case number after successful submission
    setgeneratedCaseNumber('');

    // Refresh patient demographics in the background
    fetchDemographicsData(true);

  } catch (error) {
    console.error('Error submitting Bautista medical record:', error);
    
    // Parse error message for better user feedback
    let errorMessage = 'Error saving medical record';
    
    if (error.message) {
      if (error.message.includes('400')) {
        errorMessage = 'Please check all required fields are filled correctly';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Form validation failed - please check all required fields';
      } else if (error.message.includes('required')) {
        errorMessage = 'Please fill in all required fields';
      } else if (error.message.includes('Invalid')) {
        errorMessage = 'Invalid data provided - please check your inputs';
      } else {
        errorMessage = 'Error saving medical record: ' + error.message;
      }
    }
    
    // Show error toast
    setBautistaRecordToastMessage(errorMessage);
    setBautistaRecordToastType('error');
    setBautistaRecordToast(true);
    
    // Start progress bar animation
    setTimeout(() => {
      setBautistaRecordProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setBautistaRecordToastClosing(true);
      setTimeout(() => {
        setBautistaRecordToast(false);
        setBautistaRecordToastClosing(false);
        setBautistaRecordProgressWidth('0%');
      }, 300);
    }, 4000);
  }
};

const deleteMedicalDocument = async () => {
  try {
    if (!selectedmedicaldocument) return;

    console.log('Deleting medical document:', selectedmedicaldocument);
    console.log('Patient email:', selectedpatientmedicalrecord.patientemail);
    console.log('Document ID:', selectedmedicaldocument._id);

    const deleteUrl = `/api/patientdemographics/medical-documents/${selectedpatientmedicalrecord.patientemail}/${selectedmedicaldocument._id}`;
    console.log('Delete URL:', deleteUrl);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    console.log('Delete response status:', response.status);
    console.log('Delete response ok:', response.ok);

    if (!response.ok) {
      const result = await response.json();
      console.error('Delete error response:', result);
      throw new Error(result.message || "Failed to delete document");
    }

    const deleteResult = await response.json();
    console.log('Delete success response:', deleteResult);

    // Refresh patient demographics data
    await fetchDemographicsData(true);
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        // Fetch the updated patient record directly from the API
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after deleting medical document');
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    setselectedmedicaldocument(null);
    setshowdeletemedicaldocumentdialog(false);

    // Show success toast
    setMedicalDocumentToastMessage('Medical document deleted successfully');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(true);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);

  } catch (error) {
    console.error("Failed to delete medical document:", error.message);
    
    // Show error toast instead of alert
    setMedicalDocumentToastMessage('Failed to delete document. Please try again.');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(false);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation for error toast
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);
  }
};

// Delete Bautista Medical Record Function
const deleteBautistaMedicalRecord = async () => {
  try {
    if (!selectedbautistarecord || !selectedpatientmedicalrecord) return;

    console.log('Deleting Bautista medical record:', selectedbautistarecord);
    console.log('Patient email:', selectedpatientmedicalrecord.patientemail);
    console.log('Record ID:', selectedbautistarecord._id);

    const deleteUrl = `/api/patientdemographics/bautista-medical-records/${selectedpatientmedicalrecord.patientemail}/${selectedbautistarecord._id}`;
    console.log('Delete URL:', deleteUrl);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      const result = await response.json();
      console.error('Delete error response:', result);
      throw new Error(result.message || "Failed to delete medical record");
    }

    const deleteResult = await response.json();
    console.log('Delete success response:', deleteResult);

    // Refresh patient demographics data
    await fetchDemographicsData(true);
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after deleting Bautista medical record');
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    setselectedbautistarecord(null);
    setshowdeletebautistamedicalrecorddialog(false);
    setshowaddbautistaclinicmedicalrecord(false);

    // Show success toast
    setMedicalDocumentToastMessage('Bautista medical record deleted successfully');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(true);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);

  } catch (error) {
    console.error("Failed to delete Bautista medical record:", error.message);
    
    // Show error toast
    setMedicalDocumentToastMessage('Failed to delete medical record. Please try again.');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(false);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation for error toast
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);
  }
};

// Delete Ambher Medical Record Function
const deleteAmbherMedicalRecord = async () => {
  try {
    if (!selectedambherrecord || !selectedpatientmedicalrecord) return;

    console.log('Deleting Ambher medical record:', selectedambherrecord);
    console.log('Patient email:', selectedpatientmedicalrecord.patientemail);
    console.log('Record ID:', selectedambherrecord._id);

    const deleteUrl = `/api/patientdemographics/ambher-medical-records/${selectedpatientmedicalrecord.patientemail}/${selectedambherrecord._id}`;
    console.log('Delete URL:', deleteUrl);

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      const result = await response.json();
      console.error('Delete error response:', result);
      throw new Error(result.message || "Failed to delete medical record");
    }

    const deleteResult = await response.json();
    console.log('Delete success response:', deleteResult);

    // Refresh patient demographics data
    await fetchDemographicsData(true);
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after deleting Ambher medical record');
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    setselectedambherrecord(null);
    setshowdeleteambhermedicalrecorddialog(false);
    setshowaddambherclinicmedicalrecord(false);

    // Show success toast
    setMedicalDocumentToastMessage('Ambher medical record deleted successfully');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(true);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);

  } catch (error) {
    console.error("Failed to delete Ambher medical record:", error.message);
    
    // Show error toast
    setMedicalDocumentToastMessage('Failed to delete medical record. Please try again.');
    setMedicalDocumentToast(true);
    setMedicalDocumentIsClicked(false);
    setMedicalDocumentToastClosing(false);
    setMedicalDocumentProgressWidth('0%');

    // Start progress bar animation for error toast
    setTimeout(() => {
      setMedicalDocumentProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setMedicalDocumentToastClosing(true);
      setTimeout(() => {
        setMedicalDocumentToast(false);
        setMedicalDocumentToastClosing(false);
        setMedicalDocumentProgressWidth('0%');
      }, 3000);
    }, 4000);
  }
};

// Function to handle viewing/editing existing Bautista medical record
const viewBautistaRecord = (record) => {
  console.log('=== viewBautistaRecord START ===');
  console.log('Input record:', record);
  console.log('Record type:', record.recordType);
  
  // Get current user's clinic
  const currentUserClinic = staffclinic || ownerownedclinic || localStorage.getItem('staffclinic') || localStorage.getItem('ownerownedclinic');
  console.log('Current user clinic:', currentUserClinic);
  console.log('Record added by clinic:', record.addedbyclinic);
  
  // Check if current user's clinic can edit this record
  const isReadOnly = record.addedbyclinic !== currentUserClinic;
  console.log('Is Bautista form read-only:', isReadOnly);
  
  // Clear any Ambher modal state first
  console.log('Clearing Ambher modal state...');
  setshowaddambherclinicmedicalrecord(false);
  setselectedambherrecord(null);
  setisambherformreadonly(false);
  
  // Use setTimeout to ensure state updates are processed
  setTimeout(() => {
    console.log('Setting Bautista record and modal...');
    setselectedbautistarecord(record);
    setisbautistaformreadonly(isReadOnly);
    setshowaddbautistaclinicmedicalrecord(true);
    
    console.log('=== viewBautistaRecord END ===');
  }, 10); // Small delay to ensure state updates
};

// Function to generate next available case number
const generateNextCaseNumber = async () => {
  try {
    const response = await fetch('/api/patientdemographics/next-case-number', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate case number');
    }

    const result = await response.json();
    return result.nextCaseNumber;
  } catch (error) {
    console.error('Error generating case number:', error);
    // Fallback to timestamp-based case number
    return Date.now().toString();
  }
};

// Function to handle opening new medical record form
const openNewMedicalRecordForm = async () => {
  const nextCaseNumber = await generateNextCaseNumber();
  setgeneratedCaseNumber(nextCaseNumber);
  setselectedbautistarecord(null);
  // Initialize case number validation state
  setCaseNoValue(nextCaseNumber);
  setCaseNoValidation({
    isChecking: false,
    isValid: true,
    message: ''
  });
  setshowaddbautistaclinicmedicalrecord(true);
};

// Function to handle editing existing Bautista medical record
const editBautistaRecord = (record) => {
  console.log('Editing Bautista medical record:', record);
  setselectedbautistarecord(record);
  setiseditingbautistarecord(true);
  // Initialize case number validation state with existing record's case number
  setCaseNoValue(record.patientmedicalrecordbautista?.caseNo || '');
  setCaseNoValidation({
    isChecking: false,
    isValid: true,
    message: ''
  });
  setshowaddbautistaclinicmedicalrecord(true);
};

// Function to update existing Bautista medical record
const updateBautistaMedicalRecord = async (e) => {
  e.preventDefault();
  
  try {
    if (!selectedbautistarecord || !selectedpatientmedicalrecord) {
      alert("Invalid record selection");
      return;
    }

    const formData = new FormData(e.target);
    
    // Extract form data (same structure as submitBautistaMedicalRecord)
    const medicalRecordData = {
      caseNo: formData.get('caseNo'),
      patientstatus: formData.get('patientstatus'),
      patientphilhealthcategory: formData.get('patientphilhealthcategory'),
      hmo: formData.get('hmo'),
      
      // Subjective
      chiefComplaint: formData.get('chiefComplaint'),
      historyOfPresentIllness: formData.get('historyOfPresentIllness'),
      hpn: formData.get('hpn') === 'on',
      dm: formData.get('dm') === 'on',
      asthma: formData.get('asthma') === 'on',
      ptb: formData.get('ptb') === 'on',
      othersHistory: formData.get('othersHistory'),
      height: formData.get('height'),
      weight: formData.get('weight'),
      
      // Objective - Visual Exam
      visualExam: {
        od: {
          sc: formData.get('visualExam_od_sc'),
          cc: formData.get('visualExam_od_cc'),
          ph: formData.get('visualExam_od_ph')
        },
        os: {
          sc: formData.get('visualExam_os_sc'),
          cc: formData.get('visualExam_os_cc'),
          ph: formData.get('visualExam_os_ph')
        }
      },
      
      // Objective - Refraction
      refraction: {
        od: {
          sphere: formData.get('refraction_od_sphere'),
          cylinder: formData.get('refraction_od_cylinder'),
          axis: formData.get('refraction_od_axis')
        },
        os: {
          sphere: formData.get('refraction_os_sphere'),
          cylinder: formData.get('refraction_os_cylinder'),
          axis: formData.get('refraction_os_axis')
        },
        adds: {
          right: formData.get('refraction_adds_right'),
          left: formData.get('refraction_adds_left')
        },
        pd: formData.get('refraction_pd')
      },
      
      // Objective - External Exam
      externalExam: {
        isEssentiallyNormal: formData.get('externalExam_isEssentiallyNormal') === 'on',
        details: formData.get('externalExam_details')
      },
      
      // Objective - Biomicroscopy
      biomicroscopy: {
        details: formData.get('biomicroscopy_details')
      },
      
      // Objective - Funduscopy
      funduscopy: {
        od: {
          cdRatio: formData.get('funduscopy_od_cdRatio'),
          details: formData.get('funduscopy_od_details')
        },
        os: {
          cdRatio: formData.get('funduscopy_os_cdRatio'),
          details: formData.get('funduscopy_os_details')
        }
      },
      
      // Objective - EOMS
      eoms: {
        isFullAndEqual: formData.get('eoms_isFullAndEqual') === 'on',
        details: formData.get('eoms_details')
      },
      
      // Objective - Tonometry
      tonometry: {
        time: formData.get('tonometry_time'),
        od: formData.get('tonometry_od'),
        os: formData.get('tonometry_os')
      },
      
      // Diagnosis
      diagnosis: {
        description: formData.get('diagnosis_description'),
        icd10Code: formData.get('diagnosis_icd10Code')
      },
      
      // Plans
      plans: {
        diagnostics: formData.get('plans_diagnostics'),
        therapeutics: formData.get('plans_therapeutics')
      },
      
      // Follow-up & Signature
      followUp: formData.get('followUp'),
      mdSignature: formData.get('mdSignature')
    };

    console.log("Updating Bautista medical record:", medicalRecordData);
    console.log("Record ID:", selectedbautistarecord._id);

    const response = await fetch(`/api/patientdemographics/bautista-medical-records/${selectedpatientmedicalrecord.patientemail}/${selectedbautistarecord._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(medicalRecordData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update medical record');
    }

    const result = await response.json();
    console.log('Bautista medical record updated successfully:', result);

    // Reset states and close modal
    setselectedbautistarecord(null);
    setshowaddbautistaclinicmedicalrecord(false);
    setgeneratedCaseNumber('');
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        // Fetch the updated patient record directly from the API
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after editing medical record:', updatedPatientRecord);
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    // Show success toast
    setBautistaRecordToastMessage('Medical record updated successfully!');
    setBautistaRecordToastType('success');
    setBautistaRecordToast(true);
    
    // Start progress bar animation
    setTimeout(() => {
      setBautistaRecordProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setBautistaRecordToastClosing(true);
      setTimeout(() => {
        setBautistaRecordToast(false);
        setBautistaRecordToastClosing(false);
        setBautistaRecordProgressWidth('0%');
      }, 300);
    }, 4000);

    // Refresh patient demographics in the background
    fetchDemographicsData(true);

  } catch (error) {
    console.error('Error updating Bautista medical record:', error);
    
    // Show error toast
    setBautistaRecordToastMessage('Error updating medical record: ' + error.message);
    setBautistaRecordToastType('error');
    setBautistaRecordToast(true);
    
    // Start progress bar animation
    setTimeout(() => {
      setBautistaRecordProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setBautistaRecordToastClosing(true);
      setTimeout(() => {
        setBautistaRecordToast(false);
        setBautistaRecordToastClosing(false);
        setBautistaRecordProgressWidth('0%');
      }, 300);
    }, 4000);
  }
};

// Function to delete Bautista medical record
const deletepatientBautistaMedicalRecord = async () => {
  try {
    if (!selectedbautistarecordtodelete || !selectedpatientmedicalrecord) return;

    console.log('Deleting Bautista medical record:', selectedbautistarecordtodelete._id);
    console.log('Patient email:', selectedpatientmedicalrecord.patientemail);

    const deleteUrl = `/api/patientdemographics/bautista-medical-records/${selectedpatientmedicalrecord.patientemail}/${selectedbautistarecordtodelete._id}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete medical record');
    }

    const deleteResult = await response.json();
    console.log('Delete success response:', deleteResult);

    // Refresh patient demographics data
    await fetchDemographicsData(true);
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after deleting medical record');
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    // Reset states and close dialog
    setselectedbautistarecordtodelete(null);
    setshowdeletebautistamedicaldialog(false);

    // Show success toast
    setBautistaRecordToastMessage('Medical record deleted successfully!');
    setBautistaRecordToastType('success');
    setBautistaRecordToast(true);
    
    // Start progress bar animation
    setTimeout(() => {
      setBautistaRecordProgressWidth('100%');
    }, 100);

    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setBautistaRecordToastClosing(true);
      setTimeout(() => {
        setBautistaRecordToast(false);
        setBautistaRecordToastClosing(false);
        setBautistaRecordProgressWidth('0%');
      }, 300);
    }, 4000);

  } catch (error) {
    console.error('Error deleting Bautista medical record:', error);
    
    // Show error toast
    setBautistaRecordToastMessage('Error deleting medical record: ' + error.message);
    setBautistaRecordToastType('error');
    setBautistaRecordToast(true);
    
    // Start progress bar animation
    setTimeout(() => {
      setBautistaRecordProgressWidth('100%');
    }, 100);

    // Auto-hide error toast after 4 seconds
    setTimeout(() => {
      setBautistaRecordToastClosing(true);
      setTimeout(() => {
        setBautistaRecordToast(false);
        setBautistaRecordToastClosing(false);
        setBautistaRecordProgressWidth('0%');
      }, 300);
    }, 4000);
  }
};

//AMBHER MEDICAL RECORD FUNCTIONS //AMBHER MEDICAL RECORD FUNCTIONS //AMBHER MEDICAL RECORD FUNCTIONS
//AMBHER MEDICAL RECORD FUNCTIONS //AMBHER MEDICAL RECORD FUNCTIONS //AMBHER MEDICAL RECORD FUNCTIONS

// Show Ambher toast functions
const showAmbherSuccessToast = (message) => {
  setAmbherRecordToastMessage(message);
  setAmbherRecordToastType('success');
  setAmbherRecordToast(true);
  setTimeout(() => {
    setAmbherRecordProgressWidth('100%');
  }, 100);
  setTimeout(() => {
    setAmbherRecordToastClosing(true);
    setTimeout(() => {
      setAmbherRecordToast(false);
      setAmbherRecordToastClosing(false);
      setAmbherRecordProgressWidth('0%');
    }, 300);
  }, 4000);
};

const showAmbherErrorToast = (message) => {
  setAmbherRecordToastMessage(message);
  setAmbherRecordToastType('error');
  setAmbherRecordToast(true);
  setTimeout(() => {
    setAmbherRecordProgressWidth('100%');
  }, 100);
  setTimeout(() => {
    setAmbherRecordToastClosing(true);
    setTimeout(() => {
      setAmbherRecordToast(false);
      setAmbherRecordToastClosing(false);
      setAmbherRecordProgressWidth('0%');
    }, 300);
  }, 4000);
};

// Validate Ambher case number
const validateAmbherCaseNumber = async (caseNo) => {
  if (!caseNo || caseNo.trim() === '') {
    setAmbherCaseNoValidation({ isChecking: false, isValid: true, message: '' });
    return;
  }

  // Check if it's the currently selected record's case number
  if (selectedambherrecord && selectedambherrecord.ambheropticalcaseno === caseNo) {
    setAmbherCaseNoValidation({ isChecking: false, isValid: true, message: '' });
    return;
  }

  // Start validation
  setAmbherCaseNoValidation({ isChecking: true, isValid: true, message: 'Checking...' });

  try {
    const response = await fetch(`/api/patientdemographics/validate-ambher-case-number/${encodeURIComponent(caseNo)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      throw new Error('Validation request failed');
    }

    const result = await response.json();
    
    if (result.exists) {
      setAmbherCaseNoValidation({ 
        isChecking: false, 
        isValid: false, 
        message: 'Case number already exists' 
      });
    } else {
      setAmbherCaseNoValidation({ 
        isChecking: false, 
        isValid: true, 
        message: 'Case number is available' 
      });
    }
  } catch (error) {
    console.error('Error validating case number:', error);
    setAmbherCaseNoValidation({ 
      isChecking: false, 
      isValid: true, 
      message: 'Unable to verify case number' 
    });
  }
};

// Debounced Ambher case number validation
const debouncedValidateAmbherCaseNumber = debounce((caseNo) => validateAmbherCaseNumber(caseNo), 500);

// Handle Ambher case number input change
const handleAmbherCaseNoChange = (e) => {
  const value = e.target.value;
  setAmbherCaseNoValue(value);
  
  if (!selectedambherrecord) { // Only validate for new records
    debouncedValidateAmbherCaseNumber(value);
  }
};

// Submit Ambher Medical Record Function
const submitAmbherMedicalRecord = async (e) => {
  e.preventDefault();
  
  try {
    if (!selectedpatientmedicalrecord) {
      showAmbherErrorToast('Please select a patient first');
      return;
    }

    const formData = new FormData(e.target);
    
    // Validate required fields
    const caseNo = formData.get('ambherCaseNo');
    const patientstatus = formData.get('patientstatus');
    
    // Check for required fields
    if (!caseNo || caseNo.trim() === '') {
      showAmbherErrorToast('Case Number is required');
      return;
    }
    
    if (!patientstatus || patientstatus.trim() === '') {
      showAmbherErrorToast('Patient Status is required');
      return;
    }
    
    // Extract form data based on the provided prescription format
    const medicalRecordData = {
      ambheropticalcaseno: formData.get('ambherCaseNo'),
      patientstatus: formData.get('patientstatus'),
      patientphilhealthcategory: formData.get('patientphilhealthcategory'),
      hmo: formData.get('hmo'),
      
      // Prescription data based on the image format
      refraction: {
        od: {
          sphere: formData.get('refraction_od_sphere'),
          cylinder: formData.get('refraction_od_cylinder'),
          axis: formData.get('refraction_od_axis')
        },
        os: {
          sphere: formData.get('refraction_os_sphere'),
          cylinder: formData.get('refraction_os_cylinder'),
          axis: formData.get('refraction_os_axis')
        },
        pd: formData.get('refraction_pd'),
        bc: formData.get('refraction_bc'),
        dia: formData.get('refraction_dia'),
        tint: formData.get('refraction_tint'),
        type: formData.get('refraction_type')
      },
      
      // Additional notes/remarks
      remarks: formData.get('remarks'),
      lensRecommendation: formData.get('lensRecommendation'),
      
      // Added by information
      addedbyname: `${adminfirstname} ${adminmiddlename} ${adminlastname}`,
      addedbyclinic: localStorage.getItem('staffclinic') || localStorage.getItem('ownerclinic') || 'Ambher Optical',
      addedbytype: currentuserloggedin
    };

    console.log("Submitting Ambher medical record:", medicalRecordData);

    const response = await fetch('/api/patientdemographics/ambher-medical-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        patientEmail: selectedpatientmedicalrecord.patientemail,
        medicalRecord: medicalRecordData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Check for specific validation errors
      if (errorData.errors && Array.isArray(errorData.errors)) {
        // If there are validation errors, show the first one
        throw new Error(errorData.errors[0].message || errorData.errors[0]);
      } else if (errorData.message) {
        throw new Error(errorData.message);
      } else if (response.status === 400) {
        throw new Error('Please check all required fields are filled correctly');
      } else {
        throw new Error('Failed to save medical record');
      }
    }

    const result = await response.json();
    console.log('Ambher medical record saved successfully:', result);

    // Reset form and close modal
    e.target.reset();
    setshowaddambherclinicmedicalrecord(false);
    setselectedambherrecord(null);
    setgeneratedAmbherCaseNumber('');
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        // Fetch the updated patient record directly from the API
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record with new Ambher medical record:', updatedPatientRecord);
          console.log('New Ambher medical records count:', updatedPatientRecord.patientmedicalrecordambher?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    // Show success toast
    showAmbherSuccessToast('Medical record saved successfully!');

    // Clear the generated case number after successful submission
    setgeneratedAmbherCaseNumber('');

    // Refresh patient demographics in the background
    fetchDemographicsData(true);

  } catch (error) {
    console.error('Error submitting Ambher medical record:', error);
    
    // Parse error message for better user feedback
    let errorMessage = 'Error saving medical record';
    
    if (error.message) {
      if (error.message.includes('400')) {
        errorMessage = 'Please check all required fields are filled correctly';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Form validation failed - please check all required fields';
      } else if (error.message.includes('required')) {
        errorMessage = 'Please fill in all required fields';
      } else if (error.message.includes('Invalid')) {
        errorMessage = 'Invalid data provided - please check your inputs';
      } else {
        errorMessage = 'Error saving medical record: ' + error.message;
      }
    }
    
    // Show error toast
    showAmbherErrorToast(errorMessage);
  }
};

// Function to handle viewing/editing existing Ambher medical record
const viewAmbherRecord = (record) => {
  console.log('=== viewAmbherRecord START ===');
  console.log('Input record:', record);
  console.log('Record type:', record.recordType);
  
  // Get current user's clinic
  const currentUserClinic = staffclinic || ownerownedclinic || localStorage.getItem('staffclinic') || localStorage.getItem('ownerownedclinic');
  console.log('Current user clinic:', currentUserClinic);
  console.log('Record added by clinic:', record.addedbyclinic);
  
  // Check if current user's clinic can edit this record
  const isReadOnly = record.addedbyclinic !== currentUserClinic;
  console.log('Is Ambher form read-only:', isReadOnly);
  
  // Clear any Bautista modal state first
  console.log('Clearing Bautista modal state...');
  setshowaddbautistaclinicmedicalrecord(false);
  setselectedbautistarecord(null);
  setisbautistaformreadonly(false);
  
  // Use setTimeout to ensure state updates are processed
  setTimeout(() => {
    // Ensure the record has the correct structure for Ambher form
    const ambherRecord = {
      ...record,
      ambheropticalcaseno: record.ambheropticalcaseno || record.caseNo // Ensure case number is properly mapped
    };
    
    console.log('Processed Ambher record:', ambherRecord);
    console.log('Ambher case number:', ambherRecord.ambheropticalcaseno);
    
    setselectedambherrecord(ambherRecord);
    setisambherformreadonly(isReadOnly);
    
    // Set Ambher case number validation state for editing
    setAmbherCaseNoValue(ambherRecord.ambheropticalcaseno || ambherRecord.caseNo || '');
    setAmbherCaseNoValidation({
      isChecking: false,
      isValid: true,
      message: ''
    });
    
    console.log('Setting Ambher modal to true...');
    setshowaddambherclinicmedicalrecord(true);
    
    console.log('=== viewAmbherRecord END ===');
  }, 10); // Small delay to ensure state updates
};

// Function to generate next available Ambher case number
const generateNextAmbherCaseNumber = async () => {
  try {
    const response = await fetch('/api/patientdemographics/next-ambher-case-number', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to generate case number');
    }

    const result = await response.json();
    return result.nextCaseNumber;
  } catch (error) {
    console.error('Error generating Ambher case number:', error);
    // Fallback to timestamp-based case number (simple numeric format)
    return Date.now().toString().slice(-6); // Use last 6 digits of timestamp
  }
};

// Function to handle opening new Ambher medical record form
const openNewAmbherMedicalRecordForm = async () => {
  const nextCaseNumber = await generateNextAmbherCaseNumber();
  setgeneratedAmbherCaseNumber(nextCaseNumber);
  setselectedambherrecord(null);
  // Initialize case number validation state
  setAmbherCaseNoValue(nextCaseNumber);
  setAmbherCaseNoValidation({
    isChecking: false,
    isValid: true,
    message: ''
  });
  setshowaddambherclinicmedicalrecord(true);
};

// Function to edit existing Ambher medical record
const editAmbherRecord = (record) => {
  console.log('Editing Ambher medical record:', record);
  setselectedambherrecord(record);
  // Set case number value for editing
  setAmbherCaseNoValue(record.patientmedicalrecordambher?.ambheropticalcaseno || '');
  setAmbherCaseNoValidation({
    isChecking: false,
    isValid: true,
    message: ''
  });
  setshowaddambherclinicmedicalrecord(true);
};

// Update Ambher Medical Record Function
const updateAmbherMedicalRecord = async (e) => {
  e.preventDefault();
  
  try {
    if (!selectedambherrecord || !selectedpatientmedicalrecord) {
      showAmbherErrorToast('Missing record information');
      return;
    }

    const formData = new FormData(e.target);
    
    // Extract form data (same structure as submitAmbherMedicalRecord)
    const medicalRecordData = {
      ambheropticalcaseno: formData.get('ambherCaseNo'),
      patientstatus: formData.get('patientstatus'),
      patientphilhealthcategory: formData.get('patientphilhealthcategory'),
      hmo: formData.get('hmo'),
      
      // Prescription data
      refraction: {
        od: {
          sphere: formData.get('refraction_od_sphere'),
          cylinder: formData.get('refraction_od_cylinder'),
          axis: formData.get('refraction_od_axis')
        },
        os: {
          sphere: formData.get('refraction_os_sphere'),
          cylinder: formData.get('refraction_os_cylinder'),
          axis: formData.get('refraction_os_axis')
        },
        pd: formData.get('refraction_pd'),
        bc: formData.get('refraction_bc'),
        dia: formData.get('refraction_dia'),
        tint: formData.get('refraction_tint'),
        type: formData.get('refraction_type')
      },
      
      // Additional notes/remarks
      remarks: formData.get('remarks'),
      lensRecommendation: formData.get('lensRecommendation')
    };

    console.log("Updating Ambher medical record:", medicalRecordData);
    console.log("Record ID:", selectedambherrecord._id);

    const response = await fetch(`/api/patientdemographics/ambher-medical-records/${selectedpatientmedicalrecord.patientemail}/${selectedambherrecord._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(medicalRecordData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update medical record');
    }

    const result = await response.json();
    console.log('Ambher medical record updated successfully:', result);

    // Reset states and close modal
    setselectedambherrecord(null);
    setshowaddambherclinicmedicalrecord(false);
    setgeneratedAmbherCaseNumber('');
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        // Fetch the updated patient record directly from the API
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after editing Ambher medical record:', updatedPatientRecord);
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    // Show success toast
    showAmbherSuccessToast('Medical record updated successfully!');

    // Refresh patient demographics in the background
    fetchDemographicsData(true);

  } catch (error) {
    console.error('Error updating Ambher medical record:', error);
    
    // Show error toast
    showAmbherErrorToast('Error updating medical record: ' + error.message);
  }
};

// Function to delete Ambher medical record
const deletepatientAmbherMedicalRecord = async () => {
  try {
    if (!selectedambherrecordtodelete || !selectedpatientmedicalrecord) return;

    console.log('Deleting Ambher medical record:', selectedambherrecordtodelete._id);
    console.log('Patient email:', selectedpatientmedicalrecord.patientemail);

    const deleteUrl = `/api/patientdemographics/ambher-medical-records/${selectedpatientmedicalrecord.patientemail}/${selectedambherrecordtodelete._id}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete medical record');
    }

    const result = await response.json();
    console.log('Ambher medical record deleted successfully:', result);

    // Close delete dialog
    setshowdeleteambhermedicaldialog(false);
    setselectedambherrecordtodelete(null);
    
    // Update the selected patient record with the refreshed data
    if (selectedpatientmedicalrecord?.patientemail) {
      try {
        const updatedPatientResponse = await fetch(`/api/patientdemographics/patientemail/${selectedpatientmedicalrecord.patientemail}`, {
          headers: {
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
        
        if (updatedPatientResponse.ok) {
          const updatedPatientRecord = await updatedPatientResponse.json();
          setselectedpatientmedicalrecord(updatedPatientRecord);
          console.log('Updated selected patient record after deleting Ambher medical record:', updatedPatientRecord);
        }
      } catch (error) {
        console.error('Error fetching updated patient record:', error);
      }
    }
    
    // Show success toast
    showAmbherSuccessToast('Medical record deleted successfully!');

    // Refresh patient demographics in the background
    fetchDemographicsData(true);

  } catch (error) {
    console.error('Error deleting Ambher medical record:', error);
    
    // Show error toast
    showAmbherErrorToast('Error deleting medical record: ' + error.message);
  }
};

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
  // Skip fetching if user is Bautista-only (except for Admin)
  if (isBautistaOnlyUser() && currentuserloggedin !== "Admin") {
    setloadingambherinventorycategorylist(false);
    return;
  }
  
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
  // Skip fetching if user is Ambher-only (except for Admin)
  if (isAmbherOnlyUser() && currentuserloggedin !== "Admin") {
    setloadingbautistainventorycategorylist(false);
    return;
  }
  
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
const [ambherinventoryproductimagesuploading, setambherinventoryproductimagesuploading] = useState(false);
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
  let filteredProducts;
  if (quantitySortingProducts === 'Outofstock') {
    filteredProducts = sortedFilteredAmbherProducts.filter(product => (product.ambherinventoryproductquantity || 0) === 0);
  } else if (quantitySortingProducts === 'LowStock') {
    filteredProducts = sortedFilteredAmbherProducts.filter(product => {
      const qty = product.ambherinventoryproductquantity || 0;
      return qty >= 4 && qty <= 6;
    });
  } else if (quantitySortingProducts === 'CriticalStock') {
    filteredProducts = sortedFilteredAmbherProducts.filter(product => {
      const qty = product.ambherinventoryproductquantity || 0;
      return qty >= 1 && qty <= 3;
    });
  } else if (quantitySortingProducts === 'Archived') {
    filteredProducts = sortedFilteredAmbherProducts.filter(product => product.isArchived === true);
  } else {
    filteredProducts = sortedFilteredAmbherProducts;
  }
  
  // Sort to place archived products at the end (only if not specifically filtering for archived products)
  if (quantitySortingProducts !== 'Archived') {
    return filteredProducts.sort((a, b) => {
      if (a.isArchived && !b.isArchived) return 1; // a is archived, b is not - a comes after b
      if (!a.isArchived && b.isArchived) return -1; // a is not archived, b is - a comes before b
      return 0; // Both have same archive status, maintain current order
    });
  }
  
  return filteredProducts;
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
    alert("Please select image files (JPG / PNG)");
    return;
  }

  if(file.size > maximagefile * 1024 * 1024) {
    alert("Please select images under 2MB");
    return;
  }
}

// Set loading state to true when starting upload
setambherinventoryproductimagesuploading(true);

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

  // Upload compressed images to Cloudinary
  try {
    const uploadResult = await uploadProductImages(compressedimages, 'temp', 'ambher');
    
    // Debug logging
    console.log('Upload result:', uploadResult);
    console.log('Image URLs:', uploadResult.data?.imageUrls);
    
    // Use Cloudinary URLs as preview images instead of BASE64
    const cloudinaryUrls = uploadResult.data?.imageUrls;
    
    // Ensure cloudinaryUrls is an array before spreading
    const urlsArray = Array.isArray(cloudinaryUrls) ? cloudinaryUrls : (cloudinaryUrls ? [cloudinaryUrls] : []);
    
    console.log('URLs array:', urlsArray);
    
    setaddambherinventoryproductimageselectedimages(prev => [...prev, ...compressedimages]);
    setaddambherinventoryproductimagepreviewimages(prev => {
      const updated = [...prev, ...urlsArray];
      console.log('Updated preview images:', updated);
      return updated;
    });
    setcurrentimageindex(0);
    
  } catch (uploadError) {
    console.error("Cloudinary upload failed: ", uploadError.message);
    alert("Image upload failed. Please try again.");
    return;
  }

}catch(error){
  console.error("Image compression failed: ", error.message);
  alert("Image compression failed");
} finally {
  // Always set loading state to false when finished (success or error)
  setambherinventoryproductimagesuploading(false);
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
  // Skip fetching if user is Bautista-only (except for Admin)
  if (isBautistaOnlyUser() && currentuserloggedin !== "Admin") {
    setambherloadingproducts(false);
    return;
  }
  
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
    ambherinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || [],



    ambherinventoryproductaddedbyprofilepicture: currentuserdata.profilepicture || '',
    ambherinventoryproductaddedbylastname: currentuserdata.lastname || '',
    ambherinventoryproductaddedbyfirstname: currentuserdata.firstname || '',
    ambherinventoryproductaddedbymiddlename: currentuserdata.middlename || '',
    ambherinventoryproductaddedbytype: currentuserdata.type || '',
    ambherinventoryproductaddedbyemail: currentuserdata.email || '',
     ambherinventoryproductwishlistcount: 0 ,



  }

  console.log('=== SUBMISSION DEBUG ===');
  console.log('ambherinventoryproductdata:', ambherinventoryproductdata);
  console.log('currentusertoken:', currentusertoken ? 'EXISTS' : 'MISSING');
  console.log('addambherinventoryproductimagepreviewimages length:', addambherinventoryproductimagepreviewimages.length);
  console.log('Form data values:');
  console.log('- category:', ambherinventorycategorynamebox);
  console.log('- name:', addambherinventoryproductname);
  console.log('- brand:', addambherinventoryproductbrand);
  console.log('- model:', addambherinventoryproductmodelnumber);
  console.log('- price:', addambherinventoryproductprice);
  console.log('- quantity:', addambherinventoryproductquantity);
  console.log('========================');
  
  const response = await fetch(`/api/ambherinventoryproduct`,{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    },
    body: JSON.stringify(ambherinventoryproductdata)
  });

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if(!response.ok){
    // Try to get the error message from the response
    let errorMessage = `Response fetching error! Error: ${response.status}`;
    try {
      const errorData = await response.json();
      console.log('Server error response:', errorData);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (parseError) {
      console.log('Could not parse error response:', parseError);
      // Try to get text response
      try {
        const errorText = await response.text();
        console.log('Server error text:', errorText);
        if (errorText) errorMessage = errorText;
      } catch (textError) {
        console.log('Could not get error text:', textError);
      }
    }
    throw new Error(errorMessage);
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
    ambherinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || [],



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

// Archive Ambher Product Handler
const handleArchiveAmbherProduct = async (product) => {
  try {
    const response = await fetch(`/api/ambherinventoryproduct/${product.ambherinventoryproductid}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to archive product: ${response.status}`);
    }

    const result = await response.json();
    
    // Update the product in the local state
    setambherinventoryproducts(prev => 
      prev.map(p => 
        p.ambherinventoryproductid === product.ambherinventoryproductid 
          ? { ...p, isArchived: true }
          : p
      )
    );

    // Update the selected product if it's the same one
    if (selectedambherproduct?.ambherinventoryproductid === product.ambherinventoryproductid) {
      setselectedambherproduct(prev => ({ ...prev, isArchived: true }));
    }


  } catch (error) {
    console.error('Error archiving ambher product:', error);
    alert('Failed to archive product');
  }
};

// Unarchive Ambher Product Handler
const handleUnarchiveAmbherProduct = async (product) => {
  try {
    const response = await fetch(`/api/ambherinventoryproduct/${product.ambherinventoryproductid}/unarchive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to unarchive product: ${response.status}`);
    }

    const result = await response.json();
    
    // Update the product in the local state
    setambherinventoryproducts(prev => 
      prev.map(p => 
        p.ambherinventoryproductid === product.ambherinventoryproductid 
          ? { ...p, isArchived: false }
          : p
      )
    );

    // Update the selected product if it's the same one
    if (selectedambherproduct?.ambherinventoryproductid === product.ambherinventoryproductid) {
      setselectedambherproduct(prev => ({ ...prev, isArchived: false }));
    }


  } catch (error) {
    console.error('Error unarchiving ambher product:', error);
    alert('Failed to unarchive product');
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
const [bautistainventoryproductimagesuploading, setbautistainventoryproductimagesuploading] = useState(false);
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
  let filteredProducts;
  if (bautistaQuantitySortingProducts === 'Outofstock') {
    filteredProducts = sortedFilteredBautistaProducts.filter(product => (product.bautistainventoryproductquantity || 0) === 0);
  } else if (bautistaQuantitySortingProducts === 'LowStock') {
    filteredProducts = sortedFilteredBautistaProducts.filter(product => {
      const qty = product.bautistainventoryproductquantity || 0;
      return qty >= 4 && qty <= 6;
    });
  } else if (bautistaQuantitySortingProducts === 'CriticalStock') {
    filteredProducts = sortedFilteredBautistaProducts.filter(product => {
      const qty = product.bautistainventoryproductquantity || 0;
      return qty >= 1 && qty <= 3;
    });
  } else if (bautistaQuantitySortingProducts === 'Archived') {
    filteredProducts = sortedFilteredBautistaProducts.filter(product => product.isArchived === true);
  } else {
    filteredProducts = sortedFilteredBautistaProducts;
  }
  
  // Sort to place archived products at the end (only if not specifically filtering for archived products)
  if (bautistaQuantitySortingProducts !== 'Archived') {
    return filteredProducts.sort((a, b) => {
      if (a.isArchived && !b.isArchived) return 1; // a is archived, b is not - a comes after b
      if (!a.isArchived && b.isArchived) return -1; // a is not archived, b is - a comes before b
      return 0; // Both have same archive status, maintain current order
    });
  }
  
  return filteredProducts;
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
              alert("Please select image files (JPG / PNG)");
              return;
            }
        
            if(file.size > maximagefile * 1024 * 1024) {
              alert("Please select images under 2MB");
              return;
            }
          }
        
          // Set loading state to true when starting upload
          setbautistainventoryproductimagesuploading(true);
        
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
        
            // Upload compressed images to Cloudinary
            try {
              const uploadResult = await uploadProductImages(compressedimages, 'temp', 'bautista');
              
              // Debug logging
              console.log('Bautista Upload result:', uploadResult);
              console.log('Bautista Image URLs:', uploadResult.data?.imageUrls);
              
              // Use Cloudinary URLs as preview images instead of BASE64
              const cloudinaryUrls = uploadResult.data?.imageUrls;
              
              // Ensure cloudinaryUrls is an array before spreading
              const urlsArray = Array.isArray(cloudinaryUrls) ? cloudinaryUrls : (cloudinaryUrls ? [cloudinaryUrls] : []);
              
              console.log('Bautista URLs array:', urlsArray);
              
              setaddbautistainventoryproductimageselectedimages(prev => [...prev, ...compressedimages]);
              setaddbautistainventoryproductimagepreviewimages(prev => {
                const updated = [...prev, ...urlsArray];
                console.log('Bautista Updated preview images:', updated);
                return updated;
              });
              setbautistacurrentimageindex(0);
              
            } catch (uploadError) {
              console.error("Cloudinary upload failed: ", uploadError.message);
              alert("Image upload failed. Please try again.");
              return;
            }
        
          }catch(error){
            console.error("Image compression failed: ", error.message);
            alert("Image compression failed");
          } finally {
            // Always set loading state to false when finished (success or error)
            setbautistainventoryproductimagesuploading(false);
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
            // Skip fetching if user is Ambher-only (except for Admin)
            if (isAmbherOnlyUser() && currentuserloggedin !== "Admin") {
              setbautistaloadingproducts(false);
              return;
            }
            
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

           if (!bautistainventorycategorynamebox || bautistainventorycategorynamebox.trim() === '') {
            alert("Please select a product category");
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
              bautistainventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || [],
        
        
        
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
              bautistainventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || [],
        
        
        
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

        // Archive Bautista Product Handler
        const handleArchiveBautistaProduct = async (product) => {
          try {
            const response = await fetch(`/api/bautistainventoryproduct/${product.bautistainventoryproductid}/archive`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (!response.ok) {
              throw new Error(`Failed to archive product: ${response.status}`);
            }

            const result = await response.json();
            
            // Update the product in the local state
            setbautistainventoryproducts(prev => 
              prev.map(p => 
                p.bautistainventoryproductid === product.bautistainventoryproductid 
                  ? { ...p, isArchived: true }
                  : p
              )
            );

            // Update the selected product if it's the same one
            if (selectedbautistaproduct?.bautistainventoryproductid === product.bautistainventoryproductid) {
              setselectedbautistaproduct(prev => ({ ...prev, isArchived: true }));
            }

          } catch (error) {
            console.error('Error archiving bautista product:', error);
            alert('Failed to archive product');
          }
        };

        // Unarchive Bautista Product Handler
        const handleUnarchiveBautistaProduct = async (product) => {
          try {
            const response = await fetch(`/api/bautistainventoryproduct/${product.bautistainventoryproductid}/unarchive`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (!response.ok) {
              throw new Error(`Failed to unarchive product: ${response.status}`);
            }

            const result = await response.json();
            
            // Update the product in the local state
            setbautistainventoryproducts(prev => 
              prev.map(p => 
                p.bautistainventoryproductid === product.bautistainventoryproductid 
                  ? { ...p, isArchived: false }
                  : p
              )
            );

            // Update the selected product if it's the same one
            if (selectedbautistaproduct?.bautistainventoryproductid === product.bautistainventoryproductid) {
              setselectedbautistaproduct(prev => ({ ...prev, isArchived: false }));
            }


          } catch (error) {
            console.error('Error unarchiving bautista product:', error);
            alert('Failed to unarchive product');
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
    product => !product.isArchived && // Exclude archived products
              product.ambherinventoryproductquantity > 0 && 
              product.ambherinventoryproductquantity <= 3
  );
  const lowStock = ambherinventoryproducts.filter(
    product => !product.isArchived && // Exclude archived products
              product.ambherinventoryproductquantity >= 4 && 
              product.ambherinventoryproductquantity <= 6
  );
  const outOfStock = ambherinventoryproducts.filter(
    product => !product.isArchived && // Exclude archived products
              product.ambherinventoryproductquantity === 0
  );
  setcliniccriticalstockProducts(criticalStock);
  setcliniclowstockProducts(lowStock);
  setclinicoutofstockProducts(outOfStock);
} else if (activeinventorytable === 'bautistainventorytable') {
  const criticalStock = bautistainventoryproducts.filter(
    product => !product.isArchived && // Exclude archived products
              product.bautistainventoryproductquantity > 0 && 
              product.bautistainventoryproductquantity <= 3
  );
  const lowStock = bautistainventoryproducts.filter(
    product => !product.isArchived && // Exclude archived products
              product.bautistainventoryproductquantity >= 4 && 
              product.bautistainventoryproductquantity <= 6
  );
  const outOfStock = bautistainventoryproducts.filter(
    product => !product.isArchived && // Exclude archived products
              product.bautistainventoryproductquantity === 0
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

// Performance optimizations
const [ordersCache, setOrdersCache] = useState(new Map());
const [lastFetchTime, setLastFetchTime] = useState(0);
const CACHE_DURATION = 30000; // 30 seconds cache

// Pagination for performance
const [ambherCurrentPage, setAmbherCurrentPage] = useState(1);
const [bautistaCurrentPage, setBautistaCurrentPage] = useState(1);
const ORDERS_PER_PAGE = 10; // Limit rows per page for performance
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
const [orderambherinventoryproductprice , setorderambherinventoryproductprice ] = useState("");
const [orderambherinventoryproductquantity , setorderambherinventoryproductquantity ] = useState("");
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
const [isMarkingOrderComplete, setIsMarkingOrderComplete] = useState(false);
const [sendingSmsForOrder, setSendingSmsForOrder] = useState(null); // Track which order is having SMS sent


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
    const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${selectedorderambherproduct.ambherinventoryproductid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch sold count");
    const data = await response.json();
    setambherproductsoldCount(data.sold || 0);
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

fetchSoldCount();
}, [selectedorderambherproduct, currentusertoken]);





//Fetching bautistaproducts sold count  
useEffect(() => {
const fetchSoldCount = async () => {
  if (!selectedorderbautistaproduct?.bautistainventoryproductid) return;

  try {
    const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${selectedorderbautistaproduct.bautistainventoryproductid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      }
    });
    if (!response.ok) throw new Error("Failed to fetch sold count");
    const data = await response.json();
    setbautistaproductsoldCount(data.sold || 0);
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

fetchSoldCount();
}, [selectedorderbautistaproduct, currentusertoken]);





//Fetching ambherproducts sold count for every card display 
useEffect(() => {
const fetchAllSoldCounts = async () => {
  const counts = {};

  await Promise.all(
    ambherinventoryproducts.map(async (product) => {
      try {
        const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${product.ambherinventoryproductid}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
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
}, [ambherinventoryproducts, currentusertoken]);








//Fetching bautistaproducts sold count for every card display 
useEffect(() => {
const fetchAllSoldCounts = async () => {
  const counts = {};

  await Promise.all(
    bautistainventoryproducts.map(async (product) => {
      try {
        const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${product.bautistainventoryproductid}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentusertoken}`
          }
        });
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
}, [bautistainventoryproducts, currentusertoken]);




















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

// UseEffect for PDF Toast
useEffect(() => {
  if (pdfToast) {
    setPdfProgressWidth('0%');
    setPdfToastClosing(false);

    const progresstimer = setTimeout(() => {
      setPdfProgressWidth('100%');
    }, 50);

    // Close toast after 4 seconds
    const toasttimer = setTimeout(() => {
      setPdfToastClosing(true);
      setTimeout(() => {
        setPdfToast(false);
        setPdfProgressWidth('0%');
      }, 300);
    }, 4000);

    return () => {
      clearTimeout(progresstimer);
      clearTimeout(toasttimer);
    }
  }
}, [pdfToast]);

// UseEffect for Add Patient Profile Toast
useEffect(() => {
  if (addPatientProfileToast) {
    setAddPatientProfileProgressWidth('0%');
    setAddPatientProfileToastClosing(false);

    const progresstimer = setTimeout(() => {
      setAddPatientProfileProgressWidth('100%');
    }, 50);

    // Close toast after 4 seconds
    const toasttimer = setTimeout(() => {
      setAddPatientProfileToastClosing(true);
      setTimeout(() => {
        setAddPatientProfileToast(false);
        setAddPatientProfileProgressWidth('0%');
      }, 300);
    }, 4000);

    return () => {
      clearTimeout(progresstimer);
      clearTimeout(toasttimer);
    }
  }
}, [addPatientProfileToast]);

// UseEffect for Update Patient Profile Toast
useEffect(() => {
  if (updatePatientProfileToast) {
    setUpdatePatientProfileProgressWidth('0%');
    setUpdatePatientProfileToastClosing(false);

    const progresstimer = setTimeout(() => {
      setUpdatePatientProfileProgressWidth('100%');
    }, 50);

    // Close toast after 4 seconds
    const toasttimer = setTimeout(() => {
      setUpdatePatientProfileToastClosing(true);
      setTimeout(() => {
        setUpdatePatientProfileToast(false);
        setUpdatePatientProfileProgressWidth('0%');
      }, 300);
    }, 4000);

    return () => {
      clearTimeout(progresstimer);
      clearTimeout(toasttimer);
    }
  }
}, [updatePatientProfileToast]);

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

  // Function to check if pickup date has passed and update order status
  const checkAndUpdatePickupStatus = useCallback(async (orders, clinicType) => {
    // Ensure orders is an array
    if (!Array.isArray(orders)) {
      console.warn(`⚠️ ${clinicType} orders is not an array:`, orders);
      return [];
    }
    
    const currentPhilippinesDate = getPhilippinesDate();
    const updatedOrders = [];
    let updatedCount = 0;
    
    console.log(`🔍 Checking ${orders.length} ${clinicType} orders for status updates...`);
    
    for (const order of orders) {
      let shouldUpdate = false;
      let pickupDate;
      let currentStatus;
      
      if (clinicType === 'ambher') {
        pickupDate = order.patientorderambherproductchosenpickupdate;
        currentStatus = order.patientorderambherstatus;
      } else {
        pickupDate = order.patientorderbautistaproductchosenpickupdate;
        currentStatus = order.patientorderbautistastatus;
      }
      
      // Log current order status for debugging
      console.log(`📋 Order ${clinicType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid}: Current status = "${currentStatus}"`);
      
      // Skip any orders that are not "Pending" - protect completed orders
      if (currentStatus !== 'Pending') {
        console.log(`⏭️ Skipping order ${clinicType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid}: Status is "${currentStatus}" (not Pending)`);
        updatedOrders.push(order);
        continue;
      }
      
      // Only update orders that are exactly "Pending" - never touch "Ready for Pickup", "Completed", or other statuses
      if (pickupDate && 
          pickupDate !== 'Later' && 
          pickupDate !== 'Now') {
        
        // Convert pickup date to comparable format
        const pickupDateFormatted = new Date(pickupDate).toLocaleDateString('en-CA');
        
        console.log(`📦 Order ${clinicType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid}: Pickup date ${pickupDateFormatted} vs Current date ${currentPhilippinesDate}`);
        
        // If pickup date is today or has passed, update status
        if (pickupDateFormatted <= currentPhilippinesDate) {
          shouldUpdate = true;
          console.log(`✅ Order needs status update: Pickup date ${pickupDateFormatted} has passed!`);
        }
      }
      
      if (shouldUpdate) {
        try {
          // Update the order status in the database
          const updateUrl = clinicType === 'ambher' 
            ? `/api/patientorderambher/${order.patientorderambherid}`
            : `/api/patientorderbautista/${order.patientorderbautistaid}`;
            
          const statusField = clinicType === 'ambher'
            ? 'patientorderambherstatus'
            : 'patientorderbautistastatus';
            
          const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentusertoken}`
            },
            body: JSON.stringify({
              [statusField]: 'Ready for Pickup'
            })
          });

          if (response.ok) {
            // Update the local order object
            const updatedOrder = { 
              ...order, 
              [statusField]: 'Ready for Pickup'
            };
            updatedOrders.push(updatedOrder);
            updatedCount++;
            console.log(`✅ Order ${clinicType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid} automatically updated to "Ready for Pickup"`);
          } else {
            console.error(`❌ Failed to update order ${clinicType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid}`);
            updatedOrders.push(order);
          }
        } catch (error) {
          console.error(`❌ Error updating order status:`, error);
          updatedOrders.push(order);
        }
      } else {
        updatedOrders.push(order);
      }
    }
    
    console.log(`📊 ${clinicType} orders processed: ${updatedCount} out of ${orders.length} orders updated to "Ready for Pickup"`);
    return updatedOrders;
  }, [currentusertoken]);

  // Optimized fetch function with caching and parallel requests
  const fetchAllOrdersOptimized = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    const cacheKey = `orders_${currentusertoken}`;
    
    // Check cache first (unless force refresh)
    if (!forceRefresh && ordersCache.has(cacheKey) && (now - lastFetchTime) < CACHE_DURATION) {
      const cachedData = ordersCache.get(cacheKey);
      setambherOrders(cachedData.ambher || []);
      setbautistaOrders(cachedData.bautista || []);
      setLoadingAmbherOrders(false);
      setLoadingBautistaOrders(false);
      return;
    }

    try {
      setLoadingAmbherOrders(true);
      setLoadingBautistaOrders(true);
      
      // Check clinic filtering - only fetch relevant data unless Admin
      const shouldFetchAmbher = !isBautistaOnlyUser() || currentuserloggedin === "Admin";
      const shouldFetchBautista = !isAmbherOnlyUser() || currentuserloggedin === "Admin";
      
      // Parallel API calls for maximum speed - only fetch what's needed
      const apiCalls = [];
      
      if (shouldFetchAmbher) {
        apiCalls.push(
          fetch(`/api/patientorderambher`, {
            headers: {
              'Authorization': `Bearer ${currentusertoken}`,
              'Cache-Control': 'no-cache'
            }
          })
        );
      } else {
        apiCalls.push(Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
      }
      
      if (shouldFetchBautista) {
        apiCalls.push(
          fetch(`/api/patientorderbautista`, {
            headers: {
              'Authorization': `Bearer ${currentusertoken}`,
              'Cache-Control': 'no-cache'
            }
          })
        );
      } else {
        apiCalls.push(Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
      }
      
      const [ambherResponse, bautistaResponse] = await Promise.all(apiCalls);

      if (!ambherResponse.ok || !bautistaResponse.ok) {
        throw new Error('Failed to fetch orders');
      }

      // Parallel JSON parsing
      const [ambherData, bautistaData] = await Promise.all([
        ambherResponse.json(),
        bautistaResponse.json()
      ]);

      // Handle paginated response format - extract orders array from pagination response
      const ambherOrders = Array.isArray(ambherData) ? ambherData : (ambherData?.orders || []);
      const bautistaOrders = Array.isArray(bautistaData) ? bautistaData : (bautistaData?.orders || []);

      // Check and update order statuses based on pickup dates
      const processedAmbherData = await checkAndUpdatePickupStatus(ambherOrders, 'ambher');
      const processedBautistaData = await checkAndUpdatePickupStatus(bautistaOrders, 'bautista');

      // Update state
      setambherOrders(processedAmbherData);
      setbautistaOrders(processedBautistaData);

      // Update cache
      const newCache = new Map(ordersCache);
      newCache.set(cacheKey, {
        ambher: processedAmbherData,
        bautista: processedBautistaData
      });
      setOrdersCache(newCache);
      setLastFetchTime(now);

    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingAmbherOrders(false);
      setLoadingBautistaOrders(false);
    }
  }, [currentusertoken, ordersCache, lastFetchTime, setOrdersCache, setLastFetchTime, checkAndUpdatePickupStatus, currentuserloggedin, isAmbherOnlyUser, isBautistaOnlyUser]);

  // Separate functions for backward compatibility
  const fetchambherOrders = useCallback(async () => {
    await fetchAllOrdersOptimized();
  }, [fetchAllOrdersOptimized]);

  const fetchbautistaOrders = useCallback(async () => {
    await fetchAllOrdersOptimized();
  }, [fetchAllOrdersOptimized]);

useEffect(() => {
  // Initial load - fetch with status check
  fetchAllOrdersOptimized(false); 
}, [fetchAllOrdersOptimized]);

// Periodic status check - runs every hour to catch any missed updates
useEffect(() => {
  // Function to check for status updates
  const performPeriodicStatusCheck = async () => {
    console.log('🕐 Performing periodic order status check...');
    
    // Check Ambher orders
    if (ambherorders.length > 0) {
      const updatedAmbherOrders = await checkAndUpdatePickupStatus(ambherorders, 'ambher');
      const hasAmbherUpdates = updatedAmbherOrders.some((order, index) => 
        order.patientorderambherstatus !== ambherorders[index]?.patientorderambherstatus
      );
      
      if (hasAmbherUpdates) {
        setambherOrders(updatedAmbherOrders);
        console.log('✅ Ambher orders status updated');
      }
    }
    
    // Check Bautista orders
    if (bautistaorders.length > 0) {
      const updatedBautistaOrders = await checkAndUpdatePickupStatus(bautistaorders, 'bautista');
      const hasBautistaUpdates = updatedBautistaOrders.some((order, index) => 
        order.patientorderbautistastatus !== bautistaorders[index]?.patientorderbautistastatus
      );
      
      if (hasBautistaUpdates) {
        setbautistaOrders(updatedBautistaOrders);
        console.log('✅ Bautista orders status updated');
      }
    }
  };

  // Set up interval for periodic checks (every hour = 3600000ms)
  const statusCheckInterval = setInterval(performPeriodicStatusCheck, 3600000);
  
  // Also run immediately after component mount (with a small delay to ensure orders are loaded)
  const immediateCheck = setTimeout(performPeriodicStatusCheck, 5000);

  // Cleanup interval on component unmount
  return () => {
    clearInterval(statusCheckInterval);
    clearTimeout(immediateCheck);
  };
}, [ambherorders, bautistaorders, checkAndUpdatePickupStatus, setambherOrders, setbautistaOrders]);

// Optimized filtering with useMemo for performance
const filteredambherOrders = useMemo(() => {
  return ambherorders.filter(order => {
    const matchesFilter = ambherfilter === 'All' || order.patientorderambherstatus === ambherfilter;
    const searchTerm = searchambherTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      order.patientorderambherproductname.toLowerCase().includes(searchTerm) ||
      order.patientfirstname.toLowerCase().includes(searchTerm) ||
      order.patientlastname.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
}, [ambherorders, ambherfilter, searchambherTerm]);

const filteredbautistaOrders = useMemo(() => {
  return bautistaorders.filter(order => {
    const matchesFilter = bautistafilter === 'All' || order.patientorderbautistastatus === bautistafilter;
    const searchTerm = searchbautistaTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      order.patientorderbautistaproductname.toLowerCase().includes(searchTerm) ||
      order.patientfirstname.toLowerCase().includes(searchTerm) ||
      order.patientlastname.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
}, [bautistaorders, bautistafilter, searchbautistaTerm]);

// Paginated data for performance
const paginatedAmbherOrders = useMemo(() => {
  const startIndex = (ambherCurrentPage - 1) * ORDERS_PER_PAGE;
  return filteredambherOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
}, [filteredambherOrders, ambherCurrentPage, ORDERS_PER_PAGE]);

const paginatedBautistaOrders = useMemo(() => {
  const startIndex = (bautistaCurrentPage - 1) * ORDERS_PER_PAGE;
  return filteredbautistaOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
}, [filteredbautistaOrders, bautistaCurrentPage, ORDERS_PER_PAGE]);

// Optimized refresh function with cache invalidation
const refreshOrdersWithStatusCheck = useCallback(async () => {
  console.log('🔄 Refreshing orders with immediate status check...');
  
  try {
    // Force refresh bypasses cache and includes status check
    await fetchAllOrdersOptimized(true);
    console.log('✅ Orders refreshed with latest status updates');
  } catch (error) {
    console.error('❌ Error refreshing orders:', error);
  }
}, [fetchAllOrdersOptimized]);


const formatorderDates = (formattednewdate) => {
  const datedata = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(formattednewdate).toLocaleDateString(undefined, datedata);
};

// Function to get current Philippines date
const getPhilippinesDate = () => {
  const philippinesDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });
  console.log(`📅 Current Philippines date: ${philippinesDate}`);
  return philippinesDate; // Returns YYYY-MM-DD format
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
      return 'bg-orange-200 text-orange-900';
    case 'Declined':
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
    const customerName = `${orderData.patientfirstname} ${orderData.patientlastname}`;
    const customerEmail = orderData.patientemail;
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
      pdf.text('✓ FULLY PAID', pageWidth / 2, yPos, { align: 'center' });
    } else {
      pdf.setTextColor(196, 54, 54); // Red
      pdf.text('⚠ PARTIAL PAYMENT', pageWidth / 2, yPos, { align: 'center' });
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

// Function to send SMS notification for pickup date changes
const sendPickupDateSMS = useCallback(async (orderDetails, newPickupDate, isUpdate = false) => {
  try {
    if (!orderDetails || !newPickupDate) {
      console.warn('⚠️ Missing order details or pickup date for SMS notification');
      return;
    }

    const isAmbher = orderDetails.patientorderambherid;
    const orderId = isAmbher ? orderDetails.patientorderambherid : orderDetails.patientorderbautistaid;
    const customerPhone = orderDetails.patientcontactnumber;
    const customerFirstName = orderDetails.patientfirstname;
    const customerLastName = orderDetails.patientlastname;

    if (!customerPhone) {
      console.warn('⚠️ No customer phone number available for SMS notification');
      return;
    }

    console.log(`📱 Sending pickup date ${isUpdate ? 'update' : 'schedule'} SMS for order ${orderId}...`);

    // Prepare SMS data
    const smsData = {
      orderId: orderId,
      orderType: isAmbher ? 'ambher' : 'bautista',
      patientName: `${customerFirstName} ${customerLastName}`,
      patientPhone: customerPhone,
      pickupDate: newPickupDate,
      productName: isAmbher ? orderDetails.patientorderambherproductname : orderDetails.patientorderbautistaproductname,
      clinicName: isAmbher ? 'Ambher Optical' : 'Bautista Eye Center',
      isScheduling: !isUpdate
    };

    const smsResponse = await fetch(`${apiUrl}/api/sms/pickup-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentusertoken}`
      },
      body: JSON.stringify(smsData)
    });

    console.log('📡 Pickup SMS Response status:', smsResponse.status);
    const smsResponseData = await smsResponse.json();
    console.log('📡 Pickup SMS Response data:', smsResponseData);

    if (smsResponse.ok && smsResponseData.success) {
      console.log(`✅ Pickup date ${isUpdate ? 'update' : 'schedule'} SMS sent successfully`);
      
      // Show success toast notification
      const actionText = isUpdate ? 'updated' : 'scheduled';
      setSmsToastMessage(`✅ Pickup date ${actionText} SMS sent to ${customerFirstName} ${customerLastName} (${customerPhone})`);
      setSmsToast(true);
      setSmsToastClosing(false);
      setSmsIsClicked(true); // Green for success
      
      // Start progress animation
      setSmsProgressWidth('0%');
      setTimeout(() => setSmsProgressWidth('100%'), 100);
      
    } else {
      console.warn(`⚠️ Pickup date ${isUpdate ? 'update' : 'schedule'} SMS failed:`, smsResponseData);
      
      // Show error toast notification
      const actionText = isUpdate ? 'update' : 'schedule';
      setSmsToastMessage(`❌ Failed to send pickup date ${actionText} SMS to ${customerFirstName} ${customerLastName}`);
      setSmsToast(true);
      setSmsToastClosing(false);
      setSmsIsClicked(false); // Red for error
      
      // Start progress animation
      setSmsProgressWidth('0%');
      setTimeout(() => setSmsProgressWidth('100%'), 100);
    }
  } catch (error) {
    console.error('❌ Error sending pickup date SMS:', error);
    
    // Show error toast notification
    const actionText = isUpdate ? 'update' : 'schedule';
    setSmsToastMessage(`❌ Error sending pickup date ${actionText} SMS: ${error.message}`);
    setSmsToast(true);
    setSmsToastClosing(false);
    setSmsIsClicked(false); // Red for error
    
    // Start progress animation
    setSmsProgressWidth('0%');
    setTimeout(() => setSmsProgressWidth('100%'), 100);
  }
}, [currentusertoken, apiUrl, setSmsToastMessage, setSmsToast, setSmsToastClosing, setSmsIsClicked, setSmsProgressWidth]);

const handlePickupDateChange = (e) => {
  const selectedDate = e.target.value;
  const previousPickupDate = selectedOrderForView?.patientorderambherproductchosenpickupdate || 
                            selectedOrderForView?.patientorderbautistaproductchosenpickupdate;
  
  setSelectedPickupDate(selectedDate);
  updatePickupDate(selectedDate);
  
  // Send SMS notification for pickup date change
  if (selectedDate && selectedOrderForView) {
    // Determine if this is an update (there was a previous date) or initial scheduling
    const isUpdate = previousPickupDate && 
                     previousPickupDate !== 'Later' && 
                     previousPickupDate !== 'Now' && 
                     previousPickupDate !== selectedDate;
    
    // Send SMS notification after a short delay to ensure the order is updated
    setTimeout(() => {
      sendPickupDateSMS(selectedOrderForView, selectedDate, isUpdate);
    }, 1000);
  }
};

// SMS functionality integrated directly into markOrderAsComplete function
// Previous sendOrderCompletionSMS function removed to prevent duplication










// Function to mark order as complete
const markOrderAsComplete = useCallback(async () => {
  // Multi-layer protection against duplicate submissions
  if (!selectedOrderForView || isMarkingOrderComplete) {
    console.warn('⚠️ Mark order as complete already in progress, ignoring duplicate click');
    return;
  }

  // Additional timestamp-based protection
  const now = Date.now();
  const lastSubmissionTime = window.lastMarkCompleteTime || 0;
  if (now - lastSubmissionTime < 2000) { // 2 second cooldown
    console.warn('⚠️ Mark complete clicked too soon after last attempt, ignoring duplicate click');
    return;
  }
  window.lastMarkCompleteTime = now;
  
  try {
    setIsMarkingOrderComplete(true);
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
        // Update order status to Completed based on order type
        ...(isAmbher ? {
          patientorderambherstatus: 'Completed',
          patientorderambherproductpickupstatus: 'Now'
        } : {
          patientorderbautistastatus: 'Completed',
          patientorderbautistaproductpickupstatus: 'Now'
        }),
        changedBy: (adminfirstname && adminlastname) ? `${adminfirstname} ${adminlastname}` : 'Admin User'
      })
    });

    if (response.ok) {
      const updatedOrder = await response.json();
      console.log(`✅ Successfully marked ${isAmbher ? 'ambher' : 'bautista'} order ${orderId} as complete`);
      
      // Send SMS notification about order completion
      try {
        // Check if SMS is already being sent for this order
        if (sendingSmsForOrder === orderId) {
          console.warn('⚠️ SMS already being sent for this order, skipping duplicate');
          return;
        }
        
        // Additional check: prevent duplicate SMS within a short time window for this specific order
        const smsKey = `sms_sent_${orderId}_complete`;
        const lastSmsSentTime = window[smsKey] || 0;
        const timeSinceLastSms = now - lastSmsSentTime;
        if (timeSinceLastSms < 10000) { // 10 second cooldown for SMS per order
          console.warn(`⚠️ SMS for order ${orderId} was sent ${timeSinceLastSms}ms ago, skipping duplicate`);
          return;
        }
        
        setSendingSmsForOrder(orderId);
        window[smsKey] = now; // Mark SMS as sent for this order
        
        console.log('📱 Attempting to send SMS for order completion:', orderId);
        console.log('🌐 API URL:', apiUrl);
        console.log('🔑 Token available:', !!currentusertoken);
        
        // Add a small random delay to prevent race conditions
        const randomDelay = Math.floor(Math.random() * 500) + 100; // 100-600ms
        await new Promise(resolve => setTimeout(resolve, randomDelay));
        
        const smsResponse = await fetch(`${apiUrl}/api/sms/order-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentusertoken}`
          },
          body: JSON.stringify({
            orderId: orderId,
            orderType: isAmbher ? 'ambher' : 'bautista',
            newStatus: 'Completed',
            timestamp: Date.now(), // Add timestamp to make request unique
            requestId: `complete-${orderId}-${Date.now()}` // Unique request identifier
          })
        });

        console.log('📡 SMS Response status:', smsResponse.status);
        const smsResponseData = await smsResponse.json();
        console.log('📡 SMS Response data:', smsResponseData);

        // Check both HTTP status AND the success field in response body
        if (smsResponse.ok && smsResponseData.success) {
          console.log('✅ Order completion SMS sent successfully');
          
          // Get customer info from response data (includes phone number)
          const customerFirstName = smsResponseData.recipientName?.split(' ')[0] || selectedOrderForView.patientfirstname;
          const customerLastName = smsResponseData.recipientName?.split(' ').slice(1).join(' ') || selectedOrderForView.patientlastname;
          const recipientPhone = smsResponseData.recipientPhone || selectedOrderForView.patientcontactnumber;
          
          // Show success toast notification with phone number
          setSmsToastMessage(`✅ Order completion SMS sent to ${customerFirstName} ${customerLastName} (${recipientPhone})`);
          setSmsToast(true);
          setSmsToastClosing(false);
          setSmsIsClicked(true); // Set to true for success (green)
          
          // Start progress animation
          setSmsProgressWidth('0%');
          setTimeout(() => setSmsProgressWidth('100%'), 100);
          
          // Verify delivery status after 5 seconds
          setTimeout(async () => {
            try {
              if (smsResponseData.iprogMessageId) {
                console.log('🔍 Verifying SMS delivery status...');
                const verifyResponse = await fetch(`${apiUrl}/api/sms/verify-delivery`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentusertoken}`
                  },
                  body: JSON.stringify({
                    iprogMessageId: smsResponseData.iprogMessageId
                  })
                });
                
                if (verifyResponse.ok) {
                  const verifyData = await verifyResponse.json();
                  console.log('📊 SMS Delivery Verification:', verifyData);
                  
                  if (verifyData.success && verifyData.isDelivered) {
                    console.log('✅ SMS delivery confirmed');
                    // Update toast to show delivery confirmation
                    setSmsToastMessage(`✅ SMS delivered to ${customerFirstName} ${customerLastName} (${recipientPhone})`);
                  } else if (verifyData.success && verifyData.isFailed) {
                    console.warn('⚠️ SMS delivery failed');
                    setSmsToastMessage(`⚠️ SMS sent but delivery failed to ${customerFirstName} ${customerLastName} (${recipientPhone})`);
                    setSmsIsClicked(false); // Change to warning color
                  }
                }
              }
            } catch (verifyError) {
              console.warn('⚠️ Failed to verify SMS delivery:', verifyError);
            }
          }, 5000);
          
          // Auto-hide toast after 8 seconds (longer to allow delivery verification)
          setTimeout(() => {
            setSmsToastClosing(true);
            setTimeout(() => {
              setSmsToast(false);
              setSmsToastClosing(false);
              setSmsProgressWidth('0%');
              setSmsIsClicked(false);
              setSendingSmsForOrder(null);
            }, 3000);
          }, 8000);
        } else {
          console.warn('⚠️ SMS notification failed but order was still completed');
          console.warn('SMS Error details:', smsResponseData);
          
          // Get customer info from response or order data
          const customerFirstName = smsResponseData.recipientName?.split(' ')[0] || selectedOrderForView.patientfirstname;
          const customerLastName = smsResponseData.recipientName?.split(' ').slice(1).join(' ') || selectedOrderForView.patientlastname;
          const recipientPhone = smsResponseData.recipientPhone || selectedOrderForView.patientcontactnumber;
          
          // Show informative error message based on the error type
          let errorMessage = 'SMS notification failed';
          if (smsResponseData.message && smsResponseData.message.includes('contact number not found')) {
            errorMessage = `⚠️ Order completed but SMS failed: No phone number for ${customerFirstName} ${customerLastName}`;
          } else if (smsResponseData.message) {
            errorMessage = `⚠️ Order completed but SMS failed for ${customerFirstName} ${customerLastName} (${recipientPhone || 'no phone'}): ${smsResponseData.message}`;
          } else if (smsResponseData.error) {
            errorMessage = `⚠️ Order completed but SMS failed for ${customerFirstName} ${customerLastName} (${recipientPhone || 'no phone'}): ${smsResponseData.error}`;
          } else {
            errorMessage = `⚠️ Order completed but SMS failed for ${customerFirstName} ${customerLastName} (${recipientPhone || 'no phone'})`;
          }
          
          // Show warning toast
          setSmsToastMessage(errorMessage);
          setSmsToast(true);
          setSmsToastClosing(false);
          setSmsIsClicked(false); // Set to false for error (red)
          
          // Start progress animation
          setSmsProgressWidth('0%');
          setTimeout(() => setSmsProgressWidth('100%'), 100);
          
          // Auto-hide toast after 6 seconds (longer for error messages)
          setTimeout(() => {
            setSmsToastClosing(true);
            setTimeout(() => {
              setSmsToast(false);
              setSmsToastClosing(false);
              setSmsProgressWidth('0%');
              setSmsIsClicked(false);
              setSendingSmsForOrder(null);
            }, 3000);
          }, 6000);
        }
      } catch (smsError) {
        console.warn('⚠️ SMS notification failed but order was still completed:', smsError);
        
        // Get customer name and phone from order data
        const customerFirstName = selectedOrderForView.patientfirstname;
        const customerLastName = selectedOrderForView.patientlastname;
        const recipientPhone = selectedOrderForView.patientcontactnumber;
        
        // Show error toast with phone number
        setSmsToastMessage(`⚠️ Order completed but SMS failed for ${customerFirstName} ${customerLastName} (${recipientPhone || 'no phone'}): ${smsError.message}`);
        setSmsToast(true);
        setSmsToastClosing(false);
        setSmsIsClicked(false); // Set to false for error (red)
        
        // Start progress animation
        setSmsProgressWidth('0%');
        setTimeout(() => setSmsProgressWidth('100%'), 100);
        
        // Auto-hide toast after 6 seconds
        setTimeout(() => {
          setSmsToastClosing(true);
          setTimeout(() => {
            setSmsToast(false);
            setSmsToastClosing(false);
            setSmsProgressWidth('0%');
            setSmsIsClicked(false);
            setSendingSmsForOrder(null);
          }, 3000);
        }, 6000);
      }
      
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
      
      // Note: SMS notification is already sent above in the main try block
      // No need for additional SMS call here
      
      console.log('🎯 Order marked as complete and UI updated');
    } else {
      console.error(`❌ Failed to mark order as complete: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Error marking order as complete:', error);
  } finally {
    // Always reset the loading state to allow future clicks
    setIsMarkingOrderComplete(false);
    setSendingSmsForOrder(null);
    console.log('🔄 Reset isMarkingOrderComplete to false');
  }
}, [selectedOrderForView, currentusertoken, apiUrl, adminfirstname, adminlastname, refreshOrdersWithStatusCheck, setSelectedOrderForView, setambherOrders, setbautistaOrders, setambherinventoryproducts, setbautistainventoryproducts, setambherproductsoldCounts, setbautistaproductsoldCounts, isMarkingOrderComplete, setSmsToast, setSmsToastMessage, setSmsToastClosing, setSmsProgressWidth, setSmsIsClicked, sendingSmsForOrder, setSendingSmsForOrder]);





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

// PROTECTION: Don't submit new orders if we're marking an existing order as complete
if (isMarkingOrderComplete) {
  console.warn('⚠️ Blocking Ambher order submission during order completion process');
  return;
}

// Multi-layer protection against duplicate submissions
if (isSubmittingAmbherCompleteOrder) {
  console.warn('⚠️ Order submission already in progress (state check), ignoring duplicate click');
  return;
}

// Additional timestamp-based protection
const now = Date.now();
const lastSubmissionTime = window.lastAmbherSubmissionTime || 0;
if (now - lastSubmissionTime < 2000) { // 2 second cooldown
  console.warn('⚠️ Order submission too soon after last attempt, ignoring duplicate click');
  return;
}
window.lastAmbherSubmissionTime = now;

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
      'Authorization': `Bearer ${currentusertoken}` // Using current user token
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
  
  // Send SMS notification to customer about new order
  try {
    // Extract the actual order data from response
    const orderData = result.data || result;
    
    // Get the order ID - use the numeric patientorderambherid for SMS, not the MongoDB _id
    const orderId = orderData.patientorderambherid || orderData.id;
    
    console.log('📋 Ambher order creation result:', {
      hasResult: !!result,
      hasOrderData: !!orderData,
      resultKeys: result ? Object.keys(result) : [],
      orderDataKeys: orderData ? Object.keys(orderData) : [],
      _id: orderData?._id,
      patientorderambherid: orderData?.patientorderambherid,
      id: orderData?.id,
      selectedOrderId: orderId,
      orderIdType: typeof orderId,
      orderIdSource: orderData.patientorderambherid ? 'patientorderambherid' : (orderData.id ? 'id' : 'none')
    });
    
    if (result && orderId) {
      console.log('📱 Attempting to send SMS for order:', orderId);
      console.log('🌐 API URL:', apiUrl);
      console.log('🔑 Token available:', !!currentusertoken);
      
      const smsResponse = await fetch(`${apiUrl}/api/sms/order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentusertoken}`
        },
        body: JSON.stringify({
          orderId: orderId,
          orderType: 'ambher',
          newStatus: 'Completed'
        })
      });

      console.log('📡 SMS Response status:', smsResponse.status);
      const smsResponseData = await smsResponse.json();
      console.log('📡 SMS Response data:', smsResponseData);

      // Check both HTTP status AND the success field in response body
      if (smsResponse.ok && smsResponseData.success) {
        console.log('✅ Order completion SMS sent successfully');
        
        // Show success toast notification
        setSmsToastMessage(`✅ Order confirmation SMS sent to ${orderambherfirstName} ${orderambherlastName}`);
        setSmsToast(true);
        setSmsToastClosing(false);
        setSmsIsClicked(true); // Set to true for success (green)
        
        // Start progress animation
        setSmsProgressWidth('0%');
        setTimeout(() => setSmsProgressWidth('100%'), 100);
        
        // Auto-hide toast after 4 seconds
        setTimeout(() => {
          setSmsToastClosing(true);
          setTimeout(() => {
            setSmsToast(false);
            setSmsToastClosing(false);
            setSmsProgressWidth('0%');
          }, 3000);
        }, 4000);
      } else {
        console.warn('⚠️ SMS notification failed but order was still created');
        console.warn('SMS Error details:', smsResponseData);
        
        // Show informative error message based on the error type
        let errorMessage = 'SMS notification failed';
        if (smsResponseData.message && smsResponseData.message.includes('contact number not found')) {
          errorMessage = `⚠️ Order created but SMS failed: No phone number for ${orderambherfirstName} ${orderambherlastName}`;
        } else if (smsResponseData.message) {
          errorMessage = `⚠️ Order created but SMS failed: ${smsResponseData.message}`;
        } else if (smsResponseData.error) {
          errorMessage = `⚠️ Order created but SMS failed: ${smsResponseData.error}`;
        }
        
        // Show warning toast
        setSmsToastMessage(errorMessage);
        setSmsToast(true);
        setSmsToastClosing(false);
        setSmsIsClicked(false); // Set to false for error (red)
        
        // Start progress animation
        setSmsProgressWidth('0%');
        setTimeout(() => setSmsProgressWidth('100%'), 100);
        
        // Auto-hide toast after 6 seconds (longer for error messages)
        setTimeout(() => {
          setSmsToastClosing(true);
          setTimeout(() => {
            setSmsToast(false);
            setSmsToastClosing(false);
            setSmsProgressWidth('0%');
          }, 3000);
        }, 6000);
      }
    } else {
      console.warn('⚠️ No valid order ID found in Ambher response, cannot send SMS');
      console.warn('📋 Ambher Response data:', {
        hasResult: !!result,
        hasOrderData: !!orderData,
        orderData: orderData,
        orderId: orderId
      });
      
      // Still show order creation success, but note SMS failure
      setSmsToastMessage(`✅ Ambher order created successfully but SMS notification failed: No order ID returned`);
      setSmsToast(true);
      setSmsToastClosing(false);
      setSmsIsClicked(true); // Set to true for order success (green), even if SMS failed
      
      // Start progress animation
      setSmsProgressWidth('0%');
      setTimeout(() => setSmsProgressWidth('100%'), 100);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setSmsToastClosing(true);
        setTimeout(() => {
          setSmsToast(false);
          setSmsToastClosing(false);
          setSmsProgressWidth('0%');
        }, 3000);
      }, 4000);
    }
  } catch (smsError) {
    console.warn('⚠️ SMS notification failed but order was still created:', smsError);
    // Don't let SMS failure affect the order creation success
  }
  
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

// PROTECTION: Don't submit new orders if we're marking an existing order as complete
if (isMarkingOrderComplete) {
  console.warn('⚠️ Blocking Bautista order submission during order completion process');
  return;
}

// Multi-layer protection against duplicate submissions
if (isSubmittingBautistaCompleteOrder) {
  console.warn('⚠️ Bautista order submission already in progress (state check), ignoring duplicate click');
  return;
}

// Additional timestamp-based protection
const now = Date.now();
const lastSubmissionTime = window.lastBautistaSubmissionTime || 0;
if (now - lastSubmissionTime < 2000) { // 2 second cooldown
  console.warn('⚠️ Bautista order submission too soon after last attempt, ignoring duplicate click');
  return;
}
window.lastBautistaSubmissionTime = now;

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
      'Authorization': `Bearer ${currentusertoken}` // Using admin token
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
  
  // Send SMS notification to customer about new order
  try {
    // Extract the actual order data from response
    const orderData = result.data || result;
    
    // Get the order ID - use the numeric patientorderbautistaid for SMS, not the MongoDB _id
    const orderId = orderData.patientorderbautistaid || orderData.id;
    
    console.log('📋 Bautista order creation result:', {
      hasResult: !!result,
      hasOrderData: !!orderData,
      resultKeys: result ? Object.keys(result) : [],
      orderDataKeys: orderData ? Object.keys(orderData) : [],
      _id: orderData?._id,
      patientorderbautistaid: orderData?.patientorderbautistaid,
      id: orderData?.id,
      selectedOrderId: orderId
    });
    
    if (result && orderId) {
      console.log('📱 Attempting to send SMS for Bautista order:', orderId);
      console.log('🌐 API URL:', apiUrl);
      console.log('🔑 Token available:', !!currentusertoken);
      
      const smsResponse = await fetch(`${apiUrl}/api/sms/order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentusertoken}`
        },
        body: JSON.stringify({
          orderId: orderId,
          orderType: 'bautista',
          newStatus: 'Completed'
        })
      });

      console.log('📡 SMS Response status:', smsResponse.status);
      const smsResponseData = await smsResponse.json();
      console.log('📡 SMS Response data:', smsResponseData);

      // Check both HTTP status AND the success field in response body
      if (smsResponse.ok && smsResponseData.success) {
        console.log('✅ Order completion SMS sent successfully');
        
        // Show success toast notification
        setSmsToastMessage(`✅ Order confirmation SMS sent to ${orderbautistafirstName} ${orderbautistalastName}`);
        setSmsToast(true);
        setSmsToastClosing(false);
        setSmsIsClicked(true); // Set to true for success (green)
        
        // Start progress animation
        setSmsProgressWidth('0%');
        setTimeout(() => setSmsProgressWidth('100%'), 100);
        
        // Auto-hide toast after 4 seconds
        setTimeout(() => {
          setSmsToastClosing(true);
          setTimeout(() => {
            setSmsToast(false);
            setSmsToastClosing(false);
            setSmsProgressWidth('0%');
          }, 3000);
        }, 4000);
      } else {
        console.warn('⚠️ SMS notification failed but order was still created');
        console.warn('SMS Error details:', smsResponseData);
        
        // Show informative error message based on the error type
        let errorMessage = 'SMS notification failed';
        if (smsResponseData.message && smsResponseData.message.includes('contact number not found')) {
          errorMessage = `⚠️ Order created but SMS failed: No phone number for ${orderbautistafirstName} ${orderbautistalastName}`;
        } else if (smsResponseData.message) {
          errorMessage = `⚠️ Order created but SMS failed: ${smsResponseData.message}`;
        } else if (smsResponseData.error) {
          errorMessage = `⚠️ Order created but SMS failed: ${smsResponseData.error}`;
        }
        
        // Show warning toast
        setSmsToastMessage(errorMessage);
        setSmsToast(true);
        setSmsToastClosing(false);
        setSmsIsClicked(false); // Set to false for error (red)
        
        // Start progress animation
        setSmsProgressWidth('0%');
        setTimeout(() => setSmsProgressWidth('100%'), 100);
        
        // Auto-hide toast after 6 seconds (longer for error messages)
        setTimeout(() => {
          setSmsToastClosing(true);
          setTimeout(() => {
            setSmsToast(false);
            setSmsToastClosing(false);
            setSmsProgressWidth('0%');
          }, 3000);
        }, 6000);
      }
    } else {
      console.warn('⚠️ No valid order ID found in Bautista response, cannot send SMS');
      console.warn('📋 Bautista Response data:', {
        hasResult: !!result,
        hasOrderData: !!orderData,
        orderData: orderData,
        orderId: orderId
      });
      
      // Still show order creation success, but note SMS failure
      setSmsToastMessage(`✅ Bautista order created successfully but SMS notification failed: No order ID returned`);
      setSmsToast(true);
      setSmsToastClosing(false);
      setSmsIsClicked(true); // Set to true for order success (green), even if SMS failed
      
      // Start progress animation
      setSmsProgressWidth('0%');
      setTimeout(() => setSmsProgressWidth('100%'), 100);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setSmsToastClosing(true);
        setTimeout(() => {
          setSmsToast(false);
          setSmsToastClosing(false);
          setSmsProgressWidth('0%');
        }, 3000);
      }, 4000);
    }
  } catch (smsError) {
    console.warn('⚠️ SMS notification failed but Bautista order was still created:', smsError);
    // Don't let SMS failure affect the order creation success
  }
  
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
      'Authorization': `Bearer ${currentusertoken}` // Using admin token
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
      'Authorization': `Bearer ${currentusertoken}` // Using admin token
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

  // Note: chartsData is now handled by processedChartsData and filteredChartsData useMemo hooks

  // Get current user clinic from localStorage
  const getCurrentUserClinic = useCallback(() => {
    const staffClinic = localStorage.getItem('staffclinic');
    const ownerClinic = localStorage.getItem('ownerclinic');
    return staffClinic || ownerClinic || '';
  }, []);

  // Optimized Reports Data Fetching with Smart Cache and Parallel Requests
  const fetchReportsData = useCallback(async (forceRefresh = false) => {
    const startTime = performance.now();
    console.log('� Optimized fetchReportsData called');
    setReportsData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const userClinic = getCurrentUserClinic();
      console.log('👤 User clinic:', userClinic);
      
      // Create cache keys for different data types
      const appointmentsCacheKey = `reports_appointments_${userClinic}`;
      const ambherOrdersCacheKey = `reports_ambher_orders_${userClinic}`;
      const bautistaOrdersCacheKey = `reports_bautista_orders_${userClinic}`;
      
      // Define API calls based on clinic - use smart cache for all
      const apiCalls = [];
      
      // Always fetch appointments (filter client-side for better caching)
      apiCalls.push(
        smartFetch(
          appointmentsCacheKey,
          async () => {
            const response = await fetch('/api/patientappointments/appointments', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken') || localStorage.getItem('admintoken')}`
              }
            });
            if (!response.ok) throw new Error(`Failed to fetch appointments: ${response.statusText}`);
            return response.json();
          },
          CACHE_DURATIONS.MEDIUM, // 5-minute cache
          forceRefresh
        )
      );
      
      // Fetch orders based on clinic - parallel execution
      if (userClinic === 'Ambher Optical') {
        apiCalls.push(
          smartFetch(
            ambherOrdersCacheKey,
            async () => {
              const response = await fetch('/api/patientorderambher/', {
                method: 'GET',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${currentusertoken}`
                }
              });
              if (!response.ok) throw new Error(`Failed to fetch Ambher orders: ${response.statusText}`);
              return response.json();
            },
            CACHE_DURATIONS.MEDIUM,
            forceRefresh
          ),
          Promise.resolve([]) // Empty bautista orders
        );
      } else if (userClinic === 'Bautista Eye Center') {
        apiCalls.push(
          Promise.resolve([]), // Empty ambher orders
          smartFetch(
            bautistaOrdersCacheKey,
            async () => {
              const response = await fetch('/api/patientorderbautista/', {
                method: 'GET',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${currentusertoken}`
                }
              });
              if (!response.ok) throw new Error(`Failed to fetch Bautista orders: ${response.statusText}`);
              return response.json();
            },
            CACHE_DURATIONS.MEDIUM,
            forceRefresh
          )
        );
      } else {
        // Admin: fetch both in parallel
        apiCalls.push(
          smartFetch(
            ambherOrdersCacheKey,
            async () => {
              const response = await fetch('/api/patientorderambher/', {
                method: 'GET',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${currentusertoken}`
                }
              });
              if (!response.ok) throw new Error(`Failed to fetch Ambher orders: ${response.statusText}`);
              return response.json();
            },
            CACHE_DURATIONS.MEDIUM,
            forceRefresh
          ),
          smartFetch(
            bautistaOrdersCacheKey,
            async () => {
              const response = await fetch('/api/patientorderbautista/', {
                method: 'GET',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${currentusertoken}`
                }
              });
              if (!response.ok) throw new Error(`Failed to fetch Bautista orders: ${response.statusText}`);
              return response.json();
            },
            CACHE_DURATIONS.MEDIUM,
            forceRefresh
          )
        );
      }
      
      // Execute all API calls in parallel
      console.log('� Executing parallel API calls...');
      const [appointmentsData, ambherOrdersData, bautistaOrdersData] = await Promise.all(apiCalls);
      
      // Client-side filtering for appointments (better caching)
      let filteredAppointments = appointmentsData || [];
      console.log('📊 Raw appointments data:', filteredAppointments?.length || 0);
      console.log('👤 Current user clinic:', userClinic);
      
      if (userClinic === 'Ambher Optical') {
        filteredAppointments = filteredAppointments.filter(appointment => 
          appointment.patientambherappointmentdate && 
          appointment.patientambherappointmentdate.trim() !== '' &&
          appointment.patientambherappointmenttime &&
          appointment.patientambherappointmenttime.trim() !== ''
        );
        console.log('🏥 Filtered Ambher appointments:', filteredAppointments?.length || 0);
      } else if (userClinic === 'Bautista Eye Center') {
        filteredAppointments = filteredAppointments.filter(appointment => 
          appointment.patientbautistaappointmentdate && 
          appointment.patientbautistaappointmentdate.trim() !== '' &&
          appointment.patientbautistaappointmenttime &&
          appointment.patientbautistaappointmenttime.trim() !== ''
        );
        console.log('🏥 Filtered Bautista appointments:', filteredAppointments?.length || 0);
      }
      console.log('✅ Final filtered appointments:', filteredAppointments?.length || 0);
      
      const endTime = performance.now();
      console.log(`✅ Reports data fetched in ${(endTime - startTime).toFixed(2)}ms`);
      
      // Handle paginated response format - extract orders array from pagination response
      const ambherOrders = Array.isArray(ambherOrdersData) ? ambherOrdersData : (ambherOrdersData?.orders || []);
      const bautistaOrders = Array.isArray(bautistaOrdersData) ? bautistaOrdersData : (bautistaOrdersData?.orders || []);
      
      setReportsData({
        appointments: filteredAppointments,
        ambherOrders: ambherOrders,
        bautistaOrders: bautistaOrders,
        loading: false,
        error: null
      });
      
      console.log('📊 Reports data loaded:', {
        appointmentsCount: filteredAppointments?.length || 0,
        ambherOrdersCount: ambherOrders.length,
        bautistaOrdersCount: bautistaOrders.length,
        fetchTime: `${(endTime - startTime).toFixed(2)}ms`
      });

    } catch (error) {
      console.error('Error fetching reports data:', error);
      setReportsData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch reports data'
      }));
    }
  }, [smartFetch, CACHE_DURATIONS, getCurrentUserClinic, currentusertoken]);

  // Refresh reports data function - clears cache and reloads data
  const refreshReportsData = useCallback(async () => {
    console.log('🔄 Manual refresh of reports data triggered');
    await fetchReportsData(true); // Force refresh bypassing cache
    console.log('✅ Manual refresh completed');
  }, [fetchReportsData]);

  // Refresh appointment data function
  const refreshAppointmentData = useCallback(async () => {
    console.log('🔄 Manual refresh of appointment data triggered');
    setloadingappointments(true);
    try {
      await fetchAppointmentData(true); // Force refresh bypassing cache
      console.log('✅ Appointment refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing appointment data:', error);
    } finally {
      setloadingappointments(false);
    }
  }, [fetchAppointmentData]);

  // Refresh medical records data function
  const refreshMedicalRecordsData = useCallback(async () => {
    console.log('🔄 Manual refresh of medical records data triggered');
    setloadingpatientdemographics(true);
    try {
      await fetchDemographicsData(true); // Force refresh bypassing cache
      console.log('✅ Medical records refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing medical records data:', error);
    } finally {
      setloadingpatientdemographics(false);
    }
  }, [fetchDemographicsData]);

  // Refresh inventory data function
  const refreshInventoryData = useCallback(async () => {
    console.log('🔄 Manual refresh of inventory data triggered');
    setloadingambherinventorycategorylist(true);
    setloadingbautistainventorycategorylist(true);
    setambherloadingproducts(true);
    setbautistaloadingproducts(true);
    try {
      // Refresh inventory categories and products
      await fetchambherinventorycategories();
      await fetchbautistainventorycategories();
      await fetchambherproducts();
      await fetchbautistaproducts();
      console.log('✅ Inventory refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing inventory data:', error);
    } finally {
      setloadingambherinventorycategorylist(false);
      setloadingbautistainventorycategorylist(false);
      setambherloadingproducts(false);
      setbautistaloadingproducts(false);
    }
  }, []);

  // Refresh billing and orders data function
  const refreshBillingOrdersData = useCallback(async () => {
    console.log('🔄 Manual refresh of billing and orders data triggered');
    setLoadingAmbherOrders(true);
    setLoadingBautistaOrders(true);
    try {
      await fetchAllOrdersOptimized(true); // Force refresh bypassing cache
      console.log('✅ Billing and orders refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing billing and orders data:', error);
    } finally {
      setLoadingAmbherOrders(false);
      setLoadingBautistaOrders(false);
    }
  }, [fetchAllOrdersOptimized]);

  // Helper functions for data processing - MOVED BEFORE useMemo
  const processMonthlyData = useCallback((data, dateField) => {
    if (!data || !data.length) return [];
    console.log('📊 processMonthlyData called with:', data?.length || 0, 'items');
    const months = {};
    data.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + 1;
    });

    const result = Object.entries(months).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
    
    console.log('📊 processMonthlyData result:', result);
    return result;
  }, []);

  const processCategoryData = useCallback((orders) => {
    if (!orders || !orders.length) return [];
    console.log('📊 processCategoryData called with:', orders?.length || 0, 'orders');
    
    // Filter only completed orders
    const completedOrders = orders.filter(order => {
      const ambherStatus = order.patientorderambherstatus?.toLowerCase();
      const bautistaStatus = order.patientorderbautistastatus?.toLowerCase();
      return ambherStatus === 'completed' || bautistaStatus === 'completed';
    });
    
    if (!completedOrders.length) return [];
    
    const categories = {};
    completedOrders.forEach(order => {
      const category = order.patientorderambherproductcategory || order.patientorderbautistaproductcategory || 'Other';
      const quantity = order.patientorderambherproductquantity || order.patientorderbautistaproductquantity || 0;
      categories[category] = (categories[category] || 0) + quantity;
    });

    const result = Object.entries(categories).map(([category, quantity]) => ({
      category,
      quantity,
      value: quantity
    }));
    
    console.log('📊 processCategoryData result:', result);
    return result;
  }, []);

  const processRevenueData = useCallback((orders) => {
    if (!orders || !orders.length) return [];
    const revenue = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const total = order.patientorderambherproducttotal || order.patientorderbautistaproducttotal || 0;
      revenue[monthKey] = (revenue[monthKey] || 0) + total;
    });

    return Object.entries(revenue).map(([month, total]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: total
    })).sort((a, b) => new Date(a.month) - new Date(b.month));
  }, []);

  const processStatusData = useCallback((orders) => {
    if (!orders || !orders.length) return [];
    const statuses = {};
    orders.forEach(order => {
      const status = order.patientorderambherstatus || order.patientorderbautistastatus || 'Unknown';
      statuses[status] = (statuses[status] || 0) + 1;
    });

    return Object.entries(statuses).map(([status, count]) => ({
      status,
      count,
      value: count
    }));
  }, []);

  const processTopProducts = useCallback((orders) => {
    if (!orders || !orders.length) return [];
    
    // Filter only completed orders
    const completedOrders = orders.filter(order => {
      const ambherStatus = order.patientorderambherstatus?.toLowerCase();
      const bautistaStatus = order.patientorderbautistastatus?.toLowerCase();
      return ambherStatus === 'completed' || bautistaStatus === 'completed';
    });
    
    if (!completedOrders.length) return [];
    
    const products = {};
    completedOrders.forEach(order => {
      const productName = order.patientorderambherproductname || order.patientorderbautistaproductname || 'Unknown';
      const quantity = order.patientorderambherproductquantity || order.patientorderbautistaproductquantity || 0;
      products[productName] = (products[productName] || 0) + quantity;
    });

    return Object.entries(products)
      .map(([product, quantity]) => ({ product, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, []);

  const processPatientVisits = useCallback((appointments) => {
    if (!appointments || !appointments.length) return [];
    const visits = {};
    appointments.forEach(appointment => {
      const date = new Date(appointment.createdAt);
      const dayKey = date.toLocaleDateString();
      visits[dayKey] = (visits[dayKey] || 0) + 1;
    });

    return Object.entries(visits).map(([date, visits]) => ({
      date,
      visits
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);

  // Process daily appointment data for interactive chart - COMPLETED APPOINTMENTS ONLY
  const processDailyAppointmentData = useCallback((appointments) => {
    if (!appointments || !appointments.length) return [];
    
    const dailyData = {};
    
    appointments.forEach(appointment => {
      // Only process completed appointments
      const isAmbherCompleted = appointment.patientambherappointmentstatus === 'Completed';
      const isBautistaCompleted = appointment.patientbautistaappointmentstatus === 'Completed';
      
      // Skip if neither clinic appointment is completed
      if (!isAmbherCompleted && !isBautistaCompleted) {
        return;
      }
      
      let appointmentDate = null;
      let clinic = null;
      
      // Use the appointment date from the completed clinic
      if (isAmbherCompleted && appointment.patientambherappointmentdate) {
        appointmentDate = appointment.patientambherappointmentdate;
        clinic = 'ambher';
      } else if (isBautistaCompleted && appointment.patientbautistaappointmentdate) {
        appointmentDate = appointment.patientbautistaappointmentdate;
        clinic = 'bautista';
      }
      
      // Skip if no valid appointment date found
      if (!appointmentDate) {
        return;
      }
      
      const date = new Date(appointmentDate);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          ambher: 0,
          bautista: 0,
          total: 0
        };
      }
      
      // Count completed appointments by clinic
      if (clinic === 'ambher') {
        dailyData[dateKey].ambher += 1;
        dailyData[dateKey].total += 1;
      } else if (clinic === 'bautista') {
        dailyData[dateKey].bautista += 1;
        dailyData[dateKey].total += 1;
      }
    });
    
    // Convert to array and sort by date
    const result = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    console.log('📊 processDailyAppointmentData (COMPLETED ONLY) result:', result);
    return result;
  }, []);

  // Helper function to apply date filters to processed chart data
  const applyDateFiltersToChartsData = useCallback((chartsData) => {
    // For now, return the same data - you can implement date filtering here if needed
    // This is much faster than reprocessing raw data every time
    return chartsData;
  }, []);

  // Optimized Chart Data Processing with Memoization
  const processedChartsData = useMemo(() => {
    const startTime = performance.now();
    console.log('🔄 Processing charts data...');
    
    const { appointments, ambherOrders, bautistaOrders } = reportsData;
    
    // Ensure orders are arrays before spreading
    const safeAmbherOrders = Array.isArray(ambherOrders) ? ambherOrders : [];
    const safeBautistaOrders = Array.isArray(bautistaOrders) ? bautistaOrders : [];
    const allOrders = [...safeAmbherOrders, ...safeBautistaOrders];
    
    console.log('📊 Data to process:', {
      appointmentsCount: appointments?.length || 0,
      ambherOrdersCount: safeAmbherOrders.length,
      bautistaOrdersCount: safeBautistaOrders.length,
      allOrdersCount: allOrders.length
    });

    // Fast return for empty data
    if (!appointments.length && !allOrders.length) {
      console.log('⚡ No data to process, returning empty charts');
      return {
        salesByCategory: [],
        revenueByMonth: [],
        orderStatusDistribution: [],
        topProducts: [],
        patientVisits: []
      };
    }

    // Process all chart data in parallel using optimized functions
    const result = {
      salesByCategory: processCategoryData(allOrders),
      revenueByMonth: processRevenueData(allOrders),
      orderStatusDistribution: processStatusData(allOrders),
      topProducts: processTopProducts(allOrders),
      patientVisits: processPatientVisits(appointments),
      dailyAppointments: processDailyAppointmentData(appointments)
    };
    
    const endTime = performance.now();
    console.log(`⚡ Charts data processed in ${(endTime - startTime).toFixed(2)}ms`);
    console.log('📈 Processed charts result:', result);
    
    return result;
  }, [reportsData, processCategoryData, processRevenueData, processStatusData, processTopProducts, processPatientVisits, processDailyAppointmentData]); // Added dependencies

  // Apply date filters to processed data (much faster than reprocessing)
  const filteredChartsData = useMemo(() => {
    const startTime = performance.now();
    
    if (!processedChartsData.salesByCategory.length) {
      return processedChartsData;
    }

    // Apply filters to already processed data
    const filtered = applyDateFiltersToChartsData(processedChartsData);
    
    const endTime = performance.now();
    console.log(`🔍 Filters applied in ${(endTime - startTime).toFixed(2)}ms`);
    
    return filtered;
  }, [processedChartsData, applyDateFiltersToChartsData]);

  // Paginated Recent Orders
  const paginatedRecentOrders = useMemo(() => {
    const { ambherOrders, bautistaOrders } = reportsData;
    const allOrders = [...ambherOrders, ...bautistaOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const startIndex = (recentOrdersCurrentPage - 1) * RECENT_ORDERS_PER_PAGE;
    const endIndex = startIndex + RECENT_ORDERS_PER_PAGE;
    
    return {
      orders: allOrders.slice(startIndex, endIndex),
      totalOrders: allOrders.length,
      totalPages: Math.ceil(allOrders.length / RECENT_ORDERS_PER_PAGE),
      currentPage: recentOrdersCurrentPage
    };
  }, [reportsData, recentOrdersCurrentPage, RECENT_ORDERS_PER_PAGE]);

  // Separate filtered data for each chart with independent filters
  const filteredSalesByCategory = useMemo(() => {
    const { ambherOrders, bautistaOrders } = reportsData;
    const allOrders = [...ambherOrders, ...bautistaOrders];
    const filteredOrders = filterOrdersByDateRange(allOrders, salesCategoryFilter, salesCategoryYear);
    
    if (filteredOrders.length === 0) {
      return [];
    }
    
    return processCategoryData(filteredOrders);
  }, [reportsData, salesCategoryFilter, salesCategoryYear, filterOrdersByDateRange, processCategoryData]);

  const filteredOrderStatusDistribution = useMemo(() => {
    const { ambherOrders, bautistaOrders } = reportsData;
    const allOrders = [...ambherOrders, ...bautistaOrders];
    const filteredOrders = filterOrdersByDateRange(allOrders, orderStatusFilter, orderStatusYear);
    
    if (filteredOrders.length === 0) {
      return [];
    }
    
    return processStatusData(filteredOrders);
  }, [reportsData, orderStatusFilter, orderStatusYear, filterOrdersByDateRange, processStatusData]);

  const filteredTopProducts = useMemo(() => {
    const { ambherOrders, bautistaOrders } = reportsData;
    const allOrders = [...ambherOrders, ...bautistaOrders];
    const filteredOrders = filterOrdersByDateRange(allOrders, topProductsFilter, topProductsYear);
    
    if (filteredOrders.length === 0) {
      return [];
    }
    
    return processTopProducts(filteredOrders);
  }, [reportsData, topProductsFilter, topProductsYear, filterOrdersByDateRange, processTopProducts]);





  const calculateTotalRevenue = useCallback(() => {
    // Safely get orders arrays
    const safeAmbherOrders = Array.isArray(reportsData.ambherOrders) ? reportsData.ambherOrders : [];
    const safeBautistaOrders = Array.isArray(reportsData.bautistaOrders) ? reportsData.bautistaOrders : [];
    const allOrders = [...safeAmbherOrders, ...safeBautistaOrders];
    const currentUserClinic = getCurrentUserClinic();
    
    // Calculate order revenue - ONLY FROM COMPLETED ORDERS
    const orderRevenue = allOrders.reduce((total, order) => {
      // Only include completed orders
      const isCompleted = (order.patientorderambherstatus === 'Completed') || 
                         (order.patientorderbautistastatus === 'Completed');
      
      if (!isCompleted) return total;
      
      return total + (order.patientorderambherproducttotal || order.patientorderbautistaproducttotal || 0);
    }, 0);
    
    // Calculate appointment payment revenue - ONLY FROM COMPLETED APPOINTMENTS
    const appointmentRevenue = (reportsData.appointments || []).reduce((total, appointment) => {
      // Only include completed appointments
      const isAmbherCompleted = appointment.patientambherappointmentstatus === 'Completed';
      const isBautistaCompleted = appointment.patientbautistaappointmentstatus === 'Completed';
      
      if (!isAmbherCompleted && !isBautistaCompleted) return total;
      
      const ambherPayment = isAmbherCompleted ? (appointment.patientambherappointmentpaymentotal || 0) : 0;
      const bautistaPayment = isBautistaCompleted ? (appointment.patientbautistaappointmentpaymentotal || 0) : 0;
      
      // More flexible clinic name matching
      if (currentUserClinic && currentUserClinic.toLowerCase().includes('ambher')) {
        // Include Ambher appointment payments
        return total + ambherPayment;
      } else if (currentUserClinic && currentUserClinic.toLowerCase().includes('bautista')) {
        // Include Bautista appointment payments
        return total + bautistaPayment;
      } else {
        // If no specific clinic or admin, include both
        return total + ambherPayment + bautistaPayment;
      }
    }, 0);
    
    return orderRevenue + appointmentRevenue;
  }, [reportsData, getCurrentUserClinic]);

  const calculateMetrics = useCallback(() => {
    // Safely get orders arrays
    const safeAmbherOrders = Array.isArray(reportsData.ambherOrders) ? reportsData.ambherOrders : [];
    const safeBautistaOrders = Array.isArray(reportsData.bautistaOrders) ? reportsData.bautistaOrders : [];
    const allOrders = [...safeAmbherOrders, ...safeBautistaOrders];
    const completedOrders = allOrders.filter(order => 
      (order.patientorderambherstatus === 'Completed') || 
      (order.patientorderbautistastatus === 'Completed')
    );
    
    // Calculate completed appointments based on clinic-specific status fields
    const completedAppointments = Array.isArray(reportsData.appointments) ? reportsData.appointments.filter(apt => 
      apt.patientambherappointmentstatus === 'Completed' || 
      apt.patientbautistaappointmentstatus === 'Completed'
    ) : [];
    
    return {
      totalOrders: allOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue: calculateTotalRevenue(),
      totalAppointments: Array.isArray(reportsData.appointments) ? reportsData.appointments.length : 0,
      completedAppointments: completedAppointments.length
    };
  }, [reportsData, calculateTotalRevenue]);

  // PDF Generation Function
  const generateReportsPDF = useCallback(() => {
    if (reportsData.loading) {
      alert('Please wait for data to load before generating PDF');
      return;
    }

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Helper function to add new page if needed
      const checkPageSpace = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      // Get clinic information
      const getClinicInfo = () => {
        if (isAmbherOnlyUser()) {
          return { name: "Ambher Optical", logo: null };
        } else if (isBautistaOnlyUser()) {
          return { name: "Bautista Eye Center", logo: null };
        } else {
          return { name: "Eye2Wear Optical Management System", logo: null };
        }
      };

      const clinicInfo = getClinicInfo();

      // Get user information
      const getUserInfo = () => {
        const userType = currentuserloggedin;
        const fullName = `${adminfirstname} ${adminlastname}`.trim() || 'Unknown User';
        return { userType, fullName };
      };

      const userInfo = getUserInfo();

      // Header with clinic name and logo
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(clinicInfo.name, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(16);
      pdf.text('Reports and Analytics', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Generation details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
      pdf.text(`Generated on: ${formattedDate}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Generated by: ${userInfo.fullName} (${userInfo.userType})`, 20, yPosition);
      yPosition += 15;

      // Summary metrics
      checkPageSpace(40);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary Metrics', 20, yPosition);
      yPosition += 10;

      const metrics = calculateMetrics();
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const summaryData = [
        ['Metric', 'Value'],
        ['Total Orders', metrics.totalOrders.toString()],
        ['Total Revenue', `PHP ${metrics.totalRevenue.toLocaleString()}`],
        ['Total Appointments', metrics.totalAppointments.toString()],
        ['Completed Orders', metrics.completedOrders.toString()]
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [summaryData[0]],
        body: summaryData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [24, 77, 133] },
        margin: { left: 20, right: 20 }
      });

      yPosition = pdf.lastAutoTable.finalY + 15;

      // Revenue Chart Data (if available)
      if (filteredChartsData?.revenueByMonth && filteredChartsData.revenueByMonth.length > 0) {
        checkPageSpace(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Revenue by Month', 20, yPosition);
        yPosition += 10;

        const revenueHeaders = ['Month', 'Revenue (PHP)'];
        const revenueData = filteredChartsData.revenueByMonth.map(item => [
          item.month || item.name || 'N/A',
          `PHP ${(item.revenue || item.value || 0).toLocaleString()}`
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [revenueHeaders],
          body: revenueData,
          theme: 'striped',
          headStyles: { fillColor: [24, 77, 133] },
          margin: { left: 20, right: 20 }
        });

        yPosition = pdf.lastAutoTable.finalY + 15;
      }

      // Appointments Data (if available)
      if (filteredChartsData?.dailyAppointments && filteredChartsData.dailyAppointments.length > 0) {
        checkPageSpace(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Daily Appointments', 20, yPosition);
        yPosition += 10;

        const appointmentHeaders = ['Date', 'Total Appointments'];
        const appointmentData = filteredChartsData.dailyAppointments.slice(0, 10).map(item => [
          item.date || item.name || 'N/A',
          (item.total || item.value || 0).toString()
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [appointmentHeaders],
          body: appointmentData,
          theme: 'striped',
          headStyles: { fillColor: [24, 77, 133] },
          margin: { left: 20, right: 20 }
        });

        yPosition = pdf.lastAutoTable.finalY + 15;
      }

      // Sales by Category Data
      if (filteredSalesByCategory && filteredSalesByCategory.length > 0) {
        checkPageSpace(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(getResponsiveTitle('Sales by Category', salesCategoryFilter, salesCategoryYear), 20, yPosition);
        yPosition += 10;

        const categoryHeaders = ['Category', 'Quantity Sold'];
        const categoryData = filteredSalesByCategory.map(item => [
          item.category || 'N/A',
          (item.quantity || item.value || 0).toString()
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [categoryHeaders],
          body: categoryData,
          theme: 'striped',
          headStyles: { fillColor: [24, 77, 133] },
          margin: { left: 20, right: 20 }
        });

        yPosition = pdf.lastAutoTable.finalY + 15;
      }

      // Order Status Distribution
      if (filteredOrderStatusDistribution && filteredOrderStatusDistribution.length > 0) {
        checkPageSpace(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(getResponsiveTitle('Order Status Distribution', orderStatusFilter, orderStatusYear), 20, yPosition);
        yPosition += 10;

        const statusHeaders = ['Status', 'Count'];
        const statusData = filteredOrderStatusDistribution.map(item => [
          item.status || 'N/A',
          (item.value || item.count || 0).toString()
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [statusHeaders],
          body: statusData,
          theme: 'striped',
          headStyles: { fillColor: [24, 77, 133] },
          margin: { left: 20, right: 20 }
        });

        yPosition = pdf.lastAutoTable.finalY + 15;
      }

      // Top Products Data
      if (filteredTopProducts && filteredTopProducts.length > 0) {
        checkPageSpace(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(getResponsiveTitle('Top Products', topProductsFilter, topProductsYear), 20, yPosition);
        yPosition += 10;

        const productHeaders = ['Product Name', 'Sales Count'];
        const productData = filteredTopProducts.slice(0, 10).map(item => [
          item.product || item.name || item.productName || 'N/A',
          (item.quantity || item.value || item.sales || item.count || 0).toString()
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [productHeaders],
          body: productData,
          theme: 'striped',
          headStyles: { fillColor: [24, 77, 133] },
          margin: { left: 20, right: 20 }
        });

        yPosition = pdf.lastAutoTable.finalY + 15;
      }

      // Recent Orders Table (based on current pagination)
      if (paginatedRecentOrders?.orders && paginatedRecentOrders.orders.length > 0) {
        checkPageSpace(60);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Recent Orders (Page ${paginatedRecentOrders.currentPage} of ${paginatedRecentOrders.totalPages})`, 20, yPosition);
        yPosition += 10;

        const orderHeaders = ['Order ID', 'Customer', 'Product', 'Status', 'Total', 'Date'];
        const orderData = paginatedRecentOrders.orders.map(order => [
          `#${order.patientorderambherid || order.patientorderbautistaid}`,
          `${order.patientfirstname} ${order.patientlastname}`,
          (order.patientorderambherproductname || order.patientorderbautistaproductname || '').substring(0, 20) + '...',
          order.patientorderambherstatus || order.patientorderbautistastatus || 'N/A',
          `PHP ${(order.patientorderambherproducttotal || order.patientorderbautistaproducttotal || 0).toLocaleString()}`,
          new Date(order.createdAt).toLocaleDateString()
        ]);

        autoTable(pdf, {
          startY: yPosition,
          head: [orderHeaders],
          body: orderData,
          theme: 'striped',
          headStyles: { fillColor: [24, 77, 133] },
          margin: { left: 20, right: 20 },
          styles: { fontSize: 8 },
          columnStyles: {
            2: { cellWidth: 30 }, // Product column
            3: { cellWidth: 20 }, // Status column
          }
        });
      }

      // Save the PDF with simple, reliable method
      const fileName = `Reports_Analytics_${clinicInfo.name.replace(/\s+/g, '_')}_${currentDate.toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Show success toast
      setPdfToastMessage("PDF report generated successfully!");
      setPdfToast(true);
      setPdfIsClicked(true);
      setPdfToastClosing(false);

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Show error toast
      setPdfToastMessage("Error generating PDF. Please try again.");
      setPdfToast(true);
      setPdfIsClicked(false);
      setPdfToastClosing(false);
    }
  }, [
    reportsData, 
    calculateMetrics, 
    filteredChartsData, 
    filteredSalesByCategory, 
    filteredOrderStatusDistribution, 
    filteredTopProducts,
    paginatedRecentOrders,
    salesCategoryFilter,
    orderStatusFilter,
    topProductsFilter,
    salesCategoryYear,
    orderStatusYear,
    topProductsYear,
    getResponsiveTitle,
    isAmbherOnlyUser,
    isBautistaOnlyUser,
    currentuserloggedin,
    adminfirstname,
    adminlastname
  ]);

  // Chart colors
  const CHART_COLORS = [
    '#184d85', '#2563eb', '#1c96c5', '#60a5fa', '#93c5fd',
    '#1e40af', '#1d4ed8', '#2563eb', '#1c96c5', '#60a5fa'
  ];

  // Optimized Effects with better dependency management
  useEffect(() => {
    console.log('🔍 useEffect triggered - activedashboard:', activedashboard);
    if (activedashboard === 'reportsandanalytics') {
      console.log('📊 Reports section accessed');
      
      // Only fetch if data is empty (first time) or if not loaded yet
      const safeAppointments = Array.isArray(reportsData.appointments) ? reportsData.appointments : [];
      const safeAmbherOrders = Array.isArray(reportsData.ambherOrders) ? reportsData.ambherOrders : [];
      const safeBautistaOrders = Array.isArray(reportsData.bautistaOrders) ? reportsData.bautistaOrders : [];
      
      if (!safeAppointments.length && !safeAmbherOrders.length && !safeBautistaOrders.length) {
        console.log('✅ Fetching reports data (empty data detected)');
        fetchReportsData();
      } else {
        console.log('✅ Using cached reports data - no refetch needed');
      }
    } else {
      console.log('❌ Not in reports section, no data fetch needed');
    }
  }, [activedashboard, fetchReportsData]);

  // No need for separate processChartsData useEffect - data is now processed automatically with useMemo






















//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 
//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 
//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 
//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 
//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 
//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 
//SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables //SMS Monitoring Variables 

// SMS Messages State Variables
const [smsMessages, setSmsMessages] = useState([]);
const [loadingSmsMessages, setLoadingSmsMessages] = useState(true);
const [errorLoadingSmsMessages, setErrorLoadingSmsMessages] = useState(null);
const [filteredSmsMessages, setFilteredSmsMessages] = useState([]);

// SMS Search and Filter States
const [searchSmsMessages, setSearchSmsMessages] = useState('');
const [smsStatusFilter, setSmsStatusFilter] = useState('all');
const [smsTypeFilter, setSmsTypeFilter] = useState('all');

// SMS Pagination
const [currentSmsPage, setCurrentSmsPage] = useState(1);
const smsMessagesPerPage = 10;

// Promotional SMS Modal States
const [showPromotionalSmsModal, setShowPromotionalSmsModal] = useState(false);
const [promotionalSmsSubject, setPromotionalSmsSubject] = useState('');
const [promotionalSmsMessage, setPromotionalSmsMessage] = useState('');
const [sendingSms, setSendingSms] = useState(false);

// SMS Credits State Variables
const [smsCredits, setSmsCredits] = useState(null);
const [loadingSmsCredits, setLoadingSmsCredits] = useState(false);
const [smsCreditsError, setSmsCreditsError] = useState(null);
const [lastCreditsUpdate, setLastCreditsUpdate] = useState(null);

// SMS Search functionality
const searchSmsDebounce = (functions, delay) => {
  let debounceTimer;
  return function(...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => functions.apply(context, args), delay);
  };
};

const filterSmsMessages = useCallback(searchSmsDebounce((term) => {
  if (!term.trim() && smsStatusFilter === 'all' && smsTypeFilter === 'all') {
    setFilteredSmsMessages(smsMessages);
    return;
  }

  const filtered = smsMessages.filter(sms => {
    const matchesSearch = !term.trim() || 
      sms.messageId?.toLowerCase().includes(term.toLowerCase()) ||
      sms.recipients?.toLowerCase().includes(term.toLowerCase()) ||
      sms.senderClinic?.toLowerCase().includes(term.toLowerCase()) ||
      sms.message?.toLowerCase().includes(term.toLowerCase());

    const matchesStatus = smsStatusFilter === 'all' || sms.status === smsStatusFilter;
    const matchesType = smsTypeFilter === 'all' || sms.type === smsTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  setFilteredSmsMessages(filtered);
}, 300), [smsMessages, smsStatusFilter, smsTypeFilter]);

// Fetch SMS Messages Data
const fetchSmsMessagesData = useCallback(async (forceRefresh = false) => {
  try {
    setLoadingSmsMessages(true);
    setErrorLoadingSmsMessages(null);

    // Get current user's clinic to filter SMS messages
    const currentUserClinic = getCurrentUserClinic();
    
    const smsMessages = await smartFetch(
      'sms_messages',
      async () => {
        // Request all messages with a large limit for frontend pagination
        // Add clinic filter to only get messages from the current user's clinic
        let apiUrl_withParams = `${apiUrl}/api/sms?limit=1000&page=1`;
        
        // Add clinic filter if user has a specific clinic (not admin)
        if (currentUserClinic && currentUserClinic.trim()) {
          apiUrl_withParams += `&clinic=${encodeURIComponent(currentUserClinic)}`;
        }
        
        const response = await fetch(apiUrl_withParams, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentusertoken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch SMS messages');
        const data = await response.json();
        
        // Debug: Log the API response to see what we're getting
        console.log('API Response Debug:', {
          'Response type': typeof data,
          'Has data property': !!data.data,
          'Data length': data?.data?.length || 0,
          'Total from API': data?.pagination?.total || 0,
          'Pages from API': data?.pagination?.pages || 0,
          'Current user clinic': currentUserClinic,
          'Response structure': {
            success: data.success,
            pagination: data.pagination,
            dataLength: data.data?.length
          }
        });
        
        return data;
      },
      CACHE_DURATIONS.SHORT, // 1 minute cache
      forceRefresh
    );

    // Get the SMS data from the response
    let smsData = smsMessages.data || smsMessages.smsMessages || smsMessages || [];
    
    // Add client-side filtering as a backup (in case the backend doesn't filter properly)
    if (currentUserClinic && currentUserClinic.trim() && smsData.length > 0) {
      smsData = smsData.filter(message => 
        message.senderClinic === currentUserClinic
      );
      
      // Removed debug logging to prevent console spam
    }
    
    setSmsMessages(smsData);
    
    // Let the filtering useEffect handle filtering automatically
  } catch (error) {
    console.error('Error fetching SMS messages:', error);
    setErrorLoadingSmsMessages(error.message);
    setSmsMessages([]);
    setFilteredSmsMessages([]);
  } finally {
    setLoadingSmsMessages(false);
  }
}, [smartFetch, CACHE_DURATIONS, currentusertoken, apiUrl, getCurrentUserClinic]);

// SMS Messages Filter Effects
useEffect(() => {
  // Only filter if we have SMS messages loaded
  if (smsMessages.length > 0) {
    filterSmsMessages(searchSmsMessages);
  } else {
    // Clear filtered messages when no SMS data
    setFilteredSmsMessages([]);
  }
}, [searchSmsMessages, smsStatusFilter, smsTypeFilter, filterSmsMessages, smsMessages]);

// Reset page to 1 when SMS data is first loaded
useEffect(() => {
  if (smsMessages.length > 0) {
    setCurrentSmsPage(1);
  }
}, [smsMessages.length]);

// Fetch SMS Credits function
const fetchSmsCredits = useCallback(async (forceRefresh = false) => {
  setLoadingSmsCredits(true);
  setSmsCreditsError(null);
  
  try {
    console.log('💳 Fetching SMS credits...');
    
    // Get current user's clinic
    const currentUserClinic = getCurrentUserClinic();
    console.log('🏥 Fetching SMS credits for clinic:', currentUserClinic);
    
    // Build URL with clinic parameter
    let creditsUrl = `${apiUrl}/api/sms/credits`;
    if (currentUserClinic && currentUserClinic.trim()) {
      creditsUrl += `?clinic=${encodeURIComponent(currentUserClinic)}`;
    }
    
    const response = await fetch(creditsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${currentusertoken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch SMS credits');
    const data = await response.json();
    
    if (data.success) {
      setSmsCredits(data.balance);
      setLastCreditsUpdate(new Date());
      console.log(`✅ SMS credits fetched: ${data.balance} credits remaining`);
    } else {
      throw new Error(data.error || 'Failed to get SMS credits');
    }
    
  } catch (error) {
    console.error('❌ Error fetching SMS credits:', error);
    setSmsCreditsError(error.message);
    setSmsCredits(null);
  } finally {
    setLoadingSmsCredits(false);
  }
}, [currentusertoken, apiUrl, getCurrentUserClinic]);

// Refresh SMS monitoring data function
const refreshSmsData = useCallback(async () => {
  console.log('🔄 Manual refresh of SMS data triggered');
  setLoadingSmsMessages(true);
  try {
    await fetchSmsMessagesData(true); // Force refresh bypassing cache
    await fetchSmsCredits(true); // Force refresh bypassing cache
    console.log('✅ SMS monitoring refresh completed');
  } catch (error) {
    console.error('❌ Error refreshing SMS data:', error);
  } finally {
    setLoadingSmsMessages(false);
  }
}, [fetchSmsMessagesData, fetchSmsCredits]);

// Refresh Profile Information data function
const refreshProfileData = useCallback(async () => {
  console.log('🔄 Manual refresh of profile data triggered');
  setloadingpatients(true);
  try {
    // Refresh patient accounts
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
    
    // Also refresh demographic data if it exists
    await fetchDemographicsData(true);
    
    console.log('✅ Profile data refresh completed');
  } catch (error) {
    console.error('❌ Error refreshing profile data:', error);
    setfailedloadingpatients(error.message);
  } finally {
    setloadingpatients(false);
  }
}, [currentusertoken, fetchDemographicsData]);

// Refresh Account Management data function
const refreshAccountData = useCallback(async () => {
  console.log('🔄 Manual refresh of all account data triggered');
  
  // Set all loading states to true
  setloadingpatients(true);
  setloadingstaffs(true);
  setloadingowners(true);
  setloadingadmins(true);
  
  // Clear any previous error states
  setfailedloadingpatients(null);
  setfailedloadingstaffs(null);
  setfailedloadingowners(null);
  setfailedloadingadmins(null);

  // Fetch all account types in parallel
  const fetchPromises = [];

  // Fetch patients
  fetchPromises.push(
    fetch('/api/patientaccounts', {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch patient accounts");
      }
      return response.json();
    })
    .then(patientdata => {
      setpatients(patientdata);
      console.log('✅ Patient account data refresh completed');
    })
    .catch(error => {
      console.error('❌ Error refreshing patient account data:', error);
      setfailedloadingpatients(error.message);
    })
    .finally(() => {
      setloadingpatients(false);
    })
  );

  // Fetch staffs
  fetchPromises.push(
    fetch('/api/staffaccounts', {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch staff accounts");
      }
      return response.json();
    })
    .then(staffdata => {
      // Apply clinic filtering (except for Admin)
      if (currentuserloggedin !== "Admin") {
        if (isAmbherOnlyUser()) {
          staffdata = staffdata.filter(staff => staff.staffclinic === "Ambher Optical");
        } else if (isBautistaOnlyUser()) {
          staffdata = staffdata.filter(staff => staff.staffclinic === "Bautista Eye Center");
        }
      }
      setstaffs(staffdata);
      console.log('✅ Staff account data refresh completed');
    })
    .catch(error => {
      console.error('❌ Error refreshing staff account data:', error);
      setfailedloadingstaffs(error.message);
    })
    .finally(() => {
      setloadingstaffs(false);
    })
  );

  // Fetch owners
  fetchPromises.push(
    fetch('/api/owneraccounts', {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch owner accounts");
      }
      return response.json();
    })
    .then(ownerdata => {
      // Apply clinic filtering (except for Admin)
      if (currentuserloggedin !== "Admin") {
        if (isAmbherOnlyUser()) {
          ownerdata = ownerdata.filter(owner => owner.ownerclinic === "Ambher Optical");
        } else if (isBautistaOnlyUser()) {
          ownerdata = ownerdata.filter(owner => owner.ownerclinic === "Bautista Eye Center");
        }
      }
      setowners(ownerdata);
      console.log('✅ Owner account data refresh completed');
    })
    .catch(error => {
      console.error('❌ Error refreshing owner account data:', error);
      setfailedloadingowners(error.message);
    })
    .finally(() => {
      setloadingowners(false);
    })
  );

  // Fetch admins
  fetchPromises.push(
    fetch('/api/adminaccounts', {
      headers: {
        'Authorization': `Bearer ${currentusertoken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch admin accounts");
      }
      return response.json();
    })
    .then(admindata => {
      setadmins(admindata);
      console.log('✅ Admin account data refresh completed');
    })
    .catch(error => {
      console.error('❌ Error refreshing admin account data:', error);
      setfailedloadingadmins(error.message);
    })
    .finally(() => {
      setloadingadmins(false);
    })
  );

  // Wait for all fetches to complete
  try {
    await Promise.allSettled(fetchPromises);
    console.log('🎉 All account data refresh operations completed');
  } catch (error) {
    console.error('❌ Unexpected error during account data refresh:', error);
  }
}, [currentusertoken, currentuserloggedin, isAmbherOnlyUser, isBautistaOnlyUser]);

// Initialize SMS data when component mounts
useEffect(() => {
  if (activedashboard === 'smsmonitoring') {
    fetchSmsMessagesData();
    fetchSmsCredits(); // Also fetch credits when entering SMS monitoring
  }
}, [activedashboard, fetchSmsMessagesData, fetchSmsCredits]);

// Listen for real-time SMS updates
useEffect(() => {
  if (realtimeUpdates.has('sms')) {
    fetchSmsMessagesData(true); // Force refresh on real-time update
  }
}, [realtimeUpdates, fetchSmsMessagesData]);

// Format SMS date helper function
const formatSmsDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get paginated SMS data
const getPaginatedSmsData = () => {
  const dataToDisplay = searchSmsMessages.trim() || smsStatusFilter !== 'all' || smsTypeFilter !== 'all' 
    ? filteredSmsMessages 
    : smsMessages;
  
  // Ensure dataToDisplay is an array
  if (!Array.isArray(dataToDisplay)) {
    console.warn('SMS data is not an array:', dataToDisplay);
    return [];
  }
  
  const startIndex = (currentSmsPage - 1) * smsMessagesPerPage;
  const endIndex = startIndex + smsMessagesPerPage;
  return dataToDisplay.slice(startIndex, endIndex);
};

// Handle SMS page change
const handleSmsPageChange = (page) => {
  setCurrentSmsPage(page);
};

// Send Promotional SMS Function
const sendPromotionalSms = async () => {
  if (!promotionalSmsSubject.trim() || !promotionalSmsMessage.trim()) {
    setSmsIsClicked(false);
    setSmsToastType('error');
    setSmsToastMessage('Please fill in both subject and message fields');
    setSmsToast(true);
    setSmsToastClosing(false);
    
    // Start progress animation
    setSmsProgressWidth('0%');
    setTimeout(() => setSmsProgressWidth('100%'), 100);
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setSmsToastClosing(true);
      setTimeout(() => {
        setSmsToast(false);
        setSmsToastClosing(false);
        setSmsProgressWidth('0%');
      }, 3000);
    }, 4000);
    return;
  }

  try {
    setSendingSms(true);
    
    // Get current clinic from localStorage
    const currentClinic = localStorage.getItem('staffclinic') || localStorage.getItem('ownerclinic');
    if (!currentClinic) {
      throw new Error('No clinic information found');
    }

    // Get current user information from localStorage based on user type
    let currentUserId;
    let currentUserName;
    
    // Try to get user data from different localStorage keys based on user type
    if (localStorage.getItem('stafftoken')) {
      // Staff user
      currentUserId = localStorage.getItem('staffid');
      currentUserName = localStorage.getItem('staffname') || 'Staff User';
    } else if (localStorage.getItem('ownertoken')) {
      // Owner user  
      currentUserId = localStorage.getItem('ownerid');
      currentUserName = localStorage.getItem('ownername') || 'Owner User';
    } else if (localStorage.getItem('admintoken')) {
      // Admin user
      currentUserId = localStorage.getItem('adminid');
      currentUserName = localStorage.getItem('adminname') || 'Admin User';
    } else {
      throw new Error('No valid user session found. Please log in again.');
    }

    if (!currentUserId) {
      throw new Error('User ID not found. Please log in again.');
    }

    const response = await fetch('/api/sms/promotional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admintoken') || localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken')}`
      },
      body: JSON.stringify({
        subject: promotionalSmsSubject,
        message: promotionalSmsMessage,
        senderClinic: currentClinic,
        senderUserId: currentUserId,
        senderUserName: currentUserName
      })
    });

    const result = await response.json();
    console.log('🐛 SMS Response Debug:', {
      httpStatus: response.status,
      responseOk: response.ok,
      result: result,
      hasSuccess: 'success' in result,
      successValue: result.success,
      successCount: result.successCount,
      failCount: result.failCount,
      error: result.error
    });

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send SMS');
    }

    // Check if the response indicates success but with detailed results
    const isSuccess = result.success && result.successCount > 0;
    const isPartialSuccess = result.success && result.successCount > 0 && result.failCount > 0;
    const isFailure = !result.success || result.successCount === 0;

    // Special handling for insufficient credits or when all messages failed
    if (result.error && (result.error.toLowerCase().includes('insufficient') || 
        result.error.toLowerCase().includes('credit')) ||
        (result.success && result.successCount === 0 && result.failCount > 0) ||
        (!result.success && result.successCount === 0)) {
      setSmsIsClicked(false);
      setSmsToastType('error');
      
      // More specific error message based on the failure type
      let errorMessage = 'Failed to send SMS.';
      if (result.error && result.error.toLowerCase().includes('insufficient')) {
        errorMessage = 'Insufficient SMS credits. Please top up your account to send messages.';
      } else if (result.error && result.error.toLowerCase().includes('credit')) {
        errorMessage = 'SMS credit issue detected. Please check your account balance.';
      } else if (result.failCount > 0) {
        errorMessage = `Failed to send SMS to all ${result.failCount} recipients. Please check your SMS credits.`;
      } else if (result.error) {
        errorMessage = result.error;
      }
      
      setSmsToastMessage(errorMessage);
      setSmsToast(true);
      setSmsToastClosing(false);
      
      // Start progress animation
      setSmsProgressWidth('0%');
      setTimeout(() => setSmsProgressWidth('100%'), 100);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setSmsToastClosing(true);
        setTimeout(() => {
          setSmsToast(false);
          setSmsToastClosing(false);
          setSmsProgressWidth('0%');
        }, 3000);
      }, 4000);
      
      // Clear form and close modal
      setPromotionalSmsSubject('');
      setPromotionalSmsMessage('');
      setShowPromotionalSmsModal(false);
      setSendingSms(false);
      
      // Refresh SMS credits to show updated balance
      await fetchSmsCredits(true);
      return;
    }

    // Show appropriate message based on results
    setSmsIsClicked(isSuccess);
    
    if (isFailure) {
      setSmsToastType('error');
      setSmsToastMessage(
        result.failCount 
          ? `Failed to send SMS to all ${result.failCount} recipients. ${result.error || 'Please check your SMS credits and try again.'}`
          : result.error || 'Failed to send SMS. Please try again.'
      );
    } else if (isPartialSuccess) {
      setSmsToastType('warning');
      setSmsToastMessage(`SMS sent to ${result.successCount} recipients (${result.failCount} failed). Please check your SMS credits.`);
    } else {
      setSmsToastType('success');
      setSmsToastMessage(`SMS sent successfully to ${result.successCount} recipients`);
    }
    setSmsToast(true);
    setSmsToastClosing(false);
    
    // Start progress animation
    setSmsProgressWidth('0%');
    setTimeout(() => setSmsProgressWidth('100%'), 100);
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setSmsToastClosing(true);
      setTimeout(() => {
        setSmsToast(false);
        setSmsToastClosing(false);
        setSmsProgressWidth('0%');
      }, 3000);
    }, 4000);

    // Clear form and close modal
    setPromotionalSmsSubject('');
    setPromotionalSmsMessage('');
    setShowPromotionalSmsModal(false);

    // Refresh SMS messages list and credits
    await fetchSmsMessagesData(true);
    await fetchSmsCredits(true); // Refresh credits after sending SMS

  } catch (error) {
    console.error('Error sending promotional SMS:', error);
    setSmsIsClicked(false);
    setSmsToastType('error');
    setSmsToastMessage(error.message || 'Failed to send promotional SMS');
    setSmsToast(true);
    setSmsToastClosing(false);
    
    // Start progress animation
    setSmsProgressWidth('0%');
    setTimeout(() => setSmsProgressWidth('100%'), 100);
    
    // Auto-hide toast after 4 seconds
    setTimeout(() => {
      setSmsToastClosing(true);
      setTimeout(() => {
        setSmsToast(false);
        setSmsToastClosing(false);
        setSmsProgressWidth('0%');
      }, 3000);
    }, 4000);
  } finally {
    setSendingSms(false);
  }
};

// Handle promotional SMS modal close
const handleClosePromotionalSmsModal = () => {
  setShowPromotionalSmsModal(false);
  setPromotionalSmsSubject('');
  setPromotionalSmsMessage('');
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
const userMarkerRef = useRef(null); // Use a ref to persist user location marker
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
    const baseUrl = apiUrl || '';
    
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
                           accuracy <= 50 ? '#1c96c5' :  // Blue (good precision)
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
    // Remove previous user location marker if it exists
    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.remove();
      } catch (error) {
        console.warn('Error removing previous user marker:', error);
      }
      userMarkerRef.current = null;
    }
    
    // Remove previous accuracy circle if it exists
    if (map.current.getSource('user-accuracy-circle')) {
      try {
        map.current.removeLayer('user-accuracy-circle');
        map.current.removeSource('user-accuracy-circle');
      } catch (error) {
        console.warn('Error removing previous accuracy circle:', error);
      }
    }
    
    // Add new user location marker
    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-md animate-location-pulse transform-gpu will-change-auto';

    const userMarker = new mapboxgl.Marker(userMarkerEl)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);
    
    // Store the marker in the ref for future cleanup
    userMarkerRef.current = userMarker;

    // Center map on user location with smooth animation
    map.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: 12,
      duration: 2000, // 2 seconds for smooth transition
      essential: true, // This animation is essential for accessibility
      easing: (t) => t * (2 - t) // Smooth easing function (ease-out)
    });
  }
  
  // Cleanup function to remove marker when component unmounts or userLocation changes
  return () => {
    if (userMarkerRef.current) {
      try {
        userMarkerRef.current.remove();
      } catch (error) {
        console.warn('Error removing user marker on cleanup:', error);
      }
      userMarkerRef.current = null;
    }
    
    // Also remove accuracy circle on cleanup
    if (map.current && map.current.getSource('user-accuracy-circle')) {
      try {
        map.current.removeLayer('user-accuracy-circle');
        map.current.removeSource('user-accuracy-circle');
      } catch (error) {
        console.warn('Error removing accuracy circle on cleanup:', error);
      }
    }
  };
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


      {/* Main Dashboard Content - Only show after authentication is verified */}
      {!isAuthenticating && (
        <>
          {/* NavBar */}
          <div className="rounded-full mt-2 ml-3 mr-3 bg-sky-900 ">
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

     <img src={adminprofilepicture || defaultprofilepic} alt="Profile" className="h-10 w-10 rounded-full"></img>
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
          <div className={`relative z-30 transition-all duration-300 ease-in-out flex flex-col justify-between items-start pl-3 bg-black/90  rounded-2xl    ml-3 mb-3 pt-3 pb-3 ${sidebarexpanded ? 'w-[365px]' : 'w-[85px]'}`} id="adminsidebar">

              <div className="group relative " id="expandbtn" onClick={toggleadminsidebar} ><div className="hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl  transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden">{sidebarexpanded &&(<i className='bx bx-collapse-horizontal  p-2 hover:text-white text-white text-[40px] ' ></i>)}   {!sidebarexpanded &&(<i className='bx bx-expand-horizontal  p-2 hover:text-white text-white text-[40px] ' ></i>)}<span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>{sidebarexpanded ? 'Collapse Sidebar' : ''}</span></div></div>
          
              <div className="group relative mt-5" onClick={() => showdashboard('summaryoverview')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl mr-2 transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden ${activedashboard ==='summaryoverview' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bx-list-ul  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='summaryoverview' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>   <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Summary Overview</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute  p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Summary Overview</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('accountmanagement')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden ${activedashboard ==='accountmanagement' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-user-account  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='accountmanagement' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Account Management</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Account Management</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('profileinformation')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='profileinformation' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-user-detail  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='profileinformation' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Profile Information</span>  {!sidebarexpanded && (<span className=" pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Profile Information</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('appointmentmanagement')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='appointmentmanagement' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-calendar  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='appointmentmanagement' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Appointment Management</span>  {!sidebarexpanded && (<span className=" pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Appointment Management</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('medicalrecords')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='medicalrecords' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-data  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='medicalrecords' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Medical Records</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Medical Records</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('inventorymanagement')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='inventorymanagement' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-package   p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='inventorymanagement' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={` text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Inventory Management</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Inventory Management</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('billingsandorders')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='billingsandorders' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-receipt   p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='billingsandorders' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Billing & Orders</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Billing & Orders</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('reportsandanalytics')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='reportsandanalytics' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-report  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='reportsandanalytics' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>Reports & Analytics</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">Reports & Analytics</span>)}  </div></div>
              <div className="group relative" onClick={() => showdashboard('smsmonitoring')}><div className={`hover:bg-[#454545] hover:rounded-2xl  hover:cursor-pointer rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center w-fit overflow-hidden  ${activedashboard ==='smsmonitoring' ? 'bg-[#454545] rounded-2xl' :''}`}><i className={`bx bxs-message  p-3.5    text-[#cacacf] hover:text-white text-[27px]${activedashboard ==='smsmonitoring' ? 'bg-[#454545] rounded-2xl text-white text-[27px]' :''}`}></i>  <span className={`text-[16px] text-white font-semibold font-albertsans transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${sidebarexpanded ? 'opacity-100 w-auto ml-2 mr-2 animate-slideIn' : 'opacity-0 w-0 animate-slideOut'}`}>SMS Monitoring</span>  {!sidebarexpanded && (<span className="pointer-events-none absolute p-4 rounded-2xl ml-4 left-full text-white font-albertsans font-semibold text-[16px] top-1/2 transform -translate-y-1/2  bg-[#2b2a2a]   whitespace-nowrap  group-hover:opacity-100 group-hover:translate-x-0  transition-all duration-300 ease-in-out opacity-0 -translate-x-2 ">SMS Monitoring</span>)}  </div></div>
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













































{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}

{ (activedashboard === 'medicalrecords' && !isAdminRole) && (<div id="medicalrecords" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   
  

<div className="flex items-center justify-between mb-4">
  <div className="flex items-center">
    <i className="bx bxs-data text-[#184d85] text-[25px] mr-2"/> 
    <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Medical Records</h1>
  </div>
  
  {/* Refresh Button */}
  <div className="flex space-x-3">
    <div
      onClick={refreshMedicalRecordsData}
      disabled={loadingpatientdemographics}
      className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loadingpatientdemographics ? 'animate-spin' : ''}`} />
      {loadingpatientdemographics ? 'Refreshing...' : 'Refresh'}
    </div>
  </div>
</div>








{activemedicalrecordstable === 'allmedicalrecordstable' && (
  <div id="allmedicalrecordstable" className="animate-fadeInUp flex flex-col items-center w-[100%] h-[90%] rounded-2xl mt-5">
    <div className="mt-5 w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
      <div className="ml-2 w-full flex items-center">
        <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
        <div className="relative w-full flex items-center justify-center gap-3">
          <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
          <input 
            type="text" 
            placeholder="Search patients, appointments, medical documents, etc..." 
            value={searchmedicalrecords}
            onChange={(e) => setsearchmedicalrecords(e.target.value)}
            className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
          />
        </div>
      </div>
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
      <div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">
        No patient medical records found.
      </div>
    ) : (
      <div className="overflow-y-auto overflow-hidden rounded-3xl w-full mt-2 bg-[#f7f7f7]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-">
            <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
              <th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Last Ambher Appointment</th> 
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">Last Bautista Appointment</th>
              <th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {(() => {
              const dataToDisplay = searchmedicalrecords.trim() ? filteredmedicalrecords : filteredmedicalrecords;
              const sortedMedicalRecords = dataToDisplay.sort((a, b) => {
                // Get the latest appointment date for patient a
                const lastAmbherA = patientappointments
                  .filter(app => app.patientappointmentemail === a.patientemail && app.patientambherappointmentdate && app.patientambherappointmentstatus === 'Completed')
                  .sort((x, y) => new Date(y.patientambherappointmentdate) - new Date(x.patientambherappointmentdate))[0];
                
                const lastBautistaA = patientappointments
                  .filter(app => app.patientappointmentemail === a.patientemail && app.patientbautistaappointmentdate && app.patientbautistaappointmentstatus === 'Completed')
                  .sort((x, y) => new Date(y.patientbautistaappointmentdate) - new Date(x.patientbautistaappointmentdate))[0];
                
                // Get the latest appointment date for patient b
                const lastAmbherB = patientappointments
                  .filter(app => app.patientappointmentemail === b.patientemail && app.patientambherappointmentdate && app.patientambherappointmentstatus === 'Completed')
                  .sort((x, y) => new Date(y.patientambherappointmentdate) - new Date(x.patientambherappointmentdate))[0];
                
                const lastBautistaB = patientappointments
                  .filter(app => app.patientappointmentemail === b.patientemail && app.patientbautistaappointmentdate && app.patientbautistaappointmentstatus === 'Completed')
                  .sort((x, y) => new Date(y.patientbautistaappointmentdate) - new Date(x.patientbautistaappointmentdate))[0];
                
                // Find the most recent date for each patient
                const dateA = Math.max(
                  lastAmbherA ? new Date(lastAmbherA.patientambherappointmentdate).getTime() : 0,
                  lastBautistaA ? new Date(lastBautistaA.patientbautistaappointmentdate).getTime() : 0
                );
                
                const dateB = Math.max(
                  lastAmbherB ? new Date(lastAmbherB.patientambherappointmentdate).getTime() : 0,
                  lastBautistaB ? new Date(lastBautistaB.patientbautistaappointmentdate).getTime() : 0
                );
                
                // Sort in descending order (most recent first)
                return dateB - dateA;
              });
              
              const paginatedMedicalRecords = getPaginatedData(sortedMedicalRecords, 'medicalRecords');
              return paginatedMedicalRecords.map((patients) => (
                <tr 
                  key={patients._id}
                  className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
                >
                  <td className="py-3 px-6 font-albertsans text-[#171717] text-center text-[15px] font-medium">
                    #{patients.patientdemographicId}
                  </td>
                  <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                    <div className="flex items-center">
                      <img 
                        src={patients.patientprofilepicture || defaultprofilepic} 
                        alt="Profile" 
                        className="rounded-full h-12 mr-3 w-12 object-cover"
                        onError={(e) => {
                          e.target.src = defaultprofilepic;
                        }}
                      />
                      <h1 className="font-albertsans text-[#171717] text-center text-[15px] font-medium ml-3">
                        {patients.patientfirstname} {patients.patientmiddlename} {patients.patientlastname}
                      </h1>
                      <p className="text-[12px] text-gray-500 ml-1">
                        {patients.patientage} years old • {patients.patientgender}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                    {(() => {
                      const lastambherappointment = patientappointments
                        .filter(lastapp => lastapp.patientappointmentemail === patients.patientemail && lastapp.patientambherappointmentdate && lastapp.patientambherappointmentstatus === 'Completed')
                        .sort((a,b) => new Date(b.patientambherappointmentdate) - new Date(a.patientambherappointmentdate))[0];
                      
                      return lastambherappointment ? (
                        <div>
                          <p>{formatappointmatedates(lastambherappointment.patientambherappointmentdate)}</p>
                          <p className="text-gray-500 text-[14px]">
                            {formatappointmenttime(lastambherappointment.patientambherappointmenttime)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No completed appointments</p>
                      );
                    })()}
                  </td>

                  <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                    {(() => {
                      const lastbautistaappointment = patientappointments
                        .filter(lastapp => lastapp.patientappointmentemail === patients.patientemail && lastapp.patientbautistaappointmentdate && lastapp.patientbautistaappointmentstatus === 'Completed')
                        .sort((a,b) => new Date(b.patientbautistaappointmentdate) - new Date(a.patientbautistaappointmentdate))[0];
                      
                      return lastbautistaappointment ? (
                        <div>
                          <p>{formatappointmatedates(lastbautistaappointment.patientbautistaappointmentdate)}</p>
                          <p className="text-gray-500 text-[14px]">
                            {formatappointmenttime(lastbautistaappointment.patientbautistaappointmenttime)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No completed appointments</p>
                      );
                    })()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">
                    <div 
                      onClick={async () => { 
                        setshowpatientmedicalrecord(true);
                        
                        // Fetch the complete patient record including medical documents
                        try {
                          const response = await fetch(`/api/patientdemographics/patientemail/${patients.patientemail}`, {
                            headers: {
                              'Authorization': `Bearer ${currentusertoken}`
                            }
                          });
                          
                          if (response.ok) {
                            const completePatientRecord = await response.json();
                            setselectedpatientmedicalrecord(completePatientRecord);
                            console.log('Fetched complete patient record with medical documents:', completePatientRecord);
                          } else {
                            // Fallback to the basic patient data
                            setselectedpatientmedicalrecord(patients);
                            console.log('Failed to fetch complete record, using basic data');
                          }
                        } catch (error) {
                          // Fallback to the basic patient data
                          setselectedpatientmedicalrecord(patients);
                          console.error('Error fetching complete patient record:', error);
                        }
                      }} 
                      className="bg-[#383838] hover:bg-[#595959] mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"
                    >
                      <h1 className="text-white">View</h1>
                    </div>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>
    )}

<div className="w-full flex items-start justify-start">
    {/* Pagination Component for Medical Records */}
    {(() => {
      const dataToDisplay = searchmedicalrecords.trim() ? filteredmedicalrecords : filteredmedicalrecords;
      const totalMedicalRecords = dataToDisplay.length;
      const totalPages = Math.ceil(totalMedicalRecords / medicalRecordsPerPage);

      return totalMedicalRecords > 0 && (
        <PaginationComponent
          currentPage={currentPage.medicalRecords}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange('medicalRecords', page)}
          totalItems={totalMedicalRecords}
          itemsPerPage={medicalRecordsPerPage}
          itemName="medical records"
        />
      );
    })()}
    </div>
  </div>
)}









{showpatientmedicalrecord && (
<div id="patientdemographicprofileform" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50 ">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[1300px] h-[780px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bxs-data text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Patient Medical Record
            </h2>
            <p className="text-sm text-gray-500">Medical Record History</p>
          </div>
        </div>
  <div 
    onClick={() => setshowpatientmedicalrecord(false)} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"/>
  </div>
</div>

{!selectedpatientmedicalrecord ? (
  <div className="flex justify-center items-center h-[670px]">
    <div className="text-center">
      <i className="bx bx-loader-alt animate-spin text-4xl text-blue-500 mb-4"></i>
      <p className="text-gray-600">Loading patient record...</p>
    </div>
  </div>
) : (
<div className="flex gap-6 min-h-[650px] h-auto w-full ">
  <div className="flex flex-col items-center w-[28%] bg-gray-50 rounded-2xl p-6">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mb-6">
        <img src={selectedpatientmedicalrecord?.patientprofilepicture} className="w-full h-full object-cover" alt="Patient Profile"/>
      </div>
      
       <div className="space-y-3 w-full">
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm w-24 shrink-0">Name:</span>
          <span className="bg-white px-3 py-2 rounded-lg text-gray-800 font-medium text-sm flex-1">{selectedpatientmedicalrecord?.patientfirstname} {selectedpatientmedicalrecord?.patientlastname}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm w-24 shrink-0">Email:</span>
          <span className="bg-white px-3 py-2 rounded-lg text-gray-800 font-medium text-sm flex-1 truncate">{selectedpatientmedicalrecord?.patientemail}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm w-24 shrink-0">Contact:</span>
          <span className="bg-white px-3 py-2 rounded-lg text-gray-800 font-medium text-sm flex-1">{selectedpatientmedicalrecord?.patientcontactnumber}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm w-24 shrink-0">Gender:</span>
          <span className="bg-white px-3 py-2 rounded-lg text-gray-800 font-medium text-sm flex-1">{selectedpatientmedicalrecord?.patientgender}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm w-24 shrink-0">Age:</span>
          <span className="bg-white px-3 py-2 rounded-lg text-gray-800 font-medium text-sm flex-1">{selectedpatientmedicalrecord?.patientage}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-gray-600 font-medium text-sm w-24 shrink-0">Birthdate:</span>
          <span className="bg-white px-3 py-2 rounded-lg text-gray-800 font-medium text-sm flex-1">{selectedpatientmedicalrecord?.patientbirthdate ? formatappointmatedates(selectedpatientmedicalrecord.patientbirthdate) : ''}</span>
        </div>





       </div>
  </div>
  
  <div id="patientmedicalrecordtabs" className="flex flex-col w-[72%]">
      <div className="flex gap-3 mb-4">


       <div
          onClick={() => showpatientmedicalrecordstable('patientmedicalrecord')}  
          className={`cursor-pointer flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            activepatientmedicalrecordstable === 'patientmedicalrecord' 
              ? 'bg-sky-800 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Patient Record
        </div>

        <div 
          onClick={() => showpatientmedicalrecordstable('medicalrecordsconsultationtable')}  
          className={`cursor-pointer flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            activepatientmedicalrecordstable === 'medicalrecordsconsultationtable' 
              ? 'bg-sky-800 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Consultation
        </div>
        
        <div
          onClick={() => showpatientmedicalrecordstable('medicaldocumentstable')}  
          className={`cursor-pointer flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            activepatientmedicalrecordstable === 'medicaldocumentstable' 
              ? 'bg-sky-800 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Medical Documents
        </div>



        
        <div
          onClick={() => showpatientmedicalrecordstable('medicalrecordspastvisitstable')}  
          className={`cursor-pointer flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            activepatientmedicalrecordstable === 'medicalrecordspastvisitstable' 
              ? 'bg-sky-800 text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Other Clinic Records
        </div>
        

      </div>

 { activepatientmedicalrecordstable === 'medicalrecordsconsultationtable' && (
  <div id='medicalrecordsconsultationtable' className="overflow-y-auto p-4 w-full flex-1 bg-gray-50 rounded-xl border border-gray-200" style={{ maxHeight: '600px' }}>  

   {(() => {
           const completedAppointments = patientappointments
             .filter(appointment => 
                     appointment.patientappointmentemail === selectedpatientmedicalrecord.patientemail && 
                     ((appointment.patientambherappointmentstatus === 'Completed') || 
                      (appointment.patientbautistaappointmentstatus === 'Completed')))

             .flatMap(appointment => {
                const appointments = [];

                if(appointment.patientambherappointmentstatus === 'Completed'){
                  const ambherAppt = {
                      _id: appointment._id,
                      patientappointmentid: appointment.patientappointmentid,
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
                      consultationprescription: appointment.patientambherappointmentprescription,
                      createdAt: appointment.createdAt,
                      updatedAt: appointment.updatedAt
                  };
                  appointments.push(ambherAppt);
                }

                if(appointment.patientbautistaappointmentstatus === 'Completed'){
                  const bautistaAppt = {
                      _id: appointment._id,
                      patientappointmentid: appointment.patientappointmentid,
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
                      consultationprescription: appointment.patientbautistaappointmentprescription,
                      createdAt: appointment.createdAt,
                      updatedAt: appointment.updatedAt
                  };
                  appointments.push(bautistaAppt);
                }

                return appointments;
             })
             .sort((a, b) => {
                const datea = new Date(a.date);
                const dateb = new Date(b.date);
                return dateb - datea;
             });

       return completedAppointments.map((appointment, index) => (
         <div key={index} className="p-4 mb-3 w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
            <div className="flex-1 px-3">
                <h3 className="font-medium text-gray-800 text-base truncate">
                  {appointment.consultationremarkssubject || `${appointment.clinicType === 'ambher' ? 'Ambher' : 'Bautista'} Appointment`}
                </h3>
                <p id="clinicname" className="text-xs text-gray-500">
                  {appointment.clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center'}
                </p>
            </div>

            <div className="flex-1 px-3 text-center">
              <p className="font-medium text-gray-800 text-sm">
                {formatappointmatedates(appointment.date)}
              </p> 
              <p className="text-gray-500 text-xs">
                {formatappointmenttime(appointment.time)}
              </p> 
            </div>

            <div className="flex-1 px-3 text-center">
              <p className="font-medium text-gray-800 text-sm truncate">
                {appointment.eyespecialist || `${appointment.clinicType === 'ambher' ? 'Ambher' : 'Bautista'} Clinic`}
              </p>
              <p className="text-xs text-gray-500">
                {appointment.eyespecialist ? 'Specialist assigned' : 'Clinic appointment'}
              </p>
            </div>

            <div className="px-3">
              <div 
                onClick={() => {
                  console.log('Selected appointment data:', appointment);
                  setshowpatientmedicalrecordconsultation(true);
                  setselectedpatientappointment(appointment);
                }} 
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
               <i className="bx bx-show mr-2"></i>
              </div>
            </div>
         </div>
       ));
             
      })()}      

</div>
)}


 { activepatientmedicalrecordstable === 'medicalrecordspastvisitstable' && (
  <div id='medicalrecordspastvisitstable' className="overflow-y-auto w-full flex-1 flex flex-col" style={{ maxHeight: '570px' }}>  
     <div 
       onClick={() => setshowpatientaddothermedicalrecord(true)}  
       className="cursor-pointer mb-4 py-3 px-4 bg-[#6AA84F] hover:bg-[#5f9747] text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
     >
       <span>Add Record</span>
     </div>

     {/* Search and Filter Section */}
     <div id="searchpastvisitstable" className="w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5 ">              
       <div className="ml-2 w-full flex items-center">
         <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
         <div className="relative w-full flex items-center justify-center gap-3">
           <div className="relative flex-1">
             <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500"></i>
             <input 
               type="text" 
               placeholder="Search by clinic name, specialist, submitted by..." 
               value={searchpastvisitstable}
               onChange={(e) => setsearchpastvisitstable(e.target.value)}
               className="transition-all duration-300 ease-in-out py-2 pl-10 pr-4 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
             />
           </div>
           

         </div>
       </div>
     </div>
     
  <div className="overflow-y-auto p-4 w-full flex-1 bg-gray-50 rounded-xl border border-gray-200"> 

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
<div className="text-center text-red-500 p-6 bg-red-50 rounded-xl border border-red-200">
<i className="bx bx-error text-2xl mb-2"></i>
<p className="mb-3">{patientdemoerror}</p>
<button 
  onClick={() => fetchDemographicsData(true)} 
  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
>
  Retry
</button>
</div>
);
}

if (filteredOtherClinicRecords.length === 0) {
return <div className="text-center text-gray-500 py-8">No other clinic records found</div>;
}

return filteredOtherClinicRecords.map((record) => (
<div key={record._id || record.otherclinicid} className="h-20 p-4 mb-3 w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
<div className="flex-1 px-3">
<h3 className="font-medium text-gray-800 text-base truncate w-70">{record.patientotherclinicname}</h3>
<p className="text-xs text-gray-500">Added by {record.patientotherclinicsubmittedbyfirstname} {record.patientotherclinicsubmittedbylastname}</p>

  

</div>

<div className="flex-1 px-3 text-center">
<p className="font-medium text-gray-800 text-sm">{formatappointmatedates(record.patientotherclinicconsultationdate)}</p>
<p className="text-xs text-gray-500">Consultation Date</p>
</div>


  {record.patientothercliniceyespecialist && (
<div className="flex-1 px-3 text-center">

<p className="font-medium text-gray-800 text-sm">{record.patientothercliniceyespecialist}</p>
<p className="text-xs text-gray-500">Eye Specialist</p>
</div>
)}

<div className="px-3 flex gap-2">
<button 
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
      patientotherclinicrecordimage: record.patientotherclinicrecordimage,
      patientotherclinidescription: record.patientotherclinidescription
    });
  }} 
  style={{
    backgroundColor: "#1f2937",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#374151"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#1f2937"}
>
  <i className="bx bx-show text-lg"></i>
</button>

<button 
  onClick={() => {
    setselectedpatientappointment({
      ...record,
      otherclinicid: record.patientotherclinicrecordid,
      date: record.patientotherclinicconsultationdate,
      eyespecialist: record.patientothercliniceyespecialist,
      clinicname: record.patientotherclinicname,
      submittedbyfirstname: record.patientotherclinicsubmittedbyfirstname,
      submittedbymiddlename: record.patientotherclinicsubmittedbymiddlename,
      submittedbylastname: record.patientotherclinicsubmittedbylastname,
      patientotherclinicrecordimage: record.patientotherclinicrecordimage,
      patientotherclinidescription: record.patientotherclinidescription
    });
    setshowdeleteotherclinicrecorddialog(true);
  }}
  style={{
    backgroundColor: "#dc2626",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#b91c1c"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#dc2626"}
>
  <i className="bx bxs-trash text-sm"/>
</button>
</div>
</div>
));
})()}

          
          
  </div>
   </div>
 )}

 { activepatientmedicalrecordstable === 'medicaldocumentstable' && (

  <div id='medicaldocumentstable' className="overflow-y-auto w-full flex-1 flex flex-col" style={{ maxHeight: '570px' }}>  
     <div 
       onClick={() => setshowpatientaddmedicaldocument(true)}  
       className="cursor-pointer mb-4 py-3 px-4 bg-[#6AA84F] hover:bg-[#5f9747] text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
     >
       <i className="bx bx-file-plus text-lg"/>
       <span>Upload Document</span>
     </div>


         <div id="searchdocumentstable" className="w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
      <div className="ml-2 w-full flex items-center">
        <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
        <div className="relative w-full flex items-center justify-center gap-3">
          <div className="relative flex-1">
            <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500"></i>
            <input 
              type="text" 
              placeholder="Search by name, document title, description..." 
              value={searchmedicaldocuments}
              onChange={(e) => setsearchmedicaldocuments(e.target.value)}
              className="transition-all duration-300 ease-in-out py-2 pl-10 pr-4 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
            />
          </div>
          
          {/* Clinic Filter Dropdown */}
          <div className="relative">
            <select
              value={medicaldocumentclinicfilter}
              onChange={(e) => setmedicaldocumentclinicfilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer min-w-[160px]"
            >
              <option value="all">All Clinics</option>
              <option value="ambher">Ambher Optical</option>
              <option value="bautista">Bautista Eye Center</option>
            </select>
            <i className="bx bx-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
          </div>
        </div>
      </div>
    </div>
     
  <div id="medicaldocumentslist" className="overflow-y-auto p-4 w-full flex-1 bg-gray-50 rounded-xl border border-gray-200"> 

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
<div className="text-center text-red-500 p-6 bg-red-50 rounded-xl border border-red-200">
<i className="bx bx-error text-2xl mb-2"></i>
<p className="mb-3">{patientdemoerror}</p>
<button 
  onClick={() => fetchDemographicsData(true)} 
  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
>
  Retry
</button>
</div>
);
}

const patientMedicalDocuments = selectedpatientmedicalrecord?.patientmedicaldocuments || [];

if (patientMedicalDocuments.length === 0) {
return <div className="text-center text-gray-500 py-8">No medical documents uploaded yet</div>;
}

// Apply filtering to the medical documents
const filteredDocuments = filterPatientDocuments(patientMedicalDocuments);

if (filteredDocuments.length === 0) {
return <div className="text-center text-gray-500 py-8">No documents match the current search criteria</div>;
}

return filteredDocuments
.sort((a, b) => new Date(b.addedbydate) - new Date(a.addedbydate))
.map((document, index) => (
<div key={document._id || index} className="h-20 p-4 mb-3 w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
<div className="flex-1 px-3">
<h3 className="font-medium text-gray-800 text-base truncate  w-70">{document.documentname || document.originalname}</h3>
<p className="text-xs text-gray-500">Added by {document.addedbyname} ({document.addedbytype})</p>
{document.documentdescription && (
  <p className="text-xs text-gray-600 mt-1">{document.documentdescription}</p>
)}
</div>

<div className="flex-1 px-3 text-center">
<p className="font-medium text-gray-800 text-sm">{formatappointmatedates(document.addedbydate)}</p>
<p className="text-xs text-gray-500">{document.addedbyclinic}</p>
</div>

<div className="flex-1 px-3 text-center">
<p className="font-medium text-gray-800 text-sm">{(document.size / 1024 / 1024).toFixed(2)} MB</p>
<p className="text-xs text-gray-500">{document.mimetype}</p>
</div>

<div className="px-3 flex gap-2">
<button 
  onClick={() => {
    if (document.mimetype.startsWith('image/')) {
      setshowmedicaldocumentimage(true);
      setselectedmedicaldocument(document);
    } else {
      // For non-image files, trigger download with proper filename
      const downloadWithProperName = async () => {
        try {
          const response = await fetch(document.url);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          const link = window.document.createElement('a');
          link.href = url;
          link.download = document.originalname || document.filename;
          
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Download failed:', error);
          // Fallback to direct link
          const link = window.document.createElement('a');
          link.href = document.url;
          link.download = document.originalname || document.filename;
          link.target = '_blank';
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
        }
      };
      
      downloadWithProperName();
    }
  }} 
  style={{
    backgroundColor: "#1f2937",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#374151"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#1f2937"}
>
  {document.mimetype.startsWith('image/') ? (
    <i className="bx bx-show text-lg"></i>
  ) : (
    <i className="bx bx-download text-lg"></i>
  )}
</button>

<button 
  onClick={() => {
    setselectedmedicaldocument(document);
    setshowdeletemedicaldocumentdialog(true);
  }}
  style={{
    backgroundColor: "#dc2626",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = "#b91c1c"}
  onMouseLeave={(e) => e.target.style.backgroundColor = "#dc2626"}
>
  <i className="bx bxs-trash text-sm"/>
  
</button>
</div>
</div>
));
})()}

          
          
  </div>
   </div>

 )}


 { activepatientmedicalrecordstable === 'patientmedicalrecord' && (

  <div id='patientmedicalrecord' className="w-full flex-1 flex flex-col">  

     {/* Conditional buttons based on user's clinic - Admin excluded */}
     {((currentuserloggedin === "Staff" && (localStorage.getItem('staffclinic') === "Bautista Eye Center" || staffclinic === "Bautista Eye Center")) ||
       (currentuserloggedin === "Owner" && ownerownedclinic === "Bautista Eye Center")) && (
       <div 
         onClick={openNewMedicalRecordForm}  
         className="cursor-pointer mb-4 py-3 px-4 bg-[#4A90E2] hover:bg-[#357ABD] text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
       >
         <i className="bx bx-file-plus text-lg"/>
         <span>Add Bautista Eye Center Patient Record</span>
       </div>
     )}
     
     {((currentuserloggedin === "Staff" && (localStorage.getItem('staffclinic') === "Ambher Optical" || staffclinic === "Ambher Optical")) ||
       (currentuserloggedin === "Owner" && ownerownedclinic === "Ambher Optical")) && (
       <div 
         onClick={openNewAmbherMedicalRecordForm}
         className="cursor-pointer mb-4 py-3 px-4 bg-[#6AA84F] hover:bg-[#5f9747] text-white rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
       >
         <i className="bx bx-file-plus text-lg"/>
         <span>Add Ambher Optical Patient Record</span>
       </div>
     )}


         <div id="searchdocumentstable" className="w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
      <div className="ml-2 w-full flex items-center">
        <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
        <div className="relative w-full flex items-center justify-center gap-3">
          <div className="relative flex-1">
            <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500"></i>
            <input 
              type="text" 
              placeholder="Search by name, document title, description..." 
              value={searchmedicaldocuments}
              onChange={(e) => setsearchmedicaldocuments(e.target.value)}
              className="transition-all duration-300 ease-in-out py-2 pl-10 pr-4 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
            />
          </div>
          
          {/* Clinic Filter Dropdown */}
          <div className="relative">
            <select
              value={medicaldocumentclinicfilter}
              onChange={(e) => setmedicaldocumentclinicfilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-2xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer min-w-[160px]"
            >
              <option value="all">All Clinics</option>
              <option value="ambher">Ambher Optical</option>
              <option value="bautista">Bautista Eye Center</option>
            </select>
            <i className="bx bx-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
          </div>
        </div>
      </div>
    </div>

  <div id="patientmedicalrecordstable" className="overflow-y-auto p-4 w-full flex-1 bg-gray-50 rounded-xl border border-gray-200" style={{ maxHeight: '450px' }}>
    {(() => {
      // Show loading skeleton while fetching records
      if (loadingpatientdemographics) {
        return (
          <div className="space-y-3">
            {[...Array(medicalRecordsPerPage)].map((_, index) => (
              <div key={index} className="h-20 p-4 mb-3 w-full bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
                <div className="flex justify-between items-center h-full">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      // Show error message if failed to load
      if (patientdemoerror) {
        return (
          <div className="text-center text-red-500 p-6 bg-red-50 rounded-xl border border-red-200">
            <i className="bx bx-error text-2xl mb-2"></i>
            <p className="mb-3">{patientdemoerror}</p>
            <button 
              onClick={() => fetchDemographicsData(true)} 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        );
      }

      const patientBautistaRecords = selectedpatientmedicalrecord?.patientmedicalrecordbautista || [];
      const patientAmbherRecords = selectedpatientmedicalrecord?.patientmedicalrecordambher || [];
      
      // Debug logging to see what records are being received
      console.log('=== MEDICAL RECORDS DEBUG ===');
      console.log('selectedpatientmedicalrecord:', selectedpatientmedicalrecord);
      console.log('patientBautistaRecords:', patientBautistaRecords);
      console.log('patientAmbherRecords:', patientAmbherRecords);
      console.log('Bautista count:', patientBautistaRecords.length);
      console.log('Ambher count:', patientAmbherRecords.length);
      
      // Combine both types of records with a type identifier
      const combinedMedicalRecords = [
        ...patientBautistaRecords.map(record => ({ 
          ...record, 
          recordType: 'Bautista Eye Center',
          caseNo: record.caseNo // Keep original case number field
        })),
        ...patientAmbherRecords.map(record => ({ 
          ...record, 
          recordType: 'Ambher Optical', 
          caseNo: record.ambheropticalcaseno // Map Ambher case number to common field
        }))
      ];
      
      console.log('combinedMedicalRecords:', combinedMedicalRecords);
      console.log('Combined total count:', combinedMedicalRecords.length);

      // Apply filters and search
      let filteredRecords = combinedMedicalRecords;

      // Apply clinic filter
      if (medicaldocumentclinicfilter !== 'all') {
        filteredRecords = filteredRecords.filter(record => {
          if (medicaldocumentclinicfilter === 'ambher') {
            return record.recordType === 'Ambher Optical';
          } else if (medicaldocumentclinicfilter === 'bautista') {
            return record.recordType === 'Bautista Eye Center';
          }
          return true;
        });
      }

      // Apply search filter
      if (searchmedicaldocuments.trim()) {
        const searchTerm = searchmedicaldocuments.toLowerCase().trim();
        filteredRecords = filteredRecords.filter(record => {
          return (
            record.patientfirstname?.toLowerCase().includes(searchTerm) ||
            record.patientlastname?.toLowerCase().includes(searchTerm) ||
            record.caseNo?.toLowerCase().includes(searchTerm) ||
            record.addedbyname?.toLowerCase().includes(searchTerm) ||
            record.recordType?.toLowerCase().includes(searchTerm) ||
            `${record.patientfirstname} ${record.patientlastname}`.toLowerCase().includes(searchTerm) ||
            record.diagnosis?.description?.toLowerCase().includes(searchTerm) ||
            record.chiefComplaint?.toLowerCase().includes(searchTerm)
          );
        });
      }

      // Sort the filtered records
      const sortedRecords = filteredRecords.sort((a, b) => {
        // Determine current user's clinic
        let currentUserClinic = '';
        if (currentuserloggedin === "Staff") {
          currentUserClinic = localStorage.getItem('staffclinic') || staffclinic;
        } else if (currentuserloggedin === "Owner") {
          currentUserClinic = ownerownedclinic;
        }
        
        // Priority sorting: current user's clinic records first
        const aIsUserClinic = a.recordType === currentUserClinic;
        const bIsUserClinic = b.recordType === currentUserClinic;
        
        // If one record is from user's clinic and the other is not, prioritize user's clinic
        if (aIsUserClinic && !bIsUserClinic) return -1;
        if (!aIsUserClinic && bIsUserClinic) return 1;
        
        // If both are from the same clinic category (both user's clinic or both not user's clinic),
        // sort by date (newest first)
        return new Date(b.recordDate) - new Date(a.recordDate);
      });

      if (sortedRecords.length === 0) {
        return (
          <div className="text-center text-gray-500 py-8">
            {searchmedicaldocuments.trim() || medicaldocumentclinicfilter !== 'all' 
              ? 'No medical records match your search criteria' 
              : 'No medical records found'}
          </div>
        );
      }

      // Get paginated data
      const paginatedRecords = getPaginatedData(sortedRecords, 'medicalRecords');

      return (
        <div className="flex flex-col h-full">
          {/* Records Display */}
          <div className="flex-1 space-y-3 mb-4">
            {paginatedRecords.map((record, index) => (
              <div key={record._id || index} className="h-20 p-4 mb-3 w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
                <div className="flex-1 px-3">
                  <h3 className="font-medium text-gray-800 text-base truncate w-70">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                      record.recordType === 'Bautista Eye Center' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {record.recordType === 'Bautista Eye Center' ? 'BEC' : 'AO'}
                    </span>
                   Case No. {record.caseNo} - {record.patientfirstname} {record.patientlastname} 
                  </h3>
                  <p className="text-xs text-gray-500">Added by {record.addedbyname} ({record.addedbytype})</p>
                </div>

                <div className="flex-1 px-3 text-center">
                  <p className="font-medium text-gray-800 text-sm">{formatappointmatedates(record.recordDate)}</p>
                  <p className="text-xs text-gray-500">Record Date</p>
                </div>

                <div className="flex-1 px-3 text-center">
                  <p className="font-medium text-gray-800 text-sm">{record.addedbyclinic}</p>
                  <p className="text-xs text-gray-500">Clinic</p>
                </div>

                <div className="px-3 flex gap-2">
                  <button 
                    id={record.recordType === 'Bautista Eye Center' ? "viewfullpatientbautistarecord" : "viewfullpatientambherrecord"}
                    onClick={() => {
                      console.log('Clicked view button for record:', record);
                      console.log('Record type:', record.recordType);
                      
                      if (record.recordType === 'Bautista Eye Center') {
                        console.log('Calling viewBautistaRecord');
                        viewBautistaRecord(record);
                      } else {
                        console.log('Calling viewAmbherRecord');
                        viewAmbherRecord(record);
                      }
                    }}
                    style={{
                      backgroundColor: "#1f2937",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "500",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#374151"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#1f2937"}
                  >
                    <i className="bx bx-show text-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          {sortedRecords.length > medicalRecordsPerPage && (
            <PaginationComponent
              currentPage={currentPage.medicalRecords}
              totalItems={sortedRecords.length}
              itemsPerPage={medicalRecordsPerPage}
              onPageChange={(page) => handlePageChange('medicalRecords', page)}
              itemName="medical records"
            />
          )}
        </div>
      );
    })()}
  </div>
   </div>

 )}


   
  </div>
</div>

)}

</div>
</div>)}


{showpatientmedicalrecordconsultation && (
<div id="patientdemographicprofileformconsultation" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[900px] h-auto max-h-[90vh] p-8 animate-fadeInUp overflow-y-auto">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bxs-conversation text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              View Consultation
            </h2>
            <p className="text-sm text-gray-500">Consultation Details & Prescription</p>
          </div>
        </div>
  <div 
    onClick={() => setshowpatientmedicalrecordconsultation(false)} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"/>
  </div>
</div>


<div className="space-y-6">
    <div className="flex justify-between items-start bg-gray-50 rounded-2xl p-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Eye Specialist</h3>
        <p className="text-gray-700 font-medium">
          {selectedpatientappointment?.eyespecialist || 'No specialist assigned'}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Consultation Date</h3>
        <p className="text-gray-700 font-medium">
          {formatappointmatedates(selectedpatientappointment?.date)}
        </p>
        <p className="text-gray-500 text-sm">
          {formatappointmenttime(selectedpatientappointment?.time)}
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Consultation Subject</h3>
        <p className="text-gray-700">
          {selectedpatientappointment?.consultationremarkssubject || 'No consultation subject recorded'}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Consultation Remarks</h3>
        <p className="text-gray-700">
          {selectedpatientappointment?.consultationremarks || 'No consultation remarks recorded'}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <i className="bx bx-health mr-2"></i>
          Prescription
        </h3>
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <p className="text-gray-700 whitespace-pre-wrap break-words">
            {selectedpatientappointment?.consultationprescription || 'No prescription recorded'}
          </p>
        </div>
      </div>
    </div>
</div>

</div>
</div>)}







{showpatientaddothermedicalrecord && (
<div id="patientshowpatientaddothermedicalrecord" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[900px] h-auto max-h-[90vh] p-8 animate-fadeInUp overflow-y-auto">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <i className="bx bx-plus-medical text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add Other Clinic Record
            </h2>
            <p className="text-sm text-gray-500">Add Medical Record from Another Clinic</p>
          </div>
        </div>
  <div 
    onClick={() => setshowpatientaddothermedicalrecord(false)} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"/>
  </div>
</div>

<form onSubmit={submitotherclinicdata}>
<div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="otherclinicname">
                Clinic Name <span className="text-red-500">*</span>
            </label>
            <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors" 
                value={otherclinicname} 
                onChange={(e) => setotherclinicname(e.target.value)} 
                id="otherclinicname" 
                name="otherclinicname" 
                required  
                placeholder="Enter clinic name..."
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="othercliniceyespecialist">
                Eye Specialist <span className="text-red-500">*</span>
            </label>
            <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors" 
                value={othercliniceyespecialist} 
                onChange={(e) => setothercliniceyespecialist(e.target.value)} 
                id="othercliniceyespecialist" 
                name="othercliniceyespecialist" 
                required  
                placeholder="Enter eye specialist name..."
            />
        </div>
    </div>

    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="otherclinicconsultationdate">
            Consulted Date <span className="text-red-500">*</span>
        </label>
        <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%]" 
            value={otherclinicconsultationdate} 
            onChange={(e) => setotherclinicconsultationdate(e.target.value)} 
            type="date" 
            name="patientambherappointmentdate" 
            id="patientambherappointmentdate" 
            max={new Date().toISOString().split('T')[0]}
            required
        />
    </div>

    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="otherclinidescription">
            Description
        </label>
        <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none" 
            value={otherclinidescription} 
            onChange={(e) => setotherclinidescription(e.target.value)} 
            id="otherclinidescription" 
            name="otherclinidescription" 
            rows="3"
            placeholder="Enter additional details about the consultation (optional)..."
        />
    </div>

    <div id="otherclinicrecorddocuments" className="space-y-4">
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                Upload Documents <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500">Upload multiple images or documents (JPEG, JPG, PNG, PDF) - Maximum 5 files</p>
        </div>

        <div className="space-y-4">
            {/* File Upload Area */}
            <div 
                onClick={otherclinichandleuploadclick}  
                className="w-full h-32 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 bg-gray-50"
            >
                <i className="bx bx-cloud-upload text-3xl text-gray-400 mb-2"/>
                <p className="text-gray-500 font-medium">Click to upload documents</p>
                <p className="text-gray-400 text-sm">JPEG, JPG, PNG, PDF formats</p>
                {otherclinicfiles.length > 0 && (
                    <p className="text-green-600 text-xs mt-1">{otherclinicfiles.length}/5 files uploaded</p>
                )}
            </div>

            {/* Loading State */}
            {uploadingotherclinicfiles && (
                <div className="flex items-center justify-center py-4">
                    <i className="bx bx-loader-alt animate-spin text-2xl text-blue-500 mr-2"></i>
                    <span className="text-blue-600 font-medium">Uploading files...</span>
                </div>
            )}

            {/* File Preview Grid */}
            {otherclinicfiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-2xl">
                    {otherclinicfiles.map((file, index) => (
                        <div key={index} className="relative group">
                            <div className="w-full h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm bg-white">
                                {file.type === 'pdf' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-2">
                                        <i className="bx bxs-file-pdf text-red-500 text-3xl mb-2"/>
                                        <p className="text-xs text-gray-800 text-center font-medium break-words leading-tight" 
                                           title={file.name}
                                           style={{ 
                                             wordBreak: 'break-word',
                                             maxHeight: '2.5rem',
                                             overflow: 'hidden',
                                             display: '-webkit-box',
                                             WebkitLineClamp: 2,
                                             WebkitBoxOrient: 'vertical'
                                           }}>
                                          {file.name || 'Unknown PDF'}
                                        </p>
                                    </div>
                                ) : (
                                    <img 
                                        onClick={() => {
                                            setselectedmedicaldocument(file);
                                            setshowmedicaldocumentimage(true);
                                        }} 
                                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200" 
                                        src={file.preview}
                                        alt="Medical document preview"
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeOtherClinicFile(index)} 
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                            >
                                <i className="bx bx-x text-lg"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
                            
        <input  
            className="hidden" 
            type="file" 
            onChange={otherclinichandleprofilechange} 
            accept="image/jpeg, image/jpg, image/png, application/pdf" 
            ref={otherclinicimageinputref} 
            multiple
        />

        {otherclinicfiles.length > 0 && otherclinicname !== "" && othercliniceyespecialist !== "" && otherclinicconsultationdate !== "" && (
            <div className="flex justify-center pt-4">
                <button 
                    type="submit" 
                    disabled={otherclinicrecordissubmitting || uploadingotherclinicfiles} 
                    style={{ 
                        backgroundColor: (otherclinicrecordissubmitting || uploadingotherclinicfiles) ? "#9CA3AF" : "#059669", 
                        fontSize: "16px", 
                        padding: "12px 32px", 
                        color: "white", 
                        borderRadius: "12px",
                        fontWeight: "600",
                        border: "none",
                        cursor: (otherclinicrecordissubmitting || uploadingotherclinicfiles) ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)"
                    }}
                >
                    {(otherclinicrecordissubmitting || uploadingotherclinicfiles) ? (
                        <>
                            <i className="bx bx-loader-alt animate-spin mr-2"></i>
                            {uploadingotherclinicfiles ? 'Uploading...' : 'Submitting...'}
                        </>
                    ) : (
                        <>
                            <i className="bx bx-check mr-2"></i>
                            Submit Record
                        </>
                    )}
                </button>
            </div>
        )}      
    </div>
</div>
</form>

</div>
</div>)}


{showotherclinicrecord && (

<div id="patientshowpatientaddothermedicalrecord" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[900px] h-auto max-h-[90vh] p-8 animate-fadeInUp overflow-y-auto">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <i className="bx bxs-clinic text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              View Clinic Record
            </h2>
            <p className="text-sm text-gray-500">Other Patient Record</p>
          </div>
        </div>
  <div 
    onClick={() => setshowotherclinicrecord(false)} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"/>
  </div>
</div>

<form onSubmit={submitotherclinicdata}>
<div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="otherclinicname">
                Clinic Name
            </label>
            <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                value={selectedpatientappointment.clinicname || ''} 
                readOnly 
                id="otherclinicname" 
                name="otherclinicname" 
                placeholder="Other clinic name..."
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="othercliniceyespecialist">
                Eye Specialist
            </label>
            <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                value={selectedpatientappointment.eyespecialist || ''} 
                readOnly 
                id="othercliniceyespecialist" 
                name="othercliniceyespecialist" 
                placeholder="Eye specialist name..."
            />
        </div>
    </div>

    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="otherclinicconsultationdate">
            Consulted Date
        </label>
        <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
            value={selectedpatientappointment.date || ''} 
            readOnly 
            type="date" 
            name="patientambherappointmentdate" 
            id="patientambherappointmentdate" 
        />
    </div>

    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="otherclinidescription">
            Description
        </label>
        <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none" 
            value={selectedpatientappointment.patientotherclinidescription || ''} 
            readOnly 
            id="otherclinidescription" 
            name="otherclinidescription" 
            rows="3"
            placeholder="No description provided..."
        />
    </div>

    <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="bx bx-file mr-2"></i>
            Medical Record Documents
        </h3>
        <OtherClinicMultiFileViewer 
          record={selectedpatientappointment}
          onFileClick={(fileUrl) => {
            setselectedmedicaldocument({ preview: fileUrl });
            setshowmedicaldocumentimage(true);
          }}
          showToast={(message, type) => {
            setSmsToastMessage(message);
            setSmsToastType(type);
            setSmsToast(true);
          }}
        />
    </div>
</div>
</form>
</div>
</div>
)}



{showotherclinicrecordimage && (
<div className="p-5 overflow-hidden fixed inset-0 flex justify-center items-center z-999 bg-[#000000af] bg-opacity-50">
<div onClick={() => setshowotherclinicrecordimage(false)} className="absolute top-3 right-3 flex justify-center items-center align-middle p-1 bg-[#333333] rounded-full hover:cursor-pointer transition-all z-[1000]" ><i className="bx bx-x font-bold text-[30px] text-white"/></div>
{selectedpatientappointment?.patientotherclinicrecordimage ? (
<img 
src={selectedpatientappointment.patientotherclinicrecordimage.startsWith('http') 
? selectedpatientappointment.patientotherclinicrecordimage 
: selectedpatientappointment.patientotherclinicrecordimage.startsWith('data:') 
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











{/* Delete Other Clinic Record Modal */}
{showdeleteotherclinicrecorddialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Clinic Record</h2>

</div>
</div>
<div 
onClick={() => {setshowdeleteotherclinicrecorddialog(false); setselectedpatientaccount(null);}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this clinic record?
</p>

{selectedpatientappointment && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">{selectedpatientappointment.clinicname}</p>
<p className="text-sm text-gray-500 mt-1">Eye Specialist: {selectedpatientappointment.eyespecialist}</p>
<p className="text-sm text-gray-500">Consulted Date: {formatappointmatedates(selectedpatientappointment.date)}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeleteotherclinicrecorddialog(false);
    setselectedpatientaccount(null);
  }}
  style={{
    flex: 1,
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "24px",
    paddingRight: "24px",
    backgroundColor: "#f3f4f6", // gray-100
    color: "#374151", // gray-700
    borderRadius: "0.75rem", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")} // hover:bg-gray-200
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={deleteotherclinicrecord}
  style={{
    flex: 1,
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "24px",
    paddingRight: "24px",
    backgroundColor: "#ef4444", // red-500
    color: "white",
    borderRadius: "0.75rem", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")} // hover:bg-red-600
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Record
</button>


</div>
</div>
</div>
</div>
)}

{/* Delete Bautista Medical Record Modal */}
{showdeletebautistamedicaldialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Medical Record</h2>
</div>
</div>
<div 
onClick={() => {
  setshowdeletebautistamedicaldialog(false); 
  setselectedbautistarecordtodelete(null);
}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this medical record?
</p>

{selectedbautistarecordtodelete && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Case No: {selectedbautistarecordtodelete.caseNo}</p>
<p className="text-sm text-gray-500 mt-1">Patient Status: {selectedbautistarecordtodelete.patientstatus}</p>
<p className="text-sm text-gray-500">Record Date: {selectedbautistarecordtodelete.recordDate ? new Date(selectedbautistarecordtodelete.recordDate).toLocaleDateString() : 'N/A'}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeletebautistamedicaldialog(false);
    setselectedbautistarecordtodelete(null);
  }}
  style={{
    flex: 1,
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "24px",
    paddingRight: "24px",
    backgroundColor: "#f3f4f6", // gray-100
    color: "#374151", // gray-700
    borderRadius: "0.75rem", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")} // hover:bg-gray-200
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={deleteBautistaMedicalRecord}
  style={{
    flex: 1,
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "24px",
    paddingRight: "24px",
    backgroundColor: "#ef4444", // red-500
    color: "white",
    borderRadius: "0.75rem", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")} // hover:bg-red-600
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Record
</button>

</div>
</div>
</div>
</div>
)}


{/* Medical Documents Upload Modal */}
{showpatientaddmedicaldocument && (
<div id="patientaddmedicaldocument" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[900px] h-auto max-h-[90vh] p-8 animate-fadeInUp overflow-y-auto">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <i className="bx bx-file-blank text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add Medical Document
            </h2>
            <p className="text-sm text-gray-500">Upload patient medical documents and files</p>
          </div>
        </div>
  <div 
    onClick={() => {
      setshowpatientaddmedicaldocument(false);
      setmedicaldocumentfiles([]);
    }} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"/>
  </div>
</div>

<form onSubmit={submitMedicalDocuments}>
<div className="space-y-6">
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="documenttitle">
            Document Title <span className="text-red-500">*</span>
        </label>
        <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            value={medicaldocumentname} 
            onChange={(e) => setmedicaldocumentname(e.target.value)} 
            id="documenttitle" 
            name="documenttitle" 
            required  
            placeholder="Enter document title..."
        />
    </div>

    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700" htmlFor="documentdescription">
            Description (Optional)
        </label>
        <textarea 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" 
            value={medicaldocumentdescription} 
            onChange={(e) => setmedicaldocumentdescription(e.target.value)} 
            id="documentdescription" 
            name="documentdescription" 
            rows="3"
            placeholder="Enter document description..."
        />
    </div>

    <div id="uploadmedicaldocuments" className="space-y-4">
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                Upload Documents <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500">Upload multiple images or documents (JPEG, JPG, PNG, PDF)</p>
        </div>

        <div className="space-y-4">
            {/* File Upload Area */}
            <div 
                onClick={!uploaddingmedicaldocument ? medicaldocumenthandleuploadclick : undefined}  
                className={`w-full h-32 flex flex-col justify-center items-center border-2 border-dashed rounded-2xl transition-all duration-200 ${
                    uploaddingmedicaldocument 
                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                        : 'border-gray-300 bg-gray-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50'
                }`}
            >
                <i className="bx bx-cloud-upload text-3xl text-gray-400 mb-2"/>
                <p className="text-gray-500 font-medium">Click to upload documents</p>
                <p className="text-gray-400 text-sm">JPEG, JPG, PNG, PDF formats</p>
            </div>

            {/* Loading State */}
            {uploaddingmedicaldocument && (
                <div className="flex items-center justify-center py-4">
                    <i className="bx bx-loader-alt animate-spin text-2xl text-blue-500 mr-2"></i>
                    <span className="text-blue-600 font-medium">Uploading files...</span>
                </div>
            )}

            {/* File Preview Grid */}
            {medicaldocumentfiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-2xl">
                    {medicaldocumentfiles.map((file, index) => (
                        <div key={index} className="relative group">
                            <div className="w-full h-32 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm bg-white">
                                {file.type === 'pdf' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50">
                                        <i className="bx bxs-file-pdf text-red-500 text-3xl mb-1"/>
                                        <p className="text-xs text-gray-600 text-center px-2 truncate w-full">{file.name}</p>
                                    </div>
                                ) : (
                                    <img 
                                        onClick={() => {
                                            setselectedmedicaldocument(file);
                                            setshowmedicaldocumentimage(true);
                                        }} 
                                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200" 
                                        src={file.preview}
                                        alt="Medical document preview"
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => removeMedicalDocumentFile(index)} 
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg opacity-0 group-hover:opacity-100"
                            >
                                <i className="bx bx-x text-lg"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
                            
        <input  
            className="hidden" 
            type="file" 
            onChange={medicaldocumenthandleupload} 
            accept="image/jpeg, image/jpg, image/png, application/pdf" 
            ref={medicaldocumentinputref} 
            multiple
        />

        {medicaldocumentfiles.length > 0 && medicaldocumentname.trim() !== "" && (
            <div className="flex justify-center pt-4">
                <button 
                    type="submit" 
                    disabled={uploaddingmedicaldocument} 
                    style={{ 
                        backgroundColor: uploaddingmedicaldocument ? "#9CA3AF" : "#3B82F6", 
                        fontSize: "16px", 
                        padding: "12px 32px", 
                        color: "white", 
                        borderRadius: "12px",
                        fontWeight: "600",
                        border: "none",
                        cursor: uploaddingmedicaldocument ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                    }}
                >
                    {uploaddingmedicaldocument ? (
                        <>
                            <i className="bx bx-loader-alt animate-spin mr-2"></i>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <i className="bx bx-check mr-2"></i>
                            Upload Documents
                        </>
                    )}
                </button>
            </div>
        )}      
    </div>
</div>
</form>

</div>
</div>)}






{/* Medical Document Image Preview Modal */}
{showmedicaldocumentimage && (
<div className="p-5 overflow-hidden fixed inset-0 flex justify-center items-center z-[999] bg-[#000000af] bg-opacity-50">
<div onClick={() => setshowmedicaldocumentimage(false)} className="absolute top-3 right-3 flex justify-center items-center align-middle p-1 bg-[#333333] rounded-full hover:cursor-pointer transition-all z-[1000]" ><i className="bx bx-x font-bold text-[30px] text-white"/></div>
{selectedmedicaldocument ? (
    selectedmedicaldocument.type === 'pdf' ? (
        <div className="bg-white p-8 rounded-2xl max-w-md text-center">
            <i className="bx bxs-file-pdf text-red-500 text-6xl mb-4"/>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedmedicaldocument.name}</h3>
            <p className="text-gray-600 mb-4">PDF files cannot be previewed here</p>
            <button 
                onClick={() => window.open(selectedmedicaldocument.url || selectedmedicaldocument.preview, '_blank')}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
                Open PDF
            </button>
        </div>
    ) : (
        <img 
            src={selectedmedicaldocument.url || selectedmedicaldocument.preview} 
            alt="Medical Document" 
            className="max-w-full max-h-full object-contain" 
        />
    )
) : (
<div className="text-white text-center">
<i className="bx bx-image text-6xl mb-4"></i>
<p className="text-xl">No document available</p>
</div>
)}
</div>
)}


  
</div> )}

{/* Delete Medical Document Modal */}
{showdeletemedicaldocumentdialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Medical Document</h2>

</div>
</div>
<div 
onClick={() => setshowdeletemedicaldocumentdialog(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this medical document?
</p>

{selectedmedicaldocument && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">{selectedmedicaldocument.documentname}</p>
<p className="text-sm text-gray-500">Added on {formatappointmatedates(selectedmedicaldocument.addedbydate)}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeletemedicaldocumentdialog(false)}
  style={{
    flex: 1,
    padding: "12px 24px", // py-3 px-6
    backgroundColor: "#f3f4f6", // gray-100
    color: "#374151", // gray-700
    borderRadius: "12px", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")} // hover:bg-gray-200
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={deleteMedicalDocument}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444", // red-500
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")} // hover:bg-red-600
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Document
</button>
</div>
</div>
</div>
</div>
)}

{/* Delete Bautista Medical Record Modal */}
{showdeletebautistamedicalrecorddialog && (
<div className="flex justify-center items-center z-99 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Patient Record</h2>

</div>
</div>
<div 
onClick={() => setshowdeletebautistamedicalrecorddialog(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this medical record?
</p>

{selectedbautistarecord && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Case No: {selectedbautistarecord.caseNo}</p>
<p className="text-sm text-gray-500">Record Date: {formatappointmatedates(selectedbautistarecord.recordDate)}</p>
<p className="text-sm text-gray-500">Added by: {selectedbautistarecord.addedbyname}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeletebautistamedicalrecorddialog(false)}
  style={{
    flex: 1,
    padding: "12px 24px", // py-3 px-6
    backgroundColor: "#f3f4f6", // gray-100
    color: "#374151", // gray-700
    borderRadius: "12px", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")} // hover:bg-gray-200
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  id="deletebautistapatientclinicmedicalrecord"
  onClick={deleteBautistaMedicalRecord}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444", // red-500
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")} // hover:bg-red-600
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Record
</button>
</div>
</div>
</div>
</div>
)}

{/* Delete Ambher Medical Record Modal */}
{showdeleteambhermedicalrecorddialog && (
<div className="flex justify-center items-center z-99 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Patient Record</h2>

</div>
</div>
<div 
onClick={() => setshowdeleteambhermedicalrecorddialog(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this medical record?
</p>

{selectedambherrecord && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Case No: {selectedambherrecord.ambheropticalcaseno}</p>
<p className="text-sm text-gray-500">Record Date: {formatappointmatedates(selectedambherrecord.recordDate)}</p>
<p className="text-sm text-gray-500">Added by: {selectedambherrecord.addedbyname}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeleteambhermedicalrecorddialog(false)}
  style={{
    flex: 1,
    padding: "12px 24px", // py-3 px-6
    backgroundColor: "#f3f4f6", // gray-100
    color: "#374151", // gray-700
    borderRadius: "12px", // rounded-xl
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")} // hover:bg-gray-200
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={deleteAmbherMedicalRecord}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444", // red-500
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")} // hover:bg-red-600
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Record
</button>
</div>
</div>
</div>
</div>
)}



{/* Medical Document Upload Toast Notification */}
{medicalDocumentToast && (
  <div className={`${medicalDocumentToast ? 'bottom-4' : 'bottom-4'} right-8 z-101 transform fixed`}>
    <div key={medicalDocumentIsClicked ? 'success' : 'error'} className={`${medicalDocumentToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
      {medicalDocumentIsClicked ? (          
        <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
      ) : (
        <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
      )}
      {medicalDocumentToastMessage}

      <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${medicalDocumentIsClicked ? 'bg-green-500' : 'bg-red-500'}`} style={{width: medicalDocumentProgressWidth, transition: 'width 4s linear'}}/>
    </div>
  </div>  
)}

{/* Bautista Medical Record Toast Notification */}
{bautistaRecordToast && (
  <div className={`${medicalDocumentToast || bautistaRecordToast ? 'bottom-4' : 'bottom-4'} right-8 z-101 transform fixed`}>
    <div key={bautistaRecordToastType} className={`${bautistaRecordToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
      {bautistaRecordToastType === 'success' ? (          
        <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
      ) : (
        <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
      )}
      {bautistaRecordToastMessage}

      <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${bautistaRecordToastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`} style={{width: bautistaRecordProgressWidth, transition: 'width 4s linear'}}/>
    </div>
  </div>  
)}

{/* Ambher Medical Record Toast Notification */}
{ambherRecordToast && (
  <div className={`${medicalDocumentToast || bautistaRecordToast || ambherRecordToast ? 'bottom-4' : 'bottom-4'} right-8 z-101 transform fixed`}>
    <div key={ambherRecordToastType} className={`${ambherRecordToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
      {ambherRecordToastType === 'success' ? (          
        <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
      ) : (
        <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
      )}
      {ambherRecordToastMessage}

      <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${ambherRecordToastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`} style={{width: ambherRecordProgressWidth, transition: 'width 4s linear'}}/>
    </div>
  </div>  
)}



















{/* Bautista Medical Record Form Modal */}
{/* Bautista Medical Record Form Modal */}
{showaddbautistaclinicmedicalrecord && (
<div id="bautistapatientrecord" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[1200px] h-auto max-h-[90vh] p-8 animate-fadeInUp overflow-y-auto">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
            <img src={bautistalogo} alt="Medical Icon" className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Bautista Eye Center
            </h2>
            <p className="text-sm text-gray-500">
              {selectedbautistarecord ? 'Medical Record Details' : 'New Medical Record'}
            </p>
          </div>
        </div>
  <div 
    onClick={() => {
      setshowaddbautistaclinicmedicalrecord(false);
      setselectedbautistarecord(null);
      setgeneratedCaseNumber('');
      // Reset case number validation state
      setCaseNoValue('');
      setCaseNoValidation({
        isChecking: false,
        isValid: true,
        message: ''
      });
    }} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"></i>
  </div>
</div>

<form id="bautista-medical-record-form" onSubmit={selectedbautistarecord ? updateBautistaMedicalRecord : submitBautistaMedicalRecord} className="space-y-8">
  
  {/* PATIENT INFORMATION SECTION */}
  <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-300">PATIENT INFORMATION</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Case No. */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Case No. <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="caseNo"
          value={selectedbautistarecord?.caseNo || caseNoValue || generatedCaseNumber}
          onChange={handleCaseNoChange}
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 transition-colors ${
            selectedbautistarecord 
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed focus:ring-blue-500 focus:border-blue-500' 
              : caseNoValidation.isValid 
                ? 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500' 
                : 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
          }`}
          placeholder="Auto-generated case number..."
          readOnly={selectedbautistarecord || isbautistaformreadonly ? true : false}
          required
        />
        
        {/* Validation message */}
        {!selectedbautistarecord && caseNoValue && (
          <div className={`mt-1 text-xs ${
            caseNoValidation.isChecking 
              ? 'text-blue-500' 
              : caseNoValidation.isValid 
                ? 'text-green-600' 
                : 'text-red-600'
          }`}>
            {caseNoValidation.isChecking && (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </span>
            )}
            {!caseNoValidation.isChecking && caseNoValidation.message && (
              <span>{caseNoValidation.message}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Record Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Record Date</label>
        <input 
          type="date" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm focus:outline-none cursor-not-allowed" 
          value={selectedbautistarecord ? new Date(selectedbautistarecord.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
          readOnly
        />
      </div>
      
      {/* Patient Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Status</label>
        <select 
          name="patientstatus" 
          defaultValue={selectedbautistarecord?.patientstatus || ''}
          disabled={selectedbautistarecord || isbautistaformreadonly ? true : false}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${selectedbautistarecord ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        >
          <option value="">Select status...</option>
          <option value="New">New</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Emergency">Emergency</option>
          <option value="Consultation">Consultation</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Patient Last Name - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientlastname || ''}
          readOnly
          placeholder="Patient last name"
        />
      </div>
      
      {/* Patient First Name - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientfirstname || ''}
          readOnly
          placeholder="Patient first name"
        />
      </div>
      
      {/* Patient Middle Name - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientmiddlename || ''}
          readOnly
          placeholder="Patient middle name"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      {/* Patient Age - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientage || ''}
          readOnly
          placeholder="Age"
        />
      </div>
      
      {/* Patient Gender - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientgender || ''}
          readOnly
          placeholder="Gender"
        />
      </div>
      
      {/* Patient Birthdate - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Birthdate</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientbirthdate ? formatappointmatedates(selectedpatientmedicalrecord.patientbirthdate) : ''}
          readOnly
          placeholder="Birthdate"
        />
      </div>
      
      {/* Patient Contact Number - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientcontactnumber || ''}
          readOnly
          placeholder="Contact number"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 mt-4">
      {/* Patient Home Address - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed resize-none" 
          rows="2"
          value={selectedpatientmedicalrecord?.patienthomeaddress || ''}
          readOnly
          placeholder="Patient home address"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* PhilHealth Category - Editable */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">PhilHealth Category</label>
        <select 
          name="patientphilhealthcategory" 
          defaultValue={selectedbautistarecord?.patientphilhealthcategory || ''}
          disabled={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        >
          <option value="">Select PhilHealth category...</option>
          <option value="Employed/Formal Economy">Employed/Formal Economy</option>
          <option value="Indigent/Informal Economy">Indigent/Informal Economy</option>
          <option value="Sponsored">Sponsored</option>
          <option value="Senior Citizen">Senior Citizen</option>
          <option value="PWD">PWD (Person with Disability)</option>
          <option value="Lifetime Member">Lifetime Member</option>
          <option value="OFW">OFW (Overseas Filipino Worker)</option>
          <option value="Not Applicable">Not Applicable</option>
        </select>
      </div>
      
      {/* HMO - Editable */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">HMO</label>
        <input 
          type="text" 
          name="hmo"
          defaultValue={selectedbautistarecord?.hmo || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder="Enter HMO provider (if applicable)..."
        />
      </div>
    </div>
  </div>
  
  {/* SUBJECTIVE SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">SUBJECTIVE</h3>
    
    {/* Chief Complaint */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Chief Complaint
      </label>
      <textarea 
        name="chiefComplaint"
        defaultValue={selectedbautistarecord?.chiefComplaint || ''}
        readOnly={isbautistaformreadonly}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        rows="3"
        maxLength="500"
        placeholder="Enter chief complaint..."
      />
    </div>

    {/* History of Present Illness */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        History of Present Illness
      </label>
      <textarea 
        name="historyOfPresentIllness"
        defaultValue={selectedbautistarecord?.historyOfPresentIllness || ''}
        readOnly={isbautistaformreadonly}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        rows="4"
        maxLength="1000"
        placeholder="Enter history of present illness..."
      />
    </div>

    {/* Past Medical History */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Past Medical History</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="hpn" 
              defaultChecked={selectedbautistarecord?.hpn || false}
              disabled={isbautistaformreadonly}
              className="mr-2 text-green-500 focus:ring-green-500" 
            />
            <span className="text-sm">HPN (Hypertension)</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="dm" 
              defaultChecked={selectedbautistarecord?.dm || false}
              disabled={isbautistaformreadonly}
              className="mr-2 text-green-500 focus:ring-green-500" 
            />
            <span className="text-sm">DM (Diabetes Mellitus)</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="asthma" 
              defaultChecked={selectedbautistarecord?.asthma || false}
              disabled={isbautistaformreadonly}
              className="mr-2 text-green-500 focus:ring-green-500" 
            />
            <span className="text-sm">ASTHMA</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              name="ptb" 
              defaultChecked={selectedbautistarecord?.ptb || false}
              disabled={isbautistaformreadonly}
              className="mr-2 text-green-500 focus:ring-green-500" 
            />
            <span className="text-sm">PTB (Pulmonary Tuberculosis)</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Others
        </label>
        <textarea 
          name="othersHistory"
          defaultValue={selectedbautistarecord?.othersHistory || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="5"
          maxLength="200"
          placeholder="Other medical history..."
        />
      </div>
    </div>

    {/* Vital Signs */}
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Height</label>
        <input 
          type="text" 
          name="height"
          defaultValue={selectedbautistarecord?.height || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          maxLength="10"
          placeholder="e.g., 5'6 inches"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Weight</label>
        <input 
          type="text" 
          name="weight"
          defaultValue={selectedbautistarecord?.weight || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          maxLength="10"
          placeholder="e.g., 70kg"
        />
      </div>
    </div>
  </div>

  {/* OBJECTIVE SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">OBJECTIVE</h3>
    
    {/* Visual Exam */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Visual Exam</h4>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700"></th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">SC</th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">CC</th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">PH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">OD</td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="visualExam_od_sc" 
                  defaultValue={selectedbautistarecord?.visualExam?.od?.sc || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="visualExam_od_cc" 
                  defaultValue={selectedbautistarecord?.visualExam?.od?.cc || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="visualExam_od_ph" 
                  defaultValue={selectedbautistarecord?.visualExam?.od?.ph || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">OS</td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="visualExam_os_sc" 
                  defaultValue={selectedbautistarecord?.visualExam?.os?.sc || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="visualExam_os_cc" 
                  defaultValue={selectedbautistarecord?.visualExam?.os?.cc || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="visualExam_os_ph" 
                  defaultValue={selectedbautistarecord?.visualExam?.os?.ph || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`} 
                  maxLength="10" 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Refraction */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Refraction</h4>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700"></th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">Sphere</th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">Cylinder</th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">Axis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">OD</td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_od_sphere" 
                  defaultValue={selectedbautistarecord?.refraction?.od?.sphere || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_od_cylinder" 
                  defaultValue={selectedbautistarecord?.refraction?.od?.cylinder || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_od_axis" 
                  defaultValue={selectedbautistarecord?.refraction?.od?.axis || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">OS</td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_os_sphere" 
                  defaultValue={selectedbautistarecord?.refraction?.os?.sphere || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_os_cylinder" 
                  defaultValue={selectedbautistarecord?.refraction?.os?.cylinder || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_os_axis" 
                  defaultValue={selectedbautistarecord?.refraction?.os?.axis || ''}
                  readOnly={isbautistaformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* ADDS and PD */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ADDS Right</label>
          <input 
            type="text" 
            name="refraction_adds_right" 
            defaultValue={selectedbautistarecord?.refraction?.adds?.right || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="10" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">ADDS Left</label>
          <input 
            type="text" 
            name="refraction_adds_left" 
            defaultValue={selectedbautistarecord?.refraction?.adds?.left || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="10" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">PD</label>
          <input 
            type="text" 
            name="refraction_pd" 
            defaultValue={selectedbautistarecord?.refraction?.pd || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="10" 
          />
        </div>
      </div>
    </div>

    {/* External Exam */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">External Exam</h4>
      <div className="space-y-3">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            name="externalExam_isEssentiallyNormal" 
            defaultChecked={selectedbautistarecord?.externalExam?.isEssentiallyNormal || false}
            disabled={isbautistaformreadonly}
            className="mr-2 text-green-500 focus:ring-green-500" 
          />
          <span className="text-sm font-medium">Essentially Normal</span>
        </label>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Details</label>
          <textarea 
            name="externalExam_details"
            defaultValue={selectedbautistarecord?.externalExam?.details || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            rows="3"
            maxLength="300"
            placeholder="External exam details..."
          />
        </div>
      </div>
    </div>

    {/* Biomicroscopy */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Biomicroscopy</h4>
      <textarea 
        name="biomicroscopy_details"
        defaultValue={selectedbautistarecord?.biomicroscopy?.details || ''}
        readOnly={isbautistaformreadonly}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`} 
        rows="4"
        maxLength="500"
        placeholder="Biomicroscopy findings..."
      />
    </div>

    {/* Funduscopy */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Funduscopy</h4>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OD</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CD Ratio</label>
              <input 
                type="text" 
                name="funduscopy_od_cdRatio" 
                defaultValue={selectedbautistarecord?.funduscopy?.od?.cdRatio || ''}
                readOnly={isbautistaformreadonly}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                maxLength="10" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Details</label>
              <textarea 
                name="funduscopy_od_details"
                defaultValue={selectedbautistarecord?.funduscopy?.od?.details || ''}
                readOnly={isbautistaformreadonly}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                rows="3"
                maxLength="300"
                placeholder="OD funduscopy details..."
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OS</label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">CD Ratio</label>
              <input 
                type="text" 
                name="funduscopy_os_cdRatio" 
                defaultValue={selectedbautistarecord?.funduscopy?.os?.cdRatio || ''}
                readOnly={isbautistaformreadonly}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                maxLength="10" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Details</label>
              <textarea 
                name="funduscopy_os_details"
                defaultValue={selectedbautistarecord?.funduscopy?.os?.details || ''}
                readOnly={isbautistaformreadonly}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`} 
                rows="3"
                maxLength="300"
                placeholder="OS funduscopy details..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* EOMS */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">EOMS (Extraocular Motility)</h4>
      <div className="space-y-3">
        <label className="flex items-center">
          <input 
            type="checkbox" 
            name="eoms_isFullAndEqual" 
            defaultChecked={selectedbautistarecord?.eoms?.isFullAndEqual || false}
            disabled={isbautistaformreadonly}
            className="mr-2 text-green-500 focus:ring-green-500" 
          />
          <span className="text-sm font-medium">Full & Equal</span>
        </label>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Details</label>
          <input 
            type="text" 
            name="eoms_details"
            defaultValue={selectedbautistarecord?.eoms?.details || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="100"
            placeholder="EOMS details..."
          />
        </div>
      </div>
    </div>

    {/* Tonometry */}
    <div className="mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Tonometry</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
          <input 
            type="text" 
            name="tonometry_time"
            defaultValue={selectedbautistarecord?.tonometry?.time || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="100"
            placeholder="e.g., 10:00 AM"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OD (mmHg)</label>
          <input 
            type="text" 
            name="tonometry_od"
            defaultValue={selectedbautistarecord?.tonometry?.od || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="100"
            placeholder="IOP OD"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">OS (mmHg)</label>
          <input 
            type="text" 
            name="tonometry_os"
            defaultValue={selectedbautistarecord?.tonometry?.os || ''}
            readOnly={isbautistaformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="100"
            placeholder="IOP OS"
          />
        </div>
      </div>
    </div>
  </div>

  {/* DIAGNOSIS SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">DIAGNOSIS</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea 
          name="diagnosis_description"
          defaultValue={selectedbautistarecord?.diagnosis?.description || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="4"
          maxLength="1000"
          placeholder="Diagnosis description..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">ICD-10 Code</label>
        <input 
          type="text" 
          name="diagnosis_icd10Code"
          defaultValue={selectedbautistarecord?.diagnosis?.icd10Code || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          maxLength="100"
          placeholder="Enter ICD-10 code..."
        />
      </div>
    </div>
  </div>

  {/* PLANS SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">PLANS</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnostics</label>
        <textarea 
          name="plans_diagnostics"
          defaultValue={selectedbautistarecord?.plans?.diagnostics || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="6"
          maxLength="1000"
          placeholder="Diagnostic plans..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Therapeutics</label>
        <textarea 
          name="plans_therapeutics"
          defaultValue={selectedbautistarecord?.plans?.therapeutics || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="6"
          maxLength="1000"
          placeholder="Therapeutic plans..."
        />
      </div>
    </div>
  </div>

  {/* FOLLOW-UP & SIGNATURE SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">FOLLOW-UP & SIGNATURE</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Follow-up</label>
        <textarea 
          name="followUp"
          defaultValue={selectedbautistarecord?.followUp || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="3"
          maxLength="500"
          placeholder="Follow-up instructions..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">MD Signature</label>
        <input 
          type="text" 
          name="mdSignature"
          defaultValue={selectedbautistarecord?.mdSignature || ''}
          readOnly={isbautistaformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-colors ${isbautistaformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          maxLength="100"
          placeholder="Doctor's signature..."
        />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div id="bautistapatientmedicalrecordbuttons" className="flex justify-end space-x-4 pt-6">
<button
  type="button"
  onClick={() => {
    setshowaddbautistaclinicmedicalrecord(false);
    setselectedbautistarecord(null);
    setisbautistaformreadonly(false);
    setgeneratedCaseNumber('');
    // Reset case number validation state
    setCaseNoValue('');
    setCaseNoValidation({
      isChecking: false,
      isValid: true,
      message: ''
    });
  }}
  style={{
    padding: "12px 24px",
    backgroundColor: "#d1d5db", // gray-300
    color: "#374151", // gray-700
    borderRadius: "0.5rem", // rounded-lg
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out"
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#9ca3af")} 
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#d1d5db")} 
  onMouseDown={(e) => (e.target.style.backgroundColor = "#6b7280")} 
  onMouseUp={(e) => (e.target.style.backgroundColor = "#9ca3af")}
>
  Cancel
</button>

    {/* Delete Button - Only show for existing records and if user can edit */}
    {selectedbautistarecord && !isbautistaformreadonly && (
      <button
        type="button"
        onClick={() => setshowdeletebautistamedicalrecorddialog(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#ef4444", // red-500
          color: "#ffffff",
          borderRadius: "0.5rem",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s ease-in-out"
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")} // red-600
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
        onMouseDown={(e) => (e.target.style.backgroundColor = "#b91c1c")} // red-700
        onMouseUp={(e) => (e.target.style.backgroundColor = "#dc2626")}
      >
        Delete Record
      </button>
    )}
    
    {!isbautistaformreadonly && (
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
      >
        {selectedbautistarecord ? 'Update Medical Record' : 'Save Medical Record'}
      </button>
    )}
  </div>

</form>

</div>
</div>)}

{/* Ambher Optical Medical Record Form Modal */}
{showaddambherclinicmedicalrecord && (
<div id="ambherpatientrecord" className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[1200px] h-auto max-h-[90vh] p-8 animate-fadeInUp overflow-y-auto">
<div className="flex justify-between items-center w-full h-[60px] mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
            <img src={ambherlogo} alt="Ambher Optical Logo" className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Ambher Optical
            </h2>
            <p className="text-sm text-gray-500">
              {selectedambherrecord ? 'Medical Record Details' : 'New Medical Record'}
            </p>
          </div>
        </div>
  <div 
    onClick={() => {
      setshowaddambherclinicmedicalrecord(false);
      setselectedambherrecord(null);
      setgeneratedAmbherCaseNumber('');
      // Reset case number validation state
      setAmbherCaseNoValue('');
      setAmbherCaseNoValidation({
        isChecking: false,
        isValid: true,
        message: ''
      });
    }} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"></i>
  </div>
</div>

<form id="ambher-medical-record-form" onSubmit={selectedambherrecord ? updateAmbherMedicalRecord : submitAmbherMedicalRecord} className="space-y-8">
  
  {/* PATIENT INFORMATION SECTION */}
  <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-300">PATIENT INFORMATION</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Case No. */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Case No. <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          name="ambherCaseNo"
          value={selectedambherrecord?.ambheropticalcaseno || ambherCaseNoValue || generatedAmbherCaseNumber}
          onChange={handleAmbherCaseNoChange}
          className={`w-full px-4 py-3 border rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 transition-colors ${
            selectedambherrecord 
              ? 'border-gray-300 bg-gray-100 cursor-not-allowed focus:ring-green-500 focus:border-green-500' 
              : ambherCaseNoValidation.isValid 
                ? 'border-gray-300 bg-white focus:ring-green-500 focus:border-green-500' 
                : 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
          }`}
          placeholder="Auto-generated case number..."
          readOnly={selectedambherrecord || isambherformreadonly ? true : false}
          required
        />
        
        {/* Validation message */}
        {!selectedambherrecord && ambherCaseNoValue && (
          <div className={`mt-1 text-xs ${
            ambherCaseNoValidation.isChecking 
              ? 'text-blue-500' 
              : ambherCaseNoValidation.isValid 
                ? 'text-green-600' 
                : 'text-red-600'
          }`}>
            {ambherCaseNoValidation.isChecking && (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </span>
            )}
            {!ambherCaseNoValidation.isChecking && ambherCaseNoValidation.message && (
              <span>{ambherCaseNoValidation.message}</span>
            )}
          </div>
        )}
      </div>
      
      {/* Record Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Record Date</label>
        <input 
          type="date" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm focus:outline-none cursor-not-allowed" 
          value={selectedambherrecord ? new Date(selectedambherrecord.recordDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
          readOnly
        />
      </div>
      
      {/* Patient Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Status</label>
        <select 
          name="patientstatus" 
          defaultValue={selectedambherrecord?.patientstatus || ''}
          disabled={isambherformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${selectedambherrecord ? 'bg-white cursor-pointer' : 'bg-white'}`}
        >
          <option value="">Select status...</option>
          <option value="New">New</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Emergency">Emergency</option>
          <option value="Consultation">Consultation</option>
        </select>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* Patient Last Name - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientlastname || ''}
          readOnly
          placeholder="Patient last name"
        />
      </div>
      
      {/* Patient First Name - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientfirstname || ''}
          readOnly
          placeholder="Patient first name"
        />
      </div>
      
      {/* Patient Middle Name - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientmiddlename || ''}
          readOnly
          placeholder="Patient middle name"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
      {/* Patient Age - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientage || ''}
          readOnly
          placeholder="Age"
        />
      </div>
      
      {/* Patient Gender - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientgender || ''}
          readOnly
          placeholder="Gender"
        />
      </div>
      
      {/* Patient Birthdate - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Birthdate</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientbirthdate ? formatappointmatedates(selectedpatientmedicalrecord.patientbirthdate) : ''}
          readOnly
          placeholder="Birthdate"
        />
      </div>
      
      {/* Patient Contact Number - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
        <input 
          type="text" 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed" 
          value={selectedpatientmedicalrecord?.patientcontactnumber || ''}
          readOnly
          placeholder="Contact number"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 mt-4">
      {/* Patient Home Address - Readonly */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Home Address</label>
        <textarea 
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-not-allowed resize-none" 
          rows="2"
          value={selectedpatientmedicalrecord?.patienthomeaddress || ''}
          readOnly
          placeholder="Patient home address"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {/* PhilHealth Category - Editable */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">PhilHealth Category</label>
        <select 
          name="patientphilhealthcategory" 
          defaultValue={selectedambherrecord?.patientphilhealthcategory || ''}
          disabled={isambherformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        >
          <option value="">Select PhilHealth category...</option>
          <option value="Employed/Formal Economy">Employed/Formal Economy</option>
          <option value="Indigent/Informal Economy">Indigent/Informal Economy</option>
          <option value="Sponsored">Sponsored</option>
          <option value="Senior Citizen">Senior Citizen</option>
          <option value="PWD">PWD (Person with Disability)</option>
          <option value="Lifetime Member">Lifetime Member</option>
          <option value="OFW">OFW (Overseas Filipino Worker)</option>
          <option value="Not Applicable">Not Applicable</option>
        </select>
      </div>
      
      {/* HMO - Editable */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">HMO</label>
        <input 
          type="text" 
          name="hmo"
          defaultValue={selectedambherrecord?.hmo || ''}
          readOnly={isambherformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          placeholder="Enter HMO provider (if applicable)..."
        />
      </div>
    </div>
  </div>
  
  {/* REFRACTION SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">REFRACTION</h3>
    
    {/* Refraction Table */}
    <div className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700"></th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">SPH</th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">CYL</th>
              <th className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">AXIS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">OD (Right)</td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_od_sphere" 
                  defaultValue={selectedambherrecord?.refraction?.od?.sphere || ''}
                  readOnly={isambherformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_od_cylinder" 
                  defaultValue={selectedambherrecord?.refraction?.od?.cylinder || ''}
                  readOnly={isambherformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_od_axis" 
                  defaultValue={selectedambherrecord?.refraction?.od?.axis || ''}
                  readOnly={isambherformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">OS (Left)</td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_os_sphere" 
                  defaultValue={selectedambherrecord?.refraction?.os?.sphere || ''}
                  readOnly={isambherformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_os_cylinder" 
                  defaultValue={selectedambherrecord?.refraction?.os?.cylinder || ''}
                  readOnly={isambherformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`}
                  maxLength="10" 
                />
              </td>
              <td className="border border-gray-300 px-3 py-2">
                <input 
                  type="text" 
                  name="refraction_os_axis" 
                  defaultValue={selectedambherrecord?.refraction?.os?.axis || ''}
                  readOnly={isambherformreadonly}
                  className={`w-full px-2 py-1 border-0 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'}`} 
                  maxLength="10" 
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Additional Refraction Fields */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">PD</label>
          <input 
            type="text" 
            name="refraction_pd" 
            defaultValue={selectedambherrecord?.refraction?.pd || ''}
            readOnly={isambherformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="10" 
            placeholder="e.g., 64"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">BC</label>
          <input 
            type="text" 
            name="refraction_bc" 
            defaultValue={selectedambherrecord?.refraction?.bc || ''}
            readOnly={isambherformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="10" 
            placeholder="Base curve"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">DIA</label>
          <input 
            type="text" 
            name="refraction_dia" 
            defaultValue={selectedambherrecord?.refraction?.dia || ''}
            readOnly={isambherformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="10" 
            placeholder="Diameter"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">TINT</label>
          <input 
            type="text" 
            name="refraction_tint" 
            defaultValue={selectedambherrecord?.refraction?.tint || ''}
            readOnly={isambherformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="20" 
            placeholder="Tint specification"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">TYPE</label>
          <input 
            type="text" 
            name="refraction_type" 
            defaultValue={selectedambherrecord?.refraction?.type || ''}
            readOnly={isambherformreadonly}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength="50" 
            placeholder="Lens type (e.g., Single Vision, Progressive, etc.)"
          />
        </div>
      </div>
    </div>
  </div>

  {/* REMARKS & LENS RECOMMENDATION SECTION */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">REMARKS & LENS RECOMMENDATION</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
        <textarea 
          name="remarks"
          defaultValue={selectedambherrecord?.remarks || ''}
          readOnly={isambherformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="3"
          maxLength="500"
          placeholder="Additional remarks or notes..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Lens Recommendation</label>
        <textarea 
          name="lensRecommendation"
          defaultValue={selectedambherrecord?.lensRecommendation || ''}
          readOnly={isambherformreadonly}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors resize-none ${isambherformreadonly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          rows="3"
          maxLength="500"
          placeholder="Recommended lens specifications (e.g., SV / Anti-rad)"
        />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div id="ambherpatientmedicalrecordbuttons" className="flex justify-end space-x-4 pt-6">
<button
  type="button"
  onClick={() => {
    setshowaddambherclinicmedicalrecord(false);
    setselectedambherrecord(null);
    setisambherformreadonly(false);
    setgeneratedAmbherCaseNumber('');
    // Reset case number validation state
    setAmbherCaseNoValue('');
    setAmbherCaseNoValidation({
      isChecking: false,
      isValid: true,
      message: ''
    });
  }}
  style={{
    padding: "12px 24px",
    backgroundColor: "#d1d5db", // gray-300
    color: "#374151", // gray-700
    borderRadius: "0.5rem", // rounded-lg
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out"
  }}
  onMouseEnter={(e) => (e.target.style.backgroundColor = "#9ca3af")} 
  onMouseLeave={(e) => (e.target.style.backgroundColor = "#d1d5db")} 
  onMouseDown={(e) => (e.target.style.backgroundColor = "#6b7280")} 
  onMouseUp={(e) => (e.target.style.backgroundColor = "#9ca3af")} 
>
  Cancel
</button>

    {/* Delete Button - Only show for existing records and if user can edit */}
    {selectedambherrecord && !isambherformreadonly && (
      <button
        type="button"
        onClick={() => setshowdeleteambhermedicalrecorddialog(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#ef4444", // red-500
          color: "#ffffff",
          borderRadius: "0.5rem",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s ease-in-out"
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")} // red-600
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
        onMouseDown={(e) => (e.target.style.backgroundColor = "#b91c1c")} // red-700
        onMouseUp={(e) => (e.target.style.backgroundColor = "#dc2626")}
      >
        Delete Record
      </button>
    )}
    
    {!isambherformreadonly && (
      <button
        type="submit"
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 transform hover:scale-105"
      >
        {selectedambherrecord ? 'Update Medical Record' : 'Save Medical Record'}
      </button>
    )}
  </div>

</form>

</div>
</div>)}






{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}













































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

      {/* Staff Logout Confirmation Modal */}
      {showStaffLogoutModal && (
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
              Confirm Staff Logout
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
                onClick={cancelStaffLogout}
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
                onClick={confirmStaffLogout}
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

      {/* Owner Logout Confirmation Modal */}
      {showOwnerLogoutModal && (
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
              Confirm Owner Logout
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
                onClick={cancelOwnerLogout}
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
                onClick={confirmOwnerLogout}
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





 

      
      
          </div></div>
          </section>

        </>
      )}

    </>
  )
}

export default AdminDashboard