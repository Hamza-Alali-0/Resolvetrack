// models/Reclamation.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IReclamation extends Document {
  email: string;
  type: string;
  models: string;
  reference: string;
  message: string;
  etat: string;
  date: Date;
  responseDate?: Date; 
  updateDate: Date;
}

const ReclamationSchema: Schema = new Schema({
  email: { type: String, required: true },
  type: { type: String, required: true },
  models: { type: String, required: true },
  reference: { type: String, required: true },
  message: { type: String, required: true },
  etat: { type: String, default: 'en attente' },
  date: { type: Date, default: Date.now },
  responseDate: { type: Date }, 
  updateDate: { type: Date, default: null }, 
});

export default mongoose.models.Reclamation || mongoose.model<IReclamation>('Reclamation', ReclamationSchema);
