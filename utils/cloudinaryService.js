/* eslint-disable no-undef */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary Service for handling image uploads, deletions, and transformations
 */
class CloudinaryService {
  
  /**
   * Configure multer storage for different image types
   */
  static getMulterStorage(folder = 'eye2wear') {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
    });
  }

  /**
   * Create multer upload middleware for different types
   */
  static createUploadMiddleware(folder = 'eye2wear', multiple = false) {
    const storage = this.getMulterStorage(folder);
    const upload = multer({ 
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      }
    });

    return multiple ? upload.array('images', 10) : upload.single('image');
  }

  /**
   * Upload a single image from buffer
   */
  static async uploadImage(buffer, options = {}) {
    try {
      const {
        folder = 'eye2wear',
        public_id,
        transformation = [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      } = options;

      const uploadOptions = {
        folder: folder,
        transformation: transformation,
        resource_type: 'image',
      };

      if (public_id) {
        uploadOptions.public_id = public_id;
      }

      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${buffer.toString('base64')}`,
        uploadOptions
      );

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }

  /**
   * Upload a file (image or document) from buffer
   */
  static async uploadFile(buffer, options = {}) {
    try {
      const {
        folder = 'eye2wear',
        public_id,
        mimetype,
        originalFilename,
        fileExtension,
        transformation = []
      } = options;

      // Determine resource type and format based on mimetype
      let resource_type = 'auto';
      let upload_preset = {};
      let format = null;

      if (mimetype && mimetype.startsWith('image/')) {
        resource_type = 'image';
        upload_preset.transformation = transformation.length > 0 ? transformation : [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ];
      } else {
        // For documents, keep original format
        resource_type = 'raw';
        
        // Extract format from mimetype or file extension
        if (mimetype === 'application/pdf' || fileExtension === 'pdf') {
          format = 'pdf';
        } else if (mimetype.includes('word') || ['doc', 'docx'].includes(fileExtension)) {
          format = fileExtension || 'doc';
        } else if (mimetype === 'text/plain' || fileExtension === 'txt') {
          format = 'txt';
        } else if (mimetype.includes('excel') || mimetype.includes('spreadsheet') || ['xls', 'xlsx'].includes(fileExtension)) {
          format = fileExtension || 'xlsx';
        } else if (fileExtension) {
          format = fileExtension;
        }
      }

      const uploadOptions = {
        folder: folder,
        resource_type: resource_type,
        ...upload_preset
      };

      // Include file extension in public_id for raw uploads to preserve format
      if (public_id) {
        if (resource_type === 'raw' && format && !public_id.includes('.')) {
          uploadOptions.public_id = `${public_id}.${format}`;
        } else {
          uploadOptions.public_id = public_id;
        }
      }

      // Add format to preserve file extension for raw uploads
      if (format && resource_type === 'raw') {
        uploadOptions.format = format;
      }

      // Create data URL based on mimetype
      const dataUrl = mimetype 
        ? `data:${mimetype};base64,${buffer.toString('base64')}`
        : `data:application/octet-stream;base64,${buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(dataUrl, uploadOptions);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width || null,
        height: result.height || null,
        format: result.format,
        resource_type: result.resource_type
      };
    } catch (error) {
      console.error('Cloudinary file upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload multiple images from buffers
   */
  static async uploadMultipleImages(buffers, options = {}) {
    try {
      const uploadPromises = buffers.map(buffer => 
        this.uploadImage(buffer, options)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);
      throw new Error(`Failed to upload images: ${error.message}`);
    }
  }

  /**
   * Delete an image by public_id
   */
  static async deleteImage(public_id) {
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Delete multiple images by public_ids
   */
  static async deleteMultipleImages(public_ids) {
    try {
      const deletePromises = public_ids.map(public_id => 
        this.deleteImage(public_id)
      );
      return await Promise.all(deletePromises);
    } catch (error) {
      console.error('Cloudinary multiple delete error:', error);
      throw new Error(`Failed to delete images: ${error.message}`);
    }
  }

  /**
   * Transform an existing image
   */
  static getTransformedUrl(public_id, transformations = {}) {
    try {
      return cloudinary.url(public_id, {
        ...transformations,
        secure: true
      });
    } catch (error) {
      console.error('Cloudinary transform error:', error);
      throw new Error(`Failed to transform image: ${error.message}`);
    }
  }

  /**
   * Get optimized image URL for different use cases
   */
  static getOptimizedUrl(public_id, type = 'default') {
    const transformations = {
      thumbnail: { width: 150, height: 150, crop: 'fill' },
      profile: { width: 300, height: 300, crop: 'fill', gravity: 'face' },
      product: { width: 500, height: 500, crop: 'fit' },
      gallery: { width: 800, height: 600, crop: 'fit' },
      default: { quality: 'auto', fetch_format: 'auto' }
    };

    return this.getTransformedUrl(public_id, transformations[type] || transformations.default);
  }

  /**
   * Extract public_id from Cloudinary URL
   */
  static extractPublicId(url) {
    try {
      const regex = /\/upload\/(?:v\d+\/)?(.+)\./;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  }

  /**
   * Get image info by public_id
   */
  static async getImageInfo(public_id) {
    try {
      const result = await cloudinary.api.resource(public_id);
      return result;
    } catch (error) {
      console.error('Cloudinary get info error:', error);
      throw new Error(`Failed to get image info: ${error.message}`);
    }
  }

  /**
   * Upload image from file path (for migration purposes)
   */
  static async uploadFromPath(filePath, options = {}) {
    try {
      const {
        folder = 'eye2wear',
        public_id,
        transformation = [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      } = options;

      const uploadOptions = {
        folder: folder,
        transformation: transformation,
        resource_type: 'image',
      };

      if (public_id) {
        uploadOptions.public_id = public_id;
      }

      const result = await cloudinary.uploader.upload(filePath, uploadOptions);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    } catch (error) {
      console.error('Cloudinary path upload error:', error);
      throw new Error(`Failed to upload image from path: ${error.message}`);
    }
  }

  /**
   * Validate Cloudinary configuration
   */
  static validateConfig() {
    const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing Cloudinary configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Test Cloudinary connection
   */
  static async testConnection() {
    try {
      this.validateConfig();
      await cloudinary.api.ping();
      return { success: true, message: 'Cloudinary connection successful' };
    } catch (error) {
      return { success: false, message: `Cloudinary connection failed: ${error.message}` };
    }
  }
}

export default CloudinaryService;