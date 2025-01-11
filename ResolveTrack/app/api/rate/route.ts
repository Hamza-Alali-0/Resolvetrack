import mongoose from 'mongoose';
import Rating from '@/models/rating';
import connect from '@/utils/db';
import { NextResponse } from 'next/server';

export const POST = async (request: any) => {
  try {
    await connect(); // Connect to the database

    const { email, stars, message } = await request.json();

    if (!email || !stars || !message) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create a new rating instance
    const newRating = new Rating({
      email,
      stars,
      message,
      id: new mongoose.Types.ObjectId().toString(), // Generate unique ID
    });

    await newRating.save(); // Save the new rating

    return new NextResponse('Rating submitted successfully', { status: 201 });
  } catch (err: any) {
    console.error('Error saving rating:', err);
    return new NextResponse(err.message, { status: 500 });
  }
};
