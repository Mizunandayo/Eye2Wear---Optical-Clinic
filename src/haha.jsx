





























































{/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} 
{/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} 
{/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} 
{/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} 
{/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} 
{/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} {/*Start of SMS Monitoring*/} 

 { (activedashboard === 'smsmonitoring' && !isAdminRole) && ( <div id="smsmonitoring" className="flex flex-col pl-5 pr-5 pb-3 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] min-h-full h-auto rounded-2xl" >
   <div className="flex items-center justify-between mb-4">
     <div className="flex items-center">
       <i className="bx bxs-message text-[#184d85] text-[25px] mr-2"/>
       <h1 className="font-albertsans font-bold text-[#184d85] text-[25px]">SMS Monitoring</h1>
     </div>
     
     {/* Refresh Button */}
     <div className="flex space-x-3">
       <div
         onClick={refreshSmsData}
         disabled={loadingSmsMessages}
         className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
       >
         <RefreshCw className={`w-4 h-4 mr-2 ${loadingSmsMessages ? 'animate-spin' : ''}`} />
         {loadingSmsMessages ? 'Refreshing...' : 'Refresh'}
       </div>
     </div>
   </div>
              




    <div id="recentsmsmessagestablelist">
      <div className="animate-fadeInUp flex flex-col  w-[100%] flex-1 rounded-2xl mt-5 min-h-0">
        
        {/* Search and Filter Section */}
        <div className="mt-5 w-full h-auto flex flex-col gap-4 px-2">
          {/* Search Bar */}
          <div className="w-full flex items-center">
            <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
            <div className="relative w-full flex items-center justify-center gap-3">
              <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
              <input 
                type="text" 
                placeholder="Enter message details, recipients, or content..." 
                value={searchSmsMessages} 
                onChange={(e) => {
                  setSearchSmsMessages(e.target.value);
                  setCurrentSmsPage(1); // Reset to page 1 when search changes
                  filterSmsMessages(e.target.value);
                }} 
                className="mr-1 transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
              />
            </div>


          </div>

          {/* Filter Section */}
          <div className="w-full flex justify-between items-center gap-6 mb-5">

            <div className="flex justify-center items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <h3 className="font-albertsans font-bold text-[16px] text-[#383838]">Status:</h3>
              <select 
                value={smsStatusFilter} 
                onChange={(e) => {
                  setSmsStatusFilter(e.target.value);
                  setCurrentSmsPage(1); // Reset to page 1 when filter changes
                }}
                className="px-3 py-2 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500 font-albertsans"
              >
                <option value="all">All Status</option>
                <option value="Sent">Sent</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <h3 className="font-albertsans font-bold text-[16px] text-[#383838]">Type:</h3>
              <select 
                value={smsTypeFilter} 
                onChange={(e) => {
                  setSmsTypeFilter(e.target.value);
                  setCurrentSmsPage(1); // Reset to page 1 when filter changes
                }}
                className="px-3 py-2 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500 font-albertsans"
              >
                <option value="all">All Types</option>
                <option value="Appointment">Appointment</option>
                <option value="Order Status">Order Status</option>
                <option value="Promotional">Promotional</option>
                <option value="Wishlist">Wishlist</option>
              </select>
            </div>
            </div>

            {/* SMS Credits and Send Button Section */}
            <div className="flex items-center gap-4">
              {/* SMS Credits Display */}
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200">
     
                <div className="flex items-center justify-center gap-3">
                  <span className="text-blue-800 font-semibold text-[17px]">SMS Credits</span>
                  {loadingSmsCredits ? (
                    <div className="animate-pulse bg-blue-200 h-4 w-12 rounded"></div>
                  ) : smsCreditsError ? (
                    <span className="text-red-500 text-xs cursor-pointer" onClick={() => fetchSmsCredits(true)} title="Click to retry">
                      Error - Retry
                    </span>
                  ) : smsCredits !== null ? (
                    <span className={`font-bold text-lg ${smsCredits < 10 ? 'text-red-600' : smsCredits < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                      {smsCredits.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">--</span>
                  )}
                </div>
                <div
                  onClick={() => fetchSmsCredits(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors ml-1"
                  title="Refresh credits"
                >
                  <i className="bx bx-refresh text-[17px]"></i>
                </div>
              </div>

              {/* Send Promotional SMS Button */}
              <div onClick={() => setShowPromotionalSmsModal(true)} id="sendsmspromotionalbutton" className="ml-1 w-75 h-10 bg-[#4ca22b] transition-all duration-300 ease-in-out hover:scale-105 rounded-2xl cursor-pointer flex justify-center items-center text-white font-semibold gap-2 text-[17px]">
                <i className="bx bxs-paper-plane"/> 
                <h1>Send Promotional SMS</h1> 
              </div>
            </div>

          </div>
        </div>

        {/* SMS Messages Table */}
        {loadingSmsMessages ? (
          <div className="overflow-hidden bg-white rounded-2xl shadow-md flex-1">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">Message ID</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Recipients</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Count</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Clinic</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Type</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Message</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Status</th>
                  <th className="pb-3 pt-3 pl-2 pr-2 text-center">Credits</th>
                  <th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2 text-center">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[...Array(4)].map((_, index) => (
                  <SmsRowSkeleton key={index} />
                ))}
              </tbody>
            </table>
          </div>
        ) : errorLoadingSmsMessages ? (
          <div className="rounded-lg p-4 bg-red-50 text-red-600 flex-1 flex items-center justify-center">
            <div className="text-center">
              <i className="bx bxs-error-alt text-3xl mb-2"></i>
              <p>Error: {errorLoadingSmsMessages}</p>
            </div>
          </div>
        ) : (filteredSmsMessages.length === 0 && (searchSmsMessages.trim() || smsStatusFilter !== 'all' || smsTypeFilter !== 'all')) ? (
          <div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6 flex-1 flex items-center justify-center">
            <div className="text-center">
              <i className="bx bx-search-alt text-3xl mb-2"></i>
              <p>No SMS messages found matching your filters.</p>
            </div>
          </div>
        ) : smsMessages.length === 0 ? (
          <div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6 flex-1 flex items-center justify-center">
            <div className="text-center">
              <i className="bx bx-message text-3xl mb-2"></i>
              <p>No SMS messages found.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 rounded-3xl w-full mt-2 bg-[#f7f7f7] min-h-0">
            <div className="flex-1 overflow-auto">
              <table className="min-w-full divide-y divide-gray-200 h-full">
                <thead className="bg- sticky top-0 z-10">
                  <tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
                    <th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">Message ID</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Recipients</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Count</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Sender Clinic</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Type</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Message</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Status</th>
                    <th className="pb-3 pt-3 pl-2 pr-2 text-center">Credits</th>
                    <th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2 text-center">Sent At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {(() => {
                    const paginatedSmsMessages = getPaginatedSmsData();
                    return paginatedSmsMessages.map((sms) => (
                      <tr 
                        key={sms._id || sms.messageId}
                        className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
                      >
                        <td className="py-3 px-6 text-[#171717] text-[15px] text-center font-albertsans font-medium whitespace-nowrap">
                          #{sms.messageId}
                        </td>
                        
                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                          <div className="max-w-48 truncate">
                            {sms.recipients === 'All Users' ? (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                                All Users
                              </span>
                            ) : (
                              <span className="text-[15px]">{sms.recipients}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
                          {sms.type === 'Promotional' ? (
                            <div className="flex flex-col items-center">
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-semibold">
                                {sms.recipientPhones ? sms.recipientPhones.length : 0}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">recipients</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
                          <div className="flex justify-center items-center">
                            {sms.senderClinic === 'Ambher Optical' ? (
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Ambher Optical
                              </span>
                            ) : sms.senderClinic === 'Bautista Eye Center' ? (
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                Bautista Eye Center
                              </span>
                            ) : (
                              <span className="text-[15px]">{sms.senderClinic}</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            sms.type === 'Appointment' ? 'bg-sky-100 text-sky-800' :
                            sms.type === 'Order Status' ? 'bg-orange-100 text-orange-800' :
                            sms.type === 'Promotional' ? 'bg-pink-100 text-pink-800' :
                            sms.type === 'Wishlist' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {sms.type}
                          </span>
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                          <div className="max-w-64 truncate" title={sms.message}>
                            {sms.message}
                          </div>
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            sms.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            sms.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                            sms.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            sms.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {sms.status}
                          </span>
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <span className={`text-sm font-semibold ${
                              sms.smsCreditsDeducted > 0 ? 'text-red-600' : 'text-gray-400'
                            }`}>
                              {sms.smsCreditsDeducted > 0 ? `-${sms.smsCreditsDeducted}` : '0'}
                            </span>
                            {sms.smsCreditsBalance !== null && sms.smsCreditsBalance !== undefined && (
                              <span className="text-xs text-gray-500 mt-1">
                                Bal: {sms.smsCreditsBalance}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-6 text-[#171717] text-[15px] text-center font-albertsans font-medium whitespace-nowrap">
                          {formatSmsDate(sms.sentAt)}
                        </td>

                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>        
          <div id="smspagination">
            
            {/* SMS Pagination Controls - Separate dedicated container */}
            {(() => {
              // Use the same logic as getPaginatedSmsData to ensure consistency
              const dataToDisplay = searchSmsMessages.trim() || smsStatusFilter !== 'all' || smsTypeFilter !== 'all' 
                ? filteredSmsMessages 
                : smsMessages;
              
              // Ensure dataToDisplay is an array
              const totalSmsMessages = Array.isArray(dataToDisplay) ? dataToDisplay.length : 0;
              const totalPages = Math.ceil(totalSmsMessages / smsMessagesPerPage);
              
              // Ensure current page doesn't exceed total pages
              if (currentSmsPage > totalPages && totalPages > 0) {
                setCurrentSmsPage(totalPages);
              }
              
              // Show pagination logic:
              // - Always show if there's data and multiple pages
              // - For default state (no filters), show even with 1 page to indicate pagination is available
              // - For filtered state, only show if there are multiple pages
              const isDefaultState = !searchSmsMessages.trim() && smsStatusFilter === 'all' && smsTypeFilter === 'all';
              const shouldShowPagination = totalSmsMessages > 0 && (
                isDefaultState ? totalPages >= 1 : totalPages > 1
              );

              return !loadingSmsMessages && !errorLoadingSmsMessages && shouldShowPagination && (
                <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 font-albertsans">
                    Page {currentSmsPage} of {totalPages} ({totalSmsMessages} total messages)
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => setCurrentSmsPage(prev => Math.max(1, prev - 1))}
                      disabled={currentSmsPage === 1}
                      className="cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </div>
                    
                    {/* Page Numbers */}
                    <div className="cursor-pointer flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          const current = currentSmsPage;
                          return page === 1 || page === totalPages || 
                                 (page >= current - 1 && page <= current + 1);
                        })
                        .map((page, index, array) => {
                          const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                              <div
                                onClick={() => setCurrentSmsPage(page)}
                                className={`cursor-pointer px-3 py-1 rounded-md text-sm font-albertsans transition-colors ${
                                  page === currentSmsPage
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
                      onClick={() => setCurrentSmsPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentSmsPage === totalPages}
                      className="cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>    
   </div> )}

   {/* Promotional SMS Modal */}
   {showPromotionalSmsModal && (
     <div className="fixed inset-0 bg-[#000000b1] bg-opacity-50 flex items-center justify-center z-50">
       <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
         <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold text-gray-800">Send Promotional SMS</h3>
           <div
             onClick={handleClosePromotionalSmsModal}
             className="text-gray-400 hover:text-gray-600 cursor-pointer"
           >
             <i className="bx bx-x text-[20px] font-semibold"></i>
           </div>
         </div>
         
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Subject
             </label>
             <input
               type="text"
               value={promotionalSmsSubject}
               onChange={(e) => setPromotionalSmsSubject(e.target.value)}
               placeholder="Enter SMS subject..."
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
               maxLength={50}
             />
             <p className="text-xs text-gray-500 mt-1">{promotionalSmsSubject.length} characters</p>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Message
             </label>
             <textarea
               value={promotionalSmsMessage}
               onChange={(e) => setPromotionalSmsMessage(e.target.value)}
               placeholder="Enter your promotional message..."
               rows={4}
               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
               maxLength={1500}
             />
             <p className="text-xs text-gray-500 mt-1">{promotionalSmsMessage.length} characters</p>
           </div> 
           
           <div className="bg-blue-50 p-3 rounded-md">
             <p className="text-sm text-blue-700">
               <i className="bx bx-info-circle mr-1"></i>
               This SMS will be sent to all patients in {localStorage.getItem('staffclinic') || localStorage.getItem('ownerclinic') || 'your clinic'}.
             </p>
           </div>
         </div>
         
         <div className="flex gap-3 mt-6">
           <div
             onClick={handleClosePromotionalSmsModal}
             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
             disabled={sendingSms}
           >
             Cancel
           </div>
           <div
             onClick={sendPromotionalSms}
             disabled={sendingSms || !promotionalSmsSubject.trim() || !promotionalSmsMessage.trim()}
             className="bg-[#4ca22b] cursor-pointer flex-1 px-4 py-2 text-white rounded-md h disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
           >
             {sendingSms ? (
               <>
                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                 Sending...
               </>
             ) : (
               <>
                 <i className="bx bxs-send text-sm"></i>
                 Send SMS
               </>
             )}
           </div>
         </div>
       </div>
     </div>
   )}

   {/* SMS Toast Notification */}
   {smsToast && (
     <div className="bottom-4 right-8 z-101 transform fixed">
       <div key={smsToastType} className={`${smsToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
         {smsToastType === 'success' ? (          
           <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
         ) : smsToastType === 'warning' ? (
           <span className="text-yellow-600 font-semibold text-[20px]"><i className="mr-2 bx bx-error-circle"></i></span>
         ) : (
           <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
         )}
         {smsToastMessage}

         <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${
           smsToastType === 'success' ? 'bg-green-500' : 
           smsToastType === 'warning' ? 'bg-yellow-500' : 
           'bg-red-500'
         }`} style={{width: smsProgressWidth, transition: 'width 4s linear'}}/>
       </div>
     </div>  
   )}

   {/* PDF Export Toast Notification */}
   {pdfToast && (
     <div className={`${smsToast ? 'bottom-20' : 'bottom-4'} right-8 z-101 transform fixed`}>
       <div key={pdfIsClicked ? 'success' : 'error'} className={`${pdfToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
         {pdfIsClicked ? (          
           <span className="text-blue-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
         ) : (
           <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
         )}
         {pdfToastMessage}

         <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${pdfIsClicked ? 'bg-sky-500' : 'bg-red-500'}`} style={{width: pdfProgressWidth, transition: 'width 4s linear'}}/>
       </div>
     </div>  
   )}



{/*End of SMS Monitoring*/} {




























































































