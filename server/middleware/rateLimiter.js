const rateLimit = require('express-rate-limit');

/**
 * Strict rate limiter for prompt generation (prevents compute abuse & spam)
 * Window: 1 minute, Max: 10 requests per IP
 */
const generateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10, // max 10 requests per IP per window
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  statusCode: 429,
  message: {
    success: false,
    error: 'Rate limit exceeded',
    message: 'Too many prompt generation requests from this IP. Please wait a minute before generating again.',
    retryAfterSeconds: 60,
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * General rate limiter for all other API endpoints
 * Window: 15 minutes, Max: 100 requests per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

module.exports = {
  generateLimiter,
  apiLimiter,
};
