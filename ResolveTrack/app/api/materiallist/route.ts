import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Post from '../../../models/material';

export const GET = async () => {
  try {
    // Connect to the database
    await connect();

    // Fetch all materials from the database
    const materials = await Post.find();

    return new NextResponse(JSON.stringify(materials), { status: 200 });
  } catch (error) {
    console.error('Erreur recuperation materiels:', error);
    return new NextResponse(`Erreur recuperation materiels: ${error}`, { status: 500 });
  }
};
