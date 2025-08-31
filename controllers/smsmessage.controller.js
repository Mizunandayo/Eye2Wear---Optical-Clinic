/* eslint-disable no-undef */
import twilio from 'twilio';
import SmsMessage from '../models/smsmessage.js';
import PatientDemographic from '../models/patientdemographic.js';
import PatientAppointment from '../models/patientappointment.js';
import mongoose from 'mongoose';

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper function to format phone numbers for Twilio
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.toString().replace(/\D/g, '');
  
  // For Philippine numbers starting with 9, add +63
  if (cleaned.length === 10 && cleaned.startsWith('9')) {
    return `+63${cleaned}`;
  }
  
  // For numbers starting with 63, add +
  if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return `+${cleaned}`;
  }
  
  // For numbers already starting with +63
  if (phone.toString().startsWith('+63')) {
    return phone.toString();
  }
  
  // Return as is if no format matches
  return phone.toString();
}

// Helper function to get valid sender user ID
function getValidSenderUserId(userId) {
  if (!userId) {
    return new mongoose.Types.ObjectId();
  }
  
  try {
    // If it's already a valid ObjectId, return it
    if (mongoose.Types.ObjectId.isValid(userId)) {
      return new mongoose.Types.ObjectId(userId);
    }
    
    // Otherwise generate a new one
    return new mongoose.Types.ObjectId();
  } catch (error) {
    console.warn('Invalid user ID provided, generating placeholder:', error);
    return new mongoose.Types.ObjectId();
  }
}

