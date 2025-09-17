import React, { useState } from 'react';
import { Image, AlertTriangle } from 'lucide-react';

/**
 * Optimized Image Display Component for Cloudinary
 */
const CloudinaryImage = ({
  src,
  alt = 'Image',
  width,
  height,
  className = '',
  optimization = 'default', // 'thumbnail', 'profile', 'product', 'gallery', 'default'
  fallbackSrc = null,
  loading = 'lazy',
  onLoad,
  onError,
  onClick,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Generate optimized Cloudinary URL based on optimization type
   */
  const getOptimizedUrl = (originalUrl, type) => {
    if (!originalUrl || originalUrl === 'default-profile-url' || !originalUrl.includes('cloudinary.com')) {
      return originalUrl;
    }

    // Extract the public_id from Cloudinary URL
    const cloudinaryRegex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
    const match = originalUrl.match(cloudinaryRegex);
    
    if (!match) {
      return originalUrl;
    }

    const publicId = match[1];
    const baseUrl = originalUrl.substring(0, originalUrl.indexOf('/upload/') + 8);

    // Define transformations for different optimization types
    const transformations = {
      thumbnail: 'w_150,h_150,c_fill,f_auto,q_auto',
      profile: 'w_300,h_300,c_fill,g_face,f_auto,q_auto',
      product: 'w_500,h_500,c_fit,f_auto,q_auto',
      gallery: 'w_800,h_600,c_fit,f_auto,q_auto',
      default: 'f_auto,q_auto'
    };

    const transformation = transformations[type] || transformations.default;
    const extension = originalUrl.split('.').pop();
    
    return `${baseUrl}${transformation}/${publicId}.${extension}`;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const optimizedSrc = getOptimizedUrl(src, optimization);
  const shouldShowFallback = imageError || !src || src === 'default-profile-url';
  const displaySrc = shouldShowFallback ? fallbackSrc : optimizedSrc;

  return (
    <div 
      className={`cloudinary-image-container relative ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      {/* Loading Placeholder */}
      {isLoading && !shouldShowFallback && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center"
          style={{ width, height }}
        >
          <Image className="h-6 w-6 text-gray-400" />
        </div>
      )}

      {/* Image or Fallback */}
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          className={`
            ${isLoading ? 'opacity-0' : 'opacity-100'} 
            transition-opacity duration-300
            ${onClick ? 'cursor-pointer' : ''}
            ${className}
          `}
          style={{ width, height }}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      ) : (
        /* Default Placeholder */
        <div 
          className={`
            bg-gray-100 border-2 border-dashed border-gray-300 
            rounded flex items-center justify-center
            ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            ${className}
          `}
          style={{ width, height }}
        >
          {imageError ? (
            <div className="flex flex-col items-center text-gray-400">
              <AlertTriangle className="h-8 w-8 mb-1" />
              <span className="text-xs">Failed to load</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <Image className="h-8 w-8 mb-1" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Profile Picture Component specifically for user profiles
 */
export const CloudinaryProfilePicture = ({
  src,
  alt = 'Profile Picture',
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  className = '',
  ...props
}) => {
  const sizeMap = {
    sm: { width: '2rem', height: '2rem' }, // 32px
    md: { width: '3rem', height: '3rem' }, // 48px
    lg: { width: '4rem', height: '4rem' }, // 64px
    xl: { width: '6rem', height: '6rem' }  // 96px
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={`rounded-full object-cover ${className}`}
      optimization="profile"
      fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23f0f0f0'/%3E%3Ccircle cx='50' cy='40' r='15' fill='%23d0d0d0'/%3E%3Cpath d='M20,80 Q50,60 80,80' fill='%23d0d0d0'/%3E%3C/svg%3E"
      {...props}
    />
  );
};

/**
 * Product Image Gallery Component
 */
export const CloudinaryProductGallery = ({
  images = [],
  alt = 'Product Image',
  className = '',
  onImageClick,
  showThumbnails = true,
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`cloudinary-product-gallery ${className}`}>
        <CloudinaryImage
          src={null}
          alt={alt}
          width="100%"
          height="400px"
          className="rounded-lg"
          optimization="product"
          {...props}
        />
      </div>
    );
  }

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  const handleMainImageClick = () => {
    onImageClick?.(images[selectedIndex], selectedIndex);
  };

  return (
    <div className={`cloudinary-product-gallery ${className}`}>
      {/* Main Image */}
      <div className="mb-4">
        <CloudinaryImage
          src={images[selectedIndex]}
          alt={`${alt} ${selectedIndex + 1}`}
          width="100%"
          height="400px"
          className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
          optimization="product"
          onClick={handleMainImageClick}
          {...props}
        />
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div
              key={index}
              className={`
                flex-shrink-0 cursor-pointer rounded-md overflow-hidden
                ${index === selectedIndex ? 'ring-2 ring-blue-500' : 'hover:opacity-75'}
              `}
              onClick={() => handleThumbnailClick(index)}
            >
              <CloudinaryImage
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                width="60px"
                height="60px"
                className="object-cover"
                optimization="thumbnail"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CloudinaryImage;