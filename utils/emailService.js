/* eslint-disable no-undef */
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Enhanced email configuration for production environments
const createEmailTransporter = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Base configuration
  let config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  if (isProduction) {
    // Check if basic service mode is requested
    if (process.env.EMAIL_USE_BASIC_SERVICE === 'true') {
      config = {
        ...config,
        connectionTimeout: parseInt(process.env.EMAIL_TIMEOUT) || 60000,
        greetingTimeout: 30000,
        socketTimeout: parseInt(process.env.EMAIL_TIMEOUT) || 60000
      };
    } else {
      // Production configuration with fallback options
      const useSecure = process.env.EMAIL_FORCE_UNSECURE !== 'true';
      const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : (useSecure ? 465 : 587);
      
      config = {
        ...config,
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: emailPort,
        secure: useSecure && emailPort === 465, // true for 465, false for other ports
        pool: true, // Use pooled connections
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 14, // Max 14 emails per second
        connectionTimeout: parseInt(process.env.EMAIL_TIMEOUT) || 60000,
        greetingTimeout: 30000,
        socketTimeout: parseInt(process.env.EMAIL_TIMEOUT) || 60000,
        dnsTimeout: 30000,
        tls: {
          rejectUnauthorized: false,
          ciphers: 'SSLv3'
        },
        // Add STARTTLS for port 587
        ...(emailPort === 587 && {
          requireTLS: true,
          tls: {
            rejectUnauthorized: false
          }
        })
      };

      // Remove service if using custom host/port
      if (process.env.EMAIL_HOST || process.env.EMAIL_PORT) {
        delete config.service;
      }
    }
  } else {
    // Development settings
    config = {
      ...config,
      connectionTimeout: 20000,
      greetingTimeout: 10000,
      socketTimeout: 20000
    };
  }

  console.log('Email config:', { 
    ...config, 
    auth: { user: config.auth.user, pass: '***' } 
  });

  return nodemailer.createTransport(config);
};

// Retry mechanism for email sending
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Email sending attempt ${attempt}/${maxRetries}`);
      
      const transporter = createEmailTransporter();
      
      // Test connection before sending
      await transporter.verify();
      console.log('SMTP connection verified successfully');
      
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      // Close the transporter
      transporter.close();
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error;
      console.error(`Email attempt ${attempt} failed:`, error.message);
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Email sending failed after ${maxRetries} attempts: ${lastError.message}`);
};

// Enhanced email service functions
export const sendVerificationEmail = async (patient) => {
  try {
    // Create verification link - use production URL if available
    const baseUrl = process.env.FRONTEND_URL || process.env.VITE_API_URL || 'http://localhost:5173';
    const verificationLink = `${baseUrl}/verify-email/${patient._id}/${patient.verificationtoken}`;

    const mailOptions = {
      from: {
        name: 'Eye2Wear',
        address: process.env.EMAIL_USER
      },
      to: patient.patientemail,
      subject: "Eye2Wear - Email Verification Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #125c99; margin: 0;">Eye2Wear</h1>
            <h2 style="color: #333; margin: 10px 0;">Welcome to Eye2Wear!</h2>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Dear ${patient.patientfirstname} ${patient.patientlastname},
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Thank you for registering with Eye2Wear! To complete your registration and activate your account, 
              please click the verification button below:
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #125c99; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Verify Your Email
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If the button above doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #125c99; font-size: 14px; word-break: break-all;">
              ${verificationLink}
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 20px;">
              This verification link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 Eye2Wear. All rights reserved.
            </p>
          </div>
        </div>
      `,
      // Add text version for better deliverability
      text: `
        Welcome to Eye2Wear!
        
        Dear ${patient.patientfirstname} ${patient.patientlastname},
        
        Thank you for registering with Eye2Wear! To complete your registration and activate your account, please visit this link:
        
        ${verificationLink}
        
        This verification link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
        
        © 2024 Eye2Wear. All rights reserved.
      `
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
};

export const sendAccountCreationEmail = async (email, password, accountType = 'Patient') => {
  try {
    const mailOptions = {
      from: {
        name: 'Eye2Wear',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `Eye2Wear - ${accountType} Account Created`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #125c99; margin: 0;">Eye2Wear</h1>
            <h2 style="color: #333; margin: 10px 0;">${accountType} Account Created</h2>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Your ${accountType.toLowerCase()} account has been successfully created!
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Here are your login credentials:
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 5px 0; font-weight: bold;">Email: <span style="font-weight: normal;">${email}</span></p>
              <p style="margin: 5px 0; font-weight: bold;">Password: <span style="font-weight: normal;">${password}</span></p>
            </div>
            <p style="color: #e74c3c; font-size: 14px; line-height: 1.5;">
              Please keep this information secure and consider changing your password after your first login.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 Eye2Wear. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Eye2Wear - ${accountType} Account Created
        
        Your ${accountType.toLowerCase()} account has been successfully created!
        
        Login Credentials:
        Email: ${email}
        Password: ${password}
        
        Please keep this information secure and consider changing your password after your first login.
        
        © 2024 Eye2Wear. All rights reserved.
      `
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    console.error("Error in sendAccountCreationEmail:", error);
    throw error;
  }
};

export const sendAccountDeletionEmail = async (email, accountType = 'Patient') => {
  try {
    const mailOptions = {
      from: {
        name: 'Eye2Wear',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: `Eye2Wear - ${accountType} Account Deleted`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #125c99; margin: 0;">Eye2Wear</h1>
            <h2 style="color: #333; margin: 10px 0;">Account Deletion Notice</h2>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              We would like to notify you that your ${accountType.toLowerCase()} account has been deleted from our system.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              If this was not requested by you, please contact our support team immediately.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 Eye2Wear. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Eye2Wear - Account Deletion Notice
        
        We would like to notify you that your ${accountType.toLowerCase()} account has been deleted from our system.
        
        If this was not requested by you, please contact our support team immediately.
        
        © 2024 Eye2Wear. All rights reserved.
      `
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    console.error("Error in sendAccountDeletionEmail:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetLink, firstName) => {
  try {
    const mailOptions = {
      from: {
        name: 'Eye2Wear',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: "Eye2Wear - Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #125c99; margin: 0;">Eye2Wear</h1>
            <h2 style="color: #333; margin: 10px 0;">Password Reset Request</h2>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Hello ${firstName || 'User'},
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              You requested a password reset for your Eye2Wear account.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
              Click the button below to reset your password:
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #125c99; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If the button above doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="color: #125c99; font-size: 14px; word-break: break-all;">
              ${resetLink}
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 20px;">
              This link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If you didn't request this password reset, please ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 Eye2Wear. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `
        Eye2Wear - Password Reset Request
        
        Hello ${firstName || 'User'},
        
        You requested a password reset for your Eye2Wear account.
        
        Please visit this link to reset your password:
        ${resetLink}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, please ignore this email.
        
        © 2024 Eye2Wear. All rights reserved.
      `
    };

    return await sendEmailWithRetry(mailOptions);
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    throw error;
  }
};

// Export the remaining functions that weren't exported individually
export { sendEmailWithRetry, createEmailTransporter };

export default {
  sendVerificationEmail,
  sendAccountCreationEmail,
  sendAccountDeletionEmail,
  sendPasswordResetEmail,
  sendEmailWithRetry,
  createEmailTransporter
};