import { NextResponse } from 'next/server';
import connect from "@/utils/db"; 
import Material from '../../../../models/material';

export async function PUT(request, { params }) {
  await connect();
  const { id } = params;

  try {
    const { newemail: email, newtype: type, newmodels: models, newreference: reference, newquantity: quantity } = await request.json();
    
   

    const result = await Material.findByIdAndUpdate(id, { email, type, models, reference, quantity }, { new: true });
    
    if (!result) {
      console.error("Erreur na pas pu trouver et mettre a jour ce materiel :", id);
      return NextResponse.json({ message: "Erreur de mis a jour de ce materiel" }, { status: 400 });
    }


    return NextResponse.json({ message: "Material mis a jour", material: result }, { status: 200 });

  } catch (error) {
    console.error("Erreur lor de mis a jour de ce materiel:", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  await connect();

  try {
    const material = await Material.findOne({ _id: id });
    
    if (!material) {
      console.error("Failed to find material with ID:", id);
      return NextResponse.json({ message: "Material not found" }, { status: 404 });
    }

    return NextResponse.json({ material }, { status: 200 });
  } catch (error) {
    console.error("Error fetching material:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
