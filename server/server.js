const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// 1. Load environment variables with fallback
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 2. Initialize Database Connection
connectDB();

// 3. Security Middlewares
// Set comprehensive HTTP security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows cross-origin client in development
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration allowing frontend origin
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman) or matching frontend
    if (!origin || origin === CLIENT_URL || origin === 'http://127.0.0.1:5173') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not permitted by CORS policy`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};
app.use(cors(corsOptions));

// Request body parsers with payload limit to avoid large body attacks
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Sanitize request data against NoSQL query injection
app.use(
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`[Security Alert] Prohibited character sanitized in key: ${key}`);
    },
  })
);

// General rate limiter across all /api routes
app.use('/api', apiLimiter);

// 4. API Routes
app.use('/api', apiRoutes);

// Root landing route
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 AI Prompt Generator API is running',
    version: '1.0.0',
    documentation: '/api/health',
    clientUrl: CLIENT_URL,
  });
});

// 5. Centralized Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// 6. Graceful Server Start
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`⚡ AI Prompt Generator Server Active`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🌐 Allowed Client: ${CLIENT_URL}`);
  console.log(`🛡️  Security: Helmet, RateLimiter, MongoSanitize active`);
  console.log(`=========================================`);
});

// Graceful process termination handling
const handleGracefulShutdown = (signal) => {
  console.log(`\n[Process] ${signal} signal received: closing HTTP server...`);
  server.close(() => {
    console.log('[Process] HTTP server closed gracefully.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

module.exports = app;
