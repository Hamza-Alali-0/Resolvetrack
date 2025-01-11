import connect from "@/utils/db";
import Reclamation from "@/models/reclamations";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  try {
    await connect(); // Connect to the database

    const { email, type, model, reference, message } = await request.json();

    // Check if the email exists in the User database
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new NextResponse("Email not found in users database", { status: 400 });
    }

    // Check if models field is provided
    if (!model) {
      return new NextResponse("Models field is required", { status: 400 });
    }

    // Create a new reclamation instance
    const newReclamation = new Reclamation({
      email,
      type,
      models: model, // Ensure to use correct field name in Mongoose model
      reference,
      message,
      etat: "en attente",
      date: new Date().toISOString(), // Add the current date
    });

    await newReclamation.save(); // Save the new reclamation

    return new NextResponse("Reclamation added successfully", { status: 200 });
  } catch (err: any) {
    console.error("Error saving reclamation:", err);
    return new NextResponse(err.message, { status: 500 });
  }
};
