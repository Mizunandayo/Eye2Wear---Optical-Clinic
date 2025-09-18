import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import landingbg2 from "../src/assets/images/landingbg2.png";
import landingbg3 from "../src/assets/images/landingbg3.png";
import bentoglass from "../src/assets/images/bentoglass.png";
import bentomachines from "../src/assets/images/bentomachine.png";
import bentofeedback from "../src/assets/images/bentofeedback.png";
import bentosurgery from "../src/assets/images/bentosurgery.png";
import bentoexam from "../src/assets/images/bentoexam.png";
import bentoconsult from "../src/assets/images/bentoconsult.png";
import landinglogodark from "../src/assets/images/landinglogodark.png";
import lonelogo from "../src/assets/images/lonelogo.png";
import navlogo from "../src/assets/images/navlogo.png";
import Typewriter from "typewriter-effect";
import eyemodel2 from "../src/assets/images/eyemodel2.png";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import profileuser from "../src/assets/images/profile-user.png";
import logout from "../src/assets/images/logout.png";
import usersicon from "../src/assets/images/multiuserss.png";
import { useAuth } from "./hooks/patientuseAuth";
import bautistalogo from "../src/assets/images/bautistalogo.png";
import ambherlogo from "../src/assets/images/ambherlogo.png";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import Footer from "./Footer";







// Disable Mapbox telemetry globally to prevent ERR_BLOCKED_BY_CLIENT errors
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && (
        url.includes('events.mapbox.com') || 
        url.includes('analytics.mapbox.com') ||
        url.includes('telemetry') ||
        url.includes('/events/v2')
      )) {
      console.log('🚫 Blocked fetch telemetry request:', url);
      return Promise.resolve(new Response('{}', { status: 200, statusText: 'OK' }));
    }
    return originalFetch.call(this, url, options);
  };
}

// Add essential CSS for Mapbox functionality
const mapStyles = document.createElement('style');
mapStyles.textContent = `
  .mapboxgl-ctrl-directions {
    display: none !important;
  }
  .mapbox-directions-waypoint,
  .mapbox-directions-waypoint-0,
  .mapbox-directions-waypoint-1 {
    pointer-events: none !important;
    cursor: default !important;
  }
  .mapbox-directions-route-line,
  .mapbox-directions-route-line-alt {
    pointer-events: none !important;
  }
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
    z-index: 9999 !important;
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
    right: 0 !important;
    position: fixed !important;
    z-index: 9999 !important;
    background: #000 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
  #geographicmapcontainer:-webkit-full-screen .mapboxgl-map,
  #geographicmapcontainer:-moz-full-screen .mapboxgl-map,
  #geographicmapcontainer:fullscreen .mapboxgl-map {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
  }
  body:-webkit-full-screen,
  body:-moz-full-screen,
  body:fullscreen {
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  #geographicmapcontainer:-webkit-full-screen .directions-content,
  #geographicmapcontainer:-moz-full-screen .directions-content,
  #geographicmapcontainer:fullscreen .directions-content {
    max-height: calc(100vh - 120px) !important;
  }
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
  @keyframes location-pulse {
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
  .animate-location-pulse {
    animation: location-pulse 2s infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  #geographicmapcontainer {
    height: 100% !important;
    min-height: 580px;
    display: flex !important;
    flex-direction: column !important;
  }
  .mapboxgl-map {
    width: 100% !important;
    height: 100% !important;
    flex: 1 !important;
    min-height: 580px !important;
  }
`;
document.head.appendChild(mapStyles);

