/* eslint-disable no-undef */
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import CloudinaryService from "../utils/cloudinaryService.js";


// Get all conversations for a user or clinic
export const getConversations = async (req, res) => {
  try {
    const { userId, role, clinic } = req.user;
    
    console.log('🔍 Getting conversations for:', { userId, role, clinic });
    
    let query = {};

    if (role === 'patient') {
      // FIXED: Patients should ONLY see conversations where they are specifically a participant
      // Convert userId to string for consistent comparison
      const userIdString = userId.toString();
      query = {
        'participants': {
          $elemMatch: { 
            userId: userIdString, 
            role: 'patient' 
          }
        }
      };
      
      console.log('👤 Patient query:', JSON.stringify(query, null, 2));
      
    } else if (role === 'staff' || role === 'owner') {
      // Staff/owners see conversations involving their clinic
      query = {
        $or: [
          // Conversations where they are direct participants
          { 'participants': { $elemMatch: { userId: userId, role: role } } },
          // Conversations involving their clinic (either as clinic participant or clinic field)
          { 'participants.clinic': clinic },
          { clinic: clinic },
          // Clinic-to-clinic conversations where they represent their clinic
          { 
            'participants': { 
              $elemMatch: { 
                role: 'clinic',
                clinic: clinic 
              } 
            } 
          }
        ]
      };
    }

    // Optimized query with field selection, lean(), and indexed sorting
    const conversations = await Conversation.find(query)
      .select('participants lastMessage clinic createdAt updatedAt isActive')
      .populate({
        path: 'lastMessage',
        select: 'text senderName senderId senderRole createdAt readBy'
      })
      .sort({ updatedAt: -1 })
      .lean(); // Returns plain JavaScript objects for better performance

    console.log(`✅ Found ${conversations.length} conversations for ${role} ${userId}`);
    
    // Log first conversation for debugging
    if (conversations.length > 0) {
      console.log('📝 Sample conversation participants:', conversations[0].participants);
    }
    
    res.status(200).json(conversations);
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ message: error.message });
  }
};


// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId, role, clinic } = req.user;

    console.log('🔍 Getting messages for:', { conversationId, userId, role, clinic });

    // Verify conversation exists and get it with lean for performance
    const conversation = await Conversation.findById(conversationId).lean();
    if (!conversation) {
      console.log('❌ Conversation not found:', conversationId);
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // FIXED: Strict access control for patients
    let hasAccess = false;
    
    if (role === 'patient') {
      // Patient can ONLY access if they are specifically a participant
      // Convert userId to string for consistent comparison
      const userIdString = userId.toString();
      hasAccess = conversation.participants.some(p => 
        p.userId === userIdString && p.role === 'patient'
      );
      console.log('👤 Patient access check:', { 
        userId: userIdString, 
        hasAccess, 
        participants: conversation.participants 
      });
      
    } else if (role === 'staff' || role === 'owner') {
      // Staff/owner can access if:
      // 1. They are a direct participant
      // 2. Their clinic is involved in the conversation
      // 3. The conversation clinic matches their clinic
      hasAccess = conversation.participants.some(p => 
        (p.userId === userId && (p.role === role || p.role === 'clinic')) || 
        (p.clinic === clinic && ['staff', 'owner', 'clinic'].includes(p.role))
      ) || conversation.clinic === clinic;
      
      console.log('🏥 Staff/Owner access check:', { 
        userId, 
        role,
        clinic,
        hasAccess, 
        participants: conversation.participants 
      });
    }

    if (!hasAccess) {
      console.log('🚫 Access denied for user:', userId);
      return res.status(403).json({ message: 'Unauthorized access to conversation' });
    }

    // Optimized query with CORRECT field selection, lean(), and indexed sorting
    const messages = await Message.find({ conversationId })
      .select('senderId senderName senderRole senderClinic sentToClinic text imageUrl documentUrl documentName readBy createdAt updatedAt')
      .sort({ createdAt: 1 })
      .lean(); // Returns plain JavaScript objects for better performance

    console.log(`📨 Found ${messages.length} messages in conversation ${conversationId}`);

    // Mark messages as read - optimized bulk operation with consistent userId
    const userIdString = userId.toString();
    const updateResult = await Message.updateMany(
      { 
        conversationId,
        'readBy.userId': { $ne: userIdString },
        senderId: { $ne: userIdString }
      },
      {
        $push: {
          readBy: {
            userId: userIdString,
            role: role,
            clinic: (role === 'staff' || role === 'owner' || role === 'clinic') ? clinic : null,
            readAt: new Date()
          }
        }
      }
    );

    console.log(`✅ Marked ${updateResult.modifiedCount} messages as read for user ${userIdString}`);
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
};

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter for both images and documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and documents are allowed.'), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});


