import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
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
        res.status(500).json({ error: 'Failed to upload image' });
    }
})

export default router;