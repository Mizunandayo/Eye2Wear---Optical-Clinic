


{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 
{/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} {/*Start of Account Management*/} 

{ (activedashboard === 'accountmanagement' || isAdminRole) && ( <div id="accountmanagement" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   

  <div className="flex items-center"><i className="bx bxs-user-account text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Account Management</h1></div>
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
   { (activeaccounttable === 'patientaccounttable' && !isAdminRole) && ( <div id="patientaccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

        <div className=" mt-5  w-full h-[60px] flex justify-between gap-10 rounded-3xl pl-5 pr-5">              
        <div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter patient name..." value={searchpatients} onChange={(e) => {setsearchpatients(e.target.value); filterpatientaccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
        <div onClick={() => setshowaddpatientdialog(true)}  className="w-70 mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center px-5 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Patient</p></div>
        </div>

        <div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
         {renderpatientaccounts()}
        </div>

        
        {/*Add Patient Dialog*/}
           {showaddpatientdialog && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
                  <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                    <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Patient Account</h1></div>
                    <div onClick={() => {setshowaddpatientdialog(false),   setmessage('') }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                  </div>

            <form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={handlesubmit}>
                  <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
                    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
                      <div className=" w-fit h-fit">
                        <img className=" object-cover h-90  w-90 rounded-full" src={previewimage || defaultprofilepic}/>
                      
                        <input  className="hidden" type="file" onChange={handleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={imageinputref} />
                        <div onClick={handleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                              
                        {selectedprofile && (<div onClick={handleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
                        </div>
                    </div>

                    <div className="w-full h-full  rounded-2xl">
                          <div className=" w-full h-full rounded-4xl">
                    
                    

                          <div className="registration-container">
                       
                          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
                          {message.text && (
                            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
                              {message.text}
                            </div>
                          )}
                    
                          <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create patient account!</h1>
                    
                    
                    
                    
                          <div className="form-group mt-10  flex">
                          <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
                          <div className="flex flex-col">
                          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="patientemail" id="patientemail" value={formdata.patientemail} onChange={handlechange} required/>
                          {checkemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
                          {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
                          {emailerror && emailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                       
                          </div>
                          </div>
                    
                    
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="passwrd">Password : </label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="patientpassword" id="patientpassword" value={formdata.patientpassword} onChange={handlechange} required min="6"/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="lastname">Last Name :</label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="patientlastname" id="patientlastname" value={formdata.patientlastname} onChange={handlechange} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="firstname">First Name :</label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="patientfirstname" id="patientfirstname" value={formdata.patientfirstname} onChange={handlechange} required/></div>
                    
                          <div className="form-group mt-5">
                          <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="middlename">Middle Name :</label>
                          <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="patientmiddlename" id="patientmiddlename" value={formdata.patientmiddlename} onChange={handlechange} required/></div>
                          
                    
                         
                       
                          <button type="submit" disabled={issubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
                            {issubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </button>
                       

                    
                    
                          </div>
                  
                    
                    
                          </div>

                    </div>
                  </div>
                  </form>
             </div>
           </div>
        )}






        {showdeletepatientdialog && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
             <form className="flex flex-col  w-full h-fit " onSubmit={handlesubmit}>

                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Patient Account</h1></div>
                <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this patient account?</p>
                    {selectedpatientaccount && ( <>
                              <p className="text-[16px] mt-3">Patient Id: {selectedpatientaccount.id}</p>
                              <p className="text-[16px]">Patient Name: {selectedpatientaccount.name}</p> </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeletepatientdialog(false); setselectedpatientaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
                        isdeletingpatient 
                          ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
                          : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
                      }`} onClick={isdeletingpatient ? undefined : deletepatientaccount}>
                        <p className="text-[#ffffff] flex items-center">
                          {isdeletingpatient ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Deleting...
                            </>
                          ) : (
                            'Delete'
                          )}
                        </p>
                      </div>
                    </div>
                </div>

             </form>
             </div>
           </div>
        )}




         {showviewpatientdialog && (
            <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
              <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
                   <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                     <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Patient Account</h1></div>
                     <div onClick={() => {setshowviewpatientdialog(false);
                                          setselectededitpatientaccount(null);
                                          setformdata({
                                            role: 'Patient',
                                            patientemail: '',

                                            patientlastname: '',
                                            patientfirstname: '',
                                            patientmiddlename: '',
                                            patientprofilepicture: ''
                                          });
                                          setpreviewimage(null);
                     }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                   </div>

              <form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={updatepatientaccount}>
                   <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
                      <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
                        <div className=" w-fit h-fit">
                         <img className=" object-cover h-90  w-90 rounded-full" src={previewimage || defaultprofilepic}/>
                        
                          <input  className="hidden" type="file" onChange={handleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={imageinputref} />
                          <div onClick={handleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                                                 
                          {selectedprofile && (<div onClick={handleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
                         </div>
                     </div>
     
                      <div className="w-full h-full  rounded-2xl">
                            <div className=" w-full h-full rounded-4xl">
                                       
                                       
                   
                            <div className="registration-container">
                        
                            <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
                            {message.text && (
                              <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
                                {message.text}
                              </div>
                            )}
                                       
                           <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                                       
                                       
                                       
                                       
                           <div className="form-group mt-10  flex">
                           <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
                            <div className="flex flex-col">
                            <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="patientemail" id="patientemail" value={formdata.patientemail} onChange={handlechange} required/>
                                {checkemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
                                {emailerror && !emailexist && !emailcharacters.test(formdata.patientemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
                                 {emailerror && emailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                                          
                           </div>
                            </div>
                                       
                                       
 
                           <div className="form-group mt-5">
                           <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="lastname">Last Name :</label>
                           <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="patientlastname" id="patientlastname" value={formdata.patientlastname} onChange={handlechange} required/></div>
                                       
                           <div className="form-group mt-5">
                           <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="firstname">First Name :</label>
                           <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="patientfirstname" id="patientfirstname" value={formdata.patientfirstname} onChange={handlechange} required/></div>
                                       
                           <div className="form-group mt-5">
                           <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="middlename">Middle Name :</label>
                           <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="patientmiddlename" id="patientmiddlename" value={formdata.patientmiddlename} onChange={handlechange} required/></div>
                                             
                                       
                                            
                                          
                           <button type="submit" disabled={issubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
                             {issubmitting ? (
                               <>
                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                 Saving...
                               </>
                             ) : (
                               "Save"
                             )}
                           </button> 
                                          
     
                                       
                                       
                           </div>
                                     
                                       
                                       
                            </div>

                      </div>
                   </div>
                    </form>
              </div>
            </div>
        )}

   </div> )}



{/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/} {/*Staff Account Table*/}              
   { (activeaccounttable === 'staffaccounttable' && !isAdminRole) && ( <div id="staffaccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter staff name..." value={searchstaffs} onChange={(e) => {setsearchstaffs(e.target.value); filterstaffaccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
{currentuserloggedin !== "Staff" && (
<div onClick={() => setshowaddstaffdialog(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Staff</p></div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderstaffaccounts()}
</div>


{/*Add staff Dialog*/}
{showaddstaffdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add staff Account</h1></div>
  <div onClick={() => setshowaddstaffdialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={staffhandlesubmit}>
<div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
  <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
    <div className=" w-fit h-fit">
      <img className=" object-cover h-90  w-90 rounded-full" src={staffpreviewimage || defaultprofilepic}/>
    
      <input  className="hidden" type="file" onChange={staffhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={staffimageinputref} />
      <div onClick={staffhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                            
      {staffselectedprofile && (<div onClick={staffhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
      </div>
  </div>

  <div className="w-full h-full  rounded-2xl">
        <div className=" w-full h-full rounded-4xl">
   
  

        <div className="registration-container">
     
        <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
        {staffmessage.text && (
          <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
            {staffmessage.text}
          </div>
        )}
  
        <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create staff account!</h1>
  
  
  
  
        <div className="form-group mt-10  flex">
        <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffemail">Email :</label>
        <div className="flex flex-col">
        <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="staffemail" id="staffemail" value={staffformdata.staffemail} onChange={staffhandlechange} required/>
        {staffcheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
        {staffemailerror && !staffemailexist && !staffemailcharacters.test(staffformdata.staffemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
        {staffemailerror && staffemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
     
        </div>
        </div>
  
  
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffpassword">Password : </label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="staffpassword" id="staffpassword" value={staffformdata.staffpassword} onChange={staffhandlechange} required min="6"/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafflastname">Last Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="stafflastname" id="stafflastname" value={staffformdata.stafflastname} onChange={staffhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafffirstname">First Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="stafffirstname" id="stafffirstname" value={staffformdata.stafffirstname} onChange={staffhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffmiddlename">Middle Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="staffmiddlename" id="staffmiddlename" value={staffformdata.staffmiddlename} onChange={staffhandlechange} required/></div>
        
        <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffclinic">Eye Specialist:</label>
        <div className="ml-4"><StaffeyespecialistYesorNoBox value={staffformdata.staffiseyespecialist} onChange={staffhandlechange} /></div>
        </div>
       
     
        <button type="submit" disabled={staffissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
          {staffissubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
     

  
  
        </div>

  
  
        </div>

  </div>
</div>
</form>
</div>
</div>
)}


{showdeletestaffdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

<div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
<form className="flex flex-col  w-full h-fit " onSubmit={staffhandlesubmit}>

<div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#cfcfcf]">Delete Staff Account</h1></div>
<div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this staff account?</p>
  {selectedstaffaccount && ( <>
            <p className="text-[16px] mt-3">Staff Id: {selectedstaffaccount.id}</p>
            <p className="text-[16px]">Staff Name: {selectedstaffaccount.name}</p> </>)}  
  </div>        
  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeletestaffdialog(false); setselectedstaffaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
    <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
      isdeletingstaff 
        ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
        : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
    }`} onClick={isdeletingstaff ? undefined : deletestaffaccount}>
      <p className="text-[#ffffff] flex items-center">
        {isdeletingstaff ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </p>
    </div>
  </div>
</div>

</form>
</div>
</div>
)}




{showviewstaffdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
   <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Staff Account</h1></div>
   <div onClick={() => {setshowviewstaffdialog(false);
                        setselectededitstaffaccount(null);
                        setstaffformdata({
                          role: 'staff',
                          staffemail: '',
                          stafflastname: '',
                          stafffirstname: '',
                          staffmiddlename: '',
                          staffiseyespecialist:'',
                          staffprofilepicture: ''
                        });
                        setstaffpreviewimage(null);
   }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
 </div>

<form className="flex flex-col  ml-15 mr-15 mt-5   w-fullx" onSubmit={updatestaffaccount}>
 <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
      <div className=" w-fit h-fit">
       <img className=" object-cover h-90  w-90 rounded-full" src={staffpreviewimage || defaultprofilepic}/>
      
        <input  className="hidden" type="file" onChange={staffhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={staffimageinputref} />
        <div onClick={staffhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                               
        {selectedprofile && (<div onClick={staffhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
       </div>
   </div>

    <div className="w-full h-full  rounded-2xl">
          <div className=" w-full h-full rounded-4xl">
                     
                     
 
          <div className="registration-container">
      
          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
          {staffmessage.text && (
            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
              {staffmessage.text}
            </div>
          )}
                     
         <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                     
                     
                     
                     
         <div className="form-group mt-10  flex">
         <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
          <div className="flex flex-col">
          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="staffemail" id="staffemail" value={staffformdata.staffemail} onChange={staffhandlechange} required/>
         {staffcheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
         {staffemailerror && !staffemailexist && !staffemailcharacters.test(staffformdata.staffemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
          {staffemailerror && staffemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                        
         </div>
          </div>
                     
                     
    

         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafflastname">Last Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="stafflastname" id="stafflastname" value={staffformdata.stafflastname} onChange={staffhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="stafffirstname">First Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="stafffirstname" id="stafffirstname" value={staffformdata.stafffirstname} onChange={staffhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffmiddlename">Middle Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="staffmiddlename" id="staffmiddlename" value={staffformdata.staffmiddlename} onChange={staffhandlechange} required/></div>
                           
                     
         <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="staffclinic">Eye Specialist:</label>
        <div className="ml-4"><StaffeyespecialistYesorNoBox value={staffformdata.staffiseyespecialist} onChange={staffhandlechange} /></div>
        </div>
                        
         <button type="submit" disabled={staffissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {staffissubmitting ? (
             <>
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
               Saving...
             </>
           ) : (
             "Save"
           )}
         </button>
                        

                     
                     
         </div>
                   
                     
                     
          </div>

    </div>
 </div>
  </form>
</div>
</div>
)}

   </div> )}



{/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/} {/*Owner Account Table*/}
   { activeaccounttable === 'owneraccounttable' && ( <div id="owneraccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter owner name..." value={searchowners} onChange={(e) => {setsearchowners(e.target.value); filterowneraccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
{currentuserloggedin !== "Staff" && (
<div onClick={() => setshowaddownerdialog(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Owner</p></div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderowneraccounts()}
</div>


{/*Add owner Dialog*/}
{showaddownerdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Owner Account</h1></div>
  <div onClick={() => setshowaddownerdialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form className="flex flex-col  ml-15 mr-15   w-fullx" onSubmit={ownerhandlesubmit}>
<div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
  <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
    <div className=" w-fit h-fit">
      <img className=" object-cover h-90  w-90 rounded-full" src={ownerpreviewimage || defaultprofilepic}/>
    
      <input  className="hidden" type="file" onChange={ownerhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={ownerimageinputref} />
      <div onClick={ownerhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                            
      {ownerselectedprofile && (<div onClick={ownerhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
      </div>
  </div>

  <div className="w-full h-full  rounded-2xl">
        <div className=" w-full h-full rounded-4xl">
   
  

        <div className=" registration-container">
     
        <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
        {ownermessage.text && (
          <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
            {ownermessage.text}
          </div>
        )}
  
        <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create owner account!</h1>
  
  
  
  
        <div className="form-group mt-10  flex">
        <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="owneremail">Email :</label>
        <div className="flex flex-col">
        <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="owneremail" id="owneremail" value={ownerformdata.owneremail} onChange={ownerhandlechange} required/>
        {ownercheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
        {owneremailerror && !owneremailexist && !owneremailcharacters.test(ownerformdata.owneremail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
        {owneremailerror && owneremailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
     
        </div>
        </div>
  
  
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerpassword">Password : </label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="ownerpassword" id="ownerpassword" value={ownerformdata.ownerpassword} onChange={ownerhandlechange} required min="6"/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerlastname">Last Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="ownerlastname" id="ownerlastname" value={ownerformdata.ownerlastname} onChange={ownerhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerfirstname">First Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="ownerfirstname" id="ownerfirstname" value={ownerformdata.ownerfirstname} onChange={ownerhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownermiddlename">Middle Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="ownermiddlename" id="ownermiddlename" value={ownerformdata.ownermiddlename} onChange={ownerhandlechange} required/></div>
        
         <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Clinic :</label>
        <div className="ml-22"><OwnerClinicBox value={ownerformdata.ownerclinic} onChange={ownerhandlechange} /></div>   
        </div>
     

        <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Eye Specialist:</label>
        <div className="ml-4"><OwnereyespecialistYesorNoBox value={ownerformdata.owneriseyespecialist} onChange={ownerhandlechange} /></div>
        </div>
        

       
     
        <button type="submit" disabled={ownerissubmitting} className="submit-btn mt-6 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
          {ownerissubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
     

  
  
        </div>

  
  
        </div>

  </div>
</div>
</form>
</div>
</div>
)}


{showdeleteownerdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

<div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
<form className="flex flex-col  w-full h-fit " onSubmit={ownerhandlesubmit}>

<div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#cfcfcf]">Delete owner Account</h1></div>
<div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this owner account?</p>
  {selectedowneraccount && ( <>
            <p className="text-[16px] mt-3">Owner Id: {selectedowneraccount.id}</p>
            <p className="text-[16px]">Owner Name: {selectedowneraccount.name}</p> </>)}  
  </div>        
  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteownerdialog(false); setselectedowneraccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
    <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
      isdeletingowner 
        ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
        : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
    }`} onClick={isdeletingowner ? undefined : deleteowneraccount}>
      <p className="text-[#ffffff] flex items-center">
        {isdeletingowner ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </p>
    </div>
  </div>
</div>

</form>
</div>
</div>
)}




{showviewownerdialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
   <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Owner Account</h1></div>
   <div onClick={() => {setshowviewownerdialog(false);
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
   }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
 </div>

<form className="flex flex-col  ml-15 mr-15  w-fullx" onSubmit={updateowneraccount}>
 <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
      <div className=" w-fit h-fit">
       <img className=" object-cover h-90  w-90 rounded-full" src={ownerpreviewimage || defaultprofilepic}/>
      
        <input  className="hidden" type="file" onChange={ownerhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={ownerimageinputref} />
        <div onClick={ownerhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                               
        {selectedprofile && (<div onClick={ownerhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
       </div>
   </div>

    <div className="w-full h-full  rounded-2xl">
          <div className=" w-full h-full rounded-4xl">
                     
                     
 
          <div className="registration-container">
      
          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
          {ownermessage.text && (
            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
              {ownermessage.text}
            </div>
          )}
                     
         <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                     
                     
                     
                     
         <div className="form-group mt-10  flex">
         <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
          <div className="flex flex-col">
          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="owneremail" id="owneremail" value={ownerformdata.owneremail} onChange={ownerhandlechange} required/>
         {ownercheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
         {owneremailerror && !owneremailexist && !owneremailcharacters.test(ownerformdata.owneremail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
          {owneremailerror && owneremailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                        
         </div>
          </div>
                     
                     

         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerlastname">Last Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="ownerlastname" id="ownerlastname" value={ownerformdata.ownerlastname} onChange={ownerhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerfirstname">First Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="ownerfirstname" id="ownerfirstname" value={ownerformdata.ownerfirstname} onChange={ownerhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownermiddlename">Middle Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="ownermiddlename" id="ownermiddlename" value={ownerformdata.ownermiddlename} onChange={ownerhandlechange} required/></div>
                           
         <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Clinic :</label>
        <div className="ml-22"><OwnerClinicBox value={ownerformdata.ownerclinic} onChange={ownerhandlechange} /></div>   
        </div>
     

        <div className="form-group mt-5 flex">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="ownerclinic">Eye Specialist:</label>
        <div className="ml-4"><OwnereyespecialistYesorNoBox value={ownerformdata.owneriseyespecialist} onChange={ownerhandlechange} /></div>
        </div>        
                          
                    
         <button type="submit" disabled={ownerissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {ownerissubmitting ? (
             <>
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
               Saving...
             </>
           ) : (
             "Save"
           )}
         </button>
                        

                     
                     
         </div>
                   
                     
                     
          </div>

    </div>
 </div>
  </form>
</div>
</div>
)}

   </div> )}




{/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/} {/*Admin Account Table*/}
   { activeaccounttable === 'administratoraccounttable' && ( <div id="administratoraccounttable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter admin name..." value={searchadmins} onChange={(e) => {setsearchadmins(e.target.value); filteradminaccount(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
{currentuserloggedin !== "Staff" && (
<div onClick={() => setshowaddadmindialog(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Admin</p></div>
)}
</div>

<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
{renderadminaccounts()}
</div>


{/*Add admin Dialog*/}
{showaddadmindialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Admin Account</h1></div>
  <div onClick={() => setshowaddadmindialog(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form className="flex flex-col  ml-15 mr-15   w-fullx" onSubmit={adminhandlesubmit}>
<div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
  <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
    <div className=" w-fit h-fit">
      <img className=" object-cover h-90  w-90 rounded-full" src={adminpreviewimage || defaultprofilepic}/>
    
      <input  className="hidden" type="file" onChange={adminhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={adminimageinputref} />
      <div onClick={adminhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                            
      {adminselectedprofile && (<div onClick={adminhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
      </div>
  </div>

  <div className="w-full h-full  rounded-2xl">
        <div className=" w-full h-full rounded-4xl">
   
  

        <div className=" registration-container">
     
        <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Creation</h1>
        {adminmessage.text && (
          <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
            {adminmessage.text}
          </div>
        )}
  
        <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's create admin account!</h1>
  
  
  
  
        <div className="form-group mt-10  flex">
        <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminemail">Email :</label>
        <div className="flex flex-col">
        <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="adminemail" id="adminemail" value={adminformdata.adminemail} onChange={adminhandlechange} required/>
        {admincheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
        {adminemailerror && !adminemailexist && !adminemailcharacters.test(adminformdata.adminemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
        {adminemailerror && adminemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
     
        </div>
        </div>
  
  
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminpassword">Password : </label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-11 h-10 w-70" placeholder="Enter your password..." type="password" name="adminpassword" id="adminpassword" value={adminformdata.adminpassword} onChange={adminhandlechange} required min="6"/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminlastname">Last Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="adminlastname" id="adminlastname" value={adminformdata.adminlastname} onChange={adminhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminfirstname">First Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="adminfirstname" id="adminfirstname" value={adminformdata.adminfirstname} onChange={adminhandlechange} required/></div>
  
        <div className="form-group mt-5">
        <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminmiddlename">Middle Name :</label>
        <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="adminmiddlename" id="adminmiddlename" value={adminformdata.adminmiddlename} onChange={adminhandlechange} required/></div>
        

       
     
        <button type="submit" disabled={adminissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
          {adminissubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
     

  
  
        </div>

  
  
        </div>

  </div>
</div>
</form>
</div>
</div>
)}


{showdeleteadmindialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

<div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
<form className="flex flex-col  w-full h-fit " onSubmit={adminhandlesubmit}>

<div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#cfcfcf]">Delete Admin Account</h1></div>
<div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this admin account?</p>
  {selectedadminaccount && ( <>
            <p className="text-[16px] mt-3">Admin Id: {selectedadminaccount.id}</p>
            <p className="text-[16px]">Admin Name: {selectedadminaccount.name}</p> </>)}  
  </div>        
  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteadmindialog(false); setselectedadminaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
    <div className={`ml-2 rounded-2xl h-fit w-fit px-7 py-3 transition-all duration-300 ease-in-out ${
      isdeletingadmin 
        ? 'bg-[#4e0f0f] cursor-not-allowed opacity-50' 
        : 'hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] hover:scale-105'
    }`} onClick={isdeletingadmin ? undefined : deleteadminaccount}>
      <p className="text-[#ffffff] flex items-center">
        {isdeletingadmin ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </p>
    </div>
  </div>
</div>

</form>
</div>
</div>
)}




{showviewadmindialog && (
<div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[700px]  animate-fadeInUp ">
 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
   <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Edit Admin Account</h1></div>
   <div onClick={() => {setshowviewadmindialog(false);
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
   }} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
 </div>

<form className="flex flex-col  ml-15 mr-15  w-fullx" onSubmit={updateadminaccount}>
 <div className="flex justify-center items-center bg-[#fcfcfc] rounded-2xl w-full h-[590px]">
    <div className="w-full h-full  rounded-2xl flex justify-center mt-15">
      <div className=" w-fit h-fit">
       <img className=" object-cover h-90  w-90 rounded-full" src={adminpreviewimage || defaultprofilepic}/>
      
        <input  className="hidden" type="file" onChange={adminhandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={adminimageinputref} />
        <div onClick={adminhandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
                                               
        {selectedprofile && (<div onClick={adminhandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
       </div>
   </div>

    <div className="w-full h-full  rounded-2xl">
          <div className=" w-full h-full rounded-4xl">
                     
                     
 
          <div className="registration-container">
      
          <h1 className=" font-league text-[#3da9d1] text-[27px] ">Account Details</h1>
          {adminmessage.text && (
            <div className={`message ${message.type} text-${message.type === 'error' ? 'red' : 'green'}-600 font-bold`}>
              {adminmessage.text}
            </div>
          )}
                     
         <h1 className=" font-albertsans  italic text-[#060606] text-[20px]">Let's modify your account!</h1>
                     
                     
                     
                     
         <div className="form-group mt-10  flex">
         <label className="  font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="email">Email :</label>
          <div className="flex flex-col">
          <input className=" bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-22 h-10 w-70" placeholder="Enter your email..." type="text" name="adminemail" id="adminemail" value={adminformdata.adminemail} onChange={adminhandlechange} required/>
         {admincheckemail && <p className="text-gray-500 text-sm ml-22">Checking Email</p>}
         {adminemailerror && !adminemailexist && !adminemailcharacters.test(adminformdata.adminemail) && (<p className="text-red-500 text-sm ml-22">Enter a valid email address</p>)}
          {adminemailerror && adminemailexist && (<p className= "text-red-500 text-sm ml-22">Email already exist</p>)}
                        
         </div>
          </div>
                     
                     
    

         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminlastname">Last Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-10 h-10 w-70" placeholder="Enter your lastname..." type="text" name="adminlastname" id="adminlastname" value={adminformdata.adminlastname} onChange={adminhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminfirstname">First Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-9 h-10 w-70" placeholder="Enter your firstname..." type="text" name="adminfirstname" id="adminfirstname" value={adminformdata.adminfirstname} onChange={adminhandlechange} required/></div>
                     
         <div className="form-group mt-5">
         <label className="font-albertsans font-bold italic text-[#595968] text-[21px]" htmlFor="adminmiddlename">Middle Name :</label>
         <input className="bg-gray-200 text-[20px]  text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-70" placeholder="Enter your middlename..." type="text" name="adminmiddlename" id="adminmiddlename" value={adminformdata.adminmiddlename} onChange={adminhandlechange} required/></div>
                                      
                          
                    
         <button type="submit" disabled={adminissubmitting} className="submit-btn mt-12 w-full flex items-center justify-center" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {adminissubmitting ? (
             <>
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
               Saving...
             </>
           ) : (
             "Save"
           )}
         </button>
                        

                     
                     
         </div>
                   
                     
                     
          </div>

    </div>
 </div>
  </form>
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

{ (activedashboard === 'profileinformation' && !isAdminRole) && ( <div id="profileinformation" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   


<div className="flex items-center"><i className="bx bxs-user-detail text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Profile Information</h1></div>
<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showprofiletable('patientprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='patientprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='patientprofiletable' ? 'text-white' : ''}`}>Patients</h1></div>
<div onClick={() => showprofiletable('staffprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='staffprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='staffprofiletable' ? 'text-white' : ''}`}>Staff</h1></div>
<div onClick={() => showprofiletable('ownerprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='ownerprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='ownerprofiletable' ? 'text-white' : ''}`}>Owner</h1></div>
<div onClick={() => showprofiletable('administratorprofiletable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeprofiletable ==='administratorprofiletable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeprofiletable ==='administratorprofiletable' ? 'text-white' : ''}`}>Administrator</h1></div>
</div>




{/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} {/*Patient profile Table*/} 
{ activeprofiletable === 'patientprofiletable' && ( <div id="patientprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter patient name..." value={searchPatientProfiles} onChange={(e) => {setSearchPatientProfiles(e.target.value); filterPatientProfiles(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
<div onClick={() => setshowaddpatientprofile(true)}  className=" mt-1 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Patient Profile</p></div>
</div>

<div className=" rounded-3xl min-h-[85%] h-auto pb-5 w-full mt-2 bg-[#f7f7f7]">
{renderpatientprofiles()}
</div>





{showpatientpofile && (
<div id="patientdemographicprofileform" className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[780px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Patient Profile</h1></div>
  <div onClick={() => {setshowpatientpofile(false); resetpatientprofileformdata();}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={retrieveandupdatepatientprofile}>
           
           <div className="ml-25 mt-5 flex ">


           <div className=" w-60 h-60 ml-10">
             <img className=" object-cover h-60 w-full rounded-full" src={previewimage || defaultprofilepic}/>

             <input  className="hidden" type="file" onChange={handleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={imageinputref} />
             <div onClick={handleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
             
             {selectedprofile && (<div onClick={handleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
           </div>

           <div className=" ml-15">

            

            <div className=" h-fit form-group  ">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientlastname">Last Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientlastname} onChange={(e) => setdemoformdata({...demoformdata, patientlastname: e.target.value})} type="text" name="patientlastname" id="patientlastname" placeholder="Patient Last Name..."/></div>

             <div className=" h-fit form-group  mt-5">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientfirstname">First Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientfirstname} onChange={(e) => setdemoformdata({...demoformdata, patientfirstname: e.target.value})}  type="text" name="patientfirstname" id="patientfirstname" placeholder="Patient First Name..."/></div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientmiddlename">Middle Name :</label>     
             <input className="w-112 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientmiddlename} onChange={(e) => setdemoformdata({...demoformdata, patientmiddlename: e.target.value})}  type="text" name="patientmiddlename" id="patientmiddlename" placeholder="Patient Middle Name.."/></div>



             <div className=" mt-5 flex items-center">
            <div className="">
                   
                 <div className=" h-fit form-group">
                <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientbirthdate">Birthdate :</label>     
                <input className="w-38 justify-center border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"      value={demoformdata.patientbirthdate} 
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
                                 placeholder=""
                                 max={new Date().toISOString().split('T')[0]}/> </div>
                             

                 </div>
             <div className="">

             <div className=" h-fit form-group ml-15">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientage">Age :</label>     
             <input className="w-32 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  readOnly value={demoformdata.patientage} onChange={(e) => setdemoformdata({...demoformdata, patientage: e.target.value})} type="number" name="patientage" id="patientage" placeholder="Age..."/></div>

                 </div>




             </div>




             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientgender">Gender :</label>     
             <div className="ml-3"><GenderBoxAdminDash value={demoformdata.patientgender} onChange={(e) => setdemoformdata({...demoformdata, patientgender: e.target.value})} /></div>  </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientcontactnumber">Contact Number :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientcontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientcontactnumber: e.target.value})} type="text" name="patientcontactnumber" id="patientcontactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patienthomeaddress">Home Address :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"   value={demoformdata.patienthomeaddress} onChange={(e) => setdemoformdata({...demoformdata, patienthomeaddress: e.target.value})}  type="text" name="patienthomeaddress" id="patienthomeaddress" placeholder="Ex: #001 Sison St., Townsite, Limay, Bataan"/> </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactname">Emergency Contact Name :</label>     
             <input className="w-90 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientemergencycontactname} onChange={(e) => setdemoformdata({...demoformdata,patientemergencycontactname: e.target.value})}  type="text" name="patientemergencycontactname" id="patientemergencycontactname" placeholder="Ex: Juan Dela Cruz"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactnumber">Emergency Contact Number :</label>     
             <input className="w-84 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold" value={demoformdata.patientemergencycontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientemergencycontactnumber: e.target.value})}  type="text" name="patientemergencycontactnumber" id="patientemergencyconctactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>



           <div className=" mt-10">

           <button type="submit" disabled={issubmitting} className={`submit-btn mt-12 w-full flex justify-center items-center ${issubmitting? "opacity-75 cursor-not-allowed" : "" }`} style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
              Save Changes
           </button>

             </div>



             <div onClick={() =>  {
  setshowdeletepatientprofiledialog(true);
  }}

 className="bg-[#8c3226] hover:bg-[#ab4f43] mt-4 h-[50px]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 hover:cursor-pointer rounded-[20px]"><h1 className="text-white font-albertsans font-semibold text-[20px]">Delete</h1></div>




{showdeletepatientprofiledialog && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">


                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Patient Profile</h1></div>
                <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this patient profile?</p>
                    {selectedpatientprofile && ( <>
                             <p className="text-[16px]">Patient Name: {selectedpatientprofile.name}</p>
                              <p className="text-[16px] mt-3">Patient Email: {selectedpatientprofile.email}</p>
                               </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeletepatientprofiledialog(false); setselectedpatientprofile(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={deletepatientprofile}><p className=" text-[#ffffff]">Delete</p></div>
                    </div>
                </div>

             </div>
           </div>
        )}
       

          </div>
             

           </div>
         

          </form>
</div>
</div>)}





{showaddpatientpofile && (
<div id="patientdemographicprofileform" className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] h-[780px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Patient Profile</h1></div>
  <div onClick={() =>{setshowaddpatientprofile(false); resetpatientprofileformdata();}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={addpatientprofile}>
           
           <div className="ml-25 mt-5 flex ">


           <div className=" w-60 h-60 ml-10">
             <img className=" object-cover h-60 w-full rounded-full" src={addpatientprofilepreviewimage || defaultprofilepic}/>

             <input  className="hidden" type="file" onChange={addpatientprofilehandlechange} accept="image/jpeg, image/jpg, image/png" ref={addpatientprofileimageinputref} />
             <div onClick={addpatientprofilehandleuploadclick}  className="mt-5 flex justify-center items-center align-middle p-3 bg-[#0ea0cd] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-image pr-2 font-bold text-[22px] text-white"/><p className="font-semibold text-[20px] text-white">Upload</p></div>
             
             {selectedpatientprofile && (<div onClick={addpatientprofilehandleremoveprofile} className="mt-5 flex justify-center items-center align-middle p-3 bg-[#bf4c3b] rounded-2xl hover:cursor-pointer hover:scale-105 transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/><p className="font-semibold text-[20px] text-white">Remove</p></div>)}
           </div>

           <div className=" ml-15">


           <div className="form-group flex mb-3">
               <label className="text-[23px] font-bold text-[#2d2d44]"  htmlFor="patientemail">Patient Email :</label>
               <div className="flex flex-col">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" onChange={(e) => setdemoformdata({...demoformdata, patientemail: e.target.value.trim()})} value={demoformdata.patientemail} id="patientemail" name="patientemail" required type="email" placeholder="Patient Email"/>
               <div>
                       {demopatientcheckemail && (
                        <p className="text-gray-500 text-sm">Checking Email...</p>
                       )}



                       {!demopatientcheckemail && (
                        <>

                        {demopatientemailerror && !demopatientemailexist && (
                             <p className="text-red-500 text-sm">
                              Please enter a valid email address
                             </p>
                           )}
              

                        {demopatientemailexist && (
                             <p className="text-red-500 text-sm">
                                A patient profile already exists with this email
                             </p>
                            )}

              
                        {emailisnotpatienterror && (
                              <p className="text-red-500 text-sm">
                                 This email belongs to a staff/admin account and cannot be used for patient profiles
                              </p>
                             )}
                        </>
                       )}

               </div>
                </div>
              
                </div>


            <div className=" h-fit form-group  ">
             <label className="text-[23px]  font-bold  text-[#2d2d44]" htmlFor="patientlastname">Last Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientlastname} onChange={(e) => setdemoformdata({...demoformdata, patientlastname: e.target.value})} type="text" name="patientlastname" id="patientlastname" placeholder="Patient Last Name..."/></div>

             <div className=" h-fit form-group  mt-5">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientfirstname">First Name :</label>     
             <input className="w-120 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientfirstname} onChange={(e) => setdemoformdata({...demoformdata, patientfirstname: e.target.value})}  type="text" name="patientfirstname" id="patientfirstname" placeholder="Patient First Name..."/></div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientmiddlename">Middle Name :</label>     
             <input className="w-112 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientmiddlename} onChange={(e) => setdemoformdata({...demoformdata, patientmiddlename: e.target.value})}  type="text" name="patientmiddlename" id="patientmiddlename" placeholder="Patient Middle Name.."/></div>



             <div className=" mt-5 flex items-center">
               <div className="">
                   
                 <div className=" h-fit form-group ">
                <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientbirthdate">Birthdate :</label>     
                <input className="w-38 justify-center border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientbirthdate}     onChange={(e) => {
const newBirthdate = e.target.value;
setdemoformdata({
...demoformdata, 
patientbirthdate: newBirthdate,
patientage: calculateAge(newBirthdate)
});
}} max={new Date().toISOString().split('T')[0]}  type="date" name="patientbirthdate" id="patientbirthdate" placeholder=""/> </div>

                 </div>
             <div className="">

             <div className=" h-fit form-group ml-15">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientage">Age :</label>     
             <input className=" w-32 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  readOnly value={demoformdata.patientage} onChange={(e) => setdemoformdata({...demoformdata, patientage: e.target.value})} type="number" name="patientage" id="patientage" placeholder="Age..."/></div>

                 </div>




             </div>




             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientgender">Gender :</label>     
             <div className="ml-3"><GenderBoxAdminDash value={demoformdata.patientgender} onChange={(e) => setdemoformdata({...demoformdata, patientgender: e.target.value})} /></div>  </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patientcontactnumber">Contact Number :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientcontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientcontactnumber: e.target.value})} type="text" name="patientcontactnumber" id="patientcontactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[23px]  font-bold  text-[#2d2d44] "htmlFor="patienthomeaddress">Home Address :</label>     
             <input className="w-104 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"   value={demoformdata.patienthomeaddress} onChange={(e) => setdemoformdata({...demoformdata, patienthomeaddress: e.target.value})}  type="text" name="patienthomeaddress" id="patienthomeaddress" placeholder="Ex: #001 Sison St., Townsite, Limay, Bataan"/> </div>


             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactname">Emergency Contact Name :</label>     
             <input className="w-90 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold"  value={demoformdata.patientemergencycontactname} onChange={(e) => setdemoformdata({...demoformdata,patientemergencycontactname: e.target.value})}  type="text" name="patientemergencycontactname" id="patientemergencycontactname" placeholder="Ex: Juan Dela Cruz"/> </div>

             <div className=" h-fit form-group  mt-5 flex">
             <label className="text-[20px]  font-bold  text-[#2d2d44] "htmlFor="patientemergencycontactnumber">Emergency Contact Number :</label>     
             <input className="w-84 border-b-2 border-gray-600 ml-3 text-[#2d2d44] text-[20px]  font-semibold" value={demoformdata.patientemergencycontactnumber} onChange={(e) => setdemoformdata({...demoformdata, patientemergencycontactnumber: e.target.value})}  type="text" name="patientemergencycontactnumber" id="patientemergencyconctactnumber" placeholder="Ex: 09xxxxxxxxx"/> </div>



           <div className=" mt-10">

           <button type="submit" disabled={issubmitting} className={`submit-btn mt-12 w-full flex justify-center items-center ${issubmitting? "opacity-75 cursor-not-allowed" : "" }`} style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
              Create Patient Profile
           </button>

             </div>





          </div>
             

           </div>
         

          </form>
</div>
</div>)}



</div>)}



{/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/} {/*Staff profile Table*/}              
{ activeprofiletable === 'staffprofiletable' && ( <div id="staffprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
</div>)}



{/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/} {/*Owner profile Table*/}
{ activeprofiletable === 'ownerprofiletable' && ( <div id="ownerprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
</div>)}




{/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/} {/*Admin profile Table*/}
{ activeprofiletable === 'administratorprofiletable' && ( <div id="administratorprofiletable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[83%] rounded-2xl mt-5" >
</div>)}






</div> )}

{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 
{/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} {/*End of Profile Information*/} 





{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}
{/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/} {/*APPOINTMENT MANAGEMENT*/}

 { (activedashboard === 'appointmentmanagement' && !isAdminRole) && (<div id="appointmentmanagement" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300 ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl flex flex-col" >   

<div className="flex items-center"><i className="bx bxs-calendar text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Appointment Management</h1></div>





{loggedinusertype?.type === "Admin"&& (

<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showappointmentstable('allappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='allappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='allappointmentstable' ? 'text-white' : ''}`}>All</h1></div>
<div onClick={() => showappointmentstable('ambherappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='ambherappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='ambherappointmentstable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
<div onClick={() => showappointmentstable('bautistaappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='bautistaappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='bautistaappointmentstable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
</div>
)} 




{(loggedinusertype?.type === "Owner" || loggedinusertype?.type === "Staff") && loggedinusertype?.clinic === "Bautista Eye Center" && (
<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showappointmentstable('bautistaappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='bautistaappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='bautistaappointmentstable' ? 'text-white' : ''}`}>Bautista Eye Center</h1></div>
</div>
)}



{(loggedinusertype?.type === "Owner" || loggedinusertype?.type === "Staff") && loggedinusertype?.clinic === "Ambher Optical" && (
<div className="flex justify-between items-center mt-3 h-[60px]">
<div onClick={() => showappointmentstable('ambherappointmentstable')}  className={`hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activeappointmentstable ==='ambherappointmentstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activeappointmentstable ==='ambherappointmentstable' ? 'text-white' : ''}`}>Ambher Optical</h1></div>
</div>
)} 











{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}{/*All Appointments Table*/}
{ activeappointmentstable === 'allappointmentstable' && ( <div id="allappointmentstable" className="animate-fadeInUp flex flex-col border-t-2 border-[#909090] w-[100%] flex-1 rounded-2xl mt-5 min-h-0" ref={appointmentTableRef}>

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter appointment details..." value={searchAppointments} onChange={(e) => {setSearchAppointments(e.target.value); filterAppointments(e.target.value);}} className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
</div>

{loadingappointmens ? (
<div className="space-y-4 p-4 flex-1">
{[...Array(4)].map((_, index) => (
<AppointmentSkeleton key={index} />
))}
</div>
) : errorloadingappointments ? (
<div className="rounded-lg p-4 bg-red-50 text-red-600 flex-1 flex items-center justify-center">
Error: {errorloadingappointments}
</div>
) : (filteredAppointments.length === 0 && searchAppointments.trim()) ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6 flex-1 flex items-center justify-center">
No appointments found matching "{searchAppointments}".
</div>
) : patientappointments.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6 flex-1 flex items-center justify-center">No patient appointments found.</div>

) :(<div className="flex flex-col flex-1 rounded-3xl w-full mt-2 bg-[#f7f7f7] min-h-0">
<div className="flex-1 overflow-auto">
<table className="min-w-full divide-y divide-gray-200 h-full">
<thead className="bg- sticky top-0 z-10">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Ambher Appoinment</th>
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Bautista Appoinment</th>
<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className="divide-y divide-gray-200 bg-white">
{(() => {
const dataToDisplay = searchAppointments.trim() ? filteredAppointments : patientappointments;
const paginatedAppointments = getPaginatedData(dataToDisplay, 'appointments');
return paginatedAppointments.map((appointment) => (
<tr 
key={appointment._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6 text-[#171717] text-[15px] text-center font-albertsans font-medium whitespace-nowrap">
  #{appointment.patientappointmentid}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
       <div className="flex  items-center whitespace-nowrap">
    <img 
      src={appointment.patientappointmentprofilepicture}
      alt="Profile" 
      className=" rounded-full h-12 mr-3 w-12 object-cover"
      onError={(e) => {
        e.target.src = 'default-profile-url';
      }}
    />
    <h1 className="py-3 px-6 text-[#171717] text-[15px] text-center font-albertsans font-medium whitespace-nowrap">{appointment.patientappointmentfirstname} {appointment.patientappointmentlastname}</h1>
    </div>
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
    <span className="py-3 px-6 text-[#171717] text-[15px]  text-center font-albertsans font-medium whitespace-nowrap">
      {new Date(appointment.createdAt).toLocaleDateString('en-US',{
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}  
    </span>          
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
  {appointment.patientambherappointmentdate && (
    <div className="font-albertsans text-[#171717] font-medium flex  justify-center items-center whitespace-nowrap">
      <span className="font-albertsans text-[#171717] text-[15px] font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientambherappointmentdate)} </span> 
      <span className="ml-1 font-albertsans text-[#171717] text-[15px] font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientambherappointmenttime)})</span> 
      <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
appointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{appointment.patientambherappointmentstatus}</span>
    </div>
  )}
</td>

<td className="py-3 px-6 w-auto  text-center font-albertsans text-[#171717] font-medium whitespace-nowrap">
  {appointment.patientbautistaappointmentdate && (
    <div className="font-albertsans text-[#171717] font-medium flex justify-center items-center whitespace-nowrap">
      <span className="font-albertsans text-[15px]  text-[#171717] font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientbautistaappointmentdate)}</span> 
      <span className="ml-1 font-albertsans  text-[15px] text-[#171717] font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientbautistaappointmenttime)})</span> 
      
<span className={` ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${appointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
appointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
appointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
appointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#103d4a]':
'bg-red-100 text-red-800'}`}>{appointment.patientbautistaappointmentstatus}</span>
    </div>
  )}
</td>



<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">
 
<div onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
    className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white ">View</h1></div>

<div onClick={() =>  {setdeletepatientappointment(true);
                  setselectedpatientappointment(appointment);
}}
  className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>

        {deletepatientappointment && (
           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
   

                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1></div>
                <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                    {selectedpatientappointment && ( <>
                              <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientappointmentid}</p> </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setdeletepatientappointment(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {handledeleteappointment(selectedpatientappointment.patientappointmentid);setdeletepatientappointment(false); }}><p className=" text-[#ffffff]">Delete</p></div>
                    </div>
                </div>

             </div>
           </div>
        )}


        

</td>
</tr>
));
})()}
</tbody>
</table>
</div>

{/* Pagination Component for Appointments */}
{(() => {
const dataToDisplay = searchAppointments.trim() ? filteredAppointments : patientappointments;
const totalAppointments = dataToDisplay.length;
const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);

return totalAppointments > 0 && (
<PaginationComponent
currentPage={currentPage.appointments}
totalPages={totalPages}
onPageChange={(page) => handlePageChange('appointments', page)}
totalItems={totalAppointments}
itemsPerPage={appointmentsPerPage}
itemName="appointments"
/>
);
})()}
</div>
)}

{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
           {viewpatientappointment && selectedpatientappointment && (
           <div id="viewpatientappointment" className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
             <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] mt-10  animate-fadeInUp ">
                   <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                   <Link to=""><div id="patientcard"  className=" flex justify-center items-start mt-5 ml-3 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-300 ease-in-out  rounded-2xl w-[500px] h-[80px]">
          <div className="w-max mr-3 h-full  rounded-2xl flex justify-center items-center">
          <img  src={selectedpatientappointment?.patientappointmentprofilepicture || defaultprofilepic}  alt="Profile" className="h-20 w-20 rounded-full object-cover"></img>
          </div>
          <div className="bg-white  flex flex-col justify-center items-start pl-2 pr-2 w-[500px] h-full  rounded-3xl">
            <h1 className="font-albertsans font-bold text-[20px] w-full text-[#2d3744]"> {selectedpatientappointment?.patientappointmentfirstname || ''} {selectedpatientappointment?.patientappointmentlastname || ''}</h1>
            <p className="text-[15px]  w-full text-[#535354]">{selectedpatientappointment?.patientappointmentemail || ''}</p>
          </div>
      </div>
      </Link> 
                     <div onClick={() => {setviewpatientappointment(false); setbautistaeyespecialist(''); setambhereyespecialist('');}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                   </div>






    <div className="mt-10 flex justify-start items-start  w-full rounded-3xl ">
{selectedpatientappointment.patientambherappointmentdate && (


<div className="flex flex-col mr-3 bg-[#fdfdfd]    h-auto w-full rounded-3xl">
<div className="flex p-3">
<img src={ambherlogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#237234] mt-1 ml-3">Ambher Optical</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientambherappointmentstatus}</span>
</div>

<div className="flex ">     

<div className="flex flex-col w-full pr-3">           
<div className=" flex flex-col h-fit form-group ml-3  mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientambherappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" required={!!ambherservicesselected}/>*/}
<div className="h-max w-full  flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientambherappointmentstatus === "Accepted" ||
selectedpatientappointment.patientambherappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientambherappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientambherappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientambherappointmenttime)})</span></h1>


{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientambherappointmentpaymentotal}
</p>

</div>
)}
</div>

</div>






</div>

</div>

<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcataractscreening} type="checkbox" name="patientambherappointmentcataractscreening" id="patientambherappointmentcataractscreening" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcataractscreening">Visual/Cataract Screening</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricassessment} type="checkbox" name="patientambherappointmentpediatricassessment" id="patientambherappointmentpediatricassessment" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricassessment">Pediatric Assessment</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricoptometrist} type="checkbox" name="patientambherappointmentpediatricoptometrist" id="patientambherappointmentpediatricoptometrist" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricoptometrist">Pediatric Optometrist</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcolorvisiontesting} type="checkbox" name="patientambherappointmentcolorvisiontesting" id="patientambherappointmentcolorvisiontesting" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcolorvisiontesting">Color Vision Testing</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentlowvisionaid} type="checkbox" name="patientambherappointmentlowvisionaid" id="patientambherappointmentlowvisionaid" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentlowvisionaid">Low Vision Aid</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentrefraction} type="checkbox" name="patientambherappointmentrefraction" id="patientambherappointmentrefraction" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentrefraction">Refraction</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcontactlensefitting} type="checkbox" name="patientambherappointmentcontactlensefitting" id="patientambherappointmentcontactlensefitting" />
<label className="text-[18px]   font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcontactlensefitting">Contact Lense Fitting</label>   
</div>  


<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientambherappointmentotherservice} onChange={(e) => setshowotherpatientambherappointmentotherservice(e.target.checked)}  type="checkbox" name="patientambherappointmentotherservice" id="patientambherappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentotherservice">Other</label>   
</div>  

{selectedpatientappointment.patientambherappointmentotherservice && (
<div className="mt-3 ml-17">
<p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientambherappointmentotherservicenote}</p>
</div>
)}    



{selectedpatientappointment.patientambherappointmentstatus === "Pending" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6 mr-4" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><AmbhereyespecialistBox value={ambhereyespecialist} onChange={(e) => setambhereyespecialist(e.target.value)} /></div>  

{ambhereyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Ambher Appointment</h1>
)}
</div>
)} 
</div>


)}



{selectedpatientappointment.patientambherappointmentstatus === "Accepted" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Ambher Optical  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={ambherappointmentpaymentotal} onChange={(e) => setambherappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientambherappointmentpaymentotal" id="patientambherappointmentpaymentotal" placeholder="Total Payment"/>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarkssubject} onChange={(e) => {setambherappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarks} onChange={(e) => {setambherappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>




<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentprescription} onChange={(e) => {setambherappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{ambherappointmentpaymentotal && ambherappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Ambher Appointment</h1>
)}
</div>
)}


</div>
)}



{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-15" >


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarkssubject}</p>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarks}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientambherappointmentprescription}</p>
</div>
{selectedpatientappointment.patientambherappointmentrating != 0 && selectedpatientappointment.patientambherappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientambherappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientambherappointmentfeedback}</p>
</div>
)} 

</div>
)}










</div>

</div>
)}







{selectedpatientappointment.patientbautistaappointmentdate && (
<div className="flex flex-col bg-[#fdfdfd]  h-auto w-full rounded-3xl">
<div className="flex p-3 ">
<img src={bautistalogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#2387c5] mt-1 ml-3">Bautista Eye Center</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientbautistaappointmentstatus}</span>
</div>



<div className="flex flex-col mr-3 pr-8 bg-[#fdfdfd] h-auto  w-full rounded-3xl">


<div className="flex flex-col  w-full">           
<div className="mr-10 flex flex-col h-fit form-group ml-3 mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientbautistaappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientbautistaappointmentdate" id="patientbautistaappointmentdate" placeholder="" required={!!bautistaservicesselected}/>*/}
<div className="h-max w-full flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" ||
selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientbautistaappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientbautistaappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientbautistaappointmenttime)})</span></h1>


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-5.5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientbautistaappointmentpaymentotal}
</p>
</div>
)}
</div>

</div>





</div>



<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentcomprehensiveeyeexam} type="checkbox" name="patientbautistaappointmentcomprehensiveeyeexam" id="patientbautistaappointmentcomprehensiveeyeexam" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcomprehensiveeyeexam">Comprehensive Eye Exam</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentdiabeticretinopathy} type="checkbox" name="patientbautistaappointmentdiabeticretinopathy" id="patientbautistaappointmentdiabeticretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentdiabeticretinopathy">Diabetic Retinopathy</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentglaucoma} type="checkbox" name="patientbautistaappointmentglaucoma" id="patientbautistaappointmentglaucoma" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentglaucoma">Glaucoma</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmenthypertensiveretinopathy} type="checkbox" name="patientbautistaappointmenthypertensiveretinopathy" id="patientbautistaappointmenthypertensiveretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmenthypertensiveretinopathy">Hypertensive Retinopathy</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentretinolproblem} type="checkbox" name="patientbautistaappointmentretinolproblem" id="patientbautistaappointmentretinolproblem" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentretinolproblem">Retinol Problem</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentcataractsurgery} type="checkbox" name="patientbautistaappointmentcataractsurgery" id="patientbautistaappointmentcataractsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcataractsurgery">Cataract Surgery</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentpterygiumsurgery} type="checkbox" name="patientbautistaappointmentpterygiumsurgery" id="patientbautistaappointmentpterygiumsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentpterygiumsurgery">Pterygium Surgery</label>   
</div>  

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentotherservice}  type="checkbox" name="patientbautistaappointmentotherservice" id="patientbautistaappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentotherservice">Other</label>   
</div>  


{selectedpatientappointment.patientbautistaappointmentotherservice && (
<div className="mt-3 ml-17">
<p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientbautistaappointmentotherservicenote}</p>
</div>
)}    






{selectedpatientappointment.patientbautistaappointmentstatus === "Pending" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><BautistaeyespecialistBox value={bautistaeyespecialist} onChange={(e) => setbautistaeyespecialist(e.target.value)}/></div>
{bautistaeyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Bautista Appointment</h1>
)}
</div>
)}
</div>
)}



{selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Bautista Eye Center  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={bautistaappointmentpaymentotal} onChange={(e) => setbautistaappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientbautistaappointmentpaymentotal" id="patientbautistaappointmentpaymentotal" placeholder="Total Payment"/>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarkssubject} onChange={(e) => {setbautistaappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify consultation subject..."/>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarks} onChange={(e) => {setbautistaappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>



<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentprescription} onChange={(e) => {setbautistaappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{bautistaappointmentpaymentotal && bautistaappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Bautista Appointment</h1>
)}
</div>
)}

</div>
)}


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-15" >


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarks}</p>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentprescription}</p>
</div>



{selectedpatientappointment.patientbautistaappointmentrating != 0 && selectedpatientappointment.patientbautistaappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientbautistaappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientbautistaappointmentfeedback}</p>
</div>
)} 


</div>
)}








</div>

</div>
</div>
)}
</div>

{(selectedpatientappointment.patientambherappointmentstatus === "Completed" &&
selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (
<div className="bg-[#dbfac8] w-full p-3 mt-20 rounded-2xl">
<div className="  items-center  flex justify-between">
<h1 className=" text-[#237234] font-bold font-albertsans text-[20px] ">Combined Total Payment : </h1>
<p className="text-[#2b5910] text-[24px] font-albertsans font-semibold">
₱{(selectedpatientappointment.patientambherappointmentpaymentotal + selectedpatientappointment.patientbautistaappointmentpaymentotal).toLocaleString()}
</p>
</div>
</div>

)}






<div className="w-full mt-5 p-3 flex flex-col mb-7 bg-[#e5e7eb] rounded-2xl  ">
            <label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientadditionalappointmentnotes">Patient Appointment Notes :</label>  

             <div>{selectedpatientappointment.patientadditionalappointmentnotes ||"No additional notes"}</div>
                                   <div className=" w-fit h-fit mt-5 mb-5">
                                   <img className=" object-cover  rounded-2xl" src={selectedpatientappointment.patientadditionalappointmentnotesimage || defaultimageplaceholder}/>                 
                                   </div>
            </div>
             </div>

           </div>
        )}


</div> )}



















{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}{/*Ambher Appointments Table*/}
{ activeappointmentstable === 'ambherappointmentstable' && ( <div id="ambherappointmentstable" className="animate-fadeInUp flex flex-col border-t-2 border-[#909090] w-[100%] flex-1 rounded-2xl mt-5 min-h-0" ref={appointmentTableRef}>

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter appointment details..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
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
) : patientappointments.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">No patient appointments found.</div>

) :(<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Ambher Appoinment</th>


<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className="divide-y divide-gray-200 bg-white">

{patientappointments.filter(appointment =>{
if(activeappointmentstable === 'ambherappointmentstable'){
return appointment.patientambherappointmentdate !== "" &&
   appointment.patientambherappointmenttime !== "" &&
   appointment.patientambherappointmentid !== null;
}
return true;
}).map((appointment) => (
<tr 
key={appointment._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
#{appointment.patientappointmentid}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
     <div className="flex  items-center whitespace-nowrap">
  <img 
    src={appointment.patientappointmentprofilepicture} 
    alt="Profile" 
    className=" rounded-full h-12 mr-3 w-12 object-cover"
    onError={(e) => {
      e.target.src = 'default-profile-url';
    }}
  />
  <h1 className="font-albertsans text-[#171717]font-medium whitespace-nowrap">{appointment.patientappointmentfirstname} {appointment.patientappointmentlastname}</h1>
  </div>
</td>

<td className="py-3 px-6  text-center font-albertsans text-[#171717] font-medium whitespace-nowrap">
  <span className="font-albertsans text-[#171717]font-medium whitespace-nowrap">
    {new Date(appointment.createdAt).toLocaleDateString('en-US',{
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}  
  </span>          
</td>

<td className="whitespace-nowrap">
{appointment.patientambherappointmentdate && (
  <div className=" font-albertsans text-[#171717] font-medium flex  justify-center items-center whitespace-nowrap">
    <span className="font-albertsans text-[#171717]font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientambherappointmentdate)} </span> 
    <span className="ml-1 font-albertsans text-[#171717]font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientambherappointmenttime)})</span> 
    <span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${appointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
appointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
appointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
appointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{appointment.patientambherappointmentstatus}</span>
  </div>
)}
</td>





<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">

<div onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
  className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>

<div onClick={() =>  {setdeletepatientappointment(true);
                setselectedpatientappointment(appointment);
}}
className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>

      {deletepatientappointment && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                  {selectedpatientappointment && ( <>
                            <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientambherappointmentid}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setdeletepatientappointment(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                    <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {handledeleteappointmentbyclinic(selectedpatientappointment.patientappointmentid, 'ambher');setdeletepatientappointment(false); }}><p className=" text-[#ffffff]">Delete</p></div>
                  </div>
              </div>

           </div>
         </div>
      )}


      

</td>
</tr>
))}
</tbody>
</table>
</div>
)}



{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
         {viewpatientappointment && selectedpatientappointment && (
         <div id="viewpatientappointment" className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
           <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] mt-10  animate-fadeInUp ">
                 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                 <Link to=""><div id="patientcard"  className=" flex justify-center items-start mt-5 ml-3 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-300 ease-in-out  rounded-2xl w-[500px] h-[80px]">
        <div className="w-max mr-3 h-full  rounded-2xl flex justify-center items-center">
        <img  src={selectedpatientappointment?.patientappointmentprofilepicture || defaultprofilepic}  alt="Profile" className="h-20 w-20 rounded-full object-cover"></img>
        </div>
        <div className="bg-white  flex flex-col justify-center items-start pl-2 pr-2 w-[500px] h-full  rounded-3xl">
          <h1 className="font-albertsans font-bold text-[20px] w-full text-[#2d3744]"> {selectedpatientappointment?.patientappointmentfirstname || ''} {selectedpatientappointment?.patientappointmentlastname || ''}</h1>
          <p className="text-[15px]  w-full text-[#535354]">{selectedpatientappointment?.patientappointmentemail || ''}</p>
        </div>
    </div>
    </Link> 
                   <div onClick={() => {setviewpatientappointment(false); setambhereyespecialist('');}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                 </div>






  <div className="mt-10 flex justify-start items-start  w-full rounded-3xl ">
{selectedpatientappointment.patientambherappointmentdate && (


<div className="flex flex-col mr-3 bg-[#fdfdfd]    h-auto w-full rounded-3xl">
<div className="flex p-3">
<img src={ambherlogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#237234] mt-1 ml-3">Ambher Optical</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientambherappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientambherappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientambherappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientambherappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientambherappointmentstatus}</span>
</div>

<div className="flex ">     

<div className="flex flex-col w-full pr-3">           
<div className=" flex flex-col h-fit form-group ml-3  mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientambherappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" required={!!ambherservicesselected}/>*/}
<div className="h-max w-full  flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientambherappointmentstatus === "Accepted" ||
selectedpatientappointment.patientambherappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientambherappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientambherappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientambherappointmenttime)})</span></h1>


{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientambherappointmentpaymentotal}
</p>

</div>
)}
</div>

</div>





</div>

</div>

<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcataractscreening} type="checkbox" name="patientambherappointmentcataractscreening" id="patientambherappointmentcataractscreening" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcataractscreening">Visual/Cataract Screening</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricassessment} type="checkbox" name="patientambherappointmentpediatricassessment" id="patientambherappointmentpediatricassessment" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricassessment">Pediatric Assessment</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentpediatricoptometrist} type="checkbox" name="patientambherappointmentpediatricoptometrist" id="patientambherappointmentpediatricoptometrist" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentpediatricoptometrist">Pediatric Optometrist</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcolorvisiontesting} type="checkbox" name="patientambherappointmentcolorvisiontesting" id="patientambherappointmentcolorvisiontesting" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcolorvisiontesting">Color Vision Testing</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentlowvisionaid} type="checkbox" name="patientambherappointmentlowvisionaid" id="patientambherappointmentlowvisionaid" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentlowvisionaid">Low Vision Aid</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentrefraction} type="checkbox" name="patientambherappointmentrefraction" id="patientambherappointmentrefraction" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentrefraction">Refraction</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientambherappointmentcontactlensefitting} type="checkbox" name="patientambherappointmentcontactlensefitting" id="patientambherappointmentcontactlensefitting" />
<label className="text-[18px]   font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentcontactlensefitting">Contact Lense Fitting</label>   
</div>  

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientambherappointmentotherservice}  type="checkbox" name="patientambherappointmentotherservice" id="patientambherappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentotherservice">Other</label>   
</div>  


