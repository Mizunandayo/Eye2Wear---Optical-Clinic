import express from 'express';
import SmsController from '../controllers/smsmessage.controller.js';

const smsrouter = express.Router();

// POST /api/sms/promotional - Send promotional SMS to all patients
smsrouter.post('/promotional', SmsController.sendPromotionalSms);

// POST /api/sms/appointment-reminder - Send appointment reminder SMS
smsrouter.post('/appointment-reminder', SmsController.sendAppointmentReminder);

// POST /api/sms/order-status - Send order status update SMS
smsrouter.post('/order-status', SmsController.sendOrderStatusUpdate);

// POST /api/sms/wishlist - Send wishlist notification SMS
smsrouter.post('/wishlist', SmsController.sendWishlistNotification);

// GET /api/sms - Get all SMS messages with pagination and filtering
smsrouter.get('/', SmsController.getSmsMessages);

// GET /api/sms/stats - Get SMS statistics
smsrouter.get('/stats', SmsController.getSmsStats);

// GET /api/sms/test - Test SMS configuration
smsrouter.get('/test', SmsController.testSmsConfiguration);

// GET /api/sms/test-order-sms - Test order SMS functionality  
smsrouter.get('/test-order-sms', SmsController.testOrderSms);

// POST /api/sms/test-real-order - Test real order SMS functionality
smsrouter.post('/test-real-order', SmsController.testRealOrderSms);

// POST /api/sms/pickup-notification - Send pickup date notification SMS
smsrouter.post('/pickup-notification', SmsController.sendPickupNotification);

// GET /api/sms/diagnose-phone-issue - Diagnose phone number issues
smsrouter.get('/diagnose-phone-issue', SmsController.diagnosePhoneIssue);

// GET /api/sms/status/:messageId - Check SMS delivery status
smsrouter.get('/status/:messageId', SmsController.checkSmsStatus);

// POST /api/sms/status/bulk - Check multiple SMS delivery statuses
smsrouter.post('/status/bulk', SmsController.checkMultipleSmsStatus);

// GET /api/sms/status/pending - Check all pending SMS statuses
smsrouter.get('/status/pending', SmsController.checkPendingSmsStatus);

// POST /api/sms/test-real-phone - Test SMS with real phone number
smsrouter.post('/test-real-phone', SmsController.testRealPhoneNumber);

// POST /api/sms/verify-delivery - Verify SMS delivery status immediately after sending
smsrouter.post('/verify-delivery', SmsController.verifyDeliveryStatus);

// GET /api/sms/:id - Get SMS message by ID
smsrouter.get('/:id', SmsController.getSmsMessageById);

// PUT /api/sms/status - Update SMS status (Twilio webhook)
smsrouter.put('/status', SmsController.updateSmsStatus);

// DELETE /api/sms/:id - Delete SMS message
smsrouter.delete('/:id', SmsController.deleteSmsMessage);

export default smsrouter;
