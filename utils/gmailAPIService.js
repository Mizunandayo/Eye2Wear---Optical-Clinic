/* eslint-disable no-undef */
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class GmailAPIService {
  constructor() {
    this.gmail = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    try {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'urn:ietf:wg:oauth:2.0:oob'
      );
      auth.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });
      this.gmail = google.gmail({ version: 'v1', auth });
      this.initialized = true;
      console.log('Gmail API service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gmail API:', error);
      throw error;
    }
  }

  async sendVerificationEmailGmailAPI(email, token, firstName, clinicName, patientId) {
    try {
      await this.initialize();
      const subject = 'Verify Your Eye2Wear Account - ' + clinicName;
      const verificationLink = process.env.FRONTEND_URL + '/verify-email/' + patientId + '/' + token;
      const htmlContent = '<div><h2>Welcome to Eye2Wear, ' + firstName + '!</h2><p>Please verify your email by clicking: <a href="' + verificationLink + '">Verify Email</a></p></div>';
      const textContent = 'Welcome to Eye2Wear, ' + firstName + '! Please verify your email by visiting: ' + verificationLink;
      return await this.sendEmail(email, subject, textContent, htmlContent);
    } catch (error) {
      console.error('Error sending verification email via Gmail API:', error);
      throw error;
    }
  }

  async sendAccountCreationEmailGmailAPI(email, password, firstName, accountType, clinicName = null) {
    try {
      await this.initialize();
      const subject = 'Your ' + accountType + ' Account Has Been Created - Eye2Wear';
      const loginUrl = process.env.FRONTEND_URL + '/login';
      const htmlContent = '<div><h2>Welcome to Eye2Wear, ' + firstName + '!</h2><p>Your ' + accountType + ' account has been created.</p><p><strong>Email:</strong> ' + email + '</p><p><strong>Password:</strong> ' + password + '</p><p><a href="' + loginUrl + '">Login to Your Account</a></p></div>';
      const textContent = 'Welcome to Eye2Wear, ' + firstName + '! Your ' + accountType + ' account has been created. Email: ' + email + ' Password: ' + password + ' Login at: ' + loginUrl;
      return await this.sendEmail(email, subject, textContent, htmlContent);
    } catch (error) {
      console.error('Error sending account creation email via Gmail API:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, textContent, htmlContent) {
    try {
      const email = [
        'To: ' + to,
        'From: ' + process.env.EMAIL_USER,
        'Subject: ' + subject,
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="boundary123"',
        '',
        '--boundary123',
        'Content-Type: text/plain; charset=utf-8',
        '',
        textContent,
        '',
        '--boundary123',
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlContent,
        '',
        '--boundary123--'
      ].join('\n');

      const encodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail
        }
      });

      console.log('Email sent successfully via Gmail API:', response.data.id);
      return { success: true, messageId: response.data.id };
    } catch (error) {
      console.error('Error sending email via Gmail API:', error);
      throw error;
    }
  }
}

export { GmailAPIService };

const gmailService = new GmailAPIService();

export default {
  sendVerificationEmailGmailAPI: (email, token, firstName, clinicName, patientId) => 
    gmailService.sendVerificationEmailGmailAPI(email, token, firstName, clinicName, patientId),
  sendAccountCreationEmailGmailAPI: (email, password, firstName, accountType, clinicName) => 
    gmailService.sendAccountCreationEmailGmailAPI(email, password, firstName, accountType, clinicName),
  gmailService
};