{selectedpatientappointment.patientambherappointmentotherservice && (
<div className="mt-3 ml-17 flex">
 <p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientambherappointmentotherservicenote}</p>
</div>
)}   


{selectedpatientappointment.patientambherappointmentstatus === "Pending" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6 mr-4" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><AmbhereyespecialistBox value={ambhereyespecialist} onChange={(e) => setambhereyespecialist(e.target.value)} /></div>  

{ambhereyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Ambher Appointment</h1>
)}
</div>
)} 
</div>


)}



{selectedpatientappointment.patientambherappointmentstatus === "Accepted" && (
<div id="patientambherappointmentpaymentotal" className="mt-7 ml-6 " >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Ambher Optical  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={ambherappointmentpaymentotal} onChange={(e) => setambherappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientambherappointmentpaymentotal" id="patientambherappointmentpaymentotal" placeholder="Total Payment"/>



<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarkssubject} onChange={(e) => {setambherappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentconsultationremarks} onChange={(e) => {setambherappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={ambherappointmentprescription} onChange={(e) => {setambherappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{ambherappointmentpaymentotal && ambherappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'ambher')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Ambher Appointment</h1>
)}
</div>
)}


</div>
)}



{selectedpatientappointment.patientambherappointmentstatus === "Completed" && (
<div id="patientambherappointmentpaymentotal" className="mt-15" >


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarkssubject}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientambherappointmentconsultationremarks}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientambherappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientambherappointmentprescription}</p>
</div>


