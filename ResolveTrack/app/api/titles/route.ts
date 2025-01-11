// app/api/titles/route.ts

import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Post from '../../../models/Post';

export const GET = async () => {
    try {
        await connect(); // Assuming connect() establishes the database connection

        // Fetch titles of all posts
        const posts = await Post.find({}, { title: 1 }).lean(); 

        const titles = posts.map(post => post.title);
        return new NextResponse(JSON.stringify(titles), { status: 200 });
    } catch (error) {
        return new NextResponse(`Error in fetching posts: ${error}`, { status: 500 });
    }
};
