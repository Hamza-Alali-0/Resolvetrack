// app/api/display/route.ts

import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Post from '../../../models/Post';

export const GET = async () => {
    try {
        await connect(); // Assuming connect() establishes the database connection

        const posts = await Post.find({ email: { $ne: 'admin@gmail.com' } }, { email: 1 }).lean(); // Excluding 'admin@gmail.com'

        const emails = posts.map(post => post.email);
        return new NextResponse(JSON.stringify(emails), { status: 200 });
    } catch (error) {
        return new NextResponse(`Erreur recuperation de lemail: ${error}`, { status: 500 });
    }
};