{selectedpatientappointment.patientambherappointmentrating != 0 && selectedpatientappointment.patientambherappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientambherappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientambherappointmentfeedback}</p>
</div>
)} 

</div>
)}



</div>

</div>
)}



</div>


<div className="w-full mt-5 p-3 flex flex-col mb-7 bg-[#e5e7eb] rounded-2xl  ">
          <label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientadditionalappointmentnotes">Patient Appointment Notes :</label>  

           <div>{selectedpatientappointment.patientadditionalappointmentnotes ||"No additional notes"}</div>
                                 <div className=" w-fit h-fit mt-5 mb-5">
                                 <img className=" object-cover  rounded-2xl" src={selectedpatientappointment.patientadditionalappointmentnotesimage || defaultimageplaceholder}/>                 
                                 </div>
          </div>
           </div>

         </div>
      )}


</div>)}







{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}{/*Bautista Appointments Table*/}
{ activeappointmentstable === 'bautistaappointmentstable' && ( <div id="bautistaappointmentstable" className="animate-fadeInUp flex flex-col border-t-2 border-[#909090] w-[100%] flex-1 rounded-2xl mt-5 min-h-0" ref={appointmentTableRef}>
<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input type="text" placeholder="Enter appointment details..." className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"></input></div></div>
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
) : patientappointments.length === 0 ? (
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">No patient appointments found.</div>

) :(<div className=" rounded-3xl h-full w-full mt-2 bg-[#f7f7f7]">
<table className="min-w-full divide-y divide-gray-200">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Bautista Appoinment</th>
<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className="divide-y divide-gray-200 bg-white">
{patientappointments.filter(appointment =>{
if(activeappointmentstable === 'bautistaappointmentstable'){
return appointment.patientbautistaappointmentdate !== "" &&
   appointment.patientbautistaappointmenttime !== "" &&
   appointment.patientbautistaappointmentid !== null;
}
return true;
}).map((appointment) => (
<tr 
key={appointment._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6  text-center font-albertsans text-[#171717]font-medium whitespace-nowrap">
#{appointment.patientappointmentid}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
     <div className="flex  items-center whitespace-nowrap">
  <img 
    src={appointment.patientappointmentprofilepicture} 
    alt="Profile" 
    className=" rounded-full h-12 mr-3 w-12 object-cover"
    onError={(e) => {
      e.target.src = 'default-profile-url';
    }}
  />
  <h1 className="font-albertsans text-[#171717]font-medium whitespace-nowrap">{appointment.patientappointmentfirstname} {appointment.patientappointmentlastname}</h1>
  </div>
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
  <span className="font-albertsans text-[#171717]font-medium whitespace-nowrap">
    {new Date(appointment.createdAt).toLocaleDateString('en-US',{
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}  
  </span>          
</td>



<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
{appointment.patientbautistaappointmentdate && (
  <div className="font-albertsans text-[#171717] font-medium flex justify-center items-center whitespace-nowrap">
    <span className="font-albertsans text-[#171717] font-medium whitespace-nowrap">{formatappointmatedates(appointment.patientbautistaappointmentdate)}</span> 
    <span className="ml-1 font-albertsans text-[#171717] font-medium whitespace-nowrap">({formatappointmenttime(appointment.patientbautistaappointmenttime)})</span> 
    
<span className={`ml-3 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${appointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
appointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
appointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
appointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#103d4a]':
'bg-red-100 text-red-800'}`}>{appointment.patientbautistaappointmentstatus}</span>
  </div>
)}
</td>



<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">

<div onClick={() => {handleviewappointment(appointment); setviewpatientappointment(true);}}
  className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>

<div onClick={() =>  {setdeletepatientappointment(true);
                setselectedpatientappointment(appointment);
}}
className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>

      {deletepatientappointment && (
         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#0000004a] bg-opacity-50">

           <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
 

              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Appointment</h1></div>
              <div className="flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                  <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this appointment?</p>
                  {selectedpatientappointment && ( <>
                            <p className="text-[18px] mt-3">Appointment Id: {selectedpatientappointment.patientbautistaappointmentid}</p> </>)}  
                  </div>        
                  <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                    <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => setdeletepatientappointment(false)}><p className=" text-[#ffffff]">Cancel</p></div>
                    <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {handledeleteappointmentbyclinic(selectedpatientappointment.patientappointmentid, 'bautista') ;setdeletepatientappointment(false); }}><p className=" text-[#ffffff]">Delete</p></div>
                  </div>
              </div>

           </div>
         </div>
      )}


      

</td>
</tr>
))}
</tbody>
</table>
</div>
)}

{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
{/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/} {/*Viewing Appointment Details*/}
         {viewpatientappointment && selectedpatientappointment && (
         <div id="viewpatientappointment" className="overflow-y-auto h-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
           <div className="pl-5 pr-5 bg-white rounded-2xl w-[1300px] mt-10  animate-fadeInUp ">
                 <div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
                 <Link to=""><div id="patientcard"  className=" flex justify-center items-start mt-5 ml-3 hover:scale-105 hover:cursor-pointer bg-white transition-all duration-300 ease-in-out  rounded-2xl w-[500px] h-[80px]">
        <div className="w-max mr-3 h-full  rounded-2xl flex justify-center items-center">
        <img  src={selectedpatientappointment?.patientappointmentprofilepicture || defaultprofilepic}  alt="Profile" className="h-20 w-20 rounded-full object-cover"></img>
        </div>
        <div className="bg-white  flex flex-col justify-center items-start pl-2 pr-2 w-[500px] h-full  rounded-3xl">
          <h1 className="font-albertsans font-bold text-[20px] w-full text-[#2d3744]"> {selectedpatientappointment?.patientappointmentfirstname || ''} {selectedpatientappointment?.patientappointmentlastname || ''}</h1>
          <p className="text-[15px]  w-full text-[#535354]">{selectedpatientappointment?.patientappointmentemail || ''}</p>
        </div>
    </div>
    </Link> 
                   <div onClick={() => {setviewpatientappointment(false); setbautistaeyespecialist('');}} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
                 </div>






  <div className="mt-10 flex justify-start items-start  w-full rounded-3xl ">








{selectedpatientappointment.patientbautistaappointmentdate && (
<div className="flex flex-col bg-[#fdfdfd]  h-auto w-full rounded-3xl">
<div className="flex p-3 ">
<img src={bautistalogo} className="w-15"/>  
<h1 className="font-albertsans font-bold text-[20px] text-[#2387c5] mt-1 ml-3">Bautista Eye Center</h1>
<span className={`ml-5 font-albertsans font-semibold rounded-full text-[15px] leading-5 px-4 py-2 inline-flex
${selectedpatientappointment.patientbautistaappointmentstatus === 'Cancelled' ? 'bg-[#9f6e61] text-[#421a10]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Pending' ? 'bg-yellow-100 text-yellow-800':
selectedpatientappointment.patientbautistaappointmentstatus === 'Accepted' ? 'bg-[#9edc7a] text-[#2b5910]':
selectedpatientappointment.patientbautistaappointmentstatus === 'Completed' ? 'bg-[#74c4ce] text-[#1a5566]':
'bg-red-100 text-red-800'}`}>{selectedpatientappointment.patientbautistaappointmentstatus}</span>
</div>



<div className="flex flex-col mr-3 pr-8 bg-[#fdfdfd] h-auto  w-full rounded-3xl">


<div className="flex flex-col  w-full">           
<div className="mr-10 flex flex-col h-fit form-group ml-3 mt-4 w-full ">
<label className="text-[18px]  font-bold  text-[#434343] "htmlFor="patientbautistaappointmentdate">Appointment Details : </label>     
{/*<input className="h-10 w-60 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold"   type="date" name="patientbautistaappointmentdate" id="patientbautistaappointmentdate" placeholder="" required={!!bautistaservicesselected}/>*/}
<div className="h-max w-full flex flex-col items-start p-3 mt-2 justify-start border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold">
{(selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" ||
selectedpatientappointment.patientbautistaappointmentstatus === "Completed") && (

<h1>{selectedpatientappointment.patientbautistaappointmenteyespecialist}</h1>

)}
<h1>{formatappointmatedates(selectedpatientappointment.patientbautistaappointmentdate)} <span className="ml-2">({formatappointmenttime(selectedpatientappointment.patientbautistaappointmenttime)})</span></h1>


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-5.5" >
<h3 className="font-bold text-[15px] text-[#1a690e]">Payment Total:</h3>
<p className="text-[#2d2d44] text-[18px]">
₱{selectedpatientappointment.patientbautistaappointmentpaymentotal}
</p>
</div>
)}
</div>

</div>





</div>



<div className="p-4">
<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentcomprehensiveeyeexam} type="checkbox" name="patientbautistaappointmentcomprehensiveeyeexam" id="patientbautistaappointmentcomprehensiveeyeexam" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcomprehensiveeyeexam">Comprehensive Eye Exam</label>   
</div>

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentdiabeticretinopathy} type="checkbox" name="patientbautistaappointmentdiabeticretinopathy" id="patientbautistaappointmentdiabeticretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentdiabeticretinopathy">Diabetic Retinopathy</label>   
</div>   

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentglaucoma} type="checkbox" name="patientbautistaappointmentglaucoma" id="patientbautistaappointmentglaucoma" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentglaucoma">Glaucoma</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmenthypertensiveretinopathy} type="checkbox" name="patientbautistaappointmenthypertensiveretinopathy" id="patientbautistaappointmenthypertensiveretinopathy" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmenthypertensiveretinopathy">Hypertensive Retinopathy</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentretinolproblem} type="checkbox" name="patientbautistaappointmentretinolproblem" id="patientbautistaappointmentretinolproblem" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentretinolproblem">Retinol Problem</label>   
</div>    

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentcataractsurgery} type="checkbox" name="patientbautistaappointmentcataractsurgery" id="patientbautistaappointmentcataractsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentcataractsurgery">Cataract Surgery</label>   
</div>      

