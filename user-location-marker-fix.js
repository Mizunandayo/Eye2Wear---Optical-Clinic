// User Location Marker Fix for PatientLandingpage.jsx
// Add this code to your existing PatientLandingpage.jsx file

// 1. Add this ref to your existing state variables (around line 237):
const userLocationMarkerRef = useRef(null);

// 2. Add this useEffect after your existing clinic markers useEffect:
useEffect(() => {
  if (!map.current || !mapLoaded || !userLocation) return;

  // Remove existing user location marker if it exists
  if (userLocationMarkerRef.current) {
    userLocationMarkerRef.current.remove();
    userLocationMarkerRef.current = null;
  }

  // Create user location marker element
  const userMarkerEl = document.createElement('div');
  userMarkerEl.className = 'user-location-marker';
  userMarkerEl.style.cssText = `
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #39850d;
    border: 3px solid white;
    box-shadow: 0 0 0 2px rgba(57, 133, 13, 0.3), 0 2px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    animation: userLocationPulse 2s infinite;
  `;

  // Add pulsing animation if not already added
  if (!document.getElementById('userLocationStyles')) {
    const style = document.createElement('style');
    style.id = 'userLocationStyles';
    style.textContent = `
      @keyframes userLocationPulse {
        0% {
          box-shadow: 0 0 0 0 rgba(57, 133, 13, 0.7), 0 0 0 3px white, 0 2px 6px rgba(0,0,0,0.3);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(57, 133, 13, 0), 0 0 0 3px white, 0 2px 6px rgba(0,0,0,0.3);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(57, 133, 13, 0), 0 0 0 3px white, 0 2px 6px rgba(0,0,0,0.3);
        }
      }
    `;
    document.head.appendChild(style);
  }

  userMarkerEl.title = `Your Location (Accuracy: ${Math.round(userLocation.accuracy)}m)`;

  // Create popup for user location
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
          onclick="getUserLocation()"
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

  // Create and add user location marker
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

// 3. Also update your map cleanup function to include the user location marker:
// In your map initialization useEffect cleanup function, add:
if (userLocationMarkerRef.current) {
  userLocationMarkerRef.current.remove();
  userLocationMarkerRef.current = null;
}

/* 
INSTRUCTIONS:
1. Add the userLocationMarkerRef to your existing refs
2. Add the useEffect above after your clinic markers useEffect
3. Update your map cleanup to remove the user location marker
4. This will add a green pulsing marker for the user's location with a detailed popup
5. The marker will update automatically when the user's location changes
*/
