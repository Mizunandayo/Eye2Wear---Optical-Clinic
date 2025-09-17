/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import CloudinaryService from './utils/cloudinaryService.js';

// Import all models that have images
import Patientdemographic from './models/patientdemographic.js';
import Staffaccount from './models/staffacount.js';
import Owneraccount from './models/owneraccount.js';
import Patientaccount from './models/patientaccount.js';
import AmbherInventoryProduct from './models/ambherinventoryproduct.js';
import BautistaInventoryProduct from './models/bautistainventoryproduct.js';
import PatientWishlist from './models/patientwishlist.js';
import PatientOrderAmbher from './models/patientorderambher.js';
import PatientOrderBautista from './models/patientorderbautista.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migration script to move existing local images to Cloudinary
 */
class CloudinaryMigration {
  constructor() {
    this.migrationLog = [];
    this.uploadsPath = path.join(__dirname, 'uploads');
    this.publicPath = path.join(__dirname, 'public');
  }

  /**
   * Log migration progress
   */
  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logEntry);
    this.migrationLog.push(logEntry);
  }

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    try {
      return fs.existsSync(filePath);
    } catch {
      return false;
    }
  }

  /**
   * Extract filename from URL or path
   */
  extractFilename(urlOrPath) {
    if (!urlOrPath || urlOrPath === 'default-profile-url') return null;
    
    // Remove base URL if present
    const cleanPath = urlOrPath.replace(/^https?:\/\/[^/]+/, '');
    // Get filename from path
    return path.basename(cleanPath);
  }

  /**
   * Find local file path for image
   */
  findLocalImagePath(imagePath) {
    if (!imagePath || imagePath === 'default-profile-url') return null;

    const filename = this.extractFilename(imagePath);
    if (!filename) return null;

    // Common paths where images might be stored
    const possiblePaths = [
      path.join(this.uploadsPath, filename),
      path.join(this.uploadsPath, 'profile-pictures', filename),
      path.join(this.uploadsPath, 'product-images', filename),
      path.join(this.uploadsPath, 'receipts', filename),
      path.join(this.uploadsPath, 'message-images', filename),
      path.join(this.publicPath, 'images', filename),
      path.join(__dirname, 'src', 'assets', 'images', filename),
    ];

    for (const possiblePath of possiblePaths) {
      if (this.fileExists(possiblePath)) {
        return possiblePath;
      }
    }

    return null;
  }

  /**
   * Migrate single image
   */
  async migrateSingleImage(localPath, folder, public_id) {
    try {
      if (!this.fileExists(localPath)) {
        throw new Error(`Local file not found: ${localPath}`);
      }

      const result = await CloudinaryService.uploadFromPath(localPath, {
        folder: folder,
        public_id: public_id,
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });

      this.log(`Successfully uploaded: ${localPath} -> ${result.url}`);
      return result;
    } catch (error) {
      this.log(`Failed to upload ${localPath}: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Migrate Patient Demographics
   */
  async migratePatientDemographics() {
    this.log('Starting Patient Demographics migration...');
    
    const patients = await Patientdemographic.find({
      patientprofilepicture: { $exists: true, $nin: [null, '', 'default-profile-url'] }
    });

    this.log(`Found ${patients.length} patient demographics with profile pictures`);

    for (const patient of patients) {
      try {
        if (patient.patientprofilepicture === 'default-profile-url') continue;

        const localPath = this.findLocalImagePath(patient.patientprofilepicture);
        if (!localPath) {
          this.log(`Local file not found for patient ${patient._id}: ${patient.patientprofilepicture}`, 'warning');
          continue;
        }

        const public_id = `patient_${patient._id}_${Date.now()}`;
        const result = await this.migrateSingleImage(
          localPath,
          'eye2wear/profiles/patient',
          public_id
        );

        // Update database
        await Patientdemographic.findByIdAndUpdate(patient._id, {
          patientprofilepicture: result.url,
          patientprofilepicture_public_id: result.public_id
        });

        this.log(`Updated patient ${patient._id} with new Cloudinary URL`);
      } catch (error) {
        this.log(`Error migrating patient ${patient._id}: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Migrate Staff Accounts
   */
  async migrateStaffAccounts() {
    this.log('Starting Staff Accounts migration...');
    
    const staff = await Staffaccount.find({
      staffprofilepicture: { $exists: true, $nin: [null, '', 'default-profile-url'] }
    });

    this.log(`Found ${staff.length} staff accounts with profile pictures`);

    for (const staffMember of staff) {
      try {
        if (staffMember.staffprofilepicture === 'default-profile-url') continue;

        const localPath = this.findLocalImagePath(staffMember.staffprofilepicture);
        if (!localPath) {
          this.log(`Local file not found for staff ${staffMember._id}: ${staffMember.staffprofilepicture}`, 'warning');
          continue;
        }

        const public_id = `staff_${staffMember._id}_${Date.now()}`;
        const result = await this.migrateSingleImage(
          localPath,
          'eye2wear/profiles/staff',
          public_id
        );

        // Update database
        await Staffaccount.findByIdAndUpdate(staffMember._id, {
          staffprofilepicture: result.url,
          staffprofilepicture_public_id: result.public_id
        });

        this.log(`Updated staff ${staffMember._id} with new Cloudinary URL`);
      } catch (error) {
        this.log(`Error migrating staff ${staffMember._id}: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Migrate Owner Accounts
   */
  async migrateOwnerAccounts() {
    this.log('Starting Owner Accounts migration...');
    
    const owners = await Owneraccount.find({
      ownerprofilepicture: { $exists: true, $nin: [null, '', 'default-profile-url'] }
    });

    this.log(`Found ${owners.length} owner accounts with profile pictures`);

    for (const owner of owners) {
      try {
        if (owner.ownerprofilepicture === 'default-profile-url') continue;

        const localPath = this.findLocalImagePath(owner.ownerprofilepicture);
        if (!localPath) {
          this.log(`Local file not found for owner ${owner._id}: ${owner.ownerprofilepicture}`, 'warning');
          continue;
        }

        const public_id = `owner_${owner._id}_${Date.now()}`;
        const result = await this.migrateSingleImage(
          localPath,
          'eye2wear/profiles/owner',
          public_id
        );

        // Update database
        await Owneraccount.findByIdAndUpdate(owner._id, {
          ownerprofilepicture: result.url,
          ownerprofilepicture_public_id: result.public_id
        });

        this.log(`Updated owner ${owner._id} with new Cloudinary URL`);
      } catch (error) {
        this.log(`Error migrating owner ${owner._id}: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Migrate Product Images
   */
  async migrateProductImages() {
    this.log('Starting Product Images migration...');
    
    // Migrate Ambher products
    const ambherProducts = await AmbherInventoryProduct.find({
      ambherinventoryproductimagepreviewimages: { $exists: true, $ne: [] }
    });

    this.log(`Found ${ambherProducts.length} Ambher products with images`);

    for (const product of ambherProducts) {
      try {
        const newUrls = [];
        const newPublicIds = [];

        for (const imagePath of product.ambherinventoryproductimagepreviewimages) {
          const localPath = this.findLocalImagePath(imagePath);
          if (!localPath) {
            this.log(`Local file not found for Ambher product ${product._id}: ${imagePath}`, 'warning');
            continue;
          }

          const public_id = `ambher_product_${product._id}_${Date.now()}_${Math.random()}`;
          const result = await this.migrateSingleImage(
            localPath,
            'eye2wear/products/ambher',
            public_id
          );

          newUrls.push(result.url);
          newPublicIds.push(result.public_id);
        }

        if (newUrls.length > 0) {
          await AmbherInventoryProduct.findByIdAndUpdate(product._id, {
            ambherinventoryproductimagepreviewimages: newUrls,
            ambherinventoryproductimagepreviewimages_public_ids: newPublicIds
          });

          this.log(`Updated Ambher product ${product._id} with ${newUrls.length} new Cloudinary URLs`);
        }
      } catch (error) {
        this.log(`Error migrating Ambher product ${product._id}: ${error.message}`, 'error');
      }
    }

    // Migrate Bautista products
    const bautistaProducts = await BautistaInventoryProduct.find({
      bautistainventoryproductimagepreviewimages: { $exists: true, $ne: [] }
    });

    this.log(`Found ${bautistaProducts.length} Bautista products with images`);

    for (const product of bautistaProducts) {
      try {
        const newUrls = [];
        const newPublicIds = [];

        for (const imagePath of product.bautistainventoryproductimagepreviewimages) {
          const localPath = this.findLocalImagePath(imagePath);
          if (!localPath) {
            this.log(`Local file not found for Bautista product ${product._id}: ${imagePath}`, 'warning');
            continue;
          }

          const public_id = `bautista_product_${product._id}_${Date.now()}_${Math.random()}`;
          const result = await this.migrateSingleImage(
            localPath,
            'eye2wear/products/bautista',
            public_id
          );

          newUrls.push(result.url);
          newPublicIds.push(result.public_id);
        }

        if (newUrls.length > 0) {
          await BautistaInventoryProduct.findByIdAndUpdate(product._id, {
            bautistainventoryproductimagepreviewimages: newUrls,
            bautistainventoryproductimagepreviewimages_public_ids: newPublicIds
          });

          this.log(`Updated Bautista product ${product._id} with ${newUrls.length} new Cloudinary URLs`);
        }
      } catch (error) {
        this.log(`Error migrating Bautista product ${product._id}: ${error.message}`, 'error');
      }
    }
  }

  /**
   * Save migration log to file
   */
  async saveMigrationLog() {
    const logFilename = `migration_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const logPath = path.join(__dirname, logFilename);
    
    try {
      await fs.promises.writeFile(logPath, this.migrationLog.join('\n'));
      this.log(`Migration log saved to: ${logPath}`);
    } catch (error) {
      this.log(`Failed to save migration log: ${error.message}`, 'error');
    }
  }

  /**
   * Run complete migration
   */
  async runMigration() {
    try {
      this.log('=== Starting Cloudinary Migration ===');
      
      // Test Cloudinary connection
      const connectionTest = await CloudinaryService.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Cloudinary connection failed: ${connectionTest.message}`);
      }
      this.log('Cloudinary connection successful');

      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI);
      this.log('MongoDB connection successful');

      // Run migrations
      await this.migratePatientDemographics();
      await this.migrateStaffAccounts();
      await this.migrateOwnerAccounts();
      await this.migrateProductImages();

      this.log('=== Migration completed successfully ===');
    } catch (error) {
      this.log(`Migration failed: ${error.message}`, 'error');
      throw error;
    } finally {
      await this.saveMigrationLog();
      await mongoose.disconnect();
      this.log('MongoDB connection closed');
    }
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new CloudinaryMigration();
  migration.runMigration()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default CloudinaryMigration;