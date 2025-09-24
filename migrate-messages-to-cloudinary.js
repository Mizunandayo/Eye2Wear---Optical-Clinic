/* eslint-disable no-undef */
import mongoose from 'mongoose';
import Message from './models/message.js';
import CloudinaryService from './utils/cloudinaryService.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGO_URI;

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

/**
 * Migrate message files from local storage to Cloudinary
 */
async function migrateMessagesToCloudinary() {
  try {
    log('🚀 Starting migration of message files to Cloudinary...', 'blue');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    log('✅ Connected to MongoDB', 'green');

    // Get all messages with local file paths
    const messagesWithFiles = await Message.find({
      $or: [
        { imageUrl: { $regex: '^/uploads/' } },
        { documentUrl: { $regex: '^/uploads/' } }
      ]
    });

    log(`📊 Found ${messagesWithFiles.length} messages with local files`, 'cyan');

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const message of messagesWithFiles) {
      log(`\n📤 Processing message ${message._id}...`, 'yellow');

      try {
        let updated = false;

        // Handle image migration
        if (message.imageUrl && message.imageUrl.startsWith('/uploads/')) {
          const localImagePath = path.join(process.cwd(), message.imageUrl);
          
          if (fs.existsSync(localImagePath)) {
            log(`  📸 Migrating image: ${message.imageUrl}`, 'cyan');
            
            const uploadResult = await CloudinaryService.uploadFromPath(localImagePath, {
              folder: 'eye2wear/messages/images',
              public_id: `migrated_message_image_${message._id}_${Date.now()}`,
              transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
              ]
            });

            message.imageUrl = uploadResult.url;
            message.imageUrl_public_id = uploadResult.public_id;
            updated = true;
            
            log(`    ✅ Image migrated successfully`, 'green');
          } else {
            log(`    ⚠️  Image file not found: ${localImagePath}`, 'yellow');
          }
        }

        // Handle document migration
        if (message.documentUrl && message.documentUrl.startsWith('/uploads/')) {
          const localDocPath = path.join(process.cwd(), message.documentUrl);
          
          if (fs.existsSync(localDocPath)) {
            log(`  📄 Migrating document: ${message.documentUrl}`, 'cyan');
            
            // Get file extension and mimetype
            const fileExtension = path.extname(localDocPath);
            const stats = fs.statSync(localDocPath);
            
            // Determine mimetype based on extension
            const mimetypes = {
              '.pdf': 'application/pdf',
              '.doc': 'application/msword',
              '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              '.xls': 'application/vnd.ms-excel',
              '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              '.txt': 'text/plain'
            };
            
            const mimetype = mimetypes[fileExtension.toLowerCase()] || 'application/octet-stream';
            
            const uploadResult = await CloudinaryService.uploadFromPath(localDocPath, {
              folder: 'eye2wear/messages/documents',
              public_id: `migrated_message_doc_${message._id}_${Date.now()}`,
              mimetype: mimetype,
              fileExtension: fileExtension,
              originalFilename: message.documentName || path.basename(localDocPath)
            });

            message.documentUrl = uploadResult.url;
            message.documentUrl_public_id = uploadResult.public_id;
            updated = true;
            
            log(`    ✅ Document migrated successfully`, 'green');
          } else {
            log(`    ⚠️  Document file not found: ${localDocPath}`, 'yellow');
          }
        }

        // Save the message if it was updated
        if (updated) {
          await message.save();
          successCount++;
          log(`  ✅ Message ${message._id} updated successfully`, 'green');
        } else {
          skippedCount++;
          log(`  ⏭️  Message ${message._id} skipped (no files found)`, 'yellow');
        }

      } catch (error) {
        errorCount++;
        log(`  ❌ Error processing message ${message._id}: ${error.message}`, 'red');
      }
    }

    log(`\n📊 Migration Summary:`, 'blue');
    log(`  ✅ Successfully migrated: ${successCount} messages`, 'green');
    log(`  ❌ Errors: ${errorCount} messages`, 'red');
    log(`  ⏭️  Skipped: ${skippedCount} messages`, 'yellow');
    log(`  📊 Total processed: ${messagesWithFiles.length} messages`, 'cyan');

    if (successCount > 0) {
      log(`\n🎉 Migration completed successfully!`, 'green');
      log(`💡 You can now safely remove the old /uploads/message-* directories after verifying all files work correctly.`, 'yellow');
    }

  } catch (error) {
    log(`❌ Migration failed: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('🔌 Disconnected from MongoDB', 'blue');
  }
}

/**
 * Validate migration - check if all messages have proper Cloudinary URLs
 */
async function validateMigration() {
  try {
    log('🔍 Validating migration...', 'blue');
    
    await mongoose.connect(mongoUri);
    log('✅ Connected to MongoDB', 'green');

    const messagesWithLocalFiles = await Message.find({
      $or: [
        { imageUrl: { $regex: '^/uploads/' } },
        { documentUrl: { $regex: '^/uploads/' } }
      ]
    });

    const messagesWithCloudinaryFiles = await Message.find({
      $or: [
        { imageUrl: { $regex: '^https://res.cloudinary.com' } },
        { documentUrl: { $regex: '^https://res.cloudinary.com' } }
      ]
    });

    log(`\n📊 Validation Results:`, 'blue');
    log(`  🏠 Messages with local files: ${messagesWithLocalFiles.length}`, messagesWithLocalFiles.length > 0 ? 'yellow' : 'green');
    log(`  ☁️  Messages with Cloudinary files: ${messagesWithCloudinaryFiles.length}`, 'cyan');

    if (messagesWithLocalFiles.length > 0) {
      log(`\n⚠️  The following messages still have local file paths:`, 'yellow');
      messagesWithLocalFiles.forEach(msg => {
        if (msg.imageUrl?.startsWith('/uploads/')) {
          log(`    📸 ${msg._id}: ${msg.imageUrl}`, 'yellow');
        }
        if (msg.documentUrl?.startsWith('/uploads/')) {
          log(`    📄 ${msg._id}: ${msg.documentUrl}`, 'yellow');
        }
      });
    } else {
      log(`\n🎉 All message files have been successfully migrated to Cloudinary!`, 'green');
    }

  } catch (error) {
    log(`❌ Validation failed: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('🔌 Disconnected from MongoDB', 'blue');
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'migrate':
    migrateMessagesToCloudinary();
    break;
  case 'validate':
    validateMigration();
    break;
  default:
    log('📋 Available commands:', 'blue');
    log('  npm run migrate-messages migrate   - Migrate message files to Cloudinary', 'cyan');
    log('  npm run migrate-messages validate  - Validate migration status', 'cyan');
    log('\n💡 Examples:', 'yellow');
    log('  node migrate-messages-to-cloudinary.js migrate', 'green');
    log('  node migrate-messages-to-cloudinary.js validate', 'green');
    break;
}