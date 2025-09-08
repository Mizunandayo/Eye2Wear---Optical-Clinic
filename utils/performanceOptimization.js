/**
 * Performance Optimization Utilities
 * Handles lazy loading, caching, and performance monitoring
 */

/**
 * Lazy loading utility for fetching detailed order information
 * Only loads full order details when needed (e.g., viewing order details)
 */
export class LazyOrderLoader {
  static cache = new Map();
  static maxCacheSize = 50; // Limit cache to prevent memory bloat

  /**
   * Fetch detailed order information only when needed
   */
  static async fetchOrderDetails(orderId, orderType = 'ambher') {
    const cacheKey = `${orderType}_${orderId}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`📋 Loading order ${orderId} from cache`);
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`🔄 Fetching detailed info for order ${orderId}`);
      const token = localStorage.getItem('patienttoken') || localStorage.getItem('admintoken') || localStorage.getItem('stafftoken');
      
      const endpoint = orderType === 'ambher' 
        ? `/api/patientorderambher/id/${orderId}` 
        : `/api/patientorderbautista/id/${orderId}`;

      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.statusText}`);
      }

      const orderDetails = await response.json();
      
      // Add to cache with size limit
      this.addToCache(cacheKey, orderDetails);
      
      return orderDetails;
    } catch (error) {
      console.error(`❌ Error fetching order details:`, error);
      throw error;
    }
  }

  /**
   * Add item to cache with LRU eviction
   */
  static addToCache(key, value) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }

  /**
   * Clear cache for specific order
   */
  static invalidateOrder(orderId, orderType) {
    const cacheKey = `${orderType}_${orderId}`;
    this.cache.delete(cacheKey);
  }

  /**
   * Clear all cached order details
   */
  static clearCache() {
    this.cache.clear();
  }
}

/**
 * Image optimization utility for lazy loading and compression
 */
export class ImageOptimizer {
  /**
   * Create optimized image URLs for different use cases
   */
  static getOptimizedImageUrl(originalUrl, size = 'medium') {
    if (!originalUrl) return null;
    
    const sizeMap = {
      thumbnail: { width: 150, height: 150 },
      small: { width: 300, height: 300 },
      medium: { width: 600, height: 600 },
      large: { width: 1200, height: 1200 }
    };

    // For now, return original URL since we don't have image resizing service
    // In production, you'd use services like Cloudinary, ImageKit, etc.
    return originalUrl;
  }

  /**
   * Lazy load images with intersection observer
   */
  static setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      return imageObserver;
    }
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  static metrics = new Map();

  /**
   * Start timing an operation
   */
  static startTiming(operation) {
    const startTime = performance.now();
    this.metrics.set(operation, { startTime });
    return startTime;
  }

  /**
   * End timing and log results
   */
  static endTiming(operation) {
    const metric = this.metrics.get(operation);
    if (metric) {
      const endTime = performance.now();
      const duration = endTime - metric.startTime;
      
      console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`);
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`🐌 Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      this.metrics.delete(operation);
      return duration;
    }
  }

  /**
   * Monitor fetch requests
   */
  static async monitorFetch(url, options = {}) {
    const operation = `Fetch: ${url}`;
    this.startTiming(operation);
    
    try {
      const response = await fetch(url, options);
      this.endTiming(operation);
      return response;
    } catch (error) {
      this.endTiming(operation);
      throw error;
    }
  }
}

/**
 * Database query optimization hints
 */
export class QueryOptimizer {
  /**
   * Build optimized query parameters for API calls
   */
  static buildOrdersQuery({ page = 1, limit = 20, status, search, sortBy = 'newest' }) {
    const params = new URLSearchParams();
    
    params.append('page', page.toString());
    params.append('limit', Math.min(limit, 100).toString()); // Cap at 100
    
    if (status && status !== 'All') {
      params.append('status', status);
    }
    
    if (search && search.trim()) {
      params.append('search', search.trim());
    }
    
    if (sortBy) {
      params.append('sort', sortBy);
    }
    
    return params;
  }

  /**
   * Debounce search queries to reduce API calls
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

export default {
  LazyOrderLoader,
  ImageOptimizer,
  PerformanceMonitor,
  QueryOptimizer
};
