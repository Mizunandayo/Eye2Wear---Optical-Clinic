import cron from 'node-cron';
import PatientAppointment from '../models/patientappointment.js';
import PatientDemographic from '../models/patientdemographic.js';
import SmsMessage from '../models/smsmessage.js';
import iPragSMS from './iprogSMS.js';

class AppointmentExpirationScheduler {
  constructor() {
    this.task = null;
  }

  /**
   * Parse time string (e.g., "10:00 AM") to hours and minutes
   */
  parseTime(timeString) {
    if (!timeString) return null;
    
    const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return null;

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const period = timeMatch[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return { hours, minutes };
  }

  /**
   * Check and expire appointments that are 1 hour before their scheduled time
   */
  async checkAndExpireAppointments() {
    try {
      const now = new Date();
      console.log(`🕐 [${now.toISOString()}] Checking for appointments to expire...`);

      // Find all pending appointments
      const pendingAppointments = await PatientAppointment.find({
        $or: [
          { patientambherappointmentstatus: 'Pending' },
          { patientbautistaappointmentstatus: 'Pending' }
        ]
      });

      let expiredCount = 0;

      for (const appointment of pendingAppointments) {
        let needsUpdate = false;
        const updateData = {};

        // Check Ambher Optical appointment
        if (
          appointment.patientambherappointmentstatus === 'Pending' &&
          appointment.patientambherappointmentdate &&
          appointment.patientambherappointmenttime
        ) {
          const shouldExpire = this.shouldExpireAppointment(
            appointment.patientambherappointmentdate,
            appointment.patientambherappointmenttime,
            now
          );

          if (shouldExpire) {
            updateData.patientambherappointmentstatus = 'Expired';
            updateData.$push = updateData.$push || {};
            updateData.$push.patientambherappointmentstatushistory = {
              status: 'Expired',
              changedAt: now,
              changedBy: 'System - Auto-expired 1 hour before appointment time'
            };
            needsUpdate = true;
            console.log(`⏰ Expiring Ambher appointment ${appointment.patientappointmentid} - scheduled for ${appointment.patientambherappointmentdate} ${appointment.patientambherappointmenttime}`);
          }
        }

        // Check Bautista Eye Center appointment
        if (
          appointment.patientbautistaappointmentstatus === 'Pending' &&
          appointment.patientbautistaappointmentdate &&
          appointment.patientbautistaappointmenttime
        ) {
          const shouldExpire = this.shouldExpireAppointment(
            appointment.patientbautistaappointmentdate,
            appointment.patientbautistaappointmenttime,
            now
          );

          if (shouldExpire) {
            updateData.patientbautistaappointmentstatus = 'Expired';
            updateData.$push = updateData.$push || {};
            updateData.$push.patientbautistaappointmentstatushistory = {
              status: 'Expired',
              changedAt: now,
              changedBy: 'System - Auto-expired 1 hour before appointment time'
            };
            needsUpdate = true;
            console.log(`⏰ Expiring Bautista appointment ${appointment.patientappointmentid} - scheduled for ${appointment.patientbautistaappointmentdate} ${appointment.patientbautistaappointmenttime}`);
          }
        }

        // Update the appointment if needed
        if (needsUpdate) {
          const updatedAppointment = await PatientAppointment.findOneAndUpdate(
            { patientappointmentid: appointment.patientappointmentid },
            updateData,
            { new: true }
          );
          expiredCount++;
          
          // Send SMS notification for expired appointment
          await this.sendExpirationSMS(updatedAppointment);
        }
      }

      if (expiredCount > 0) {
        console.log(`✅ Expired ${expiredCount} appointment(s)`);
      } else {
        console.log(`✓ No appointments to expire at this time`);
      }
    } catch (error) {
      console.error('❌ Error in appointment expiration scheduler:', error);
    }
  }

  /**
   * Determine if an appointment should be expired
   * Expires if current time is >= 1 hour before appointment time
   */
  shouldExpireAppointment(dateString, timeString, now) {
    try {
      // Parse the appointment date (format: YYYY-MM-DD)
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Parse the appointment time
      const parsedTime = this.parseTime(timeString);
      if (!parsedTime) {
        console.warn(`⚠️ Could not parse time: ${timeString}`);
        return false;
      }

      // Create the appointment datetime
      const appointmentDateTime = new Date(year, month - 1, day, parsedTime.hours, parsedTime.minutes, 0);
      
      // Calculate expiration time (1 hour before appointment)
      const expirationTime = new Date(appointmentDateTime.getTime() - (60 * 60 * 1000)); // 1 hour in milliseconds

      // Check if current time has passed the expiration time
      const shouldExpire = now >= expirationTime;

      if (shouldExpire) {
        console.log(`📅 Appointment scheduled: ${appointmentDateTime.toLocaleString()}`);
        console.log(`⏱️  Expiration time: ${expirationTime.toLocaleString()}`);
        console.log(`🕐 Current time: ${now.toLocaleString()}`);
      }

      return shouldExpire;
    } catch (error) {
      console.error(`❌ Error calculating expiration for ${dateString} ${timeString}:`, error);
      return false;
    }
  }

  /**
   * Initialize the scheduler
   * Runs every 30 minutes to check for appointments to expire
   */
  init() {
    // Run every 30 minutes: '*/30 * * * *'
    // Cron format: minute hour day month weekday
    // */30 means "every 30 minutes"
    this.task = cron.schedule('*/30 * * * *', () => {
      this.checkAndExpireAppointments();
    });

    console.log('📅 Appointment expiration scheduler initialized');
    console.log('⏰ Checking for expiring appointments every 30 minutes');
    
    // Run immediately on startup
    this.checkAndExpireAppointments();
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.task) {
      this.task.stop();
      console.log('🛑 Appointment expiration scheduler stopped');
    }
  }

