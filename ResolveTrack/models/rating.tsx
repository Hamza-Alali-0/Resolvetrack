import mongoose, { Schema, Document } from 'mongoose';

// Define the Rating interface extending Document
export interface IRating extends Document {
  email: string;
  stars: number;
  message: string;
  id: string; // Unique identifier for the rating
  date: Date;
}

// Create the Rating schema
const RatingSchema: Schema = new Schema({
  email: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 }, // Rating should be between 1 and 5 stars
  message: { type: String, required: true },
  id: { type: String, required: true, unique: true }, // Ensure id is unique
  date: { type: Date, default: Date.now }, // Default to current date if not provided
});

// Create and export the Rating model
export default mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);