function PatientLandingpage() {
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

  const apiUrl = import.meta.env.VITE_API_URL;

  const [clinicLocations, setClinicLocations] = useState([]);
  const [loadingClinicLocations, setLoadingClinicLocations] = useState(true);
  const [selectedClinicLocation, setSelectedClinicLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState({ text: '', type: '' });
  const [clinicFilter, setClinicFilter] = useState('all'); // 'all', 'ambher', 'bautista'

  const [userLocation, setUserLocation] = useState(null);
  const [loadingUserLocation, setLoadingUserLocation] = useState(false);
  const [userLocationError, setUserLocationError] = useState(null);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapMarkersRef = useRef(new Map());
  const userLocationMarkerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState([120.4818, 14.6417]);
  const [mapZoom, setMapZoom] = useState(10);

  const [showDirections, setShowDirections] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [directionsSteps, setDirectionsSteps] = useState([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [activeRouteClinicId, setActiveRouteClinicId] = useState(null);
  const directionsControl = useRef(null);
  const isInitializingMap = useRef(false);
  const directionsInitialized = useRef(false);
  const currentPopup = useRef(null);
  
  const legendControlRef = useRef(null);
  const directionsPanelRef = useRef(null);

  // Utility function to calculate distance between two coordinates
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }, []);

  // Function to get filtered and sorted clinics
  const getFilteredAndSortedClinics = useCallback(() => {
    let filtered = clinicLocations;

    // Apply filter
    if (clinicFilter === 'ambher') {
      filtered = filtered.filter(clinic => clinic.clinicType === 'Ambher Optical');
    } else if (clinicFilter === 'bautista') {
      filtered = filtered.filter(clinic => clinic.clinicType === 'Bautista Eye Center');
    }

    // Sort by distance if user location is available
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      filtered = filtered.map(clinic => {
        if (clinic.coordinates?.coordinates) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            clinic.coordinates.coordinates[1],
            clinic.coordinates.coordinates[0]
          );
          return { ...clinic, distance };
        }
        return { ...clinic, distance: Infinity };
      }).sort((a, b) => a.distance - b.distance);
    }

    return filtered;
  }, [clinicLocations, clinicFilter, userLocation, calculateDistance]);

  const filteredClinics = getFilteredAndSortedClinics();

  // Function to update marker visibility based on current filter
  const updateMarkerVisibility = useCallback(() => {
    if (!map.current || !mapMarkersRef.current) return;

    mapMarkersRef.current.forEach((marker, clinicId) => {
      // Find the clinic data for this marker
      const clinic = clinicLocations.find(c => c._id === clinicId);
      if (!clinic) return;

      const markerElement = marker.getElement();
      let shouldShow = true;

      // Determine if marker should be visible based on filter
      if (clinicFilter === 'ambher') {
        shouldShow = clinic.clinicType === 'Ambher Optical';
      } else if (clinicFilter === 'bautista') {
        shouldShow = clinic.clinicType === 'Bautista Eye Center';
      }
      // For 'all' filter, all markers should be visible

      if (shouldShow) {
        markerElement.style.display = 'block';
        markerElement.style.opacity = clinic.isActive ? '1' : '0.6';
      } else {
        markerElement.style.display = 'none';
      }
    });
  }, [clinicLocations, clinicFilter]);

  // Update marker visibility whenever filter changes
  useEffect(() => {
    updateMarkerVisibility();
  }, [clinicFilter, updateMarkerVisibility]);

  const fetchClinicLocations = useCallback(async () => {
    try {
      setLoadingClinicLocations(true);
      const baseUrl = apiUrl || 'http://localhost:3000';
      const fetchUrl = `${baseUrl}/api/cliniclocation/clinics`;
      console.log('Fetching clinic locations from:', fetchUrl);
      
      const response = await fetch(fetchUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received clinic data:', data);
        
        if (data.success && Array.isArray(data.data)) {
          const activeClinics = data.data.filter(clinic => clinic.isActive !== false);
          setClinicLocations(activeClinics);
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
  }, [apiUrl]);

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

    const maxAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setUserLocation({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        });
        
        setLoadingUserLocation(false);

        if (map.current) {
          const zoomLevel = accuracy <= 10 ? 18 :
                           accuracy <= 25 ? 16 :
                           accuracy <= 50 ? 15 :
                           accuracy <= 100 ? 14 : 13;
          
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: zoomLevel,
            duration: 2000,
            essential: true
          });
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLoadingUserLocation(false);
        
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setUserLocationError(errorMessage);
      },
      maxAccuracyOptions
    );
  }, []);

  const initializeDirectionsControl = useCallback(() => {
    if (!map.current || directionsControl.current || directionsInitialized.current) return;

    console.log('🧭 Initializing directions control...');
    directionsInitialized.current = true;

    directionsControl.current = new MapboxDirections({
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      unit: 'metric',
      profile: 'mapbox/driving',
      alternatives: false,
      geometries: 'geojson',
      controls: {
        instructions: false,
        inputs: false,
        profileSwitcher: false
      },
      flyTo: false,
      interactive: false
    });

    map.current.addControl(directionsControl.current, 'top-left');
    
    setTimeout(() => {
      const directionsElement = document.querySelector('.mapboxgl-ctrl-directions');
      if (directionsElement) {
        directionsElement.style.display = 'none';
      }
    }, 100);
    
    directionsControl.current.on('route', (event) => {
      if (event.route && event.route[0]) {
        const route = event.route[0];
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1),
          duration: Math.round(route.duration / 60),
          geometry: route.geometry
        });
        setDirectionsSteps(route.legs[0]?.steps || []);
        setIsLoadingRoute(false);
        setShowDirections(true);
      }
    });

    directionsControl.current.on('error', () => {
      setIsLoadingRoute(false);
      setLocationMessage({
        text: 'Failed to calculate route. Please try again.',
        type: 'error'
      });
    });

    directionsControl.current.on('clear', () => {
      setShowDirections(false);
      setRouteInfo(null);
      setDirectionsSteps([]);
    });
  }, []);

  const clearDirections = useCallback(() => {
    if (directionsControl.current) {
      directionsControl.current.removeRoutes();
    }
    setShowDirections(false);
    setRouteInfo(null);
    setDirectionsSteps([]);
    setIsLoadingRoute(false);
    setActiveRouteClinicId(null);
  }, []);

  const hideDirectionsModal = useCallback(() => {
    setShowDirections(false);
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

  useEffect(() => {
    if (!mapContainer.current) return;

    if (isInitializingMap.current) return;
    
    if (map.current && map.current.getContainer() === mapContainer.current) {
      return;
    }

    isInitializingMap.current = true;

    if (map.current) {
      try {
        map.current.remove();
      } catch (error) {
        console.warn('Warning during map cleanup:', error);
      }
      map.current = null;
      setMapLoaded(false);
      mapMarkersRef.current.clear();
      
      if (directionsControl.current) {
        directionsControl.current = null;
      }
      directionsInitialized.current = false;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [120.4818, 14.6417],
        zoom: 10,
        bearing: 0,
        pitch: 0,
        maxPitch: 0,
        dragRotate: false,
        touchPitch: false,
        attributionControl: true,
        logoPosition: 'bottom-right',
        collectResourceTiming: false,
        transformRequest: (url) => {
          if (url.includes('events.mapbox.com') || url.includes('analytics') || url.includes('telemetry')) {
            return { url: '', headers: {} };
          }
          return { url, headers: {} };
        }
      });

      map.current.addControl(new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true,
        visualizePitch: false
      }));

      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: true,
        fitBoundsOptions: {
          maxZoom: 17,
          padding: 50
        }
      });
      
      geolocate.on('geolocate', (e) => {        
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
      
      map.current.addControl(geolocate);

      const fullscreenControl = new mapboxgl.FullscreenControl({
        container: mapContainer.current.parentElement
      });
      map.current.addControl(fullscreenControl, 'top-right');
      console.log('Fullscreen control added');

      map.current.on('load', () => {
        setMapLoaded(true);
        isInitializingMap.current = false;
        
        // Force map resize to fill container properly
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('Map resized after load');
          }
        }, 100);
        
        // Additional resize attempts to ensure proper rendering
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('Map resized again for safety');
          }
        }, 500);
      });

    } catch (error) {
      console.error('Failed to create map instance:', error);
      setLocationMessage({ 
        text: 'Failed to initialize map. Please refresh the page.', 
        type: 'error' 
      });
      isInitializingMap.current = false;
      return;
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
      }
      mapMarkersRef.current.clear();
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.remove();
        userLocationMarkerRef.current = null;
      }
      if (directionsControl.current) {
        directionsControl.current = null;
      }
      isInitializingMap.current = false;
      directionsInitialized.current = false;
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && !directionsInitialized.current) {
      initializeDirectionsControl();
    }
  }, [mapLoaded, initializeDirectionsControl]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !clinicLocations) return;

    const markersOnMap = mapMarkersRef.current;
    const newMarkers = new Map();

    if (Array.isArray(clinicLocations)) {
      clinicLocations.forEach(clinic => {
        const clinicId = clinic._id;
        if (!clinicId) return;

        let longitude, latitude;

        if (clinic.coordinates?.coordinates && Array.isArray(clinic.coordinates.coordinates)) {
          longitude = clinic.coordinates.coordinates[0];
          latitude = clinic.coordinates.coordinates[1];
        } else if (clinic.coordinates?.longitude && clinic.coordinates?.latitude) {
          longitude = clinic.coordinates.longitude;
          latitude = clinic.coordinates.latitude;
        }

        if (!longitude || !latitude) return;

        if (markersOnMap.has(clinicId)) {
          const existingMarker = markersOnMap.get(clinicId);
          existingMarker.setLngLat([longitude, latitude]);
          newMarkers.set(clinicId, existingMarker);
          markersOnMap.delete(clinicId);
        } else {
          const markerEl = document.createElement('img');
          markerEl.className = 'w-10 h-10 rounded-full transition-all duration-200 ease-out will-change-transform transform-gpu hover:shadow-lg cursor-pointer border-2 border-white shadow-md';
          markerEl.setAttribute('data-clinic-marker', 'true');
          markerEl.setAttribute('data-clinic-id', clinicId);
          
          if (clinic.clinicType === 'Ambher Optical') {
            markerEl.src = ambherlogo;
          } else if (clinic.clinicType === 'Bautista Eye Center') {
            markerEl.src = bautistalogo;
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
            ${!clinic.isActive ? 'opacity: 0.6;' : ''}
          `;
          
          markerEl.title = clinic.isActive ? clinic.clinicName : `${clinic.clinicName} (Inactive)`;

          const popupContent = `
            <div class="bg-white p-4 w-72 sm:w-80 max-w-sm relative">
              <div class="flex items-center mb-3 pr-6">
                <div class="w-12 h-12 rounded-full flex items-center justify-center mr-3">
                  <img src="${clinic.clinicType === 'Ambher Optical' ? ambherlogo : bautistalogo}" class="w-10 h-10 rounded-full object-cover"/>
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-bold text-lg text-[#1f1f1f]">${clinic.clinicName}</h3>
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

          const popup = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false 
          }).setHTML(popupContent);

          popup.on('open', () => {
            if (currentPopup.current && currentPopup.current !== popup) {
              currentPopup.current.remove();
            }
            currentPopup.current = popup;
          });

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

    markersOnMap.forEach((marker) => {
      marker.remove();
    });

    mapMarkersRef.current = newMarkers;
    
    // Update marker visibility based on current filter after markers are created
    setTimeout(() => updateMarkerVisibility(), 100);
  }, [mapLoaded, clinicLocations, userLocation, updateMarkerVisibility]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !userLocation) return;

    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.remove();
      userLocationMarkerRef.current = null;
    }

    const userMarkerEl = document.createElement('div');
    userMarkerEl.className = 'w-5 h-5 rounded-full bg-emerald-500 border-3 border-white shadow-md animate-location-pulse transform-gpu will-change-auto';

    userMarkerEl.title = `Your Location (Accuracy: ${Math.round(userLocation.accuracy)}m)`;

    const userPopupContent = `
      <div class="bg-white p-4 w-64 max-w-sm relative">
        <div class="flex items-center mb-3">
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <i class="bx bx-current-location text-white text-lg"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg leading-tight mb-1">Your Location</h3>
            <span class="px-2 py-1 text-xs rounded-full font-medium ${
              userLocation.accuracy <= 20 ? 'bg-green-100 text-green-800' :
              userLocation.accuracy <= 50 ? 'bg-blue-100 text-blue-800' :
              userLocation.accuracy <= 100 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }">
              ${userLocation.accuracy <= 20 ? 'Excellent' :
                userLocation.accuracy <= 50 ? 'Good' :
                userLocation.accuracy <= 100 ? 'Fair' : 'Poor'} Accuracy
            </span>
          </div>
        </div>
        
        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2">
            <i class="bx bx-current-location text-red-500 text-sm flex-shrink-0"></i>
            <span class="text-xs text-gray-600 font-mono">${userLocation.latitude.toFixed(6)}°, ${userLocation.longitude.toFixed(6)}°</span>
          </div>
          
          <div class="flex items-center gap-2">
            <i class="bx bx-target-lock text-blue-500 text-sm flex-shrink-0"></i>
            <span class="text-sm text-gray-700">Accuracy: ±${Math.round(userLocation.accuracy)} meters</span>
          </div>
          
          ${userLocation.altitude ? `
          <div class="flex items-center gap-2">
            <i class="bx bx-trending-up text-green-500 text-sm flex-shrink-0"></i>
            <span class="text-sm text-gray-700">Altitude: ${Math.round(userLocation.altitude)}m</span>
          </div>
          ` : ''}
          
          <div class="flex items-center gap-2">
            <i class="bx bx-time text-gray-500 text-sm flex-shrink-0"></i>
            <span class="text-sm text-gray-700">Updated: ${new Date(userLocation.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button 
            onclick="if(window.getUserLocationFunction) { window.getUserLocationFunction(); }"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <i class="bx bx-crosshair text-sm"></i>
            Update Location
          </button>
        </div>
      </div>
    `;

    const userPopup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '280px',
      className: 'user-location-popup'
    }).setHTML(userPopupContent);

    const userMarker = new mapboxgl.Marker({
      element: userMarkerEl,
      anchor: 'center'
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(userPopup)
      .addTo(map.current);

    userLocationMarkerRef.current = userMarker;

    console.log('🗺️ User location marker added:', {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      accuracy: userLocation.accuracy
    });
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    window.getUserLocationFunction = getUserLocation;
    
    window.showDirectionsToClinic = (clinicId) => {
      const clinic = clinicLocations.find(c => c._id === clinicId);
      
      if (!clinic) {
        alert('Clinic not found. Please try again.');
        return;
      }

      if (!userLocation) {
        alert('Please enable location services to get directions');
        return;
      }

      if (!map.current) {
        alert('Map is not ready. Please try again.');
        return;
      }

      if (!directionsControl.current) {
        alert('Directions service is not available. Please try again.');
        return;
      }

      setIsLoadingRoute(true);
      setShowDirections(true);
      setRouteInfo(null);
      setDirectionsSteps([]);
      setActiveRouteClinicId(clinicId);

      try {
        directionsControl.current.removeRoutes();
        directionsControl.current.setOrigin([userLocation.longitude, userLocation.latitude]);
        
        let clinicLng, clinicLat;
        
        if (clinic.coordinates?.coordinates && Array.isArray(clinic.coordinates.coordinates)) {
          clinicLng = clinic.coordinates.coordinates[0];
          clinicLat = clinic.coordinates.coordinates[1];
        } else if (clinic.coordinates?.longitude && clinic.coordinates?.latitude) {
          clinicLng = clinic.coordinates.longitude;
          clinicLat = clinic.coordinates.latitude;
        } else {
          alert('Invalid clinic coordinates. Cannot calculate route.');
          setIsLoadingRoute(false);
          return;
        }

        directionsControl.current.setDestination([clinicLng, clinicLat]);
        
        map.current.fitBounds([
          [Math.min(userLocation.longitude, clinicLng), Math.min(userLocation.latitude, clinicLat)],
          [Math.max(userLocation.longitude, clinicLng), Math.max(userLocation.latitude, clinicLat)]
        ], {
          padding: 100,
          duration: 1000
        });
        
      } catch (error) {
        console.error('Error setting up directions:', error);
        setIsLoadingRoute(false);
        alert('Failed to calculate route. Please try again.');
      }
    };

    return () => {
      delete window.showDirectionsToClinic;
    };
  }, [clinicLocations, userLocation, mapLoaded, getUserLocation]);

  useEffect(() => {
    fetchClinicLocations();
  }, [fetchClinicLocations]);

  useEffect(() => {
    if (locationMessage.text) {
      const timer = setTimeout(() => {
        setLocationMessage({ text: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationMessage]);




  useEffect(() => {
// Add fullscreen event listeners for better UX
const handleFullscreenChange = () => {
  const isFullscreen = document.fullscreenElement || 
                      document.webkitFullscreenElement || 
                      document.mozFullScreenElement;
  
  const mapContainer = document.querySelector('#geographicmapcontainer');
  
  if (isFullscreen) {
    console.log('🔍 Map entered fullscreen mode');

    
    if (mapContainer) {
      // Store original styles for restoration
      mapContainer.dataset.originalStyles = JSON.stringify({
        width: mapContainer.style.width,
        height: mapContainer.style.height,
        position: mapContainer.style.position,
        zIndex: mapContainer.style.zIndex
      });
      
      // Apply fullscreen styles
      Object.assign(mapContainer.style, {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        zIndex: '9999',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        margin: '0',
        padding: '0',
        border: 'none',
        borderRadius: '0'
      });
    }
    
    // Force immediate map resize
    setTimeout(() => {
      if (map.current) {
        map.current.resize();
        // Additional resize after a short delay
        setTimeout(() => map.current && map.current.resize(), 100);
      }
    }, 50);
    
  } else {
    console.log('🔍 Map exited fullscreen mode');

    
    if (mapContainer) {
      // Restore original styles
      const originalStyles = mapContainer.dataset.originalStyles 
        ? JSON.parse(mapContainer.dataset.originalStyles)
        : {};
      
      Object.assign(mapContainer.style, {
        width: originalStyles.width || '100%',
        height: originalStyles.height || '580px', // CRITICAL: Restore original height
        position: originalStyles.position || 'relative',
        zIndex: originalStyles.zIndex || 'auto',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        margin: '0',
        padding: '0',
        border: 'none',
        borderRadius: '16px'
      });
    }
    
    // Force map resize with multiple attempts to ensure proper rendering
    if (map.current) {
      setTimeout(() => {
        map.current.resize();
        setTimeout(() => map.current && map.current.resize(), 100);
        setTimeout(() => map.current && map.current.resize(), 300);
      }, 50);
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

  // Add window resize listener to ensure map always fills container
  useEffect(() => {
    const handleResize = () => {
      if (map.current && mapLoaded) {
        // Delay resize to allow container to finish resizing
        setTimeout(() => {
          map.current.resize();
          console.log('Map resized on window resize');
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Also trigger resize on component mount
    if (mapLoaded) {
      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mapLoaded]);

  // Force map resize when container visibility changes
  useEffect(() => {
    if (mapLoaded && map.current) {
      const observer = new ResizeObserver(() => {
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            console.log('Map resized on container size change');
          }
        }, 50);
      });

      const container = document.getElementById('geographicmapcontainer');
      if (container) {
        observer.observe(container);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [mapLoaded]);

























































  

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

            {/* Navigation Links - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-1">
              <Link 
                to="/patientlandingpage" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Home
              </Link>
              {localStorage.getItem("patienttoken") && (
                <Link 
                  to="/patientdashboard" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                >
                  Appointments
                </Link>
              )}
              <Link 
                to="/patientproducts" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                Store
              </Link>
              {localStorage.getItem("patienttoken") && (
                <>
                  <Link 
                    to="/patientwishlist" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  >
                    Wishlist
                  </Link>
                  <Link 
                    to="/patientorders" 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  >
                    Orders
                  </Link>
                </>
              )}
              <Link 
                to="/aboutpage" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                About
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <div
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
                  {!patientprofilepicture ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 animate-pulse flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                    </div>
                  ) : (
                    <img 
                      src={patientprofilepicture} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{patientfirstname}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {showlogoutbtn && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {!patientprofilepicture ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-white" />
                          </div>
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
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
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
                className="hidden lg:block cursor-pointer"
              >
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
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {localStorage.getItem("patienttoken") && (
              <Link 
                to="/patientdashboard" 
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Appointments
              </Link>
            )}
            <Link 
              to="/patientproducts" 
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Store
            </Link>
            {localStorage.getItem("patienttoken") && (
              <>
                <Link 
                  to="/patientwishlist" 
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link 
                  to="/patientorders" 
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}
            <Link 
              to="/aboutpage" 
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Mobile Profile Section */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              {localStorage.getItem("patienttoken") ? (
                <>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg mb-2">
                    {!patientprofilepicture ? (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-white" />
                      </div>
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
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
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
                  className="cursor-pointer"
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



















      

      <section id="oldlandingpage" className="pt-15 motion-preset-slide-up relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">


        <div className="relative z-10 bg-cover bg-center min-h-screen flex flex-col lg:flex-row items-center justify-center" >
          <div className=" w-full lg:w-[50%] h-full items-center justify-center mb-40 px-4 sm:px-8 lg:pl-14">

            <img src={landinglogodark} className="w-60 sm:w-80 lg:w-130 mt-5 ml-0 lg:ml-16 mx-auto lg:mx-0"/>
            <h1 className="text-[24px] sm:text-[32px] lg:text-[40px] text-center lg:text-left pl-0 lg:pl-17 mt-6 sm:mt-8 font-albertsans font-bold italic text-[#2d2d44]">
              <Typewriter options={{
                strings: ['Greet the world with a better view!', 'In collaboration with:', 'Ambher Optical,', 'Bautista Eye Center,', 'and DevOps Team!'], 
                autoStart: true, loop: true, cursor: '|'}}/>
            </h1>
            <div className=" ml-0 lg:ml-17 mr-0 lg:mr-28  pb-5">
              <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-center lg:text-left mt-6 sm:mt-8 font-medium font-albertsans text-[#2d2d44]">"Redefining eyewear with style, innovation, and clarity. Experience the future of vision at Eye2Wear—where every eyesight tells a story."</p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-10 justify-center lg:justify-start">
                <div className="flex justify-center align-middle p-3 bg-gray-800 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all"><i className="bx bx-expand-alt mt-1 pr-2 font-bold text-white"/><p className="font-semibold text-white">Explore</p></div>
                {localStorage.getItem("patienttoken") && (
                  <Link to="/patientdashboard"><div className="flex justify-center align-middle p-3 bg-[#027bbf] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all"><i className="bx bx-bookmark mt-1 pr-2 text-white"/><p className="font-semibold text-white">Book Appointment</p></div></Link>
                )}
              </div>
            </div>

          </div>
          <div className="w-full lg:w-[50%] h-full items-center justify-center flex">
            <img src={eyemodel2} className="w-60 sm:w-80 lg:w-140 h-60 sm:h-80 lg:h-140 mt-8 mb-50 lg:mt-[35px] pr-0 lg:pr-6 rotate-[-0.3deg]"/>

          </div>

          
        </div>
      </section>

















      <section className="bg-white min-h-[160vh] w-[99.5%]">
        <div className="bg-cover bg-center w-full min-h-screen flex flex-col items-center px-4 sm:px-8">
          <img src={lonelogo} className="w-20 sm:w-24 lg:w-30 mt-20 sm:mt-24 lg:mt-30" style={{ animation: 'spin 8s linear infinite' }}/>
          <h1 className="font-albertsans font-bold italic text-[#25255b] text-[18px] sm:text-[22px] lg:text-[25px] mt-5 text-center">A shared foundation to <span className="text-sky-600 font-matimo">serve the best</span> optical clinic</h1>
          <h2 className="text-[14px] sm:text-[16px] lg:text-[18px] font-medium italic text-[#2d2d44] text-center">Redefining the patient experience</h2>
          <div className="w-full h-max flex justify-center align-center">
            <div className="mt-8 sm:mt-12 lg:mt-15 w-full max-w-[1400px] h-auto lg:h-[800px] flex flex-col lg:flex-row justify-between align-center gap-4 lg:gap-0">
              <div className="h-auto lg:h-full w-full lg:w-[70%]">
                <div className="h-auto lg:h-[50%] pt-5 pr-0 lg:pr-2 pl-0 lg:pl-5 flex flex-col sm:flex-row justify-center align-start gap-4 lg:gap-0">
                  <div className="bg-cover bg-center w-full sm:w-[60%] hover:scale-105 transition-all bg-white border-1 border-gray-200 shadow-md sm:mr-5 rounded-4xl flex flex-col justify-end pl-6 sm:pl-8 lg:pl-10 pb-6 sm:pb-8 lg:pb-10 h-48 sm:h-56 lg:h-auto" style={{ backgroundImage: `url(${bentoglass})` }}>
                    <h1 className="font-albertsans font-semibold italic text-white text-[18px] sm:text-[22px] lg:text-[25px]">Browse our products</h1>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium italic text-white">Try different frames, eyeglasses, and contact lenses.</p>
                  </div>
                  <div className="bg-cover bg-center bg-white border-1 border-gray-200 hover:scale-105 transition-all shadow-md w-full sm:w-[40%] rounded-4xl flex flex-col justify-end pl-6 sm:pl-8 lg:pl-10 pb-6 sm:pb-8 lg:pb-10 h-48 sm:h-56 lg:h-auto" style={{ backgroundImage: `url(${bentofeedback})` }}>
                    <h1 className="font-albertsans font-semibold italic text-white text-[18px] sm:text-[22px] lg:text-[25px]">Positive Feedbacks</h1>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium italic text-white">Best effort in every service</p>
                  </div>
                </div>
                <div className="h-auto lg:h-[50%] pr-0 lg:pr-2 pt-5 pl-0 lg:pl-5 flex flex-col sm:flex-row justify-center align-center gap-4 lg:gap-0">
                  <div className="bg-cover bg-center bg-white border-1 border-gray-200 hover:scale-105 transition-all shadow-md sm:mr-5 w-full sm:w-[40%] rounded-4xl flex flex-col justify-end pl-6 sm:pl-8 lg:pl-10 pb-6 sm:pb-8 lg:pb-10 h-48 sm:h-56 lg:h-auto" style={{ backgroundImage: `url(${bentosurgery})` }}>
                    <h1 className="font-albertsans font-semibold italic text-white text-[18px] sm:text-[22px] lg:text-[25px]">Eye Surgeries</h1>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium italic text-white">Careful treatment of eye diseases</p>
                  </div>
                  <div className="bg-cover bg-center bg-white border-1 border-gray-200 hover:scale-105 transition-all shadow-md w-full sm:w-[60%] rounded-4xl flex flex-col justify-end pl-6 sm:pl-8 lg:pl-10 pb-6 sm:pb-8 lg:pb-10 h-48 sm:h-56 lg:h-auto" style={{ backgroundImage: `url(${bentoexam})` }}>
                    <h1 className="font-albertsans font-semibold italic text-white text-[18px] sm:text-[22px] lg:text-[25px]">Comprehensive Eye Exam</h1>
                    <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium italic text-white">Evaluation of eye health and vision</p>
                  </div>
                </div>
              </div>
              <div className="h-auto lg:h-full w-full lg:w-[30%] pl-0 lg:pl-2 pt-5 pb-5 pr-0 lg:pr-5 flex flex-col gap-4 lg:gap-0">
                <div className="bg-cover bg-center bg-white border-1 border-gray-200 hover:scale-105 transition-all shadow-md h-48 sm:h-56 lg:h-[60%] rounded-4xl lg:mb-5 flex flex-col justify-end pl-6 sm:pl-8 lg:pl-10 pb-6 sm:pb-8 lg:pb-10" style={{ backgroundImage: `url(${bentomachines})` }}>
                  <h1 className="font-albertsans font-semibold italic text-white text-[18px] sm:text-[22px] lg:text-[25px]">Quality Machines</h1>
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium italic text-white">Updated eye-exam technologies</p>
                </div>
                <div className="bg-cover bg-center bg-white border-1 border-gray-200 hover:scale-105 transition-all shadow-md h-48 sm:h-56 lg:h-[40%] rounded-4xl flex flex-col justify-end pl-6 sm:pl-8 lg:pl-10 pb-6 sm:pb-8 lg:pb-10" style={{ backgroundImage: `url(${bentoconsult})` }}>
                  <h1 className="font-albertsans font-semibold italic text-white text-[18px] sm:text-[22px] lg:text-[25px]">Direct Messaging</h1>
                  <p className="text-[13px] sm:text-[14px] lg:text-[15px] font-medium italic text-white">Efficient communication with your eye-specialist</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>












      <section className="pb-50 pt-50 flex flex-col items-center justify-start bg-white min-h-screen h-auto w-[99.5%]">
        <div id="mappingintegration" className="flex flex-col px-10 sm:px-15 pb-3 pt-4 transition-all duration-300 ease-in-out  bg-white   w-[100%] min-h-full h-auto rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <i className="bx bx-street-view text-[#184d85] text-[24px] sm:text-[30px] mr-3"/>
              <div>
                <h1 className="font-albertsans font-bold text-[#184d85] text-[22px] sm:text-[28px]">Find Our Clinics</h1>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div 
                onClick={getUserLocation} 
                disabled={loadingUserLocation} 
                className={`bg-gray-800 rounded-2xl cursor-pointer hover:cursor-pointer transition-all gap-2 duration-300 ease-in-out px-3 sm:px-4 py-2 text-white font-medium flex items-center flex-1 sm:flex-none justify-center`}
              >
                <i className={`bx ${loadingUserLocation ? 'bx-loader-alt bx-spin' : 'bx-current-location'}`}></i>
                <div className="select-none rounded-2xl cursor-pointer hover:cursor-pointer transition-all duration-300 ease-in-out flex flex-col items-start">
                  <span className="text-[13px] sm:text-[15px]">{loadingUserLocation ? 'Locating...' : userLocation ? 'Update Location' : 'Get Location'}</span>
                  {userLocation && !loadingUserLocation && (
                    <span className="text-[10px] sm:text-[12px] opacity-90">
                      {userLocation.accuracy <= 20 ? 'Excellent' :
                       userLocation.accuracy <= 50 ? 'Good' :
                       userLocation.accuracy <= 100 ? 'Fair' : 'Poor'} 
                       ({Math.round(userLocation.accuracy)}m)
                     </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loadingClinicLocations && (
            <div className="transition-all duration-300 ease-in-out mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <i className="bx bx-loader-alt bx-spin text-blue-500 mr-2"></i>
                <span className="text-blue-700">Loading clinic locations...</span>
              </div>
            </div>
          )}

          {locationMessage.text && (
            <div className={`transition-all duration-300 ease-in-out mb-4 p-3 rounded-lg ${
              locationMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' :
              locationMessage.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
              locationMessage.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' :
              'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              <div className="flex items-center">
                <i className={`bx ${
                  locationMessage.type === 'success' ? 'bx-check-circle' :
                  locationMessage.type === 'warning' ? 'bx-error-circle' :
                  locationMessage.type === 'error' ? 'bx-x-circle' :
                  'bx-info-circle'
                } mr-2`}></i>
                <span>{locationMessage.text}</span>
              </div>
            </div>
          )}

          <div className="transition-all duration-300 ease-in-out gap-4 flex flex-col lg:flex-row justify-center items-start flex-1 min-h-[400px] sm:min-h-[580px]">
            <div id="geographicmapcontainer" className="transition-all duration-300 ease-in-out relative bg-[#efefef] rounded-2xl shadow-lg w-full lg:w-[70%] h-[400px] sm:h-[580px] overflow-hidden">
              <div
                ref={mapContainer}
                className="transition-all duration-300 ease-in-out w-full h-full rounded-2xl"
                style={{
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  height: '100%',
                  minHeight: '400px'
                }}
              />
              {!mapLoaded && (
                <div className="bg-white/80 flex items-center justify-center absolute z-30 inset-0">
                  <div className="text-center">
                    <div className="mx-auto animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#096482] mb-3"></div>
                    <p className="text-[#1e1e1e] text-sm sm:text-base">Loading map...</p>
                  </div>
                </div>
              )}
              {showDirections && (
                <div 
                  ref={directionsPanelRef} 
                  className={`absolute top-2.5 left-2.5 w-80 bg-white rounded-xl shadow-xl z-[50] overflow-hidden transition-transform duration-300 ease-in-out ${showDirections ? 'translate-x-0' : '-translate-x-full'}`}
                >
                  <div className="bg-[#2781af] text-white pr-2 pl-3 flex justify-between items-center">
                    <h3 className="font-bold">Route Directions</h3>
                    <div onClick={hideDirectionsModal} className="bg-transparent border-none duration-300 text-white text-lg cursor-pointer p-1 rounded transition-all ease-in-out">
                      <i className="bx bx-x"></i>
                    </div>
                  </div>
                  <div className="directions-content h-auto max-h-[480px] overflow-y-auto p-2.5">
                    {isLoadingRoute && (
                      <div className="flex items-center justify-center py-8">
                        <div className="border-[#096482] animate-spin rounded-full h-8 w-8 border-b-2"></div>
                        <span className="text-[#1e1e1e] ml-3">Loading route...</span>
                      </div>
                    )}
                    {!isLoadingRoute && !routeInfo && directionsSteps.length === 0 && (
                      <div className="text-[#2f2f2f] text-center py-8">
                        <i className="bx bx-map-pin text-4xl mb-2"></i>
                        <p>Select clinic to get directions</p>
                      </div>
                    )}
                    {routeInfo && (
                      <div className="bg-[#f4f4f4] p-2.5 mb-2.5 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{routeInfo.distance} km</p>
                            <p className="text-sm text-gray-600">{routeInfo.duration} minutes</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="bx bx-car text-[25px] text-[#08a0d3]"></i>
                            <div 
                              onClick={clearDirections}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
                              title="Clear route"
                            >
                              <i className="bx bx-trash"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {directionsSteps.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 text-gray-800">Routes</h4>
                        {directionsSteps.map((step, index) => (
                          <div key={index} className={`py-2 flex gap-2.5 items-center ${index !== directionsSteps.length - 1 ? 'border-b border-[#5959593b]' : ''}`}>
                            <div className="w-6 h-6 bg-[#2781af] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                              <i className={`bx ${getStepIcon(step.maneuver.type)}`}></i>
                            </div>
                            <div className="flex-1">
                              <p className="text-[14px] leading-snug" dangerouslySetInnerHTML={{ __html: step.maneuver.instruction }}></p>
                              <p className="text-[11px] text-gray-500 mt-1">{(step.distance / 1000).toFixed(1)} km</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Show directions panel toggle button when directions are hidden but route exists */}
              {!showDirections && routeInfo && activeRouteClinicId && (
                <div
                  onClick={() => setShowDirections(true)}
                  className="cursor-pointer absolute top-2.5 left-2.5 bg-[#2781af] hover:bg-[#1f6b94] text-white px-3 py-2 rounded-lg shadow-lg z-[50] transition-colors duration-200 flex items-center gap-2"
                  title="Show route directions"
                >
                  <i className="bx bx-navigation"></i>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Route Info</span>
                    <span className="text-xs opacity-90">
                      {clinicLocations.find(c => c._id === activeRouteClinicId)?.clinicName || 'Clinic'}
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={legendControlRef} className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-[#ffffff]/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg z-20">
                <h4 className="text-[#1b1b1b] font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Legend</h4>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <img src={ambherlogo} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"/>
                    <span className="hidden sm:inline">Ambher Optical</span>
                    <span className="sm:hidden">Ambher</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <img src={bautistalogo} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"/>
                    <span className="hidden sm:inline">Bautista Eye Center</span>
                    <span className="sm:hidden">Bautista</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#39850d] border-1 border-white shadow animate-pulse"></div>
                    <span className="hidden sm:inline">Your Location</span>
                    <span className="sm:hidden">You</span>
                  </div>
                  {userLocation && (
                    <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                      <div className="text-[10px] sm:text-[11px] text-[#1c1c1c]">
                        <div className="flex items-center gap-1">
                          <i className={`bx ${userLocation.accuracy <= 20 ? 'bx-check-circle text-[#39850d]' :
                                             userLocation.accuracy <= 50 ? 'bx-check-circle text-[#1589b3]' :
                                             userLocation.accuracy <= 100 ? 'bx-error-circle text-[#e2c92b]' :
                                             'bx-error-circle text-red-500'}`}></i>
                          <span>{Math.round(userLocation.accuracy)}m</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div id="cliniclocationscontainer" className="bg-white shadow-lg rounded-2xl flex flex-col w-full lg:w-[30%] h-[400px] sm:h-[580px] overflow-hidden mt-4 lg:mt-0">
              {/* Header matching popup style */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <i className="bx bx-map-pin text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#1f1f1f]">Clinic Locations</h3>
                    <p className="text-sm text-gray-600">
                      {filteredClinics?.length || 0} available clinics
                    </p>
                  </div>
                </div>
                
                {/* Filter buttons matching popup style */}
                <div className="flex gap-2 flex-wrap">
                  <div
                    onClick={() => setClinicFilter('all')}
                    className={`cursor-pointer inline-block rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      clinicFilter === 'all'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <i className="bx bx-buildings mr-1"></i>
                    All Clinics
                  </div>
                  
                  <div
                    onClick={() => setClinicFilter('ambher')}
                    className={`cursor-pointer inline-block rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      clinicFilter === 'ambher'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <img src={ambherlogo} className="w-3 h-3 rounded-full object-cover inline mr-1"/>
                    Ambher
                  </div>
                  
                  <div
                    onClick={() => setClinicFilter('bautista')}
                    className={`cursor-pointer inline-block rounded-2xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      clinicFilter === 'bautista'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <img src={bautistalogo} className="w-3 h-3 rounded-full object-cover inline mr-1"/>
                    Bautista
                  </div>
                </div>
              </div>

              {/* Content Area matching popup style */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingClinicLocations ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="font-medium">Loading clinic locations...</p>
                  </div>
                ) : !filteredClinics || filteredClinics.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">🏥</div>
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No Clinics Found</h3>
                    <p className="text-sm">
                      {clinicFilter === 'all' ? 'No clinics available in this area' : 
                       clinicFilter === 'ambher' ? 'No Ambher Optical clinics found' :
                       'No Bautista Eye Center clinics found'}
                    </p>
                  </div>
                ) : (
                  filteredClinics.map((clinic, index) => (
                    <div
                      key={clinic._id || `clinic-${index}`}
                      className={`bg-white p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${
                        activeRouteClinicId === clinic._id 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        if (map.current && clinic.coordinates?.coordinates) {
                          map.current.flyTo({
                            center: [clinic.coordinates.coordinates[0], clinic.coordinates.coordinates[1]],
                            zoom: 16,
                            duration: 1500
                          });
                          const clinicId = clinic._id;
                          const marker = mapMarkersRef.current.get(clinicId);
                          if (marker) {
                            if (currentPopup.current) {
                              currentPopup.current.remove();
                            }
                            setTimeout(() => {
                              const popup = marker.getPopup();
                              if (popup) {
                                marker.togglePopup();
                              }
                            }, 800);
                          }
                        }
                      }}
                    >
                      {/* Clinic Header matching popup style */}
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3">
                          <img 
                            src={clinic.clinicType === 'Ambher Optical' ? ambherlogo : bautistalogo} 
                            className="w-10 h-10 rounded-full object-cover"
                            alt={clinic.clinicType}
                          />
                        </div>
                        <div className="min-w-0 ">
                          <h4 className="font-albartsans font-bold text-[16px] text-[#1f1f1f] mb-1 line-clamp-1">
                            {clinic.clinicName}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-block rounded-2xl px-2 py-1 text-[13px] font-semibold ${
                              clinic.clinicType === 'Ambher Optical' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {clinic.clinicType === 'Ambher Optical' ? 'Ambher' : 
                               clinic.clinicType === 'Bautista Eye Center' ? 'Bautista' : clinic.clinicType}
                            </span>
                            {clinic.distance !== undefined && clinic.distance !== Infinity && (
                              <span className="inline-block rounded-2xl px-2 py-1 text-[13px] font-semibold bg-orange-100 text-orange-800">
                                {clinic.distance < 1 
                                  ? `${Math.round(clinic.distance * 1000)}m`
                                  : `${clinic.distance.toFixed(1)}km`
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and details matching popup style */}
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                          {index === 0 && userLocation && clinic.distance !== undefined && clinic.distance !== Infinity && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <i className="bx bx-navigation text-xs"></i>
                              Nearest
                            </div>
                          )}

                        </div>
                        
                        <div className="font-medium flex items-start justify-start">
                          <i className="bx bx-map text-[#b42525] mr-2 mt-0.5 flex-shrink-0"></i>
                          <p className="break-words">{clinic.address?.fullAddress || 'Address not available'}</p>
                        </div>
                        
                        {clinic.contactInfo?.phone && (
                          <div className="font-medium flex items-center justify-start">
                            <i className="bx bx-phone text-[#209206] mr-2 flex-shrink-0"></i>
                            <p className="break-all">{clinic.contactInfo.phone}</p>
                          </div>
                        )}
                        
                        {clinic.contactInfo?.email && (
                          <div className="font-medium flex items-start justify-start">
                            <i className="bx bx-envelope text-[#4d9be0] mr-2 mt-0.5 flex-shrink-0"></i>
                            <p className="break-all">
                              <a 
                                href={`mailto:${clinic.contactInfo.email}`} 
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                              >
                                {clinic.contactInfo.email}
                              </a>
                            </p>
                          </div>
                        )}
                        

                      </div>


                    </div>
                  ))
                )}
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

export default PatientLandingpage;