class SmsController {
  // Send promotional SMS to all patient contact numbers
  static async sendPromotionalSms(req, res) {
    try {
      const { subject, message, senderClinic, senderUserId, senderUserName } = req.body;

      // Validate required fields
      if (!subject || !message || !senderClinic || !senderUserId || !senderUserName) {
        return res.status(400).json({
          error: 'Missing required fields: subject, message, senderClinic, senderUserId, senderUserName'
        });
      }

      // Get all patients with contact numbers regardless of clinic
      const patients = await PatientDemographic.find({
        patientcontactnumber: { $exists: true, $ne: null }
      }).select('patientcontactnumber patientfirstname patientlastname');

      if (!patients || patients.length === 0) {
        return res.status(404).json({
          error: 'No patients found with contact numbers'
        });
      }

      // Filter valid phone numbers
      const validPatients = patients.filter(patient => {
        const phone = patient.patientcontactnumber;
        return phone && /^\+?[\d\s\-()]+$/.test(phone.toString());
      });

      if (validPatients.length === 0) {
        return res.status(404).json({
          error: 'No valid phone numbers found'
        });
      }

      // Validate senderUserId - ensure it's a valid ObjectId or generate a placeholder
      const validSenderUserId = getValidSenderUserId(senderUserId);

      // Format message with promotion subject
      const fullMessage = `${subject}\n\n${message}\n\nFrom: ${senderClinic}`;

      // Create SMS record
      const smsRecord = new SmsMessage({
        recipients: `All ${senderClinic} Patients`,
        recipientPhones: validPatients.map(p => p.patientcontactnumber),
        senderClinic,
        senderUserId: validSenderUserId,
        senderUserName: senderUserName || 'System',
        type: 'Promotional',
        message: fullMessage,
        promotionSubject: subject,
        status: 'Pending'
      });

      // Save the record first to generate the messageId through auto-increment
      await smsRecord.save();

      console.log('🔧 Twilio Configuration Check:', {
        accountSid: process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.substring(0, 10)}...` : 'NOT SET',
        authToken: process.env.TWILIO_AUTH_TOKEN ? `${process.env.TWILIO_AUTH_TOKEN.substring(0, 10)}...` : 'NOT SET',
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'NOT SET',
        messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || 'NOT SET'
      });

      console.log('⚠️  TRIAL ACCOUNT REMINDER: If using Twilio trial account, you have a 9 messages/day limit and can only send to verified numbers.');

      // Send SMS messages via Twilio
      const sendResults = [];
      let successCount = 0;
      let failCount = 0;

      for (const patient of validPatients) {
        try {
          // Format phone number for Twilio - handle Philippine numbers
          const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

          console.log(`Sending SMS to: ${phoneNumber} (original: ${patient.patientcontactnumber})`);

          // Check if we should use Messaging Service for international numbers
          const messageConfig = {
            body: fullMessage,
            to: phoneNumber
          };

          // Use Messaging Service if available for better international support
          if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
            messageConfig.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
          } else {
            messageConfig.from = process.env.TWILIO_PHONE_NUMBER;
          }

          const message = await client.messages.create(messageConfig);

          console.log(`✅ Twilio API response for ${phoneNumber}:`, {
            sid: message.sid,
            status: message.status,
            errorCode: message.errorCode,
            errorMessage: message.errorMessage,
            direction: message.direction,
            from: message.from,
            to: message.to
          });

          // Check if this might be a trial account limitation
          if (message.status === 'accepted' && message.from === null) {
            console.log(`⚠️  TRIAL ACCOUNT DETECTED: Message accepted but may not deliver to unverified numbers`);
          }

          sendResults.push({
            patient: `${patient.patientfirstname} ${patient.patientlastname}`,
            phone: phoneNumber,
            status: message.status === 'accepted' ? 'Sent' : 'Pending',
            twilioSid: message.sid,
            twilioStatus: message.status,
            twilioErrorCode: message.errorCode,
            trialAccountWarning: message.status === 'accepted' && message.from === null
          });

          successCount++;
        } catch (error) {
          console.error(`❌ Failed to send SMS to ${patient.patientcontactnumber}:`, {
            error: error.message,
            code: error.code,
            moreInfo: error.moreInfo,
            status: error.status,
            details: error.details,
            stack: error.stack
          });
          
          // Provide specific error messages for common issues
          let errorMessage = error.message;
          if (error.code === 21612) {
            errorMessage = 'International SMS not supported with current Twilio configuration. Please set up a Messaging Service.';
          } else if (error.code === 21614) {
            errorMessage = 'Invalid phone number format.';
          } else if (error.code === 21211) {
            errorMessage = 'Invalid phone number.';
          } else if (error.code === 21408) {
            errorMessage = 'Permission to send an SMS has not been enabled for the region indicated by the To number.';
          } else if (error.code === 21610) {
            errorMessage = 'Attempt to send to unsubscribed recipient.';
          } else if (error.code === 21602) {
            errorMessage = 'Message body is required.';
          } else if (error.code === 21604) {
            errorMessage = 'A message body or media url is required.';
          } else if (error.code === 63038) {
            errorMessage = '⚠️ TRIAL ACCOUNT: Daily SMS limit exceeded (9 messages/day). Upgrade your Twilio account or wait until tomorrow.';
          } else if (error.code === 63003) {
            errorMessage = '⚠️ TRIAL ACCOUNT: Insufficient account balance. Please add funds to your Twilio account.';
          }
          
          sendResults.push({
            patient: `${patient.patientfirstname} ${patient.patientlastname}`,
            phone: patient.patientcontactnumber,
            status: 'Failed',
            error: errorMessage,
            twilioErrorCode: error.code
          });
          failCount++;
        }
      }

      // Update SMS record status
      if (successCount > 0 && failCount === 0) {
        smsRecord.status = 'Sent';
        smsRecord.sentAt = new Date();
      } else if (successCount > 0 && failCount > 0) {
        smsRecord.status = 'Sent';
        smsRecord.sentAt = new Date();
        smsRecord.errorMessage = `Partial success: ${successCount} sent, ${failCount} failed`;
      } else {
        smsRecord.status = 'Failed';
        smsRecord.errorMessage = 'All messages failed to send';
      }

      await smsRecord.save();

      res.status(200).json({
        success: true,
        messageId: smsRecord.messageId,
        totalRecipients: validPatients.length,
        successCount,
        failCount,
        results: sendResults,
        smsRecord
      });

    } catch (error) {
      console.error('Error sending promotional SMS:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Get all SMS messages with pagination and filtering
  static async getSmsMessages(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      
      if (req.query.clinic) {
        filter.senderClinic = req.query.clinic;
      }
      
      if (req.query.type) {
        filter.type = req.query.type;
      }
      
      if (req.query.status) {
        filter.status = req.query.status;
      }

      if (req.query.search) {
        filter.$or = [
          { messageId: { $regex: req.query.search, $options: 'i' } },
          { recipients: { $regex: req.query.search, $options: 'i' } },
          { message: { $regex: req.query.search, $options: 'i' } },
          { promotionSubject: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const total = await SmsMessage.countDocuments(filter);
      const smsMessages = await SmsMessage.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        data: smsMessages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Error fetching SMS messages:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Get SMS message by ID
  static async getSmsMessageById(req, res) {
    try {
      const { id } = req.params;
      const smsMessage = await SmsMessage.findById(id);

      if (!smsMessage) {
        return res.status(404).json({
          error: 'SMS message not found'
        });
      }

      res.status(200).json({
        success: true,
        data: smsMessage
      });

    } catch (error) {
      console.error('Error fetching SMS message:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Update SMS message status (for webhook updates)
  static async updateSmsStatus(req, res) {
    try {
      const { MessageSid, MessageStatus } = req.body;

      if (!MessageSid || !MessageStatus) {
        return res.status(400).json({
          error: 'Missing required fields: MessageSid, MessageStatus'
        });
      }

      // Map Twilio status to our status
      let status;
      switch (MessageStatus) {
        case 'delivered':
          status = 'Delivered';
          break;
        case 'sent':
          status = 'Sent';
          break;
        case 'failed':
        case 'undelivered':
          status = 'Failed';
          break;
        default:
          status = 'Pending';
      }

      const updateData = { status };
      
      if (MessageStatus === 'delivered') {
        updateData.deliveredAt = new Date();
      } else if (MessageStatus === 'sent') {
        updateData.sentAt = new Date();
      }

      const smsMessage = await SmsMessage.findOneAndUpdate(
        { twilioMessageSid: MessageSid },
        updateData,
        { new: true }
      );

      if (!smsMessage) {
        return res.status(404).json({
          error: 'SMS message not found'
        });
      }

      res.status(200).json({
        success: true,
        data: smsMessage
      });

    } catch (error) {
      console.error('Error updating SMS status:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Delete SMS message
  static async deleteSmsMessage(req, res) {
    try {
      const { id } = req.params;
      const smsMessage = await SmsMessage.findByIdAndDelete(id);

      if (!smsMessage) {
        return res.status(404).json({
          error: 'SMS message not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'SMS message deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting SMS message:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Get SMS statistics
  static async getSmsStats(req, res) {
    try {
      const filter = {};
      
      if (req.query.clinic) {
        filter.senderClinic = req.query.clinic;
      }

      const stats = await SmsMessage.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            sentMessages: {
              $sum: { $cond: [{ $eq: ['$status', 'Sent'] }, 1, 0] }
            },
            deliveredMessages: {
              $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
            },
            failedMessages: {
              $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
            },
            pendingMessages: {
              $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
            }
          }
        }
      ]);

      const result = stats[0] || {
        totalMessages: 0,
        sentMessages: 0,
        deliveredMessages: 0,
        failedMessages: 0,
        pendingMessages: 0
      };

      res.status(200).json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Error fetching SMS stats:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Send appointment reminder SMS
  static async sendAppointmentReminder(req, res) {
    try {
      const { appointmentId } = req.body;

      if (!appointmentId) {
        return res.status(400).json({
          error: 'Appointment ID is required'
        });
      }

      // Get appointment details
      const appointment = await PatientAppointment.findById(appointmentId)
        .populate('patientdemographicid', 'patientcontactnumber patientfirstname patientlastname')
        .populate('cliniclocationid', 'cliniclocationname');

      if (!appointment) {
        return res.status(404).json({
          error: 'Appointment not found'
        });
      }

      const patient = appointment.patientdemographicid;
      if (!patient || !patient.patientcontactnumber) {
        return res.status(400).json({
          error: 'Patient contact number not found'
        });
      }

      // Format appointment date and time
      const appointmentDate = new Date(appointment.appointmentdate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const appointmentTime = appointment.appointmenttime;
      const clinicName = appointment.cliniclocationid?.cliniclocationname || appointment.appointmentclinic;

      // Create SMS message
      const message = `Appointment Reminder

Hello ${patient.patientfirstname},

This is a reminder that you have an upcoming appointment:

📅 Date: ${appointmentDate}
🕐 Time: ${appointmentTime}
🏥 Clinic: ${clinicName}

Please arrive 15 minutes early. If you need to reschedule, please contact us.

Thank you,
${appointment.appointmentclinic}`;

      // Send SMS via Twilio
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      // Check if we should use Messaging Service for international numbers
      const messageConfig = {
        body: message,
        to: phoneNumber
      };

      // Use Messaging Service if available for better international support
      if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
        messageConfig.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
      } else {
        messageConfig.from = process.env.TWILIO_PHONE_NUMBER;
      }

      const twilioMessage = await client.messages.create(messageConfig);

      // Create SMS record
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [phoneNumber],
        senderClinic: appointment.appointmentclinic,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Reminder',
        type: 'Appointment',
        message: message,
        status: 'Sent',
        twilioMessageSid: twilioMessage.sid,
        sentAt: new Date()
      });

      await smsRecord.save();

      res.status(200).json({
        success: true,
        messageId: smsRecord.messageId,
        twilioSid: twilioMessage.sid,
        message: 'Appointment reminder sent successfully'
      });

    } catch (error) {
      console.error('Error sending appointment reminder:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Send order status update SMS
  static async sendOrderStatusUpdate(req, res) {
    try {
      const { orderId, orderType, newStatus } = req.body;

      if (!orderId || !orderType || !newStatus) {
        return res.status(400).json({
          error: 'Order ID, order type, and new status are required'
        });
      }

      let order;
      let OrderModel;

      // Determine which order model to use
      if (orderType === 'ambher') {
        const PatientOrderAmbher = (await import('../models/patientorderambher.js')).default;
        OrderModel = PatientOrderAmbher;
      } else if (orderType === 'bautista') {
        const PatientOrderBautista = (await import('../models/patientorderbautista.js')).default;
        OrderModel = PatientOrderBautista;
      } else {
        return res.status(400).json({
          error: 'Invalid order type. Must be "ambher" or "bautista"'
        });
      }

      // Get order details
      order = await OrderModel.findById(orderId)
        .populate('patientdemographicid', 'patientcontactnumber patientfirstname patientlastname');

      if (!order) {
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      const patient = order.patientdemographicid;
      if (!patient || !patient.patientcontactnumber) {
        return res.status(400).json({
          error: 'Patient contact number not found'
        });
      }

      // Determine clinic name based on order type
      const clinicName = orderType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';

      // Create status-specific message
      let statusMessage = '';
      switch (newStatus.toLowerCase()) {
        case 'confirmed':
          statusMessage = 'Your order has been confirmed and is being processed.';
          break;
        case 'preparing':
          statusMessage = 'Your order is currently being prepared.';
          break;
        case 'ready for pickup':
          statusMessage = 'Great news! Your order is ready for pickup.';
          break;
        case 'completed':
          statusMessage = 'Your order has been completed. Thank you for choosing us!';
          break;
        case 'cancelled':
          statusMessage = 'Your order has been cancelled. Please contact us if you have any questions.';
          break;
        default:
          statusMessage = `Your order status has been updated to: ${newStatus}`;
      }

      // Create SMS message
      const orderIdField = orderType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid;
      const message = `Order Status Update

Hello ${patient.patientfirstname},

${statusMessage}

📦 Order ID: ${orderIdField}
📊 Status: ${newStatus}
🏥 Clinic: ${clinicName}

If you have any questions, please don't hesitate to contact us.

Thank you,
${clinicName}`;

      // Send SMS via Twilio
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      // Check if we should use Messaging Service for international numbers
      const messageConfig = {
        body: message,
        to: phoneNumber
      };

      // Use Messaging Service if available for better international support
      if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
        messageConfig.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
      } else {
        messageConfig.from = process.env.TWILIO_PHONE_NUMBER;
      }

      const twilioMessage = await client.messages.create(messageConfig);

      // Create SMS record
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [phoneNumber],
        senderClinic: clinicName,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Update',
        type: 'Order Status',
        message: message,
        status: 'Sent',
        twilioMessageSid: twilioMessage.sid,
        sentAt: new Date()
      });

      await smsRecord.save();

      res.status(200).json({
        success: true,
        messageId: smsRecord.messageId,
        twilioSid: twilioMessage.sid,
        message: 'Order status update sent successfully'
      });

    } catch (error) {
      console.error('Error sending order status update:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Send wishlist notification SMS
  static async sendWishlistNotification(req, res) {
    try {
      const { patientId, productName, clinicType } = req.body;

      if (!patientId || !productName || !clinicType) {
        return res.status(400).json({
          error: 'Patient ID, product name, and clinic type are required'
        });
      }

      // Get patient details
      const patient = await PatientDemographic.findById(patientId)
        .select('patientcontactnumber patientfirstname patientlastname');

      if (!patient || !patient.patientcontactnumber) {
        return res.status(400).json({
          error: 'Patient contact number not found'
        });
      }

      const clinicName = clinicType === 'ambher' ? 'Ambher Optical' : 'Bautista Eye Center';

      // Create SMS message
      const message = `Wishlist Item Available!

Hello ${patient.patientfirstname},

Great news! An item from your wishlist is now available:

👓 Product: ${productName}
🏥 Available at: ${clinicName}

Visit us or contact us to place your order before it's gone!

Thank you,
${clinicName}`;

      // Send SMS via Twilio
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      // Check if we should use Messaging Service for international numbers
      const messageConfig = {
        body: message,
        to: phoneNumber
      };

      // Use Messaging Service if available for better international support
      if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
        messageConfig.messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
      } else {
        messageConfig.from = process.env.TWILIO_PHONE_NUMBER;
      }

      const twilioMessage = await client.messages.create(messageConfig);

      // Create SMS record
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [phoneNumber],
        senderClinic: clinicName,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Notification',
        type: 'Wishlist',
        message: message,
        status: 'Sent',
        twilioMessageSid: twilioMessage.sid,
        sentAt: new Date()
      });

      await smsRecord.save();

      res.status(200).json({
        success: true,
        messageId: smsRecord.messageId,
        twilioSid: twilioMessage.sid,
        message: 'Wishlist notification sent successfully'
      });

    } catch (error) {
      console.error('Error sending wishlist notification:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
}

export default SmsController;
