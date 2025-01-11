'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getSession } from "next-auth/react";
import { SiLibreofficecalc } from "react-icons/si";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image'; 
import toast from "react-hot-toast";

export interface Material {
  _id: string;
  email: string;
  type: string;
  models: string;
  reference: string;
  quantity: number;
  image?: string; // Optional field for image URL
}

const UserMaterial: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchType, setSearchType] = useState<string>("");
  const [searchReference, setSearchReference] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0); // State for new quantity value
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserMaterials = async () => {
      const session = await getSession();

      if (!session?.user) {
        console.error("User is not authenticated.");
        return;
      }

      try {
        const response = await fetch(`/api/materiallist`);
        if (!response.ok) {
          throw new Error("Failed to fetch materials");
        }
        const data = await response.json();
        setMaterials(
          data.filter((material: Material) => material.email === session?.user?.email)
        );
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserMaterials();
  }, []);

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setNewQuantity(material.quantity);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedMaterial(null);
  };

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleCloseDetails = () => {
    setSelectedMaterial(null);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleSearchTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value);
  };

  const handleSearchReferenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchReference(e.target.value);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewQuantity(Number(e.target.value));
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedMaterial) {
      try {
        const response = await fetch(`/api/materials/updatematerial/${selectedMaterial._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: newQuantity }),
        });

        if (response.ok) {
          setMaterials(materials.map(material =>
            material._id === selectedMaterial._id ? { ...material, quantity: newQuantity } : material
          ));
          toast.success('Material updated successfully');
          setIsEditing(false);
          setSelectedMaterial(null);
        } else {
          const errorText = await response.text();
          console.error('Error Response:', errorText);
          throw new Error(errorText || 'Failed to update material');
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  const filteredMaterials = materials.filter((material: Material) => {
    const typeMatch = material.type.toLowerCase().includes(searchType.toLowerCase());
    const referenceMatch = material.reference.toLowerCase().includes(searchReference.toLowerCase());
    return typeMatch && referenceMatch;
  });

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="relative p-4">
      {/* Back to Dashboard Button */}
      <button
        onClick={handleBackToDashboard}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
      >
        &lt;
      </button>

      {/* Edit Profile Section */}
      <div className="text-center mt-8">
        <h3 className="flex items-center justify-center">
          <SiLibreofficecalc className="text-6xl text-yellow-600 mt-4" />
        </h3>
        <h3 className="text-xl font-semibold">Materiel</h3>
      </div>

      {/* Search Inputs */}
      <div className="mt-4 mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Chercher par Type..."
          value={searchType}
          onChange={handleSearchTypeChange}
          className="px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm mr-4"
        />
        <input
          type="text"
          placeholder="Chercher par Reference..."
          value={searchReference}
          onChange={handleSearchReferenceChange}
          className="px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
        />
      </div>

      {/* Material Table */}
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr className="border-b-2 border-yellow-600">
            <th className="px-4 py-2 text-left text-yellow-600">Type</th>
            <th className="px-4 py-2 text-left text-yellow-600">Modele</th>
            <th className="px-4 py-2 text-left text-yellow-600">Reference</th>
            <th className="px-4 py-2 text-left text-yellow-600">Quantite</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map((material) => (
            <tr
              key={material._id}
              className="border-b cursor-pointer hover:bg-yellow-50"
              onClick={() => handleMaterialClick(material)}
            >
              <td className="px-4 py-2">{material.type}</td>
              <td className="px-4 py-2">{material.models}</td>
              <td className="px-4 py-2">{material.reference}</td>
              <td className="px-4 py-2">{material.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display selected material details */}
      {selectedMaterial && !isEditing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white p-4 shadow-lg z-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-2">{selectedMaterial.type}</h2>
            <p><strong>Modele:</strong> {selectedMaterial.models}</p>
            <p><strong>Reference:</strong> {selectedMaterial.reference}</p>
            <p><strong>Quantite:</strong> {selectedMaterial.quantity}</p>
            {selectedMaterial.image && (
              <div className="mt-4">
                <Image src={selectedMaterial.image} alt="Material Image" width={300} height={200} className="rounded-lg shadow-md" />
              </div>
            )}
            <button
              onClick={handleCloseDetails}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Render EditMaterialForm if editing */}
      {selectedMaterial && isEditing && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white p-4 shadow-lg z-10">
          <form onSubmit={handleFormSubmit}>
            <h2 className="text-2xl font-semibold mb-4">Edit Material</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Type</label>
              <input
                type="text"
                value={selectedMaterial.type}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Modele</label>
              <input
                type="text"
                value={selectedMaterial.models}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Reference</label>
              <input
                type="text"
                value={selectedMaterial.reference}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantite</label>
              <input
                type="number"
                value={newQuantity}
                onChange={handleQuantityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserMaterial;
