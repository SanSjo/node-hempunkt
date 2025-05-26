

import Listing from '../models/Listings.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const filter = {}
    if(req.query.type) {
        filter.type = req.query.type;
    }
    if(req.query.area) {
        filter.area = req.query.area;
    }

    const listings = await Listing.find(filter);
    res.json(listings);
    });

router.post('/', auth, async (req, res) => {
const data = { ...req.body, userId: req.userId };
const listing = await Listing.create(data);
res.json(listing);
}
);  
