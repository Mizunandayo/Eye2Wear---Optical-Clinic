import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import landingbg2 from "../src/assets/images/landingbg2.png";

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
              <svg className="animate-spin h-12 w-12 text-[#125c99]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700">Verifying your email...</p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified Successfully!</h2>
            <p className="text-gray-700 mb-4 text-center">{message}</p>
            <p className="text-sm text-gray-500 mb-4">You will be redirected to the login page in a few seconds...</p>
            <Link 
              to="/userlogin" 
              className="bg-[#125c99] text-white px-6 py-2 rounded-lg hover:bg-[#0f4a7a] transition-colors duration-300"
            >
              Go to Login Now
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-700 mb-6 text-center">{message}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="bg-[#125c99] text-white px-6 py-2 rounded-lg hover:bg-[#0f4a7a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isResending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
              
              <Link 
                to="/userlogin" 
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-center"
              >
                Back to Login
              </Link>
            </div>

            {resendMessage.text && (
              <div className={`mt-4 text-center text-sm ${
                resendMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
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
    <section 
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center" 
      style={{ backgroundImage: `url(${landingbg2})` }}
    >
      <div className="bg-opacity-0 flex justify-center items-center z-50 fixed inset-0 bg-[#000000af] bg-opacity-50">
        <div className="flex flex-col items-center bg-white rounded-2xl w-[600px] h-fit animate-fadeInUp p-8">
          
          <div className="flex items-center justify-center w-full mb-6">
            <i className="bx bx-envelope-open text-[32px] font-albertsans font-bold text-[#125c99] mr-3" />
            <h1 className="text-[28px] font-albertsans font-bold text-[#125c99]">Email Verification</h1>
          </div>

          <div className="w-full flex flex-col items-center">
            {renderVerificationContent()}
          </div>

        </div>
      </div>
    </section>
  );
}

export default EmailVerification;