<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all" checked={selectedpatientappointment.patientbautistaappointmentpterygiumsurgery} type="checkbox" name="patientbautistaappointmentpterygiumsurgery" id="patientbautistaappointmentpterygiumsurgery" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentpterygiumsurgery">Pterygium Surgery</label>   
</div>  


<div className="flex items-center mt-5 ml-7">
<input className="w-7 h-7 mr-3 appearance-none border-2 border-[#2d2d44] rounded-md checked:bg-[#2d2d44] checked:border-[#2d2d44] after:text-white after:text-lg after:absolute after:left-1/2 after:top-1/2 after:content-['✓'] after:opacity-0 after:-translate-x-1/2 after:-translate-y-1/2 checked:after:opacity-100 relative cursor:pointer transition-all"  checked={selectedpatientappointment.patientbautistaappointmentotherservice} onChange={(e) => setshowotherpatientbautistaappointmentotherservice(e.target.checked)}  type="checkbox" name="patientbautistaappointmentotherservice" id="patientbautistaappointmentotherservice" />
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentotherservice">Other</label>   
</div>  


{selectedpatientappointment.patientbautistaappointmentotherservice && (
<div className="mt-3 ml-17">
<p className="text-[18px]  font-medium font-albertsans  text-[#343436] ">- {selectedpatientappointment.patientbautistaappointmentotherservicenote}</p>
</div>
)}    



