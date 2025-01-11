import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/db'; 
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  email: { type: String, required: true },
  // Define other fields as needed
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

interface ExtendedRequest extends NextApiRequest {
  // Define additional properties here if needed
}

export default async function handler(req: ExtendedRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const email = req.query.email as string;

    try {
      await connect(); // Ensure MongoDB connection

      // Delete post from MongoDB
      const result = await Post.deleteOne({ email });

      if (result.deletedCount === 1) {
        res.status(204).end(); // Successful deletion
      } else {
        res.status(404).json({ message: 'Poste existe pas' });
      }
    } catch (error) {
      console.error('Erreur suppression poste:', error);
      res.status(500).json({ message: 'Erreur serveur interne' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
