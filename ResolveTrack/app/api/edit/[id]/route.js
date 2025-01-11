import { NextResponse } from 'next/server';
import connect from "@/utils/db"; // Adjust path to your MongoDB connection utility
import Post from '../../../../models/Post'; // Adjust path to your Post model

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { newemail, newtitle, newfullname, newcentre, newbureau } = await request.json();

    await connect(); // Connect to MongoDB
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { email: newemail, title: newtitle, fullname: newfullname, centre: newcentre, bureau: newbureau },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: "Poste existe pas" }, { status: 404 });
    }

    return NextResponse.json({ message: "Poste mis a jour", updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Erreur de recuperation du poste", error);
    return NextResponse.json({ message: "Erreur ne peut pas recuperer le poste" }, { status: 500 });
  }
}
