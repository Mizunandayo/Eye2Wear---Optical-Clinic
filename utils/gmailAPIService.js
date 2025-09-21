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
        null // No redirect URI needed for server-side with refresh token
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
      const loginUrl = process.env.FRONTEND_URL + '/userlogin';
      const htmlContent = '<div><h2>Welcome to Eye2Wear, ' + firstName + '!</h2><p>Your ' + accountType + ' account has been created.</p><p><strong>Email:</strong> ' + email + '</p><p><strong>Password:</strong> ' + password + '</p><p><a href="' + loginUrl + '">Login to Your Account</a></p></div>';
      const textContent = 'Welcome to Eye2Wear, ' + firstName + '! Your ' + accountType + ' account has been created. Email: ' + email + ' Password: ' + password + ' Login at: ' + loginUrl;
      return await this.sendEmail(email, subject, textContent, htmlContent);
    } catch (error) {
      console.error('Error sending account creation email via Gmail API:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, textContent, htmlContent, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
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
        console.error(`Gmail API attempt ${attempt}/${retries} failed:`, error.message);
        
        if (attempt === retries) {
          console.error('All Gmail API attempts failed:', error);
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  async sendPasswordResetEmailGmailAPI(email, resetLink, firstName) {
    try {
      console.log('Sending password reset email via Gmail API to:', email);
      console.log('Reset link:', resetLink);

      await this.initialize();

      const subject = 'Eye2Wear - Password Reset';
      const html = `
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
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated message from Eye2Wear. Please do not reply to this email.</p>
        </div>
      `;

      const message = [
        'Content-Type: text/html; charset="UTF-8"',
        'MIME-Version: 1.0',
        `To: ${email}`,
        `Subject: ${subject}`,
        '',
        html
      ].join('\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log('Password reset email sent successfully via Gmail API:', response.data.id);
      return { success: true, messageId: response.data.id };
    } catch (error) {
      console.error('Error sending password reset email via Gmail API:', error);
      throw error;
    }
  }

  async sendAccountDeletionEmailGmailAPI(email, accountType = 'Patient') {
    try {
      console.log('Sending account deletion email via Gmail API to:', email);

      await this.initialize();

      const subject = `Eye2Wear - ${accountType} Account Deleted`;
      const html = `
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
      `;

      const textContent = `
        Eye2Wear - Account Deletion Notice
        
        We would like to notify you that your ${accountType.toLowerCase()} account has been deleted from our system.
        
        If this was not requested by you, please contact our support team immediately.
        
        © 2024 Eye2Wear. All rights reserved.
      `;

      return await this.sendEmail(email, subject, textContent, html);
    } catch (error) {
      console.error('Error sending account deletion email via Gmail API:', error);
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
  sendPasswordResetEmailGmailAPI: (email, resetLink, firstName) => 
    gmailService.sendPasswordResetEmailGmailAPI(email, resetLink, firstName),
  sendAccountDeletionEmailGmailAPI: (email, accountType) => 
    gmailService.sendAccountDeletionEmailGmailAPI(email, accountType),
  gmailService
};
