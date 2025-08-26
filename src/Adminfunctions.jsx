


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
const totalPages = Math.ceil(totalPatients / itemsPerPage);

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
    
    {/* Pagination Component */}
    {totalPatients > 0 && (
      <PaginationComponent
        currentPage={currentPage.patients}
        totalPages={totalPages}
        onPageChange={(page) => handlePageChange('patients', page)}
        totalItems={totalPatients}
        itemsPerPage={itemsPerPage}
      />
    )}
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

      const staffdata = await fetchresponse.json();
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

        const ownerdata = await fetchresponse.json();
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

const itemsPerPage = 10; // Number of items to display per page for tables

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
if (pricesortingProducts === 'Highesttolowest') {
  return (b.ambherinventoryproductprice || 0) - (a.ambherinventoryproductprice || 0);
} else if (pricesortingProducts === 'Lowesttohighest') {
  return (a.ambherinventoryproductprice || 0) - (b.ambherinventoryproductprice || 0);
} else if (quantitySortingProducts === 'Highesttolowest') {
  return (b.ambherinventoryproductquantity || 0) - (a.ambherinventoryproductquantity || 0);
} else if (quantitySortingProducts === 'Lowesttohighest') {
  return (a.ambherinventoryproductquantity || 0) - (b.ambherinventoryproductquantity || 0);
} else if (quantitySortingProducts === 'Outofstock') {
  return (a.ambherinventoryproductquantity || 0) - (b.ambherinventoryproductquantity || 0);
}
return 0;
});

// Filter out of stock products if needed
const finalFilteredAmbherProducts = quantitySortingProducts === 'Outofstock' 
? sortedFilteredAmbherProducts.filter(product => (product.ambherinventoryproductquantity || 0) === 0)
: sortedFilteredAmbherProducts;

const ambherinventoryproductcount = ambherinventoryproducts.filter(
product => product.ambherinventoryproductquantity <= 10
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
if (bautistaPriceSortingProducts === 'Highesttolowest') {
  return (b.bautistainventoryproductprice || 0) - (a.bautistainventoryproductprice || 0);
} else if (bautistaPriceSortingProducts === 'Lowesttohighest') {
  return (a.bautistainventoryproductprice || 0) - (b.bautistainventoryproductprice || 0);
} else if (bautistaQuantitySortingProducts === 'Highesttolowest') {
  return (b.bautistainventoryproductquantity || 0) - (a.bautistainventoryproductquantity || 0);
} else if (bautistaQuantitySortingProducts === 'Lowesttohighest') {
  return (a.bautistainventoryproductquantity || 0) - (b.bautistainventoryproductquantity || 0);
} else if (bautistaQuantitySortingProducts === 'Outofstock') {
  return (a.bautistainventoryproductquantity || 0) - (b.bautistainventoryproductquantity || 0);
}
return 0;
});

// Filter out of stock products if needed
const finalFilteredBautistaProducts = bautistaQuantitySortingProducts === 'Outofstock' 
? sortedFilteredBautistaProducts.filter(product => (product.bautistainventoryproductquantity || 0) === 0)
: sortedFilteredBautistaProducts;

const bautistainventoryproductcount = bautistainventoryproducts.filter(
product => product.bautistainventoryproductquantity <= 10
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
const [clinicoutofstockProducts, setclinicoutofstockProducts] = useState([]);

// Add this useEffect to check stock levels when inventory changes
useEffect(() => {
if (activeinventorytable === 'ambherinventorytable') {
  const lowStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity > 0 && 
              product.ambherinventoryproductquantity <= 10
  );
  const outOfStock = ambherinventoryproducts.filter(
    product => product.ambherinventoryproductquantity === 0
  );
  setcliniclowstockProducts(lowStock);
  setclinicoutofstockProducts(outOfStock);
} else if (activeinventorytable === 'bautistainventorytable') {
  const lowStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity > 0 && 
              product.bautistainventoryproductquantity <= 10
  );
  const outOfStock = bautistainventoryproducts.filter(
    product => product.bautistainventoryproductquantity === 0
  );
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





//Order Ambher
const [orderambherinventorycategorynamebox , setorderambherinventorycategorynamebox ] = useState("");
const [orderambherinventoryproductname , setorderambherinventoryproductname ] = useState("");
const [orderambherinventoryproductbrand , setorderambherinventoryproductbrand ] = useState("");
const [orderambherinventoryproductmodelnumber, setorderambherinventoryproductmodelnumber ] = useState("");
const [orderambherinventoryproductdescription , setorderambherinventoryproductdescription ] = useState("");
const [orderambherinventoryproductnotes , setorderambherinventoryproductnotes ] = useState("");
const [orderambherinventoryproductprice , setorderambherinventoryproductprice ] = useState( );
const [orderambherinventoryproductquantity , setorderambherinventoryproductquantity ] = useState( );
const [orderambherinventoryproductimagepreviewimages , setorderambherinventoryproductimagepreviewimages ] = useState([]);
const [orderambhercurrentimageindex, setorderambhercurrentimageindex] = useState(0);
const [orderambherEmail, setorderambherEmail] = useState('');
const [orderambherprofilePicture, setorderambherprofilePicture] = useState('');
const [orderambherfullName,setorderambherfullName] = useState('');
const [orderambherlastName, setorderambherlastName] = useState('');
const [orderambhermiddleName, setorderambhermiddleName] = useState('');
const [orderambherfirstName, setorderambherfirstName] = useState('');
const [orderambhercontactNumber, setorderambhercontactNumber] = useState('');
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






  const fetchambherOrders = async () => {
    try {
      setLoadingAmbherOrders(true);
      
      const response = await fetch(`/api/patientorderambher`, {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
         
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setambherOrders(data);
  
    } catch (err) {
        console.log(err);
    } finally {
      setLoadingAmbherOrders(false);
    }
  };

useEffect(() => {
fetchambherOrders(); 
}, []);




const filteredambherOrders = ambherorders.filter(order => {
  const matchesFilter = ambherfilter === 'All' || order.patientorderambherstatus === ambherfilter;
  const matchesSearch = order.patientorderambherproductname.toLowerCase().includes(searchambherTerm.toLowerCase()) ||
                       order.patientfirstname.toLowerCase().includes(searchambherTerm.toLowerCase()) ||
                       order.patientlastname.toLowerCase().includes(searchambherTerm.toLowerCase());
  return matchesFilter && matchesSearch;
});









    const fetchbautistaOrders = async () => {
    try {
      setLoadingBautistaOrders(true);
      
      const response = await fetch(`/api/patientorderbautista`, {
        headers: {
          'Authorization': `Bearer ${currentusertoken}`
         
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setbautistaOrders(data);
  
    } catch (err) {
        console.log(err);
    } finally {
      setLoadingBautistaOrders(false);
    }
  };

useEffect(() => {
fetchbautistaOrders(); 
}, []);



const filteredbautistaOrders = bautistaorders.filter(order => {
  const matchesFilter = bautistafilter === 'All' || order.patientorderbautistastatus === bautistafilter;
  const matchesSearch = order.patientorderbautistaproductname.toLowerCase().includes(searchbautistaTerm.toLowerCase()) ||
                       order.patientfirstname.toLowerCase().includes(searchbautistaTerm.toLowerCase()) ||
                       order.patientlastname.toLowerCase().includes(searchbautistaTerm.toLowerCase());
  return matchesFilter && matchesSearch;
});



const formatorderDates = (formattednewdate) => {
  const datedata = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(formattednewdate).toLocaleDateString(undefined, datedata);
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