{selectedpatientappointment.patientbautistaappointmentstatus === "Pending" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="font-bold text-[17px] text-[#343436] mb-3">Eye Specialist : </h1>
<div className=""><BautistaeyespecialistBox value={bautistaeyespecialist} onChange={(e) => setbautistaeyespecialist(e.target.value)}/></div>
{bautistaeyespecialist && (
<div 
onClick={() => !isAcceptingAppointment && handleacceptappointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isAcceptingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5f9e1b] hover:bg-[#55871f] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isAcceptingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accepting...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Accept Bautista Appointment</h1>
)}
</div>
)}
</div>
)}



{selectedpatientappointment.patientbautistaappointmentstatus === "Accepted" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-7 ml-6" >
<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436]mb-3">Total Payment for Bautista Eye Center  : </h1>
<input className="w-full border-b-2 border-gray-600  text-[18px]  font-semibold font-albertsans  text-[#343436]"  value={bautistaappointmentpaymentotal} onChange={(e) => setbautistaappointmentpaymentotal(Number(e.target.value))}  type="number" name="patientbautistaappointmentpaymentotal" id="patientbautistaappointmentpaymentotal" placeholder="Total Payment"/>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarkssubject} onChange={(e) => {setbautistaappointmentconsultationremarkssubject(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentconsultationremarks} onChange={(e) => {setbautistaappointmentconsultationremarks(e.target.value); adjusttextareaheight();}} placeholder="Specify findings or remarks..."/>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Prescription :</label>  
<textarea className="w-full text-[18px]  font-semibold font-albertsans  text-[#343436] rounded-md border-2 border-[#2d2d44]  " ref={textarearef} rows={1} style={{minHeight:'44px'}} type="text" value={bautistaappointmentprescription} onChange={(e) => {setbautistaappointmentprescription(e.target.value); adjusttextareaheight();}} placeholder="Specify prescription if available..."/>
</div>


{bautistaappointmentpaymentotal && bautistaappointmentconsultationremarks && (
<div 
onClick={() => !isCompletingAppointment && handleCompleteAppointment(selectedpatientappointment.patientappointmentid, 'bautista')} 
className={`${isCompletingAppointment ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2d91cf] hover:bg-[#1b6796] hover:cursor-pointer'} mt-4 h-[50px] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-[20px]`}
>
{isCompletingAppointment ? (
<div className="flex items-center">
<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
<h1 className="text-white font-albertsans font-semibold text-[20px]">Completing...</h1>
</div>
) : (
<h1 className="text-white font-albertsans font-semibold text-[20px]">Complete Bautista Appointment</h1>
)}
</div>
)}

</div>
)}


