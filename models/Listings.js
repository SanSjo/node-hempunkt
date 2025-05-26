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
    area:String,
    images: [string]
}, { timestamps: true });

model.exports = mongoose.model('Listing', listingSchema);