
import React from "react";
import {useState } from 'react';
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
<section className="absolute inset-0 h-full w-full" style={{
  backgroundImage: `url(${eye2wearbg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}}>

      <div className="flex flex-col gap-4 p-6 h-full md:p-10  backdrop-blur-sm text-gray-900">

        
        {/* Login Form Container */}
        <div  className=" bg-white shadow-lg rounded-3xl border-1 border-black/50  flex flex-1 flex-col gap-5 items-center justify-center">
                 {/* Logo */}
        <div className=" flex justify-center gap-2 md:justify-start">
          <div className="mb-1 flex items-center gap-2">
            <img src={landinglogodark} alt="Eye2Wear" className="h-20 w-auto" />
          </div>
        </div>
          <div className="  w-full max-w-sm mx-auto">
            {/* Login Form */}
            <form className=" flex flex-col gap-6" onSubmit={handleloginsubmit}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-sky-700">Login to your account</h1>
                <p className="text-gray-600 text-sm">
                  Enter your email below to login to your account
                </p>
              </div>
              
              {/* Error/Success Messages */}
              {loginnotice.text && (
                <div 
                  className="text-center p-3 rounded-md text-sm font-medium"
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
                      fontSize: '14px',
                      cursor: isResendingVerification ? 'not-allowed' : 'pointer',
                      opacity: isResendingVerification ? 0.5 : 1,
                      padding: '8px 0'
                    }}
                  >
                    {isResendingVerification ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </div>
              )}

              <div className="grid gap-6">
                {/* Email Field */}
                <div className="grid gap-3">
                  <Label htmlFor="loginemail" className="text-gray-900 text-sm">Email</Label>
                  <Input
                    id="loginemail"
                    type="email"
                    name="loginemail"
                    placeholder="m@example.com"
                    value={logindetails.loginemail}
                    onChange={handleloginchange}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="loginpassword" className="text-gray-900 text-sm">Password</Label>
                    <button
                      type="button"
                      onClick={() => setshowforgotpasswordform(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        textDecoration: 'underline',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: 'auto'
                      }}
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
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400 pr-10"
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
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
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
                    height: '40px',
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
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-300">
                  <span className="relative z-10 px-2 text-gray-600 bg-white">
                    Or continue with
                  </span>
                </div>
                
                {/* GitHub Login Button */}
                <button 
                  type="button"
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Login with GitHub
                </button>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center text-sm text-gray-600">
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
          <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <form onSubmit={forgotpassword}>
              <div 
                className="flex items-center gap-3 px-6 py-4"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <Lock className="h-6 w-6 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Forgot Password</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-sm">
                  Please enter your registered email below...
                </p>
                
                {forgotpasswordmessage.text && (
                  <div 
                    className="p-3 rounded-lg text-sm font-medium"
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
                  <Label htmlFor="forgotemail" className="text-gray-900 text-sm">Email</Label>
                  <Input
                    id="forgotemail"
                    type="email"
                    name="forgotemail"
                    placeholder="Enter your email..."
                    value={forgotpasswordemail}
                    onChange={(e) => setforgotpasswordemail(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={() => {
                    setshowforgotpasswordform(false);
                    setforgotpasswordemail('');
                    setforgotpasswordmessage({text:'', type: ''});
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
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
                    padding: '10px 24px',
                    backgroundColor: issendingresetlink ? '#9ca3af' : '#1f2937',
                    color: issendingresetlink ? '#6b7280' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: issendingresetlink ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
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