{selectedpatientappointment.patientbautistaappointmentstatus === "Completed" && (
<div id="patientbautistaappointmentpaymentotal" className="mt-15" >

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarkssubject">Consultation Subject :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarkssubject}</p>
</div>

<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentconsultationremarks">Consultation Remarks :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentconsultationremarks}</p>
</div>


<div className="mt-3 w-full flex flex-col">
<label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientbautistaappointmentprescription">Presciption :</label>  
<p>{selectedpatientappointment.patientbautistaappointmentprescription}</p>
</div>


{selectedpatientappointment.patientbautistaappointmentrating != 0 && selectedpatientappointment.patientbautistaappointmentfeedback != "" && (
<div className="mt-10"> 

<h1 className="text-[18px]  font-semibold font-albertsans  text-[#343436] ">Patient Feedback :</h1>           
<Stack spacing={1}>
<Rating size="large" value={selectedpatientappointment.patientbautistaappointmentrating} readOnly /> 
</Stack>  
<p>{selectedpatientappointment.patientbautistaappointmentfeedback}</p>
</div>
)} 


</div>
)}



</div>

</div>
</div>
)}
</div>




<div className="w-full mt-5 p-3 flex flex-col mb-7 bg-[#e5e7eb] rounded-2xl  ">
          <label className="text-[18px]  font-semibold font-albertsans  text-[#343436] "htmlFor="patientadditionalappointmentnotes">Patient Appointment Notes :</label>  

           <div>{selectedpatientappointment.patientadditionalappointmentnotes ||"No additional notes"}</div>
                                 <div className=" w-fit h-fit mt-5 mb-5">
                                 <img className=" object-cover  rounded-2xl" src={selectedpatientappointment.patientadditionalappointmentnotesimage || defaultimageplaceholder}/>                 
                                 </div>
          </div>
           </div>

         </div>
      )}


