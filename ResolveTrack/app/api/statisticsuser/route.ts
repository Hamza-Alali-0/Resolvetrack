// app/api/statisticsuser/route.ts
import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Reclamation from '../../../models/reclamations';

export const POST = async (request: Request) => {
  try {
    await connect(); // Establish database connection

    const { email } = await request.json();
    console.log(`Received email: ${email}`); // Log the email received

    if (!email) {
      return new NextResponse('User email is required', { status: 400 });
    }

    // Check if the email exists in the Reclamation database
    const userExists = await Reclamation.findOne({ email: email });
  

    if (userExists) {
      // Count specific states for the authenticated user
      const problemeResoluCount = await Reclamation.countDocuments({ etat: 'probleme resolu', email: email });
      const problemeNonResoluCount = await Reclamation.countDocuments({ etat: 'probleme non resolu', email: email });

      // Total count for the user
      const totalCount = await Reclamation.countDocuments({ email: email });
      console.log(`Total Count: ${totalCount}`);

      // Count for 'en attente' calculated as total minus specific states counts
      const etatEnAttenteCount = totalCount - problemeResoluCount - problemeNonResoluCount;
      

      const counts = {
        etatEnAttenteCount,
        problemeNonResoluCount,
        problemeResoluCount,
      };

      return new NextResponse(JSON.stringify(counts), { status: 200 });
    } else {
      return new NextResponse('Email not found in reclamations database', { status: 404 });
    }
  } catch (error) {
    console.error(`Error in fetching reclamation counts: ${error}`); // Log the error for debugging
    return new NextResponse(`Error in fetching reclamation counts: ${error}`, { status: 500 });
  }
};
