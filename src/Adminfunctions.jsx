



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
              <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
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
                src={patient.patientprofilepicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'default-profile-url'; 
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
              setselectededitpatientaccount({
                 id: patient._id,
                 email: patient.patientemail,
                 lastname: patient.patientlastname,
                 firstname: patient.patientfirstname,
                 middlename: patient.patientmiddlename,
                 profilepicture: patient.patientprofilepicture
                 });

              setformdata({
                role: 'Patient',
                patientemail: patient.patientemail,
                patientpassword: patient.patientpassword,
                patientlastname: patient.patientlastname,
                patientfirstname: patient.patientfirstname,
                patientmiddlename: patient.patientmiddlename,
                patientprofilepicture: patient.patientprofilepicture
              });

              setpreviewimage(patient.patientprofilepicture);
              setshowviewpatientdialog(true);}}

             className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-pencil text-white mr-1"/><h1 className="text-white">Edit</h1></div>
             
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


  const maximagefile = 1;
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 1MB");
    return;
  }

  setselectedprofile(null);
  setpreviewimage(null);

  if(imageinputref.current){
    imageinputref.current.value = "";
  }






  try{

    const imageconfiguration = {
      maximagemb: 1,
      maxworh: 800,
      useWebWorker: true,
      initialQuality: 0.8
    };


    const compressedimageprofile = await imageCompression(file, imageconfiguration);
    const reader = new FileReader();
    reader.onloadend = () => {

      if(reader.error){
        console.error("Error processing image file : ", reader.error);
        alert("Error processing image file. Try again");
        return;
      }
      setpreviewimage(reader.result);
    };


    reader.onerror = () => {
      console.error("File Reader Error : ", reader.error);
      alert("Error reading file. Try again");
      return;
    };

    reader.readAsDataURL(compressedimageprofile);
    setselectedprofile(compressedimageprofile);
  

  } catch (error) {

    console.error("Image file compression failed : ", error.message);
    alert("Image file compression failed. Try again");
    return;

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
      patientprofilepicture: previewimage || formdata.patientprofilepicture
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
            'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
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
        patientprofilepicture: previewimage || formdata.patientprofilepicture
      };

      const response = await fetch(`/api/patientaccounts/${selectededitpatientaccount.id}`,{
        method:'PUT',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}`
        },
        body: JSON.stringify(updatepatientaccountdetails)
      });


      if(!response.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update patient account");
      }

      const fetchresponse = await fetch('/api/patientaccounts',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}` 
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
    staffprofilepicture:'' // Holds the profile picture 
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
    
    }catch(error){
      setfailedloadingstaffs(error.message);
    }finally{
      setloadingstaffs(false);
    }
  };
  
  if(currentusertoken) {
    fetchstaffs();
  }
}, [currentusertoken]);

