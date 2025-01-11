import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Post from '../../../models/Post';

export const GET = async () => {
  try {
    await connect(); // Establish the database connection

    // Fetch all posts from the database
    const posts = await Post.find();

    // Return the posts as a JSON response
    return NextResponse.json(posts, { status: 200 });

  } catch (error) {
    console.error('Erreur de recuperation du poste', error);
    return new NextResponse(`Erreur de recuperation du poste ${error}`, { status: 500 });
  }
};
