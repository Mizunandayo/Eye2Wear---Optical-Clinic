/* eslint-disable no-undef */
import express from 'express';
import { sendVerificationEmail, sendAccountCreationEmail, sendAccountDeletionEmail, createEmailTransporter } from '../utils/emailService.js';

const emailTestRouter = express.Router();

// Test email service connection
emailTestRouter.get('/test-connection', async (req, res) => {
  try {
    console.log('Testing email connection...');
    const transporter = createEmailTransporter();
    
    const startTime = Date.now();
    await transporter.verify();
    const endTime = Date.now();
    
    transporter.close();
    
    console.log(`Email connection verified successfully in ${endTime - startTime}ms`);
    res.status(200).json({
      success: true,
      message: 'Email connection verified successfully',
      responseTime: `${endTime - startTime}ms`,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Email connection test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Email connection failed',
      error: error.message,
      code: error.code,
      environment: process.env.NODE_ENV || 'development'
    });
  }
});

// Test verification email
emailTestRouter.post('/test-verification', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    
    if (!email || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, firstName, and lastName are required'
      });
    }

    const testPatient = {
      _id: 'test123',
      patientemail: email,
      patientfirstname: firstName,
      patientlastname: lastName,
      verificationtoken: 'test-token-123'
    };

    console.log('Testing verification email sending...');
    const result = await sendVerificationEmail(testPatient);
    
    res.status(200).json({
      success: true,
      message: 'Test verification email sent successfully',
      result
    });
  } catch (error) {
    console.error('Test verification email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test verification email failed',
      error: error.message
    });
  }
});

// Test account creation email
emailTestRouter.post('/test-creation', async (req, res) => {
  try {
    const { email, password, accountType } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    console.log('Testing account creation email sending...');
    const result = await sendAccountCreationEmail(email, password, accountType || 'Patient');
    
    res.status(200).json({
      success: true,
      message: 'Test account creation email sent successfully',
      result
    });
  } catch (error) {
    console.error('Test account creation email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test account creation email failed',
      error: error.message
    });
  }
});

// Test account deletion email
emailTestRouter.post('/test-deletion', async (req, res) => {
  try {
    const { email, accountType } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    console.log('Testing account deletion email sending...');
    const result = await sendAccountDeletionEmail(email, accountType || 'Patient');
    
    res.status(200).json({
      success: true,
      message: 'Test account deletion email sent successfully',
      result
    });
  } catch (error) {
    console.error('Test account deletion email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test account deletion email failed',
      error: error.message
    });
  }
});

// Get email configuration info (without sensitive data)
emailTestRouter.get('/config', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    emailService: process.env.EMAIL_SERVICE || 'Gmail',
    emailUser: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{3}).*(@.*)/, '$1***$2') : 'Not configured',
    frontendUrl: process.env.FRONTEND_URL || 'Not configured',
    apiUrl: process.env.VITE_API_URL || 'Not configured',
    timeout: process.env.EMAIL_TIMEOUT || '60000',
    maxRetries: process.env.EMAIL_MAX_RETRIES || '3'
  });
});

export default emailTestRouter;