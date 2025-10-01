


{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}{/* Summary Overview */}
{ (activedashboard === 'summaryoverview' && !isAdminRole) && ( <div id="summaryoverview" className="rounded-2xl shadow-lg border-1 bg-white flex flex-col items-center justify-center w-[100%] h-[100%] p-8" > 
  
  {/* Clinic Information Display */}
  <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-2xl">


    {/* Clinic Logo and Name Display */}
    <div className="  p-8  w-full">
      <div className="flex flex-col items-center space-y-6">
        
        {/* Clinic Logo */}
        <div className="relative">
          <div className=" w-auto h-auto  bg-white  flex items-center justify-center overflow-hidden">
            <img 
              src={getCurrentClinicInfo().logo} 
              alt={`${getCurrentClinicInfo().displayName} Logo`}
              className="w-90 h-90 object-contain"
            />
          </div>

        </div>

        {/* Clinic Name and Type */}
        <div className="mb-50 text-center space-y-3">
          <h2 className={`font-albertsans font-bold text-[40px] ${
            getCurrentClinicInfo().clinicType === 'Ambher Optical' ? 'text-green-600' :
            getCurrentClinicInfo().clinicType === 'Bautista Eye Center' ? 'text-sky-600' :
            'text-black/90'
          }`}>
            {getCurrentClinicInfo().displayName}
          </h2>
          </div>
          
</div></div></div>

   
     
 
  
</div> )}






{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 

{ (activedashboard === 'accountmanagement' || isAdminRole) && ( <div id="accountmanagement" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-auto rounded-2xl" >   

  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <i className="bx bxs-user-account text-[#184d85] text-[25px] mr-2"/> 
      <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Account Management</h1>
    </div>
    <div
      onClick={refreshAccountData}
      disabled={loadingpatients || loadingstaffs || loadingowners || loadingadmins}
      className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${(loadingpatients || loadingstaffs || loadingowners || loadingadmins) ? 'animate-spin' : ''}`} />
      {(loadingpatients || loadingstaffs || loadingowners || loadingadmins) ? 'Refreshing...' : 'Refresh'}
    </div>
  </div>
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
   { (activeaccounttable === 'patientaccounttable' && !isAdminRole) && ( <div id="patientaccounttable" className="animate-fadeInUp flex flex-col w-full h-[83%] mt-6  rounded-3xl  overflow-hidden" >

<div className="mt-5 w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">             
        <div className="ml-2 mr-2 w-full flex items-center">
          <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
          <div className="relative w-full flex items-center justify-center gap-3">
            <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
            <input 
              type="text" 
              placeholder="Enter patient name..." 
              value={searchpatients} 
              onChange={(e) => {setsearchpatients(e.target.value); filterpatientaccount(e.target.value);}}
              className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
            />
          </div>
        </div>
        <div 
          onClick={() => setshowaddpatientdialog(true)}  
          className="ml-2 w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"
        >
          <i className="bx bx-user-plus text-white font-bold text-[30px]"/>
          <p className="font-bold font-albertsans text-white text-[18px] ml-2 py-2 px-1">Add Patient</p>
        </div>
        </div>

        <div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
         {renderpatientaccounts()}
        </div>

        
        {/*Add Patient Dialog*/}
           {showaddpatientdialog && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
                  {/* Header */}
                  <div className="bg-sky-800 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-white/20 p-3 rounded-full mr-4">
                          <i className="bx bx-user-plus text-white text-2xl"></i>
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold text-white mb-1">Add Patient Account</h1>
                          <p className="text-sky-100">Create a new patient account</p>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          setshowaddpatientdialog(false);
                          setmessage('');
                          // Reset form data
                          setformdata({
                            role: 'Patient',
                            patientemail:'',
                            patientpassword:'',
                            patientlastname:'',
                            patientfirstname:'',
                            patientmiddlename:'',
                            patientprofilepicture: ''
                          });
                          // Reset image states
                          setselectedprofile(null);
                          setpreviewimage(null);
                          // Reset file input
                          if(imageinputref.current){
                            imageinputref.current.value = "";
                          }
                          // Reset validation states
                          setemailerror(false);
                          setemailexist(false);
                          setcheckemail(false);
                          setShowPatientPassword(false);
                        }}
                        className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                      >
                        <i className="bx bx-x text-white text-2xl"></i>
                      </div>
                    </div>
                  </div>

            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handlesubmit} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Picture Section */}
                  <div className="lg:col-span-1">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <img 
                          className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                          src={previewimage || defaultprofilepic}
                          alt="Profile"
                        />
                        <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
                        </div>
                      </div>
                      
                      <input  
                        className="hidden" 
                        type="file" 
                        onChange={handleprofilechange} 
                        accept="image/jpeg, image/jpg, image/png" 
                        ref={imageinputref} 
                      />
                      
                      <div className="flex items-center gap-2">
                        {selectedprofile && (
                          <button
                            type="button"
                            onClick={handleremoveprofile}
                            className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            title="Remove Photo"
                          >
                            <i className="bx bx-trash w-4 h-4"></i>
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={handleuploadclick}
                          className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <i className="bx bx-camera mr-2"></i>
                          Upload Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="flex flex-col">
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          placeholder="Enter your email..." 
                          type="text" 
                          name="patientemail" 
                          id="patientemail" 
                          value={formdata.patientemail} 
                          onChange={handlechange} 
                          required
                        />
                        {checkemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
                        {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
                        {emailerror && emailexist && (<p className="text-red-500 text-sm mt-1">Email already exist</p>)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <input 
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400 ${
                            !formdata.patientpassword || formdata.patientpassword.length === 0 
                              ? 'border-gray-300'
                              : formdata.patientpassword.length >= 6 
                                ? 'border-green-300' 
                                : 'border-red-300'
                          }`}
                          placeholder="Enter your password..." 
                          type={showPatientPassword ? "text" : "password"}
                          name="patientpassword" 
                          id="patientpassword" 
                          value={formdata.patientpassword} 
                          onChange={handlechange} 
                          required 
                          min="6"
                        />
                        <button
                          type="button"
                          style={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            alignItems: 'center',
                            paddingRight: '12px',
                            color: '#9ca3af',
                            cursor: 'pointer',
                            border: 'none',
                            background: 'transparent',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#4b5563'}
                          onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                          onClick={() => setShowPatientPassword(!showPatientPassword)}
                        >
                          <i className={`bx ${showPatientPassword ? 'bx-hide' : 'bx-show'}`} style={{ fontSize: '20px' }} />
                        </button>
                      </div>
                      {formdata.patientpassword && formdata.patientpassword.length > 0 && (
                        <p className={`text-sm mt-1 transition-colors duration-200 ${
                          formdata.patientpassword.length >= 6 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formdata.patientpassword.length >= 6 
                            ? '✓ Password meets minimum length requirement' 
                            : `Password must be at least 6 characters (${formdata.patientpassword.length}/6)`
                          }
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          placeholder="Enter your lastname..." 
                          type="text" 
                          name="patientlastname" 
                          id="patientlastname" 
                          value={formdata.patientlastname} 
                          onChange={handlechange} 
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          placeholder="Enter your firstname..." 
                          type="text" 
                          name="patientfirstname" 
                          id="patientfirstname" 
                          value={formdata.patientfirstname} 
                          onChange={handlechange} 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                      </label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                        placeholder="Enter your middlename..." 
                        type="text" 
                        name="patientmiddlename" 
                        id="patientmiddlename" 
                        value={formdata.patientmiddlename} 
                        onChange={handlechange} 
                        required
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-8 space-y-4">
                      <button 
                        type="submit" 
                        disabled={issubmitting} 
                        className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
                          issubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
                        }`}
                      >
                        <div className="relative flex items-center">
                          {issubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <i className="bx bx-user-plus mr-3"></i>
                              Create Account
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>)}



{showdeletepatientdialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Patient Account</h2>
</div>
</div>
<div 
onClick={() => {
  setshowdeletepatientdialog(false);
  setselectedpatientaccount(null);
}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this patient account?
</p>

{selectedpatientaccount && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Patient ID: {selectedpatientaccount.id}</p>
<p className="text-sm text-gray-500">Patient Name: {selectedpatientaccount.name}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeletepatientdialog(false);
    setselectedpatientaccount(null);
  }}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={isdeletingpatient ? undefined : deletepatientaccount}
  disabled={isdeletingpatient}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: isdeletingpatient ? "#9ca3af" : "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: isdeletingpatient ? "not-allowed" : "pointer",
    opacity: isdeletingpatient ? 0.6 : 1,
  }}
  onMouseOver={(e) => {
    if (!isdeletingpatient) {
      e.currentTarget.style.backgroundColor = "#dc2626";
    }
  }}
  onMouseOut={(e) => {
    if (!isdeletingpatient) {
      e.currentTarget.style.backgroundColor = "#ef4444";
    }
  }}
>
  {isdeletingpatient ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
      Deleting...
    </>
  ) : (
    'Delete Account'
  )}
</button>
</div>
</div>
</div>
</div>
)}







   </div> )}



