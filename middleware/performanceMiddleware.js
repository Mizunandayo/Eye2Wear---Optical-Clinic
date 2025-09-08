/**
 * Express Performance Middleware
 * Optimizes API responses for better performance
 */

/**
 * API response caching middleware
 */
export const cacheMiddleware = (duration = 300) => { // 5 minutes default
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Set cache headers
    res.set({
      'Cache-Control': `public, max-age=${duration}`,
      'ETag': `W/"${Date.now()}"`,
    });

    next();
  };
};

/**
 * Response optimization middleware
 * Adds performance headers and optimizes JSON responses
 */
export const responseOptimizationMiddleware = (req, res, next) => {
  // Track response time
  const startTime = Date.now();
  
  // Override res.json to add performance metadata
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Add performance headers
    res.set({
      'X-Response-Time': `${responseTime}ms`,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    });

    // For development, add debug info (simplified check)
    try {
      if (globalThis.process?.env?.NODE_ENV === 'development') {
        res.set('X-Debug-Query-Time', `${responseTime}ms`);
      }
    } catch {
      // Ignore if process is not available
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Request size limiting middleware
 */
export const requestLimitMiddleware = (req, res, next) => {
  // Set reasonable limits for different types of requests
  const maxSizes = {
    '/api/messages': '10mb',     // Messages with images
    '/api/patientaccount': '5mb', // Account with profile pictures
    default: '1mb'                // General API calls
  };

  const requestPath = req.path;
  let maxSize = maxSizes.default;

  // Check for specific routes
  for (const [path, size] of Object.entries(maxSizes)) {
    if (requestPath.includes(path)) {
      maxSize = size;
      break;
    }
  }

  // This would be handled by express.json() middleware with limit option
  req.maxSize = maxSize;
  next();
};

/**
 * Performance monitoring middleware
 */
export const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Log slow requests
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    if (responseTime > 1000) { // Log requests slower than 1 second
      console.warn(`🐌 Slow request: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`);
    } else if (responseTime > 500) { // Log moderately slow requests
      console.log(`⚠️ Moderate request: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`);
    }
  });
  
  next();
};

/**
 * Rate limiting for API endpoints
 */
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    for (const [ip, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      if (validTimestamps.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, validTimestamps);
      }
    }
    
    // Check current client
    const clientRequests = requests.get(clientId) || [];
    const validClientRequests = clientRequests.filter(timestamp => timestamp > windowStart);
    
    if (validClientRequests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    // Add current request
    validClientRequests.push(now);
    requests.set(clientId, validClientRequests);
    
    next();
  };
};

export default {
  cacheMiddleware,
  responseOptimizationMiddleware,
  requestLimitMiddleware,
  performanceMiddleware,
  createRateLimit
};
