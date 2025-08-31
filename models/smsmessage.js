import mongoose from 'mongoose';

const smsMessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    unique: true
  },
  recipients: {
    type: String,
    required: true
  },
  recipientPhones: [{
    type: String,
    required: true
  }],
  senderClinic: {
    type: String,
    required: true,
    enum: ['Ambher Optical', 'Bautista Eye Center']
  },
  senderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderUserName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Appointment', 'Order Status', 'Promotional', 'Wishlist']
  },
  message: {
    type: String,
    required: true,
    maxLength: 1600 // SMS character limit
  },
  promotionSubject: {
    type: String,
    required: function() {
      return this.type === 'Promotional';
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Sent', 'Delivered', 'Failed'],
    default: 'Pending'
  },
  twilioMessageSid: {
    type: String
  },
  errorMessage: {
    type: String
  },
  sentAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
smsMessageSchema.index({ senderClinic: 1 });
smsMessageSchema.index({ type: 1 });
smsMessageSchema.index({ status: 1 });
smsMessageSchema.index({ createdAt: -1 });

// Auto-increment message ID
import AutoIncrement from 'mongoose-sequence';
const AutoIncrementFactory = AutoIncrement(mongoose);

smsMessageSchema.plugin(AutoIncrementFactory, {
  inc_field: 'messageIdNumber',
  start_seq: 1000
});

// Pre-save middleware to generate message ID
smsMessageSchema.pre('save', async function(next) {
  // Generate temporary messageId for new documents
  if (this.isNew && !this.messageId) {
    // Generate a temporary ID that will be replaced after auto-increment
    this.messageId = `SMS_TEMP_${Date.now()}`;
  }
  
  // Update messageId if we have the auto-increment number
  if (this.messageIdNumber && (this.messageId.startsWith('SMS_TEMP_') || !this.messageId.startsWith('SMS'))) {
    this.messageId = `SMS${this.messageIdNumber.toString().padStart(6, '0')}`;
  }
  
  this.updatedAt = new Date();
  next();
});

// Post-save middleware to fix messageId after auto-increment
smsMessageSchema.post('save', async function(doc) {
  // Only run for new documents with temporary messageId
  if (doc.messageId && doc.messageId.startsWith('SMS_TEMP_') && doc.messageIdNumber) {
    const properMessageId = `SMS${doc.messageIdNumber.toString().padStart(6, '0')}`;
    await this.constructor.updateOne(
      { _id: doc._id }, 
      { messageId: properMessageId },
      { runValidators: false }
    );
    // Update the document instance
    doc.messageId = properMessageId;
  }
});

const SmsMessage = mongoose.model('SmsMessage', smsMessageSchema);

export default SmsMessage;
