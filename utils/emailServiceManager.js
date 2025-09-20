/* eslint-disable no-undef */
import dotenv from 'dotenv';
import { sendVerificationEmail as sendVerificationEmailSMTP } from './emailService.js';
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
        console.log('Using SMTP for verification email');
        return await sendVerificationEmailSMTP(email, token, firstName, clinicName);
      }
    } catch (error) {
      console.error('Error sending verification email via ' + this.emailProvider + ':', error);
      
      if (this.emailProvider === 'gmail-api') {
        console.log('Gmail API failed, falling back to SMTP...');
        try {
          return await sendVerificationEmailSMTP(email, token, firstName, clinicName);
        } catch (smtpError) {
          console.error('SMTP fallback also failed:', smtpError);
          throw new Error('All email services failed');
        }
      }
      
      throw error;
    }
  }

  async sendAccountCreationEmail(email, password, firstName, accountType, clinicName = null) {
    try {
      await this.initialize();

      if (this.emailProvider === 'gmail-api' && this.gmailService) {
        console.log('Using Gmail API for account creation email');
        return await this.gmailService.sendAccountCreationEmailGmailAPI(email, password, firstName, accountType, clinicName);
      } else {
        console.log('Using SMTP for account creation email');
        const { sendAccountCreationEmail: sendAccountCreationEmailSMTP } = await import('./emailService.js');
        return await sendAccountCreationEmailSMTP(email, password, firstName, accountType, clinicName);
      }
    } catch (error) {
      console.error('Error sending account creation email via ' + this.emailProvider + ':', error);
      
      if (this.emailProvider === 'gmail-api') {
        console.log('Gmail API failed, falling back to SMTP...');
        try {
          const { sendAccountCreationEmail: sendAccountCreationEmailSMTP } = await import('./emailService.js');
          return await sendAccountCreationEmailSMTP(email, password, firstName, accountType, clinicName);
        } catch (smtpError) {
          console.error('SMTP fallback also failed:', smtpError);
          throw new Error('All email services failed');
        }
      }
      
      throw error;
    }
  }
}

const emailServiceManager = new EmailServiceManager();

export { emailServiceManager };
export default emailServiceManager;