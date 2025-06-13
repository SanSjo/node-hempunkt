import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import uploadRoutes from './routes/upload.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));

// Very important - ensure JSON body parsing is enabled with proper limits
app.use(express.json({ limit: '10mb' }));

// Request debugging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers));
  
  // Store the original end method
  const originalEnd = res.end;
  
  // Override the end method to log the response status
  res.end = function(chunk, encoding) {
    console.log(`Response status: ${res.statusCode}`);
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
});

// Body logging middleware
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);

// Test endpoint to verify server is working
app.get('/', (req, res) => {
  res.send('Server is alive');
});

// Port configuration - using 5000
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`MongoDB connected successfully`);
    app.listen(PORT, "0.0.0.0",  () => {
      console.log(`Server is running on port "0.0.0.0", ${PORT}`);
    });
}).catch((err) => {
  console.log('MongoDB connection error:', err);
});