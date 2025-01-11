import React, { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import EditMaterialForm from "./EditmaterialForm";
import toast from "react-hot-toast";

export interface Material {
  _id: string;
  email: string;
  type: string;
  models: string;
  reference: string;
  quantity: number;
}

const MaterialList: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchModelTerm, setSearchModelTerm] = useState<string>("");
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [showModelSearch, setShowModelSearch] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/materiallist");
        const data = await response.json();
        setMaterials(data);
        setFilteredMaterials(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch materials");
        setError("Failed to fetch materials");
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    let filtered = materials;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((material) =>
        material.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchModelTerm.trim() !== "") {
      filtered = filtered.filter((material) =>
        material.models.toLowerCase().includes(searchModelTerm.toLowerCase())
      );
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, searchModelTerm, materials]);

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditing(true);
  };
  const handleSave = async (updatedMaterial: Material) => {
    try {
      const userResponse = await fetch("/api/emailt");
      if (!userResponse.ok) throw new Error("Failed to fetch User emails");
  
      const userData = await userResponse.json();
      const existingEmails = userData;
  
      if (!existingEmails.includes(updatedMaterial.email)) {
        toast.error("Email does not exist in User database");
        throw new Error("Email does not exist in User database");
      }
  
      console.log("Sending updated material data:", updatedMaterial);
  
      const response = await fetch(`/api/editmaterial/${updatedMaterial._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newemail: updatedMaterial.email,
          newtype: updatedMaterial.type,
          newmodels: updatedMaterial.models,
          newreference: updatedMaterial.reference,
          newquantity: updatedMaterial.quantity
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Material updated successfully on the server:", result.material);
  
        setMaterials((prevMaterials) =>
          prevMaterials.map((material) =>
            material._id === updatedMaterial._id ? updatedMaterial : material
          )
        );
        setIsEditing(false);
        setSelectedMaterial(null);
        toast.success("Material updated successfully");
      } else {
        throw new Error(`Failed to update material with ID: ${updatedMaterial._id}`);
      }
    } catch (error) {
      console.error("Error updating material with ID:", updatedMaterial._id, error);
      toast.error("Error updating material");
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedMaterial(null);
  };

  const handleDelete = async (materialId: string) => {
    try {
      const response = await fetch(`/api/delete/deletemateriel?id=${materialId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedMaterials = materials.filter((material) => material._id !== materialId);
        setMaterials(updatedMaterials);
        setFilteredMaterials(updatedMaterials);
        setSelectedMaterial(null);
        toast.success("Deleted material");
      } else {
        throw new Error(`Failed to delete material with ID: ${materialId}`);
      }
    } catch (error) {
      console.error(`Error deleting material with ID: ${materialId}`, error);
      toast.error("Error deleting material");
    }
  };

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
  };

  const handleCloseDetails = () => {
    setSelectedMaterial(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleModelSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchModelTerm(event.target.value);
  };

  const toggleModelSearch = () => {
    setShowModelSearch(!showModelSearch);
    setSearchModelTerm("");
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="relative p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Materiel</h1>

      <div className="mb-4 flex items-center justify-center space-x-4">
  <input
    type="text"
    placeholder="Chercher par type..."
    value={searchTerm}
    onChange={handleSearchChange}
    className="p-2 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
  />
  <button
    onClick={toggleModelSearch}
    className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm"
  >
    {showModelSearch ? "Cacher" : "Chercher par modèle ?"}
  </button>
</div>

      {showModelSearch && (
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Chercher par modèle..."
            value={searchModelTerm}
            onChange={handleModelSearchChange}
            className="p-2 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fef08a] focus:border-transparent"
          />
        </div>
      )}

      <table className="w-full border-collapse mb-4 bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-[#fef08a] text-black">
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Modèle</th>
            <th className="p-3 text-left">Référence</th>
            <th className="p-3 text-left">Quantité</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map((material, index) => (
            <tr
              key={material._id}
              className={`border-b cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
              onClick={() => handleMaterialClick(material)}
            >
              <td className="p-3">{material.type}</td>
              <td className="p-3">{material.email}</td>
              <td className="p-3">{material.models}</td>
              <td className="p-3">{material.reference}</td>
              <td className="p-3">{material.quantity}</td>
              <td className="p-3 flex space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(material);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <AiOutlineEdit className="text-2xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(material._id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete className="text-2xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMaterial && !isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">{selectedMaterial.type}</h2>
              <p><strong>Email:</strong> {selectedMaterial.email}</p>
              <p><strong>Modèle:</strong> {selectedMaterial.models}</p>
              <p><strong>Référence:</strong> {selectedMaterial.reference}</p>
              <p><strong>Quantité:</strong> {selectedMaterial.quantity}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleCloseDetails}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && selectedMaterial && (
        <EditMaterialForm
          material={selectedMaterial}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default MaterialList;
