'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineIssuesClose } from "react-icons/ai";
import toast from "react-hot-toast";

export interface Material {
  _id: string;
  email: string;
  type: string;
  models: string;
  reference: string;
  quantity: number;
  date: string; // Added date field
}

const UserMaterial: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchType, setSearchType] = useState<string>("");
  const [searchReference, setSearchReference] = useState<string>("");
  const [message, setMessage] = useState<string>("");
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

  const handleOpenMessageForm = () => {
    setIsEditing(true); // Set editing mode to true to show the message form
  };

  const handleSendMessage = async () => {
    try {
      const session = await getSession();
      if (!session?.user) {
        throw new Error("User is not authenticated.");
      }

      const formData = {
        email: session.user.email,
        type: selectedMaterial?.type,
        model: selectedMaterial?.models,
        reference: selectedMaterial?.reference,
        message: message,
        etat: 'en attente',
        date: new Date().toISOString(), // Add the current date
      };

      const response = await fetch("/api/reclamations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      toast.success("Message sent successfully!");
      setIsEditing(false);
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
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
    return <p>{error}</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleBackToDashboard}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
      >
        &lt; 
      </button>

      <div style={{ textAlign: "center" }}>
        <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="bg-yellow-600 rounded-full w-6 h-6 mr-2"></div>
          <div className="bg-yellow-600 rounded-full w-6 h-6 mr-2"></div>
          <div className="bg-yellow-600 rounded-full w-6 h-6 mr-2"></div>
          <AiOutlineIssuesClose className="text-6xl text-yellow-600 mt-4" />
          <div className="bg-yellow-600 rounded-full w-6 h-6 ml-2"></div>
          <div className="bg-yellow-600 rounded-full w-6 h-6 ml-2"></div>
          <div className="bg-yellow-600 rounded-full w-6 h-6 ml-2"></div>
        </h3>
        <h3>Reclamer Un Probleme Materiel</h3>
      </div>

      <div style={{ marginTop: "20px", marginBottom: "20px", marginLeft: "280px" }}>
        <input
          type="text"
          placeholder="Chercher par Type..."
          value={searchType}
          onChange={handleSearchTypeChange}
          className="px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
        />
        <input
          type="text"
          placeholder="Chercher par Reference..."
          value={searchReference}
          onChange={handleSearchReferenceChange}
          className="px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
          style={{ marginLeft: "10px" }}
        />
      </div>
      <br />
      <h3>Choisir un materiel a reclamer :</h3>
      <br />
    
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px", marginLeft: "10px" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Modele</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Reference</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Quantite</th>
            <th style={{ padding: "10px", textAlign: "left" }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map((material) => (
            <tr
              key={material._id}
              style={{ borderBottom: "1px solid #ddd", cursor: "pointer" }}
              onClick={() => handleMaterialClick(material)}
            >
              <td style={{ padding: "10px" }}>{material.type}</td>
              <td style={{ padding: "10px" }}>{material.models}</td>
              <td style={{ padding: "10px" }}>{material.reference}</td>
              <td style={{ padding: "10px" }}>{material.quantity}</td>
              <td style={{ padding: "10px" }}>&lt; </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMaterial && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "600px",
            background: "#ffffff",
            padding: "20px",
            paddingTop: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "24px" }}>Details du Materiel</h2>
            <button
              onClick={handleCloseDetails}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#aaa",
              }}
            >
              &times;
            </button>
          </div>
          <p>
            <strong>Type:</strong> {selectedMaterial.type}
          </p>
          <p>
            <strong>Modele:</strong> {selectedMaterial.models}
          </p>
          <p>
            <strong>Reference:</strong> {selectedMaterial.reference}
          </p>
          <p>
            <strong>Quantite:</strong> {selectedMaterial.quantity}
          </p>
         
          {!isEditing && (
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={handleOpenMessageForm}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Reclamer ce Materiel
              </button>
            </div>
          )}
          {isEditing && (
            <div style={{ marginTop: "20px" }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ecrire votre message ici..."
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={handleSendMessage}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                style={{ marginTop: "10px" }}
              >
                Envoyer
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                style={{ marginLeft: "10px", marginTop: "10px" }}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMaterial;