//staff Filter
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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">Date Created</th>
            <th className="pb-3 pt-3 pl-2 pr-2 text-center rounded-tr-2xl">Actions</th>

            {currentuserloggedin !== "Staff" && (
              <>
                <th className="pb-3 pt-3 text-center pr-3"></th>
                <th className="pb-3 pt-3 text-center pr-3 rounded-tr-2xl"></th>
              </>
            )}
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
              <td colSpan="12" className="p-4 bg-red-50 text-red-600 text-center">
                Error: {failedloadingstaffs}
              </td>
            </tr>
          )}

          {(!loadingstaffs && !failedloadingstaffs && searchstaffs && filteredstaffs.length === 0) && (
            <tr>
              <td colSpan="12" className="rounded-2xl py-6 px-4 bg-yellow-50 text-yellow-600 text-center">
                No staffs found.
              </td>
            </tr>
          )}

          {(!loadingstaffs && !failedloadingstaffs && staffstorender.length > 0) && paginatedStaffs.map((staff) => (
          <tr key={staff._id}  className="hover:bg-gray-100  transition-all duration-300 ease-in-out hover:cursor-pointer ">
            <td  className="py-3 px-6 text-[#3a3a3a] font-albertsans font-medium ">#{staff.staffId}</td>
            <td  className="py-3 px-6 text-center">
            <div className="flex justify-center">
              <img 
                src={staff.staffprofilepicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'default-profile-url'; // Fallback image
                }}
              />
              </div>
            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium ">{staff.stafflastname}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium max-w-[150px]">{staff.stafffirstname}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.staffmiddlename}</td>
    
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <a href={`mailto:${staff.staffemail}`} className="text-blue-400 hover:underline">
                {staff.staffemail}
              </a>

            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">{staff.staffclinic}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">{staff.staffiseyespecialist}</td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
              <span className={`rounded-2xl text-xs px-5 py-4 ${staff.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                {staff.isVerified ? 'Active' : 'Pending'}
              </span>
            </td>
            <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium whitespace-nowrap">
              {new Date(staff.createdAt).toLocaleDateString('en-US',{
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </td>
            {(currentuserloggedin !== "Staff" || (currentuserloggedin === "Staff" && staff.staffemail === JSON.parse(localStorage.getItem("currentuser"))?.email)) && (
              <>
                <td><div onClick={() =>  {
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
                    staffprofilepicture: staff.staffprofilepicture
                  });

                  setstaffpreviewimage(staff.staffprofilepicture);
                  setshowviewstaffdialog(true);}}

                 className="bg-[#383838]  hover:bg-[#595959]  mr-2 transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-pencil text-white mr-1"/><h1 className="text-white">Edit</h1></div></td>
    
                {currentuserloggedin !== "Staff" && (
                  <td><div onClick={() =>  {
                    setselectedstaffaccount({
                       id: staff.staffId,
                       email: staff.staffemail,
                       name: `${staff.stafffirstname} ${staff.stafflastname}`});
                                
                    setshowdeletestaffdialog(true);}}

                   className="bg-[#8c3226] hover:bg-[#ab4f43]  transition-all duration-300 ease-in-out flex justify-center items-center py-2 px-5 rounded-2xl hover:cursor-pointer"><i className="bx bxs-trash text-white mr-1"/><h1 className="text-white">Delete</h1></div></td>
                )}
              </>
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


  const maximagefile = 1;
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 1MB");
    return;
  }

  setstaffselectedprofile(null);
  setstaffpreviewimage(null);

  if(staffimageinputref.current){
    staffimageinputref.current.value = "";
  }






  try{

    const imageconfiguration = {
      maximagemb: 1,
      maxworh: 800,
      useWebWorker: true,
      initialQuality: 0.8
    };


    const compressedimageprofile = await imageCompression(file, imageconfiguration);
    const reader = new FileReader();
    reader.onloadend = () => {

      if(reader.error){
        console.error("Error processing image file : ", reader.error);
        alert("Error processing image file. Try again");
        return;
      }
      setstaffpreviewimage(reader.result);
    };


    reader.onerror = () => {
      console.error("File Reader Error : ", reader.error);
      alert("Error reading file. Try again");
      return;
    };

    reader.readAsDataURL(compressedimageprofile);
    setstaffselectedprofile(compressedimageprofile);
  

  } catch (error) {

    console.error("Image file compression failed : ", error.message);
    alert("Image file compression failed. Try again");
    return;

  }
    

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

    
    const staffaccsubmission = {
      ...staffformdata,
      staffclinic: ownerownedclinic,
      staffiseyespecialist: staffformdata.staffiseyespecialist,
      staffprofilepicture: staffpreviewimage || staffformdata.staffprofilepicture
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
        staffprofilepicture: ''
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
            'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
          }
      });
      
      if(!fetchresponse.ok) {
        throw new Error("Failed to retrieve updated staffaccounts table");
      }

      const staffaccounts = await fetchresponse.json();
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

      const updatestaffaccountdetails = {
        ...staffformdata,
        staffiseyespecialist:staffformdata.staffiseyespecialist,
        staffprofilepicture: staffpreviewimage || staffformdata.staffprofilepicture
      };

      const response = await fetch(`/api/staffaccounts/${selectededitstaffaccount.id}`,{
        method:'PUT',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}`
        },
        body: JSON.stringify(updatestaffaccountdetails)
      });


      if(!response.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update staff account");
      }

      const fetchresponse = await fetch('/api/staffaccounts',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('admintoken')}` 
        }
      });

      if(!fetchresponse.ok) {
        const errorresponse = await response.json();
        throw new Error(errorresponse.message || "Failed to update staff account table");
      }

      //Success account update
      const staffdata = await fetchresponse.json();
      setstaffs(staffdata);
      setstaffmessage({text:"Staff Account Updated Successfully!", type:"success"});

      setTimeout(() => {
        setstaffissubmitting(false);
        setselectededitstaffaccount(null);
        setshowviewstaffdialog(false);
        setstaffmessage({text:"", type:""});
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
      
      }catch(error){
        setfailedloadingowners(error.message);
      }finally{
        setloadingowners(false);
      }
    };
    
    if(currentusertoken) {
      fetchowners();
    }
  }, [currentusertoken]);

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
            <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
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
                  src={owner.ownerprofilepicture} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = 'default-profile-url'; // Fallback image
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
              <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
                <span className={`rounded-2xl text-xs px-5 py-4 ${owner.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
                  {owner.isVerified ? 'Active' : 'Pending'}
                </span>
              </td>
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


    const maximagefile = 1;
    if(file.size > maximagefile * 1024 * 1024){
      alert("Image is too large. Please select image under 1MB");
      return;
    }

    setownerselectedprofile(null);
    setownerpreviewimage(null);

    if(ownerimageinputref.current){
      ownerimageinputref.current.value = "";
    }






    try{

      const imageconfiguration = {
        maximagemb: 1,
        maxworh: 800,
        useWebWorker: true,
        initialQuality: 0.8
      };


      const compressedimageprofile = await imageCompression(file, imageconfiguration);
      const reader = new FileReader();
      reader.onloadend = () => {

        if(reader.error){
          console.error("Error processing image file : ", reader.error);
          alert("Error processing image file. Try again");
          return;
        }
        setownerpreviewimage(reader.result);
      };


      reader.onerror = () => {
        console.error("File Reader Error : ", reader.error);
        alert("Error reading file. Try again");
        return;
      };

      reader.readAsDataURL(compressedimageprofile);
      setownerselectedprofile(compressedimageprofile);
    

    } catch (error) {

      console.error("Image file compression failed : ", error.message);
      alert("Image file compression failed. Try again");
      return;

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
        ownerprofilepicture: ownerpreviewimage || ownerformdata.ownerprofilepicture
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

      //If response is success, it will send data to the api and to the database   
      setownermessage({text:"Registration Sucessful!",type:"success"});
      
        
         
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

        const owneraccounts = await fetchresponse.json();
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
          ownerprofilepicture: ownerpreviewimage || ownerformdata.ownerprofilepicture
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
        const ownerdata = await fetchresponse.json();
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
        <th className="pb-3 pt-3 pl-2 pr-2 text-center">isVerified</th>
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
              src={admin.adminprofilepicture} 
              alt="Profile" 
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'default-profile-url'; // Fallback image
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
          <td  className="py-3 px-6 text-[#171717] text-center font-albertsans font-medium">
            <span className={`rounded-2xl text-xs px-5 py-4 ${admin.isVerified ? 'text-green-800 bg-green-100' : 'text-yellow-800 bg-yellow-100'}`}>
              {admin.isVerified ? 'Active' : 'Pending'}
            </span>
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


const maximagefile = 1;
if(file.size > maximagefile * 1024 * 1024){
  alert("Image is too large. Please select image under 1MB");
  return;
}

setadminselectedprofile(null);
setadminpreviewimage(null);

if(adminimageinputref.current){
  adminimageinputref.current.value = "";
}






try{

  const imageconfiguration = {
    maximagemb: 1,
    maxworh: 800,
    useWebWorker: true,
    initialQuality: 0.8
  };


  const compressedimageprofile = await imageCompression(file, imageconfiguration);
  const reader = new FileReader();
  reader.onloadend = () => {

    if(reader.error){
      console.error("Error processing image file : ", reader.error);
      alert("Error processing image file. Try again");
      return;
    }
    setadminpreviewimage(reader.result);
  };


  reader.onerror = () => {
    console.error("File Reader Error : ", reader.error);
    alert("Error reading file. Try again");
    return;
  };

  reader.readAsDataURL(compressedimageprofile);
  setadminselectedprofile(compressedimageprofile);


} catch (error) {

  console.error("Image file compression failed : ", error.message);
  alert("Image file compression failed. Try again");
  return;

}
  

};

//Handles the click event of upload button
const adminhandleuploadclick = () => {
adminimageinputref.current.click();
};

const adminhandleremoveprofile = () => {
setadminselectedprofile(null);
setadminpreviewimage(null);
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

  
  const adminaccsubmission = {
    ...adminformdata,
    adminprofilepicture: adminpreviewimage || adminformdata.adminprofilepicture
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


  
  await axios.post(`/api/accountcreation/admin`, {
    email: adminformdata.adminemail, 
    password: adminformdata.adminpassword});

  //If response is success, it will send data to the api and to the database   
  await response.json();
  setadminmessage({text:"Registration Sucessful!",type:"success"});
  
    
     
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
    console.error("Error:", error)
    setadminmessage({text:"Registration Failed. Try again",type:"error"});
         
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

    const updateadminaccountdetails = {
      ...adminformdata,
      adminprofilepicture: adminpreviewimage || adminformdata.adminprofilepicture
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
const [bautistaeyespecialist, setbautistaeyespecialist] = useState('');
const [ambhereyespecialist, setambhereyespecialist] = useState('');
const [ambherappointmentpaymentotal, setambherappointmentpaymentotal] = useState(null);
const [bautistaappointmentpaymentotal, setbautistaappointmentpaymentotal] = useState(null);
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
if (!term) {
  setFilteredPatientProfiles(patientdemographics);
} else {
  const filtered = patientdemographics.filter(profile => 
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
      const response = await fetch('/api/patientdemographics', {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
        }
      });

      if (!response.ok) throw new Error("Failed to retrieve patient demographics");
      return response.json();
    },
    CACHE_DURATIONS.MEDIUM, // 5 minutes cache
    forceRefresh
  );

  setpatientdemographics(demographics);
} catch (error) {
  setpatientdemoerror(error.message);
} finally {
  setloadingpatientdemographics(false);
}
}, [smartFetch, CACHE_DURATIONS, currentusertoken]);

