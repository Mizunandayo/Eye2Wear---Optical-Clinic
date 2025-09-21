/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { GmailAPIService } from './gmailAPIService.js';

dotenv.config();

class EmailServiceManager {
  constructor() {
    this.emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    this.gmailService = null;
    
    console.log(`Email provider set to: ${this.emailProvider}`);
    
    if (this.emailProvider === 'gmail-api') {
      this.gmailService = new GmailAPIService();
    }
  }

  async initialize() {
    if (this.emailProvider === 'gmail-api' && this.gmailService) {
      await this.gmailService.initialize();
    }
  }

  async sendVerificationEmail(email, token, firstName, clinicName, patientId) {
    try {
      await this.initialize();

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for verification email');
        try {
          return await this.gmailService.sendVerificationEmailGmailAPI(email, token, firstName, clinicName, patientId);
        } catch (gmailError) {
          console.log('Gmail API failed, falling back to SMTP...', gmailError.message);
          // Fallback to SMTP
          const { sendVerificationEmail: sendVerificationEmailSMTP } = await import('./emailService.js');
          const patientObj = {
            _id: patientId,
            patientemail: email,
            verificationtoken: token,
            patientfirstname: firstName,
            patientlastname: ''
          };
          return await sendVerificationEmailSMTP(patientObj);
        }
      } else {
        // Use SMTP
        console.log('Using SMTP for verification email');
        const { sendVerificationEmail: sendVerificationEmailSMTP } = await import('./emailService.js');
        const patientObj = {
          _id: patientId,
          patientemail: email,
          verificationtoken: token,
          patientfirstname: firstName,
          patientlastname: ''
        };
        return await sendVerificationEmailSMTP(patientObj);
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error(`Email service failed: ${error.message}`);
    }
  }

  async sendAccountCreationEmail(email, password, firstName, accountType, clinicName = null) {
    try {
      await this.initialize();

      // Force SMTP for now due to OAuth issues
      console.log('Using SMTP for account creation email (OAuth temporarily disabled)');
      const { sendAccountCreationEmail: sendAccountCreationEmailSMTP } = await import('./emailService.js');
      return await sendAccountCreationEmailSMTP(email, password, accountType);
    } catch (error) {
      console.error('Error sending account creation email via SMTP:', error);
      throw new Error(`SMTP account creation email failed: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email, resetLink, firstName) {
    try {
      await this.initialize();

      // Force SMTP for now due to OAuth issues  
      console.log('Using SMTP for password reset email (OAuth temporarily disabled)');
      
      // Create SMTP fallback using nodemailer
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Eye2Wear - Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello ${firstName || 'User'},</p>
            <p>You requested a password reset for your Eye2Wear account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending password reset email via SMTP:', error);
      throw new Error(`SMTP password reset email failed: ${error.message}`);
    }
  }
}

const emailServiceManager = new EmailServiceManager();

export { emailServiceManager };
export default emailServiceManager;