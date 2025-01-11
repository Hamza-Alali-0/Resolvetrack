// app/api/display/route.ts

import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import rating from '../../../models/rating';

export const GET = async () => {
    try {
        await connect(); // Assuming connect() establishes the database connection

        const Rating = await rating.find(); // Fetch all posts from the database

        return new NextResponse(JSON.stringify(Rating), { status: 200 });
    } catch (error) {
        return new NextResponse(`Error in fetching posts: ${error}`, { status: 500 });
    }
};
