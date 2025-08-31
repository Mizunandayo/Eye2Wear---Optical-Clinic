import cron from 'node-cron';
import PatientAppointment from '../models/patientappointment.js';
import SmsMessage from '../models/smsmessage.js';
import twilio from 'twilio';
import process from 'process';

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class SmsScheduler {
  static init() {
    console.log('🕐 Initializing SMS Scheduler...');
    
    // Schedule appointment reminders - runs every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
      console.log('⏰ Running daily appointment reminder job...');
      this.sendAppointmentReminders();
    }, {
      timezone: "Asia/Manila"
    });

    // Schedule appointment reminders - runs every day at 3:00 PM
    cron.schedule('0 15 * * *', () => {
      console.log('⏰ Running afternoon appointment reminder job...');
      this.sendAppointmentReminders();
    }, {
      timezone: "Asia/Manila"
    });

    console.log('✅ SMS Scheduler initialized successfully');
  }

  static async sendAppointmentReminders() {
    try {
      // Find appointments for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      // Find Ambher appointments for tomorrow
      const ambherAppointments = await PatientAppointment.find({
        patientambherappointmentdate: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        patientambherappointmentstatus: 'Confirmed'
      }).populate('patientdemographicid', 'patientcontactnumber patientfirstname patientlastname');

      // Find Bautista appointments for tomorrow
      const bautistaAppointments = await PatientAppointment.find({
        patientbautistaappointmentdate: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        patientbautistaappointmentstatus: 'Confirmed'
      }).populate('patientdemographicid', 'patientcontactnumber patientfirstname patientlastname');

      let totalSent = 0;
      let totalFailed = 0;

      // Send reminders for Ambher appointments
      for (const appointment of ambherAppointments) {
        try {
          const result = await this.sendSingleAppointmentReminder(appointment, 'ambher');
          if (result.success) totalSent++;
          else totalFailed++;
        } catch (error) {
          console.error('Error sending Ambher appointment reminder:', error);
          totalFailed++;
        }
      }

      // Send reminders for Bautista appointments
      for (const appointment of bautistaAppointments) {
        try {
          const result = await this.sendSingleAppointmentReminder(appointment, 'bautista');
          if (result.success) totalSent++;
          else totalFailed++;
        } catch (error) {
          console.error('Error sending Bautista appointment reminder:', error);
          totalFailed++;
        }
      }

      console.log(`📱 Appointment reminders sent: ${totalSent} successful, ${totalFailed} failed`);

    } catch (error) {
      console.error('Error in sendAppointmentReminders:', error);
    }
  }

  static async sendSingleAppointmentReminder(appointment, clinicType) {
    try {
      const patient = appointment.patientdemographicid;
      if (!patient || !patient.patientcontactnumber) {
        return { success: false, error: 'No patient contact number' };
      }

      // Check if we already sent a reminder for this appointment today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const existingReminder = await SmsMessage.findOne({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        type: 'Appointment',
        createdAt: {
          $gte: today,
          $lte: endOfDay
        }
      });

      if (existingReminder) {
        console.log(`Reminder already sent today for ${patient.patientfirstname} ${patient.patientlastname}`);
        return { success: false, error: 'Reminder already sent today' };
      }

      // Format appointment details
      const appointmentDate = clinicType === 'ambher' 
        ? appointment.patientambherappointmentdate 
        : appointment.patientbautistaappointmentdate;
      
      const appointmentTime = clinicType === 'ambher'
        ? appointment.patientambherappointmenttime
        : appointment.patientbautistaappointmenttime;

      const clinicName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';

      const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create SMS message
      const message = `Appointment Reminder

Hello ${patient.patientfirstname},

This is a friendly reminder that you have an appointment tomorrow:

📅 Date: ${formattedDate}
🕐 Time: ${appointmentTime}
🏥 Clinic: ${clinicName}

Please arrive 15 minutes early. If you need to reschedule, please contact us immediately.

Thank you,
${clinicName}`;

      // Format phone number
      let phoneNumber = patient.patientcontactnumber.toString().replace(/\D/g, '');
      if (!phoneNumber.startsWith('1') && phoneNumber.length === 10) {
        phoneNumber = '1' + phoneNumber;
      }
      phoneNumber = '+' + phoneNumber;

      // Send SMS via Twilio
      const twilioMessage = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      // Create SMS record
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [phoneNumber],
        senderClinic: clinicName,
        senderUserId: 'scheduler',
        senderUserName: 'Automated Reminder System',
        type: 'Appointment',
        message: message,
        status: 'Sent',
        twilioMessageSid: twilioMessage.sid,
        sentAt: new Date()
      });

      await smsRecord.save();

      console.log(`✅ Appointment reminder sent to ${patient.patientfirstname} ${patient.patientlastname}`);
      return { success: true, messageId: smsRecord.messageId };

    } catch (error) {
      console.error('Error sending single appointment reminder:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendWishlistAvailabilityNotification(patientId, productName, clinicType) {
    try {
      const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/sms/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patientId: patientId,
          productName: productName,
          clinicType: clinicType
        })
      });

      if (!response.ok) {
        throw new Error(`Wishlist SMS API returned ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Wishlist availability notification sent:', result);
      return result;

    } catch (error) {
      console.error('❌ Failed to send wishlist availability notification:', error);
      throw error;
    }
  }
}

export default SmsScheduler;
