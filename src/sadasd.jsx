      {(localStorage.getItem("role") === "staff" || localStorage.getItem("role") === "owner") && (localStorage.getItem("staffclinic") === "Ambher Optical" || localStorage.getItem("ownerclinic") === "Ambher Optical") && (
        <div className="fixed bottom-5 right-5 z-[99] flex flex-col items-start gap-2">
          {showpatientchatdashboard && (
            <div className="mb-6 motion-preset-slide-down w-250 h-150 shadow-2xl z-[9999] flex flex-col rounded-2xl bg-white">
              <div className="min-h-12 max-h-12 w-full h-14 rounded-t-2xl flex justify-center items-center bg-[#39715f]">
                <div className="flex px-2 w-full items-center">
                  <img src={ambherlogo} className="w-15 px-2 py-1"/>
                  <p className="font-albertsans font-semibold text-[17px] text-[#ffffff]">Ambher Optical</p>
                </div>
              </div>

              <div className="p-2 gap-2 w-full h-full rounded-b-2xl flex items-center justify-center">
                <div className="rounded-2xl h-full w-[30%] flex flex-col items-start">
                  <div className="rounded-2xl h-[10%] w-full flex justify-center items-center">
                    <div className="flex items-center justify-center w-full h-full">
                      <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="transition-all duration-300 ease-in-out py-3 pl-10 w-250 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                      />
                    </div>
                  </div>

                  <div className="gap-3 flex items-center rounded-2xl h-[9%] w-full">
                    <div 
                      onClick={() => showambhermessageslist('allambhermessageslist')} 
                      className={`cursor-pointer h-[90%] w-[90%] mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out border-2 b-[#909090] rounded-3xl text-center flex justify-center items-center ${activeambhermessageslist ==='allambhermessageslist' ? 'bg-[#7E996D] rounded-2xl' : ''}`}
                    >
                      <h1 className={`font-albertsans font-semibold text-[#5d5d5d] ${activeambhermessageslist ==='allambhermessageslist' ? 'text-white' : ''}`}>All</h1>
                    </div>
                    <div 
                      onClick={() => showambhermessageslist('unreadambhermessageslist')} 
                      className={`cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out border-2 b-[#909090] rounded-3xl h-[90%] w-[90%] text-center flex justify-center items-center ${activeambhermessageslist ==='unreadambhermessageslist' ? 'bg-[#7E996D] rounded-2xl' : ''}`}
                    >
                      <h1 className={`font-albertsans font-semibold text-[#5d5d5d] ${activeambhermessageslist ==='unreadambhermessageslist' ? 'text-white' : ''}`}>Unread</h1>
                    </div>
                  </div>

                  <div className="pt-3 gap-1 px-2 flex flex-col rounded-2xl min-h-[72%] w-full max-h-[72%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {loadingConversations ? (
                      <div className="w-full flex justify-center items-center h-full text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#39715f]"></div>
                      </div>
                    ) : (
                      <>
<div 
  className="relative p-2 flex items-center justify-start w-full h-15 border-1 hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 rounded-2xl"
  onClick={() => {
  console.log('Starting clinic-to-clinic conversation with Bautista Eye Center');
  setLoading(true);
  setSelectedPatient(null);
  
  // Mark this clinic conversation as read in database
  const clinicConversation = conversations.find(conv => 
    conv.participants.some(p => p.role === 'clinic' && p.clinic === "Ambher Optical") &&
    conv.participants.some(p => p.role === 'clinic' && p.clinic === "Bautista Eye Center")
  );
  if (clinicConversation) {
    markConversationAsRead(clinicConversation._id);
  }
  
  startConversation("Bautista Eye Center");
}}
>
  {(() => {
    const clinicConversation = conversations.find(conv => 
      conv.participants.some(p => p.role === 'clinic' && p.clinic === "Ambher Optical") &&
      conv.participants.some(p => p.role === 'clinic' && p.clinic === "Bautista Eye Center")
    );
    
    // Don't show notification if conversations are still loading or unread state isn't initialized
    if (loadingConversations || !clinicConversation) return null;
    
    // Check if this conversation's unread state has been calculated
    const hasCalculatedUnreadState = Object.prototype.hasOwnProperty.call(unreadMessagesByConversation, clinicConversation._id);
    
    // Only show notification if we have properly calculated the unread state AND it's unread
    return hasCalculatedUnreadState && hasUnreadMessages(clinicConversation._id) ? (
      <div className="absolute top-0 right-0 flex justify-center items-center bg-[#f15b5b] rounded-full w-4 h-4"></div>
    ) : null;
  })()}
  <img src={bautistalogo} className="w-13 h-13"/>
  <div className="w-[76%] flex flex-col justify-center items-start ml-3">
    <p className="font-albertsans font-semibold text-[16px] text-[#3a3a3a] truncate overflow-hidden whitespace-nowrap w-full">Bautista Eye Center</p>
    <p className="font-albertsans font-medium text-[13px] text-[#555555] truncate overflow-hidden whitespace-nowrap w-full">
      {(() => {
        const clinicConversation = conversations.find(conv => 
          conv.participants.some(p => p.role === 'clinic' && p.clinic === "Ambher Optical") &&
          conv.participants.some(p => p.role === 'clinic' && p.clinic === "Bautista Eye Center")
        );
        const latestMessage = clinicConversation ? getLatestMessageForConversation(clinicConversation._id) : null;
        return getLatestMessageDisplay({ patientfirstname: "Ambher Optical" }, latestMessage ? [latestMessage] : [], clinicConversation?._id);
      })()}
    </p>
  </div>
</div>


{getFilteredPatientsForDisplay()
  .map(patient => {
    const patientConversation = conversations.find(conv => 
      conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
    );
    
    return {
      patient,
      lastMessageTime: patientConversation?.lastMessage?.createdAt 
        ? new Date(patientConversation.lastMessage.createdAt).getTime() 
        : 0
    };
  })
  .sort((a, b) => b.lastMessageTime - a.lastMessageTime)
  .map(({ patient }) => (
    <div 
      key={patient._id}
      className={`p-2 flex items-center justify-start w-full h-19 hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer rounded-2xl relative ${
        selectedPatient?._id === patient._id ? 'bg-green-50 border-blue-200' : ''
      }`}
      onClick={() => {
        handlePatientSelect(patient);
        // Mark conversation as read when selected
        const patientConversation = conversations.find(conv => 
          conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
        );
        if (patientConversation) {
          setUnreadMessagesByConversation(prev => ({
            ...prev,
            [patientConversation._id]: false
          }));
        }
      }}
    >
      {(() => {
        const patientConversation = conversations.find(conv => 
          conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
        );
        return patientConversation && hasUnreadMessages(patientConversation._id) ? (
          <div className="absolute top-0 right-0 flex justify-center items-center bg-[#f15b5b] rounded-full w-4 h-4"></div>
        ) : null;
      })()}
      <img 
        src={patient.patientprofilepicture || profileuser} 
        className="w-13 h-13 rounded-full"
        onError={(e) => { e.target.src = profileuser }}
      />
      <div className="w-[76%] flex flex-col justify-center items-start ml-3">
        <p className="font-albertsans font-semibold text-[16px] text-[#3a3a3a] truncate overflow-hidden whitespace-nowrap w-full">
          {`${patient.patientfirstname} ${patient.patientlastname}`}
        </p>
        <p className="font-albertsans font-medium text-[13px] text-[#555555] truncate overflow-hidden whitespace-nowrap w-full">
          {(() => {
            const patientConversation = conversations.find(conv => 
              conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
            );
            const latestMessage = patientConversation ? getLatestMessageForConversation(patientConversation._id) : null;
            return getLatestMessageDisplay(patient, latestMessage ? [latestMessage] : [], patientConversation?._id);
          })()}
        </p>
      </div>
    </div>
  ))
}
                      </>
                    )}
                  </div>
                </div>
{selectedPatient === null && selectedClinic === null ? (
           <div className="flex  flex-col rounded-2xl h-full w-[70%] border-1">
          </div>
):(                <div className="flex  flex-col rounded-2xl h-full w-[70%] border-1">
                  <div className="shadow-md pt-0.5 pb-0.5 pl-3 rounded-t-2xl border-1 h-[11%] w-full flex item-center justify-start">
                    <div className="flex items-center justify-center">
                      <img 
                        src={
                          selectedPatient 
                            ? (selectedPatient.patientprofilepicture || profileuser) 
                            : selectedClinic === "Ambher Optical" 
                              ? ambherlogo
                              : bautistalogo
                        } 
                        className="w-12 h-12 rounded-full"
                        onError={(e) => { e.target.src = profileuser }}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start ml-3">
                      <p className="font-albertsans font-semibold text-[16px] text-[#3a3a3a]">
                        {selectedPatient 
                          ? `${selectedPatient.patientfirstname} ${selectedPatient.patientlastname}`
                          : selectedClinic || "Select a conversation"}
                      </p>
                    </div>
                  </div>
                  <div className="pb-2 h-full w-full overflow-y-auto" style={{ maxHeight: '400px' }}>
                    <div className="px-3 pt-10 h-[100%] w-full overflow-y-auto relative" style={{ maxHeight: '400px' }}>
                      {(loading || loadingMessages[conversationId]) ? (
                        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 z-10">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#39715f] border-t-transparent mb-2"></div>
                          <p className="text-[#39715f] font-medium">Loading messages...</p>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((msg, index) => {
                          const isCurrentClinic = (msg.senderClinic === "Ambher Optical" && (localStorage.getItem("staffclinic") === "Ambher Optical" || localStorage.getItem("ownerclinic") === "Ambher Optical")) || 
                                                (msg.senderClinic === "Bautista Eye Center" && (localStorage.getItem("staffclinic") === "Bautista Eye Center" || localStorage.getItem("ownerclinic") === "Bautista Eye Center"));
                          
                          const isSameSenderAsPrevious = index > 0 && 
                            messages[index - 1].senderId === msg.senderId;
                          const isSameSenderAsNext = index < messages.length - 1 && 
                            messages[index + 1].senderId === msg.senderId;
                          
                          const isDifferentSenderFromPrevious = index > 0 && 
                            messages[index - 1].senderId !== msg.senderId;

                          let borderRadiusClasses = '';
                          if (isCurrentClinic) {
                            borderRadiusClasses = !isSameSenderAsPrevious && !isSameSenderAsNext ? 'rounded-2xl' :
                              !isSameSenderAsPrevious ? 'rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl' :
                              !isSameSenderAsNext ? 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl' :
                              'rounded-tl-2xl rounded-bl-2xl';
                          } else {
                            borderRadiusClasses = !isSameSenderAsPrevious && !isSameSenderAsNext ? 'rounded-2xl' :
                              !isSameSenderAsPrevious ? 'rounded-tr-2xl rounded-br-2xl rounded-tl-2xl' :
                              !isSameSenderAsNext ? 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' :
                              'rounded-tr-2xl rounded-br-2xl';
                          }

                          const isImageOnly = msg.imageUrl && !msg.text && !msg.documentUrl;
                          const isLastInSequence = !isSameSenderAsNext;
                          const profilePicture = msg.senderRole === 'clinic' 
                            ? (msg.senderClinic === "Ambher Optical" ? ambherlogo : bautistalogo)
                            : (selectedPatient?.patientprofilepicture || profileuser);

                          return (
                            <div 
                              key={msg._id || msg.temporaryId}
                              className={`w-full flex ${isCurrentClinic ? 'justify-end' : 'justify-start'} ${
                                isDifferentSenderFromPrevious ? 'mt-4' : ''
                              }`}
                            >
                              <div className={`flex-shrink-0 ${isCurrentClinic ? 'order-1 ml-2' : 'order-0 mr-2'} ${isLastInSequence ? 'visible' : 'invisible'}`}>
                                {!isCurrentClinic && (
                                  <img 
                                    src={profilePicture} 
                                    alt="Profile picture"
                                    className="w-8 h-8 self-end rounded-full object-cover"
                                  />
                                )}
                              </div>

                              <div className={`max-w-[80%] ${isCurrentClinic ? 'order-0' : 'order-1'}`}>
                                {!isSameSenderAsPrevious && !isCurrentClinic && (
                                  <div className={`flex ${isCurrentClinic ? 'justify-end' : 'justify-start'}`}>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                      {msg.senderName}
                                    </p>
                                  </div>
                                )}
                                {isImageOnly ? (
                                  renderMessageContent(msg, isCurrentClinic)
                                ) : (
                                  <div 
                                    className={`flex flex-col px-5 py-2 ${
                                      isCurrentClinic ? (localStorage.getItem("staffclinic") === "Ambher Optical" || localStorage.getItem("ownerclinic") === "Ambher Optical" ? 'bg-[#c0eed6]' : 'bg-[#d8f1fd]') : 'bg-[#e0e0e0]'
                                    } ${borderRadiusClasses} relative group`}
                                    style={{
                                      wordWrap: 'break-word',
                                      overflowWrap: 'break-word',
                                      whiteSpace: 'pre-wrap'
                                    }}
                                  >
                                    {renderMessageContent(msg, isCurrentClinic)}
                                  </div>
                                )}
                                {index === messages.length - 1 && (
                                  <div className={`mt-1 w-full flex ${isCurrentClinic ? 'justify-end' : 'justify-start'}`}>
                                    <p className="text-[12px] text-[#565656]">
                                      {formatDate(msg.createdAt)} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full text-center text-gray-500 h-full flex items-center justify-center">
                          {selectedPatient ? `Start a conversation with ${selectedPatient.patientfirstname} ${selectedPatient.patientlastname}!` : ' No messages'}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  <div className="px-2 pb-2 flex flex-col w-full rounded-2xl">
                    {selectedClinic === null && selectedPatient === null ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a conversation to start chatting.</p>
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-2xl p-3 pb-3 flex items-center w-full h-16">
                        {!selectedFile && (
                          <label className="cursor-pointer p-2 mr-2">
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <img src={documenticon} className="w-7 h-7"/>
                          </label>
                        )}

                        {selectedFile?.isImage && (
                          <div className="flex-shrink-0 relative mr-2">
                            <img 
                              src={selectedFile.preview} 
                              alt="Preview" 
                              className="w-11 h-11 object-cover rounded cursor-pointer"
                              onClick={() => {
                                setSelectedImageForModal(selectedFile.preview);
                                setModalOpen(true);
                              }}
                            />
                            <img 
                              onClick={cancelFile}
                              src={closeimage} 
                              alt="cancel" 
                              className="absolute -top-2 -right-2 h-5 w-5 cursor-pointer hover:cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out bg-white rounded-full p-0.5 shadow-sm"
                            />
                          </div>
                        )}

                        {selectedFile && !selectedFile.isImage && (
                          <div className="flex items-center bg-gray-100 px-2 py-1 rounded mr-2 max-w-[100px]">
                            <img src={filesent} className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="text-sm truncate">
                              {selectedFile.name}
                            </span>
                            <img 
                              onClick={cancelFile} 
                              src={closeimage} 
                              alt="cancel" 
                              className="ml-2 h-4 w-4 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out flex-shrink-0"
                            />
                          </div>
                        )}

                        <div className="flex-grow flex items-center">
                          <textarea 
                            className="w-full h-full p-2 outline-none resize-none bg-transparent" 
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                        </div>
                        {isSending ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white flex-shrink-0"></div>
                        ) : (
                          <img 
                            src={sendchatambher}
                            alt="send" 
                            className="hover:scale-105 transition-all duration-300 ease-in-out h-10 w-10 p-2 cursor-pointer flex-shrink-0" 
                            onClick={handleSendMessage}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>)}

              </div>
            </div>
          )}

          <div className="w-full justify-end flex items-end">
            {showpatientchatdashboard ? (
     <div 
  onClick={() => {
    setshowpatientbautistaConversation(false);
    setshowpatientambherConversation(false);
    setshowpatientchatdashboard(false);
    setSelectedClinic(null);
    setSelectedPatient(null);
    setMessages([]);
    setConversationId(null);
  }} 
  className="motion-preset-slide-down hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full bg-[#39715f]"  >
  <img src={close} alt="logo" className="select-none motion-preset-shake w-10 h-10 p-2" />
</div>
            ) : (
// For Ambher Optical staff/owner
// Enhanced Ambher Optical dashboard opening - Replace around line 2850
<div 
  onClick={() => {
    console.log('🏥 Opening Ambher Optical chat dashboard');
    setshowpatientchatdashboard(true);
    
    // FORCE socket connection and room joining
    const userId = localStorage.getItem('staffid') || localStorage.getItem('ownerid');
    const role = localStorage.getItem('role');
    const clinic = 'Ambher Optical';
    
    // Immediate room joining for existing conversations
    if (socket.current && socket.current.connected) {
      console.log(`🚀 ${role} from ${clinic} IMMEDIATE joining on dashboard open`);
      
      // Join general conversations and rooms
      socket.current.emit('joinConversations', userId, role, clinic);
      socket.current.emit('joinRoom', `clinic-${clinic}`);
      socket.current.emit('joinRoom', `clinic-${clinic}-all`);
      socket.current.emit('joinRoom', `clinic-${clinic}-patients`);
      socket.current.emit('joinRoom', `all-conversations`);
      socket.current.emit('joinRoom', `global-messages`);
      
      // IMMEDIATE join of existing conversations
      conversations.forEach(conv => {
        console.log(`🚀 ${role} (${clinic}) IMMEDIATE joining conversation ${conv._id}`);
        socket.current.emit('joinConversation', conv._id);
        socket.current.emit('joinRoom', `conversation-${conv._id}`);
        socket.current.emit('joinRoom', `clinic-${clinic}-conversation-${conv._id}`);
        socket.current.emit('joinRoom', `patient-conversation-${conv._id}`);
        socket.current.emit('joinRoom', `global-conversation-${conv._id}`);
        socket.current.emit('joinRoom', `room-${conv._id}`);
        socket.current.emit('joinRoom', `msg-${conv._id}`);
      });
      
      // Fetch and join any new conversations
      setTimeout(() => {
        fetchConversations(true).then(() => {
          setTimeout(() => {
            conversations.forEach(conv => {
              console.log(`🚀 ${role} (${clinic}) joining new conversation ${conv._id} after fetch`);
              socket.current.emit('joinConversation', conv._id);
              socket.current.emit('joinRoom', `conversation-${conv._id}`);
              socket.current.emit('joinRoom', `clinic-${clinic}-conversation-${conv._id}`);
              socket.current.emit('joinRoom', `patient-conversation-${conv._id}`);
              socket.current.emit('joinRoom', `global-conversation-${conv._id}`);
            });
          }, 500);
        });
      }, 500);
    } else {
      console.log('🔌 Socket not connected, reconnecting for', clinic);
      socket.current?.connect();
      
      setTimeout(() => {
        if (socket.current?.connected) {
          socket.current.emit('joinConversations', userId, role, clinic);
          socket.current.emit('joinRoom', `clinic-${clinic}`);
          socket.current.emit('joinRoom', `clinic-${clinic}-all`);
          socket.current.emit('joinRoom', `all-conversations`);
          socket.current.emit('joinRoom', `global-messages`);
        }
        fetchConversations(true);
      }, 1000);
    }
    
    // Fetch patients if needed
    if (patients.length === 0) {
      fetchPatients();
    }
  }} 
  className="motion-preset-slide-down hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full bg-[#39715f]">
  {hasGlobalUnreadMessages && (
    <div id="rednotificationofambher" className="flex justify-center items-center absolute top-0 right-0 bg-[#e93f3f] rounded-full w-4.5 h-4.5"></div>
  )}
  <img src={chat} alt="logo" className="select-none motion-preset-seesaw w-10 h-10 p-2" />
</div>
)}
          </div>
        </div>
      )}

      {(localStorage.getItem("role") === "staff" || localStorage.getItem("role") === "owner") && (localStorage.getItem("staffclinic") === "Bautista Eye Center" || localStorage.getItem("ownerclinic") === "Bautista Eye Center") && (
        <div className="fixed bottom-5 right-5 z-[99] flex flex-col items-start gap-2">
          {showpatientchatdashboard && (
            <div className="mb-6 motion-preset-slide-down w-250 h-150 shadow-2xl z-[9999] flex flex-col rounded-2xl bg-white">
              <div className="min-h-12 max-h-12 w-full h-14 rounded-t-2xl flex justify-center items-center bg-[#0a4277]">
                <div className="flex px-2 w-full items-center">
                  <img src={bautistalogo} className="w-15 px-2 py-1"/>
                  <p className="font-albertsans font-semibold text-[17px] text-[#ffffff]">Bautista Eye Center</p>
                </div>
              </div>

              <div className="p-2 gap-2 w-full h-full rounded-b-2xl flex items-center justify-center">
                <div className="rounded-2xl h-full w-[30%] flex flex-col items-start">
                  <div className="rounded-2xl h-[10%] w-full flex justify-center items-center">
                    <div className="flex items-center justify-center w-full h-full">
                      <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="transition-all duration-300 ease-in-out py-3 pl-10 w-250 rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
                      />
                    </div>
                  </div>

                  <div className="gap-3 flex items-center rounded-2xl h-[9%] w-full">
                    <div 
                      onClick={() => showambhermessageslist('allambhermessageslist')} 
                      className={`cursor-pointer h-[90%] w-[90%] mr-3 hover:rounded-2xl transition-all duration-300 ease-in-out border-2 b-[#909090] rounded-3xl text-center flex justify-center items-center ${activeambhermessageslist ==='allambhermessageslist' ? 'bg-[#457ab7] rounded-2xl' : ''}`}
                    >
                      <h1 className={`font-albertsans font-semibold text-[#5d5d5d] ${activeambhermessageslist ==='allambhermessageslist' ? 'text-white' : ''}`}>All</h1>
                    </div>
                    <div 
                      onClick={() => showambhermessageslist('unreadambhermessageslist')} 
                      className={`cursor-pointer ml-3 hover:rounded-2xl transition-all duration-300 ease-in-out border-2 b-[#909090] rounded-3xl h-[90%] w-[90%] text-center flex justify-center items-center ${activeambhermessageslist ==='unreadambhermessageslist' ? 'bg-[#457ab7] rounded-2xl' : ''}`}
                    >
                      <h1 className={`font-albertsans font-semibold text-[#5d5d5d] ${activeambhermessageslist ==='unreadambhermessageslist' ? 'text-white' : ''}`}>Unread</h1>
                    </div>
                  </div>

                  <div className="pt-3 gap-1 px-2 flex flex-col rounded-2xl min-h-[72%] w-full max-h-[72%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {loadingConversations ? (
                      <div className="w-full flex justify-center items-center h-full text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0a4277]"></div>
                      </div>
                    ) : (
                      <>
<div 
  className="relative p-2 flex items-center justify-start w-full h-15 border-1 hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer hover:scale-105 rounded-2xl"
  onClick={() => {
  console.log('Starting clinic-to-clinic conversation with Ambher Optical');
  setLoading(true);
  setSelectedPatient(null);
  
  // Mark this clinic conversation as read in database
  const clinicConversation = conversations.find(conv => 
    conv.participants.some(p => p.role === 'clinic' && p.clinic === "Ambher Optical") &&
    conv.participants.some(p => p.role === 'clinic' && p.clinic === "Bautista Eye Center")
  );
  if (clinicConversation) {
    markConversationAsRead(clinicConversation._id);
  }
  
  startConversation("Ambher Optical");
}}
>
  {(() => {
    const clinicConversation = conversations.find(conv => 
      conv.participants.some(p => p.role === 'clinic' && p.clinic === "Ambher Optical") &&
      conv.participants.some(p => p.role === 'clinic' && p.clinic === "Bautista Eye Center")
    );
    return clinicConversation && hasUnreadMessages(clinicConversation._id) ? (
      <div className="absolute top-0 right-0 flex justify-center items-center bg-[#f15b5b] rounded-full w-4 h-4"></div>
    ) : null;
  })()}
  <img src={ambherlogo} className="w-13 h-13"/>
  <div className="w-[76%] flex flex-col justify-center items-start ml-3">
    <p className="font-albertsans font-semibold text-[16px] text-[#3a3a3a] truncate overflow-hidden whitespace-nowrap w-full">Ambher Optical</p>
    <p className="font-albertsans font-medium text-[13px] text-[#555555] truncate overflow-hidden whitespace-nowrap w-full">
      {(() => {
        // Find clinic-to-clinic conversation
        const clinicConversation = conversations.find(conv => 
          conv.participants.some(p => p.role === 'clinic' && p.clinic === "Ambher Optical") &&
          conv.participants.some(p => p.role === 'clinic' && p.clinic === "Bautista Eye Center")
        );
        
        if (!clinicConversation) return "No messages yet";
        
        const latestMessage = latestMessagesByConversation[clinicConversation._id];
        if (!latestMessage) return "No messages yet";
        
        if (latestMessage.imageUrl) {
          return `${latestMessage.senderName || latestMessage.senderClinic} sent a photo`;
        }
        if (latestMessage.documentUrl) {
          return `${latestMessage.senderName || latestMessage.senderClinic} sent a document`;
        }
        return latestMessage.text || "No messages yet";
      })()}
    </p>
  </div>
</div>


{getFilteredPatientsForDisplay()
  .map(patient => {
    // Find the conversation with this patient
    const patientConversation = conversations.find(conv => 
      conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
    );
    
    return {
      patient,
      lastMessageTime: patientConversation?.lastMessage?.createdAt 
        ? new Date(patientConversation.lastMessage.createdAt).getTime() 
        : 0
    };
  })
  .sort((a, b) => b.lastMessageTime - a.lastMessageTime) // Sort by latest message time (newest first)
  .map(({ patient }) => (
    <div 
      key={patient._id}
      className={`p-2 flex items-center justify-start w-full h-19 hover:bg-gray-100 hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer rounded-2xl relative ${
        selectedPatient?._id === patient._id ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={() => {
        handlePatientSelect(patient);
        // Mark conversation as read when selected
        const patientConversation = conversations.find(conv => 
          conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
        );
        if (patientConversation) {
          setUnreadMessagesByConversation(prev => ({
            ...prev,
            [patientConversation._id]: false
          }));
        }
      }}
    >
      {(() => {
        const patientConversation = conversations.find(conv => 
          conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
        );
        return patientConversation && hasUnreadMessages(patientConversation._id) ? (
          <div className="absolute top-0 right-0 flex justify-center items-center bg-[#f15b5b] rounded-full w-4 h-4"></div>
        ) : null;
      })()}
      <img 
        src={patient.patientprofilepicture || profileuser} 
        className="w-13 h-13 rounded-full"
        onError={(e) => { e.target.src = profileuser }}
      />
      <div className="w-[76%] flex flex-col justify-center items-start ml-3">
        <p className="font-albertsans font-semibold text-[16px] text-[#3a3a3a] truncate overflow-hidden whitespace-nowrap w-full">
          {`${patient.patientfirstname} ${patient.patientlastname}`}
        </p>
        <p className="font-albertsans font-medium text-[13px] text-[#555555] truncate overflow-hidden whitespace-nowrap w-full">
          {(() => {
            // Find the conversation with this patient
            const patientConversation = conversations.find(conv => 
              conv.participants.some(p => p.userId === patient._id && p.role === 'patient')
            );
            const latestMessage = patientConversation ? getLatestMessageForConversation(patientConversation._id) : null;
            return getLatestMessageDisplay(patient, latestMessage ? [latestMessage] : [], patientConversation?._id);
          })()}
        </p>
      </div>
    </div>
  ))
}
                      </>
                    )}
                  </div>
                </div>
{selectedPatient === null && selectedClinic === null ? (
           <div className="flex  flex-col rounded-2xl h-full w-[70%] border-1">
          </div>
):(   
                <div className="flex flex-col rounded-2xl h-full w-[70%] border-1">
                  <div className="shadow-md pt-0.5 pb-0.5 pl-3 rounded-t-2xl border-1 h-[11%] w-full flex item-center justify-start">
                    <div className="flex items-center justify-center">
                      <img 
                        src={
                          selectedPatient 
                            ? (selectedPatient.patientprofilepicture || profileuser) 
                            : selectedClinic === "Bautista Eye Center" 
                              ? bautistalogo 
                              : ambherlogo
                        } 
                        className="w-12 h-12 rounded-full"
                        onError={(e) => { e.target.src = profileuser }}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start ml-3">
                      <p className="font-albertsans font-semibold text-[16px] text-[#3a3a3a]">
                        {selectedPatient 
                          ? `${selectedPatient.patientfirstname} ${selectedPatient.patientlastname}`
                          : selectedClinic || "Select a conversation"}
                      </p>
                    </div>
                  </div>
                  <div className="pb-2 h-full w-full overflow-y-auto" style={{ maxHeight: '400px' }}>
                    <div className="px-3 pt-10 h-[100%] w-full overflow-y-auto relative" style={{ maxHeight: '400px' }}>
                      {(loading || loadingMessages[conversationId]) ? (
                        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-90 z-10">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0a4277] border-t-transparent mb-2"></div>
                          <p className="text-[#0a4277] font-medium">Loading messages...</p>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((msg, index) => {
                          const isCurrentClinic = (msg.senderClinic === "Ambher Optical" && (localStorage.getItem("staffclinic") === "Ambher Optical" || localStorage.getItem("ownerclinic") === "Ambher Optical")) || 
                                                (msg.senderClinic === "Bautista Eye Center" && (localStorage.getItem("staffclinic") === "Bautista Eye Center" || localStorage.getItem("ownerclinic") === "Bautista Eye Center"));
                          
                          const isSameSenderAsPrevious = index > 0 && 
                            messages[index - 1].senderId === msg.senderId;
                          const isSameSenderAsNext = index < messages.length - 1 && 
                            messages[index + 1].senderId === msg.senderId;
                          
                          const isDifferentSenderFromPrevious = index > 0 && 
                            messages[index - 1].senderId !== msg.senderId;

                          let borderRadiusClasses = '';
                          if (isCurrentClinic) {
                            borderRadiusClasses = !isSameSenderAsPrevious && !isSameSenderAsNext ? 'rounded-2xl' :
                              !isSameSenderAsPrevious ? 'rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl' :
                              !isSameSenderAsNext ? 'rounded-tl-2xl rounded-bl-2xl rounded-br-2xl' :
                              'rounded-tl-2xl rounded-bl-2xl';
                          } else {
                            borderRadiusClasses = !isSameSenderAsPrevious && !isSameSenderAsNext ? 'rounded-2xl' :
                              !isSameSenderAsPrevious ? 'rounded-tr-2xl rounded-br-2xl rounded-tl-2xl' :
                              !isSameSenderAsNext ? 'rounded-tr-2xl rounded-br-2xl rounded-bl-2xl' :
                              'rounded-tr-2xl rounded-br-2xl';
                          }

                          const isImageOnly = msg.imageUrl && !msg.text && !msg.documentUrl;
                          const isLastInSequence = !isSameSenderAsNext;
                          const profilePicture = msg.senderRole === 'clinic' 
                            ? (msg.senderClinic === "Ambher Optical" ? ambherlogo : bautistalogo)
                            : (selectedPatient?.patientprofilepicture || profileuser);

                          return (
                            <div 
                              key={msg._id || msg.temporaryId}
                              className={`w-full flex ${isCurrentClinic ? 'justify-end' : 'justify-start'} ${
                                isDifferentSenderFromPrevious ? 'mt-4' : ''
                              }`}
                            >
                              <div className={`flex-shrink-0 ${isCurrentClinic ? 'order-1 ml-2' : 'order-0 mr-2'} ${isLastInSequence ? 'visible' : 'invisible'}`}>
                                {!isCurrentClinic && (
                                  <img 
                                    src={profilePicture} 
                                    alt="Profile picture"
                                    className="w-8 h-8 self-end rounded-full object-cover"
                                  />
                                )}
                              </div>

                              <div className={`max-w-[80%] ${isCurrentClinic ? 'order-0' : 'order-1'}`}>
                                {!isSameSenderAsPrevious && !isCurrentClinic && (
                                  <div className={`flex ${isCurrentClinic ? 'justify-end' : 'justify-start'}`}>
                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                      {msg.senderName}
                                    </p>
                                  </div>
                                )}
                                {isImageOnly ? (
                                  renderMessageContent(msg, isCurrentClinic)
                                ) : (
                                  <div 
                                    className={`flex flex-col px-5 py-2 ${
                                      isCurrentClinic ? (localStorage.getItem("staffclinic") === "Ambher Optical" || localStorage.getItem("ownerclinic") === "Ambher Optical" ? 'bg-[#c0eed6]' : 'bg-[#d8f1fd]') : 'bg-[#e0e0e0]'
                                    } ${borderRadiusClasses} relative group`}
                                    style={{
                                      wordWrap: 'break-word',
                                      overflowWrap: 'break-word',
                                      whiteSpace: 'pre-wrap'
                                    }}
                                  >
                                    {renderMessageContent(msg, isCurrentClinic)}
                                  </div>
                                )}
                                {index === messages.length - 1 && (
                                  <div className={`mt-1 w-full flex ${isCurrentClinic ? 'justify-end' : 'justify-start'}`}>
                                    <p className="text-[12px] text-[#565656]">
                                      {formatDate(msg.createdAt)} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-full text-center text-gray-500 h-full flex items-center justify-center">
                          {selectedPatient ? `Start a conversation with ${selectedPatient.patientfirstname} ${selectedPatient.patientlastname}!` : ' No messages'}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  <div className="px-2 pb-2 flex flex-col w-full rounded-2xl">
                    {selectedClinic === null && selectedPatient === null ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a conversation to start chatting.</p>
                      </div>
                    ) : (
                      <div className="bg-gray-200 rounded-2xl p-3 pb-3 flex items-center w-full h-16">
                        {!selectedFile && (
                          <label className="cursor-pointer p-2 mr-2">
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <img src={documenticon} className="w-7 h-7"/>
                          </label>
                        )}

                        {selectedFile?.isImage && (
                          <div className="flex-shrink-0 relative mr-2">
                            <img 
                              src={selectedFile.preview} 
                              alt="Preview" 
                              className="w-11 h-11 object-cover rounded cursor-pointer"
                              onClick={() => {
                                setSelectedImageForModal(selectedFile.preview);
                                setModalOpen(true);
                              }}
                            />
                            <img 
                              onClick={cancelFile}
                              src={closeimage} 
                              alt="cancel" 
                              className="absolute -top-2 -right-2 h-5 w-5 cursor-pointer hover:cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out bg-white rounded-full p-0.5 shadow-sm"
                            />
                          </div>
                        )}

                        {selectedFile && !selectedFile.isImage && (
                          <div className="flex items-center bg-gray-100 px-2 py-1 rounded mr-2 max-w-[100px]">
                            <img src={filesent} className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="text-sm truncate">
                              {selectedFile.name}
                            </span>
                            <img 
                              onClick={cancelFile} 
                              src={closeimage} 
                              alt="cancel" 
                              className="ml-2 h-4 w-4 cursor-pointer hover:scale-110 transition-all5.4splease continueHere is the continuation and completion of the updated React component code, picking up from where it was cut off. This includes the remaining JSX for the chat interface for staff/owner roles at Bautista Eye Center, ensuring all functionality (conversation fetching, message sending, and UI rendering) is fully implemented with the fixes for the issue of conversations not being fetched correctly.
jsxtransition-all duration-300 ease-in-out flex-shrink-0"
                            />
                          </div>
                        )}

                        <div className="flex-grow flex items-center">
                          <textarea 
                            className="w-full h-full p-2 outline-none resize-none bg-transparent" 
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                        </div>
                        {isSending ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white flex-shrink-0"></div>
                        ) : (
                          <img 
                            src={sendchatbautista}
                            alt="send" 
                            className="hover:scale-105 transition-all duration-300 ease-in-out h-10 w-10 p-2 cursor-pointer flex-shrink-0" 
                            onClick={handleSendMessage}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>)}
              </div>
            </div>
          )}

          <div className="w-full justify-end flex items-end">
            {showpatientchatdashboard ? (
<div 
  onClick={() => {
    setshowpatientbautistaConversation(false);
    setshowpatientambherConversation(false);
    setshowpatientchatdashboard(false);
    setSelectedClinic(null);
    setSelectedPatient(null);
    setMessages([]);
    setConversationId(null);
  }} 
  className="motion-preset-slide-down hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full bg-[#0a4277]"
>
  <img src={close} alt="logo" className="select-none motion-preset-shake w-10 h-10 p-2" />
</div>
            ) : (
// Enhanced Bautista Eye Center dashboard opening - Replace around line 3350
<div 
  onClick={() => {
    console.log('🏥 Opening Bautista Eye Center chat dashboard');
    setshowpatientchatdashboard(true);
    
    // FORCE socket connection and room joining
    const userId = localStorage.getItem('staffid') || localStorage.getItem('ownerid');
    const role = localStorage.getItem('role');
    const clinic = 'Bautista Eye Center';
    
    // Immediate room joining for existing conversations
    if (socket.current && socket.current.connected) {
      console.log(`🚀 ${role} from ${clinic} IMMEDIATE joining on dashboard open`);
      
      // Join general conversations and rooms
      socket.current.emit('joinConversations', userId, role, clinic);
      socket.current.emit('joinRoom', `clinic-${clinic}`);
      socket.current.emit('joinRoom', `clinic-${clinic}-all`);
      socket.current.emit('joinRoom', `clinic-${clinic}-patients`);
      socket.current.emit('joinRoom', `all-conversations`);
      socket.current.emit('joinRoom', `global-messages`);
      
      // IMMEDIATE join of existing conversations
      conversations.forEach(conv => {
        console.log(`🚀 ${role} (${clinic}) IMMEDIATE joining conversation ${conv._id}`);
        socket.current.emit('joinConversation', conv._id);
        socket.current.emit('joinRoom', `conversation-${conv._id}`);
        socket.current.emit('joinRoom', `clinic-${clinic}-conversation-${conv._id}`);
        socket.current.emit('joinRoom', `patient-conversation-${conv._id}`);
        socket.current.emit('joinRoom', `global-conversation-${conv._id}`);
        socket.current.emit('joinRoom', `room-${conv._id}`);
        socket.current.emit('joinRoom', `msg-${conv._id}`);
      });
      
      // Fetch and join any new conversations
      setTimeout(() => {
        fetchConversations(true).then(() => {
          setTimeout(() => {
            conversations.forEach(conv => {
              console.log(`🚀 ${role} (${clinic}) joining new conversation ${conv._id} after fetch`);
              socket.current.emit('joinConversation', conv._id);
              socket.current.emit('joinRoom', `conversation-${conv._id}`);
              socket.current.emit('joinRoom', `clinic-${clinic}-conversation-${conv._id}`);
              socket.current.emit('joinRoom', `patient-conversation-${conv._id}`);
              socket.current.emit('joinRoom', `global-conversation-${conv._id}`);
            });
          }, 500);
        });
      }, 500);
    } else {
      console.log('🔌 Socket not connected, reconnecting for', clinic);
      socket.current?.connect();
      
      setTimeout(() => {
        if (socket.current?.connected) {
          socket.current.emit('joinConversations', userId, role, clinic);
          socket.current.emit('joinRoom', `clinic-${clinic}`);
          socket.current.emit('joinRoom', `clinic-${clinic}-all`);
          socket.current.emit('joinRoom', `all-conversations`);
          socket.current.emit('joinRoom', `global-messages`);
        }
        fetchConversations(true);
      }, 1000);
    }
    
    // Fetch patients if needed
    if (patients.length === 0) {
      fetchPatients();
    }
  }} 
  className="motion-preset-slide-down hover:scale-105 ease-in-out duration-300 transition-all cursor-pointer flex justify-center items-center w-[60px] h-[60px] rounded-full bg-[#0a4277]">
  {hasGlobalUnreadMessages && (
    <div id="rednotificationofbautista" className="flex justify-center items-center absolute top-0 right-0 bg-[#e93f3f] rounded-full w-4.5 h-4.5"></div>
  )}
  <img src={chat} alt="logo" className="select-none motion-preset-seesaw w-10 h-10 p-2" />
</div>
            )}
          </div>
        </div>
      )}