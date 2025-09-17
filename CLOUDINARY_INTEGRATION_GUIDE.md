# Cloudinary Integration Documentation

## Overview
This document explains how to implement and use the Cloudinary image storage integration in the Eye2Wear application. The integration provides optimized image uploads, transformations, and storage for all image-related features.

## Prerequisites

### 1. Cloudinary Account Setup
1. Sign up for a free Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

### 2. Environment Configuration
Add the following variables to your `.env` file:

```env
# CLOUDINARY CONFIGURATION (Required for image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important**: Replace `your_cloud_name`, `your_api_key`, and `your_api_secret` with your actual Cloudinary credentials.

## Features

### 1. Automated Image Optimization
- Automatic format conversion (WebP when supported)
- Quality optimization
- Responsive image delivery
- Compression without quality loss

### 2. Image Types Supported
- **Profile Pictures**: Patient, Staff, Owner accounts
- **Product Images**: Inventory product galleries (multiple images)
- **Payment Receipts**: Order payment confirmations
- **Document Images**: Message attachments and other documents

### 3. Transformations Available
- **Thumbnail**: 150x150px, cropped to fill
- **Profile**: 300x300px, face-focused cropping
- **Product**: 500x500px, fit to container
- **Gallery**: 800x600px, fit to container
- **Default**: Auto format and quality optimization

## Implementation Guide

### Backend Implementation

#### 1. Models Updated
All models now include Cloudinary fields:

```javascript
// Example: Patient Demographics
patientprofilepicture: String,                    // Cloudinary URL
patientprofilepicture_public_id: String,         // Cloudinary public_id

// Example: Product Images
ambherinventoryproductimagepreviewimages: [String],           // Array of Cloudinary URLs
ambherinventoryproductimagepreviewimages_public_ids: [String] // Array of public_ids
```

#### 2. API Endpoints
- `POST /api/cloudinary/upload/profile` - Upload profile pictures
- `POST /api/cloudinary/upload/product-images` - Upload product images
- `POST /api/cloudinary/upload/payment-receipt` - Upload payment receipts
- `DELETE /api/cloudinary/delete/:public_id` - Delete images
- `GET /api/cloudinary/optimize` - Get optimized image URLs
- `GET /api/cloudinary/test-connection` - Test Cloudinary connection

### Frontend Implementation

#### 1. React Hook for Uploads
```jsx
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';

