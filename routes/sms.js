import express from 'express';
import SmsController from '../controllers/smsmessage.controller.js';

const router = express.Router();

// POST /api/sms/promotional - Send promotional SMS to all patients
router.post('/promotional', SmsController.sendPromotionalSms);

// POST /api/sms/appointment-reminder - Send appointment reminder SMS
router.post('/appointment-reminder', SmsController.sendAppointmentReminder);

// POST /api/sms/order-status - Send order status update SMS
router.post('/order-status', SmsController.sendOrderStatusUpdate);

// POST /api/sms/wishlist - Send wishlist notification SMS
router.post('/wishlist', SmsController.sendWishlistNotification);

// GET /api/sms - Get all SMS messages with pagination and filtering
router.get('/', SmsController.getSmsMessages);

// GET /api/sms/stats - Get SMS statistics
router.get('/stats', SmsController.getSmsStats);

// GET /api/sms/:id - Get SMS message by ID
router.get('/:id', SmsController.getSmsMessageById);

// PUT /api/sms/status - Update SMS status (Twilio webhook)
router.put('/status', SmsController.updateSmsStatus);

// DELETE /api/sms/:id - Delete SMS message
router.delete('/:id', SmsController.deleteSmsMessage);

export default router;
