/**
 * Centralized error handler middleware
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Resource not found at ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry detected';
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  }

  console.error(`[Error Handler] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
