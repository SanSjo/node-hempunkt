import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import auth from '../middleware/authMiddleware.js';
const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage });

router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Check if Cloudinary is properly configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error('Cloudinary environment variables are not properly set');
            return res.status(500).json({ error: 'Image upload service is not configured properly' });
        }
        
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(file.buffer);
        });
        
        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
})

export default router;