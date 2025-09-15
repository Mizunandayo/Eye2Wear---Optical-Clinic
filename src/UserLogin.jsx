
import React from "react";
import {useState } from 'react';
import { useNavigate } from "react-router-dom";
import landingbg2 from "../src/assets/images/landingbg2.png";
import landinglogodark from  "../src/assets/images/landinglogodark.png";
import {Link} from "react-router-dom";
import axios from "axios";








function UserLogin(){
  const apiUrl = import.meta.env.VITE_API_URL;

  // Clear localStorage when component mounts
  React.useEffect(() => {
    localStorage.clear();
    console.log('LocalStorage cleared on login page');
  }, []);

  const [logindetails, setlogindetails] = useState({
            loginemail:'',
            loginpassword:''
         });


         //VARIABLES
         const [islogin, setislogin] = useState(false);
         const [loginnotice, setloginnotice] = useState({text:'', type:''});
         const [showResendVerification, setShowResendVerification] = useState(false);
         const [isResendingVerification, setIsResendingVerification] = useState(false);
         const navigate = useNavigate();


          //HANDLES THE CHANGES
           const handleloginchange = (e) => {
            const {name, value} = e. target;
            setlogindetails(prev => ({
                ...prev,
                [name]:value
            }));
         };






          //HANDLE THE SUBMISSION
const handleloginsubmit = async (e) => {
  e.preventDefault();
  setislogin(true);
  setloginnotice({ text: '', type: '' });

  try {
    // Use relative URLs
    const patientemailcheck = await fetch(`/api/patientaccounts/check-email/${logindetails.loginemail}`);
    const patientemailexist = await patientemailcheck.json();

    const staffemailcheck = await fetch(`/api/staffaccounts/check-email/${logindetails.loginemail}`);
    const staffemailexist = await staffemailcheck.json();

    const owneremailcheck = await fetch(`/api/owneraccounts/check-email/${logindetails.loginemail}`);
    const owneremailexist = await owneremailcheck.json();

    const adminemailcheck = await fetch(`/api/adminaccounts/check-email/${logindetails.loginemail}`);
    const adminemailexist = await adminemailcheck.json();

    if (!patientemailexist.exists && !adminemailexist.exists && !staffemailexist.exists && !owneremailexist.exists) {
      throw new Error("Email does not exist");
    }

    let user = '';
    let loginUrl = '';
    let body = {};

    if (patientemailexist.exists) {
      user = 'Patient';
      loginUrl = '/api/patientaccounts/login';
      body = {
        patientemail: logindetails.loginemail,
        patientpassword: logindetails.loginpassword,
      };
    } else if (staffemailexist.exists) {
      user = 'Staff';
      loginUrl = '/api/staffaccounts/login';
      body = {
        staffemail: logindetails.loginemail,
        staffpassword: logindetails.loginpassword,
      };
    } else if (owneremailexist.exists) {
      user = 'Owner';
      loginUrl = '/api/owneraccounts/login';
      body = {
        owneremail: logindetails.loginemail,
        ownerpassword: logindetails.loginpassword,
      };
    } else if (adminemailexist.exists) {
      user = 'Admin';
      loginUrl = '/api/adminaccounts/login';
      body = {
        adminemail: logindetails.loginemail,
        adminpassword: logindetails.loginpassword,
      };
    }

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errordetails = await response.json();
      throw new Error(errordetails.message || 'Password does not match');
    }

    const data = await response.json();
              

              //If the user is patient it will assign token
if(user === 'Patient'){
  localStorage.setItem("patienttoken", data.jsontoken);
  localStorage.setItem("patientdetails", JSON.stringify(data.patient));
  localStorage.setItem("patientid", data.patient._id);
  localStorage.setItem("patientemail", data.patient.patientemail);
  localStorage.setItem("patientfirstname", data.patient.patientfirstname);
  localStorage.setItem("patientlastname", data.patient.patientlastname);
  localStorage.setItem("patientname", data.patient.patientfirstname + " " + data.patient.patientlastname);
  localStorage.setItem('role', 'patient');
  localStorage.setItem('token', data.jsontoken);
  localStorage.setItem('needsSocketInit', 'true');
  
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.jsontoken}`;
  
  setloginnotice({
    text:"Patient Login Successful!",
    type:"success"
  });

  setTimeout(() => {
    navigate("/patientlandingpage");
  }, 2000);
}

else if(user === 'Staff'){
  localStorage.setItem("stafftoken", data.jsontoken);
  localStorage.setItem("staffdetails", JSON.stringify(data.staff));
  localStorage.setItem("staffid", data.staff._id); // ADD THIS LINE
  localStorage.setItem("staffemail", data.staff.staffemail);
  localStorage.setItem("staffname", data.staff.stafffirstname + " " + data.staff.stafflastname);
  localStorage.setItem("staffclinic", data.staff.staffclinic);
  localStorage.setItem('role', 'staff');
  localStorage.setItem('token', data.jsontoken);
  localStorage.setItem('needsSocketInit', 'true');


  localStorage.setItem("currentuser", JSON.stringify({
    type: 'Staff',
    firstname: data.staff.stafffirstname,
    middlename: data.staff.staffmiddlename,
    lastname: data.staff.stafflastname,
    email: data.staff.staffemail,
    profilepicture: data.staff.staffprofilepicture
  }));

  setloginnotice({
    text:"Staff Login Successful!",
    type:"success"
  });

  setTimeout(() => {
    navigate("/admindashboard");
  }, 2000);
}

else if(user === 'Owner'){
  localStorage.setItem("ownertoken", data.jsontoken);
  localStorage.setItem("ownerdetails", JSON.stringify(data.owner));
  localStorage.setItem("ownerid", data.owner._id); // ADD THIS LINE
  localStorage.setItem("owneremail", data.owner.owneremail);
  localStorage.setItem("ownerclinic", data.owner.ownerclinic);
  localStorage.setItem("ownername", data.owner.ownerfirstname + " " + data.owner.ownerlastname);
  localStorage.setItem('role', 'owner');
  localStorage.setItem('token', data.jsontoken);
  localStorage.setItem('needsSocketInit', 'true');
  
  localStorage.setItem("currentuser", JSON.stringify({
    type: 'Owner',
    firstname: data.owner.ownerfirstname,
    middlename: data.owner.ownermiddlename,
    lastname: data.owner.ownerlastname,
    email: data.owner.owneremail,
    profilepicture: data.owner.ownerprofilepicture
  }));
  
  setloginnotice({
    text:"Owner Login Successful!",
    type:"success"
  });

  setTimeout(() => {
    navigate("/admindashboard");
  }, 2000);
}


              else if(user  === 'Admin'){
                localStorage.setItem("admintoken", data.jsontoken);
                localStorage.setItem('role', 'admin');
                localStorage.setItem("currentuser", JSON.stringify({
                  type: 'Admin',
                  firstname: data.admin.adminfirstname,
                  middlename: data.admin.adminmiddlename,
                  lastname: data.admin.adminlastname,
                  email: data.admin.adminemail,
                  profilepicture: data.admin.adminprofilepicture
                }));
                
                setloginnotice({
                    text:"Admin Login Successful!",
                    type:"success"
                });
  

                setTimeout(() => {
                  navigate("/admindashboard");
              }, 2000);
              }


              

          }
          //USES ERROR TO DISPLAY ERROR DATA
          catch (error){
              console.error("Error Login:", error);
              const errorMessage = error.message || "Login Failed:";
              
              setloginnotice({
                  text: errorMessage,
                  type: "error"
              });

              // Show resend verification option if account is not verified
              if (errorMessage.includes("not verified")) {
                setShowResendVerification(true);
              } else {
                setShowResendVerification(false);
              }
          }
          finally{
              setislogin(false);
          }
        };

    // Handle resend verification email
    const handleResendVerification = async () => {
      setIsResendingVerification(true);
      try {
        const response = await fetch('/api/patientaccounts/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ patientemail: logindetails.loginemail }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setloginnotice({
            text: 'Verification email sent successfully! Please check your inbox.',
            type: 'success'
          });
          setShowResendVerification(false);
        } else {
          setloginnotice({
            text: result.message || 'Failed to resend verification email.',
            type: 'error'
          });
        }
      } catch (error) {
        console.error('Error resending verification:', error);
        setloginnotice({
          text: 'An error occurred while resending verification email.',
          type: 'error'
        });
      } finally {
        setIsResendingVerification(false);
      }
    };

    




      
 

        const[showforgotpasswordform, setshowforgotpasswordform] = useState(false);
        const[forgotpasswordmessage, setforgotpasswordmessage] = useState({text: '', type:''});
        const[forgotpasswordemail, setforgotpasswordemail] = useState('');
        const[issendingresetlink, setissendingresetlink] = useState(false);

        axios.defaults.withCredentials = true;
        



        const forgotpassword = async (e) => {
     
         e.preventDefault();
         setissendingresetlink(true);
         setforgotpasswordmessage({text: '', type:''});

         try{

          const res = await axios.post(`${apiUrl}/api/auth/forgot-password`, {email: forgotpasswordemail});
           
 
  
            if(res.data.Status === "Success") {
              setissendingresetlink(true);
              setforgotpasswordmessage({
                text: `Reset password link is sent to your email ${forgotpasswordemail}`,
                type: "success"
              });

             setTimeout(() => {
              setshowforgotpasswordform(false);
              setforgotpasswordemail('');
              setforgotpasswordmessage({text:'', type: ''});
             }, 2000); 
           
            }


         }catch(err){

            setforgotpasswordmessage({
              text: err.response?.data?.message || "Failed to send reset password link",
              type: "error"
            });

         }finally{
              setissendingresetlink(false);
         }
         


        };
 
  



  
         







 return (
            <>
        


      <section className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center px-4 sm:px-0" style={{ backgroundImage: `url(${landingbg2})` }}>



      <div className="mb-6 sm:mb-10">
        <img src={landinglogodark} className="w-32 sm:w-40 lg:w-130 ml-4 sm:ml-8 lg:ml-16"/>
      </div>




      <div className="login-container  bg-gradient-to-tl flex rounded-2xl lg:rounded-4xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-135 lg:h-140 h-fit py-8 lg:py-0">

          <form className="flex flex-col w-full px-6 lg:ml-15 lg:mt-15 lg:mr-15" onSubmit={handleloginsubmit}>

          <h1 className="font-league text-[#3da9d1] text-2xl lg:text-[30px] mt-2 lg:mt-5 text-center lg:text-left">Sign In</h1>
             {loginnotice.text && (
              <div className={`message ${loginnotice.type} text-${loginnotice.type === 'error' ? 'red' : 'green'}-600 font-bold text-sm lg:text-base text-center lg:text-left`}>
             {loginnotice.text}
          </div>
         )}
         
         {/* Resend Verification Button */}
         {showResendVerification && (
           <div className="mt-2 text-center lg:text-left">
             <button
               type="button"
               onClick={handleResendVerification}
               disabled={isResendingVerification}
               className="text-[#125c99] hover:text-[#0f4a7a] font-medium text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
             </button>
           </div>
         )}
         
              <h1 className="font-albertsans italic text-[#060606] text-base lg:text-[20px] text-center lg:text-left">Hi there nice to see you again.</h1>


          <div className="form-group mt-6 lg:mt-10 flex flex-col lg:flex-row lg:items-center">
            <label className="font-albertsans font-bold italic text-[#595968] text-lg lg:text-[21px] mb-2 lg:mb-0 lg:w-28" htmlFor= "loginemail">Email :</label>
            <input className="bg-gray-200 text-lg lg:text-[20px] text-gray-600 pl-3 rounded-2xl lg:ml-6 h-10 w-full lg:w-auto lg:flex-1" placeholder="Enter your email..." type="text" name= "loginemail" id="loginemail" value={logindetails.loginemail} onChange={handleloginchange} required/></div>

          <div className="form-group mt-4 lg:mt-5 flex flex-col lg:flex-row lg:items-center">
            <label className="font-albertsans font-bold italic text-[#595968] text-lg lg:text-[21px] mb-2 lg:mb-0 lg:w-28" htmlFor="loginpassword">Password :</label>
            <input className="bg-gray-200 text-lg lg:text-[20px] text-gray-600 pl-3 rounded-2xl lg:ml-6 h-10 w-full lg:w-auto lg:flex-1" placeholder="Enter your password..."  type="password" name="loginpassword" id="loginpassword" value={logindetails.loginpassword} onChange={handleloginchange} required min="6"/></div>
          
          <div className="h-[30px] mt-2 flex justify-center lg:justify-end items-center pr-2"><p  onClick={() => setshowforgotpasswordform(true)} className="text-xs lg:text-[14px] hover:cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out font-albertsans font-medium text-[#1b5770]">Forgot Password?</p></div>




            <button type="submit" disabled={islogin} className={`submit-btn mt-8 lg:mt-12 flex items-center justify-center gap-2 ${islogin ? 'bg-gray-400 cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300 ease-in-out text-lg lg:text-[20px] py-2 lg:py-3 px-4 lg:px-5 text-white rounded-2xl w-full`} style={{ backgroundColor: islogin ? "#9ca3af" : "#2b2b44" }}> 
              {islogin ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging In...</span>
                </>
              ) : (
                "Log In"
              )}
            </button>



            <div className="flex items-center justify-center mt-4 lg:mt-5 flex-wrap gap-1">
              <h1 className="text-sm lg:text-[16px] font-semibold text-[#4b4b53]">Don't have an account?</h1>
              <Link to="/patientregistration"> <div className="flex justify-center items-center p-2 lg:p-3 rounded-2xl hover:cursor-pointer hover:scale-105 transition-all text-[#]"><p className="font-bold text-base lg:text-[18px] text-[#177084]">Sign Up</p></div></Link>
            </div>

           </form>



        {showforgotpasswordform && (
                         <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50 px-4">

                           <div className="flex flex-col items bg-white rounded-2xl w-full max-w-lg lg:max-w-xl lg:w-[600px] h-fit animate-fadeInUp">
                           <form className="flex flex-col w-full h-fit"  onSubmit={forgotpassword}>

                              <div className="flex items-center rounded-tl-2xl rounded-tr-2xl h-[60px] lg:h-[70px] bg-[#125c99] px-3"><i className="bx bx-shield-quarter text-2xl lg:text-[28px] font-albertsans font-bold text-[#f1f1f1]"/><h1 className="ml-2 text-lg lg:text-[23px] font-albertsans font-bold text-[#e4e4e4]">Forgot Password</h1></div>
                              <div className="flex flex-col items-center h-fit rounded-br-2xl rounded-bl-2xl">
                                  <div className="px-4 lg:px-5 flex flex-col justify-center h-fit py-4 lg:h-[130px] w-full"><p className="font-albertsans font-medium text-lg lg:text-[20px]">Please enter your registered email below...</p>
      
                                  {forgotpasswordmessage.text && (
                                    <div className={`text-sm ${
                                      forgotpasswordmessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                    {forgotpasswordmessage.text}</div>
                                  )}

                                  <div className="form-group mt-4 lg:mt-5 flex flex-col lg:flex-row lg:items-center">
                                       <label className="font-albertsans font-bold italic text-[#595968] text-lg lg:text-[21px] mb-2 lg:mb-0 lg:w-20" htmlFor= "forgotemail">Email :</label>
                                      <input className="bg-gray-200 text-lg lg:text-[20px] text-gray-600 pl-3 rounded-2xl lg:ml-11 h-10 w-full lg:flex-1" placeholder="Enter your email..." type="email" name= "forgotemail" id="forgotemail" value={forgotpasswordemail} onChange={(e) => setforgotpasswordemail(e.target.value)} required/></div>
                                  </div>        
                                  <div className="px-4 lg:pr-5 flex justify-center lg:justify-end items-center h-[60px] lg:h-[80px] w-full gap-2">
                                      <div onClick={() => {setshowforgotpasswordform(false); setforgotpasswordemail(''); setforgotpasswordmessage({text:'', type: ''});}}  className="hover:scale-105 hover:cursor-pointer transition-all duration-300 ease-in-out bg-[#363638] rounded-2xl px-4 lg:px-6 py-2 lg:py-3"><span className="font-albertsans text-white font-medium text-sm lg:text-base">Cancel</span></div>
                    

                                      <button type="submit" disabled={issendingresetlink} className={`flex items-center justify-center gap-2 ${issendingresetlink ? 'bg-gray-400 cursor-not-allowed' : 'hover:scale-105 hover:cursor-pointer'} transition-all duration-300 ease-in-out rounded-2xl px-6 lg:px-9 py-2 lg:py-3`} style={{ backgroundColor: issendingresetlink ? "#9ca3af" : "#1b5f83"}}> 
                                       {issendingresetlink ? (
                                        <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span className="font-albertsans text-white font-medium text-sm lg:text-base">Sending...</span>
                                        </>
                                       ):(
                                        <span className="font-albertsans text-white font-medium text-sm lg:text-base">Send</span>
                                       )}
                                       </button>

                                  </div>
                              </div>

                           </form>
                           </div>
                         </div>
                     )} 





                  
      



    </div>


    </section>






             
            </>
          )
        }
        
        export default UserLogin