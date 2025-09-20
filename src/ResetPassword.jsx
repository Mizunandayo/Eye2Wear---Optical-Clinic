
import React from "react";
import {useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import landinglogodark from  "../src/assets/images/landinglogodark.png";
import {Link} from "react-router-dom";
import axios from "axios";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import eye2wearbg from "../src/assets/images/eye2wearbg.png";








function ResetPassword(){
      const apiUrl = import.meta.env.VITE_API_URL;
      axios.defaults.withCredentials = true;

      const {id, token} = useParams();
      const navigate = useNavigate();
      const[resetpasswordmessage, setresetpasswordmessage] = useState({text: '', type:''});
      const[resetpasswordnew, setresetpasswordnew] = useState('');
      const[issavingnewpassword, setissavingnewpassword] = useState(false);
      const[showPassword, setShowPassword] = useState(false);

       const resetpassword = async (e) => {
        e.preventDefault();
        setissavingnewpassword(true);

        try{
          const response = await axios.post(`/api/auth/reset-password/${id}/${token}`,
            {newpassword: resetpasswordnew},
            {timeout: 10000}
          );

          if(response.data.Status === "Success"){
            setresetpasswordmessage({
              text: "Successfully updated! Redirecting to Login Page...",
              type: "success"
            });
          }

          setTimeout(() => navigate('/userlogin'), 2000);

        }catch(error){
          const serverresponse = error.response?.data?.message;
          const statusresponse = error.response?.status;
          let displayresult = "Password Reset Failed";

          if(statusresponse === 401) displayresult ="Invalid Reset Password Link";
          if(statusresponse === 404) displayresult ="Account does not exist";
          if(serverresponse) displayresult = serverresponse;

          setresetpasswordmessage({text: displayresult, type: "error"});
       } 
           finally {
            setissavingnewpassword(false);
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
        <div className="flex flex-col gap-4 p-6 h-full md:p-10 backdrop-blur-sm text-gray-900">
          {/* Reset Password Form Container */}
          <div className="bg-white shadow-lg rounded-3xl border-1 border-black/50 flex flex-1 flex-col gap-5 items-center justify-center">
            {/* Logo */}
            <div className="flex justify-center gap-2 md:justify-start">
              <div className="mb-1 flex items-center gap-2">
                <img src={landinglogodark} alt="Eye2Wear" className="h-20 w-auto" />
              </div>
            </div>
            
            <div className="w-full max-w-sm mx-auto">
              {/* Reset Password Form */}
              <form className="flex flex-col gap-6" onSubmit={resetpassword}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-6 w-6 text-sky-700" />
                    <h1 className="text-2xl font-bold text-sky-700">Reset Password</h1>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Please enter your new password below...
                  </p>
                </div>
                
                {/* Error/Success Messages */}
                {resetpasswordmessage.text && (
                  <div 
                    className="text-center p-3 rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: resetpasswordmessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
                      color: resetpasswordmessage.type === 'error' ? '#dc2626' : '#16a34a',
                      border: `1px solid ${resetpasswordmessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`
                    }}
                  >
                    {resetpasswordmessage.text}
                  </div>
                )}

                <div className="grid gap-6">
                  {/* New Password Field */}
                  <div className="grid gap-3">
                    <Label htmlFor="newpassword" className="text-gray-900 text-sm">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newpassword"
                        type={showPassword ? "text" : "password"}
                        name="newpassword"
                        placeholder="Enter your new password..."
                        value={resetpasswordnew}
                        onChange={(e) => setresetpasswordnew(e.target.value)}
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
                  
                  {/* Save Button */}
                  <button 
                    type="submit" 
                    disabled={issavingnewpassword}
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: issavingnewpassword ? '#9ca3af' : '#1f2937',
                      color: issavingnewpassword ? '#6b7280' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: issavingnewpassword ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!issavingnewpassword) {
                        e.target.style.backgroundColor = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!issavingnewpassword) {
                        e.target.style.backgroundColor = '#1f2937';
                      }
                    }}
                  >
                    {issavingnewpassword ? (
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
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
                
                {/* Back to Login Link */}
                <div className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link 
                    to="/userlogin" 
                    className="text-gray-900 underline underline-offset-4 hover:text-gray-700"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

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
        
        export default ResetPassword