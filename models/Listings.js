import mongoose, { model } from 'mongoose';

const listingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    description: String,
    address: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    type: String,
    area: String,
    images: [String]
}, { timestamps: true });

const Listings = mongoose.model('Listing', listingSchema);

export default Listings;