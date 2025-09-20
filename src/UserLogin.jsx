
import React from "react";
import {useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import landingbg2 from "../src/assets/images/landingbg2.png";
import landinglogodark from  "../src/assets/images/landinglogodark.png";
import {Link} from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import eye2wearbg from "../src/assets/images/eye2wearbg.png";







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
         const [showPassword, setShowPassword] = useState(false);
         const [isGoogleLogging, setIsGoogleLogging] = useState(false);
         const navigate = useNavigate();


          //HANDLES THE CHANGES
           const handleloginchange = (e) => {
            const {name, value} = e. target;
            setlogindetails(prev => ({
                ...prev,
                [name]:value
            }));
         };

         // Handle Google OAuth response for login
         const handleGoogleLoginResponse = useCallback(async (response) => {
           setIsGoogleLogging(true);
           setloginnotice({ text: '', type: '' });

           try {
             const result = await fetch('/api/google-auth/login', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 credential: response.credential
               })
             });

             const data = await result.json();

             if (data.success) {
               // Set all localStorage items to match regular patient login
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
               
               // Set axios default authorization header
               if (window.axios) {
                 window.axios.defaults.headers.common['Authorization'] = `Bearer ${data.jsontoken}`;
               }

               setloginnotice({
                 text: data.message + " Redirecting...",
                 type: "success"
               });

               // Navigate to patient dashboard
               setTimeout(() => {
                 navigate('/patientdashboard');
               }, 1500);
             } else {
               setloginnotice({
                 text: data.message || "Google login failed. Please try again.",
                 type: "error"
               });
             }
           } catch (error) {
             console.error("Google login error:", error);
             setloginnotice({
               text: "Google login failed. Please try again.",
               type: "error"
             });
           } finally {
             setIsGoogleLogging(false);
           }
         }, [navigate]);

         // Initialize Google OAuth
         useEffect(() => {
           if (window.google) {
             window.google.accounts.id.initialize({
               client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
               callback: handleGoogleLoginResponse,
             });
           }
         }, [handleGoogleLoginResponse]);

         // Handle Google Sign-In button click
         const handleGoogleSignIn = () => {
           if (window.google) {
             window.google.accounts.id.prompt();
           }
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
<section className="absolute inset-0 h-full w-full" style={{
  backgroundImage: `url(${eye2wearbg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}}>

      <div className="flex flex-col gap-4 p-4 sm:p-6 h-full md:p-10  backdrop-blur-sm text-gray-900">

        
        {/* Login Form Container */}
        <div  className="bg-white shadow-lg rounded-2xl sm:rounded-3xl border-1 border-black/50 flex flex-1 flex-col gap-3 sm:gap-5 items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
                 {/* Logo */}
        <div className=" flex justify-center gap-2 md:justify-start">
          <div className="mb-1 flex items-center gap-2">
            <img src={landinglogodark} alt="Eye2Wear" className="h-16 sm:h-20 w-auto" />
          </div>
        </div>
          <div className="w-full max-w-xs sm:max-w-sm mx-auto px-2 sm:px-0">
            {/* Login Form */}
            <form className="flex flex-col gap-4 sm:gap-6" onSubmit={handleloginsubmit}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-sky-700">Login to your account</h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Enter your email below to login to your account
                </p>
              </div>
              
              {/* Error/Success Messages */}
              {loginnotice.text && (
                <div 
                  className="text-center p-2 sm:p-3 rounded-md text-xs sm:text-sm font-medium mx-2 sm:mx-0"
                  style={{
                    backgroundColor: loginnotice.type === 'error' ? '#fef2f2' : '#f0fdf4',
                    color: loginnotice.type === 'error' ? '#dc2626' : '#16a34a',
                    border: `1px solid ${loginnotice.type === 'error' ? '#fecaca' : '#bbf7d0'}`
                  }}
                >
                  {loginnotice.text}
                </div>
              )}
              
              {/* Resend Verification Button */}
              {showResendVerification && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      textDecoration: 'underline',
                      fontSize: '12px',
                      cursor: isResendingVerification ? 'not-allowed' : 'pointer',
                      opacity: isResendingVerification ? 0.5 : 1,
                      padding: '6px 0'
                    }}
                  >
                    {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
              )}

              <div className="grid gap-4 sm:gap-6">
                {/* Email Field */}
                <div className="grid gap-2 sm:gap-3">
                  <Label htmlFor="loginemail" className="text-gray-900 text-xs sm:text-sm">Email</Label>
                  <Input
                    id="loginemail"
                    type="email"
                    name="loginemail"
                    placeholder="m@example.com"
                    value={logindetails.loginemail}
                    onChange={handleloginchange}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-auto text-sm sm:text-base"
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div className="grid gap-2 sm:gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="loginpassword" className="text-gray-900 text-xs sm:text-sm">Password</Label>
                    <button
                      type="button"
                      onClick={() => setshowforgotpasswordform(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        textDecoration: 'underline',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: 'auto'
                      }}
                      className="sm:text-xs"
                    >
                      Forgot your password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="loginpassword"
                      type={showPassword ? "text" : "password"}
                      name="loginpassword"
                      placeholder=""
                      value={logindetails.loginpassword}
                      onChange={handleloginchange}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 pr-10 h-10 sm:h-auto text-sm sm:text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#6b7280'
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Login Button */}
                <button 
                  type="submit" 
                  disabled={islogin}
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: islogin ? '#9ca3af' : '#1f2937',
                    color: islogin ? '#6b7280' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: islogin ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!islogin) {
                      e.target.style.backgroundColor = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!islogin) {
                      e.target.style.backgroundColor = '#1f2937';
                    }
                  }}
                >
                  {islogin ? (
                    <>
                      <div 
                        style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid transparent',
                          borderTop: '2px solid currentColor',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      Logging In...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
                
                {/* Or continue with */}
                <div className="relative text-center text-xs sm:text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300">
                  <span className="relative z-10 px-2 text-gray-600 bg-white">
                    Or continue with
                  </span>
                </div>
                
                {/* Google Login Button */}
                <button 
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLogging}
                  style={{
                    width: '100%',
                    height: '44px',
                    backgroundColor: isGoogleLogging ? '#f3f4f6' : 'transparent',
                    color: isGoogleLogging ? '#9ca3af' : '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: isGoogleLogging ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isGoogleLogging) {
                      e.target.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isGoogleLogging) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 sm:w-4 sm:h-4">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">
                    {isGoogleLogging ? 'Logging in with Google...' : 'Login with Google'}
                  </span>
                </button>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center text-xs sm:text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link 
                  to="/patientregistration" 
                  className="text-gray-900 underline underline-offset-4 hover:text-gray-700"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

            {/* Forgot Password Modal */}
      {showforgotpasswordform && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <form onSubmit={forgotpassword}>
              <div 
                className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Forgot Password</h2>
              </div>
              
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Please enter your registered email below...
                </p>
                
                {forgotpasswordmessage.text && (
                  <div 
                    className="p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium"
                    style={{
                      backgroundColor: forgotpasswordmessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                      color: forgotpasswordmessage.type === 'success' ? '#16a34a' : '#dc2626',
                      border: `1px solid ${forgotpasswordmessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}
                  >
                    {forgotpasswordmessage.text}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="forgotemail" className="text-gray-900 text-xs sm:text-sm">Email</Label>
                  <Input
                    id="forgotemail"
                    type="email"
                    name="forgotemail"
                    placeholder="Enter your email..."
                    value={forgotpasswordemail}
                    onChange={(e) => setforgotpasswordemail(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-auto text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 sm:gap-3 px-4 sm:px-6 pb-4 sm:pb-6">
                <button
                  type="button"
                  onClick={() => {
                    setshowforgotpasswordform(false);
                    setforgotpasswordemail('');
                    setforgotpasswordmessage({text:'', type: ''});
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="sm:text-sm sm:px-5 sm:py-2.5"
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={issendingresetlink}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: issendingresetlink ? '#9ca3af' : '#1f2937',
                    color: issendingresetlink ? '#6b7280' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: issendingresetlink ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  className="sm:text-sm sm:px-6 sm:py-2.5 sm:gap-2"
                  onMouseEnter={(e) => {
                    if (!issendingresetlink) {
                      e.target.style.backgroundColor = '#374151';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!issendingresetlink) {
                      e.target.style.backgroundColor = '#1f2937';
                    }
                  }}
                >
                  {issendingresetlink ? (
                    <>
                      <div 
                        style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid transparent',
                          borderTop: '2px solid currentColor',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      Sending...
                    </>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add keyframe animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

</section>



    </>
  );
        }
        
        export default UserLogin