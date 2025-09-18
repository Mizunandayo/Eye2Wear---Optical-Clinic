import { useState, useCallback } from 'react';

/**
 * Custom React hook for handling Cloudinary image uploads
 */
const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadProfilePicture = useCallback(async (file, userId, userType) => {
    if (!file || !userId || !userType) {
      throw new Error('File, user ID, and user type are required');
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', userId);
      formData.append('userType', userType);

      const response = await fetch('/api/cloudinary/upload/profile', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken') || localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken') || localStorage.getItem('patienttoken') || localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadProductImages = useCallback(async (files, productId, productType) => {
    if (!files || files.length === 0 || !productId || !productType) {
      throw new Error('Files, product ID, and product type are required');
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      // Append multiple files
      Array.from(files).forEach((file) => {
        formData.append('productImages', file);
      });
      
      formData.append('productId', productId);
      formData.append('productType', productType);

      const response = await fetch('/api/cloudinary/upload/product-images', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken') || localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken') || localStorage.getItem('patienttoken') || localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadPaymentReceipt = useCallback(async (file, orderId, orderType) => {
    if (!file || !orderId || !orderType) {
      throw new Error('File, order ID, and order type are required');
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('receiptImage', file);
      formData.append('orderId', orderId);
      formData.append('orderType', orderType);

      const response = await fetch('/api/cloudinary/upload/payment-receipt', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken') || localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken') || localStorage.getItem('patienttoken') || localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Upload failed');
      }

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteImage = useCallback(async (publicId) => {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    try {
      const response = await fetch(`/api/cloudinary/delete/${publicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken') || localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken') || localStorage.getItem('patienttoken') || localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Delete failed');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const getOptimizedUrl = useCallback(async (publicId, type = 'default') => {
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    try {
      const response = await fetch(`/api/cloudinary/optimize?public_id=${encodeURIComponent(publicId)}&type=${type}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admintoken') || localStorage.getItem('stafftoken') || localStorage.getItem('ownertoken') || localStorage.getItem('patienttoken') || localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Optimization failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Optimization failed');
      }

      return result.optimizedUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const resetProgress = useCallback(() => {
    setUploadProgress(0);
  }, []);

  return {
    uploading,
    uploadProgress,
    error,
    uploadProfilePicture,
    uploadProductImages,
    uploadPaymentReceipt,
    deleteImage,
    getOptimizedUrl,
    resetError,
    resetProgress,
  };
};

export default useCloudinaryUpload;