{/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/}              
   { (activeaccounttable === 'staffaccounttable' && !isAdminRole) && ( <div id="staffaccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className="mt-5 w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 mr-2 w-full flex items-center">
  <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
  <div className="relative w-full flex items-center justify-center gap-3">
    <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
    <input 
      type="text" 
      placeholder="Enter staff name..." 
      value={searchstaffs} 
      onChange={(e) => {setsearchstaffs(e.target.value); filterstaffaccount(e.target.value);}}
      className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
    />
  </div>
</div>
{currentuserloggedin !== "Staff" && (
<div 
  onClick={() => setshowaddstaffdialog(true)}  
  className="ml-2 w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"
>
  <i className="bx bx-user-plus text-white font-bold text-[30px]"/>
  <p className="font-bold font-albertsans text-white text-[18px] ml-2 py-2 px-1">Add Staff</p>
</div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderstaffaccounts()}
</div>


{/*Add staff Dialog*/}
{showaddstaffdialog && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
  {/* Header */}
  <div className="bg-sky-800 px-8 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-white/20 p-3 rounded-full mr-4">
          <i className="bx bx-user-plus text-white text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Add Staff Account</h1>
          <p className="text-sky-100">Create a new staff account</p>
        </div>
      </div>
      <div
        onClick={() => setshowaddstaffdialog(false)}
        className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
      >
        <i className="bx bx-x text-white text-2xl"></i>
      </div>
    </div>
  </div>

<div className="overflow-y-auto max-h-[calc(90vh-140px)]">
  <form onSubmit={staffhandlesubmit} className="p-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Picture Section */}
      <div className="lg:col-span-1">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img 
              className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
              src={staffpreviewimage || defaultprofilepic}
              alt="Profile"
            />
            <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
            </div>
          </div>
          
          <input  
            className="hidden" 
            type="file" 
            onChange={staffhandleprofilechange} 
            accept="image/jpeg, image/jpg, image/png" 
            ref={staffimageinputref} 
          />
          
          <div className="flex items-center gap-2">
            {staffselectedprofile && (
              <button
                type="button"
                onClick={staffhandleremoveprofile}
                className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                title="Remove Photo"
              >
                <i className="bx bx-trash w-4 h-4"></i>
              </button>
            )}
            
            <button
              type="button"
              onClick={staffhandleuploadclick}
              className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="bx bx-camera mr-2"></i>
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="flex flex-col">
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your email..." 
              type="text" 
              name="staffemail" 
              id="staffemail" 
              value={staffformdata.staffemail} 
              onChange={staffhandlechange} 
              required
            />
            {staffcheckemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
            {staffemailerror && !staffemailexist && !staffemailcharacters.test(staffformdata.staffemail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
            {staffemailerror && staffemailexist && (<p className="text-red-500 text-sm mt-1">Email already exist</p>)}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input 
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400 ${
                !staffformdata.staffpassword || staffformdata.staffpassword.length === 0 
                  ? 'border-gray-300'
                  : staffformdata.staffpassword.length >= 6 
                    ? 'border-green-300' 
                    : 'border-red-300'
              }`}
              placeholder="Enter your password..." 
              type={showStaffPassword ? "text" : "password"}
              name="staffpassword" 
              id="staffpassword" 
              value={staffformdata.staffpassword} 
              onChange={staffhandlechange} 
              required 
              min="6"
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                paddingRight: '12px',
                color: '#9ca3af',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#4b5563'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              onClick={() => setShowStaffPassword(!showStaffPassword)}
            >
              <i className={`bx ${showStaffPassword ? 'bx-hide' : 'bx-show'}`} style={{ fontSize: '20px' }} />
            </button>
          </div>
          {staffformdata.staffpassword && staffformdata.staffpassword.length > 0 && (
            <p className={`text-sm mt-1 transition-colors duration-200 ${
              staffformdata.staffpassword.length >= 6 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {staffformdata.staffpassword.length >= 6 
                ? '✓ Password meets minimum length requirement' 
                : `Password must be at least 6 characters (${staffformdata.staffpassword.length}/6)`
              }
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your lastname..." 
              type="text" 
              name="stafflastname" 
              id="stafflastname" 
              value={staffformdata.stafflastname} 
              onChange={staffhandlechange} 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              First Name
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your firstname..." 
              type="text" 
              name="stafffirstname" 
              id="stafffirstname" 
              value={staffformdata.stafffirstname} 
              onChange={staffhandlechange} 
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
          </label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
            placeholder="Enter your middlename..." 
            type="text" 
            name="staffmiddlename" 
            id="staffmiddlename" 
            value={staffformdata.staffmiddlename} 
            onChange={staffhandlechange} 
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Eye Specialist
          </label>
          <div className="mt-2">
            <StaffeyespecialistYesorNoBox value={staffformdata.staffiseyespecialist} onChange={staffhandlechange} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
          <button 
            type="submit" 
            disabled={staffissubmitting} 
            className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
              staffissubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            <div className="relative flex items-center">
              {staffissubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bx bx-user-plus mr-3"></i>
                  Create Account
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
</div>
</div>
)}


{showdeletestaffdialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Staff Account</h2>
</div>
</div>
<div 
onClick={() => {
  setshowdeletestaffdialog(false);
  setselectedstaffaccount(null);
}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this staff account?
</p>

{selectedstaffaccount && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Staff ID: {selectedstaffaccount.id}</p>
<p className="text-sm text-gray-500">Staff Name: {selectedstaffaccount.name}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeletestaffdialog(false);
    setselectedstaffaccount(null);
  }}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={isdeletingstaff ? undefined : deletestaffaccount}
  disabled={isdeletingstaff}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: isdeletingstaff ? "#9ca3af" : "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: isdeletingstaff ? "not-allowed" : "pointer",
    opacity: isdeletingstaff ? 0.6 : 1,
  }}
  onMouseOver={(e) => {
    if (!isdeletingstaff) {
      e.currentTarget.style.backgroundColor = "#dc2626";
    }
  }}
  onMouseOut={(e) => {
    if (!isdeletingstaff) {
      e.currentTarget.style.backgroundColor = "#ef4444";
    }
  }}
>
  {isdeletingstaff ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
      Deleting...
    </>
  ) : (
    'Delete Account'
  )}
</button>
</div>
</div>
</div>
</div>
)}




{showviewstaffdialog && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
      {/* Header */}
      <div className="bg-sky-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <i className="bx bx-user text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Edit Staff Account</h1>
              <p className="text-sky-100">Update staff account information</p>
            </div>
          </div>
          <div
            onClick={() => {setshowviewstaffdialog(false);
                             setselectededitstaffaccount(null);
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
                             setstaffselectedprofile(null);}}
            className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
          >
            <i className="bx bx-x text-white text-2xl"></i>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
        <form onSubmit={updatestaffaccount} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <img 
                    className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                    src={staffpreviewimage || defaultprofilepic}
                    alt="Profile"
                  />
                  <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
                  </div>
                </div>
                
                <input  
                  className="hidden" 
                  type="file" 
                  onChange={staffhandleprofilechange} 
                  accept="image/jpeg, image/jpg, image/png" 
                  ref={staffimageinputref} 
                />
                
                <div className="flex items-center gap-2">
                  {staffselectedprofile && (
                    <button
                      type="button"
                      onClick={staffhandleremoveprofile}
                      className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      title="Remove Photo"
                    >
                      <i className="bx bx-trash w-4 h-4"></i>
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={staffhandleuploadclick}
                    className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <i className="bx bx-camera mr-2"></i>
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Message Display */}
              {staffmessage.text && (
                <div className={`p-4 rounded-lg ${staffmessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {staffmessage.text}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="flex flex-col">
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                    placeholder="Enter your email..." 
                    type="text" 
                    name="staffemail" 
                    id="staffemail" 
                    value={staffformdata.staffemail} 
                    onChange={staffhandlechange} 
                    required
                  />
                  {staffcheckemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
                  {staffemailerror && !staffemailexist && !staffemailcharacters.test(staffformdata.staffemail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
                  {staffemailerror && staffemailexist && (<p className="text-red-500 text-sm mt-1">Email already exist</p>)}
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                    placeholder="Enter your lastname..." 
                    type="text" 
                    name="stafflastname" 
                    id="stafflastname" 
                    value={staffformdata.stafflastname} 
                    onChange={staffhandlechange} 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                    placeholder="Enter your firstname..." 
                    type="text" 
                    name="stafffirstname" 
                    id="stafffirstname" 
                    value={staffformdata.stafffirstname} 
                    onChange={staffhandlechange} 
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                  placeholder="Enter your middlename..." 
                  type="text" 
                  name="staffmiddlename" 
                  id="staffmiddlename" 
                  value={staffformdata.staffmiddlename} 
                  onChange={staffhandlechange} 
                  required
                />
              </div>

              {/* Eye Specialist Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  Eye Specialist
                </label>
                <div className="mt-2">
                  <StaffeyespecialistYesorNoBox value={staffformdata.staffiseyespecialist} onChange={staffhandlechange} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 space-y-4">
                <button 
                  type="submit" 
                  disabled={staffissubmitting} 
                  className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
                    staffissubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  <div className="relative flex items-center">
                    {staffissubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-edit mr-3"></i>
                        Save Changes
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

   </div> )}



{/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/}
   { activeaccounttable === 'owneraccounttable' && ( <div id="owneraccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className="mt-5 w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 mr-2 w-full flex items-center">
  <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
  <div className="relative w-full flex items-center justify-center gap-3">
    <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
    <input 
      type="text" 
      placeholder="Enter owner name..." 
      value={searchowners} 
      onChange={(e) => {setsearchowners(e.target.value); filterowneraccount(e.target.value);}}
      className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
    />
  </div>
</div>
{currentuserloggedin !== "Staff" && (
<div 
  onClick={() => setshowaddownerdialog(true)}  
  className="ml-2 w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"
>
  <i className="bx bx-user-plus text-white font-bold text-[30px]"/>
  <p className="font-bold font-albertsans text-white text-[18px] ml-2 py-2 px-1">Add Owner</p>
</div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderowneraccounts()}
</div>


{/*Add owner Dialog*/}
{showaddownerdialog && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
  {/* Header */}
  <div className="bg-sky-800 px-8 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-white/20 p-3 rounded-full mr-4">
          <i className="bx bx-user-plus text-white text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Add Owner Account</h1>
          <p className="text-sky-100">Create a new owner account</p>
        </div>
      </div>
      <div
        onClick={() => setshowaddownerdialog(false)}
        className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
      >
        <i className="bx bx-x text-white text-2xl"></i>
      </div>
    </div>
  </div>

<div className="overflow-y-auto max-h-[calc(90vh-140px)]">
  <form onSubmit={ownerhandlesubmit} className="p-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Picture Section */}
      <div className="lg:col-span-1">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img 
              className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
              src={ownerpreviewimage || defaultprofilepic}
              alt="Profile"
            />
            <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
            </div>
          </div>
          
          <input  
            className="hidden" 
            type="file" 
            onChange={ownerhandleprofilechange} 
            accept="image/jpeg, image/jpg, image/png" 
            ref={ownerimageinputref} 
          />
          
          <div className="flex items-center gap-2">
            {ownerselectedprofile && (
              <button
                type="button"
                onClick={ownerhandleremoveprofile}
                className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                title="Remove Photo"
              >
                <i className="bx bx-trash w-4 h-4"></i>
              </button>
            )}
            
            <button
              type="button"
              onClick={ownerhandleuploadclick}
              className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="bx bx-camera mr-2"></i>
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="flex flex-col">
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your email..." 
              type="text" 
              name="owneremail" 
              id="owneremail" 
              value={ownerformdata.owneremail} 
              onChange={ownerhandlechange} 
              required
            />
            {ownercheckemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
            {owneremailerror && !owneremailexist && !owneremailcharacters.test(ownerformdata.owneremail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
            {owneremailerror && owneremailexist && (<p className="text-red-500 text-sm mt-1">Email already exist</p>)}
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input 
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400 ${
                !ownerformdata.ownerpassword || ownerformdata.ownerpassword.length === 0 
                  ? 'border-gray-300'
                  : ownerformdata.ownerpassword.length >= 6 
                    ? 'border-green-300' 
                    : 'border-red-300'
              }`}
              placeholder="Enter your password..." 
              type={showOwnerPassword ? "text" : "password"}
              name="ownerpassword" 
              id="ownerpassword" 
              value={ownerformdata.ownerpassword} 
              onChange={ownerhandlechange} 
              required 
              min="6"
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                paddingRight: '12px',
                color: '#9ca3af',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#4b5563'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              onClick={() => setShowOwnerPassword(!showOwnerPassword)}
            >
              <i className={`bx ${showOwnerPassword ? 'bx-hide' : 'bx-show'}`} style={{ fontSize: '20px' }} />
            </button>
          </div>
          {ownerformdata.ownerpassword && ownerformdata.ownerpassword.length > 0 && (
            <p className={`text-sm mt-1 transition-colors duration-200 ${
              ownerformdata.ownerpassword.length >= 6 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {ownerformdata.ownerpassword.length >= 6 
                ? '✓ Password meets minimum length requirement' 
                : `Password must be at least 6 characters (${ownerformdata.ownerpassword.length}/6)`
              }
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your lastname..." 
              type="text" 
              name="ownerlastname" 
              id="ownerlastname" 
              value={ownerformdata.ownerlastname} 
              onChange={ownerhandlechange} 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              First Name
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your firstname..." 
              type="text" 
              name="ownerfirstname" 
              id="ownerfirstname" 
              value={ownerformdata.ownerfirstname} 
              onChange={ownerhandlechange} 
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
          </label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
            placeholder="Enter your middlename..." 
            type="text" 
            name="ownermiddlename" 
            id="ownermiddlename" 
            value={ownerformdata.ownermiddlename} 
            onChange={ownerhandlechange} 
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Clinic
          </label>
          <div className="mt-2">
            <OwnerClinicBox value={ownerformdata.ownerclinic} onChange={ownerhandlechange} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Eye Specialist
          </label>
          <div className="mt-2">
            <OwnereyespecialistYesorNoBox value={ownerformdata.owneriseyespecialist} onChange={ownerhandlechange} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
          <button 
            type="submit" 
            disabled={ownerissubmitting} 
            className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
              ownerissubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            <div className="relative flex items-center">
              {ownerissubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bx bx-user-plus mr-3"></i>
                  Create Account
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
</div>
</div>
)}






{showviewownerdialog && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
  {/* Header */}
  <div className="bg-sky-800 px-8 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-white/20 p-3 rounded-full mr-4">
          <i className="bx bx-user text-white text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Edit Owner Account</h1>
          <p className="text-sky-100">Update owner account information</p>
        </div>
      </div>
      <div
        onClick={() => {setshowviewownerdialog(false);
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
                         setownerselectedprofile(null);}}
        className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
      >
        <i className="bx bx-x text-white text-2xl"></i>
      </div>
    </div>
  </div>

  <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
    <form onSubmit={updateowneraccount} className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <img 
                className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                src={ownerpreviewimage || defaultprofilepic}
                alt="Profile"
              />
              <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
              </div>
            </div>
            
            <input  
              className="hidden" 
              type="file" 
              onChange={ownerhandleprofilechange} 
              accept="image/jpeg, image/jpg, image/png" 
              ref={ownerimageinputref} 
            />
            
            <div className="flex items-center gap-2">
              {ownerselectedprofile && (
                <button
                  type="button"
                  onClick={ownerhandleremoveprofile}
                  className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="Remove Photo"
                >
                  <i className="bx bx-trash w-4 h-4"></i>
                </button>
              )}
              
              <button
                type="button"
                onClick={ownerhandleuploadclick}
                className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <i className="bx bx-camera mr-2"></i>
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {ownermessage.text && (
            <div className={`p-4 rounded-lg border ${
              ownermessage.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              {ownermessage.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex flex-col">
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                placeholder="Enter your email..." 
                type="text" 
                name="owneremail" 
                id="owneremail" 
                value={ownerformdata.owneremail} 
                onChange={ownerhandlechange} 
                required
              />
              {ownercheckemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
              {owneremailerror && !owneremailexist && !owneremailcharacters.test(ownerformdata.owneremail) && (
                <p className="text-red-500 text-sm mt-1">Enter a valid email address</p>
              )}
              {owneremailerror && owneremailexist && (
                <p className="text-red-500 text-sm mt-1">Email already exists</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                placeholder="Enter your lastname..." 
                type="text" 
                name="ownerlastname" 
                id="ownerlastname" 
                value={ownerformdata.ownerlastname} 
                onChange={ownerhandlechange} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                placeholder="Enter your firstname..." 
                type="text" 
                name="ownerfirstname" 
                id="ownerfirstname" 
                value={ownerformdata.ownerfirstname} 
                onChange={ownerhandlechange} 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Middle Name</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your middlename..." 
              type="text" 
              name="ownermiddlename" 
              id="ownermiddlename" 
              value={ownerformdata.ownermiddlename} 
              onChange={ownerhandlechange} 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Clinic</label>
            <div className="w-full">
              <OwnerClinicBox value={ownerformdata.ownerclinic} onChange={ownerhandlechange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Eye Specialist</label>
            <div className="w-full">
              <OwnereyespecialistYesorNoBox value={ownerformdata.owneriseyespecialist} onChange={ownerhandlechange} />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={ownerissubmitting} 
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="flex items-center">
                {ownerissubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <i className="bx bx-edit mr-3"></i>
                    Save Changes
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</div>
)}




{showdeleteownerdialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Owner Account</h2>
</div>
</div>
<div 
onClick={() => {
  setshowdeleteownerdialog(false);
  setselectedowneraccount(null);
}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this owner account?
</p>

{selectedowneraccount && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Owner ID: {selectedowneraccount.id}</p>
<p className="text-sm text-gray-500">Owner Name: {selectedowneraccount.name}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeleteownerdialog(false);
    setselectedowneraccount(null);
  }}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={isdeletingowner ? undefined : deleteowneraccount}
  disabled={isdeletingowner}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: isdeletingowner ? "#9ca3af" : "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: isdeletingowner ? "not-allowed" : "pointer",
    opacity: isdeletingowner ? 0.6 : 1,
  }}
  onMouseOver={(e) => {
    if (!isdeletingowner) {
      e.currentTarget.style.backgroundColor = "#dc2626";
    }
  }}
  onMouseOut={(e) => {
    if (!isdeletingowner) {
      e.currentTarget.style.backgroundColor = "#ef4444";
    }
  }}
>
  {isdeletingowner ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
      Deleting...
    </>
  ) : (
    'Delete Account'
  )}
</button>
</div>
</div>
</div>
</div>
)}

   </div> )}




{/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/}
   { activeaccounttable === 'administratoraccounttable' && ( <div id="administratoraccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className="mt-5 w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 mr-2 w-full flex items-center">
  <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
  <div className="relative w-full flex items-center justify-center gap-3">
    <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
    <input 
      type="text" 
      placeholder="Enter admin name..." 
      value={searchadmins} 
      onChange={(e) => {setsearchadmins(e.target.value); filteradminaccount(e.target.value);}}
      className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
    />
  </div>
</div>
{currentuserloggedin !== "Staff" && (
<div 
  onClick={() => setshowaddadmindialog(true)}  
  className="ml-2 w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"
>
  <i className="bx bx-user-plus text-white font-bold text-[30px]"/>
  <p className="font-bold font-albertsans text-white text-[18px] ml-2 py-2 px-1">Add Admin</p>
</div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderadminaccounts()}
</div>


{/*Add admin Dialog*/}
{showaddadmindialog && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
  {/* Header */}
  <div className="bg-sky-800 px-8 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-white/20 p-3 rounded-full mr-4">
          <i className="bx bx-user-plus text-white text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Add Admin Account</h1>
          <p className="text-sky-100">Create a new admin account</p>
        </div>
      </div>
      <div
        onClick={() => setshowaddadmindialog(false)}
        className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
      >
        <i className="bx bx-x text-white text-2xl"></i>
      </div>
    </div>
  </div>

<div className="overflow-y-auto max-h-[calc(90vh-140px)]">
  <form onSubmit={adminhandlesubmit} className="p-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Picture Section */}
      <div className="lg:col-span-1">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img 
              className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
              src={adminpreviewimage || defaultprofilepic}
              alt="Profile"
            />
            <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
            </div>
          </div>
          
          <input  
            className="hidden" 
            type="file" 
            onChange={adminhandleprofilechange} 
            accept="image/jpeg, image/jpg, image/png" 
            ref={adminimageinputref} 
          />
          
          <div className="flex items-center gap-2">
            {adminselectedprofile && (
              <button
                type="button"
                onClick={adminhandleremoveprofile}
                className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                title="Remove Photo"
              >
                <i className="bx bx-trash w-4 h-4"></i>
              </button>
            )}
            
            <button
              type="button"
              onClick={adminhandleuploadclick}
              className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <i className="bx bx-camera mr-2"></i>
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="flex flex-col">
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your email..." 
              type="text" 
              name="adminemail" 
              id="adminemail" 
              value={adminformdata.adminemail} 
              onChange={adminhandlechange} 
              required
            />
            {admincheckemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
            {adminemailerror && !adminemailexist && !adminemailcharacters.test(adminformdata.adminemail) && (<p className="text-red-500 text-sm mt-1">Enter a valid email address</p>)}
            {adminemailerror && adminemailexist && (<p className="text-red-500 text-sm mt-1">Email already exist</p>)}
          </div>
        </div>

        <div className="space-y-2">
          <label className={`flex items-center text-sm font-medium transition-colors duration-200 ${
            !adminformdata.adminpassword || adminformdata.adminpassword.length === 0 
              ? 'text-gray-700'
              : adminformdata.adminpassword.length >= 6 
                ? 'text-green-600' 
                : 'text-red-600'
          }`}>
            Password
          </label>
          <div className="relative">
            <input 
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400 ${
                !adminformdata.adminpassword || adminformdata.adminpassword.length === 0 
                  ? 'border-gray-300'
                  : adminformdata.adminpassword.length >= 6 
                    ? 'border-green-300' 
                    : 'border-red-300'
              }`}
              placeholder="Enter your password..." 
              type={showAdminPassword ? "text" : "password"}
              name="adminpassword" 
              id="adminpassword" 
              value={adminformdata.adminpassword || ''} 
              onChange={adminhandlechange} 
              required 
              min="6"
            />
            <button
              type="button"
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                paddingRight: '12px',
                color: '#9ca3af',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#4b5563'}
              onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
              onClick={() => setShowAdminPassword(!showAdminPassword)}
            >
              <i className={`bx ${showAdminPassword ? 'bx-hide' : 'bx-show'}`} style={{ fontSize: '20px' }} />
            </button>
          </div>
          {adminformdata.adminpassword && adminformdata.adminpassword.length > 0 && (
            <p className={`text-sm mt-1 transition-colors duration-200 ${
              adminformdata.adminpassword.length >= 6 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {adminformdata.adminpassword.length >= 6 
                ? '✓ Password meets minimum length requirement' 
                : `Password must be at least 6 characters (${adminformdata.adminpassword.length}/6)`
              }
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your lastname..." 
              type="text" 
              name="adminlastname" 
              id="adminlastname" 
              value={adminformdata.adminlastname} 
              onChange={adminhandlechange} 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              First Name
            </label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your firstname..." 
              type="text" 
              name="adminfirstname" 
              id="adminfirstname" 
              value={adminformdata.adminfirstname} 
              onChange={adminhandlechange} 
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
          </label>
          <input 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
            placeholder="Enter your middlename..." 
            type="text" 
            name="adminmiddlename" 
            id="adminmiddlename" 
            value={adminformdata.adminmiddlename} 
            onChange={adminhandlechange} 
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-8 space-y-4">
          <button 
            type="submit" 
            disabled={adminissubmitting} 
            className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
              adminissubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            <div className="relative flex items-center">
              {adminissubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bx bx-user-plus mr-3"></i>
                  Create Account
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  </form>
</div>
</div>
</div>
)}


{showdeleteadmindialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Admin Account</h2>
</div>
</div>
<div 
onClick={() => {
  setshowdeleteadmindialog(false);
  setselectedadminaccount(null);
}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this admin account?
</p>

{selectedadminaccount && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Admin ID: {selectedadminaccount.id}</p>
<p className="text-sm text-gray-500">Admin Name: {selectedadminaccount.name}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeleteadmindialog(false);
    setselectedadminaccount(null);
  }}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={isdeletingadmin ? undefined : deleteadminaccount}
  disabled={isdeletingadmin}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: isdeletingadmin ? "#9ca3af" : "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: isdeletingadmin ? "not-allowed" : "pointer",
    opacity: isdeletingadmin ? 0.6 : 1,
  }}
  onMouseOver={(e) => {
    if (!isdeletingadmin) {
      e.currentTarget.style.backgroundColor = "#dc2626";
    }
  }}
  onMouseOut={(e) => {
    if (!isdeletingadmin) {
      e.currentTarget.style.backgroundColor = "#ef4444";
    }
  }}
>
  {isdeletingadmin ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
      Deleting...
    </>
  ) : (
    'Delete Account'
  )}
</button>
</div>
</div>
</div>
</div>
)}




{showviewadmindialog && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
  {/* Header */}
  <div className="bg-sky-800 px-8 py-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-white/20 p-3 rounded-full mr-4">
          <i className="bx bx-user text-white text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Edit Admin Account</h1>
          <p className="text-sky-100">Update admin account information</p>
        </div>
      </div>
      <div
        onClick={() => {setshowviewadmindialog(false);
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
                         setadminselectedprofile(null);}}
        className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
      >
        <i className="bx bx-x text-white text-2xl"></i>
      </div>
    </div>
  </div>

  <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
    <form onSubmit={updateadminaccount} className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <img 
                className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                src={adminpreviewimage || defaultprofilepic}
                alt="Profile"
              />
              <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
              </div>
            </div>
            
            <input  
              className="hidden" 
              type="file" 
              onChange={adminhandleprofilechange} 
              accept="image/jpeg, image/jpg, image/png" 
              ref={adminimageinputref} 
            />
            
            <div className="flex items-center gap-2">
              {adminselectedprofile && (
                <button
                  type="button"
                  onClick={adminhandleremoveprofile}
                  className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  title="Remove Photo"
                >
                  <i className="bx bx-trash w-4 h-4"></i>
                </button>
              )}
              
              <button
                type="button"
                onClick={adminhandleuploadclick}
                className="cursor-pointer flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <i className="bx bx-camera mr-2"></i>
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {adminmessage.text && (
            <div className={`p-4 rounded-lg border ${
              adminmessage.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              {adminmessage.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex flex-col">
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                placeholder="Enter your email..." 
                type="text" 
                name="adminemail" 
                id="adminemail" 
                value={adminformdata.adminemail} 
                onChange={adminhandlechange} 
                required
              />
              {admincheckemail && <p className="text-gray-500 text-sm mt-1">Checking Email</p>}
              {adminemailerror && !adminemailexist && !adminemailcharacters.test(adminformdata.adminemail) && (
                <p className="text-red-500 text-sm mt-1">Enter a valid email address</p>
              )}
              {adminemailerror && adminemailexist && (
                <p className="text-red-500 text-sm mt-1">Email already exists</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                placeholder="Enter your lastname..." 
                type="text" 
                name="adminlastname" 
                id="adminlastname" 
                value={adminformdata.adminlastname} 
                onChange={adminhandlechange} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                placeholder="Enter your firstname..." 
                type="text" 
                name="adminfirstname" 
                id="adminfirstname" 
                value={adminformdata.adminfirstname} 
                onChange={adminhandlechange} 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Middle Name</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
              placeholder="Enter your middlename..." 
              type="text" 
              name="adminmiddlename" 
              id="adminmiddlename" 
              value={adminformdata.adminmiddlename} 
              onChange={adminhandlechange} 
              required
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={adminissubmitting} 
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="flex items-center">
                {adminissubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <i className="bx bx-edit mr-3"></i>
                    Save Changes
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
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

{(activedashboard === 'profileinformation' && !isAdminRole) && (
  <div id="profileinformation" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <i className="bx bxs-user-detail text-[#184d85] text-[25px] mr-2"/> 
        <h1 className="font-albertsans font-bold text-[#184d85] text-[25px]">Profile Information</h1>
      </div>
      <div
        onClick={refreshProfileData}
        disabled={loadingpatients}
        className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loadingpatients ? 'animate-spin' : ''}`} />
        {loadingpatients ? 'Refreshing...' : 'Refresh'}
      </div>
    </div>

    {/* Patient profile Table */}
    {activeprofiletable === 'patientprofiletable' && (
      <div id="patientprofiletable" className="animate-fadeInUp flex flex-col items-center w-[100%] h-[83%] rounded-2xl mt-5">
        <div className="mt-5 w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
          <div className="ml-2 mr-2 w-full flex items-center">
            <h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3">Search: </h2>
            <div className="relative w-full flex items-center justify-center gap-3">
              <i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i>
              <input 
                type="text" 
                placeholder="Enter patient name..." 
                value={searchPatientProfiles} 
                onChange={(e) => {setSearchPatientProfiles(e.target.value); filterPatientProfiles(e.target.value);}}
                className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
              />
            </div>
          </div>
          <div 
            onClick={() => setshowaddpatientprofile(true)}  
            className="ml-2 w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"
          >
            <i className="bx bx-user-plus text-white font-bold text-[30px]"/>
            <p className="font-bold font-albertsans text-white text-[18px] ml-2 py-2 px-1">Add Profile</p>
          </div>
        </div>

        <div className="rounded-3xl min-h-[95%] h-auto pb-5 w-full mt-2 bg-[#f7f7f7]">
          {renderpatientprofiles()}
        </div>

        {showpatientpofile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
              {/* Header */}
              <div className="bg-sky-800 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-full mr-4">
                      <i className="bx bx-user text-white text-2xl"></i>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Edit Patient Profile</h1>
                      <p className="text-sky-100">Update patient information</p>
                    </div>
                  </div>
                  <div
                    onClick={() => {setshowpatientpofile(false); resetpatientprofileformdata();}}
                    className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                  >
                    <i className="bx bx-x text-white text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <form onSubmit={retrieveandupdatepatientprofile} className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture Section */}
                    <div className="lg:col-span-1">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                          {addpatientprofileisuploadingimage ? (
                            /* Loading state */
                            <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-2 mx-auto"></div>
                                <p className="text-sky-600 text-sm font-medium">Uploading...</p>
                              </div>
                            </div>
                          ) : addpatientprofilepreviewimage || (demoformdata.patientprofilepicture && demoformdata.patientprofilepicture !== '') ? (
                            <img 
                              className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                              src={addpatientprofilepreviewimage || demoformdata.patientprofilepicture || defaultprofilepic}
                              alt="Profile"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            /* Fallback placeholder when no image */
                            <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                              <div className="text-center">
                                <i className="bx bx-user text-sky-400 text-6xl mb-2"></i>
                                <p className="text-sky-600 text-sm font-medium">No Photo</p>
                              </div>
                            </div>
                          )}
                          {!addpatientprofileisuploadingimage && (
                            <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
                            </div>
                          )}
                        </div>
                        
                        <input  
                          className="hidden" 
                          type="file" 
                          onChange={addpatientprofilehandlechange} 
                          accept="image/jpeg, image/jpg, image/png, image/gif, image/webp" 
                          ref={addpatientprofileimageinputref} 
                          disabled={addpatientprofileisuploadingimage}
                        />
                        
                        <div className="flex items-center gap-2">
                          {(addpatientprofileselectedfile || addpatientprofilepreviewimage) && !addpatientprofileisuploadingimage && (
                            <button
                              type="button"
                              onClick={addpatientprofilehandleremoveprofile}
                              className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              title="Remove Photo"
                            >
                              <i className="bx bx-trash w-4 h-4"></i>
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={addpatientprofilehandleuploadclick}
                            disabled={addpatientprofileisuploadingimage}
                            className={`cursor-pointer flex items-center px-6 py-3 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                              addpatientprofileisuploadingimage 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700'
                            }`}
                          >
                            {addpatientprofileisuploadingimage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-camera mr-2"></i>
                                Upload Photo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                            value={demoformdata.patientlastname} 
                            onChange={(e) => setdemoformdata({...demoformdata, patientlastname: e.target.value})} 
                            type="text" 
                            name="patientlastname" 
                            id="patientlastname" 
                            placeholder="Enter last name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                            value={demoformdata.patientfirstname} 
                            onChange={(e) => setdemoformdata({...demoformdata, patientfirstname: e.target.value})}  
                            type="text" 
                            name="patientfirstname" 
                            id="patientfirstname" 
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          value={demoformdata.patientmiddlename} 
                          onChange={(e) => setdemoformdata({...demoformdata, patientmiddlename: e.target.value})}  
                          type="text" 
                          name="patientmiddlename" 
                          id="patientmiddlename" 
                          placeholder="Enter middle name (optional)"
                        />
                      </div>

                      {/* Birthdate and Age */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            Birthdate
                          </label>
                          <input 

                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"

value={demoformdata.patientbirthdate} 
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
                            max={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            Age
                          </label>
                          <input 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                            value={demoformdata.patientage}  
                            readOnly 
                            type="number" 
                            name="patientage" 
                            id="patientage" 
                            placeholder="Auto-calculated from birthdate"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <div className="mt-2">
                          <GenderBoxAdminDash value={demoformdata.patientgender} onChange={(e) => setdemoformdata({...demoformdata, patientgender: e.target.value})} />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Contact Number
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          value={demoformdata.patientcontactnumber} 
                          onChange={(e) => setdemoformdata({...demoformdata, patientcontactnumber: e.target.value})}  
                          type="text" 
                          name="patientcontactnumber" 
                          id="patientcontactnumber" 
                          placeholder="Ex: 09123456789"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Home Address
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          value={demoformdata.patienthomeaddress} 
                          onChange={(e) => setdemoformdata({...demoformdata, patienthomeaddress: e.target.value})}  
                          type="text" 
                          name="patienthomeaddress" 
                          id="patienthomeaddress" 
                          placeholder="Complete home address"
                          required
                        />
                      </div>

                      {/* Emergency Contact Section */}
                      <div className="border-t border-gray-200 pt-6 mt-8">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <i className="bx bx-shield text-red-600"></i>
                            </div>
                            Emergency Contact Information
                          </h3>
                          <p className="text-sm text-gray-600">
                            This information will be used to contact someone in case of medical emergencies.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                              Contact Name
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demoformdata.patientemergencycontactname} 
                              onChange={(e) => setdemoformdata({...demoformdata,patientemergencycontactname: e.target.value})}  
                              type="text" 
                              name="patientemergencycontactname" 
                              id="patientemergencycontactname" 
                              placeholder="Emergency contact name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                              Contact Number
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demoformdata.patientemergencycontactnumber} 
                              onChange={(e) => setdemoformdata({...demoformdata, patientemergencycontactnumber: e.target.value})}  
                              type="text" 
                              name="patientemergencycontactnumber" 
                              id="patientemergencycontactnumber" 
                              placeholder="Emergency contact number"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-8 space-y-4">
                        <button 
                          type="submit" 
                          disabled={issubmitting} 
                          className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
                            issubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="relative flex items-center">
                            {issubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating Profile...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-edit mr-3"></i>
                                Save Changes
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setshowdeletepatientprofiledialog(true)}
                          className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <i className="bx bx-trash mr-3"></i>
                          Delete Patient Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showdeletepatientprofiledialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Patient Profile</h2>
</div>
</div>
<div 
onClick={() => {
  setshowdeletepatientprofiledialog(false);
  setselectedpatientprofile(null);
}} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this patient profile?
</p>

{selectedpatientprofile && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Patient Name: {selectedpatientprofile.name}</p>
<p className="text-sm text-gray-500">Patient Email: {selectedpatientprofile.email}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => {
    setshowdeletepatientprofiledialog(false);
    setselectedpatientprofile(null);
  }}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={deletepatientprofile}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Profile
</button>
</div>
</div>
</div>
</div>
        )}

        {showaddpatientpofile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] animate-fadeInUp">
              {/* Header */}
              <div className="bg-sky-800 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-full mr-4">
                      <i className="bx bx-user-plus text-white text-2xl"></i>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Add Patient Profile</h1>
                      <p className="text-sky-100">Create a new patient profile</p>
                    </div>
                  </div>
                  <div
                    onClick={() => {setshowaddpatientprofile(false); resetpatientprofileformdata();}}
                    className="cursor-pointer bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                  >
                    <i className="bx bx-x text-white text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <form onSubmit={addpatientprofile} className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture Section */}
                    <div className="lg:col-span-1">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                          {addpatientprofileisuploadingimage ? (
                            /* Loading state */
                            <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-2 mx-auto"></div>
                                <p className="text-sky-600 text-sm font-medium">Uploading...</p>
                              </div>
                            </div>
                          ) : addpatientprofilepreviewimage ? (
                            <img 
                              className="relative w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                              src={addpatientprofilepreviewimage || defaultprofilepic}
                              alt="Profile"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            /* Fallback placeholder when no image */
                            <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
                              <div className="text-center">
                                <i className="bx bx-user text-sky-400 text-6xl mb-2"></i>
                                <p className="text-sky-600 text-sm font-medium">No Photo</p>
                              </div>
                            </div>
                          )}
                          {!addpatientprofileisuploadingimage && (
                            <div className="absolute inset-0 rounded-full hover:bg-[#0000002b] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <i className="bx bx-camera text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
                            </div>
                          )}
                        </div>
                        
                        <input  
                          className="hidden" 
                          type="file" 
                          onChange={addpatientprofilehandlechange} 
                          accept="image/jpeg, image/jpg, image/png, image/gif, image/webp" 
                          ref={addpatientprofileimageinputref} 
                          disabled={addpatientprofileisuploadingimage}
                        />
                        
                        <div className="flex items-center gap-2">
                          {(selectedpatientprofile || addpatientprofilepreviewimage) && !addpatientprofileisuploadingimage && (
                            <button
                              type="button"
                              onClick={addpatientprofilehandleremoveprofile}
                              className="cursor-pointer flex items-center justify-center px-3 h-11 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              title="Remove Photo"
                            >
                              <i className="bx bx-trash w-4 h-4"></i>
                            </button>
                          )}
                          
                          <button
                            type="button"
                            onClick={addpatientprofilehandleuploadclick}
                            disabled={addpatientprofileisuploadingimage}
                            className={`cursor-pointer flex items-center px-6 py-3 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                              addpatientprofileisuploadingimage 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700'
                            }`}
                          >
                            {addpatientprofileisuploadingimage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-camera mr-2"></i>
                                Upload Photo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Patient Email
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          onChange={(e) => setdemoformdata({...demoformdata, patientemail: e.target.value.trim()})}
                          value={demoformdata.patientemail} 
                          id="patientemail" 
                          name="patientemail" 
                          required 
                          type="email" 
                          placeholder="Enter patient email"
                        />
                        {/* Email validation messages */}
                        <div className="text-sm">
                          {demopatientcheckemail && (
                            <p className="text-gray-500">Checking Email...</p>
                          )}
                          {!demopatientcheckemail && (
                            <>
                              {demopatientemailerror && !demopatientemailexist && (
                                <p className="text-red-500">
                                  Please enter a valid email address
                                </p>
                              )}
                              {demopatientemailexist && (
                                <p className="text-red-500">
                                  A patient profile already exists with this email
                                </p>
                              )}
                              {emailisnotpatienterror && (
                                <p className="text-red-500">
                                  This email belongs to a staff/admin account and cannot be used for patient profiles
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                            value={demoformdata.patientlastname} 
                            onChange={(e) => setdemoformdata({...demoformdata, patientlastname: e.target.value})} 
                            type="text" 
                            name="patientlastname" 
                            id="patientlastname" 
                            placeholder="Enter last name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                            value={demoformdata.patientfirstname} 
                            onChange={(e) => setdemoformdata({...demoformdata, patientfirstname: e.target.value})}  
                            type="text" 
                            name="patientfirstname" 
                            id="patientfirstname" 
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Middle Name <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          value={demoformdata.patientmiddlename} 
                          onChange={(e) => setdemoformdata({...demoformdata, patientmiddlename: e.target.value})}  
                          type="text" 
                          name="patientmiddlename" 
                          id="patientmiddlename" 
                          placeholder="Enter middle name (optional)"
                        />
                      </div>

                      {/* Birthdate and Age */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            Birthdate
                          </label>
                          <input 
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
                            value={demoformdata.patientbirthdate} 
                            onChange={(e) => {
                              const newBirthdate = e.target.value;
                              setdemoformdata({
                                ...demoformdata, 
                                patientbirthdate: newBirthdate,
                                patientage: calculateAge(newBirthdate)
                              });
                            }} 
                            max={new Date().toISOString().split('T')[0]}  
                            type="date" 
                            name="patientbirthdate" 
                            id="patientbirthdate"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center text-sm font-medium text-gray-700">
                            Age
                          </label>
                          <input 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 cursor-not-allowed"
                            value={demoformdata.patientage}  
                            readOnly 
                            type="number" 
                            name="patientage" 
                            id="patientage" 
                            placeholder="Auto-calculated from birthdate"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <div className="mt-2">
                          <GenderBoxAdminDash value={demoformdata.patientgender} onChange={(e) => setdemoformdata({...demoformdata, patientgender: e.target.value})} />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Contact Number
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          value={demoformdata.patientcontactnumber} 
                          onChange={(e) => setdemoformdata({...demoformdata, patientcontactnumber: e.target.value})}  
                          type="text" 
                          name="patientcontactnumber" 
                          id="patientcontactnumber" 
                          placeholder="Ex: 09123456789"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          Home Address
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white hover:border-gray-400"
                          value={demoformdata.patienthomeaddress} 
                          onChange={(e) => setdemoformdata({...demoformdata, patienthomeaddress: e.target.value})}  
                          type="text" 
                          name="patienthomeaddress" 
                          id="patienthomeaddress" 
                          placeholder="Complete home address"
                          required
                        />
                      </div>

                      {/* Emergency Contact Section */}
                      <div className="border-t border-gray-200 pt-6 mt-8">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 mb-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                              <i className="bx bx-shield text-red-600"></i>
                            </div>
                            Emergency Contact Information
                          </h3>
                          <p className="text-sm text-gray-600">
                            This information will be used to contact someone in case of medical emergencies.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                              Contact Name
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demoformdata.patientemergencycontactname} 
                              onChange={(e) => setdemoformdata({...demoformdata,patientemergencycontactname: e.target.value})}  
                              type="text" 
                              name="patientemergencycontactname" 
                              id="patientemergencycontactname" 
                              placeholder="Emergency contact name"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                              Contact Number
                            </label>
                            <input 
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white hover:border-gray-400"
                              value={demoformdata.patientemergencycontactnumber} 
                              onChange={(e) => setdemoformdata({...demoformdata, patientemergencycontactnumber: e.target.value})}  
                              type="text" 
                              name="patientemergencycontactnumber" 
                              id="patientemergencycontactnumber" 
                              placeholder="Emergency contact number"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-8">
                        <button 
                          type="submit" 
                          disabled={addpatientprofileissubmitting} 
                          className={`relative w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-sky-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden ${
                            addpatientprofileissubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl transform hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="relative flex items-center">
                            {addpatientprofileissubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Profile...
                              </>
                            ) : (
                              <>
                                <i className="bx bx-user-plus mr-3"></i>
                                Create Patient Profile
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Add Patient Profile Toast Notification */}
    {addPatientProfileToast && (
      <div className={`${smsToast || pdfToast ? 'bottom-28' : 'bottom-4'} right-8 z-101 transform fixed`}>
        <div key={addPatientProfileToastType} className={`${addPatientProfileToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
          {addPatientProfileToastType === 'success' ? (          
            <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
          ) : (
            <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
          )}
          {addPatientProfileToastMessage}

          <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${addPatientProfileToastType === 'success' ? 'bg-green-500' : 'bg-red-500'}`} style={{width: addPatientProfileProgressWidth, transition: 'width 4s linear'}}/>
        </div>
      </div>  
    )}

    {/* Update Patient Profile Toast Notification */}
    {updatePatientProfileToast && (
      <div className={`${smsToast || pdfToast || addPatientProfileToast ? 'bottom-36' : 'bottom-4'} right-8 z-101 transform fixed`}>
        <div key={updatePatientProfileToastType} className={`${updatePatientProfileToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s] motion-ease-spring-smooth' : 'motion-preset-slide-left'} flex items-center bg-white rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`}>
          {updatePatientProfileToastType === 'success' ? (          
            <span className="text-blue-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle"></i></span>
          ) : (
            <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle"></i></span>
          )}
          {updatePatientProfileToastMessage}

          <div className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${updatePatientProfileToastType === 'success' ? 'bg-sky-500' : 'bg-red-500'}`} style={{width: updatePatientProfileProgressWidth, transition: 'width 4s linear'}}/>
        </div>
      </div>  
    )}
  </div>
)}



{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 






































































































































































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
    
    {/* Export PDF Button */}
    <button
      id="exportBautistaPDF"
      type="button"
      onClick={exportBautistaPDF}
      style={{
        padding: "12px 24px",
        backgroundColor: "#3b82f6", // blue-500
        color: "#ffffff",
        borderRadius: "0.5rem",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")} // blue-600
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
      onMouseDown={(e) => (e.target.style.backgroundColor = "#1d4ed8")} // blue-700
      onMouseUp={(e) => (e.target.style.backgroundColor = "#2563eb")}
    >
      <i className="bx bxs-file-pdf text-lg"></i>
      Export PDF
    </button>

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
    
    {/* Export PDF Button */}
    <button
      id="exportAmbherPDF"
      type="button"
      onClick={exportAmbherPDF}
      style={{
        padding: "12px 24px",
        backgroundColor: "#22c55e", // green-500
        color: "#ffffff",
        borderRadius: "0.5rem",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s ease-in-out",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#16a34a")} // green-600
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#22c55e")}
      onMouseDown={(e) => (e.target.style.backgroundColor = "#15803d")} // green-700
      onMouseUp={(e) => (e.target.style.backgroundColor = "#16a34a")}
    >
      <i className="bx bxs-file-pdf text-lg"></i>
      Export PDF
    </button>

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







{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}
{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}{/*Start of Inventory Management*/}




{ (activedashboard === 'inventorymanagement' && !isAdminRole) && ( 
  <div id="inventorymanagement" className="pl-5 pr-5 pb-26 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-auto rounded-2xl flex flex-col" >   

<div className="flex items-center justify-between mb-4">
  <div className="flex items-center">
    <i className="bx bxs-package text-[#184d85] text-[25px] mr-2"/> 
    <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Inventory Management</h1>
  </div>
  
  {/* Refresh Button */}
  <div className="flex space-x-3">
    <div
      onClick={refreshInventoryData}
      disabled={loadingambherinventorycategorylist || loadingbautistainventorycategorylist || ambherloadingproducts || bautistaloadingproducts}
      className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${(loadingambherinventorycategorylist || loadingbautistainventorycategorylist || ambherloadingproducts || bautistaloadingproducts) ? 'animate-spin' : ''}`} />
      {(loadingambherinventorycategorylist || loadingbautistainventorycategorylist || ambherloadingproducts || bautistaloadingproducts) ? 'Refreshing...' : 'Refresh'}
    </div>
  </div>
</div>

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

    <div
      onClick={() => setQuantitySortingProducts('Archived')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${quantitySortingProducts === 'Archived'
          ? 'bg-gray-600 text-white border-gray-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
    >

      Archived Products
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
}} className="motion-preset-slide-up mr-3 mb-3 flex flex-col items-start justify-start w-[220px] h-auto shadow-md bg-white rounded-2xl relative">
  <img src={product.ambherinventoryproductimagepreviewimages[0] || defaultimageplaceholder}  alt={product.ambherinventoryproductname} className={`rounded-tr-2xl  rounded-tl-2xl w-full h-45 ${product.ambherinventoryproductquantity === 0 || product.isArchived ? 'opacity-50': ''}`}/>
  
  {/* Archived Overlay */}
  {product.isArchived && (
    <div className="absolute inset-0 bg-black/70 bg-opacity-70 rounded-2xl flex items-center justify-center z-10">
      <div className="text-center">
        <i className="bx bx-archive text-white text-4xl mb-2"></i>
        <h1 className="font-albertsans font-bold text-white text-lg">ARCHIVED</h1>
        <p className="font-albertsans font-medium text-gray-300 text-sm">Product archived</p>
      </div>
    </div>
  )}
  
  {product.ambherinventoryproductquantity === 0 && !product.isArchived ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-red-200 z-20"><h1 className="text-red-900">Out of Stock</h1></div>): 
   product.ambherinventoryproductquantity <= 3 && !product.isArchived ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-orange-200 z-20"><h1 className="text-orange-900">Critical Stock</h1></div>):
   product.ambherinventoryproductquantity <= 6 && !product.isArchived ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-yellow-200 z-20"><h1 className="text-yellow-900">Low Stock</h1></div>): null}


  <div className="mx-1  w-fit rounded-md py-1 px-2  rounded-1xl h-fit  bg-[#F0F6FF] mt-2 break-words min-w-0 "><h1 className={`font-medium   text-[13px] min-w-0 break-words text-[#0d0d0d] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`} >{product.ambherinventoryproductcategory}</h1></div>
  <div className="w-full h-auto ml-2 mt-2 "><h1 className={`font-semibold  text-[15px] min-w-0 break-words text-[#0d0d0d] ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.ambherinventoryproductname}</h1></div>
  <div className="w-fit h-auto ml-2 mt-1 "><h1 className={`font-albertsans font-bold text-[18px] min-w-0 break-words ${product.ambherinventoryproductquantity === 0 ? 'text-gray-400': ''}`}>₱{Number(product.ambherinventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1></div>
  {!product.isArchived && (
    <div className="w-full h-auto ml-2 mt-5 mb-1 "><h1 className={`font-albertsans font-medium  text-[15px] min-w-0 break-words ${product.ambherinventoryproductquantity === 0 ? 'text-red-600' : product.ambherinventoryproductquantity <= 3 ? 'text-orange-600' : product.ambherinventoryproductquantity <= 6 ? 'text-yellow-600' : 'text-[#4e4f4f]'}`}>{product.ambherinventoryproductquantity === 0 ? ('Out Of Stock'):(`In Stock: ${product.ambherinventoryproductquantity}${product.ambherinventoryproductquantity <= 3 ? ' (Critical)': product.ambherinventoryproductquantity <= 6 ? ' (Low)': ''}`)}</h1></div>
  )}
  
  {/* Urgent Restock Alert - Show when out of stock but has wishlist items and not archived */}
  {product.ambherinventoryproductquantity === 0 && !product.isArchived && (wishlistCounts[product.ambherinventoryproductid] ?? 0) > 0 && (
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

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">

{/* Modal Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-100">
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500  rounded-xl flex items-center justify-center">
      <i className="bx bx-category text-white text-xl"></i>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
      <p className="text-sm text-gray-500">Ambher Inventory Categories</p>
    </div>
  </div>
  <div 
    onClick={() => setshowaddambherinventorycategorydialog(false)}
    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"></i>
  </div>
</div>

{/* Modal Content */}
<div className="overflow-y-auto max-h-[calc(95vh-120px)]">
  <div className="p-6">
    <div className="flex justify-end mb-6">
      <div 
        onClick={() => setshowaddambheraddinventorycategory(true)}
        className="cursor-pointer px-6 py-3 bg-[#6aa84f] hover:bg-[#5f9747] text-white rounded-3xl font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <i className="bx bx-plus text-lg"></i>
        <span>Add Category</span>
      </div>
    </div>
    
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
      {ambherinventorycategorylist.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <i className="bx bx-info-circle text-yellow-500 text-3xl mb-2"></i>
          <h3 className="text-yellow-800 font-medium text-lg">No Categories Found</h3>
          <p className="text-yellow-600 text-sm">No Ambher Optical Inventory Categories available</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">Category</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loadingambherinventorycategorylist ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <CategoryTableSkeleton key={index} />
                ))}
              </>
            ) : (
              ambherinventorycategorylist.map((category) => (
                <tr 
                  key={category._id}
                  className="hover:bg-gray-50 transition-all ease-in-out duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.ambherinventorycategoryname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={category.ambherinventorycategoryaddedbyprofilepicture || 'default-profile.png'}
                        alt="Profile" 
                        className="rounded-full h-10 w-10 object-cover mr-3"
                        onError={(e) => {
                          e.target.src = 'default-profile.png';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.ambherinventorycategoryaddedbyfirstname} {category.ambherinventorycategoryaddedbylastname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {category.ambherinventorycategoryaddedbytype}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const categoryUsedInOrders = ambherorders.some(order => 
                        order.patientorderambherproductcategory === category.ambherinventorycategoryname
                      );
                      
                      const categoryUsedInInventory = ambherinventoryproducts.some(product => 
                        product.ambherinventoryproductcategory === category.ambherinventorycategoryname
                      );
                      
                      if (categoryUsedInOrders && categoryUsedInInventory) {
                        return (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                            <i className="bx bx-error-circle text-sm"></i>
                            <span>Used in orders & inventory</span>
                          </div>
                        );
                      } else if (categoryUsedInOrders) {
                        return (
                          <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                            <i className="bx bx-info-circle text-sm"></i>
                            <span>Used in orders</span>
                          </div>
                        );
                      } else if (categoryUsedInInventory) {
                        return (
                          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                            <i className="bx bx-package text-sm"></i>
                            <span>Used in inventory</span>
                          </div>
                        );
                      } else {
                        return (
                          <div 
                            onClick={() => {
                              setshowdeleteambherinventorycategorydialog(true);
                              setselectedambherinventorycategory(category);
                            }} 
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
                          >
                            <i className="bx bxs-trash text-sm"></i>
                            <span>Delete</span>
                          </div>
                        );
                      }
                    })()}
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

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">

{/* Modal Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-100">
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
      <i className="bx bx-plus text-white text-xl"></i>
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
      <p className="text-sm text-gray-500">Create new inventory category</p>
    </div>
  </div>
  <div 
    onClick={() => setshowaddambheraddinventorycategory(false)}
    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"></i>
  </div>
</div>

{/* Modal Content */}
<form onSubmit={submitambherinventorycategory}>
<div className="p-6 space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastname">
      Category Name
    </label>
    <input 
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
      placeholder="Enter category name..."
      value={ambherinventorycategorynameset} 
      onChange={(e) => setambherinventorycategorynameset(e.target.value)} 
      type="text" 
      name="patientlastname" 
      id="patientlastname"  
      required
    />
    
    {ambherinventorycategorynamecheck && (
      <div className="mt-2">
        <p className="text-blue-600 text-sm font-medium flex items-center">
          <i className="bx bx-loader-alt animate-spin mr-2"></i>
          Checking category name...
        </p>
      </div>
    )}
    
    {ambherinventorycategorynameexist && (
      <div className="mt-2">
        <p className="text-red-600 text-sm font-medium flex items-center">
          <i className="bx bx-error-circle mr-2"></i>
          Category already exists
        </p>
      </div>
    )}
  </div>
</div>

{/* Action Buttons */}
<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
  <button 
    type="button"
    onClick={() => setshowaddambheraddinventorycategory(false)}
    style={{
      cursor: 'pointer',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderRadius: '0.75rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      border: 'none'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
  >
    Cancel
  </button>
  <button
    type="submit"
    disabled={ambherinventorycategoryissubmitting}
    style={{
      cursor: ambherinventorycategoryissubmitting ? 'not-allowed' : 'pointer',
      padding: '0.75rem 1.5rem',
      backgroundColor: ambherinventorycategoryissubmitting ? '#9ca3af' : '#6aa84f',
      color: '#ffffff',
      borderRadius: '0.75rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      border: 'none'
    }}
    onMouseEnter={(e) => {
      if (!ambherinventorycategoryissubmitting) {
        e.target.style.backgroundColor = '#5f9747';
      }
    }}
    onMouseLeave={(e) => {
      if (!ambherinventorycategoryissubmitting) {
        e.target.style.backgroundColor = '#6aa84f';
      }
    }}
  >
    {ambherinventorycategoryissubmitting ? "Adding..." : "Add Category"}
  </button>
</div>
</form>
</div>
</div>

)}

{showdeleteambherinventorycategorydialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Inventory Category</h2>
</div>
</div>
<div 
onClick={() => setshowdeleteambherinventorycategorydialog(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this category?
</p>

{selectedambherinventorycategory && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Category Name: {selectedambherinventorycategory.ambherinventorycategoryname}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeleteambherinventorycategorydialog(false)}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={() => deleteambherinventorycategory()}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Category
</button>
</div>
</div>
</div>
</div>
)}

{/*Ambher Inventory Product Modal*/}
{showaddambherinventoryproductdialog && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
    <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bx-package text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedambherproduct ? "Edit Product" : "Add Product"}
            </h2>
            <p className="text-sm text-gray-500">Ambher Inventory Management</p>
          </div>
        </div>
        <button 
          onClick={() => {setshowaddambherinventoryproductdialog(false); resetaddambherinventoryproductdialog();}}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease-in-out',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          <i className="bx bx-x text-gray-600 text-xl"></i>
        </button>
      </div>

      {/* Modal Content */}
      <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
        <form onSubmit={selectedambherproduct ? handleupdateambherinventoryproduct : handlesubmitaddambherinventoryproduct} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    className="w-100 h-100 object-cover rounded-2xl shadow-lg" 
                    src={(addambherinventoryproductimagepreviewimages?.[currentimageindex]) || (selectedambherproduct?.ambherinventoryproductimagepreviewimages?.[currentimageindex]) || defaultimageplaceholder}
                    alt="Product preview"
                  />
                  {((addambherinventoryproductimagepreviewimages?.length || selectedambherproduct?.ambherinventoryproductimagepreviewimages?.length || 0) > 1) && (
                    <>
                      <button 
                        type="button" 
                        onClick={handlepreviousimage}  
                        style={{
                          position: 'absolute',
                          left: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                      >
                        <i className="bx bx-chevron-left text-xl"></i>
                      </button>
                      <button 
                        type="button" 
                        onClick={handlenextimage}  
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                      >
                        <i className="bx bx-chevron-right text-xl"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {(addambherinventoryproductimagepreviewimages.length > 0 || (selectedambherproduct?.ambherinventoryproductimagepreviewimages?.length > 0)) && (
                <div className="flex gap-3 justify-center flex-wrap">
                  {(addambherinventoryproductimagepreviewimages.length > 0 ? addambherinventoryproductimagepreviewimages : selectedambherproduct?.ambherinventoryproductimagepreviewimages || []).map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        onClick={() => setcurrentimageindex(index)} 
                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-200 ${currentimageindex === index ? 'ring-2 ring-sky-500 shadow-md' : 'hover:ring-2 hover:ring-gray-300'}`} 
                      />
                      {addambherinventoryproductimagepreviewimages.length > 0 && (
                        <button 
                          onClick={() => addambherinventoryproductimagehandleremove(index)}   
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200"
                        > 
                          <i className="bx bx-x"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <input 
                className="hidden" 
                multiple 
                type="file" 
                accept="image/jpeg, image/jpg, image/png" 
                ref={addambherinventoryproductimageimageinputref} 
                onChange={addambherinventoryproductimagehandlechange}    
              />
              <div
                onDragOver={(e) => {
                  if (ambherinventoryproductimagesuploading) return;
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#60a5fa';
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  const icon = e.currentTarget.querySelector('i');
                  const primaryText = e.currentTarget.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#1c96c5';
                  if (primaryText) primaryText.style.color = '#2563eb';
                }}
                onDragLeave={(e) => {
                  if (ambherinventoryproductimagesuploading) return;
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#1c96c5';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const icon = e.currentTarget.querySelector('i');
                  const primaryText = e.currentTarget.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#9ca3af';
                  if (primaryText) primaryText.style.color = '#4b5563';
                }}
                onDrop={(e) => {
                  if (ambherinventoryproductimagesuploading) return;
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#1c96c5';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const icon = e.currentTarget.querySelector('i');
                  const primaryText = e.currentTarget.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#9ca3af';
                  if (primaryText) primaryText.style.color = '#4b5563';
                  
                  const files = Array.from(e.dataTransfer.files);
                  const imageFiles = files.filter(file => file.type.startsWith('image/'));
                  
                  if (imageFiles.length > 0) {
                    // Create a synthetic event to pass to the existing handler
                    const syntheticEvent = {
                      target: {
                        files: imageFiles
                      }
                    };
                    addambherinventoryproductimagehandlechange(syntheticEvent);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px dashed #1c96c5',
                  borderRadius: '1rem',
                  backgroundColor: 'transparent',
                  cursor: ambherinventoryproductimagesuploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  opacity: ambherinventoryproductimagesuploading ? 0.7 : 1
                }}
                onClick={ambherinventoryproductimagesuploading ? undefined : addambherinventoryproductimagehandleuploadclick}
                onMouseEnter={(e) => {
                  if (ambherinventoryproductimagesuploading) return;
                  e.target.style.borderColor = '#60a5fa';
                  e.target.style.backgroundColor = '#eff6ff';
                  const icon = e.target.querySelector('i');
                  const primaryText = e.target.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#1c96c5';
                  if (primaryText) primaryText.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (ambherinventoryproductimagesuploading) return;
                  e.target.style.borderColor = '#1c96c5';
                  e.target.style.backgroundColor = 'transparent';
                  const icon = e.target.querySelector('i');
                  const primaryText = e.target.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#9ca3af';
                  if (primaryText) primaryText.style.color = '#4b5563';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  {ambherinventoryproductimagesuploading ? (
                    <>
                      <div style={{ 
                        width: '2rem', 
                        height: '2rem', 
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #1c96c5',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <p style={{ color: '#1c96c5', fontWeight: '500' }}>
                        Uploading Images...
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Please wait</p>
                    </>
                  ) : (
                    <>
                      <i style={{ fontSize: '1.875rem', color: '#9ca3af', transition: 'color 0.2s ease-in-out' }} className="bx bx-cloud-upload"></i>
                      <p style={{ color: '#4b5563', fontWeight: '500', transition: 'color 0.2s ease-in-out' }}>
                        Upload Images ({addambherinventoryproductimagepreviewimages.length}/5)
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Click to browse or drag & drop images here</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h3>
                

              </div>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ambherinventorycategorynamebox">
                    Category
                  </label>
                  <AmbherinventorycategoryBox  
                    value={ambherinventorycategorynamebox} 
                    loading={loadingambherinventorycategorylist} 
                    onChange={(e) => setambherinventorycategorynamebox(e.target.value)} 
                    categories={ambherinventorycategorylist}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addambherinventoryproductname">
                    Product Name
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter product name..." 
                    type="text" 
                    name="addambherinventoryproductname" 
                    id="addambherinventoryproductname" 
                    value={addambherinventoryproductname} 
                    onChange={(e) => setaddambherinventoryproductname(e.target.value)} 
                    required 
                  />
                </div>

                {/* Product Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addambherinventoryproductbrand">
                    Product Brand
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter product brand..." 
                    type="text" 
                    name="addambherinventoryproductbrand" 
                    id="addambherinventoryproductbrand" 
                    value={addambherinventoryproductbrand} 
                    onChange={(e) => setaddambherinventoryproductbrand(e.target.value)} 
                    required
                  />
                </div>

                {/* Model Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addambherinventoryproductmodelnumber">
                    Model Number
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter model number..." 
                    type="text" 
                    name="addambherinventoryproductmodelnumber" 
                    id="addambherinventoryproductmodelnumber" 
                    value={addambherinventoryproductmodelnumber} 
                    onChange={(e) => setaddambherinventoryproductmodelnumber(e.target.value)} 
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addambherinventoryproductdescription">
                    Product Description
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 resize-none" 
                    ref={textarearef} 
                    rows={3} 
                    style={{minHeight:'80px'}} 
                    value={addambherinventoryproductdescription} 
                    onChange={(e) => {setaddambherinventoryproductdescription(e.target.value); adjusttextareaheight();}} 
                    placeholder="Enter product description..."
                  />
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addambherinventoryproductprice">
                      Price
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                      placeholder="0.00" 
                      type="number" 
                      step="0.01"
                      name="addambherinventoryproductprice" 
                      id="addambherinventoryproductprice" 
                      value={addambherinventoryproductprice} 
                      onChange={(e) => setaddambherinventoryproductprice(e.target.value)} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addambherinventoryproductquantity">
                      Quantity
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                      placeholder="0" 
                      type="number" 
                      name="addambherinventoryproductquantity" 
                      id="addambherinventoryproductquantity" 
                      value={addambherinventoryproductquantity} 
                      onChange={(e) => setaddambherinventoryproductquantity(e.target.value)} 
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            gap: '1rem', 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #f3f4f6' 
          }}>
            {selectedambherproduct && (
              <>
                {(ambherproductsoldCounts[selectedambherproduct.ambherinventoryproductid] ?? 0) >= 1 ? (
                  <button 
                    type="button"
                    onClick={() => {
                      if (selectedambherproduct.isArchived) {
                        handleUnarchiveAmbherProduct(selectedambherproduct);
                      } else {
                        handleArchiveAmbherProduct(selectedambherproduct);
                      }
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: selectedambherproduct.isArchived ? '#f0f9ff' : '#fef3c7',
                      color: selectedambherproduct.isArchived ? '#0369a1' : '#d97706',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = selectedambherproduct.isArchived ? '#e0f2fe' : '#fef3c7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = selectedambherproduct.isArchived ? '#f0f9ff' : '#fef3c7';
                    }}
                  >
                    {selectedambherproduct.isArchived ? 'Unarchive Product' : 'Archive Product'}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => {setshowdeleteambherproduct(true); setselecteddeleteambherproduct(selectedambherproduct);}}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  >
                    Delete Product
                  </button>
                )}
              </>
            )}
            <button 
              type="button"
              onClick={() => {setshowaddambherinventoryproductdialog(false); resetaddambherinventoryproductdialog();}}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={ambherinventoryproductissubmitting} 
              style={{
                padding: '0.75rem 2rem',
                background: ambherinventoryproductissubmitting 
                  ? '#484848' 
                  : '#6AA84F',
                color: 'white',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '500',
                cursor: ambherinventoryproductissubmitting ? 'not-allowed' : 'pointer',
                opacity: ambherinventoryproductissubmitting ? 0.5 : 1,
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                if (!ambherinventoryproductissubmitting) {
                  e.target.style.background = '#5f9747';
                }
              }}
              onMouseLeave={(e) => {
                if (!ambherinventoryproductissubmitting) {
                  e.target.style.background = '#6AA84F';
                }
              }}
            >
              {ambherinventoryproductissubmitting 
                ? (selectedambherproduct ? "Updating..." : "Adding...") 
                : (selectedambherproduct ? "Update Product" : "Add Product")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}



{showdeleteambherproduct && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Ambher Optical Product</h2>
</div>
</div>
<div 
onClick={() => setshowdeleteambherproduct(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this product?
</p>

{selecteddeleteambherproduct && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Product Name: {selecteddeleteambherproduct.ambherinventoryproductname}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeleteambherproduct(false)}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

{selectedambherproduct && (
<button
  onClick={deleteambherproduct}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Product
</button>
)}
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

    <div
      onClick={() => setBautistaQuantitySortingProducts('Archived')}
      className={`text-center w-full cursor-pointer px-4 py-2 rounded-2xl border transition-all duration-200 text-sm font-medium
        ${bautistaQuantitySortingProducts === 'Archived'
          ? 'bg-gray-600 text-white border-gray-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
    >
  
      Archived Products
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
}} className="motion-preset-slide-up mr-3 mb-3 flex flex-col items-start justify-start w-[220px] h-auto shadow-md bg-white rounded-2xl relative">
  <img src={product.bautistainventoryproductimagepreviewimages[0] || defaultimageplaceholder}  alt={product.bautistainventoryproductname} className={`rounded-tr-2xl  rounded-tl-2xl w-full h-45 ${product.bautistainventoryproductquantity === 0 || product.isArchived ? 'opacity-50': ''}`}/>
  
  {/* Archived Overlay */}
  {product.isArchived && (
    <div className="absolute inset-0 bg-black/70 bg-opacity-70 rounded-2xl flex items-center justify-center z-10">
      <div className="text-center">
        <i className="bx bx-archive text-white text-4xl mb-2"></i>
        <h1 className="font-albertsans font-bold text-white text-lg">ARCHIVED</h1>
        <p className="font-albertsans font-medium text-gray-300 text-sm">Product archived</p>
      </div>
    </div>
  )}
  
  {product.bautistainventoryproductquantity === 0 && !product.isArchived ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-red-200 z-20"><h1 className="text-red-900">Out of Stock</h1></div>): 
   product.bautistainventoryproductquantity <= 3 && !product.isArchived ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-orange-200 z-20"><h1 className="text-orange-900">Critical Stock</h1></div>):
   product.bautistainventoryproductquantity <= 6 && !product.isArchived ? (<div className="top-2 right-2 absolute px-2 py-1 rounded-md text-xs font-semibold bg-yellow-200 z-20"><h1 className="text-yellow-900">Low Stock</h1></div>): null}


  <div className="mx-1  w-fit rounded-md py-1 px-2  rounded-1xl h-fit  bg-[#F0F6FF] mt-2 break-words min-w-0 "><h1 className={`font-medium   text-[13px] min-w-0 break-words text-[#0d0d0d] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`} >{product.bautistainventoryproductcategory}</h1></div>
  <div className="w-full h-auto ml-2 mt-2 "><h1 className={`font-semibold  text-[15px] min-w-0 break-words text-[#0d0d0d] ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>{product.bautistainventoryproductname}</h1></div>
  <div className="w-fit h-auto ml-2 mt-1 "><h1 className={`font-albertsans font-bold text-[18px] min-w-0 break-words ${product.bautistainventoryproductquantity === 0 ? 'text-gray-400': ''}`}>₱{Number(product.bautistainventoryproductprice).toLocaleString('en-PH', {minimumFractionDigits: 2,  maximumFractionDigits: 2})}</h1></div>
  {!product.isArchived && (
    <div className="w-full h-auto ml-2 mt-2  "><h1 className={`font-albertsans font-medium  text-[15px] min-w-0 break-words ${product.bautistainventoryproductquantity === 0 ? 'text-red-600' : product.bautistainventoryproductquantity <= 3 ? 'text-orange-600' : product.bautistainventoryproductquantity <= 6 ? 'text-yellow-600' : 'text-[#4e4f4f]'}`}>{product.bautistainventoryproductquantity === 0 ? ('Out Of Stock'):(`In Stock: ${product.bautistainventoryproductquantity}${product.bautistainventoryproductquantity <= 3 ? ' (Critical)': product.bautistainventoryproductquantity <= 6 ? ' (Low)': ''}`)}</h1></div>
  )}
  
  {/* Urgent Restock Alert - Show when out of stock but has wishlist items and not archived */}
  {product.bautistainventoryproductquantity === 0 && !product.isArchived && (wishlistCounts[product.bautistainventoryproductid] ?? 0) > 0 && (
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




{/*Bautista Inventory Category*/}
{showaddbautistainventorycategorydialog && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">

{/* Modal Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-100">
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
      <i className="bx bx-category text-white text-xl"></i>
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
      <p className="text-sm text-gray-500">Bautista Eye Center Categories</p>
    </div>
  </div>
  <div 
    onClick={() => setshowaddbautistainventorycategorydialog(false)}
    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"></i>
  </div>
</div>

{/* Modal Content */}
<div className="overflow-y-auto max-h-[calc(95vh-120px)]">
  <div className="p-6">
    <div className="flex justify-end mb-6">
      <div 
        onClick={() => setshowaddbautistaaddinventorycategory(true)}
        className="cursor-pointer px-6 py-3 bg-[#6aa84f] hover:bg-[#5f9747] text-white rounded-3xl font-medium flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <i className="bx bx-plus text-lg"></i>
        <span>Add Category</span>
      </div>
    </div>
    
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
      {bautistainventorycategorylist.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <i className="bx bx-info-circle text-yellow-500 text-3xl mb-2"></i>
          <h3 className="text-yellow-800 font-medium text-lg">No Categories Found</h3>
          <p className="text-yellow-600 text-sm">No Bautista Eye Center Inventory Categories available</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">Category</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Created</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loadingbautistainventorycategorylist ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <CategoryTableSkeleton key={index} />
                ))}
              </>
            ) : (
              bautistainventorycategorylist.map((category) => (
                <tr 
                  key={category._id}
                  className="hover:bg-gray-50 transition-all ease-in-out duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.bautistainventorycategoryname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={category.bautistainventorycategoryaddedbyprofilepicture || 'default-profile.png'}
                        alt="Profile" 
                        className="rounded-full h-10 w-10 object-cover mr-3"
                        onError={(e) => {
                          e.target.src = 'default-profile.png';
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {category.bautistainventorycategoryaddedbyfirstname} {category.bautistainventorycategoryaddedbylastname}
                        </p>
                        <p className="text-sm text-gray-500">
                          {category.bautistainventorycategoryaddedbytype}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const categoryUsedInOrders = bautistaorders.some(order => 
                        order.patientorderbautistaproductcategory === category.bautistainventorycategoryname
                      );
                      
                      const categoryUsedInInventory = bautistainventoryproducts.some(product => 
                        product.bautistainventoryproductcategory === category.bautistainventorycategoryname
                      );
                      
                      if (categoryUsedInOrders && categoryUsedInInventory) {
                        return (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                            <i className="bx bx-error-circle text-sm"></i>
                            <span>Used in orders & inventory</span>
                          </div>
                        );
                      } else if (categoryUsedInOrders) {
                        return (
                          <div className="bg-orange-50 border border-orange-200 text-orange-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                            <i className="bx bx-info-circle text-sm"></i>
                            <span>Used in orders</span>
                          </div>
                        );
                      } else if (categoryUsedInInventory) {
                        return (
                          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                            <i className="bx bx-package text-sm"></i>
                            <span>Used in inventory</span>
                          </div>
                        );
                      } else {
                        return (
                          <div 
                            onClick={() => {
                              setshowdeletebautistainventorycategorydialog(true);
                              setselectedbautistainventorycategory(category);
                            }} 
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200"
                          >
                            <i className="bx bxs-trash text-sm"></i>
                            <span>Delete</span>
                          </div>
                        );
                      }
                    })()}
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

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">

{/* Modal Header */}
<div className="flex items-center justify-between p-6 border-b border-gray-100">
  <div className="flex items-center space-x-4">
    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
      <i className="bx bx-plus text-white text-xl"></i>
    </div>
    <div>
      <h2 className="text-xl font-bold text-gray-900">Add Category</h2>
      <p className="text-sm text-gray-500">Create new inventory category</p>
    </div>
  </div>
  <div 
    onClick={() => setshowaddbautistaaddinventorycategory(false)}
    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
  >
    <i className="bx bx-x text-gray-600 text-xl"></i>
  </div>
</div>

{/* Modal Content */}
<form onSubmit={submitbautistainventorycategory}>
<div className="p-6 space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="lastname">
      Category Name
    </label>
    <input 
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
      placeholder="Enter category name..."
      value={bautistainventorycategorynameset} 
      onChange={(e) => setbautistainventorycategorynameset(e.target.value)} 
      type="text" 
      name="patientlastname" 
      id="patientlastname"  
      required
    />
    
    {bautistainventorycategorynamecheck && (
      <div className="mt-2">
        <p className="text-blue-600 text-sm font-medium flex items-center">
          <i className="bx bx-loader-alt animate-spin mr-2"></i>
          Checking category name...
        </p>
      </div>
    )}
    
    {bautistainventorycategorynameexist && (
      <div className="mt-2">
        <p className="text-red-600 text-sm font-medium flex items-center">
          <i className="bx bx-error-circle mr-2"></i>
          Category already exists
        </p>
      </div>
    )}
  </div>
</div>

{/* Action Buttons */}
<div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
  <button 
    type="button"
    onClick={() => setshowaddbautistaaddinventorycategory(false)}
    style={{
      cursor: 'pointer',
      padding: '0.75rem 1.5rem',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderRadius: '0.75rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      border: 'none'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
    onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
  >
    Cancel
  </button>
  <button 
    type="submit" 
    disabled={bautistainventorycategoryissubmitting}
    style={{
      cursor: bautistainventorycategoryissubmitting ? 'not-allowed' : 'pointer',
      padding: '0.75rem 1.5rem',
      backgroundColor: bautistainventorycategoryissubmitting ? '#9ca3af' : '#6aa84f',
      color: '#ffffff',
      borderRadius: '0.75rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
      border: 'none'
    }}
    onMouseEnter={(e) => {
      if (!bautistainventorycategoryissubmitting) {
        e.target.style.backgroundColor = '#5f9747';
      }
    }}
    onMouseLeave={(e) => {
      if (!bautistainventorycategoryissubmitting) {
        e.target.style.backgroundColor = '#6aa84f';
      }
    }}
  >
    {bautistainventorycategoryissubmitting ? "Adding..." : "Add Category"}
  </button>
</div>
</form>
</div>
</div>

)}

{showdeletebautistainventorycategorydialog && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Inventory Category</h2>
</div>
</div>
<div 
onClick={() => setshowdeletebautistainventorycategorydialog(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this category?
</p>

{selectedbautistainventorycategory && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Category Name: {selectedbautistainventorycategory.bautistainventorycategoryname}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeletebautistainventorycategorydialog(false)}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

<button
  onClick={() => deletebautistainventorycategory()}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Category
</button>
</div>
</div>
</div>
</div>
)}

{/*Bautista Inventory Product Modal*/}
{showaddbautistainventoryproductdialog && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
      
      {/* Modal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bx-package text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedbautistaproduct ? "Edit Product" : "Add Product"}
            </h2>
            <p className="text-sm text-gray-500">Bautista Inventory Management</p>
          </div>
        </div>
        <button 
          onClick={() => {setshowaddbautistainventoryproductdialog(false); resetaddbautistainventoryproductdialog();}}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease-in-out',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
        >
          <i className="bx bx-x text-gray-600 text-xl"></i>
        </button>
      </div>

      {/* Modal Content */}
      <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
        <form onSubmit={selectedbautistaproduct ? handleupdatebautistainventoryproduct : handlesubmitaddbautistainventoryproduct} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    className="w-100 h-100 object-cover rounded-2xl shadow-lg" 
                    src={(addbautistainventoryproductimagepreviewimages?.[bautistacurrentimageindex]) || (selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.[bautistacurrentimageindex]) || defaultimageplaceholder}
                    alt="Product preview"
                  />
                  {((addbautistainventoryproductimagepreviewimages?.length || selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.length || 0) > 1) && (
                    <>
                      <button 
                        type="button" 
                        onClick={bautistahandlepreviousimage}  
                        style={{
                          position: 'absolute',
                          left: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                      >
                        <i className="bx bx-chevron-left text-xl"></i>
                      </button>
                      <button 
                        type="button" 
                        onClick={bautistahandlenextimage}  
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          padding: '0.5rem',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.75)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                      >
                        <i className="bx bx-chevron-right text-xl"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {(addbautistainventoryproductimagepreviewimages.length > 0 || (selectedbautistaproduct?.bautistainventoryproductimagepreviewimages?.length > 0)) && (
                <div className="flex gap-3 justify-center flex-wrap">
                  {(addbautistainventoryproductimagepreviewimages.length > 0 ? addbautistainventoryproductimagepreviewimages : selectedbautistaproduct?.bautistainventoryproductimagepreviewimages || []).map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        onClick={() => setbautistacurrentimageindex(index)} 
                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-200 ${bautistacurrentimageindex === index ? 'ring-2 ring-sky-500 shadow-md' : 'hover:ring-2 hover:ring-gray-300'}`} 
                      />
                      {addbautistainventoryproductimagepreviewimages.length > 0 && (
                        <button 
                          onClick={() => addbautistainventoryproductimagehandleremove(index)}   
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200"
                        > 
                          <i className="bx bx-x"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

    
   {/* Upload Button */}
              <input 
                className="hidden" 
                multiple 
                type="file" 
                accept="image/jpeg, image/jpg, image/png" 
                ref={addbautistainventoryproductimageimageinputref} 
                onChange={addbautistainventoryproductimagehandlechange}    
              />
              <div
                onDragOver={(e) => {
                  if (bautistainventoryproductimagesuploading) return;
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#60a5fa';
                  e.currentTarget.style.backgroundColor = '#eff6ff';
                  const icon = e.currentTarget.querySelector('i');
                  const primaryText = e.currentTarget.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#1c96c5';
                  if (primaryText) primaryText.style.color = '#2563eb';
                }}
                onDragLeave={(e) => {
                  if (bautistainventoryproductimagesuploading) return;
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#1c96c5';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const icon = e.currentTarget.querySelector('i');
                  const primaryText = e.currentTarget.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#9ca3af';
                  if (primaryText) primaryText.style.color = '#4b5563';
                }}
                onDrop={(e) => {
                  if (bautistainventoryproductimagesuploading) return;
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.style.borderColor = '#1c96c5';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const icon = e.currentTarget.querySelector('i');
                  const primaryText = e.currentTarget.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#9ca3af';
                  if (primaryText) primaryText.style.color = '#4b5563';
                  
                  const files = Array.from(e.dataTransfer.files);
                  const imageFiles = files.filter(file => file.type.startsWith('image/'));
                  
                  if (imageFiles.length > 0) {
                    // Create a synthetic event to pass to the existing handler
                    const syntheticEvent = {
                      target: {
                        files: imageFiles
                      }
                    };
                    addbautistainventoryproductimagehandlechange(syntheticEvent);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px dashed #1c96c5',
                  borderRadius: '1rem',
                  backgroundColor: 'transparent',
                  cursor: bautistainventoryproductimagesuploading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  opacity: bautistainventoryproductimagesuploading ? 0.7 : 1
                }}
                onClick={bautistainventoryproductimagesuploading ? undefined : addbautistainventoryproductimagehandleuploadclick}
                onMouseEnter={(e) => {
                  if (bautistainventoryproductimagesuploading) return;
                  e.target.style.borderColor = '#60a5fa';
                  e.target.style.backgroundColor = '#eff6ff';
                  const icon = e.target.querySelector('i');
                  const primaryText = e.target.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#1c96c5';
                  if (primaryText) primaryText.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  if (bautistainventoryproductimagesuploading) return;
                  e.target.style.borderColor = '#1c96c5';
                  e.target.style.backgroundColor = 'transparent';
                  const icon = e.target.querySelector('i');
                  const primaryText = e.target.querySelector('p:first-of-type');
                  if (icon) icon.style.color = '#9ca3af';
                  if (primaryText) primaryText.style.color = '#4b5563';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  {bautistainventoryproductimagesuploading ? (
                    <>
                      <div style={{ 
                        width: '2rem', 
                        height: '2rem', 
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #1c96c5',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <p style={{ color: '#1c96c5', fontWeight: '500' }}>
                        Uploading Images...
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Please wait</p>
                    </>
                  ) : (
                    <>
                      <i style={{ fontSize: '1.875rem', color: '#9ca3af', transition: 'color 0.2s ease-in-out' }} className="bx bx-cloud-upload"></i>
                      <p style={{ color: '#4b5563', fontWeight: '500', transition: 'color 0.2s ease-in-out' }}>
                        Upload Images ({addbautistainventoryproductimagepreviewimages.length}/5)
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Click to browse or drag & drop images here</p>
                    </>
                  )}
                </div>
              </div>
            </div>















            {/* Form Fields Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h3>
                

              </div>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bautistainventorycategorynamebox">
                    Category
                  </label>
                  <BautistainventorycategoryBox  
                    value={bautistainventorycategorynamebox} 
                    loading={loadingbautistainventorycategorylist} 
                    onChange={(e) => setbautistainventorycategorynamebox(e.target.value)} 
                    categories={bautistainventorycategorylist}
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addbautistainventoryproductname">
                    Product Name
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter product name..." 
                    type="text" 
                    name="addbautistainventoryproductname" 
                    id="addbautistainventoryproductname" 
                    value={addbautistainventoryproductname} 
                    onChange={(e) => setaddbautistainventoryproductname(e.target.value)} 
                    required 
                  />
                </div>

                {/* Product Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addbautistainventoryproductbrand">
                    Product Brand
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter product brand..." 
                    type="text" 
                    name="addbautistainventoryproductbrand" 
                    id="addbautistainventoryproductbrand" 
                    value={addbautistainventoryproductbrand} 
                    onChange={(e) => setaddbautistainventoryproductbrand(e.target.value)} 
                    required
                  />
                </div>

                {/* Model Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addbautistainventoryproductmodelnumber">
                    Model Number
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter model number..." 
                    type="text" 
                    name="addbautistainventoryproductmodelnumber" 
                    id="addbautistainventoryproductmodelnumber" 
                    value={addbautistainventoryproductmodelnumber} 
                    onChange={(e) => setaddbautistainventoryproductmodelnumber(e.target.value)} 
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addbautistainventoryproductdescription">
                    Product Description
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 resize-none" 
                    ref={textarearef} 
                    rows={3} 
                    style={{minHeight:'80px'}} 
                    value={addbautistainventoryproductdescription} 
                    onChange={(e) => {setaddbautistainventoryproductdescription(e.target.value); adjusttextareaheight();}} 
                    placeholder="Enter product description..."
                  />
                </div>

                {/* Price and Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addbautistainventoryproductprice">
                      Price
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                      placeholder="0.00" 
                      type="number" 
                      step="0.01"
                      name="addbautistainventoryproductprice" 
                      id="addbautistainventoryproductprice" 
                      value={addbautistainventoryproductprice} 
                      onChange={(e) => setaddbautistainventoryproductprice(e.target.value)} 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="addbautistainventoryproductquantity">
                      Quantity
                    </label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200" 
                      placeholder="0" 
                      type="number" 
                      name="addbautistainventoryproductquantity" 
                      id="addbautistainventoryproductquantity" 
                      value={addbautistainventoryproductquantity} 
                      onChange={(e) => setaddbautistainventoryproductquantity(e.target.value)} 
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

 {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end', 
            gap: '1rem', 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid #f3f4f6' 
          }}>
            {selectedbautistaproduct && (
              <>
                {(bautistaproductsoldCounts[selectedbautistaproduct.bautistainventoryproductid] ?? 0) >= 1 ? (
                  <button 
                    type="button"
                    onClick={() => {
                      if (selectedbautistaproduct.isArchived) {
                        handleUnarchiveBautistaProduct(selectedbautistaproduct);
                      } else {
                        handleArchiveBautistaProduct(selectedbautistaproduct);
                      }
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: selectedbautistaproduct.isArchived ? '#f0f9ff' : '#fef3c7',
                      color: selectedbautistaproduct.isArchived ? '#0369a1' : '#d97706',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = selectedbautistaproduct.isArchived ? '#e0f2fe' : '#fef3c7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = selectedbautistaproduct.isArchived ? '#f0f9ff' : '#fef3c7';
                    }}
                  >
                    {selectedbautistaproduct.isArchived ? 'Unarchive Product' : 'Archive Product'}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => {setshowdeletebautistaproduct(true); setselecteddeletebautistaproduct(selectedbautistaproduct);}}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '0.75rem',
                      border: 'none',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  >
                    Delete Product
                  </button>
                )}
              </>
            )}
            <button 
              type="button"
              onClick={() => {setshowaddbautistainventoryproductdialog(false); resetaddbautistainventoryproductdialog();}}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={bautistainventoryproductissubmitting} 
              style={{
                padding: '0.75rem 2rem',
                background: bautistainventoryproductissubmitting 
                  ? '#484848' 
                  : '#6AA84F',
                color: 'white',
                borderRadius: '0.75rem',
                border: 'none',
                fontWeight: '500',
                cursor: bautistainventoryproductissubmitting ? 'not-allowed' : 'pointer',
                opacity: bautistainventoryproductissubmitting ? 0.5 : 1,
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                if (!bautistainventoryproductissubmitting) {
                  e.target.style.background = '#5f9747';
                }
              }}
              onMouseLeave={(e) => {
                if (!bautistainventoryproductissubmitting) {
                  e.target.style.background = '#6AA84F';
                }
              }}
            >
              {bautistainventoryproductissubmitting 
                ? (selectedbautistaproduct ? "Updating..." : "Adding...") 
                : (selectedbautistaproduct ? "Update Product" : "Add Product")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}



{showdeletebautistaproduct && (
<div className="flex justify-center items-center z-50 fixed inset-0 bg-black/50">
<div className="bg-white shadow-xl border border-gray-100 rounded-3xl w-[500px] p-8 animate-fadeInUp">
<div className="flex justify-between items-center w-full mb-6">
<div className="flex items-center space-x-4">
<div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
<i className="bx bxs-trash text-white text-xl"></i>
</div>
<div>
<h2 className="text-2xl font-bold text-gray-900">Delete Bautista Eye Center Product</h2>
</div>
</div>
<div 
onClick={() => setshowdeletebautistaproduct(false)} 
className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
>
<i className="bx bx-x text-gray-600 text-xl"/>
</div>
</div>

<div className="text-center">
<p className="text-gray-700 mb-6">
Are you sure you want to delete this product?
</p>

{selecteddeletebautistaproduct && (
<div className="bg-gray-50 p-4 rounded-xl mb-6">
<p className="font-medium text-gray-800">Product Name: {selecteddeletebautistaproduct.bautistainventoryproductname}</p>
</div>
)}

<div className="flex gap-3">
<button
  onClick={() => setshowdeletebautistaproduct(false)}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
>
  Cancel
</button>

{selectedbautistaproduct && (
<button
  onClick={deletebautistaproduct}
  style={{
    flex: 1,
    padding: "12px 24px",
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    fontWeight: 500,
    transition: "background-color 0.2s ease-in-out",
    cursor: "pointer",
  }}
  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
>
  Delete Product
</button>
)}
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

  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      <i className="bx bxs-receipt text-[#184d85] text-[25px] mr-2"/> 
      <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Billings and Orders</h1>
    </div>
    
    {/* Refresh Button */}
    <div className="flex space-x-3">
      <div
        onClick={refreshBillingOrdersData}
        disabled={loadingAmbherOrders || loadingBautistaOrders}
        className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${(loadingAmbherOrders || loadingBautistaOrders) ? 'animate-spin' : ''}`} />
        {(loadingAmbherOrders || loadingBautistaOrders) ? 'Refreshing...' : 'Refresh'}
      </div>
    </div>
  </div>
  
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
 <div className="ml-2 w-full flex  items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input value={searchambherTerm} onChange={(e) => {
   setambherSearchTerm(e.target.value);
   setAmbherCurrentPage(1);
 }} type="text" placeholder="Enter product name..."   className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
 <div className="mt-5 ml-2 w-full flex justify-between items-center font-semibold text-[#383838] font-albertsans ">
  <div className="flex items-center">
  <i className="bx bx-filter mr-2 text-[20px]"/>
 <h1 className="text-[15px] mr-8">Filter by status </h1>
 <div className="gap-2 flex">
 {['All', 'Pending', 'Ready for Pickup', 'Completed'].map((status) => {
   const statusCount = status === 'All' ? ambherorders.length : ambherorders.filter(order => order.patientorderambherstatus === status).length;
   
   return (
     <div key={status} onClick={() => {
       setambherFilter(status);
       setAmbherCurrentPage(1);
     }} className={`border-1 cursor-pointer transition-all duration-300 ease-in-out py-2 px-5 rounded-md text-[14px] ${ambherfilter === status ? 'bg-[#2781af] text-white' : 'hover:bg-[#2781af] hover:text-white'}`}>
       {status} <span className="bg-gray-200 text-gray-500 font-semibold px-2 rounded-full ml-2 text-sm">{statusCount}</span>
     </div>
   );
 })}
 </div>
 </div>
 <div className="flex justify-end items-center w-auto h-[9%] rounded-2xl mb-2 mt-3"> <div onClick={() => setshowpatientorderambher(true)}  className="w-50 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center  items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx  bx-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Set Order</p></div> </div>

 </div>
  {/* Pagination for Ambher Orders */}
  {Math.ceil(filteredambherOrders.length / ORDERS_PER_PAGE) > 1 && (
    <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-600 font-albertsans">
        Page {ambherCurrentPage} of {Math.ceil(filteredambherOrders.length / ORDERS_PER_PAGE)}
      </div>
      <div className="flex items-center gap-2">
        <div
          onClick={() => setAmbherCurrentPage(prev => Math.max(1, prev - 1))}
          className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 transition-colors ${
            ambherCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </div>
        
        {/* Page Numbers */}
        <div className="cursor-pointer flex items-center gap-1">
          {Array.from({ length: Math.ceil(filteredambherOrders.length / ORDERS_PER_PAGE) }, (_, i) => i + 1)
            .filter(page => {
              const current = ambherCurrentPage;
              return page === 1 || page === Math.ceil(filteredambherOrders.length / ORDERS_PER_PAGE) || 
                     (page >= current - 1 && page <= current + 1);
            })
            .map((page, index, array) => {
              const showEllipsis = index > 0 && array[index - 1] !== page - 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                  <div
                    onClick={() => setAmbherCurrentPage(page)}
                    className={`cursor-pointer px-3 py-1 rounded-md text-sm font-albertsans transition-colors ${
                      page === ambherCurrentPage
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
          onClick={() => setAmbherCurrentPage(prev => Math.min(Math.ceil(filteredambherOrders.length / ORDERS_PER_PAGE), prev + 1))}
          className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 transition-colors ${
            ambherCurrentPage === Math.ceil(filteredambherOrders.length / ORDERS_PER_PAGE) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </div>
      </div>
    </div>
  )}


 <div className=" w-full h-auto mt-5">
{loadingAmbherOrders ? (
<OrderListSkeleton />
) : filteredambherOrders.length === 0 ? (
<div className="text-gray-500 p-4">No orders found</div>
) : (
paginatedAmbherOrders.map((order) => (
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
      order.patientorderambherstatus === 'Ready for Pickup' ? 'bg-sky-100 text-sky-800' :
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
             <div className="  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                            <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bxs-receipt text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Set Order
            </h2>
            <p className="text-sm text-gray-500">Review and set order for customers</p>
          </div>
        </div>
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
                       setshowpatientorderambher(false);}} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"><i className="bx bx-x text-gray-600 text-xl "/></div>
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

{pdfToast && (
<div className=" bottom-4 right-8  z-101   transform fixed " >
    <div key={pdfIsClicked ? 'success' : 'error'}  className={` ${pdfToastClosing ? 'motion-translate-x-out-100 motion-duration-[3s]  motion-ease-spring-smooth' : 'motion-preset-slide-left'}  flex items-center bg-white   rounded-md shadow-lg text-gray-900 font-semibold px-6 py-3`} >
      {pdfIsClicked ? (          
         <span className="text-green-800 font-semibold text-[20px]"><i className="mr-2 bx bx-check-circle "></i></span>
      ) : (
        <span className="text-red-800 font-semibold text-[20px]"><i className="mr-2 bx bx-x-circle "></i></span>
      )}
      {pdfToastMessage}

      <div  className={`rounded-b-2xl absolute bottom-0 left-0 h-1 ${pdfIsClicked ? 'bg-green-500' : 'bg-red-500'} `}  style={{width: pdfProgressWidth,transition: 'width 4s linear' }}/>

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
 <div className="ml-2 w-full flex  items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input value={searchbautistaTerm} onChange={(e) => {
   setbautistaSearchTerm(e.target.value);
   setBautistaCurrentPage(1);
 }} type="text" placeholder="Enter product name..."   className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl  bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
 <div className="mt-5 ml-2 w-full flex justify-between items-center font-semibold text-[#383838] font-albertsans ">
  <div className="flex items-center">
  <i className="bx bx-filter mr-2 text-[20px]"/>
 <h1 className="text-[15px] mr-8">Filter by status </h1>
 <div className="gap-2 flex">
 {['All', 'Pending', 'Ready for Pickup', 'Completed'].map((status) => {
   const statusCount = status === 'All' ? bautistaorders.length : bautistaorders.filter(order => order.patientorderbautistastatus === status).length;
   
   return (
     <div key={status} onClick={() => {
       setbautistaFilter(status);
       setBautistaCurrentPage(1);
     }} className={`border-1 cursor-pointer transition-all duration-300 ease-in-out py-2 px-5 rounded-md text-[14px] ${bautistafilter === status ? 'bg-[#2781af] text-white' : 'hover:bg-[#2781af] hover:text-white'}`}>
       {status} <span className="bg-gray-200 text-gray-500 font-semibold px-2 rounded-full ml-2 text-sm">{statusCount}</span>
     </div>
   );
 })}
 </div>
 </div>
 <div className="flex justify-end items-center w-auto h-[9%] rounded-2xl mb-2 mt-3"> <div onClick={() => setshowpatientorderbautista(true)}  className="w-50 p-2 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center  items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx  bx-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Set Order</p></div> </div>

 </div>
  {/* Pagination for Bautista Orders */}
  {Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) > 1 && (
    <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-gray-200">
      <div className="text-sm text-gray-600 font-albertsans">
        Page {bautistaCurrentPage} of {Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE)}
      </div>
      <div className="flex items-center gap-2">
        <div
          onClick={() => setBautistaCurrentPage(prev => Math.max(1, prev - 1))}
          className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 transition-colors ${
            bautistaCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </div>
        
        {/* Page Numbers */}
        <div className="cursor-pointer flex items-center gap-1">
          {Array.from({ length: Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) }, (_, i) => i + 1)
            .filter(page => {
              const current = bautistaCurrentPage;
              return page === 1 || page === Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) || 
                     (page >= current - 1 && page <= current + 1);
            })
            .map((page, index, array) => {
              const showEllipsis = index > 0 && array[index - 1] !== page - 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                  <div
                    onClick={() => setBautistaCurrentPage(page)}
                    className={`cursor-pointer px-3 py-1 rounded-md text-sm font-albertsans transition-colors ${
                      page === bautistaCurrentPage
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
          onClick={() => setBautistaCurrentPage(prev => Math.min(Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE), prev + 1))}
          className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 transition-colors ${
            bautistaCurrentPage === Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </div>
      </div>
    </div>
  )} 

 <div className=" w-full h-auto mt-5">
{loadingBautistaOrders ? (
<OrderListSkeleton />
) : filteredbautistaOrders.length === 0 ? (
<div className="text-gray-500 p-4">No orders found</div>
) : (
paginatedBautistaOrders.map((order) => (
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
      order.patientorderbautistastatus === 'Ready for Pickup' ? 'bg-sky-100 text-sky-800' :
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
             <div className="  h-auto min-h-180  mb-7 mt-7 pl-5 pr-5 bg-white rounded-2xl w-full  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                            <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <i className="bx bxs-receipt text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Set Order
            </h2>
            <p className="text-sm text-gray-500">Review and set order for customers</p>
          </div>
          </div>
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
                       setshowpatientorderbautista(false);}} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"><i className="bx bx-x text-gray-600 text-xl "/></div>
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
     
      {/* Pagination for Bautista Orders */}
      {Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) > 1 && (
        <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 font-albertsans">
            Page {bautistaCurrentPage} of {Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE)}
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() => setBautistaCurrentPage(prev => Math.max(1, prev - 1))}
              className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 transition-colors ${
                bautistaCurrentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </div>
            
            {/* Page Numbers */}
            <div className="cursor-pointer flex items-center gap-1">
              {Array.from({ length: Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) }, (_, i) => i + 1)
                .filter(page => {
                  const current = bautistaCurrentPage;
                  return page === 1 || page === Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) || 
                         (page >= current - 1 && page <= current + 1);
                })
                .map((page, index, array) => {
                  const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                      <div
                        onClick={() => setBautistaCurrentPage(page)}
                        className={`cursor-pointer px-3 py-1 rounded-md text-sm font-albertsans transition-colors ${
                          page === bautistaCurrentPage
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
              onClick={() => setBautistaCurrentPage(prev => Math.min(Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE), prev + 1))}
              className={`cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 transition-colors ${
                bautistaCurrentPage === Math.ceil(filteredbautistaOrders.length / ORDERS_PER_PAGE) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
            </div>
          </div>
        </div>
      )}
     



                        
                


                  </div>
             </div>
     


  )}


</div> )}



            {/* View Order Details Modal */}
{showViewOrderModal && selectedOrderForView && (
  <div className="fixed inset-0 bg-[#000000b1] flex items-center justify-center z-99999 p-4">
    <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
      <div className="sticky z-99 top-0 bg-white border-b px-8 py-6 flex justify-between items-center rounded-t-2xl">
        <div className="flex justify-center items-center">
          <img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all p-1" />
          <h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Billing Details</h1>
        </div>
        <div className="flex items-center justify-center gap-7">
          {(() => {
            const orderStatus = selectedOrderForView.patientorderambherid 
              ? selectedOrderForView.patientorderambherstatus 
              : selectedOrderForView.patientorderbautistastatus;
            
            return orderStatus === 'Completed' && (
              <div
                onClick={() => exportBillingToPDF(selectedOrderForView)}
                className="cursor-pointer bg-[#184d85] hover:bg-[#0f3a6b] text-white px-5 py-3 rounded-lg font-medium font-albertsans transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <i className="bx bx-download text-lg"></i>
                Export PDF
              </div>
            );
          })()}
          <div 
            onClick={closeViewOrderModal}
            className="cursor-pointer text-gray-500 hover:text-gray-700 text-[50px]"
          >
            ×
          </div>
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
                          index === viewOrderCurrentImageIndex ? 'border-sky-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'
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
                          onClick={!isMarkingOrderComplete ? markOrderAsComplete : undefined}
                          className={`w-full p-2 rounded-2xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out ${
                            isMarkingOrderComplete 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-[#4ca22b] hover:cursor-pointer hover:scale-103'
                          }`}
                        >
                          {isMarkingOrderComplete ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              <p className="font-bold font-albertsans text-white text-[18px]">Processing...</p>
                            </>
                          ) : (
                            <p className="font-bold font-albertsans text-white text-[18px] ml-2">Complete Order</p>
                          )}
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
                                    className="w-full h-10 sm:h-12 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[50%] text-sm sm:text-base"
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





{/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} 
{/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} 
{/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} 
{/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} 
{/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} 
{/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} {/*Start of Reports and Analytics*/} 


 { (activedashboard === 'reportsandanalytics') && ( 
   <div id="reportsandanalytics" className="flex flex-col pl-5 pr-5 pb-3 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] min-h-full h-auto rounded-2xl">  

     <div className="flex items-center justify-between mb-6">
       <div className="flex items-center">
         <i className="bx bxs-report text-[#184d85] text-[25px] mr-2"/>
         <h1 className="font-albertsans font-bold text-[#184d85] text-[25px]">Reports and Analytics</h1>
       </div>
       
       {/* Export and Refresh Buttons */}
       <div className="flex space-x-3">
 
        <div 
          onClick={generateReportsPDF}
          className="flex items-center px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-all duration-200 font-albertsans cursor-pointer"
        >
           <Download className="w-4 h-4 mr-2" />
           Export PDF
         </div>
       
         <div
           onClick={refreshReportsData}
           disabled={reportsData.loading}
           className="cursor-pointer flex items-center px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-albertsans"
         >
           <RefreshCw className={`w-4 h-4 mr-2 ${reportsData.loading ? 'animate-spin' : ''}`} />
           {reportsData.loading ? 'Refreshing...' : 'Refresh'}
         </div>
       </div>
     </div>



     {reportsData.loading ? (
       <div className="flex items-center justify-center h-64">
         <div className="flex flex-col items-center">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#184d85]"></div>
           <p className="mt-4 text-gray-600 font-albertsans">Loading reports data...</p>
         </div>
       </div>
     ) : reportsData.error ? (
       <div className="text-center py-8">
         <i className="bx bx-error text-red-500 text-4xl mb-4"></i>
         <p className="text-red-600 font-albertsans">{reportsData.error}</p>
         <button
           onClick={fetchReportsData}
           className="mt-4 px-4 py-2 bg-[#184d85] text-white rounded-lg hover:bg-blue-700 transition-colors font-albertsans"
         >
           Retry
         </button>
       </div>
     ) : (
       <>
         {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-sky-700 text-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-blue-100 text-sm font-albertsans">Total Orders</p>
                 <p className="text-3xl font-bold font-albertsans">{calculateMetrics().totalOrders}</p>
               </div>
               <i className="bx bx-shopping-bag text-3xl text-blue-200"></i>
             </div>
           </div>
           
           <div className="bg-[#44624a] text-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-green-100 text-sm font-albertsans">Total Revenue</p>
                 <p className="text-3xl font-bold font-albertsans">₱{calculateMetrics().totalRevenue.toLocaleString()}</p>
               </div>
               <i className="bx bx-money text-3xl text-green-200"></i>
             </div>
           </div>
           
           <div className="bg-[#626c92] text-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sky-100 text-sm font-albertsans">Appointments</p>
                 <p className="text-3xl font-bold font-albertsans">{calculateMetrics().totalAppointments}</p>
               </div>
               <i className="bx bx-calendar text-3xl text-sky-200"></i>
             </div>
           </div>
           
           <div className="bg-[#e59400] text-white rounded-xl p-6 shadow-lg">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-orange-100 text-sm font-albertsans">Completed Orders</p>
                 <p className="text-3xl font-bold font-albertsans">{calculateMetrics().completedOrders}</p>
               </div>
               <i className="bx bx-check-circle text-3xl text-orange-200"></i>
             </div>
           </div>
         </div>
         
         {/* Charts Section - Optimized with Memoized Data */}
         <div className="mb-8">

           
           {/* Revenue by Month */}
           <InteractiveRevenueChart 
             revenueData={filteredChartsData?.revenueByMonth || []} 
             rawOrderData={[
               ...(Array.isArray(reportsData.ambherOrders) ? reportsData.ambherOrders : []),
               ...(Array.isArray(reportsData.bautistaOrders) ? reportsData.bautistaOrders : [])
             ]}
             rawAppointmentData={Array.isArray(reportsData.appointments) ? reportsData.appointments : []}
             isAmbherOnlyUser={isAmbherOnlyUser}
             isBautistaOnlyUser={isBautistaOnlyUser}
             currentuserloggedin={currentuserloggedin}
             getFilterDisplayText={getFilterDisplayText}
           />
         </div>


         {/* Interactive Appointment Trends Chart */}
         <div className="mb-8">
           <InteractiveAppointmentChart 
             appointmentsData={filteredChartsData?.dailyAppointments || []} 
             isAmbherOnlyUser={isAmbherOnlyUser}
             isBautistaOnlyUser={isBautistaOnlyUser}
             currentuserloggedin={currentuserloggedin}
             getFilterDisplayText={getFilterDisplayText}
           />
         </div>


         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           {/* Sales by Category - Radar Chart */}
           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <div className="flex items-center gap-2">
                   <PieChartIcon className="h-5 w-5 text-[#184d85]" />
                   <h3 className="text-xl font-bold text-gray-800 font-albertsans">
                     {getResponsiveTitle('Sales by Category', salesCategoryFilter, salesCategoryYear)}
                   </h3>
                 </div>
                 <p className="text-sm text-gray-600 font-albertsans">
                   Product category distribution for {getFilterDisplayText(salesCategoryFilter, salesCategoryYear).toLowerCase()}
                 </p>
               </div>
               <div className="flex items-center gap-2">
                 <select
                   value={salesCategoryFilter}
                   onChange={(e) => setSalesCategoryFilter(e.target.value)}
                   className="w-[140px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
                   aria-label="Select date range for sales by category"
                 >
                   <option value="thisWeek">This Week</option>
                   <option value="thisMonth">This Month</option>
                   <option value="thisYear">This Year</option>
                   <option value="lastMonth">Last Month</option>
                   <option value="last3Months">Last 3 Months</option>
                   <option value="lastYear">Last Year</option>
                 </select>
                 {salesCategoryFilter === 'lastYear' && (
                   <select
                     value={salesCategoryYear}
                     onChange={(e) => setSalesCategoryYear(parseInt(e.target.value))}
                     className="w-[100px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
                     aria-label="Select year for sales by category"
                   >
                     {getAvailableYears().map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                 )}
               </div>
             </div>
             {filteredSalesByCategory?.length > 0 ? (() => {
               // Dynamic color theme based on user clinic
               const getChartColor = () => {
                 if (isAmbherOnlyUser()) {
                   return "#DC2626"; // Red for Ambher Optical
                 } else if (isBautistaOnlyUser()) {
                   return "#DC2626"; // Red for Bautista Eye Center
                 } else {
                   return "#DC2626"; // Red for Admin
                 }
               };
               
               const chartColor = getChartColor();
               
               return (
                 <div className="pb-0">
                   <ResponsiveContainer width="100%" height={300}>
                     <RadarChart data={filteredSalesByCategory}>
                       <Tooltip 
                         cursor={false}
                         content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                             return (
                               <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                 <p className="font-semibold text-gray-800 font-albertsans">
                                   {payload[0].payload.category}
                                 </p>
                                 <p className="text-sm text-gray-600 font-albertsans">
                                   Quantity: {payload[0].value}
                                 </p>
                               </div>
                             );
                           }
                           return null;
                         }}
                       />
                       <PolarAngleAxis dataKey="category" className="text-sm font-albertsans" />
                       <PolarGrid />
                       <Radar
                         dataKey="quantity"
                         fill={chartColor}
                         fillOpacity={0.6}
                         stroke={chartColor}
                         strokeWidth={2}
                         dot={{
                           r: 4,
                           fillOpacity: 1,
                           fill: chartColor
                         }}
                       />
                     </RadarChart>
                   </ResponsiveContainer>
                 </div>
               );
             })() : (
               <div className="flex items-center justify-center h-[300px] text-gray-500">
                 <div className="text-center">
                   <i className="bx bx-pie-chart-alt-2 text-4xl mb-2"></i>
                   <p className="font-albertsans">No sales category data available</p>
                   <p className="text-sm text-gray-400 font-albertsans mt-1">
                     for {getFilterDisplayText(salesCategoryFilter, salesCategoryYear).toLowerCase()}
                   </p>
                 </div>
               </div>
             )}
             {filteredSalesByCategory?.length > 0 && (() => {
               const getClinicInfo = () => {
                 if (isAmbherOnlyUser()) {
                   return { name: "Ambher Optical", icon: "bx-leaf", color: "text-green-600" };
                 } else if (isBautistaOnlyUser()) {
                   return { name: "Bautista Eye Center", icon: "bx-buildings", color: "text-blue-900" };
                 } else {
                   return { name: "All Clinics", icon: "bx-trending-up", color: "text-blue-600" };
                 }
               };
               
               const clinicInfo = getClinicInfo();
               
               return (
                 <div className="flex-col gap-2 text-sm mt-4 pt-4 border-t border-gray-200">
                   <div className="flex items-center gap-2 leading-none font-medium text-gray-700 font-albertsans">
                     <i className={`bx ${clinicInfo.icon} text-lg ${clinicInfo.color}`}></i>
                     Category distribution - {clinicInfo.name}
                   </div>
                   <div className="text-gray-500 flex items-center gap-2 leading-none font-albertsans text-xs mt-1">
                     Based on current product orders
                   </div>
                 </div>
               );
             })()}
           </div>

           {/* Order Status Distribution */}
           <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <div className="flex items-center gap-2">
                   <Target className="h-5 w-5 text-[#184d85]" />
                   <h3 className="text-xl font-bold text-gray-800 font-albertsans">
                     {getResponsiveTitle('Order Status Distribution', orderStatusFilter, orderStatusYear)}
                   </h3>
                 </div>
                 <p className="text-sm text-gray-600 font-albertsans">
                   Order status breakdown for {getFilterDisplayText(orderStatusFilter, orderStatusYear).toLowerCase()}
                 </p>
               </div>
               <div className="flex items-center gap-2">
                 <select
                   value={orderStatusFilter}
                   onChange={(e) => setOrderStatusFilter(e.target.value)}
                   className="w-[140px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
                   aria-label="Select date range for order status"
                 >
                   <option value="thisWeek">This Week</option>
                   <option value="thisMonth">This Month</option>
                   <option value="thisYear">This Year</option>
                   <option value="lastMonth">Last Month</option>
                   <option value="last3Months">Last 3 Months</option>
                   <option value="lastYear">Last Year</option>
                 </select>
                 {orderStatusFilter === 'lastYear' && (
                   <select
                     value={orderStatusYear}
                     onChange={(e) => setOrderStatusYear(parseInt(e.target.value))}
                     className="w-[100px] rounded-lg px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent font-albertsans"
                     aria-label="Select year for order status"
                   >
                     {getAvailableYears().map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                 )}
               </div>
             </div>
             {filteredOrderStatusDistribution?.length > 0 ? (
               <div className="pb-0">
                 <ResponsiveContainer width="100%" height={300}>
                   <PieChart>
                     <Pie
                       data={filteredOrderStatusDistribution}
                       cx="50%"
                       cy="50%"
                       outerRadius={100}
                       fill="#8884d8"
                       dataKey="value"
                       label={({ status, value }) => `${status}: ${value}`}
                     >
                       {filteredOrderStatusDistribution.map((entry, index) => {
                         // Map status to corresponding colors
                         const getStatusColor = (status) => {
                           switch (status.toLowerCase()) {
                             case 'pending':
                               return '#ffae19'; // Orange
                             case 'ready for pickup':
                               return '#3D85C6'; // Purple
                             case 'completed':
                               return '#6aa84f'; // Dark Green
                             default:
                               return CHART_COLORS[index % CHART_COLORS.length];
                           }
                         };
                         
                         return (
                           <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                         );
                       })}
                     </Pie>
                     <Tooltip />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             ) : (
               <div className="flex items-center justify-center h-[300px] text-gray-500">
                 <div className="text-center">
                   <i className="bx bx-pie-chart-alt-2 text-4xl mb-2"></i>
                   <p className="font-albertsans">No order status data available</p>
                   <p className="text-sm text-gray-400 font-albertsans mt-1">
                     for {getFilterDisplayText(orderStatusFilter, orderStatusYear).toLowerCase()}
                   </p>
                 </div>
               </div>
             )}
             {filteredOrderStatusDistribution?.length > 0 && (() => {
               const getClinicInfo = () => {
                 if (isAmbherOnlyUser()) {
                   return { name: "Ambher Optical", icon: "bx-leaf", color: "text-green-600" };
                 } else if (isBautistaOnlyUser()) {
                   return { name: "Bautista Eye Center", icon: "bx-buildings", color: "text-blue-900" };
                 } else {
                   return { name: "All Clinics", icon: "bx-trending-up", color: "text-blue-600" };
                 }
               };
               
               const clinicInfo = getClinicInfo();
               
               return (
                 <div className="flex-col gap-2 text-sm mt-4 pt-4 border-t border-gray-200">
                   <div className="flex items-center gap-2 leading-none font-medium text-gray-700 font-albertsans">
                     <i className={`bx ${clinicInfo.icon} text-lg ${clinicInfo.color}`}></i>
                     Order status distribution - {clinicInfo.name}
                   </div>
                   <div className="text-gray-500 flex items-center gap-2 leading-none font-albertsans text-xs mt-1">
                     Based on current order status
                   </div>
                 </div>
               );
             })()}
           </div>
         </div>

         {/* Top Products */}
         <TopProductsChart 
           data={filteredTopProducts} 
           filter={topProductsFilter}
           year={topProductsYear}
           onFilterChange={setTopProductsFilter}
           onYearChange={setTopProductsYear}
           getAvailableYears={getAvailableYears}
           getResponsiveTitle={getResponsiveTitle}
           getFilterDisplayText={getFilterDisplayText}
         />

         {/* Recent Orders Table */}
         <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-[#184d85]" />
               <h3 className="text-xl font-bold text-gray-800 font-albertsans">
                 Recent Orders {paginatedRecentOrders.totalPages > 1 ? `(Page ${paginatedRecentOrders.currentPage} of ${paginatedRecentOrders.totalPages})` : ''}
               </h3>
             </div>
             <div className="text-sm text-gray-600 font-albertsans">
               Showing {paginatedRecentOrders.orders.length} of {paginatedRecentOrders.totalOrders} orders
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-gray-600">
               <thead>
                 <tr className="border-b">
                   <th className="text-left py-3 px-4 font-semibold text-gray-800 font-albertsans">Order ID</th>
                   <th className="text-left py-3 px-4 font-semibold text-gray-800 font-albertsans">Customer</th>
                   <th className="text-left py-3 px-4 font-semibold text-gray-800 font-albertsans">Product</th>
                   <th className="text-left py-3 px-4 font-semibold text-gray-800 font-albertsans">Status</th>
                   <th className="text-left py-3 px-4 font-semibold text-gray-800 font-albertsans">Total</th>
                   <th className="text-left py-3 px-4 font-semibold text-gray-800 font-albertsans">Date</th>
                 </tr>
               </thead>
               <tbody>
                 {paginatedRecentOrders.orders.map((order, index) => (
                   <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                     <td className="py-3 px-4 font-albertsans">
                       #{order.patientorderambherid || order.patientorderbautistaid}
                     </td>
                     <td className="py-3 px-4 font-albertsans">
                       {order.patientfirstname} {order.patientlastname}
                     </td>
                     <td className="py-3 px-4 font-albertsans">
                       {order.patientorderambherproductname || order.patientorderbautistaproductname}
                     </td>
                     <td className="py-3 px-4">
                       <span className={`px-2 py-1 rounded-full text-xs font-semibold font-albertsans ${
                         (order.patientorderambherstatus === 'Completed' || order.patientorderbautistastatus === 'Completed')
                           ? 'bg-green-100 text-green-800'
                           : (order.patientorderambherstatus === 'Pending' || order.patientorderbautistastatus === 'Pending')
                           ? 'bg-yellow-100 text-yellow-800'
                           : (order.patientorderambherstatus === 'Ready for Pickup' || order.patientorderbautistastatus === 'Ready for Pickup')
                           ? 'bg-blue-100 text-blue-800'
                           : 'bg-red-100 text-red-800'
                       }`}>
                         {order.patientorderambherstatus || order.patientorderbautistastatus}
                       </span>
                     </td>
                     <td className="py-3 px-4 font-semibold text-green-600 font-albertsans">
                       ₱{(order.patientorderambherproducttotal || order.patientorderbautistaproducttotal || 0).toLocaleString()}
                     </td>
                     <td className="py-3 px-4 font-albertsans">
                       {new Date(order.createdAt).toLocaleDateString()}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           
           {/* Pagination Controls */}
           {paginatedRecentOrders.totalPages > 1 && (
             <div className="flex items-center justify-start gap-5 mt-4 pt-4 border-t border-gray-200">
               <div className="text-sm text-gray-600 font-albertsans">
                 Page {paginatedRecentOrders.currentPage} of {paginatedRecentOrders.totalPages}
               </div>
               <div className="flex items-center gap-2">
                 <div
                   onClick={() => setRecentOrdersCurrentPage(prev => Math.max(1, prev - 1))}
                   disabled={paginatedRecentOrders.currentPage === 1}
                   className="cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Previous
                 </div>
                 
                 {/* Page Numbers */}
                 <div className="cursor-pointer flex items-center gap-1">
                   {Array.from({ length: paginatedRecentOrders.totalPages }, (_, i) => i + 1)
                     .filter(page => {
                       const current = paginatedRecentOrders.currentPage;
                       return page === 1 || page === paginatedRecentOrders.totalPages || 
                              (page >= current - 1 && page <= current + 1);
                     })
                     .map((page, index, array) => {
                       const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                       return (
                         <React.Fragment key={page}>
                           {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                           <div
                             onClick={() => setRecentOrdersCurrentPage(page)}
                             className={`cursor-pointer px-3 py-1 rounded-md text-sm font-albertsans transition-colors ${
                               page === paginatedRecentOrders.currentPage
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
                   onClick={() => setRecentOrdersCurrentPage(prev => Math.min(paginatedRecentOrders.totalPages, prev + 1))}
                   disabled={paginatedRecentOrders.currentPage === paginatedRecentOrders.totalPages}
                   className="cursor-pointer px-3 py-1 border border-gray-300 rounded-md text-sm font-albertsans bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Next
                 </div>
               </div>
             </div>
           )}
         </div>
       </>
     )}
       
   </div> 
 )}


{/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} 
{/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} 
{/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} 
{/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} 
{/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} 
{/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} {/*End of Reports and Analytics*/} 









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



{/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} 
{/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} 
{/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} 
{/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} 
{/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} {/*End of SMS Monitoring*/} 








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
              <i className="bx bx-loader-alt bx-spin text-sky-500 mr-2"></i>
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-3"></div>
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
                  className="mt-3 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
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
                            className="flex-1 bg-sky-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 h-20 resize-none"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
          className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 h-20 resize-none"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500"
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
          className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
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
            className="flex-1 bg-sky-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
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

