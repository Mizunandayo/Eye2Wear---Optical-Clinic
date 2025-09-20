import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import eye2wearbg from "../src/assets/images/eye2wearbg.png";
import landinglogodark from "../src/assets/images/landinglogodark.png";

function EmailVerification() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/patientaccounts/verify-email/${id}/${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setVerificationStatus('success');
          setMessage(result.message);
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/userlogin');
          }, 3000);
        } else {
          setVerificationStatus('error');
          setMessage(result.message || 'Email verification failed. The link may be invalid or expired.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setVerificationStatus('error');
        setMessage('An error occurred during email verification. Please try again.');
      }
    };

    if (id && token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [id, token, navigate]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage({ text: '', type: '' });

    try {
      // You would need the email address here - you might want to store it in localStorage or get it from the user
      const email = prompt('Please enter your email address to resend verification:');
      
      if (!email) {
        setIsResending(false);
        return;
      }

      const response = await fetch('/api/patientaccounts/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientemail: email }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setResendMessage({
          text: 'Verification email sent successfully! Please check your inbox.',
          type: 'success'
        });
      } else {
        setResendMessage({
          text: result.message || 'Failed to resend verification email.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      setResendMessage({
        text: 'An error occurred while resending verification email.',
        type: 'error'
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderVerificationContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #125c99',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700">Verifying your email...</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-green-600 mb-2">Email Verified Successfully!</h2>
            <p className="text-gray-700 mb-4 text-center text-sm sm:text-base">{message}</p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">You will be redirected to the login page in a few seconds...</p>
            <button
              onClick={() => navigate('/userlogin')}
              style={{
                width: '100%',
                maxWidth: '200px',
                height: '44px',
                backgroundColor: '#1f2937',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1f2937';
              }}
            >
              Go to Login Now
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
            
            {/* Error Message */}
            <div 
              className="text-center p-2 sm:p-3 rounded-md text-xs sm:text-sm font-medium mx-2 sm:mx-0 mb-6 w-full"
              style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca'
              }}
            >
              {message}
            </div>
            
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: isResending ? '#9ca3af' : '#1f2937',
                  color: isResending ? '#6b7280' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isResending ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isResending) {
                    e.target.style.backgroundColor = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isResending) {
                    e.target.style.backgroundColor = '#1f2937';
                  }
                }}
              >
                {isResending ? (
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
                  'Resend Verification Email'
                )}
              </button>
              
              <button
                onClick={() => navigate('/userlogin')}
                style={{
                  width: '100%',
                  height: '44px',
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
                Back to Login
              </button>
            </div>

            {resendMessage.text && (
              <div 
                className="mt-4 text-center text-xs sm:text-sm p-2 sm:p-3 rounded-md w-full"
                style={{
                  backgroundColor: resendMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: resendMessage.type === 'success' ? '#16a34a' : '#dc2626',
                  border: `1px solid ${resendMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}
              >
                {resendMessage.text}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="absolute inset-0 h-full w-full" style={{
      backgroundImage: `url(${eye2wearbg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="flex flex-col gap-4 p-4 sm:p-6 h-full md:p-10 backdrop-blur-sm text-gray-900">
        
        {/* Email Verification Form Container */}
        <div className="bg-white shadow-lg rounded-2xl sm:rounded-3xl border-1 border-black/50 flex flex-1 flex-col gap-3 sm:gap-5 items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
          {/* Logo */}
          <div className="flex justify-center gap-2 md:justify-start">
            <div className="mb-1 flex items-center gap-2">
              <img src={landinglogodark} alt="Eye2Wear" className="h-16 sm:h-20 w-auto" />
            </div>
          </div>
          
          <div className="w-full max-w-xs sm:max-w-sm mx-auto px-2 sm:px-0">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <i className="bx bx-envelope-open text-2xl sm:text-3xl font-bold text-sky-700" />
                  <h1 className="text-xl sm:text-2xl font-bold text-sky-700">Email Verification</h1>
                </div>
              </div>

              <div className="w-full flex flex-col items-center">
                {renderVerificationContent()}
              </div>
            </div>
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
  );
}

export default EmailVerification;