import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import uplaodRoutes from './routes/upload.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uplaodRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    }
  );    
  });
}).catch((err) => {
  console.log(err);
});