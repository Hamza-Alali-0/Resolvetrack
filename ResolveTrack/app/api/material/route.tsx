import Materiel from "@/models/material";
import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";

interface MaterialRequest {
  email: string;
  type: string;
  models: string[];
  reference: string;
  quantity: number;
}

export const POST = async (request: Request) => {
  try {
    await connect(); // Connect to the database

    // Parse the JSON body of the request
    const { email, type, models, reference, quantity }: MaterialRequest = await request.json();

    // Check if the email exists in the User database
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return new NextResponse("Email non trouve dans base de donnes utilisateur", { status: 400 });
    }

    // Create a new material instance
    const newMaterial = new Materiel({
      email,
      type,
      models,
      reference,
      quantity,
    });

    await newMaterial.save(); // Save the new material

    return new NextResponse("Material mis a jour", { status: 201 });
  } catch (err) {
    console.error("Erreur enregistrement du  material:", err);
    return new NextResponse("Erreur serveur interne", { status: 500 });
  }
};
