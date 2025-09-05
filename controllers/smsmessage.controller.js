// SMS Controller - iProg SMS Provider Implementation
// IMPORTANT: This controller uses iProg Bulk SMS endpoint for all SMS types (Order Status, Appointment, Wishlist)
// to ensure consistent delivery. The single SMS endpoint has delivery issues.
import SmsMessage from '../models/smsmessage.js';
import PatientDemographic from '../models/patientdemographic.js';
import PatientAppointment from '../models/patientappointment.js';
import mongoose from 'mongoose';
import iPragSMS from '../utils/iprogSMS.js';
import process from 'process';

// Initialize iProg SMS client
const iprogClient = new iPragSMS();

// SMS deduplication tracking
let recentSmsRequests = new Map();

// Helper function to format phone numbers
function formatPhoneNumber(phone) {
  // Remove all non-digit characters
  const cleaned = phone.toString().replace(/\D/g, '');
  
  // For Philippine numbers, format as 63XXXXXXXXX (without + prefix to match iProg utility)
  if (cleaned.length === 10 && cleaned.startsWith('9')) {
    return `63${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return `63${cleaned.substring(1)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return cleaned;
  } else if (cleaned.length === 13 && cleaned.startsWith('+63')) {
    return cleaned.substring(1); // Remove + prefix
  } else if (cleaned.length === 13 && cleaned.startsWith('63')) {
    return cleaned.substring(0, 12); // Remove extra digit if any
  }
  
  // Default: return cleaned digits
  return cleaned;
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
      const { subject, message, senderClinic, senderUserId, senderUserName, targetPhoneNumber, isOrderCompletion } = req.body;

      // Validate required fields
      if (!subject || !message || !senderClinic || !senderUserId || !senderUserName) {
        return res.status(400).json({
          error: 'Missing required fields: subject, message, senderClinic, senderUserId, senderUserName'
        });
      }

      // Check if this is an order completion SMS with specific target phone number
      if (isOrderCompletion && targetPhoneNumber) {
        console.log('📱 Processing order completion SMS to specific phone number:', targetPhoneNumber);
        
        // SMS deduplication check for order completion
        const orderCompletionKey = `order-completion-${targetPhoneNumber}-${Date.now().toString().substring(0, 10)}`; // Include minute timestamp
        
        if (recentSmsRequests.has(orderCompletionKey)) {
          console.warn(`⚠️ Duplicate order completion SMS blocked for phone ${targetPhoneNumber}`);
          return res.status(200).json({
            success: false,
            message: 'Duplicate order completion SMS blocked to prevent spam'
          });
        }
        
        // Record this request
        recentSmsRequests.set(orderCompletionKey, Date.now());
        
        // Validate senderUserId - ensure it's a valid ObjectId or generate a placeholder
        const validSenderUserId = getValidSenderUserId(senderUserId);

        // Format the message 
        const fullMessage = message; // Order completion message is already formatted

        // Create SMS record for single recipient
        const smsRecord = new SmsMessage({
          recipients: 'Order Completion Customer',
          recipientPhones: [targetPhoneNumber],
          senderClinic,
          senderUserId: validSenderUserId,
          senderUserName: senderUserName || 'System',
          type: 'Order Status', // Use valid enum value
          message: fullMessage,
          promotionSubject: subject,
          status: 'Pending',
          smsProvider: 'iProg'
        });

        // Save the record first to generate the messageId through auto-increment
        await smsRecord.save();

        // Format phone number and prepare as array for bulk SMS
        const formattedPhone = formatPhoneNumber(targetPhoneNumber);
        console.log('📱 Formatted phone number:', formattedPhone);
        console.log('📱 Using bulk SMS endpoint for single recipient to match promotional SMS behavior');

        // Use bulk SMS endpoint with single recipient (same as promotional SMS)
        const bulkSmsResult = await iprogClient.sendBulkSMS([formattedPhone], fullMessage);
        console.log('📡 Bulk SMS Result for single recipient:', bulkSmsResult);

        if (bulkSmsResult.success) {
          // Update SMS record with success
          smsRecord.status = 'Sent';
          smsRecord.sentAt = new Date();
          smsRecord.iprogMessageId = bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : 'bulk-sent';
          await smsRecord.save();

          return res.status(200).json({
            success: true,
            messageId: smsRecord.messageId,
            iprogMessageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : 'bulk-sent',
            message: 'Order completion SMS sent successfully via bulk endpoint',
            successCount: 1,
            failCount: 0
          });
        } else {
          // Update SMS record with failure
          smsRecord.status = 'Failed';
          smsRecord.errorMessage = bulkSmsResult.error;
          await smsRecord.save();

          return res.status(200).json({
            success: false,
            error: bulkSmsResult.error || 'Failed to send order completion SMS',
            successCount: 0,
            failCount: 1
          });
        }
      }

      // Regular promotional SMS logic (send to all patients)
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
        status: 'Pending',
        smsProvider: 'iProg'
      });

      // Save the record first to generate the messageId through auto-increment
      await smsRecord.save();

      // Check iProg SMS configuration
      const providerInfo = iprogClient.getProviderInfo();
      console.log('📱 SMS Provider Configuration:', providerInfo);

      // Prepare phone numbers for bulk SMS
      const phoneNumbers = validPatients.map(patient => formatPhoneNumber(patient.patientcontactnumber));

      // Send bulk SMS via iProg using the new bulk endpoint
      console.log(`📱 Sending promotional SMS to ${phoneNumbers.length} recipients via iProg bulk API`);
      
      const bulkSmsResult = await iprogClient.sendBulkSMS(phoneNumbers, fullMessage);

      let successCount = 0;
      let failCount = 0;
      const sendResults = [];

      if (bulkSmsResult.success) {
        // Bulk SMS was successful
        successCount = bulkSmsResult.totalSent || phoneNumbers.length;
        
        // Create individual result entries for each recipient
        validPatients.forEach((patient, index) => {
          const messageId = bulkSmsResult.messageIds && bulkSmsResult.messageIds[index] 
            ? bulkSmsResult.messageIds[index] 
            : `bulk-${index + 1}`;
            
          sendResults.push({
            patient: `${patient.patientfirstname} ${patient.patientlastname}`,
            phone: phoneNumbers[index],
            status: 'Sent',
            messageId: messageId,
            provider: 'iProg-Bulk',
            messageContent: fullMessage
          });
        });

        // Update SMS record with bulk success
        smsRecord.status = 'Sent';
        smsRecord.sentAt = new Date();
        smsRecord.iprogMessageId = bulkSmsResult.messageIds ? bulkSmsResult.messageIds.join(',') : 'bulk-sent';
        
        console.log(`✅ Bulk promotional SMS sent successfully to ${successCount} recipients`);
        
      } else {
        // Bulk SMS failed - fallback to individual sending
        console.log(`⚠️ Bulk SMS failed, falling back to individual sending: ${bulkSmsResult.error}`);
        
        for (const patient of validPatients) {
          try {
            // Format phone number
            const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

            // Send individual SMS via iProg
            const smsResult = await iprogClient.sendSMS(phoneNumber, fullMessage);
            
            if (smsResult.success) {
              sendResults.push({
                patient: `${patient.patientfirstname} ${patient.patientlastname}`,
                phone: phoneNumber,
                status: 'Sent',
                messageId: smsResult.messageId,
                provider: 'iProg-Individual',
                messageContent: fullMessage
              });
              successCount++;
            } else {
              sendResults.push({
                patient: `${patient.patientfirstname} ${patient.patientlastname}`,
                phone: phoneNumber,
                status: 'Failed',
                error: smsResult.error,
                provider: 'iProg-Individual',
                messageContent: fullMessage
              });
              failCount++;
            }
          } catch (error) {
            console.error(`❌ Failed to send SMS to ${patient.patientcontactnumber}:`, {
              error: error.message,
              code: error.code,
              moreInfo: error.moreInfo,
              status: error.status,
              details: error.details,
              stack: error.stack
            });
            
            // Handle SMS sending errors
            let errorMessage = error.message;
            
            sendResults.push({
              patient: `${patient.patientfirstname} ${patient.patientlastname}`,
              phone: patient.patientcontactnumber,
              status: 'Failed',
              error: errorMessage
            });
            failCount++;
          }
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
        message: 'SMS status updated successfully',
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

      // Send SMS via iProg using bulk endpoint for consistency
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      const bulkSmsResult = await iprogClient.sendBulkSMS([phoneNumber], message);
      
      // Extract single result from bulk response
      const smsResult = {
        success: bulkSmsResult.success,
        messageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : null,
        error: bulkSmsResult.error,
        provider: 'iProg-Bulk'
      };

      // Create SMS record - use original contact number to maintain consistency with patient data
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [patient.patientcontactnumber], // Use original contact number with "+" prefix
        senderClinic: appointment.appointmentclinic,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Reminder',
        type: 'Appointment',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId,
        smsProvider: 'iProg',
        errorMessage: smsResult.success ? null : smsResult.error,
        sentAt: smsResult.success ? new Date() : null
      });

      await smsRecord.save();

      res.status(200).json({
        success: smsResult.success,
        messageId: smsRecord.messageId,
        iprogMessageId: smsResult.messageId,
        status: smsResult.success ? 'sent' : 'failed',
        message: smsResult.success 
          ? 'Appointment reminder sent successfully via iProg'
          : `Failed to send appointment reminder: ${smsResult.error}`
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
      console.log('📱 SMS Order Status Update Request received:', req.body);
      
      const { orderId, orderType, newStatus } = req.body;
      
      console.log('🔍 Looking up order with custom ID:', orderId, 'Type:', orderType);

      if (!orderId || !orderType || !newStatus) {
        console.log('❌ Missing required fields:', { orderId, orderType, newStatus });
        return res.status(400).json({
          error: 'Order ID, order type, and new status are required'
        });
      }

      // SMS deduplication check - but allow order completion SMS
      const requestKey = `${orderId}-${orderType}-${newStatus}`;
      const now = Date.now();
      
      // For order completion, check if we already have a successful SMS record
      if (newStatus === 'Completed') {
        const existingSms = await SmsMessage.findOne({
          recipients: { $regex: orderId },
          type: 'Order Status',
          status: { $in: ['Sent', 'Delivered'] },
          message: { $regex: 'completed.*ready.*pickup' }
        }).sort({ createdAt: -1 });
        
        if (existingSms) {
          const timeSinceLastSms = now - existingSms.createdAt.getTime();
          if (timeSinceLastSms < 300000) { // 5 minutes
            console.warn(`⚠️ Order completion SMS already sent for order ${orderId} at ${existingSms.createdAt}`);
            return res.status(200).json({
              success: false,
              message: 'Order completion SMS already sent recently'
            });
          }
        }
      } else {
        // For non-completion status updates, use regular deduplication
        if (recentSmsRequests.has(requestKey)) {
          const lastRequestTime = recentSmsRequests.get(requestKey);
          if (now - lastRequestTime < 10000) { // 10 second deduplication window
            console.warn(`⚠️ Duplicate SMS request blocked for order ${orderId} with status ${newStatus}`);
            return res.status(200).json({
              success: false,
              message: 'Duplicate SMS request blocked to prevent spam'
            });
          }
        }
      }
      
      // Record this request
      recentSmsRequests.set(requestKey, now);
      
      // Clean up old entries (keep only last 5 minutes)
      for (const [key, timestamp] of recentSmsRequests.entries()) {
        if (now - timestamp > 300000) { // 5 minutes
          recentSmsRequests.delete(key);
        }
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

      // Get order details using custom order ID field
      if (orderType === 'ambher') {
        order = await OrderModel.findOne({ patientorderambherid: orderId });
      } else {
        order = await OrderModel.findOne({ patientorderbautistaid: orderId });
      }
      
      console.log('📋 Order lookup result:', order ? 'Found' : 'Not found');
      if (order) {
        console.log('📋 Order details:', {
          orderType: orderType,
          customId: orderType === 'ambher' ? order.patientorderambherid : order.patientorderbautistaid,
          patientName: `${order.patientfirstname} ${order.patientlastname}`,
          patientEmail: order.patientemail,
          contactNumber: order.patientcontactnumber
        });
      }
      console.log('📋 Order found:', order ? 'Yes' : 'No');

      if (!order) {
        console.log('❌ Order not found with ID:', orderId);
        return res.status(404).json({
          error: 'Order not found'
        });
      }

      // Get current patient demographics for up-to-date contact info
      const PatientDemographic = (await import('../models/patientdemographic.js')).default;
      let patientDemographic;
      
      try {
        // Find patient by email (more reliable than phone number)
        patientDemographic = await PatientDemographic.findOne({
          patientemail: order.patientemail
        });
        
        if (!patientDemographic) {
          // Fallback: try to find by name if email doesn't match
          patientDemographic = await PatientDemographic.findOne({
            patientfirstname: order.patientfirstname,
            patientlastname: order.patientlastname
          });
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch patient demographics:', error);
      }

      // Use current contact number from patient demographics, fallback to order record
      let contactNumber = order.patientcontactnumber; // Default fallback
      
      if (patientDemographic && patientDemographic.patientcontactnumber) {
        contactNumber = patientDemographic.patientcontactnumber;
        console.log('📞 Using current contact number from patient demographics:', contactNumber);
      } else {
        console.log('📞 Using contact number from order record:', contactNumber);
        console.warn('⚠️ Patient demographics lookup details:', {
          demographicsFound: !!patientDemographic,
          demographicsHasPhone: !!(patientDemographic && patientDemographic.patientcontactnumber),
          orderHasPhone: !!order.patientcontactnumber,
          orderEmail: order.patientemail,
          orderName: `${order.patientfirstname} ${order.patientlastname}`
        });
      }

      if (!contactNumber) {
        console.log('❌ No contact number found in order or patient demographics');
        console.error('🔍 Debug info:', {
          orderId: orderId,
          orderEmail: order.patientemail,
          orderPhone: order.patientcontactnumber,
          patientDemographicFound: !!patientDemographic,
          patientDemographicPhone: patientDemographic?.patientcontactnumber
        });
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

Hello ${order.patientfirstname},

${statusMessage}

📦 Order ID: ${orderIdField}
📊 Status: ${newStatus}
🏥 Clinic: ${clinicName}

If you have any questions, please don't hesitate to contact us.

Thank you,
${clinicName}`;

      // Send SMS via iProg using bulk endpoint for consistency (same as promotional SMS)
      const phoneNumber = formatPhoneNumber(contactNumber);
      console.log('📱 Formatted phone number for API:', phoneNumber);
      console.log('📱 Original contact number for database:', contactNumber);
      console.log('📝 Message to send:', message);
      console.log('📱 Using bulk SMS endpoint for single recipient to match promotional SMS behavior');

      const bulkSmsResult = await iprogClient.sendBulkSMS([phoneNumber], message);
      console.log('📡 Bulk SMS Result for single recipient:', bulkSmsResult);

      // Extract single result from bulk response
      const smsResult = {
        success: bulkSmsResult.success,
        messageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : null,
        error: bulkSmsResult.error,
        provider: 'iProg-Bulk'
      };

      // Create SMS record - use original contact number to maintain consistency with patient data
      const smsRecord = new SmsMessage({
        recipients: `${order.patientfirstname} ${order.patientlastname}`,
        recipientPhones: [contactNumber], // Use original contact number with "+" prefix
        senderClinic: clinicName,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Update',
        type: 'Order Status',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId,
        smsProvider: 'iProg',
        errorMessage: smsResult.success ? null : smsResult.error,
        sentAt: smsResult.success ? new Date() : null
      });

      // Validate the SMS record before saving
      console.log('💾 About to save SMS record:', {
        recipients: smsRecord.recipients,
        recipientPhones: smsRecord.recipientPhones,
        hasPhoneNumber: smsRecord.recipientPhones.length > 0 && smsRecord.recipientPhones[0],
        phoneNumberValue: smsRecord.recipientPhones[0],
        smsStatus: smsRecord.status
      });

      await smsRecord.save();
      console.log('💾 SMS record saved with ID:', smsRecord.messageId);

      console.log('✅ SMS process completed successfully');
      res.status(200).json({
        success: smsResult.success,
        messageId: smsRecord.messageId,
        iprogMessageId: smsResult.messageId,
        message: smsResult.success 
          ? 'Order status update sent successfully via iProg'
          : `Failed to send order status update: ${smsResult.error}`
      });

    } catch (error) {
      console.error('❌ Error processing order status update:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Test SMS configuration
  static async testSmsConfiguration(req, res) {
    try {
      console.log('🧪 Testing SMS configuration...');
      
      // Check iProg client configuration
      const providerInfo = iprogClient.getProviderInfo();
      console.log('📱 SMS Provider Info:', providerInfo);
      
      // Check environment variables
      const hasApiToken = !!process.env.IPROG_API_TOKEN;
      console.log('🔑 API Token configured:', hasApiToken);
      
      if (hasApiToken) {
        console.log('🔑 API Token (first 10 chars):', process.env.IPROG_API_TOKEN.substring(0, 10) + '...');
      }
      
      res.status(200).json({
        success: true,
        message: 'SMS configuration test completed',
        configuration: {
          providerInfo,
          hasApiToken,
          tokenPreview: hasApiToken ? process.env.IPROG_API_TOKEN.substring(0, 10) + '...' : 'Not configured'
        }
      });
      
    } catch (error) {
      console.error('❌ SMS configuration test failed:', error);
      res.status(500).json({
        success: false,
        error: 'SMS configuration test failed',
        details: error.message
      });
    }
  }

  // Test order SMS functionality
  static async testOrderSms(req, res) {
    try {
      console.log('🧪 Testing order SMS functionality...');
      
      // Test phone number formatting
      const testPhoneNumbers = [
        '09123456789',
        '9123456789', 
        '639123456789',
        '+639123456789'
      ];
      
      console.log('📞 Testing phone number formatting:');
      testPhoneNumbers.forEach(phone => {
        const formatted = formatPhoneNumber(phone);
        console.log(`  ${phone} -> ${formatted}`);
      });
      
      // Test message creation
      const testMessage = `Order Status Update

Hello John,

Your order has been completed. Thank you for choosing us!

📦 Order ID: AMB-2024-001
📊 Status: Completed
🏥 Clinic: Ambher Optical

If you have any questions, please don't hesitate to contact us.

Thank you,
Ambher Optical`;

      console.log('📝 Test message created:', testMessage.length, 'characters');
      
      // Test iProg client (without actually sending)
      const providerInfo = iprogClient.getProviderInfo();
      
      // Test with a real order simulation
      console.log('🧪 Testing real order SMS flow...');
      const testOrderId = '67890123456789012345abcd';
      
      // Try to find a real patient to test with
      try {
        const PatientAccount = (await import('../models/patientaccount.js')).default;
        const testPatient = await PatientAccount.findOne().limit(1);
        
        if (testPatient) {
          console.log('👤 Found test patient:', {
            name: `${testPatient.patientfirstname} ${testPatient.patientlastname}`,
            phone: testPatient.patientcontactnumber
          });
          
          const formattedPhone = formatPhoneNumber(testPatient.patientcontactnumber);
          console.log('📞 Formatted phone for real patient:', formattedPhone);
        } else {
          console.log('👤 No patients found for testing');
        }
      } catch (patientError) {
        console.log('👤 Could not fetch test patient:', patientError.message);
      }
      
      res.status(200).json({
        success: true,
        message: 'Order SMS test completed',
        phoneNumberTests: testPhoneNumbers.map(phone => ({
          original: phone,
          formatted: formatPhoneNumber(phone)
        })),
        messageLength: testMessage.length,
        providerInfo,
        testOrderId
      });
      
    } catch (error) {
      console.error('❌ Error testing order SMS:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test order SMS',
        details: error.message
      });
    }
  }

  // Diagnose phone number issues in the database
  static async diagnosePhoneIssue(req, res) {
    try {
      console.log('🔍 Diagnosing phone number issues...');
      
      // Check patient demographics
      const PatientDemographic = (await import('../models/patientdemographic.js')).default;
      const PatientOrderAmbher = (await import('../models/patientorderambher.js')).default;
      const PatientOrderBautista = (await import('../models/patientorderbautista.js')).default;
      
      // Count total patients
      const totalPatients = await PatientDemographic.countDocuments();
      
      // Count patients with phone numbers
      const patientsWithPhones = await PatientDemographic.countDocuments({
        patientcontactnumber: { $exists: true, $nin: [null, ''] }
      });
      
      // Count patients without phone numbers
      const patientsWithoutPhones = totalPatients - patientsWithPhones;
      
      // Sample patients with phones
      const samplePatientsWithPhones = await PatientDemographic.find({
        patientcontactnumber: { $exists: true, $nin: [null, ''] }
      }).limit(3).select('patientfirstname patientlastname patientcontactnumber');
      
      // Sample patients without phones
      const samplePatientsWithoutPhones = await PatientDemographic.find({
        $or: [
          { patientcontactnumber: { $exists: false } },
          { patientcontactnumber: null },
          { patientcontactnumber: '' }
        ]
      }).limit(3).select('patientfirstname patientlastname patientcontactnumber');
      
      // Check orders
      const totalAmbherOrders = await PatientOrderAmbher.countDocuments();
      const ambherOrdersWithPhones = await PatientOrderAmbher.countDocuments({
        patientcontactnumber: { $exists: true, $nin: [null, ''] }
      });
      
      const totalBautistaOrders = await PatientOrderBautista.countDocuments();
      const bautistaOrdersWithPhones = await PatientOrderBautista.countDocuments({
        patientcontactnumber: { $exists: true, $nin: [null, ''] }
      });
      
      // Sample recent orders
      const recentAmbherOrders = await PatientOrderAmbher.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select('patientfirstname patientlastname patientcontactnumber orderambherNumber createdAt');
        
      const recentBautistaOrders = await PatientOrderBautista.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .select('patientfirstname patientlastname patientcontactnumber patientorderbautistaid createdAt');
      
      console.log('📊 Phone Number Diagnosis Results:');
      console.log(`👥 Total Patients: ${totalPatients}`);
      console.log(`📱 Patients with phones: ${patientsWithPhones}`);
      console.log(`❌ Patients without phones: ${patientsWithoutPhones}`);
      console.log(`📦 Ambher orders with phones: ${ambherOrdersWithPhones}/${totalAmbherOrders}`);
      console.log(`📦 Bautista orders with phones: ${bautistaOrdersWithPhones}/${totalBautistaOrders}`);
      
      res.status(200).json({
        success: true,
        diagnosis: {
          patients: {
            total: totalPatients,
            withPhones: patientsWithPhones,
            withoutPhones: patientsWithoutPhones,
            phoneCompletionRate: `${((patientsWithPhones / totalPatients) * 100).toFixed(1)}%`
          },
          orders: {
            ambher: {
              total: totalAmbherOrders,
              withPhones: ambherOrdersWithPhones,
              phoneCompletionRate: totalAmbherOrders > 0 ? `${((ambherOrdersWithPhones / totalAmbherOrders) * 100).toFixed(1)}%` : '0%'
            },
            bautista: {
              total: totalBautistaOrders,
              withPhones: bautistaOrdersWithPhones,
              phoneCompletionRate: totalBautistaOrders > 0 ? `${((bautistaOrdersWithPhones / totalBautistaOrders) * 100).toFixed(1)}%` : '0%'
            }
          },
          samples: {
            patientsWithPhones: samplePatientsWithPhones,
            patientsWithoutPhones: samplePatientsWithoutPhones,
            recentAmbherOrders: recentAmbherOrders,
            recentBautistaOrders: recentBautistaOrders
          }
        },
        recommendation: patientsWithoutPhones > 0 
          ? "❌ ISSUE FOUND: Many patients are missing phone numbers. SMS notifications will fail for these patients."
          : "✅ All patients have phone numbers. SMS should work correctly.",
        solution: patientsWithoutPhones > 0 
          ? "Make phone number a required field during patient registration and order creation."
          : "No action needed."
      });
      
    } catch (error) {
      console.error('❌ Error diagnosing phone issues:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to diagnose phone issues',
        details: error.message
      });
    }
  }

  // Test real order SMS functionality with actual database lookup
  static async testRealOrderSms(req, res) {
    try {
      console.log('🧪 Testing REAL order SMS functionality...');
      
      const { orderId, orderType } = req.body;
      
      if (!orderId || !orderType) {
        return res.status(400).json({
          error: 'orderId and orderType are required',
          example: {
            orderId: '507f1f77bcf86cd799439011',
            orderType: 'ambher'
          }
        });
      }
      
      console.log('📦 Testing with order:', { orderId, orderType });
      
      // This will call the exact same function that the real order uses
      const result = await SmsController.sendOrderStatusUpdate({
        body: {
          orderId,
          orderType,
          newStatus: 'Completed'
        },
        user: {
          id: 'test-user-id',
          name: 'Test User'
        }
      }, res);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error testing real order SMS:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test real order SMS',
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

      // Send SMS via iProg using bulk endpoint for consistency
      const phoneNumber = formatPhoneNumber(patient.patientcontactnumber);

      const bulkSmsResult = await iprogClient.sendBulkSMS([phoneNumber], message);
      
      // Extract single result from bulk response
      const smsResult = {
        success: bulkSmsResult.success,
        messageId: bulkSmsResult.messageIds ? bulkSmsResult.messageIds[0] : null,
        error: bulkSmsResult.error,
        provider: 'iProg-Bulk'
      };

      // Create SMS record - use original contact number to maintain consistency with patient data
      const smsRecord = new SmsMessage({
        recipients: `${patient.patientfirstname} ${patient.patientlastname}`,
        recipientPhones: [patient.patientcontactnumber], // Use original contact number with "+" prefix
        senderClinic: clinicName,
        senderUserId: getValidSenderUserId(req.user?.id),
        senderUserName: req.user?.name || 'System Auto-Notification',
        type: 'Wishlist',
        message: message,
        status: smsResult.success ? 'Sent' : 'Failed',
        iprogMessageId: smsResult.messageId,
        smsProvider: 'iProg',
        errorMessage: smsResult.success ? null : smsResult.error,
        sentAt: smsResult.success ? new Date() : null
      });

      await smsRecord.save();

      res.status(200).json({
        success: smsResult.success,
        messageId: smsRecord.messageId,
        iprogMessageId: smsResult.messageId,
        message: smsResult.success 
          ? 'Wishlist notification sent successfully via iProg'
          : `Failed to send wishlist notification: ${smsResult.error}`
      });

    } catch (error) {
      console.error('Error processing wishlist notification:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Check SMS delivery status
  static async checkSmsStatus(req, res) {
    try {
      const { messageId } = req.params;

      if (!messageId) {
        return res.status(400).json({
          error: 'Message ID is required'
        });
      }

      console.log('🔍 Checking SMS status for message ID:', messageId);

      // Find SMS record in database
      const smsRecord = await SmsMessage.findOne({
        $or: [
          { messageId: messageId },
          { iprogMessageId: messageId }
        ]
      });

      if (!smsRecord) {
        return res.status(404).json({
          error: 'SMS message not found',
          messageId: messageId
        });
      }

      // Check status with iProg API if we have an iProg message ID
      let statusResult = null;
      if (smsRecord.iprogMessageId && smsRecord.smsProvider === 'iProg') {
        statusResult = await iprogClient.checkSmsStatus(smsRecord.iprogMessageId);
        
        // Update database record with latest status if check was successful
        if (statusResult.success) {
          const newStatus = statusResult.isDelivered ? 'Delivered' : 
                           statusResult.isFailed ? 'Failed' : 
                           statusResult.isPending ? 'Sent' : smsRecord.status;
          
          if (newStatus !== smsRecord.status) {
            smsRecord.status = newStatus;
            if (statusResult.isDelivered && !smsRecord.deliveredAt) {
              smsRecord.deliveredAt = new Date();
            }
            await smsRecord.save();
            console.log(`📱 Updated SMS status from ${smsRecord.status} to ${newStatus}`);
          }
        }
      }

      res.status(200).json({
        success: true,
        messageId: messageId,
        smsRecord: {
          messageId: smsRecord.messageId,
          iprogMessageId: smsRecord.iprogMessageId,
          recipients: smsRecord.recipients,
          status: smsRecord.status,
          sentAt: smsRecord.sentAt,
          deliveredAt: smsRecord.deliveredAt,
          smsProvider: smsRecord.smsProvider
        },
        iprogStatus: statusResult,
        lastChecked: new Date()
      });

    } catch (error) {
      console.error('Error checking SMS status:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Bulk check SMS status for multiple messages
  static async checkMultipleSmsStatus(req, res) {
    try {
      const { messageIds } = req.body;

      if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return res.status(400).json({
          error: 'Array of message IDs is required'
        });
      }

      console.log(`🔍 Checking SMS status for ${messageIds.length} messages`);

      const results = [];
      
      for (const messageId of messageIds) {
        try {
          // Find SMS record in database
          const smsRecord = await SmsMessage.findOne({
            $or: [
              { messageId: messageId },
              { iprogMessageId: messageId }
            ]
          });

          if (!smsRecord) {
            results.push({
              messageId: messageId,
              error: 'SMS message not found'
            });
            continue;
          }

          // Check status with iProg API if we have an iProg message ID
          let statusResult = null;
          if (smsRecord.iprogMessageId && smsRecord.smsProvider === 'iProg') {
            statusResult = await iprogClient.checkSmsStatus(smsRecord.iprogMessageId);
            
            // Update database record with latest status if check was successful
            if (statusResult.success) {
              const newStatus = statusResult.isDelivered ? 'Delivered' : 
                               statusResult.isFailed ? 'Failed' : 
                               statusResult.isPending ? 'Sent' : smsRecord.status;
              
              if (newStatus !== smsRecord.status) {
                smsRecord.status = newStatus;
                if (statusResult.isDelivered && !smsRecord.deliveredAt) {
                  smsRecord.deliveredAt = new Date();
                }
                await smsRecord.save();
              }
            }
          }

          results.push({
            messageId: messageId,
            smsRecord: {
              messageId: smsRecord.messageId,
              iprogMessageId: smsRecord.iprogMessageId,
              recipients: smsRecord.recipients,
              status: smsRecord.status,
              sentAt: smsRecord.sentAt,
              deliveredAt: smsRecord.deliveredAt,
              smsProvider: smsRecord.smsProvider
            },
            iprogStatus: statusResult
          });

        } catch (error) {
          results.push({
            messageId: messageId,
            error: error.message
          });
        }

        // Add small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      res.status(200).json({
        success: true,
        totalChecked: messageIds.length,
        results: results,
        lastChecked: new Date()
      });

    } catch (error) {
      console.error('Error checking multiple SMS status:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Check and update status for all pending SMS messages
  static async checkPendingSmsStatus(req, res) {
    try {
      console.log('🔍 Checking status for all pending SMS messages...');

      // Find all SMS messages that are marked as 'Sent' but might need status updates
      const pendingSmsMessages = await SmsMessage.find({
        status: { $in: ['Sent', 'Pending'] },
        smsProvider: 'iProg',
        iprogMessageId: { $exists: true, $ne: null },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours only
      }).sort({ createdAt: -1 }).limit(50); // Limit to 50 most recent

      if (pendingSmsMessages.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No pending SMS messages found',
          totalChecked: 0,
          results: []
        });
      }

      console.log(`📱 Found ${pendingSmsMessages.length} pending SMS messages to check`);

      const results = [];
      let updatedCount = 0;

      for (const smsRecord of pendingSmsMessages) {
        try {
          // Check status with iProg API
          const statusResult = await iprogClient.checkSmsStatus(smsRecord.iprogMessageId);
          
          if (statusResult.success) {
            const newStatus = statusResult.isDelivered ? 'Delivered' : 
                             statusResult.isFailed ? 'Failed' : 
                             statusResult.isPending ? 'Sent' : smsRecord.status;
            
            if (newStatus !== smsRecord.status) {
              const oldStatus = smsRecord.status;
              smsRecord.status = newStatus;
              if (statusResult.isDelivered && !smsRecord.deliveredAt) {
                smsRecord.deliveredAt = new Date();
              }
              await smsRecord.save();
              updatedCount++;
              
              console.log(`📱 Updated SMS ${smsRecord.messageId}: ${oldStatus} → ${newStatus}`);
            }

            results.push({
              messageId: smsRecord.messageId,
              iprogMessageId: smsRecord.iprogMessageId,
              recipients: smsRecord.recipients,
              oldStatus: smsRecord.status,
              newStatus: newStatus,
              updated: newStatus !== smsRecord.status,
              iprogStatus: statusResult.status
            });
          } else {
            results.push({
              messageId: smsRecord.messageId,
              iprogMessageId: smsRecord.iprogMessageId,
              error: statusResult.error
            });
          }

        } catch (error) {
          console.error(`Error checking status for ${smsRecord.messageId}:`, error);
          results.push({
            messageId: smsRecord.messageId,
            error: error.message
          });
        }

        // Add small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      res.status(200).json({
        success: true,
        message: `Checked ${pendingSmsMessages.length} SMS messages, updated ${updatedCount}`,
        totalChecked: pendingSmsMessages.length,
        totalUpdated: updatedCount,
        results: results,
        lastChecked: new Date()
      });

    } catch (error) {
      console.error('Error checking pending SMS status:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  // Test SMS with real phone number
  static async testRealPhoneNumber(req, res) {
    try {
      const { phoneNumber, message, testType } = req.body;
      
      console.log(`📱 Testing SMS with real phone number: ${phoneNumber}`);
      
      // Validate phone number format
      if (!phoneNumber || !message) {
        return res.status(400).json({
          success: false,
          error: 'Phone number and message are required'
        });
      }
      
      // Format phone number (ensure proper format)
      let formattedPhone = phoneNumber.toString().trim();
      
      // Convert to international format if needed
      if (formattedPhone.startsWith('09')) {
        formattedPhone = '63' + formattedPhone.substring(1);
      } else if (formattedPhone.startsWith('+63')) {
        formattedPhone = formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('63')) {
        formattedPhone = '63' + formattedPhone;
      }
      
      console.log(`📱 Formatted phone number: ${formattedPhone}`);
      
      // Create test message
      const testMessage = message || `Test SMS from Eye2Wear

Hello! This is a test message to verify SMS delivery.

Type: ${testType || 'Manual Test'}
Time: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
System: Eye2Wear SMS Test

Please reply "RECEIVED" if you get this message.

Thank you!`;

      // Send SMS using iProg
      const iprogClient = new iPragSMS();
      const result = await iprogClient.sendBulkSMS([{
        message: testMessage,
        phone_number: formattedPhone,
        sender_id: 'Eye2Wear'
      }]);

      if (result.success && result.message_ids && result.message_ids.length > 0) {
        const iprogMessageId = result.message_ids[0];
        
        // Save to database (messageId will be auto-generated by the model)
        const smsRecord = new SmsMessage({
          recipients: `Test User (${formattedPhone})`,
          recipientPhones: [formattedPhone],
          senderClinic: 'Ambher Optical',
          senderUserId: req.userId || new mongoose.Types.ObjectId(),
          senderUserName: 'System Test',
          type: 'Promotional',
          message: testMessage,
          status: 'Sent',
          smsProvider: 'iProg',
          iprogMessageId: iprogMessageId,
          sentAt: new Date(),
          promotionSubject: testType || 'Real Phone Test'
        });
        
        await smsRecord.save();
        const messageId = smsRecord.messageId;
        
        console.log(`✅ Test SMS sent successfully to ${formattedPhone}`);
        console.log(`📋 Message ID: ${messageId}, iProg ID: ${iprogMessageId}`);
        
        // Wait a moment then check status
        setTimeout(async () => {
          try {
            const statusResult = await iprogClient.checkSmsStatus(iprogMessageId);
            console.log(`📊 Initial status check for ${iprogMessageId}:`, statusResult);
            
            if (statusResult.success) {
              const newStatus = statusResult.isDelivered ? 'Delivered' : 
                               statusResult.isFailed ? 'Failed' : 
                               statusResult.isPending ? 'Sent' : smsRecord.status;
              
              if (newStatus !== smsRecord.status) {
                smsRecord.status = newStatus;
                if (statusResult.isDelivered && !smsRecord.deliveredAt) {
                  smsRecord.deliveredAt = new Date();
                }
                await smsRecord.save();
                console.log(`📱 Updated status to: ${newStatus}`);
              }
            }
          } catch (error) {
            console.error('Error checking initial status:', error);
          }
        }, 3000);
        
        res.status(200).json({
          success: true,
          message: 'Test SMS sent successfully',
          messageId: messageId,
          iprogMessageId: iprogMessageId,
          phoneNumber: formattedPhone,
          formattedMessage: testMessage,
          iprogResponse: result,
          instructions: [
            'Check your phone for the SMS message',
            'Reply "RECEIVED" if you get the message',
            `Use /api/sms/status/${messageId} to check delivery status`,
            'Wait 1-2 minutes then check status again for delivery confirmation'
          ]
        });
        
      } else {
        console.error('❌ iProg SMS failed:', result);
        res.status(500).json({
          success: false,
          error: 'Failed to send SMS via iProg',
          details: result.error || 'Unknown error',
          iprogResponse: result
        });
      }
      
    } catch (error) {
      console.error('❌ Error in test SMS:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error.message
      });
    }
  }
}

export default SmsController;
