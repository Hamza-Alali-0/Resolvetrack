import React, { useState } from "react";
import { Material } from "./materialList";

interface EditMaterialFormProps {
  material: Material;
  onSave: (updatedMaterial: Material) => void;
  onCancel: () => void;
}

const EditMaterialForm: React.FC<EditMaterialFormProps> = ({ material, onSave, onCancel }) => {
  const [updatedMaterial, setUpdatedMaterial] = useState<Material>({ ...material });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedMaterial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(updatedMaterial);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Modifier le matériel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedMaterial.email}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700">
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={updatedMaterial.type}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="models" className="block text-gray-700">
              Modèle
            </label>
            <input
              type="text"
              id="models"
              name="models"
              value={updatedMaterial.models}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reference" className="block text-gray-700">
              Référence
            </label>
            <input
              type="text"
              id="reference"
              name="reference"
              value={updatedMaterial.reference}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={updatedMaterial.quantity}
              onChange={handleChange}
              className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaterialForm;
