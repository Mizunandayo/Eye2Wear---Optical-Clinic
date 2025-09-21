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

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for account creation email');
        try {
          return await this.gmailService.sendAccountCreationEmailGmailAPI(email, password, firstName, accountType, clinicName);
        } catch (gmailError) {
          console.log('Gmail API failed, falling back to SMTP...', gmailError.message);
          // Fallback to SMTP
          const { sendAccountCreationEmail: sendAccountCreationEmailSMTP } = await import('./emailService.js');
          return await sendAccountCreationEmailSMTP(email, password, accountType);
        }
      } else {
        // Use SMTP
        console.log('Using SMTP for account creation email');
        const { sendAccountCreationEmail: sendAccountCreationEmailSMTP } = await import('./emailService.js');
        return await sendAccountCreationEmailSMTP(email, password, accountType);
      }
    } catch (error) {
      console.error('Error sending account creation email:', error);
      throw new Error(`Email service failed: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email, resetLink, firstName) {
    try {
      await this.initialize();

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for password reset email');
        try {
          return await this.gmailService.sendPasswordResetEmailGmailAPI(email, resetLink, firstName);
        } catch (gmailError) {
          console.log('Gmail API failed, falling back to SMTP...', gmailError.message);
          // Fallback to SMTP
          const { sendPasswordResetEmail: sendPasswordResetEmailSMTP } = await import('./emailService.js');
          return await sendPasswordResetEmailSMTP(email, resetLink, firstName);
        }
      } else {
        // Use SMTP
        console.log('Using SMTP for password reset email');
        const { sendPasswordResetEmail: sendPasswordResetEmailSMTP } = await import('./emailService.js');
        return await sendPasswordResetEmailSMTP(email, resetLink, firstName);
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error(`Email service failed: ${error.message}`);
    }
  }

  async sendAccountDeletionEmail(email, accountType = 'Patient') {
    try {
      await this.initialize();

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for account deletion email');
        try {
          return await this.gmailService.sendAccountDeletionEmailGmailAPI(email, accountType);
        } catch (gmailError) {
          console.log('Gmail API failed, falling back to SMTP...', gmailError.message);
          // Fallback to SMTP
          const { sendAccountDeletionEmail: sendAccountDeletionEmailSMTP } = await import('./emailService.js');
          return await sendAccountDeletionEmailSMTP(email, accountType);
        }
      } else {
        // Use SMTP
        console.log('Using SMTP for account deletion email');
        const { sendAccountDeletionEmail: sendAccountDeletionEmailSMTP } = await import('./emailService.js');
        return await sendAccountDeletionEmailSMTP(email, accountType);
      }
    } catch (error) {
      console.error('Error sending account deletion email:', error);
      throw new Error(`Email service failed: ${error.message}`);
    }
  }
}

const emailServiceManager = new EmailServiceManager();

export { emailServiceManager };
export default emailServiceManager;