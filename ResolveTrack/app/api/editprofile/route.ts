import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const PUT = async (request: any) => {
  const { currentPassword, newPassword, email } = await request.json();

  if (!email) {
    return new NextResponse("Email est requis", { status: 400 });
  }

  await connect();

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return new NextResponse("Utilisateur non trouve", { status: 404 });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, existingUser.password);

  if (!passwordMatches) {
    return new NextResponse("mot de passe Incorrect", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 5);

  try {
    existingUser.password = hashedPassword;
    await existingUser.save();
    return new NextResponse("Mot de passe mis a jour avec succes", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
};
