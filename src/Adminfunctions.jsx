





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







































































































































































