// models/Post.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
    email: string;
    title: string;
    fullname: string;
    centre: string;
    bureau: string;
    // Add more fields as needed
}

const PostSchema: Schema = new Schema({
    email: { type: String, required: true },
    title: { type: String, required: true },
    fullname: { type: String, required: true },
    centre: { type: String, required: true },
    bureau: { type: String, required: true },
    // Define other fields
});

// Ensure each post has a unique combination of centre and bureau
PostSchema.index({ centre: 1, bureau: 1 }, { unique: true });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
