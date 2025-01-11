// models/Material.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define an interface representing the document properties
interface IMaterial extends Document {
  email: string;
  type: string;
  models: string;
  reference: string;
  quantity: number;
}

// Define the schema
const MaterialSchema = new Schema({
  email: { type: String, required: true },
  type: { type: String, required: true },
  models: { type: String, required: true },
  reference: { type: String, required: true },
  quantity: { type: Number, required: true }
});

// Define and export the model

const Material = mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
export default Material;
