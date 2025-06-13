import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import uploadRoutes from './routes/upload.js';

// Debug env variables (remove sensitive info in production)
console.log('Starting app with environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? 'Set (value hidden for security)' : 'NOT SET!',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set (value hidden for security)' : 'NOT SET!'
});

const app = express();

// CORS configuration - updated for production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Basic request logging for production
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);

// Root endpoint for health checks with more diagnostic info
app.get('/', (req, res) => {
  res.status(200).send({
    status: 'Server is alive',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnected: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    nodeVersion: process.version
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Server Error', 
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Port configuration - ensuring Railway can assign its own port
const PORT = process.env.PORT || 3000;

// Improved startup sequence with more detailed error handling
const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB with more explicit options
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('MongoDB connected successfully');
    
    // Port configuration for Railway - make sure to log the actual port being used
    console.log(`PORT environment variable: ${process.env.PORT || 'not set, using default'}`);
    
    // Then start the server on the specified port, binding to all interfaces (0.0.0.0)
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server URL: http://0.0.0.0:${PORT}`);
    });

    // Monitor for server listen errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Railway might have assigned a different port.`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // More detailed MongoDB connection error handling
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB. Please check:');
      console.error('1. Is your MONGO_URI environment variable set correctly?');
      console.error('2. Is your MongoDB server running?');
      console.error('3. Does your MongoDB server allow connections from this IP?');
    }
    process.exit(1); // Exit with error code
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
console.log('Initializing server...');
startServer();