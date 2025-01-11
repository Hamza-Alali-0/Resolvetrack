// api/reclamations/updateetat/[id]/route.js
import { NextResponse } from 'next/server';
import connect from "@/utils/db";
import Reclamation from '../../../../../models/reclamations';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { newetat: etat } = await request.json();
    await connect();

    // Prepare the update fields
    const updateFields = { etat, updateDate: new Date() };

    // Log the updateDate for debugging
    console.log("Update Date:", updateFields.updateDate);

    // Set responseDate if the new state is 'probleme resolu'
    if (etat === 'probleme resolu') {
      updateFields.responseDate = new Date();
    }

    // Find and update the reclamation
    const updatedReclamation = await Reclamation.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedReclamation) {
      return NextResponse.json({ message: "Reclamation not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reclamation updated", updatedReclamation }, { status: 200 });
  } catch (error) {
    console.error("Error updating reclamation:", error);
    return NextResponse.json({ message: "Failed to update reclamation", error: error.message }, { status: 500 });
  }
}