const MyComponent = () => {
  const { uploadProfilePicture, uploading, error } = useCloudinaryUpload();
  
  const handleUpload = async (file, userId, userType) => {
    try {
      const result = await uploadProfilePicture(file, userId, userType);
      console.log('Upload successful:', result);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };
};
```

#### 2. Image Upload Component
```jsx
import CloudinaryImageUpload from '../components/ui/CloudinaryImageUpload';

const ProfileUpload = ({ userId, userType }) => {
  return (
    <CloudinaryImageUpload
      type="profile"
      userId={userId}
      userType={userType}
      onUploadSuccess={(result) => {
        console.log('Profile picture uploaded:', result);
      }}
      onUploadError={(error) => {
        console.error('Upload error:', error);
      }}
    />
  );
};
```

#### 3. Image Display Component
```jsx
import CloudinaryImage, { CloudinaryProfilePicture } from '../components/ui/CloudinaryImage';

// Basic image display
<CloudinaryImage
  src="https://res.cloudinary.com/your-cloud/image/upload/..."
  alt="Product Image"
  optimization="product"
  width="100%"
  height="300px"
/>

// Profile picture
<CloudinaryProfilePicture
  src={user.profilePicture}
  alt={user.name}
  size="lg"
/>
```

## Usage Examples

### 1. Upload Profile Picture

**Backend Controller:**
```javascript
const result = await CloudinaryService.uploadImage(
  req.file.buffer,
  {
    folder: 'eye2wear/profiles/patient',
    public_id: `patient_${userId}_${Date.now()}`,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
);
```

**Frontend:**
```jsx
const handleProfileUpload = async (file) => {
  const result = await uploadProfilePicture(file, user.id, 'patient');
  setUser(prev => ({ ...prev, profilePicture: result.imageUrl }));
};
```

### 2. Upload Product Images

**Frontend:**
```jsx
<CloudinaryImageUpload
  type="product"
  productId={product.id}
  productType="ambher"
  multiple={true}
  maxFiles={5}
  onUploadSuccess={(result) => {
    setProduct(prev => ({
      ...prev,
      images: result.imageUrls
    }));
  }}
/>
```

### 3. Display Product Gallery

**Frontend:**
```jsx
import { CloudinaryProductGallery } from '../components/ui/CloudinaryImage';

<CloudinaryProductGallery
  images={product.images}
  alt={product.name}
  onImageClick={(image, index) => {
    // Handle image click (e.g., open lightbox)
    openLightbox(image);
  }}
/>
```

## Migration from Local Storage

### Automatic Migration Script

Run the migration script to move existing local images to Cloudinary:

```bash
node migrate-to-cloudinary.js
```

The script will:
1. Find all records with local image paths
2. Upload images to Cloudinary
3. Update database with new URLs and public_ids
4. Generate a migration log

### Manual Migration

For individual images:

```javascript
import CloudinaryService from './utils/cloudinaryService.js';

const migrateImage = async (localPath, folder, public_id) => {
  const result = await CloudinaryService.uploadFromPath(localPath, {
    folder: folder,
    public_id: public_id
  });
  
  console.log('Migrated:', result.url);
  return result;
};
```

## Security Best Practices

### 1. File Validation
- Only allow image file types
- Limit file sizes (10MB max)
- Validate file headers

### 2. Access Control
- Require authentication for uploads
- Validate user permissions
- Use signed URLs for sensitive content

### 3. Rate Limiting
- Implement upload rate limits
- Monitor API usage
- Set up alerts for unusual activity

## Performance Optimization

### 1. Image Transformations
```javascript
// Use appropriate transformations for different contexts
const optimizations = {
  thumbnail: 'w_150,h_150,c_fill,f_auto,q_auto',
  profile: 'w_300,h_300,c_fill,g_face,f_auto,q_auto',
  product: 'w_500,h_500,c_fit,f_auto,q_auto',
  gallery: 'w_800,h_600,c_fit,f_auto,q_auto'
};
```

### 2. Lazy Loading
```jsx
<CloudinaryImage
  src={imageSrc}
  loading="lazy" // Enable lazy loading
  optimization="product"
/>
```

### 3. Progressive Loading
```jsx
// Show blur placeholder while loading
<CloudinaryImage
  src={imageSrc}
  className="transition-opacity duration-300"
  onLoad={() => setImageLoaded(true)}
/>
```

## Troubleshooting

### Common Issues

#### 1. Upload Failures
```javascript
// Check Cloudinary connection
const test = await CloudinaryService.testConnection();
console.log('Connection status:', test);
```

#### 2. Invalid URLs
```javascript
// Validate Cloudinary URLs
const isValidCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};
```

#### 3. Missing Environment Variables
```javascript
// Validate configuration
try {
  CloudinaryService.validateConfig();
  console.log('Cloudinary configuration valid');
} catch (error) {
  console.error('Configuration error:', error.message);
}
```

### Debug Mode

Enable debug logging:

```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Cloudinary upload result:', result);
}
```

## API Reference

### CloudinaryService Methods

#### `uploadImage(buffer, options)`
Upload image from buffer with transformations.

#### `uploadMultipleImages(buffers, options)`
Upload multiple images concurrently.

#### `deleteImage(public_id)`
Delete image by public_id.

#### `getOptimizedUrl(public_id, type)`
Get optimized URL for existing image.

#### `testConnection()`
Test Cloudinary API connection.

### React Hook Methods

#### `useCloudinaryUpload()`
Returns upload functions and state management.

### Component Props

#### `CloudinaryImageUpload`
- `type`: Upload type ('profile', 'product', 'receipt')
- `userId/productId/orderId`: Entity ID
- `multiple`: Allow multiple files
- `onUploadSuccess/onUploadError`: Callbacks

#### `CloudinaryImage`
- `src`: Image URL
- `optimization`: Transformation type
- `fallbackSrc`: Fallback image
- `loading`: Loading strategy

## Support

For additional support:
1. Check the Cloudinary documentation: [cloudinary.com/documentation](https://cloudinary.com/documentation)
2. Review the migration logs for specific issues
3. Test the connection endpoint: `/api/cloudinary/test-connection`
4. Check browser network tab for upload errors
5. Verify environment variables are correctly set

## Performance Monitoring

Monitor Cloudinary usage:
1. Dashboard analytics in Cloudinary admin panel
2. API usage tracking
3. Image optimization metrics
4. Upload success/failure rates

The integration provides comprehensive image management with automatic optimization, secure uploads, and efficient delivery for the Eye2Wear application.