useEffect(() => {
if(activeprofiletable === "patientprofiletable") {
  fetchDemographicsData();
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
if (searchPatientProfiles) {
  filterPatientProfiles(searchPatientProfiles);
} else {
  setFilteredPatientProfiles(patientdemographics);
}
}, [searchPatientProfiles, filterPatientProfiles, patientdemographics]);

// Initialize filtered data when demographics load
useEffect(() => {
setFilteredPatientProfiles(patientdemographics);
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

if(displayData.length === 0){
  const message = searchPatientProfiles.trim() 
    ? `No patient profiles found matching "${searchPatientProfiles}".`
    : "No patient profiles found.";
  return(
    <div className="text-yellow-600 bg-yellow-50 rounded-2xl px-4 py-6">{message}</div>
  );
}




return (
  <div className="overflow-y-auto w-full h-full flex flex-wrap content-start gap-3 pl-2 pt-2">
  
  {displayData.map((patient) => (
    <div id="patientcard" key={patient._id} onClick={() => {
    setshowpatientpofile(true);
    setselectedpatientdemo(patient);
    setdemoformdata({
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
  
  className="flex justify-center items-center mb-1 bg-white shadow-lg w-[316px] h-[120px] rounded-3xl hover:cursor-pointer hover:scale-105 transition-all ease-in-out duration-300 " >
    <div className="w-[125px] h-full  rounded-2xl flex justify-center items-center">
    <img src={patient.patientprofilepicture || defaultprofilepic} alt="Profile" className="h-18 w-18 rounded-full object-cover"></img>
    </div>
    <div className="bg-white min-w-0 flex flex-col justify-center items-start pl-2 pr-2 w-full h-full  rounded-3xl">
      <h1 className="font-albertsans font-semibold text-[17px] truncate w-full text-[#2d3744]">{patient.patientfirstname} {patient.patientlastname}</h1>
      <p className="text-[14px] truncate w-full">{patient.patientemail}</p>
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
      ...demoformdata,
      patientprofilepicture: addpatientprofilepreviewimage || demoformdata.patientprofilepicture
    };

    const response = await fetch(`/api/patientdemographics`, {
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

    const fetchresponse = await fetch('/api/patientdemographics', {
      headers: {
        'Authorization' : `Bearer ${currentusertoken}`
      }
    });

    const updateddata = await fetchresponse.json();
    setpatientdemographics(updateddata);

    resetpatientprofileformdata();
    setaddpatientprofilemessage({
      text: "Patient Profile successfully created",
      type: "success"
    });

  }catch (error) {
    console.error("Error creating patient profile: ", error);
    setaddpatientprofilemessage({
      text: error.message || "Failed to create patient profile",
      type: "success"
    });
  }finally{
    setaddpatientprofileissubmitting(false);
  }
}



//DISPLAY AND UPDATE PATIENT PROFILE
const retrieveandupdatepatientprofile = async (e) => {
  e.preventDefault();

  try{


    const response = await fetch(`/api/patientdemographics/${selectedpatientdemo._id}`,{
      method: 'PUT',
      headers:{
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${currentusertoken}`
      },
      body: JSON.stringify({
        ...demoformdata,
        patientprofilepicture: previewimage || demoformdata.patientprofilepicture
      })
    });


    if(!response.ok) throw new Error("Failed to update patient demographics");

    const fetchresponse = await fetch('/api/patientdemographics',{
      headers: {'Authorization' : `Bearer ${currentusertoken}`}
    });

    const updateddata = await fetchresponse.json();
    setpatientdemographics(updateddata);
    setshowpatientpofile(false);

  }catch(error){
    console.error("Error updating patient demographic: ", error);
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



      const fetchresponse = await fetch('/api/patientdemographics', {
          headers:{
            'Authorization':`Bearer ${localStorage.getItem('admintoken')}`
          }
      });

      if(!fetchresponse.ok) {
        throw new Error("Failed to retrieve updated patient profile");
      }
      const data = await fetchresponse.json();
      setpatientdemographics(data);

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


const maximagefile = 1;
if(file.size > maximagefile * 1024 * 1024){
  alert("Image is too large. Please select image under 1MB");
  return;
}

setselectedpatientprofile(null);
setaddpatientprofilepreviewimage(null);

if(addpatientprofileimageinputref.current){
  addpatientprofileimageinputref.current.value = "";
}






try{

  const imageconfiguration = {
    maximagemb: 1,
    maxworh: 800,
    useWebWorker: true,
    initialQuality: 0.8
  };


  const compressedimageprofile = await imageCompression(file, imageconfiguration);
  const reader = new FileReader();
  reader.onloadend = () => {

    if(reader.error){
      console.error("Error processing image file : ", reader.error);
      alert("Error processing image file. Try again");
      return;
    }
    setaddpatientprofilepreviewimage(reader.result);
  };


  reader.onerror = () => {
    console.error("File Reader Error : ", reader.error);
    alert("Error reading file. Try again");
    return;
  };

  reader.readAsDataURL(compressedimageprofile);
  setselectedpatientprofile(compressedimageprofile);


} catch (error) {

  console.error("Image file compression failed : ", error.message);
  alert("Image file compression failed. Try again");
  return;

}
  

};

//Handles the click event of upload button
const addpatientprofilehandleuploadclick = () => {
addpatientprofileimageinputref.current.click();
};

const addpatientprofilehandleremoveprofile = () => {
setselectedpatientprofile(null);
setaddpatientprofilepreviewimage(null);
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







const handleviewappointment = (appointment) => {
setselectedpatientappointment(appointment);

// Populate form fields with existing appointment data
if (appointment) {
  // Ambher Optical data
  if (appointment.patientambherappointmentdate) {
    setambhereyespecialist(appointment.patientambherappointmenteyespecialist || '');
    setambherappointmentpaymentotal(appointment.patientambherappointmentpaymentotal || null);
    setambherappointmentconsultationremarkssubject(appointment.patientambherappointmentconsultationremarkssubject || '');
    setambherappointmentconsultationremarks(appointment.patientambherappointmentconsultationremarks || '');
    setambherappointmentprescription(appointment.patientambherappointmentprescription || '');
  }
  
  // Bautista Eye Center data
  if (appointment.patientbautistaappointmentdate) {
    setbautistaeyespecialist(appointment.patientbautistaappointmenteyespecialist || '');
    setbautistaappointmentpaymentotal(appointment.patientbautistaappointmentpaymentotal || null);
    setbautistaappointmentconsultationremarkssubject(appointment.patientbautistaappointmentconsultationremarkssubject || '');
    setbautistaappointmentconsultationremarks(appointment.patientbautistaappointmentconsultationremarks || '');
    setbautistaappointmentprescription(appointment.patientbautistaappointmentprescription || '');
  }
}
};




//UPDATING APPOINTMENT STATUS
const handleacceptappointment = async (appointmentId, clinicType) => {
// Check if user has permission to accept appointments
if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
  console.error("Only Staff and Owner can accept appointments");
  return;
}

// Validate appointmentId
if (!appointmentId) {
  console.error("Appointment ID is missing");
  return;
}

// Set loading state to true
setIsAcceptingAppointment(true);

try{
  const response = await fetch(`/api/patientappointments/appointments/${appointmentId}`,{
    method: "PUT",
    headers: {
      "Content-Type" : "application/json",
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
      appt.id === updatedappointment._id ? updatedappointment : appt
    )
  );


  console.log(`${clinicType} Appointment has been accepted successfully`);

  }catch(error){
    console.error(`Failed to accept ${clinicType} patient appointment:`, error);
  } finally {
    // Always set loading state to false when done
    setIsAcceptingAppointment(false);
  }

};





//AICODE
const handleCompleteAppointment = async (appointmentId, clinicType) => {
  // Check if user has permission to complete appointments
  if (currentuserloggedin !== "Staff" && currentuserloggedin !== "Owner") {
    console.error("Only Staff and Owner can complete appointments");
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
          [`patient${clinicType}appointmentpaymentotal`]: clinicType === 'ambher' ? ambherappointmentpaymentotal : bautistaappointmentpaymentotal,
          [`patient${clinicType}appointmentconsultationremarkssubject`]: clinicType === 'ambher' ? ambherappointmentconsultationremarkssubject : bautistaappointmentconsultationremarkssubject,
          [`patient${clinicType}appointmentconsultationremarks`]: clinicType === 'ambher' ? ambherappointmentconsultationremarks : bautistaappointmentconsultationremarks,
          [`patient${clinicType}appointmentprescription`]: clinicType === 'ambher' ? ambherappointmentprescription : bautistaappointmentprescription,

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
  } catch (error) {
    console.error(`Error completing ${clinicType} appointment:`, error);
    // TODO: Add error handling UI feedback
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

// Medical Records Search State
const [searchmedicalrecords, setsearchmedicalrecords] = useState('');
const [filteredmedicalrecords, setfilteredmedicalrecords] = useState([]);

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
const otherclinicimageinputref = useRef(null);


//PROFILE IMAGE TYPE HANDLING
const otherclinichandleprofilechange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;


  const imagefiletype = ['image/png', 'image/jpeg', 'image/webp'];
  if(!imagefiletype.includes(file.type)) {
    alert("Please select an image file (JPG or PNG)");
    return;
  }


  const maximagefile = 2;
  if(file.size > maximagefile * 1024 * 1024){
    alert("Image is too large. Please select image under 2MB");
    return;
  }

  setotherclinicselectedimage(null);
  setotherclinicpreviewimage(null);

  if(otherclinicimageinputref.current){
    otherclinicimageinputref.current.value = "";
  }






  try{

    const imageconfiguration = {
      maximagemb: 1,
      maxworh: 800,
      useWebWorker: true,
      initialQuality: 0.8
    };


    const compressedimageprofile = await imageCompression(file, imageconfiguration);
    const reader = new FileReader();
    reader.onloadend = () => {

      if(reader.error){
        console.error("Error processing image file : ", reader.error);
        alert("Error processing image file. Try again");
        return;
      }
      setotherclinicpreviewimage(reader.result);
    };


    reader.onerror = () => {
      console.error("File Reader Error : ", reader.error);
      alert("Error reading file. Try again");
      return;
    };

    reader.readAsDataURL(compressedimageprofile);
    setotherclinicselectedimage(compressedimageprofile);
  

  } catch (error) {

    console.error("Image file compression failed : ", error.message);
    alert("Image file compression failed. Try again");
    return;

  }
    

};

//Handles the click event of upload button
const otherclinichandleuploadclick = () => {
  otherclinicimageinputref.current.click();
};

const otherclinichandleremoveprofile = () => {
  setotherclinicselectedimage(null);
  setotherclinicpreviewimage(null);
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

// Filter medical records based on search term
const filterMedicalRecords = useCallback((term) => {
  if (!term.trim()) {
    setfilteredmedicalrecords(patientdemographics || []);
    return;
  }

  const searchTerm = term.toLowerCase().trim();
  const filtered = (patientdemographics || []).filter(patient => {
    return (
      patient.patientfirstname?.toLowerCase().includes(searchTerm) ||
      patient.patientmiddlename?.toLowerCase().includes(searchTerm) ||
      patient.patientlastname?.toLowerCase().includes(searchTerm) ||
      patient.patientemail?.toLowerCase().includes(searchTerm) ||
      patient.patientdemographicId?.toString().includes(searchTerm) ||
      `${patient.patientfirstname} ${patient.patientmiddlename} ${patient.patientlastname}`.toLowerCase().includes(searchTerm) ||
      `${patient.patientfirstname} ${patient.patientlastname}`.toLowerCase().includes(searchTerm)
    );
  });

  setfilteredmedicalrecords(filtered);
}, [patientdemographics]);

// Update filtered records when search term changes
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
const [otherclinicrecordissubmitting, setotherclinicrecordissubmitting] = useState(false);

const submitotherclinicdata = async (e) => {
e.preventDefault();
setotherclinicrecordissubmitting(true);

try{


  const otherclinicrecorddata = {

      patientotherclinicprofilepicture: selectedpatientmedicalrecord.patientprofilepicture,
      patientothercliniclastname: selectedpatientmedicalrecord.patientlastname,
      patientotherclinicfirstname: selectedpatientmedicalrecord.patientfirstname,
      patientotherclinicmiddlename: selectedpatientmedicalrecord.patientmiddlename,
      patientotherclinicemail: selectedpatientmedicalrecord.patientemail,


      patientotherclinicname: otherclinicname,
      patientothercliniceyespecialist: othercliniceyespecialist,
      patientotherclinicconsultationdate: otherclinicconsultationdate,
      patientotherclinicsubmittedbyfirstname: adminfirstname,
      patientotherclinicsubmittedbymiddlename: adminmiddlename,
      patientotherclinicsubmittedbylastname: adminlastname,
      patientotherclinicsubmittedbytype: currentuserloggedin,

      patientotherclinicrecordimage: otherclinicpreviewimage,
      
      }
  console.log("Submittin ReCORDD", otherclinicrecorddata);

  const response = await fetch(`/api/otherclinicrecord`,{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
            'Authorization': `Bearer ${currentusertoken}`
          },
          body: JSON.stringify(otherclinicrecorddata)
  });

  console.log("Submittin ReCORDD", otherclinicrecorddata);

  if(!response.ok){
    throw new Error(`HTTP error! Error: ${response.status}`);
  }


  const result = await response.json();
  console.log('Other Clinic Record Successfull Submitted for Review', result);
  await fetchotherclinicrecords();
  setotherclinicselectedimage(false);
  setotherclinicpreviewimage(null);
  setotherclinicname("");
  setothercliniceyespecialist("");
  setotherclinicconsultationdate("");



}catch(error) {
  console.error('Error Submitting Other Clinic Record: ', error);
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
  if (quantitySortingProducts === 'Outofstock') {
    return sortedFilteredAmbherProducts.filter(product => (product.ambherinventoryproductquantity || 0) === 0);
  } else if (quantitySortingProducts === 'LowStock') {
    return sortedFilteredAmbherProducts.filter(product => {
      const qty = product.ambherinventoryproductquantity || 0;
      return qty >= 4 && qty <= 6;
    });
  } else if (quantitySortingProducts === 'CriticalStock') {
    return sortedFilteredAmbherProducts.filter(product => {
      const qty = product.ambherinventoryproductquantity || 0;
      return qty >= 1 && qty <= 3;
    });
  }
  return sortedFilteredAmbherProducts;
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
    alert("Please select image files (JPG / PNG");
    return;
  }

  if(file.size > maximagefile * 1024 * 1024) {
    alert("Please select images under 2MB");
    return;
  }
}



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



  const previewurls = await Promise.all(
    compressedimages.map(async (image) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(image);
      });
    })
  );



  setaddambherinventoryproductimageselectedimages(prev => [...prev, ...compressedimages]);
  setaddambherinventoryproductimagepreviewimages(prev => [...prev, ...previewurls]);
  setcurrentimageindex(0);


}catch(error){
  console.error("Image compression failed: ", error.message);
  alert("Image compression failed");
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
    ambherinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || '',



    ambherinventoryproductaddedbyprofilepicture: currentuserdata.profilepicture || '',
    ambherinventoryproductaddedbylastname: currentuserdata.lastname || '',
    ambherinventoryproductaddedbyfirstname: currentuserdata.firstname || '',
    ambherinventoryproductaddedbymiddlename: currentuserdata.middlename || '',
    ambherinventoryproductaddedbytype: currentuserdata.type || '',
    ambherinventoryproductaddedbyemail: currentuserdata.email || '',
     ambherinventoryproductwishlistcount: 0 ,



  }

  console.log(ambherinventoryproductdata);
  const response = await fetch(`/api/ambherinventoryproduct`,{
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${currentusertoken}`
    },
    body: JSON.stringify(ambherinventoryproductdata)
  });



  if(!response.ok){
    throw new Error(`Response fetching error! Error: ${response.status}`);

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
    ambherinventoryproductimagepreviewimages: addambherinventoryproductimagepreviewimages || '',



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
  if (bautistaQuantitySortingProducts === 'Outofstock') {
    return sortedFilteredBautistaProducts.filter(product => (product.bautistainventoryproductquantity || 0) === 0);
  } else if (bautistaQuantitySortingProducts === 'LowStock') {
    return sortedFilteredBautistaProducts.filter(product => {
      const qty = product.bautistainventoryproductquantity || 0;
      return qty >= 4 && qty <= 6;
    });
  } else if (bautistaQuantitySortingProducts === 'CriticalStock') {
    return sortedFilteredBautistaProducts.filter(product => {
      const qty = product.bautistainventoryproductquantity || 0;
      return qty >= 1 && qty <= 3;
    });
  }
  return sortedFilteredBautistaProducts;
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
              alert("Please select image files (JPG / PNG");
              return;
            }
        
            if(file.size > maximagefile * 1024 * 1024) {
              alert("Please select images under 2MB");
              return;
            }
          }
        
        
        
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
        
        
        
            const previewurls = await Promise.all(
              compressedimages.map(async (image) => {
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    resolve(reader.result);
                  };
                  reader.readAsDataURL(image);
                });
              })
            );
        
        
        
            setaddbautistainventoryproductimageselectedimages(prev => [...prev, ...compressedimages]);
            setaddbautistainventoryproductimagepreviewimages(prev => [...prev, ...previewurls]);
            setbautistacurrentimageindex(0);
        
        
          }catch(error){
            console.error("Image compression failed: ", error.message);
            alert("Image compression failed");
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
        
        
            const bautistainventoryproductdata = {
        
        
              bautistainventoryproductcategory: bautistainventorycategorynamebox || '',
              bautistainventoryproductname: addbautistainventoryproductname || '',
              bautistainventoryproductbrand:  addbautistainventoryproductbrand || '',
              bautistainventoryproductmodelnumber: addbautistainventoryproductmodelnumber || '',
              bautistainventoryproductdescription: addbautistainventoryproductdescription || '',
              bautistainventoryproductprice: Number(addbautistainventoryproductprice) || 0,
              bautistainventoryproductquantity:  Number(addbautistainventoryproductquantity) || 0,
              bautistainventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || '',
        
        
        
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
              bautistainventoryproductimagepreviewimages: addbautistainventoryproductimagepreviewimages || '',
        
        
        
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







// Add these states near your other state declarations
const [cliniclowstockProducts, setcliniclowstockProducts] = useState([]);
const [cliniccriticalstockProducts, setcliniccriticalstockProducts] = useState([]);
const [clinicoutofstockProducts, setclinicoutofstockProducts] = useState([]);

// Add this useEffect to check stock levels when inventory changes
useEffect(() => {
if (activeinventorytable === 'ambherinventorytable') {
  const criticalStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity > 0 && 
              product.ambherinventoryproductquantity <= 3
  );
  const lowStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity >= 4 && 
              product.ambherinventoryproductquantity <= 6
  );
  const outOfStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity === 0
  );
  setcliniccriticalstockProducts(criticalStock);
  setcliniclowstockProducts(lowStock);
  setclinicoutofstockProducts(outOfStock);
} else if (activeinventorytable === 'bautistainventorytable') {
  const criticalStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity > 0 && 
              product.bautistainventoryproductquantity <= 3
  );
  const lowStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity >= 4 && 
              product.bautistainventoryproductquantity <= 6
  );
  const outOfStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity === 0
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
    const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${selectedorderambherproduct.ambherinventoryproductid}`);
    if (!response.ok) throw new Error("Failed to fetch sold count");
    const data = await response.json();
    setambherproductsoldCount(data.sold || 0);
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

fetchSoldCount();
}, [selectedorderambherproduct]);





//Fetching bautistaproducts sold count  
useEffect(() => {
const fetchSoldCount = async () => {
  if (!selectedorderbautistaproduct?.bautistainventoryproductid) return;

  try {
    const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${selectedorderbautistaproduct.bautistainventoryproductid}`);
    if (!response.ok) throw new Error("Failed to fetch sold count");
    const data = await response.json();
    setbautistaproductsoldCount(data.sold || 0);
  } catch (error) {
    console.error("Error fetching sold count:", error);
  }
};

fetchSoldCount();
}, [selectedorderbautistaproduct]);





//Fetching ambherproducts sold count for every card display 
useEffect(() => {
const fetchAllSoldCounts = async () => {
  const counts = {};

  await Promise.all(
    ambherinventoryproducts.map(async (product) => {
      try {
        const response = await fetch(`/api/patientorderambher/ambherproductsoldcount/${product.ambherinventoryproductid}`);
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
}, [ambherinventoryproducts]);








//Fetching bautistaproducts sold count for every card display 
useEffect(() => {
const fetchAllSoldCounts = async () => {
  const counts = {};

  await Promise.all(
    bautistainventoryproducts.map(async (product) => {
      try {
        const response = await fetch(`/api/patientorderbautista/bautistaproductsoldcount/${product.bautistainventoryproductid}`);
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
}, [bautistainventoryproducts]);




















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
      return 'bg-red-100 text-red-900';
    default:
      return 'bg-gray-100 text-gray-900';
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
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
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
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
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
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
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
      'Authorization': `Bearer ${localStorage.getItem('admintoken')}` // Using admin token
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
                headers: { 'Content-Type': 'application/json' }
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
                headers: { 'Content-Type': 'application/json' }
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
                headers: { 'Content-Type': 'application/json' }
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
                headers: { 'Content-Type': 'application/json' }
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
  }, [smartFetch, CACHE_DURATIONS, getCurrentUserClinic]);

  // Refresh reports data function - clears cache and reloads data
  const refreshReportsData = useCallback(async () => {
    console.log('🔄 Manual refresh of reports data triggered');
    await fetchReportsData(true); // Force refresh bypassing cache
    console.log('✅ Manual refresh completed');
  }, [fetchReportsData]);

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
    const appointmentRevenue = reportsData.appointments.reduce((total, appointment) => {
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
    '#184d85', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
    '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'
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







