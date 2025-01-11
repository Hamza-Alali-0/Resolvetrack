
import connect from "@/utils/db"; 
import Post from '../../../../models/Post';
import { NextResponse } from 'next/server';

export  async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");


    await connect(); // Connect to MongoDB
    await Post.findByIdAndDelete(id);
  return NextResponse.json({ message: "Poste supprimee avec succes" },{status: 200});
    

}
