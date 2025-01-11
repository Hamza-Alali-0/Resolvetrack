import { NextResponse } from 'next/server';
import connect from '../../../../utils/db';
import reclamations from '../../../../models/reclamations';

export const GET = async () => {
    try {
        // Connect to the database
        await connect(); 

        // Fetch data from the database
        const listereclamations = await reclamations.find(); 

        return new NextResponse(JSON.stringify(listereclamations), { status: 200 });
    } catch (error) {
        console.error('Error fetching reclamations:', error);
        return new NextResponse(`Error in fetching posts: ${error}`, { status: 500 });
    }
};