// Create a new conversation
// Create a new conversation
// Create a new conversation
// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { clinic, participants } = req.body;
    const { userId, role, clinic: userClinic } = req.user;

    console.log('Creating conversation request:', { clinic, participants, userId, role, userClinic });

    // Validate required fields
    if (!participants || !Array.isArray(participants)) {
      return res.status(400).json({ message: 'Participants array is required' });
    }

    // For clinic-to-clinic, ensure both clinics are represented
    const isClinicToClinic = participants.some(p => p.role === 'clinic');
    const targetClinic = isClinicToClinic 
      ? participants.find(p => p.role === 'clinic' && p.clinic !== userClinic)?.clinic
      : null;

    // Build query to find existing conversation
    let query;
    if (role === 'patient') {
      // Patient looking for conversation with specific clinic
      // Search for ANY conversation between this patient and the target clinic
      query = {
        $and: [
          { 'participants': { $elemMatch: { userId: userId, role: 'patient' } } },
          { 
            $or: [
              // Direct clinic participant
              { 'participants': { $elemMatch: { role: 'clinic', clinic: clinic } } },
              // Staff/owner from that clinic
              { 'participants': { $elemMatch: { clinic: clinic, role: { $in: ['staff', 'owner'] } } } },
              // Conversation clinic field matches
              { clinic: clinic }
            ]
          }
        ]
      };
    } else if (isClinicToClinic) {
      // Clinic-to-clinic conversation
      query = {
        $and: [
          {
            $or: [
              { 'participants': { $elemMatch: { role: 'clinic', clinic: userClinic } } },
              { 'participants': { $elemMatch: { clinic: userClinic, role: { $in: ['staff', 'owner'] } } } }
            ]
          },
          {
            $or: [
              { 'participants': { $elemMatch: { role: 'clinic', clinic: targetClinic } } },
              { 'participants': { $elemMatch: { clinic: targetClinic, role: { $in: ['staff', 'owner'] } } } }
            ]
          }
        ]
      };
    } else {
      // Staff/owner messaging patient - ensure conversation is specific to their clinic
      const patient = participants.find(p => p.role === 'patient');
      if (!patient) {
        return res.status(400).json({ message: 'Patient participant required' });
      }
      
      query = {
        $and: [
          { 'participants': { $elemMatch: { userId: patient.userId, role: 'patient' } } },
          {
            $or: [
              // Direct user participant
              { 'participants': { $elemMatch: { userId: userId, role: role } } },
              // Clinic participant from same clinic
              { 'participants': { $elemMatch: { role: 'clinic', clinic: userClinic } } },
              // Staff/owner from same clinic
              { 'participants': { $elemMatch: { clinic: userClinic, role: { $in: ['staff', 'owner'] } } } },
              // Conversation clinic matches
              { clinic: userClinic }
            ]
          }
        ]
      };
    }

    console.log('Searching for existing conversation with query:', JSON.stringify(query, null, 2));

    // Check for existing conversation
    let conversation = await Conversation.findOne(query);
    console.log('Found existing conversation:', conversation);

    if (!conversation) {
      // Clean participants for new conversation
      const cleanedParticipants = participants.map(p => {
        if (p.role === 'clinic') {
          return { role: 'clinic', clinic: p.clinic };
        } else if (p.role === 'patient') {
          return { userId: p.userId, role: 'patient', clinic: null };
        } else {
          return { userId: p.userId, role: p.role, clinic: userClinic };
        }
      });

      conversation = new Conversation({
        participants: cleanedParticipants,
        clinic: isClinicToClinic ? userClinic : (clinic || userClinic)
      });
      await conversation.save();
      console.log('Created new conversation:', conversation);
    } else {
      console.log('Using existing conversation:', conversation._id);
    }

    res.status(conversation ? 200 : 201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: error.message });
  }
};
// Create a new message
export const createMessage = async (req, res) => {
  try {
    console.log('📤 CREATE MESSAGE REQUEST:', {
      body: req.body,
      user: req.user,
      file: req.file ? { filename: req.file.filename, mimetype: req.file.mimetype } : null
    });
    
    const { conversationId, text, patientId, targetClinic, senderName, temporaryId } = req.body;
    const { userId, role, clinic, name } = req.user;

    let imageUrl = null;
    let imageUrl_public_id = null;
    let documentUrl = null;
    let documentUrl_public_id = null;

    // Handle file upload to Cloudinary
    if (req.file) {
      try {
        const isImage = req.file.mimetype.startsWith('image/');
        const folderPath = isImage ? 'eye2wear/messages/images' : 'eye2wear/messages/documents';
        
        // Generate unique public_id
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileExtension = path.extname(req.file.originalname);
        const public_id = `message_${userId}_${timestamp}_${random}`;

        console.log('📤 Uploading file to Cloudinary:', {
          isImage,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname,
          size: req.file.size,
          public_id
        });

        // Upload to Cloudinary
        const uploadResult = await CloudinaryService.uploadFile(req.file.buffer, {
          folder: folderPath,
          public_id: public_id,
          mimetype: req.file.mimetype,
          originalFilename: req.file.originalname,
          fileExtension: fileExtension
        });

        console.log('✅ File uploaded to Cloudinary:', uploadResult);

        if (isImage) {
          imageUrl = uploadResult.url;
          imageUrl_public_id = uploadResult.public_id;
        } else {
          documentUrl = uploadResult.url;
          documentUrl_public_id = uploadResult.public_id;
        }
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        return res.status(500).json({ 
          message: 'File upload failed', 
          error: uploadError.message 
        });
      }
    }

    // Determine message type
    const isPatientMessagingClinic = role === 'patient' && !patientId && !targetClinic;
    const isStaffMessagingPatient = (role === 'staff' || role === 'owner') && patientId;
    const isClinicMessagingClinic = (role === 'staff' || role === 'owner') && targetClinic;

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      // Validate that the conversation matches the clinic
      if (role === 'staff' || role === 'owner') {
        const hasClinicParticipant = conversation.participants.some(p => p.clinic === clinic);
        if (!hasClinicParticipant) {
          return res.status(403).json({ message: 'Conversation does not belong to your clinic' });
        }
      }
    } else {
      // Create new conversation
      const participants = [{
        userId: userId,
        role: role,
        clinic: role === 'staff' || role === 'owner' ? clinic : null
      }];

      if (isPatientMessagingClinic) {
        participants.push({
          role: 'clinic',
          clinic: req.body.clinic
        });
      } else if (isStaffMessagingPatient) {
        participants.push({
          userId: patientId,
          role: 'patient',
          clinic: null
        });
      } else if (isClinicMessagingClinic) {
        participants[0] = { role: 'clinic', clinic: clinic };
        participants.push({ role: 'clinic', clinic: targetClinic });
      }

      // Check for existing conversation to avoid duplicates
      let existingConversation;
      if (isStaffMessagingPatient) {
        existingConversation = await Conversation.findOne({
          clinic: clinic,
          participants: {
            $all: [
              { $elemMatch: { userId: patientId, role: 'patient' } },
              { $elemMatch: { role: { $in: ['staff', 'owner', 'clinic'] }, clinic } }
            ]
          }
        });
      } else if (isPatientMessagingClinic) {
        existingConversation = await Conversation.findOne({
          clinic: req.body.clinic,
          participants: {
            $all: [
              { $elemMatch: { userId: userId, role: 'patient' } },
              { $elemMatch: { role: 'clinic', clinic: req.body.clinic } }
            ]
          }
        });
      } else if (isClinicMessagingClinic) {
        existingConversation = await Conversation.findOne({
          participants: {
            $all: [
              { $elemMatch: { role: 'clinic', clinic } },
              { $elemMatch: { role: 'clinic', clinic: targetClinic } }
            ]
          }
        });
      }

      if (existingConversation) {
        conversation = existingConversation;
      } else {
        conversation = new Conversation({
          participants,
          clinic: isClinicMessagingClinic ? clinic : req.body.clinic || targetClinic
        });
        await conversation.save();
      }
    }

    // Use the senderName from the request body, or fallback to user name
    const finalSenderName = senderName || (isClinicMessagingClinic ? clinic : name || 'Unknown');
    
    console.log('Message sender details:', {
      senderName,
      finalSenderName,
      role,
      userId,
      name,
      isClinicMessagingClinic
    });

    // Create the message
    const message = new Message({
      conversationId: conversation._id,
      senderId: userId,
      senderRole: isClinicMessagingClinic ? 'clinic' : role,
      senderName: finalSenderName,
      senderClinic: isClinicMessagingClinic ? clinic : (role === 'patient' ? null : clinic),
      sentToClinic: isPatientMessagingClinic ? req.body.clinic : (isClinicMessagingClinic ? targetClinic : null),
      text,
      imageUrl,
      imageUrl_public_id,
      documentUrl,
      documentUrl_public_id,
      documentName: req.file?.originalname,
      temporaryId
    });

    await message.save();

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Emit the message via Socket.IO
    const io = req.app.get('io');
    io.to(conversation._id.toString()).emit('newMessage', message);

    console.log('✅ MESSAGE CREATED SUCCESSFULLY:', {
      messageId: message._id,
      conversationId: conversation._id,
      senderName: finalSenderName,
      text: text?.substring(0, 50) + (text?.length > 50 ? '...' : ''),
      hasFile: !!req.file
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('❌ ERROR CREATING MESSAGE:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      user: req.user
    });
    res.status(500).json({ 
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Helper function to check for orphaned image references
export const checkOrphanedImages = async (req, res) => {
  try {
    // Get all messages with images
    const messagesWithImages = await Message.find({ 
      imageUrl: { $exists: true, $ne: null } 
    });
    
    const orphanedImages = [];
    const validImages = [];
    
    for (const message of messagesWithImages) {
      if (message.imageUrl) {
        // Extract filename from URL like "/uploads/message-images/filename.jpg"
        const filename = message.imageUrl.split('/').pop();
        const imagePath = path.join(process.cwd(), 'uploads', 'message-images', filename);
        
        try {
          // Check if file exists
          fs.accessSync(imagePath, fs.constants.F_OK);
          validImages.push({
            messageId: message._id,
            imageUrl: message.imageUrl,
            filename: filename
          });
        } catch {
          orphanedImages.push({
            messageId: message._id,
            imageUrl: message.imageUrl,
            filename: filename,
            conversationId: message.conversationId
          });
        }
      }
    }
    
    res.status(200).json({
      message: 'Image check completed',
      summary: {
        totalMessagesWithImages: messagesWithImages.length,
        validImages: validImages.length,
        orphanedImages: orphanedImages.length
      },
      orphanedImages,
      validImages: req.query.showValid === 'true' ? validImages : []
    });
    
  } catch (error) {
    console.error('Error checking orphaned images:', error);
    res.status(500).json({ 
      message: 'Error checking images',
      error: error.message
    });
  }
};

// Function to clean up orphaned image references
export const cleanupOrphanedImageReferences = async (req, res) => {
  try {
    // Get all messages with images
    const messagesWithImages = await Message.find({ 
      imageUrl: { $exists: true, $ne: null } 
    });
    
    const orphanedMessages = [];
    let cleanedCount = 0;
    
    for (const message of messagesWithImages) {
      if (message.imageUrl) {
        const filename = message.imageUrl.split('/').pop();
        const imagePath = path.join(process.cwd(), 'uploads', 'message-images', filename);
        
        try {
          fs.accessSync(imagePath, fs.constants.F_OK);
        } catch {
          // File doesn't exist, remove imageUrl from message
          orphanedMessages.push({
            messageId: message._id,
            originalImageUrl: message.imageUrl
          });
          
          // Update message to remove imageUrl
          await Message.findByIdAndUpdate(message._id, {
            $unset: { imageUrl: 1 }
          });
          
          cleanedCount++;
        }
      }
    }
    
    res.status(200).json({
      message: 'Cleanup completed',
      cleanedCount,
      orphanedMessages
    });
    
  } catch (error) {
    console.error('Error cleaning up orphaned images:', error);
    res.status(500).json({ 
      message: 'Error during cleanup',
      error: error.message
    });
  }
};

// Mark messages in a conversation as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId, role, clinic } = req.user;
    
    console.log('🔴 Marking messages as read:', { conversationId, userId, role, clinic });
    
    if (!conversationId) {
      return res.status(400).json({ message: 'Conversation ID is required' });
    }

    // Mark messages as read - optimized bulk operation with consistent userId
    const userIdString = userId.toString();
    const updateResult = await Message.updateMany(
      { 
        conversationId,
        'readBy.userId': { $ne: userIdString },
        senderId: { $ne: userIdString }
      },
      {
        $push: {
          readBy: {
            userId: userIdString,
            role: role,
            clinic: (role === 'staff' || role === 'owner' || role === 'clinic') ? clinic : null,
            readAt: new Date()
          }
        }
      }
    );

    console.log(`✅ Marked ${updateResult.modifiedCount} messages as read for user ${userIdString}`);
    
    // Update the conversation's lastMessage if it was marked as read
    if (updateResult.modifiedCount > 0) {
      const conversation = await Conversation.findById(conversationId).populate('lastMessage');
      if (conversation && conversation.lastMessage) {
        // Check if the lastMessage was one of the messages we just marked as read
        const lastMessageUpdated = await Message.findById(conversation.lastMessage._id);
        if (lastMessageUpdated && lastMessageUpdated.readBy.some(read => read.userId === userIdString)) {
          console.log('🔄 Updating conversation lastMessage with new readBy status');
          // Re-populate the lastMessage to get the updated readBy data
          await conversation.populate('lastMessage');
          await conversation.save();
        }
      }
    }
    
    res.status(200).json({ 
      message: 'Messages marked as read successfully',
      markedCount: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: error.message });
  }
};

// Download message file with secure Cloudinary access
export const downloadMessageFile = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId, role, clinic } = req.user;

    console.log('📥 Download request:', { messageId, userId, role, clinic });

    // Get the message and verify access
    const message = await Message.findById(messageId).lean();
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Get the conversation and verify access
    const conversation = await Conversation.findById(message.conversationId).lean();
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Verify user has access to this conversation
    let hasAccess = false;
    if (role === 'patient') {
      hasAccess = conversation.participants.some(p => 
        p.userId === userId.toString() && p.role === 'patient'
      );
    } else if (role === 'staff' || role === 'owner') {
      hasAccess = conversation.participants.some(p => 
        (p.clinic === clinic && (p.role === 'staff' || p.role === 'owner' || p.role === 'clinic')) ||
        (p.role === 'clinic' && p.clinic === clinic)
      );
    }

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied to this message' });
    }

    // Determine which file to download
    let filePublicId = null;
    let fileName = null;
    let isDocument = false;

    if (message.documentUrl && message.documentUrl_public_id) {
      filePublicId = message.documentUrl_public_id;
      fileName = message.documentName || 'document';
      isDocument = true;
    } else if (message.imageUrl && message.imageUrl_public_id) {
      filePublicId = message.imageUrl_public_id;
      fileName = 'image.jpg';
      isDocument = false;
    } else {
      return res.status(404).json({ message: 'No file found in this message' });
    }

    console.log('📂 Downloading file:', { filePublicId, fileName, isDocument });

    // For documents, generate signed URL and redirect
    if (isDocument) {
      try {
        const signedUrl = CloudinaryService.generateSignedUrl(filePublicId, {
          resource_type: 'raw',
          type: 'upload',
          attachment: true,
          expires_at: Math.floor(Date.now() / 1000) + 300 // 5 minutes
        });

        console.log('✅ Generated signed URL for document download');
        return res.redirect(signedUrl);
      } catch (error) {
        console.error('❌ Error generating signed URL:', error);
        // Fallback to direct URL
        return res.redirect(message.documentUrl);
      }
    } else {
      // For images, redirect directly (they're usually publicly accessible)
      return res.redirect(message.imageUrl);
    }

  } catch (error) {
    console.error('❌ Error downloading message file:', error);
    res.status(500).json({ 
      message: 'Download failed', 
      error: error.message 
    });
  }
};