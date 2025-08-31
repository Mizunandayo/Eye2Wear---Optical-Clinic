

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







{/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} 
{/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} 
{/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} 
{/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} 
{/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} 
{/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} {/* Start of Mapping Integration */} 

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


{/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} 
{/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} 
{/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} 
{/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} 
{/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} 
{/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} {/* End of Mapping Integration */} 

