// app/api/reclamationsCount/route.ts
import { NextResponse } from 'next/server';
import connect from '../../../utils/db';
import Reclamation from '../../../models/reclamations';

export const GET = async () => {
  try {
    await connect(); // Assuming connect() establishes the database connection

    // Count specific states
    const problemeResoluCount = await Reclamation.countDocuments({ etat: 'probleme resolu' });
    const problemeNonResoluCount = await Reclamation.countDocuments({ etat: 'probleme non resolu' });

    // Total count
    const totalCount = await Reclamation.countDocuments();

    // Count for 'en attente' is calculated as total minus specific states counts
    const etatEnAttenteCount = totalCount - problemeResoluCount - problemeNonResoluCount;

    const counts = {
      etatEnAttenteCount,
      problemeNonResoluCount,
      problemeResoluCount,
    };

    return new NextResponse(JSON.stringify(counts), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error in fetching reclamation counts: ${error}`, { status: 500 });
  }
};
