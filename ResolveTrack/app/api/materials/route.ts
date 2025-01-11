import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Post from '../../../models/Post';

export const GET = async () => {
  try {
    // Connect to the database
    await connect();

    // Fetch all posts excluding 'admin@gmail.com' and select only the email field
    const posts = await Post.find({ email: { $ne: 'admin@gmail.com' } }, { email: 1 }).lean();

    // Extract emails
    const emails = posts.map(post => post.email);

    return new NextResponse(JSON.stringify(emails), { status: 200 });
  } catch (error) {
    console.error('Error recuperation emails:', error);
    return new NextResponse(`Error recuperation emails: ${error}`, { status: 500 });
  }
};
