import React, { useState, useRef } from 'react';
import { Upload, X, Image, AlertCircle, CheckCircle } from 'lucide-react';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';

/**
 * Enhanced Image Upload Component for Cloudinary
 */
const CloudinaryImageUpload = ({
  type = 'profile', // 'profile', 'product', 'receipt'
  userId,
  userType,
  productId,
  productType,
  orderId,
  orderType,
  multiple = false,
  maxFiles = 5,
  onUploadSuccess,
  onUploadError,
  className = '',
  disabled = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  
  const {
    uploading,
    uploadProgress,
    error,
    uploadProfilePicture,
    uploadProductImages,
    uploadPaymentReceipt,
    resetError
  } = useCloudinaryUpload();

  const acceptedFileTypes = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }
    
    if (file.size > maxFileSize) {
      throw new Error('File size must be less than 10MB');
    }
    
    return true;
  };

  const createPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      onUploadError?.('Please select only one file');
      return;
    }

    if (multiple && files.length > maxFiles) {
      onUploadError?.(`Please select no more than ${maxFiles} files`);
      return;
    }

    try {
      // Validate all files
      files.forEach(validateFile);

      // Create previews
      const previewPromises = files.map(createPreview);
      const newPreviews = await Promise.all(previewPromises);

      setSelectedFiles(files);
      setPreviews(newPreviews);
      resetError();
    } catch (err) {
      onUploadError?.(err.message);
      setSelectedFiles([]);
      setPreviews([]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      onUploadError?.('Please select files to upload');
      return;
    }

    try {
      let result;

      switch (type) {
        case 'profile':
          if (!userId || !userType) {
            throw new Error('User ID and user type are required for profile upload');
          }
          result = await uploadProfilePicture(selectedFiles[0], userId, userType);
          break;
          
        case 'product':
          if (!productId || !productType) {
            throw new Error('Product ID and product type are required for product upload');
          }
          result = await uploadProductImages(selectedFiles, productId, productType);
          break;
          
        case 'receipt':
          if (!orderId || !orderType) {
            throw new Error('Order ID and order type are required for receipt upload');
          }
          result = await uploadPaymentReceipt(selectedFiles[0], orderId, orderType);
          break;
          
        default:
          throw new Error('Invalid upload type');
      }

      onUploadSuccess?.(result);
      setSelectedFiles([]);
      setPreviews([]);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      onUploadError?.(err.message);
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`cloudinary-upload ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload Area */}
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${disabled || uploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onClick={!disabled && !uploading ? openFileDialog : undefined}
      >
        <div className="flex flex-col items-center">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {multiple 
                  ? `Drop images here or click to select (max ${maxFiles})`
                  : 'Drop an image here or click to select'
                }
              </p>
              <p className="text-xs text-gray-400">
                Supports: JPG, PNG, GIF, WebP (max 10MB each)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </button>

                {/* File Info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-600 truncate">
                    {selectedFiles[index]?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(selectedFiles[index]?.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={uploading || disabled || selectedFiles.length === 0}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center
                ${uploading || disabled || selectedFiles.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryImageUpload;