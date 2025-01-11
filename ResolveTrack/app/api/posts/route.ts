import Post from "@/models/Post";
import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { email, title, fullname, centre, bureau } = await request.json();

  try {
    await connect();

    // Check if the email exists in the User database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new NextResponse("Email non trouve dans base de donnes utilisateur", { status: 400 });
    }

    // Check if a post with the same email, centre, and bureau already exists in the database
    const existingPost = await Post.findOne({ email, centre, bureau });
    if (existingPost) {
      return new NextResponse("un poste   avec cet email, centre, et bureau  existe deja", { status: 400 });
    }

    // Create and save the new post
    const newPost = new Post({
      email,
      title,
      fullname,
      centre,
      bureau,
    });

    await newPost.save();
    return new NextResponse("Poste cree avec succes", { status: 200 });

  } catch (err: any) {
    console.error('Erreur creation poste:', err);
    return new NextResponse(err.message, { status: 500 });
  }
};