</div> )}

 </div>)}

{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 
{/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} {/*END OF APPOINTMENT MANAGEMENT*/} 











{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}
{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}{/*Start of Medical Records*/}

{ (activedashboard === 'medicalrecords' && !isAdminRole) && (<div id="medicalrecords" className="pl-5 pr-5 pb-4 pt-4 transition-all duration-300  ease-in-out border-1 bg-white border-gray-200 shadow-lg w-[100%] h-[100%] rounded-2xl" >   
  


<div className="flex items-center"><i className="bx bxs-data text-[#184d85] text-[25px] mr-2"/> <h1 className=" font-albertsans font-bold text-[#184d85] text-[25px]">Medical Records</h1></div>

















{ activemedicalrecordstable === 'allmedicalrecordstable' && ( <div id="allmedicalrecordstable" className="animate-fadeInUp flex flex-col items-center border-t-2  border-[#909090] w-[100%] h-[90%] rounded-2xl mt-5" >

<div className=" mt-5  w-full h-[60px] flex justify-between rounded-3xl pl-5 pr-5">              
<div className="ml-2 w-full flex items-center"><h2 className="font-albertsans font-bold text-[18px] text-[#383838] mr-3 ">Search: </h2><div className="relative w-full flex items-center justify-center gap-3"><i className="bx bx-search absolute left-3 text-2xl text-gray-500"></i><input 
type="text" 
placeholder="Enter medical record details..." 
value={searchmedicalrecords}
onChange={(e) => setsearchmedicalrecords(e.target.value)}
className="transition-all duration-300 ease-in-out py-2 pl-10 w-full rounded-2xl bg-[#e4e4e4] focus:bg-slate-100 focus:outline-sky-500"
/></div></div>
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
<div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">No patient medical records found.</div>

) :(

<div className="overflow-y-auto overflow-hidden rounded-3xl  w-full mt-2 bg-[#f7f7f7] ">
<table className=" min-w-full divide-y divide-gray-200 ">
<thead className="bg-">
<tr className="text-[#ffffff] font-albertsans font-bold bg-[#2781af] rounded-tl-2xl rounded-tr-2xl">
<th className="rounded-tl-2xl pb-3 pt-3 pl-2 pr-2 text-center">ID</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Patient</th> 
<th className=" pb-3 pt-3 pl-2 pr-2 text-center">Last Ambher Appointment</th> 
<th className="pb-3 pt-3 pl-2 pr-2  text-center">Last Bautista Appointment</th>


<th className="rounded-tr-2xl pb-3 pt-3 pl-2 pr-2  text-center">Actions</th>
</tr>
</thead>


<tbody className=" divide-y divide-gray-200 bg-white  ">

{filteredmedicalrecords.map((patients) => (
<tr 
key={patients._id}
className="hover:bg-gray-50 transition-all ease-in-out duration-300 border-b-2"
>
<td className="py-3 px-6 font-albertsans text-[#171717]  text-center text-[15px] font-medium ">
#{patients.patientdemographicId}
</td>
<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">
     <div className="flex  items-center">
  <img 
    src={patients.patientprofilepicture} 
    alt="Profile" 
    className=" rounded-full h-12 mr-3 w-12 object-cover"
    onError={(e) => {
      e.target.src = 'default-profile-url';
    }}
  />
  <h1 className="font-albertsans text-[#171717]  text-center text-[15px] font-medium ">{patients.patientfirstname} {patients.patientlastname}</h1>
  </div>
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">
  {(() => {
  const lastambherappointment = patientappointments
                                  .filter(lastapp => lastapp.patientappointmentemail === patients.patientemail && lastapp.patientambherappointmentdate && lastapp.patientambherappointmentstatus === 'Completed')
                                  .sort((a,b) => new Date(b.patientambherappointmentdate) - new Date(a.patientambherappointmentdate))[0];
  
  return lastambherappointment ? (
    <div>
      <p>{formatappointmatedates(lastambherappointment.patientambherappointmentdate)}</p>
      <p className="text-gray-500 text-[14px]">{formatappointmenttime(lastambherappointment.patientambherappointmenttime)}</p>
    </div>
  ):(
    <p className="text-gray-500">No completed appointments</p>
  );
 })()}
</td>

<td className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">
 {(() => {
  const lastbautistaappointment = patientappointments
                                  .filter(lastapp => lastapp.patientappointmentemail === patients.patientemail && lastapp.patientbautistaappointmentdate  && lastapp.patientbautistaappointmentstatus === 'Completed')
                                  .sort((a,b) => new Date(b.patientbautistaappointmentdate) - new Date(a.patientbautistaappointmentdate))[0];
  
  return lastbautistaappointment ? (
    <div>
      <p>{formatappointmatedates(lastbautistaappointment.patientbautistaappointmentdate)}</p>
      <p className="text-gray-500 text-[14px]">{formatappointmenttime(lastbautistaappointment.patientbautistaappointmenttime)}</p>
    </div>
  ):(
    <p className="text-gray-500">No completed appointments</p>
  );
 })()}
</td>





<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">

<div onClick={() =>  {setshowpatientmedicalrecord(true);
                    setselectedpatientmedicalrecord(patients);}} className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white">View</h1></div>




      

</td>
</tr>
))}
</tbody>
</table>
</div>
)}

</div> )}




{showpatientmedicalrecord && (
<div id="patientdemographicprofileform" className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="pl-5 pr-5 pb-5 bg-white rounded-2xl w-[1300px] h-[780px]  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Patient Medical Record</h1></div>
  <div onClick={() => setshowpatientmedicalrecord(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<div className="flex justify-center items-center rounded-2xl h-[670px] w-full">
  <div className=" flex flex-col pt-10 pl-3 items-center h-full w-[35%]  rounded-2xl">
      <img src={selectedpatientmedicalrecord.patientprofilepicture} className="w-65 h-65 rounded-full"></img>
       <div className="mt-10  flex  items-center h-auto w-full">
        <h1 className="  w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Name :</h1>
        <p className=" text-center bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientfirstname}  {selectedpatientmedicalrecord.patientlastname}</p>
       </div>
       <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className=" w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Email :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientemail}</p>
       </div>
        <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className=" w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Contact No :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientcontactnumber}</p>
       </div>
        <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className="w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Gender :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{selectedpatientmedicalrecord.patientgender}</p>
       </div>
        <div className="mt-3   flex  items-center h-auto w-full">
        <h1 className=" w-[130px] font-albertsans font-semibold italic text-[#3d3d3d] text-[20px]">Bithdate :</h1>
        <p className=" text-center  bg-[#e5e7eb] px-4 rounded-2xl py-1 font-albertsans font-semibold italic text-[#3d3d3d] text-[19px]">{formatappointmatedates(selectedpatientmedicalrecord.patientbirthdate)}</p>
       </div>
                    


  </div>
  <div className="h-full flex flex-col  w-[65%] px-3 rounded-2xl">
      <div className="flex justify-center items-center mt-3 w-full h-[60px]">
      <div onClick={() => showpatientmedicalrecordstable('medicalrecordsconsultationtable')}  className={`cursor-pointer w-full mr-5 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activepatientmedicalrecordstable ==='medicalrecordsconsultationtable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d] ${activepatientmedicalrecordstable ==='medicalrecordsconsultationtable' ? 'text-white' : ''}`}>Consultation</h1></div>
      <div onClick={() => showpatientmedicalrecordstable('medicalrecordspastvisitstable')}  className={`cursor-pointer w-full ml-5 hover:rounded-2xl transition-all duration-300 ease-in-out  border-2 b-[#909090] rounded-3xl pl-25 pr-25 pb-3 pt-3 text-center flex justify-center items-center ${activepatientmedicalrecordstable ==='medicalrecordspastvisitstable' ? 'bg-[#2781af] rounded-2xl' : ''}`}><h1 className= {`font-albertsans font-semibold text-[#5d5d5d]   ${activepatientmedicalrecordstable ==='medicalrecordspastvisitstable' ? 'text-white' : ''}`}>Other Clinic Records</h1></div>
      </div>

 { activepatientmedicalrecordstable === 'medicalrecordsconsultationtable' && (
  <div  id='medicalrecordsconsultationtable'className="border-10 overflow-y-auto p-2 w-full h-full bg-[#e5e7eb] mt-3 rounded-2xl">  

   {(() => {
          
           const completedAppointments = patientappointments
             .filter(appointment => 
                     appointment.patientappointmentemail === selectedpatientmedicalrecord.patientemail && 
                     ((appointment.patientambherappointmentstatus === 'Completed') || 
                      (appointment.patientbautistaappointmentstatus === 'Completed')))

             .flatMap(appointment => {
                const appointments = [];

                if(appointment.patientambherappointmentstatus === 'Completed'){
                  appointments.push({
                      ...appointment,
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
                      consultationprescription: appointment.patientambherappointmentprescription
                  });  
                }


                if(appointment.patientbautistaappointmentstatus === 'Completed'){
                  appointments.push({
                      ...appointment,
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
                      consultationprescription: appointment.patientbautistaappointmentprescription
                  });  
                }

                return appointments;
             })
             .sort((a, b) => {
                const datea = new Date(a.date);
                const dateb = new Date(b.date);
                return dateb - datea;
             });
             

       return completedAppointments.map((appointment, index) => (

         <div key={index} className="pl-3 mt-3 w-full h-[80px] shadow-sm bg-white rounded-2xl flex justify-between items-center">
            <div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
                <h1 className="font-albertsans truncate w-full font-semibold text-[#134882] text-[18px]">{appointment.consultationremarkssubject}</h1>
            </div>


            <div className=" px-2 flex flex-col justify-center items-center rounded-2xl h-full w-[220px]">
              <h1 className="font-medium truncate w-full">{formatappointmatedates(appointment.date)}</h1> 
              <h1 className="text-[#4a4a4a] font-sm truncate w-full">{formatappointmenttime(appointment.time)}</h1> 
            </div>

            <div className=" px-2 flex justify-center items-center rounded-2xl h-full w-[220px] ">
              <h1 className="font-medium truncate w-full">{appointment.eyespecialist}</h1>
            </div>

              <div className="rounded-2xl h-full w-auto mr-4 flex justify-center items-center "><div onClick={() => {setshowpatientmedicalrecordconsultation(true);setselectedpatientappointment(appointment);}} className="bg-[#383838]  hover:bg-[#595959]   transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><h1 className="text-white ">View</h1></div></div>
            </div>

             ));
             
      })()}      

</div>
)}









{/*AICODE*/}

 { activepatientmedicalrecordstable === 'medicalrecordspastvisitstable' && (
  <div  id='medicalrecordspastvisitstable'className="  p-2 w-full h-full mt-3 rounded-2xl">  
     <div onClick={() => setshowpatientaddothermedicalrecord(true)}  className="py-2 mb-1 hover:cursor-pointer hover:scale-103 bg-[#4ca22b] rounded-3xl flex justify-center items-center pl-3 pr-3 transition-all duration-300 ease-in-out"><i className="bx bx-user-plus text-white font-bold text-[30px]"/><p className="font-bold font-albertsans text-white text-[18px] ml-2">Add Record</p></div>
  <div className="border-10 overflow-y-auto p-2 w-full h-[530px] bg-[#e5e7eb] mt-3 rounded-2xl"> 

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
<div className="text-center text-red-500 mt-4 p-4 bg-red-50 rounded-2xl">
<i className="bx bx-error text-2xl mb-2"></i>
<p>{patientdemoerror}</p>
<button 
  onClick={() => fetchDemographicsData(true)} 
  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
>
  Retry
</button>
</div>
);
}

console.log('Filtering records for patient:', selectedpatientmedicalrecord?.patientemail);
console.log('Total otherclinicrecords:', otherclinicrecords?.length || 0);
console.log('Sample record emails:', (Array.isArray(otherclinicrecords) ? otherclinicrecords : []).slice(0, 3).map(r => r.patientotherclinicemail));

const filteredRecords = (Array.isArray(otherclinicrecords) ? otherclinicrecords : [])
.filter(record => {
const recordEmail = record.patientotherclinicemail?.toLowerCase()?.trim();
const selectedEmail = selectedpatientmedicalrecord.patientemail?.toLowerCase()?.trim();
const matches = recordEmail === selectedEmail;
if (matches) {
console.log('Found matching record:', record);
}
return matches;
})
.sort((a, b) => new Date(b.patientotherclinicconsultationdate) - new Date(a.patientotherclinicconsultationdate));

console.log('Filtered records count:', filteredRecords.length);

if (filteredRecords.length === 0) {
return <div className="text-center text-gray-500 mt-4">No other clinic records found</div>;
}

return filteredRecords.map((record) => (
<div key={record._id || record.otherclinicid} className="pl-3 mt-3 w-full h-[80px] shadow-sm bg-white rounded-2xl flex justify-between items-center">
<div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
<h1 className="font-albertsans truncate w-full font-semibold text-[#134882] text-[18px]">{record.patientotherclinicname}</h1>
</div>

<div className="px-2 flex flex-col justify-center items-center rounded-2xl h-full w-[220px]">
<h1 className="font-medium truncate w-full">{formatappointmatedates(record.patientotherclinicconsultationdate)}</h1>
</div>

<div className="px-2 flex justify-center items-center rounded-2xl h-full w-[220px]">
<h1 className="font-medium truncate w-full">{record.patientothercliniceyespecialist}</h1>
</div>

<div className="rounded-2xl h-full w-auto mr-4 flex justify-center items-center">
<div 
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
      patientotherclinicrecordimage: record.patientotherclinicrecordimage
    });
  }} 
  className="bg-[#383838] hover:bg-[#595959] transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"
>
  <h1 className="text-white">View</h1>
</div>

<div onClick={() =>  {
    setselectedpatientappointment({
      ...record,
      otherclinicid: record.patientotherclinicrecordid,
      date: record.patientotherclinicconsultationdate,
      eyespecialist: record.patientothercliniceyespecialist,
      clinicname: record.patientotherclinicname,
      submittedbyfirstname: record.patientotherclinicsubmittedbyfirstname,
      submittedbymiddlename: record.patientotherclinicsubmittedbymiddlename,
      submittedbylastname: record.patientotherclinicsubmittedbylastname,
      patientotherclinicrecordimage: record.patientotherclinicrecordimage
    });
  setshowdeleteotherclinicrecorddialog(true);}}

 className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-3 ml-2 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div>
</div>
</div>
));
})()}

          
          
  </div>
   </div>
 )}


   
  </div>
