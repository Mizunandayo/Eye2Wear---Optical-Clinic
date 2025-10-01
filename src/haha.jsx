


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





































































































































































