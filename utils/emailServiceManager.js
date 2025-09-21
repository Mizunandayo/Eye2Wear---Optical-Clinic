/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { GmailAPIService } from './gmailAPIService.js';

dotenv.config();

class EmailServiceManager {
  constructor() {
    this.emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    this.gmailService = null;
    
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
        return await this.gmailService.sendVerificationEmailGmailAPI(email, token, firstName, clinicName, patientId);
      } else {
        // Force Gmail API usage since SMTP is blocked by Render
        console.log('Forcing Gmail API usage (SMTP blocked by Render)');
        if (!this.gmailService) {
          this.gmailService = new GmailAPIService();
        }
        await this.gmailService.initialize();
        return await this.gmailService.sendVerificationEmailGmailAPI(email, token, firstName, clinicName, patientId);
      }
    } catch (error) {
      console.error('Error sending verification email via Gmail API:', error);
      
      // Instead of SMTP fallback, provide more detailed error information
      if (error.message && error.message.includes('invalid_client')) {
        console.error('OAuth authentication failed. Please check your Google Cloud Console configuration.');
        console.error('1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct');
        console.error('2. Ensure the OAuth consent screen is properly configured');
        console.error('3. Check if the refresh token is still valid');
        throw new Error('Gmail API authentication failed. Please check OAuth configuration.');
      }
      
      throw new Error(`Gmail API email service failed: ${error.message}`);
    }
  }

  async sendAccountCreationEmail(email, password, firstName, accountType, clinicName = null) {
    try {
      await this.initialize();

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for account creation email');
        return await this.gmailService.sendAccountCreationEmailGmailAPI(email, password, firstName, accountType, clinicName);
      } else {
        // Force Gmail API usage since SMTP is blocked by Render
        console.log('Forcing Gmail API usage for account creation (SMTP blocked by Render)');
        if (!this.gmailService) {
          this.gmailService = new GmailAPIService();
        }
        await this.gmailService.initialize();
        return await this.gmailService.sendAccountCreationEmailGmailAPI(email, password, firstName, accountType, clinicName);
      }
    } catch (error) {
      console.error('Error sending account creation email via Gmail API:', error);
      throw new Error(`Gmail API account creation email failed: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email, resetLink, firstName) {
    try {
      await this.initialize();

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for password reset email');
        return await this.gmailService.sendPasswordResetEmailGmailAPI(email, resetLink, firstName);
      } else {
        // Force Gmail API usage since SMTP is blocked by Render
        console.log('Forcing Gmail API usage for password reset (SMTP blocked by Render)');
        if (!this.gmailService) {
          this.gmailService = new GmailAPIService();
        }
        await this.gmailService.initialize();
        return await this.gmailService.sendPasswordResetEmailGmailAPI(email, resetLink, firstName);
      }
    } catch (error) {
      console.error('Error sending password reset email via Gmail API:', error);
      throw new Error(`Gmail API password reset email failed: ${error.message}`);
    }
  }
}

const emailServiceManager = new EmailServiceManager();

export { emailServiceManager };
export default emailServiceManager;