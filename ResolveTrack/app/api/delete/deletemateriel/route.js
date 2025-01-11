
import connect from "@/utils/db"; // Assuming your MongoDB connection utility path
import { NextResponse } from 'next/server';
import Material from '../../../../models/material';

export  async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");


    await connect(); // Connect to MongoDB
    await Material.findByIdAndDelete(id);
  return NextResponse.json({ message: "Poste supprimee avec succes" },{status: 200});
    

}
