import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
 name: String,
 email: {
   type: String,
   required: true,
   unique: true,
 },
 passwordHash: String
}, { timestamps: true });

module.exports = mongoose.model("User", usersSchema);