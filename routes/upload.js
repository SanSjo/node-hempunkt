import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import auth from '../middleware/authMiddleware.js';
const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage });

router.post('/', auth, upload.single('file'), async (req, res) => {
    const file = req.file;
    const result = cloudinary.uploader.upload_stream({resource_type: 'image'}, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to upload image' });
        }
        res.json({ url: result.secure_url });
    }).end(file.buffer);
})

export default router;