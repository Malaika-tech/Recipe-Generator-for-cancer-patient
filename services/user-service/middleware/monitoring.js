const logger = require('../shared/logger');

// Request monitoring middleware
const requestMonitor = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Monitor response
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

// Error monitoring middleware
const errorMonitor = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  next(err);
};

// Health check endpoint
const healthCheck = (req, res) => {
  const health = {
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };

  logger.info('Health check', health);
  res.json(health);
};

module.exports = {
  requestMonitor,
  errorMonitor,
  healthCheck
}; 