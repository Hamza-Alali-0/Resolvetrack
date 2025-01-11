// app/api/display/route.ts

import { NextResponse } from 'next/server';
import connect from '../../../../utils/db';
import Post from '../../../../models/Post';

export const GET = async () => {
    try {
        await connect(); // Assuming connect() establishes the database connection

        const posts = await Post.find(); // Fetch all posts from the database

        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new NextResponse(`Erreur de recuperation du poste : ${error}`, { status: 500 });
    }
};
