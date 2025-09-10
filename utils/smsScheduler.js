import cron from 'node-cron';
import PatientAppointment from '../models/patientappointment.js';
import PatientOrderAmbher from '../models/patientorderambher.js';
import PatientOrderBautista from '../models/patientorderbautista.js';
import SmsMessage from '../models/smsmessage.js';
import iPragSMS from './iprogSMS.js';
import process from 'process';

// Initialize default iProg SMS client (for backward compatibility)
const iprogClient = new iPragSMS();

// Helper function to get clinic-specific iProg client
function getClinicSMSClient(clinicName) {
  if (!clinicName) {
    console.warn('⚠️  No clinic specified in scheduler, using default client');
    return iprogClient;
  }
  
  const normalizedClinic = clinicName.toLowerCase().trim();
  
  if (normalizedClinic.includes('ambher')) {
    return iPragSMS.createForAmbher();
  } else if (normalizedClinic.includes('bautista')) {
    return iPragSMS.createForBautista();
  }
  
  console.warn(`⚠️  Unknown clinic in scheduler: ${clinicName}, using default client`);
  return iprogClient;
}

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

    // Schedule automatic order status updates - runs every hour
    cron.schedule('0 * * * *', () => {
      console.log('⏰ Running hourly order status update job...');
      this.checkAndUpdateOrderStatuses();
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

Date: ${formattedDate}
Time: ${appointmentTime}
Clinic: ${clinicName}

Please arrive 15 minutes early. If you need to reschedule, please contact us immediately.

Thank you,
${clinicName}`;

      // Format phone number for Philippines
      let phoneNumber = patient.patientcontactnumber.toString().replace(/\D/g, '');
      
      // Handle Philippine number formats
      if (phoneNumber.length === 10 && phoneNumber.startsWith('9')) {
        phoneNumber = `63${phoneNumber}`;
      } else if (phoneNumber.length === 11 && phoneNumber.startsWith('09')) {
        phoneNumber = `63${phoneNumber.substring(1)}`;
      } else if (phoneNumber.length === 12 && phoneNumber.startsWith('63')) {
        // Already in correct format
      } else {
        // Default formatting
        phoneNumber = phoneNumber.startsWith('63') ? phoneNumber : `63${phoneNumber}`;
      }

      // Send SMS via iProg using bulk endpoint for consistency
      // Enhanced credits tracking for appointment reminders
      let creditsBeforeSending = null;
      let creditsAfterSending = null;
      let actualCreditsDeducted = 0;

      // Try multiple times to get accurate credits before sending
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const creditsBeforeResult = await iprogClient.checkSmsCredits();
          if (creditsBeforeResult.success) {
            creditsBeforeSending = creditsBeforeResult.balance;
            console.log(`💳 Appointment SMS credits before (attempt ${attempt}): ${creditsBeforeSending}`);
            break;
          }
        } catch (error) {
          console.warn(`⚠️ Appointment SMS credits check attempt ${attempt} failed:`, error.message);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      const bulkSmsResult = await iprogClient.sendBulkSMS([phoneNumber], message);

      // Enhanced credits check after sending with multiple attempts
      if (creditsBeforeSending !== null && bulkSmsResult.success) {
        console.log('💳 Starting post-appointment SMS credits verification...');
        
        const delays = [3000, 5000, 8000]; // 3, 5, 8 seconds
        
        for (let attempt = 0; attempt < delays.length; attempt++) {
          try {
            console.log(`💳 Waiting ${delays[attempt]/1000} seconds for appointment SMS API balance update...`);
            await new Promise(resolve => setTimeout(resolve, delays[attempt]));
            
            const creditsAfterResult = await iprogClient.checkSmsCredits();
            if (creditsAfterResult.success) {
              const newCreditsAfter = creditsAfterResult.balance;
              const newActualDeducted = creditsBeforeSending - newCreditsAfter;
              
              console.log(`💳 Appointment SMS credits check attempt ${attempt + 1}:`);
              console.log(`   Before: ${creditsBeforeSending}`);
              console.log(`   After: ${newCreditsAfter}`);
              console.log(`   Calculated deduction: ${newActualDeducted}`);
              
              // If we get a reasonable deduction amount, use it
              if (newActualDeducted > 0 && newActualDeducted <= 5) {
                creditsAfterSending = newCreditsAfter;
                actualCreditsDeducted = newActualDeducted;
                console.log(`✅ Using appointment SMS credits deduction from attempt ${attempt + 1}: ${actualCreditsDeducted}`);
                break;
              } else if (attempt === delays.length - 1) {
                // Last attempt, use whatever we got
                creditsAfterSending = newCreditsAfter;
                actualCreditsDeducted = newActualDeducted;
                console.log(`⚠️ Using final appointment SMS attempt result: ${actualCreditsDeducted}`);
              }
            }
          } catch (error) {
            console.warn(`⚠️ Appointment SMS credits check after sending (attempt ${attempt + 1}) failed:`, error.message);
          }
        }
      }
      
      // Extract single result from bulk response
      const smsResult = {
        success: bulkSmsResult.success,
        messageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : null,
        error: bulkSmsResult.error,
        provider: 'iProg-Bulk'
      };

      // Create SMS record with enhanced credits tracking
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [phoneNumber],
        senderClinic: clinicName,
        senderUserId: 'scheduler',
        senderUserName: 'Automated Reminder System',
        type: 'Appointment',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId,
        smsProvider: 'iProg',
        errorMessage: smsResult.success ? null : smsResult.error,
        sentAt: smsResult.success ? new Date() : null,
        // Enhanced credits storage logic
        smsCreditsDeducted: smsResult.success ? 
          (actualCreditsDeducted > 0 ? actualCreditsDeducted : 1) : 0,
        smsCreditsBalance: smsResult.success ? creditsAfterSending : creditsBeforeSending
      });

      // Enhanced logging for appointment SMS
      if (smsResult.success) {
        console.log(`💰 APPOINTMENT SMS CREDITS TRACKING:`);
        console.log(`   💳 Credits Before: ${creditsBeforeSending}`);
        console.log(`   💳 Credits After: ${creditsAfterSending}`);
        console.log(`   🔥 ACTUAL Deducted: ${actualCreditsDeducted}`);
        console.log(`   💾 Stored in DB: ${smsRecord.smsCreditsDeducted}`);
      }

      await smsRecord.save();

      if (smsResult.success) {
        console.log(`✅ Appointment reminder sent to ${patient.patientfirstname} ${patient.patientlastname} via iProg`);
        return { success: true, messageId: smsRecord.messageId, iprogMessageId: smsResult.messageId };
      } else {
        console.log(`❌ Failed to send appointment reminder to ${patient.patientfirstname} ${patient.patientlastname}: ${smsResult.error}`);
        return { success: false, error: smsResult.error };
      }

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

  static async checkAndUpdateOrderStatuses() {
    try {
      console.log('🔍 Starting automatic order status update check...');
      
      // Get current date in Philippines timezone
      const currentPhilippinesDate = new Date().toLocaleDateString('en-CA', {
        timeZone: 'Asia/Manila'
      });
      
      console.log(`📅 Current Philippines date: ${currentPhilippinesDate}`);
      
      let totalUpdated = 0;
      
      // Check and update Ambher orders
      const ambherUpdated = await this.updateOrdersForClinic('ambher', currentPhilippinesDate);
      totalUpdated += ambherUpdated;
      
      // Check and update Bautista orders
      const bautistaUpdated = await this.updateOrdersForClinic('bautista', currentPhilippinesDate);
      totalUpdated += bautistaUpdated;
      
      console.log(`📊 Order status update complete: ${totalUpdated} orders updated to "Ready for Pickup"`);
      
    } catch (error) {
      console.error('❌ Error in checkAndUpdateOrderStatuses:', error);
    }
  }

  static async updateOrdersForClinic(clinicType, currentDate) {
    try {
      const OrderModel = clinicType === 'ambher' ? PatientOrderAmbher : PatientOrderBautista;
      const statusField = clinicType === 'ambher' ? 'patientorderambherstatus' : 'patientorderbautistastatus';
      const pickupDateField = clinicType === 'ambher' ? 'patientorderambherproductchosenpickupdate' : 'patientorderbautistaproductchosenpickupdate';
      const idField = clinicType === 'ambher' ? 'patientorderambherid' : 'patientorderbautistaid';
      
      console.log(`🔍 Checking ${clinicType} orders for status updates...`);
      
      // Find pending orders with pickup dates that have reached today
      const pendingOrders = await OrderModel.find({
        [statusField]: 'Pending',
        [pickupDateField]: { 
          $exists: true, 
          $nin: ['Later', 'Now', null, '']
        }
      });
      
      console.log(`📋 Found ${pendingOrders.length} pending ${clinicType} orders to check`);
      
      let updatedCount = 0;
      
      for (const order of pendingOrders) {
        const pickupDate = order[pickupDateField];
        
        if (!pickupDate) continue;
        
        // Convert pickup date to comparable format
        let pickupDateFormatted;
        try {
          pickupDateFormatted = new Date(pickupDate).toLocaleDateString('en-CA');
        } catch {
          console.warn(`⚠️ Invalid pickup date format for order ${order[idField]}: ${pickupDate}`);
          continue;
        }
        
        console.log(`📦 Order ${order[idField]}: Pickup date ${pickupDateFormatted} vs Current date ${currentDate}`);
        
        // If pickup date is today or has passed, update status
        if (pickupDateFormatted <= currentDate) {
          try {
            console.log(`✅ Updating order ${order[idField]} to "Ready for Pickup"`);
            
            // Update the order status in database only if it's still "Pending"
            const updateResult = await OrderModel.findOneAndUpdate(
              { 
                _id: order._id,
                [statusField]: 'Pending' // Only update if still Pending
              },
              {
                [statusField]: 'Ready for Pickup'
              },
              { new: true }
            );
            
            if (updateResult) {
              // Check if SMS was already sent for this order before sending
              const existingSms = await SmsMessage.findOne({
                $and: [
                  {
                    $or: [
                      { recipients: { $regex: `${order[idField]}` } },
                      { message: { $regex: `Order ID: ${order[idField]}|Order.*${order[idField]}` } }
                    ]
                  },
                  { type: 'Order Status' },
                  { status: { $in: ['Sent', 'Delivered'] } },
                  { message: { $regex: `ready for pickup`, $options: 'i' } }
                ]
              });
              
              if (!existingSms) {
                // Send SMS notification only if no existing SMS found
                await this.sendOrderStatusSMS(order[idField], clinicType, 'Ready for Pickup');
                console.log(`✅ Order ${order[idField]} automatically updated to "Ready for Pickup" with SMS sent`);
              } else {
                console.log(`✅ Order ${order[idField]} automatically updated to "Ready for Pickup" (SMS already sent at ${existingSms.createdAt})`);
              }
              
              updatedCount++;
            } else {
              console.log(`ℹ️ Order ${order[idField]} was already updated or no longer exists`);
            }
            
          } catch (error) {
            console.error(`❌ Failed to update order ${order[idField]}:`, error);
          }
        }
      }
      
      console.log(`📊 ${clinicType} orders: ${updatedCount} out of ${pendingOrders.length} updated to "Ready for Pickup"`);
      return updatedCount;
      
    } catch (error) {
      console.error(`❌ Error updating ${clinicType} orders:`, error);
      return 0;
    }
  }

  static async sendOrderStatusSMS(orderId, orderType, newStatus) {
    try {
      console.log(`📱 Sending SMS for order ${orderId} (${orderType}) status: ${newStatus}`);
      
      const response = await fetch(`${process.env.VITE_API_URL || 'http://localhost:3000'}/api/sms/order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
          orderType: orderType,
          newStatus: newStatus
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SMS API returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Order status SMS sent successfully for order ${orderId}`);
      return result;

    } catch (error) {
      console.error(`❌ Failed to send order status SMS for order ${orderId}:`, error);
      throw error;
    }
  }
}

export default SmsScheduler;