</div>


</div>




</div>)}


{showpatientmedicalrecordconsultation && (
<div id="patientdemographicprofileformconsultation" className="overflow-y-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="mt-50 mb-30 pl-5 pr-5 pb-5 bg-white rounded-2xl w-[800px] h-max  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">View Consultation</h1></div>
  <div onClick={() => setshowpatientmedicalrecordconsultation(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

  <div className="px-2 pt-5 flex flex-col  h-max w-full rounded-2xl ">
    <div className="w-full h-auto flex justify-between items-center">
    <h1 className="font-albertsans font-bold text-[17px] text-[#2b2b2b]"><span className="text-[#333333] text-[19px] font-albertsans font-semibold">{selectedpatientappointment.eyespecialist}</span></h1>
    <div className="pr-4 flex flex-col justify-center items-center">
    <h1 className="text-[#333333] text-[17px] font-albertsans font-semibold"> {formatappointmatedates(selectedpatientappointment.date)}</h1>
    <h1 className="text-[#333333] text-[15px] font-albertsans font-medium"> {formatappointmenttime(selectedpatientappointment.time)}</h1>
    </div>
  </div>


      <h1 className="text-[#333333] text-[16px] mt-15 font-albertsans font-semibold">{selectedpatientappointment.consultationremarkssubject}</h1>
      <h1 className="text-[#333333] text-[15px]  font-albertsans font-medium mt-1"> - {selectedpatientappointment.consultationremarks}</h1>
    <div className="p-2 w-full h-auto rounded-2xl border-3 mt-3 bg-[#e5e7eb]">

      <h1 className="text-[#333333] text-[15px] font-albertsans font-bold mt-1">Prescription</h1>
      <h1 className="break-words min-w-0 text-[#333333] text-[15px] font-albertsans font-medium mt-1"> {selectedpatientappointment.consultationprescription}</h1>
    </div>

  </div>



</div>




</div>)}







{showpatientaddothermedicalrecord && (
<div id="patientshowpatientaddothermedicalrecord" className=" bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="  pl-5 pr-5 pb-5 bg-white rounded-2xl w-[800px] h-max  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">Add Other Clinic Record</h1></div>
  <div onClick={() => setshowpatientaddothermedicalrecord(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={submitotherclinicdata}>
<div className="px-2 pt-5 flex flex-col justify-center items-center  h-max w-full rounded-2xl ">
           <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="otherclinicname">Clinic :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={otherclinicname} onChange={(e) => setotherclinicname(e.target.value)} id="otherclinicname" name="otherclinicname" required  placeholder="Other clinic name..."/>
                </div>
            </div>


            <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="othercliniceyespecialist">Eye Specialist :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={othercliniceyespecialist} onChange={(e) => setothercliniceyespecialist(e.target.value)} id="othercliniceyespecialist" name="othercliniceyespecialist" required  placeholder="Eye specialist name..."/>
                </div>
            </div>

            <div className="form-group flex  items-center mb-3">
               <label className=" w-[192px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]"htmlFor="otherclinicconsultationdate">Consulted Date: </label>     
               <input className=" h-10 w-114 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold" value={otherclinicconsultationdate} onChange={(e) => setotherclinicconsultationdate(e.target.value)} type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" /> </div>
       


            <div className="flex flex-col justify center items-center w-fit h-fit mt-5">

              {!otherclinicselectedimage && (<div onClick={otherclinichandleuploadclick}  className="  w-80 h-80 mt-5 flex justify-center items-center    rounded-2xl cursor-pointer transition-all" ><img src={addimage} className=" w-60 h-60 object-cover"/></div>
              )}      

              {otherclinicselectedimage && 
              (
                <div className="w-80 h-80 flex justify-center items-center relative rounded-2xl overflow-hidden">
               <div onClick={otherclinichandleremoveprofile} className="absolute top-0 right-0   flex justify-center items-center align-middle p-1 bg-[#333333] rounded-full hover:cursor-pointer transition-all" ><i className="bx bx-x font-bold text-[30px] text-white"/></div>
                <img onClick={() => setshowotherclinicrecordimage(true)} className=" cursor-pointer hover:cursor-pointer object-cover w-80 h-80 rounded-2xl" src={otherclinicpreviewimage || defaultimageplaceholder}/></div>
              )}      
 
                                
                <input  className="hidden" type="file" onChange={otherclinichandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={otherclinicimageinputref} />
          


            {otherclinicselectedimage && otherclinicname !== "" && othercliniceyespecialist!== "" &&  otherclinicconsultationdate !== "" && (

         <button type="submit" disabled={otherclinicrecordissubmitting} className="submit-btn mt-12 w-full" style={{ backgroundColor: "#2b2b44", fontSize: "20px", padding: "10px 20px", color: "white", borderRadius: "20px",   }}>
           {otherclinicrecordissubmitting ? "Submitting..." : "Submit"}
         </button>
            )}      
            </div>
</div>

</form>


</div>




</div>)}


{showotherclinicrecordimage && (
<div className="p-5 overflow-hidden fixed inset-0 flex justify-center items-center z-999 bg-[#000000af] bg-opacity-50">
<div onClick={() => setshowotherclinicrecordimage(false)} className="absolute top-3 right-3 flex justify-center items-center align-middle p-1 bg-[#333333] rounded-full hover:cursor-pointer transition-all z-[1000]" ><i className="bx bx-x font-bold text-[30px] text-white"/></div>
{selectedpatientappointment?.patientotherclinicrecordimage ? (
<img 
src={selectedpatientappointment.patientotherclinicrecordimage.startsWith('data:') 
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





{showotherclinicrecord && (

<div id="patientshowpatientaddothermedicalrecord" className="overflow-y-auto bg-opacity-0 flex justify-center items-start z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
<div className="mt-30 mb-30 pl-5 pr-5 pb-5 bg-white rounded-2xl w-[800px] h-max  animate-fadeInUp ">
<div className=" mt-5 border-3 flex justify-between items-center border-[#2d2d4400] w-full h-[70px]">
  <div className="flex justify-center items-center"><img src={darklogo} alt="Eye2Wear: Optical Clinic" className="w-15 hover:scale-105 transition-all   p-1"></img><h1 className="text-[#184d85] font-albertsans font-bold ml-3 text-[30px]">View Clinic Record</h1></div>
  <div onClick={() => setshowotherclinicrecord(false)} className="bg-[#333232] px-10 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"><i className="bx bx-x text-white text-[40px] "/></div>
</div>

<form onSubmit={submitotherclinicdata}>
<div className="px-2 pt-5 flex flex-col justify-center items-center  h-max w-full rounded-2xl ">
           <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="otherclinicname">Clinic :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={selectedpatientappointment.clinicname || ''} readOnly id="otherclinicname" name="otherclinicname" placeholder="Other clinic name..."/>
                </div>
            </div>


            <div className=" form-group flex justify-center items-center mb-3">
               <label className=" w-[180px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]" htmlFor="othercliniceyespecialist">Eye Specialist :</label>
               <div className="flex flex-col ">
               <input className="bg-gray-200 text-[20px] text-gray-600 pl-3 rounded-2xl ml-3 h-10 w-114" value={selectedpatientappointment.eyespecialist || ''} readOnly id="othercliniceyespecialist" name="othercliniceyespecialist" placeholder="Eye specialist name..."/>
                </div>
            </div>

            <div className="form-group flex  items-center mb-3">
               <label className=" w-[192px] font-albertsans font-bold italic text-[#3d3d3d] text-[20px]"htmlFor="otherclinicconsultationdate">Consulted Date: </label>     
               <input className=" h-10 w-114 p-3 mt-2 justify-center border-b-2 border-gray-600 bg-gray-200 rounded-2xl text-[#2d2d44] text-[18px]  font-semibold" value={selectedpatientappointment.date || ''} readOnly type="date" name="patientambherappointmentdate" id="patientambherappointmentdate" placeholder="" /> </div>
       


            <MedicalRecordImageViewer 
              record={selectedpatientappointment}
              loadMedicalRecordImage={loadMedicalRecordImage}
              onImageClick={() => setshowotherclinicrecordimage(true)}
             
            />
                                
            <input  classNam="hover:cursor-pointer object-cover w-80 h-80" className="hidden" type="file" onChange={otherclinichandleprofilechange} accept="image/jpeg, image/jpg, image/png" ref={otherclinicimageinputref} />

</div>
</form>
</div>
</div>
)}







{showdeleteotherclinicrecorddialog && (

           <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">

             <div className="flex flex-col items  bg-white rounded-2xl w-[600px] h-fit  animate-fadeInUp ">
             

                <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[70px] bg-[#3b1616]"><i className="ml-3 bx bxs-error text-[28px] font-albertsans font-bold text-[#f1f1f1] "/><h1 className="ml-2 text-[23px] font-albertsans font-bold text-[#f0f0f0]">Delete Clinic Record</h1></div>
                <div className="mt-10 flex flex-col  items-center  h-fit rounded-br-2xl rounded-bl-2xl">
                    <div className="px-5 flex flex-col justify-center  h-[130px] w-full"><p className="font-albertsans font-medium text-[20px]">Are you sure you want to delete this clinic record?</p>
                    {selectedpatientappointment && ( <>
                              <p className="text-[16px] mt-5 font-albertsans ">Clinic Name: {selectedpatientappointment.clinicname}</p>
                              <p className="text-[16px] mt-2 font-albertsans">Eye Specialist: {selectedpatientappointment.eyespecialist}</p>
                              <p className="text-[16px] mt-2 font-albertsans">Consulted Date: {formatappointmatedates(selectedpatientappointment.date)}</p>
                              </>)}  
                    </div>        
                    <div className="pr-5 flex justify-end  items-center  h-[80px] w-full">
                      <div className="hover:cursor-pointer mr-2 bg-[#292929] hover:bg-[#414141]   rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={() => {setshowdeleteotherclinicrecorddialog(false); setselectedpatientaccount(null);}}><p className=" text-[#ffffff]">Cancel</p></div>
                      <div className="hover:cursor-pointer bg-[#4e0f0f] hover:bg-[#7f1a1a] ml-2 rounded-2xl h-fit w-fit px-7 py-3 hover:scale-105 transition-all duration-300 ease-in-out" onClick={deleteotherclinicrecord}><p className=" text-[#ffffff]">Delete</p></div>
                    </div>
                </div>

             </div>
           </div>

)}

  
</div> )}

{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}
{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}{/*End of Medical Records*/}



























































































































































































































        
     
 

     