  /**
   * Manually trigger the expiration check (for testing)
   */
  async triggerManualCheck() {
    console.log('🔧 Manual expiration check triggered');
    await this.checkAndExpireAppointments();
  }

  /**
   * Send SMS notification for expired appointment
   */
  async sendExpirationSMS(appointment) {
    try {
      // Get patient demographic information
      const patient = await PatientDemographic.findOne({ 
        patientemail: appointment.patientemail 
      });

      if (!patient) {
        console.warn(`⚠️ Patient not found for appointment ${appointment.patientappointmentid}`);
        return;
      }

      // Check which clinic(s) had expired appointments
      if (appointment.patientambherappointmentstatus === 'Expired') {
        await this.sendClinicExpirationSMS(
          appointment, 
          patient, 
          'Ambher Optical',
          appointment.patientambherappointmentdate,
          appointment.patientambherappointmenttime,
          appointment.patientambherappointmentlocation
        );
      }

      if (appointment.patientbautistaappointmentstatus === 'Expired') {
        await this.sendClinicExpirationSMS(
          appointment, 
          patient, 
          'Bautista Eye Center',
          appointment.patientbautistaappointmentdate,
          appointment.patientbautistaappointmenttime,
          appointment.patientbautistaappointmentlocation
        );
      }
    } catch (error) {
      console.error('❌ Error sending expiration SMS:', error);
    }
  }

  /**
   * Send clinic-specific expiration SMS
   */
  async sendClinicExpirationSMS(appointment, patient, clinicName, appointmentDate, appointmentTime, appointmentLocation) {
    try {
      // Format phone number
      const phoneNumber = this.formatPhoneNumber(patient.patientcontact);
      if (!phoneNumber) {
        console.warn(`⚠️ Invalid phone number for patient ${patient.patientemail}`);
        return;
      }

      // Create clinic-specific iProg client
      const iprogClient = iPragSMS.createForClinic(clinicName);

      // Format date
      const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create SMS message (no emojis as requested)
      const message = `Dear ${patient.patientfirstname} ${patient.patientlastname},

Your appointment at ${clinicName} scheduled for ${formattedDate} at ${appointmentTime} (${appointmentLocation}) has expired.

The appointment was not confirmed within the required timeframe. If you still need medical attention, please book a new appointment through our website or contact us directly.

We apologize for any inconvenience.

- ${clinicName}`;

      console.log(`📱 Sending expiration SMS to ${phoneNumber} for ${clinicName} appointment`);

      // Send SMS using clinic-specific iProg client
      const smsResult = await iprogClient.sendSMS(phoneNumber, message, 2);

      // Save SMS message to database
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [phoneNumber],
        senderClinic: clinicName,
        senderUserId: '000000000000000000000001', // System user ID
        senderUserName: 'System - Appointment Expiration',
        type: 'Appointment',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId || null,
        smsProvider: 'iProg',
        smsCreditsDeducted: smsResult.creditsUsed || 0,
        smsCreditsBalance: smsResult.balance || null,
        errorMessage: smsResult.error || null,
        sentAt: smsResult.success ? new Date() : null
      });

      await smsRecord.save();

      if (smsResult.success) {
        console.log(`✅ Expiration SMS sent successfully for ${clinicName} appointment ${appointment.patientappointmentid}`);
      } else {
        console.error(`❌ Failed to send expiration SMS for ${clinicName}:`, smsResult.error);
      }
    } catch (error) {
      console.error(`❌ Error sending ${clinicName} expiration SMS:`, error);
    }
  }

  /**
   * Format phone number for Philippines SMS
   */
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters
    const cleaned = phone.toString().replace(/\D/g, '');
    
    // For Philippine numbers, format as 63XXXXXXXXX
    if (cleaned.length === 10 && cleaned.startsWith('9')) {
      return '63' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('09')) {
      return '63' + cleaned.substring(1);
    } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
      return cleaned;
    } else if (cleaned.length === 13 && cleaned.startsWith('+63')) {
      return cleaned.substring(1);
    }
    
    // Default: return cleaned digits
    return cleaned;
  }
}

// Export singleton instance
const appointmentExpirationScheduler = new AppointmentExpirationScheduler();
export default appointmentExpirationScheduler;
