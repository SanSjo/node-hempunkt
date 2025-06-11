import Listing from '../models/Listings.js';
import auth from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const filter = {}
        if(req.query.type) {
            filter.type = req.query.type;
        }
        if(req.query.area) {
            filter.area = req.query.area;
        }

        const listings = await Listing.find(filter);
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const data = { ...req.body, userId: req.userId };
        const listing = await Listing.create(data);
        res.json(listing);
    } catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Failed to create listing', details: error.message });
    }
});  

export default router;
